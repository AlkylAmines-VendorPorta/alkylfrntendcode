import React, { Component } from 'react'
import {connect} from 'react-redux';

import {commonSubmitWithParam,commonHandleChange, commonSubmitForm, commonHandleChangeCheckBox, commonHandleFileUpload,swalWithTextBox,swalWithDate,swalPrompt,swalWithTextBoxDynamicMessage} from "../../Util/ActionUtil";
import { isEmpty } from '../../Util/validationUtil';
import * as actionCreators from "../AdvanceShipmentNotice/AdvanceShipmentNotice/Action";

class ButtonGroup extends Component{
    constructor (props) {
        super(props)
        this.state={
            asn : {
                asnId : "",
                status  : "",
                nameOfDriver : "",
                mobileNumber : "",
                photoIdProof : "",
                grnNO:"",
                
            },
            role:"",
            asnLineList:[]
        }
    }

    componentWillReceiveProps(props){
        if(!isEmpty(props.asn)){
            this.setState({
                asn : props.asn
            })
        }

        if(!isEmpty(props.role)){
            this.setState({
                role : props.role
            })
        }

        if(!isEmpty(props.asnLineList)){
            this.setState({
                asnLineList : props.asnLineList
            })
        }
        
    }
    SubmitDate=(e)=>{

      //  this.props.changeASNStatus(true);
        //swalWithDate(e,this,"gateInDate",'Please enter Posting Date');
        commonSubmitWithParam(this.props,"securityASNSubmit","/rest/getInSecurityStatusUpdate",this.state.asn.asnId)
    }

    Submit103=(e)=>{
        this.props.changeASNStatus(true);
        swalWithDate(e,this,"gateInDate",'Please enter Posting Date');
    }
    gateInDate=(gDate)=>{
       // this.props.changeLoaderState(true); 
        commonSubmitWithParam(this.props,"gateInResponse","/rest/asnGateIn",this.state.asn.asnId,gDate);

    }
    safetyfail=(e)=>{
        this.props.changeASNStatus(true);
        swalWithTextBox(e,this,"safetyFailWithReason");
    }

