import React, { Component } from "react";

import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil"; 

import { isEmpty } from "lodash";
import { formatDateWithoutTime,formatDateWithoutTimeNewDate2 } from "./../../Util/DateUtil";
import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "./../../Util/CommonUtil";

import { isServicePO } from "../../Util/AlkylUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import VendorDashboardRightPane from "../BodyContent/VendorDashboardRightPane"
let url = "/rest/getPurchaseOrderAndPartner";
class VendorDashboardCont extends Component {
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
            purchaseOrderNumber:"",
            poDate:"",
            vendorCode:"",
            vendorName:"",
            incomeTerms:"",
            purchaseGroup:"",
            versionNumber:"",
            status:"",
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
        };
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
    
    getPurchaseOrderFromObj(po){
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
        poId : po.purchaseOrderId,
        purchaseOrderNumber: po.purchaseOrderNumber,
        poDate: formatDateWithoutTimeNewDate2(po.date),
        vendorCode: removeLeedingZeros(po.vendorCode),
        vendorName: po.vendorName,
        incomeTerms: po.incomeTerms,
        purchaseGroup: po.purchaseGroup,
        versionNumber: po.versionNumber,
        status: po.status,
        documentType: po.documentType,
        poAtt: att,
        requestedBy: reqBy,
        isServicePO : isServicePO(po.pstyp),
        pstyp:po.pstyp,
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
      commonSubmitWithParam(this.props,"getPurchaseOrder",url);
      this.changeLoaderState(true);
    }
    
    componentWillReceiveProps(props){
      if(this.state.loadPurchaseOrderList && !isEmpty(props.purchaseOrderList)){
        this.changeLoaderState(false);
        let poList = [];
        props.purchaseOrderList.map((po)=>{
          poList.push(this.getPurchaseOrderFromObj(po));
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
      this.setState(prevState => ({filter:{...prevState.filter,[key]:value}}));
    }
    
    onFilter = () => {
      const {filter} = this.state;
      let params = {}
      let arr = ['poDateFrom','poDateTo','poNoFrom','poNoTo','empCode','vendorCode'];
      !isEmpty(arr) && arr.map((item) => {
        if(!isEmpty(filter[item])) params = {...params,[item]: filter[item]}
        return item;
      });
      this.onFetch(params)
    }
    
    onFetch = () => {
      this.setState({
        loadPurchaseOrderList: true,
        loadRole: true,
        loadPartner: true,
        loadUser : true
      });
      commonSubmitWithObjectParams(this.props,"getPurchaseOrder","/rest/getPOforVendor");
      this.changeLoaderState(true);
    }
    
    render() {
      console.log("podetails....."+this.state.purchaseOrder)
        return (
          <>
          <Loader isLoading={this.state.isLoading} />
          {/* {(this.state.role==="VENADM")?<VendorDashboardHeader/>:<UserDashboardHeader/>} */}
          {/* <div className="page-content">
          <div className="wizard-v1-content"> */}
              {/* <PurchaseOrderLeftPane changePO={this.liClick} poList={this.state.poArray}/> */}
              <VendorDashboardRightPane filter={this.state.filter} onFilterChange={this.onFilterChange} onFilter={this.onFilter} poList={this.state.poArray}
              updatePO={this.updatePO} changeLoaderState={this.changeLoaderState} purchaseOrder={this.state.purchaseOrder} 
              role={this.state.role} poStatus={this.state.purchaseOrderStatusList}
              user={this.state.user}/>
          {/* </div>
          </div> */}
          </>
        );
      }
    }
    const mapStateToProps=(state)=>{
      return state.userDashBoardMainReducer;
    };
    export default connect (mapStateToProps,actionCreators)(VendorDashboardCont);