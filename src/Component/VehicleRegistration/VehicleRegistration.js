import React, { Component } from "react";
import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange,swalWithTextBoxMessage
} from "../../Util/ActionUtil";
import {getReferenceListDataApi, submitToSAPURL,savetoServer} from "../../Util/APIUtils"
import * as actionCreators from "./Action/Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { FormWithConstraints } from 'react-form-with-constraints';
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import {formatDateWithoutTime,formatDateWithoutTimeNewDate} from "../../Util/DateUtil"
import { vehicleGateIN } from "../ReportVehicle/Action";
import {API_BASE_URL} from "../../Constants";
import Swal from "sweetalert2";

class VehicleRegistration extends Component {
  constructor(props) {
    super(props)
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
        // shipToParty: {
        //   customerId: ""
        // },
        // soldToParty: {
        //   customerId: ""
        // },
        // trasnporter: {
        //   customerId: ""
        // },
        meCode: {
          userId: ""
        },
        qty: "",
        vehicleType: "",
        route: "",
        freightScope: "",
        destination: ""
      },
      po:{   
             
        requestNo : "",
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
        pstyp:""
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
    
    if(this.state.vehicleRegForm.message=="GSTIN Not Active"){
     
      swalWithTextBoxMessage(e, this, "onGenerateRequest","GSTIN is Not Active,Still Would You Like To Proceed for Request No");
    }
    else{
      commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")
    }
   
 }

 onGenerateRequest = (value) => {

   commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")
  }

  handleSearch =(i)=>{
  // console.log("vehicleRegForm.saleOrderNo",this.state.vehicleRegForm.saleOrderNo);
  this.setState({ isLoading: true });
//    const dataa = {
//     saleOrderNo: "0110062052",
//     requiredOn: "2021-12-17",
//     plant: "1810",
//     destination: "VIZIANAGARAM",
//     materialCode: "000000000000400045-01-2119475467-26-0006 ",
//     qty: 10,
//     meCode: {
//       userName: ""
//     },
//     soldToParty: {
//       code: "0000012803-MYLAN LABORATORIES LTD."
//     },
//     shipToParty: {
//       code: "0000012803-MYLAN LABORATORIES LTD."
//     },
//     trasnporter: {
//       code: "0000070203-COLLECTION BY PARTY"
//     }
// }


  // submitToSAPURL(`zgate_web?saleOrderNo=${this.state.vehicleRegForm.saleOrderNo}`).then((res) => {

 //let urls = `/rest/getSalesOrderDetails/${this.state.vehicleRegForm.saleOrderNo}`
 let saleOrdNo="";
 if(this.state.po.soldToPartyName!=""){
   saleOrdNo=this.state.po.saleOrdNo
 }else{
   saleOrdNo=this.state.vehicleRegForm.saleOrderNo
 }
let urls = `/rest/getSalesOrderDetails/${saleOrdNo}`

// let urls = `/rest/getSalesOrderDetails/${this.state.po.saleOrdNo}`
  savetoServer({urls}).then((res) => { 
    console.log("ressubmit to sap url",res);
    let resData = res;
    let dataa = res;
    let stp = this.state.soldToPartyDropDownList;
    let shiptp = this.state.shipToPartyDropDownList;
    let trans = this.state.transporterDropDownList;
    let meco = this.state.internalUserList;
    let vechType = this.state.vehicleTypeList;
    let stpObject = {}
    let checkSTP = stp.find(c => c.code == resData.soldToParty.code)
    stpObject = checkSTP ? checkSTP :{};
    // console.log("stpobjectOOO",stpObject);
   stpObject = {
            ...stpObject,
            customerId:stpObject.value,  
        }
    let shiptpObject ={}
    let checkSHIPOBJ = shiptp.find(c => c.code == resData.shipToParty.code)    
    shiptpObject = checkSHIPOBJ ? checkSHIPOBJ:{}
    shiptpObject = {
      ...shiptpObject,
      customerId:shiptpObject.value,  
    
  }
    let transObject ={}
    console.log("tra")
    let checkTransOBJ = trans.find(c => c.code == resData.trasnporter.code)
    transObject = checkTransOBJ ? checkTransOBJ :{}
    transObject = {
      ...transObject,
      customerId:transObject.value,  
  }

  let vechicalTypeObject ={}

  // console.log("vehical typeobject",vechType.find(c => c.value == resData.vehicleType))
  // console.log("vechicle type ",vechType,resData.vechicalType);

  let checkvechicalTypeObject = vechType.find(c => c.value == resData.vehicleType)
  vechicalTypeObject = checkvechicalTypeObject ? checkvechicalTypeObject : {}
  vechicalTypeObject= vechicalTypeObject.value

  console.log("vehicle typ obj ---",vechicalTypeObject)

  let meCodeObject={}
  console.log("meco",meco)
  // console.log("MECOO",meco.find(c => c.userName === resData.meCode.userName))
  let checkmeCodeObject = meco.find(c => c.code === resData.meCode.userName)
  meCodeObject = checkmeCodeObject ? checkmeCodeObject :{}
  meCodeObject = {
    ...meCodeObject,
    userId:meCodeObject.value,
  }


    // this.setState({
    //   vehicleRegForm:{
    //       ...dataa,
    //       soldToParty:stpObject,
    //       shipToParty:shiptpObject,
    //       trasnporter:transObject,
    //       vehicleType:vechicalTypeObject,
    //       meCode:meCodeObject,

    //   }
    // })

    this.setState({
      vehicleRegForm:{
          ...dataa,
          // soldToParty:stpObject,
          // shipToParty:shiptpObject,
          // trasnporter:transObject,
          // vehicleType:vechicalTypeObject,
          meCode:meCodeObject,

      }
    })

      this.setState({isLoading:false})
  }).catch((err) => {
    this.setState({isLoading:false})
    console.log('err',err);
  });

  }




