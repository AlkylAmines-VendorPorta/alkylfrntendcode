import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import MiroMainBody from "./MiroBody";
import InvoiceList from "./InvoiceList/InvoiceList";
import "../../css/dashboard.css";
import { commonSubmitWithParam } from "../../Util/ActionUtil";
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./Action";
import {connect} from 'react-redux';
import { formatDateWithoutTimeWithMonthName } from "../../Util/DateUtil";
import { isServicePO } from "../../Util/AlkylUtil";
import { removeLeedingZeros } from "../../Util/CommonUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
class MiroContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading:false,
        showList : true,
        asnList : [],
        loadASNList:false,
        loadASNLineList:false,
        loadServiceLineList:false,
        loadRole : false,
        loadInvoiceBytes:false,
        asnDetails:{
           serviceSheetNo:"",
          asnId:"",
          asnNumber:"",
          po : "",
          plant:"",
          invoiceNo:"",
          invoiceDate:"",
          invoiceAmount:"",
          loadingCharges : "",
          mismatchAmount:"",
          deliveryNoteNo:"",
          deliveryNoteDate:"",
          lrDate:"",
          lrNumber:"",
          transporterNo:"",
          vehicalNo:"",
          eWayBillNo:"",
          grossWeight:"",
          tareWeight:"",
          numberOfPackages:"",
          isCOA:"",
          isPackingList:"",
          typeOfPackingBulk:"",
          remarks:"",
          basicAmount:"",
          freightCharges:"",
          packingCharges:"",
          sgst:"",
          cgst:"",
          igst:"",
          tcs:"",
          roundOffAmount:'',
          roundOffValue:'',
          invoiceDoc:{
             attachmentId : "",
             fileName : ""
          },
          deliveryNoteDoc:{
             attachmentId : "",
             fileName : ""
          },
          nameOfDriver : "",
          mobileNumber : "",
          photoIdProof : "",
          status : "",
          irn : "",
          invoiceApplicable:true,
          withHoldingTax : ""
        },
        asnLines : [],
        serviceLines : [],
        invoice : "",
        glMasterList:[],
        withHoldingTaxList:[],
    }
  }

  loadASN = (asn) => {
     let attId = !isEmpty(asn.invoiceDoc.attachmentId)?asn.invoiceDoc.attachmentId:asn.deliveryNoteDoc.attachmentId;
    commonSubmitWithParam(this.props,"getASNLineList","/rest/getASNLinesBllling",asn.asnId,attId);
    this.changeLoaderState(true);
    this.setState({
      asnDetails : asn,
      showList:false,
      loadASNLineList:true,
      loadInvoiceBytes:true,
      loadServiceLineList:true
    });

  }

  changeLoaderState = (action) =>{
     this.setState({isLoading:action});
  }

  async componentDidMount(){
    this.setState({
      loadASNList:true,
      loadRole : true
    })
    commonSubmitWithParam(this.props,"getASNList","/rest/getASNForBooking");
    this.changeLoaderState(true);
  }

  async componentWillReceiveProps(props){
    if(!isEmpty(props.asnList) && this.state.loadASNList){
        let asnList = [];
        props.asnList.map((asn)=>
          asnList.push(this.getASNFromObj(asn))
        )
        
        this.setState({
           loadASNList:false,
           asnList: asnList
        });
        this.changeLoaderState(false);
    }else{
      this.changeLoaderState(false);
    }

    if(!isEmpty(props.asnLineList) && this.state.loadASNLineList){
      let asnLineList = [];
      let asnLineMap = [];
      props.asnLineList.map((asnLine,index)=>{
            let lineItem=this.getASNLineFromObj(asnLine);
            asnLineList.push(lineItem);
            asnLineMap[lineItem.poLineId]=index;
         }
      )
      
      this.setState({
         loadASNLineList:false,
         asnLines: asnLineList,
         asnLineMap : asnLineMap
      });
      this.changeLoaderState(false);
    }else{
      this.changeLoaderState(false);
    }

    if(!isEmpty(props.serviceLineList) && this.state.loadServiceLineList){
      let serviceLineList = [];
      let serviceLineMap = [];
      props.serviceLineList.map((service,index)=>{
            let lineItem=this.getServiceLineFromObj(service);
            serviceLineList.push(lineItem);
            serviceLineMap[lineItem.poLineId]=index;
         }
      )
      
      this.setState({
         loadServiceLineList : false,
         serviceLines: serviceLineList,
         serviceLineMap : serviceLineMap
      });
      this.changeLoaderState(false);
    }else{
      this.changeLoaderState(false);
    }

    if(props.invoice){
       
        this.setState({
          loadInvoiceBytes:false,
          invoice:props.invoice
        })
        this.changeLoaderState(false);
    }else{
      this.changeLoaderState(false);
    }
  }

  getASNFromObj(asnObj){
    return {
      serviceSheetNo:asnObj.serviceSheetNo,
       asnId : asnObj.advanceShipmentNoticeId,
       asnNumber : asnObj.advanceShipmentNoticeNo,
       po : this.getPurchaseOrderFromObj(asnObj.po),
       invoiceNo : asnObj.invoiceNo,
       invoiceDate : formatDateWithoutTimeWithMonthName(asnObj.invoiceDate),
       invoiceAmount : asnObj.invoiceAmount,
       mismatchAmount : asnObj.mismatchAmount,
       deliveryNoteNo : asnObj.deliveryNoteNo,
       deliveryNoteDate : formatDateWithoutTimeWithMonthName(asnObj.deliveryNoteDate),
       lrDate : formatDateWithoutTimeWithMonthName(asnObj.lrDate),
       lrNumber : asnObj.lrNumber,
       transporterNo : asnObj.transporterNo,
       vehicalNo : asnObj.vehicalNo,
       eWayBillNo : asnObj.eWayBillNo,
       grossWeight : asnObj.grossWeight,
       tareWeight : asnObj.tareWeight,
       numberOfPackages : asnObj.numberOfPackages,
       isCOA : asnObj.isCOA==='Y',
       isPackingList : asnObj.isPackingList==='Y',
       typeOfPackingBulk : asnObj.typeOfPackingBulk,
       remarks : asnObj.remarks,
       igst : asnObj.igst,
       cgst : asnObj.cgst,
       sgst : asnObj.sgst,
       roundOffAmount: asnObj.roundOffAmount,
       roundOffValue:asnObj.roundOffValue,
       tcs: asnObj.tcs ? asnObj.tcs:0,
       basicAmount: asnObj.basicAmount,
       packingCharges : asnObj.packingCharges,
       freightCharges : asnObj.freightCharges,
       invoiceDoc :(asnObj.invoiceNo!=null)?this.checkInvoiceFromObj(asnObj.invoice):"",
       deliveryNoteDoc:(asnObj.deliveryNoteNo!=null)?this.CheckInvoiceFromObjForDelivery(asnObj.invoice):"",
       status  : asnObj.status,
       // status: asnObj.status,
       nameOfDriver : asnObj.nameOfDriver,
       mobileNumber : asnObj.mobileNumber,
       photoIdProof : asnObj.photoIdProof,
       loadingCharges : asnObj.loadingUnloadingCharges,
       irn : asnObj.irn,
       invoiceApplicable: asnObj.invoiceApplicable==='Y',
       isUnload:asnObj.isUnload==='Y',
       isQC:asnObj.isQCPassed==='Y',
       postingDate:asnObj.issueDate,
       tds:asnObj.tds,
       baseAmount:asnObj.baseAmount,
       payableAmount:asnObj.payable,
       withHoldingTax:asnObj.withHoldingTax
     };
 }

 getASNLineFromObj(asnLineObj){
   
  let asnId = "";
  let poLineNumber = "";
  let poLineId = "";
  let poRate = "";
  let materialCode = "";
  let materialName = "";
  let poQty = "";
  let uom = "";
  let balQty = "" ;
  let plant = "";
  let glno = "";
  if(!isEmpty(asnLineObj)){
     if(!isEmpty(asnLineObj.advanceshipmentnotice)){
        asnId = asnLineObj.advanceshipmentnotice.advanceShipmentNoticeId;
     }
     
     if(!isEmpty(asnLineObj.poLine)){
        poLineNumber = asnLineObj.poLine.lineItemNumber;
        poRate = asnLineObj.poLine.rate;
        poLineId = asnLineObj.poLine.purchaseOrderLineId;
        materialCode = asnLineObj.poLine.code;
        materialName = asnLineObj.poLine.name;
        uom = asnLineObj.poLine.uom;
        poQty = asnLineObj.poLine.poQuantity;
        balQty = asnLineObj.poLine.balanceQuantity;
        plant = asnLineObj.poLine.plant
        glno = asnLineObj.poLine.glno
     }
     return {
        asnLineId : asnLineObj.advanceShipmentNoticeLineId,
        asnId : asnId,
        poLineNumber : poLineNumber,
        poLineId : poLineId,
        asnLineNumber : asnLineObj.lineItemNo,
        deliveryQuantity : asnLineObj.deliveryQuantity,
        rejectedQuantity : asnLineObj.rejectedQuantity,
        shortageQuantity : asnLineObj.shortageQuantity,
        confirmQuantity : asnLineObj.confirmQuantity,
        poRate : poRate,
        materialCode : materialCode,
        materialName : materialName,
        poQty : poQty,
        uom : uom,
        balQty : balQty,
        plant : plant,
        storageLocation:asnLineObj.storageLocation,
        glno:glno
     };
  }
}

