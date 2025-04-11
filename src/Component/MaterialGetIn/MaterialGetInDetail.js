import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import PRList from "../PRScreen/PRList/PRList";
import Enquiry from "../PRScreen/Enquiry/Enquiry";
import VendorSelection from "../PRScreen/VendorSelection/VendorSelection";
import swal from 'sweetalert';
import { API_BASE_URL } from "../../Constants";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  commonSubmitFormNoValidationWithData,
  commonHandleReverseChangeCheckBox,
  commonSetState,
  validateForm,
  resetForm,
  swalWithTextBox,
  swalWithTextBoxDynamicMessage
} from "../../Util/ActionUtil";
import { isEmpty, isEmptyDeep } from "../../Util/validationUtil";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { getUserDto, getFileAttachmentDto } from "../../Util/CommonUtil";
import { formatDateWithoutTime } from "../../Util/DateUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN, ROLE_REQUISTIONER_ADMIN, ROLE_PURCHASE_MANAGER_ADMIN, ROLE_BUYER_ADMIN, ROLE_PARTNER_ADMIN } from "../../Constants/UrlConstants";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { Button } from "@material-ui/core";

class materialGetInDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gateEntryDto: {
        gateEntryId: "",
        reqNo: "",
        vendorName: "",
        vendorAddress: "",
        poNo: "",
        remark: "",
        status: "",
        docType: "",
        rejectDesc: "",
        hodRejectDesc: "",
        commRejectDesc: "",
        docNo:0,
        gateInId:0,
        materialGateInList:[
          {
            gateInListId: "",
            rejectQty: "",
            acceptQty: "",
            gateEntryLine: {
              gateEntryLineId: ""
            }
          }
        ],
        materialLine: [
          {
            gateEntryLine:{
              gateEntryLineId:""
            },
            gateEntryLineId:"",
            serialNo:1,
            materialCode:"",
            materialDesc:"",
            materialQty:0,
            materialRate:0,
            materialCost:0,
            repairingCost:0,
            gateEntry:{
              gateEntryId:""
            }
          }
        ]
      },
      url:""
    };
  }

  handleSubmit = () => {
    console.log("handleSubmit--",this.state.gateEntryDto);
    let val = this.state.gateEntryDto;
    const mgil = this.state.gateEntryDto.materialLine.map(e =>{
      return {
                gateInListId: e.gateInListId,
                rejectQty: e.rejectQty,
                acceptQty: e.acceptQty,
                gateEntryLine: {
                  gateEntryLineId:e.gateEntryLine.gateEntryLineId,
                }
              }
    })

    let requestData ={
        gateInId: val.gateInId,
        materialGateInList: mgil
      }
    
    commonSubmitFormNoValidationWithData(requestData, this, "materialGetInSubmit", "/rest/materialCheck");
  }
  
  handleClose = () => {
    let val = this.state.gateEntryDto;
    const mgil = this.state.gateEntryDto.materialLine.map(e =>{
      return {
                gateInListId: e.gateInListId,
                rejectQty: e.rejectQty,
                acceptQty: e.acceptQty,
                gateEntryLine: {
                  gateEntryLineId:e.gateEntryLine.gateEntryLineId,
                }
              }
    })

    let requestData ={
        gateInId: val.gateInId,
        materialGateInList: mgil
      }
    
    // console.log("handleClose--",this.state.gateEntryDto);
    commonSubmitFormNoValidationWithData(requestData, this, "materialGetInSubmit", "/rest/closeMaterialGateIn");
  }

  updateStatus = (url) => {
    commonSubmitWithParam(this.props,"updateStatus","/rest/"+url, this.state.gateEntryDto.gateEntryId); 
  }

  // updateStatusRemark = (url,remark) => {
  //   commonSubmitWithParam(this.props,"updateStatus","/rest/"+url,this.state.gateEntryDto.gateEntryId, remark);
  // }
  handleRedirect = () => {
    window.location.reload();
   };
  updateStatusRemark=(e, url)=>{
    this.props.changeLoaderState(true);
    this.setState({url:url})
    swalWithTextBoxDynamicMessage(e,this,"updateStatusRemarkReason","Enter remark for Reject");
  }

  updateStatusRemarkReason=(remark)=>{
      this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"updateStatus","/rest/"+this.state.url, this.state.gateEntryDto.gateEntryId, remark);
  }

  getEmptyGateEntryLineObj=(serialSize)=>{
    return {
      gateEntryLineId:"",
      serialNo:serialSize+1,
      materialCode:"",
      materialDesc:"",
      materialQty:"",
      materialRate:"",
      materialCost:"",
      repairingCost:"",
      gateEntry:{
        gateEntryId:""
      }
    }
  }
 