  UNSAFE_componentWillReceiveProps = async props => {
    this.changeLoaderState(false);
    console.log("unsafe props ",props);
    if (!isEmpty(props.vehicleRegDropDownList?.objectMap)) {
      // if (!isEmpty(props.vehicleRegDropDownList.objectMap.shipToParty) && this.state.loadVehicleRegDropdownList) {
        let internalUserArray = [], vehicleTypeArray = [], transporterDropDownListArray = [], shipToPartyDropDownListArray = [], soldToPartyDropDownListArray = [], plantListArray = [];
        // props.vehicleRegDropDownList.objectMap.shipToParty.map((item) => {
        //   shipToPartyDropDownListArray.push({ display: item.name, value: item.customerId,code:item.code });
        // });
        // props.vehicleRegDropDownList.objectMap.soldToParty.map((item) => {
        //   soldToPartyDropDownListArray.push({ display: item.name, value: item.customerId , code:item.code });
        // });
        // props.vehicleRegDropDownList.objectMap.transporter.map((item) => {
        //   transporterDropDownListArray.push({ display: item.name, value: item.customerId,code:item.code });
        // });
        Object.keys(props.vehicleRegDropDownList.objectMap.plantList).map((key) => {
          plantListArray.push({ display: props.vehicleRegDropDownList.objectMap.plantList[key], value: key });
        });
        // Object.keys(props.vehicleRegDropDownList.objectMap.vehicleType).map((key) => {
        //   vehicleTypeArray.push({ display: props.vehicleRegDropDownList.objectMap.vehicleType[key], value: key });
        // });
        props.vehicleRegDropDownList.objectMap.internalUserList.map((item) => {
          internalUserArray.push({ display: item.name, value: item.userId,code:item.userName });
        });
        console.log("plantlisttt",plantListArray);  
        this.setState({
          // shipToPartyDropDownList: shipToPartyDropDownListArray,
          // soldToPartyDropDownList: soldToPartyDropDownListArray,
          // transporterDropDownList: transporterDropDownListArray,
          loadVehicleRegDropdownList: false,
          plantList: plantListArray,
          // vehicleTypeList: vehicleTypeArray,
          internalUserList: internalUserArray
        })
      // }

    }

    if(!isEmpty(props.vehicleRegForm)){
      this.setState({vehicleRegForm:props.vehicleRegForm})
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
    let vehicleRegSAPUpdate=this.state.vehicleRegSAPUpdate;
    let disableGateField = this.state.disableGateEntryField;
    console.log(this.props);
    console.log("this.state.plantlist",this.state.plantList);
  
    console.log("vreg",vehicleRegForm )
    // console.log("stp",this.state.shipToPartyDropDownList);
    // console.log("vregf",vehicleRegForm.requestNo);
    // console.log("thisst",this.state.soldToPartyDropDownList)

    return (
      <>
      <UserDashboardHeader/>
        <Loader isLoading={this.state.isLoading} />
        <div className="card my-2 m-2"id="togglesidebar">
          <div class="card-body">
            <FormWithConstraints>

              <div className="row-sm-12 p-4"></div> 
            
             

              <div className="row-sm-12 p-2 d-flex justify-content-center">
              {vehicleRegForm.requestNo != undefined ?       
                <h2>Gate Entry Outward</h2>
                  :
                <h2>Vehicle Booking Form</h2>
                }
                </div>

                {vehicleRegForm.requestNo != undefined  ?<p></p>
                : vehicleRegForm.message &&
                <div className="row mt-1 p-2" >
                  {vehicleRegForm.message==="GSTIN Not Active"?
                  <div className="row-sm-4 p-4"><h5 style={{color:'red'}}> <span className="redspan">*</span>{vehicleRegForm.message}</h5></div>
                  :
                <div className="row-sm-4 p-4"><h5 style={{color:'green'}}> <span className="greenspan">*</span>{vehicleRegForm.message}</h5></div>}
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
                 :null
               }
               {this.state.po.soldToPartyName!=""?   
<div className="row mt-1">
              
              <label className="col-sm-2" for="exampleInputEmail1">Sales Order
              </label>
              <div className={ !vehicleRegForm.requestNo ? "col-sm-2" : "col-sm-4"}>
                <input
                  type="text"
                  className="form-control"
                //  value={vehicleRegForm.saleOrdNo}
                  value={this.state.po.saleOrdNo}
                  disabled={!isEmpty(vehicleRegForm.requestNo)}
                  onChange={(e) => {
                    commonHandleChange(e, this, "po.saleOrdNo");
                  }}
                />
                
              
              </div>
              {!vehicleRegForm.requestNo ?
              
              <div class=" col-sm-2">
              <button id="search-button" type="button" class="btn btn-primary  my-sm-0"
              onClick={this.handleSearch}
              >
               Search
              </button>
              </div>  
            :null  
            }

               {vehicleRegForm.requestNo?
                <>
                <label className="col-sm-2" for="exampleInputEmail1">Request No
                </label>
                <div className="col-sm-4">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.requestNo}
                    disabled={true}
                  />
                </div>
                </>
                :null}
            
            </div> : 
              <div className="row mt-1">

                <label className="col-sm-2" for="exampleInputEmail1">Sales Order
                </label>
                <div className={ !vehicleRegForm.requestNo ? "col-sm-2" : "col-sm-4"}>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.saleOrderNo}

                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.saleOrderNo");
                    }}
                  />
                  
                
                </div>
                {!vehicleRegForm.requestNo ?
                
                <div class=" col-sm-2">
                <button id="search-button" type="button" class="btn btn-primary  my-sm-0"
                onClick={this.handleSearch}
                >
                 Search
                </button>
                </div>  
              :null  
              } 

