import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./Action";
import StickyHeader from "react-sticky-table-thead";
import "./../ASNReports/user.css";
import {
  commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { getIFSCDetails } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { useState } from "react"
import axios from 'axios';
import { formatDate1 } from "./../../Util/DateUtil";
import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto } from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import formatDate from '../../Util/DateUtil';
import ReportVechicle from "../ReportVehicle/ReportVehicle";
import { Button, Container, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@material-ui/core";
import DataTable from "react-data-table-component";

class OutwardReport extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
      isLoading: false,
      outwardReportlist: [],
      asnStatusList:[],
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
      outwardDetails: {
        salesOrderNoFrom: "",
        salesOrderNoTo: "",
        requestNoFrom: "",
        requestNoTo: "",
        plant: "",
        requestDateFrom: "",
        requestDateTo: "",
        status: "",
        freightScope: ""
      },
      loadReportVehicle: false,
      vehicleRegCustId: "",
      OutwardReportdisplay:true

    }
  }

  async componentDidMount() {
   // commonSubmitForm(this.props, "asnResponse", "/rest/getASNReport", "reports")
    commonSubmitWithParam(this.props, "asnStatusResponse", "/rest/getASNStatusList");
  }

  async componentWillReceiveProps(props) {

    if (!isEmpty(props.loaderState)) {
      this.changeLoaderState(props.loaderState);
    }

    

      if(!isEmpty(props.asnStatusList)){
        let asnStatusListArray = Object.keys(props.asnStatusList).map((key) => {
          return {display: props.asnStatusList[key], value: props.asnStatusList[key]}
        });
     
        this.setState({
          asnStatusList: [...asnStatusListArray]
          })
      }
    

    if (!isEmpty(props.outwardReportlist)) {
      this.changeLoaderState(false);
      this.setState({
        AsnList: this.state.props.outwardReportlist
      })
    } else {
      this.changeLoaderState(false);
    }

    if (!isEmpty(props.outwardDetails)) {
      this.changeLoaderState(false);
      this.setState({

        outwardDetails: {
        salesOrderNoFrom: "",
        salesOrderNoTo: "",
        requestNoFrom: "",
        requestNoTo: "",
        plant: "",
        requestDateFrom: "",
        requestDateTo: "",
        status: "",
        freightScope: ""
        }
      })
    }

  }


  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  
  getStatusFullForm = (asn) => {
    // console.log("item",item);
    let type = asn.status.toUpperCase();
    // console.log("tye",type)
    switch(type){
      case 'CR':
        return "Created";
      case 'RG':
        return "Register";
      case 'RP':
        return "Vehicle Reported";
      case 'VGI':
        return "Vehicle Gate IN";
      case 'VGO':
        return "Vehicle Gate Out";
      default:
      return  '';
    }
  }

  clearFields=()=>{
    this.setState({
      outwardDetails: {
        salesOrderNoFrom: "",
        salesOrderNoTo: "",
        requestNoFrom: "",
        requestNoTo: "",
        plant: "",
        requestDateFrom: "",
        requestDateTo: "",
        status: "",
        freightScope: ""
      },
    })
}
  handleFilterClick = () => {
    this.props.onFilter && this.props.onFilter();
    this.setState({ formDisplay: !this.state.formDisplay });
    this.setState({ searchDisplay: !this.state.searchDisplay });
  }

  // handleSearchClick = () => {

  //   if (this.state.outwardDetails.requestNoFrom != "" || this.state.outwardDetails.salesOrderNoFrom != "" || this.state.outwardDetails.requestDateFrom != "" || this.state.outwardDetails.status!='' || this.state.outwardDetails.freightScope!=""|| this.state.outwardDetails.plant!="") {
    
  //     this.isLoading.hidden = true;

  //   } else {

  //     window.alert('Please Enter One of Above Value')
  //     this.changeLoaderState = false;
  //     return false;
  //   }
  // }

   exportReportToExcel() {
    TableToExcel.convert(document.getElementById("table1"));
  }

  getinoutTimeDifference(startDate,endDate){

    let timespan=""; 
    var now  = startDate;
    var then = endDate;
    var ms = moment(now,"yyyy/MM/dd HH:mm:ss").diff(moment(then,"yyyy/MM/dd HH:mm:ss"));
    var d = moment.duration(ms);
    timespan=d.days()+ " Days " + ':' + d.hours().toString().replace(/-/g, '') + " Hours "+' : ' + d.minutes().toString().replace(/-/g, '')+ " Minutes " + ':' + d.seconds().toString().replace(/-/g, '') +" Seconds";
    //var diff = moment.duration(moment(then).diff(moment(now)));
    //timespan = diff.get("days").toString().padStart(2, '0')+" Days "+": "+diff.get("hours").toString().padStart(2, '0')+" Hours " +": "+ diff.get("minutes").toString().padStart(2, '0')+" Minutes";
     
    return timespan;
          }


          handleVehicleRegistrationDetails = (asn) => {
            console.log("handleVechicaleRegistration ----",asn)
          
              this.setState({ loadReportVehicle: true, vehicleRegCustId: asn.vehicleRegistationId })
            
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
          onCloseModal=()=>{
            this.setState({
              openModal:false
            })
          }
          onOpenModal=()=>{
            this.setState({
              openModal:true
            })
          }
           handleRowClick = (row) => {
      this.handleVehicleRegistrationDetails(row);
    };
  render() {

    const {  searchQuery, page, rowsPerPage } = this.state;
    const searchInObject = (obj, searchTerm) => {
      return Object.keys(obj).some((key) => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return searchInObject(value, searchTerm);
        }
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    };
  
    const filteredData = this.props.outwardReportlist.filter((entry) => {
      return searchInObject(entry, searchQuery);
    })
     const columns = [
  {
    name: 'Sales Order No',
    selector: row => row.saleOrderNo,
    sortable: true
  },
{
    name: 'Request No',
    selector: row => row.requestNo,
    sortable: true
  },
{
    name: 'Status',
    selector: row => this.getStatusFullForm(row),
    sortable: true
  },
 {
    name: 'Created By',
    selector: row => row.createdBy===null?"":(row.createdBy.userDetails.name),
    sortable: true
  },
{
    name: 'Created Date',
    selector: row => formatDate(row.created),
    sortable: true
  },
 {
    name: 'Created Time',
    selector: row => formatDate(row.created),
    sortable: true
  },

 {
    name: 'Reported By',
    selector: row => row.reportedby===null?"":(row.reportedby.userDetails.name),
    sortable: true
  },
 {
    name: 'Reported Date',
    selector: row => row.reporteddate===null?"":formatDate(row.reporteddate),
    sortable: true
  },
 {
    name: 'Reported Time',
    selector: row => row.reporteddate===null?"":formatDate(row.reporteddate),
    sortable: true
  },
 {
    name: 'Gate In By',
    selector: row => row.gateInby==null?"":(row.gateInby.userDetails.name),
    sortable: true
  },
 {
    name: 'Gate In Date',
    selector: row => row.gateIndate===null?"":formatDate(row.gateIndate),
    sortable: true
  },
 {
    name: 'Gate In Time',
    selector: row => row.gateIndate===null?"":formatDate(row.gateIndate),
    sortable: true
  },
{
    name: 'Closed By',
    selector: row => row.gateOutby==null?"":(row.gateOutby.userDetails.name),
    sortable: true
  },
 {
    name: 'Gate Out Date',
    selector: row => row.gateOutdate===null?"":formatDate(row.gateOutdate),
    sortable: true
  },
{
    name: 'Gate Out Time',
    selector: row => row.gateOutdate===null?"":formatDate(row.gateOutdate),
    sortable: true
  },
{
    name: 'Diff (In time & Out time)',
    selector: row => row.gateOutdate===null?"":
                            this.getinoutTimeDifference(formatDate1(row.gateIndate),formatDate1(row.gateOutdate)),
    sortable: true  },

]
    return (
        <>

        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          {<UserDashboardHeader />}

          <div className="wizard-v1-content" style={{marginTop:"80px"}}>
          <div 
          //className="w-100" 
          id="togglesidebar"

          className={
            (this.state.loadReportVehicle == true
              ? "display_none"
              : "display_block")
          }>
            {this.state.openModal && <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
            <div className="modal-backdrop"></div> <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);
                  this.setState({openModal:false})
                  commonSubmitForm(e, this, "outwardResponse", "/rest/getOutwardReport", "reports")
                  this.clearFields();
                  // this.changeLoaderState(true);

                }} noValidate
              >
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        variant="outlined"
                        label="Sales Order No"
                        name="salesOrderNoFrom"
                        value={this.state.outwardDetails.salesOrderNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "outwardDetails.salesOrderNoFrom", "reports");
                          }
                        }}
                        fullWidth
                        InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Second Row - 4 Fields */}
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          size="small"
          variant="outlined"
          label="Request No (From)"
          name="requestNoFrom"
          value={this.state.outwardDetails.requestNoFrom}
          onChange={(event) => {
            if (event.target.value.length < 60) {
              commonHandleChange(event, this, "outwardDetails.requestNoFrom", "reports");
            }
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          size="small"
          variant="outlined"
          label="Request No (To)"
          name="requestNoTo"
          value={this.state.outwardDetails.requestNoTo}
          onChange={(event) => {
            if (event.target.value.length < 60) {
              commonHandleChange(event, this, "outwardDetails.requestNoTo", "reports");
            }
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="date"
          size="small"
          variant="outlined"
          label="Request Date (From)"
          name="requestDateFrom"
          value={this.state.outwardDetails.requestDateFrom}
          onChange={(event) => {
            if (event.target.value.length < 60) {
              commonHandleChange(event, this, "outwardDetails.requestDateFrom", "reports");
            }
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="date"
          size="small"
          variant="outlined"
          label="Request Date (To)"
          name="requestDateTo"
          value={this.state.outwardDetails.requestDateTo}
          onChange={(event) => {
            if (event.target.value.length < 60) {
              commonHandleChange(event, this, "outwardDetails.requestDateTo", "reports");
            }
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        />
      </Grid>
    </Grid>
  </Grid>
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          select
          size="small"
          variant="outlined"
          label="Freight Scope"
          name="freightScope"
          value={this.state.outwardDetails.freightScope}
          onChange={(event) => {
            commonHandleChange(event, this, "outwardDetails.freightScope", "reports");
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="AACL">AACL</MenuItem>
          <MenuItem value="Customer">Customer</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          size="small"
          variant="outlined"
          label="Status"
          name="status"
          value={this.state.outwardDetails.status}
          onChange={(event) => {
            commonHandleChange(event, this, "outwardDetails.status", "reports");
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        >
          <MenuItem value="">Select</MenuItem>
          {this.state.asnStatusList.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.display}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    
      <Grid item xs={6}>
        <TextField
          size="small"
          variant="outlined"
          label="Plant"
          name="plant"
          value={this.state.outwardDetails.plant}
          onChange={(event) => {
            if (event.target.value.length < 60) {
              commonHandleChange(event, this, "outwardDetails.plant", "reports");
            }
          }}
          fullWidth
          InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}
        />
      </Grid>
      <Grid item xs={12} className="text-center">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="small"
        >
          Search
        </Button>
         <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
         Cancel</Button>
         <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>

      </Grid>
    </Grid>
  </Grid>
 </Grid>
</FormWithConstraints>
</div>
</div>
</div>
}
<Grid container spacing={2} alignItems="center" justify="flex-end">
            <Grid item xs={9} style={{textAlign:"left"}}>
            <Button variant="contained" size="small" color="primary" onClick={this.exportReportToExcel}>
                Download Excel
              </Button>
            </Grid>
            <Grid item xs={3}>
              <input
              placeholder="Search"
              style={{fontSize: "10px", float:"right" }}
              value={searchQuery}
              onChange={this.handleSearchChange}
              /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
            </Grid>
          </Grid>
          <TableContainer className="mt-1">
                    {/* <Table className="my-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sales Order No</TableCell>
                          <TableCell>Request No</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Created Time</TableCell>
                          <TableCell>Reported By</TableCell>
                          <TableCell>Reported Date</TableCell>
                          <TableCell>Reported Time</TableCell>
                          <TableCell>Gate In By</TableCell>
                          <TableCell>Gate In Date</TableCell>
                          <TableCell>Gate In Time</TableCell>
                          <TableCell>Closed By</TableCell>
                          <TableCell>Gate Out Date</TableCell>
                          <TableCell>Gate Out Time</TableCell>
                          <TableCell>Diff (In time & Out time)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asn, index) => (
                          <TableRow onClick={() => this.handleVehicleRegistrationDetails(asn)}
                          >
                            <TableCell>{asn.saleOrderNo}</TableCell>
                          
                             <TableCell>{asn.requestNo}</TableCell>
                          
                            <TableCell>{this.getStatusFullForm(asn)}</TableCell>
                            <TableCell>{asn.createdBy===null?"":(asn.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{formatDate(asn.created)}</TableCell>
                            <TableCell>{formatTime(asn.created)}</TableCell>
                            <TableCell>{asn.reportedby===null?"":(asn.reportedby.userDetails.name)}</TableCell>
                            <TableCell>{asn.reporteddate===null?"":formatDate(asn.reporteddate)}</TableCell>
                            <TableCell>{asn.reporteddate===null?"":formatTime(asn.reporteddate)}</TableCell>
                            <TableCell>{asn.gateInby==null?"":(asn.gateInby.userDetails.name)}</TableCell>
                            <TableCell>{asn.gateIndate===null?"":formatDate(asn.gateIndate)}</TableCell>
                            <TableCell>{asn.gateIndate===null?"":formatTime(asn.gateIndate)}</TableCell>
                            <TableCell>{asn.gateOutby==null?"":(asn.gateOutby.userDetails.name)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":formatDate(asn.gateOutdate)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":formatTime(asn.gateOutdate)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":
                            this.getinoutTimeDifference(formatDate1(asn.gateIndate),formatDate1(asn.gateOutdate))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                   
                  
                  <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                  /> */}
                   <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      paginationPerPage={50}  
                      //responsive
                      paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                      onRowClicked={this.handleRowClick}
                      />
                      </TableContainer>
                  <div style={{display:"none"}}>
                  <Table  stickyHeader  id="table1">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sales Order No</TableCell>
                          <TableCell>Request No</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Created Time</TableCell>
                          <TableCell>Reported By</TableCell>
                          <TableCell>Reported Date</TableCell>
                          <TableCell>Reported Time</TableCell>
                          <TableCell>Gate In By</TableCell>
                          <TableCell>Gate In Date</TableCell>
                          <TableCell>Gate In Time</TableCell>
                          <TableCell>Closed By</TableCell>
                          <TableCell>Gate Out Date</TableCell>
                          <TableCell>Gate Out Time</TableCell>
                          <TableCell>Diff (In time & Out time)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                      {this.props.outwardReportlist.map((asn, index) => (
                          <TableRow onClick={() => this.handleVehicleRegistrationDetails(asn)}
                          >
                            <TableCell>{asn.saleOrderNo}</TableCell>
                          
                             <TableCell>{asn.requestNo}</TableCell>
                          
                            <TableCell>{this.getStatusFullForm(asn)}</TableCell>
                            <TableCell>{asn.createdBy===null?"":(asn.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{formatDate(asn.created)}</TableCell>
                            <TableCell>{formatTime(asn.created)}</TableCell>
                            <TableCell>{asn.reportedby===null?"":(asn.reportedby.userDetails.name)}</TableCell>
                            <TableCell>{asn.reporteddate===null?"":formatDate(asn.reporteddate)}</TableCell>
                            <TableCell>{asn.reporteddate===null?"":formatTime(asn.reporteddate)}</TableCell>
                            <TableCell>{asn.gateInby==null?"":(asn.gateInby.userDetails.name)}</TableCell>
                            <TableCell>{asn.gateIndate===null?"":formatDate(asn.gateIndate)}</TableCell>
                            <TableCell>{asn.gateIndate===null?"":formatTime(asn.gateIndate)}</TableCell>
                            <TableCell>{asn.gateOutby==null?"":(asn.gateOutby.userDetails.name)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":formatDate(asn.gateOutdate)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":formatTime(asn.gateOutdate)}</TableCell>
                            <TableCell>{asn.gateOutdate===null?"":
                            this.getinoutTimeDifference(formatDate1(asn.gateIndate),formatDate1(asn.gateOutdate))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                </div>

          <div className={
              (this.state.loadReportVehicle == true
                ? "display_block"
                : "display_none")
            }  
            >              
              <ReportVechicle
                vehicleRegCustId = {this.state.vehicleRegCustId}
                OutwardReportdisplay={this.state.OutwardReportdisplay}
              />
          </div>

          { }</React.Fragment>
      </>
    );
  }
}


const mapStateToProps=(state)=>{
    
    return state.OutwardReportReducer;
  };
  export default connect (mapStateToProps,actionCreators)(OutwardReport);