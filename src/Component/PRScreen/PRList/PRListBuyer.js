import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmptyDeep,isEmpty } from "../../../Util/validationUtil";
import {groupBy,includes, map} from 'lodash-es';
import { FormWithConstraints,FieldFeedbacks,FieldFeedback } from 'react-form-with-constraints';
import { ROLE_BUYER_ADMIN } from "../../../Constants/UrlConstants";
import {
  commonHandleChangeCheckBox,
  showAlertAndReload,showAlert,
  commonHandleChange,
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import { isLoading, submitForm } from "../../../Util/APIUtils";
import formatDate, { formatDateWithoutTimeNewDate2, disablePastDate} from "../../../Util/DateUtil";
import * as actionCreators from "../PRList/Action/Action";
import { connect } from "react-redux";
import { API_BASE_URL } from "../../../Constants";
import { getUserDto, getFileAttachmentDto,getDecimalUpto,removeLeedingZeros } from "../../../Util/CommonUtil";
import { Button, Checkbox, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import DataTable from "react-data-table-component";
import LoaderWithProps from "../../FormElement/Loader/LoaderWithProps";

class PRListBuyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems:[],
      openModal:false,
      selectedItemsPr: [],
      selectedItemsPL:[],
      selectedItem:{
        requestedBy:{},
        approver:{},
        tcApprover:{},
        approvedBy:{}
      },
      readonly:false,
      technicalReadOnly:false,
      prLineArray:[],
      prList:[],
      checked:false,
      loadGetDocuments:false,
      getDocuments:[],
      viewInquirymy:[],
      isLoading:false
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

  handleFilterChange = (key,event) => {
    this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);
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

  componentWillReceiveProps(nextProps) {
  console.log("next", nextProps);

  if (!isEmpty(nextProps.prList)) {
    this.setState({
      prList: nextProps.prList,
      isLoading: false, // ✅ Set loading false here
    });
  }

  if (this.state.loadGetDocuments && !isEmpty(nextProps.documents)) {
    this.props.changeLoaderState(false);
    this.setGetDocuments(nextProps); 
  } else if (!isEmpty(nextProps.prLineList)) {
    this.setState({ viewInquirymy: nextProps.prLineList });
  } else {
    this.props.changeLoaderState(false);
  }
}


  closeModal = () => {
    this.props.disabledLoading();
    this.state.viewInquirymy=[];
  
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


  viewInquiry = (item) => {
console.log('mohan', item)
    if(!isEmptyDeep(item.pr)){
      // this.setState({viewInquiry:item});
      
      commonSubmitWithParam(this.props,"getEnqByPRLine","/rest/getEnqByPRLine",item.prLineId) 
      
    }
   this.setState({selectedItem:item})
  }

  handleChange = (key,event) => {
    const selectedValues = event.target.value; // The selected values (array of item.value)
    // const selectedValuesStr = selectedValues.join(", ");
    this.setState({
      selectedItemsPr: event.target.value,  // Update selected items
    });
    this.props.onFilterChange && this.props.onFilterChange(key, selectedValues);
  };
  handleChangePL = (key,event) => {
    const selectedValues = event.target.value; // The selected values (array of item.value)
   // const selectedValuesStr = selectedValues.join(", ");
    this.setState({
      selectedItemsPL: event.target.value,  // Update selected items
    });
    this.props.onFilterChange && this.props.onFilterChange(key, selectedValues);
  };

  getHiddenFields = (prLine, index) => {
    if(isEmptyDeep(prLine)) return ;
if(this.state.checked===true && prLine?.status==="BA"){
    return (
        <>
            <input
                type="hidden"
                name={"itemBidList[" + index + "][prLine][prLineId]"}
                value={prLine.prLineId}
              
               // disabled={ !prLine.isChecked }
            />
            <input
                type="hidden"
                name={"itemBidList[" + index + "][prLine][pr][docType]"}
                value={prLine.pr.docType}
              
               // disabled={ !prLine.isChecked }
            />
              <input
                type="hidden"
                name={"itemBidList[" + index + "][quantity]"}
                value={prLine.reqQty}
                
              //  disabled={ !prLine.isChecked }
            />
        </>
    )
  }else{

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
                name={"itemBidList[" + index + "][prLine][pr][docType]"}
                value={prLine.pr.docType}
              
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
}
clearFields = () => {
  this.props.onClearFilter(); // Calls parent's clearFilter
  this.setState({selectedItemsPr: [],selectedItemsPL:[]})
}
handleFilterClick = () => {
  this.setState({ isLoading:true, openModal:false})
  this.props.onFilter &&  this.props.onFilter()
  this.clearFields();
}


// toggleChecked = (e) => {
//   let {checked} = e.target;
//   const groupByList = this.state.prList.map(item => ({...item,isChecked:checked}));
//   this.setState({checked,prList:groupByList})
// }
toggleChecked = (e) => {
  const { checked } = e.target;
  const { prStatusList } = this.props;

  const groupByList = this.state.prList.map(item => {
    if (prStatusList?.[item.status] === "Purchase Head") {
      return { ...item, isChecked: checked };
    }
    return item; // leave other items untouched
  });

  this.setState({ checked, prList: groupByList });
};

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

closedocModal() {            
  document.getElementById("documentModal").style.display = "none";
}

onCloseModal=()=>{
  this.setState({
    openModal:false
  })
}
onOpenModal=()=>{
  this.setState({
    openModal:true
  })
}
isRowDisabled = (row) => {
  const { prStatusList } = this.props;
  return prStatusList?.[row.status] !== "Purchase Head";
};
isHeaderCheckboxDisabled = () => {
  const { data = [] } = this.props;
  return !data.some((row) => !this.isRowDisabled(row));
};

  render() {
    const {selectedItemsPr, selectedItemsPL}=this.state
    const groupByList = this.state.prList.map((item, index) => ({
      ...item,
      _rowIndex: index,
    }));
    const {filterBuyerList,filterPlantList,filterPRStatusList,filterPurhaseGroupList} = this.props;
   // const groupByList = this.props.buy ? this.state.prList:this.props.prList;
   console.log(this.state.prList,"this.state.prList")
    let filter = {};
    if(this.props.role != ROLE_BUYER_ADMIN) return null;
    const selectedItemsDisplay = filterPurhaseGroupList && filterPurhaseGroupList.filter(item => selectedItemsPr.includes(item.value));
    const selectedItemsDisplayPlant = filterPlantList && filterPlantList.filter(item => selectedItemsPL.includes(item.value));
const columns = [
 {
  name: (
    <input
      type="checkbox"
      checked={this.state.checked}
      onChange={this.toggleChecked}
    />
  ),
  cell: (row) => (
    <input
      type="checkbox"
      disabled={this.isRowDisabled(row)}
      checked={row.isChecked}
      onChange={(e) =>
        commonHandleChangeCheckBox(e, this, `prList.${row._rowIndex}.isChecked`)
      }
      className="display_block"
    />
  ),
  width: "60px",
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
},
  {
    name: "PR No",
    selector: row => row.prNumber,
    width: "90px",
    sortable: true,
    wrap: true,
    grow: 2
  },
  {
    name: "",
    cell: row => (
      <>
        <button
          type="button"
          onClick={() => this.handleSelect(row)}
          className="btn btn-light"
          data-toggle="modal"
          data-target="#viewPrDetail"
          data-backdrop="static"
          data-keyboard="false"
        >
          View PR
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => this.viewInquiry(row)}
          className="btn btn-light myname"
          data-toggle="modal"
          data-target="#viewInquiry"
          data-backdrop="static"
          data-keyboard="false"
        >
          Enquiry
        </button>
      </>
    ),
    width: "250px",
  },
  {
    name: "PR Released Date",
    selector: row => row.pr.releasedDate,
    cell: row => row.pr?.releasedDate ? formatDateWithoutTimeNewDate2(row.pr.releasedDate) : "",
    width: "130px",
    sortable: true
  },
  {
    name: "PR Doc Type",
    selector: row => row.pr?.docType,
    width: "100px",
    sortable: true
  },
  {
    name: "PR Date",
    selector: row => row.pr?.date,
    cell: row => formatDateWithoutTimeNewDate2(row.pr?.date),
    width: "100px",
    sortable: true
  },
  {
    name: "Line No.",
    selector: row => row.prLineNumber,
    cell: row => removeLeedingZeros(row.prLineNumber),
    width: "80px",
    sortable: true
  },
  {
    name: "Material Code & Description",
    selector: row => `${row.materialCode} - ${row.materialDesc}`,
    minWidth: "220px",
    sortable: true,
    wrap: true,
    grow: 3
  },
  {
    name: "Req. Qty.",
    cell: (row) => (
      <input
        type="number"
        className="form-control"
        value={row.reqQty}
        onChange={(e) => this.commonHandleChange(e, "reqQty", row._rowIndex)}
        style={{ width: "60px" }}
      />
    ),
    width: "80px",
  },
  {
    name: "UOM",
    selector: row => row.uom,
    width: "60px",
    sortable: true
  },
  {
    name: "Val. Price",
    selector: row => row.price,
    width: "90px",
    sortable: true
  },
  {
    name: "Plant",
    selector: row => row.plantDesc ? `${row.plant} - ${row.plantDesc}` : row.plant,
    minWidth: "140px",
    sortable: true,
    wrap: true,
    grow: 2
  },
  {
    name: "Delivery Date",
    cell: row => (
      <input
        type="date"
        min={disablePastDate()}
        max="9999-12-31"
        className="form-control"
        value={row.deliverDate}
        onChange={(e) => this.commonHandleChange(e, "deliverDate", row._rowIndex)}
        style={{ width: "110px" }}
      />
    ),
    width: "130px",
    wrap: true,
    grow: 3
  },
  {
    name: "Material group",
    selector: row => `${row.matGrp ? row.matGrp + ' - ' : ''}${row.matGrpDesc || ''}`,
    minWidth: "120px",
    sortable: true,
    wrap: true,
    grow: 3
  },
  {
    name: "Buyer",
    cell: row => (
      <select
        className="form-control"
        disabled={true}
        value={row.buyer ? row.buyer.userId : ""}
      >
        <option value="">Select Buyer</option>
        {!isEmptyDeep(this.props.buyerList) &&
          this.props.buyerList.map(records => (
            <option key={records.userId} value={records.userId}>
              {records.name}
            </option>
          ))}
      </select>
    ),
    width: "150px",
    wrap: true,
    grow: 4
  },
  {
    name: "Tracking No",
    selector: row => row.trackingNo,
    width: "100px",
    sortable: true
  },
  {
    name: "Status",
    selector: row => this.props.prStatusList[row.status],
    width: "100px",
    sortable: true,
    wrap: true,
    grow: 2
}

];

 const filteredData = groupByList.map((item, index) => ({
  ...item,
  _rowIndex: index,
}));


    return (
      <> 
      <LoaderWithProps isLoading={this.state.isLoading} />
<div className="modal" id="viewPrDetail" style={{marginTop:50}}>


<div className="modal documentModal" id="documentModal" >
<div className="modal-dialog mt-100" style={{width:"800px", maxWidth:"800px"}}>
<div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
                <div className="modal-header">
                  Other Documents
                  <button type="button" className={"close "+ this.props.readonly} data-dismiss="modal" onClick={this.closedocModal}  >
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
        <div className="card my-2 wizard-v1-content">

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
            {!isEmptyDeep(this.state.selectedItem.pr?.releasedBy) ? this.state.selectedItem.pr.releasedBy.userName + " - "+ this.state.selectedItem.pr.releasedBy.name:'-'}
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
                  // this.state.selectedItem.priority
                  this.state.selectedItem.pr?.priority
                )}
                value={this.state.selectedItem.pr?.priority}
                // value={this.state.selectedItem.priority}
              />
              <select
                className={"form-control " + this.state.priorityReadOnly}
                // value={this.state.selectedItem.priority}
                value={this.state.selectedItem.pr?.priority!=null?this.state.selectedItem.pr?.priority:""}
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
        <div className="card my-2 wizard-v1-content">
       
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
                              <th className="w-40per"> Material Description  </th>
                              <th className="text-right w-7per"> Req. Qty </th>
                              <th> UOM </th>
                              <th className="text-right w-8per">Val. Price</th>
                              <th className="w-10per">Plant</th>
                              <th className="w-10per" style={{minWidth:150}}>Buyer</th>
                              <th className="w-10per"> Delivery Date </th>
                             {/* <th className="w-10per"> Required Date </th>*/}
                              <th className="w-40per">Desire vendor Code & Decription</th>

                            </tr>
                          </thead>
                          {console.log('ronak', this.props.prLineList)}
                          <tbody id="DataTableBodyTwo">
                            {this.props.prLineList.map((prLine,i)=>{
                            return (<>
                                <tr class="accordion-toggle" >
                                  <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th>
                                <td>{removeLeedingZeros(prLine.prLineNumber)}</td>
                                <td>{prLine.accountAssignment}</td>
                                <td>{prLine.i}</td>
                                <td>{prLine.materialCode+" - "+prLine.materialDesc}</td>
                                <td className="text-right">{prLine.quantity}</td>
                                <td>{prLine.uom}</td>
                                <td className="text-right">{prLine.price}</td>
                                {/* <td>{prLine.plant}</td> */}
                                <td>{prLine.plantDESC!=null?prLine.plant+"-"+prLine.plantDESC:prLine.plant}</td>
                                <td>
                                   <>
                                    { !isEmptyDeep(prLine.buyer) && this.state.purchaseManager &&  <input
                                        type="hidden"
                                        name={"prLines["+i+"][buyer][userId]"}
                                       value={prLine.buyer.userId}
                                      /> }
                                      <select
                                        className={"form-control " + this.state.prLineReadOnly}                                      
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
                                      <div className="container-fluid px-0" >
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
                                                className={"h-100px form-control " + this.state.prLineReadOnly}

                                                name={"prLines["+i+"][description]"}
                                                value={prLine.description+" - "+prLine.materialPOText}
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



        <div className="row px-4 py-2" id="togglesidebar">
          <div className="col-sm-9">
          {
            
            
            }


          </div>

          <div className="col-sm-3">
           {/* <input
              type="text"
              id="SearchTableDataInput"
              className="form-control"
              onKeyUp={searchTableData}
              placeholder="Search.."
            /> */}


          </div>

<>
{/* mona */}
<div className="modal" id="viewInquiry" >
 <div className="modal-dialog modal-dialog-centered modal-xl">
 <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">View Inquiry</h4>
          <button type="button" className="close" data-dismiss="modal" onClick={this.closeModal}>&times;</button>
        </div>
        <div className="modal-body">

        <table className="my-table">
        <thead style={{zIndex:1}}>
        <tr>
        <th>Enquiry No</th>
        <th style={{width:130}}>Enquiry End Date</th>
        <th>Buyer Name/Code</th>
        <th>Status</th>
        </tr>
        </thead>
        <tbody>
          {this.state.viewInquirymy?.map((data)=>{
            return(
              <>
              
              <tr>
              <td>{data.bidder?.enquiry?.enquiryId}</td>
              <td>{formatDateWithoutTimeNewDate2(data.bidder?.enquiry?.bidEndDate)}</td>
              <td>{data.partner?.name}/{data.partner?.vendorSapCode}</td>
              <td>{data.bidder?.enquiry?.code}</td>
              </tr>
              </>

            )
          })
        }
        </tbody>
    </table>



        </div>
 </div>
 </div>
</div>
</>
{this.state.openModal && <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
<div className="modal-backdrop"></div> <div className="modal-dialog modal-md">
                                       <div className="modal-content">
<FormWithConstraints ref={formWithConstraints => this.prFormbuyer = formWithConstraints} 
//onSubmit={this.onSubmit}
>
<div className="row ">
     
                     
                      <div className="col-sm-12 mt-5">
                        
                           <TextField
                                  label="PR NO."
                                  variant="outlined"
                                  size="small"
                                  id="PRNOFROM"
                                  fullWidth
                                  type="number"
                                  value={this.props.filter.prNoFrom}
                                  onChange={this.handleFilterChange.bind(this, 'prNoFrom')}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{ style: { fontSize: 12, height: "15px" } }}
                                />
                      
                      </div>
                    
                     <div className="col-sm-12 mt-5">
                    
              {/* <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Purchase Group</InputLabel>
                      <Select
                       value={filter.purchaseGroupFrom}
                       onChange={this.handleFilterChange.bind(this, 'purchaseGroupFrom')}
                       
                        label="Purchase Group"
                        sx={{ fontSize: 12, height: "15px" }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {!isEmptyDeep(filterPurhaseGroupList) && filterPurhaseGroupList.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display + "-" + item.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>             */}
                    <FormControl fullWidth size="small" variant="outlined">
                <InputLabel shrink>Purchase Group</InputLabel>
                <Select
                  multiple
                  value={this.state.selectedItemsPr}
                 // onChange={this.handleChange}
                  onChange={this.handleChange.bind(this,'multiplePurchaseGroup')}
                  sx={{ fontSize: 12, height: "15px" }}
                  renderValue={(selected) => {
                    // Display both item.display and item.value as selected items
                    return selectedItemsDisplay.map(item => `${item.display} - ${item.value}`).join(", ");
                  }}  // Custom display for selected items
                >
                  {!isEmpty(filterPurhaseGroupList) && filterPurhaseGroupList.map((item, i) => (
                    <MenuItem  key={i + 1} value={item.value} style={{padding:"0px"}}>
                      <Checkbox size="small" checked={this.state.selectedItemsPr.indexOf(item.value) > -1} />
                      <ListItemText className="customListItemText" primary={item.display + " - " + item.value} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </div>
              <div className="col-sm-12 mt-5">
              <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Plant</InputLabel>

                      <Select
                  multiple
                  value={this.state.selectedItemsPL}
                 // onChange={this.handleChange}
                  onChange={this.handleChangePL.bind(this,'multiplePlantList')}
                  sx={{ fontSize: 12, height: "15px" }}
                  renderValue={(selected) => {
                    // Display both item.display and item.value as selected items
                    return selectedItemsDisplayPlant.map(item => `${item.display} - ${item.value}`).join(", ");
                  }}  // Custom display for selected items
                >
                  {!isEmpty(filterPlantList) && filterPlantList.map((item, i) => (
                    <MenuItem  key={i + 1} value={item.value} style={{padding:"0px"}}>
                      <Checkbox size="small" checked={this.state.selectedItemsPL.indexOf(item.value) > -1} />
                      <ListItemText className="customListItemText" primary={item.display + " - " + item.value} />
                    </MenuItem>
                  ))}
                </Select>
                    </FormControl>
              {/* <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Plant</InputLabel>
                      <Select
                         value={filter.plant} onChange={this.handleFilterChange.bind(this,'plant')}
                        label="Plant"
                        sx={{ fontSize: 12, height: "15px" }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {!isEmptyDeep(filterPlantList) && filterPlantList.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display + "-" + item.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
         
              </div>

              {/* PR Release Date Row */}
              <div className="col-sm-12 mt-5">
  <Grid item xs={12} container alignItems="center" spacing={2} >
   
   <Grid item xs={6}>
     <TextField
       label="PR Date From"
       variant="outlined"
       size="small"
       fullWidth
       type="date"
       value={filter.prDateFrom}
       onChange={this.handleFilterChange.bind(this, 'prDateFrom')}
       InputLabelProps={{ shrink: true }}
       inputProps={{ style: { fontSize: 12, height: "15px" } }}
     />
   </Grid>
   <Grid item xs={6}>
     <TextField
       label="PR Date To"
       variant="outlined"
       size="small"
       fullWidth
       type="date"
       value={filter.prDateTo}
       onChange={this.handleFilterChange.bind(this, 'prDateTo')}
       InputLabelProps={{ shrink: true }}
       inputProps={{ style: { fontSize: 12, height: "15px" } }}
     />
   </Grid>
 </Grid></div>
            <div className="col-lg-12 text-center mt-2">
                      <Button type="button" size="small" color="primary" variant="contained" onClick={this.handleFilterClick.bind(this)}> Search </Button> 
                      <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
                      Cancel</Button>
                      <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>
                      </div>
                      </div>
      
      
       
           
            </FormWithConstraints>
            </div>
            </div>
            </div>}
            <Grid container>
            <Grid item sm={12} className="">   
            <Button type="button" size="small" color="primary" variant="contained" onClick={()=>{this.props.loadVendorSelection(); this.props.prlistadd(true)}} className=""><i className="fa fa-user"/>&nbsp; Add Vendor to existing enquiry</Button>
            {this.validateSelectVendor()?
            <button type="button" onClick={this.props.loadVendorSelection} className="btn btn-sm btn-outline-primary ml-1"><i className="fa fa-user"/>&nbsp;Select Vendors for new enquiry</button>
            :null}
        <input
          placeholder="Search"
          // variant="outlined"
          // size="small"
          style={{fontSize: "10px", float:"right" }}
          // value={searchQuery}
          // onChange={this.handleSearchChange}
        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
        </Grid>
        </Grid>
         
                <TableContainer className="mt-1">
                    <Table className="my-table" style={{display:"none"}}>
                      <TableHead>
                        <TableRow>

                          <TableCell id="enq">
                          <input type="checkbox" checked={this.state.checked} onChange={this.toggleChecked}/>
                            ENQ</TableCell>
                          <TableCell>PR No</TableCell>
                          <TableCell></TableCell>
                          <TableCell>PR Released Date</TableCell>
                          <TableCell>PR Doc Type</TableCell>
                          <TableCell>PR Date</TableCell>
                          <TableCell>Line No.</TableCell>
                          <TableCell>Material Code & Description</TableCell>
                          <TableCell>Req. Qty.</TableCell>
                          <TableCell> UOM </TableCell>
                          <TableCell> Val. Price </TableCell>
                          <TableCell> Plant </TableCell>
                          <TableCell> Delivery Date </TableCell>
                          <TableCell> Material group </TableCell>
                          <TableCell> Buyer </TableCell>
                          <TableCell> Tracking No </TableCell>
                          <TableCell>Status</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody className="table-header-fixed-min" id="DataTableBody">
                      
                            {
                             !isEmptyDeep(groupByList) && groupByList.sort((a, b) => (a.pr.releasedDate < b.pr.releasedDate ? -1 : 1)).map((item,index) => {
                                return (
                                    <TableRow>
                                    <TableCell style={{minWidth:"24px"}}>
                                    <input type="checkbox"
                                    disabled={this.props.prStatusList[item.status] != "Purchase Head" ? true : false}
                                        value="Y"
                                        checked={item.isChecked}
                                        onChange={(e) => {
                                            commonHandleChangeCheckBox(e, this, "prList." + index + ".isChecked");
                                        }}
                                        className="display_block"

                                    />
                                    </TableCell>

                                    <TableCell style={{minWidth:"26px"}}>{item.prNumber}</TableCell>
                                    <TableCell>
                                    <button type="button" onClick={this.handleSelect.bind(this,item)} data-toggle="modal" className="btn btn-light" data-target="#viewPrDetail" data-backdrop="static" data-keyboard="false">View PR</button>
                                      &nbsp;
                                    <button type="button" onClick={this.viewInquiry.bind(this,item)} data-toggle="modal" className="btn btn-light myname" data-target="#viewInquiry" data-backdrop="static" data-keyboard="false">Enquiry</button>

                                    </TableCell>
                                    <TableCell>{item.pr.releasedDate!=null?formatDateWithoutTimeNewDate2(item.pr.releasedDate):""}</TableCell>
                                    <TableCell>{(item.pr.docType)}</TableCell>
                                    <TableCell>{formatDateWithoutTimeNewDate2(item.pr.date)}</TableCell>
                                    <TableCell style={{minWidth:"15px"}}>{removeLeedingZeros(item.prLineNumber)}</TableCell>
                                    <TableCell>{`${item.materialCode} - ${item.materialDesc}`}</TableCell>
                                    <TableCell style={{minWidth:"30px"}}>
                                      <input
                                        type="number"
                                        className={"form-control"}
                                          value={item.reqQty}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,"reqQty",index);
                                        }}
                                        style={{width:"55px"}}
                                      />
                                      </TableCell>
                                    <TableCell style={{minWidth:"26px"}}>{item.uom}</TableCell>
                                    <TableCell style={{minWidth:"40px"}}>{item.price}</TableCell>
                                   <TableCell style={{minWidth:"26px"}}>{item.plantDesc!=null?item.plant+"-"+item.plantDesc:item.plant}</TableCell>
                                    <TableCell>
                                      <input
                                        type="date"
                                        min={disablePastDate()}
                                        max="9999-12-31"
                                        className={"form-control"}
                                          value={item.deliverDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,  "deliverDate",index);
                                        }}
                                        style={{width:"100px"}}
                                      />
                                    </TableCell>
                                   <TableCell>{ `${item.matGrp ? `${item.matGrp} - `:''}${item.matGrpDesc ? item.matGrpDesc:''}`}</TableCell>
                                    <TableCell>
                                    <>
                                      <select
                                        className={"form-control"}
                                        disabled={true}
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
                                   </TableCell>
                                    <TableCell style={{minWidth:"26px"}}>{item.trackingNo}</TableCell>
                                    <TableCell style={{minWidth:"26px"}}>{this.props.prStatusList[item.status]}</TableCell>
                                    {this.getHiddenFields(item, index)}
                                  </TableRow>
                                )
                              })
                            }

                      </TableBody>
                 
                    </Table>
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      paginationPerPage={50}  
                      paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                    />
                    </TableContainer>
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
