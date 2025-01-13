export function updatePRSubmit(response) {
    return {}
}

export function getPRLines(response) {
    console.log('getPRLines',response)
    return{
        type:"POPULATE_PR_LINES_BUYER",
        payload:response
    }
}
export function disabledLoading(response) {
    console.log('getPRLines',response)
    return{
        type:"DISABLED_LOADING"
    }
}

export function getDocuments(response) {
    return{
        type:"GET_DOCUMENTS",
        payload:response
    }
}