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
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField,
  Grid,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  IconButton
} from "@material-ui/core";
import { omit } from "lodash-es";
import DataTable from "react-data-table-component";

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
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
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
    this.onOpenModal();
  }

  displayUserInfoForAll = (user) => {
    this.setState({
      usersUserName: user[2],
      userEmail: user[4],
      userId: user[3],
      updateUserNameAndEmailStatus: ''

    })
    this.onOpenModal();
  }

  displayUserInfoForResendInvitation = (user) => {
    this.setState({
      usersUserName: user[6],
      userEmail: user[2],
      userId: user[3],
      updateUserNameAndEmailStatus: ''

    })
    this.onOpenModal();
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
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  onCloseModal=()=>{
    this.setState({
      openModal:false
    })
  }
  onOpenModal=()=>{
    this.setState({
      openModal:true
    })
  }
  render() {
    const { checked } = this.state;
    const { searchQuery, page, rowsPerPage } = this.state;
    const filteredData = this.props.userList.filter((entry) =>
      Object.values(entry).some((val) =>
        val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
 const columns = [
  {
    name: 'Invite',
    cell: (row, index) =>
      (row.createdBy?.isInvited ?? row.isInvited) === 'Y' ? (
        <></>
      ) : (
        <input
          type="checkbox"
          id={`checkbox${index}`}
          onChange={e => this.inviteVendorCheckboxHandler(e, row, index)}
          checked={this.state.checked?.[index] || false}
        />
      ),
    button: true,
    ignoreRowClick: true,
    omit: this.state.requestedUsersType === 'internaluser', // ❌ Hide for internal users
  },
  {
    name: this.state.requestedUsersType === 'internaluser' ? 'Employee Code' : 'Vendor Code',
    selector: row =>
      this.state.requestedUsersType === 'internaluser'
        ? row.userName
        : row.createdBy?.partner?.vendorSapCode || '',
    sortable: true,
  },
  {
    name: 'Email',
    selector: row =>
      this.state.requestedUsersType === 'internaluser'
        ? row.email
        : row.createdBy?.email || '',
    sortable: true,
  },
  {
    name: 'Company Name',
    selector: row => row.createdBy?.partner?.name || '',
    sortable: true,
    omit: this.state.requestedUsersType === 'internaluser',
  },
  {
    name: 'Status',
    selector: row => statusForVendor(row.createdBy?.partner?.status),
    sortable: true,
    omit: this.state.requestedUsersType === 'internaluser',
  },
  {
    name: 'State',
    selector: row => row.location?.region?.name || '',
    sortable: true,
    omit: this.state.requestedUsersType === 'internaluser',
  },
  {
    name: 'District',
    selector: row => row.location?.district?.name || '',
    sortable: true,
    omit: this.state.requestedUsersType === 'internaluser',
  },
  {
    name: 'Designation',
    selector: row => row.email || '',
    sortable: true,
    omit: this.state.requestedUsersType !== 'internaluser',
  },
  {
    name: 'Department',
    selector: row => row.partner?.name || '',
    sortable: true,
    omit: this.state.requestedUsersType !== 'internaluser',
  },
  {
    name: 'Plant',
    selector: row => row.partner?.panNumber || '',
    sortable: true,
    omit: this.state.requestedUsersType !== 'internaluser',
  },
  {
    name: 'Edit',
    cell: (row) => (
      <button
        className={`btn btn-outline-info ${this.state.editButtonFlag ? 'not-allowed' : ''}`}
        type="button"
        disabled={this.state.editButtonFlag}
        onClick={() => this.displayUserInfo(row)}
      >
        <i className={`fa fa-pencil-square-o ${this.props.displayDiv}`} aria-hidden="true" />
      </button>
    ),
    ignoreRowClick: true,
    button: true,
  },
];

    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        {<UserDashboardHeader />}
        <div className="wizard-v1-content" style={{marginTop:"80px"}}>
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
                <div class="col-9 col-md-9 col-lg-9 pr-0">                
                  <div class="form-group form-inline" style={{ marginTop: "5px" }}>    
                  <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "ALL")} class="custom-control-input" id="all" name={"courier"} value="ALL" checked={this.state.defaultOption === "ALL"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="all">All</label>
                    </div>               
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "RG")} class="custom-control-input" id="rg" name={"courier"} value="RG" checked={this.state.defaultOption === "RG"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="rg">Registered Vendors</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "NRG")} class="custom-control-input" id="nrg" name={"courier"} value="NRG" checked={this.state.defaultOption === "NRG"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="nrg">Un-Registered Vendors Invited</label>
                    </div>
                    
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "IN")} class="custom-control-input" id="in" name={"courier"} value="IN" checked={this.state.defaultOption === "IN"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="in"> Invited Vendor List (Invited)</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "RESEND")} class="custom-control-input" id="resend" name={"courier"} value="RESEND" checked={this.state.defaultOption === "RESEND"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="resend">Resend Invitation for Vendor (Invited)</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" onChange={e => this.checkboxHandler(e, "internaluser")} class="custom-control-input" id="internaluser" name={"courier"} value="internaluser" checked={this.state.defaultOption === "internaluser"} />
                      <label class="custom-control-label" style={{ fontSize: "13px", fontWeight: "700" }} for="internaluser">Internal Users</label>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-12 col-lg-12 pl-0">
                  <div className={"text-center " + this.props.displayDiv} style={{ marginTop: "5px" }}>
                    <Button type="button" size="small" variant="contained" color="primary" onClick={() => { this.setState({ loadCompanyDetails: true }); this.getUser() }} >Search</Button>
                  </div>
                </div>
              </div>
              
            </FormWithConstraints>
          </div>

          <div className={"mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption === "ALL" || this.state.defaultOption === "RESEND" ? "display_none" : "display_block")}>
          
          
           <Grid container spacing={2} alignItems="center" justify="flex-end">
                        <Grid item xs={9} style={{textAlign:"left"}}>
                          <Button variant="contained" size="small" color="primary" onClick={this.inviteVendorsForLogin}>
                          <i className="fa fa-envelope"></i>&nbsp;Send Invite
                          </Button> {this.state.loginGeneratedResponseMessage}
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                            style={{ fontSize: "10px", float:"right" }}
                          />
                          {/* <IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton> */}
                        </Grid>
                      </Grid>
            <TableContainer className="mt-1">
                    {/* <Table className="my-table">
                      <TableHead>
                        <TableRow>

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <TableCell>Invite</TableCell>
                            </>
                          }


                          <TableCell> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</TableCell>
                          <TableCell>Email</TableCell>


                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <TableCell>Company name</TableCell>
                              <TableCell>Status</TableCell>
                            </>
                          }

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <TableCell>State</TableCell>
                              <TableCell>District</TableCell>
                            </>
                          }

                          {this.state.requestedUsersType === "internaluser" &&
                            <>
                              <TableCell>Designation</TableCell>
                              <TableCell>Department</TableCell>
                              <TableCell>Plant</TableCell>
                            </>
                          }
                          <TableCell>Edit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                          <TableRow>


                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell> {(user.createdBy != null ? user.createdBy.isInvited : user.isInvited) === 'Y' ? <></> :

                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandler(e, user, index)} checked={checked[index] || false} />

                                }</TableCell>
                              </>
                            }

                            <TableCell>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? user.createdBy.partner.vendorSapCode : <></>}</> : <>{user.userName}</>}</TableCell>
                            <TableCell>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null ? user.createdBy.email : <></>}</> : <>{user.email}</>}</TableCell>


                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? user.createdBy.partner.name : <></>}</> : <>{user.partner.name}</>}</TableCell>
                                
                                <TableCell>{this.state.requestedUsersType !== "internaluser" ? <>{user.createdBy != null && user.createdBy.partner ? statusForVendor(user.createdBy.partner.status) : <></>}</> : <>{statusForVendor(user.partner.status)}</>}</TableCell>
                              </>
                            }
                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell>{user.location ? user.location.region ? user.location.region.name : "" : ""}</TableCell>

                                <TableCell>{user.location ? user.location.district ? user.location.district.name : "" : ""}</TableCell>
                              </>
                            }
                            {
                              this.state.requestedUsersType === "internaluser" &&
                              <>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.partner.name}</TableCell>
                                <TableCell>{user.partner.panNumber}</TableCell>
                              </>
                            }


                            <TableCell>

                              <button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")}  type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfo(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                
                              </button>
                            </TableCell>

                          </TableRow>
                        ))}

                      </TableBody>
                    </Table> */}

                   
            {/* <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            /> */}
         <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={50}  
            paginationRowsPerPageOptions={[10, 25, 50, 100]} 
            //onRowClicked={this.handleRowClick}
          />
                 </TableContainer>
                {/* {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button> */}
                
              </div>
            

          {/* FOR ALL CATEGORY */}
          <div className={"mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption !== "ALL" ? "display_none" : "display_block")}>
            
             <Grid container spacing={2} alignItems="center" justify="flex-end">
                        <Grid item xs={9} style={{textAlign:"left"}}>
                        <Button variant="contained" size="small" color="primary" onClick={this.inviteVendorsForLogin}>
                          <i className="fa fa-envelope"></i>&nbsp;Send Invite
                          </Button> {this.state.loginGeneratedResponseMessage}
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                            style={{ fontSize: "10px", float:"right" }}
                          />
                          <IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
                        </Grid>
                      </Grid>
            <TableContainer className="mt-1">
                    <Table className="my-table">
                      <TableHead>
                        <TableRow>

                          {this.state.requestedUsersType !== "internaluser" &&
                            <>
                              <TableCell>Invite</TableCell>
                            </>
                          }


                          <TableCell> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</TableCell>
                          <TableCell>Email</TableCell>
                          <>
                            <TableCell>Company name</TableCell>
                            {/* <th style={{ width: "150px" }}>PAN No</TableCell> */}
                            <TableCell>Status</TableCell>
                          </>
                          <>
                            <TableCell>State</TableCell>
                            {/* <th style={{ width: "150px" }}>PAN No</TableCell> */}
                            <TableCell>District</TableCell>
                          </>


                          {/* <th style={{ width: "150px" }}>Vendor SAP Code</TableCell>
                          <th style={{ width: "100px" }}>is Invited</TableCell> */}
                          <TableCell>Edit</TableCell>
                          {/* <th className={this.props.displayDiv}>Delete</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                          <TableRow>


                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell> {(user[7] === 'Y') ? <></> :

                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandlerForAll(e, user, index)} checked={checked[index] || false} />

                                }</TableCell>
                              </>
                            }

                            <TableCell>{<>{user[2]}</>}</TableCell>
                            <TableCell>{user[4]}</TableCell>

                            {/* <td style={{ width: "150px" }}>{user.partner.vendorSapCode}</TableCell>
                            <td style={{ width: "100px" }}>{user.partner.isInvited}</TableCell> */}




                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell>{user[1]}</TableCell>
                                {/* <td style={{ width: "150px" }}>{user.partner.panNumber}</TableCell> */}
                                <TableCell>{statusForVendor(user[8])}</TableCell>
                              </>
                            }
                            <TableCell>{user[6]}</TableCell>

                            <TableCell>{user[5]}</TableCell>


                            <TableCell>

                              <button 
                              className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} type="button" disabled={this.state.editButtonFlag ? true : false} 
                              onClick={() => { this.displayUserInfoForAll(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>                             

                              </button>
                            </TableCell>

                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                    </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
         
                {/* {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button> */}
                <div className="clearfix"></div>  </div>
          {/* FOR ALL CATEGORY */}

          {/* FOR RESEND INVITATION CATEGORY */}
          <div className={"mb-1 " + (isEmpty(this.props.userList) || this.state.defaultOption !== "RESEND" ? "display_none" : "display_block")}>
             
             <Grid container spacing={2} alignItems="center" justify="flex-end">
                        <Grid item xs={9} style={{textAlign:"left"}}>
                        <Button variant="contained" size="small" color="primary" onClick={this.inviteVendorsForLogin}>
                          <i className="fa fa-envelope"></i>&nbsp;Send Invite
                          </Button>
                          {this.state.loginGeneratedResponseMessage}
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                            style={{ fontSize: "10px", float:"right" }}
                          />
                          <IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
                        </Grid>
                      </Grid>
            <TableContainer className="mt-1">
                    <Table className="my-table">
                      <TableHead>
                        <TableRow>
                          {this.state.requestedUsersType !== "internaluser" &&
                            <TableCell>Invite</TableCell>
                          }
                          <TableCell> {this.state.requestedUsersType == "internaluser" ? "Employee Code" : "Vendor Code"}</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Company name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Edit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                          <TableRow>
                            {this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell>
                                  <input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandlerForAll(e, user, index)} checked={checked[index] || false} />
                                </TableCell>
                              </>
                            }
                            <TableCell>{<>{user[6]}</>}</TableCell>
                            <TableCell>{<>{user[2]}</>}</TableCell>
                            {
                              this.state.requestedUsersType !== "internaluser" &&
                              <>
                                <TableCell>{user[1]}</TableCell>
                                {/* <td style={{ width: "150px" }}>{user.partner.panNumber}</TableCell> */}
                                <TableCell>{statusForVendor(user[5])}</TableCell>
                              </>
                            }
                            <TableCell>
                              <button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} data-toggle="modal" data-target="#EditUserInfo" type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfoForResendInvitation(user) }} >
                                <i
                                  className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                  aria-hidden="true"
                                ></i>
                                {/* <i
                                  className={"fa fa-eye " + this.props.displayDiv1}
                                  aria-hidden="true"
                                ></i> */}
                              </button>
                            </TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> 
                    </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
         
                
                {/* {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick={() => { this.setState({ vendorLogInBtnClick: true }); this.inviteVendorsForLogin() }}><i className="fa fa-envelope"></i>&nbsp;Send Invite</button> */}
                </div>
        </div>

        
        {/* Online Order Details modal sections start*/}
        {this.state.openModal && 
            <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
                                    <div className="modal-backdrop"></div><div className="modal-dialog modal-lg">
                                       <div className="modal-content">

              <FormWithConstraints ref={formWithConstraints => this.comDetForm = formWithConstraints}
                onSubmit={(e) => { this.changeLoaderState(true); this.setState({ loadCompanyDetails: true, updatingInformation: true, generatePasswordDisabled: true }); commonSubmitForm(e, this, "updateUserNameAndEmailOfUser", "/rest/updateUserNameOrEmail", "comDetForm") }} noValidate >



                <div className="modal-header">
                  <h4 className="modal-title col-sm-4">Edit </h4>

                  <div className="col-sm-4 buttons-depot-order-details">
                    <button type="button" className="close" onClick={this.onCloseModal}>&times;</button>
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
                  <button type="button" className="btn btn-outline-danger" onClick={this.onCloseModal}><i className="fa fa-times"></i> Close</button>
                </div>
              </FormWithConstraints>
            </div>
          </div>
        </div>}
        {/*Online Order Details Modal section End */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.updateCredentials;
};
export default connect(mapStateToProps, actionCreators)(UpdateCredentials);