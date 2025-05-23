import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmptyDeep,isEmpty } from "../../../Util/validationUtil";
import {groupBy,includes} from 'lodash-es';
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_BUYER_ADMIN } from "../../../Constants/UrlConstants";
import {
  commonHandleChangeCheckBox,
  showAlertAndReload,showAlert,
  commonHandleChange,
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import { submitForm } from "../../../Util/APIUtils";
import { formatDateWithoutTimeNewDate2 } from "../../../Util/DateUtil";
import * as actionCreators from "../PRList/Action/Action";
import { connect } from "react-redux";
import { API_BASE_URL } from "../../../Constants";
import { Button } from "@material-ui/core";

class PRListBuyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems:[],
      selectedItem:{
        requestedBy:{},
        approver:{},
        tcApprover:{},
        approvedBy:{},
        createdBy:{}
      },
      readonly:false,
      technicalReadOnly:false,
      prLineArray:[],
      prList:[],
      checked:false,
      loadGetDocuments:false,
      getDocuments:[]
    };
  }

  onChecked = (key) => {
    let {checkedItems} = this.state;
    let index = checkedItems.findIndex(c => c == key)
    if(index != -1) checkedItems.splice(index)
    else checkedItems.push(key)
    this.setState({checkedItems});
  }

  onSubmit = (e) => {
    let {checkedItems,prList} = this.state;
    let data = [];
    if(isEmptyDeep(checkedItems)) return ;
    checkedItems.map((item) => {
      let items = prList[item];
      if(!isEmptyDeep(items)){
        items = items.map(li => {
          let itm = {prLineId:li.prId,pr:{prId:li.pr.prId},deliverDate:li.deliverDate,requiredDate:li.requiredDate,prLineNumber: li.prLineNumber,quantity: li.reqQty}
          if(!isEmptyDeep(li.buyer)){
            itm = { ...itm,buyer:{userId:Number(li.buyer.userId)}}
          }
          return itm;
        });
        data = data.concat(items)
      }
      return item;
    });
    submitForm(data,'/rest/updatePRBuyerAssignNew')
    .then(res => {
      if(res.success){
        this.setState({checkedItems:[]})
        showAlertAndReload(!res.success,res.message);
      }else{
        showAlert(true,res.message)
      }
    }).catch(err => {
      showAlert(err.success,err.message)
    });
  }

  getDocuments =()=>{
    debugger
    commonSubmitWithParam(this.props, "getDocuments", "/rest/getAttachmentbyPrId", this.state.selectedItem.pr?.prId);
    this.setState({loadGetDocuments:true})
  }

  setGetDocuments=props=>{
    let tempOtherDocumentsList=[];
    if(props.documents && props.documents.objectMap){
      props.documents.objectMap.attachmentList.map((el,i)=>{
        tempOtherDocumentsList.push(this.getOtherDocuments(el));
      })
      this.setState({
        getDocuments:tempOtherDocumentsList,
        loadGetDocuments:false
      })
    }
  }

  getEmptyDocObj=()=>{
    return {
      prAttachmentId:"",
      attachment:{
        attachmentId: "",
        fileName: "",
        text:""
      },
      pr:{
        prId:""
      },
      istc:""
    }
  }

  getOtherDocuments=el=>{
    if(!isEmpty(el)){
      return el;
    }else{
      this.getEmptyDocObj()
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({prList: nextProps.prList})
    
    if(this.state.loadGetDocuments && !isEmpty(nextProps.documents)){
      this.props.changeLoaderState(false);
      this.setGetDocuments(nextProps); 
    }else{
      this.props.changeLoaderState(false);
    }
  }

  closeModal = () => {
    this.props.disabledLoading()
  }
  commonHandleChange(event,keyName,index){
    let {prList} = this.state;
    if(keyName == 'buyer'){
      let val = event.target.value;
      let buyer = null;
      if(!includes(['',null,undefined],val)) buyer = {userId: val};
      prList[index] = {
        ...prList[index],
        buyer
      }
    }else{
      prList[index] = {
        ...prList[index],
        [keyName]:event.target.value
      }
    }
    this.setState({prList})
  }

  

  handleSelect = (item) => {
    
    if(!isEmptyDeep(item.pr)){
      commonSubmitWithParam(this.props,"getPRLines","/rest/getPRLinebyPrId",item.pr.prId); 
    }
   this.setState({selectedItem:item})
  }

  getHiddenFields = (prLine, index) => {
    if(isEmptyDeep(prLine)) return ;

    return (
        <>
            <input
                type="hidden"
                name={"itemBidList[" + index + "][prLine][prLineId]"}
                value={prLine.prLineId}
               
                disabled={ !prLine.isChecked }
            />
              <input
                type="hidden"
                name={"itemBidList[" + index + "][quantity]"}
                value={prLine.reqQty}
                
                disabled={ !prLine.isChecked }
            />
        </>
    )
}

toggleChecked = (e) => {
  let {checked} = e.target;
  const groupByList = this.state.prList.map(item => ({...item,isChecked:checked}));
  this.setState({checked,prList:groupByList})
}
validateSelectVendor =()=>{
  let validate = false;
  for (let index = 0; index < this.state.prList.length; index++) {
    const element = this.state.prList[index];
    if(element.isChecked){
      validate = true
      break;
    }
  }
  return validate;
}
  render() {
    const groupByList = this.state.prList;
    if(this.props.role != ROLE_BUYER_ADMIN) return null
    return (
      <> 


<div className="modal" id="viewPrDetail" style={{marginTop:50}}>



<div className="modal documentModal" id="documentModal" >
<div className="modal-dialog mt-100" style={{width:"800px", maxWidth:"800px"}}>
<div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
                <div className="modal-header">
                  Other Documents ffff
                  <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal">
                  &times;
                </button>
                </div>
                <div className={"modal-body "+ this.props.readonly}>
                    <div className={"row mt-1 px-4 py-1 "}>
                  <div className="col-sm-2">
                    <span>Technical Document</span>
                  </div>
                </div>
                    <div className="row mt-1 px-4 py-1">
                {this.state.getDocuments.map((el, i) => (
                  <>
                    <div className="col-sm-5">
                      <div>
                        <a
                          href={
                            API_BASE_URL +"/rest/download/" +
                            el.attachment.attachmentId
                          }
                        >
                          {el.attachment.fileName}
                        </a>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className={
                          "form-control height_40px " + this.props.readonly
                        }
                        name={"otherDocuments[" + i + "][description]"}
                        value={el.description}
                      />
                    </div>
                  </>
                ))}
                </div>
                </div>
              </div>
            </div>
          </div>



    <div className="modal-dialog modal-dialog-centered modal-xl" style={{width:"800px", maxWidth:"800px", marginTop:"80px"}}>
      <div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
        <div className="modal-header">
          <h4 className="modal-title">PR Detail</h4>
          <button type="button" className="close" data-dismiss="modal" onClick={this.closeModal}>&times;</button>
        </div>
        <div className="modal-body">
     { !isEmptyDeep(this.state.selectedItem) && 
        <div>
        <div className="card my-2">

        <div className="row mt-0 px-4 pt-1">
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">PR Type</label>
            <span className="display_block">
              {this.state.selectedItem.pr?.docType}
            </span>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">PR No. & Date</label>
            <span className="display_block">
              {this.state.selectedItem.prNumber + " - "+ formatDateWithoutTimeNewDate2(this.state.selectedItem.pr?.date)}
            </span>
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <label className="mr-4 label_12px">Created By</label>
            <span className="display_block">
            {!isEmptyDeep(this.state.selectedItem.releasedBy) ? this.state.selectedItem.releasedBy.userName + " - "+ this.state.selectedItem.releasedBy.name:'-'}
            {/* {!isEmptyDeep(this.state.selectedItem.pr?.createdBy) ? this.state.selectedItem.pr.createdBy.userName + " - "+ this.state.selectedItem.pr.createdBy.name:'-'} */}
            {/* {!isEmptyDeep(this.state.selectedItem.pr?.requestedBy) ? this.state.selectedItem.pr.requestedBy.userName + " - "+ this.state.selectedItem.pr.requestedBy.name:'-'} */}
            </span>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">Techno/Comm</label>
            <input type="checkbox" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.selectedItem.pr?.isTC} onChange={(e) => { 
              // commonHandleChangeCheckBox(e, "selectedItem.isTC")
              }}/>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <button onClick={this.getDocuments}  className={"btn btn-sm btn-outline-primary mgt-10 "+ this.props.readonly} type="button" data-toggle="modal" data-target="#documentModal"><i className="fa fa-file" />&nbsp;Documents</button>
          </div>
        </div>
        <div className="row mt-0 px-4 pt-1">
          <div className="col-12 col-md-2 col-lg-2">
            <div className="form-group">
              <label className="mr-2 label_12px">Priority</label>
              <input
                type="hidden"
                name="priority"
                disabled={isEmpty(
                  this.state.selectedItem.priority
                )}
                value={this.state.selectedItem.priority}
              />
              <select
                className={"form-control " + this.state.priorityReadOnly}
                value={this.state.selectedItem.priority}
                defaultValue={"LOW"}
                // onChange={(event) =>
                //   this.commonHandleChange(
                //     event,
                    
                //     "selectedItem.priority"
                //   )
                // }
              >
                {this.props.priorityList.map(records=>
                  <option value={records.value}>{records.display}</option>
                )}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">Status</label>
            <span className="display_block">
              {this.props.prStatusList[this.state.selectedItem.status]}
            </span>
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <label className="mr-4 label_12px">Header Text</label>
            <span className="display_block">
     {console.log(this.state.selectedItem,"assaasasas")}
            <textarea
              className={"h-50px form-control " + this.state.prLineReadOnly}
              value={!isEmpty(this.state.selectedItem)?this.state.selectedItem.headerText:""}
            />
            </span>
          </div>
          {/* <div className="col-12 col-md-4 col-lg-4">
            <div className="form-group">
              <label className="mr-1 label_12px">Approver</label>
              <span className="display_block">
                { !isEmptyDeep(this.state.selectedItem.approver) ? this.state.selectedItem.approver.empCode + " - " + this.state.selectedItem.approver.name:'-'}
              </span>
            </div>
          </div> */}
          <div className="col-12 col-md-4 col-lg-4">
            <div className="form-group">
              <label className="mr-2 label_12px">Technical Approver</label>
             {!isEmptyDeep(this.state.selectedItem.pr?.tcApprover) &&  <input
                type="hidden"
                name="tcApprover[userId]"
                disabled={isEmpty(
                  this.state.selectedItem.pr?.tcApprover.userId
                )}
                value={this.state.selectedItem.pr?.tcApprover.userId}
              />}
              <select
                disabled={!this.state.selectedItem.pr?.isTC}
                className={"form-control "  + this.state.technicalReadOnly}
                value={this.state.selectedItem.pr?.tcApprover ? this.state.selectedItem.pr?.tcApprover.userId:null}
                // onChange={(event) =>
                //   this.commonHandleChange(
                //     event,
                    
                //     "selectedItem.tcApprover.userId"
                //   )
                // }
              >
                <option value="">Select Technical Approver</option>
                {this.props.technicalApproverList.map(records =>
                  <option value={records.userId}>{records.name}</option>
                )}
              </select>
            </div>
          </div>
        </div>


        <div className="row mt-0 px-4 pt-1">

          <div className="col-12 col-md-4 col-lg-4">
            <div className="form-group">
              <label className="mr-1 label_12px">Approved By</label>
              <span className="display_block">
                { !isEmptyDeep(this.state.selectedItem.pr?.approvedBy) ? this.state.selectedItem.pr?.approvedBy.userName + " - " + this.state.selectedItem.pr?.approvedBy.name:'-'}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <div className="form-group">
              <label className="mr-1 label_12px">Third Party Approver</label>

              <Button variant="contained" size="small" color="primary" className={"display_block " + this.state.technicalReadOnly} type="button" data-toggle="modal" data-target="#multipleBuyerModal"><i className="fa fa-user" />&nbsp;Third Party Approver</Button>
            </div>
          </div>
        </div>

        </div>
        <div className="card my-2">
       
        <div className="lineItemDiv min-height-0px">
                <div className="row px-4 py-2">
                  <div className="col-sm-9"></div>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      id="SearchTableDataInputTwo"
                      className="form-control"
                      // onKeyUp={searchTableDataTwo}
                      placeholder="Search .."
                    />
                  </div>
                  <div className="col-sm-12 mt-2">
                    <div>
                      <StickyHeader height={250} className="table-responsive">
                        <table className="my-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th className="w-6per"> Line No.</th>
                              <th className="w-4per"> A</th>
                              <th className="w-4per"> I</th>
                              <th className="w-40per"> Material Description </th>
                              <th className="text-right w-7per"> Req. Qty </th>
                              <th> UOM </th>
                              <th className="text-right w-8per">Val. Price</th>
                              <th className="w-10per">Plant</th>
                              <th className="w-10per" style={{minWidth:150}}>Buyer</th>
                              <th className="w-10per"> Delivery Date </th>
                              {/*<th className="w-10per"> Required Date </th>*/}
                              <th className="w-40per">Desire vendor Code & Decription</th>

                            </tr>
                          </thead>
                          <tbody id="DataTableBodyTwo">
                            {this.props.prLineList.map((prLine,i)=>{
                            return (<>
                                <tr class="accordion-toggle" >
                                  <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th>
                                <td>{prLine.prLineNumber}</td>
                                <td>{prLine.accountAssignment}</td>
                                <td>{prLine.i}</td>
                                <td>{prLine.materialCode+" - "+prLine.materialDesc}</td>
                                <td className="text-right">{prLine.quantity}</td>
                                <td>{prLine.uom}</td>
                                <td className="text-right">{prLine.price}</td>
                                <td>{prLine.plant}</td>
                                <td>
                                   <>
                                    { !isEmptyDeep(prLine.buyer) && this.state.purchaseManager &&  <input
                                        type="hidden"
                                        name={"prLines["+i+"][buyer][userId]"}
                                       value={prLine.buyer.userId}
                                      /> }
                                      <select
                                        className={"form-control " + this.state.prLineReadOnly}
                                        // onChange={(event) => {
                                        //   if(!this.state.purchaseManager) return null;
                                        //   commonHandleChange(event, this, "prLineArray."+i+".buyer.userId");
                                        // }}
                                        value={prLine.buyer ? prLine.buyer.userId:null}
                                        disabled={!this.state.purchaseManager}
                                      >
                                        <option value="">Select Buyer</option>
                                        {this.props.buyerList.map(records =>{
                                          return (
                                            <option value={records.userId}>{records.name}</option>
                                          )
                                        })}
                                      </select>

                                   </>
                                </td>
                                <td>
                                  <input
                                    type="hidden"
                                    className={"form-control " + this.state.prLineReadOnly}
                                    
                                    name={"prLines["+i+"][prLineId]"}
                                    value={prLine.prLineId}
                                    disabled={isEmpty(prLine.prLineId)}
                                  />
                                 {formatDateWithoutTimeNewDate2(prLine.deliverDate)}
                                </td>
                                {/*<td>
                                  {formatDateWithoutTimeNewDate2(prLine.requiredDate)}
                                </td>*/}
                                 {/* <td>{!isEmptyDeep(prLine.desiredVendor) ? `${prLine.desiredVendor.name ? `${prLine.desiredVendor.name} - `:''}${prLine.desiredVendor.userName ? prLine.desiredVendor.userName:''}`:'-'}</td> */}
                                 <td>{prLine.desireVendorCode}</td>
                              </tr>
                                <tr class="hide-table-padding">
                                  <td colSpan="18">
                                    <div id={"collapse" + i} class="collapse in p-1">
                                      <div className="container-fluid px-0">
                                        <div class="row m-0 p-0">

                                          <div className="col-4">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Tracking No.</label>
                                              <span className="display_block">
                                                {prLine.trackingNo}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="col-4">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Assignment</label>
                                              <span className="display_block">
                                                {prLine.assignment}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row m-0 p-0">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">Long Text</label>
                                              <textarea
                                                className={"h-50px form-control " + this.state.prLineReadOnly}
                                                
                                                name={"prLines["+i+"][description]"}
                                                value={prLine.description}
                                                // onChange={(event) => {
                                                //   commonHandleChange(event, this, "prLineArray."+i+".description");
                                                // }}
                                                disabled={isEmpty(prLine.prLineId)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        {/* <div class="row m-0 p-0">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label className="mr-1 label_12px">header Text</label>
                                              <textarea
                                                className={"h-50px form-control " + this.state.prLineReadOnly}
                                                
                                                name={"prLines["+i+"][headerText]"}
                                                value={prLine.headerText}
                                                // onChange={(event) => {
                                                //   commonHandleChange(event, this, "prLineArray."+i+".headerText");
                                                // }}
                                                disabled={isEmpty(prLine.prLineId)}
                                              />
                                            </div>
                                          </div>
                                        </div> */}
                                      </div>
                                    </div></td>
                                </tr>
                              </>
                            )})
                            }
                          </tbody>
                        </table>
                      </StickyHeader>
                    </div>
              
                  </div>
                </div>
              </div>

        </div>
      
        </div>
        }


        <div className="modal-footer">
          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.closeModal}>Close</button>
        </div>
        
      </div>
    </div>
  </div>
</div>

      
        <div className="row px-4 py-2">
          <div className="col-sm-9"></div>
          <div className="col-sm-3">
            <input
              type="text"
              id="SearchTableDataInput"
              className="form-control"
              onKeyUp={searchTableData}
              placeholder="Search .."
            />


          </div>


          


          <div className="col-12">
            <StickyHeader height={450} className="table-responsive mt-2">
              {/* <FormWithConstraints ref={formWithConstraints => this.prFormPurchase = formWithConstraints} onSubmit={this.onSubmit}> */}
              <div class="col-12">
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                
                    <table className="my-table">
                      <thead>
                        <tr>

                          <th>
                          <input type="checkbox" checked={this.state.checked} onChange={this.toggleChecked} style={{marginRight:5}} />
                            Release</th>
                          <th>PR No</th>
                          <th></th>
                          <th>PR Date</th>
                          <th>Line No.</th>
                          <th>Status</th>
                          <th>Material Code & Description</th>
                          <th>Req. Qty.</th>
                          <th> UOM </th>
                          <th> Val. Price </th>
                          <th> Plant </th>
                          <th> Delivery Date </th>
                          {/*<th> Required Date </th>*/}
                          <th> Desire Vendor </th>
                          <th> Material group </th>
                          <th> Buyer </th>
                          <th> Tracking No </th>

                        </tr>
                      </thead>
                      <tbody className="table-header-fixed-min">
                      
                            {
                              !isEmptyDeep(groupByList) && groupByList.map((item,index) => {
                                return (
                                    <tr>
                                    <td>
                                    <input type="checkbox"
                                        value="Y"
                                        checked={item.isChecked}
                                        onChange={(e) => {
                                            commonHandleChangeCheckBox(e, this, "prList." + index + ".isChecked");
                                            // this.changeIndex(e, i);
                                        }}
                                        className="display_block"
                                    />
                                     {/* <input type="checkbox" checked={this.state.checkedItems.includes(index)} onChange={this.onChecked.bind(this,index)} /> */}
                                    </td>

                                    <td>{item.prNumber}</td>
                                    <td>
                                    <button type="button" onClick={this.handleSelect.bind(this,item)} data-toggle="modal" className="btn btn-light" data-target="#viewPrDetail" data-backdrop="static" data-keyboard="false">View PR</button>
                                    </td>
                                    <td >{formatDateWithoutTimeNewDate2(item.pr.date)}</td>
                                    <td>{item.prLineNumber}</td>
                                    <td>{this.props.prStatusList[item.status]}</td>
                                    <td>{`${item.materialCode} - ${item.materialDesc}`}</td>
                                    <td><input
                                        type="text"
                                        className={"form-control"}
                                          value={item.reqQty}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,"reqQty",index);
                                        }}
                                      />
                                      </td>
                                    <td>{item.uom}</td>
                                    <td>{item.price}</td>
                                    <td>{item.plant}</td>
                                    <td>
                                      <input
                                        type="date"
                                        max="9999-12-31"
                                        className={"form-control"}
                                          value={item.deliverDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,  "deliverDate",index);
                                        }}
                                      />
                                    </td>
                                    {/*<td>
                                      <input
                                        type="date"
                                        className={"form-control"}
                                          value={item.requiredDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,"requiredDate",index);
                                        }}
                                      />
                                    </td>*/}
                                   
                                    <td>{!isEmptyDeep(item.desiredVendor) ? `${item.desiredVendor.name ? `${item.desiredVendor.name} - `:''}${item.desiredVendor.userName ? item.desiredVendor.userName:''}`:'-'}</td>
                                    <td>{ `${item.matGrp ? `${item.matGrp} - `:''}${item.matGrpDesc ? item.matGrpDesc:''}`}</td>
                                    <td>
                                    <>
                                      <select
                                        className={"form-control"}
                                        disabled={true}
                                        // onChange={(event) => {
                                        //   this.commonHandleChange(event, "buyer",index);
                                        // }}
                                        value={item.buyer ? item.buyer.userId:null}
                                      >
                                        <option value="">Select Buyer</option>
                                        {!isEmptyDeep(this.props.buyerList) && this.props.buyerList.map(records =>{
                                          return (
                                            <option value={records.userId}>{records.name}</option>
                                          )
                                        })}
                                      </select>

                                   </>
                                   </td>
                                    <td>{item.trackingNo}</td>
                                    {this.getHiddenFields(item, index)}
                                  </tr>
                                )
                              })
                            }

                      </tbody>
                 
                    </table>

                  </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                {this.validateSelectVendor()?
                 <button type="button" onClick={this.props.loadVendorSelection} className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-user"/>&nbsp;Select Vendor</button>
                 :null}
                {/* <button onClick={this.onSubmit} type="button" className="btn btn-outline-success float-right my-2 mr-4" >&nbsp;Submit</button> */}
              </div>
     {/* </FormWithConstraints> */}
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
PRListBuyer.defaultProps = {
  loadPRDetails: () => null
}
const mapStateToProps=(state)=>{
  return state.prLineBuyerReducer;
};
export default connect(mapStateToProps,actionCreators)(PRListBuyer);
