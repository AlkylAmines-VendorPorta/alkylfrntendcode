let defaultState={
    status:""
}

const qcfCompareReducer = (state= defaultState,action)=>{
    if(action.type==="ANNEXURE_APPROVAL"){
        return{
            ...state,
            status:action.payload.data
        }
    }else if(action.type==="ANNEXURE_REJECT"){
        return{
            ...state,
            status:action.payload.data
        }
    }else if(action.type==="GENERATE_QCF"){
        return{
            ...state,
        }
    }
    else if(action.type==="SAVE_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:action.payload.objectMap.annexureDto
        }
    }else if(action.type==="SUBMIT_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:action.payload.objectMap.annexureDto
        }
    }
    else{
        return{
            ...state
        }
    }
}
export default qcfCompareReducer;
