import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import alkylLogo from "../../img/Alkyl logo.png";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "../TankerForm/Action";
import "../TankerForm/tankerForm.css";
import StickyHeader from "react-sticky-table-thead";
import {
  commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { formatDateWithoutTimeWithMonthName, formatDateWithoutTime } from "../../Util/DateUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import Loader from "../FormElement/Loader/LoaderWithProps";
import { removeLeedingZeros } from "../../Util/CommonUtil";
import { isServicePO } from "../../Util/AlkylUtil";


class TankerForm extends Component {
  constructor (props) {
    console.log("props console" + props);
    super(props)
    this.state = {
      flagforSSN:false,
      psTypeFlag:true,
       displayDivForAsnHistoryTable:"",
       editButtonForAsn:false,
       loadAsnStatusList:true,
       loadserviceSheetStatusList:true,
       loadserviceEntrySheetStatusList:true,
       vendorNameShown:"block",
       isLoading:false,
      asnStatusList:[],
      serviceSheetStatusList:[],
      serviceLineArray:[],
      serviceEntrySheetStatusList:[],
      purchaseOrderList:{},
      asnLineList:{},
       asnDetails:{
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
         grnNO:""
       },
       invoiceApplicable:true,
       deliveryApplicable:false,
       isInvoiceApplicable : true,
       loadPODetailsList:false,
       loadPOLineList:false,
       poArray:[],
       poLineArray:[],
       asnLineArray:[],
       asnArray:[],
       loadASNList:false,
       loadASNLineList:false,
       loadASNDetails:false,
       loadASNLineDetails:false,
       flagForAttachmentResponce:false,
       asnLineDetails:{
         asnLineId : "",
         asnId : "",
         poLineId : "",
         poLineNumber : "",
         asnLineNumber : "",
         deliveryQuantity : "",
         rejectedQuantity : "",
         shortageQuantity : "",
         confirmQuantity : "",
         poRate : "",
         materialCode : "",
         materialName : "",
         poQty : "",
         uom : ""
       },
       asnIndex:"",
       showHistory : false,
       unload:false,
       grn:false,
       qc:false,
       po:{        
         poId : "",
         purchaseOrderNumber: "",
         poDate: "",
         vendorCode: "",
         vendorName: "",
         incomeTerms: "",
         purchaseGroup: "",
         versionNumber: "",
         status: "",
         documentType: "",
         isServicePO:false
       },
       currentASN : "",
       serviceLineArray : [],
       loadServiceLineList : false,
       currentPOLineIndex : "",
       saveServiceLines:false,
       role : "",
       loadStorageLocation: false,
       asnLineMap : [],
       selectedAsnListItem:{},
       openModal:false,
       selectedStorageLocationListItem:{},
       openStorageLocationModal:false
    }
}

changeLoaderState = (action) =>{
  this.setState({
    isLoading:action
  });
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

showHistory=()=>{
  this.setState({
     showHistory : true
  });
}

getPOLineFromObj(poLineObj){
  return {
    poLineId : poLineObj.purchaseOrderLineId,
    lineItemNumber: poLineObj.lineItemNumber,
    currency: poLineObj.currency,
    deliveryDate: formatDateWithoutTime(poLineObj.deliveryDate),
    plant:poLineObj.plant,
    deliveryStatus:poLineObj.deliveryStatus,
    controlCode:poLineObj.controlCode,
    trackingNmber:poLineObj.trackingNmber,
    deliveryScheduleAnnual:poLineObj.deliveryScheduleAnnual,
    poQuantity: poLineObj.poQuantity,
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
     asnDetails : asn
  });

}

getASNFromObj(asnObj){
  return {
     asnId : asnObj.advanceShipmentNoticeId,
     asnNumber : asnObj.advanceShipmentNoticeNo,
     serviceSheetNo:asnObj.serviceSheetNo,
     po : this.getPurchaseOrderFromObj(asnObj.po),
     invoiceNo : asnObj.invoiceNo,
     invoiceDate : formatDateWithoutTime(asnObj.invoiceDate),
     invoiceAmount : asnObj.invoiceAmount,
     mismatchAmount : asnObj.mismatchAmount,
     deliveryNoteNo : asnObj.deliveryNoteNo,
     deliveryNoteDate : formatDateWithoutTime(asnObj.deliveryNoteDate),
     lrDate : formatDateWithoutTime(asnObj.lrDate),
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
     grnNO:asnObj.grnId,
     description: asnObj.description,
     roundOffAmount: asnObj.roundOffAmount,
     roundOffValue: asnObj.roundOffValue
   };
}

getASNLineFromPOLine(poLine){
  return {
     poLineNumber : poLine.lineItemNumber,
     poLineId : poLine.poLineId,
     asnLineNumber : poLine.lineItemNumber,
     deliveryQuantity : "",
     poRate : poLine.rate,
     materialCode : poLine.materialCode,
     materialName : poLine.material,
     poQty : poLine.poQuantity,
     uom : poLine.uom,
     balQty : poLine.balanceQuantity,
     plant : poLine.plant
  };
}

getServiceLineFromService(service){
  return {
     poLineNumber : service.lineItemNumber,
     poLineId : service.poLineId,
     asnLineNumber : service.lineItemNumber,
     deliveryQuantity : "",
     poRate : service.rate,
     materialCode : service.materialCode,
     materialName : service.material,
     poQty : service.poQuantity,
     uom : service.uom,
     balQty : service.balanceQuantity,
     plant : service.plant,
     parentPOLineId : service.parentPOLineId
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
        storageLocation:asnLineObj.storageLocation
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
  let parentLineId="";
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
        parentLineId = asnLineObj.poLine.parentPOLine.purchaseOrderLineId;
        parentLineNumber = asnLineObj.poLine.parentPOLine.lineItemNumber
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
        parentLineId: parentLineId,
        parentLineNumber:parentLineNumber,
        asnLineCostCenter: !isEmpty(asnLineObj.asnLineCostCenter) ? asnLineObj.asnLineCostCenter:[]
     };
  }
}

updateAsnLineIndex(e){
  let asnIndex = this.state.asnIndex;
  if(e.target.checked){
     this.setState({
        asnIndex: asnIndex++
     })
  }else{
     this.setState({
        asnIndex: asnIndex--
     })
  }
  
}

getASNIndexFroRow(){
  if(this.state.asnIndex>0){
     return this.state.asnIndex;
  }else{
     return "";
  }
}

async componentWillReceiveProps(props){
  // if(isEmpty(props.isSuccess) || props.isSuccess===false)
  // {
  //    this.changeLoaderState(false);
  // }
  if(!isEmpty(props.po)){


     this.setState({
        displayDivForAsnHistoryTable:props.po.isServicePO?"none":"",
        psTypeFlag:props.po.isServicePO?false:true,
        flagforSSN:props.po.isServicePO?true:false,
        
     })
  }
  /*if(isEmpty(props.asnStatusList) && this.state.loadAsnStatusList){
     commonSubmitWithParam(this.props,"getStatusDisplay","/rest/getAsnByAsnId");
  }*/
  
  if(!isEmpty(props.asnStatusList) && this.state.loadAsnStatusList ){
     this.setState({
        loadAsnStatusList: false,
        asnStatusList: props.asnStatusList
     })
     
   }
   if(!isEmpty(props.serviceSheetStatusList) && this.state.loadserviceSheetStatusList ){
     this.setState({
        loadserviceSheetStatusList: false,
        serviceSheetStatusList: props.serviceSheetStatusList
     })
     
   }
   if(!isEmpty(props.serviceEntrySheetStatusList) && this.state.loadserviceEntrySheetStatusList ){
     this.setState({
        loadserviceEntrySheetStatusList: false,
        serviceEntrySheetStatusList: props.serviceEntrySheetStatusList
     })
     
   } 

  if(!isEmpty(props.unload))
  {
     this.setState({unload:props.unload});
  }

  if(!isEmpty(props.grn))
  {
     this.setState({grn:props.grn});
  }

  if(!isEmpty(props.qc))
  {
     this.setState({qc:props.qc || this.state.role==="QCADM"});
  }

  if(!isEmpty(props.purchaseOrderList) && this.state.loadPODetailsList){
     let poList = [];
     props.purchaseOrderList.map((po)=>
        poList.push(this.getPurchaseOrderFromObj(po))
     );
     this.setState({
        loadPODetailsList:false,
        poArray: poList
     })
  }

  /*if(!isEmpty(props.asnLineList)){
   let asnList = [];
   props.asnLineList.map((po)=>
      poList.push(this.getPurchaseOrderFromObj(po))
   );
   this.setState({
      loadPODetailsList:false,
      poArray: poList
   })
}*/

  if(!isEmpty(props.asnLineList)){
   this.changeLoaderState(false);

 let asnLine = [];
   props.asnLineList.map((asnLine,index)=>
      asnLine.push(this.getASNLineFromObj(asnLine,index))
      
   );
  
}
else{
   this.changeLoaderState(false);
}


/*if(!isEmpty(props.asnLineList) && this.state.saveServiceLines){
   this.changeLoaderState(false);
   let serviceLineList = [];
    let serviceLineListFromAsnLine=[];
   
    this.state.asnLineMap.map((asnLine,index)=>{
         serviceLineListFromAsnLine=props.asnLineList[asnLine].serviceLineList;
         if(!isEmpty(serviceLineListFromAsnLine)){
               serviceLineListFromAsnLine.map((serviceLine)=>{
               serviceLineList.push(this.getASNLineFromObj(serviceLine))
            })
         }
      }) 

   this.setState({
      saveServiceLines:false,
      serviceLineArray: serviceLineList
   });
}else{
   this.changeLoaderState(false);
}*/




  if(!isEmpty(props.poLineList) && this.state.loadPOLineList){
     let poLineList = [];
     props.poLineList.map((poLine)=>
        poLineList.push(this.getPOLineFromObj(poLine))
     )
     this.setState({
        loadPOLineList:false,
        poLineArray: poLineList
     });
  }

  if(!isEmpty(props.po)){
     this.setState({
        po: props.po
     });
  }

  if(props.showHistory){

     this.setState({
        showHistory : true
     });
     
     if(!isEmpty(props.asnArray)){
        let asnList = [];
        props.asnArray.map((asn)=>
        asnList.push(this.getASNFromObj(asn))
        
        )
        this.setState({
           loadASNList:false,
           asnArray: asnList
        });
     }
  }else if(!props.showHistory){
     this.setState({
        showHistory : false
     });
  }
  if(!isEmpty(props.asnList) && this.state.loadASNList){
     this.changeLoaderState(false);
     let asnList = [];
     props.asnList.map((asn)=>
        asnList.push(this.getASNFromObj(asn))
     )

     this.setState({
        loadASNList:false,
        asnArray: asnList
     });
  }


  

  if(!isEmpty(props.storageLocationList) && this.state.loadStorageLocation){
     let strLocArray = Object.keys(props.storageLocationList).map((key) => {
        return { display: props.storageLocationList[key], value: key }
      });
     this.setState({
        loadStorageLocation:false,
        storageLocationList: strLocArray
     });
  }
  if(!isEmpty(props.serviceLineList) && this.state.loadServiceLineList){
     let serviceLineList = [];
     props.serviceLineList.map((serviceLine)=>
     serviceLineList.push(this.getServiceLineFromObj(serviceLine)) 
     )
     this.setState({
        loadServiceLineList:false,
        serviceLineArray: serviceLineList
     });
  }

  
  /*if(!isEmpty(props.asnLineList) && this.state.saveServiceLines){
     this.changeLoaderState(false);
     let serviceLineList = [];
      let serviceLineListFromAsnLine=[];
     
      this.state.asnLineMap.map((asnLine,index)=>{
           serviceLineListFromAsnLine=props.asnLineList[asnLine].serviceLineList;
           if(!isEmpty(serviceLineListFromAsnLine)){
                 serviceLineListFromAsnLine.map((serviceLine)=>{
                 serviceLineList.push(this.getASNLineFromObj(serviceLine))
              })
           }
        })
      

     
     this.setState({
        saveServiceLines:false,
        serviceLineArray: serviceLineList
     });
  }else{
     this.changeLoaderState(false);
  }*/


  if(!isEmpty(props.asnDetails) && this.state.loadASNDetails){
     let asnList = this.state.asnArray;
     asnList.push(this.getASNFromObj(props.asnDetails));
     this.setState({
        loadASNDetails:false,
        asnDetails: this.getASNFromObj(props.asnDetails),
      });
    }
  
    if(!isEmpty(props.poLineArray) && !this.state.loadASNLineList){
       let asnLineList = [];
       let asnLineMap = [];
  
       props.poLineArray.map((poLine,index)=>{
             let lineItem=this.getASNLineFromPOLine(poLine);
             asnLineList.push(lineItem);
             asnLineMap[lineItem.poLineId]=index;
          }
       )
       this.setState({
          asnLineArray : asnLineList,
          loadASNLineList : true,
          asnLineMap : asnLineMap
       });
    }
  
   
   
    if(!isEmpty(props.asnStatus)){
       this.changeLoaderState(false);
    }else{
       this.changeLoaderState(false);
    }
  
    if(!isEmpty(props.asnStatus) && this.props.updateASNStatus){
       this.changeLoaderState(false);
       this.props.changeASNStatus(false);
       let asn = this.state.asnDetails;
       asn.status = props.asnStatus;
       this.props.showGateEntry(false,"");
       this.setState({
          asnDetails : asn
       });
       setTimeout(()=>{
          window.location.reload();
       },1000)
    }
    
  
  
    if(!isEmpty(props.newRole)){
       
       var viewAsn = props.newRole==="SECADM" || props.newRole==="OHCADM"
       || props.newRole==="SFTADM";
       this.setState({
          loadRole : false,
          role: props.newRole,
          asnShown: viewAsn,
          vendorNameShown:props.newRole==="VENADM"?"none":"show",
          // vendorNameShown:"none"
       });
    }
    
    // if(!isEmpty(props.backAction)){
    //    this.backAction = props.backAction;
    // }else{
    //    this.backAction = this.showASNHistory;
    // }
  
  }
  
  
  /*async componentDidMount(){
    commonSubmitWithParam(
      this.props,
      "getPOListForASN",
      "/rest/getAsnByAsnId/308",
      null
    );
  }*/

  async componentDidMount() {
    commonSubmitWithParam(this.props, "getPOListForASN", "/rest/getAsnByAsnId/10460" );
    this.changeLoaderState(true);

  }


  
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
  
  /*loadASNForEdit(asn){
    this.props.showHistoryFalse();
    this.props.showGateEntry(true,asn);
    this.setState({
       loadASNLineList : true,
       loadPOLineList : true,
       loadStorageLocation : true,
       asnDetails : asn,
       showHistory : false,
       po : asn.po,
       currentASN : asn,
       editButtonForAsn:(asn.status==="IT" && this.state.role==="VENADM")?true:false,
       loadServiceLineList : true,
       qc : this.state.role==="QCADM"
    })
    this.changeLoaderState(true);
    commonSubmitWithParam(this.props,"getASNLineList","/rest/getASNLines",asn.asnId);
  }*/

  
  showAsnDetails=()=>{
    this.setState({
      asnShown: !this.state.asnShown,
      asnListHidden: !this.state.asnListHidden,
      marginClass:"mt-100",
      canEdit:false
    }); 
  }


   
  
    render(){
      return (
        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          <div className="userbg">
            <UserDashboardHeader />
            <StickyHeader height={800} >
              <div className="page-content w-100">
                <div className="wizard-v1-content b-t">
                  <div className="wizard-form">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }} >
                      <a><img src={alkylLogo} alt="AlkylLogo" /></a>
                      <h1 className="text-center" style={{ fontSize: 55, textDecoration: 'underline black' }} >Goods Inspection / Intimation Note</h1>
                    </div>
                    <FormWithConstraints ref={formWithConstraints => this.inviteForm = formWithConstraints}>
  
                      <div className="row">
                        <div className="col-sm-12 mt-4">
                          <table className="table table-bordered" style={{ width: "100%" }} >
                            <tbody>
                           
                              <tr className="ts">
                                <td style={{ width: "16.7%" }}>Plant : </td>
                                <td style={{ width: "16.6%" }}>1820 </td>
                                <td style={{fontWeight: 'bold',width: "65%",textAlign: "center" }}>Alkyl Amines Chemicals Ltd. Kurkumbh Plant</td>
                              </tr>
                              <tr className="ts">
                                <td>Gate Entry No. :</td>
                                <td></td>
                                <td>Gate In Date. :</td>
                                <td>{formatDateWithoutTimeWithMonthName(this.props.purchaseOrderList.gateInDate)}</td>
                                <td>Time :</td>
                                <td></td>
                              </tr>
                              <tr className="ts">
                                <td>PO No. :</td>
                              {/*  <td>{this.props.purchaseOrderList.po.purchaseOrderNumber}</td>*/}
                                <td>Inv. / Dc No. :</td>
                                <td>{this.props.purchaseOrderList.invoiceNo}</td>
                                <td>Inv/Dc Dt.</td>
                                <td>{formatDateWithoutTimeWithMonthName(this.props.purchaseOrderList.invoiceDate)}</td>
                              </tr>
                              <tr>
                                <td>Material Name :</td>
                                <td>{this.props.asnLineList.materialName}</td>
                              </tr>
                              <tr className="ts">
                                <td>Vehicle No. :</td>
                                <td></td>
                                <td>Quantity :</td>
                                <td></td>
                                <td>UOM</td>
                                <td></td>
                              </tr>
                              <tr className="ts">
                                <td  style={{ width: "16.7%" }}>Sign. Verified By :</td>
                                <td style={{ width: "16.7%" }}></td>
                                <td style={{ width: "60%" }}>Remark If any</td>
                              </tr>
                              <tr className="ts" style={{fontWeight: 'bold',width: "100%",textAlign: "center",textDecoration: 'underline black' }}><td>Q. C. Report</td></tr>
                              <tr className="ts">
                                <td>In Time :</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Out Time :</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>Above mentioned Tanker / Truck / Trolly of</td>
                                <td></td>
                              </tr>
                              <tr className="ts">
                                <td>May be Unloaded</td>
                                <td></td>
                                <td>Not to be Unloaded</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>Reason for Unloading / Not Unloading :</td>
                                <td>
                                <textarea rows="4" cols="150"></textarea>
                                </td>
                              </tr>
                              <tr className="ts">
                                <td>Density</td>
                                <td></td>
                                <td>Strength</td>
                                <td></td>
                              </tr>
                              <tr className="ts">
                                <td>Checked By</td>
                                <td></td>
                                <td>Approved By</td>
                                <td></td>
                              </tr>
                              <tr className="ts" style={{fontWeight: 'bold',width: "100%",textAlign: "center",textDecoration: 'underline black' }}><td>Material Unloading Report</td></tr>
                              <tr className="ts">
                                <td>Tank No.</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr className="ts">
                                <td style={{ width: "68.2%" }}>Initial Level</td>
                                <td>:</td>
                                <td></td>
                                <td>Quantity :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                              <tr className="ts">
                                <td style={{ width: "68.2%" }}>Final Level</td>
                                <td>:</td>
                                <td></td>
                                <td>Quantity :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                              <tr className="ts">
                                <td style={{ width: "68.2%" }}>Difference</td>
                                <td>:</td>
                                <td></td>
                                <td>Quantity :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                             
                              <tr>
                                <td>Certified that Tanker is totally empty.</td>
                              </tr>
                              
                              <tr className="ts" >
                                <td>Unloaded by</td>
                                <td></td>
                                <td>Functional Head</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>Security Remark</td>
                              </tr>
                              <tr className="ts">
                                <td>Reporting Time :  </td>
                                <td></td>
                                <td>Gross Weight :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                              <tr className="ts">
                                <td>In Time :</td>
                                <td></td>
                                <td>Tare Weight :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                              <tr className="ts">
                                <td>Out Time :</td>
                                <td></td>
                                <td>Net Weight :</td>
                                <td></td>
                                <td>MT / KG</td>
                              </tr>
                              
                              <tr className="ts">
                                <td>Safety Check :</td>
                                <td></td>
                                <td>Ok</td>
                                <td>Not Ok</td>
                              </tr>
                              
                              <tr>
                                <td>Remark:</td>
                                <td></td>
                              </tr>
                              
                              <tr>
                                <td>Security Supervisor Sign</td>
                              </tr>
                              
                            </tbody>
                          </table>
                        </div>
                      </div>
        
                    </FormWithConstraints>
                  </div>
                </div>
              </div>
            </StickyHeader>
          </div>
        </React.Fragment>
  
      );
    }
  }
  
  
  const mapStateToProps = (state) => {
  
    return state.tankerForm;
  };
  export default connect(mapStateToProps, actionCreators)(TankerForm);