import { showAlert, showAlertAndReload} from "../../../Util/ActionUtil"
import { isEmpty } from "../../../Util/validationUtil";
export function getMaterialGetIn(response) {
    return{
        type:"POPULATE_GATE_ENTRY_RGP_MATERIAL",
        payload:response
    }
}

export function getMaterialGetInLineRgp(response) {
    return{
        type:"POPULATE_GATE_ENTRY_LINE_RGP_MATERIAL",
        payload:response
    }
}

export function materialGetInSubmit(response) {
    if(!isEmpty(response) && !isEmpty(response.success)){
        if(response.success){
            showAlertAndReload(!response.success, response.message);
            return{
                type:"GATE_ENTRY_SUBMIT_RES",
                payload:response
            }
        }else{
            showAlert(!response.success, response.message);
            return {
                type : "GATE_ENTRY_SUBMIT_FAILED",
                payload: response
            }
        }
    }else{
        return {
            type : "GATE_ENTRY_SUBMIT_FAILED",
            payload: response
        }
    }
}

// export function changeLoaderState(response){
//     return {
//         type: "CHANGE_LOADER_STATE",
//         payload: response
//     };
// }

// export function updateStatus(response){
//     if(!isEmpty(response) && !isEmpty(response.success)){
//         showAlertAndReload(!response.success, response.message);
//         return {
//             type: "UPDATE_STATUS",
//             payload: response
//         };
//     }else{
//         return {
//             type : "UPDATE_STATUS",
//             payload: response
//         }
//     }
// }