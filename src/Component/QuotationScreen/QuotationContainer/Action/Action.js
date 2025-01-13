export function getVendorQuotation(response) {
    return {
        type: "POPULATE_VENDOR_QUOTATION",
        payload: response
    }
}
export function getnegotiatorpaymenttermslist(response) {
  
    return {
      type: "POPULATE_VENDOR_QUOTATION_LINE",
      payload: response
    };
  }
