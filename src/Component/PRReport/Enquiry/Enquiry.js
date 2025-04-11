import React, { Component } from "react";
import MaterialTable from "../MaterialTable/MaterialTable";
// import StickyHeader from "react-sticky-table-thead";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import { isEmpty } from "lodash-es";
import {
    commonHandleFileUpload,
    commonSubmitForm,
    commonHandleChange,
    commonSubmitWithParam,
    commonHandleChangeCheckBox,
    commonSubmitFormNoValidation,
    commonHandleReverseChangeCheckBox,
    commonSetState,
    validateForm,
    resetForm,
    swalWithTextBox
} from "../../../Util/ActionUtil";
import { changeIndex } from "../../../Util/CommonUtil";
class Enquiry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prLine: [],
            loadOnce:false,
            lineIndex:""
        }
    }
    
    render(){
        return(
            <>
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <MaterialTable prLineArray={this.props.prLineArray}/>
                        {/* <div className="row px-4 py-2">
                            <div className="col-sm-12 mt-2">
                                <div>
                                    <StickyHeader height={430} className="table-responsive">
                                        <table className="my-table">
                                            <thead>
                                                <tr>
                                                    <th>Ch</th>
                                                    <th className="w-6per"> Line No.</th>
                                                    <th className="w-4per"> A</th>
                                                    <th className="w-4per"> I</th>
                                                    <th className="w-40per"> Material Description </th>
                                                    <th className="text-right w-7per"> Req. Qty </th>
                                                    <th> UOM </th>
                                                    <th className="text-right w-8per">Val. Price</th>
                                                    <th className="w-10per">Plant</th>
                                                    <th className="w-10per"> Delivery Date </th>
                                                    <th className="w-10per"> Required Date </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.prLine.map((prLine, i) =>
                                                    <>
                                                        <tr>
                                                            <th>
                                                                <input type="checkbox"
                                                                    value="Y" 
                                                                    checked={prLine.isChecked} 
                                                                    onChange={(e) => {
                                                                    commonHandleChangeCheckBox(e, this, "prLine."+i+".isChecked");
                                                                    this.changeIndex(e,i);
                                                                }}
                                                                    className="display_block" 
                                                                />
                                                            </th>
                                                            <td>{prLine.lineNumber}</td>
                                                            <td>{prLine.a}</td>
                                                            <td>{prLine.i}</td>
                                                            <td>{prLine.materialDesc}</td>
                                                            <td className="text-right">{prLine.reqQty}</td>
                                                            <td>{prLine.uom}</td>
                                                            <td className="text-right">{prLine.price}</td>
                                                            <td>{prLine.plant}</td>
                                                            <td>{prLine.deliverDate}</td>
                                                            <td>{prLine.requiredDate}</td>
                                                            {this.getHiddenFields(prLine,i)}
                                                        </tr>
                                                    </>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                    </StickyHeader>
                                </div>
                            </div>
                        </div>
                     */}
                    </div>
                    <div className="row px-4 py-0">
                        <div className="col-3">
                            <div className="d-flex justify-content-left">
                                <>
                                    
                                </>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button
                                    className="btn btn-sm btn-outline-info mr-2"
                                    type="button"
                                    onClick={this.props.showPrDetails}
                                >
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                </button>
                                {/* <button
                                    className="btn btn-sm btn-primary"
                                    type="button"
                                    onClick={this.props.loadPRMainContainer}
                                >
                                    <i className="fa fa-arrow-left" aria-hidden="true">&nbsp;Back to PR List</i>
                                </button> */}
                                <button type="button" onClick={this.props.loadVendorSelection} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-user"/>&nbsp;Select Vendor</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps=(state)=>{
    return state.prEnquiryReducer;
  };
  export default connect(mapStateToProps,actionCreators)(Enquiry);