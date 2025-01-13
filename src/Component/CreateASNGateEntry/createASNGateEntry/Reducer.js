let defaultState = {
  documentTypeList: [], 
  poLineList:[],
  poLine:"",
  poLineConditionList:[],
  purchaseOrder : "",
  asnStatusList:[],
  serviceList:[],
  costCenter:{},
  SSNVersion:1,
  userList : [],
  asnList:[],
  gateentryAsnList:[],
  purchaseOrderList:[],
  stoASNList:[],
// ssnFundList:[]
}

const createNewASNGateEntry = (state = defaultState, action) => {

if (action.type === "POPULATE_PO_LINE") {
  let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
  return {
    ...state,
    poLineList: action.payload.objectMap.poLineList,
    serviceList: action.payload.objectMap.serviceLineList,
    costCenterList: action.payload.objectMap.costCenter  || [],
   //ssnFundList:action.payload.objectMap.ssnFundList  || [],
    SSNVersion: SSNVersion
  };
}else

if (action.type === "POPULATE_DROP_DOWN") {
    return {
      ...state,
      documentTypeList: action.payload.objectMap.documentTypeList
    };
  }else if(action.type==="POPULATE_PURCHASE_FOR_GATE_ENTRY"){
    return {
      ...state,
     // poList: action.payload.objectMap.poList,
    // asnGateEntryList: action.payload.objectMap.asnGateEntryList
    gateentryAsnList: action.payload.objectMap.gateentryAsnList,
    purchaseOrderList:action.payload.objectMap.purchaseOrderList
    };}
  else if (action.type === "POPULATE_CONDITIONS") {
    return {
      ...state,
      poLineConditionList: action.payload.objectMap.poLineConditions
    };
  }else if (action.type === "PO_ACCEPTANCE") {
    return {
      ...state,
      purchaseOrder: action.payload.objectMap.purchaseOrder
    };
  }else if (action.type === "POPULATE_ASN_LIST_FOR_PO") {
    return {
      ...state,
      asnList: action.payload.objectMap.asnList,
      asnStatusList: action.payload.objectMap.asnStatusList,
  };
  }else if (action.type === "POPULATE_SERVICE_LIST_FOR_PO_LINE") {
    return {
      ...state,
      serviceList: action.payload.objectMap.serviceList
  };
}else if(action.type==="VIEW_COMPANY_LIST"){
    return {
      ...state,
      userList: action.payload.objectMap.userList
    };
  }
  else if(action.type==="STO_ASN_DETAILS"){
    return {
      ...state,
      stoASNList: action.payload.objectMap.stoASNList
    };
  }
  else if (action.type === "UPDATE_ASN_STATUS") {
  
    return {
      ...state,
      asnStatus : action.payload.objectMap.status,
      isSuccess : action.payload.success
    };
  }
else {
    return {
      ...state
    };
  }
};


export default createNewASNGateEntry;