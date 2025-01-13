import {
    //submitWithParam,
    submitToURL,
    //submitForm,
   // submitWithFourParam,
    //submitWithTwoParam,
    //getCurrentUser
  } from "../../../Util/APIUtils";
import { isEmpty } from "../../../Util/validationUtil";
import { showAlert } from "../../../Util/ActionUtil";
export let loader = true;
  export function getGeneralInfo(url) {   
    return dispatch => {
      dispatch({
        type: 'isFetching'
    });
        return submitToURL("/rest/" + url).then(response => {
        dispatch(populateGeneralDetails(response));
      });
    };
  }

  export function populateGeneralDetails(response,index){
    return {
        type : "POPULATE_DROP_DOWN",
        payload: response
    }
  }

  export function saveCompanyDetailResp(response, index) {
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.companyDetails) && !isEmpty(response.objectMap.companyDetails.response)){
      showAlert(response.objectMap.companyDetails.response.hasError,response.objectMap.companyDetails.response.message);
      if(!response.objectMap.companyDetails.response.hasError){
        return {
          type: "SAVE_COMPANY_DETAILS",
          payload: response
        };
      }else{
        return {
          type:""
        };
      }
    }
      
  }
  export function saveAddressDetailsResp(response, componentProps) {
    if(!isEmpty(response) && !isEmpty(response.response)){
      showAlert(response.response.hasError,response.response.message);
      componentProps.resetaddressDetails();
      if(!response.response.hasError){
        return {
          type: "SAVE_ADDRESS_DETAILS",
          payload: response
        };
      }else{
        return {
          type:""
        };
      }
    }
      
  }
  
  export function populateCompanyDetails(response, index) {
    return {
      type: "POPULATE_COMPANY_DETAILS",
      payload: response
    };
  }

  export function getCompAddressInformation(response){
    return {
      type: "POPULATE_COMP_ADDRESS_INFO",
      payload: response
    };
  }

  export function getContactDetails(response){
    return {
      type: "POPULATE_COMPANY_CONTACT_INFO",
      payload: response
    };
  }

  export function saveContactDetailsResp(response,componentProps){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.contactDetails) && !isEmpty(response.objectMap.contactDetails.response)){
      showAlert(response.objectMap.contactDetails.response.hasError,response.objectMap.contactDetails.response.message);
      if(!isEmpty(componentProps)) componentProps.resetContactDetails();
      if(!response.objectMap.contactDetails.response.hasError){
        return {
          type: "SAVE_CONTACT_DETAILS",
          payload: response
        };
      }else{
        return {
          type:""
        };
      }
    }

    
  }

  export function populateStates(response){
    return {
      type: "POPLUATE_STATES",
      payload: response
    };
  }

  export function populateDistricts(response){
    return {
      type: "POPLUATE_DISTRICTS",
      payload: response
    };
  }

  export function deletePartnerAddress(response){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.partnerCompanyAddr) && !isEmpty(response.objectMap.partnerCompanyAddr.response)){
      showAlert(response.objectMap.partnerCompanyAddr.response.hasError,response.objectMap.partnerCompanyAddr.response.message);
    }
    return {
      type: "DELETE_ADDRESS",
      payload: response
    };
  }


  export function deleteContactDetail(response){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.userDetail) && !isEmpty(response.objectMap.userDetail.response)){
      showAlert(response.objectMap.userDetail.response.hasError,response.objectMap.userDetail.response.message);
    }
    return {
      type: "DELETE_CONTACT",
      payload: response
    };
  }
  