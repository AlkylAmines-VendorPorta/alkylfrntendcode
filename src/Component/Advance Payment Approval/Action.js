import { isEmpty } from "../../Util/validationUtil";
import { showAlertAndReload, showAlert} from "./../../Util/ActionUtil"


export function getVendorPayforApproval(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "GET_PAY_LIST_FOR_APPROVAL",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}

    export function approvePayment(response) {
      // console.log('response',response)
      // if(!isEmpty(response) && !isEmpty(response.objectMap)
      // && !isEmpty(response.objectMap.quotation) )
      if(!isEmpty(response) && !isEmpty(response.objectMap)){
          showAlertAndReload(!response.success,response.message);
          return {
              type: "APPROVE_PAYMENT",
              payload: response
            };
      }else{
        // showAlertAndReload(!response.success,response.message);
        showAlert(!response.success,response.message);
          return {
              type: "APPROVE_PAYMENT_FAILED",
              payload: response
            };
      }
    }


    export function rejectadvancePayment(response){
      if(!isEmpty(response) && !isEmpty(response.objectMap)){
        showAlertAndReload(!response.success,response.message);

        return {
          type: "REJECT_PAYMENT",
          payload: response
        };
  }else{
    // showAlertAndReload(!response.success,response.message);
    showAlert(!response.success,response.message);
      return {
          type: "REJECT_PAYMENT_FAILED",
          payload: response
        };
  }
     //   showAlertAndReload(!response.success,response.message,"");
        
        // if(response.success){
        //   return {
        //     type: "REJECT_PAYMENT",
        //     payload:  response
        //   }
        // }else{
        //   return {
        //     type: "",
        //     payload:  ""
        //   } 
        // }
        
    }