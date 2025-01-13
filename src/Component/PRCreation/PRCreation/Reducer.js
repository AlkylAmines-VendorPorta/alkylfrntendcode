let defaultState = {
  prList:[]
}

const PRCreationCont = (state = defaultState, action) => {

if (action.type === "POPULATE_PR_LIST") {
  
  return {
    ...state,
    prList: action.payload.objectMap.prList,

  };
}
else {
    return {
      ...state
    };
  }
};


export default PRCreationCont;