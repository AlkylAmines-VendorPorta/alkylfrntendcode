import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./Action";
//import PurchaseOrderLeftPane from "./PurchaseOrderLeftPane";
 import PRCreationRightPane from "./PRCreationRightPane";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil";
import {formatDateWithoutTime, formatDateWithoutTimeWithMonthName,formatDateToISOS} from "../../Util/DateUtil";
import { removeLeedingZeros } from "../../Util/CommonUtil";
import { isServicePO } from "../../Util/AlkylUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { getUserDto } from "../../Util/CommonUtil";
import { ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN } from "../../Constants/UrlConstants";
let url = "/rest/getPurchaseOrderAndPartner";;
class PRCreation extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      isLoading:false,
     
      prList:[],
      loadPRList:false,
      filter:{}
    };
}

changeLoaderState = (action) =>{
  this.setState({
    isLoading:action
  });
}

componentDidMount(){
  // this.fetchedData()
  commonSubmitWithParam(this.props,"getPR","/rest/getPR"); 
}



setPRList=(props)=>{
  let tempPrList = [];
    props.prList.map((pr)=>{
      tempPrList.push(this.getPRFromObj(pr,props));
    });
    this.setState({
      prList:tempPrList,
      // loadPRList:false,
    })
}

getPRFromObj=(pr,props)=>{ 
  let isPurchaseManager =  [ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN].includes(props.role);
  let obj = {}
  
  if(isPurchaseManager){ 
    obj = this.getPrLineObj(pr)
  }else{
    
    obj = this.getObject(pr)
  }
  return obj;
}

getObject(pr){
  return {
    prId : pr.prId,
    prNumber: pr.prNumber,
    bidEndDate: pr.bidEndDate,
    status: pr.status,
    docType: pr.docType,
    isTC:pr.isTC==="Y",
    priority:pr.priority,
    requestedBy: getUserDto(pr.requestedBy),
    tcApprover: getUserDto(pr.tcApprover),
    buyer: getUserDto(pr.buyer),
    approvedBy: getUserDto(pr.approvedBy),
    createdBy: getUserDto(pr.createdBy),
    date:formatDateWithoutTimeWithMonthName(pr.date),
    approver: this.setApprover(pr),
    pstyp:pr.pstyp,
    remarks: pr.remarks || '',
    bidEndDate:formatDateToISOS(pr.bidEndDate)
  }
}

getPrLineObj(prLineObj){
  return {
    prLineId : prLineObj.prLineId,
    deliverDate: prLineObj.deliverDate ? formatDateWithoutTime(prLineObj.deliverDate):null,
    requiredDate: prLineObj.requiredDate ? formatDateWithoutTime(prLineObj.requiredDate):null,
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
    i:prLineObj.i,
    materialDesc:prLineObj.materialDesc,
    materialCode: prLineObj.materialCode,
    isChecked:"",
    uom:prLineObj.uom,
    price:prLineObj.price,
    index:"",
    buyer: prLineObj.buyer ? prLineObj.buyer:{},
    desiredVendor: prLineObj.desiredVendor ? prLineObj.desiredVendor:{},
    prLineNumber: prLineObj.prLineNumber,
    prNumber: prLineObj.pr.prNumber,
    status: prLineObj.pr.status,
    pr:prLineObj.pr,
    prId:prLineObj.pr.prId,
    matGrp:prLineObj.matGrp,
    matGrpDesc:prLineObj.matGrpDesc,
    headerText:prLineObj.headerText,
    desireVendorCode:prLineObj.desireVendorCode
  }
}

componentWillReceiveProps(props){


  if(!isEmpty(props.prList)){
    this.setState({
      prList:props.prList
    })
    
    // this.changeLoaderState(false);
    // this.setPRList(props);
  }else{
    this.changeLoaderState(false);
  }





  if(this.state.loadPartner && !isEmpty(props.partner)){
    this.changeLoaderState(false);
    this.setState({
      loadPartner:false,
      partner : props.partner
    });
  }else{
    this.changeLoaderState(false);
  }

  if(this.state.loadUser && !isEmpty(props.user)){
    this.changeLoaderState(false);
    this.setState({
      loadUser: false,
      user : props.user
    });
  }else{
    this.changeLoaderState(false);
  }

  if(this.state.loadRole && !isEmpty(props.role)){
    this.changeLoaderState(false);
    this.setState({
      loadRole:false,
      role : props.role
    });
  }else{
    this.changeLoaderState(false);
  }

}

onFilterChange = (key,value) => {
  this.setState(prevState => ({filter:{...prevState.filter,[key]:value}}));
}

onFilter = () => {
  const {filter} = this.state;
  let params = {}
  let arr = ['prNoFrom'];
  !isEmpty(arr) && arr.map((item) => {
    if(!isEmpty(filter[item])) params = {...params,[item]: filter[item]}
    return item;
  });
  //console.log(params.poNoFrom);
  this.onFetch(params)
  
}

onFetch = (params) => {
  this.setState({
    loadPRList: true,
    loadRole: true,
    loadPartner: true,
    loadUser : true,
   // prList:this.state.prList
  });

  {this.props.role==="PMADM"?
  
  commonSubmitWithObjectParams(this.props,"getPR",'/rest/getPRLineByFilter',params)
:
  commonSubmitWithObjectParams(this.props,"getPR",'/rest/getPRByFilter',params);
}
  this.changeLoaderState(true);
}



render() {
    return (
      <>
      <Loader isLoading={this.state.isLoading} />
      {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>}
      
          <PRCreationRightPane filter={this.state.filter} onFilterChange={this.onFilterChange} onFilter={this.onFilter} 
          prListcreation={this.state.prList}
          changeLoaderState={this.changeLoaderState} 
          role={this.state.role} 
          user={this.state.user}/>
      
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.createNewPR;
};
export default connect (mapStateToProps,actionCreators)(PRCreation);