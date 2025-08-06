import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import { connect } from 'react-redux';
import StickyHeader from "react-sticky-table-thead";
import {isEmpty, isEmptyDeep } from "../../../Util/validationUtil";
import {
   commonSubmitWithParam,
   commonHandleChange,
   commonSubmitFormNoValidation, 
   commonSubmitForm,
   commonSubmitFormNoValidationWithData,
   commonHandleChangeCheckBox,
   commonSetState,
   commonHandleFileUpload,
   commonSubmitFormValidation,
   commonHandleReverseChangeCheckBox,
   swalPrompt, commonSubmitWithoutEvent,
   commonHandleFileUploadInv,
   swalWithTextBox,
   swalWithDate,
  commonSubmitWithParamSapUrl,
  commonSubmitWithObjectParams,
  validateForm,
  resetForm,
  swalWithTextBoxDynamicMessage, 
     showAlert
} from "../../../Util/ActionUtil";
import {searchTableDataThree, searchTableDataFour, searchTableData, searchTableDataTwo  } from "../../../Util/DataTable";
import * as actionCreators from "./Action";
import Loader from "../../FormElement/Loader/LoaderWithProps";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import formatDate,{ formatDateWithoutTime, formatDateWithoutTimeNewDate2,formatDateWithoutTimeWithMonthName,formatDateWithoutTimeNewDate, formatDateWithoutTimeNewDate3 } from "../../../Util/DateUtil";

//import { formatDateWithoutTime, formatDateWithoutTimeNewDate2,formatDateWithoutTimeNewDate, formatDateWithoutTimeNewDate3 } from "../../../Util/DateUtil";

import { is } from "@babel/types";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict } from "../../../Util/CommonUtil";
import { isServicePO } from "../../../Util/AlkylUtil";
import swal from "sweetalert";

import serialize from "form-serialize";
import { currentDate } from "../../../Constants/commonConstants";
import { getIFSCDetails } from "../../../Util/APIUtils";
import { useState } from "react"
import axios from 'axios';
import { formatTime } from "../../../Util/DateUtil";
import UserDashboardHeader from "../../../Component/Header/UserDashboardHeader";
import {getReferenceListDataApi, submitToSAPURL,savetoServer} from "../../../Util/APIUtils"
import { submitToURL } from "../../../Util/APIUtils";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";



const SwalNew = require('sweetalert2')
const height_dy = window.innerHeight - 135;

const delay = ms => new Promise(
   resolve => setTimeout(resolve, ms)
 );

class FormNo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      costCenterList:[],
      isLoading: false,
      
         asnNo:"",
         asnId:"",
         reportingDone: false,
      
      STOASNFetchDetails:{
         asnNumber:"",
         invoiceNo:"",
         invoiceDate:"",
         transporterNo:"",
         lrNumber:"",
         lrDate:"",
         vehicalNo:"",
         grossWeight:"",
         tareWeight:"",
         numberOfPackages:"",
         netWeight:"",
         nameOfDriver:"",
         mobileNumber:"",
         photoIdProof:""
      },
      gateentryAsnList:[],
         cancelSsnButton: "block",
         cancelAsnButton: "block",
         flagforSSN: false,
         psTypeFlag: true,
         displayDivForAsnHistoryTable: "",
         editButtonForAsn: false,
         loadAsnStatusList: true,
         loadserviceSheetStatusList: true,
         loadserviceEntrySheetStatusList: true,
         vendorNameShown: "block",
         isLoading: false,
      // asnStatusList: [],
         serviceSheetStatusList: [],
         serviceLineArray: [],
         serviceEntrySheetStatusList: [],
         asnDetails: {
            asnId: "",
            asnNumber: "",
            po: "",
            plant: "",
            invoiceNo: "",
            invoiceDate: "",
            servicePostingDate:"",
            serviceFromDate:"",
            serviceToDate:"",
            serviceLocation:"",
            postingDate:"",
            invoiceAmount: "",
            loadingCharges: "",
            mismatchAmount: "",
            deliveryNoteNo: "",
            deliveryNoteDate: "",
            lrDate: "",
            lrNumber: "",
            transporterNo: "",
            vehicalNo: "",
            eWayBillNo: "",
            grossWeight: "",
            tareWeight: "",
            numberOfPackages: "",
            isCOA: "",
            isPackingList: "",
            typeOfPackingBulk: "",
            remarks: "",
            basicAmount: "",
            freightCharges: "",
            packingCharges: "",
            sgst: "",
            cgst: "",
            igst: "",
            tcs: "",
            roundOffAmount: '',
            roundOffValue: '',
            invoiceDoc: {
               attachmentId: "",
               fileName: ""
            },
            deliveryNoteDoc: {
               attachmentId: "",
               fileName: ""
            },
            nameOfDriver: "",
            mobileNumber: "",
            photoIdProof: "",
            status: "",
            irn: "",
            invoiceApplicable: true,
            grnNO: ""
         },
         invoiceApplicable: true,
         deliveryApplicable: false,
         isInvoiceApplicable: true,
         loadPODetailsList: false,
         loadPOLineList: false,
         poArray: [],
         poLineArray: [],
         asnLineArray: [],
         asnArray: [],
         loadASNList: false,
         loadASNLineList: false,
         loadASNDetails: false,
         loadASNLineDetails: false,
         flagForAttachmentResponce: false,
         asnLineDetails: {
            asnLineId: "",
            asnId: "",
            poLineId: "",
            poLineNumber: "",
            asnLineNumber: "",
            deliveryQuantity: "",
            rejectedQuantity: "",
            shortageQuantity: "",
            confirmQuantity: "",
            poRate: "",
            materialCode: "",
            materialName: "",
            poQty: "",
            uom: "",
            balQty1: "",
            orderNo:""

         },
         asnIndex: "",
         showHistory: false,
         unload: false,
         grn: false,
         qc: false,
         po: {
            poId: "",
            purchaseOrderNumber: "",
            poDate: "",
            vendorCode: "",
            vendorName: "",
            incomeTerms: "",
            purchaseGroup: "",
            versionNumber: "",
            status: "",
            documentType: "",
            isServicePO: false,
            outboundDeliveryNo:"",
            doctyp:"",
            prDate:"",
            userID:""
         },
         currentASN: "",
         serviceLineArray: [],
         loadServiceLineList: false,
         currentPOLineIndex: "",
         saveServiceLines: false,
         role: "",
         loadStorageLocation: false,
         asnLineMap: [],
         selectedAsnListItem: {},
        // selectedAsnFundListItem:{},
         openModal: false,
       // openfundModal: false,
         selectedStorageLocationListItem: {},
         openStorageLocationModal: false,
         isSameLocation : false,
         asnCancelButton:"",
         poData:"",
         isLoading: false,
         securityPOHeaderDto: {
            po:{poNumber:""},
             
             asnNumber:"",
             asnDate:"",
             invoiceNo:"",
             invoiceDate:"",
             transporterNo:"",
             lrNumber:"",
             lrDate:"",
             vehicleNo:"",
             grossWeight:"",
             tareWeight:"",
             numberOfPackages:"",
             netWeight:"",
             nameOfDriver:"",
             mobileNumber:"",
             photoIdProof:""
         },
         asn : {
            asnId : "",
            status  : "",
            nameOfDriver : "",
            mobileNumber : "",
            photoIdProof : "",
            grnNO:"",
            
        },
        asnList:[],
        test:{},
        vehicleRegForm:{},

        stoASNList:[]
    }
  }
  getStorageLocation = (asnId) => {
   for (let i = 0; i < this.state.listOfasn.length; i++) {
      if (this.state.listOfasn[i].advanceshipmentnotice.advanceShipmentNoticeId === asnId) {
         return this.state.listOfasn[i].storageLocation;
      }
   }
   return "";
}

enablelastDateofLastMonth=()=>{

  
var date = new Date();
let firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().substr(0, 10)
var lastDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDayOfLastMonth = lastDay.toISOString().substr(0, 10);

const diffInMs   = new Date(date) - new Date(lastDayOfLastMonth)
const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

//  if(diffInDays>3){
//    return firstDateOfMonth;
   
// }else{
//    return lastDayOfLastMonth
// }
var givenLastDate = new Date(lastDayOfLastMonth);
var lastMonthDay = givenLastDate.getDay();
var lastDayisWeekend = (lastMonthDay === 6) || (lastMonthDay === 0) ? "Its weekend": "Its working day";


var givenFirstDate = new Date(firstDateOfMonth);
var firstDay = givenFirstDate.getDay();
var firstDayisWeekend = (firstDay === 6) || (firstDay === 0) ? "Its weekend": "Its working day";

// if((diffInDays>3) || ((!lastDayisWeekend) || (!firstDayisWeekend))){
if((diffInDays>4)){
   return firstDateOfMonth;
   
}else if(((!lastDayisWeekend) || (!firstDayisWeekend))){
   return firstDateOfMonth;
}
else{
   return lastDayOfLastMonth
}


// if((diffInDays>2))
// {
//    return lastDayOfLastMonth
// }
// else if((diffInDays>3) || ((!lastDayisWeekend) || (!firstDayisWeekend))){
//    return firstDateOfMonth;
   
// }
// else{
//    return lastDayOfLastMonth
// }


}

saveAndSubmit = (e) => {
   e.preventDefault();
   this.props.changeASNStatus(true);
   this.setState({ loadASNDetails: true, loadASNLineList: true });
   commonSubmitForm(e, this, "markASNInTransit", "/rest/markASNInTransit");
   //swalPrompt(e,this,"submitConfirmation","","Do you really want to save & submit?","OK","CANCEL")
}

submitConfirmation = () => {
   var x = this.state.formElement

   commonSubmitWithoutEvent(x, this, "markASNInTransit", "/rest/markASNInTransit");
}

editASN = () => {
   let asn = this.state.asnDetails;
   asn.status = "DR";
   this.setState({
      asbDetails: asn
   });
}

clearInoviceAttachment = () => {
   let asn = this.state.asnDetails;
   asn.invoiceDoc = ""
   this.setState({

      asnDetails: asn
   })

}

searchPOData(){
   //  this.props.changeLoaderState(false);
   if(document.getElementById('POSearch').value==""){
     return false;
   }else{
     let po=this.state.po.purchaseOrderNumber;
      commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po)
   }
  }

  gateEntryASNReminder(){
   if(document.getElementById('POSearch').value==""){
      return false;
    }else{
      commonSubmitWithParam(this.props,"saveASNDetailsResponse","/rest/sendASNCreationReminderForGateEntry",this.state.po.purchaseOrderNumber)
    }

}


clearDeliveryNoteAttachment = () => {
   let asn = this.state.asnDetails;
   asn.deliveryNoteDoc = ""
   this.setState({

      asnDetails: asn
   })

}
getPurchaseOrderFromObj(po){
   if (!isEmpty(po)){
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
  if(!isEmpty(po.updatedBy)){
    reqBy = {
      userId: po.updatedBy.userId,
      name: po.updatedBy.name,
      empCode: po.updatedBy.userName
    };
  }else{
    reqBy = {
        userId: "",
        name: "",
        empCode:""
      }
  }



  return {
    poId: po.purchaseOrderId,
    purchaseOrderNumber: po.purchaseOrderNumber,
    poDate: formatDateWithoutTimeNewDate2(po.date),
    vendorCode: removeLeedingZeros(po.vendorCode),
    vendorName: po.vendorName,
    incomeTerms: po.incomeTerms,
    purchaseGroup: po.purchaseGroup,
    versionNumber: po.versionNumber,
    status: po.status,
    documentType: po.documentType,
    poAtt: att,
    requestedBy: reqBy,

    isServicePO:isServicePO(po.pstyp),
    prDate:formatDateWithoutTimeNewDate2(po.prDate),
    userID:po.userID
 }
} else {
         return {
            poId: "",
            purchaseOrderNumber: "",
            poDate: "",
            vendorCode: "",
            vendorName: "",
            incomeTerms: "",
            purchaseGroup: "",
            versionNumber: "",
            status: "",
            documentType: "",
            prDate:"",
            userID:""
         }
      }

}

showHistory = () => {
   this.setState({
      showHistory: true
   });
}

getPOLineFromObj(poLineObj) {
   return {
    poLineId: poLineObj.purchaseOrderLineId,
    lineItemNumber: poLineObj.lineItemNumber,
    currency: poLineObj.currency,
    deliveryDate: formatDateWithoutTime(poLineObj.deliveryDate),
    plant:poLineObj.plant,
   deliveryStatus:poLineObj.deliveryStatus,
   controlCode:poLineObj.controlCode,
   trackingNmber:poLineObj.trackingNmber,
   deliveryScheduleAnnual:poLineObj.deliveryScheduleAnnual,
   poQuantity:poLineObj.poQuantity,
   balanceQuantity1:poLineObj.balanceQuantity1,
    rate: Number(poLineObj.rate).toFixed(2),
    deliveryQuantity: poLineObj.deliveryQuantity,
    balanceQuantity: poLineObj.balanceQuantity,
    materialCode: poLineObj.code,
    material: poLineObj.name,
    uom: poLineObj.uom
  }
}

loadPO = (poIndex) => {

   let po = this.state.poArray[poIndex];
   let asn = this.state.asnDetails;
   asn.poId = po.poId;
   asn.poNumber = po.purchaseOrderNumber;
   asn.poStatus = po.status;

   this.setState({
      asnDetails: asn
   });

}

checkInvoiceFromObj = (obj) => {
   if (isEmpty(obj)) {
      return {
         invoiceDoc: {
            attachmentId: "",
            fileName: ""
         }
      }
   } else {
      return obj;
   }
}

CheckInvoiceFromObjForDelivery = (obj) => {
   if (isEmpty(obj)) {
      return {
         deliveryNoteDoc: {
            attachmentId: "",
            fileName: ""
         }
      }
   } else {
      return obj;
   }
}

controlSubmit=(e)=>{
   if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      // callback(submitAddress);
    }
}

getASNFromObj(asnObj) {
   return {
      asnId: asnObj.advanceShipmentNoticeId,
      asnNumber: asnObj.advanceShipmentNoticeNo,
      serviceSheetNo: asnObj.serviceSheetNo,
      po: this.getPurchaseOrderFromObj(asnObj.po),
      invoiceNo: asnObj.invoiceNo,
      invoiceDate: formatDateWithoutTimeNewDate2(asnObj.invoiceDate),
      created:formatDateWithoutTimeNewDate2(asnObj.created),
      invoiceAmount: asnObj.invoiceAmount,
      mismatchAmount: asnObj.mismatchAmount,
      deliveryNoteNo: asnObj.deliveryNoteNo,
      deliveryNoteDate: formatDateWithoutTimeNewDate2(asnObj.deliveryNoteDate),
      lrDate: formatDateWithoutTime(asnObj.lrDate),
      lrNumber: asnObj.lrNumber,
      transporterNo: asnObj.transporterNo,
      vehicalNo: asnObj.vehicalNo,
      eWayBillNo: asnObj.eWayBillNo,
      grossWeight: asnObj.grossWeight,
      tareWeight: asnObj.tareWeight,
      numberOfPackages: asnObj.numberOfPackages,
      isCOA: asnObj.isCOA === 'Y',
      isPackingList: asnObj.isPackingList === 'Y',
      typeOfPackingBulk: asnObj.typeOfPackingBulk,
      remarks: asnObj.remarks,
      igst: asnObj.igst,
      cgst: asnObj.cgst,
      sgst: asnObj.sgst,
      tcs: asnObj.tcs ? asnObj.tcs : 0,
      basicAmount: asnObj.basicAmount,
      packingCharges: asnObj.packingCharges,
      freightCharges: asnObj.freightCharges,
      invoiceDoc: (asnObj.invoiceNo != null) ? this.checkInvoiceFromObj(asnObj.invoice) : "",
      deliveryNoteDoc: (asnObj.deliveryNoteNo != null) ? this.CheckInvoiceFromObjForDelivery(asnObj.invoice) : "",
      status: asnObj.status,
      // status: asnObj.status,
      nameOfDriver: asnObj.nameOfDriver,
      mobileNumber: asnObj.mobileNumber,
      photoIdProof: asnObj.photoIdProof,
      loadingCharges: asnObj.loadingUnloadingCharges,
      irn: asnObj.irn,
      invoiceApplicable: asnObj.invoiceApplicable === 'Y',
      isUnload: asnObj.isUnload === 'Y',
      isQC: asnObj.isQCPassed === 'Y',
      grnNO: asnObj.grnId,
      description: asnObj.description,
      roundOffAmount: asnObj.roundOffAmount,
      roundOffValue: asnObj.roundOffValue,
      serviceLocation: asnObj.serviceLocation,
      servicePostingDate: formatDateWithoutTimeNewDate2(asnObj.servicePostingDate),
      serviceFromDate: formatDateWithoutTimeNewDate2(asnObj.serviceFromDate),
      serviceToDate: formatDateWithoutTimeNewDate2(asnObj.serviceToDate),
   };
}

