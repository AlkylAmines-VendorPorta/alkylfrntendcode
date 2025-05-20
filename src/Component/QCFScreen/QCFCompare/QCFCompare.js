import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import { cloneTableWidth } from "../../../Helpers/GlobalFunctions";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  validateForm,
  resetForm,
  swalWithTextBox,
  commonSubmitFormNoValidation,
  showAlertAndReload
} from "../../../Util/ActionUtil";
import {
  uploadFile,sendMailDto
  } from "../../../Util/APIUtils";
import { isEmpty, isEmptyDeep } from "../../../Util/validationUtil";
import { add,sumBy } from "lodash-es";
import {ROLE_PURCHASE_MANAGER_ADMIN } from "../../../Constants/UrlConstants";
import {ROLE_GENERAL_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_EXECUTIVE_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_CHAIRMAN_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
//import ReactToPdf from "react-to-pdf";
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import QCFAnnexure from "../QCFAnnexure/QCFAnnexure";
import {
  FormWithConstraints,
  FieldFeedbacks,
  FieldFeedback,
} from "react-form-with-constraints";
import serialize from "form-serialize";
import { getUserDto, checkIsNaN,getDecimalUpto,FixWithoutRounding,removeLeedingZeros } from "../../../Util/CommonUtil";

class QCFCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataComparing: false,
      freightColumn:false,
      pckngFwdColumn:false,
      otherChargeColumn:false,
      i:"",
      loadTableData:false,
      bidderList:[],
      priceBidList:[],
      prLineList:[],
      winnerSelectionList:[],
      splitAmountArray:[],
      totalAmountArray:[],
      calData:[],
      bidderItems:[],
      attachmentId:null,
      totals:{
        totalBasicValue:0,
        totalGrossValue:0,
        totalLandedCost:0
      },
      loadDataComparing:true,
      proposedReasonList:[
        {
            annexureId:"",
            code:"",
            description:""
            
        },      
            
    ],
    enquiry:{
      enquiryId:""
  },
    loadProposedReason:false,
    optionLoadProposedReason:false,
    annexureReasonsList: [
      // {
      //     value: "reason_1",
      //     display: "Reason 1"
      // },
      // {
      //     value: "reason_2",
      //     display: "Reason 2"
      // },
      // {
      //     value: "reason_3",
      //     display: "Reason 3"
      // },
      // {
      //     value: "reason_4",
      //     display: "Reason 4"
      // }
  ],
  approvalList:[],
  checkedgroup1:false,

  group2ApproverList:[{
  srNumber:"",
  emailAddress:"",
  group:"",
  initial:""
}],

group1ApproverList:[{
  srNumber:"",
  emailAddress:"",
  group:"",
  initial:""
}],
ccEmailList:[],
recipient:[]
    };
    this._pdfPrint = null
  }

  componentDidMount(){
    
    this.setState({
      loadTableData:true,
      dataComparing:false,
      loadProposedReason:true,
      optionLoadProposedReason:true
    })
  }

  checkDecimal =(n)=>{
    {
      var result = (n - Math.floor(n)) !== 0; 
      
     if (result)
       return n.toFixed(3);
      else
        return n;
     }
  }
  componentWillReceiveProps= props=>{
    
    if(this.state.loadTableData && !isEmpty(props.priceBidList) && !isEmpty(props.bidderList) && !isEmpty(props.prLineList)){
      // this.setPrLine(props);
      // this.setPriceBidList(props);
      let prLineList = props.prLineList.map((el)=> {
        return {...el,balanceQty:0}
      })

      let priceBidList = props.priceBidList.map((el)=> {
        return {...el,allocatedQty:0}
      })

      this.setState({
          i:props.bidderList.length,
          bidderList:props.bidderList,
          priceBidList,
          prLineList,
          loadTableData:false,
          winnerSelectionList:props.winnerSelectionList
      })

      if(this.state.loadDataComparing){
        if(this.propsValidateAnnexureApprover(props)){
          this.onLoadCompareVendorData(prLineList,priceBidList,props.bidderList,props.winnerSelectionList);
          this.setState({loadDataComparing:false})
        }
      }

    }

    if(this.state.optionLoadProposedReason && !isEmpty(props.optionProposedReasonList)){
      this.props.changeLoaderState(false);
      this.setOptionProposedReason(props);
  }

    if ( !isEmpty(props.proposedReasonList)){
      this.setProposedReason(props);
      this.props.changeLoaderState(false);
  }

  if(!isEmpty(props.priceBidList)){
    this.showorHideBidderOtherChargesColumns(props.priceBidList);
  }

  if(!isEmpty(this.props.loadApproverList)){
    let QCFApprovalGroup2List=[];
    let QCFApprovalGroup1List=[];
    props.loadApproverList.map((group)=>{
       if(group.group=="G2"){

       QCFApprovalGroup2List.push(this.getgroup2FromApproverList(group))}
       else{
           QCFApprovalGroup1List.push(this.getgroup1FromApproverList(group))
       }
   });

     this.setState({
       group2ApproverList : QCFApprovalGroup2List,
       group1ApproverList:QCFApprovalGroup1List
   });

  //   this.setApprovalList(props)
   // this.setState({loadApproverList:this.state.loadApproverList})
   }

 
  }

  setPrLine=(props)=>{

    props.prLineList.map((el)=>{
      this.state.prLineList.push({...el,balanceQty:0})
    })

  }

  addOtherAnnexure() {
    let currAnnexureList = this.state.proposedReasonList;
    let annexureArray = [
    this.getEmptyAnnexureObj()
    ];
    annexureArray = currAnnexureList.concat(annexureArray);
    this.setState({
        proposedReasonList: annexureArray,
    });
}

removeOtherAnnexure(i) {
  let otherAnnexureList = this.state.proposedReasonList;
  otherAnnexureList.splice(i, 1);
  this.setState({ proposedReasonList: otherAnnexureList });
}

setProposedReason=(props)=>{
        
  this.setState({
      proposedReasonList:props.proposedReasonList,
      loadProposedReason:false
  })
}

