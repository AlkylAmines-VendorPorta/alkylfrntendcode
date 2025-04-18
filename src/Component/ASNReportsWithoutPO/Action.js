import { isEmpty } from "../../Util/validationUtil";

export function asnResponse(response,c,e) {
  if (!isEmpty(response) && !isEmpty(response.objectMap)) {
    return {
      type: "USER_BY_USERNAME_OR_EMAIL",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }}

  export function asnStatusResponse(response){
    return {
      type: "ASN_STATUS_LIST",
      payload: response
    };
  }
  export function poResponse(response,c,e) {
    if (!isEmpty(response) && !isEmpty(response.objectMap)) {
      return {
        type: "PO_SEARCH",
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


    export function asnLineResponseWithoupo(response,c,e) {
      if (!isEmpty(response) && !isEmpty(response.objectMap)) {
        return {
          type: "GET_ASN_LINE_REPORT_WITHOUT_PO",
          payload: response
        };
      } else {
        return {
          type: ""
        };
      }}