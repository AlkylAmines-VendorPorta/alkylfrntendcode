import { swalWithUrl } from "../../Util/ActionUtil";

export function getASNLineList(response){
    return {
      type: "POPULATE_ASN_LINE_LIST",
      payload:  response
    }
}

export function getASNList(response){
    return {
      type: "POPULATE_ASN_LIST",
      payload:  response
    }
}

export function miroResponse(response){
  swalWithUrl(response.successs,response.message,"miroScreen");
  return {
    type: "MIRO_RESPONSE",
    payload:  response
  }
}