import swal from 'sweetalert';
import { home_url } from "../../Util/urlUtil";
//import update from 'react-addons-update';

let defaultState = {
    failedResponse: [],
}

const resetPassword = (state = defaultState, action) => {
    
    if (action.type === 'RESET_PASSWORD') {

        swal({
            title: "Done",
            text: "Password has been change successfully,",
            icon: "success",
            type: "success",
            dangerMode: true,
          }).then(function(isConfirm) {
            if (isConfirm) {
                window.location.href=home_url; 
            } 
          });
        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors,
        }
    } else if (action.type === 'NOT_RESET') {
        

        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors
        }
    } else {
        return {
            ...state
        }

    }

}
export default resetPassword;