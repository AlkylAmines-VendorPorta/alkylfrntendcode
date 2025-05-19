import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../PurchaseOrder/Action";
import SapsalesOrder from "./sapsalesOrder/sapsalesOrder";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";

import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import VehicleRegistration from "../VehicleRegistration/VehicleRegistration"
class SapsalesOrderRightPane extends Component {
   
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
        isServicePO:false,
        isSapsalesOrder:true

      },
      poLineList :[],
      showPO : true,
      showCreateASN : false,
      showASNHistory : false,
      asnList : [],
      updateASNStatus : false,
      showASNDetails : false,
      role: "",
      poStatus:"",
      serviceList : [],
      costCenterList:[]
    };
}

componentDidMount(){
    // alert(this.props.purchaseOrder);
}

componentWillReceiveProps(props){
  // console.log("props",props)
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
}


postPODetailsToASN = (po,poLineList,serviceList,costCenterList) =>{
  this.setState({
    po : po,
    poLineList : poLineList,
    serviceList : serviceList,
    costCenterList
  });
  this.showCreateASN();
}

postPODetailsTovehicle = (po) =>{
  this.setState({
    po : po
    // poLineList : poLineList,
    // serviceList : serviceList,
    // costCenterList
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
          
        <div className="col-sm-12">
            <div className={this.state.showPO?"block":"none"}>              
              <SapsalesOrder filter={this.props.filter} onFilterChange={this.handleFilterChange} onFilter={this.handleFilterClick}  SapSalesOrderStatusList={this.props.poList} user={this.props.user} 
                updatePO={this.props.updatePO} changeLoaderState={this.props.changeLoaderState} createASN={this.postPODetailsToASN} goASNHistory={this.goASNHistory} role={this.state.role}
               showASNHistory = {this.postASNListDetails}  newPoStatus={this.state.poStatus} 
               SapSalesOrderList={this.postPODetailsTovehicle} onClearFilter={this.props.onClearFilter}/> 
            </div> 

            <div className={((this.state.showCreateASN) || (this.state.showASNHistory))?"block mt-100":"none"}>
            <VehicleRegistration SapSalesOrderList={this.postPODetailsTovehicle} po={this.state.po}/>
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
         </div>
      </div>
      </>
    );
  }
}

export default SapsalesOrderRightPane;