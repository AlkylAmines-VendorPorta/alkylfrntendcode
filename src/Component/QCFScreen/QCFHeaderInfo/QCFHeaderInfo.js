import React, { Component } from "react";
import { isEmpty } from "../../../Util/validationUtil";
import {formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
class QCFHeaderInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
        return(
            <div className="card my-2">
                <div className="row px-4 py-2">
                    <div className="col-12 d-flex justify-content-between">
                        <div class="row m-0 p-0 text-left">
                            <small class="col-5 col-sm-2 col-lg-2 px-0">QCF No.:</small>
                            <small class="col-7 col-sm-10 col-lg-10 px-0">{this.props.pr.qcfNo}</small>
                            <small class="col-5 col-sm-2 col-lg-2 px-0">Enq No.:</small>
                            <small class="col-7 col-sm-10 col-lg-10 px-0">{this.props.pr.enquiryId}</small>
                            <small class="col-5 col-sm-2 col-lg-2 px-0">Enq Status: </small>
                            <small class="col-7 col-sm-10 col-lg-10 px-0">{this.props.pr.status ? this.props.pr.status:this.props.pr.code}</small>
                            <small class="col-5 col-sm-2 col-lg-2 px-0">Buyer/Code:</small>
                            <small class="col-7 col-sm-10 col-lg-10 px-0">{this.props.pr.createdBy?.userName+"-"+this.props.pr.createdBy?.name}</small>
                        </div>
                        <div class="row m-0 p-0 text-right">
                            <small class="col-12 col-sm-12 col-lg-12">Quotation Comparision Form</small>
                            <small class="col-6 col-sm-10 col-lg-10 px-0">DOC. NO.:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0">FORM/PUR/V/04</small>
                            <small class="col-6 col-sm-10 col-lg-10 px-0">ISSUE NO:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0"> 03 Date: 01.01.2022</small>
                            {/* <small class="col-6 col-sm-2 col-lg-2 px-0"> {formatDateWithoutTimeNewDate2(this.props.pr.date)}</small> */}
                            <small class="col-6 col-sm-10 col-lg-10 px-0">REV NO:</small>
                            <small class="col-6 col-sm-2 col-lg-2 px-0">00 Date: 01.01.2022</small>
                            {/* <small class="col-6 col-sm-2 col-lg-2 px-0">00 DT 01.01.2017</small> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default QCFHeaderInfo;