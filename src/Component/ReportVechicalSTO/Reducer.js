let defaultState={
    vehicleReg:[],
    saveRegResponse:[],
    poListforVendor:[],
    poLineList:[]
 } 
 
 const reportVehicleSTOReducer = (state= defaultState,action)=>{
     if(action.type==="POPULATE_VEHICLE_REG"){
         return{
             ...state,
             vehicleReg : action.payload?.objectMap?.vehicleDetails
         }
     }else if(action.type==="SAVE_REPORT_VEHICLE_REGISTRATION"){
        return{
            ...state,
            saveRegResponse : action.payload
        }
    } else if(action.type==="POPULATE_PURCHASE_ORDER_BY_PONO"){
        return {
          ...state,
          poListforVendor: action.payload.objectMap.poList,
          
        };
      }else if (action.type === "POPULATE_PO_LINE") {
        let SSNVersion = action.payload.objectMap.SSNVersion ? action.payload.objectMap.SSNVersion:1;
        return {
          ...state,
          poLineList: action.payload.objectMap.poLineList,
          serviceList: action.payload.objectMap.serviceLineList,
          costCenterList: action.payload.objectMap.costCenter  || [],
          SSNVersion: SSNVersion
        };
      }else if (action.type === "UPDATE_ASN_STATUS") {
    
        return {
          ...state,
          asnStatus : action.payload.objectMap.status,
          isSuccess : action.payload.success
        };
      }
      else{
         return{
             ...state
         }
     }
 }
 export default reportVehicleSTOReducer;