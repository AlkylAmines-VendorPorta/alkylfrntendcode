import {showAlert} from "../../../Util/ActionUtil"
import { isEmpty } from "../../../Util/validationUtil";
import swal from "sweetalert";
  
  export function saveAssociateCompanyDetailsResp(response){
    if(!isEmpty(response)  && !isEmpty(response.response)){
      showAlert(response.response.hasError, response.response.message);
        if(!response.response.hasError){
          return {
            type : "SAVE_ASSOCIATE_COMPANY_DETAILS_RESP",
            payload: response
          };
        }else{
          return {
            type : ""
          };
        }
    }
  }
  
  export function saveDirectorDetailsResponse(response,index){
    if(!isEmpty(response)  && !isEmpty(response.objectMap) && !isEmpty(response.objectMap.directorDetails)
      && !isEmpty(response.objectMap.directorDetails.response)){

        showAlert(response.objectMap.directorDetails.response.hasError, response.objectMap.directorDetails.response.message);

        if(!response.objectMap.directorDetails.response.hasError){
          return {
            type : "SAVE_DIRECTOR_DETAILS",
            payload: response
          };
        }else{
          return {
            type : ""
          };
        }
    }
    
  }

  export function getDirectorDetails(response,index){
    return {
        type : "POPULATE_DIRECTOR_DETAILS",
        payload: response
    }
  }

  export function CompanyContactResponse(response,index){
    return {
        type : "POPULATE_ASSOCIATE_COMP_DETAILS",
        payload: response
    }
  }

  export function otherDetailsResponse(response){
    return {
        type : "POPULATE_OTHER_DETAILS",
        payload: response
    }
  }
  export function saveotherDetailsResponse(response){
    if(!isEmpty(response)  && !isEmpty(response.response)){
      showAlert(response.response.hasError,response.response.message);
      if(!response.response.hasError){
        return {
          type : "SAVE_OTHER_DETAILS",
          payload: response
        };
      }else{
        return {
          type : ""
        };
      }
    }
  }


  export function getFinancialDetails(response){
    if(!isEmpty(response)  && !isEmpty(response.response)){
      showAlert(response.response.hasError,response.response.message);
    }
    return {
        type : "POPULATE_FINANCIAL_DETAILS",
        payload: response
    }
  }


  export function saveFinancialDetails(response){
    
    if(!isEmpty(response)  && !isEmpty(response.objectMap)
      && !isEmpty(response.objectMap.financialDetails)  && !isEmpty(response.objectMap.financialDetails.response)){
      showAlert(response.objectMap.financialDetails.response.hasError,response.objectMap.financialDetails.response.message);
      if(!response.objectMap.financialDetails.response.hasError){
        return {
          type : "SAVE_FINANCIAL_DETAILS",
          payload: response
        };
      }else{
        return {
          type : ""
        };
      }
    }
  }

  export function populateStates(response){
    return {
      type: "POPLUATE_STATES_FOR_ASSOCIATE",
      payload: response
    };
  }

  export function populateDistricts(response){
    return {
      type: "POPLUATE_DISTRICTS_FOR_ASSOCIATE",
      payload: response
    };
  }

  export function deletePartnerAddress(response){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.partnerCompanyAddr) && !isEmpty(response.objectMap.partnerCompanyAddr.response)){
      showAlert(response.objectMap.partnerCompanyAddr.response.hasError,response.objectMap.partnerCompanyAddr.response.message);
    }
    return {
      type: "DELETE_ASSOCIATE_ADDRESS",
      payload: response
    };
  }

  export function deleteDirector(response){
    if(!isEmpty(response) && !isEmpty(response.objectMap) 
    && !isEmpty(response.objectMap.directorDetails) && !isEmpty(response.objectMap.directorDetails.response)){
      showAlert(response.objectMap.directorDetails.response.hasError,response.objectMap.directorDetails.response.message);
    }
    return {
      type: "DELETE_DIRECTOR",
      payload: response
    };
  }

  // export function submitRegistrationResponse(response){
  //   
  //   return ()=>{
  //     if(!isEmpty(response) ){
  //     showAlert(!response.success,response.message);
  //     let swalTitle=response.success===true?"Done":"Wrong";
  //     let swalText=response.message;
  //     let swalType=response.success===true?"success":"warning";
  //     swal({
  //         title: swalTitle,
  //         text: swalText,
  //         icon: swalType,
  //         type: swalType,
  //         buttons : true,
  //       }).then((isConfirm)=>{
  //        if (isConfirm && response.success){
  //         return {
  //           type : "REGISTRATION_RESPONSE",
  //           payload: response
  //         }
  //        }else{
  //         return{
  //           type : "",
  //           payload : ""
  //         }
  //        }
  //      })
  //     }else{
  //       return{
  //         type : "",
  //         payload : ""
  //       }
  //     }
  //   };   
      
  // }

  export function submitRegistrationResponse(response) {
    return ()=>{
      if(!isEmpty(response)){
      let swalTitle=response.success===false?"Wrong":"Done";
      let swalText=response.message;
      let swalType=response.success===false?"warning":"success";
      swal({
          title: swalTitle,
          text: swalText,
          icon: swalType,
          type: swalType,
          buttons : true,
        }).then((isConfirm)=>{
         if (isConfirm && response.success && !isEmpty(componentProps.partner.isProfileUpdated) && componentProps.partner.isProfileUpdated == 'N'){
          // window.location.reload(false)
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
  
  // export function submitRegistrationResponse(response){
  //   
  //   return ()=>{
  //     if(!isEmpty(response) ){
  //       showAlert(!response.success,response.message);
  //       if(response.success){
  //         return {
  //             type : "REGISTRATION_RESPONSE",
  //             payload: response
  //         }
  //       }else{
  //         return{
  //           type : "",
  //           payload : ""
  //         }
  //       }
  //     }
  //   };   
      
  // }