import { showAlertAndReload} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function generateQCF(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
        window.location.reload(true);
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