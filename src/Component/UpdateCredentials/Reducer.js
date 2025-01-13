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
      contactDetailsList: [],
      userList:[],
      passwordGenerated:'',
      updateUsernameAndEmail:'',
      updateUsernameAndEmailIsSuccess:'',
      logInGenereated: '',
      logInGenereatedSuccess:'',
      counter:0

  }
  
const updateCredentials = (state = defaultState, action) => {
   
    if (action.type === "USER_BY_USERNAME_OR_EMAIL") {
      return {
        ...state,
        userList: action.payload.objectMap.userList
      };
    }
    else if (action.type === "UPDATE_USERNAME_AND_EMAIL") {
      return {
        ...state,
        counter:state.counter+Math.random(), counter:state.counter+Math.random(),
        updateUsernameAndEmail: action.payload.message,
        updateUsernameAndEmailIsSuccess:action.payload.success
      };
    }
    else if (action.type === "GENERATE_PASSWORD") {
      return {
        ...state,
        updateUsernameAndEmail: action.payload.message,
        updateUsernameAndEmailIsSuccess:action.payload.success
      };
    }
    else if (action.type === "LOG_IN_GENERATED") {
      return {
        ...state,
        counter:state.counter+Math.random(), counter:state.counter+Math.random(),
        logInGenereated: action.payload.message,
        logInGenereatedSuccess:action.payload.success
      };
    }else if(action.type==="CHANGE_LOADER_STATE_UPDATE_CREDENTIALS"){
      return {
        ...state,
        loaderState: action.payload
      };
    }else if(action.type==="CHANGE_USER_LIST"){
      return {
        ...state,
        userList: []
      };
    }
    else {
        return {
          ...state
        };
      }
    };

export default updateCredentials;