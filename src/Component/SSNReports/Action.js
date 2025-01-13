import { isEmpty } from "../../Util/validationUtil";

export function ssnResponse(response) {
  if (!isEmpty(response) && !isEmpty(response.objectMap)) {
    return {
      type: "SSN_REPORT_LIST",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }}

  export function ssnStatusResponse(response){
    return {
      type: "SSN_STATUS_LIST",
      payload: response
    };
  }