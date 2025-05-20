import React, { Component } from "react";
import {commonSubmitWithParam} from "../../../Util/ActionUtil";
import { removeLeedingZeros } from "../../../Util/CommonUtil";
import { formatDateWithoutTimeNewDate2, formatDateWithoutTime } from "../../../Util/DateUtil";
import { isServicePO } from "../../../Util/AlkylUtil";
import { isEmpty } from "../../../Util/validationUtil";
import { searchTableDataThree, searchTableDataFour} from "../../../Util/DataTable";
import {connect} from 'react-redux';
import * as actionCreators from "./Action";

class InvoiceList extends Component {
    constructor(props) {
      super(props);
      this.state = {
         loadAsnStatusList:true,
         loadserviceSheetStatusList:true,
         asnArray : [],
         asnStatusList:[],
         serviceSheetStatusList:[],
         serviceEntrySheetStatusList:[],
      asnList:[],
      }
    }

    getASNFromObj(asnObj){
        return {
           serviceSheetNo:asnObj.serviceSheetNo,
           asnId : asnObj.advanceShipmentNoticeId,
           asnNumber : asnObj.advanceShipmentNoticeNo,
           po : this.getPurchaseOrderFromObj(asnObj.po),
           invoiceNo : asnObj.invoiceNo,
           invoiceDate : formatDateWithoutTime(asnObj.invoiceDate),
           invoiceAmount : asnObj.invoiceAmount,
           mismatchAmount : asnObj.mismatchAmount,
           deliveryNoteNo : asnObj.deliveryNoteNo,
           deliveryNoteDate : formatDateWithoutTime(asnObj.deliveryNoteDate),
           lrDate : formatDateWithoutTime(asnObj.lrDate),
           lrNumber : asnObj.lrNumber,
           transporterNo : asnObj.transporterNo,
           vehicalNo : asnObj.vehicalNo,
           eWayBillNo : asnObj.eWayBillNo,
           grossWeight : asnObj.grossWeight,
           tareWeight : asnObj.tareWeight,
           numberOfPackages : asnObj.numberOfPackages,
           isCOA : asnObj.isCOA==='Y',
           isPackingList : asnObj.isPackingList==='Y',
           typeOfPackingBulk : asnObj.typeOfPackingBulk,
           remarks : asnObj.remarks,
           igst : asnObj.igst,
           cgst : asnObj.cgst,
           sgst : asnObj.sgst,
           created : asnObj.created,
           basicAmount: asnObj.basicAmount,
           packingCharges : asnObj.packingCharges,
           freightCharges : asnObj.freightCharges,
           invoiceDoc :(asnObj.invoiceNo!=null)?this.checkInvoiceFromObj(asnObj.invoice):"",
           deliveryNoteDoc:(asnObj.deliveryNoteNo!=null)?this.CheckInvoiceFromObjForDelivery(asnObj.invoice):"",
           status  : asnObj.status,
           // status: asnObj.status,
           nameOfDriver : asnObj.nameOfDriver,
           mobileNumber : asnObj.mobileNumber,
           photoIdProof : asnObj.photoIdProof,
           loadingCharges : asnObj.loadingUnloadingCharges,
           irn : asnObj.irn,
           invoiceApplicable: asnObj.invoiceApplicable==='Y',
           isUnload:asnObj.isUnload==='Y',
           isQC:asnObj.isQCPassed==='Y'
         };
     }

