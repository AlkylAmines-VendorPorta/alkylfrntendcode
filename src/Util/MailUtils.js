import {API_BASE_URL} from '../Constants';
import {request} from '../Util/APIUtils';

export function sendMailForOrderApi(body) {
    
    return request({
        url: API_BASE_URL + "/pr/sendMail",
        method: 'POST',
        body: body
    });

}

export function getMailListApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/getMail",
        method: 'POST',
        body: data
    });

}

export function sendMailForQuotesApi(body) {
    
    return request({
        url: API_BASE_URL + "/pr/sendQuotesMail",
        method: 'POST',
        body: body
    });

}

export function getMailQuotesListApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/getQuotesMail",
        method: 'POST',
        body: data
    });

}

export function sendMailForLeadApi(body) {
    
    return request({
        url: API_BASE_URL + "/pr/sendLeadMail",
        method: 'POST',
        body: body
    });

}

export function getMailLeadListApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/getLeadMailList",
        method: 'POST',
        body: data
    });

}

export function sendMailForOpportunityApi(body) {
    
    return request({
        url: API_BASE_URL + "/pr/sendOpportunityMail",
        method: 'POST',
        body: body
    });

}

export function getMailOpportunityListApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/getOpportunityMailList",
        method: 'POST',
        body: data
    });

}

export function getInboxMailApi(data) {
    
    return request({
        url: API_BASE_URL + "/pr/getInboxMail",
        method: 'POST',
        body: data
    });

}

export function sendPdfForMailApi(body) {
    
    return request({
        url: API_BASE_URL + "/pr/getQuotesPdfForMail",
        method: 'POST',
        body: body
    });

}