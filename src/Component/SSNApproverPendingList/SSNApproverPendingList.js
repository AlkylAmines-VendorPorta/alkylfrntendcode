import React, { Component } from "react";
import { searchTableData} from "../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import Loader from "../FormElement/Loader/LoaderWithProps";
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
    swalWithDate
 } from "../../Util/ActionUtil";
 import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
 import * as actionCreators from "./Action";
 import { connect } from 'react-redux';
 import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
 import { isEmpty } from "../../Util/validationUtil";
 import { searchTableDataThree, searchTableDataFour } from "../../Util/DataTable";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";

import { formatDateWithoutTime, formatDateWithoutTimeWithMonthName } from "../../Util/DateUtil";
import { isServicePO } from "../../Util/AlkylUtil";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict } from "../../Util/CommonUtil";


 const height_dy = window.innerHeight - 135;
 const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

class SSNApproverPendingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        ApprovalPendingServiceSheetLIst:[],
        loadReportVehicle: false,
        unload: false,
        updateASNStatus : false,
        SSNVersion:"",
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
          poAtt:{
            attachmentId:"",
            fileName:""
          },
          requestedBy:{
            userId: "",
            name: "",
            empCode:""
          },
          isServicePO:false
        },
        poLineList :[],
        showCreateASN : false,
        showASNHistory : false,
        role: "",
        user:"",
        serviceLineList:[],
        loadServiceLineList:true,
        asnLineList:[],
        costCenterList:[],
        asnDetails: {
          asnId: "",
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
          invoiceApplicable: false,
          grnNO: "",
          serviceLocation:"",
          serviceFromDate:"",
          serviceToDate:""
       },
       serviceSheetStatusList:[]

    };
  }

 
  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  changeUpdateASNStatusFlag=(flag)=>{
    this.setState({updateASNStatus : flag})
    }

  loadASNForEdit(sslist) {

    this.setState({
      
      shown: !this.state.shown,
      hidden: !this.state.hidden,})
     this.changeLoaderState(true)
    commonSubmitWithParam(this.props, "getASNLineList", "/rest/getASNLines", sslist.advanceShipmentNoticeId);
    //this.setState({loadReportVehicle:true})

   
 }

 showHistoryFalse=()=>{
  this.setState({
    showCreateASN : true,
    showASNHistory : false
  });
}



showGateEntryButtons=(val,asn)=>{
  
  this.setState({
    showGateEntryButtons : val,
    asn : asn
  });
}

