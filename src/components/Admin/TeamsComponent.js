import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import {  Icon, Widget, CopyButton, NFTBalance, useNotification, Select, Info } from '@web3uikit/core';
import { useMoralis, useWeb3ExecuteFunction, useMoralisWeb3Api, useMoralisCloudFunction} from "react-moralis";
//this import fixes the issue with console.log 
import console from 'console-browserify';
import NotificationAlert from "react-notification-alert";
import helpers from 'Helper';

import {
    //Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Collapse,
    CardImg, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,  Nav, NavItem, NavLink, TabPane, TabContent
  } from "reactstrap";

export default function TeamsComponent(Tournament) {
    const { Moralis } = useMoralis();
    const user = Moralis.User.current();
    const [ profileComplete, setProfileComplete ] = useState();
    const [teamLS, setTeamLS] = useState();
    const [registrationsLS, setRegistrationsLS] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData]= useState({});
    const [signupData, setSignupData] = useState({});
    const [playerCount, setPlayerCount] = useState(0);
    const dispatch = useNotification();
    const [maxPlayerCount, setMaxPlayerCount] = useState();
    const [horizontalTabs, sethorizontalTabs] = React.useState("profile");
    const [verticalTabs, setverticalTabs] = React.useState("profile");
    const [verticalTabsIcons, setverticalTabsIcons] = React.useState("home");
    const [pageTabs, setpageTabs] = React.useState("home");
    const [openedCollapseOne, setopenedCollapseOne] = React.useState(true);
    const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
    const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
    const notificationAlertRef = React.useRef(null);

    //ensure profile is completed prior to enabling user signups
  const isProfileCompleted = () => {
    try {
      let profileCheck = helpers.isProfileCompleted(user);
       if (profileCheck === true) {
        setProfileComplete(true);
       } else {
        setProfileComplete(false);
       }
    } catch (error) {
      console.log(error);
    }
  }

  //get play registrations to pass into modal
  const getPlayerRegistrations = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("TeamMembers");
      const Teams = Moralis.Object.extend("Teams");

      //define signup and game
      const myTeam = new Teams()
      myTeam.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("TeamId", myTeam);
      const registrations = await query.find();

      //set count results
      setRegistrationsLS(registrations);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  //get player count
  const getPlayerCount = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("TeamMembers");
      const Teams = Moralis.Object.extend("Teams");

      //define signup and game
      const myTeam = new Teams();
      myTeam.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("TeamId", myTeam);
      const registrations = await query.find();

      //set count results
      setPlayerCount(registrations.length);
      console.log(registrations.length);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  //get player count
  const getMaxPlayerCount = async (e) => {
    try {
      //console.log(e);
      setMaxPlayerCount(e);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  //change active tab on modal
const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault();
    switch (tabState) {
      case "horizontalTabs":
        sethorizontalTabs(tabName);
        break;
      case "verticalTabsIcons":
        setverticalTabsIcons(tabName);
        break;
      case "pageTabs":
        setpageTabs(tabName);
        break;
      case "verticalTabs":
        setverticalTabs(tabName);
        break;
      default:
        break;
    }
  };

    //get Team records
    useEffect(() => {
        async function getTeams(TournamentId) {
          try {
            const Teams = Moralis.Object.extend("Teams");
            const query = new Moralis.Query(Teams);
            query.ascending("Name")
            const results = await query.find();
            setTeamLS(results);   
            console.log(results);    
            
          } catch (error) {
            console.log(error);
          }
        }
        getTeams();
      }, []);

    //hide and show modal
    const toggleModal = () => {
        setShowModal((prevState)=>!prevState);
      }
  
      //onClick function for rows
      const handleChoosedRow = (e) => {
        //set signup data for registration purposes 
        setSignupData(e.id);
  
        //set modal data for display
        setModalData(e.attributes); 

        //get registrations
        getPlayerRegistrations(e.id);

        getPlayerCount(e.id);
        getMaxPlayerCount(e.attributes.maxPlayers);
  
  
        //show modal
        toggleModal();
      };

      //Team Signups below
    const teamSignup = async (data) => {
        try { 
        //declare types
        const Signups = Moralis.Object.extend("TeamMembers");
        const Teams = Moralis.Object.extend("Teams");

        //create signup
        const myRegistration = new Signups();
        const myTeam = new Teams();
        myTeam.id = signupData;

        //query for existing record w/ user and game
        const query = new Moralis.Query(Signups);
        query.equalTo("User", user);
        query.equalTo("Game", myTeam);
        const registrations = await query.find();

        //if (profileComplete === true) {
            if (registrations.length > 0) {
            //do stuff because it was found
            let message = helpers.dispatchNotification("Registration already exists.");
            notificationAlertRef.current.notificationAlert(message);
            } else {
            //if not found, create record
            //console.log("Signup does not exist. Creating new signup.")
            myRegistration.set("UserId", user);
            myRegistration.set("TeamId", myTeam);
            myRegistration.set("TeamName", data.Name);
            myRegistration.set("UserName", user.attributes.username);
            myRegistration.save();
            setShowModal(false);
            let message = helpers.dispatchNotification("Registration successful.");
            notificationAlertRef.current.notificationAlert(message);
            }
        //} else {
        //    let message = helpers.dispatchNotification("Registration failed. Please complete your Profile prior to registration and ensure you have included your Discord Name, Username and Faction.");
        //    notificationAlertRef.current.notificationAlert(message);
       // }
        } catch (error) {
        console.log(error);
        let message = helpers.dispatchNotification("Error. Registration failed.");
        notificationAlertRef.current.notificationAlert(message);
        }
    };

  return (
    <>
   <div className="content">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
        <Row>
          <Col md="12">
          {teamLS?.map((e) => {
            return (
              <>
            <tr>
                        <td>{e.attributes.Name}</td>
                        <td>{e.attributes.Description}</td>
                        <td className="text-right">
                            <Button className="btn-icon btn-simple" color="info" size="sm" data-item={e} onClick={()=>handleChoosedRow(e)}>
                                <i className="fa fa-user"/>
                            </Button>
                            {e.attributes.Owner.id === user.id && 
                            <Button className="btn-icon btn-simple" color="success" size="sm" data-item={e} onClick={()=>handleChoosedRow(e)}>
                              <i className="fa fa-edit"/>
                            </Button>}
                        </td>
                    </tr>

              <Card className="text-center">
              <CardHeader>
              {e.attributes.Name}
              </CardHeader>
                  <CardBody>
                  <CardText>Team Name: {e.attributes.Name}</CardText>
                  <CardText>{e.attributes.MaxPlayers} Player Max Team Size</CardText>
                  <Button
                    color="blue"
                    id="view-team-details"
                    onClick={()=>handleChoosedRow(e)}
                    data-item = {e}
                    text="View Details"
                    theme="transulucent"
                    type="button"
                  >View Details</Button>
                  </CardBody>
              </Card>
              </>
            )
          })} 
          </Col>
        </Row>
        
        <Modal modalClassName="modal-black" data-item={modalData} isOpen={showModal} size="lg">
          <div className="modal-header">
            <button onClick={toggleModal} type="button" className="close" data-dismiss="modal" aria-label="Close" >
              <i className="tim-icons icon-simple-remove"></i>
            </button>
            <h5 className="modal-title">{modalData.Name}</h5>
          </div>
          <ModalBody>
          
                    {/* color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger" */}
                    <Nav
                      className="nav-pills-info nav-pills-icons flex-column"
                      pills
                    >
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={
                            verticalTabsIcons === "home" ? "active" : ""
                          }
                          onClick={(e) =>
                            changeActiveTab(e, "verticalTabsIcons", "home")
                          }
                        >
                          <i className="tim-icons icon-spaceship" />
                          Team Details
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={
                            verticalTabsIcons === "settings" ? "active" : ""
                          }
                          onClick={(e) =>
                            changeActiveTab(e, "verticalTabsIcons", "settings")
                          }
                        >
                          <i className="tim-icons icon-settings" />
                          Team Resources
                        </NavLink>
                      </NavItem>
                      <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#pablo"
                      className={verticalTabsIcons === "options" ? "active" : ""}
                      onClick={(e) =>
                        changeActiveTab(e, "verticalTabsIcons", "options")
                      }
                    >
                      <i className="tim-icons icon-single-02" />
                      Team Members
                    </NavLink>
                  </NavItem>
                    </Nav>
                    <TabContent activeTab={verticalTabsIcons}>
                      <TabPane tabId="home">
                        Team Details <br />
                        <br />
                        <CardText>{modalData.requirements}</CardText>
                        <CardText>{playerCount} registered players</CardText>
                      </TabPane>
                      <TabPane tabId="settings">
                        Team Resources <br />
                        <br />
                        <a target="_blank" href={modalData.Link}><CardText>Website: {modalData.Link}</CardText></a>
                      </TabPane>
                      <TabPane tabId="options">
                        Team Members <br />
                        <br />
                        {registrationsLS?.map((e) => {
                          return (
                            <>
                              <CardText>{e.attributes.UserName}</CardText>
                            </>
                          )
                        })} 
                    </TabPane>
                  </TabContent>
          </ModalBody>
          <ModalFooter>
              <Button  color="secondary" >
                  Cancel
              </Button>
              <Button  onClick={()=>teamSignup(modalData)} color="primary">
                  Register
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}
