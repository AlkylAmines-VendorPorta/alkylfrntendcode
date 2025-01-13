let defaultState = {
   
  SapSalesOrderStatusList:[]
    
  }
  
  const ssoReducer = (state = defaultState, action) => {
    
      console.log('tooot UPDAT_BUTTON_STATUS',action);
    if(action.type==="POPULATE_SAPORDER"){
      return {
        ...state,
        SapSalesOrderStatusList:action.payload      
      };
    }
    else if(action.type === "POPULATE_SAPCREATEBUTTON"){

      // let items = SapSalesOrderStatusList;
      let index = 1;

      return {
        ...state,
        // SapSalesOrderStatusList:items     
      };
    }else if(action.type == 'UPDAT_BUTTON_STATUS'){
      state.SapSalesOrderStatusList[action.payload.index] = {
        ...state.SapSalesOrderStatusList[action.payload.index],
        
        requestNo:'Created'
      }
      let items = [...state.SapSalesOrderStatusList];
      // console.log("item",items)
      console.log('items update in stroe',state.SapSalesOrderStatusList)
      return {
        ...state,
        SapSalesOrderStatusList: items
      };
    }
    else {
      return {
        ...state
      };
    }
  }
  export default ssoReducer;
  