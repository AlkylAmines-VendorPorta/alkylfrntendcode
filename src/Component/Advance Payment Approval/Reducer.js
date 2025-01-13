let defaultState = {
   
    getVendorPayListforApproval:[],
    role:""
  }
  const advancePayApproval = (state = defaultState, action) => {
    if (action.type === "GET_PAY_LIST_FOR_APPROVAL") {
        return {
          ...state,
          getVendorPayListforApproval: action.payload.objectMap.getVendorPayListforApproval,
          role:action.payload.objectMap.role
    
      
        };
      }else if(action.type==="APPROVE_PAYMENT"){
        return{
            ...state,
            paymentApproveStatus:action.payload.success

        };
    }
    else if (action.type === "UPDATE_PAYMENT_STATUS") {
    
      return {
        ...state,
        paymentStatus : action.payload.objectMap.status,
        isSuccess : action.payload.success
      };
    }else if(action.type==="REJECT_PAYMENT"){
        return{
            ...state,
            paymentRejectStatus:action.payload.success
        };
      }
      else {
          return {
            ...state
          };
        }
      };
      
      export default advancePayApproval;