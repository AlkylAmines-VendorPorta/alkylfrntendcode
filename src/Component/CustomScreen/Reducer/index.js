import swal from 'sweetalert';

let defaultState = {
    index : 0,
    vendorList: [],
    enqDetails: {}
}

const custom = (state = defaultState, action) => {
    if (action.type === 'SAVE_ASN_DETAILS') {
        return {
            ...state
        }
    } else if (action.type === 'ERROR_ASN_DETAILS') {
        console.log('e',action)
        swal({
            icon: "error",
            type: 'error',
            title: 'Something went wrong, try again',
            showConfirmButton: false});

        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors
        }
    }
    else if (action.type === 'GET_CUSTOM_ENQ_BY_ID') {
        return {
            ...state,
            enqDetails: action.payload
        }
    }

    else if (action.type === "SHOW_ASN_REMINDER") {
        return {
          ...state,
          vendorList: action.payload.objectMap.invitedVendorList
        };
      }
    
    else  if (action.type === 'DELETE_ASN_DETAILS') {
        return {
            ...state
        }
    } else if (action.type === 'ERROR_DELETE_ASN_DETAILS') {
        console.log('e',action)
        swal({
            icon: "error",
            type: 'error',
            title: 'Something went wrong, try again',
            showConfirmButton: false});

        return {
            ...state,
            hasError: action.payload.hasError,
            error: action.payload.errors
        }
    }
    else {
        return {
            ...state
        }
    }
   

}

export default custom