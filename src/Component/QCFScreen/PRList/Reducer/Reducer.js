let defaultState={
    isQcfGenerated:""
}

const qcfPRListReducer = (state= defaultState,action)=>{
    if(action.type==="GENERATE_QCF"){
        return{
            ...state,
        }
    }else{
        return{
            ...state
        }
    }
}
export default qcfPRListReducer;
