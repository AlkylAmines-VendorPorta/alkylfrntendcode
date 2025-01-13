import { isEmpty } from "lodash-es";

let defaultState = {
  kycDetails: "",
  kycDetailsId: "",
  role:"",
  companyAddressRegionList:""
}

const kycInfo = (state = defaultState, action) => {
    
    if (action.type === "POPULATE_KYC_DETAILS") {
      return {
        ...state,
        kycDetails: action.payload.objectMap.kycDetails,
        role:action.payload.objectMap.role,
        companyAddressRegionList: action.payload.objectMap.companyAddressRegionList
      }
    }else if (action.type === "SAVE_KYC_DETAILS") {
      let kycDetId = "";
      let kycDet=action.payload.objectMap.kycDetails;
      if(!isEmpty(kycDet)){
        kycDetId=kycDet.kycId;
      }
      return {
        ...state,
        kycDetailsId: kycDetId
      }
    }else {
        return {
          ...state
        };
      }
    };

export default kycInfo;