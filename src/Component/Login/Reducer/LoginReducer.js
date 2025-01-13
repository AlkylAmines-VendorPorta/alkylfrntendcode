import swal from 'sweetalert';
// import { home_url } from "../../../Util/urlUtil";
import { showAlertAndReloadToHome} from "../../../Util/ActionUtil";

let defaultState = {

    index : 0,
    leftPaneData:[],

    isAddNew: false

}

const login = (state = defaultState, action) => {

           
    if (action.type === 'SEND_EMAIL') {
        showAlertAndReloadToHome(false,"Your new password has been set, Please check your mail for new Password");
        // swal({
        //     title: "Done",
        //     text: "Your new password has been set, Please check your mail for new Password",
        //     icon: "success",
        //     type: "success",
        //     dangerMode: true,
        //   }).then(function(isConfirm) {
        //     if (isConfirm) {
        //         window.location.href=home_url; 
        //     } 
        //   });
        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors,
        }
    } else if (action.type === 'NOT_EMAIL') {
        swal({
            icon: "error",
            type: 'error',
            title: 'Wrong Email Address',
            showConfirmButton: false});

        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors
        }
    }

    else {
        return {
            ...state
        }
    }
   

}

export default login