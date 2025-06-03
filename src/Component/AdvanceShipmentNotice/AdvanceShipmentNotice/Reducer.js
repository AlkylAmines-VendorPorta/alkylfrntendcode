import swal from 'sweetalert';
let defaultState = {
  asnDetails:"",
  purchaseOrderList:[],
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
  locationList:{},
  message:"",
  gateentryAsnList:[],
  costCenterList:[]
}

const asnReducer = (state = defaultState, action) => {
  
  if (action.type === "POPULATE_PO_FOR_ASN") {
    return {
      ...state,
      purchaseOrderList: action.payload.objectMap.purchaseOrderList
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
  }
  else if (action.type === "POPULATE_ASN_LINE_LIST") {
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
  }   else if (action.type === "POPULATE_STORAGE_LOC") {
    return {
       ...state,
       locationList: action.payload.objectMap.storageLocation
     };
   }
   else if (action.type === "POPULATE_COST_CENTER") {
    return {
       ...state,
       costCenterList: action.payload.objectMap.costCenterList
     };
   }
  else if (action.type === "POPULATE_SERVICE_LINE_LIST_FOR_ASN_LINE") {
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
}else if (action.type === "CANCEL_ASN_BUTTON") {
  
  return {
    ...state,
    asnCancelButton: action.payload.message,

  };
}else if (action.type === "CANCEL_SSN_BUTTON") {
  
  return {
    ...state,
    ssnCancelButton: action.payload.message,

  };} else if(action.type==="POPULATE_PURCHASE_FOR_GATE_ENTRY"){
    return {
      ...state,
     // poList: action.payload.objectMap.poList,
     asnGateEntryList: action.payload.objectMap.asnGateEntryList
    
    };}

    else if (action.type === 'SAVE_ASN_DETAILS') {
      return {
          ...state
      }
  } else if (action.type === 'ERROR_ASN_DETAILS') {
      console.log('e',action)
      swal({
          icon: "error",
          type: 'error',
          title: 'Something went wrong, try again',
          showConfirmButton: false});

      return {
          ...state,
          hasError: action.payload.hasError,
          error: action.payload.errors
      }
  }

  else {
      return {
        ...state
      };
    }
  };


export default asnReducer;