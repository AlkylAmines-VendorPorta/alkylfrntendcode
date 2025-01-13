import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmptyDeep,isEmpty } from "../../../Util/validationUtil";
import {groupBy,includes} from 'lodash-es';
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_BUYER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN } from "../../../Constants/UrlConstants";
import { formatDateWithoutTimeWithMonthName,formatDateWithoutTime,formatTime } from "../../../Util/DateUtil";
import { API_BASE_URL } from "../../../Constants";
import {
  commonHandleChangeCheckBox,
  showAlertAndReload,showAlert,
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import { submitForm } from "../../../Util/APIUtils";
import { connect } from "react-redux";
import * as actionCreators from "../PRList/Action/Action";
class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems:[],
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
      getDocuments:[]
    };
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

  getDocuments =()=>{
    debugger
    console.log("this.state.selectedItem",this.state.selectedItem.prId);
    commonSubmitWithParam(this.props, "getDocuments", "/rest/getAttachmentbyPrId", this.state.selectedItem.prId);
    this.setState({loadGetDocuments:true})
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
          let itm = {prLineId:li.prLineId,pr:{prId:li.pr.prId},deliverDate:li.deliverDate,requiredDate:li.requiredDate,prLineNumber: li.prLineNumber}
          if(!isEmptyDeep(li.buyer)){
            itm = { ...itm,buyerId:Number(li.buyer.userId) }
          }
          return itm;
        });
        data = data.concat(items)
      }
      return item;
    })

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

  componentWillReceiveProps(nextProps){
    console.log("willprops list",nextProps);
    let list = groupBy(nextProps.prList, 'prNumber');
    this.setState({prList: list})
// debugger
    if(this.state.loadGetDocuments && !isEmpty(nextProps.documents)){
      this.props.changeLoaderState(false);
      this.setGetDocuments(nextProps); 
    }else{
      this.props.changeLoaderState(false);
    }

  }

  commonHandleChange(event,keyName,key,index){

    let {prList} = this.state;
    let prItems = prList[key];
    if(keyName == 'buyer'){
      let val = event.target.value;
      let buyer = null;
      if(!includes(['',null,undefined],val)) buyer = {userId: val};
      prItems[index] = {
        ...prItems[index],
        buyer
      }
    }else{
      prItems[index] = {
        ...prItems[index],
        [keyName]:event.target.value
      }
    }
    prList = {
      ...prList,
      [key]:prItems
    };
    this.setState({prList})
  }

  handleSelect = (items) => {
    console.log('itemData',items[0],this.state)
    let pr = !isEmptyDeep(items[0]) && !isEmptyDeep(items[0].pr) ? items[0].pr:{};
  //  let item = !isEmptyDeep(childs) ?  childs[0].pr:{};
  //  this.setState({selectedItem:item})
    // if(!isEmptyDeep(item.prLineId)){
    //   commonSubmitWithParam(this.props,"getPRLines","/rest/getPRLinebyPrId",item.prLineId); 
    // }
   this.setState({selectedItem:{
     ...pr,
     prLineList:items
   }})
 
  }

  toggleChecked = (e) => {
    let {checked} = e.target;
    const groupByList = this.props.purchaseManager ? this.state.prList:this.props.prList;
    let checkedItems = [];
    if(checked) checkedItems = Object.keys(groupByList);
    this.setState({checked,checkedItems})
  }

  handleFilterChange = (key,event) => {
    this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);
  }

  handleFilterClick = () => {
    this.props.onFilter &&  this.props.onFilter()
  }

  
  clearFields = () => {
    document.getElementById("PRNOFROM").value = "";
     document.getElementById("PRNOTO").value = "";
     document.getElementById("PRDATEFROM").value = "";
     document.getElementById("PRDATETO").value = "";
     document.getElementById("status1").value = "";
     document.getElementById("buyer").value = "";
     document.getElementById("plant").value = "";



  }


  render() {
    const {filterBuyerList,filterPlantList,filterPRStatusList} = this.props;
    console.log("PRLIST REN PROPS",this.props);
    const groupByList = this.props.purchaseManager ? this.state.prList:this.props.prList;
    let filter = {};
    if(this.props.role == ROLE_BUYER_ADMIN) return null;
    return (
      <>

<div className="modal" id="viewPrDetail" >


<div className="modal documentModal" id="documentModal" >
            <div className="modal-dialog modal-xl mt-100">
              <div className="modal-content">
                <div className="modal-header">
                  Other Documents
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


    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">PR Detail</h4>
          <button type="button" className="close" data-dismiss="modal">&times;</button>
        </div>
        <div className="modal-body">
     { !isEmptyDeep(this.state.selectedItem) && 
        <div className="card my-2">

        <div className="row mt-0 px-4 pt-1">
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">PR Type</label>
            <span className="display_block">
              {this.state.selectedItem.docType}
            </span>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">PR No. & Date</label>
            <span className="display_block">
              {this.state.selectedItem.prNumber + " - "+ formatDateWithoutTimeWithMonthName(this.state.selectedItem.date)}
            </span>
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <label className="mr-4 label_12px">Created By</label>
            <span className="display_block">
            {!isEmptyDeep(this.state.selectedItem.releasedBy) ? this.state.selectedItem.releasedBy.userName + " - "+ this.state.selectedItem.releasedBy.name:'-'}
            {/* {!isEmptyDeep(this.state.selectedItem.createdBy) ? this.state.selectedItem.createdBy.userName + " - "+ this.state.selectedItem.createdBy.name:'-'} */}
              {/* {!isEmptyDeep(this.state.selectedItem.requestedBy) ? this.state.selectedItem.requestedBy.userName + " - "+ this.state.selectedItem.requestedBy.name:'-'} */}
            </span>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <label className="mr-4 label_12px">Techno/Comm</label>
            <input type="checkbox" name="isTC" className={"display_block mgt-5 " + this.state.technicalReadOnly} value="Y" checked={this.state.selectedItem.isTC} onChange={(e) => { 
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
            <textarea
              className={"h-50px form-control " + this.state.prLineReadOnly}
              value={!isEmpty(this.state.selectedItem?.prLineList)?this.state.selectedItem.prLineList[0].headerText:""}
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
             {!isEmptyDeep(this.state.selectedItem.tcApprover) &&  <input
                type="hidden"
                name="tcApprover[userId]"
                disabled={isEmpty(
                  this.state.selectedItem.tcApprover.userId
                )}
                value={this.state.selectedItem.tcApprover.userId}
              />}
              <select
                disabled={!this.state.selectedItem.isTC}
                className={"form-control "  + this.state.technicalReadOnly}
                value={this.state.selectedItem.tcApprover ? this.state.selectedItem.tcApprover.userId:null}
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
                { !isEmptyDeep(this.state.selectedItem.approvedBy) ? this.state.selectedItem.approvedBy.userName + " - " + this.state.selectedItem.approvedBy.name:'-'}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-4">
            <div className="form-group">
              <label className="mr-1 label_12px">Third Party Approver</label>

              <button className={"btn btn-sm btn-outline-primary display_block " + this.state.technicalReadOnly} type="button" data-toggle="modal" data-target="#multipleBuyerModal"><i className="fa fa-user" />&nbsp;Third Party Approver</button>
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
                       <table className="table table-bordered table-header-fixed">
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
                           {!isEmpty(this.state.selectedItem.prLineList) && this.state.selectedItem.prLineList.map((prLine,i)=>{
                           return (<>
                               <tr class="accordion-toggle" >
                                 <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th>
                               <td>{prLine.prLineNumber}</td>
                               <td>{prLine.accountAssignment}</td>
                               <td>{prLine.i}</td>
                               <td>{prLine.materialCode+" - "+prLine.materialDesc}</td>
                               <td className="text-right">{prLine.reqQty}</td>
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
                                {formatDateWithoutTimeWithMonthName(prLine.deliverDate)}
                               </td>
                               {/*<td>
                                 {formatDateWithoutTimeWithMonthName(prLine.requiredDate)}
                               </td>*/}
                                {/* <td>{!isEmptyDeep(prLine.desiredVendor) ? `${prLine.desiredVendor.name ? `${prLine.desiredVendor.name} - `:''}${prLine.desiredVendor.userName ? prLine.desiredVendor.userName:''}`:'-'}</td> */}
                                <td>{prLine.desireVendorCode}</td>
                             </tr>
                               <tr class="hide-table-padding">
                                 <td colSpan="11">
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
          <button type="button" className="btn btn-primary" data-dismiss="modal">Ok</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
        
      </div>
    </div>
  </div>
</div>
       
        <div className="row px-4 py-2" id="togglesidebar">
    { [ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN].includes(this.props.role) &&
        <>
        <div className="row col-12">
        <div className="col-sm-12">
       
        <div className="row mt-2">
                      <label className="col-sm-2 mt-4">Pr No</label>
                      <div className="col-sm-4">
                        <label>From </label>
                        <input type="number" className="form-control" id="PRNOFROM"  value={filter.prNoFrom} onChange={this.handleFilterChange.bind(this,'prNoFrom')} />
                      </div>
                
                      <div className="col-sm-4">
                        <label>To </label>
                        <input type="number" className="form-control" id="PRNOTO"  value={filter.prNoTo} onChange={this.handleFilterChange.bind(this,'prNoTo')} />
                      </div>

            </div>
            </div>

            <div className="col-sm-12">
       
       <div className="row mt-2">
                     <label className="col-sm-2 mt-4">Pr Release Date</label>
                     <div className="col-sm-4">
                       <label>From </label>
                       <input type="date" id="PRDATEFROM" className="form-control" max="9999-12-31" value={filter.prDateFrom} onChange={this.handleFilterChange.bind(this,'prDateFrom')} />
                     </div>
               
                     <div className="col-sm-4">
                       <label>To </label>
                       <input type="date" id="PRDATETO" className="form-control" max="9999-12-31" value={filter.prDateTo} onChange={this.handleFilterChange.bind(this,'prDateTo')} />
                     </div>

           </div>
           </div>

      </div>


        <div className="row mt-2 col-12">
      <label className="col-sm-2">Status </label>
            <div className="col-sm-4">
              
              <select className="form-control"
              id="status1"
              value={filter.status} onChange={this.handleFilterChange.bind(this,'status')}
              required>
                <option value="">Select</option>
                {!isEmptyDeep(filterPRStatusList) && filterPRStatusList.map(item=>
                  <option value={item.value}>{item.display}</option>
                )};
              </select>
            </div>
      
            <label className="col-sm-2">Emp code. </label>
            <div className="col-sm-4">
            <input  className="form-control" 
            id="buyer"
             value={filter.buyerCode} 
             onChange={this.handleFilterChange.bind(this,'buyerCode')} />
              
              {/* <select className="form-control"
              value={filter.buyerCode} onChange={this.handleFilterChange.bind(this,'buyerCode')}
              required>
                <option value="">Select</option>
                {!isEmptyDeep(filterBuyerList) && filterBuyerList.map(item=>
                  <option value={item.value}>{item.display}</option>
                )};
              </select> */}
            </div>
        </div>

        <div className="row col-12 mt-2">
        <label className="col-sm-2">plant </label>

        <div className="col-sm-4">
              <select className="form-control"
              id="plant"
              value={filter.plant} onChange={this.handleFilterChange.bind(this,'plant')}
              required>
                <option value="">Select</option>
                {!isEmptyDeep(filterPlantList) && filterPlantList.map(item=>
                  // <option value={item.value}>{item.display}</option>
                     <option value={item.value}>{item.value + "-"+ item.display}</option>
                )};
              </select>
            </div> 

        <div className="col-sm-6">
          <button type="button" className={"btn btn-primary"} onClick={this.handleFilterClick.bind(this)}> Search </button> &nbsp;
          <button type="button" className={"btn btn-danger"} onClick={this.clearFields.bind(this)}> Clear </button>
        </div>

        <div className="col-sm-6">

      </div>
        <div className="col-sm-6">

        <div className="row mt-2">
        <div className="col-sm-4"></div>
           <div className="col-sm-8">
            {/* <input type="text" id="SearchTableDataInput" className="form-control" onKeyUp={searchTableData} placeholder="Search .." /> */}
            </div>
        </div>

        </div>

        </div>
          
        </>
        }
          <div className="col-12">
            <StickyHeader height={450} className="table-responsive mt-2">
              {this.props.purchaseManager ?
              <>
              <FormWithConstraints ref={formWithConstraints => this.prFormPurchase = formWithConstraints} onSubmit={this.onSubmit}>
              <div class="col-12">
                <div class="table-proposed">
                  <StickyHeader height={400} className="table-responsive width-adjustment">
                
                    <table className="table table-bordered table-header-fixed">
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
                          <th>Material Code & Description.. </th>
                          <th>Req. Qty.</th>
                          <th> UOM </th>
                          <th> Val. Price </th>
                          <th> Plant </th>
                          <th> Delivery Date </th>
                          {/*<th> Required Date </th>*/}
                          <th> Desire Vendor </th>
                          <th> Material Group </th>
                          <th> Buyer </th>
                          <th> Tracking No </th>

                        </tr>
                      </thead>
                      <tbody className="table-header-fixed-min">
                        {Object.keys(groupByList).map((key, i) => {
                          console.log('groupByList',groupByList)
                          let itemData = groupByList[key];
                          let childs = !isEmptyDeep(itemData) ? itemData:[];
                          return (
                            <>
                            <tr>
                              <td>
                                <input type="checkbox" checked={this.state.checkedItems.includes(key)} onChange={this.onChecked.bind(this,key)} />
                              </td>

                              <td>{key}</td>
                              <td>
                              <button type="button" onClick={this.handleSelect.bind(this,itemData)} data-toggle="modal" className="btn btn-light" data-target="#viewPrDetail">View PR</button>
                              </td>
                            </tr>
                            {
                              !isEmptyDeep(childs) && childs.map((item,index) => {
                                return (
                                  <tr>
                                    <td colSpan="3"></td>
                                    <td >{formatDateWithoutTimeWithMonthName(item.pr.date)}</td>
                                    <td>{item.prLineNumber}</td>
                                    <td>{this.props.prStatusList[item.status]}</td>
                                    <td>{`${item.materialCode} - ${item.materialDesc}`}</td>
                                    <td>{item.reqQty}</td>
                                    <td>{item.uom}</td>
                                    <td>{item.price}</td>
                                    <td>{item.plant}</td>
                                    <td>
                                      <input
                                        type="date"
                                        className={"form-control"}
                                        max="9999-12-31"
                                          value={item.deliverDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,  "deliverDate",key,index);
                                        }}
                                      />
                                    </td>
                                    {/*<td>
                                      <input
                                        type="date"
                                        className={"form-control"}
                                          value={item.requiredDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,"requiredDate",key,index);
                                        }}
                                      />
                                    </td>*/}
                                   
                                    <td>{!isEmptyDeep(item.desiredVendor) ? `${item.desiredVendor.name ? `${item.desiredVendor.name} - `:''}${item.desiredVendor.userName ? item.desiredVendor.userName:''}`:'-'}</td>
                                    <td>{ `${item.matGrp ? `${item.matGrp} - `:''}${item.matGrpDesc ? item.matGrpDesc:''}`}</td>
                                    <td>
                                    <>
                                      <select
                                        className={"form-control"}
                                        onChange={(event) => {
                                          this.commonHandleChange(event, "buyer",key,index);
                                        }}
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

                                  </tr>
                                )
                              })
                            }
                            </>
                        )})}

                      </tbody>
                 
                    </table>

                  </StickyHeader>
                </div>
                <hr style={{ margin: "0px" }} />
                <button onClick={this.onSubmit} type="button" className="btn btn-outline-success float-right my-2 mr-4" >&nbsp;Submit</button>
              </div>
     </FormWithConstraints>
              </>
            :
            <>
              <table className="table table-bordered table-header-fixed">
                <thead>
                  <tr>
                    <th>PR No</th>
                    <th>PR Type</th>
                    <th>PR Date</th>
                    <th>Emp. Code</th>
                    <th>Emp. Name</th>
                    <th>Approver</th>
                    <th>Tech Approver..</th>
                    <th>Status</th>
                    <th>Release Date</th>
                    <th>Release Time</th>
                    <th>Approved Date</th>
                    <th>Approved Time</th>
                    <th>Purchase Manager Approver</th>
                    <th>PM Approved Date</th>
                    <th>PM Approved Time</th>
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.props.prList.map((pr, i) =>{
                    return (
                      <tr onClick={() => this.props.loadPRDetails(i)}>
                      <td>{pr.prNumber}</td>
                      <td>{pr.docType}</td>
                      <td>{pr.date}</td>
                      <td>{pr.releasedBy!=null?pr.releasedBy.empCode:""}</td>
                      <td>{pr.releasedBy!=null?pr.releasedBy.name:""}</td>
                      {/* <td>{pr.requestedBy.empCode}</td> */}
                      {/* <td>{pr.requestedBy.name}</td> */}
                      {/* <td>{pr.requestedBy.empCode!=""?pr.requestedBy.name:""}</td> */}
                      {/* <td>{pr.approver.name}</td> */}
                      <td>{pr.approvedBy!=null?pr.approvedBy.name:""}</td>
                      <td>{pr.tcApprover.name}</td>
                      <td>{this.props.prStatusList[pr.status]}</td>
                      <td>{pr.releasedDate!=null?formatDateWithoutTime(pr.releasedDate):""}</td>
                      <td>{pr.releasedDate!=null?formatTime(pr.releasedDate):""}</td>
                      <td>{pr.approvedDate!=null?formatDateWithoutTime(pr.approvedDate):""}</td>
                      <td>{pr.approvedDate!=null?formatTime(pr.approvedDate):""}</td>
                      <td>{pr.pmapprovedBy!=null?pr.pmapprovedBy.name:""}</td>
                      <td>{pr.pmapprovedDate!=null?formatDateWithoutTime(pr.pmapprovedDate):""}</td>
                      <td>{pr.pmapprovedDate!=null?formatTime(pr.pmapprovedDate):""}</td>
                    </tr>
                    )  
                  })}
                </tbody>
              </table>
              </>
              }
             
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
PRList.defaultProps = {
  loadPRDetails: () => null
}
const mapStateToProps=(state)=>{
  return state.prLineBuyerReducer;
};
export default connect(mapStateToProps,actionCreators)(PRList);
