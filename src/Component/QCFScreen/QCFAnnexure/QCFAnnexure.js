import React, { Component } from "react";
import { commonHandleChange,commonSubmitFormNoValidation, swalWithTextBox,commonSubmitWithParam,showAlertAndReload} from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";
import * as actionCreators from "../QCFAnnexure/Action/Action";
import {ROLE_PURCHASE_MANAGER_ADMIN } from "../../../Constants/UrlConstants";
import {ROLE_GENERAL_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_EXECUTIVE_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import {ROLE_CHAIRMAN_MANAGER_ADMIN} from "../../../Constants/UrlConstants";
import { connect } from "react-redux";
import { jsPDF } from "jspdf"; 
import {
    uploadFile,sendMailDto
    } from "../../../Util/APIUtils";
import { API_BASE_URL,API_BASE_URL_QCF } from "../../../Constants";
import QCFCompare from "../QCFCompare/QCFCompare";
import {
    submitToURL,
   
  } from "../../../Util/APIUtils";
  import StickyHeader from "react-sticky-table-thead";
import { FormWithConstraints } from "react-form-with-constraints";
import { initial } from "lodash-es";
import serialize from "form-serialize";
import swal from "sweetalert";

class QCFAnnexure extends Component{
    constructor(props){
        super(props);
        this.state = {
            attachmentId:"",
            annexureReasonsList: [
                // {
                //     value: "reason_1",
                //     display: "Reason 1"
                // },
                // {
                //     value: "reason_2",
                //     display: "Reason 2"
                // },
                // {
                //     value: "reason_3",
                //     display: "Reason 3"
                // },
                // {
                //     value: "reason_4",
                //     display: "Reason 4"
                // }
            ],
            proposedReasonList:[
                {
                    annexureId:"",
                    code:"",
                    description:""
                    
                },          
            ],
            enquiry:{
                enquiryId:""
            },
            loadProposedReason:false,
            optionLoadProposedReason:false,
            approvalList:[],
            checkedgroup1:false,

            group2ApproverList:[{
            srNumber:"",
            emailAddress:"",
            group:"",
            initial:""
        }],

        group1ApproverList:[{
            srNumber:"",
            emailAddress:"",
            group:"",
            initial:""
        }],
        ccEmailList:[]
        };
    }

    componentDidMount(){

        this.setState({
            loadProposedReason:true,
            optionLoadProposedReason:true
        })
    }

    addOtherAnnexure() {
        let currAnnexureList = this.state.proposedReasonList;
        let annexureArray = [
        this.getEmptyAnnexureObj()
        ];
        annexureArray = currAnnexureList.concat(annexureArray);
        this.setState({
            proposedReasonList: annexureArray,
        });
    }

    removeOtherAnnexure(i) {
        let otherAnnexureList = this.state.proposedReasonList;
        otherAnnexureList.splice(i, 1);
        this.setState({ proposedReasonList: otherAnnexureList });
    }

    getEmptyAnnexureObj=()=>{
        return {
            annexureId:"",
            code:"",
            description:"",
            enquiry:{
                enquiryId:""
            },
        }
    }

    componentWillReceiveProps(props){

        if(this.state.optionLoadProposedReason && !isEmpty(props.optionProposedReasonList)){
            this.props.changeLoaderState(false);
            this.setOptionProposedReason(props);
        }
        
        if (this.state.loadProposedReason && !isEmpty(props.proposedReasonList)){
            this.setProposedReason(props);
            this.props.changeLoaderState(false);
        }

        if(!isEmpty(this.props.loadApproverList)){
         let QCFApprovalGroup2List=[];
         let QCFApprovalGroup1List=[];
         props.loadApproverList.map((group)=>{
            if(group.group=="G2"){

            QCFApprovalGroup2List.push(this.getgroup2FromApproverList(group))}
            else{
                QCFApprovalGroup1List.push(this.getgroup1FromApproverList(group))
            }
        });

          this.setState({
            group2ApproverList : QCFApprovalGroup2List,
            group1ApproverList:QCFApprovalGroup1List
        });

       //   this.setApprovalList(props)
        // this.setState({loadApproverList:this.state.loadApproverList})
        }
    }
    getgroup2FromApproverList = (group) =>{
        return {
          group : group.group,
          srNumber:group.srNumber,
          emailAddress:group.emailAddress,
          initial:group.initial
          
        }
      }

      getgroup1FromApproverList = (group) =>{
        return {
          group : group.group,
          srNumber:group.srNumber,
          emailAddress:group.emailAddress,
          initial:group.initial
          
        }
      }

      handleCheckboxChange = event => {
        let newArray = [...this.state.ccEmailList, event.target.value];
        if (this.state.ccEmailList.includes(event.target.value)) {
          newArray = newArray.filter(list => list !== event.target.value);
        }
        this.setState({
            ccEmailList: newArray
        });
      };

    setOptionProposedReason=(props)=>{
        
        let proposedReasonListArray = Object.keys(props.optionProposedReasonList).map((key) => {
                return { display: props.optionProposedReasonList[key], value: key }
            });
        this.setState({
            annexureReasonsList:proposedReasonListArray,
            optionLoadProposedReason:false
        })
    }

    setProposedReason=(props)=>{
        
        this.setState({
            proposedReasonList:props.proposedReasonList,
            loadProposedReason:false
        })
    }

    onAddCategory = value => {
        this.setState({checkedgroup1:true})

      };


  getSelectedRows() {
    this.setState({
      SelectedList: this.state.List.filter((e) => e.selected),
    });
  }

  sendQCFApproverMail=(event)=>{

    const form = event.currentTarget.form;
    let mailDto = this.getSerializedForm(form);

//     if(this.props.annexureStatus=="POSTED" || this.props.annexureStatus=="APPROVED"){
//         swal("The Mail Already has been sent.Would you like to Resend then please reject this annexure", {
          
//          })
//     }
//    else{
    const data = new FormData();
    data.append('ccList',this.state.ccEmailList);
    data.append('recipientList',mailDto.recipientList);
    data.append('annexureId',mailDto.annexureId);
   // const qcfno=this.props.qcfno
   // data.append('qcfno',qcfno)
    sendMailDto(data,"/rest/sentQCFApprovalMail").then(response => {
    showAlertAndReload(!response.success,response.message);
                })
         // }
  }

   getSerializedForm(form) {
        return serialize(form, {
           hash: true,
           empty: true
        });
     }

    updateAnnexureReject=(value)=>{
        commonSubmitWithParam(this.props,"updateAnnexureReject","/rest/updateAnnexureReject",this.props.annexureId,value);
      }

    validateAnnexureApprover=()=>{
        if(ROLE_PURCHASE_MANAGER_ADMIN===this.props.role || ROLE_GENERAL_MANAGER_ADMIN===this.props.role ||ROLE_EXECUTIVE_MANAGER_ADMIN===this.props.role || ROLE_CHAIRMAN_MANAGER_ADMIN===this.props.role ){
          return true;
        }
        return false;
    }

    toPdf(){

        {this.props.enquiryDetails.isMailsentFinalApproval!="Y"?
        commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId)
        :
        commonSubmitWithParam(this.props,"update2ndtimeAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId)}

        // return commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
        // const pdf = new jsPDF('p', 'pt', 'a4');
        // pdf.html(this._pdfPrint).then(e => {
        //  let blob =  pdf.output('blob');
        //  let formData = new FormData();
        //  formData.append('file', blob);
        //  this.props.changeLoaderState(true)
        //  uploadFile(formData,"/rest/addAttachment").then(response => {
        //   // getFileUploadObject(component,JSON.stringify(response),statePath);
        //  this.setState({attachmentId:response.attachmentId}, () => {
        //   commonSubmitWithParam(this.props,"updateAnnexureApproval","/rest/updateAnnexureApproval",this.props.annexureId);
        //  }) 
        //  }).catch(err => {
        //    this.props.changeLoaderState(false);
        //  });
        // });
      }

    render(){
        return(
            <>
                <input
                    type="hidden"
                    name="pr[prId]"
                    value={this.props.prId}
                    disabled={isEmpty(
                        this.props.prId
                    )}
                />
                {this.props.role===ROLE_PURCHASE_MANAGER_ADMIN?
                <div className="card my-2">
                    <div className="lineItemDiv min-height-0px">
                        <div className="row mt-1 px-4 py-1">
                            <div className="col-3 mb-1 border_bottom_1_e0e0e0">
                                <label>Reason</label>
                            </div>
                            <div className="col-7 mb-1 border_bottom_1_e0e0e0">
                                <label>Description</label>
                            </div>
                            <div className="col-2 mb-1 border_bottom_1_e0e0e0">
                                <label>Action</label>
                            </div>
                        </div>
                        <div className="row mt-1 px-4 py-1 max-h-500px">
                        {this.state.proposedReasonList.map((el, i) => (
                            <>
                                <input
                                    type="hidden"
                                    name={"praposedReasonSet["+i+"][praposedReasonId]"}
                                    value={el.praposedReasonId}
                                    disabled={isEmpty(
                                        el.praposedReasonId
                                    )}
                                />
                               
                                {/* <input type="hidden" name={"praposedReasonSet["+i+"][enquiryId]"}  value={this.props.enquiryId}></input> */}
                                
                                {/* <input
                                    type="hidden"
                                    name={"praposedReasonSet["+i+"][annexure][annexureId]"}
                                    value={this.props.annexureId}
                                    disabled={isEmpty(
                                        this.props.annexureId
                                    )}
                                /> */}
                                <div className="col-3">
                                    <select className={"form-control " + this.props.readonly}
                                        value={el.code}
                                        name={"praposedReasonSet["+i+"][code]"}
                                        onChange={(event) =>commonHandleChange(event,this,"proposedReasonList."+i+".code")}
                                    >
                                        <option value={""}>Select</option>
                                        {this.state.annexureReasonsList.map(records => <option value={records.value}>{records.display}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="col-7">
                                    <div className="form-group">
                                        <textarea
                                            className={"h-60px form-control " + this.props.readonly}
                                            value={el.description}
                                            name={"praposedReasonSet["+i+"][description]"}
                                            onChange={(event) => {
                                                commonHandleChange(event, this, "proposedReasonList."+i+".description");
                                            }}/>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <button
                                        className={
                                            "btn " +
                                            (i === 0
                                                ? "btn-outline-success"
                                                : "btn-outline-danger")
                                        }
                                        onClick={() => {
                                            i === 0
                                                ? this.addOtherAnnexure()
                                                : this.removeOtherAnnexure("" + i + "");
                                        }}
                                        type="button"
                                    >
                                        <i
                                            class={"fa " + (i === 0 ? "fa-plus" : "fa-minus")}
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </div>
                                </>
                            ))}



                          <input type="hidden" name="enquiry[enquiryId]" value={this.props.enquiryId} >
                              
                              </input>
                         
                        </div>
                        <div className="row mt-1 px-4 py-1">
                            <div className="col-12 border_top_1_e0e0e0">
                                <div className="mt-1 d-flex justify-content-center">
                                    <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.props.loadCompare()}><i className="fa fa-arrow-left" /></button>
                                    {!this.validateAnnexureApprover()?
                                    <>
                                        <button type="button"
                                            onClick={(e)=>{commonSubmitFormNoValidation(e,this,"saveAnnexure","/rest/saveAnnexure")}}
                                            className="btn btn-sm btn-outline-success mr-2"><i className="fa fa-file" />&nbsp;Save</button>
                                        <button type="submit" className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Submit</button>
                                
                                    </>
                                    :
                                    <>
                                    {this.props.enquiryDetails?.finalApprovalStatus == "REJECTED" || this.props.enquiryDetails?.isMailsentFinalApproval != 'Y' ?
                                    
                      <><button type="button" onClick={(e)=> {
                          this.toPdf(e);
                          }} className="btn btn-sm btn-outline-success mr-2"  data-toggle="modal" data-target="#getApprovalListModal"><i className="fa fa-check"/>&nbsp;Accept</button>
                      <button type="button" onClick={(e)=>{
                        // return this.toPdf();
                        swalWithTextBox(e,this,"updateAnnexureReject");
                    }} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times"/>&nbsp;Reject</button>
                    </>
                     :""} </>
                                    }
                                   
                                </div>
                            </div>
                        </div>
{/* <FormWithConstraints ref={formWithConstraints => this.reports = formWithConstraints}
                onSubmit={(e) => {

                  // this.setState({ asndetails: { test: "" } });
                  this.changeLoaderState(true);

                  //    commonSubmitForm(e, this, "asnResponse", "/rest/getASNReport", "reports")
                  commonSubmitForm(e, this, "qcfApproval", "/rest/sentQCFApprovalMail", "reports");
                  // this.handleSearchClick(true)
                  // this.changeLoaderState(true);

                }} noValidate
                > */}

                {this.props.enquiryDetails.isMailsentFinalApproval!="Y"?
                       <div className="modal gateEntryModal" id="getApprovalListModal" >
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Send Mail For QCF Final Approval</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body "} >
                           
                                <div class="row my-2">
                                <div className="col-sm-12">

                                <div class="table-proposed">
                                <div className="col-sm-12 text-center mt-2 ">
                                  <label style={{fontSize:"20px"}}>Group 1 List</label>
                                 </div>
                    <table className="my-table">
                      <thead class="thead-light">
                        <tr>
                          <th>Invite</th>
                          <th>Group 1 Approver Email</th>
                          <th>Group 1 Approver-Name</th>
                       
                        </tr>
                      </thead>
                      <tbody id="DataTableBodyTwo">
                        {this.state.group1ApproverList.map((qcfgroup1list, index) => (
                            qcfgroup1list.group==="G1"?
                          <tr>
                            {
                              <>
                                <td>
                                 
                                  <input type="radio" name="recipientList" 
                                  value={qcfgroup1list.emailAddress} 
                                // checked={this.state.checkedgroup1}
                                  onChange={value => this.onAddCategory(value)}
                                  />
                                </td>
                              </>
                            }
                            
                            <td>{qcfgroup1list.emailAddress}</td>
                            <td>{qcfgroup1list.initial}</td>
                          </tr>:""
                        ))}
                      </tbody>
                    </table>
                    
                   
                </div>


                <div class="table-proposed">
                                <div className="col-sm-12 text-center mt-2 ">
                                  <label style={{fontSize:"20px"}}>Group 2 List</label>
                                 </div>
                    <table className="my-table">
                      <thead class="thead-light">
                        <tr>
                          <th>Invite</th>
                          <th>Group 2 Approver Email</th>
                          <th>Group 2 Approver-Name</th>
                       
                        </tr>
                      </thead>
                      <tbody id="DataTableBodyTwo">
                      
                        {this.state.group2ApproverList.map((qcfgroup2list, i) => (
                            qcfgroup2list.group==="G2"?
                          <tr>
                            {
                              <>
                                <td>
                                 
                                  <input type="checkbox" 
                               
                                
                                  name={"ccList["+i+"][emailAddress]"}
                                  value={qcfgroup2list.emailAddress}
                                  onClick={this.handleCheckboxChange}
                                  />
                                </td>
                              </>
                            }
                            
                            <td>{qcfgroup2list.emailAddress}</td>
                            <td>{qcfgroup2list.initial}</td>
                          </tr>:""
                        ))}
                      </tbody>
                    </table>
                    
                   
                </div>
  <button type="button" onClick={this.sendQCFApproverMail} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;Send Mail</button>
                                    
  
                                      
                                    </div>
                                </div>
                           
                        </div>
                    </div>    
                </div>
            </div>:""}
            {/* </FormWithConstraints> */}
                    </div>
                </div>    :""}
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return state.qcfAnnexure;
   
};
export default connect(mapStateToProps, actionCreators)(QCFAnnexure);