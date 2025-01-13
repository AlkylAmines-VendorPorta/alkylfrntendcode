let defaultState={

}

const vendorSelection = (state= defaultState,action)=>{
    if(action.type==="SEARCH_VENDOR"){
        return{
            ...state,
            userList:action.payload.objectMap.userList
        }
    }else if(action.type==="CREATE_ENQUIRES"){
        return{
            ...state,  
        }
    }else if(action.type==="ENQUIRY_TO_BINDDER"){
        return{
            ...state,
            
        }
    }
    else if(action.type==="SEARCH_VENDO"){
        return{
            ...state,
            userList:action.payload.objectMap.userList
        }
        
    }
    else{
        return{
            ...state
        }
    }
}
export default vendorSelection;