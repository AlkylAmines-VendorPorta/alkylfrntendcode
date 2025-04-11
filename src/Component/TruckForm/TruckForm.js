import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import alkylLogo from "../../img/Alkyl logo.png";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import * as actionCreators from "../TruckForm/Action";
import StickyHeader from "react-sticky-table-thead";
import {
  commonSubmitForm, commonHandleChange, commonSubmitFormNoValidation,
  commonSubmitWithParam
} from "../../Util/ActionUtil";
import { formatDateWithoutTimeWithMonthName, formatDateWithoutTime } from "../../Util/DateUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import Loader from "../FormElement/Loader/LoaderWithProps";
import { removeLeedingZeros } from "../../Util/CommonUtil";
import { isServicePO } from "../../Util/AlkylUtil";

class TruckForm extends Component{
    constructor (props) {
        super(props)
        this.state = {            
             loadAsnStatusList:true,    
             isLoading:false,
            asnStatusList:[],
            purchaseOrderList:{},
             asnDetails:{
               asnId:"",
               asnNumber:"",
               po : "",
               plant:"",
               invoiceNo:"",
               vehicalNo:"",              
             invoiceApplicable:true,
             deliveryApplicable:false,
             isInvoiceApplicable : true,
             loadPODetailsList:false,
             loadPOLineList:false,
             poArray:[],
             poLineArray:[],
             asnLineArray:[],
             asnArray:[],
             loadASNList:false,
             loadASNLineList:false,
             loadASNDetails:false,
             loadASNLineDetails:false,             
             asnLineDetails:{
               asnLineId : "",
               asnId : "",
               poLineId : "",
               poLineNumber : "",
               asnLineNumber : "",
               materialName : "",
               poQty : "",
               uom : ""
             },
             po:{        
               poId : "",
               purchaseOrderNumber: "",
               poDate: "",
               vendorCode: "",
               vendorName: "",
               incomeTerms: "",
               purchaseGroup: "",
               versionNumber: "",
               status: "",
               documentType: "",
               isServicePO:false
             },
             loadServiceLineList : false,
             asnLineMap : [],
             selectedAsnListItem:{},
            
        }
    }

    {/*changeLoaderState = (action) =>{
        this.setState({
          isLoading:action
        });
      }*/}
    }
      async componentWillReceiveProps(props){
        // if(isEmpty(props.isSuccess) || props.isSuccess===false)
        // {
        //    this.changeLoaderState(false);
        // }
        if(!isEmpty(props.po)){
      
      
           this.setState({
              displayDivForAsnHistoryTable:props.po.isServicePO?"none":"",
              psTypeFlag:props.po.isServicePO?false:true,
              flagforSSN:props.po.isServicePO?true:false,
              
           })
        }
        /*if(isEmpty(props.asnStatusList) && this.state.loadAsnStatusList){
           commonSubmitWithParam(this.props,"getStatusDisplay","/rest/getAsnByAsnId");
        }*/
        
        if(!isEmpty(props.asnStatusList) && this.state.loadAsnStatusList ){
           this.setState({
              loadAsnStatusList: false,
              asnStatusList: props.asnStatusList
           })
           
         }
         if(!isEmpty(props.serviceSheetStatusList) && this.state.loadserviceSheetStatusList ){
           this.setState({
              loadserviceSheetStatusList: false,
              serviceSheetStatusList: props.serviceSheetStatusList
           })
           
         }
         if(!isEmpty(props.serviceEntrySheetStatusList) && this.state.loadserviceEntrySheetStatusList ){
           this.setState({
              loadserviceEntrySheetStatusList: false,
              serviceEntrySheetStatusList: props.serviceEntrySheetStatusList
           })
           
         } 
      
        if(!isEmpty(props.unload))
        {
           this.setState({unload:props.unload});
        }
      
        if(!isEmpty(props.grn))
        {
           this.setState({grn:props.grn});
        }
      
        if(!isEmpty(props.qc))
        {
           this.setState({qc:props.qc || this.state.role==="QCADM"});
        }
      
        if(!isEmpty(props.purchaseOrderList) && this.state.loadPODetailsList){
           let poList = [];
           props.purchaseOrderList.map((po)=>
              poList.push(this.getPurchaseOrderFromObj(po))
           );
           this.setState({
              loadPODetailsList:false,
              poArray: poList
           })
        }
      
        if(!isEmpty(props.asnLineList) && !this.state.loadASNLineList){
         this.changeLoaderState(false);
      
       let asnLine = [];
         props.asnLineList.map((asnLine,index)=>
            asnLine.push(this.getASNLineFromObj(asnLine,index))
            
         );
        
      }
      else{
         this.changeLoaderState(false);
      }
      
      
      if(!isEmpty(props.asnLineList) && this.state.saveServiceLines){
         this.changeLoaderState(false);
         let serviceLineList = [];
          let serviceLineListFromAsnLine=[];
         
          this.state.asnLineMap.map((asnLine,index)=>{
               serviceLineListFromAsnLine=props.asnLineList[asnLine].serviceLineList;
               if(!isEmpty(serviceLineListFromAsnLine)){
                     serviceLineListFromAsnLine.map((serviceLine)=>{
                     serviceLineList.push(this.getASNLineFromObj(serviceLine))
                  })
               }
            }) 
      
         this.setState({
            saveServiceLines:false,
            serviceLineArray: serviceLineList
         });
      }else{
         this.changeLoaderState(false);
      }
      
      
      
      
        if(!isEmpty(props.poLineList) && this.state.loadPOLineList){
           let poLineList = [];
           props.poLineList.map((poLine)=>
              poLineList.push(this.getPOLineFromObj(poLine))
           )
           this.setState({
              loadPOLineList:false,
              poLineArray: poLineList
           });
        }
      
        if(!isEmpty(props.po)){
           this.setState({
              po: props.po
           });
        }
      
        if(props.showHistory){
      
           this.setState({
              showHistory : true
           });
           
           if(!isEmpty(props.asnArray)){
              let asnList = [];
              props.asnArray.map((asn)=>
              asnList.push(this.getASNFromObj(asn))
              
              )
              this.setState({
                 loadASNList:false,
                 asnArray: asnList
              });
           }
        }else if(!props.showHistory){
           this.setState({
              showHistory : false
           });
        }
        if(!isEmpty(props.asnList) && this.state.loadASNList){
           this.changeLoaderState(false);
           let asnList = [];
           props.asnList.map((asn)=>
              asnList.push(this.getASNFromObj(asn))
           )
      
           this.setState({
              loadASNList:false,
              asnArray: asnList
           });
        }
      
      
        
      
        if(!isEmpty(props.storageLocationList) && this.state.loadStorageLocation){
           let strLocArray = Object.keys(props.storageLocationList).map((key) => {
              return { display: props.storageLocationList[key], value: key }
            });
           this.setState({
              loadStorageLocation:false,
              storageLocationList: strLocArray
           });
        }
        if(!isEmpty(props.serviceLineList) && this.state.loadServiceLineList){
           let serviceLineList = [];
           props.serviceLineList.map((serviceLine)=>
           serviceLineList.push(this.getServiceLineFromObj(serviceLine)) 
           )
           this.setState({
              loadServiceLineList:false,
              serviceLineArray: serviceLineList
           });
        }
      
        
        if(!isEmpty(props.asnLineList) && this.state.saveServiceLines){
           this.changeLoaderState(false);
           let serviceLineList = [];
            let serviceLineListFromAsnLine=[];
           
            this.state.asnLineMap.map((asnLine,index)=>{
                 serviceLineListFromAsnLine=props.asnLineList[asnLine].serviceLineList;
                 if(!isEmpty(serviceLineListFromAsnLine)){
                       serviceLineListFromAsnLine.map((serviceLine)=>{
                       serviceLineList.push(this.getASNLineFromObj(serviceLine))
                    })
                 }
              })
            
      
           
           this.setState({
              saveServiceLines:false,
              serviceLineArray: serviceLineList
           });
        }else{
           this.changeLoaderState(false);
        }
      
      
        if(!isEmpty(props.asnDetails) && this.state.loadASNDetails){
           let asnList = this.state.asnArray;
           asnList.push(this.getASNFromObj(props.asnDetails));
           this.setState({
              loadASNDetails:false,
              asnDetails: this.getASNFromObj(props.asnDetails),
            });
          }
        
          if(!isEmpty(props.poLineArray) && !this.state.loadASNLineList){
             let asnLineList = [];
             let asnLineMap = [];
        
             props.poLineArray.map((poLine,index)=>{
                   let lineItem=this.getASNLineFromPOLine(poLine);
                   asnLineList.push(lineItem);
                   asnLineMap[lineItem.poLineId]=index;
                }
             )
             this.setState({
                asnLineArray : asnLineList,
                loadASNLineList : true,
                asnLineMap : asnLineMap
             });
          }
        
         
         
          if(!isEmpty(props.asnStatus)){
             this.changeLoaderState(false);
          }else{
             this.changeLoaderState(false);
          }
        
          if(!isEmpty(props.asnStatus) && this.props.updateASNStatus){
             this.changeLoaderState(false);
             this.props.changeASNStatus(false);
             let asn = this.state.asnDetails;
             asn.status = props.asnStatus;
             this.props.showGateEntry(false,"");
             this.setState({
                asnDetails : asn
             });
             setTimeout(()=>{
                window.location.reload();
             },1000)
          }
               
     }
      
        
        async componentDidMount() {
            commonSubmitWithParam(this.props, "getPOListForASN", "/rest/getAsnByAsnId/10460" );
            this.changeLoaderState(true);
        
          }

