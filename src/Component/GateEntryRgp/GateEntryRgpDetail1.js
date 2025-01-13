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
import { formatDateWithoutTime,formatDateWithoutTimeNewDate,formatDateWithoutTimeNewDate1,formatTime } from "../../Util/DateUtil";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { ROLE_APPROVER_ADMIN, ROLE_REQUISTIONER_ADMIN, ROLE_PURCHASE_MANAGER_ADMIN, ROLE_BUYER_ADMIN, ROLE_PARTNER_ADMIN } from "../../Constants/UrlConstants";
import Loader from "../FormElement/Loader/LoaderWithProps";
import alkylLogo from "../../img/Alkyl logo.png";
import printlogo from "../../img/logoPrint.png";
import RCLogo from "../../img/RC-Logo.jpg";
import { Col, Divider, Row, Table } from 'antd';



class GateEntryRgpDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gateEntryLineDto:[],
      gateEntryLineDtoTest:[],
      //componentRef:null,
      gateEntryDto: {
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
            receivedQty:0,
            gateInQty:0,
            gateEntry:{
              gateEntryId:""
            }
          }
        ]
      },
      plantDropDownList:[],
      url:"", 
      formno:""    
    };
  }
  handleSubmit = () => {

    if((this.state.gateEntryDto.gateEntryLineList[0].materialQty!=this.state.gateEntryDto.gateEntryLineList[0].receivedQty)){
  
    if(this.state.gateEntryDto.gateEntryLineList[0].gateInQty!=0 && this.state.gateEntryDto.gateEntryLineList[0].gateInQty!=null && this.state.gateEntryDto.gateEntryLineList[0].gateInQty!=""){
  
    commonSubmitFormNoValidationWithData(this.state.gateEntryDto, this, "gateEntryRgpSubmit", "/rest/rgpGateIn");
  
      }else{
  
        swal({
          title: "Wrong",
          text: "Gate In Quantity Cannot be Null or 0",
          icon: "warning",
          type: "warning"
        })

      }
    }else{
  
      swal({
            title: "Wrong",
            text: "No Quantity is pending to Receive",
            icon: "warning",
            type: "warning"
          })

    }
    }
   

  updateStatus = (url) => {
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
      serialNo: 1,
      materialCode: "",
      materialDesc: "",
      materialQty: 0,
      materialRate: 0,
      materialCost: 0,
      repairingCost:0,
      receivedQty: 0,
      gateInQty: 0,
      gateEntry:{
        gateEntryId:""
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
handleFilterClick = () => {
  this.props.onFilter && this.props.onFilter();
  this.setState({ formDisplay: !this.state.formDisplay });
  this.setState({ searchDisplay: !this.state.searchDisplay });
  commonSubmitWithParam(this.props,"getFormNo",'/rest/formNoPrint',this.state.gateEntryDto.plant, this.state.gateEntryDto.docType)
}

onComfirmationOfCancelGateEntry(e) {
     
  swalWithTextBox(e, this, "onCancelGateEntryRequest");
 
}

onCancelGateEntryRequest = (value) => {
//  this.props.changeLoaderState(true);
  commonSubmitWithParam(this.props, "cancelgateentryrequest", "/rest/cancelGateEntryRequest", this.state.gateEntryDto.gateEntryId, value)
}

// componentDidMount(){
//   submitToURL(`/rest/getRGPPlant`).then(({objectMap}) => { 
//      console.log("PLANT LIST ---->>>",objectMap);
//      let plantListArray = [];
//      Object.keys(objectMap.plantList).map((key) => {
//       plantListArray.push({ display: objectMap.plantList[key], value: key });
//     });
//         this.setState({
//           plantDropDownList:plantListArray
//         })  
  
//   });
// }



UNSAFE_componentWillReceiveProps = props => {
  if (!isEmpty(props.gateEntryLineDto) && !isEmpty(props.gateEntryLineDto[0])) {
    debugger
    let gateEntryDto = props.gateEntryLineDto[0].gateEntry;
    debugger
    gateEntryDto = {
      ...gateEntryDto,
      gateEntryLineList: []
    }
    let lineItem = [];
    props.gateEntryLineDto.map((item,i)=>{
      item.gateInQty = 0;
      lineItem.push(item);
    })
    // gateEntryDto.gateEntryLineList = props.gateEntryLineDto;
    gateEntryDto.gateEntryLineList = lineItem;
    this.setState({ gateEntryDto: gateEntryDto })
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



gateInQty = (e,item,i)=>{
  debugger
  let value = isEmpty(e.target.value)?0:e.target.value;
  let materialQty = isEmpty(item.materialQty)?0:item.materialQty;
  let receivedQty = isEmpty(item.receivedQty)?0:item.receivedQty;
  if(parseInt(value) <= parseInt(materialQty)-parseInt(receivedQty)){
    commonHandleChange(e, this, "gateEntryDto.gateEntryLineList." + i + ".gateInQty");
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
  //name
  //+ "-" + 
//  hodDate;
}

approvedBy() {

  let name = ""
  //let fhDate = ""
  let plantheadDate = ""
  {
    this.state.gateEntryLineDtoTest.map((item, i) => {
       
     //if(item.gateEntry.fh===null){
      if(item.gateEntry.planthead===null){
        name=" ";
      }
      else{
        // name = item.gateEntry.fh.name
        name = item.gateEntry.planthead.name
      }
      
    //fhDate = item.gateEntry.fhDate
    plantheadDate = item.gateEntry.plantheadDate
    })
  }
  return  (
    <table>
    <tr>
      <td>{name}</td>
    </tr> 
    <tr>
    {/* <td>{formatDateWithoutTimeNewDate1(fhDate)}</td> */}
   <td>{formatDateWithoutTimeNewDate1(plantheadDate)}</td>
  </tr>
  <tr>
  {/* <td>{ fhDate===null?"":formatTime(fhDate)}</td> */}
  <td>{ plantheadDate===null?"":formatTime(plantheadDate)}</td>
</tr>
</table>
 
  )
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
  <td>{commercialDate===null?"":formatTime(commercialDate)}</td>
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
       Raigad,Patalganga,,410220,India</div>
    )
  }
  else if (gateEntryDto.plant == "1202") {
    return (
      <div>Alkyl Amines Chemicals Limited.<br></br>
        PLOT No.D-6/1,D-6/2, MIDC Kurkumbh,,Taluka Daund<br></br>
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



    var frmhidden = {
      display: this.state.formDisplay ? "none" : "block"
    }
    var searchHidden = {
      display: this.state.searchDisplay ? "block" : "none"
    }
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
          
          {/* <Row style={{ marginTop: 10 }}>
          <Col span={8}>
          <a href="userdashboard" className="navbar-brand"><img src={alkylLogo} alt="" /></a>
             <img className="navbar-brand" src={alkylLogo} alt="" /> 
            
            </Col>
            <Col span={8} offset={8}>
            <img class="resLogo" src={RCLogo} alt="" />
            </Col>
          </Row> */}
          
          {/* <p align="center"><b>{this.docType()}</b></p><br></br> */}

          <Row>
          <Col span={12}>
            <fieldset class="scheduler-border">
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
                    <th>Vendor Name :</th>
                    <td>{gateEntryDto.vendorName}</td>
                  </tr>
                  <tr>
                    <th>Address :</th>
                    <td>{gateEntryDto.vendorAddress}</td>
                  </tr>
                  <br/>
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
               <td>{this.authorizedBy()}</td>
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
            
          {/* <Row></Row> */}
          {/* <Row style={{ marginTop: 32 }}>
            <b>
             {this.plantAddress()}
            </b>

          </Row> */}

          {/* <Row gutter={24} style={{ marginTop: 48 }}>
            <Col span={8}>
              <b>
                <table>
                  <tr>
                    <th>To :</th>
                    <td>{gateEntryDto.vendorName}</td>
                  </tr>
                  <tr>
                    <th>Address :</th>
                    <td>{gateEntryDto.vendorAddress}</td>
                  </tr>

                </table>
              </b>

            </Col>


            <Col span={8} offset={8}>
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
            </Col>
          </Row> */}
          {/* <Row style={{ marginTop: 50 }}>
            <div>
              <p>
                <b>
                  We are sending herewith the following Material on Returnable BASIS<br></br>
                  PLEASE QUOTE THE OUT REQUEST NO IN YOUR DELIVERY CHALLAN WHILE RETURNING THE MATERIALS</b>
              </p>
            </div>
          </Row> */}
          {/* <Row gutter={24} style={{ marginTop: 48 }}>
            <table className="table table-bordered table-header-fixed">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="w-6per"> Sr No. </th>
                  <th className="w-6per"> Material Details</th>
                  <th className="w-4per"> Material Description</th>
                  <th className="w-6per">Quantity </th>
                  <th className="w-6per"> Rate </th>
                  <th className="w-6per">Value</th>

                </tr>
              </thead>
              <tbody>
                {gateEntryLineList.map((item, i) => {
                  return (
                    <>
                      <tr class="accordion-toggle" >
                        <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th>
                        <td>{item.serialNo}

                        </td>
                        <td>{item.materialCode}

                        </td>

                        <td>{getDecimalUpto(item.materialQty,3)}

                        </td>

                        <td>{getDecimalUpto(item.materialRate,2)}

                        </td>

                        <td>
                          {getDecimalUpto(item.materialCost,2)}
                        </td>

                      </tr>

                    </>
                  )
                })
                }
              </tbody>

            </table>
          </Row> */}
          {/* <Row style={{ marginTop: 48 }}>
            <Col span={8} offset={16}>
              <table>
                <tr>
                  <th>**Total Value** :</th>
                  <td><b>{this.subtotal()}</b></td>
                </tr>

              </table>
            </Col>
          </Row> */}

          {/* <Row style={{ marginTop: 100 }}>
            <Col span={8}>
              <b>
                <table>
                <tr>
                    <th>Purpose:</th>
                    <td>{gateEntryDto.purpose }</td>
                  </tr>
                  <tr>
                    <th>Return By :</th>
                    <td>{formatDateWithoutTimeNewDate1(gateEntryDto.returnBy)}</td>
                  </tr>
                  <tr>
                    <th>Transporter Name :</th>
                    <td>{ gateEntryDto.transporterName}</td>
                  </tr>
                  <tr>
                    <th>Vehicle No :</th>
                    <td>{gateEntryDto.vehicleNo }</td>
                  </tr>
                  <tr>
                    <th>Send To GPRN No :</th>
                    <td>{ }</td>
                  </tr>

                </table>
              </b>

            </Col>

            <Col span={8} offset={8}>
              <b>
                <table>

                  <tr>
                    <th>Vehicle Type :</th>
                    <td>{ gateEntryDto.vehicleType}</td>
                  </tr>
                  <tr>
                    <th>GPRN Date :</th>
                    <td>{ }</td>
                  </tr>

                </table>
              </b>

            </Col>

          </Row> */}

          {/* <Row style={{ marginTop: 100 }}>
            <Col span={8}>
              <tr>
                <th>PREPARED BY :</th>

              </tr>

            </Col>
            <Col span={8}>


              <tr>
                <th>APPROVED BY :</th>


              </tr>

            </Col>
            <Col span={8}>
              <tr>
                <th>AUTHORISED BY :</th>

              </tr>
            </Col>
          </Row> */}

          <Row align={"center"} style={{ marginTop: 50 }}>
            <button type="button" id="printbtn" class="btn btn-primary" onClick={this.print}>Print</button>
          </Row>
          <div>


          </div>
        </div>

        <div className="container-fluid mt-100 w-100">
          <FormWithConstraints ref={formWithConstraints => this.prForm = formWithConstraints}>
            <div style={frmhidden}>
              <div className="card my-2">
                <div className="row mt-0 px-4 pt-1">

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
                       // disabled
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
                      //  disabled
                        onChange={(e) => {
                          commonHandleChange(e, this, "gateEntryDto.vendorAddress");
                        }}
                      />
                    </span>
                  </div>

                  {/* <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">PO Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gateEntryDto.poNo}
                      disabled
                      onChange={(e) => {
                        commonHandleChange(e, this, "gateEntryDto.poNo");
                      }}
                    />
                  </div> */}

                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="mr-4 label_12px">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gateEntryDto.remark}
                    //  disabled
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
                    //  disabled
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

                </div>
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
                                <th className="w-6per"> Serial </th>
                                <th className="w-4per"> Material Code</th>
                                <th className="text-right w-7per"> Material. Rate </th>
                                <th className="text-right w-8per">Material Cost</th>
                                <th className="text-right w-8per">Repairing Cost</th>
                                {/* <th className="w-4per"> Material Description</th> */}
                                <th className="text-right w-7per"> Material. Qty </th>
                                <th className="text-right w-8per">Recieved Qty</th>
                                <th className="text-right w-8per">Gate In Qty</th>
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
                                        //  disabled={gateEntryDto.reqNo}
                                          value={item.materialCode}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialCode");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          className={"form-control"}
                                          value={item.materialRate}
                                      //    disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialDesc");
                                          }}
                                        />
                                      </td>
                                     
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.materialCost}
                                      //    disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialRate");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.repairingCost}
                                        //  disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialCost");
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                        <input
                      
                                          className={"form-control"}
                                          value={item.materialDesc}
                                          disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".repairingCost");
                                          }}
                                        />
                                      </td> */}
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.materialQty}
                                      //    disabled={gateEntryDto.reqNo}
                                          onChange={(event) => {
                                            commonHandleChange(event, this, "gateEntryDto.gateEntryLineList." + i + ".materialQty");
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <label className="mr-4 label_12px">{item.receivedQty}</label>
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className={"form-control"}
                                          value={item.gateInQty}
                                          onChange={(event) => {
                                            this.gateInQty(event,item,i)
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
                    {/* {isEmpty(gateEntryDto.status) || ["COMMERCIAL REJECTED","FH REJECTED","HOD REJECTED"].includes(gateEntryDto.status) && */}
                      <button type="button" onClick={this.handleSubmit} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Release</button>
                      {gateEntryDto.status!== "CANCELED" ?
                       <button className={"btn btn-danger"} type="button" onClick={(e)=>{this.onComfirmationOfCancelGateEntry(e) ; }}>Cancel Request</button> 
                      :""}
                      
                    {/* {"CREATED"===gateEntryDto.status &&<>
                      <button type="button" onClick={()=>this.updateStatus("hodApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;HOD Approval</button>
                      <button type="button" onClick={(e)=>this.updateStatusRemark(e,"hodReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;HOD Reject</button></>}
                      
                      {"NRGP"===gateEntryDto.docType && "FH APPROVED"===gateEntryDto.status &&<>
                      <button type="button" onClick={()=>this.updateStatus("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;COMM Approval</button>
                      <button type="button" onClick={(e)=>this.updateStatusRemark(e,"commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;COMM REJ</button></>}

                      {"RGP"===gateEntryDto.docType && "HOD APPROVED"===gateEntryDto.status &&<>
                      <button type="button" onClick={()=>this.updateStatus("commApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;COMM Approval</button>
                      <button type="button" onClick={(e)=>this.updateStatusRemark(e,"commReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;COMM REJ</button></>}

                    {"HOD APPROVED"===gateEntryDto.status && "NRGP"===gateEntryDto.docType &&<>
                      <button type="button" onClick={()=>this.updateStatus("functionalApproval")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Functional Head Approval</button>
                      <button type="button" onClick={(e)=>this.updateStatusRemark(e,"functionalReject")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Functional Head REJ</button></>}

                    {"COMMERCIAL APPROVED"===gateEntryDto.status && "NRGP"===gateEntryDto.docType &&
                      <button type="button" onClick={()=>this.updateStatus("nrgpClosed")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</button>}
                    {"COMMERCIAL APPROVED"===gateEntryDto.status && "RGP"===gateEntryDto.docType &&
                    <button type="button" onClick={()=>this.updateStatus("rgpGateout")} className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-check" />&nbsp;Gate Out</button>} */}
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