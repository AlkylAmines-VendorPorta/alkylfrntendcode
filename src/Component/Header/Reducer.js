let defaultState = {
    user : []
}

const dashboardHeaderRed = (state = defaultState, action) => {
    
    if(action.type==="POPULATE_USER_DETAILS"){
        return {
          ...state,
          user : action.payload
        };
    }
    else if(action.type==="GET_ACCESS_MASTER_DTO"){
        return {
          ...state,
          accessMasterDto : action.payload
        };
    }else if(action.type==="NOT_LOGOUT"){
        return {
          ...state,
          logout : action.payload
        };
    }else if(action.type==="CHANGE_ROLE"){
        return {
          ...state
        };
    }
    else{
        return {
            ...state
        };
    }

}

export default dashboardHeaderRed;