
export function getStatusDisplay(response){
    return {
      type: "POPULATE_ASN_STATUS_LIST",
      payload:  response
    }
}