let defaultState={
    prLineList:[],
    documents:[]
}

const prLineBuyerReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_PR_LINES_BUYER"){
        return{
            ...state,
            prLineList:action.payload.objectMap.prLine
        }
    }
    else if(action.type==="POPULATE_PR_LINES_INQUIRT"){
        return{
            ...state,
            prLineList:action.payload.objectMap.enqList,
            
        }
    }
    else if(action.type==="DISABLED_LOADING"){
        return{
            ...state,
            prLineList:[]
        }
    }else if(action.type==="GET_DOCUMENTS"){
        debugger
        return{
            ...state,
            documents:action.payload
        }
    }else{
        return{
            ...state
        }
    }
}
export default prLineBuyerReducer;