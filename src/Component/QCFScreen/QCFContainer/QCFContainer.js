import React, { Component } from "react";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import UserDashboardHeader from "../../Header/UserDashboardHeader";
import VendorDashboardHeader from "../../Header/VendorDashboardHeader";
import QCFBody from "../QCFBody/QCFBody";
import {
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import { getUserDto } from "../../../Util/CommonUtil";
import {formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import {isEmpty, isEmptyDeep} from "../../../Util/validationUtil";
import Loader from "../../FormElement/Loader/LoaderWithProps";
class QCFContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      loadPRList:false,
      // loadPRStatus:false,
      loadProposedReason:false,
      prList:[],
      // prStatusList:[]
      QCFApproverList:[],
      role:""
    };
  }

  async componentDidMount(){
    this.setState({
      loadPRList:true,
      // loadPRStatus:true
    })
    
  this.changeLoaderState(true);
    commonSubmitWithParam(this.props,"getQcfPR","/rest/getQcfPR");
    commonSubmitWithParam(this.props, "getQCFApproverListFromSAP", "/rest/getQCFApproverListFromSAP");
  }

  async componentWillReceiveProps(props){

    if(this.state.loadPRList && !isEmpty(props.prList)){
      this.changeLoaderState(false);  
      this.setPRList(props);
    }

    if(this.state.loadPRList && !isEmptyDeep(props.enquiryList)){
      this.changeLoaderState(false);  
      this.setPRList(props);
    }

    if(!isEmptyDeep(props.role)){
      this.changeLoaderState(false);  
      this.setState({
        role:props.role
      });
    }

    // if(this.state.loadProposedReason && !isEmpty(props.proposedReasonList)){
    //   this.setProposedReason(props);
    // }
    
  }
  changeLoaderState = (action) =>{
    this.setState({
      isLoading:action
    });
  }
  // setPRList=(props)=>{
  //   let tempPrList = [];
  //   if(!isEmptyDeep(props.enquiryList)){
  //     props.enquiryList.map((pr)=>{
  //       if(pr){
  //         tempPrList.push(this.getPRFromObj(pr));
  //       }
  //     });
  //   }else{    
  //     props.prList.map((pr)=>{
  //       if(pr){
  //         tempPrList.push(this.getPRFromObj(pr));
  //       }
  //     });
  //   }
  //     this.setState({
  //       prList:tempPrList,
  //       loadPRList:false,
  //     })
  // }


  setPRList=(props)=>{
    let tempPrList = [];
    if(!isEmptyDeep(props.enquiryList)){

      const distinctEnquiries = props.enquiryList.filter((item, index, self) =>
      index === self.findIndex(t => t[0] === item[0])
    );
      props.role==="BUADM"?
      distinctEnquiries.map((pr)=>{
        if(pr){     
          tempPrList.push(this.getPRFromObjforBuyer(pr,props.role));
        }
      }):
      props.enquiryList.map((pr)=>{
        if(pr){         
          tempPrList.push(this.getPRFromObj(pr));
        }
      });
    }else{    
      props.prList.map((pr)=>{
        if(pr){
          tempPrList.push(this.getPRFromObj(pr));
        }
      });
    }
      this.setState({
        prList:tempPrList,
        loadPRList:false,
      })
  }

  getPRFromObj=(pr)=>{
    return {
      prId : pr.prId,
      prNumber: pr.prNumber,
      status:pr.status,
      docType: pr.docType,
      isTC:pr.isTC==="Y",
      priority:pr.priority,
      requestedBy: getUserDto(pr.requestedBy),
      tcApprover: getUserDto(pr.tcApprover),
      buyer: getUserDto(pr.buyer),
      approvedBy: getUserDto(pr.approvedBy),
      createdBy: pr.createdBy,
      date:formatDateWithoutTimeNewDate2(pr.date),
      approver: this.setApprover(pr),
      qcfNo:pr.qcfNo,
      bidEndDate: formatDateWithoutTimeNewDate2(pr.bidEndDate),
      enquiryId: pr.enquiryId,
      enquiryStatus:pr.firstLevelApprovalStatus,
      code: pr.code,
      rfqNo: pr.enqNo,
    }
  }

  getPRFromObjforBuyer=(pr,role)=>{
    return {
      prId : pr.prId,
      prNumber: pr[1],
      status:pr.status,
      docType: pr.docType,
      isTC:pr.isTC==="Y",
      priority:pr.priority,
      requestedBy: getUserDto(pr.requestedBy),
      tcApprover: getUserDto(pr.tcApprover),
      buyer: getUserDto(pr.buyer),
      approvedBy: getUserDto(pr.approvedBy),
      // createdBy: pr.createdBy,
      createdByuserName:pr[4],
      createdByName:pr[5],
      date:formatDateWithoutTimeNewDate2(pr.date),
      approver: this.setApprover(pr),
      qcfNo:pr[2],
      bidEndDate: formatDateWithoutTimeNewDate2(pr[3]),
      enquiryId: pr[0],
      enquiryStatus:pr.firstLevelApprovalStatus,
      code: pr[6],
      rfqNo: pr.enqNo,
      role:role
    }
  }

  // setPRStatus=(props)=>{
  //   this.setState({
  //     prStatusList:props.prStatusList,
  //     loadPRStatus:false,
  //   }) 
  // }

  // setProposedReason=(props)=>{
  //   this.setState({
  //     proposedReasonList:props.proposedReasonList,
  //     loadProposedReason:false,
  //   }) 
  // }
  
  setApprover=pr=>{
    if(!isEmpty(pr.requestedBy) && !isEmpty(pr.requestedBy.approver)){
      return getUserDto(pr.requestedBy.approver)
    }else{
      return getUserDto(null);
    }
  }

  render() {
    return (
      <>
        <UserDashboardHeader />
      <Loader isLoading={this.state.isLoading} />
        <QCFBody
          changeLoaderState={this.changeLoaderState}
          prList={this.state.prList}
          prStatusList={this.props.prStatusList}
          optionProposedReasonList={this.props.optionProposedReasonList}
          loadApproverList={this.props.QCFApproverList}
          newrole={this.props.role}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.qcfReducer;
};
export default connect(mapStateToProps, actionCreators)(QCFContainer);