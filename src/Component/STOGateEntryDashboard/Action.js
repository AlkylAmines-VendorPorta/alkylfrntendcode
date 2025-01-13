export function populateGateEntryDashboard(response) {
    return {
        type: "POPULATE_GATE_ENTRY_DASHBOARD",
        payload: response
    };
}

export function changeLoaderState(response){
    return {
      type: "CHANGE_LOADER_STATE",
      payload: response
    };
  }