import { showAlert, showAlertAndReload} from "../../../Util/ActionUtil"
import { isEmpty } from "../../../Util/validationUtil";
export function getGateEntryRgp(response) {
    return{
        type:"POPULATE_GATE_ENTRY_RGP",
        payload:response
    }
}

export function getGateEntryLineRgp(response) {
    return{
        type:"POPULATE_GATE_ENTRY_LINE_RGP",
        payload:response
    }
}

export function gateEntryRgpSubmit(response) {
    debugger
    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
            showAlertAndReload(!response.success, response.message);
            return{
                type:"GATE_ENTRY_SUBMIT_RES",
                payload:response
            }
        }else{
            showAlert(!response.success, response.message);
            return {
                type : "GATE_ENTRY_SUBMIT_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "GATE_ENTRY_SUBMIT_FAILED",
            payload: response
        }
    }
}


export function gateEntryRgpSubmitupdate(response) {
    debugger
    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
        //    showAlertAndReload(!response.success, response.message);
            return{
                type:"GATE_ENTRY_SUBMIT_RES",
                payload:response
            }
        }else{
            showAlert(!response.success, response.message);
            return {
                type : "GATE_ENTRY_SUBMIT_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "GATE_ENTRY_SUBMIT_FAILED",
            payload: response
        }
    }
}

export function changeLoaderState(response){
    return {
        type: "CHANGE_LOADER_STATE",
        payload: response
    };
}

export function updateStatus(response){
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success, response.message);
        return {
            type: "UPDATE_STATUS",
            payload: response
        };
    }else{
        return {
            type : "UPDATE_STATUS",
            payload: response
        }
    }
}
export function getGateEntryLineByGateEntryIdTest(response) {
   if (!isEmpty(response)){
    return{
        type:"POPULATE_GATE_ENTRY_LINE_RGP_TEST",
        payload:response
    }
}}

export function getFormNo(response) {
    if (!isEmpty(response)){
    return{
        type:"POPULATE_FORM_NO",
        payload:response
    }
}}


export function getGateEntryVendorSAP(response) {

    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
        //    showAlertAndReload(!response.success, response.message);
            return{
                type:"POPULATE_GATE_ENTRY_SAP_VENDOR_DATA",
                payload:response
            }
        }else{
            showAlertAndReload(!response.success, response.message);
            return {
                type : "POPULATE_GATE_ENTRY_SAP_VENDOR_DATA_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "POPULATE_GATE_ENTRY_SAP_VENDOR_DATA_FAILED",
            payload: response
        }
    }
}


export function cancelgateentryrequest(response){

    //this.setState({cancelAsnButton: 'none'})
    showAlertAndReload(!response.success, "Request has been cancelled", null);
     return {
         type: "CANCEL_GATE_ENTRY_BUTTON",
        payload:  response
       }

}