setOptionProposedReason=(props)=>{
        
  let proposedReasonListArray = Object.keys(props.optionProposedReasonList).map((key) => {
          return { display: props.optionProposedReasonList[key], value: key }
      });
  this.setState({
      annexureReasonsList:proposedReasonListArray,
      optionLoadProposedReason:false
  })
}

  getEmptyAnnexureObj=()=>{
        return {
            annexureId:"",
            code:"",
            description:"",
            enquiry:{
                enquiryId:""
            },
        }
    }
  setPriceBidList=(props)=>{

    props.priceBidList.map((el)=>{
      this.state.priceBidList.push({...el,allocatedQty:0})
    })

  }

  generateFirstRowHeader = () =>{
    let columns=[];
    for(var i=0;i<this.state.i;i++)
    {
     // columns.push(<><th colSpan="2"> {this.state.bidderList[i].partner.bPartnerId}<span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
     //columns.push(<><th colSpan="2"> <span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);

     columns.push(<><th colSpan="2"> {"RFQ NO: "+ this.state.bidderList[i].saprfqno}<span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
    }
    return columns;
  }
  
  generateSecondRowHeader = () =>{
    let columns = [];
    console.log("generateSecondRow header",this.state.i,columns);
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<><th>Landed Cost</th><th>Proposed Qty</th></>);
    }
    return columns;
  }

  generateSecondRowHeader2 = () =>{
    let columns = [];
    console.log("generateSecondRow header",this.state.i,columns);
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<><th>Landed Cost</th>
      <th></th>
      </>);
    }
    return columns;
  }

  getgroup2FromApproverList = (group) =>{
    return {
      group : group.group,
      srNumber:group.srNumber,
      emailAddress:group.emailAddress,
      initial:group.initial
      
    }
  }

  getgroup1FromApproverList = (group) =>{
    return {
      group : group.group,
      srNumber:group.srNumber,
      emailAddress:group.emailAddress,
      initial:group.initial
      
    }
  }

  handleCheckboxChange = event => {
    let newArray = [...this.state.ccEmailList, event.target.value];
    if (this.state.ccEmailList.includes(event.target.value)) {
      newArray = newArray.filter(list => list !== event.target.value);
    }
    this.setState({
        ccEmailList: newArray
    });
  };

  onAddCategory (value,name) {

     let recipient=[];
     recipient.push(this.getrecepientName(name));
     this.setState({checkedgroup1:true,recipient:recipient})

  };

  getrecepientName = (name) =>{
    return {
      initial:name      
    }
  }

  getSelectedRows() {
    this.setState({
      SelectedList: this.state.List.filter((e) => e.selected),
    });
  }

  sendQCFApproverMail=(event)=>{

    
    const form = event.currentTarget.form;
    let mailDto = this.getSerializedForm(form);
   

//     if(this.props.annexureStatus=="POSTED" || this.props.annexureStatus=="APPROVED"){
//         swal("The Mail Already has been sent.Would you like to Resend then please reject this annexure", {
          
//          })
//     }
//    else{



  // const doc = new jsPDF( 'p', 'pt', 'a4' ) // create jsPDF object
  // const pdfElement = document.getElementById('tableData')

  //  doc.html(pdfElement).then(e => {
  //    let blob =  
  //   //  doc.output('blob',);
  //    doc.output(
  //     "datauristring","annexure.pdf" 
  //   )
  //    let formData = new FormData();
  //    formData.append('file', blob);
  //    this.props.changeLoaderState(true)
  //    uploadFile(formData,"/rest/addAttachment").then(response => {
  //     // getFileUploadObject(component,JSON.stringify(response),statePath);
  //    this.setState({attachmentId:response.attachmentId}
  //     , () => {
  //     // commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
  //    }) 
  //    }).then(response=>{

  //   const data = new FormData();
  //   data.append('ccList',this.state.ccEmailList);
  //   data.append('recipientList',mailDto.recipientList);
  //   data.append('annexureId',mailDto.annexureId);
  //   data.append('attachmentId',this.state.attachmentId)
  //  // const qcfno=this.props.qcfno
  //  // data.append('qcfno',qcfno)
  //   sendMailDto(data,"/rest/sentQCFApprovalMail").then(response => {
  //   showAlertAndReload(!response.success,response.message);
  //               })

  //    }).catch(err => {
  //      this.props.changeLoaderState(false);
  //    });
  //   });
    
    const data = new FormData();

    let recipientName=this.state.recipient[0].initial;
   
    data.append('ccList',this.state.ccEmailList);
    data.append('recipientList',mailDto.recipientList);
    data.append('annexureId',mailDto.annexureId);
    data.append('recipientName',recipientName)
    // data.append('attachmentId',this.state.attachmentId)
   // const qcfno=this.props.qcfno
   // data.append('qcfno',qcfno)
    sendMailDto(data,"/rest/sentQCFApprovalMail").then(response => {
    showAlertAndReload(!response.success,response.message);
                })
         }
        //}

   getSerializedForm(form) {
        return serialize(form, {
           hash: true,
           empty: true
        });
     }

  compareVendorData(){
    
    let {prLineList,priceBidList,bidderList} = this.state;
    let items = [];

    prLineList.map((prListLineItem,i) => {
     return bidderList.map((bidderListItem,blIndex) => {
       return priceBidList.map((priceBidListItem,pblIndex) => {
            if(priceBidListItem.itemBid.prLine.prLineId == prListLineItem.prLineId && priceBidListItem.itemBid.bidder.bidderId == bidderListItem.bidderId){
              let allocatedQty = 0;
              // changed this line  let selectedItem = this.state.winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              let selectedItem = null;
              if(!isEmpty(this.state.winnerSelectionList) ){
                selectedItem = this.state.winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }else{
                selectedItem = this.state.priceBidList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }
              if(selectedItem) allocatedQty = selectedItem.allocatedQty;
              let exGroupPriceRate = priceBidListItem.exGroupPriceRate ? priceBidListItem.exGroupPriceRate:0;
              // let basicAmount = priceBidListItem.basicAmount ? priceBidListItem.basicAmount:0;
              let basicAmount = 300;
              let otherChargesAmt = priceBidListItem.otherChargesAmt ? priceBidListItem.otherChargesAmt:0;
              let totalOtherChargesAmt = priceBidListItem.completeOther ? priceBidListItem.completeOther:0;
              let taxAmount = priceBidListItem.taxAmount ? priceBidListItem.taxAmount:0;
              items.push({
                prLineId:prListLineItem.prLineId,
                bidderId:bidderListItem.bidderId,
                exGroupPriceRate,
                allocatedQty,
                // bidSplitPrice: allocatedQty * exGroupPriceRate,
                bidSplitPrice: priceBidListItem.netRate / priceBidListItem.itemBid.quantity * allocatedQty,// * exGroupPriceRate,
                bidGrossPrice : (Number(priceBidListItem.netRate) + Number(taxAmount) + Number(totalOtherChargesAmt)) / (priceBidListItem.itemBid.quantity ) * allocatedQty,
                bidLandedPrice: (Number(priceBidListItem.netRate) + Number(totalOtherChargesAmt) ) / (priceBidListItem.itemBid.quantity ) * allocatedQty
              })
            }
            return priceBidListItem;
        })
      })
    });
    let bidderItems = [];
    bidderList.map((bidderListItem) => {
      let item = items.filter((it) => it.bidderId == bidderListItem.bidderId);
      let splitBasicValue = 0; let splitGrossValue = 0; let splitLandedCost = 0;
      if(item){
        splitBasicValue = sumBy(item,'bidSplitPrice').toFixed(1)
        splitGrossValue = sumBy(item,'bidGrossPrice').toFixed(1)  
        splitLandedCost = sumBy(item,'bidLandedPrice').toFixed(1)
      }
      bidderItems.push({bidderId:bidderListItem.bidderId,splitBasicValue,splitGrossValue,splitLandedCost})
      return bidderListItem;
    });
    let totalBasicValue = 0; let totalGrossValue = 0; let totalLandedCost = 0;
    if(!isEmpty(bidderItems)){
      totalBasicValue = sumBy(bidderItems,'splitBasicValue')
      totalGrossValue = sumBy(bidderItems,'splitGrossValue')
      totalLandedCost = sumBy(bidderItems,'splitLandedCost')
    }
    this.setState({ dataComparing:true,calData:items,bidderItems,totals:{totalBasicValue,totalGrossValue,totalLandedCost}})
    // cloneTableWidth('tableData', 'tableResult');
  }

  onLoadCompareVendorData(prLineList,priceBidList,bidderList, winnerSelectionList){
    debugger
    // let {prLineList,priceBidList,bidderList} = props;
    let items = [];

    prLineList.map((prListLineItem,i) => {
     return bidderList.map((bidderListItem,blIndex) => {
       return priceBidList.map((priceBidListItem,pblIndex) => {
            if(priceBidListItem.itemBid.prLine.prLineId == prListLineItem.prLineId && priceBidListItem.itemBid.bidder.bidderId == bidderListItem.bidderId){
              let allocatedQty = 0;
              // changed this line  let selectedItem = this.state.winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              let selectedItem = null;
              if(!isEmpty(winnerSelectionList) ){
                selectedItem = winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }else{
                selectedItem = priceBidList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }
              if(selectedItem) allocatedQty = selectedItem.allocatedQty;
              let exGroupPriceRate = priceBidListItem.exGroupPriceRate ? priceBidListItem.exGroupPriceRate:0;
              // let basicAmount = priceBidListItem.basicAmount ? priceBidListItem.basicAmount:0;
              let basicAmount = 300;
              let otherChargesAmt = priceBidListItem.otherChargesAmt ? priceBidListItem.otherChargesAmt:0;
              let totalOtherChargesAmt = priceBidListItem.completeOther ? priceBidListItem.completeOther:0;
              let taxAmount = priceBidListItem.taxAmount ? priceBidListItem.taxAmount:0;
              items.push({
                prLineId:prListLineItem.prLineId,
                bidderId:bidderListItem.bidderId,
                exGroupPriceRate,
                allocatedQty,
                // bidSplitPrice: allocatedQty * exGroupPriceRate,
                bidSplitPrice: priceBidListItem.netRate / priceBidListItem.itemBid.quantity * allocatedQty,// * exGroupPriceRate,
                bidGrossPrice : (Number(priceBidListItem.netRate) + Number(taxAmount) + Number(totalOtherChargesAmt)) / (priceBidListItem.itemBid.quantity ) * allocatedQty,
                bidLandedPrice: (Number(priceBidListItem.netRate) + Number(totalOtherChargesAmt) ) / (priceBidListItem.itemBid.quantity ) * allocatedQty
              })
            }
            return priceBidListItem;
        })
      })
    });
    let bidderItems = [];
    bidderList.map((bidderListItem) => {
      let item = items.filter((it) => it.bidderId == bidderListItem.bidderId);
      let splitBasicValue = 0; let splitGrossValue = 0; let splitLandedCost = 0;
      if(item){
        splitBasicValue = sumBy(item,'bidSplitPrice');
        splitGrossValue = sumBy(item,'bidGrossPrice'); 
        splitLandedCost = sumBy(item,'bidLandedPrice');
      }
      bidderItems.push({bidderId:bidderListItem.bidderId,splitBasicValue,splitGrossValue,splitLandedCost})
      return bidderListItem;
    });
    let totalBasicValue = 0; let totalGrossValue = 0; let totalLandedCost = 0;
    if(!isEmpty(bidderItems)){
      totalBasicValue = sumBy(bidderItems,'splitBasicValue').toFixed(2)
      totalGrossValue = sumBy(bidderItems,'splitGrossValue').toFixed(2)
      totalLandedCost = sumBy(bidderItems,'splitLandedCost').toFixed(2)
    }
    this.setState({ dataComparing:true,calData:items,bidderItems,totals:{totalBasicValue,totalGrossValue,totalLandedCost}})
    // cloneTableWidth('tableData', 'tableResult');
  }


  generateBodyRow = (el,i) =>{
    console.log('this.state.priceBidList',this.state.priceBidList,this.state.bidderList);
    let columns = [],added="",lineIndex="",requiredQty=0,totalSplitAmount=0;
    requiredQty=el.quantity;
    for (var bid = 0; bid < this.state.i; bid++) {
      added="";totalSplitAmount=0;

      this.state.priceBidList.map((priceBid,priceBidInd)=>{
console.log('i',bid,this.state.i);
        if(this.validateBidder(this.state.bidderList[bid],priceBid,el.prLineId)){
          
            added=true;lineIndex=isEmpty(lineIndex)?0:lineIndex+1;

            if(!isEmpty(this.state.winnerSelectionList)){
              // debugger
              this.state.winnerSelectionList.map((winEl,winI)=>{
                if(this.validateWinnerSelection(winEl,el.prLineId,bid)){
                  // debugger 
                  console.log('winEl',priceBid,winEl,el)
                  el.balanceQty=priceBid.itemBid.quantity-winEl.allocatedQty;
                  totalSplitAmount = Number(priceBid.basicAmount);
                  // this.setSplitBasicAmount(totalSplitAmount,bid); 
                  {
                    let t_amount =  parseFloat(this.getLandedCost(priceBid)) * parseInt(winEl.allocatedQty)
                    el.tempAMount =  el.tempAMount ? parseFloat(el.tempAMount) + t_amount : parseFloat(t_amount)  
                  }
                  columns.push(<>
                    <td 
                    // className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}
                    >{this.getLandedCost(priceBid)}</td>
                    {/* <td className="p-0"> */}
                    {this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN?
                    <td className="col-1">
                      <input
                        type="number"
                        className={"m-0 p-0 form-control " + this.props.readonly}
                        name={"winnerSelectionSet["+winI+"][allocatedQty]"}
                        value={winEl.allocatedQty}
                        onChange={(event) => {
                          commonHandleChange(event, this, "winnerSelectionList."+winI+".allocatedQty");
                        this.setState({dataComparing:false})}}
                      />
                    </td>:<td>{winEl.allocatedQty}</td>}
                    {/* <td>
                      TEMP Value  { priceBid.tempAMount}
                    </td> */}
                    {this.getHiddenFields(priceBid,el,winI,this.state.bidderList[bid].partner.bPartnerId,winEl.allocatedQty,winEl.winnerSelectionId)}
                  </>);

                }

              })

            }else{

              // el.balanceQty=el.quantity; 
              // el.balanceQty=el.quantity - priceBid.allocatedQty + el.balanceQty;
              totalSplitAmount=priceBid.allocatedQty * Number(priceBid.basicAmount);
              // el.balanceQty=requiredQty=requiredQty-priceBid.allocatedQty;
              el.balanceQty=priceBid.itemBid.quantity-priceBid.allocatedQty;
              console.log('else el',priceBid)
              columns.push(<>
                <td 
                className={priceBid.itemBid.isLowestBid==="Y"?"":""}
                // className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}
                >{this.getLandedCost(priceBid)}</td>
                <td className="p-0">
                  <input
                    type="number"
                    className={"m-0 p-0 form-control " + this.props.readonly}
                    name={"winnerSelectionSet["+priceBidInd+"][allocatedQty]"}
                    value={priceBid.allocatedQty}
                    onChange={(event) => {
                      commonHandleChange(event, this, "priceBidList."+priceBidInd+".allocatedQty");
                    }}
                  />
                </td>
                {this.getHiddenFields(priceBid,el,priceBidInd,this.state.bidderList[bid].partner.bPartnerId,priceBid.allocatedQty)}
              </>);

            }
        }

      })

      if(!added){
        
        columns.push(<>
          <td>0</td>
          <td className="p-0">
            
          </td>
        </>);
      }
    }
    return columns;
  }


  generateBodyRow2 = (el,i) =>{
    let columns = [],added="",lineIndex="",requiredQty=0,totalSplitAmount=0;
    requiredQty=el.quantity;
    for (var bid = 0; bid < this.state.i; bid++) {
      added="";totalSplitAmount=0;

      this.state.priceBidList.map((priceBid,priceBidInd)=>{

        if(this.validateBidder(this.state.bidderList[bid],priceBid,el.prLineId)){
          
            added=true;lineIndex=isEmpty(lineIndex)?0:lineIndex+1;

            if(!isEmpty(this.state.winnerSelectionList)){
              // debugger
              this.state.winnerSelectionList.map((winEl,winI)=>{
                if(this.validateWinnerSelection(winEl,el.prLineId,bid)){
                  // debugger
                  console.log('eeee',winEl)
                  el.balanceQty=priceBid.itemBid.quantity-winEl.allocatedQty;
                  totalSplitAmount = Number(priceBid.basicAmount);
                  // this.setSplitBasicAmount(totalSplitAmount,bid); 
                  {
                    let t_amount =  parseFloat(this.getLandedCost(priceBid)) * parseInt(winEl.allocatedQty)
                    el.tempAMount =  el.tempAMount ? parseFloat(el.tempAMount) + t_amount : parseFloat(t_amount)  
                  }
                  columns.push(<>
                    <td 
                    className={priceBid.itemBid.isLowestBid==="Y"?"":""}
                    // className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}
                    >{this.getLandedCost(priceBid)}</td>
                    {/* <td className="p-0">
                      <input
                        type="number"
                        className={"m-0 p-0 form-control " + this.props.readonly}
                        name={"winnerSelectionSet["+winI+"][allocatedQty]"}
                        value={winEl.allocatedQty}
                        onChange={(event) => {
                          commonHandleChange(event, this, "winnerSelectionList."+winI+".allocatedQty");
                        this.setState({dataComparing:false})}}
                      />
                    </td> */}
                    {/* <td>
                      TEMP Value  { priceBid.tempAMount}
                    </td> */}
                    {this.getHiddenFields(priceBid,el,winI,this.state.bidderList[bid].partner.bPartnerId,winEl.allocatedQty,winEl.winnerSelectionId)}
                  </>);

                }

              })

            }else{

              // el.balanceQty=el.quantity;
              // el.balanceQty=el.quantity - priceBid.allocatedQty + el.balanceQty;
              totalSplitAmount=priceBid.allocatedQty * Number(priceBid.basicAmount);
              // el.balanceQty=requiredQty=requiredQty-priceBid.allocatedQty;
              el.balanceQty=priceBid.itemBid.quantity-priceBid.allocatedQty;
              console.log('see',priceBid);
              columns.push(<>
                <td 
                className={priceBid.itemBid.isLowestBid==="Y"?"":""}
                // className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}
                >{this.getLandedCost(priceBid)}</td>
                {/* <td className="p-0">
                  <input
                    type="number"
                    className={"m-0 p-0 form-control " + this.props.readonly}
                    name={"winnerSelectionSet["+priceBidInd+"][allocatedQty]"}
                    value={priceBid.allocatedQty}
                    onChange={(event) => {
                      commonHandleChange(event, this, "priceBidList."+priceBidInd+".allocatedQty");
                    }}
                  />
                </td> */}
                <td></td>
                {this.getHiddenFields(priceBid,el,priceBidInd,this.state.bidderList[bid].partner.bPartnerId,priceBid.allocatedQty)}
              </>);

            }
        }

      })

      if(!added){
        
        columns.push(<>
          <td>0</td>
          <td className="p-0">
            
          </td>
        </>);
      }
    }
    return columns;
  }

  setSplitBasicAmount=(totalSplitAmount,i)=>{
    let added="";
    if(!isEmpty(this.state.splitAmountArray)){
      this.state.splitAmountArray.map((el)=>{
        if(this.state.bidderList[i].bidderId===el[this.state.bidderList[i].bidderId]){
          el[this.state.bidderList[i].bidderId]=totalSplitAmount + el[this.state.bidderList[i].bidderId];
          added=true;
        }
      })
    }
    if(!added){
      let temp = {};
      temp[this.state.bidderList[i].bidderId] = totalSplitAmount;
      this.state.splitAmountArray.push(temp);
    }
  }

  generateBasicTotal = () =>{
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        <th>{this.getBidderBasicAmount(i)}</th></>);
    }
    return columns;
  }

  getBidderBasicAmount=(i)=>{
    let basicAmount = 0;
    this.state.priceBidList.forEach((priceBid)=>{
      if(priceBid.itemBid.bidder.bidderId===this.state.bidderList[i].bidderId){
        basicAmount = basicAmount + Number(priceBid.netRate);
      }
    })
    // return basicAmount;
    // return (Math.round(basicAmount*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 });
    return (Math.round(basicAmount*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 });
  }


  showorHideBidderOtherChargesColumns=(priceBidList)=>{
    priceBidList.map((priceBid)=>{
     
        if(priceBid.itemBid.bidder.totalFreightChargeAmt!="" || priceBid.totalFreightCharge!=0){
              this.setState({freightColumn:true })
        }
        if(priceBid.itemBid.bidder.totalPackingChargeAmt!="" || priceBid.totalPackingFwdChargeAmt!=0){
             this.setState({pckngFwdColumn:true })
        }
        if(priceBid.itemBid.bidder.totalOtherChargeAmt!="" || priceBid.otherChargesAmt!=0){
             this.setState({otherChargeColumn:true })
        }
      
    }
    )
   
  }

  getBidderFreightAmount=(i)=>{

   
    let columns = [];


    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        <th>{this.gettotalFeightAmount(i)}</th></>);
    }
    return columns;
  }


  gettotalFeightAmount(i){
    let totalFeightAmount=0
    this.state.priceBidList.map((priceBid)=>{
      if(priceBid.itemBid.bidder.bidderId===this.state.bidderList[i].bidderId){
      if(priceBid.itemBid.bidder.otherChargeType==="item_level"){
        totalFeightAmount=totalFeightAmount+ priceBid.totalFreightCharge
      }
      else{
        totalFeightAmount=priceBid.itemBid.bidder.totalFreightChargeAmt
      }
    }})

    return Number(totalFeightAmount);
  }

  getBidderPackingFWDAmount=(i)=>{
   
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        <th>{this.getpackingAmount(i)}</th></>);
    }
    return columns;
  }

  getpackingAmount=(i)=>{
    let totalPckingFwdAmount=0
      this.state.priceBidList.forEach((priceBid)=>{
       if(priceBid.itemBid.bidder.bidderId===this.state.bidderList[i].bidderId){
                 if(priceBid.itemBid.bidder.otherChargeType==="item_level"){
                       totalPckingFwdAmount=totalPckingFwdAmount+ priceBid.totalPackingFwdChargeAmt
                    }else{
                       totalPckingFwdAmount=priceBid.itemBid.bidder.totalPackingChargeAmt
                    }
     }})

     return Number(totalPckingFwdAmount);
  }

  getBidderOtherAmount=()=>{
   
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        <th>{this.gettotalOtherAmount(i)}</th></>);
    }
    return columns;
  }

