import React, { Component } from "react";
import "../../css/Login.css";
import AlkylLogo from "../../img/Alkyl logo.png";
import RcLogo from "../../img/RC-Logo.jpg";
import Slide1 from "../../img/loginBack.jpg";
import Slide2 from "../../img/Dahej 2.JPG";
import serialize from 'form-serialize';
//import swal from 'sweetalert';
import {connect} from 'react-redux';
import * as actionCreators from '../Login/Action/Index';
import { login,getViewName } from '../../Util/APIUtils';
import {ACCESS_TOKEN,IS_USER_AUTHENTICATED} from '../../Constants/index';
import { Link } from 'react-router-dom';
import { home_url } from "../../Util/urlUtil";
import { TILES_URL } from "../../Constants/UrlConstants";
//import Captcha from "react-numeric-captcha";
import Captcha from './Captcha';
import './captcha.css';
import { FormWithConstraints,  FieldFeedbacks,   FieldFeedback } from 'react-form-with-constraints';
import { commonSetState } from "../../Util/ActionUtil";
import buttonLoader from "../../img/ButtonLoaders/buttonLoaderTheme.gif";
// import { ApplicationContext } from "../Context/ApplicationContext";
// import { showLoader } from "../../Util/CommonUtil";
// let load=false;
class Login extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      shown: true,
      email: '',
      usernameOrEmail: '',
      password: '',
      loginErrorMsg:"none",
      captchaErrorMsg:"none",
      serverErrorMsg:"none",
      captchaSuccess: false,
      refreshCaptcha: false,
      buttonLoader:false
      // tilesUrl:[]
      // load:false
    };
   // const TOKEN_LOGOUT_INTERVAL = 30000;
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount(){
    this.props.loadLogin();
  }
  handleChange = async (name, e) => {
    
    let change = {}
    const target = e.target;
    change[name] = e.value;
    this.setState(change);
    this.setState({
      [target.name]: target.value,
      loginErrorMsg:"none",
      captchaErrorMsg:"none"
    });
    await this.form.validateFields(target);
  }

  handleSubmit = event => {
    // load=true;
    event.preventDefault();
    
    if(this.state.captchaSuccess){
      const form = event.currentTarget;
      const values = serialize(form, {
        hash: true,
        empty: true
      })
      commonSetState(this,"buttonLoader",true);
      login(values).then(response => {
        if(response.status===200){
        //  commonSetState(this,"buttonLoader",true);
          let resp=null;
        response.json().then(json => {
        resp=json;
        // load=false;
        localStorage.setItem(ACCESS_TOKEN, resp.accessToken);
        localStorage.setItem(IS_USER_AUTHENTICATED, true);
        let tilesUrl = resp.tilesUrl.concat('custom');
        tilesUrl = tilesUrl.concat(['MaterialGetInContainer','MaterialGetInDetailContainer','TankerForm'])
        // console.log('tilesUrl',tilesUrl)
        localStorage.setItem(TILES_URL,JSON.stringify(tilesUrl));
        // let tmp=React.createContext(response.tilesUrl);
        // let con=this.context;
        // this.setState({
        //   tilesUrl:response.tilesUrl
        // })
        // setTimeout(()=>{
        //   this.props.TOKEN_LOGOUT_INTERVAL;
        // },5000);
        getViewName().then(response=>{
          commonSetState(this,"buttonLoader",false);
            // window.location.href="/"+response;
            window.location.href= home_url +response;
        });
      });      
      }else if(response.status===401){
        commonSetState(this,"buttonLoader",false);
        this.setState({
          loginErrorMsg:"block",
          captchaErrorMsg:"none",
          serverErrorMsg:"none",
          refreshCaptcha:true
        })
      }else{
        commonSetState(this,"buttonLoader",false);
        this.setState({
          loginErrorMsg:"none",
          captchaErrorMsg:"none",
          serverErrorMsg:"block",
          refreshCaptcha:true         
        })
      } 
    });   
  } else {
    commonSetState(this,"buttonLoader",false);
      this.setState({        
        loginErrorMsg:"none",
        captchaErrorMsg:"block",
        serverErrorMsg:"none", 
        refreshCaptcha:true
      })
    }  
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

  cancelForgot = () =>{
    this.setState({
      email:""
    });
    this.form.reset();
    this.toggle();
  }

  toggle() {
    
    this.setState({

      shown: !this.state.shown
    });
  }
  refreshcap=()=>{
    this.setState({ refreshCaptcha: false })
  }
  // getCustomLoader=(load)=>{
  //   return showLoader(load);
  // }

  click() {
    // toggle the type attribute
    const togglePassword = document.querySelector("#togglePassword");
    const passwordV = document.querySelector("#password_field");
         const type = passwordV.getAttribute("type") === "password" ? "text" : "password";
   // togglePassword.className === 'fa fa-eye viewpass mr-4 text-muted' ? document.getElementById("togglePassword").className = 'fa fa-eye-slash viewpass mr-4 text-muted' : document.getElementById("togglePassword").className = 'fa fa-eye viewpass mr-4 text-muted';
    passwordV.setAttribute("type", type);

}
  render() {
    var shown = {
			display: this.state.shown ? "block" : "none"
		};
		
		var hidden = {
			display: this.state.shown ? "none" : "block"
        }
        const { captchaSuccess } = this.state;
    return (
      <div>
        {/* {this.getCustomLoader(load)} */}
        {/* <ApplicationContext.Provider tile={this.state.tilesUrl}>
        </ApplicationContext.Provider> */}
        <div id="aa_particles"></div>
        <div className="loginContainer">
          <div className="loginLeft">
            <div id="demo" className="carousel slide h-100" data-ride="carousel">
              <ul className="carousel-indicators">
                <li data-target="#demo" data-slide-to="0" className="active"></li>
                <li data-target="#demo" data-slide-to="1"></li>
              </ul>
              <div className="carousel-inner h-100">
                <div className="carousel-item  h-100 active">
                  <img
                    src={Slide1}
                    alt="Los Angeles"
                    width="100%"
                    className="h-100"
                  />
                  {/* <div className="carousel-caption">
                    <h3>Latest Announcement</h3>
                    <p>We had such a great time in LA!</p>
                  </div> */}
                </div>
                <div className="carousel-item h-100">
                  <img src={Slide2} alt="Chicago" width="100%" className="h-100"/>
                  {/* <div className="carousel-caption">
                    <h3>Latest Announcement</h3>
                    <p>Thank you, Chicago!</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="loginRight">
          <div  style={ shown }>
          <FormWithConstraints className={this.state.readOnly===true?"readonly":""}
           ref={formWithConstraints => this.form = formWithConstraints}  onSubmit={this.handleSubmit} noValidate> 
            <div className="row">
              <div className="col-6">
                <img src={AlkylLogo} className="w-100 alkylLogo" alt="Alkyl" />
              </div>
              <div className="col-6">
                <img src={RcLogo} className="resLogo" alt="Rc" />{" "}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>User ID</label>
                  <input type="text" className="form-control noBorderRadius" onChange={this.handleChange.bind(this, "usernameOrEmail")} 
                  name = 'usernameOrEmail' value = {this.state.usernameOrEmail} required/>
                   <FieldFeedbacks for="usernameOrEmail">
                    <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks> 
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control noBorderRadius" id="password_field"
                  onChange={this.handleChange.bind(this, "password")} name = 'password' 
                  value ={this.state.password}  required />
                  <FieldFeedbacks for="password">
                    <FieldFeedback when="*"></FieldFeedback>
                  </FieldFeedbacks> 
                </div>
                <input type="checkbox" onClick={this.click} id="togglePassword"/> show password
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
              <Captcha onChange={status => this.setState({ captchaSuccess: status })} 
              refreshcap={this.refreshcap} refreshCaptchaFlag={this.state.refreshCaptcha}/>
                 {/* <Captcha
                 size={4}
                  onChange={status => this.setState({ captchaSuccess: status })}/> */}
             </div>
            </div>
            <div className="row">
              <div className="col-sm-12"><label className={"redspan "+this.state.loginErrorMsg}>Invalid User Name Or Password</label></div>
              <div className="col-sm-12"><label className={"redspan "+this.state.captchaErrorMsg}>Invalid Captcha</label></div>
              <div className="col-sm-12"><label className={"redspan "+this.state.serverErrorMsg}>Server Not Reachable</label></div>
            </div>
            {/* <div className="row">
              <div className="col-sm-12">
                <span id="SuccessMessage" className="success">
                  Hurray! Your have successfully entered the captcha.
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Captcha - Case Sensitive"
                />
                <span id="WrongCaptchaError" className="error"></span>
                <div className="CaptchaWrap">
                  <div id="CaptchaImageCode" className="CaptchaTxtField">
                    <canvas
                      id="CapCode"
                      className="capcode"
                      width="300"
                      height="80"
                    ></canvas>
                  </div>
                  <input
                    type="button"
                    className="ReloadBtn"
                    onclick="CreateCaptcha();"
                  />
                </div>
              </div>
            </div> */}
            <br />
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <button className="btn btn-info w-100 noBorderRadius blueButton" >
                  {/* disabled={!captchaSuccess} */}
                    {this.state.buttonLoader===true?<> <img src={buttonLoader} style={{width:"14px"}}/>&nbsp;Loging In</>:<>Login</>}
                  </button>
                </div>
              </div>
            </div>
            </FormWithConstraints>
            <div className="row">
              <div className="col-12">
                <Link  onClick={this.toggle} className="text16 ">
                  Forgot Password ?
                </Link>
              </div>
            </div>
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
            
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
   
  return state.login;
};

export default connect (mapStateToProps, actionCreators)(Login);  