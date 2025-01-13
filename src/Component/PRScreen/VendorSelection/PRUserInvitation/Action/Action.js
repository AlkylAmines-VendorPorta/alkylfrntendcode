
import { isEmpty } from "../../../../../Util/validationUtil";
import { showAlertAndReload } from "../../../../../Util/ActionUtil";

  export function viewCompanyListModal(response){
    return {
      type: "PR_VIEW_COMPANY_LIST",
      payload: response
    };
  }


  export function inviteResponse(response) {
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.user) && !isEmpty(response.objectMap.user.response)){
      showAlertAndReload(response.objectMap.user.response.hasError);
    if(!response.objectMap.user.response.hasError){
      return {
        type: "PR_INVITE_RESPONSE",
        payload: response
      };
    }else{
      return {
        type: "PR_INVITE_RESPONSE_FAILED"
      };
    }

  }
    
  }

  export function searchResponse(response,index){
    
    return {
      type : "PR_SEARCH_RESPONSE",
      payload: response
    }  
  }