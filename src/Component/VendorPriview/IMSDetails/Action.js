
import { isEmpty } from "../../../Util/validationUtil";
import { showAlert } from "../../../Util/ActionUtil";
import swal from "sweetalert";

  export function saveIMSDetailsResponse(response){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.imsDetails) && !isEmpty(response.objectMap.imsDetails.response)){
      showAlert(response.objectMap.imsDetails.response.hasError,response.objectMap.imsDetails.response.message);
      if(!response.objectMap.imsDetails.response.hasError){
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

  export function submitRegistrationResponse(response,index){
    
    if(!isEmpty(response) ){
      showAlert(!response.success,response.message);
      
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