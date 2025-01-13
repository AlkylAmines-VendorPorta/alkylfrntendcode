let defaultState = {
    serviceDataList:[]
  }
  
  const asnReducer = (state = defaultState, action) => {
    if (action.type === "FETCH_SERVICE_DATA") {
    
    return {
      ...state,
      serviceDataList: action.payload
    };
  }
    else {
        return {
          ...state
        };
      }
    };
  
  export default asnReducer;