import React from "react";
import DatePick from "../FormElement/DatePick";
import Webcam from "react-webcam";
import WebCame from "./webcame";
import VechicalRegistration from '../VehicleRegistration/VehicleRegistration';
import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange,
  commonSetState,
  commonHandleFileUpload,
  swalWithTextBox,
} from "../../Util/ActionUtil";
import * as actionCreators from "./Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { formatDateWithoutTime ,formatDateWithoutTimeNewDate} from "../../Util/DateUtil"
import swal from "sweetalert";
import { Button, TextField } from "@material-ui/core";
class ReportVechical extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadDocs: false,
      startDate: new Date(),
      docImage: "",
      driverImage: "",
      imageClicked: 'false',
      imageData: this.props,
      buttonType: '',
      loadVehicleReg: true,
      vehicleRegForm: {
        saleOrderNo: "",
        requiredOn: "",
        plant: "",
        materialCode: "",
        shipToParty: {
          customerId: ""
        },
        soldToParty: {
          customerId: ""
        },
        trasnporter: {
          customerId: ""
        },
        meCode: {
          userId: ""
        },
        qty: "",
        vehicleType: "",
        route: "",
        freightScope: "",
        destination: ""
      },
      vehicleRegForm2: {
        saleOrderNo: "",
        vehicleRegistationId: "",
        vehicleRegistrationNo: "",
        licenseNo: "",
        tripLSP: "",
        driverName: "",
        phoneNo: "",
        expDate: "",
        driverPic: {
          attachmentId: "",
          fileName: "",
          text: "",
          description: ""
        },
        docPic: {
          attachmentId: "",
          fileName: "",
          text: "",
          description: ""
        },
        status: "",
        driverPicString: "",
        docPicString: "",
        invoiceDate: "",
        invoiceNo: ""
      },
      vehicleRegSAPUpdate: {
        saleOrderNo: "",
        requiredOn: "",
        plant: "",
        materialCode: "",
        shipToParty: {
          customerId: ""
        },
        soldToParty: {
          customerId: ""
        },
        trasnporter: {
          customerId: ""
        },
        meCode: {
          userId: ""
        },
        qty: "",
        vehicleType: "",
        route: "",
        freightScope: "",
        destination: ""
      }
    };
  }

  handleButtonType = () => {
    this.setState({
      buttonType: 'Driver',
      loadDocs: true
    });
  };

  handleButtonTypeDocument = () => {
    this.setState({
      buttonType: 'Document',
      loadDocs: true
    });
  };

  //   videoConstraints = () => {
  //   width= 1280,
  //   height= 720,
  //   facingMode= "user"
  // };


  // capture = () =>{  
  //   console.log("propscc",this.props)
  //   const capture = this.state.docImage;
  //   console.log("capture",capture)

  // }

  WebcamCapture = () => {
    
    this.props.webcamRef.current.getScreenshot(this.state.docImage);
    const capture = this.state.docImage;
    // console("IMAGE CAPTURED",capture)
  };

  onWebCame = (props) => {
    console.log("props", this.props)
    console.log("props.capture", props.capture)
  }

  changeLoaderState = (action) => {
    this.setState({ isLoading: action });
  }

  UNSAFE_componentWillReceiveProps = async props => {
    this.changeLoaderState(false);
    if (props.vehicleRegCustId && this.state.loadVehicleReg) {
      this.setState({ loadVehicleReg: false });
      commonSubmitWithParam(
        props,
        "populateVehicleReg",
        "/rest/getVehicleREGByID",
        props.vehicleRegCustId
      );
    }
    if (!isEmpty(props.vehicleReg)) {
      commonSetState(this, "vehicleRegForm2.vehicleRegistationId", props.vehicleReg.vehicleRegistationId);
      this.setState({
        vehicleRegForm: props.vehicleReg,
        vehicleRegForm2: props.vehicleReg
      })
    }

    if (!isEmpty(props.vehicleRegSAPUpdate)) {
     
      this.setState({
        vehicleRegSAPUpdate: props.vehicleRegSAPUpdate,
        
      })
    }
  }

  setImage = (type, image) => {
    
    if (this.state.loadDocs) {
      if (type === "Driver") {
        commonSetState(this, "vehicleRegForm2.driverPicString", image);
      } else if (type === "Document") {
        commonSetState(this, "vehicleRegForm2.docPicString", image);
      }
      this.setState({ loadDocs: false })
    }
  }

  gateOutInvoiceNO = (e) => {

    if (this.state.vehicleRegForm2.invoiceNo != ""){
     commonSubmitWithParam(this.props, "vehicleGateOUT","/rest/vehicleGateOUT",this.state.vehicleRegForm2.vehicleRegistationId)
    }
    else {
      swal({  
        title: " Oops!",  
        text: " Invoice is not generated, Gate Out not allowed",  
        icon: "warning",  
        button: "OK",  
      });  
    }
  }
 
 

  onComfirmationOfCancelAsn(e) {
     
    swalWithTextBox(e, this, "onCancelASN");
   
 }

 onCancelASN = (value) => {
 //  this.props.changeLoaderState(true);
    commonSubmitWithParam(this.props, "cancelASN", "/rest/cancelVehicleRegistration", this.props.vehicleReg.vehicleRegistationId, value)
 }
 print() {
  window.print();
}
  render() {
    const vehicleRegForm2 = this.state.vehicleRegForm2;
    const vehicleRegFormsales = this.state.vehicleRegForm2.saleOrderNo;
    console.log("vehicleRegForm2", vehicleRegForm2)

    return (
      <>
        
        <VechicalRegistration
          showSubmitButton={false}
          vehicleRegForm={this.state.vehicleRegForm}
          vehicleRegSAPUpdate={this.state.vehicleRegSAPUpdate}
        />
       


        <div class="modal fade" id="exampleModal" tabindex="-10" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Click Image</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <WebCame
                  imgSrc={this.props.onWebCame}
                  value={this.state.buttonType}
                  setImage={(type, base64Img) => this.setImage(type, base64Img)}
                />
              </div>
            </div>
          </div>
        </div>

{this.props.OutwardReportdisplay==true?"":
         <div className="card" style={{marginLeft:"20px", marginRight:"20px" }}>
        
          <div className="card-body" style={{paddingLeft:"10px"}}>
            <FormWithConstraints>
            <div class="d-flex bd-highlight">
              <div class="p-2 flex-fill bd-highlight">
                <div className="row mt-1">
                  <label className="col-sm-6 mb-3">Vehicle Registration No </label>
                    <div className="col-sm-6 mb-3">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        className="form-control"
                        value={vehicleRegForm2.vehicleRegistrationNo}
                        onChange={(e) => {
                          commonHandleChange(e, this, "vehicleRegForm2.vehicleRegistrationNo");
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mt-1">
                    <label className="col-sm-6 mb-3" >Licence No</label>
                    <div className="col-sm-6 mb-3" >
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        className="form-control"
                        value={vehicleRegForm2.licenseNo}
                        onChange={(e) => {
                          commonHandleChange(e, this, "vehicleRegForm2.licenseNo");
                        }}
                      />
                    </div>
                 
                    </div>
                    <div className="row mt-1">
                      <label className="col-sm-6 mb-3" >Trip LSP</label>
                      <div className="col-sm-6 mb-3" >
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                          type="text"
                          className="form-control"
                          value={vehicleRegForm2.tripLSP}
                          onChange={(e) => {
                            commonHandleChange(e, this, "vehicleRegForm2.tripLSP");
                          }}
                        />
                      </div>
                    </div>
                    <div className="row mt-1">
                      <label className="col-sm-6 mb-3" for="exampleInputEmail1">Driver Name
                      </label>
                      <div className="col-sm-6 mb-3">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                          type="text"
                          className="form-control"
                          value={vehicleRegForm2.driverName}
                          onChange={(e) => {
                            commonHandleChange(e, this, "vehicleRegForm2.driverName");
                          }}
                        />
                      </div>
                    </div>
                     <div className="row mt-1">
                
                    <label className="col-sm-6 mb-3" for="exampleInputEmail1">Expiry Date
                    </label>
                    <div className="col-sm-6 mb-3">
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="date"
                        className={"form-control"}
                        // value={formatDateWithoutTime(vehicleRegForm2.expDate)}
                      value={formatDateWithoutTimeNewDate(vehicleRegForm2.expDate)}
                        onChange={(e) => {
                          commonHandleChange(
                            e,
                            this,
                            "vehicleRegForm2.expDate"
                          );
                        }}
                      />
                    </div>
                
                   </div>
                   <div className="row mt-1">
                   <label className="col-sm-6 mb-3" for="exampleInputEmail1">Phone No
                    </label>
                      <div className="col-sm-6 mb-3">
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                          type="text"
                          className="form-control"
                          value={vehicleRegForm2.phoneNo}
                          onChange={(e) => {
                            commonHandleChange(e, this, "vehicleRegForm2.phoneNo");
                          }}
                        />
                      </div>

                    </div>
                  </div>

                  <div class="p-2 flex-fill bd-highlight" style={{'max-width':'25%'}}>
                  <div className="row mt-1">

                      {vehicleRegForm2.driverPicString?
                    
                      <div className="col-sm-12" >
                      <img src={vehicleRegForm2.driverPicString} className="w-100 alkylLogo" alt="Alkyl" />
                      </div>
                  
                      :""}  
                      <div>
                       <div className="col-sm-12"> 
                       <Button variant="contained" color="primary"type="button"  data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonType() }}>
                          Capture Driver Photo
                        </Button>
                        </div>
                      </div>
                      </div>
                      </div>
                <div class="p-2 flex-fill bd-highlight" style={{'max-width':'25%'}}>
                      <div className="row mt-1">
                      {vehicleRegForm2.docPicString?
                      <div className="col-sm-12" >
                      <img src={vehicleRegForm2.docPicString} className="w-100 alkylLogo" alt="Alkyl" />
                      </div>
                    :""}
                    <div className="col-sm-12">
                    <Button variant="contained" color="primary" type="button"  data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonTypeDocument() }}>
                    Document Capture
                    </Button>
                    </div>
                    </div>

                 </div>
                           
            </div>

              <div className="col-sm-12 m-2 d-flex justify-content-center" >
              <Button variant="contained" color="primary" className={this.props.role!== "VENADM" ? "btn btn-primary mr-1" : "none"} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
              {vehicleRegForm2.status === "CR" ?
                // <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <Button variant="contained" color="primary" type="button" onClick={() => commonSubmitFormNoValidationWithData(this.state.vehicleRegForm2, this, "reportVehicle", "/rest/reportVehicle")} class="btn btn-primary">Report</Button>
                // </div>
                : null}
              {vehicleRegForm2.status === "RP" ?
                // <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <Button variant="contained" color="primary" type="button" onClick={() => commonSubmitWithParam(
                    this.props,
                    "vehicleGateIN",
                    "/rest/vehicleGateIN",
                    vehicleRegForm2.vehicleRegistationId
                  )} class="btn btn-primary">Gate IN</Button>
                // </div>
                : null}
              {vehicleRegForm2.status === "VGI"  && this.state.vehicleRegForm2.invoiceNo != ""?
                // <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <Button variant="contained" color="primary" type="button" onClick={(e)=>{this.gateOutInvoiceNO(e)}} class="btn btn-primary">Gate OUT</Button>
                // </div>
                : null}

                {vehicleRegForm2.status === "CANCELLED" ?
                // <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <Button variant="contained" color="primary" type="button" onClick={() => commonSubmitWithParam(
                    this.props,
                    "revokeCancel",
                    "/rest/revokeCancellation",
                    vehicleRegForm2.vehicleRegistationId
                  )} class="btn btn-warning">Revoke Cancellation</Button>
                // </div>
                : null}
                &nbsp;
                {/* <Button variant="contained" color="success" type="button" className="btn btn-success mr-1 " id="gateIn" 
                               data-toggle="modal" data-target="#getReportModal"
                               >Print</Button> */}
                               <Button onClick={this.print} variant="contained" color="success" type="button" className="mr-1 "
                               
                               >Print</Button>
                             

