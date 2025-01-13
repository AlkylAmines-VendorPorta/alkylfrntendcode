import React, { Component } from "react";

import { isEmpty } from "../../Util/validationUtil";
import { commonHandleChange, commonSubmitForm } from "../../Util/ActionUtil";
import { getDecimalUpto,getCommaSeperatedValue, removeLeedingZeros } from "../../Util/CommonUtil";
import { getServiceLineList } from "../AdvanceShipmentNotice/AdvanceShipmentNotice/Action";
import { FormWithConstraints } from "react-form-with-constraints";
import * as actionCreators from "./Action";
import {connect} from 'react-redux';
import moment from 'moment'
import PDFViewerComponent from "../MiroScreen/PDFViewerComponent";
import "material-icons/iconfont/material-icons.css";

class MiroBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isService: "Y",
      invoice:"",
      data: "data:application/pdf;base64,",
      poNumber:"",
      documentType:"",
      asnDetails:{
        
        asnId:"",
        asnNumber:"",
        po : "",
        plant:"",
        invoiceNo:"",
        invoiceDate:"",
        invoiceAmount:"",
        loadingCharges : "",
        mismatchAmount:"",
        deliveryNoteNo:"",
        deliveryNoteDate:"",
        lrDate:"",
        lrNumber:"",
        transporterNo:"",
        vehicalNo:"",
        eWayBillNo:"",
        grossWeight:"",
        tareWeight:"",
        numberOfPackages:"",
        isCOA:"",
        isPackingList:"",
        typeOfPackingBulk:"",
        remarks:"",
        basicAmount:"",
        freightCharges:"",
        packingCharges:"",
        sgst:"",
        cgst:"",
        igst:"",
        roundOffAmount:'',
        roundOffValue:'',
        invoiceDoc:{
           attachmentId : "",
           fileName : ""
        },
        deliveryNoteDoc:{
           attachmentId : "",
           fileName : ""
        },
        nameOfDriver : "",
        mobileNumber : "",
        photoIdProof : "",
        status : "",
        irn : "",
        invoiceApplicable:true,
        withHoldingTax : ""
      },
      asnLineArray:[],
      glMasterListNew:[],
      withHoldingTaxListNew:[]
    };
  }

  componentWillReceiveProps(props){
    // if(!isEmpty(props.miroResponseStatus)){
    //   this.props.changeLoaderState(false);
    // }
    if(!isEmpty(props.glMasterList)){
      let glMasterArray = Object.keys(props.glMasterList).map((key) => {
        return { display: props.glMasterList[key], value: key }
      });
      this.props.changeLoaderState(false);
    this.setState({
      glMasterListNew:glMasterArray
    })
    }else{
      this.props.changeLoaderState(false);
    }

    if(!isEmpty(props.withHoldingTaxList)){
      let withHoldingTaxList = Object.keys(props.withHoldingTaxList).map((key) => {
        return { display: props.withHoldingTaxList[key].name, value: key }
      });
      this.props.changeLoaderState(false);
    this.setState({
      withHoldingTaxListNew:withHoldingTaxList,
    })
    }else{
      this.props.changeLoaderState(false);
    }

    if(!isEmpty(props.asnDetails)){
      this.props.changeLoaderState(false);
      let invoiceDate = moment(new Date()).format('YYYY-MM-DD');
      if(props.asnDetails && props.asnDetails.invoiceDate){
        invoiceDate = moment(props.asnDetails.invoiceDate).format('YYYY-MM-DD');
        // invoiceDate = invoiceDate.toISOString();
      }
      this.setState({
        asnDetails:{...props.asnDetails,invoiceDate},    isService: props.asnDetails.po.isServicePO?"Y":"N",
        poNumber:props.asnDetails.po.purchaseOrderNumber,
        documentType:props.asnDetails.po.documentType
      })
    }else{
      this.props.changeLoaderState(false);
    }
    if(!isEmpty(props.asnLines)){
      this.props.changeLoaderState(false);
      this.setState({
        asnLineArray:props.asnLines
      })
    }else{
      this.props.changeLoaderState(false);
    }

    if(!isEmpty(props.invoice)&&isEmpty(this.state.invoice)){
      this.props.changeLoaderState(false);
      this.setState({
        invoice:props.invoice
      })
    }else{
      this.props.changeLoaderState(false);
    }
  }

  handleWHTChange = (e) => {
    commonHandleChange(e,this,"asnDetails.withHoldingTax");
    this.calculateTDS(e.target.value);
    
  }
  calculateTDS=(value)=>{
    if(isEmpty(value)){
      let asn=this.state.asnDetails;
      let baseAmount = asn.baseAmount;
      asn.tds =0;
      asn.payableAmount = this.state.asnDetails.invoiceAmount-asn.tds;
      this.setState({
        asnDetails:asn
      })
      
    }else{
    let wht = this.props.withHoldingTaxList[value];
    let whtpc = wht.description.split("_");
    let asn=this.state.asnDetails;
    let baseAmount = asn.baseAmount;
    asn.tds = (baseAmount*Number(whtpc[1]))/100;
    asn.payableAmount = this.state.asnDetails.invoiceAmount-asn.tds;
    this.setState({
      asnDetails:asn
    })
  }
  }

  calculateGrossAmount=()=>{
    let asn = this.state.asnDetails;
       let invoiceAmount = Number(asn.basicAmount) + Number(asn.cgst) + Number(asn.sgst) + Number(asn.igst) + Number(asn.tcs)
                            + Number(asn.freightCharges) + Number(asn.packingCharges) + Number(asn.loadingCharges);
       asn.invoiceAmount = Math.round(invoiceAmount);
       this.setState({
          asnDetails : asn
       })
 }

  render() {
    let invoiceDate = this.state.asnDetails.invoiceDate;

    return (
      <>
        <div className="container-fluid mt-100 w-100">
          <div className="card" id="togglesidebar">
            
            <div className="row px-4 py-2">
              <div className="col-lg-12 col-sm-12">
                <div className="row">
                  <div className="col-lg-5 col-md-6 col-12">
                    <div
                      className="card p-2 rounded-0"
                      style={{ background: "#fbff005e", height: "420px" }}
                    >
                      <input type="hidden" value={this.state.asnDetails.asnId} />
                      <input type="hidden" disabled={this.state.isService === "Y" ? false : true}
                        value="9" />
                      <input type="hidden" disabled={this.state.isService === "Y" ? true : false}
                        value={this.state.poNumber} />
                      <input type="hidden" disabled={this.state.isService === "Y" ? true : false}
                        value={this.state.documentType} />
                      <table className="table-miro-invoice">
                        <tbody>
                          <tr className="row">
                            <th className="col-2">Inv. No.</th>
                            <td className="col-4">
                              {/* {this.state.asnDetails.invoiceNo} */}
                              <input placeholder="Inv. no" value={this.state.asnDetails.invoiceNo}
                                onChange={(e) => commonHandleChange(e, this, "asnDetails.invoiceNo")} />
                              </td>
                            <th className="col-2">Inv. Date</th>
                            <td className="col-4">
                              {/* {this.state.asnDetails.invoiceDate} */}
                              <input type="date" placeholder="yyyy-mm-dd" value={invoiceDate}
                                onChange={(e) => commonHandleChange(e, this, "asnDetails.invoiceDate")} />
                            </td>
                          </tr>
                          <tr className="row">
                            <th className="col-3" colspan="2">
                              Vendor
                          </th>
                            <td className="col-6">
                              {this.state.asnDetails.po.vendorName}
                            </td>
                          </tr>
                          <tr className="row">
                            <th className="col-3" >
                              Posting Date
                          </th>
                            <td className="col-3">
                              <input type="date" value={this.state.asnDetails.postingDate}
                                onChange={(e) => commonHandleChange(e, this, "asnDetails.postingDate")} />
                            </td>
                          </tr>

                          <tr className="row">
                            <td
                              className="col-12"
                              colspan="4"
                              style={{ height: "50px" }}
                            ></td>
                          </tr>
                          {this.state.isService === "Y" ? (
                            <>

                              <tr className="row">
                                <th className="col-4" colspan="2">
                                  Base Amt. For TDS
                              </th>
                                <td className="col-8" colspan="2">
                                  <input value={this.state.asnDetails.baseAmount} onChange={(e) => { commonHandleChange(e, this, "asnDetails.baseAmount"); this.calculateTDS(this.state.asnDetails.withHoldingTax) }} />
                                </td>
                              </tr>
                              <tr className="row">
                                <td className="col-4" colspan="2">
                                  Withholding tax :
                              </td>
                                <td className="col-8" colspan="2">
                                  <select name="withHoldingTax" value={this.state.asnDetails.withHoldingTax}
                                    onChange={(e) => this.handleWHTChange(e)}><option value="">Select</option>
                                    {(this.state.withHoldingTaxListNew).map(wht =>
                                      <option value={wht.value}>{wht.display}</option>
                                    )}</select>
                                </td>
                              </tr>
                              <tr className="row">
                                <th className="col-4" colspan="2">
                                  Remarks
                              </th>
                                <td className="col-8" colspan="2">
                                  <textarea rows={3} value={this.state.asnDetails.miroDescription} onChange={(e) => { {
                                    if(e.target.value.length > 50) return null;
                                    commonHandleChange(e, this, "asnDetails.miroDescription");
                                  } }} />
                                </td>
                              </tr>
                              <tr className="row">
                                <td
                                  className="col-12"
                                  colspan="4"
                                  style={{ height: "50px" }}
                                ></td>
                              </tr>
                            </>
                          ) : (
                              <>
                                <tr className="row"><th></th><td></td></tr>
                                <tr className="row"><th></th><td></td></tr>
                                <tr className="row"><th></th><td></td></tr>
                              </>
                            )}
                        </tbody>
                        <tbody className="bottom_data_table">
                          <tr className="row">
                            <th className="col-9" colspan="2">
                              Basic Amt.
                          </th>
                            <td className="col-3 text-right" colspan="2">
                              {getCommaSeperatedValue(this.state.asnDetails.basicAmount)}
                            </td>
                          </tr>
                          <tr className="row">
                            <th className="col-9" colspan="2">
                              Other Charges & Taxes
                          </th>
                            <td className="col-3 text-right" colspan="2">
                              {getCommaSeperatedValue(this.state.asnDetails.invoiceAmount - this.state.asnDetails.basicAmount)}
                            </td>
                          </tr>
                        
                          {/* <tr className="row">
                          <th className="col-9" colspan="2">
                            Taxes
                          </th>
                          <td className="col-3" colspan="2">
                            3500.00&nbsp;
                          </td>
                        </tr>
                        <tr className="row">
                          <th className="col-9" colspan="2">
                            CGST
                          </th>
                          <td className="col-3" colspan="2">
                            1750.00
                          </td>
                        </tr>
                        <tr className="row">
                          <th className="col-9" colspan="2">
                            SGST
                          </th>
                          <td className="col-3" colspan="2">
                            1750.00
                          </td>
                        </tr>
                        <tr className="row">
                          <th className="col-9" colspan="2">
                            IGST
                          </th>
                          <td className="col-3" colspan="2">
                            0.00
                          </td>
                        </tr> */}
                          <tr className="row">
                            <th className="col-9" colspan="2">
                              Gross Amt.
                          </th>
                            <td className="col-3 font_weight_600 text-right" colspan="2">
                              {getCommaSeperatedValue(this.state.asnDetails.invoiceAmount)}
                            </td>
                          </tr>

                          <tr className="row">
                            <th className="col-9" colspan="2">
                              Round Off Amount
                          </th>
                            <td className="col-3 text-right" colspan="2">
                              {getCommaSeperatedValue(this.state.asnDetails.roundOffAmount)}
                            </td>
                          </tr>
                          {/* <tr className="row">
                            <th className="col-9" colspan="2">
                              Round Off Value
                          </th>
                            <td className="col-3 text-right" colspan="2">
                              {getCommaSeperatedValue(this.state.asnDetails.roundOffValue)}
                            </td>
                          </tr> */}

                          {this.state.isService === "Y" ? (
                            <>
                              <tr className="row">
                                <th className="col-9" colspan="2">
                                  Less:-TDS
                              </th>
                                <td className="col-3 text-right" colspan="2">
                                  <input type="hidden" value={this.state.asnDetails.tds} />
                                -{this.state.asnDetails.tds}
                                </td>
                              </tr>
                              <tr className="row">
                                <th className="col-9" colspan="2">
                                  Payable to Vendor
                              </th>
                                <td className="col-3 font_weight_600 text-right" colspan="2">
                                  <input type="hidden" value={this.state.asnDetails.payableAmount} />
                                  {this.state.asnDetails.payableAmount}
                                </td>
                              </tr>
                            </>
                          ) : (
                              <>
                                <tr className="row"><th></th><td></td></tr>
                                <tr className="row"><th></th><td></td></tr>
                              </>
                            )}
                          <tr className="row" style={{ "padding-left": "15px" }}>
                            <button type="button" data-toggle="modal" className="btn btn-primary btn-sm" data-target="#GetConditionModal">Condition And Taxes</button>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="col-lg-7 col-md-6 col-12 p-0"
                    style={{ border: "1px solid black", height: "420px" }}
                  >{!isEmpty(this.state.invoice) ?
                    <PDFViewerComponent invoice={this.state.invoice} /> : <></>}
                    <div>

                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-4 col-sm-4">

                        </div> */}
            </div>

            <div className="row mt-2 px-2 ">
              <FormWithConstraints className="w-100" onSubmit={(e)=>{this.props.changeLoaderState(true); commonSubmitForm(e,this,"miroResponse","/rest/proceedBillBooking")}}>
              <div className="col-lg-12 col-sm-12">
                <div>
                  <table className="table table-hovered table-striped">
                    <thead style={{ background: "#a1d4ff" }}>
                      <tr>
                            <th>Line No.</th>
                            <th>{this.state.isService === "Y" ? 'Service':'Material'} Code</th>
                            <th>Descr</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            {this.state.isService === "Y" ?
                              <><th>GL</th>
                             </>:
                            <>
                            <th>Accepted Qty</th>
                            <th>Rejected Qty</th>
                            <th>Shortage Qty</th>
                            <th>D/N Amt</th></>}
                      </tr>
                    </thead>
                    <tbody>
                          {this.state.asnLineArray.map((asnLine,index)=><tr>
                          <td>{asnLine.asnLineNumber}</td>
                            <td>{removeLeedingZeros(asnLine.materialCode)}</td>
                            <td>{asnLine.materialName}</td>
                            <td>{asnLine.deliveryQuantity}</td>
                            <td>{asnLine.poRate}</td>
                            <td>{asnLine.poRate*asnLine.deliveryQuantity}</td>
                            {this.state.isService === "Y" ?
                              <><td>
                                <input type="hidden" name={"asnLineList["+index+"][poLine][purchaseOrderLineId]"} 
                                 value={asnLine.poLineId}/>
                                 
                                <select className={"form-control"} name={"asnLineList["+index+"][poLine][glno]"} 
                                    value={asnLine.glno} onChange={(e)=>{commonHandleChange(e,this,"asnLineArray."+index+".glno")}}>
                                <option value="">Select</option>
                              {(this.state.glMasterListNew).map(glMaster =>
                                <option value={glMaster.value}>{glMaster.display}</option>
                              )}</select></td>
                              <td></td></>:
                            <>
                            <td>{asnLine.confirmQuantity}</td>
                            <td>{asnLine.rejectedQuantity}</td>
                            <td>{asnLine.shortageQuantity}</td>
                            <td></td></>}
                          </tr>
                          )}
                    </tbody>
                    <tfoot>
                      {this.state.isService === "Y" ? (
                        <></>
                      ) : (
                        <>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Amount Tot.</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>D/N Amt Tot.</th>
                          </tr>
                        </>
                      )}
                    </tfoot>
                  </table>
                </div>
              </div>
                <div className="col-lg-12 col-sm-12">
                <button type="submit">Book Bill</button>
                </div>
                <input type="hidden" name={"advanceShipmentNoticeId"} value={this.state.asnDetails.asnId} />
                <input type="hidden" name="po[pstyp]" disabled={this.state.isService === "Y" ? false : true} value="9" />
                <input type="hidden" name="po[purchaseOrderNumber]" disabled={this.state.isService === "Y" ? true : false} value={this.state.poNumber} />
                <input type="hidden" name="po[documentType]" disabled={this.state.isService === "Y" ? true : false} value={this.state.documentType} />
                <input type="hidden" value={this.state.asnDetails.postingDate} name="issueDate" />
                <input type="hidden" value={this.state.asnDetails.invoiceDate} name="invoiceDate" />
                <input type="hidden" value={this.state.asnDetails.invoiceNo} name="invoiceNo" />
                <input type="hidden" value={this.state.asnDetails.baseAmount} name="baseAmount" />
                <input type="hidden" name="tds" value={this.state.asnDetails.tds} />
                <input type="hidden" name="payable" value={this.state.asnDetails.payableAmount} />
                <input type="hidden" name="withHoldingTax" value={this.state.asnDetails.withHoldingTax} />
              </FormWithConstraints>
            </div>
            {/* <img src={this.state.data+this.state.base64}/> */}
          </div>
        </div>

        <div className="modal" id="GetConditionModal" >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Condition And Taxes</h4>
          <button type="button" className="close" data-dismiss="modal">&times;</button>
        </div>
        <div className="modal-body">
        <form>                 
          <div className="row">
             <div className="col-sm-7">
             <div className="row">
                     <label className="col-sm-6 mt-1">Freight Amount </label>
                        <div className={"col-sm-6 mt-1 readonly"} >
                        <input type="text" className="form-control"   value={getDecimalUpto(this.state.asnDetails.freightCharges,2)}
                        disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.freightCharges");this.calculateGrossAmount()}} />
                     </div>
                      <label className="col-sm-6 mt-1">Packing/ Forwarding </label>
                      <div className={"col-sm-6 mt-1 readonly"} >
                        <input type="text" className="form-control"    value={getDecimalUpto(this.state.asnDetails.packingCharges,2)}
                        disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.packingCharges");this.calculateGrossAmount()}} />
                     </div>
                     <label className="col-sm-6 mt-1">Loading/ Unloading </label>
                     <div className={"col-sm-6 mt-1 readonly"} >
                        <input type="text" className="form-control"    value={getDecimalUpto(this.state.asnDetails.loadingCharges,2)}
                        disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.loadingCharges");this.calculateGrossAmount()}} />
                     </div>
                     </div>
                     </div>
                     <div className="col-sm-5">
                     <div className="row">
                     <label className="col-sm-4 mt-1">SGST </label>
                     <div className={"col-sm-8 mt-1 readonly"} >
                        <input type="text" className="form-control"    value={getDecimalUpto(this.state.asnDetails.sgst,2)}  
                         disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.sgst");this.calculateGrossAmount()}} />
                     </div>                          
                        <label className="col-sm-4 mt-1">CGST </label>
                        <div className={"col-sm-8 mt-1 readonly"} >
                        <input type="text" className="form-control"   value={getDecimalUpto(this.state.asnDetails.cgst,2)}  
                         disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.cgst");this.calculateGrossAmount()}} />
                     </div>
                     <label className="col-sm-4 mt-1">IGST </label>
                     <div className={"col-sm-8 mt-1 readonly"} >
                        <input type="text" className="form-control"   value={getDecimalUpto(this.state.asnDetails.igst,2)}  
                         disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.igst");this.calculateGrossAmount()}} />
                     </div>
                     <label className="col-sm-4 mt-1">TCS </label>
                     <div className={"col-sm-8 mt-1 readonly"} >
                        <input type="text" className="form-control"   value={getDecimalUpto(this.state.asnDetails.tcs,2)}  
                         disabled={!this.state.asnDetails.invoiceApplicable} name="" onChange={(e)=>{commonHandleChange(e,this,"asnDetails.tcs");this.calculateGrossAmount()}} />
                     </div>
                     </div>
                     </div>
                     </div>
         </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" data-dismiss="modal">Ok</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
        
      </div>
    </div>
  </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.miroReducer;
};
export default connect (mapStateToProps,actionCreators)(MiroBody);