import { showAlert,showAlertAndReload } from "../../Util/ActionUtil";
import { logoutAPi } from "../../Util/APIUtils";
import { ACCESS_TOKEN,IS_USER_AUTHENTICATED } from '../../Constants/index';
import { TILES_URL } from "../../Constants/UrlConstants";
import { isEmpty } from "../../Util/validationUtil";
import { home_url } from "../../Util/urlUtil";

export function populateUserDetails(response){
    return {
        type: "POPULATE_USER_DETAILS",
        payload: response
    }
}


export function getAccessMasterDtoByUsingRoleId(response){
    return {
        type: "GET_ACCESS_MASTER_DTO",
        payload: response
    }
}
export function logout() {
    return (dispatch) => { 
        return logoutAPi().then((response) => {
            dispatch(logoutResponse(response))
        }).catch(err => {
        })
    }
  }
  
  export function logoutResponse(response) {
    if (response === "Done" || response === "{'status':'401'}") {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.setItem(IS_USER_AUTHENTICATED,false);
        localStorage.setItem(TILES_URL,"");
        // setTimeout(()=>{
            window.location.href=home_url;
        // },1000);
            
        return {
            type: 'LOGOUT',
            payload: response
        }
    } else {
        showAlert(true,"Unable to Logout, Please try again later")
        return {
            type: 'NOT_LOGOUT',
            payload: response
        }
    }
  }


  export function changeRole(response) {
  
    if(!isEmpty(response) && !isEmpty(response.success) && response.success===true
        && !isEmpty(response.objectMap) && !isEmpty(response.objectMap.tileList)){
        localStorage.setItem(TILES_URL,JSON.stringify(response.objectMap.tileList));
        //showAlertAndReload(!response.success,"Role Access Changed!",'/alkyl/userDashboard');
        showAlertAndReload(!response.success,"Role Access Changed!",'userDashboard');
        return {
            type: 'CHANGE_ROLE',
            payload: response
        }
    } else {
        showAlert(true,"Unable to Change Role, Please try again later")
        return {
            type: 'CHANGE_ROLE_FAILED',
            payload: response
        }
    }
  }