import { isEmpty } from "lodash-es"
import { showAlert,swalWithUrl} from "../../../Util/ActionUtil";
  export function fetchServiceData(response){
    return {
      type: "FETCH_SERVICE_DATA",
      payload:  response
    }
  }