import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import {
    commonHandleFileUpload,
    commonSubmitForm,
    commonHandleChange,
    commonSubmitWithParam,
    commonHandleChangeCheckBox,
    validateForm,
    resetForm,
    swalWithTextBox
  } from "../../../Util/ActionUtil";
  import { isEmpty } from "../../../Util/validationUtil";
  import * as actionCreators from "./Action/Action";
  import { connect } from "react-redux";

class QCFReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            qcfLineArray:[],
            tempProps:{
                qcfLineList:[
                    {
                        vendor: 40025,
                        lineItem: 50,
                        material:780397,
                        shortText:"M10X25 STUD FT WTH TWO NUT & TWO WASHERS",
                        rate:209.00,
                        freight:0,
                        gst:37.62,
                        grossAmt:246.62,
                        cost:209.00,
                        totBasicAmt:12540.00,
                        totGrossAmt:14797.20,
                        totCost:12540.00,
                        propsedQty:0,
                        splittedBasicAmt:0,
                        splittedGrossAmt:0,
                        splittedCost:0,
                    }
                ]
            }
        };
    }

    componentDidMount(){
        // this.setQcfLine(this.state.tempProps);
        commonSubmitWithParam(this.props,"getQCF","/rest/getQCF",4000003771);
        
    }

    componentWillReceiveProps = props =>{
        if(!isEmpty(props.qcfLineList)){
            this.setQcfLine(props);
        }
    }

    setQcfLine = props =>{
        let qcfLineList=[];
        props.qcfLineList.map((qcfLine)=>{
            qcfLineList.push(this.getQcfLineByObj(qcfLine))
        });
        this.setState({
            qcfLineArray:qcfLineList
        });
    }

    getQcfLineByObj = (qcfObj) =>{
        return {
            vendor: qcfObj.vendor,
            lineItem: qcfObj.lineItem,
            material:qcfObj.material,
            shortText:qcfObj.shortText,
            rate:qcfObj.rate,
            freight:qcfObj.freight,
            gst:qcfObj.gst,
            grossAmt:qcfObj.grossAmt,
            cost:qcfObj.cost,
            totBasicAmt:qcfObj.totBasicAmt,
            totGrossAmt:qcfObj.totGrossAmt,
            totCost:qcfObj.totCost,
            propsedQty:qcfObj.proposedQty,
            splittedBasicAmt:qcfObj.splittedBasicAmt,
            splittedGrossAmt:qcfObj.splittedGrossAmt,
            splittedCost:qcfObj.splittedCost,
        }
    }

    render(){
        var height = 450;
        return(
            <>
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-sm-9"></div>
                            <div className="col-sm-3">
                                <input
                                type="text"
                                id="SearchTableDataInput"
                                className="form-control"
                                onKeyUp={searchTableData}
                                placeholder="Search .."
                                />
                            </div>
                            <div className="col-sm-12 mt-2">
                                <div class="table-proposed">
                                    <StickyHeader height={height} className="table-responsive w-max-content">
                                        <table id="tableData" className="my-table">
                                            <thead>
                                                <tr>
                                                    <th>Vendor</th>
                                                    <th>Line Item</th>
                                                    <th>Material</th>
                                                    <th>Short text</th>
                                                    <th>Rate</th>
                                                    <th>Freight</th>
                                                    <th>GST</th>
                                                    <th>Gross</th>
                                                    <th>Cost</th>
                                                    <th>Tot. Basic</th>
                                                    <th>Tot. Gross</th>
                                                    <th>Tot. Cost</th>
                                                    <th>Propsed Qty</th>
                                                    <th>Split Basic</th>
                                                    <th>Split Gross</th>
                                                    <th>Split Cost</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {this.state.qcfLineArray.map((records,index)=>
                                                    <tr>
                                                        <td>{records.vendor}</td>
                                                        <td>{records.lineItem}</td>
                                                        <td>{records.material}</td>
                                                        <td>{records.shortText}</td>
                                                        <td>{records.rate}</td>
                                                        <td>{records.freight}</td>
                                                        <td>{records.gst}</td>
                                                        <td>{records.gross}</td>
                                                        <td>{records.cost}</td>
                                                        <td>{records.totBasicAmt}</td>
                                                        <td>{records.totGrossAmt}</td>
                                                        <td>{records.totCost}</td>
                                                        <td>{records.proposedQty}</td>
                                                        <td>{records.splittedBasicAmt}</td>
                                                        <td>{records.splittedGrossAmt}</td>
                                                        <td>{records.splittedCost}</td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                    </StickyHeader>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="w-100 justify-content-center table-proposed d-flex">
                                    <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.props.loadContainer()}><i className="fa fa-arrow-left" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return state.qcfReportReducer;
  };
  export default connect(mapStateToProps, actionCreators)(QCFReport);
