
import { isEmpty } from "../../../Util/validationUtil";
import { showAlert,swalPrompt } from "../../../Util/ActionUtil";
import {logout} from './../../Header/Action'
import {store} from './../../../index';

import swal from "sweetalert";

  export function saveIMSDetailsResponse(response,component,event){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.imsDetails) && !isEmpty(response.objectMap.imsDetails.response)){
      let hasError = response.objectMap.imsDetails.response.hasError;
      let msg = response.objectMap.imsDetails.response.message;
      msg = hasError ? msg:'Your details saved, but not submitted. Please click on submit button to submit the details';
      if(!hasError){
        swalPrompt(event,component,"submitConfirmation","","Your details have been saved. Do you wish to send it for approval","Yes","No")
      }else{
        showAlert(hasError,msg);  
      }
      if(!hasError){
        return {
          type: "SAVE_IMS_DETAILS_RESPONSE",
          payload: response
        };
      }else{
        return {
          type:""
        };
      }
    }
  }

  export function getIMSDetailsResponse(response){
    return {
      type: "POPULATE_IMS_DETAILS",
      payload: response 
    };
  }

  export function submitRegistrationResponse(response,componentProps){
    
    if(!isEmpty(response)){
      let swalTitle=response.success===false?"Wrong":"Done";
      let swalText=response.message;
      let swalType=response.success===false?"warning":"success";
      swal({
          title: swalTitle,
          text: swalText,
          icon: swalType,
          type: swalType
        }).then((isConfirm)=>{
         if (isConfirm && response.success && !isEmpty(componentProps.partner.isProfileUpdated) && componentProps.partner.isProfileUpdated == 'N'){
           store.dispatch(logout());
         }
        })
      if(response.scucess){
        
        return {
          type : "REGISTRATION_RESPONSE",
          payload: response
        }
      }else{
        return {
          type : ""
        }
      }
    }
    
      
  }