import React, { Component } from "react";
import { searchTableData } from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import { connect } from "react-redux";
import { formatDateWithoutTime } from "../../../Util/DateUtil";
// import { getUserDto, getUserDetailsDto, getPartnerDto, getBidDto } from "../../../Util/CommonUtil";
import {
  // commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange
} from "../../../Util/ActionUtil";
import { ROLE_NEGOTIATOR_ADMIN,ROLE_BUYER_ADMIN } from "../../../Constants/UrlConstants";
import * as actionCreators from "./Action/Action";
class VendorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bidderLineArray: [],
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

  render() {
    // console.log("Bidder Line Array is in:",this.props.bidderList)
    const { filter } = this.state;
    return (
      <>
        <div className="row px-4 py-2" id="togglesidebar">
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
          <div className="col-sm-12">
            <div className="row mt-2">
              <label className="col-sm-2 mt-4">Enq No</label>
              <div className="col-sm-4">
                <label>From </label>
                <input type="number" id="ENQNOFROM" className="form-control" value={filter.enqNoFrom}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqNoFrom")}
                />
              </div>
              <div className="col-sm-4">
                <label>To </label>
                <input type="number" id="ENQNOTO" className="form-control" value={filter.enqNoTo}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqNoTo")}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row mt-2">
              <label className="col-sm-2 mt-4">Enq Date</label>
              <div className="col-sm-4">
                <label>From </label>
                <input type="date" max="9999-12-31" id="ENQDATEFROM" className="form-control" value={filter.enqDateFrom}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqDateFrom")}
                />
              </div>
              <div className="col-sm-4">
                <label>To </label>
                <input type="date" max="9999-12-31" id="ENQDATETO" className="form-control" value={filter.enqDateTo}
                  onChange={(e) => commonHandleChange(e, this, 'filter.enqDateTo')}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row mt-2">
              <label className="col-sm-2 mt-4">Enq End Date</label>
              <div className="col-sm-4">
                <label>From </label>
                <input type="date" max="9999-12-31" id="ENQENDDATEFROM" className="form-control" value={filter.enqEndDateFrom}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqEndDateFrom")}
                />
              </div>
              <div className="col-sm-4">
                <label>To </label>
                <input type="date" max="9999-12-31" id="ENQENDDATETO"  className="form-control" value={filter.enqEndDateTo}
                  onChange={(e) => commonHandleChange(e, this, 'filter.enqEndDateTo')}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row mt-2">
              <label className="col-sm-2">Enq Status </label>
              <div className="col-sm-3">
                <select className="form-control"
                  value={filter.enqStatus}
                  onChange={(e) => commonHandleChange(e, this, "filter.enqStatus")}
                  id="ENQSTATUS" 
                >
                  <option value="">Select</option>
                  {
                    (this.state.enqStatus).map(item =>
                      <option value={item.value}>{item.display}</option>
                    )}
                </select>
              </div>
              <label className="col-sm-2">Bid Status</label>
              <div className="col-sm-3">
                <select className="form-control"
                  value={filter.biiderStatus}
                  onChange={(e) => commonHandleChange(e, this, "filter.biiderStatus")}
                  id="BIDSTATUS" 
                >
                  <option value="">Select</option>
                  {
                    (this.state.bidderStatus).map(item =>
                      <option value={item.value}>{item.display}</option>
                    )}
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row mt-2">
              <label className="col-sm-2">Buyer (Employee code) </label>
              <div className="col-sm-3">
                <input type="text" className="form-control" value={filter.buyerCode}
                  onChange={(e) => commonHandleChange(e, this, "filter.buyerCode")}
                  id="BUYER" 
                />
              </div>
              <label className="col-sm-2">Vendor Code</label>
              <div className="col-sm-3">
                <input type="text" className="form-control" value={filter.vendorCode}
                  onChange={(e) => commonHandleChange(e, this, "filter.vendorCode")}
                  id="VENDOR" 
                />
              </div>
              <button type="button" className={"btn btn-primary"} onClick={() => this.props.loadVendorList(null, this.state.filter)}> Search </button> &nbsp;
              <button type="button" className={"btn btn-danger"} onClick={this.clearFields.bind(this)}> Clear </button>
            </div>
          </div>
          {/* <div className="col-sm-6">
            <div className="row mt-2">
              <div className="col-sm-4"></div>
              <div className="col-sm-8">
                <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
              </div>
            </div>

          </div> */}
          <div className="col-12">
            <StickyHeader height={450} className="table-responsive mt-2">
              <table className="table table-bordered table-header-fixed">
                <thead>
                  <tr>
                    {/* {this.props.role === ROLE_NEGOTIATOR_ADMIN ? */}
                    {(this.props.role === ROLE_BUYER_ADMIN) || (this.props.role === ROLE_NEGOTIATOR_ADMIN) ?
                      <>
                        <th className="w-15per">Enq No</th>
                        <th className="w-15per">Enq Date</th>
                        <th className="w-15per">Vendor Name</th>
                        <th className="w-15per">Buyer Name</th>
                        <th className="w-25per"> Enq End Date </th>
                        <th className="w-10per">Status</th>
                      </>
                      :
                      <>
                        <th className="w-25per"> Bidder Code & Name </th>
                      </>
                    }
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.state.bidderLineArray.map((el, i) =>
                    // this.props.role === ROLE_NEGOTIATOR_ADMIN ?
                    (this.props.role === ROLE_BUYER_ADMIN) || (this.props.role === ROLE_NEGOTIATOR_ADMIN) ?
                      <tr onClick={() => this.props.loadVendorQuotationByBidder(el, el.bidderId)}>
                        <td>{el.enquiry.enquiryId}</td>
                        <td>{formatDateWithoutTime(el.enquiry.created)}</td>
                        <td>{el.partner.vendorSapCode + "-" + el.partner.name}</td>
                        <td>{el.enquiry.createdBy.userName + " - " + el.enquiry.createdBy.name}</td>
                        <td>{formatDateWithoutTime(el.enquiry.bidEndDate)}</td>
                        <td>{el.status}</td>
                      </tr>
                      :
                      <tr onClick={() => this.props.loadVendorQuotationByBidder(this.props.prIndex, el.bidderId)}>
                        <td>{el.bidderId + " & " + el.name}</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.vendorListForQuotationReducer;
};
export default connect(mapStateToProps, actionCreators)(VendorList);