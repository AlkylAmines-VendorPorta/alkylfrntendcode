import React, { Component } from "react";
import serialize from "form-serialize";
import { connect } from "react-redux";
import { isEmpty } from "../../../Util/validationUtil";
import * as actionCreators from "../../VendorApproval/VendorList/Action";
import {
  commonSubmitWithParam,
  getObjectFromPath
} from "../../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
import VendorApprovalMatrix from "../VendorApprovalMatrix/VendorApprovalMatrix";

class VendorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedVendor: "",
      vendorList: [],
      search:''
    };
  }

  onValueChange = ({target}) => {
    console.log('value',target.value)
    this.setState({search:target.value})
  }

  getVendorFromObj(vendor) {
    if (!isEmpty(vendor)) {
      let email = vendor.email;
      let name = "";
      let mobileNumber="";
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
     // let company = vendor.userDetails.partner.name;
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
        vendorCode : vendorCode
      };
    }
  }

  onSelectVendorRow = (selectedRow, partner) => {
    
    this.setState({
      previousVendor: selectedRow
    });

    let previousVendor = getObjectFromPath(
      "",
      this.state.currentSelectedVendor
    );
    this.setState(previousVendor);

    let currentVendor = getObjectFromPath("selected", selectedRow);
    this.setState(currentVendor);

    this.setState({
      currentSelectedVendor: selectedRow
    });

    this.props.updatePartner(partner);
  };

  statusForVendor = vendor => {
    if (isEmpty(vendor.partner)) {
      return "";
    }
    // console.log(vendor);
    let list = ["In Progress", "Approved", "Rejected", "Drafted", "Complete"];

    if (vendor.partner.status == "IP") {
      return list[0];
    }
    if (vendor.partner.status == "AP") {
      return list[1];
    }
    if (vendor.partner.status == "RJ") {
      return list[2];
    }
    if (vendor.partner.status == "DR") {
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
    console.log('onSearch',this.state.search);
    commonSubmitWithParam(
      this.props,
      "populateVendorList",
      `/rest/getVendorsForProfile/${this.state.search}`,
     null
    );
  }

  async componentWillReceiveProps(props) {
    if (!isEmpty(props.vendorList)) {
      let vendorArray = [];
      props.vendorList.map(vendor => {
        vendorArray.push(this.getVendorFromObj(vendor));
      });

      this.setState({
        vendorList: vendorArray
      });
    }
  }
  render() {
    console.log('this.props',this.props)
    return (
      <div className="card" id="togglesidebar">
        <div className="card-header">Vendor Details <input placeholder="search" onChange={this.onValueChange} value={this.state.search} /> <button onClick={this.onSearch}>Search</button> </div>
        <div className="card-body">
          <div className="row">
            <div class="col-sm-9"></div>
            <div class="col-sm-3">
              <input
                type="text"
                id="SearchTableDataInput"
                className="form-control"
                onKeyUp={searchTableData}
                placeholder="Search .."
              />
            </div>
            <div className="col-sm-12 mt-2">
              <table class="table table-bordered scrollTable">
                <thead>
                  <tr>
                    <th>Person Name </th>
                    <th>Mobile No</th>
                    <th>Mail ID</th>
                    <th>Company Name</th>
					          <th>Vendor</th>
                    <th>Invited By</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.state.vendorList.map((vendor, index) => (
                    <tr key={index}
                      onClick={e =>
                        this.onSelectVendorRow(
                          "selectedVendor" + index,
                          vendor.partner
                        )
                      }
                      className={this.state["selectedVendor" + index]}
                    >
                      <td> {vendor.name} </td>
                      <td> {vendor.mobNo} </td>
                      <td> {vendor.email} </td>
                      <td> {vendor.companyName} </td>
					            <td> {vendor.vendorCode} </td>
                      <td> {vendor.invitedBy} </td>
                      <td> {vendor.department} </td>
                      <td> {vendor.designation} </td>
                      <td> {this.statusForVendor(vendor)} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.vendorListInfo;
};
export default connect(mapStateToProps, actionCreators)(VendorList);
