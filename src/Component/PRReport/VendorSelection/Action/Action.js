import { showAlertAndReload} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function searchVendorByName(response) {
    return {
        type: "SEARCH_VENDOR",
        payload:response
    }
}
export function enquiryId(response) {
    return {
        type: "SEARCH_VENDO",
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