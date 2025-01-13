import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./Action";
//import AdvanceShipmentNoticeLeftPane from "./AdvanceShipmentNoticeLeftPane";
import ASNReportContainerRightPane from "./ASNReportContainerRightPane";
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import Loader from "../FormElement/Loader/LoaderWithProps";
class ASNReportCont extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
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
      {/* <Loader isLoading={this.state.isLoading} />
      {window.location.href.endsWith("gateentry")?<UserDashboardHeader/>:<VendorDashboardHeader/>} */}
      
      <div className="page-content">
        <div className="wizard-v1-content mt-100">
          {/* <AdvanceShipmentNoticeLeftPane /> */}
          <ASNReportContainerRightPane changeLoaderState={this.changeLoaderState}/>
        </div>
      </div>
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.asnReports;
};
export default connect (mapStateToProps,actionCreators)(ASNReportCont);