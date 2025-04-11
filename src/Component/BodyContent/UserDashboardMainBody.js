import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardContent, Typography, Grid, Divider, Box } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import { TrendingUp, ShoppingCart, Assignment } from "@material-ui/icons";
import * as actionCreators from "./Action";
import { commonSubmitWithParam } from "../../Util/ActionUtil";
import { isEmpty } from "lodash-es";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

class UserDashboardMainBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPoCount: "",
      acceptedPoCount: "",
      rejectedPoCount: "",
      releasedPoCount: "",
      openPoCount: "",
      openPoAsnCount: "",
      pendingPoBillBookingCount: "",
      loadUserDashboardDetails: false,
    };
  }

  componentDidMount() {
    commonSubmitWithParam(this.props, "getUserDashboardDetails", "/rest/userDashboardDetails");
    this.setState({ loadUserDashboardDetails: true });
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props) && this.state.loadUserDashboardDetails) {
      if (prevProps !== this.props) {
        this.setState({
          totalPoCount: this.props.totalPoCount,
          acceptedPoCount: this.props.acceptedPoCount,
          rejectedPoCount: this.props.rejectedPoCount,
          releasedPoCount: this.props.releasedPoCount,
          openPoCount: this.props.openPoCount,
          openPoAsnCount: this.props.openPoAsnCount,
          pendingPoBillBookingCount: this.props.pendingPoBillBookingCount,
        });
      }
    }
  }

  render() {
    return (
      <Box p={3} style={{marginTop:"80px"}}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  <TrendingUp /> Enquiries
                </Typography>
                <Divider />
                <Typography variant="body1">Open Enquiries: {this.state.openPoCount}</Typography>
                <Typography variant="body1">Open RFQs: {this.state.openPoAsnCount}</Typography>
                <Typography variant="body1">QCF In-process: {this.state.pendingPoBillBookingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="secondary" gutterBottom>
                  <ShoppingCart /> Purchase Orders
                </Typography>
                <Divider />
                <Typography variant="body1">Total PO's: {this.state.totalPoCount}</Typography>
                <Typography variant="body1">Released PO's: {this.state.releasedPoCount}</Typography>
                <Typography variant="body1">Open ASN/SEN: {this.state.openPoAsnCount}</Typography>
                <Typography variant="body1">Pending Bill Booking: {this.state.pendingPoBillBookingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <Assignment /> Reports
                </Typography>
                <Divider />
                <Bar
                  data={{
                    labels: ["Accepted", "Rejected", "Released"],
                    datasets: [
                      {
                        label: "PO Counts",
                        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
                        data: [
                          this.state.acceptedPoCount,
                          this.state.rejectedPoCount,
                          this.state.releasedPoCount,
                        ],
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = (state) => state.userDashBoardMainReducer;
export default connect(mapStateToProps, actionCreators)(UserDashboardMainBody);
