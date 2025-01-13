import {
    API_BASE_URL,
    SAP_BASE_URL,
    ACCESS_TOKEN,
    IS_USER_AUTHENTICATED,
    SAP_BASE_URL_VENDOR
} from '../Constants/';
import {
    TILES_URL
} from '../Constants/UrlConstants';
import axios from 'axios';
import { isEmpty } from "./validationUtil";
import { home_url } from "../Util/urlUtil";
export let isLoading = true;
export const request = (options) => {
    isLoading = true;
    const headers = new Headers({
        'Content-Type': 'application/json',
    })


    if (!isEmpty(localStorage.getItem(ACCESS_TOKEN))) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    //const defaults = {headers: headers};
    return axios({
        method: options.method,
        url: options.url,
        data: options.body,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods':'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK',
            'Access-Control-Allow-Origin':'*',
            
        }
    }).then((response) => {
        if(response.data==="{'status':'401','500'}"){
            localStorage.setItem(ACCESS_TOKEN,"");
            localStorage.setItem(IS_USER_AUTHENTICATED,false);
            localStorage.setItem(TILES_URL,"");
            window.location.href=home_url;
        }else if (isEmpty(response.data)) {
            let data=[];
              data={
                hasError:true,
                objectMap:[]
              }
              return data;
          }
        isLoading = false;
        return response.data;
    }).catch((error) => {
        let data=[];
        data={
            hasError:true,
            objectMap:[]
        }
        return data;
    })
};

const request2 = (options) => {
    isLoading = true;
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {
        headers: headers
    };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>{
          //  response.json().then(json => {
                isLoading = false;
              //  if (!response.ok) {
                    return response;
                //}else{
                  //  return response.json();
               // }
              //  return json;
            //})
        } ).catch((error)=>{
            return 500;
        }
        ); 
};

export function login(data) {

    return request2({
        url: API_BASE_URL + "/api/auth/signin",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function logoutAPi() {

    return request({
        url: API_BASE_URL + "/rest/logout",
        method: 'GET',
    });
}

export function getViewName() {

    return request({
        url: API_BASE_URL + "/rest/view",
        method: 'GET',
    });
}

export function getCurrentUser(data) {
    
    return request({
        url: API_BASE_URL + "/pu/user/me",
        method: 'POST',
        body: data
    });
}
export function forgetPasswordApi(data) {

    return request({
        url: API_BASE_URL + "/rest/forgotPassword",
        method: 'POST',
        body: data
    });

}

export function updatePasswordApi(data) {

    return request({
        url: API_BASE_URL + "/rest/updatePassword",
        method: 'POST',
        body: data
    });

}
export function saveOpportunityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewOpportunity",
        method: 'POST',
        body: data
    });

}

export function saveCustomerRoleApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveRoleAccessMasters",
        method: 'POST',
        body: data
    });

}


export function saveUserFormApi(data) {

    return request({
        url: API_BASE_URL + "/pu/addNewUser",
        method: 'POST',
        body: data
    });

}

 export function saveUserRoleFormApi(data) {

     return request({
         url: API_BASE_URL + "/pu/addNewUserRole",
         method: 'POST',
         body: data
     });

 }

 export function saveRoleAccessFormApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewRoleAccess",
        method: 'POST',
        body: data
    });

}

export function saveRoleApi(data) {

    return request({
        url: API_BASE_URL + "/pu/addNewRole",
        method: 'POST',
        body: data
    });

}

export function saveLeadApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewLead",
        method: 'POST',
        body: data
    });

}

export function saveSalesQuotesApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewSalesQuotes",
        method: 'POST',
        body: data
    });

}

export function ConvertToSOFormApi(data) {

    return request({
        url: API_BASE_URL + "/pr/convertSalesOrder",
        method: 'POST',
        body: data
    });

}

export function saveSalesOrderApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewSalesOrder",
        method: 'POST',
        body: data
    });

}


export function saveConvertOpportunityApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/convertLeadToOpportunity",
        method: 'POST',
        body: data
    });

}



export function getLeadApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getLeadList",
        method: 'POST',
        body: page
    });

}

export function getTypeOfCallApi(page) {

    return request({
        url: API_BASE_URL + "/pu/getTypeOfCallServiceList",
        method: 'POST',
        body: page
    });

}

