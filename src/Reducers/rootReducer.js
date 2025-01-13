import { combineReducers } from 'redux';
import login from '../Component/Login/Reducer/LoginReducer';
import generalInfo from "../Component/Registration/GeneralInformation/Reducer";
import associateCompanyInfo from "../Component/Registration/CompanyDetails/Reducer";
import bankDetails from "../Component/Registration/BankDetails/Reducer";
import imsInfo from "../Component/Registration/IMSDetails/Reducer";
import kycInfo from "../Component/Registration/KycDetails/Reducer";
import vendorApproval from "../Component/VendorApproval/VendorApprovalMatrix/Reducer";
import userInvitation from "../Component/UserInvitation/Reducer";
import asnreports from "../Component/ASNReports/Reducer";
import ssnreports from "../Component/SSNReports/Reducer";
import formNo from "../Component/FormNo/FormNo/Reducer";
import formNoContReducer from "../Component/FormNo/Reducer";
import resetPassword from "../Component/ResetPassword/ResetReducer";
import registration from "../Component/Registration/Reducer";
import vendorListInfo from "../Component/VendorApproval/VendorList/Reducer";
import loadingReducer from '../Component/FormElement/Loader/LoaderReducer';
import poReducer from '../Component/PurchaseOrder/Reducer';
import createNewGateEntry from '../Component/CreateASNGateEntry/Reducer';
import createNewASNGateEntry from '../Component/CreateASNGateEntry/createASNGateEntry/Reducer';
import ssoReducer from '../Component/sapsalesorder/Reducer'
import purchaseOrderLineInfo from "../Component/PurchaseOrder/PurchaseOrder/Reducer";
import SapSalesOrderLineInfo from "../Component/sapsalesorder/sapsalesOrder/Reducer"
import asnReducer from "../Component/AdvanceShipmentNotice/AdvanceShipmentNotice/Reducer"
import asnContReducer from "../Component/AdvanceShipmentNotice/Reducer"
import dashboardHeaderRed from "../Component/Header/Reducer";
import updateCredentials from "../Component/UpdateCredentials/Reducer";
import UserInvitation from '../Component/UserInvitation/UserInvitation';
import internalUserInfo from "../Component/InternalUser/Reducer";
import miroReducer from "../Component/MiroScreen/Reducer";
import invoiceReducer from "../Component/MiroScreen/InvoiceList/Reducer";
import serviceDataReducer from "../Component/ServiceScreen/Reducer/Reducer";
import userDashBoardMainReducer from "../Component/BodyContent/Reducer";
import prReducer from "../Component/PRScreen/Reducer/Reducer";
import prBodyReducer from "../Component/PRScreen/PRBody/Reducer/Reducer";
import prLineBuyerReducer from "../Component/PRScreen/PRList/Reducer/Reducer";
import qbvReducer from "../Component/QuotationScreen/QuotationContainer/Reducer/Reducer";
import qcfReducer from "../Component/QCFScreen/QCFContainer/Reducer/Reducer";
import vendorReducer from "../Component/VendorScreen/VendorContainer/Reducer/Reducer";
import vendorSelection from "../Component/PRScreen/VendorSelection/Reducer/Reducer";
import prEnquiryReducer from "../Component/PRScreen/Enquiry/Reducer/Reducer";
import prUserInvitation from "../Component/PRScreen/VendorSelection/PRUserInvitation/Reducer/Reducer";
import vendorListReducer from "../Component/VendorScreen/VendorList/Reducer/Reducer";
import vendorBodyReducer from "../Component/VendorScreen/VendorBody/Reducer/Reducer";
import qbvBodyReducer from "../Component/QuotationScreen/QuotationBody/Reducer/Reducer";
import quotationByVendorReducer from "../Component/QuotationScreen/QuotationByVendor/Reducer/Reducer";
import qcfBodyReducer from "../Component/QCFScreen/QCFBody/Reducer/Reducer";
import qcfSummary from "../Component/QCFScreen/QCFSummary/Reducer/Reducer";
import qcfPRListReducer from "../Component/QCFScreen/PRList/Reducer/Reducer";
import qcfAnnexure from "../Component/QCFScreen/QCFAnnexure/Reducer/Reducer";
import vendorListForQuotationReducer from "../Component/QuotationScreen/VendorList/Reducer/Reducer";
import qcfCompareReducer from "../Component/QCFScreen/QCFAnnexure/Reducer/Reducer";
import qcfReportReducer from "../Component/QCFScreen/QCFReport/Reducer/Reducer";
import vehicleRegistrationReducer from "../Component/VehicleRegistration/Reducer/Reducer";
import gateEntryDashboardReducer from "../Component/GateEntryDashboard/Reducer/Reducer";
import reportVehicleReducer from "../Component/ReportVehicle/Reducer";
import custom from "../Component/CustomScreen/Reducer/index";
import gateEntryRgpReducer from "../Component/GateEntryRgp/Reducer/Reducer";
import materialGetInReducer from "../Component/MaterialGetIn/Reducer/Reducer"
import tankerForm from '../Component/TankerForm/Reducer';
import nrgpReport from "../Component/NRGPReport/Reducer"
import rgpReport from "../Component/RGPReport/Reducer"
import newheader from '../Component/NewHeader/Reducer';
import asngateentryReducer from '../Component/GateEntryforCommercial/GateEntryforCommercial/Reducer'
import gateEntryforCommercialContReducer from '../Component/GateEntryforCommercial/Reducer'
import OutwardReportReducer from '../Component/OutwardReport/Reducer';
import STOVehicleRegistration from "../Component/STOVehicleRegistration/Reducer"
import STOgateEntryDashboardReducer from "../Component/STOGateEntryDashboard/Reducer"
import reportVehicleSTOReducer from "../Component/ReportVechicalSTO/Reducer"
import ASNWithoutPO from "../Component/ASNWithoutPO/Reducer"
import STOASN from "../Component/STOASN/Reducer"
import PRCreationCont from "../Component/PRCreation/PRCreation/Reducer"
import createNewPR from "../Component/PRCreation/Reducer"
import ssnapproverlist from "../Component/SSNApproverPendingList/Reducer"
import materialInwardReport from "../Component/MaterialInwardReport/Reducer"
import asnReportsWithoutPO from "../Component/ASNReportsWithoutPO/Reducer"
import advancePayment from "../Component/Advance Payment/Reducer"
import advancePayApproval from "../Component/Advance Payment Approval/Reducer"
import paymentreports from '../Component/Early Payment Report/Reducer';
import auditlogreports from '../Component/Audit Log Report/Reducer';

