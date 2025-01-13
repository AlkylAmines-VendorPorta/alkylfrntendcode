let defaultState = {
    partners:[]
  }

  const registration = (state = defaultState, action) => {
    
    if(action.type==="POPULATE_PARTNER_INFO"){
        return {
          ...state,
          partners: action.payload.partners
        };
    }else {
      return {
        ...state
      };
    }
  }
  export default registration;