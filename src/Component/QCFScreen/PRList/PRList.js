import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import {
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadGenerateQCF:""
    };
  }

  componentWillReceiveProps= props=>{
  

  }

  generateQCF=(i)=>{
    let pr=this.props.prList[i];
    this.setState({
      loadGenerateQCF:true
    })
    commonSubmitWithParam(this.props,"generateQCF","/rest/generateQCF",pr.prId ? pr.prId:pr.enquiryId);
  }

  handleQCFDetails = (pr,i)=>{
    // if(!isEmpty(pr.qcfNo)){
      this.props.loadQCFDetails(i);
    // }
  }

  render() {

    return (
      <>
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
                    {/* <th>PR No</th>
                    <th>PR Type</th>
                    <th>PR Date</th> */}
                    <th>Enquiry No</th>
                    <th>RFQ No</th>
                    <th>QCF No</th>
                    <th>Enquiry End Date</th>
                    <th>Buyer Name/Code</th>
                    {/* <th>Emp. Code</th>
                    <th>Emp. Name</th>
                    <th>Buyer Code</th>
                    <th>Buyer Name</th> */}
                    {/* <th>Approver</th>
                    <th>Tech Approver</th> */}
                    <th>Status</th>
                    {/* <th>Generate QCF</th> */}
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>
                    <tr>
                      {/* <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.prNumber}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.docType}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.date}</td> */}
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.enquiryId}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.rfqNo!=null?pr.rfqNo:""}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.qcfNo!=null?pr.qcfNo:""}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.bidEndDate}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.createdBy?.userName+"-"+pr.createdBy?.name}</td>
                      {/* <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.requestedBy.name}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.buyer.empCode}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.buyer.name}</td> */}
                      {/* <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.approver.name}</td>
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.tcApprover.name}</td> */}
                      <td onClick={() => this.handleQCFDetails(pr,i)}>{pr.code ? pr.code:this.props.prStatusList[pr.status]}</td>
                      {/* {isEmpty(pr.qcfNo)?
                          <td className="w-10per"> <button type="button" onClick={()=>this.generateQCF(i)} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" /></button> </td>
                        :
                          <td>Already Generated!</td>
                      } */}
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
  return state.qcfPRListReducer;
};
export default connect(mapStateToProps,actionCreators)(PRList);