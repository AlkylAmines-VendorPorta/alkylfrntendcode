export function getPRforEnquiry(response) {
    return{
        type:"POPULATE_PR_VENDOR",
        payload:response
    }
}