export function getforecastCategoryApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getForecastCategoryList",
        method: 'POST',
        body: page
    });

}
export function getforecastPaginationApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getForecastCategoryPagination",
        method: 'POST',
        body: page
    });

}

export function getReferenceListDataApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getReferenceListData",
        method: 'POST',
        body: data
    });

}


export function getReferenceApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getReferenceList",
        method: 'POST',
        body: page
    });

}



export function getSalesUnitApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSalesUnitList",
        method: 'POST',
        body: page
    });

}

export function getPaymentTermApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getPaymentTermsList",
        method: 'POST',
        body: page
    });

}


export function getDepartmentApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getDepartmentList",
        method: 'POST',
        body: page
    });

}


export function getQualificationLevelApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getQualificationLevelList",
        method: 'POST',
        body: page
    });

}


export function getSalesPhaseApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSalesPhaseList",
        method: 'POST',
        body: page
    });

}


export function getSalesCycleApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSalesCycleList",
        method: 'POST',
        body: page
    });

}

export function getStateApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getStateListData",
        method: 'POST',
        body: page
    });

}


export function getSalesQuotesApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSalesQuotesDataByCheck",//getSalesQuotesList 
        method: 'POST',
        body: page
    });

}

export function getProductListApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getOrderLineList",
        method: 'POST',
        body: page
    });

}

export function getRoleAccessApi(Id) {

    return request({
        url: API_BASE_URL + "/pr/getRoleAccessMaster/" + Id,
        method: 'POST',
        body: ''
    });

}

export function getRolesAccessApi(data) {
    
        return request({
            url: API_BASE_URL + "/pr/getRoleAccessMasterList",
            method: 'POST',
            body: data
        });
    
    }
    

export function getRolesApi(page) {
    return request({
        url: API_BASE_URL + "/pu/getRoles",
        method: 'POST',
        body: page
    });

}
export function getRoleApi(page) {
    
        return request({
            url: API_BASE_URL + "/pu/getRoles",
            method: 'POST',
            body: page
        });
    
    }

    export function getDashboardTileApi() {
        
            return request({
                url: API_BASE_URL + "/pr/getDashboardTile",
                method: 'POST',
                body: ''
            });
        
        }

export function getSalesTabApi(page) {

        return request({
            url: API_BASE_URL + "/pu/getSalesList",
            method: 'POST',
            body: page
        });
    
    }

    export function getUserListApi(page) {
        
            return request({
                url: API_BASE_URL + "/pu/getUserList",
                method: 'POST',
                body: page
            });
        
        }

    export function getMasterApi(page) {
        
            return request({
                url: API_BASE_URL + "/pu/getMasterList",
                method: 'POST',
                body: page
            });
        
        }


export function getSalesOrderProductListApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getOrderLineList",
        method: 'POST',
        body: page
    });

}


export function getSalesOrderApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSalesOrderDataList",
        method: 'POST',
        body: page
    });

}


export function getActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getActivityData",
        method: 'POST',
        body: data
    });
}



export function getLeftPaneLeadApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getLeadListData",
        method: 'POST',
        body: page
    });

}

export function getLeftPaneStateApi(page){

    return request({
        url: API_BASE_URL + "/pr/getStateListData",
        method: 'POST',
        body: page
    });

}

export function getLeftPaneOpportunityApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getOpportunitypageList",
        method: 'POST',
        body: page
    });

}


export function saveAccountApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addAccount",
        method: 'POST',
        body: data
    });
}

export function getAccountListApi(data) {
    return request({
        url: API_BASE_URL + "/pr/getAccountList",
        method: 'POST',
        body: data
    });
}

export function getOpportunityApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getOpportunityList",
        method: 'POST',
        body: page
    });
}


export function saveProductApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveLeadProductLine",
        method: 'POST',
        body: data
    });

}

export function saveSalesQuotesProductApi(data) {


    return request({
        url: API_BASE_URL + "/pr/addNewOrderLineProduct",
        method: 'POST',
        body: data
    });

}


export function getProductsApi(data) {
    return request({
        url: API_BASE_URL + "/pr/getLeadProductList",
        method: 'POST',
        body: data
    });
}

export function uploadFile(data, url) {

    return request({
        url: API_BASE_URL + url,
        method: 'POST',
        body: data
    });
}

export function sendMailDto(data, url) {

    return request({
        url: API_BASE_URL + url,
        method: 'POST',
        body: data
    });
}

