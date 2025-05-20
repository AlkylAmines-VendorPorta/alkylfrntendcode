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
  import formatDate, { formatDateWithoutTime } from "./../../Util/DateUtil";
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
import { Button } from "@material-ui/core";
const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


class AdvancePayment extends Component {
    constructor (props) {
        super(props)    
        this.state={
            isLoading: false,
            advancePaymentList:[],
            selectedCheckboxList:[],
            nextPaymentDate:"",
            actualPaymentDate:"",
            checkedItems:[],
            role:"",
            getVendorPayListforApproval:[],
            response:[]
           
          
        }
    }


    async componentDidMount(){

      commonSubmitWithParam(this.props, "getAdvancePaymentDetails", "/rest/getAdvancePaymentDetailsforVendor");

      commonSubmitWithParam(this.props, "getVendorPayList", "/rest/getAlladvancePayment");
       this.changeLoaderState(true);
        await delay(500);
        this.changeLoaderState(true);
        this.compareList();
        this.changeLoaderState(false);
       
      }

      componentWillReceiveProps(props){

        if(!isEmpty(props.advancePaymentList)){
          this.initState(props);
          // this.setState({
          //   advancePaymentList:props.advancePaymentList
          // })
          this.setState({
            response: props.advancePaymentList,
           
           });
        }

        if(!isEmpty(props.getVendorPayListforApproval)){
        
          this.setState({
            getVendorPayListforApproval:props.getVendorPayListforApproval
          })
        }


        if(!isEmpty(props.role)){
        
          this.setState({
            role:props.role
          })
        }

      }

      compareList= ()=>{
        let listfromSAPWS=this.state.advancePaymentList;
        let listfromtableDB=this.state.getVendorPayListforApproval;

        let pendingArray=[];

        listfromSAPWS.map((product)=>{
       if(listfromtableDB.find(el=>(el.documentNumber === product.documentNumber) && el.status!="REJECTED")){
         console.log("exist")      
       }else{
         this.changeLoaderState(false);
         pendingArray.push(product)
        
       }
     })
           this.setState({
         response: pendingArray,
        
        });

     }

      

      changeLoaderState = (action) => {
        this.setState({
          isLoading: action
        });
      }

      onChecked = (key) => {
        let {checkedItems} = this.state;
        let index = checkedItems.findIndex(c => c == key)
        if(index != -1) checkedItems.splice(index)
        else checkedItems.push(key)
        this.setState({checkedItems});
      }

      // toggleChecked = (e) => {
      //   let {checked} = e.target;
      //   const groupByList = this.state.advancePaymentList;
      //   let checkedItems = [];
      //   if(checked) checkedItems = Object.keys(groupByList);
      //   this.setState({checked,checkedItems})
      // }

      onSubmit = (e) => {
        let {checkedItems} = this.state;
        let data = [];
        if(isEmptyDeep(checkedItems)) return showAlert(true,"Please Select item to Proceed");
        checkedItems.map((item) => {
          let items = item;
          if(!isEmptyDeep(items)){
            data = data.concat(items)
          }
          return item;
        })
    
        submitForm(data,'/rest/saveadvancePayment')
        .then(res => {
          if(res.success){
            this.setState({checkedItems:[]})
            showAlertAndReload(!res.success,res.message);
          }else{
            showAlert(true,res.message)
          }
        }).catch(err => {
          showAlert(err.success,err.message)
        });
      }
      actualPaymentDate=(baselineDate,days1Date,i)=>{
    
              let actualPaymentDate=""
             var invoiceDate=new Date(baselineDate);
              var numberOfDaysToAdd = Number(days1Date);
             
              actualPaymentDate= (invoiceDate.setDate(invoiceDate.getDate() + numberOfDaysToAdd));
             // this.setState({actualPaymentDate:actualPaymentDate})
              return formatDateWithoutTime(actualPaymentDate);
            

      }

