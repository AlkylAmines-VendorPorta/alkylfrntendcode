import React, { Component } from "react";
import UserDashboardHeader from "./../Header/UserDashboardHeader";
import "../../css/dashboard.css";
export default class WorkingPage extends Component {
  render() {
    return (
     <React.Fragment> 
       <div className="page-content">
       <div className="wizard-v1-content">
         <UserDashboardHeader/>
        <h1 className="text-center p-3">Work In Progress</h1> 
        </div>   
        </div>
     </React.Fragment>   
    );
  }
}
