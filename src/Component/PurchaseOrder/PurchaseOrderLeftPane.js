import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./../PurchaseOrder/Action";
import PurchaseOrder from "../PurchaseOrder/PurchaseOrder/PurchaseOrder";
//import PurchaseOrderLine from "../PurchaseOrder/PurchaseOrderLine/PurchaseOrderLine";

import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../../Component/Header/VendorDashboardHeader";
class PurchaseOrderLeftPane extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      // activeItem:0
    }
      
}
liClick = (index) => {  
  this.setState({
    activeItem: index,
  })
  this.props.changePO(index);
}

render() {
  const liListdata = this.props.poList.map((po, index) =>{
      return(
        <li  onClick = {()=>this.liClick(index)} key={ index } className={this.state.activeItem === index ? 'li-active' : ''}>						
						<label className="col-6"> {po.vendorName}</label>
            <label className="col-6"> {po.purchaseOrderNumber}</label>
            <label className="col-6"> {po.vendorCode}</label>
            <label className="col-6"> {po.status}</label>
				</li>
      );
    });  
    return (
      <>
          <div className="left-side-containt">
            <div className="details-conatint">                  
                Purchase Order List 
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
                {liListdata}
				    </ul>	
          </div>
      </>
    );
  }
}


export default PurchaseOrderLeftPane;