import React, { Component } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import * as actionCreators from "./Action";

import {connect} from 'react-redux';
import {commonSubmitWithParam,commonHandleChange, commonSubmitFormNoValidation,commonSubmitForm, 
  commonHandleChangeCheckBox, commonHandleFileUpload,commonSubmitFormValidation,
  commonHandleReverseChangeCheckBox,swalPrompt,commonSubmitWithoutEvent,
  commonHandleFileUploadInv,swalWithTextBox,updateState,showAlertAndReload,showAlert} from "./../../Util/ActionUtil";
  import { isEmpty,isEmptyDeep } from './../../Util/validationUtil';
  import StickyHeader from "react-sticky-table-thead";
  import { formatDateWithoutTime,formatDateWithoutTimeNewDate2 } from "./../../Util/DateUtil";
  import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

  import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "./../../Util/CommonUtil";
  import { isServicePO } from "./../../Util/AlkylUtil";
import { searchTableData, searchTableDataTwo} from "./../../Util/DataTable";
import swal from "sweetalert";  
import { API_BASE_URL } from "./../../Constants";
import {saveQuotation,downloadexcelApi,request,uploadFile,submitForm} from "./../../Util/APIUtils";
import Loader from "../FormElement/Loader/LoaderWithProps";
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import moment from "moment";
import {groupBy,includes, sum, sumBy} from 'lodash-es';

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

class AdvancePayApproval extends Component {
    constructor (props) {
        super(props)    
        this.state={
            getVendorPayListforApproval:[],
            acceptedCheckedItems:[],
            rejectedCheckedItems:[],
        }}


 componentDidMount(){

            commonSubmitWithParam(this.props, "getVendorPayforApproval", "/rest/getAlladvancePayment");
            
            }

 componentWillReceiveProps(nextProps){
  let list = groupBy(nextProps.getVendorPayListforApproval, 'vendorCode');
  this.setState({getVendorPayListforApproval: list})

                // if(!isEmpty(props.getVendorPayListforApproval)){
                // //  this.initState(props);
                //     this.setState({
                //         getVendorPayListforApproval:props.getVendorPayListforApproval
                //     })
                //   }
            }

            onApprovedChecked = (e,key)=>{
              let {acceptedCheckedItems} = this.state;
              if(e.target.checked === true){
                
                acceptedCheckedItems.push(this.getAdvanceDetailsFromObj(key))
                this.setState({acceptedCheckedItems});
               
              }
              else if(e.target.checked === false){
             let index = acceptedCheckedItems.findIndex(c => c.advancePaymentId == key.advancePaymentId)
             acceptedCheckedItems.splice(index,1)
            
              }
            }

            getAdvanceDetailsFromObj(advanceObj) {

              let advancePaymentId = "";
              let documentNumber = "";
              let vendorCode="";
              let interestAmount="";
              let nextPaymentDate="";
              let grossAmount="";
              let cgstAmount="";
              let sgstAmount="";
              let igstAmount=""
              let amountInLC=""
              let invoiceDate="";
              let reference="";
              let netPayableAmount=""


              
              if (!isEmpty(advanceObj)) {
                 if (!isEmpty(advanceObj.advancePaymentId)) {
                  advancePaymentId = advanceObj.advancePaymentId;
                  documentNumber=advanceObj.documentNumber;
                  vendorCode=advanceObj.vendorCode;
                  interestAmount=advanceObj.interestAmount;
                  nextPaymentDate=advanceObj.nextPaymentDate;
                  grossAmount=advanceObj.grossAmount;
                  cgstAmount=advanceObj.cgstAmount;
                  sgstAmount=advanceObj.sgstAmount;
                  igstAmount=advanceObj.igstAmount;
                  amountInLC=advanceObj.amountInLC;
                  invoiceDate=advanceObj.invoiceDate;
                  reference=advanceObj.reference;
                  netPayableAmount=advanceObj.netPayableAmount
                 }
        
               
                 return {
                  advancePaymentId: advancePaymentId,   
                  documentNumber:documentNumber,
                  vendorCode:vendorCode,
                  interestAmount:interestAmount,
                  nextPaymentDate:nextPaymentDate,
                  grossAmount:grossAmount,
                  cgstAmount:cgstAmount,
                  sgstAmount:sgstAmount,
                  igstAmount:igstAmount   ,
                  amountInLC:amountInLC,
                  invoiceDate:invoiceDate,
                  reference:reference    ,
                  netPayableAmount:netPayableAmount    
                 };
              }
           }

