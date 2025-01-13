let defaultState={
    prLineList:[],
    documents:[]
}

const prLineBuyerReducer = (state= defaultState,action)=>{
    // console.log('prLineList',action.payload,action)
    if(action.type==="POPULATE_PR_LINES_BUYER"){
        console.log('action.payload.objectMap',action.payload.objectMap)
        return{
            ...state,
            prLineList:action.payload.objectMap.prLine
        }
    }else if(action.type==="DISABLED_LOADING"){
        console.log('action.payload.objectMap DISABLED LOADING',)
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