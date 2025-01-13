import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./../PurchaseOrder/Action";

import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../../Component/Header/VendorDashboardHeader";
class ServiceOrder extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      kycDetails:"",
    }
}
render() {
   
    return (
      <>
      <VendorDashboardHeader/>
      <div className="w-100">
          <div className="left-side-containt">
            <div className="details-conatint">                  
            Service Order List
            </div>
            <div className="input-group">
						<input type="hidden" name="search_param" value="all" id="search_param"/>         
						<input type="text" className="form-control" id="searchItem" name="x" placeholder="Search term..." /> 
						<span className="input-group-btn">						
							<button className="btn btn-default" type="button"><span className="fa fa-refresh"></span></button>
						    <button className="btn btn-default"><span className="fa fa-plus"></span></button> 						
						</span>
					</div>
            <ul className="list-group" id="left-pane-list" ref = 'leftPane'>                
						
						<li className='li-active' >						
						<label className="col-6">data.LT</label>
						<label className="col-6">data.RT</label>
						<label className="col-6">data.LB</label>
						<label className="col-6">data.RB</label>
						</li>
            <li>						
						<label className="col-6">data.LT</label>
						<label className="col-6">data.RT</label>
						<label className="col-6">data.LB</label>
						<label className="col-6">data.RB</label>
						</li>
						
                
				</ul>	
          </div>
          <div className="right-side-containt">
          <div className="details-conatint">                  
          Service Order Details
            </div>
            <div>
            <ul class="nav nav-tabs">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#home"><i class="fa fa-address-book-o" aria-hidden="true"></i>&nbsp;Gate Entry</a>
    </li>
  </ul>

  <div class="tab-content-custom">
    <div id="home" class="container tab-pane active"><br/>
    <div className="form-group right-side-label">
            <label className="col-6">Name : {this.state.name}</label>
            <label className="col-6">Company : {this.state.company}</label>
            <label className="col-6">Contact No : {this.state.phone}</label>
            <label className="col-6">Email : {this.state.email}</label>
        </div>
        <div class="card">
  <div class="card-header">Service Order</div>
  <div class="card-body">
  <form>
              <div className="row">                     
                  <label className="col-sm-2" >Document Type</label>
                  <div className="col-sm-3" >
                  <select className="form-control">
                      <option></option>
                  </select>
               </div>
               <label className="col-sm-2" >PO No</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">                      
                  <label className="col-sm-2" >PO Date</label>
                  <div className="col-sm-3" >
                  <input type="date" className="form-control"/>
               </div>
               
              
                  <label className="col-sm-2">Vendor Code </label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">      
              
                  <label className="col-sm-2" >Vendor Name</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2">Income Terms</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">   
              
                  <label  className="col-sm-2">Purchase Group</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Version No</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">  
                  <label className="col-sm-2" >Status</label>
                  <div className="col-sm-3" >
                  <input type="date" className="form-control"/>
               </div>
              
                  <label className="col-sm-2" >Line Item No</label>
                  <div className="col-sm-3" >
                     <input type="text" className="form-control"/>
                  </div>
               </div> 
               <br/>
               <div className="row">  
               
                  <label className="col-sm-2">Item Code</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2">Material Description</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">  
               
                  <label className="col-sm-2" >PO Quantity</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
              
                  <label className="col-sm-2">Rate</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">  
               
                  <label className="col-sm-2">Currency</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
              
                  <label className="col-sm-2">UOM</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
               <div className="row">  
               
                  <label className="col-sm-2" >Delivery Date</label>
                  <div className="col-sm-3" >
                  <input type="date" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Plant</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Delivery Status</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Basic Price </label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Packing / Forwarding Condition</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Freight Condition </label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Loading / Unloading Charges</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Tax Conditions</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Control Code</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Tracking No</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Overdeliv. Tol</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Underdel. Tol.</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Delivery Schedule for Annual Orders</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               
                  <label className="col-sm-2" >Delivered Qty</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <br/>
             <div className="row">  
               
                  <label className="col-sm-2">Balance Qty</label>
                  <div className="col-sm-3" >
                  <input type="text" className="form-control"/>
               </div>
               </div>
               <div className="col-sm-12 text-center mt-2 " >
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  <button type="button" className="btn btn-danger mr-1">Cancel</button>                  
              </div>
              <div className="clearfix" />
            </form>
            </div>
            </div>
    </div>  
  </div>

            </div>
          </div>
      </div>
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.kycInfo;
};
export default connect (mapStateToProps,actionCreators)(ServiceOrder);