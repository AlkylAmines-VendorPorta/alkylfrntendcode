import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import { isEmpty} from "../../../Util/validationUtil";
import * as actionCreators from "../../VendorApproval/VendorApprovalMatrix/Action";
import {commonHandleChange,commonHandleChangeCheckBox, commonSubmitWithParam,
        commonSubmitWithoutEvent,commonSubmitFormValidation,commonSubmitWithParamSapUrl} from "../../../Util/ActionUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { submitToURL } from "../../../Util/APIUtils";

class VendorApprovalMatrix extends Component {
  
  constructor (props) {
    super(props);
    this.state = {
        vendorMatrixApproval:{
        approvalMatrixId:"",
        title:"",
        personName:"",
        designation:"",
        department:"",
        mobileNo:"",
        telephoneNo:"",
        faxNo:"",
        mailId:"",
        companyCode:"",
        purchaseOrganization:"",
        vendorClassification:"",
        reconAccount:"",
        vendorSchemaGroup:"",
        purchaseGroup:"",
        orderCurrency:"",
        description:"",
        businessCommencedWithAacl:"",
        isApprovedForCriticalItems:false,
        isCheckDoubleInv:false,
        isPaymentTerms:false,
        isIncomeTerms:false,
        isVendorPaymentBlock:false,
        isVendorOverallBlock:false,
        vendorCode:"",
      },
	  industry:"",
      industryList:[],
      titleList:[],
      vendorClassificationList:[],
      reconAccountList:[],
      vendorSchemaGroupList:[],
      incoTermsList:[],
      paymentTermsList:[],
      isMsme:"",
      msmeType:"",
      msmeFlag:false,
      vendorSapCodeFlag:true,
      saveApprovalMatrix: false,
      loadVendorMatrixApproval : false,
      vendorPurchaseGroupList:[],
      sapVendorMatrixApproval:{},
      vendorClassification:"",
      reconAccount:"",
      vendorSchemaGroup:"",
      vendorPaymentTerms:"",
      vendorIncoTerms:"",
      vendorIncoDescription:"",
      purchaseGroup:"",
      vendorCode:"",
      vendorCodeGroupList:[],
      incoDropDownList:[],
      paymentTermsDropDownList:[],
      reconAccounDropDownList:[],
      role:""
     }
  }


  handleSubmit = async event => {
    event.preventDefault();
        const form = event.currentTarget.form
        // await this.form.validateForm();
        // const formIsValid = this.form.isValid();
        //  if (formIsValid) {
        let index = this.props.index;
        const data = serialize(form, {
            hash: true,
            empty: true
        })
        this.props.saveGeneratlInfo(data, index);
        // console.log("Submit clicked");
  }

  async componentDidMount(){
    
    // this.props.getGeneralInfo("generalInformation");
    this.setState({
      loadVendorMatrixApproval : true
    })

  //   {(Object.entries(this.state.paymentTermsList)).map(payment =>
  //     <option value={payment[0]}>{payment[0]+'-'+payment[1]}</option>
  //  )}

      commonSubmitWithParam(this.props,"populateVendorApprovalDetails","/rest/vendorApprovalDetails",this.props.partner.partnerId);

      commonSubmitWithParam(this.props,"vendorApprovalReconAccountDetails","/rest/vendorApprovalReconAccountDetails");
      commonSubmitWithParam(this.props,"vendorApprovalPaymentTermsDetails","/rest/vendorApprovalPaymentTermsDetails");
      commonSubmitWithParam(this.props,"vendorApprovalincoTermsListDetails","/rest/vendorApprovalincoTermsListDetails");
  }

