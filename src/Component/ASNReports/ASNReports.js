import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./../ASNReports/Action";
import StickyHeader from "react-sticky-table-thead";
import "./../ASNReports/user.css";
import {
  commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import {saveQuotation,downloadexcelApi,request,uploadFile} from "./../../Util/APIUtils";
import { getIFSCDetails, } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { useState } from "react"
import axios from 'axios';
import formatDate, { formatTime} from "./../../Util/DateUtil";
//import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict} from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import { API_BASE_URL } from "./../../Constants";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import {
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




class ASNReports extends Component {

  constructor(props) {

    super(props)
    this.state = {
      
      isLoading: false,
      getASNReportlist: [],
      asnStatusList:[],
      search: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
      partner: {
        partnerId: "",
        email: "",
        companyName: "",
        mobileNo: "",
        name: "",
        firstName: "",
        middleName: "",
        lastName: ""
      },

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
        itemCodeTo:"",
        gateInDateFrom:"",
        gateInDateTo:""
      },
      asnLineList:[],
      asnLinereportlist:[],
      loadASNLineList: false,
      asnLineArray: [],
      asnnewDetails: {
        asnNumber: "",
        po: ""}
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
    

    // if (!isEmpty(props.getASNReportlist)) {
    //   this.changeLoaderState(false);
    //   this.setState({
    //   AsnList: this.state.props.getASNReportlist
    //   })
    // } else {
    //   this.changeLoaderState(false);
    // }

    if (!isEmpty(props.asnLinereportlist)) {
      this.changeLoaderState(false);
      this.setState({
          asnLinereportlist: props.asnLinereportlist
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
             itemCodeTo:"",
             gateInDateFrom:"",
             gateInDateTo:""
        }
      })
    }




  }

  clearFields=()=>{
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
      itemCodeTo:"",
      gateInDateFrom:"",
      gateInDateTo:""
    },
  })
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

    if (this.state.asndetails.asnNoFrom != "" || this.state.asndetails.poNoFrom != "" || this.state.asndetails.asnDateFrom != "" || this.state.asndetails.vendorCode!=""|| this.state.asndetails.status!='' || this.state.asndetails.plant!="" || this.state.asndetails.vendorCodeTo!="" || this.state.asndetails.itemCodeFrom!=""|| this.state.asndetails.itemCodeFrom!="" || this.state.asndetails.gateInDateFrom != "") {
    
      this.isLoading.hidden = true;

    } else {

      window.alert('Please Enter One of Above Value')
      this.changeLoaderState = false;
      return false;
    }
  }

