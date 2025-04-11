import StepZilla from "react-stepzilla";
import React, { Component } from "react";
import {connect} from 'react-redux';
import VendorDashboardHeader from "../../Component/Header/VendorDashboardHeader";
import GeneralInformation from "../Registration/GeneralInformation/GeneralInformation";
import BankDetails from "../Registration/BankDetails/BankDetails";
import KycDetails from "../Registration/KycDetails/KycDetails";
import CompanyDetails from "../Registration/CompanyDetails/CompanyDetails";
import IMSDetails from "../Registration/IMSDetails/IMSDetails";
//import VendorApprovalMatrix from "../Registration/VendorApprovalMatrix/VendorApprovalMatrix";
//import VendorList from "../Registration/VendorList/VendorList";
import { commonSubmitForm, commonHandleChange,commonSubmitWithParam} from "../../Util/ActionUtil";
import swal from 'sweetalert';
import * as actionCreators from "./Action";
import { isEmpty } from "lodash-es";
import Loader from "../FormElement/Loader/LoaderWithProps";

class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editable:false,
      userRole:{
        roleId:"",
        value:"",
        name:"",
        description:""
      },
      isLoading:false,
      step: 0,
      partner:{
        partnerId: "",
        status: "",
        isProfileUpdated:'N'
      },
      readonly:"",
      partners:[{
        partnerId: "",
        userEmail: ""
      }],
  
      isReadOnly : "",
      isDisplayDiv : "",
      isDisplayDiv1 :"",
      isManufacturer:false,
    }
    
  };
  
  changeLoaderState = (action) =>{
    this.setState({isLoading:action});
  }

  async componentWillMount(){
    
  }

  componentDidMount(){
    commonSubmitWithParam(this.props,"populatePartnerInfo","/rest/getPartner",null);
    this.changeLoaderState(true);
  }

  showManufacturerTabs=(isReadOnly,isDisplayDiv,isDisplayDiv1,bPartnerId,status)=>{
    return(
      <>
      <GeneralInformation loadManuFacturerTab={true} showNonManufacturerTabs={this.showNonManufacturerTabs} showManufacturerTabs={this.showManufacturerTabs}  readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}} changeManufacturerFlag={this.changeManufacturerFlag}/> 
       <BankDetails readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/> 
       <KycDetails readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/> 
       <CompanyDetails  readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/>
       <IMSDetails readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/>
     </>
      );
    } 

  showNonManufacturerTabs=(isReadOnly,isDisplayDiv,isDisplayDiv1,bPartnerId,status)=>{
    return( 
      <>
       <GeneralInformation loadManuFacturerTab={true} showNonManufacturerTabs={this.showNonManufacturerTabs} showManufacturerTabs={this.showManufacturerTabs}  readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}} changeManufacturerFlag={this.changeManufacturerFlag}/> 
       <BankDetails readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/> 
       <KycDetails readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status}}/> 
       <CompanyDetails showSubmit={true} readonly={isReadOnly} changeLoaderState={this.changeLoaderState} displayDiv={isDisplayDiv} displayDiv1={isDisplayDiv1} partner={{partnerId:bPartnerId,status:status,isProfileUpdated:this.state.partner.isProfileUpdated}}/>
       
      </>
    );
  }

  changeManufacturerFlag=(vendorType)=>{
    // let isManufacturer = vendorType==="MANUFACTURER"?true:false;
    if(vendorType==="MANUFACTURER")
this.setState({

  isManufacturer:true
})
else{
  this.setState({

    isManufacturer:false
  })
}
  }

  editFunction = () =>{
    commonSubmitWithParam(this.props,"updateVendorPartnerStatus","/rest/updateVendorPartnerStatus",this.state.partner.partnerId);
  }

  componentWillReceiveProps(props){
    if(!isEmpty(props.user)){
      let role=props.user.roles[0];
      let roleData={
        roleId:role.roleId,
        value:role.value,
        name:role.name,
        description:role.description
      }
      this.setState({
        userRole:roleData
      });
    }
    if(!isEmpty(props.partners)){
      this.changeLoaderState(false);
      if(!isEmpty(props.partners[0])){
        let bPartnerId= props.partners[0].bPartnerId;        
        let status= props.partners[0].status;
        let isReadOnly = "";
        let isDisplayDiv = "";
        let isDisplayDiv1 = "";
        let isManufacturer = props.partners[0].vendorType==="MANUFACTURER"?true:false;
        if(status==="IP"){
          isReadOnly = "readonly";
          isDisplayDiv = "none";
          isDisplayDiv1 = "block"
          swal({
            text: "Registration is under approval",
            timer: 3000
          });
        }else if(status==="DR" || status==="RJ"){
          isReadOnly = "Noreadonly";
        }else if(status==="CO"){
          isReadOnly = "readonly";
          isDisplayDiv = "none"
          isDisplayDiv1 = "block"
        }
        let prt = props.partners[0] ? props.partners[0]:{};
        this.setState({
          partners: props.partners,
          partner: {
            partnerId:prt.bPartnerId,
            status:prt.status,
            isProfileUpdated: prt.isProfileUpdated || 'N'
          },
          isReadOnly:isReadOnly,
          isDisplayDiv:isDisplayDiv,
          isDisplayDiv1:isDisplayDiv1,
          isManufacturer:props.partners[0].vendorType==="MANUFACTURER"?true:false,
        });

        // if(isManufacturer){
        //   console.log("function call");
        //   this.showManufacturerTabs(isReadOnly,isDisplayDiv,isDisplayDiv1,bPartnerId,status);
        //   this.setState({
        //     isManufacturer:true,
        //   })
        // }else{
        //   this.showNonManufacturerTabs(isReadOnly,isDisplayDiv,isDisplayDiv1,bPartnerId,status);
        //    this.setState({
        //     isManufacturer:true,
        //   })
        // }

      }
    }
  }

  render() {
    if(isEmpty())
    return (
      <React.Fragment>
        <Loader isLoading={this.state.isLoading} />
        <VendorDashboardHeader />
        <div className="page-content">
        <div className="wizard-v1-content" id="togglesidebar" >
            <div className="wizard-form">

            {this.state.userRole.value==="VENADM" && this.state.partner.status==="CO"?
              <div className="row px-4 py-0">
                <div className="col-12">
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-sm btn-primary mb-2"
                      type="button"
                      onClick={() => this.editFunction()}
                      style={{width:90}}
                    >
                      <i className="fa fa-pencil"></i>&nbsp;Edit
                    </button>
                  </div>
                </div>
              </div>
              :
              <></>}

              <div className="step-progress">
                { this.state.partner.partnerId?<>
                {this.state.isManufacturer?this.showManufacturerTabs(this.state.isReadOnly,this.state.isDisplayDiv,this.state.isDisplayDiv1,this.state.partner.partnerId,this.state.partner.status)
                :this.showNonManufacturerTabs(this.state.isReadOnly,this.state.isDisplayDiv,this.state.isDisplayDiv1,this.state.partner.partnerId,this.state.partner.status)}</>
                :<></>}
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
export default connect (mapStateToProps,actionCreators)(Registration);