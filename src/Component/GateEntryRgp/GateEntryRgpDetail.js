import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import { submitToURL } from "../../Util/APIUtils";
import PRList from "../PRScreen/PRList/PRList";
import Enquiry from "../PRScreen/Enquiry/Enquiry";
import VendorSelection from "../PRScreen/VendorSelection/VendorSelection";
import swal from 'sweetalert';
import { API_BASE_URL } from "../../Constants";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  commonSubmitFormNoValidationWithData,
  commonHandleReverseChangeCheckBox,
  commonSetState,
  validateForm,
  resetForm,
  swalWithTextBox,
  swalWithTextBoxDynamicMessage
} from "../../Util/ActionUtil";
import { isEmpty, isEmptyDeep } from "../../Util/validationUtil";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { getUserDto, getFileAttachmentDto,getDecimalUpto } from "../../Util/CommonUtil";
import { formatDateWithoutTime,formatDateWithoutTimeNewDate,formatDateWithoutTimeNewDate1, formatDateWithoutTimeNewDate2, formatTime } from "../../Util/DateUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN, ROLE_REQUISTIONER_ADMIN, ROLE_PURCHASE_MANAGER_ADMIN, ROLE_BUYER_ADMIN, ROLE_PARTNER_ADMIN } from "../../Constants/UrlConstants";
import Loader from "../FormElement/Loader/LoaderWithProps";
import alkylLogo from "../../img/Alkyl logo.png";
import printlogo from "../../img/logoPrint.png";
import RCLogo from "../../img/RC-Logo.jpg";
import { Col, Divider, Row } from 'antd';


import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TableBody,Table, tr, TableCell, TableHead, Button } from "@material-ui/core";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);



class GateEntryRgpDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open:false,
      inputValue:"",
      vendorData:[],
      gateEntryLineDto:[],
      gateEntryLineDtoTest:[],
      //componentRef:null,
      gateEntryDto: {
        vendorCode:"",
        gateEntryId: "",
        reqNo: "",
        vendorName: "",
        vendorAddress: "",
        poNo: "",
        remark: "",
        status: "",
        docType: "",
        rejectDesc: "",
        hodRejectDesc: "",
        commRejectDesc: "",
        purpose:"",
        returnBy:"",
        vehicleNo:"",
        vehicleType:"",
        transporterName:"",
        gateEntryLineList: [
          {
            gateEntryLineId: "",
            serialNo: 1,
            materialCode: "",
            materialDesc: "",
            materialQty: 0,
            materialRate: 0,
            materialCost: 0,
            repairingCost: 0,
            gateEntry:{
              gateEntryId:""
            }
          }
        ]
      },
      plantDropDownList:[],
      TransporterDropDownList:[],
      VendorNameDropDownList:[],

      role:"",
      url:"",
      formno:""
    };
  }
  handleSubmit = () => {
   this.transporterDetails();
   this.vendorDetails();
   commonSubmitFormNoValidationWithData(this.state.gateEntryDto, this, "gateEntryRgpSubmit", "/rest/saveGateEntry");
  }

  updateStatus = (url) => {
 // commonSubmitFormNoValidationWithData(this.state.gateEntryDto, this, "gateEntryRgpSubmit", "/rest/saveGateEntry");
    commonSubmitWithParam(this.props,"updateStatus","/rest/"+url, this.state.gateEntryDto.gateEntryId);
    
  
  }

  updateStatusCommercial = async (url) => {
    //   commonSubmitFormNoValidationWithData(this.state.gateEntryDto, this, "gateEntryRgpSubmit", "/rest/saveGateEntry");
     //  await delay(1000)
     this.transporterDetails();
      commonSubmitFormNoValidationWithData(this.state.gateEntryDto, this, "gateEntryRgpSubmitupdate", "/rest/updateGateEntry");
      await delay(1000)
       commonSubmitWithParam(this.props,"updateStatus","/rest/"+url, this.state.gateEntryDto.gateEntryId);
       
     
     }

  // updateStatusRemark = (url,remark) => {
  //   commonSubmitWithParam(this.props,"updateStatus","/rest/"+url,this.state.gateEntryDto.gateEntryId, remark);
  // }

  updateStatusRemark=(e, url)=>{
    this.props.changeLoaderState(true);
    this.setState({url:url})
    swalWithTextBoxDynamicMessage(e,this,"updateStatusRemarkReason","Enter remark for Reject");
  }

  updateStatusRemarkReason=(remark)=>{
    this.props.changeLoaderState(true);
    commonSubmitWithParam(this.props,"updateStatus","/rest/"+this.state.url, this.state.gateEntryDto.gateEntryId, remark);
  }

  getEmptyGateEntryLineObj = (serialSize) => {
    return {
      gateEntryLineId: "",
      serialNo: serialSize + 1,
      materialCode: "",
      materialDesc: "",
      materialQty: "",
      materialRate: "",
      materialCost: "",
      repairingCost: "",
      gateEntry: {
        gateEntryId: ""
      }
    }
  }

  addGateEntry() {
    let gateEntryDto = this.state.gateEntryDto;
    let gateEntryLineList = gateEntryDto.gateEntryLineList;
    let gateEntryLineArray = [
      this.getEmptyGateEntryLineObj(gateEntryLineList.length)
    ];
    gateEntryLineList = gateEntryLineList.concat(gateEntryLineArray);
    gateEntryDto.gateEntryLineList = gateEntryLineList
    this.setState({ gateEntryDto: gateEntryDto });
  }

  removeGateEntry(i) {
    let gateEntryDto = this.state.gateEntryDto;
    let gateEntryLineList = gateEntryDto.gateEntryLineList;
    gateEntryLineList.splice(i, 1);
    gateEntryDto.gateEntryLineList = gateEntryLineList
    this.setState({ gateEntryDto: gateEntryDto });
  }

  docType() {
    let gateEntryDto = this.state.gateEntryDto;
    if (gateEntryDto.docType == "RGP") {
      return <lable className="col-lg-12">Gate Pass Returnable</lable>
    }
    else {
      return <lable className="col-lg-12">Gate Pass Non Returnable</lable>
    }
  }


  componentDidMount() {
    submitToURL(`/rest/getRGPPlant`).then(({ objectMap }) => {
      console.log("PLANT LIST ---->>>", objectMap);
      let plantListArray = [];
      Object.keys(objectMap.plantList).map((key) => {
        plantListArray.push({ display: objectMap.plantList[key], value: key });
      });
      this.setState({
        plantDropDownList: plantListArray
      })
    });



    submitToURL(`/rest/getTransporterDataSAP`).then(({ objectMap }) => {
      console.log("PLANT LIST ---->>>", objectMap);
      let transporterListArray = [];
      let role=objectMap.role;
      Object.keys(objectMap.TransporterData).map((key) => {
        transporterListArray.push({ display: objectMap.TransporterData[key], value: key });
      });
      this.setState({
        TransporterDropDownList: transporterListArray,
        role:role
      })
    });


    submitToURL(`/rest/getVendorName`).then(({ objectMap }) => {
      console.log("PLANT LIST ---->>>", objectMap);
      let vendorListArray = [];
      let role=objectMap.role;
      Object.keys(objectMap.vendorDataList).map((key) => {
        vendorListArray.push({ display: objectMap.vendorDataList[key], value: key });
      });
      this.setState({
        VendorNameDropDownList: vendorListArray,
        role:role
      })
    });

  }

  handleFilterClick = () => {
    this.props.onFilter && this.props.onFilter();
    this.setState({ formDisplay: !this.state.formDisplay });
    this.setState({ searchDisplay: !this.state.searchDisplay });

    commonSubmitWithParam(this.props,"getFormNo",'/rest/formNoPrint',this.state.gateEntryDto.plant, this.state.gateEntryDto.docType)
  }

  searchVendorData=()=>{
    this.props.changeLoaderState(false);
    if(document.getElementById('VendorSearch').value==""){
     return false;
   }else{
   let VendorSearch=document.getElementById('VendorSearch').value;
   let parts = VendorSearch.split('-');
   let vendorName = parts[0];
   let vendorCode = parts.length > 1 ? parts[1] : '';

   let gateEntryDto=this.state.gateEntryDto;
   gateEntryDto.vendorName=vendorName
   // gateEntryDto.vendorName=vendorCode
   this.setState({gateEntryDto:gateEntryDto})
    //commonSubmitWithParam(this.props,"getGateEntryVendorSAP",'/rest/getVendorDataSAP',this.state.gateEntryDto.vendorCode)
    commonSubmitWithParam(this.props,"getGateEntryVendorSAP",'/rest/getVendorAddressByName',vendorCode,this.state.gateEntryDto.vendorName)
   }
 }

 onComfirmationOfCancelGateEntry(e) {
     
  swalWithTextBox(e, this, "onCancelGateEntryRequest");

}

