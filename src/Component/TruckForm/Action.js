import { isEmpty } from "lodash-es";
import { showAlert,swalWithUrl,showAlertAndReload} from "../../Util/ActionUtil";

export function getPOListForASN(response){
    console.log("action" + response);
  return {
    type: "POPULATE_PO_FOR_ASN",
    payload:  response
    
  }
  }