{vehicleRegForm2.status !== "CANCELLED" ?
                  <Button variant="contained" color="secondary"  type="button" onClick={(e)=>{this.onComfirmationOfCancelAsn(e)}}>Cancel Request</Button>
                : null}       



               </div>
              
               {/*------------------------------------------  MODAL -----------------------------------------------------------------------------------  */}
               <div className="modal gateEntryModal" id="getReportModal" >
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Driver Details</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body "} >
                           
                                <div class="row my-2">
                                    <div class="col-sm-4"></div>
                                    <div class="col-sm-8">
                                    {<a  className="btn btn-success mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_36?sap-client=100&so=${vehicleRegFormsales}&vehicle=TRUCK`}
                                     target="_blank">TRUCK</a>  }   
                 {
                                    <a className="btn btn-warning mr-2"  id="print" href={`https://172.18.2.36:44300/sap/bc/yweb03_ws_36?sap-client=100&so=${vehicleRegFormsales}&vehicle=TANKER`}
                                     target="_blank">TANKER</a>}   
                                      
                                    </div>
                                </div>
                           
                        </div>
                    </div>    
                </div>
            </div>
                       
            </FormWithConstraints>
          </div>
        </div>}
        {this.props.OutwardReportdisplay==true?
        <div className="col-sm-12 m-2 d-flex justify-content-center" >
         
         <Button variant="contained" color="primary" className={this.props.role!== "VENADM" ? "btn btn-primary mr-1" : "none"} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
          
              </div>:""}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.reportVehicleReducer;
};
export default connect(mapStateToProps, actionCreators)(ReportVechical);