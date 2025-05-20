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
import {formatDateWithoutTime, formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import { removeLeedingZeros, getCommaSeperatedValue, getDecimalUpto } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { API_BASE_URL } from "../../../Constants";
import { isServicePO } from "../../../Util/AlkylUtil";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField,
  Grid,Button,
  Container,
  IconButton
} from "@material-ui/core";
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
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      loadPODetails: false,
      loadPOLine:false,
      loadPOLineList:false,
      loadDocumentTyeList:false,
      loadPOLineConditions:false,
      openModal:false,
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
    deliveryDate: formatDateWithoutTimeNewDate2(poLineObj.deliveryDate),
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
    deliveryDate: formatDateWithoutTimeNewDate2(service.deliveryDate),
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
    pstyp:po.pstyp,
    isServicePO:isServicePO(po.pstyp),
    prDate:formatDateWithoutTimeNewDate2(po.prDate),
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
clearFields = () => {
  this.props.onClearFilter(); // Calls parent's clearFilter
}
handleFilterClick = () => {
  this.props.onFilter &&  this.props.onFilter();
  this.setState({formDisplay: !this.state.formDisplay});
  this.setState({searchDisplay: !this.state.searchDisplay});
  this.setState({openModal:false})
  this.clearFields();
  }
 
  onSelectVendorRow = (partner) => {
    
    console.log('onSelectVendorRow',partner)
   };
   handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
  onCloseModal=()=>{
    this.setState({
      openModal:false
    })
  }
  onOpenModal=()=>{
    this.setState({
      openModal:true
    })
  }
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
              const {  poList, vendorCodeShown, vendorNameShown, newPoStatus, loadPODetails } = this.props;
              const { searchQuery, page, rowsPerPage } = this.state;
              const filteredData = poList.filter((entry) =>
                Object.values(entry).some((val) =>
                  val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
              );
    return (
      <React.Fragment>
      <div className="w-100" style={{marginTop:"80px"}}>
        <div style={ hidden} >
        {this.state.openModal && <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
        <div className="modal-backdrop"></div>  <div className="modal-dialog modal-lg">
                                       <div className="modal-content">
      <FormWithConstraints>
      <Grid container spacing={2} style={{paddingTop:"10px"}}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Po No From"
                variant="outlined"
                size="small"
                fullWidth
                value={filter.poNoFrom}
                onChange={(e) => this.handleFilterChange('poNoFrom', e)}
                InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Po No To"
                variant="outlined"
                size="small"
                fullWidth
                value={filter.poNoTo}
                onChange={(e) => this.handleFilterChange('poNoTo', e)}
                InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Po Date From"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={filter.poDateFrom}
                onChange={(e) => this.handleFilterChange('poDateFrom', e)}
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Po Date To"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={filter.poDateTo}
                onChange={(e) => this.handleFilterChange('poDateTo', e)}
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Employee Code"
                variant="outlined"
                size="small"
                fullWidth
                value={filter.empCode}
                onChange={(e) => this.handleFilterChange('empCode', e)}
                InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Vendor Code"
                variant="outlined"
                size="small"
                fullWidth
                value={filter.vendorCode}
                onChange={(e) => this.handleFilterChange('vendorCode', e)}
                InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<img src={alkylLogo} alt="Alkyl Logo" />}
                data-toggle="modal" data-target="#searchCompanyModal" 
              >
              </Button>
            </Grid>
            <Grid item xs={12}style={{textAlign:"center"}}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleFilterClick}
                size="small"
              >
                Search
              </Button>
                 <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                 Cancel</Button>
                 <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
      </FormWithConstraints>   
      </div>
      </div>
      </div>}
           
      <Grid container>
            <Grid item sm={12} className="mb-1">   
            
        <input
          placeholder="Search"
          // variant="outlined"
          // size="small"
          style={{fontSize: "10px", float:"right" }}
          value={searchQuery}
          onChange={this.handleSearchChange}
        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
        </Grid>
        </Grid>
           <TableContainer >
          <Table className="my-table" aria-label="po table">
            <TableHead>
              <TableRow>
                <TableCell>PO No</TableCell>
                <TableCell align="center">PO Date</TableCell>
                {vendorCodeShown && <TableCell align="center">Vendor Code</TableCell>}
                {vendorNameShown && <TableCell>Vendor Name</TableCell>}
                <TableCell>Requested By</TableCell>
                <TableCell align="center">Version No</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((po, index) => (
                <TableRow key={index} onClick={()=>{this.loadPODetails(index)}}
                >
                  <TableCell>{po.purchaseOrderNumber}</TableCell>
                  <TableCell align="center">{po.poDate}</TableCell>
                  {vendorCodeShown && <TableCell align="center">{po.vendorCode}</TableCell>}
                  {vendorNameShown && <TableCell>{po.vendorName}</TableCell>}
                  <TableCell>{po.requestedBy.name}</TableCell>
                  <TableCell align="center">{po.versionNumber}</TableCell>
                  <TableCell>{newPoStatus[po.status]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
                      rowsPerPageOptions={[50, 100, 150]}
                      component="div"
                      count={filteredData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={this.handleChangePage}
                      onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
      
      </div> 
                 
                  <div  style={ shown }>
                    <Container style={{marginTop:"10px !important"}}>
                      <Paper className="p-3">
                  <div className="row">
                      <div className="col-sm-12 text-right">
                          <Button variant="contained" color="primary" type="button" onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden});}}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
                          <Button variant="contained" color="primary" href={API_BASE_URL+"/rest/pdf"} className="btn btn-primary ml-2">Print PO</Button>
                          {this.state.po.isServicePO?"":
                          <Button variant="contained" color="primary" className={this.state.po.status==="ACPT"?"btn btn-primary ml-2 inline-block":"btn btn-success ml-2 none"} 
                          onClick={()=>{this.props.createASN(this.state.po,this.state.poLineArray,this.state.serviceArray,this.state.costCenterList,this.props.SSNVersion)}}
                          
                            >
                             {this.state.po.isServicePO?"":"Create ASN"}
                          </Button>}
                          {this.state.po.status==="ACPT"&&<Button variant="contained" color="primary" type="button" className="ml-2"
                             onClick={()=>{this.getASNHistory()}}
                            >
                             {this.state.po.isServicePO?"Service History":"ASN History"}
                          </Button>}
                          
                          {(this.state.po.status==="REL" || this.state.po.status==="REJ")&&<Button variant="contained"  className="ml-2" color="primary" type="button"  
                            onClick={()=>{this.setState({loadPODetails: true}); commonSubmitWithParam(this.props,"poAcceptance","/rest/acceptPO/",this.state.po.poId)}}>
                             Accept
                          </Button>}
                         {this.state.po.status==="REL"&& <Button variant="contained" color="primary"  className="ml-2" type="button"
                            onClick={()=>{this.rejectPO()}}>
                              Reject
                          </Button>}
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
                  </Paper>
                  </Container>

                 <Container>
                  <Paper className="fixed-height p-3">
          <div className={"lineItemDiv min-height-0px "+(displayService==="block"?"display_none":"")}>
           <div className="row">
           <div className="col-sm-9"></div>
            <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div> 
               <div className="col-sm-12 mt-2">
                  <StickyHeader height={150} className="table-responsive">
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>                         
                           <TableCell> Line No </TableCell>
                           <TableCell> Material Description </TableCell>
                           <TableCell className="text-right"> PO Qty </TableCell>
                           <TableCell> UOM </TableCell>
                           {/* <TableCell className="widTableCell-120px">ASN Qty </TableCell> */}
                           {/* <TableCell>Bal Qty</TableCell> */}
                           <TableCell className="text-right"> Rate </TableCell>
                           <TableCell>Currency</TableCell> 
                           {/* <TableCell>Plant</TableCell> */}
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBodyTwo">
                            {
                              this.state.poLineArray.map((poLine)=>
                                <TableRow onClick={()=>this.onClickPOLine(poLine)}>
                                  {/* onClick={()=>this.onClickPOLine(poLine)} */}
                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <TableCell>{removeLeedingZeros(poLine.lineItemNumber)}</TableCell>
                                  <TableCell>{poLine.materialCode} - {poLine.material}</TableCell>
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.poQuantity,3))}</TableCell>
                                  <TableCell>{poLine.uom}</TableCell>
                                  {/* <TableCell className="width-120px">{poLine.asnQuantity}</TableCell> */}
                                  {/* <TableCell>{poLine.balanceQuantity}</TableCell> */}
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(poLine.rate,2))}</TableCell>
                                  <TableCell>{poLine.currency}</TableCell>
                                  {/* <td>{poLine.plant}</td> */}
                                </TableRow>
                              )
                     }
                    
                  </TableBody>
               </Table>
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
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>             
                           <TableCell> Po Line No.</TableCell>            
                           <TableCell> Service No.</TableCell>
                           <TableCell className="w-40per">Service Description po</TableCell>
                           <TableCell className="text-right"> Required Qty </TableCell>
                           <TableCell> UOM </TableCell>
                           {/* <TableCell>Completed Qty </TableCell>
                           <TableCell>Bal Qty</TableCell> */}
                           <TableCell className="text-right"> Rate </TableCell>
                           <TableCell>Currency</TableCell> 
                           {/* <th>Plant</th> */}
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBodyTwo">
                            {
                              this.state.serviceArray.map((service,i)=>
                              
                                <TableRow>

                                  {/* onClick={()=>{this.setState({loadPOLineList:true, shown: !this.state.shown, hidden: !this.state.hidden}); commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poLine.poLineId)}} */}
                                  <TableCell>{removeLeedingZeros(service.parentPOlineNumber)}</TableCell>
                                  <TableCell>{removeLeedingZeros(service.lineItemNumber)}</TableCell>
                                  <TableCell>{service.materialCode}-{service.material}</TableCell>
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.poQuantity,3))}</TableCell>
                                  <TableCell>{service.uom}</TableCell>
                                  {/* <TableCell>{service.asnQuantity}</TableCell>
                                  <TableCell>{service.balanceQuantity}</TableCell> */}
                                  <TableCell className="text-right">{getCommaSeperatedValue(getDecimalUpto(service.rate,2))}</TableCell>
                                  <TableCell>{service.currency}</TableCell>
                                  {/* <TableCell>{poLine.plant}</TableCell> */}
                                </TableRow>
                              )
                            }
                        
                       </TableBody>
                     </Table>
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
                 </Paper>
                 </Container>
                 <br/>
                 <br/>
                 </div>
      </div>
        {/* informatiom modal  nikhil code 25-07-2022*/}
       <div className="modal searchcompanyViewModal" id="searchCompanyModal" >
                      <div class="modal-dialog ">
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
                                <Table class="my-table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Vendor Code</TableCell>
                                      <TableCell>Person Name </TableCell>
                                      <TableCell>Mobile No</TableCell>
                                      <TableCell>Mail ID</TableCell>
                                      <TableCell>Company Name</TableCell>
                                      <TableCell>Invited By</TableCell>
                                      <TableCell>Department</TableCell>
                                      <TableCell>Designation</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody id="DataTableBody">
                                    {
                                      (this.state.companyList).map((vendor,index)=>
                                        <TableRow onClick={(e)=>this.onSelectVendorRow("selectedVendor"+index,vendor.partner)} 
                                        className={this.state["selectedVendor"+index]} >
                                          <TableCell>{vendor.userName}</TableCell>
                                          <TableCell> {vendor.userDetails.name} </TableCell>
                                          <TableCell> {vendor.userDetails.mobileNo} </TableCell>
                                          <TableCell> {vendor.email} </TableCell>
                                          <TableCell> {vendor.name} </TableCell>
                                         {/* <TableCell> {vendor.partner.name} </TableCell>*/}
                                          <TableCell> {vendor.createdBy.name} </TableCell>
                                          <TableCell> {vendor.createdBy.userDetails.userDept} </TableCell>
                                          <TableCell> {vendor.createdBy.userDetails.userDesignation} </TableCell>
                                        </TableRow>
                                      )
                                    }
                                </TableBody>
                                </Table>
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