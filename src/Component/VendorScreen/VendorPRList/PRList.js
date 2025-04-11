import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";

class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps= props=>{
    
  }

  render() {
    return (
      <>
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
              <table className="my-table">
                <thead>
                  <tr>
                    <th>PR No</th>
                    <th>PR Type</th>
                    <th>PR Date</th>
                    <th>Emp. Code</th>
                    <th>Emp. Name</th>
                    <th>Buyer Code</th>
                    <th>Buyer Name</th>
                    <th>Approver</th>
                    <th>Tech Approver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>
                    <tr onClick={() => this.props.loadPRDetails(i)}>
                      <td>{pr.prNumber}</td>
                      <td>{pr.docType}</td>
                      <td>{pr.date}</td>
                      <td>{pr.requestedBy.empCode}</td>
                      <td>{pr.requestedBy.name}</td>
                      <td>{pr.buyer.empCode}</td>
                      <td>{pr.buyer.name}</td>
                      <td>{pr.approvedBy.name}</td>
                      <td>{pr.tcApprover.name}</td>
                      <td>{this.props.prStatusList[pr.status]}</td>
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
export default PRList;