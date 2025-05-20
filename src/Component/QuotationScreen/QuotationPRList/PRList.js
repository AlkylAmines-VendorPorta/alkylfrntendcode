import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { formatDateWithoutTimeWithMonthName } from "../../../Util/DateUtil";
import { TableContainer, TablePagination } from "@material-ui/core";
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
        <div className="row">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInput"
              onKeyUp={searchTableData}
              placeholder="Search .."
              style={{fontSize: "10px", float:"right" }}
            />
          </div>
          <div className="col-12">
          <TableContainer>
              {
                this.props.role == 'NADMIN' ? 
                <><table className="my-table">
                <thead>
                  <tr>
                    <th>Enquiry Id</th>
                    <th>Enquiry End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pr, i) =>
                   {
                     return (
                      <tr onClick={() => this.props.loadPRDetails(i)} key={i}>
                      <td>{pr.enquiryId}</td>
                      <td>{pr.created}</td>
                      <td>{pr.code}</td>
                    </tr>
                     )
                   }
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
              </>
              :
              <>
              <table className="my-table">
                <thead>
                  <tr>
                    <th>Enquiry No</th>
                    <th>RFQ No</th>
                    <th>Status</th>
                    <th>Enquiry Date</th>
                    <th>Enquiry End Date</th>
                    <th>Buyer Code/Name</th>
                    <th>Vendor</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pr, i) =>
                   {
                     return (
                      <tr onClick={() => this.props.loadPRDetails(i)} key={i}>
                       <td>{pr.enquiryId}</td>
                       <td>{pr.saprfqno}</td>
                       <td>{pr.enquiry.code}</td>
                       <td>{formatDateWithoutTimeWithMonthName(pr.created)}</td>
                       <td>{pr.bidEndDate}</td>
                      <td>{pr.enquiry.createdBy.userName+"-"+pr.enquiry.createdBy.name}</td>
                      <td>{pr.partner.vendorSapCode+"-"+pr.partner.name}</td>
                   
                    </tr>
                     )
                   }
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
              </>
              }
            </TableContainer>
          </div>
        </div>
      </>
    );
  }
}
export default PRList;