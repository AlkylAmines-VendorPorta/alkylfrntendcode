import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import alkylLogo from "../../../img/help.png"
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import {commonSubmitWithParam, commonSubmitForm,commonHandleChange} from "../../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo} from "../../../Util/DataTable";
import * as actionCreators from "./Action";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import StickyHeader from "react-sticky-table-thead";
import formatDate, {formatDateWithoutTime, formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { isServicePO } from "../../../Util/AlkylUtil";
import AdvanceShipmentNotice from "../../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import {saveQuotation,downloadexcelApi,request,uploadFile,savetoServer} from "../../../Util/APIUtils";

import FormNo from "../../FormNo/FormNo/FormNo";
import ASNWithoutPO from "../../ASNWithoutPO/ASNWithoutPO";
import GateEntryforCommercial from "../../GateEntryforCommercial/GateEntryforCommercial/GateEntryforCommercial";
import STOASN from "../../STOASN/STOASN";
import { Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

class CreateASNGateEntryCont extends Component {
  constructor(props) {
    super(props)
    this.state = {
      outboundDeliveryNo:"",
      stoASNList:[],
      doctype:"",
      vendorNameShown:"",
      vendorCodeShown:"",
      newPoStatus:"",
      buttonText:"",
      ASN:"Create ASN",
      displayDivFlag:"block",
      loadPODetails: false,
      loadPOLine:false,
      loadPOLineList:false,
      loadDocumentTyeList:false,
      loadPOLineConditions:false,
      poLineArray:[],
      gateentryAsnList:[],
      documentTypeList: [],
      currentPOLine:{
        poLineId:"",
        lineItemNumber:"",
        poQuantity:"",
        rate:"",
        currency:"",
        deliveryDate:"",
        plant:"",
        deliveryStatus:"",
        controlCode:"",
        trackingNmber:"",
        overDeliveryTol:"",
        underdeliveryTol:"",
        deliveryScheduleAnnual:"",
        deliveryQuantity:"",
        balanceQuantity:"",
        balanceQuantity1:"",
        forwardingCondition:"",
        freightCondition:"",
        unloadingCharges:"",
        taxConditions:"",
        basicPrice:"",
        materialCode: "",
        material: "",
        uom: "",
        asnQuantity:"",
        grnQuantity:"",
        batch:"",
        balanceLimit: "",
      },
      poLineConditionArray:[],
      po:{
        poId: "",
        purchaseOrderNumber: "",
        outboundDeliveryNo:"",
        poDate: "",
        vendorCode: "",
        vendorName: "",
        incomeTerms: "",
        purchaseGroup: "",
        versionNumber: "",
        status: "",
        documentType: "",
        plant:"",
        poAtt:{
         attachmentId:"",
         fileName:""
       },
       requestedBy:{
         userId: "",
         name: "",
         empCode:"",
       },
        isServicePO:false,
        pstyp:"",
        doctyp:"",
        poTypeMsg:"",
        prDate:"",
        userID:""
      }
      ,
      serviceArray:[],
      loadServiceList:false,
      currentPOIndex:"",
      costCenterList:[],
     //ssnFundList:[],
      //nikhil code 25-07-2022
      partner: {
        partnerId:"",
        email:"",
        companyName:"",
        mobileNo:"",
        name: "",
        firstName:"",
        middleName:"",
        lastName:""
      },
      partnerList: [],
      isUserInvited:true,
      inviteMessage:"",
      companyList : [],
      purchaseOrderList:[]
          //nikhil code 25-07-2022
    }
}

getPOLineFromObj(poLineObj){
  return {
    poLineId: poLineObj.purchaseOrderLineId,
    lineItemNumber: poLineObj.lineItemNumber,
    currency: poLineObj.currency,
    deliveryDate: formatDateWithoutTimeNewDate2(poLineObj.deliveryDate),
    plant:poLineObj.plant,
    deliveryStatus:poLineObj.deliveryStatus,
    controlCode:poLineObj.controlCode,
    trackingNmber:poLineObj.trackingNmber,
    deliveryScheduleAnnual:poLineObj.deliveryScheduleAnnual,
    poQuantity: poLineObj.poQuantity,
    rate: poLineObj.rate,
    asnQuantity : poLineObj.asnQuantity,
    deliveryQuantity: poLineObj.deliveryQuantity,
    balanceQuantity: poLineObj.balanceQuantity,
    materialCode: removeLeedingZeros(poLineObj.code),
    material: poLineObj.name,
    uom: poLineObj.uom,
    balanceLimit: poLineObj.balanceLimit,
    balanceQuantity1: poLineObj.balanceQuantity1,
    grnQuantity: poLineObj.grnQuantity,
    batch: poLineObj.batch
  }
}

getServiceFromObj(service){
  return {
    poLineId : service.purchaseOrderLineId,
    lineItemNumber: service.lineItemNumber,
    currency: service.currency,
    deliveryDate: formatDateWithoutTimeNewDate2(service.deliveryDate),
    plant:service.plant,
    deliveryStatus:service.deliveryStatus,
    controlCode:service.controlCode,
    trackingNmber:service.trackingNmber,
    deliveryScheduleAnnual:service.deliveryScheduleAnnual,
    poQuantity: service.poQuantity,
    rate: service.rate,
    asnQuantity : service.asnQuantity,
    deliveryQuantity: service.deliveryQuantity,
    balanceQuantity: service.balanceQuantity,
    materialCode: removeLeedingZeros(service.code),
    material: service.name,
    uom: service.uom,
    balanceLimit: service.balanceLimit,
    balanceQuantity1: service.balanceQuantity1,
    parentPOLineId: service.parentPOLine.purchaseOrderLineId,
    parentPOlineNumber:service.parentPOLine.lineItemNumber,
    grnQuantity: service.grnQuantity,
    contractPo:service.purchaseOrder.contractPo,
    balanceLimit:service.purchaseOrder.balanceLimit
  }
}

getPOLineConditionFromObj = (pOLineConditionObj) =>{
  return {
    conditionName : pOLineConditionObj.condition.name,
    conditionValue: pOLineConditionObj.code
  }
}

loadPOLine(row){
  this.setState({
   currentPOLine : row
  })
}
getPurchaseOrderFromObj(po){
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
    pstyp:po.pstyp,
    isServicePO:isServicePO(po.pstyp),
    poTypeMsg:po.poTypeMsg,
    prDate: formatDateWithoutTimeNewDate2(po.prDate),
    userID:po.userID
 }
}

onClickPOLine = (poLine) =>{
 this.setState({
    currentPOLine : poLine
  });
    // loadServiceList : true
  // commonSubmitWithParam(this.props,"getServiceListForPOLine","/rest/getServicesListByPOLineId",poLine.poLineId);
}

async componentWillReceiveProps(props){
   if(!isEmpty(props.role)){
     this.props.changeLoaderState(false);
    this.setState({

      vendorNameShown:props.role==="VENADM"?"none":"",
      vendorCodeShown:props.role==="VENADM"?"none":"",
    })
   }

   if(!isEmpty(props.newPoStatus)){
    this.props.changeLoaderState(false);
    this.setState({
      newPoStatus: props.newPoStatus
    });
  }else{
    this.props.changeLoaderState(false);
  }

  if(!isEmpty(props.gateentryAsnList)){
    this.props.changeLoaderState(false);
    this.setState({
      gateentryAsnList: props.gateentryAsnList
    });
  }else{
    this.props.changeLoaderState(false);
  }


  if (!isEmpty(props.costCenterList)) {
   this.props.changeLoaderState(false);
   let costArray = Object.keys(props.costCenterList).map((key) => {
     return { display: props.costCenterList[key], value: key }
   });
   this.setState({
     costCenterList: costArray
   })
 }

//  if (!isEmpty(props.ssnFundList)) {
//   this.props.changeLoaderState(false);
//   let fundArray = Object.keys(props.ssnFundList).map((key) => {
//     return { display: props.ssnFundList[key], value: key }
//   });
//   this.setState({
//     ssnFundList: fundArray
//   })
// }

  if(!isEmpty(props.documentTypeList) && this.state.loadDocumentTyeList){
   this.props.changeLoaderState(false);
    let documentTypeArray = Object.keys(props.documentTypeList).map((key) => {
      return {display: props.documentTypeList[key], value: key}
    });
    this.setState({
      documentTypeList: documentTypeArray
    })
  }else{
    this.props.changeLoaderState(false);
  }

  if(this.state.loadPOLineList && !isEmpty(props.poLineList)){
   this.props.changeLoaderState(false);
   let poLineList = [];
      
      props.poLineList.map((poLine)=>{
        poLineList.push(this.getPOLineFromObj(poLine));
      });
      this.setState({
        poLineArray : poLineList
      });
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadServiceList && !isEmpty(props.serviceList)){
      this.props.changeLoaderState(false);
      let serviceList = [];

      props.serviceList.map((service)=>{
        serviceList.push(this.getServiceFromObj(service));
      });
      this.setState({
        loadServiceList : false,
        serviceArray : serviceList
      });


    }else if(this.state.loadServiceList && isEmpty(props.serviceList)){
      this.props.changeLoaderState(false);
      this.setState({
        loadServiceList : false,
        serviceArray : []
      });
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPOLineConditions &&!isEmpty(props.poLineConditionList)){
      this.props.changeLoaderState(false);
      let poLineConditionList = [];
      props.poLineConditionList.map((poLineCondition)=>{
        poLineConditionList.push(this.getPOLineConditionFromObj(poLineCondition));
      });
      this.setState({
        poLineConditionArray : poLineConditionList
      });
   }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPODetails && !isEmpty(props.purchaseOrder)){
      this.props.changeLoaderState(false);
      let po = this.getPurchaseOrderFromObj(props.purchaseOrder);
      this.setState({
        loadPODetails : false,
        po : po
      });
      this.props.updatePO(this.state.currentPOIndex,po);
    }else{
      this.props.changeLoaderState(false);
    }

    if(!isEmpty(props.asnList) && this.state.loadASNListForPO){
      this.props.changeLoaderState(false);
      this.setState({
        loadASNListForPO : false
      })
      this.props.showASNHistory(props.asnList,this.state.po);
    }else{
      this.props.changeLoaderState(false);
    }

   if(!isEmpty(props.userList) && this.state.loadCompaniList){
      this.setState({
        loadCompaniList: false,
        companyList: props.userList

      })
    }


    if(!isEmpty(props.purchaseOrderList) ){
      this.setState({
        purchaseOrderList: props.purchaseOrderList
      })
      
    }


    if(!isEmpty(props.partner) && this.state.loadSaveResp ){
      this.changeLoaderState(false);
      this.setState({
        loadSaveResp:false,
        partner: {
          partnerId:"",
          email:"",
          companyName:"",
          mobileNo:"",
          name: "",
          firstName:"",
          middleName:"",
          lastName:""
        },
        // partner: action.payload.objectMap.user
        isUserInvited:true,
        inviteMessage:""
      })
    }


    if(!isEmpty(props.stoASNList)){
      this.props.changeLoaderState(false);
     this.setState({
 
      stoASNList:props.stoASNList
     })
    }

}

getASNHistory(){
  this.setState({
    loadASNListForPO : true
  });
  commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",this.state.po.poId);
  this.props.changeLoaderState(true);
  this.props.goASNHistory(this.state.costCenterList)
}

rejectPO = () =>{
  swal("Enter reason for rejection", {
    content: "input",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    // button:"Submit",
    buttons: true,
    dangerMode:true,

  })
  .then((value) => {
    // this.setState({loadPODetails: true}); 
    // commonSubmitWithParam(this.props,"poAcceptance","/rest/rejectPO",this.state.po.poId,value);
  }).catch(err => {
  });
}

downloadexcelApi= () => {
  // let enquiryId=this.state.qbvArray.enquiry?.enquiryId;
  let po=this.state.po.purchaseOrderNumber;
               return request({
                   url: API_BASE_URL+"/rest/downloadPO/"+po,
                   method: 'GET',
                //   body: data
               }).then(response => {
                   // getFileUploadObject(component,JSON.stringify(response),statePath);
                  this.setState({attachmentId:response.attachmentId})
                  this.setState({fileName:response.fileName})
                  
               //   this.download();
                })

                  

              

           
           }

// download(){
//   var a = document.createElement('a'); 
//   a.href = API_BASE_URL + "/rest/download/" + this.state.attachmentId; 
// } 

loadPODetails(index){
   let po = this.props.poList[0];
   this.setState({
     loadPOLineList:true,
     shown: !this.state.shown,
     hidden: !this.state.hidden,
     po : po,
     buttonText:po.documentType,
     displayDivFlag:po.isServicePO?"none":"block",
     loadServiceList:true,
     currentPOIndex:index,
     currentPOLine:{
       poLineId:"",
       lineItemNumber:"",
       poQuantity:"",
       rate:"",
       currency:"",
       deliveryDate:"",
       plant:"",
       deliveryStatus:"",
       controlCode:"",
       trackingNmber:"",
       overDeliveryTol:"",
       underdeliveryTol:"",
       deliveryScheduleAnnual:"",
       deliveryQuantity:"",
       balanceQuantity:"",
       forwardingCondition:"",
       freightCondition:"",
       unloadingCharges:"",
       taxConditions:"",
       basicPrice:"",
       materialCode: "",
       material: "",
       uom: "",
       balanceLimit: "",
       balanceQuantity1: "",
       asnQuantity:"",
       grnQuantity:"",
       batch:""
     }
   });
   this.props.changeLoaderState(true);
   commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",po.poId);
}

searchPOData(){
 // let po=this.state.po.purchaseOrderNumber;
  // commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforUser',po)
 // this.props.changeLoaderState(false);
  if(document.getElementById('POSearch').value==""){
    return false;
  }else{
    if(this.state.doctype=="PO"){
      this.props.changeLoaderState(true);
      let po=this.state.po.purchaseOrderNumber;
      let doctyp=this.state.doctype
      commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforUser',po,doctyp)

  }
  else{
    let po=this.state.po.outboundDeliveryNo;
    let doctyp=this.state.doctype
    commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforUser',po,doctyp)
  }


  }
 }

 savePOData(){
  this.props.changeLoaderState(true);
  // this.props.changeLoaderState(false);
  // let po=this.state.po.purchaseOrderNumber;
   
  //   commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po)
    if(document.getElementById('POSearch').value==""){
    return false;
  }else{
    if(this.state.doctype=="PO"){
      let po=this.state.po.purchaseOrderNumber;
      let doctyp=this.state.doctype
      commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po,doctyp)
  
      }else{
      let po=this.state.po.outboundDeliveryNo;
      let doctyp=this.state.doctype
       commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po,doctyp)
      }  
    }
 }


 gateEntryASNReminder(){
  if(document.getElementById('POSearch').value==""){
     return false;
   }else{
     commonSubmitWithParam(this.props,"saveASNDetailsResponse","/rest/sendASNCreationReminderForGateEntry",this.state.po.purchaseOrderNumber)
   }

}

