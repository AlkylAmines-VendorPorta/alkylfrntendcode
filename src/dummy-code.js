//quotation by vendor before change like database structure


import React, { Component } from "react";
import {
    commonHandleChange,
    commonHandleChangeCheckBox,
    commonSetState,
    commonSubmitForm,
    updateState
} from "../../../Util/ActionUtil";

import {saveQuotation} from "../../../Util/APIUtils";

import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import { formatDateWithoutTime } from "../../../Util/DateUtil";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import { getUserDto } from "../../../Util/CommonUtil";
import {sumBy} from 'lodash-es';

const  chargesTypes = [
    {
        value:"lumpsum",
        display:"Lumpsum"
    },
    {
        value: "percent",
        display: "%"
    },
    {
        value: "perUnit",
        display: "Per Unit"
    },
    {
        value: "atActual",
        display: "At actual"
    }
]
class QuotationByVendor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            otherDocumentsList: [
                {
                    prAttachmentId: "",
                    attachment: {
                        attachmentId: "",
                        fileName: "",
                        text: "",
                        description: ""
                    },
                    pr: {
                        prId: ""
                    },
                    istc: ""
                },
            ],
            loadOtherDocuments: false,
            otherChargesType: [
                {
                    value: "header_level",
                    display: "Header Level"
                },
                {
                    value: "item_level",
                    display: "Item Level"
                }
            ],
            chargesType:chargesTypes,
            qbvArray:{
                prNo:"",
                prDate:"",
                buyer:{
                    userId: "",
                    name: "",
                    empCode:"",
                    email:""
                },
                priority:"",
                otherChargeType:"item_level",
                isTC:true,
                accept:false,
                status:"",
                documents:[],
                otherCharges: 0,
                basicAmount:0,
                taxAmount:0,
                grossAmount:0,
            },
            quotations: []
        }
    }


    initState(quotations,qbvArray){
        // let {quotations,qbvArray} = this.state;

        quotations = quotations.map((item) => {
            let newItem = {
                ...item,
                otherCharges:"",
                otherChargesType:"percent",
                freight:"",
                freightType:"lumpsum",
                packingAndFwd:"",
                packingAndFwdType:"percent",
                taxes:"",
                longText:""
            }
            let qbvLineObj = item.itemBid.prLine
            newItem = {
                ...newItem,
                lineNo: qbvLineObj.lineNumber,
                materialCode:qbvLineObj.materialCode,
                materialDesc: qbvLineObj.materialDesc,
                reqQty: qbvLineObj.quantity,
                uom: qbvLineObj.uom,
                basicAmtForDisplay: this.calculateBasicAmount(qbvLineObj.rate,qbvLineObj.quantity),
                plant: qbvLineObj.plant,
                requiredDate: formatDateWithoutTime(qbvLineObj.requiredDate),
                deliveryDate:formatDateWithoutTime(qbvLineObj.deliverDate),
                rate:qbvLineObj.rate,
                
            }
            let otherChargeForDisplay = qbvArray.otherChargeType == 'item_level' ?  this.calculateOtherChargeForDisplay(newItem):0;
            newItem.otherChargeForDisplay = otherChargeForDisplay;
            let taxesForDisplay = newItem.basicAmtForDisplay * (newItem.rate/100);
            newItem.taxesForDisplay = taxesForDisplay;
            newItem.grossForDisplay = newItem.basicAmtForDisplay + taxesForDisplay + otherChargeForDisplay;
            return newItem;
        })
        let basicAmount = sumBy(quotations,'basicAmtForDisplay');
        let taxAmount = sumBy(quotations,'taxesForDisplay');
        let otherCharges = sumBy(quotations,'otherChargeForDisplay');
        qbvArray = {
            ...this.state.qbvArray,
            ...qbvArray,
            prNo:qbvArray.prNumber,
            prDate:formatDateWithoutTime(qbvArray.date),
            buyer:getUserDto(qbvArray.buyer),
            priority:qbvArray.priority,
            isTC:qbvArray.true,
            accept:false,
            status:qbvArray.status,
            documents:[],
            otherCharges: qbvArray.otherCharge,
            otherChargeType: "item_level",
            // basicAmount:qbvArray.basicAmt,
            // taxAmount:qbvArray.taxAmt,
            // grossAmount:qbvArray.grossAmt,
            basicAmount,
            taxAmount,
            otherCharges,
            grossAmount: Number(basicAmount) + Number(taxAmount) + Number(otherCharges)
        }
       
     
        
        updateState(this,{qbvArray,quotations});
    }

    componentWillReceiveProps = props =>{
     
        if(!isEmpty(props.priceBidList) && !isEmpty(props.prDetails) ){
            this.initState(props.priceBidList,props.prDetails)
            // this.setQbvLine(props);
            // console.log(props.priceBidList)
        }
        // if(!isEmpty(props.prDetails)){
        //     let pr=this.getPRHeadFromObj(props.prDetails);
        //     this.setState({
        //         qbvArray:pr
        //     })
        // }
    }

    setQbvLine=(props)=>{
        let priceBidList = [];
          props.priceBidList.map((qbvLine)=>{
            priceBidList.push(this.getPriceBidDataFromObj(qbvLine));
          });
          this.setState({
            quotations : priceBidList
          });
      }


    getPriceBidDataFromObj = (priceBid) => {
        let qbvPriceBidDto=this.getpriceBidFromObj(priceBid)
        let qbvItemBidDto=this.getitemBidFromObj(priceBid.itemBid)
        return {...qbvItemBidDto,...qbvPriceBidDto,...priceBid}
    }
    getPRHeadFromObj=(prHeadObj)=>{
        return {
            prNo:prHeadObj.prNumber,
            prDate:formatDateWithoutTime(prHeadObj.date),
            buyer:getUserDto(prHeadObj.buyer),
            priority:prHeadObj.priority,
            isTC:prHeadObj.true,
            accept:false,
            status:prHeadObj.status,
            documents:[],
            otherCharges: prHeadObj.otherCharge,
            otherChargeType: "item_level",
            basicAmount:prHeadObj.basicAmt,
            taxAmount:prHeadObj.taxAmt,
            grossAmount:prHeadObj.grossAmt,
        }
    }


    getitemBidFromObj=(itemBid)=>{
        let qbvLineObj=itemBid.prLine
        return {
            lineNo: qbvLineObj.lineNumber,
            materialCode:qbvLineObj.materialCode,
            materialDesc: qbvLineObj.materialDesc,
            reqQty: qbvLineObj.quantity,
            uom: qbvLineObj.uom,
            basicAmtForDisplay: this.calculateBasicAmount(qbvLineObj.rate,qbvLineObj.quantity),
            otherChargeForDisplay:"",
            taxesForDisplay:"",
            grossForDisplay:"",
            plant: qbvLineObj.plant,
            requiredDate: formatDateWithoutTime(qbvLineObj.requiredDate),
            deliveryDate:formatDateWithoutTime(qbvLineObj.deliverDate),
            rate:qbvLineObj.rate,
        }
      }

      getpriceBidFromObj=(priceBid)=>{
        return {
            otherCharges:"",
            otherChargesType:"percent",
            freight:"",
            freightType:"lumpsum",
            packingAndFwd:"",
            packingAndFwdType:"percent",
            taxes:"",
            longText:""
        }
    }


    addOtherDocument() {
        let currOtherDocList = this.state.otherDocumentsList;
        let otherDocumentsArray = [
        this.getEmptyDocObj()
        ];
        otherDocumentsArray = currOtherDocList.concat(otherDocumentsArray);
        this.setState({
        otherDocumentsList: otherDocumentsArray,
        });
    }

    removeOtherDocument(i) {
        let otherDocumentsList = this.state.otherDocumentsList;
        otherDocumentsList.splice(i, 1);
        this.setState({ otherDocumentsList: otherDocumentsList });
    }
    hideEnquiryDiv = () => {
        this.setState({ other_div: true, enquiry_div: false })
    }

    calculateBasicAmount = (rate,quantity) =>{
        return isNaN(rate*quantity)?0:rate*quantity 
    }

    percentWiseCalculation = (basicAmount,value) => {
        return isNaN(basicAmount * value / 100) ? 0: basicAmount * value / 100;
    }

    perUnitCalculation = (quantity,value) => {
        return isNaN(quantity * value) ? 0:quantity * value;
    }

    lumpsumCalculation = (value) => {
        return isNaN(value) ? 0: value;
    }

    calOtherCharge = (row,fvalue,ftype) => {
        let otherCharge = row.basicAmtForDisplay;
        let quantity = row.reqQty;
        let charge = 0;
        let type = row[ftype]
        let value = row[fvalue]
        if(type == 'percent'){
            charge = isNaN(otherCharge * value / 100) ? 0: otherCharge * value / 100;
        }else if(type == 'perUnit'){
            charge = isNaN(quantity * value) ? 0:quantity * value;
        }else if(type == 'lumpsum'){
            charge =  isNaN(value) ? 0: value;
        }
        return Number(charge);
    }

    // changeHeader(event){
    //     let {quotations,qbvArray} = this.state;
    //     let value = event.target.value
    //     qbvArray.otherChargeType = value;
    //     let  basicAmount = sumBy(quotations,'basicAmtForDisplay');
    //     let  taxAmount = sumBy(quotations,'taxesForDisplay');
    //     let otherCharges = sumBy(quotations,'otherChargeForDisplay');
    //     qbvArray = {
    //         ...qbvArray,
    //         otherCharges:value,
    //         basicAmount,
    //         taxAmount,
    //         otherCharges,
    //         grossAmount: Number(basicAmount) + Number(taxAmount) + Number(otherCharges)
    //     }
    //     console.log('changeHeader',value);
    //     quotations = quotations.map((item) => {
    //         let otherChargeForDisplay = value == 'item_level' ?  this.calculateOtherChargeForDisplay(item):0;
    //         item.otherChargeForDisplay = otherChargeForDisplay;
    //         item.grossForDisplay = item.basicAmtForDisplay + item.taxesForDisplay + otherChargeForDisplay;
    //         return item;
    //     })
    //     updateState(this,{qbvArray,quotations});

    // }

    calculateOtherChargeForDisplay(row){
        return this.calOtherCharge(row,'freight','freightType') + this.calOtherCharge(row,'packingAndFwd','packingAndFwdType') + this.calOtherCharge(row,'otherCharges','otherChargesType')
    }

    calculateFrLineItem=(e,i,type)=> {
        let {quotations,qbvArray} = this.state;
        let row = quotations[i];
        let value = e.target.value ? e.target.value:0;
        if(i != null){
            if(type == 'taxes' && value > 100) value = 100;  
            row[type] = value;
            if(type == 'rate'){
                row.basicAmtForDisplay = row.reqQty * value;
            }
            let otherChargeForDisplay = this.calculateOtherChargeForDisplay(row);
            let taxesForDisplay = row.taxesForDisplay ? row.taxesForDisplay:0;
            if(type == 'taxes'){
                taxesForDisplay = row.basicAmtForDisplay * (value/100)
            }
            let grossForDisplay = row.basicAmtForDisplay + otherChargeForDisplay + taxesForDisplay;
            quotations[i] = {
                ...row,
                otherChargeForDisplay,
                taxesForDisplay,
                grossForDisplay
            };
        }

        let  basicAmount = sumBy(quotations,'basicAmtForDisplay');
        let  taxAmount = sumBy(quotations,'taxesForDisplay');
        let otherCharges = sumBy(quotations,'otherChargeForDisplay');
        qbvArray = {
            ...qbvArray,
            otherCharges:value,
            basicAmount,
            taxAmount,
            otherCharges,
            otherChargeType: type == 'otherChargeType' ? value:qbvArray.otherChargeType ,
            grossAmount: basicAmount + taxAmount + otherCharges
        }
        if(type == 'otherChargeType'){
            quotations = quotations.map((item) => {
                let otherChargeForDisplay = value == 'item_level' ?  this.calculateOtherChargeForDisplay(item):0;
                item.otherChargeForDisplay = otherChargeForDisplay;
                item.grossForDisplay = item.basicAmtForDisplay + item.taxesForDisplay + otherChargeForDisplay;
                return item;
            })
        }
        updateState(this,{qbvArray,quotations});

        return ;

        // let a=this.state.quotations[i];
        // console.log("Line Item is",a);
        // let basicAmountTemp=a.basicAmtForDisplay;
        // let quantityTemp=a.reqQty;
        // let otherChargeForDisplayTemp=a.otherChargeForDisplay;
        // let chargesTypeTemp="";
        // if(chargesType==="freight")
        // {
        //     chargesTypeTemp=a.freightType;
        // }
        // else
        // if(chargesType==="PnF")
        // {
        //     chargesTypeTemp=a.packingAndFwdType;
        // }
        // else
        // if(chargesType==="other")
        // {
        //     chargesTypeTemp=a.otherChargesType;
        // }
        // let value = e.target.value ? Number(e.target.value):0;
        
        // if(chargesTypeTemp==="percent")
        // {
        //     otherChargeForDisplayTemp = parseInt(otherChargeForDisplayTemp+this.percentWiseCalculation(basicAmountTemp,value));
        // }
        // else if(chargesTypeTemp==="perUnit")
        // {
        //     otherChargeForDisplayTemp = parseInt(otherChargeForDisplayTemp+this.perUnitCalculation(quantityTemp,value));
        // }
        // else if(chargesTypeTemp==="lumpsum")
        // {
        //     otherChargeForDisplayTemp = parseInt(otherChargeForDisplayTemp+this.lumpsumCalculation(value));
        // }

        // if(chargesType==="freight")
        // {
        //     commonHandleChange(e, this, "quotations."+i+".freight");
        // }
        // else 
        // if(chargesType==="PnF")
        // {
        //     commonHandleChange(e, this, "quotations."+i+".packingAndFwd");
        // }
        // else 
        // if(chargesType==="other")
        // {
        //     commonHandleChange(e, this, "quotations."+i+".otherCharges");
        // }
        
        // commonSetState(this,"quotations."+i+".otherChargeForDisplay",otherChargeForDisplayTemp);
    }

    onSubmitForm = (event) => {
        saveQuotation({
            name:'hello'
        },'/rest/saveQuotation').then(res => {
            // console.log('save res',res)
        }).catch(err => {
            // console.log('err',err)
        })
        event.preventDefault();

    }

    render() {
        var isTcDocSec = this.state.qbvArray.isTC ? "display_block" : "display_none";
        return (
            <>
             <form onSubmit={(e)=>{{this.setState({loadPrChangeStatus:true});commonSubmitForm(e,this,"saveQuotation","/rest/saveQuotation")}}} >
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">PR No.</label>
                                <span className="display_block">
                                    {this.state.qbvArray.prNo}
                                </span>
                            </div>
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">PR Date</label>
                                <span className="display_block">
                                    {this.state.qbvArray.prDate}
                                </span>
                            </div>
                            <div className="col-12 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Buyer</label>
                                <span className="display_block">
                                    {this.state.qbvArray.buyer.name + "(" + this.state.qbvArray.buyer.code +")"}
                                </span>
                            </div>
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">Priority</label>
                                <span className="display_block">
                                    {this.state.qbvArray.priority}
                                </span>
                            </div>
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">Status</label>
                                <span className="display_block">
                                    {this.state.qbvArray.status}
                                </span>
                            </div>
                            <div className="col-6 col-md-2 col-lg-2">
                                <label className="mr-4 label_12px">Other Charges</label>
                                <select className={"form-control " + this.props.readonly} 
                                value={this.state.qbvArray.otherChargeType}
                                onChange={(e) => this.calculateFrLineItem(e,null,'otherChargeType')}
                                // onChange={(event) =>
                                //     commonHandleChange(
                                //     event,
                                //     this,
                                //     "qbvArray.otherCharges"
                                //     )
                                // }
                                >
                                    <option value={""}>Select</option>
                                    {this.state.otherChargesType.map(records =>
                                        <option value={records.value}>{records.display}</option>
                                    )}
                                </select>
                            </div>
                            <div className="col-6 col-md-3 col-lg-3 d-flex justify-content-between">
                                <div>
                                    <label className="mr-4 label_12px">Techno/Comm</label>
                                    <input type="checkbox" name="isTCQuotation" value="Y" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.qbvArray.isTC} 
                                    onChange={(e) => { commonHandleChangeCheckBox(e, this, "qbvArray.isTC") }} 
                                    />
                                </div>
                                <div>
                                    <label className="mr-4 label_12px">Accept</label>
                                    <input type="checkbox" name="accept" value="Y" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.qbvArray.accept} 
                                    onChange={(e) => { commonHandleChangeCheckBox(e, this, "prDetails.accept") }} 
                                    />
                                </div>
                                <div>
                                    <button type="button" className="btn btn-sm btn-outline-primary mr-2 mgt-10"><i className="fa fa-download" />&nbsp;Download</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-1">
                            <div className="col-sm-12 mt-2">
                                <div>
                                    <StickyHeader height={360} className="table-responsive">
                                        <table className="my-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th className="w-6per"> Line No.</th>
                                                    <th className="w-40per"> Material Code & Description </th>
                                                    <th className="text-right w-10per"> Qty / UOM </th>
                                                    <th className="w-10per">Plant</th>
                                                    <th className="w-10per"> Required Date </th>
                                                    <th className="text-right w-8per">Basic</th>
                                                    <th className="text-right w-8per">Other Chrg</th>
                                                    <th className="w-10per"> Taxes </th>
                                                    <th className="w-10per"> Gross </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.quotations.map((qbvLine,i) =>
                                                <> 
                                                <tr class="accordion-toggle" >
                                                    <td class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></td>
                                                    <td className="w-6per"> {qbvLine.lineNo}</td>
                                                    <td className="w-40per"> {qbvLine.materialDesc+" ("+qbvLine.materialCode+")"} </td>
                                                    <td className="text-right w-10per"> {qbvLine.reqQty + " (" + qbvLine.uom + ")"} </td>
                                                    <td className="w-10per">{qbvLine.plant}</td>
                                                    <td className="w-10per"> {qbvLine.requiredDate} </td>
                                                    <td className="text-right w-8per">{qbvLine.basicAmtForDisplay}</td>
                                                    <td className="text-right w-8per">{qbvLine.otherChargeForDisplay}</td>
                                                    <td className="w-10per"> {qbvLine.taxesForDisplay} </td>
                                                    <td className="w-10per"> {qbvLine.grossForDisplay} </td>
                                                </tr>
                                                 <tr class="hide-table-padding">
                                                    <td colSpan="10">
                                                        <div id={"collapse" + i} class="collapse in p-1">
                                                            <div className="container-fluid px-0">
                                                                <div className="row px-4 py-2">
                                                                    <div className="col-12 col-md-8 col-lg-8">
                                                                        <div className="form-group">
                                                                            <label className="mr-1 label_12px">Long Text</label>
                                                                            <textarea
                                                                                className={"h-100px form-control " + this.props.readonly}
                                                                                value={qbvLine.longText}
                                                                                name={"quotations["+i+"][longText]"}
                                                                                onChange={(event) => {
                                                                                    commonHandleChange(event, this, "quotations."+i+".longText");
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-4 col-lg-4">
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Delivery Date</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.deliveryDate}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][deliveryDate]"}
                                                                                onChange={(event) => {
                                                                                    commonHandleChange(event, this, "quotations."+i+".deliveryDate");
                                                                                  }}
                                                                            />
                                                                        </div>
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Rate</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.rate}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][rate]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event, i,'rate');
                                                                                  }}
                                                                            />
                                                                        </div>
                                                                        { this.state.qbvArray.otherChargeType == 'item_level' &&
                                                                        <React.Fragment>
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Freight</span>
                                                                            <select
                                                                                value={qbvLine.freightType}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][freightType]"}
                                                                                onChange={e => {  this.calculateFrLineItem(e,i,"freightType")
                                                                                    // commonHandleChange(event, this, "quotations."+i+".freightType");
                                                                                  }}
                                                                            >
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.freight}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][freight]"}
                                                                                // onChange={(value) => {
                                                                                //     console.log('value',value.target.value)
                                                                                    
                                                                                // }}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"freight")
                                                                                  }}
                                                                            />
                                                                        </div>

                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Packing & Fwd</span>
                                                                            <select
                                                                                value={qbvLine.packingAndFwdType}
                                                                                name={"quotations["+i+"][packingAndFwdType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,'packingAndFwdType')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".packingAndFwdType");
                                                                                  }}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                            >
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.packingAndFwd}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][packingAndFwd]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"packingAndFwd")
                                                                                  }}
                                                                            />
                                                                        </div>
                                                                      
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Other Charges</span>
                                                                            <select
                                                                                value={qbvLine.otherChargesType}
                                                                                name={"quotations["+i+"][otherChargesType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,'otherChargesType')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".otherChargesType");
                                                                                  }}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                            >
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.otherCharges}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][otherCharges]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"otherCharges")
                                                                                  }}
                                                                            />
                                                                        </div>
                                                                        </React.Fragment>
                                                                        }
                                                                       
                                                                         <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Taxes(%)</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.taxes}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][taxes]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,"taxes")
                                                                                    // changeTaxes(event, this, "quotations."+i+".taxes");
                                                                                  }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </>
                                                )}
                                            </tbody>
                                        </table>
                                    </StickyHeader>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-6 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Basic Amount</label>
                                <span className="display_block">
                                    {this.state.qbvArray.basicAmount}
                                </span>
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <div className="form-group">
                                    <label className="mr-1 label_12px">Other Changes</label>
                                    {
                                        this.state.qbvArray.otherChargeType == 'header_level' ? 
                                            <input
                                                type="text"
                                                className={"form-control " + this.state.prLineReadOnly}
                                                required
                                                name={"qbvarray.otherCharges"}
                                                value={this.state.qbvArray.otherCharges}
                                                onChange={(event) => {
                                                    commonHandleChange(event, this, "qbvArray.otherCharges");
                                                }}
                                            />
                                            : <h6>{this.state.qbvArray.otherCharges}</h6>

                                    }
                                    
                                   
                                </div>
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Tax Amount</label>
                                <span className="display_block">
                                    {this.state.qbvArray.taxAmount}
                                </span>
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Gross Amount</label>
                                <span className="display_block">
                                    {this.state.qbvArray.grossAmount}
                                </span>
                            </div>
                        </div>
                        <div className="row px-4 py-0">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-sm btn-outline-warning mr-2" data-toggle="modal" data-target="#documentModal"><i className="fa fa-file-o" />&nbsp;Upload Document</button>
                                    <button type="submit" className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;Save / Edit</button>
                                    <button type="button" className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal documentModal" id="documentModal" >
                <div className="modal-dialog mt-100" style={{width:"800px", maxWidth:"800px"}}>
                <div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
                            <div className="modal-header">
                                Other Documents
                  <button type="button" className={"close " + this.props.readonly} data-dismiss="modal">
                                    &times;
                </button>
                            </div>
                            <div className={"modal-body " + this.props.readonly}>
                                <div className={"row mt-1 px-4 py-1 " + isTcDocSec}>
                                    <div className="col-sm-2">
                                        <span>Technical Document</span>
                                    </div>
                                </div>
                                <div className="row mt-1 px-4 py-1">
                                    {this.state.otherDocumentsList.map((el, i) => (
                                        <>
                                            {/* {console.log(el)} */}
                                            <div className={"col-sm-2 " + isTcDocSec}>
                                                <input type="checkbox" className="display_block mgt-10 m-auto"
                                                    // name={"prAttSet[" + i + "][istc"}
                                                    // disabled={isEmpty(
                                                    //     el.attachment.attachmentId
                                                    // )}
                                                    // onChange={(e) => commonHandleChangeCheckBox(e, this, "otherDocumentsList." + i + ".istc")}
                                                    // value="Y" checked={el.istc}
                                                />
                                            </div>

                                            <div className="col-sm-5">
                                                <div className="input-group">
                                                    <div className="custom-file">
                                                        {/* <input
                                                            type="hidden"
                                                            disabled={isEmpty(
                                                                el.prAttachmentId
                                                            )}
                                                            name={"prAttSet[" + i + "][prAttachmentId]"}
                                                            value={el.prAttachmentId}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            disabled={isEmpty(
                                                                el.attachment.attachmentId
                                                            )}
                                                            name="bidder[status]"
                                                            name="bidder[pr][]"
                                                            name={"prAttSet[" + i + "][pr][prId]"}
                                                            value={this.state.prDetails.prId}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            disabled={isEmpty(
                                                                el.attachment.attachmentId
                                                            )}
                                                            name={
                                                                "prAttSet[" +
                                                                i +
                                                                "][attachment][attachmentId]"
                                                            }
                                                            value={
                                                                el.attachment.attachmentId
                                                            }
                                                        />
                                                        <input
                                                            type="hidden"
                                                            disabled={isEmpty(
                                                                el.attachment.attachmentId
                                                            )}
                                                            name={
                                                                "prAttSet[" +
                                                                i +
                                                                "][attachment][fileName]"
                                                            }
                                                            value={el.attachment.fileName}
                                                        />
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                commonHandleFileUpload(
                                                                    e,
                                                                    this,
                                                                    "otherDocumentsList." + i + ".attachment"
                                                                );
                                                            }}
                                                            className={
                                                                "form-control custom-file-input " +
                                                                this.props.readonly
                                                            }
                                                            id={"inputGroupFile" + i}
                                                        /> */}
                                                        <label
                                                            className="custom-file-label"
                                                            for={"inputGroupFile" + i}
                                                        >
                                                            Choose file
                          </label>
                                                    </div>
                                                    <div className="input-group-append">
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => { }}
                                                            type="button"
                                                        >
                                                            X
                          </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <a
                                                        href={
                                                            "/rest/download/" +
                                                            el.attachment.attachmentId
                                                        }
                                                    >
                                                        {el.attachment.fileName}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control height_40px " + this.props.readonly
                                                    }
                                                    name={"otherDocuments[" + i + "][description]"}
                                                    value={el.description}
                                                    onChange={(e) => {
                                                        commonHandleChange(
                                                            e,
                                                            this,
                                                            "otherDocumentsList." + i + ".attachment.description"
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="col-sm-2">
                                                <button
                                                    className={
                                                        "btn " +
                                                        (i === 0
                                                            ? "btn-outline-success"
                                                            : "btn-outline-danger")
                                                    }
                                                    onClick={() => {
                                                        i === 0
                                                            ? this.addOtherDocument()
                                                            : this.removeOtherDocument("" + i + "");
                                                    }}
                                                    type="button"
                                                >
                                                    <i
                                                        class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                                        aria-hidden="true"
                                                    ></i>
                                                </button>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </form>
            </>
        );
    }
}


const mapStateToProps=(state)=>{
    return state.quotationByVendorReducer;
  };
  export default connect(mapStateToProps,actionCreators)(QuotationByVendor);


  <div className="col-lg-3 col-md-6 col-sm-6 col-12">
  <div className="card">
    {/* <Link to="/purchasesummary"> */}
      <div className="content">
        <div className="row">
          <div className="col-4">
            <div className="icon-big icon-info text-center">
              <i
                className="fa fa-file-o"
                aria-hidden="true"
              ></i>
            </div>
          </div>
          <div className="col-8">
            <div className="numbers">
              <p class="card-head text-info">Sale Orders</p>
              
            </div>
          </div>
        </div>
        {/* <div className="row mt-3 mb-3"></div> */}
        <div className="footer">
          <hr />
          <div className="row w-100">
            <div className="col-12">
              {/* <small className="text-muted font_size_point7rem">Today Purchase : <span>0</span></small>
                                            <div className="progress custom_progress">
                                                <div className="progress-bar bg-success" role="progressbar" style={{width:this.state.todayPurchase+"%"}} aria-valuenow={this.state.todayPurchase} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div> */}
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                New SO's :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                Open SO's :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                Open ASN/SEN :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                Open Gate Entry :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-info">
                Pending Bill Booking :{" "}
                <span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    {/* </Link> */}
  </div>
</div>
<div className="col-lg-3 col-md-6 col-sm-6 col-12">
  <div className="card">
    {/* <Link to="/salessummary"> */}
      <div className="content">
        <div className="row">
          <div className="col-4">
            <div className="icon-big icon-warning text-center">
              <i
                className="fa fa-bars"
                aria-hidden="true"
              ></i>
            </div>
          </div>
          <div className="col-8">
            <div className="numbers">
              <p class="card-head text-warning">Details</p>
            </div>
          </div>
        </div>
        {/* <div className="row mt-3 mb-3"></div> */}
        <div className="footer">
          <hr />
          <div className="row w-100">
            <div className="col-12">
              {/* <small className="text-muted font_size_point7rem">Today Sale : <span>0</span></small>
                                            <div className="progress custom_progress">
                                                <div className="progress-bar bg-success" role="progressbar" style={{width:this.state.todaySale+"%"}} aria-valuenow={this.state.todaySale} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div> */}
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                Open Details :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                Open RFQ's :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                QCF In-process :{" "}
                <span></span>
              </p>
              <p className="font_size_point9rem pb-0 mb-0 font_weight_500 text-warning">
                Order In-process :{" "}
                <span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    {/* </Link> */}
  </div>
</div>

User ID: sanjeev.san@yopmail.com
Password: f2G@W5cx