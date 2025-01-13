let defaultState={
    prList:[],
    prStatusList:[],
    QCFApproverList:[]
}

const qcfReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_QCF_PR"){
        return{
            ...state,
            prList:action.payload.objectMap.prList,
            enquiryList:action.payload.objectMap.enquiryList,
            prStatusList:action.payload.objectMap.prStatusList,
            optionProposedReasonList:action.payload.objectMap.proposedReasonList
        }
    }
    else if(action.type==="POPULATE_QCF_Approver_LIST_FROM_SAP"){
        return{
            ...state,
            QCFApproverList:action.payload.objectMap.QCFApproverList
        }
    }
    else{
        return{
            ...state
        }
    }
}
export default qcfReducer;