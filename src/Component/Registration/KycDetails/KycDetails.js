import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import {connect} from 'react-redux';
import {isEmpty} from "../../../Util/validationUtil";
import {formatDateWithoutTime} from "../../../Util/DateUtil";
import * as actionCreators from "../../Registration/KycDetails/Action";
import { commonHandleFileUpload, commonSetState, commonSubmitForm, commonHandleChange, commonSubmitWithParam, 
        commonHandleChangeCheckBox, validateForm,resetForm } from "../../../Util/ActionUtil";
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import Loader from "../../FormElement/Loader/LoaderWithProps";
import { Button } from "@material-ui/core";
class KycDetails extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      loadKycDetails : false,
      saveKycDetails : false,
      kycDetails:"",
      kycDetailsId:"",
      panNumber:"",
      msmeNumber:"",
      msmeType:"",
      panAttachment:{
        attachmentId:"",
        fileName:""
      },
      isGstApplicable:false,
      // displayDivForGSTR:"none",
      gstNo:"",
      gstAttachment:{
        attachmentId:"",
        fileName:""
      },
      
      otherDocumentsList: [
        {
          attachmentId : "",
          fileName : "",
          text : ""
        }
      ],
      checkedGst:false,
      gstrAttachment1:{
        attachmentId:"",
        fileName:""
      },
      gstrAttachment2:{
        attachmentId:"",
        fileName:""
      },
      gstrAttachment3:{
        attachmentId:"",
        fileName:""
      },
      threebAttachment1:{
        attachmentId:"",
        fileName:""
      },
      threebAttachment2:{
        attachmentId:"",
        fileName:""
      },
      threebAttachment3:{
        attachmentId:"",
        fileName:""
      },
      cancelCqCopyAttachment:{
        attachmentId:"",
        fileName:""
      },
      isMSME: false,
      msmeAttachment:{
        attachmentId:"",
        fileName:""
      },
      isLDC: false,
      ldcAttachment:{
        attachmentId:"",
        fileName:""
      },
      validFrom:"",
      validTo:"",
      ldcValue:"",
      isRelatedParty: false,
      otherDocumentsAttachment:{
        attachmentId:"",
        fileName:""
      }
    }
  }

