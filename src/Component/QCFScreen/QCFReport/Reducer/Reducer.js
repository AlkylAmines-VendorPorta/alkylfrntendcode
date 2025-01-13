import { isEmpty } from "../../../../Util/validationUtil";
let defaultState={
    priceBidList:[],
    bidderList:[],
    prLineList:[],
    annexureDto:{
        annexureId:""
    },
    winnerSelectionList:[],
    proposedReasonList:[],
    role:""
}
const qcfReportReducer = (state= defaultState,action)=>{
if(action.type==="POPULATE_QCF_DETAILS_R"){
    return{
        ...state,
        qcfLineList2:action.payload.objectMap
    }
}else{
    return{
        ...state
    }
}
}
export default qcfReportReducer;
