import { isEmpty } from "../../../Util/validationUtil";
import { showAlert } from "../../../Util/ActionUtil";

export function getKYCInfo(response){
  return {
    type: "POPULATE_KYC_DETAILS",
    payload: response
  }
}
  
export function saveKYCResponse(response){
  if(!isEmpty(response) && !isEmpty(response.objectMap) 
  && !isEmpty(response.objectMap.kycDetails) && !isEmpty(response.objectMap.kycDetails.response)){
    showAlert(response.objectMap.kycDetails.response.hasError,response.objectMap.kycDetails.response.message);
    if(!response.objectMap.kycDetails.response.hasError){
      return {
        type: "SAVE_KYC_DETAILS",
        payload: response
      };
    }else{
      return {
        type:""
      };
    }
  }
}
