import React, {Suspense} from 'react';
import { BrowserRouter, Route,  Switch } from 'react-router-dom';
import { base_url } from "../Util/urlUtil";
import Login from '../Component/Login/Login';
import Registration from '../Component/Registration/Registration';
import QCFContainerWithoutLoggedIn from '../Component/QCFScreen/QCFContainer/QCFContainerWithoutLoggedIn';

// import VendorDetails from '../Component/VendorPriview/VendorDetails/VendorDetails';
// import PurchaseOrderCont from '../Component/PurchaseOrder/PurchaseOrderContainer';
// import ServiceOrder from '../Component/ServiceOrder/ServiceOrder';
// import UserInvitation from '../Component/UserInvitation/UserInvitation';
// import UserDashboard from '../Component/Dashboard/UserDashboard';
// import VenodrDashboard from '../Component/Dashboard/VenodrDashboard';
// import WorkingPage from '../Component/WorkingPage/WorkingPage';
// import WorkingPageVendor from '../Component/WorkingPage/WorkingPageVendor';
// import ResetPassword from '../Component/ResetPassword/ResetPassword';
// import VendorApproval from '../Component/VendorApproval/VendorApproval';
// import InternalUser from '../Component/InternalUser/InternalUser';
// import AdvanceShipmentNoticeCont from '../Component/AdvanceShipmentNotice/AdvanceShipmentNoticeContainer';
// import updateCredentials from "../Component/UpdateCredentials/UpdateCredentials";
// import VendorDashboardHeader from '../Component/Header/VendorDashboardHeader';
// import UserDashboardHeader from '../Component/Header/UserDashboardHeader';
// import MiroScreen from '../Component/MiroScreen/MiroContainer';
// import PRScreen from '../Component/PRScreen/PRContainer';
// import ServiceScreen from '../Component/ServiceScreen/ServiceContainer';
import AllowRoutes from "./AllowRoutes";
import { isUserAuthenticated } from "../Util/CommonUtil";
export default () => (
    <BrowserRouter basename={base_url}>
        {/* <VendorDashboardHeader/> */}
        
        <div>
            {/* <Route path='/' component={Login} exact /> */}
            {validateSession()}
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
            <Route path="/vendorPreview"  component={VendorDetails} exact/>  
            <Route path="/internalUser"  component={InternalUser} exact/>
            <Route path="/updateCredentials"  component={updateCredentials} />
            <Route path="/miroScreen"  component={MiroScreen} />
            <Route path="/PRScreen"  component={PRScreen} />
            <Route path="/ServiceScreen"  component={ServiceScreen} /> */}
        </div>
    </BrowserRouter>
);

function validateSession(){
    if(isUserAuthenticated()){
        return (
            <AllowRoutes/>
        )
    }
    else{
     //   return ( <Route path='/' component={Login} exact />)
       return(  <Suspense fallback={<div>Loading...</div>}>       
                 <Switch>
                      <Route path='/' component={Login} exact />
                     <Route path='/qcf/:id' component={QCFContainerWithoutLoggedIn} exact /> 
                  </Switch> 
         </Suspense>)
        
    }
}