getASNLineFromPOLine(poLine) {
   return {
      poLineNumber: poLine.lineItemNumber,
      poLineId: poLine.poLineId,
      asnLineNumber: poLine.lineItemNumber,
      deliveryQuantity: "",
      poRate: poLine.rate,
      materialCode: poLine.materialCode,
      materialName: poLine.material,
      poQty: poLine.poQuantity,
      balQty1: poLine.balanceQuantity1,
      uom: poLine.uom,
      balQty: poLine.balanceQuantity,
      plant: poLine.plant
   };
}

getServiceLineFromService(service) {
   return {
      poLineNumber: service.lineItemNumber,
      poLineId: service.poLineId,
      asnLineNumber: service.lineItemNumber,
      deliveryQuantity: "",
      poRate: service.rate,
      materialCode: service.materialCode,
      materialName: service.material,
      poQty: service.poQuantity,
      balQty1: service.balanceQuantity1,
      uom: service.uom,
      balQty: service.balanceQuantity,
      plant: service.plant,
      parentPOLineId: service.parentPOLineId,
      contractPo: service.contractPo,
      balanceLimit: service.balanceLimit,
      parentLineNumber : service.parentPOlineNumber,
      orderNo:service.orderNo,
      poNo:service.poNo

   };
}

getASNLineFromObj(asnLineObj) {

   let asnId = "";
   let poLineNumber = "";
   let poLineId = "";
   let poRate = "";
   let materialCode = "";
   let materialName = "";
   let poQty = "";
   let balQty1 = "";
   let uom = "";
   let balQty = "";
   let plant = "";
   let poNumber = "";
   if (!isEmpty(asnLineObj)) {
      if (!isEmpty(asnLineObj.advanceshipmentnotice)) {
         asnId = asnLineObj.advanceshipmentnotice.advanceShipmentNoticeId;
      }

      if (!isEmpty(asnLineObj.poLine)) {
         poLineNumber = asnLineObj.poLine.lineItemNumber;
         poRate = asnLineObj.poLine.rate;
         poLineId = asnLineObj.poLine.purchaseOrderLineId;
         materialCode = asnLineObj.poLine.code;
         materialName = asnLineObj.poLine.name;
         uom = asnLineObj.poLine.uom;
         poQty = asnLineObj.poLine.poQuantity;
         balQty1 = asnLineObj.poLine.balanceQuantity1;
         balQty = asnLineObj.poLine.balanceQuantity;
         plant = asnLineObj.poLine.plant;
         poNumber = asnLineObj.poLine.purchaseOrder.purchaseOrderNumber
      }
      return {
         asnLineId: asnLineObj.advanceShipmentNoticeLineId,
         asnId: asnId,
         poLineNumber: poLineNumber,
         poLineId: poLineId,
         asnLineNumber: asnLineObj.lineItemNo,
         deliveryQuantity: asnLineObj.deliveryQuantity,
         rejectedQuantity: asnLineObj.rejectedQuantity,
         shortageQuantity: asnLineObj.shortageQuantity,
         confirmQuantity: asnLineObj.confirmQuantity,
         poRate: poRate,
         materialCode: materialCode,
         materialName: materialName,
         poQty: poQty,
         balQty1: balQty1,
         uom: uom,
         balQty: balQty,
         plant: plant,
         storageLocation: asnLineObj.storageLocation,
         poNumber: poNumber
      };
   }
}

getServiceLineFromObj(asnLineObj) {
   let asnId = "";
   let poLineNumber = "";
   let poLineId = "";
   let poRate = "";
   let materialCode = "";
   let materialName = "";
   let poQty = "";
   let balQty1 = "";
   let uom = "";
   let balQty = "";
   let plant = "";
   let poNumber="";
   let parentLineNumber = "";
   let parentLineId = "";
   if (!isEmpty(asnLineObj)) {
      if (!isEmpty(asnLineObj.advanceshipmentnotice)) {
         asnId = asnLineObj.advanceshipmentnotice.advanceShipmentNoticeId;
      }

      if (!isEmpty(asnLineObj.poLine)) {
         poLineNumber = asnLineObj.poLine.lineItemNumber;
         poRate = asnLineObj.poLine.rate;
         poLineId = asnLineObj.poLine.purchaseOrderLineId;
         materialCode = asnLineObj.poLine.code;
         materialName = asnLineObj.poLine.name;
         uom = asnLineObj.poLine.uom;
         poQty = asnLineObj.poLine.poQuantity;
         balQty1 = asnLineObj.poLine.balanceQuantity1;
         balQty = asnLineObj.poLine.balanceQuantity;
         plant = asnLineObj.poLine.plant;
         poNumber = asnLineObj.poLine.purchaseOrder.purchaseOrderNumber
         parentLineId = asnLineObj.poLine.parentPOLine.purchaseOrderLineId;
         parentLineNumber = asnLineObj.poLine.parentPOLine.lineItemNumber
      }
      return {
         asnLineId: asnLineObj.advanceShipmentNoticeLineId,
         asnId: asnId,
         poLineNumber: poLineNumber,
         poLineId: poLineId,
         asnLineNumber: asnLineObj.lineItemNo,
         deliveryQuantity: asnLineObj.deliveryQuantity,
         rejectedQuantity: asnLineObj.rejectedQuantity,
         shortageQuantity: asnLineObj.shortageQuantity,
         confirmQuantity: asnLineObj.confirmQuantity,
         poRate: poRate,
         materialCode: materialCode,
         materialName: materialName,
         poQty: poQty,
         balQty1: balQty1,
         uom: uom,
         balQty: balQty,
         plant: plant,
         poNumber:poNumber,
         storageLocation: asnLineObj.storageLocation,
         parentLineId: parentLineId,
         parentLineNumber: parentLineNumber,
         asnLineCostCenter: !isEmpty(asnLineObj.asnLineCostCenter) ? asnLineObj.asnLineCostCenter : []
      };
   }
}

updateAsnLineIndex(e) {
   let asnIndex = this.state.asnIndex;
   if (e.target.checked) {
      this.setState({
         asnIndex: asnIndex++
      })
   } else {
      this.setState({
         asnIndex: asnIndex--
      })
   }

}

// STOASNDetails=()=>{
//    commonSubmitWithParam(this.props,"getSTOASNDetails",'/rest/createSTOASN',this.props.po.outboundDeliveryNo)
// }

getASNIndexFroRow() {
   if (this.state.asnIndex > 0) {
      return this.state.asnIndex;
   } else {
      return "";
   }
}

async componentWillReceiveProps(props) {
   // if(isEmpty(props.isSuccess) || props.isSuccess===false)
   // {
   //    this.props.changeLoaderState(false);
   // }

   if(!isEmpty(props.asnCancelButton))
   {
      this.setState({cancelAsnButton: 'none'})
   }

   if(!isEmpty(props.ssnCancelButton))
   {
      this.setState({cancelSsnButton: 'none'})
   }

   if(!isEmpty(props.gateentryAsnList))
   {
      this.setState({gateentryAsnList:props.gateentryAsnList })
   }



   if (!isEmpty(props.po)) {


      this.setState({
         displayDivForAsnHistoryTable: props.po.isServicePO ? "none" : "",
         psTypeFlag: props.po.isServicePO ? false : true,
         flagforSSN: props.po.isServicePO ? true : false,

      })
   }
   if (isEmpty(props.asnStatusList) && this.state.loadAsnStatusList) {
      commonSubmitWithParam(this.props, "getStatusDisplay", "/rest/getASNStatusList");
   }

   if (!isEmpty(props.asnStatusList) && this.state.loadAsnStatusList) {
      this.setState({
         loadAsnStatusList: false,
         asnStatusList: props.asnStatusList
      })

   }

   if(!isEmpty(props.locationList) ){
      this.setState({
         locationList: props.locationList
      })
      
    }

    if(!isEmpty(props.costCenterList) ){
      this.setState({
         costCenterList: props.costCenterList
      })
      
    }


    if (!isEmpty(props.serviceSheetStatusList) && this.state.loadserviceSheetStatusList) {
      this.setState({
         loadserviceSheetStatusList: false,
         serviceSheetStatusList: props.serviceSheetStatusList
      })

   }
   if (!isEmpty(props.serviceEntrySheetStatusList) && this.state.loadserviceEntrySheetStatusList) {
      this.setState({
         loadserviceEntrySheetStatusList: false,
         serviceEntrySheetStatusList: props.serviceEntrySheetStatusList
      })

   }

   if (!isEmpty(props.unload)) {
      this.setState({ unload: props.unload });
   }

   if (!isEmpty(props.grn)) {
      this.setState({ grn: props.grn });
   }

   if (!isEmpty(props.asnId) && !isEmpty(props.asnNo)) {
      this.setState({ asnId: props.asnId,asnNo:props.asnNo,reportingDone:true 
      
      });
   }

   // if (!isEmpty(props.qc)) {
   //    this.setState({ qc: props.qc || this.state.role === "QCADM" });
   // }
   if (!isEmpty(props.purchaseOrderList) && this.state.loadPODetailsList) {
      let poList = [];
      props.purchaseOrderList.map((po) =>
         poList.push(this.getPurchaseOrderFromObj(po))
      );
      this.setState({
         loadPODetailsList: false,
         poArray: poList
      })
   }

   if (!isEmpty(props.poLineList) && this.state.loadPOLineList) {
      let poLineList = [];
      props.poLineList.map((poLine) =>
         poLineList.push(this.getPOLineFromObj(poLine))
      )
      this.setState({
         loadPOLineList: false,
         poLineArray: poLineList
      });
   }

   if (!isEmpty(props.po)) {
      this.setState({
         po: props.po,
      });
   }

   if (props.showHistory) {

      this.setState({
         showHistory: true
      });

      if (!isEmpty(props.asnArray)) {
         let asnList = [];
         props.asnArray.map((asn) =>
            asnList.push(this.getASNFromObj(asn))

         )
         this.setState({
            loadASNList: false,
            asnArray: asnList
         });
      }
   } else if (!props.showHistory) {
      this.setState({
         showHistory: false
      });
   }

   if (!isEmpty(props.listOfasn)) {
      let asn = props.listOfasn;
      this.setState({
         loadASNList: false,
         listOfasn: asn
      });
   }

   if (!isEmpty(props.asnList) && this.state.loadASNList) {
      this.props.changeLoaderState(false);
      let asnList = [];
      props.asnList.map((asn) =>
         asnList.push(this.getASNFromObj(asn))
      )

      this.setState({
         loadASNList: false,
         asnArray: asnList
      });
   }


   if (!isEmpty(props.asnLineList) && this.state.loadASNLineList) {
      this.props.changeLoaderState(false);
      let asnLineList = [];
      let asnLineMap = [];
      props.asnLineList.map((asnLine, index) => {
         let lineItem = this.getASNLineFromObj(asnLine);
         asnLineList.push(lineItem);
         asnLineMap[lineItem.poLineId] = index;
      }
      )
      this.setState({
         loadASNLineList: false,
         asnLineArray: asnLineList,
         asnLineMap: asnLineMap
      });
   }
   else {
      this.props.changeLoaderState(false);
   }

   if (!isEmpty(props.storageLocationList) && this.state.loadStorageLocation) {
      let strLocArray = Object.keys(props.storageLocationList).map((key) => {
         return { display: props.storageLocationList[key], value: key }
      });
      this.setState({
         loadStorageLocation: false,
         storageLocationList: strLocArray
      });
   }
   if (!isEmpty(props.serviceLineList) && this.state.loadServiceLineList) {
      let serviceLineList = [];
      props.serviceLineList.map((serviceLine) =>
         serviceLineList.push(this.getServiceLineFromObj(serviceLine))
      )
      this.setState({
         loadServiceLineList: false,
         serviceLineArray: serviceLineList
      });
   }


   if (!isEmpty(props.asnLineList) && this.state.saveServiceLines) {
      this.props.changeLoaderState(false);
      let serviceLineList = [];
      let serviceLineListFromAsnLine = [];

      this.state.asnLineMap.map((asnLine, index) => {
         serviceLineListFromAsnLine = props.asnLineList[asnLine].serviceLineList;
         if (!isEmpty(serviceLineListFromAsnLine)) {
            serviceLineListFromAsnLine.map((serviceLine) => {
               serviceLineList.push(this.getASNLineFromObj(serviceLine))
            })
         }
      })



      this.setState({
         saveServiceLines: false,
         serviceLineArray: serviceLineList
      });
   } else {
      this.props.changeLoaderState(false);
   }


   if (!isEmpty(props.asnDetails) && this.state.loadASNDetails) {
      let asnList = this.state.asnArray;
      asnList.push(this.getASNFromObj(props.asnDetails));
      this.setState({
         loadASNDetails: false,
         asnDetails: this.getASNFromObj(props.asnDetails),
         asnArray: asnList
      });
   }
   if (!isEmpty(props.stoASNList)) {
      this.setState({
         STOASNFetchDetails: props.stoASNList[0]
      });
   }

   if (!isEmpty(props.gateEntry)) {

      let asn = this.state.currentASN;
      asn.nameOfDriver = props.gateEntry.nameOfDriver;
      asn.mobileNumber = props.gateEntry.mobileNumber;
      asn.photoIdProof = props.gateEntry.photoIdProof;
      this.setState({
         loadASNDetails: false,
         asnDetails: asn,
         currentASN: asn
      });
   }

   if (!isEmpty(props.asnLineDetails) && this.state.loadASNLineDetails) {
      this.setState({
         loadASNLineDetails: false,
         asnLineDetails: this.getASNLineFromObj(props.asnLineDetails)
      });
   }

   if (!isEmpty(props.poLineArray) && !this.state.loadASNLineList) {
      let asnLineList = [];
      let asnLineMap = [];

      props.poLineArray.map((poLine, index) => {
         let lineItem = this.getASNLineFromPOLine(poLine);
         asnLineList.push(lineItem);
         asnLineMap[lineItem.poLineId] = index;
      }
      )
      this.setState({
         asnLineArray: asnLineList,
         loadASNLineList: true,
         asnLineMap: asnLineMap
      });
   }

   if (!isEmpty(props.serviceList) && !this.state.loadServiceLineList) {
      let serviceList = [];
      props.serviceList.map((service) =>
         serviceList.push(this.getServiceLineFromService(service))
      )
      this.setState({
         serviceLineArray: serviceList,
         loadServiceLineList: true
      });
   }

   // if (!isEmpty(props.asnStatus)) {
   //    this.setState({
   //       asnStatus: props.asnStatus
   //           });
   //    this.props.changeLoaderState(false);
   // } else {
   //    this.props.changeLoaderState(false);
   // }

   if (!isEmpty(props.asnStatus)) {
      this.setState({
         asnStatus: props.asnStatus
             });
     
   } 

   if (!isEmpty(props.asnStatus) && this.props.updateASNStatus) {
      this.props.changeLoaderState(false);
      this.props.changeASNStatus(false);
      let asn = this.state.asnDetails;
      asn.status = props.asnStatus;
      this.props.showGateEntry(false, "");
      this.setState({
         asnDetails: asn
      });
      setTimeout(() => {
         window.location.reload();
      }, 1000)
   }

   // if (!isEmpty(props.role) && this.state.loadRole) {

   //    var viewAsn = props.role === "SECADM" || props.role === "OHCADM"
   //       || props.role === "SFTADM";
   //    this.setState({
   //       loadRole: false,
   //       role: props.role,
   //       asnShown: viewAsn,
   //       vendorNameShown: props.role === "VENADM" ? "none" : "block",
   //       // vendorNameShown:"none"
   //    });
   //    props.updateRole(props.role);
   // }

   // if (!isEmpty(props.newRole)) {

   //    var viewAsn = props.newRole === "SECADM" || props.newRole === "OHCADM"
   //       || props.newRole === "SFTADM";
   //    this.setState({
   //       loadRole: false,
   //       role: props.newRole,
   //       asnShown: viewAsn,
   //       vendorNameShown: props.newRole === "VENADM" ? "none" : "show",
   //       // vendorNameShown:"none"
   //    });
   // }

     // if(!isEmpty(props.backAction)){
      //    this.backAction = props.backAction;
      // }else{
      //    this.backAction = this.showASNHistory;
      // }
   if (!isEmpty(props.asnList)) {
      this.setState({
          asnList: props.asnList

      })
  }
  if (!isEmpty(props.test)) {
   this.setState({
       test: props.test

   })
}
  if (props.showHistory) {

   this.setState({
      showHistory: true
   });

   if (!isEmpty(props.asnList)) {
      let asnList = [];
      this.setState({
         asnList: props.asnList
     })
   }
}else if (!props.showHistory) {
   this.setState({
      showHistory: false
   });
}
  else {
      this.changeLoaderState(false);
  }
}



