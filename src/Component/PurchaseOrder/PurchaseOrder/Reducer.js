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
    //ssnFundList:[]
}

const purchaseOrderLineInfo = (state = defaultState, action) => {
  
  if (action.type === "POPULATE_PO_LINE") {
    let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
    return {
      ...state,
      poLineList: action.payload.objectMap.poLineList,
      serviceList: action.payload.objectMap.serviceLineList,
      costCenterList: action.payload.objectMap.costCenter,
      //ssnFundList:action.payload.objectMap.ssnFundList || [],
      SSNVersion: SSNVersion
    };
  }else if (action.type === "POPULATE_DROP_DOWN") {
      return {
        ...state,
        documentTypeList: action.payload.objectMap.documentTypeList
      };
    }else if (action.type === "POPULATE_CONDITIONS") {
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
    }else {
      return {
        ...state
      };
    }
  };

export default purchaseOrderLineInfo;