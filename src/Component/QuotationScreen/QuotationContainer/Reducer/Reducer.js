let defaultState = {
    bidderList: [],
    paymentTermsList:[]
    // prStatusList: [],
    // role: "",
    // partner: [],
    // buyerList: [],
    // technicalList: [],
    // priorityList: []
}

const qbvReducer = (state = defaultState, action) => {
    // console.log(action)
    if (action.type === "POPULATE_VENDOR_QUOTATION") {
        return {
            ...state,
            bidderList: action.payload.objectMap.bidderList,
            prStatusList: action.payload.objectMap.prStatusList,
            role: action.payload.objectMap.role,
            partner: action.payload.objectMap.partner,
            enqList: action.payload.objectMap.enqList,
            negoPrList:action.payload.objectMap.prList,                  //Only For The Case of Negotiator Login
            // buyerList: action.payload.objectMap.buyerList,
            // technicalList: action.payload.objectMap.technicalList,
            // priorityList: action.payload.objectMap.priorityList
        }
    }else if(action.type==="POPULATE_VENDOR_QUOTATION_LINE"){
        return{
            ...state,
            paymentTermsList:action.payload.objectMap.paymentTermsList,
            
        }} else {
        return {
            ...state
        }
    }
}
export default qbvReducer;
