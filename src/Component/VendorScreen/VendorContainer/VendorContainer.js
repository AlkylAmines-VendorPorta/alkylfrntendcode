import React, { Component } from "react";
import {isEmpty} from "../../../Util/validationUtil";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam } from "../../../Util/ActionUtil";
import UserDashboardHeader from "../../Header/UserDashboardHeader";
import VendorDashboardHeader from "../../Header/VendorDashboardHeader";
import VendorBody from "../VendorBody/VendorBody";
import { connect } from "react-redux";
import { getUserDto } from "../../../Util/CommonUtil";
import {formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import Loader from "../../FormElement/Loader/LoaderWithProps";
class VendorContainer extends Component {
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
      readonly:"readonly"
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
      loadTechnicalList:true
    })
    commonSubmitWithParam(this.props,"getPRforEnquiry","/rest/getPRforEnquiry");
    
  this.changeLoaderState(true);
  }

  componentWillReceiveProps(props){
    if(this.state.loadPRList && !isEmpty(props.prList)){
      
      this.changeLoaderState(false);
      this.setPRList(props);
    }else{
      this.changeLoaderState(false);
    }

    if(this.state.loadPRStatus && !isEmpty(props.prStatusList)){
      this.setPRStatus(props);
    }
    
    if(this.state.loadRole && !isEmpty(props.role)){
      this.setRole(props);
    }

    if(this.state.loadPartner && !isEmpty(props.partner)){
      this.setPartner(props);
    }
    
    if(this.state.loadProirityList && !isEmpty(props.priorityList)){
      this.setPriorityList(props);
    }
    
    if(this.state.loadTechnicalList && !isEmpty(props.technicalList)){
      this.setTechnicalList(props);
    }
    
    if(this.state.loadBuyerList && !isEmpty(props.buyerList)){
      this.setBuyerList(props);
    }

    if(!isEmpty(props.readonly)){
      this.disabledReadOnly();
    }
    
  }
  changeLoaderState = (action) =>{
    this.setState({
      isLoading:action
    });
  }

  setPRList=(props)=>{
    let tempPrList = [];
      props.prList.map((pr)=>{
        tempPrList.push(this.getPRFromObj(pr));
      });
      this.setState({
        prList:tempPrList,
        loadPRList:false,
      })
  }
  getPRFromObj=(pr)=>{ 
    return {
      prId : pr.prId,
      prNumber: pr.prNumber,
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
      approver: this.setApprover(pr)
    }
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
    }
  }

  disabledReadOnly=()=>{
    this.setState({readonly:""})
  }

  render() {
    return (
      <>
      {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>}
      <Loader isLoading={this.state.isLoading} />
        <VendorBody 
          prList={this.state.prList}
          prStatusList={this.state.prStatusList}
          role={this.state.role}
          partner={this.state.partner}
          priorityList={this.state.priorityList}
          buyerList={this.state.buyerList}
          technicalApproverList={this.state.technicalList}
          readonly={this.state.readonly}
          changeLoaderState={this.changeLoaderState}
        />
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.vendorReducer;
};
export default connect(mapStateToProps,actionCreators)(VendorContainer);