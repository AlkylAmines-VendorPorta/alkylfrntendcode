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
import { formatDateWithoutTime,formatDateWithoutTimeNewDate,formatDateWithoutTimeNewDate1, formatDateWithoutTimeWithMonthName, formatTime } from "../../Util/DateUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN, ROLE_REQUISTIONER_ADMIN, ROLE_PURCHASE_MANAGER_ADMIN, ROLE_BUYER_ADMIN, ROLE_PARTNER_ADMIN } from "../../Constants/UrlConstants";
import Loader from "../FormElement/Loader/LoaderWithProps";
import alkylLogo from "../../img/Alkyl logo.png";
import printlogo from "../../img/logoPrint.png";
import RCLogo from "../../img/RC-Logo.jpg";
import { Col, Divider, Row, Table } from 'antd';


import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);



class GateEntryRgpDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open:false,
      inputValue:"",
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
      url:"",
      formno:""
    };
  }
  handleSubmit = () => {
   this.transporterDetails();
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
      Object.keys(objectMap.TransporterData).map((key) => {
        transporterListArray.push({ display: objectMap.TransporterData[key], value: key });
      });
      this.setState({
        TransporterDropDownList: transporterListArray
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
     commonSubmitWithParam(this.props,"getGateEntryVendorSAP",'/rest/getVendorDataSAP',this.state.gateEntryDto.vendorCode)
    
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

    if (!isEmpty(props.VendorData)) {

      this.state.gateEntryDto.vendorName=props.VendorData.vendorName;
      this.state.gateEntryDto.vendorAddress=props.VendorData.vendorAddress;
      this.setState({
        vendorName:this.state.gateEntryDto.vendorName,
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

  print() {
    window.print();
  }

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
      {/* <td>{formatDateWithoutTimeNewDate1(hodDate)}</td> */}
      <td>{formatDateWithoutTimeNewDate1(plantheadDate)}</td>
    </tr>
    <tr>
    {/* <td>{ hodDate===null?"":formatTime(hodDate)}</td> */}
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
  //       <td>{name}</td>
  //     </tr> 
  //     <tr>
  //     <td>{formatDateWithoutTimeNewDate1(fhDate)}</td>
  //   </tr>
  //   <tr>
  //   <td>{ fhDate===null?"":formatTime(fhDate)}</td>
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
      display: this.state.searchDisplay ? "block" : "none"
    }
    // console.log("plantDropDownListplantDropDownList",this.state.plantDropDownList);
    return (
      <>
        <div>

          <button type="button" id="togglesidebar" onClick={this.handleFilterClick.bind(this)} style={frmhidden} class="btn btn-primary">Print Details</button>
        </div>
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
                  <th>Request No :</th>
                  <td>{gateEntryDto.reqNo}</td>
                </tr>
              </table>
            </Col>
            <Col span={8}>
            </Col>
            <Col span={8} align="right">
            <table>
                <tr>
                  <th> Date :</th>
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
                    <td><b> {this.plantAddress() } </b></td>
                  </tr>
                  <br/>
                </table> */}
                <table>
                  <tr>
                    <th>From</th>
                    </tr>
                    <tr>
                    <td> {this.plantAddress() } </td>
                  </tr>
                  <tr>
                    <th></th>
                    <td>.</td>
                  </tr>
                </table>
            </fieldset>
          </Col> 
            <Col span={12}>
            <fieldset class="scheduler-border">
            <table>
                  <tr>
                    <th>To,</th>
                    </tr>
                    <tr>
                    <td>{gateEntryDto.vendorName}</td>
                  </tr>
                  <tr>
                    <td>{gateEntryDto.vendorAddress}</td>
                  </tr>
                  <br/>
                
                </table>
            </fieldset>
            </Col>
            {/* <Col span={8} offset={8}>
              <table>
                <tr>
                  <th>Request No :</th>
                  <td>{gateEntryDto.reqNo}</td>
                </tr>
                <tr>
                  <th>Date:</th>
                  <td>{formatDateWithoutTime(gateEntryDto.created)}</td>
                </tr>
                <tr>
                  <th>Department :</th>

                  <td>{this.createdBy()}</td>
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
                  <th> <b>PAN NO:</b></th>
                  <td> AAACA6783F<br></br></td>
                </tr>
                <tr>
                  <th>  <b>CIN No:</b></th>
                  <td>L99999MH1979PLC021796<br></br></td>
                </tr>
                <tr>
                  <th><b>GST NO:</b></th>
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
                  <th>Department Name :</th>
                  <td>{this.createdByDepartment()}</td>
                </tr>
                {/* <tr>
                  <th>Department Code :</th>
                  <td>{this.createdBy()}</td>
                </tr> */}
                <tr>
                  <th>Requestioner Name :</th>
                  <td>{this.createdBy()}</td>
                </tr>
                <tr>
                  <th>Transporter :</th>
                  <td>{gateEntryDto.transporterName}</td>
                </tr>
                <tr>
                  <th>Driver Name :</th>
                  <td>{ }</td>
                </tr>
                <tr>
                  <th>LR NO. :</th>
                  <td>{ }</td>
                </tr>
                <tr>
                  <th>Vehicle NO. :</th>
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
          <table className="table table-bordered" >
                <tr className="row m-0">
                  {/* <th>#</th> */}
                  <td className="col-1" ><b> Sr No.</b> </td>
                  <td className="col-4" ><b> Material Details</b></td>
                  <td className="col-1" ><b>UOM</b></td>
                  <td className="col-1" ><b>Quantity</b> </td>
                  <td className="col-1" ><b> Rate</b> </td>
                  <td className="col-1"><b>Amount</b></td>
                  <td className="col-2" ><b>Ref.DocNo. (GPRN) / Date</b></td>
                  <td className="col-1" ><b>Exp.Ret. Date</b></td>
                  {/* <td className="w-6per" ><b>Purpose</b></td> */}
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
                  <th>**Total Amount** :</th>
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
                    <th>Purpose:</th>
                    <td>{gateEntryDto.purpose}</td>
                  </tr> */}
                  <tr>
                    <th>Expected Return Date :</th>
                    <td>{formatDateWithoutTimeNewDate1(gateEntryDto.returnBy)}</td>
                  </tr>
                </table>
              </b>

            </Col>

            <Col span={8} offset={8}>
              <b>
                <table>

                  <tr>
                    <th>Vehicle Type :</th>
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
                    <th>Remarks:</th>
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
                <th>PREPARED BY :</th>

              </tr>
              <tr>
                <td>{this.preparedBy()}</td>
              </tr>

            </Col>
            <Col span={6}>
              <tr>
                <th>APPROVED BY :</th>
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
                <th>STORE IN-CHARGE/AUTHORISED BY:</th>
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
                <th>AUTHORISED BY :</th>
              </tr>
              <tr>
                <td>{this.authorizedBy()}</td>
              </tr>
            </Col>
            <Col span={6}>
              <tr>
                <th>STORE IN-CHARGE :</th>
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
            <button type="button" id="printbtn" class="btn btn-primary" onClick={this.print}>Print</button>
          </Row>
          <div>


          </div>
        </div>
        <div className="container-fluid mt-100 w-100" id="togglesidebar"  >
          <FormWithConstraints ref={formWithConstraints => this.prForm = formWithConstraints}>
            <div style={frmhidden}>
              <div className="card my-2" >

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

                {gateEntryDto.reqNo==""?
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
                          <button type="button" className={"btn btn-primary"} onClick={this.searchVendorData.bind(this)}> Search </button>
                      </div>
                       </div> :""
  }
                <div className="row mt-0 px-4 pt-2">
                  <label className="col-sm-2">Vendor Name</label>


                  <div className="col-sm-2" >
                    <span className="display_block">
                      <input
                        type="text"
                        className="form-control"
                      //  disabled={gateEntryDto.reqNo}
                        value={gateEntryDto.vendorName}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorName");
                        }}
                      />
                    </span>


                  </div>
                  <label className="col-sm-2">Address</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      <textarea
                        className={"h-50px form-control"}
                    //  disabled={gateEntryDto.reqNo}
                      defaultValue={gateEntryDto.vendorAddress}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}

                      />
                      {/* <input
                        type="text"
                        className="form-control"
                        value={gateEntryDto.vendorAddress}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}
                      /> */}
                    </span>
                  </div>
                  <label className="col-sm-2">Status</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>
                </div>



                <div className="row mt-0 px-4 pt-2">
                  {/* <label className="col-sm-2">PO NO</label>
                  <div className="col-sm-2">
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"
                      disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.poNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.poNo");
                      }}
                    />

                  </div> */}
                  {/* <div className="col-sm-2"></div>
                  <div className="col-sm-2"></div>
                  <label className="col-sm-2"></label>
                  <div className="col-sm-2" >
                  </div>
                  <label className="col-sm-2">Status</label>
                  <div className="col-sm-2" >
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>*/}
                </div>
                {"NRGP" === gateEntryDto.docType?"":
                <div className="row mt-0 px-4 pt-2">
                  {/* <label className="col-sm-2">Purpose..</label>
                  <div className="col-sm-2" >
                    <textarea
                      class="form-control" rows="1"
                    //  disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.purpose}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.purpose");
                      }}
                    />
                  </div> */}

                  {/* <label className="col-sm-2"></label>
                  <div className="col-sm-2" >
                  </div> */}
                  {/* <label className="col-sm-2">Return By</label> */}
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
                    {/* <textarea
                      class="form-control" rows="1"
                    //  disabled={gateEntryDto.reqNo}
                      value={gateEntryDto.transporterName}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.transporterName");
                      }}
                    /> */}
                  </div>
                  </div>

                <div className="row mt-1 px-4 pt-2">
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
                        {"HOD REJECTED" === gateEntryDto.status ? gateEntryDto.hodRejectDesc : "FH REJECTED" === gateEntryDto.status ? gateEntryDto.rejectDesc : gateEntryDto.commRejectDesc}
                      </span>
                    </div> : null}


                </div>




                {/* <div className="row mt-0 px-4 pt-1">

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Req No</label>
                    <span className="display_block">
                      {gateEntryDto.reqNo}
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Vendor Name</label>
                    <span className="display_block">
                      <input
                        type="text"
                        className="form-control"
                        value={gateEntryDto.vendorName}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorName");
                        }}
                      />
                    </span>
                  </div>

                  <div className="col-12 col-md-4 col-lg-4">
                    <label className="mr-4 label_12px">Vendor Address</label>
                    <span className="display_block">
                      <input
                        type="text"
                        className="form-control"
                        value={gateEntryDto.vendorAddress}
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}
                      />
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">PO Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gateEntryDto.poNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.poNo");
                      }}
                    />
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gateEntryDto.remark}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.remark");
                      }}
                    />
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Status</label>
                    <span className="display_block">
                      {gateEntryDto.status}
                    </span>
                  </div>

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Doc Type</label>
                    <select className="form-control" 
                      value={gateEntryDto.docType}
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.docType");
                      }}
                    >
                      <option value="">Select</option>
                      <option value="NRGP">NRGP</option>
                      <option value="RGP">RGP</option>
                    </select>
                  </div>
                  {gateEntryDto.status.includes("REJECTED")?
                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Reject Reason</label>
                    <span className="display_block">
                      {"HOD REJECTED"===gateEntryDto.status?gateEntryDto.hodRejectDesc:"FH REJECTED"===gateEntryDto.status?gateEntryDto.rejectDesc:gateEntryDto.commRejectDesc}
                    </span>
                  </div>:null}


                </div> */}
              </div>
              <div className="card my-2">
                <div className="lineItemDiv min-height-0px">
                  <div className="row px-4 py-2">
                    <div className="col-sm-9"></div>
                    {/* <div className="col-sm-3">
                      <input
                        type="text"
                        id="SearchTableDataInputTwo"
                        className="form-control"
                        onKeyUp={searchTableDataTwo}
                        placeholder="Search .."
                      />
                    </div> */}
                    <div className="col-sm-12 mt-2">
                      <div>
                        <StickyHeader height={250} className="table-responsive">
                          <table className="table table-bordered table-header-fixed">
                            <thead>
                              <tr>
                                {/* <th>#</th> */}
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
                                      {/* <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th> */}
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
              </div>
              <hr className="my-1" />
              <div className="row px-4 py-0">
                <div className="col-12">
                  <div className="d-flex justify-content-center">
                    {/* {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED", "FH REJECTED", "HOD REJECTED"].includes(gateEntryDto.status) ? */}
                    {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED", "PLANT HEAD REJECTED", "HOD REJECTED"].includes(gateEntryDto.status) ?
                      <button type="button" onClick={this.handleSubmit} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Save</button> : null}
                    {"CREATED" === gateEntryDto.status && <>
                      <button type="button" onClick={() => this.updateStatus("hodApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "hodReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>}
                    {/* {"NRGP" === gateEntryDto.docType && "FH APPROVED" === gateEntryDto.status && <>
                      <button type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>} */}
                    {"NRGP" === gateEntryDto.docType && "PLANT HEAD APPROVED" === gateEntryDto.status && <>
                      <button type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>}

                    {"RGP" === gateEntryDto.docType && "HOD APPROVED" === gateEntryDto.status && <>
                      {/* <button type="button" onClick={() => this.updateStatus("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button> */}
                      <button type="button" onClick={() => this.updateStatusCommercial("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>}

                    {/* {"HOD APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType && <>
                      <button type="button" onClick={() => this.updateStatus("functionalApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "functionalReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>} */}

                    {"HOD APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType && <>
                      <button type="button" onClick={() => this.updateStatus("plantheadApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Approve</button>
                      <button type="button" onClick={(e) => this.updateStatusRemark(e, "plantheadReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Reject</button></>}


                    {"COMMERCIAL APPROVED" === gateEntryDto.status && "NRGP" === gateEntryDto.docType &&
                      <button type="button" onClick={() => this.updateStatus("nrgpClosed")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</button>}
                    {"COMMERCIAL APPROVED" === gateEntryDto.status && "RGP" === gateEntryDto.docType &&
                      <button type="button" onClick={() => this.updateStatus("rgpGateout")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</button>}
                      {!isEmpty(gateEntryDto.status) && gateEntryDto.status!== "CANCELED" ?
                       <button className={"btn btn-danger"} type="button" onClick={(e)=>{this.onComfirmationOfCancelGateEntry(e) ; }}>Cancel Request</button> 
                      :""}
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