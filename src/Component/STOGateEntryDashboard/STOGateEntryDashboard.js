import React, { Component } from "react";
import Datepick from "../FormElement/DatePick";
import StickyHeader from "react-sticky-table-thead";
import * as actionCreators from "./Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import {
  commonSubmitWithParam,
  commonSubmitFormNoValidationWithData
} from "../../Util/ActionUtil";
import {submitToSAPURL,saveServer, savetoServer} from "../../Util/APIUtils";
import ReportVechicalSTO from "../ReportVechicalSTO/ReportVechicalSTO";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { formatDateWithoutTime, formatDateWithoutTimeWithMonthName ,formatDateWithoutTimeNewDate} from "../../Util/DateUtil";
import { searchTableData, searchTableDataTwo} from "./../../Util/DataTable";
const height_dy = window.innerHeight - 135;
class STOGateEntryDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registrationList: [],
      loadSTOGateEntryDashboard: false,
      loadReportVehicleSTO: false,
      vehicleRegCustId: ""
    };
  }

  async componentDidMount() {
    this.setState({ loadSTOGateEntryDashboard: true });

    commonSubmitWithParam(
      this.props,
      "populateGateEntryDashboard",
      "/rest/getVehicleRegistration"
    );
  }

  changeLoaderState = (action) => {
    this.setState({ isLoading: action });
  }

  UNSAFE_componentWillReceiveProps = async props => {
    this.changeLoaderState(false);
    if (!isEmpty(props.gateEntryDashboard) && this.state.loadSTOGateEntryDashboard) {
      this.setState({
        registrationList: props.gateEntryDashboard,
        loadSTOGateEntryDashboard: false
      })
    }
  }
  

  handleGateInStatus =(item)=>{
    console.log("handlegateINSTATus itemmmmmm",item);
    // let ress = {
    //   "invoiceNo": "6200001629",
    //   "invoiceDate": "2021-12-16",
    //   "destination": "/DEV/SAP_INTEGRATION/EINV/6200001629.pdf",
    //   "vehicleRegistationId":"13"
    //   }

    //   let respaa ={
    //       // "reqNo": "req0001",
    //       // "saleOrderNo": "110062023  ",
    //       "invno": "6200001629",
    //       "invdt": "2021-12-16",
    //       "filename": "/DEV/SAP_INTEGRATION/EINV/6200001629.pdf"
    //       }
      
    //   console.log("ress",ress);

    let urls = `/rest/getInvoiceDetails/${item.saleOrderNo}/${item.vehicleRegistationId}`
    savetoServer({urls}).then((res) => { 
      // console.log("ressubmit to sap url",res);
      let ssData = {
        vehicleRegistationId:item.vehicleRegistationId,
        invoiceNo:res.invoiceNo,
        invoiceDate:res.invoiceDate,
        destination:res.filename?res.filename:''

      }
      
      let url = '/rest/generateVehicleInvoice'
      saveServer({ssData,url}).then((res)=>{
        console.log("ssData res",res);
      })
      

    }).catch((err) =>{
      console.log("err",err);
    })



    // commonSubmitWithParam(
    //   this.props,
    //   "populateGateEntryDashboard",
    //   `/rest/generateVehicleInvoice/${item.vehicleRegistationId}/${ress.invno}/${ress.invdt}/${ress.filename}`
    // );

    // let requestData ={
    //   "reqNo": "req0001",
    //   "saleOrderNo": "110062023",
    //   "invno": "6200001629",
    //   "invdt": "2021-12-16",
    //   "filename": "6200001629"
    // }
  
  // commonSubmitFormNoValidationWithData(ress, this, "materialGetInSubmit", "/rest/generateVehicleInvoice");

  }

  handleVehicleRegistrationDetails = (item) => {
    console.log("handleVechicaleRegistration ----",item)
    if(item.status === 'VGI'){
      // console.log("hit hai---------")
      this.handleGateInStatus(item);
      this.setState({ loadReportVehicleSTO: true, vehicleRegCustId: item.vehicleRegistationId })

    }else {
      this.setState({ loadReportVehicleSTO: true, vehicleRegCustId: item.vehicleRegistationId })

    }
    
  }


  getStatusFullForm = (item) => {
    // console.log("item",item);
    let type = item.status.toUpperCase();
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


  render() {
 
    return (
      <>
      <div className="w-100" id="togglesidebar">
          <div className="mt-100 boxContent" >
       <UserDashboardHeader />
        <Loader isLoading={this.state.isLoading} />
        
        <div className="col-sm-12 mt-2">
          <div>
            <div className={
              (this.state.loadReportVehicleSTO == false
                ? "display_block"
                : "display_none")
            }
            >
       <div className="col-sm-9"></div>
             <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div> 
              <StickyHeader height={height_dy} className="table-responsive">
                <table className="table table-bordered table-header-fixed">
                  <thead>
                    <tr>
                     <th>PO No </th>
                      <th>Request No </th>
                      <th>Require on</th>
                      <th>From Plant</th>
                      <th>To Plant</th>
                      {/* <th>Plant</th> */}
                      {/* <th>Ship to Party</th> */}
                      {/* <th>Sold to Party</th> */}
                      <th>Destinaiton</th>
                      <th>Transporter Code-Name</th>
                      {/* <th>Transporter Code</th> */}
                      {/* <th>Vechical type</th> */}
                      <th>ME</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="DataTableBodyTwo">
                    {this.state.registrationList.map((item) => (
                         (item.poNo!=null?
                      <tr>
                       
                        {<td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.poNo}</td>}
                        
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.requestNo}</td>
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.requiredOn}</td> */}  
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{formatDateWithoutTimeNewDate(item.requiredOn)}</td>
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.fromPlant}</td>
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.toPlant}</td>
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.shipToParty ? item.shipToParty:""}</td> */}
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.soldToParty.name}</td> */}
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.destination}</td>
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.trasnporter ? item.trasnporter:''}</td>
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.trasnporter.code}</td> */}
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.vehicleType}</td> */}
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.meCode ? item.meCode.userName+"-"+item.meCode.name:''}</td>
                        <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{this.getStatusFullForm(item)}</td>
                        {/* <td onClick={() => this.handleVehicleRegistrationDetails(item)}>{item.status}</td> */}
                   
                      </tr> :"")
                    ))}
                  </tbody>
                </table>
              </StickyHeader>
            </div>
            <div className={
              (this.state.loadReportVehicleSTO == true
                ? "display_block"
                : "display_none")
            }
            >
              <ReportVechicalSTO
                vehicleRegCustId = {this.state.vehicleRegCustId}
              />
            </div>

          </div>
        </div>
        </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.STOgateEntryDashboardReducer;
};
export default connect(mapStateToProps, actionCreators)(STOGateEntryDashboard);