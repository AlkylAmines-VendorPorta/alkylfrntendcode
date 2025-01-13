let defaultState = {
    partner: "",
    partnerList: [],
    isUserInvited:"",
    inviteMessage:"" ,
    userList : []
}

const prUserInvitation = (state = defaultState, action) => {
  
      if(action.type==="PR_INVITE_RESPONSE"){
        
        return {
          ...state,
          partner: action.payload.objectMap.user,
        };
      }else if(action.type==="PR_SEARCH_RESPONSE"){
        return {
          ...state,
          isUserInvited: action.payload.success,
          inviteMessage: action.payload.message
        };
      }else if(action.type==="PR_VIEW_COMPANY_LIST"){
        return {
          ...state,
          userList: action.payload.objectMap.userList
        };
      }else {
        return {
          ...state
        };
      }
}
export default prUserInvitation;
