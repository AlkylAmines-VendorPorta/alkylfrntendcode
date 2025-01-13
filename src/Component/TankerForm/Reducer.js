let defaultState = {
    asnDetails:"",
    purchaseOrderList:{},
    poLineList:[],
    asnLineList:[],
    asnList:[],
    gateENtry : "",
    saveAndSubmitedAsn:[],
    serviceLineList:[],
    role:"",
    asnStatusList:[],
    storageLocationList:[],
    serviceEntrySheetStatusList:[],
    serviceSheetStatusList:[],
    isSuccess:"",
    SSNVersion:1,
    poNum:"",
  }
  
  const tankerForm = (state = defaultState, action) => {
    
    
    if (action.type === "POPULATE_PO_FOR_ASN") {
      
      return {
        ...state,
        purchaseOrderList: action.payload.objectMap.asn,
        asnLineList: action.payload.objectMap.asnLineList,
        purchaseOrderNumber : action.payload.objectMap.asn.po.purchaseOrderNumber,
        //purchaseOrderNumber : action.payload.objectMap.asn.po.purchaseOrderNumber,
  
      };
      
    }else if (action.type === "SAVE_ASN") {
      let asnLines= action.payload.objectMap.asnDetails.asnLineList;
      return {
        ...state,
        asnDetails: action.payload.objectMap.asnDetails,
        asnLineList : asnLines
      };
    }else if (action.type === "SAVE_ASN_LINES") {
      return {
        ...state,
        asnLineList: action.payload.objectMap.asnLineList
      };
    }else if (action.type === "POPULATE_PO_LINE_FOR_ASN_LINE") {
      return {
        ...state,
        poLineList: action.payload.objectMap.poLineList
      };
    }else if (action.type === "POPULATE_ASN_LIST") {
      return {
        ...state,
        asnList: action.payload.objectMap.asnList,
        role:action.payload.objectMap.role
      };
    }else if (action.type === "POPULATE_ASN_LINE_LIST") {
      let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
      return {
        ...state,
        asnLineList: action.payload.objectMap.asnLineList,
        storageLocationList : action.payload.objectMap.storageLocation,
        serviceLineList : action.payload.objectMap.serviceLineList,
        costCenter: action.payload.objectMap.costCenter || [],
        SSNVersion:SSNVersion
      };
    }else if (action.type === "POPULATE_GATE_ENTRY") {
      return {
        ...state,
        gateENtry : action.payload.objectMap.asn
      };
    }else if (action.type === "UPDATE_ASN_STATUS") {
      
      return {
        ...state,
        asnStatus : action.payload.objectMap.status,
        isSuccess : action.payload.success
      };
    }else if (action.type === "POPULATE_SERVICE_LINE_LIST_FOR_ASN_LINE") {
      return {
        ...state,
        serviceLineList : action.payload.objectMap.serviceLineList
      };
    }
    else if (action.type === "SAVE_AND_SUBMIT_SERVICE_SHEET") {
    
      let asnLines= action.payload.objectMap.asn.asnLineList;
      return {
        ...state,
        asnDetails: action.payload.objectMap.asn,
        asnLineList : asnLines,
        asnStatus : action.payload.objectMap.status
    }
  }else if (action.type === "POPULATE_ASN_STATUS_LIST") {
    
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
    };
  
  export default tankerForm;