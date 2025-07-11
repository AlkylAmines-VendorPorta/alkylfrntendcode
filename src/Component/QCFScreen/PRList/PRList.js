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
import DataTable from "react-data-table-component";

class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadGenerateQCF:"",
      page: 0,
      rowsPerPage: 50,
      searchQuery:""
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

  handleQCFDetails = (pr)=>{
    // if(!isEmpty(pr.qcfNo)){
 //alert(pr.enquiryId,"pr.enquiryId")
      this.props.loadQCFDetails(pr);
    // }
  }
  handlePageChange = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
   handleRowClick = (row) => {
    const index = this.props.prList.findIndex(v => v.enquiryId === row.enquiryId);
  this.handleQCFDetails(index);
};
handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });

  };
  render() {
    const { page, rowsPerPage } = this.state;
    const columns = [
  {
    name: 'Enquiry No',
    selector: row => row.enquiryId,
    sortable: true
  },
{
    name: 'QCF No',
    selector: row => row.qcfNo!=null?row.qcfNo:"",
    sortable: true
  },

  {
    name: 'Enquiry End Date',
    selector: row => row.bidEndDate,
    sortable: true
  },
  {
    name: 'Buyer Name/Code',
    selector: row => row.createdBy?.userName+"-"+row.createdBy?.name,
    sortable: true
  },
  {
    name: 'Status',
    selector: row => row.code ?row.code:this.props.prStatusList[row.status],
    sortable: true
  },
]

const filteredData = this.props.prList.filter((entry) =>
      Object.values(entry).some((val) =>
        val && val.toString().toLowerCase().includes(this.state.searchQuery.toLowerCase())
      )
    );
    return (
      <>
        <div className="row" id="togglesidebar">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInput"
              style={{fontSize: "10px", float:"right" }}
              onChange={this.handleSearchChange}
              placeholder="Search .."
            />            
          </div>
          <div className="col-12">
            <TableContainer className="mt-1">
              {/* <Table className="my-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Enquiry No</TableCell>
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
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.qcfNo!=null?pr.qcfNo:""}</TableCell>
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.bidEndDate}</TableCell>
                      <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.createdBy?.userName+"-"+pr.createdBy?.name}</TableCell>
                     <TableCell onClick={() => this.handleQCFDetails(pr,i)}>{pr.code ? pr.code:this.props.prStatusList[pr.status]}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table> */}
          
             {/* <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                count={this.props.prList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={this.handlePageChange}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              /> */}
              <DataTable
                          columns={columns}
                          data={filteredData}
                          pagination
                          paginationPerPage={50}  
                          paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                          onRowClicked={this.handleRowClick}
                        />
                          </TableContainer>
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