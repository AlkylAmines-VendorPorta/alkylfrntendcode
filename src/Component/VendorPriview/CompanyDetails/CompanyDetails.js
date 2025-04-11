import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import {connect} from 'react-redux';
import { isEmpty} from "../../../Util/validationUtil";
import {formatDateWithoutTime} from "../../../Util/DateUtil"
import * as actionCreators from "../../Registration/CompanyDetails/Action";
import { 
          commonSubmitForm, commonSetState, commonSubmitWithParam, commonHandleFileUpload, commonHandleChange 
        , getObjectFromPath,
        swalPrompt,
        resetForm
      } from "../../../Util/ActionUtil";
      
// import DatePick 
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import swal from 'sweetalert';
import Loader from "../../FormElement/Loader/LoaderWithProps";

class CompanyDetails extends Component {
  
  constructor (props) { 
    super(props)
    this.state = {
      editButtonFlag:false,
      selectedAddressIndex:"",
      deleteAddressFlag:false,
      currentAddress:"",
      loadFinancialYear: false,
      loadFinancialAttachments: false,
      loadAssociateCompanyDetails: false,
      loadAddressList: false,
      loadDirectorDetails:false,
      loadDirectorList:false,
      directorDetailsArray:[],
      directorDetails: {
        directorDetailsId:"",
        qualification:"",
        name:"",
        email:"",
        mobileNo:"",
        directorUID:""
      },
      financialYear1:{
        financialYearId:"",
        financialYearName: ""
      },
      turnOverId1:"",
      turnOverAmount1:"",
      balanceSheetId1:"",
      balanceSheetAttachment1:{
        attachmentid:"",
        fileName:""
      },
      profitLossId1:"",
      profitLossAttachment1:{
        attachmentid:"",
        fileName:"",
      },
      financialYear2:{
        financialYearId:"",
        financialYearName: ""
      },
      turnOverId2:"",
      turnOverAmount2:"",
      balanceSheetId2:"",
      balanceSheetAttachment2:{
        attachmentid:"",
        fileName:""
      },
      profitLossId2:"",
      profitLossAttachment2:{
        attachmentid:"",
        fileName:"",
      },
      financialYear3:{
        financialYearId:"",
        financialYearName: ""
      },
      turnOverId3: "",
      turnOverAmount3:"",
      balanceSheetId3:"",
      balanceSheetAttachment3:{
        attachmentid:"",
        fileName:""
      },
      profitLossId3:"",
      profitLossAttachment3:{
        attachmentid:"",
        fileName:"",
      },
      addressArray:[],
      associateCompanyDetails:{
        partnerCompanyAddressId:"",
        directorType:"",
        locationId:"",
        companyName:"",
        addressLine1:"",
        addressLine2:"",
        addressLine3:"",
        district:"",
        state:"",
        country:"",
        postalCode:"",
        nameOfCompany:""
      },
      otherDetails:{
        noOfEmployee:"",
        dateOfCommencement:"",
        partnerOrgId:""
      },
      countrytMap:[],
      stateMap:[],
      districtMap:[],
      addressList: [],
      countryList:[],
      districtList:[],
      stateList:[],
      directorTypeMap:[],
      directorTypeList:[],
      loadCountries: true,
      loadStates:true,
      loadDistricts:false,
      selectedDirectorIndex:"",
      currentDirector:"",
      deleteDirectorFlag:false
    }
  }
  isEmptyObject = (obj) => {
    return (obj === undefined || obj === null || obj == {} || Object.keys(obj) <= 0) ? true : false;
  }

  loadAddress = (addressObj) => {
    let addr =this.getAddressFromFobj(addressObj)
    this.setState({
      loadAssociateCompanyDetails:false,
      associateCompanyDetails:addr
    });
  }

  loadDirector = (directorObj) => {
    let director =this.getDirectorFromObj(directorObj)
    this.setState({
      loadDirectorDetails:false,
      directorDetails:director
    });
  }

  loadAddressForEdit = (index) => {
    let addressObj =this.state.addressArray[index];
    let curAddr = addressObj;
    //let selectedAddr = "selectedAddress"+index
    
    this.setState({
      stateList:[],
      districtList:[],
      editButtonFlag:true
    });
    
    let currentRowState =  getObjectFromPath("selected","selectedAddress"+index);
    this.setState(currentRowState);

    let previousRow = getObjectFromPath("",this.state.selectedAddressIndex);
    this.setState(previousRow);
    
    this.loadState(addressObj.country).then(()=>{
      this.loadDistrict(addressObj.state).then(()=>{
        this.setState({
          selectedAddressIndex: "selectedAddress"+index,
          currentAddress:addressObj,
          loadAssociateCompanyDetails:false,
          associateCompanyDetails:addressObj
        });
      });
    });
  }

  loadDirectorForEdit = (index) => {
    let directorObj =this.state.directorDetailsArray[index];
    let curDirector = directorObj;
    //let selectedAddr = "selectedAddress"+index
    
    this.setState({
      stateList:[],
      districtList:[],
      editButtonFlag:true
    });
    
    let currentRowState =  getObjectFromPath("selected","selectedDirector"+index);
    this.setState(currentRowState);

    let previousRow = getObjectFromPath("",this.state.selectedDirectorIndex);
    this.setState(previousRow);
    
    this.setState({
          selectedDirectorIndex: "selectedDirector"+index,
          currentDirector:directorObj,
          loadDirectorDetails:false,
          directorDetails:directorObj
    });
  }

  getAddressFromFobj=(addressObj)=>{
    let countryName;
    let regionName;
    let districtName;
    if(isEmpty(addressObj.location.country.name)){
      countryName = this.state.countryMap[addressObj.location.country.countryId]
    }else{
      countryName = addressObj.location.country.name;
    }

    if (!(this.isEmptyObject(addressObj.location.region))) {
    if(isEmpty(addressObj.location.region.name)){
      regionName = this.state.stateMap[addressObj.location.region.regionId]
    }else{
      regionName = addressObj.location.region.name;
    }
  }
  if (!(this.isEmptyObject(addressObj.location.region))) {
    if(isEmpty(addressObj.location.district.name)){
      districtName = this.state.districtMap[addressObj.location.district.districtId]
    }else{
      districtName = addressObj.location.district.name;
    }
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
      nameOfCompany: addressObj.nameOfCompany
    };
  }
  
