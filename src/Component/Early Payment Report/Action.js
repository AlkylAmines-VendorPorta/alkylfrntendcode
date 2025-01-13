
import { isEmpty } from "../../Util/validationUtil";
export function paymentResponse(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "GET_PAYMENT_REPORT",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}


    export function paymentstatusList(response,c,e) {
      if (!isEmpty(response) && !isEmpty(response.objectMap)) {
        return {
          type: "GET_PAYMENT_STATUS_LIST",
          payload: response
        };
      } else {
        return {
          type: ""
        };
      }}