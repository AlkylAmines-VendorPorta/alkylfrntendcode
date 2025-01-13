import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import {formatDateWithoutTime} from "../../Util/DateUtil"
import { isEmpty } from "../../Util/validationUtil";
import { searchTableDataInternalUser } from "../../Util/DataTable";
import { connect } from 'react-redux';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import {
  commonSubmitForm, commonHandleChange, commonSubmitWithParam,
  commonHandleChangeCheckBox, getObjectFromPath, commonSubmitFormNoValidation, commonSetState,
  getSerializedForm,commonSubmitListOfDto
} from "../../Util/ActionUtil"; 
import * as actionCreators from "./Action";
import Loader from "../FormElement/Loader/LoaderWithProps";
import serialize from "form-serialize";
//import { defaultTheme } from 'react-select';
import { isArray } from "lodash-es";
//const { colors } = defaultTheme;

const selectStyles = {
  control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};
class InternalUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading:false,
      internalUserDetails: {
        role: "",
        plant: "",
        designation: "",
        department: "",
        emailid: "",
        empcode: "",
        name: "",
        mobileNo:"",
        activeFrom:"",
        activeTill:"",
        costCentre:"",
        approver:"",
        personalMail:"",
        personalContactNo :"",
        approverUser: {},
        sapId:"",
        approverId:"",
        approverName:""
      },
      sapCostCenterList:[],
	  approverUserList:[],
      internalUserList:[],
      costCenterList:[],
      roleList: [],
      plantList: [],
      plantMap : [],
      internalUsersList: [],
      updateFlag:false,
      userId:"",
      userDetailsId:"",
      userRolesId:"",
      readOnlyFlag:false,
      newRolesList:[
        {
            roleId:"",
            isDefault:true
        }
      ],
      updateRolesList:[
        {
            userRolesId:"",
            user:{
              userId:""
            },
            role:{
              roleId:""
            },
            isDefault:""
        }
      ],
    loadUserRoleList:false,
    loadDeleteRole:false,
    deleteIndex:"",
    loadInternalUsersList:false,
    loadPlantList:false,
    loadRoleList:false
    }
  }

 state = { isOpen: false, value: undefined };
  toggleOpen = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };
  onSelectChange = value => {
    this.toggleOpen();
    this.setState({ value });
  };

  onSapIDChange = (approverId) => {
      let approverIdNo = approverId.target.value;
      let approverName = "";
      for (var i = 0; i < this.state.approverUserList.length; i++) {
        if(this.state.approverUserList[i].userId == approverIdNo){
          approverName = this.state.approverUserList[i].username;
        }
      }

      this.setState({
        internalUserDetails:{
          approverName: approverName
        }
      })
  };

  async componentDidMount() {
    commonSubmitWithParam(this.props, "showInternalUsers", "/rest/getInternalUsersList");
    {/*commonSubmitWithParam(this.props, "populateCostcentreList", "/rest/getCostcentreList",1820);*/}
    this.changeLoaderState(true);
    this.setState({
      loadInternalUsersList:true,
      loadPlantList:true,
      loadRoleList:true,
      updateFlag:false,
      readOnlyFlag:false
    })

  }

  changeLoaderState=(action)=>{
    this.setState({isLoading:action});
  }

  showUserDetails = () => {
    this.setState({
      hidden: !this.state.hidden,
      shown: !this.state.shown,
      updateFlag:false,
      readOnlyFlag:false
    })

    this.setState({
      loadPlantList:true,
      loadRoleList:true
    })
    commonSubmitWithParam(this.props,"populateInternalUserDropDown", "/rest/getInternalUserDropDown");
  }

  loadUser=(fetchuser)=>{
    let userRole = fetchuser.role.roleId;
    let userPlant=fetchuser.user.userDetails.plant;
    let userdesignation=fetchuser.user.userDetails.userDesignation;
    let userDepartment=fetchuser.user.userDetails.department;
    let userEmailId=fetchuser.user.email;
    let userEmpCode=fetchuser.user.userName;
    let userName=fetchuser.user.userDetails.name;
    let userMobileNo=fetchuser.user.userDetails.mobileNo;
    let dateactiveFrom=formatDateWithoutTime(fetchuser.user.userDetails.activeFrom);
    let dateactiveTill=formatDateWithoutTime(fetchuser.user.userDetails.activeTill);
    let userApprover=fetchuser.user.userDetails.approver;
    let userCostCentre=fetchuser.user.userDetails.costCentre;
    let approverId=fetchuser.user.userDetails.approverId;
    let sapId=fetchuser.user.userDetails.sapId;

    this.setState({
      hidden: !this.state.hidden,
      shown: !this.state.shown,
    })
    this.setState({
      internalUserDetails:{
               role:userRole,
               plant:userPlant ,
               designation:userdesignation,
               department:userDepartment ,
               emailid:userEmailId ,
               empcode: userEmpCode,
               name:userName,
               mobileNo:userMobileNo,
               activeFrom:dateactiveFrom,
               activeTill:dateactiveTill,
               approver:userApprover,
               costCentre:userCostCentre,
               personalMail:fetchuser.user.userDetails.personalMail,
               personalContactNo :fetchuser.user.userDetails.personalContactNo,
               approverUser: fetchuser.user.userDetails.approverUser || {},
               approverId:approverId,
               sapId:sapId
      },
      newRolesList:[
        {
            roleId:"",
            isDefault:false
        }
    ],
    updateRolesList:[
      {
          userRolesId:"",
          user:{
            userId:""
          },
          role:{
            roleId:""
          },
          isDefault:""
      }
    ],
      updateFlag:true,
      userId:fetchuser.user.userId,
      userDetailsId:fetchuser.user.userDetails.userDetailsId,
      userRolesId:fetchuser.userRolesId,
      readOnlyFlag:true,
    })
  }
 // updateUserDetails=(userId)=>{
   // for()
 // }
  // updateRole

  updateAddOtherNewRoles=()=>{
    let currNewRolesList = this.state.updateRolesList;
    let newRolesArray = [
    this.getEmptyUpdateNewRolesObj()
    ];
    newRolesArray = currNewRolesList.concat(newRolesArray);
    this.setState({
      updateRolesList: newRolesArray,
    });
  }

  updateRemoveOtherNewRoles(userRolesId,i) {
  if(!isEmpty(userRolesId)){  
    commonSubmitWithParam(this.props, "deleteUserRoles", "/rest/deleteUserRoles",userRolesId);
  }else{
    let otherNewRolesList = this.state.updateRolesList;
    otherNewRolesList.splice(i, 1);
    this.setState({
      updateRolesList: otherNewRolesList 
    });
  }
    
    this.setState({ 
      loadDeleteRole:true,
      deleteIndex:i
    });
  }

  // updateRole

  addOtherNewRoles() {
    let currNewRolesList = this.state.newRolesList;
    let newRolesArray = [
    this.getEmptyNewRolesObj()
    ];
    newRolesArray = currNewRolesList.concat(newRolesArray);
    this.setState({
        newRolesList: newRolesArray,
    });
  }

  removeOtherNewRoles(i) {
      let otherNewRolesList = this.state.newRolesList;
      otherNewRolesList.splice(i, 1);
      this.setState({ newRolesList: otherNewRolesList });
  }

  getEmptyNewRolesObj=()=>{
      return {
          roleId:"",
          isDefault:false
      }
  }

  getEmptyUpdateNewRolesObj=()=>{
      return {
        userRolesId:"",
        user:{
          userId:""
        },
        role:{
          roleId:""
        },
        isDefault:"N"
    }
  }

  async componentWillReceiveProps(props) {
    
    if(!isEmpty(props.loaderState)){
      this.changeLoaderState(props.loaderState);
    }

    if (!isEmpty(props.roleList) && this.state.loadRoleList) {
      this.changeLoaderState(false);
      
      let roleArray = Object.keys(props.roleList).map((key) => {
        return { display: props.roleList[key].name, value:props.roleList[key].roleId };

      });
      this.setState({
        roleList: roleArray,
        loadRoleList:false
      })
    }
    // else{
    //   this.changeLoaderState(false);
    // }

    if (!isEmpty(props.internalUserList)) {
      this.changeLoaderState(false);
      this.setState({
        internalUserList: props.internalUserList
      })

      let apprUser = [];
      for (var i = 0; i < props.internalUserList.length; i++) {
        let user = {};
        user.userId = props.internalUserList[i].userName;
        user.username = props.internalUserList[i].name;
        apprUser.push(user);
      }

      this.setState({
        approverUserList: apprUser
      })
    }

  {/* if (!isEmpty(props.sapCostCenterList)) {
      this.changeLoaderState(false);
      let sapcostArray = Object.keys(props.sapCostCenterList).map((key) => {
        return { display: props.sapCostCenterList[key], value: key }
      });
      this.setState({
        sapCostCenterList: sapcostArray
      })
    }*/}


    if (!isEmpty(props.costCenterList)) {
      this.changeLoaderState(false);
      let costArray = Object.keys(props.costCenterList).map((key) => {
        return { display: props.costCenterList[key], value: key }
      });
      this.setState({
        costCenterList: costArray
      })
    }

    if (!isEmpty(props.plantList) && this.state.loadPlantList) {
      this.changeLoaderState(false);
      let plantArray = Object.keys(props.plantList).map((key) => {
        return { display: props.plantList[key], value: key }
      });
      this.setState({
        plantList: plantArray,
        plantMap: props.plantList,
        loadPlantList:false
      })
    }
    // else{
    //   this.changeLoaderState(false);
    // }
    if (!isEmpty(props.internalUsersList) && this.state.loadInternalUsersList) {
      this.changeLoaderState(false);
      
      this.setState({
        internalUsersList: props.internalUsersList,
        loadInternalUsersList:false
      })
    }
    // else{
    //   this.changeLoaderState(false);
    // }
    
    if(this.state.loadUserRoleList && !isEmpty(props.userRolesList)){
      this.setState({
        updateRolesList:props.userRolesList,
        loadUserRoleList:false
      })
    }

    if(!isEmpty(props.isRoleDeleted) && this.state.loadDeleteRole && props.isRoleDeleted===true){
      let otherNewRolesList = this.state.updateRolesList;
      otherNewRolesList.splice(this.state.deleteIndex, 1);
      this.setState({
        loadDeleteRole:false,
        updateRolesList:otherNewRolesList
      })
    }

  }

  updateRolesList=(event)=>{
    event.preventDefault();    
    const form = event.currentTarget.form;
    const data = this.getSerializedForm(form);
    
    commonSubmitListOfDto(data.userRolesDto,this,"updateUserRoles","/rest/updateUserRole");
  }
  getSerializedForm=(form)=>{
    return serialize(form, {
        hash: true,
        empty: true
    });
  }

  setDefaultRole=(si)=>{
    let temp=[...this.state.updateRolesList]
    temp.map((el,i)=>{
      if(i===si){
        el.isDefault="Y";
      }else{
        el.isDefault="N";
      }
    })
    this.setState({
      updateRolesList:temp
    })
  }

  handleInternalUser = (e) => {
    commonSubmitForm(e, this, "saveInternalUserDetailsResponse",this.state.updateFlag?"/rest/updateInternalUser":"/rest/saveIternalUser","internalUserForm");
  }

  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    var hidden = {
      display: this.state.hidden ? "none" : "block"
    };
  const { isOpen, value } = this.state;
    return (
      <React.Fragment>
        <Loader isLoading={this.state.isLoading} />
        <UserDashboardHeader />
        <div className="w-100" id="togglesidebar">
          <div className="mt-100 boxContent" >
            <div className="row" style={hidden}>
            <div className="col-sm-9"></div>
            <div className="col-sm-3"> 
            <input type="text" id="SearchTableDataInputInternalUser" className="form-control" onKeyUp={searchTableDataInternalUser} placeholder="Search .." />
            </div>
              <div className="col-sm-12 mt-2 text-right">
                <button onClick={this.showUserDetails} className="btn btn-primary">New User</button>
              </div>
              <div className="col-sm-12 mt-2">
                <table className="table table-bordered">
                  <thead className="thead-light">
                    <tr >
                      <th>Role</th>
                      <th>Plant</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Email Id</th>
                      <th>Employee Code</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody id="DataTableBodyInternalUser">
                    {
                    
                      this.state.internalUsersList.map((internalUser, index) =>
                      
                        <tr onClick={(e)=>{this.loadUser(internalUser,index)}}>
                          <td>{internalUser.role.name}</td>
                          <td>{internalUser.user.userDetails!=null?this.state.plantMap[internalUser.user.userDetails.plant]:""}</td>
                          <td>{internalUser.user.userDetails!=null?internalUser.user.userDetails.userDesignation:""}</td>
                          <td>{internalUser.user.userDetails!=null?internalUser.user.userDetails.department:""}</td>
                          {/* <td>{this.state.plantMap[internalUser.user.userDetails.plant]}</td>
                          <td>{internalUser.user.userDetails.userDesignation}</td>
                          <td>{internalUser.user.userDetails.department}</td> */}
                          <td>{internalUser.user.email}</td>
                          <td>{internalUser.user.userName}</td>
                          {/* <td>{internalUser.user.userDetails.name}</td> */}
                          <td>{internalUser.user.userDetails!=null?internalUser.user.userDetails.name:""}</td>
                        </tr>
                      )
                    }

                  </tbody>
                </table>
              </div>
            </div>
            <div className="row" style={shown}>
              <form>
                <FormWithConstraints ref={formWithConstraints => this.internalUserForm = formWithConstraints}
                onSubmit={this.handleInternalUser}>
                  <input type="hidden" disabled={this.state.updateFlag?false:true} name="user[userId]" value={this.state.userId}/>
                  <input type="hidden" disabled={this.state.updateFlag?false:true} name="user[userDetails][userDetailsId]" value={this.state.userDetailsId}/>
                  <input type="hidden" disabled={this.state.updateFlag?false:true} name="userRolesId" value={this.state.userRolesId}/>
                  <div className="col-sm-12 mt-2">
                    
                  <div className="row mt-2">

                    <label className="col-sm-2">Employee Code <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input type="text" className={ this.state.readOnlyFlag?"form-control readonly":"form-control"} value={this.state.internalUserDetails.empcode} name="user[userName]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.empcode","internalUserForm") }} />
                      </div>
                      <FieldFeedbacks for="user[userName]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>

                      <label className="col-sm-2">Name <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.name} name="user[userDetails][name]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.name","internalUserForm") }} />
                      </div>
                      <FieldFeedbacks for="user[userDetails][name]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>

                    </div>
              
                    {/*<div className="row mt-2">*/}
                    {/*                      
                      <label className="col-sm-2">Designation <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.designation} name="user[userDetails][userDesignation]"  required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.designation","internalUserForm") }} />
                      <FieldFeedbacks for="user[userDetails][userDesignation]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>
                      </div>
                   */}
                    {/*
                      <Dropdown isOpen={isOpen} onClose={this.toggleOpen}
                        target={
                          <Button iconAfter={<ChevronDown />}
                            onClick={this.toggleOpen} isSelected={isOpen}
                          >
                            {value ? `Approver: ${value.label}` : 'Select a Approver'}
                          </Button>
                        }
                      >
                      <Select
                        autoFocus backspaceRemovesValue={false}
                        components={{ DropdownIndicator, IndicatorSeparator: null }}
                        controlShouldRenderValue={false} hideSelectedOptions={false}
                        isClearable={false} menuIsOpen onChange={this.onSelectChange}
                        options={this.state.approverUserList} placeholder="Search..."
                        styles={selectStyles} tabSelectsValue={false} value={value}
                      />
                      </Dropdown>
                      */}
              {/*</div>*/}
              <div className="row mt-2">
                      <label className="col-sm-2">Department <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.department} name="user[userDetails][department]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.department","internalUserForm") }} />
                      </div>
                      <FieldFeedbacks for="user[userDetails][department]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>
            <label className="col-sm-2">Location <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <select className="form-control" 
                        value={this.state.internalUserDetails.plant} 
                        required
                          name="user[userDetails][plant]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.plant","internalUserForm") }}
                        >
                          <option value="">Select</option>
                          {(this.state.plantList).map(plant =>
                            <option value={plant.value}>{plant.display}</option>
                          )}
                        </select>
                        <FieldFeedbacks for="user[userDetails][plant]">
                          <FieldFeedback when="*"></FieldFeedback>
                        </FieldFeedbacks>
                      </div>
                    </div>

                          
					{/*
                    <div className="row mt-2">

                       <label className="col-sm-2">Location <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <select className="form-control" value={this.state.internalUserDetails.plant} required
                          name="user[userDetails][plant]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.plant","internalUserForm") }}
                        >
                          <option value="">Select</option>
                          {(this.state.plantList).map(plant =>
                            <option value={plant.value}>{plant.display}</option>
                          )}
                        </select>
                        <FieldFeedbacks for="user[userDetails][plant]">
                          <FieldFeedback when="*"></FieldFeedback>
                        </FieldFeedbacks>
                      </div>
                    </div>
						*/}
                    <div className="row mt-2">
                    <label className="col-sm-2">Approver </label>
                      <div className="col-sm-3">
                      <input className="form-control" type="text"  value={this.state.internalUserDetails.approverId} name="user[userDetails][approverId]" required
                          onChange={this.onSapIDChange} />

                        {/*
                        <select className="form-control" value={this.state.internalUserDetails.approverUser ? this.state.internalUserDetails.approverUser.userId:null} 
                          name="user[userDetails][approverUser][userId]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.approverUser.userId","internalUserForm") }}
                        >
                          <option value="">Select</option>
                          {isArray(this.state.internalUserList) && this.state.internalUserList.map(item =>
                            <option value={item.userId}>{item.userId} - {`${item.userName}${item.name ? `-${item.name}`:''}`}</option>
                          )}
                        </select>
                      */}
                      </div>
                      <label className="col-sm-2">{this.state.internalUserDetails.approverName} </label>   
                      {/* <label className="col-sm-2">Approver </label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.approver} name="user[userDetails][approver]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.approver","internalUserForm") }} />
                      </div> */}
                      {/* <label className="col-sm-2">Cost Centre </label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.costCentre} name="user[userDetails][costCentre]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.costCentre","internalUserForm") }} />
                      </div> */}
                    </div>   
                    <div className="row mt-2">
                      <label className="col-sm-2">Cost Centre</label>
                      <div className="col-sm-3">
                        <select className="form-control" value={this.state.internalUserDetails.costCentre} 
                          name="user[userDetails][costCentre]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.costCentre","internalUserForm") }}
                        >
                          <option value="">Select</option>
                          {(this.state.costCenterList).map(item =>
                            <option value={item.value}>{item.value} - {item.display}</option>
                          )}
                        </select>
                      </div>
                      <label className="col-sm-2">SAP ID <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input className="form-control" type="text"  value={this.state.internalUserDetails.sapId} name="user[userDetails][sapId]" required
                          onChange={this.onSapIDChange} />
                      </div>
                      <FieldFeedbacks for="user[userDetails][sapId]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>
                    </div>
                    <div className="row mt-2">
                      <label className="col-sm-2">Work Email Id <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                      <input type="text"  className="form-control" value={this.state.internalUserDetails.emailid} name="user[userDetails][email]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.emailid","internalUserForm") }} />

                        <input type="hidden"  value={this.state.internalUserDetails.emailid} name="user[email]" />
                        <FieldFeedbacks for="user[userDetails][email]">
                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                    <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address.</FieldFeedback>
                </FieldFeedbacks> 

                      </div>

                      <label className="col-sm-2">Personal Email Id</label>
                      <div className="col-sm-3">
                      <input type="text"  className="form-control" value={this.state.internalUserDetails.personalMail} name="user[userDetails][personalMail]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.personalMail","internalUserForm") }} />

                        <input type="hidden"  value={this.state.internalUserDetails.personalMail} name="user[personalMail]" />
             
                      </div>
                     
                    </div>
              
                    <div className="row mt-2">
                    <label className="col-sm-2">Work Contact No </label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.mobileNo} name="user[userDetails][mobileNo]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.mobileNo","internalUserForm") }} />
                      </div>

                      <label className="col-sm-2">Personal Contact No </label>
                      <div className="col-sm-3">
                        <input type="text" className="form-control" value={this.state.internalUserDetails.personalContactNo} name="user[userDetails][personalContactNo]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.personalContactNo","internalUserForm") }} />
                      </div>
                    </div>
           
                    <div className="row mt-2">
                      <label className="col-sm-2">Active From </label>
                      <div className="col-sm-3">
                        <input type="date" className="form-control" value={this.state.internalUserDetails.activeFrom} name="user[userDetails][activeFrom]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.activeFrom","internalUserForm") }} />
                      </div>
                      <label className="col-sm-2">Active Till </label>
                      <div className="col-sm-3">
                        <input type="date" className="form-control" value={this.state.internalUserDetails.activeTill} name="user[userDetails][activeTill]" required
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.activeTill","internalUserForm") }} />
                      </div>
                    </div>

                          
                    <div className="row mt-2">

                      <label className="col-sm-2">Role <span className="redspan">*</span></label>
                      <div className="col-sm-3">
                      {this.state.updateFlag?
                        <button className={"btn btn-sm btn-outline-primary mgt-10 "+ this.props.readonly}
                          onClick={()=>{ commonSubmitWithParam(this.props, "getUserRoles", "/rest/getUserRoles",this.state.userId);
                          this.setState({loadUserRoleList:true});}} type="button" data-toggle="modal" data-target="#updateRoleModal"><i className="fa fa-check" />
                          &nbsp;Select Role
                        </button>
                      :
                        <button className={"btn btn-sm btn-outline-primary mgt-10 "+ this.props.readonly}
                        type="button" data-toggle="modal" data-target="#roleModal"><i className="fa fa-check" />
                        &nbsp;Select Role
                        </button>
                      }
                        {/* <select className="form-control" value={this.state.internalUserDetails.role} required
                          name="role[roleId]"
                          onChange={(event) => { commonHandleChange(event, this, "internalUserDetails.role","internalUserForm") }}
                        >
                          <option value="">Select</option>
                          {(this.state.roleList).map(role =>
                            <option value={role.value}>{role.display}</option>
                          )}
                        </select>
                        <FieldFeedbacks for="role[roleId]">
                      <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks> */}
                      </div>

                    </div>

                    <div className="col-sm-12 text-center">
                      <button type="submit" className="btn btn-success">Save</button>
                      <button type="button" className="btn btn-danger ml-2" onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden});}}>Cancel</button>
                    </div>
                  </div>
                  <div className="modal roleModal" id="roleModal" >
            <div className="modal-dialog modal-md mt-100">
              <div className="modal-content">
                <div className="modal-header">
                  Select Roles
                  <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal">
                  &times;
                </button>
                </div>
                <div className={"modal-body "+ this.props.readonly}>
                <div className="lineItemDiv min-height-0px">
                              <div className="row mt-1 px-4 py-1">
                                  <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                      <label>Default</label>
                                  </div>
                                  <div className="col-8 mb-1 border_bottom_1_e0e0e0">
                                      <label>Roles</label>
                                  </div>
                                  <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                      <label>Action</label>
                                  </div>
                              </div>
                              <div className="row mt-1 px-4 py-1 max-h-500px">
                              {this.state.newRolesList.map((el, i) => (
                                  <>
                                  <input 
                                    type="hidden" 
                                    disabled={!el.isDefault}
                                    name={"roleList["+i+"][isDefault]"}
                                    value="Y"
                                  />
                                      <div className="col-2">
                                        <div className="form-group">
                                            <input type="radio"
                                              className={"form-control " + this.props.readonly}
                                              name={"isDefaultRole"}
                                              onChange={(event) => {
                                                commonHandleChangeCheckBox(event, this, "newRolesList."+i+".isDefault");
                                              }}
                                              checked
                                            />
                                        </div>
                                    </div>
                                      <div className="col-8">
                                          <select className={"form-control " + this.props.readonly} 
                                            value={el.roleId}
                                            name={"roleList["+i+"][roleId]"}
                                            onChange={(event) =>commonHandleChange(event,this,"newRolesList."+i+".roleId")
                                            }
                                          >
                                              <option value="">Select</option>
                                              {(this.state.roleList).map(role =>
                                                <option value={role.value}>{role.display}</option>
                                              )}
                                          </select>
                                      </div>
                                      <div className="col-2">
                                          <button
                                              className={
                                                  "btn " +
                                                  (i === 0
                                                      ? "btn-outline-success"
                                                      : "btn-outline-danger")
                                              }
                                              onClick={() => {
                                                  i === 0
                                                      ? this.addOtherNewRoles()
                                                      : this.removeOtherNewRoles("" + i + "");
                                              }}
                                              type="button"
                                          >
                                              <i
                                                  class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                                  aria-hidden="true"
                                              ></i>
                                          </button>
                                      </div>
                                      </>
                                  ))}
                              </div>
                              </div>
                      </div>
                </div>
                </div>
                </div>

                {/* Update Role Modal */}
                <FormWithConstraints>
                <div className="modal roleModal" id="updateRoleModal" >
                  <div className="modal-dialog modal-md mt-100">
                    <div className="modal-content">
                      <div className="modal-header">
                        Select Roles
                        <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal">
                        &times;
                      </button>
                      </div>
                      <div className={"modal-body "+ this.props.readonly}>
                      <div className="lineItemDiv min-height-0px">
                        <div className="row mt-1 px-4 py-1">
                            <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                <label>Default</label>
                            </div>
                            <div className="col-8 mb-1 border_bottom_1_e0e0e0">
                                <label>Roles</label>
                            </div>
                            <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                <label>Action</label>
                            </div>
                        </div>
                        <div className="row mt-1 px-4 py-1 max-h-500px">
                        {this.state.updateRolesList.map((el, i) => (
                            <>
                            <input 
                              type="hidden" 
                              disabled={!el.userRolesId}
                              name={"userRolesDtos["+i+"][userRolesId]"}
                              value={parseInt(el.userRolesId)}
                            />
                            <input 
                              type="hidden"
                              name={"userRolesDtos["+i+"][isDefault]"}
                              value={el.isDefault}
                            />
                            <input 
                              type="hidden" 
                              disabled={isEmpty(this.state.userId)}
                              // name={"userRolesDtos["+i+"][user][userId]"}
                              name={"userRolesDtos["+i+"][userId]"}
                              value={parseInt(this.state.userId)}
                            />
                                <div className="col-2">
                                  <div className="form-group">
                                      <input type="radio"
                                        className={"form-control " + this.props.readonly}
                                        name={"isDefaultRole"}
                                        onChange={(event) => {
                                          this.setDefaultRole(i)
                                          // commonSetState(this, "updateRolesList."+i+".isDefault",el.isDefault==="Y"?"N":"Y");
                                        }}
                                        checked={el.isDefault==="Y"}
                                      />
                                  </div>
                              </div>
                                <div className="col-8">
                                    <select className={"form-control " + this.props.readonly} 
                                      value={parseInt(el.role.roleId)}
                                      // name={"userRolesDtos["+i+"][role][roleId]"}
                                      name={"userRolesDtos["+i+"][roleId]"}
                                      onChange={(event) =>commonHandleChange(event,this,"updateRolesList."+i+".role.roleId")
                                      }
                                    >
                                        <option value="">Select</option>
                                        {(this.state.roleList).map(role =>
                                          <option value={role.value}>{role.display}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="col-2">
                                    <button
                                        className={
                                            "btn " +
                                            (i === 0
                                                ? "btn-outline-success"
                                                : "btn-outline-danger")
                                        }
                                        onClick={() => {
                                            i === 0
                                                ? this.updateAddOtherNewRoles()
                                                : this.updateRemoveOtherNewRoles(el.userRolesId,i);
                                        }}
                                        type="button"
                                    >
                                        <i
                                            class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </div>
                                </>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className={"modal-footer "+ this.props.readonly}>
                      <button
                          className={"btn btn-success"}
                          onClick={(e) => {
                            // this.updateRolesList(e)
                            commonSubmitFormNoValidation(e,this,"updateUserRoles","/rest/updateUserRoles");
                          }}
                          type="button"
                          data-dismiss="modal"
                      >
                        Update
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
                </FormWithConstraints>
                {/* Update Role Modal */}

                </FormWithConstraints>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// styled components

const Menu = props => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: 'absolute',
        zIndex: 2,
      }}
      {...props}
    />
  );
};
const Blanket = props => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div css={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);
const Svg = p => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...p}
  />
);
const DropdownIndicator = () => (
  <div css={{ height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>)

const mapStateToProps = (state) => {
  return state.internalUserInfo;
};

export default connect(mapStateToProps, actionCreators)(InternalUser);
