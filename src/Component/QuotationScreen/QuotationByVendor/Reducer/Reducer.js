let defaultState={
    removeAttachmentRes:{},
    paymentTermsList:[],
    workbook:"",

}

const quotationByVendorReducer = (state= defaultState,action)=>{
    if(action.type==="SAVE_QUOTATION"){
        return{
            ...state,
            quotationSaveStatus:action.payload.success,
            paymentTermsList:action.payload.objectMap.paymentTermsList,
            
        };
    }else if(action.type==="APPROVE_QUOTATION"){
        return{
            ...state,
            quotationApproveStatus:action.payload.success

        };
    }else if(action.type==="REJECT_QUOTATION"){
        return{
            ...state,
            quotationRejectStatus:action.payload.success
        };
    }else if(action.type==="SUBMIT_QUOTATION"){
        return{
            ...state,
        };
    }else if(action.type==="REMOVE_ATTACHMENT_BIDDER_RES"){
        return{
            ...state,
            removeAttachmentRes:action.payload
            
        };
     } else if(action.type==="POPULATE_VENDOR_QUOTATION_LINE"){
            return{
                ...state,
                paymentTermsList:action.payload.objectMap.paymentTermsList,
                
            };
    }
    else if(action.type==="POPULATE_VENDOR_EXPORT_EXCEL"){
        return{
            ...state,
            workbook:action.payload.objectMap.workbook
            
        };
}

else{
        return{
            ...state
        }
    }
}
export default quotationByVendorReducer;