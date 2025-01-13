import { showAlertAndReload} from "../../Util/ActionUtil";
import { isEmpty } from "../../Util/validationUtil";
export let loader = true;

export function populatePartnerInfo(response){
    // 
    
    return {
        type: "POPULATE_PARTNER_INFO",
        payload: response.objectMap,
        
    
}
}


export function updateVendorPartnerStatus(response){
    if(!isEmpty(response)){
        showAlertAndReload(!response.success,response.message);
    }else{
        showAlertAndReload(true,"Failed to Start Edit Mode");
    }
    return {
        type: "UPDATE_VENDOR_PARTNER_STATUS",
        payload: response
    }
}