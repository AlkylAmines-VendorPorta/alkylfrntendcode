import React, { Component } from "react";
import alkylLogo from "../../img/Alkyl logo.png";
import Loader from './../../Component/FormElement/Loader/Loader';
import { commonSubmitWithParam } from "../../Util/ActionUtil";
import {ArrowLeft, ArrowRight, pushTiles, getDefaultSelectedDashboardList} from "../../Util/CommonUtil";
import { isEmpty } from "lodash-es";
import * as actionCreators from "./Action"
import { connect } from "react-redux";
import ScrollMenu from "react-horizontal-scrolling-menu";
//import { Link } from 'react-router-dom';
import { API_BASE_URL } from "../../Constants";
//import { Sidebar } from "@syncfusion/ej2-react-navigations";
import {NewHeader} from "../NewHeader/NewHeader";
import { MenuItem, ProSidebarProvider,Menu } from "react-pro-sidebar";
// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";
import { FiMenu } from "react-icons/fi";

import { IconContext } from "react-icons";

//Routing

import { Link } from "react-router-dom";
import "../../css/NewHeader.css";
import SubMenu from "../NewHeader/SubMenu";
import styled from 'styled-components';
import ASNReports from "../ASNReports/ASNReports";
// import {SidebarNav,SidebarWrap,Nav,NavIcon} from "../css/Newheader.css"
import DropdownLink from "../NewHeader/NewHeader";

const selected = 'item1';

class UserDashboardHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userEmail : "",
      userName:"",
      listOfUrls:[],
      onLoad:false,
      displayMenu: false,
      roleList:[],
      displayDropDown:false,
      toggle:false
    };
  }

  componentDidMount(props){
    commonSubmitWithParam(this.props,"populateUserDetails","/rest/loggedInUserDetails");
    this.setState({
      onLoad:true
    })



  }

  componentWillReceiveProps(props){
    if(!isEmpty(props.user)){
      this.setState({
        // userEmail : props.user.email
        userName:props.user.name
      })
    }
    if (this.state.onLoad===true  && (!isEmpty(props.user))) {
      commonSubmitWithParam(this.props, "getAccessMasterDtoByUsingRoleId", "/rest/getRoleAccessMaster", props.user.roles[0].roleId);

      this.setState({
        onLoad:false
      })
    }
    if (!isEmpty(props.accessMasterDto)) {     
      let val = pushTiles(props);
      // val = val.concat({code:'custom',name:'Custom',tileMasterId:200})
      this.setState({
        listOfUrls:val,
        onLoad:false
      })
    }
    if (!isEmpty(props.user.rolesList)) {
      
      let roleArray = Object.keys(props.user.rolesList).map((key) => {
        return { display: props.user.rolesList[key].name, value:props.user.rolesList[key].roleId };

      });
      this.setState({
        roleList: roleArray
      })
    }



  }





  onSelect = key => {
    this.setState({ selected: key });
  }

  handleLogout = () => {
    this.props.logout();
  }
  getDashboardList = (list) => {
    return Menu(list, getDefaultSelectedDashboardList(list));
  
  }

  showDropdownMenu = (event) => {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  };

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  };

  handleChangeRole=(roleId)=>{
    if(this.state.roleList.length!==1){
      commonSubmitWithParam(this.props, "changeRole", "/rest/changeRole", Number(roleId)); 
    }
  }

  openSidebar = () => {
    
    this.setState({showSidebar: !this.state.showSidebar})
    document.getElementById("togglesidebar").style.marginLeft="15%"
    document.getElementById("togglesidebar").style.width = "86%";
  //  document.getElementById("togglesidebar").style.display = "block";
}
 
