import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./Action";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { submitToURL } from "../../Util/APIUtils";
import { commonSubmitForm, commonHandleChange } from "../../Util/ActionUtil";
import formatDate, { formatDateWithoutTimeNewDate1 } from "../../Util/DateUtil";
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
  IconButton,
  TableContainer,
} from "@material-ui/core";
import { FormWithConstraints } from "react-form-with-constraints";
import { isEmpty } from "../../Util/validationUtil";
import DataTable from "react-data-table-component";

class RGPReport extends Component {
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
      materialgateEntryLineListDto: {
        reqNoFrom: "",
        reqNoTo: "",
        docType: "",
        plant: "",
        status: "",
        reqDateFrom: "",
        reqDateTo: "",
        
      },
      plantDropDownList:[],
      statusDropDownList:[],
      gateEntryListDto: []
    
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

    if (!isEmpty(props.materialgateEntryLineListDto)) {
      this.changeLoaderState(false);
      this.setState({

        materialgateEntryLineListDto: {
            reqNoFrom: "",
            reqNoTo: "",
            docType: "",
            plant: "",
            status: "",
            reqDateFrom: "",
            reqDateTo: "",
            
          }
      })
    }

    if (!isEmpty(props.gateEntryListDto)) {
      this.changeLoaderState(false);
      this.setState({
        gateEntryListDto: props.gateEntryListDto
      })
    }

  }

  
