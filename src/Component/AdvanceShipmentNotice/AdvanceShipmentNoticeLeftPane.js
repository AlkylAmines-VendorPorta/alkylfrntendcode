import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "../PurchaseOrder/Action";
import AdvanceShipmentNotice from "../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import { commonHandleFileUpload, commonSubmitForm, commonHandleChange, commonSubmitWithParam, commonHandleChangeCheckBox } from "../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
class AdvanceShipmentNoticeLeftPane extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      liList:[
        {
          purchaseOrderNumber:"12563",
          poDate:"21-02-2020",
          vendorCode:"000989",
          vendorName:"Alkyl",
          incomeTerms:"5",
          purchaseGroup:"Alkyl",
          versionNumber:"1456",
          status:"IP",
        },
        {
          purchaseOrderNumber:"000018",
          poDate:"3-02-2019",
          vendorCode:"899383",
          vendorName:"Novel",
          incomeTerms:"45",
          purchaseGroup:"Novel",
          versionNumber:"8799",
          status:"Dr",
        }
      ],
      activeItem: 0,
    };
}
liClick = (li, selectedRow) => {
  
  
  this.setState({
    activeItem: 1,
  })
  this.props.changePO(li);
}

render() {
  const liListdata = this.state.liList.map((li, index) =>{
      return(
        <li  onClick = {()=>this.liClick(li)} key={ index } className={this.state.activeItem === index ? 'li-active' : ''}>						
						<label className="col-6"> {li.vendorName}</label>
            <label className="col-6"> {li.purchaseOrderNumber}</label>
            <label className="col-6"> {li.vendorCode}</label>
            <label className="col-6"> {li.status}</label>
				</li>
      );
    });  
    return (
      <>
          <div className="left-side-containt">
            <div className="details-conatint">                  
            Advance Shipment Notice List 
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


export default AdvanceShipmentNoticeLeftPane;