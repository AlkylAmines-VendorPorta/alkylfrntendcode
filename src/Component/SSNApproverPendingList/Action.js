import { isEmpty } from "../../Util/validationUtil";
export function getSSNApproverPendingList(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "SSN_APPROVER_PENDING_LIST",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}

    export function getASNLineList(response){
      return {
        type: "POPULATE_ASN_LINE_LIST",
        payload:  response
      }
    }

    export function getStatusDisplay(response){
      return {
        type: "POPULATE_ASN_STATUS_LIST",
        payload:  response
      }
    }