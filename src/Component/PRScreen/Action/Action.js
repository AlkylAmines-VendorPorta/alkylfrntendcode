import { showAlert,swalWithUrl,showAlertAndReload} from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";
// export function getPR(response) {
//     showAlert(!response.success,response.message);
//     return{
//         type:"POPULATE_PR",
//         payload:response 
//     }
// }

export function getPR(response){ 
  if(!isEmpty(response)){
    
    
    if(response.success){
      return {
        type: "POPULATE_PR",
        payload:  response
      }
    }else{
      showAlert(!response.success,response.message,"");
      return {
        type: "",
        payload:  ""
      } 
    }
  }    
}

export function getFilterData(response) {
    return{
        type:"GET_FILTER_DATA",
        payload:response 
    }
}
