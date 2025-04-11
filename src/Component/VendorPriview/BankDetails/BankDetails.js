import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import { isEmpty} from "../../../Util/validationUtil";
import { commonSubmitForm, commonHandleChange,commonSubmitWithParam,resetForm,swalPrompt,commonSubmitWithoutEvent} from "../../../Util/ActionUtil";
import * as actionCreators from "../../Registration/BankDetails/Action";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import swal from 'sweetalert';

class BankDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partnerBankDetails:{
        partnerBankDetailId:"",
        ifscCode:"",
        accountNumber:"",
        benificaryName:"",
        bankNameDetailId:"",
        bankNameDetails:"",
        branchNameDetailId:"",
        branchName:"",
        branchState:""
      },
      branchStateList:[],
      vendorName:"",
      submitSaveForm:false,
      eventForSubmit:"",
      loadIFSC : false
    };
  }

	saveBankDetails=(e)=>{
    if((this.state.vendorName!=this.state.partnerBankDetails.benificaryName)){
      this.setState({
      formElement:e.target.form
    })
      swalPrompt(e,this,"saveBankDetailsAfterYesResponse","","Name as per Cheque is Different than Vendor Name","OK","CANCEL");
    }else {
      commonSubmitWithoutEvent(e.target.form,this,"saveBankDetailsResponse","/rest/savePartnerBankDetail","bankDetForm");
      
    }
  }
  
  async componentDidMount(){
    
    commonSubmitWithParam(this.props,"getBankDetailsResponse","/rest/getPartnerBankDetails",this.props.partner.partnerId);
  }

  async componentWillReceiveProps(props){
    
    if(!isEmpty(props.branchStateList)){
      let branchStateArray = Object.keys(props.branchStateList).map((key) => {
        return { display: props.branchStateList[key].name, value: props.branchStateList[key].regionId }
      });
      this.setState({
        branchStateList: branchStateArray
      })
    }
    if(!isEmpty(props.partnerBankDetails)){
        let bankDetail=props.partnerBankDetails;
        let bankDetailId=bankDetail.partnerBankDetailId;
        let bankIfscCode=bankDetail.ifscCode;
        let accNo=bankDetail.accountNumber;
        let bankBenificaryName=bankDetail.benificaryName;
        let bankNameId="";
        let bankName="";
        // let branchState="";
        if(!isEmpty(bankDetail.bankNameDetails)){
          bankNameId=bankDetail.bankNameDetails.bankNameDetailsId;
          bankName=bankDetail.bankNameDetails.name;
        }
        let bankBranchNameId="";
        let bankBranchName="";
         let bankBranchState="";
        if(!isEmpty(bankDetail.branchName)){
          bankBranchNameId=bankDetail.branchName.bankBranchDetailsId;
          bankBranchName=bankDetail.branchName.branchName;
          if(!isEmpty(bankDetail.branchName.branchState)){
            bankBranchState=bankDetail.branchName.branchState.regionId;
          }
          
        }
        this.setState({
          partnerBankDetails:{
            partnerBankDetailId: bankDetailId,
            ifscCode: bankIfscCode,
            accountNumber: accNo,
            benificaryName: bankBenificaryName,
            bankNameDetailId:bankNameId,
            bankNameDetails:bankName,
            branchNameDetailId:bankBranchNameId,
            branchName:bankBranchName,
            branchState:bankBranchState

          }
        })
    }
  }
  

  render() {
    return (
      <div className="card">
              <div className="card-header">Bank Details</div>
              <div className="card-body" style={{paddingLeft:"10px"}}>
          <FormWithConstraints classname="mt-2" ref={formWithConstraints => this.bankDetForm = formWithConstraints} 
           onSubmit={(e)=>{commonSubmitForm(e,this,"saveBankDetailsResponse","/rest/savePartnerBankDetail","bankDetForm")}} noValidate > 
            <input type="hidden" name="partnerBankDetailId" 
            value={this.state.partnerBankDetails.partnerBankDetailId}/>
            <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId} />

          <div className="row">
            <label className="col-sm-2">IFSC Code<span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" name="ifscCode" value={this.state.partnerBankDetails.ifscCode}
               onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.ifscCode' ,"bankDetForm")}} 
               onBlur={(e)=>{this.setState({loadIFSC:true});  commonSubmitWithParam(this.props,"populateBankIFSCDetails","/rest/getIFSCDetails",this.state.partnerBankDetails.ifscCode);}} 
               className={"form-control "}
               required />
                    <FieldFeedbacks for="ifscCode">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
            </div>
            <label className="col-sm-2">Bank Name <span className="redspan">*</span></label>
            <div className="col-sm-3">
            <input type="hidden" name="bankNameDetails[bankNameDetailsId]" 
            value={this.state.partnerBankDetails.bankNameDetailId}/>
              <input type="text" name="bankNameDetails[name]" 
              value={this.state.partnerBankDetails.bankNameDetails} required
              onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.bankNameDetails' ,"bankDetForm")}} className={"form-control "}  />
              <FieldFeedbacks for="bankNameDetails[name]">
                <FieldFeedback when="*"></FieldFeedback>
              </FieldFeedbacks>
            </div>
          </div>
          <div className="row mt-2">
            <label className="col-sm-2">Account No <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" name="accountNumber" value={this.state.partnerBankDetails.accountNumber}  required
              onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.accountNumber' ,"bankDetForm")}} className={"form-control "} />
              <FieldFeedbacks for="accountNumber">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^[a-zA-Z0-9]+$/.test(value)}>Please enter valid number</FieldFeedback>
                    </FieldFeedbacks>
            </div>
            <label className="col-sm-2">Name As Per Cheque <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" name="benificaryName" 
              onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.benificaryName' ,"bankDetForm")}} required
              value={this.state.partnerBankDetails.benificaryName} className={"form-control "} />
              <FieldFeedbacks for="benificaryName">
                <FieldFeedback when="*"></FieldFeedback>
              </FieldFeedbacks>
            </div>
          </div>
          <div className="row mt-2">
            <label className="col-sm-2">Branch Name <span className="redspan">*</span></label>
            <div className="col-sm-3">
            <input type="hidden" name="branchName[bankBranchDetailsId]" 
            value={this.state.partnerBankDetails.branchNameDetailId}/>
              <input type="text" name="branchName[branchName]" value={this.state.partnerBankDetails.branchName} required
              onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.branchName' )}} className={"form-control "} />
               <FieldFeedbacks for="branchName[branchName]">
                <FieldFeedback when="*"></FieldFeedback>
              </FieldFeedbacks>
            </div>
            <label className="col-sm-2">Branch State <span className="redspan"> *</span></label>
            <div className="col-sm-3">
              {/* <input type="text" name="branchName[branchState]" value={this.state.partnerBankDetails.branchState} required
              onChange={(e)=>{commonHandleChange(e,this, 'partnerBankDetails.branchState')}}className={"form-control "+this.props.readonly} /> */}
            <select className={"form-control "} readOnly={this.props.readonly} name="branchName[branchState][regionId]" 
                    value={this.state.partnerBankDetails.branchState} required
                    onChange={ (e)=>{commonHandleChange(e,this,'partnerBankDetails.branchState' ,"bankDetForm")} }>
                      <option value="">Select</option>
                      {(this.state.branchStateList).map(state=>
                        <option value={state.value}>{state.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="branchName[branchState][regionId]">
                         <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
            </div>            
          </div>
          <div className={"col-sm-12 text-center mt-2 " + this.props.displayDiv}>
                  <button type="submit" className="btn btn-success mr-1" onClick={(e)=>{this.saveBankDetails(e)}}>Save</button>
                  <button type="button" className="btn btn-danger mr-1" onClick={()=>{commonSubmitWithParam(this.props,"getBankDetailsResponse","/rest/getPartnerBankDetails",this.props.partner.partnerId);resetForm(this.bankDetForm);}}>Cancel</button>                  
            </div>
          </FormWithConstraints>
      </div></div> 
    );
  }
}
const mapStateToProps=(state)=>{
  return state.bankDetails;
};
export default connect (mapStateToProps,actionCreators)(BankDetails);