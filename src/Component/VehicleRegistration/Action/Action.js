import { isEmpty } from "lodash-es"
import { showAlertAndReload} from "../../../Util/ActionUtil";
export function populateVehicleRegDropDown(response) {
    return {
        type: "POPULATE_VEHICLE_REG_DROPDOWN",
        payload: response
    };
}

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

export function changeLoaderState(response){
    return {
      type: "CHANGE_LOADER_STATE",
      payload: response
    };
  }