import React, { Component } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import * as actionCreators from "./Action";
import {connect} from 'react-redux';
import {commonSubmitWithParam,commonHandleChange, commonSubmitFormNoValidation,commonSubmitForm, 
  commonHandleChangeCheckBox, commonHandleFileUpload,commonSubmitFormValidation,
  commonHandleReverseChangeCheckBox,swalPrompt,commonSubmitWithoutEvent,
  commonHandleFileUploadInv,swalWithTextBox} from "./../../Util/ActionUtil";
  import { isEmpty } from './../../Util/validationUtil';
  import StickyHeader from "react-sticky-table-thead";
  import { formatDateWithoutTime,formatDateWithoutTimeWithMonthName } from "./../../Util/DateUtil";
  import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

  import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "./../../Util/CommonUtil";
  import { isServicePO } from "./../../Util/AlkylUtil";
import { searchTableData, searchTableDataTwo} from "./../../Util/DataTable";
import AdvanceShipmentNotice from "./../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import swal from "sweetalert";  
import { API_BASE_URL } from "./../../Constants";
import {saveQuotation,downloadexcelApi,request,uploadFile} from "./../../Util/APIUtils";
import { Description } from "@material-ui/icons";
import { Box, Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

class VendorDashboardMainBody extends Component{
    constructor(props){
        super(props);
        this.state = {
          vendorNameShown:"",
          vendorCodeShown:"",
          newPoStatus:"",
          buttonText:"",
          ASN:"Create ASN",
          displayDivFlag:"block",
          loadVendorpoList:false,
          loadPODetails: false,
          loadPOLine:false,
          loadPOLineList:false,
          loadDocumentTyeList:false,
          loadPOLineConditions:false,
          poLineArray:[],
          gateentryAsnList:[],
          documentTypeList: [],
          role:"",
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
             empCode:"",
           },
            isServicePO:false,
            pstyp:""
          },
          serviceArray:[],
          loadServiceList:false,
          currentPOIndex:"",
          costCenterList:[],
        
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
             
          totalOpenPoCount:"",
          VendorPoList:[],
            PoLineList:[],
            poListforVendor:[],
            poLineArray:[],
            serviceArray:[],
            totalPoCount:"",
            acceptedPoCount:"",
            rejectedPoCount:"",
            releasedPoCount:"",
            loadVendorDashboardDetails:false,
                options: {
                    chart: {
                    id: "basic-bar"
                    },
                    xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                    }
                },
                series: [
                    {
                    name: "series-1",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                    }
                ],
                optionsDonut: {},
            seriesDonut: [44, 55, 41, 17, 15],
            labelsDonut: ['A', 'B', 'C', 'D', 'E'],
            seriesBar: [{
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
            }, {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            }, {
                name: 'Free Cash Flow',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
            }],
            optionsBar: {
                chart: {
                type: 'bar',
                height: 300
                },
                plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
                }
            },
            openPoCount:"",
            openPoAsnCount:"",
            pendingPoBillBookingCount:"",
        };
    }

    async componentWillReceiveProps(props){
        ;
        if(!isEmpty(props) && (this.state.loadVendorDashboardDetails===true)){
          this.setState({
            totalPoCount:props.totalPoCount,
            acceptedPoCount:props.acceptedPoCount,
            rejectedPoCount:props.rejectedPoCount,
            releasedPoCount:props.releasedPoCount,
    
            openPoCount:props.openPoCount,
            openPoAsnCount:props.openPoAsnCount,
            pendingPoBillBookingCount:props.pendingPoBillBookingCount,
          })
    
          }

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

          if(!isEmpty(props.VendorPoList) ){
            this.setState({
              //   loadVendorpoList:true,
              VendorPoList: props.VendorPoList
              
            })
            
          }

          if(!isEmpty(props.totalOpenPoCount) ){
            this.setState({
              totalOpenPoCount: props.totalOpenPoCount
            })
            
          }

          if(!isEmpty(props.poListforVendor) ){
            // this.setState({
            //   poListforVendor: props.poListforVendor
            // })

            let po = this.getPurchaseOrderFromObj(props.poListforVendor[0]);
            this.setState({
           //  loadPODetails : false,
              po : po
            });
            
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

            if (!isEmpty(props.costCenterList)) {
              this.props.changeLoaderState(false);
              let costArray = Object.keys(props.costCenterList).map((key) => {
                return { display: props.costCenterList[key], value: key }
              });
              this.setState({
                costCenterList: costArray
              })
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
      }
       componentDidMount(){
           
          //  setTimeout(function () {
          //   this.props.getVendorDashboardInfo("userDashboardDetails");
          //   this.setState({
          //     loadVendorDashboardDetails: true
          //   })
          //   // commonSubmitWithParam(this.props,"VendorDashboard","/rest/userDashboardDetails");
          // }.bind(this), 1000)
       
          
        commonSubmitWithParam(this.props,"getUserDashboardDetails","/rest/userDashboardDetails");
        this.setState({
              loadVendorDashboardDetails: true
            })

            commonSubmitWithParam(this.props,"getPOList","/rest/getPOforVendor");
      
        }
        downloadexcelApi= () => {
          // let enquiryId=this.state.qbvArray.enquiry?.enquiryId;
          let po=this.state.po.purchaseOrderNumber;
                       return request({
                           url: API_BASE_URL+"/rest/downloadPO/"+po,
                           method: 'GET',
                        //   body: data
                       }).then(response => {
                           // getFileUploadObject(component,JSON.stringify(response),statePath);
                          this.setState({attachmentId:response.attachmentId})
                          this.setState({fileName:response.fileName})
                          
                       //   this.download();
                        })
        
                          
        
                      
        
                   
                   }




        onClickPOLine = (poLine) =>{

          this.setState({
            currentPOLine : poLine
          });
           
        }
        searchPOData(index){
          //  this.props.changeLoaderState(false);
          this.props.changeLoaderState(true);
            let po=this.props.VendorPoList[index]
           let doctyp = "PO"
             commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po.purchaseOrderNumber,doctyp)
      
         }

        handleFilterClick=async (index) => {
          
          this.searchPOData(index);
           await delay(1000);
        
           this.loadpoList(index);
           await delay(1000);
          
           this.loadPODetails(index)
          
          
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
         
loadpoList(index){
  this.props.changeLoaderState(false);
  let po=this.props.VendorPoList[index]
  commonSubmitWithParam(this.props,"getpoListbypoNo",'/rest/getPObyPONo',po.purchaseOrderNumber)
}


        loadPODetails(index){
          this.props.changeLoaderState(true);
          let po=this.props.poListforVendor[0];
        
          this.setState({
            loadPOLineList:true,
            shown: !this.state.shown,
            hidden: !this.state.hidden,
            po : po,
            buttonText:po.documentType,
            displayDivFlag:po.pstyp==='9'?"none":"block",
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
         commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",po.purchaseOrderId);
       }

       getASNHistory(){
        let po=this.props.poListforVendor[0];
        this.setState({
          loadASNListForPO : true
        });
        commonSubmitWithParam(this.props,"getASNListForPO","/rest/getASNByPO",po.purchaseOrderId);
        this.props.changeLoaderState(true);
        this.props.goASNHistory(this.state.costCenterList)
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
          poId: po.purchaseOrderId,
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

       getPOLineFromObj(poLineObj){
        return {
          poLineId: poLineObj.purchaseOrderLineId,
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
          commonSubmitWithParam(this.props,"poAcceptance","/rest/rejectPO",this.state.po.poId,value);
        }).catch(err => {
        });
      }

    render() {
     
      const {filter} = this.props;
      const attachmentId=this.state.attachmentId;
      const ExcelFileName=this.state.fileName;

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

              console.log("podetails.."+this.state.po);
            
        return (
          <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
             
              <div className="col-sm-12 mt-2">
          
                
                    </div>
                    <div  style={ shown }>
                    <div  className="card p-2">
                  <div className="row">
                      <div className="col-sm-12 text-right">
                        
                      <Button color="primary" variant="contained" size="small" className={this.props.role=== "VENADM" ? "mr-1" : "none"} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
                        
                          <Button color="primary" variant="contained" size="small" type="button" onClick={this.downloadexcelApi} className="btn btn-primary ml-2" >&nbsp;Print PO</Button>
                                <span><a href={API_BASE_URL + "/rest/download/" + attachmentId}>{ExcelFileName}</a></span>

                                <Button color="primary" variant="contained" size="small" type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                           
                             onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)}}
                            >
                            
                             {this.state.po.isServicePO?"Create Service Note":"Create ASN"}
                          </Button>
                          <Button color="primary" variant="contained" size="small"  type="button" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                             onClick={()=>{this.getASNHistory()}}
                            >
                             {this.state.po.isServicePO?"Service History":"ASN History"}
                          </Button>
                          <Button color="success" variant="contained" size="small" type="button" className={(this.state.po.status==="REL" || this.state.po.status==="REJ")?"btn btn-success ml-2 inline-block":"btn btn-success ml-2 none"} 
                            onClick={()=>{this.setState({loadPODetails: true}); commonSubmitWithParam(this.props,"poAcceptance","/rest/acceptPO/",this.state.po.poId)}}>
                             Accept
                          </Button>
                          <Button color="secondary" variant="contained" size="small" type="button"  className={this.state.po.status==="REL"?"btn btn-danger ml-2 inline-block":" btn btn-danger ml-2 none"} 
                            onClick={()=>{this.rejectPO()}}>
                              Reject
                          </Button>
                      </div>
                  </div>
                  <hr className="w-100"></hr>
                  <div className="row mt-2">
                      <label className="col-sm-1">PO No</label>
                      <span className="col-sm-2">
                       {this.state.po.purchaseOrderNumber}
                      </span>  
                      <label className="col-sm-1">Vendor</label>
                      <span className="col-sm-2">
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
                      {formatDateWithoutTimeWithMonthName(this.state.po.date)}
                      </span>   
                      
                      <label className="col-sm-1">Status</label>
                      <span className="col-sm-1">
                         {this.state.newPoStatus[this.state.po.status]}  
                      
                      </span>  
                  </div> 
                
                  </div>

                 
                  <div className="card p-2">
          <div className={"lineItemDiv min-height-0px "+(displayService==="block"?"display_none":"")}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div> 
               <div className="col-sm-12 mt-2">
                  <StickyHeader height={150} className="table-responsive">
                     <table className="my-table">
                       <thead>
                         <tr>                         
                           <th> Line No </th>
                           <th> Material Description </th>
                           <th className="text-right"> PO Qty </th>
                           <th> UOM </th>
                           <th className="text-right"> Rate </th>
                           <th>Currency</th> 
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">
                            {
                              this.state.poLineArray.map((poLine)=>
                                <tr onClick={()=>this.onClickPOLine(poLine)}>
                                  <td>{removeLeedingZeros(poLine.lineItemNumber)}</td>
                                  <td>{poLine.materialCode} - {poLine.material}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.poQuantity,3))}</td>
                                  <td>{poLine.uom}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.rate,2))}</td>
                                  <td>{poLine.currency}</td>
                                  
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
                     <table className="my-table">
                       <thead>
                         <tr>             
                           <th> Po Line No.</th>            
                           <th> Service No.</th>
                           <th className="w-40per">Service Description po</th>
                           <th className="text-right"> Required Qty </th>
                           <th> UOM </th>
                           <th className="text-right"> Rate </th>
                           <th>Currency</th> 
                           <th>Contract Po</th>
                         </tr>
                       </thead>
                       <tbody id="DataTableBodyTwo">
                            {
                              this.state.serviceArray.map((service,i)=>
                              
                                <tr>
                                  <td>{removeLeedingZeros(service.parentPOlineNumber)}</td>
                                  <td>{removeLeedingZeros(service.lineItemNumber)}</td>
                                  <td>{service.materialCode}-{service.material}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.poQuantity,3))}</td>
                                  <td>{service.uom}</td>
                                  <td className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.rate,2))}</td>
                                  <td>{service.currency}</td>
                                 <td>{service.contractPo}</td>
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
        </div>
        <div className="row mt-2">
          <label className="col-sm-2">Batch</label>
          <span className="col-sm-2">
              {this.state.currentPOLine.batch}
          </span>
        </div>
        </div>
        </div>
        </FormWithConstraints>    
               
                 </div>
                 <br/>
                 <br/>
                 </div>
           
            <Card id="togglesidebar" style={ hidden}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Box 
                      display="flex" 
                      justifyContent="center" 
                      alignItems="center"
                      color="success.main"
                    >
                      <Description fontSize="large" />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        component="p" 
                        color="textSecondary"
                      >
                        Open Purchase Orders
                      </Typography>
                      <Typography 
                        variant="h6" 
                        component="span" 
                        px={1}
                      >
                        {this.state.totalOpenPoCount}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

            <div className="card p-2" style={ hidden} >
            <div className="row" >
              <div className="col-sm-12">
                <div class="table-proposed">
                  <StickyHeader height={"65vh"} >
                    <table className="my-table">
                      <thead>
                        <tr>
                          <th>PO No</th>
                          <th>PO Date</th>
                          <th>Document Type</th>
                          <th>Vendor Code</th>
                          <th>Vendor Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="DataTableBody">
                        {this.state.VendorPoList.map((po, index) => (
                          <tr onClick={()=>{this.handleFilterClick(index)}}
                        //  onClick={()=>{this.loadPODetails(index)}}
                          >
                            <td>{po.purchaseOrderNumber}</td>
                            <td>{formatDateWithoutTime(po.date)}</td>
                            <td>{po.documentType}</td>
                            <td>{po.vendorCode}</td>
                            <td>{po.vendorName}</td>
                            <td>{po.status}</td>
                        
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </StickyHeader>
                </div>

              </div>
            </div>
            </div>

            
          
          </div>
        );
      }
}
const mapStateToProps=(state)=>{
    return state.userDashBoardMainReducer;
  };
  export default connect (mapStateToProps,actionCreators)(VendorDashboardMainBody);
  