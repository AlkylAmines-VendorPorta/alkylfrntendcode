import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil";
//import AdvanceShipmentNoticeLeftPane from "./AdvanceShipmentNoticeLeftPane";
import GateEntryforCommercialRightPane from "./GateEntryforCommercialRightPane";
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import Loader from "../FormElement/Loader/LoaderWithProps";
import moment from "moment";
let url = "/rest/getSalesOrderList";
class GateEntryforCont extends Component {
  
  constructor (props) {
    super(props)    
    this.state={
      isLoading:false,
      loadPoStatus:true,
      activeItem: 0,
      loadPurchaseOrder:false,
      loadPurchaseOrderList:false,
      purchaseOrderStatusList:[],
      poArray:[],
      purchaseOrder:{        
        requestNo : "",
        custBlockStatus: "",
        plant: "",
        saleOrdNo: "",
        date: "",
        deliveryDate: "",
        soldToParty: "",
        soldToPartyName: "",
        material: "",
        qty: "",
        balanceDeliveryQty: "",
        basicRate: "",
        inwardTransporter: "",
        outwardTransporter: "",
        inco: "",
        inco1:"",
        message: "",
        sucess: false,
        poAtt:{
          attachmentId:"",
          fileName:""
        },
        requestedBy:{
          userId: "",
          name: "",
          empCode:""
        },
        pstyp:"",
        isServicePO:false
      },
      partner:"",
      user:"",
      role:"",
      loadPartner: false,
      loadRole: false,
      loadUser: false,
      filter:{

      }
    }
  }

  changeLoaderState = (action) =>{
    this.setState({
      isLoading:action
    });
  }

  liClick = (poIndex) => {
    let po = this.state.poArray[poIndex];
  this.setState({
    purchaseOrder: po
  });
  
  }
fetchedData = (apiUrl = url) => {
  this.setState({
    loadPurchaseOrderList: true,
    loadRole: true,
    loadPartner: true,
    loadUser : true
  });
  commonSubmitWithParam(this.props,"getSapsalesOrder",url);
  this.changeLoaderState(true);
}

  componentWillReceiveProps(props){
    // purchaseOrderStatusList
    if(this.state.loadPurchaseOrderList && !isEmpty(props.SapSalesOrderStatusList)){
      this.changeLoaderState(false);
      let poList = [];
      props.SapSalesOrderStatusList.map((po)=>{
        poList.push(this.getSapSalesOrderFromObj(po));
      });
  
      this.setState({
        poArray : poList
      });
    }else{
      this.changeLoaderState(false);
    }
  
    if(this.state.loadPartner && !isEmpty(props.partner)){
      this.changeLoaderState(false);
      this.setState({
        loadPartner:false,
        partner : props.partner
      });
    }else{
      this.changeLoaderState(false);
    }
  
    if(this.state.loadUser && !isEmpty(props.user)){
      this.changeLoaderState(false);
      this.setState({
        loadUser: false,
        user : props.user
      });
    }else{
      this.changeLoaderState(false);
    }
  
    if(this.state.loadRole && !isEmpty(props.role)){
      this.changeLoaderState(false);
      this.setState({
        loadRole:false,
        role : props.role
      });
    }else{
      this.changeLoaderState(false);
    }
    if(this.state.loadPoStatus && !isEmpty(props.purchaseOrderStatusList)){
      this.changeLoaderState(false);
  
      this.setState({
  
        purchaseOrderStatusList:props.purchaseOrderStatusList
      })
    }else{
      this.changeLoaderState(false);
    }
  }
  

  onFilterChange = (key,value) => {
    // const valueFormating = moment(value).format('YYYYMMDD');
    // console.log("valueFormating",valueFormating)
    this.setState(prevState => ({filter:{...prevState.filter,[key]:value}}));
  }

  onFilter = () => {
    const {filter} = this.state;
    let params = {}
    let arr = ['fdate','tdate'];
    !isEmpty(arr) && arr.map((item) => {
      if(!isEmpty(filter[item])) params = {...params,[item]: filter[item]}
      return item;
    });
    this.onFetch(params)
  }

  onFetch = (params) => {
    const fdate = moment(params.fdate).format('YYYYMMDD');
    const tdate = moment(params.tdate).format('YYYYMMDD');

  // console.log("params",fdate)
  this.setState({
    loadPurchaseOrderList: true,
    loadRole: true,
    loadPartner: true,
    loadUser : true
  });
  // eat/rest/getPOByFilter

  commonSubmitWithObjectParams(this.props,"getSapsalesOrder",`/rest/getSalesOrderList/${fdate}/${tdate}`,);
  // this.changeLoaderState(true);
}


  render() {
    return (
      <>
       <Loader isLoading={this.state.isLoading} />
      {window.location.href.endsWith("gateentry")?<UserDashboardHeader/>:<VendorDashboardHeader/>}
      
      <div className="page-content">
        <div className="wizard-v1-content mt-100">
          {/* <AdvanceShipmentNoticeLeftPane /> */}
          <GateEntryforCommercialRightPane filter={this.state.filter} 
          onFilterChange={this.onFilterChange} onFilter={this.onFilter} 
          purchaseOrder={this.state.purchaseOrder}  
          changeLoaderState={this.changeLoaderState}/>
        </div>
      </div>
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.gateEntryforCommercialContReducer;
};
export default connect (mapStateToProps,)(GateEntryforCont);