import React, { Component } from "react";
import {isEmpty, isEmptyDeep} from "../../Util/validationUtil";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams,commonSubmitWithObjectParams2 } from "../../Util/ActionUtil";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import PRBody from "./PRBody/PRBody";
import { connect } from "react-redux";
import { getUserDto } from "../../Util/CommonUtil";
import {formatDateWithoutTimeNewDate2,formatDateToISOS,formatDateWithoutTime} from "../../Util/DateUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import {groupBy} from 'lodash-es';
import { ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN } from "../../Constants/UrlConstants";
import MaterialTable from "./MaterialTable/MaterialTable";
import LoaderWithProps from "../FormElement/Loader/LoaderWithProps";

class PRContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      loadPRList:false,
      loadPRStatus:false,
      loadRole: false,
      loadPartner: false,
      loadProirityList:false,
      loadBuyerList:false,
      loadTechnicalList:false,
      prList:[],
      prStatusList:[],
      role:"",
      partner:[],
      buyerList:[],
      technicalList:[],
      priorityList:[],
      readonly:"readonly",
      filter: {
        prDateFrom: '',
        prDateTo: '',
        prNoFrom: '',
        prNoTo: '',
        status: '',
        buyerCode: '',
        plant: '',
        multiplePurchaseGroup: '',
        multiplePlantList:'',
        purchaseGroupTo: ''
      },
      filterBuyerList:[],
      filterPlantList:[],
      filterPRStatusList:[],
      filterPurhaseGroupList:[],
      newLoader:false
     
    };
  }

  componentDidMount(){
    this.setState({
      loadPRList:true,
      loadPRStatus:true,
      loadRole: true,
      loadPartner: true,
      loadProirityList:true,
      loadBuyerList:true,
      loadTechnicalList:true,
    })
    commonSubmitWithParam(this.props,"getPR","/rest/getPR"); 
    commonSubmitWithParam(this.props,"getFilterData","/rest/getPRStatus");
    this.changeLoaderState(true);
  }

  componentWillReceiveProps(props){
    if(this.state.loadPRList && !isEmpty(props.prList)){
      this.changeLoaderState(false);
      this.setPRList(props);
      this.setState({isLoading:false})
    }else{
      this.changeLoaderState(false);
      this.setState({isLoading:false})
    }

    if(this.state.loadPRStatus && !isEmpty(props.prStatusList)){
      this.changeLoaderState(false);
      this.setPRStatus(props);
    }else{
      this.changeLoaderState(false);
    }

    if(this.state.loadRole && !isEmpty(props.role)){
      this.changeLoaderState(false);
      this.setRole(props);
    }else{
      this.changeLoaderState(false);
    }

    if(this.state.loadPartner && !isEmpty(props.partner)){
      this.changeLoaderState(false);
      this.setPartner(props);
    }else{
      this.changeLoaderState(false);
    }
    
    if(this.state.loadProirityList && !isEmpty(props.priorityList)){
      this.changeLoaderState(false);
      this.setPriorityList(props);
    }else{
      this.changeLoaderState(false);
    }
    
    if(this.state.loadTechnicalList && !isEmpty(props.technicalList)){
      this.changeLoaderState(false);
      this.setTechnicalList(props);
    }else{
      this.changeLoaderState(false);
    }
    
    if(this.state.loadBuyerList && !isEmpty(props.buyerList)){
      this.changeLoaderState(false);
      this.setBuyerList(props);
    }else{
      this.changeLoaderState(false);
    }

    if(!isEmpty(props.readonly)){
      this.disabledReadOnly();
    }


    if(!isEmptyDeep(props.filterObject)){
      
      let filterBuyerList = !isEmptyDeep(props.filterObject.buyerList)  ? Object.keys(props.filterObject.buyerList).map((key) => {
        return { display: `${props.filterObject.buyerList[key].userId}-${props.filterObject.buyerList[key].name}`, value: props.filterObject.buyerList[key].userName }
      }):[];
      let filterPlantList = !isEmptyDeep(props.filterObject.plantList) ? Object.keys(props.filterObject.plantList).map((key) => {
        return { display: props.filterObject.plantList[key], value: key }
      }):[];
      let filterPRStatusList = !isEmptyDeep(props.filterObject.prStatusList) ? Object.keys(props.filterObject.prStatusList).map((key) => {
        return { display: props.filterObject.prStatusList[key], value: key }
      }):[];
      let filterPurhaseGroupList=!isEmptyDeep(props.filterObject.purchaseGroupList) ? Object.keys(props.filterObject.purchaseGroupList).map((key) => {
        return { display: props.filterObject.purchaseGroupList[key], value: key }
      }):[];
      this.setState({filterBuyerList,filterPlantList,filterPRStatusList,filterPurhaseGroupList})
    }
    
  }
  
  changeLoaderState = (action) =>{
    this.setState({
      //isLoading:action
    });
  }
  setPRList=(props)=>{
    let tempPrList = [];
      props.prList.map((pr)=>{
        tempPrList.push(this.getPRFromObj(pr,props));
      });
      this.setState({
        prList:tempPrList,
        loadPRList:false,
      })
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
      date:formatDateWithoutTimeNewDate2(pr.date),
      approver: this.setApprover(pr),
      pstyp:pr.pstyp,
      remarks: pr.remarks || '',
      bidEndDate:formatDateToISOS(pr.bidEndDate),
      releasedBy:getUserDto(pr.releasedBy),
      approvedDate:pr.approvedDate,
      releasedDate:pr.releasedDate,
      pmapprovedDate:pr.pmapprovedDate,
      pmapprovedBy:getUserDto(pr.pmapprovedBy)
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
      desireVendorCode:prLineObj.desireVendorCode,
      plantDesc:prLineObj.plantDESC
    }
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

  setPRStatus=(props)=>{
    this.setState({
      prStatusList:props.prStatusList,
      loadPRStatus:false,
    }) 
  }

  setRole=(props)=>{
    this.setState({
      role:props.role,
      loadRole: false
    })
  }

  setPartner=(props)=>{
    this.setState({
      partner:props.partner,
      loadPartner: false
    })
  }

  setPriorityList=(props)=>{
    if (!isEmpty(props.priorityList)) {
      let priorityListArray = Object.keys(props.priorityList).map((key) => {
        return { display: props.priorityList[key], value: key }
      });
      this.setState({
        priorityList: priorityListArray,
        loadProirityList: false
      })
    }
  }
  
  setBuyerList=(props)=>{
    this.setState({
      buyerList:this.getBuyerFromObj(props.buyerList),
      loadBuyerList: false
    })
  }

  setTechnicalList=(props)=>{
    this.setState({
      technicalList:this.getBuyerFromObj(props.technicalList),
      loadTechnicalList: false
    })
  }

  getBuyerFromObj=buyerList=>{
    let tempBuyerList=[];
    buyerList.map((bl,i)=>{
      tempBuyerList.push(getUserDto(bl));
    })
    return tempBuyerList;
  }

  getTechnicalList=technicalList=>{
    let tempTechnicalList=[];
    technicalList.map((tl,i)=>{
      tempTechnicalList.push(getUserDto(tl));
    })
    return tempTechnicalList;
  }

  setApprover=pr=>{
    if(!isEmpty(pr.requestedBy) && !isEmpty(pr.requestedBy.approver)){
      return getUserDto(pr.requestedBy.approver)
    }else{
      return getUserDto(null);
    }
  }

  disabledReadOnly=()=>{
    this.setState({readonly:""})
  }

  onFilterChange = (key,value) => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        [key]: value
      }
    }));
  }
  
  onFilter = () => {   
    const { filter } = this.state;
    let params = {};
    let arr = ['prDateFrom','prDateTo','prNoFrom','prNoTo','status','buyerCode','plant','purchaseGroupFrom','purchaseGroupTo','multiplePurchaseGroup','multiplePlantList'];

    arr.forEach(item => {
      if (filter[item]) params[item] = filter[item];
    });
    

    this.onFetch(params); // API call or similar
  }
  clearFilter = () => {
    this.setState({
      filter: {
        prDateFrom: '',
        prDateTo: '',
        prNoFrom: '',
        prNoTo: '',
        status: '',
        buyerCode: '',
        plant: '',
        purchaseGroupFrom: '',
        purchaseGroupTo: '',
        multiplePurchaseGroup:'',
        multiplePlantList:''
      }
    });
  };
  onFetch = (params) => {
    this.setState({
      loadPRList: true,
      loadRole: true,
      loadPartner: true,
      loadUser : true,
      prList:[],
      isLoading:true,
      newLoader:true
    });

    {(this.props.role==="PMADM") || (this.props.role==="BUADM")?
    commonSubmitWithObjectParams(this.props,"getPR",'/rest/getPRLineByFilter',params)
  // commonSubmitWithObjectParams2(this.props,"getPR",'/rest/getPRLineByFilter',params,this)
    
:
  //commonSubmitWithObjectParams(this.props,"getPR",'/rest/getPRByFilter',params);
    commonSubmitWithObjectParams(this.props,"getPR",'/rest/getPRByFilter',params)
   // commonSubmitWithObjectParams2(this.props,"getPR",'/rest/getPRByFilter',params,this);
  }
  
  }

  render() {
    return (
      <>
        {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>}
        
      <LoaderWithProps isLoading={this.state.isLoading} />
        <PRBody 
          prList={this.state.prList} 
          prStatusList={this.state.prStatusList}
          role={this.state.role}
          partner={this.state.partner}
          priorityList={this.state.priorityList}
          buyerList={this.state.buyerList}
          technicalApproverList={this.state.technicalList}
          readonly={this.state.readonly}
          changeLoaderState={this.changeLoaderState}
          filter={this.state.filter} 
          onFilterChange={this.onFilterChange} 
          onFilter={this.onFilter} 
          filterBuyerList={this.state.filterBuyerList}
          filterPlantList={this.state.filterPlantList}
          filterPRStatusList={this.state.filterPRStatusList}
          filterPurhaseGroupList={this.state.filterPurhaseGroupList}
          onClearFilter={this.clearFilter}
        />
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.prReducer;
};
export default connect(mapStateToProps,actionCreators)(PRContainer);