onCancelGateEntryRequest = (value) => {
//  this.props.changeLoaderState(true);
  commonSubmitWithParam(this.props, "cancelgateentryrequest", "/rest/cancelGateEntryRequest", this.state.gateEntryDto.gateEntryId, value)
}

  UNSAFE_componentWillReceiveProps = props => {
    if (!isEmpty(props.gateEntryLineDto) && !isEmpty(props.gateEntryLineDto[0])) {
      debugger
      let gateEntryDto = props.gateEntryLineDto[0].gateEntry;
      debugger
      gateEntryDto = {
        ...gateEntryDto,
        gateEntryLineList: []
      }
      gateEntryDto.gateEntryLineList = props.gateEntryLineDto;
      this.setState({ gateEntryDto: gateEntryDto })
    }

    if (!isEmpty(props.vendorData)) {

    //this.state.gateEntryDto.vendorName=props.VendorData.vendorName;
      this.state.gateEntryDto.vendorAddress=props.vendorData[0].vendorAddress;
      this.setState({
       //vendorName:this.state.gateEntryDto.vendorName,
        vendorAddress:this.state.gateEntryDto.vendorAddress
      })
    } 

    if (!isEmpty(props.gateEntryLineDto)) {

      this.setState({
        gateEntryLineDto: props.gateEntryLineDto
      })
    }


    if (!isEmpty(props.gateEntryLineDtoTest)) {

      this.setState({
        gateEntryLineDtoTest: props.gateEntryLineDtoTest
      })
    }

    if (!isEmpty(props.formno)) {

      this.setState({
        formno: props.formno
      })
    }

  }

transporterDetails=()=>{
  if(document.getElementById('transporterName').value==""){
    return false;
   }else{
    let gateEntryDto=this.state.gateEntryDto;
    gateEntryDto.transporterName=document.getElementById('transporterName').value;
    this.setState({gateEntryDto:gateEntryDto})
  }
}
vendorDetails=()=>{
  if(document.getElementById('VendorSearch').value==""){
    return false;
   }else{
    let gateEntryDto=this.state.gateEntryDto;
    gateEntryDto.vendorName=document.getElementById('VendorSearch').value;
    this.setState({gateEntryDto:gateEntryDto})
  }
}