     getRelativeDayInWeek(d,dy) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:dy); // adjust when day is sunday
      return formatDateWithoutTime(new Date(d.setDate(diff)));

      
    }

   getMondayDate() {
      const d = new Date();
      const daysToMonday = (7 - d.getDay()) % 7 + 1;
      const monday = d.getDate() + daysToMonday;
    
      return formatDateWithoutTime(new Date(d.getFullYear(), d.getMonth(), monday));
    }

      nextPaymentDate=()=>{
        let now = new Date();
        let today=formatDateWithoutTime(now.setDate(now.getDate()));
        let day = 1; // Monday
        let nextPaymentdt="";

        let monday = this.getMondayDate();
        let friday = this.getRelativeDayInWeek(new Date(),5);
        let saturday = this.getRelativeDayInWeek(new Date(),6);
        let sunday = this.getRelativeDayInWeek(new Date(),7);

        if((today!==friday) && (today!==saturday) && (today!==sunday)){
          return formatDateWithoutTime(now.setDate(now.getDate() + 1));          
        }
        else{
         return monday
        }

          // if (day > 6 || day < 0) 
          //        day = 0;
    
          //  while (now.getDay() != day) {
          //    now.setDate(now.getDate() + 1);
          //    }
             
          //  return formatDateWithoutTime(now.setDate(now.getDate() + 1));

      }

      calculateInterestAmt=(actualPayDate,nextPayDate,amount,interestRate)=>{
        let interestAmt=0.0;
        let newinterestRate=interestRate/100;
       // const diffInMs   = new Date(nextPayDate) - new Date(actualPayDate)
       const diffInMs   = new Date(actualPayDate) - new Date(nextPayDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);      
        interestAmt=(diffInDays/365*amount*newinterestRate);
        return getDecimalUpto(Number(interestAmt),2);
      }

      calculategapindays=(actualPayDate,nextPayDate)=>{
       
     
       // const diffInMs   = new Date(nextPayDate) - new Date(actualPayDate)
       const diffInMs   = new Date(actualPayDate) - new Date(nextPayDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      
        // interestAmt=(diffInDays/365*amount*newinterestRate);
        return diffInDays
      }

      calculatecgstAmt=(interestAmt,taxRatecgst)=>{
        let taxratecgstAmt=taxRatecgst/100;

      let finalcgstAmt=interestAmt*taxratecgstAmt;
       return getDecimalUpto(Number(finalcgstAmt),2);
      }

      calculatesgstAmt=(interestAmt,taxRatesgst)=>{
        let taxratesgstAmt=taxRatesgst/100;
       
       let finalsgstAmt=interestAmt*taxratesgstAmt;
      
       
        return getDecimalUpto(Number(finalsgstAmt),2);
      }

      calculateigstAmt=(interestAmt,taxRateigst)=>{
        let taxrateigstAmt=taxRateigst/100;
       
       let finaligstAmt=interestAmt*taxrateigstAmt;
      
       
        return getDecimalUpto(Number(finaligstAmt),2);
      }

      calculategrossAmt=(interestAmt,cgstAmt,sgstAmt,igstAmt)=>{
              let GrossAmount=""
        if(igstAmt!="0.00"){
          GrossAmount=Number(interestAmt)+Number(igstAmt);
        }else{
          GrossAmount=Number(interestAmt)+Number(sgstAmt)+Number(cgstAmt);
        }
        return getDecimalUpto(Number(GrossAmount),2);
       
      }

      calculatenetPayableAmt=(invoiceAmt,GrossAmt)=>{
       
        let TotalnetPayableAmt=""
  
        TotalnetPayableAmt=invoiceAmt-GrossAmt;

        return getDecimalUpto(Number(TotalnetPayableAmt),2);
 
      // return TotalnetPayableAmt.toLocaleString('en-IN', {minimumFractionDigits: 2})
}

      handleCheckboxChange = event => {
        let newArray = [...this.state.selectedCheckboxList, event.target.value];
        if (this.state.selectedCheckboxList.includes(event.target.value)) {
          newArray = newArray.filter(list => list !== event.target.value);
        }
        this.setState({
          selectedCheckboxList: newArray
        });
      };

      initState(props){
        let advancePaymentList = props.advancePaymentList;
    
        advancePaymentList = advancePaymentList.map((item) => {
                let newItem = {
                    ...item,
              invoiceDate:item.invoiceDate,
              days1:item.days1,
              cgst:item.cgst,
              sgst:item.sgst,
              igst:item.igst
                }
          
                // let actualDateForDisplay = this.actualPaymentDate(item.invoiceDate,item.days1);
                let actualPaymentDate = this.actualPaymentDate(item.invoiceDate,item.days1);
                let nextPaymentDate=this.nextPaymentDate();
             
                // let interestRateForDisplay="12"
                let interestRate=item.interestRate;
                let interestType="%"
               // let isMailSent="Y"
                // let interestAmount=this.calculateInterestAmt(payment.actualPaymentDate,payment.nextPaymentDateForDisplay,payment.amount,payment.interestRate)
                let interestAmount=this.calculateInterestAmt(actualPaymentDate,nextPaymentDate,item.amount,interestRate)
                let gapinDays=this.calculategapindays(actualPaymentDate,nextPaymentDate)
                let taxratesgst=item.sgst;
                let taxratecgst=item.cgst;
                let taxrateigst=item.igst
             

                let cgstAmount=this.calculatecgstAmt(interestAmount,taxratecgst)
                let sgstAmount=this.calculatesgstAmt(interestAmount,taxratesgst)
                let igstAmount=this.calculateigstAmt(interestAmount,taxrateigst)
                let grossAmount=this.calculategrossAmt(interestAmount,cgstAmount,sgstAmount,igstAmount)
                let netPayableAmount=this.calculatenetPayableAmt(item.amount,grossAmount)
                newItem = {
                  ...newItem,
                  actualPaymentDate,
                  nextPaymentDate,
                  interestRate,
                  interestType,
                  interestAmount,
                  cgstAmount,
                  sgstAmount,
                  igstAmount,
                  grossAmount,
                  gapinDays,
                  netPayableAmount
               //   isMailSent
                }
                
    
                
                return newItem;
            })
            updateState(this,{advancePaymentList});
            // this.setState({loadBidderDocuments:true})
        }

      render() {
        const groupByList =this.state.advancePaymentList;
        const list=this.state.response;
        console.log(this.state.response,"this.state.response")
          return (
            <>
            <React.Fragment>
           
            <Loader isLoading={this.state.isLoading} />
            {<UserDashboardHeader />}
            <FormWithConstraints  ref={formWithConstraints => this.advanceForm = formWithConstraints} 
            onSubmit={this.onSubmit}
            >
           <div className="wizard-v1-content" style={{marginTop:"80px", marginBottom:"20px"}}>
           <div className="row">
           <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"16px"}}>Payment List To Process</label>
                                 </div>
          
               <div className="col-sm-12 mt-2">
               <StickyHeader height={"40vh"} >
                     <table className="my-table">
                       <thead>
                         <tr>  
                         <th>Required payment</th>  
                           <th> Document Number</th>
                           <th> Reference</th>
                           <th>Invoice Date</th>
                           <th>Invoice Net Amount(Incl. of all Taxes)</th>
                           <th>Due Date</th>
                           <th>Flat Discount(%)</th>
                           <th>Payment Date</th>
                           <th>interest amount</th>
                           <th>CGST amount</th>
                           <th>SGST amount</th>
                           <th>IGST amount</th>
                           <th>Total Interest Amount</th>
                           <th>Net Payable</th>
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">
                            {
                              this.state.response.map((payment,i)=>
                                <tr>
                                   <td> 
                                 {payment.gapinDays > 0 && payment.gapinDays > 3?
                                 <input type="checkbox" checked={this.state.checkedItems.includes(payment)} onChange={this.onChecked.bind(this,payment)} />
                                 :<h6 style={{color:'red'}}> <span className="redspan">*</span>{"Actual Payment Date is Online"}</h6>} </td>
                                 
                                 
                                  <td>{payment.documentNumber}</td>
                                  <td>{payment.reference}</td>
                                 <td>{payment.invoiceDate!=null?formatDate(payment.invoiceDate):""}</td>
                                  <td>{(payment.amountInLC).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                  
                                  <td>{payment.invoiceDate!=null?payment.actualPaymentDate:""}</td>
                                  {this.state.role!="VENADM"?
                                  <td>{<input type="text" value={payment.interestRate}/>}</td>:
                                  <td>{payment.interestRate}</td>
                                }
                                <td>{payment.nextPaymentDate}</td>
                                  <td>{ this.state.checkedItems.includes(payment) ? payment.interestAmount:""}</td>
                                  <td>{this.state.checkedItems.includes(payment) ? payment.cgstAmount:""}</td>
                                  <td>{this.state.checkedItems.includes(payment) ? payment.sgstAmount:""}</td>
                                  <td>{this.state.checkedItems.includes(payment) ? payment.igstAmount:""}</td>
                                  <td>{this.state.checkedItems.includes(payment) ? payment.grossAmount:""}</td>
                                  <td>{this.state.checkedItems.includes(payment) ? payment.netPayableAmount:""}</td>
                                </tr>
                                
                              )
                     }
                    
                  </tbody>
               </table>
            </StickyHeader>
          
            
            <div className="row">

<div className="col-sm-12 text-center">
  <Button size="small" variant="contained" color="primary" type="button" onClick={this.onSubmit} className={"btn btn-primary"}  >
    Submit & Send Mail
  </Button>
</div>
</div>
<div className="row p-3">
         
<label style={{color:'red'}}><span>Note: if any query regarding payment please contact AACl Finance Team</span></label></div>
           
         </div>
      </div>
   </div>
   <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"16px"}}>PAYMENT LIST (IP/Approved/Rejected)</label>
                                 </div>
   <div className="col-sm-12 mt-2 mb-5">
               <StickyHeader height={"40vh"} >
                     <table className="my-table">
                       <thead>
                         <tr>                         
                           <th>Supplier</th>
                           <th>Supplier Name</th>
                           <th>Document Number</th>
                           <th>Reference</th>
                           <th>Invoice Net Amount (Incl. of all Taxes)</th>
                           <th>Invoice Date</th>
                           {/* <th>Actual Payment date</th> */}
                           <th>Due Date</th>
                           <th>Payment date</th>
                           {/* <th>Early Payment Interest rate</th> */}
                           {/* <th>Flat Discount(%)</th> */}
                           {/* <th>Discount Amount</th> */}
                          <th>Total Interest Amount</th>
                           {/* <th>CGST(%)</th>
                           <th>SGST(%)</th>
                           <th>IGST(%)</th>
                           <th>CGST amount</th>
                           <th>SGST amount</th>
                           <th>IGST amount</th> */}
                           <th>Payment Amount</th>
                           <th>status</th>
                           {/* <th></th>
                           <th></th> */}

                           
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">

                       {this.state.getVendorPayListforApproval.map((pay,i)=>
                           
                           <tr>
                            <td>{pay.vendorCode}</td>
                            <td>{pay.vendorName}</td>
                            <td>{pay.documentNumber}</td>
                            <td>{pay.reference}</td>
                            <td>{(pay.amountInLC).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                            <td>{pay.invoiceDate!=null || pay.invoiceDate!="" ?formatDate(pay.invoiceDate):""}</td>
                            <td>{pay.actualPaymentDate!=null?formatDate(pay.actualPaymentDate):""}</td>
                            <td>{pay.nextPaymentDate!=null?formatDate(pay.nextPaymentDate):""}</td>
                            {/* <td>{pay.interestRate}</td> */}
                            {/* <td>{(pay.interestAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td> */}
                            <td>{(pay.grossAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                            {/* <td>{pay.cgst}</td>
                            <td>{pay.sgst}</td>
                            <td>{pay.igst}</td>
                            <td>{pay.cgstAmount}</td>
                            <td>{pay.sgstAmount}</td>
                            <td>{pay.igstAmount}</td> */}
                            {/* <td>{(pay.grossAmount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td> */}
                            <td>{(pay.netPayableAmount!=null?(pay.netPayableAmount).toLocaleString('en-IN', {minimumFractionDigits: 2}) :"")}</td>
                            <td>{pay.status}</td>
                          </tr>
                       )}
                            
                    
                  </tbody>
               </table>
            </StickyHeader>
          
          
           
         </div>
   </FormWithConstraints> 

            </React.Fragment>
           
            </>)
      }

}

const mapStateToProps=(state)=>{
    return state.advancePayment;
  };
  export default connect (mapStateToProps,actionCreators)(AdvancePayment);