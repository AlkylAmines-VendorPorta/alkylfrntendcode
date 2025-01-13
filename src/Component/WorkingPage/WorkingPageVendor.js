import React, { Component } from "react";
import VendorDashboardHeader from "./../Header/VendorDashboardHeader";
import "../../css/dashboard.css";
export default class WorkingPageVendor extends Component {
  render() {
    return (
     <React.Fragment> 
       <div className="page-content">
       <div className="wizard-v1-content">
         <VendorDashboardHeader/>
        <h1 className="text-center p-3">Work In Progress</h1> 
        </div>   
        </div>
     </React.Fragment>   
    );
  }
}