  UNSAFE_componentWillReceiveProps=props=>{

    if(!isEmpty(props.role)){
      this.setState({
        role: props.role
      })
    }
    
    if(!isEmpty(props.titleList)){
      let titleArray = Object.keys(props.titleList).map((key) => {
        return {display: props.titleList[key], value: key}
      });
      this.setState({
        titleList: titleArray
      })
    }

    if(!isEmpty(props.industry)){
      this.setState({
        industry: props.industry
      })
    }

    if(!isEmpty(props.industryList)){
      let industryArray = Object.keys(props.industryList).map((key) => {
        return {display:props.industryList[key]['displayName'],value:props.industryList[key]['value']}
      });
      this.setState({
        industryList:industryArray
      })
    }
    
      if(props.isMsme=="Y"){

      this.setState({
        msmeFlag:true,
        msmeType:props.msmeType
      })}else{

        this.setState({
          msmeFlag:false
        })
      }


      if(this.props.partner.vendorSapCode==null){

        this.setState({
          vendorSapCodeFlag:true
        })}else{
          this.setState({
            vendorSapCodeFlag:false
          })
        }
    
    if(!isEmpty(props.vendorClassificationList)){
      let vendorClassificationArray = Object.keys(props.vendorClassificationList).map((key) => {
        return {display: props.vendorClassificationList[key], value: key}
      });
      this.setState({
        vendorClassificationList: vendorClassificationArray
      })
    }
    if(!isEmpty(props.reconAccountList)){
      let reconAccountArray = Object.keys(props.reconAccountList).map((key) => {
        return {display: props.reconAccountList[key], value: key}
      });
      this.setState({
        reconAccountList: reconAccountArray
      })
    }
    if(!isEmpty(props.vendorSchemaGroupList)){
      let vendorSchemaGroupArray = Object.keys(props.vendorSchemaGroupList).map((key) => {
        return {display: props.vendorSchemaGroupList[key], value: key}
      });
      this.setState({
        vendorSchemaGroupList: vendorSchemaGroupArray
      })
    }

    if(!isEmpty(props.incoTermsList)){
      let incoTermsListArray = Object.keys(props.incoTermsList).map((key) => {
        return {display: props.incoTermsList[key], value: key}
      });
      this.setState({
        incoTermsList: incoTermsListArray
      })
    }

    

    if(!isEmpty(props.paymentTermsList)){
      let paymentTermsListArray = Object.keys(props.paymentTermsList).map((key) => {
        return {display: props.paymentTermsList[key], value: key}
      });
      this.setState({
        paymentTermsList: paymentTermsListArray
      })
    }

    if(!isEmpty(props.vendorMatrixApproval) && this.state.saveApprovalMatrix){
      let approval = props.vendorMatrixApproval;
      if(!approval.response.hasError){
        this.props.showVendorList();
      }
    }
    if(!isEmpty(props.vendorMatrixApproval) && this.state.loadVendorMatrixApproval){
      let approval= props.vendorMatrixApproval;
      let approvalId=approval.approvalMatrixId;
      let vendorTitle=approval.title;
      let vendorName=approval.name;
      let vendorDesignation=approval.designation;
      let vendorDepartment=approval.department;
      let vendorMobileNo=approval.mobileNo;
      let vendorTelephoneNo=approval.telephoneNo;
      let vendorFaxNo=approval.faxNo;
      let vendorEmailId=approval.emailId;
      let vendorComapnyCode=approval.companyCode;
      let vendorPurchaseOrg=approval.purchaseOrganization;
      let vendorClass=approval.vendorClassification;
      let vendorReconAccount=approval.reconAccount;
      let schemaGroup=approval.vendorSchemaGroup;
      let vendorPurchaseGroup=approval.purchaseGroup;
      let vendorOrderCurrecy=approval.orderCurrency;
      let vendorDescription=approval.description;
      let vendorCodeGroup=approval.vendorCode;

      
      this.setState({
          vendorMatrixApproval:{
          approvalMatrixId: approvalId,
          title:vendorTitle,
          personName:vendorName,
          designation:vendorDesignation,
          department:vendorDepartment,
          mobileNo:vendorMobileNo,
          telephoneNo:vendorTelephoneNo,
          faxNo:vendorFaxNo,
          mailId:vendorEmailId,
          companyCode:vendorComapnyCode,
          purchaseOrganization:vendorPurchaseOrg,
          vendorClassification:vendorClass,
          reconAccount:vendorReconAccount,
          vendorSchemaGroup:schemaGroup,
          purchaseGroup:vendorPurchaseGroup,
          orderCurrency:vendorOrderCurrecy,
          description:vendorDescription,
          isApprovedForCriticalItems:approval.isApprovedForCriticalItems,
          isCheckDoubleInv:approval.isCheckDoubleInv,
          isPaymentTerms:approval.isPaymentTerms,
          isIncomeTerms:approval.isIncomeTerms,
          isVendorPaymentBlock:approval.isVendorPaymentBlock,
          isVendorOverallBlock:approval.isVendorOverallBlock,
          businessCommencedWithAacl:"",
          vendorCode:vendorCodeGroup
         }
      })

  }

  if(!isEmpty(props.vendorPurchaseGroupList)){
    let vendorPurchaseGroupList = Object.keys(props.vendorPurchaseGroupList).map((key) => {
      return {display: props.vendorPurchaseGroupList[key], value: key}
    });
    this.setState({
      vendorPurchaseGroupList: vendorPurchaseGroupList
    })
  }

  if(!isEmpty(props.vendorCodeGroupList)){
 	let vendorCodeGroupList = Object.keys(props.vendorCodeGroupList).map((key) => {
      return {display: props.vendorCodeGroupList[key], value: key}
    });
    this.setState({
      vendorCodeGroupList: vendorCodeGroupList
    })
  }

if(!isEmpty(props.sapVendorMatrixApproval)){
    this.setState({
      sapVendorMatrixApproval: props.sapVendorMatrixApproval,
      vendorClassification: props.vendorClassification,
      reconAccount:props.reconAccount,
      vendorSchemaGroup:props.vendorSchemaGroup,
      vendorPaymentTerms:props.vendorPaymentTerms,
      vendorIncoTerms:props.vendorIncoTerms,
      vendorIncoDescription:props.vendorIncoDescription,
      purchaseGroup:props.purchaseGroup,
      industry:props.industry
      //vendorCode:props.vendorCode
    })
  }
  }
  render() {
    console.log('msmeFlag',this.state.msmeFlag,this.props.isMsme)
    return (
      <div className="card">
        <div className="card-header">Vendor Approval</div>
        <div className="card-body">
        <FormWithConstraints  ref={formWithConstraints => this.vendorApprvForm = formWithConstraints} 
            noValidate > 
        <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId}/>
        <input type="hidden" name="approvalMatrixId" disabled={isEmpty(this.state.vendorMatrixApproval.approvalMatrixId)} value={this.state.vendorMatrixApproval.approvalMatrixId}/>
          {/* <div className="row">
            <label className="col-sm-2">Salutation</label>
            <div className="col-sm-1">
            <select class="form-control" name="title" 
                    value={this.state.vendorMatrixApproval.title} 
                    onChange={(event)=>commonHandleChange(event,this,"vendorMatrixApproval.title")}>
                      <option value="">Select</option>
                      {(this.state.titleList).map(title=>
                        <option value={title.value}>{title.display}</option>
                      )};
                    </select>
            </div>
            <div className="col-sm-2"></div>
            <label className="col-sm-2">Person Name <span className="redspan">*</span></label>
            <div className="col-sm-3">
                <input type="text" class="form-control" name="name" required value={this.state.vendorMatrixApproval.personName} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.personName")}} />
                <FieldFeedbacks for="name">
                      <FieldFeedback when="*"></FieldFeedback>
                </FieldFeedbacks>
            </div>
          </div>
          <br />
          <div className="row">
            <label className="col-sm-2">Designation <span className="redspan">*</span></label>
            <div className="col-sm-3">
                <input type="text" class="form-control" name="designation" required value={this.state.vendorMatrixApproval.designation} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.designation")}} />
                <FieldFeedbacks for="designation">
                      <FieldFeedback when="*"></FieldFeedback>
                </FieldFeedbacks>
            </div>
            <label className="col-sm-2">Department <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" class="form-control" name="department" required value={this.state.vendorMatrixApproval.department} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.department")}} />
              <FieldFeedbacks for="department">
                      <FieldFeedback when="*"></FieldFeedback>
                </FieldFeedbacks>
            </div>
          </div>
          <br />
          <div className="row">
            <label className="col-sm-2">Mobile No <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" class="form-control" name="mobileNo" required value={this.state.vendorMatrixApproval.mobileNo} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.mobileNo")}} />
             
                   <FieldFeedbacks for="mobileNo">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)}>Number Should be 10 digits</FieldFeedback>
                    </FieldFeedbacks>
            </div>
            <label className="col-sm-2">Telephone No <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" class="form-control" name="telephoneNo" required value={this.state.vendorMatrixApproval.telephoneNo} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.telephoneNo")}} />
              <FieldFeedbacks for="telephoneNo">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^-?\d*\.?\d*$/.test(value)}>Please enter valid number</FieldFeedback>
                    </FieldFeedbacks>
            </div>
          </div>
          <br /> */}
          {/* <div className="row">
             <label className="col-sm-2">Fax No</label>
            <div className="col-sm-3">
            <input type="text" class="form-control" name="faxNo" value={this.state.vendorMatrixApproval.faxNo} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.faxNo")}} />
            </div> 
            <label className="col-sm-2">Mail ID<span className="redspan">*</span></label>
            <div className="col-sm-3">
                <input type="text" class="form-control" required name="emailId" value={this.state.vendorMatrixApproval.mailId} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.mailId")}} />
                <FieldFeedbacks for="mailId">
                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                    <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address.</FieldFeedback>
                </FieldFeedbacks> 
            </div>
          </div>
          <br/>  */}
          {/* <div className="row">
            <label className="col-sm-2">Company Code</label>
            <div className="col-sm-3">
            <input type="text" class="form-control" name="companyCode" value={this.state.vendorMatrixApproval.companyCode} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.companyCode")}} />
            </div>
            <label className="col-sm-2">Purchase Organization</label>
            <div className="col-sm-3">
            <input type="text" class="form-control" name="purchaseOrganization" value={this.state.vendorMatrixApproval.purchaseOrganization} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.purchaseOrganization")}} />
            </div>
          </div> */}
          <br/>
          <div className="row">
            {/* <label className="col-sm-2">Vendor Classification  <span className="redspan">*</span> </label>
            <div className="col-sm-3">
            <select class=" readonly form-control" name="vendorClassification"
                    value={this.state.vendorSapCodeFlag ? "ZRMD" : this.state.vendorClassification.value}
                    onChange={(event)=>{commonHandleChange(event,this,"vendorClassification","vendorApprvForm");}}
                    required>
                     <option value="" selected>Select</option>
                     {(this.state.vendorClassificationList).map(vendorClassification=>
                        <option value={vendorClassification.value}>{vendorClassification.display}</option>
                     )};
                    </select>
                    <FieldFeedbacks for="vendorClassification">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
            
            </div> */}
            <label className="col-sm-2">Recon. Account  <span className="redspan">*</span> </label>
            <div className="col-sm-3">
              {this.state.msmeFlag==false?
            <select class={this.state.msmeFlag?"readonly form-control":"form-control"} name="reconAccount" 
                    value={this.state.reconAccount} 
                    onChange={(event)=>commonHandleChange(event,this,"reconAccount","vendorApprvForm")}
                    required>
                      <option value="">Select</option>
                      {(this.state.reconAccountList).map(reconAccount=>
                        <option value={reconAccount.value}>{reconAccount.display}</option>

                              //  <option value={reconAccount.value[0]}>{reconAccount.value[1]}</option>
                      )};
                    </select>
                       :
                     
                       <select class={this.state.msmeFlag?"readonly form-control":"form-control"} name="reconAccount" 
                       //  value={this.state.msmeFlag ? "26112018":this.state.reconAccount} 
                         onChange={(event)=>commonHandleChange(event,this,"reconAccount","vendorApprvForm")}
                         required>
                         <option value="">Select</option>
                           <option value="21500001">{"21500001-MSME MICRO AND SMALL CREDITORS"}</option>
                           <option value="21500002">{"21500002-MSME MEDIUM CREDITORS"}</option>
                           {/* {(this.state.reconAccountList).map(reconAccount=>
                             <option value={reconAccount.value}>{reconAccount.display}</option>
                           )}; */}
                         </select>
                       
                  //      this.state.msmeType==="ME"?
                  // <select class={this.state.msmeFlag?"readonly form-control":"form-control"} name="reconAccount" 
                  // //  value={this.state.msmeFlag ? "26112018":this.state.reconAccount} 
                  //   onChange={(event)=>commonHandleChange(event,this,"reconAccount","vendorApprvForm")}
                  //   required>
                  //   <option value="">Select</option>
                  //     {/* <option value="21500001">{"21500001-MSME MICRO AND SMALL CREDITORS"}</option> */}
                  //     <option value="21500002">{"21500002-MSME MEDIUM CREDITORS"}</option>
                  //     {/* {(this.state.reconAccountList).map(reconAccount=>
                  //       <option value={reconAccount.value}>{reconAccount.display}</option>
                  //     )}; */}
                  //   </select>
                  //   :
                  // <select class={this.state.msmeFlag?"readonly form-control":"form-control"} name="reconAccount"
                  // //  value={this.state.msmeFlag ? "26112018":this.state.reconAccount}
                  //   onChange={(event)=>commonHandleChange(event,this,"reconAccount","vendorApprvForm")}
                  //   required>
                  //     <option value="">Select</option>
                  //     <option value="21500001">{"21500001-MSME MICRO AND SMALL CREDITORS"}</option>
                  //     {/* <option value="21500002">{"21500002-MSME MEDIUM CREDITORS"}</option> */}
                  //     {/* {(this.state.reconAccountList).map(reconAccount=>
                  //       <option value={reconAccount.value}>{reconAccount.display}</option>
                  //     )}; */}
                  //   </select>
                    }
                    <FieldFeedbacks for="reconAccount">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
            </div>
          </div>
          <br/>
          <div className="row">
            {/* <label className="col-sm-2">Vendor Schema Group <span className="redspan">*</span> </label>
            <div className="col-sm-3">
            <select class="form-control" name="vendorSchemaGroup" 
                    value={this.state.vendorSchemaGroup} 
                    onChange={(event)=>commonHandleChange(event,this,"vendorSchemaGroup","vendorApprvForm")}
                    required>
                      <option value="">Select</option>
                      {(this.state.vendorSchemaGroupList).map(vendorSchemaGroup=>
                        <option value={vendorSchemaGroup.value}>{vendorSchemaGroup.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="vendorSchemaGroup">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
            </div> */}

            <label className="col-sm-2">Payment Terms </label>
            <div className="col-sm-3">
            <select class="form-control" name="vendorPaymentTerms" 
                //    value={this.state.vendorPaymentTerms} 
                    onChange={(event)=>commonHandleChange(event,this,"vendorPaymentTerms","vendorApprvForm")}
                    required={false}>
                      <option value="">Select</option>
                      {(this.state.paymentTermsList).map(item=>
                       <option value={item.value}>{item.display}</option>

                   //   <option value={item.value[0]}>{item.value[1]}</option>
                      )};
                    </select>
                    {/* <FieldFeedbacks for="vendorPaymentTerms">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks> */}
            </div>
  
           
            
          </div>
          <br/>
          <div className="row">

          <label className="col-sm-2">Inco Terms </label>
            <div className="col-sm-2">
            <select class="form-control" name="vendorIncoTerms" 
                    value={this.state.vendorIncoTerms} 
                    onChange={(event)=>commonHandleChange(event,this,"vendorIncoTerms","vendorApprvForm")}
                    required={false}>
                      <option value="">Select</option>
                      {(this.state.incoTermsList).map(item=>
                        <option value={item.value}>{item.display}</option>
                  //   <option value={item.value[0]}>{item.value[1]}</option>
                      )};
                    </select>
                    {/* <FieldFeedbacks for="vendorIncoTerms">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks> */}
            </div>

            {/* <label className="col-sm-2">Inco Description <span className="redspan">*</span> </label> */}
            <div className="col-sm-2">

           { this.state.vendorIncoTerms==""?
                <input required={false}
                    class="form-control"
                    name="vendorIncoDescription"
                    value={this.state.vendorIncoDescription}
                    onChange={(e)=>{
                    if(e.target.value.length > 28) return null;
                      commonHandleChange(e,this,"vendorIncoDescription","vendorApprvForm");
                    }}
                  />:
                  <input required={true}
                    class="form-control"
                    name="vendorIncoDescription"
                    value={this.state.vendorIncoDescription}
                    onChange={(e)=>{
                    if(e.target.value.length > 28) return null;
                      commonHandleChange(e,this,"vendorIncoDescription","vendorApprvForm");
                    }}
                  />}
                <FieldFeedbacks for="vendorIncoDescription">
                  <FieldFeedback when="*"></FieldFeedback>
                </FieldFeedbacks>
            </div>
       
      

          </div>
          <br/>
          <div className="row">
             {/* <input type="text" class="form-control" name="purchaseGroup" value={this.state.vendorMatrixApproval.purchaseGroup} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.purchaseGroup","vendorApprvForm")}} required /> */}
            {/* <label className="col-sm-2">Purchase Group</label>
            <div className="col-sm-3">
           
            <select class="form-control" name="purchaseGroup" 
              value={this.state.purchaseGroup}
              onChange={(event)=>{commonHandleChange(event,this,"purchaseGroup","vendorApprvForm")}} >
              <option value="">Select</option>
              {(this.state.vendorPurchaseGroupList).map(vendorPurchaseGroup=>
                <option value={vendorPurchaseGroup.value}>{vendorPurchaseGroup.display}</option>
              )};
            </select>
            <FieldFeedbacks for="purchaseGroup">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^\d*\.?\d*$/.test(value)}>Enter Valid Number</FieldFeedback>
                      </FieldFeedbacks>
            </div> */}
            {/* <label className="col-sm-2">Order Currency</label>
            <div className="col-sm-3">
            <input type="text" class="form-control readonly" name="orderCurrency" value="INR" onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.orderCurrency")}} />
            </div> */}
          </div>
          <br/>
          <div className="row">
		  <label className="col-sm-2">Industry</label>
            <div className="col-sm-3">
              <select class="form-control" name="industry" 
              value={this.state.industry}
              onChange={(event)=>{commonHandleChange(event,this,"industry","vendorApprvForm")}}
              required>
              <option value="">Select</option>
              {(this.state.industryList).map(industryItem=>
                <option value={industryItem.value}>{industryItem.display}</option>
              )};
            </select>
          {/* <FieldFeedbacks for="industry">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^\d*\.?\d*$/.test(value)}>Enter Valid Number</FieldFeedback>
                      </FieldFeedbacks>*/}
            </div>
            {/* <label className="col-sm-2">Vendor Code</label>
            <div className="col-sm-3">
            <input type="text" class="form-control" name="vendorCode" value={this.props.partner.vendorSapCode} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.vendorSapCode","vendorApprvForm")}} /> 
			
            <FieldFeedbacks for="purchaseGroup">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^\d*\.?\d*$/.test(value)}>Enter Valid Number</FieldFeedback>
                      </FieldFeedbacks>
            </div> */}
            <label className="col-sm-2">Vendor Code</label>
            {this.state.role==="VENAPP"?
            <div className="col-sm-3">
            {/* <input type="text" class="form-control" name="vendorCode" value={this.props.partner.vendorSapCode} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.vendorSapCode","vendorApprvForm")}} />  */}
            <input type="text" class="form-control" name="vendorCode" defalutValue={this.props.partner.vendorSapCode} 
            onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.vendorSapCode","vendorApprvForm")}} /> 
			
            <FieldFeedbacks for="vendorCode">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^\d*\.?\d*$/.test(value)}>Enter Valid Number</FieldFeedback>
                      </FieldFeedbacks>
            </div>:<div className="col-sm-3">
            {/* <input type="text" class="form-control" name="vendorCode" value={this.props.partner.vendorSapCode} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.vendorSapCode","vendorApprvForm")}} />  */}
            <input type="text" class="form-control" name="vendorCode" value={this.props.partner.vendorSapCode} 
            onChange={(event)=>{commonHandleChange(event,this,"","vendorApprvForm")}} 
            /> 
{/* 			
            <FieldFeedbacks for="purchaseGroup">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^\d*\.?\d*$/.test(value)}>Enter Valid Number</FieldFeedback>
                      </FieldFeedbacks> */}
            </div>}
          </div>  

