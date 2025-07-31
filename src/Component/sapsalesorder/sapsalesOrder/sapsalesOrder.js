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
import formatDate, {formatDateWithoutTime, formatDateWithoutTimeNewDate2,formatDateWithoutTimeNewDate} from "../../../Util/DateUtil";
import { removeLeedingZeros, getCommaSeperatedValue, getDecimalUpto } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { API_BASE_URL } from "../../../Constants";
import { isServicePO } from "../../../Util/AlkylUtil";
import { submitForm, submitToURL,savetoServer } from "../../../Util/APIUtils";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Grid, IconButton } from "@material-ui/core";
import DataTable from "react-data-table-component";


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
      searchQuery: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
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


clearFields = () => {
  this.props.onClearFilter(); // Calls parent's clearFilter
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




loadPODetails(index){
  debugger
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
  this.setState({openModal:false})
  if(this.props.filter.fdate!=""|| this.props.filter.tdate!=""){
  this.props.changeLoaderState(true);
  this.props.onFilter &&  this.props.onFilter()
  }else{
    window.alert('Date Cannot be null')

      return false;
  }
  this.clearFields();
}


onClickVehicleRegistration(index){


  let po = this.props.SapSalesOrderStatusList[index];

  //  <Link to="/vehicalRegistration"></Link>

}
handlePageChange = (event, newPage) => {
  this.setState({ page: newPage });
};

handleRowsPerPageChange = (event) => {
  this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
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
 handleRowClick = (row) => {
      this.props.SapSalesOrderList(row);
    };
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
      const { searchQuery, page, rowsPerPage } = this.state;
      const searchInObject = (obj, searchTerm) => {
        return Object.keys(obj).some((key) => {
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
            return searchInObject(value, searchTerm);
          }
          if (value === null || value === undefined) {
            return false;
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      };
    
      const filteredData = this.props.SapSalesOrderStatusList.filter((entry) => {
        return searchInObject(entry, searchQuery);
      });
         const columns = [
 {
  name: 'Request No',
  cell: (row) => {
   const index = filteredData.findIndex(i => i.saleOrdNo === row.saleOrdNo);
    return row.requestNo == null && row.custBlockStatus === '@08@' ? (
      <Button size="small" variant="outlined" color="primary" 
      onClick={()=>{this.loadPODetails(index)}} key={index}  type="button" >Create</Button>
    ) : (
      row.requestNo
    );
  },
  center: true, // Aligns text/button to center
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
},
{
  name: 'Cust Blk',
  cell: (row) => {
    const isGreen = row.custBlockStatus === '@08@';
    return (
      <div
        onClick={isGreen ? () => this.props.SapSalesOrderList(row) : undefined}
        style={{
          height: '15px',
          width: '15px',
          backgroundColor: isGreen ? 'green' : 'red',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '5px',
          cursor: isGreen ? 'pointer' : 'default',
        }}
        title={isGreen ? 'Click to view order' : 'Blocked'}
      />
    );
  },
  center: true,
  ignoreRowClick: true,
  allowOverflow: true,
  button: true
},

{
    name: 'Plant',
    selector: row => row.plant,
    sortable: true,  },
{
    name: 'Sales Ord No',
    selector: row =>  row.saleOrdNo,
    sortable: true,
    wrap: true,
    grow: 2
},
{
    name: 'Date',
    selector: row =>  row.date,
    cell: row =>  row.date,
    sortable: true,
    sortFunction: (a, b) => {
      const parseDate = (str) => {
        const [dd, mm, yyyy] = str.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
      };
      return parseDate(a.date) - parseDate(b.date);
    }
  },
{
    name: 'Delivery Date',
    selector: row =>  row.deliveryDate,
    cell: row =>  row.deliveryDate,
    sortable: true,
    sortFunction: (a, b) => {
      const parseDate = (str) => {
        const [dd, mm, yyyy] = str.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
      };
      return parseDate(a.deliveryDate) - parseDate(b.deliveryDate);
    }
  },
{
    name: 'Sold To Party- Sold To Party Name',
    selector: row =>  row.soldToParty+"-"+row.soldToPartyName,
    sortable: true,
    wrap: true,
    grow: 3
  }, {
    name: 'Material Desc',
    selector: row => row.material+"-"+row.materialDesc,
    sortable: true,
    wrap: true,
    grow: 3
  },
 {
    name: 'Qty',
    selector: row => row.qty,
    sortable: true
  },
  {
    name: 'Balance Qty',
    selector: row => row.balanceDeliveryQty,
    sortable: true
  },
 {
    name: 'Vehicle Type',
    selector: row => row.vehicleType,
    sortable: true
  },
 {
    name: 'Inward Transporter',
    selector: row => row.inwardTransporter,
    sortable: true,
    wrap: true,
    grow: 3
  },
 {
    name: 'Outward Transporter',
    selector: row => row.outwardTransporter,
    sortable: true,
    wrap: true,
    grow: 3
  },
 {
    name: 'inco',
    selector: row => row.inco,
    sortable: true
  },
 {
    name: 'inco1',
    selector: row => row.inco1,
    sortable: true,
    wrap: true,
    grow: 2
  },
]
    return (
      <div className="wizard-v1-content" style={{marginTop:"80px"}}>
        <div style={ hidden} >
        {this.state.openModal && <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
        <div className="modal-backdrop"></div> <div className="modal-dialog modal-sm">
                                       <div className="modal-content">
      <FormWithConstraints>
      <div className="row mb-3">
                  <div className="col-md-12 mb-5">
                    <TextField label="From Date" variant="outlined" 
                    size="small" type="date" 
                    fullWidth value={filter.fdate} 
                    onChange={(e) => this.handleFilterChange("fdate", e)} 
                    InputLabelProps={{ shrink: true }}    
                    inputProps={{ style: { fontSize: 12, height: "15px",  } }}/>
                  </div>
                  <div className="col-md-12 mb-5">
                    <TextField label="To Date" variant="outlined" size="small"
                     type="date" fullWidth 
                     value={filter.tdate} 
                     onChange={(e) => this.handleFilterChange("tdate", e)} 
                     InputLabelProps={{ shrink: true }}   
                     inputProps={{ style: { fontSize: 12, height: "15px",  } }}/>
                  </div>
                  <div className="col-md-12 mb-5">
                    <TextField label="Plant" variant="outlined" size="small"
                     fullWidth value={filter.plant} 
                     onChange={(e) => this.handleFilterChange("plant", e)} 
                     InputLabelProps={{ shrink: true }}  
                      inputProps={{ style: { fontSize: 12, height: "15px",  } }}/>
                  </div>
                  <div className="col-md-12 text-center mt-2">
                    <Button variant="contained" size="small" color="primary" onClick={this.handleFilterClick}>Search</Button>
                     <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                     Cancel</Button>
                     <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>
                  </div>
                </div>
                
      </FormWithConstraints>   
      </div>
      </div>
      </div>}
      <div>
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
                <TableContainer className="mt-1">
{/*               
                     <Table className="my-table">
                       <TableHead>
                         <TableRow>                          
                           <TableCell>Request No</TableCell>
                           <TableCell className="text-center">Cust Blk</TableCell>
                           <TableCell className="text-center" >Plant</TableCell>
                           <TableCell >Sales Ord No </TableCell>
                           <TableCell>Date</TableCell>
                           <TableCell>Delivery Date</TableCell>
                           <TableCell>Sold To Party- Sold To Party Name</TableCell>
                           <TableCell>Material Desc</TableCell>
                           <TableCell>Qty</TableCell>
                           <TableCell>Vehicle Type</TableCell>
                           <TableCell>Inward Transporter</TableCell>
                           <TableCell>Outward Transporter</TableCell>
                           <TableCell>inco</TableCell>
                           <TableCell>inco1</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody id="DataTableBody">
                            
                              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((po, index) => (
                              
                                
                              <TableRow>
                              {po.requestNo == null && po.custBlockStatus == "@08@"    ? 
                              <TableCell style={{textAlign:"center"}} >
                                 <Button size="small" variant="outlined" color="primary" onClick={()=>{this.loadPODetails(index)}} key={index}  type="button" >Create</Button>
                                 </TableCell> :
                                 <TableCell key={index}>{po.requestNo}</TableCell>}
                               {po.custBlockStatus == "@08@"? 
                               <TableCell style={{textAlign:"center"}} onClick={()=>{this.props.SapSalesOrderList(po)}} >
                                <div style={{height: "15px",width: "15px",backgroundColor: "green",borderRadius: "50%",display: "inline-block",margin: 5}} ></div></TableCell> :<TableCell style={{textAlign:"center"}} ><div style={{height: "15px",width: "15px",backgroundColor: "red",borderRadius: "50%",display: "inline-block",margin: 5}} ></div></TableCell> }
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}} className="text-center">{po.plant}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}} className="text-center" >{po.saleOrdNo}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}} >{formatDate(po.date)}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}} >{formatDate(po.deliveryDate)}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.soldToParty+"-"+po.soldToPartyName}</TableCell>
                             
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.material+"-"+po.materialDesc}</TableCell>
                              
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.qty}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.vehicleType}</TableCell>
                              
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inwardTransporter}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.outwardTransporter}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inco}</TableCell>
                               <TableCell onClick={()=>{this.props.SapSalesOrderList(po)}}>{po.inco1}</TableCell>
                             
                             </TableRow>
                              ))
                            }
                        
                       </TableBody>
                     </Table>
                   
                     <TablePagination
                                         rowsPerPageOptions={[50, 100, 150]}
                                         component="div"
                                         count={filteredData.length}
                                         rowsPerPage={rowsPerPage}
                                         page={page}
                                         onPageChange={this.handlePageChange}
                                         onRowsPerPageChange={this.handleRowsPerPageChange}
                                       /> */}
                                         </TableContainer>
                      <DataTable
                                  columns={columns}
                                  data={filteredData}
                                  pagination
                                  paginationPerPage={50}  
                                  //responsive
                                  paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                                  onRowClicked={this.handleRowClick}
                                  />
                              
                  </div>
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