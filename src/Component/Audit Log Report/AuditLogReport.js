import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "../Audit Log Report/Action"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button, Grid, IconButton } from "@material-ui/core";
import "./../ASNReports/user.css";
import {
  commonSubmitForm, commonHandleChange} from "../../Util/ActionUtil";
import {searchTableDataTwo } from "../../Util/DataTable";
import { FormWithConstraints } from 'react-form-with-constraints';
import Loader from "../FormElement/Loader/LoaderWithProps";
import { formatDateWithoutTime} from "../../Util/DateUtil";

import TableToExcel from "@linways/table-to-excel";
class AuditLogReport extends Component {

    constructor(props) {
      super(props)
      this.state = {
        
        isLoading: false,
        auditreportlist: [],
        searchQuery: "",
        page: 0,
        rowsPerPage: 50,
        openModal:false,
        auditreportdetails: {
          uniqueCode: "",
          periodFrom:"",
          periodTo:""
           
            
        },
        
      }
    }


    async componentDidMount() {
       
    
       }
     
       async componentWillReceiveProps(props) {

        if (!isEmpty(props.loaderState)) {
          this.changeLoaderState(props.loaderState);
        }


        if (!isEmpty(props.auditreportlist)) {
          this.changeLoaderState(false);
          this.setState({
            auditreportlist: props.auditreportlist
          })
        } else {
          this.changeLoaderState(false);
        }

       }


       changeLoaderState = (action) => {
        this.setState({
          isLoading: action
        });
      }

      exportReportToExcel() {
        TableToExcel.convert(document.getElementById("AuditLogReport"),{
           name:"AuditLogReport.xlsx"
        });
      }


      handleSearchClick = () => {

        if (this.state.auditreportdetails.periodFrom != "" || this.state.auditreportdetails.periodTo != "") {
        
          this.isLoading.hidden = true;
    
        } else {
    
          window.alert('Please Select atleast from Date')
          this.changeLoaderState = false;
          return false;
        }
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
    
      exportReportToExcel = () => {
        TableToExcel.convert(document.getElementById("AuditLogReport"), {
          name: "AuditLogReport.xlsx",
        });
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
        const { auditreportlist, searchQuery, page, rowsPerPage, isLoading } = this.state;

        const filteredData = auditreportlist.filter((entry) =>
          Object.values(entry).some((val) =>
            val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        return (
            <>
      
              <React.Fragment>
                <Loader isLoading={isLoading} />
                {<UserDashboardHeader />}
                {/* {<NewHeader/>} */}
                <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
              
            {this.state.openModal && 
            <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
                                   <div className="modal-backdrop"></div>
                                    <div className="modal-dialog modal-sm">
                                       <div className="modal-content">
                    <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                      onSubmit={(e) => {
      
                     this.changeLoaderState(true);
                     this.setState({openModal:false})
      
                   commonSubmitForm(e, this, "auditResponse", "/rest/getLogReport", "reports");
                 
                      }} noValidate
                    >
                      <div className="col-sm-12">
                        <div className="row mt-2">
                                           <div className="col-sm-12 mb-4 mt-4">

                                                 <TextField variant="outlined" size="small" label="Period From" InputLabelProps={{shrink:true}} type="date" className="form-control" onKeyDown={this.controlSubmit}
                                                  value={this.state.auditreportdetails.periodFrom} name="periodFrom" onChange={(event) => {
                                                    if (event.target.value.length < 60) {
                                                       commonHandleChange(event, this, "auditreportdetails.periodFrom", "reports");
                                                    }


                                                 } }   
                                                 inputProps={{ style: { fontSize: 12, height: "15px",  background:"#fff" } }}  />
                                              </div>
                                              
                                           <div className="col-sm-12 mt-4">
                                           <TextField variant="outlined" size="small" label="Period To" InputLabelProps={{shrink:true}} type="date" className="form-control" onKeyDown={this.controlSubmit}
                                           value={this.state.auditreportdetails.periodTo} name="periodTo" onChange={(event) => {
                                          if (event.target.value.length < 60) {
                                           commonHandleChange(event, this, "auditreportdetails.periodTo", "reports")
                                                     }


                          }}inputProps={{ style: { fontSize: 12, height: "15px", background:"#fff"  } }}  />
                       </div> 
                       <div className="col-sm-12 text-center mt-4" style={{textAlign:"center"}}>  
                       <Button size="small" color="primary" variant="contained" type="submit" className={"btn btn-primary"} onClick={this.handleSearchClick.bind(this)}>
                              Search</Button>
                              <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                              Cancel</Button>
                        </div>
                       
                          </div>

                       
                          
                          
                          </div>
                          </FormWithConstraints>
</div></div></div>}
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
              <Table className="my-table" >
                <TableHead>
                  <TableRow>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Updated By</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Updated Column</TableCell>
                    <TableCell>Old Value</TableCell>
                    <TableCell>New Value</TableCell>
                    <TableCell>Unique Key</TableCell>
                    <TableCell>Table Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((audit, index) => (
                    <TableRow key={index}>
                      <TableCell>{audit.createdByName}</TableCell>
                      <TableCell>{formatDateWithoutTime(audit.createdDateTime)}</TableCell>
                      <TableCell>{audit.updatedByName}</TableCell>
                      <TableCell>{formatDateWithoutTime(audit.updatedDateTime)}</TableCell>
                      <TableCell>{audit.updatedColumn}</TableCell>
                      <TableCell>{audit.oldValue}</TableCell>
                      <TableCell>{audit.newValue}</TableCell>
                      <TableCell>{audit.uniqueKey}</TableCell>
                      <TableCell>{audit.tableName}</TableCell>
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
            
          <Table className="my-table" id="AuditLogReport">
          <TableHead>
                  <TableRow>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Updated By</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Updated Column</TableCell>
                    <TableCell>Old Value</TableCell>
                    <TableCell>New Value</TableCell>
                    <TableCell>Unique Key</TableCell>
                    <TableCell>Table Name</TableCell>
                  </TableRow>
                </TableHead>
          {auditreportlist.map((audit, index) => (
                    <TableRow key={index}>
                      <TableCell>{audit.createdByName}</TableCell>
                      <TableCell>{formatDateWithoutTime(audit.createdDateTime)}</TableCell>
                      <TableCell>{audit.updatedByName}</TableCell>
                      <TableCell>{formatDateWithoutTime(audit.updatedDateTime)}</TableCell>
                      <TableCell>{audit.updatedColumn}</TableCell>
                      <TableCell>{audit.oldValue}</TableCell>
                      <TableCell>{audit.newValue}</TableCell>
                      <TableCell>{audit.uniqueKey}</TableCell>
                      <TableCell>{audit.tableName}</TableCell>
                    </TableRow>
                  ))}
                  </Table>
          </div>
                          </div>
                          </React.Fragment>
                          </>
        )
      }
}


const mapStateToProps = (state) => {
    return state.auditlogreports;
  };
  export default connect(mapStateToProps, actionCreators)(AuditLogReport);