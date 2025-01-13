import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../PurchaseOrder/Action";
import CreateASNGateEntryCont from "./createASNGateEntry/CreateASNGateEntryCont";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";
import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import FormNo from "../FormNo/FormNo/FormNo"
import GateEntryforCommercial from "../GateEntryforCommercial/GateEntryforCommercial/GateEntryforCommercial";
class CreateASNGateEntryRightPane extends Component {

  constructor (props) {
    super(props)    
    this.state={
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
        isServicePO:false,
        outboundDeliveryNo:"",
        doctyp:"",
        prDate: "",
        userID:""
      },
      poLineList :[],
      showPO : true,
      showCreateASN : false,
      showASNHistory : false,
      
      asnList : [],
      updateASNStatus : false,
      showASNDetails : false,
      role:"",
      poStatus:"",
      serviceList : [],
      costCenterList:[],
    //ssnFundList:[]
    };
}

componentDidMount(){
    // alert(this.props.purchaseOrder);
}

componentWillReceiveProps(props){
  
  if(!isEmpty(props.role)){
    this.setState({
      role: props.role
    });
  }
  if(!isEmpty(props.poStatus)){
    this.setState({
      poStatus: props.poStatus
    });
  }
  
  if(!isEmpty(props.asnList))
      {
         this.setState({asnList: props.asnList})
      } 
 

}


postPODetailsToASN = (po,poLineList,serviceList,costCenterList) =>{
  this.setState({
    po : po,
    poLineList : poLineList,
    serviceList : serviceList,
    costCenterList,
   // ssnFundList
  });
  this.showCreateASN();
}

goASNHistory = (costCenterList) => this.setState({costCenterList})

postASNListDetails = (asnList,po) =>{
  
  this.setState({
    po : po,
    asnList : asnList
  });
  this.showASNHistory();
}

showPO = () =>{
  
  this.setState({
    showPO : true,
    showCreateASN : false,
    showASNHistory : false,
    showASNDetails: false
  });
}

showCreateASN = () =>{
  
  this.setState({
    showPO : false,
    showCreateASN : true,
    showASNHistory : false,
    showASNDetails: false
  });
}

showASNHistory = () =>{
  
  this.setState({
    showPO : false,
    showCreateASN : false,
    showASNHistory : true,
    showASNDetails: false
  });
  commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",this.state.po.poId);
 // this.props.changeLoaderState(true);
}

showHistoryFalse=()=>{
  this.setState({
    showPO : false,
    showCreateASN : true,
    showASNHistory : false,
    showASNDetails: true
  });
}

showGateEntryButtons=(val)=>{
  this.setState({
    showGateEntryButtons : val
  });
}

changeUpdateASNStatusFlag=(flag)=>{
  this.setState({updateASNStatus : flag})
}

handleFilterChange = (key,value) => {
  this.props.onFilterChange && this.props.onFilterChange(key,value);
  
}

handleFilterClick = (type) => {
  this.props.onFilter && this.props.onFilter(type);
}

render() {
    return (
      <>
          <div className="w-100">
          {/* <div className="details-conatint">                  
                Purchase Order Details
            </div>
            <div className="form-group right-side-label">
            <label className="col-6">Vendor Name : {this.props.purchaseOrder.vendorName}</label>
            <label className="col-6">PO No : {this.props.purchaseOrder.purchaseOrderNumber}</label>
            <label className="col-6">Vendor Code : {this.props.purchaseOrder.vendorCode}</label>
            <label className="col-6">Status : {this.props.purchaseOrder.status}</label>
        </div> */}
        <div className="col-sm-12" id="togglesidebar">
            <div className={this.state.showPO?"block":"none"}>              
              <CreateASNGateEntryCont filter={this.props.filter} onFilterChange={this.handleFilterChange} onFilter={this.handleFilterClick}  poList={this.props.poList} user={this.props.user} 
                updatePO={this.props.updatePO} changeLoaderState={this.props.changeLoaderState} createASN={this.postPODetailsToASN} createSTOASN={this.postSTOPODetailsToASN} goASNHistory={this.goASNHistory} role={this.state.role}
               showASNHistory = {this.postASNListDetails}  newPoStatus={this.state.poStatus}/> 
            </div> 

            {/* <div className={((this.state.showCreateASN) || (this.state.showASNHistory))?"block mt-100":"none"}>
            <AdvanceShipmentNotice newRole={this.state.role} po={this.state.po} costCenterList={this.state.costCenterList} poLineArray={this.state.poLineList} serviceList={this.state.serviceList}
               asnArray={this.state.asnList} showHistory={this.state.showASNHistory}
                showGateEntry={this.showGateEntryButtons} changeLoaderState={this.props.changeLoaderState} showHistoryFalse={this.showHistoryFalse}
               changeASNStatus={this.changeUpdateASNStatusFlag} updateASNStatus={this.state.updateASNStatus}
               backAction={this.state.showASNDetails?this.showASNHistory:this.showPO}
               user={this.props.user} createASNFlag={this.state.showCreateASN} />
            </div> */}
            {/* <div className={this.state.showASNHistory?"block":"none"}>
              <AdvanceShipmentNotice asnArray={this.state.asnList} />
            </div> */}
             <div className={((this.state.showCreateASN) || (this.state.showASNHistory))?"block mt-100":"none"}>
              <FormNo newRole={this.state.role} po={this.state.po} costCenterList={this.state.costCenterList} ssnFundList={this.state.ssnFundList} poLineArray={this.state.poLineList} serviceList={this.state.serviceList}
               asnArray={this.state.asnList} showHistory={this.state.showASNHistory}
                showGateEntry={this.showGateEntryButtons} changeLoaderState={this.props.changeLoaderState} showHistoryFalse={this.showHistoryFalse}
               changeASNStatus={this.changeUpdateASNStatusFlag} updateASNStatus={this.state.updateASNStatus}
               backAction={this.state.showASNDetails?this.showASNHistory:this.showPO}
               user={this.props.user} createASNFlag={this.state.showCreateASN} />
            </div> 
            <div className="none">
              <GateEntryforCommercial newRole={this.state.role} po={this.state.po} costCenterList={this.state.costCenterList} poLineArray={this.state.poLineList} serviceList={this.state.serviceList}
               asnArray={this.state.asnList} showHistory={this.state.showASNHistory}
                showGateEntry={this.showGateEntryButtons} changeLoaderState={this.props.changeLoaderState} showHistoryFalse={this.showHistoryFalse}
               changeASNStatus={this.changeUpdateASNStatusFlag} updateASNStatus={this.state.updateASNStatus}
               backAction={this.state.showASNDetails?this.showASNHistory:this.showPO}
               user={this.props.user} createASNFlag={this.state.showCreateASN} />
            </div> 
         </div>
      </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.createNewGateEntry;
};
export default connect (mapStateToProps,actionCreators)(CreateASNGateEntryRightPane);
