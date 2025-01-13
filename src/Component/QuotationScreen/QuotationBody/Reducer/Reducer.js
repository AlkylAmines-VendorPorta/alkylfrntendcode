let defaultState={
    priceBidList:[],
    paymentTermsList:[],
    incoTermsList:[],
    prAttachList:[]
}

const qbvBodyReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_VENDOR_QUOTATION_LINE"){
        
        return{
            ...state,
            attachmentList:action.payload.objectMap.bidAttchList,
            priceBidList:action.payload.objectMap.priceBid,
            paymentTermsList:action.payload.objectMap.paymentTermsList,
            incoTermsList:action.payload.objectMap.incoTermsList,
            prAttachList:action.payload.objectMap.prAttchList
        }
    }else if(action.type=="POPULATE_BIDDER_LIST_BY_PR"){
        
        return{
            ...state,
            bidderList:action.payload.objectMap.bidderList
        }
    }else{
        return{
            ...state
        }
    }
}
export default qbvBodyReducer;