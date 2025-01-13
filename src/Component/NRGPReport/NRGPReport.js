import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmptyDeep, isEmpty } from "../../Util/validationUtil";
import { submitToURL } from "../../Util/APIUtils";
import * as actionCreators from "./Action";
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
import { formatDateWithoutTime,formatDateWithoutTimeNewDate1 } from "../../Util/DateUtil";
import { formatTime } from "../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto } from "../../Util/CommonUtil";
import TableToExcel from "@linways/table-to-excel";


class NRGPReport extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      getASNReportlist: [],
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
      gateEntryListDto: {
        reqNoFrom: "",
        reqNoTo: "",
        docType: "",
        plant: "",
        status: ""
        
      },
      plantDropDownList:[],
      statusDropDownList:[]
    }
  }

  getPartnerId = () => {
    if (!isEmpty(this.props.partner)) {
      return this.props.partner.partnerId;
    } else {
      return "";
    }
  }


  async componentDidMount() {
    submitToURL(`/rest/getRGPPlant`).then(({ objectMap }) => {
      console.log("PLANT LIST ---->>>", objectMap);
      let plantListArray = [];
      Object.keys(objectMap.plantList).map((key) => {
        plantListArray.push({ display: objectMap.plantList[key], value: key });
      });
      this.setState({
        plantDropDownList: plantListArray
      })
    });

    submitToURL(`/rest/getReqStatus`).then(({ objectMap }) => {
      console.log("STATUS LIST ---->>>", objectMap);
      let statusListArray = [];
      Object.keys(objectMap.statusList).map((key) => {
        statusListArray.push({ display: objectMap.statusList[key], value: key });
      });
      this.setState({
        statusDropDownList: statusListArray
      })
    });
  }

  async componentWillReceiveProps(props) {

    if (!isEmpty(props.loaderState)) {
      this.changeLoaderState(props.loaderState);
    }

    if (!isEmpty(props.partner)) {
      this.changeLoaderState(false);
      this.setState({
        loadSaveResp: false,
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
        // partner: action.payload.objectMap.user
        isUserInvited: true,
        inviteMessage: ""
      })
    }

    // if(!isEmpty(props.getASNReportlist)){
    //   let ASNReportListArray = Object.keys(props.getASNReportlist).map(() => {
    //     return {display: props.getASNReportlist, value: ""}
    //   });
    //   this.setState({ getASNReportlist: ASNReportListArray});
    // }

     if (!isEmpty(props.getASNReportlist)) {
      this.changeLoaderState(false);
      this.setState({
        AsnList: this.state.props.getASNReportlist
      })
    } else {
      this.changeLoaderState(false);
    }

    if (!isEmpty(props.asndetails)) {
      this.changeLoaderState(false);
      this.setState({

        gateEntryListDto: {
            reqNoFrom: "",
            reqNoTo: "",
            docType: "",
            plant: "",
            status: ""
            
          }
      })
    }

  }

  getASNReports = () => {

    { /*let UserName = this.state.UserName;
    let email = this.state.email
  let typeOfVendor = this.state.selectedVendorMode*/}
    commonSubmitWithParam(this.props, "gateEntryResponse", "/rest/getGateEntryByFilter");
    this.changeLoaderState(true);
    { /* this.setState({
      checked: {}
    })*/}
  }

  handleFilterChange = (key, event) => {
    this.props.onFilterChange && this.props.onFilterChange(key, event.target.value);
  }

  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  handleSubmit = (e) => {
    this.setState({ loadasnDetails: true });
    commonSubmitForm(e, this, "gateEntryResponse", "/getASNReport")
  }

  handleFilterClick = () => {
    this.props.onFilter && this.props.onFilter();
    this.setState({ formDisplay: !this.state.formDisplay });
    this.setState({ searchDisplay: !this.state.searchDisplay });
  }

  exportReportToExcel() {
    TableToExcel.convert(document.getElementById("RGPLineReport"),{
       name:"RGP_Report.xlsx"
    });
  }

