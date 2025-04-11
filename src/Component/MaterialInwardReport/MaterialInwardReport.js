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
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { getIFSCDetails } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { formatDateWithoutTime,formatDateWithoutTimeNewDate1 } from "../../Util/DateUtil";
import TableToExcel from "@linways/table-to-excel";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField,
  Grid,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  IconButton
} from "@material-ui/core";

class MaterialInwardReport extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      search: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
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
      gateEntryListDto: {
        reqNoFrom: "",
        reqNoTo: "",
        docType: "",
        plant: "",
        status: "",
        reqDateFrom: "",
        reqDateTo: "",
        
      }
    
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

        gateEntryListDto: {
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
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  onValueChange = ({ target }) => {
    this.setState({ search: target.value, page: 0 }); // Reset page to 0 when searching
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
  render() {
    const { search, page, rowsPerPage } = this.state;
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
  
    const filteredData = this.props.materialgateEntryLineListDto.filter((entry) => {
      return searchInObject(entry, search);
    });
    return (
      <>

<React.Fragment>
        <Loader isLoading={this.state.isLoading} />
        {<UserDashboardHeader />}
        <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
        {this.state.openModal && 
              <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
               <div className="modal-backdrop"></div> <div className="modal-dialog modal-lg">
                  <div className="modal-content">
        <FormWithConstraints ref={formWithConstraints => this.printreports = formWithConstraints}
        onSubmit={(e) => {
          
         // this.setState({ asndetails: { test: "" } });
           this.changeLoaderState(true);
           this.setState({openModal:false})
         //  commonSubmitForm(e, this, "gateEntryResponse", "/rest/getRGPReportByFilter", "printreports")
          commonSubmitForm(e, this, "gateEntryResponse", "/rest/getGateEntryMaterialByFilter", "printreports")
         // this.handleSearchClick(true)
        // this.changeLoaderState(true);
          
        }} noValidate
      >
              
              {/* <input type="hidden" name='asndetails[userId]'
              value={this.state.partner.partnerId} 
              /> */}



        <div className="col-sm-12">
              <div className="row mt-3">
                <div className="col-sm-6">
                  <TextField label="REQ No From" variant="outlined" size="small" type="text" className={"form-control"} name="reqNoFrom" 
                  value={this.state.materialgateEntryLineListDto.reqNoFrom} onChange={(event) => {
                    if (event.target.value.length < 60) {
                      commonHandleChange(event, this, "materialgateEntryLineListDto.reqNoFrom", "printreports")
                    }
                  }} 
                  InputLabelProps={{ shrink: true }}  
                            inputProps={{ style: { fontSize: 12, height: "15px",  } }} />

                </div>
                <div className="col-sm-6">
                <TextField label="REQ No To" variant="outlined" size="small" type="text" className="form-control" 
                name="reqNoTo" value={this.state.materialgateEntryLineListDto.reqNoTo} onChange={(event) => {
                  if (event.target.value.length < 60) {
                    commonHandleChange(event, this, "materialgateEntryLineListDto.reqNoTo", "printreports")
                  }


                }}
                InputLabelProps={{ shrink: true }}  
                            inputProps={{ style: { fontSize: 12, height: "15px",  } }} />
                </div>
            
                  <div className="col-sm-6 mt-4" >
                  <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel shrink>Plant</InputLabel>
                    <Select  name="plant" label="Plant" 
                    value={this.state.materialgateEntryLineListDto.plant}                     
                    onChange={(event) => {
                      commonHandleChange(event, this, "materialgateEntryLineListDto.plant", "printreports")
                  }}
                  sx={{ fontSize: 12, height: "15px",  } }
                    >
                      <MenuItem value="">Select</MenuItem>
                      {(this.state.plantDropDownList).map(item =>

                        <MenuItem value={item.value}>{item.display}</MenuItem>
                      )}

                    </Select>
                    </FormControl>
                  </div>
                  <div className="col-sm-6 mt-4" >
                  <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel shrink>Status</InputLabel>
                    <Select  name="status" label="Status" 
                    value={this.state.materialgateEntryLineListDto.status}                     
                    onChange={(event) => {
                      commonHandleChange(event, this, "materialgateEntryLineListDto.status", "printreports")
                  }}
                  sx={{ fontSize: 12, height: "15px",  } }
                    >
                      <MenuItem value="">Select</MenuItem>
                      {(this.state.statusDropDownList).map(item =>

                        <MenuItem value={item.value}>{item.display}</MenuItem>
                      )}

                    </Select>
                    </FormControl>
                  </div>
                 
                </div>
                <div className="col-sm-12 text-center mt-2">
                          <Button variant="contained" size="small" color="primary" type="submit" >
                            Search
                          </Button>
                           <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                           Cancel</Button>
                        </div>
            </div>
             
              
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
                            <TableCell>Document No</TableCell>
                            <TableCell>Req Date</TableCell>
                            <TableCell>Return By</TableCell>
                            
                            <TableCell>Requestioner Name</TableCell>
                            <TableCell>Vehicle No</TableCell>
                            <TableCell>Vendor Name</TableCell>
                           
                            <TableCell>Doc Type</TableCell>
                            <TableCell>Plant</TableCell>
                            <TableCell>Material Details</TableCell>
                            <TableCell>UOM</TableCell>
                            <TableCell>Material Quantity</TableCell>
                            <TableCell>Gate In Quantity</TableCell>
                            <TableCell>Accepted Quantity</TableCell>
                            <TableCell>Rejected Quantity</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Material Status</TableCell>
                            <TableCell>Material Closed Date</TableCell>
                          
                          </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((gaterntrylineList, index) => (
                    <TableRow>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.reqNo}</TableCell>
                    <TableCell>{gaterntrylineList.materialGateIn.docNo}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.gateEntryLine.gateEntry.created)}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.gateEntryLine.gateEntry.returnBy)}</TableCell>
                   
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.createdBy!=null?gaterntrylineList.gateEntryLine.gateEntry.createdBy.userDetails.name:""}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.vehicleNo}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.vendorName}</TableCell>
                    
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.docType}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.plant}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.materialCode}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.uom}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.materialQty}</TableCell>
                    <TableCell>{gaterntrylineList.gateInQty}</TableCell>
                    <TableCell>{gaterntrylineList.acceptQty}</TableCell>
                    <TableCell>{gaterntrylineList.rejectQty}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.purpose}</TableCell>
                    <TableCell>{gaterntrylineList.materialGateIn.status}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.materialGateIn.closedDate)}</TableCell>
                    
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 150]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
        <div style={{display:"none"}}>
        <Table id="RGPLineReport">
                <TableHead>
                <TableRow>
                            <TableCell>Req No</TableCell>
                            <TableCell>Document No</TableCell>
                            <TableCell>Req Date</TableCell>
                            <TableCell>Return By</TableCell>
                            
                            <TableCell>Requestioner Name</TableCell>
                            <TableCell>Vehicle No</TableCell>
                            <TableCell>Vendor Name</TableCell>
                           
                            <TableCell>Doc Type</TableCell>
                            <TableCell>Plant</TableCell>
                            <TableCell>Material Details</TableCell>
                            <TableCell>UOM</TableCell>
                            <TableCell>Material Quantity</TableCell>
                            <TableCell>Gate In Quantity</TableCell>
                            <TableCell>Accepted Quantity</TableCell>
                            <TableCell>Rejected Quantity</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Material Status</TableCell>
                            <TableCell>Material Closed Date</TableCell>
                          
                          </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((gaterntrylineList, index) => (
                    <TableRow>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.reqNo}</TableCell>
                    <TableCell>{gaterntrylineList.materialGateIn.docNo}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.gateEntryLine.gateEntry.created)}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.gateEntryLine.gateEntry.returnBy)}</TableCell>
                   
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.createdBy!=null?gaterntrylineList.gateEntryLine.gateEntry.createdBy.userDetails.name:""}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.vehicleNo}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.vendorName}</TableCell>
                    
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.docType}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.gateEntry.plant}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.materialCode}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.uom}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.materialQty}</TableCell>
                    <TableCell>{gaterntrylineList.gateInQty}</TableCell>
                    <TableCell>{gaterntrylineList.acceptQty}</TableCell>
                    <TableCell>{gaterntrylineList.rejectQty}</TableCell>
                    <TableCell>{gaterntrylineList.gateEntryLine.purpose}</TableCell>
                    <TableCell>{gaterntrylineList.materialGateIn.status}</TableCell>
                    <TableCell>{formatDateWithoutTimeNewDate1(gaterntrylineList.materialGateIn.closedDate)}</TableCell>
                    
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
        </div>

        </div>
        
        { }</React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.materialInwardReport;
};
export default connect(mapStateToProps, actionCreators)(MaterialInwardReport);