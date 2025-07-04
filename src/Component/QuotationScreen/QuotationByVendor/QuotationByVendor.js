
import React, { Component, useState } from "react";
import { API_BASE_URL } from "../../../Constants";
import { showAlertAndReload, showAlert} from "./../../../Util/ActionUtil"

import {
    commonHandleFileUpload,
    commonSetState,
    commonHandleChange,
    commonHandleChangeCheckBox,
    commonSubmitFormNoValidation,
    commonSubmitForm,
    commonSubmitWithParam,
    updateState,
    commonHandleFileUploadInv,
    getFileUploadObjectInv,
    showSwalByResponseEntity,
    commonSubmitFormValidation

} from "../../../Util/ActionUtil";

import {saveQuotation,downloadexcelApi,request,uploadFile, submitForm} from "../../../Util/APIUtils";

import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import formatDate, { formatDateWithoutTime,disablePastDate } from "../../../Util/DateUtil";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import { getUserDto, checkIsNaN,getDecimalUpto,FixWithoutRounding,removeLeedingZeros } from "../../../Util/CommonUtil";
import {countBy, sumBy, max,sum} from 'lodash-es';
import { ROLE_APPROVER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_PURCHASE_MANAGER_ADMIN,ROLE_BUYER_ADMIN, ROLE_NEGOTIATOR_ADMIN } from "../../../Constants/UrlConstants";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import { TableContainer } from "@material-ui/core";


const  chargesTypes = [
    // {
    //     value:"lumpsum",
    //     display:"Lumpsum"
    // },
    {
        value: "percent",
        display: "%"
    },
    {
        value: "perUnit",
        display: "Per Unit"
    },
    // {
    //     value: "atActual",
    //     display: "At actual"
    // }
]

const  headerchargesTypes = [
    {
        value:"lumpsum",
        display:"Lumpsum"
    },
    {
        value: "percent",
        display: "%"
    },
    // {
    //     value: "perUnit",
    //     display: "Per Unit"
    // },
    // {
    //     value: "atActual",
    //     display: "At actual"
    // }
]



