import { useNotification } from '@web3uikit/core';
import { ConnectButton } from '@web3uikit/web3';
import {  } from '@web3uikit/icons';
import { useMoralis } from "react-moralis";
import React, {useState,useEffect} from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import helpers from 'Helper';

//this import fixes the issue with console.log 
import console from 'console-browserify';
import "../../styles.css";

// reactstrap components
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



export default function Games({ profile }) {
  const [ profileComplete, setProfileComplete ] = useState();
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const [tournamentLs, setTournamentLs] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData]= useState({});
  const [signupData, setSignupData] = useState({});
  const [playerCount, setPlayerCount] = useState(0);
  const [registrationsLS, setRegistrationsLS] = useState();

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

  //Game Signups below
  const gameSignup = async (data) => {
    try { 
      //declare types
      const Signups = Moralis.Object.extend("GameRegistrations");
      const Games = Moralis.Object.extend("Games");

      //create signup
      const myRegistration = new Signups();
      const myGame = new Games();
      myGame.id = signupData;

      //query for existing record w/ user and game
      const query = new Moralis.Query(Signups);
      query.equalTo("User", user);
      query.equalTo("Game", myGame);
      const registrations = await query.find();

      if (profileComplete === true) {
        if (registrations.length > 0) {
          //do stuff because it was found
          let message = helpers.dispatchNotification("Registration already exists.");
          notificationAlertRef.current.notificationAlert(message);
        } else {
          //if not found, create record
          //console.log("Signup does not exist. Creating new signup.")
          myRegistration.set("User", user);
          myRegistration.set("Game", myGame);
          myRegistration.set("GameName", data.Name);
          myRegistration.set("UserName", user.attributes.username);
          myRegistration.save();
          setShowModal(false);
          let message = helpers.dispatchNotification("Registration successful.");
          notificationAlertRef.current.notificationAlert(message);
          }
      } else {
        let message = helpers.dispatchNotification("Registration failed. Please complete your Profile prior to registration and ensure you have included your Discord Name, Username and Faction.");
        notificationAlertRef.current.notificationAlert(message);
      }
    } catch (error) {
      console.log(error);
      let message = helpers.dispatchNotification("Error. Registration failed.");
      notificationAlertRef.current.notificationAlert(message);
      }
  };

  //remove signup
  const removeSignup = async (data) => {
    try {
      //declare types
      const Signups = Moralis.Object.extend("GameRegistrations");
      const Games = Moralis.Object.extend("Games");

      //create signup
      const myGame = new Games();
      myGame.id = signupData;

      //query for existing record w/ user and game
      const query = new Moralis.Query(Signups);
      query.equalTo("User", user);
      query.equalTo("Game", myGame);
      const registrations = await query.find();

      if (registrations.length > 0) {
        //do stuff because it was found
        registrations[0].destroy().then(
          (registrations) => {
            //console.log("Deleted");
            setShowModal(false);
            let message = helpers.dispatchNotification("Registration removed.");
            notificationAlertRef.current.notificationAlert(message);
          },
          (error) => {
            console.log("Delete failed");
          }
        );
      } else {
      let message = helpers.dispatchNotification("Registration not found.");
      notificationAlertRef.current.notificationAlert(message);
      }
    } catch (error) {
      console.log("error: " + error);
    }
  }

  //get player count
  const getPlayerCount = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("GameRegistrations");
      const Games = Moralis.Object.extend("Games");

      //define signup and game
      const myGame = new Games()
      myGame.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("Game", myGame);
      const registrations = await query.find();

      //set count results
      setPlayerCount(registrations.length);
      //console.log("Player count: " + registrations.length);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  //get play registrations to pass into modal
  const getPlayerRegistrations = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("GameRegistrations");
      const Games = Moralis.Object.extend("Games");

      //define signup and game
      const myGame = new Games()
      myGame.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("Game", myGame);
      const registrations = await query.find();

      //set count results
      setRegistrationsLS(registrations);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  //set modal visible or hidden
  const toggleModal = () => {
    setShowModal((prevState)=>!prevState)
  }

  const handleChoosedRow = (e) => {
    //console.log("e: ", e);

    //set signup data for registration purposes 
    setSignupData(e.id);

    //get player count for game id
    getPlayerCount(e.id);

    //get registrations
    getPlayerRegistrations(e.id);

    //set modal data for display
    setModalData(e.attributes); 

    //show modal
    toggleModal();
  };

  //load data when hitting page
  useEffect(() => {
    async function getGames() {
      try {
        //get games data
        const Games = Moralis.Object.extend("Games");
        const query = new Moralis.Query(Games);
        query.ascending("Name")
        const results = await query.find();
        setTournamentLs(results);     
        
        //make sure profile is complete
        isProfileCompleted();
      } catch (error) {
        console.log(error);
      }
    }
    getGames();
  }, []);

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

const formatNumbers = (e) => {
  try {
    return helpers.getNumbers(e);
  } catch (error) {
    console.log(error);
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
          {tournamentLs?.map((e) => {
            return (
              <>
              <Card className="text-center">
              <CardHeader>
              </CardHeader>
                  <CardBody>
                      <img alt="gameImage" src={e.attributes.imageLink} className="resultImg"></img>
                      <CardTitle>{e.attributes.Name}</CardTitle>
                      <CardText>{formatNumbers(e.attributes.prizePoolNum)} $BLBR Shared Daily</CardText>
                      <CardText>{e.attributes.Platform}</CardText>
                      <Button data-item={e} onClick={()=>handleChoosedRow(e)} color="primary">View Details</Button>
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
          <img alt="gameImage" src={modalData.imageLink} className="resultImg"></img>
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
                          Game Details
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
                          Game Resources
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
                      Registered Players
                    </NavLink>
                  </NavItem>
                    </Nav>
                    <TabContent activeTab={verticalTabsIcons}>
                      <TabPane tabId="home">
                        Game Details <br />
                        <br />
                        <CardText>{modalData.requirements}</CardText>
                        <CardText>{formatNumbers(modalData.prizePoolNum)} $BLBR split daily</CardText>
                        <CardText>{playerCount} registered players</CardText>
                      </TabPane>
                      <TabPane tabId="settings">
                        Game Resources <br />
                        <br />
                        <CardText>Platform: {modalData.Platform}</CardText>
                        <a target="_blank" href={modalData.Link}><CardText>Website: {modalData.Link}</CardText></a>
                      </TabPane>
                      <TabPane tabId="options">
                        Registered Players <br />
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
              <Button onClick={()=>removeSignup(modalData)} color="secondary" >
                  Cancel
              </Button>
              <Button onClick={()=>gameSignup(modalData)} color="primary">
                  Register
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}



