// import React, { useState,Component } from "react";
// import { Sidebar } from "react-pro-sidebar";
// // ICONS
// import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
// import * as AiIcons from "react-icons/ai";

// import { IconContext } from "react-icons";

// // ROUTING

// import { Link } from "react-router-dom";

// import alkylLogo from "../../img/Alkyl logo.png";
// import Loader from './../../Component/FormElement/Loader/Loader';
// import { commonSubmitWithParam } from "../../Util/ActionUtil";
// import {Menu, ArrowLeft, ArrowRight, pushTiles, getDefaultSelectedDashboardList,renderSubMenu} from "../../Util/CommonUtil";
// import { isEmpty } from "lodash-es";
// import * as actionCreators from "./Action"
// import { connect } from "react-redux";
// import ScrollMenu from "react-horizontal-scrolling-menu";
// //import { Link } from 'react-router-dom';
// import { API_BASE_URL } from "../../Constants";
// import { MenuItem } from "react-pro-sidebar";

// // DATA FILE
// //import { SidebarData } from "./SlidebarData";

// // STYLES
// import "../../Component/NewHeader.css";

// class NewHeader extends Component {

//     constructor(props) {
      
//       super(props);
//       this.state = {
//         userEmail : "",
//         userName:"",
//         listOfUrls:[],
//         onLoad:false,
//         displayMenu: false,
//         roleList:[],
//         showSidebar: false,
//         grouped:[]
//       };

      
      
       
//     }
  
    

//   componentDidMount(){
//     commonSubmitWithParam(this.props,"populateUserDetails","/rest/loggedInUserDetails");
//     this.setState({
//       onLoad:true
//     })

//    // commonSubmitWithParam(this.props, "getAccessMasterDtoByUsingRoleId", "/rest/getRoleAccessMaster", 17);

//   }

  
  
 


//   componentWillReceiveProps(props){

//     if(!isEmpty(props.user)){
//         this.setState({
//           // userEmail : props.user.email
//           userName:props.user.name
//         })
//       }

    
//       if (this.state.onLoad===true  && (!isEmpty(props.user))) {
//         commonSubmitWithParam(this.props, "getAccessMasterDtoByUsingRoleId", "/rest/getRoleAccessMaster", props.user.roles[0].roleId);
  
//         this.setState({
//             onLoad:false
//         })
//       }

    

//       if (!isEmpty(props.accessMasterDto)) {     
//         let val = pushTiles(props);
//         // val = val.concat({code:'custom',name:'Custom',tileMasterId:200})
//         this.setState({
//           listOfUrls:val,
//           onLoad:false
//         })
//       }

//       if (!isEmpty(props.user.rolesList)) {
      
//         let roleArray = Object.keys(props.user.rolesList).map((key) => {
//           return { display: props.user.rolesList[key].name, value:props.user.rolesList[key].roleId };
  
//         });
//         this.setState({
//           roleList: roleArray
//         })
//       }
  
//       if(!isEmpty(this.state.grouped)){
//         this.setState({
//           grouped:this.state.grouped
//         })
//       }
    

//   }


//   openSidebar = () => {
//     this.setState({showSidebar: !this.state.showSidebar})
//     document.getElementById("togglesidebar").style.marginLeft="200px"
// }
 
// closeSidebar=()=>{
//   this.setState({showSidebar: !this.state.showSidebar})
//   document.getElementById("togglesidebar").style.marginLeft="0px"
// }




// handleLogout = () => {
//     this.props.logout();
//   }

// handleChangeRole=(roleId)=>{
//     if(this.state.roleList.length!==1){
//       commonSubmitWithParam(this.props, "changeRole", "/rest/changeRole", Number(roleId)); 
//     }
//   }

 
 

// render() {
//   const listOfUrls = this.state.listOfUrls;

//   const showSidebar=this.state.showSidebar;

    
//   const grouped = listOfUrls.reduce((acc, cur) => {
//     if (!acc.hasOwnProperty(cur.parentId)) {
//         acc[cur.parentId] = []
//     }
//     acc[cur.parentId].push(cur)
//     return acc;
// }, { })



import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { SlMenu } from "react-icons/sl";

export const NewHeader = [
  {
    title: 'UserDashboard',
    path: '/userdashboard',
    icon: <AiIcons.AiFillHome />,
    // iconClosed: <RiIcons.RiArrowDownSFill />,
    // iconOpened: <RiIcons.RiArrowUpSFill />,

   
  },
  {
    title: 'Purchase Order',
    path: '/purchaseorder',
    icon: <SlMenu />
  },
  {
    title: 'Gate Entry',
    path: '/gateentry',
    icon: <SlMenu />
  },
//   {
//     title: 'Internal User',
//     path: '/internalUser',
//     icon: <SlMenu />,

   
//   },

  {
    title: 'User',
    path: '#',
    icon: <SlMenu />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Internal User',
        path: '/internalUser',
        //  icon: <SlMenu />,
      },
    
      {
            title: 'Custom Screen',
            path: '/custom',
            // icon: <SlMenu />
          },
    
    ]},

  {
    title: 'Vendor Details',
    path: '#',
    icon: <SlMenu />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Vendor Approval',
             path: '/vendorPreview',
            //  icon: <SlMenu />
      },
    
      {
            title: 'Update Credentials',
            path: '/updateCredentials',
        //    icon: <SlMenu />
          },

          {
                title: 'Invitation',
                path: '/userInvitation',
                // icon: <SlMenu />
              },
    
    ]},

//   {
//     title: 'Vendor Approval',
//     path: '/vendorPreview',
//     icon: <SlMenu />
//   },
//   {
//     title: 'Update Credentials',
//     path: '/updateCredentials',
//    icon: <SlMenu />
//   },
  {
    title: 'SAP Activities',
    path: '/serviceScreen',
   icon: <SlMenu/>
  },
  {
    title: 'Miro Screen',
    path: '/miroScreen',
  icon: <SlMenu />
  },
