import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "./../Early Payment Report/Action";
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
// import { formatTime } from "./../../Util/DateUtil";
import { getCommaSeperatedValue, getDecimalUpto, removeLeedingZeros,addZeroes,textRestrict} from "./../../Util/CommonUtil";
import { isNull } from "lodash-es";
import NewHeader from "../NewHeader/NewHeader";
import { API_BASE_URL } from "./../../Constants";
import TableToExcel from "@linways/table-to-excel";
import moment from "moment";
import formatDate from '../../Util/DateUtil';

class EarlyPaymentReport extends Component {

    constructor(props) {
  
      super(props)
      this.state = {
        
        isLoading: false,
        paymentreportlist: [],
        paymentdetails: {
           vendor: "",
           status:""
            
        },
        paymentStatusList:[]
      }
    }


    async componentDidMount() {
       
      commonSubmitWithParam(this.props, "paymentstatusList", "/rest/getPaymentStatusList");
       }
     
       async componentWillReceiveProps(props) {

        if (!isEmpty(props.loaderState)) {
          this.changeLoaderState(props.loaderState);
        }


        if (!isEmpty(props.paymentreportlist)) {
          this.changeLoaderState(false);
          this.setState({
            paymentreportlist: props.paymentreportlist
          })
        } else {
          this.changeLoaderState(false);
        }

        if(!isEmpty(props.paymentStatusList)){
          let payStatusListArray = Object.keys(props.paymentStatusList).map((key) => {
            return {display: props.paymentStatusList[key], value: props.paymentStatusList[key]}
          });
       
          this.setState({
            paymentStatusList: [...payStatusListArray]
            })
        }

       }


       changeLoaderState = (action) => {
        this.setState({
          isLoading: action
        });
      }

      exportReportToExcel() {
        TableToExcel.convert(document.getElementById("EarlyPaymentReport"),{
           name:"EarlyPaymentReport.xlsx"
        });
      }

      render() {

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
      
                   //  this.changeLoaderState(true);
      
                    commonSubmitForm(e, this, "paymentResponse", "/rest/getEarlyPaymentReport", "reports");
                      
                      }} noValidate
                    >
                      <div className="col-sm-12">
                        <div className="row mt-2">
                          <label className="col-sm-2 mt-4">Vendor</label>
                          <div className="col-sm-2">
                            <input type="text" className={"form-control"} name="vendor"
                              value={this.state.paymentdetails.vendor}
                              onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "paymentdetails.vendor", "reports")
                                }
                              }} />
      
                          </div>

                          <label className="col-sm-1">Status </label>
                            

                            <div className="col-sm-3">
                              <select className={"form-control"} name="status"
                             value={this.state.paymentdetails.status} onChange={(event) => {
                              {
                               commonHandleChange(event, this, "paymentdetails.status", "reports")
                             }}}
                              ><option value="">Select</option>
                              {(this.state.paymentStatusList).map(item=>
                                <option value={item.value}>{item.display}</option>
                              )}
                            </select></div>
                       
                          </div>

                       
                          
                          
                          </div>
                          <div className="row">

                            <div className="col-sm-4 text-right">
                           <button type="submit" className={"btn btn-primary"} >
                                Search
                                </button>
</div>
</div>
                          </FormWithConstraints>
                          </div>

                          <div className="mt-2 boxContent">
            <div className="row" >
              <div className="col-sm-12">
                <div class="table-proposed">
                  <StickyHeader height={"65vh"} >
                    <table className="my-table"  id="EarlyPaymentReport">
                      <thead>
                        <tr>

                          <th>Vendor Code</th>
                          <th>Vendor Name</th>
                          <th>Created Date</th>
                          <th>Approved By</th>
                          <th>Approved Date</th>
                          <th>Document Number</th>
                          <th>Reference</th>
                          <th>Invoice Date</th>
                          <th>Actual Payment Date</th>
                          <th>Next Payment Date</th>
                          <th>interest Amount</th>
                          <th>Gross Amount</th>                         
                          <th>Status</th>
                        
                         
                        
                        </tr>
                      </thead>
                      <tbody id="DataTableBody">
                        {this.props.paymentreportlist.map((payment, index) => 
                         
                          
                          <tr>
                            <td>{payment.vendorCode}</td>
                            <td>{payment.vendorName}</td>
                            <td>{formatDate(payment.created)}</td>
                            <td>{payment.approvedBy!=null?payment.approvedBy.name:""}</td>
                            <td>{payment.approvedDate!=null?formatDate(payment.approvedDate):""}</td>
                            <td>{payment.documentNumber}</td>
                            <td>{payment.reference}</td>
                            <td>{payment.invoiceDate!=null?formatDate(payment.invoiceDate):""}</td>
                            <td>{payment.actualPaymentDate!=null?formatDate(payment.actualPaymentDate):""}</td>
                            <td>{payment.nextPaymentDate!=null?formatDate(payment.nextPaymentDate):""}</td>
                            <td>{payment.interestAmount}</td>
                            <td>{payment.grossAmount}</td>
                            <td>{payment.status}</td>


                          </tr>
                          )}
                        
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
                          </React.Fragment>
                          </>
        )
      }
}


const mapStateToProps = (state) => {
    return state.paymentreports;
  };
  export default connect(mapStateToProps, actionCreators)(EarlyPaymentReport);