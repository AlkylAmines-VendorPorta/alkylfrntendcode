import React, { Component } from "react";
import alkylLogo from "../../../img/help.png";
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import {commonSubmitWithParam, commonSubmitForm,commonHandleChange} from "../../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo} from "../../../Util/DataTable";
import * as actionCreators from "../../PurchaseOrder/PurchaseOrder/Action";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import StickyHeader from "react-sticky-table-thead";
import {formatDateWithoutTime, formatDateWithoutTimeWithMonthName} from "../../../Util/DateUtil";
import { removeLeedingZeros, getCommaSeperatedValue, getDecimalUpto } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { API_BASE_URL } from "../../../Constants";
import { isServicePO } from "../../../Util/AlkylUtil";
import AdvanceShipmentNotice from "../../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import NewHeader from "../../NewHeader/NewHeader";
class PurchaseOrder extends Component {
  
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
      //nikhil code 25-07-2022
      partner: {
        partnerId:"",
        email:"",
        companyName:"",
        mobileNo:"",
        name: "",
        firstName:"",
        middleName:"",
        lastName:""
      },
      partnerList: [],
          isUserInvited:true,
          inviteMessage:"",
          companyList : [],
          //nikhil code 25-07-2022
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
        balanceQuantity1:"",
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
        batch:"",
        balanceLimit: "",
      },
      poLineConditionArray:[],
      po:{        
        poId: "",
        purchaseOrderNumber: "",
        poDate: "",
        vendorCode: "",
        vendorName: "",
        incomeTerms: "",
        purchaseGroup: "",
        versionNumber: "",
        status: "",
        documentType: "",
        plant:"",
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
        prDate:""
      },
      serviceArray:[],
      loadServiceList:false,
      currentPOIndex:"",
      costCenterList:[],
     //ssnFundList:[],
       
    }
}

getPOLineFromObj(poLineObj){
  return {
    poLineId : poLineObj.purchaseOrderLineId,
    lineItemNumber: poLineObj.lineItemNumber,
    currency: poLineObj.currency,
    deliveryDate: formatDateWithoutTimeWithMonthName(poLineObj.deliveryDate),
    plant:poLineObj.plant,
    deliveryStatus:poLineObj.deliveryStatus,
    controlCode:poLineObj.controlCode,
    trackingNmber:poLineObj.trackingNmber,
    deliveryScheduleAnnual:poLineObj.deliveryScheduleAnnual,
    poQuantity: poLineObj.poQuantity,
    rate: poLineObj.rate,
    asnQuantity : poLineObj.asnQuantity,
    deliveryQuantity: poLineObj.deliveryQuantity,
    balanceQuantity: poLineObj.balanceQuantity,
    materialCode: removeLeedingZeros(poLineObj.code),
    material: poLineObj.name,
    uom: poLineObj.uom,
    balanceLimit: poLineObj.balanceLimit,
    balanceQuantity1: poLineObj.balanceQuantity1,
    grnQuantity: poLineObj.grnQuantity,
    batch: poLineObj.batch
  }
}

