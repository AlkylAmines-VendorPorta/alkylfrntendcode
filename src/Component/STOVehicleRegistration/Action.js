import { isEmpty } from "lodash-es"
import { showAlert, showAlertAndReload} from "../../Util/ActionUtil";


export function saveVehicleRegistration(response) {
    if (!isEmpty(response) && response.success) {
        showAlertAndReload(!response.success, response.message, null);
        return {
            type: "SAVE_VEHICLE_REGISTRATION",
            payload: response
        }
    }else{
        showAlertAndReload(!response.success, response.message, null);
        return {
            type: "SAVE_VEHICLE_REGISTRATION",
            payload: response
        }
    }
}

export function populateVehicleRegDropDown(response) {
    return {
        type: "POPULATE_VEHICLE_REG_DROPDOWN",
        payload: response
    };
}