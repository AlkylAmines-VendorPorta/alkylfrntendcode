import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
import {
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { isEmpty } from "../../Util/validationUtil";
import {connect} from 'react-redux';
import * as actionCreators from "./Action/Action";

class ServiceBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceMessage:""
    };
  }

  async componentWillReceiveProps(props){
    // console.log(props);
    if(!isEmpty(props.serviceDataList))
    {
      this.props.changeLoaderState(false);
      this.setState({
        serviceMessage:props.serviceDataList.message
      });
    }else{
      this.props.changeLoaderState(false);
    }
  }
  render() {
    return (
      <>
        <div className="container-fluid mt-100 w-100">
          <div className="card">
            <div className="row px-4 py-2">
              <div className="col-12">
                <div className="d-flex justify-content-center">
                  {/* <button onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitWithParam(this.props,"fetchServiceData","/rest/fetchGRNNO")}} className="btn btn-outline-info mr-2"><i class="fa fa-file"/>&nbsp;GRN No</button>
                  <button onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitWithParam(this.props,"fetchServiceData","/rest/fetchPO")}} className="btn btn-outline-info mr-2"><i class="fa fa-file"/>&nbsp;PO</button> */}
                  <button onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitWithParam(this.props,"fetchServiceData","/rest/fetchVendorData")}} className="btn btn-outline-info mr-2"><i class="fa fa-file"/>&nbsp;Vendor Data</button>
                  {/* <button onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitWithParam(this.props,"fetchServiceData","/rest/fetchPR")}} className="btn btn-outline-info mr-2"><i class="fa fa-file"/>&nbsp;Fetch PR</button> */}
                </div>
              </div>
            </div>
            <hr />
            <div className="row px-4 py-2">
              <div className="col-12">
                <h4 className="text-center">{this.state.serviceMessage}</h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.serviceDataReducer;
};
export default connect (mapStateToProps,actionCreators)(ServiceBody);