gettotalOtherAmount(i){
  let totalOtherAmount=0
  this.state.priceBidList.forEach((priceBid)=>{
    if(priceBid.itemBid.bidder.bidderId===this.state.bidderList[i].bidderId){
        if(priceBid.itemBid.bidder.otherChargeType==="item_level"){
              totalOtherAmount=totalOtherAmount+ priceBid.otherChargesAmt
          }
      else{
         totalOtherAmount=priceBid.itemBid.bidder.totalOtherChargeAmt
          }
  }})
  return Number(totalOtherAmount);
}

  generateGrossValue = () => {
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        {/* <th>{Number(this.state.bidderList[i].grossAmt)}</th></>); */}
        {/* <th>{Number(this.state.bidderList[i].grossAmt).toFixed(2)}</th></>); */}
        {/* <th>{(Math.round(this.state.bidderList[i].grossAmt*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th></>); */}
        <th>{this.state.bidderList[i].grossAmt}</th></>);
    }
    return columns;
  }

  generateLandedCost = () => {
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
     
      let grossAmt= this.state.bidderList[i].grossAmt.replace(/,/g, "");
      let taxAmt= this.state.bidderList[i].taxAmt.replace(/,/g, ""); 
      columns.push(<>
        <th></th>
        {/* <th>{Number(this.state.bidderList[i].grossAmt)-Number(this.state.bidderList[i].taxAmt)}</th></>); */}
        {/* <th>{(Number(this.state.bidderList[i].grossAmt)-Number(this.state.bidderList[i].taxAmt)).toFixed(2)}</th></>); */}
        {/* <th>{(Math.round((Number(this.state.bidderList[i].grossAmt)-Number(this.state.bidderList[i].taxAmt))*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th></>); */}
        {/* <th>{((Math.round(Number(grossAmt-taxAmt))*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th></>); */}
        <th>{(Math.round((Number(grossAmt)-Number(taxAmt))*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th></>);
    }
    return columns;
  }

  generateSplitBasicTotal = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
    bidderList.map((bidderListItem) => {
      let item = calData.filter((it) => it.bidderId == bidderListItem.bidderId);
      let sum = sumBy(item,'bidSplitPrice')
      columns.push(<>
        <>
           <th></th>
           {/* <th>{sum.toFixed(2)}</th> */}
           {/* <th>{(Math.round(sum*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
           <th>{(Math.round(sum*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
         </>
         </>);
      return bidderListItem;
    })


    // for (var i = 0; i < this.state.i; i++) {
      // columns.push(<>
      //  <>
      //     <th></th>
      //     <th></th>
      //   </>
      //   </>);
    // }
    return columns;
  }

  generateSplitGrossValue = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
    bidderList.map((bidderListItem) => {
      let item = calData.filter((it) => it.bidderId == bidderListItem.bidderId);
      let sum = sumBy(item,'bidGrossPrice')
      columns.push(<>
        <>
           <th></th>
           {/* <th>{sum.toFixed(2)}</th> */}
           {/* <th>{(Math.round(sum*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
           <th>{(Math.round(sum*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
         </>
         </>);
      return bidderListItem;
    })
    // for (var i = 0; i < this.state.i; i++) {
    //   columns.push(<>
    //     <th></th>
    //     <th>5,09,489.00</th></>);
    // }
    return columns;
  }

  generateSplitLandedCost = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
    bidderList.map((bidderListItem) => {
      let item = calData.filter((it) => it.bidderId == bidderListItem.bidderId);
      let sum = sumBy(item,'bidLandedPrice')
      columns.push(<>
        <>
           <th></th>
           {/* <th>{sum.toFixed(2)}</th> */}
           {/* <th>{(Math.round(sum*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
           <th>{(Math.round(sum*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
         </>
         </>);
      return bidderListItem;
    })
    return columns;
  }

  generateFinalBasicTotal = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
      let bidSplitPrice = sumBy(calData,'bidSplitPrice');
      
    for (var i = 0; i < this.state.i; i++) {
      if (i + 1 === this.state.i) {
        columns.push(<>
          <th></th>
          {/* <th>{bidSplitPrice.toFixed(2)}</th> */}
          {/* <th>{(Math.round(bidSplitPrice*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
          <th>{(Math.round(bidSplitPrice*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
          </>);
      }
      else {
        columns.push(<>
          <th></th>
          <th></th></>);
      }
    }
    
    return columns;
  }

  generateFinalGrossValue = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
    let bidGrossPrice = sumBy(calData,'bidGrossPrice');
    for (var i = 0; i < this.state.i; i++) {
      if (i + 1 === this.state.i) {
        columns.push(<>
          <th></th>
          {/* <th>{bidGrossPrice.toFixed(2)}</th> */}
          {/* <th>{(Math.round(bidGrossPrice*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
          <th>{(Math.round(bidGrossPrice*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
          </>);
      }
      else {
        columns.push(<>
          <th></th>
          <th></th></>);
      }
    }
    return columns;
  }

  generateFinalLandedCost = () => {
    let columns = [];
    const {calData,bidderList} = this.state;
    let bidLandedPrice = sumBy(calData,'bidLandedPrice');
    for (var i = 0; i < this.state.i; i++) {
      if (i + 1 === this.state.i){
        columns.push(<>
          <th></th>
          <th>{(Math.round(bidLandedPrice*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
          {/* <th>{(Math.round(bidLandedPrice*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
          {/* <th>{bidLandedPrice.toFixed(2)}</th> */}
          </>);
      }
      else{
        columns.push(<>
          <th></th>
          <th></th></>);
      }
    }
    return columns;
  }

  loadPRMainContainer() {
    this.setState({
      prMainContainer: true,
      prDetailsContainer: false,
      prEnquiry: false
    });
  }
  loadPRDetails(index) {
    this.setState({
      prMainContainer: false,
      prDetailsContainer: true,
      prEnquiry: false
    });
  }
  loadPREnquiry() {
    
    this.setState({
      prMainContainer: false,
      prDetailsContainer: false,
      prEnquiry: true
    });
  }

 

  getLandedCost=(priceBid)=>{
      return parseFloat((priceBid.netRate + priceBid.completeOther) / priceBid.itemBid.quantity).toFixed(2);
  }

  validateBidder=(bidder,priceBid,prLineId)=>{
    if(bidder.bidderId===priceBid.itemBid.bidder.bidderId && prLineId===priceBid.itemBid.prLine.prLineId){
      return true;
    }
    return false;
  }

  validateWinnerSelection=(winEl,prLineId,bid)=>{
    if(winEl.itemBid.bidder.bidderId===this.state.bidderList[bid].bidderId && winEl.itemBid.prLine.prLineId===prLineId){
      return true;
    }
    return false;
  }

  getRemainingQty=(el,allocatedQty)=>{
    console.log("get REMAINGQTY",el,allocatedQty);
    return Number(el.quantity-allocatedQty);
  }

  getHiddenFields=(priceBid,el,i,bPartnerId,allocatedQty,winnerSelectionId)=>{
    return (<>
      {/* <input
            type="hidden"
            name={"winnerSelectionSet["+i+"][partner][bPartnerId]"}
            value={bPartnerId}
            disabled={isEmpty(
              priceBid.itemBid.itemBidId
            )}
        />
      <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][prLine][prLineId]"}
          value={el.prLineId}
          disabled={isEmpty(
            priceBid.itemBid.itemBidId
          )}
      />
      <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][annexure][annexureId]"}
          value={this.props.annexureId} 
          disabled={isEmpty(
            this.props.annexureId
          )}
      /> */}
      {/* <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][allocatedQty]"}
          value={allocatedQty}
      /> */}
      <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][remainingQty]"}
          value={this.getRemainingQty(el,allocatedQty)}
          // disabled={isEmpty(
          //   this.getRemainingQty(el)
          // )}
      />
      <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][itemBid][itemBidId]"}
          value={priceBid.itemBid.itemBidId}
          disabled={isEmpty(
            priceBid.itemBid.itemBidId
          )}
      />
      <input
          type="hidden"
          name={"winnerSelectionSet["+i+"][winnerSelectionId]"}
          value={winnerSelectionId}
          disabled={isEmpty(
            winnerSelectionId
          )}
      />
    </>)
  }

  getIndex = () => {
    let ind = 0;
    if (this.state.lineIndex === "") {
        ind = 0;
    } else {
        ind = parseInt(this.state.lineIndex) + 1;
    }
    this.setState({
        lineIndex: ind
    })
}

