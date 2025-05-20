import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import { submitToURL } from "../../Util/APIUtils";
import * as actionCreators from "./Action";
import {
  commonSubmitForm, commonHandleChange,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { formatDateWithoutTimeNewDate1 } from "../../Util/DateUtil";
import TableToExcel from "@linways/table-to-excel";

// Material-UI Components
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Container,
  Grid,
  InputLabel,
  FormControl,
  TablePagination,
  TableContainer,
  IconButton,
} from "@material-ui/core";
import Loader from "../FormElement/Loader/Loader";

class NRGPReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      getASNReportlist: [],
      search: "",
        page: 0,
        rowsPerPage: 50,
        openModal:false,
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
    this.setState({ loadasnDetails: true, openModal:false });
    commonSubmitForm(e, this, "gateEntryResponse", "/getASNReport")
  }
  clearFields=()=>{
    this.setState({
      gateEntryListDto: {
      reqNoFrom: "",
      reqNoTo: "",
      docType: "",
      plant: "",
      status: ""
      
    },})
  }

  handleFilterClick = () => {
    this.props.onFilter && this.props.onFilter();
    this.setState({ formDisplay: !this.state.formDisplay });
    this.setState({ searchDisplay: !this.state.searchDisplay });
    this.clearFields();
  }

  exportReportToExcel() {
    TableToExcel.convert(document.getElementById("RGPLineReport"),{
       name:"RGP_Report.xlsx"
    });
  }
  // Handle pagination page change
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  // Handle rows per page change
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };

  // // Handle form submission
  // handleSubmit = (e) => {
  //   this.setState({ loadasnDetails: true ,openModal:false});
  //   commonSubmitForm(e, this, "gateEntryResponse", "/getASNReport")
  // }
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
  onValueChange = ({ target }) => {
    console.log(target.value,"target.value")
    this.setState({ search: target.value, page: 0 }); // Reset page to 0 when searching
  };
  render() {
    const {
      plantDropDownList,
      statusDropDownList,
      gateEntryListDto,
      isLoading,
      page,
      rowsPerPage,
      search,
    } = this.state;
    const searchInObject = (obj, searchTerm) => {
      return Object.keys(obj).some((key) => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return searchInObject(value, searchTerm);
        }
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    };
  
    const filteredData = this.props.gateEntryListDto.filter((entry) => {
      return searchInObject(entry, search);
    });
    return (
      <>
        <React.Fragment>
          <UserDashboardHeader />
          <Loader isLoading={isLoading} />
          <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
          {this.state.openModal && 
              <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
              <div className="modal-backdrop"></div>  <div className="modal-dialog modal-lg">
                  <div className="modal-content">
            <FormWithConstraints ref={formWithConstraints => this.printreports = formWithConstraints}
              onSubmit={(e) => {                
                 this.changeLoaderState(true);
                 this.setState({openModal:false, isLoading:true})
                commonSubmitForm(e, this, "gateEntryResponse", "/rest/getGateEntryByFilter", "printreports")
                this.clearFields();
               }} noValidate
            >
                <Grid container spacing={3}>
                  {/* REQ No From */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      fullWidth
                      label="REQ No From"
                      name="reqNoFrom"
                      value={gateEntryListDto.reqNoFrom}
                      onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "gateEntryListDto.reqNoFrom", "printreports");
                        }
                      }}
                       variant="outlined" size="small"
                       InputLabelProps={{ shrink: true }}  
                       inputProps={{ style: { fontSize: 12, height: "15px",  } }} 
                    />
                  </Grid>

                  {/* REQ No To */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      fullWidth
                      label="REQ No To"
                      name="reqNoTo"
                      value={gateEntryListDto.reqNoTo}
                      onChange={(event) => {
                        if (event.target.value.length < 60) {
                          commonHandleChange(event, this, "gateEntryListDto.reqNoTo", "printreports");
                        }
                      }}
                      variant="outlined" size="small"
                       InputLabelProps={{ shrink: true }}  
                       inputProps={{ style: { fontSize: 12, height: "15px",  } }} 
                    />
                  </Grid>

                  {/* Plant Dropdown */}
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl  fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Plant</InputLabel>
                      <Select
                        name="plant"
                        variant="outlined"
                        value={gateEntryListDto.plant}
                        onChange={(event) => {
                          commonHandleChange(event, this, "gateEntryListDto.plant", "printreports");
                        }}
                        sx={{ fontSize: 12, height: "15px",  } }
                      >
                        <MenuItem value="">Select</MenuItem>
                        {plantDropDownList.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Status Dropdown */}
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl  fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Status</InputLabel>
                      <Select
                        name="status"
                        variant="outlined"
                        value={gateEntryListDto.status}
                        onChange={(event) => {
                          commonHandleChange(event, this, "gateEntryListDto.status", "printreports");
                        }}
                        sx={{ fontSize: 12, height: "15px",  } }
                      >
                        <MenuItem value="">Select</MenuItem>
                        {statusDropDownList.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Search Button */}
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Button type="submit" size="small" variant="contained" color="primary" disabled={isLoading}>
                      Search
                    </Button>
                     <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                     Cancel</Button>
                     <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>

                  </Grid>
                </Grid>
              </FormWithConstraints>
</div>
</div>
</div>}
<Grid container spacing={2} alignItems="center" justify="flex-end">
              <Grid item xs={9} style={{textAlign:"left"}}>
                <Button variant="contained" size="small" color="primary" onClick={this.exportReportToExcel}>
                  Download Excel
                </Button>
              </Grid>
              <Grid item xs={3}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={this.onValueChange}
                  style={{ fontSize: "10px", float:"right" }}
                />
                <IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
              </Grid>
            </Grid>
