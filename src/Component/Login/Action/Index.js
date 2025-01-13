import {forgetPasswordApi} from '../../../Util/APIUtils';


export function sendEmail(data) {
   
    return (dispatch) => {
        return forgetPasswordApi(data).then((response) => {
            dispatch(forgetPasswordResponse(response))
        })
    }
}

export function forgetPasswordResponse(response) {
   
   if(response.hasError===true){
    return {
        type: 'NOT_EMAIL',
        payload: response,

    }
   }
        return {
            type: 'SEND_EMAIL',
            payload: response,

        }
    
}

export function loadLogin(){
    return{
      type:"LOAD_LOGIN"
    };
}