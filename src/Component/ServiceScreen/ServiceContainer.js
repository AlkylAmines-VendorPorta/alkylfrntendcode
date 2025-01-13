import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import ServiceBody from "./ServiceBody";
import Loader from "../FormElement/Loader/LoaderWithProps";

class PRContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false
    };
  }

  changeLoaderState = (action) =>{
    this.setState({
      isLoading:action
    });
  }

  render() {

    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        <UserDashboardHeader />
        <ServiceBody changeLoaderState={this.changeLoaderState}/>
      </>
    );
  }
}
export default PRContainer;