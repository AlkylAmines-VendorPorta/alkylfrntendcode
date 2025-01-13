import React, { Component } from "react";
import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
//import BootstrapTable from 'react-bootstrap-table-next';
import StickyHeader from "react-sticky-table-thead";
import PRList from "../VendorPRList/PRList";
import VendorList from "../../VendorScreen/VendorList/VendorList";
import VendorMaterials from "../../PRScreen/MaterialTableView/MaterialTableView";
import VendorMaterialsAdd from "../../PRScreen/MaterialTable/MaterialTable";
import {
  commonHandleFileUpload,
  commonSubmitForm,
  commonHandleChange,
  commonSubmitWithParam,
  commonHandleChangeCheckBox,
  commonSubmitFormNoValidation,
  commonHandleReverseChangeCheckBox,
  commonSetState,
  validateForm,
  resetForm,
  swalWithTextBox
} from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";
import { connect } from "react-redux";
import * as actionCreators from "../VendorBody/Action/Action";
import { getUserDto, getFileAttachmentDto, getPartnerDto } from "../../../Util/CommonUtil";
import { formatDateWithoutTime } from "../../../Util/DateUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
class VendorBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prMainContainer: true,
      vendorListContainer:false,
      vendorMaterials:false,
      vendorMaterialsAdd: false,
      prLineArray: [],
      loadPRLineList:false,
      prLineReadOnly:"readonly",
      currentPrId:"",
      currentBidderId:"",
      currentBPartnerId:""
    };
  }

  loadPRMainContainer() {
    this.setState({
      prMainContainer: true,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd: false
    });
  }

  hideShowForVendorList = () =>{
    this.setState({
      prMainContainer: false,
      vendorListContainer: true,
      vendorMaterials: false,
      vendorMaterialsAdd: false
      
    });
  }

  loadVendorList=(index)=> {
    let pr=this.props.prList[index];
    this.props.changeLoaderState(true);
    this.hideShowForVendorList();
    this.setState({
      currentPrId:pr.prId
    });
    commonSubmitWithParam(this.props,"getEnquiries","/rest/getEnquiries",pr.prId);
  }

  loadContainer = () =>{
    this.setState({
      prMainContainer: true,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd: false
    });
  }

  hideShowForVendorMaterials = () =>{
    this.setState({
      prMainContainer: false,
      vendorListContainer: false,
      vendorMaterials: true,
      vendorMaterialsAdd: false
      
    });
  }

  loadVendorMaterials=(bidderId,bPartnerId)=> {
    this.props.changeLoaderState(true);
    this.hideShowForVendorMaterials();
    this.setState({
      currentBidderId:bidderId,
      currentBPartnerId:bPartnerId
    });
    commonSubmitWithParam(this.props,"getItemByBidId","/rest/getItemByBidId",bidderId);
  }

  loadVendorMaterialsAdd=()=> {
    this.props.changeLoaderState(true);
    this.setState({
      prMainContainer: false,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd:true
    });
    commonSubmitWithParam(this.props,"getUnAssignedPrLine","/rest/getUnAssignedPrLine",this.state.currentBidderId,this.state.currentPrId);
  }

  componentWillReceiveProps = (props) => {
    if(!isEmpty(props.vendorList)){
      this.props.changeLoaderState(false);
    }else{
      this.props.changeLoaderState(false);
    }
    if(!isEmpty(props.itemBidList)){
      this.props.changeLoaderState(false);
    }else{
      this.props.changeLoaderState(false);
    }
    if(!isEmpty(props.prLineArray)){
      this.props.changeLoaderState(false);
    }else{
      this.props.changeLoaderState(false);
    }
    if(!isEmpty(props.saveStatus)){
      this.props.changeLoaderState(false);
    }else{
      this.props.changeLoaderState(false);
    }
  }

  render() {
    return (
      <>
      
        <div className="container-fluid mt-100 w-100">
        <div
            className={
              "card " +
              (this.state.prMainContainer == true
                ? "display_block"
                : "display_none")
            }
          >
              <PRList prList={this.props.prList} 
              prStatusList={this.props.prStatusList}
              loadPRDetails={(i) => this.loadVendorList(i)} />
          </div>

            <div
              className={
                "card " +
                (this.state.vendorListContainer == true
                  ? "display_block"
                  : "display_none")
              }
            >
              <VendorList
                loadContainer={this.loadContainer}
                loadVendorMaterials={(bidderId,bPartnerId) => this.loadVendorMaterials(bidderId,bPartnerId)}
                vendorList={this.props.vendorList}
                changeLoaderState={this.changeLoaderState}
              />
            </div>
            <div
              className={
                "card " +
                (this.state.vendorMaterials === true
                  ? "display_block"
                  : "display_none")
              }
            >
              <div className="row px-4 py-2">
                <div className="col-sm-12 mt-2 float-right">
                  <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.hideShowForVendorList()}><i className="fa fa-arrow-left" /></button>
                  <button type="button" className="btn btn-sm btn-outline-primary mr-2" onClick={() => this.loadVendorMaterialsAdd()} ><i className="fa fa-file" />&nbsp;Add Material</button>
                </div>
              </div>
              <VendorMaterials
                itemBidList={this.props.itemBidList}
              />
            </div>
            <div
              className={
                "card " +
                (this.state.vendorMaterialsAdd === true
                  ? "display_block"
                  : "display_none")
              }
            >
              <FormWithConstraints
                onSubmit={(e)=>{this.props.changeLoaderState(true); commonSubmitForm(e,this,"createUnAssignedPrLine","/rest/createUnAssignedPrLine")}}
              >
                <>
                  <input
                      type="hidden"
                      name={"bidderList["+0+"][bidderId]"}
                      value={this.state.currentBidderId}
                      disabled={
                          isEmpty(this.state.currentBidderId)
                      }
                  />
                  <input
                      type="hidden"
                      name={"bidderList["+0+"][partner][bPartnerId]"}
                      value={this.state.currentBPartnerId}
                      disabled={
                          isEmpty(this.state.currentBPartnerId)
                      }
                  />
                
                  <VendorMaterialsAdd 
                    prLineArray={this.props.prLineArray}
                  />
                  <div className="row px-4 py-2">
                    <div className="col-sm-12 mt-2 float-right">
                  <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.hideShowForVendorMaterials()}><i className="fa fa-arrow-left" /></button>
                      <button className="btn btn-sm btn-outline-primary mr-2" ><i className="fa fa-file" />&nbsp;Save</button>
                    </div>
                  </div>
                </>
              </FormWithConstraints>
            </div>
        </div>
        
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.vendorBodyReducer;
};
export default connect(mapStateToProps,actionCreators)(VendorBody);