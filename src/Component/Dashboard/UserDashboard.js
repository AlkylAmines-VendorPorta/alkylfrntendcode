import React, { Component } from "react";
import UserDashboardHeader from "./../Header/UserDashboardHeader";
import UserDashboardMainBody from "../BodyContent/UserDashboardMainBody";
import "../../css/dashboard.css";
export default class UserDashboard extends Component {
  render() {
    return (
     <React.Fragment> 
        <UserDashboardHeader/>
        <UserDashboardMainBody />
     </React.Fragment>   
    );
  }
}