<TableContainer className="mt-1">
                  <Table className="my-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Req No</TableCell>
                        <TableCell>Req Date</TableCell>
                        <TableCell>Return By</TableCell>
                        <TableCell>Requestioner Name</TableCell>
                        <TableCell>Vehicle No</TableCell>
                        <TableCell>Vendor Name</TableCell>
                        <TableCell>Doc Type</TableCell>
                        <TableCell>Plant</TableCell>
                        <TableCell>Material Details</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((gaterntryline) => (
                          <TableRow key={gaterntryline.gateEntry.reqNo}>
                            <TableCell>{gaterntryline.gateEntry.reqNo}</TableCell>
                            <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.created)}</TableCell>
                            <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.returnBy)}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.createdBy?.userDetails?.name || ""}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.vehicleNo}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.vendorName}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.docType}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.plant}</TableCell>
                            <TableCell>{gaterntryline.materialCode}</TableCell>
                            <TableCell>{gaterntryline.uom}</TableCell>
                            <TableCell>{gaterntryline.materialQty}</TableCell>
                            <TableCell>{gaterntryline.purpose}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.status}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                  />

              {/* Download Excel Button */}
              <div style={{display:"none"}}>
              <Table id="RGPLineReport" className="my-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Req No</TableCell>
                        <TableCell>Req Date</TableCell>
                        <TableCell>Return By</TableCell>
                        <TableCell>Requestioner Name</TableCell>
                        <TableCell>Vehicle No</TableCell>
                        <TableCell>Vendor Name</TableCell>
                        <TableCell>Doc Type</TableCell>
                        <TableCell>Plant</TableCell>
                        <TableCell>Material Details</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.gateEntryListDto.map((gaterntryline) => (
                          <TableRow key={gaterntryline.gateEntry.reqNo}>
                            <TableCell>{gaterntryline.gateEntry.reqNo}</TableCell>
                            <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.created)}</TableCell>
                            <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.returnBy)}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.createdBy?.userDetails?.name || ""}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.vehicleNo}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.vendorName}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.docType}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.plant}</TableCell>
                            <TableCell>{gaterntryline.materialCode}</TableCell>
                            <TableCell>{gaterntryline.uom}</TableCell>
                            <TableCell>{gaterntryline.materialQty}</TableCell>
                            <TableCell>{gaterntryline.purpose}</TableCell>
                            <TableCell>{gaterntryline.gateEntry.status}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
              </div>
            </TableContainer>
            </div>
        </React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.nrgpReport;
};

export default connect(mapStateToProps, actionCreators)(NRGPReport);