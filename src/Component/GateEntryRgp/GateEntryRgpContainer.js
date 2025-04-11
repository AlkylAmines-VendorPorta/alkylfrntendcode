import React, { Component } from "react";
import GateEntryRgpDetail from "./GateEntryRgpDetail";
import GateEntryRgpList from "./GateEntryRgpList";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil"; 
import GateEntryRgpDetail1 from "./GateEntryRgpDetail1";
import { isEmpty } from "lodash";
class GateEntryRgpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadList:true,
      loadDetail:false,
      gateEntryId:"",
      gateEntryDto:{},
      gateEntryLineDtoTest:[],
      isLoading:false
    };
  }

  changeLoaderState = (action) => {
    this.setState({
      isLoading: action
    });
  }

  componentDidMount(){
    commonSubmitWithParam(this.props,"getGateEntryRgp","/rest/getAllGateEntry"); 
  }

  UNSAFE_componentWillReceiveProps=props=>{

  }

  loadList = ()=>{
    this.setState({loadList:true,loadDetail:false})
  }
  loadDetail = (gateEntryDto)=>{
    debugger
    commonSubmitWithParam(this.props,"getGateEntryLineRgp","/rest/getGateEntryLineByGateEntryId",gateEntryDto.gateEntryId);
    commonSubmitWithParam(this.props,"getGateEntryLineByGateEntryIdTest","/rest/getGateEntryLineByGateEntryIdTest",gateEntryDto.gateEntryId);
    this.setState({loadList:false, gateEntryDto:gateEntryDto, loadDetail:true});
  }
  render() {
    const gateEntryDto = this.state.gateEntryDto;
    // console.log("dto",gateEntryDto.status);
    // console.log("loadlist",this.state.loadList)
    return (
      <>
       
          <div class="noprint">
        <UserDashboardHeader/>
        </div>
      
          {this.state.loadList?
            <GateEntryRgpList
              loadDetail={this.loadDetail}
              gateEntryList = {this.props.gateEntryList}
            />
            :
            null
          }
          {!isEmpty(gateEntryDto.status) && !(gateEntryDto.status==="GATE OUT")?
            <GateEntryRgpDetail
              loadList={this.loadList}
              gateEntryLineDto = {this.props.gateEntryLineDto}
            />
            :
            null
          }
          {"GATE OUT"===gateEntryDto.status?
            <GateEntryRgpDetail1
              loadList={this.loadList}
              gateEntryLineDto = {this.props.gateEntryLineDto}
            />
            :
            null
          }
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.gateEntryRgpReducer;
};
export default connect(mapStateToProps,actionCreators)(GateEntryRgpContainer);