            onApproval = (e) => {
              let {acceptedCheckedItems} = this.state;
              let data = [];
              if(isEmptyDeep(acceptedCheckedItems)) return showAlert(true,"Please Select item to Proceed");
              acceptedCheckedItems.map((item) => {
                let items = item;
                if(!isEmptyDeep(items)){
                  data = data.concat(items)
                }
                return item;
              })
               submitForm(data,'/rest/approveAdvancePayment')
              .then(res => {
                if(res.success===true){
                  this.setState({acceptedCheckedItems:[]})
                  showAlertAndReload(!res.success,res.message);
                }else{
                  showAlert(true,res.message)
                }
              }).catch(err => {
                showAlert(err.success,err.message)
              });
            }


            onReject = (e) => {
              let {rejectedCheckedItems} = this.state;
              let data = [];
              if(isEmptyDeep(rejectedCheckedItems)) return showAlert(true,"Please Select item to Proceed");
              rejectedCheckedItems.map((item) => {
                let items = item;
                if(!isEmptyDeep(items)){
                  data = data.concat(items)
                }
                return item;
              })
               submitForm(data,'/rest/rejectAdvancePayment')
               
              .then(res => {
                if(res.success===true){
                  this.setState({rejectedCheckedItems:[]})
                  showAlertAndReload(!res.success,res.message);
                }else{
                  showAlert(true,res.message)
                }
              }).catch(err => {
                showAlert(err.success,err.message)
              });
            }


            onRejectedChecked = (e,key) => {

              let {rejectedCheckedItems} = this.state;
              if(e.target.checked === true){
                
                rejectedCheckedItems.push(this.getAdvanceDetailsFromObj(key))
                this.setState({rejectedCheckedItems});
               
              }
              else if(e.target.checked === false){
             let index = rejectedCheckedItems.findIndex(c => c.advancePaymentId == key.advancePaymentId)
             rejectedCheckedItems.splice(index,1)
            
              }

            }


//  approvePayment=(approvePaymentId,rate)=>{
//     //commonSubmitWithParam(this.props, "approvePayment", "/rest/approveAdvancePayment",approvePaymentId,rate);
//              commonSubmitWithParam(this.props, "approvePayment", "/rest/approveAdvancePayment",approvePaymentId);
//          //   commonSubmitFormNoValidation(e,this, "approvePayment", "/rest/approveAdvancePayment",approvePaymentId,irate);
//             }

            rejectpayment = (advancePaymentId) => {
              swal("Enter reason for rejection", {
                 content: "input",
                 showCancelButton: true,
                 cancelButtonText: "Cancel",
                 buttons: true,
                 dangerMode: true,
              })
                 .then((rejectReason) => {
                 
                    commonSubmitWithParam(this.props, "rejectadvancePayment", "/rest/rejectAdvancePayment", advancePaymentId, rejectReason)
                 }).catch(err => {
                 });
           }

           calculateGrossAmount = (child) => {

            let list = child;
        
        
             let GrossAmount=0.0;
            let TotalGrossAmount=0.0;
            // let TotalGrossArray = [];
        
             list.map((qbvLine) => {
             GrossAmount= (qbvLine.grossAmount)
                //    TotalGrossArray.push(GrossAmount);
                   TotalGrossAmount= Number(TotalGrossAmount) + Number(GrossAmount);
            })

          // return getDecimalUpto(TotalGrossAmount,2);
          return TotalGrossAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
          
        }
        calculateNetPayableAmount = (child) => {

          let list = child;
      
      
           let netPayableAmount=0.0;
          let TotalnetPayableAmount=0.0;
          // let TotalGrossArray = [];
      
           list.map((qbvLine) => {
            netPayableAmount= (qbvLine.netPayableAmount)
              //    TotalGrossArray.push(GrossAmount);
              TotalnetPayableAmount= Number(TotalnetPayableAmount) + Number(netPayableAmount);
          })

        // return getDecimalUpto(TotalGrossAmount,2);
        return TotalnetPayableAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
        
      }
        calculateTotalInvoiceAmount = (child) => {

          let list = child;
      
      
           let InvoiceAmount=0.0;
          let TotalInvoiceAmount=0.0;
          // let TotalGrossArray = [];
      
           list.map((qbvLine) => {
            InvoiceAmount= (qbvLine.amountInLC)
              //    TotalGrossArray.push(GrossAmount);
              TotalInvoiceAmount= Number(TotalInvoiceAmount) + Number(InvoiceAmount);
          })

          // return getDecimalUpto(TotalInvoiceAmount,2);

          return TotalInvoiceAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
        
      }

