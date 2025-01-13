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
import { formatDateWithoutTime } from "./../../Util/DateUtil";
import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto } from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import TableToExcel from "@linways/table-to-excel";


class SSNReports extends Component {

  constructor(props) {
    super(props)
    this.state = {
     // ssnreportlist: [],
     ssnLinereportlist:[],
      serviceSheetStatusList:[],
      //serviceEntrySheetStatusList:[],
      isLoading: false,
      
     
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

  



  render() {

    const { filter } = this.props;
    var displayService = "none";
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    var hidden = {
      display: this.state.hidden ? "none" : "block"
    }
    var frmhidden = {
      display: this.state.formDisplay ? "none" : "block"
    }
    var searchHidden = {
      display: this.state.searchDisplay ? "block" : "none"
    }
    return (
      <>

        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          {<UserDashboardHeader />}
          {/* {<NewHeader/>} */}
          
          <div id="togglesidebar">
            <div className="mt-70 boxContent">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);

                 // commonSubmitForm(e, this, "ssnResponse", "/rest/getSSNReport", "reports")
                 commonSubmitForm(e, this, "ssnResponse", "/rest/getSSNLineReport", "reports")
                  // this.handleSearchClick(true)
                  // this.changeLoaderState(true);

                }} noValidate
              >

                {/* <input type="hidden" name='asndetails[userId]'
              value={this.state.partner.partnerId} 
              /> */}



                <div className="col-sm-12">
                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">SSN No</label>
                    <div className="col-sm-2">
                      <input type="text" className={"form-control"} name="ssnNoFrom"
                        value={this.state.ssndetails.ssnNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "ssndetails.ssnNoFrom", "reports")
                          }
                        }} />

                    </div>
                    <label>To </label>
                    <div className="col-sm-2">
                      <input type="text" className="form-control" name="ssnNoTo" value={this.state.ssndetails.ssnNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.ssnNoTo", "reports")
                        }


                      }} />
                    </div></div></div>
                <div className="col-sm-12">

                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">Po No</label>
                    <div className="col-sm-2">

                      <input type="text" className="form-control" name="poNoFrom" value={this.state.ssndetails.poNoFrom} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.poNoFrom", "reports")
                        }


                      }} />
                    </div>

                    <label>To </label>
                    <div className="col-sm-2">
                      <input type="text" className="form-control" name="poNoTo" value={this.state.ssndetails.poNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "ssndetails.poNoTo", "reports")
                        }


                      }} />
                    </div>
                    <div className="col-sm-12">

                      <div className="row mt-2">
                        <label className="col-sm-2 mt-4">SSN Date</label>
                        <div className="col-sm-2">

                          <input type="date" className="form-control" name="ssnDateFrom" value={this.state.ssndetails.ssnDateFrom} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "ssndetails.ssnDateFrom", "reports")
                            }


                          }} />
                        </div>

                        <label>To </label>
                        <div className="col-sm-2">
                          <input type="date" className="form-control" name="ssnDateTo" value={this.state.ssndetails.ssnDateTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "ssndetails.ssnDateTo", "reports")
                            }


                          }} />
                        </div>
                        <div className="col-sm-12">

                          <div className="row mt-2">
                            <label className="col-sm-2 mt-4">Vendor Code</label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="vendorCode" value={this.state.ssndetails.vendorCode} onChange={(event) => {
                                 {
                                  commonHandleChange(event, this, "ssndetails.vendorCode", "reports")
                                }


                              }} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="col-sm-1">Status </label>
                            

                           <div className="col-sm-3">
                              <select className={"form-control"} name="status"
                             value={this.state.ssndetails.status} onChange={(event) => {
                              {
                               commonHandleChange(event, this, "ssndetails.status", "reports")
                             }}}
                              ><option value="">Select</option>
                              {(this.state.serviceSheetStatusList).map(item=>
                                <option value={item.value}>{item.display}</option>
                              )}
                            </select></div>
                              </div>
                        </div>

                        <div className="col-sm-12">
                          <div className="row mt-2">
                            <label className="col-sm-2 mt-4">Requested By</label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="requestedBy" value={this.state.ssndetails.requestedBy} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "ssndetails.requestedBy", "reports")
                                }


                              }} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="col-sm-1">Plant </label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="plant" value={this.state.ssndetails.plant} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "ssndetails.plant", "reports")
                                }


                              }} />
                            </div>
                           
                          </div></div>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                        <div className="row">
                      {/*  onClick={this.handleSearchClick.bind(this)}*/}
                          <div className="col-sm-12 text-center">
                            <button type="submit" className={"btn btn-primary"} onClick={this.handleSearchClick.bind(this)} >
                              Search
                            </button>
                          </div>
                        </div>

                        {/* <div className="col-sm-3"><button className="btn btn-info blueButton" 
                 onClick={() => {commonSubmitWithParam(this.props, "getasnreports", "/rest/getASNReport")}} 
  
                 type="button">Search</button></div>  */}
                      </div>
                    </div>
                  </div>
                </div>

              </FormWithConstraints>
            </div>


            <div className=" mt-10 boxContent">
              <div className="col-sm-12">
                <div class="table-proposed">
                  <StickyHeader >
                    <table className="table table-bordered table-header-fixed" id="ssnLineReport">
                      <thead>
                        <tr>

                          <th>SSN No</th>
                          <th>SSN Date</th>
                          <th>SSN Created By</th>
                          <th>PO No</th>
                          <th>PO Date</th>
                          <th>Service Posting Date</th>
                          <th>Approved By</th>
                          <th>Approved Date</th>
                          <th>Service Line No</th>
                          <th>Material Description</th>
                          <th>Quantity</th>
                          <th>Invoice No</th>
                          <th>Invoice Date</th>
                          <th>Status</th>
                          {/* <th>SSN Doc No</th> */}
                          {/*<th>Vendor Name</th>
                          <th>Requested By</th>
                          <th>Invoice No</th>
                          <th>Invoice Date</th>
                          <th>Invoice Amt</th>
                          <th>Status</th>
                          <th>Created By</th>
                          <th>Reported Date</th>
                          <th>Reported Time</th>
                          <th>Gate In Date</th>
                          <th>Gate In Time</th>
                          <th>103 Doc No</th>
                          <th>103 Doc Date</th>
                          <th>105 Doc No</th>
                            <th>105 Doc Date</th>*/}
                        </tr>
                      </thead>
                      <tbody>

                      {this.props.ssnLinereportlist.map((ssnlist, index) => (
                          <tr>
                            <td>{ssnlist.advanceshipmentnotice.serviceSheetNo}</td>
                            <td>{formatDateWithoutTime(ssnlist.advanceshipmentnotice.created)}</td>
                            <td>{ssnlist.advanceshipmentnotice.createdBy===null?"":(ssnlist.advanceshipmentnotice.createdBy.userDetails===null?"":ssnlist.advanceshipmentnotice.createdBy.userDetails.name)}</td>
                            <td>{ssnlist.advanceshipmentnotice.po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(ssnlist.advanceshipmentnotice.po.created)}</td>
                            <td>{ssnlist.advanceshipmentnotice.servicePostingDate!=null?formatDateWithoutTime(ssnlist.advanceshipmentnotice.servicePostingDate):""}</td>
                            <td>{ssnlist.advanceshipmentnotice.ssnApprovedBy===null?"":(ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails===null?"":ssnlist.advanceshipmentnotice.ssnApprovedBy.userDetails.name)}</td>
                           <td>{ssnlist.advanceshipmentnotice.ssnApprovedDate!=null?formatDateWithoutTime(ssnlist.advanceshipmentnotice.ssnApprovedDate):""}</td>
                            <td>{ssnlist.poLine.lineItemNumber}</td>
                            <td>{ssnlist.poLine.code+"-"+ssnlist.poLine.name}</td>
                            <td>{ssnlist.deliveryQuantity}</td>
                            <td>{ssnlist.advanceshipmentnotice.invoiceNo===null?"":ssnlist.advanceshipmentnotice.invoiceNo}</td>
                            <td>{ssnlist.advanceshipmentnotice.invoiceDate===null?"":formatDateWithoutTime(ssnlist.advanceshipmentnotice.invoiceDate)}</td>
                            <td>{ssnlist.advanceshipmentnotice.status}</td>
                            {/* <td>{ssnlist.advanceshipmentnotice.sap103Id}</td> */}
                            



                          </tr>
                        ))}
                        
                      {/* {this.props.ssnreportlist.map((ssn, index) => (
                          <tr>
                            <td>{ssn.serviceSheetNo}</td>
                            <td>{formatDateWithoutTime(ssn.created)}</td>
                            <td>{ssn.po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(ssn.po.created)}</td>
                            <td>{ssn.invoiceNo===null?"":ssn.invoiceNo}</td>
                            <td>{ssn.invoiceDate===null?"":formatDateWithoutTime(ssn.invoiceDate)}</td>
                            <td>{ssn.status}</td>
                            



                          </tr>
                        ))} */}


                          
                      </tbody>
                    </table>
                  </StickyHeader>
                </div>

              </div>
            </div>
            <div className="row">
                        <div className="col-sm-12 text-center">
                                   <button className="btn btn-success" style={{justifyContent: "center"}} onClick={this.exportReportToExcel}> <i className="fa fa-download" />&nbsp; Download Excel</button>
                                 
                                                </div></div>

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