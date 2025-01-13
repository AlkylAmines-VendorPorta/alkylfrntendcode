let defaultState={
   gateEntryDashboard:[]
} 

const gateEntryDashboardReducer = (state= defaultState,action)=>{
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
export default gateEntryDashboardReducer;