import {showAlert} from "../../../Util/ActionUtil"
import { isEmpty } from "../../../Util/validationUtil";
export let loader = true;

  export function saveBankDetailsResponse(response) {
    if(!isEmpty(response)  && !isEmpty(response.response)){
      showAlert(response.response.hasError,response.response.message);
      if(!response.response.hasError){
        return {
          type: "SAVE_BANK_DETAILS_RESP",
          payload: response
        };
      }else{
        return {
          type: ""
        };
      }
    }
   
  }

  export function getBankDetailsResponse(response) {
    
    return {
      type: "GET_BANK_DETAILS_RESP",
      payload: response
    };
  }