exportReportToExcel() {
    TableToExcel.convert(document.getElementById("AsnLineReport"),{
       name:"ASNLineReport.xlsx"
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
            this.setState({ search: event.target.value });
            
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
    const { page, rowsPerPage, search } = this.state;
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
  
    let listData=this.props.asnLinereportlist
    const filteredData = listData.filter((entry) =>
                Object.values(entry).some((val) =>
                  val && val.toString().toLowerCase().includes(search.toLowerCase())
                )
              );
 const columns = [
  { name: 'ASN No', selector: row => row.advanceshipmentnotice.advanceShipmentNoticeNo, sortable: true },
  { name: 'ASN Date', selector: row => row.advanceshipmentnotice.created, cell: row => row.advanceshipmentnotice.created ? formatDate(row.advanceshipmentnotice.created) : '', sortable: true },
  { name: 'PO No', selector: row => row.advanceshipmentnotice.po.purchaseOrderNumber, sortable: true },
  { name: 'PO Date', selector: row => row.advanceshipmentnotice.po.created, cell: row => formatDate(row.advanceshipmentnotice.po.created), sortable: true },
  { name: 'Status', selector: row => row.advanceshipmentnotice.status, sortable: true },
  { name: 'Vendor Name', selector: row => row.advanceshipmentnotice.po.vendorName, sortable: true },
  { name: 'Vehicle Number', selector: row => row.advanceshipmentnotice.vehicalNo, sortable: true },
  { name: 'Lr No.', selector: row => row.advanceshipmentnotice.lrNumber, sortable: true },
  { name: 'Transport Name', selector: row => row.advanceshipmentnotice.transporterNo, sortable: true },
  { name: 'Line No', selector: row => row.poLine.lineItemNumber, sortable: true },
  { name: 'Material Description', selector: row => `${row.poLine.code}-${row.poLine.name}`, sortable: true },
  { name: 'Qty', selector: row => row.deliveryQuantity, sortable: true },
  { name: 'Uom', selector: row => row.poLine.uom, sortable: true },
  { name: 'Rate', selector: row => row.poLine.rate, sortable: true },
  { name: 'Invoice No', selector: row => row.advanceshipmentnotice.invoiceNo, sortable: true },
  { name: 'Invoice Date', selector: row => row.advanceshipmentnotice.invoiceDate, cell: row => row.advanceshipmentnotice.invoiceDate ? formatDate(row.advanceshipmentnotice.invoiceDate) : '', sortable: true },
  { name: 'Created By', selector: row => row.advanceshipmentnotice.createdBy?.userDetails?.name || '', sortable: true },
  { name: 'Reported By', selector: row => row.advanceshipmentnotice.reportedBy?.userDetails?.name || '', sortable: true },
  { name: 'Reported Date', selector: row => row.advanceshipmentnotice.reportedDate, cell: row => row.advanceshipmentnotice.reportedDate ? formatDate(row.advanceshipmentnotice.reportedDate) : '', sortable: true },
  { name: 'Reported Time', selector: row => row.advanceshipmentnotice.reportedDate, cell: row => row.advanceshipmentnotice.reportedDate ? formatTime(row.advanceshipmentnotice.reportedDate) : '', sortable: true },
  { name: 'Gate In By', selector: row => row.advanceshipmentnotice.gateinBy?.userDetails?.name || '', sortable: true },
  { name: 'Gate In Date', selector: row => row.advanceshipmentnotice.gateInDate, cell: row => row.advanceshipmentnotice.gateInDate ? formatDate(row.advanceshipmentnotice.gateInDate) : '', sortable: true },
  { name: 'Gate In Time', selector: row => row.advanceshipmentnotice.gateInDate, cell: row => row.advanceshipmentnotice.gateInDate ? formatTime(row.advanceshipmentnotice.gateInDate) : '', sortable: true },
  { name: '103 Posted By', selector: row => row.advanceshipmentnotice.gateinPostedby?.userDetails?.name || '', sortable: true },
  { name: '103 Posted Date', selector: row => row.advanceshipmentnotice.date_103, cell: row => row.advanceshipmentnotice.date_103 ? formatDate(row.advanceshipmentnotice.date_103) : '', sortable: true },
  { name: '103 Posted Time', selector: row => row.advanceshipmentnotice.date_103, cell: row => row.advanceshipmentnotice.date_103 ? formatTime(row.advanceshipmentnotice.date_103) : '', sortable: true },
  { name: '103 Doc No', selector: row => row.advanceshipmentnotice.sap103Id || '', sortable: true },
  { name: '105 Posted By', selector: row => row.advanceshipmentnotice.grnPostedby?.userDetails?.name || '', sortable: true },
  { name: '105 Posted Date', selector: row => row.advanceshipmentnotice.grnDate, cell: row => row.advanceshipmentnotice.grnDate ? formatDate(row.advanceshipmentnotice.grnDate) : '', sortable: true },
  { name: '105 Posted Time', selector: row => row.advanceshipmentnotice.grnDate, cell: row => row.advanceshipmentnotice.grnDate ? formatTime(row.advanceshipmentnotice.grnDate) : '', sortable: true },
  { name: '105 Doc No', selector: row => row.advanceshipmentnotice.grnId || '', sortable: true },
  { name: 'Gate Out Date', selector: row => row.advanceshipmentnotice.gateOutDate, cell: row => row.advanceshipmentnotice.gateOutDate ? formatDate(row.advanceshipmentnotice.gateOutDate) : '', sortable: true },
  { name: 'Gate Out Time', selector: row => row.advanceshipmentnotice.gateOutDate, cell: row => row.advanceshipmentnotice.gateOutDate ? formatTime(row.advanceshipmentnotice.gateOutDate) : '', sortable: true },
  { name: 'Closed By', selector: row => row.advanceshipmentnotice.closedBy?.userDetails?.name || '', sortable: true },
  {
    name: 'Diff. (Vehicle In time & Out Time)',
    selector: row => {
      const inDate = row.advanceshipmentnotice.gateInDate;
      const outDate = row.advanceshipmentnotice.gateOutDate;
      return (inDate && outDate)
        ? this.getinoutTimeDifference(formatDate(inDate), formatDate(outDate))
        : '';
    },
    sortable: true
  }
];


 return (
      <>

        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          {<UserDashboardHeader />}
          {/* {<NewHeader/>} */}
          <div className="wizard-v1-content" style={{marginTop:"80px"}}>
          {this.state.openModal && <div className="customModal modal roleModal" id="updateRoleModal show" style={{ display: 'block' }}>
          <div className="modal-backdrop"></div>
                                    <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);
                  this.setState({openModal:false})

                  //    commonSubmitForm(e, this, "asnResponse", "/rest/getASNReport", "reports")
              commonSubmitForm(e, this, "asnLineResponse", "/rest/getASNLineReport", "reports");
              this.clearFields();
                  // this.handleSearchClick(true)
                  // this.changeLoaderState(true);

                }} noValidate
              >
<Grid container spacing={2}>
   <Grid item xs={4}>
      <TextField label="ASN No From" 
       variant="outlined" size="small" 
       fullWidth name="asnNoFrom" 
       value={this.state.asndetails.asnNoFrom}
        onChange={(event) => {
          if (event.target.value.length < 60) {
            commonHandleChange(event, this, "asndetails.asnNoFrom", "reports")
          }
        }} 
      InputLabelProps={{ shrink: true }}  
      inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
     />
  </Grid>
          <Grid item xs={4}>
            <TextField label="ASN No To" name="asnNoTo"
             variant="outlined" size="small" fullWidth 
             value={this.state.asndetails.asnNoTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnNoTo", "reports")
              }
            }}  
            InputLabelProps={{ shrink: true }}  
  inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
    />
          </Grid>
          <Grid item xs={4}>
            <TextField label="PO No From" name="poNoFrom" variant="outlined" size="small" fullWidth 
            value={this.state.asndetails.poNoFrom} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.poNoFrom", "reports")
              }
            }} 
            InputLabelProps={{ shrink: true }}  
  inputProps={{ style: { fontSize: 12, height: "15px",  } }}    />
          </Grid>
          <Grid item xs={4}>
            <TextField label="PO No To" name="poNoTo" variant="outlined" size="small" fullWidth 
            value={this.state.asndetails.poNoTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.poNoTo", "reports")
              }
            }}  InputLabelProps={{ shrink: true }}  
            inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
          </Grid>
          <Grid item xs={4}>
            <TextField label="ASN Date From" name="asnDateFrom" type="date" variant="outlined" size="small" fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.asnDateFrom} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnDateFrom", "reports")
              }}}   inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="ASN Date To" name="asnDateTo" type="date" variant="outlined" size="small" fullWidth 
            InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.asnDateTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.asnDateTo", "reports")
              }
            }}  inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="GateIN Date From" name="gateInDateFrom" type="date" variant="outlined" 
            size="small" fullWidth InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.gateInDateFrom} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.gateInDateFrom", "reports")
              }
            }}  inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Gate IN Date To" name="gateInDateTo" type="date" variant="outlined" 
            size="small" fullWidth InputLabelProps={{ shrink: true }} 
            value={this.state.asndetails.gateInDateTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.gateInDateTo", "reports")
              }
            }}   inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vendor Code From" name="vendorCode" variant="outlined" size="small" 
            fullWidth value={this.state.asndetails.vendorCode} onChange={(event) => {
              {
               commonHandleChange(event, this, "asndetails.vendorCode", "reports")
             }
           }} InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}   />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Vendor Code To" name="vendorCodeTo" variant="outlined" size="small" 
            fullWidth value={this.state.asndetails.vendorCodeTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.vendorCodeTo", "reports")
              }  
              }} InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Item Code From" name="itemCodeFrom" variant="outlined" size="small" 
            fullWidth value={this.state.asndetails.itemCodeFrom} onChange={(event) => {
              {
               commonHandleChange(event, this, "asndetails.itemCodeFrom", "reports")
             }
           }} InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Item Code To" name="itemCodeTo" variant="outlined" size="small" fullWidth
             value={this.state.asndetails.itemCodeTo} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.itemCodeTo", "reports")
              }
            }}InputLabelProps={{ shrink: true }}  
            inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Plant" name="plant" variant="outlined" size="small" fullWidth 
            value={this.state.asndetails.plant} onChange={(event) => {
              if (event.target.value.length < 60) {
                commonHandleChange(event, this, "asndetails.plant", "reports")
              }
            }} InputLabelProps={{ shrink: true }}  
            inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" variant="outlined" 
             >
            <InputLabel shrink >Status</InputLabel>
              <Select name="status" 
              value={this.state.asndetails.status} onChange={(event) => {
                {
                 commonHandleChange(event, this, "asndetails.status", "reports")
               }}} label="Status" 
               sx={{ fontSize: 12, height: "15px",  } } >
                <MenuItem value="">Select</MenuItem>
                {this.state.asnStatusList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{textAlign:"center"}}>
           <Button type="submit" size="small" variant="contained" onClick={this.handleSearchClick.bind(this)} color="primary"> Search</Button>
            <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
            Cancel</Button>
            <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>

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
          value={search}
          onChange={this.handleSearchChange}
        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
        </Grid>
        </Grid>
         <TableContainer className="mt-1">
                    {/* <Table className="my-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ASN No</TableCell>
                          <TableCell>ASN Date</TableCell>
                          <TableCell>PO No</TableCell>
                          <TableCell>PO Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Vendor Name</TableCell>
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
                          <TableCell>103 Posted By</TableCell> 
                          <TableCell>103 Posted Date</TableCell>
                          <TableCell>103 Posted Time</TableCell>                         
                          <TableCell>103 Doc No</TableCell>
                          
                          <TableCell>105 Doc No</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asnLine, index) => (
                          <TableRow key={index+1}>
                            <TableCell>{asnLine.advanceshipmentnotice.advanceShipmentNoticeNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.created===null?"":formatDate(asnLine.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.po.purchaseOrderNumber}</TableCell>
                            <TableCell>{formatDate(asnLine.advanceshipmentnotice.po.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.status}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.po.vendorName}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.vehicalNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.lrNumber}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.transporterNo}</TableCell>
                            <TableCell>{asnLine.poLine.lineItemNumber}</TableCell>
                            <TableCell>{asnLine.poLine.code+"-"+asnLine.poLine.name}</TableCell>
                            <TableCell>{asnLine.deliveryQuantity}</TableCell>
                            <TableCell>{asnLine.poLine.uom}</TableCell>
                            <TableCell>{asnLine.poLine.rate}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceDate===null?"":formatDate(asnLine.advanceshipmentnotice.invoiceDate)}</TableCell>
                                                    
                            <TableCell>{asnLine.advanceshipmentnotice.createdBy===null?"":(asnLine.advanceshipmentnotice.createdBy.userDetails===null?"":asnLine.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedBy===null?"":(asnLine.advanceshipmentnotice.reportedBy.userDetails===null?"":asnLine.advanceshipmentnotice.reportedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatDate(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinBy==null?"":(asnLine.advanceshipmentnotice.gateinBy.userDetails===null?"":asnLine.advanceshipmentnotice.gateinBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatDate(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinPostedby==null?"":(asnLine.advanceshipmentnotice.gateinPostedby.userDetails===null?"":asnLine.advanceshipmentnotice.gateinPostedby.userDetails.name)}</TableCell>
                            <TableCell> {asnLine.advanceshipmentnotice.date_103===null?"":formatDate(asnLine.advanceshipmentnotice.date_103)}</TableCell>  
                             <TableCell>{asnLine.advanceshipmentnotice.date_103===null?"":formatTime(asnLine.advanceshipmentnotice.date_103)}</TableCell>                          
                            <TableCell>{asnLine.advanceshipmentnotice.sap103Id===null?"":asnLine.advanceshipmentnotice.sap103Id}</TableCell>
                                                  
                            <TableCell>{asnLine.advanceshipmentnotice.grnId===null?"":asnLine.advanceshipmentnotice.grnId}</TableCell>
                            
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
                                onPageChange={this.handlePageChange}
                                onRowsPerPageChange={this.handleRowsPerPageChange}
                              /> */}
                    <DataTable
                          columns={columns}
                          data={filteredData}
                          pagination
                          paginationPerPage={50}  
                          //responsive
                          paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                        />
                  </TableContainer>
                   
                              <div style={{display:"none"}}>
                              <Table  id="AsnLineReport">
                      <TableHead>
                        <TableRow>
                          <TableCell>ASN No</TableCell>
                          <TableCell>ASN Date</TableCell>
                          <TableCell>PO No</TableCell>
                          <TableCell>PO Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Vendor Name</TableCell>
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
                          <TableCell>103 Posted By</TableCell> 
                          <TableCell>103 Posted Date</TableCell>
                          <TableCell>103 Posted Time</TableCell>                         
                          <TableCell>103 Doc No</TableCell>
                          <TableCell>105 Posted By</TableCell>
                          <TableCell>105 Posted Date</TableCell> 
                          <TableCell>105 Posted Time</TableCell>                        
                          <TableCell>105 Doc No</TableCell>
                          <TableCell>Gate Out Date</TableCell>
                          <TableCell>Gate Out Time</TableCell>
                          <TableCell>Closed By</TableCell>
                          <TableCell>Diff. (Vehicle In time & Out Time)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="DataTableBody">
                        {/* {this.props.getASNReportlist.map((asn, index) => ( */}
                          {this.state.asnLinereportlist.map((asnLine, index) => (
                          <TableRow key={index+1}>
                            <TableCell>{asnLine.advanceshipmentnotice.advanceShipmentNoticeNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.created===null?"":formatDate(asnLine.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.po.purchaseOrderNumber}</TableCell>
                            <TableCell>{formatDate(asnLine.advanceshipmentnotice.po.created)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.status}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.po.vendorName}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.vehicalNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.lrNumber}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.transporterNo}</TableCell>
                            <TableCell>{asnLine.poLine.lineItemNumber}</TableCell>
                            <TableCell>{asnLine.poLine.code+"-"+asnLine.poLine.name}</TableCell>
                            <TableCell>{asnLine.deliveryQuantity}</TableCell>
                            <TableCell>{asnLine.poLine.uom}</TableCell>
                            <TableCell>{asnLine.poLine.rate}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.invoiceDate===null?"":formatDate(asnLine.advanceshipmentnotice.invoiceDate)}</TableCell>
                                                    
                            <TableCell>{asnLine.advanceshipmentnotice.createdBy===null?"":(asnLine.advanceshipmentnotice.createdBy.userDetails===null?"":asnLine.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedBy===null?"":(asnLine.advanceshipmentnotice.reportedBy.userDetails===null?"":asnLine.advanceshipmentnotice.reportedBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatDate(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatTime(asnLine.advanceshipmentnotice.reportedDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinBy==null?"":(asnLine.advanceshipmentnotice.gateinBy.userDetails===null?"":asnLine.advanceshipmentnotice.gateinBy.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatDate(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateInDate)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateinPostedby==null?"":(asnLine.advanceshipmentnotice.gateinPostedby.userDetails===null?"":asnLine.advanceshipmentnotice.gateinPostedby.userDetails.name)}</TableCell>
                            <TableCell> {asnLine.advanceshipmentnotice.date_103===null?"":formatDate(asnLine.advanceshipmentnotice.date_103)}</TableCell>  
                             <TableCell>{asnLine.advanceshipmentnotice.date_103===null?"":formatTime(asnLine.advanceshipmentnotice.date_103)}</TableCell>                          
                            <TableCell>{asnLine.advanceshipmentnotice.sap103Id===null?"":asnLine.advanceshipmentnotice.sap103Id}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.grnPostedby==null?"":(asnLine.advanceshipmentnotice.grnPostedby.userDetails===null?"":asnLine.advanceshipmentnotice.grnPostedby.userDetails.name)}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.grnDate===null?"":formatDate(asnLine.advanceshipmentnotice.grnDate)}</TableCell> 
                            <TableCell>{asnLine.advanceshipmentnotice.grnDate===null?"":formatTime(asnLine.advanceshipmentnotice.grnDate)}</TableCell>                          
                            <TableCell>{asnLine.advanceshipmentnotice.grnId===null?"":asnLine.advanceshipmentnotice.grnId}</TableCell>
                            <TableCell>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatDate(asnLine.advanceshipmentnotice.gateOutDate)}</TableCell>
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
  return state.asnreports;
};
export default connect(mapStateToProps, actionCreators)(ASNReports);