handleFilterChange = (key,event) => {
  this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);

}

handleSavePO = () => {
  this.searchPOData();
}


handleFilterClick = async (index) => {
  //this.searchPOData();
let urls="";
if(document.getElementById('POSearch').value==""){
  return false;
}else{

  if(this.state.doctype=="PO"){
    let po=this.state.po.purchaseOrderNumber;
    let doctyp=this.state.doctype
    //commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po,doctyp)
    urls = `/rest/getPOforGateEntry/${po}/${doctyp}`

    }else{
    let po=this.state.po.outboundDeliveryNo;
    let doctyp=this.state.doctype
   //  commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po,doctyp)
      urls = `/rest/getPOforGateEntry/${po}/${doctyp}`
    }

this.props.changeLoaderState(true);
savetoServer({urls}).then(async (index) => {

this.props.onFilter &&  this.props.onFilter();
this.setState({formDisplay: !this.state.formDisplay});
this.setState({searchDisplay: !this.state.searchDisplay});
await delay(500);
this.loadPODetails(index);
})
}}


//  handleFilterClick = async (index) => {
//   //this.searchPOData();

//   this.savePOData()
//   await delay(1000)
//   this.props.onFilter &&  this.props.onFilter();
//   this.setState({formDisplay: !this.state.formDisplay});
//   this.setState({searchDisplay: !this.state.searchDisplay}); 
//   await delay(1000);
//   this.loadPODetails(index);

