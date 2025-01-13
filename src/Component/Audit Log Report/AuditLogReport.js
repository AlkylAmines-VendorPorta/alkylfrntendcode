import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "../Audit Log Report/Action"
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

class AuditLogReport extends Component {

    constructor(props) {
  
      super(props)
      this.state = {
        
        isLoading: false,
        auditreportlist: [],
        auditreportdetails: {
          uniqueCode: "",
           
            
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
      
                   // commonSubmitForm(e, this, "auditResponse", "/rest/getLog", "reports");
                  // commonSubmitWithParam(this.props,"auditResponse",'/rest/getLog',this.state.auditreportdetails.uniqueKey)
                      
                      }} noValidate
                    >
                      <div className="col-sm-12">
                        <div className="row mt-2">
                          <label className="col-sm-2 mt-4">Uniqe key</label>
                          <div className="col-sm-2">
                            <input type="text" className={"form-control"} name="uniqueCode"
                              value={this.state.auditreportdetails.uniqueCode}
                              onChange={(event) => {
                                if (event.target.value.length < 60) {
                                  commonHandleChange(event, this, "auditreportdetails.uniqueCode", "reports")
                                }
                              }} />
      
                          </div>

                         
                            

                           
                       
                          </div>

                       
                          
                          
                          </div>
                          <div className="row">

                            <div className="col-sm-4 text-right">
                           <button type="button" className={"btn btn-primary"} onClick={(e) =>{commonSubmitWithParam(this.props,"auditResponse","/rest/getLog",this.state.auditreportdetails.uniqueCode)}}>
                                Search
                                </button>
</div>
</div>
                          </FormWithConstraints>
                          </div>

                          <div className="mt-2 boxContent">
            <div className="row" >
            <div className="col-sm-9"></div>
                     <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div> 
              <div className="col-sm-12">
              
                <div class="table-proposed">
                  <StickyHeader height={"65vh"} >
                    <table className="table table-bordered table-header-fixed"  id="AuditLogReport">
                      <thead>
                        <tr>

                          <th>Created By</th>
                          <th>Created Date</th>
                          <th>Updated By</th>
                          <th>Updated Date</th>
                          <th>Updated Column</th>
                          <th>Old Value</th>
                          <th>New Value</th>
                          <th>Unique Key</th>
                          <th>Table Name</th>                         
                        
                         
                        
                        </tr>
                      </thead>
                      <tbody id="DataTableBodyTwo">
                        {this.state.auditreportlist.map((audit, index) => 
                         
                          
                          <tr>
                            <td>{audit.createdByName}</td>
                            <td>{formatDateWithoutTime(audit.createdDateTime)}</td>
                            <td>{audit.updatedByName}</td>
                            <td>{formatDateWithoutTime(audit.updatedDateTime)}</td>
                            <td>{audit.updatedColumn}</td>
                            <td>{audit.oldValue}</td>
                            <td>{audit.newValue}</td>
                            <td>{audit.uniqueKey}</td>
                            <td>{audit.tableName}</td>
                           


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
    return state.auditlogreports;
  };
  export default connect(mapStateToProps, actionCreators)(AuditLogReport);