let defaultState = {
    roleList:[],
    plantList:[],
    internalUsersList:[],
    internalUserDetails:"",
    userRolesList:[],
    isRoleDeleted:"",
    internalUserList:[],
    costCenterList:[],
    sapCostCenterList:[]
}



const internalUserInfo = (state = defaultState, action) => {

    if (action.type === "SAVE_INTERNAL_USER_INFO") {
      
      return {
        ...state,
        internalUserInfo: action.payload
      };
    }else if (action.type === "POPULATE_DROP_DOWN") {
      
        return {
          ...state,
          roleList: action.payload.objectMap.roleList,
          plantList: action.payload.objectMap.plantList,
          internalUserList: action.payload.objectMap.internalUserList,
         //costCenterList: action.payload.objectMap.costCenterList,
        };
      }else if (action.type === "SHOW_INTERNAL_USERS_DETAILS") {
        
        return {
          ...state,
          internalUsersList: action.payload.objectMap.userRolesList,
          plantList: action.payload.objectMap.plantList,
          roleList: action.payload.objectMap.roleList,
          internalUserList: action.payload.objectMap.internalUserList,
          costCenterList: action.payload.objectMap.costCenterList,
        };
      }else if (action.type === "GET_USER_ROLES") {
        return {
          ...state,
          userRolesList: action.payload.objectMap.userRolesList
        };
      }  else if (action.type === "DELETE_ROLE") {
        return {
          ...state,
          isRoleDeleted: action.payload.success,
          count:Math.random()
        };
      }else if(action.type==="CHANGE_LOADER_STATE_INTERNAL_USER"){
        return {
          ...state,
          loaderState: action.payload
        };
      }
      else if(action.type==="POPULATE_COST_CENTRE_DROP_DOWN"){
        return {
          ...state,
           sapCostCenterList: action.payload.CostCenter
           
        };
      }
      else {
        return {
          ...state
        };
    }
};

export default internalUserInfo;