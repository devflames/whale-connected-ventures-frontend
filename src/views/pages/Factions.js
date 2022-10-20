import { useNotification } from '@web3uikit/core';
import {  } from '@web3uikit/web3';
import {  } from '@web3uikit/icons';
import { useMoralis } from "react-moralis";
import React, {useState,useEffect} from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

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


export default function Factions() {

  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const notificationAlertRef = React.useRef(null);

  return (
    <>
      <div className="content">
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
        <Row>
          <Col md="12">
          <Card>
              <CardHeader>
                <h5 className="title">Coming soon - stay tuned!</h5>
              </CardHeader>
              <CardBody>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}



