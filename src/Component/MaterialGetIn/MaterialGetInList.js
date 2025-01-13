import React, { Component } from "react";
import { searchTableData} from "../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
class GateEntryRgpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gateEntryList:[]
    };
  }
  render() {
    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        <div className="row px-4 py-2" id="togglesidebar">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInput"
              className="form-control"
              onKeyUp={searchTableData}
              placeholder="Search .."
            />
          </div>
          <div className="col-12">
            <StickyHeader height={450} className="table-responsive mt-2">
              <table className="table table-bordered table-header-fixed">
                <thead>
                  <tr>
                    <th>Req No</th>
                    <th>Doc No</th>
                    <th>Vendor Name</th>
                    <th>Po No</th>
                    <th>Remark</th>
                    <th>Status</th>
                    <th>Doc Type</th>
                    {/* <th>Buyer Name</th>
                    <th>Approver</th>
                    <th>Tech Approver</th>
                    <th>Status</th> */}
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.gateEntryList.map((item, i) =>
                    <tr onClick={()=>this.props.loadDetail(item)}>
                      <td>{item.gateEntry.reqNo }</td>
                      <td>{item.docNo}</td>
                      <td>{item.gateEntry.vendorName}</td>
                      <td>{item.gateEntry.poNo}</td>
                      <td>{item.gateEntry.remark}</td>
                      <td>{item.status}</td>
                      <td>{item.gateEntry.docType}</td>
                      {/* <td>{pr.buyer.name}</td>
                      <td>{pr.approvedBy.name}</td>
                      <td>{pr.tcApprover.name}</td>
                      <td>{this.props.prStatusList[pr.status]}</td> */}
                    </tr>
                  )}
                </tbody>
              </table>
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.materialGetInReducer;
};
export default connect(mapStateToProps,actionCreators)(GateEntryRgpList);