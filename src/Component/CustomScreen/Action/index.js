import { isEmpty } from "lodash-es"
import { showAlert} from "../../../Util/ActionUtil";
import swal from "sweetalert";

export function saveASNDetailsResponse(response,component) {
  
  if(!isEmpty(response)){
      //showAlert(response.hasError,response.message);
      let swalTitle=response.success===false?"Wrong":"Done";
      let swalText=response.message;
      let swalType=response.success===false?"warning":"success";
      swal({
          title: swalTitle,
          text: swalText,
          icon: swalType,
          type: swalType
        })
      if(!response.hasError){
        component.onReset();
        return {
          type: "SAVE_ASN_DETAILS",
          payload: response
        };
      }else{
        return {
          type: "ERROR_ASN_DETAILS"
        };
      }
    }
   
  }

  
  export function getEnqByID(response) {
    return{
      type:"GET_CUSTOM_ENQ_BY_ID",
      payload:response
    }
  }
  export function updateEnqEndDate(response) {
    if(!isEmpty(response)){
      showAlert(!response.success,response.message);
        return {
          type: "GET_CUSTOM_ENQ_SAVE",
          payload: response
        };
      }else{
        return {
          type: "GET_CUSTOM_ENQ_SAVE"
        };
      }
    }

    export function showAsnReminderResp(response) {
      if (!isEmpty(response) && !isEmpty(response.objectMap)) {
        return {
          type: "SHOW_ASN_REMINDER",
          payload: response
        };  
      } else {
        return {
          type: ""
        };
      }
    }    

    export function deleteAsnReminder(response,component) {
      if(!isEmpty(response)){
        showAlert(response.hasError,response.message);
        if(!response.hasError){
          component.onReset();
          return {
            type: "DELETE_ASN_DETAILS",
            payload: response
          };
        }else{
          return {
            type: "ERROR_DELETE_ASN_DETAILS"
          };
        }
      }
     
    }