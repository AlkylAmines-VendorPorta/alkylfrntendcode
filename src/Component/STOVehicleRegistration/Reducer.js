let defaultState={
    vehicleRegDropDownList:[],
    saveRegResponse:[]
 } 
 
 const STOVehicleRegistration= (state= defaultState,action)=>{
    if(action.type==="POPULATE_VEHICLE_REG_DROPDOWN"){
        return{
            ...state,
            vehicleRegDropDownList : action.payload
        }
    } 
  else if(action.type==="SAVE_VEHICLE_REGISTRATION"){
             return{
                 ...state,
                 saveRegResponse : action.payload
             }
         }else{
             return{
                 ...state
             }
         }
    

 }

 export default STOVehicleRegistration;