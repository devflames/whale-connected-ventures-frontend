import { useNotification } from '@web3uikit/core';
import { NFTBalance} from '@web3uikit/web3';
import {  } from '@web3uikit/icons';
import { useMoralis } from "react-moralis";
import React, {useState,useEffect} from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

//this import fixes the issue with console.log 
import console from 'console-browserify';
import "../../styles.css";
import helpers from 'Helper';

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
    CardImg, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,  Nav, NavItem, NavLink, TabPane, TabContent, Table, Label
  } from "reactstrap";


export default function Guilds() {

  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const notificationAlertRef = React.useRef(null);
  const [guildLS, setGuildLS] = useState();
  const [showModal, setShowModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [guildModal, setGuildModal] = useState(false);
  const [modalData, setModalData]= useState({});
  const [signupData, setSignupData] = useState({});
  const [horizontalTabs, sethorizontalTabs] = React.useState("profile");
  const [verticalTabs, setverticalTabs] = React.useState("profile");
  const [verticalTabsIcons, setverticalTabsIcons] = React.useState("home");
  const [pageTabs, setpageTabs] = React.useState("home");
  const [openedCollapseOne, setopenedCollapseOne] = React.useState(true);
  const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
  const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
  const [registrationsLS, setRegistrationsLS] = useState();
  const [ profileComplete, setProfileComplete ] = useState();
  const [playerCount, setPlayerCount] = useState(0);

  const [guildName, setGuildName] = useState(null);
  const [guildDetails, setGuildDetails] = useState(null);
  const [guildWebsite, setGuildWebsite] = useState(null);
  const [guildDiscord, setGuildDiscord] = useState(null);
  const [guildWallet, setGuildWallet] = useState(null);
  const [guildPrivate, setGuildPrivate] = useState();


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
};

//date formatter function
const getDates = (e) => {
  try {
    return helpers.getDates(e);
  } catch (error) {
    console.log(error);
  }
};

//create guild so others may join it - will require $BLBR in the future 
const createGuild = async (data) => {
  try {
    const Guilds = Moralis.Object.extend("Guilds");
    const myGuild = new Guilds();

    const query = new Moralis.Query(Guilds);
    query.equalTo("GuildName", guildName);
    const guildResults = await query.find();

    if (profileComplete === true) {
      if (guildResults.length > 0) { 
        let message = helpers.dispatchNotification("A guild with that name already exists. Please select another name and try again.");
        notificationAlertRef.current.notificationAlert(message);
      } else {
        if (guildName){
          myGuild.set("Name", guildName);
        } 
        if (guildDetails){
          myGuild.set("Description", guildDetails);
        } 
        if (guildWallet){
          myGuild.set("TreasuryWallet", guildWallet);
        } 
        if (guildDiscord){
          myGuild.set("Discord", guildDiscord);
        } 
        if (guildWebsite){
          myGuild.set("Website", guildWebsite);
        }
        if (guildDiscord && guildDetails && guildName) {
          myGuild.set("Owner", user);
          myGuild.set("ownerName", user.attributes.username);
          myGuild.set("Private", guildPrivate);
          await myGuild.save();
          toggleCreateModal();
          let message = helpers.dispatchNotification("Guild successfully created.");
          notificationAlertRef.current.notificationAlert(message);
          window.location.reload(true);
        } else {
          let message = helpers.dispatchNotification("Please complete all fields and try again.");
          notificationAlertRef.current.notificationAlert(message);
        }
      }
    } else {
      let message = helpers.dispatchNotification("Guild creation failed. Please complete your Profile prior to registration and ensure you have included your Discord Name, Username and Faction.");
      notificationAlertRef.current.notificationAlert(message);
    }
  } catch (error) {
    console.log(error);
    let message = helpers.dispatchNotification(error);
    notificationAlertRef.current.notificationAlert(message);
  }
};

//create guild so others may join it - will require $BLBR in the future 
const updateGuild = async (data) => {
  try {
    const Guilds = Moralis.Object.extend("Guilds");
    const query = new Moralis.Query(Guilds);
    query.equalTo("objectId", signupData);
    const guildResults = await query.first();

    if (profileComplete === true) {
      if (guildResults.length < 0) { 
        let message = helpers.dispatchNotification("A guild with that ID was not found. Please try again.");
        notificationAlertRef.current.notificationAlert(message);
      } else {
        if (guildName){
          guildResults.set("Name", guildName);
        } 
        if (guildDetails){
          guildResults.set("Description", guildDetails);
        } 
        if (guildWallet){
          guildResults.set("TreasuryWallet", guildWallet);
        } 
        if (guildDiscord){
          guildResults.set("Discord", guildDiscord);
        } 
        if (guildWebsite){
          guildResults.set("Website", guildWebsite);
        }

        //guildResults.set("Owner", user);
        //guildResults.set("ownerName", user.attributes.username);
        
        await guildResults.save();
        toggleGuildModal();

        let message = helpers.dispatchNotification("Guild successfully updated.");
        notificationAlertRef.current.notificationAlert(message);
        window.location.reload(true);
      }
    } else {
      let message = helpers.dispatchNotification("Update failed. Please complete your Profile prior to registration and ensure you have included your Discord Name, Username and Faction.");
      notificationAlertRef.current.notificationAlert(message);
    }
  } catch (error) {
    console.log(error);
  }
};


  //Guild Signups below
  const guildSignup = async (data) => {
    try { 
      //declare types
      const Signups = Moralis.Object.extend("GuildRegistrations");
      const Guilds = Moralis.Object.extend("Guilds");

      //create signup
      const myRegistration = new Signups();
      const myGuild = new Guilds();
      myGuild.id = signupData;

      //query for User so we can set the GuildId
      const User = Moralis.Object.extend("_User");
      const userQuery = new Moralis.Query(User);
      const myDetails = await userQuery.first();

      //query for existing record w/ user and game
      const query = new Moralis.Query(Signups);
      query.equalTo("User", user);
      //query.equalTo("Guild", myGuild);  //removed because we want to only have 1 guild registration per user
      const registrations = await query.find();

      if (profileComplete === true) {
        if (registrations.length > 0) {
          //do stuff because it was found
         // let message = helpers.dispatchNotification("Registration already exists.");
         // notificationAlertRef.current.notificationAlert(message);
            registrations[0].destroy().then(
              (registrations) => {
                //console.log("Deleted");
                //setShowModal(false);
                //let message = helpers.dispatchNotification("Registration removed.");
                //notificationAlertRef.current.notificationAlert(message);
              },
              (error) => {
                console.log("Registration failed. Deletion error: " + error);
              }
            );
        }
          //if not found, create record
          //console.log("Signup does not exist. Creating new signup.")
          myRegistration.set("User", user);
          myRegistration.set("Guild", myGuild);
          myRegistration.set("GuildName", data.Name);
          myRegistration.set("UserName", user.attributes.username);
          myRegistration.save();

          myDetails.set("GuildId", myGuild);
          myDetails.set("GuildName",data.Name);
          myDetails.save();
          //console.log(myGuild);
          
          setShowModal(false);
          let message = helpers.dispatchNotification("Registration successful.");
          notificationAlertRef.current.notificationAlert(message);
          
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
      const Signups = Moralis.Object.extend("GuildRegistrations");
      const Guilds = Moralis.Object.extend("Guilds");

      //create signup
      const myGuild = new Guilds();
      myGuild.id = signupData;

      //query for existing record w/ user and game
      const query = new Moralis.Query(Signups);
      query.equalTo("User", user);
      query.equalTo("Guild", myGuild);
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
  };

  const removeMember = async (data) => {
    try {
      //declare types
      const Signups = Moralis.Object.extend("GuildRegistrations");
      const query = new Moralis.Query(Signups);
      query.equalTo("objectId", data.id);
      const registrations = await query.find();

      if (registrations.length > 0) {
        //do stuff because it was found
        registrations[0].destroy().then(
          (registrations) => {
            let message = helpers.dispatchNotification("Guild member removed.");
            notificationAlertRef.current.notificationAlert(message);
            //window.location.reload(true);
            setGuildModal(false);
          },
          (error) => {
            console.log("Delete failed");
          }
        );
      } else {
      let message = helpers.dispatchNotification("Guild member not found.");
      notificationAlertRef.current.notificationAlert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGuild = async (data) => {
    try {
      const Guilds = Moralis.Object.extend("Guilds");
      const query = new Moralis.Query(Guilds);
      query.equalTo("objectId", signupData);
      const results = await query.find();
      
      if (results.length > 0) {
        if (results[0].id === 'JpQyGLMaDdCwGqznjHBsckJU') {
          let message = helpers.dispatchNotification("Error. The default guild cannot be deleted.");
          notificationAlertRef.current.notificationAlert(message);
        } else {
          results[0].destroy().then(
            (results) => {
              let message = helpers.dispatchNotification("Guild successfully deleted.");
              notificationAlertRef.current.notificationAlert(message);
              window.location.reload(true);
              setGuildModal(false);
            },
            (error) => {
              console.log("Error. Delete failed.");
            }
          );
        }
      } else {
      let message = helpers.dispatchNotification("Error. Guild not found.");
      notificationAlertRef.current.notificationAlert(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //get player count
  const getPlayerCount = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("GuildRegistrations");
      const Guilds = Moralis.Object.extend("Guilds");

      //define signup and game
      const myGuild = new Guilds()
      myGuild.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("Guild", myGuild);
      const registrations = await query.find();

      //set count results
      setPlayerCount(registrations.length);
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  
  //get play registrations to pass into modal
  const getPlayerRegistrations = async (e) => {
    try {
      //declare objects
      const Signups = Moralis.Object.extend("GuildRegistrations");
      const Guilds = Moralis.Object.extend("Guilds");

      //define signup and game
      const myGuild = new Guilds()
      myGuild.id = e;

      //structure query
      const query = new Moralis.Query(Signups);
      query.equalTo("Guild", myGuild);
      const registrations = await query.find();

      //set count results
      setRegistrationsLS(registrations);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  //set modal visible or hidden
  const toggleModal = () => {
    setShowModal((prevState)=>!prevState)
  };

  const toggleGuildModal = () => {
    setGuildModal((prevState)=>!prevState)
  };

  const toggleCreateModal = () => {
    setCreateModal((prevState)=>!prevState)
  };

  const handleChoosedRow = (e) => {
    //set signup data for registration purposes 
    setSignupData(e.id);
    //console.log(e.id);

    //get player count for game id
    getPlayerCount(e.id);

    //get registrations
    getPlayerRegistrations(e.id);

    //set modal data for display
    setModalData(e.attributes); 

    //show modal
    toggleModal();
  };

  const handleChooseGuild = (e) => {
    //set signup data for registration purposes 
    setSignupData(e.id);
    //console.log(e.id);

    //get player count for game id
    getPlayerCount(e.id);

    //get registrations
    getPlayerRegistrations(e.id);

    //set modal data for display
    setModalData(e.attributes); 

    //show modal
    toggleGuildModal();
  };

  //load data when hitting page
  useEffect(() => {
    async function getGuilds() {
      try {
        //get games data
        const Guilds = Moralis.Object.extend("Guilds");
        const query = new Moralis.Query(Guilds);
        query.ascending("Name");
        const results = await query.find();
        setGuildLS(results);     
        //console.log(results);

        //make sure profile is complete
        isProfileCompleted();
      } catch (error) {
        console.log(error);
      }
    }
    getGuilds();
  }, []);

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


  return (
    <>
      <div className="content" >
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
        <Row>
          <Col md="12" lg="12" className="overflow-hidden">
            <CardTitle tag="h4">Guilds</CardTitle>
            <div className="text-right">
              <Button className="btn-icon" onClick={toggleCreateModal} disabled={false} color="success" size="sm">
                  <i className="fa fa-edit"></i>
              </Button>
            </div>
            <Table responsive className="overflow-hidden">
            <thead>
                <tr>
                    <th>Guild Name</th>
                    <th>Description</th>
                    <th className="text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
              {guildLS?.map((e) => {
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
                            <Button className="btn-icon btn-simple" color="success" size="sm" data-item={e} onClick={()=>handleChooseGuild(e)}>
                              <i className="fa fa-edit"/>
                            </Button>}
                        </td>
                    </tr>
                  </>
                )
              })} 
              </tbody>
              </Table>
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
                          <i className="tim-icons icon-bank" />
                          Guild Details
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
                          Guild NFTs
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
                      Guild Members
                    </NavLink>
                  </NavItem>
                    </Nav>
                    <TabContent activeTab={verticalTabsIcons}>
                      <TabPane tabId="home">
                        Guild Details <br />
                        <br />
                          <CardText>{modalData.Name}</CardText>
                          <CardText>{modalData.Description}</CardText>
                          <CardText>Owner: {modalData.ownerName}</CardText>
                          <CardText>Created Date: {getDates(modalData.createdAt)}</CardText>
                          <a href={modalData.Discord} target="_blank"><CardText>Discord: {modalData.Discord}</CardText></a>
                          <a target="_blank" href={modalData.Website}><CardText>Website: {modalData.Website}</CardText></a>
                      </TabPane>
                      <TabPane tabId="settings">
                        Guild NFTs <br />
                        <br />
                    <NFTBalance
                          id="nft-ui"
                          address={modalData.TreasuryWallet} 
                          chain={Moralis.getChainId()}
                          />


                      </TabPane>
                      <TabPane tabId="options">
                        Guild Members - {JSON.stringify(playerCount)}<br />
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
              <Button onClick={()=>removeSignup(modalData)} color="secondary">
                  Leave Guild
              </Button>
              <Button onClick={()=>guildSignup(modalData)} color="primary">
                  Join Guild
              </Button>
          </ModalFooter>
        </Modal>

        <Modal modalClassName="modal-black" data-item={modalData} isOpen={guildModal} size="lg">
          <div className="modal-header">
            <button onClick={toggleGuildModal} type="button" className="close" data-dismiss="modal" aria-label="Close" >
              <i className="tim-icons icon-simple-remove"></i>
            </button>
            <h5 className="modal-title">{modalData.Name}</h5>
          </div>
          <ModalBody>
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
                          <i className="tim-icons icon-bank" />
                          Manage Guild Details
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
                          Manage Guild Permissions
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
                      Manage Guild Members
                    </NavLink>
                  </NavItem>
                    </Nav>
                    <TabContent activeTab={verticalTabsIcons}>
                      <TabPane tabId="home">
                        Manage Guild Details <br />
                        <br />
                        <Form>
                          <Row>
                            <Col className="pr-md-1" md="4">
                              <FormGroup>
                                <label>Guild Name</label>
                                <Input placeholder="Enter name" defaultValue={modalData.Name} type="text" onChange={(e)=> setGuildName(e.target.value)}/>
                              </FormGroup>
                            </Col>
                            <Col className="pl-md-1" md="8">
                              <FormGroup>
                                <label>Guild Description</label>
                                <Input
                                  cols="80"
                                  placeholder="Enter description"
                                  defaultValue={modalData.Description}
                                  rows="4"
                                  type="textarea"
                                  onChange={(e)=> setGuildDetails(e.target.value)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                          <Col className="pr-md-1" md="4">
                              <FormGroup>
                                <label>Guild Website</label>
                                <Input placeholder="Enter website" defaultValue={modalData.Website} type="text" onChange={(e)=> setGuildWebsite(e.target.value)}/>
                              </FormGroup>
                            </Col>
                            <Col className="px-md-1" md="4">
                              <FormGroup>
                                <label>Guild Wallet</label>
                                <Input placeholder="Enter 0x wallet address" defaultValue={modalData.TreasuryWallet} type="text" onChange={(e)=> setGuildWallet(e.target.value)}/>
                              </FormGroup>
                            </Col>
                            <Col className="pl-md-1" md="4">
                              <FormGroup>
                                <label>Guild Discord</label>
                                <Input placeholder="Enter discord URL" defaultValue={modalData.Discord} type="text" onChange={(e)=> setGuildDiscord(e.target.value)}/>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                        <div
                aria-multiselectable={true}
                className="card-collapse"
                id="accordion"
                role="tablist"
              >
                <Card className="card-plain">
                  <CardHeader role="tab">
                    <a
                      aria-expanded={openedCollapseThree}
                      href="#pablo"
                      data-parent="#accordion"
                      data-toggle="collapse"
                      onClick={(e) => {
                        e.preventDefault();
                        setopenedCollapseThree(!openedCollapseThree);
                      }}
                    >
                      DANGEROUS OPTIONS - These actions cannot be undone{" "}
                      <i className="tim-icons icon-minimal-down" />
                    </a>
                  </CardHeader>
                  <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                    <CardBody className="text-center">
                    <Button data-item={modalData} onClick={()=>deleteGuild(modalData)} color="danger">Delete Guild</Button>
                    </CardBody>
                  </Collapse>
                </Card>
              </div>
                      </TabPane>
                      <TabPane tabId="settings">
                        Manage Guild Permissions <br />
                        <br />
                      <CardText>Coming soon</CardText>
                      </TabPane>
                      <TabPane tabId="options">
                        Manage Guild Members - {JSON.stringify(playerCount)}<br />
                        <br />
                        {registrationsLS?.map((e) => {
                          return (
                            <>
                              <CardText>{e.attributes.UserName} <Button  data-item={e} onClick={()=>removeMember(e)} className="btn-icon" color="danger" size="sm">
                                  <i className="fa fa-times" />
                              </Button></CardText>
                            </>
                          )
                        })} 
                    </TabPane>
                  </TabContent>
          </ModalBody>
          <ModalFooter>
              <Button onClick={toggleGuildModal} color="secondary">
                  Close
              </Button>
              <Button onClick={updateGuild} color="primary">
                  Update 
              </Button>
          </ModalFooter>
        </Modal>

        <Modal modalClassName="modal-black" isOpen={createModal} size="lg">
          <div className="modal-header">
            <button onClick={toggleCreateModal} type="button" className="close" data-dismiss="modal" aria-label="Close" >
              <i className="tim-icons icon-simple-remove"></i>
            </button>
            <h5 className="modal-title">Create Guild</h5>
          </div>
          <ModalBody>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Guild Details</CardTitle>
              </CardHeader>
              <CardBody>
                <Form action="/" className="form-horizontal" method="get">
                  <Row>
                    <Label sm="2">Guild Name</Label>
                    <Col sm="10">
                      <FormGroup>
                        <Input type="text" placeholder="The Bayou Gigachads" autoComplete="off" onChange={(e)=> setGuildName(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Description</Label>
                    <Col sm="10">
                      <FormGroup>
                        <Input placeholder="An awesome guild" type="text" onChange={(e)=> setGuildDetails(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Website</Label>
                    <Col sm="10">
                      <FormGroup>
                        <Input placeholder="https://guildofguilds.gg" type="text" onChange={(e)=> setGuildWebsite(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Discord</Label>
                    <Col sm="10">
                      <FormGroup>
                        <Input placeholder="https://discord.gg/whaleconnected" type="text" onChange={(e)=> setGuildDiscord(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Treasury Wallet</Label>
                    <Col sm="10">
                      <FormGroup>
                        <Input placeholder="0xfe...2569" type="text" onChange={(e)=> setGuildWallet(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Private</Label>
                    <Col sm="10">
                    <FormGroup check className="form-check-radio">
                        <Label check>
                          <Input
                            id="exampleRadios1"
                            name="exampleRadios"
                            type="radio"
                            defaultValue="true"
                            onChange={(e)=> setGuildPrivate(true)}
                          />
                          <span className="form-check-sign" />
                          True
                        </Label>
                      </FormGroup>
                      <FormGroup check className="form-check-radio">
                        <Label check>
                          <Input
                            defaultChecked
                            id="exampleRadios2"
                            name="exampleRadios"
                            type="radio"
                            defaultValue="false"
                            onChange={(e)=> setGuildPrivate(false)}
                          />
                          <span className="form-check-sign" />
                          False
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          </ModalBody>
          <ModalFooter>
          <Button onClick={toggleCreateModal} color="secondary">
                  Cancel
              </Button>
              <Button  onClick={createGuild} color="primary">
                  Save
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}

