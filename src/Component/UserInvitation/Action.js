import {
    //submitWithParam,
    //submitToURL,
    submitForm,
    //submitWithFourParam,
    //submitWithTwoParam,
    //getCurrentUser
  } from "../../Util/APIUtils";
import { isEmpty } from "../../Util/validationUtil";
import { showAlert } from "../../Util/ActionUtil";
import swal from "sweetalert";

  export function viewCompanyListModal(response){
    return {
      type: "VIEW_COMPANY_LIST",
      payload: response
    };
  }

  export function changeLoaderState(response){
    return {
      type: "CHANGE_LOADER_STATE",
      payload: response
    };
  }

  export function inviteResponse(response) {
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.user) && !isEmpty(response.objectMap.user.response)){
    let swalTitle=response.objectMap.user.response.hasError===true?"Wrong":"Done";
    let swalText=response.objectMap.user.response.message;
    let swalType=response.objectMap.user.response.hasError===true?"warning":"success";
    swal({
      title: swalTitle,
      text: swalText,
      icon: swalType,
      type: swalType
    }).then((isConfirm)=>{
      if (isConfirm && !response.objectMap.user.response.hasError){
       window.location.reload(false)
      }else{
       return{
         type : "",
         payload : ""
       }
      }
    })

    if(!response.objectMap.user.response.hasError){
      return {
        type: "INVITE_RESPONSE",
        payload: response
      };
    }else{
      return {
        type: ""
      };
    }

  }
    
  }

  export function searchResponse(response,index){
    
    return {
      type : "SEARCH_RESPONSE",
      payload: response
    }  
  }

  export function vendorListfromSAP(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      //showAlertAndReload(!response.success,response.message);
      return {
        type: "USER_LIST",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}