import React, { Component } from "react";
import {connect} from 'react-redux';
import {isEmpty} from "../../Util/validationUtil";
import * as actionCreators from "./Action";
//import PurchaseOrderLeftPane from "./PurchaseOrderLeftPane";
import SapsalesOrderRightPane from "./sapsalesOrderRightPane";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import VendorDashboardHeader from "../Header/VendorDashboardHeader";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil";
import {formatDateWithoutTime, formatDateWithoutTimeNewDate2} from "../../Util/DateUtil";
import { removeLeedingZeros } from "../../Util/CommonUtil";
import { isServicePO } from "../../Util/AlkylUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import moment from "moment";
let url = "/rest/getSalesOrderList";
class SapSalesOrderCont extends Component {
  
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
        fdate:"",
        tdate:"",
        plant:""
      }
    };
}
clearFilter = () => {
  this.setState({
    filter:{
      fdate:"",
      tdate:"",
      plant:""
    }
  })
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

updatePO = (index,po) =>{
  var poArr = this.state.poArray;
  poArr[index] = po;
  this.setState({
    poArray:poArr
  })
}

getSapSalesOrderFromObj(po){
  
  let att; 
  if(!isEmpty(po.poAtt)){
    att= po.poAtt;
  }else{
    att = {
      attachmentId:"",
      fileName:""
    }
  }

  let reqBy;
  if(!isEmpty(po.reqby)){
    reqBy = {
      userId: po.reqby.userId,
      name: po.reqby.name,
      empCode: po.reqby.userName
    };
  }else{
    reqBy = {
        userId: "",
        name: "",
        empCode:""
      }
  }

  return {
        requestNo : po.requestNo,
        custBlockStatus: po.custBlockStatus,
        plant: po.plant,
        saleOrdNo: po.saleOrdNo,
        date: po.date,
        deliveryDate: po.deliveryDate,
        soldToParty: po.soldToParty,
        soldToPartyName: po.soldToPartyName,
        material: po.material,
        materialDesc: po.materialDesc,
        qty: po.qty,
        balanceDeliveryQty: po.balanceDeliveryQty,
        basicRate: po.basicRate,
        inwardTransporter: po.inwardTransporter,
        outwardTransporter: po.outwardTransporter,
        inco: po.inco,
        inco1:po.inco1,
    
  }
}

componentDidMount(){
  // this.fetchedData()
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
     props.SapSalesOrderStatusList && props.SapSalesOrderStatusList.map((po)=>{
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
  let arr = ['fdate','tdate','plant'];
  !isEmpty(arr) && arr.map((item) => {
    if(!isEmpty(filter[item])) params = {...params,[item]: filter[item]}
    return item;
  });
  this.onFetch(params);
  this.clearFilter();
}

onFetch = (params) => {
    const fdate = moment(params.fdate).format('YYYYMMDD');
    const tdate = moment(params.tdate).format('YYYYMMDD');
    const plant=params.plant;
  // console.log("params",fdate)
  this.setState({
    loadPurchaseOrderList: true,
    loadRole: true,
    loadPartner: true,
    loadUser : true
  });
   // eat/rest/getPOByFilter
  // commonSubmitWithObjectParams(this.props,"getSapsalesOrder",`/rest/getSalesOrderList/${fdate}/${tdate}`,);
 //commonSubmitWithObjectParams(this.props,"getSapsalesOrder",`/rest/getSalesOrderList/${fdate}/${tdate}/${plant}`,);
 commonSubmitWithObjectParams(this.props,"getSapsalesOrder",'/rest/getSalesOrderList/',params);
 // commonSubmitWithObjectParams(this.props,"getPurchaseOrder",'/rest/getPOByFilter',params);
 // this.changeLoaderState(true);
}

render() {
  console.log('container',this.props.SapSalesOrderStatusList)
    return (
      <>
      <Loader isLoading={this.state.isLoading} />
      {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>}
      {/* <div className="page-content">
      <div className="wizard-v1-content"> */}
          {/* <PurchaseOrderLeftPane changePO={this.liClick} poList={this.state.poArray}/> */}
          <SapsalesOrderRightPane filter={this.state.filter} onFilterChange={this.onFilterChange} onFilter={this.onFilter} SapSalesOrderStatusList={this.state.poArray} 
          updatePO={this.updatePO} changeLoaderState={this.changeLoaderState} purchaseOrder={this.state.purchaseOrder} 
          role={this.state.role} poStatus={this.state.purchaseOrderStatusList}
          user={this.state.user}
          onClearFilter={this.clearFilter}/>
      {/* </div>
      </div> */}
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.ssoReducer;
};
export default connect (mapStateToProps,actionCreators)(SapSalesOrderCont);