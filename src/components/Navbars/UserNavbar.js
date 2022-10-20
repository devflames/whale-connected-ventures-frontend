/*!

=========================================================
* Black Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useEffect, useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { useMoralis, useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import console from 'console-browserify';

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  UncontrolledTooltip
} from "reactstrap";

const UserNavbar = (props) => {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
const [network, setNetwork] = useState();
const [address, setAddress] = useState();

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setModalSearch(!modalSearch);
  };

  useEffect(() => {
    async function getNetwork() {
      try {
        if (user.attributes.solAddress !== undefined && Moralis.getChainId() === "0x1") {
            setNetwork("Solana");
            setAddress(`${user.attributes.solAddress.slice(0, 4)}...${user.attributes.solAddress.slice(38)}`);
        } 
        else if (Moralis.getChainId() === "0x1" && user.attributes.solAddress === undefined) {
            setNetwork("Ethereum");
            setAddress(`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`);
        }
        else if (Moralis.getChainId() === "0x38") {
            setNetwork("BSC");
            setAddress(`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`);
        }
        else if (Moralis.getChainId() === "0x89") {
            setNetwork("Polygon");
            setAddress(`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`);
        }
        else if (Moralis.getChainId() === "0xa86a") {
            setNetwork("Avalanche");
            setAddress(`${user.attributes.ethAddress.slice(0, 4)}...${user.attributes.ethAddress.slice(38)}`);
        }
        else {
            setNetwork(Moralis.getChainId());
        }
      } catch (error) {
        console.log(error);
      }
    }
    getNetwork();
  }, );
  return (
    <>
      <Navbar
        className={classNames("navbar-absolute", {
          [color]: props.location.pathname.indexOf("full-screen-map") === -1
        })}
        expand="lg"
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize d-inline">
              <Button
                className="minimize-sidebar btn-just-icon"
                color="link"
                id="tooltip209599"
                onClick={props.handleMiniClick}
              >
                <i className="tim-icons icon-align-center visible-on-sidebar-regular" />
                <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini" />
              </Button>
              <UncontrolledTooltip
                delay={0}
                target="tooltip209599"
                placement="right"
              >
                Sidebar toggle
              </UncontrolledTooltip>
            </div>
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={props.toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <InputGroup className="search-bar" tag="li">
                <Button
                  color="link"
                  data-target="#searchModal"
                  data-toggle="modal"
                  id="search-button"
                  onClick={toggleModalSearch}
                >
                  <i className="tim-icons icon-zoom-split" />
                  <span className="d-lg-none d-md-block">Search</span>
                </Button>
              </InputGroup>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-sound-wave" />
                  <p className="d-lg-none">Notifications</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Notifications coming soon
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="photo">
                    <img alt="..." src={require("assets/img/pfp2.png")} />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Log out</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {/*<DropdownItem divider tag="li" />*/}
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Click Below To Log out</DropdownItem>
                    <div className="wallet-details">
                           <Button className="wallet-button" onClick={() => {
                                Moralis.User.logOut().then(() => {
                                window.location.reload();
                                });
                            }}>{address}</Button> 
              </div> 
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        modalClassName="modal-search"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <div className="modal-header">
          <Input id="inlineFormInputGroup" placeholder="SEARCH COMING SOON" type="text" />
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModalSearch}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UserNavbar;