showASNHistory = () => {
   this.props.showGateEntry(false, "");
   this.setState({
      showHistory: true,
      grn: false,
      unload: false,
      qc: false
   })
}

async componentDidMount() {
   if (this.props.showHistory) {
      this.setState({
         showHistory: true,
         loadASNList: true,
         loadRole: true
      })
      commonSubmitWithParam(this.props, "getASNList", "/rest/getASN");

      this.props.showGateEntry(false, "");
   }
}

//async componentDidUpdate(prevProps){

//   if(this.props.po.outboundDeliveryNo!==prevProps.po.outboundDeliveryNo){
     // this.STOASNDetails();
    //  commonSubmitWithParam(this.props,"getSTOASNDetails",'/rest/createSTOASN',this.props.po.outboundDeliveryNo)
 //  }

//}

//  getPurchaseOrderFromObj(po){
   //    return {
   //      poId : po.purchaseOrderId,
   //      purchaseOrderNumber: po.purchaseOrderNumber,
   //      poDate: formatDateWithoutTime(po.date),
   //      vendorCode: po.vendorCode,
   //      vendorName: po.vendorName,
   //      incomeTerms: po.incomeTerms,
   //      purchaseGroup: po.purchaseGroup,
   //      versionNumber: po.versionNumber,
   //      status: po.status,
   //      documentType: po.documentType
   //    }
   //  }

 loadASNForEdit(asn) {
      this.props.showHistoryFalse();
      this.props.showGateEntry(true, asn);
      this.setState({
         loadASNLineList: true,
         loadPOLineList: true,
         loadStorageLocation: true,
         securityPOHeaderDto: asn,
         asnLineArray: asn.poLine,
         showHistory: false,
         po: asn.po,
         currentASN: asn,
         editButtonForAsn: (asn.status === "IT" && this.state.role === "VENADM") ? true : false,
         loadServiceLineList: true,
        // qc: this.state.role === "QCADM"
      })
      this.props.changeLoaderState(true);
      commonSubmitWithParam(this.props, "getASNLineList", "/rest/getSecurityASNLines",asn.asnHeaderId);
   }

   resetAsn = () => {
     
      this.setState({
         
         serviceLineArray: [],
         asnLineArray: [],
         asnDetails: {
            asnId: "",
            serviceSheetNo: "",
            asnNumber: "",
            po: "",
            plant: "",
            invoiceNo: "",
            invoiceDate: "",
            invoiceAmount: "",
            loadingCharges: "",
            mismatchAmount: "",
            deliveryNoteNo: "",
            deliveryNoteDate: "",
            lrDate: "",
            lrNumber: "",
            transporterNo: "",
            vehicalNo: "",
            eWayBillNo: "",
            grossWeight: "",
            tareWeight: "",
            numberOfPackages: "",
            isCOA: "",
            isPackingList: "",
            typeOfPackingBulk: "",
            remarks: "",
            basicAmount: "",
            freightCharges: "",
            packingCharges: "",
            sgst: "",
            cgst: "",
            igst: "",
            tcs: "",
            roundOffAmount: '',
            roundOffValue: '',
            invoiceDoc: {
               attachmentId: "",
               fileName: ""
            },
            deliveryNoteDoc: {
               attachmentId: "",
               fileName: ""
            },
            nameOfDriver: "",
            mobileNumber: "",
            photoIdProof: "",
            status: "",
            irn: "",
            invoiceApplicable: true,
            roundOffAmount: 0,
            roundOffValue: 0,
         },
         canEdit: false
         
      });
      
   }

   calculateBasicAmount = (e, index, arrayName) => {
      let list = (this.state.po.isServicePO)
         ? this.state.serviceLineArray : this.state.asnLineArray;

      commonHandleChange(e, this, arrayName + "." + index + ".deliveryQuantity");

      let totalBasicAmount = 0;
      list.map((asnLine) =>{
         totalBasicAmount = totalBasicAmount + (asnLine.deliveryQuantity * asnLine.poRate)
   })
      let asn = this.state.asnDetails;
      asn.basicAmount = totalBasicAmount
      this.setState({
         asnDetails: asn
      });

      this.calculateGrossAmount();
   }

   calculateGrossAmount = () => {
      let asn = this.state.asnDetails;
      let invoiceAmount = Number(asn.basicAmount) + Number(asn.cgst) + Number(asn.sgst) + Number(asn.igst) + Number(asn.tcs)
         + Number(asn.freightCharges) + Number(asn.packingCharges) + Number(asn.loadingCharges);
      let roundOffAmount = invoiceAmount;
      let roundAmount = Math.round(invoiceAmount);
      asn.invoiceAmount = (roundOffAmount).toFixed(2);
      asn.roundOffAmount = roundAmount;
      asn.roundOffValue = (roundAmount - roundOffAmount).toFixed(2)
      this.setState({
         asnDetails: asn
      })
   }

   calculateBalanceQuantity = (e, index, arrayName) => {
      let list = (this.state.po.isServicePO)
      ? this.state.serviceLineArray : this.state.asnLineArray;
      
      commonHandleChange(e, this, arrayName + "." + index + ".deliveryQuantity");
      list.map((ssnLine) =>{ 
      this.state.serviceLineArray.map((serviceLine) => {
         if(serviceLine.contractPo == 'Y') {
              console.log("contact PO") 
         }
         else {
            
            if(ssnLine.deliveryQuantity > ssnLine.balQty1){
              window.alert("Quantity exceed") 
              e.stopImmediatePropagation();      
         }
       
      }
     
   })
})
   }
   showAsnDetails = () => {
      this.setState({
         asnShown: !this.state.asnShown,
         asnListHidden: !this.state.asnListHidden,
         marginClass: "mt-100",
         canEdit: false
      });
   }
   asnListHidden = () => {
      this.setState({
         asnShown: !this.state.asnShown,
         asnListHidden: !this.state.asnListHidden,
         marginClass: ""
      });
   }
   onClickAsnLine = (asnLineId, poLineId, idx) => {
      this.setState({
         loadServiceLineList: true,
         currentPOLineIndex: idx
      });
      if (isEmpty(asnLineId)) {
         commonSubmitWithParam(this.props, "getServiceLineList", "/rest/getServiceSheetLines", poLineId);
      } else if (!isEmpty(poLineId)) {
         commonSubmitWithParam(this.props, "getServiceLineList", "/rest/getServicesByASNLineId", asnLineId, poLineId);
      }

   }
   rejectPOSheet = () => {
      swal("Enter reason for rejection..", {
         content: "input",
         showCancelButton: true,
         cancelButtonText: "Cancel",
         buttons: true,
         dangerMode: true,
      })
         .then((value) => {
            this.props.changeASNStatus(true); this.props.changeLoaderState(true);
            commonSubmitWithParam(this.props, "rejectServiceSheet", "/rest/rejectServiceEntry", this.state.asnDetails.asnId, value);
         }).catch(err => {
         });
   }

   rejectPO = () => {
      swal("Enter reason for rejection", {
         content: "input",
         showCancelButton: true,
         cancelButtonText: "Cancel",
         buttons: true,
         dangerMode: true,
      })
         .then((value) => {
            this.props.changeASNStatus(true);
            this.props.changeLoaderState(true);
            commonSubmitWithParam(this.props, "rejectServiceSheet", "/rest/rejectServiceSheet", this.state.asnDetails.asnId, value)
         }).catch(err => {
         });
   }

   onComfirmationOfCancelAsn(e) {
     
      swalWithTextBox(e, this, "onCancelASN");
     
   }

   onCancelASN = (value) => {
      //  this.props.changeLoaderState(true);
         commonSubmitWithParam(this.props, "cancelASN", "/rest/cancelASN", this.state.asnDetails.asnId, value)
      }
   
   onComfirmationOfCancelSsn(e) {
     
         swalWithTextBox(e, this, "onCancelSSN");
        
      }

   onCancelSSN = (value) => {
         //  this.props.changeLoaderState(true);
          //  commonSubmitWithParam(this.props, "cancelSSN", "/rest/cancelASN", this.state.asnDetails.asnId, value)
          commonSubmitWithParam(this.props, "cancelSSN", "/rest/cancelSSN", this.state.asnDetails.asnId, value)
         }

   handleSheet = (e) => {

            let { invoiceAmountByUser, basicAmount } = this.state.asnDetails;
            if (invoiceAmountByUser >= basicAmount || (basicAmount - basicAmount) >= 1) {
               alert("Invoice amount mismatched");
               return;
            }
            this.state.serviceLineArray.map((serviceLine) => {
              let balAmount =  serviceLine.balanceLimit;
           if(serviceLine.contractPo == 'Y'){
                  if(basicAmount > balAmount ){
                     alert("Balance Limit exceed");
                     e.stopImmediatePropagation();
                  return
                  
                  }
               }
            })
      
            this.props.changeASNStatus(true);
            this.props.changeLoaderState(true);
            // console.log("eeee",e);
            this.setState({ loadASNDetails: true, loadASNLineList: true, saveServiceLines: true });
            commonSubmitFormValidation(e, this, "submitServiceSheet", "/rest/submitServiceSheet")
            this.props.changeLoaderState(false);
         }
         getSerializedForm(form) {
            return serialize(form, {
               hash: true,
               empty: true
            });
         }
   
   selectDate = (e) => {
            this.props.changeASNStatus(true);
            swalWithDate(e, this, "handleDateSelect", 'Please enter Posting Date');
         }
   handleDateSelect = (date) => {
            commonSubmitWithParam(this.props, "asnUnLoadResponse", "/rest/asn105", this.state.asnDetails, date);
         }
         onSave = (e) => {
            e.preventDefault();
            const form = e.currentTarget.form;
            let data = this.getSerializedForm(form);
            this.props.changeASNStatus(true);
            // commonSubmitFormNoValidation(e,this,"asnUnLoadResponse","/rest/asn105")
            SwalNew.fire({
               title: 'Please enter Posting Dat',
               icon: 'info',
               html: ' <input type="date" id="postingDate" name="value">',
               confirmButtonText: 'submit'
            })
               .then((result) => {
      
                  let postingDate = document.getElementById('postingDate').value;
                  // var postingDate =datetype.getElementById("postingDate").value.value;
                  this.setState(prevState => ({ asnDetails: { ...prevState.asnDetails, postingDate } }), () => {
                     data = { ...data, postingDate }
                     commonSubmitFormNoValidationWithData(data, this, "asnUnLoadResponse", "/rest/asn105")
                  })
      
               });
         }

         onStorageLocationUpdate = () => {
            const { selectedStorageLocationListItem, asnLineArray } = this.state;
            const index = asnLineArray.findIndex(s => s.poLineId == selectedStorageLocationListItem.poLineId)
            asnLineArray[index] = { ...asnLineArray[index], asnLineCostCenter: selectedStorageLocationListItem.asnLineCostCenter }
            let isValid = true;
            let totalQty = 0;
            selectedStorageLocationListItem.asnLineCostCenter.map((item) => {
               if (isEmpty(Number(item.quantity)) || isEmpty(item.storageLocation)) isValid = false;
               if (item.quantity) totalQty = Number(item.quantity) + Number(totalQty);
               return item;
            });
            if (!isValid) return alert('Please fill all values')
            if (Number(totalQty) != Number(selectedStorageLocationListItem.deliveryQuantity)) return alert('sum of all quantity is must be equal to line delivery quantity');
            this.setState({ asnLineArray, openStorageLocationModal: false });
         }

         onCostUpdate = () => {
            const { selectedAsnListItem, serviceLineArray } = this.state;
            const index = serviceLineArray.findIndex(s => s.poLineId == selectedAsnListItem.poLineId)
            serviceLineArray[index] = { ...serviceLineArray[index], asnLineCostCenter: selectedAsnListItem.asnLineCostCenter }
            let isValid = true;
            let totalQty = 0;
            selectedAsnListItem.asnLineCostCenter.map((item) => {
               if (isEmpty(Number(item.quantity)) || isEmpty(item.costCenter)) isValid = false;
               if (item.quantity) totalQty = Number(item.quantity) + Number(totalQty);
               return item;
            });
            if (!isValid) return alert('Please fill all values')
            if (Number(totalQty) != Number(selectedAsnListItem.deliveryQuantity)) return alert('sum of all quantity is must be equal to line delivery quantity');
            this.setState({ serviceLineArray, openModal: false });
         }

         onCostChange = (index, name, { target }) => {
            const { selectedAsnListItem } = this.state;
            let asnLineCostCenter = !isEmpty(selectedAsnListItem.asnLineCostCenter) ? selectedAsnListItem.asnLineCostCenter : [];
            asnLineCostCenter[index] = {
              //...asnLineCostCenter[index], [name]: target.value
              ...asnLineCostCenter[index], [name]: target.value?target.value:target.innerText!=undefined?target.innerText:""
            }
            this.setState({ selectedAsnListItem: { ...selectedAsnListItem, asnLineCostCenter }})
         }

         onStorageLocationChange = (index, name, { target }) => {
      
            const { selectedStorageLocationListItem } = this.state;
            let asnLineCostCenter = !isEmpty(selectedStorageLocationListItem.asnLineCostCenter) ? selectedStorageLocationListItem.asnLineCostCenter : [];
            asnLineCostCenter[index] = {
               ...asnLineCostCenter[index], [name]: target.value
            }
            this.setState({ selectedStorageLocationListItem: { ...selectedStorageLocationListItem, asnLineCostCenter } })
            if(this.state.isSameLocation){
               this.setState({selectedLocation: target.value});
            }else{
               this.setState({selectedLocation: undefined });
            }
         }


         // onFundUpdate = () => {
         //    const { selectedAsnFundListItem, serviceLineArray } = this.state;
         //    const index = serviceLineArray.findIndex(s => s.poLineId == selectedAsnFundListItem.poLineId)
         //    serviceLineArray[index] = { ...serviceLineArray[index], asnLineCostCenter: selectedAsnFundListItem.asnLineCostCenter }
         //    let isValid = true;
         //    let totalQty = 0;
         //    selectedAsnFundListItem.asnLineCostCenter.map((item) => {
         //       if (isEmpty(Number(item.quantity)) || isEmpty(item.fundCenter)) isValid = false;
         //       if (item.quantity) totalQty = Number(item.quantity) + Number(totalQty);
         //       return item;
         //    });
         //    if (!isValid) return alert('Please fill all values')
         //    if (Number(totalQty) != Number(selectedAsnFundListItem.deliveryQuantity)) return alert('sum of all quantity is must be equal to line delivery quantity');
         //    this.setState({ serviceLineArray, openfundModal:false });
         // }

         // onFundChange = (index, name, { target }) => {
         //    const { selectedAsnFundListItem } = this.state;
         //    let asnLineCostCenter = !isEmpty(selectedAsnFundListItem.asnLineCostCenter) ? selectedAsnFundListItem.asnLineCostCenter : [];
         //    asnLineCostCenter[index] = {
         //       ...asnLineCostCenter[index], [name]: target.value
         //    }
         //    this.setState({ selectedAsnFundListItem: { ...selectedAsnFundListItem, asnLineCostCenter } })
         // }

         handleCheckBoxChange (state){
            //this.setState({isSameLocation:!this.state.isSameLocation})
            
            this.setState((state) => {
               // Important: read `state` instead of `this.state` when updating.
               return {count: this.state.isSameLocation}
             });
           // this.setState({isSameLocation:!this.state.isSameLocation})
            // this.setState((prevState) => {
            //    return {
            //       ...prevState,
            //       isSameLocation: !prevState.status
            //    }
            // })
            // let currState = event.target.checked;
            // this.setState({
            //    isSameLocation:currState
            // });
         
        }

        onRemoveCost = (index) => {
         const { selectedAsnListItem } = this.state;
         let asnLineCostCenter = selectedAsnListItem.asnLineCostCenter;
         asnLineCostCenter = asnLineCostCenter.filter((item, i) => i != index)
         this.setState({ selectedAsnListItem: { ...selectedAsnListItem, asnLineCostCenter } })
      }

      // onRemoveFund = (index) => {
      //    const { selectedAsnFundListItem } = this.state;
      //    let asnLineCostCenter = selectedAsnFundListItem.asnLineCostCenter;
      //    asnLineCostCenter = asnLineCostCenter.filter((item, i) => i != index)
      //    this.setState({ selectedAsnFundListItem: { ...selectedAsnFundListItem, asnLineCostCenter } })
      // }

      onRemoveStorageLocation = (index) => {
         const { selectedStorageLocationListItem } = this.state;
         let asnLineCostCenter = selectedStorageLocationListItem.asnLineCostCenter;
         asnLineCostCenter = asnLineCostCenter.filter((item, i) => i != index)
         this.setState({ selectedStorageLocationListItem: { ...selectedStorageLocationListItem, asnLineCostCenter } })
      }

      addNewCost = () => {
         const { selectedAsnListItem } = this.state;
         let asnLineCostCenter = !isEmptyDeep(selectedAsnListItem.asnLineCostCenter) ? selectedAsnListItem.asnLineCostCenter : [];
         asnLineCostCenter = asnLineCostCenter.concat({ quantity: 0, costCenter: '' })
         this.setState({ selectedAsnListItem: { ...selectedAsnListItem, asnLineCostCenter }, openModal: true })
      }

      addNewStorageLocation = () => {
         const { selectedStorageLocationListItem } = this.state;
         let asnLineCostCenter = !isEmptyDeep(selectedStorageLocationListItem.asnLineCostCenter) ? selectedStorageLocationListItem.asnLineCostCenter : [];
         asnLineCostCenter = asnLineCostCenter.concat({ quantity: 0, storageLocation: '' })
         this.setState({ selectedStorageLocationListItem: { ...selectedStorageLocationListItem, asnLineCostCenter }, openStorageLocationModal: true })
      }

      // addNewFund = () => {
      //    const { selectedAsnFundListItem } = this.state;
      //    let asnLineCostCenter = !isEmptyDeep(selectedAsnFundListItem.asnLineCostCenter) ? selectedAsnFundListItem.asnLineCostCenter : [];
      //    asnLineCostCenter = asnLineCostCenter.concat({ quantity: 0, costCenter: '' })
      //    this.setState({ selectedAsnFundListItem: { ...selectedAsnFundListItem, asnLineCostCenter }, openfundModal: true })
      // }

      onSelectConstCenter = (item) => {
         if (isEmpty(item.deliveryQuantity) || item.deliveryQuantity===0 || item.deliveryQuantity==="0") return alert('please enter qty')
         item = { ...item, asnLineCostCenter: !isEmptyDeep(item.asnLineCostCenter) ? item.asnLineCostCenter : [{ quantity: 0, costCenter: '' }] }
         this.setState({ selectedAsnListItem: item, openModal: true })
         //commonSubmitWithParam(this.props, "getCostcenterFromSAP", "/rest/getCostCenterfromSAP", item.orderNo, item.poLineNumber, item.plant);
         commonSubmitWithParam(this.props, "getCostcenterFromSAP", "/rest/getCostCenterfromSAP", item.poNo, item.poLineNumber, item.plant);
      }

      onSelectLocationCostCenter = (item) => {
         if (isEmpty(item.deliveryQuantity)) return alert('please enter qty')
         item = { ...item, asnLineCostCenter: !isEmptyDeep(item.asnLineCostCenter) ? item.asnLineCostCenter : [{ quantity: 0, storageLocation: '' }] }
         this.setState({ selectedStorageLocationListItem: item, openStorageLocationModal: true })
         this.setState({itemQuantity:item.deliveryQuantity})
         commonSubmitWithParam(this.props, "getStorageLocFromSAP", "/rest/getStorageLocFromSAP", item.poNumber, item.materialCode, item.plant);
        // commonSubmitWithParam(this.props, "getStorageLocFromSAP", "/rest/getStorageLocFromSAP", '00000000', '100001', '1810');
      }

      // onSelectFund = (item) => {
      //    if (isEmpty(item.deliveryQuantity)) return alert('please enter qty')
      //    item = { ...item, asnLineCostCenter: !isEmptyDeep(item.asnLineCostCenter) ? item.asnLineCostCenter : [{ quantity: 0, costCenter: '' }] }
      //    this.setState({ selectedAsnFundListItem: item, openfundModal: true })
      // }

      closeModal = () => {
         this.setState({ selectedAsnListItem: {}, openModal: false })
      }
      // closeFundModal = () => {
      //    this.setState({ selectedAsnFundListItem: {}, openfundModal: false })
      // }


      closeStorageLocationModal = () => {
         this.setState({ selectedStorageLocationListItem: {}, openStorageLocationModal: false })
      }

      onApproval = (e) => {
         this.props.changeASNStatus(true);
         this.props.changeLoaderState(true);
         commonSubmitFormValidation(e, this, "approveServiceSheet", "/rest/approveServiceSheetByDto")
         // commonSubmitWithParam(this.props,"approveServiceSheet","/rest/approveServiceSheet",this.state.asnDetails.asnId);
         // this.props.changeASNStatus(true);
      }

      onApprovalSecond = (e) => {
         this.props.changeASNStatus(true);
         this.props.changeLoaderState(true);
         commonSubmitFormValidation(e, this, "approveServiceSheet", "/rest/approveServiceSheet2")
      }

      onEdit = () => {
         this.setState({ canEdit: true })
      }

   addGateEntry() {
      let securityPOHeaderDto = this.state.securityPOHeaderDto;
      this.setState({ securityPOHeaderDto: securityPOHeaderDto });
    }
    handleSubmit = (e) => {
      commonSubmitWithParam(this.props, "getASNList", "/rest/getASN");
      document.getElementById("report").style.display = 'none';
     }
     handleSearch=(i)=>{
      commonSubmitWithParam(this.props,"securityASNSubmit","/rest/printSecurityGateInForm",this.state.asnId)                   
      // this.props.asnList.map((asn, index) => 
      //    (index === this.props.asnList.length-1?
      //    commonSubmitWithParam(this.props,"securityASNSubmit","/rest/printSecurityGateInForm",asn.advanceShipmentNoticeId)                   
      //    :""))
      }
   
   handleClick = async (e) => {
      await delay(2000);
      this.handleSubmit();
      //commonSubmitWithParam(this.props,"securityASNSubmit","/rest/printSecurityGateInForm",this.state.securityPOHeaderDto.asnHeaderId)
                                 
     }


   onSubmit = async(e) => {
    this.setState({ loadASNDetails: true, loadASNLineList: true });
   // this.handleReportSubmit(e);
   // commonSubmitForm(e,this, "securityASNSubmit","/rest/saveCommercialHeaderDetailsinASN") 
   commonSubmitForm(e,this, "handleASNResponse","/rest/saveCommercialHeaderDetailsinASN") 
   } 


     SwitchButtons(buttonId) {
      var hideBtn, showBtn, showBtn1 ;
      if (buttonId == 'report') {
        showBtn = 'gateIn';
        showBtn1 = 'print'
        hideBtn = 'report';
      }
      document.getElementById(hideBtn).style.display = 'none'; //step 2 :additional feature hide button
      document.getElementById(showBtn).style.display = ''; //step 3:additional feature show button
      document.getElementById(showBtn1).style.cssText="display:none"; 
   
    }
    setCostcenter(){
      let newCostcenterlist=[]
      //{(Object.entries(this.state.costCenterList)).map(item =>
      {(this.state.costCenterList).map(item =>
         newCostcenterlist.push(this.getItem(item))
          
       )}
        
       return newCostcenterlist;
    }

    getItem(item) {
      return {
         value:item.value +"-"+ item.description,
         // value:item[0],
        // description:item.description
         
      }
   }
    showDiv() {
      var x = document.getElementById("welcomeDiv");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
    
  render() {
     const securityPOHeaderDto = this.state.securityPOHeaderDto;
      const STOASNFetchDetails=this.state.STOASNFetchDetails;
    var displayDivForAsnLine = "block";
    if (this.props.po.isServicePO) {
       displayDivForAsnLine = "none"

    }
    var displayService = "none";
    var displayAsnLine = "block";
    
    if (!isEmpty(this.state.serviceLineArray) && !(this.state.asnShown)) {
       displayService = "block";
       displayAsnLine = "none";
    } else if (this.state.asnShown) {
       displayService = "none";
       displayAsnLine = "none";
    }

    var asnShown = {
       display: this.state.asnShown ? "block" : "none"
    };
    var asnListHidden = {
       display: this.state.asnShown ? "none" : "block"
    };
    //SSNVersion == '2' then VENADM ko save & submit button show nhi krna h
    let showBtn = ((isEmpty(this.state.asnDetails.status) || ["DR", "SSRJ"].includes(this.state.asnDetails.status)) && (this.props.po.isServicePO));
    if (this.props.SSNVersion == 2) {
       showBtn = showBtn && this.state.role != 'VENADM';
    }
    console.log(this.state.po.poDate,this.state.po.prDate,"this.state.po.poDate");
    
    return (
      <>

<React.Fragment>
        <Loader isLoading={this.state.isLoading} />
        <UserDashboardHeader />
        <div id="forAsnHideShow"  className={this.state.showHistory ? "none" : "row mt-2 block"}>
          <FormWithConstraints ref={formWithConstraints => this.asnFormDet = formWithConstraints}
                     onSubmit={this.onSubmit}
                     >
                        <div className="wizard-v1-content" style={{ display: displayAsnLine, marginTop:"80px" }} >
                        {/* {this.props.po.doctyp=="PO"? */}
                        {/* //this.props.po.outboundDeliveryNo==""? */}
                        <div className="card mt-100" style={{padding:" 10px"}}>
                        <div className="row mt-1"></div>
                                 <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"20px",color:"black"}}>INVOICE DETAILS</label>
                                 </div>
                                 <div className="row mt-1"></div>
                                  <div className="row">
                                    <label className="col-sm-2" >PO Number</label>
                                    <div className="col-sm-2 " >
                                    <label style={{color:"black"}} >{this.props.po.purchaseOrderNumber}</label>
                                    </div>
                                    <div className="col-sm-4 " >
                                       <input type="hidden" className="form-control" name="poNo" />
                                    </div>
                                   
                                    <label className="col-sm-2">ASN Number</label>
                                    <div className="col-sm-2 ">
                                       <label style={{color:"black"}} >{securityPOHeaderDto.asnNumber}</label>
                                    
                                       </div>
                                 </div>
                                 <div className="row mt-1"></div>
                                 <div className="row">
                                    <label className="col-sm-2" >Invoice Number</label>
                                    <div className={"col-sm-2 " + (isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR") || !this.state.canEdit) ? "" : "readonly")} >
                                    <input type="text" className="form-control" name="invoiceNo" 
                                      value={securityPOHeaderDto.invoiceNo} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.invoiceNo");  }}/>
                                    </div>
                                    <div className="col-sm-4 " >
                                       <input type="hidden" className="form-control"/>
                                    </div>
                                   
                                    <label className="col-sm-2">Invoice Date</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                    <input  type="date" className="form-control" name="invoiceDate" 
                                      value={securityPOHeaderDto.invoiceDate} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.invoiceDate");  }}/> 
                                       </div>
                                 </div>
                                 <div className="row mt-1">
                                    <label className="col-sm-2" >Transporter Name</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" name="transporterNo" 
                                      value={securityPOHeaderDto.transporterNo} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.transporterNo");  }}/>
                                    </div>
                                    <label className="col-sm-2">LR No.</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" 
                                          name="lrNumber"
                                          value={securityPOHeaderDto.lrNumber} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.lrNumber");  }}/>
                                    </div>

                                    <label className="col-sm-2">LR Date</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="date" className="form-control"
                                          name="lrDate"  />
                                    </div>
                                 </div>
                                 <div className="row mt-1">


                                    <label className="col-sm-2">Vehicle No</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" 
                                          name="vehicalNo"
                                          value={securityPOHeaderDto.vehicalNo} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.vehicalNo");  }} />
                                    </div>
                                    <label className="col-sm-2" >No of Packages</label>
                                    <div className="col-sm-2 ">
                                       <input type="number" className="form-control"
                                          name="numberOfPackages"
                                          value={securityPOHeaderDto.numberOfPackages} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.numberOfPackages");  }}/>
                                    </div>
                                 </div>
                                 <div className="row mt-1">
                                    <label className="col-sm-2">Gross Weight</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="number" className="form-control" name="grossWeight" 
                                       value={securityPOHeaderDto.grossWeight} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.grossWeight");  }} />
                                    </div>
                                    <label className="col-sm-2" >Tare Weight</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="number" className="form-control" name="tareWeight" 
                                       value={securityPOHeaderDto.tareWeight} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.tareWeight");  }} />
                                    </div>
                                    <label className="col-sm-2" >Net Weight</label>
                                    <div className="col-sm-2" >
                                       <input type="number" className="form-control" name="netWeight" 
                                       value={securityPOHeaderDto.grossWeight-securityPOHeaderDto.tareWeight} onChange={(e) => { commonHandleChange(e, this, "securityPOHeaderDto.netWeight");  }}/>
                                    </div>

                                 </div>
                                 <div className="row mt-1"></div>
                                 <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"20px"}}>DRIVER DETAILS</label>
                                 </div>
                                 <div className="row mt-1"></div>
                                 <div class="row  mt-1">
                                    <label class="col-sm-2">Name of Driver</label>
                                    <div class="col-sm-2">
                                        <input type="text" name="nameOfDriver" class="form-control"
                                        value={securityPOHeaderDto.nameOfDriver}
                                         onChange={(e)=>{commonHandleChange(e,this,"securityPOHeaderDto.nameOfDriver")}}
                                       />
                                    </div>
                                    <label class="col-sm-2">Mobile Number</label>
                                    <div class="col-sm-2">
                                        <input type="text" name="mobileNumber" class="form-control"
                                         value={securityPOHeaderDto.mobileNumber}
                                         onChange={(e)=>{commonHandleChange(e,this,"securityPOHeaderDto.mobileNumber")}}
                                       />
                                    </div>
                                    <label class="col-sm-2">Photo ID Proof</label>
                                    <div class="col-sm-2">
                                        <input type="text" name="photoIdProof" class="form-control" 
                                         value={securityPOHeaderDto.photoIdProof}
                                         onChange={(e)=>{commonHandleChange(e,this,"securityPOHeaderDto.photoIdProof")}}
                                        />
                                    </div>
                                </div>
                                <input
                                          type="hidden"
                                          className={"form-control"}
                                          name="doctyp"
                                          value={this.state.doctype}
                                         
                                         
                                        />
                                
                              </div>
                             {/* :

<div className="card mt-100" style={{padding:" 10px"}}>
<div className="row mt-1"></div>
<div className="col-sm-12 text-center mt-2 ">
   <label style={{fontSize:"20px",color:"black"}}>INVOICE DETAILS</label>
</div>
<div className="row mt-1"></div>
 <div className="row">
   <label className="col-sm-2" >PO Number</label>
   <div className="col-sm-2 " >
   <label style={{color:"black"}} >{this.props.po.purchaseOrderNumber}</label>
   </div>
   <div className="col-sm-4 " >
      <input type="hidden" className="form-control" name="poNo" />
   </div>
  
   <label className="col-sm-2">ASN Number</label>
   <div className="col-sm-2 ">
      <label style={{color:"black"}} >{STOASNFetchDetails.asnNumber}</label>
   
      </div>
</div>
<div className="row mt-1"></div>
<div className="row">
                                   
   <label className="col-sm-2" >Invoice Number</label>
   <div className="col-sm-2 " >
   <input type="text" className="form-control" name="invoiceNo" 
  
      value={STOASNFetchDetails.invoiceNo}
  
     onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.invoiceNo");  }}/>
   </div>
   <div className="col-sm-4 " >
      <input type="hidden" className="form-control"/>
   </div>
  
   <label className="col-sm-2">Invoice Date</label>
   <div className="col-sm-2 ">
   <input  type="date" className="form-control" name="invoiceDate" 
      
     value={formatDateWithoutTime(STOASNFetchDetails.invoiceDate)} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.invoiceDate");  }}/> 
      </div>
</div>
<div className="row mt-1">
   <label className="col-sm-2" >Transporter Name</label>
   <div className="col-sm-2 " >
      <input type="text" className="form-control" name="transporterNo"  
     
     value={STOASNFetchDetails.transporterNo} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.transporterNo");  }}/>
   </div>
   <label className="col-sm-2">LR No.</label>
   <div className="col-sm-2 ">
      <input type="text" className="form-control" 
          name="lrNumber"  
        
         value={STOASNFetchDetails.lrNumber} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.lrNumber");  }}/>
   </div>

   <label className="col-sm-2">LR Date</label>
   <div className="col-sm-2 ">
      <input type="date" className="form-control"
         name="lrDate"  
        
         /> 
   </div>
</div>
<div className="row mt-1">


   <label className="col-sm-2">Vehicle No</label>
   <div className="col-sm-2 " >
      <input type="text" className="form-control" 
         name="vehicalNo"  
       
         value={STOASNFetchDetails.vehicalNo} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.vehicalNo");  }} />
   </div>
   <label className="col-sm-2" >No of Packages</label>
   <div className="col-sm-2 ">
      <input type="number" className="form-control"
         name="numberOfPackages"  
        
         value={STOASNFetchDetails.numberOfPackages} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.numberOfPackages");  }}/>
   </div>
</div>
<div className="row mt-1">
   <label className="col-sm-2">Gross Weight</label>
   <div className="col-sm-2 "> 
      <input type="number" className="form-control" name="grossWeight" 
   
      value={STOASNFetchDetails.grossWeight} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.grossWeight");  }} />
   </div>
   <label className="col-sm-2" >Tare Weight</label>
   <div className="col-sm-2" >
      <input type="number" className="form-control" name="tareWeight"  
      
      value={STOASNFetchDetails.tareWeight} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.tareWeight");  }} />
   </div>
   <label className="col-sm-2" >Net Weight</label>
   <div className="col-sm-2" >
      <input type="number" className="form-control" name="netWeight"  
      
      value={STOASNFetchDetails.netWeight} onChange={(e) => { commonHandleChange(e, this, "STOASNFetchDetails.netWeight");  }}/>
   </div>

</div>
<div className="row mt-1"></div>
<div className="col-sm-12 text-center mt-2 ">
   <label style={{fontSize:"20px"}}>DRIVER DETAILS</label>
</div>
<div className="row mt-1"></div>
<div class="row  mt-1">
   <label class="col-sm-2">Name of Driver</label>
   <div class="col-sm-2">
       <input type="text" name="nameOfDriver"
        
          class="form-control"
       value={STOASNFetchDetails.nameOfDriver}
        onChange={(e)=>{commonHandleChange(e,this,"STOASNFetchDetails.nameOfDriver")}}
      />
   </div>
   <label class="col-sm-2">Mobile Number</label>
   <div class="col-sm-2">
       <input type="text" name="mobileNumber"  
     
       class="form-control"
        value={STOASNFetchDetails.mobileNumber}
        onChange={(e)=>{commonHandleChange(e,this,"STOASNFetchDetails.mobileNumber")}}
      />
   </div>
   <label class="col-sm-2">Photo ID Proof</label>
   <div class="col-sm-2">
       <input type="text" name="photoIdProof"  
      //  readOnly="true"
        class="form-control" 
        value={STOASNFetchDetails.photoIdProof}
        onChange={(e)=>{commonHandleChange(e,this,"STOASNFetchDetails.photoIdProof")}}
       />
   </div>
</div>

</div>
} */}
                              
                     <div className="wizard-v1-content " style={{ display: "none" }}>
                        {/* <div className={this.state.showHistory?"none ":"block"}> */}

                         <input type="hidden" disabled={isEmpty(this.state.asnDetails.asnId)} name="advanceShipmentNoticeId" value={this.state.asnDetails.asnId} />
                        <input type="hidden" name="status" value={this.state.asnDetails.status} />
                        <input type="hidden" name="postingDate" value={this.state.asnDetails.postingDate} />
                        <input type="hidden" disabled={this.state.psTypeFlag} name="po[pstyp]" value="9" /> 
                        <div className="row">
                           <label className="col-sm-1" >PO Number</label>
                           <input type="hidden" value={this.state.po.purchaseOrderNumber} name="po[purchaseOrderNumber]" />
                           <label className="col-sm-2" >{this.state.po.purchaseOrderNumber}</label>
                           <input type="hidden" value={this.state.po.poId} name="po[purchaseOrderId]" />
                           <input type="hidden" value={this.state.po.documentType} name="po[documentType]" />
                           <input type="hidden" value={formatDateWithoutTimeNewDate3(this.state.po.poDate)} name="po[date]"/> 
                           <input type="hidden" value={formatDateWithoutTimeNewDate3(this.state.po.prDate)} name="po[prDate]"/> 
                           <input type="hidden" value={this.state.po.userID} name="po[userID]" />

                           <label className="col-sm-2" >Vendor</label>
                           <label className="col-sm-2" >{this.state.po.vendorName}</label>
                           <label className="col-sm-2" >Version</label>
                           <label className="col-sm-2" >{this.state.po.versionNumber}</label>
                        </div>
                        {/* <div className="row mt-1">              
                        <label className="col-sm-1" >PO Date</label>
                        <label className="col-sm-2" >{this.state.po.poDate}</label> 
                        <label className="col-sm-2" >Inco Terms</label>
                        <label className="col-sm-2" >{this.state.po.incomeTerms}</label>
                        <label className="col-sm-2" >Status</label>
                        <label className="col-sm-2" >{this.state.po.status}</label>
                     </div>   */}

                     </div>
                     </div>
                     <div className={"wizard-v1-content card p-2"}>

<div style={{ display: displayAsnLine }}>
      <div className="row" >
         <div className="col-sm-3">
      {!['CLOSED', 'BOOKED', 'CANCELED'].includes(this.state.asnDetails.status) && <button style={{ display: this.state.cancelAsnButton }} className={"btn btn-primary"} type="button" onClick={(e)=>{this.onComfirmationOfCancelAsn(e)}}>Cancel ASN</button> } 
        {/*   { <button className={this.state.asnDetails.status=="CLOSED" || this.state.asnDetails.status=="BOOKED" || this.state.asnDetails.status=="CANCELED"?"none":"btn btn-primary mx-1 my-2 block"} type="button" onClick={e => this.onComfirmationOfCancelAsn(e)}>Cancel ASN</button>} */ }                         
         

         </div>




         {this.state.openStorageLocationModal && <div className="modal roleModal" id="locationModal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-md mt-100">
               <div className="modal-content">
                  <div className="modal-header">
                     Select storage location
                     <button type="button" className={"close " + this.props.readonly} onClickCapture={this.closeStorageLocationModal}>
                        &times;
                     </button>
                  </div>
                  <div className={"modal-body " + this.props.readonly}>
                     <div className="lineItemDiv min-height-0px">
                        <div className="row mt-1 px-4 py-1">
                           <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                              <label>Quantity</label>
                           </div>
                           <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                              <label>Storage location</label>
                           </div>
                           <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                              {/* <input type="checkbox" value={this.state.isSameLocation}   onChange={this.state.isSameLocation =! this.state.isSameLocation} ref="complete"/>
                              <input type="checkbox" checked={this.state.isSameLocation}  onChange={()=>{this.setState({ isSameLocation: !this.state.isSameLocation}, this.isSameLocation ? '': this.setState({selectedLocation:undefined}))}}   ref="complete"/>
                                 <label>Same</label> */}
                           </div>
                           <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                              <label>Action</label>
                           </div>
                        </div>
                        <div className="row mt-1 px-4 py-1 max-h-500px">
                           {!isEmpty(this.state.selectedStorageLocationListItem) && !isEmpty(this.state.selectedStorageLocationListItem.asnLineCostCenter) && this.state.selectedStorageLocationListItem.asnLineCostCenter.map((item, index) => {
                              return (<div className="row" key={index}>
                                 <div className="col-5">
                                    <input type="text" className="form-control" placeholder="Enter quantity" defaultValue={item.quantity} onChange={this.onStorageLocationChange.bind(this, index, 'quantity')} />
                                 </div>

                                 <div className="col-6">
                                    {/*
                                   line 1440 input
                                    value={item.quantity=this.state.itemQuantity}
                                             <select className="form-control" 
                                                value={item.storageLocation}
                                                onChange={this.onStorageLocationChange.bind(this,index,'storageLocation')}
                                             >
                                                <option value="">Select</option>
                                                {/* {(this.state.storageLocationList).map(strLoc =>
                                                   <option value={strLoc.value}>{strLoc.value+"-"+strLoc.display}</option>
                                                )} */}

                                                   {/* { <option value={this.getStorageLocation(this.state.asnDetails.asnId)}>{this.getStorageLocation(this.state.asnDetails.asnId)}</option>
                                                      } }
                                             </select>
                                                   </div>

                                                   */}

                                    <select className="form-control"
                                      value={/*this.state.selectedLocation*/ item.storageLocation}
                                       onChange={this.onStorageLocationChange.bind(this, index, 'storageLocation')}
                                                           
                                                         >
                                                            <option value="">Select</option>
                                                           {/* {(Object.entries(this.state.locationList)).forEach(([key, val]) =>{
                                                                 
                                                                 <option value='1111'>{222}</option>
                                                                // console.log("-----"+val);
                                                            })}  */}
                                                           {(Object.entries(this.state.locationList)).map(strLoc =>
                                                               <option value={strLoc[0]}>{strLoc[0]+'-'+strLoc[1]}</option>
                                                            )}
                                                         </select>
                                                      </div>
                                                      <div className="col-1">
                                                         <button
                                                            className={
                                                               "btn " +
                                                               (index === 0
                                                                  ? "btn-outline-success"
                                                                  : "btn-outline-danger")
                                                            }
                                                            onClick={index == 0 ? this.addNewStorageLocation : this.onRemoveStorageLocation.bind(this, index)}
                                                            type="button"
                                                         >
                                                            <i
                                                               class={"fa " + (index === 0 ? "fa-plus" : "fa-minus")}
                                                               aria-hidden="true"
                                                            ></i>
                                                         </button>
                                                      </div>
                                                   </div>
                                                   )
                                                })
                                                }
                                             </div>
                                          </div>
                                       </div>
                                       <div className={"modal-footer"}>
                                          <button
                                             className={"btn btn-success"}
                                             onClick={this.onStorageLocationUpdate}
                                             type="button"
                                          >
                                             Update
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              }


                              <div className="col-sm-6"></div>
                              <div className="col-sm-3">
                                 <input type="text" id="SearchTableDataInputThree" className="form-control" onKeyUp={searchTableDataThree} placeholder="Search .." />
                              </div>
                              <div className="w-100 mt-2">
                                 <div className="col-sm-12">
                                    <div className="table-responsive mt-2">
                                       <table className="my-table">
                                          <thead className="thead-light">
                                             <tr className="row m-0">
                                                <th className="col-1">Line No.</th>
                                                <th
                                                   className={
                                                      (this.state.grn || this.state.asnDetails.status === "GRN") && !this.state.qc ? "col-3" : this.state.qc ? "col-6" : "col-7"
                                                   }
                                                >Material Description </th>
                                                {/* <th className="col-2 text-right" style={{disable:this.props.createASNFlag}}> PO Qty </th> */}

                                                {
                                                this.props.po.doctyp=="STO"?
                                                <th className="col-1">PO Qty </th>:<th className="col-1"> Qty </th>}
                                                <th className="col-1">Bal Qty</th>
                                                <th className="col-1"> UOM </th> 
                                                <th className="col-1"> Rate </th>
                                                {/* <th>Currency</th>  */}
                                                {/* <th>Plant</th> */}
                                                {this.state.grn || this.state.qc || this.state.asnDetails.status === "GRN" ? <>
                                                   <th className="col-1">Rejected Qty</th>
                                                </> : <></>}
                                                {this.state.grn || this.state.asnDetails.status === "GRN" ? <>
                                                   <th className="col-1">Shortage Qty</th>
                                                   <th className="col-1">Confirm Qty</th>
                                                   <th className="col-1">Storage Location</th>
                                                </> : <></>}
                                             </tr>
                                          </thead>
                                          <tbody id="DataTableBodyThree">
                                             {
                                                this.state.asnLineArray.map((asnLine, index) =>
                                                   <tr className="row m-0">
                                                      {/* onClick={(e)=>{this.onClickAsnLine(asnLine.asnLineId,asnLine.poLineId,index)}}*/}


                                                      <td className="col-1">
                                                         <input type="hidden" name={"asnLineList[" + index + "][advanceShipmentNoticeLineId]"} value={asnLine.asnLineId} disabled={isEmpty(asnLine.asnLineId)} />
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][purchaseOrderLineId]"} value={asnLine.poLineId} />
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][lineItemNumber]"} value={asnLine.poLineNumber} />
                                                         {removeLeedingZeros(asnLine.poLineNumber)}</td>
                                                      <td className={
                                                         (this.state.grn || this.state.asnDetails.status === "GRN") && !this.state.qc ? "col-3" : this.state.qc ? "col-6" : "col-7"
                                                      }>
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][code]"} value={asnLine.materialCode} />
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][name]"} value={asnLine.materialName} />
                                                         {asnLine.materialCode}-{asnLine.materialName}
                                                      </td>
                                                      {/* <td className="col-2 text-right">
                                    <input type="hidden" name={"asnLineList["+index+"][poLine][poQuantity]"} value={asnLine.poQty} />
                                    {getDecimalUpto(asnLine.poQty,3)}
                                 </td> */}
                                 {this.props.po.doctyp=="STO"?

                                       <td className="col-1"> <input type="hidden" name={"asnLineList[" + index + "][deliveryQuantity]"} value={asnLine.poQty} />
                                                               {asnLine.poQty}</td>
                                                     : 
                                                     <td className="col-1">
                                                     <input type="text" 
                                                   //onKeyDown={textRestrict}
                                                     placeholder="0.000"
                                                           className={"form-control " + ((this.state.asnDetails.status === 'DR' || isEmpty(this.state.asnDetails.status) || !this.state.canEdit) ? "" : "readonly")}
                                                           name={"asnLineList[" + index + "][deliveryQuantity]"}
                                                           defaultValue={(this.props.po.isServicePO) ?
                                                              1 :this.state.asnLineArray[index].deliveryQuantity}
                                                           onChange={(e) => {textRestrict(e);
                                                              (this.props.po.isServicePO)
                                                              ? e.preventDefault() : this.calculateBasicAmount(e, index, "asnLineArray")
                                                           }} />
                                                     </td>
                                                     
                                                      }
                                                      <td className="col-1">
                                    <input type="hidden" name={"asnLineList["+index+"][poLine][balanceQuantity]"} value={asnLine.balQty} />
                                    {asnLine.balQty}
                                 </td> 
                                                      <td className="col-1">
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][uom]"} value={asnLine.uom} />
                                                         {asnLine.uom}
                                                      </td>
                                                      {/* <td>
                                    <input type="hidden" name={"asnLineList["+index+"][poLine][balanceQuantity]"} value={asnLine.balQty} />
                                    {asnLine.balQty}
                                 </td> */}
                                                     <td className="col-1 text-right">



                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][rate]"} value={getDecimalUpto(asnLine.poRate)} />
                                                         {getCommaSeperatedValue(getDecimalUpto(asnLine.poRate, 2))}
                                                         <input type="hidden" name={"asnLineList[" + index + "][poLine][plant]"} value={asnLine.plant} />
                                                      </td>
                                                      {/*<td>{asnLine.plant}</td> */}
                                                      {this.state.grn || this.state.qc || this.state.asnDetails.status === "GRN" ? <>
                                                         <td className="col-1"><input type="text" name={"asnLineList[" + index + "][rejectedQuantity]"} value={asnLine.rejectedQuantity}
                                                            onChange={(e) => { commonHandleChange(e, this, "asnLineArray." + index + ".rejectedQuantity") }} className="form-control" /></td>
                                                      </> : <></>}
                                                      {this.state.grn || this.state.asnDetails.status === "GRN" ? <>
                                                         <td className="col-1"><input type="text" name={"asnLineList[" + index + "][shortageQuantity]"} value={asnLine.shortageQuantity}
                                                            onChange={(e) => { commonHandleChange(e, this, "asnLineArray." + index + ".shortageQuantity") }} className="form-control" /></td>
                                                         <td className="col-1"><input type="text" name={"asnLineList[" + index + "][confirmQuantity]"}
                                                            value={getDecimalUpto(asnLine.deliveryQuantity - asnLine.rejectedQuantity - asnLine.shortageQuantity,3)}
                                                            className="form-control readonly" /></td>
                                                         <td className="col-1">

                                                            <button className={"btn btn-sm btn-outline-primary mgt-10 "} onClick={this.onSelectLocationCostCenter.bind(this, asnLine)} type="button" data-toggle="modal" data-target="#locationModal">
                                                               select
                                                            </button>

                                                            {
                                                               !isEmpty(asnLine.asnLineCostCenter) && asnLine.asnLineCostCenter.map((item, i) => {
                                                                  return (
                                                                     <>
                                                                        <input type="hidden" name={"asnLineList[" + index + "][asnLineCostCenter][" + i + "][asnLine]"} value={asnLine.asnLineId} />
                                                                        <input type="hidden" name={"asnLineList[" + index + "][asnLineCostCenter][" + i + "][storageLocation]"} value={item.storageLocation} />
                                                                        <input type="hidden" name={"asnLineList[" + index + "][asnLineCostCenter][" + i + "][quantity]"} value={item.quantity} />
                                                                     </>
                                                                  )
                                                               })
                                                            }
                                                            {/* <select className={"form-control"} name={"asnLineList["+index+"][storageLocation]"}
                                 value={asnLine.storageLocation}
                                 onChange={(event) => commonHandleChange(event, this, "asnLineArray."+index+".storageLocation")}>
                                 <option value="">Select</option>
                                 {(this.state.storageLocationList).map(strLoc =>
                                    <option value={strLoc.value}>{strLoc.value+"-"+strLoc.display}</option>
                                 )}
                              </select> */}

                                                         </td>
                                                      </> : <></>}
                                                   </tr>
                                                )
                                             }
                                          </tbody>
                                       </table>
                                    </div>
                                    <div className="col-sm-12 text-center mt-2 ">
                                    <button type="submit" className="btn btn-primary mr-1 " id="report"
                        onClick={this.handleClick}
                        >Report</button>
                           {/* {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                              <button type="button" className="btn btn-success mr-1 " id="gateIn" 
                              
                               onClick={ (e)=> {commonSubmitWithParam(this.props,"securityASNSubmit","/rest/getInSecurityStatusUpdate",asn.advanceShipmentNoticeId); document.getElementById("gateIn").style.display = 'none';this.showDiv()}}
                             // onClick={(e)=>{this.handleGateIn(e)}}
                              >Gate IN</button>
                              
                              :"")

    )}    */}