export function getEmployees(page) {
    return request({
        url: API_BASE_URL + "/pr/getEmployeeList",
        method: 'POST',
        body: page
    });
}


export function getEmployeePagination(page) {
    return request({
        url: API_BASE_URL + "/pr/getEmployeePaginationData",
        method: 'POST',
        body: page
    });
}

export function saveEmployeeApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addEmployee",
        method: 'POST',
        body: data
    });
}

export function saveTypeOfCallApi(data) {

    return request({
        url: API_BASE_URL + "/pu/addNewTypeOfCall",
        method: 'POST',
        body: data
    });
}

export function saveforecastCategoryApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewForecastCategory",
        method: 'POST',
        body: data
    });
}


export function saveReferenceListDataApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewReferenceListData",
        method: 'POST',
        body: data
    });
}


export function saveReferenceApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewReference",
        method: 'POST',
        body: data
    });
}

export function saveSalesUnitApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewSalesUnit",
        method: 'POST',
        body: data
    });
}


export function savePaymentTermApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewPaymentTerms",
        method: 'POST',
        body: data
    });
}

export function saveDepartmentApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewDepartment",
        method: 'POST',
        body: data
    });
}
export function saveCampaignApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addCampaign",
        method: 'POST',
        body: data
    });
}

export function saveHSNApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveHSN",
        method: 'POST',
        body: data
    });
}


export function getCampaignApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getCampaignList",
        method: 'POST',
        body: data
    });

}
export function getRoleListApi(data) {

    return request({
        url: API_BASE_URL + "/pu/getRolesList",
        method: 'POST',
        body: data
    });

}

export function getUserRoleListApi(data) {

    return request({
        url: API_BASE_URL + "/pu/getUserRoleList",
        method: 'POST',
        body: data
    });

}

export function getLeftPaneHSNApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getCampaignList",
        method: 'POST',
        body: data
    });

}
export function getHSNApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getHSNList",
        method: 'POST',
        body: data
    });

}
export function saveQualificationLevelApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewQualificationLevel",
        method: 'POST',
        body: data
    });
}

export function saveSalesPhaseApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewSalesPhase",
        method: 'POST',
        body: data
    });
}


export function saveSalesCycleApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addSalesCycle",
        method: 'POST',
        body: data
    });
}


export function saveStateApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addNewState",
        method: 'POST',
        body: data
    });
}


export function leadAttachmentApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addLeadAttachment',
        method: 'POST',
        body: data

    });
}

export function getLeadAttachmentsApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getLeadsAttachments',
        method: 'POST',
        body: data
    });
}


export function getContactApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getContactList",
        method: 'POST',
        body: page
    });
}


export function saveContactApi(data) {

    return request({
        url: API_BASE_URL + "/pr/addContact",
        method: 'POST',
        body: data
    });
}

export function saveActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveLeadActivity",
        method: 'POST',
        body: data
    });

}

export function saveOpportunityActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveOpportunityActivity",
        method: 'POST',
        body: data
    });

}

export function saveSalesQuotesActivityApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/saveSalesQuoteActivity",
        method: 'POST',
        body: data
    });

}


export function saveSalesOrderActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/saveSalesOrderActivity",
        method: 'POST',
        body: data
    });

}


export function saveConvertLeadToAccountApi(data) {

    return request({
        url: API_BASE_URL + "/pr/convertLeadToAccount",
        method: 'POST',
        body: data
    });

}
export function getOpportunityActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getOpportunityActivityData",
        method: 'POST',
        body: data
    });
}

export function getSalesQuotesActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getSalesQuoteActivityList",
        method: 'POST',
        body: data
    });
}
export function getSalesOrderActivityApi(data) {

    return request({
        url: API_BASE_URL + "/pr/getSalesOrderActivityList",
        method: 'POST',
        body: data
    });
}



export function getOpportunityProductsApi(data) {
    return request({
        url: API_BASE_URL + "/pr/getOpportunityProductsList",
        method: 'POST',
        body: data
    });
}
export function saveOpportunityAttachmentApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addOpportunityAttachment',
        method: 'POST',
        body: data

    });
}

export function saveSalesQuotesAttachmentApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addSalesQuotesAttachment',
        method: 'POST',
        body: data

    });
}

export function saveSalesOrderAttachmentApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addSalesOrderAttachment',
        method: 'POST',
        body: data

    });
}


export function getOpportunityAttachmentsApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getOpportunityAttachments',
        method: 'POST',
        body: data
    });
}

export function getSalesOrderAttachmentsApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getSalesOrderAttachments',
        method: 'POST',
        body: data
    });
}

export function getSalesQuotesAttachmentsApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getSalesQuotesAttachments',
        method: 'POST',
        body: data
    });
}


export function saveABCClassificationApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewAbcClassification',
        method: 'POST',
        body: data

    });
}

export function getABCClassificationListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getAbcClassificationList',
        method: 'POST',
        body: page
    });
}

export function getCurrencyApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getCurrencyList',
        method: 'POST',
        body: page
    });
}

export function getACApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getACList',
        method: 'POST',
        body: page
    });
}

export function saveCountryApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewCountry',
        method: 'POST',
        body: data

    });
}

export function getCountryListApi(page){
    return request ({
        url : API_BASE_URL + '/pr/getCountryData',
        method : 'POST',
        body : page
    });
}

export function saveDivisionApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewDivision',
        method: 'POST',
        body: data

    });
}

export function getDivisionListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getDivisionList',
        method: 'POST',
        body: page
    });
}

export function getDivisionPaginationApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getDivisionPagination',
        method: 'POST',
        body: page
    });
}

export function saveLanguageApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewLanguage',
        method: 'POST',
        body: data

    });
}

export function getLanguageListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getLanguageList',
        method: 'POST',
        body: page
    });
}
export function getLanguagePaginationApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getLanguagePagination',
        method: 'POST',
        body: page
    });
}

export function saveDistributionChannelApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addDistributionChannel',
        method: 'POST',
        body: data

    });
}

export function getDistributionChannelListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getDistributionChannelList',
        method: 'POST',
        body: page
    });
}

export function saveAccountCategoryApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewAccountCategory',
        method: 'POST',
        body: data

    });
}

export function saveActivityCategoryApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addActivityCategory',
        method: 'POST',
        body: data

    });
}


export function getAccountCategoryListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getAccountCategoryList',
        method: 'POST',
        body: page
    });
}

export function getActivityCategoryListApi(page) {
    
    return request({
        url: API_BASE_URL + '/pr/geActivityCategoryList',
        method: 'POST',
        body: page
    });
}

export function getLeftPaneCategoryApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getCategoryData",
        method: 'POST',
        body: page
    });

}

export function saveAccountSourceApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewAccountSource',
        method: 'POST',
        body: data

    });
}

export function getAccountSourceListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getAccountSourceList',
        method: 'POST',
        body: page
    });
}

export function saveTerritoryApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewTerritory',
        method: 'POST',
        body: data

    });
}

export function getTerritoryListApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getTerritoryList',
        method: 'POST',
        body: data
    });
}

export function saveFunctionApi(data) {
    return request({
        url: API_BASE_URL + '/pr/addNewFunction',
        method: 'POST',
        body: data

    });
}

export function getFunctionListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getFunctionList',
        method: 'POST',
        body: page
    });
}


export function getFunctionPaginationApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getFunctionPaginationData',
        method: 'POST',
        body: page
    });
}

export function saveUOMApi(data) {
    return request({
        url: API_BASE_URL + '/pr/saveUOM',
        method: 'POST',
        body: data

    });
}

export function getUOMListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getUOMList',
        method: 'POST',
        body: page
    });
}
export function getUOMPaginationApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getUOMPaginationData',
        method: 'POST',
        body: page
    });
}
export function saveMaterialApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/saveMaterial',
        method: 'POST',
        body: data

    });
}

export function getMaterialListApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getMaterialList',
        method: 'POST',
        body: data
    });
}



export function saveMaterialGroupApi(data) {
    return request({
        url: API_BASE_URL + '/pr/saveMaterialGroup',
        method: 'POST',
        body: data

    });
}

export function getMaterialGroupListApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getMaterialGroup',
        method: 'POST',
        body: page
    });
}

export function getMaterialGroupPaginationApi(page) {
    return request({
        url: API_BASE_URL + '/pr/getMaterialGroupPagination',
        method: 'POST',
        body: page
    });
}


export function saveOpportunityProductLineApi(data) {
    return request({
        url: API_BASE_URL + '/pr/saveOpportunityProductLine',
        method: 'POST',
        body: data

    });
}

