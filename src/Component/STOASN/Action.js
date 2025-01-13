import { isEmpty } from "../../Util/validationUtil";
import { showAlert,swalWithUrl,showAlertAndReload} from "../../Util/ActionUtil"
import swal from "sweetalert";
export function getSTOASNDetails(response){
    return {
      type: "STO_ASN_DETAILS",
      payload: response
    };
  }

  export function getASNList(response){
    return {
      type: "POPULATE_ASN_LIST",
      payload:  response
    }
  }

  export function securityASNSubmit(response) {
    debugger
    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
          showAlert(!response.success, response.message);
            return{
                type:"UPDATE_ASN_STATUS",
                payload:response
            }
        }else{
            showAlert(!response.success, response.message);
            return {
                type : "SECURITY_ASN_SUBMIT_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "SECURITY_ASN_SUBMIT_FAILED",
            payload: response
        }
    }
}