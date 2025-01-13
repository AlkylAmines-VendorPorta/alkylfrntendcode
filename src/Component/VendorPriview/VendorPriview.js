import React, { Component } from "react";
import UserDashboardHeader from "../Header/UserDashboardHeader";
import GeneralInformation from "../VendorPriview/GeneralInformation/GeneralInformation";
import BankDetails from '../VendorPriview/BankDetails/BankDetails';
import VendorList from '../VendorApproval/VendorList/VendorList';
import KycDetails from '../VendorPriview/KycDetails/KycDetails';
import CompanyDetails from '../VendorPriview/CompanyDetails/CompanyDetails';
import IMSDetails from '../VendorPriview/IMSDetails/IMSDetails';
import VendorApprovalMatrix from '../VendorApproval/VendorApprovalMatrix/VendorApprovalMatrix';
import { submitToURL } from "../../Util/APIUtils";
import { isEmpty } from "lodash-es";
import { formatDateWithoutTimeWithMonthName } from "../../Util/DateUtil";
class VendorPriview extends Component {
    constructor (props) {
        super(props)
        this.state = {
          partner:{
            partnerId: "",
            userEmail: ""
          },
          readonly:"",
          partners:[{
            partnerId: "",
            userEmail: ""
          }],
          history:[]
        }
      }

  async componentDidMount(){
    if(!isEmpty(this.props.partner) && this.props.partner.partnerId){
      submitToURL(`/rest/getProfileHistory/${this.props.partner.partnerId}`).then(({objectMap}) => {
        let history = !isEmpty(objectMap.history) ? objectMap.history:[]
        this.setState({history})
      }).catch(err => {
      })
    }
  }

  render() {
    
    return (
        <React.Fragment>
            <UserDashboardHeader/>
        <div className="" id="togglesidebar">

        <div className="modal" id="historyBox" >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">History</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">

              <div className="row">
                <div className="col-sm-12 mt-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Serial No.</th>
                        <th>Date</th>
                        <th>Module</th>
                        <th>Field Name</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.history.map((item, index) =>
                        <tr className={this.state["selectedContact" + index]}>
                          <td>{index+1}</td>
                          <td>{formatDateWithoutTimeWithMonthName(item.created)}</td>
                          <td>{item.module}</td>
                          <td>{item.fieldName}</td>
                          <td>{item.oldValue} </td>
                          <td>{item.newValue}</td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                  <div className="clearfix"></div>
                </div>
              </div>

              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-primary" data-dismiss="modal">Ok</button> */}
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
              
            </div>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button type="button"  data-toggle="modal" data-target="#historyBox" className="btn btn-primary mr-1">History</button>
        </div>
          <GeneralInformation changeLoaderState={this.props.changeLoaderState} displayDiv="none" loadManuFacturerTab={false} showNonManufacturerTabs={this.showNonManufacturerTabs} 
            showManufacturerTabs={this.showManufacturerTabs} readonly="readonly" disabled="disabled" 
            partner={this.props.partner}/>
          <BankDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          <KycDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          <CompanyDetails changeLoaderState={this.props.changeLoaderState} readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>
          {this.props.loadManuFacturerTab?<IMSDetails readonly="readonly" disabled="disabled" displayDiv="none" partner={this.props.partner}/>:<></>}
          <VendorApprovalMatrix changeLoaderState={this.props.changeLoaderState} partner={this.props.partner}/>
        </div>
        </React.Fragment>
    );
  }
}
export default VendorPriview;