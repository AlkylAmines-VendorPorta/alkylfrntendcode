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
import { formatDateWithoutTime,formatTime} from "./../../Util/DateUtil";
//import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict} from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import { API_BASE_URL } from "./../../Constants";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import formatDate from '../../Util/DateUtil';





class ASNReports extends Component {

  constructor(props) {

    super(props)
    this.state = {
      
      isLoading: false,
      getASNReportlist: [],
      asnStatusList:[],
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

  



  render() {
    let asnheaderlist=this.state.asnnewDetails;
    const attachmentId=this.state.attachmentId;
    const ExcelFileName=this.state.fileName;
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
          <div className="w-100" id="togglesidebar">
            <div className="mt-70 boxContent">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);

                  //    commonSubmitForm(e, this, "asnResponse", "/rest/getASNReport", "reports")
              commonSubmitForm(e, this, "asnLineResponse", "/rest/getASNLineReport", "reports");
                  // this.handleSearchClick(true)
                  // this.changeLoaderState(true);

                }} noValidate
              >

                {/* <input type="hidden" name='asndetails[userId]'
              value={this.state.partner.partnerId} 
              /> */}



                <div className="col-sm-12">
                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">ASN No</label>
                    <div className="col-sm-2">
                      <input type="text" className={"form-control"} name="asnNoFrom"
                        value={this.state.asndetails.asnNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "asndetails.asnNoFrom", "reports")
                          }
                        }} />

                    </div>
                    <label>To </label>
                    <div className="col-sm-2">
                      <input type="text" className="form-control" name="asnNoTo" value={this.state.asndetails.asnNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "asndetails.asnNoTo", "reports")
                        }


                      }} />
                    </div></div></div>
                <div className="col-sm-12">

                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">Po No</label>
                    <div className="col-sm-2">

                      <input type="text" className="form-control" name="poNoFrom" value={this.state.asndetails.poNoFrom} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "asndetails.poNoFrom", "reports")
                        }


                      }} />
                    </div>

                    <label>To </label>
                    <div className="col-sm-2">
                      <input type="text" className="form-control" name="poNoTo" value={this.state.asndetails.poNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "asndetails.poNoTo", "reports")
                        }


                      }} />
                    </div>
                    <div className="col-sm-12">

                      <div className="row mt-2">
                        <label className="col-sm-2 mt-4">ASN Date</label>
                        <div className="col-sm-2">

                          <input type="date" className="form-control" name="asnDateFrom" value={this.state.asndetails.asnDateFrom} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "asndetails.asnDateFrom", "reports")
                            }


                          }} />
                        </div>

                        <label>To </label>
                        <div className="col-sm-2">
                          <input type="date" className="form-control" name="asnDateTo" value={this.state.asndetails.asnDateTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "asndetails.asnDateTo", "reports")
                            }


                          }} />
                        </div>
                        <label className="col-sm-1">GateIN Date</label>
                        <div className="col-sm-2">

                          <input type="date" className="form-control" name="gateInDateFrom" value={this.state.asndetails.gateInDateFrom} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "asndetails.gateInDateFrom", "reports")
                            }


                          }} />
                        </div>

                        <label>To </label>
                        <div className="col-sm-2">
                          <input type="date" className="form-control" name="gateInDateTo" value={this.state.asndetails.gateInDateTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "asndetails.gateInDateTo", "reports")
                            }


                          }} />
                        </div>
                        <div className="col-sm-12">

                          <div className="row mt-2">
                            <label className="col-sm-2 mt-4">Vendor Code</label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="vendorCode" value={this.state.asndetails.vendorCode} onChange={(event) => {
                                 {
                                  commonHandleChange(event, this, "asndetails.vendorCode", "reports")
                                }


                              }} />
                            </div>
                            <label>To </label>
                           <div className="col-sm-2">
                          <input type="text" className="form-control" name="vendorCodeTo" value={this.state.asndetails.vendorCodeTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "asndetails.vendorCodeTo", "reports")
                            }


                          }} />
                        </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          
                          </div>
                        </div>
                        <div className="col-sm-12">

<div className="row mt-2">
  <label className="col-sm-2 mt-4">Item Code</label>
  <div className="col-sm-2">

    <input type="text" className="form-control" name="itemCodeFrom" value={this.state.asndetails.itemCodeFrom} onChange={(event) => {
       {
        commonHandleChange(event, this, "asndetails.itemCodeFrom", "reports")
      }


    }} />
  </div>

  <label>To </label>
 <div className="col-sm-2">
        <input type="text" className="form-control" name="itemCodeTo" value={this.state.asndetails.itemCodeTo} onChange={(event) => {
  if (event.target.value.length < 60) {
    commonHandleChange(event, this, "asndetails.itemCodeTo", "reports")
  }


}} />
</div>
 
