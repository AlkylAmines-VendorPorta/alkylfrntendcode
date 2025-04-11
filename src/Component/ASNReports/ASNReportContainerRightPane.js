import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../AdvanceShipmentNotice/Action";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";

import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import ASNReports from "./ASNReports";
class ASNReportContainerRightPane extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      po:"",
      poLineList :[],
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
      role:""
    }
}
componentDidMount(){
    // alert(this.props.purchaseOrder);
    this.props.changeLoaderState(true);
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

render() {
  
    return (
      <>
             <ASNReports/>
      </>
    );
  }
}

export default ASNReportContainerRightPane;