import { isEmpty } from "lodash-es";
import { showAlert,swalWithUrl,showAlertAndReload} from "../../../Util/ActionUtil";
//import { submitToURL,  } from "../../../Util/APIUtils";
//import { isEmpty } from "../../../Util/validationUtil";
//import { showAlert } from "../../../Util/ActionUtil";
import swal from "sweetalert";
  export function populatePurchaseOrderDetails(response,index){
    return {
        type : "POPULATE_DROP_DOWN",
        payload: response
    };
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

  export function getPurchaseOrderforgateentry(response) {
    if(response.message=='ASN Exist'){
      let swalTitle=response.success===false?"Wrong":"Done";
      let swalText=response.message;
      let swalType=response.success===false?"warning":"success";
      showAlert(!response.success,response.message);
    }
    else if(response.message=='No Open ASN Found For Searched PO Please Send ASN Creation Reminder'|| response.message=='PO not yet released'|| response.message=='PO NOT FOUND,PLS CHECK PO NO..'){

      let swalTitle=response.success===false?"Wrong":"Done";
      let swalText=response.message;
      let swalType=response.success===false?"warning":"success";
  swal({
     title: swalTitle,
     text: swalText,
     icon: swalType,
     type: swalType
   })

   return {
     type: "POPULATE_PURCHASE_FOR_GATE_ENTRY",
     payload:  response
   }
   }
   else if(response.message===null){

    return {
      type: "POPULATE_PURCHASE_FOR_GATE_ENTRY",
      payload:  response
    }
   }
    else{
      showAlert(!response.success,response.message);
      return {
        type: "POPULATE_PURCHASE_FOR_GATE_ENTRY",
        payload:  response
      }
    }

}


export function getSTOASNDetails(response){
  return {
    type: "STO_ASN_DETAILS",
    payload: response
  };
}

export function securityASNSubmit(response) {
  debugger
  if(!isEmpty(response)){
      if(response.success){
        showAlertAndReload(!response.success, response.message,"GateEntryforCommercial");
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
