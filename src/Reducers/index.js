import swal from 'sweetalert';
import { home_url } from "../Util/urlUtil";
//import update from 'react-addons-update';
import {
    ACCESS_TOKEN
} from '../Constants/index';



let defaultState = {
    response: {
        "data": [],
        "objectMap": {
            "sourceServiceList": [],
            "qualificationLevelList": [],
            "accountCategoryList": [],
            "ownerList": [],
            "statusList": [],
            "leadThourghList": [],
            "forecastCategoryList": [],
            "typeOfCallList": [],
            "countryList": [],
            "stateList": [],
            "campaignList": [],
            "languageList": [],
            "accountOpportunityList": [],
            "divisionList": [],
            "marketingUnitlist": [],
            "failedResponse": [],
            "abcclassificationList": [],
            "materialList": [],
            "distributionChannelList": []
        }
    },

    leadList: [],
    opportunityList: [],
    failedResponse: [],
    sourceServiceList: [],
    abcclassificationList: [],
    ownerList: [],
    distributionChannelList: [],
    divisionList: [],
    accountCategoryList: [],
    salesCycleList: [],
    salesPhaseList: [],
    marketingUnitlist: [],
    typeOfCallList: [],
    forecastCategoryList: [],
    leadResponse: [],
    leadThourghList: [],
    countryList: [],
    stateList: [],
    leadListResponse: [],
    statusList: [],
    campaignList: [],
    qualificationLevelList: [],
    OpportunityResponse: [],
    languageList: [],
    materialList: [],
    accountOpportunityList: [],
    error: [],
    notificationList:[],
    hasError: '',
    messege: '',
    notificationCount:'',
    totalLeftPage: 0,


    accountList: []


}

const mainReducer = (state = defaultState, action) => {

    if (action.type === 'LOGOUT') {

        swal({
            type: 'success',
            title: 'Logout Successfully',
            showConfirmButton: false
        });
        localStorage.removeItem(ACCESS_TOKEN);
        return {
            ...state,
            logout: action.payload,
        }
    } else if (action.type === 'USER_INFO') {

        return {
            ...state,
            userData: action.payLoad
        }
    } else if (action.type === 'SESSION_OUT') {

        return {
            ...state,
            user: action.payLoad
        }
    } else if (action.type === 'FAILED_LOGIN') {
        this.props.history.push('/')
        return {
            ...state,
            userData: action.payLoad
        }
    }
    
    else if (action.type === 'CHANGE_COLOR') {
        return {

            ...state,
            color: action.color
        }
    } else if (action.type === 'FORM_SAVED') {
        return {
            ...state,
            color: action.response
        }
    } else if (action.type === 'LI_DATA') {

        return {
            ...state,
            rightPaneLead: state.leadListResponse[action.index]
        }
    } else if (action.type === 'SAVE_REGISTRATION_FORM') {

        swal({
            title: "Done",
            text: "User Registered successfully, Your password has been sent on your E-mail..!",
            icon: "success",
            type: "success",
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
                window.location.href = home_url;
            }
        });
        return {
            ...state,
            hasError: action.response.hasError,
            messege: action.response.message,
            error: action.response.errors
        }
    } else if (action.type === 'FAILED_REGISTRATION_FORM') {

        swal("", "Unsuccessfull", "error");
        return {
            ...state,
            failedResponse: action.response

        }
    } else if (action.type === 'UPDATE_USER_INFO') {

        return {
            ...state,
            user: action.user
        }
    }else if(action.type === 'GET_NOTIFICATION_ALERT'){
    
        return{
            ...state,
            notificationList:action.payLoad.data,
            notificationCount:action.payLoad.data.length
        }
    }else if(action.type === 'UPDATE_NOTIFICATION_STATUS'){
        return{
            ...state,
            notificationList:action.payLoad.data,
            notificationCount:action.payLoad.data.length
        }
    }
     else {
        return {
            ...state
        }
    }
}

export default mainReducer;