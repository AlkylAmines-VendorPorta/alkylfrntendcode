import React, { Component } from "react";
import MaterialGetInDetail from "./MaterialGetInDetail";
import MaterialGetInList from "./MaterialGetInList";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import { connect } from "react-redux";
import * as actionCreators from "./Action/Action";
import { commonSubmitWithParam,commonSubmitWithObjectParams } from "../../Util/ActionUtil"; 
import { isEmpty } from "lodash";

class MaterialGetInContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadList:true,
      loadDetail:false,
      gateEntryId:"",
      gateEntryDto:{}
    };
  }

  componentDidMount(){
    commonSubmitWithParam(this.props,"getMaterialGetIn","/rest/getAllMaterialGAteIn"); 
  }

  UNSAFE_componentWillReceiveProps=props=>{

  }

  loadList = ()=>{
    this.setState({loadList:true,loadDetail:false})
  }

  loadDetail = (item)=>{
    commonSubmitWithParam(this.props,"getMaterialGetInLineRgp","/rest/getMaterialLineId",item.gateInId); 
    this.setState({loadList:false, gateEntryDto:item, loadDetail:true});
    
  }
  render() {
    const gateEntryDto = this.state.gateEntryDto;
    // console.log('ssss',this.props,this.state.loadList);
    // console.log("dto",gateEntryDto);
    // console.log("gateEntry line",this.props.gateEntryLineDto);
    // console.log("gateEntry list",this.props.gateEntryList);
    return (
      <>
       <div className="w-100">
          <div className="mt-100 boxContent" >
        <div className="">
        <UserDashboardHeader/>
          {this.state.loadList?
            <MaterialGetInList
              loadDetail={this.loadDetail}
              gateEntryList = {this.props.gateEntryList}
              
            />
            :
            null
          }
          {!isEmpty(gateEntryDto.status)  && !(gateEntryDto.status==="GATE OUT")?
            <MaterialGetInDetail
              loadList={this.loadList}
              gateEntryCurrentDto={gateEntryDto}
              gateEntryLineDto = {this.props.gateEntryLineDto}
            />
            :
            null
          }
          {/* {"GATE OUT"===gateEntryDto.status?
            <GateEntryRgpDetail1
              loadList={this.loadList}
              gateEntryLineDto = {this.props.gateEntryLineDto}
            />
            :
            null
          } */}
        </div>
        </div>
        </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.materialGetInReducer;
};
export default connect(mapStateToProps,actionCreators)(MaterialGetInContainer);
