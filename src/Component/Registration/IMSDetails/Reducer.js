import { isEmpty } from "../../../Util/validationUtil";

let defaultState = {
  imsDetails: "",
  imsId: "",
  inspectionStandardList:[],
  isRegistationSubmitted:"",
  registrationMessage:""
}

const imsInfo = (state = defaultState, action) => {
    
    if(action.type==="SAVE_IMS_DETAILS_RESPONSE"){
      let imsDetId = "";
      let imsDet=action.payload.objectMap.imsDetails;
      if(!isEmpty(imsDet)){
        imsDetId=imsDet.imsId;
      }
      return {
        ...state,
        imsId: imsDetId
      }  
    }else if(action.type==="POPULATE_IMS_DETAILS"){
      return {
        ...state,
        imsDetails: action.payload.objectMap.imsDetails,
        inspectionStandardList: action.payload.objectMap.inspectionStandardList
      }  
    }else if(action.type==="REGISTRATION_RESPONSE"){
      return {
        ...state,
        isRegistationSubmitted: action.payload.success,
        registrationMessage: action.payload.message,
      }
    }return {
      ...state
    }
};

export default imsInfo;