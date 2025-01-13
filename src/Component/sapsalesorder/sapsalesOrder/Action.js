import { showAlert } from "../../../Util/ActionUtil";
import { isEmpty } from "lodash-es";




  export function getSsoLines(response){
    
    return {
      type: "POPULATE_SSP_LINE",
      payload: response
    };
  }

  