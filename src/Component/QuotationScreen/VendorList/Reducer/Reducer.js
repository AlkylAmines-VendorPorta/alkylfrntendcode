let defaultState = {
    vendorDropDownList: []
}

const vendorListForQuotationReducer = (state = defaultState, action) => {
    
    if (action.type === "GET_NEGOTIATOR_FILTER_DROPDOWN") {
        return {
            ...state,
            vendorDropDownList: action.payload
        };
    } else {
        return {
            ...state
        };
    }
}
export default vendorListForQuotationReducer;