{this.state.reportingDone && this.props.asnStatus!="GATE_IN" && (
  <div>
    <button type="button" className="btn btn-success mr-1 " id="gateIn"  onClick={ (e)=> {commonSubmitWithParam(this.props,"securityASNSubmit","/rest/getInSecurityStatusUpdate",this.state.asnId);this.showDiv()}}>Gate In</button>
    
  </div>
)} 
                                 {/* <div id="welcomeDiv"  style={{display:"none"}}> */}
                                 {this.state.reportingDone && this.props.asnStatus==="GATE_IN" &&
                               <button type="button" className="btn btn-success mr-1 " id="gateIn" 
                               data-toggle="modal" data-target="#getReportModal"
                               onClick={this.handleSearch}
                               >Print</button>
                                 }
                               {/* </div>                              */}
                              
                              {/* {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                                    <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.33:44300/sap/bc/yweb03_ws_23?sap-client=110&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK`}
                                     target="_blank">Print Form</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                    :"")

)}    */}
  
                        </div>
                      </div>
                              </div>
                           </div>
                        </div>
                        { 

                        <div style={{ display: displayService }}>
                        <div className="row" >
                           <div className="col-sm-9"></div>
                           <div className="col-sm-3">
                              <input type="text" id="SearchTableDataInputThree" className="form-control" onKeyUp={searchTableDataThree} onKeyDown={this.controlSubmit} placeholder="Search .." />
                           </div>
                           {["SSRJ", "SESRJ"].includes(this.state.asnDetails.status) &&
                              <div style={{ marginLeft: 18 }}>
                                 <p><span>Rejection Reason: </span> {this.state.asnDetails.description}</p>
                              </div>
                           }
                     
                           {this.state.openModal && <div className="modal roleModal" id="updateRoleModal show" style={{ display: 'block' }}>
                              <div className="modal-dialog modal-md mt-100">
                                 <div className="modal-content">
                                    <div className="modal-header">
                                       Select Costs
                                       <button type="button" className={"close " + this.props.readonly} onClickCapture={this.closeModal}>
                                          &times;
                                       </button>
                                    </div>
                                    <div className={"modal-body " + this.props.readonly}>
                                       <div className="lineItemDiv min-height-0px">
                                          <div className="row mt-1 px-4 py-1">
                                             <div className="col-5 mb-1 border_bottom_1_e0e0e0">
                                                <label>Quantity</label>
                                             </div>
                                             <div className="col-5 mb-1 border_bottom_1_e0e0e0">
                                                <label>Cost center</label>
                                             </div>
                                             <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                                <label>Action</label>
                                             </div>
                                          </div>
                        <div className="row mt-1 px-4 py-1 max-h-1000px">
                           {!isEmpty(this.state.selectedAsnListItem) && !isEmpty(this.state.selectedAsnListItem.asnLineCostCenter) && this.state.selectedAsnListItem.asnLineCostCenter.map((item, index) => {
                              return (<div className="row" key={index}>
                                 <div className="col-5">
                                    <input type="text" className="form-control" placeholder="Enter quantity" value={item.quantity} onChange={this.onCostChange.bind(this, index, 'quantity')} onKeyDown={this.controlSubmit} />
                                 </div>
   
                  <div className="w-full flex flex-wrap">

                  <Autocomplete
                   disablePortal
                   options={this.setCostcenter()} 
                   getOptionLabel={(option) => typeof option === "string" ? option : option.value}
                   onChange={this.onCostChange.bind(this, index, 'costCenter')}
                   value={item.costCenter}
                   style={{ width: '150px' }}
                   onKeyDown={this.controlSubmit}
                  renderInput={(params) => <TextField value={item.costCenter} {...params}   />}
                />
   
                                   {/* <select className="form-control"
                                       value={item.costCenter}
                                       onChange={this.onCostChange.bind(this, index, 'costCenter')}
                                    >
                                       <option value="">Select</option>
                                       {(this.props.costCenterList).map(item =>
                                         //<option value={item.value}>{item.value}-{item.display}</option>
                                         <option value={item.value}>{item.value}</option>
                                       )}
                                    </select> */}
                                 </div>
                     
                     <div className="col-2">
                        <button
                           className={
                              "btn " +
                              (index === 0
                                 ? "btn-outline-success"
                                 : "btn-outline-danger")
                           }
                           onClick={index == 0 ? this.addNewCost : this.onRemoveCost.bind(this, index)}
                           type="button"
                        >
                                       <i
                                          class={"fa " + (index === 0 ? "fa-plus" : "fa-minus")}
                                          aria-hidden="true"
                                       ></i>
                                    </button>
                                 </div>
                              </div>
                              )
                           })
                           }
                        </div>
                     </div>
                  </div>
                  {this.state.role != 'SSNAPP'?
                  <div className={"modal-footer"}>
                     {['', 'SSIP'].includes(this.state.asnDetails.status) && <button
                        className={"btn btn-success"}
                        onClick={this.onCostUpdate}
                        type="button"
                     >
                        Update
                     </button>
                     }
                  </div>:""}
               </div>
            </div>
         </div>
         }

{/* {this.state.openfundModal && <div className="modal roleModal" id="fundsmodal show" style={{ display: 'block' }}>
                              <div className="modal-dialog modal-md mt-100">
                                 <div className="modal-content">
                                    <div className="modal-header">
                                       Select funds
                                       <button type="button" className={"close " + this.props.readonly} onClickCapture={this.closeFundModal}>
                                          &times;
                                       </button>
                                    </div>
                                    <div className={"modal-body " + this.props.readonly}>
                                       <div className="lineItemDiv min-height-0px">
                                          <div className="row mt-1 px-4 py-1">
                                             <div className="col-5 mb-1 border_bottom_1_e0e0e0">
                                                <label>Quantity</label>
                                             </div>
                                             <div className="col-5 mb-1 border_bottom_1_e0e0e0">
                                                <label>Funds</label>
                                             </div>
                                             <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                                <label>Action</label>
                                             </div>
                                          </div>
                        <div className="row mt-1 px-4 py-1 max-h-500px">
                           {!isEmpty(this.state.selectedAsnFundListItem) && !isEmpty(this.state.selectedAsnFundListItem.asnLineCostCenter) && this.state.selectedAsnFundListItem.asnLineCostCenter.map((item, index) => {
                              return (<div className="row" key={index}>
                                 <div className="col-5">
                                    <input type="text" className="form-control" placeholder="Enter quantity" value={item.quantity} onChange={this.onFundChange.bind(this, index, 'quantity')} />
                                 </div>
   
                                 <div className="col-5">
   
                                    <select className="form-control"
                                       value={item.fundCenter}
                                       onChange={this.onFundChange.bind(this, index, 'fundCenter')}
                                    >
                                       <option value="">Select</option>
                                       {(this.props.ssnFundList).map(item =>
                                         //<option value={item.value}>{item.value}-{item.display}</option>
                                         <option value={item.value}>{item.value}</option>
                                       )}
                                    </select>
                                 </div>
                     
                     <div className="col-2">
                        <button
                           className={
                              "btn " +
                              (index === 0
                                 ? "btn-outline-success"
                                 : "btn-outline-danger")
                           }
                           onClick={index == 0 ? this.addNewFund : this.onRemoveFund.bind(this, index)}
                           type="button"
                        >
                                       <i
                                          class={"fa " + (index === 0 ? "fa-plus" : "fa-minus")}
                                          aria-hidden="true"
                                       ></i>
                                    </button>
                                 </div>
                              </div>
                              )
                           })
                           }
                        </div>
                     </div>
                  </div>
                  <div className={"modal-footer"}>
                     {['', 'SSIP'].includes(this.state.asnDetails.status) && <button
                        className={"btn btn-success"}
                        onClick={this.onFundUpdate}
                        type="button"
                     >
                        Update
                     </button>
                     }
                  </div>
               </div>
            </div>
         </div>
         } */}
                     
                     
            <hr className="w-100"></hr>
                     
         {/* {
           (this.props.asnLineList).map((asn,index)=>
                                
            <div className="col-sm-12 mt-2">
            { asn.advanceshipmentnotice!=null && index==0 ? 
            <div className="row"> 
            {<label className="col-sm-1" >SSN No</label>}
           {<span className="col-sm-2"> {asn.advanceshipmentnotice.serviceSheetNo===null?"":asn.advanceshipmentnotice.serviceSheetNo}</span>}
           {<label className="col-sm-1" >Date</label>}
           {<span className="col-sm-2"> {formatDateWithoutTime(asn.advanceshipmentnotice.created ==null?"":asn.advanceshipmentnotice.created)}</span>}
           {<label className="col-sm-1" >Created By</label> }
            {<span className="col-sm-5"> {asn.createdBy.userDetails.name==null?"":asn.createdBy.userDetails.name}</span>}  
            {<label className="col-sm-1" >Po No</label>}
          {<span className="col-sm-2">{asn.advanceshipmentnotice.po.purchaseOrderNumber}</span>}
           {<label className="col-sm-1" >Vendor Name</label>}
            {<span className="col-sm-6"> {asn.advanceshipmentnotice.po.vendorName==null?"":asn.advanceshipmentnotice.po.vendorName}</span>}
         
            {!['CLOSED', 'BOOKED', 'CANCELED'].includes(this.state.asnDetails.status) && <button className={"btn btn-primary"} type="button" style={{ display: this.state.cancelSsnButton }} onClick={e => this.onComfirmationOfCancelSsn(e)}>Cancel SSN</button>}
            </div>
            :""
            }</div>)}  */}
                     
                     
                          
                           
            <div className="lineItemDiv mt-2">
               <div className="col-sm-12">

               <div className="row mt-1"></div>
                                 <div className="row">
                                 {this.props.po.isServicePO?
                                 
                                 <><>

                                              <div className="col-sm-12 text-center mt-2 ">
                                                 <label style={{ fontSize: "20px", color: "black" }}>INVOICE DETAILS</label>
                                              </div>
                                              {/* <div className="row mt-20"></div> */}
                                              <label className="col-sm-2 mt-20">Invoice Number <span className="redspan">*</span></label>
                                              <div className="col-sm-2 mt-20 ">
                                                 <input type="text" className="form-control" name="invoiceNo" onKeyDown={this.controlSubmit}
                                                    value={this.state.asnDetails.invoiceNo}
                                                    maxLength={16}
                                                    onChange={(e) => { commonHandleChange(e, this, "asnDetails.invoiceNo"); } } />
                                              </div>
                                             <label className="col-sm-2 mt-20">Invoice Date <span className="redspan">*</span></label>
                                             <div className="col-sm-2 mt-4">
                                              <input type="date" className="form-control" onKeyDown={this.controlSubmit}
                                                value={formatDateWithoutTimeNewDate(this.state.asnDetails.invoiceDate)}
                                                  max="9999-12-31"                                                 
                                                  name="invoiceDate" 
                                                  onChange={(event) => {
                                                    if (event.target.value.length < 60) {
                                                       commonHandleChange(event, this, "asndetails.invoiceDate", "reports");
                                                    }
                                                 } } />
                                              </div>

                                              <label className="col-sm-2 mt-20">Service Location</label>
                                              <div className="col-sm-2 mt-20 ">
                                                 <input type="text" className="form-control" name="serviceLocation" 
                                                 onKeyDown={this.controlSubmit}
                                                    value={this.state.asnDetails.serviceLocation}
                                                    onChange={(e) => { commonHandleChange(e, this, "asnDetails.serviceLocation"); } } />
                                              </div>
                                           </>
                                           
                                           <div className="col-sm-12">
                                           <div className="row mt-2">
                                           <label className="col-sm-2 mt-4">Period</label>
                                           <div className="col-sm-2 mt-4">

                                                 <input type="date" className="form-control" onKeyDown={this.controlSubmit}
                                                  value={formatDateWithoutTimeNewDate(this.state.asnDetails.serviceFromDate)} name="serviceFromDate" onChange={(event) => {
                                                    if (event.target.value.length < 60) {
                                                       commonHandleChange(event, this, "asndetails.serviceFromDate", "reports");
                                                    }


                                                 } } />
                                              </div>
                                              <label className="mt-4">To </label>
                                           <div className="col-sm-2 mt-4">
                                           <input type="date" className="form-control" onKeyDown={this.controlSubmit}
                                           value={formatDateWithoutTimeNewDate(this.state.asnDetails.serviceToDate)} name="serviceToDate" onChange={(event) => {
                                          if (event.target.value.length < 60) {
                                           commonHandleChange(event, this, "asndetails.serviceToDate", "reports")
                                                     }


                          }} />
                       </div> 

                       <label className="col-sm-2 mt-4">Posting Date <span className="redspan">*</span></label>
                      
                       <div className="col-sm-2 mt-4">
                                                 <input type="date" className="form-control" onKeyDown={this.controlSubmit}
                                                  value={formatDateWithoutTimeNewDate(this.state.asnDetails.servicePostingDate)}
                                                  min={this.enablelastDateofLastMonth()}
                                                 // max={new Date()}
                                                  //max="9999-12-31"
                                                  name="servicePostingDate" 
                                                  onChange={(event) => {
                                                    if (event.target.value.length < 60) {
                                                       commonHandleChange(event, this, "asndetails.servicePostingDate", "reports");
                                                    }
                                                 } } />
                 
                                              
                                              </div>
</div>

                                              </div>
                                              <div className="col-sm-12">
                                              <div className="row mt-4">
                                    <label className="col-sm-2">Upload Invoice
                                    </label>
                                    <div className="col-sm-3">
                                       <div className="input-group">
                                          <input type="hidden" disabled={(isEmpty(this.state.asnDetails.invoiceDoc.attachmentId)) || (this.state.asnDetails.invoiceApplicable ? false : true)} name="invoice[attachmentId]" value={this.state.asnDetails.invoiceDoc.attachmentId} />
                                          <input type="hidden" name="invoice[fileName]" value={this.state.asnDetails.invoiceDoc.fileName} disabled={(isEmpty(this.state.asnDetails.invoiceDoc.attachmentId)) || (this.state.asnDetails.invoiceApplicable ? false : true)} />
                                          <input type="file" onChange={(e) => { commonHandleFileUploadInv(e, this, "asnDetails.invoiceDoc") }} disabled={(this.state.asnDetails.invoiceApplicable ? false : true)}
                                             className={"form-control "} name="invoiceAttach" required />
                                          {/* <FieldFeedbacks for="invoiceAttach">
                                             <FieldFeedback when={(value) => isEmpty(value) && isEmpty(this.state.snDetails.invoiceDoc.attachmentId)}> Inovice File Mandatory</FieldFeedback>
                                          </FieldFeedbacks> */}
                                          <div className="input-group-append">
                                             <button className="btn btn-danger clearFile" onClick={() => { this.clearInoviceAttachment() }} type="button">X</button>
                                          </div>
                                       </div>
                                       <div disabled={this.state.asnDetails.invoiceApplicable ? false : true}><a href={API_BASE_URL + "/rest/download/" + this.state.asnDetails.invoiceDoc.attachmentId}>{this.state.asnDetails.invoiceDoc.fileName}</a></div>

                                    </div>
                                 </div></div>
                                              </>
                                           :""}
                                 
                                 </div>
                                 

                                 <div className="row mt-80"></div>

                  <div className="table-responsive">
                     <table className="my-table">
                        <thead className="thead-light">
                           <tr className="row m-0">
                              <th className="col-1">PO Line No.</th>
                              <th className="col-1">Service No.</th>
                              <th className="col-2">Service Description</th>
                              <th className="col-2 text-right"> PO Qty </th>
                              <th className="col-1"> UOM </th>
                              <th className="col-1"> Qty </th>
                              <th className="col-1"> Bal Qty </th>
                              <th className="col-2 text-right"> Rate </th>
                              <th className="col-1 text-right"> Cost center </th>
                              {/* <th className="col-1"> Fund center</th> */}
                           </tr>
                        </thead>
                        <tbody id="DataTableBodyThree">
                           {
                              this.state.serviceLineArray.map((serviceLine, index) => {
                                 let el = this.state.asnLineMap[serviceLine.parentPOLineId ? serviceLine.parentPOLineId : serviceLine.parentLineId];
                                 return (
                                    <tr className="row m-0">
                     
                                    <td className="col-1">
                                       {/* <input type="hidden" name={"asnLineList["+this.state.asnLineMap[serviceLine.parentPOLineId]+"][serviceLineList]["+index+"][poLine][lineItemNumber]"} value={serviceLine.parentLineNumber} /> */}
                                       {removeLeedingZeros(serviceLine.parentLineNumber)}</td>
   
                                    <td className="col-1">
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][advanceShipmentNoticeLineId]"} value={serviceLine.asnLineId} disabled={isEmpty(serviceLine.asnLineId)} />
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][purchaseOrderLineId]"} value={serviceLine.poLineId} />
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][orderNo]"} value={serviceLine.orderNo} />
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][lineItemNumber]"} value={serviceLine.poLineNumber} />
                                       {removeLeedingZeros(serviceLine.poLineNumber)}</td>
                                    {
                                       !isEmpty(serviceLine.asnLineCostCenter) && serviceLine.asnLineCostCenter.map((item, i) => {
                                          return (
                                             <>
                                                {item.asnLineCostCenterId && <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][asnLineCostCenter][" + i + "][asnLineCostCenterId]"} value={item.asnLineCostCenterId} />}
                                                <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][asnLineCostCenter][" + i + "][advanceShipmentNoticeLineId]"} value={serviceLine.asnLineId} />
                                                <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][asnLineCostCenter][" + i + "][costCenter]"} value={item.costCenter} />
                                                {/* <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][asnLineCostCenter][" + i + "][fundCenter]"} value={item.fundCenter} /> */}
                                                <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][asnLineCostCenter][" + i + "][quantity]"} value={item.quantity} />
                                             </>
                                          )
                                       })
                                    }
                                    <td className="col-2">
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][code]"} value={serviceLine.materialCode} />
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][name]"} value={serviceLine.materialName} />
                                       {serviceLine.materialCode}-{serviceLine.materialName}
                                    </td>
                                    <td className="col-2 text-right">
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][poQuantity]"} value={serviceLine.poQty} />
                                       {getCommaSeperatedValue(getDecimalUpto(serviceLine.poQty, 3))}
                                    </td>
                                    <td className="col-1">
                                     <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][uom]"} value={serviceLine.uom} />
                                     {serviceLine.uom}
                                  </td>
                                  {/*-------input type-------*/}
                                  <td className="col-1">
                                     <input type="number"
                                        step=".01" 
                                        //onKeyDown={textRestrict}
                                      // maxLength={5}
                                       placeholder="0.000"
                                        className={"form-control " + ((['DR', 'SSRJ'].includes(this.state.asnDetails.status) || isEmpty(this.state.asnDetails.status) || !this.state.canEdit) ? "" : "readonly")}
                                        name={"asnLineList[" + el + "][serviceLineList][" + index + "][deliveryQuantity]"}
                                        defaultValue={this.state.serviceLineArray[index].deliveryQuantity}
                                        
                                        // onChange = {(e)=>{commonHandleChange(e,this,"serviceLineArray."+index+".deliveryQuantity")}} 
                                        onChange={(e) => {textRestrict(e); this.calculateBasicAmount(e, index, "serviceLineArray"); this.calculateBalanceQuantity(e, index, "serviceLineArray") }}
                                     />
                                    </td>
                                    {/*-------input type-------*/}
                                    <td className="col-1 ">
                                    <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][balanceQuantity1]"} value={serviceLine.balQty1} />
                                       {getCommaSeperatedValue(getDecimalUpto(serviceLine.balQty1, 3))}</td>
   
                                    <td className="col-2 text-right">
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][rate]"} value={serviceLine.poRate} />
                                       <input type="hidden" name={"asnLineList[" + el + "][serviceLineList][" + index + "][poLine][plant]"} value={serviceLine.plant} />
                                       {getCommaSeperatedValue(getDecimalUpto(serviceLine.poRate, 3))}</td>
   
                                    <td className="col-1 text-right">
                                       <button className={"btn btn-sm btn-outline-primary mgt-10 "} onClick={this.onSelectConstCenter.bind(this, serviceLine)} type="button" data-toggle="modal" data-target="#updateRoleModal">
                                          select
                                       </button>
                                    </td>

                                    {/* <td className="col-1">
                                       <button className={"btn btn-sm btn-outline-primary mgt-10 "} onClick={this.onSelectFund.bind(this, serviceLine)} type="button" data-toggle="modal" data-target="#fundsmodal">
                                          select
                                       </button>
                                    </td> */}
                                 </tr>
                              )
                           }
                           )
                        }
                     </tbody>
                     <tfoot>
                        <tr>
                           <td className="col-1 text-right">SSN Value: &nbsp;
                           {getCommaSeperatedValue(this.state.asnDetails.basicAmount)}
                           </td>
   
                        </tr>
                        
                     </tfoot>
   
                  </table>
               </div>
            </div>
         </div>
      </div>
   </div>

                     }
                     <div className="col-sm-12 text-center mt-1 " style={asnListHidden}>
      {/* {this.state.asnDetails.status != "SSRJ" &&
         <button type="button" 
         className={!((this.props.po.isServicePO) && (isEmpty(this.state.asnDetails.status) || this.state.asnDetails.status == "DR" || this.state.asnDetails.status == "SSIP" || this.props.SSNVersion == 2)) ?
          "btn btn-primary mr-1 inline-block" : "none"} 
          onClick={this.showAsnDetails}>{this.state.asnDetails.status === "SSAP" ? "Create Invoice" : "Invoice Details"}
         </button>} */}
      {/* <button type="submit" className={(this.props.po.isServicePO ) && (isEmpty(this.state.asnDetails.status) || (this.state.asnDetails.status==="DR"))?"btn btn-success mr-1 inline-block":"none"}
   onClick={(e)=>{this.props.changeASNStatus(false);this.setState({loadASNDetails:true,loadASNLineList:true,saveServiceLines:true});commonSubmitFormValidation(e,this,"saveASN","/rest/saveASN")}}
   >Save</button> */}
  {/* <button type="button" className={this.state.asnDetails.status == "SSIP"? "btn btn-primary mr-1 inline-block" : "none"}
        onClick={this.handleSheet} >Edit & Submit</button> */}
   { /*  <button type="button" className={this.state.asnDetails.status == "SSIP" ? "btn btn-primary mr-1 inline-block" : "none"}
        onClick={this.onEdit} >Edit</button>

      <button type="button" className={this.state.canEdit ? "btn btn-primary mr-1 inline-block" : "none"}
        onClick={this.handleSheet} >Submit SSN</button>*/}

      <button type="button" className={showBtn ? "btn btn-primary mr-1 inline-block" : "none"}
         onClick={this.handleSheet} >Save & Submit</button>

      {/* {this.state.asnDetails.status === "SSIP" && this.state.role == 'SSNAPP' && this.props.SSNVersion == 2 &&
         <button type="button" className={"btn btn-primary mr-1 inline-block"}
            onClick={this.onApprovalSecond} >Approve</button>
      }
      {this.state.asnDetails.status === "SSIP" && this.state.role == 'SSNAPP' && this.props.SSNVersion == 2 &&
         <button type="button" className={"btn btn-primary mr-1 inline-block"}
            onClick={this.rejectPO} >Reject</button>
      }
      {
         (this.state.asnDetails.status === "SSIP" && (this.props.user.userName === this.state.po.requestedBy.empCode)) && this.props.SSNVersion == 1 && <button type="button" className={"btn btn-primary mr-1 inline-block"}
            onClick={this.onApproval} >Approve</button>
      }
      <button type="button" className={(this.state.asnDetails.status === "SSIP" && (this.props.user.userName === this.state.po.requestedBy.empCode)) && this.props.SSNVersion == 1 ? "btn btn-primary mr-1 inline-block" : "none"}
         onClick={this.rejectPO} >Reject</button>
      {this.state.qc ? <>
         <button type="button" className={this.state.qc ? "btn btn-success mr-1" : "none"}
            onClick={(e) => { this.props.changeASNStatus(true); commonSubmitFormNoValidation(e, this, "qcResponse", "/rest/qcPassed") }}>QC PASS</button>
      </> : <></>
      }
      {this.state.grn ? <>
         <button type="button" className={this.state.grn ? "btn btn-success mr-1" : "none"}
            onClick={this.onSave}>Save</button>
      </> : <></>
      } */}
   </div>  
   <div className="asnDetailsSec mt-2" style={asnShown}>

                           <div className="" >
                              <div className="row mt-1">
                                 <div className="col-sm-11"></div>
                                 <div className="col-sm-1">
                                    <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={this.onEdit}>Edit</button>
                                 </div>
                              </div>

                              <div className="row">
                                 <label className="col-sm-2" >{this.props.po.isServicePO ? "SSE No" : "ASN No"}</label>
                                 <div className="col-sm-2" >
                                    <>{this.props.po.isServicePO ?
                                       <input type="text" className="form-control" value={this.state.asnDetails.serviceSheetNo}
                                          readOnly={!this.state.canEdit} name="serviceSheetNo" onChange={(e) => commonHandleChange(e, this, "asnDetails.serviceSheetNo")} /> :
                                       <input type="text" className="form-control" value={this.state.asnDetails.asnNumber}
                                          readOnly={!this.state.canEdit} name="advanceShipmentNoticeNo" onChange={(e) => commonHandleChange(e, this, "asnDetails.asnNumber")} />}</>
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.freightCharges}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="freightCharges" onChange={(e) => { commonHandleChange(e, this, "asnDetails.freightCharges") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.packingCharges}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="packingCharges" onChange={(e) => { commonHandleChange(e, this, "asnDetails.packingCharges") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.loadingCharges}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="loadingUnloadingCharges" onChange={(e) => { commonHandleChange(e, this, "asnDetails.loadingCharges") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.sgst}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="sgst" onChange={(e) => { commonHandleChange(e, this, "asnDetails.sgst") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.cgst}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="cgst" onChange={(e) => { commonHandleChange(e, this, "asnDetails.cgst") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.igst}
                                       disabled={!this.state.asnDetails.invoiceApplicable} name="igst" onChange={(e) => { commonHandleChange(e, this, "asnDetails.igst") }} />
                                    <input type="hidden" className="form-control" value={this.state.asnDetails.tcs} name="tcs" />

                                 </div>

                                 <div className="col-sm-8">
                                    <div className={(isEmpty(this.state.asnDetails.status)
                                       || this.state.asnDetails.status === 'DR') ? "invoiceDiv" : "none"}>
                                       <label className="col-sm-6">
                                          <div className="form-check">
                                             <label className="form-check-label">
                                                <input type="radio" className="form-check-input"
                                                   name="invoiceApplicable"
                                                   value={"Y"} checked={this.state.asnDetails.invoiceApplicable}
                                                   onClick={(e) => { commonHandleChangeCheckBox(e, this, "asnDetails.invoiceApplicable") }} />
                                                Against Invoice
                                             </label>
                                          </div>
                                       </label>
                                       <label className="col-sm-6">
                                          <div className="form-check">
                                             <label className="form-check-label">
                                                <input type="radio" className="form-check-input"
                                                   name="invoiceApplicable"
                                                   value={"N"} checked={!this.state.asnDetails.invoiceApplicable}
                                                   onClick={(e) => { commonHandleReverseChangeCheckBox(e, this, "asnDetails.invoiceApplicable"); this.setState({ flagForAttachmentResponce: true }) }} />
                                                Against Delivery Note
                                             </label>
                                          </div>
                                       </label>
                                    </div>
                                 </div>
                              </div>

                              <div className={this.state.asnDetails.invoiceApplicable ? "block" : "none"}>
                                 <div className="row mt-1">
                                    <label className="col-sm-2">Invoice No <span className="redspan">*</span></label>
                                    {/* <div className={"col-sm-2 " + (isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR") || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control"
                                          disabled={!this.state.asnDetails.invoiceApplicable} value={this.state.asnDetails.invoiceNo}
                                          name="invoiceNo" onChange={(e) => { commonHandleChange(e, this, "asnDetails.invoiceNo") }}/>
                                       <FieldFeedbacks for="invoiceNo">
                                          <FieldFeedback when="*"></FieldFeedback>
                                       </FieldFeedbacks>
                                    </div> */}


                                    <label className="col-sm-2" >Invoice Date <span className="redspan">*</span></label>
                                    {/* <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="date" className="form-control" name="invoiceDate" value={this.state.asnDetails.invoiceDate} 
                                          disabled={!this.state.asnDetails.invoiceApplicable}
                                          onChange={(e) => { commonHandleChange(e, this, "asnDetails.invoiceDate", "asnFormDet") }} />
                                       <FieldFeedbacks for="invoiceDate">
                                          <FieldFeedback when="*"></FieldFeedback>
                                       </FieldFeedbacks>
                                    </div> */}
                                    <label className="col-sm-1" >IRN</label>
                                    <div className={"col-sm-3 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" name="irn" className="form-control" value={this.state.asnDetails.irn}
                                          disabled={!this.state.asnDetails.invoiceApplicable}
                                          onChange={(e) => { commonHandleChange(e, this, "asnDetails.irn") }} />
                                    </div>
                                 </div>
                                 <div className="row mt-1">
                                    <label className="col-sm-2">Basic Amount</label>
                                    <div className="col-sm-2 readonly" >
                                       <input type="hidden" className="form-control" value={this.state.asnDetails.basicAmount}
                                          disabled={!this.state.asnDetails.invoiceApplicable} name="basicAmount" />
                                       <input type="text" className="form-control" value={getCommaSeperatedValue(this.state.asnDetails.basicAmount)}
                                          disabled={!this.state.asnDetails.invoiceApplicable} />
                                    </div>


                                    <label className="col-sm-2">Total Invoice Amount  <span className="redspan">*</span></label>
                                    <div className="col-sm-2 readonly" >
                                       <input type="hidden" className="form-control" value={this.state.asnDetails.invoiceAmountByUser}
                                          name="invoiceAmountByUser" />
                                       <input type="number"className="form-control" onChange={(e) => { commonHandleChange(e, this, "asnDetails.invoiceAmountByUser") }} value={this.state.asnDetails.invoiceAmountByUser}
                                       />
                                       <FieldFeedbacks for="invoiceAmountByUser">
                                          <FieldFeedback when="*"></FieldFeedback>
                                       </FieldFeedbacks>
                                    </div>

                                    <label className="col-sm-2">Gross Amount</label>
                                    <div className="col-sm-2 readonly" >
                                       <input type="hidden" className="form-control" value={this.state.asnDetails.invoiceAmount}
                                          disabled={!this.state.asnDetails.invoiceApplicable} name="invoiceAmount" />
                                       <input type="text" className="form-control" value={getCommaSeperatedValue(this.state.asnDetails.invoiceAmount)}
                                          disabled={!this.state.asnDetails.invoiceApplicable} />
                                    </div>

                                    <label className="col-sm-2">Round Off Amount</label>
                                    <div className="col-sm-2 readonly" >
                                       <input className="form-control" readOnly={!this.state.canEdit} value={this.state.asnDetails.roundOffAmount} name="roundOffAmount" />
                                       {/* <span>{this.state.asnDetails.roundOffAmount}</span> */}
                                    </div>

                                    <label className="col-sm-2">Round Off Value</label>
                                    <div className="col-sm-2 readonly" >
                                       <input readOnly={!this.state.canEdit} className="form-control" value={this.state.asnDetails.roundOffValue} name="roundOffValue" />
                                       {/* <span>{this.state.asnDetails.roundOffValue}</span> */}
                                    </div>

                                    <div className="col-sm-4">
                                       <button type="button" data-toggle="modal" className="btn btn-primary" data-target="#GetConditionModal">Condition And Taxes</button>
                                    </div>
                                 </div>
                                 {/* <div className="row mt-1">
                                    <label className="col-sm-2">Upload Invoice <span className="redspan">(max 2.5MB)*</span></label>
                                    <div className="col-sm-3">
                                       <div className="input-group">
                                          <input type="hidden" disabled={(isEmpty(this.state.asnDetails.invoiceDoc.attachmentId)) || (this.state.asnDetails.invoiceApplicable ? false : true)} name="invoice[attachmentId]" value={this.state.asnDetails.invoiceDoc.attachmentId} />
                                          <input type="hidden" name="invoice[fileName]" value={this.state.asnDetails.invoiceDoc.fileName} disabled={(isEmpty(this.state.asnDetails.invoiceDoc.attachmentId)) || (this.state.asnDetails.invoiceApplicable ? false : true)} />
                                          <input type="file" onChange={(e) => { commonHandleFileUploadInv(e, this, "asnDetails.invoiceDoc") }} disabled={(this.state.asnDetails.invoiceApplicable ? false : true)}
                                             className={"form-control "} name="invoiceAttach" required />
                                          <FieldFeedbacks for="invoiceAttach">
                                             <FieldFeedback when={(value) => isEmpty(value) && isEmpty(this.state.snDetails.invoiceDoc.attachmentId)}> Inovice File Mandatory</FieldFeedback>
                                          </FieldFeedbacks>
                                          <div className="input-group-append">
                                             <button className="btn btn-danger clearFile" onClick={() => { this.clearInoviceAttachment() }} type="button">X</button>
                                          </div>
                                       </div>
                                       <div disabled={this.state.asnDetails.invoiceApplicable ? false : true}><a href={API_BASE_URL + "/rest/download/" + this.state.asnDetails.invoiceDoc.attachmentId}>{this.state.asnDetails.invoiceDoc.fileName}</a></div>

                                    </div>
                                 </div> */}
                              </div>
                              <hr className="w-100" />

                              <div className={this.state.asnDetails.invoiceApplicable ? "none" : "block"}>
                                 <div className="row mt-1">

                                    <label className="col-sm-2" >Delivery Note No</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR")
                                       || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")}  >
                                       <input type="text" className="form-control" value={this.state.asnDetails.deliveryNoteNo}
                                          name="deliveryNoteNo" disabled={this.state.asnDetails.invoiceApplicable}
                                          onChange={(e) => { commonHandleChange(e, this, "asnDetails.deliveryNoteNo") }} />
                                    </div>

                                    <label className="col-sm-2" >Delivery Note Date</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="date" className="form-control" disabled={this.state.asnDetails.invoiceApplicable}
                                          value={this.state.asnDetails.deliveryNoteDate}
                                          name="deliveryNoteDate" min={currentDate} onChange={(e) => { commonHandleChange(e, this, "asnDetails.deliveryNoteDate") }} />
                                    </div>
                                    <label className="col-sm-2">Upload  Delivery Note <span className="redspan">*</span></label>
                                    <div className="col-sm-2" >
                                       {/* <input type="file" className="form-control" value={this.state.asnDetails.uploadInvoiceFile}     
                        disabled={this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.")}} /> */}
                                       <input type="hidden" name="invoice[attachmentId]" value={this.state.asnDetails.deliveryNoteDoc.attachmentId} disabled={!this.state.asnDetails.invoiceApplicable ? false : true} />
                                       <input type="hidden" name="invoice[fileName]" value={this.state.asnDetails.deliveryNoteDoc.fileName} disabled={!this.state.asnDetails.invoiceApplicable ? false : true} />
                                       <input type="file" onChange={(e) => { commonHandleFileUploadInv(e, this, "asnDetails.deliveryNoteDoc") }}
                                          className={"form-control "} name="deliveryNote" required disabled={!this.state.asnDetails.invoiceApplicable ? false : true} />

                                       <div className="input-group-append">
                                          <button className="btn btn-danger clearFile" onClick={() => { this.clearDeliveryNoteAttachment() }} type="button">X</button>
                                       </div>

                                       <div><a href={API_BASE_URL + "/rest/download/" + this.state.asnDetails.deliveryNoteDoc.attachmentId}>{this.state.asnDetails.deliveryNoteDoc.fileName}</a></div>
                                       <FieldFeedbacks for="deliveryNote">
                                          <FieldFeedback when={(value) => isEmpty(value) && isEmpty(this.state.snDetails.invoiceDoc.attachmentId)}> Inovice File Mandatory</FieldFeedback>
                                       </FieldFeedbacks>
                                    </div>

                                 </div>
                              </div>

                              <div id="forAsnHideShow" style={{ display: displayDivForAsnLine }}>
                                 <div className="row mt-1">

                                    {/* <label className="col-sm-2" >Transporter Name</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" value={this.state.asnDetails.transporterNo}
                                          name="transporterNo" onChange={(e) => { commonHandleChange(e, this, "asnDetails.transporterNo") }} />
                                    </div> */}
                                    {/* <label className="col-sm-2">LR No.</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" value={this.state.asnDetails.lrNumber}
                                          name="lrNumber" onChange={(e) => { commonHandleChange(e, this, "asnDetails.lrNumber") }} />
                                    </div>

                                    <label className="col-sm-2">LR Date</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="date" className="form-control" value={this.state.asnDetails.lrDate}
                                          name="lrDate" min={currentDate} onChange={(e) => { commonHandleChange(e, this, "asnDetails.lrDate") }} />
                                    </div> */}
                                 </div>
                                 <div className="row mt-1">


                                    <label className="col-sm-2">Vehicle No</label>
                                    {/* <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" value={this.state.asnDetails.vehicalNo}
                                          name="vehicalNo" onChange={(e) => { commonHandleChange(e, this, "asnDetails.vehicalNo") }} />
                                    </div> */}

                                    <label className="col-sm-2">E-Way Bill No</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="text" className="form-control" value={this.state.asnDetails.eWayBillNo}
                                          name="eWayBillNo" onChange={(e) => { commonHandleChange(e, this, "asnDetails.eWayBillNo") }} />
                                    </div>
                                    <label className="col-sm-2" >No of Packages</label>
                                    {/* <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="number" className="form-control" value={this.state.asnDetails.numberOfPackages}
                                          name="numberOfPackages" onChange={(e) => { commonHandleChange(e, this, "asnDetails.numberOfPackages") }} />
                                    </div> */}
                                 </div>
                                 {/* <div className="row mt-1">
                                    <label className="col-sm-2">Gross Weight</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="number" className="form-control" value={this.state.asnDetails.grossWeight}
                                          name="grossWeight" onChange={(e) => { commonHandleChange(e, this, "asnDetails.grossWeight") }} />
                                    </div>
                                    <label className="col-sm-2" >Tare Weight</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <input type="number" className="form-control" value={this.state.asnDetails.tareWeight}
                                          name="tareWeight" onChange={(e) => { commonHandleChange(e, this, "asnDetails.tareWeight") }} />
                                    </div>

                                 </div> */}
                                 <div className="row mt-1">
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <div className="checkbox checkbox-primary">
                                          <input id="COA" type="checkbox" value="Y" checked={this.state.asnDetails.isCOA}
                                             name="isCOA" onChange={(e) => { commonHandleChangeCheckBox(e, this, "asnDetails.isCOA") }} />
                                          <label for="COA">
                                             &nbsp;&nbsp; COA
                                          </label>
                                       </div>
                                    </div>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <div className="checkbox checkbox-primary">
                                          <input type="checkbox" name="isPackingList" value="Y"
                                             checked={this.state.asnDetails.isPackingList}
                                             onChange={(e) => { commonHandleChangeCheckBox(e, this, "asnDetails.isPackingList") }} />
                                          <label for="PackingList">
                                             &nbsp;&nbsp;Packing List
                                          </label>
                                       </div>
                                    </div>


                                    <label className="col-sm-2">Type of Packing Bulk / Non Bulk</label>
                                    <div className={"col-sm-2 " + ((isEmpty(this.state.asnDetails.status)
                                       || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                       <select className="form-control" value={this.state.asnDetails.typeOfPackingBulk}
                                          name="typeOfPackingBulk" onChange={(e) => { commonHandleChange(e, this, "asnDetails.typeOfPackingBulk") }}>
                                          <option value="BULK">BULK</option>
                                          <option value="NONBULK">NON BULK</option>
                                       </select>
                                    </div>
                                 </div>
                              </div>
                              <div className="row mt-1 ">
                                 <label className="col-sm-2" >Remarks </label>
                                 <div className={"col-sm-6 " + ((isEmpty(this.state.asnDetails.status)
                                    || (this.state.asnDetails.status === "DR") || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR")) || !this.state.canEdit) ? "" : "readonly")} >
                                    <textarea className="formcontrol" rows="3" value={this.state.asnDetails.remarks}
                                       name="remarks" onChange={(e) => { commonHandleChange(e, this, "asnDetails.remarks") }} >
                                    </textarea>
                                 </div>
                              </div>
                           </div>
                           <div className="col-sm-12 text-center mt-2 " >
                              {/* <button type="submit" className={(isEmpty(this.state.asnDetails.status) 
                           || this.state.asnDetails.status==="DR" || ((this.props.po.isServicePO) && (this.state.asnDetails.status==="SSAP" || this.state.asnDetails.status==="SSDR")))?"btn btn-success mr-1 inline-block":"none"}>Save</button> */}

                            {this.state.role != 'VENADM'?  <button type="button" className={(isEmpty(this.state.asnDetails.status)
                                 || this.state.asnDetails.status === "DR") ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={(e) => {
                                    this.props.changeASNStatus(true); this.setState({ loadASNDetails: true, loadASNLineList: true });
                                    commonSubmitFormValidation(e, this, "markASNInTransit", "/rest/markASNInTransit");
                                 }} >Save & Submit</button>
:
                                 <button type="button" className={(isEmpty(this.state.asnDetails.status)
                                 || this.state.asnDetails.status === "DR") ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={(e) => {
                                    this.props.changeASNStatus(true); this.setState({ loadASNDetails: true, loadASNLineList: true });
                                    commonSubmitFormValidation(e, this, "markVendorASNInTransit", "/rest/markASNInTransit");
                                 }} >Save & Submit</button>
}
                              <button type="button" className={(this.state.editButtonForAsn) ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={(e) => { this.editASN() }} >Edit ASN</button>

                              <button type="button" className={((this.props.po.isServicePO) && (['SSAP', 'SSDR', "SESRJ"].includes(this.state.asnDetails.status)) || this.state.canEdit) ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={(e) => { this.props.changeASNStatus(true); this.setState({ loadASNDetails: true, loadASNLineList: true, canEdit: false }); commonSubmitFormValidation(e, this, "markASNInTransit", "/rest/markASNInTransit") }} >Submit Invoice</button>

                              <button type="button" className={(this.state.asnDetails.status === "SESIP" && (this.props.user.userName === this.state.po.requestedBy.empCode)) ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={(e) => { this.props.changeASNStatus(true); this.props.changeLoaderState(true); commonSubmitWithParam(this.props, "approveServiceSheet", "/rest/approveServiceEntry", this.state.asnDetails.asnId) }} >Approve</button>

                              <button type="button" className={(this.state.asnDetails.status === "SESIP" && (this.props.user.userName === this.state.po.requestedBy.empCode)) ? "btn btn-primary mr-1 inline-block" : "none"}
                                 onClick={this.rejectPOSheet} >Reject</button>
                              {/* <button type="button"className={(this.state.asnDetails.status==="SESIP" && (this.props.user.userName===this.state.po.requestedBy.empCode))?"btn btn-primary mr-1 inline-block":"none"}
                        onClick={(e)=>{this.props.changeASNStatus(true);this.props.changeLoaderState(true);commonSubmitWithParam(this.props,"rejectServiceSheet","/rest/rejectServiceEntry",this.state.asnDetails.asnId)}} >Reject</button> */}

                              <button type="button" onClick={this.asnListHidden} className={(isEmpty(this.state.asnDetails.status)
                                 || this.state.asnDetails.status === "DR" || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR"))) ? "btn btn-danger mr-1 inline-block" : "none"}>Cancel</button>

                              <button type="button" onClick={this.asnListHidden} className={(isEmpty(this.state.asnDetails.status)
                                 || this.state.asnDetails.status === "DR" || ((this.props.po.isServicePO) && (this.state.asnDetails.status === "SSAP" || this.state.asnDetails.status === "SSDR"))) ? "none" : "btn btn-danger mr-1 inline-block"}>BACK</button>
                           </div>
                        </div>                     
                     </div>
{/*------------------------------------------  MODAL -----------------------------------------------------------------------------------  */}
                     <div className="modal gateEntryModal" id="getReportModal" >
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Driver Details</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body "} >
                           
                                <div class="row my-2">
                                    <div class="col-sm-4"></div>
                                    <div class="col-sm-8">
                                    
                          
                           {this.state.reportingDone && this.props.asnStatus==="GATE_IN" && (
                           <a  className="btn btn-success mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${this.state.asnNo}&VEHICLE=TRUCK`}
                                     target="_blank">TRUCK</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                    
)}   
                                    {/* {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                           // <a  className="btn btn-success mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK&ASNID=${asn.asnId}`}
                           //           target="_blank">TRUCK</a>
                           <a  className="btn btn-success mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK`}
                                     target="_blank">TRUCK</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                    :"")
)}    */}
                 
                          {this.state.reportingDone && this.props.asnStatus==="GATE_IN" && (
                           <a  className="btn btn-warning mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${this.state.asnNo}&VEHICLE=TANKER`}
                           target="_blank">TANKER</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                  

)} 

 {this.state.reportingDone && this.props.asnStatus==="GATE_IN" && (
                        
                                    <a  className="btn btn-primary"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${this.state.asnNo}&VEHICLE=PACKING MATERIAL`}
                                     target="_blank">PACKING MATERIAL</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                  

)} 
{/* {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                                    <a  className="btn btn-primary"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=PACKING MATERIAL`}
                                     target="_blank">PACKING MATERIAL</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                    :"")

)}  */}
                                      
                                    </div>
                                </div>
                           
                        </div>
                    </div>    
                </div>
            </div>
                     
                  </FormWithConstraints>
                              </div>
        </React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.formNo;
};
export default connect(mapStateToProps, actionCreators)(FormNo);