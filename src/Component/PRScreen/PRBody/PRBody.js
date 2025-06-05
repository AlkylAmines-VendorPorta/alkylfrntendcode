import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import PRList from "../PRList/PRList";
import Enquiry from "../Enquiry/Enquiry";
import VendorSelection from "../VendorSelection/VendorSelection";
import swal from 'sweetalert';
import { API_BASE_URL } from "../../../Constants";
// import QuotationByVendor from "../QuotationByVendor/QuotationByVendor";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  commonSubmitFormNoValidation,
  commonSubmitFormValidation,
  
  commonSetState,
  validateForm,
  resetForm,
  swalWithTextBox,
  showAlert
} from "../../../Util/ActionUtil";
import { isEmpty,isEmptyDeep } from "../../../Util/validationUtil";
import { connect } from "react-redux";
import * as actionCreators from "../PRBody/Action/Action";
import { getUserDto, getFileAttachmentDto,getDecimalUpto,removeLeedingZeros } from "../../../Util/CommonUtil";
import {formatDateWithoutTime,formatDateWithoutTimeNewDate } from "../../../Util/DateUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN,ROLE_PARTNER_ADMIN } from "../../../Constants/UrlConstants";
import Loader from "../../FormElement/Loader/LoaderWithProps";
import PRListBuyer from "../PRList/PRListBuyer";
import { Button } from "@material-ui/core";
// import { setActionValue } from "sweetalert/typings/modules/state";
let onSave = "";
class PRBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attrespData:[],
      isLoading:false,
      prMainContainer: true,
      prDetailsContainer:false,
      prEnquiry:false,
      prVendorSelection: false,
      prQuotationByVendor: false,
      requistioner:false,
      approver:false,
      purchaseManager:false,
      buyer:false,
      prlistadd:false,
      priorityList: [],
      technicalApproverList: [],
      buyerList: [],
      prDetails:
        {
          headerText:"",
          prId:"",
          docType: "",
          prNumber: "",
          requestedBy:{
            userId: "",
            name: "",
            empCode:""
          },
          isTC:"",
          priority:"",
          status:"",
          approverCode: "",
          approverName: "",
          approvedBy:{
            userId: "",
            name: "",
            empCode:""
          },
          tcApprover:{
            userId: "",
            name: "",
            empCode:""
          },
          buyer:{
            userId: "",
            name: "",
            empCode:""
          },
          createdBy:{
            userId: "",
            name: "",
            empCode:""
          },
          approver:{
            userId: "",
            name: "",
            empCode:""
          },
          date:"",
          bidEndDate:"",
          releasedBy:{
            userId: "",
            name: "",
            empCode:""
          }
        },
      prLineArray: [],
      currentPrDetails: {
        prId:"",
        docType: "",
        prNumber: "",
        requestedBy:{
          userId: "",
          name: "",
          empCode:""
        },
        isTC:"",
        priority:"",
        status:"",
        approverCode: "",
        approverName: "",
        approvedBy:{
          userId: "",
          name: "",
          empCode:""
        },
        tcApprover:{
          userId: "",
          name: "",
          empCode:""
        },
        buyer:{
          userId: "",
          name: "",
          empCode:""
        },
        createdBy:{
          userId: "",
          name: "",
          empCode:""
        }
      },
      otherDocumentsList: [
        {
          prAttachmentId:"",
          attachment:{
            attachmentId: "",
            fileName: "",
            text:"",
            description:""
          },
          pr:{
            prId:""
          },
          istc:""
        },
      ],
      multipleBuyerList: [
        {
          thirdPartyPRApproverId:"",
          email: "",
          pr:{
            prId: ""
          }
        },
      ],
      loadPRLineList:false,
      loadOtherDocuments:false,
      loadEmailList:false,
      priorityReadOnly:"readonly",
      buyerReadOnly:"readonly",
      technicalReadOnly:"readonly",
      prLineReadOnly:"readonly",
      otherDocumentsrReadOnly:"readonly",
      loadPrChangeStatus:false,
      currentDocRemoveIndex:"",
      loadDocument:false,
      uploadedFiles:[]
    };
  }

  componentWillReceiveProps = props=>{
    if(this.state.loadDocument && props.removeAttachmentRes && props.removeAttachmentRes.success){
      let otherDocumentsList = this.state.otherDocumentsList;
      otherDocumentsList[this.state.currentDocRemoveIndex] = {
        ...otherDocumentsList[this.state.currentDocRemoveIndex],
        prAttachmentId:"",
        attachment:{}
      }
      this.setState({ otherDocumentsList: otherDocumentsList, loadDocument:false });
    }
    this.setUserByRole(props.role);
    if(this.state.loadPRLineList && !isEmpty(props.prLineList)){
      this.props.changeLoaderState(false);
      this.setPrLine(props);
    }else{
      this.props.changeLoaderState(false);
    }
   
    if(this.state.loadOtherDocuments && !isEmpty(props.attachmentList)){
      this.props.changeLoaderState(false);
      this.setOtherDocuments(props); 
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadEmailList && !isEmpty(props.emailList)){
      this.props.changeLoaderState(false);
      this.setEmailList(props); 
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPrChangeStatus && !isEmpty(props.prDto)){
      // this.props.changeLoaderState(false);
      this.setPrStatus(props.prDto);
    }else{
      this.props.changeLoaderState(false);
    }


    if(!isEmpty(props.attrespData)){
      this.setState({ attrespData: props.attrespData});
     // this.setPrStatus(props.prDto);
    }else{
      this.props.changeLoaderState(false);
    }

  }

  setPrLine=(props)=>{
    let prLineList = [];
      props.prLineList.map((prLine)=>{
        prLineList.push(this.getPRLineFromObj(prLine));
      });
      this.setState({
        prLineArray : prLineList,
        loadPRLineList: false
      });
  }

  getPRLineFromObj=(prLineObj)=>{
    return {
      prLineId : prLineObj.prLineId,
      deliverDate: formatDateWithoutTimeNewDate(prLineObj.deliverDate),
      requiredDate: formatDateWithoutTimeNewDate(prLineObj.requiredDate),
      plant:prLineObj.plant,
      controlCode:prLineObj.controlCode,
      trackingNo:prLineObj.trackingNo,
      reqQty: prLineObj.quantity,
      rate: prLineObj.rate,
      balanceQuantity: prLineObj.balanceQuantity,
      lineNumber:prLineObj.lineNumber,
      fixedVendor:getUserDto(prLineObj.fixedVendor),
      description:prLineObj.description,
      assignment:prLineObj.assignment,
      accountAssignment:prLineObj.accountAssignment,
      i:prLineObj.itemCategory,
      materialDesc:prLineObj.materialDesc,
      materialCode: prLineObj.materialCode,
      isChecked:"",
      uom:prLineObj.uom,
      price:prLineObj.price,
      index:"",
      buyer: prLineObj.buyer ? prLineObj.buyer:{},
      desiredVendor: prLineObj.desiredVendor ? prLineObj.desiredVendor:{},
      prLineNumber: removeLeedingZeros(prLineObj.prLineNumber),
   //  headerText: prLineObj.headerText,
     headerText: prLineObj.headerText?prLineObj.headerText:this.state.prDetails.headerText,
      materialPOText: prLineObj.materialPOText,
      desireVendorCode:prLineObj.desireVendorCode,
      purchaseGroup:prLineObj.purchaseGroup,
      plantDesc:prLineObj.plantDESC
    }
  }

  setOtherDocuments=props=>{
    let tempOtherDocumentsList=[];
      props.attachmentList.map((el,i)=>{
        tempOtherDocumentsList.push(this.getOtherDocuments(el));
      })
      this.setState({
        otherDocumentsList:tempOtherDocumentsList,
        loadOtherDocuments:false
      })
  }

  getOtherDocuments=el=>{
    if(!isEmpty(el)){
      return el;
    }else{
      this.getEmptyDocObj()
    }
  }

  getEmptyDocObj=()=>{
    return {
      prAttachmentId:"",
      attachment:{
        attachmentId: "",
        fileName: "",
        text:""
      },
      pr:{
        prId:""
      },
      istc:""
    }
  }

  getEmptyEmailObj=()=>{
    return {
      thirdPartyPRApproverId:"",
      email: "",
      pr:{
        prId: ""
      },
    }
  }

  setEmailList=props=>{
    let tempEmailList=[];
      props.emailList.map((el,i)=>{
        tempEmailList.push(this.getEmailfromObj(el));
      })
      this.setState({
        multipleBuyerList:tempEmailList,
        loadEmailList:false
      })
  }

  getEmailfromObj=el=>{
    return {
      thirdPartyPRApproverId:el.thirdPartyPRApproverId,
      email: el.email,
        pr:{
          prId: el.pr.prId
        }
    }
  }

  setPrStatus=(prDto)=>{
    commonSetState(this,"prDetails.status",prDto.status);
  }

  addPrlist=(item)=>{
    console.log("itemtrue",item)
    this.setState({prlistadd:item})
  }

  setUserByRole=role=>{
    if(role===ROLE_PURCHASE_MANAGER_ADMIN){
      this.setState({requistioner:false,purchaseManager:true,approver:false,buyer:false,technicalReadOnly:"readonly",priorityReadOnly:"readonly",prLineReadOnly:"",buyerReadOnly:""})
    }else if(role===ROLE_APPROVER_ADMIN){
      this.setState({requistioner:false,purchaseManager:false,approver:true,buyer:false})
    }else if(role===ROLE_REQUISTIONER_ADMIN){
      this.setState({requistioner:true,purchaseManager:false,approver:false,buyer:false})
    }else if(role===ROLE_BUYER_ADMIN){
      this.setState({requistioner:false,purchaseManager:false,approver:false,buyer:true})
    }
    // else if(role===ROLE_PARTNER_ADMIN){
    //   this.setState({requistioner:true,purchaseManager:true,approver:true,buyer:true})
    // }
  }

  disabledReadOnly=()=>{
    this.props.disabledReadOnly();
    if(this.props.role===ROLE_PURCHASE_MANAGER_ADMIN){
      this.setState({technicalReadOnly:"readonly",priorityReadOnly:"readonly",prLineReadOnly:"",buyerReadOnly:""})
    }else if(this.props.role===ROLE_APPROVER_ADMIN){
      this.setState({buyerReadOnly:"readonly",priorityReadOnly:"",technicalReadOnly:"",prLineReadOnly:""})
    }else if(this.props.role===ROLE_REQUISTIONER_ADMIN){
      this.setState({buyerReadOnly:"readonly",priorityReadOnly:"",technicalReadOnly:"",prLineReadOnly:""})
    }
  }

  updatePRRejectReason=(e)=>{
    this.setState({loadPrChangeStatus:true});
    swalWithTextBox(e,this,"updatePRReject");
  }

  updatePRReject=(value)=>{
    
    this.props.changeLoaderState(true);
    commonSubmitWithParam(this.props,"updatePRReject","/rest/updatePRReject",this.state.prDetails.prId,value);
  }


  loadPRMainContainer() {
    this.setState({
      prMainContainer: true,
      prDetailsContainer: false,
      prEnquiry: false,
      prVendorSelection: false,
      prQuotationByVendor: false,
      prLineReadOnly:"readonly"
    });
  }

  showPrDetails=()=>{
    this.setState({
      prMainContainer: false,
      prDetailsContainer: true,
      prEnquiry: false,
      prVendorSelection: false,
      prQuotationByVendor: false,
    })
  }

  loadPRDetails=(index)=> {
    let pr=this.props.prList[index];
    this.resetCurrentPr();
    this.props.changeLoaderState(true)
    this.setState({
      prMainContainer: false,
      prDetailsContainer: true,
      prEnquiry: false,
      prVendorSelection: false,
      prQuotationByVendor: false,
      loadPRLineList:true,
      loadOtherDocuments:true,
      prDetails:pr,
      loadEmailList:true
    });
    commonSubmitWithParam(this.props,"getPRLines","/rest/getPRLinebyPrId",pr.prId);
  }
  loadPREnquiry=(data)=> {
    if([ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN].includes(this.props.role)){
      this.setState({
        prMainContainer: true,
        prDetailsContainer: false,
        prEnquiry: false,
        prVendorSelection: false,
        prQuotationByVendor: false,
        prlistadd:data
      });
     }else{
      this.setState({
        prMainContainer: false,
        prDetailsContainer: false,
        prEnquiry: true,
        prVendorSelection: false,
        prQuotationByVendor: false,
      });
     }
  }
  loadVendorSelection=(e)=> {
  
      this.setState({
        prMainContainer: false,
        prDetailsContainer: false,
        prEnquiry: false,
        prVendorSelection:true,
        prQuotationByVendor:false
      });

    // commonSubmitWithParam(this.props, "getPRLines", "/rest/getPRLinebyPrId", pr.prId);
  }
  loadQuotationByVendor=(index)=> {
    let pr = this.props.prList[index];
    this.resetCurrentPr();
    this.setState({
      prMainContainer: false,
      prDetailsContainer: false,
      prEnquiry: false,
      prVendorSelection: false,
      prQuotationByVendor: true,
      loadPRLineList: false,
      loadOtherDocuments: false,
      prDetails: pr,
      loadEmailList: false
    });
    // commonSubmitWithParam(this.props, "getPRLines", "/rest/getPRLinebyPrId", pr.prId);
  }
  hideEnquiryDiv = () =>{
    
  }

  addOtherDocument=()=> {
    let currOtherDocList = this.state.otherDocumentsList;
    let otherDocumentsArray = [
      this.getEmptyDocObj()
    ];
    otherDocumentsArray = currOtherDocList.concat(otherDocumentsArray);
    this.setState({
      otherDocumentsList: otherDocumentsArray,
    });
  }

  onClearDocuments = (i) => {
    //commonSubmitWithParam(this.props, "removeAttachment", "/rest/deletePRAttachment", this.state.otherDocumentsList[i].prAttachmentId);
   // this.setState({ currentDocRemoveIndex: i, loadDocument:true });
     let otherDocumentsList = this.state.otherDocumentsList;
     otherDocumentsList[i] = {
       ...otherDocumentsList[i],
      prAttachmentId:"",
      attachment:{}
     }
   this.setState({ otherDocumentsList: otherDocumentsList });
  }

  onClearPRDocuments =(i) => {
    let otherDocumentsList = this.state.otherDocumentsList[i];
    if(otherDocumentsList.attachment.fileName=="" || otherDocumentsList.attachment.fileName==undefined){
      return alert("Please Attach file");
    }
    else{
      
      if(this.state.attrespData[i]==undefined && otherDocumentsList.prAttachmentId==undefined){
        return alert("Please save file");
      }
      else{
          commonSubmitWithParam(this.props, "removeAttachment", "/rest/deletePRAttachment", otherDocumentsList.prAttachmentId!==undefined?otherDocumentsList.prAttachmentId:this.state.attrespData[i].prAttachmentId);
          this.setState({ currentDocRemoveIndex: i, loadDocument:true});
          let attrespData = this.state.attrespData;
          attrespData[i] = {
            ...attrespData[i],
           prAttachmentId:"",
          }
        this.setState({ attrespData: attrespData });
         
      }
    }
  }

  onSavePRDocuments =(e) => {
    let otherDocumentsList = this.state.otherDocumentsList[0];
    if(otherDocumentsList.attachment.fileName=="" || otherDocumentsList.attachment.fileName==undefined){
     // return false;
     return alert("Please Attach file");
    }
    else{
    commonSubmitFormNoValidation(e, this,"updatePRAttachmentSubmit", "/rest/updatePRDocumentSave");
    }
 
  }

  removeOtherDocument(i) {
    let otherDocumentsList = this.state.otherDocumentsList;
    otherDocumentsList.splice(i,1);
    this.setState({ otherDocumentsList: otherDocumentsList });
  }

  addmultipleBuyerList() {
    let currmultipleBuyerList = this.state.multipleBuyerList;
    let multipleBuyerListArray = [
      this.getEmptyEmailObj()
    ];
    multipleBuyerListArray = currmultipleBuyerList.concat(multipleBuyerListArray);
    this.setState({
      multipleBuyerList: multipleBuyerListArray,
    });
  }

  removemultipleBuyerList(i) {
    let multipleBuyerList = this.state.multipleBuyerList;
    multipleBuyerList.splice(i, 1);
    this.setState({ multipleBuyerList: multipleBuyerList });
  }

  resetCurrentPr=()=>{
    this.setState({
      currentPrDetails: {
        prId:"",
        docType: "",
        prNumber: "",
        prDate:"",
        requestedBy:{
          userId: "",
          name: "",
          empCode:""
        },
        isTC:"",
        priority:"",
        status:"",
        approverCode: "",
        approverName: "",
        approvedBy:{
          userId: "",
          name: "",
          empCode:""
        },
        tcApprover:{
          userId: "",
          name: "",
          empCode:""
        },
        buyer:{
          userId: "",
          name: "",
          empCode:""
        },
        createdBy:{
          userId: "",
          name: "",
          empCode:""
        },
        releasedBy:{
          userId: "",
          name: "",
          empCode:""
        }
      }
    })
  }

  onEdit = () => this.setState({prLineReadOnly:false})

  cancelPR = () =>{
    swal({
      title:"Cancelled",
      text:"PR Cancelled",
      icon:"warning",
      type:"danger"
    }).then(isConfirm => {
      if(isConfirm){
        this.loadPRMainContainer();
      }
    })
  }

 save=(e)=>{
  // console.log("esave",e,this) 
  commonSubmitFormValidation(e,this,"updatePRSubmit","/rest/updatePRSave");
 }

  render() {
    var isTcDocSec = this.state.prDetails.isTC ? "display_block" : "display_none";
    return (
      <>
        {/* <Loader isLoading={this.state.isLoading}/> */}
        <div className="wizard-v1-content" style={{marginTop:"80px"}}>
        <FormWithConstraints ref={formWithConstraints => this.prForm = formWithConstraints}
        onSubmit={(e)=>{{ this.setState({loadPrChangeStatus:true});
        // debugger;
        // e.target.ariaValueText==="save"?
        // commonSubmitForm(e,this,"updatePRSubmit","/rest/updatePRSave","prForm")
        // :
          commonSubmitForm(e,this,"updatePRSubmit","/rest/updatePRSubmit","prForm")
        }}}>
           <input
            type="hidden"
            name="prId"
            value={this.state.prDetails.prId}
            disabled={isEmpty(
              this.state.prDetails.prId
            )}
           />

          {/* <input
            type="hidden"
            name="code"
            value={!isEmpty(onSave)?"save":""}
           /> */}

    {/* <MaterialTable prLineArray={this.props.prList}/>  */}
          <div
            className={
              " " +
              (this.state.prMainContainer == true
                ? "display_block"
                : "display_none")
            }
            id="togglesidebar"
          >
            { this.state.prMainContainer &&
              // <PRList prList={this.props.prList} 
              // prStatusList={this.props.prStatusList}
              // loadPRDetails={(i) => this.loadPRDetails(i)}
              // // purchaseManager={false}
              // buyerList={this.props.buyerList}
              // purchaseManager={this.state.purchaseManager || this.state.buyer}
              // role={this.props.role}
              // technicalApproverList={this.props.technicalApproverList}
              // prStatusList={this.props.prStatusList}
              // priorityList={this.props.priorityList}
              // changeLoaderState={this.props.changeLoaderState} groupByLists={this.props.groupByLists}
              // loadVendorSelection={()=>this.loadVendorSelection()}
              // />
              <>
               <div
            className={
              (this.props.role !== ROLE_BUYER_ADMIN
                ? "display_block"
                : "display_none")
            }
          >
        {/* {  this.state.purchaseManager &&  */}
        <PRList prList={this.props.prList} 
              prStatusList={this.props.prStatusList}
              loadPRDetails={(i) => this.loadPRDetails(i)}
              buyerList={this.props.buyerList}
              purchaseManager={this.state.purchaseManager}
              role={this.props.role}
              technicalApproverList={this.props.technicalApproverList}
              //prStatusList={this.props.prStatusList}
              priorityList={this.props.priorityList}
              changeLoaderState={this.props.changeLoaderState} groupByLists={this.props.groupByLists}
              filter={this.props.filter}
              onFilterChange={this.props.onFilterChange} 
              onFilter={this.props.onFilter} 
              filterBuyerList={this.props.filterBuyerList}
              filterPlantList={this.props.filterPlantList}
              filterPRStatusList={this.props.filterPRStatusList}
              filterPurhaseGroupList={this.props.filterPurhaseGroupList}
              onClearFilter={this.props.onClearFilter}
              />
            </div>

              </>
            }
          </div>

          <div
            className={
              this.state.prDetailsContainer == true
                ? "display_block"
                : "display_none"
            } id="togglesidebar"
          >
            <div className="card my-2">

              <div className="row mt-0 px-4 pt-1">
                <div className="col-6 col-md-2 col-lg-2">
                  <label className="mr-4 label_12px">PR Type</label>
                  <span className="display_block">
                    {this.state.prDetails.docType}
                  </span>
                </div>
                <div className="col-6 col-md-2 col-lg-2">
                  <label className="mr-4 label_12px">PR No.</label>
                  <span className="display_block">
                    {this.state.prDetails.prNumber}
                  </span>
                </div>
               
               {this.props.role === ROLE_APPROVER_ADMIN?
                <div className="col-12 col-md-4 col-lg-4">
                  <label className="mr-4 label_12px">Created By</label>
                  <span className="display_block">
                  {this.state.prDetails.releasedBy.empCode + " - "+this.state.prDetails.releasedBy.name}
                  {/* {this.state.prDetails.createdBy.empCode + " - "+this.state.prDetails.createdBy.name} */}
                    {/* {this.state.prDetails.requestedBy.empCode + " - "+ this.state.prDetails.requestedBy.name} */}
                  </span>
                </div>:""}
                <div className="col-6 col-md-2 col-lg-2">
                  <label className="mr-4 label_12px">Techno/Comm</label>
                  <input type="checkbox" name="isTC" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.prDetails.isTC} onChange={(e) => { commonHandleChangeCheckBox(e, this, "prDetails.isTC") }}/>
                </div>
                <div className="col-6 col-md-2 col-lg-2">
                  <button className={"btn btn-sm btn-outline-primary mgt-10 "+ this.props.readonly} type="button" data-toggle="modal" data-target="#documentModal"><i className="fa fa-file" />&nbsp;Documents</button>
                </div>
              </div>
              <div className="row mt-0 px-4 pt-1">
                <div className="col-12 col-md-2 col-lg-2">
                  <div className="form-group">
                  {/* <label className="mr-2 label_12px">Priority</label> */}
                  <label className="mr-2 label_12px">Priority <span className="redspan">*</span></label>
                    <input
                      type="hidden"
                      name="priority"
                      // disabled={isEmpty(
                      //   this.state.prDetails.priority
                      // )}
                      value={this.state.prDetails.priority}
                    />
                    <select
                      className={"form-control " + this.state.priorityReadOnly}
                      value={this.state.prDetails.priority}
                      // disabled={this.state.prLineReadOnly}
                      // defaultValue={"LOW"}
                      onChange={(event) =>
                        commonHandleChange(
                          event,
                          this,
                          "prDetails.priority"
                        )
                      }
                    >
                       <option value="">Select</option>
                      {this.props.priorityList.map(records=>
                        <option value={records.value}>{records.display}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-2 col-lg-2">
                  <label className="mr-4 label_12px">Status</label>
                  <span className="display_block">
                    {this.props.prStatusList[this.state.prDetails.status]}
                  </span>
                </div>
                <div className="col-12 col-md-4 col-lg-4">
                  <label className="mr-4 label_12px">Header Text</label>
                  <span className="display_block">
                    <textarea
                  // className={"h-50px form-control " + this.state.prLineReadOnly}
                   // value={this.state.prLineArray[0]?.headerText}
                     className={"h-50px form-control "}
                     defaultValue={this.state.prLineArray[0]?.headerText}
                     onChange={(event) =>
                       commonHandleChange(
                         event,
                         this,
                         "prDetails.headerText"
                       )
                     }
                    />
                  </span>
                </div>
                {/* <div className="col-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="mr-1 label_12px">Approver</label>
                    <span className="display_block">
                      {this.state.prDetails.approver.empCode + " - " + this.state.prDetails.approver.name}
                    </span>
                  </div>
                </div> */}
                <div className="col-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="mr-2 label_12px">Technical Approver</label>
                    <input
                      type="hidden"
                      name="tcApprover[userId]"
                      disabled={isEmpty(
                        this.state.prDetails.tcApprover.userId
                      )}
                      value={this.state.prDetails.tcApprover.userId}
                    />
                    <select
                      disabled={!this.state.prDetails.isTC}
                      className={"form-control "  + this.state.technicalReadOnly}
                      value={this.state.prDetails.tcApprover.userId}
                      onChange={(event) =>
                        commonHandleChange(
                          event,
                          this,
                          "prDetails.tcApprover.userId"
                        )
                      }
                    >
                      <option value="">Select Technical Approver</option>
                      {this.props.technicalApproverList.map(records =>
                        <option value={records.userId}>{records.name}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              
              <div className="row mt-0 px-4 pt-1">

              {/* <div className="col-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="mr-1 label_12px">Buyer</label>
                    <input
                      type="hidden"
                      name="buyer[userId]"
                      value={this.state.prDetails.buyer.userId}
                      disabled={isEmpty(this.state.prDetails.buyer.userId)}
                    />
                    <select
                      className={"form-control " + this.state.buyerReadOnly}
                      value={this.state.prDetails.buyer.userId}
                      onChange={(event) =>
                        commonHandleChange(
                          event,
                          this,
                          "prDetails.buyer.userId"
                        )
                      }
                    >
                      <option value="">Select Buyer</option>
                      {this.props.buyerList.map(records =>
                        <option value={records.userId}>{records.name}</option>
                      )}
                    </select>
                  </div>
                </div> */}


                <div className="col-12 col-md-2 col-lg-2">
                  <div className="form-group">
                    <label className="mr-1 label_12px">Approved By</label>
                    <span className="display_block">
                      {this.state.prDetails.approvedBy.empCode + " - " + this.state.prDetails.approvedBy.name}
                    </span>
                  </div>
                </div>
                {this.state.prDetails.status == 'REJ' ? <div className="col-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="mr-1 label_12px">Remark</label>
                    <span className="display_block">
                    {this.state.prDetails.remarks}
                      {/* {this.state.prDetails.approvedBy.empCode + " - " + this.state.prDetails.approvedBy.name} */}
                      </span>
                  </div> 
                 
                </div>
                 :null

                }
                <div className="col-12 col-md-4 col-lg-4">
                  <div className="form-group">
                    <label className="mr-1 label_12px">Third Party Approver</label>
   
                    <Button variant="contained" size="small" color="primary" className={"display_block " + this.state.technicalReadOnly} type="button" data-toggle="modal" data-target="#multipleBuyerModal"><i className="fa fa-user" />&nbsp;Third Party Approver</Button>
                  </div>
                </div>
              </div>
             
              {this.state.purchaseManager===true?
              <>
                <div className="row mt-0 px-4 pt-1">
                  <div className="col-12 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label className="mr-1 label_12px">Bid End Date</label>
                        <input
                        type="datetime-local"
                        className="form-control"
                        value={this.state.prDetails.bidEndDate}
                        onChange={(event) => {
                          commonHandleChange(event, this, "prDetails.bidEndDate");
                        }}
                      />
                    </div>
                  </div>

                </div>
                <input 
                  type="hidden" 
                  name="bidEndDate" 
                  disabled={isEmpty(this.state.prDetails.bidEndDate)}
                  value={this.state.prDetails.bidEndDate}
                />
              </>
              :<></>}
            </div>
            <div className="card my-2">
              <div className="lineItemDiv min-height-0px">
                <div className="row px-4 py-2">
                  <div className="col-sm-9"></div>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      id="SearchTableDataInputTwo"
                      className="form-control"
                      onKeyUp={searchTableDataTwo}
                      placeholder="Search .."
                    />
                  </div>
                  <div className="col-sm-12 mt-2">
                    <div>
                      <StickyHeader height={250} className="table-responsive">
                      {/* <table className="my-table"> */}
                        <table className="my-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th className="w-6per"> Line No.</th>
                              <th className="w-4per"> A</th>
                              <th className="w-4per"> I</th>
                              <th className="w-40per"> Material Description </th>
                              <th className="text-right w-7per"> Req. Qty </th>
                              <th> UOM </th>
                              <th className="text-right w-8per">Val. Price</th>
                              <th className="w-10per">Plant</th>
                              <th className="w-10per" style={{minWidth:150}}>Buyer</th>
                              <th className="w-10per"> Delivery Date. </th>
                               {/*<th className="w-10per"> Required Date </th>*/}
                              <th className="w-40per">Desire vendor Code & Decription</th>

                            </tr>
                          </thead>
                          <tbody id="DataTableBodyTwo">
                            {this.state.prLineArray.map((prLine,i)=>{
                   //           console.log("ma",prLine);
                  //            console.log("buyer",this.props.buyerList)
                            return (<>
                                <tr class="accordion-toggle" >
                                  <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}>+</td>
                                <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}>{prLine.prLineNumber}</td>
                                <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}>{prLine.accountAssignment}</td>
                                <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}>{prLine.i}</td>
                                <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}>{prLine.materialCode} - {prLine.materialDesc}</td>
                                <td className="text-right">{prLine.reqQty}</td>
                                <td>{prLine.uom}</td>
                                <td className="text-right">{getDecimalUpto(prLine.price,2)}</td>
                                {/* <td>{prLine.plant}</td> */}
                                <td>{prLine.plant+"-"+prLine.plantDesc}</td>
                                <td>
                                  {/* {
                                   !isEmptyDeep(prLine.buyer) ? `${prLine.buyer.name}-${prLine.buyer.userName}`: */}
                                   <>
                                    { !isEmptyDeep(prLine.buyer)  &&  <input
                                        type="hidden"
                                        name={"prLines["+i+"][buyerId]"}
                                       value={prLine.buyer.userId}
                                      /> 
                                    }
                                      <select
                                   //    disabled={!(!isEmptyDeep(prLine.buyer) && this.state.purchaseManager)}
                                        className={"form-control " + this.state.prLineReadOnly}
                                        onChange={(event) => {
                                          // if(!this.state.purchaseManager) return null;
                                          commonHandleChange(event, this, "prLineArray."+i+".buyer.userId");
                                        }}
                                        value={prLine.buyer?prLine.buyer.userId:null}
                                        //disabled={this.state.prLineReadOnly}
                                        // disabled={true}
                                      >
                                        <option value="">Select Buyer</option>
                                        {this.props.buyerList.map(records =>{
                                          return (
                                            //<option value={records.userId}>{`${records.userId} - ${records.name}`}</option>
                                            <option value={records.userId}>{`${records.purchaseGroup} - ${records.name}`}</option>
                                          )
                                        })}
                                      </select>

                                   </>
                                  {/* } */}
                                </td>
                                <td>
                                  <input
                                    type="hidden"
                                    className={"form-control " + this.state.prLineReadOnly}
                                    
                                    name={"prLines["+i+"][prLineId]"}
                                    value={prLine.prLineId}
                                    disabled={isEmpty(prLine.prLineId)}
                                  />
                                  <input
                                    type="date"
                                    className={"form-control " + this.state.prLineReadOnly}
                                    max="9999-12-31"
                                    disabled={this.state.prLineReadOnly}
                                    // name={"prLines["+i+"][deliverDate]"}
                                      value={prLine.deliverDate}
                                    onChange={(event) => {
                                      commonHandleChange(event, this, "prLineArray."+i+".deliverDate");
                                    }}
                                  />
                                  <input
                                    type="hidden"
                                    name={"prLines["+i+"][deliverDate]"}
                                    value={prLine.deliverDate}
                                  />
                                </td>
                               {/*<td>
                                <input
                                    type="hidden"
                                    name={"prLines["+i+"][requiredDate]"}
                                    value={prLine.requiredDate}
                                  />
                                  <input
                                    type="date"
                                    className={"form-control " + this.state.prLineReadOnly}
                                    disabled={this.state.prLineReadOnly}
                                    // name={"prLines["+i+"][requiredDate]"}
                                    value={prLine.requiredDate}
                                    onChange={(event) => {
                                      commonHandleChange(event, this, "prLineArray."+i+".requiredDate");
                                    }}
                                  />
                                </td>*/}
                                 {/* <td>{!isEmptyDeep(prLine.desiredVendor) ? `${prLine.desiredVendor.name ? `${prLine.desiredVendor.name} - `:''}${prLine.desiredVendor.userName ? prLine.desiredVendor.userName:''}`:'-'}</td> */}
                                 <td>{prLine.desireVendorCode}</td>
                              </tr>
                                <tr class="hide-table-padding">
                                  <td colSpan="18">
                                    <div id={"collapse" + i} class="collapse in p-1">
                                      <div className="container-fluid px-0">
                                        <div class="row m-0 p-0">
                                          {/* <div className="col-4">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Vendor</label>
                                              <span className="display_block">
                                                {prLine.fixedVendor.name}
                                              </span>
                                            </div>
                                          </div> */}
                                          <div className="col-4">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Tracking No.</label>
                                              <span className="display_block">
                                                {prLine.trackingNo}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="col-4">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Assignment</label>
                                              <span className="display_block">
                                                {prLine.assignment}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row m-0 p-0">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Long Text</label>
                                              <textarea
                                                className={"h-100px form-control " + this.state.prLineReadOnly}
                                                
                                                name={"prLines["+i+"][description]"}
                                                value={prLine.description+" - "+prLine.materialPOText}
                                                onChange={(event) => {
                                                  commonHandleChange(event, this, "prLineArray."+i+".description");
                                                }}
                                                disabled={isEmpty(prLine.prLineId)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        {/* <div class="row m-0 p-0">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">header Text</label>
                                              <textarea
                                                className={"h-50px form-control " + this.state.prLineReadOnly}
                                                
                                                name={"prLines["+i+"][headerText]"}
                                                value={prLine.headerText}
                                                onChange={(event) => {
                                                  commonHandleChange(event, this, "prLineArray."+i+".headerText");
                                                }}
                                                disabled={isEmpty(prLine.prLineId)}
                                              />
                                            </div>
                                          </div>
                                        </div> */}
                                         <input
                                                type="hidden"
                                                name={"prLines["+i+"][headerText]"}
                                                value={this.state.prDetails.headerText?this.state.prDetails.headerText:prLine.headerText}
                                                // value={prLine.headerText}
                                              // value={this.state.prDetails.headerText}
                                            
                                              />
                                      </div>
                                    </div></td>
                                </tr>
                              </>
                            )})
                            }
                          </tbody>
                        </table>
                      </StickyHeader>
                    </div>
              
                  </div>
                </div>
              </div>
              <br />
              <div className="lineItemDiv min-height-0px display_none">
                <div className="row px-4 py-2">
                  <div className="col-sm-9"></div>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      id="SearchTableDataInputTwo"
                      className="form-control"
                      onKeyUp={searchTableDataTwo}
                      placeholder="Search .."
                    />
                  </div>
                  <div className="col-sm-12 mt-2">
                    <StickyHeader height={150} className="table-responsive">
                      <table className="my-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Line Item</th>
                            <th>Service Description </th>
                            <th className="text-right"> Qty </th>
                            <th> Delivery Date </th>
                            <th className="text-right"> Rate </th>
                            <th>Packing No.</th>
                            <th>Desired Vendor</th>
                            <th>Fixed Vendor</th>
                            <th>Purchase Group</th>
                          </tr>
                        </thead>
                        <tbody id="DataTableBodyTwo">
                          <tr>
                            <td></td>
                            <td></td>
                            <td className="text-right"></td>
                            <td></td>
                            <td className="text-right"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </StickyHeader>
                  </div>
                </div>
              </div>
              <hr className="my-1"/>
                <div className="row px-4 py-0">
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                        <button
                        className="btn btn-sm btn-outline-info mr-2"
                          type="button"
                          onClick={() => this.loadPRMainContainer()}
                        >
                          <i className="fa fa-arrow-left"></i>
                        </button>
                     
                      {(this.state.requistioner==true && this.state.prMainContainer==false && !isEmpty(this.state.prDetails) && (this.state.prDetails.status == 'CREATED'|| this.state.prDetails.status == 'REJ') )?                      
                      <>
                        {/* <button onClick={(e)=>{this.save(e)}} type="button" className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Save</button> */}
                        {/* <button type="button" onClick={(e)=>{this.setState({loadPrChangeStatus:true}); this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"updatePRApprove","/rest/updatePRApprove")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Accept</button> */}

                        <button className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Save & Release</button>
                        
                        {/* <button type="button" onClick={()=>this.cancelPR()} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Cancel</button> */}
                        {/* <button type="button" onClick={this.disabledReadOnly} className="btn btn-sm btn-outline-warning mr-2"><i className="fa fa-file"/>&nbsp;Edit</button> */}
                      </>
                      :<></>}
                      {(this.state.approver==true)&&this.state.prMainContainer==false && !isEmpty(this.state.prDetails) && this.state.prDetails.status == 'REL'?
                      <>
                        {/* <button type="button" onClick={this.disabledReadOnly} className="btn btn-sm btn-outline-warning mr-2"><i className="fa fa-file"/>&nbsp;Edit</button> */}
                       {/* <button type="button" onClick={(e)=>{this.setState({loadPrChangeStatus:true}); this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"updatePRApprove","/rest/updatePRSave")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Save</button> */}

                        <button type="button" onClick={(e)=>{this.setState({loadPrChangeStatus:true}); this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"updatePRApprove","/rest/updatePRApprove")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Save & Approve</button>
                        <button type="button" onClick={(e)=>{this.updatePRRejectReason(e)
                          // this.setState({loadPrChangeStatus:true});commonSubmitWithParam(this.props,"updatePRReject","/rest/updatePRReject",this.state.prDetails.prId)
                          }} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Reject</button>
                      </>
                      :<></>}
                      {(this.state.purchaseManager==true)&&this.state.prMainContainer==false?
                      <>
                        <button type="button" onClick={(e)=>{this.setState({loadPrChangeStatus:true}); this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"updatePRBuyerAssign","/rest/updatePRBuyerAssign")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check"/>&nbsp;Save</button>
                        <button type="button" onClick={()=>this.cancelPR()} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Cancel</button>
                      </>
                      :<></>}
                      {this.state.buyer==true && this.state.prMainContainer==false?
                      <>
                        <button type="button" onClick={()=>this.loadPREnquiry()} className="btn btn-sm btn-outline-warning mr-2"><i className="fa fa-file"/>&nbsp;Enquiry</button>
                      </>
                      :<></>}
                      </div>
                  </div>
                </div>
            </div>
          </div>
          {this.props.role == ROLE_BUYER_ADMIN || this.props.role === ROLE_PURCHASE_MANAGER_ADMIN?
          null
          :
          <div className="modal documentModal" id="documentModal" >
            <div className="modal-dialog mt-100" style={{width:"800px", maxWidth:"800px"}}>
            <div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
                <div className="modal-header">
                  Other Documents
                  <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal">
                  &times;
                </button>
                </div>
                <div className={"modal-body "+ this.props.readonly}>
                    <div className={"row mt-1 px-4 py-1 " + isTcDocSec}>
                  <div className="col-sm-2">
                    <span>Technical Document</span>
                  </div>
                </div>
                    <div className="row mt-1 px-4 py-1">
                {this.state.otherDocumentsList.map((el, i) => (
                  <>
                    <div className={"col-sm-2 " + isTcDocSec}>
                      <input
                        type="hidden"
                        disabled={
                          !el.istc
                        }
                        name={"prAttSet[" + i + "][istc]"}
                        value="Y"
                      />
                      <input type="checkbox" className=" mgt-10 m-auto" 
                        onChange={(e) =>commonHandleChangeCheckBox(e, this, "otherDocumentsList." + i + ".istc") }
                        checked={el.istc}
                      />
                    </div>
                     
                    <div className="col-sm-5">
                      <div className="input-group">
                        <div className="custom-file">
                          <input
                            type="hidden"
                            disabled={isEmpty(
                              el.prAttachmentId
                            )}
                            name={"prAttSet[" + i + "][prAttachmentId]"}
                            value={el.prAttachmentId}
                          />
                        <input
                            type="hidden"
                            disabled={isEmpty(
                              el.attachment.attachmentId
                            )}
                            name={"prAttSet[" + i + "][pr][prId]"}
                            value={this.state.prDetails.prId}
                          />
                          <input
                            type="hidden"
                            disabled={isEmpty(
                              el.attachment.attachmentId
                            )}
                            name={
                              "prAttSet[" +
                              i +
                              "][attachment][attachmentId]"
                            }
                            value={
                              el.attachment.attachmentId
                            }
                          />
                          <input
                            type="hidden"
                            disabled={isEmpty(
                              el.attachment.attachmentId
                            )}
                            name={
                              "prAttSet[" +
                              i +
                              "][attachment][fileName]"
                            }
                            value={el.attachment.fileName}
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              // commonSetState(this,"isLoading",true);
                              commonHandleFileUpload(
                                e,
                                this,
                                "otherDocumentsList." + i + ".attachment"
                              );
                            }}
                            className={
                              "form-control custom-file-input " +
                              this.props.readonly
                            }
                            id={"inputGroupFile" + i}
                          />
                          {this.props.role == ROLE_REQUISTIONER_ADMIN || this.props.role === ROLE_APPROVER_ADMIN?
                          <label
                            className="custom-file-label"
                            for={"inputGroupFile" + i}
                          >
                            Choose file
                          </label>
                          :null}
                        </div>
                        {/* {this.props.role == ROLE_REQUISTIONER_ADMIN || this.props.role === ROLE_APPROVER_ADMIN?
                          <div className="input-group-append">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={this.onClearDocuments.bind(this,i)}
                              type="button"
                            >
                              X
                            </button>
                          </div>
                        :null} */}
                      </div>
                      <div>
                        <a
                          href={
                            API_BASE_URL +"/rest/download/" +
                            el.attachment.attachmentId
                          }
                        >
                          {el.attachment.fileName}
                          
                        </a>
                        { el.attachment.fileName != "" && this.props.role === ROLE_APPROVER_ADMIN || this.props.role == ROLE_REQUISTIONER_ADMIN?  
                        <button
                              className="btn btn-sm btn-outline-danger "
                              onClick={this.onClearPRDocuments.bind(this,i)}
                              type="button"
                            >
                              Clear
                            </button>
                             :null}
                      </div>
                      
                      
                      
                    </div>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className={
                          "form-control height_40px " + this.props.readonly
                        }
                        name={"otherDocuments[" + i + "][description]"}
                        value={el.description}
                        onChange={(e) => {
                          commonHandleChange(
                            e,
                            this,
                            "otherDocumentsList." + i + ".attachment.description"
                          );
                        }}
                      />
                    </div>
                    {this.props.role == ROLE_REQUISTIONER_ADMIN || this.props.role === ROLE_APPROVER_ADMIN?
                    <div className="col-sm-2">
                      <button
                        className={
                          "btn " +
                          (i === 0
                            ? "btn-outline-success"
                            : "btn-outline-danger")
                        }
                        onClick={() => {
                          i === 0
                            ? this.addOtherDocument()
                            : this.removeOtherDocument("" + i + "");
                        }}
                        type="button"
                      >
                        <i
                          class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                    :null}
                  </>
                ))}
       <div className="col-sm-6">
                     {this.props.role == ROLE_REQUISTIONER_ADMIN || this.props.role == ROLE_APPROVER_ADMIN?  
                        <button
                              className="btn btn-primary"
                              onClick={(e)=>{this.onSavePRDocuments(e)}}
                              type="button"
                            >
                              Save Attachment
                            </button>
                             :null}</div>
                </div>
                </div>
              </div>
            </div>
          </div>}
          <div className="modal" id="multipleBuyerModal" >
            <div className="modal-dialog mt-100">
              <div className="modal-content">
                <div className="modal-header">
                  Multiple Buyer
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                </button>
                </div>
                <div className="modal-body">
                  <div className="row mt-1 px-4 py-1">
                    {this.state.multipleBuyerList.map((el, i) => (
                      <>
                        <div className="col-sm-9">
                        <input
                            type="hidden"
                            disabled={isEmpty(
                              el.thirdPartyPRApproverId
                            )}
                            name={"emailSet[" + i + "][thirdPartyPRApproverId]"}
                            value={el.thirdPartyPRApproverId}
                          />
                          <input
                            type="hidden"
                            disabled={isEmpty(
                              el.email
                            )}
                            name={"emailSet[" + i + "][pr][prId]"}
                            value={this.state.prDetails.prId}
                          />

                          <input
                            type="hidden"
                            disabled={isEmpty(
                              el.email
                            )}
                            name={"emailSet[" + i + "][email]"}
                            value={el.email}
                          />

                          <input
                            id={"emailSet" + i}
                            type="email"
                            className={
                              "form-control height_40px mb-2 " + this.props.readonly
                            }
                            
                            value={el.email}
                            onChange={(e) => {
                              commonHandleChange(
                                e,
                                this,
                                "multipleBuyerList." + i + ".email"
                              );
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <button
                            className={
                              "btn " +
                              (i === 0
                                ? "btn-outline-success"
                                : "btn-outline-danger mgt-5")
                            }
                            onClick={() => {
                              i === 0
                                ? this.addmultipleBuyerList()
                                : this.removemultipleBuyerList("" + i + "");
                            }}
                            type="button"
                          >
                            <i
                              class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </FormWithConstraints>
          <FormWithConstraints>

          <div
            className={
              "wizard-v1-content " +
              (this.props.role == ROLE_BUYER_ADMIN && this.state.prVendorSelection == false
                ? "display_block"
                : "display_none")
            } style={{marginTop:"10px"}}
          >
            {/* { this.state.buyer && */}
              <PRListBuyer 
              prList={this.props.prList} 
              prStatusList={this.props.prStatusList}
              loadPRDetails={(i) => this.loadPRDetails(i)}
              buyerList={this.props.buyerList}
              role={this.props.role}
              prlistadd={this.addPrlist}
             //addPrlist
              technicalApproverList={this.props.technicalApproverList}
              //prStatusList={this.props.prStatusList}
              priorityList={this.props.priorityList}
              changeLoaderState={this.props.changeLoaderState} groupByLists={this.props.groupByLists}
              loadVendorSelection={()=>this.loadVendorSelection()}
              filter={this.props.filter} onFilterChange={this.props.onFilterChange} onFilter={this.props.onFilter}
              filterPlantList={this.props.filterPlantList}
              filterPRStatusList={this.props.filterPRStatusList}
              filterPurhaseGroupList={this.props.filterPurhaseGroupList}
              onClearFilter={this.props.onClearFilter}
              />
            {/* } */}
            </div>

            <div className={
              this.state.prEnquiry === true
                ? "display_block"
                : "display_none"
            }>
              <Enquiry  
                loadPRMainContainer={()=>this.loadPRMainContainer()} 
                showPrDetails={()=>this.showPrDetails()}
                loadVendorSelection={()=>this.loadVendorSelection()}
                prLineArray={this.state.prLineArray}
                prDetails={this.state.prDetails}
              />
            </div>
            <div className={
              this.state.prVendorSelection === true
                ? "display_block"
                : "display_none"
            }>
              <VendorSelection
                loadPREnquiry={this.loadPREnquiry}
                prLineArray={this.state.prLineArray}
                prId={this.state.prDetails.prId}
                changeLoaderState={this.props.changeLoaderState}
                prlistadd={this.state.prlistadd}
              />
            </div>
            
          </FormWithConstraints>
          <div className={
            this.state.prQuotationByVendor === true
              ? "display_block"
              : "display_none"
          }>
            {/* <QuotationByVendor
              prLineArray={this.state.prLineArray}
            /> */}
          </div>
        </div>
        
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.prBodyReducer;
};
export default connect(mapStateToProps,actionCreators)(PRBody);