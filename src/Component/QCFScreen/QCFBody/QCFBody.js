import React, { Component } from "react";
// import { searchTableData, searchTableDataTwo } from "../../../Util/DataTable";
// import BootstrapTable from 'react-bootstrap-table-next';
// import StickyHeader from "react-sticky-table-thead";
// import { cloneTableWidth } from "../../../Helpers/GlobalFunctions";
// import { isEmpty } from "../../../Util/validationUtil";
import PRList from "../PRList/PRList";
import QCFHeaderInfo from "../QCFHeaderInfo/QCFHeaderInfo";
import QCFCompare from "../QCFCompare/QCFCompare";
import QCFSummary from "../QCFSummary/QCFSummary";
import QCFReport from "../QCFReport/QCFReport";
import QCFAnnexure from "../QCFAnnexure/QCFAnnexure";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import { commonSubmitForm } from "../../../Util/ActionUtil";
import { FormWithConstraints } from 'react-form-with-constraints';
import {
    commonSubmitWithParam
  } from "../../../Util/ActionUtil";
  import { getItemBidDto, getPartnerDto } from "../../../Util/CommonUtil";
import { isEmpty } from "../../../Util/validationUtil";
class QCFBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showQCFbtn:false,
            loadPrList:false,
            loadQcfInfo:false,
            qcfEdit: false,
            qcfSummary: false,
            qcfReport:false,
            qcfAnnexure:false,
            loadQCFDetails:false,
            qcfMap:[],
            enquiryId:"",
            pr:{
                prId:"",
                docType: "",
                prNumber: "",
                requestedBy:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                isTC:"",
                priority:"",
                status:"",
                approverCode: "",
                approverName: "",
                approvedBy:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                tcApprover:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                buyer:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                createdBy:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                approver:{
                  userId: "",
                  name: "",
                  empCode:""
                },
                date:""
              },

        };
    }

    componentDidMount(){
        this.setState({
            loadPrList:true
        })
    }

    componentWillReceiveProps(props){
        if((!isEmpty(props.priceBidList)) || (!isEmpty(props.annexureDto)))
        {
            this.props.changeLoaderState(false);
            this.showhideQCFGenerateBtn(props.priceBidList)
        } 
    }

    showhideQCFGenerateBtn=(priceBidList)=>{
        let priceBidArray=[];
        priceBidList.forEach((priceBid)=>{
           let status=priceBid.itemBid.bidder.status;
           if(!priceBidArray.includes(status)) {
            priceBidArray.push(status);
           }
        })

        if(priceBidArray.includes("SBMT") || priceBidArray.includes("DR") || priceBidArray.includes("RJCT")){
            this.setState({
              showQCFbtn:false
            })
          }else{
            this.setState({
              showQCFbtn:true
            })
          }
       
      }

   loadQCFDetails=(i)=>{
        let pr=this.props.prList[i];
        this.props.changeLoaderState(true);
        commonSubmitWithParam(this.props,"getQCF","/rest/getQCF",pr.prId ? pr.prId:pr.enquiryId);
        this.setState({
            enquiryId:pr.enquiryId
        })

        this.setState({
            loadQcfInfo:true,
            qcfEdit: true,
            // qcfAnnexure:false,
            qcfSummary: false,
            loadPrList:false,
            loadQCFDetails:false,
            pr:pr
        })
    }

    loadContainer = () =>{
        this.setState({
            loadPrList:true,
            loadQcfInfo:false,
            qcfEdit: false,
            qcfSummary: false,
            qcfReport:false,
            qcfAnnexure:false,
        });
    }

    loadCompare= () =>{
        this.setState({
            loadPrList:false,
            loadQcfInfo:true,
            qcfEdit: true,
            qcfSummary: false,
            qcfReport:false,
            qcfAnnexure:false,
        });
    }

    showAnnexure = () =>{
        this.setState({
            loadPrList:false,
            loadQcfInfo:false,
            qcfEdit: false,
            qcfSummary: false,
            qcfReport:false,
            qcfAnnexure:true,
        })
    }

    
    render() {

        return (
            <>
            <FormWithConstraints
                onSubmit={(e)=>{{commonSubmitForm(e,this,"submitAnnexure","/rest/submitAnnexure")}}}
            >
                <input
                    type="hidden"
                    name="annexureId"
                    value={this.props.annexureDto.annexureId}
                    disabled={isEmpty(
                        this.props.annexureDto.annexureId
                    )}
                />
                <div className="container-fluid mt-100 w-100" id="togglesidebar">
                    <div className={"card "+
                        (this.state.loadPrList == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <PRList
                            prList={this.props.prList}
                            prStatusList={this.props.prStatusList}
                            loadQCFDetails={(i) => this.loadQCFDetails(i)}
                            changeLoaderState={this.props.changeLoaderState} 
                        />
                    </div>
                    <div className={
                        (this.state.loadQcfInfo == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <QCFHeaderInfo
                            pr={this.state.pr}
                            prLineList={this.props.prLineList}
                        />
                    </div>
                    <div className={
                        (this.state.qcfEdit == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <QCFCompare 
                            loadContainer={this.loadContainer}
                            priceBidList={this.props.priceBidList}
                            bidderList={this.props.bidderList}
                            prLineList={this.props.prLineList}
                            showAnnexure={this.showAnnexure}
                            changeLoaderState={this.props.changeLoaderState}
                            annexureId={this.props.annexureDto.annexureId}
                            winnerSelectionList={this.props.winnerSelectionList}
                            role={this.props.role}
                            pr={this.state.pr}
                           
                            proposedReasonList={this.props.proposedReasonList}
                            optionProposedReasonList={this.props.optionProposedReasonList}
                            enquiryId={this.state.enquiryId}
                           
                            prId={this.state.pr.prId}
                            loadCompare={this.loadCompare}
                            enquiryDetails={this.props.annexureDto.enquiry}
                           loadApproverList={this.props.loadApproverList}
                           showQCFbtn={this.state.showQCFbtn}
                        />
                    </div>
                    <div className={
                        (this.state.qcfSummary == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <QCFSummary
                            loadContainer={this.loadContainer}
                            priceBidList={this.props.priceBidList}
                            bidderList={this.props.bidderList}
                            prLineList={this.props.prLineList}
                            changeLoaderState={this.props.changeLoaderState}
                        />
                    </div>
                    <div className={
                        (this.state.qcfReport == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <QCFReport
                            loadContainer={this.loadContainer}
                            priceBidList={this.props.priceBidList}
                            bidderList={this.props.bidderList}
                            prLineList={this.props.prLineList}
                            changeLoaderState={this.props.changeLoaderState}
                        />
                    </div>
                    <div className={
                        (this.state.qcfAnnexure == true
                          ? "display_block"
                          : "display_none")
                      }
                    >
                        <QCFAnnexure 
                            optionProposedReasonList={this.props.optionProposedReasonList}
                            prId={this.state.pr.prId}
                            loadCompare={this.loadCompare}
                            changeLoaderState={this.props.changeLoaderState}
                            annexureId={this.props.annexureDto.annexureId}
                            proposedReasonList={this.props.proposedReasonList}
                            enquiryId={this.state.enquiryId}
                            role={this.props.role}
                            loadApproverList={this.props.loadApproverList}
                          //  group1recepientmail={this.props.annexureDto.qcf_to_mailid}
                            annexureStatus={this.props.annexureDto.status}
                            enquiryDetails={this.props.annexureDto.enquiry}
                        />
                    </div>
                </div>
                </FormWithConstraints>
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return state.qcfBodyReducer;
  };
export default connect(mapStateToProps, actionCreators)(QCFBody);

