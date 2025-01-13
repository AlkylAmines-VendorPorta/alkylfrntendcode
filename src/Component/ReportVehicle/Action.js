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

export function cancelASN(response){

    //this.setState({cancelAsnButton: 'none'})
    showAlertAndReload(!response.success, "Request has been cancelled", null);
     return {
         type: "CANCEL_ASN_BUTTON",
        payload:  response
       }

}

export function revokeCancel(response){

    //this.setState({cancelAsnButton: 'none'})
    showAlertAndReload(!response.success, "Cancellation has been revoked", null);
     return {
         type: "REVOKE_CANCEL",
        payload:  response
       }

}