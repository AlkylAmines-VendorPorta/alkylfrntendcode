import { isEmpty } from "../../Util/validationUtil";

export function gateEntryResponse(response,c,e) {
  if (!isEmpty(response) && !isEmpty(response.objectMap)) {
    return {
      type: "GATE_ENTRY_LIST",
      payload: response
    };
  } else {
    return {
      type: ""
    };
  }}