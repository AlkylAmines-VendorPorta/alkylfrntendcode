import { showAlertAndReload,showAlert} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
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

// export function submitAnnexure(response) {
//     if(!isEmpty(response) && !isEmpty(response.objectMap)
//       && !isEmpty(response.objectMap.annexureDto) && !isEmpty(response.objectMap.annexureDto.response) ){
//         response.success?showAlertAndReload(response.objectMap.annexureDto.response.hasError,response.message):showAlert(response.objectMap.annexureDto.response.hasError,response.message);
//         if(!response.objectMap.annexureDto.response.hasError){
//             return{
//                 type:"SUBMIT_QCF_ANNEXURE",
//                 payload:response
//             }
//         }else{
//             return {
//                 type : "SUBMIT_QCF_ANNEXURE_FAILED",
//                 payload: response
//             }
//         }
//     }else{
//         if(!isEmpty(response) && !isEmpty(response.success)){
//             showAlert(!response.success,response.message);
//         }
//         return {
//             type : "SUBMIT_QCF_ANNEXURE_FAILED",
//             payload: response
//         }
//     }
// }
export function updateAnnexureApproval(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        //showAlert(!response.success,response.message);
      //response.success?showAlertAndReload(!response.success,response.message):showAlert(!response.success,response.message);
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
export function qcfApproval(response,c,e) {
  
    if (!isEmpty(response) && !isEmpty(response.objectMap) ) {
      return {
        type: "QCF_APPROVAL",
        payload: response
      };
    } else {
        return {
            type : "SAVE_QCF_ANNEXURE_FAILED",
            payload: response
        }
    }}