     getPurchaseOrderFromObj(po){
   
        if(!isEmpty(po)){
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
              isServicePO : isServicePO(po.pstyp)
           }
        }else{
           return {
              poId : "",
              purchaseOrderNumber: "",
              poDate: "",
              vendorCode: "",
              vendorName: "",
              incomeTerms: "",
              purchaseGroup: "",
              versionNumber: "",
              status: "",
              documentType: ""
           }
        }
        
     }

     
    checkInvoiceFromObj=(obj)=>{
        if(isEmpty(obj)){
            return {
                invoiceDoc:{
                    attachmentId : "",
                    fileName : ""
                }
            }  
        }else{
        return obj;
        }
    }
    
    CheckInvoiceFromObjForDelivery=(obj)=>{
        if(isEmpty(obj)){
        return{
            deliveryNoteDoc:{
                    attachmentId : "",
                    fileName : ""
                }
            }     
        }else{
         return obj;
        }
    }


    componentDidMount(){
        commonSubmitWithParam(this.props,"getStatusDisplay","/rest/getASNStatusList");
        this.props.changeLoaderState(true);
    }

    componentWillReceiveProps(props){
        if(!isEmpty(props.asnList)){
            this.props.changeLoaderState(false);
            this.setState({
                asnArray:props.asnList
            });
        }else{
         this.props.changeLoaderState(false);
       }
        if(!isEmpty(props.asnStatusList) && this.state.loadAsnStatusList ){
         this.props.changeLoaderState(false);
         this.setState({
            loadAsnStatusList: false,
            asnStatusList: props.asnStatusList
         })
         
       }else{
         this.props.changeLoaderState(false);
       }
       
       if(!isEmpty(props.serviceSheetStatusList) && this.state.loadserviceSheetStatusList ){
          this.props.changeLoaderState(false);
         this.setState({
            loadserviceSheetStatusList: false,
            serviceSheetStatusList: props.serviceSheetStatusList
         })
         
       }else{
         this.props.changeLoaderState(false);
       }
       
       if(!isEmpty(props.serviceEntrySheetStatusList) && this.state.loadserviceEntrySheetStatusList ){
         this.props.changeLoaderState(false);
         this.setState({
            loadserviceEntrySheetStatusList: false,
            serviceEntrySheetStatusList: props.serviceEntrySheetStatusList
         })
         
       }else{
         this.props.changeLoaderState(false);
       }
    }

    render() {
        return (
            <div className="row mt-2 block" id="togglesidebar">
                       
                     <div className="boxContent mt-100">
                     <div className="row"> 
                     <div class="col-sm-9"></div>
            <div class="col-sm-3">
            <input type="text" id="SearchTableDataInputFour" className="form-control" onKeyUp={searchTableDataFour} placeholder="Search .." />
            </div>
         
                     <div className="col-sm-12 mt-2">
                     <font  >
                        <table className="my-table">
                        <thead>
                           <tr>
                              <th className="width-100px">ASN No / SSE No</th>
                              <th className="width-100px">PO No</th>
                              <th clssName="width-100px">ASN Date</th>
                              <th claassName="width-210px">Vendor</th>
                              <th className="width-210px">Document No</th>
                              <th className="width-130px"style={{display:this.state.displayDivForAsnHistoryTable}} >Document Type</th>
                              {/* <th className="width-120px">Invoice Amount</th> */}
                              {/* <th className="width-110px"> Packing Type </th> */}
                              {/* <th className="width-150px" style={{display:this.state.displayDivForAsnHistoryTable}}> Transporter Name </th>
                              <th className="width-120px"style={{display:this.state.displayDivForAsnHistoryTable}}> Vehical Number </th> */}
                              <th className="width-100px">Status </th>
                           </tr>
                        </thead>
                        <tbody id="DataTableBodyFour">
                           {
                              this.state.asnArray.map((asn,index)=>
                                 <tr onClick={(e)=>{this.props.loadASNDetails(asn)}}>
                                    <td className="width-100px">{asn.po.isServicePO?asn.serviceSheetNo:asn.asnNumber}</td>
                                    <td className="width-100px">{asn.po.purchaseOrderNumber}</td>
                                    { /* <td className="width-100px">{formatDateWithoutTimeNewDate2(asn.invoiceApplicable?asn.invoiceDate:asn.deliveryNoteDate)}</td>*/}
                                    <td className="width-100px">{formatDateWithoutTimeNewDate2(asn.invoiceDate)}</td>
                                    <td  className="width-120px" style={{display:this.state.vendorNameShown}}>{asn.po.vendorName}</td>
                                    
                                    <td className="width-210px">{asn.isServicePO?asn.deliveryNoteNo:asn.invoiceNo}</td>
                                    <td className="width-130px"style={{display:this.state.displayDivForAsnHistoryTable}}>{asn.po.documentType}</td>
                                    {/* <td className="width-120px">{asn.invoiceAmount}</td> */}
                                    {/* <td className="width-110px">{asn.typeOfPackingBulk}</td> */}
                                    {/* <td className="width-150px"style={{display:this.state.displayDivForAsnHistoryTable}}>{asn.transporterNo}</td>
                                    <td className="width-120px"style={{display:this.state.displayDivForAsnHistoryTable}}>{asn.vehicalNo}</td> */}
                                    <td className="width-100px">{asn.po.isServicePO?this.state.serviceSheetStatusList[asn.status]:this.state.asnStatusList[asn.status]}</td>
                                 </tr>
                              )
                           }
                        </tbody>
                        </table>
                        </font>
                        </div>
                  </div>
         </div>
         </div>
        )
    }
    
}

const mapStateToProps=(state)=>{
   return state.invoiceReducer;
 };
 export default connect (mapStateToProps,actionCreators)(InvoiceList);