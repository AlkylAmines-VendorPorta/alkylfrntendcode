import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Grid,
} from "@material-ui/core";
import Loader from "../FormElement/Loader/LoaderWithProps";

class GateEntryRgpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      isLoading:true
    };
  }
 componentDidMount() {    
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000); // Hides the loader after 3 seconds
  }
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };

  render() {
    const { searchQuery, page, rowsPerPage } = this.state;
    const filteredData = this.props.gateEntryList.filter((item) =>
      Object.values(item.gateEntry).some((value) =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return (
      <>
        <Loader isLoading={this.state.isLoading} />
        <Grid container spacing={2} alignItems="center" justify="flex-end">
          <Grid item xs={9} style={{textAlign:"left"}}></Grid>
          <Grid item xs={3}>
          <input
              placeholder="Search"
              style={{fontSize: "10px", float:"right" }}
              onChange={this.handleSearchChange}
            />
          </Grid>
        </Grid>
        <TableContainer >
          <Table  className="my-table">
            <TableHead>
              <TableRow>
                <TableCell>Req No</TableCell>
                <TableCell>Doc No</TableCell>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Po No</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Doc Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, i) => (
                  <TableRow
                    key={i}
                    hover
                    onClick={() => this.props.loadDetail(item)}
                    
                  >
                    <TableCell>{item.gateEntry.reqNo}</TableCell>
                    <TableCell>{item.docNo}</TableCell>
                    <TableCell>{item.gateEntry.vendorName}</TableCell>
                    <TableCell>{item.gateEntry.poNo}</TableCell>
                    <TableCell>{item.gateEntry.remark}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.gateEntry.docType}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100, 150]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.materialGetInReducer;
};

export default connect(mapStateToProps, actionCreators)(GateEntryRgpList);
