let defaultState={
    vendorList:[],
    itemBidList:[],
    prLineArray:[]
}

const vendorBodyReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_VENDOR_LIST"){
        return{
            ...state,
            vendorList:action.payload.objectMap.bidderList
        }
    }else if(action.type==="POPULATE_VENDOR_ITEM_BID_LIST"){
        return{
            ...state,
            itemBidList:action.payload.objectMap.itemBidList
        }
    }else if(action.type==="POPULATE_UNSIGNED_PR_LINE_LIST"){
        return{
            ...state,
            prLineArray:action.payload.objectMap.prLineList
        }
    }else if(action.type==="CREATE_UNASSIGNED_PR_LINE"){
        return{
            ...state,
            saveStatus:action.payload.success
        }
    }else{
        return{
            ...state
        }
    }
}
export default vendorBodyReducer;