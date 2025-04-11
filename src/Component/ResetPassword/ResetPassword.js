import React, { Component } from "react";
import serialize from 'form-serialize';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionCreators from '../ResetPassword/ResetPasswordAction';
import swal from 'sweetalert';
import UserDashboardHeader from "../../Component/Header/UserDashboardHeader";
import { FormWithConstraints, Input, FieldFeedbacks, Async, FieldFeedback } from 'react-form-with-constraints-bootstrap4';
import { isEqual, omit } from 'lodash-es';
  class ResetPassword extends Component {

    state = this.getInitialState();

  getInitialState() {
    return {
      oldPassword:'',
      password: '',
      confirmPassword: '',
      signUpButtonDisabled: false,
      resetButtonDisabled: true
    };
  }
  shouldDisableResetButton(state) {
    const omitList = ['signUpButtonDisabled', 'resetButtonDisabled'];
    return isEqual(omit(this.getInitialState(), omitList), omit(state, omitList));
  }


  
  componentWillReceiveProps(props){
    
    if(props.hasError===true){
    let errors = props.error.map( (err, i) => err.errorMessage ).join(' | ');
         swal("Opps!",errors, "error");
       }
   
  } 

  handleChange = async e => {
    const target = e.target;

    this.setState({
      [target.name]: target.value
    });

    await this.forms.validateFields(target);

    this.setState(prevState => ({
      signUpButtonDisabled: !this.forms.isValid(),
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));
  }

  handlePasswordChange = async e => {
    const target = e.target;

    this.setState({
      [target.name]: target.value
    });

    await this.forms.validateFields(target, 'confirmPassword');

    this.setState(prevState => ({
      signUpButtonDisabled: !this.forms.isValid(),
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));
  }

  handleSubmit = async e => {
    

    e.preventDefault();
    const form = e.currentTarget;
    await this.forms.validateForm();
    const formIsValid = this.forms.isValid();

    this.setState(prevState => ({
      signUpButtonDisabled: !formIsValid,
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));

    if (formIsValid) {
      //alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
      
      const data = serialize(form.firstChild, {
          hash: true,
          empty: true
      });
      this.props.resetPassword(data); 
    }

  }

  handleReset = () => {
    this.setState(this.getInitialState());
    this.forms.resetFields();
    this.setState({resetButtonDisabled: true});
  }
    
  render() {
    const { oldPassword, password, confirmPassword, signUpButtonDisabled, resetButtonDisabled } = this.state;

    return (
      <React.Fragment>
        <div className="userbg">
        <UserDashboardHeader />
      <div className="page-content w-50">
      <div className="wizard-v1-content b-t">
      <div className="wizard-form" style={{boxShadow: "1px 2px 3px",  background: "#fff", padding: "10px", marginTop:"80px"}}>
          <h3 className="text-center">Reset Your Password</h3>
      <form  onSubmit={this.handleSubmit}>
      <FormWithConstraints ref={formWithConstraints => this.forms = formWithConstraints}
                           noValidate>
         
        <div className="form-group">
          <label htmlFor="username">Old Password </label>
          <Input type="password" id="username" name="oldPassword"
                 required minLength={3}
                 value={oldPassword} onChange={this.handlePasswordChange}
                 className="form-control" />
          <span className="input-state" />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when={value => value.length === 0}>Please fill out this field.</FieldFeedback>
            <FieldFeedback when="*" />
            <Async
              pending={<span className="d-block">...</span>}
              then={available => available ?
                <FieldFeedback key="1" info style={{color: '#28a745'}}>Username available</FieldFeedback> :
                <FieldFeedback key="2">Username already taken, choose another</FieldFeedback>
              }
            />
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <Input type="password" id="password" name="password"
                 innerRef={_password => this.password = _password}
                 value={password} onChange={this.handlePasswordChange}
                 required pattern=".{5,}"
                 className="form-control" />
          <span className="input-state" />
          <FieldFeedbacks for="password">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)}>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)}>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)}>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)}>Should contain special characters</FieldFeedback>
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div className="form-group">
          <label htmlFor="password-confirm">Confirm Password</label>
          <Input type="password" id="password-confirm" name="confirmPassword"
                 value={confirmPassword} onChange={this.handleChange}
                 required className="form-control" />
          <span className="input-state" />
          <FieldFeedbacks for="confirmPassword">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => value !== this.password.value}>Not the same password</FieldFeedback>
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>
        <div className="form-group">
          <button disabled={signUpButtonDisabled} className="btn btn-primary">submit</button>{' '}
          <button type="button" onClick={this.handleReset} disabled={resetButtonDisabled} className="btn btn-danger">Reset</button>
          {/* <Link to="/registration" className="btn btn-danger ml-2">Cancel</Link> */}
        </div>
     
      </FormWithConstraints>
      </form>
      </div>
      </div>
      </div>
      </div>
      </React.Fragment>
    );
  }
};

const mapStateToProps=(state)=>{
   
  return state.resetPassword;
};

export default connect (mapStateToProps, actionCreators)(ResetPassword); 
