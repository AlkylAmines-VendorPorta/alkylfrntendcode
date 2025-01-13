import { isEmpty } from "../../../Util/validationUtil";

let defaultState = {
      countryList:[],
      districtList:[],
      stateList:[],
      directorList:[],
      directorTypeList:[],
      associateCompanyDetails:"",
      associateCompanyDetailsList:[],
      directorDetails: "",
      directorDetailsId: "",
      otherDetails:"",
      partnerOrgId:"",
      financialAttachments : [],
      financialYears : [],
      currentAddress:"",
      currentDirector:""
}

const associateCompanyInfo = (state = defaultState, action) => {
  
  if (action.type === "SAVE_ASSOCIATE_COMPANY_DETAILS_RESP") {
    return {
      ...state,
      associateCompanyDetails: action.payload
    };
  }else if (action.type === "POPULATE_ASSOCIATE_COMP_DETAILS") {
    ;
      return {
        ...state,
        qualificationTypeList: action.payload.objectMap.qualificationTypeList,
        countryList: action.payload.objectMap.countries,
        associateCompanyDetailsList: action.payload.objectMap.associateCompanyDetailsList,
        stateList: action.payload.objectMap.regions
      };
    }else if(action.type==="SAVE_DIRECTOR_DETAILS"){
      // let directorDetailsId="";
      // if(!isEmpty(action.payload) && !isEmpty(action.payload.objectMap)
      //   && !isEmpty(action.payload.objectMap.directorDetails)){
      //     directorDetailsId= action.payload.objectMap.directorDetails.userDetailsId
      // }
      return {
        ...state,
        directorDetails:action.payload.objectMap.directorDetails
      };
    }else if(action.type==="POPULATE_DIRECTOR_DETAILS"){
      
        return {
          ...state,
          directorList:action.payload.objectMap.directorDetailsList,
          directorTypeList:action.payload.objectMap.directorTypeList,
        };
      }else if(action.type==="POPULATE_OTHER_DETAILS"){
      
        return {
          ...state,
          otherDetails:action.payload
        };
      }else if(action.type==="SAVE_OTHER_DETAILS"){
      
        return {
          ...state,
          otherDetails:action.payload
        };
      }else if(action.type==="POPULATE_FINANCIAL_DETAILS"){
      
        return {
          ...state,
          financialAttachments: action.payload.objectMap.financialAttachments,
          financialYears: action.payload.objectMap.years
        };
      }else if(action.type==="SAVE_FINANCIAL_DETAILS"){
      
        return {
          ...state,
          financialAttachments: action.payload.objectMap.financialDetails
        };
      }else if(action.type === "POPLUATE_STATES_FOR_ASSOCIATE"){
        return {
          ...state,
          stateList: action.payload.objectMap.regions
        }
      }else if(action.type === "POPLUATE_DISTRICTS_FOR_ASSOCIATE"){
        return {
          ...state,
          districtList: action.payload.objectMap.districts
        }
      }else if(action.type === "DELETE_ASSOCIATE_ADDRESS"){
        return {
          ...state,
          currentAddress: action.payload.objectMap.partnerCompanyAddr
        }
      }else if(action.type === "DELETE_DIRECTOR"){
        return {
          ...state,
          currentDirector: action.payload.objectMap.directorDetails
        }
      }else {
      return {
        ...state
      };
    }
};
export default associateCompanyInfo;