          <div className="row">
          <label className="col-sm-2">
              <div className="form-check">
                <label className="form-check-label">
                <input
                        type="checkbox"
                        class="form-check-input"
                        value="Y" name="isCheckDoubleInv"
                       // checked={this.state.vendorMatrixApproval.isCheckDoubleInv}  
                       checked="checked"
                        onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isCheckDoubleInv")}}
                      />
                  Check Double Inv.
                </label>
              </div>
            </label>
            <label className="col-sm-3">
              <div className="form-check">
                <label hidden className="form-check-label">
                <input hidden disabled
                        type="checkbox"
                        class="form-check-input"
                        value="Y" name="isPaymentTerms" 
                        checked={this.state.vendorMatrixApproval.isPaymentTerms}  
                        onChange={(e)=>{commonHandleChangeCheckBox(e,this,"vendorMatrixApproval.isPaymentTerms")}}
                      />
                  Payment Terms
                </label>
              </div>
            </label>
            <label className="col-sm-2 nopadding">Vendor Blocked</label>
            <label className="col-sm-3">              
              <div className="form-check">
                <label className="form-check-label">
                <input
                        type="checkbox"
                        class="form-check-input"
                        value="Y" name="isVendorOverallBlock"
                        checked={this.state.vendorMatrixApproval.isVendorOverallBlock}
                        onChange={(e)=>{commonHandleChangeCheckBox(e,this,"vendorMatrixApproval.isVendorOverallBlock")}}
                      />
                  Over all Block
                </label>&nbsp;&nbsp;&nbsp;
                <label className="form-check-label ml-3">
                <input
                        type="checkbox"
                        class="form-check-input"
                        value="Y" name="isVendorPaymentBlock"
                        checked={this.state.vendorMatrixApproval.isVendorPaymentBlock}
                        onChange={(e)=>{commonHandleChangeCheckBox(e,this,"vendorMatrixApproval.isVendorPaymentBlock")}}
                      />
                  Payment Block
                </label>
              </div>
            </label>
          </div>
          <br/>
          <div className="row">
          <label className="col-sm-2">
              <div className="form-check">
                <label hidden className="form-check-label">
                <input hidden
                        type="checkbox"
                        class="form-check-input"
                        value="Y" name="isIncomeTerms"
                        checked={this.state.vendorMatrixApproval.isIncomeTerms}
                        onChange={(e)=>{commonHandleChangeCheckBox(e,this,"vendorMatrixApproval.isIncomeTerms")}}
                      />
                  Inco Terms -EXW Mumbai
                </label>
              </div>
            </label>
            {/* <label hidden className="col-sm-3">Description</label>
            <div className="col-sm-3">
            <input  hidden type="text" class="form-control" name="description" value={this.state.vendorMatrixApproval.description} onChange={(event)=>{commonHandleChange(event,this,"vendorMatrixApproval.description")}} />
            </div> */}
          </div>
          <br/>
          {/* <div className="row">         
            <label className="col-sm-2">Business commenced with AACL</label>
            <div className="col-sm-3">
              <select className="form-control" ><option>Select Month</option></select>
            </div>
            <div className="col-sm-3">
              <select className="form-control" ><option>Select Year</option></select>
            </div>
          </div> */}
           <div className="row mt-1 ">  
                        <label className="col-sm-2" > Items / Service Offered to AACL </label>
                        <div className={"col-sm-6 "} >
                        <textarea className="formcontrol" rows="3" value={this.state.vendorMatrixApproval.description}  
                        name="description" onChange={(e)=>{commonHandleChange(e,this,"vendorMatrixApproval.description")}} >
                        </textarea>
                     </div>
          </div>
          {this.state.role==="VENAPP"?
          <div className=" col-sm-12 text-center mt-3">
            <button type="button" className="btn btn-primary " 
            onClick={(e)=>{this.setState({saveApprovalMatrix:true});commonSubmitWithoutEvent(e.currentTarget.form,this,"saveVendorApprovalResp","/rest/saveVendorApprovalDetails","vendorApprvForm")}}>
              Approve</button>
            <button type="button" className="btn btn-danger mr-1"
            onClick={(e)=>{this.setState({saveApprovalMatrix:true});commonSubmitWithoutEvent(e.currentTarget.form,this,"saveVendorApprovalResp","/rest/saveVendorRejectionDetails")}}>  
              Reject</button>
        <button type="button" className="btn btn-success mr-1" 
              onClick={(e)=>{commonSubmitWithParam(this.props, "getVendorApprovalMatrix", "/rest/fetchVendorApprovalDetails" , this.props.partner.vendorSapCode === null ? 0 : this.props.partner.vendorSapCode )}}>
              Fetch Data</button>
       </div>    :""} 
          </FormWithConstraints>
        </div>
        
        <br/>
        
      </div>
    
    );
  }
}

const mapStateToProps=(state)=>{
  return state.vendorApproval;
  return state.vendorListInfo;
};
export default connect (mapStateToProps,actionCreators)(VendorApprovalMatrix);