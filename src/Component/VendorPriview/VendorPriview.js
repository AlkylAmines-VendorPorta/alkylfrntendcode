import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import GeneralInformation from "../VendorPriview/GeneralInformation/GeneralInformation";
import BankDetails from '../VendorPriview/BankDetails/BankDetails';
import VendorList from '../VendorApproval/VendorList/VendorList';
import KycDetails from '../VendorPriview/KycDetails/KycDetails';
import CompanyDetails from '../VendorPriview/CompanyDetails/CompanyDetails';
import IMSDetails from '../VendorPriview/IMSDetails/IMSDetails';
import VendorApprovalMatrix from '../VendorApproval/VendorApprovalMatrix/VendorApprovalMatrix';
import { submitToURL } from "../../Util/APIUtils";
import { isEmpty } from "lodash-es";
import { formatDateWithoutTimeNewDate2 } from "../../Util/DateUtil";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, TextField, Grid,
  Button
} from "@material-ui/core";
import DataTable from "react-data-table-component";
class VendorPriview extends Component {
    constructor (props) {
        super(props)
        this.state = {
          partner:{
            partnerId: "",
            userEmail: ""
          },
          searchQuery: "",
          page: 0,
          rowsPerPage: 10,
          readonly:"",
          partners:[{
            partnerId: "",
            userEmail: ""
          }],
          history:[]
        }
      }

  async componentDidMount(){
    if(!isEmpty(this.props.partner) && this.props.partner.partnerId){
      submitToURL(`/rest/getProfileHistory/${this.props.partner.partnerId}`).then(({objectMap}) => {
        let history = !isEmpty(objectMap.history) ? objectMap.history:[]
        this.setState({history})
      }).catch(err => {
      })
    }
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
    const filteredData = this.state.history.filter((entry) =>
      Object.values(entry).some((val) =>
        val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
     const columns = [
  {
    name: 'Serial No.',
    cell: (row, index) => index + 1,
    sortable: true
  },
{
    name: 'Date',
    selector: row => row.created,
    cell: row => formatDateWithoutTimeNewDate2(row.created),
    sortable: true
  },
{
    name: 'Module',
    selector: row => row.module,
    sortable: true
  },
 {
    name: 'Field Name',
    selector: row => row.fieldName,
    sortable: true
  },
{
    name: 'Old Value',
    selector: row => row.oldValue,
    sortable: true
  },
 {
    name: 'New Value',
    selector: row => row.newValue,
    sortable: true
  }]
    return (
        <React.Fragment>
            <UserDashboardHeader/>
        <div className="" id="togglesidebar">

        <div className="modal" id="historyBox" >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">History</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body" style={{minHeight:"150px"}}>

              <div className="px-4 py-2">
          <Grid container spacing={2} alignItems="center" justify="flex-end">
            <Grid item xs={3}>
             <input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  style={{fontSize: "10px", float:"right" }}
                />
            </Grid>
          </Grid>
          <TableContainer component={Paper} className="mt-2">
            {/* <Table className="my-table">
              <TableHead>
                <TableRow>
                  <TableCell>Serial No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Field Name</TableCell>
                  <TableCell>Old Value</TableCell>
                  <TableCell>New Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate2(item.created)}</TableCell>
                    <TableCell>{item.module}</TableCell>
                    <TableCell>{item.fieldName}</TableCell>
                    <TableCell>{item.oldValue}</TableCell>
                    <TableCell>{item.newValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={50}  
              //responsive
              paginationRowsPerPageOptions={[10, 25, 50, 100]} 
              //onRowClicked={this.handleRowClick}
            />
          </TableContainer>
          {/* <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            /> */}
        </div>

              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-primary" data-dismiss="modal">Ok</button> */}
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
              
            </div>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',marginTop:"70px", marginBottom:"5px"}} >
          <Button variant="contained" color="primary" size="small" type="button"  data-toggle="modal" data-target="#historyBox" className="btn btn-primary mr-1">History</Button>
        </div>
          <GeneralInformation changeLoaderState={this.props.changeLoaderState} displayDiv="none" loadManuFacturerTab={false} showNonManufacturerTabs={this.showNonManufacturerTabs} 
            showManufacturerTabs={this.showManufacturerTabs} readonly="readonly" disabled="disabled" 
            partner={this.props.partner}/>
          <BankDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          <KycDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          <CompanyDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          {this.props.loadManuFacturerTab?<IMSDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>:<></>}
          <VendorApprovalMatrix changeLoaderState={this.props.changeLoaderState} partner={this.props.partner}/>
        </div>
        </React.Fragment>
    );
  }
}
export default VendorPriview;