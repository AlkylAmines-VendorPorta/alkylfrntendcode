import React, { Suspense,lazy }  from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Registration from '../Component/Registration/Registration';
import VendorDetails from '../Component/VendorPriview/VendorDetails/VendorDetails';
import PurchaseOrderCont from '../Component/PurchaseOrder/PurchaseOrderContainer';
//import ASNReports from '../Component/ASNReports/ASNReports';
import FormNo from "../Component/FormNo/FormNo/FormNo";
import SSNReports from '../Component/SSNReports/SSNReports';
import CreateASNGateEntry from '../Component/CreateASNGateEntry/CreateASNGateEntry';
import SapSalesOrderCont from '../Component/sapsalesorder/sapsalesOrderContainer';
import ServiceOrder from '../Component/ServiceOrder/ServiceOrder';
import UserInvitation from '../Component/UserInvitation/UserInvitation';
import UserDashboard from '../Component/Dashboard/UserDashboard';
import Custom from '../Component/CustomScreen/Custom';
import VenodrDashboard from '../Component/Dashboard/VenodrDashboard';
import WorkingPage from '../Component/WorkingPage/WorkingPage';
import WorkingPageVendor from '../Component/WorkingPage/WorkingPageVendor';
import ResetPassword from '../Component/ResetPassword/ResetPassword';
import VendorApproval from '../Component/VendorApproval/VendorApproval';
import InternalUser from '../Component/InternalUser/InternalUser';
import AdvanceShipmentNoticeCont from '../Component/AdvanceShipmentNotice/AdvanceShipmentNoticeContainer';
import FormNoCont from '../Component/FormNo/FormNoContainer';
import updateCredentials from "../Component/UpdateCredentials/UpdateCredentials";
import VendorDashboardHeader from '../Component/Header/VendorDashboardHeader';
import UserDashboardHeader from '../Component/Header/UserDashboardHeader';
import MiroScreen from '../Component/MiroScreen/MiroContainer';
import PRScreen from '../Component/PRScreen/PRContainer';
import PRReport from '../Component/PRReport/PRContainer';
import ServiceScreen from '../Component/ServiceScreen/ServiceContainer';
import QCFScreen from '../Component/QCFScreen/QCFContainer/QCFContainer';
import VendorScreen from '../Component/VendorScreen/VendorContainer/VendorContainer';
import Login from '../Component/Login/Login';
import QuotationScreen from '../Component/QuotationScreen/QuotationContainer/QuotationContainer';
import VendorSelection from '../Component/PRScreen/VendorSelection/VendorSelection';
import QCFReport from '../Component/QCFScreen/QCFReport/QCFReport';
import { isEmpty } from "../Util/validationUtil";
import { TILES_URL } from "../Constants/UrlConstants";
import { base_url } from "../Util/urlUtil";
import VehicleRegistration from "../Component/VehicleRegistration/VehicleRegistration";
import GateEntryDashboard from "../Component/GateEntryDashboard/GateEntryDashboard";
import ReportVechical from "../Component/ReportVehicle/ReportVehicle";
import GateEntryRgpContainer from "../Component/GateEntryRgp/GateEntryRgpContainer";
import GateEntryRgpDetailContainer from "../Component/GateEntryRgp/GateEntryRgpDetailContainer";
import MaterialGetInContainer from "../Component/MaterialGetIn/MaterialGetInContainer";
import MaterialGetInDetailContainer from "../Component/MaterialGetIn/MaterialGetInDetailContainer";
import TankerForm from "../Component/TankerForm/TankerForm";
import userInvitation from "../Component/UserInvitation/Reducer";
import GateEntryforCommercialCont from "../Component/GateEntryforCommercial/GateEntryforCommercialContainer"
import RGPReport from "../Component/RGPReport/RGPReport"
import NRGPReport from "../Component/NRGPReport/NRGPReport"
import VendorDashboardCont from "../Component/BodyContent/VendorDashboardCont"
import ASNReportCont from "../Component/ASNReports/ASNReportCont";
import OutwardReport from "../Component/OutwardReport/OutwardReport";
import STOVehicleRegistration from "../Component/STOVehicleRegistration/STOVehicleRegistration";
import STOGateEntryDashboard from "../Component/STOGateEntryDashboard/STOGateEntryDashboard";
import ReportVechicalSTO from "../Component/ReportVechicalSTO/ReportVechicalSTO";
import ASNWithoutPO from "../Component/ASNWithoutPO/ASNWithoutPO";
import STOASN from "../Component/STOASN/STOASN";
import QCFCompare from "../Component/QCFScreen/QCFContainer/QCFContainerWithoutLoggedIn";
import PRCreation from '../Component/PRCreation/PRCreation';
import SSNApproverPendingList from '../Component/SSNApproverPendingList/SSNApproverPendingList'
import MaterialInwardReport from "../Component/MaterialInwardReport/MaterialInwardReport";
import ASNReportsWithoutPO from "../Component/ASNReportsWithoutPO/ASNReportsWithoutPO";
import AdvancePayment from "../Component/Advance Payment/AdvancePayment";
import AdvancePayApproval from "../Component/Advance Payment Approval/AdvancePayApproval";
import EarlyPaymentReport from "../Component/Early Payment Report/EarlyPaymentReport";
import AuditLogReport from "../Component/Audit Log Report/AuditLogReport";




