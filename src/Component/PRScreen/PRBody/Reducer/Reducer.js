let defaultState={
    prLineList:[],
    emailList:[],
    attachmentList:[],
    removeAttachmentRes:{},
    attrespData:[]
}

const prBodyReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_PR_LINES"){
        return{
            ...state,
            prLineList:action.payload.objectMap.prLine,
            emailList:action.payload.objectMap.emailList,
            attachmentList:action.payload.objectMap.attachmentList
        }
    }else if(action.type==="PR_SUBMIT_RES"){
        return{
            ...state,
            prDto:action.payload.objectMap.prDto
        }
    }else if(action.type==="PR_APPROVE_RES"){
        return{
            ...state,
            prDto:action.payload.objectMap.prDto
        }
    }else if(action.type==="PR_REJECT_RES"){
        return{
            ...state,
            prDto:{
                status:action.payload.data
            }
        }
    }else if(action.type==="PR_BUYER_ASSIGN_RES"){
        return{
            ...state,
            prDto:action.payload.objectMap.prDto
        }
    }else if(action.type==="REMOVE_ATTACHMENT_RES"){
        debugger
        return{
            ...state,
            removeAttachmentRes:action.payload
        }
    }else if(action.type==="PR_Att_RES"){
        return{
            ...state,
            attrespData:action.payload.objectMap.resDto
        }
    }else{
        return{
            ...state
        }
    }
}
export default prBodyReducer;