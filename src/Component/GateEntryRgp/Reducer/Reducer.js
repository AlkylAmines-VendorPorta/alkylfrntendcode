let defaultState={
    gateEntryList:[],
    gateEntryLineDto:[],
    gateEntryLineDtoTest:[],
    formno:"",
    VendorData:{}
}

const gateEntryRgpReducer = (state= defaultState,action)=>{
    if(action.type==="POPULATE_GATE_ENTRY_RGP"){
        return{
            ...state,
            gateEntryList:action.payload.objectMap.gateEntryList
        }
    }else if(action.type==="POPULATE_GATE_ENTRY_LINE_RGP"){
        return{
            ...state,
            gateEntryLineDto:action.payload.objectMap.gateEntryLineDto
        }
    }else if(action.type==="POPULATE_GATE_ENTRY_LINE_RGP_TEST"){
        return{
            ...state,
            gateEntryLineDtoTest:action.payload.objectMap.gateEntryLineDtoTest
        }
    }else if(action.type==="POPULATE_FORM_NO"){
        return{
            ...state,
            formno:action.payload.objectMap.formno
        }}
        else if(action.type==="POPULATE_GATE_ENTRY_SAP_VENDOR_DATA"){
            return{
                ...state,
                VendorData:action.payload.objectMap.VendorData
            }}
            else if (action.type === "CANCEL_GATE_ENTRY_BUTTON") {
  
                return {
                  ...state,
                  gateenrtyCancelButton: action.payload.message,
              
                };
            }

    else{
        return{
            ...state
        }
    }
}
export default gateEntryRgpReducer;