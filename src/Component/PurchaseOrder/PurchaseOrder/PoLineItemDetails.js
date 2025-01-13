import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import {commonSubmitWithParam, commonSubmitForm} from "../../../Util/ActionUtil";
import * as actionCreators from "../../PurchaseOrder/PurchaseOrder/Action";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';

class PoLineItemDetails extends Component {
  
  constructor (props) {
    super(props)
    this.state = {      
        deliveryScheduleAnnual:"",
        uom: "",
        lineItemNumber:"",
        deliveryDate:"",
        plant:"",
        deliveryStatus:"",
        controlCode:"",
        trackingNmber:"",
        deliveryQuantity:"",
        balanceQuantity:"",

      }
    }




async componentWillReceiveProps(props){
  
}
async componentDidMount(){
   
 }

render() {
   
    return (
      <div className="w-100">  
        <FormWithConstraints>
        <div className="col-sm-12 mt-3">
        
        <div className="row">  
            <label className="col-sm-2" >Delivery Date</label>
            <span className="col-sm-2" >
                {this.props.data.deliveryDate}
            </span>         
            <label className="col-sm-2">Delivery Status</label>
            <span className="col-sm-2" >
                {this.props.data.deliveryStatus}
            </span>  
                              
            <label className="col-sm-2">Control Code</label>
            <span className="col-sm-2" >
                {this.props.data.controlCode}
            </span>
            </div>
        <div className="row mt-2"> 
        <label className="col-sm-2" >Tracking No</label>
        <span className="col-sm-2" >
            {this.props.data.trackingNmber}
        </span>       
        <label className="col-sm-2">Delivery Schedule for Annual Orders</label>
        <span className="col-sm-2" >
            {this.props.data.deliveryScheduleAnnual}
        </span>
        <label className="col-sm-2">Basic Price</label>
        <span className="col-sm-2" >
            {this.props.data.basicPrice}
        </span>
        </div>
        <div className="row mt-2">  
        <label className="col-sm-2">Overdeliv. Tol</label>
        <span className="col-sm-2" >
            {this.props.data.overDeliveryTol}
        </span>
        <label className="col-sm-2">Underdel. Tol</label>
        <span className="col-sm-2" >
            {this.props.data.underdeliveryTol}
        </span>
        </div>
        </div>     
        </FormWithConstraints>            
      </div>
    );
  }
}


export default PoLineItemDetails;