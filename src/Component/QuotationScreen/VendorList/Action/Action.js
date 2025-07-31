import { isEmpty } from "../../../../Util/validationUtil";
import { showAlert, showAlertAndReload } from "../../../../Util/ActionUtil";


export function getNegotiatorFilterDropDown(response) {
    return {
        type: "GET_NEGOTIATOR_FILTER_DROPDOWN",
        payload: response
    };
}

export function deleteEnquiryforBidder(response){
    if(!isEmpty(response)){
     showAlertAndReload(!response.success,response.message);
        return {
          type : "DELETE_BIDDER_ENQ",
          payload: response
        };
      }else{
        return {
          type : "DELETE_BIDDER_ENQ_FAILED",
          payload: response
        };
      }
    }