      calculateTotalInterestAmount = (child) => {

        let list = child;
    
    
         let InterestAmount=0.0;
        let TotalInterestAmount=0.0;
        // let TotalGrossArray = [];
    
         list.map((qbvLine) => {
          InterestAmount= (qbvLine.interestAmount)
            //    TotalGrossArray.push(GrossAmount);
            TotalInterestAmount= Number(TotalInterestAmount) + Number(InterestAmount);
        })

       // return getDecimalUpto(TotalInterestAmount,2);

       return TotalInterestAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
      
    }

    calculateTotalCGSTAmount = (child) => {

      let list = child;
  
  
       let CgstAmount=0.0;
      let TotalCgstAmount=0.0;
      // let TotalGrossArray = [];
  
       list.map((qbvLine) => {
        CgstAmount= (qbvLine.cgstAmount)
          //    TotalGrossArray.push(GrossAmount);
          TotalCgstAmount= Number(TotalCgstAmount) + Number(CgstAmount);
      })

    //  return getDecimalUpto(TotalCgstAmount,2);
    return TotalCgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
    
  }

  calculateTotalSGSTAmount = (child) => {

    let list = child;


     let SgstAmount=0.0;
    let TotalSgstAmount=0.0;
    // let TotalGrossArray = [];

     list.map((qbvLine) => {
      SgstAmount= (qbvLine.sgstAmount)
        //    TotalGrossArray.push(GrossAmount);
        TotalSgstAmount= Number(TotalSgstAmount) + Number(SgstAmount);
    })

  //  return getDecimalUpto(TotalSgstAmount,2);
  return TotalSgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})
  
}

