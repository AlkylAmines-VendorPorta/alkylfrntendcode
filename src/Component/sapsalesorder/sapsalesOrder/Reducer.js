let defaultState = {
    message: "",
    success: true,
}

const SapSalesOrderLineInfo = (state = defaultState, action) => {
  // console.log("action",action)
  if (action.type === "POPULATE_SSP_LINE") {
  
    
    return {
      ...state,
      message: action.payload.message,
      success: action.payload.success,
     
    };
  }else {
      return {
        ...state
      };
    }
  };

export default SapSalesOrderLineInfo;