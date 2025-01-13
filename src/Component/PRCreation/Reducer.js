import { isEmptyDeep } from "./../../Util/validationUtil";
let defaultState = {
    prList:[],
    prStatusList:[],
    role:"",
    partner:[],
    buyerList:[],
    technicalList:[],
    priorityList:[],
    filterObject:{}
}

const createNewPR = (state = defaultState, action) => {
  if(action.type==="POPULATE_PR_LINES"){
    return{
        ...state,
        prLineList:action.payload.objectMap.prLine,
        emailList:action.payload.objectMap.emailList,
        attachmentList:action.payload.objectMap.attachmentList
    }
}
else if(action.type==="POPULATE_PR"){
  return{
      ...state,
      prList: action.payload.objectMap.prList,
      //prList: !isEmptyDeep(action.payload.objectMap.prList) ? action.payload.objectMap.prList:action.payload.objectMap.prLineList,
      prStatusList:action.payload.objectMap.prStatusList,
      role:action.payload.objectMap.role,
      partner:action.payload.objectMap.partner,
      buyerList:action.payload.objectMap.buyerList,
      technicalList:action.payload.objectMap.technicalList,
      priorityList:action.payload.objectMap.priorityList
  }
}
// if (action.type === "POPULATE_PR_LIST") {
  
//     return {
//       ...state,
//       prList: action.payload.objectMap.prList,
  
//     };
//   }
else{
    return{
        ...state
    }
}
}

  export default createNewPR;
