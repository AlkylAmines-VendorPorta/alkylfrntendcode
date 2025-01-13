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
  
  const truckForm = (state = {defaultState}, action) => {
    
    if (action.type === "POPULATE_PO_FOR_ASN") {
      return {
        ...state,
        purchaseOrderList: action.payload.objectMap.asn,
        asnLineList: action.payload.objectMap.asnLineList,
        purchaseOrderNumber : action.payload.objectMap.asn.po.purchaseOrderNumber,
  
      };
    }

    else {
        return {
          ...state
        };
      }

    };
  
  export default truckForm;