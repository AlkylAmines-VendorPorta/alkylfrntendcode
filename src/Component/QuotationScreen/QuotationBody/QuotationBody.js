import React, { Component } from "react";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import PRList from "../QuotationPRList/PRList";
import QuotationByVendor from "../QuotationByVendor/QuotationByVendor";
import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonSetState,
} from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";
import { getUserDto, getFileAttachmentDto } from "../../../Util/CommonUtil";
import { formatDateWithoutTime } from "../../../Util/DateUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN, ROLE_REQUISTIONER_ADMIN, ROLE_PURCHASE_MANAGER_ADMIN, ROLE_BUYER_ADMIN, ROLE_NEGOTIATOR_ADMIN } from "../../../Constants/UrlConstants";
import VendorList from "../VendorList/VendorList";

class QuotationBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prMainContainer: false,
      vendorQuotationContainer: false,
      vendorList: false,
      priceBidList: [],
      paymentTermsList: [],
      incoTermsList:[],
      prDetails:
      {
        prId: "",
        docType: "",
        prNumber: "",
        requestedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        isTC: "",
        priority: "",
        status: "",
        remark: "",
        approverCode: "",
        approverName: "",
        approvedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        tcApprover: {
          userId: "",
          name: "",
          empCode: ""
        },
        buyer: {
          userId: "",
          name: "",
          empCode: ""
        },
        createdBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        approver: {
          userId: "",
          name: "",
          empCode: ""
        },
        date: "",
        partner:{
          name:""
         }
      },
      prLineArray: [],
      bidderLineArray: [],
      currentPrDetails: {
        prId: "",
        docType: "",
        prNumber: "",
        requestedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        isTC: "",
        priority: "",
        status: "",
        approverCode: "",
        approverName: "",
        approvedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        tcApprover: {
          userId: "",
          name: "",
          empCode: ""
        },
        buyer: {
          userId: "",
          name: "",
          empCode: ""
        },
        createdBy: {
          userId: "",
          name: "",
          empCode: ""
        }
      },
      currentPrLine: {
        prLineId: "",
        a: "",
        i: "",
        materialDesc: "",
        quantity: "",
        uom: "",
        valPrice: "",
        plant: "",
        deliverDate: "",
        requiredDate: "",
        fixedVendor: "",
        desiredVendor: "",
        trackingNo: "",
        assignment: "",
        description: ""
      },
      loadPriceBidList: false,
      prLineReadOnly: "",
      prIndex: "",
      negoBidderId: "",
      isStateInitialized: true,
      prAttachList:[]
    };
  }

  componentWillReceiveProps = (props) => {
    if (!isEmpty(props.priceBidList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }
    if (!isEmpty(props.paymentTermsList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }

    if (!isEmpty(props.incoTermsList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }
    if (!isEmpty(props.bidderList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }
    if (!isEmpty(props.attachmentList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }
    if (this.state.isStateInitialized) {
      
      // if (props.role === ROLE_NEGOTIATOR_ADMIN) {
        if ((props.role === ROLE_BUYER_ADMIN) || (props.role === ROLE_NEGOTIATOR_ADMIN)) {
        this.setState({ prLineReadOnly: "readonly", vendorList: true, isStateInitialized: false });
      } else {
        this.setState({ prMainContainer: true, isStateInitialized: false });
      }
    }

    if (!isEmpty(props.prAttachList)) {
      props.changeLoaderState(false);
    } else {
      props.changeLoaderState(false);
    }
  }

  setPrLine = (props) => {
    let priceBidList = [];
    props.priceBidList.map((bidderLine) => {
      priceBidList.push(this.getPRLineFromObj(bidderLine));
    });
    this.setState({
      bidderLineArray: priceBidList,
      loadPriceBidList: false
    });
  }


  getPRLineFromObj = (prLineObj) => {
    return {
      prLineId: prLineObj.prLineId,
      deliverDate: formatDateWithoutTime(prLineObj.deliverDate),
      requiredDate: formatDateWithoutTime(prLineObj.requiredDate),
      plant: prLineObj.plant,
      controlCode: prLineObj.controlCode,
      trackingNo: prLineObj.trackingNo,
      reqQty: prLineObj.quantity,
      rate: prLineObj.rate,
      balanceQuantity: prLineObj.balanceQuantity,
      lineNumber: prLineObj.lineNumber,
      fixedVendor: getUserDto(prLineObj.fixedVendor),
      description: prLineObj.description,
      assignment: prLineObj.assignment,
      a: prLineObj.a,
      i: prLineObj.i,
      materialDesc: prLineObj.materialDesc,
      isChecked: "",
      uom: prLineObj.uom,
      price: prLineObj.price
    }
  }

  loadPRMainContainer = () => {
    this.setState({
      prMainContainer: true,
      vendorList: false,
      vendorQuotationContainer: false
    });
  }

  loadVendorQuotationDiv = () => {
    this.setState({
      prMainContainer: false,
      vendorList: false,
      vendorQuotationContainer: true,
      loadPriceBidList: true,
    })
  }

  loadVendorQuotation = (index) => {
    let pr = this.props.prList[index];
    this.props.changeLoaderState(true);
    this.resetCurrentPr();
    this.loadVendorQuotationDiv();
    this.setState({
      prDetails: pr,
    });
    commonSubmitWithParam(this.props, "getVendorQuotationLine", "/rest/getVendorQuotationLine", pr.bidderId);
    this.props.changeLoaderState(true);
  }

  loadVendorQuotationByBidder = (index, bidderId) => {
    
    if (index) {
      this.resetCurrentPr();
      // if (this.props.role === ROLE_NEGOTIATOR_ADMIN) {
        if ((this.props.role === (ROLE_BUYER_ADMIN)) || (this.props.role === (ROLE_NEGOTIATOR_ADMIN))) {
        this.setState({
          prDetails: index
        });
      } else {
        let pr = this.props.prList[index];
        this.setState({
          prDetails: pr,
          negoBidderId: bidderId
        });
      }
    }
    this.loadVendorQuotationDiv();
    this.setState({
      negoBidderId: bidderId
    });
    commonSubmitWithParam(this.props, "getVendorQuotationLine", "/rest/getVendorQuotationLine", bidderId);
    this.props.changeLoaderState(true);
  }

  loadVendorListDiv = () => {
    this.setState({
      prMainContainer: false,
      vendorList: true,
      vendorQuotationContainer: false,
      loadPriceBidList: false,
    });
  }

  loadVendorList = (index, data) => {
    let pr = null;
    if (index) {
      pr = this.props.prList[index];
      this.resetCurrentPr();
      this.setState({
        prDetails: pr,
        prIndex: index
      });
    }
    this.props.changeLoaderState(true);
    this.loadVendorListDiv();
    // if (this.props.role === ROLE_NEGOTIATOR_ADMIN) {
    if ((this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN)) {
      commonSubmitFormNoValidationWithData(data, this, "getBidderQuotByPrId", "/rest/getBidderByFilter");
    } else {
      commonSubmitWithParam(this.props, "getBidderQuotByPrId", "/rest/getBidderQuotByPrId", pr.prId ? pr.prId : pr.enquiryId);
    }
  }

  resetCurrentPr = () => {
    this.setState({
      currentPrDetails: {
        prId: "",
        docType: "",
        prNumber: "",
        prDate: "",
        requestedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        isTC: "",
        priority: "",
        status: "",
        approverCode: "",
        approverName: "",
        approvedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        tcApprover: {
          userId: "",
          name: "",
          empCode: ""
        },
        buyer: {
          userId: "",
          name: "",
          empCode: ""
        },
        createdBy: {
          userId: "",
          name: "",
          empCode: ""
        }
      }
    })
  }

  handleReadOnly = (isReadOnly) => {
    this.setState({ prLineReadOnly: isReadOnly ? "readonly" : "" })
  }

  render() {
    {console.log(this.props.paymentTermsList)}

    // var isTcDocSec = this.state.prDetails.isTC ? "display_block" : "display_none";
    return (
      <>
        <div className="container-fluid mt-100 w-100" id="togglesidebar">
          <input
            type="hidden"
            name="prId"
            value={this.state.prDetails.prId}
            disabled={isEmpty(
              this.state.prDetails.prId
            )}
          />
          <div
            className={
              "card " +
              (this.state.prMainContainer == true
                ? "display_block"
                : "display_none")
            }
          >
            <PRList prList={this.props.prList}
              prStatusList={this.props.prStatusList}
              loadPRDetails={(i) =>
                // this.props.role === ROLE_NEGOTIATOR_ADMIN ? this.loadVendorList(i) : this.loadVendorQuotation(i)}
                (this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN) ? this.loadVendorList(i) : this.loadVendorQuotation(i)}
              role={this.props.role} />
          </div>

          <div
            className={"card " +
              (this.state.vendorList == true
                ? "display_block"
                : "display_none")
            }
          >
            <VendorList prList={this.props.prList}
              prStatusList={this.props.prStatusList}
              bidderList={this.props.bidderList}
              prIndex={this.state.prIndex}
              loadBidderList={true}
              loadVendorList={(pr, data) => this.loadVendorList(pr, data)}
              loadContainer={this.loadPRMainContainer}
              loadVendorQuotationByBidder={(prIndex, bidderId) => this.loadVendorQuotationByBidder(prIndex, bidderId)}
              role={this.props.role} />
          </div>

          <div
            className={
              (this.state.vendorQuotationContainer == true
                ? "display_block"
                : "display_none")
            }
          >
            <QuotationByVendor
              loadContainer={
                // this.props.role === ROLE_NEGOTIATOR_ADMIN ? this.loadVendorListDiv : this.loadPRMainContainer
                (this.props.role === (ROLE_NEGOTIATOR_ADMIN)) || (this.props.role === (ROLE_BUYER_ADMIN)) ? this.loadVendorListDiv : this.loadPRMainContainer
              }
              paymentTermsList={this.props.paymentTermsList}
              incoTermsList={this.props.incoTermsList}
              prDetails={this.state.prDetails}
              bidderId={this.state.negoBidderId}
              priceBidList={this.props.priceBidList}
              attachmentList={this.props.attachmentList}
              changeLoaderState={this.props.changeLoaderState}
              readonly={this.state.prLineReadOnly}
              handleReadOnly={this.handleReadOnly}
              role={this.props.role}
              prAttachList={this.props.prAttachList}
            />
          </div>
        </div>

      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.qbvBodyReducer;
};
export default connect(mapStateToProps, actionCreators)(QuotationBody);