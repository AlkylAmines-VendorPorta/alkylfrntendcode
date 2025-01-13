let defaultState = {
    storageLocationList:[],
    serviceEntrySheetStatusList:[],
    serviceSheetStatusList:[]
}

const invoiceReducer = (state = defaultState, action) => {
  
    if (action.type === "POPULATE_ASN_STATUS_LIST") {
        return {
          ...state,
          asnStatusList: action.payload.objectMap.asnStatusList,
          serviceSheetStatusList: action.payload.objectMap.serviceSheetStatusList,
          serviceEntrySheetStatusList: action.payload.objectMap.serviceEntrySheetStatusList,
        };
      } else {
        return {
          ...state
        };
      }
    };
  
  export default invoiceReducer;
