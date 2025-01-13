import { isEmpty } from "../../../Util/validationUtil";
import { showAlert,swalWithUrl,showAlertAndReload} from "../../../Util/ActionUtil";
import swal from "sweetalert";
export function gateEntryResponse(response,c,e) {
  if (!isEmpty(response) && !isEmpty(response.objectMap)) {
    return {
      type: "GATE_ENTRY_LIST",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }}

  export function securityASNSubmit(response) {
    debugger
    if(!isEmpty(response) && !isEmpty(response.success)){
    // showAlertAndReload(!response.success, response.message,"GateEntryforCommercial");
        if(response.success){
        
            return{
                type:"SECURITY_ASN_SUBMIT_RES",
                payload:response
            }
        }else{
         //showAlert(!response.success, response.message);
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


export function saveASN(response){
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
  return {
    type: "POPULATE_PO_FOR_ASN",
    payload:  response
  }
}

export function getPOLineListForASNLine(response){
  return {
    type: "POPULATE_PO_LINE_FOR_ASN_LINE",
    payload:  response
  }
}

export function getASNList(response){
  return {
    type: "POPULATE_ASN_LIST",
    payload:  response
  }
}

export function getASNLineList(response){
  return {
    type: "POPULATE_ASN_LINE_LIST",
    payload:  response
  }
}
//nikhil code
export function getStorageLocFromSAP(response){
 return {
   type:"POPULATE_STORAGE_LOC",
   payload: response
  }
}
//nikhil code
export function getServiceLineList(response){
  return {
    type: "POPULATE_SERVICE_LINE_LIST_FOR_ASN_LINE",
    payload:  response
  }
}

export function saveGateEntry(response){
  
  if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.asnDetails) && !isEmpty(response.objectMap.asnDetails.response) ){
        document.getElementsByClassName("closeModal")[0].click();
        swalWithUrl(response.objectMap.asnDetails.response.hasError,response.objectMap.asnDetails.response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
    //showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
    //showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
//      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"/GateEntryforCommercial");
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
  if(!isEmpty(response)){
      showAlert(!response.success,response.message);
// swalWithUrl(!response.success,response.message,"gateentry");
   swalWithUrl(!response.success,response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
//      showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
//     showAlert(!response.success,response.message);
    swalWithUrl(!response.success,response.message,"GateEntryforCommercial");
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
  if(!isEmpty(response)){
    showAlertAndReload(!response.success,response.message,"purchaseorder");
    
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

  //this.setState({cancelAsnButton: 'none'})
  showAlertAndReload(!response.success,"ASN has been cancelled");
   return {
       type: "CANCEL_ASN_BUTTON",
      payload:  response
     }

}

export function cancelSSN(response){
//showAlertAndReload(!response.success,"ASN/SSN has been cancelled",'alkyl/purchaseorder');
showAlert(!response.success,"SSN has been cancelled");
    return {
      type: "CANCEL_SSN_BUTTON",
      payload:  response
    }
}

export function rejectASN(response){

  //this.setState({cancelAsnButton: 'none'})
  showAlertAndReload(!response.success,"ASN has been Rejected");
   return {
       type: "REJECT_ASN_BUTTON",
      payload:  response
     }

}
export function approveServiceSheet(response,componentProps){
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
  return {
    type: "POPULATE_ASN_STATUS_LIST",
    payload:  response
  }
}
export function getPurchaseOrderforgateentry(response) {
  

  if(response.message=='ASN Exist'|| response.message=='No Open ASN Found For Searched PO Please Send ASN Creation Reminder'|| response.message=='PO not yet released'|| response.message=='PO NOT FOUND,PLS CHECK PO NO..'){

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
  else{
    showAlertAndReload(!response.success,response.message,"purchaseorder");
    return {
      type: "POPULATE_PURCHASE_FOR_GATE_ENTRY",
      payload:  response
    }
  }

}

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
export function getASNListforCommercial(response){
  return {
    type: "POPULATE_ASN_LIST_FOR_COMMERCIAL",
    payload:  response
  }
}

export function asnGateIn(response){
  if(!isEmpty(response)){
    showAlert(!response.success, response.message);
    if(response.success){
      return {
        type : "ASN_GATE_IN_STATUS",
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

export function getId(response){
  return {
    type: "ASN_ID",
    payload:  response
  }
}