//   addGateEntry() {
//     let gateEntryDto = this.state.gateEntryDto;
//     let gateEntryLineList = gateEntryDto.gateEntryLineList;
//     let gateEntryLineArray = [
//     this.getEmptyGateEntryLineObj(gateEntryLineList.length)
//     ];
//     gateEntryLineList = gateEntryLineList.concat(gateEntryLineArray);
//     gateEntryDto.gateEntryLineList = gateEntryLineList
//     this.setState({ gateEntryDto: gateEntryDto });
// }

// removeGateEntry(i) {
//     let gateEntryDto = this.state.gateEntryDto;
//     let gateEntryLineList = gateEntryDto.gateEntryLineList;
//     gateEntryLineList.splice(i, 1);
//     gateEntryDto.gateEntryLineList = gateEntryLineList
//     this.setState({ gateEntryDto: gateEntryDto });
// }

UNSAFE_componentWillReceiveProps=props=>{
 
  console.log("props unsafe",props);

  // if(!isEmpty(props.gateEntryLineDto) && !isEmpty(props.gateEntryLineDto[0])){
  if(!isEmpty(props.gateEntryLineDto) && !isEmpty(props.gateEntryLineDto[0])){
    // debugger
    // let gateEntryDto = props.gateEntryList[0].gateEntry;
    // debugger
    let gateEntryDto = props.gateEntryCurrentDto.gateEntry;

    gateEntryDto={
      ...gateEntryDto,
      status:props.gateEntryCurrentDto.status,
      materialLine:[],
      materialGateInList:[],
    }
    gateEntryDto.materialLine = props.gateEntryLineDto;
    gateEntryDto.materialGateInList = props.gateEntryLineDto;
    this.setState({gateEntryDto:gateEntryDto});

    let dn = props.gateEntryLineDto&&props.gateEntryLineDto[0].materialGateIn.docNo;
    // console.log("props undsafee -->>",props);
    let gid = props.gateEntryLineDto[0].materialGateIn.gateInId;
    this.setState({...gateEntryDto.docNo=dn});
    this.setState({...gateEntryDto.gateInId=gid});

  }
}

  render() {
    const gateEntryDto = this.state.gateEntryDto;
    const materialLine = this.state.gateEntryDto.materialLine;
    console.log("gateEntryDto",gateEntryDto);
    // console.log("material linee",materialLine);
    // console.log("props in get in details",this.props);

    return (
      <>
        <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
          <FormWithConstraints ref={formWithConstraints => this.prForm = formWithConstraints}>
            <div>
              <div className="card my-2">
                <div className="row mt-0 px-4 pt-1">

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Req No</label>
                    <span className="display_block">
                      {gateEntryDto.reqNo}
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Vendor Name</label>
                    <span className="display_block">
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={gateEntryDto.vendorName}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorName");
                        }}
                      />
                    </span>
                  </div>

                  <div className="col-12 col-md-4 col-lg-4">
                    <label className="mr-4 label_12px">Vendor Address</label>
                    <span className="display_block">
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={gateEntryDto.vendorAddress}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}
                      />
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">PO Number</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={gateEntryDto.poNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.poNo");
                      }}
                    />
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Remark</label>
                    <input
                      type="text"
                      disabled
                      className="form-control"
                      value={gateEntryDto.remark}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.remark");
                      }}
                    />
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Status</label>
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Doc No.</label>
                    <span className="display_block">
                      {gateEntryDto.docNo}
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2 mb-2">
                    <label className="mr-4 label_12px">Doc Type</label>
                    <select className="form-control" 
                      value={gateEntryDto.docType}
                      disabled
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.docType");
                      }}
                    >
                      <option value="">Select</option>
                      <option value="NRGP">NRGP</option>
                      <option value="RGP">RGP</option>
                    </select>
                  </div>
                  {gateEntryDto.status.includes("REJECTED")?
                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Reject Reason</label>
                    <span className="display_block">
                      {"HOD REJECTED"===gateEntryDto.status?gateEntryDto.hodRejectDesc:"FH REJECTED"===gateEntryDto.status?gateEntryDto.rejectDesc:gateEntryDto.commRejectDesc}
                    </span>
                  </div>:null}


                </div>
              </div>
              <div className="card my-2">
                <div className="lineItemDiv min-height-0px">
                  <div className="row px-4 py-2">
                    <div className="col-sm-9"></div>
                    {/* <div className="col-sm-3">
                      <input
                        type="text"
                        id="SearchTableDataInputTwo"
                        className="form-control"
                        onKeyUp={searchTableDataTwo}
                        placeholder="Search .."
                      />
                    </div> */}
                    <div className="col-sm-12 mt-2">
                      <div>
                        <StickyHeader height={250} className="table-responsive">
                          <table className="my-table">
                            <thead>
                              <tr>
                                {/* <th>#</th> */}
                                <th className="w-6per"> Serial </th>
                                <th className="w-4per"> Material Code</th>
                                {/* <th className="w-4per"> Material Description</th> */}
                                <th className="text-right w-7per"> Material. Qty </th>
                                <th className="text-right w-7per"> Material. Rate </th>
                                <th className="text-right w-8per">Material Cost</th>
                                <th className="text-right w-8per">Repairing Cost</th>
                                <th className="text-right w-8per">Gate In Qty</th>
                                <th className="text-right w-8per">Received Qty</th>
                                <th className="text-right w-8per">Balance Qty</th>
                                {/* <th className="text-right w-8per">Accept Qty</th>
                                <th className="text-right w-8per">Reject Qty</th> */}
                              </tr>
                            </thead>
                            <tbody id="DataTableBodyTwo">
                              {materialLine.map((item, i) => {
                                console.log("itemm-",item);
                                return (
                                  <>
                                    <tr class="accordion-toggle" >
                                      {/* <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th> */}
                                      <td>
                                      <label className="mr-4 label_12px">{item.gateEntryLine.serialNo}</label>
                                        {/* <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.serialNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".serialNo");
                                          }}
                                        /> */}
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.gateEntryLine.materialCode}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialCode");
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.gateEntryLine.materialDesc}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialDesc");
                                          }}
                                        />
                                      </td> */}
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateEntryLine.materialQty}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialQty");
                                            commonSetState(this,"gateEntryDto.materialLine." + i + ".materialCost",item.materialQty*item.materialRate)
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateEntryLine.materialRate}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialRate");
                                            commonSetState(this,"gateEntryDto.materialLine." + i + ".materialCost",item.materialQty*item.materialRate)
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.materialCost}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialCost");
                                          }}
                                        />
                                      </td> */}
                                      <td>
                                      <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateEntryLine.materialCost}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".materialCost");
                                          }}
                                        />
                                        {/* <label className="mr-4 label_12px">{item.gateEntryLine.materialCost}</label> */}
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateEntryLine.repairingCost}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".repairingCost");
                                          }}
                                        />
                                      </td>

                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateInQty}
                                          disabled
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".gateInQty");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.acceptQty}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".acceptQty");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.rejectQty}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.materialLine." + i + ".rejectQty");
                                          }}
                                        />
                                      </td>

                                      {/* <td>
                                    
                                        <button
                                          className={
                                            "btn " +
                                            (i === 0
                                              ? "btdangern-outline-success"
                                              : "btn-outline-")
                                          }
                                          onClick={() => {
                                            i === 0
                                              ? this.addGateEntry()
                                              : this.removeGateEntry(i);
                                          }}
                                          type="button"
                                        >
                                          <i
                                            class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                            aria-hidden="true"
                                          ></i>
                                        </button> 
                                      </td> */}
                                    </tr>
                                  </>
                                )
                              })
                              }
                            </tbody>
                          </table>
                        </StickyHeader>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row px-4 py-0 mb-2" >
                <div className="col-12">
                  <div className="d-flex justify-content-center">
                     {/* {isEmpty(gateEntryDto.status) || ["MATERIAL GATE IN"].includes(gateEntryDto.status) ? */}
                  {["CANCELED"].includes(gateEntryDto.status)?"": isEmpty(gateEntryDto.status) || ["MATERIAL GATE IN"].includes(gateEntryDto.status) ?
                      <button type="button" onClick={this.handleSubmit} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Security Check</button>
                       :null} 
                        
                    {isEmpty(gateEntryDto.status) || ["Material Checked"].includes(gateEntryDto.status) ?
                       
                     <button type="button" onClick={this.handleClose} className="btn btn-sm btn-outline-danger mr-2">&nbsp;Close</button>
                    :null
                    }
                    <Button variant="contained" size="small" className="" color="primary" type="button" onClick={this.handleRedirect}>Back</Button> 
                   </div>
                </div>
              </div>
              </div>
              
            </div>
          </FormWithConstraints>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  // return state.gateEntryRgpReducer;
  return state.materialGetInReducer;
  
};
export default connect(mapStateToProps, actionCreators)(materialGetInDetail);