handleFilterChange = (key,event) => {
  this.props.onFilterChange && this.props.onFilterChange(key,event.target.value?event.target.value:event.target.innerText!=undefined?event.target.innerText:"");

}

controlSubmit=(e)=>{
  if (e.key === 'Enter' && e.shiftKey === false) {
     e.preventDefault();
     // callback(submitAddress);
   }
}

setvendorName(){
  let newvendorlist=[]
  // {(Object.entries(this.state.VendorNameDropDownList)).map(item =>

  {(this.state.VendorNameDropDownList).map(item =>
    newvendorlist.push(this.getItem(item))
      
   )}
    
   return newvendorlist;
  }
// }

    getItem(item) {
  return {
     //value:item.value,
      value:item.display[0]+"-"+item.display[1],
    // description:item.description
     
  }
}

  print() {
    window.print();
  }
  handleRedirect = () => {
    debugger
    window.location.reload();
   };
  subtotal() {
    let gateEntryLineList = this.state.gateEntryDto.gateEntryLineList;
    let totalAmount = 0;
    gateEntryLineList.map((totalValue) =>
      totalAmount = totalAmount + (totalValue.materialQty * totalValue.materialRate)
    )
    return totalAmount.toFixed(3);
  }

  createdByDepartment() {

    let name = ""
    let userDepartment = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
        name = item.createdBy.name
        userDepartment = item.createdBy.userDetails.department
      })
    }
    return userDepartment;
  }
  createdBy() {

    let name = ""
    let userDepartment = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
        name = item.createdBy.name
        
      })
    }
    return name;
  }
  preparedBy() {

    let name = ""
    let created = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
        name = item.createdBy.name
        created = item.gateEntry.created
      })
    }
    return  (
      <table>
      <tr>
        <td>{name}</td>
      </tr> 
      <tr>
      <td>{formatDateWithoutTimeNewDate1(created)}</td>
    </tr>
    <tr>
    <td>{ created===null?"":formatTime(created)}</td>
  </tr>
  </table>
   
    )
  }
  authorizedBy() {

    let name = ""
   // let hodDate = ""
   let plantheadDate = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
         
       // if(item.gateEntry.hod===null){
        if(item.gateEntry.planthead===null){
          name=" ";
        }
        else{
          //name = item.gateEntry.hod.name
           name = item.gateEntry.planthead.name
        }
        
      //hodDate = item.gateEntry.hodDate
      plantheadDate = item.gateEntry.plantheadDate
      })
    }
    return  (
      <table>
      <tr>
        <td>{name}</td>
      </tr> 
      <tr>
      {/* <TableCell>{formatDateWithoutTimeNewDate1(hodDate)}</TableCell> */}
      <td>{formatDateWithoutTimeNewDate1(plantheadDate)}</td>
    </tr>
    <tr>
    {/* <TableCell>{ hodDate===null?"":formatTime(hodDate)}</TableCell> */}
    <td>{ plantheadDate===null?"":formatTime(plantheadDate)}</td>
  </tr>
  </table>
   
    )
    //name
    //+ "-" + 
  //  hodDate;
  }

  approvedBy() {
    let name = ""
    let hodDate = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
         
        if(item.gateEntry.hod===null){
          name=" ";
        }
        else{
           name = item.gateEntry.hod.name
        }
        
        hodDate = item.gateEntry.hodDate
      })
    }
    return  (
      <table>
      <tr>
        <td>{name}</td>
      </tr> 
      <tr>
      <td>{formatDateWithoutTimeNewDate1(hodDate)}</td>
    </tr>
    <tr>
    <td>{ hodDate===null?"":formatTime(hodDate)}</td>
  </tr>
  </table>
   
    )
  //   let name = ""
  //   let fhDate = ""
  //   {
  //     this.state.gateEntryLineDtoTest.map((item, i) => {
         
  //       if(item.gateEntry.fh===null){
  //         name=" ";
  //       }
  //       else{
  //          name = item.gateEntry.fh.name
  //       }
        
  //      fhDate = item.gateEntry.fhDate
  //     })
  //   }
  //   return  (
  //     <table>
  //     <tr>
  //       <TableCell>{name}</TableCell>
  //     </tr> 
  //     <tr>
  //     <TableCell>{formatDateWithoutTimeNewDate1(fhDate)}</TableCell>
  //   </tr>
  //   <tr>
  //   <TableCell>{ fhDate===null?"":formatTime(fhDate)}</TableCell>
  // </tr>
 // </table>
   
  // )
    //name
    //+ "-" + 
  //  hodDate;
  }

  storeInchargeBy() {

    let name = ""
    let commercialDate = ""
    {
      this.state.gateEntryLineDtoTest.map((item, i) => {
         
        if(item.gateEntry.commercial===null){
          name=" ";
        }
        else{
           name = item.gateEntry.commercial.name
        }
        
        commercialDate = item.gateEntry.commercialDate
      })
    }
    return  (
      <table>
      <tr>
        <td>{name}</td>
      </tr> 
      <tr>
      <td>{formatDateWithoutTimeNewDate1(commercialDate)}</td>
    </tr>
    <tr>
    <td>{ commercialDate===null?"":formatTime(commercialDate)}</td>
  </tr>
  </table>
   
    )
    //name
    //+ "-" + 
  //  hodDate;
  }
  plantAddress() {
    let gateEntryDto = this.state.gateEntryDto;
    if (gateEntryDto.plant == "1201") {
      return (
        <div>Alkyl Amines Chemicals Limited.<br></br>
          Plot No. A7 & A25, MIDC Village Kaire,,Taluka Khalapur<br></br>
          Raigad,Patalganga,410220,India</div>
      )
    }
    else if (gateEntryDto.plant == "1202") {
      return (
        <div>Alkyl Amines Chemicals Limited.<br></br>
          PLOT No.D-6/1,D-6/2, MIDC Kurkumbh,Taluka Daund<br></br>
          Pune,413802,India</div>
      )
    }
    else if (gateEntryDto.plant == "1203") {
      return (
        <div>Alkyl Amines Chemicals Limited.<br></br>
          Plot No. D-2/CH/149/2, Dahej - Phase II,,Industrial Estate GIDC, Taluka - Vaghra<br></br>
          Bharuch,392110,India</div>
      )
    }
    else if (gateEntryDto.plant == "1102") {
      return (
        <div>Alkyl Amines Chemicals Limited<br></br>
          401-407, Nirman Vyapar Kendra, Sector 17, Vashi, Navi Mumbai,<br></br>
          Maharashtra - 400703,India</div>
      )
    } else {

    }
  }

  render() {
    const gateEntryDto = this.state.gateEntryDto;
    const gateEntryLineList = this.state.gateEntryDto.gateEntryLineList;
    console.log(gateEntryDto);



    var frmhidden = {
      display: this.state.formDisplay ? "none" : "block"
    }
    var searchHidden = {
      display: this.state.searchDisplay ? "block" : "none",
      width:"98%",
      margin:"0px auto",
      background:"#fff",
      marginTop:"80px"
    }
    // console.log("plantDropDownListplantDropDownList",this.state.plantDropDownList);
    return (
      <>
        {/* <div>
        <Button color="primary" variant="contained" type="button" id="togglesidebar" onClick={this.handleFilterClick.bind(this)} style={frmhidden} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Print Details</Button> */}

{/* <button type="button" id="togglesidebar" onClick={this.handleFilterClick.bind(this)} style={frmhidden} class="btn btn-primary">Print Details</button> */}
{/* </div> */}
        <div style={searchHidden} >
        <fieldset class="scheduler-border">
          <b style={{fontSize:"2vw"}}>Alkyl Amines Chemicals Ltd.</b>
          <p>Regd. Ofice : 401-407,Nirman Vyapar Kendra, Plot No. 10, Sector 17, Vashi, Navi Mumbai 400703.(INDIA)
             Tel.: 022-6794 6600. fax: 022-6794 6666. 
             E-mail : alkyl@alkylamines.com Visit us at : www.alkylamines.com</p>
        </fieldset>
        <fieldset class="scheduler-border">
          
          <p style={{marginTop:"25px"}}>Main Place of Business :Plot No.A-7 & A-25, MIDC Patalganga 
          Industrial Area.Dist. Raigad,Maharashtra</p>
        </fieldset>
        <fieldset class="scheduler-border">
          <Row>
            <Col span={8} style={{marginTop:"25px"}} >
              <a href="userdashboard"><img src={printlogo} alt="" /></a>
              {/* <img className="navbar-brand" src={alkylLogo} alt="" /> */}

            </Col>
            <Col span={8} style={{marginTop:"50px"}} >
            {/* <b style={{fontSize:"1vw"}}>AlkylAmines Chemicals Ltd.</b> */}
            <p align="center"  style={{fontSize:"1.5vw"}}><b>{this.docType()}</b></p><br></br>
            </Col>
            <Col span={8}
            >
              <img class="resLogo" src={RCLogo} alt="" />
            </Col>
          </Row>
          </fieldset>
          <fieldset class="scheduler-border">
          <Row>
            <Col span={8}>
            <table>
                <tr>
                  <td>Request No :</td>
                  <td>{gateEntryDto.reqNo}</td>
                </tr>
              </table>
            </Col>
            <Col span={8}>
            </Col>
            <Col span={8} align="right">
            <table>
                <tr>
                  <td> Date :</td>
                  {/* <td>{formatDateWithoutTime(gateEntryDto.created)}</td> */}
                  <td>{formatDateWithoutTimeNewDate1(gateEntryDto.created)}</td>
                </tr>
              </table>
            </Col>
          </Row>

          </fieldset>
          {/* <p align="center"><b>{this.docType()}</b></p><br></br> */}

          <Row>
          <Col span={12}>
            <fieldset class="scheduler-border">
              {/* <b>From,</b>
            <b>
              {this.plantAddress()
              }
            </b> */} 
            {/* <table>
                  <tr>
                  <b>From,</b>
                    </tr>
                    <tr>
                    <TableCell><b> {this.plantAddress() } </b></TableCell>
                  </tr>
                  <br/>
                </table> */}
                <table>
                  <tr>
                    <td>From</td>
                    </tr>
                    <tr>
                    <td> {this.plantAddress() } </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>.</td>
                  </tr>
                </table>
            </fieldset>
          </Col> 
            <Col span={12}>
            <fieldset class="scheduler-border">
            <table>
                  <tr>
                    <td>To,</td>
                    </tr>
                    <tr>
                    <td>{gateEntryDto.vendorName}</td>
                  </tr>
                  <tr>
                    <td>{gateEntryDto.vendorAddress}</td>
                  </tr>                
                </table>
            </fieldset>
            </Col>
            {/* <Col span={8} offset={8}>
              <table>
                <tr>
                  <TableCell>Request No :</TableCell>
                  <TableCell>{gateEntryDto.reqNo}</TableCell>
                </tr>
                <tr>
                  <TableCell>Date:</TableCell>
                  <TableCell>{formatDateWithoutTime(gateEntryDto.created)}</TableCell>
                </tr>
                <tr>
                  <TableCell>Department :</TableCell>

                  <TableCell>{this.createdBy()}</TableCell>
                </tr>
              </table>
            </Col> */}
          </Row>
          <Row>
          <Col span={12} style={{height:"10px"}}>
            <fieldset class="scheduler-border">
            <div>
              <table>
                <tr>
                  <td> <b>PAN NO:</b></td>
                  <td> AAACA6783F<br></br></td>
                </tr>
                <tr>
                  <td>  <b>CIN No:</b></td>
                  <td>L99999MH1979PLC021796<br></br></td>
                </tr>
                <tr>
                  <td><b>GST NO:</b></td>
                  <td>  27AAACA6783F1ZM<br></br></td>
                </tr>
                <tr>
                 <td>.</td>
                </tr>
                <tr>
                 <td>.</td>
                </tr>
                <tr>
                 <td>.</td>
                </tr>
              </table>
             
          
         </div>
            </fieldset>
          </Col> 

          <Col span={12}>
            <fieldset class="scheduler-border">
            <table>
            <tr>
                  <td>Department Name :</td>
                  <td>{this.createdByDepartment()}</td>
                </tr>
                {/* <tr>
                  <td>Department Code :</td>
                  <td>{this.createdBy()}</td>
                </tr> */}
                <tr>
                  <td>Requestioner Name :</td>
                  <td>{this.createdBy()}</td>
                </tr>
                <tr>
                  <td>Transporter :</td>
                  <td>{gateEntryDto.transporterName}</td>
                </tr>
                <tr>
                  <td>Driver Name :</td>
                  <td>{ }</td>
                </tr>
                <tr>
                  <td>LR NO. :</td>
                  <td>{ }</td>
                </tr>
                <tr>
                  <td>Vehicle NO. :</td>
                  <td>{gateEntryDto.vehicleNo}</td>
                </tr>
              </table>
            </fieldset>
          </Col> 
          </Row>
          {/* <Row style={{ marginTop: 50 }}>
            <div>
              <p>
                <b>
                  We are sending herewith the following Materials:-</b>
              </p>
            </div>
          </Row> */}
          <Row>
          <table className="my-table" >
                <tr className="row m-0">
                  {/* <TableCell>#</TableCell> */}
                  <th className="col-1" ><b> Sr No.</b> </th>
                  <th className="col-4" ><b> Material Details</b></th>
                  <th className="col-1" ><b>UOM</b></th>
                  <th className="col-1" ><b>Quantity</b> </th>
                  <th className="col-1" ><b> Rate</b> </th>
                  <th className="col-1"><b>Amount</b></th>
                  <th className="col-2" ><b>Ref.DocNo. (GPRN) / Date</b></th>
                  <th className="col-1" ><b>Exp.Ret. Date</b></th>
                  {/* <TableCell className="w-6per" ><b>Purpose</b></TableCell> */}
                </tr>
                {/* <tr>
               
                </tr> */}
              <tbody>
                {gateEntryLineList.map((item, i) => {
                  return (
                    <>
                      <tr className="row m-0">
                        <td className="col-1" >{item.serialNo}</td>
                        <td className="col-4" >{item.materialCode}</td>
                        <td className="col-1">{item.uom}</td>
                        <td className="col-1">{getDecimalUpto(item.materialQty, 3)}</td>
                        <td className="col-1">{getDecimalUpto(item.materialRate, 2)}</td>
                        <td className="col-1">{getDecimalUpto(item.materialCost, 2)}</td>                       
                        <td className="col-2">{formatDateWithoutTimeNewDate1(gateEntryDto.returnBy)}</td>
                        <td className="col-1"></td>
                        {/* <td>{item.purpose}</td> */}
                        
                       
                      <tr>
                      <td><b>Purpose:</b> {item.purpose} </td>
                      {/* <td>{item.purpose}</td> */}
                      </tr>
                      </tr>
                    </>
                  )
                })
                }
              </tbody>

            </table>
            </Row >
            <fieldset class="scheduler-border">        
              <table  align="right">
                <tr>
                  <td>**Total Amount** :</td>
                  <td><b>{this.subtotal()}</b></td>
                </tr>

              </table>    
          </fieldset>
          <fieldset class="scheduler-border"> 
          <Row >
            <Col span={8}>
              <b>
                <table>
                  {/* <tr>
                    <TableCell>Purpose:</TableCell>
                    <TableCell>{gateEntryDto.purpose}</TableCell>
                  </tr> */}
                  <tr>
                    <td>Expected Return Date :</td>
                    <td>{formatDateWithoutTimeNewDate1(gateEntryDto.returnBy)}</td>
                  </tr>
                </table>
              </b>

            </Col>

            <Col span={8} offset={8}>
              <b>
                <table>

                  <tr>
                    <td>Vehicle Type :</td>
                    <td>{gateEntryDto.vehicleType}</td>
                  </tr>
                </table>
              </b>
            </Col>

          </Row>
          </fieldset>
          <fieldset class="scheduler-border"> 
          <Row >
          <Col span={8}>
              <b>
                <table>
                  <tr>
                    <td>Remarks:</td>
                    <td>{gateEntryDto.remark}</td>
                  </tr>
                </table>
                <br/><br/>
              </b>

            </Col>

          </Row>
          </fieldset>
          <fieldset class="scheduler-border"> 
          <Row >
          <Col span={24}  style={{marginTop:"10px"}}>
              <b>
                {this.props.formno}
              </b>

            </Col>

          </Row>
          </fieldset>
          <fieldset class="scheduler-border"> 
          <b>E.& O.E.</b>
          <Row>
            <Col span={6}>
              <tr>
                <td>PREPARED BY :</td>

              </tr>
              <tr>
                <td>{this.preparedBy()}</td>
              </tr>

            </Col>
            <Col span={6}>
              <tr>
                <td>APPROVED BY :</td>
              </tr>
              {"RGP" === gateEntryDto.docType?
               <tr>
               {/* <td>{this.authorizedBy()}</td> */}
               <td>{this.approvedBy()}</td>
             </tr>:
              <tr>
                <td>{this.approvedBy()}</td>
              </tr>}
            </Col>
      {"RGP" === gateEntryDto.docType?
          <>
            <Col span={8}>
              
              <tr>
                <td>STORE IN-CHARGE/AUTHORISED BY:</td>
              </tr>
              <tr>
                <td>{this.storeInchargeBy()}</td>
              </tr>
            </Col>
            </>
            :
            <>
            <Col span={6}>
              <tr>
                <td>AUTHORISED BY :</td>
              </tr>
              <tr>
                <td>{this.authorizedBy()}</td>
              </tr>
            </Col>
            <Col span={6}>
              <tr>
                <td>STORE IN-CHARGE :</td>
              </tr>
              <tr>
                <td>{this.storeInchargeBy()}</td>
              </tr>
            </Col></>} 
          </Row>
          <br/>
          <br/>
          <br/>
        </fieldset> 

          <Row align={"center"} style={{ marginTop: 50 }}>            
            <Button color="primary" variant="contained" className="mb-2" size="small" type="button" id="printbtn"  onClick={this.print}>Print</Button>
            <Button color="primary" variant="contained" size="small" type="button" className="ml-2 mb-2" onClick={this.handleRedirect}>Back</Button>
          </Row>
          <div>


          </div>
        </div>
        <div className="wizard-v1-content" id="togglesidebar" style={{marginTop:"80px"}}>
          <FormWithConstraints ref={formWithConstraints => this.prForm = formWithConstraints}>
            <div style={frmhidden}>
              <div className="card my-2" >
              {gateEntryDto.reqNo!=""?
               <div className="col-lg-12">
              
              <Button color="primary" variant="contained" size="small" type="button" id="togglesidebar" onClick={this.handleFilterClick.bind(this)} style={frmhidden} >Print Details</Button>
              </div>:""}
                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Type</label>
                  <div className="col-sm-2">
                    <select 
                    className="form-control"
                      value={gateEntryDto.docType}
                     // disabled={gateEntryDto.reqNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.docType");
                      }}
                    >
                      <option value="">Select</option>
                      <option value="NRGP">NRGP</option>
                      <option value="RGP">RGP</option>
                    </select>
                  </div>
                  <label className="col-sm-2">Plant <span className="redspan">*</span></label>
                  <div className="col-sm-2" >
                    <select className="form-control" name="plant" required={true}
                      value={gateEntryDto.plant}
                    //  disabled={gateEntryDto.reqNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.plant");
                      }}
                    >
                      <option value="">Select</option>
                      {(this.state.plantDropDownList).map(item =>

                        <option value={item.value}>{item.display}</option>
                      )}

                    </select>
                    <FieldFeedbacks for="plant">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                    {/* <span className="display_block">
                      {gateEntryDto.plant}
                    </span> */}
                  </div>
                  <label className="col-sm-2">Req No.</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      {gateEntryDto.reqNo}
                    </span>
                  </div>
                </div>

                {/* {gateEntryDto.reqNo==""?
                <div className="row mt-0 px-4 pt-2">
                <label className="col-sm-2">Vendor Code</label>


                     <div className="col-sm-2" >
                          <span className="display_block">
                           <input
                                   type="text" id="VendorSearch" 
                            className="form-control"
                    //  disabled={gateEntryDto.reqNo}
                   defaultValue={gateEntryDto.vendorCode}
                    onChange={(e) => {
                     commonHandleChange(e, this, "gateEntryDto.vendorCode");
                       }}
                       />
                     </span>
                         </div>
                         
                         <div className="col-sm-3">
                          <Button variant="contained" color="primary" type="button" className={"btn btn-primary"} onClick={this.searchVendorData.bind(this)}> Search </Button>
                      </div>
                       </div> :""
  } */}
                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Vendor Name</label>
                  {/* <div className="col-sm-2" > */}
                  {gateEntryDto.reqNo==""?
                  <><div className="col-sm-4">
                      <Autocomplete id="VendorSearch"
                        freeSolo
                        disablePortal
                        options={this.setvendorName()}
                        getOptionLabel={(option) => option.value ? option.value : gateEntryDto.vendorName}
                        onChange={this.handleFilterChange.bind(this, 'vendorName')}
                        defaultValue={gateEntryDto.vendorName}
                        style={{ width: '300px' }}
                        onKeyDown={this.controlSubmit}
                        renderInput={(params) => <TextField value={gateEntryDto.vendorName} {...params} />} />
                    {/* <span className="display_block">
      <input
        type="text"
        className="form-control"
          //  disabled={gateEntryDto.reqNo}
        value={gateEntryDto.vendorName}
        onChange={(e) => {
          commonHandleChange(e, this, "gateEntryDto.vendorName");
        }}
      />
    </span> */}
                    </div><div className="col-sm-3">
                        <button type="button" className={"btn btn-primary"} onClick={this.searchVendorData.bind(this)}> Search </button>
                      </div></>:
                      <div className="col-sm-4">
                      <Autocomplete id="VendorSearch"
                        disablePortal
                        options={this.setvendorName()}
                        getOptionLabel={(option) => option.value ? option.value : gateEntryDto.vendorName}
                        onChange={this.handleFilterChange.bind(this, 'vendorName')}
                        value={gateEntryDto.vendorName}
                        style={{ width: '300px' }}
                        onKeyDown={this.controlSubmit}
                        renderInput={(params) => <TextField value={gateEntryDto.vendorName} {...params} />} /></div>}

                      <label className="col-sm-2">Status</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>

                </div>
                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Address</label>
                  <div className="col-sm-6" >
                    <span className="display_block">
                      <textarea
                        className={"h-50px form-control"}
                    //  disabled={gateEntryDto.reqNo}
                      defaultValue={gateEntryDto.vendorAddress}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}

                      />
                    </span>
                  </div>
                  {/* <label className="col-sm-2">Status</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>*/}
                </div>
                {"NRGP" === gateEntryDto.docType?"":
                <div className="row mt-0 px-4 pt-2">

                  <label className="col-sm-2">Expected Return Date</label>
                  <div className="col-sm-2" >
                    <input type="date" className="form-control" name="returnBy" value={formatDateWithoutTimeNewDate(gateEntryDto.returnBy)} 
                    //disabled={!isEmpty(gateEntryDto.reqNo)}
                      onChange={(e) => {

                        commonHandleChange(e, this, "gateEntryDto.returnBy");
                      }} />

                  </div>
                </div>
  }
                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Vehicle No</label>
                  <div className="col-sm-2" >
                    <textarea
                      class="form-control" rows="1"
                    //  disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.vehicleNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.vehicleNo");
                      }}
                    />
                  </div>
                  <label className="col-sm-2"></label>
                  <div className="col-sm-2" >
                  </div>
                  <label className="col-sm-2">Vehicle Type</label>
                  <div className="col-sm-2" >
                    <textarea
                      class="form-control" rows="1"
                    //  disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.vehicleType}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.vehicleType");
                      }}
                    />
                  </div>
                </div>

                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Transporter Name</label>
                  <div className="col-sm-2" >
                  <Autocomplete id="transporterName"  value={gateEntryDto.transporterName}
      open={this.state.open}
      onOpen={() => {
        if (this.state.inputValue) {
          this.setState({open:true})
         // setOpen(true);
        }
      }}
      onClose={() => 
        this.setState({open:false})
        // setOpen(false)
      }
      inputValue={this.state.inputValue}
      onInputChange={(e, value, reason) => {
       // setInputValue(value);
       this.setState({inputValue:value})

        if (!value) {
          this.setState({open:false})
         // setOpen(false);
        }
      }}
      freeSolo
      options={ this.state.TransporterDropDownList}
      getOptionLabel={(option) => option.display?option.display:gateEntryDto.transporterName}
     
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params}
         variant="outlined" />
      )}
    />
                 
                  </div>
                  </div>

                <div className="row mt-1 px-4 pt-2 mb-2">
                  <label className="col-sm-2">Remarks</label>
                  <div className="col-sm-6" >
                    <textarea
                      className={"h-50px form-control"}
                    //  disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.remark}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.remark");
                      }}
                    />
                  </div>
                  {gateEntryDto.status.includes("REJECTED") ?
                    <div className="col-6 col-md-2 col-lg-2">
                      <label className="mr-4 label_12px">Reject Reason</label>
                      <span className="display_block">
                        {/* {"HOD REJECTED" === gateEntryDto.status ? gateEntryDto.hodRejectDesc : "FH REJECTED" === gateEntryDto.status ? gateEntryDto.rejectDesc : gateEntryDto.commRejectDesc} */}
                        {"FH/HOD REJECTED" === gateEntryDto.status ? gateEntryDto.hodRejectDesc : "PH/HOD REJECTED" === gateEntryDto.status ? gateEntryDto.rejectDesc : gateEntryDto.commRejectDesc}
                      </span>
                    </div> : null}


                </div>


              </div>
              <div className="card my-2">
                <div className="lineItemDiv min-height-0px">
                  <div className="row px-4 py-2">
                    <div className="col-sm-9"></div>
                    
                    <div className="col-sm-12 mt-2">
                      <div>
                        <StickyHeader height={250} className="table-responsive">
                          <table className="my-table">
                            <thead>
                              <tr>
                                {/* <TableCell>#</TableCell> */}
                                <th className="w-6per"> Sr No. </th>
                                <th className="w-12per"> Material</th>
                                {/* <th className="w-4per"> Material Description</th> */}
                                <th className="w-7per">Qty </th>
                                <th className="w-6per"> UOM</th>

                                <th className="w-8per"> Rate </th>
                                <th className="w-8per">Cost</th>
                              { "NRGP" === gateEntryDto.docType?"": <th className="w-8per">Repairing Cost</th>}
                                <th className="w-8per">Purpose</th>
                              </tr>
                            </thead>
                            <tbody id="DataTableBodyTwo">
                              {gateEntryLineList.map((item, i) => {
                                return (
                                  <>
                                    <tr class="accordion-toggle" >
                                      {/* <TableCell class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></TableCell> */}
                                      <td>
                                        <label className="mr-4 label_12px">{item.serialNo}</label>
                                        {/* <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.serialNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".serialNo");
                                          }}
                                        /> */}
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.materialCode}
                                       //   disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialCode");
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.materialDesc}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialDesc");
                                          }}
                                        />
                                      </td> */}

                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.materialQty}
                                       //   disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialQty");
                                            commonSetState(this, "gateEntryDto.gateEntryLineList." + i + ".materialCost", item.materialQty * item.materialRate)
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.uom}
                                       //   disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".uom");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                        //  disabled={gateEntryDto.reqNo}
                                          value={item.materialRate}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialRate");
                                            commonSetState(this, "gateEntryDto.gateEntryLineList." + i + ".materialCost", item.materialQty * item.materialRate)
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.materialCost}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialCost");
                                          }}
                                        />
                                      </td> */}
                                      <td>
                                        <label className="mr-4 label_12px">{item.materialCost}</label>
                                      </td>
                                      { "NRGP" === gateEntryDto.docType?"": 
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.repairingCost}
                                       //   disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".repairingCost");
                                          }}
                                        />
                                      </td>}
                                      <td>
                                      <textarea
                                              class="form-control" rows="1"
                                            //  disabled={gateEntryDto.reqNo}
                                             value={item.purpose}
                                             onChange={(event) => {
                                             commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".purpose");
                                                 }}
                                                   />
                                      </td>
                                      <td>

                                        <button
                                          className={
                                            "btn " +
                                            (i === 0
                                              ? "btn-outline-success"
                                              : "btn-outline-danger")
                                          }
                                          onClick={() => {
                                            i === 0
                                              ? this.addGateEntry()
                                              : this.removeGateEntry(i);
                                          }}
                                          type="button"
                                        >
                                          <i
                                            class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                )
                              })
                              }
                            </tbody>
                          </table>
                        </StickyHeader>
                      </div>
                    </div>
                  </div>
                </div>
              
                <div className="col-12 mb-2">
                  <div className="d-flex justify-content-center">
                    {/* {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED", "FH REJECTED", "HOD REJECTED"].includes(gateEntryDto.status) ? */}
                    {/* {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED", "PLANT HEAD REJECTED", "HOD REJECTED"].includes(gateEntryDto.status) ? */}
                    {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED", "PH/HOD REJECTED", "FH/HOD REJECTED"].includes(gateEntryDto.status) ?
                      <Button color="primary" variant="contained" type="button" onClick={this.handleSubmit} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Save</Button> : null}
                    {/* {"CREATED" === gateEntryDto.status && <> */}
                    {"CREATED" === gateEntryDto.status && this.state.role==="FH/HODAPP" ?<>
                      {/* <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("hodApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "hodReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>} */}
                       <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("fhORhodApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "fhORhodReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>:""}
                    {/* {"NRGP" === gateEntryDto.docType && "FH APPROVED" === gateEntryDto.status && <>
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>} */}
                    {/* {"NRGP" === gateEntryDto.docType && "PLANT HEAD APPROVED" === gateEntryDto.status && <> */}
                    {"NRGP" === gateEntryDto.docType && "PH/HOD APPROVED" === gateEntryDto.status &&  this.state.role==="COMAPP" ?<>
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>:""}

                    {/* {"RGP" === gateEntryDto.docType && "HOD APPROVED" === gateEntryDto.status && <> */}
                    {"RGP" === gateEntryDto.docType && "FH/HOD APPROVED" === gateEntryDto.status && this.state.role==="COMAPP" ?<>
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>:""}

                    {/* {"HOD APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType && <>
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("functionalApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "functionalReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>} */}

                    {/* {"HOD APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType && <> */}
                    {/* <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("plantheadApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "plantheadReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>} */}
                    {"FH/HOD APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType &&  this.state.role==="PH/HODAPP" ?<>
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("plantheadORhodApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</Button>
                      <Button color="primary" variant="contained" type="button" onClick={(e) => this.updateStatusRemark(e, "plantheadORhodReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</Button></>:""}
                    {"COMMERCIAL APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType && "SECADM"===this.state.role &&
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("nrgpClosed")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</Button>}
                    {"COMMERCIAL APPROVED" === gateEntryDto.status && "RGP" === gateEntryDto.docType && "SECADM"===this.state.role &&
                      <Button color="primary" variant="contained" type="button" onClick={() => this.updateStatus("rgpGateout")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</Button>}
                      {/* {!isEmpty(gateEntryDto.status) && gateEntryDto.status!== "CANCELED"? */}
                      {!isEmpty(gateEntryDto.status) && gateEntryDto.status!== "CANCELED" && gateEntryDto.status!=="GATE OUT" ?
                       <Button color="primary" variant="contained" className={"btn btn-danger"} type="button" onClick={(e)=>{this.onComfirmationOfCancelGateEntry(e) ; }}>Cancel Request</Button> 
                      :""}
                      <Button variant="contained" size="small" className="ml-2" color="primary" type="button" onClick={this.handleRedirect}>Back</Button> 
                      
                  </div>
                </div>
              </div>


            </div>


          </FormWithConstraints>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.gateEntryRgpReducer;
};
export default connect(mapStateToProps, actionCreators)(GateEntryRgpDetail);