import { showAlertAndReload, showAlert} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";

export function saveQuotation(response) {
    // console.log('response',response)
    
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.quotation) ){
        showAlertAndReload(!response.success,response.message);
        return {
            type: "SAVE_QUOTATION",
            payload: response
          };
    }else{
        showAlertAndReload(!response.success,response.message);
        return {
            type: "SAVE_QUOTATION_FAILED",
            payload: response
          };
    }
}

export function submitQuotation(response) {
  // console.log('response',response)
  // if(!isEmpty(response) && !isEmpty(response.objectMap)
  // && !isEmpty(response.objectMap.quotation) ){
  if(!isEmpty(response) && !isEmpty(response.objectMap)
    && !isEmpty(response.objectMap.enqStatus) ){
      showAlertAndReload(!response.success,response.message);
      return {
          type: "SUBMIT_QUOTATION",
          payload: response
        };
  }else{
     // showAlertAndReload(!response.success,response.message);
     showAlert(!response.success,response.message);
      return {
          type: "SUBMIT_QUOTATION_FAILED",
          payload: response
        };
  }
}

export function approveQuotation(response) {
  // console.log('response',response)
  // if(!isEmpty(response) && !isEmpty(response.objectMap)
  // && !isEmpty(response.objectMap.quotation) )
  if(!isEmpty(response) && !isEmpty(response.objectMap)
    && !isEmpty(response.objectMap.enqStatus) ){
      showAlertAndReload(!response.success,response.message);
      return {
          type: "APPROVE_QUOTATION",
          payload: response
        };
  }else{
    // showAlertAndReload(!response.success,response.message);
    showAlert(!response.success,response.message);
      return {
          type: "APPROVE_QUOTATION_FAILED",
          payload: response
        };
  }
}

export function rejectQuotation(response) {
  // console.log('response',response)
  if(!isEmpty(response) && !isEmpty(response.objectMap)
    && !isEmpty(response.objectMap.quotation) ){
      showAlertAndReload(!response.success,response.message);
      return {
          type: "REJECT_QUOTATION",
          payload: response
        };
  }else{
      showAlertAndReload(!response.success,response.message);
      return {
          type: "REJECT_QUOTATION_FAILED",
          payload: response
        };
  }
}

export function removeAttachment(response) {
  showAlert(!response.success,response.message);
  if(!isEmpty(response) && response.success){
      if(response.success){
          return{
              type:"REMOVE_ATTACHMENT_BIDDER_RES",
              payload:response
          }
      }else{
          return {
              type : "REMOVE_ATTACHMENT_BIDDER_RES_FAILED",
              payload: response
          }
      }
  }else{
      return {
          type : "REMOVE_ATTACHMENT_BIDDER_RES_FAILED",
          payload: response
      }
  }
}

export function getnegotiatorpaymenttermslist(response) {
  if (!isEmpty(response)) {
    return {
      type: "POPULATE_VENDOR_QUOTATION_LINE", 
      payload: response.objectMap
    };
  } 
}

export function getVendorExportExcel(response) {
  if (!isEmpty(response)) {
    return {
      type: "POPULATE_VENDOR_EXPORT_EXCEL", 
      payload: response.objectMap
    };
  } 
}



