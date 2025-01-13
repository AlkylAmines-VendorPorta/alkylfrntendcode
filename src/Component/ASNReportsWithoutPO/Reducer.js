let defaultState = {
  getASNReportlist:[],
  asnStatusList:[],
  searchPOList:{},
  asnLineList:[],
  asnLinereportlistWithoutPO:[],
}

const asnReportsWithoutPO = (state = defaultState, action) => {

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
else if (action.type === "GET_ASN_LINE_REPORT_WITHOUT_PO") {
  return {
    ...state,
    asnLinereportlistWithoutPO: action.payload.objectMap.asnLinereportlistWithoutPO,
    



  };
}
else {
    return {
      ...state
    };
  }
};

export default asnReportsWithoutPO;
