import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../PurchaseOrder/Action";
import PRCreationCont from "./PRCreation/PRCreationCont";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";
import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import FormNo from "../FormNo/FormNo/FormNo"
import GateEntryforCommercial from "../GateEntryforCommercial/GateEntryforCommercial/GateEntryforCommercial";
import ASNWithoutPO from "../ASNWithoutPO/ASNWithoutPO";
import PRBody from "../PRScreen/PRBody/PRBody";
class PRCreationRightPane extends Component {

  constructor (props) {
    super(props)    
    this.state={
      prMainContainer:true,
      prDetailsContainer:false,
      priorityList:[],
      prStatusList:[],
      partner:[],
      buyerList:[],
      technicalList:[],
      //prList:[],
      loadPRLineList:false,
      
    //  ssnFundList:[]
    };
}

componentDidMount(){
    // alert(this.props.purchaseOrder);
}

componentWillReceiveProps(props){

  if(this.state.loadPRLineList && !isEmpty(props.prLineList)){
    this.props.changeLoaderState(false);
    this.setPrLine(props);
  }else{
    this.props.changeLoaderState(false);
  }
  
  if(!isEmpty(props.role)){
    this.setState({
      role: props.role
    });
  }

      // if(!isEmpty(props.prList))
      // {
      //    this.setState({prList: props.prList})
      // } 
 

}



handleFilterChange = (key,value) => {
  this.props.onFilterChange && this.props.onFilterChange(key,value);
  
}

handleFilterClick = (type) => {
  this.props.onFilter && this.props.onFilter(type);
}

loadPRDetails=(index)=> {
  let pr=this.props.prList[index];
  //this.resetCurrentPr();
  this.props.changeLoaderState(true)
  this.setState({
    prMainContainer: false,
    prDetailsContainer: true,
    // prEnquiry: false,
    // prVendorSelection: false,
    // prQuotationByVendor: false,
     loadPRLineList:true,
    // loadOtherDocuments:true,
     prDetails:pr,
    // loadEmailList:true
  });
  commonSubmitWithParam(this.props,"getPRLines","/rest/getPRLinebyPrId",pr.prId);
}

render() {
    return (
      <>
          <div className="w-100">
        
        <div className="col-sm-12" id="togglesidebar">
            <div>              
              <PRCreationCont filter={this.props.filter} onFilterChange={this.handleFilterChange} onFilter={this.handleFilterClick} prList={this.props.prListcreation}  loadPRDetails={(i) => this.loadPRDetails(i)} 
              user={this.props.user} 
              changeLoaderState={this.props.changeLoaderState} role={this.state.role}
              /> 
            </div> 
             {/* <div>
            <PRBody
             loadPrDetails={true}
             prDetailsContainer={true}
             prList={this.props.prListcreation} 
             prStatusList={this.state.prStatusList}
             role={this.state.role}
             partner={this.state.partner}
             priorityList={this.state.priorityList}
             buyerList={this.state.buyerList}
             technicalApproverList={this.state.technicalList}
             readonly={this.state.readonly}
             changeLoaderState={this.props.changeLoaderState}
             filter={this.state.filter} onFilterChange={this.onFilterChange} onFilter={this.onFilter} 
             filterBuyerList={this.state.filterBuyerList}
             filterPlantList={this.state.filterPlantList}
             filterPRStatusList={this.state.filterPRStatusList}
             />
            </div> */}

         </div>
      </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.createNewPR;
};
export default connect (mapStateToProps,actionCreators)(PRCreationRightPane);
