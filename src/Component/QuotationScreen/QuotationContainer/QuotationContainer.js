import React, { Component } from "react";
import {isEmpty, isEmptyDeep} from "../../../Util/validationUtil";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam } from "../../../Util/ActionUtil";
import UserDashboardHeader from "../../Header/UserDashboardHeader";
import VendorDashboardHeader from "../../Header/VendorDashboardHeader";
import QuotationBody from "../QuotationBody/QuotationBody";
import { connect } from "react-redux";
import { getUserDto } from "../../../Util/CommonUtil";
import {formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import Loader from "../../FormElement/Loader/LoaderWithProps";
class QuotationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentTermsList:[],
      isLoading:false,
      prList: [],
      loadPRList:false,
      loadPRStatus:false,
      prStatusList:[],
      readonly:"readonly",
      role:"",
      loadRole: false
    };
  }

  componentDidMount(){
    this.setState({
      loadPRList:true,
      loadRole:true
    })
    commonSubmitWithParam(this.props, "getVendorQuotation", "/rest/getVendorQuotation"); 
    this.changeLoaderState(true);
  }

  componentWillReceiveProps(props){
    if (this.state.loadPRList && !isEmpty(props.bidderList)) {
      this.changeLoaderState(false);
      this.setBidderList(props);
    }else{
      this.changeLoaderState(false);
    }

    if (this.state.loadPRList && (!isEmpty(props.negoPrList) || !isEmpty(props.enqList) )) {              //Only For The Case of Negotiator Login
      this.changeLoaderState(false);
      this.setNegoPrList(props);
    }else{
      this.changeLoaderState(false);
    }

    if(this.state.loadRole && !isEmpty(props.role)){
      this.setRole(props);
    }
  }

  changeLoaderState = (action) =>{
    this.setState({
      isLoading:action
    });
  }
  
  setBidderList = (props) => {
    let tempPrList = [];
    props.bidderList.map((bidder) => {
      tempPrList.push(this.getBidderFromObj(bidder));
    });
    this.setState({
      prList: tempPrList,
      loadPRList: false,
    })
  }

  setNegoPrList = (props) => {
    let tempPrList = [];
    if(!isEmptyDeep(props.negoPrList)){
      props.negoPrList.map((prList) => {
        tempPrList.push(this.getPRFromObj(prList));
      });
    }
    if(!isEmptyDeep(props.enqList)){
      props.enqList.map((prList) => {
        tempPrList.push(this.getNgoPRFromObj(prList));
      });
    }
    this.setState({
      prList: tempPrList,
      loadPRList: false,
    })
  }

  setPRStatus = (props) => {
    this.setState({
      prStatusList: props.prStatusList,
      loadPRStatus: false,
    })
  }

  getBidderFromObj = (bidder) => {
    let pr = bidder.pr ? bidder.pr:null
    let prDto = pr ? this.getPRFromObj(pr):{     
      requestedBy: getUserDto(pr),
      tcApprover: getUserDto(pr),
      buyer: getUserDto(pr),
      approvedBy: getUserDto(pr),
      createdBy: getUserDto(pr)
    }
    if(bidder.enquiry){
      prDto = {...prDto,bidEndDate:formatDateWithoutTimeNewDate2(bidder.enquiry.bidEndDate),enquiryId: bidder.enquiry.enquiryId}
    }
    return {...prDto,...bidder}
  }

  getNgoPRFromObj = (pr) => {
    return {
      ...pr,
      enquiryId: pr.enquiryId,
      code: pr.code,
      created: formatDateWithoutTimeNewDate2(pr.created)
    }
  }

  getPRFromObj = (pr) => {
    return {
      prId: pr.prId,
      prNumber: pr.prNumber,
      status: pr.status,
      docType: pr.docType,
      isTC: pr.isTC === "Y",
      priority: pr.priority,
      requestedBy: getUserDto(pr.requestedBy),
      tcApprover: getUserDto(pr.tcApprover),
      buyer: getUserDto(pr.buyer),
      approvedBy: getUserDto(pr.approvedBy),
      createdBy: getUserDto(pr.createdBy),
      date: formatDateWithoutTimeNewDate2(pr.date),
      approver: this.setApprover(pr)
    }
  }
  setApprover = pr => {
    if (!isEmpty(pr.requestedBy) && !isEmpty(pr.requestedBy.approver)) {
      return getUserDto(pr.requestedBy.approver)
    } else {
      return getUserDto(null);
    }
  }

  setRole=(props)=>{
    this.setState({
      role:props.role,
      loadRole: false
    })
  }
  
  render() {
    return (
      <>
      {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>}
      <Loader isLoading={this.state.isLoading} />
        <QuotationBody 
          prList={this.state.prList}
          prStatusList={this.state.prStatusList}
          paymentTermsList={this.state.paymentTermsList}
          // role={this.state.role}
          // partner={this.state.partner}
          // priorityList={this.state.priorityList}
          // buyerList={this.state.buyerList}
          // technicalApproverList={this.state.technicalList}
          changeLoaderState={this.changeLoaderState}
          readonly={this.state.readonly}
          role={this.state.role}
        />
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.qbvReducer;
};
export default connect(mapStateToProps,actionCreators)(QuotationContainer);