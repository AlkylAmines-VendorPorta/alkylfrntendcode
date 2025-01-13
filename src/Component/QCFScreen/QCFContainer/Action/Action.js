export function getQcfPR(response) {
    return{
        type:"POPULATE_QCF_PR",
        payload:response
    }
}

export function getQCFApproverListFromSAP(response){
    return {
      type: "POPULATE_QCF_Approver_LIST_FROM_SAP",
      payload:  response
    }
  }