import React, { Component } from "react";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import moment from "moment";
import {commonSubmitWithParam, commonSubmitForm, showAlert} from "../../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo} from "../../../Util/DataTable";
// import * as actionCreators from "../../sapsalesorder/sapsalesOrder/Action";
import * as actionCreators from "../Action";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import StickyHeader from "react-sticky-table-thead";
import {formatDateWithoutTime, formatDateWithoutTimeWithMonthName,formatDateWithoutTimeNewDate} from "../../../Util/DateUtil";
import { removeLeedingZeros, getCommaSeperatedValue, getDecimalUpto } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { API_BASE_URL } from "../../../Constants";
import { isServicePO } from "../../../Util/AlkylUtil";
import { submitForm, submitToURL,savetoServer } from "../../../Util/APIUtils";
import { rest } from "lodash-es";
import { Link } from "react-router-dom";

class SapsalesOrder extends Component {
  
  constructor (props) {
    
    super(props)
    this.state = {
      vendorNameShown:"",
      vendorCodeShown:"",
      newPoStatus:"",
      buttonText:"",
      ASN:"Create ASN",
      displayDivFlag:"block",
      loadPODetails: false,
      loadPOLine:false,
      loadPOLineList:false,
      loadDocumentTyeList:false,
      loadPOLineConditions:false,
      poLineArray:[],
      SapSalesOrderStatusList: [],
      documentTypeList: [], 
      currentPOLine:{
        poLineId:"",
        lineItemNumber:"",
        poQuantity:"",
        rate:"",
        currency:"",
        deliveryDate:"",
        plant:"",
        deliveryStatus:"",
        controlCode:"",
        trackingNmber:"",
        overDeliveryTol:"",
        underdeliveryTol:"",
        deliveryScheduleAnnual:"",
        deliveryQuantity:"",
        balanceQuantity:"",
        forwardingCondition:"",
        freightCondition:"",
        unloadingCharges:"",
        taxConditions:"",
        basicPrice:"",
        materialCode: "",
        material: "",
        uom: "",
        asnQuantity:"",
        grnQuantity:"",
        batch:""
      },
     message: "",
     sucess: false,
     
      poLineConditionArray:[],
      po:{        
        requestNo : "",
        custBlockStatus: "",
        plant: "",
        saleOrderNo: "",
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
        isServicePO:false,
        pstyp:"",
        isSapsalesOrder:true
      },
      serviceArray:[],
      loadServiceList:false,
      currentPOIndex:"",
      costCenterList:[],

    }
}





getPOLineConditionFromObj = (pOLineConditionObj) =>{
  return {
    conditionName : pOLineConditionObj.condition.name,
    conditionValue: pOLineConditionObj.code
  }
}

loadPOLine(row){
  this.setState({
    currentPOLine : row
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
  if(!isEmpty(po.createdBy)){
    reqBy = {
      userId: po.createdBy.userId,
      name: po.createdBy.name,
      empCode: po.createdBy.userName
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
    poDate: formatDateWithoutTimeWithMonthName(po.date),
    vendorCode: removeLeedingZeros(po.vendorCode),
    vendorName: po.vendorName,
    incomeTerms: po.incomeTerms,
    purchaseGroup: po.purchaseGroup,
    versionNumber: po.versionNumber,
    status: po.status,
    documentType: po.documentType,
    poAtt: att,
    requestedBy: reqBy,
    pstyp:po.pstyp,
    isServicePO:isServicePO(po.pstyp)
  }
}

onClickPOLine = (poLine) =>{

  this.setState({
    currentPOLine : poLine
  });
    // loadServiceList : true
  // commonSubmitWithParam(this.props,"getServiceListForPOLine","/rest/getServicesListByPOLineId",poLine.poLineId);

}

async componentWillReceiveProps(props){
    console.log("SapSalesOrderStatusListprops",props)
  // this.setState({SapSalesOrderStatusList: props.SapSalesOrderStatusList })
  // console.log("this",this.state.SapSalesOrderStatusList)
  // getSsoLines
  // if(this.state.loadPurchaseOrderList && !isEmpty(props.getSsoLines)){
      
  //   this.changeLoaderState(false);
  // //   // this.setState(this.state.message :  props.getSsoLines.message);
  
  // }
  let arr =[]
  if(!isEmpty(props.poList)){
    arr.push(props.poList)
  }
  
  
}
 
getASNHistory(){
  this.setState({
    loadASNListForPO : true
  });
  commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",this.state.po.poId);
  this.props.changeLoaderState(true);
  this.props.goASNHistory(this.state.costCenterList)
}

rejectPO = () =>{
  swal("Enter reason for rejection", {
    content: "input",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    // button:"Submit",
    buttons: true,
    dangerMode:true,

  })
  .then((value) => {
    // this.setState({loadPODetails: true}); 
    // commonSubmitWithParam(this.props,"poAcceptance","/rest/rejectPO",this.state.po.poId,value);
  }).catch(err => {
  });
}




loadPODetails(index,e){
   // console.log("index",index)
    // this.props.changeLoaderState(true);

    // let po = this.props.SapSalesOrderStatusList[index];
    
    // submitToURL(`/rest/createVehicleRegistartion/${po.saleOrdNo}`).then((res)=>{
      

    //   if(res.success == true){
    //     alert("done")
    //     showAlert(false,res.message)
    //     this.setState({sucess: res.sucess})
    //     this.props.updateButtonStatus(po,index);
    //     // this.setState({SapSalesOrderStatusList: this.props.SapSalesOrderStatusList})
    //     // this.props.updateButtonStatus(po,index);
        
    //   this.props.changeLoaderState(false);
    //   // return;
    //   // this.props.actionCreators(res,index);
      
      
    // }
    // else if(res.success == false){
    //   alert("not")
    //   showAlert(true,res.message)
    //   this.props.changeLoaderState(false);
    // }
    
    

    //   // this.setState({message: res.message})
    //   // this.setState({sucess: res.sucess})
    
    // })
    this.props.changeLoaderState(true);
    let po = this.props.SapSalesOrderStatusList[index];

    let urls = `/rest/getSalesOrderDetails/${po.saleOrdNo}`
    savetoServer({urls}).then((res) => {


    if(res.message=="GSTIN Not Active"){

      swal("GSTIN is Not Active,Still Would You Like To Proceed for Request No?", {
        buttons: {
          yes: {
            text: "Yes",
            value: "yes"
          },
          no: {
            text: "No",
            value: "no"
          }
        }
      }).then((value) => {
        if (value === "yes") {
               // Add Your Custom Code for CRUD
          this.onGenerateRequest(po,index)
         
        }
        else
        {
        this.props.changeLoaderState(false);
        return false;
        }
      });    
      }
      else{
        this.onGenerateRequest(po,index)
        
      }
    })
  
  }
  

onGenerateRequest = (po,index) => {
  
  submitToURL(`/rest/createVehicleRegistartion/${po.saleOrdNo}`).then((res)=>{      
    if(res.success == true){
    //alert("done")
    showAlert(false,res.message)
    this.setState({sucess: res.sucess})
    this.props.updateButtonStatus(po,index);
    // this.setState({SapSalesOrderStatusList: this.props.SapSalesOrderStatusList})
    // this.props.updateButtonStatus(po,index);
    
  this.props.changeLoaderState(false);
  // return;
  // this.props.actionCreators(res,index);
  
  
}
else if(res.success == false){
  //alert("not")
  showAlert(true,res.message)
  this.props.changeLoaderState(false);
}
})

 
 }

handleFilterChange = (key,event) => {
 
  this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);
}

handleFilterClick = () => {
  if(this.props.filter.fdate!=""|| this.props.filter.tdate!=""){
  this.props.changeLoaderState(true);
  this.props.onFilter &&  this.props.onFilter()
  }else{
    window.alert('Date Cannot be null')

      return false;
  }
  // this.props.changeLoaderState(false)
}


onClickVehicleRegistration(index){


  let po = this.props.SapSalesOrderStatusList[index];

  //  <Link to="/vehicalRegistration"></Link>

}

render() {
  const {filter} = this.props;
  var displayService="none"; 
  // console.log("this",this.props.SapSalesOrderStatusList)
  
  
  if(!isEmpty(this.state.serviceArray)){

  displayService="block";
  }
  var shown = {
    display: this.state.shown ? "block" : "none"
  };
  var hidden = {
    display: this.state.hidden ? "none" : "block"
      }
    return (
      <div className="w-100" id="togglesidebar">
        <div style={ hidden} className="mt-70 boxContent">
      {/* <h5>Purchase Order List</h5>
      <hr className="w-100"></hr> */}
      <FormWithConstraints>
      <div className="row">
        <div className="col-sm-12">
       
        <div className="row mt-2">
                     
            </div>
            </div>

        <div className="col-sm-12">

            <div className="row mt-2">
                      <label className="col-sm-2 mt-4">Sap Order Date<span className="redspan">*</span></label>
                      <div className="col-sm-4">
                        <label>From </label>
                        <input type="date" required={true} className="form-control" name="fdate"   value={filter.fdate} onChange={this.handleFilterChange.bind(this,'fdate')} />
                      </div>
                
                      <div className="col-sm-4">
                        <label>To </label>
                        <input type="date" required={true} className="form-control" name="tdate" value={filter.tdate} onChange={this.handleFilterChange.bind(this,'tdate')} />
                      </div>


            </div>

        </div>
      </div>

        <div className="row mt-4">
        <label className="col-sm-2 mt-4">Plant </label>
                            <div className="col-sm-2">

                              <input type="text" className="form-control" name="plant" value={filter.plant} onChange={this.handleFilterChange.bind(this,'plant')}
                                
                              />
                            </div>
          
           
                           
        </div>


        <div className="row mt-4">
                      <div className="col-sm-3">
                          <button type="button" className={"btn btn-primary"} onClick={this.handleFilterClick.bind(this)}> Search </button>
                      </div>


        </div>
        <div className="row">
        <div className="col-sm-8"></div>
        <div className="col-sm-4">                          
        <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Table Search .." /> 
        </div>
         </div>       
        <div className="row">

        <div className="col-sm-6">

        </div>

        <div className="col-sm-6">

        <div className="row mt-2">
        <div className="col-sm-4"></div>
           <div className="col-sm-8">
            {/* <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." /> */}
            </div>
        </div>

        </div>

        </div>

      
      <div>
            {/* <div className="col-sm-3">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
            </div> */}
                <div className="col-sm-12 mt-2">
                <div class="table-proposed">
                <StickyHeader height={360} className="table-responsive width-adjustment">
                     <table className="table table-bordered table-header-fixed">
                       <thead>
                         <tr>                          
                           <th>Request No</th>
                           <th className="text-center">Cust Blk</th>
                           <th className="text-center" >Plant</th>
                           <th >Sales Ord No </th>
                           <th>Date</th>
                           <th>Delivery Date</th>
                           <th>Sold To Party- Sold To Party Name</th>
                           {/* <th>Sold To Party Name </th> */}
                           {/* <th>Material</th> */}
                           <th>Material Desc</th>
                           <th>Qty</th>
                           <th>Vehicle Type</th>
                           {/* <th>Balance Delivery Qty</th>
                           <th>Basic Rate</th> */}
                           <th>Inward Transporter</th>
                           <th>Outward Transporter</th>
                           <th>inco</th>
                           <th>inco1</th>
                           {/* <th className="text-center">Version No</th> */}
                           {/* <th>Status</th>  */}
                         </tr>
                       </thead>
                       <tbody id="DataTableBody">
                            {
                              !isEmpty(this.props.SapSalesOrderStatusList) ?  this.props.SapSalesOrderStatusList.map((po,index)=>
                              
                                
                              <tr>
                              {po.requestNo == null && po.custBlockStatus == "@08@"    ? <td> <button  onClick={()=>{this.loadPODetails(index)}} key={index}  type="button" class="btn btn-outline-primary"  >Create</button></td> :<td key={index}>{po.requestNo}</td>}
                               {po.custBlockStatus == "@08@"? <td onClick={()=>{this.props.SapSalesOrderList(po)}} style={{height: "25px",width: "25px",backgroundColor: "green",borderRadius: "50%",display: "inline-block",margin: 18}} ></td> :<td style={{height: "25px",width: "25px",backgroundColor: "red",borderRadius: "50%",display: "inline-block",margin: 18}} ></td> }
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}} className="text-center">{po.plant}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}} className="text-center" >{po.saleOrdNo}</td>
                               {/* <td >{moment(po.date).format("ll")}</td> */}
                               {/* <td >{moment(po.date).format("ll")}</td> */}
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}} >{formatDateWithoutTime(po.date)}</td>
                              
                               {/* <td>{moment(po.deliveryDate).format("ll")}</td> */}
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}} >{formatDateWithoutTime(po.deliveryDate)}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.soldToParty+"-"+po.soldToPartyName}</td>
                               {/* <td>{po.soldToPartyName}</td> */}
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.material+"-"+po.materialDesc}</td>
                               {/* <td>{po.materialDesc}</td> */}
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.qty}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.vehicleType}</td>
                               {/* <td>{po.balanceDeliveryQty}</td> */}
                               {/* <td>{po.basicRate}</td> */}
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inwardTransporter}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.outwardTransporter}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inco}</td>
                               <td onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inco1}</td>
                             
                             </tr>
                              )
                            : ""}
                        
                       </tbody>
                     </table>
                     </StickyHeader>
                  </div>
                    </div>
                 </div>
      </FormWithConstraints>   
      </div> 
                 
       </div>
    );
  }
}

const mapStateToProps=(state)=>{
  // console.log('state.ssoReducer',state.ssoReducer); 
        return {SapSalesOrderStatusList:state.ssoReducer.SapSalesOrderStatusList};
};

export default connect (mapStateToProps,actionCreators)(SapsalesOrder);