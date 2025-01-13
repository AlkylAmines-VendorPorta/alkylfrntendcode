export function getSapsalesOrder(response) {
    
    return {
        type: "POPULATE_SAPORDER",
        payload: response
    }
}
export function getSapcreatebutton(response) {
    return {
        type: "POPULATE_SAPCREATEBUTTON",
        payload: response
    }
}

export function updateButtonStatus(response,index) {
    return {
        type: "UPDAT_BUTTON_STATUS",
        payload: {response,index}
    }
}