getServiceFromObj(service){
  return {
    poLineId : service.purchaseOrderLineId,
    lineItemNumber: service.lineItemNumber,
    currency: service.currency,
    deliveryDate: formatDateWithoutTimeWithMonthName(service.deliveryDate),
    plant:service.plant,
    deliveryStatus:service.deliveryStatus,
    controlCode:service.controlCode,
    trackingNmber:service.trackingNmber,
    deliveryScheduleAnnual:service.deliveryScheduleAnnual,
    poQuantity: service.poQuantity,
    rate: service.rate,
    asnQuantity : service.asnQuantity,
    deliveryQuantity: service.deliveryQuantity,
    balanceQuantity: service.balanceQuantity,
    materialCode: removeLeedingZeros(service.code),
    material: service.name,
    uom: service.uom,
    balanceLimit: service.balanceLimit,
    balanceQuantity1: service.balanceQuantity1,
    parentPOLineId: service.parentPOLine.purchaseOrderLineId,
    parentPOlineNumber:service.parentPOLine.lineItemNumber,
    grnQuantity: service.grnQuantity,
    contractPo:service.purchaseOrder.contractPo,
    balanceLimit:service.purchaseOrder.balanceLimit
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
    isServicePO:isServicePO(po.pstyp),
    prDate:formatDateWithoutTimeWithMonthName(po.prDate),
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
   if(!isEmpty(props.role)){
     this.props.changeLoaderState(false);
    this.setState({

      vendorNameShown:props.role==="VENADM"?"none":"",
      vendorCodeShown:props.role==="VENADM"?"none":"",
    })
   }

   if(!isEmpty(props.newPoStatus)){
    this.props.changeLoaderState(false);
    this.setState({
      newPoStatus: props.newPoStatus
    });
  }else{
    this.props.changeLoaderState(false);
  }



  if (!isEmpty(props.costCenterList)) {
    this.props.changeLoaderState(false);
    let costArray = Object.keys(props.costCenterList).map((key) => {
      return { display: props.costCenterList[key], value: key }
    });
    this.setState({
      costCenterList: costArray
    })
  }

  // if (!isEmpty(props.ssnFundList)) {
  //   this.props.changeLoaderState(false);
  //   let fundArray = Object.keys(props.ssnFundList).map((key) => {
  //     return { display: props.ssnFundList[key], value: key }
  //   });
  //   this.setState({
  //     ssnFundList: fundArray
  //   })
  // }

   if(!isEmpty(props.documentTypeList) && this.state.loadDocumentTyeList){
     this.props.changeLoaderState(false);
      let documentTypeArray = Object.keys(props.documentTypeList).map((key) => {
        return {display: props.documentTypeList[key], value: key}
      });
      this.setState({
        documentTypeList: documentTypeArray
      })
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPOLineList && !isEmpty(props.poLineList)){
      this.props.changeLoaderState(false);
      let poLineList = [];
      
      props.poLineList.map((poLine)=>{
        poLineList.push(this.getPOLineFromObj(poLine));
      });
      this.setState({
        poLineArray : poLineList
      });
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadServiceList && !isEmpty(props.serviceList)){
      this.props.changeLoaderState(false);
      let serviceList = [];
      
      props.serviceList.map((service)=>{
        serviceList.push(this.getServiceFromObj(service));
      });
      this.setState({
        loadServiceList : false,
        serviceArray : serviceList
      });


    }else if(this.state.loadServiceList && isEmpty(props.serviceList)){
      this.props.changeLoaderState(false);
      this.setState({
        loadServiceList : false,
        serviceArray : []
      });
    }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPOLineConditions &&!isEmpty(props.poLineConditionList)){
      this.props.changeLoaderState(false);
      let poLineConditionList = [];
      props.poLineConditionList.map((poLineCondition)=>{
        poLineConditionList.push(this.getPOLineConditionFromObj(poLineCondition));
      });
      this.setState({
        poLineConditionArray : poLineConditionList
      });
   }else{
      this.props.changeLoaderState(false);
    }

    if(this.state.loadPODetails && !isEmpty(props.purchaseOrder)){
      this.props.changeLoaderState(false);
      let po = this.getPurchaseOrderFromObj(props.purchaseOrder);
      this.setState({
        loadPODetails : false,
        po : po
      });
      this.props.updatePO(this.state.currentPOIndex,po);
    }else{
      this.props.changeLoaderState(false);
    }

    if(!isEmpty(props.asnList) && this.state.loadASNListForPO){
      this.props.changeLoaderState(false);
      this.setState({
        loadASNListForPO : false
      })
      this.props.showASNHistory(props.asnList,this.state.po);
    }else{
      this.props.changeLoaderState(false);
    }
    //nikhil code 25-07-2022
   if(!isEmpty(props.userList) && this.state.loadCompaniList){
      this.setState({
        loadCompaniList: false,
        companyList: props.userList

      })
    }
    if(!isEmpty(props.partner) && this.state.loadSaveResp ){
      this.changeLoaderState(false);
      this.setState({
        loadSaveResp:false,
        partner: {
          partnerId:"",
          email:"",
          companyName:"",
          mobileNo:"",
          name: "",
          firstName:"",
          middleName:"",
          lastName:""
        },
        // partner: action.payload.objectMap.user
        isUserInvited:true,
        inviteMessage:""
      })
    }

    //nikhil code 25-07-2022

}

getASNHistory(){
  this.setState({
    loadASNListForPO : true
  });
  commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",this.state.po.poId);
  this.props.changeLoaderState(true);
 //this.props.goASNHistory(this.state.costCenterList,this.state.ssnFundList)
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

loadPODetails(index){
   let po = this.props.poList[index];
   this.setState({
     loadPOLineList:true,
     shown: !this.state.shown,
     hidden: !this.state.hidden,
     po : po,
     buttonText:po.documentType,
     displayDivFlag:po.isServicePO?"none":"block",
     loadServiceList:true,
     currentPOIndex:index,
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
       balanceLimit: "",
       balanceQuantity1: "",
       asnQuantity:"",
       grnQuantity:"",
       batch:""
     }
   });
   this.props.changeLoaderState(true);
   commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",po.poId);
}

