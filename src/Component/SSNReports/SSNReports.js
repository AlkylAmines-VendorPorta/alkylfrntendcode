import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./../SSNReports/Action";
import StickyHeader from "react-sticky-table-thead";

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
import formatDate from "./../../Util/DateUtil";
import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto } from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import TableToExcel from "@linways/table-to-excel";
import { Button, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@material-ui/core";
import DataTable from "react-data-table-component";


class SSNReports extends Component {

  constructor(props) {
    super(props)
    this.state = {
     // ssnreportlist: [],
     ssnLinereportlist:[],
      serviceSheetStatusList:[],
      //serviceEntrySheetStatusList:[],
      isLoading: false,
      
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      ssndetails: {
        poNoFrom: "",
        poNoTo: "",
        ssnNoFrom: "",
        ssnNoTo: "",
        ssnDateFrom: "",
        ssnDateTo: "",
        isPONoFilter: "",
        isSsnNoFilter: "",
        isSsnDateFilter: "",
        vendorCode:"",
        status:'',
       requestedBy:"",
       plant:""
      },

    }
  }

  async componentDidMount() {
   // commonSubmitForm(this.props, "asnResponse", "/rest/getASNReport", "reports")
    commonSubmitWithParam(this.props, "ssnStatusResponse", "/rest/getASNStatusList");
  }

  async componentWillReceiveProps(props) {

    if (!isEmpty(props.ssnLinereportlist)) {
      this.changeLoaderState(false);
      this.setState({
        ssnLinereportlist: props.ssnLinereportlist
      })
    }
    else {
      this.changeLoaderState(false);
    }

      if(!isEmpty(props.serviceSheetStatusList)){
        let ssnStatusListArray = Object.keys(props.serviceSheetStatusList).map((key) => {
          return {display: props.serviceSheetStatusList[key], value: props.serviceSheetStatusList[key]}
        });
     
        this.setState({
          serviceSheetStatusList: [...ssnStatusListArray]
          })
      }

    if (!isEmpty(props.ssndetails)) {
      this.changeLoaderState(false);
      this.setState({

        ssndetails: {
          poNoFrom: "",
          poNoTo: "",
          ssnNoFrom: "",
          ssnNoTo: "",
          ssnDateFrom: "",
          ssnDateTo: "",
          isPONoFilter: "",
          isSsnNoFilter: "",
          isSsnDateFilter: "",
          vendorCode:"",
          status:'',
         requestedBy:"",
         plant:""
        }
      })
    }

  }
  clearFields=()=>{
  this.setState({
    ssndetails: {
      poNoFrom: "",
      poNoTo: "",
      ssnNoFrom: "",
      ssnNoTo: "",
      ssnDateFrom: "",
      ssnDateTo: "",
      isPONoFilter: "",
      isSsnNoFilter: "",
      isSsnDateFilter: "",
      vendorCode:"",
      status:'',
     requestedBy:"",
     plant:""
    },
  })
}
  exportReportToExcel() {
    TableToExcel.convert(document.getElementById("ssnLineReport"),{
       name:"SSNLineReport.xlsx"
    });
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

   if (this.state.ssndetails.ssnNoFrom != "" || this.state.ssndetails.poNoFrom != "" || this.state.ssndetails.ssnDateFrom != "" || this.state.ssndetails.vendorCode!="" || this.state.ssndetails.status!=''|| this.state.ssndetails.requestedBy!=""|| this.state.ssndetails.plant!="") {
    
      this.isLoading.hidden = true;

} else {

      window.alert('Please Enter One of Above Value')
      this.changeLoaderState = false;
     return false;
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
  
    const filteredData = this.props.ssnLinereportlist.filter((entry) => {
      return searchInObject(entry, searchQuery);
    });
       const columns = [
  {
    name: 'SSN No',
    selector: row => row.advanceshipmentnotice.serviceSheetNo,
    sortable: true
  },
{
    name: 'SSN Date',
    selector: row => row.advanceshipmentnotice.created,
    cell: row => formatDate(row.advanceshipmentnotice.created),
    sortable: true
  },
{
    name: 'SSN Created By',
    selector: row => row.advanceshipmentnotice.createdBy===null?"":(row.advanceshipmentnotice.createdBy.userDetails===null?"":row.advanceshipmentnotice.createdBy.userDetails.name),
    sortable: true
  },

  {
    name: 'PO No',
    selector: row =>row.advanceshipmentnotice.po.purchaseOrderNumber,
    sortable: true
  },
  {
    name: 'PO Date',
    selector: row => row.advanceshipmentnotice.po.created,
    cell: row => formatDate(row.advanceshipmentnotice.po.created),
    sortable: true
  },
  {
    name: 'Service Posting Date',
    selector: row => row.advanceshipmentnotice.servicePostingDate,
    cell: row => row.advanceshipmentnotice.servicePostingDate!=null?formatDate(row.advanceshipmentnotice.servicePostingDate):"",
    sortable: true
  },
{
    name: 'Approved By',
    selector: row =>  row.advanceshipmentnotice.ssnApprovedBy===null?"":(row.advanceshipmentnotice.ssnApprovedBy.userDetails===null?"":row.advanceshipmentnotice.ssnApprovedBy.userDetails.name),
    sortable: true
  },
{
    name: 'Approved Date',
    selector: row =>  row.advanceshipmentnotice.ssnApprovedDate,
    cell: row =>  row.advanceshipmentnotice.ssnApprovedDate!=null?formatDate(row.advanceshipmentnotice.ssnApprovedDate):"",
    sortable: true
  },
{
    name: 'Service Line No',
    selector: row =>  row.poLine.lineItemNumber,
    sortable: true
  },
{
    name: 'Material Description',
    selector: row =>  row.poLine.code+"-"+row.poLine.name,
    sortable: true
  },

{
    name: 'Quantity',
    selector: row =>  row.deliveryQuantity,
    sortable: true
  },

  {
    name: 'Invoice No',
    selector: row => row.advanceshipmentnotice.invoiceNo===null?"":row.advanceshipmentnotice.invoiceNo,
    sortable: true
  },
 {
    name: 'Invoice Date',
    selector: row => row.advanceshipmentnotice.invoiceDate,
    cell: row => row.advanceshipmentnotice.invoiceDate===null?"":formatDate(row.advanceshipmentnotice.invoiceDate),
    sortable: true
  },
 {
    name: 'Status',
    selector: row => row.advanceshipmentnotice.status,
    sortable: true
  }]
    return (
      <>

        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          {<UserDashboardHeader />}
          {/* {<NewHeader/>} */}
          
          <div className="wizard-v1-content" style={{marginTop:"80px"}}>
          {this.state.openModal && <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
          <div className="modal-backdrop"></div> <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {
                  this.changeLoaderState(true);
                  this.setState({openModal:false})
                 commonSubmitForm(e, this, "ssnResponse", "/rest/getSSNLineReport", "reports");
                 this.clearFields();
                }} noValidate
              >
                <div className="col-sm-12">
                  <div className="row mt-2">                   
                    <div className="col-sm-6 mb-5">
                      <TextField variant="outlined" size="small" fullWidth label="SSN No. From" type="text" className={"form-control"} name="ssnNoFrom"
                        value={this.state.ssndetails.ssnNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "ssndetails.ssnNoFrom", "reports")
                          }
                        }}
                        InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />

                    </div>
                    <div className="col-sm-6 mb-5">
                    <TextField variant="outlined" size="small" fullWidth label="SSN No. To" type="text" className="form-control" name="ssnNoTo" value={this.state.ssndetails.ssnNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.ssnNoTo", "reports")
                        }


                      }}
                      InputLabelProps={{ shrink: true }}  
           inputProps={{ style: { fontSize: 12, height: "15px",  } }}  />
                    </div>
                    <div className="col-sm-6 mb-5">

                    <TextField variant="outlined" size="small" fullWidth label="Po No. From" type="text" className="form-control" name="poNoFrom" value={this.state.ssndetails.poNoFrom} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.poNoFrom", "reports")
                        }


                      }} InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                    </div>

                   
                    <div className="col-sm-6 mb-5">
                    <TextField variant="outlined" size="small" fullWidth label="Po No. To" type="text" className="form-control" name="poNoTo" value={this.state.ssndetails.poNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.poNoTo", "reports")
                        }


                      }} InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                    </div>
                       
                        <div className="col-sm-6 mb-5">

                        <TextField variant="outlined" size="small" fullWidth label="SSN Date From" InputLabelProps={{shrink:true}} type="date" className="form-control" name="ssnDateFrom" value={this.state.ssndetails.ssnDateFrom} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "ssndetails.ssnDateFrom", "reports")
                            }


                          }} 
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                        </div>

                        <div className="col-sm-6 mb-5">
                        <TextField variant="outlined" size="small" fullWidth label="SSN Date To" InputLabelProps={{shrink:true}} type="date" className="form-control" name="ssnDateTo" value={this.state.ssndetails.ssnDateTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "ssndetails.ssnDateTo", "reports")
                            }


                          }} 
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                        </div>
                            <div className="col-sm-6  mb-5">

                            <TextField variant="outlined" size="small" fullWidth label="Vendor Code" type="text" className="form-control" name="vendorCode" value={this.state.ssndetails.vendorCode} onChange={(event) => {
                                 {
                                  commonHandleChange(event, this, "ssndetails.vendorCode", "reports")
                                }


                              }} InputLabelProps={{ shrink: true }}  
                              inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                            </div>
                            <div className="col-sm-6 mb-5">
                              <FormControl fullWidth size="small" variant="outlined">
                                          <InputLabel shrink>Status</InputLabel>
                                            <Select name="status" 
                                            value={this.state.ssndetails.status} onChange={(event) => {
                                              {
                                               commonHandleChange(event, this, "ssndetails.status", "reports")
                                             }}} label="Status" sx={{ fontSize: 12, height: "15px",  } }>
                                              <MenuItem value="">Select</MenuItem>
                                              {this.state.serviceSheetStatusList.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                                  
                            </div>

                            <div className="col-sm-6">

                            <TextField variant="outlined" size="small" fullWidth label="Requested By" type="text" className="form-control" name="requestedBy" value={this.state.ssndetails.requestedBy} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "ssndetails.requestedBy", "reports")
                                }


                              }} InputLabelProps={{ shrink: true }}  
                              inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                            </div>
                            <div className="col-sm-6">

                            <TextField variant="outlined" size="small" fullWidth label="Plant" type="text" className="form-control" name="plant" value={this.state.ssndetails.plant} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "ssndetails.plant", "reports")
                                }


                              }} InputLabelProps={{ shrink: true }}  
                              inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                            </div>

                        {/* <div className="row text-center">
                          <div className="col-sm-12 text-center mt-3" style={{textAlign:"center"}}>
                            <Button color="primary" size="small" variant="contained" type="submit" className={"btn btn-primary"} onClick={this.handleSearchClick.bind(this)} >
                              Search
                            </Button>
                            <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                                                                     Cancel</Button>
                          </div>
                        </div> */}
                          <Grid item xs={12} className="mt-4" style={{textAlign:"center"}}>
                                   <Button type="submit" size="small" variant="contained" onClick={this.handleSearchClick.bind(this)} color="primary"> Search</Button>
                                    <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                                    Cancel</Button>
                                    <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>

                                  </Grid>
                      </div>
                    </div>

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
                    {/* <Table className="my-table" >
                      <TableHead>
                        <TableRow>
                          <TableCell>SSN No</TableCell>
                          <TableCell>SSN Date</TableCell>
                          <TableCell>SSN Created By</TableCell>
                          <TableCell>PO No</TableCell>
                          <TableCell>PO Date</TableCell>
                          <TableCell>Service Posting Date</TableCell>
                          <TableCell>Approved By</TableCell>
                          <TableCell>Approved Date</TableCell>
                          <TableCell>Service Line No</TableCell>
                          <TableCell>Material Description</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Invoice No</TableCell>
                          <TableCell>Invoice Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>

                      {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ssnlist, index) => (
                          <TableRow >
                            <TableCell>{ssnlist.advanceshipmentnotice.serviceSheetNo}</TableCell>
                            <TableCell>{formatDate(ssnlist.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.createdBy===null?"":(ssnlist.advanceshipmentnotice.createdBy.userDetails===null?"":ssnlist.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.po.purchaseOrderNumber}</TableCell>
                            <TableCell>{formatDate(ssnlist.advanceshipmentnotice.po.created)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.servicePostingDate!=null?formatDate(ssnlist.advanceshipmentnotice.servicePostingDate):""}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.ssnApprovedBy===null?"":(ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails===null?"":ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails.name)}</TableCell>
                           <TableCell>{ssnlist.advanceshipmentnotice.ssnApprovedDate!=null?formatDate(ssnlist.advanceshipmentnotice.ssnApprovedDate):""}</TableCell>
                            <TableCell>{ssnlist.poLine.lineItemNumber}</TableCell>
                            <TableCell>{ssnlist.poLine.code+"-"+ssnlist.poLine.name}</TableCell>
                            <TableCell>{ssnlist.deliveryQuantity}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.invoiceNo===null?"":ssnlist.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.invoiceDate===null?"":formatDate(ssnlist.advanceshipmentnotice.invoiceDate)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}
                 
                  {/* <TablePagination
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
                                />
                                 </TableContainer>
                <div style={{display:"none"}}>
                <Table  id="ssnLineReport">
                      <TableHead>
                        <TableRow>
                          <TableCell>SSN No</TableCell>
                          <TableCell>SSN Date</TableCell>
                          <TableCell>SSN Created By</TableCell>
                          <TableCell>PO No</TableCell>
                          <TableCell>PO Date</TableCell>
                          <TableCell>Service Posting Date</TableCell>
                          <TableCell>Approved By</TableCell>
                          <TableCell>Approved Date</TableCell>
                          <TableCell>Service Line No</TableCell>
                          <TableCell>Material Description</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Invoice No</TableCell>
                          <TableCell>Invoice Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>

                      {this.props.ssnLinereportlist.map((ssnlist, index) => (
                          <TableRow >
                            <TableCell>{ssnlist.advanceshipmentnotice.serviceSheetNo}</TableCell>
                            <TableCell>{formatDate(ssnlist.advanceshipmentnotice.created)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.createdBy===null?"":(ssnlist.advanceshipmentnotice.createdBy.userDetails===null?"":ssnlist.advanceshipmentnotice.createdBy.userDetails.name)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.po.purchaseOrderNumber}</TableCell>
                            <TableCell>{formatDate(ssnlist.advanceshipmentnotice.po.created)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.servicePostingDate!=null?formatDate(ssnlist.advanceshipmentnotice.servicePostingDate):""}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.ssnApprovedBy===null?"":(ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails===null?"":ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails.name)}</TableCell>
                           <TableCell>{ssnlist.advanceshipmentnotice.ssnApprovedDate!=null?formatDate(ssnlist.advanceshipmentnotice.ssnApprovedDate):""}</TableCell>
                            <TableCell>{ssnlist.poLine.lineItemNumber}</TableCell>
                            <TableCell>{ssnlist.poLine.code+"-"+ssnlist.poLine.name}</TableCell>
                            <TableCell>{ssnlist.deliveryQuantity}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.invoiceNo===null?"":ssnlist.advanceshipmentnotice.invoiceNo}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.invoiceDate===null?"":formatDate(ssnlist.advanceshipmentnotice.invoiceDate)}</TableCell>
                            <TableCell>{ssnlist.advanceshipmentnotice.status}</TableCell>
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
  return state.ssnreports;
};
export default connect(mapStateToProps, actionCreators)(SSNReports);