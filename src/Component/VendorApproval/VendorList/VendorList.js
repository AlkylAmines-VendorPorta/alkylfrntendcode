import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "../../../Util/validationUtil";
import * as actionCreators from "../../VendorApproval/VendorList/Action";
import {
  commonSubmitWithParam,
  getObjectFromPath,
} from "../../../Util/ActionUtil";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";

class VendorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedVendor: "",
      vendorList: [],
      search: "",
      searchFilter: "",
      page: 0,
      openModal:false,
      rowsPerPage: 50,
      hoveredRow: null,
    };
  }

  onValueChange = ({ target }) => {
    this.setState({ search: target.value, page: 0 }); // Reset page to 0 when searching
  };
  onValueChangeFilter = ({ target }) => {
    this.setState({ searchFilter: target.value, page: 0 }); // Reset page to 0 when searching
  };

  getVendorFromObj = (vendor) => {
    if (!isEmpty(vendor)) {
      let email = vendor.email;
      let name = "";
      let mobileNumber = "";
      if (!isEmpty(vendor.userDetails)) {
        name = vendor.userDetails.name;
        mobileNumber = vendor.userDetails.mobileNo;
      }
      let invitedBy = "";
      let dept = "";
      let designation = "";
      let vendorCode = vendor.userName;
      if (!isEmpty(vendor.createdBy)) {
        invitedBy = vendor.createdBy.name;
        if (!isEmpty(vendor.createdBy.userDetails)) {
          dept = vendor.createdBy.userDetails.userDept;
          designation = vendor.createdBy.userDetails.userDesignation;
        }
      }
      let company = vendor.partner.name;
      if (!isEmpty(vendor.partner)) {
        company = vendor.partner.name;
      }

      return {
        name: name,
        email: email,
        companyName: company,
        designation: designation,
        department: dept,
        invitedBy: invitedBy,
        mobNo: mobileNumber,
        partner: vendor.partner,
        vendorCode: vendorCode,
      };
    }
    return null;
  };

  onSelectVendorRow = (selectedRow, partner) => {
    this.setState({
      previousVendor: selectedRow,
      currentSelectedVendor: selectedRow,
    });

    this.props.updatePartner(partner);
  };

  statusForVendor = (vendor) => {
    if (isEmpty(vendor.partner)) {
      return "";
    }
    let list = ["In Progress", "Approved", "Rejected", "Drafted", "Complete"];

    if (vendor.partner.status === "IP") {
      return list[0];
    }
    if (vendor.partner.status === "AP") {
      return list[1];
    }
    if (vendor.partner.status === "RJ") {
      return list[2];
    }
    if (vendor.partner.status === "DR") {
      return list[3];
    } else {
      return list[4];
    }
  };

  async componentDidMount() {
    commonSubmitWithParam(
      this.props,
      "populateVendorList",
      "/rest/getInvitedVendors",
      null
    );
  }

  onSearch = () => {
   // console.log("onSearch", this.state.searchFilter);
    commonSubmitWithParam(
      this.props,
      "populateVendorList",
      `/rest/getVendorsForProfile/${this.state.searchFilter}`,
      null
    );
    this.setState({openModal:false})
  };

  componentDidUpdate(prevProps) {
    if (prevProps.vendorList !== this.props.vendorList) {
      if (!isEmpty(this.props.vendorList)) {
        let vendorArray = [];
        this.props.vendorList.forEach((vendor) => {
          const vendorObj = this.getVendorFromObj(vendor);
          if (vendorObj) {
            vendorArray.push(vendorObj);
          }
        });

        this.setState({
          vendorList: vendorArray,
        });
      }
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
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
  render() {
    const { vendorList, search, page, rowsPerPage, hoveredRow } = this.state;

    // Filter vendors based on search query
    const filteredVendors = vendorList.filter((vendor) =>
      Object.values(vendor).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
    ));

    return (
      <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
      {this.state.openModal && 
                  <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
                                         <div className="modal-backdrop"></div>
                                          <div className="modal-dialog modal-sm">
                                             <div className="modal-content">
                         
                            <div className="col-sm-12">
                              <div className="row mt-2">
                                                 <div className="col-sm-12 mb-4 mt-4">
      
                                                       <TextField variant="outlined" size="small"
                                                        label="Vendor Details" 
                                                        InputLabelProps={{shrink:true}}
                                                        type="text" className="form-control"                                                         
                                                        onChange={this.onValueChangeFilter} value={this.state.searchFilter}
                                                       inputProps={{ style: { fontSize: 12, height: "15px",  background:"#fff" } }}  />
                                                    </div>
                                                    
                                               
                             <div className="col-sm-12 text-center mt-4" style={{textAlign:"center"}}>  
                             <Button size="small" color="primary" variant="contained" type="button"  className={"btn btn-primary"}
                             onClick={this.onSearch}>
                                    Search</Button>
                                    <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                                    Cancel</Button>
                              </div>
                             
                                </div>
      
                             
                                
                                
                                </div>
      </div></div></div>}
      <Grid container spacing={2} alignItems="center" justify="flex-end">
      <Grid item xs={9} style={{textAlign:"left"}}>
        </Grid>
         <Grid item xs={3}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={this.onValueChange}
            style={{fontSize: "10px", float:"right" }}
          />
          <IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
          </Grid>
          </Grid>
        <TableContainer component={Paper}>
          <Table className="my-table">
            <TableHead>
              <TableRow>
                <TableCell>Person Name</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Mail ID</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Vendor Code</TableCell>
                <TableCell>Invited By</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vendor, index) => (
                  <TableRow
                    key={index}
                    onClick={() =>
                      this.onSelectVendorRow(
                        "selectedVendor" + index,
                        vendor.partner
                      )
                    }
                    
                  >
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.mobNo}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.companyName}</TableCell>
                    <TableCell>{vendor.vendorCode}</TableCell>
                    <TableCell>{vendor.invitedBy}</TableCell>
                    <TableCell>{vendor.department}</TableCell>
                    <TableCell>{vendor.designation}</TableCell>
                    <TableCell>{this.statusForVendor(vendor)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={filteredVendors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => state.vendorListInfo;
export default connect(mapStateToProps, actionCreators)(VendorList);