let defaultState = {
    vendorDropDownList: [],
    bidEnqDeleteButton:""
}

const vendorListForQuotationReducer = (state = defaultState, action) => {
    
    if (action.type === "GET_NEGOTIATOR_FILTER_DROPDOWN") {
        return {
            ...state,
            vendorDropDownList: action.payload
        };
    } else if(action.type==="DELETE_BIDDER_ENQ"){
        return {
            ...state,
            bidEnqDeleteButton: action.payload.message,
        
          }
    }else {
        return {
            ...state
        };
    }
}
export default vendorListForQuotationReducer;