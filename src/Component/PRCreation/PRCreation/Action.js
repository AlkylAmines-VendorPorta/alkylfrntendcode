import { isEmpty } from "lodash-es";
import { showAlert,swalWithUrl,showAlertAndReload} from "../../../Util/ActionUtil";
//import { submitToURL,  } from "../../../Util/APIUtils";
//import { isEmpty } from "../../../Util/validationUtil";
//import { showAlert } from "../../../Util/ActionUtil";
import swal from "sweetalert";

  export function getPrList(response){
    showAlert(!response.success,response.message);
    return {
      
      type: "POPULATE_PR_LIST",
      payload: response
    };
  }
