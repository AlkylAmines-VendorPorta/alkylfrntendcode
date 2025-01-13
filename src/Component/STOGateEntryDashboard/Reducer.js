let defaultState={
    gateEntryDashboard:[]
 } 
 
 const STOgateEntryDashboardReducer = (state= defaultState,action)=>{
     if(action.type==="POPULATE_GATE_ENTRY_DASHBOARD"){
         return{
             ...state,
             gateEntryDashboard : action.payload?.objectMap?.registrationList
         }
     }else{
         return{
             ...state
         }
     }
 }
 export default STOgateEntryDashboardReducer;