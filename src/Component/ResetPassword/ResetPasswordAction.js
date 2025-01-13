
import  { updatePasswordApi } from './../../Util/APIUtils';



export function resetPassword(data){
    
      return(dispatch)=>{
          return updatePasswordApi(data).then((response)=>{
              dispatch(resetPasswordResponse(response))
          })
      }
  }
  
  export function resetPasswordResponse(response){
      
      if(response.hasError === true){
        return{
            type: 'NOT_RESET',
            payload: response
        }
      }else{
        return{
          type:'RESET_PASSWORD',
          payload:response
      }
    }
  }