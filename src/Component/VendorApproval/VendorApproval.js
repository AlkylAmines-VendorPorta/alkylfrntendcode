import StepZilla from "react-stepzilla";
import React, { Component } from "react";
import {connect} from 'react-redux';
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import GeneralInformation from "../Registration/GeneralInformation/GeneralInformation";
import BankDetails from "../Registration/BankDetails/BankDetails";
import KycDetails from "../Registration/KycDetails/KycDetails";
import CompanyDetails from "../Registration/CompanyDetails/CompanyDetails";
import IMSDetails from "../Registration/IMSDetails/IMSDetails";
import VendorApprovalMatrix from "../VendorApproval/VendorApprovalMatrix/VendorApprovalMatrix";
import VendorList from "../VendorApproval/VendorList/VendorList";
import { commonSubmitForm, commonHandleChange,commonSubmitWithParam} from "../../Util/ActionUtil";

import * as actionCreators from "./Action";
import { isEmpty } from "lodash-es";

class VendorApproval extends Component {

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
        // { name: "General Information", component: <GeneralInformation partner={{partnerId:""}} /> },
        // { name: "Bank Details", component: <BankDetails partner={{partnerId:""}} /> },
        // { name: "KYC Details", component: <KycDetails partner={{partnerId:""}} /> },
        // { name: "Company Details", component: <CompanyDetails partner={{partnerId:""}} /> },
        // { name: "IMS Details", component: <IMSDetails partner={{partnerId:""}} /> },
        // { name: "Approval Matrix", component: <VendorApprovalMatrix partner={{partnerId:""}} /> }
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
  
  showManufacturerTabs=(bPartnerId)=>{ 
    this.setState({
      steps : [
        { name: "General Information", component: <GeneralInformation displayDiv="none" 
          loadManuFacturerTab={false} showNonManufacturerTabs={this.showNonManufacturerTabs} 
          showManufacturerTabs={this.showManufacturerTabs} readonly="readonly" disabled="disabled" 
          partner={{partnerId:bPartnerId}}/> },
        { name: "Bank Details", component: <BankDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
        { name: "KYC Details", component: <KycDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
        { name: "Company Details", component: <CompanyDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
        { name: "IMS Details", component: <IMSDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={{partnerId:bPartnerId,isProfileUpdated:this.state.partner.isProfileUpdated}}/> },
        { name: "Approval Matrix", component: <VendorApprovalMatrix partner={{partnerId:bPartnerId}}/> }
      ]
    });
  }

  showNonManufacturerTabs=(bPartnerId)=>{
    this.setState({
      steps : [
        { name: "General Information", component: <GeneralInformation displayDiv="none" 
          loadManuFacturerTab={false} showNonManufacturerTabs={this.showNonManufacturerTabs} 
          showManufacturerTabs={this.showManufacturerTabs}  readonly="readonly" disabled="disabled" 
          partner={{partnerId:bPartnerId}}/> },
        { name: "Bank Details", component: <BankDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
        { name: "KYC Details", component: <KycDetails readonly="readonly" disabled="disabled"displayDiv="none" partner={{partnerId:bPartnerId}}/> },
        { name: "Company Details", component: <CompanyDetails readonly="readonly" disabled="disabled"displayDiv="none" partner={{partnerId:bPartnerId,isProfileUpdated:this.state.partner.isProfileUpdated}}/> },
        { name: "Approval Matrix", component: <VendorApprovalMatrix showVendorList={this.showVendorList} partner={{partnerId:bPartnerId}}/> }
      ]
    });
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
      this.showManufacturerTabs(bPartnerId);
    }else{
      this.showNonManufacturerTabs(bPartnerId);
    }

  }

  async componentWillMount(){
    
  }

  componentDidMount(){
    
    commonSubmitWithParam(this.props,"populatePartnerInfo","/rest/getPartner",null);
  }

  componentWillReceiveProps(props){
    
    if(!isEmpty(props.partners)){
      if(!isEmpty(props.partners[0])){
        let bPartnerId= props.partners[0].bPartnerId;       
        this.setState({
          partners: props.partners,          
          partner: {
            partnerId:bPartnerId
          },
          steps : [
            { name: "Approval Pending", component : <VendorList  partner={{partnerId:bPartnerId}} updatePartner={this.updatePartner}/>}
            // { name: "General Information", component: <GeneralInformation displayDiv="none" readonly="readonly" partner={{partnerId:bPartnerId}}/> },
            // { name: "Bank Details", component: <BankDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "KYC Details", component: <KycDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "Company Details", component: <CompanyDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "IMS Details", component: <IMSDetails readonly="readonly" displayDiv="none" partner={{partnerId:bPartnerId}}/> },
            // { name: "Approval Matrix", component: <VendorApprovalMatrix partner={{partnerId:bPartnerId}}/> }
          ]
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <UserDashboardHeader />
        <div className="page-content">
          <div className="wizard-v1-content">
            <div className="wizard-form">
              <div className="step-progress">
                <StepZilla
                  steps={this.state.steps}
                  onStepChange={step => {
                    
                    this.setState({ step });
                    // console.log(this.state.step);
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
export default connect (mapStateToProps,actionCreators)(VendorApproval);