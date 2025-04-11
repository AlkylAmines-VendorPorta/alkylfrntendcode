import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import { cloneTableWidth } from "../../../Helpers/GlobalFunctions";
import {
    commonHandleFileUpload,
    commonSubmitForm,
    commonHandleChange,
    commonSubmitWithParam,
    commonHandleChangeCheckBox,
    validateForm,
    resetForm,
} from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import {findIndex, indexOf, minBy} from 'lodash-es';

class QCFSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            i:"",
            loadTableData:false,
            bidderList:[],
            priceBidList:[],
            prLineList:[]
        };
    }

    componentDidMount(){
        this.setState({
            loadTableData:true
        })
    }
    
    componentWillReceiveProps=async props=>{
        if(this.state.loadTableData && !isEmpty(props.priceBidList) && !isEmpty(props.bidderList) && !isEmpty(props.prLineList)){
            this.setState({
                i:props.bidderList.length,
                bidderList:props.bidderList,
                priceBidList:props.priceBidList,
                prLineList:props.prLineList
            })
        }

    }
    generateFirstRowHeader = () =>{
        let columns=[];
        for(var i=0;i<this.state.i;i++)
        {
          columns.push(<><th>{this.state.bidderList[i].partner.bPartnerId}<span class="display_block">{this.state.bidderList[i].partner.vendorSapCode}{!isEmpty(this.state.bidderList[i].partner.vendorSapCode)?" - ":""}{this.state.bidderList[i].partner.name}</span></th></>);
        }
        return columns;
      }

    generateBodyRow = (el) => {

        let columns = [],added="";

        for (var i = 0; i < this.state.i; i++) {
            added="";
            this.state.priceBidList.map((priceBid)=>{

                if(this.validateBidder(this.state.bidderList[i],priceBid,el.prLineId)){
                    added=true;
                    columns.push(<td>{this.getLandedCost(priceBid)}</td>);
                    
                }

            })
            
            if(!added){
                columns.push(<td>0</td>);
            }

        }
        return columns;
    }
    
    generateBasicTotal = () => {
        let columns = [];
        let min=indexOf(minBy(this.state.bidderList,"basicAmt"));
        for (var i = 0; i < this.state.i; i++) {
            columns.push(<th>{this.state.bidderList[i].basicAmt}</th>);
        }
        return columns;
    }

    generateGrossValue = () => {
        let columns = [];
        for (var i = 0; i < this.state.i; i++) {
            columns.push(<th>{this.state.bidderList[i].grossAmt}</th>);
        }
        return columns;
    }

    generateLandedCost = () => {
        let columns = [];
        for (var i = 0; i < this.state.i; i++) {
            columns.push(<th>5,09,489.00</th>);
        }
        return columns;
    }

    getLandedCost=(priceBid)=>{
        return priceBid.exGroupPriceRate;
    }
  
    validateBidder=(bidder,priceBid,prLineId)=>{
      if(bidder.partner.bPartnerId===priceBid.itemBid.bidder.partner && prLineId===priceBid.itemBid.prLine.prLineId){
        return true;
      }
      return false;
    }

    render() {
        return (
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
                                    <StickyHeader height={420} className="table-responsive w-max-content">
                                        <table id="tableData" className="my-table table-qcf qcf-summary text-center">
                                            <thead>
                                                <tr>
                                                    
                                                    <th rowSpan="3">Serial No</th>
                                                    <th>Line Item</th>
                                                    <th>Material</th>
                                                    <th>Short Text</th>
                                                    <th>Required Qty</th>
                                                    {this.generateFirstRowHeader()}
                                                </tr>
                                            </thead>
                                            <tbody id="DataTableBody">
                                            {this.state.prLineList.map((el,i)=>(
                                                <tr>
                                                    <td>{i+1}</td>
                                                    <td>{el.prLineNumber}</td>
                                                    <td>{el.materialCode}</td>
                                                    <td>{el.materialDesc}</td>
                                                    <td>{el.quantity}</td>
                                                    {this.generateBodyRow(el)}
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="text-right border_top_1 border_left_1 border_right_1 resultant_data">
                                                    <th colSpan="4">Basic Value</th>
                                                    {this.generateBasicTotal()}
                                                </tr>
                                                <tr className="text-right border_left_1 border_right_1 resultant_data">
                                                    <th colSpan="4">Gross Value</th>
                                                    {this.generateGrossValue()}
                                                </tr>
                                                <tr className="text-right border_left_1 border_right_1 border_bottom_1 resultant_data">
                                                    <th colSpan="4">Landed Cost</th>
                                                    {this.generateLandedCost()}
                                                </tr>
                                            </tfoot>
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
    return state.qcfSummary;
  };
export default connect(mapStateToProps, actionCreators)(QCFSummary);
