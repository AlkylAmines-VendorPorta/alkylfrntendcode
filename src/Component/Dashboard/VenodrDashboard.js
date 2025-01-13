import React, { Component } from "react";
import VendorDashboardHeader from "./../Header/VendorDashboardHeader";
import VendorDashboardMainBody from "../BodyContent/VendorDashboardMainBody";
import VendorDashboardCont from "../BodyContent/VendorDashboardCont";
import "../../css/dashboard.css";
export default class VendorDashboard extends Component {
  render() {
    return (
     <React.Fragment> 
         <VendorDashboardHeader/>
         <VendorDashboardCont />
        <h1></h1>    
     </React.Fragment>   
    );
  }
}
