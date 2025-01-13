import {
  //submitWithParam,
  submitToURL,
  //submitForm,
  //submitWithFourParam,
  //submitWithTwoParam,
  //getCurrentUser
} from "../../../Util/APIUtils";
import { isEmpty } from "../../../Util/validationUtil";
import { showAlert } from "../../../Util/ActionUtil";
import swal from "sweetalert";


export function populateVendorApprovalDetails(response,index){
  return {
      type : "POPULATE_VENDOR_APPROVAL",
      payload: response
  }
}


export function vendorApprovalReconAccountDetails(response,index){
  return {
      type : "POPULATE_VENDOR_APPROVAL_RECON_ACCOUNT_LIST",
      payload: response
  }
}

export function vendorApprovalPaymentTermsDetails(response,index){
  return {
      type : "POPULATE_VENDOR_APPROVAL_PAYMENT_TERM_LIST",
      payload: response
  }
}

export function vendorApprovalincoTermsListDetails(response,index){
  return {
      type : "POPULATE_VENDOR_APPROVAL_INCO_TERM_LIST",
      payload: response
  }
}



export function saveVendorApprovalResp(response) {
  return ()=>{
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
  && !isEmpty(response.objectMap.approvalMatrix) && !isEmpty(response.objectMap.approvalMatrix.response)){
    let swalTitle=response.objectMap.approvalMatrix.response.hasError===true?"Wrong":"Done";
    //let swalText=response.objectMap.approvalMatrix.response.message;
    let swalText=response.objectMap.approvalMatrix.response.hasError===true?"please check all required field":response.objectMap.approvalMatrix.response.message;
    let swalType=response.objectMap.approvalMatrix.response.hasError===true?"warning":"success";
    swal({
        title: swalTitle,
        text: swalText,
        icon: swalType,
        type: swalType,
        buttons : true,
      }).then((isConfirm)=>{
       if (isConfirm && !response.objectMap.approvalMatrix.response.hasError){
        window.location.reload(false)
       }else{
        return{
          type : "",
          payload : ""
        }
       }
     })
    }
  };
}

export function getVendorApprovalMatrix(response) {
  if (!isEmpty(response)) {
    return {
      type: "FETCH_VENDOR_APPROVAL_MATRIX", 
      payload: response
    };
  } else {
    return {
      type: "POPULATE_VENDOR_APPROVAL",
      payload: response
    };
  }
}