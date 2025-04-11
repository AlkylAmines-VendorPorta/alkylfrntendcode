import React, { Component } from "react";
import { TextField, Button, Grid, Paper, Typography, IconButton, CircularProgress } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { connect } from "react-redux";
import * as actionCreators from "../Login/Action/Index";
import { login, getViewName } from "../../Util/APIUtils";
import { ACCESS_TOKEN, IS_USER_AUTHENTICATED } from "../../Constants/index";
import { Link } from "react-router-dom";
import { home_url } from "../../Util/urlUtil";
import { TILES_URL } from "../../Constants/UrlConstants";
import Captcha from "./Captcha";
import AlkylLogo from "../../img/Alkyl logo.png";
import RcLogo from "../../img/RC-Logo.jpg";
import backgroundImage from "../../img/chemical_factory.jpg"; // Chemical Factory Background Image
import "../../css/Login.css";
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from "react-form-with-constraints";
import serialize from "form-serialize";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: "",
      password: "",
      showPassword: false,
      captchaSuccess: false,
      refreshCaptcha: false,
      buttonLoader: false,
      loginErrorMsg: false,
      captchaErrorMsg: false,
      serverErrorMsg: false,
      shown: true,
    };
  }

  componentDidMount() {
    this.props.loadLogin();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, loginErrorMsg: false, captchaErrorMsg: false });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.state.captchaSuccess) {
      this.setState({ captchaErrorMsg: true, refreshCaptcha: true });
      return;
    }
    
    this.setState({ buttonLoader: true });

    const values = { usernameOrEmail: this.state.usernameOrEmail, password: this.state.password };
    login(values).then((response) => {
      if (response.status === 200) {
        response.json().then((resp) => {
          localStorage.setItem(ACCESS_TOKEN, resp.accessToken);
          localStorage.setItem(IS_USER_AUTHENTICATED, true);
          localStorage.setItem(TILES_URL, JSON.stringify(resp.tilesUrl.concat(["custom"])));
          getViewName().then((res) => (window.location.href = home_url + res));
        });
      } else {
        this.setState({
          buttonLoader: false,
          loginErrorMsg: response.status === 401,
          serverErrorMsg: response.status !== 401,
          refreshCaptcha: true,
        });
      }
    });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  toggle=() =>{
    
    this.setState({

      shown: !this.state.shown
    });
  }
  cancelForgot = () =>{
    this.setState({
      email:""
    });
    this.form.reset();
    this.toggle();
  }
  handleForget = async e => {
    
    e.preventDefault();
    const form = e.currentTarget
    await this.form.validateForm();
    const formIsValid = this.form.isValid();
    if (formIsValid) {
      const data = serialize(form, {
        hash: true,
        empty: false
      })
      this.props.sendEmail(data);
      //forgetPasswordApi(data);
    }
  }

  render() {
    const { showPassword, buttonLoader, loginErrorMsg, captchaErrorMsg, serverErrorMsg } = this.state;
    var shown = {
			display: this.state.shown ? "block" : "none"
		};
		
		var hidden = {
			display: this.state.shown ? "none" : "block"
        }
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid item xs={11} sm={8} md={6} lg={4}>
          <Paper elevation={6} style={{ padding: "2rem", borderRadius: "10px", backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 0.8)" }}>
            
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={6}>
                <img src={AlkylLogo} alt="Alkyl" style={{ width: "100%" }} />
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <img src={RcLogo} alt="RC" style={{ width: "80px" }} />
              </Grid>
            </Grid>
            <div  style={ shown }>
            <form onSubmit={this.handleSubmit} style={{ marginTop: "1rem" }}>
              <TextField
                fullWidth
                label="User ID"
                variant="outlined"
                name="usernameOrEmail"
                onChange={this.handleChange}
                required
                style={{ marginBottom: "1rem" }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={this.handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={this.togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              <Captcha
                onChange={(status) => this.setState({ captchaSuccess: status })}
                refreshcap={() => this.setState({ refreshCaptcha: false })}
                refreshCaptchaFlag={this.state.refreshCaptcha}
              />

              {loginErrorMsg && <Typography color="error">Invalid Username or Password</Typography>}
              {captchaErrorMsg && <Typography color="error">Invalid Captcha</Typography>}
              {serverErrorMsg && <Typography color="error">Server Not Reachable</Typography>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: "1rem", padding: "0.75rem", fontSize: "1rem" }}
                disabled={buttonLoader}
              >
                {buttonLoader ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </form>

            <Grid container justifyContent="space-between" style={{ marginTop: "1rem" }}>
              <Link to="#" onClick={this.toggle} style={{ textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </Grid>
            </div>
            <div  style={ hidden }>
  {/* <form onSubmit={this.handleForget}> */}
  <FormWithConstraints className={this.state.readOnly===true?"readonly":""} ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleForget} noValidate>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1"  className="text-uppercase text-left width100">Email/User Id</label>
    <input type="text" name="userName" className="form-control" placeholder="Enter Email Address/User Id"
    value={this.state.email} required  onChange={this.handleChange.bind(this, 'email')}/> 
     <FieldFeedbacks for="email">
          <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
          {/* <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address.</FieldFeedback> */}
        </FieldFeedbacks>  
  </div>
  <div className="clearfix"></div>
    <div className="form-group">
        <button   className="btn btn-info w-100 noBorderRadius blueButton"> Send Confirmation</button>
    </div>    
    <div className="clearfix"></div>
    <div className="form-group top10">  
       <button type="button" onClick={() => this.cancelForgot()} className="btn btn-danger w-100 noBorderRadius"> Cancel</button>    
    </div>
  </FormWithConstraints>
  </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => state.login;
export default connect(mapStateToProps, actionCreators)(Login);