export default function AllowRoutes() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Router basename={base_url}>
              <Switch>
                  <Route path='/' component={Login} exact />
                  <Route path='/resetpassword' component={ResetPassword} exact/>
                  <Route path='/reportVehicle' component={ReportVechical} exact/>
                  <Route path="/PRReport" component={PRReport} exact />
                  <Route path='/reportVehicleSTO' component={ReportVechicalSTO} exact/>
                  <Route path='/qcf/:id' component={QCFCompare} exact />
                  {/* <Route path='/GateEntryRgpContainer' component={GateEntryRgpContainer} />
                  <Route path='/GateEntryRgpDetailContainer' component={GateEntryRgpDetailContainer} /> */}
                  {getRoutes()}
                    {/* <Route path='/registration' component={Registration} exact />
                    <Route path='/vendorapproval' component={VendorApproval} exact />
                    <Route path='/dashboard' component={Registration} exact />
                    <Route path='/userinvitation' component={UserInvitation} exact />
                    <Route path='/userdashboard' component={UserDashboard} exact />
                    <Route path='/vendordashboard' component={VenodrDashboard} exact />
                    <Route path='/workingpage' component={WorkingPage} exact />
                    <Route path='/workingpagevendor' component={WorkingPageVendor} exact />
                    <Route path='/resetpassword' component={ResetPassword} exact />
                    <Route path='/purchaseorder' component={PurchaseOrderCont} exact />        
                    <Route path='/gateentry' component={AdvanceShipmentNoticeCont} exact />         
                    <Route path='/serviceorder' component={ServiceOrder} exact />  
                    <Route path="/vendorPreview" component={VendorDetails} exact/>  
                    <Route path="/internalUser" component={InternalUser} exact/>
                    <Route path="/updateCredentials" component={updateCredentials} />
                    <Route path="/miroScreen" component={MiroScreen} />
                    <Route path="/PRScreen" component={PRScreen} />
                    <Route path="/ServiceScreen" component={ServiceScreen} />
                    <Route path="/QCFScreen" component={QCFScreen} />
                    <Route path="/VendorScreen" component={VendorScreen} />
                    <Route path="/QuotationScreen" component={QuotationScreen} />
                    <Route path="/VStest" component={VendorSelection} /> */}
              </Switch>
      </Router>
    </Suspense>
  );
}

