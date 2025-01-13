import { isEmpty } from "../../Util/validationUtil";
import { showAlert,showAlertAndReload } from "../../Util/ActionUtil";



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
      
      showAlertAndReload(response.success,response.message,'internalUser'); 
        return {
          type : "SHOW_INTERNAL_USERS_DETAILS",
          payload: response
        };
      }
    }
  
    
    export function getUserRoles(response){    
      return {
        type : "GET_USER_ROLES",
        payload: response
      };
    }

    
    export function updateUserRoles(response){
      if(!isEmpty(response)  ){
       showAlert(!response.success,response.message);
          return {
            type : "UPDATE_INTERNAL_USERS",
            payload: response
          };
        }else{
          return {
            type : "UPDATE_INTERNAL_USERS_FAILED",
            payload: response
          };
        }
      }

      
      export function deleteUserRoles(response){
        if(!isEmpty(response)){
         showAlert(!response.success,response.message);
            return {
              type : "DELETE_ROLE",
              payload: response
            };
          }else{
            return {
              type : "DELETE_ROLE_FAILED",
              payload: response
            };
          }
        }

        export function changeLoaderState(response){
          return {
            type: "CHANGE_LOADER_STATE_INTERNAL_USER",
            payload: response
          };
        }

        export function populateCostCentreList(response){
          return {
            type: "POPULATE_COST_CENTRE_DROP_DOWN",
            payload: response
          };
        }
        