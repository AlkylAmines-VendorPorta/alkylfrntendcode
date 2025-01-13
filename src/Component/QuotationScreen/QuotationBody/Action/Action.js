export function getVendorQuotationLine(response) {
    return {
        type: "POPULATE_VENDOR_QUOTATION_LINE",
        payload: response
    }
}

export function getBidderQuotByPrId(response) {
    return {
        type: "POPULATE_BIDDER_LIST_BY_PR",
        payload: response
    }
}