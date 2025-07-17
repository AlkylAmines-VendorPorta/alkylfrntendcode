import React, { Component } from "react";
import { searchTableData } from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import { connect } from "react-redux";
import formatDate, { formatDateWithoutTime } from "../../../Util/DateUtil";
// import { getUserDto, getUserDetailsDto, getPartnerDto, getBidDto } from "../../../Util/CommonUtil";
import {
  // commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange
} from "../../../Util/ActionUtil";
import { ROLE_NEGOTIATOR_ADMIN,ROLE_BUYER_ADMIN } from "../../../Constants/UrlConstants";
import * as actionCreators from "./Action/Action";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Container,
  IconButton
} from "@material-ui/core";
import { API_BASE_URL } from "../../../Constants";
import axios from "axios";
import DataTable from "react-data-table-component";
class VendorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bidderLineArray: [],
      search: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
      filter: {
        enqNoFrom: null,
        enqNoTo: null,
        enqDateFrom: null,
        enqDateTo: null,
        buyerCode: null,
        vendorCode: null,
        enqEndDateFrom: null,
        enqEndDateTo: null,
        enqStatus: null,
        biiderStatus: null
      },
      loadVendorDetails: true,
      bidderStatus: [],
      enqStatus: []
    };
  }

  componentDidMount() {
    if (this.state.loadVendorDetails) {
      commonSubmitWithParam(this.props, "getNegotiatorFilterDropDown", "/rest/getNegotiatorFilterDropDown");
    }
  }

  componentWillReceiveProps = props => {
    let bidderStatusArray = [], enqStatusArray = [];
    
    if (props.vendorDropDownList && this.state.loadVendorDetails) {
      if(props.vendorDropDownList.objectMap){
          Object.keys(props.vendorDropDownList.objectMap.bidderStatus).map((key) => {
          bidderStatusArray.push({ display: props.vendorDropDownList.objectMap.bidderStatus[key], value: key });
        });
      
        Object.keys(props.vendorDropDownList.objectMap.enqStatus).map((key) => {
          enqStatusArray.push({ display: props.vendorDropDownList.objectMap.enqStatus[key], value: key });
        });
        this.setState({ bidderStatus: bidderStatusArray, enqStatus: enqStatusArray, loadVendorDetails: false })
      }
    }
    if (!isEmpty(props.bidderList)) {
      this.setBidderLineNego(props);
    }
  }

  setBidderLineNego = (props) => {
    let bidderList = [];
    props.bidderList.map((bidderLine) => {
      bidderList.push(bidderLine);
    });
    this.setState({
      bidderLineArray: bidderList,
      loadBidderList: false
    });
  }

  getBidderLineFromObj = (bidderLineObj) => {
    return {
      basicAmt: bidderLineObj.basicAmt,
      bidderId: bidderLineObj.bidderId,
      name: bidderLineObj.partner.name,
      status: bidderLineObj.status
    }
  }

  clearFields = () => {
    document.getElementById("ENQNOFROM").value = "";
    document.getElementById("ENQNOTO").value = "";
     document.getElementById("ENQDATEFROM").value = "";
     document.getElementById("ENQDATETO").value = "";
     document.getElementById("ENQENDDATEFROM").value = "";
     document.getElementById("ENQENDDATETO").value = "";
     document.getElementById("ENQSTATUS").value = "";
     document.getElementById("BIDSTATUS").value = "";
     document.getElementById("BUYER").value = "";
     document.getElementById("VENDOR").value = "";



  }
  handleSearchChange = (event) => {
    this.setState({ search: event.target.value });
    
  };
  handlePageChange = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
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
  resendEnquiry = async (id) => {
    this.setState({ loading: true, error: null }); // Reset error and set loading

    try {
      // Replace the URL with your API endpoint
      const response = await axios.get(`${API_BASE_URL}/resendEnquiryMailToBidder/${id}`);
      this.setState({ data: response.data, loading: false }); // Update state with the API response data
    } catch (error) {
      this.setState({ loading: false, error: error.message }); // Handle any errors
    }
  };
  handleRowClick = (row) => {
  
  this.props.loadVendorQuotationByBidder(row, row.bidderId);
};
  render() {
    const { page, rowsPerPage, search } = this.state;
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
  
    const filteredData = this.state.bidderLineArray.filter((entry) => {
      return searchInObject(entry, search);
    });
    const { filter } = this.state;
         const columns = [
      {
        name: 'Enq No',
        selector: row => row.enquiry.enquiryId,
        sortable: true,
        maxWidth: '50px'
      },
     {
        name: 'Enq Date',
        selector: row => row.enquiry.created,
        cell: row => formatDate(row.enquiry.created),
        sortable: true
      },
    
      {
        name: 'Vendor Name',
        selector: row => row.partner.vendorSapCode + "-" + row.partner.name,
        sortable: true
      },
      {
        name: 'Buyer Name',
        selector: row => row.enquiry.createdBy.userName + " - " + row.enquiry.createdBy.name,
        sortable: true
      },
      {
        name: 'Enq End Date',
        selector: row => row.enquiry.bidEndDate,
        cell: row => formatDate(row.enquiry.bidEndDate),
        sortable: true
      },
    {
        name: 'Status',
        selector: row =>  row.status,
        sortable: true
      },
    
      {
        name: 'Action',
        selector: row => row.tcApprover.name,
       cell: (row) => (
      <Button size="small" variant="contained"
                         color="primary" 
                         style={{fontSize:"8px", margin:"2px 0px"}}
                         onClick={()=>this.resendEnquiry(row.bidderId)}
                         >Resend Enquiry</Button>
    ),
    ignoreRowClick: true,
    button: true,
    minWidth:"180px"
      },
      {
        name: 'Bidder Code & Name',
        selector: row => row.bidderId + " & " + row.name,
        sortable: true,
        omit:(this.props.role === ROLE_BUYER_ADMIN) || (this.props.role === ROLE_NEGOTIATOR_ADMIN)
      }
    ]
    return (
      <>
        <>
          {/* {!this.props.role === ROLE_NEGOTIATOR_ADMIN ? */}
          {!this.props.role === ROLE_BUYER_ADMIN ?
            <><div className="col-sm-9">
              <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.props.loadContainer()}><i className="fa fa-arrow-left" /></button>
            </div>
              <div className="col-sm-3">
                <input
                  type="text"
                  id="SearchTableDataInput"
                  className="form-control"
                  onKeyUp={searchTableData}
                  placeholder="Search .."
                />
              </div></>
            : null}
             {this.state.openModal && <div className="customModal modal roleModal" id="updateRoleModal show" style={{ display: 'block' }}>
          <div className="modal-backdrop"></div>
                                    <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
        <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField label="Enq No From" 
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqNoFrom}
              onChange={(e) => commonHandleChange(e, this, "filter.enqNoFrom")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Enq No To" 
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqNoTo}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqNoTo")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Enq Date From" 
              type="date"
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqDateFrom}
              onChange={(e) => commonHandleChange(e, this, "filter.enqDateFrom")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Enq Date To" 
              type="date"
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqDateTo}
                  onChange={(e) => commonHandleChange(e, this, 'filter.enqDateTo')}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Enq End Date From" 
              type="date"
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqEndDateFrom}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqEndDateFrom")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Enq End Date To" 
              type="date"
              variant="outlined" size="small" 
              fullWidth
              value={filter.enqEndDateTo}
              onChange={(e) => commonHandleChange(e, this, 'filter.enqEndDateTo')}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <FormControl fullWidth size="small" variant="outlined" 
              >
              <InputLabel shrink >Enq Status </InputLabel>
                <Select name="status" 
                value={filter.enqStatus}
                onChange={(e) => commonHandleChange(e, this, "filter.enqStatus")}
                label="Enq Status" 
                sx={{ fontSize: 12, height: "15px",  } } >
                  <MenuItem value="">Select</MenuItem>
                  {(this.state.enqStatus).map((item) => (
                    <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small" variant="outlined" 
              >
              <InputLabel shrink >Bid Status </InputLabel>
                <Select name="status" 
                value={filter.biiderStatus}
                onChange={(e) => commonHandleChange(e, this, "filter.biiderStatus")}
                label="Bid Status" 
                sx={{ fontSize: 12, height: "15px",  } } >
                  <MenuItem value="">Select</MenuItem>
                  {(this.state.bidderStatus).map((item) => (
                    <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
           <Grid item xs={6}>
              <TextField label="Buyer (Employee code)" 
              variant="outlined" size="small" 
              fullWidth
              value={filter.buyerCode}
              onChange={(e) => commonHandleChange(e, this, "filter.buyerCode")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
           <Grid item xs={6}>
              <TextField label="Vendor Code" 
              variant="outlined" size="small" 
              fullWidth
              value={filter.vendorCode}
              onChange={(e) => commonHandleChange(e, this, "filter.vendorCode")}
              InputLabelProps={{ shrink: true }}  
              inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
              />
           </Grid>
        </Grid>
        <Grid item xs={12} className="mt-3" style={{textAlign:"center"}}>
              <Button size="small" color="primary" variant="contained" type="button"  
              onClick={() => {
                this.setState({ openModal:false});
                this.props.loadVendorList(null, this.state.filter);
              }}> Search </Button> 
              <Button size="small"  color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                 Cancel</Button>
                <Button size="small" color="primary" variant="contained" type="button" className={"ml-1"} onClick={this.clearFields.bind(this)}> Clear </Button>
        </Grid>
          </div>
      </div>
  </div>}

          <Grid container>
            <Grid item sm={12} className="mb-1">   
            <input
            placeholder="Search"
            // variant="outlined"
            // size="small"
            style={{fontSize: "10px", float:"right" }}
            value={search}
            onChange={this.handleSearchChange}
        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
        </Grid>
        </Grid>
          <TableContainer>
              {/* <table className="my-table">
                <thead>
                  <tr>
                  
                        <th className="w-15per">Enq No</th>
                        <th className="w-15per">Enq Date</th>
                        <th className="w-15per">Vendor Name</th>
                        <th className="w-15per">Buyer Name</th>
                        <th className="w-25per"> Enq End Date </th>
                        <th className="w-10per">Status</th>                        
                        <th className="w-10per">Action</th>
                        {(this.props.role === ROLE_BUYER_ADMIN) || (this.props.role === ROLE_NEGOTIATOR_ADMIN) &&  <th className="w-25per"> Bidder Code & Name </th>}
                    
                    
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((el, i) => 
                 <tr >
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}>{el.enquiry.enquiryId}</td>
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}> {formatDate(el.enquiry.created)}</td>
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}>{el.partner.vendorSapCode + "-" + el.partner.name}</td>
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}>{el.enquiry.createdBy.userName + " - " + el.enquiry.createdBy.name}</td>
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}> {formatDate(el.enquiry.bidEndDate)}</td>
                        <td onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}>{el.status}</td>
                        <td className="w-10per">
                          <Button size="small" variant="contained"
                         color="primary" 
                         style={{fontSize:"8px", margin:"2px 0px"}}
                         onClick={()=>this.resendEnquiry(el.bidderId)}
                         >Resend Enquiry</Button></td>
                        {(this.props.role === ROLE_BUYER_ADMIN) || (this.props.role === ROLE_NEGOTIATOR_ADMIN) && <td>{el.bidderId + " & " + el.name}</td>}
                      </tr>
                  )}
                </tbody>
              </table> */}
              <DataTable
                              columns={columns}
                              data={filteredData}
                              pagination
                              responsive
                              paginationPerPage={50}  
                              paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                              onRowClicked={this.handleRowClick}
                            />
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={this.handlePageChange}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              /> */}
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.vendorListForQuotationReducer;
};
export default connect(mapStateToProps, actionCreators)(VendorList);