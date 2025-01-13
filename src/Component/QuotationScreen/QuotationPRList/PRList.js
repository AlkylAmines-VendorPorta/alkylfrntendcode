import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { formatDateWithoutTimeWithMonthName } from "../../../Util/DateUtil";
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
              {
                this.props.role == 'NADMIN' ? 
                <table className="table table-bordered table-header-fixed">
                <thead>
                  <tr>
                    <th>Enquiry Id</th>
                    <th>Enquiry End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>
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
              :
              <table className="table table-bordered table-header-fixed">
                <thead>
                  <tr>
                    {/* <th>PR No</th> */}
                    {/* <th>PR Type</th> */}
                    {/* <th>PR Date</th> */}
                    {/* <th>Emp. Code</th> */}
                    {/* <th>Emp. Name</th> */}
                    <th>Enquiry No</th>
                    <th>RFQ No</th>
                    <th>Status</th>
                    <th>Enquiry Date</th>
                    <th>Enquiry End Date</th>
                    <th>Buyer Code/Name</th>
                    <th>Vendor</th>
                    {/* <th>Buyer Name</th> */}
                    {/* <th>Approver</th> */}
                    {/* <th>Tech Approver</th> */}
                    
                   
                   
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>
                   {
                     return (
                      <tr onClick={() => this.props.loadPRDetails(i)} key={i}>
                      {/* <td>{pr.prNumber}</td>
                      <td>{pr.docType}</td>
                      <td>{pr.date}</td>
                      <td>{pr.requestedBy.empCode}</td>
                      <td>{pr.requestedBy.name}</td> */}
                       <td>{pr.enquiryId}</td>
                       <td>{pr.enquiry.enqNo}</td>
                       <td>{pr.enquiry.code}</td>
                       <td>{formatDateWithoutTimeWithMonthName(pr.created)}</td>
                       <td>{pr.bidEndDate}</td>
                      <td>{pr.enquiry.createdBy.userName+"-"+pr.enquiry.createdBy.name}</td>
                      <td>{pr.partner.vendorSapCode+"-"+pr.partner.name}</td>
                      {/* <td>{pr.buyer.name}</td>
                      <td>{pr.approvedBy.name}</td>
                      <td>{pr.tcApprover.name}</td> */}
                      
                     
                     
                    </tr>
                     )
                   }
                  )}
                </tbody> 
              </table>
              }
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
export default PRList;