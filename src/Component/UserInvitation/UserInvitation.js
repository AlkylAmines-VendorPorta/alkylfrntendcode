import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./../UserInvitation/Action";
import "./../UserInvitation/user.css";
import { commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation, 
  commonSubmitWithParam } from "../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo} from "../../Util/DataTable";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import { getIFSCDetails } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
class UserInvitation extends Component {
    constructor (props) {
        super(props)
        this.state = {
          isLoading:false,
          loadSaveResp: false,
          loadUserInviteStatus:false,
          partner: {
            partnerId:"",
            vendorSapCode:"",
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
          companyList : [],
          modalVisible: false,
          disableData:true
        }
        this.openModal = this.openModal.bind(this)
    }
  //   emailChangeHandler = (e) =>{
  //     if(!isEmpty(e.target.value)){
  //       if(!e.target.value){

  //         // showAlert(true,"Enter Valid Email Address");
  //         return(<label style={{color:'red'}}>Enter Valid Email Address</label>)
  //       }
  //       else{
  //       let part = this.state.partner;
  //       part.email = e.target.value;
  //       this.setState({
  //         partner: part
  //       });
  //       this.setState({loadUserInviteStatus:true});
  //       commonSubmitFormNoValidation(e,this,"searchResponse","/rest/getSearchResponse/","inviteForm")
  //     }
  //   }
      
  // }
    
    emailChangeHandler = async(e) =>{
      if(!isEmpty(e.target.value)){
        if(!e.target.value){

          // showAlert(true,"Enter Valid Email Address");
          return(<label style={{color:'red'}}>Enter Valid Email Address</label>)
        }
        else{
        let part = this.state.partner;
        part.email = e.target.value;
        this.setState({
          partner: part
        });
        this.setState({loadUserInviteStatus:true});
     commonSubmitFormNoValidation(e,this,"vendorListfromSAP","/rest/getSearchResponse/","inviteForm")
     await delay(250);
        let disablestatus=this.setdisablestatus(this.state.inviteMessage);
        this.setState({
          
          disableData:disablestatus,
        })
      }
    }
      
  }

  openModal() {
    const modalVisible = !this.state.modalVisible;
    this.setState({
      modalVisible,
      loadCompaniList:true
    })
    commonSubmitWithParam(this.props,"viewCompanyListModal","/rest/getVendorByName",this.state.partner.companyName)
  }
    // formResetController=()=>{
    //   this.setState({
    //     partner: {
    //       partnerId:"",
    //       email:"",
    //       companyName:"",
    //       mobileNo:"",
    //       name: "",
    //       firstName:"",
    //       middleName:"",
    //       lastName:""
    //     }        
    //   });

    // }
    formResetController=async()=>{


      this.setState({
        partner: {         
          partnerId:"",
          email:"",
          companyName:"",
          mobileNo:"",
          name: "",
          firstName:"",
          middleName:"",
          lastName:""
        }        
      });
      await delay(250);
        if(this.state.inviteMessage==="Vendor not found in SAP,send new invite"){
        this.setState({
          partner: {
               vendorSapCode:"",
          }
      })}
    }
      changeLoaderState = (action) =>{
        this.setState({
          isLoading:action
        });
      }

      setdisablestatus=(message)=>{
       let messagestatus=""
        if(message==="User Exist in SAP and not in Portal" || message==="" || message==="Vendor not found in SAP,send new invite"){
          messagestatus=false
          
        }else{
          messagestatus=true
        }
                return messagestatus;
      }
      async componentDidMount(event){
        
      }
      async componentWillReceiveProps(props){
          if(!isEmpty(props.loaderState)){
            this.changeLoaderState(props.loaderState);
          }
          // if(!isEmpty(props.isUserInvited) && this.state.loadUserInviteStatus){
          //   this.setState({
          //     loadUserInviteStatus:false,
          //     inviteMessage: props.inviteMessage,
          //     isUserInvited:props.isUserInvited
          //   });
          // }
          if(!isEmpty(props.isUserInvited)){
            this.setState({
              loadUserInviteStatus:false,
              inviteMessage: props.inviteMessage,
              isUserInvited:props.isUserInvited
            });
          }

          if( !isEmpty(props.inviteMessage)){
            let disablestatus=this.setdisablestatus(props.inviteMessage);
            this.setState({             
              inviteMessage: props.inviteMessage,
              disableData:disablestatus,
              isUserInvited:props.isUserInvited
            })
          }

          if(!isEmpty(props.newuserList)){
          
            this.setState({
             
              partner: {
                partnerId:"",
                email:props.newuserList.vendorEmail,
                companyName:props.newuserList.vendorName,
                mobileNo:props.newuserList.vendorMobileNo,
                name: props.newuserList.userName,
                firstName:"",
                middleName:"",
                lastName:""
              },        
              // partner: action.payload.objectMap.user
              isUserInvited:true,
              
            })
          }
          // if(!isEmpty(props.partner) && this.state.loadSaveResp ){
          //   this.changeLoaderState(false);
          //   this.setState({
          //     loadSaveResp:false,
          //     partner: {
          //       partnerId:"",
          //       email:"",
          //       companyName:"",
          //       mobileNo:"",
          //       name: "",
          //       firstName:"",
          //       middleName:"",
          //       lastName:""
          //     },        
          //     // partner: action.payload.objectMap.user
          //     isUserInvited:true,
          //     inviteMessage:""
          //   })
          // }

          if(!isEmpty(props.userList) && this.state.loadCompaniList){
            this.setState({
              loadCompaniList: false,
              companyList: props.userList
            })
          }
        
      }
      onSelectVendorRow = (partner) => {
    
        console.log('onSelectVendorRow',partner)
       };

       vendorCheck=()=>{
        commonSubmitWithParam(this.props,"vendorListfromSAP","/rest/getvendorDataFromSAP",this.state.partner.vendorSapCode);
        this.formResetController()
       }

  render() {
    let styles = this.state.modalVisible
    ? { display: "block" }
    : { display: "none" };
     
    return (


      
      <React.Fragment>
        <Loader isLoading={this.state.isLoading} />
        <div className="userbg">
        <UserDashboardHeader /> 
        <div className="page-content w-50" >
          <div className="wizard-v1-content b-t">
            <div className="wizard-form" style={{boxShadow: "1px 2px 3px",  background: "#fff", padding: "10px", marginTop:"80px"}}>
              <h3 className="text-center">Invitation Details</h3>
              <FormWithConstraints  ref={formWithConstraints => this.inviteForm = formWithConstraints} 
               onSubmit={(e)=> { this.setState({loadSaveResp:true,partner:{test:""}});
              //  this.changeLoaderState(true);
                commonSubmitForm(e,this,"inviteResponse","/rest/register", "inviteForm")}} noValidate
                >
              <input type="hidden" name='partner[userId]'
              value={this.state.partner.partnerId} 
              />
          
              <label style={{color:'red'}}>{this.state.inviteMessage}</label>
              {/* <div className="row">
                <label className="col-sm-3">Company Name<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={"form-control"} name="partner[name]" 
                  value={this.state.partner.companyName} required
                  onChange={(event)=>{
                    if(event.target.value.length < 60){
                      commonHandleChange(event,this,"partner.companyName", "inviteForm")
                    }
                  }} 
                  />
                  <FieldFeedbacks for="partner[name]">
                  <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
                <div className="col-sm-3"><button className="btn btn-info blueButton" data-toggle="modal" data-target="#companyListModal"
                  onClick={(e)=>{this.setState({loadCompaniList:true});commonSubmitWithParam(this.props,"viewCompanyListModal","/rest/getVendorByName",this.state.partner.companyName)}}
                 type="button">Search Company</button></div> 
            </div> */}
              
              <div className="row">
                <label className="col-sm-3">Vendor Code
                </label>
                <div className="col-sm-6">
                <input type="number" className={"form-control"} name="partner[vendorSapCode]" 
                  value={this.state.partner.vendorSapCode}
                  // required
                  onBlur={this.vendorCheck.bind(this)}
                  onChange={(event)=>{
                    if(event.target.value.length < 60){
                      commonHandleChange(event,this,"partner.vendorSapCode", "inviteForm")
                    }
                   
                  }} 

                  
                  
                  /*onBlur={this.openModal}*/ />
                  {/* <FieldFeedbacks for="partner[vendorSapCode]">
                  <FieldFeedback when="*"></FieldFeedback>
                  <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{6}$/.test(value)}>Enter Valid Number</FieldFeedback>
                  </FieldFeedbacks> */}
                </div>
                {/* <div className="col-sm-3"><button className="btn btn-info blueButton"
                  onClick={(e)=>{ commonSubmitWithParam(this.props,"vendorListfromSAP","/rest/getvendorDataFromSAP",this.state.partner.vendorSapCode);this.formResetController()}}
                 type="button">Search</button></div>  */}
            </div>
            <br/>
          {this.state.inviteMessage==="User Exist in SAP and Portal"?
              <div className="row mt-4">
                <label className="col-sm-3">Email Id<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={"form-control"} required name="email" value={this.state.partner.email} 
                onChange={(event)=>{commonHandleChange(event,this,"partner.email", "inviteForm")}}
                onBlur={this.emailChangeHandler.bind(this)} disabled={this.state.disableData}
                />
                </div>
                
            </div>:
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
         </div>}
         <br/>
            
            <div className="row">
                <label className="col-sm-3">Company Name<span className="redspan">*</span></label>
                <div className="col-sm-6">
                <input type="text" className={"form-control"} name="partner[name]" disabled={this.state.disableData}
                value={this.state.partner.companyName} required
                onChange={(event)=>{commonHandleChange(event,this,"partner.companyName" , "inviteForm")}}/>
                <FieldFeedbacks for="partner[name]">
                  <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
            </div>
            <br/>
            <div className="row">
                <label className="col-sm-3">Mobile No<span className="redspan">*</span></label>
                <div className="col-sm-6">
                {/* <input type="text" className={this.state.isUserInvited?"form-control not-allowed ":"form-control"} name="userDetails[mobileNo]"  disabled={this.state.isUserInvited} */}
                <input type="text" className={"form-control"} name="userDetails[mobileNo]"  disabled={this.state.disableData}
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
                {/* <input type="text" className={this.state.isUserInvited?"form-control not-allowed ":"form-control"} name="userDetails[name]" disabled={this.state.isUserInvited} */}
                <input type="text" className={"form-control"} name="userDetails[name]" disabled={this.state.disableData}
                value={this.state.partner.name} required
                onChange={(event)=>{commonHandleChange(event,this,"partner.name" , "inviteForm")}}/>
                <FieldFeedbacks for="userDetails[name]">
                  <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
            </div>
            {/* <br/>
            <div className="row">
                <label className="col-sm-3">Middle Name</label>
                <div className="col-sm-6">
                <input type="text" className="form-control" name="userDetails[middleName]"
                value={this.state.partner.middleName} 
                onChange={(event)=>{commonHandleChange(event,this,"partner.middleName")}}/>
                </div>
            </div>
            <br/>
            <div className="row">
                <label className="col-sm-3">Last Name</label>
                <div className="col-sm-6">
                <input type="text" className="form-control" name="userDetails[lastName]"
                value={this.state.partner.lastName} 
                onChange={(event)=>{commonHandleChange(event,this,"partner.lastName")}}/>
                </div>
            </div> */}
            <br/>
            <div className="row">
                
                <div className="col-sm-12 text-center">
                {/* <button type="submit" className={this.state.isUserInvited?"btn btn-success not-allowed ":"btn btn-success"} disabled={this.state.isUserInvited}> */}
                    <button type="submit" className={this.state.disableData?"btn btn-success not-allowed ":"btn btn-success"} disabled={this.state.disableData}>
                      Send Invitation
                    </button>
                </div>
            </div>
            </FormWithConstraints>
            </div>
          </div>
        </div>
        </div>
        <div className="modal companyViewModal" id="companyListModal" /*style={styles}*/ >
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Vendor Details</h4>
                            <button type="button" class="close" data-dismiss="modal" /* onClick={this.openModal} */ >&times;</button>
                        </div>
                        <div class={"modal-body"} >
                          <div className="row">
                          <div className="col-sm-8"></div>
                          <div className="col-sm-4">
                          
                          <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." /> 
                          </div>
                          </div>
                          <div class="row">
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
                                        <tr onClick={(e)=>this.onSelectVendorRow("selectedVendor"+index,vendor.partner)} 
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
            </div>
      </React.Fragment>
    );
  }
}


const mapStateToProps=(state)=>{
    
    return state.userInvitation;
  };
  export default connect (mapStateToProps,actionCreators)(UserInvitation);