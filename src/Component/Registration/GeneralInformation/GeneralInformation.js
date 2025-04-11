import React, { Component } from "react";
import serialize from "form-serialize";
import { connect } from 'react-redux';
import { isEmpty } from "../../../Util/validationUtil";
import * as actionCreators from "../../Registration/GeneralInformation/Action";
import {
  commonSubmitForm, commonHandleChange, commonSubmitWithParam,resetForm,
  commonHandleChangeCheckBox, getObjectFromPath, commonSubmitFormWithValidation
} from "../../../Util/ActionUtil"
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { saveUserFormApi } from "../../../Util/APIUtils";
import swal from 'sweetalert';
import { Button } from "@material-ui/core";

class GeneralInformation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      falgForOtherCountry:false,
      isPrimaryAccount: false,
      disablePrimaryAccountFlag:false,
      countryFlag: false,
      loaderFlag: true,
      editButtonFlag: false,
      editContactFlag:false,
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
        selectedIndex:null
      }

    }

  }

  isEmptyObject = (obj) => {
    return (obj === undefined || obj === null || obj == {} || Object.keys(obj) <= 0) ? true : false;
  }

  loadAddress = (addressObj) => {
    let addr = this.getAddressFromFobj(addressObj)
    // console.log(addressObj);
    this.setState({
      loadAddressDetails: false,
      addressDetails: addr
    });
  }

  loadAddressForEdit = (index,addr) => {
   
    let addressObj = this.state.addressArray[index];
    let curAddr = addressObj;
    //let selectedAddr = "selectedAddress"+index
    // console.log("12345",addressObj);
    if(addressObj.country!=1){

      // console.log("account selected");
      this.setState({

        countryFlag:true
      })
    }
    this.setState({
      // stateList: [],
      // districtList: [],
      editButtonFlag: true,
      selectedIndex:index
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
    let state;
    let district;


    if (isEmpty(addressObj.location.country.name)) {

      countryName = this.state.countryMap[addressObj.location.country.countryId]
    } else {
      countryName = addressObj.location.country.name;
    }

    if (!(this.isEmptyObject(addressObj.location.region))) {
      if (isEmpty(addressObj.location.region.name)) {
        regionName = this.state.stateMap[addressObj.location.region.regionId]
        //new code for state
        state=addressObj.location.region.regionId;
      } else {
        regionName = addressObj.location.region.name;
        state=addressObj.location.region.regionId;
      }
    }

    if (!(this.isEmptyObject(addressObj.location.district))) {
      if (isEmpty(addressObj.location.district.name)) {
        districtName = this.state.districtMap[addressObj.location.district.districtId]
        //new code for district
        district= addressObj.location.district.districtId;
      } else {
        districtName = addressObj.location.district.name;
        district= addressObj.location.district.districtId;
      }
    }

    let newAddress = {
      partnerCompanyAddressId: addressObj.partnerCompanyAddressId,
      locationId: addressObj.location.locationId,
      address1: addressObj.location.address1,
      address2: addressObj.location.address2,
      address3: addressObj.location.address3,
      country: addressObj.location.country.countryId,
      countryName: countryName,
      state: state,
      stateName: regionName,
      district: district,
      districtName: districtName,
      postalCode: addressObj.location.postal,
      isPrimaryAccount: addressObj.isPrimaryAccount=== "Y"

    }
    return newAddress;
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
      editContactFlag: true
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
    if(country!=1)
    {
      
      this.setState({
        countryFlag:true
      }) 
    }else{
      this.setState({
        countryFlag:false
      }) 

    }
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
    // console.log("get parner",this.props);
    if (!isEmpty(this.props.partner)) {
      return this.props.partner.partnerId;
    } else {
      return "";
    }
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
    resetForm(this.addrDetForm);  
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
        isReceiveACInfo: false
      }
    });
    resetForm(this.contDetForm)
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
    setTimeout(function () {
      this.props.getGeneralInfo("generalInformation");
      this.setState({
        loadCompanyDetails: true,
        loadAddressList: true, 
        newButtonFlag: true,
        loadCompanyContactDetailsList: true, 
      })
      commonSubmitWithParam(this.props, "populateCompanyDetails", "/rest/getCompanyDetails", this.getPartnerId());
      commonSubmitWithParam(this.props, "getCompAddressInformation", "/rest/getCompanyAddressInfo", this.getPartnerId()) ;
      commonSubmitWithParam(this.props, "getContactDetails", "/rest/getCompanyContactDetails", this.getPartnerId()) ;
      
    }.bind(this), 1000)

  }

  async componentWillReceiveProps(props) {
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
        if(isEmpty(address.location.region)){
          // console.log("hello");
          this.setState({
            // disablePrimaryAccountFlag:true
            falgForOtherCountry:true,
          })
        }
        
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
      // console.log('will receive props',props.addressDetails)
      
      // this.loadAddress(props.addressDetails);
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
      

      // this.loadContact(props.contactDetails);
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

  handleContDetFormSave = (e) => {
    this.setState({ loadCompanyContactDetails: true, newButtonFlag: false, editContactFlag: false }); 
    commonSubmitForm(e, this, "saveContactDetailsResp", "/rest/saveCompanyContactDetails", "contDetForm")
  }


  render() {
    return (

      <div id="accordion" style={{marginTop:"80px"}}>
        <div className="card">
          <div className="card-header">
            {/* <a className="card-link" data-toggle="collapse" href="#collapseOne">
              Company Details
            </a> */}
             Company Details
          </div>

          <div id="collapseOne" class="collapse show" data-parent="#accordion">
            <div class="card-body">
              <FormWithConstraints ref={formWithConstraints => this.comDetForm = formWithConstraints}
                onSubmit={(e) => { this.setState({ loadCompanyDetails: false }); commonSubmitForm(e, this, "saveCompanyDetailResp", "/rest/saveCompanyDetails", "comDetForm") }} noValidate >
                {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveCompanyDetailResp","/rest/saveCompanyDetails")}}> */}
                <input type="hidden" name="bPartnerId" value={this.getPartnerId()} />
                <div className="row">
                  <label className="col-sm-2">Type of Organization <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} name="companyType" required
                      value={this.state.companyDetails.companyType}
                      onChange={(event) => commonHandleChange(event, this, "companyDetails.companyType", "comDetForm")}>
                      <option value="">Select</option>
                      {(this.state.companyTypeList).map(companyType =>
                        <option value={companyType.value}>{companyType.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="companyType">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>

                  <label className="col-sm-2">Vendor Type <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} name="vendorType" required
                      value={this.state.companyDetails.vendorType}
                      onChange={(event) =>{ commonHandleChange(event, this, "companyDetails.vendorType", "comDetForm"); this.props.changeManufacturerFlag(event.target.value);}}>
                      <option value="">Select</option>
                      {(this.state.vendorTypeList).map(vendorType =>{
                      return   <option value={vendorType.value}>{vendorType.display}</option>
  })}
                    </select>
                    <FieldFeedbacks for="vendorType">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-2">Vendor Name <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" className={"form-control " + this.props.readonly} required
                      name="name" value={this.state.companyDetails.vendorName}
                      onChange={(event) => { 
                        if(event.target.value.length > 60) return null;
                        commonHandleChange(event, this, "companyDetails.vendorName", "comDetForm")
                       }} />
                  </div>
                  <FieldFeedbacks for="name">
                    <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks>
                </div>
                <div className={"col-sm-12 text-center " + this.props.displayDiv}>
                  <Button size="small" variant="contained" color="primary" type="submit" className="mr-1">Save</Button>
                  <Button size="small" variant="contained" color="secondary" type="button" className="mr-1" onClick={() => { this.setState({ loadCompanyDetails: true });  commonSubmitWithParam(this.props, "populateCompanyDetails", "/rest/getCompanyDetails", this.getPartnerId());resetForm(this.comDetForm); }} >Cancel</Button>
                </div>
              </FormWithConstraints>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            {/* <a
              className="collapsed card-link"
              data-toggle="collapse"
              href="#collapseTwo"
              onClick={() => { this.setState({ loadAddressList: true, newButtonFlag: true }); commonSubmitWithParam(this.props, "getCompAddressInformation", "/rest/getCompanyAddressInfo", this.getPartnerId()) }}
            >
              Address Details
            </a> */}
             Address Details
          </div>
          {/* <div id="collapseTwo" className="collapse" data-parent="#accordion" > */}
          <div>
            <div className="card-body">
              {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveAddressDetailsResp","/rest/saveCompanyAddress")}} > */}
              <FormWithConstraints ref={formWithConstraints => this.addrDetForm = formWithConstraints}
                onSubmit={(e) => { this.setState({ loadAddressDetails: true, editButtonFlag: false, newButtonFlag: false }); commonSubmitForm(e, this, "saveAddressDetailsResp", "/rest/saveCompanyAddress", "addrDetForm"); }} noValidate >
                <input type="hidden" name="partner[bPartnerId]" value={this.getPartnerId()} />
                <input type="hidden" name="partnerCompanyAddressId" value={this.state.addressDetails.partnerCompanyAddressId} />
                <input type="hidden" name="location[locationId]" value={this.state.addressDetails.locationId} />

                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      className="form-check-input" disabled={this.state.disablePrimaryAccountFlag} name="isPrimaryAccount"
                      value="Y" 
                      checked={this.state.addressDetails.isPrimaryAccount}
                      onChange={(e) => { commonHandleChangeCheckBox(e, this, "addressDetails.isPrimaryAccount") }}
                    />
                    Is Primary Address
                    </label>
                </div><br />
                <div className="row">
                  <label className="col-sm-2">Address Line 1</label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.addressDetails.address1} name="location[address1]"
                      onChange={(event) => {
                        if(event.target.value.length <= 40) commonHandleChange(event, this, "addressDetails.address1") 
                       }} className={"form-control " + this.props.readonly} />
                       <FieldFeedbacks for="location[address1]">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/^.{0,40}$/.test(value)}>only 40 characters are allowed</FieldFeedback>
                      </FieldFeedbacks>
                  </div>
                  <label className="col-sm-2">Address Line 2</label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.addressDetails.address2} name="location[address2]"
                      onChange={(event) => { {
                        if(event.target.value.length <= 40)  commonHandleChange(event, this, "addressDetails.address2") 
                      }}} className={"form-control " + this.props.readonly} />
                     <FieldFeedbacks for="location[address2]">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/^.{0,40}$/.test(value)}>only 40 characters are allowed</FieldFeedback>
                      </FieldFeedbacks>
                  </div>
                </div>
                <br />
                <div className="row">
                  <label className="col-sm-2">Address Line 3</label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.addressDetails.address3} name="location[address3]"
                      onChange={(event) => { {
                        if(event.target.value.length <= 40) commonHandleChange(event, this, "addressDetails.address3") 
                       }}} className={"form-control " + this.props.readonly} />
                       <FieldFeedbacks for="location[address3]">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/^.{0,40}$/.test(value)}>only 40 characters are allowed</FieldFeedback>
                      </FieldFeedbacks>
                  </div>
                </div>
                <br />
                <div className="row">
                  <label className="col-sm-2">Country <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} name="location[country][countryId]" required
                      value={this.state.addressDetails.country}
                      onChange={(e) => { this.handleChangeCountry(e.target.value); this.addrDetForm.validateFields(e.target) }}>
                      <option value="">Select</option>
                      {(this.state.countryList).map(country =>
                        <option value={country.value}>{country.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="location[country][countryId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks>
                  </div>
                  <label className="col-sm-2">State <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} disabled={this.state.countryFlag} name="location[region][regionId]" required={!this.state.countryFlag} 
                      value={this.state.addressDetails.state}
                      onChange={(e) => { this.handleChangeState(e.target.value); this.addrDetForm.validateFields(e.target) }}>
                      <option value="">Select</option>
                      {(this.state.stateList).map(state =>
                        <option value={state.value}>{state.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="location[region][regionId]">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>
                <br />
                <div className="row">
                  <label className="col-sm-2">District <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} disabled={this.state.countryFlag} name="location[district][districtId]" required={!this.state.countryFlag} 
                      value={this.state.addressDetails.district}
                      onChange={(e) => { commonHandleChange(e, this, "addressDetails.district", "addrDetForm"); }}>
                      <option value="">Select</option>
                      {(this.state.districtList).map(district =>
                        <option value={district.value}>{district.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="location[district][districtId]">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <label className="col-sm-2">Postal Code <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.addressDetails.postalCode}  name="location[postal]" required
                      onChange={(e) => { commonHandleChange(e, this, "addressDetails.postalCode", "addrDetForm"); }} className={"form-control numberOnly Noreadonly" + this.props.readonly} />
                    <FieldFeedbacks for="location[postal]">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{6}$/.test(value)}>Number Should be 6 digits</FieldFeedback>
                    </FieldFeedbacks>
                  </div>

                </div>
                <div className={"col-sm-12 text-center " + this.props.displayDiv}>
                  <Button size="small" variant="contained" color="primary" type="submit" className="btn btn-success mr-1">Save</Button>
                  <Button size="small" variant="contained" color="secondary" type="button" onClick={() => { this.resetaddressDetails(); this.setState({ editButtonFlag: false,countryFlag:false}) }} className="btn btn-danger mr-1">Clear</Button>
                  <Button size="small" variant="contained" color="primary" type="button"className={this.state.newButtonFlag ? "btn btn-primary not-allowed" : "btn btn-primary"} disabled={this.state.newButtonFlag}  
                  onClick={()=>{this.resetaddressDetails(); }  }>
                    New &nbsp;<i className="fa fa-plus" aria-hidden="true"></i>
                  </Button>
                </div>
              </FormWithConstraints>
              <div className="row">
                <div className="col-sm-12 mt-3">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Address </th>
                        <th>Country</th>
                        <th>Primary Address</th>
                        <th>Postal Code</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Edit</th>
                        <th className={this.props.displayDiv}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.addressArray.map((addr, index) =>{
                        return (
                        <tr className={this.state["selectedAddress" + index]}>
                          <td>{addr.address1 + ", " + addr.address2 + ", " + addr.address3}</td>
                          <td>{addr.countryName}</td>
                          <td>{addr.isPrimaryAccount?"YES":"NO"}</td>
                          <td>{addr.postalCode} </td>
                          <td>{addr.stateName}</td>
                          <td>{addr.districtName}</td>
                          <td>
                            <Button className={this.state.editButtonFlag ? "not-allowed" : ""} size="small" variant="contained" color="primary" type="button" disabled={this.state.editButtonFlag  ? true : false} onClick={() => { this.loadAddressForEdit(index,addr) }} >
                              <i
                                className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                aria-hidden="true"
                              ></i>
                              <i
                                className={"fa fa-eye " + this.props.displayDiv1}
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </td>
                          <td className={this.props.displayDiv}>
                            <Button size="small" variant="contained" color="secondary" type="button" onClick={() => { this.swalWithPromptDeleteforCompanyAddress(addr.partnerCompanyAddressId); }}>
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </Button>
                          </td>
                        </tr>
                      )})}

                    </tbody>
                  </table>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            Contact Details
          </div>
          {/* <div id="collapseThree" className="collapse" data-parent="#accordion"> */}
          <div>
            <div className="card-body">
              {/* <form onSubmit={(e)=> {commonSubmitForm(e,this.props,"saveContactDetailsResp","/rest/saveCompanyContactDetails")}}> */}
              <FormWithConstraints ref={formWithConstraints => this.contDetForm = formWithConstraints}
                onSubmit={this.handleContDetFormSave} noValidate >
                <input type="hidden" name="partner[bPartnerId]" value={this.getPartnerId()} />
                <input type="hidden" name="userDetailsId" value={this.state.contactDetails.userDetailsId} />
                <div className="row">
                  <label className="col-sm-2">Salutation <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <select className={"form-control " + this.props.readonly} name="title" value={this.state.contactDetails.title} required
                      onChange={(e) => { commonHandleChange(e, this, "contactDetails.title","contDetForm") }}>
                      <option value="">Select</option>
                      {(this.state.titleList).map(title =>
                        <option value={title.value}>{title.display}</option>
                      )};
                 </select>
                    <FieldFeedbacks for="title" stop="first-error">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <label className="col-sm-2">Person Name  <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.contactDetails.personName} name="name" required
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.personName", "contDetForm") }} class={"form-control " + this.props.readonly} />
                    <FieldFeedbacks for="name">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/(?!^\d+$)^.+$/.test(value)}>Person Name Cannot be Number Alone</FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>
                <br />
                <div className="row">
                  <label className="col-sm-2">Designation  <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.contactDetails.designation} name="userDesignation" required
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.designation", "contDetForm") }} className={"form-control " + this.props.readonly} />
                    <FieldFeedbacks for="userDesignation">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/(?!^\d+$)^.+$/.test(value)}>Designation Cannot be Number Alone</FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <label className="col-sm-2">Department  <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.contactDetails.department} name="userDept" required
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.department", "contDetForm") }} className={"form-control " + this.props.readonly} />
                    <FieldFeedbacks for="userDept">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when={value => !/(?!^\d+$)^.+$/.test(value)}>Deaprtment Name Cannot be Number Alone</FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>
                <br />
                <div className="row">
                  <label className="col-sm-2">Mobile No  <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.contactDetails.mobileNo} name="mobileNo" required
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.mobileNo", "contDetForm") }} className={"form-control "} readOnly={this.props.readOnly}/>
                    <FieldFeedbacks for="mobileNo">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)}>Number Should be 10 digits</FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                  <label class="col-sm-2">Telephone No </label>
                  <div class="col-sm-3">
                    <input type="text" value={this.state.contactDetails.telephoneNo} name="telephone1" 
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.telephoneNo", "contDetForm") }} className={"form-control "} readOnly={this.props.readOnly}/>
                    {/* <FieldFeedbacks for="telephone1">
                      <FieldFeedback when={(value)=>isEmpty(value)}>Mandatory</FieldFeedback> */}
                      {/* <FieldFeedback when={value => !/^[0-9]+$/.test(value)}>Please enter valid Telephone Number</FieldFeedback> */}
                    {/* </FieldFeedbacks> */}
                  </div>
                </div>
                <br />
                <div className="row">
                  {/* <label className="col-sm-2">Fax No</label>
                <div className="col-sm-3">
                  <input type="text" value={this.state.contactDetails.faxNo} name="fax1"
                  onChange={(event)=>{commonHandleChange(event,this,"contactDetails.faxNo")}} className={"form-control "+this.props.readonly} />
                </div> */}
                  <label className="col-sm-2">Mail ID  <span className="redspan">*</span></label>
                  <div className="col-sm-3">
                    <input type="text" value={this.state.contactDetails.email} name="email" required
                      onChange={(event) => { commonHandleChange(event, this, "contactDetails.email", "contDetForm") }} className={"form-control "} readOnly={this.props.readOnly}/>
                    <FieldFeedbacks for="email">
                      <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                      <FieldFeedback when={value => !/\S+@\S+.\S/.test(value)}>Invalid email address.</FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div><br/>
                <span> Please select appropriate checkbox for receiving : </span>
                <div className="row">
                  <div className="col-sm-12 display_inline_flex">
                    <div className="form-check mr-4 ">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          disabled={this.props.disabled} value="Y" name="isReceiveEnquiry"
                          checked={this.state.contactDetails.isReceiveEnquiry}
                          onChange={(e) => { commonHandleChangeCheckBox(e, this, "contactDetails.isReceiveEnquiry") }}
                        />
                        Enquiry
                    </label>
                    </div>

                    <div className="form-check mr-4">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          disabled={this.props.disabled} value="Y" name="isReceivePO"
                          checked={this.state.contactDetails.isReceivePO}
                          onChange={(e) => { commonHandleChangeCheckBox(e, this, "contactDetails.isReceivePO") }}
                        />
                        Purchase Order
                    </label>
                    </div>
                    <div className="form-check mr-4">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input" disabled={this.props.disabled} name="isReceiveACInfo"
                          value="Y"
                          checked={this.state.contactDetails.isReceiveACInfo}
                          onChange={(e) => { commonHandleChangeCheckBox(e, this, "contactDetails.isReceiveACInfo") }}
                        />
                        A/C Related Information
                    </label>
                    </div>
                  </div>
                </div>
                <div className={"col-sm-12 text-center " + this.props.displayDiv}>
                  <Button size="small" variant="contained" color="primary" type="submit" className="mr-1">Save</Button>
                  <Button size="small" variant="contained" color="secondary" type="button" onClick={() => { this.resetContactDetails(); this.setState({ editContactFlag: false }) }} className="mr-1" >Clear</Button>
                  <Button size="small" variant="contained" color="primary" type="button" onClick={() => this.resetContactDetails()} className={this.state.newButtonFlag ? "btn btn-primary not-allowed" : "btn btn-primary"} disabled={this.state.newButtonFlag}>
                    New &nbsp;<i className="fa fa-plus" aria-hidden="true"></i>
                  </Button>
                </div>
              </FormWithConstraints>
              <div className="row">
                <div className="col-sm-12 mt-4">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Salutation</th>
                        <th>Person Name</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Mobile No</th>
                        <th>Telephone No</th>
                        {/* <th>Fax No</th> */}
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
                            <Button className={this.state.editContactFlag ? "not-allowed" : ""} type="button" disabled={this.state.editContactFlag ? true : false} onClick={() => { this.loadContactForEdit(index) }}>
                              <i
                                className={"fa fa-pencil-square-o " + this.props.displayDiv}
                                aria-hidden="true"
                              ></i>
                              <i
                                className={"fa fa-eye " + this.props.displayDiv1}
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </td>
                          <td className={this.props.displayDiv}>
                            <Button size="small" variant="contained" color="secondary" type="button" onClick={() => { this.swalWithPromptDeleteforContactDetails(contact.userDetailsId) }}>
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </Button>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.generalInfo;
};
export default connect(mapStateToProps, actionCreators)(GeneralInformation);