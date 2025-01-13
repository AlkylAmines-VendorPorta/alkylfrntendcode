let defaultState={
    gateEntryList:[],
    // gateEntryLineDto:
}

const gateEntryRgpReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_GATE_ENTRY_RGP_MATERIAL"){
        return{
            ...state,
            gateEntryList:action.payload.objectMap.materialGateInLIst
        }
    }else if(action.type==="POPULATE_GATE_ENTRY_LINE_RGP_MATERIAL"){
        console.log("gateEnt REducer ",action.payload.objectMap);
        return{
            ...state,
            // gateEntryLineDto:action.payload.objectMap.gateEntryLineDto
            gateEntryLineDto:action.payload.objectMap.materialLine
        }
    }else{
        return{
            ...state
        }
    }
}
export default gateEntryRgpReducer;