
import { isEmpty } from "../../Util/validationUtil";

export function getAdvancePaymentDetails(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "GET_ADVANCE_PAYMENT_DETAILS",
        payload: response
      };
    } else {
      return {
        type: ""
      };
    }}

    export function saveadvancePaymentResponse(response,c,e) {
      if (!isEmpty(response) && !isEmpty(response.objectMap)) {
        return {
          type: "SAVE_ADVANCE_PAYMENT",
          payload: response
        };
      } else {
        return {
          type: ""
        };
      }}

      export function getVendorPayList(response,c,e) {
        if (!isEmpty(response) && !isEmpty(response.objectMap)) {
          return {
            type: "GET_PAY_LIST",
            payload: response
          };
        } else {
          return {
            type: ""
          };
        }}