          render(){
            return (
              <React.Fragment>
                <Loader isLoading={this.state.isLoading} />
                <div className="userbg">
                  <UserDashboardHeader />
                  <StickyHeader height={800} >
                    <div className="page-content w-100">
                      <div className="wizard-v1-content b-t">
                        <div className="wizard-form">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }} >
                            <a><img src={alkylLogo} alt="AlkylLogo" /></a>
                            <h1 className="text-center" style={{ fontSize: 55, textDecoration: 'underline black' }} >Goods Inspection / Intimation Note</h1>
                          </div>
                          <FormWithConstraints ref={formWithConstraints => this.inviteForm = formWithConstraints}>
        
                            <div className="row">
                              <div className="col-sm-12 mt-4">
                                <table className="my-table" style={{ width: "100%" }} >
                                  <tbody>
                                  {/*<div >*/}
                                    {/*<div style={{ marginTop: "25px", marginBottom: "25px" }}>
                                      <tr className="ts"><td>Format No. : FORM/K/COMM/02 ISSUE No. 01 Dt. 01.01.2017 REV No. 00 Dt. 01.01.2017</td></tr>
                                      </div> */}
                                    <tr className="ts">
                                      <td style={{ width: "16.7%" }}>Plant : </td>
                                      <td style={{ width: "16.6%" }}>1820 </td>
                                      <td style={{fontWeight: 'bold',width: "65%",textAlign: "center" }}>Alkyl Amines Chemicals Ltd. Kurkumbh Plant</td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Gate Entry No. :</td>
                                      <td></td>
                                      <td>Gate In Date. :</td>
                                      <td></td>
                                      <td>Time :</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td>PO No. :</td>
                                      <td></td>
                                     {/*<td>{this.props.purchaseOrderList.po.purchaseOrderNumber}</td>*/}
                                      <td>Inv. / Dc No. :</td>
                                      <td></td>
                                      <td>Inv/Dc Dt.</td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td>Material Name :</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Vehicle No. :</td>
                                      <td></td>
                                      <td>Quantity :</td>
                                      <td></td>
                                      <td>UOM</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td  style={{ width: "16.7%" }}>Sign. Verified By :</td>
                                      <td style={{ width: "16.7%" }}></td>
                                      <td style={{ width: "60%" }}>Remark If any</td>
                                    </tr>
                                    <tr className="ts" style={{fontWeight: 'bold',width: "100%",textAlign: "center",textDecoration: 'underline black' }}><td>Q. C. Report</td></tr>
                                    <tr className="ts">
                                      <td>In Time :</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td>Out Time :</td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td>Above mentined Tanker / Truck / Trolly of</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td>May be Unloaded</td>
                                      <td></td>
                                      <td>Not to be Unloaded</td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td>Reason for Unloading / Not Unloading :</td>
                                      <td>
                                      <textarea rows="4" cols="150"></textarea>
                                      </td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Density</td>
                                      <td></td>
                                      <td>Strength</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Checked By</td>
                                      <td></td>
                                      <td>Approved By</td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts" style={{fontWeight: 'bold',width: "100%",textAlign: "center",textDecoration: 'underline black' }}><td>Material Unloading Report</td></tr>
                                    <tr className="ts">
                                      <td>Tank No.</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    <tr className="ts">
                                      <td style={{ width: "68.2%" }}>Initial Level</td>
                                      <td>:</td>
                                      <td></td>
                                      <td>Quantity :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                    <tr className="ts">
                                      <td style={{ width: "68.2%" }}>Final Level</td>
                                      <td>:</td>
                                      <td></td>
                                      <td>Quantity :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                    <tr className="ts">
                                      <td style={{ width: "68.2%" }}>Difference</td>
                                      <td>:</td>
                                      <td></td>
                                      <td>Quantity :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                   
                                    <tr>
                                      <td>Certified that Tanker is totally empty.</td>
                                    </tr>
                                    
