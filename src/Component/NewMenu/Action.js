import { isEmpty } from "../../Util/validationUtil";
import { showAlert } from "../../Util/ActionUtil";



 export function populateInternalUserDropDown(response, index) {
   
    return {
      type: "POPULATE_DROP_DOWN",
      payload: response
    };
  
  }


  export function showInternalUsers(response, index) {
    
    
     return {
       type: "SHOW_INTERNAL_USERS_DETAILS",
       payload: response
     };
   
   }

   export function saveInternalUserDetailsResponse(response){
    if(!isEmpty(response)  ){
      
     showAlert(response.success,response.message);
        
        
        return {
          type : "SHOW_INTERNAL_USERS_DETAILS",
          payload: response
        };
      }
    }
  