handleFilterChange = (key,event) => {
  this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);
}

handleFilterClick = () => {
  this.props.onFilter &&  this.props.onFilter();
  this.setState({formDisplay: !this.state.formDisplay});
  this.setState({searchDisplay: !this.state.searchDisplay});
  }

  onSelectVendorRow = (partner) => {
    
    console.log('onSelectVendorRow',partner)
   };
render() {
  const {filter} = this.props;
  var displayService="none";
  if(!isEmpty(this.state.serviceArray)){

  displayService="block";
  }
  var shown = {
    display: this.state.shown ? "block" : "none"
  };
  var hidden = {
    display: this.state.hidden ? "none" : "block"
      }
var frmhidden = {
        display: this.state.formDisplay ? "none" : "block"
          }  
          var searchHidden = {
            display: this.state.searchDisplay ? "block" : "none"
              } 
    return (
      <React.Fragment>
      <div className="w-100">
        <div style={ hidden} className="mt-70 boxContent">
      
      <FormWithConstraints>

      <div className="row">
        <div className="col-sm-12">
       
        <div className="row mt-2">
                      <label className="col-sm-2 mt-4">Po No</label>
                      <div className="col-sm-4">
                      <label>From </label>
                        <input type="text" className="form-control"  value={filter.poNoFrom} onChange={this.handleFilterChange.bind(this,'poNoFrom')} />
                      </div>
                
                      <div className="col-sm-4">
                      <label>To </label>
                        <input type="text" className="form-control"  value={filter.poNoTo} onChange={this.handleFilterChange.bind(this,'poNoTo')} />
                      </div>

            </div>
            </div>

        <div className="col-sm-12">

            <div className="row mt-2">
                      <label className="col-sm-2 mt-4">Po Date</label>
                      <div className="col-sm-4">
                        <label>From </label>
                        <input type="date" className="form-control"  value={filter.poDateFrom} onChange={this.handleFilterChange.bind(this,'poDateFrom')} />
                      </div>
                
                      <div className="col-sm-4">
                        <label>To </label>
                        <input type="date" className="form-control"  value={filter.poDateTo} onChange={this.handleFilterChange.bind(this,'poDateTo')} />
                      </div>


            </div>

        </div>
      </div>

        <div className="row mt-4">
        <label className="col-sm-2">Employee code </label>

                      <div className="col-sm-4">
                        <input type="text" className="form-control"  value={filter.empCode} onChange={this.handleFilterChange.bind(this,'empCode')} />
                      </div>
</div>
         <div className="row mt-4">
        <label className="col-sm-2">Vendor code </label>
                      <div className="col-sm-4">
                        <input type="text" className="form-control"  value={filter.vendorCode} onChange={this.handleFilterChange.bind(this,'vendorCode')} />
                      </div>
                        {/* nikhil code 25-07-2022*/}
                      <div>
                        <button  type="button" className={"btn btn-link"} data-toggle="modal" data-target="#searchCompanyModal" ><img src={alkylLogo} alt="" /></button>
                      </div>
                       {/* nikhil code 25-07-2022*/}
                     <div className="col-sm-2">
                          <button type="button" className={"btn btn-primary"} onClick={this.handleFilterClick.bind(this)}> Search </button>
                      </div>


        </div>
         
        <div className="row">

        <div className="col-sm-6">

        </div>

        <div className="col-sm-6">

        <div className="row mt-2">
        <div className="col-sm-4"></div>
           <div className="col-sm-8">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
</div>
    </div>

        </div>

      </div>
      <div>
           {/* <div className="col-sm-3">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
            </div>*/}
               <div className="col-sm-12 mt-2">
                <div class="table-proposed">
                <StickyHeader height={360} className="table-responsive width-adjustment">
                     <table className="table table-bordered table-header-fixed">
                       <thead>
                         <tr>                          
                           <th>PO No</th>
                           {/* <th>Document Type</th> */}
                           <th className="text-center">PO Date</th>
                           <th className="text-center" style={{display:this.state.vendorCodeShown}}>Vendor Code</th>
                           <th style={{display:this.state.vendorNameShown}}>Vendor Name</th>
                           {/* <th>Plant</th> */}
                           {/* <th>Inco Terms </th> */}
                           <th>Requested By</th>
                           {/* <th>Purchase Group</th> */}
                           <th className="text-center">Version No</th>
                           <th>Status</th>
                         </tr>
                       </thead>
                       <tbody id="DataTableBody">
                            {
                              this.props.poList.map((po,index)=>
                                <tr onClick={()=>{this.loadPODetails(index)}}>
                                  <td>{po.purchaseOrderNumber}</td>
                                  {/* <td>{po.documentType}</td> */}
                                  <td className="text-center">{po.poDate}</td>
                                  <td className="text-center" style={{display:this.state.vendorCodeShown}}>{po.vendorCode}</td>
                                  <td style={{display:this.state.vendorNameShown}}>{po.vendorName}</td>
                                  {/* <td>{po.plant}</td> */}
                                  <td>{po.requestedBy.name}</td>
                                  {/* <td>{po.incomeTerms}</td> */}
                                  {/* <td>{po.purchaseGroup}</td> */}
                                  <td className="text-center">{po.versionNumber}</td>
                                  <td>{this.state.newPoStatus[po.status]}</td>
                                </tr>
                              )
                            }

                       </tbody>
                     </table>
                     </StickyHeader>
                  </div>
                    </div>
                 </div>
      </FormWithConstraints>   
      </div> 
                  <br/>
                  <div  style={ shown }>
                    <div  className="boxContent mt-55">
                  <div className="row">
                      <div className="col-sm-12 text-right">
                          <button className="btn btn-primary" type="button" onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden});}}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
                          <a href={API_BASE_URL+"/rest/pdf"} className="btn btn-primary ml-2">Print PO</a>
                          {this.state.po.isServicePO?"":
                          <button type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                          onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)}}
                            // onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.state.ssnFundList,this.props.SSNVersion)}}
                            >
                            
                             {/* {this.state.po.isServicePO?"Create Service Note":"Create ASN"} */}
                             {this.state.po.isServicePO?"":"Create ASN"}
                          </button>}
                          <button type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                             onClick={()=>{this.getASNHistory()}}
                            >
                             {this.state.po.isServicePO?"Service History":"ASN History"}
                          </button>
                          <button type="button" className={(this.state.po.status==="REL" || this.state.po.status==="REJ")?"btn btn-success ml-2 inline-block":"btn btn-success ml-2 none"} 
                            onClick={()=>{this.setState({loadPODetails: true}); commonSubmitWithParam(this.props,"poAcceptance","/rest/acceptPO/",this.state.po.poId)}}>
                             Accept
                          </button>
                          <button type="button"  className={this.state.po.status==="REL"?"btn btn-danger ml-2 inline-block":" btn btn-danger ml-2 none"} 
                            onClick={()=>{this.rejectPO()}}>
                              Reject
                          </button>
                      </div>
                  </div>
                  <hr className="w-100"></hr>
                  <div className="row mt-2">
                      <label className="col-sm-1">PO No</label>
                      <span className="col-sm-2">
                       {this.state.po.purchaseOrderNumber}
                      </span>  
                      <label className="col-sm-2" style={{display:this.state.vendorCodeShown}}>Vendor</label>
                      <span className="col-sm-3" style={{display:this.state.vendorCodeShown}}>
                       {this.state.po.vendorCode}-{this.state.po.vendorName}
                      </span>  
                      <label className="col-sm-1">Version</label>
                      <span className="col-sm-1">
                        {this.state.po.versionNumber}
                      </span>  
                  </div> 
                  <div className="row mt-2">
                      <label className="col-sm-1">PO Date</label>
                      <span className="col-sm-2">
                      {this.state.po.poDate}
                      </span>   
                      <label className="col-sm-2">Requested by</label>
                      <span className="col-sm-3">
                      {this.state.po.requestedBy.name}
                      </span>  
                      
                      <label className="col-sm-1">Status</label>
                      <span className="col-sm-1">
                        {this.state.newPoStatus[this.state.po.status]}
                      </span>  
                  </div> 
                
                  </div>

                 
                  <div className="boxContent fixed-height py-1">
          <div className={"lineItemDiv min-height-0px "+(displayService==="block"?"display_none":"")}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div> 
               <div className="col-sm-12 mt-2">
                  <StickyHeader height={150} className="table-responsive">
                     <table className="table table-bordered table-header-fixed">
                       <thead>
                         <tr>                         
                           <th> Line No </th>
                           <th> Material Description </th>
                           <th className="text-right"> PO Qty </th>
                           <th> UOM </th>
                           {/* <th className="width-120px">ASN Qty </th> */}
                           {/* <th>Bal Qty</th> */}
                           <th className="text-right"> Rate </th>
                           <th>Currency</th> 
                           {/* <th>Plant</th> */}
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">
                            {
                              this.state.poLineArray.map((poLine)=>
                                <tr onClick={()=>this.onClickPOLine(poLine)}>
                                  {/* onClick={()=>this.onClickPOLine(poLine)} */}
                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <td>{removeLeedingZeros(poLine.lineItemNumber)}</td>
                                  <td>{poLine.materialCode} - {poLine.material}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.poQuantity,3))}</td>
                                  <td>{poLine.uom}</td>
                                  {/* <td className="width-120px">{poLine.asnQuantity}</td> */}
                                  {/* <td>{poLine.balanceQuantity}</td> */}
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.rate,2))}</td>
                                  <td>{poLine.currency}</td>
                                  {/* <td>{poLine.plant}</td> */}
                                </tr>
                              )
                     }
                    
                  </tbody>
               </table>
            </StickyHeader>
         </div>
      </div>
   </div>
            <br/>
            <div className="lineItemDiv min-height-0px"  style={{display:displayService}}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div>
               <div className="col-sm-12 mt-2"> 
                  <StickyHeader height={150} className="table-responsive">
                     <table className="table table-bordered table-header-fixed">
                       <thead>
                         <tr>             
                           <th> Po Line No.</th>            
                           <th> Service No.</th>
                           <th className="w-40per">Service Description po</th>
                           <th className="text-right"> Required Qty </th>
                           <th> UOM </th>
                           {/* <th>Completed Qty </th>
                           <th>Bal Qty</th> */}
                           <th className="text-right"> Rate </th>
                           <th>Currency</th> 
                           {/* <th>Plant</th> */}
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">
                            {
                              this.state.serviceArray.map((service,i)=>
                              
                                <tr>

                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <td>{removeLeedingZeros(service.parentPOlineNumber)}</td>
                                  <td>{removeLeedingZeros(service.lineItemNumber)}</td>
                                  <td>{service.materialCode}-{service.material}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.poQuantity,3))}</td>
                                  <td>{service.uom}</td>
                                  {/* <td>{service.asnQuantity}</td>
                                  <td>{service.balanceQuantity}</td> */}
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.rate,2))}</td>
                                  <td>{service.currency}</td>
                                  {/* <td>{poLine.plant}</td> */}
                                </tr>
                              )
                            }
                        
                       </tbody>
                     </table>
                  </StickyHeader>
               </div>
            </div>    
           </div>
      <FormWithConstraints>
      <div className="row"  style={{display:this.state.displayDivFlag}}>  
        <div className="col-sm-12 mt-2">
        
        <div className="row">  
            <label className="col-sm-2">Delivery Date</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.deliveryDate}
            </span>         
            <label className="col-sm-2">Delivery Status</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.deliveryStatus}
            </span>  
                              
            <label className="col-sm-2">Control Code</label>
            <span className="col-sm-2">
                {this.state.currentPOLine.controlCode}
            </span>
            </div>
        <div className="row mt-2"> 
        <label className="col-sm-2">ASN Qty</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.asnQuantity}
        </span>   
        <label className="col-sm-2">GRN Qty</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.grnQuantity}
        </span>  
        <label className="col-sm-2">Plant</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.plant}
        </span> 
            
        {/* <label className="col-sm-2">Delivery Schedule for Annual Orders</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.deliveryScheduleAnnual}
        </span> */}
        {/* <label className="col-sm-2">Basic Price</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.basicPrice}
        </span> */}
        </div>
        <div className="row mt-2">
          <label className="col-sm-2">Batch</label>
          <span className="col-sm-2">
              {this.state.currentPOLine.batch}
          </span>
        </div>
        {/* <div className="row mt-2">  
        <label className="col-sm-2">Overdeliv. Tol</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.overDeliveryTol}
        </span>
        <label className="col-sm-2">Underdel. Tol</label>
        <span className="col-sm-2">
            {this.state.currentPOLine.underdeliveryTol}
        </span>
        </div> */}
        </div>     
        </div>     
        </FormWithConstraints>    
                 {/* <h5>Conditions</h5>
      <hr className="w-100"></hr>
                 <FormWithConstraints>
          <div className="row">  
                {
                  this.state.poLineConditionArray.map((poLineCondition)=>{
                    return (
                      <React.Fragment>
                        <div className="col-sm-5 nopadding">
                        <div className="row">
                        <label className="col-sm-3 mt-2"> {poLineCondition.conditionName} </label>
                        <div className="col-sm-6 mt-2">
                        <input type="text" className="form-control" value={poLineCondition.conditionValue}  name="freightCondition"/>
                        </div>
                        </div>
                        </div>
                      </React.Fragment>
                    )
                  })
                }
                </div>               
          </FormWithConstraints>
          <br/> */}
                  {/* <h4>Material Services</h4>
      <hr className="w-100"></hr>
                   <div className="row">
                   <div className="col-sm-12">
                     <table className="table table-bordered">
                     <thead className="thead-light">
                         <tr>
                           <th>Item Code</th>
                           <th>Material Description</th>
                           <th>PO Quantity</th>
                           <th>Rate</th>
                           <th>Currency</th>
                           <th>Delivered Qty</th>
                           <th>Balance Qty</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td>1234</td>
                           <td>Chemical</td>
                           <td>78</td>
                           <td>9889</td>
                           <td>RS</td>
                           <td>667</td>
                           <td>1234</td>
                         </tr>
                       </tbody>
                     </table>
                     </div>
                 </div> */}
                 </div>
                 <br/>
                 <br/>
                 </div>
      </div>
        {/* informatiom modal  nikhil code 25-07-2022*/}
       <div className="modal searchcompanyViewModal" id="searchCompanyModal" >
                      <div class="modal-dialog modal-dialog-centered ">
                      <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Search Vendor</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body"} >
                          <div className="row">
                          <label className="col-sm-4">Vendor Name </label>
                          <div className="col-sm-5">
                <input type="text" className={"form-control"} name="partner[name]" 
                  value={this.state.partner.companyName} required
                  onChange={(event)=>{
                    if(event.target.value.length < 60){
                      commonHandleChange(event,this,"partner.companyName", "inviteForm")
                    }
                  }} 
                  />
                </div>
                      <div className="col-sm-3"><button className="btn btn-primary" data-toggle="modal" data-target="#companyListModal"
                       onClick={(e)=>{this.setState({loadCompaniList:true});commonSubmitWithParam(this.props,"viewCompanyListModal","/rest/getVendorByName",this.state.partner.companyName)}}
                        type="button">Search</button></div> 
                          </div>
                          </div>
                        </div>  
                   </div>
                   </div>
                   <div className="modal  companyViewModal " id="companyListModal" >
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content modal-xl">
                        <div class="modal-header">
                            <h4 class="modal-title">Vendor Details</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body"} >
                          <div className="row">
                          <div className="col-sm-8"></div>
                          <div className="col-sm-4">
                          
                          <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." /> 
                          </div>
                          </div>
                          <div class="row">
                                <div className="col-sm-12 mt-2">
                                <table class="table table-bordered scrollTable">
                                  <thead>
                                    <tr>
                                      <th>Vendor Code</th>
                                      <th>Person Name </th>
                                      <th>Mobile No</th>
                                      <th>Mail ID</th>
                                      <th>Company Name</th>
                                      <th>Invited By</th>
                                      <th>Department</th>
                                      <th>Designation</th>
                                    </tr>
                                  </thead>
                                  <tbody id="DataTableBody">
                                    {
                                      (this.state.companyList).map((vendor,index)=>
                                        <tr onClick={(e)=>this.onSelectVendorRow("selectedVendor"+index,vendor.partner)} 
                                        className={this.state["selectedVendor"+index]} >
                                          <td>{vendor.userName}</td>
                                          <td> {vendor.userDetails.name} </td>
                                          <td> {vendor.userDetails.mobileNo} </td>
                                          <td> {vendor.email} </td>
                                          <td> {vendor.name} </td>
                                         {/* <td> {vendor.partner.name} </td>*/}
                                          <td> {vendor.createdBy.name} </td>
                                          <td> {vendor.createdBy.userDetails.userDept} </td>
                                          <td> {vendor.createdBy.userDetails.userDesignation} </td>
                                        </tr>
                                      )
                                    }
                                </tbody>
                                </table>
                                <div className="clearfix"></div>
                              </div>
                              </div>
                          </div>
                        </div>  
                </div>
            </div>
            {/*nikhil code*/}
       </React.Fragment>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.purchaseOrderLineInfo;
};

export default connect (mapStateToProps,actionCreators)(PurchaseOrder);