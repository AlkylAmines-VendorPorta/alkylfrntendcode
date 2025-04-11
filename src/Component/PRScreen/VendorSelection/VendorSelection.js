
import React, { Component } from "react";
import {
    commonHandleFileUpload,
    commonSubmitForm,
    commonHandleChange,
    commonSubmitWithParam,
    commonHandleChangeCheckBox,
    commonSubmitFormNoValidation,
    commonSubmitFormNoValidationEnquiries,
    commonHandleReverseChangeCheckBox,
    commonSetState,
    validateForm,
    resetForm,
    swalWithTextBox
} from "../../../Util/ActionUtil";
import StickyHeader from "react-sticky-table-thead";
import * as actionCreators from "./Action/Action";
import { connect } from "react-redux";
import { isEmpty } from "lodash-es";
import { getUser1Dto, getUserDetailsDto, getJsonIgnorePartnerDto, getPartnerDto,getUser } from "../../../Util/CommonUtil";
import PRUserInvitation from "./PRUserInvitation/PRUserInvitation";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
class VendorSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadResultantTable: false,
            inqueryNumber:false,
            chargesType: [
                {
                    value: "lumpsum",
                    display: "Lumpsum"
                },
                {
                    value: "percent",
                    display: "%"
                },
                {
                    value: "quantity",
                    display: "Qty"
                },
                {
                    value: "atActual",
                    display: "At actual"
                }
            ],
            vsArray: {
                prNo: "pr1014",
                prDate: "2020-07-15",
                buyerName: "Buyer Name Demo",
                buyerCode: "buyer1001",
                priority: "medium",
                isTC: true,
                status: "Pending",
                documents: [],
                longText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis bibendum nec risus fringilla posuere. Aenean lacinia finibus justo, et placerat risus sodales suscipit. Nam id tincidunt quam, ac bibendum mauris. Suspendisse placerat in tortor ut malesuada. Nullam eget pharetra erat, non egestas orci. Sed sollicitudin tortor nisl, ac feugiat velit cursus non.",
                basicAmount: 150000,
                otherChargesTypeOnHeader: [
                    {
                        value: "header_level",
                        display: "Header Level"
                    },
                    {
                        value: "item_level",
                        display: "Item Level"
                    }
                ],
                otherChargesOnHeader: 25000,
                otherCharges: 15000,
                otherChargesType: "lumpsum",
                taxAmount: 1000,
                grossAmount: 100000,
                deliveryDate: "2020-07-20",
                rate: 1500,
                freight: 15000,
                freightType: "at_actual",
                packingAndFwd: 1200,
                packingAndFwdType: "percent",
                taxes: 18
            },
            vsLineArray: [
                {
                    lineNo: 1001,
                    materialCode: "MATE1001",
                    materialDesc: "Material Description 1",
                    reqQty: 5,
                    uom: "Litre",
                    basic: 15000,
                    otherCharge: 50,
                    taxes: 12,
                    gross: 12000,
                    plant: "Alkyl Plant 1",
                    requiredDate: "2020-07-15",
                },
                {
                    lineNo: 1002,
                    materialCode: "MATE1002",
                    materialDesc: "Material Description 2",
                    reqQty: 20,
                    uom: "Litre",
                    basic: 40000,
                    otherCharge: 50,
                    taxes: 12,
                    gross: 12000,
                    plant: "Alkyl Plant 2",
                    requiredDate: "2020-07-14",
                },
                {
                    lineNo: 1003,
                    materialCode: "MATE1003",
                    materialDesc: "Material Description 3",
                    reqQty: 34,
                    uom: "Litre",
                    basic: 12000,
                    otherCharge: 50,
                    taxes: 12,
                    gross: 12000,
                    plant: "Alkyl Plant 3",
                    requiredDate: "2020-07-22",
                },
                {
                    lineNo: 1004,
                    materialCode: "MATE1004",
                    materialDesc: "Material Description 4",
                    reqQty: 16,
                    uom: "Litre",
                    basic: 14000,
                    otherCharge: 50,
                    taxes: 12,
                    gross: 12000,
                    plant: "Alkyl Plant 4",
                    requiredDate: "2020-07-28",
                },
                {
                    lineNo: 1005,
                    materialCode: "MATE1005",
                    materialDesc: "Material Description 5",
                    reqQty: 5,
                    uom: "Litre",
                    basic: 15000,
                    otherCharge: 50,
                    taxes: 12,
                    gross: 12000,
                    plant: "Alkyl Plant 5",
                    requiredDate: "2020-07-20",
                },
            ],
            searchVendorNameOrEmail: "",
            loadSearchUserData: false,
            searchedUserList: [],
            addedUserList: [],
            loadInvitedVendor: false,
            enquiryId: {

            },
            bidEndDate: {
                bidEndDate: ""
            },
            bidEnquiries: {
                bidEnquiries: ""
            },
        }
    }

    componentWillReceiveProps = (props) => {
        console.log("props will-->> hii",props);
        if (this.state.loadSearchUserData && !isEmpty(props.userList)) {
            this.setUserDto(props.userList);
            this.setState({ loadSearchUserData: false });
        }
    }

    setUserDto = userList => {
        userList.map((el, i) => {
            this.state.searchedUserList.push(this.getUserData(el));
        })
    }

    getUserData = (el) => {
        let userDto = getUser1Dto(el);
        let user=getUser(el);
        //let userDto = getUserDto(el.createdBy);
        let userDetailsto = getUserDetailsDto(el.location);
       // let mbpartner=getMbPartnerDto(e1)
      //  let partner = getJsonIgnorePartnerDto(el.partner);
        let partner = getJsonIgnorePartnerDto(el);
        return { ...userDto, ...userDetailsto, isChecked: false, ...partner,...user }
    }

    searchVendor = () => {
        const str = this.state.searchVendorNameOrEmail;
        const split = str.split('.');
            console.log(split); // 👉️ [ 'BMW', '1996]' ]
            console.log(split[0]);
        commonSubmitWithParam(this.props, "searchVendorByName", "/rest/getvendor",split[0]);
       // commonSubmitWithParam(this.props, "searchVendorByName", "/rest/getVendorByName", this.state.searchVendorNameOrEmail);
        // commonSubmitWithParam(this.props, "searchVendorByName", "/rest/searchVendorForEnquiry", this.state.searchVendorNameOrEmail);
        // commonSubmitWithParam(this.props,"searchVendorByName","/rest/searchVendorForEnquiry",this.state.searchVendorNameOrEmail,this.props.prId);
        this.setState({
            loadResultantTable: true,
            loadSearchUserData: true,
            searchedUserList: []
        });

    }


    searchInquiry= () => {
        commonSubmitWithParam(this.props, "enquiryId", "/rest/addBidderToEnquiry", this.state.searchVendorNameOrEmail);
     
     this.setState({
            loadResultantTable: true,
            loadSearchUserData: true,
            searchedUserList: []
        });
    }



    searchVendorModalClose = () => {
        this.setState({
            searchedUserList:[],
            searchVendorNameOrEmail:"",
            loadResultantTable: false
        });
    }
    inqueryNumber = () =>{
        this.state.inqueryNumber=true;
       console.log('mohan', this.state.inqueryNumber);
    }
    addVendor = (e, i) => {
        if (e.target.checked) {
            let tempUser = this.state.searchedUserList[i];
            tempUser.isChecked = true;
            this.state.addedUserList.push(tempUser);

        } else if (e.target.checked === false) {
            this.state.addedUserList.splice(i, 1);

        }
    }

    handleIsMailSent = (e, i) => {
        let tempAddedUserList = [...this.state.addedUserList];
        if (e.target.checked) {
            tempAddedUserList[i].isMailSent = "Y";
        } else if (e.target.checked === false) {
            tempAddedUserList[i].isMailSent = "N";
        }
        this.setState({
            addedUserList: tempAddedUserList
        })
    }

    removeVendor = (i) => {
        let tempAddedUserList = [...this.state.addedUserList];
        tempAddedUserList.splice(i, 1);
        this.setState({
            addedUserList: tempAddedUserList
        })
    }

    addListedVendors = () => {

    }

    inviteExternalVendors = () => {

    }

    getHiddenFields = (el, i) => {
     console.log("getHIDDENFIELDS",el);
        return (
            <>
                <input
                    type="hidden"
                    name={"bidderList[" + i + "][partner][bPartnerId]"}
                    value={el.bPartnerId}
                    disabled={
                        !el.isChecked
                    }
                />

                 <input
                    type="hidden"
                    name={"bidderList[" + i + "][user][userId]"}
                    value={el.userId}
                    disabled={
                        !el.isChecked
                    }
                />

                <input
                    type="hidden"
                    name={"bidderList[" + i + "][pr][prId]"}
                    value={this.props.prId}
                    disabled={
                        !el.isChecked
                    }
                />
                <input
                    type="hidden"
                    name={"bidderList[" + i + "][isMailSent]"}
                    value={el.isMailSent!=null?el.isMailSent:"Y"}
                    disabled={
                        !el.isChecked
                    }
                />
            </>
        )
    }

    openResultantModal = () => {
        if (!isEmpty(this.state.searchedUserList)) {
            this.setState({ loadResultantTable: true })
        }
    }

    getInvitedVendorUserData = (user) => {
        let userDto = getUser1Dto(user);
        let userDetailsto = getUserDetailsDto(null);
        let partner = getPartnerDto(user.partner);
        let tempAddedUserList = [...this.state.addedUserList];
        tempAddedUserList.push({ ...userDto, ...userDetailsto, isChecked: true, ...partner });
        this.setState({ addedUserList: tempAddedUserList })
    }

    render() {
        var displayResultantTable = this.state.loadResultantTable ? "display_block" : "display_none";
       // console.log("this.state",this.state);
       const uniqueIds = [];

       const uniqueEmployees = this.state.addedUserList.filter(element => {
         const isDuplicate = uniqueIds.includes(element.empCode);
     
         if (!isDuplicate) {
           uniqueIds.push(element.empCode);
     
           return true;
         }
     
         return false;
       });
        return (
            <>
            <div style={{width:"100%", height:"5px"}}></div>
                <div className="card my-2 wizard-v1-content" style={{marginTop:"10px"}}>
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-2">
                            <div className="col-12">
                                <div class="d-flex">
                                    <Button color="primary" variant="contained" size="small" type="button" onClick={()=>{this.props.loadPREnquiry(false)}}><i className="fa fa-arrow-left" aria-hidden="true"></i></Button>
                                    <Button color="primary" variant="contained" size="small" className="ml-2" type="button" data-toggle="modal" data-target="#searchModal" onClick={() => this.openResultantModal()} ><i className="fa fa-search" />&nbsp;Search Vendor</Button>
                                    <Button color="primary" variant="contained" size="small" className="ml-2" type="button"  data-toggle="modal" data-target="#addNewModal"><i className="fa fa-user" />&nbsp;Invite External Vendor</Button>

    {this.props.prlistadd? null : 
    <>
      <div className="col-1">
      <span>Bid end date</span>
  </div>
  <div className="col-2">
      <input
          type="date"
          max="9999-12-31" 
          className={"form-control"}
          value={this.state.bidEndDate.bidEndDate}
          name="enquiry[bidEndDate]"
          onChange={(e) => {
              commonHandleChange(
                  e,
                  this,
                  "bidEndDate.bidEndDate"
              );
          }}
      />
      <input type="hidden" name="bidEndDate" value={this.state.bidEndDate.bidEndDate} />

  </div>
  </>
    }



                    {this.props.prlistadd?
                                <div className="col-2">
                        
                                <input type="hidden" name="bidEndDate" value={this.state.bidEndDate.bidEndDate} />
                                <input 
                                type='number' placeholder='Enter Inquiry No.' className={"form-control"} value={this.state.bidEnquiries.bidEnquiries} onChange={(e) => {
                                    commonHandleChange(
                                            e,
                                            this,
                                            "bidEnquiries.bidEnquiries"
                                        );
                                    }}
                                    
                                />


                            </div>

                    :null}  








                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card my-2 wizard-v1-content" >
                    <div className="lineItemDiv min-height-0px">
                        <div className="row px-4 py-1">
                            <div className="col-sm-12 mt-2">
                                    <TableContainer>
                                        <Table className="my-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="w-40per"> Vendor Code & Name / Email ID </TableCell>
                                                    <TableCell className="text-right w-10per"> District </TableCell>
                                                    <TableCell className="w-10per">State</TableCell>
                                                    <TableCell> Mail Required </TableCell>
                                                    <TableCell> Action </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {uniqueEmployees.map((el, i) =>
                                                    <TableRow key={i}>
                                                        {this.getHiddenFields(el, i)}
                                                        <TableCell>{" (" + el.empCode + " & " + el.vendorname + ")" + " " + el.email}</TableCell>
                                                        <TableCell className="text-right"> {el.districtname} </TableCell>
                                                        <TableCell>{el.regionname}</TableCell>
                                                       {/* <TableCell>{" (" + el.empCode + " & " + el.name + ")" + " " + el.email}</TableCell>
                                                        <td className="text-right"> {el.district.name} </TableCell>
                                                <TableCell>{el.state.name}</TableCell>*/}

                                                        <TableCell><input type="checkbox" defaultChecked={true}
                                                            onChange={(e) => this.handleIsMailSent(e, i)}
                                                        /></TableCell>
                                                        <TableCell className="w-10per"> <button type="button" onClick={() => this.removeVendor(i)} className="btn btn-sm btn-outline-danger mr-2"><i className="fa fa-times" /></button> </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                        </TableContainer>
                            </div>
                        </div>
                    </div>
                    <hr className="my-1" />
                    {/*{!isEmpty(this.state.addedUserList) && this.state.bidEndDate.bidEndDate?*/}
                    <div className="row px-4 py-0">
                        <div className="col-12">
                    {!isEmpty(this.state.addedUserList) && this.state.bidEndDate.bidEndDate?
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    onClick={(e) => { this.props.changeLoaderState(true); commonSubmitFormNoValidation(e, this, "createEnquiries", "/rest/createEnquiries") }}
                                    className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;
                                    Submit
                                </button>
                            </div>
                    :null}
                   {!isEmpty(this.state.bidEnquiries.bidEnquiries) && this.state.bidEnquiries.bidEnquiries?
                            <div className="d-flex justify-content-center">
                               <button
                                 type="button"
                                    onClick={(e) => {commonSubmitFormNoValidationEnquiries(e, this, "addBindderToEnquiry", "/rest/addBidderToEnquiry", this.state.bidEnquiries.bidEnquiries) }}
                                    className="btn btn-sm btn-outline-primary mr-2"><i className="fa fa-check" />&nbsp;
                                    Submit button
                                </button>
                            </div>

                    :null}
                        </div>
                    </div>
                    <div className="modal searchModal" id="searchModal" >
                        <div className="modal-dialog modal-xl mt-100">
                            <div className="modal-content">
                                <div className="modal-header">
                                    Search Vendor
                                    <button type="button" className={"close " + this.props.readonly} data-dismiss="modal" onClick={() => this.searchVendorModalClose()}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div class="row px-4 py-1">
                                        <div className="col-8 col-sm-8 col-lg-8">
                                            <div class="form-group">
                                                <label>Enter vendor code/name/Email ID</label>
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control " + this.props.readonly
                                                    }
                                                    value={this.state.searchVendorNameOrEmail}
                                                    onChange={(e) => {
                                                        commonHandleChange(e,this,"searchVendorNameOrEmail");
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4 col-sm-4 col-lg-4">
                                            <button type="button" style={{ marginTop: "22px" }} className="btn btn-sm btn-outline-primary mr-2" onClick={() => this.searchVendor()}><i className="fa fa-search" />&nbsp;Search Vendor</button>
                                        </div>
                                    </div>
                                    <section className={displayResultantTable}>
                                        <hr />
                                        <div class="row mt-1 px-4 py-1">
                                            <div className="col-12">
                                                
                                                        <Table className="my-table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="w-2per">Ch</TableCell>
                                                                    <TableCell className="w-25per"> Vendor Code & Name </TableCell>
                                                                    <TableCell className="w-15per">Email ID</TableCell>
                                                                    <TableCell className="text-right w-10per"> District </TableCell>
                                                                    <TableCell className="w-10per">State</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                            {/* {this.state.searchedUserList.map((el, i) => */}
                                                                {this.state.searchedUserList.sort((a, b) => a.vendorname > b.vendorname ? 1:-1).map((el, i) =>
                                                                    <TableRow key={i}>
                                                                        <TableCell>
                                                                            <input type="checkbox"
                                                                                onChange={(e) => this.addVendor(e, i)}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>{el.empCode+ " - " + el.vendorname}</TableCell>
                                                                        <TableCell>{el.email}</TableCell>
                                                                        <TableCell>{el.districtname}</TableCell>
                                                                        <TableCell>{el.regionname}</TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                <hr />
                                                <button type="button" className="btn btn-sm btn-outline-primary mr-2" data-dismiss="modal" onClick={() => this.setState({ loadResultantTable: false, searchedUserList:[], searchVendorNameOrEmail:"" })}><i className="fa fa-plus" />&nbsp;Add</button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal addNewModal" id="addNewModal" >
                        <div className="modal-dialog mt-100">
                            <div className="modal-content">
                                <div className="modal-header">
                                    Invite External Vendor
                                    <button type="button" className={"close " + this.props.readonly} data-dismiss="modal">&times;</button>
                                </div>



                                <div className="modal-body">
                                    <PRUserInvitation
                                        getInvitedVendorUserData={(userDto) => this.getInvitedVendorUserData(userDto)}
                                        changeLoaderState={this.props.changeLoaderState}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <FormWithConstraints  ref={formWithConstraints => this.inviteForm = formWithConstraints} 
                onSubmit={(e)=> { this.setState({loadSaveResp:true}); commonSubmitForm(e,this,"inviteResponse","/rest/register", "inviteForm")}} noValidate>
                     <label style={{color:'red'}}>{this.state.inviteMessage}</label>
                    <div className="modal addNewModal" id="addNewModal" >
                        <div className="modal-dialog mt-100">
                            <div className="modal-content">
                                <div className="modal-header">
                                    Invite External Vendor
                                    <button type="button" className={"close " + this.props.readonly} data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div class="row mt-1 px-4 py-1">
                                        <div className="col-12">
                                            <div class="form-group">
                                                <label>Email Id<span className="redspan">*</span></label>
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control " + this.props.readonly
                                                    }
                                                    name="email"
                                                    value={this.state.partner.email} 
                                                    onChange={(event)=>{commonHandleChange(event,this,"partner.email", "inviteForm")}}
                                                    onBlur={this.emailChangeHandler.bind(this)} />
                                                    <FieldFeedbacks for="email">
                                                        <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
                                                        <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address.</FieldFeedback>
                                                    </FieldFeedbacks> 
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div class="form-group">
                                                <label>Vendor Name</label>
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control " + this.props.readonly
                                                    }
                                                    className={this.state.isUserInvited?"form-control not-allowed " + this.props.readonly:"form-control" + this.props.readonly} 
                                                    name="partner[name]" disabled={this.state.isUserInvited}
                                                    value={this.state.partner.companyName} required
                                                    onChange={(event)=>{commonHandleChange(event,this,"partner.companyName", "inviteForm")}} />
                                                    <FieldFeedbacks for="partner[name]">
                                                    <FieldFeedback when="*"></FieldFeedback>
                                                    </FieldFeedbacks>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div class="form-group">
                                                <label>Company Name</label>
                                                <input
                                                    type="text"
                                                    className={
                                                        "form-control " + this.props.readonly
                                                    }
                                                // name={"otherDocuments[" + i + "][description]"}
                                                // value={el.description}
                                                // onChange={(e) => {
                                                //     commonHandleChange(
                                                //         e,
                                                //         this,
                                                //         "otherDocumentsList." + i + ".attachment.description"
                                                //     );
                                                // }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="button" style={{ marginTop: "22px" }} className="btn btn-sm btn-outline-primary mr-2" onClick={() => this.searchVendor()}><i className="fa fa-user" />&nbsp;Send Invitation</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </FormWithConstraints> */}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return state.vendorSelection
}
export default connect(mapStateToProps, actionCreators)(VendorSelection);