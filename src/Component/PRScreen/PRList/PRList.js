import React, { Component } from "react";
import { searchTableData,searchTableDataThree} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmptyDeep,isEmpty } from "../../../Util/validationUtil";
import {groupBy,includes} from 'lodash-es';
import { FormWithConstraints } from 'react-form-with-constraints';
import { ROLE_BUYER_ADMIN,ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN } from "../../../Constants/UrlConstants";
import formatDate, { formatDateWithoutTimeNewDate2, disablePastDate,formatDateWithoutTime,formatTime } from "../../../Util/DateUtil";
import { API_BASE_URL } from "../../../Constants";
import {
  commonHandleChangeCheckBox,
  showAlertAndReload,showAlert,
  commonSubmitWithParam
} from "../../../Util/ActionUtil";
import { isLoading, submitForm } from "../../../Util/APIUtils";
import { connect } from "react-redux";
import * as actionCreators from "../PRList/Action/Action";
import { getUserDto, getFileAttachmentDto,getDecimalUpto,removeLeedingZeros } from "../../../Util/CommonUtil";
import swal from "sweetalert";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Container,
  IconButton,
  Typography,
  Checkbox,
  ListItemText
} from "@material-ui/core";
import LoaderWithProps from "../../FormElement/Loader/LoaderWithProps";
import DataTable from "react-data-table-component";
class PRList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems:[],
      search: "",
      page: 0,
      rowsPerPage: 50,
      openModal:false,
      openModalNew:false,
      selectedItemsPr: [],
      selectedItemsPrPlant: [],
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
      isLoading:false
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
    
    console.log("this.state.selectedItem",this.state.selectedItem.prId);
    commonSubmitWithParam(this.props, "getDocuments", "/rest/getAttachmentbyPrId", this.state.selectedItem.prId);
    this.setState({loadGetDocuments:true})
  }

  // onChecked = (key) => {
  //   let {checkedItems} = this.state;
  //   let index = checkedItems.findIndex(c => c == key)
  //   if(index != -1) checkedItems.splice(index)
  //   else checkedItems.push(key)
  //   this.setState({checkedItems});
  // }
onChecked = (key) => {
  let { checkedItems } = this.state;
  let updatedItems = [...checkedItems];
  const index = updatedItems.findIndex(c => c === key);

  if (index !== -1) {
    updatedItems.splice(index, 1); // remove only 1 item at index
  } else {
    updatedItems.push(key);
  }

  this.setState({ checkedItems: updatedItems });
}

//   onSubmit = (e) => {
//     let {checkedItems,prList} = this.state;
//     let data = [];
//     if(isEmptyDeep(checkedItems)) return showAlert(true,"Please Select Item");
//     checkedItems.map((item) => {
//       let items = prList[item];
//       if(!isEmptyDeep(items)){
//         items = items.map(li => {
//           let itm = {prLineId:li.prLineId,pr:{prId:li.pr.prId,prStatus:li.pr.status},deliverDate:li.deliverDate,requiredDate:li.requiredDate,prLineNumber: li.prLineNumber}
//           if(!isEmptyDeep(li.buyer)){
//             itm = { ...itm,buyerId:Number(li.buyer.userId) }
//           }
//           return itm;
//         });
//         data = data.concat(items)
//       }
//       return item;
//     })

