import { showAlertAndReload, showAlert} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function updateAnnexureApproval(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
      // response.success?showAlertAndReload(!response.success,response.message):showAlert(!response.success,response.message);
        if(response.success){
            return{
                type:"ANNEXURE_APPROVAL",
                payload:response
            }
        }else{
            return {
                type : "ANNEXURE_APPROVAL_FAILED",
                payload: response
            }
        }
    }else {
        showAlertAndReload(true,"Error Updating Record!");
        return {
            type : "ANNEXURE_APPROVAL_FAILED",
            payload: response
        }
    }
}

export function updateAnnexureReject(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
        if(response.success){
            return{
                type:"ANNEXURE_REJECT",
                payload:response
            }
        }else{
            return {
                type : "ANNEXURE_REJECT_FAILED",
                payload: response
            }
        }
    }else {
        showAlertAndReload(true,"Error Updating Record!");
        return {
            type : "ANNEXURE_REJECT_FAILED",
            payload: response
        }
    }
}

export function generateQCF(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
        // window.location.reload(true);
        return{
            type:"GENERATE_QCF",
            payload:response
        }
    }else{
        return{
            type:"GENERATE_QCF_FAILED",
            payload:response
        }
    }
}

export function saveAnnexure(response) {
    
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.annexure) && !isEmpty(response.objectMap.annexure.response) ){
        showAlertAndReload(response.objectMap.annexure.response.hasError,response.message);
        if(!response.objectMap.annexure.response.hasError){
            return{
                type:"SAVE_QCF_ANNEXURE",
                payload:response
            }
        }else{
            return {
                type : "SAVE_QCF_ANNEXURE_FAILED",
                payload: response
            }
        }
    }else{
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlert(!response.success,response.message);
        }
        return {
            type : "SAVE_QCF_ANNEXURE_FAILED",
            payload: response
        }
    }
}

export function update2ndtimeAnnexureApproval(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlert(!response.success,response.message);
      // response.success?showAlertAndReload(!response.success,response.message):showAlert(!response.success,response.message);
        if(response.success){
            
            return{
                type:"ANNEXURE_APPROVAL",
                payload:response
            }
        }else{
            return {
                type : "ANNEXURE_APPROVAL_FAILED",
                payload: response
            }
        }
    }else {
        showAlertAndReload(true,"Error Updating Record!");
        return {
            type : "ANNEXURE_APPROVAL_FAILED",
            payload: response
        }
    }
}