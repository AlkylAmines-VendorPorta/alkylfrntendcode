import React, { Component } from "react";
import serialize from "form-serialize";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./Action";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import {
  commonSubmitForm, commonHandleChange, commonSubmitWithParam,
  commonHandleChangeCheckBox, getObjectFromPath, commonSubmitFormWithValidation, commonSubmitListOfDto
} from "../../Util/ActionUtil";
import StickyHeader from "react-sticky-table-thead";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
//import { saveUserFormApi } from "../../Util/APIUtils";
import swal from 'sweetalert';
import { statusForVendor } from "../../Util/CommonUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";

class UpdateCredentials extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      useremailEditBtnClick: false,
      requestedUsersType: '',
      vendorLogInBtnClick: false,
      updateUserNameAndEmailStatus: '',
      generateLoginOfVendor: [],
      checked: {},
      selectedVendorMode: 'RG',
      defaultOption: 'RG',
      userEmail: '',
      usersUserName: '',
      userId: '',
      UserName: null,
      email: '',
      isPrimaryAccount: false,
      countryFlag: false,
      loaderFlag: true,
      editButtonFlag: false,
      newButtonFlag: true,
      selectedAddressIndex: "",
      selectedContactIndex: "",
      deleteAddressFlag: false,
      deleteContactFlag: false,
      currentContact: "",
      currentAddress: "",
      loadAddressList: false,
      loadAddressDetails: false,
      loadCompanyDetails: true,
      loadCompanyContactDetails: false,
      loadCompanyContactDetailsList: false,
      loadCountries: true,
      loadStates: true,
      loadDistricts: false,
      loadTitles: true,
      countrytMap: [],
      stateMap: [],
      districtMap: [],
      companyTypeList: [],
      vendorTypeList: [],
      countryList: [],
      stateList: [],
      districtList: [],
      titleList: [],
      companyDetails: {
        vendorName: "",
        vendorSapCode: "",
        vendorType: "",
        companyType: ""
      },
      addressArray: [],
      addressDetails: {
        partnerCompanyAddressId: "",
        locationId: "",
        address1: "",
        address2: "",
        address3: "",
        country: "",
        state: "",
        district: "",
        postalCode: ""
      },
      contactDetailsArray: [],
      contactDetails: {
        userDetailsId: "",
        title: "",
        personName: "",
        designation: "",
        department: "",
        mobileNo: "",
        telephoneNo: "",
        faxNo: "",
        email: "",
        isReceiveEnquiry: false,
        isReceivePO: false,
        isReceiveACInfo: false,
        generatePasswordDisabled: false,
        updatingInformation: false
      }

    }

  }

  loadAddress = (addressObj) => {
    let addr = this.getAddressFromFobj(addressObj)
    this.setState({
      loadAddressDetails: false,
      addressDetails: addr
    });
  }

  loadAddressForEdit = (index) => {
    let addressObj = this.state.addressArray[index];
    let curAddr = addressObj;
    //let selectedAddr = "selectedAddress"+index

    this.setState({
      stateList: [],
      districtList: [],
      editButtonFlag: true,
      

    });

    let currentRowState = getObjectFromPath("selected", "selectedAddress" + index);
    this.setState(currentRowState);

    let previousRow = getObjectFromPath("", this.state.selectedAddressIndex);
    this.setState(previousRow);

    this.loadState(addressObj.country).then(() => {
      this.loadDistrict(addressObj.state).then(() => {
        this.setState({
          selectedAddressIndex: "selectedAddress" + index,
          currentAddress: addressObj,
          loadAddressDetails: false,
          addressDetails: addressObj
        });
      });
    });
  }

  cancelAddress() {

    let curAddr = this.state.currentAddress;
    //let selectedAddr = "selectedAddress"+index

    this.setState({
      stateList: [],
      districtList: []
    });

    this.loadState(curAddr.country).then(() => {
      this.loadDistrict(curAddr.state).then(() => {
        this.setState({
          loadAddressDetails: false,
          addressDetails: curAddr
        });
      });
    });
  }


  getAddressFromFobj = (addressObj) => {
    let countryName;
    let regionName;
    let districtName;
    if (isEmpty(addressObj.location.country.name)) {
      countryName = this.state.countryMap[addressObj.location.country.countryId]
    } else {
      countryName = addressObj.location.country.name;
    }

    if (isEmpty(addressObj.location.region.name)) {
      regionName = this.state.stateMap[addressObj.location.region.regionId]
    } else {
      regionName = addressObj.location.region.name;
    }

    if (isEmpty(addressObj.location.district.name)) {
      districtName = this.state.districtMap[addressObj.location.district.districtId]
    } else {
      districtName = addressObj.location.district.name;
    }

    return {
      partnerCompanyAddressId: addressObj.partnerCompanyAddressId,
      locationId: addressObj.location.locationId,
      address1: addressObj.location.address1,
      address2: addressObj.location.address2,
      address3: addressObj.location.address3,
      country: addressObj.location.country.countryId,
      countryName: countryName,
      state: addressObj.location.region.regionId,
      stateName: regionName,
      district: addressObj.location.district.districtId,
      districtName: districtName,
      postalCode: addressObj.location.postal,
      isPrimaryAccount: addressObj.isPrimaryAccount

    };
  }

  loadContact = (contactObj) => {
    let contact = this.getContactFromFobj(contactObj);
    this.setState({
      currentContact: contact,
      contactDetails: contact
    });
  }


  loadContactForEdit = (index) => {

    let contactObj = this.state.contactDetailsArray[index];
    let currentRowState = getObjectFromPath("selected", "selectedContact" + index);
    this.setState(currentRowState);
    let previousRow = getObjectFromPath("", this.state.selectedContactIndex);
    this.setState(previousRow);
    this.setState({
      currentContact: contactObj,
      contactDetails: contactObj,
      selectedContactIndex: "selectedContact" + index,
      editButtonFlag: true
    });
  }

  getContactFromFobj = (contactObj) => {

    return {
      userDetailsId: contactObj.userDetailsId,
      title: contactObj.title,
      personName: contactObj.name,
      designation: contactObj.userDesignation,
      department: contactObj.userDept,
      mobileNo: contactObj.mobileNo,
      faxNo: contactObj.fax1,
      telephoneNo: contactObj.telephone1,
      email: contactObj.email,
      isReceiveEnquiry: contactObj.isReceiveEnquiry === "Y",
      isReceivePO: contactObj.isReceivePO === "Y",
      isReceiveACInfo: contactObj.isReceiveACInfo === "Y"
    };
  }


  loadState = async (country) => {
    this.setState({
      loadStates: true
    })
    commonSubmitWithParam(this.props, "populateStates", "/rest/getStateByCountry", country);
  }

  loadDistrict = async (state) => {
    this.setState({
      loadDistricts: true
    })
    commonSubmitWithParam(this.props, "populateDistricts", "/rest/getDistrictByState", state);
  }

  handleChangeCountry(country) {
    // console.log(" outside loop");
    // if(country!=1)
    // {
    //   
    //   console.log(country);
    //   this.setState({
    //     countryFlag:true
    //   }) 
    // }else{
    //   this.setState({
    //     countryFlag:false
    //   }) 

    // }
    this.loadState(country).then(() => {
      // console.log("inload state");
      let addr = this.state.addressDetails;
      addr.country = country;
      addr.state = "";
      addr.district = "";
      this.setState({
        addressDetails: addr
      });
    });
  }

  handleChangeState(state) {
    this.loadDistrict(state).then(() => {
      let addr = this.state.addressDetails;
      addr.state = state;
      addr.district = "";
      this.setState({
        addressDetails: addr
      })
    });
  }

  getPartnerId = () => {
    if (!isEmpty(this.props.partner)) {
      return this.props.partner.partnerId;
    } else {
      return "";
    }
  }

  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  resetaddressDetails = () => {
    this.setState({
      newButtonFlag: true,
      addressDetails: {
        partnerCompanyAddressId: "",
        locationId: "",
        address1: "",
        address2: "",
        address3: "",
        country: "",
        state: "",
        district: "",
        postalCode: "",

      },
    })
  }
  resetContactDetails = () => {
    this.setState({
      newButtonFlag: true,
      contactDetails: {
        userDetailsId: "",
        title: "",
        personName: "",
        designation: "",
        department: "",
        mobileNo: "",
        telephoneNo: "",
        faxNo: "",
        email: "",
        isReceiveEnquiry: false,
        isReceivePO: false,
        isReceiveACInfo: false,
        updateUserNameAndEmailStatus: ''
      }
    })
  }

  swalWithPromptDeleteforCompanyAddress = (swalvalue) => {
    swal("Do you Really Want to Delete?", {
      buttons: {
        cancel: "No",
        catch: {
          text: "Yes",
          value: "catch",
        },
        // defeat: true,
      },
    })
      .then((value) => {
        switch (value) {

          case "defeat":
            swal("Cancelled");
            break;

          case "catch":
            swal("Deleted", "success");
            {
              this.setState({ deleteAddressFlag: true })
              commonSubmitWithParam(this.props, "deletePartnerAddress", "/rest/deleteCompanyAddress", swalvalue)
            }
            break;
          default:
            swal("Delete Cancelled");
        }
      });

  }
  swalWithPromptDeleteforContactDetails = (deletevalue) => {
    swal("Do you Really Want to Delete?", {
      buttons: {
        cancel: "No",
        catch: {
          text: "Yes",
          value: "catch",
        },
        // defeat: true,
      },
    })
      .then((value) => {
        switch (value) {

          case "defeat":
            swal("Cancelled");
            break;

          case "catch":
            swal("Deleted", "success");
            {
              this.setState({ deleteContactFlag: true })
              commonSubmitWithParam(this.props, "deleteContactDetail", "/rest/deleteCompanyContactDetails", deletevalue)
            }
            break;
          default:
            swal("Delete Cancelled");
        }
      });

  }
  async componentDidMount() {


    // setTimeout(function () {
    //   // this.props.getGeneralInfo("generalInformation");
    //   this.setState({
    //     loadCompanyDetails: true
    //   })
    //   commonSubmitWithParam(this.props, "populateCompanyDetails", "/rest/getCompanyDetails", this.getPartnerId());

    // }.bind(this), 1000)

  }

  async componentWillReceiveProps(props) {

    if (this.state.radioClicked && this.props.userList) {
      this.setState({
        radioClicked: false
      })
    }

    if (!isEmpty(props.loaderState)) {
      this.changeLoaderState(props.loaderState);
    }

    if (!isEmpty(props.userList)) {
      this.changeLoaderState(false);
      this.setState({
        requestedUsersType: this.state.selectedVendorMode
      })
    } else {
      this.changeLoaderState(false);
    }


    if (this.state.vendorLogInBtnClick === true) {
      this.changeLoaderState(false);
      this.setState({
        loginGeneratedResponseMessage: props.logInGenereated,
        vendorLogInBtnClick: false
      })
      if (props.logInGenereatedSuccess === true) {
        this.getUser();
      }
    } else {
      this.changeLoaderState(false);
    }

    if ((!isEmpty(props.updateUsernameAndEmail))) {
      this.changeLoaderState(false);
      if (this.state.updatingInformation === true) {
        setTimeout(function () { window.location.reload(); }, 1500);
      }
      this.setState({
        updateUserNameAndEmailStatus: props.updateUsernameAndEmail,
        useremailEditBtnClick: false,
        generatePasswordDisabled: false
      })
    } else {
      this.changeLoaderState(false);
      this.setState({
        generatePasswordDisabled: false
      })
    }

    // console.log("userList", this.props.userList)

    if (!isEmpty(props.companyDetails) && this.state.loadCompanyDetails) {
      let vendorName = props.companyDetails.name;
      let vendorSapCode = props.companyDetails.vendorSapCode;
      let vendorType = props.companyDetails.vendorType;
      let companyType = props.companyDetails.companyType;
      let isManufacturer = vendorType === "MANUFACTURER";


      this.setState({
        loadCompanyDetails: false,

        companyDetails: {
          vendorName: vendorName,
          vendorSapCode: vendorSapCode,
          vendorType: vendorType,
          companyType: companyType
        }
      });

      if (this.props.loadManuFacturerTab) {
        if (isManufacturer) {
          this.props.showManufacturerTabs(props.readonly, props.displayDiv, props.displayDiv1, props.partner.partnerId, props.partner.status);
        } else {
          this.props.showNonManufacturerTabs(props.readonly, props.displayDiv, props.displayDiv1, props.partner.partnerId, props.partner.status);
        }
      }

    }

    if (!isEmpty(props.generalInfo)) {
      this.setState({
        generalInfo: props.generalInfo
      })
    }
    if (!isEmpty(props.vendorTypeList)) {
      let vendorTypeArray = Object.keys(props.vendorTypeList).map((key) => {
        return { display: props.vendorTypeList[key], value: key }
      });
      this.setState({
        vendorTypeList: vendorTypeArray
      })
    }
    if (!isEmpty(props.companyTypeList)) {
      let companyTypeArray = Object.keys(props.companyTypeList).map((key) => {
        return { display: props.companyTypeList[key], value: key }
      });
      this.setState({
        companyTypeList: companyTypeArray
      })
    }
    if (!isEmpty(props.countryList && this.state.loadCountries)) {
      let cntryMap = [];
      let countryArray = Object.keys(props.countryList).map((key) => {
        cntryMap[props.countryList[key].countryId] = props.countryList[key].name;
        return { display: props.countryList[key].name, value: props.countryList[key].countryId }
      });
      // console.log(cntryMap);
      this.setState({
        loadCountries: false,
        countryMap: cntryMap,
        countryList: countryArray
      })
    }
    if (this.state.loadStates) {
      if (!isEmpty(props.stateList)) {
        let stMap = [];
        let stateArray = Object.keys(props.stateList).map((key) => {
          stMap[props.stateList[key].regionId] = props.stateList[key].name;
          return { display: props.stateList[key].name, value: props.stateList[key].regionId }
        });
        // console.log(stMap);
        this.setState({
          loadStates: true,
          stateMap: stMap,
          stateList: stateArray
        })
      } else {
        this.setState({
          loadStates: true,
          stateMap: [],
          stateList: []
        })
      }
    }
    if (!isEmpty(props.districtList) && this.state.loadDistricts) {
      let distMap = [];
      let districtArray = Object.keys(props.districtList).map((key) => {
        distMap[props.districtList[key].districtId] = props.districtList[key].name;
        return { display: props.districtList[key].name, value: props.districtList[key].districtId }
      });
      // console.log(distMap);
      this.setState({
        loadDistricts: false,
        districtMap: distMap,
        districtList: districtArray
      })
    }
    if (!isEmpty(props.addressList) && this.state.loadAddressList) {

      let addressList = [];
      props.addressList.map((address) => {
        addressList.push(this.getAddressFromFobj(address));
      })
      this.setState({
        loadAddressList: false,
        addressArray: addressList
      })
    }
    if (!isEmpty(props.titleList)) {
      let titleArray = Object.keys(props.titleList).map((key) => {
        return { display: props.titleList[key], value: key }
      });
      this.setState({
        titleList: titleArray
      })
    }
    if (!isEmpty(props.contactDetailsList) && this.state.loadCompanyContactDetailsList) {

      let contactDetailsList = [];
      props.contactDetailsList.map((contact) => {
        contactDetailsList.push(this.getContactFromFobj(contact));
      })
      this.setState({
        loadCompanyContactDetailsList: false,
        contactDetailsArray: contactDetailsList
      })
    }
    if (!isEmpty(props.addressDetails) && this.state.loadAddressDetails) {

      this.loadAddress(props.addressDetails);
      this.setState({
        loadAddressDetails: false
      })
      let curAddr = this.state.addressArray;
      if (!isEmpty(curAddr)) {
        this.state.addressArray.map((addr, index) => {
          if (addr.partnerCompanyAddressId === props.addressDetails.partnerCompanyAddressId) {
            curAddr.splice(index, 1);
          }
        })
      }
      let addrArray = [this.getAddressFromFobj(props.addressDetails)];
      addrArray = addrArray.concat(curAddr);
      this.setState({
        addressArray: addrArray
      })
    }
    if (!isEmpty(props.contactDetails) && this.state.loadCompanyContactDetails) {

      this.loadContact(props.contactDetails);
      this.setState({
        loadCompanyContactDetails: false
      })
      let curContactArr = this.state.contactDetailsArray;
      if (!isEmpty(curContactArr)) {
        this.state.contactDetailsArray.map((contact, index) => {
          if (contact.userDetailsId === props.contactDetails.userDetailsId) {
            curContactArr.splice(index, 1);
          }
        })
      }
      let compContactArray = [this.getContactFromFobj(props.contactDetails)];
      compContactArray = compContactArray.concat(curContactArr);
      this.setState({
        contactDetailsArray: compContactArray
      })
    }
    if (this.state.deleteAddressFlag && props.currentAddress) {
      let curAddr = props.currentAddress;
      let addrArr = this.state.addressArray;
      this.state.addressArray.map((addr, index) => {
        if (addr.partnerCompanyAddressId === curAddr.partnerCompanyAddressId) {
          addrArr.splice(index, 1);
        }
      })
      this.setState({
        deleteAddressFlag: false,
        addressArray: addrArr
      });
    }
    if (this.state.deleteContactFlag && props.currentContact) {
      let curContact = props.currentContact;
      let conArr = this.state.contactDetailsArray;
      this.state.contactDetailsArray.map((contact, index) => {
        if (contact.userDetailsId === curContact.userDetailsId) {
          let conArr = this.state.contactDetailsArray;
          conArr.splice(index, 1);
        }
      })
      this.setState({
        deleteAddressFlag: false,
        contactDetailsArray: conArr
      });
    }
  }
  cancelCompanyDetails = () => {
    this.setState(prevState => ({
      generalInfo: this.state.generalInfo
    }))
  }


  checkboxHandler = (event, val) => {

    // console.log(event);
    //console.log(val);
    // console.log(event.target.value);

    this.setState({
      selectedVendorMode: event.target.value,
      defaultOption: val,
      radioClicked: true
    })
    this.props.emptyUserList(true);
  };



  getUser = () => {

    let UserName = this.state.UserName;
    let email = this.state.email
    let typeOfVendor = this.state.selectedVendorMode
    commonSubmitWithParam(this.props, "getUserByUserNameOrEmailResp", "/rest/getUserByUsernameOrEmail", email, typeOfVendor);
    this.changeLoaderState(true);
    this.setState({
      checked: {}
    })
  }

  displayUserInfo = (user) => {
    this.setState({
      usersUserName: this.state.requestedUsersType !== "internaluser" && user.createdBy.partner ? user.createdBy.partner.updatedBy.userName : user.userName,
      userEmail: this.state.requestedUsersType !== "internaluser" ? user.createdBy.email : user.email,
      userId: this.state.requestedUsersType !== "internaluser" ? user.createdBy.userId : user.userId,
      updateUserNameAndEmailStatus: ''

    })

  }

  displayUserInfoForAll = (user) => {
    this.setState({
      usersUserName: user[2],
      userEmail: user[4],
      userId: user[3],
      updateUserNameAndEmailStatus: ''

    })

  }

  displayUserInfoForResendInvitation = (user) => {
    this.setState({
      usersUserName: user[6],
      userEmail: user[2],
      userId: user[3],
      updateUserNameAndEmailStatus: ''

    })

  }

  updateEmail = () => {

    let email = this.state.userEmail
    let userId = this.state.userId
    commonSubmitWithParam(this.props, "updateUserNameResponse", "/rest/updateUserEmail", email, userId);

  }

  updateUserName = () => {

    let userName = this.state.usersUserName
    let userId = this.state.userId
    commonSubmitWithParam(this.props, "updateUserNameResponse", "/rest/updateUserName", userName, userId);
  }

  generatePassword = () => {

    let userName = this.state.usersUserName
    let userId = this.state.userId
    commonSubmitWithParam(this.props, "generatePasswordRspn", "/rest/genratePassword", userId);
    this.changeLoaderState(true);
  }

  resetIndexs(){
    this.setState({checked:{},generateLoginOfVendor:[]})
  }

  inviteVendorCheckboxHandler = (event, userDto, index) => {

    let userId = this.state.requestedUsersType !== "internaluser" ? userDto.createdBy.userId : userDto.userId;
    let invitingVendor = []
    invitingVendor = [...this.state.generateLoginOfVendor]
    if (event.target.checked === true) {
      invitingVendor.push(userId)
      this.setState(previousState => ({
        generateLoginOfVendor: invitingVendor,
        checked: {
          ...previousState.checked,
          [index]: true

        }
      }));
    }
    else {
      invitingVendor = invitingVendor.filter(el => el !== userId);
      this.setState(previousState => ({
        generateLoginOfVendor: invitingVendor,
        checked: {
          ...previousState.checked,
          [index]: false
        }
      }));
    }

  }

  inviteVendorCheckboxHandlerForAll = (event, userDto, index) => {

    // console.log(userDto);
    let userId = userDto[3];
    let invitingVendor = []
    invitingVendor = [...this.state.generateLoginOfVendor]
    if (event.target.checked === true) {
      invitingVendor.push(userId)
      this.setState(previousState => ({
        generateLoginOfVendor: invitingVendor,
        checked: {
          ...previousState.checked,
          [index]: true

        }
      }));
    }
    else {
      invitingVendor = invitingVendor.filter(el => el !== userId);
      this.setState(previousState => ({
        generateLoginOfVendor: invitingVendor,
        checked: {
          ...previousState.checked,
          [index]: false
        }
      }));
    }

  }


  inviteVendorsForLogin = () => {
    this.changeLoaderState(true);
    commonSubmitListOfDto(this.state.generateLoginOfVendor, this, "logInGenerateOfVendorResp", "/loginGeneratorForVendor",this.resetIndexs.bind(this));
  }

  changeLoaderState = (action) => {
    // commonSetState(this,"isLoading",action);
    this.setState({
      isLoading: action
    });
  }

  handleSubmit = (e) => {
    this.setState({ loadCompanyDetails: true }); 
    commonSubmitForm(e, this, "getUserByUserNameOrEmailResp", "/getUserByUsernameOrEmail", "comDetForm")
  }

  render() {
    const { checked } = this.state;
    // console.log("LISTOFGENERATING", this.state.generateLoginOfVendor);
    // console.log("User", this.state.selectedVendorMode);
    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        {<UserDashboardHeader />}
        <div className="container-fluid mt-100 w-100">
          <div className="card mb-1">
            <FormWithConstraints ref={formWithConstraints => this.comDetForm = formWithConstraints}
              onSubmit={this.handleSubmit} noValidate >
              <div className="row px-4 py-2">
                {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveCompanyDetailResp","/rest/saveCompanyDetails")}}> */}
                <input type="hidden" name="bPartnerId" value={this.getPartnerId()} />
                <div class="col-12 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label className="">Enter Email ID <span className="redspan">*</span></label>
                    <input type="text" className={"form-control " + this.props.readonly} required
                      name="email" value={this.state.email}
                      onChange={(event) => { commonHandleChange(event, this, "email", "comDetForm") }} />
                  </div>
                  <FieldFeedbacks for="name">
                    <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
                <div class="col-12 col-md-8 col-lg-8 pr-0">
                  <div class="form-group form-inline" style={{ marginTop: "25px" }}>
                    {/* <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" onChange={e => this.checkboxHandler(e, "Y")} class="custom-control-input" id="pgr" name={"courier"} value="Y" checked={this.state.defaultOption === "Y" ? true : false} />
                          <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="pgr">View Invited Vendor</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" onChange={e => this.checkboxHandler(e, "N")} class="custom-control-input" id="pgi" name={"courier"} value="N" checked={this.state.defaultOption === "N" ? true : false} />
                          <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="pgi">View UnInvited Vendor</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" onChange={e => this.checkboxHandler(e, "Both")} class="custom-control-input" id="both" name={"courier"} value="Both" checked={this.state.defaultOption === "Both" ? true : false} />
                          <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="both">Both</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" onChange={e => this.checkboxHandler(e, "internaluser")} class="custom-control-input" id="internaluser" name={"courier"} value="internaluser" checked={this.state.defaultOption === "internaluser" ? true : false} />
                          <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="internaluser">Internal Users</label>
                        </div> */}
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "RG")} class="custom-control-input" id="rg" name={"courier"} value="RG" checked={this.state.defaultOption === "RG"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="rg">Registered Vendors</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "NRG")} class="custom-control-input" id="nrg" name={"courier"} value="NRG" checked={this.state.defaultOption === "NRG"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="nrg">Un-Registered Vendors Invited</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "ALL")} class="custom-control-input" id="all" name={"courier"} value="ALL" checked={this.state.defaultOption === "ALL"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="all">All</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "IN")} class="custom-control-input" id="in" name={"courier"} value="IN" checked={this.state.defaultOption === "IN"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="in"> Invited Vendor List (Invited)</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "RESEND")} class="custom-control-input" id="resend" name={"courier"} value="RESEND" checked={this.state.defaultOption === "RESEND"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="resend">Resend Invitation for Vendor (Invited)</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "internaluser")} class="custom-control-input" id="internaluser" name={"courier"} value="internaluser" checked={this.state.defaultOption === "internaluser"} />
                      <label class="custom-control-label" style={{ fontSize: "1rem", fontWeight: "700" }} for="internaluser">Internal Users</label>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-1 col-lg-1 pl-0">
                  <div className={"text-center " + this.props.displayDiv} style={{ marginTop: "20px" }}>
                    {/* <button type="submit" className="btn btn-success mr-1">Save</button> */}
                    <button type="button" className="btn btn-outline-primary mr-1" onClick={() => { this.setState({ loadCompanyDetails: true }); this.getUser() }} ><i className="fa fa-search"></i> Search</button>
                  </div>
                </div>
              </div>
              {/* <div className="row">
                    <label className="col-sm-2">Enter UserName <span className="redspan">*</span></label>
                    <div className="col-sm-3">
                      <input type="text" className={"form-control " + this.props.readonly} required
                        name="UserName" value={this.state.UserName}
                        onChange={(event) => { commonHandleChange(event, this, "UserName", "comDetForm") }} />
                    </div>
                    <FieldFeedbacks for="name">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div> */}
            </FormWithConstraints>
          </div>

          <div className={"card mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption === "ALL" || this.state.defaultOption === "RESEND" ? "display_none" : "display_block")}>
            <div className="row px-4 py-2">
              <div class="col-12">
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                    <table className="table table-bordered table-header-fixed">
                      <thead>
                        <tr>

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <th>Invite</th>
                            </>
                          }


                          <th> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</th>
                          <th>Email</th>


                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <th>Company name</th>
                              {/* <th style={{ width: "150px" }}>PAN No</th> */}
                              <th>Status</th>
                            </>
                          }

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <th>State</th>
                              {/* <th style={{ width: "150px" }}>PAN No</th> */}
                              <th>District</th>
                            </>
                          }

                          {this.state.requestedUsersType === "internaluser" &&
                            <>
                              <th>Designation</th>
                              <th>Department</th>
                              <th>Plant</th>
                            </>
                          }





                          {/* <th style={{ width: "150px" }}>Vendor SAP Code</th>
                          <th style={{ width: "100px" }}>is Invited</th> */}
                          <th>Edit</th>
                          {/* <th className={this.props.displayDiv}>Delete</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.userList.map((user, index) => (
                          <tr>


                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td> {(user.createdBy != null ? user.createdBy.isInvited : user.isInvited) === 'Y' ? <></> :

                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandler(e, user, index)} checked={checked[index] || false} />

                                }</td>
                              </>
                            }

                            <td>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? user.createdBy.partner.vendorSapCode : <></>}</> : <>{user.userName}</>}</td>
                            <td>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null ? user.createdBy.email : <></>}</> : <>{user.email}</>}</td>

                            {/* <td style={{ width: "150px" }}>{user.partner.vendorSapCode}</td>
                            <td style={{ width: "100px" }}>{user.partner.isInvited}</td> */}




                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? user.createdBy.partner.name : <></>}</> : <>{user.partner.name}</>}</td>
                                {/* <td style={{ width: "150px" }}>{user.partner.panNumber}</td> */}
                                <td>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? statusForVendor(user.createdBy.partner.status) : <></>}</> : <>{statusForVendor(user.partner.status)}</>}</td>
                              </>
                            }
                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td>{user.location ? user.location.region ? user.location.region.name : "" : ""}</td>

                                <td>{user.location ? user.location.district ? user.location.district.name : "" : ""}</td>
                              </>
                            }
                            {
                              this.state.requestedUsersType === "internaluser" &&
                              <>
                                <td>{user.email}</td>
                                <td>{user.partner.name}</td>
                                <td>{user.partner.panNumber}</td>
                              </>
                            }


                            <td>

                              <button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} data-toggle="modal" data-target="#EditUserInfo" type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfo(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>

                  </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button>
              </div>
            </div>
          </div>

          {/* FOR ALL CATEGORY */}
          <div className={"card mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption !== "ALL" ? "display_none" : "display_block")}>
            <div className="row px-4 py-2">
              <div class="col-12">
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                    <table className="table table-bordered table-header-fixed">
                      <thead>
                        <tr>

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <th>Invite</th>
                            </>
                          }


                          <th> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</th>
                          <th>Email</th>
                          <>
                            <th>Company name</th>
                            {/* <th style={{ width: "150px" }}>PAN No</th> */}
                            <th>Status</th>
                          </>
                          <>
                            <th>State</th>
                            {/* <th style={{ width: "150px" }}>PAN No</th> */}
                            <th>District</th>
                          </>


                          {/* <th style={{ width: "150px" }}>Vendor SAP Code</th>
                          <th style={{ width: "100px" }}>is Invited</th> */}
                          <th>Edit</th>
                          {/* <th className={this.props.displayDiv}>Delete</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.userList.map((user, index) => (
                          <tr>


                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td> {(user[7] === 'Y') ? <></> :

                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandlerForAll(e, user, index)} checked={checked[index] || false} />

                                }</td>
                              </>
                            }

                            <td>{<>{user[2]}</>}</td>
                            <td>{user[4]}</td>

                            {/* <td style={{ width: "150px" }}>{user.partner.vendorSapCode}</td>
                            <td style={{ width: "100px" }}>{user.partner.isInvited}</td> */}




                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td>{user[1]}</td>
                                {/* <td style={{ width: "150px" }}>{user.partner.panNumber}</td> */}
                                <td>{statusForVendor(user[8])}</td>
                              </>
                            }
                            <td>{user[6]}</td>

                            <td>{user[5]}</td>


                            <td>

                              <button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} data-toggle="modal" data-target="#EditUserInfo" type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfoForAll(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>

                  </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button>
              </div>
            </div>
          </div>
          {/* FOR ALL CATEGORY */}

          {/* FOR RESEND INVITATION CATEGORY */}
          <div className={"card mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption !== "RESEND" ? "display_none" : "display_block")}>
            <div className="row px-4 py-2">
              <div class="col-12">
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                    <table className="table table-bordered table-header-fixed">
                      <thead>
                        <tr>
                          {this.state.requestedUsersType !== "internaluser" &&
                            <th>Invite</th>
                          }
                          <th> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</th>
                          <th>Email</th>
                          <th>Company name</th>
                          <th>Status</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.userList.map((user, index) => (
                          <tr>
                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td>
                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandlerForAll(e, user, index)} checked={checked[index] || false} />
                                </td>
                              </>
                            }
                            <td>{<>{user[6]}</>}</td>
                            <td>{<>{user[2]}</>}</td>
                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <td>{user[1]}</td>
                                {/* <td style={{ width: "150px" }}>{user.partner.panNumber}</td> */}
                                <td>{statusForVendor(user[5])}</td>
                              </>
                            }
                            <td>
                              <button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} data-toggle="modal" data-target="#EditUserInfo" type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfoForResendInvitation(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button>
              </div>
            </div>
          </div>
          {/* FOR RESEND INVITATION CATEGORY */}

        </div>

        {/* <div id="accordion">
          
          <div className="card">
            <div className="card-header">
              <a
                className="collapsed card-link"
                data-toggle="collapse"
                href="#collapseTwo"
                onClick={() => { this.setState({ loadAddressList: true, newButtonFlag: true }); commonSubmitWithParam(this.props, "getCompAddressInformation", "/rest/getCompanyAddressInfo", this.getPartnerId()) }}
              >
                Address Details
            </a>
            </div>
            <div id="collapseTwo" className="collapse" data-parent="#accordion" >
              <div className="card-body">
                {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveAddressDetailsResp","/rest/saveCompanyAddress")}} > 

                <div className="row">
                  <div className="col-sm-12 mt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Address </th>
                          <th>Country</th>
                          <th>Postal Code</th>
                          <th>State</th>
                          <th>District</th>
                          <th>Edit</th>
                          <th className={this.props.displayDiv}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.addressArray.map((addr, index) =>
                          <tr className={this.state["selectedAddress" + index]}>
                            <td>{addr.address1 + ", " + addr.address2 + ", " + addr.address3}</td>
                            <td>{addr.countryName}</td>
                            <td>{addr.postalCode} </td>
                            <td>{addr.stateName}</td>
                            <td>{addr.districtName}</td>
                            <td>
                              <button className={this.state.editButtonFlag ? "btn btn-info not-allowed" : "btn btn-info"} type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.loadAddressForEdit(index) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                            <td className={this.props.displayDiv}>
                              <button className="btn btn-danger" type="button" onClick={() => { this.swalWithPromptDeleteforCompanyAddress(addr.partnerCompanyAddressId); }}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                              </button>
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">

            <div id="collapseThree" className="collapse" data-parent="#accordion">
              <div className="card-body">
                 <form onSubmit={(e)=> {commonSubmitForm(e,this.props,"saveContactDetailsResp","/rest/saveCompanyContactDetails")}}>

                <div className="row">
                  <div className="col-sm-12 mt-4">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Salutation</th>
                          <th>Person Name</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Mobile No</th>
                          <th>Telephone No</th>
                          {/* <th>Fax No</th> 
                          <th>Mail ID</th>
                          <th>Edit</th>
                          <th className={this.props.displayDiv}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.contactDetailsArray.map((contact, index) =>
                          <tr className={this.state["selectedContact" + index]}>
                            <td>{contact.title}</td>
                            <td>{contact.personName}</td>
                            <td>{contact.designation}</td>
                            <td>{contact.department} </td>
                            <td>{contact.mobileNo}</td>
                            <td>{contact.telephoneNo}</td>
                            <td>{contact.email}</td>
                            <td>
                              <button className={this.state.editButtonFlag ? "btn btn-info not-allowed" : "btn btn-info"} type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.loadContactForEdit(index) }}>
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                            <td className={this.props.displayDiv}>
                              <button className="btn btn-danger" type="button" onClick={() => { this.swalWithPromptDeleteforContactDetails(contact.userDetailsId) }}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                              </button>
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Online Order Details modal sections start*/}
        <div className="modal fade" id="EditUserInfo">
          <div className="modal-dialog modal-lg mt-100">
            <div className="modal-content">


              <FormWithConstraints ref={formWithConstraints => this.comDetForm = formWithConstraints}
                onSubmit={(e) => { this.changeLoaderState(true); this.setState({ loadCompanyDetails: true, updatingInformation: true, generatePasswordDisabled: true }); commonSubmitForm(e, this, "updateUserNameAndEmailOfUser", "/rest/updateUserNameOrEmail", "comDetForm") }} noValidate >



                <div className="modal-header">
                  <h4 className="modal-title col-sm-4">Edit </h4>

                  <div className="col-sm-4 buttons-depot-order-details">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="form-group top10">
                    <div className="row">
                      <div className="col-12">

                        {/* <button type="button" className="btn btn-success mr-1" onClick={() => { this.setState({ loadCompanyDetails: true }); this.updateEmail() }} >Update</button>
                      <br />
                      <button type="button" className="btn btn-success mr-1" onClick={() => { this.setState({ loadCompanyDetails: true }); this.updateUserName() }} >Update</button> */}

                        {

                          this.props.updateUsernameAndEmailIsSuccess === true ?
                            <h6 class="text-success">{this.state.updateUserNameAndEmailStatus}</h6>
                            :
                            <h6 class="text-danger">{this.state.updateUserNameAndEmailStatus}</h6>

                        }

                        <div class="card-body">

                          <div className="row">
                            <div className="col-6">
                              <label className="">Enter Email <span className="redspan">*</span></label>
                              <input type="text" className={"form-control " + this.props.readonly} required
                                name="email" value={this.state.userEmail}
                                onChange={(event) => { commonHandleChange(event, this, "userEmail") }} />
                              <FieldFeedbacks for="email">
                                <FieldFeedback when="*"></FieldFeedback>
                              </FieldFeedbacks>
                            </div>
                            <div className="col-6">
                              <label className="">Username <span className="redspan">*</span></label>
                              <input type="text" className={"form-control " + this.props.readonly} required
                                name="userName" value={this.state.usersUserName}
                                onChange={(event) => { commonHandleChange(event, this, "usersUserName") }} />

                              <FieldFeedbacks for="userName">
                                <FieldFeedback when="*"></FieldFeedback>
                              </FieldFeedbacks>
                            </div>
                          </div>
                          <input type="hidden" name="userId" value={this.state.userId} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="modal-footer">
                  {/* <button type="button" className="btn btn-primary" data-dismiss="modal">Update</button> */}
                  <button type="button" className="btn btn-outline-warning mr-2" disabled={this.state.generatePasswordDisabled} onClick={() => { this.setState({ loadCompanyDetails: true, generatePasswordDisabled: true }); this.generatePassword() }} ><i className="fa fa-key"></i> Generate Password</button>
                  <button type="submit" className="btn btn-outline-success mr-2" ><i className="fa fa-floppy-o"></i> Save</button>
                  <button type="button" className="btn btn-outline-danger" data-dismiss="modal"><i className="fa fa-times"></i> Close</button>
                </div>
              </FormWithConstraints>
            </div>
          </div>
        </div>
        {/*Online Order Details Modal section End */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.updateCredentials;
};
export default connect(mapStateToProps, actionCreators)(UpdateCredentials);