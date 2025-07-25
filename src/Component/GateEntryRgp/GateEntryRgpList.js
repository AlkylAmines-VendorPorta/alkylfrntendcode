import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, TextField,
  Grid
} from "@material-ui/core";
import Loader from "../FormElement/Loader/LoaderWithProps";
import formatDateWithoutTimeNewDate2 from "../../Util/DateUtil";
import * as actionCreators from "./Action/Action";
import { isLoading } from "../../Util/APIUtils";
import formatDate from "../../Util/DateUtil";
import DataTable from "react-data-table-component";

class GateEntryRgpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gateEntryList: [],   // Original data
      filteredList: [],    // Data after filtering
      searchQuery: "",     // Search input value
      page: 0,             // Current page for pagination
      rowsPerPage: 50,      // Number of rows per page
      isLoading:true
    };
  }

  componentDidMount() {
    this.setState({
      gateEntryList: this.props.gateEntryList,
      filteredList: this.props.gateEntryList,
    });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000); // Hides the loader after 3 seconds
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gateEntryList !== this.props.gateEntryList) {
      this.setState({
        gateEntryList: this.props.gateEntryList,
        filteredList: this.props.gateEntryList,
      });
    }
  }
  

  handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredList = this.state.gateEntryList.filter((item) =>
      Object.values(item).some(
        (val) => val && val.toString().toLowerCase().includes(searchQuery)
      )
    );
    this.setState({ searchQuery, filteredList, page: 0 });
  };

  handleChangePage = (_, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
 handleRowClick = (row) => {
      this.props.loadDetail(row);
    };
  render() {
    const { filteredList, searchQuery, page, rowsPerPage } = this.state;
    const filteredData = filteredList;
 const columns = [
  {
    name: 'Req No',
    selector: row => row.reqNo,
    sortable: true
  },
  {
    name: 'Req Date',
    selector: row => row.created,
    sortable: true,
    cell: row => formatDate(row.created),
  },
  {
    name: 'Plant',
    selector: row => row.plant,
    sortable: true
  },
  {
    name: 'Status',
    selector: row => row.status,
    sortable: true
  },
  {
    name: 'Doc Type',
    selector: row => row.docType,
    sortable: true
  },
  {
    name: 'Vendor Name',
    selector: row => row.vendorName,
    sortable: true
  },
  {
    name: 'Created By',
    selector: row => row.createdBy?.name || "",
    sortable: true
  },
  {
    name: 'Department',
    selector: row => row.createdBy?.userDetails?.department || "",
    sortable: true
  }
];
    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        <div className="wizard-v1-content" style={{marginTop:"80px"}}>
        <Grid container spacing={2} alignItems="center" justify="flex-end">
          <Grid item xs={12}>
            <input
              placeholder="Search"
              style={{fontSize: "10px", float:"right" }}
              value={searchQuery}
              onChange={this.handleSearch}
            />
          </Grid>
        </Grid>

          <TableContainer  className="mt-1">
             <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationPerPage={50}  
                  paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                  onRowClicked={this.handleRowClick}
                />
            {/* <Table className="my-table">
              <TableHead>
                <TableRow>
                  <TableCell>Req No</TableCell>
                  <TableCell>Req Date</TableCell>
                  <TableCell>Plant</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Doc Type</TableCell>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item, i) => (
                  <TableRow key={i} onClick={() => this.props.loadDetail(item)} 
                  >
                    <TableCell>{item.reqNo}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate2(item.created)}</TableCell>
                    <TableCell>{item.plant}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.docType}</TableCell>
                    <TableCell>{item.vendorName}</TableCell>
                    <TableCell>{item.createdBy?.name || ""}</TableCell>
                    <TableCell>{item.createdBy?.userDetails?.department || ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </TableContainer>

          {/* Pagination */}
          {/* <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={filteredList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
          /> */}
        </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.gateEntryRgpReducer;
};
export default connect(mapStateToProps,actionCreators)(GateEntryRgpList);