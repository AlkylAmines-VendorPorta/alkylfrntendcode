export function getPR(response) {
    return{
        type:"POPULATE_PR",
        payload:response 
    }
}

export function getFilterData(response) {
    return{
        type:"GET_FILTER_DATA",
        payload:response 
    }
}
