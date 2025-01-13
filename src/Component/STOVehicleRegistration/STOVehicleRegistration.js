import React, { Component } from "react";
import {
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  commonHandleChange,
} from "../../Util/ActionUtil";
import {getReferenceListDataApi, submitToSAPURL,savetoServer} from "../../Util/APIUtils"
import * as actionCreators from "./Action";
import { connect } from 'react-redux';
import { isEmpty } from "../../Util/validationUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { FormWithConstraints } from 'react-form-with-constraints';
import UserDashboardHeader from "../Header/UserDashboardHeader";
import {formatDateWithoutTime,formatDateWithoutTimeNewDate} from "../../Util/DateUtil"
import { vehicleGateIN } from "../ReportVehicle/Action";
import {API_BASE_URL} from "../../Constants";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
class STOVehicleRegistration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      plantList: [],
      vehicleRegForm: {
       // saleOrderNo: "",
       //saleOrdNo:"",
      
       poNo:"",
       poDate:"",
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
     po:{   
             
      requestNo : "",
      custBlockStatus: "",
      plant: "",
      // saleOrdNo: "",
      poNo:"",
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
    }
      
}

  }

  async componentDidMount() {

    this.setState({ loadVehicleRegDropdownList: true });
    commonSubmitWithParam(
      this.props,
      "populateVehicleRegDropDown",
      "/rest/getVehicleRegDropDown"
    );
   
  }


  handleSaveClick = async (index) => {
    //this.searchPOData();

    this.saveVehicleDetails();
    // await delay(1000)
    // this.savePOData();
   
  
   
   }


   savePOData(){
    let po=this.state.vehicleRegForm.poNo;
     
      commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforGateEntry',po)
 
   }

   saveVehicleDetails(){

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
       let poNo="";
      // if(this.state.po.soldToPartyName!=""){
        poNo=this.state.vehicleRegForm.poNo
      // }else{
      //   saleOrdNo=this.state.vehicleRegForm.saleOrderNo
      // }
    // let urls = `/rest/getSalesOrderDetails/${saleOrdNo}`
    //  let urls = `/rest/getPOforUser/${poNo}`
    let urls = `/rest/getSTOVehicleSAP/${poNo}`
    
  
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
    //   let checkSTP = stp.find(c => c.code == resData.soldToParty.code)
    //   stpObject = checkSTP ? checkSTP :{};
    //   // console.log("stpobjectOOO",stpObject);
    //  stpObject = {
    //           ...stpObject,
    //           customerId:stpObject.value,  
    //       }
    //   let shiptpObject ={}
    //   let checkSHIPOBJ = shiptp.find(c => c.code == resData.shipToParty.code)    
    //   shiptpObject = checkSHIPOBJ ? checkSHIPOBJ:{}
    //   shiptpObject = {
    //     ...shiptpObject,
    //     customerId:shiptpObject.value,  
      
    // }
    //   let transObject ={}
    //   console.log("tra")
    //   let checkTransOBJ = trans.find(c => c.code == resData.trasnporter.code)
    //   transObject = checkTransOBJ ? checkTransOBJ :{}
    //   transObject = {
    //     ...transObject,
    //     customerId:transObject.value,  
    // }
  
    // let vechicalTypeObject ={}
  
    // console.log("vehical typeobject",vechType.find(c => c.value == resData.vehicleType))
    // console.log("vechicle type ",vechType,resData.vechicalType);
  
    // let checkvechicalTypeObject = vechType.find(c => c.value == resData.vehicleType)
    // vechicalTypeObject = checkvechicalTypeObject ? checkvechicalTypeObject : {}
    // vechicalTypeObject= vechicalTypeObject.value
  
    // console.log("vehicle typ obj ---",vechicalTypeObject)
  
   
   
  
  
  
  
      this.setState({
        vehicleRegForm:{
            ...dataa,
            // soldToParty:stpObject,
            // shipToParty:shiptpObject,
            // trasnporter:transObject,
            // vehicleType:vechicalTypeObject,
           // meCode:meCodeObject,
  
        }
      })
  
        this.setState({isLoading:false})
    }).catch((err) => {
      this.setState({isLoading:false})
      console.log('err',err);
    });
  
    }
  

  UNSAFE_componentWillReceiveProps = async props => {

    if (!isEmpty(props.vehicleRegDropDownList?.objectMap)) {
      // if (!isEmpty(props.vehicleRegDropDownList.objectMap.shipToParty) && this.state.loadVehicleRegDropdownList) {
        let internalUserArray = [], vehicleTypeArray = [], transporterDropDownListArray = [], shipToPartyDropDownListArray = [], soldToPartyDropDownListArray = [], plantListArray = [];
      
        Object.keys(props.vehicleRegDropDownList.objectMap.plantList).map((key) => {
          plantListArray.push({ display: props.vehicleRegDropDownList.objectMap.plantList[key], value: key });
        });
    
        console.log("plantlisttt",plantListArray);  
        this.setState({
    
          loadVehicleRegDropdownList: false,
          plantList: plantListArray,
        
        })
     

    }

    if(!isEmpty(props.vehicleRegForm)){
      this.setState({vehicleRegForm:props.vehicleRegForm})
    }


  }


  render() {

    let vehicleRegForm = this.state.vehicleRegForm;


    return (
      <>
      <UserDashboardHeader/>
       
        <div className="card my-2 m-2" id="togglesidebar">
          <div class="card-body">
            <FormWithConstraints>
            <div className="row-sm-12 p-4"></div> 
            <div className="row-sm-12 p-2 d-flex justify-content-center">
              {vehicleRegForm.requestNo != undefined ?       
                <h2>STO Gate Entry Outward</h2>
                  :
                <h2>STO Vehicle Booking Form</h2>
                }
                </div>

                {vehicleRegForm.requestNo != undefined  ?<p></p>
                : vehicleRegForm.message &&
                <div className="row mt-1 p-2" >
                <div className="row-sm-4 p-4"><h5 style={{color:'green'}}> <span className="greenspan">*</span>{vehicleRegForm.message}</h5></div>
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

       


            <div className="row mt-1">
              
              <label className="col-sm-2" for="exampleInputEmail1">PO Number
              </label>
              <div className={ !vehicleRegForm.requestNo ? "col-sm-2" : "col-sm-3"}>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleRegForm.poNo}
                //  value={this.state.po.saleOrdNo}
                  disabled={!isEmpty(vehicleRegForm.requestNo)}
                  onChange={(e) => {
                    commonHandleChange(e, this, "vehicleRegForm.poNo");
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
            
{/*               
              <label className="col-sm-2">PO Number
              </label>
              <div>
                <input
                  type="text"
                  className="form-control" name="poNo"
                  value={vehicleRegForm.poNo}
                  disabled={!isEmpty(vehicleRegForm.requestNo)}
                  onChange={(event) => {
                    if (event.target.value.length < 60) {
                      commonHandleChange(event, this, "vehicleRegForm.poNo", "")
                    }
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
              :null} */}
</div>
               <div  className="row mt-1">
               <label className="col-sm-2">Required On<span className="redspan">*</span></label>
                  <div className="col-sm-3">
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
                <label className="col-sm-2" for="exampleInputEmail1">Material Code
                </label>
                <div className="col-sm-3">
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

            <div className="row mt-1">


            <label className="col-sm-2">From Plant<span className="redspan">*</span></label>
                <div className="col-sm-3" >
                  <select className="form-control"
                    value={vehicleRegForm.fromPlant}
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
              {/* <label className="col-sm-2" for="exampleInputEmail1">From Plant<span className="redspan">*</span>
                </label>
                <div className="col-sm-3 ">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.fromPlant}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.fromPlant");
                    }}
                  />
                  
                  
                  </div> */}

                   <label className="col-sm-2">To Plant<span className="redspan">*</span></label>
                <div className="col-sm-3" >
                  <select className="form-control"
                    value={vehicleRegForm.toPlant}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => commonHandleChange(e, this, "vehicleRegForm.toPlant")}
                    >
                    <option value="">Select</option>
                    {
                      (this.state.plantList).map(item =>
                        <option value={item.value}>{item.display}</option>
                    )}
                  </select>
                </div>

                  {/* <label className="col-sm-2" for="exampleInputEmail1">To Plant<span className="redspan">*</span>
                </label>
                <div className="col-sm-3 ">
                <input
                    type="text"
                    className="form-control"
                    value={vehicleRegForm.toPlant}
                    disabled={!isEmpty(vehicleRegForm.requestNo)}
                    onChange={(e) => {
                      commonHandleChange(e, this, "vehicleRegForm.toPlant");
                    }}
                  />
                  
                  
                  </div> */}
           </div>
           <div className="row mt-1">

               <label className="col-sm-2" for="exampleInputEmail1">Destination
               {/* <span className="redspan">*</span> */}
                </label>
                <div className="col-sm-3 ">
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

                <label className="col-sm-2" for="exampleInputEmail1">Qty
                {/* <span className="redspan">*</span> */}
                </label>
                <div className="col-sm-3">
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
                
                </div>

                <div className="row mt-1">
              <label className="col-sm-2">Vechical Type
              {/* <span className="redspan">*</span>  */}
              </label>
                <div className="col-sm-3 " >
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
                <div className="col-sm-3">
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


              <div className="row mt-1">

              <label className="col-sm-2">Transporter
              {/* <span className="redspan">*</span> */}
              </label>
                <div className="col-sm-3 " >
                 
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

              {(this.props.showSubmitButton) || this.props.vehicleRegForm==null || this.props.vehicleRegForm.success != false?
                <div className="col-sm-12 m-2  d-flex justify-content-center">
                  {/* <button type="button" onClick={() => commonSubmitFormNoValidationWithData(this.state.vehicleRegForm, this, "saveVehicleRegistration", "/rest/saveVehicleRegistration")} class="btn btn-primary">Submit</button> */}
                  <button type="button" onClick={this.handleSaveClick} class="btn btn-primary">Submit</button>
                 
                </div>
   
                :null}
          

            </FormWithConstraints>
</div>
</div>
</>
    )
  }



}


const mapStateToProps = (state) => {
  return state.STOVehicleRegistration;
};
export default connect(mapStateToProps, actionCreators)(STOVehicleRegistration);