import React, { Component } from "react";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { connect } from "react-redux";
import { isEmptyDeep, isEmpty } from "../../Util/validationUtil";
import {
  getReferenceListDataApi,
  submitToSAPURL,
  savetoServer,
} from "../../Util/APIUtils";
import { API_BASE_URL } from "../../Constants";
import { submitToURL } from "../../Util/APIUtils";
import * as actionCreators from "./Action.js";
import StickyHeader from "react-sticky-table-thead";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonSubmitWithParamSapUrl,
  commonSubmitWithObjectParams,
  commonHandleChangeCheckBox,
  commonSubmitFormNoValidationWithData,
  commonHandleReverseChangeCheckBox,
  commonSetState,
  validateForm,
  resetForm,
  swalWithTextBox,
  swalWithTextBoxDynamicMessage,
  commonSubmitFormNoValidation,
  commonSubmitFormValidation,
  swalPrompt,
  commonSubmitWithoutEvent,
  commonHandleFileUploadInv,
  swalWithDate,
  showAlert,
} from "../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
import {
  FormWithConstraints,
  FieldFeedbacks,
  FieldFeedback,
} from "react-form-with-constraints";
import { getIFSCDetails } from "../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { useState } from "react";
import axios from "axios";
import { formatTime,formatDateWithoutTimeNewDate } from "../../Util/DateUtil";
import {
  searchTableDataThree,
  searchTableDataFour,
} from "../../Util/DataTable";
import {
  formatDateWithoutTime,
  formatDateWithoutTimeWithMonthName,
} from "../../Util/DateUtil";
import { is } from "@babel/types";
import {
  getCommaSeperatedValue,
  getDecimalUpto,
  removeLeedingZeros,
  addZeroes,
  textRestrict,
} from "../../Util/CommonUtil";

import swal from "sweetalert";

import serialize from "form-serialize";


