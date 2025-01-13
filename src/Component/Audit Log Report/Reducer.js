let defaultState = {
    
  auditreportlist:[],
  
  }
  
  const auditlogreports = (state = defaultState, action) => {
  
    if (action.type === "GET_AUDIT_REPORT") {
        return {
          ...state,
          auditreportlist: action.payload.objectMap.logList,
          
      
        };
      }
      else {
          return {
            ...state
          };
        }


}


export default auditlogreports;