//     data.map(da =>{
// // if(da.pr.prStatus==="REL" || da.pr.prStatus==="CREATED"){
// //        showAlert(true,"PR is not released or accepted yet")
// //    //   swal("PR is not released or accepted yet")
// // }
// if(da.pr.prStatus!="ACPT"){
//   showAlert(true,"Buyer Cannot be assigned,Please Check PR Status")
// //   swal("PR is not released or accepted yet")
// }
// else
// {
//   submitForm(data,'/rest/updatePRBuyerAssignNew')
//     .then(res => {
//       if(res.success){
//         this.setState({checkedItems:[]})
//         showAlertAndReload(!res.success,res.message);
//       }else{
//         showAlert(true,res.message)
//       }
//     }).catch(err => {
//       showAlert(err.success,err.message)
//     })
//   }
// }
// )}
onSubmit = (e) => {
  const { checkedItems, prList } = this.state;

  if (isEmptyDeep(checkedItems)) {
    return showAlert(true, "Please Select Item");
  }

  // Filter and prepare data
  let data = prList
    .filter(item => checkedItems.includes(item.prLineId)) // or item.id or index
    .map(li => {
      let itm = {
        prLineId: li.prLineId,
        pr: {
          prId: li.pr?.prId,
          prStatus: li.pr?.status
        },
        deliverDate: li.deliverDate,
        requiredDate: li.requiredDate,
        prLineNumber: li.prLineNumber
      };

      if (!isEmptyDeep(li.buyer)) {
        itm = { ...itm, buyerId: Number(li.buyer.userId) };
      }

      return itm;
    });

  // Validation: all PRs must be ACPT
  const hasInvalidPR = data.some(da => da.pr.prStatus !== "ACPT");

  if (hasInvalidPR) {
    return showAlert(true, "Buyer cannot be assigned, Please check PR Status");
  }

  // Submit
  submitForm(data, '/rest/updatePRBuyerAssignNew')
    .then(res => {
      if (res.success) {
        this.setState({ checkedItems: [] });
        showAlertAndReload(!res.success, res.message);
      } else {
        showAlert(true, res.message);
      }
    })
    .catch(err => {
      showAlert(err.success, err.message);
    });
};

  componentWillReceiveProps(nextProps){
    let list = groupBy(nextProps.prList, 'prNumber');
    this.setState({prList: nextProps.prList})
    if(!isEmpty(nextProps.prList)){
      this.setState({isLoading:false})
    }
    if(this.state.loadGetDocuments && !isEmpty(nextProps.documents)){
      this.props.changeLoaderState(false);
      this.setGetDocuments(nextProps); 
    }else{
      this.props.changeLoaderState(false);
    }

  }

  // commonHandleChange(event,keyName,key,index){

  //   let {prList} = this.state;
  //   let prItems = prList[key];
  //   if(keyName == 'buyer'){
  //     let val = event.target.value;
  //     let buyer = null;
  //     if(!includes(['',null,undefined],val)) buyer = {userId: val};
  //     prItems[index] = {
  //       ...prItems[index],
  //       buyer
  //     }
  //   }else{
  //     prItems[index] = {
  //       ...prItems[index],
  //       [keyName]:event.target.value
  //     }
  //   }
  //   prList = {
  //     ...prList,
  //     [key]:prItems
  //   };
  //   this.setState({prList})
  // }
commonHandleChange(event, keyName, key, index) {
  let { prList } = this.state;
  let newList = [...prList];

  if (keyName === 'buyer') {
    let val = event.target.value;
    let buyer = null;
    if (!['', null, undefined].includes(val)) buyer = { userId: val };
    newList[index] = {
      ...newList[index],
      buyer,
    };
  } else {
    newList[index] = {
      ...newList[index],
      [keyName]: event.target.value,
    };
  }

  this.setState({ prList: newList });
}

  // handleSelect = (items) => {
  //   console.log('itemData',items[0],this.state)
  //   let pr = !isEmptyDeep(items[0]) && !isEmptyDeep(items[0].pr) ? items[0].pr:{};
  // //  let item = !isEmptyDeep(childs) ?  childs[0].pr:{};
  // //  this.setState({selectedItem:item})
  //   // if(!isEmptyDeep(item.prLineId)){
  //   //   commonSubmitWithParam(this.props,"getPRLines","/rest/getPRLinebyPrId",item.prLineId); 
  //   // }
  //  this.setState({selectedItem:{
  //    ...pr,
  //    prLineList:items
  //  }})
 
  // }
