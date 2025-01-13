let defaultState = {
  
  gateEntryListDto:[]
}

const rgpReport = (state = defaultState, action) => {

if (action.type === "GATE_ENTRY_LIST") {
  return {
    ...state,
    
    gateEntryListDto:action.payload.objectMap.gateEntryListDto
  };
}
else {
    return {
      ...state
    };
  }
};

export default rgpReport;
