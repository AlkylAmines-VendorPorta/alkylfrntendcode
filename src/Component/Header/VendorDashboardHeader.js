import React, { Component } from "react";
import alkylLogo from "../../img/Alkyl logo.png";
import Loader from './../../Component/FormElement/Loader/Loader';
import { commonSubmitWithParam } from "../../Util/ActionUtil";
import {ArrowLeft, ArrowRight, pushTiles, getDefaultSelectedDashboardList} from "../../Util/CommonUtil";
import { isEmpty } from "lodash-es";
import * as actionCreators from "./Action"
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem, Button, Select, FormControl, InputLabel, Collapse } from "@material-ui/core";
import { Menu as MenuIcon, AccountCircle, ArrowBack, Home, Dashboard, Settings, People, Business, ListAlt, ExitToApp, Receipt, Person, HowToReg, GroupAdd, Store, History, Security, Description, LocalShipping, PostAdd, ChevronLeft } from "@material-ui/icons";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { MergeType, VerifiedUser,Assessment } from "@material-ui/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../Constants";

// Mapping of parent menu names to icons
const menuIcons = [
  {"code":"PRScreen", icon: MergeType},
  {"code":"QCFScreen", icon: VerifiedUser},
  {"code":"PRReport",icon:Assessment},
  {"code":"QuotationScreen",icon:Receipt},
  {"code":"User Details",icon:Person},
  {"code":"Registration",icon:HowToReg},
  {"code":"Others",icon:GroupAdd},
  {"code":"Vendor Details",icon:Store},
  {"code":"PRCreation",icon:PostAdd},
  {"code":"AuditLogReport",icon:History},
  {"code":"RGP Details",icon:Security},
  {"code":"Purchase Order",icon:Description},
  {"code":"Gate Entry",icon:LocalShipping},
  {"code":"GateEntryOutward",icon:ExitToApp},
];

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
      displayDropDown:false,
      toggle:false,
      selectedRole: "",
      openMenu: null, // Track only one open menu at a time
      drawerOpen: false,
      anchorEl: null,
      showSidebar: false,
    };
  }

  componentDidMount(props){
    commonSubmitWithParam(this.props,"populateUserDetails","/rest/loggedInUserDetails");
    this.setState({
      onLoad:true
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user && !isEmpty(this.props.user)) {
      this.setState({ userName: this.props.user.name, selectedRole: this.props.user.roles[0].roleId });
      commonSubmitWithParam(this.props, "getAccessMasterDtoByUsingRoleId", "/rest/getRoleAccessMaster", this.props.user.roles[0].roleId);
    }

    if (prevProps.accessMasterDto !== this.props.accessMasterDto && !isEmpty(this.props.accessMasterDto)) {
      this.setState({ listOfUrls: pushTiles(this.props) });
    }

    if (prevProps.user.rolesList !== this.props.user.rolesList && !isEmpty(this.props.user.rolesList)) {
      const roleArray = Object.keys(this.props.user.rolesList).map((key) => ({
        display: this.props.user.rolesList[key].name,
        value: this.props.user.rolesList[key].roleId,
      }));
      this.setState({ roleList: roleArray });
    }
  }

  componentWillReceiveProps(props){
    if(!isEmpty(props.user)){
      this.setState({
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

  // handleToggle = (index) => {
  //   this.setState(prevState => ({
  //     openMenu: prevState.openMenu === index ? null : index // Toggle or set new index
  //   }));
  // };
  handleMenuClick = (menuCode) => {
    // If already on the same page, force reload
    if (window.location.pathname === `/${menuCode}`) {
      window.location.reload();
    }
    // Otherwise, the Link component will handle navigation
  };

 handleSubMenuClick = (subMenuCode) => {
  const currentPath = window.location.pathname;

  if (currentPath === `/${subMenuCode}`) {
    // Already on the page — force a reload
    window.location.reload();
  } else {
    // Navigate to the new page (optional, depends on your usage)
    window.location.href = `/${subMenuCode}`;
  }
};


  handleToggle = (index, menuCode) => {
    // If clicking the same menu that's already open and on the same page, force a reload
    if (this.state.openMenu === index && window.location.pathname === `/${menuCode}`) {
      window.location.reload();
      return;
    }
    
    this.setState(prevState => ({
      openMenu: prevState.openMenu === index ? null : index
    }));
  };

  onSelect = key => {
    this.setState({ selected: key });
  }

  handleLogout = () => {
    this.props.logout();
  }

  getDashboardList = (list) => {
    return Menu(list, getDefaultSelectedDashboardList(list));
  }

  toggleDrawer = (open) => () => {
    this.setState({ drawerOpen: open });
  };

  setAnchorEl = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeRole = (event) => {
    this.setState({ selectedRole: event.target.value });
    commonSubmitWithParam(this.props, "changeRole", "/rest/changeRole", Number(event.target.value));
  };

  openSidebar = () => {
    this.setState({showSidebar: !this.state.showSidebar})
    document.getElementById("togglesidebar").style.marginLeft="20%"
    document.getElementById("togglesidebar").style.width = "81%";
  }
 
  closeSidebar=()=>{
    this.setState({showSidebar: !this.state.showSidebar})
    document.getElementById("togglesidebar").style.marginLeft="0px"
    document.getElementById("togglesidebar").style.width = "100%";
  }

  render() {
    const listOfUrls = this.state.listOfUrls;
    const { openMenu } = this.state;

    const mainCategory= listOfUrls.filter(cat => cat.parentId=='64');

    for (var a=0; a<listOfUrls.length; a++) {
      for (var b=0; b<listOfUrls.length; b++) {
        if(listOfUrls[a].parentId === listOfUrls[b].tileMasterId) {       
          if(!checkSubcategoryExist(listOfUrls[b].subCategory,listOfUrls[a].code)){
            if(listOfUrls[b].subCategory){
              listOfUrls[b].subCategory.push(listOfUrls[a]);
            } else {
              listOfUrls[b].subCategory = [listOfUrls[a]]  
            }          
          }
        }      
      }
    }

    const subCategory = listOfUrls.filter(a => {
      return typeof(a.subCategory) !== 'undefined';
    });

    const listOfAppUrls=[...mainCategory,...subCategory]

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
    const listOfUrlWithIcon = listOfAppUrls.map(item => {
      const matchedIcon = menuIcons.find(iconItem => iconItem.code === item.code);
      return { ...item, icon: matchedIcon ? matchedIcon.icon : Home }; // Fallback to Home icon
    });

    return (
      <React.Fragment>
        <Loader/>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <img src={alkylLogo} alt="Logo" style={{ height: 40, marginRight: 20 }} />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Vendor Dashboard
            </Typography>
            <FormControl style={{ minWidth: 120, color: "white" }}>
              <InputLabel style={{ color: "white" }}>Role</InputLabel>
              <Select value={this.state.selectedRole} onChange={this.handleChangeRole} style={{ color: "white" }}>
                {this.state.roleList.map((role) => (
                  <MenuItem key={role.value} value={role.value}>{role.display}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {this.state.userName}
            <IconButton color="inherit" onClick={this.setAnchorEl}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.closeMenu}>
              <MenuItem onClick={() => window.location.href = "/resetpassword"}>Change Password</MenuItem>
              <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
            <Button size="small" color="inherit" href={`${API_BASE_URL}/rest/downloadManual/User`}>Download Manual</Button>
          </Toolbar>
        </AppBar>
        <Drawer PaperProps={{
          style: {
            width: 300,
          },
        }} anchor="left" open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <Typography variant="h5" noWrap style={{backgroundColor:"#3f51b5",color:"white", fontWeight:"bold", padding:"10px 0px", textAlign:"center"}}>
            <img src={alkylLogo} alt="Logo" style={{ height: 40, marginRight: 20 }} /> 
            <Button style={{float: "right", color: "#fff"}} variant="text" onClick={this.toggleDrawer(false)}><ArrowBack style={{float:"right"}}/></Button>
          </Typography>
          <List>
            {listOfUrlWithIcon.map((menu, index) => {
              const IconComponent = menu.icon || Home;
              return (
                <div key={index}>
                  <ListItem
                    button
                    component={menu.subCategory && menu.subCategory.length > 0 ? undefined : Link}
                    to={menu.subCategory && menu.subCategory.length > 0 ? undefined : menu.code}
                    onClick={() => {
                      if (menu.subCategory && menu.subCategory.length > 0) {
                        this.handleToggle(index, menu.code);
                      } else {
                        this.handleMenuClick(menu.code);
                      }
                    }}
                    style={{
                      transition: "background 0.3s",
                      cursor:'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3f51b5";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    <IconComponent style={{ marginRight: 10 }} />
                    <ListItemText primary={menu.name} />
                    {menu.subCategory && menu.subCategory.length > 0 && (
                      openMenu === index ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItem>

                  {menu.subCategory && menu.subCategory.length > 0 && (
                    <Collapse in={openMenu === index} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {menu.subCategory
                          .filter((sub) => sub.parentId === menu.tileMasterId)
                          .map((sub, subIndex) => (
                            <ListItem
                              button
                              key={subIndex}
                              component={Link}
                              to={sub.code}
                              style={{ transition: "background 0.3s", paddingLeft: 50,cursor:'pointer'}}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#3f51b5";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "";
                                e.currentTarget.style.color = "";
                              }}
                              onClick={() => this.handleSubMenuClick(sub.code)}
                            >
                              <ListItemText primary={sub.name} />
                            </ListItem>
                          ))}
                      </List>
                    </Collapse>
                  )}
                </div>
              );
            })}
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

const mapStateToProps=(state)=>{
  return state.dashboardHeaderRed;
};

export default connect (mapStateToProps,actionCreators)(VendorDashboardHeader);