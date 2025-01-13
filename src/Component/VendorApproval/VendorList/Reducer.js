let defaultState = {
    vendorList:[]
}

const vendorListInfo = (state = defaultState, action) => {
    
    if (action.type === "POPULATE_VENDOR_LIST") {
      return {
        ...state,
        vendorList: action.payload.objectMap.invitedVendorList
      };
    }if (action.type === "POPULATE_PARTNER") {
      return {
        ...state,
        partners: [action.payload]
      };
    }else {
        return {
          ...state
        };
      }
    };

export default vendorListInfo;