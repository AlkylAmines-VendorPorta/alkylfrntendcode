let defaultState = {  
  vendorMatrixApproval:"",
  vendorClassification:"",
  reconAccount:"",
  vendorSchemaGroup:"",
  vendorPaymentTerms:"",
  vendorIncoTerms:"",
  vendorIncoDescription:"",
  purchaseGroup:"",
  sapVendorMatrixApproval:{},
  sapMasterData:{},
  titleList:[],
  vendorClassificationList:[],
  reconAccountList:[],
  vendorSchemaGroup:[],
  vendorPurchaseGroupList:[],
  paymentTermsList:[],
  incoTermsList:[],
  industryList:[],
  industry:"",
  role:"",
  msmeType:""
 // vendorCode:"",
}

const vendorApproval = (state = defaultState, action) => {

if (action.type === "SAVE_VENDOR_APPROVAL_RESP") {
  return {
    ...state,
    vendorMatrixApproval: action.payload.objectMap.approvalMatrix
  };
}else if (action.type === "POPULATE_VENDOR_APPROVAL") {
    return {
      ...state,
      reconAccountList: action.payload.objectMap.reconAccountList,
      vendorClassificationList: action.payload.objectMap.vendorClassificationList,
      titleList:action.payload.objectMap.titleList,
      vendorSchemaGroupList: action.payload.objectMap.vendorSchemaGroupList,
      vendorMatrixApproval: action.payload.objectMap.vendorApproval,
      isMsme:action.payload.objectMap.isMsme,
      msmeType:action.payload.objectMap.msmeType,
      vendorPurchaseGroupList:action.payload.objectMap.vendorPurchaseGroupList,
      incoTermsList:action.payload.objectMap.incoTermsList,
      paymentTermsList:action.payload.objectMap.paymentTermsList,
     // vendorCode:action.payload.objectMap.vendorCode

};

  }
  else if (action.type === "POPULATE_VENDOR_APPROVAL_RECON_ACCOUNT_LIST") {
    return {
      ...state,
      reconAccountList: action.payload.objectMap.reconAccountList,
      role:action.payload.objectMap.role
     

};

  } else if (action.type === "POPULATE_VENDOR_APPROVAL_PAYMENT_TERM_LIST") {
    return {
      ...state,
      paymentTermsList:action.payload.objectMap.paymentTermsList,
     

};

  }
  else if (action.type === "POPULATE_VENDOR_APPROVAL_INCO_TERM_LIST") {
    return {
      ...state,
      incoTermsList:action.payload.objectMap.incoTermsList,
     

};

  }
  else if (action.type === "FETCH_VENDOR_APPROVAL_MATRIX") {
    return {
      ...state,
      sapVendorMatrixApproval: action.payload.vendorMatrixApproval,
      sapMasterData: action.payload.masterData,
      industry:action.payload.vendorMatrixApproval.industry,
      industryList:action.payload.masterData.industry,
      vendorClassification:action.payload.vendorMatrixApproval.vendorClassification.value,
      reconAccount:action.payload.vendorMatrixApproval.reconAccount.value,
      vendorSchemaGroup:action.payload.vendorMatrixApproval.vendorSchemaGroup.value,
      vendorPaymentTerms:action.payload.vendorMatrixApproval.vendorPaymentTerms.value,
      vendorIncoTerms:action.payload.vendorMatrixApproval.vendorIncoTerms.value,
      vendorIncoDescription:action.payload.vendorMatrixApproval.vendorIncoDescription,
      purchaseGroup:action.payload.vendorMatrixApproval.purchaseGroup.value,
     // orderCurrency:action.payload.vendorMatrixApproval.orderCurrency,
     // vendorCode:action.payload.vendorMatrixApproval.vendorCode
    
    };
  }
  else {
    return {
      ...state
    };
  }
};

export default vendorApproval;