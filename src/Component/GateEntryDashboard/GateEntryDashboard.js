import React, { Component } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, TextField, CircularProgress,
  Grid,
  Container
} from "@material-ui/core";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { isEmpty } from "../../Util/validationUtil";
import {
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import formatDate, { formatDateWithoutTimeNewDate } from "../../Util/DateUtil";
import {saveServer, savetoServer} from "../../Util/APIUtils";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import LoaderWithProps from "../FormElement/Loader/LoaderWithProps";
import ReportVechicle from "../ReportVehicle/ReportVehicle";
import DataTable from "react-data-table-component";

class GateEntryDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registrationList: [],
      filteredList: [],
      vehicleRegCustId: "",
      loadReportVehicle:false,
      loadGateEntryDashboard: false,
      isLoading: false,
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
    };
  }

  async componentDidMount() {
    this.setState({ loadGateEntryDashboard: true });
    this.setState({ isLoading: true });

    commonSubmitWithParam(
      this.props,
      "populateGateEntryDashboard",
      "/rest/getVehicleRegistration"
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gateEntryDashboard !== this.props.gateEntryDashboard) {
      if (!isEmpty(this.props.gateEntryDashboard)) {
        this.setState({
          registrationList: this.props.gateEntryDashboard,
          filteredList: this.props.gateEntryDashboard, // Copy for search
          isLoading: false
        });
      }
    }
  }
  UNSAFE_componentWillReceiveProps = async props => {
    this.changeLoaderState(false);
    if (!isEmpty(props.gateEntryDashboard) && this.state.loadGateEntryDashboard) {
      this.setState({
        registrationList: props.gateEntryDashboard,
        loadGateEntryDashboard: false
      })
    }
  }
  handleGateInStatus =(item)=>{
    let urls = `/rest/getInvoiceDetails/${item.saleOrderNo}/${item.vehicleRegistationId}`
    savetoServer({urls}).then((res) => { 
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
  }

  handleVehicleRegistrationDetails = (item) => {
    console.log("handleVechicaleRegistration ----",item)
    if(item.status === 'VGI'){
      // console.log("hit hai---------")
      this.handleGateInStatus(item);
      this.setState({ loadReportVehicle: true, vehicleRegCustId: item.vehicleRegistationId })

    }else {
      this.setState({ loadReportVehicle: true, vehicleRegCustId: item.vehicleRegistationId })

    }
    
  }
  handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredList = this.state.registrationList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery)
      )
    );
    this.setState({ searchQuery, filteredList });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  handleRowClick = (row) => {
      this.handleVehicleRegistrationDetails(row);
    };
  getStatusFullForm = (status) => {
    const statusMap = {
      CR: "Created",
      RG: "Register",
      RP: "Vehicle Reported",
      VGI: "Vehicle Gate IN",
      VGO: "Vehicle Gate Out",
      CANCELLED: "Cancelled",
    };
    return statusMap[status] || "";
  };

  render() {
    const { isLoading, searchQuery, filteredList, page, rowsPerPage } = this.state;
   const columns = [
  {
    name: "Sales Order No",
    selector: row => row.saleOrderNo,
    sortable: true
  },
{
    name: 'Request No',
    selector: row => row.requestNo,
    sortable: true
  },
{
    name: 'Request On',
    selector: row => formatDate(row.requiredOn),
    sortable: true,  },
{
    name: 'Plant',
    selector: row =>  row.plant,
    sortable: true,
},
{
    name: 'Ship to Party',
    selector: row =>  row.shipToParty,
    sortable: true
  },
{
    name: 'Destination',
    selector: row =>  row.destination,
    sortable: true
  },
{
    name: 'Transporter',
    selector: row =>  row.transporter,
    sortable: true
  }, {
    name: 'Status',
    selector: row => this.getStatusFullForm(row.status),
    sortable: true
  }
]
    return (
      <div className="wizard-v1-content" style={{marginTop:"80px"}}>
         
          <UserDashboardHeader />
          <LoaderWithProps isLoading={isLoading} />
          
          <div className={
              (this.state.loadReportVehicle == false
                ? "display_block col-sm-12 mt-2"
                : "display_none col-sm-12 mt-2")
            }>
            <Grid container spacing={2} alignItems="center" justify="flex-end">
            <Grid item xs={3}>
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={this.handleSearch}
                style={{fontSize: "10px", float:"right" }}
              />
            </Grid>
          </Grid>

              {/* Table */}
              <TableContainer>
                {/* <Table className="my-table">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Sales Order No</b></TableCell>
                      <TableCell><b>Request No</b></TableCell>
                      <TableCell><b>Require On</b></TableCell>
                      <TableCell><b>Plant</b></TableCell>
                      <TableCell><b>Ship to Party</b></TableCell>
                      <TableCell><b>Destination</b></TableCell>
                      <TableCell><b>Transporter</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => (
                        <TableRow key={index} onClick={() => this.handleVehicleRegistrationDetails(item)}
                      >
                          <TableCell>{item.saleOrderNo}</TableCell>
                          <TableCell>{item.requestNo}</TableCell>
                          <TableCell>{formatDateWithoutTimeNewDate(item.requiredOn)}</TableCell>
                          <TableCell>{item.plant}</TableCell>
                          <TableCell>{item.shipToParty || ""}</TableCell>
                          <TableCell>{item.destination}</TableCell>
                          <TableCell>{item.transporter || ""}</TableCell>
                          <TableCell>{this.getStatusFullForm(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table> */}
            

             
              {/* <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                count={filteredList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              /> */}
        <DataTable
            columns={columns}
            data={filteredList}
            pagination
            paginationPerPage={50}  
            //responsive
            paginationRowsPerPageOptions={[10, 25, 50, 100]} 
            onRowClicked={this.handleRowClick}
            />
              </TableContainer>
          </div>
          <div className={
              (this.state.loadReportVehicle == true
                ? "display_block"
                : "display_none")
            }
            >
              <ReportVechicle
                vehicleRegCustId = {this.state.vehicleRegCustId}
              />
            </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.gateEntryDashboardReducer;
export default connect(mapStateToProps, actionCreators)(GateEntryDashboard);
