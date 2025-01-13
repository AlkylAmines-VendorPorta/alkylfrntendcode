import {
    isEmpty
} from '.././../../Util/validationUtil';
let defaultState ={
     isLoading: false
 }
const loadingReducer = (state = [], action) => {
    const { type } = action;
    const matches = /(isFetching)(.*)/.exec(type);

    const userinfoAction = /(USER_INFO)(.*)/.exec(type);
    //  alert(action.type);
    if (!isEmpty(type) && !/@@redux/.test(type)) {
        return {
            ...state,
            isLoading: true,
            count:Math.random()
        }
    }else {
        return {
            ...state,
            isLoading: false,
            count:Math.random()
        }
    }
}

export default loadingReducer;