const SwalNew = require("sweetalert2");
const height_dy = window.innerHeight - 135;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class STOASN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      status:"",
      stoASNList: [],
      stoASNlineList:[],
      plantDropDownList: [],
      outboundDeliveryNo:"",
      asnList:[],
      asnStatusList: [],
    //   STOASNFetchDetails:{
    //     asnNumber:"",
    //     invoiceNo:"",
    //     invoiceDate:"",
    //     transporterNo:"",
    //     lrNumber:"",
    //     lrDate:"",
    //     vehicalNo:"",
    //     grossWeight:"",
    //     tareWeight:"",
    //     numberOfPackages:"",
    //     netWeight:"",
    //     nameOfDriver:"",
    //     mobileNumber:"",
    //     photoIdProof:""
    //  }
    };
  }

  //   addGateEntry() {
  //     let securityPOHeaderDto = this.state.securityPOHeaderDto;
  //     this.setState({ securityPOHeaderDto: securityPOHeaderDto });
  //   }

  handleSubmit = (e) => {
    commonSubmitWithParam(this.props, "getASNList", "/rest/getASN");

    document.getElementById("report").style.display = "none";
  };

  handleClick = async () => {
    await delay(2000);
    
    if(this.props.asnStatus==="REPORTED"){
    await delay(2000);
    this.handleSubmit();
        }
      else{
         this.changeLoaderState(false)
  }
    //commonSubmitWithParam(this.props,"securityASNSubmit","/rest/printSecurityGateInForm",this.state.securityPOHeaderDto.asnHeaderId)
  };

  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  onSubmit = async (e) => {
    // this.setState({ loadASNDetails: true, loadASNLineList: true });
    //  commonSubmitForm(e,this, "securityASNSubmit","/rest/saveCommercialHeaderDetailsinASN","asnFormDet")
    commonSubmitForm(
      e,
      this,
      "securityASNSubmit",
      "/rest/saveASNwithoutPO",
      "asnFormDet"
    );

    // await delay(2000);
    // this.handleSubmit();

    //  commonSubmitForm(e, this, "securityASNSubmit", "/rest/saveSecurityHeaderDetails");
  };

  handleSearch = (i) => {
    this.props.asnList.map((asn, index) =>
      index === this.props.asnList.length - 1
        ? commonSubmitWithParam(
            this.props,
            "securityASNSubmit",
            "/rest/printSecurityGateInForm",
            asn.advanceShipmentNoticeId
          )
        : ""
    );
  };

  getASNLineFromPOLine(poLine) {
    return {
      poLineNumber: poLine.lineItemNumber,
      poLineId: poLine.poLineId,
      asnLineNumber: poLine.lineItemNumber,
      deliveryQuantity: "",
      poRate: poLine.rate,
      materialCode: poLine.materialCode,
      materialName: poLine.material,
      poQty: poLine.poQuantity,
      balQty1: poLine.balanceQuantity1,
      uom: poLine.uom,
      balQty: poLine.balanceQuantity,
      plant: poLine.plant,
    };
  }

  SwitchButtons(buttonId) {
    var hideBtn, showBtn, showBtn1, showgateoutBtn;
    if (buttonId == "report") {
      showBtn = "gateIn";
      showBtn1 = "print";
      hideBtn = "report";
      showgateoutBtn = "gateout";
    }
    document.getElementById(hideBtn).style.display = "none"; //step 2 :additional feature hide button
    document.getElementById(showBtn).style.display = ""; //step 3:additional feature show button
    document.getElementById(showBtn1).style.cssText = "display:none";
    document.getElementById(showgateoutBtn).style.display = "";
  }

  showHistory = () => {
    this.setState({
      showHistory: true,
    });
  };

  STOASNDetails = () => {
    commonSubmitWithParam(
      this.props,
      "getSTOASNDetails",
      "/rest/createSTOASN",
      this.props.po.outboundDeliveryNo
    );
  };

  async componentWillReceiveProps(props) {
    if (!isEmpty(props.po)) {
      this.setState({
        po: props.po,
      });
    }

    if (!isEmpty(props.stoASNList)) {
      this.setState({
        stoASNList: props.stoASNList[0],
      });
    }

    if (!isEmpty(props.stoASNlineList)) {
        this.setState({
            stoASNlineList: props.stoASNlineList,
        });
      }

    if (!isEmpty(this.props.doctype)) {
      this.setState({
        doctype: this.props.doctype,
      });
    }


    if (!isEmpty(this.props.outboundDeliveryNo)) {
      this.setState({
        outboundDeliveryNo: this.props.outboundDeliveryNo,
      });
    }

    if (!isEmpty(props.asnList)) {
        this.setState({
          asnList: props.asnList,
        });
      }

      if (!isEmpty(props.asnStatus)) {
        this.setState({
          asnStatus: props.asnStatus
              });
            }

            if (isEmpty(props.asnStatusList) && this.state.loadAsnStatusList) {
              commonSubmitWithParam(this.props, "getStatusDisplay", "/rest/getASNStatusList");
            }

            if (!isEmpty(props.asnStatusList) && this.state.loadAsnStatusList) {
              this.setState({
                 loadAsnStatusList: false,
                 asnStatusList: props.asnStatusList
              })
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
        plantDropDownList: plantListArray,
      });
    });

    // if(this.props.po.outboundDeliveryNo!==prevProps.po.outboundDeliveryNo){
    //    this.STOASNDetails();
    //  //  commonSubmitWithParam(this.props,"getSTOASNDetails",'/rest/createSTOASN',this.props.po.outboundDeliveryNo)
    // }
  }

  outbounddeliverySearch=()=>{
    commonSubmitWithParam(this.props,"getSTOASNDetails",'/rest/createSTOASN',this.state.outboundDeliveryNo)
  
   }

  getEmptyGateEntryLineObj = (serialSize) => {
    return {
      //   asnLineId: "",
      asnLineId: "",
      lineItemNo: "",
      name: "",
      uom: "",
      rate: "",
      deliveryQuantity: "",

      // poRate: 0,
      // materialCode: "",
      // materialName: "",
      // poQty: 0,
      // uom: "",
      //   gateEntryLineId: "",
      //   serialNo: serialSize + 1,
      //   materialCode: "",
      //   materialDesc: "",
      //   materialQty: "",
      //   materialRate: "",
      //   materialCost: "",
      //   repairingCost: "",
      securityPOHeaderDto: {
        asnId: "",
      },
    };
  };

  addGateEntry() {
    let securityPOHeaderDto = this.state.securityPOHeaderDto;
    let asnLineList = this.state.securityPOHeaderDto.asnLineList;
    let asnLineArrayList = [this.getEmptyGateEntryLineObj(asnLineList.length)];
    asnLineList = asnLineList.concat(asnLineArrayList);
    securityPOHeaderDto.asnLineList = asnLineList;
    this.setState({ securityPOHeaderDto: securityPOHeaderDto });
  }

  removeGateEntry(i) {
    let securityPOHeaderDto = this.state.securityPOHeaderDto;
    let asnLineList = this.state.securityPOHeaderDto.asnLineList;
    asnLineList.splice(i, 1);
    securityPOHeaderDto.asnLineList = asnLineList;
    this.setState({ securityPOHeaderDto: securityPOHeaderDto });
  }

  getASNFromObj(asnObj) {
    return {
      asnId: asnObj.advanceShipmentNoticeId,
      asnNumber: asnObj.advanceShipmentNoticeNo,
      serviceSheetNo: asnObj.serviceSheetNo,
      invoiceNo: asnObj.invoiceNo,
      invoiceDate: formatDateWithoutTimeWithMonthName(asnObj.invoiceDate),
      created: formatDateWithoutTimeWithMonthName(asnObj.created),
      invoiceAmount: asnObj.invoiceAmount,
      mismatchAmount: asnObj.mismatchAmount,
      deliveryNoteNo: asnObj.deliveryNoteNo,
      deliveryNoteDate: formatDateWithoutTimeWithMonthName(
        asnObj.deliveryNoteDate
      ),
      lrDate: formatDateWithoutTime(asnObj.lrDate),
      lrNumber: asnObj.lrNumber,
      transporterNo: asnObj.transporterNo,
      vehicalNo: asnObj.vehicalNo,
      netWeight: asnObj.netWeight,
      eWayBillNo: asnObj.eWayBillNo,
      grossWeight: asnObj.grossWeight,
      tareWeight: asnObj.tareWeight,
      numberOfPackages: asnObj.numberOfPackages,
      isCOA: asnObj.isCOA === "Y",
      isPackingList: asnObj.isPackingList === "Y",
      typeOfPackingBulk: asnObj.typeOfPackingBulk,
      remarks: asnObj.remarks,
      igst: asnObj.igst,
      cgst: asnObj.cgst,
      sgst: asnObj.sgst,
      tcs: asnObj.tcs ? asnObj.tcs : 0,
      basicAmount: asnObj.basicAmount,
      packingCharges: asnObj.packingCharges,
      freightCharges: asnObj.freightCharges,
      invoiceDoc:
        asnObj.invoiceNo != null
          ? this.checkInvoiceFromObj(asnObj.invoice)
          : "",
      deliveryNoteDoc:
        asnObj.deliveryNoteNo != null
          ? this.CheckInvoiceFromObjForDelivery(asnObj.invoice)
          : "",
      status: asnObj.status,
      // status: asnObj.status,
      nameOfDriver: asnObj.nameOfDriver,
      mobileNumber: asnObj.mobileNumber,
      photoIdProof: asnObj.photoIdProof,
      loadingCharges: asnObj.loadingUnloadingCharges,
      irn: asnObj.irn,
      invoiceApplicable: asnObj.invoiceApplicable === "Y",
      isUnload: asnObj.isUnload === "Y",
      isQC: asnObj.isQCPassed === "Y",
      grnNO: asnObj.grnId,
      description: asnObj.description,
      roundOffAmount: asnObj.roundOffAmount,
      roundOffValue: asnObj.roundOffValue,
    };
  }

  loadASNForEdit(asn) {
    this.props.showHistoryFalse();
    this.props.showGateEntry(true, asn);
    this.setState({
      loadASNLineList: true,
      loadPOLineList: true,
      loadStorageLocation: true,
      securityPOHeaderDto: asn,
      asnLineArray: asn.poLine,
      showHistory: false,
      po: asn.po,
      currentASN: asn,
      editButtonForAsn:
        asn.status === "IT" && this.state.role === "VENADM" ? true : false,
      loadServiceLineList: true,
      qc: this.state.role === "QCADM",
    });
    this.props.changeLoaderState(true);
    commonSubmitWithParam(
      this.props,
      "getASNLineList",
      "/rest/getSecurityASNLines",
      asn.asnHeaderId
    );
  }

  render() { 
    const STOASNFetchDetails = this.state.stoASNList;
    const stoasnlinelist= this.state.stoASNlineList;
    const plant=stoasnlinelist[0];
   

    var displayService = "none";
    var displayAsnLine = "block";

    if (!isEmpty(this.state.serviceLineArray) && !this.state.asnShown) {
      displayService = "block";
      displayAsnLine = "none";
    } else if (this.state.asnShown) {
      displayService = "none";
      displayAsnLine = "none";
    }

    var asnShown = {
      display: this.state.asnShown ? "block" : "none",
    };
    var asnListHidden = {
      display: this.state.asnShown ? "none" : "block",
    };
 
    return (
      <>
        <React.Fragment>
          <Loader isLoading={this.state.isLoading} />
          <UserDashboardHeader />
          <div
            id="forAsnHideShow"
            className={this.state.showHistory ? "none" : "row mt-2 block"}
          >
             {this.props.doctype=="STO"
             ? <div className="row mt-1">
                      <label className="col-sm-2 mt-55">OutBound Delivery Number</label>
                      <div className="col-sm-2 mt-55">        
                       <input type="number"  id="POSearch"  className="form-control"  name="outboundDeliveryNo" value={this.state.outboundDeliveryNo}
                      // onInput={ (e) => {commonHandleChange(e,this,"this.state.outboundDeliveryNo");}}
                       onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "outboundDeliveryNo"
                        );
                      }}  />
                     </div>
                      <div className="col-sm-3 mt-55">
                          <button type="button" className={"btn btn-primary"} onClick={this.outbounddeliverySearch.bind(this)}> Search </button>
                         
                      </div>
                   
                  </div>:""}
            <FormWithConstraints
              ref={(formWithConstraints) =>
                (this.asnFormDet = formWithConstraints)
              }
              onSubmit={this.onSubmit}
            >
              <div className="card mt-100" style={{ padding: " 10px" }}>
              {/* {this.props.doctype=="STO"
             ? <div className="row mt-1">
                      <label className="col-sm-2 mt-55">OutBound Delivery Number</label>
                      <div className="col-sm-2 mt-55">        
                       <input type="number"  id="POSearch"  className="form-control"  name="outboundDeliveryNo" value={this.state.outboundDeliveryNo} onInput={ (e) => {commonHandleChange(e,this,"this.state.outboundDeliveryNo");}}  onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "outboundDeliveryNo"
                        );
                      }}  />
                     </div>
                      <div className="col-sm-3 mt-55">
                          <button type="button" className={"btn btn-primary"} onClick={this.outbounddeliverySearch.bind(this)}> Search </button>
                         
                      </div>
                   
                  </div>:""} */}

                <div className="row mt-2"></div>

                <div className="col-sm-12 text-center mt-2 ">
                  <label style={{ fontSize: "20px", color: "black" }}>
                    INVOICE DETAILS
                  </label>
                </div>
                <div className="row mt-1"></div>
                <div className="row">
                  <label className="col-sm-2">ASN Number</label>
                  <div className="col-sm-2 ">
                    <label style={{ color: "black" }}>
                      {STOASNFetchDetails.asnNumber}
                    </label>
                  </div>
                </div>
                <div className="row mt-1"></div>
                <div className="row">
                  <label className="col-sm-2">Invoice Number</label>
                  <div className="col-sm-2 ">
                    <input
                      type="text"
                      className="form-control"
                      name="invoiceNo"
                      value={STOASNFetchDetails.invoiceNo}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.invoiceNo"
                        );
                      }}
                    />
                  </div>
                  <div className="col-sm-4 ">
                    <input type="hidden" className="form-control" />
                  </div>

                  <label className="col-sm-2">Invoice Date</label>
                  <div className="col-sm-2 ">
                    <input
                      type="date"
                      className="form-control"
                      name="invoiceDate"
                      value={formatDateWithoutTimeNewDate(STOASNFetchDetails.invoiceDate)}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.invoiceDate"
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-1">
                  <label className="col-sm-2">Transporter Name</label>
                  <div className="col-sm-2 ">
                    <input
                      type="text"
                      className="form-control"
                      name="transporterNo"
                      value={STOASNFetchDetails.transporterNo}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.transporterNo"
                        );
                      }}
                    />
                  </div>
                  <label className="col-sm-2">LR No.</label>
                  <div className="col-sm-2 ">
                    <input
                      type="text"
                      className="form-control"
                      name="lrNumber"
                      value={STOASNFetchDetails.lrNumber}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.lrNumber"
                        );
                      }}
                    />
                  </div>

                  <label className="col-sm-2">LR Date</label>
                  <div className="col-sm-2 ">
                    <input type="date" className="form-control" name="lrDate" value={formatDateWithoutTimeNewDate(STOASNFetchDetails.lrDate)} 
                     onChange={(e) => {
                      commonHandleChange(
                        e,
                        this,
                        "STOASNFetchDetails.lrDate"
                      );
                    }} />
                  </div>
                </div>
                <div className="row mt-1">
                  <label className="col-sm-2">Vehicle No</label>
                  <div className="col-sm-2 ">
                    <input
                      type="text"
                      className="form-control"
                      name="vehicalNo"
                      value={STOASNFetchDetails.vehicalNo}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.vehicalNo"
                        );
                      }}
                    />
                  </div>
                  <label className="col-sm-2">No of Packages</label>
                  <div className="col-sm-2 ">
                    <input
                      type="number"
                      className="form-control"
                      name="numberOfPackages"
                      value={STOASNFetchDetails.numberOfPackages}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.numberOfPackages"
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-1">
                  <label className="col-sm-2">Gross Weight</label>
                  <div className="col-sm-2 ">
                    <input
                      type="number"
                      className="form-control"
                      name="grossWeight"
                      value={STOASNFetchDetails.grossWeight}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.grossWeight"
                        );
                      }}
                    />
                  </div>
                  <label className="col-sm-2">Tare Weight</label>
                  <div className="col-sm-2">
                    <input
                      type="number"
                      className="form-control"
                      name="tareWeight"
                      value={STOASNFetchDetails.tareWeight}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.tareWeight"
                        );
                      }}
                    />
                  </div>
                  <label className="col-sm-2">Net Weight</label>
                  <div className="col-sm-2">
                    <input
                      type="number"
                      className="form-control"
                      name="netWeight"
                      value={STOASNFetchDetails.netWeight}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.netWeight"
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-1">
                  <label className="col-sm-2">
                    Plant <span className="redspan">*</span>
                  </label>
                  <div className="col-sm-2">
                    <select
                      className="form-control"
                      name="plant"
                      required={true}
                      value={STOASNFetchDetails.plant}
                      // onChange={(e) => {
                      //   commonHandleChange(
                      //     e,
                      //     this,
                      //     "STOASNFetchDetails.plant"
                      //   );
                      // }}
                    >
                      <option value="">Select</option>
                      {this.state.plantDropDownList.map((item) => (
                        <option value={item.value}>{item.display}</option>
                      ))}
                    </select>
                    <FieldFeedbacks for="plant">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                  </div>
                </div>

                <div className="row mt-1"></div>
                <div className="col-sm-12 text-center mt-2 ">
                  <label style={{ fontSize: "20px" }}>DRIVER DETAILS</label>
                </div>
                <div className="row mt-1"></div>
                <div class="row  mt-1">
                  <label class="col-sm-2">Name of Driver</label>
                  <div class="col-sm-2">
                    <input
                      type="text"
                      name="nameOfDriver"
                      class="form-control"
                      value={STOASNFetchDetails.nameOfDriver}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.nameOfDriver"
                        );
                      }}
                    />
                  </div>
                  <label class="col-sm-2">Mobile Number</label>
                  <div class="col-sm-2">
                    <input
                      type="text"
                      name="mobileNumber"
                      class="form-control"
                      value={STOASNFetchDetails.mobileNumber}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.mobileNumber"
                        );
                      }}
                    />
                  </div>
                  <label class="col-sm-2">Photo ID Proof</label>
                  <div class="col-sm-2">
                    <input
                      type="text"
                      name="photoIdProof"
                      class="form-control"
                      value={STOASNFetchDetails.photoIdProof}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "STOASNFetchDetails.photoIdProof"
                        );
                      }}
                    />
                  </div>
                 {/* {plant!=undefined?
                  <td className="col-1">
                                        <input
                                          type="hidden"
                                          className={"form-control"}
                                          name="plant"
                                          value={plant.plant}
                                         
                                         
                                        />
                                      </td>     :""} */}
                                      <input
                                          type="hidden"
                                          className={"form-control"}
                                          name="doctyp"
                                          value={this.props.doctype}
                                         
                                         
                                        />