export default combineReducers({
        login,
        createNewGateEntry,
        createNewASNGateEntry,
        generalInfo,
        associateCompanyInfo,
        bankDetails,
        imsInfo,         
        kycInfo,
        vendorApproval,
        userInvitation, 
        asnreports,
        formNo,
        formNoContReducer,
        gateEntryforCommercialContReducer,
        ssnreports,
        nrgpReport,
        registration,
        resetPassword,
        vendorListInfo,
        loadingReducer,
        poReducer,
        ssoReducer,
        SapSalesOrderLineInfo,
        purchaseOrderLineInfo,
        asnReducer,
        asnContReducer,
        dashboardHeaderRed,
        updateCredentials,
        internalUserInfo,
        miroReducer,
        invoiceReducer,
        serviceDataReducer,
        userDashBoardMainReducer,
        prReducer,
        prBodyReducer,
        qbvReducer,
        qcfReducer,
        vendorSelection,
        prEnquiryReducer,
        vendorReducer,
        prUserInvitation,
        vendorListReducer,
        vendorBodyReducer,
        qbvBodyReducer,
        quotationByVendorReducer,
        qcfBodyReducer,
        qcfSummary,
        qcfPRListReducer,
        qcfAnnexure,
        vendorListForQuotationReducer,
        qcfCompareReducer,
        qcfReportReducer,
        prLineBuyerReducer,
        vehicleRegistrationReducer,
        gateEntryDashboardReducer,
        reportVehicleReducer,
        custom,
        gateEntryRgpReducer,
        materialGetInReducer,
        tankerForm,
        newheader,
        asngateentryReducer,
        OutwardReportReducer,
        STOVehicleRegistration,
        STOgateEntryDashboardReducer,
        reportVehicleSTOReducer,
        ASNWithoutPO,
        STOASN,
        PRCreationCont,
        createNewPR,
        rgpReport,
        ssnapproverlist,
        materialInwardReport,
        asnReportsWithoutPO,
        advancePayment,
        advancePayApproval,
        paymentreports,
        auditlogreports
})