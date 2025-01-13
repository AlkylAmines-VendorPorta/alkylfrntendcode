let defaultState = {
    ApprovalPendingServiceSheetLIst:[],
    asnLineList:[],
    serviceLineList:[],
    costCenterList:[],
    role:"",
    user:"",
    SSNVersion:"",
    serviceSheetStatusList:[]
  }
  
  const ssnapproverlist = (state = defaultState, action) => {
    if(action.type==="SSN_APPROVER_PENDING_LIST"){
        return{
            ...state,
            ApprovalPendingServiceSheetLIst:action.payload.objectMap.ApprovalPendingServiceSheetLIst,
            serviceSheetStatusList: action.payload.objectMap.serviceSheetStatusList,
            
        }
    }
    else if (action.type === "POPULATE_ASN_LINE_LIST") {
        let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
        return {
          ...state,
          asnLineList: action.payload.objectMap.asnLineList,
          storageLocationList : action.payload.objectMap.storageLocation,
          serviceLineList : action.payload.objectMap.serviceLineList,
          costCenterList: action.payload.objectMap.costCenter,         
          SSNVersion:SSNVersion,
          role: action.payload.objectMap.role,
          user: action.payload.objectMap.user,
          
        };
      }
      // else if (action.type === "POPULATE_ASN_STATUS_LIST") {
  
      //   return {
      //     ...state,
      //     asnStatusList: action.payload.objectMap.asnStatusList,
      //     serviceSheetStatusList: action.payload.objectMap.serviceSheetStatusList,
      //     serviceEntrySheetStatusList: action.payload.objectMap.serviceEntrySheetStatusList,
      //   }
      // }
    else{

        return{
            ...state
        }
    }
  
  }
  
  export default ssnapproverlist;
  