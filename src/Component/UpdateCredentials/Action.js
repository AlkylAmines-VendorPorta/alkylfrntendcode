

import {
  //submitWithParam,
  submitToURL,
  //submitForm,
  // submitWithFourParam,
  //submitWithTwoParam,
  //getCurrentUser
} from "../../Util/APIUtils";
import { isEmpty } from "../../Util/validationUtil";
import { showAlert } from "../../Util/ActionUtil";
import swal from "sweetalert";


export function getUserByUserNameOrEmailResp(response,c,e) {
  if (!isEmpty(response) && !isEmpty(response.objectMap)) {
    return {
      type: "USER_BY_USERNAME_OR_EMAIL",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }
}


export function updateUserNameResponse(response) {
  if (!isEmpty(response)) {

    // console.log("Response :", response);

    return {
      type: "UPDATE_USERNAME",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }
}

export function generatePasswordRspn(response) {
  // console.log("GeneratePassword", response)


  

  if (!isEmpty(response)) {

    let resultResponse;

    // if(response.hasError==true){
    //  resultResponse= Object.append({"success":false},response)
    // }
    // else{
    //   resultResponse= Object.append({"success":false},response)
    // }

    if (response.hasError == true) {

      response = { ...response, "success": false }
    }
    else {

      response = { ...response, "success": true }
    }





    // showAlert(response.hasError,response.message)    
    return {
      type: "GENERATE_PASSWORD",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }
}



export function updateUserNameAndEmailOfUser(response) {
  if (!isEmpty(response)) {
    // showAlert(false,"UserName And Email Updated");
    return {
      type: "UPDATE_USERNAME_AND_EMAIL",
      payload: response
    };

  }
  else {
    return {
      type: ""
    };
  }
}



export function logInGenerateOfVendorResp(response,callback) {
  if (!isEmpty(response)) {
    
    let swalTitle=response.success===false?"Wrong":"Done";
     // let swalText=response.message;
     let swalText=response.success===false?response.message:"Invite Sent"
      
      let swalType=response.success===false?"warning":"success";
      swal({
          title: swalTitle,
          text: swalText,
          icon: swalType,
          type: swalType
        })
    //showAlert(!response.success,response.message);
    callback()
    return {
      type: "LOG_IN_GENERATED",
      payload: response
    };
  }
  else{
    return {
      type: "",
      payload: response
    };
  }
}  

export function changeLoaderState(response){
  return {
    type: "CHANGE_LOADER_STATE_UPDATE_CREDENTIALS",
    payload: response
  };
}


export function emptyUserList(response){
  return {
    type: "CHANGE_USER_LIST",
    payload: response
  };
}