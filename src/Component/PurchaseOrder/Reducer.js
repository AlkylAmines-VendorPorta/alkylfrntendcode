let defaultState = {
    purchaseorderList:[],
    purchaseOrder:"",
    partner:"",
    user:"",
    role:"",
    purchaseOrderStatusList:[],
    asnStatusList:[],
    asnList:[]
}

const poReducer = (state = defaultState, action) => {
    // console.log("state",action)
    if(action.type==="POPULATE_PURCHASE_ORDER_AND_PARTNER"){
      return {
        ...state,
        purchaseOrderList: action.payload.objectMap.poList,
        partner: action.payload.objectMap.partner,
        user: action.payload.objectMap.user,
        role: action.payload.objectMap.role,
        purchaseOrderStatusList:action.payload.objectMap.purchaseOrderStatusList
      };
    }else if (action.type === "POPULATE_ASN_LIST_FOR_PO") {
      return {
        ...state,
        asnList: action.payload.objectMap.asnList,
        asnStatusList: action.payload.objectMap.asnStatusList,
      };
    }

    else{
      return {
        ...state
      };
    }
  }
export default poReducer;
