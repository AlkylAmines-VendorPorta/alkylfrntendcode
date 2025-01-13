import { showAlert,swalWithUrl,showAlertAndReload} from "./../../Util/ActionUtil";
//import { submitToURL,  } from "../../../Util/APIUtils";
import { isEmpty } from "./../../Util/validationUtil";
//import { showAlert } from "../../../Util/ActionUtil";
import swal from "sweetalert";
  export function getUserDashboardDetails(response){
    return {
      type: "POPULATE_USER_DASHBOARD_DETAILS",
      payload:  response
    }
  }

  export function getPOList(response){
    return {
      type: "GET_PO_LIST",
      payload:  response
    }
  }

  export function getPurchaseOrder(response) {
    
    return {
        type: "POPULATE_PURCHASE_ORDER_AND_PARTNER",
        payload: response
    }
  }
    export function getpoListbypoNo(response) {
    
      return {
          type: "POPULATE_PURCHASE_ORDER_BY_PONO",
          payload: response
      }

}

export function getPOLines(response){
  return {
    type: "POPULATE_PO_LINE",
    payload: response
  };
}

export function getServiceListForPOLine(response){
  return {
    type: "POPULATE_SERVICE_LIST_FOR_PO_LINE",
    payload:  response
  }
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