import { useNotification } from '@web3uikit/core';
import { NFT } from '@web3uikit/web3';
import { Google } from '@web3uikit/icons';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import React, {useState,useEffect} from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import NFTComponent from 'components/NFT/NFTComponent';


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
    Label,
    CardImg, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,  Nav, NavItem, NavLink, TabPane, TabContent, PaginationItem, PaginationLink
  } from "reactstrap";


export default function Marketplace() {

  const { Moralis } = useMoralis();
  //const user = Moralis.User.current();
  const notificationAlertRef = React.useRef(null);
  const [collection, setCollection] = useState("Mirandus");
  const [activePage, setActivePage] = useState(1);

  

   //set Faction details
   const collectionHandler = async (selection) => {
    console.log(selection);
    //setCollection(selection);
    return setCollection(selection);
  }
  
  
  return (
    <>
      <div className="content">
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

        <h1>
          <FormGroup>
            <Label for="factionSelect">Select NFT Collection</Label>
            <Input type="select" defaultValue="Mirandus" name="selection" id="collectionSelect" onChange={(e)=> collectionHandler(e.currentTarget.value)}>
              <option>Mirandus</option>
              <option>Town Star</option>
              <option>Spider Tanks</option>
              <option>Echoes of Empire</option>
              <option>BR1: Infinite - Coming soon </option>
              <option>Axie Origins - Coming soon </option>
            </Input>
          </FormGroup>
        </h1>

    {collection === 'Mirandus' &&
      <NFTComponent collectionSelection={collection}/> 
    }
    {collection === 'Spider Tanks' &&
      <NFTComponent collectionSelection={collection}/> 
    }
    {collection === 'Town Star' &&
      <NFTComponent collectionSelection={collection}/> 
    }
    {collection === 'Echoes of Empire' &&
      <NFTComponent collectionSelection={collection}/> 
    }

      
    </div>
    </>
  )
}



