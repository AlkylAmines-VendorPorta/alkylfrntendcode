export function getPurchaseOrder(response) {
    
  return {
      type: "POPULATE_PURCHASE_ORDER_AND_PARTNER",
      payload: response
  }

}
export function getASNListForPO(response){
  return {
    type: "POPULATE_ASN_LIST_FOR_PO",
    payload:  response
  }
}

export function viewCompanyListModal(response){
  return {
    type: "VIEW_COMPANY_LIST",
    payload: response
  };
}
