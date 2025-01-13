import { propTypes } from "pdf-viewer-reactjs";

let defaultState={
    prList:[],
    prStatusList:[],
    role:"",
    partner:[],
    buyerList:[],
    technicalList:[],
    priorityList:[],
    vendorList:[]
}

const vendorReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_PR_VENDOR"){
        return{
            ...state,
            prList:action.payload.objectMap.prList,
            prStatusList:action.payload.objectMap.prStatusList,
            role:action.payload.objectMap.role,
            partner:action.payload.objectMap.partner,
            buyerList:action.payload.objectMap.buyerList,
            technicalList:action.payload.objectMap.technicalList,
            priorityList:action.payload.objectMap.priorityList
        }
    }else{
        return{
            ...state
        }
    }
}
export default vendorReducer;