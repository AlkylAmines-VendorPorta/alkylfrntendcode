import React, { Component } from "react";
import { searchTableData} from "../../../Util/DataTable";
import StickyHeader from "react-sticky-table-thead";
import { isEmpty } from "../../../Util/validationUtil";
import { connect } from "react-redux";
import { getUserDto, getUserDetailsDto, getPartnerDto, getBidDto } from "../../../Util/CommonUtil";
import * as actionCreators from "./Action/Action";
class VendorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadVendorList:false,
      vendorList:[]
    };
  }

  componentDidMount(){
    this.setState({
      loadVendorList:true
    })
  }

  componentWillReceiveProps= props=>{

    if(this.state.loadVendorList && !isEmpty(props.vendorList)){
      this.setVendorList(props);
      this.setState({loadVendorList:false});
    }
  }

  setVendorList=props=>{
    props.vendorList.map((el,i)=>{
      this.state.vendorList.push(this.getVendorData(el));
    })
  }

  getVendorData=(el)=>{
    let bidder=getBidDto(el);
    let userDetailsto=getUserDetailsDto(null);
    let partner=getPartnerDto(el.partner);
    let userDto=getUserDto(null);
    return {...bidder, ...userDto, ...userDetailsto,isChecked:false,...partner }
  }

//   getHiddenFields=(el,i)=>{
//     
//     return (
//         <>
//             <input
//                 type="hidden"
//                 name={"bidderList["+i+"][partner][bPartnerId]"}
//                 value={el.bPartnerId}
//                 disabled={
//                     !el.isChecked
//                 }
//             />
            
//             <input
//                 type="hidden"
//                 name={"bidderList["+i+"][pr][prId]"}
//                 value={this.props.prId}
//                 disabled={
//                     !el.isChecked
//                 }
//             />
//         </>
//     )
// }

  render() {
    return (
      <>
        <div className="row px-4 py-2">
          <div className="col-sm-9">
            <button type="button" className={"btn btn-sm btn-outline-info mr-2 "} onClick={() => this.props.loadContainer()}><i className="fa fa-arrow-left" /></button>
          </div>
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
              <table className="my-table">
                <thead>
                  <tr>
                    <th className="w-25per"> Vendor Code & Name </th>
                    {/* <th className="w-15per">Email ID</th>
                    <th className="text-right w-10per"> District </th>
                    <th className="w-10per">State</th> */}
                  </tr>
                </thead>
                <tbody id="DataTableBody">
                  {this.state.vendorList.map((el,i) => 
                    <tr onClick={() => this.props.loadVendorMaterials(el.bidderId,el.bPartnerId)} key={i}>
                        {/* {this.getHiddenFields(el,i)} */}
                        <td>{" (" + el.vendorSapCode +" & "+ el.name+")"}</td>
                        {/* <td>{el.email}</td>
                        <td className="text-right"> {el.district.name} </td>
                        <td>{el.state.name}</td> */}
                    </tr>
                  )}
                </tbody>
              </table>
            </StickyHeader>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps=(state)=>{
  return state.vendorListReducer;
};
export default connect(mapStateToProps,actionCreators)(VendorList);