                {vehicleRegForm.requestNo?
                <>
                <label className="col-sm-2" for="exampleInputEmail1">Request No
                </label>
                <div className="col-sm-4">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.requestNo}
                    disabled={true}
                  />
                </div>
                </>
                :null}
              </div>
           }

{this.state.vehicleRegForm.requestNo!=null?    
            <div  className="row mt-1">
              <label className="col-sm-2">Required On<span className="redspan">*</span></label>
                  <div className="col-sm-4">
                    <input
                      type="date"
                      className={"form-control"}
                      value={formatDateWithoutTimeNewDate(vehicleRegSAPUpdate.requiredOn)}
                      disabled={!isEmpty(vehicleRegSAPUpdate.requiredOn)}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "vehicleRegSAPUpdate.requiredOn"
                        );
                      }}
                    />
                </div>
                <label className="col-sm-2">Plant<span className="redspan">*</span></label>
                <div className="col-sm-4" >
                  <select className="form-control"
                    value={vehicleRegSAPUpdate.plant}
                    disabled={!isEmpty(vehicleRegSAPUpdate.plant)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegSAPUpdate.plant")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.plantList).map(item =>
                        <option value={item.value}>{item.display}</option>
                    )}
                  </select>
                </div>
            </div>:
            <div  className="row mt-1">
              <label className="col-sm-2">Required On<span className="redspan">*</span></label>
                  <div className="col-sm-4">
                    <input
                      type="date"
                      className={"form-control"}
                      value={formatDateWithoutTimeNewDate(vehicleRegForm.requiredOn)}
                      disabled={!isEmpty(vehicleRegForm.requestNo)}
                      onChange={(e) => {
                        commonHandleChange(
                          e,
                          this,
                          "vehicleRegForm.requiredOn"
                        );
                      }}
                    />
                </div>
                <label className="col-sm-2">Plant<span className="redspan">*</span></label>
                <div className="col-sm-4" >
                  <select className="form-control"
                    value={vehicleRegForm.plant}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.plant")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.plantList).map(item =>
                        <option value={item.value}>{item.display}</option>
                    )}
                  </select>
                </div>
            </div>
  }
              {/* <div className="row mt-1">
               
                <label className="col-sm-2">ME Code<span className="redspan">*</span></label>
                <div className="col-sm-2">
                  <select className="form-control"
                    value={vehicleRegForm.meCode.userId}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.meCode.userId")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.internalUserList).map(item =>
                        <option value={item.value}>{item.display}</option>
                      )}
                  </select>
                </div>
              
              </div> */}
              {this.state.vehicleRegForm.requestNo!=null?   
<div className="row mt-1">
              <label className="col-sm-2" for="exampleInputEmail1">Sold to Party Code<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 ">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegSAPUpdate.soldToParty}
                    disabled={!isEmpty(vehicleRegSAPUpdate.soldToParty)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegSAPUpdate.soldToParty");
                    }}
                  />
                  {/* <select className="form-control"
                    value={vehicleRegForm.soldToParty.customerId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.soldToParty.customerId")}
                  >
                    <option value="">Select</option>
                    {(this.state.soldToPartyDropDownList).map(item =>
                      // console.log("item.dis",item.display)
                      <option value={item.value}>{item.code+"-"+item.display}</option>
                    )}
                  </select> */}
                </div>
                <label className="col-sm-2" for="exampleInputEmail1">Ship to Party Code<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 ">
                  {/* <select className="form-control"
                    value={vehicleRegForm.shipToParty.customerId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.shipToParty.customerId")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.shipToPartyDropDownList).map(item =>
                        <option value={item.value}>{item.code+"-"+item.display}</option>
                      )}
                  </select> */}
                   <input
                    type="text"
                    className="form-control"
                    value={vehicleRegSAPUpdate.shipToParty}
                    disabled={!isEmpty(vehicleRegSAPUpdate.shipToParty)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegSAPUpdate.shipToParty");
                    }}
                  />
                </div>

              
              </div>
