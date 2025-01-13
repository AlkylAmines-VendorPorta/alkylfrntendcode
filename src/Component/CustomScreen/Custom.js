import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from "react-redux";
import * as actionCreators from './Action/index';
import {
commonHandleFileUpload,
  commonHandleChange,
  commonSubmitForm,
  commonSubmitFormNoValidationWithData,
  commonSubmitWithParam,
  resetForm,
  showAlert,


} from "../../Util/ActionUtil";
import { API_BASE_URL } from "../../Constants";
import { formatDateWithoutTime } from "../../Util/DateUtil";
import Loader from "../FormElement/Loader/LoaderWithProps";
import { submitForm, submitToURL,submitWithTwoParam } from "../../Util/APIUtils";
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import { isEmpty } from "lodash-es";
import StickyHeader from "react-sticky-table-thead";
import { searchTableData, searchTableDataTwo} from "../../Util/DataTable";

class AsnComponent extends React.Component{
  constructor(){
    super();
    this.state = {
      form:{},
      statusList:[],
      detail:{},
      enqNo:""
    }
  }

  onReset = () => {
    this.setState({form:{}})
  }

  onSave = () => {
    const {form,detail} = this.state;
    
    const {type} = this.props;
    console.log("onSave type",type)
    if(isEmpty(detail) || isEmpty(form)) return alert('Fill all detail');
    let url = '';
    if(['asn','ssn'].includes(type)) url = `/rest/updateASNStatus/${detail.advanceShipmentNoticeId}/${form.status}`;
    else if(type == 'po') url = `/rest/updatePODetails`;
    else if(type == 'vendor') url = `/rest/updateVendorStatus`;
    else if(type == 'pr') url = `/rest/updatePRStatus`;

    if(['po','vendor'].includes(type)){
      let data = {};
      if(type == 'po') data = {purchaseOrderId: detail.purchaseOrderId,status:form.status,vendorCode:form.vendorCode};
      else data = {bPartnerId:!isEmpty(detail.partner) ? detail.partner.bPartnerId:null,status: form.status};
      
      submitForm(data,url).then(res => { 
        if(res.success || !isEmpty(res.objectMap)){
          showAlert(false,res.message)
          this.setState({statusList:[],detail:{},form:{}})
        }else{
          this.setState({detail:{},statusList:[]});
          showAlert(true,'Something went wrong, try again.')
        }
      });
    }else if (['pr'].includes(type)) {
      console.log("form",form);
      console.log("Destial",detail.prId);

      let paramField1 =  detail.prId
      let paramField2 = form.status
      submitWithTwoParam(url,paramField1,paramField2).then(res=>{
       if(res.success || !isEmpty(res.objectMap)){
         showAlert(false,res.message)
         this.setState({statusList:[],detail:{},form:{}})
        }else{
          this.setState({detail:{},statusList:[]});
          showAlert(true,'Something went wrong, try again.')
        }
       
      })
    }
    else{
      submitToURL(url).then(res => { 
        if(res.success || !isEmpty(res.objectMap)){
          showAlert(false,res.message)
          this.setState({statusList:[],detail:{},form:{}})
        }else{
          this.setState({detail:{},statusList:[]});
          showAlert(true,'Something went wrong, try again.')
        }
      });
    }
  }

  onSearch = () => {
    const {type} = this.props;
    const {form} = this.state;
    // console.log("props on search",this.props)
    if(!form.asnno) return alert('Please enter asn no')
    let url = '/rest/getASNStatus';
    if(type == 'ssn') url = '/rest/getSSNStatus';
    else if (type == 'po') url = '/rest/getPODetails';
    else if(type == 'vendor') url = '/rest/getVendorDetails';
    else if (type == 'pr') url = '/rest/getPRbyPrId';
    url = `${url}/${this.state.form.asnno}`
    console.log("type0",type);
    submitToURL(url).then(res => { 
      if(!isEmpty(res.objectMap)){
        // console.log("objMAP",res)
        let list = Object.keys(res.objectMap.status ?res.objectMap.status : res.objectMap.prStatus).map((key) => {
          return {
            title: res.objectMap.status ?  res.objectMap.status[key] : res.objectMap.prStatus[key],
            value: key
           }
        });
        console.log("list",list)
        console.log("type--",type);
        let responseKey = 'asn';
        if(type == 'po') responseKey = 'po';
        else if(type == 'vendor') responseKey = 'partner';
        else if(type == 'pr') responseKey = 'pr';
        let detail = res.objectMap[responseKey];
        console.log("detail",detail)
        let newForm = {...form,status: detail.status}
        if(type == 'po'){
          newForm = {...newForm,vendorCode: !isEmpty(detail.reqby) ? detail.reqby.userName:null}
        }
          if(type == 'vendor'){
            newForm = {...newForm,status: !isEmpty(detail.partner) ? detail.partner.status:null}
          }
          if(type == 'prno'){
            console.log("type",type)
            newForm = {...newForm,status: !isEmpty(res.prStatus) ? res.prStatus:null,pr: !isEmpty(res.pr) ? res.pr:null}
          }
        this.setState({statusList:list,detail,form:newForm})  
      }else{
        this.setState({detail:{},statusList:[]});
        showAlert(true,'Data not found')
      }
    });
  }

