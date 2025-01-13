import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../FormNo/Action";
import FormNo from "../FormNo/FormNo/FormNo";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";

import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
//import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import GateEntryforCommercial from "../GateEntryforCommercial/GateEntryforCommercial/GateEntryforCommercial";
import ASNWithoutPO from "./../ASNWithoutPO/ASNWithoutPO";
class GateEntryforCommercialRightPane extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      po:{        
         requestNo : "",
         custBlockStatus: "",
         plant: "",
         saleOrdNo: "",
         date: "",
         deliveryDate: "",
         soldToParty: "",
         soldToPartyName: "",
         material: "",
         qty: "",
         balanceDeliveryQty: "",
         basicRate: "",
         inwardTransporter: "",
         outwardTransporter: "",
         inco: "",
         inco1:"",
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
       showPO : true,
       showCreateASN : false,
       showASNHistory : true,
       showGateEntryButtons : false,
       asnList : [],
       unload: false,
       grn:false,
       qc:false,
       asn : {
         asnId : "",
         status  : "",
         grnNO : "",
         nameOfDriver : "",
         mobileNumber : "",
         photoIdProof : ""
       
       },
    
       updateASNStatus : false,
       showASNDetails : false,
       role:"",
       poStatus:"",
       serviceList : [],
       costCenterList:[],
       ASNWithoutPO:false
     }
}
componentDidMount(){
    // alert(this.props.purchaseOrder);
    this.props.changeLoaderState(true);
}

componentWillReceiveProps = (props) => {
  
      
  if (props.asnList === undefined) {
   
    this.setState({ ASNWithoutPO: true });
  }

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

changeUpdateASNStatusFlag=(flag)=>{
  this.setState({updateASNStatus : flag,unload:false,grn:false})
}

handleUnload=(data)=>{
  // 
  this.setState({unload:data});
  
}

handleQC=(data)=>{
  // 
  this.setState({qc:data});
}

handle105=(data)=>{
  this.setState({grn:data});
}

setRole = (role) => {
  this.setState({
    role : role
  });
}

showPO = () =>{
  
  this.setState({
    showPO : true,
    showCreateASN : false,
    showASNHistory : false,
    showASNDetails: false
  });
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
          <div className="mt-2 w-100">
          <div className="clearfix"></div>
          {/* <div className={this.state.showGateEntryButtons?"block":"none"}>
            <ButtonGroup handleUnloadFromParent={this.handleUnload} role={this.state.role} asn={this.state.asn}
            showGateEntry={this.showGateEntryButtons} changeLoaderState={this.props.changeLoaderState} handle105FromParent={this.handle105} handleQCFromParent={this.handleQC}
            changeASNStatus={this.changeUpdateASNStatusFlag} updateASNStatus={this.state.updateASNStatus}/>
          </div>  */}
          {/* <div className="details-conatint">                  
          Advance Shipment Notice Details
            </div>
            <div className="form-group right-side-label">
             <label className="col-6">Vendor Name : {this.props.purchaseOrder.vendorName}</label>
            <label className="col-6">PO No : {this.props.purchaseOrder.purchaseOrderNumber}</label>
            <label className="col-6">Vendor Code : {this.props.purchaseOrder.vendorCode}</label>
            <label className="col-6">Status : {this.props.purchaseOrder.status}</label> 
            </div> */}

          <div className="col-sm-12 mt-2">

            <GateEntryforCommercial filter={this.props.filter} onFilterChange={this.handleFilterChange} onFilter={this.handleFilterClick}  unload={this.state.unload} grn={this.state.grn} qc={this.state.qc} po={this.state.po} poLineArray={this.state.poLineList}
               asnArray={this.state.asnList} showHistory={this.state.showASNHistory} showHistoryFalse={this.showHistoryFalse}  handle105FromParent={this.handle105}
               showGateEntry={this.showGateEntryButtons} changeLoaderState={this.props.changeLoaderState} changeASNStatus={this.changeUpdateASNStatusFlag} 
               updateASNStatus={this.state.updateASNStatus} updateRole={this.setRole}/>

               
          </div>

          
      </div>
      </>
    );
  }
}

export default GateEntryforCommercialRightPane;