//  handleSearchClick = () => {
//    
//    if(this.state.asndetails.asnNoFrom !="" || this.state.asndetails.poNoFrom !="" || this.state.asndetails.asnDateFrom != ""){
//    //  this.changeLoaderState(false);
//    // commonSubmitForm(e, this, "asnResponse", "/rest/getASNReport", "reports")
//     // return false;
//     this.isLoading.hidden=true;
//
//    }else{
//      
//      window.alert('Please Enter One of Above Value')
//      this.changeLoaderState=false;
//      return false;
//    }
//  }



  render() {
    const {filterGateEntryDocList} = this.props;
    const { filter } = this.props;
    var displayService="none";
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
        <div className="w-100" id="togglesidebar">
          <div className="mt-70 boxContent">
            <FormWithConstraints ref={formWithConstraints => this.printreports = formWithConstraints}
              onSubmit={(e) => {
                
               // this.setState({ asndetails: { test: "" } });
                 this.changeLoaderState(true);
                
                commonSubmitForm(e, this, "gateEntryResponse", "/rest/getGateEntryByFilter", "printreports")
               // this.handleSearchClick(true)
              // this.changeLoaderState(true);
                
              }} noValidate
            >
              
              {/* <input type="hidden" name='asndetails[userId]'
              value={this.state.partner.partnerId} 
              /> */}



<div className="col-sm-12">
              <div className="row mt-2">
                <label className="col-sm-2 mt-4">REQ No</label>
                <div className="col-sm-2">
                  <input type="text" className={"form-control"} name="reqNoFrom" value={this.state.gateEntryListDto.reqNoFrom} onChange={(event) => {
                      if (event.target.value.length < 60) {
                        commonHandleChange(event, this, "gateEntryListDto.reqNoFrom", "printreports")
                      }
                    }} />

                </div>
                <label>To </label>
                <div className="col-sm-2">
                  <input type="text" className="form-control" name="reqNoTo" value={this.state.gateEntryListDto.reqNoTo} onChange={(event) => {
                    if (event.target.value.length < 60) {
                      commonHandleChange(event, this, "gateEntryListDto.reqNoTo", "printreports")
                    }


                  }} />
                </div></div>
                {/* <div className="row mt-2">
                <label className="col-sm-2 mt-4">Doc Type</label>
              <div className="col-sm-2">
              <select className="form-control"
              name="docType"
              value={this.state.gateEntryListDto.docType}
              // disabled={gateEntryDto.reqNo}
              onChange={(event) => {
                commonHandleChange(event, this, "gateEntryListDto.docType", "printreports")
            }}
              >
                <option value="">Select</option>
                      <option value="NRGP">NRGP</option>
                      <option value="RGP">RGP</option>
              </select>
            </div>
            </div> */}
            <div className="row mt-2">
            <label className="col-sm-2 mt-4">Plant </label>
                  <div className="col-sm-2" >
                    <select className="form-control" name="plant" 
                      //value={gateEntryDto.plant}
                     // disabled={gateEntryDto.reqNo}
                     onChange={(event) => {
                      commonHandleChange(event, this, "gateEntryListDto.plant", "printreports")
                  }}
                    >
                      <option value="">Select</option>
                      {(this.state.plantDropDownList).map(item =>

                        <option value={item.value}>{item.display}</option>
                      )}

                    </select>
                  </div>
            <label> Status </label>
                  <div className="col-sm-2" >
                    <select className="form-control" name="status" 
                      //value={gateEntryDto.plant}
                     // disabled={gateEntryDto.reqNo}
                     onChange={(event) => {
                      commonHandleChange(event, this, "gateEntryListDto.status", "printreports")
                  }}
                    >
                      <option value="">Select</option>
                      {(this.state.statusDropDownList).map(item =>

                        <option value={item.value}>{item.display}</option>
                      )}

                    </select>
                  </div>
                </div>
                
            </div>
              <div className="col-sm-12">

                <div className="row mt-2">

                  <div className="col-sm-12">

                    <div className="row mt-2">

                      <div className="row">

                        <div className="col-sm-12 text-center">
                          <button type="submit" className={"btn btn-primary"}>
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


          <div className="row px-4 py-2">
            <div className="mt-2 boxContent">
              <div class="table-proposed">
                <StickyHeader height={"65vh"} >
                  <table className="table table-bordered table-header-fixed" id="RGPLineReport">
                    <thead>
                      <tr>

                        <th>Req No</th>
                        <th>Req Date</th>
                        <th>Return By</th>
                        {/* <th>Department Name</th> */}
                        <th>Requestioner Name</th>
                        <th>Vehicle No</th>
                        <th>Vendor Name</th>
                        {/* <th>Vendor Address</th> */}                       
                        <th>Doc Type</th>
                        <th>Plant</th>
                        <th>Material Details</th>
                        <th>UOM</th>
                        <th>Quantity</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        
                      </tr>
                    </thead>
                    <tbody id="DataTableBody">
                      {this.props.gateEntryListDto.map((gaterntryline) => (
                        <tr>
                          <td>{gaterntryline.gateEntry.reqNo}</td>
                          <td>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.created)}</td>
                          <td>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.returnBy)}</td>
                          {/* <td></td> */}
                          <td>{gaterntryline.gateEntry.createdBy!=null?gaterntryline.gateEntry.createdBy.userDetails.name:""}</td>
                          <td>{gaterntryline.gateEntry.vehicleNo}</td>
                          <td>{gaterntryline.gateEntry.vendorName}</td>
                          {/* <td>{ge.vendorAddress}</td> */}
                          
                          <td>{gaterntryline.gateEntry.docType}</td>
                          <td>{gaterntryline.gateEntry.plant}</td>
                          <td>{gaterntryline.materialCode}</td>
                          <td>{gaterntryline.uom}</td>
                          <td>{gaterntryline.materialQty}</td>
                          <td>{gaterntryline.purpose}</td>
                          <td>{gaterntryline.gateEntry.status}</td>
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
        
        { }</React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.nrgpReport;
};
export default connect(mapStateToProps, actionCreators)(NRGPReport);