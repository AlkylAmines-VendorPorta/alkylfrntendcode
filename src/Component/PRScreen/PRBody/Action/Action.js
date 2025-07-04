import { showAlert, showAlertAndReload} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function getPRLines(response) {
    return{
        type:"POPULATE_PR_LINES",
        payload:response
    }
}

export function updatePRSubmit(response) {
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.prDto) && !isEmpty(response.objectMap.prDto.response) ){
        showAlert(response.objectMap.prDto.response.hasError,response.message);
        if(!response.objectMap.prDto.response.hasError){
            return{
                type:"PR_SUBMIT_RES",
                payload:response
            }
        }else{
            return {
                type : "PR_SUBMIT_FAILED",
                payload: response
            }
        }
    }else{
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlert(!response.success,response.message);
        }
        return {
            type : "PR_SUBMIT_FAILED",
            payload: response
        }
    }
}


export function updatePRAttachmentSubmit(response) {
    // if(!isEmpty(response) && !isEmpty(response.objectMap)
    //   && !isEmpty(response.objectMap.prAttSet) && !isEmpty(response.objectMap.prAttSet.response) ){
    //     showAlert(response.objectMap.prAttSet.response.hasError,response.message);
    //     if(!response.objectMap.prAttSet.response.hasError){
    //         return{
    //             type:"PR_SUBMIT_Att_RES",
    //             payload:response
    //         }
    //     }else{
    //         return {
    //             type : "PR_SUBMIT__Att_FAILED",
    //             payload: response
    //         }
    //     }
    // }
    // else{
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlert(!response.success,response.message);
        return{
                type:"PR_Att_RES",
                payload:response
            }
        }
        return {
            type : "PR_SUBMIT_FAILED",
            payload: response
        }
    // }
}

export function disabledReadOnly(){
    return {
        type : "DISABLE_MAIN_CONTAINER_READONLY",
        payload: ""
    }
}

export function updatePRApprove(response) {
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.prDto) && !isEmpty(response.objectMap.prDto.response) ){
        showAlertAndReload(response.objectMap.prDto.response.hasError,response.message);
        if(!response.objectMap.prDto.response.hasError){
            return{
                type:"PR_APPROVE_RES",
                payload:response
            }
        }else{
            return {
                type : "PR_APPROVE_FAILED",
                payload: response
            }
        }
    }else{
        if(!isEmpty(response) && !isEmpty(response.success)){
            // showAlertAndReload(!response.success,response.message);
            showAlert(!response.success,response.message);
        }
        return {
            type : "PR_SUBMIT_FAILED",
            payload: response
        }
    }
}

export function updatePRReject(response) {
    if(!isEmpty(response) && response.success){
        showAlertAndReload(!response.success,response.message);
        if(response.success){
            return{
                type:"PR_REJECT_RES",
                payload:response
            }
        }else{
            return {
                type : "PR_REJECT_FAILED",
                payload: response
            }
        }
    }else {
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlertAndReload(!response.success,response.message);
        }
        return {
            type : "PR_REJECT_RES",
            payload: response
        }
    }
}

export function updatePRBuyerAssign(response) {
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.prDto) && !isEmpty(response.objectMap.prDto.response) ){
        showAlertAndReload(response.objectMap.prDto.response.hasError,response.message);
        if(!response.objectMap.prDto.response.hasError){
            return{
                type:"PR_BUYER_ASSIGN_RES",
                payload:response
            }
        }else{
            return {
                type : "PR_BUYER_ASSIGN_FAILED",
                payload: response
            }
        }
    }else {
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlertAndReload(!response.success,response.message);
        }
        return {
            type : "PR_BUYER_ASSIGN_FAILED",
            payload: response
        }
    }
}

export function removeAttachment(response) {
    showAlert(!response.success,response.message);
    if(!isEmpty(response) && response.success){
        if(response.success){
            return{
                type:"REMOVE_ATTACHMENT_RES",
                payload:response
            }
        }else{
            return {
                type : "REMOVE_ATTACHMENT_RES_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "REMOVE_ATTACHMENT_RES_FAILED",
            payload: response
        }
    }
}