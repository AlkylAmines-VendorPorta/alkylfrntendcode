let defaultState = {
      currentContact:"",
      currentAddress:"",
      companyTypeList: [],
      vendorTypeList: [],
      countryList:[],
      districtList:[],
      stateList:[],
      titleList:[],
      companyDetails:"",
      addressList: [],
      addressDetails:"",
      contactDetailsList: []
  }

const generalInfo = (state = defaultState, action) => {
    
    if (action.type === "SAVE_GENERAL_INFO") {
      return {
        ...state,
        generalInfo: action.payload.objectMap.generalInfos
      };
    }else if (action.type === "POPULATE_DROP_DOWN") {
        return {
          ...state,
          companyTypeList: action.payload.objectMap.companyTypeList,
          vendorTypeList: action.payload.objectMap.vendorTypeList
        };
      }else if (action.type === "SAVE_COMPANY_DETAILS") {
        return {
          ...state,
          companyDetails: action.payload.objectMap.companyDetails
        };
      }else if (action.type === "POPULATE_COMPANY_DETAILS") {
        return {
          ...state,
          companyDetails: action.payload.objectMap.companyDetails
        }
      }else if (action.type === "POPULATE_COMP_ADDRESS_INFO") {
        return {
          ...state,
          addressList: action.payload.objectMap.companyAddressList,
          countryList: action.payload.objectMap.countries,
          stateList: action.payload.objectMap.regions
        }
      }else if (action.type === "POPULATE_COMPANY_CONTACT_INFO") {
        return {
          ...state,
          contactDetailsList: action.payload.objectMap.contactDetailsList,
          titleList : action.payload.objectMap.salutationList
        }
      }else if (action.type === "SAVE_ADDRESS_DETAILS") {
        return {
          ...state,
          addressDetails : action.payload
        }
      }else if (action.type === "SAVE_CONTACT_DETAILS") {
        return {
          ...state,
          contactDetails: action.payload.objectMap.contactDetails
        }
      }else if(action.type === "POPLUATE_STATES"){
        return {
          ...state,
          stateList: action.payload.objectMap.regions
        }
      }else if(action.type === "POPLUATE_DISTRICTS"){
        return {
          ...state,
          districtList: action.payload.objectMap.districts
        }
      }else if(action.type === "DELETE_ADDRESS"){
        return {
          ...state,
          currentAddress: action.payload.objectMap.partnerCompanyAddr
        }
      }else if(action.type === "DELETE_CONTACT"){
        return {
          ...state,
          currentContact: action.payload.objectMap.userDetail
        }
      } else {
        return {
          ...state
        };
      }
    };

export default generalInfo;