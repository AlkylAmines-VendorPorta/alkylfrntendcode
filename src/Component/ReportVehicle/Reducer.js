let defaultState={
    vehicleReg:[],
    saveRegResponse:[],
    vehicleRegSAPUpdate:[]
    
 } 
 
 const reportVehicleReducer = (state= defaultState,action)=>{
     if(action.type==="POPULATE_VEHICLE_REG"){
         return{
             ...state,
             vehicleReg : action.payload?.objectMap?.vehicleDetails,
             vehicleRegSAPUpdate : action.payload?.objectMap?.vehiclesapDetails
         }
     }else if(action.type==="SAVE_REPORT_VEHICLE_REGISTRATION"){
        return{
            ...state,
            saveRegResponse : action.payload
        }
    }else if (action.type === "CANCEL_ASN_BUTTON") {
  
        return {
          ...state,
          asnCancelButton: action.payload.message,
      
        };
    }else if (action.type === "REVOKE_CANCEL") {
  
        return {
          ...state,
          revokeCancel: action.payload.message,
      
        };
    }else{
         return{
             ...state
         }
     }
 }
 export default reportVehicleReducer;