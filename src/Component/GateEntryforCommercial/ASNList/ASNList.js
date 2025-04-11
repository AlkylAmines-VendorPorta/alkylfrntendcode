import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { TableContainer } from "@material-ui/core";

class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 50,
    };
  }

  componentWillReceiveProps= props=>{
    
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  render() {
    const {  page, rowsPerPage } = this.state;
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
              style={{fontSize: "10px", float:"right" }}
            />
          </div>
          <div className="col-12">
            <TableContainer>
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
                  {this.props.prList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pr, i) =>
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
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={this.props.prList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                  />
              </TableContainer>
          </div>
        </div>
      </>
    );
  }
}
export default PRList;