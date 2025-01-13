export let loader = true;
export function populatePartnerInfo(response){
    // return (dispatch) => {
    //     dispatch({
    //         type: 'isFetching'
    //     }); 
  return {
        type: "POPULATE_PARTNER_INFO",
        payload: response.objectMap
    }
    //}
}