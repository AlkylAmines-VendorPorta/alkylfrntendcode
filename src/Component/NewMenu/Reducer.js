let defaultState = {
    roleList:[],
    plantList:[],
    internalUsersList:[],
    internalUserDetails:"",
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
            plantList: action.payload.objectMap.plantList
          };
        }else if (action.type === "SHOW_INTERNAL_USERS_DETAILS") {
          
            return {
              ...state,
              internalUsersList: action.payload.objectMap.userRolesList,
              plantList: action.payload.objectMap.plantList,
              roleList: action.payload.objectMap.roleList,
            };
          } else {
            return {
              ...state
            };
          }
};

export default internalUserInfo;