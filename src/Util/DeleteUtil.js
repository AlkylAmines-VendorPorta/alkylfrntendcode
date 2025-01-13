import {API_BASE_URL} from '../Constants';
import {request} from '../Util/APIUtils';



export function deleteClassificationApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteAbcClassification/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteAccountCategoryApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteCategory/" + Id,
        method: 'POST',
        body: Id
    });

}


export function deleteAccountSourceApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteAccSource/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteActivityTypeApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteActivityType/" + Id,
        method: 'POST',
        body: Id
    });

}
export function deleteActivityCategoryApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteActivityCategory/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteRoleAccessMasterApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteRoleAccessMaster/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteCampaignApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteCampaign/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteCountryApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deletecountry/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteCurrencyApi(Id) {
    
    return request({
        url: API_BASE_URL + "/deleteCurrency/" + Id,
        method: 'POST',
        body: Id
    });

}


export function deleteDepartmentApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteDepartment/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteDistributionApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteDistribution/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteDivisionApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteDivision/" + Id,
        method: 'POST',
        body: Id
    });

}

export function deleteForecastCategoryApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteForecastCategory/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteFunctionApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteFunction/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteHSNApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteHSN/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteLanguageApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteLanguage/" + Id,
        method: 'POST',
        body: Id
    });
}
export function deleteMaterialGrpApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteMaterialGrp/" + Id,
        method: 'POST',
        body: Id
    });
}


export function deletePaymentTermsApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deletePaymentTerms/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteQualificationLevelApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteQualificationLevel/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteSalesPhaseApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteSalesPhase/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteSalesCycleApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteSalesCycle/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteSalesUnitApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteSalesUnit/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteStateApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteState/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteTerritoryApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteTerritory/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteUOMApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteUOM/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteReferenceApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteReference/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteReferenceListApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteReferenceList/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteMaterialApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteMaterial/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteMaterialPriceApi(Id) {
    
    return request({
        url: API_BASE_URL + "/deleteMaterialPrice/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deletePriceListApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deletePriceList/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deletePriceListVersionApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deletePriceListVersion/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteEmployeeApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pu/deleteUser/" + Id,
        method: 'POST',
        body: Id
    });
}

export function deleteAccountApi(Id) {
    
    return request({
        url: API_BASE_URL + "/pr/deleteAccount/" + Id,
        method: 'POST',
        body: Id
    });
}