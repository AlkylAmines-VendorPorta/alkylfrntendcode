let defaultState = {
    partners:[]
  }

  const registration = (state = defaultState, action) => {
    if(action.type==="POPULATE_USER_DETAILS"){
      return {
        ...state,
        user : action.payload
      };
    }
    else if(action.type==="POPULATE_PARTNER_INFO"){
        return {
          ...state,
          partners: action.payload.partners
        };
    }else if(action.type==="UPDATE_VENDOR_PARTNER_STATUS"){
      return {
        ...state
      };
  }else {
      return {
        ...state
      };
    }
  }
  export default registration;