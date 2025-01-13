import { showAlert } from "../../../Util/ActionUtil";
import { isEmpty } from "lodash-es";

//import { submitToURL,  } from "../../../Util/APIUtils";
//import { isEmpty } from "../../../Util/validationUtil";
//import { showAlert } from "../../../Util/ActionUtil";
  export function populatePurchaseOrderDetails(response,index){
    return {
        type : "POPULATE_DROP_DOWN",
        payload: response
    }
  }


  export function getPOLines(response){
    return {
      type: "POPULATE_PO_LINE",
      payload: response
    };
  }

  export function getPOLineConditions(response){
    return {
      type: "POPULATE_CONDITIONS",
      payload: response
    };
  }

  export function poAcceptance(response){
    if(!isEmpty(response)){
      showAlert(!response.success, response.message);
      if(response.success){
        return {
          type : "PO_ACCEPTANCE",
          payload : response
        }
      }else{
        return {
          type : "",
          payload : response
        }
      }
    }
  }

  export function getASNListForPO(response){
    return {
      type: "POPULATE_ASN_LIST_FOR_PO",
      payload:  response
    }
  }

  export function getServiceListForPOLine(response){
    return {
      type: "POPULATE_SERVICE_LIST_FOR_PO_LINE",
      payload:  response
    }
  }

  export function viewCompanyListModal(response){
    return {
      type: "VIEW_COMPANY_LIST",
      payload: response
    };
  }