function getRoutes(){
  // if(!isEmpty(localStorage.getItem(TILES_URL))){
  //   // const tileComponent = lazy(() => import("../Component/Dashboard/UserDashboard"))
  //   return(
  //     // <Route path='/userdashboard' component={tileComponent} exact />
  //     JSON.parse(localStorage.getItem(TILES_URL)).map((el,i) => {
  //       if(!isEmpty(el)){
  //         // console.log(el);
  //         //let tileComponent =lazy(() => import(el[1]));
  //       return import(el[1]).then(com=>{
  //            return   <Route path={"/"+el[0]} component={com} exact />
  //        })
  //         // console.log(tileComponent);
  //         // import tileComponent from el[1];
  //       //  console.log(<Route path={"/"+el[0]} component={tileComponent} exact />)
  //           // return <Route path={"/"+el[0]} component={tileComponent} exact />
  //       }
  //     })
  //   )
  // }
  // let paths=['../Component/Dashboard/UserDashboard'];

  // return paths.map(async (el)=>  {
  //     let com = await import(el)
  //     return  <Route path={"/userDashboard"} component={com} exact />;
  // })
  
  if(!isEmpty(localStorage.getItem(TILES_URL))){
      return JSON.parse(localStorage.getItem(TILES_URL)).map((el,i) => {
        // console.log("el list switch case in routes -----",el)
        switch (el) {
          case "registration": return <Route path='/registration' component={Registration} exact key={i}/>
          case "vendorapproval": return <Route path='/vendorapproval' component={VendorApproval} exact key={i}/>
          case "dashboard": return <Route path='/dashboard' component={Registration} exact key={i}/>
          case "userInvitation": return <Route path='/userInvitation' component={UserInvitation} exact key={i}/>
          case "userdashboard": return <Route path='/userdashboard' component={UserDashboard} exact key={i}/>
          case "vendordashboard": return <Route path='/vendordashboard' component={VenodrDashboard} exact key={i}/>
          case "workingpage": return <Route path='/workingpage' component={WorkingPage} exact key={i}/>
          case "workingpagevendor": return <Route path='/workingpagevendor' component={WorkingPageVendor} exact key={i}/>
          // case "resetpassword": return <Route path='/resetpassword' component={ResetPassword} exact key={i}/>
          case "sapsalesorder": return <Route path='/sapsalesorder' component={SapSalesOrderCont} exact key={i}/>        
          case "purchaseorder": return <Route path='/purchaseorder' component={PurchaseOrderCont} exact key={i}/> 
          case "createNewGateEntry": return <Route path='/createNewGateEntry' component={CreateASNGateEntry} exact key={i}/>  
        //  case "asnreports": return <Route path='/asnreports' component={ASNReports} exact key={i}/>
          case "formno": return <Route path='/formno' component={FormNoCont} exact key={i}/>
          case "rgpReport": return <Route path='/rgpReport' component={RGPReport} exact key={i}/>
          case "nrgpReport": return <Route path='/nrgpReport' component={NRGPReport} exact key={i}/>
          case "ssnreports": return <Route path='/ssnreports' component={SSNReports} exact key={i}/>
          case "gateentry": return <Route path='/gateentry' component={AdvanceShipmentNoticeCont} exact key={i}/>         
          case "serviceorder": return <Route path='/serviceorder' component={ServiceOrder} exact key={i}/>  
          case "vendorPreview": return <Route path="/vendorPreview" component={VendorDetails} exact key={i}/>  
          case "internalUser": return <Route path="/internalUser" component={InternalUser} exact key={i}/>
          case "updateCredentials": return <Route path="/updateCredentials" component={updateCredentials} key={i}/>
          case "miroScreen": return <Route path="/miroScreen" component={MiroScreen} key={i}/>
          case "PRScreen": return <Route path="/PRScreen" component={PRScreen} key={i}/>
          case "PRReport": return <Route path="/PRReport" component={PRReport} key={i} />
          case "serviceScreen": return <Route path="/serviceScreen" component={ServiceScreen} key={i} />
          case "QCFScreen": return <Route path="/QCFScreen" component={QCFScreen} key={i} />
          case "VendorScreen": return <Route path="/VendorScreen" component={VendorScreen} key={i} />
          case "QuotationScreen": return <Route path="/QuotationScreen" component={QuotationScreen} key={i} />
          case "VStest": return <Route path="/VStest" component={VendorSelection} key={i} />
          case "custom": return <Route path='/custom' component={Custom} exact key={i}/>
          case "vehicalRegistration": return <Route path='/vehicalRegistration' component={VehicleRegistration} exact  key={i}/>
          case "gateEntryDashboard": return <Route path='/gateEntryDashboard' render={(props) => <GateEntryDashboard showSubmitButton={true} {...props} exact key={i}/>} />
          case "RGP-NRGPList": return <Route path='/RGP-NRGPList' component={GateEntryRgpContainer} exact  key={i}/>
          // case "GateEntryRgpDetailContainer": return <Route path='/RGP/NRGP' component={GateEntryRgpDetailContainer} exact  key={i}/>
          case "RGP-NRGP": return <Route path='/RGP-NRGP' component={GateEntryRgpDetailContainer} exact  key={i}/>
          case "RGPInward": return <Route path='/RGPInward' component={MaterialGetInContainer} exact  key={i}/>
          case "MaterialGetInDetailContainer": return <Route path='/MaterialGetInDetailContainer' component={MaterialGetInDetailContainer} exact  key={i}/>
          case "TankerForm": return <Route path='/TankerForm' component={TankerForm} exact  key={i}/>
          case "GateEntryforCommercial": return <Route path='/GateEntryforCommercial' component={GateEntryforCommercialCont} exact key={i}/>
          case "asnreports": return <Route path='/asnreports' component={ASNReportCont} exact key={i}/>
          case "OutwardReport": return <Route path='/OutwardReport' component={OutwardReport} exact key={i}/>
          case "VendorDashboardCont":return <Route path='/vendorDashboard' component={VendorDashboardCont} exact key={i}/>
          //  case "asnreports":return <Route path='/asnreports' component={ASNReportCont} exact key={i}/>
           case "STOVehicleRegistration":return <Route path='/STOVehicleRegistration' component={STOVehicleRegistration} exact key={i}/>
          case "STOgateEntryDashboard":return <Route path='/STOgateEntryDashboard' render={(props) => <STOGateEntryDashboard showSubmitButton={true} {...props} exact key={i}/>}/>
          case "ASNWithoutPO":return <Route path='/ASNWithoutPO' component={ASNWithoutPO} exact key={i}/>
          case "STOASN":return <Route path='/STOASN' component={STOASN} exact key={i}/>
          case "PRCreation": return <Route path='/PRCreation' component={PRCreation} exact key={i}/>  
          case "ssnApproverList": return <Route path='/ssnApproverList' component={SSNApproverPendingList} exact key={i}/>
          case "materialInwardReport": return <Route path='/materialInwardReport' component={MaterialInwardReport} exact key={i}/>
          case "asnreportswithoutpo": return <Route path='/asnreportswithoutpo' component={ASNReportsWithoutPO} exact key={i}/>
          case "AdvancePayment": return <Route path='/AdvancePayment' component={AdvancePayment} exact key={i}/>
          case "AdvancePayApproval": return <Route path='/AdvancePayApproval' component={AdvancePayApproval} exact key={i}/>
          case "EarlyPaymentReport": return <Route path='/EarlyPaymentReport' component={EarlyPaymentReport} exact key={i}/>
          case "AuditLogReport": return <Route path='/AuditLogReport' component={AuditLogReport} exact key={i}/>
      }
    })
  }else{
    return null;
  }
}