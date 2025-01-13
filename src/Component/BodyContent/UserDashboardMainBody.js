import React, { Component } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import * as actionCreators from "./Action";
import {connect} from 'react-redux';
import {commonSubmitWithParam,commonHandleChange, commonSubmitFormNoValidation,commonSubmitForm, 
  commonHandleChangeCheckBox, commonHandleFileUpload,commonSubmitFormValidation,
  commonHandleReverseChangeCheckBox,swalPrompt,commonSubmitWithoutEvent,
  commonHandleFileUploadInv,swalWithTextBox} from "../../Util/ActionUtil";
  import { isEmpty } from '../../Util/validationUtil';
class UserDashboardMainBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPoCount:"",
      acceptedPoCount:"",
      rejectedPoCount:"",
      releasedPoCount:"",
      loadUserDashboardDetails:false,
        options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
          },
          series: [
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
          ],
          optionsDonut: {},
      seriesDonut: [44, 55, 41, 17, 15],
      labelsDonut: ['A', 'B', 'C', 'D', 'E'],
      seriesBar: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
      optionsBar: {
        chart: {
          type: 'bar',
          height: 300
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        }
      },
      openPoCount:"",
      openPoAsnCount:"",
      pendingPoBillBookingCount:"",
    };
  }
  async componentWillReceiveProps(props){
    ;
    if(!isEmpty(props) && (this.state.loadUserDashboardDetails===true)){
      this.setState({
        totalPoCount:props.totalPoCount,
        acceptedPoCount:props.acceptedPoCount,
        rejectedPoCount:props.rejectedPoCount,
        releasedPoCount:props.releasedPoCount,

        openPoCount:props.openPoCount,
        openPoAsnCount:props.openPoAsnCount,
        pendingPoBillBookingCount:props.pendingPoBillBookingCount,
      })

      }
  }
   componentDidMount(){
       
      //  setTimeout(function () {
      //   this.props.getUserDashboardInfo("userDashboardDetails");
      //   this.setState({
      //     loadUserDashboardDetails: true
      //   })
      //   // commonSubmitWithParam(this.props,"getUserDashboardDetails","/rest/userDashboardDetails");
      // }.bind(this), 1000)
   
      
    commonSubmitWithParam(this.props,"getUserDashboardDetails","/rest/userDashboardDetails");
    this.setState({
          loadUserDashboardDetails: true
        })
  
    }
  
 

  render() {
    return (
      <div class="container-fluid mt-100 w-100">
          {/* <div class="card">
            <div className="row px-4 py-2">
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="mixed-chart">
                    <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    width="300"
                    />
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="mixed-chart">
                    <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="line"
                    width="300"
                    />
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="donut">
                <Chart options={this.state.optionsDonut} series={this.state.seriesDonut} type="donut" width="300" />
            </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="mixed-chart">
                    <Chart
                    options={this.state.optionsBar}
                    series={this.state.seriesBar}
                    type="bar"
                    width="300"
                    />
                </div>
            </div>
          </div>
        
        </div> */}
        <div class="card" id="togglesidebar">
            <div className="row px-4 py-2" >
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card">
                {/* <Link to="/salessummary"> */}
                  <div className="content">
                    <div className="row">
                      <div className="col-4">
                        <div className="icon-big icon-warning text-center">
                          <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="numbers">
                          <p class="card-head">Enquiry</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row mt-3 mb-3"></div> */}
                    <div className="footer">
                      <hr />
                      <div className="row w-100">
                        <div className="col-12">
                          {/* <small className="text-muted font_size_point7rem">Today Sale : <span>0</span></small>
                                                        <div className="progress custom_progress">
                                                            <div className="progress-bar bg-success" role="progressbar" style={{width:this.state.todaySale+"%"}} aria-valuenow={this.state.todaySale} aria-valuemin="0" aria-valuemax="100"></div>
                                                        </div> */}
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-secondary">
                            Open Enquiries :{" "}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                            Open RFQ's :{" "}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                            QCF In-process :{" "}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-success">
                            Order In-process :{" "}
                            <span></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* </Link> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="card">
                {/* <Link to="/purchasesummary"> */}
                  <div className="content">
                    <div className="row">
                      <div className="col-4">
                        <div className="icon-big icon-success text-center">
                          <i
                            className="fa fa-file-text"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="numbers">
                          <p class="card-head">Purchase Orders</p>
                          <span class="px-2">{this.state.totalPoCount}</span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row mt-3 mb-3"></div> */}
                    <div className="footer">
                      <hr />
                      <div className="row w-100">
                        <div className="col-12">
                          {/* <small className="text-muted font_size_point7rem">Today Purchase : <span>0</span></small>
                                                        <div className="progress custom_progress">
                                                            <div className="progress-bar bg-success" role="progressbar" style={{width:this.state.todayPurchase+"%"}} aria-valuenow={this.state.todayPurchase} aria-valuemin="0" aria-valuemax="100"></div>
                                                        </div> */}
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-secondary">
                            New PO's :  {this.state.releasedPoCount}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                            Open PO's :  {this.state.openPoCount}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                            Open ASN/SEN : {this.state.openPoAsnCount}
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-success">
                            Open Gate Entry : 
                            <span></span>
                          </p>
                          <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-primary">
                            Pending Bill Booking : {this.state.pendingPoBillBookingCount}
                            <span></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.userDashBoardMainReducer;
};
export default connect (mapStateToProps,actionCreators)(UserDashboardMainBody);