class QuotationByVendor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            headerfreightChargeType:"",
            paymentTermsList:[],
            incoTermsList:[],
            bidderDocumentsList: [
                this.getEmptyDocObj()
                
            ],
            
            loadBidderDocuments: true,
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
            headerchargesTypes:headerchargesTypes,
            chargesType:chargesTypes,
            qbvArray:{
                saprfqNo:"",
                prNo:"",
                prDate:"",
                bidderId:"",
                buyer:{
                    userId: "",
                    name: "",
                    empCode:"",
                    email:""
                },
                priority:"",
               // otherChargeType:"item_level",
                otherChargeType:"header_level",
                isTC:true,
                paymentTerms:"",
                negotiatorPaymentTerms:"",
                incoTerms:"",
                vendorIncoDescription:"",
                validityDateFrom:"",
                validityDateTo:"",
                vendorOfferNo:"",
                vendorOfferDate:"",
                uploadExcelFile:"",
                accept:false,
                status:"",
                documents:[],
                otherCharges: 0,
                basicAmt:0,
                taxAmt:0,
                totalTaxesOnOtherCharges:0,
                grossAmt:0,
                totalFreightCharge:0,
                totalPackingCharge:0,
                totalOtherCharge:0,
                enquiry:{
                    createdBy:{
                        userName:""
                    },
                    code:""
                },
                partner:{
                    name:""
                   }
            },
            workbook:"",
            quotations: [],
            
            reasonForReject:"",
            negoBidderId:"",
            currentDocRemoveIndex:"",
            loadDocument:false,
            fileName: "",
            responseMsg:""
        }
      // this.handleChange = this.handleChange.bind(this);
    }
    

  // handleChange(event) {    this.setState({value: event.target.value});  }

    getDefaultType(item){
        return item ? item:'lumpsum';
    }

    controlSubmit=(e)=>{
        if (e.key === 'Enter' && e.shiftKey === false) {
           e.preventDefault();
           // callback(submitAddress);
         }
     }

    changeHandler=(event)=>{
        let bidderId=this.state.qbvArray.bidderId;
        const data = new FormData();
    let target = event.target;
    data.append('file', event.target.files[0]);
    console.log('fileupload inv',data)
    // component.props.changeLoaderState(true);
    uploadFile(data,"/rest/uploadExcel/"+bidderId).then(response => {
        showAlertAndReload(!response.responseStatus,response.responseMsg);
      //  showSwalByResponseEntity(response);
      //  getFileUploadObjectInv(component,JSON.stringify(response),statePath);
        // component.props.changeLoaderState(false);

        // if(!isEmpty(formRef)){
        //     component[formRef].validateFields(target);
        // }
    });
        if (event.target.files.length > 0) {
            this.setState({ fileName: event.target.files[0].name });
        }
      }



    initState(props){
    let quotations = props.priceBidList;
    let qbvArray = props.prDetails;
    let paymentTermsList = props.paymentTermsList;
    let incoTermsList=props.incoTermsList;
        // let {quotations,qbvArray} = this.state;
        
        quotations = quotations.map((item) => {
            let newItem = {
                ...item,
                priceBidId:item.priceBidId,
                otherChargesRate:item.otherChargesRate,
                otherChargeForDisplay:item.otherChargesAmt,
                // otherChargesType: this.getDefaultType(item.otherChargesType),
                otherChargesType: item.otherChargesType,
                freightChargeRate:item.freightChargeRate,
               // freightChargesType: this.getDefaultType(item.freightChargesType),
                freightChargesType: item.freightChargesType,
                packingFwdCharge:item.packingFwdCharge,
                // packingFwdChargeType: this.getDefaultType(item.packingFwdChargeType),
                packingFwdChargeType: item.packingFwdChargeType,
                // discountType: this.getDefaultType(item.discountType),
                discountType: item.discountType,
                discountCharge: item.discountCharge ? item.discountCharge:0,
                taxRate:item.taxRate,
                totalFreightCharge:0,
                totalPackingFwdChargeAmt:0,
                otherChargesAmt:0,
                taxAmt:0,
                vendorText:item.vendorText
               // paymentterms:item.paymentterms
                
            }
        
            let qbvLineObj = item.itemBid.prLine;

            let qbvLineQuantity = item.itemBid;
            // console.log("qbvLineQuantity-->",qbvLineQuantity);
            
            let basicAmtForDisplay = this.calculateBasicAmount(item.exGroupPriceRate,qbvLineQuantity.quantity);
            // let basicAmtForDisplay = this.calculateBasicAmount(qbvLineObj.rate,qbvLineObj.quantity);
            
            newItem = {
                ...newItem,
                lineNo: qbvLineObj.lineNumber,
                materialCode:qbvLineObj.materialCode,
                materialDesc: qbvLineObj.materialDesc,
                reqQty: qbvLineObj.quantity,
                uom: qbvLineObj.uom,
                basicAmtForDisplay,
                plant: qbvLineObj.plant,
                requiredDate: formatDateWithoutTime(qbvLineObj.requiredDate),
              // deliveryDate:formatDateWithoutTime(qbvLineObj.deliverDate),
                exGroupPriceRate:item.exGroupPriceRate,
                description:qbvLineObj.description,
                materialPOText:qbvLineObj.materialPOText,
                plantDESC: qbvLineObj.plantDESC
                
            }
            let deliveryDate=""
            if(this.state.qbvArray.status=="DR"){
                deliveryDate=formatDateWithoutTime(qbvLineObj.deliverDate)
                }
                else{
                    deliveryDate=formatDateWithoutTime(item.deliveryDate)
                }


            let {otherChargeForDisplay,totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,discountAmt} = this.calculateOtherChargeForDisplay(newItem);
            newItem.otherChargeForDisplay = otherChargeForDisplay;
            
            let netRate = basicAmtForDisplay  - discountAmt;

            newItem = {
                ...newItem,
                totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,
                discountAmt,
                // perQtyDiscount: discountAmt ? discountAmt / item.reqQty:0,
                perQtyDiscount: discountAmt ? checkIsNaN(Number.parseFloat(discountAmt / item.reqQty)):0,
                netRate,
                deliveryDate
            }
            let taxesForDisplay =checkIsNaN( Number.parseFloat(item.taxAmount==null?0:item.taxAmount).toFixed(2));//checkIsNaN(newItem.basicAmtForDisplay * (newItem.taxRate/100));
            newItem.taxesForDisplay = taxesForDisplay;

            
            // newItem.grossForDisplay = newItem.newItem + taxesForDisplay + otherChargeForDisplay;
            console.log("netRATE ---->>>>",netRate)
            newItem.grossForDisplay = (basicAmtForDisplay + otherChargeForDisplay + parseFloat(taxesForDisplay)) - (discountAmt);
            // newItem.grossForDisplay = checkIsNaN(basicAmtForDisplay + taxesForDisplay + otherChargeForDisplay - discountAmt);
            // newItem.grossForDisplay = newItem.basicAmtForDisplay + taxesForDisplay + otherChargeForDisplay;
            return newItem;
        })
        
        // console.log("quatations--basicAmtForDisplay",quotations)
        let basicAmt = sumBy(quotations,'basicAmtForDisplay');
        let taxAmt = qbvArray.taxAmt;//sumBy(quotations,'basicAmtForDisplay');
        let otherCharges = sumBy(quotations,'otherChargeForDisplay');
        let totalDiscount = sumBy(quotations,'netRate');
        
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
            saprfqNo:qbvArray.saprfqno,
            negotiatorPaymentTerms:qbvArray.negotiatorPaymentTerms,
            incoTerms:qbvArray.incoTerms,
            validityDateFrom: qbvArray.validityDateFrom===""?new Date():formatDateWithoutTime(qbvArray.validityDateFrom),
            //validityDateFrom: qbvArray.validityDateFrom!=null? formatDateWithoutTime(qbvArray.validityDateFrom):"",
            validityDateTo: qbvArray.validityDateTo!=null?formatDateWithoutTime(qbvArray.validityDateTo):"",
            vendorOfferNo:qbvArray.vendorOfferNo,
            //vendorOfferDate:qbvArray.vendorOfferDate!=null?formatDateWithoutTime(qbvArray.vendorOfferDate):"",
            vendorOfferDate:qbvArray.vendorOfferDate===""?new Date():formatDateWithoutTime(qbvArray.vendorOfferDate),
            documents:[],
            otherCharges: qbvArray.otherCharge,
            otherChargeType: qbvArray.otherChargeType,
            totalDiscount,
            // basicAmt:qbvArray.basicAmt,
            // taxAmt:qbvArray.taxAmt,
            // grossAmt:qbvArray.grossAmt,
         totalFreightChargeType:qbvArray.headerFreightType,
         totalPackingChargeType:qbvArray.headerPKFWDType,
         totalOtherChargeType:qbvArray.headerOtherType,
            totalFreightCharge:qbvArray.totalFreight,
            totalPackingCharge:qbvArray.totalPKFWD,
            totalOtherCharge:qbvArray.otherRates,
            totalTaxesOnOtherCharges:qbvArray.otherTaxAmt,
            basicAmt,
            taxAmt,
            // otherCharges,
            grossAmt: qbvArray.grossAmt,//Number(basicAmt) + Number(taxAmt) + Number(otherCharges),
        //  otherChargeType: qbvArray.otherChargeType ? qbvArray.otherChargeType:'item_level',
         otherChargeType: qbvArray.otherChargeType ? qbvArray.otherChargeType:'header_level',
         //   paymentterms:qbvArray.paymentterms
           //negotiatorPaymentTerms:qbvArray.negotiatorPaymentTerms
            // enquiry:props.role===ROLE_NEGOTIATOR_ADMIN?null:null
        }

        paymentTermsList = {
            ...this.state.paymentTermsList,
            ...paymentTermsList,
        }
        incoTermsList={
            ...this.state.incoTermsList,
            ...incoTermsList
        }

        // if(props.role===ROLE_NEGOTIATOR_ADMIN){
            if((props.role === ROLE_NEGOTIATOR_ADMIN) || (props.role === ROLE_BUYER_ADMIN)){
            
            qbvArray = {
                ...qbvArray,
                bidderId:props.bidderId
            }

            
        }
       

        updateState(this,{qbvArray,quotations,paymentTermsList,incoTermsList});
        // this.setState({loadBidderDocuments:true})
    }
   
    componentWillReceiveProps = props =>{
        
        if(!isEmpty(props.workbook)){
            this.setState({
            workbook:props.workbook})
        }

        if(this.state.loadDocument && props.removeAttachmentRes && props.removeAttachmentRes.success){
            let bidderDocumentsList = this.state.bidderDocumentsList;
            bidderDocumentsList[this.state.currentDocRemoveIndex] = {
              ...bidderDocumentsList[this.state.currentDocRemoveIndex],
              bidderAttachmentId:"",
              attachment:{}
            }
            this.setState({ bidderDocumentsList: bidderDocumentsList, loadDocument:false });
          }
        // if(!isEmpty(props.quotationSaveStatus)){
        //     this.props.changeLoaderState(false);
        // }
      
        if(!isEmpty(props.paymentTermsList)){
           // let paymentTermsListArray = Object.entries(props.paymentTermsList).map((key) => {
            //  return {display: props.paymentTermsList[key], value: key}
           // });
           // this.sv(paymentTermsListArray)
            // console.log(paymentTermsListArray)
            // let {paymentTermsList} = this.state
         //   this.setState({
           //     paymentTermsList: [...paymentTermsListArray]
           //   })
           this.initState(props);
          }

        if(!isEmpty(props.priceBidList) && !isEmpty(props.prDetails) ){
            this.initState(props);
            // this.setQbvLine(props);
            // console.log(props.priceBidList)
        }else{
            this.setState({
            //     bidderDocumentsList: [
            //     this.getEmptyDocObj()
            // ],
            // loadBidderDocuments: false,
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
            headerchargesTypes:headerchargesTypes,
            chargesType:chargesTypes,
            qbvArray:props.prDetails,
            quotations: [],
            reasonForReject:"", 
            negoBidderId:""
        })
        }
        // debugger
        if(this.state.loadBidderDocuments && !isEmpty(props.attachmentList)){
            this.setBidderDocuments(props); 
        }
        // else{
        //     this.setState({bidderDocumentsList:[
        //         this.getEmptyDocObj()
        //     ]})
        // }
        // console.log("Props Role",props.role);
        // if(props.role===ROLE_NEGOTIATOR_ADMIN){
            if((props.role === ROLE_NEGOTIATOR_ADMIN) || (props.role === ROLE_BUYER_ADMIN)){
            this.setState({negoBidderId:props.bidderId});

            // var main = {
            //     ...this.state.qbvArray,
            //     bidderId:props.bidderId
            // }
            // this.setState({main});
        }
        // if(!isEmpty(props.prDetails)){
        //     let pr=this.getPRHeadFromObj(props.prDetails);
        //     this.setState({
        //         qbvArray:pr
        //     })
        // }
    }
   
    exportExcel=()=>{
        console.log("Clicked......."+API_BASE_URL );
 
      //  window.location.href = API_BASE_URL +"/rest/exportExcel"
 
      //   <a href={API_BASE_URL + "/rest/exportExcel"}/>
 
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
            otherChargeType: "header_level",
            basicAmt:prHeadObj.basicAmt,
            taxAmt:prHeadObj.taxAmt,
            grossAmt:prHeadObj.grossAmt,
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

    getEmptyDocObj=()=>{
        return {
            bidderAttachmentId: "",
            attachment: {
                attachmentId: "",
                fileName: "",
                text: "",
                description: ""
            },
            bidder: {
                bidderId: ""
            }
        }
    }    

    setBidderDocuments=props=>{
        let tempBidderDocumentsList=[];
          props.attachmentList.map((el,i)=>{
            tempBidderDocumentsList.push(this.getBidderDocuments(el));
          })
          this.setState({
            bidderDocumentsList:tempBidderDocumentsList,
            loadBidderDocuments:false
          })
    }

    getBidderDocuments=el=>{
    if(!isEmpty(el)){
        return el;
    }else{
        this.getEmptyDocObj()
    }
    }

    addBidderDocument() {
        let currOtherDocList = this.state.bidderDocumentsList;
        let bidderDocumentsArray = [
        this.getEmptyDocObj()
        ];
        bidderDocumentsArray = currOtherDocList.concat(bidderDocumentsArray);
        this.setState({
        bidderDocumentsList: bidderDocumentsArray,
        });
    }

    removeBidderDocument(i) {
        let bidderDocumentsList = this.state.bidderDocumentsList;
        bidderDocumentsList.splice(i, 1);
        this.setState({ bidderDocumentsList: bidderDocumentsList });
    }
    hideEnquiryDiv = () => {
        this.setState({ other_div: true, enquiry_div: false })
    }

    calculateBasicAmount = (rate,quantity) =>{
        let amount =  isNaN(rate*quantity)?0:rate*quantity 
        return Number(amount)
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
    calculateNetValue=(price,netRate,type,discountAmt,quantity)=>{

        let netValue=0
        if(type == 'lumpsum'){
            netValue=price-discountAmt
        }else{
            netValue=getDecimalUpto(netRate/quantity,2)
        }
        return netValue;

    }

    calOtherCharge = (row,fvalue,ftype,discountAmt) => {

        // console.log("CalOtheCharge - discountAMt  ->",discountAmt);
        // console.log("row calotehrchrg",row);
        // console.log("row calotehrchrg",row[fvalue]);

        let otherCharge = null;
        if(row.netRate){
            if(ftype==="freightChargesType" || ftype==="packingFwdChargeType" || ftype==="otherChargesType"){
               // otherCharge = row.netRate;
               otherCharge = row.basicAmtForDisplay-discountAmt;
            }else{
                otherCharge = row.basicAmtForDisplay;
            }
        }else{  
            otherCharge = row.basicAmtForDisplay;
        }
            
        // console.log("otherCharges calotherCharge",otherCharge);
        let quantity = row.itemBid.quantity;
        let charge = 0;
        let type = row[ftype]
        let value = row[fvalue]
        // console.log("value of cal other charge --->",value)
        
        if(type == 'percent'){
            charge = isNaN(otherCharge * value / 100) ? 0: otherCharge * value / 100;
        }else if(type == 'perUnit'){
            charge = isNaN(quantity * value) ? 0:quantity * value;
        }else if(type == 'lumpsum'){
            charge =  isNaN(value) ? 0: value;
        }
        return Number(charge);
    }

    calSingleCharges = (row,fvalue,ftype) => {
        let otherCharge = row.exGroupPriceRate ? row.exGroupPriceRate:0;
        let charge = 0;
        let type = row[ftype]
        let value = row[fvalue]
        if(type == 'percent'){
            charge = isNaN(otherCharge * value / 100) ? 0: otherCharge * value / 100;
        }else if(type == 'perUnit'){
            charge = isNaN(value) ? 0: value;
        }else if(type == 'lumpsum'){
            charge =  isNaN(value) ? 0: value;
        }
        return Number(charge);
    }

    calculateOtherChargeForDisplay(row){
        // console.log("calculateOtherChargeForDisplay ->row",row)
        let discountAmt = this.calOtherCharge(row,'discountCharge','discountType');
        discountAmt = Number(discountAmt)

        let totalFreightChargeAmt = this.calOtherCharge(row,'freightChargeRate','freightChargesType',discountAmt);
        totalFreightChargeAmt = Number(totalFreightChargeAmt)

        let perQtyFreightAmt = this.calSingleCharges(row,'freightChargeRate','freightChargesType',discountAmt);
        perQtyFreightAmt = Number(perQtyFreightAmt)

        let totalPackingFwdChargeAmt = this.calOtherCharge(row,'packingFwdCharge','packingFwdChargeType',discountAmt);
        totalPackingFwdChargeAmt = Number(totalPackingFwdChargeAmt)
        
        let perQtyPKAmt = this.calSingleCharges(row,'packingFwdCharge','packingFwdChargeType',discountAmt);
        perQtyPKAmt = Number(perQtyPKAmt)

        let perQtyOtherAmt = this.calSingleCharges(row,'otherChargesRate','otherChargesType',discountAmt);
        perQtyOtherAmt = Number(perQtyOtherAmt)

        let otherChargesAmt = this.calOtherCharge(row,'otherChargesRate','otherChargesType',discountAmt);
        otherChargesAmt = Number(otherChargesAmt)

    
        
        let otherChargeForDisplay = totalFreightChargeAmt + totalPackingFwdChargeAmt + otherChargesAmt ;
        // let otherChargeForDisplay = totalFreightChargeAmt + totalPackingFwdChargeAmt + otherChargesAmt - discountAmt;
        otherChargeForDisplay = Number(otherChargeForDisplay);

        return {otherChargeForDisplay,totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,discountAmt}
    }

    // calculateTotalChanges = (e,type, formRef) => {
    //     let {qbvArray,quotations} = this.state;
    //     let {totalFreightCharge = 0,totalPackingCharge = 0,totalOtherCharge = 0,basicAmt, discountAmt} = qbvArray;
    //     totalFreightCharge = Number(totalFreightCharge);
    //     totalPackingCharge = Number(totalPackingCharge);
    //     totalOtherCharge = Number(totalOtherCharge);
    //     let value = e.target.value ? e.target.value:"";        
    //     let otherCharges = 0;
    //     if(type == 'totalFreightCharge') otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + Number(value);
    //     else if(type == 'totalPackingCharge') otherCharges = Number(totalFreightCharge) + Number(totalOtherCharge) + Number(value);
    //     else if(type == 'totalOtherCharge') otherCharges = Number(totalPackingCharge) + Number(totalFreightCharge) + Number(value);
        
    //     let totalTaxesOnOtherCharges = 0;
    //     if(this.state.qbvArray.otherChargeType==="header_level"){
            
    //         let taxesOnOtherCharges = otherCharges;
    //         let taxesArray = [];
    //         this.state.quotations.forEach((quote)=>{
    //             taxesArray.push(quote.taxRate);
    //         })
    //         let highestTaxRate = max(taxesArray);
    //         totalTaxesOnOtherCharges = taxesOnOtherCharges * (highestTaxRate/100)
    //     }
    //     let taxAmt = sumBy(quotations,'taxesForDisplay');
    //     qbvArray = {
    //         ...qbvArray,
    //         otherCharges,
    //         totalTaxesOnOtherCharges,
    //         // grossAmt: 1 + taxAmt + otherCharges,
    //         grossAmt: basicAmt + taxAmt + otherCharges + totalTaxesOnOtherCharges - discountAmt,
    //         taxAmt:taxAmt+totalTaxesOnOtherCharges,
    //         [type]:value
    //     }
    //     updateState(this,{qbvArray});
    //     if(!isEmpty(formRef)){
    //         this[formRef].validateFields(e.target);
    //     }
    // }

    calculateDiscountAmount = (e,i,type,formRef) => {
        let {quotations,qbvArray} = this.state;
        let row = quotations[i];
        console.log("rowData of calcDiscountAmount- ",row);
        let value = e.target.value ? e.target.value:"";
        let totalTaxesOnOtherCharges="";
        let  otherChargeForDisplay="";
        if(i != null){
            if(type == 'taxRate' && value > 100) value = 100;  
            row[type] = value;
            if(type == 'exGroupPriceRate'){
                row.basicAmtForDisplay = row.reqQty * value;
            }
            let {otherChargeForDisplay,totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,discountAmt} = this.calculateOtherChargeForDisplay(row);
            let taxesForDisplay = row.taxesForDisplay ? row.taxesForDisplay:0;
            if(type == 'taxRate'){
              // taxesForDisplay = row.basicAmtForDisplay * (value/100)
                taxesForDisplay = (row.basicAmtForDisplay + otherChargeForDisplay) * (value/100)
            }


            let grossForDisplay = (row.basicAmtForDisplay + otherChargeForDisplay + parseFloat(taxesForDisplay)) - (discountAmt);
            //discount value enter lost the gross for display
            let netRate = row.basicAmtForDisplay  - discountAmt;
            
            // let netRate = row.netRate  - discountAmt;
            // console.log("row bacic Amt for Display",row.basicAmtForDisplay)
            // console.log("row Dicsount Amt ",discountAmt)
            // console.log("netRate value",netRate)
            quotations[i] = {
                ...row,
                otherChargeForDisplay,
                taxesForDisplay,
                grossForDisplay, 
                discountAmt,
                // perQtyDiscount: discountAmt ? discountAmt/row.reqQty:0,
                perQtyDiscount: discountAmt ? checkIsNaN(Number.parseFloat(discountAmt/row.reqQty)):0,
                totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,
                netRate,
            };
    }
        let  basicAmt = sumBy(quotations,'basicAmtForDisplay');
        let  taxAmt = sumBy(quotations,'taxesForDisplay');
       // let otherCharges = sumBy(quotations,'otherChargeForDisplay');
        let totalDiscount = sumBy(quotations,'netRate');

        let otherCharges = "";
        if(this.state.qbvArray.otherChargeType==="header_level" || (type==="exGroupPriceRate" && this.state.qbvArray.otherChargeType==="header_level") || (type==="discountCharge" && this.state.qbvArray.otherChargeType==="header_level") || (type==="discountType" && this.state.qbvArray.otherChargeType==="header_level") || (type==="taxRate" && this.state.qbvArray.otherChargeType==="header_level")){
       
            let totalFreightChargeAmt = this.calculateHeaderFreightChargeDisplay(qbvArray,totalDiscount,type);
            let totalPackingChargeAmt = this.calculateHeaderPackingChargeDisplay(qbvArray,totalDiscount,type);
            let totalOtherChargeAmt = this.calculateHeaderOtherChargeDisplay(qbvArray,totalDiscount,type);

            otherCharges = Number(totalFreightChargeAmt) + Number(totalPackingChargeAmt) + Number(totalOtherChargeAmt);
            //   let highestTaxRate = 18;
             //  totalTaxesOnOtherCharges = highestTaxRate/100;
          
          }
          else{
            otherCharges = sumBy(quotations,'otherChargeForDisplay');
        }

        
        // if(this.state.qbvArray.otherChargeType==="header_level"){
       
        //     let totalFreightChargeAmt = this.calculateHeaderFreightChargeDisplay(qbvArray,totalDiscount,type);
        //     let totalPackingChargeAmt = this.calculateHeaderPackingChargeDisplay(qbvArray,totalDiscount,type);
        //     let totalOtherChargeAmt = this.calculateHeaderOtherChargeDisplay(qbvArray,totalDiscount,type);

        //     otherCharges = Number(totalFreightChargeAmt) + Number(totalPackingChargeAmt) + Number(totalOtherChargeAmt);
        //       let highestTaxRate = 18;
        //       totalTaxesOnOtherCharges = highestTaxRate/100;
          
        //   }

        qbvArray = {
            ...qbvArray,
            basicAmt,
            taxAmt,
           // totalTaxesOnOtherCharges,
            otherCharges,
            otherChargeType: type == 'otherChargeType' ? value:qbvArray.otherChargeType,
            grossAmt: basicAmt + taxAmt + otherCharges - totalDiscount,
            totalDiscount
        }
        updateState(this,{quotations,qbvArray});
        if(!isEmpty(formRef)){
            this[formRef].validateFields(e.target);
        }
    }

    closedocModal() {            
        document.getElementById("PRdocumentModal").style.display = "none";
      }

      calculateHeaderFreightChargeDisplay(row,totalDiscount,rtype){
 

        let otherCharges = 0.00;
        let totalPackingCharge=0;
        let totalOtherCharge=0;
        let type = row.totalFreightChargeType;
        let value = row.totalFreightCharge;
     
        let basicAmountTotal=0;
        if(rtype==="exGroupPriceRate" || rtype==="discountCharge" || rtype==="discountType" || rtype==="otherChargeType"){
           basicAmountTotal=totalDiscount
        }else{
            basicAmountTotal= row.totalDiscount;
        }

      
        if(type=="percent"){
            let percentValue=value/100;
            let finalFreightAmount=(basicAmountTotal*percentValue);
            // otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + Number(value/100);
          // let totalothercharge=(Number(totalPackingCharge) + Number(totalOtherCharge) + Number(finalFreightAmount))*(18/100)
            //otherCharges = totalothercharge + Number(finalFreightAmount);
            let totalothercharge=(Number(totalPackingCharge) + Number(totalOtherCharge) + Number(finalFreightAmount))
            otherCharges = totalothercharge;
            // otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + Number(finalFreightAmount);

        }
        else if(type=="lumpsum"){
            
           // otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + (Number(value)+ Number(value)*(18/100));
           otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + (Number(value));
        }
        else{
            otherCharges=0.00
        }
  
        return Number(otherCharges);
    }

    calculateHeaderPackingChargeDisplay(row,totalDiscount,rtype){
 

        let otherCharges = 0.00;
        let totalFreightCharge=0;
        let totalOtherCharge=0;
        let type = row.totalPackingChargeType;
        let value = row.totalPackingCharge;
        let basicAmountTotal=0;
        if(rtype==="exGroupPriceRate" || rtype==="discountCharge" || rtype==="discountType" || rtype==="otherChargeType"){
           basicAmountTotal=totalDiscount
        }else{
            basicAmountTotal= row.totalDiscount;
        }

        if(type=="percent"){
            let percentValue=value/100;
            let finalPackingAmount=(basicAmountTotal*percentValue);
            otherCharges = Number(totalFreightCharge) + Number(totalOtherCharge) + Number(finalPackingAmount);
            
            // otherCharges = Number(totalFreightCharge) + Number(totalOtherCharge) + Number(value/100);
        }
        else if(type=="lumpsum"){
            otherCharges = Number(totalFreightCharge) + Number(totalOtherCharge) + Number(value);
        }
        else{
            otherCharges=0.00
        }
   
        return Number(otherCharges);
    }

    calculateHeaderOtherChargeDisplay(row,totalDiscount,rtype){
 

        let otherCharges = 0;
        let totalFreightCharge=0;
        let totalPackingCharge=0;
        let type = row.totalOtherChargeType;
        let value = row.totalOtherCharge;
        let basicAmountTotal=0;
        if(rtype==="exGroupPriceRate" || rtype==="discountCharge" || rtype==="discountType" || rtype==="otherChargeType"){
           basicAmountTotal=totalDiscount
        }else{
            basicAmountTotal= row.totalDiscount;
        }

        if(type=="percent"){
            let percentValue=value/100;
            let finalOtherAmount=(basicAmountTotal*percentValue);
            otherCharges = Number(totalFreightCharge) + Number(totalPackingCharge) + Number(finalOtherAmount);
            // otherCharges = Number(totalFreightCharge) + Number(totalPackingCharge) + Number(value/100);
        }
        else if(type=="lumpsum"){
            otherCharges = Number(totalFreightCharge) + Number(totalPackingCharge) + Number(value);
        }
        else{
            otherCharges=0.00
        }
   
        return Number(otherCharges);
    }

      calculateHeaderTotalChanges = (e,type, formRef) => {
        let {qbvArray,quotations} = this.state;
      
        let row = qbvArray;
        let {basicAmt, discountAmt} = qbvArray;
       
        let value = e.target.value ? e.target.value:"";   
        let otherCharges = 0;
        row[type] = value; 
        let totalFreightChargeAmt = this.calculateHeaderFreightChargeDisplay(row);
        let totalPackingChargeAmt = this.calculateHeaderPackingChargeDisplay(row);
        let totalOtherChargeAmt = this.calculateHeaderOtherChargeDisplay(row);
       
        otherCharges = Number(totalFreightChargeAmt) + Number(totalPackingChargeAmt) + Number(totalOtherChargeAmt);

        let totaltaxamtonfreight=(totalFreightChargeAmt)*18/100;
        let totaltaxamtonpackng=(totalPackingChargeAmt)*18/100;
        let totaltaxamtonother=(totalOtherChargeAmt)*18/100;

     let  totalTaxesOnOtherCharges = (totaltaxamtonfreight+totaltaxamtonpackng+totaltaxamtonother);
      
        // if(type == 'totalFreightCharge') otherCharges = Number(totalPackingCharge) + Number(totalOtherCharge) + Number(value);
        // else if(type == 'totalPackingCharge') otherCharges = Number(totalFreightCharge) + Number(totalOtherCharge) + Number(value);
        // else if(type == 'totalOtherCharge') otherCharges = Number(totalPackingCharge) + Number(totalFreightCharge) + Number(value);
        
      // let totalTaxesOnOtherCharges = 0;
      
        let taxAmt = sumBy(quotations,'taxesForDisplay');
       // let otherChargeForDisplay=otherCharges
        qbvArray = {
            ...qbvArray,
            otherCharges,
        //    otherchargeType,
         // otherChargeForDisplay,
          
            totalTaxesOnOtherCharges,
            // grossAmt: 1 + taxAmt + otherCharges,
            grossAmt: basicAmt + taxAmt + otherCharges + totalTaxesOnOtherCharges - discountAmt,
            taxAmt:taxAmt+totalTaxesOnOtherCharges,
            totalFreightChargeAmt,totalPackingChargeAmt,totalOtherChargeAmt
            // [type]:value
        }
        updateState(this,{qbvArray});
        if(!isEmpty(formRef)){
            this[formRef].validateFields(e.target);
        }
    }

    calculateFrLineItem=(e,i,type,formRef)=> {
        let {quotations,qbvArray} = this.state;
        let row = quotations[i];
        let value = e.target.value ? e.target.value:"";
        // console.log("calculateFrLineItem row->",row.itemBid.quantity)
        // console.log("calculateFrLineItem --i --->",i);
        if(i != null){
            if(type == 'taxRate' && value > 100) value = 100;  
            row[type] = value;
            if(type == 'exGroupPriceRate'){
                row.basicAmtForDisplay = row.itemBid.quantity * value;
                // row.basicAmtForDisplay = row.reqQty * value;
            }
        let {otherChargeForDisplay,totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,discountAmt} = this.calculateOtherChargeForDisplay(row);
            let taxesForDisplay = row.taxesForDisplay ? row.taxesForDisplay:0;
            // console.log("taxesForDisplay",taxesForDisplay);
            // console.log("taxesForDisplay row",row);
            // console.log("taxesForDisplay",row.taxesForDisplay);
            
           
            // console.log("netRate --",net)
            

            let netRate = checkIsNaN(row.basicAmtForDisplay  - discountAmt);
            // console.log("Calculate netRate Item-- ",netRate);

            if(type == 'taxRate'){
                taxesForDisplay = ( netRate + otherChargeForDisplay ) * (value/100)
                // taxesForDisplay = row.basicAmtForDisplay * (value/100)
            }

            // console.log("TAXES FOR DISPLAY -->",taxesForDisplay);
            // console.log("calculateFrLine row->",row)
            // console.log("TAXES FOR DISPLAY --->>>>",taxesForDisplay);
            // let netRate = checkIsNaN(row.basicAmtForDisplay  - discountAmt);
            // console.log("netRate Calculate FR Line Item-- ",netRate);
          
            // let grossForDisplay = row.basicAmtForDisplay + otherChargeForDisplay + taxesForDisplay - netRate;
            let grossForDisplay = (row.basicAmtForDisplay + otherChargeForDisplay + parseFloat(taxesForDisplay)) - (discountAmt);
            // console.log(" Calculate FRLine Item-GrossFor Display--> ",grossForDisplay);
            
            // let netRate = gross  - discountAmt;
            // let netRate = row.basicAmtForDisplay  - discountAmt;
            // let netRate = row.basicAmtForDisplay  - discountAmt;
            quotations[i] = {
                ...row,
                otherChargeForDisplay,
                taxesForDisplay,
                grossForDisplay,
                discountAmt,
                // perQtyDiscount: discountAmt ? discountAmt/row.reqQty:0,
                perQtyDiscount: discountAmt ? checkIsNaN(Number.parseFloat(discountAmt/row.reqQty)):0,
                totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt,
                netRate
            };
        }

        let  basicAmt = sumBy(quotations,'basicAmtForDisplay');
        let  taxAmt = sumBy(quotations,'taxesForDisplay');
       // let otherCharges = sumBy(quotations,'otherChargeForDisplay');
        let totalDiscount = sumBy(quotations,'netRate');
        let otherCharges = "";

        if(value==="header_level" || (type==="exGroupPriceRate" && this.state.qbvArray.otherChargeType==="header_level") || type==="discountCharge" || type==="discountType" || (type==="taxRate" && this.state.qbvArray.otherChargeType==="header_level")){
       
            let totalFreightChargeAmt = this.calculateHeaderFreightChargeDisplay(qbvArray,totalDiscount,type);
            let totalPackingChargeAmt = this.calculateHeaderPackingChargeDisplay(qbvArray,totalDiscount,type);
            let totalOtherChargeAmt = this.calculateHeaderOtherChargeDisplay(qbvArray,totalDiscount,type);

            otherCharges = Number(totalFreightChargeAmt) + Number(totalPackingChargeAmt) + Number(totalOtherChargeAmt);
            //   let highestTaxRate = 18;
            //  totalTaxesOnOtherCharges = highestTaxRate/100;
          
          }
          else{
            otherCharges = sumBy(quotations,'otherChargeForDisplay');
        }

       qbvArray = {
            ...qbvArray,
            // otherCharges:value,
            basicAmt,
            taxAmt,
            otherCharges,
            otherChargeType: type == 'otherChargeType' ? value:qbvArray.otherChargeType,
            grossAmt: basicAmt + taxAmt + otherCharges - totalDiscount,
            totalDiscount
        }
        if(type == 'otherChargeType'){
            quotations = quotations.map((item) => {
                let {otherChargeForDisplay,totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt} = this.calculateOtherChargeForDisplay(item);
                // if(value == 'item_level'){
                    item = {
                        ...item,
                        totalFreightChargeAmt,totalPackingFwdChargeAmt,otherChargesAmt,perQtyFreightAmt,perQtyPKAmt,perQtyOtherAmt
                    }
                // }
                item.otherChargeForDisplay = otherChargeForDisplay;
                item.grossForDisplay = item.basicAmtForDisplay + item.taxesForDisplay + otherChargeForDisplay;
                return item;
            })
        }
        //console.log('quotations',quotations)
        updateState(this,{qbvArray,quotations});
        if(!isEmpty(formRef)){
            this[formRef].validateFields(e.target);
        }
    }


    onSubmitForm = (event) => {
        saveQuotation({
            name:'hello'
        },'/rest/saveQuotation').then(res => {
        }).catch(err => {
        })
        event.preventDefault();

    }

    downloadexcelApi=() =>{
        // let enquiryId=this.state.qbvArray.enquiry?.enquiryId;
        let bidderId=this.state.qbvArray.bidderId;
                     return request({
                         url: API_BASE_URL + "/rest/exportExcel/"+bidderId,
                         method: 'GET',
                      //   body: data
                     }).then(response => {
                         // getFileUploadObject(component,JSON.stringify(response),statePath);
                        this.setState({attachmentId:response.attachmentId})
                        this.setState({fileName:response.fileName})})
     
                       
                 
                 }

    handleApproveQuotation = (event) =>{
        let enquiryId=this.state.negoBidderId;
        commonSubmitWithParam(this.props,"approveQuotation","/rest/approveQuotation",enquiryId);
        this.props.changeLoaderState(true);
    }

    generateRFQfromSAP=()=>{
        let enquiryId=this.state.negoBidderId;
        commonSubmitWithParam(this.props,"saprfqStatus","/rest/generateRFQfromSAP",enquiryId);
      }

    handleRejectQuotation = (event) =>{
        let enquiryId=this.state.negoBidderId;
        let reason= this.state.reasonForReject;
        commonSubmitWithParam(this.props,"rejectQuotation","/rest/rejectQuotation",enquiryId,reason);
        this.props.changeLoaderState(true);
    }

    getGrossAmount = ()=>{
        
        return sumBy(this.state.quotations,'grossForDisplay') + parseFloat(this.state.qbvArray.totalTaxesOnOtherCharges?this.state.qbvArray.totalTaxesOnOtherCharges:0);
    }
    calculateGrossAmount = () => {

    let list = this.state.quotations;


     let GrossAmount=0.0;
    let TotalGrossAmount=0.0;
    // let TotalGrossArray = [];

    if(this.state.qbvArray.otherChargeType==="header_level"){
        
            
      
        let headertotalotherAmt=0
        let taxmt1=0
        // headertaxamt= (Math.round(this.state.qbvArray.totalTaxesOnOtherCharges*100)/100).toLocaleString('en');
        headertotalotherAmt= this.state.qbvArray.otherCharges;
        let  headertotaltaxamt= this.state.qbvArray.totalTaxesOnOtherCharges;
        list.map((qbvLine)=>{
          
            GrossAmount= (Math.round((qbvLine.netRate + 0 + (parseFloat(qbvLine.netRate + 0) * (qbvLine.taxRate/100)))*100)/100)
        //    GrossAmount= (Math.round((qbvLine.netRate + qbvLine.otherChargeForDisplay + (parseFloat(qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)))*100)/100)
           taxmt1= Number(taxmt1) + Number(GrossAmount);
           TotalGrossAmount = Number(headertotalotherAmt) + Number(taxmt1) + Number(headertotaltaxamt);
        })
        
     // TotalGrossAmount = Number(headertaxamt) + Number(GrossAmount)
    }
      else{
     list.map((qbvLine) => {
     GrossAmount= (Math.round((qbvLine.netRate + qbvLine.otherChargeForDisplay + (parseFloat(qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)))*100)/100)
        //    TotalGrossArray.push(GrossAmount);
           TotalGrossAmount= Number(TotalGrossAmount) + Number(GrossAmount);
    })
}
    
    // let TotalArray = Object.keys(TotalGrossArray).map((key) => {
    //     return { display: TotalGrossArray[key], value: key }
    //  });

    //  TotalArray.map((display,i)=>{
    //     TotalGrossAmount= Number(TotalGrossAmount) + Number(display.display);
    // } )

    return (Math.round(TotalGrossAmount*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})
       // return getDecimalUpto(TotalGrossAmount,2);

     }


     calculateTotalTaxAmount=()=>{

        let list = this.state.quotations;
    
   
    let TaxAmount=0.0;
    let TotalTaxAmount=0.0;
    let otherCharges = 0;


    if(this.state.qbvArray.otherChargeType==="header_level"){
        
            
        
        let headertaxamt=0
        let taxmt1=0
        let taxesArray = [];
        //headertaxamt= (Math.round(this.state.qbvArray.totalTaxesOnOtherCharges*100)/100).toLocaleString('en');
        headertaxamt= this.state.qbvArray.totalTaxesOnOtherCharges;
        list.map((qbvLine)=>{

            TaxAmount= (getDecimalUpto(((qbvLine.netRate) * (qbvLine.taxRate/100)),2))
        
            taxmt1= Number(taxmt1) + Number(TaxAmount);

            // TaxAmount= (getDecimalUpto(((qbvLine.netRate + 0) * (qbvLine.taxRate/100)),2))

 // TaxAmount= (getDecimalUpto(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)),2))
            // taxmt1= Number(taxmt1) + Number(TaxAmount);
            // TotalTaxAmount = Number(headertaxamt) + Number(taxmt1)
        })

        TotalTaxAmount=Number(taxmt1)+ Number(headertaxamt);
        
    }else{
    
     list.map((qbvLine) => {
     TaxAmount= (getDecimalUpto(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)),2))
        
        TotalTaxAmount= Number(TotalTaxAmount) + Number(TaxAmount);
    })
}
          return (Math.round(TotalTaxAmount*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})
    //   return getDecimalUpto(TotalTaxAmount,2);
     }
     calculatetaxAmount=(netRate,otherChargeForDisplay,taxRate)=>{

        let taxamt=0
      
        if(this.state.qbvArray.otherChargeType==="header_level"){
            taxamt= (netRate + 0) * (taxRate/100);
        }else{
            taxamt= (netRate + otherChargeForDisplay) * (taxRate/100);

        }

           return (Math.round(taxamt*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})
     }

     calculategrossAmount=(netRate,otherChargeForDisplay,taxRate)=>{

        let grossamt=0
        let taxmt1=0
        if(this.state.qbvArray.otherChargeType==="header_level"){
            grossamt= (netRate + 0 + (parseFloat(netRate + 0) * (taxRate/100)));
        }else{
            grossamt=(netRate + otherChargeForDisplay + (parseFloat(netRate + otherChargeForDisplay) * (taxRate/100)));

        }

           return (Math.round(grossamt*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})
     }


    onClearDocuments = (i) => {
        
        commonSubmitWithParam(this.props, "removeAttachment", "/rest/deleteBidderAttachment", this.state.bidderDocumentsList[i].bidderAttachmentId);
        this.setState({ currentDocRemoveIndex: i, loadDocument:true });
        let bidderDocumentsList = this.state.bidderDocumentsList;
        bidderDocumentsList[i] = {
          ...bidderDocumentsList[i],
          bidderAttachmentId:"",
          attachment:{}
        }
        debugger
        this.setState({ bidderDocumentsList: bidderDocumentsList, loadDocument:false, loadBidderDocuments:false });
      }
      
      SingleValue = props => {
        return (
          
            <input
              type="select"
              value={props.data.value}
              onChange={this.onEditChange.bind(this)}
              onKeyDown={e => {
                if (e.target.value.length > 0) {
                  // important: this will allow the use of backspace in the input
                  e.stopPropagation();
                } else if (e.key === "Enter") {
                  // bonus: if value is empty, press enter to delete custom option
                  e.stopPropagation();
                  props.setValue(null);
                }
              }}
            />
          
        );
      };  

      todaysDate=()=>{

        var todaysDate = new Date(); 
        var year = todaysDate.getFullYear();     
        var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);                        
        var day = ("0" + todaysDate.getDate()).slice(-2);           
        var maxDate = (year +"-"+ month +"-"+ day); 
        return maxDate;
      }

     /* componentDidMount() {
        fetch(this.props.paymentTermsList)
          .then((response) => {
            return response.json();
          })
          .then(data => {
            let paymentTermsListArray = data.map(item => {
              return {value: item.paymentTermsList, display: item.paymentTermsList}
            });
            this.setState({
                paymentTermsList: paymentTermsListArray
            });
          }).catch(error => {
            console.log(error);
          });
      }*/
      

      
    render() {
        //  let enquiryId=62;
      const { fileName } = this.state;
      const today =this.todaysDate();
      var vendorOfferDate = new Date().toISOString().split('T')[0];
        // console.log("quotations-->",this.state.quotations)
        const attachmentId=this.state.attachmentId;
        const ExcelFileName=this.state.fileName;
        var isTcDocSec = this.state.qbvArray.isTC ? "display_block" : "display_none";
        console.log("value of qbv array of discount -->>",this.state.qbvArray.discountAmt)
          console.log(this.state.paymentTermsList)
          console.log("value of qbv array of discount Array -->>",this.props,)
        return (
            <>
            <FormWithConstraints  ref={formWithConstraints => this.quotationForm = formWithConstraints} 
               onSubmit={(e)=> { this.setState({loadPrChangeStatus:true}); commonSubmitForm(e,this,"submitQuotation","/rest/submitQuotation","quotationForm")}}>
             {/* <form onSubmit={(e)=>{{this.setState({loadPrChangeStatus:true}); this.props.changeLoaderState(true); commonSubmitForm(e,this,"submitQuotation","/rest/submitQuotation")}}}> */}
                <div className="card my-1">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">Enq No.</label>
                                <span className="display_block">
                                    {/* {console.log("quotation",this.state)} */}
                                    {this.state.qbvArray.enquiry?.enquiryId}
                                </span>
                            </div>
                            <div className="col-6 col-md-2 col-lg-2">
                                <label className="mr-4 label_12px">Enq End Date</label>
                                <span className="display_block">
                                    {formatDate(this.state.qbvArray.enquiry?.bidEndDate)}
                                </span>
                            </div>
                            <div className="col-6 col-md-2 col-lg-2">
                                <label className="mr-4 label_12px">Buyer</label>
                                <span className="display_block">
                                    {this.state.qbvArray.enquiry?.createdBy.userName + "(" + this.state.qbvArray.enquiry?.createdBy.name +")"}
                                </span>
                            </div>
                            {/* <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">Priority</label>
                                <span className="display_block">
                                    {this.state.qbvArray.priority}
                                </span>
                            </div> */}
                            <div className="col-6 col-md-1 col-lg-1">
                                <label className="mr-4 label_12px">Bid Status</label>
                                <span className="display_block">
                                    {this.state.qbvArray.status}
                                </span>
                            </div>
                            {/* {this.props.role===ROLE_NEGOTIATOR_ADMIN ? */}
                            {(this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN) ?
                            <div className="col-6 col-md-2 col-lg-2">
                                <label className="mr-4 label_12px">Other Charges</label>
                                <select className={"form-control " + this.props.readonly} 
                               //defaultValue={this.state.qbvArray.otherChargeType}
                               value={this.state.qbvArray.otherChargeType}
                                onChange={(e) => this.calculateFrLineItem(e,null,'otherChargeType','quotationForm')}
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
                            </div>:
                            <div className="col-6 col-md-2 col-lg-2">
                            <label className="mr-4 label_12px">Other Charges</label>
                            <select className={"form-control " + this.props.readonly} 
                            //defaultValue={this.state.qbvArray.otherChargeType}
                               value={this.state.qbvArray.otherChargeType}
                           // onChange={(e) => this.calculateFrLineItem(e,null,'otherChargeType','quotationForm')}
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
                        </div>}
                            <div className="col-6 col-md-2 col-lg-2">
                                <label className="mr-6 label_12px">Vendor Name</label>
                                <span className="display_block">
                                    {this.state.qbvArray.partner===null?"":this.state.qbvArray.partner.name}
                                </span>
                            </div>
                            <div className="col-6 col-sm-2 col-md-2">
                                <label className="mr-6 label_12px">Vendor Offer No</label>
                                <input type="text" value={this.state.qbvArray.vendorOfferNo} 
                                className={"col-12 form-control "}  onKeyDown={this.controlSubmit} onChange={(event) => {
                                    commonHandleChange(event, this, "qbvArray.vendorOfferNo");
                                }}/>
                            </div>
                            <div className="col-6 col-md-2 col-lg-2">
                            <label className="mr-5 label_12px">Vendor Offer Date</label>
                             <input type="date" 
                             min={disablePastDate()}
                             max={vendorOfferDate}
                              onKeyDown={this.controlSubmit} value={this.state.qbvArray.vendorOfferDate} 
                             className={"col-12 form-control "} onChange={(e) => {commonHandleChange(e, this, "qbvArray.vendorOfferDate","quotationForm");
                                                                                }} />
                            </div>
                         
                            <div className="col-6 col-md-3 col-lg-3 d-flex justify-content-between">
                                {/* <div>
                                    <label className="mr-4 label_12px">Techno/Comm</label>
                                    <input type="checkbox" 
                                    // name="isTCQuotation" 
                                    value="Y" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.qbvArray.isTC} 
                                    onChange={(e) => { commonHandleChangeCheckBox(e, this, "qbvArray.isTC") }} 
                                    />
                                </div>
                                <div>
                                    <label className="mr-4 label_12px">Accept</label>
                                    <input type="checkbox" 
                                    // name="accept" 
                                    value="Y" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.qbvArray.accept} 
                                    onChange={(e) => { commonHandleChangeCheckBox(e, this, "prDetails.accept") }} 
                                    />
                                </div> */}
                                   {/* <div className="col-4">
                                    <button type="button" className="btn btn-sm btn-outline-primary mr-2 mgt-10"><i className="fa fa-download" />&nbsp;Download</button>
                                </div> */}

                                {/* <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <a href={API_BASE_URL+"/rest/exportExcel/"+this.state.negoBidderId} className="btn btn-primary" style={{fontSize:8}}>Export Excel</a>
                                        </div> */}
                                       {/* {this.props.role!==ROLE_NEGOTIATOR_ADMIN && this.props.prDetails.uploadExcelFile!=='Y'? */}
                                       {(this.state.qbvArray.otherChargeType === "item_level" && this.props.prDetails.uploadExcelFile!=='Y' && this.state.qbvArray.status==="DR")?
                                <div className="col-6">
                                   
                                <button type="button" onClick={this.downloadexcelApi} className="btn btn-primary" ><i className="fa fa-download" />&nbsp;Download Excel</button>
                                <span><a href={API_BASE_URL + "/rest/download/" + attachmentId}>{ExcelFileName}</a></span>
                                </div>:""
                                    }
                                    
                                    

                                   {/* {this.props.role!==ROLE_NEGOTIATOR_ADMIN && this.props.prDetails.uploadExcelFile!=='Y'? */}
                                   {(this.state.qbvArray.otherChargeType === "item_level" && this.props.prDetails.uploadExcelFile!=='Y' && this.state.qbvArray.status==="DR")?
                                <div>
                                     <label>Upload Excel File</label>
                                <input type="file" name="file" onChange= {(e) => { this.changeHandler(e) }}></input>
                                {/* <label htmlFor="file">{fileName}</label> */}
                               {/*{this.changeHandler}*/ }
                                  {/* <button type="button" onClick={this.downloadexcelApi} className="btn btn-primary">Upload Excel</button>*/}
                                   
                                   </div>:""}
                            </div>
                        </div>
                        {
                            this.state.qbvArray.status==="RJCT"?
                            <div className="row px-4 py-2">
                                <div className="col-12">
                                    <p className="text-danger">Reason For Rejection: <span>{this.state.qbvArray.remark}</span></p>
                                </div>
                            </div>
                            :<></>
                        }
                    </div>
                </div>
                <div className="card my-1">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-1">
                            <div className="col-sm-12 mt-2">
                                <div>
                                    <TableContainer>
                                    {/* <table className="table table-bordered table-header-fixed"> */}
                                        <table className="my-table">
                                            <thead>
                                                <tr>
                                                <th>Serial No</th>
                                                    {/* <th className="w-6per"> Line No.</th> */}
                                                    {/* <th className="w-40per"> Material Code & Description </th> */}
                                                    <th className="w-40per"> Description & Material Code </th>
                                                    <th className="text-right w-10per"> Qty / UOM </th>
                                                    <th className="w-10per">Plant</th>
                                                    {/*<th className="w-10per"> Required Date </th>*/}
                                                    <th className="text-right w-8per">Rate(RS)</th>
                                                    <th className="text-right w-8per">Basic</th>
                                                    <th className="text-right w-8per">Other Chrg</th>
                                                    <th className="w-10per"> Taxes </th>
                                                    <th className="w-10per"> Gross(RS) </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                                {this.state.quotations.map((qbvLine,i) =>{
                                                    // console.log("quatation tab",this.state.quatations);
                                                    // console.log("quatation tab qbv line",qbvLine.itemBid.quantity);
                                                    console.log("quatation tab qbv line",qbvLine.discountType);
                                                    // console.log("quatation tab ",i);


                                                return (<> 
                                                <tr class="accordion-toggle" >
                                                    <td class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i} title="Click Here!">&nbsp;{i+1}</td>
                                                    {/* <td className="w-6per"> {qbvLine.lineNo}</td> */}
                                                    <td className="w-40per" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i} title="Click Here!"> {qbvLine.materialDesc+" ("+qbvLine.materialCode+")"} </td>
                                                    <td className="text-right w-10per"> {qbvLine.itemBid.quantity + " (" + qbvLine.uom + ")"} </td>
                                                    <td className="w-10per">{qbvLine.plant + "-" + qbvLine.plantDESC}</td>
                                                   {/* <td className="w-10per"> {qbvLine.requiredDate} </td>*/}
                                                   {/* <td className="text-right w-8per"> {qbvLine.exGroupPriceRate}</td> */}
                                                 {/* <td>{getDecimalUpto(qbvLine.netRate/qbvLine.itemBid.quantity,2)}</td> */}
                                                 <td>{(Math.round((qbvLine.netRate/qbvLine.itemBid.quantity)*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                                                 <td className="text-right w-8per">{(Math.round((qbvLine.netRate)*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                                                    {/* <td className="text-right w-8per">{getDecimalUpto(qbvLine.netRate,2)}</td> */}
                                                    {/* <td className="text-right w-8per">{qbvLine.otherChargeForDisplay}</td> */}
                                                    {/* <td className="text-right w-8per">{getDecimalUpto(qbvLine.otherChargeForDisplay,2)}</td> */}
                                                    {/* <td className="w-10per">{getDecimalUpto(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)),2)}</td> */}
                                                    <td className="text-right w-8per">{this.state.qbvArray.otherChargeType==="item_level"?(Math.round(qbvLine.otherChargeForDisplay*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2}):0.00}</td>
                                                    {/* <td className="w-10per">{(Math.round(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100))*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</td> */}
                                                    <td>{this.calculatetaxAmount(qbvLine.netRate,qbvLine.otherChargeForDisplay,qbvLine.taxRate)}</td>
                                                    {/* <td className="w-10per">{(Math.round(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100))*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</td> */}
                                                    {/* <td className="w-10per">{getDecimalUpto(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)),2)}</td> */}
                                                    {/* <td className="w-10per"> {getDecimalUpto(qbvLine.taxesForDisplay,2)} </td> */}
                                                    {/* <td className="w-10per"> {(Math.round(qbvLine.grossForDisplay*100)/100).toLocaleString('en') } </td> */}
                                                    {/* <td className="w-10per" > {(Math.round((qbvLine.netRate + qbvLine.otherChargeForDisplay + (parseFloat(qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)))*100)/100).toLocaleString('en',{minimumFractionDigits:2}) } </td> */}
                                                    <td>{this.calculategrossAmount(qbvLine.netRate,qbvLine.otherChargeForDisplay,qbvLine.taxRate)}</td>
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
                                                                               // value={qbvLine.description}
                                                                               value={qbvLine.description!=null && qbvLine.materialPOText!=null ?qbvLine.description+" - "+qbvLine.materialPOText:qbvLine.description===null?qbvLine.materialPOText:qbvLine.materialPOText===null?qbvLine.description:""}
                                                                                name={"quotations["+i+"][description]"}
                                                                                // onChange={(event) => {
                                                                                //     commonHandleChange(event, this, "quotations."+i+".description");
                                                                                // }}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="mr-1 label_12px">Vendor Text</label>
                                                                            <textarea
                                                                                className={"h-100px form-control "}
                                                                                value={qbvLine.vendorText}
                                                                               
                                                                                name={"quotations["+i+"][vendorText]"}
                                                                                onChange={(event) => {
                                                                                    commonHandleChange(event, this, "quotations."+i+".vendorText");
                                                                                }}
                                                                                
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-4 col-lg-4">
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Delivery Date</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="date" 
                                                                                //min={disablePastDate()}
                                                                                max="9999-12-31"
                                                                                className={"col-4 form-control "}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                                value={qbvLine.deliveryDate}
                                                                                name={"quotations["+i+"][deliveryDate]"}
                                                                                onChange={(e) => {
                                                                                    commonHandleChange(e, this, "quotations."+i+".deliveryDate","quotationForm");
                                                                                }}
                                                                                
                                                                            />
                                                                            {/* <input
                                                                                type="text"
                                                                                value={qbvLine.deliveryDate}
                                                                                className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][deliveryDate]"}
                                                                                onChange={(event) => {
                                                                                    commonHandleChange(event, this, "quotations."+i+".deliveryDate","quotationForm");
                                                                                  }}
                                                                            /> */}
                                                                            <div className="offset-7 col-5">
                                                                                <FieldFeedbacks for={"quotations["+i+"][deliveryDate]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Rate(RS)</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.exGroupPriceRate}
                                                                                className={"col-4 form-control "}
                                                                                onKeyDown={this.controlSubmit}
                                                                             //   className={"col-4 form-control " + this.props.readonly}
                                                                                name={"quotations["+i+"][exGroupPriceRate]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event, i,'exGroupPriceRate','quotationForm');
                                                                                  }}
                                                                           
                                                                            />
                                                                            {/* <div className="offset-7 col-5">
                                                                                <FieldFeedbacks for={"quotations["+i+"][exGroupPriceRate]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div> */}
                                                                        </div>


                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Discount</span>
                                                                            {/* { qbvLine.discountCharge!="" || qbvLine.discountCharge!=0?
                                                                            <select
                                                                            required={false}
                                                                                value={qbvLine.discountType}
                                                                                name={"quotations["+i+"][discountType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateDiscountAmount(event,i,'discountType','quotationForm')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".packingFwdChargeType");
                                                                                  }}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                              className={"col-4 form-control "}
                                                                             
                                                                            >
                                                                               
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>: */}
                                                                            <select
                                                                              // required={false}
                                                                                value={qbvLine.discountType}
                                                                                name={"quotations["+i+"][discountType]"}
                                                                                onKeyDown={this.controlSubmit}
                                                                                onChange={(event) => {
                                                                                    this.calculateDiscountAmount(event,i,'discountType','quotationForm')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".packingFwdChargeType");
                                                                                  }}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                              className={"col-4 form-control "}
                                                                             
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            {/* } */}
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.discountCharge}
                                                                                onKeyDown={this.controlSubmit}
                                                                               // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][discountCharge]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateDiscountAmount(e,i,"discountCharge","quotationForm")
                                                                                  }}
                                                                                 
                                                                            />
                                                                        <input name={"quotations["+i+"][perQtyDiscount]"} value={qbvLine.perQtyDiscount} type="hidden" />
                                                                            <div className="offset-7 col-5">    
                                                                                <FieldFeedbacks for={"quotations["+i+"][discountCharge]"}>
                                                                                   {/* <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>*/}
                                                                                </FieldFeedbacks>
                                                                            </div>
                                                                        </div>

                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Net Value</span>
                                                                            <span className="col-4"></span>
                                                                            <span className="col-4">{(Math.round(qbvLine.netRate/qbvLine.itemBid.quantity*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
                                                                            {/* <span className="col-4">{getDecimalUpto(qbvLine.netRate/qbvLine.itemBid.quantity,2)}</span> */}
                                                                        </div>

                                                                        { this.state.qbvArray.otherChargeType == 'item_level' &&
                                                                        <React.Fragment>
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Freight</span>
                                                                            {/* {qbvLine.freightChargeRate!="" && qbvLine.freightChargeRate!=0?
                                                                            <select
                                                                            required={true}
                                                                                value={qbvLine.freightChargesType}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][freightChargesType]"}
                                                                                onChange={e => {  this.calculateFrLineItem(e,i,"freightChargesType","quotationForm")
                                                                                    // commonHandleChange(event, this, "quotations."+i+".freightChargesType");
                                                                                  }}
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            : */}
                                                                            
                                                                            <select
                                                                            required={false}
                                                                                value={qbvLine.freightChargesType}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][freightChargesType]"}
                                                                                onChange={e => {  this.calculateFrLineItem(e,i,"freightChargesType","quotationForm")
                                                                                    // commonHandleChange(event, this, "quotations."+i+".freightChargesType");
                                                                                  }}
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            {/* } */}
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.freightChargeRate}
                                                                                onKeyDown={this.controlSubmit}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                              className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][freightChargeRate]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"freightChargeRate","quotationForm")
                                                                                  }}
                                                                                  
                                                                            />
                                                                        <input name={"quotations["+i+"][perQtyFreightAmt]"} value={qbvLine.perQtyFreightAmt} type="hidden" />
                                                                            <div className="offset-7 col-5">
                                                                                <FieldFeedbacks for={"quotations["+i+"][freightChargeRate]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div>
                                                                        </div>



                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Packing & Fwd</span>
                                                                            {/* {qbvLine.packingFwdCharge!="" && qbvLine.packingFwdCharge!=0?
                                                                            <select
                                                                             required={true}
                                                                                value={qbvLine.packingFwdChargeType}
                                                                                name={"quotations["+i+"][packingFwdChargeType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,'packingFwdChargeType','quotationForm')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".packingFwdChargeType");
                                                                                  }}
                                                                            //className={"col-4 form-control " + this.props.readonly}
                                                                            className={"col-4 form-control "}
                                                                              
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            : */}
                                                                            <select
                                                                                required={false}
                                                                                value={qbvLine.packingFwdChargeType}
                                                                                name={"quotations["+i+"][packingFwdChargeType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,'packingFwdChargeType','quotationForm')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".packingFwdChargeType");
                                                                                  }}
                                                                            //className={"col-4 form-control " + this.props.readonly}
                                                                            className={"col-4 form-control "}
                                                                              
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            {/* } */}
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.packingFwdCharge}
                                                                                onKeyDown={this.controlSubmit}
                                                                             //className={"col-4 form-control " + this.props.readonly}
                                                                             className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][packingFwdCharge]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"packingFwdCharge","quotationForm")
                                                                                  }}
                                                                                  
                                                                            />
                                                                        <input name={"quotations["+i+"][perQtyPKAmt]"} value={qbvLine.perQtyPKAmt} type="hidden" />
                                                                            <div className="offset-7 col-5">    
                                                                                <FieldFeedbacks for={"quotations["+i+"][packingFwdCharge]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div>
                                                                        </div>

                                                                        
                                                                        <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Other Charges</span>
                                                                            {/* {qbvLine.otherChargesRate!="" && qbvLine.otherChargesRate!=0?
                                                                            <select
                                                                            required={true}
                                                                                value={qbvLine.otherChargesType}
                                                                                name={"quotations["+i+"][otherChargesType]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,'otherChargesType','quotationForm')
                                                                                    // commonHandleChange(event, this, "quotations."+i+".otherChargesType");
                                                                                  }}
                                                                               //className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-4 form-control "}
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.chargesType.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}

                                                                            </select>: */}
                                                                                                            <select
                                                                                                            required={false}
                                                                                                            value={qbvLine.otherChargesType}
                                                                                                            name={"quotations["+i+"][otherChargesType]"}
                                                                                                            onChange={(event) => {
                                                                                                                this.calculateFrLineItem(event,i,'otherChargesType','quotationForm')
                                                                                                                // commonHandleChange(event, this, "quotations."+i+".otherChargesType");
                                                                                                              }}
                                                                                                           //className={"col-4 form-control " + this.props.readonly}
                                                                                                           className={"col-4 form-control "}
                                                                                                            
                                                                                                        >
                                                                                                            <option value="">Select</option>
                                                                                                            {this.state.chargesType.map(records =>
                                                                                                                <option value={records.value}>{records.display}</option>
                                                                                                            )}
                            
                                                                                                        </select>
                                                                                                        {/* } */}
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.otherChargesRate}
                                                                                onKeyDown={this.controlSubmit}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                              className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][otherChargesRate]"}
                                                                                onChange={(e) => {
                                                                                    this.calculateFrLineItem(e,i,"otherChargesRate","quotationForm")
                                                                                  }}
                                                                              
                                                                            />
                                                                        <input name={"quotations["+i+"][perQtyOtherAmt]"} value={qbvLine.perQtyOtherAmt} type="hidden" />
                                                                            <div className="offset-7 col-5">
                                                                                <FieldFeedbacks for={"quotations["+i+"][otherChargesRate]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div>
                                                                        </div>
                                                                        </React.Fragment>
                                                                        }
                                                                        {/* <input name={"quotations["+i+"][totalFreightCharge]"} value={qbvLine.totalFreightCharge} type="hidden" /> */}
                                                                        <input name={"quotations["+i+"][totalFreightCharge]"} value={qbvLine.totalFreightChargeAmt} type="hidden" />
                                                                        <input name={"quotations["+i+"][totalPackingFwdChargeAmt]"} value={qbvLine.totalPackingFwdChargeAmt} type="hidden" />
                                                                        <input name={"quotations["+i+"][otherChargesAmt]"} value={qbvLine.otherChargesAmt} type="hidden" />
                                                                        <input name={"quotations["+i+"][netRate]"} value={qbvLine.netRate ? qbvLine.netRate:qbvLine.basicAmount} type="hidden" />
                                                                        <input name={"quotations["+i+"][taxAmount]"} value={getDecimalUpto(((qbvLine.netRate + qbvLine.otherChargeForDisplay) * (qbvLine.taxRate/100)),2)} type="hidden" />
                                                                        {/* <input name={"quotations["+i+"][taxAmount]"} value={qbvLine.taxesForDisplay} type="hidden" /> */}
                                                                        <input name={"quotations["+i+"][completeOther]"} value={qbvLine.otherChargeForDisplay} type="hidden" />
                                                                        <input name={"quotations["+i+"][priceBidId]"} value={qbvLine.priceBidId} disabled={isEmpty(qbvLine.priceBidId)} type="hidden" />
                                                                        <input name={"quotations["+i+"][itemBid][itemBidId]"} value={qbvLine.itemBid.itemBidId} type="hidden" />
                                                                         <div class="row mb-1 p-0">
                                                                            <span className="col-4 text-right">Taxes(%)</span>
                                                                            <span className="col-4"></span>
                                                                            <input
                                                                                type="text"
                                                                                value={qbvLine.taxRate}
                                                                                onKeyDown={this.controlSubmit}
                                                                               // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-4 form-control "}
                                                                                name={"quotations["+i+"][taxRate]"}
                                                                                onChange={(event) => {
                                                                                    this.calculateFrLineItem(event,i,"taxRate","quotationForm")
                                                                                    // changeTaxes(event, this, "quotations."+i+".taxRate");
                                                                                  }}
                                                                            />
                                                                            {/* <div className="offset-7 col-5">    
                                                                                <FieldFeedbacks for={"quotations["+i+"][taxRate]"}>
                                                                                    <FieldFeedback when="*"></FieldFeedback>
                                                                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                                                </FieldFeedbacks>
                                                                            </div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </>)}
                                                )}
                                            </tbody>
                                        </table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card my-1 pb-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-6 col-md-3 col-lg-3">
                                {/* <label className="mr-4 label_12px">Basic Amount</label> */}
                                <label className="mr-4 label_12px">Amount</label>
                                <span className="display_block">
                                {/* {(Math.round(this.state.qbvArray.basicAmt*100)/100).toLocaleString('en')} */}
                                    {(Math.round(this.state.qbvArray.basicAmt*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}
                                </span>
                            </div>

                            <input name={"bidder[bidderId]"} value={this.state.qbvArray.bidderId} type="hidden" />
                            <input name={"bidder[basicAmt]"} value={this.state.qbvArray.basicAmt} type="hidden" />
                            <input name={"bidder[otherChargeType]"} value={this.state.qbvArray.otherChargeType} type="hidden" />
                            <input name={"bidder[otherCharge]"} value={this.state.qbvArray.otherCharges} type="hidden" />
                            {/* <input name={"bidder[taxAmt]"} value={this.state.qbvArray.taxAmt} type="hidden" /> */}
                            <input name={"bidder[taxAmt]"} value={this.calculateTotalTaxAmount()} type="hidden" />
                            <input name={"bidder[grossAmt]"} value={this.calculateGrossAmount()} type="hidden" />
                            {/* <input name={"bidder[grossAmt]"} value={this.getGrossAmount()} type="hidden" /> */}
                            {/* <input name={"bidder[totalFreight]"} value={this.state.qbvArray.totalFreightCharge} type="hidden" />
                            <input name={"bidder[totalPKFWD]"} value={this.state.qbvArray.totalPackingCharge} type="hidden" />
                            <input name={"bidder[otherRates]"} value={this.state.qbvArray.totalOtherCharge} type="hidden" /> */}
                            <input name={"bidder[totalFreight]"} value={this.state.qbvArray.totalFreightCharge!=""?this.state.qbvArray.totalFreightCharge:0} type="hidden" />
                            <input name={"bidder[totalPKFWD]"} value={this.state.qbvArray.totalPackingCharge!=""?this.state.qbvArray.totalPackingCharge:0} type="hidden" />
                            <input name={"bidder[otherRates]"} value={this.state.qbvArray.totalOtherCharge!=""?this.state.qbvArray.totalOtherCharge:0} type="hidden" />
                            <input name={"bidder[uploadExcelFile]"} value={this.props.prDetails.uploadExcelFile} type="hidden" />
                            <input name={"bidder[vendorOfferNo]"} value={this.state.qbvArray.vendorOfferNo} type="hidden" />
                            <input name={"bidder[vendorOfferDate]"} value={this.state.qbvArray.vendorOfferDate} type="hidden" />
                            <input name={"bidder[headerFreightType]"} value={this.state.qbvArray.totalFreightChargeType} type="hidden" />
                            <input name={"bidder[headerPKFWDType]"} value={this.state.qbvArray.totalPackingChargeType} type="hidden" />
                            <input name={"bidder[headerOtherType]"} value={this.state.qbvArray.totalOtherChargeType} type="hidden" />
                            <input name={"bidder[totalFreightChargeAmt]"} value={this.state.qbvArray.totalFreightChargeAmt} type="hidden" />
                            <input name={"bidder[totalPackingChargeAmt]"} value={this.state.qbvArray.totalPackingChargeAmt} type="hidden" />
                            <input name={"bidder[totalOtherChargeAmt]"} value={this.state.qbvArray.totalOtherChargeAmt} type="hidden" />


                            { this.state.qbvArray.otherChargeType == 'header_level' ? 
                                        <>
                            <div className="col-6 col-md-3 col-lg-3">
                                <div className="form-group">
                                    <label className="mr-1 label_12px">Freight</label>
                                    <select
                                                                            required={false}
                                                                                value={this.state.qbvArray.totalFreightChargeType}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-5 form-control "}
                                                                                //  name={"HeaderfreightChargesType"}
                                                                                onChange={(e) => {
                                                                                //    this.NewhandleChange(e)
                                                                                  this.calculateHeaderTotalChanges(e, "totalFreightChargeType", "quotationForm");
                                                                                }}
                                                                                
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.headerchargesTypes.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            &nbsp;
                                   
                                            <input
                                                //type="text"
                                                type="number"
                                              // placeholder="0"
                                                className={"form-control " + this.state.prLineReadOnly}
                                                onKeyDown={this.controlSubmit}
                                               // required
                                                // name={"qbvarray.totalFreight"}
                                                value={this.state.qbvArray.totalFreightCharge}
                                                onChange={(event) => {
                                                    // this.calculateTotalChanges(event, "totalFreightCharge", "quotationForm");
                                                    this.calculateHeaderTotalChanges(event, "totalFreightCharge", "quotationForm");
                                                }}
                                            />
                                   
                                </div>
                                {/* <FieldFeedbacks for="qbvarray.totalFreight">
                                    <FieldFeedback when="*"></FieldFeedback>
                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                </FieldFeedbacks> */}
                            </div>

                            <div className="col-6 col-md-3 col-lg-3">
                                <div className="form-group">
                                    <label className="mr-1 label_12px">Packing & Fwd</label>
                                    <select
                                                                            required={false}
                                                                                value={this.state.qbvArray.totalPackingChargeType}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-5 form-control "}
                                                                                //  name={"HeaderPackingChargesType"}
                                                                                onChange={(e) => {
                                                                                //    this.NewhandleChange(e)
                                                                                  this.calculateHeaderTotalChanges(e, "totalPackingChargeType", "quotationForm");
                                                                                }}
                                                                                
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.headerchargesTypes.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            &nbsp;
                                    <input
                                        //type="text"
                                        type="number"
                                       // placeholder="0"
                                        className={"form-control " + this.state.prLineReadOnly}
                                        onKeyDown={this.controlSubmit}
                                     //   required
                                        // name={"qbvarray.totalPKFWD"}
                                        value={this.state.qbvArray.totalPackingCharge}
                                        onChange={(event) => {
                                            // this.calculateTotalChanges(event, "totalPackingCharge", "quotationForm");
                                            this.calculateHeaderTotalChanges(event, "totalPackingCharge", "quotationForm");
                                        }}
                                    />
                                </div>
                                {/* <FieldFeedbacks for="qbvarray.totalPKFWD">
                                    <FieldFeedback when="*"></FieldFeedback>
                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                </FieldFeedbacks> */}
                            </div>


                            <div className="col-6 col-md-3 col-lg-3">
                                <div className="form-group">
                                    <label className="mr-1 label_12px">Other Charges</label>
                                    <select
                                                                            required={false}
                                                                                value={this.state.qbvArray.totalOtherChargeType}
                                                                              // className={"col-4 form-control " + this.props.readonly}
                                                                               className={"col-5 form-control "}
                                                                                //  name={"HeaderOtherChargesType"}
                                                                                onChange={(e) => {
                                                                                //    this.NewhandleChange(e)
                                                                                  this.calculateHeaderTotalChanges(e, "totalOtherChargeType", "quotationForm");
                                                                                }}
                                                                                
                                                                                
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {this.state.headerchargesTypes.map(records =>
                                                                                    <option value={records.value}>{records.display}</option>
                                                                                )}
                                                                            </select>
                                                                            &nbsp;
                                            <input
                                                //type="text"
                                                type="number"
                                              // placeholder="0"
                                                className={"form-control " + this.state.prLineReadOnly}
                                                onKeyDown={this.controlSubmit}
                                              //  required
                                                // name={"qbvarray.otherRates"}
                                                value={this.state.qbvArray.totalOtherCharge}
                                                onChange={(event) => {
                                                //   this.calculateTotalChanges(event, "totalOtherCharge", "quotationForm");
                                                 this.calculateHeaderTotalChanges(event, "totalOtherCharge", "quotationForm");
                                                }}
                                            />
                                   
                                </div>
                                {/* <FieldFeedbacks for="qbvarray.otherRates">
                                    <FieldFeedback when="*"></FieldFeedback>
                                    <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                </FieldFeedbacks> */}
                            </div>
                            </>
                            :null
    }

<div className="col-6 col-md-3 col-lg-3">
                                {/* <label className="mr-4 label_12px">Discount Amount</label> */}
                                <label className="mr-4 label_12px">Amount After Discount</label>
                                <span className="display_block">
                                {/* {getDecimalUpto(this.state.qbvArray.totalDiscount,2)} */}
                                    {(Math.round(this.state.qbvArray.totalDiscount*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}
                                </span>
                            </div>

                            <div className="col-6 col-md-3 col-lg-3">
                                <div className="form-group">
                                    <label className="mr-1 label_12px">Total Other Charges</label>

                                    {/* <h6>{(Math.round(this.state.qbvArray.otherCharges*100)/100).toLocaleString('en',{minimumFractionDigits:2})}</h6> */}
                                    <div><span>{(Math.round(this.state.qbvArray.otherCharges*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
                                    

                                    {/* {
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

                                    } */}
                                    
                                   
                                </div>
                            </div>
                            { this.state.qbvArray.otherChargeType==="header_level"? 
                            <div className="col-6 col-md-3 col-lg-3">
                                {/* <label className="mr-4 label_12px">Taxes on Other Charges</label> */}
                                <label className="mr-4 label_12px">Tax Amount on Other Charges</label>
                                <span className="display_block">
                              { (Math.round(this.state.qbvArray.totalTaxesOnOtherCharges*100)/100).toLocaleString('en')}
                                   {/* {this.state.qbvArray.otherChargeType==="item_level"?0.00: (Math.round(this.state.qbvArray.totalTaxesOnOtherCharges*100)/100).toLocaleString('en')} */}
                                </span>
                            </div>:""}

                            <input type="hidden" name="bidder[otherTaxAmt]" value={this.state.qbvArray.totalTaxesOnOtherCharges}/>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Total Tax Amount</label>
                                <span className="display_block">
                                {this.calculateTotalTaxAmount()}
                                {/* {(Math.round(this.state.qbvArray.taxAmt*100)/100).toLocaleString('en')} */}
                                </span>
                            </div>


                            <div className="col-6 col-md-3 col-lg-3">
                                <label className="mr-4 label_12px">Gross Amount</label>
                                <span className="display_block">
                            {this.calculateGrossAmount()}
                                    
                                    {/* {(Math.round(this.getGrossAmount()*100)/100).toLocaleString('en')} */}
                                </span>
                              
                            </div>
                            <div className="lineItemDiv min-height-0px" >
                            <div className="row px-4 py-4">
                            {/* <div className="col-2 col-md-4 col-lg-6"> */}
                            <div className="col-6 col-md-3 col-lg-3">
                                {/* <label className="mr-1 label_12px">Payment Terms</label> */}
                                <label className="mr-1 label_12px">Quoted Payment Terms</label>
                                
                                <textarea className={"h-100px form-control"}  defaultValue={this.state.qbvArray.paymentTerms}
                                         name={"bidder[paymentTerms]"} />
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                            <label className="mr-4 label_12px">Inco Terms<span className="redspan">*</span></label>
                           
                            <div >
                                     <select class="form-control" name="bidder[incoTerms]" onChange={(event)=>{commonHandleChange(event,this,"qbvArray.incoTerms", "quotationForm")}} value={this.state.qbvArray.incoTerms} >
                                       
                                       <option value="">Select</option>
                                       {(Object.entries(this.state.incoTermsList)).map(inco =>
                                                               <option value={inco[0]}>{inco[1]}</option>
                                                            )}
                                      
                              
                                </select>
                                <br/>
                                <label className="mr-4 label_12px">Inco Description <span className="redspan">*</span></label>
                                <input
                    class="form-control"
                    name="bidder[vendorIncoDescription]"
                    value={this.state.qbvArray.vendorIncoDescription}
                    onChange={(event)=>{
   
                      commonHandleChange(event,this,"qbvArray.vendorIncoDescription", "quotationForm");
                    }}
                  />

                            </div>
                           </div>
                            {/* {this.props.role===ROLE_NEGOTIATOR_ADMIN && this.state.qbvArray.status!=="APPR"?<> */}
                            {/* {this.props.role===ROLE_NEGOTIATOR_ADMIN && (this.state.qbvArray.status==="SBMT" || this.state.qbvArray.status==="APPR")?<> */}
                            {(this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN) && (this.state.qbvArray.status==="SBMT" || this.state.qbvArray.status==="APPR")?<>
                            <div className="col-6 col-md-3 col-lg-3">
                          
                            {/* <label className="mr-4 label_12px">Quoted Payment Terms <span className="redspan">*</span></label> */}
                            <label className="mr-4 label_12px">Payment Terms<span className="redspan">*</span></label>
                           
                            <div >
                                {/*<select class="form-control" value={this.state.qbvArray.negotiatorPaymentTerms} name="bidder[negotiatorPaymentTerms]" 
                                    required={true}>*/}
                                     <select class="form-control" name="bidder[negotiatorPaymentTerms]" onChange={(event)=>{commonHandleChange(event,this,"qbvArray.negotiatorPaymentTerms", "quotationForm")}} value={this.state.qbvArray.negotiatorPaymentTerms}  required>
                                       
                                       <option value="">Select</option>
                                       {(Object.entries(this.state.paymentTermsList)).map(payment =>
                                                               <option value={payment[0]}>{payment[1]}</option>
                                                            )}
                                       {/*(this.state.paymentTermsList).map((item)=>{
                        <option value={item.value}>{item.display}</option>
                     } )*/};
                       
                              
                                </select>
                                {console.log(this.state.qbvArray.negotiatorPaymentTerms)}
                                 <FieldFeedbacks for="bidder[negotiatorPaymentTerms]">
                                 <FieldFeedback when="*"></FieldFeedback>
                                </FieldFeedbacks>

                            </div>
                            </div>
                           
                            
                 <div className="col-8 col-md-4 col-lg-6">
                  <div className="row mt-4 px-4 py-4">
                  <label className="mr-4 label_12px">Validity Date<span className="redspan">*</span></label>
               
                    <input type="date"  className={"col-3 form-control "}  name="bidder[validityDateFrom]"
                     value={this.state.qbvArray.validityDateFrom} 
                     max="9999-12-31"
                     min={disablePastDate()}
                     onChange={(event)=>{commonHandleChange(event,this,"qbvArray.validityDateFrom", "quotationForm")}}/>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    
                    <label>To </label>
                    <div className="col-sm-6">
                    <input type="date" name="bidder[validityDateTo]" className={"col-8 form-control "}   
                    max="9999-12-31" 
                    value={this.state.qbvArray.validityDateTo}
                     onChange={(event)=>{commonHandleChange(event,this,"qbvArray.validityDateTo", "quotationForm")}}/>
                    </div>
                    </div>
                    </div></>:<></>} 
                            </div>
                            
                            </div>
                        </div>
                        
                        <div className="row px-4 py-0">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-sm btn-outline-info mr-2" onClick={() => this.props.loadContainer()} > <i className="fa fa-arrow-left"></i> </button>
                                    {/* {this.props.role===ROLE_NEGOTIATOR_ADMIN */}
                                    {(this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN)
                                    ? <>
                                    {/* {this.state.qbvArray.enquiry?.code!="close"?
                                            <button type="button" onClick={(e)=>{this.props.handleReadOnly(!this.props.readonly)} } className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;{this.props.readonly?"Enable":"Disable"} Editing</button>
                                    :null} */}
                                       {/* {this.props.readonly && this.state.qbvArray.status==="SBMT"? */}
                                       {this.state.qbvArray.status==="SBMT"?
                                        <>
                                            {/* <button type="button" onClick={(e) =>{this.handleApproveQuotation(e)}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button> */}
                                            <button type="button"  onClick={(e) =>{commonSubmitFormNoValidation(e,this,"approveQuotation","/rest/approveQuotation","quotationForm")}} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                                            <button type="button" data-toggle="modal" data-target="#reasonModal" className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times" />&nbsp;Reject</button>
                                        </>
                                            :""}

                                            {this.state.qbvArray.status==="APPR" && this.state.qbvArray.saprfqNo===null?
                                             <button type="button" onClick={this.generateRFQfromSAP} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" /> Generate RFQ</button>:""}

                                {this.state.qbvArray.status!="DR" && this.state.qbvArray.status==="APPR" && this.state.qbvArray.enquiry?.isMailsentFinalApproval!="Y" && this.state.qbvArray.enquiry?.firstLevelApprovalStatus!="REJECTED" && this.state.qbvArray.saprfqNo!=null?
                                        <>
                                            {/* <button type="button" onClick={(e) =>{this.handleApproveQuotation(e)}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button> */}
                                            <button type="button"  onClick={(e) =>{commonSubmitFormNoValidation(e,this,"approveQuotation","/rest/approveQuotation")}} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Edit & Submit</button>
                                           
                                        </>
                                            :""}

                                            { (this.state.qbvArray.enquiry?.finalApprovalStatus==="REJECTED" || this.state.qbvArray.enquiry?.firstLevelApprovalStatus==="REJECTED")?
                                        <>
                                            {/* <button type="button" onClick={(e) =>{this.handleApproveQuotation(e)}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button> */}
                                            <button type="button"  onClick={(e) =>{commonSubmitFormNoValidation(e,this,"approveQuotation","/rest/approveQuotation")}} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Re-Approve</button>
                                            {/* <button type="button" data-toggle="modal" data-target="#reasonModal" className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times" />&nbsp;Reject</button> */}
                                        </>
                                            :""}
                                            {/* !this.props.readonly */}
                                            {
                                          this.state.qbvArray.status==="DR"?
                                            <>
                                                {/* <button type="button" onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"saveQuotation","/rest/saveQuotation")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;Save </button> */}
                                                <button type="submit" className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit</button>
                                            </>
                                            :""
                                        }
                                        <button type="button" onClick={()=>this.setState({loadBidderDocuments:true})} className="btn btn-sm btn-outline-warning mr-2" data-toggle="modal" data-target="#documentModal"><i className="fa fa-file-o" />&nbsp;Upload Offer/Quotation</button>
                                        {/* <button type="button" onClick={()=>this.setState({loadBidderDocuments:true})} className="btn btn-sm btn-outline-warning mr-2" data-toggle="modal" data-target="#documentModal"><i className="fa fa-file-o" />&nbsp;Upload Document</button> */}
                                        </>
                                    :   

                                    // this.state.qbvArray.status==="DR" || this.state.qbvArray.status!="SBMT" && this.state.qbvArray.status!="APPR" && today<=this.state.qbvArray.enquiry?.bidEndDate?
                                    this.state.qbvArray.status==="DR" || this.state.qbvArray.status==="SBMT" || this.state.qbvArray.status==="RJCT" && this.state.qbvArray.status!="APPR" && today<=formatDate(this.state.qbvArray.enquiry?.bidEndDate)?
                                // this.state.qbvArray.status==="DR" || this.state.qbvArray.status==="SBMT" || this.state.qbvArray.status==="RJCT" && this.state.qbvArray.status!="APPR" && today<=this.state.qbvArray.enquiry?.bidEndDate?
                                        <>
                                        <button  className={"btn btn-sm btn-outline-primary mr-2 "+ this.props.readonly} type="button" data-toggle="modal" data-target="#PRdocumentModal"><i className="fa fa-file" />&nbsp;PR Documents</button>
                                            {/* <button type="button" className="btn btn-sm btn-outline-warning mr-2" onClick={()=>this.setState({loadBidderDocuments:true})} data-toggle="modal" data-target="#documentModal"><i className="fa fa-file-o" />&nbsp;Upload Document</button> */}
                                            <button type="button" className="btn btn-sm btn-outline-warning mr-2" onClick={()=>this.setState({loadBidderDocuments:true})} data-toggle="modal" data-target="#documentModal"><i className="fa fa-file-o" />&nbsp;Upload Offer/Quotation</button>
                                            <button type="submit" className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit</button>
                                            {/* <button type="button" onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"saveQuotation","/rest/saveQuotation")}} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;Save </button> */}
                                            {/* <button type="submit" onClick={(e)=>{this.props.changeLoaderState(true); commonSubmitFormNoValidation(e,this,"saveQuotation","/rest/submitQuotation")}}className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit</button> */}
                                        </>
                                        :""
                                    
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {this.props.role===ROLE_NEGOTIATOR_ADMIN?<> */}
                {(this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN)?<>
                    <div className="modal reasonModal" id="reasonModal">
                        <div className="modal-dialog modal-md mt-100">
                            <div className="modal-content">
                                <div className="modal-header">
                                    Reason for Reject
                                    <button type="button" className={"close"} data-dismiss="modal">
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mt-1 px-4 py-1">
                                        <div className="col-12">
                                            <label>Enter Reason</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // name="reasonForReject"
                                                value={this.state.reasonForReject}
                                                onChange={(e) => {
                                                    commonHandleChange(e,this,"reasonForReject");}}
                                            />
                                            <input
                                                type="hidden"
                                                name="reasonForReject"
                                                value={this.state.reasonForReject}
                                                // disabled={this.props.role===ROLE_NEGOTIATOR_ADMIN}
                                                disabled={(this.props.role === ROLE_NEGOTIATOR_ADMIN) || (this.props.role === ROLE_BUYER_ADMIN)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={(e) =>{this.handleRejectQuotation(e)}} className="btn btn-sm btn-outline-success"><i class="fa fa-check"></i>&nbsp;Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>:<></>}
                <div className="modal documentModal" id="documentModal" >
                    <div className="modal-dialog modal-xl mt-100">
                        <div className="modal-content">
                            <div className="modal-header">
                                Other Documents
                  <button type="button" className={"close " + this.props.readonly} data-dismiss="modal">
                                    &times;
                </button>
                            </div>
                            <div className={"modal-body " + this.props.readonly}>
                                {/* <div className={"row mt-1 px-4 py-1 " + isTcDocSec}>
                                    <div className="col-sm-2">
                                        <span>Technical Document</span>
                                    </div>
                                </div> */}
                                <div className="row mt-1 px-4 py-1">
                                    {this.state.bidderDocumentsList.map((el, i) => (
                                        <>
                                            <div className={"col-sm-2 " + isTcDocSec}>
                                                <input
                                                    type="hidden"
                                                    disabled={
                                                    !el.istc
                                                    }
                                                    name={"bidderAttSet[" + i + "][istc]"}
                                                    value="Y"
                                                />
                                                <input type="checkbox" className="display_block mgt-10 m-auto"
                                                 onChange={(e) =>commonHandleChangeCheckBox(e, this, "bidderDocumentsList." + i + ".istc") }
                                                 checked={el.istc}
                                                />
                                            </div>

                                            <div className="col-sm-7">
                                                <div className="input-group">
                                                    <div className="custom-file">
                                                    <input
                                                        type="hidden"
                                                        disabled={isEmpty(
                                                        el.bidderAttachmentId
                                                        )}
                                                        name={"bidderAttachment[" + i + "][bidderAttachmentId]"}
                                                        value={el.bidderAttachmentId}
                                                    />
                                                    {/* <input
                                                        type="hidden"
                                                        disabled={isEmpty(
                                                        el.attachment.attachmentId
                                                        )}
                                                        name={"bidderAttachment[" + i + "][bidder][bidderId]"}
                                                        value={this.state.qbvArray.bidderId}
                                                    /> */}
                                                    <input
                                                        type="hidden"
                                                        disabled={isEmpty(
                                                        el.attachment.attachmentId
                                                        )}
                                                        name={
                                                        "bidderAttachment[" +
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
                                                        name={"bidderAttachment[" + i + "][description]"}
                                                        value={
                                                        el.description
                                                        }
                                                    />
                                                    <input
                                                        type="hidden"
                                                        disabled={isEmpty(
                                                        el.attachment.attachmentId
                                                        )}
                                                        name={
                                                        "bidderAttachment[" +
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
                                                            "bidderDocumentsList." + i + ".attachment"
                                                        );
                                                        }}
                                                        className={
                                                        "form-control custom-file-input " +
                                                        this.props.readonly
                                                        }
                                                        id={"inputGroupFile" + i}
                                                    />
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
                                                            onClick={this.onClearDocuments.bind(this,i)}
                                                            type="button"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                <a href={API_BASE_URL + "/rest/download/" + el.attachment.attachmentId}>
                                                    {/* <a
                                                        href={
                                                            "/rest/download/" +
                                                            el.attachment.attachmentId
                                                        }
                                                    > */}
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
                                                    value={el.description}
                                                    onChange={(e) => {
                                                        commonHandleChange(
                                                            e,
                                                            this,
                                                            "bidderDocumentsList." + i + ".attachment.description"
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
                                                            ? this.addBidderDocument()
                                                            : this.removeBidderDocument("" + i + "");
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
                <div className="modal documentModal" id="PRdocumentModal" >
            <div className="modal-dialog modal-xl mt-100">
              <div className="modal-content">
                <div className="modal-header">
                  Other Documents
                  <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal" onClick={this.closedocModal}  >
                  &times;
                </button>
                </div>
                <div className={"modal-body "+ this.props.readonly}>
                    <div className={"row mt-1 px-4 py-1 "}>
                  <div className="col-sm-2">
                    <span>Technical Document</span>
                  </div>
                </div>
                    <div className="row mt-1 px-4 py-1">
                {this.props.prAttachList?.map((el, i) => (
                  <>
                    <div className="col-sm-5">
                      <div>
                        <a
                          href={
                            API_BASE_URL +"/rest/download/" +
                            el.attachment.attachmentId
                          }
                        >
                          {el.attachment.fileName}
                        </a>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      {/* <input
                        type="text"
                        className={
                          "form-control height_40px " + this.props.readonly
                        }
                        name={"otherDocuments[" + i + "][description]"}
                        value={el.description}
                      /> */}
                    </div>
                  </>
                ))}
                </div>
                </div>
              </div>
            </div>
          </div>
             {/* </form> */}
             </FormWithConstraints>
            </>
        );
    }
}


const mapStateToProps=(state)=>{
    return state.quotationByVendorReducer;
  };
  export default connect(mapStateToProps,actionCreators)(QuotationByVendor);