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
import { formatDateWithoutTime } from "./../../Util/DateUtil";
import { formatTime,formatDate1 } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto } from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import formatDate from '../../Util/DateUtil';
import ReportVechicle from "../ReportVehicle/ReportVehicle";

class OutwardReport extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
      isLoading: false,
      outwardReportlist: [],
      asnStatusList:[],
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
          <div 
          //className="w-100" 
          id="togglesidebar"

          className={
            (this.state.loadReportVehicle == true
              ? "display_none"
              : "display_block")
          }>
            <div className="mt-70 boxContent">
              <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);

                  commonSubmitForm(e, this, "outwardResponse", "/rest/getOutwardReport", "reports")
                  // this.handleSearchClick(true)
                  // this.changeLoaderState(true);

                }} noValidate
              >
                <div className="col-sm-12">
                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">Sales Order No</label>
                    <div className="col-sm-2">
                      <input type="text" className={"form-control"} name="salesOrderNoFrom"
                        value={this.state.outwardDetails.salesOrderNoFrom}
                        onChange={(event) => {
                          if (event.target.value.length < 60) {
                            commonHandleChange(event, this, "outwardDetails.salesOrderNoFrom", "reports")
                          }
                        }} />

                    </div>
                   </div></div>
                <div className="col-sm-12">

                  <div className="row mt-2">
                    <label className="col-sm-2 mt-4">Request No</label>
                    <div className="col-sm-2">

                      <input type="text" className="form-control" name="requestNoFrom" value={this.state.outwardDetails.requestNoFrom} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "outwardDetails.requestNoFrom", "reports")
                        }


                      }} />
                    </div>

                    <label>To </label>
                    <div className="col-sm-2">
                      <input type="text" className="form-control" name="requestNoTo" value={this.state.outwardDetails.requestNoTo} onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "outwardDetails.requestNoTo", "reports")
                        }


                      }} />
                    </div>
                    <div className="col-sm-12">

                      <div className="row mt-2">
                        <label className="col-sm-2 mt-4">Request Date</label>
                        <div className="col-sm-2">

                          <input type="date" className="form-control" name="requestDateFrom" value={this.state.outwardDetails.requestDateFrom} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "outwardDetails.requestDateFrom", "reports")
                            }


                          }} />
                        </div>

                        <label>To </label>
                        <div className="col-sm-2">
                          <input type="date" className="form-control" name="requestDateTo" value={this.state.outwardDetails.requestDateTo} onChange={(event) => {
                            if (event.target.value.length < 60) {
                              commonHandleChange(event, this, "outwardDetails.requestDateTo", "reports")
                            }


                          }} />
                        </div>
                        <div className="col-sm-12">

                          <div className="row mt-2">
                            <label className="col-sm-2 mt-4">Frieght Scope </label>
                            <div className="col-sm-2">
                            <select className={"form-control"} name="freightScope">
                            <option value="">Select</option>
                              <option value="AACL">AACL</option>
                              <option value="Customer">Customer</option>
                            </select>
                            </div>
                            <label className="col-sm-1">Status </label>
                            <div className="col-sm-2">
                              <select className={"form-control"} name="status"
                             value={this.state.outwardDetails.status} onChange={(event) => {
                              {
                               commonHandleChange(event, this, "outwardDetails.status", "reports")
                             }}}
                              ><option value="">Select</option>
                              {(this.state.asnStatusList).map(item=>
                                <option value={item.value}>{item.display}</option>
                              )}
                            </select>
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-12">
                          <div className="row mt-2">
                            <label className="col-sm-2 mt-4">Plant</label>
                            <div className="col-sm-2">

                            <input type="text" className="form-control" name="plant" value={this.state.outwardDetails.plant} onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "outwardDetails.plant", "reports")
                                }


                              }} />
                            </div>
                           
                           
                            <div className="col-sm-2">
                                      
                                        <button type="submit" className={"btn btn-primary"}
                                       //  onClick={this.handleSearchClick.bind(this)}
                                          >
                                          Search
                                        </button>
                                  </div>
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
                    <table className="table table-bordered table-header-fixed" id="table1">
                      <thead>
                        <tr>

                          <th>Sales Order No</th>
                          <th>Request No</th>
                          <th>Status</th>
                          {/* <th>Requested By</th> */}
                           {/* <th>Invoice No</th>
                          <th>Invoice Date</th> */}
                         {/* <th>Invoice Amt</th> */}
                          <th>Created By</th>
                          <th>Created Date</th>
                          <th>Created Time</th>
                          <th>Reported By</th>
                          <th>Reported Date</th>
                          <th>Reported Time</th>
                          <th>Gate In By</th>
                          <th>Gate In Date</th>
                          <th>Gate In Time</th>
                          <th>Closed By</th>
                          <th>Gate Out Date</th>
                          <th>Gate Out Time</th>
                          <th>Diff (In time & Out time)</th>
                        </tr>
                      </thead>
                      <tbody id="DataTableBody">
                        {this.props.outwardReportlist.map((asn, index) => (
                          <tr onClick={() => this.handleVehicleRegistrationDetails(asn)} >
                            <td>{asn.saleOrderNo}</td>
                          
                             <td>{asn.requestNo}</td>
                          
                            <td>{this.getStatusFullForm(asn)}</td>
                            <td>{asn.createdBy===null?"":(asn.createdBy.userDetails.name)}</td>
                            <td>{formatDateWithoutTime(asn.created)}</td>
                            <td>{formatTime(asn.created)}</td>
                            <td>{asn.reportedby===null?"":(asn.reportedby.userDetails.name)}</td>
                            <td>{asn.reporteddate===null?"":formatDateWithoutTime(asn.reporteddate)}</td>
                            <td>{asn.reporteddate===null?"":formatTime(asn.reporteddate)}</td>
                            <td>{asn.gateInby==null?"":(asn.gateInby.userDetails.name)}</td>
                            <td>{asn.gateIndate===null?"":formatDateWithoutTime(asn.gateIndate)}</td>
                            <td>{asn.gateIndate===null?"":formatTime(asn.gateIndate)}</td>
                            <td>{asn.gateOutby==null?"":(asn.gateOutby.userDetails.name)}</td>
                            <td>{asn.gateOutdate===null?"":formatDateWithoutTime(asn.gateOutdate)}</td>
                            <td>{asn.gateOutdate===null?"":formatTime(asn.gateOutdate)}</td>
                            <td>{asn.gateOutdate===null?"":
                            this.getinoutTimeDifference(formatDate1(asn.gateIndate),formatDate1(asn.gateOutdate))}</td>
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
                            <td>{asn.gateOutDate===null?"":formatDateWithoutTime(asn.gateOutDate)}</td>
                            <td>{asn.gateOutDate===null?"":formatTime(asn.gateOutDate)}</td>
                            <td>{asn.closedBy==null?"":(asn.closedBy.userDetails.name)}</td>  */}


                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div>
                      <button className="btn btn-primary" onClick={this.exportReportToExcel}> Download Excel</button>
                    </div>
                  </StickyHeader>
                </div>

              </div>
            </div>
            </div>


          </div>
          <div className={
              (this.state.loadReportVehicle == true
                ? "display_block"
                : "display_none")
            }  
            >
               {/* <VechicalRegistration
          showSubmitButton={false}
          vehicleRegForm={this.state.vehicleRegForm}
          vehicleRegSAPUpdate={this.state.vehicleRegSAPUpdate}
        /> */}
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