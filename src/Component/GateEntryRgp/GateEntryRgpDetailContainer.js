import React, { Component } from "react";
import GateEntryRgpDetail from "./GateEntryRgpDetail";
import GateEntryRgpList from "./GateEntryRgpList";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil"; 
class GateEntryRgpDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadList:true,
      loadDetail:false,
      gateEntryId:""
    };
  }

  componentDidMount(){
    commonSubmitWithParam(this.props,"getGateEntryRgp","/rest/getAllGateEntry"); 
  }

  UNSAFE_componentWillReceiveProps=props=>{

  }

  loadList = ()=>{
    this.setState({loadList:true,loadDetail:false})
  }
  loadDetail = (gateEntryId)=>{
    commonSubmitWithParam(this.props,"getGateEntryLineRgp","/rest/getAllGateEntry",gateEntryId); 
    this.setState({loadList:false,loadDetail:true,gateEntryId:gateEntryId});
  }
  render() {
    return (
      <>
       <UserDashboardHeader/>
        <GateEntryRgpDetail
          loadList={this.loadList}
          gateEntryLineDto = {this.props.gateEntryLineDto}
        />
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.gateEntryRgpReducer;
};
export default connect(mapStateToProps,actionCreators)(GateEntryRgpDetailContainer);
