import { isEmpty } from "../../../../Util/validationUtil";
let defaultState={
    priceBidList:[],
    bidderList:[],
    prLineList:[],
    annexureDto:{
        annexureId:"",
        //status:""
    },
    winnerSelectionList:[],
    proposedReasonList:[],
    role:""
}

const qcfBodyReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_QCF_DETAILS"){
        return{
            ...state,
            priceBidList:action.payload.objectMap.priceBidList,
            bidderList:action.payload.objectMap.bidderList,
            prLineList:action.payload.objectMap.prLineList,
            annexureDto:isEmpty(action.payload.objectMap.annexureDto)?{annexureId:""}:action.payload.objectMap.annexureDto,
            winnerSelectionList:action.payload.objectMap.winnerSelectionList,
            proposedReasonList:action.payload.objectMap.praposedReasonList,
            role:action.payload.objectMap.role
        }
    }else if(action.type==="SAVE_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:isEmpty(action.payload.objectMap.annexureDto)?{annexureId:""}:action.payload.objectMap.annexureDto,
        }
    }else if(action.type==="SUBMIT_QCF_ANNEXURE"){
        return{
            ...state,
            annexureDto:isEmpty(action.payload.objectMap.annexureDto)?{annexureId:""}:action.payload.objectMap.annexureDto,
        }
    }else{
        return{
            ...state
        }
    }
}
export default qcfBodyReducer;