export function getOpportunityProductLineListApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getOpportunityProductLineList',
        method: 'POST',
        body: data
    });
}

export function getPaginationListABCApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getAbcClassificationList",
        method: 'POST',
        body: page
    });

}

export function getPaginationSourceApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getSourcePaginationList",
        method: 'POST',
        body: page
    });

}

export function getPaginationCountryApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getCountryData",
        method: 'POST',
        body: page
    });

}

export function getPaginationDepartmentApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getDepartmentPaginationData",
        method: 'POST',
        body: page
    });

}

export function getPaginationDistributionApi(page) {

    return request({
        url: API_BASE_URL + "/pr/getDistributionPaginationData",
        method: 'POST',
        body: page
    });

}

export function getPriceListApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getPriceList',
        method: 'POST',
        body: data
    });
}

export function savePriceListApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/savePriceList',
        method: 'POST',
        body: data
    });
}

export function getPriceListVersionApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/getPriceListVersions',
        method: 'POST',
        body: data
    });
}

export function savePriceListVersionApi(data) {
    return request({
        url: API_BASE_URL + '/pr/savePriceListVersion',
        method: 'POST',
        body: data
    });
}

export function getCurrencyListApi(data) {
    
    return request({
        url: API_BASE_URL + '/getCurrencyList',
        method: 'POST',
        body: data
    });
}

export function saveCurrencyApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/saveCurrency',
        method: 'POST',
        body: data
    });
}

export function downloadApi(data) {

    return request({
        url: API_BASE_URL + "/download/" + data.attachmentId,
        method: 'POST',
        body: data
    });

}

export function saveMaterialPriceApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/saveMaterialPrice',
        method: 'POST',
        body: data

    });
}

export function getMaterialPricesApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getMaterialPrices',
        method: 'POST',
        body: data
    });
}

export function saveActivityTypeApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/addActivityType',
        method: 'POST',
        body: data

    });
}

export function getActivityTypeListApi(data) {
    
    return request({
        url: API_BASE_URL + '/pr/getATList',
        method: 'POST',
        body: data
    });
}
export function getUserProfileApi(data) {
    return request({
        url: API_BASE_URL + '/pr/getUserProfile',
        method: 'POST',
        body: data
    });
}
export function saveProfileApi(data) {
    return request({
        url: API_BASE_URL + '/pr/editPartner',
        method: 'POST',
        body: data
    });
}
export function submitForm(data,url) {
    return request({
        url: API_BASE_URL + url,
        method: 'POST',
        body: data
    });
}

export function submitWithParam(url,paramField) {
    
    return request({
        url: API_BASE_URL + url +'/'+ paramField,
        method: 'POST'
    });
}
export function submitWithTwoParam(url,paramField1,paramField2) {
    console.log("ur para 1-2",url,paramField1,paramField2)
    return request({
        url: API_BASE_URL + url +'/'+ paramField1 +'/'+ paramField2,
        method: 'POST'
    });
}
export function getFormList(data,url) {
    
    return request({
        url: API_BASE_URL + url,
        method: 'POST',
        body: data
    });
}
export function submitToURL(url){
    
    return request({
        url:API_BASE_URL + url,
        method:'POST' 
    })
}

export function submitToSAPURL(url){
    // console.log("url sap base url",url);
    return request({
        url:SAP_BASE_URL_VENDOR + url,
        method:'POST', 
    })
}

export function savetoServer(url,data){
    console.log("url",url)
    console.log("url and data",data)

    
    return request({
        url:`${API_BASE_URL}${url.urls}`,
        method:'POST',
        // body: data.ssData 
    })
}

export function saveServer(data,url){
    console.log("url and data",data)
    
    return request({
        url:`${API_BASE_URL}/rest/generateVehicleInvoice`,
        method:'POST',
        body: data.ssData 
    })
}


export function saveQuotation(data,url){
    
    return request({
        url:API_BASE_URL + url,
        method:'POST',
        body: data 
    })
}



export function getVehicleRegDropDown(url) {
console.log("getvechicleReg url",url);
    return request({
        url: API_BASE_URL + "/rest/getVehicleRegDropDown",
        method: 'GET',
    });
}

// export function getVehicleRegDropDown() {

//     return request({
//         url: API_BASE_URL + "",
//         method: 'GET',
//     });
// }
