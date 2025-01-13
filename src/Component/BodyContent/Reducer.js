let defaultState = {
    totalPoCount:"",
    acceptedPoCount:"",
    rejectedPoCount:"",
    releasedPoCount:"",
    VendorPoList:[],
    poListforVendor:[],
    poLineList:[],
    serviceList:[],
    purchaseOrder : "",
    documentTypeList: [], 
    poLineList:[],
    poLine:"",
    poLineConditionList:[],
    asnStatusList:[],
    serviceList:[],
    costCenter:{},
    SSNVersion:1,
    userList : [],
    asnList:[],
    gateentryAsnList:[],
    role:"",
    totalOpenPoCount:"",
    purchaseOrderStatusList:[]
}


const userDashBoardMainReducer = (state = defaultState, action) => {
  
    if (action.type === "POPULATE_USER_DASHBOARD_DETAILS") {
      return {
        ...state,
        totalPoCount: action.payload.objectMap.totalPoCount,
        acceptedPoCount: action.payload.objectMap.acceptedPoCount,
        rejectedPoCount: action.payload.objectMap.rejectedPoCount,
        releasedPoCount: action.payload.objectMap.releasedPoCount,

        openPoCount: action.payload.objectMap.openPoCount,
        openPoAsnCount: action.payload.objectMap.openPoAsnCount,
        pendingPoBillBookingCount: action.payload.objectMap.pendingPoBillBookingCount
      };
    }

    else if(action.type === "GET_PO_LIST"){
      return {
        ...state,
        VendorPoList: action.payload.objectMap.VendorPoList,
        role: action.payload.objectMap.role,
        totalOpenPoCount: action.payload.objectMap.totalOpenPoCount,
        purchaseOrderStatusList:action.payload.objectMap.purchaseOrderStatusList
    }
  }
  else if(action.type==="POPULATE_PURCHASE_ORDER_AND_PARTNER"){
    return {
      ...state,
      purchaseOrderList: action.payload.objectMap.poList,
      partner: action.payload.objectMap.partner,
      user: action.payload.objectMap.user,
      role: action.payload.objectMap.role,
     // purchaseOrderStatusList:action.payload.objectMap.purchaseOrderStatusList
    };
  }
  else if(action.type==="POPULATE_PURCHASE_ORDER_BY_PONO"){
    return {
      ...state,
      poListforVendor: action.payload.objectMap.poList,
      
    };
  }
  
else if (action.type === "POPULATE_PO_LINE") {
  let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
  return {
    ...state,
    poLineList: action.payload.objectMap.poLineList,
    serviceList: action.payload.objectMap.serviceLineList,
    costCenterList: action.payload.objectMap.costCenter  || [],
    SSNVersion: SSNVersion
  };
}
else if (action.type === "POPULATE_SERVICE_LIST_FOR_PO_LINE") {
  return {
    ...state,
    serviceList: action.payload.objectMap.serviceList
};}
else if (action.type === "PO_ACCEPTANCE") {
  return {
    ...state,
    purchaseOrder: action.payload.objectMap.purchaseOrder
  };}
  else if (action.type === "POPULATE_ASN_LIST_FOR_PO") {
    return {
      ...state,
      asnList: action.payload.objectMap.asnList,
      asnStatusList: action.payload.objectMap.asnStatusList,
    };
  }
    else {
        return {
          ...state
        };
      }
    };
  
  export default userDashBoardMainReducer;