:
              <div className="row mt-1">
              <label className="col-sm-2" for="exampleInputEmail1">Sold to Party Code<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 ">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.soldToParty}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.soldToParty");
                    }}
                  />
                  {/* <select className="form-control"
                    value={vehicleRegForm.soldToParty.customerId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.soldToParty.customerId")}
                  >
                    <option value="">Select</option>
                    {(this.state.soldToPartyDropDownList).map(item =>
                      // console.log("item.dis",item.display)
                      <option value={item.value}>{item.code+"-"+item.display}</option>
                    )}
                  </select> */}
                </div>
                <label className="col-sm-2" for="exampleInputEmail1">Ship to Party Code<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 ">
                  {/* <select className="form-control"
                    value={vehicleRegForm.shipToParty.customerId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.shipToParty.customerId")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.shipToPartyDropDownList).map(item =>
                        <option value={item.value}>{item.code+"-"+item.display}</option>
                      )}
                  </select> */}
                   <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.shipToParty}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.shipToParty");
                    }}
                  />
                </div>

              
              </div>
  }
  {this.state.vehicleRegForm.requestNo!=null? <div className="row mt-1">

<label className="col-sm-2" for="exampleInputEmail1">Destination<span className="redspan">*</span>
 </label>
 <div className="col-sm-4 ">
   <input
     type="text"
     className="form-control"
     value={vehicleRegSAPUpdate.destination}
     disabled={!isEmpty(vehicleRegSAPUpdate.destination)}

     onChange={(e) => {
       commonHandleChange(e, this, "vehicleRegSAPUpdate.destination");
     }}
   />
 </div>
 <label className="col-sm-2" for="exampleInputEmail1">Material Code
 </label>
 <div className="col-sm-4">
   <input
     type="text"
     disabled={!isEmpty(vehicleRegSAPUpdate.materialCode)}
     className="form-control"
     value={vehicleRegSAPUpdate.materialCode}
     onChange={(e) => {
       commonHandleChange(e, this, "vehicleRegSAPUpdate.materialCode");
     }}
   />
 </div>

</div>:
              <div className="row mt-1">

               <label className="col-sm-2" for="exampleInputEmail1">Destination<span className="redspan">*</span>
                </label>
                <div className="col-sm-4 ">
                  <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.destination}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}

                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.destination");
                    }}
                  />
                </div>
                <label className="col-sm-2" for="exampleInputEmail1">Material Code
                </label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    className="form-control"
                    value={vehicleRegForm.materialCode}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.materialCode");
                    }}
                  />
                </div>

              </div>
  }
  {this.state.vehicleRegForm.requestNo!=null?
  <div className="row mt-1">
  <label className="col-sm-2" for="exampleInputEmail1">Qty<span className="redspan">*</span>
  </label>
  <div className="col-sm-4">
    <input
      type="text"
      className="form-control"
      disabled={!isEmpty(vehicleRegSAPUpdate.qty)}
      value={vehicleRegSAPUpdate.qty}
      onChange={(e) => {
        commonHandleChange(e, this, "vehicleRegSAPUpdate.qty");
      }}
    />
  </div>

  <label className="col-sm-2">Transporter<span className="redspan">*</span></label>
  <div className="col-sm-4 " >
    {/* <select className="form-control"
      value={vehicleRegForm.trasnporter.customerId}
      disabled={!isEmpty(vehicleRegForm.requestNo)}
      onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.trasnporter.customerId")}
    >
      <option value="">Select</option>
      {(this.state.transporterDropDownList).map(item =>
        <option value={item.value}>{item.code+"-"+item.display}</option>
      )}
    </select> */}
     <input
      type="text"
      className="form-control"
      value={vehicleRegSAPUpdate.trasnporter}
      disabled={!isEmpty(vehicleRegSAPUpdate.trasnporter)}
      onChange={(e) => {
        commonHandleChange(e, this, "vehicleRegSAPUpdate.trasnporter");
      }}
     />
  </div>

</div>:
              <div className="row mt-1">
                <label className="col-sm-2" for="exampleInputEmail1">Qty<span className="redspan">*</span>
                </label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    value={vehicleRegForm.qty}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.qty");
                    }}
                  />
                </div>

                <label className="col-sm-2">Transporter<span className="redspan">*</span></label>
                <div className="col-sm-4 " >
                  {/* <select className="form-control"
                    value={vehicleRegForm.trasnporter.customerId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.trasnporter.customerId")}
                  >
                    <option value="">Select</option>
                    {(this.state.transporterDropDownList).map(item =>
                      <option value={item.value}>{item.code+"-"+item.display}</option>
                    )}
                  </select> */}
                   <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.trasnporter}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.trasnporter");
                    }}
                   />
                </div>
              
              </div>
  }
  {this.state.vehicleRegForm.requestNo!=null?
  <div className="row mt-1">
  <label className="col-sm-2">Vechical Type<span className="redspan">*</span> </label>
    <div className="col-sm-4 " >
      {/* <select className="form-control"
        value={vehicleRegForm.vehicleType}
        disabled={!isEmpty(vehicleRegForm.requestNo)}
        onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.vehicleType")}
      >
        <option value="">Select</option>
        {
          (this.state.vehicleTypeList).map(item =>
            <option value={item.value}>{item.display}</option>
          )}
      </select> */}
         <input
        type="text"
        className="form-control"
        disabled={!isEmpty(vehicleRegSAPUpdate.vehicleType)}
        value={vehicleRegSAPUpdate.vehicleType}
        onChange={(e) => {
          commonHandleChange(e, this, "vehicleRegSAPUpdate.vehicleType");
        }}
      
      />
    </div>
    <label className="col-sm-2" for="exampleInputEmail1">Route
    </label>
    <div className="col-sm-4">
      <input
        type="text"
        className="form-control"
        value={vehicleRegSAPUpdate.route}
        disabled={!isEmpty(vehicleRegSAPUpdate.route)}
        onChange={(e) => {
          commonHandleChange(e, this, "vehicleRegSAPUpdate.route");
        }}
      />
    </div>

  
  </div>:
              <div className="row mt-1">
              <label className="col-sm-2">Vechical Type<span className="redspan">*</span> </label>
                <div className="col-sm-4 " >
                  {/* <select className="form-control"
                    value={vehicleRegForm.vehicleType}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.vehicleType")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.vehicleTypeList).map(item =>
                        <option value={item.value}>{item.display}</option>
                      )}
                  </select> */}
                     <input
                    type="text"
                    className="form-control"
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    value={vehicleRegForm.vehicleType}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.vehicleType");
                    }}

                  />
                </div>
                <label className="col-sm-2" for="exampleInputEmail1">Route
                </label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.route}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.route");
                    }}
                  />
                </div>

              
              </div>

  }
  {this.state.vehicleRegForm.requestNo!=null?
                  <div className="row mt-1">
                 
                  <label className="col-sm-2" for="exampleInputEmail1">Freight Scope<span className="redspan">*</span>
                    </label>
    
                    <div class="col-sm-1 form-check">
                      <input class="form-check-input" type="radio"
                        disabled={!isEmpty(vehicleRegSAPUpdate.freightScope)}
                        onChange={(e) => {
                          commonHandleChange(e, this, "vehicleRegSAPUpdate.freightScope");
                        }}
                        checked={vehicleRegSAPUpdate.freightScope==="AACL"}
    
                        value={"AACL"} id="flexRadioDefault1" />
                      <label class="form-check-label" for="flexRadioDefault1">
                        AACL
                      </label>
                    </div>
                    <div className="col-sm-1">
                      <input class="form-check-input" type="radio"
                        disabled={!isEmpty(vehicleRegSAPUpdate.requestNo)}
    
                        onChange={(e) => {
                          commonHandleChange(e, this, "vehicleRegSAPUpdate.freightScope");
                        }}
                        value={"Customer"}
                        checked={vehicleRegSAPUpdate.freightScope==="Customer"}
                        name="flexRadioDefault" id="flexRadioDefault1" />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Customer
                      </label>
                    </div>
        
                    <div className="col-sm-2 " >
                    </div>
                  </div>:
              <div className="row mt-1">
              {/* <label className="col-sm-2">ME Code
              {/* <span className="redspan">*</span> 
              </label>
                <div className="col-sm-4">
                  <select className="form-control"
                    value={vehicleRegForm.meCode.userId}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.meCode.userId")}
                  >
                    <option value="">Select</option>
                    {
                      (this.state.internalUserList).map(item =>
                        <option value={item.value}>{item.code+"-"+item.display}</option>
                      )}
                  </select>
                </div> */}

              <label className="col-sm-2" for="exampleInputEmail1">Freight Scope<span className="redspan">*</span>
                </label>

                <div class="col-sm-1 form-check">
                  <input class="form-check-input" type="radio"
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.freightScope");
                    }}
                    checked={vehicleRegForm.freightScope==="AACL"}

                    value={"AACL"} id="flexRadioDefault1" />
                  <label class="form-check-label" for="flexRadioDefault1">
                    AACL
                  </label>
                </div>
                <div className="col-sm-1">
                  <input class="form-check-input" type="radio"
                    disabled={!isEmpty(vehicleRegForm.requestNo)}

                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.freightScope");
                    }}
                    value={"Customer"}
                    checked={vehicleRegForm.freightScope==="Customer"}
                    name="flexRadioDefault" id="flexRadioDefault1" />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Customer
                  </label>
                </div>
              
                <div className="col-sm-2 " >
                </div>
              </div>
  }

            { vehicleRegForm.invoiceNo ? <>

              <div className="row mt-1">

                  <label className="col-sm-2" for="exampleInputEmail1">Invoice No.<span className="redspan">*</span>
                  </label>
              <div className="col-sm-4">
              <a href={API_BASE_URL+"/rest/download/"+vehicleRegForm.docPic.attachmentId}>
                {vehicleRegForm.invoiceNo}
                </a>
              </div> 

                  {/* <div className="col-sm-4 ">
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleRegForm.invoiceNo}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.invoiceNo");
                      }}
                    />
                  </div> */}
                  <label className="col-sm-2" for="exampleInputEmail1">Invoice Date
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleRegForm.invoiceDate}
                      onChange={(e) => {
                        commonHandleChange(e, this, "vehicleRegForm.invoiceDate");
                      }}
                    />
                  </div>

              </div>


            </>
                   :null

            }
              {(this.props.showSubmitButton) || this.props.vehicleRegForm==null || this.props.vehicleRegForm.success != false?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                 {/* <button type="button" onClick={() => commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")} class="btn btn-primary">Submit</button> */}
                 <button type="button" onClick={(e) => {this.onComfirmationOfrequestgeneration(e)}} class="btn btn-primary">Submit</button>
                </div>
                :null}
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