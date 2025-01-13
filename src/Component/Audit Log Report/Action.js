
import { isEmpty } from "../../Util/validationUtil";
export function auditResponse(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "GET_AUDIT_REPORT",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}