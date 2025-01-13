let defaultState = {
    ssnreportlist:[],
    serviceSheetStatusList:[],
    serviceEntrySheetStatusList:[],
    ssnLinereportlist:[]
  }
  
  const ssnreports = (state = defaultState, action) => {
  
  if (action.type === "SSN_REPORT_LIST") {
    return {
      ...state,
      //ssnreportlist: action.payload.objectMap.ssnreportList
      ssnLinereportlist:action.payload.objectMap.ssnLinereportlist
      
    };
  }else if(action.type==="SSN_STATUS_LIST"){
    return {
      ...state,
      serviceSheetStatusList:action.payload.objectMap.serviceSheetStatusList,
     // serviceEntrySheetStatusList:action.payload.objectMap.serviceEntrySheetStatusList
    };
  }
  else {
    return {
      ...state
    };
  }
};

export default ssnreports;