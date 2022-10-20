import React, { useState, useRef, useEffect } from 'react';
import { useMoralis, useWeb3ExecuteFunction, useMoralisWeb3Api } from "react-moralis";
import { CopyButton, Select} from '@web3uikit/core';
import { NFTBalance} from '@web3uikit/web3';
import Lamden from 'lamden-js';
//this import fixes the issue with console.log 
import console from 'console-browserify';
import NotificationAlert from "react-notification-alert";
import helpers from 'Helper';
import useSearchParams from 'use-search-params';
import { useLocation, useParams } from "react-router-dom"
import axios from 'axios';

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
  Label,
  CardImg, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,  Nav, NavItem, NavLink, TabPane, TabContent
} from "reactstrap";


const User = () => {
  const contractProcessor = useWeb3ExecuteFunction();
  const { Moralis, isAuthenticated, account } = useMoralis();
  const user = Moralis.User.current();
  const Web3Api = useMoralisWeb3Api();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pfps, setPfps] = useState([]);
  const [selectedPFP, setSelectedPFP] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [discord, setDiscord] = useState();
  const [psn, setPSN] = useState();
  const [steam, setSteam] = useState();
  const [gamertag, setGamertag] = useState();
  const [referrer, setReferrer] = useState();
  const [faction, setFaction] = useState();
  const [factions, setFactions] = useState();
  const [twitter, setTwitter] = useState();
  const [spiderTank, setSpiderTank] = useState();
  const [epicId, setEpicId] = useState();
  const chainId = Moralis.getChainId();
  const notificationAlertRef = React.useRef(null);
  const [guild, setGuild] = useState();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [variable, setVariable] = useState();

  //dispatch copied to clipboard message
  const dispatchMessage = () => {;
    let message = helpers.dispatchNotification("Copied to clipboard.");
    notificationAlertRef.current.notificationAlert(message);
  };

  //date formatter function
  const getDates = (e) => {
    try {
      return helpers.getDates(e);
    } catch (error) {
      console.log(error);
    }
  }

  //resolve ipfs links
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  //get NFTs
  useEffect(() => {
    const fetchNFTs = async () => {
      const options = {
        chain: chainId,
        address: account
      }
      const NFTs = await Web3Api.account.getNFTs(options);
      const images = NFTs.result.map(
        (e) => resolveLink(JSON.parse(e.metadata)?.image)
      );
      setPfps(images);
    }
    fetchNFTs();
  },[isAuthenticated, account])
  
  
  //get Faction details
  useEffect(() => {
    const fetchFactions = async () => {
      const Factions = Moralis.Object.extend("Factions");
      const query = new Moralis.Query(Factions);
      const factionResults = await query.first();
      //console.log(factionResults);
      setFactions(factionResults);
    }
    fetchFactions();
  },[])

  //used to test express server
 const testServer = () => {
  console.log('Testing Server');
  //used to return connected status when the express server is functioning as intended
  fetch("http://localhost:3080/user/api/status")
  //.then((response) => response.json())
  .then(response => response.json())
  .then((data) => console.log(data));
 }

  //get discord details
  useEffect(() => {
    const getDiscordId = async () => {
      console.log('Testing Discord Auth');

      //used to return connected status when the express server is functioning as intended
      fetch("http://localhost:3080/user/api/status")
      //.then((response) => response.json())
      .then(response => response.text())
      .then((data) => console.log(data));

      //params for discord api
      const params = new URLSearchParams(location.search);
      let duid = params.get("discordId");
      let token = params.get("code");
      const accessToken = params.get("code");
      const tokenType = 'Bearer';
      
      if (token) {
        console.log('Token found: ' + token);
        fetch('https://discord.com/api/users/@me', {
			headers: {
				'authorization' : `${tokenType} ${accessToken}`,
        //'authorization' : 'Bearer iVgHjbVAslXVsysIktztYOwpecskhw',
			},
		})
			.then(result => result.json())
			.then(response => {
				const { username, discriminator } = response;
        console.log(response);
        setVariable(response);
        doSave(response);
			})
			.catch(console.error);
      }

      if (duid) {
        console.log('DUID found, setting Moralis user variable: ' + duid);
        const User = Moralis.Object.extend("_User");
        const query = new Moralis.Query(User);
        query.equalTo("objectId", user.id);
        const myDetails = await query.first();
        try {
          myDetails.set("discord", duid);
          await myDetails.save();
          let message = helpers.dispatchNotification("Profile updated.");
          notificationAlertRef.current.notificationAlert(message);
        } catch (error) {
          console.log(error);;
          let message = helpers.dispatchNotification("Error. Profile update failed.");
          notificationAlertRef.current.notificationAlert(message);
        }
      }
    }
    getDiscordId();
  },[])

  const doSave = async (data) => {
    console.log(data);
    console.log('Discord Token found, setting Moralis user variable: ' + data.id);
        const User = Moralis.Object.extend("_User");
        const query = new Moralis.Query(User);
        query.equalTo("objectId", user.id);
        const myDetails = await query.first();
        try {
          myDetails.set("discord", data.id);
          await myDetails.save();
          let message = helpers.dispatchNotification("Profile updated.");
          notificationAlertRef.current.notificationAlert(message);
        } catch (error) {
          console.log(error);;
          let message = helpers.dispatchNotification("Error. Profile update failed.");
          notificationAlertRef.current.notificationAlert(message);
        }
  };
  
  //set Faction details
  const factionHandler = async (faction) => {
    console.log(faction);
    const Factions = Moralis.Object.extend("Factions");
    const query = new Moralis.Query(Factions);
    query.equalTo("Name", faction);
    const factionResult = await query.first();
    console.log(factionResult);
    setFaction(factionResult);
  };
  
  //save Profile edits
  const saveEdits = async () => {
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    query.equalTo("objectId", user.id);
    const myDetails = await query.first();
    try {
      if (bio){
        myDetails.set("bio", bio);
      }
      if (selectedPFP){
        myDetails.set("pfp", selectedPFP);
      }
      if (username){
        myDetails.set("username", username);
      }
      if (discord){
        myDetails.set("discord", discord);
      }
      if (gamertag){
        myDetails.set("gamertag", gamertag);
      }
      if (referrer){
        try {
          const Referrers = Moralis.Object.extend("_User");
          const myReferrer = new Referrers();
          myReferrer.id = referrer;
          myDetails.set("Referrer", myReferrer);
          myDetails.set("ReferrerId", myReferrer.id);
        } catch (error) {
          console.log(error);
        }
      }
      if (psn){
        myDetails.set("psn", psn);
      }
      if (steam){
        myDetails.set("steam", steam);
      }
      if (spiderTank) {
        myDetails.set("spiderTankId", spiderTank);
      }
      if (twitter){
        myDetails.set("twitter", twitter);
      }
      if (epicId){
        myDetails.set("epicId", epicId);
      }
      if (faction) {
        myDetails.set("faction", faction);
      }
      await myDetails.save();
      let message = helpers.dispatchNotification("Profile updated.");
      notificationAlertRef.current.notificationAlert(message);
    } catch (error) {
      console.log(error);;
      let message = helpers.dispatchNotification("Error. Profile update failed.");
      notificationAlertRef.current.notificationAlert(message);
    }
  }
  
  //open/close Modals
  const buttonHandler = () => {
    setShowModal((prevState)=>!prevState);
  }
  
  //Wallet Modal functions
  const buttonCloser = () => {
      setShowModal(false);
      setShowEditModal(false);
  }
    
  //save wallet details 
  const createWallet = async () => {
    if (user.attributes.lvk === undefined || user.attributes.lvk === null || user.attributes.lvk === '') {
      helpers.createWallet(user);
    } else {
      buttonHandler();
    }
  }
  
  //checks to see if user needs a lamden wallet
  useEffect(() => {
    async function autoCreateWallet() {
      try {
        if (user.attributes.lvk === null ||user.attributes.lvk === undefined) {
          createWallet(); 
        } 
      } catch (error) {
        console.log(error);
      }
    }
    autoCreateWallet();
  }, []);

  return (
    <>
      <div className="content">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile (openID logins coming soon)</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Username</label>
                        <Input placeholder="Enter username" defaultValue={user.attributes.username} type="text" onChange={(e)=> setUsername(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="8">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          placeholder="Enter bio"
                          defaultValue={user.attributes.bio}
                          rows="4"
                          onChange={(e)=> setBio(e.target.value)}
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Epic Games ID</label>
                        <Input placeholder="Enter ID" defaultValue={user.attributes.epicId} type="text" onChange={(e)=> setEpicId(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Steam ID</label>
                        <Input placeholder="Enter ID" defaultValue={user.attributes.steam} type="text" onChange={(e)=> setSteam(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                    <FormGroup>
                        <label>Discord ID</label>
                        <Button onClick={testServer}>Test Server Status</Button>
                        <form action="http://localhost:3080/user/api/auth" method="get">
                          <input type="submit" value="Link Discord"/>
                        </form>
                        <Input placeholder="Enter ID" disabled={true} defaultValue={user.attributes.discord} type="text" onChange={(e)=> setDiscord(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Xbox Live or Battle.net ID</label>
                        <Input placeholder="Enter ID" defaultValue={user.attributes.gamertag} type="text" onChange={(e)=> setGamertag(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>PlayStation ID</label>
                        <Input placeholder="Enter ID" defaultValue={user.attributes.psn} type="text" onChange={(e)=> setPSN(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Spider Tanks ID</label>
                        <Input placeholder="Enter ID" defaultValue={user.attributes.spiderTankId} type="text" onChange={(e)=> setSpiderTank(e.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col md="12">
                      <FormGroup>
                        <label>Referrer Code</label>
                        <Input placeholder="Paste the referral code of the person who referred you" defaultValue={user.attributes.ReferrerId} type="text" onChange={(e)=> setReferrer(e.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                          <Label for="factionSelect">Faction Select</Label>
                          <Input type="select" defaultValue="--Select--" name="factionSelect" id="factionSelect" onChange={(e)=> factionHandler(e.target.value)}>
                            <option>--Select--</option>
                            <option>Sharks</option>
                            <option>Whales</option>
                            <option>Giant Squids</option>
                          </Input>
                      </FormGroup>
                    </Col>
                    </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit" onClick={saveEdits}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar"
                      src={require("assets/img/pfp2.png")}
                    />
                    <h5 className="title">{user.attributes.username}</h5>
                  </a>
                  <h6 className="description">Guild - {!user.attributes.GuildName ? 'No guild selected': user.attributes.GuildName}</h6>
                  <h7>Join Date: {getDates(user.attributes.createdAt)}</h7>
                </div>
                <div className="card-description">
                  <p className="text-center">Referral Code: {user.id}</p>
                </div>
              </CardBody>
              <CardFooter>
                <div className="button-container">
                  <Button className="btn-wide"  onClick={createWallet} color="twitter">
                    Whale Wallet
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        
        <Row>
        <Col md="12">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <NFTBalance
                  id="nft-ui"
                  address={user.attributes.ethAddress} 
                  chain={Moralis.getChainId()}
                  />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal modalClassName="modal-black" isOpen={showModal} size="lg">
          <div className="modal-header">
            <button onClick={buttonCloser} type="button" className="close" data-dismiss="modal" aria-label="Close" >
              <i className="tim-icons icon-simple-remove"></i>
            </button>
            <h5 className="modal-title">Whale Wallet - DO NOT SHARE YOUR PRIVATE KEY OR PHRASES WITH ANYONE</h5>
          </div>
          <ModalBody>
          <div className="wallet-modal">
          <CardText>Public Key: {user.attributes.lvk} <CopyButton
                                                          text={user.attributes.lvk}
                                                          revertIn={6500}
                                                          onCopy={() => dispatchMessage()
                                                          }
                                                        /></CardText>
          <CardText>Private Key: {user.attributes.lsk} <CopyButton
                                                          text={user.attributes.lsk}
                                                          revertIn={6500}
                                                          onCopy={() => dispatchMessage()
                                                          }
                                                        /></CardText>
          <CardText>Phrases: {user.attributes.lm} <CopyButton
                                                          text={user.attributes.lm}
                                                          revertIn={6500}
                                                          onCopy={() => dispatchMessage()
                                                          }
                                                        /></CardText>
          </div>
          </ModalBody>
          <ModalFooter>
              <Button onClick={buttonCloser} color="primary">
                  Done
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default User;