  loadState=async (country)=>{
    this.setState({
      loadStates:true
    })
    commonSubmitWithParam(this.props, "populateStates", "/rest/getStateByCountry", country);
  }

  loadDistrict=async (state)=>{
    this.setState({
      loadDistricts:true
    })
    commonSubmitWithParam(this.props, "populateDistricts", "/rest/getDistrictByState", state);
  }

  handleChangeCountry(country){
      this.loadState(country).then(()=>{
        let addr = this.state.associateCompanyDetails;
        addr.country= country;
        addr.state= "";
        addr.district= "";
        this.setState({
          associateCompanyDetails: addr
        });
      });
  }

  handleChangeState(state){
    
    this.loadDistrict(state).then(()=>{
      let addr = this.state.associateCompanyDetails;
      addr.state= state;
      addr.district= "";
      this.setState({
        associateCompanyDetails: addr
      })
    });
  }

  resetaddressDetails = () => {
    this.setState({
      associateCompanyDetails:{
        partnerCompanyAddressId:"",
        directorType:"",
        locationId:"",
        companyName:"",
        address1:"",
        address2:"",
        address3:"",
        district:"",
        state:"",
        country:"",
        postalCode:"",
        nameOfCompany:""
      },
    });
    resetForm(this.asoCoDetForm);
  }
  resetPropriterDetails=()=>{
    this.setState({
      directorDetails: {
        directorDetailsId:"",
        directorType:"",
        qualification:"",
        name:"",
        email:"",
        mobileNo:"",
        directorUID:"",
        experience:""
        
      },
    })
    resetForm(this.dercForm);
  }



  getDirectorFromObj(directorObj){
    return {
      directorDetailsId: directorObj.userDetailsId,
      qualification: directorObj.qualification,
      name: directorObj.name ,
      mobileNo: directorObj.mobileNo,
      directorUID: directorObj.directorUID,
      experience: directorObj.experience,
      directorType:directorObj.directorType
    }
  }

  swalWithPromptDeleteDirDetails=(dirvalue)=>{
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
            this.setState({deleteDirectorFlag:true})
            commonSubmitWithParam(this.props,"deleteDirector","/rest/deleteDirectorDetails",dirvalue)
        }
          break;
          default:
      swal("Delete Cancelled");
  }
});

}

swalWithPromptDeleteAssoDetails=(assovalue)=>{
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
          this.setState({deleteAddressFlag:true})
          commonSubmitWithParam(this.props,"deleteAssociateAddress","/rest/deleteCompanyAddress",assovalue)
      }
        break;
        default:
    swal("Delete Cancelled");
}
});

}