getServiceLineFromObj(asnLineObj){
  
  let asnId = "";
  let poLineNumber = "";
  let poLineId = "";
  let poRate = "";
  let materialCode = "";
  let materialName = "";
  let poQty = "";
  let uom = "";
  let balQty = "" ;
  let plant = "";
  let parentLineNumber = "";
  let glno = "";
  if(!isEmpty(asnLineObj)){
     if(!isEmpty(asnLineObj.advanceshipmentnotice)){
        asnId = asnLineObj.advanceshipmentnotice.advanceShipmentNoticeId;
     }
     
     if(!isEmpty(asnLineObj.poLine)){
        poLineNumber = asnLineObj.poLine.lineItemNumber;
        poRate = asnLineObj.poLine.rate;
        poLineId = asnLineObj.poLine.purchaseOrderLineId;
        materialCode = asnLineObj.poLine.code;
        materialName = asnLineObj.poLine.name;
        uom = asnLineObj.poLine.uom;
        poQty = asnLineObj.poLine.poQuantity;
        balQty = asnLineObj.poLine.balanceQuantity;
        plant = asnLineObj.poLine.plant;
        parentLineNumber = asnLineObj.poLine.parentPOLine.purchaseOrderLineId;
        glno = asnLineObj.poLine.glno;
     }
     return {
        asnLineId : asnLineObj.advanceShipmentNoticeLineId,
        asnId : asnId,
        poLineNumber : poLineNumber,
        poLineId : poLineId,
        asnLineNumber : asnLineObj.lineItemNo,
        deliveryQuantity : asnLineObj.deliveryQuantity,
        rejectedQuantity : asnLineObj.rejectedQuantity,
        shortageQuantity : asnLineObj.shortageQuantity,
        confirmQuantity : asnLineObj.confirmQuantity,
        poRate : poRate,
        materialCode : materialCode,
        materialName : materialName,
        poQty : poQty,
        uom : uom,
        balQty : balQty,
        plant : plant,
        storageLocation:asnLineObj.storageLocation,
        parentPOLineId: parentLineNumber,
        glno:glno
     };
  }
}

 checkInvoiceFromObj=(obj)=>{
  if(isEmpty(obj)){
      return {
          invoiceDoc:{
              attachmentId : "",
              fileName : ""
          }
      }  
  }else{
  return obj;
  }
}

