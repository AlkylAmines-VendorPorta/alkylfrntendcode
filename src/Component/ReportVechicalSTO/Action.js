import { isEmpty } from "lodash-es"
import { showAlert, showAlertAndReload} from "../../Util/ActionUtil";
export function populateVehicleReg(response) {
    return {
        type: "POPULATE_VEHICLE_REG",
        payload: response
    };
}

export function changeLoaderState(response){
    return {
      type: "CHANGE_LOADER_STATE",
      payload: response
    };
  }

  export function reportVehicle(response) {
    if (!isEmpty(response)) {
        if(response.success)
            showAlertAndReload(!response.success, response.message, null);
        else
            showAlert(!response.success, response.message);
        return {
            type: "SAVE_REPORT_VEHICLE_REGISTRATION",
            payload: response
        }
    }else{
        return {
            type: "SAVE_REPORT_VEHICLE_REGISTRATION",
            payload: response
        }
    }
}

export function vehicleGateIN(response) {
    if (!isEmpty(response)) {
        if(response.success)
            showAlertAndReload(!response.success, response.message, null);
        else
            showAlert(!response.success, response.message);
        return {
            type: "VEHICLE_GATE_IN",
            payload: response
        }
    }else{
        return {
            type: "VEHICLE_GATE_IN",
            payload: response
        }
    }
}

export function vehicleGateOUT(response) {
    if (!isEmpty(response)) {
        if(response.success)
            showAlertAndReload(!response.success, response.message, null);
        else
            showAlert(!response.success, response.message);
        return {
            type: "VEHICLE_GATE_OUT",
            payload: response
        }
    }else{
        return {
            type: "VEHICLE_GATE_OUT",
            payload: response
        }
    }
}


export function securityASNSubmit(response) {
    debugger
    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
         
            return{
                type:"SECURITY_ASN_SUBMIT_RES",
                payload:response
            }
        }else{
           
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


  export function markASNInTransit(response){
    if(!isEmpty(response)){
        showAlert(!response.success,response.message);
     // swalWithUrl(!response.success,response.message,"purchaseorder");
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