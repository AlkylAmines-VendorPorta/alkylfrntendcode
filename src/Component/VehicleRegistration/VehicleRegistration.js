import React, { Component } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange,
  swalWithTextBoxMessage,
} from "../../Util/ActionUtil";
import { getReferenceListDataApi, submitToSAPURL, savetoServer } from "../../Util/APIUtils";
import * as actionCreators from "./Action/Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { FormWithConstraints } from 'react-form-with-constraints';
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { formatDateWithoutTime, formatDateWithoutTimeNewDate } from "../../Util/DateUtil";
import { vehicleGateIN } from "../ReportVehicle/Action";
import { API_BASE_URL } from "../../Constants";
import Swal from "sweetalert2";

class VehicleRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      disableGateEntryField: false,
      showButton: this.props.showSubmitButton,
      loadVehicleRegDropdownList: false,
      shipToPartyDropDownList: [],
      soldToPartyDropDownList: [],
      transporterDropDownList: [],
      internalUserList: [],
      plantList: [],
      vehicleTypeList: [],
      vehicleRegForm: {
        saleOrderNo: "",
        requiredOn: "",
        plant: "",
        materialCode: "",
        shipToParty: '',
        soldToParty: '',
        trasnporter: '',
        meCode: {
          userId: ""
        },
        qty: "",
        vehicleType: "",
        route: "",
        freightScope: "",
        destination: ""
      },
      po: {
        requestNo: "",
        custBlockStatus: "",
        plant: "",
        saleOrdNo: "",
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
        inco1: "",
        message: "",
        sucess: false,
        poAtt: {
          attachmentId: "",
          fileName: ""
        },
        requestedBy: {
          userId: "",
          name: "",
          empCode: ""
        },
        isServicePO: false,
        pstyp: ""
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

  handleChange = date => {
    this.setState({
      startDate: date,
    });
  };

  async componentDidMount() {
    this.setState({ loadVehicleRegDropdownList: true });
    commonSubmitWithParam(
      this.props,
      "populateVehicleRegDropDown",
      "/rest/getVehicleRegDropDown"
    );
  }

  changeLoaderState = (action) => {
    this.setState({ isLoading: action });
  }

  onComfirmationOfrequestgeneration(e) {
    if (this.state.vehicleRegForm.message == "GSTIN Not Active") {
      swalWithTextBoxMessage(e, this, "onGenerateRequest", "GSTIN is Not Active,Still Would You Like To Proceed for Request No");
    } else {
      commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")
    }
  }

  onGenerateRequest = (value) => {
    commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")
  }

  handleSearch = (i) => {
    this.setState({ isLoading: true });

    let saleOrdNo = "";
    if (this.state.po.soldToPartyName != "") {
      saleOrdNo = this.state.po.saleOrdNo
    } else {
      saleOrdNo = this.state.vehicleRegForm.saleOrderNo
    }
    let urls = `/rest/getSalesOrderDetails/${saleOrdNo}`

    savetoServer({ urls }).then((res) => {
      console.log("ressubmit to sap url", res);
      let resData = res;
      let dataa = res;
      let stp = this.state.soldToPartyDropDownList;
      let shiptp = this.state.shipToPartyDropDownList;
      let trans = this.state.transporterDropDownList;
      let meco = this.state.internalUserList;
      let vechType = this.state.vehicleTypeList;
      let stpObject = {}
      let checkSTP = stp.find(c => c.code == resData.soldToParty.code)
      stpObject = checkSTP ? checkSTP : {};
      stpObject = {
        ...stpObject,
        customerId: stpObject.value,
      }
      let shiptpObject = {}
      let checkSHIPOBJ = shiptp.find(c => c.code == resData.shipToParty.code)
      shiptpObject = checkSHIPOBJ ? checkSHIPOBJ : {}
      shiptpObject = {
        ...shiptpObject,
        customerId: shiptpObject.value,
      }
      let transObject = {}
      let checkTransOBJ = trans.find(c => c.code == resData.trasnporter.code)
      transObject = checkTransOBJ ? checkTransOBJ : {}
      transObject = {
        ...transObject,
        customerId: transObject.value,
      }

      let vechicalTypeObject = {}

      let checkvechicalTypeObject = vechType.find(c => c.value == resData.vehicleType)
      vechicalTypeObject = checkvechicalTypeObject ? checkvechicalTypeObject : {}
      vechicalTypeObject = vechicalTypeObject.value

      let meCodeObject = {}
      let checkmeCodeObject = meco.find(c => c.code === resData.meCode.userName)
      meCodeObject = checkmeCodeObject ? checkmeCodeObject : {}
      meCodeObject = {
        ...meCodeObject,
        userId: meCodeObject.value,
      }
      this.setState({
        vehicleRegForm: {
          ...dataa,
          meCode: meCodeObject,
        }
      })

      this.setState({ isLoading: false })
    }).catch((err) => {
      this.setState({ isLoading: false })
      console.log('err', err);
    });
  }

  UNSAFE_componentWillReceiveProps = async props => {
    this.changeLoaderState(false);
    console.log("unsafe props ", props);
    if (!isEmpty(props.vehicleRegDropDownList?.objectMap)) {
      let internalUserArray = [], vehicleTypeArray = [], transporterDropDownListArray = [], shipToPartyDropDownListArray = [], soldToPartyDropDownListArray = [], plantListArray = [];

      Object.keys(props.vehicleRegDropDownList.objectMap.plantList).map((key) => {
        plantListArray.push({ display: props.vehicleRegDropDownList.objectMap.plantList[key], value: key });
      });
      props.vehicleRegDropDownList.objectMap.internalUserList.map((item) => {
        internalUserArray.push({ display: item.name, value: item.userId, code: item.userName });
      });
      console.log("plantlisttt", plantListArray);
      this.setState({
        loadVehicleRegDropdownList: false,
        plantList: plantListArray,
        internalUserList: internalUserArray
      })
    }

    if (!isEmpty(props.vehicleRegForm)) {
      this.setState({ vehicleRegForm: props.vehicleRegForm })
    }

    if (!isEmpty(props.po)) {
      this.setState({
        po: props.po
      });
    }
    if (!isEmpty(props.vehicleRegSAPUpdate)) {
      this.setState({
        vehicleRegSAPUpdate: props.vehicleRegSAPUpdate,
      })
    }
  }

  render() {
    let vehicleRegForm = this.state.vehicleRegForm;
    let vehicleRegSAPUpdate = this.state.vehicleRegSAPUpdate;
    let disableGateField = this.state.disableGateEntryField;

    return (
      <>
        <UserDashboardHeader />
        <Loader isLoading={this.state.isLoading} />
        <div className="card" id="togglesidebar" style={{marginTop:"80px", marginLeft:"20px", marginRight:"20px" }}>
          <div class="card-body" style={{paddingLeft:"10px"}}>
            <FormWithConstraints>


              <div className="row-sm-12 p-2 d-flex justify-content-center">
                {vehicleRegForm.requestNo != undefined ?
                  <h2>Gate Entry Outward</h2>
                  :
                  <h2>Vehicle Booking Form</h2>
                }
              </div>

              {vehicleRegForm.requestNo != undefined ? <p></p>
                : vehicleRegForm.message &&
                <div className="row mt-1 p-2" >
                  {vehicleRegForm.message === "GSTIN Not Active" ?
                    <div className="row-sm-4 p-4"><h5 style={{ color: 'red' }}> <span className="redspan">*</span>{vehicleRegForm.message}</h5></div>
                    :
                    <div className="row-sm-4 p-4"><h5 style={{ color: 'green' }}> <span className="greenspan">*</span>{vehicleRegForm.message}</h5></div>}
                  <div className="row-sm-9 p-4"></div>
                </div>
              }

              {
                vehicleRegForm.requestNo != undefined ?
                  <>
                    <input
                      type="hidden"
                      disabled={isEmpty(vehicleRegForm.transportEmail)}
                      value={vehicleRegForm.transportEmail}
                    />
                    <input type="hidden"
                      disabled={isEmpty(vehicleRegForm.shipToEmail)}
                      name="advanceShipmentNoticeId"
                      value={vehicleRegForm.shipToEmail}
                    />
                    <input type="hidden"
                      disabled={isEmpty(vehicleRegForm.soldToEmail)}
                      name="advanceShipmentNoticeId"
                      value={vehicleRegForm.soldToEmail}
                    />
                  </>
                  : null
              }
              {this.state.po.soldToPartyName != "" ?
                <div className="row mt-1">
                    <label className="col-sm-2 mb-3" for="exampleInputEmail1">Sales Order
                    </label>
                  <div className={!vehicleRegForm.requestNo ? "col-sm-2 mb-3" : "col-sm-4 mb-3"}>
                    <TextField
                      fullWidth
                      value={this.state.po.saleOrdNo}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "po.saleOrdNo");
                      }}
                      //label="Sales Order"
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  {!vehicleRegForm.requestNo ?
                    <div class=" col-sm-2 mb-3">
                      <Button variant="contained" color="primary" id="search-button" type="button"
                        onClick={this.handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                    : null
                  }

                  {vehicleRegForm.requestNo ?
                    <>
                      <label className="col-sm-2 mb-3" for="exampleInputEmail1">Request No
                      </label>
                      <div className="col-sm-4 mb-3">
                        <TextField
                          fullWidth
                          value={vehicleRegForm.requestNo}
                          disabled={true}
                          variant="outlined"
                          size="small"
                        />
                      </div>
                    </>
                    : null}
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Sales Order
                  </label>
                  <div className={!vehicleRegForm.requestNo ? "col-sm-2 mb-3" : "col-sm-4 mb-3"}>
                    <TextField
                      fullWidth
                      value={vehicleRegForm.saleOrderNo}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.saleOrderNo");
                      }}
                      //label="Sales Order"
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  {!vehicleRegForm.requestNo ?
                    <div class=" col-sm-2 mb-3">
                      <Button variant="contained" color="primary"
                        onClick={this.handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                    : null
                  }

                  {vehicleRegForm.requestNo ?
                    <>
                      <label className="col-sm-2 mb-3" for="exampleInputEmail1">Request No
                      </label>
                      <div className="col-sm-4 mb-3">
                        <TextField
                          fullWidth
                          value={vehicleRegForm.requestNo}
                          disabled={true}
                          variant="outlined"
                          size="small"
                        />
                      </div>
                    </>
                    : null}
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ?
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3">Required On<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      type="date"
                      fullWidth
                      value={formatDateWithoutTimeNewDate(vehicleRegSAPUpdate.requiredOn)}
                      disabled={!isEmpty(vehicleRegSAPUpdate.requiredOn)}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "vehicleRegSAPUpdate.requiredOn"
                        );
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3">Plant<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3" >
                    <FormControl variant="outlined" fullWidth size="small">
                      <Select
                        value={vehicleRegSAPUpdate.plant}
                        disabled={!isEmpty(vehicleRegSAPUpdate.plant)}
                        onChange={(e) => commonHandleChange(e, this, "vehicleRegSAPUpdate.plant")}
                        label="Plant"
                      >
                        <MenuItem value="">Select</MenuItem>
                        {this.state.plantList.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3">Required On<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      type="date"
                      fullWidth
                      value={formatDateWithoutTimeNewDate(vehicleRegForm.requiredOn)}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "vehicleRegForm.requiredOn"
                        );
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3">Plant<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3" >
                    <FormControl variant="outlined" fullWidth size="small">
                      <Select
                        value={vehicleRegForm.plant}
                        disabled={!isEmpty(vehicleRegForm.requestNo)}
                        onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.plant")}
                        label="Plant"
                      >
                        <MenuItem value="">Select</MenuItem>
                        {this.state.plantList.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ?
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Sold to Party Code<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3 ">
                    <TextField
                      fullWidth
                      value={vehicleRegSAPUpdate.soldToParty}
                      disabled={!isEmpty(vehicleRegSAPUpdate.soldToParty)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.soldToParty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Ship to Party Code<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3 ">
                    <TextField
                      fullWidth
                      value={vehicleRegSAPUpdate.shipToParty}
                      disabled={!isEmpty(vehicleRegSAPUpdate.shipToParty)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.shipToParty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Sold to Party Code<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3 ">
                    <TextField
                      fullWidth
                      value={vehicleRegForm.soldToParty}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.soldToParty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Ship to Party Code<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3 ">
                    <TextField
                      fullWidth
                      value={vehicleRegForm.shipToParty}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.shipToParty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ? <div className="row mt-1">
                <label className="col-sm-2 mb-3" for="exampleInputEmail1">Destination<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 mb-3 ">
                  <TextField
                    fullWidth
                    value={vehicleRegSAPUpdate.destination}
                    disabled={!isEmpty(vehicleRegSAPUpdate.destination)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegSAPUpdate.destination");
                    }}
                    variant="outlined"
                    size="small"
                  />
                </div>
                <label className="col-sm-2 mb-3" for="exampleInputEmail1">Material Code
                </label>
                <div className="col-sm-4 mb-3">
                  <TextField
                    fullWidth
                    disabled={!isEmpty(vehicleRegSAPUpdate.materialCode)}
                    value={vehicleRegSAPUpdate.materialCode}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegSAPUpdate.materialCode");
                    }}
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Destination<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3 ">
                    <TextField
                      fullWidth
                      value={vehicleRegForm.destination}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.destination");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Material Code
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      value={vehicleRegForm.materialCode}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.materialCode");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ?
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Qty<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      disabled={!isEmpty(vehicleRegSAPUpdate.qty)}
                      value={vehicleRegSAPUpdate.qty}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.qty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <label className="col-sm-2 mb-3">Transporter<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3 " >
                    <TextField
                      fullWidth
                      value={vehicleRegSAPUpdate.trasnporter}
                      disabled={!isEmpty(vehicleRegSAPUpdate.trasnporter)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.trasnporter");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Qty<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      value={vehicleRegForm.qty}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.qty");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <label className="col-sm-2 mb-3">Transporter<span className="redspan">*</span></label>
                  <div className="col-sm-4 mb-3 " >
                    <TextField
                      fullWidth
                      value={vehicleRegForm.trasnporter}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.trasnporter");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ?
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3">Vechical Type<span className="redspan">*</span> </label>
                  <div className="col-sm-4 mb-3 " >
                    <TextField
                      fullWidth
                      disabled={!isEmpty(vehicleRegSAPUpdate.vehicleType)}
                      value={vehicleRegSAPUpdate.vehicleType}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.vehicleType");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Route
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      value={vehicleRegSAPUpdate.route}
                      disabled={!isEmpty(vehicleRegSAPUpdate.route)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegSAPUpdate.route");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3">Vechical Type<span className="redspan">*</span> </label>
                  <div className="col-sm-4 mb-3 " >
                    <TextField
                      fullWidth
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      value={vehicleRegForm.vehicleType}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.vehicleType");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Route
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      value={vehicleRegForm.route}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.route");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              }

              {this.state.vehicleRegForm.requestNo != null ?
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Freight Scope<span className="redspan">*</span>
                  </label>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={vehicleRegSAPUpdate.freightScope}
                      onChange={(e) => commonHandleChange(e, this, "vehicleRegSAPUpdate.freightScope")}
                    >
                      <FormControlLabel
                        value="AACL"
                        control={<Radio />}
                        label="AACL"
                        disabled={!isEmpty(vehicleRegSAPUpdate.freightScope)}
                      />
                      <FormControlLabel
                        value="Customer"
                        control={<Radio />}
                        label="Customer"
                        disabled={!isEmpty(vehicleRegSAPUpdate.freightScope)}
                      />
                    </RadioGroup>
                  </FormControl>
                </div> :
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Freight Scope<span className="redspan">*</span>
                  </label>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={vehicleRegForm.freightScope}
                      onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.freightScope")}
                    >
                      <FormControlLabel
                        value="AACL"
                        control={<Radio />}
                        label="AACL"
                        disabled={!isEmpty(vehicleRegForm.requestNo)}
                      />
                      <FormControlLabel
                        value="Customer"
                        control={<Radio />}
                        label="Customer"
                        disabled={!isEmpty(vehicleRegForm.requestNo)}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              }

              {vehicleRegForm.invoiceNo ? <>
                <div className="row mt-1">
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Invoice No.<span className="redspan">*</span>
                  </label>
                  <div className="col-sm-4 mb-3">
                    <a href={API_BASE_URL + "/rest/download/" + vehicleRegForm?.docPic?.attachmentId}>
                      {vehicleRegForm?.invoiceNo}
                    </a>
                  </div>
                  <label className="col-sm-2 mb-3" for="exampleInputEmail1">Invoice Date
                  </label>
                  <div className="col-sm-4 mb-3">
                    <TextField
                      fullWidth
                      value={vehicleRegForm.invoiceDate}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.invoiceDate");
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              </>
                : null
              }

              {(this.props.showSubmitButton) || this.props.vehicleRegForm == null || this.props.vehicleRegForm.success != false ?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => { this.onComfirmationOfrequestgeneration(e) }}
                  >
                    Submit
                  </Button>
                </div>
                : null}
              <div className="col-sm-12">
              </div>
            </FormWithConstraints>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state.vehicleRegistrationReducer;
};
export default connect(mapStateToProps, actionCreators)(VehicleRegistration);