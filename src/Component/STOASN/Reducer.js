import swal from 'sweetalert';
let defaultState = {
  stoASNList:[],
  stoASNlineList:[],
  asnList:[],
  asnStatusList: []
}

const STOASN = (state = defaultState, action) => {
    if(action.type==="STO_ASN_DETAILS"){
    return {
      ...state,
      stoASNList: action.payload.objectMap.stoASNList,
      stoASNlineList:action.payload.objectMap.stoASNlineList
    };
  }
  else if (action.type === "UPDATE_ASN_STATUS") {
  
    return {
      ...state,
      asnStatus : action.payload.objectMap.status,
      isSuccess : action.payload.success
    };
  }
  else if (action.type === "POPULATE_ASN_LIST") {
    return {
      ...state,
      asnList: action.payload.objectMap.asnList,
      role:action.payload.objectMap.role
    };
  }
  else if (action.type === "POPULATE_ASN_STATUS_LIST") {

    return {
      ...state,
      asnStatusList: action.payload.objectMap.asnStatusList,
      serviceSheetStatusList: action.payload.objectMap.serviceSheetStatusList,
      serviceEntrySheetStatusList: action.payload.objectMap.serviceEntrySheetStatusList,
    };
    }

  else {
      return {
        ...state
      };
    }
 
}
  export default STOASN;