  onChange = (key,{target}) => {
    this.setState(prevState => ({
      form:{...prevState.form,[key]:target.value}
    }))
  }

  UNSAFE_componentWillReceiveProps=props=>{
    
    if(props.enqDetails && props.enqDetails.objectMap){
      
      this.setState({enqDate:formatDateWithoutTime(props.enqDetails.objectMap.enq.bidEndDate)})
    }
  }

  render(){
    const {statusList,form,detail} = this.state;
    console.log("this.state",this.state);
    return (
      <div className="col-sm-12 mt-2">
        <div className="row mt-2">
          <label className="col-sm-1">
            {this.props.type} no <span className="redspan">*</span>
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={form.asnno ? form.asnno:''}
              required
              onChange={this.onChange.bind(this,'asnno')}
            />

          </div>

          <div className="col-sm-3">
          <button className="btn btn-success" onClick={this.onSearch}>
            Search
          </button>

          </div>

          { !isEmpty(statusList) &&
            <>

              <label className="col-sm-1">Status <span className="redspan">*</span> </label>
                <div className="col-sm-3">
                <select className="form-control"
                        value={form.status ? form.status:''} 
                        onChange={this.onChange.bind(this,'status')}
                        required>
                          <option value="">Select</option>
                          {(statusList).map(item=>
                            <option value={item.value}>{item.title}</option>
                          )};
                        </select>

                </div>
            </>
      }
      
     
     
        </div>

       
        { this.props.type == 'po' && !isEmpty(detail) &&
            <div className="row mt-2">
              <label className="col-sm-1">Employee code  <span className="redspan">*</span> </label>
                <div className="col-sm-3">
               
                <input
                  type="text"
                  className="form-control"
                  value={form.vendorCode ? form.vendorCode:''}
                  required
                  onChange={this.onChange.bind(this,'vendorCode')}
                />

                </div>
              </div>
        }


    
        <div className="col-sm-12 text-center mt-5" style={{marginTop:'40px !important'}}>
          <button type="submit" className="btn btn-success" onClick={this.onSave} disabled={isEmpty(this.state.detail)}>
            Save
          </button>
          <button type="button" className="btn btn-danger ml-2" onClick={this.onReset}>
            Cancel
          </button>
        </div>
  </div>
    )
  }
}
const mapStateToProps=(state)=>{
  return state.custom;
};
export const a = connect (mapStateToProps, actionCreators)(AsnComponent);  
class CustomComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pono:'',
      invoiceno:'',
      invoicedate:'',
      asnDetail:{},
      asnAttachment:{
        attachmentId:"",
        fileName:""
      },
      vendorList:[]
    };
    this.asnForm = null;
  }

  handleSubmit = (e) => {
    commonSubmitForm(e,this,"saveASNDetailsResponse","/rest/sendASNCreationReminderMail","asnForm")
  }

  onReset = () => {
      this.setState({pono:'',invoicedate:'',invoiceno:''});
      resetForm(this.asnForm)
  }