handleSelect = (item) => {
  // Identify all PR line items that belong to the same PR
  const prId = item.pr?.id || item.prId; // Use proper fallback
  const allPRLines = this.props.prList.filter(it => (it.pr?.id || it.prId) === prId);

  const pr = item?.pr ?? {};

  this.setState({
    selectedItem: {
      ...pr,
      prLineList: allPRLines
    }
  });
};


  // toggleChecked = (e) => {
  //   let {checked} = e.target;
  //   const groupByList = this.props.purchaseManager ? this.state.prList:this.props.prList;
  //   let checkedItems = [];
  //   if(checked) checkedItems = Object.keys(groupByList);
  //   this.setState({checked,checkedItems})
  // }
  toggleChecked = (e) => {
  const { checked } = e.target;
  const prList = this.props.purchaseManager ? this.state.prList : this.props.prList;
  
  let checkedItems = [];

 if (checked) {
  checkedItems = prList.map(item => item.prLineId);
}

  this.setState({ checked, checkedItems });
}

  clearFields = () => {
    this.props.onClearFilter(); // Calls parent's clearFilter
    this.setState({selectedItemsPr: [],selectedItemsPrPlant:[]})
  }
  handleFilterChange = (key,event) => {
    this.props.onFilterChange && this.props.onFilterChange(key,event.target.value);
  }

  handleFilterClick = () => {
    this.setState({openModal:false, openModalNew:false})
    this.props.onFilter &&  this.props.onFilter()
    this.clearFields();
  }

 
  handleSearchChange = (event) => {
    this.setState({ search: event.target.value });
    
  };
  handlePageChange = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChange = (key,event) => {
    const selectedValues = event.target.value; // The selected values (array of item.value)
    
    this.setState({
      selectedItemsPr: event.target.value,  // Update selected items
      selectedItemsPrPlant:event.target.value
    });
    this.props.onFilterChange && this.props.onFilterChange(key, selectedValues);
  };
  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 50), page: 0 });
  };
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
  onCloseModaNew=()=>{
    this.setState({
      openModalNew:false
    })
  }
  onOpenModalNew=()=>{
    this.setState({
      openModalNew:true
    })
  }
   handleRowClick = (row) => {
  
  this.props.loadPRDetails(row.prId);
};
render() {
    const { page, rowsPerPage, search , selectedItemsPr,selectedItemsPrPlant} = this.state;
    const {filterBuyerList,filterPlantList,filterPRStatusList,filterPurhaseGroupList,filter} = this.props;
    const groupByList = this.props.purchaseManager ? this.state.prList:this.props.prList;
    
    if(this.props.role == ROLE_BUYER_ADMIN) return null;
    const searchInObject = (obj, searchTerm) => {
      return Object.keys(obj).some((key) => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return searchInObject(value, searchTerm);
        }
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    };
  
    const filteredData = this.props.prList && this.props.prList.sort((a, b) => (b.date < a.date ? -1 : 1)).filter((entry) => {
      return searchInObject(entry, search);
    });
    const filteredData2 = this.props.prList && this.state.prList.sort((a, b) => (b?.pr?.date < a?.pr?.date ? -1 : 1)).map((item, index) => ({
          ...item,
          _rowIndex: index,
        }));
console.log(filteredData,"filteredData2")
// Object.keys(groupByList).forEach((key) => {
//   const itemData = groupByList[key];
//   // Push parent row (PR row)
//   filteredData2.push({
//     type: 'parent',
//     key,
//     itemData,
//   });

//   // Push children rows
//   if (itemData && itemData.length) {
//     itemData.forEach((childItem, index) => {
//       filteredData2.push({
//         type: 'child',
//         key,
//         index,
//         item: childItem,
//       });
//     });
//   }
// });

    const selectedItemsDisplay = filterPurhaseGroupList && filterPurhaseGroupList.filter(item => selectedItemsPr.includes(item.value));
    const selectedItemsDisplayPlant=filterPlantList && filterPlantList.filter(item=>selectedItemsPrPlant.includes(item.value));    
     const columns = [
      {
        name: 'PR No',
        selector: row => row.prNumber,
        sortable: true
      },
    {
        name: 'PR Type',
        selector: row => row.docType,
        sortable: true
      },
    
      {
        name: 'PR Date',
        selector: row => row.date, // raw date for sorting
        sortable: true,
        sortFunction: (a, b) => {
            const parseDate = (str) => {
              const [dd, mm, yyyy] = str.split('/');
              return new Date(`${yyyy}-${mm}-${dd}`);
            };
            return parseDate(a.date) - parseDate(b.date);
          }
      },
      {
        name: 'Emp. Code',
        selector: row => row.releasedBy!=null?row.releasedBy.empCode:"",
        sortable: true
      },
      {
        name: 'Emp. Name',
        selector: row => row.releasedBy!=null?row.releasedBy.name:"",
        sortable: true
      },
    {
        name: 'Approver',
        selector: row =>  row.releasedBy!=null?row.releasedBy.name:"",
        sortable: true
      },
    
      {
        name: 'Tech Approver',
        selector: row => row.tcApprover.name,
        sortable: true
      },
      {
        name: 'Status',
        selector: row => this.props.prStatusList[row.status],
        sortable: true
      },
      {
  name: 'Release Date',
  selector: row => row.releasedDate, // raw value for sorting
  cell: row => row.releasedDate ? formatDate(row.releasedDate) : '',
  sortable: true
},
{
  name: 'Release Time',
  selector: row => row.releasedDate, // raw value for sorting
  cell: row => row.releasedDate ? formatTime(row.releasedDate) : '',
  sortable: true
},
{
  name: 'Approved Date',
  selector: row => row.approvedDate,
  cell: row => row.approvedDate ? formatDate(row.approvedDate) : '',
  sortable: true
},
{
  name: 'Approved Time',
  selector: row => row.approvedDate,
  cell: row => row.approvedDate ? formatTime(row.approvedDate) : '',
  sortable: true
},
      {
        name: 'Purchase Manager Approver',
        selector: row => row.pmapprovedBy!=null?row.pmapprovedBy.name:"",
        sortable: true,
        wrap: true,
        grow: 2
      },
   {
  name: 'PM Approved Date',
  selector: row => row.pmapprovedDate,
  cell: row => row.pmapprovedDate ? formatDate(row.pmapprovedDate) : "",
  sortable: true,
  wrap: true,
  grow: 2
},
{
  name: 'PM Approved Time',
  selector: row => row.pmapprovedDate,
  cell: row => row.pmapprovedDate ? formatTime(row.pmapprovedDate) : "",
  sortable: true,
  wrap: true,
  grow: 2
}

    ]
    const columns2 = [
  {
    name: (
      <div>
        <input
          type="checkbox"
          checked={this.state.checked}
          onChange={this.toggleChecked}
          style={{ marginRight: 5 }}
        />
        Rel
      </div>
    ),
    cell: row =>
        <input
          type="checkbox"
          // checked={this.state.checkedItems.includes(row.prNumber)}
          // onChange={() => this.onChecked(row.prNumber)}
          checked={this.state.checkedItems.includes(row.prLineId)} // or row.id
          onChange={() => this.onChecked(row.prLineId)}
        />
      ,
    width: '80px',
    ignoreRowClick: true,
  },
  {
    name: 'PR No',
    selector: row => row.prNumber,
    width: '120px',
    sortable: true
  },
  {
    name: '',
    cell: row =>(
        <button
          type="button"
          onClick={() => this.handleSelect(row)}
          className="btn btn-light"
          data-toggle="modal"
          data-target="#viewPrDetail"
        >
          View PR
        </button>
      ),
    width: '100px',
    ignoreRowClick: true,
    button: true,
  },
  {
      name: 'PR Date',
      selector: row => row.pr?.date ?? '', // raw date for sorting
      cell: row => formatDateWithoutTimeNewDate2(row.pr?.date ?? ''), // formatted for display
      width: '140px',
      sortable: true
    },

  {
    name: 'Line No.',
    selector: row => removeLeedingZeros(row.prLineNumber),
    width: '100px',
    sortable: true
  },
  {
    name: 'Material Code & Description',
    selector: row =>`${row.materialCode} - ${row.materialDesc}`,
    minWidth: '250px',
    sortable: true,
    wrap: true,
    grow: 3
  },
  {
    name: 'Req. Qty.',
    selector: row => row.reqQty,
    width: '100px',
    sortable: true
  },
  {
    name: 'UOM',
    selector: row => row.uom ,
    width: '80px',
    sortable: true
  },
  {
    name: 'Val. Price',
    selector: row => row.price,
    width: '120px',
    sortable: true
  },
  {
    name: 'Plant',
    selector: row =>row.plantDesc
          ? `${row.plant} - ${row.plantDesc}`
          : row.plant,
    width: '140px',
    sortable: true,
    wrap: true,
    grow: 2
  },
  {
    name: 'Delivery Date',
    cell: row =>{
      const index = row._rowIndex;
      return(
      
        <input
          type="date"
          min={disablePastDate()}
          max="9999-12-31"
          className="form-control"
          value={row.deliverDate}
          onChange={(e) =>
            this.commonHandleChange(e, 'deliverDate', row.prNumber, index)
          }
          disabled={true}
        />
      )},
    width: '160px',
    sortable: true,
    wrap: true,
    grow: 2
  },
  {
    name: 'Material Group',
    selector: row =>`${row.matGrp ?? ''} - ${row.matGrpDesc ?? ''}`,
    minWidth: '180px',
    sortable: true,
    wrap: true,
    grow: 3
  },
  {
    name: 'Buyer',
    cell: row =>{
      const index = row._rowIndex;
      return(
        <select
          className="form-control"
          onChange={(e) =>
            this.commonHandleChange(e, 'buyer', row.prNumber, index)
          }
          value={row.buyer?.userId ?? ''}
          disabled={true}
        >
          <option value="">Select Buyer</option>
          {this.props.buyerList.map((buyer) => (
            <option key={buyer.userId} value={buyer.userId}>
              {buyer.name}
            </option>
          ))}
        </select>)}
        
        ,
    width: '160px',
    wrap: true,
    grow: 3
  },
  {
    name: 'Tracking No',
    selector: row => row.trackingNo,
    width: '140px',
    sortable: true
  },
];

    return (
      <>
<LoaderWithProps isLoading={this.state.isLoading} />
<div className="modal" id="viewPrDetail" >


<div className="modal documentModal" id="documentModal" >
            <div className="modal-dialog mt-100" style={{width:"800px", maxWidth:"800px"}}>
              <div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
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


    <div className="modal-dialog modal-dialog-centered modal-xl" style={{width:"800px", maxWidth:"800px", marginTop:"80px"}}>
      <div className="modal-content" style={{width:"800px", maxWidth:"800px"}}>
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
              {this.state.selectedItem.prNumber + " - "+ formatDateWithoutTimeNewDate2(this.state.selectedItem.date)}
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

              <Button variant="contained" size="small" color="primary" className={"display_block " + this.state.technicalReadOnly} type="button" data-toggle="modal" data-target="#multipleBuyerModal"><i className="fa fa-user" />&nbsp;Third Party Approver</Button>
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
                     placeholder="Search"
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
                           {!isEmpty(this.state.selectedItem.prLineList) && this.state.selectedItem.prLineList.map((prLine,i)=>{
                           return (<>
                               <tr class="accordion-toggle" >
                                 <th class="expand-button collapsed" id={"accordion" + i} data-toggle="collapse" data-parent={"#accordion" + i} href={"#collapse" + i}></th>
                               <td>{removeLeedingZeros(prLine.prLineNumber)}</td>
                               <td>{prLine.accountAssignment}</td>
                               <td>{prLine.i}</td>
                               <td>{prLine.materialCode+" - "+prLine.materialDesc}</td>
                               <td className="text-right">{prLine.reqQty}</td>
                               <td>{prLine.uom}</td>
                               <td className="text-right">{prLine.price}</td>
                               {/* <td>{prLine.plant}</td> */}
                               <td>{prLine.plantDesc!=null?prLine.plant+"-"+prLine.plantDesc:prLine.plant}</td>
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
                                               className={"h-100px form-control " + this.state.prLineReadOnly}
                                               
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
       
        <div className="row" >
    { [ROLE_REQUISTIONER_ADMIN,ROLE_APPROVER_ADMIN].includes(this.props.role) &&
        <>
         {this.state.openModal && <div className="customModal modal roleModal" id="updateRoleModal show" style={{ display: 'block' }}>
          <div className="modal-backdrop"></div>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <TextField label="Pr No From" 
                         variant="outlined" size="small" 
                         fullWidth  
                         value={filter.prNoFrom} 
                          onChange={this.handleFilterChange.bind(this,'prNoFrom')} 
                          InputLabelProps={{ shrink: true }}  
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Pr No To" 
                         variant="outlined" size="small" 
                         fullWidth  
                         value={filter.prNoTo} 
                         onChange={this.handleFilterChange.bind(this,'prNoTo')} 
                          InputLabelProps={{ shrink: true }}  
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Pr Release Date From" 
                        type="date"
                         variant="outlined" size="small" 
                         fullWidth  
                         value={filter.prDateFrom} max="9999-12-31" 
                         onChange={this.handleFilterChange.bind(this,'prDateFrom')} 
                          InputLabelProps={{ shrink: true }}  
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Pr Release Date To" 
                        type="date"
                         variant="outlined" size="small" 
                         fullWidth  
                         value={filter.prDateTo} max="9999-12-31"
                         onChange={this.handleFilterChange.bind(this,'prDateTo')}
                          InputLabelProps={{ shrink: true }}  
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
                        />
                    </Grid>
                    <Grid item xs={6}>
                                <FormControl fullWidth size="small" variant="outlined" 
                                 >
                                <InputLabel shrink >Status</InputLabel>
                                  <Select name="status" 
                                  value={filter.status} onChange={this.handleFilterChange.bind(this,'status')}
                                  label="Status" 
                                   sx={{ fontSize: 12, height: "15px",  } } >
                                    <MenuItem value="">Select</MenuItem>
                                    {!isEmptyDeep(filterPRStatusList) && filterPRStatusList.map((item) => (
                                      <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={6}>
                        <TextField label="Buyer" 
                         variant="outlined" size="small" 
                         fullWidth  
                         value={filter.buyerCode} 
                         onChange={this.handleFilterChange.bind(this,'buyerCode')}
                          InputLabelProps={{ shrink: true }}  
                          inputProps={{ style: { fontSize: 12, height: "15px",  } }}  
                        />
                    </Grid>
                    <Grid item xs={6}>
                                <FormControl fullWidth size="small" variant="outlined" 
                                 >
                                <InputLabel shrink >Plant</InputLabel>
                                  <Select name="plant" 
                                   value={filter.plant} onChange={this.handleFilterChange.bind(this,'plant')}
                                  label="Plant" 
                                   sx={{ fontSize: 12, height: "15px",  } } >
                                    <MenuItem value="">Select</MenuItem>
                                    {!isEmptyDeep(filterPlantList) && filterPlantList.map((item) => (
                                      <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                    </Grid>
      

       
<Grid item xs={12} style={{textAlign:"center"}} className="mt-2">
           <Button type="button" size="small" variant="contained" onClick={this.handleFilterClick.bind(this)} color="primary"> Search</Button>
            <Button size="small" color="secondary" variant="contained" type="button" className="ml-1" onClick={this.onCloseModal.bind(this)}>
            Cancel</Button>
            <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>
          </Grid>
       
        </div>
        </div>
        </div>}
        </>
        }
        
            {/* <StickyHeader height={450} className="table-responsive mt-2"> */}
              {this.props.purchaseManager ?
              <>
               {this.state.openModalNew && 
              <div className="modal roleModal customModal" id="updateRoleModal show" style={{ display: 'block' }}>
                <div className="modal-backdrop"></div><div className="modal-dialog modal-lg">
                  <div className="modal-content">
              <FormWithConstraints ref={formWithConstraints => this.prFormPurchase = formWithConstraints} onSubmit={this.onSubmit}>

              <Grid container spacing={2}>
  {/* PR Number Row */}
  <Grid item xs={12} container alignItems="center" spacing={2}>
   
    <Grid item xs={6}>
      <TextField
        label="PR NO. From"
        variant="outlined"
        size="small"
        fullWidth
        type="number"
        value={this.props.filter.prNoFrom}
        onChange={this.handleFilterChange.bind(this, 'prNoFrom')}
        InputLabelProps={{ shrink: true }}
        inputProps={{ style: { fontSize: 12, height: "15px" } }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        label="PR NO. To"
        variant="outlined"
        size="small"
        fullWidth
        type="number"
        value={this.props.filter.prNoTo}
        onChange={this.handleFilterChange.bind(this, 'prNoTo')}
        InputLabelProps={{ shrink: true }}
        inputProps={{ style: { fontSize: 12, height: "15px" } }}
      />
    </Grid>
  </Grid>

  {/* PR Release Date Row */}
  <Grid item xs={12} container alignItems="center" spacing={2}>
   
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
  </Grid>

  {/* Purchase Group Row */}
  <Grid item xs={12} container alignItems="center" spacing={2}>
    
    <Grid item xs={6}>
      {/* <FormControl fullWidth size="small" variant="outlined">
        <InputLabel shrink>Purchase Group From</InputLabel>
        <Select
          value={filter.purchaseGroupFrom}
          onChange={this.handleFilterChange.bind(this, 'purchaseGroupFrom')}
          label="Purchase Group From"
          sx={{ fontSize: 12, height: "15px" }}
        >
          <MenuItem value="">Select</MenuItem>
          {!isEmptyDeep(filterPurhaseGroupList) && filterPurhaseGroupList.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.display + "-" + item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
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

              
    
    {/* <Grid item xs={6}>
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel shrink>Purchase Group To</InputLabel>
        <Select
          value={filter.purchaseGroupTo}
          onChange={this.handleFilterChange.bind(this, 'purchaseGroupTo')}
          label="Purchase Group To"
          sx={{ fontSize: 12, height: "15px" }}
        >
          <MenuItem value="">Select</MenuItem>
          {!isEmptyDeep(filterPurhaseGroupList) && filterPurhaseGroupList.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.display + "-" + item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid> */}
  </Grid>

 
    
    <Grid item xs={6}>
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel shrink>Status</InputLabel>
        <Select
          value={filter.status}
          onChange={this.handleFilterChange.bind(this, 'status')}
          label="Status"
          sx={{ fontSize: 12, height: "15px" }}
        >
          <MenuItem value="">Select</MenuItem>
          {!isEmptyDeep(filterPRStatusList) && filterPRStatusList.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={6}>
              <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel shrink>Plant</InputLabel>

                      <Select
                  multiple
                  value={this.state.selectedItemsPrPlant}
                 // onChange={this.handleChange}
                  onChange={this.handleChange.bind(this,'multiplePlantList')}
                  sx={{ fontSize: 12, height: "15px" }}
                  renderValue={(selected) => {
                    // Display both item.display and item.value as selected items
                    return selectedItemsDisplayPlant.map(item => `${item.display} - ${item.value}`).join(", ");
                  }}  // Custom display for selected items
                >
                  {!isEmpty(filterPlantList) && filterPlantList.map((item, i) => (
                    <MenuItem  key={i + 1} value={item.value} style={{padding:"0px"}}>
                      <Checkbox size="small" checked={this.state.selectedItemsPrPlant.indexOf(item.value) > -1} />
                      <ListItemText className="customListItemText" primary={item.display + " - " + item.value} />
                    </MenuItem>
                  ))}
                </Select>
                      {/* <Select
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
                      </Select> */}
                    </FormControl>
         </Grid>
              
  </Grid>
</Grid>

           <div className="col-sm-12 text-center mt-4">
           <Button type="button" color="primary" variant="contained" size="small" onClick={this.handleFilterClick.bind(this)}> Search </Button>
           <Button type="button" color="secondary" className="ml-1" variant="contained" size="small" onClick={this.onCloseModaNew}> Cancel </Button>
           <Button type="button" size="small" variant="contained" color="primary" className="ml-1" onClick={this.clearFields.bind(this)}> Clear </Button>
   
        </div>

        </FormWithConstraints>
        </div>
        </div>
        </div>}

              <div class="col-12">
             
              <div className="row" >
                                 <div className="col-sm-9"></div>
                                 <div className="col-sm-3">
                                {/* <input type="text" id="SearchTableDataInputThree"
                                 //className="form-control" 
                                 onKeyUp={searchTableDataThree} placeholder="Search .." 
                                 style={{fontSize: "10px", float:"right" }}/>  */}
                                 <IconButton size="small" style={{float:"right", marginRight:"10px"}} 
                                 onClick={(this.onOpenModalNew)} color="primary">
                                  <i class="fa fa-filter"></i></IconButton>
                                 </div>
                                 </div>

               
                  <TableContainer className="mt-1">
                                            
                                              {/* <table className="my-table">
                              <thead>
                                <tr>
                                  <th>
                                    <input 
                                      type="checkbox" 
                                      checked={this.state.checked} 
                                      onChange={this.toggleChecked} 
                                      style={{marginRight: 5}} 
                                    />
                                    Rel
                                  </th>
                                  <th>PR No</th>
                                  <th></th>
                                  <th>PR Date</th>
                                  <th>Line No.</th>
                                  <th>Material Code & Description</th>
                                  <th>Req. Qty.</th>
                                  <th>UOM</th>
                                  <th>Val. Price</th>
                                  <th>Plant</th>
                                  <th>Delivery Date</th>
                                  <th>Material Group</th>
                                  <th>Buyer</th>
                                  <th>Tracking No</th>
                                </tr>
                              </thead>
                              <tbody id="DataTableBodyThree" className="table-header-fixed-min">
                                {Object.keys(groupByList).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key, i) => {
                                  let itemData = groupByList[key];
                                                      let childs = !isEmptyDeep(itemData) ? itemData:[];
                          return (
                            <>
                            <tr>
                              <td style={{minWidth:"20px"}}>
                                <input type="checkbox" checked={this.state.checkedItems.includes(key)} onChange={this.onChecked.bind(this,key)} />
                              </td>

                              <td style={{minWidth:"10px"}}>{key}</td>
                              <td>
                              <button type="button" onClick={this.handleSelect.bind(this,itemData)} data-toggle="modal" className="btn btn-light" data-target="#viewPrDetail">View PR</button>
                              </td>
                            </tr>
                            {
                              !isEmptyDeep(childs) && childs.map((item,index) => {
                                return (
                                  <tr>
                                    <td colSpan="3"></td>
                                    <td style={{minWidth:"20px"}}>{formatDateWithoutTimeNewDate2(item.pr.date!=null?item.pr.date:"")}</td>
                                    <td style={{minWidth:"20px"}}>{removeLeedingZeros(item.prLineNumber)}</td>
                                   
                                    <td>{`${item.materialCode} - ${item.materialDesc}`}</td>
                                    <td style={{minWidth:"5px"}}>{item.reqQty}</td>
                                    <td style={{minWidth:"26px"}}>{item.uom}</td>
                                    <td style={{minWidth:"20px"}}>{item.price}</td>
                                    <td style={{minWidth:"26px"}}>{item.plantDesc!=null?item.plant+"-"+item.plantDesc:item.plant}</td>
                                    <td>
                                      <input
                                        type="date" 
                                        min={disablePastDate()}
                                        max="9999-12-31"
                                        className={"form-control"}
                                          value={item.deliverDate}
                                        onChange={(event) => {
                                          this.commonHandleChange(event,  "deliverDate",key,index);
                                        }}
                                      />
                                    </td>
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
                          <TablePagination
                              rowsPerPageOptions={[50, 100, 150]}
                              component="div"
                              count={Object.keys(groupByList).length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={this.handlePageChange}
                              onRowsPerPageChange={this.handleRowsPerPageChange}
                            /> */}
                            <DataTable
                                columns={columns2}
                                data={filteredData2}
                                pagination
                                paginationPerPage={50}  
                                paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                                //onRowClicked={this.handleRowClick}
                              />
                  </TableContainer>
          
                <div className="col-sm-12 text-center">
                <hr style={{ margin: "0px" }} />
                <button onClick={this.onSubmit} type="button" className="btn btn-outline-success" >&nbsp;Submit</button>
              </div>

              </div>
    
              </>
            :
            <>
            <div className="wizard-v1-content">
        <Grid container >
                            <Grid item sm={12} className="mb-1">   
                            
                        <input
                          placeholder="Search"
                          // variant="outlined"
                          // size="small"
                          style={{fontSize: "10px", float:"right" }}
                          value={search}
                          onChange={this.handleSearchChange}
                        /><IconButton size="small" style={{float:"right", marginRight:"10px"}} onClick={(this.onOpenModal)} color="primary"><i class="fa fa-filter"></i></IconButton>
                        </Grid>
                        </Grid>
              <TableContainer>
              {/* <table className="my-table">
                <thead>
                  <tr>
                    <th>PR No</th>
                    <th>PR Type</th>
                    <th>PR Date</th>
                    <th>Emp. Code</th>
                    <th>Emp. Name</th>
                    <th>Approver</th>
                    <th>Tech Approver</th>
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
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pr, i) =>{
                    return (
                      <tr onClick={() => this.props.loadPRDetails(pr.prId)}>
                      <td>{pr.prNumber}</td>
                      <td>{pr.docType}</td>
                      <td>{pr.date}</td>
                      <td>{pr.releasedBy!=null?pr.releasedBy.empCode:""}</td>
                      <td>{pr.releasedBy!=null?pr.releasedBy.name:""}</td>
                     
                      <td>{pr.approvedBy!=null?pr.approvedBy.name:""}</td>
                      <td>{pr.tcApprover.name}</td>
                      <td>{this.props.prStatusList[pr.status]}</td>
                      <td>{pr.releasedDate!=null?formatDate(pr.releasedDate):""}</td>
                      <td>{pr.releasedDate!=null?formatTime(pr.releasedDate):""}</td>
                      <td>{pr.approvedDate!=null?formatDate(pr.approvedDate):""}</td>
                      <td>{pr.approvedDate!=null?formatTime(pr.approvedDate):""}</td>
                      <td>{pr.pmapprovedBy!=null?pr.pmapprovedBy.name:""}</td>
                      <td>{pr.pmapprovedDate!=null?formatDate(pr.pmapprovedDate):""}</td>
                      <td>{pr.pmapprovedDate!=null?formatTime(pr.pmapprovedDate):""}</td>
                    </tr>
                    )  
                  })}
                </tbody>
              </table> */}
              {/* <TablePagination
                              rowsPerPageOptions={[50, 100, 150]}
                              component="div"
                              count={filteredData.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={this.handlePageChange}
                              onRowsPerPageChange={this.handleRowsPerPageChange}
                            /> */}
                             <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                paginationPerPage={50}  
                                paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                                onRowClicked={this.handleRowClick}
                              />
              </TableContainer>
              </div>
              </>
              }
             
            {/* </StickyHeader> */}
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