getODFromObj = (od) =>{
    if(!isEmpty(od) && !isEmpty(od.attachmentdetails)){
      let attId = od.attachmentdetails.attachmentId;
      let attName = od.attachmentdetails.fileName;
      return {
        attachmentId : attId,
        fileName : attName,
        text : od.description
      }
    }
}
resetKycDetailsForm=(kycDetForm)=>{
  this.setState({loadKycDetails:true,
    panNumber:"",
    msmeNumber:"",
    msmeType:"",
    panAttachment:{
      attachmentId:"",
      fileName:""
    },
    gstNo:"",
    gstAttachment:{
      attachmentId:"",
      fileName:""
    },
    
    otherDocumentsList: [
      {
        attachmentId : "",
        fileName : "",
        text : ""
      }
    ],
    gstrAttachment1:{
      attachmentId:"",
      fileName:""
    },
    gstrAttachment2:{
      attachmentId:"",
      fileName:""
    },
    gstrAttachment3:{
      attachmentId:"",
      fileName:""
    },
    threebAttachment1:{
      attachmentId:"",
      fileName:""
    },
    threebAttachment2:{
      attachmentId:"",
      fileName:""
    },
    threebAttachment3:{
      attachmentId:"",
      fileName:""
    },
    cancelCqCopyAttachment:{
      attachmentId:"",
      fileName:""
    },
    msmeAttachment:{
      attachmentId:"",
      fileName:""
    },
    ldcAttachment:{
      attachmentId:"",
      fileName:""
    },
    validFrom:"",
    validTo:"",
    ldcValue:"",
    otherDocumentsAttachment:{
      attachmentId:"",
      fileName:""
    }
  });
  resetForm(kycDetForm);
  ;
  // kycDetForm.resetFields();
  commonSubmitWithParam(this.props,"getKYCInfo","/rest/getKYCDetails",this.props.partner.partnerId);
  // kycDetForm.resetField(document.getElementById("panid1"));


}
clearMSMEField=(formRef)=>{
  ;
  // console.log(formRef);
  // formRef.resetField(document.getElementsByName("msmeCertificate[attachmentId]"));
  // formRef.resetField(document.getElementById("msmeNo"));
  // console.log();
  // formRef.reset()
  this.setState({
    msmeAttachment:{
      attachmentId:"",
      fileName:""  
    },
    msmeNumber:"",
    msmeType:""

  })
  formRef.resetField(document.getElementById("msmeNo"));
  formRef.resetField(document.getElementById("msmeCertiid"))
}



  async componentDidMount(){
    
    this.setState({
      loadKycDetails:true
    });
    commonSubmitWithParam(this.props,"getKYCInfo","/rest/getKYCDetails",this.props.partner.partnerId);
  }

  async componentWillReceiveProps(props){
    if(!isEmpty(props.kycDetailsId) && this.state.saveKycDetails){
      this.setState({
        saveKycDetails : false,
        kycDetailsId: props.kycDetailsId
      })
    }

    if(!isEmpty(props.kycDetails) && this.state.loadKycDetails){
      let kycDet=props.kycDetails;
      let vendor= kycDet.partner;
      let odList = [];
      if(isEmpty(kycDet.otherDocuments)){
        odList = [{
          attachmentId : "",
          fileName : "",
          text : ""
        }]
      }else{
        kycDet.otherDocuments.map((od,index)=>{
          odList = odList.concat(this.getODFromObj(od));
        })
      }
      this.setState({
        loadKycDetails : false,
        kycDetailsId: kycDet.kycId,
        cancelCqCopyAttachment: isEmpty(kycDet.cancelledCheque)?{attachmentId:"",fileName:""}:kycDet.cancelledCheque,
        isMSME: kycDet.isMSME,
        msmeNumber:kycDet.msmeNumber,
        msmeType:kycDet.msmeType,
        isLDC: kycDet.isLowerDeduction,
        validFrom: formatDateWithoutTime(kycDet.validFrom),
        validTo: formatDateWithoutTime(kycDet.validTo),
        ldcValue: kycDet.ldValue,
        isRelatedParty: kycDet.isRelatedParty,
        otherDocumentsList : odList
      });
      if(!isEmpty(vendor)){
        this.setState({
          panNumber: vendor.panNumber,
          isGstApplicable: vendor.isGstApplicable,
          // displayDivForGSTR:vendor.isGstApplicable?"":"none",
          gstNo: vendor.gstinNo,
          
        })
        if(!isEmpty(vendor.panCardCopy)){
          this.setState({
            panAttachment: vendor.panCardCopy
          })
        }
        if(!isEmpty(vendor.gstinCopy)){
          this.setState({
            gstAttachment: vendor.gstinCopy
          })
        }
      }
      if(!isEmpty(kycDet.gst1)){
        this.setState({
          gstrAttachment1: kycDet.gst1
        })
      }
      if(!isEmpty(kycDet.gst2)){
        this.setState({
          gstrAttachment2: kycDet.gst2
        })
      }
      if(!isEmpty(kycDet.gst3)){
        this.setState({
          gstrAttachment3: kycDet.gst3
        })
      }
      if(!isEmpty(kycDet.threeB1)){
        this.setState({
          threebAttachment1: kycDet.threeB1
        })
      }
      if(!isEmpty(kycDet.threeB2)){
        this.setState({
          threebAttachment2: kycDet.threeB2
        })
      }
      if(!isEmpty(kycDet.threeB3)){
        this.setState({
          threebAttachment3: kycDet.threeB3
        })
      }
      if(!isEmpty(kycDet.cancelledCheque)){
        this.setState({
          cancelCqCopyAttachment: kycDet.cancelledCheque
        })
      }
      if(!isEmpty(kycDet.msmeCertificate)){
        this.setState({
          msmeAttachment: kycDet.msmeCertificate
        })
      }
      if(!isEmpty(kycDet.lowerDeductionCert)){
        this.setState({
          ldcAttachment: kycDet.lowerDeductionCert
        })
      }
    }
  }
  handleGstChange=()=>{
    this.setState({
      checkedGst:true
    });
  }
  
  addOtherDocument() {
    
    let currOtherDocList = this.state.otherDocumentsList;
    let otherDocumentsArray = [
      {
        attachmentId:"",
        fileName : "",
        text : ""
      }];
      otherDocumentsArray=currOtherDocList.concat(otherDocumentsArray);
    this.setState({
      otherDocumentsList: otherDocumentsArray
    });
  }

  removeOtherDocument(i) {
    
    let otherDocumentsList = this.state.otherDocumentsList;
    otherDocumentsList.splice(i, 1);
    this.setState({ otherDocumentsList : otherDocumentsList });
  }

  setIsMSMERadio=(e)=>{
     
 this.setState({ isMSME : e.target.value });
        
  }

  setgstValue=(e)=>{

    let status = document.getElementById("processedCheckBox").checked;
     let isGstApplicable=this.state.isGstApplicable;
   if (status) {
      this.setState({
        isGstApplicable:"Y"
      })
   } else {
    this.setState({
      isGstApplicable:"N"
    })
   }

   return isGstApplicable;
  }


  render() {
  //   var GstSection = {
  //     disabled: this.state.isGstApplicable ? "true" : "false"
  // }
    return (
      <>
      {/* <Loader isLoading={this.state.isLoading} /> */}
      <div className="card mt-3">
        <div className="card-header">KYC Details</div>
        <div className="card-body">
        <FormWithConstraints  ref={formWithConstraints => this.kycDetForm = formWithConstraints} 
           onSubmit={(e)=>{this.setState({saveKycDetails:true});commonSubmitForm(e,this,"saveKYCResponse","/rest/saveKYCDetails","kycDetForm")}} noValidate > 
          {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveKYCResponse","/rest/saveKYCDetails")}}> */}
            <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId}/>
            <input type="hidden" name="kycId" value={this.state.kycDetailsId}/>
          <div className="row">
            <label className="col-sm-2">PAN No. <span className="redspan">*</span></label>
            <div className="col-sm-3">
              <input type="text" name="partner[panNumber]" id="panid1"
                className={"form-control "} readOnly={this.props.readOnly} value={this.state.panNumber} 
              onChange={(e)=>{commonHandleChange(e,this,"panNumber", "kycDetForm")}} required/>   
                  <FieldFeedbacks for="partner[panNumber]">
                      <FieldFeedback when="*"></FieldFeedback>
                      <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                      <FieldFeedback when={value => !/^([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1})+$/.test(value)}>Pan Card should be eg.ABCDF1234H</FieldFeedback>
                    </FieldFeedbacks>           
            </div>
            
            <div className="col-sm-3">  
            <div class="input-group">
              <input type="hidden" disabled={isEmpty(this.state.panAttachment.attachmentId)} name="partner[panCardCopy][attachmentId]" value={this.state.panAttachment.attachmentId} />
              {/*<input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"panAttachment", "kycDetForm")}} 
              className={"form-control "+this.props.readonly} name="panAttch" required/>*/}

              <input type="file"  onChange={(e)=>{commonHandleFileUpload(e,this,"panAttachment", "kycDetForm")}}
                className={"form-control "+this.props.readonly} name="panAttch" required />

                <div class="input-group-append">
                  <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ panAttachment: "" })}} type="button">X</Button>
                </div>
                </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.panAttachment.attachmentId}>{this.state.panAttachment.fileName}</a></div>
              <FieldFeedbacks for="panAttch">
                      <FieldFeedback when={(value)=>isEmpty(value) && isEmpty(this.state.panAttachment.attachmentId) }></FieldFeedback>
                    </FieldFeedbacks>   
            </div>
          </div>
          <br />
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                Are you GST Registered? &nbsp; &nbsp;

                  <input type="checkbox" name="partner[isGstApplicable]" className="form-check-input col-sm-4" disabled={this.props.disabled} 
                  id="processedCheckBox"
                  value={this.state.isGstApplicable}
                  onChange={(e)=>{this.setgstValue()}}
                  checked={this.state.isGstApplicable==="Y"}
                  // value={"Y"} 
                  // checked={this.state.isGstApplicable}
                  // onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isGstApplicable")}}
                  />
                
                </label>
              </div>
            </label>
            {/* <div className={"col-sm-3" + (this.state.isGstApplicable?" ":" none")} > */}
            {this.state.isGstApplicable==="Y"?
            <div className={"col-sm-6"}>
              <div className="row">
              <div class="input-group mr-4">
            <label className="mr-2">GST No. <span className="redspan">*</span></label>
              <input type="text" name="partner[gstinNo]" maxLength={15}
                className={"form-control "} readOnly={this.props.readOnly} disabled={!this.state.isGstApplicable} 
              value={this.state.gstNo}
              onChange={(e)=>{commonHandleChange(e,this,"gstNo","kycDetForm")}} required={this.state.isGstApplicable}/>
              <FieldFeedbacks for="partner[gstinNo]">
                <FieldFeedback when={(value)=>isEmpty(value) && this.state.isGstApplicable}>This field is Mandatory</FieldFeedback>
                <FieldFeedback when={(value) => !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[A-Z0-9]{2}$/.test(value)}>Enter Valid GST No eg.00ABCDE0000A0AB</FieldFeedback>
                {/* <FieldFeedback when={(value) => !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}[A-Z]{2}$/.test(value)}>Enter Valid GST eg.00ABCDE0000A0AB</FieldFeedback> */}
                {/* <FieldFeedback when={value => !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/.test(value)}>Enter Valid GST No</FieldFeedback> */}
              </FieldFeedbacks>
              </div>
            </div>
            </div>
            :""}
            {/* <div className={"row" + (this.state.isGstApplicable?" ":" none")} >    */}
            {this.state.isGstApplicable==="Y"?
            <div> 
            <div className="input-group">           
              <input type="hidden" disabled={isEmpty(this.state.gstAttachment.attachmentId)} name="partner[gstinCopy][attachmentId]" value={this.state.gstAttachment.attachmentId} />
              <input type="file" disabled={!this.state.isGstApplicable} required={this.state.isGstApplicable} 
              onChange={(e)=>{commonHandleFileUpload(e,this,"gstAttachment", "kycDetForm")}} 
                className={"form-control "+this.props.readonly} name="gstAttch"/>
                <div class="input-group-append">
                    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ gstAttachment: "" });document.getElementsByName("gstAttch")[0].value=null}} type="button">X</Button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.gstAttachment.attachmentId}>{this.state.gstAttachment.fileName}</a></div>
              <FieldFeedbacks for="gstAttch">
                <FieldFeedback when={(value)=>this.state.isGstApplicable && isEmpty(value)  && isEmpty(this.state.gstAttachment.attachmentId)}>This Field is Mandatory</FieldFeedback>
              </FieldFeedbacks> 
             
            </div>
            :""}
          </div>
         <br/>
         {/* <div className={"col-sm-3" + (this.state.isGstApplicable?" ":" none")} >   */}
         {this.state.isGstApplicable==="Y"?
         <div className={"col-sm-3"} > 
         <span>Attach last 3 filed GSTR1 & 3B details</span>
         </div>
          :""}
          {/* <table className="my-table" style={{display:this.state.isGstApplicable?"":"none"}}> */}
          {this.state.isGstApplicable==="Y"?
          <table className="my-table">
          
            <tr>
            <td className="width_100px">GSTR1</td>
            <td>
              <div className="input-group">              
              <input type="hidden" disabled={isEmpty(this.state.gstrAttachment1.attachmentId)} name ="gst1[attachmentId]" value={this.state.gstrAttachment1.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"gstrAttachment1")}} 
