import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { formatDateWithoutTime } from "../../Util/DateUtil";
import { isEmpty } from "../../Util/validationUtil";
import { connect } from "react-redux";
import {
  FormWithConstraints,
  FieldFeedbacks,
  FieldFeedback,
} from "react-form-with-constraints";
import {
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  getObjectFromPath,
  commonSubmitFormWithValidation,
} from "../../Util/ActionUtil";
import * as actionCreators from "./Action";

class NewMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internalUserDetails: {
        role: "",
        plant: "",
        designation: "",
        department: "",
        emailid: "",
        empcode: "",
        name: "",
        mobileNo: "",
        activeFrom: "",
        activeTill: "",
        costCentre: "",
        approver: "",
      },
      roleList: [],
      plantList: [],
      plantMap: [],
      internalUsersList: [],
      updateFlag: false,
      userId: "",
      userDetailsId: "",
      userRolesId: "",
      readOnlyFlag: false,
      hidden: true,
      shown: true,
    };
  }

  async componentDidMount() {
    commonSubmitWithParam(
      this.props,
      "showInternalUsers",
      "/rest/getInternalUsersList"
    );
    this.setState({
      updateFlag: false,
      readOnlyFlag: false,
    });
  }
  showUserDetails = () => {
    this.setState({
      updateFlag: false,
      readOnlyFlag: false,
    });
    commonSubmitWithParam(
      this.props,
      "populateInternalUserDropDown",
      "/rest/getInternalUserDropDown"
    );
  };

  loadUser = (fetchuser) => {
    console.log(fetchuser);
    let userRole = fetchuser.role.roleId;
    let userPlant = fetchuser.user.userDetails.plant;
    let userdesignation = fetchuser.user.userDetails.userDesignation;
    let userDepartment = fetchuser.user.userDetails.department;
    let userEmailId = fetchuser.user.email;
    let userEmpCode = fetchuser.user.userName;
    let userName = fetchuser.user.userDetails.name;
    let userMobileNo = fetchuser.user.userDetails.mobileNo;
    let dateactiveFrom = formatDateWithoutTime(
      fetchuser.user.userDetails.activeFrom
    );
    let dateactiveTill = formatDateWithoutTime(
      fetchuser.user.userDetails.activeTill
    );
    let userApprover = fetchuser.user.userDetails.approver;
    let userCostCentre = fetchuser.user.userDetails.costCentre;

    this.setState({
      internalUserDetails: {
        role: userRole,
        plant: userPlant,
        designation: userdesignation,
        department: userDepartment,
        emailid: userEmailId,
        empcode: userEmpCode,
        name: userName,
        mobileNo: userMobileNo,
        activeFrom: dateactiveFrom,
        activeTill: dateactiveTill,
        approver: userApprover,
        costCentre: userCostCentre,
      },
      updateFlag: true,
      userId: fetchuser.user.userId,
      userDetailsId: fetchuser.user.userDetails.userDetailsId,
      userRolesId: fetchuser.userRolesId,
      readOnlyFlag: true,
    });
    // console.log(fetchuser.userRolesId);
  };

  async componentWillReceiveProps(props) {
    if (!isEmpty(props.roleList)) {
      // console.log(props.rolelist);
      let roleArray = Object.keys(props.roleList).map((key) => {
        return {
          display: props.roleList[key].name,
          value: props.roleList[key].roleId,
        };
      });
      this.setState({
        roleList: roleArray,
      });
    }

    if (!isEmpty(props.plantList)) {
      // console.log(props.plantList);
      let plantArray = Object.keys(props.plantList).map((key) => {
        return { display: props.plantList[key], value: key };
      });
      this.setState({
        plantList: plantArray,
        plantMap: props.plantList,
      });
    }
    if (!isEmpty(props.internalUsersList)) {
      // console.log(props.internalUsersList);
      this.setState({
        internalUsersList: props.internalUsersList,
      });
    }
  }
  render() {
    // console.log("internalUserDetails",this.state.internalUserDetails);
    var shown = {
      display: this.state.shown ? "block" : "none",
    };
    var hidden = {
      display: this.state.hidden ? "none" : "block",
    };
    return (
      <React.Fragment>
        <UserDashboardHeader />
        <div className="w-100">
          <div className="mt-100 boxContent">
            <div className="row" style={shown}>
              <form>
                <FormWithConstraints
                  ref={(formWithConstraints) =>
                    (this.internalUserForm = formWithConstraints)
                  }
                  onSubmit={(e) => {
                    // commonSubmitForm(e, this, "saveInternalUserDetailsResponse",this.state.updateFlag?"/rest/updateInternalUser":"/rest/saveIternalUser","internalUserForm")
                    console.log(e);
                  }}
                >
                  <input
                    type="hidden"
                    disabled={this.state.updateFlag ? false : true}
                    name="user[userId]"
                    value={this.state.userId}
                  />
                  <input
                    type="hidden"
                    disabled={this.state.updateFlag ? false : true}
                    name="user[userDetails][userDetailsId]"
                    value={this.state.userDetailsId}
                  />
                  <input
                    type="hidden"
                    disabled={this.state.updateFlag ? false : true}
                    name="userRolesId"
                    value={this.state.userRolesId}
                  />
                  <div className="col-sm-12 mt-2">
                    <div className="row mt-2">
                      <label className="col-sm-2">
                        PO No. <span className="redspan">*</span>
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={this.state.internalUserDetails.pono}
                          name="newmenu[pono]"
                          required
                          onChange={(event) => {
                            commonHandleChange(
                              event,
                              this,
                              "internalUserDetails.pono",
                              "internalUserForm"
                            );
                          }}
                        />
                        <FieldFeedbacks for="newmenu[pono]">
                          <FieldFeedback when="*"></FieldFeedback>
                        </FieldFeedbacks>
                      </div>
                      <label className="col-sm-2">
                        Invoice No. <span className="redspan">*</span>
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={this.state.internalUserDetails.invoiceno}
                          name="newmenu[invoiceno]"
                          required
                          onChange={(event) => {
                            commonHandleChange(
                              event,
                              this,
                              "internalUserDetails.invoiceno",
                              "internalUserForm"
                            );
                          }}
                        />
                      </div>
                      <FieldFeedbacks for="newmenu[invoiceno]">
                        <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>
                    </div>
                    <div className="row mt-2">
                      <label className="col-sm-2">Invoice Date </label>
                      <div className="col-sm-3">
                        <input
                          type="date"
                          className="form-control"
                          value={this.state.internalUserDetails.invoicedate}
                          name="newmenu[invoicedate]"
                          required
                          onChange={(event) => {
                            commonHandleChange(
                              event,
                              this,
                              "internalUserDetails.invoicedate",
                              "internalUserForm"
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 text-center">
                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                      <button type="button" className="btn btn-danger ml-2">
                        Cancel
                      </button>
                    </div>
                  </div>
                </FormWithConstraints>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state.internalUserInfo;
};

export default connect(mapStateToProps, actionCreators)(NewMenu);
