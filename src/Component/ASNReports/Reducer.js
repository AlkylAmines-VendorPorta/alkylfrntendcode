let defaultState = {
  getASNReportlist:[],
  asnStatusList:[],
  searchPOList:{},
  asnLineList:[],
  asnLinereportlist:[],
}

const asnReports = (state = defaultState, action) => {

if (action.type === "USER_BY_USERNAME_OR_EMAIL") {
  return {
    ...state,
    getASNReportlist: action.payload.objectMap.AsnReportList,
    



  };
}
else if(action.type==="ASN_STATUS_LIST"){
  return {
    ...state,
    asnStatusList:action.payload.objectMap.asnStatusList
  };
}
else if(action.type==="PO_SEARCH"){
  return {
    ...state,
    searchPOList:action.payload.objectMap.searchPOList
  };
}
else if(action.type==="PO_SEARCH"){
  return {
    ...state,
    searchPOList:action.payload.objectMap.searchPOList
  };
}
else if (action.type === "POPULATE_ASN_LINE_LIST") {
  let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
  return {
    ...state,
    asnLineList: action.payload.objectMap.asnLineList,
    // storageLocationList : action.payload.objectMap.storageLocation,
    // serviceLineList : action.payload.objectMap.serviceLineList,
    // costCenter: action.payload.objectMap.costCenter || [],
    // SSNVersion:SSNVersion
  };
}
if (action.type === "GET_ASN_LINE_REPORT") {
  return {
    ...state,
    asnLinereportlist: action.payload.objectMap.asnLinereportlist,
    



  };
}
else {
    return {
      ...state
    };
  }
};

export default asnReports;
