let defaultState = {
    partner: "",
    partnerList: [],
    isUserInvited:"",
    inviteMessage:"" ,
    userList : [],
    newuserList:{},
    newinviteMessage:""
}

const userInvitation = (state = defaultState, action) => {
  
      if(action.type==="INVITE_RESPONSE"){
        
        return {
          ...state,
          partner: action.payload.objectMap.user,
        };
      }
      // else if(action.type==="SEARCH_RESPONSE"){
      //   return {
      //     ...state,
      //     isUserInvited: action.payload.success,
      //     inviteMessage: action.payload.message
      //   };
      // }
      else if(action.type==="VIEW_COMPANY_LIST"){
        return {
          ...state,
          userList: action.payload.objectMap.userList
        };
      }else if(action.type==="CHANGE_LOADER_STATE"){
        return {
          ...state,
          loaderState: action.payload
        };
      }else if(action.type==="USER_LIST"){
        return {
          ...state,
          newuserList: action.payload.objectMap.VendorData,
          newinviteMessage:action.payload.message,
          inviteMessage: action.payload.message,
          isUserInvited: action.payload.success
        };
      }else {
        return {
          ...state
        };
      }
}
export default userInvitation;