</div>
</div>

                        <div className="col-sm-12">
                          <div className="row mt-2">
                            {/* <label className="col-sm-2 mt-4">Requested By</label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="requestedBy" value={this.state.asndetails.requestedBy} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "asndetails.requestedBy", "reports")
                                }


                              }} />
                            </div> 
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <label className="col-sm-2 mt-4">Plant </label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="plant" value={this.state.asndetails.plant} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "asndetails.plant", "reports")
                                }


                              }} />
                            </div>
                            <label className="col-sm-1">Status </label>
                            

                            <div className="col-sm-3">
                              <select className={"form-control"} name="status"
                             value={this.state.asndetails.status} onChange={(event) => {
                              {
                               commonHandleChange(event, this, "asndetails.status", "reports")
                             }}}
                              ><option value="">Select</option>
                              {(this.state.asnStatusList).map(item=>
                                <option value={item.value}>{item.display}</option>
                              )}
                            </select></div>
                           
                          </div></div>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                        <div className="row">

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

          <div className="mt-2 boxContent">
            <div className="row" >
              <div className="col-sm-12">
                <div class="table-proposed">
                  <StickyHeader height={"65vh"} >
                    <table className="table table-bordered table-header-fixed"  id="AsnLineReport">
                      <thead>
                        <tr>

                          <th>ASN No</th>
                          <th>ASN Date</th>
                          <th>PO No</th>
                          <th>PO Date</th>
                          <th>Status</th>
                          <th>Vendor Name</th>
                          <th>Vehicle Number</th>
                          <th>Lr No.</th>
                          <th>Transport Name</th>
                          {/* <th>Requested By</th> */}
                          <th>Line No</th>
                          <th>Material Description</th>
                          <th>Qty</th>
                          <th>Uom</th>
                          <th>Rate</th>
                           <th>Invoice No</th>
                          <th>Invoice Date</th>
                         {/* <th>Invoice Amt</th> */}
                          <th>Created By</th>
                          <th>Reported By</th>
                          <th>Reported Date</th>
                          <th>Reported Time</th>
                          <th>Gate In By</th>
                          <th>Gate In Date</th>
                          <th>Gate In Time</th>
                          <th>103 Posted By</th> 
                          <th>103 Posted Date</th>
                          <th>103 Posted Time</th>                         
                          <th>103 Doc No</th>
                          <th>105 Posted By</th>
                          <th>105 Posted Date</th> 
                          <th>105 Posted Time</th>                        
                          <th>105 Doc No</th>
                          <th>Gate Out Date</th>
                          <th>Gate Out Time</th>
                          <th>Closed By</th>
                          <th>Diff. (Vehicle In time & Out Time)</th>
                        </tr>
                      </thead>
                      <tbody id="DataTableBody">
                        {/* {this.props.getASNReportlist.map((asn, index) => ( */}
                          {this.state.asnLinereportlist.map((asnLine, index) => (
                          <tr>
                            <td>{asnLine.advanceshipmentnotice.advanceShipmentNoticeNo}</td>
                            <td>{asnLine.advanceshipmentnotice.created===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.created)}</td>
                            <td>{asnLine.advanceshipmentnotice.po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(asnLine.advanceshipmentnotice.po.created)}</td>
                            <td>{asnLine.advanceshipmentnotice.status}</td>
                            <td>{asnLine.advanceshipmentnotice.po.vendorName}</td>
                            <td>{asnLine.advanceshipmentnotice.vehicalNo}</td>
                            <td>{asnLine.advanceshipmentnotice.lrNumber}</td>
                            <td>{asnLine.advanceshipmentnotice.transporterNo}</td>
                            <td>{asnLine.poLine.lineItemNumber}</td>
                            <td>{asnLine.poLine.code+"-"+asnLine.poLine.name}</td>
                            <td>{asnLine.deliveryQuantity}</td>
                            <td>{asnLine.poLine.uom}</td>
                            <td>{asnLine.poLine.rate}</td>
                            <td>{asnLine.advanceshipmentnotice.invoiceNo}</td>
                            <td>{asnLine.advanceshipmentnotice.invoiceDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.invoiceDate)}</td>
                                                    
                            <td>{asnLine.advanceshipmentnotice.createdBy===null?"":(asnLine.advanceshipmentnotice.createdBy.userDetails===null?"":asnLine.advanceshipmentnotice.createdBy.userDetails.name)}</td>
                            <td>{asnLine.advanceshipmentnotice.reportedBy===null?"":(asnLine.advanceshipmentnotice.reportedBy.userDetails===null?"":asnLine.advanceshipmentnotice.reportedBy.userDetails.name)}</td>
                            <td>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.reportedDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.reportedDate===null?"":formatTime(asnLine.advanceshipmentnotice.reportedDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateinBy==null?"":(asnLine.advanceshipmentnotice.gateinBy.userDetails===null?"":asnLine.advanceshipmentnotice.gateinBy.userDetails.name)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateInDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateInDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateInDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateinPostedby==null?"":(asnLine.advanceshipmentnotice.gateinPostedby.userDetails===null?"":asnLine.advanceshipmentnotice.gateinPostedby.userDetails.name)}</td>
                            <td> {asnLine.advanceshipmentnotice.date_103===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.date_103)}</td>  
                             <td>{asnLine.advanceshipmentnotice.date_103===null?"":formatTime(asnLine.advanceshipmentnotice.date_103)}</td>                          
                            <td>{asnLine.advanceshipmentnotice.sap103Id===null?"":asnLine.advanceshipmentnotice.sap103Id}</td>
                            <td>{asnLine.advanceshipmentnotice.grnPostedby==null?"":(asnLine.advanceshipmentnotice.grnPostedby.userDetails===null?"":asnLine.advanceshipmentnotice.grnPostedby.userDetails.name)}</td>
                            <td>{asnLine.advanceshipmentnotice.grnDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.grnDate)}</td> 
                            <td>{asnLine.advanceshipmentnotice.grnDate===null?"":formatTime(asnLine.advanceshipmentnotice.grnDate)}</td>                          
                            <td>{asnLine.advanceshipmentnotice.grnId===null?"":asnLine.advanceshipmentnotice.grnId}</td>
                            <td>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatDateWithoutTime(asnLine.advanceshipmentnotice.gateOutDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateOutDate===null?"":formatTime(asnLine.advanceshipmentnotice.gateOutDate)}</td>
                            <td>{asnLine.advanceshipmentnotice.closedBy==null?"":(asnLine.advanceshipmentnotice.closedBy.userDetails===null?"":asnLine.advanceshipmentnotice.closedBy.userDetails.name)}</td>
                            <td>{asnLine.advanceshipmentnotice.gateOutDate===null?"":
                            this.getinoutTimeDifference(formatDate(asnLine.advanceshipmentnotice.gateInDate),formatDate(asnLine.advanceshipmentnotice.gateOutDate))}</td>
                            {/* <td>{asn.advanceShipmentNoticeNo}</td>
                            <td>{asn.created===null?"":formatDateWithoutTime(asn.created)}</td>
                            <td>{asn.po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(asn.po.created)}</td>
                            <td>{asn.status}</td>
                            <td>{asn.po.vendorName}</td>
                            {/* <td>{asn.po.reqby.name}</td> 
                            <td>{asn.invoiceNo}</td>
                            <td>{asn.invoiceDate===null?"":formatDateWithoutTime(asn.invoiceDate)}</td>
                            {/* <td>{getCommaSeperatedValue(getDecimalUpto(asn.invoiceAmount, 2))}</td>                          
                             <td>{asn.createdBy===null?"":(asn.createdBy.userDetails.name)}</td>
                            <td>{asn.reportedBy===null?"":(asn.reportedBy.userDetails.name)}</td>
                            <td>{asn.reportedDate===null?"":formatDateWithoutTime(asn.reportedDate)}</td>
                            <td>{asn.reportedDate===null?"":formatTime(asn.reportedDate)}</td>
                            <td>{asn.gateinBy==null?"":(asn.gateinBy.userDetails.name)}</td>
                            <td>{asn.gateInDate===null?"":formatDateWithoutTime(asn.gateInDate)}</td>
                            <td>{asn.gateInDate===null?"":formatTime(asn.gateInDate)}</td>
                            <td>{asn.gateinPostedby==null?"":(asn.gateinPostedby.userDetails.name)}</td>
                            <td> {asn.date_103===null?"":formatDateWithoutTime(asn.date_103)}</td>  
                             <td>{asn.date_103===null?"":formatTime(asn.date_103)}</td>                          
                            <td>{asn.sap103Id===null?"":asn.sap103Id}</td>
                            <td>{asn.grnPostedby==null?"":(asn.grnPostedby.userDetails.name)}</td> 
                            <td>{asn.grnDate===null?"":formatDateWithoutTime(asn.grnDate)}</td> 
                            <td>{asn.grnDate===null?"":formatTime(asn.grnDate)}</td>                          
                            <td>{asn.grnId===null?"":asn.grnId}</td>
                            <td>{asn.gateOutDate===null?"":formatDateWithoutTime(asn.gateOutDate)}</td>
                            <td>{asn.gateOutDate===null?"":formatTime(asn.gateOutDate)}</td>
                            <td>{asn.closedBy==null?"":(asn.closedBy.userDetails.name)}</td>  */}


                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </StickyHeader>
                </div>

                <div className="row">
                        <div className="col-sm-12 text-center">
                                   <button className="btn btn-success" style={{justifyContent: "center"}} onClick={this.exportReportToExcel}> <i className="fa fa-download" />&nbsp; Download Excel</button>
                                 
                                                </div></div>
              </div>
            </div>
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