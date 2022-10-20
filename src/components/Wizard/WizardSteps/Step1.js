import classnames from "classnames";
// reactstrap components
import {
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col, Card, CardHeader, CardBody, Form, FormGroup, Label, CardFooter, Button, CardText
} from "reactstrap";

import React, { useState, useRef, useEffect } from 'react';
import { useMoralis, useWeb3ExecuteFunction, useMoralisWeb3Api } from "react-moralis";
import Lamden from 'lamden-js';
import console from 'console-browserify';
import NotificationAlert from "react-notification-alert";
import helpers from 'Helper';


const Step1 = React.forwardRef((props, ref) => {
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
  const { Moralis, isAuthenticated, account } = useMoralis();
  const user = Moralis.User.current();
  const notificationAlertRef = React.useRef(null);

  const createWallet = async () => {
    return helpers.createWallet(user);
  }

  //set Faction details
  const factionHandler = async (faction) => {
    console.log(faction);
    const Factions = Moralis.Object.extend("Factions");
    const query = new Moralis.Query(Factions);
    query.equalTo("Name", faction);
    const factionResult = await query.first();
    console.log(factionResult);
    setFaction(factionResult);
  }
  
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
    } catch (error) {
      console.log(error);      
    }
  }

  const change = (target, value, id) => {
    try {
      if (id==="discord") {
        setDiscord(value);
      } else if (id==="username") {
         setUsername(value);
      } else if (id==="bio") {
         setBio(value);
      } else if (id==="psn") {
         setPSN(value);
      } else if (id==="steam") {
         setSteam(value);
      } else if (id==="gamertag") {
         setGamertag(value);
      } else if (id==="referrer") {
         setReferrer(value);
      } else if (id==="spiderTank") {
         setSpiderTank(value);
      } else if (id==="epicId") {
         setEpicId(value);
      } else if (id==="factionSelect") {
        factionHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //used on next button click
  const isValidated = () => {
    //validate here if set to true on Wizard.js file
    if (discord && faction && username)  {
    saveEdits();
    createWallet();
    return true;
    } else {
      let message = helpers.dispatchNotification("Error. Please ensure you have included your Discord Name, Username and Faction.");
      notificationAlertRef.current.notificationAlert(message);
      return false;
    }
  };

  React.useImperativeHandle(ref, () => ({
    isValidated: () => {
      return isValidated();
    }
  }));


  return (
    <>
    <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Row >
          <Col md="12">
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Username</label>
                        <Input id="username" placeholder="Enter username" defaultValue={user.attributes.username} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/> 
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="8">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          id="bio"
                          placeholder="Enter bio"
                          defaultValue={user.attributes.bio}
                          rows="4"
                          onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Epic Games ID</label>
                        <Input id="epicId" placeholder="Enter ID" defaultValue={user.attributes.epicId} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Steam ID</label>
                        <Input id="steam" placeholder="Enter ID" defaultValue={user.attributes.steam} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Discord ID</label>
                        <Input id="discord" placeholder="Enter ID" defaultValue={user.attributes.discord} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Xbox Live or Battle.net ID</label>
                        <Input id="gamertag" placeholder="Enter ID" defaultValue={user.attributes.gamertag} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>PlayStation ID</label>
                        <Input id="psn" placeholder="Enter ID" defaultValue={user.attributes.psn} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Spider Tanks ID</label>
                        <Input id="spiderTank" placeholder="Enter ID" defaultValue={user.attributes.spiderTankId} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col md="12">
                      <FormGroup>
                        <label>Referrer Code</label>
                        <Input id="referrer" placeholder="Paste the referral code of the person who referred you" defaultValue={user.attributes.Referrer} type="text" onChange={(e)=> change(e.currentTarget, e.currentTarget.value, e.currentTarget.id)}/>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                          <Label for="factionSelect">Faction Select</Label>
                          <Input type="select" name="factionSelect" id="factionSelect" defaultValue="--Select--" onChange={(e)=> factionHandler(e.currentTarget.value)}>
                            <option>--Select--</option>
                            <option>Sharks</option>
                            <option>Whales</option>
                            <option>Giant Squids</option>
                          </Input>
                      </FormGroup>
                    </Col>
                    </Row>
                </Form>
            
          </Col>
        </Row>
    </>
  );
});

export default Step1;
