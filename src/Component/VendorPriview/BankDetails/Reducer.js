let defaultState = {
  partnerbankDetails:"",
  branchStateList:[]
}

const bankDetails = (state = defaultState, action) => {
  
  if(action.type==="SAVE_BANK_DETAILS_RESP"){
      return {
        ...state,
        partnerBankDetails: action.payload
      };
  }else if(action.type==="GET_BANK_DETAILS_RESP"){
    return {
      ...state,
      partnerBankDetails: action.payload.objectMap.partnerBankDetails,
      branchStateList: action.payload.objectMap.regions
    };
  }else {
    return {
      ...state
    };
  }
}
export default bankDetails;