className={"form-control "+this.props.readonly} />
 <div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ gstrAttachment1: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.gstrAttachment1.attachmentId}>{this.state.gstrAttachment1.fileName}</a></div>
            </td>
            <td > 
              <div className="input-group">             
              <input type="hidden" disabled={isEmpty(this.state.gstrAttachment2.attachmentId)} name="gst2[attachmentId]" value={this.state.gstrAttachment2.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"gstrAttachment2")}} 
className={"form-control "+this.props.readonly} />
 <div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ gstrAttachment2: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.gstrAttachment2.attachmentId}>{this.state.gstrAttachment2.fileName}</a></div>
            </td>
            <td>   
              <div className="input-group" >          
              <input type="hidden" disabled={isEmpty(this.state.gstrAttachment3.attachmentId)} name="gst3[attachmentId]" value={this.state.gstrAttachment3.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"gstrAttachment3")}} 
className={"form-control "+this.props.readonly} />
<div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ gstrAttachment3: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.gstrAttachment3.attachmentId}>{this.state.gstrAttachment3.fileName}</a></div>
            </td>
            </tr>
          </table>
           :""} 
          
          <br />
          {/* <table className="my-table" style={{display:this.state.isGstApplicable?"":"none"}}> */}
          {this.state.isGstApplicable==="Y"?
          <table className="my-table">
            <tr>
            <td className="width_100px">3B</td>
            <td>         
              <div className="input-group" >    
              <input type="hidden" disabled={isEmpty(this.state.threebAttachment1.attachmentId)} name="threeB1[attachmentId]" value={this.state.threebAttachment1.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"threebAttachment1")}} 
