let defaultState={
    annexureDto:[],
    mailDto:[]
}

const qcfAnnexure = (state= defaultState,action)=>{
    if(action.type==="SAVE_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:action.payload.objectMap.annexureDto
        }
    }else if(action.type==="SUBMIT_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:action.payload.objectMap.annexureDto
        }
    }else if(action.type==="ANNEXURE_APPROVAL"){
        return{
            ...state,
            status:action.payload.data
        }
    }else if(action.type==="ANNEXURE_REJECT"){
        return{
            ...state,
            status:action.payload.data
        }
    }
    else if(action.type==="QCF_APPROVAL"){
        return{
            ...state,
            mailDto:action.payload.objectMap.mailDto
        }
    }
    else{
        return{
            ...state
        }
    }
}
export default qcfAnnexure;