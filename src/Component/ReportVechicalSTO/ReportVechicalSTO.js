import React from "react";
import DatePick from "../FormElement/DatePick";
import Webcam from "react-webcam";
import WebCame from "./webcame";

import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange,
  commonSetState,
  commonHandleFileUpload,
  commonSubmitForm
} from "../../Util/ActionUtil";
import * as actionCreators from "./Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import { formatDateWithoutTime ,formatDateWithoutTimeNewDate,formatDateWithoutTimeWithMonthName} from "../../Util/DateUtil"
import STOVehicleRegistration from "../STOVehicleRegistration/STOVehicleRegistration";
import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "./../../Util/CommonUtil";
const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
class ReportVechicalSTO extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      poLineList:[],
      poLineArray: [],
      poListforVendor:[],
      loadDocs: false,
      startDate: new Date(),
      docImage: "",
      driverImage: "",
      imageClicked: 'false',
      imageData: this.props,
      buttonType: '',
      loadVehicleReg: true,
      vehicleRegForm: {
        // saleOrderNo: "",
        //saleOrdNo:"",
      
        poNo:"",
        requiredOn: "",
       //  plant: "",
       fromPlant:"",
       toPlant:"",
       
        materialCode: "",
       //  shipToParty: '',
       //  soldToParty: '',
        trasnporter: '',
        // shipToParty: {
        //   customerId: ""
        // },
        // soldToParty: {
        //   customerId: ""
        // },
        // trasnporter: {
        //   customerId: ""
        // },
       //  meCode: {
       //    userId: ""
       //  },
        qty: "",
        vehicleType: "",
        route: "",
        freightScope: "",
        destination: ""
      },
      vehicleRegForm2: {
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
        docPicString: ""
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

  onSubmit = (e) => {
    commonSubmitForm(e, this, "markASNInTransit", "/rest/markASNInTransitSTO");
// commonSubmitForm(e,this, "securityASNSubmit","/rest/saveCommercialHeaderDetailsinASN") 
  //commonSubmitWithParam(this.props,"securityASNSubmit","/rest/getInSecurityStatusUpdate103",this.state.securityPOHeaderDto.asnHeaderId)
     
   }

  handlegateoutandasn=(e)=>{

  commonSubmitWithParam(this.props,"vehicleGateOUT","/rest/vehicleGateOUT",this.state.vehicleRegForm2.vehicleRegistationId)

  // commonSubmitForm(e,this, "securityASNSubmit","/rest/saveCommercialHeaderDetailsinASN") 

   

  }

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

  STOASNDetails=async()=>{
    let po=this.props.vehicleReg.poNo;
    commonSubmitWithParam(this.props,"getpoListbypoNo",'/rest/getPObyPONo',po)

    await delay(1000);

    let poId=this.props.poListforVendor[0].purchaseOrderId;
    commonSubmitWithParam(this.props,"getPOLines","/rest/getPOLines",poId);
   
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

  async componentDidUpdate(prevProps){

    if(this.props.vehicleReg.poNo!==prevProps.vehicleReg.poNo){
       this.STOASNDetails()
    }
 
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

    if(!isEmpty(props.poListforVendor) ){

      this.setState({
      
        poListforVendor : props.poListforVendor[0]
      });
     
      // let po = this.getPurchaseOrderFromObj(props.poListforVendor);
      // this.setState({
      //   loadPODetails : false,
      //   po : po
      // });
      
    }

    if(!isEmpty(props.poLineList)){
      this.props.changeLoaderState(false);
      let poLineList = [];
         
          props.poLineList.map((poLine)=>{
           poLineList.push(this.getPOLineFromObj(poLine));
         });
         this.setState({
           poLineArray : poLineList[0]
         });
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

 

  

  render() {
    const poDetails=this.state.poListforVendor;
    const poLineDetails=this.state.poLineArray;
    const vehicleRegForm2 = this.state.vehicleRegForm2;

    console.log("vehicleRegForm2", vehicleRegForm2)
    return (
      <>
        
        <STOVehicleRegistration
          showSubmitButton={false}
          vehicleRegForm={this.state.vehicleRegForm}
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


        <div className="card my-2 m-2">
          <div className="card-body">
            <FormWithConstraints>
               {/* onSubmit={this.onSubmit}> */}
            <div class="d-flex bd-highlight">
              <div class="p-2 flex-fill bd-highlight">
                <div className="row mt-1">

                <div className="col-sm-4 " >
                <input type="hidden" className="form-control" name="po[purchaseOrderNumber]" value={this.state.vehicleRegForm.poNo} />
                <input type="hidden" value={poDetails.purchaseOrderId} name="po[purchaseOrderId]" />
                <input type="hidden" value={poDetails.documentType} name="po[documentType]" />
                </div>
                <div className="col-sm-4 " >
                <input type="hidden" className="form-control"  name={"asnLineList[" + 0 + "][deliveryQuantity]"} value={this.state.vehicleRegForm.qty} />
                </div>
                {/* <div className="col-sm-4 " >
                    <input type="hidden" name={"asnLineList[poLine][code]"} value={this.state.vehicleRegForm.materialCode} />
                                                              
                                                            </div> */}
                                                            <div>
{/*                                                           
                                                         <input type="hidden" name={"asnLineList[advanceShipmentNoticeLineId]"} /> */}
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][balanceQuantity]"} value={poLineDetails.balanceQuantity} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][purchaseOrderLineId]"} value={poLineDetails.poLineId} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][lineItemNumber]"} value={poLineDetails.lineItemNumber} />
                                             
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][code]"} value={poLineDetails.materialCode} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][name]"} value={poLineDetails.material} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][uom]"} value={poLineDetails.uom} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][rate]"} value={getDecimalUpto(poLineDetails.poRate)} />
                                                         <input type="hidden" name={"asnLineList[" + 0 + "][poLine][plant]"} value={poLineDetails.plant} />
                                                        
                                                         </div>
                  <label className="col-sm-6">Vehicle Registration No </label>
                    <div className="col-sm-6">
                      <input
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
                    <label className="col-sm-6" >Licence No</label>
                    <div className="col-sm-6 " >
                      <input
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
                      <label className="col-sm-6" >Trip LSP</label>
                      <div className="col-sm-6" >
                        <input
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
                      <label className="col-sm-6" for="exampleInputEmail1">Driver Name
                      </label>
                      <div className="col-sm-6">
                        <input
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
                
                    <label className="col-sm-6" for="exampleInputEmail1">Expiry Date
                    </label>
                    <div className="col-sm-6">
                      <input
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
                   <label className="col-sm-6" for="exampleInputEmail1">Phone No
                    </label>
                      <div className="col-sm-6">
                        <input
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
                      <button type="button" class="btn btn-primary btn-sm " data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonType() }}>
                          Capture Driver Photo
                        </button>
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
                    <button type="button" class="btn btn-primary btn-sm " data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonTypeDocument() }}>
                    Document Capture
                    </button>
                    </div>
                    </div>

                </div>
            </div>

              {/* <div className="row-sm-12"></div> */}
             

              {/* <div className="row mt-1"> */}
                {/* <label className="col-sm-2" for="exampleInputEmail1">Driver Photo
                </label>
                <div className="col-sm-2" >
                  <button type="button" class="btn btn-primary btn-sm " data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonType() }}>
                    Capture
                  </button>
                </div> */}
                {/* <label className="col-sm-2" for="exampleInputEmail1">Document Photo
                </label> */}
                {/* <div className="col-sm-2 ">
                  <button type="button" class="btn btn-primary btn-sm " data-toggle="modal" data-target="#exampleModal" onClick={() => { this.handleButtonTypeDocument() }}>
                    Capture
                  </button>
                </div> */}  
                {/* <label className="col-sm-2" for="exampleInputEmail1"> Preview Driver Image
                <div className="col-6">
                
              </div>
                </label> */}
                {/* {vehicleRegForm2.driverPicString?
                <div className="col-sm-2 ">
                <img src={vehicleRegForm2.driverPicString} className="w-100 alkylLogo" alt="Alkyl" />
                </div>
                :""}   */}
              {/* </div>
              <div className="row mt-1">
              </div> */}
              {/* {vehicleRegForm2.docPicString?
              <div className="row mt-1">
                <label className="col-sm-2" for="exampleInputEmail1"> Preview Document Image
                </label>
                <div className="col-sm-2">
                <img src={vehicleRegForm2.docPicString} className="w-100 alkylLogo" alt="Alkyl" />
                </div>
              </div>
              :""} */}
              {vehicleRegForm2.status === "CR" ?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <button type="button" onClick={() => commonSubmitFormNoValidationWithData(this.state.vehicleRegForm2, this, "reportVehicle", "/rest/reportVehicle")} class="btn btn-primary">Submit</button>
                  
                </div>
                : null}
                 
              {vehicleRegForm2.status === "RP" ?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <button type="button" onClick={() => commonSubmitWithParam(
                    this.props,
                    "vehicleGateIN",
                    "/rest/vehicleGateIN",
                    vehicleRegForm2.vehicleRegistationId
                  )} class="btn btn-primary">Gate IN</button>
                </div>
                : null}
              {vehicleRegForm2.status === "VGI" ?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <button type="submit" onClick={this.handlegateoutandasn} class="btn btn-primary">Gate OUT</button>
                </div>
                : null}
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                 <a className={this.props.role!== "VENADM" ? "btn btn-primary mr-1" : "none"} href={window.location.href}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
              </div>
            </FormWithConstraints>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return state.reportVehicleSTOReducer;
};
export default connect(mapStateToProps, actionCreators)(ReportVechicalSTO);