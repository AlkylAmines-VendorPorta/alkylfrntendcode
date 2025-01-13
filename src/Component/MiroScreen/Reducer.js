let defaultState = {
    asnLineList:[],
    asnList:[],
    serviceLineList:[],
    role:"",
    asnStatusList:[],
    storageLocationList:[],
    serviceEntrySheetStatusList:[],
    serviceSheetStatusList:[],
    invoice:"",
    glMasterList:[],
    withHoldingTaxList:[],
    invoiceFlag:"",
    miroResponse:false
}

const miroReducer = (state = defaultState, action) => {
  
    if (action.type === "POPULATE_ASN_LINE_LIST") {
        return {
          ...state,
          asnLineList: action.payload.objectMap.asnLineList,
          storageLocationList : action.payload.objectMap.storageLocation,
          serviceLineList : action.payload.objectMap.serviceLineList,
          invoice:action.payload.objectMap.invoice,
          costCenter: action.payload.objectMap.costCenter || []
        };
    }else if (action.type === "POPULATE_ASN_LIST") {
        return {
          ...state,
          asnList: action.payload.objectMap.asnList,
          role:action.payload.objectMap.role,
          withHoldingTaxList:action.payload.objectMap.withHoldingTax,
          glMasterList:action.payload.objectMap.glMaster,
        };
     } else if (action.type === "MIRO_RESPONSE") {
      return {
        ...state,
        miroResponseStatus: action.payload.success
      };
   }else {
        return {
          ...state
        };
      }
    };
  
  export default miroReducer;