className={"form-control "+this.props.readonly} />
<div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ threebAttachment1: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.threebAttachment1.attachmentId}>{this.state.threebAttachment1.fileName}</a></div>
            </td>
            <td>        
              <div className="input-group" >     
              <input type="hidden" disabled={isEmpty(this.state.threebAttachment2.attachmentId)} name="threeB2[attachmentId]" value={this.state.threebAttachment2.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"threebAttachment2")}} 
className={"form-control "+this.props.readonly} />
<div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ threebAttachment2: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.threebAttachment2.attachmentId}>{this.state.threebAttachment2.fileName}</a></div>
            </td>
            <td>   
          <div className="input-group">
              <input type="hidden" disabled={isEmpty(this.state.threebAttachment3.attachmentId)} name="threeB3[attachmentId]" value={this.state.threebAttachment3.attachmentId} />
              <input type="file" className="form-control" onChange={(e)=>{commonHandleFileUpload(e,this,"threebAttachment3")}}  />
              <div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ threebAttachment3: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.threebAttachment3.attachmentId}>{this.state.threebAttachment3.fileName}</a></div>
            </td>
          </tr>
          </table>
           :""} 
          <br />
          <div className="row">
            <div className="col-md-6 col-sm-6">
            <label className="col-sm-12">Cancelled Cheque Copy  <span className="redspan">*</span></label>
            <div className="col-sm-12">  
            <div className="input-group" >           
            

            {this.state.cancelCqCopyAttachment !== null &&
                    <>
                      <input type="hidden" disabled={isEmpty(this.state.cancelCqCopyAttachment.attachmentId)} name="cancelledCheque[attachmentId]" value={this.state.cancelCqCopyAttachment.attachmentId} />
                    </>
                  }
              {/* <input type="hidden" disabled={isEmpty(this.state.cancelCqCopyAttachment.attachmentId)} name="cancelledCheque[attachmentId]"  value={this.state.cancelCqCopyAttachment.attachmentId} /> */}
              <input type="file" name="checkvalidation" onChange={(e)=>{commonHandleFileUpload(e,this,"cancelCqCopyAttachment", "kycDetForm")}} required 
              className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ cancelCqCopyAttachment:{ attachmentId:"",fileName:"" }});document.getElementsByName("checkvalidation")[0].value=null}} type="button">X</Button>
                </div>
                </div>
              <FieldFeedbacks for="checkvalidation">
                <FieldFeedback when={(value)=>isEmpty(value) && isEmpty(this.state.cancelCqCopyAttachment.attachmentId)}></FieldFeedback>
              </FieldFeedbacks>
              {this.state.cancelCqCopyAttachment !== null &&
                    <>
                     <div><a href={API_BASE_URL+"/rest/download/"+this.state.cancelCqCopyAttachment.attachmentId}>{this.state.cancelCqCopyAttachment.fileName}</a></div>
                    </>
                  }
              {/* <div><a href={API_BASE_URL+"/rest/download/"+this.state.cancelCqCopyAttachment.attachmentId}>{this.state.cancelCqCopyAttachment.fileName}</a></div> */}
            </div>
            </div>
            </div>
            <br/>

                <label className="col-sm-12">
                <label>
                 
                 Are you UDYAM Registered?<span className="redspan">*</span> &nbsp; &nbsp;&nbsp;
                
                 </label>
                 <label className="form-check-label">Yes</label>
                <input type="radio" id="isMSMEYES" className="form-check-input ml-4" 
                disabled={this.props.disabled} 
                  value={'Y'} required
                  checked={this.state.isMSME==="Y"}
                  name="isMSME"
                 onChange={(e) => {
                  commonHandleChange(e, this, "isMSME", "kycDetForm");
                }}
                />
                &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
               <label className="form-check-label">NO</label>
                <input type="radio" id="isMSMENO" name="isMSME" className="form-check-input ml-4" 
                disabled={this.props.disabled} 
                 value={"N"}   required
                
                 checked={this.state.isMSME==="N"}
                  onChange={(e) => {
                commonHandleChange(e, this, "isMSME", "kycDetForm");
              }}
               
                 />

              
              {/* </div> */}
             {/* { this.state.isMSME===""? */}
              <FieldFeedbacks for="isMSME">
                    <FieldFeedback when="*"></FieldFeedback>
                     <FieldFeedback when={(value)=>isEmpty(value) && isEmpty(this.state.isMSME)}>Please Select One Value</FieldFeedback>
                  </FieldFeedbacks>
                  {/* :""} */}
             </label>
            {/* </label> */}
            {/* <div className={"col-sm-12" + (this.state.isMSME?" ":" none")} >   */}
            <div className="row">
           { this.state.isMSME==="Y"? <><div className="input-group col-sm-2 mt-2">
         <input type="hidden" disabled={!this.state.isMSME || isEmpty(this.state.msmeAttachment.attachmentId)} name="msmeCertificate[attachmentId]" value={this.state.msmeAttachment.attachmentId} />
             <input type="file" id="msmeCertiid" name="msmeCert" disabled={!this.state.isMSME} onChange={(e)=>{commonHandleFileUpload(e,this,"msmeAttachment","kycDetForm"); }}
              className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ msmeAttachment: "" });document.getElementsByName("msmeCert")[0].value=null;}} type="button">X</Button>
                </div>
              </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.msmeAttachment.attachmentId}>{this.state.msmeAttachment.fileName}</a></div>
              <FieldFeedbacks for="msmeCert">
                <FieldFeedback when={(value)=>this.state.isMSME && isEmpty(value) && isEmpty(this.state.msmeAttachment.attachmentId)}>This field is Mandatory</FieldFeedback>

              </FieldFeedbacks></>:""}
            {/* </div> */}
            <br />
            {/* <div className={"col-sm-12"+ (this.state.isMSME?" ":" none")}> */}
            {/* <label className="col-sm-6">MSME No. <span className="redspan">*</span></label> */}
            { this.state.isMSME==="Y"?
            // <div className={"col-sm-12 display_inline_flex" }>
          
          <>
                      {/* <div className={"col-sm-12 display_inline_flex" }> */}
                      <label className="col-sm-2">UDYAM No.<span className="redspan">*</span></label>
                      <div className="col-sm-3">
                        <input type="text" name="msmeNumber" id="msmeNo" maxLength={19}
                          //placeholder={"eg.MH140001000"}
                          placeholder={"eg.UDYAM-XX-00-0000000"}
                          className={"form-control inline-block "} readOnly={this.props.readOnly} value={this.state.msmeNumber} disabled={!this.state.isMSME}
                          onChange={(e) => { commonHandleChange(e, this, "msmeNumber", "kycDetForm"); } }
                          required={this.state.isMSME} />
                        {/* <FieldFeedbacks for="msmeNumber">
      <FieldFeedback when="*">This field is Mandatory</FieldFeedback>
      <FieldFeedback when={value => !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/.test(value)}>Enter Valid MSME No</FieldFeedback>
    </FieldFeedbacks> */}
                        <FieldFeedbacks for="msmeNumber">
                          <FieldFeedback when="*"></FieldFeedback>
                          <FieldFeedback when="patternMismatch">Pattern Mismatch</FieldFeedback>
                          <FieldFeedback when={value => !/^([UDYAM]{5}[-]{1}[A-Z]{2}[-]{1}[0-9]{2}[-]{1}[0-9]{7})+$/.test(value)}>UDYAM NO should be eg.UDYAM-XX-00-0000000</FieldFeedback>

                        </FieldFeedbacks>
                      </div></>
              // </div>
              :""}
              {this.state.isMSME==="Y"?
              <><label className="form-check-label">
                  MSME Type<span className="redspan">*</span></label><div className="col-sm-2">
                    <select className={"form-control"} name="msmeType" value={this.state.msmeType}
                    
                    onChange={(e)=>{commonHandleChange(e,this,"msmeType", "kycDetForm");}} required> 
                      <option value="">Select</option>
                      <option value="MI">MI-Micro</option>
                      <option value="ME">ME-Medium</option>
                      <option value="SM">SM-Small</option>
                    </select>
                    <FieldFeedbacks for="msmeType">
                    <FieldFeedback when="*"></FieldFeedback>
                <FieldFeedback when={(value)=>this.state.isMSME && isEmpty(value)}>This field is Mandatory</FieldFeedback>
              </FieldFeedbacks>
                  </div></>:""}
                  </div>
              {/* </div> */}
          {/* </div> */}
          
        
          {/* <div className="row">
            <label className="col-sm-2">
              <div className="">
                <label className="form-check-label">
                 
                  Are you MSME Registered? &nbsp;
                 <input type="checkbox" name="isMSME" className="form-check-input ml-4" disabled={this.props.disabled} 
                  value={"Y"} checked={this.state.isMSME} 
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isMSME","kycDetForm");this.clearMSMEField(this.kycDetForm)}}/>
                </label>
              </div>
            </label>
            <div className={"col-sm-3" + (this.state.isMSME?" ":" none")} >  
            <div className="input-group" >           
              <input type="hidden" disabled={!this.state.isMSME || isEmpty(this.state.msmeAttachment.attachmentId)} name="msmeCertificate[attachmentId]" value={this.state.msmeAttachment.attachmentId}  />
              <input type="file" id="msmeCertiid" name="msmeCert" disabled={!this.state.isMSME}  onChange={(e)=>{commonHandleFileUpload(e,this,"msmeAttachment","kycDetForm")}} 
              className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ msmeAttachment: "" });document.getElementsByName("msmeCert")[0].value=null}} type="button">X</Button>
                </div>
              </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.msmeAttachment.attachmentId}>{this.state.msmeAttachment.fileName}</a></div>
              <FieldFeedbacks for="msmeCert">
                <FieldFeedback when={(value)=>this.state.isMSME && isEmpty(value) && isEmpty(this.state.msmeAttachment.attachmentId)}>This field is Mandatory</FieldFeedback>
               
              </FieldFeedbacks>
            </div>
            <br />
            <div className={"col-sm-6"+ (this.state.isMSME?" ":" none")}>
            <div className={"col-sm-5 display_inline_flex" }>
          <label className="col-sm-6">MSME No. <span className="redspan">*</span></label>
            <div className=""> 
              <input type="text" name="msmeNumber" id="msmeNo"
              className={"form-control col-sm-12 "+this.props.readonly} value={this.state.msmeNumber} disabled={!this.state.isMSME}
              onChange={(e)=>{commonHandleChange(e,this,"msmeNumber", "kycDetForm")}}  required={this.state.isMSME}/>  
              <FieldFeedbacks for="msmeNumber">
                <FieldFeedback when="*">This field is Mandatory</FieldFeedback>
                <FieldFeedback when={value => !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/.test(value)}>Enter Valid MSME No</FieldFeedback>
              </FieldFeedbacks>  
              </div>
              </div>
              </div>
          </div>
           */}
              <hr/>
          <div className="row">
            <label className="col-sm-3">
              <div className="">
                <label className="form-check-label">
                  {}
                  Is your organisation has Lower Tax Deduction Certificate 
                  <input type="checkbox" className="form-check-input ml-4" 
                  name="isLowerDeduction" value={"Y"} checked={this.state.isLDC} 
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isLDC")}}/>
                </label>
              </div>
            </label>
           {/* {this.state.isLDC &&  */}
          <div style={{display: this.state.isLDC ? 'flex':'none'}}>
           <div className="col-sm-3">  
            <div className="input-group">            
              <input type="hidden" disabled={isEmpty(this.state.ldcAttachment.attachmentId)} name="lowerDeductionCert[attachmentId]" value={this.state.ldcAttachment.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"ldcAttachment")}} 
