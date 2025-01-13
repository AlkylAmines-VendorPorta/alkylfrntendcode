let defaultState={
}

const qcfSummary = (state= defaultState,action)=>{
    if(action.type==="TEST"){
        return{
            ...state,
        }
    }else{
        return{
            ...state
        }
    }
}
export default qcfSummary;
