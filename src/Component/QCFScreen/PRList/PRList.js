import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import {
  commonSubmitWithParam
} from "../../../Util/ActionUtil";

import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Container,
  IconButton
} from "@material-ui/core";

class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadGenerateQCF:"",
      page: 0,
      rowsPerPage: 50,
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
  handlePageChange = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  render() {
    const { page, rowsPerPage } = this.state;
    return (
      <>
        <div className="row" id="togglesidebar">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInput"
              style={{fontSize: "10px", float:"right" }}
              onKeyUp={searchTableData}
              placeholder="Search .."
            />            
          </div>
          <div className="col-12">
            <TableContainer className="mt-1">
              <Table className="my-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Enquiry No</TableCell>
                    {/* <TableCell>RFQ No</TableCell> */}
                    <TableCell>QCF No</TableCell>
                    <TableCell>Enquiry End Date</TableCell>
                    <TableCell>Buyer Name/Code</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>
                    <TableRow>
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.enquiryId}</TableCell>
                      {/* <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.rfqNo!=null?pr.rfqNo:""}</TableCell> */}
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.qcfNo!=null?pr.qcfNo:""}</TableCell>
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.bidEndDate}</TableCell>
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.createdBy?.userName+"-"+pr.createdBy?.name}</TableCell>
                     <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.code ? pr.code:this.props.prStatusList[pr.status]}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
             <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                count={this.props.prList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={this.handlePageChange}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              />
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