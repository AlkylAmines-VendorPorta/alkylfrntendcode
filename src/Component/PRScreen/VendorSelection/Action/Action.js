import { showAlertAndReload} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function searchVendorByName(response) {
    return {
        type: "SEARCH_VENDOR",
        payload:response
    }
}

export function createEnquiries(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
        return {
            type: "CREATE_ENQUIRES",
            payload:response
        }
    }else{
        return {
            type: "ENQUIRES_CREATION_FAILED",
            payload:response
        }
    }
}

export function addBindderToEnquiry(response) {
    
    console.log('responseaction', response);
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
        return {
            type: "ENQUIRY_TO_BINDDER",
            payload:response
        }
    }else{
        return {
            type: "ENQUIRES_CREATION_FAILED",
            payload:response
        }
    }
}