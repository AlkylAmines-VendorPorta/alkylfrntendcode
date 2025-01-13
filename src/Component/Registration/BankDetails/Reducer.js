let defaultState = {
  partnerbankDetails:"",
  branchStateList:[],
  vendorName:"",
  ifscDetails : ""
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
      branchStateList: action.payload.objectMap.regions,
      vendorName:action.payload.objectMap.vendorName
    };
  }else if(action.type==="POPULATE_BANK_IFSC_DETAILS"){
    return {
      ...state,
      ifscDetails : action.payload
    };
  }else {
    return {
      ...state
    };
  }
}
export default bankDetails;