showASNHistory = () =>{

  // this.setState({
  //   showPO : false,
  //   showCreateASN : false,
  //   showASNHistory : true,
  //   showASNDetails: false
  // });
  commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",this.state.po.poId);
  this.changeLoaderState(true)
  // this.props.changeLoaderState(true);
  }

  showGateEntryButtons=(val)=>{
    this.setState({
      showGateEntryButtons : val
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

  getASNFromObj(asnlineObj) {
    return {
      advanceShipmentNoticeId: asnlineObj.advanceshipmentnotice.advanceShipmentNoticeId,
      advanceShipmentNoticeNo: asnlineObj.advanceshipmentnotice.advanceShipmentNoticeNo,
       serviceSheetNo: asnlineObj.advanceshipmentnotice.serviceSheetNo,
       po: asnlineObj.advanceshipmentnotice.po,
       invoiceNo: asnlineObj.advanceshipmentnotice.invoiceNo,
       invoiceDate: formatDateWithoutTimeWithMonthName(asnlineObj.advanceshipmentnotice.invoiceDate),
       created:formatDateWithoutTimeWithMonthName(asnlineObj.advanceshipmentnotice.created),
       invoiceAmount: asnlineObj.advanceshipmentnotice.invoiceAmount,
       mismatchAmount: asnlineObj.advanceshipmentnotice.mismatchAmount,
       deliveryNoteNo: asnlineObj.advanceshipmentnotice.deliveryNoteNo,
       deliveryNoteDate: formatDateWithoutTimeWithMonthName(asnlineObj.advanceshipmentnotice.deliveryNoteDate),
       lrDate: formatDateWithoutTime(asnlineObj.advanceshipmentnotice.lrDate),
       lrNumber: asnlineObj.advanceshipmentnotice.lrNumber,
       transporterNo: asnlineObj.advanceshipmentnotice.transporterNo,
       vehicalNo: asnlineObj.advanceshipmentnotice.vehicalNo,
       eWayBillNo: asnlineObj.advanceshipmentnotice.eWayBillNo,
       grossWeight: asnlineObj.advanceshipmentnotice.grossWeight,
       tareWeight: asnlineObj.advanceshipmentnotice.tareWeight,
       numberOfPackages: asnlineObj.advanceshipmentnotice.numberOfPackages,
       isCOA: asnlineObj.advanceshipmentnotice.isCOA === 'Y',
       isPackingList: asnlineObj.advanceshipmentnotice.isPackingList === 'Y',
       typeOfPackingBulk: asnlineObj.advanceshipmentnotice.typeOfPackingBulk,
       remarks: asnlineObj.advanceshipmentnotice.remarks,
       igst: asnlineObj.advanceshipmentnotice.igst,
       cgst: asnlineObj.advanceshipmentnotice.cgst,
       sgst: asnlineObj.advanceshipmentnotice.sgst,
       tcs: asnlineObj.advanceshipmentnotice.tcs ? asnlineObj.advanceshipmentnotice.tcs : 0,
       basicAmount: asnlineObj.advanceshipmentnotice.basicAmount,
       packingCharges: asnlineObj.advanceshipmentnotice.packingCharges,
       freightCharges: asnlineObj.advanceshipmentnotice.freightCharges,
       invoiceDoc: (asnlineObj.advanceshipmentnotice.invoiceNo != null) ? this.checkInvoiceFromObj(asnlineObj.advanceshipmentnotice.invoice) : "",
       deliveryNoteDoc: (asnlineObj.advanceshipmentnotice.deliveryNoteNo != null) ? this.CheckInvoiceFromObjForDelivery(asnlineObj.advanceshipmentnotice.invoice) : "",
       status: asnlineObj.advanceshipmentnotice.status,
       // status: asnObj.status,
       nameOfDriver: asnlineObj.advanceshipmentnotice.nameOfDriver,
       mobileNumber: asnlineObj.advanceshipmentnotice.mobileNumber,
       photoIdProof: asnlineObj.advanceshipmentnotice.photoIdProof,
       loadingCharges: asnlineObj.advanceshipmentnotice.loadingUnloadingCharges,
       irn: asnlineObj.advanceshipmentnotice.irn,
       invoiceApplicable: asnlineObj.advanceshipmentnotice.invoiceApplicable,
       isUnload: asnlineObj.advanceshipmentnotice.isUnload === 'Y',
       isQC: asnlineObj.advanceshipmentnotice.isQCPassed === 'Y',
       grnNO: asnlineObj.advanceshipmentnotice.grnId,
       description: asnlineObj.advanceshipmentnotice.description,
       roundOffAmount: asnlineObj.advanceshipmentnotice.roundOffAmount,
       roundOffValue: asnlineObj.advanceshipmentnotice.roundOffValue,
       serviceLocation:asnlineObj.advanceshipmentnotice.serviceLocation,
       serviceFromDate:asnlineObj.advanceshipmentnotice.serviceFromDate,
       serviceToDate:asnlineObj.advanceshipmentnotice.serviceToDate
    };
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

   isServicePO:isServicePO(po.pstyp)
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
           documentType: ""
        }
     }

}

  async componentDidMount() {
    // commonSubmitWithParam(this.props, "getStatusDisplay", "/rest/getASNStatusList");
    // await delay(2000);
    this.changeLoaderState(true) 
    commonSubmitWithParam(this.props, "getSSNApproverPendingList", "/rest/getApprovalPendingServiceSheet");
    this.changeLoaderState(false)
   // commonSubmitWithParam(this.props, "getStatusDisplay", "/rest/getASNStatusList");
  
   
 }

 
 



 componentWillReceiveProps= props=>{

  if(!isEmpty(props.role)){
      
    this.setState({
      role : props.role
    });
  }

    if (!isEmpty(props.serviceLineList)) {
        
        this.setState({
          serviceLineList: props.serviceLineList
        })
      } 


      if (!isEmpty(props.ApprovalPendingServiceSheetLIst)) {
      
        this.setState({
            ApprovalPendingServiceSheetLIst: props.ApprovalPendingServiceSheetLIst
        })
        
      }

      if (!isEmpty(props.asnLineList)) {
       
      //  const asnDetails=this.state.asnDetails
        this.setState({
          asnLineList: props.asnLineList,
          asnDetails:this.getASNFromObj(props.asnLineList[0]),
          po:this.getPurchaseOrderFromObj(props.asnLineList[0].advanceshipmentnotice.po)
        })
      } 

      if(!isEmpty(props.user)){
        this.changeLoaderState(false);
        this.setState({
          user : props.user
        });
      }


      if(!isEmpty(props.SSNVersion)){
      
        this.setState({
          SSNVersion : props.SSNVersion
        });
      }

      if (!isEmpty(props.costCenterList)) {
        this.changeLoaderState(false);
        let costArray = Object.keys(props.costCenterList).map((key) => {
          return { display: props.costCenterList[key], value: key }
        });
        this.setState({
          costCenterList: costArray
        })
      }

    
      if (!isEmpty(props.serviceSheetStatusList)) {
        this.setState({
          
           serviceSheetStatusList: props.serviceSheetStatusList
        })

     }

 
    
}
  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    var hidden = {
      display: this.state.hidden ? "none" : "block"
        }
    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        {<UserDashboardHeader />}
        <FormWithConstraints>
        <div className="w-100"   style={ hidden}>
        <div className="mt-70 boxContent">
        <div className="row px-4 py-2">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInputThree"
              className="form-control"
              onKeyUp={searchTableDataThree}
              placeholder="Search .."
            />
          </div>
          <div className="col-sm-12 mt-2">
         <div id="togglesidebar">
            <StickyHeader height={height_dy} className="table-responsive">
               <table className="table table-bordered table-header-fixed">
                  <thead>
                     <tr>
                        <th>Service Note No</th>
                        <th>PO No</th>
                        {/*<th>Invoice Date </th>*/}
                        <th>SSN Date</th>
                        <th>Vendor</th>
                        <th>Document No</th>
                        <th>Status </th>
                     </tr>
                  </thead>
                  <tbody id="DataTableBodyThree">
                  {this.state.ApprovalPendingServiceSheetLIst.map((sslist, index) => (
                          <tr onClick={(e) => { this.loadASNForEdit(sslist)}}>
                            <td>{sslist.serviceSheetNo}</td>
                            <td>{sslist.po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(sslist.created)}</td>
                            <td>{sslist.po.vendorName}</td>
                            <td>{sslist.invoiceNo != null ? sslist.invoiceNo : sslist.deliveryNoteNo}</td>
                            <td>{this.state.serviceSheetStatusList[sslist.status]}</td>
                            </tr>
                  ))}
                     
                       
                                    </tbody>
                                 </table>
                              </StickyHeader>
                           </div>
                        </div>
        </div>
        </div>

     
        </div>
        <div style={ shown }
      
            >

<AdvanceShipmentNotice newRole={this.state.role} po={this.state.po} serviceList={this.state.serviceLineList} serviceLineList={this.state.serviceLineList} changeLoaderState={this.changeLoaderState} costCenterList={this.state.costCenterList}  
             asnArray={this.state.asnDetails} asnDetailsSSN={this.state.asnDetails}  SSNVersion={this.state.SSNVersion} changeASNStatus={this.changeUpdateASNStatusFlag} updateASNStatus={this.state.updateASNStatus} asnLineList={this.state.asnLineList}
             user={this.state.user}/> 
            </div>
            
           
        </FormWithConstraints>
      </>
    );
  }

}

const mapStateToProps = (state) => {
    return state.ssnapproverlist;
 };
 
 export default connect(mapStateToProps, actionCreators)(SSNApproverPendingList);