className={"form-control "+this.props.readonly} />
 <div class="input-group-append">
    <Button class="btn btn-danger clearFile" onClick={() => {this.setState({ ldcAttachment: "" })}} type="button">X</Button>
  </div>
  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.ldcAttachment.attachmentId}>{this.state.ldcAttachment.fileName}</a></div>
            </div>
            <label className="">Valid From</label>
            <div className="col-sm-3">
              <input type="date" value={this.state.validFrom} name="validFrom" 
className={"form-control "} 
              onChange={(e)=>{commonHandleChange(e,this,"validFrom")}}/>
            </div>
          </div>
            {/* } */}
          </div>
          {/* {this.state.isLDC && */}
           <div className="row" style={{display:this.state.isLDC ? 'flex':'none'}}>
            <label className="col-sm-2">Valid To</label>
            <div className="col-sm-3">
            <input type="date" value={this.state.validTo} name="validTo" 
className={"form-control "} 
              onChange={(e)=>{commonHandleChange(e,this,"validTo")}}/>
            </div>
            <label className="col-sm-2">Value</label>
            <div className="col-sm-3">
              <input type="text" name="ldValue" value={this.state.ldcValue} 
className={"form-control "} readOnly={this.props.readOnly}
              onChange={(e)=>{commonHandleChange(e,this,"ldcValue")}}/>
            </div>
          </div>
          {/* } */}
          <hr/>
          <div className="row">
            <label className="col-sm-2">Is your organization Related Party?</label>
            <div className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isRelatedParty"
                  value={"Y"} checked={this.state.isRelatedParty} 
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isRelatedParty")}}/>
                </label>
              </div>
            </div>
          </div>
          <br />
          {/* {this.state.isRelatedParty &&  */}
          <div className="row" style={{display: this.state.isRelatedParty ? 'flex':'none'}}>
          {this.state.otherDocumentsList.map((el, i) => (
            <>
            <label className="col-sm-2">{i===0?"Other Documents":""}</label>
            <div className="col-sm-3"> 
            <div className="input-group">         
              <input type="hidden"  disabled={isEmpty(this.state.otherDocumentsList[i].attachmentId)} name={"otherDocuments["+i+"][attachmentdetails][attachmentId]"} value={this.state.otherDocumentsList[i].attachmentId} />
              <input type="hidden"  disabled={isEmpty(this.state.otherDocumentsList[i].attachmentId)} name={"otherDocuments["+i+"][attachmentdetails][fileName]"} value={this.state.otherDocumentsList[i].fileName} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"otherDocumentsList."+i+"")}} 
                className={"form-control "+this.props.readonly} />
                <div class="input-group-append">
                    <Button class="btn btn-danger clearFile" onClick={() => {}} type="button">X</Button>
                </div>
                </div>
              <div><a href={"/rest/download/"+this.state.otherDocumentsList[i].attachmentId}>{this.state.otherDocumentsList[i].fileName}</a></div>
              
             </div>
            <div className="col-sm-3">
              <input type="text" 
            className={"form-control "} readOnly={this.props.readOnly} name={"otherDocuments["+i+"][description]"} value={this.state.otherDocumentsList[i].text} 
            onChange={(e)=>{commonHandleChange(e,this,"otherDocumentsList."+i+".text")}}/>              
            </div>
            <div className="col-sm-3"><Button size="small" variant="contained" color="secondary"onClick={() => {i===0?this.addOtherDocument():this.removeOtherDocument(""+i+"")}} type="button">
                 <i class={"fa "+(i===0?"fa-plus":"fa-minus")} aria-hidden="true"></i>
               </Button>  
             </div>
             </>
          ))}
          </div>
          {/* } */}
          <div className={"col-sm-12 text-center mt-2 " + this.props.displayDiv}>
                  <Button size="small" variant="contained" color="primary" type="submit" className="mr-1">Save</Button>
                  <Button type="button" size="small" variant="contained" color="secondary" className="mr-1" onClick={()=>{ this.resetKycDetailsForm(this.kycDetForm)}}>Cancel</Button>                  
            </div>
          </FormWithConstraints>
        </div>
      </div>
      </>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.kycInfo;
};
export default connect (mapStateToProps,actionCreators)(KycDetails);