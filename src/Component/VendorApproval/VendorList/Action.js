export function populateVendorList(response){
  
  return {
    type: "POPULATE_VENDOR_LIST",
    payload: response
  };
}

export function populatePartner(response){
  
  return {
    type: "POPULATE_PARTNER",
    payload: response
  };
}