calculateTotalIGSTAmount = (child) => {

  let list = child;


   let IgstAmount=0.0;
  let TotalIgstAmount=0.0;
  // let TotalGrossArray = [];

   list.map((qbvLine) => {
    IgstAmount= (qbvLine.igstAmount)
      //    TotalGrossArray.push(GrossAmount);
      TotalIgstAmount= Number(TotalIgstAmount) + Number(IgstAmount);
  })

 // return getDecimalUpto(TotalIgstAmount,2);
 return TotalIgstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})

}


            calculateinterestAmtFrLineItem=(e,i,actualPayDate,nextPayDate,amount,rate,formRef)=> {
              let {getVendorPayListforApproval} = this.state;
              let row = getVendorPayListforApproval[i];
              let value = e.target.value ? e.target.value:"12";
              let interestAmt=row.interestAmount;
              let interestRate=value;
              let irate=value;

              let newinterestRate=irate/100;
              const diffInMs   = new Date(nextPayDate) - new Date(actualPayDate)
              const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
              interestAmt=getDecimalUpto((diffInDays/365*amount*newinterestRate),2);
              getVendorPayListforApproval[i] = {
                ...row,
                interestRate,
                interestAmt
            };

            updateState(this,{getVendorPayListforApproval});
            if(!isEmpty(formRef)){
                this[formRef].validateFields(e.target);
            }
            }


            render() {
               
                  return (
                    <>
                    <React.Fragment>
                   
                    <Loader isLoading={this.state.isLoading} />
                    {<UserDashboardHeader />}
                    <FormWithConstraints  ref={formWithConstraints => this.advanceForm = formWithConstraints} 
                   
                    >

<div className="w-100">
          <div className="mt-70 boxContent">
           <div className="row">
           <div className="col-sm-9"></div>
           <div className="col-sm-3">
           <button type="button" onClick={this.onApproval} className={"btn btn-primary"}  >Approve</button>&nbsp;&nbsp;&nbsp;
           <button type="button" onClick={this.onReject} className={"btn btn-primary"}  >Reject</button></div>
           {/* <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div>  */}
               <div className="col-sm-12 mt-2">
               <StickyHeader height={"80vh"} >
                     <table className="my-table">
                       <thead>
                         <tr >                         
                         <th className="col-lg-12">Supplier Code</th>
                           {/* <th>Gross Total</th> */}
                           <th>Supplier Name</th>
                           <th>Document Number</th>
                           <th>Reference</th>
                           <th>Amt.in loc.cur.</th>
                           <th>Invoice Date</th>
                           {/* <th>Actual Payment date</th> */}
                           <th>Due Date</th>
                           <th>Payment Date</th>
                           {/* <th>Next Payment date</th> */}
                           <th>Gap in Days</th>
                           <th>Early Payment Interest rate</th>
                           <th>Interest Amount</th>
                           {/* <th>CGST(%)</th>
                           <th>SGST(%)</th>
                           <th>IGST(%)</th> */}
                           <th>CGST amount</th>
                           <th>SGST amount</th>
                           <th>IGST amount</th>
                           {/* <th>Gross amount</th> */}
                           <th>Total Interest Amount</th>
                           <th>Net Payable</th>
                           <th>Accept</th>
                           <th>Reject</th>
                           {/* <th>status</th> */}
                           {/* <th></th>
                           <th></th> */}

                           
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">

                       {Object.keys(this.state.getVendorPayListforApproval).map((key, i) => {
                          // console.log('groupByList',groupByList)
                          let itemData = this.state.getVendorPayListforApproval[key];
                          let childs = !isEmptyDeep(itemData) ? itemData:[];
                           return (
                            <>
                            <tr  class="accordion-toggle">
                            <td id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i} >{key}<span class="expand-button collapsed"></span></td>
                            
                            {/* <td>{this.calculateGrossAmount(childs)}</td> */}
                            <td></td><td></td><td></td>
                            <td>{this.calculateTotalInvoiceAmount(childs)}</td>
                            <td></td><td></td><td></td><td></td><td></td>
                            <td>{this.calculateTotalInterestAmount(childs)}</td>
                            <td>{this.calculateTotalCGSTAmount(childs)}</td>
                            <td>{this.calculateTotalSGSTAmount(childs)}</td>
                            <td>{this.calculateTotalIGSTAmount(childs)}</td>
                            <td>{this.calculateGrossAmount(childs)}</td>
                            <td>{this.calculateNetPayableAmount(childs)}</td>
                            <td>
                              </td><td></td>
                              {/* <td></td><td></td><td></td>
                              <td></td> */}
                            {/* <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td> */}
                            {/* <td><button type="button" onClick={this.onApproval} className={"btn btn-primary"}  >Approve</button></td>
                            <td><button type="button" onClick={this.onReject} className={"btn btn-primary"}  >Reject</button></td> */}
                            </tr>
                            {
                            childs.map((payment,index) => {
                              return(
                                <tr class="hide-table-padding">
                                <td colSpan="1"></td>
                               {/* <td></td> */}
                               <td id={"collapse" + i} class="collapse in p-1">{payment.vendorName}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.documentNumber}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.reference}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{(payment.amountInLC).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.invoiceDate!=null?formatDateWithoutTime(payment.invoiceDate):""}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.actualPaymentDate!=null?formatDateWithoutTime(payment.actualPaymentDate):""}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.nextPaymentDate!=null?formatDateWithoutTime(payment.nextPaymentDate):""}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.gapinDays}</td>
                               <td id={"collapse" + i} class="collapse in p-1">{payment.interestRate}</td>
                           
                              <td id={"collapse" + i} class="collapse in p-1">{(payment.interestAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                
                              {/* <td id={"collapse" + i} class="collapse in p-1">{payment.cgst}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{payment.sgst}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{payment.igst}</td> */}
                              <td id={"collapse" + i} class="collapse in p-1">{(payment.cgstAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{(payment.sgstAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{(payment.igstAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{(payment.grossAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                              <td id={"collapse" + i} class="collapse in p-1">{payment.netPayableAmount!=null? (payment.netPayableAmount).toLocaleString('en-IN', {minimumFractionDigits: 2}):""}</td>
                             
                               { payment.status==="APPROVED" || payment.status==="REJECTED"?
                          <td id={"collapse" + i} class="collapse in p-1">{payment.status}</td> :
                          <>
                          <td id={"collapse" + i} class="collapse in p-1"> <input type="checkbox" onChange={e => this.onApprovedChecked(e,payment)}  /></td>
                         {/* <td id={"collapse" + i} class="collapse in p-1"> <input type="checkbox" onChange={this.onApprovedChecked.bind(this,payment)} /></td> */}
                         <td id={"collapse" + i} class="collapse in p-1"> <input type="checkbox" onChange={e=> this.onRejectedChecked(e,payment)} /></td>
                          {/* <td id={"collapse" + i} class="collapse in p-1"><button onClick={() => { this.approvePayment(payment.advancePaymentId, payment.interestRate); } } type="button" class="btn btn-outline-primary">Accept</button></td>
                          <td id={"collapse" + i} class="collapse in p-1"><button onClick={e => this.rejectpayment(payment.advancePaymentId)} type="button" class="btn btn-outline-primary">Reject</button></td> */}
                          </> 
                          }
                          {/* </div>  */}
                          
                          
                           </tr> 
                                
                            //       <tr>
                            //       <td colSpan="1"></td>
                            //       <td>{payment.vendorName}</td>
                            //      <td>{payment.documentNumber}</td>
                            //      <td>{payment.reference}</td>
                            //      <td>{payment.amountInLC}</td>
                            //      <td>{payment.invoiceDate!=null?formatDateWithoutTime(payment.invoiceDate):""}</td>
                            //      <td>{payment.actualPaymentDate!=null?formatDateWithoutTime(payment.actualPaymentDate):""}</td>
                            //      <td>{payment.nextPaymentDate!=null?formatDateWithoutTime(payment.nextPaymentDate):""}</td>
                            //      <td>{payment.gapinDays}</td>
                            //      <td>{payment.interestRate} 
                                
                            //     </td>
                             
                            //     <td>
                            //     {payment.interestAmount}</td>
                                  
                            //     <td>{payment.cgst}</td>
                            //     <td>{payment.sgst}</td>
                            //     <td>{payment.igst}</td>
                            //     <td>{payment.cgstAmount}</td>
                            //     <td>{payment.sgstAmount}</td>
                            //     <td>{payment.igstAmount}</td>
                            //     <td>{payment.grossAmount}</td>
                            //      { payment.status==="APPROVED" || payment.status==="REJECTED"?
                            // <td>{payment.status}</td> :
                            // <>
                            // <td><button onClick={() => { this.approvePayment(payment.advancePaymentId, payment.interestRate); } } type="button" class="btn btn-outline-primary">Accept</button></td>
                            // <td><button onClick={e => this.rejectpayment(payment.advancePaymentId)} type="button" class="btn btn-outline-primary">Reject</button></td></> }
                            //       </tr> 
                              )
                            }
                          )
                            }
                           </>
                           )
                          
                          })}

                            {/* {
                              this.state.getVendorPayListforApproval.map((payment,i)=>
                           
                                <tr>
                                 <td>{payment.vendorCode}</td>
                                 <td>{payment.vendorName}</td>
                                 <td>{payment.documentNumber}</td>
                                 <td>{payment.reference}</td>
                                 <td>{payment.amountInLC}</td>
                                 <td>{payment.invoiceDate!=null?formatDateWithoutTime(payment.invoiceDate):""}</td>
                                 <td>{payment.actualPaymentDate!=null?formatDateWithoutTime(payment.actualPaymentDate):""}</td>
                                 <td>{payment.nextPaymentDate!=null?formatDateWithoutTime(payment.nextPaymentDate):""}</td>
                                 <td></td>
                                 <td>{<input type="text" 
                                  className={"col-12 form-control "}
                             
                                value={payment.interestRate} 
                                name={"payment["+i+"][interestRate]"}
                            
                                />}</td>
                             
                                <td>
                                {payment.interestAmount}</td>
                                  
                                <td>{payment.cgst}</td>
                                <td>{payment.sgst}</td>
                                <td>{payment.igst}</td>
                                <td>{payment.cgstAmount}</td>
                                <td>{payment.sgstAmount}</td>
                                <td>{payment.igstAmount}</td>
                                <td>{payment.grossAmount}</td>
                                 { payment.status==="APPROVED" || payment.status==="REJECTED"?
                            <td>{payment.status}</td> :
                            <>
                            <td><button onClick={() => { this.approvePayment(payment.advancePaymentId, payment.interestRate); } } type="button" class="btn btn-outline-primary">Accept</button></td>
                            <td><button onClick={e => this.rejectpayment(payment.advancePaymentId)} type="button" class="btn btn-outline-primary">Reject</button></td></> }
                                </tr>
                                
                              )
                     } */}
                    
                  </tbody>
               </table>
            </StickyHeader>
          
          
           
         </div>
      </div>
   </div>
   </div>


</FormWithConstraints>
</React.Fragment></>)
    }

}

const mapStateToProps=(state)=>{
    return state.advancePayApproval;
  };
  export default connect (mapStateToProps,actionCreators)(AdvancePayApproval);