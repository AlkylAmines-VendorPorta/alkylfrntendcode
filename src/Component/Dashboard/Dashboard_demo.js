<nav class="navbar fixed-top navbar-expand-md flex-nowrap navbar-new-top">
        <a href="userdashboard" class="navbar-brand"><img src={alkylLogo} alt=""/></a>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
        {/* <ul className="navbar-nav whiteNav menu-list"> */}
          
        {/* <li className="nav-item">
              <a className="nav-link" href="workingpage">
                <i className="fa fa-tachometer" aria-hidden="true"></i>
                &nbsp; Dashboard
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link" href="userinvitation">
              <i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;Invitation
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="vendorPreview">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                &nbsp;Vendor Approval
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="purchaseorder">
                <i className="fa fa-bell" aria-hidden="true"></i>&nbsp;Purchase Order
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="gateentry">
                <i className="fa fa-file-text" aria-hidden="true"></i>&nbsp;Gate Entry
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="internalUser">
                <i className="fa fa-list-alt" aria-hidden="true"></i>
                &nbsp;Internal User
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="workingpage">
                <i className="fa fa-list-alt" aria-hidden="true"></i>&nbsp;Sales
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="miroScreen">
                <i className="fa fa-list-alt" aria-hidden="true"></i>&nbsp;Inovice
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link" href="serviceScreen">
                <i className="fa fa-list-alt" aria-hidden="true"></i>&nbsp;Srvice Screen
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
          </ul>       */}
            
        <ul className="navbar-nav ml-2 topnav">
            <li class="nav-item dropdown dmenu">
            <a class="nav-link dropdown-toggle userdropdown" href="." id="navbardrop" data-toggle="dropdown">
            <span class="userLabel"> {this.state.userName}</span><span class="userIcon"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
            </a>
            <div class="dropdown-menu sm-menu">
              {/* <a class="dropdown-item" href="/registration">Profile</a> */}
              <a class="dropdown-item" href="/resetpassword">Change Password</a>
              <a class="dropdown-item" onClick={this.handleLogout} href="/">Logout</a>
            </div>
          </li>
        </ul>
        </div>
          
    </nav>