//  }


 createSTOASN=()=>{
  let po = this.props.poList[0];
  this.props.createASN(po,this.state.poLineArray)

 }

render() {
  const {filter} = this.props;
  const attachmentId=this.state.attachmentId;
  const ExcelFileName=this.state.fileName;
  var displayService="none";
  if(!isEmpty(this.state.serviceArray)){

  displayService="block";
  }
  var shown = {
    display: this.state.shown ? "block" : "none"
  };
  var hidden = {
    display: this.state.hidden ? "none" : "block"
      }
var frmhidden = {
        display: this.state.formDisplay ? "none" : "block"
          }  
          var searchHidden = {
            display: this.state.searchDisplay ? "block" : "none"
              } 
    return (
      <React.Fragment>
     <div className="wizard-v1-content " style={{marginTop:"80px"}}>
        <div style={ hidden} className="card pt-2">
      
      <FormWithConstraints>

      <div className="row">
        <div className="col-sm-12">

       <div className="col-sm-2">
       <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
       <InputLabel>Select Option</InputLabel>
                              <Select  name="doctype"  label="Select Option" fullWidth
                              value={this.state.doctype} 
                         onChange={(event) => {
                              {
                               commonHandleChange(event, this, "doctype", "")
                             }}}
                            ><MenuItem value="">Select</MenuItem>
                              <MenuItem value="PO">PO</MenuItem>
                              {/* <MenuItem value="STO">STO</MenuItem> */}
                              <MenuItem value="Other">Other</MenuItem>
                              {/* {(this.state.asnStatusList).map(item=>
                                <option value={item.value}>{item.display}</option>
                              )}  */}
                            </Select></FormControl></div>
                            {this.state.doctype=="PO"?
        <div className="row mt-2" style={{paddingLeft:"16px"}}>
                      
                      <div className="col-sm-3">
                        
                        <TextField label="Po No" size="small" fullWidth variant="outlined" type="text"  id="POSearch"  className="form-control"  value={filter.poNoFrom} onInput={ (e) => {commonHandleChange(e,this,"po.purchaseOrderNumber");}} onChange={this.handleFilterChange.bind(this,'poNoFrom') }/>
                      </div>

                      <div className="col-sm-3">
                          <Button type="button" variant="contained" color="primary" onClick={this.handleSavePO.bind(this)}> Search </Button>
                          &nbsp;
                          <Button type="button" variant="contained" color="primary" onClick={() => {this.gateEntryASNReminder()}}> ASN Reminder </Button>
                      </div>
                
                      {/*<label>To </label>
                      <div className="col-sm-2">
                        <input type="number" className="form-control"  value={filter.poNoTo} onChange={this.handleFilterChange.bind(this,'poNoTo')} />
                      </div>*/}

            </div>
            : 
            // this.state.doctype=="STO"
            // ? <div className="row mt-2">
            //           <label className="col-sm-2 mt-55">OutBound Delivery Number</label>
            //           <div className="col-sm-2 mt-55">        
            //             <input type="number"  id="POSearch"  className="form-control"  value={filter.outboundDeliveryNo} onInput={ (e) => {commonHandleChange(e,this,"po.outboundDeliveryNo");}} onChange={this.handleFilterChange.bind(this,'outboundDeliveryNo') }/>
            //           </div>
            //           <div className="col-sm-3 mt-55">
            //               <button type="button" className={"btn btn-primary"} onClick={this.handleSavePO.bind(this)}> Search </button>
                         
            //           </div>
                   
            // </div>:
            this.state.doctype=="Other"?  
           
            <ASNWithoutPO doctype={this.state.doctype}/>
            :""}
            </div>

       {/* <div className="col-sm-12">

            <div className="row mt-2">
                      <label className="col-sm-2 mt-4">Po Date</label>
                      <div className="col-sm-2">
                      
                        <input type="date" className="form-control"  value={filter.poDateFrom} onChange={this.handleFilterChange.bind(this,'poDateFrom')} />
                      </div>
                
                      <label>To </label>
                      <div className="col-sm-2">
                        <input type="date" className="form-control"  value={filter.poDateTo} onChange={this.handleFilterChange.bind(this,'poDateTo')} />
                      </div>


            </div>

        </div>*/}
      </div>

      { /* <div className="row mt-4">
        <label className="col-sm-2">Employee code </label>

                      <div className="col-sm-2">
                        <input type="text" className="form-control"  value={filter.empCode} onChange={this.handleFilterChange.bind(this,'empCode')} />
                      </div>
		</div>*/}
        {/* <label className="col-sm-2">Vendor code </label>
                     <div className="col-sm-2">
                        <input type="text" className="form-control"   onChange={this.handleFilterChange.bind(this,'vendorCode')} />
                      </div>
                      <div className="col-sm-1">
                        <button  type="button" className={"btn btn-link"} data-toggle="modal" data-target="#searchCompanyModal" ><img src={alkylLogo} alt="" /></button>
  </div> */}
        
        {/* {this.state.doctype=="Other"?"": */}
        {this.state.doctype=="PO"?
        <div className="row">
           <div className="col-sm-9"></div>
           <div className="col-sm-3" style={{paddingRight:"2rem"}}>
            <input
             id="SearchTableDataInput" 
             onKeyUp={searchTableData} 
             style={{fontSize: "10px", float:"right" }}
             placeholder="Search .." />

    </div>

        </div>:""
      }
{this.state.doctype=="Other"?""
:
this.state.doctype=="STO"?<STOASN doctype={this.state.doctype}/>
:
      <div>
           {/* <div style={ searchHidden} className="col-sm-3">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
            </div>*/}
               <div className="col-sm-12 mt-2">
               <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"16px"}}>PO LIST</label>
                                 </div>
                <div class="table-proposed">
                <StickyHeader height={100} className="table-responsive width-adjustment">
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>                          
                           <TableCell>PO No</TableCell>
                           {/* <TableCell>Document Type</TableCell> */}
                           <TableCell className="text-center">PO Date</TableCell>
                           <TableCell className="text-center" style={{display:this.state.vendorCodeShown}}>Vendor Code</TableCell>
                           <TableCell style={{display:this.state.vendorNameShown}}>Vendor Name</TableCell>
                           {/* <TableCell>Plant</TableCell> */}
                           {/* <TableCell>Inco Terms </TableCell> */}
                           {/* <TableCell>Requested By</TableCell> */}
                           {/* <TableCell>Purchase Group</TableCell> */}
                           <TableCell className="text-center">Version No</TableCell>
                           <TableCell>Status</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBody">
                            {
                              this.state.purchaseOrderList.map((po,index)=>
                                <TableRow onClick={()=>{this.handleFilterClick(index)}}>
                                  <TableCell>{po.purchaseOrderNumber}</TableCell>
                                  {/* <TableCell>{po.documentType}</TableCell> */}
                                  <TableCell className="text-center">{formatDateWithoutTimeNewDate2(po.poDate)}</TableCell>
                                  <TableCell className="text-center" style={{display:this.state.vendorCodeShown}}>{po.vendorCode}</TableCell>
                                  <TableCell style={{display:this.state.vendorNameShown}}>{po.vendorName}</TableCell>
                                  {/* <TableCell>{po.plant}</TableCell> */}
                                  {/* <TableCell>{po.requestedBy.name}</TableCell> */}
                                  {/* <TableCell>{po.incomeTerms}</TableCell> */}
                                  {/* <TableCell>{po.purchaseGroup}</TableCell> */}
                                  <TableCell className="text-center">{po.versionNumber}</TableCell>
                                  {/* <TableCell>{this.state.newPoStatus[po.status]}</TableCell> */}
                                  <TableCell>{po.status}</TableCell>
                                </TableRow>
                              )
                            }

                       </TableBody>
                     </Table>
                     </StickyHeader>
                  </div>
                    </div>
                    <div className="col-sm-12 text-center mt-2 ">
                    <label style={{fontSize:"16px"}}>
                                    {this.state.purchaseOrderList[0]!=null?this.state.purchaseOrderList[0].pstyp == "9" ? "SSN LIST" : "ASN LIST":"ASN LIST"}
                                      </label>
                                 </div>
                    
                 <div className="col-sm-12 mt-1">
         <div>
            <StickyHeader  className="table-responsive" style={ hidden }>
               <Table className="my-table">
                  <TableHead>
                     <TableRow>
                        {/* <TableCell>{this.state.po.isServicePO ? "Service Note No" : "ASN No"}</TableCell> */}
                         {/* <TableCell>PO No</TableCell> */}
                        <TableCell> {this.state.purchaseOrderList[0]!=null?this.state.purchaseOrderList[0].pstyp == "9" ? "Service Note No" : "ASN No":"ASN No"}</TableCell>
                        <TableCell> {this.state.purchaseOrderList[0]!=null?this.state.purchaseOrderList[0].pstyp == "9" ? "SSN Date" : "ASN Date":"ASN Date"}</TableCell>
                        <TableCell>Invoice No</TableCell>
                        <TableCell>Invoice Date</TableCell>
                        <TableCell>Status </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody id="DataTableBodyFour">
                                    
                                    {
                              this.state.gateentryAsnList.map((asn,index)=>
                                <TableRow>
                                  <TableCell>{asn.advanceShipmentNoticeNo!=null?asn.advanceShipmentNoticeNo:asn.serviceSheetNo}</TableCell>
                                  <TableCell>{formatDateWithoutTimeNewDate2(asn.created)}</TableCell>       
                                  <TableCell>{asn.invoiceNo}</TableCell> 
                                  <TableCell>{asn.invoiceDate==null?"":formatDate(asn.invoiceDate)}</TableCell>
                                  <TableCell>{asn.status}</TableCell>


                                </TableRow>
                              )
                            }
                            </TableBody>
                                 </Table>
                              </StickyHeader>
                           </div>
                        </div>
                 </div>
}
      </FormWithConstraints>   
      </div> 
                 
                  <div  style={ shown }>
                  <div className="card p-2">
                    <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints} 
        onSubmit={(e)=>{
          commonSubmitForm(e, this, "securityASNSubmit","/rest/saveASNDirectFor103",  "reports")
        }}
         noValidate>
                  <div className="row">
                      <div className="col-sm-12 text-right">
                          <button className="btn btn-primary" type="button" onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden});}}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                          {/* <a href={API_BASE_URL+"/rest/downloadPO/"+this.state.po.purchaseOrderNumber} className="btn btn-primary ml-2" target="_blank">Print PO</a>
                         */}
                         
                                <Button variant="contained" color="primary" type="button" onClick={this.downloadexcelApi} className="btn btn-primary ml-2" >&nbsp;Print PO</Button>
                                <span><a className="ml-1 mr-1" href={API_BASE_URL + "/rest/download/" + attachmentId}>{ExcelFileName}</a></span>

                          {/* <a href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_26?sap-client=100&PO=${this.state.po.purchaseOrderNumber}`}  target="_blank" className="btn btn-primary ml-2">Print PO</a> */}
                          
                          {/* {this.state.purchaseOrderList.doctyp =="PO"? */}

                          {this.state.po.poTypeMsg!="Directly Post 103 in portal."?
                          <Button variant="contained" color="primary" type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                          onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)}}
                           //  onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.state.ssnFundList,this.props.SSNVersion)}}
                            >
                              {this.state.po.isServicePO?"Create Service Note":"Create ASN"}
                        </Button>            
                         
                         :
                         <Button variant="contained" color="primary" type="submit" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} >
                              Create ASN for 103 Direct
                           {/* {this.state.po.isServicePO?"Create Service Note":"Create ASN 103 Direct"} */}
                      </Button>
                         
                         }
                         {/* :
                         
                                <button type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                                // onClick={()=>{this.createSTOASN()}

                                onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)
                              }}
                               >

                             {this.state.po.isServicePO?"Create Service Note":"Create ASN"}
                          </button>

                           }*/}
                          {/* <button type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                             onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)}}
                            >
                            
                             {this.state.po.isServicePO?"Create Service Note":"Create ASN"}
                          </button> */}
                          {/* <button type="button" className={(this.state.po.status==="REL" || this.state.po.status==="REJ")?"btn btn-success ml-2 inline-block":"btn btn-success ml-2 none"} 
                            onClick={()=>{this.setState({loadPODetails: true}); commonSubmitWithParam(this.props,"poAcceptance","/rest/acceptPO/",this.state.po.poId)}}>
                             Accept
                          </button>
                          <button type="button"  className={this.state.po.status==="REL"?"btn btn-danger ml-2 inline-block":" btn btn-danger ml-2 none"} 
                            onClick={()=>{this.rejectPO()}}>
                              Reject
                          </button> */}
                      </div>
                      <div>
                      {
                              this.state.poLineArray.map((asnLine,index)=>
                                                         <>
                                {/* <input type="hidden" className="form-control" name={"asnLineList[" + 0 + "][poLine][lineItemNumber]"} value={this.state.asnLineList}
                                   /> */}
                                <input type="hidden" name={"asnLineList[" + index + "][poLine][purchaseOrderLineId]"} value={asnLine.poLineId} />
                                <input type="hidden" name={"asnLineList[" + index + "][poLine][lineItemNumber]"} value={asnLine.poLineNumber} />
                                <input type="hidden" name={"asnLineList[" + index + "][poLine][code]"} value={asnLine.materialCode} />
                                <input type="hidden" name={"asnLineList[" + index + "][poLine][name]"} value={asnLine.materialName} />
                                <input type="hidden"  placeholder="0.000"
                                    
                                    name={"asnLineList[" + index + "][deliveryQuantity]"} value={asnLine.poQuantity}
                                    
                                       />
                                    <input type="hidden" name={"asnLineList[" + index + "][poLine][balanceQuantity]"} value={asnLine.balQty} />
                                    <input type="hidden" name={"asnLineList[" + index + "][poLine][uom]"} value={asnLine.uom} />
                                    <input type="hidden" name={"asnLineList[" + index + "][poLine][rate]"} value={getDecimalUpto(asnLine.poRate)} />
                                    <input type="hidden" name={"asnLineList[" + index + "][poLine][plant]"} value={asnLine.plant} />
                                   
                                    </>
                                                        
                                  )}</div>
                                  <div>
                                  <input type="hidden" value={this.state.po.purchaseOrderNumber} name={"po[purchaseOrderNumber]"} />
                                    <input type="hidden" value={this.state.po.poId} name="po[purchaseOrderId]" />
                                    <input type="hidden" value={this.state.po.documentType} name="po[documentType]" />
                                  </div>
                     
                  </div>
                  </FormWithConstraints>
                 
                  <div className="row mt-2">
                      <label className="col-sm-1">PO No</label>
                      <span className="col-sm-2">
                       {this.state.po.purchaseOrderNumber}
                      </span>  
                      <label className="col-sm-2" style={{display:this.state.vendorCodeShown}}>Vendor</label>
                      <span className="col-sm-3" style={{display:this.state.vendorCodeShown}}>
                       {this.state.po.vendorCode}-{this.state.po.vendorName}
                      </span>  
                      <label className="col-sm-1">Version</label>
                      <span className="col-sm-1">
                        {this.state.po.versionNumber}
                      </span>  
                  </div> 
                  <div className="row mt-2">
                      <label className="col-sm-1">PO Date</label>
                      <span className="col-sm-2">
                      {this.state.po.poDate}
                      </span>   
                      <label className="col-sm-2">Requested by</label>
                      <span className="col-sm-3">
                      {this.state.po.requestedBy.name}
                      </span>  
                      
                      <label className="col-sm-1">Status</label>
                      <span className="col-sm-1">
                        {this.state.newPoStatus[this.state.po.status]}
                      </span>  
                  </div> 
                
                  </div>

                 
                  <div className="card p-2">
          <div className={"lineItemDiv min-height-0px "+(displayService==="block"?"display_none":"")}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3" style={{paddingRight:"2rem"}}>
            <input type="text" id="SearchTableDataInputTwo" 
             onKeyUp={searchTableDataTwo} placeholder="Search .." 
             style={{fontSize: "10px", float:"right" }}/>
            </div> 
               <div className="col-sm-12 mt-2">
                  <StickyHeader height={150} className="table-responsive">
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>                         
                           <TableCell> Line No </TableCell>
                           <TableCell> Material Description </TableCell>
                           <TableCell className="text-right"> PO Qty </TableCell>
                           <TableCell> UOM </TableCell>
                           {/* <TableCell className="widTableCell-120px">ASN Qty </TableCell> */}
                           <TableCell>Bal Qty</TableCell>
                           <TableCell className="text-right"> Rate </TableCell>
                           <TableCell>Currency</TableCell> 
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBodyTwo">
                            {
                              this.state.poLineArray.map((poLine)=>
                                <TableRow onClick={()=>this.onClickPOLine(poLine)}>
                                  {/* onClick={()=>this.onClickPOLine(poLine)} */}
                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <TableCell>{removeLeedingZeros(poLine.lineItemNumber)}</TableCell>
                                  <TableCell>{poLine.materialCode} - {poLine.material}</TableCell>
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.poQuantity,3))}</TableCell>
                                  <TableCell>{poLine.uom}</TableCell>
                                  {/* <td className="width-120px">{poLine.asnQuantity}</TableCell> */}
                                  <TableCell>{poLine.balanceQuantity}</TableCell>
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.rate,2))}</TableCell>
                                  <TableCell>{poLine.currency}</TableCell>
                                  
                                </TableRow>
                              )
                     }
                    
                  </TableBody>
               </Table>
            </StickyHeader>
         </div>
      </div>
   </div>
            <br/>
            <div className="lineItemDiv min-height-0px"  style={{display:displayService}}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3" style={{paddingRight:"2rem"}}>
            <input type="text" id="SearchTableDataInputTwo" 
             style={{fontSize: "10px", float:"right" }}
              onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div>
               <div className="col-sm-12 mt-2"> 
                  <StickyHeader height={150} className="table-responsive">
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>             
                           <TableCell> Po Line No.</TableCell>            
                           <TableCell> Service No.</TableCell>
                           <TableCell className="w-40per">Service Description po</TableCell>
                           <TableCell className="text-right"> Required Qty </TableCell>
                           <TableCell> UOM </TableCell>
                           {/* <TableCell>Completed Qty </TableCell>
                           <TableCell>Bal Qty</TableCell> */}
                           <TableCell className="text-right"> Rate </TableCell>
                           <TableCell>Currency</TableCell> 
                           {/* <TableCell>Plant</TableCell> */}
                           <TableCell>Contract Po</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBodyTwo">
                            {
                              this.state.serviceArray.map((service,i)=>
                              
                                <TableRow>

                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <TableCell>{removeLeedingZeros(service.parentPOlineNumber)}</TableCell>
                                  <TableCell>{removeLeedingZeros(service.lineItemNumber)}</TableCell>
                                  <TableCell>{service.materialCode}-{service.material}</TableCell>
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.poQuantity,3))}</TableCell>
                                  <TableCell>{service.uom}</TableCell>
                                  {/* <TableCell>{service.asnQuantity}</TableCell>
                                  <TableCell>{service.balanceQuantity}</TableCell> */}
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.rate,2))}</TableCell>
                                  <TableCell>{service.currency}</TableCell>
                                  {/* <TableCell>{poLine.plant}</TableCell> */}
                                 <TableCell>{service.contractPo}</TableCell>
                                </TableRow>
                              )
                            }
                        
                       </TableBody>
                     </Table>
                  </StickyHeader>
               </div>
            </div>    
           </div>
      <FormWithConstraints>
      <div className="row"  style={{display:this.state.displayDivFlag}}>  
        <div className="col-sm-12 mt-2">
        
        <div className="row">  
            <label className="col-sm-2">Delivery Date</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.deliveryDate}
            </span>         
            <label className="col-sm-2">Delivery Status</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.deliveryStatus}
            </span>  
                              
            <label className="col-sm-2">Control Code</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.controlCode}
            </span>
            </div>
        <div className="row mt-2"> 
        <label className="col-sm-2">ASN Qty</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.asnQuantity}
        </span>   
        <label className="col-sm-2">GRN Qty</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.grnQuantity}
        </span>  
        <label className="col-sm-2">Plant</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.plant}
        </span> 
        </div>
        <div className="row mt-2">
          <label className="col-sm-2">Batch</label>
          <span className="col-sm-2">
              {this.state.currentPOLine.batch}
          </span>
        </div>
        </div>
        </div>
        </FormWithConstraints>   
               
                 </div>
                 <br/>
                 <br/>
                 </div>
      </div>
      
       </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log('state.ssoReducer',state.ssoReducer);
   return state.createNewASNGateEntry;
};

export default connect(mapStateToProps,actionCreators)(CreateASNGateEntryCont);