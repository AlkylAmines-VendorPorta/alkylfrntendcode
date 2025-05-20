import React, { Component } from "react";
import { searchTableData } from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import {
  commonSubmitWithParam,
  swalWithTextBox,showAlert, showAlertAndReload
} from "../../../Util/ActionUtil";
import {
    submitToURL,
   
  } from "../../../Util/APIUtils";
import { isEmpty,isEmptyDeep } from "../../../Util/validationUtil";
import { sumBy } from "lodash-es";
import {ROLE_PURCHASE_MANAGER_ADMIN } from "../../../Constants/UrlConstants";
import {ROLE_GENERAL_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_EXECUTIVE_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_CHAIRMAN_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import Loader from "../../FormElement/Loader/LoaderWithProps";
import { TableContainer } from "@material-ui/core";


class QCFAnnexure extends Component{
    constructor(props){
        super(props);
        this.state = {
            annexureReasonsList: [

            ],
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
            optionLoadProposedReason:false
        };
    }

    componentDidMount(){

        this.setState({
            loadProposedReason:true,
            optionLoadProposedReason:true
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

    componentWillReceiveProps(props){

        if(this.state.optionLoadProposedReason && !isEmpty(props.optionProposedReasonList)){
            this.props.changeLoaderState(false);
            this.setOptionProposedReason(props);
        }
        
        if (this.state.loadProposedReason && !isEmpty(props.proposedReasonList)){
            this.setProposedReason(props);
            this.props.changeLoaderState(false);
        }
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

    setProposedReason=(props)=>{
        
        this.setState({
            proposedReasonList:props.proposedReasonList,
            loadProposedReason:false
        })
    }

    validateAnnexureApprover=()=>{
        if(ROLE_PURCHASE_MANAGER_ADMIN===this.props.role || ROLE_GENERAL_MANAGER_ADMIN===this.props.role ||ROLE_EXECUTIVE_MANAGER_ADMIN===this.props.role || ROLE_CHAIRMAN_MANAGER_ADMIN===this.props.role ){
          return true;
        }
        return false;
    }

    render(){
       
        return(
            <>
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row mt-1 px-4 py-1">
                            <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                                <label>Reason</label>
                            </div>
                            <div className="col-7 mb-1 border_bottom_1_e0e0e0">
                                <label>Description</label>
                            </div>

                        </div>
                        <div className="row mt-1 px-4 py-1 max-h-500px">
                        {this.state.proposedReasonList.map((el, i) => (
                            <>
                                <input
                                    type="hidden"
                                    name={"praposedReasonSet["+i+"][praposedReasonId]"}
                                    value={el.praposedReasonId}
                                    disabled={isEmpty(
                                        el.praposedReasonId
                                    )}
                                />
                               
                                <div className="col-3">
                                    <select className={"form-control " + this.props.readonly} 
                                        value={el.code}
                                        name={"praposedReasonSet["+i+"][code]"}
                                       
                                    >
                                        <option value={""}>Select</option>
                                        {this.state.annexureReasonsList.map(records =>
                                            <option value={records.value}>{records.display}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="col-7">
                                    <div className="form-group">
                                        <textarea
                                            className={"h-60px form-control " + this.props.readonly}
                                            value={el.description}
                                            name={"praposedReasonSet["+i+"][description]"}
                                          
                                        />
                                    </div>
                                </div>
                                <div className="col-2">

                                </div>
                                </>
                            ))}
                         
                        </div>
 
                    </div>
                </div>    
            </>
        );
    }
}

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

class QCFCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataComparing: false,
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
      isLoading:true,
      praposedReasonList:[],
      prId:null,
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
    QCFApproverList:[],
    group1EmailExist:false
    };
    this._pdfPrint = null
  }

  componentDidMount(){
    let {params} = this.props.match
    if(isEmpty(params.id)) return null;
    submitToURL(`/rest/getQCFForApproval/${params.id}`).then(({objectMap}) => { 
        let {prLineList,priceBidList,bidderList,annexureDto,winnerSelectionList,role,praposedReasonList} = objectMap;

         prLineList = prLineList.map((el)=> {
            return {...el,balanceQty:0}
          })
    
           priceBidList = priceBidList.map((el)=> {
            return {...el,allocatedQty:0}
          })
    
          this.setState({
              i:bidderList.length,
              bidderList:bidderList,
              priceBidList,
              prLineList,
              loadTableData:false,
              winnerSelectionList:winnerSelectionList,
              annexureDto,
              role,
              prId:params.id,
              isLoading:false,
              praposedReasonList:praposedReasonList
          })
    
         this.onLoadCompareVendorData(prLineList,priceBidList,bidderList,winnerSelectionList,praposedReasonList);
    
    });
   // commonSubmitWithParam(this.props, "getQCFApproverListFromSAP", "/rest/getQCFApproverListFromSAP")
   submitToURL(`/rest/getQCFApproverListFromSAP`).then(async ({objectMap}) => {
      let {QCFApproverList} = objectMap;

        let QCFApprovalGroup2List=[];
        let QCFApprovalGroup1List=[];
        QCFApproverList.map((group)=>{
           if(group.group=="G2"){
  
           QCFApprovalGroup2List.push(this.getgroup2FromApproverList(group))}
           else{
            QCFApprovalGroup1List.push(this.getgroup1FromApproverList(group))
           }
         });

         this.setState({
          group2ApproverList : QCFApprovalGroup2List,
          group1ApproverList:QCFApprovalGroup1List,
        })
        
      // await delay(500)
        
      // this.checkemail();
  })
  }

  checkemail= ()=>{
    this.state.group1ApproverList.map((group1)=>{
 
      if([group1.emailAddress].includes(this.state.annexureDto.qcf_to_mailid)){
        this.setState({
          group1EmailExist:true,
          
        })
      }
    });
   
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


  generateFirstRowHeader = () =>{
    let columns=[];
    console.log("generate First row header ",this.state.i); 
    for(var i=0;i<this.state.i;i++)
    {
      // columns.push(<><th colSpan="2"> {this.state.bidderList[i].partner.bPartnerId}<span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
      // columns.push(<><th colSpan="2"><span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
      columns.push(<><th colSpan="2"> {"RFQ NO: "+ this.state.bidderList[i].saprfqno}<span class="display_block"> {this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
    }
    return columns;
  }
  
  generateSecondRowHeader = () =>{
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<><th>Landed Cost</th><th>Proposed Qty</th></>);
    }
    return columns;
  }

  compareVendorData(){
    
    let {prLineList,priceBidList,bidderList} = this.state;
    let items = [];

    prLineList.map((prListLineItem,i) => {
     return bidderList.map((bidderListItem,blIndex) => {
       return priceBidList.map((priceBidListItem,pblIndex) => {
            if(priceBidListItem.itemBid.prLine.prLineId == prListLineItem.prLineId && priceBidListItem.itemBid.bidder.bidderId == bidderListItem.bidderId){
              let allocatedQty = 0;
              let selectedItem = null;
              if(!isEmpty(this.state.winnerSelectionList) ){
                selectedItem = this.state.winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }else{
                selectedItem = this.state.priceBidList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }
              if(selectedItem) allocatedQty = selectedItem.allocatedQty;
              let exGroupPriceRate = priceBidListItem.exGroupPriceRate ? priceBidListItem.exGroupPriceRate:0;
              let basicAmount = 300;
              let otherChargesAmt = priceBidListItem.otherChargesAmt ? priceBidListItem.otherChargesAmt:0;
              let totalOtherChargesAmt = priceBidListItem.completeOther ? priceBidListItem.completeOther:0;
              let taxAmount = priceBidListItem.taxAmount ? priceBidListItem.taxAmount:0;
              items.push({
                prLineId:prListLineItem.prLineId,
                bidderId:bidderListItem.bidderId,
                exGroupPriceRate,
                allocatedQty,
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
      totalBasicValue = sumBy(bidderItems,'splitBasicValue')
      totalGrossValue = sumBy(bidderItems,'splitGrossValue')
      totalLandedCost = sumBy(bidderItems,'splitLandedCost')
    }
    this.setState({ dataComparing:true,calData:items,bidderItems,totals:{totalBasicValue,totalGrossValue,totalLandedCost}})
  }

  onLoadCompareVendorData(prLineList,priceBidList,bidderList, winnerSelectionList){
    let items = [];

    prLineList.map((prListLineItem,i) => {
     return bidderList.map((bidderListItem,blIndex) => {
       return priceBidList.map((priceBidListItem,pblIndex) => {
            if(priceBidListItem.itemBid.prLine.prLineId == prListLineItem.prLineId && priceBidListItem.itemBid.bidder.bidderId == bidderListItem.bidderId){
              let allocatedQty = 0;
              let selectedItem = null;
              if(!isEmpty(winnerSelectionList) ){
                selectedItem = winnerSelectionList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }else{
                selectedItem = priceBidList.find((itm) => itm.itemBid.prLine.prLineId == prListLineItem.prLineId && itm.itemBid.bidder.bidderId == bidderListItem.bidderId)
              }
              if(selectedItem) allocatedQty = selectedItem.allocatedQty;
              let exGroupPriceRate = priceBidListItem.exGroupPriceRate ? priceBidListItem.exGroupPriceRate:0;
              let basicAmount = 300;
              let otherChargesAmt = priceBidListItem.otherChargesAmt ? priceBidListItem.otherChargesAmt:0;
              let totalOtherChargesAmt = priceBidListItem.completeOther ? priceBidListItem.completeOther:0;
              let taxAmount = priceBidListItem.taxAmount ? priceBidListItem.taxAmount:0;
              items.push({
                prLineId:prListLineItem.prLineId,
                bidderId:bidderListItem.bidderId,
                exGroupPriceRate,
                allocatedQty,
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
      totalBasicValue = sumBy(bidderItems,'splitBasicValue')
      totalGrossValue = sumBy(bidderItems,'splitGrossValue')
      totalLandedCost = sumBy(bidderItems,'splitLandedCost')
    }
    this.setState({ dataComparing:true,calData:items,bidderItems,totals:{totalBasicValue,totalGrossValue,totalLandedCost}})
  }


  generateBodyRow = (el,i) =>{
    let columns = [],added="",lineIndex="",requiredQty=0,totalSplitAmount=0;
    requiredQty=el.quantity;
    for (var bid = 0; bid < this.state.i; bid++) {
      added="";totalSplitAmount=0;

      this.state.priceBidList.map((priceBid,priceBidInd)=>{

        if(this.validateBidder(this.state.bidderList[bid],priceBid,el.prLineId)){
          
            added=true;lineIndex=isEmpty(lineIndex)?0:lineIndex+1;

            if(!isEmpty(this.state.winnerSelectionList)){
              this.state.winnerSelectionList.map((winEl,winI)=>{
                if(this.validateWinnerSelection(winEl,el.prLineId,bid)){
                  el.balanceQty=priceBid.itemBid.quantity-winEl.allocatedQty;
                  totalSplitAmount = Number(priceBid.basicAmount);
                  {
                    let t_amount =  parseFloat(this.getLandedCost(priceBid)) * parseInt(winEl.allocatedQty)
                    el.tempAMount =  el.tempAMount ? parseFloat(el.tempAMount) + t_amount : parseFloat(t_amount)  
                  }
                  columns.push(<>
                    <td 
                    className={priceBid.itemBid.isLowestBid==="Y"?"":""}
                    // className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}
                    >{this.getLandedCost(priceBid)}</td>
                    <td className="p-0">
                        <span>{winEl.allocatedQty}</span>
                    </td>
                  </>);

                }

              })

            }else{
              totalSplitAmount=priceBid.allocatedQty * Number(priceBid.basicAmount);
              el.balanceQty=priceBid.itemBid.quantity-priceBid.allocatedQty;
              columns.push(<>
                <td className={priceBid.itemBid.isLowestBid==="Y"?"bg-success":""}>{this.getLandedCost(priceBid)}</td>
                <td className="p-0">
                 <span>{priceBid.allocatedQty}</span>
                </td>
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
        {/* <th>{this.getBidderBasicAmount(i).toFixed(2)}</th></>); */}
        {/* <th>{(Math.round(this.getBidderBasicAmount(i)*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th></>); */}
        <th>{(Math.round(this.getBidderBasicAmount(i)*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th></>);
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
    return basicAmount;
  }

  generateGrossValue = () => {
    let columns = [];
    for (var i = 0; i < this.state.i; i++) {
      columns.push(<>
        <th></th>
        {/* <th>{Number(this.state.bidderList[i].grossAmt)}</th></>); */}
        {/* <th>{Number(this.state.bidderList[i].grossAmt).toFixed(2)}</th></>); */}
        {/* <th>{(Math.round(Number(this.state.bidderList[i].grossAmt)*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th></>); */}
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
    });
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
          {/* <th>{bidSplitPrice.toFixed(2)}</th></>); */}
          {/* <th>{(Math.round(bidSplitPrice*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th></>); */}
          <th>{(Math.round(bidSplitPrice*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th></>);
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
          {/* <th>{bidLandedPrice.toFixed(2)}</th> */}
          {/* <th>{(Math.round(bidLandedPrice*100)/100).toLocaleString('en',{ minimumFractionDigits: 2 })}</th> */}
          <th>{(Math.round(bidLandedPrice*100)/100).toLocaleString('en-IN',{ minimumFractionDigits: 2 })}</th>
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


updateAnnexureReject=(value)=>{
  // console.log("value updateannrej",value);
    let aId = this.state.annexureDto.annexureId
    this.setState({isLoading:true})
    //submitToURL(`/rest/updateAnnexureReject/${aId}/${value}`)
    submitToURL(`/rest/updateFinalAnnexureReject/${aId}/${value}`)
    .then((res) => { 
        if(!res.success){
            showAlert(true,res.message)
        }else{
          // showAlert(false,res.message)
          showAlertAndReload(false,res.message,"")
        }
        this.setState({isLoading:false})
    });
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
      qty = this.state.priceBidList[index].itemBid.quantity;
      break;
    }
  }
  return qty;
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

checkDecimal =(n)=>{
  {
    var result = (n - Math.floor(n)) !== 0; 
    
   if (result)
     return n.toFixed(3);
    else
      return n;
   }
}

toPdf(){
    let aId = this.state.annexureDto.annexureId
    this.setState({isLoading:true})
    submitToURL(`/rest/updateFinalApproval/${aId}`).then((res) => { 

      showAlertAndReload(!res.success,res.message,"")
        // if(!res.success){
        //     showAlert(true,res.message)
        // }
        this.setState({isLoading:false})
    });

}

  render() {
    // console.log("this.props",this.props);
    // console.log("this.state",this.state.annexureDto.annexureId);
    var dataCompare = this.state.dataComparing ? "display_contents":"display_none";
    var dataCompareBtn = this.state.dataComparing ? "display_block":"display_none";
    // var height = this.state.dataComparing ? 600 : 300;
    var height = this.state.dataComparing ? 'auto' : 300;
    let isEnqOpen = false;
    const group1ApproverList=this.state.group1ApproverList;
    return (
      <>
      <Loader isLoading={this.state.isLoading} />
        <div className="card my-2 wizard-v1-content">
          <div className="lineItemDiv min-height-0px">
          {/* <div className="card my-2"> */}
          <div className="col-12 d-flex justify-content-between">
                
                {/* <div class="row mt-2 justify-content-center"> */}
                <div class="row m-0 p-2 justify-content-center">
                <label>QCF No:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     {this.state.annexureDto!=null?
                      <span >{this.state.annexureDto.enquiry.qcfNo}</span>:""}
                      </div>
                      
                      <div class="row m-0 p-2 text-right">
                            <small class="col-12 col-sm-12 col-lg-12">Quotation Comparision Form</small>
                            <small class="col-6 col-sm-10 col-lg-10 px-0">DOC. NO.:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0">FORM/PUR/V/04</small>
                            <small class="col-6 col-sm-10 col-lg-10 px-0">ISSUE NO:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0"> 03 Date: 01.01.2022</small>
                            {/* <small class="col-6 col-sm-2 col-lg-2 px-0"> {formatDateWithoutTimeWithMonthName(this.props.pr.date)}</small> */}
                            <small class="col-6 col-sm-10 col-lg-10 px-0">REV NO:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0">00 Date: 01.01.2022</small>
                            {/* <small class="col-6 col-sm-2 col-lg-2 px-0">00 DT 01.01.2017</small> */}
                        </div></div>
            <div className="row px-4 py-2">
              {/* <div className="col-sm-9"></div>
              <div className="col-sm-3">
                <input
                  type="text"
                  id="SearchTableDataInput"
                  className="form-control"
                  onKeyUp={searchTableData}
                  placeholder="Search .."
                />
              </div> */}
              <div className="col-sm-12 mt-2">
              {/* <div class="table-proposed" > */}
              {/* <div class="w-100 justify-content-center table-proposed d-flex" > */}
                <div class="justify-content-center table-proposed d-flex" >
                  <TableContainer>
                    <table ref={ref => this._pdfPrint = ref} id="tableData" className="my-table">
                      <thead>
                        <tr>
                          
                           <th rowSpan="3">Serial No</th>
                           <th rowSpan="3">Material</th>
                           <th rowSpan="3">Short Text</th>
                           <th rowSpan="3">Required Qty</th>
                           
                         {this.generateFirstRowHeader()}
                          {!isEnqOpen && <th rowSpan="3">Balance Qty</th>}
                        </tr>
                       {!isEnqOpen && <tr>
                          {this.generateSecondRowHeader()}
                        </tr>
                        }
                      </thead>
                      <tbody id="DataTableBody">
                        {this.state.prLineList.map((el,i)=>{
                          return (
                            <tr>
                              <td>{i+1}</td>
                              <td>{el.materialCode}</td>
                              <td>{el.materialDesc}</td>
                              <td>{this.getItemBidQuantity(el)}</td>
                              {!isEnqOpen && this.generateBodyRow(el,i)}
                              {!isEnqOpen && <td>{this.getBalancedQty(el)}</td> }
                              {/* {!isEnqOpen && <td>{el.balanceQty}</td> } */}
                            </tr>
                          )
                        })}
                        {/* <tr className="text-right border_top_1 border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_top_1 border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Basic Value</th>
                          <th></th>
                          {this.generateBasicTotal()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Gross Value</th>
                          <th></th>
                          {this.generateGrossValue()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th>Landed Cost</th>
                          <th></th>
                          {this.generateLandedCost()}
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
                          <th></th>
                          {this.generateSplitBasicTotal()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Split Gross Value</th>
                          <th></th>
                          {this.generateSplitGrossValue()}
                          <th></th>
                        </tr>
                        {/* <tr className="text-right border_left_1 border_right_1 resultant_data"> */}
                        <tr className="text-right border_left_1 border_right_1">
                          <th></th>
                          <th></th>
                          <th> Split Landed Cost</th>
                          <th></th>
                          {this.generateSplitLandedCost()}
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
                  </TableContainer>

                </div>
                <div className="left d-flex" >
                {/* <div className="row mt-1 px-4 py-1"> */}
                <div >
                                    <label>Description</label>
                                </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <div className="row mt-10 px-4 py-1">
                                {this.state.praposedReasonList?.map((el, i) => (<> 

           
         {/* <div className="form-group"> */}
         <div className="col-7">
         <textarea
        className={"h-60px form-control " + this.props.readonly} cols="100"
        value={el.description}
        name={"praposedReasonSet[" + i + "][description]"}
        /></div>
{/* </div> */}
</> ))}

                </div>
                {/* </div> */}
                {/* <div className="row mt-1 px-4 py-1">
                                <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                                    <label>Reason</label>
                                </div>
                                <div className="col-7 mb-1 border_bottom_1_e0e0e0">
                                    <label>Description</label>
                                </div>
                              
                            </div>
                            <div className="row mt-1 px-4 py-1 max-h-500px">
                                {this.state.praposedReasonList?.map((el, i) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name={"praposedReasonSet[" + i + "][praposedReasonId]"}
                                            value={el.praposedReasonId}
                                            disabled={isEmpty(
                                                el.praposedReasonId
                                            )} />

                                       
                                        <div className="col-3">
                                            <select className={"form-control " + this.props.readonly}
                                                value={el.code}
                                                name={"praposedReasonSet[" + i + "][code]"}
                                               
                                            >
                                                <option value={el.code}>{el.code}</option>
                                               
                                            </select>
                                        </div>
                                        <div className="col-7">
                                            <div className="form-group">
                                                <textarea
                                                    className={"h-60px form-control " + this.props.readonly}
                                                    value={el.description}
                                                    name={"praposedReasonSet[" + i + "][description]"}
                                                    />
                                            </div>
                                        </div>
                                        
                                    </>
                                ))}





                            </div>*/}
                            </div>
<div className="right" style={{textAlign:'center'}}>
                            <>

                    {
                      // this.state.annexureDto && this.state.annexureDto.annexureId?
                      this.state.annexureDto && this.state.annexureDto.annexureId && this.state.annexureDto.enquiry?.finalApprovalStatus!="APPROVED" && this.state.annexureDto.enquiry?.isMailsentFinalApproval==="Y"?
                    <>
                      <button type="button" onClick={(e)=>{ this.toPdf(e) }} className="btn btn-lg btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Accept</button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button type="button" onClick={(e)=>{
                        swalWithTextBox(e,this,"updateAnnexureReject");
                    }} className="btn btn-lg btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Reject</button>
                    </>
                    :null
                    }
                    
                    </></div>
                            
                            {/* </div> */}
                            


                {/* <QCFAnnexure 
                            // optionProposedReasonList={this.props.optionProposedReasonList}
                            // prId={this.state.pr.prId}
                            loadCompare={this.loadCompare}
                            annexureId={38}
                            // proposedReasonList={this.props.proposedReasonList}
                            enquiryId={38}
                            role={this.state.role}
                        /> */}

                  {/* <div className="w-100 justify-content-center table-proposed d-flex">

                  <>
                    {
                      // this.state.annexureDto && this.state.annexureDto.annexureId?
                      this.state.annexureDto && this.state.annexureDto.annexureId && this.state.annexureDto.enquiry?.finalApprovalStatus!="APPROVED"?
                    <>
                      <button type="button" onClick={(e)=>{ this.toPdf(e) }} className="btn btn-lg btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Accept</button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button type="button" onClick={(e)=>{
                        swalWithTextBox(e,this,"updateAnnexureReject");
                    }} className="btn btn-lg btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Reject</button>
                    </>
                    :null
                    }
                    </> */}

                  

               {/* <button type="button" onClick={this.props.showAnnexure} className={"btn btn-sm btn-outline-primary mr-2 "+dataCompareBtn}><i className="fa fa-check" />&nbsp;Next</button> */}
           

                  {/* </div> */}

              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default QCFCompare;