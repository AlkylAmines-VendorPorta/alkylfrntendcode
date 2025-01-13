import { showAlertAndReload} from "../../../../Util/ActionUtil"
import { isEmpty } from "../../../../Util/validationUtil";
export function getEnquiries(response) {
    return{
        type:"POPULATE_VENDOR_LIST",
        payload:response
    }
}


export function getItemByBidId(response) {
    return{
        type:"POPULATE_VENDOR_ITEM_BID_LIST",
        payload:response
    }
}


export function getUnAssignedPrLine(response) {
    return{
        type:"POPULATE_UNSIGNED_PR_LINE_LIST",
        payload:response
    }
}


export function createUnAssignedPrLine(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        showAlertAndReload(!response.success,response.message);
      }
    return{
        type:"CREATE_UNASSIGNED_PR_LINE",
        payload:response
    }
}