submitConfirmation = () =>{
  
  commonSubmitWithParam(this.props,"submitRegistrationResponse","/rest/submitRegistration",this.props.partner.partnerId)
  
}

  async componentDidMount(){
    
    this.setState({
      loadFinancialAttachments:true,
      loadFinancialYear:true
    });
    this.setState({
      loadDirectorList:true,
      loadAddressList:true
    });
    
    commonSubmitWithParam(this.props,"getDirectorDetails","/rest/getDirectorDetails",this.props.partner.partnerId);
    commonSubmitWithParam(this.props,"otherDetailsResponse","/rest/getOtherDetails",this.props.partner.partnerId);
    commonSubmitWithParam(this.props,"getFinancialDetails","/rest/getFinancialDetails",this.props.partner.partnerId);
    commonSubmitWithParam(this.props,"CompanyContactResponse","/rest/getAssociateCompAddrInfo",this.props.partner.partnerId)
  }

  async componentWillReceiveProps(props){
    if(!isEmpty(props.companyInfo)){
      this.setState({
        companyInfo: props.companyInfo
      })
    }
    if(!isEmpty(props.directorDetails) && this.state.loadDirectorDetails){
      let directorDet = props.directorDetails;
      this.loadDirector(directorDet);
      this.setState({
        loadDirectorDetails:false
      })
      let directorAddr = this.state.directorDetailsArray;
      if(!isEmpty(directorAddr)){
        this.state.directorDetailsArray.map((director,index)=>{
          if(director.directorDetailsId===props.directorDetails.userDetailsId){
            directorAddr.splice(index, 1);
          }
        })
      }
      let dirArray =[this.getDirectorFromObj(props.directorDetails)];
      dirArray = dirArray.concat(directorAddr);
      this.setState({
        directorDetailsArray: dirArray
      })
    }
    if(!isEmpty(props.companyTypeList)){
      let companyTypeArray = Object.keys(props.companyTypeList).map((key) => {
        return {display: props.companyTypeList[key], value: key}
      });
      this.setState({
        companyTypeList: companyTypeArray
      })
    }
    
    if(!isEmpty(props.countryList && this.state.loadCountries)){
      let cntryMap = [];
      let countryArray = Object.keys(props.countryList).map((key) => {
        cntryMap[props.countryList[key].countryId]=props.countryList[key].name;
        return {display: props.countryList[key].name, value: props.countryList[key].countryId}
      });
      // console.log(cntryMap);
      this.setState({
        loadCountries:false,
        countryMap: cntryMap,
        countryList: countryArray
      })
    }
    if(this.state.loadStates){
      if(!isEmpty(props.stateList)){
        let stMap=[];
      let stateArray = Object.keys(props.stateList).map((key) => {
        stMap[props.stateList[key].regionId]=props.stateList[key].name;
        return {display: props.stateList[key].name, value: props.stateList[key].regionId}
      });
      // console.log(stMap);
      this.setState({
        loadStates:true,
        stateMap: stMap,
        stateList: stateArray
      })
      }else{
        this.setState({
          loadStates:true,
          stateMap: [],
          stateList: []
        })
      }
    }
    if(!isEmpty(props.districtList) && this.state.loadDistricts){
      let distMap =[];
      let districtArray = Object.keys(props.districtList).map((key) => {
        distMap[props.districtList[key].districtId] = props.districtList[key].name;
        return {display: props.districtList[key].name, value: props.districtList[key].districtId}
      });
      // console.log(distMap);
      this.setState({
        loadDistricts:false,
        districtMap:distMap,
        districtList: districtArray
      })
    }

    if(!isEmpty(props.directorTypeList)){
      let dirTypMap = props.directorTypeList;
      let directorTypeArray = Object.keys(dirTypMap).map((key) => {
        return {display: props.directorTypeList[key], value: key}
      });
      this.setState({
        directorTypeList: directorTypeArray,
        directorTypeMap: dirTypMap
      })
    }
    if(!isEmpty(props.associateCompanyDetails) && this.state.loadAssociateCompanyDetails){
      
      this.loadAddress(props.associateCompanyDetails);
      this.setState({
        loadAssociateCompanyDetails:false
      })
      let curAddr = this.state.addressArray;
      if(!isEmpty(curAddr)){
        this.state.addressArray.map((addr,index)=>{
          if(addr.partnerCompanyAddressId===props.associateCompanyDetails.partnerCompanyAddressId){
            curAddr.splice(index, 1);
          }
        })
      }
    
      let addrArray =[this.getAddressFromFobj(props.associateCompanyDetails)];
      addrArray = addrArray.concat(curAddr);

      this.setState({
        addressArray: addrArray
      })
    }
    
    if(!isEmpty(props.associateCompanyDetailsList) && this.state.loadAddressList){
        let addressList = [];
        props.associateCompanyDetailsList.map((address)=>{
          addressList.push(this.getAddressFromFobj(address));
        })
        this.setState({
          loadAddressList: false,
          addressArray : addressList
        })
    }

    if(this.state.deleteAddressFlag && props.currentAddress){
      let curAddr = props.currentAddress;
      let addrArr = this.state.addressArray;
      this.state.addressArray.map((addr,index)=>{
        if(addr.partnerCompanyAddressId===curAddr.partnerCompanyAddressId){
          addrArr.splice(index, 1);
        }
      })
      this.setState({
        deleteAddressFlag:false,
        addressArray:addrArr
      });
    }

    if(!isEmpty(props.directorList) && this.state.loadDirectorList){
      let directorList = [];
      props.directorList.map((director)=>{
        directorList.push(this.getDirectorFromObj(director));
      })
      this.setState({
        loadDirectorList: false,
        directorDetailsArray : directorList
      })
    }

    if(!isEmpty(props.directorDetailsId)){
      let directorDet= this.state.directorDetails;
      directorDet.directorDetailsId=props.directorDetailsId;
      this.setState({
        directorDetails: directorDet
      });
    }
      if(!isEmpty(props.otherDetails)){
        let noEmp=props.otherDetails.manPower;
        let partnerOrgId=props.otherDetails.partnerOrgId;
        let dateOfComm ="";
        if(!isEmpty(props.otherDetails.estdDate)){
          dateOfComm=formatDateWithoutTime(props.otherDetails.estdDate);
        }else{
          dateOfComm="";
        }
        
        this.setState({
          otherDetails:{
          noOfEmployee: noEmp,
          partnerOrgId:partnerOrgId,
          dateOfCommencement:dateOfComm,
          }
        
        });
      }

    
      
      if(!isEmpty(props.financialYears) && this.state.loadFinancialYear){
        let years = props.financialYears;
        this.setState({
          loadFinancialYear:false,
          
          financialYear1 : {
            financialYearId : years[0].financialYearId,
            financialYearName: years[0].name
          },
          financialYear2 : {
            financialYearId : years[1].financialYearId,
            financialYearName: years[1].name
          },
          financialYear3 : {
            financialYearId : years[2].financialYearId,
            financialYearName: years[2].name
          }
        })
      }
      
      if(this.state.deleteDirectorFlag && props.currentDirector){
        let curDirector = props.currentDirector;
        let directorArr = this.state.directorDetailsArray;
        this.state.directorDetailsArray.map((director,index)=>{
          if(director.directorDetailsId===curDirector.userDetailsId){
            directorArr.splice(index, 1);
          }
        })
        this.setState({
          deleteDirectorFlag:false,
          directorDetailsArray:directorArr
        });
      }

      if(!isEmpty(props.financialAttachments) && this.state.loadFinancialAttachments){
        let attList = props.financialAttachments.financialDetailsList;
        let turnOverId1 = "";
        let turnOverAmount1 = "";
        let financialYearId1 = "";
        let financialYearName1 = "";
        let balanceSheetId1= "";
        let balanceSheetAttachment1 = {
          attachmentId : "",
          fileName : ""
        };
        let profitLossId1 = "";
        let profitLossAttachment1 = {
          attachmentId : "",
          fileName : ""
        };

        let turnOverId2 = "";
        let turnOverAmount2 = "";
        let financialYearId2 = "";
        let financialYearName2 = "";
        let balanceSheetId2 = "";
        let balanceSheetAttachment2 = {
          attachmentId : "",
          fileName : ""
        };
        let profitLossId2 = "";
        let profitLossAttachment2 = {
          attachmentId : "",
          fileName : ""
        };

        let turnOverId3 = "";
        let turnOverAmount3 = "";
        let financialYearId3 = "";
        let financialYearName3 = "";
        let balanceSheetId3 = "";
        let balanceSheetAttachment3 = {
          attachmentId : "",
          fileName : ""
        };
        let profitLossId3 = "";
        let profitLossAttachment3 = {
          attachmentId : "",
          fileName : ""
        };

        if(!isEmpty(attList)){
          if(!isEmpty(attList[0].turnOver)){
            turnOverId1 = attList[0].turnOver.financialAttachmentId;
            turnOverAmount1 = attList[0].turnOver.amount;
          }
          if(!isEmpty(attList[0].financialYear)){
            financialYearId1 = attList[0].financialYear.financialYearId;
            financialYearName1 = attList[0].financialYear.name;
          }

          if(!isEmpty(attList[0].balanceSheet)){
            balanceSheetId1 = attList[0].balanceSheet.financialAttachmentId;
          }

          if(!isEmpty(attList[0].balanceSheet.attachment) && !isEmpty(attList[0].balanceSheet.attachment.attachmentId)){
            balanceSheetAttachment1 = attList[0].balanceSheet.attachment;
          }

          if(!isEmpty(attList[0].profitAndLoss)){
            profitLossId1 = attList[0].profitAndLoss.financialAttachmentId;
          }

          if(!isEmpty(attList[0].profitAndLoss.attachment) && !isEmpty(attList[0].profitAndLoss.attachment.attachmentId)){
            profitLossAttachment1 = attList[0].profitAndLoss.attachment;
          }

          if(!isEmpty(attList[1].turnOver)){
            turnOverId2 = attList[1].turnOver.financialAttachmentId;
            turnOverAmount2 = attList[1].turnOver.amount;
          }
          if(!isEmpty(attList[1].financialYear)){
            financialYearId2 = attList[1].financialYear.financialYearId;
            financialYearName2 = attList[1].financialYear.name;
          }

          if(!isEmpty(attList[1].balanceSheet)){
            balanceSheetId2 = attList[1].balanceSheet.financialAttachmentId;
          }

          if(!isEmpty(attList[1].balanceSheet.attachment) && !isEmpty(attList[1].balanceSheet.attachment.attachmentId)){
            balanceSheetAttachment2 = attList[1].balanceSheet.attachment;
          }
          
          if(!isEmpty(attList[1].profitAndLoss)){
            profitLossId2 = attList[1].profitAndLoss.financialAttachmentId;
          }

          if(!isEmpty(attList[1].profitAndLoss.attachment) && !isEmpty(attList[1].profitAndLoss.attachment.attachmentId)){
            profitLossAttachment2 = attList[1].profitAndLoss.attachment;
          }

          if(!isEmpty(attList[2].turnOver)){
            turnOverId3 = attList[2].turnOver.financialAttachmentId;
            turnOverAmount3 = attList[2].turnOver.amount;
          }
          if(!isEmpty(attList[2].financialYear)){
            financialYearId3 = attList[2].financialYear.financialYearId;
            financialYearName3 = attList[2].financialYear.name;
          }

          if(!isEmpty(attList[2].balanceSheet)){
            balanceSheetId3 = attList[2].balanceSheet.financialAttachmentId;
          }

          if(!isEmpty(attList[2].balanceSheet.attachment) && !isEmpty(attList[2].balanceSheet.attachment.attachmentId)){
            balanceSheetAttachment3 = attList[2].balanceSheet.attachment;
          }
          
          if(!isEmpty(attList[2].profitAndLoss)){
            profitLossId3 = attList[2].profitAndLoss.financialAttachmentId;
          }

          if(!isEmpty(attList[2].profitAndLoss.attachment) && !isEmpty(attList[2].profitAndLoss.attachment.attachmentId)){
            profitLossAttachment3 = attList[2].profitAndLoss.attachment;
          }

          this.setState({
            loadFinancialAttachments:false,
            
            turnOverId1: turnOverId1,
            turnOverAmount1: turnOverAmount1,
            financialYear1 : {
              financialYearId : financialYearId1,
              financialYearName: financialYearName1
            },
            balanceSheetId1: balanceSheetId1,
            balanceSheetAttachment1 : balanceSheetAttachment1,
            profitLossId1 : profitLossId1,
            profitLossAttachment1: profitLossAttachment1,
            turnOverId2: turnOverId2,
            turnOverAmount2: turnOverAmount2,
            financialYear2 : {
              financialYearId : financialYearId2,
              financialYearName: financialYearName2
            },
            balanceSheetId2 : balanceSheetId2,
            balanceSheetAttachment2 : balanceSheetAttachment2,
            profitLossId2: profitLossId2,
            profitLossAttachment2 : profitLossAttachment2,
            turnOverId3 : turnOverId3,
            turnOverAmount3: turnOverAmount3,
            financialYear3 : {
              financialYearId : financialYearId3,
              financialYearName : financialYearName3
            },
            balanceSheetId3 : balanceSheetId3,
            balanceSheetAttachment3 : balanceSheetAttachment3,
            profitLossId3 : profitLossId3,
            profitLossAttachment3 : profitLossAttachment3,
          });
        }
        
      }  
  }
  cancelHandler = () => {
    this.associateCompanyDetails(this.props); 
    this.setState(prevState => ({
        readOnly: !prevState.readOnly,
    }))
    this.form.resetFields();
}
  render() {
    return (
      <div>
        {/* <Loader isLoading={this.state.isLoading}/> */}
        <div className="card">
        <div className="card-header">Directors / Partners / Proprietors details</div>
        <div className="card-body" style={{paddingLeft:"10px"}}>
        <FormWithConstraints ref={formWithConstraints => this.dercForm = formWithConstraints} 
           onSubmit={(e)=>{this.setState({loadDirectorDetails:true,editButtonFlag:false});commonSubmitForm(e,this,"saveDirectorDetailsResponse","/rest/saveDirectorDetails","dercForm")}} noValidate > 
            {/* <form onSubmit={(e)=> {commonSubmitForm(e,this.props,"saveDirectorDetailsResponse","/rest/saveDirectorDetails")}}> */}
              <input type="hidden" name="partner.bPartnerId" value={this.props.partner.partnerId} />
              <input type="hidden" name="userDetailsId" value={this.state.directorDetails.directorDetailsId} />
              
              <div className="row">
                <label className="col-sm-2">Type</label>
                <div className="col-sm-3">
                <select className={"form-control "} readOnly={this.props.readonly} name="directorType" 
                    value={this.state.directorDetails.directorType} 
                    onChange={(event)=>commonHandleChange(event,this,"directorDetails.directorType")}>
                      <option value="">Select</option>
                      {(this.state.directorTypeList).map(directorType=>
                        <option value={directorType.value}>{directorType.display}</option>
                      )};
                    </select>
                    </div>
                  
                <label className="col-sm-2">Name</label>
                <div className="col-sm-3">
                  <input type="text" name="name" value={this.state.directorDetails.name} 
                  onChange={(event)=>{commonHandleChange(event,this,"directorDetails.name")}} 
                  className={"form-control "} readOnly={this.props.readonly}/>
                </div>
                </div>
            
            <div className="row mt-2">
                <label className="col-sm-2">Directors Identification No</label>
                <div className="col-sm-3">
                  <input type="text" className={"form-control "} readOnly={this.props.readonly} name="directorUID" 
                  value={this.state.directorDetails.directorUID}
                  onChange={(event)=>{commonHandleChange(event,this,"directorDetails.directorUID")}} />
                </div>
              
                <label className="col-sm-2">Mobile No <span className="redspan">*</span></label>
                <div className="col-sm-3">
                  <input type="text" name="mobileNo" value={this.state.directorDetails.mobileNo} required
                  onChange={(event)=>{commonHandleChange(event,this,"directorDetails.mobileNo","dercForm")}} 
                  className={"form-control numberOnly"} readOnly={this.props.readonly}/>
                  <FieldFeedbacks for="mobileNo">
                     <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)}>Number Should be 10 digits</FieldFeedback>
                    </FieldFeedbacks>

                </div>
                </div>
              <div className="row mt-2">
                <label className="col-sm-2">Qualification</label>
                <div className="col-sm-3">
                    <input type="text" name="qualification" className={"form-control "} readOnly={this.props.readonly} value={this.state.directorDetails.qualification} 
                    onChange={(e)=>{commonHandleChange(e,this,"directorDetails.qualification")}}/>
                  </div>  
              
                <label className="col-sm-2">Experience (In Years)</label>
                <div className="col-sm-3">
                  <input type="text" className={"form-control "} readOnly={this.props.readonly} name="experience" 
                  value={this.state.directorDetails.experience}
                  onChange={(e)=>{commonHandleChange(e,this,"directorDetails.experience")}} />
                </div>
              </div>
              <div className={"col-sm-12 text-center mt-2 " + this.props.displayDiv}>
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  <button type="button" className="btn btn-danger mr-1" onClick={()=>{this.setState({editButtonFlag:false});this.resetPropriterDetails()}}>Clear</button> 
                  <button type="button" onClick={this.resetPropriterDetails} className="btn btn-primary">
                    New &nbsp;<i className="fa fa-plus" aria-hidden="true"></i>
                  </button>                 
              </div>
              </FormWithConstraints>
             
              <div className="row">
                <div className="col-sm-12 mt-2">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Type </th>
                        <th>Name</th>
                        <th>Directors Identification No</th>
                        <th>Mobile No</th>
                        <th>Qualification</th>
                        <th>Experience (In Years)</th>
                        <th className={this.props.displayDiv}>Edit</th>
                        <th className={this.props.displayDiv}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.directorDetailsArray.map((director,index)=>
                        <tr className={this.state["selectedDirector"+index]}>                        
                        <td>{this.state.directorTypeMap[director.directorType]}</td>
                        <td>{director.name}</td>
                        <td>{director.directorUID}</td>
                        <td>{director.mobileNo}</td>
                        <td>{director.qualification}</td>
                        <td>{director.experience}</td>
                       {/* <td>
                          <button className={this.state.editButtonFlag?"btn btn-info not-allowed":"btn btn-info"} type="button" disabled={this.state.editButtonFlag?true:false} onClick={()=>{this.loadDirectorForEdit(index)}}>
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
                          <button className="btn btn-danger" type="button" onClick={()=>{this.swalWithPromptDeleteDirDetails(director.directorDetailsId)}}> 
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                    </td>*/}
                      </tr>  
                      )}
                    </tbody>
                    </table>
                  </div>
                </div>  
                </div>
                </div>
                <div className="card">
                <div className="card-header">Other Details</div>
                <div className="card-body" style={{paddingLeft:"10px"}}>    
        <div className="mt-1">  
         
          {/* <div id="collapseTwo2" className="collapse" data-parent="#accordion2">
            <div className="card-body"> */}
            <FormWithConstraints   
           onSubmit={(e)=>{commonSubmitForm(e,this,"saveotherDetailsResponse","/rest/saveOtherDetails")}} noValidate > 
              <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId}/>
              <input type="hidden" name="partnerOrgId" disabled={isEmpty(this.state.otherDetails.partnerOrgId)} value={this.state.otherDetails.partnerOrgId}/>
              <div className="row">
                <label className="col-sm-2">No of Employees</label>
                <div className="col-sm-3">
                  <input type="text" className={"form-control "}  name="manPower" value={this.state.otherDetails.noOfEmployee} onChange={(event)=>{commonHandleChange(event,this,"otherDetails.noOfEmployee")}} />
                </div>
                <label className="col-sm-2">Date of Commencement</label>
                <div className="col-sm-3">
                  <input type="date" name="estdDate" className={"form-control "}  value={this.state.otherDetails.dateOfCommencement} onChange={(event)=>{commonHandleChange(event,this,"otherDetails.dateOfCommencement")}}/>
                </div>
              </div>
              <div className={"col-sm-12 text-center mt-2 "}>
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  <button type="button" className="btn btn-danger mr-1"  onClick={()=>{commonSubmitWithParam(this.props,"otherDetailsResponse","/rest/getOtherDetails",this.props.partner.partnerId); resetForm(this.dercForm)}}>Cancel</button>                  
              </div>
              </FormWithConstraints>
            </div>
          </div>
          </div>
		{/*
          <div className="card">
          <div className="card-header">Finacial Details</div>
          <div className="card-body">
        <div className="mt-1">
          
            <FormWithConstraints  ref={formWithConstraints => this.finaDetForm = formWithConstraints} 
           onSubmit={(e)=>{this.setState({loadFinancialAttachments:true});commonSubmitForm(e,this,"saveFinancialDetails","/rest/saveFinancialDetails","finaDetForm")}} noValidate={true}  > 
              <div className="row">
                <label className="col-sm-2"></label>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                   <label>Amount</label>
                  </div> 
                  <div className="col-sm-6 nopadding">
                   <label>Year</label>
                  </div> 
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                   <label>Amount</label>
                  </div> 
                  <div className="col-sm-6 nopadding">
                   <label>Year</label>
                  </div> 
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                   <label>Amount</label>
                  </div> 
                  <div className="col-sm-6 nopadding">
                   <label>Year</label>
                  </div> 
                  </div>
                </div>
              </div>
              <div className="row">
                <label className="col-sm-2">Turnover </label>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[0][turnOver][financialAttachmentId]" value={this.state.turnOverId1} />
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[0][turnOver][finacialType]" value="TD" />
                   <input type="text" className={"form-control "} readOnly={this.props.readonly} name="financialDetailsList[0][turnOver][amount]" value={this.state.turnOverAmount1} 
                   onChange={(e)=>{commonHandleChange(e,this,"turnOverAmount1", "finaDetForm")}} required/>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[0][turnOver][amount]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  <div className="col-sm-6 nopadding">
                   <select className={"form-control "} readOnly={this.props.readonly} name="financialDetailsList[0][financialYear][financialYearId]" value={this.state.financialYear1.financialYearId} required>
                  <option value={this.state.financialYear1.financialYearId}>{this.state.financialYear1.financialYearName}</option>
                   </select>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[0][financialYear][financialYearId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[1][turnOver][financialAttachmentId]" value={this.state.turnOverId2} />
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[1][turnOver][finacialType]" value="TD" />
                  <input type="text" className={"form-control "}readOnly={this.props.readonly}  name="financialDetailsList[1][turnOver][amount]" value={this.state.turnOverAmount2} 
                   onChange={(e)=>{commonHandleChange(e,this,"turnOverAmount2" , "finaDetForm")}} required/>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[1][turnOver][amount]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  <div className="col-sm-6 nopadding">
                  <select className={"form-control "} readOnly={this.props.readonly} name="financialDetailsList[1][financialYear][financialYearId]" value={this.state.financialYear2.financialYearId} required>
                  <option value={this.state.financialYear2.financialYearId}>{this.state.financialYear2.financialYearName}</option>
                   </select>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[1][financialYear][financialYearId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="row">
                  <div className="col-sm-6 nopadding">
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[2][turnOver][financialAttachmentId]" value={this.state.turnOverId3} />
                  <input type="hidden" className={"form-control "+this.props.readonly} name="financialDetailsList[2][turnOver][finacialType]" value="TD" />
                  <input type="text" className={"form-control "} readOnly={this.props.readonly} name="financialDetailsList[2][turnOver][amount]" value={this.state.turnOverAmount3} 
                   onChange={(e)=>{commonHandleChange(e,this,"turnOverAmount3" , "finaDetForm")}} required/>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[2][turnOver][amount]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  <div className="col-sm-6 nopadding">
                  <select className={"form-control "} readOnly={this.props.readonly} name="financialDetailsList[2][financialYear][financialYearId]" value={this.state.financialYear3.financialYearId} required>
                  <option value={this.state.financialYear3.financialYearId}>{this.state.financialYear3.financialYearName}</option>
                   </select>
					*/}
                   {/* <FieldFeedbacks for="financialDetailsList[2][financialYear][financialYearId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  </div> 
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <label className="col-sm-2">Balance Sheet </label>
                <div className="col-sm-3">  
                <div className="input-group">            
                <input type="hidden" name="financialDetailsList[0][balanceSheet][financialAttachmentId]" value={this.state.balanceSheetId1} />
                  <input type="hidden" disabled={isEmpty(this.state.balanceSheetAttachment1.attachmentId)} name="financialDetailsList[0][balanceSheet][attachment][attachmentId]" value={this.state.balanceSheetAttachment1.attachmentId} />
                  <input type="hidden" name="financialDetailsList[0][balanceSheet][attachment][fileName]" value={this.state.balanceSheetAttachment1.fileName} />
                  <input type="hidden" name="financialDetailsList[0][balanceSheet][finacialType]" value="BSA" />
                  <input type="file" name="balancesheet[0]" onChange={(e)=>{commonHandleFileUpload(e,this,"balanceSheetAttachment1","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
                  <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ balanceSheetAttachment1: {attachmentId:"",fileName:""} })}} type="button">X</button>
                </div>
                </div>
				*/}
                  {/* <FieldFeedbacks for="balancesheet[0]">
                      <FieldFeedback when={()=> { return isEmpty(this.state.balanceSheetAttachment1.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.balanceSheetAttachment1.attachmentId}>{this.state.balanceSheetAttachment1.fileName}</a></div>
                </div>
                <div className="col-sm-3">  
                <div className="input-group">
                <input type="hidden" name="financialDetailsList[1][balanceSheet][financialAttachmentId]" value={this.state.balanceSheetId2} />
                <input type="hidden" disabled={isEmpty(this.state.balanceSheetAttachment2.attachmentId)} name="financialDetailsList[1][balanceSheet][attachment][attachmentId]" value={this.state.balanceSheetAttachment2.attachmentId} />
                <input type="hidden" name="financialDetailsList[1][balanceSheet][attachment][fileName]" value={this.state.balanceSheetAttachment2.fileName} />
                  <input type="hidden" name="financialDetailsList[1][balanceSheet][finacialType]" value="BSA" />
                  <input type="file" name="balancesheet[1]" onChange={(e)=>{commonHandleFileUpload(e,this,"balanceSheetAttachment2","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
    <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ balanceSheetAttachment2: {attachmentId:"",fileName:""} })}} type="button">X</button>
  </div>
  </div>
	 */}
                  {/* <FieldFeedbacks for="balancesheet[1]">
                      <FieldFeedback when={()=> { return isEmpty(this.state.balanceSheetAttachment2.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.balanceSheetAttachment2.attachmentId}>{this.state.balanceSheetAttachment2.fileName}</a></div>
                </div>
                <div className="col-sm-3">
                  <div className="input-group">
                <input type="hidden" name="financialDetailsList[2][balanceSheet][financialAttachmentId]" value={this.state.balanceSheetId3} />
                  <input type="hidden" disabled={isEmpty(this.state.balanceSheetAttachment3.attachmentId)} name="financialDetailsList[2][balanceSheet][attachment][attachmentId]" value={this.state.balanceSheetAttachment3.attachmentId} />
                  <input type="hidden" name="financialDetailsList[2][balanceSheet][attachment][fileName]" value={this.state.balanceSheetAttachment3.fileName} />
                  <input type="hidden" name="financialDetailsList[2][balanceSheet][finacialType]" value="BSA" />
                  <input type="file" name="balancesheet[2]" onChange={(e)=>{commonHandleFileUpload(e,this,"balanceSheetAttachment3","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
                    <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ balanceSheetAttachment3: {attachmentId:"",fileName:""} })}} type="button">X</button>
                  </div>
                  </div>
				*/}
                  {/* <FieldFeedbacks for="balancesheet[2]">
                  <FieldFeedback when={()=> { return isEmpty(this.state.balanceSheetAttachment3.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
				{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.balanceSheetAttachment3.attachmentId}>{this.state.balanceSheetAttachment3.fileName}</a></div>
                </div>
              </div>
              <br />
              <div className="row">
                <label className="col-sm-2">Profit & Loss </label>
                <div className="col-sm-3"> 
                <div className="input-group">
                <input type="hidden" name="financialDetailsList[0][profitAndLoss][financialAttachmentId]" value={this.state.profitLossId1} />
                <input type="hidden" disabled={isEmpty(this.state.profitLossAttachment1.attachmentId)} name="financialDetailsList[0][profitAndLoss][attachment][attachmentId]" value={this.state.profitLossAttachment1.attachmentId} />
                <input type="hidden" name="financialDetailsList[0][profitAndLoss][attachment][fileName]" value={this.state.profitLossAttachment1.fileName} />
                  <input type="hidden" name="financialDetailsList[0][profitAndLoss][finacialType]" value="PNL" />
                  <input type="file" name="profitAndLoss[0]" onChange={(e)=>{commonHandleFileUpload(e,this,"profitLossAttachment1","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
    <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ profitLossAttachment1: {attachmentId:"",fileName:""} })}} type="button">X</button>
  </div>
  </div>
	*/}
                  {/* <FieldFeedbacks for="profitAndLoss[0]">
                  <FieldFeedback when={()=> { return isEmpty(this.state.profitLossAttachment1.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.profitLossAttachment1.attachmentId}>{this.state.profitLossAttachment1.fileName}</a></div>
                </div>
                <div className="col-sm-3">
                  <div className="input-group">
                <input type="hidden" name="financialDetailsList[1][profitAndLoss][financialAttachmentId]" value={this.state.profitLossId2} />
                <input type="hidden" disabled={isEmpty(this.state.profitLossAttachment2.attachmentId)} name="financialDetailsList[1][profitAndLoss][attachment][attachmentId]" value={this.state.profitLossAttachment2.attachmentId} />
                <input type="hidden" name="financialDetailsList[1][profitAndLoss][attachment][fileName]" value={this.state.profitLossAttachment2.fileName} />
                  <input type="hidden" name="financialDetailsList[1][profitAndLoss][finacialType]" value="PNL" />
                  <input type="file" name="profitAndLoss[1]" onChange={(e)=>{commonHandleFileUpload(e,this,"profitLossAttachment2","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
    <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ profitLossAttachment2: {attachmentId:"",fileName:""} })}} type="button">X</button>
  </div>
  </div>
*/}
                  {/* <FieldFeedbacks for="profitAndLoss[1]">
                  <FieldFeedback when={()=> { return isEmpty(this.state.profitLossAttachment2.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.profitLossAttachment2.attachmentId}>{this.state.profitLossAttachment2.fileName}</a></div>
                </div>
                <div className="col-sm-3">
                  <div className="input-group">
                <input type="hidden" name="financialDetailsList[2][profitAndLoss][financialAttachmentId]" value={this.state.profitLossId3} />
                <input type="hidden" disabled={isEmpty(this.state.profitLossAttachment3.attachmentId)} name="financialDetailsList[2][profitAndLoss][attachment][attachmentId]" value={this.state.profitLossAttachment3.attachmentId} />
                <input type="hidden" name="financialDetailsList[2][profitAndLoss][attachment][fileName]" value={this.state.profitLossAttachment3.fileName} />
                  <input type="hidden" name="financialDetailsList[2][profitAndLoss][finacialType]" value="PNL" />
                  <input type="file" name="profitAndLoss[2]" onChange={(e)=>{commonHandleFileUpload(e,this,"profitLossAttachment3","finaDetForm")}} className={"form-control "+this.props.readonly} required/>
                  <div class="input-group-append">
    <button class="btn btn-danger clearFile" disabled="disabled"  onClick={() => {this.setState({ profitLossAttachment3: {attachmentId:"",fileName:""} })}} type="button">X</button>
  </div>
  </div>
*/}
                  {/* <FieldFeedbacks for="profitAndLoss[2]">
                  <FieldFeedback when={()=> { return isEmpty(this.state.profitLossAttachment3.attachmentId)} }></FieldFeedback>
                   </FieldFeedbacks> */}
					{/*
                  <div><a href={API_BASE_URL+"/rest/download/"+this.state.profitLossAttachment3.attachmentId}>{this.state.profitLossAttachment3.fileName}</a></div>
                </div>
              </div>
              <div style={{display:"none"}} className={"col-sm-12 text-center mt-2 " + this.props.displayDiv}>
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  <button type="button" className="btn btn-danger mr-1"onClick={()=>{
                    this.setState({
                      loadFinancialAttachments:true,
                      loadFinancialYear:true
                    });
                    commonSubmitWithParam(this.props,"getFinancialDetails","/rest/getFinancialDetails",this.props.partner.partnerId)}}>Cancel</button>                  
              </div>
              </FormWithConstraints>
            </div>
            </div>
            </div> */}
			{/*
			<div className="card">
            <div className="card-header">Associate Company Details</div>
            <div className="card-body">
        <div className="mt-1"> */}
            {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveAssociateCompanyDetailsResp","/rest/saveAssociateCompanyDetails")}} > */}
			{/*
            <FormWithConstraints style={{display:"none"}} ref={formWithConstraints => this.asoCoDetForm = formWithConstraints} 
           onSubmit={(e)=>{this.setState({loadAssociateCompanyDetails:true,editButtonFlag:false});commonSubmitForm(e,this,"saveAssociateCompanyDetailsResp","/rest/saveAssociateCompanyDetails","asoCoDetForm")}} noValidate > 
                <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId}/>
                <input type="hidden" name="partnerCompanyAddressId" value={this.state.associateCompanyDetails.partnerCompanyAddressId}/>
                <input type="hidden" name="location[locationId]" value={this.state.associateCompanyDetails.locationId}/>
                <div className="row">
                <label className="col-sm-2"> Name of Company</label>
                <div className="col-sm-3">
                  <input type="text" value={this.state.associateCompanyDetails.nameOfCompany} name="nameOfCompany"
                  onChange={(event)=>{commonHandleChange(event,this,"associateCompanyDetails.nameOfCompany")}}  className={"form-control "} readOnly={this.props.readonly}/>
                </div>
                </div>
                <br/>
              <div className="row">
                <label className="col-sm-2">Address Line 1</label>
                <div className="col-sm-3">
                  <input type="text" value={this.state.associateCompanyDetails.address1} name="location[address1]"
                  onChange={(event)=>{commonHandleChange(event,this,"associateCompanyDetails.address1" ,"asoCoDetForm")}}  className={"form-control "} readOnly={this.props.readonly}/>
                </div>
                <label className="col-sm-2">Address Line 2</label>
                <div className="col-sm-3">
                  <input type="text" value={this.state.associateCompanyDetails.address2} name="location[address2]"
                  onChange={(event)=>{commonHandleChange(event,this,"associateCompanyDetails.address2", "asoCoDetForm")}}  className={"form-control "} readOnly={this.props.readonly}/>
                </div>
              </div>
              <br />
              <div className="row">
                <label className="col-sm-2">Address Line 3</label>
                <div className="col-sm-3">
                  <input type="text" value={this.state.associateCompanyDetails.address3} name="location[address3]"
                  onChange={(event)=>{commonHandleChange(event,this,"associateCompanyDetails.address3", "asoCoDetForm")}}  className={"form-control "} readOnly={this.props.readonly}/>
                </div>
              </div>
              <br />
              <div className="row">
                <label className="col-sm-2">Country <span className="redspan">*</span></label>
                <div className="col-sm-3">
                    <select className={"readonly form-control "} readOnly={this.props.readonly} name="location[country][countryId]" required
                    value="1" 
                    onChange={(e)=>{ this.handleChangeCountry(e.target.value);this.asoCoDetForm.validateFields(e.target)} }>
                      <option value="">Select</option>
                      {(this.state.countryList).map(country=>
                        <option value={country.value}>{country.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="location[country][countryId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks>
                </div>
                <label className="col-sm-2">State <span className="redspan">*</span></label>
                <div className="col-sm-3">
                    <select className={"form-control "} readOnly={this.props.readonly} name="location[region][regionId]" required
                    value={this.state.associateCompanyDetails.state} 
                      onChange={(e)=>{ this.handleChangeState(e.target.value);this.asoCoDetForm.validateFields(e.target)} }>
                      <option value="">Select</option>
                      {(this.state.stateList).map(state=>
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
                <select className={"form-control "} readOnly={this.props.readonly} name="location[district][districtId]" required
                value={this.state.associateCompanyDetails.district}onChange={(event)=>commonHandleChange(event,this,"associateCompanyDetails.district" ,"asoCoDetForm")}>
                      <option value="">Select</option>
                      {(this.state.districtList).map(district=>
                        <option value={district.value}>{district.display}</option>
                      )};
                    </select>
                    <FieldFeedbacks for="location[district][districtId]">
                      <FieldFeedback when="*"></FieldFeedback>
                   </FieldFeedbacks>
                </div>
                <label className="col-sm-2">Postal Code <span className="redspan">*</span></label>
                <div className="col-sm-3">
                <input type="text" value={this.state.associateCompanyDetails.postalCode} name="location[postal]" required
                  onChange={(event)=>{commonHandleChange(event,this,"associateCompanyDetails.postalCode" ,"asoCoDetForm")}}  className={"form-control "} readOnly={this.props.readonly}/>
                  <FieldFeedbacks for="location[postal]">
                  <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^(\+\d{1,3}[- ]?)?\d{6}$/.test(value)}>Number Should be 6 digits</FieldFeedback>
                   </FieldFeedbacks>
                </div>
                
              </div>
              <div className={"col-sm-12 text-center mr-2" + this.props.displayDiv}>
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  <button type="button" onClick={()=>{this.setState({editButtonFlag:false});this.resetaddressDetails()}} className="btn btn-danger mr-1">Clear</button>
                  <button type="button" onClick={this.resetaddressDetails} className="btn btn-primary">
                    New &nbsp;<i className="fa fa-plus" aria-hidden="true"></i>
                  </button>
                 
                  <button type="button" className={this.props.showSubmit?"btn btn-warning mr-1 ml-1 inline-block":"none"}
                  onClick={(e)=>swalPrompt(e,this,"submitConfirmation","","Do you really want to submit?")}>Submit</button>
              </div>
              </FormWithConstraints>
              <div className="row">
                <div className="col-sm-12 mt-3">
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Name of Company</th>
                        <th>Address </th>
                        <th>Country</th>
                        <th>Postal Code</th>
                        <th>State</th>
                        <th>District</th>
                        <th style={{display:"none"}}>Edit</th>
                        <th className={this.props.displayDiv}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.addressArray.map((addr,index)=>
                        <tr className={this.state["selectedAddress"+index]}>                        
                        <td>{addr.nameOfCompany}</td>
                        <td>{ addr.address1 + ", " + addr.address2 + ", " + addr.address3}</td>
                        <td>{ addr.countryName }</td>
                        <td>{ addr.postalCode } </td>
                        <td>{ addr.stateName }</td>
                        <td>{ addr.districtName}</td>
                        <td style={{display:"none"}}>
                          <button className={this.state.editButtonFlag?"btn btn-info not-allowed":"btn btn-info"} type="button" disabled={this.state.editButtonFlag?true:false} onClick={()=>{this.loadAddressForEdit(index)}}>
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
                          <button className="btn btn-danger" type="button" onClick={()=>{this.swalWithPromptDeleteAssoDetails(addr.partnerCompanyAddressId)}}> 
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
        </div> */}
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.associateCompanyInfo;
};
export default connect (mapStateToProps,actionCreators)(CompanyDetails);