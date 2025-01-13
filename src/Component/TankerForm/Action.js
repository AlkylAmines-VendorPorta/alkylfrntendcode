import {
    //submitWithParam,
    //submitToURL,
    submitForm,
    //submitWithFourParam,
    //submitWithTwoParam,
    //getCurrentUser
  } from "../../Util/APIUtils";
  
  //import swal from "sweetalert";
  import { isEmpty } from "lodash-es";
  import { showAlert,swalWithUrl,showAlertAndReload} from "../../Util/ActionUtil";
  
  export function saveASN(response){
    console.log("saveASN" + response);
  if(!isEmpty(response) && !isEmpty(response.objectMap)
    && !isEmpty(response.objectMap.asnDetails) && !isEmpty(response.objectMap.asnDetails.response) ){
    showAlert(response.objectMap.asnDetails.response.hasError,response.objectMap.asnDetails.response.message);
      if(!response.objectMap.asnDetails.response.hasError){
        return {
          type : "SAVE_ASN",
          payload: response
        }
      }else{
        return {
          type : "",
          payload: ""
        }
      }
    }
  }
  
  export function saveASNLines(response){
    console.log("saveASNLines" + response);
  if(!isEmpty(response) ){
      showAlert(!response.success,response.message);
      if(response.success){
        return {
            type : "SAVE_ASN_LINES",
            payload: response
        }
      }else{
        return {
          type : "",
          payload: ""
        }
      }
  }
  }
  
  export function getPOListForASN(response){
    console.log("action" + response);
  return {
    type: "POPULATE_PO_FOR_ASN",
    payload:  response
    
  }
  }
  
  export function getPOLineListForASNLine(response){
    console.log("getPOLineListForASNLine" + response);
  return {
    type: "POPULATE_PO_LINE_FOR_ASN_LINE",
    payload:  response
  }
  }
  
  export function getASNList(response){
    console.log("getASNList" + response);
  return {
    type: "POPULATE_ASN_LIST",
    payload:  response
  }
  }
  
  export function getASNLineList(response){
    console.log("getASNLineList" + response);
  return {
    type: "POPULATE_ASN_LINE_LIST",
    payload:  response
  }
  }
  
  export function getServiceLineList(response){
    console.log("getServiceLineList" + response);
  return {
    type: "POPULATE_SERVICE_LINE_LIST_FOR_ASN_LINE",
    payload:  response
  }
  }
  
  export function saveGateEntry(response){
    console.log("saveGateEntry" + response);
  if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.asnDetails) && !isEmpty(response.objectMap.asnDetails.response) ){
        document.getElementsByClassName("closeModal")[0].click();
        swalWithUrl(response.objectMap.asnDetails.response.hasError,response.objectMap.asnDetails.response.message,"gateentry");
        //showAlert(response.objectMap.asnDetails.response.hasError,response.objectMap.asnDetails.response.message);
        if(!response.objectMap.asnDetails.response.hasError){
          return {
            type: "POPULATE_GATE_ENTRY",
            payload:  response
          }
        }else{
  
          return {
            type: "",
            payload:  ""
          }
        }
  }
  }
  
  export function safetyCheckResponse(response){
    console.log("safetyCheckResponse" + response);
  if(!isEmpty(response)){
    //showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"gateentry");
    if(response.success){
      
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function editAsnResponce(response){
    console.log("editAsnResponce" + response);
  if(!isEmpty(response)){
    ;
    //swalWithUrl(!response.success,response.message,);
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function qcResponse(response){
    console.log("qcResponse" + response);
  if(!isEmpty(response)){
    //showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"gateentry");
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function ohcResponse(response){
    console.log("ohcResponse" + response);
  if(!isEmpty(response)){
  //      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"/gateentry");
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function gateInResponse(response){
    console.log("gateInResponse" + response);
  if(!isEmpty(response)){
  //      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"gateentry");
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function gateOutResponse(response){
    console.log("gateOutResponse" + response);
  if(!isEmpty(response)){
  //      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"gateentry");
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function markASNInTransit(response){
    console.log("markASNInTransit" + response);
  if(!isEmpty(response)){
    swalWithUrl(!response.success,response.message,"purchaseorder");
       return {
        type: "",
        payload:  ""
      } 
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function asnUnLoadResponse(response){
    console.log("asnUnLoadResponse" + response);
  if(!isEmpty(response)){
  //      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"gateentry");
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  
  
  
  export function submitServiceSheet(response){ 
    console.log("submitServiceSheet" + response);
  if(!isEmpty(response)){
    showAlert(!response.success,response.message);
    
    if(response.success){
      return {
        type: "SAVE_AND_SUBMIT_SERVICE_SHEET",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function cancelASN(response){
    console.log("cancelASN" + response);
  
  showAlertAndReload(!response.success,"ASN has been cancelled",'');
      return {
        type: "",
        payload:  ""
      }
  }
  
  export function cancelSSN(response){
    console.log("cancelSSN" + response);
  showAlertAndReload(!response.success,"ASN/SSN has been cancelled",'/purchaseorder');
    return {
      type: "",
      payload:  ""
    }
  }
  export function approveServiceSheet(response,componentProps){
    console.log("approveServiceSheet" + response);
  if(!isEmpty(componentProps) && !isEmpty(componentProps.changeASNStatus)) componentProps.changeASNStatus(true);
  // return {
  //   type: "",
  //   payload:  ""
  // }
  if(!isEmpty(response)){
    showAlert(!response.success,response.message);
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  
  export function rejectServiceSheet(response){
    console.log("getStatusDisplay" + response);
  if(!isEmpty(response)){
    showAlert(!response.success,response.message);
    
    if(response.success){
      return {
        type: "UPDATE_ASN_STATUS",
        payload:  response
      }
    }else{
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
  }
  export function getStatusDisplay(response){
    console.log("getStatusDisplay" + response);
  return {
    type: "POPULATE_ASN_STATUS_LIST",
    payload:  response
  }
  }