clearFields=()=>{
  this.setState({
    materialgateEntryLineListDto: {
      reqNoFrom: "",
      reqNoTo: "",
      docType: "",
      plant: "",
      status: "",
      reqDateFrom: "",
      reqDateTo: "",
      
    },
  })
}
  handleFilterChange = (key, event) => {
    this.props.onFilterChange && this.props.onFilterChange(key, event.target.value);
    this.clearFields();
  }

  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
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
  // Handle form submission
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true , openModal:false});

    commonSubmitForm(e, this, "gateEntryResponse", "/rest/getRGPReportByFilter", "printreports")
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }));
      this.clearFields();
  };
  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }
  // Export table data to Excel
  exportReportToExcel = () => {
    TableToExcel.convert(document.getElementById("RGPLineReport"), {
      name: "RGP_Report.xlsx",
    });
  };
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
    this.setState({ search: target.value, page: 0 }); // Reset page to 0 when searching
  };
  render() {
    const {
      materialgateEntryLineListDto,
      plantDropDownList,
      statusDropDownList,
      gateEntryListDto,
      isLoading,
      page,
      rowsPerPage,
      search
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
  const columns = [
  {
    name: 'Req No',
    selector: row => row.gateEntry.reqNo,
    sortable: true
  },
  {
    name: 'Req Date',
    selector: row => row.gateEntry.created,
    sortable: true,
    cell: row => formatDate(row.gateEntry.created),
  },
  {
    name: 'Return By',
    selector: row => row.gateEntry.returnBy,
    sortable: true,
    cell: row => formatDate(row.gateEntry.returnBy),
  },
  {
    name: 'Requestioner Name',
    selector: row => row.gateEntry.createdBy?.userDetails?.name || "",
    sortable: true
  },
  {
    name: 'Vehicle No',
    selector: row => row.gateEntry.vehicleNo,
    sortable: true
  },
  {
    name: 'Vendor Name',
    selector: row => row.gateEntry.vendorName,
    sortable: true
  },
   {
    name: 'Doc Type',
    selector: row => row.gateEntry.docType,
    sortable: true
  },
  {
    name: 'Plant',
    selector: row => row.gateEntry.plant,
    sortable: true
  },
    {
    name: 'Material Details',
    selector: row => row.materialCode,
    sortable: true
  },
    {
    name: 'UOM',
    selector: row => row.uom,
    sortable: true
  },
  {
    name: 'Quantity',
    selector: row => row.materialQty,
    sortable: true
  },
   {
    name: 'Purpose',
    selector: row => row.purpose,
    sortable: true
  },
   {
    name: 'Status',
    selector: row => row.gateEntry.status,
    sortable: true
  },
   {
    name: 'Closed By',
    selector: row => row.gateEntry.closedBy?.name || "",
    sortable: true
  },
  {
    name: 'Closed Date',
   selector: row => row.gateEntry.closedDate,
    sortable: true,
    cell: row => formatDate(row.gateEntry.closedDate),
    sortable: true
  },
];
    return (
      <>
        <React.Fragment>
          <Loader isLoading={isLoading} />
          <UserDashboardHeader />
          <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
            {this.state.openModal && 
              <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
                <div className="modal-backdrop"></div><div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <FormWithConstraints
                      ref={(formWithConstraints) => (this.printreports = formWithConstraints)}
                      onSubmit={this.handleSubmit}
                      noValidate
                    >
                      <Grid container spacing={3}>
                        {/* REQ No From */}
                        <Grid item xs={12} sm={6} md={6}>
                          <TextField
                            fullWidth
                            label="REQ No From"
                            name="reqNoFrom"
                            variant="outlined" size="small"
                            value={materialgateEntryLineListDto.reqNoFrom}
                            onChange={(event) => {
                              if (event.target.value.length < 60) {
                                commonHandleChange(event, this, "materialgateEntryLineListDto.reqNoFrom", "printreports");
                              }
                            }}
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
                            variant="outlined" size="small"
                            value={materialgateEntryLineListDto.reqNoTo}
                            onChange={(event) => {
                              if (event.target.value.length < 60) {
                                commonHandleChange(event, this, "materialgateEntryLineListDto.reqNoTo", "printreports");
                              }
                            }}
                            InputLabelProps={{ shrink: true }}  
                            inputProps={{ style: { fontSize: 12, height: "15px",  } }} 
                          />
                        </Grid>
  
                        {/* REQ Date From */}
                        <Grid item xs={12} sm={6} md={6}>
                          <TextField
                            fullWidth
                            label="REQ Date From"
                            variant="outlined" size="small"
                            type="date"
                            name="reqDateFrom"
                            value={materialgateEntryLineListDto.reqDateFrom}
                            onChange={(event) => {
                              commonHandleChange(event, this, "materialgateEntryLineListDto.reqDateFrom", "printreports");
                            }}
                            InputLabelProps={{ shrink: true }}  
                            inputProps={{ style: { fontSize: 12, height: "15px",  } }} 
                          />
                        </Grid>
  
                        {/* REQ Date To */}
                        <Grid item xs={12} sm={6} md={6}>
                          <TextField
                            fullWidth
                            variant="outlined" 
                            size="small"
                            label="REQ Date To"
                            type="date"
                            name="reqDateTo"
                            value={materialgateEntryLineListDto.reqDateTo}
                            onChange={(event) => {
                              commonHandleChange(event, this, "materialgateEntryLineListDto.reqDateTo", "printreports");
                            }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { fontSize: 12, height: "15px",  } }} 
                          />
                        </Grid>
  
                        {/* Plant Dropdown */}
                        <Grid item xs={12} sm={6} md={6}>
                          <FormControl fullWidth size="small" variant="outlined">
                            <InputLabel shrink>Plant</InputLabel>
                            <Select
                              name="plant"
                              value={materialgateEntryLineListDto.plant}
                              onChange={(event) => {
                                commonHandleChange(event, this, "materialgateEntryLineListDto.plant", "printreports");
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
                          <FormControl fullWidth size="small" variant="outlined">
                            <InputLabel shrink>Status</InputLabel>
                            <Select
                              name="status"
                              value={materialgateEntryLineListDto.status}
                              onChange={(event) => {
                                commonHandleChange(event, this, "materialgateEntryLineListDto.status", "printreports");
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
                          <Button type="submit" size="small" variant="contained" color="primary" >
                            Search
                          </Button>
                          <Button type="button" size="small" variant="contained" color="secondary" className="ml-1" onClick={this.onCloseModal.bind(this)}> Cancel </Button>

                          <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>

                        </Grid>
                      </Grid>
                    </FormWithConstraints>
                  </div>
                </div>
              </div>
            }
  
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
              {/* <Table className="my-table">
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
                    <TableCell>Closed By</TableCell>
                    <TableCell>Closed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((gaterntryline, index) => (
                      <TableRow key={index+1} >
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
                        <TableCell>{gaterntryline.gateEntry.closedBy?.name || ""}</TableCell>
                        <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.closedDate)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
  
              <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={this.handlePageChange}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              /> */}
               <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationPerPage={50}  
                  responsive
                  paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                />
            </TableContainer>
            <div style={{display:"none"}}>
              <Table id="RGPLineReport" >
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
                    <TableCell>Closed By</TableCell>
                    <TableCell>Closed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.gateEntryListDto.map((gaterntryline,i) => (
                      <TableRow key={i+1}>
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
                        <TableCell>{gaterntryline.gateEntry.closedBy?.name || ""}</TableCell>
                        <TableCell>{formatDateWithoutTimeNewDate1(gaterntryline.gateEntry.closedDate)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.rgpReport;
};

export default connect(mapStateToProps, actionCreators)(RGPReport);