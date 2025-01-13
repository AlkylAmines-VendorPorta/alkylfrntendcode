import { propTypes } from "pdf-viewer-reactjs";
import { isEmptyDeep } from "../../../Util/validationUtil";

let defaultState={
    prList:[],
    prStatusList:[],
    role:"",
    partner:[],
    buyerList:[],
    technicalList:[],
    priorityList:[],
    filterObject:{}
} 

const prReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_PR"){
        return{
            ...state,
            prList: !isEmptyDeep(action.payload.objectMap.prList) ? action.payload.objectMap.prList:action.payload.objectMap.prLineList,
            prStatusList:action.payload.objectMap.prStatusList,
            role:action.payload.objectMap.role,
            partner:action.payload.objectMap.partner,
            buyerList:action.payload.objectMap.buyerList,
            technicalList:action.payload.objectMap.technicalList,
            priorityList:action.payload.objectMap.priorityList
        }
    }if(action.type==="DISABLE_MAIN_CONTAINER_READONLY"){
        return{
            ...state,
            readonly:false
        }
    }else if(action.type == 'POPULATE_PR_BUYER'){
        return{
            ...state,
        }
    }else if(action.type == 'GET_FILTER_DATA'){
        return {
            ...state,
            filterObject: action.payload.objectMap,
        }
    }else{
        return{
            ...state
        }
    }
}
export default prReducer;