showAsnReminder = () => {
    commonSubmitWithParam(this.props, "showAsnReminderResp", "/rest/getAsnReminders", null);
  }

  deleteAsnReminder = (vendor) => {
    let reminderId = vendor['reminderId']
    commonSubmitWithParam(this.props, "deleteAsnReminder", "/rest/deleteAsnReminder", reminderId);
  }

  /*resetIndexs(){
    this.setState({checked:{},generateLoginOfVendor:[]})
  }

  inviteVendorsForLogin = () => {
    this.changeLoaderState(true);
    commonSubmitListOfDto(this.state.generateLoginOfVendor, this, "logInGenerateOfVendorResp", "/loginGeneratorForVendor",this.resetIndexs.bind(this));
  }*/

  UNSAFE_componentWillReceiveProps=props=>{
    
    if(props.enqDetails && props.enqDetails.objectMap){
      
      this.setState({enqDate:formatDateWithoutTime(props.enqDetails.objectMap.enq.bidEndDate)})
    }
if(props.vendorList){
      
      this.setState({vendorList:props.vendorList})
    }
  }
  render() {
    return (
      <React.Fragment>
    
        <UserDashboardHeader />


        <div className="card mt-100" id="togglesidebar">
          <div className="card-body">       

          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="custom-tab" data-toggle="pill" href="#custom-item" role="tab" aria-controls="custom-item" aria-selected="true">ASN Reminder</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="pono-tab" data-toggle="pill" href="#pono-item" role="tab" aria-controls="pono-item" aria-selected="false">Po No</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="asn-tab" data-toggle="pill" href="#asn-item" role="tab" aria-controls="asn-item" aria-selected="false">ASN</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="ssn-tab" data-toggle="pill" href="#ssn-item" role="tab" aria-controls="ssn-item" aria-selected="false">SSN</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="vendor-tab" data-toggle="pill" href="#vendor-item" role="tab" aria-controls="vendor-item" aria-selected="false">Vendor</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" id="close-enq-tab" data-toggle="pill" href="#close-enq-item" role="tab" aria-controls="close-enq-tab" aria-selected="false">Close Enquiry</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" id="prno-tab" data-toggle="pill" href="#prno-item" role="tab" aria-controls="prno-item" aria-selected="false">PR</a>
          </li>

        </ul>
        <div class="tab-content" id="custom-tabContent">
          <div class="tab-pane fade show active" id="custom-item" role="tabpanel" aria-labelledby="custom-tab">
          <FormWithConstraints
                  ref={(formWithConstraints) => this.asnForm = formWithConstraints }
                  onSubmit={this.handleSubmit} noValidate
                >

                <div className="col-sm-12 mt-2">
                  <div className="row mt-2">
                    <label className="col-sm-2">
                      PO No. <span className="redspan">*</span>
                    </label>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.pono}
                        name="pono"
                       // required
                        onChange={(event) => {
                          commonHandleChange(
                            event,
                            this,
                            "pono",
                            "asnForm"
                          );
                        }}
                      />
                      <FieldFeedbacks for="pono">
                        <FieldFeedback when="*"></FieldFeedback>
                      </FieldFeedbacks>
                    </div>
                    <label className="col-sm-2">
                      Invoice No. <span className="redspan">*</span>
                    </label>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.invoiceno}
                        name="invoiceno"
                        //required
                        onChange={(event) => {
                          commonHandleChange(
                            event,
                            this,
                            "invoiceno",
                            "asnForm"
                          );
                        }}
                      />
                            <FieldFeedbacks for="invoiceno">
                      <FieldFeedback when="*"></FieldFeedback>
                    </FieldFeedbacks>
                    </div>
              
                  </div>
                  <div className="row mt-2">
                    <label className="col-sm-2">Invoice Date </label>
                    <div className="col-sm-3">
                      <input
                        type="date"
                        className="form-control"
                        value={this.state.invoicedate}
                        name="invoicedate"
                        required
                        onChange={(event) => {
                          commonHandleChange(
                            event,
                            this,
                            "invoicedate",
                            "asnForm"
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 text-center mt-20" >
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button type="button" className="btn btn-danger ml-2 mr-1" onClick={this.onReset}>
                      Cancel
                    </button>
{/* <button type="button" className="btn btn-danger ml-2 icon-refresh" onClick={this.showAsnReminder}>
                            Show ASN Reminder
                    </button>*/}
                    <button type="button"  onClick={this.showAsnReminder}>Show ASN Reminder <i className="btn btn-danger ml-2 fa fa-refresh"></i>
                    </button>
                  </div>
                </div>
            
              </FormWithConstraints>

{/* FOR RESEND INVITATION CATEGORY */}
<div className={"card mb-1 " + (isEmpty(this.props.vendorList)  ? "display_none" : "display_block")}>
            <div className="row px-4 py-2">
              <div class="col-12">
              <div className="col-sm-3">
            <input type="text" id="SearchTableDataInputTwo" className="form-control" onKeyUp={searchTableDataTwo} placeholder="Search .." />
            </div>
            <div className="col-sm-3">
              &nbsp;
            </div>
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                    <table className="table table-bordered table-header-fixed">
                      <thead class="thead-light">
                        <tr>
                          <th>Invite</th>
                          <th>Vendor Email</th>
                          <th>VendorCode-Name</th>
                          <th>UserCode-Name</th>
                          <th>Location</th>
                          <th>PO NO</th>
                          <th>Invoice NO</th>
                          <th>Invoice Date</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody id="DataTableBodyTwo">
                        {this.props.vendorList.map((vendor, index) => (
                          <tr>
                            {
                              <>
                                <td>
                                  {/*<input type="checkbox" id={"checkbox" + index} onChange={e => this.inviteVendorCheckboxHandlerForAll(e, user, index)} checked={checked[index] || false} /> */}
                                  <input type="checkbox" id={"checkbox" + index}  />
                                </td>
                              </>
                            }
                            <td>{<>{vendor['vendorEmail']}</>}</td>
                            <td>{(vendor.vendor==null ? "": (vendor.vendor.userName==null?"":vendor.vendor.userName) + (vendor.vendor.name==null?"": '-'+ vendor.vendor.name))}</td>
                            <td>{vendor.createdBy.userName + '-' + vendor.createdBy.name}</td>
                            <td align="left">{vendor.createdBy.userDetails.plant}</td>
                            <td>{<>{vendor['poNo']}</>}</td>
                            <td>{<>{vendor['invoiceNo']}</>}</td>
                            <td>{<>{vendor['invoiceDate']}</>}</td>
                            <td>
                              {/*<button className={"btn btn-outline-info " + (this.state.editButtonFlag ? "not-allowed" : "")} data-toggle="modal" data-target="#EditUserInfo" type="button" disabled={this.state.editButtonFlag ? true : false} onClick={() => { this.displayUserInfoForResendInvitation(user) }} > */}
                              <button className={"btn btn-outline-info "} data-toggle="modal" data-target="#EditUserInfo" type="button" onClick={() => { this.deleteAsnReminder(vendor) }}>
                                <i
                                  className={"fa fa-trash "}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                {this.state.loginGeneratedResponseMessage}
                <button type="button" className="btn btn-outline-success float-right my-2 mr-4" onClick= {this.inviteVendorsForLogin }><i className="fa fa-envelope"></i>&nbsp;Send Reminder</button>
              </div>
            </div>
          </div>
          {/* FOR RESEND INVITATION CATEGORY */}
          </div>
          
          
          <div class="tab-pane fade" id="pono-item" role="tabpanel" aria-labelledby="pono-tab">

            <AsnComponent type='po' />

                      {/* po no == no input search - status & requested by , asn = status, ssn = status,vendor= status */}
          </div>

          <div class="tab-pane fade" id="asn-item" role="tabpanel" aria-labelledby="asn-tab">
        
           <AsnComponent type='asn' />

          </div>

          <div class="tab-pane fade" id="ssn-item" role="tabpanel" aria-labelledby="ssn-tab">
        
           <AsnComponent type='ssn' />

          </div>

          <div class="tab-pane fade" id="vendor-item" role="tabpanel" aria-labelledby="vendor-tab">
        
           <AsnComponent type='vendor' />

          </div>

          <div class="tab-pane fade" id="prno-item" role="tabpanel" aria-labelledby="prno-tab">
        
           <AsnComponent type='pr' />

          </div>

          <div class="tab-pane fade" id="close-enq-item" role="tabpanel" aria-labelledby="close-enq-tab">
        
          <div className="col-sm-12 mt-2">
                  <div className="row mt-2">
                    <label className="col-sm-2">
                      Enq No. <span className="redspan">*</span>
                    </label>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.enqNo}
                        name="pono"
                        required
                        onChange={(event) => {
                          commonHandleChange(
                            event,
                            this,
                            "enqNo"
                          );
                        }}
                      />
                       <button type="button" onClick={()=>commonSubmitWithParam(this.props,"getEnqByID","/rest/getEnqByID",this.state.enqNo)} className="btn btn-success">
                        Search
                      </button>
                    </div>
                    </div>
              
                  </div>
                  <div className="row mt-2">
                    <label className="col-sm-2"> Date </label>
                    <div className="col-sm-3">
                      <input
                        type="date"
                        className="form-control"
                        value={this.state.enqDate}
                        required
                        onChange={(event) => {
                          commonHandleChange(
                            event,
                            this,
                            "enqDate"
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 text-center">
                    <button type="submit" className="btn btn-success"
                    // commonSubmitFormNoValidationWithData(data, this, "getBidderQuotByPrId", "/rest/getBidderByFilter");
                    onClick={()=>commonSubmitFormNoValidationWithData({enquiryId:this.state.enqNo,bidEndDate:this.state.enqDate},this,"updateEnqEndDate","/rest/updateEnqEndDate")}
                    >
                      Save
                    </button>
                    {/* <button type="button" className="btn btn-danger ml-2" onClick={this.onReset}>
                      Cancel
                    </button> */}
                  </div>
                </div>

</div>
        
          </div>
        </div>

      </React.Fragment>
    );
  }
}

class CustomScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false
        };
      }
        
      changeLoaderState = (action) =>{
        this.setState({
          isLoading:action
        });
      }
      UNSAFE_componentWillReceiveProps=props=>{
        
        if(props.enqDetails && props.enqDetails.objectMap){
          
          this.setState({enqDate:formatDateWithoutTime(props.enqDetails.objectMap.enq.bidEndDate)})
        }
      }
    render(){
        return (
            <>
                <Loader isLoading={this.state.isLoading} />
                <CustomComponent changeLoaderState={this.changeLoaderState} {...this.props} />
            </>
        )
    }
}
const mapsStateToProps=(state)=>{
  return state.custom;
};
export default connect (mapsStateToProps, actionCreators)(CustomScreen);  

