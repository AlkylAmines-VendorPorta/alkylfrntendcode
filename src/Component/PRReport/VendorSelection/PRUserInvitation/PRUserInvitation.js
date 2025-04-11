import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEmpty} from "../../../../Util/validationUtil";
import * as actionCreators from "./Action/Action";
import "./pruser.css";
import { commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation, 
  commonSubmitWithParam } from "../../../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import { searchTableData} from "../../../../Util/DataTable";
class PRUserInvitation extends Component {
    constructor (props) {
        super(props)
        this.state = {
          loadSaveResp: false,
          loadUserInviteStatus:false,
          partner: {
            partnerId:"",
            email:"",
            companyName:"",
            mobileNo:"",
            name: "",
            firstName:"",
            middleName:"",
            lastName:""
          },
          partnerList: [],
          isUserInvited:true,
          inviteMessage:"",
          companyList : []
        }
    }

    onSelectVendorRow = (partner) => {
    
     console.log('onSelectVendorRow',partner)
    };
    
    emailChangeHandler = (e) =>{
      if(!isEmpty(e.target.value)){
        if(!e.target.value){
          return(<label style={{color:'red'}}>Enter Valid Email Address</label>)
        }
        else{
        let part = this.state.partner;
        part.email = e.target.value;
        this.setState({
          partner: part
        });
        this.setState({loadUserInviteStatus:true});
        commonSubmitFormNoValidation(e,this,"searchResponse","/rest/getSearchResponse/","inviteForm")
      }
    }
      
  }
      async componentWillReceiveProps(props){
        
          if(!isEmpty(props.isUserInvited) && this.state.loadUserInviteStatus){
            this.props.changeLoaderState(false);
            this.setState({
              loadUserInviteStatus:false,
              inviteMessage: props.inviteMessage,
              isUserInvited:props.isUserInvited
            });
          }

          if(!isEmpty(props.partner) && this.state.loadSaveResp ){
            this.props.changeLoaderState(false);
            this.props.getInvitedVendorUserData(props.partner);
            this.setState({
              loadSaveResp:false,
              partner: {
                partnerId:"",
                email:"",
                companyName:"",
                mobileNo:"",
                name: "",
                firstName:"",
                middleName:"",
                lastName:""
              },        
              // partner: action.payload.objectMap.user
              isUserInvited:true,
              inviteMessage:""
            })
          }

          if(!isEmpty(props.userList) && this.state.loadCompaniList){
            this.props.changeLoaderState(false);
            this.setState({
              loadCompaniList: false,
              companyList: props.userList
            })
          }
        
      }

  render() {
    return (
      <>
        <div class="row">
          <div class="col-12">
          <FormWithConstraints  ref={formWithConstraints => this.inviteForm = formWithConstraints} 
               onSubmit={(e)=> { this.props.changeLoaderState(true); this.setState({loadSaveResp:true}); commonSubmitForm(e,this,"inviteResponse","/rest/register", "inviteForm")}} noValidate>
              <input type="hidden" name='partner[userId]'
              value={this.state.partner.partnerId} 
              />
          
              <label style={{color:'red'}}>{this.state.inviteMessage}</label>
            
              <div className="row mt-4">
                <label className="col-sm-3">Email Id<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className="form-control" required name="email" value={this.state.partner.email} 
                onChange={(event)=>{commonHandleChange(event,this,"partner.email", "inviteForm")}}
                onBlur={this.emailChangeHandler.bind(this)} />
                <FieldFeedbacks for="email">
                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                    <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address.</FieldFeedback>
                </FieldFeedbacks> 
                </div>
                
            </div>
            <br/>
            <div className="row">
                <label className="col-sm-3">Company Name<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={this.state.isUserInvited?"form-control not-allowed ":"form-control"} name="partner[name]" disabled={this.state.isUserInvited}
                  value={this.state.partner.companyName} required
                  onChange={(event)=>{commonHandleChange(event,this,"partner.companyName", "inviteForm")}} />
                  <FieldFeedbacks for="partner[name]">
                  <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
                <div className="col-sm-3"><button className="btn btn-info blueButton" data-toggle="modal" data-target="#companyListModal"
                  onClick={(e)=>{this.setState({loadCompaniList:true});commonSubmitWithParam(this.props,"viewCompanyListModal","/rest/getVendorByName",this.state.partner.companyName)}}
                 type="button">Search Company</button></div> 
            </div>
            <br/>
            <div className="row">
                <label className="col-sm-3">Mobile No<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={this.state.isUserInvited?"form-control not-allowed ":"form-control"} name="userDetails[mobileNo]"  disabled={this.state.isUserInvited}
                  value={this.state.partner.mobileNo} required
                  onChange={(event)=>{commonHandleChange(event,this,"partner.mobileNo", "inviteForm")}}/>
                  <FieldFeedbacks for="userDetails[mobileNo]">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)}>Number Should be 10 digits</FieldFeedback>
                    </FieldFeedbacks>
                </div>
            </div>
            <br/>
            <div className="row">
                <label className="col-sm-3">Name<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={this.state.isUserInvited?"form-control not-allowed ":"form-control"} name="userDetails[name]" disabled={this.state.isUserInvited}
                value={this.state.partner.name} required
                onChange={(event)=>{commonHandleChange(event,this,"partner.name" , "inviteForm")}}/>
                <FieldFeedbacks for="userDetails[name]">
                  <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
            </div>
            <br/>
            <div className="row">
                
                <div className="col-sm-12 text-center">
                    <button type="submit" className={this.state.isUserInvited?"btn btn-success not-allowed ":"btn btn-success"} disabled={this.state.isUserInvited}>
                      Send Invitation
                    </button>

                </div>
            </div>
            </FormWithConstraints>
          </div>
        </div>
        <div className="modal companyViewModal" id="companyListModal" >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Vendor Details</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body"} >
                          <div className="row">
                          <div className="col-sm-8"></div>
                          <div className="col-sm-4">
                          
                          <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." /> 
                          </div>
                          </div>
                                <div className="col-sm-12 mt-2">
                                <table class="my-table">
                                  <thead>
                                    <tr>
                                      <th>Person Name </th>
                                      <th>Mobile No</th>
                                      <th>Mail ID</th>
                                      <th>Company Name</th>
                                      <th>Invited By</th>
                                      <th>Department</th>
                                      <th>Designation</th>
                                    </tr>
                                  </thead>
                                  <tbody id="DataTableBody">
                                    {
                                      (this.state.companyList).map((vendor,index)=>
                                        <tr onClick={(e)=>this.onSelectVendorRow(vendor.partner)} 
                                        className={this.state["selectedVendor"+index]} >
                                          <td> {vendor.userDetails.name} </td>
                                          <td> {vendor.userDetails.mobileNo} </td>
                                          <td> {vendor.email} </td>
                                          <td> {vendor.partner.name} </td>
                                          <td> {vendor.createdBy.name} </td>
                                          <td> {vendor.createdBy.userDetails.userDept} </td>
                                          <td> {vendor.createdBy.userDetails.userDesignation} </td>
                                        </tr>
                                      )
                                    }
                                </tbody>
                                </table>
                                <div className="clearfix"></div>
                              </div>
                              </div>
                        </div>  
                </div>
            </div>
      </>
    );
  }
}

const mapStateToProps=(state)=>{
    return state.prUserInvitation;
  };
export default connect (mapStateToProps,actionCreators)(PRUserInvitation);