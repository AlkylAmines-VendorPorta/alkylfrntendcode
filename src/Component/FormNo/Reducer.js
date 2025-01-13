let defaultState = {
  asnDetails:"",
  purchaseOrderList:[],
  poLineList:[],
  asnLineList:[],
  asnList:[],
  purchaseOrder:"",
  partner:"",
  user:"",
  role:"",
  purchaseOrderStatusList:[],
  asnStatusList:[],
}

const formNoContReducer = (state = defaultState, action) => {
  if(action.type==="POPULATE_PURCHASE_ORDER_AND_PARTNER"){
    return {
      ...state,
      purchaseOrderList: action.payload.objectMap.poList,
      partner: action.payload.objectMap.partner,
      user: action.payload.objectMap.user,
      role: action.payload.objectMap.role,
      purchaseOrderStatusList:action.payload.objectMap.purchaseOrderStatusList
    };
    
  }
  else return {
        ...state
      };
  }

export default formNoContReducer;