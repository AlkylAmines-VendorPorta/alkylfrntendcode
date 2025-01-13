import React, { Component } from "react";
import alkylLogo from "../../img/Alkyl logo.png";
import { ACCESS_TOKEN } from '../../Constants/index';
import Loader from './../../Component/FormElement/Loader/Loader';
import * as actionCreators from "./Action"
import { isEmpty } from "../../Util/validationUtil";
import { commonSubmitWithParam } from "../../Util/ActionUtil";
import { connect } from "react-redux";
import { Menu, ArrowLeft, ArrowRight, pushTiles, getDefaultSelectedDashboardList } from "../../Util/CommonUtil";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { API_BASE_URL } from "../../Constants";
// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";
import { FiMenu } from "react-icons/fi";

import { IconContext } from "react-icons";

// ROUTING

import { Link } from "react-router-dom";
import "../../css/NewHeader.css";
import SubMenu from "../NewHeader/SubMenu";

class VendorDashboardHeader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      userEmail : "",
      userName:"",
      listOfUrls:[],
      onLoad:false,
      displayMenu: false,
      roleList:[],
      status:""
    };
  }

  componentDidMount(){
    commonSubmitWithParam(this.props,"populateUserDetails","/rest/loggedInUserDetails");
    this.setState({
      onLoad:true
    })
  }

  componentWillReceiveProps(props){
    if(!isEmpty(props.user)){
      let id =props.user.userDetails!=null?props.user.userDetails.name:"",status="";
      if(!isEmpty(props.user.partner) && !isEmpty(props.user.partner.vendorSapCode)){
        id = id + ' - ' + props.user.partner.vendorSapCode;
        status = props.user.partner.status;
      }
      this.setState({
        // userEmail : id
        userName:id,
        status:status
      })
    }


    if (this.state.onLoad===true && (!isEmpty(props.user))) {
      
      commonSubmitWithParam(this.props, "getAccessMasterDtoByUsingRoleId", "/rest/getRoleAccessMaster", props.user.roles[0].roleId);

      this.setState({
        onLoad:false
      })
    }

    if (!isEmpty(props.accessMasterDto)) {
      
      this.setState({
        listOfUrls:pushTiles(props),
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
  
  handleLogout = () => {
    this.props.logout();
  }

  onSelect = key => {
    this.setState({ selected: key });
  }

  getDashboardList = (list) => {
    return Menu(list, getDefaultSelectedDashboardList(list),this.state.status);
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
    
    if(!isEmpty(roleId) && this.state.roleList.length!==1){
      commonSubmitWithParam(this.props, "changeRole", "/rest/changeRole", Number(roleId));
    }
  }
  openSidebar = () => {
    
    this.setState({showSidebar: !this.state.showSidebar})
    document.getElementById("togglesidebar").style.marginLeft="200px"
}
 
closeSidebar=()=>{
  this.setState({showSidebar: !this.state.showSidebar})
  document.getElementById("togglesidebar").style.marginLeft="0px"

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
      {/* <nav className="navbar navbar-expand-md bg-primary navbar-dark fixed-top">
        <a className="navbar-brand" href="vendordashboard">
          <img src={alkylLogo} alt="logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav menu-list"> */}
            {/* <li className="nav-item">
              <a className="nav-link active" href="workingpagevendor">
                <i className="fa fa-tachometer" aria-hidden="true"></i>
                &nbsp;Dashboard
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link" href="registration">
                <i className="fa fa-user" aria-hidden="true"></i>&nbsp;Profile
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="purchaseorder">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                &nbsp;Purchase Order
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link" href="gateentry">
                <i className="fa fa-bell" aria-hidden="true"></i>&nbsp;Gate Entry
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link" href="workingpagevendor">
                <i className="fa fa-file-text" aria-hidden="true"></i>&nbsp;Reports
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="workingpagevendor">
                <i className="fa fa-list-alt" aria-hidden="true"></i>
                &nbsp;Transaction
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="workingpagevendor">
                <i className="fa fa-list-alt" aria-hidden="true"></i>&nbsp;Sales
              </a>
            </li> */}
{/* {this.state.listOfUrls.map(urls => (
                <li className="nav-item">
                  <a className="nav-link" href={urls.code}>
                    <i className="fa fa-user" aria-hidden="true"></i>&nbsp;{urls.name}
                  </a>
                </li>
              ))
              }


          </ul>
          <ul className="navbar-nav ml-2 topnav">
            <li class="nav-item dropdown dmenu">
            <a class="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
          <span class="userLabel text-white"> {this.state.userName}</span><span class="userIcon"><i class=" text-white fa fa-user-circle-o" aria-hidden="true"></i></span>
            </a>
            <div class="dropdown-menu sm-menu">
              <a class="dropdown-item" href="/registration#">Profile</a>
              <a class="dropdown-item" href="/resetpassword">Change Password</a>
              <a class="dropdown-item" onClick={this.handleLogout} href="/">Logout</a>
            </div>
          </li>
        </ul>
        </div>
      </nav> */}
       {/* <div class="navbar-new-top">
          <div class="d-flex position_relative">
            <a href="userdashboard" class="navbar-brand"><img src={alkylLogo} alt="" /></a>
            <div class="w-70per">
              <div class="w-100per">
                <ScrollMenu
                  data={this.getDashboardList(this.state.listOfUrls)}
                  arrowLeft={ArrowLeft}
                  arrowRight={ArrowRight}
                  selected={getDefaultSelectedDashboardList(this.state.listOfUrls)}
                  onSelect={this.onSelect}
                />
              </div>
            </div> */}

            <>
      
      <div class="navbar-new-top" id="navbar">
      <div className="d-flex position_relative">
 
       {/* <Link to="#" className="menu-bars">
             <FaIcons.FaBars onClick={this.openSidebar} />
           </Link>
  */}
           <Link to="#" className="menu-bars">
        <button className="btn btn-primary" style={{fontSize:11}} onClick={this.openSidebar}><FaIcons.FaBars  /> MENU
            
            </button>
          </Link>
 
 
           <a href="vendordashboard" className="navbar-brand"><img src={alkylLogo} alt="" /></a> &nbsp;&nbsp;
            {/* <span class="userLabel text-white"> {this.state.userName}</span> */}
           {/* {this.state.userName} */}
                       <div className="display_contents">
                
              {/* <ul className="navbar-nav ml-2 topnav">
              <li class="nav-item dropdown dmenu">
                <a class="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
                  <span class="userLabel"> Select Role</span><span class="userIcon"><i class="fa fa-user-circle" aria-hidden="true"></i></span>
                </a>
                <div class="dropdown-menu sm-menu">
                  <a class="dropdown-item" href="/resetpassword">Role 1</a>
                  <a class="dropdown-item" href="/resetpassword">Role 2</a>
                  <a class="dropdown-item" href="/resetpassword">Role 3</a>
                  <a class="dropdown-item" href="/resetpassword">Role 4</a>
                </div>
              </li>
              </ul> */}
              <ul className="navbar-nav ml-25 topnav">
              <li class="nav-item dropdown dmenu">
                <a class="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
                 <span class="userLabel"> {this.state.userName}</span> 
                 <span class="userIcon"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
                </a>
                <div class="dropdown-menu sm-menu">
                  <a class="dropdown-item" href="registration">Profile</a>
                  <a class="dropdown-item" href="resetpassword">Change Password</a>
                  <span class="dropdown-item" onClick={this.handleLogout} >Logout</span>
                </div>
              </li>
            </ul> 
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <a href={API_BASE_URL+"/rest/downloadManual/Vendor"} className="btn btn-primary" style={{fontSize:8}}>Download Manual</a>
      </div> 
      <nav className={showSidebar ? "nav-menu active" : "nav-menu"}>
          
          <ul className="nav-menu-items" >
       
          <li className="navbar-toggle">
              <Link to="#" className="menu-bars" onClick={this.closeSidebar}>
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
        </div>
      </div>

       </div>
       
    </>
            {/* <div className="nav-link role-dropdown">
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




      </React.Fragment>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.dashboardHeaderRed;
};
export default connect (mapStateToProps,actionCreators)(VendorDashboardHeader);