import { isEmpty } from "../../../../Util/validationUtil";
import { showAlertAndReload,showAlert} from "../../../../Util/ActionUtil"
export function getQCF(response) {
    return{
        type:"POPULATE_QCF_DETAILS",
        payload:response
    }
}
export function submitAnnexure(response) {
    
    if(!isEmpty(response) && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.annexure) && !isEmpty(response.objectMap.annexure.response) ){
        response.success?showAlertAndReload(response.objectMap.annexure.response.hasError,response.message):showAlert(response.objectMap.annexure.response.hasError,response.message);
        if(!response.objectMap.annexure.response.hasError){
            return{
                type:"SUBMIT_QCF_ANNEXURE",
                payload:response
            }
        }else{
            return {
                type : "SUBMIT_QCF_ANNEXURE_FAILED",
                payload: response
            }
        }
    }else{
        if(!isEmpty(response) && !isEmpty(response.success)){
            showAlert(!response.success,response.message);
        }
        return {
            type : "SUBMIT_QCF_ANNEXURE_FAILED",
            payload: response
        }
    }
}