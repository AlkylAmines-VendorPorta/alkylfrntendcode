let defaultState = {
    
  paymentreportlist:[],
  paymentStatusList:[]
  }
  
  const paymentreports = (state = defaultState, action) => {
  
    if (action.type === "GET_PAYMENT_REPORT") {
        return {
          ...state,
          paymentreportlist: action.payload.objectMap.paymentreportlist,
          
      
        };
      }
      else if(action.type === "GET_PAYMENT_STATUS_LIST"){

        return {
          ...state,
         
          paymentStatusList:action.payload.objectMap.paymentStatusList
      
        };
      }
      else {
          return {
            ...state
          };
        }


}


export default paymentreports;