updateAnnexureReject=(value)=>{
  commonSubmitWithParam(this.props,"updateAnnexureReject","/rest/updateAnnexureReject",this.props.annexureId,value);
}

validateAnnexureApprover=()=>{
  if(ROLE_PURCHASE_MANAGER_ADMIN===this.props.role || ROLE_GENERAL_MANAGER_ADMIN===this.props.role ||ROLE_EXECUTIVE_MANAGER_ADMIN===this.props.role || ROLE_CHAIRMAN_MANAGER_ADMIN===this.props.role ){
    return true;
  }
  return false;
}

propsValidateAnnexureApprover=(props)=>{
  if(ROLE_PURCHASE_MANAGER_ADMIN===props.role || ROLE_GENERAL_MANAGER_ADMIN===props.role ||ROLE_EXECUTIVE_MANAGER_ADMIN===props.role || ROLE_CHAIRMAN_MANAGER_ADMIN===props.role ){
    return true;
  }
  return false;
}

getItemBidQuantity = (el)=>{
  let qty = 0;
  for (let index = 0; index < this.state.priceBidList.length; index++) {
    if(el.prLineId===this.state.priceBidList[index].itemBid.prLine.prLineId){
      console.log('itembid',this.state.priceBidList[index].itemBid)
      qty = this.state.priceBidList[index].itemBid.quantity;
      break;
    }
  }
  return qty;
}