    safetyFailWithReason=(value)=>{
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"safetyCheckResponse","/rest/safetyCheckFailed",this.state.asn.asnId,value)
    }


    ohcFail=(e)=>{
        this.props.changeASNStatus(true);
        swalWithTextBox(e,this,"ohcFailWithReason");
    }
    ohcFailWithReason=(value)=>{
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"ohcResponse","/rest/ohcFailed",this.state.asn.asnId,value)
    }


    qcFail=(e)=>{
        this.props.changeASNStatus(true);
        swalWithTextBox(e,this,"qcFailWithReason");
    } 
    qcFailWithReason=(value)=>{
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"qcResponse","/rest/qcFailed",this.state.asn.asnId,value)
    }
    safetyPass=(e)=>{
        this.props.changeLoaderState(true);
        this.props.changeASNStatus(true);
        commonSubmitWithParam(this.props,"safetyCheckResponse","/rest/safetyCheckPassed",this.state.asn.asnId)
    }
    OHCPass=()=>{
        this.props.changeLoaderState(true);
        this.props.changeASNStatus(true);
        commonSubmitWithParam(this.props,"ohcResponse","/rest/ohcPassed",this.state.asn.asnId)
    }
    QcPass=(e)=>{
        this.props.changeLoaderState(true);
        this.props.changeASNStatus(true);
        commonSubmitWithParam(this.props,"qcResponse","/rest/qcPassed",this.state.asn.asnId)
    }
    unloadASN=(e)=>{
        this.props.changeLoaderState(true);
        this.props.changeASNStatus(true);
        commonSubmitWithParam(this.props,"asnUnLoadResponse","/rest/asnUnload",this.state.asn.asnId)
    }
    handleUnload=()=>{
        this.props.handleUnloadFromParent(true);
    }
    handleQC=()=>{
        this.props.handleQCFromParent(true);
    }
    handle105=()=>{
        this.props.handle105FromParent(true);
    }

    safetyHold=(e)=>{
        this.props.changeASNStatus(true);
        swalWithTextBoxDynamicMessage(e,this,"safetyHoldWithReason","Enter reason for Hold");
    }

    safetyHoldWithReason=(value)=>{
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"safetyCheckResponse","/rest/safetyCheckHold",this.state.asn.asnId,value);
    }

    ohcHold=(e)=>{
        this.props.changeASNStatus(true);
        swalWithTextBoxDynamicMessage(e,this,"ohcHoldWithReason","Enter reason for Hold");
    }

    ohcHoldWithReason=(value)=>{
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"ohcResponse","/rest/ohcHold",this.state.asn.asnId,value);
    }

    render(){
        return(
            <>
            <div class="w-100 m-2">
                <div class="row w-100">
                    <div class="col-12">
                        <div class="customButtons">
                        {  (this.props.asnLineList).map((asnLine,index)=>
                        (index==0?
                           // <button className={"btn btn-primary ml-1 mr-3 my-2 inline-block"} type="button" data-toggle="modal" data-target="#getReportModal">{(this.state.asn.status==="IT") && (this.state.role!=="STRADM") && (asnLine.poLine.plant==="1810" ||asnLine.poLine.plant==="1820"|| asnLine.poLine.plant==="1880") ? "Report":"Driver Details"}</button>
                           <button className={"btn btn-primary ml-1 mr-3 my-2 inline-block"} type="button" data-toggle="modal" data-target="#getReportModal">{(this.state.asn.status==="IT") && (this.state.role!=="STRADM") ? "Report":"Driver Details"}</button>
                           :""
                            ))
                            }

                           {/* <button className={(this.state.asn.status==="REPORTED" || this.state.asn.status==="SCH")?"btn btn-success mx-1 my-2 inline-block":"none"} type="button" 
                            onClick={(e)=>{swalPrompt(e,this,"safetyPass","","Do you really want to Proceed?","Yes","No") }}>
                                Safety Check Pass
                            </button>
                            <button className={(this.state.asn.status==="REPORTED" || this.state.asn.status==="SCH") ?"btn btn-danger mx-1 my-2 inline-block":"none"} type="button" 
                            onClick={(e)=>{ this.safetyfail(e)}} >
                                Safety Check Fail
                            </button>
                            <button className={(this.state.asn.status==="REPORTED" || this.state.asn.status==="SCH" ||this.state.asn.status==="SCF")?"btn btn-warning ml-1 mr-3 my-2 inline-block":"none"} type="button" 
                            onClick={(e)=>{this.safetyHold(e)}
                                // {this.props.changeASNStatus(true);commonSubmitWithParam(this.props,"safetyCheckResponse","/rest/safetyCheckHold",this.state.asn.asnId)}
                                } >
                                Safety Check Hold
                            </button>
                            <button type="button" className={(this.state.asn.status==="SCP" || this.state.asn.status==="OHCH")?"btn btn-success mx-1 my-2 inline-block":"none"} 
                            onClick={(e)=>{swalPrompt(e,this,"OHCPass","","Do you really want to Proceed?","Yes","No")}} >
                                OHC Pass
                            </button>
                            <button type="button" className={(this.state.asn.status==="SCP" || this.state.asn.status==="OHCH")?"btn btn-danger ml-1 mr-3 my-2 inline-block":"none"} 
                            onClick={(e)=>{this.ohcFail(e)}} >
                                OHC Fail
                            </button>
                            <button type="button" className={this.state.asn.status==="SCP" || this.state.asn.status==="OHCF"?"btn btn-warning ml-1 mr-3 my-2 inline-block":"none"} 
                            onClick={(e)=>{this.ohcHold(e)
                                // this.props.changeASNStatus(true);commonSubmitWithParam(this.props,"ohcResponse","/rest/ohcHold",this.state.asn.asnId)
                                }} >
                                OHC Hold
                            </button>*/}
                            {/* <button type="button" 
                                className={((this.state.asn.status==="GATE_IN" || this.state.asn.status==="UNLOAD")
                                        && this.state.role==="QCADM")?"btn btn-success mx-1 my-2 inline-block":"none"} 
                            onClick={(e)=>{swalPrompt(e,this,"QcPass","","Do you really want to Proceed?","Yes","No")}} >
                                QC Pass
                            </button> */}
                            {/* <button type="button" 
                                className={((this.state.asn.status==="GATE_IN" || this.state.asn.status==="UNLOAD")
                                && !this.state.asn.isQC && this.state.role==="QCADM")?"btn btn-success mx-1 my-2 inline-block":"none"} 
                            onClick={this.handleQC} >
                                QC Pass
                            </button> */}
                            {/* <button type="button" 
                                className="btn btn-success mx-1 my-2 inline-block" 
                            onClick={this.handleQC} >
                                QC Pass
                            </button> */}
                            <button type="button" 
                                className={((this.state.asn.status==="GATE_IN" || this.state.asn.status==="UNLOAD")
                                && this.state.role==="QCADM")?"btn btn-danger ml-1 mr-3 my-2 inline-block":"none"} 
                            onClick={(e)=>{this.qcFail(e)}} >
                                QC Fail
                            </button>
                            {/* <button type="button" 
                                className={((this.state.asn.status==="GATE_IN" || this.state.asn.status==="UNLOAD")
                                && this.state.role==="QCADM")?"btn btn-danger ml-1 mr-3 my-2 inline-block":"none"} 
                            onClick={(e)=>{this.qcFail(e)}} >
                                QC HOLD
                            </button> */}

{/*<button type="button" className={this.state.asn.status==="REPORTED" && (asnLine.poLine.plant=="1810" || asnLine.poLine.plant=="1820"|| asnLine.poLine.plant=="1880")?"btn btn-primary mx-1 my-2 block":"none"} 
                            onClick={(e)=>{ this.SubmitDate(e)}} >
                                Gate In
                        </button>*/}

                            {  (this.props.asnLineList).map((asnLine,index)=>
                        (index==0?
                            <button type="button" className={this.state.asn.status==="REPORTED"?"btn btn-primary mx-1 my-2 block":"none"} 
                            onClick={(e)=>{ this.SubmitDate(e)}} >
                                Gate In
                            </button>
                            :""
                            ))
                            }
                             {  (this.props.asnLineList).map((asnLine,index)=>
                        (index==0?
                            <button type="button" className={this.state.asn.status==="GATE_IN" && this.state.role==="STRADM"?"btn btn-primary mx-1 my-2 block":"none"} 
                            onClick={(e)=>{ this.Submit103(e)}} >
                                POST 103
                            </button>
                            :""
                            ))
                            }
                            <button type="button" 
                            className={((this.state.asn.status==="GRN" || this.state.asn.status==="CLOSED"||this.state.asn.status==="103_Posted")&& (this.state.role==="SECADM"))?"btn btn-primary ml-1 mr-3 my-2 inline-block":"none"} 
                            onClick={(e)=>{this.props.changeASNStatus(true);commonSubmitWithParam(this.props,"gateOutResponse","/rest/asnGateOut",this.state.asn.asnId)}} >
                                Gate Out
                            </button>

                            {/* <button type="button" 
                            className={((this.state.asn.status==="QCP" || this.state.asn.status==="GATE_IN")
                                        && this.state.role==="STRADM")?"btn btn-primary mx-1 my-2 inline-block":"none"} 
                            onClick={this.handleUnload} >
                                Unload
                            </button> */}
                           {/* <button type="button" 
                            className={((this.state.asn.status==="QCP" || this.state.asn.status==="GATE_IN")
                                        && !this.state.asn.isUnload && this.state.role==="STRADM")?"btn btn-primary mx-1 my-2 inline-block":"none"} 
                            onClick={(e)=>{swalPrompt(e,this,"unloadASN","","Do you really want to Proceed?","Yes","No")}} >
                                Unload
                            </button>*/}
                           {/*   className={(this.state.asn.isUnload && this.state.asn.isQC && this.state.role==="STRADM" && !isEmpty(this.state.asn.grnNO)*/}
                           {/*<button type="button" 
                            className={((this.state.asn.status==="GATE_IN" && this.state.role==="STRADM" && (asnLine.poLine.plant=="1810" || asnLine.poLine.plant=="1820" || asnLine.poLine.plant=="1880")) || (this.state.asn.status==="IT" &&  this.state.role==="STRADM" && (asnLine.poLine.plant!="1810" && asnLine.poLine.plant!="1820" && asnLine.poLine.plant!="1880"))
                                    ? "btn btn-primary mx-1 my-2 inline-block":"none")} 
                            onClick={this.handle105} >
                                POST GRN
                            </button>*/}
                           {(this.props.asnLineList).map((asnLine,index)=>
                        (index==0?
                            <button type="button" 
                            className={((this.state.asn.status==="103_Posted" || this.state.asn.status==="CLOSED" || this.state.asn.status==="GATE_OUT" && this.state.role==="STRADM")
                                    ? "btn btn-primary mx-1 my-2 inline-block":"none")} 
                            onClick={this.handle105} >
                                POST GRN
                            </button>:""
                            ))
                            }

                            
                                                        
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal gateEntryModal" id="getReportModal" >
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Driver Details</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class={"modal-body "+(this.state.asn.status==="IT"?"":"readonly")} >
                            <form onSubmit={(e)=>{commonSubmitForm(e,this,"saveGateEntry","/rest/reportGateEntry")}}>
                                <input type="hidden" name="advanceShipmentNoticeId" value={this.state.asn.asnId} />
                                <div class="row">
                                    <div class="col-sm-4">Name of Driver</div>
                                    <div class="col-sm-8">
                                        <input type="text" name="nameOfDriver" class="form-control"
                                        value={this.state.asn.nameOfDriver} 
                                        onChange={(e)=>{commonHandleChange(e,this,"asn.nameOfDriver")}}/>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-sm-4">Mobile Number</div>
                                    <div class="col-sm-8">
                                        <input type="text" name="mobileNumber" class="form-control"
                                        value={this.state.asn.mobileNumber} 
                                        onChange={(e)=>{commonHandleChange(e,this,"asn.mobileNumber")}} />
                                    </div>
                                </div>
                                {/* <div class="row mt-2">
                                    <div class="col-sm-4">Valid Photo ID Proof</div>
                                    <div class="col-sm-8">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="customFile"/>
                                            <label class="custom-file-label" for="customFile">Choose file</label>
                                        </div>
                                    </div>
                                </div> */}
                                <div class="row mt-2">
                                    <div class="col-sm-4">Photo ID Proof</div>
                                    <div class="col-sm-8">
                                        <input type="text" name="photoIdProof" class="form-control" 
                                        value={this.state.asn.photoIdProof} 
                                        onChange={(e)=>{commonHandleChange(e,this,"asn.photoIdProof")}} />
                                    </div>
                                </div>
                                {/* <div class="row mt-2">
                                    <div class="col-sm-4">Gate Entry No.</div>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control"/>
                                    </div>
                                </div> */}
                                <div class="row my-2">
                                    <div class="col-sm-4"></div>
                                    <div class="col-sm-8">
                                        <button type="submit" class={this.state.asn.status==="IT"?"btn btn-success col-sm-5 mr-2":"none"} >Report</button>
                                        <button type="button" class="btn btn-danger col-sm-5 ml-2 closeModal" data-dismiss="modal" >Close</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>    
                </div>
            </div>
        </>           
        )
    }
}

const mapStateToProps=(state)=>{
    return state.asnReducer;
  };
  export default connect (mapStateToProps,actionCreators)(ButtonGroup);


  //this.state.asnLineList.po[0].plant