<input
                                          type="hidden"
                                          className={"form-control"}
                                          name="deliveryNoteNo"
                                          value={this.state.outboundDeliveryNo}
                                         
                                         
                                        />

                </div>
              </div>

              <div className="boxContent " style={{ display: "none" }}>

              <div className="row">
                           {/* <label className="col-sm-1" >PO Number</label> */}
                           {/* <input type="hidden" value="" name="po[purchaseOrderNumber]" /> */}
                           {/* <label className="col-sm-2" >{this.state.asnDetails.po.purchaseOrderNumber}</label> */}
                           {/* <input type="hidden" value="" name="po[purchaseOrderId]" />
                           <input type="hidden" value="" name="po[documentType]" /> */}

                           {/* <label className="col-sm-2" >Vendor</label>
                           <label className="col-sm-2" >{this.state.po.vendorName}</label>
                           <label className="col-sm-2" >Version</label>
                           <label className="col-sm-2" >{this.state.po.versionNumber}</label> */}
                        </div>
                {/* <input type="hidden" name={"asnLineList[" + 0 + "][advanceShipmentNoticeLineId]"} value={securityPOHeaderDto.asnLine.asnLineId} disabled={isEmpty(securityPOHeaderDto.asnLine.asnLineId)} /> */}
                {/* <input type="hidden" name={"asnLineList[" + 0 + "][deliveryQuantity]"} value={securityPOHeaderDto.deliveryQuantity}/> */}
                {/*                                            
                                             <input type="hidden" name={"asnLineList[" + 0 + "][lineItemNo]"} value={securityPOHeaderDto.lineItemNo}/>
                                             <input type="hidden" name={"asnLineList[" + 0 + "][name]"} value={securityPOHeaderDto.name}/>
                                             <input type="hidden" name={"asnLineList[" + 0 + "][uom]"} value={securityPOHeaderDto.uom}/>
                                             <input type="hidden" name={"asnLineList[" + 0 + "][rate]"} value={securityPOHeaderDto.rate}/> */}

                {/* <input type="hidden" name={"asnLineList[" + 0 + "][poLine][code]"} value={this.state.asnLineDetails.materialCode} />
                     <input type="hidden" name={"asnLineList[" + 0 + "][poLine][name]"} value={this.state.asnLineDetails.materialName} /> */}
                {/* <input type="hidden" name={"asnLineList[" + 0 + "][plant]"}  value={securityPOHeaderDto.plant} /> */}
                {/* <input type="hidden" name={"asnLineList[" + 0 + "][deliveryQuantity]"} value={asnLine.deliveryQuantity} /> */}

                {/* <div className={this.state.showHistory?"none ":"block"}> */}

                {/* <input type="hidden" disabled={isEmpty(this.state.asnDetails.asnId)} name="advanceShipmentNoticeId" value={this.state.asnDetails.asnId} />
                        <input type="hidden" name="status" value={this.state.asnDetails.status} />
                        <input type="hidden" name="postingDate" value={this.state.asnDetails.postingDate} />
                        <input type="hidden" disabled={this.state.psTypeFlag} name="po[pstyp]" value="9" /> */}
                {/* <div className="row">
                           <label className="col-sm-1" >PO Number</label>
                           <input type="hidden" value={this.state.po.purchaseOrderNumber} name="po[purchaseOrderNumber]" />
                           <label className="col-sm-2" >{this.state.po.purchaseOrderNumber}</label>
                           <input type="hidden" value={this.state.po.poId} name="po[purchaseOrderId]" />
                           <input type="hidden" value={this.state.po.documentType} name="po[documentType]" />

                           <label className="col-sm-2" >Vendor</label>
                           <label className="col-sm-2" >{this.state.po.vendorName}</label>
                           <label className="col-sm-2" >Version</label>
                           <label className="col-sm-2" >{this.state.po.versionNumber}</label>
                        </div> */}
                {/* <div className="row mt-1">              
                        <label className="col-sm-1" >PO Date</label>
                        <label className="col-sm-2" >{this.state.po.poDate}</label> 
                        <label className="col-sm-2" >Inco Terms</label>
                        <label className="col-sm-2" >{this.state.po.incomeTerms}</label>
                        <label className="col-sm-2" >Status</label>
                        <label className="col-sm-2" >{this.state.po.status}</label>
                     </div>   */}
              </div>
              <div className={"boxContent"}>
                <div style={{ display: displayAsnLine }}>
                  <div className="row">
                    <div className="col-sm-3">
                      {/* {!['CLOSED', 'BOOKED', 'CANCELED'].includes(this.state.asnDetails.status) && <button style={{ display: this.state.cancelAsnButton }} className={"btn btn-primary"} type="button" onClick={(e)=>{this.onComfirmationOfCancelAsn(e)}}>Cancel ASN</button> } */}
                      {/*   { <button className={this.state.asnDetails.status=="CLOSED" || this.state.asnDetails.status=="BOOKED" || this.state.asnDetails.status=="CANCELED"?"none":"btn btn-primary mx-1 my-2 block"} type="button" onClick={e => this.onComfirmationOfCancelAsn(e)}>Cancel ASN</button>} */}
                    </div>
                    {this.state.openStorageLocationModal && (
                      <div
                        className="modal roleModal"
                        id="locationModal show"
                        style={{ display: "block" }}
                      >
                        <div className="modal-dialog modal-md mt-100">
                          <div className="modal-content">
                            <div className="modal-header">
                              Select storage location
                              <button
                                type="button"
                                className={"close " + this.props.readonly}
                                onClickCapture={this.closeStorageLocationModal}
                              >
                                &times;
                              </button>
                            </div>
                            <div
                              className={"modal-body " + this.props.readonly}
                            >
                              <div className="lineItemDiv min-height-0px">
                                <div className="row mt-1 px-4 py-1">
                                  <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                                    <label>Quantity</label>
                                  </div>
                                  <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                    <label>Storage location</label>
                                  </div>
                                  <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                                    {/* <input type="checkbox" value={this.state.isSameLocation}   onChange={this.state.isSameLocation =! this.state.isSameLocation} ref="complete"/>
                              <input type="checkbox" checked={this.state.isSameLocation}  onChange={()=>{this.setState({ isSameLocation: !this.state.isSameLocation}, this.isSameLocation ? '': this.setState({selectedLocation:undefined}))}}   ref="complete"/>
                                 <label>Same</label> */}
                                  </div>
                                  <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                    <label>Action</label>
                                  </div>
                                </div>
                                <div className="row mt-1 px-4 py-1 max-h-500px">
                                  {!isEmpty(
                                    this.state.selectedStorageLocationListItem
                                  ) &&
                                    !isEmpty(
                                      this.state.selectedStorageLocationListItem
                                        .asnLineCostCenter
                                    ) &&
                                    this.state.selectedStorageLocationListItem.asnLineCostCenter.map(
                                      (item, index) => {
                                        return (
                                          <div className="row" key={index}>
                                            <div className="col-5">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter quantity"
                                                defaultValue={item.quantity}
                                                onChange={this.onStorageLocationChange.bind(
                                                  this,
                                                  index,
                                                  "quantity"
                                                )}
                                              />
                                            </div>

                                            <div className="col-6">
                                              {/*
                                   line 1440 input
                                    value={item.quantity=this.state.itemQuantity}
                                             <select className="form-control" 
                                                value={item.storageLocation}
                                                onChange={this.onStorageLocationChange.bind(this,index,'storageLocation')}
                                             >
                                                <option value="">Select</option>
                                                {/* {(this.state.storageLocationList).map(strLoc =>
                                                   <option value={strLoc.value}>{strLoc.value+"-"+strLoc.display}</option>
                                                )} */}

                                              {/* { <option value={this.getStorageLocation(this.state.asnDetails.asnId)}>{this.getStorageLocation(this.state.asnDetails.asnId)}</option>
                                                      } }
                                             </select>
                                                   </div>

                                                   */}

                                              <select
                                                className="form-control"
                                                value={
                                                  /*this.state.selectedLocation*/ item.storageLocation
                                                }
                                                onChange={this.onStorageLocationChange.bind(
                                                  this,
                                                  index,
                                                  "storageLocation"
                                                )}
                                              >
                                                <option value="">Select</option>
                                                {/* {(Object.entries(this.state.locationList)).forEach(([key, val]) =>{
                                                                 
                                                                 <option value='1111'>{222}</option>
                                                                // console.log("-----"+val);
                                                            })}  */}
                                                {Object.entries(
                                                  this.state.locationList
                                                ).map((strLoc) => (
                                                  <option value={strLoc[0]}>
                                                    {strLoc[0] +
                                                      "-" +
                                                      strLoc[1]}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            <div className="col-1">
                                              <button
                                                className={
                                                  "btn " +
                                                  (index === 0
                                                    ? "btn-outline-success"
                                                    : "btn-outline-danger")
                                                }
                                                onClick={
                                                  index == 0
                                                    ? this.addNewStorageLocation
                                                    : this.onRemoveStorageLocation.bind(
                                                        this,
                                                        index
                                                      )
                                                }
                                                type="button"
                                              >
                                                <i
                                                  class={
                                                    "fa " +
                                                    (index === 0
                                                      ? "fa-plus"
                                                      : "fa-minus")
                                                  }
                                                  aria-hidden="true"
                                                ></i>
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className={"modal-footer"}>
                              <button
                                className={"btn btn-success"}
                                onClick={this.onStorageLocationUpdate}
                                type="button"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-sm-6"></div>
                    {/* <div className="col-sm-3">
                                 <input type="text" id="SearchTableDataInputThree" className="form-control" onKeyUp={searchTableDataThree} placeholder="Search .." />
                              </div> */}
                    <div className="w-100 mt-2">
                      <div className="col-sm-12">
                        <div className="table-responsive mt-2">
                          <table className="table table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th className="col-1">Line No.</th>
                                <th
                                //   className={
                                //     (this.state.grn ||
                                //       this.state.asnDetails.status === "GRN") &&
                                //     !this.state.qc
                                //       ? "col-3"
                                //       : this.state.qc
                                //       ? "col-6"
                                //       : "col-7"
                                //   }
                                >
                                  Material Description
                                </th>

                                <th className="col-1"> Qty </th>
                                {/* <th className="col-1">Bal Qty</th> */}
                                <th className="col-1"> UOM </th>
                                <th className="col-1"> Rate </th>
                          
                              </tr>
                            </thead>
                            <tbody id="DataTableBodyThree">
                              {stoasnlinelist.map((item, i) => {
                                return (
                                  <>
                                    <tr class="accordion-toggle">
                                      <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          //name="lineItemNo"
                                         // value={item.lineItemNumber}
                                         value={item.lineItemNo}
                                          name={
                                            "asnLineList[" + i + "][lineItemNo]"
                                          }
                                          onChange={(event) => {
                                            commonHandleChange(
                                              event,
                                              this,
                                              "securityPOHeaderDto.asnLineList." +
                                                i +
                                                ".lineItemNo"
                                            );
                                          }}
                                          //  onChange={(event) => {
                                          //    commonHandleChange(event, this, "securityPOHeaderDto.lineItemNo","");
                                          //  }}
                                        />
                                      </td>
                                      <td className="col-1">
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          name={"asnLineList[" + i + "][name]"}
                                          value={item.name}
                                          onChange={(event) => {
                                            commonHandleChange(
                                              event,
                                              this,
                                              "securityPOHeaderDto.asnLineList." +
                                                i +
                                                ".name"
                                            );
                                          }}

                                          // onChange={(event) => {
                                          //   commonHandleChange(event, this, "securityPOHeaderDto.name","");
                                          // }}
                                        />
                                      </td>

                                      <td className="col-1">
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          //name="deliveryQuantity"
                                        //  value={item.poQuantity}
                                        value={item.deliveryQuantity}
                                          name={
                                            "asnLineList[" +
                                            i +
                                            "][deliveryQuantity]"
                                          }
                                          onChange={(event) => {
                                            commonHandleChange(
                                              event,
                                              this,
                                              "securityPOHeaderDto.asnLineList." +
                                                i +
                                                ".deliveryQuantity"
                                            );
                                          }}
                                          //  onChange={(event) => {
                                          //    if (event.target.value.length < 60) {
                                          //    commonHandleChange(event, this, "securityPOHeaderDto.deliveryQuantity","");
                                          //    }
                                          //  }}
                                        />
                                      </td>

                                      <td className="col-1">
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.uom}
                                          onChange={(event) => {
                                            commonHandleChange(
                                              event,
                                              this,
                                              "securityPOHeaderDto.asnLineList." +
                                                i +
                                                ".uom"
                                            );
                                          }}
                                          name={"asnLineList[" + i + "][uom]"}
                                          // onChange={(event) => {
                                          //    if (event.target.value.length < 60) {
                                          //    commonHandleChange(event, this, "securityPOHeaderDto.uom","");
                                          //    }
                                          //  }}
                                        />
                                      </td>
                                      <td className="col-1">
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          name={"asnLineList[" + i + "][rate]"}
                                          value={item.rate}
                                          onChange={(event) => {
                                            commonHandleChange(
                                              event,
                                              this,
                                              "securityPOHeaderDto.asnLineList." +
                                                i +
                                                ".rate"
                                            );
                                          }}
                                          // onChange={(event) => {
                                          //    if (event.target.value.length < 60) {
                                          //    commonHandleChange(event, this, "securityPOHeaderDto.rate","");
                                          //    }
                                          //  }}
                                        />
                                      </td>    

                                                                   
                                    </tr>
                                  </>
                                );
                              })}

                              {/* </>
                                ) })} */}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-sm-12 text-center mt-2 ">
                          {this.props.asnStatus!="REPORTED" || this.props.asnStatus!="GATE_OUT"?
                          <button
                            type="submit"
                            className="btn btn-primary mr-1 "
                            id="report"
                            onClick={this.handleClick}
                          >
                            Report
                          </button>:""
                          }
                          {this.props.asnStatus==="REPORTED"?
                          (this.props.asnList.map((asn, index) =>
                          index === this.props.asnList.length - 1 ?<button
                          type="button"
                          className="btn btn-success mr-1 "
                          id="gateIn"
                          onClick={(e) => {
                            commonSubmitWithParam(
                              this.props,
                              "securityASNSubmit",
                              "/rest/getInSecurityStatusUpdate",
                              asn.advanceShipmentNoticeId
                            );
                            document.getElementById(
                              "gateIn"
                            ).style.display = "none";
                            this.handleSearch();
                          }}
                        >
                          Gate IN
                        </button>:"" )):""}
                           {/* {this.props.asnList.map((asn, index) =>}
                            index === this.props.asnList.length - 1 ? (
                              <button
                                type="button"
                                className="btn btn-success mr-1 "
                                id="gateIn"
                                onClick={(e) => {
                                  commonSubmitWithParam(
                                    this.props,
                                    "securityASNSubmit",
                                    "/rest/getInSecurityStatusUpdate",
                                    this.state.asnDetails.advanceShipmentNoticeId
                                  );
                                  document.getElementById(
                                    "gateIn"
                                  ).style.display = "none";
                                  this.handleSearch();
                                }}
                              >
                                Gate IN
                              </button>
                                :""} 
                                 : (
                              ""
                            )
                          )}  */}

                          {this.props.asnStatus==="GATE_IN"?

                          this.props.asnList.map((asn, index) =>
                            index === this.props.asnList.length - 1 ? (
                              // <div
                              //   className={
                              //     asn.status === "GATE_IN" &&
                              //     this.state.role === "SECADM"
                              //       ? "col-sm-12 text-center mt-2 "
                              //       : "none"
                              //   }
                              // >
                                <button
                                  type="button"
                                  // className={((asn.status=="GATE_IN" ) || (this.state.role==="SECADM"))?"btn btn-primary ml-1 mr-3 my-2 inline-block":"none"}
                                  className={"btn btn-primary mr-1 "}
                                  id="gateout"
                                  onClick={(e) => {
                                    
                                    commonSubmitWithParam(
                                      this.props,
                                      "gateOutResponse",
                                      "/rest/asnGateOut",
                                      asn.advanceShipmentNoticeId
                                    );
                                    document.getElementById(
                                      "gateout"
                                    ).style.display = "none";
                                    this.handleSearch();
                                  }}
                                >
                                  Gate Out
                                </button>
                              // </div>
                            ) : (
                              ""
                            )
                          ):""}

                          <button
                            type="button"
                            className="btn btn-success mr-1 "
                            id="gateIn"
                            data-toggle="modal"
                            data-target="#getReportModal"
                          >
                            Print
                          </button>

                          {/* <a className={this.props.role!== "VENADM" ? "btn btn-primary mr-1" : "none"} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></a> */}
                          {/* <button className="btn btn-primary" type="button" onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden});}}><i className="fa fa-arrow-left" aria-hidden="true"></i></button> */}

                          {/* {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                                    <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.33:44300/sap/bc/yweb03_ws_23?sap-client=110&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK`}
                                     target="_blank">Print Form</a>

                                    //  <a  className="btn btn-success mr-1"  id="print" href={`https://172.18.2.28:44300/sap/bc/yweb03_ws_23?sap-client=100&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}`}
                                    //  target="_blank">Print Form</a>
                                    :"")

)}    */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal gateEntryModal" id="getReportModal">
                <div class="modal-dialog modal-dialog-centered modal-md">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title">Driver Details</h4>
                      <button type="button" class="close" data-dismiss="modal">
                        &times;
                      </button>
                    </div>
                    {/* <div class={"modal-body "} >
                           
                                <div class="row my-2">
                                    <div class="col-sm-4"></div>
                                    <div class="col-sm-8">
                                    {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                                    <a  className="btn btn-success mr-2"  id="print" href={`https://172.18.2.33:44300/sap/bc/yweb03_ws_23?sap-client=110&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK`}
                                     target="_blank">TRUCK</a>

                                    :"")

)}   
                 {
                          this.props.asnList.map((asn, index) => 
                          (index === this.props.asnList.length-1?
                                    <a  className="btn btn-warning mr-2"  id="print" href={`https://172.18.2.33:44300/sap/bc/yweb03_ws_23?sap-client=110&PO=${this.props.po.purchaseOrderNumber}&ASNNO=${asn.advanceShipmentNoticeNo}&VEHICLE=TRUCK`}
                                     target="_blank">TANKER</a>

                                    :"")

)}   
                                      
                                    </div>
                                </div>
                           
                        </div> */}
                  </div>
                </div>
              </div>
            </FormWithConstraints>
          </div>
        </React.Fragment>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.STOASN;
};
export default connect(mapStateToProps, actionCreators)(STOASN);
