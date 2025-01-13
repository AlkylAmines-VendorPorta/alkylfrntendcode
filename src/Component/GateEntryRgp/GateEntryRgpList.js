import React, { Component } from "react";
import { searchTableData} from "../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { connect } from "react-redux";
import formatDateWithoutTimeWithMonthName from "../../Util/DateUtil"
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
        <div className="row px-4 py-2">
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
                    <th>Req Date</th>
                    <th>Plant</th>
                    <th>Status</th>
                    <th>Doc Type</th>
                    <th>Vendor Name</th> 
                    <th>Created By</th>
                    <th>Department</th>
                    {/* <th>Buyer Name</th>
                    <th>Approver</th>
                    <th>Tech Approver</th>
                    <th>Status</th> */}
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.gateEntryList.map((item, i) =>
                    <tr onClick={()=>this.props.loadDetail(item)}>
                      <td>{item.reqNo }</td>
                      <td>{formatDateWithoutTimeWithMonthName(item.created)}</td>
                      <td>{item.plant}</td>
                      <td>{item.status}</td>
                      <td>{item.docType}</td>
                      <td>{item.vendorName}</td>
                      <td>{item.createdBy==null?"":item.createdBy.name}</td>
                      <td>{item.createdBy.userDetails==null?"":item.createdBy.userDetails.department}</td>
                     
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
  return state.gateEntryRgpReducer;
};
export default connect(mapStateToProps,actionCreators)(GateEntryRgpList);