CheckInvoiceFromObjForDelivery=(obj)=>{
  if(isEmpty(obj)){
  return{
      deliveryNoteDoc:{
              attachmentId : "",
              fileName : ""
          }
      }     
  }else{
  return obj;
  }
}

 getPurchaseOrderFromObj(po){
   
  if(!isEmpty(po)){
     let att; 
     if(!isEmpty(po.poAtt)){
        att= po.poAtt;
     }else{
        att = {
           attachmentId:"",
           fileName:""
        }
     }

     let reqBy;
     if(!isEmpty(po.createdBy)){
        reqBy = {
           userId: po.createdBy.userId,
           name: po.createdBy.name,
           empCode: po.createdBy.userName
        };
     }else{
        reqBy = {
           userId: "",
           name: "",
           empCode:""
           }
     }

     return {
        poId : po.purchaseOrderId,
        purchaseOrderNumber: po.purchaseOrderNumber,
        poDate: formatDateWithoutTimeWithMonthName(po.date),
        vendorCode: removeLeedingZeros(po.vendorCode),
        vendorName: po.vendorName,
        incomeTerms: po.incomeTerms,
        purchaseGroup: po.purchaseGroup,
        versionNumber: po.versionNumber,
        status: po.status,
        documentType: po.documentType,
        poAtt: att,
        requestedBy: reqBy,
        isServicePO : isServicePO(po.pstyp)
     }
  }else{
     return {
        poId : "",
        purchaseOrderNumber: "",
        poDate: "",
        vendorCode: "",
        vendorName: "",
        incomeTerms: "",
        purchaseGroup: "",
        versionNumber: "",
        status: "",
        documentType: ""
     }
  }
  
}

updateGL = (glno,index) => {
   let serviceLineList = this.state.serviceLines;
   serviceLineList[index].glno=glno;
   this.setState({
      serviceLines: serviceLineList
   })
}

  render() {
    return (
     <> 
         <Loader isLoading={this.state.isLoading} />
        <UserDashboardHeader/>
        {
          this.state.showList ?
            <InvoiceList asnList={this.state.asnList} loadASNDetails={this.loadASN} changeLoaderState={this.changeLoaderState}/> : 
            <MiroMainBody asnDetails={this.state.asnDetails} updateGL={this.updateGL} changeLoaderState={this.changeLoaderState}
            asnLines={this.state.asnDetails.po.isServicePO?this.state.serviceLines:this.state.asnLines} invoice={this.state.invoice} glMasterList={this.props.glMasterList} withHoldingTaxList={this.props.withHoldingTaxList}/>
        }
     </>   
    );
  }
}

const mapStateToProps=(state)=>{
  return state.miroReducer;
};
export default connect (mapStateToProps,actionCreators)(MiroContainer);