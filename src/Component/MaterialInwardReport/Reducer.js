let defaultState = {
  materialgateEntryLineListDto:[]
  
}

const materialInwardReport = (state = defaultState, action) => {

if (action.type === "GATE_ENTRY_LIST") {
  return {
    ...state,
    materialgateEntryLineListDto: action.payload.objectMap.materialgateEntryLineListDto,
  };
}
else {
    return {
      ...state
    };
  }
};

export default materialInwardReport;
