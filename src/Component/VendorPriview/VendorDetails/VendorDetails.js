import StepZilla from "react-stepzilla";
import React, { Component } from "react";
import {connect} from 'react-redux';
import UserDashboardHeader from "../../Header/UserDashboardHeader";
import GeneralInformation from "../../Registration/GeneralInformation/GeneralInformation";
import BankDetails from "../../Registration/BankDetails/BankDetails";
import KycDetails from "../../Registration/KycDetails/KycDetails";
import CompanyDetails from "../../Registration/CompanyDetails/CompanyDetails";
import IMSDetails from "../../Registration/IMSDetails/IMSDetails";
import VendorApprovalMatrix from "../../VendorApproval/VendorApprovalMatrix/VendorApprovalMatrix";
import VendorList from "../../VendorApproval/VendorList/VendorList";
import { commonSubmitForm, commonHandleChange,commonSubmitWithParam} from "../../../Util/ActionUtil";

import * as actionCreators from "../../VendorApproval/Action";
import { isEmpty } from "lodash-es";
import VendorPriview from "../VendorPriview";
import Loader from "../../FormElement/Loader/LoaderWithProps";

class VendorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      step: 1,
      partner:{
        partnerId: "",
        userEmail: ""
      },
      partners:[{
        partnerId: "",
        userEmail: ""
      }],
      readonly:"",
      steps : [
        { name: "Vendor List", component : <VendorList partner={{partnerId:""}} />}
      ]
    }
    this.updatePartner = this.updatePartner.bind(this)
  };

  showVendorList = () =>{
    this.setState({
      steps : [
        { name: "Vendor List", component : <VendorList partner={{partnerId:""}} />}
      ]
    })
  }
  
  showManufacturerTabs=(partner)=>{
    this.setState({
      steps : [
        { name: "Vendor Detail Information", component: <VendorPriview displayDiv="none" 
          loadManuFacturerTab={true} showNonManufacturerTabs={this.showNonManufacturerTabs} 
          showManufacturerTabs={this.showManufacturerTabs} readonly="readonly" disabled="disabled" 
          partner={{partnerId:partner.bPartnerId,vendorSapCode:partner.vendorSapCode}}/> }
      ]
    });
  }

  showNonManufacturerTabs=(partner)=>{
    this.setState({
      steps : [
        { name: "Vendor Detail Information", component: <VendorPriview changeLoaderState={this.changeLoaderState} displayDiv="none" 
          loadManuFacturerTab={false} showNonManufacturerTabs={this.showNonManufacturerTabs} 
          showManufacturerTabs={this.showManufacturerTabs} readonly="readonly" disabled="disabled" 
          partner={{partnerId:partner.bPartnerId,vendorSapCode:partner.vendorSapCode}}/> }
      ]
    });
  }

  changeLoaderState = (action) => {
    this.setState({isLoading:action});
  }

  updatePartner(partner){
    
    let bPartnerId= partner.bPartnerId;       
        this.setState({          
          partner: {
            partnerId:bPartnerId
          }
        });
    let isManufacturer = partner.vendorType==="MANUFACTURER";
    if(isManufacturer){
      this.showManufacturerTabs(partner);
    }else{
      this.showNonManufacturerTabs(partner);
    }

  }

  async componentWillMount(){
    
  }

  componentDidMount(){
    
    commonSubmitWithParam(this.props,"populatePartnerInfo","/rest/getPartner",null);
    this.changeLoaderState(true);
  }

  componentWillReceiveProps(props){
    
    if(!isEmpty(props.partners)){
      this.changeLoaderState(false);
      if(!isEmpty(props.partners[0])){
        let bPartnerId= props.partners[0].bPartnerId;    
        if(this.state.partner.partnerId != '') return null;   
        this.setState({
          partners: props.partners,          
          partner: {
            partnerId:bPartnerId
          },
          steps : [
            { name: "Approval Pending", component : <VendorList partner={{partnerId:bPartnerId}} updatePartner={this.updatePartner}/>}
            // { name: "General Information", component: <GeneralInformation displayDiv="none" readonly="readonly" partner={{partnerId:bPartnerId}}/> },
            // { name: "Bank Details", component: <BankDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "KYC Details", component: <KycDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "Company Details", component: <CompanyDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "IMS Details", component: <IMSDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "Approval Matrix", component: <VendorApprovalMatrix partner={{partnerId:bPartnerId}}/> }
          ]
        });
      }
    }else{
      this.changeLoaderState(false);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Loader isLoading={this.state.isLoading}/>
        <UserDashboardHeader />
        <div className="page-content">
          <div className="wizard-v1-content">
            <div className="wizard-form">
              <div className="step-progress">
                <StepZilla
                  steps={this.state.steps}
                  onStepChange={step => {
                    
                    this.setState({ step });
                  }}
                  nextButtonText={this.state.step < 1 ? "<<" : ">>"}
                  backButtonText={this.state.step > 1 ? "<<" : "<<"}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.registration;
};
export default connect (mapStateToProps,actionCreators)(VendorDetails);