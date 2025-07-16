import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import alkylLogo from "../../../img/help.png"
import serialize from "form-serialize";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import {commonSubmitWithParam, commonSubmitForm,commonHandleChange} from "../../../Util/ActionUtil";
import { searchTableData, searchTableDataTwo} from "../../../Util/DataTable";
import * as actionCreators from "./Action";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import StickyHeader from "react-sticky-table-thead";
import {formatDateWithoutTime, formatDateWithoutTimeNewDate2} from "../../../Util/DateUtil";
import { removeLeedingZeros,getCommaSeperatedValue, getDecimalUpto,addZeroes,textRestrict } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import { isServicePO } from "../../../Util/AlkylUtil";
import AdvanceShipmentNotice from "../../AdvanceShipmentNotice/AdvanceShipmentNotice/AdvanceShipmentNotice";
import {saveQuotation,downloadexcelApi,request,uploadFile,savetoServer} from "../../../Util/APIUtils";

import FormNo from "../../FormNo/FormNo/FormNo";
import ASNWithoutPO from "../../ASNWithoutPO/ASNWithoutPO";
import GateEntryforCommercial from "../../GateEntryforCommercial/GateEntryforCommercial/GateEntryforCommercial";
import STOASN from "../../STOASN/STOASN";
import { filter } from "lodash-es";

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

class PRCreationCont extends Component {
  constructor(props) {
    super(props)
    this.state = {
    
      prList:[],
      loadPRDetails:false
          //nikhil code 25-07-2022
    }
}

async componentWillReceiveProps(props){
   if(!isEmpty(props.role)){
     this.props.changeLoaderState(false);
    this.setState({

      vendorNameShown:props.role==="VENADM"?"none":"",
      vendorCodeShown:props.role==="VENADM"?"none":"",
    })
   }

  //  if(!isEmpty(props.prList)){
  //   this.props.changeLoaderState(false);
  //   this.setState({
  //     prList: props.prList
  
  //   });
  // }else{
  //   this.props.changeLoaderState(false);
  // }
}



searchPRData(){
 // let po=this.state.po.purchaseOrderNumber;
  // commonSubmitWithParam(this.props,"getPurchaseOrderforgateentry",'/rest/getPOforUser',po)
 // this.props.changeLoaderState(false);
  if(document.getElementById('PrSearch').value==""){
    return false;
  }else{
   
      this.props.changeLoaderState(true);
      let prNo=this.props.filter.prNoFrom;
      commonSubmitWithParam(this.props,"getPrList",'/rest/savePRfromWebservice',prNo)     
      //commonSubmitWithParam(this.props,"getPrList",'/rest/fetchPRfromWebservicetodisplay/',prNo)
  }
 }

 savePrData(){
  this.props.changeLoaderState(true);

    if(document.getElementById('PrSearch').value==""){
    return false;
  }else{
    
      let prNo=this.props.filter.prNoFrom;
      commonSubmitWithParam(this.props,"getPrList",'/rest/fetchPRfromWebservicetodisplay/',prNo)
      
    }
 }



handleFilterChange = (key,event) => {
  this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);

}

handleSavePr = () => {
  this.searchPRData();
}




handleFilterClick = async (index) => {
  //this.searchPOData();
let urls="";
if(document.getElementById('PrSearch').value==""){
  return false;
}else{

  let prNo=this.props.filter.prNoFrom;
  //commonSubmitWithParam(this.props,"getPrList",'/rest/savePRfromWebservice/',prNo)
  urls = `/rest/savePRfromWebservice/${prNo}`

   

 this.props.changeLoaderState(true);
savetoServer({urls}).then(async () => {

this.props.onFilter &&  this.props.onFilter();
// this.setState({formDisplay: !this.state.formDisplay});
// this.setState({searchDisplay: !this.state.searchDisplay});
await delay(1000);
//this.loadPRDetails()
this.props.loadPRDetails(index);
})
}}


render() {
  const {filter} = this.props;
  const attachmentId=this.state.attachmentId;
  const ExcelFileName=this.state.fileName;
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
    return (
      <React.Fragment>
        <div style={ hidden} >
        <div className="wizard-v1-content" style={{marginTop:"80px", marginBottom:"20px"}}>
      
      <FormWithConstraints>

      <div className="row">
        <div className="col-sm-12">
                    
        <div className="row mt-2">
                      <label className="col-sm-2 mt-4">PR No</label>
                      <div className="col-sm-2">
                        
                        <input type="text"  id="PrSearch"  className="form-control"  value={filter.prNoFrom} onInput={ (e) => {commonHandleChange(e,this,"po.purchaseOrderNumber");}} onChange={this.handleFilterChange.bind(this,'prNoFrom') }/>
                      </div>

                      <div className="col-sm-3">
                          <button type="button" className={"btn btn-primary"} onClick={this.handleSavePr.bind(this)}> Fetch PR </button>
                      </div>

            </div>
          
            </div>

     
      </div>

    
        <div className="row">

        <div className="col-sm-6">

        </div>

        {/* <div className="col-sm-6">

        <div className="row mt-2">
        <div className="col-sm-4"></div>
           <div className="col-sm-8">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
</div>
    </div>
        </div> */}

        </div>

      <div>
           {/* <div style={ searchHidden} className="col-sm-3">
            <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." />
            </div>*/}
               {/* <div className="col-sm-12 mt-2">
               <div className="col-sm-12 text-center mt-2 ">
                                    <label style={{fontSize:"20px"}}>PR LIST</label>
                                 </div>
                <div class="table-proposed">
                <StickyHeader height={160} className="table-responsive width-adjustment">
                <table className="my-table">
                <thead>
                  <tr>
                    <th>PR No</th>
                    <th>PR Type</th>
                    <th>PR Date</th> */}
                    {/* <th>Emp. Code</th>
                    <th>Emp. Name</th>
                    <th>Approver</th>
                    <th>Tech Approver</th> */}
                    {/* <th>Status</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>{
                    return (
                      <tr onClick={() => 
                        this.handleFilterClick(i)
                      }>
                      <td>{pr.prNumber}</td>
                      <td>{pr.docType}</td>
                      <td>{formatDateWithoutTimeNewDate2(pr.date)}</td> */}
                      {/* <td>{pr.requestedBy.empCode}</td>
                      <td>{pr.requestedBy.name}</td> */}
                      {/* <td></td> */}
                      {/* <td>{pr.approver.name}</td>
                      <td>{pr.tcApprover.name}</td> */}
                      {/* <td></td>
                      <td>{pr.status}</td> */}

                  
                      {/* <td></td>
                      <td>{formatDateWithoutTimeNewDate2(pr.date)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{pr.status}</td> */}
                    {/* </tr>
                    )  
                  })}
                </tbody>
              </table>
                     </StickyHeader>
                  </div>
                    </div>
                    */}
                 
                 </div>




      </FormWithConstraints>   
      </div> 
               
                 
      </div>
      
       </React.Fragment>
    );
  }
}

PRCreationCont.defaultProps = {
  loadPRDetails: () => null
}

const mapStateToProps = (state) => {
  // console.log('state.ssoReducer',state.ssoReducer);
   return state.PRCreationCont;
};

export default connect(mapStateToProps,actionCreators)(PRCreationCont);