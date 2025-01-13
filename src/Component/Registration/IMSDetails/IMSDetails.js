import React, { Component } from "react";
import { API_BASE_URL } from "../../../Constants";
import {connect} from 'react-redux';
import {formatDateWithoutTime} from "../../../Util/DateUtil";
import { isEmpty} from "../../../Util/validationUtil";
import * as actionCreators from "../../Registration/IMSDetails/Action";
import { 
    commonHandleFileUpload, commonSubmitForm, commonHandleChangeCheckBox, 
    commonHandleChange, commonSubmitWithParam, swalPrompt, resetForm} from "../../../Util/ActionUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import swal from "sweetalert";


class IMSDetails extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      imsId: "",
      imsDetails: "",
      isRawMaterial: false,
      isInProcess: false,
      isFinishedProduct: false,
      inspectionStandard: "",
      inspectionStandardList : [],
      majorTestingInstru : "",
      isFCRM : false,
      isISIApproved : false,
      isISOCertified : false,
      isISO14001 : false,
      iso14001ValidUpto : "",
      iso14001Attachment:{
        attachmentId:"",
        fileName:""
      },
      isISO9001 : false,
      iso9001ValidUpto : "",
      iso9001Attachment:{
        attachmentId:"",
        fileName:""
      },
      isISO50001 : false,
      iso50001ValidUpto : "",
      iso50001Attachment:{
        attachmentId:"",
        fileName:""
      },
      isOHSMS45001:false,
      ohsms45001ValidUpto:"",
      ohsms45001Attachment:{
        attachmentId:"",
        fileName:""
      },
      isRCLogo : false,
      isRCLogoValidUpto : "",
      isRCLogoAttachment:{
        attachmentId:"",
        fileName:""
      }
    }
  }
 
  submitConfirmation = () =>{
    commonSubmitWithParam(this.props,"submitRegistrationResponse","/rest/submitRegistration",this.props.partner.partnerId)
    
  }

  async componentDidMount(){
    commonSubmitWithParam(this.props,"getIMSDetailsResponse","/rest/getIMSDetails",this.props.partner.partnerId);
  }

  async componentWillReceiveProps(props){
    if(!isEmpty(props.imsId)){
      this.setState({
        imsId: props.imsId
      })
    }
    if(!isEmpty(props.inspectionStandardList)){
      let inspectionStandardArray = Object.keys(props.inspectionStandardList).map((key) => {
        return {display: props.inspectionStandardList[key], value: key}
      });
      this.setState({
        inspectionStandardList: inspectionStandardArray
      })
    }
    if(!isEmpty(props.imsDetails)){
      let imsDetails = props.imsDetails;
      // console.log(imsDetails);
      this.setState({
        imsId: imsDetails.imsId,
        isRawMaterial: imsDetails.isRawMaterial==="Y",
        isInProcess: imsDetails.isInProcess==="Y",
        isFinishedProduct: imsDetails.isFinishedProduct==="Y",
        inspectionStandard: imsDetails.inspectionStandard,
        majorTestingInstru : imsDetails.majorTestingInstru,
        isFCRM : imsDetails.isFCRM==="Y",
        isISIApproved : imsDetails.isISIApproved==="Y",
        isISOCertified : imsDetails.isISOCertified==="Y",
        isISO14001 : imsDetails.isISO14001==="Y",
        iso14001ValidUpto : formatDateWithoutTime(imsDetails.iso14001ValidUpto),
        isISO9001 : imsDetails.isISO9001==="Y",
        iso9001ValidUpto : formatDateWithoutTime(imsDetails.iso9001ValidUpto),
        isISO50001 : imsDetails.isISO50001==="Y",
        iso50001ValidUpto : formatDateWithoutTime(imsDetails.iso50001ValidUpto),
        isOHSMS45001:imsDetails.isOHSMS45001==="Y",
        ohsms45001ValidUpto:formatDateWithoutTime(imsDetails.ohsms45001ValidUpto),
        isRCLogo : imsDetails.isRCLogo==="Y",
        isRCLogoValidUpto : formatDateWithoutTime(imsDetails.isRCLogoValidUpto)
      })
      if(!isEmpty(imsDetails.iso14001Attachment)){
        this.setState({
          iso14001Attachment:imsDetails.iso14001Attachment
        });
      }
      if(!isEmpty(imsDetails.iso9001Attachment)){
        this.setState({
          iso9001Attachment:imsDetails.iso9001Attachment
        });
      }
      if(!isEmpty(imsDetails.iso50001Attachment)){
        this.setState({
          iso50001Attachment:imsDetails.iso50001Attachment
        });
      }
      if(!isEmpty(imsDetails.ohsms45001Attachment)){
        this.setState({
          ohsms45001Attachment:imsDetails.ohsms45001Attachment
        });
      }

      if(!isEmpty(imsDetails.isRCLogoAttachment)){
        this.setState({
          isRCLogoAttachment:imsDetails.isRCLogoAttachment
        });
      }
    }
  }

  submitForm = (e) => {
    commonSubmitForm(e,this,"saveIMSDetailsResponse","/rest/saveIMSDetails")
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">IMS Details</div>
        <div className="card-body">
        <FormWithConstraints  ref={formWithConstraints => this.forms = formWithConstraints} 
           onSubmit={this.submitForm} noValidate > 
          {/* <form onSubmit={(e)=>{commonSubmitForm(e,this.props,"saveIMSDetailsResponse","/rest/saveIMSDetails")}}> */}
            <input type="hidden" name="partner[bPartnerId]" value={this.props.partner.partnerId} />
            <input type="hidden" name="partner[isProfileUpdated]" value={this.props.partner.isProfileUpdated} />
            <input type="hidden" name="imsId" value={this.state.imsId} />
            <span>Details of Quality Assurance System being followed by Organization </span><br/><br/>
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isRawMaterial" value="Y"
                  checked={this.state.isRawMaterial}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isRawMaterial")}} />
                  Raw Material Inspection Records Maintained
                </label>
              </div>
            </label>
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isInProcess" value="Y"
                  checked={this.state.isInProcess}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isInProcess")}} />
                 In-process Inspection Records Maintained
                </label>
              </div>
            </label>
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isFinishedProduct" value="Y" 
                  checked={this.state.isFinishedProduct}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isFinishedProduct")}} />
                 Finished Product Inspection Records Maintained
                </label>
              </div>
            </label>
          </div>
          <br /> 
          <div className="row">
            <label className="col-sm-2">Methods Of Inspection Standard </label>
            <div className="col-sm-3">
              <select className={"form-control "+this.props.readonly} name="inspectionStandard" value={this.state.inspectionStandard}  onChange={(e)=>{commonHandleChange(e,this,"inspectionStandard")}}>
                <option> Select </option>
                {
                  this.state.inspectionStandardList.map(inspectionStd=>
                    <option value={inspectionStd.value}> {inspectionStd.display} </option>
                  )
                }
              </select>
            </div>
            {/* <label className="col-sm-2">Major Instruments For Testing</label> */}
            {/* <div className="col-sm-3">
              <input type="text" className={"form-control "+this.props.readonly} name="majorTestingInstru"
              value={this.state.majorTestingInstru} 
              onChange={(e)=>{commonHandleChange(e,this,"majorTestingInstru")}} /> */}
            {/* </div> */}
          </div>
          <br />
          {/* <label className="">Major Instruments For Testing</label> */}
          <span>Major Instruments For Testing</span><br/><br/>
          <div className="row">
            <label className="col-sm-3">
            
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isFCRM" value="Y" 
                  checked={this.state.isFCRM} 
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isFCRM")}} />
                  Frequency Of Calibration Records Maintained
                </label>
              </div>
            </label>
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isISIApproved" value="Y" 
                  checked={this.state.isISIApproved}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isISIApproved")}} />
                  Whether Product Being Supplied Is ISI Approved
                </label>
              </div>
            </label>
            <label className="col-sm-3">
              {/* <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isISOCertified" value="Y"
                  checked={this.state.isISOCertified}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isISOCertified")}} />
                  Whether Company Has ISO Certifications
                </label>
              </div> */}
            </label>
          </div>
          <br />
          <span>Whether Company Has ISO Certifications</span><br/><br/>
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} name="isISO14001" value="Y" 
                  checked={this.state.isISO14001}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isISO14001")}} />
                  
                  ISO 14001:2015 
                </label>
               
              </div>
            </label>
            <label className="col-sm-1">Valid Upto</label>
            <div className="col-sm-3">
              <input type="date" className={"form-control "} name="iso14001ValidUpto" 
              value={this.state.iso14001ValidUpto}
              onChange={(e)=>{commonHandleChange(e,this,"iso14001ValidUpto")}} />
              
            </div>
            <div className="col-sm-3 ">  
            <div className="display_inline_flex">            
              <input type="hidden" disabled={isEmpty(this.state.iso14001Attachment.attachmentId)}  name="iso14001Attachment[attachmentId]" value={this.state.iso14001Attachment.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"iso14001Attachment")}} className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <button class="btn btn-danger clearFile" onClick={() => {this.setState({ iso14001Attachment: "" })}} type="button">X</button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.iso14001Attachment.attachmentId}>{this.state.iso14001Attachment.fileName}</a></div>

            </div>
          </div>
          <br />
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} value="Y" name="isISO9001"
                  checked={this.state.isISO9001} 
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isISO9001")}} />
                  ISO 9001:2015 
                </label>
              </div>
            </label>
            <label className="col-sm-1">Valid Upto</label>
            <div className="col-sm-3">
              <input type="date" className={"form-control "} name="iso9001ValidUpto" 
              value={this.state.iso9001ValidUpto} 
              onChange={(e)=>{commonHandleChange(e,this,"iso9001ValidUpto")}} />
            </div>
            <div className="col-sm-3 ">   
            <div className="display_inline_flex">         
              <input type="hidden" disabled={isEmpty(this.state.iso9001Attachment.attachmentId)} name="iso9001Attachment[attachmentId]" value={this.state.iso9001Attachment.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"iso9001Attachment")}} className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <button class="btn btn-danger clearFile" onClick={() => {this.setState({ iso9001Attachment: "" })}} type="button">X</button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.iso9001Attachment.attachmentId}>{this.state.iso9001Attachment.fileName}</a></div>
            </div>
          </div>
          <br />
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} value="Y" name="isISO50001"
                  checked={this.state.isISO50001}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isISO50001")}}  />
                 ISO 50001:2018
                </label>
              </div>
            </label>
            <label className="col-sm-1">Valid Upto</label>
            <div className="col-sm-3">
              <input type="date" className={"form-control "} name="iso50001ValidUpto" 
              value={this.state.iso50001ValidUpto}
              onChange={(e)=>{commonHandleChange(e,this,"iso50001ValidUpto")}} />
            </div>
            <div className="col-sm-3 ">            
            <div className="display_inline_flex">
              <input type="hidden" disabled={isEmpty(this.state.iso50001Attachment.attachmentId)} name="iso50001Attachment[attachmentId]" value={this.state.iso50001Attachment.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"iso50001Attachment")}} className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <button class="btn btn-danger clearFile" onClick={() => {this.setState({ iso50001Attachment: "" })}} type="button">X</button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.iso50001Attachment.attachmentId}>{this.state.iso50001Attachment.fileName}</a></div>
            </div>
          </div>
          <br />

          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} value="Y" name="isOHSMS45001"
                  checked={this.state.isOHSMS45001}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isOHSMS45001")}}  />
                 OHSMS 45001:2018
                </label>
              </div>
            </label>
            <label className="col-sm-1">Valid Upto</label>
            <div className="col-sm-3">
              <input type="date" className={"form-control "} name="ohsms45001ValidUpto" 
              value={this.state.ohsms45001ValidUpto}
              onChange={(e)=>{commonHandleChange(e,this,"ohsms45001ValidUpto")}} />
            </div>
            <div className="col-sm-3 ">  
            <div className="display_inline_flex">          
              <input type="hidden" disabled={isEmpty(this.state.ohsms45001Attachment.attachmentId)} name="ohsms45001Attachment[attachmentId]" value={this.state.ohsms45001Attachment.attachmentId} />
              <input type="file" onChange={(e)=>{commonHandleFileUpload(e,this,"ohsms45001Attachment")}} className={"form-control "+this.props.readonly} />
              <div class="input-group-append">
                  <button class="btn btn-danger clearFile" onClick={() => {this.setState({ ohsms45001Attachment: "" })}} type="button">X</button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.ohsms45001Attachment.attachmentId}>{this.state.ohsms45001Attachment.fileName}</a></div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-3">
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" disabled={this.props.disabled} value="Y" name="isRCLogo"
                  checked={this.state.isRCLogo}
                  onChange={(e)=>{commonHandleChangeCheckBox(e,this,"isRCLogo")}} />
                 Is your organization Responsible Care Logo holder or Signatory to  Responsible Care? 
                </label>
              </div>
            </label>
            <label className="col-sm-1">Valid Upto</label>
            <div className="col-sm-3">
              <input type="date" className={"form-control "} name="isRCLogoValidUpto" 
              value={this.state.isRCLogoValidUpto} 
              onChange={(e)=>{commonHandleChange(e,this,"isRCLogoValidUpto")}} />
            </div>
            <div className="col-sm-3 ">    
            <div className="display_inline_flex">        
              <input type="hidden" disabled={isEmpty(this.state.isRCLogoAttachment.attachmentId)} value={this.state.isRCLogoAttachment.attachmentId} name="isRCLogoAttachment[attachmentId]" />
              <input type="file" className={"form-control "+this.props.readonly} 
              onChange={(e)=>{commonHandleFileUpload(e,this,"isRCLogoAttachment")}} />
              <div class="input-group-append">
                  <button class="btn btn-danger clearFile" onClick={() => {this.setState({ isRCLogoAttachment: "" })}} type="button">X</button>
                  </div>
                  </div>
              <div><a href={API_BASE_URL+"/rest/download/"+this.state.isRCLogoAttachment.attachmentId}>{this.state.isRCLogoAttachment.fileName}</a></div>
            </div>           
          </div>
          <div className={"col-sm-12 text-center mt-3 " + this.props.displayDiv}>
                  <button type="submit" className="btn btn-success mr-1">Save</button>
                  
                  <button type="button" className="btn btn-danger mr-1"  onClick={()=>{commonSubmitWithParam(this.props,"getIMSDetailsResponse","/rest/getIMSDetails",this.props.partner.partnerId); resetForm(this.forms)}}>Cancel</button>                  
           
          </div>
          <div className={"col-sm-12 text-center mt-3 "+ this.props.displayDiv}>
          <button type="button" className="btn btn-primary mr-1"
                  onClick={(e)=>swalPrompt(e,this,"submitConfirmation","","I declare that the information furnished above is correct to the best of my knowledge.","I Agree","Disagree")}>Submit</button>
                  
          </div>
            </FormWithConstraints>
        </div>
      </div>

    );
  }
}


const mapStateToProps=(state)=>{
  return state.imsInfo;
};
export default connect (mapStateToProps,actionCreators)(IMSDetails);