//   {
//     title: 'Custom Screen',
//     path: '/custom',
//     icon: <SlMenu />
//   },
  {
    title: 'Vehicle Registration',
    path: '/vehicalRegistration',
   icon: <SlMenu />
  },
  {
    title: 'Gate Entry Dashboard',
    path: '/gateEntryDashboard',
    icon: <SlMenu />
  },

  

  {
    title: 'RGP Details',
    path: '#',
    icon: <SlMenu />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'RGP/NRGP list',
        path: '/RGP-NRGPList',
      //  icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'RGP/NRGP',
        path: '/RGP-NRGP',
      //  icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'RGP Inward',
        path: '/RGPInward',
      //  icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      
    ]},

    // {
    //     title: 'MaterialGetInDetailContainer',
    //     path: '/MaterialGetInDetailContainer',
    //     icon: <SlMenu />
    //   },
      {
        title: 'Sap Sales Order',
        path: '/sapsalesorder',
        icon: <SlMenu />
      },
    //   {
    //     title: 'Invitation',
    //     path: '/userInvitation',
    //     icon: <SlMenu />
    //   },

      {
        title: 'Reports',
        path: '#',
        icon: <SlMenu />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    
        subNav: [
          {
            title: 'asnreports',
            path: '/asnreports',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          {
            title: 'ssnreports',
            path: '/ssnreports',
            icon: <IoIcons.IoIosPaper />,
            cName: 'sub-nav'
          },
          
        ]
      }
      

];




  
    
//   return (
//     <>

//   {/* <div className="navbar-new-top">
// <div className="d-flex position_relative">


         
         
//           <a href="userdashboard" className="navbar-brand"><img src={alkylLogo} alt="" /></a>
        
//            <ul className="navbar-nav ml-30 topnav">
//             <li className="nav-item dropdown dmenu">
//               <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
//                 <span className="userLabel"> {this.state.userName}</span><span className="userIcon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></span>
//               </a>
//               <div className="dropdown-menu sm-menu">
//                 <a className="dropdown-item" href="/alkyl/resetpassword">Change Password</a>
//                 <span className="dropdown-item" onClick={this.handleLogout} >Logout</span>
//               </div>
//             </li>
//           </ul>

//           <ul className="navbar-nav ml-2 mt-2 topnav">
//             <li className="nav-item dropdown dmenu">
//               <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardroprole" data-toggle="dropdown">
//                 <span className="userLabel"> Role </span>
//               </a>
//               <div className="dropdown-menu sm-menu">
//                 {(this.state.roleList).map((role,index) =>
//                 <span key={index} className={this.props.user.roles[0].roleId===role.value?"li-selected dropdown-item":"dropdown-item"} 
//                   onClick={()=>this.handleChangeRole(role.value)} value={role.value}>
//                   {role.display}
//                 </span>
//               )}
//               </div>
//             </li>
//           </ul>
//           <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <a href={API_BASE_URL+"/rest/downloadManual/User"} className="btn btn-primary" style={{fontSize:8}}>Download Manual</a>
//       </div> 
// </div>
// </div> */}

// <div class="navbar-new-top">
// <div className="d-flex position_relative">

//       <Link to="#" className="menu-bars">
//             <FaIcons.FaBars onClick={this.openSidebar} />
//           </Link>

//           <a href="userdashboard" className="navbar-brand"><img src={alkylLogo} alt="" /></a>

//           <ul className="navbar-nav ml-30 topnav">
//             <li className="nav-item dropdown dmenu">
//               <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
//                 <span className="userLabel"> {this.state.userName}</span><span className="userIcon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></span>
//               </a>
//               <div className="dropdown-menu sm-menu">
//                 <a className="dropdown-item" href="/alkyl/resetpassword">Change Password</a>
//                 <span className="dropdown-item" onClick={this.handleLogout} >Logout</span>
//               </div>
//             </li>
//           </ul>

//           <ul className="navbar-nav ml-2 mt-2 topnav">
//             <li className="nav-item dropdown dmenu">
//               <a className="nav-link dropdown-toggle userdropdown" href="." id="navbardroprole" data-toggle="dropdown">
//                 <span className="userLabel"> Role </span>
//               </a>
//               <div className="dropdown-menu sm-menu">
//                 {(this.state.roleList).map((role,index) =>
//                 <span key={index} className={this.props.user.roles[0].roleId===role.value?"li-selected dropdown-item":"dropdown-item"} 
//                   onClick={()=>this.handleChangeRole(role.value)} value={role.value}>
//                   {role.display}
//                 </span>
//               )}
//               </div>
//             </li>
//           </ul>
//           <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <a href={API_BASE_URL+"/rest/downloadManual/User"} className="btn btn-primary" style={{fontSize:8}}>Download Manual</a>
//       </div> 
//           <nav className={showSidebar ? "nav-menu active" : "nav-menu"}>
//           <ul className="nav-menu-items" onClick={this.closeSidebar}>
//           <li className="navbar-toggle">
//               <Link to="#" className="menu-bars">
//                 <AiIcons.AiOutlineClose />
//               </Link>
//             </li>

//             {listOfUrls.map((item, index) => {
//               return (
//                 <li className="nav-text a" key={index} icon="FaIcons.VscMenu">
//                     <Link to={item.code}>
                    
//                     <span>{item.name}</span>
//                   </Link>
                 
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>
//       </div>

       
       
//     </>
//   );
// }}

// const mapStateToProps=(state)=>{
//     return state.newheader;
//   };
//   export default connect (mapStateToProps,actionCreators)(NewHeader);