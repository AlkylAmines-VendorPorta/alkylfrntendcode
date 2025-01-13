  export function getPRLines(response) {
    return{
        type:"POPULATE_PR_LINES",
        payload:response
    }
}


export function getPR(response) {
  return{
      type:"POPULATE_PR",
      payload:response 
  }
}