                                    <tr className="ts" >
                                      <td>Unloaded by</td>
                                      <td></td>
                                      <td>Functional Head</td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td>Security Remark</td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Reporting Time :  </td>
                                      <td></td>
                                      <td>Gross Weight :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                    <tr className="ts">
                                      <td>In Time :</td>
                                      <td></td>
                                      <td>Tare Weight :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                    <tr className="ts">
                                      <td>Out Time :</td>
                                      <td></td>
                                      <td>Net Weight :</td>
                                      <td></td>
                                      <td>MT / KG</td>
                                    </tr>
                                    
                                    <tr className="ts">
                                      <td>Safety Check :</td>
                                      <td></td>
                                      <td>Ok</td>
                                      <td>Not Ok</td>
                                    </tr>
                                    
                                    <tr>
                                      <td>Remark:</td>
                                      <td></td>
                                    </tr>
                                    
                                    <tr>
                                      <td>Security Supervisor Sign</td>
                                    </tr>
                                    
        
        
        
        
        
                                  {/*</div> */}
                                  </tbody>
                                </table>
                              </div>
                            </div>
        
        
        
                           
                  
        
                          </FormWithConstraints>
                        </div>
                      </div>
                    </div>
                  </StickyHeader>
                </div>
              </React.Fragment>
        
            );
          }

        }
          const mapStateToProps = (state) => {
  
            return state.truckForm;
          };
          export default connect(mapStateToProps, actionCreators)(TruckForm);

