import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "../ASNReportsWithoutPO/Action";
import StickyHeader from "react-sticky-table-thead";
import "./../ASNReports/user.css";
import {
  commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import {saveQuotation,downloadexcelApi,request,uploadFile} from "../../Util/APIUtils";
import { getIFSCDetails, } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { useState } from "react"
import axios from 'axios';
import { formatDateWithoutTime,formatTime} from "../../Util/DateUtil";
// import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict} from "../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import { API_BASE_URL } from "../../Constants";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import formatDate from '../../Util/DateUtil';
import { Button, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@material-ui/core";


class ASNReportsWithoutPO extends Component {

  constructor(props) {

    super(props)
    this.state = {
      
      isLoading: false,
      asnStatusList:[],
      page: 0,
      rowsPerPage: 50,
      searchQuery: "",
      openModal:false,
      asndetails: {
        poNoFrom: "",
        poNoTo: "",
        asnNoFrom: "",
        asnNoTo: "",
        asnDateFrom: "",
        asnDateTo: "",
        isPONoFilter: "",
        isAsnNoFilter: "",
        isAsnDateFilter: "",
        vendorCode:"",
        vendorCodeTo:"",
        status:'',
        requestedBy:"",
        plant:"",
        itemCodeFrom:"",
        itemCodeTo:""
      },
   
      asnLinereportlistWithoutPO:[],
    

  
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
    

    if (!isEmpty(props.asnLinereportlistWithoutPO)) {
      this.changeLoaderState(false);
      this.setState({
        asnLinereportlistWithoutPO: props.asnLinereportlistWithoutPO
      })
    } else {
      this.changeLoaderState(false);
    }

    
    if (!isEmpty(props.asndetails)) {
      this.changeLoaderState(false);
      this.setState({

        asndetails: {
          poNoFrom: "",
          poNoTo: "",
          asnNoFrom: "",
          asnNoTo: "",
          asnDateFrom: "",
          asnDateTo: "",
          isPONoFilter: "",
          isAsnNoFilter: "",
          isAsnDateFilter: "",
          vendorCode:"",
          vendorCodeTo:"",
           status:'',
            requestedBy:"",
             plant:"",
             itemCodeFrom:"",
             itemCodeTo:""
        }
      })
    }




  }


  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  handleFilterClick = () => {
    this.props.onFilter && this.props.onFilter();
    this.setState({ formDisplay: !this.state.formDisplay });
    this.setState({ searchDisplay: !this.state.searchDisplay });
  }

  handleSearchClick = () => {

    if (this.state.asndetails.asnNoFrom != "" || this.state.asndetails.poNoFrom != "" || this.state.asndetails.asnDateFrom != "" || this.state.asndetails.vendorCode!=""|| this.state.asndetails.status!='' || this.state.asndetails.plant!="" || this.state.asndetails.vendorCodeTo!="" || this.state.asndetails.itemCodeFrom!=""|| this.state.asndetails.itemCodeFrom!="") {
    
      this.setState({isLoading : true})

    } else {

      window.alert('Please Enter One of Above Value')
      this.changeLoaderState = false;
      return false;
    }
  }

exportReportToExcel() {
    TableToExcel.convert(document.getElementById("AsnLineWithoutPOReport"),{
       name:"AsnLineWithoutPOReport.xlsx"
    });
  }
  

  getinoutTimeDifference(startDate,endDate){
   
    let timespan="";
    var now  = startDate;
    var then = endDate;
    var diff = moment.duration(moment(then).diff(moment(now)));
    timespan = diff.get("days").toString().padStart(2, '0')+" Days "+": "+diff.get("hours").toString().padStart(2, '0')+" Hours " +": "+ diff.get("minutes").toString().padStart(2, '0')+" Minutes";
     
    return timespan;
          }
          handleSearchChange = (event) => {
            this.setState({ searchQuery: event.target.value });
          };
        
          handlePageChange = (event, newPage) => {
            this.setState({ page: newPage });
          };
        
          handleRowsPerPageChange = (event) => {
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

  render() {
    const { searchQuery, page, rowsPerPage } = this.state;
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
  
    const filteredData = this.state.asnLinereportlistWithoutPO.filter((entry) => {
      return searchInObject(entry, searchQuery);
    });

    return (
      <>

        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          {<UserDashboardHeader />}
          <div className="wizard-v1-content" style={{marginTop:"80px"}}>
          {this.state.openModal && <div className="customModal modal roleModal" id="updateRoleModal show" style={{ display: 'block' }}>
          <div className="modal-backdrop"></div>
           <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {
                  this.changeLoaderState(true);
                  this.setState({openModal:false})
                 commonSubmitForm(e, this, "asnLineResponseWithoupo", "/rest/getASNLineReportWithoutPO", "reports");
                 
                }} noValidate
              >
               <Grid container spacing={2}>
<Grid item xs={6}>
            <TextField label="ASN No From" 
            variant="outlined" size="small" 
            fullWidth name="asnNoFrom" 
            value={this.state.asndetails.asnNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "asndetails.asnNoFrom", "reports")
                          }
                        }}  InputLabelProps={{ shrink: true }}  
                        inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="ASN No To" name="asnNoTo"
             variant="outlined" size="small" fullWidth 
             value={this.state.asndetails.asnNoTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnNoTo", "reports")
              }
            }}   InputLabelProps={{ shrink: true }}  
            inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          
          <Grid item xs={6}>
            <TextField label="ASN Date From" name="asnDateFrom" type="date" variant="outlined" size="small" fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.asnDateFrom} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnDateFrom", "reports")
              }}}    
              inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="ASN Date To" name="asnDateTo" type="date" variant="outlined" size="small" fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.asnDateTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnDateTo", "reports")
              }
            }} 
            inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>          
          <Grid item xs={6}>
            <TextField label="Plant" name="plant" variant="outlined" size="small" fullWidth 
            value={this.state.asndetails.plant} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.plant", "reports")
              }
            }}  InputLabelProps={{ shrink: true }}  
            inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small" variant="outlined">
            <InputLabel shrink>Status</InputLabel>
              <Select name="status" 
              value={this.state.asndetails.status} onChange={(event) => {
                {
                 commonHandleChange(event, this, "asndetails.status", "reports")
               }}} label="Status" sx={{ fontSize: 12, height: "15px",  } }>
                <MenuItem value="">Select</MenuItem>
                {this.state.asnStatusList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{textAlign:"center"}}>
            <Button size="small" type="submit" variant="contained" onClick={this.handleSearchClick.bind(this)} color="primary">Search</Button>
            <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
            Cancel</Button>
          </Grid>
          </Grid> 


              </FormWithConstraints>
          </div>
          </div>
          </div>}

           
            <Grid container>
            <Grid item sm={12} className="mb-1">   
            <Button type="submit" variant="contained" color="primary" size="small"
                        style={{justifyContent: "center"}} onClick={this.exportReportToExcel}>
                           <i className="fa fa-download" />&nbsp; Download Excel</Button>       
        <input
          placeholder="Search"
          // variant="outlined"
          // size="small"
          style={{fontSize: "10px", float:"right" }}
          value={searchQuery}
          onChange={this.handleSearchChange}
        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
        </Grid>
        </Grid>
            <TableContainer>
                    <Table className="my-table" >
                      <TableHead>
                        <TableRow>
                          <TableCell>ASN No</TableCell>
                          <TableCell>ASN Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Vehicle Number</TableCell>
                          <TableCell>Lr No.</TableCell>
                          <TableCell>Transport Name</TableCell>
                          <TableCell>Line No</TableCell>
                          <TableCell>Material Description</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell>Uom</TableCell>
                          <TableCell>Rate</TableCell>
                           <TableCell>Invoice No</TableCell>
                          <TableCell>Invoice Date</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Reported By</TableCell>
                          <TableCell>Reported Date</TableCell>
                          <TableCell>Reported Time</TableCell>
                          <TableCell>Gate In By</TableCell>
                          <TableCell>Gate In Date</TableCell>
                          <TableCell>Gate In Time</TableCell>
                          <TableCell>Gate Out Date</TableCell>
                          <TableCell>Gate Out Time</TableCell>
                          <TableCell>Closed By</TableCell>
                          <TableCell>Diff. (Vehicle In time & Out Time)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asnLine, index) => (
                          <TableRow key={index+1}>
                            <TableCell>{asnLine.advanceshipmentnotice.advanceShipmentNoticeNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.created===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.status}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.vehicalNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.lrNumber}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.transporterNo}</TableCell>
                            <TableCell>{asnLine.lineItemNo}</TableCell>
                            <TableCell>{asnLine.name}</TableCell>
                            <TableCell>{asnLine.deliveryQuantity}</TableCell>
                            <TableCell>{asnLine.uom}</TableCell>
                            <TableCell>{asnLine.rate}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.invoiceDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.createdBy===null?"":(asnLine.advanceshipmentnotice.createdBy.userDetails===null?"":asnLine.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedBy===null?"":(asnLine.advanceshipmentnotice.reportedBy.userDetails===null?"":asnLine.advanceshipmentnotice.reportedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinBy==null?"":(asnLine.advanceshipmentnotice.gateinBy.userDetails===null?"":asnLine.advanceshipmentnotice.gateinBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateOutDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateOutDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.closedBy==null?"":(asnLine.advanceshipmentnotice.closedBy.userDetails===null?"":asnLine.advanceshipmentnotice.closedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":
                            this.getinoutTimeDifference(formatDate(asnLine.advanceshipmentnotice.gateInDate),formatDate(asnLine.advanceshipmentnotice.gateOutDate))}</TableCell>
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
                    onPageChange={this.handlePageChange}
                    onRowsPerPageChange={this.handleRowsPerPageChange}
                  />
<div style={{display:"none"}}>
<Table className="my-table"  id="AsnLineWithoutPOReport">
                      <TableHead>
                        <TableRow>
                          <TableCell>ASN No</TableCell>
                          <TableCell>ASN Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Vehicle Number</TableCell>
                          <TableCell>Lr No.</TableCell>
                          <TableCell>Transport Name</TableCell>
                          <TableCell>Line No</TableCell>
                          <TableCell>Material Description</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell>Uom</TableCell>
                          <TableCell>Rate</TableCell>
                           <TableCell>Invoice No</TableCell>
                          <TableCell>Invoice Date</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Reported By</TableCell>
                          <TableCell>Reported Date</TableCell>
                          <TableCell>Reported Time</TableCell>
                          <TableCell>Gate In By</TableCell>
                          <TableCell>Gate In Date</TableCell>
                          <TableCell>Gate In Time</TableCell>
                          <TableCell>Gate Out Date</TableCell>
                          <TableCell>Gate Out Time</TableCell>
                          <TableCell>Closed By</TableCell>
                          <TableCell>Diff. (Vehicle In time & Out Time)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                      
                      {this.state.asnLinereportlistWithoutPO.map((asnLine, index) => (
                          <TableRow key={index+1}>
                            <TableCell>{asnLine.advanceshipmentnotice.advanceShipmentNoticeNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.created===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.status}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.vehicalNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.lrNumber}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.transporterNo}</TableCell>
                            <TableCell>{asnLine.lineItemNo}</TableCell>
                            <TableCell>{asnLine.name}</TableCell>
                            <TableCell>{asnLine.deliveryQuantity}</TableCell>
                            <TableCell>{asnLine.uom}</TableCell>
                            <TableCell>{asnLine.rate}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.invoiceDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.createdBy===null?"":(asnLine.advanceshipmentnotice.createdBy.userDetails===null?"":asnLine.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedBy===null?"":(asnLine.advanceshipmentnotice.reportedBy.userDetails===null?"":asnLine.advanceshipmentnotice.reportedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinBy==null?"":(asnLine.advanceshipmentnotice.gateinBy.userDetails===null?"":asnLine.advanceshipmentnotice.gateinBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateOutDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateOutDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.closedBy==null?"":(asnLine.advanceshipmentnotice.closedBy.userDetails===null?"":asnLine.advanceshipmentnotice.closedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":
                            this.getinoutTimeDifference(formatDate(asnLine.advanceshipmentnotice.gateInDate),formatDate(asnLine.advanceshipmentnotice.gateOutDate))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody> 
                    </Table>
</div>
</div>
          { }</React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.asnReportsWithoutPO;
};
export default connect(mapStateToProps, actionCreators)(ASNReportsWithoutPO);