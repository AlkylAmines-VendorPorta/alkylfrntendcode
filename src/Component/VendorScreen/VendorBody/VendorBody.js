import React, { Component } from "react";
import { connect } from "react-redux";
import { Box, Button, Card, Container, Grid, IconButton } from "@material-ui/core";
import { ArrowBack, Description } from "@material-ui/icons";

import PRList from "../VendorPRList/PRList";
import VendorList from "../../VendorScreen/VendorList/VendorList";
import VendorMaterials from "../../PRScreen/MaterialTableView/MaterialTableView";
import VendorMaterialsAdd from "../../PRScreen/MaterialTable/MaterialTable";



import * as actionCreators from "../VendorBody/Action/Action";
import { FormWithConstraints } from 'react-form-with-constraints';
import { commonSubmitForm, commonSubmitWithParam } from "../../../Util/ActionUtil";
import { isEmpty } from "../../../Util/validationUtil";

class VendorBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prMainContainer: true,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd: false,
      currentPrId: "",
      currentBidderId: "",
      currentBPartnerId: ""
    };
  }

  loadPRMainContainer = () => {
    this.setState({
      prMainContainer: true,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd: false
    });
  };

  hideShowForVendorList = () => {
    this.setState({
      prMainContainer: false,
      vendorListContainer: true,
      vendorMaterials: false,
      vendorMaterialsAdd: false
    });
  };

  loadVendorList = (index) => {
    let pr = this.props.prList[index];
    this.props.changeLoaderState(true);
    this.hideShowForVendorList();
    this.setState({ currentPrId: pr.prId });
    commonSubmitWithParam(this.props, "getEnquiries", "/rest/getEnquiries", pr.prId);
  };

  hideShowForVendorMaterials = () => {
    this.setState({
      prMainContainer: false,
      vendorListContainer: false,
      vendorMaterials: true,
      vendorMaterialsAdd: false
    });
  };

  loadVendorMaterials = (bidderId, bPartnerId) => {
    this.props.changeLoaderState(true);
    this.hideShowForVendorMaterials();
    this.setState({
      currentBidderId: bidderId,
      currentBPartnerId: bPartnerId
    });
    commonSubmitWithParam(this.props, "getItemByBidId", "/rest/getItemByBidId", bidderId);
  };

  loadVendorMaterialsAdd = () => {
    this.props.changeLoaderState(true);
    this.setState({
      prMainContainer: false,
      vendorListContainer: false,
      vendorMaterials: false,
      vendorMaterialsAdd: true
    });
    commonSubmitWithParam(this.props, "getUnAssignedPrLine", "/rest/getUnAssignedPrLine", this.state.currentBidderId, this.state.currentPrId);
  };

  render() {
    return (
      <Container maxWidth="lg">
        {this.state.prMainContainer && (
          <Card>
            <PRList
              prList={this.props.prList}
              prStatusList={this.props.prStatusList}
              loadPRDetails={(i) => this.loadVendorList(i)}
            />
          </Card>
        )}

        {this.state.vendorListContainer && (
          <Card>
            <VendorList
              loadContainer={this.loadPRMainContainer}
              loadVendorMaterials={this.loadVendorMaterials}
              vendorList={this.props.vendorList}
              changeLoaderState={this.changeLoaderState}
            />
          </Card>
        )}

        {this.state.vendorMaterials && (
          <Card>
            <Box display="flex" justifyContent="space-between" p={2}>
              <IconButton onClick={this.hideShowForVendorList}>
                <ArrowBack />
              </IconButton>
              <Button variant="outlined" color="primary" startIcon={<Description />} onClick={this.loadVendorMaterialsAdd}>
                Add Material
              </Button>
            </Box>
            <VendorMaterials itemBidList={this.props.itemBidList} />
          </Card>
        )}

        {this.state.vendorMaterialsAdd && (
          <Card>
            <FormWithConstraints
              onSubmit={(e) => {
                this.props.changeLoaderState(true);
                commonSubmitForm(e, this, "createUnAssignedPrLine", "/rest/createUnAssignedPrLine");
              }}
            >
              <input type="hidden" name="bidderList[0][bidderId]" value={this.state.currentBidderId} disabled={isEmpty(this.state.currentBidderId)} />
              <input type="hidden" name="bidderList[0][partner][bPartnerId]" value={this.state.currentBPartnerId} disabled={isEmpty(this.state.currentBPartnerId)} />
              <VendorMaterialsAdd prLineArray={this.props.prLineArray} />
              <Box display="flex" justifyContent="space-between" p={2}>
                <IconButton onClick={this.hideShowForVendorMaterials}>
                  <ArrowBack />
                </IconButton>
                <Button variant="outlined" color="primary" startIcon={<Description />} type="submit">
                  Save
                </Button>
              </Box>
            </FormWithConstraints>
          </Card>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => state.vendorBodyReducer;
export default connect(mapStateToProps, actionCreators)(VendorBody);