generateQCF=()=>{
  commonSubmitWithParam(this.props,"generateQCF","/rest/generateQCF",this.props.pr.prId ? this.props.pr.prId:this.props.pr.enquiryId);
}



toPdf(){
  {this.props.enquiryDetails.isMailsentFinalApproval!="Y"?
  //this.generateQCFPDF()
  this.genPDF()
  //commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId,this.state.attachmentId)
  :
  commonSubmitWithParam(this.props,"update2ndtimeAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId)}
  // commonSubmitWithParam(this.props,"update2ndtimeAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId,this.props.enquiryDetails.qcfAtt)}

  // return commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
  // const pdf = new jsPDF('p', 'pt', 'a4');
  // pdf.html(this._pdfPrint).then(e => {
  //  let blob =  pdf.output('blob');
  //  let formData = new FormData();
  //  formData.append('file', blob);
  //  this.props.changeLoaderState(true)
  //  uploadFile(formData,"/rest/addAttachment").then(response => {
  //   // getFileUploadObject(component,JSON.stringify(response),statePath);
  //  this.setState({attachmentId:response.attachmentId}, () => {
  //   commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
  //  }) 
  //  }).catch(err => {
  //    this.props.changeLoaderState(false);
  //  });
  // });
}

  getBalancedQty(el){
    let currentListItem = this.state.priceBidList.find(item => item.itemBid.prLine.prLineId == el.prLineId)
    let lists =  isEmptyDeep(this.state.winnerSelectionList) ? this.state.priceBidList:this.state.winnerSelectionList;
    let seletionLists = isEmptyDeep(lists) ? []:lists.filter(item => item.itemBid.prLine.prLineId == el.prLineId)
    let totalAllocatedQty = seletionLists.reduce((sum,current) => {
      return parseFloat(current.allocatedQty) + sum;
    },0);
    console.log('getBalancedQty',el,totalAllocatedQty,currentListItem.itemBid.quantity);
    let balQty = this.checkDecimal(currentListItem.itemBid.quantity) - this.checkDecimal(totalAllocatedQty);
    return this.checkDecimal(balQty)
  }
  genPDF() {
    let filename="QuotationSS_"+this.props.enquiryId
    // html2canvas(document.querySelector(`#capture`)).then(canvas => {
    //   this.imgFile = canvas.toDataURL("image/jpeg", 1.0);
      // canvas.settings.margins.top = 1000;

      var doc = new jsPDF('l', 'pt', 'a4',true);
      // const imgProps= doc.getImageProperties(this.imgFile);
      // const pdfWidth = doc.internal.pageSize.getWidth();
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const qcfno=this.props.pr.qcfNo;
      doc.setFontSize(8);
      // doc.addImage(this.imgFile, "JPEG",5,50,pdfWidth, pdfHeight);

      doc.text("Qcf No:", 20, 20,"left");
      doc.text(qcfno, 60, 20,"left");
      doc.text("Doc No:", 450, 20,"right");
      doc.text("FORM/PUR/V/04", 530, 20,"right");
      doc.text("Issue No:", 450, 30,"right");
      doc.text("03 Date: 01.01.2022", 550, 30,"right");
      doc.text("REV No:", 450, 40,"right");
      doc.text("00 Date: 01.01.2022", 550, 40,"right");

    
      doc.autoTable({ html: '#capture',headStyles : {fillColor : [211, 211, 211],textColor:'#454545'},footStyles : {fillColor : [211, 211, 211],textColor:'#454545'},
      theme: 'grid',  margin: { top: 50},pagesplit: true})
      
      doc.autoTable({html:'#reasonList',headStyles : {fillColor : [211, 211, 211],textColor:'#454545'},theme: 'grid'})
    
      let blob =  doc.output('blob');
      let formData = new FormData();
      
      formData.append('file', blob, filename+".pdf");
      //  uploadFile(formData,"/rest/addAttachment").then(response => {
       uploadFile(formData,"/rest/SaveQCFPDF").then(response => {
        // getFileUploadObject(component,JSON.stringify(response),statePath);
       this.setState({attachmentId:response.attachmentId}
        , () => {
          commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
        //  commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId,this.state.attachmentId);
       }) 
       }).catch(err => {
         this.props.changeLoaderState(false);
       });
      // });

     // doc.save('Test.pdf');
     
    //});
  
  }
  
  render() {
    var dataCompare = this.state.dataComparing ? "display_contents":"display_none";
    var dataCompareBtn = this.state.dataComparing ? "display_block":"display_none";
    var dataNotCompare = this.state.dataComparing ? "display_none" : "display_block";
    var height = this.state.dataComparing ? 550 : 300;
    const {bidderItems,totals} = this.state;
    let isEnqOpen =  this.props.pr.code && [' Enq open'].includes(this.props.pr.code);
    return (
      <>
        <div className="card my-2">
          <>
            <input type="hidden" name='totalBasicValue' value={totals.totalBasicValue} />
            <input type="hidden" name='totalGrossValue' value={totals.totalGrossValue} />
            <input type="hidden" name='totalLandedCost' value={totals.totalLandedCost} />
           { this.state.attachmentId && <input type="hidden" name="attachmentId" value={this.state.attachmentId} /> }
          </>
          {
            // !isEmpty(bidderItems) &&
             bidderItems.map((item,i) => (
              <>
                <input type="hidden" name={`bidder[${i}][bidderId]`} value={item.bidderId} />
                <input type="hidden" name={`bidder[${i}][splitBasicValue]`} value={item.splitBasicValue} />
                <input type="hidden" name={`bidder[${i}][splitGrossValue]`} value={item.splitGrossValue} />
                <input type="hidden" name={`bidder[${i}][splitLandedCost]`} value={item.splitLandedCost} />
              </>
            ))
          }

          <div className="lineItemDiv min-height-0px">
            <div className="row px-4 py-2">
              <div className="col-sm-9"></div>
              <div className="col-sm-3">
                <input
                  type="text"
                  id="SearchTableDataInput"
                  className="form-control"
                  onKeyUp={searchTableData}
                  placeholder="Search .."
                />
              </div>
              <div className="col-sm-12 mt-2">
                <div class="table-proposed" >
                  {/* <StickyHeader height={height} className="table-responsive w-max-content"> */}
                  {/* <StickyHeader className="table-responsive w-max-content"> */}
                    <table ref={ref => this._pdfPrint = ref} id="capture" className="my-table">
                      <thead>
                        <tr>
                           {/* <th rowSpan="3">Line Item</th> */}
                           <th rowSpan="2">Serial No</th>
                           <th rowSpan="2">Material</th>
                           <th rowSpan="2">Short Text</th>
                           <th rowSpan="2">Required Qty</th>
                           
                          {/* {this.state.bidderList.map((el,i)=>
                            <th colSpan="2">Vendor Number {el.partner.bPartnerId}<span class="display_block">Code {el.partner.vendorSapCode} - Vendor Name {el.partner.name}</span></th>
                          )} */}
                          {this.generateFirstRowHeader()}
                          {!isEnqOpen && <th rowSpan="2">Balance Qty</th>}
                          {/* <th colSpan="2">Vendor Number 1<span class="display_block">Code 1- Vendor Name 1</span></th>
                          <th colSpan="2">Vendor Number 2<span class="display_block">Code 2- Vendor Name 2</span></th>
                          <th colSpan="2">Vendor Number 3<span class="display_block">Code 3- Vendor Name 3</span></th>
                          <th colSpan="2">Vendor Number 4<span class="display_block">Code 4- Vendor Name 4</span></th> */}
                        </tr>
                       {!isEnqOpen ? <tr>
                          {this.generateSecondRowHeader()}
                        </tr> :
                        <tr>
                          {this.generateSecondRowHeader2()}
                        </tr>
                        }
                      </thead>
                      <tbody id="DataTableBody">
                        {this.state.prLineList.sort((a, b) => a.prLineNumber > b.prLineNumber ? 1:-1).map((el,i)=>{
                          console.log("el",el);
                          return (
                            <tr>
                              <td>{i+1}</td>
                              <td>{el.materialCode}</td>
                              <td>{el.materialDesc}</td>
                              <td>{this.getItemBidQuantity(el)}</td> 
                              {/* {!isEnqOpen && this.generateBodyRow(el,i)} */}
                              {!isEnqOpen ? this.generateBodyRow(el,i) : this.generateBodyRow2(el,i) }
                              {/* {!isEnqOpen && <td>{el.balanceQty}  old</td> }  */}
                              {!isEnqOpen && <td>{this.getBalancedQty(el)}</td> } 
                            </tr>
                          )
                        })}
                        {/* <tr className="text-right border_top_1 border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Basic Value</th>
                          {/* <th></th> */}
                          {this.generateBasicTotal()}
                          <th></th>
                          <th></th>
                        </tr>
                        {this.state.freightColumn===true?
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Freight</th>
                         
                          {this.getBidderFreightAmount()}
                          <th></th>
                          <th></th>
                        </tr>:""}
                        {this.state.pckngFwdColumn===true?
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Packing & Fwd</th>
                          
                          {this.getBidderPackingFWDAmount()}   
                          <th></th>
                          <th></th>
                        </tr>:""}
                        {this.state.otherChargeColumn===true?
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Other Charges</th>
                        
                          {this.getBidderOtherAmount()}
                          <th></th>
                          <th></th>
                        </tr>:""}
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1 ">
                          <th></th>
                          <th></th>
                          <th>Gross Value</th>
                          {/* <th></th> */}
                          {this.generateGrossValue()}
                          <th></th>
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Landed Cost</th>
                          {/* <th></th> */}
                          {this.generateLandedCost()}
                          <th></th>
                          <th></th>
                        </tr>
                      </tbody>
                      <tfoot class={dataCompare}>                        
                        <tr>
                          <th className="border_top_1 border_bottom_1" colSpan="12"></th>
                        </tr>
                        {/* <tr className="text-right border_top_1 border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Split Basic Value</th>
                          {/* <th></th> */}
                          {this.generateSplitBasicTotal()}
                          <th></th>
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Split Gross Value</th>
                          {/* <th></th> */}
                          {this.generateSplitGrossValue()}
                          <th></th>
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Split Landed Cost</th>
                          {/* <th></th> */}
                          {this.generateSplitLandedCost()}
                          <th></th>
                          <th></th>
                        </tr>
                        <tr>
                          <th className="border_top_1 border_bottom_1 " colSpan="12"></th>
                        </tr>
                        {/* <tr className="text-right border_top_1 border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Total Basic Value</th>
                          <th></th>
                          {this.generateFinalBasicTotal()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Total Gross Value</th>
                          <th></th>
                          {this.generateFinalGrossValue()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 border_bottom_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1 border_bottom_1">
                          <th></th>
                          <th></th>
                          <th> Total Landed Cost</th>
                          <th></th>
                          {this.generateFinalLandedCost()}
                          <th></th>
                        </tr>
                      </tfoot>

                    </table>

                  
{/* {this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN && !isEmpty(this.props.pr.qcfNo)? */}
{!isEmpty(this.props.pr.qcfNo)?
    <><input
                        type="hidden"
                        name="pr[prId]"
                        value={this.props.prId}
                        disabled={isEmpty(
                          this.props.prId
                        )} />


                 <div class="table-proposed" style={{ display: 'none' }}>
                    <table id="reasonList" className="my-table">
                      <thead>
                        <tr>
                           <th rowSpan="1">Description</th>                          
                           </tr>                          
                           </thead>
                           <tbody id="DataTableBody">
                         {this.state.proposedReasonList.map((el, i) =>{
                          console.log("el",el);
                          return (
                            <tr>
                              <td>{el.description}</td>
                              </tr>
                              )})}</tbody>
                           </table>
                           </div>

                      
                        <div className="card w-95per">

                          <div className="row mt-1 px-4 py-1 ">

                            <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                              <label>Reason <span className="redspan">*</span></label>
                            </div>
                            <div className="col-6 mb-1 border_bottom_1_e0e0e0">
                              <label>Description</label>
                            </div>
                            {this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN?
                            <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                              <label>Action</label>
                            </div>:""}
                          </div>
                          <div className="row mt-1 px-4 py-1">
                            {this.state.proposedReasonList.map((el, i) => (
                              <>
                                <input
                                  type="hidden"
                                  name={"praposedReasonSet[" + i + "][praposedReasonId]"}
                                  value={el.praposedReasonId}
                                  disabled={isEmpty(
                                    el.praposedReasonId
                                  )} />

                                <div className="col-3">
                                  <select 
                                  className={"form-control " + this.props.readonly}
                                   
                                    value={el.code}
                                    name={"praposedReasonSet[" + i + "][code]"}
                                   
                                    onChange={(event) => commonHandleChange(event, this, "proposedReasonList." + i + ".code")}
                                    required={true}
                                  >
                                    <option value={""}>Select</option>
                                    {this.state.annexureReasonsList.map(records => <option value={records.value}>{records.display}</option>
                                    )}


                                    
                                  </select>
                                  <FieldFeedbacks for={"praposedReasonSet[" + i + "][code]"}>
                          <FieldFeedback when="*"></FieldFeedback>
                        </FieldFeedbacks>
                                  
                                </div>
                                <div className="col-7">
                                  <div className="form-group">
                                    <textarea
                                      className={"h-100px form-control " + this.props.readonly}
                                      value={el.description}
                                      name={"praposedReasonSet[" + i + "][description]"}
                                      onChange={(event) => {
                                        commonHandleChange(event, this, "proposedReasonList." + i + ".description");
                                      } } />
                                  </div>
                                </div>
                                {this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN?
                                <div className="col-2">
                                  <button
                                    className={"btn " +
                                      (i === 0
                                        ? "btn-outline-success"
                                        : "btn-outline-danger")}
                                    onClick={() => {
                                      i === 0
                                        ? this.addOtherAnnexure()
                                        : this.removeOtherAnnexure("" + i + "");
                                    } }
                                    type="button"
                                  >
                                    <i
                                      class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>:""}
                              </>
                            ))}



                            <input type="hidden" name="enquiry[enquiryId]" value={this.props.enquiryId}>

                            </input>

                          </div>
                          <div className="row mt-1 px-4 py-1">
                            <div className="col-12 border_top_1_e0e0e0">
                              <div className="mt-1 d-flex justify-content-center">
                              <a className={"btn btn-sm btn-outline-info mr-2 "} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
                                {/* <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.props.loadCompare()}><i className="fa fa-arrow-left" /></button> */}
                                {this.validateAnnexureApprover() ?
                                  
                                  null
                                  :
                                  <>
                                  {/* {!isEnqOpen && <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.compareVendorData()}><i className="fa fa-refresh" />&nbsp; Calculate</button>}</>} */}
                                  {!isEnqOpen  && this.props.enquiryDetails?.finalApprovalStatus!="APPROVED" && <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.compareVendorData()}><i className="fa fa-refresh" />&nbsp; Calculate</button>}</>}
                                {!this.validateAnnexureApprover() ?
                                  <>
                                  {this.state.dataComparing===true?
                                    <><button type="button"
                                        onClick={(e) => { commonSubmitFormNoValidation(e, this, "saveAnnexure", "/rest/saveAnnexure"); } }
                                        className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;Save Annexure</button>
                                        <button type="submit" className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit Annexure</button>
                                        {/* <button type="button" onClick={this.generateQCFPDF} className={"btn btn-sm btn-outline-info mr-2 " + dataCompareBtn} ><i className="fa fa-check" />&nbsp;Generate PDF</button> */}
                                        </>
                                        
:""}
                                  </>
                                  :
                                  this.props.role===ROLE_PURCHASE_MANAGER_ADMIN && this.props.enquiryDetails?.finalApprovalStatus == "REJECTED" || this.props.enquiryDetails?.isMailsentFinalApproval != 'Y' ?

                                  <><button type="button" onClick={(e) => {
                                      this.toPdf(e);
                                  } } className="btn btn-sm btn-outline-success mr-2" data-toggle="modal" data-target="#getApprovalListModal"><i className="fa fa-check" />&nbsp;Accept</button>
                                      <button type="button" onClick={(e) => {
                                          // return this.toPdf();
                                          swalWithTextBox(e, this, "updateAnnexureReject");
                                      } } className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times" />&nbsp;Reject</button>
                                  </>:""
                                  // <>
                                   
                                  // </>
                                  }

     

                              </div>
                            </div>
                          </div>

                        </div></>:""}
                  {/* </StickyHeader> */}

                  {this.props.enquiryDetails?.isMailsentFinalApproval != "Y" ?
                                <div className="modal gateEntryModal" id="getApprovalListModal">
                                    <div class="modal-dialog modal-dialog-centered modal-md">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h4 class="modal-title">Send Mail For QCF Final Approval</h4>
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            <div class={"modal-body "}>

                                                <div class="row my-2">
                                                    <div className="col-sm-12">

                                                        <div class="table-proposed">
                                                            <div className="col-sm-12 text-center mt-2 ">
                                                                <label style={{ fontSize: "20px" }}>Group 1 List</label>
                                                            </div>
                                                            <table className="my-table">
                                                                <thead class="thead-light">
                                                                    <tr>
                                                                        <th>Invite</th>
                                                                        <th>Group 1 Approver Email</th>
                                                                        <th>Group 1 Approver-Name</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody id="DataTableBodyTwo">
                                                                    {this.state.group1ApproverList.map((qcfgroup1list, index) => (
                                                                        qcfgroup1list.group === "G1" ?
                                                                            <tr>
                                                                                {<>
                                                                                    <td>

                                                                                        <input type="radio" name="recipientList"
                                                                                            value={qcfgroup1list.emailAddress}
                                                                                            // checked={this.state.checkedgroup1}
                                                                                            onChange={value => this.onAddCategory(value,qcfgroup1list.initial )} />
                                                                                    </td>
                                                                                </>}

                                                                                <td>{qcfgroup1list.emailAddress}</td>
                                                                                <td>{qcfgroup1list.initial}</td>
                                                                            </tr> : ""
                                                                    ))}
                                                                </tbody>
                                                            </table>


                                                        </div>


                                                        <div class="table-proposed">
                                                            <div className="col-sm-12 text-center mt-2 ">
                                                                <label style={{ fontSize: "20px" }}>Group 2 List</label>
                                                            </div>
                                                            <table className="my-table">
                                                                <thead class="thead-light">
                                                                    <tr>
                                                                        <th>Invite</th>
                                                                        <th>Group 2 Approver Email</th>
                                                                        <th>Group 2 Approver-Name</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody id="DataTableBodyTwo">

                                                                    {this.state.group2ApproverList.map((qcfgroup2list, i) => (
                                                                        qcfgroup2list.group === "G2" ?
                                                                            <tr>
                                                                                {<>
                                                                                    <td>

                                                                                        <input type="checkbox"


                                                                                            name={"ccList[" + i + "][emailAddress]"}
                                                                                            value={qcfgroup2list.emailAddress}
                                                                                            onClick={this.handleCheckboxChange} />
                                                                                    </td>
                                                                                </>}

                                                                                <td>{qcfgroup2list.emailAddress}</td>
                                                                                <td>{qcfgroup2list.initial}</td>
                                                                            </tr> : ""
                                                                    ))}
                                                                </tbody>
                                                            </table>


                                                        </div>
                                                        <button type="button" onClick={(this.sendQCFApproverMail)} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Send Mail</button>



                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div> : ""}
                </div>
                  <div className="w-100 justify-content-center table-proposed d-flex">

                  {/* <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={(e) =>{ this.props.loadContainer(); this.setState({dataComparing:false,loadTableData:true})}}><i className="fa fa-arrow-left" /></button>

 {this.validateAnnexureApprover()?
                   // <>
                     //<button type="button" onClick={(e)=>{ this.toPdf(e) }} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Accept</button>
                      //</><button type="button" onClick={(e)=>{
                        // return this.toPdf();
                     //  swalWithTextBox(e,this,"updateAnnexureReject");
                    //}} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Reject</button>
                   //</>
                    null
                      :
                     <>{ !isEnqOpen && <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.compareVendorData()}><i className="fa fa-refresh" />&nbsp; Calculate</button> }</>
                    } */}
                    {/* <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.compareVendorData()}><i className="fa fa-refresh" />&nbsp; Calculate</button> */}
                        {/* <button type="button" className={"btn btn-sm btn-outline-info mr-2 " + dataNotCompare} onClick={() => this.compareVendorData()}><i className="fa fa-refresh" />&nbsp; Calculate</button> */}
                    {/* {isEmpty(this.props.pr.qcfNo)*/}

                    {/* {isEmpty(this.props.pr.qcfNo) && this.props.showRFQbtn===true && this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN?
                        <td className="w-10per"> <button type="button" onClick={this.generateRFQfromSAP} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" /> Generate RFQ</button> </td>:""
                      } */}

                    {/* {isEmpty(this.props.pr.qcfNo) && this.props.showQCFbtn===true? */}
                    {isEmpty(this.props.pr.qcfNo) && this.props.showQCFbtn===true && this.props.role!=ROLE_PURCHASE_MANAGER_ADMIN?
                        <td className="w-10per"> <button type="button" onClick={this.generateQCF} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" /> Generate QCF</button> </td>
                      //:

                      //  this.props.role===ROLE_PURCHASE_MANAGER_ADMIN?
                      
                        
                      //   <button type="button" onClick={this.props.showAnnexure} className={"btn btn-sm btn-outline-info mr-2 " + dataCompareBtn} ><i className="fa fa-check" />&nbsp;Annexure</button>
                        :""
                    }
                      {/* <button type="button" onClick={(e)=>{}} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>PDF</button> */}

                      {/* <ReactToPdf targetRef={this._pdfPrint} filename="div-blue.pdf" >
        {({toPdf}) => {
          return ( */}
            {/* <button ťype="button"  className="btn btn-sm btn-outline-success mr-2" onClick={e => {
              this.toPdf()
            }}>Generate pdf</button> */}
        {/* )
        }}
    </ReactToPdf> */}

                  </div>
{/* 
                  <div className={"table-proposed dataResultBlock " + }>
                    <StickyHeader height={220} class="table-responsive w-max-content">
                      <table id="tableResult" className="table table-qcf">
                        
                      </table>
                    </StickyHeader>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.qcfCompareReducer;
};
export default connect(mapStateToProps, actionCreators)(QCFCompare);