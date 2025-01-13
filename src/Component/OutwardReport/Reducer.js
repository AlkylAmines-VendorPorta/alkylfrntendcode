let defaultState = {
outwardReportlist:[],
  asnStatusList:[],
  searchPOList:{}
}

const OutwardReportReducer = (state = defaultState, action) => {
  
  if (action.type === "USER_BY_USERNAME_OR_EMAIL") {
    return {
      ...state,
      outwardReportlist: action.payload.objectMap.outwardReportList,
      
  
  
  
    };
  }
  else if(action.type==="ASN_STATUS_LIST"){
    return {
      ...state,
      asnStatusList:action.payload.objectMap.vehicleRegistrationStatusList
    };
  }
  else if(action.type==="PO_SEARCH"){
    return {
      ...state,
      searchPOList:action.payload.objectMap.searchPOList
    };
  }
  else {
      return {
        ...state
      };
    }
  };

export default OutwardReportReducer;
