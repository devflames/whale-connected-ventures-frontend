import React, { useState, useRef, useEffect } from 'react';
import "./BracketsComponent.css";
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

export default function BracketsComponent(props) {

  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const [teamLS, setTeamLS] = useState();
  const [teamCount, setTeamCount] = useState();
  const tournamentId = props.tournamentId;

    useEffect(() => {
        async function consoleLog() {
          try {
            console.log(props.registrations, props.round1, props.round2, props.round3, props.championship, props.tournamentId);
          } catch (error) {
            console.log(error);
          }
        }
        consoleLog();
      }, []);

      //get Team records
    useEffect(() => {
      async function getTeams(tournamentId) {
        try {
          console.log(props.tournamentId);
          const Teams = Moralis.Object.extend("Teams");
          const query = new Moralis.Query(Teams); 
          query.equalTo("TournamentId", props.tournamentId);
         // query.ascending("Name");
          const results = await query.find();
          setTeamLS(results);   
          setTeamCount(results.length);
          console.log(results.length);
          console.log(results);    
        } catch (error) {
          console.log(error);
        }
      }
      getTeams();
    }, []);

    function isEven(n) {
      n = Number(n);
      console.log(n === 0 || !!(n && !(n%2)));
      return n === 0 || !!(n && !(n%2));
    }

  return (

    <>
    {props.registrations === undefined ? (
      <p>No registrations found...</p>
      ) : (
        
    
        <section className="bracket" id="bracket">
            <div className="container">
              <Row className="center-stuff">
              <Col xs="4" lg="4" md="4">
                <div className="">
                  <div className="round-details">Round 1<br/><span className="date">{props.round1}</span></div>
                    <br/>
                    {teamLS?.map((e, i) => {
                      return (
                        <>
                        <div className="bracket-replacement">
                          {isEven(i) === true &&
                            <div className="team team-top">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                          }
                          {isEven(i) === false &&
                            <div className="team team-bottom">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                          }
                          </div>
                        </>
                      )
                    })} 
              </div> 
              </Col>
              
              <Col xs="4" lg="4" md="4">
              <div className="">
                <div className="round-details">Round 2<br/><span className="date">{props.round2}</span></div>     
                  <br/>
                      {teamLS?.map((e, i) => {
                        return (
                          <>
                          <div className="bracket-replacement">
                            {isEven(i) === true && e.attributes.Round1Winner === true &&
                              <div className="team team-top">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                            }
                            {isEven(i) === false && e.attributes.Round1Winner === true && 
                              <div className="team team-bottom">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                            }
                            </div>
                          </>
                        )
                      })} 
              </div> 
              </Col>
              
              <Col xs="4" lg="4" md="4">
              <div className="">
                  <div className="round-details">Round 3<br/><span className="date">{props.round3}</span></div>   
                    <br/>
                        {teamLS?.map((e, i) => {
                          return (
                            <>
                            <div className="bracket-replacement">
                              {isEven(i) === true && e.attributes.Round2Winner === true &&
                                <div className="team team-top">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                              }
                              {isEven(i) === false && e.attributes.Round2Winner === true && 
                                <div className="team team-bottom">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                              }
                              </div>
                            </>
                          )
                        })}     
                </div>    
                </Col>
                </Row>
    
        <Row className="center-stuff">
          <Col xs="12" lg="12" md="12">
              <div className="champion">
                <div className="">
                <br/>
                  <div className="champion-round-details">Championship <br/><span className="date">{props.championship}</span>
                  <br/>
                  <i className="fa fa-trophy"></i>
                  <br/>
                  </div>  
                    &nbsp;
                        {teamLS?.map((e, i) => {
                          return (
                            <>
                            <div className="bracket-replacement">
                              {isEven(i) === true && e.attributes.Round3Winner === true &&
                                <div className="team team-top">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                              }
                              {isEven(i) === false && e.attributes.Round3Winner === true && 
                                <div className="team team-bottom">{e.attributes.Name ? e.attributes.Name : "Pending Matchup"}</div>
                              }
                              </div>
                            </>
                          )
                        })}     
                </div>
              </div>
              </Col>
              </Row>
    
          </div>
        </section>
      
      )}
    </>
  

  


  )
}
