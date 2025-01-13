let defaultState = {
   
    advancePaymentList:[],
    role:"",
    getVendorPayListforApproval:[],
    submittedpayList:[]
  }
  const advancePayment = (state = defaultState, action) => {

  if (action.type === "GET_ADVANCE_PAYMENT_DETAILS") {
    return {
      ...state,
      advancePaymentList: action.payload.objectMap.advancePaymentList,
      role:action.payload.objectMap.role,
      submittedpayList:action.payload.objectMap.submittedpayList
  
  
  
    };
  }
  else if(action.type==="SAVE_ADVANCE_PAYMENT"){
    return {
      ...state,
      asnStatusList:action.payload.objectMap.asnStatusList
    };
  }
  else if (action.type === "GET_PAY_LIST") {
    return {
      ...state,
      getVendorPayListforApproval: action.payload.objectMap.getVendorPayListforApproval,
      role:action.payload.objectMap.role

  
    };
  }
  else {
      return {
        ...state
      };
    }
  };
  
  export default advancePayment;