closeSidebar=()=>{
  this.setState({showSidebar: !this.state.showSidebar})
  document.getElementById("togglesidebar").style.marginLeft="0px"
  document.getElementById("togglesidebar").style.width = "100%";

}



  render() {
    const listOfUrls = this.state.listOfUrls;
  
    const showSidebar=this.state.showSidebar;
 
    
    const mainCategory= listOfUrls.filter(cat => cat.parentId=='64');

    for (var a=0; a<listOfUrls.length; a++) {
      for (var b=0; b<listOfUrls.length; b++) {
      if(listOfUrls[a].parentId === listOfUrls[b].tileMasterId) {       
            if(!checkSubcategoryExist(listOfUrls[b].subCategory,listOfUrls[a].code)){
                 if(listOfUrls[b].subCategory){
            // listOfUrls[b].subCategory = [];
                       listOfUrls[b].subCategory.push(listOfUrls[a]);
                    }
              else{
                        listOfUrls[b].subCategory = [listOfUrls[a]]  
                   }          
        }
      }      
    }
  }

  const subCategory = listOfUrls.filter(a => {
    
    return typeof(a.subCategory) !== 'undefined';
     
  });
 
  function checkSubcategoryExist(listofsuburls,elementCode){
    let subcatexit = false;
    if(listofsuburls !== undefined ){
        listofsuburls.map(function (item, index) {
        if(item.code === elementCode){
          subcatexit = true;
        }
       
      });
      
    }
    return subcatexit;
    
  }



    return (
      <React.Fragment>
          <Loader/>
          {/* <nav className="navbar fixed-top navbar-expand-md flex-nowrap navbar-new-top"> */}
        <div className="navbar-new-top">
     <div className="d-flex position_relative">
      <Link to="#" className="menu-bars">
        <button className="btn btn-primary" style={{fontSize:11}} onClick={this.openSidebar}><FaIcons.FaBars  /> MENU
            
            </button>
          </Link>




          <a href="userdashboard" className="navbar-brand"><img src={alkylLogo} alt="" /></a>
          <div className="w-70per">
        {/*<div className="w-100per"> 
          <ScrollMenu
            data={this.getDashboardList(listOfUrls)}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={getDefaultSelectedDashboardList(listOfUrls)}
            onSelect={this.onSelect}
          />
          </div>*/}
          </div>
          {/*<ul className="navbar-nav mt-2 topnav">
            <li className="nav-item dropdown dmenu">
              <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
                <span className="userLabel"> Reports</span>
              </a>
              <div className="dropdown-menu sm-menu">
                <a className="dropdown-item" href="/asnreports">Change Password</a>
                <span className="dropdown-item" onClick={this.handleLogout} >Logout</span>
              </div>
            </li>
          </ul>*/}
          {/*<div className="navbar-nav ml-3 mt-3 topnav">
            <span className="userlabel" href="" style={{color:"white"}}>Reports</span>

            </div>*/}
    
          <ul className="navbar-nav ml-2 topnav">
            <li className="nav-item dropdown dmenu">
              <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
                <span className="userLabel"> {this.state.userName}</span><span className="userIcon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></span>
              </a>
              <div className="dropdown-menu sm-menu">
              {/* <a className="dropdown-item" href="/alkyl/resetpassword">Change Password</a> */}
                <a className="dropdown-item" href="/resetpassword">Change Password</a>
                <span className="dropdown-item" onClick={this.handleLogout} >Logout</span>
              </div>
            </li>
          </ul>

          <ul className="navbar-nav ml-2 mt-2 topnav">
            <li className="nav-item dropdown dmenu">
              <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardroprole" data-toggle="dropdown">
                <span className="userLabel"> Role </span>
              </a>
              <div className="dropdown-menu sm-menu">
                {(this.state.roleList).map((role,index) =>
                <span key={index} className={this.props.user.roles[0].roleId===role.value?"li-selected dropdown-item":"dropdown-item"} 
                  onClick={()=>this.handleChangeRole(role.value)} value={role.value}>
                  {role.display}
                </span>
              )}
              </div>
            </li>
          </ul>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <a href={API_BASE_URL+"/rest/downloadManual/User"} className="btn btn-primary" style={{fontSize:8}}>Download Manual</a>
      </div>
      <nav className={showSidebar ? "nav-menu active" : "nav-menu"}>
          
          <ul className="nav-menu-items" >
      
          <li className="navbar-toggle">
              <Link to="#" className="menu-bars" id="Link" onClick={this.closeSidebar} style={{color:'white', cursor: 'pointer'}}>
                {/* <AiIcons.AiOutlineClose /> */}
                
                <FaIcons.FaArrowLeft/>
              </Link>
            </li>
                 {/* <div className="dropdown"> */}
           { mainCategory.map((mainmenu,index)=>{
            
             return(
        <li className="dropdown"> <a className="dropbtn" key={index} href={mainmenu.code}>{mainmenu.name}</a></li>
            //  <li className="nav-text a"><Link key={index} to={mainmenu.code}>{mainmenu.name}</Link></li>
             )
           })}
           {/* </div> */}
            
            {subCategory.map((item, index) => {
              if (item.subCategory != undefined) {
              return(
              
              <SubMenu item={item} key={index} /> 
              )
            }
            })}



        {/* <nav className={showSidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" >
          <li className="navbar-toggle">
              <Link to="#" className="menu-bars" onClick={this.closeSidebar}>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {NewHeader.map((item, index) => {
              return <SubMenu className="nav-text a" item={item} key={index} />;
            })}
*/}
          </ul>
        </nav>

{/* 
          <div className="nav-link role-dropdown">
          <div
            className="dropdown-toggle"
            onMouseEnter={this.showDropdownMenu}
          >Role
          </div>
          {this.state.displayMenu ? (
            <ul x-placement="bottom-start" onMouseLeave={this.hideDropdownMenu}>
              {(this.state.roleList).map(role =>
                <li className={this.props.user.roles[0].roleId===role.value?"li-selected":""} 
                  onClick={()=>this.handleChangeRole(role.value)} value={role.value}>
                  {role.display}
                </li>
              )}
            </ul>
          ) : null}
        </div> */}
     </div>
       </div>
        
        {/* </nav> */}
    {/* <nav className="navbar fixed-top navbar-expand-md navbar-new-bottom">
        <div className="navbar-collapse collapse pt-2 pt-md-0" id="navbar2">

            <ul className="navbar-nav w-100 justify-content-center px-3">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">Link</a>
                </li>
            </ul>
        </div>
    </nav> */}
    </React.Fragment>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.dashboardHeaderRed;
};
export default connect (mapStateToProps,actionCreators)(UserDashboardHeader);