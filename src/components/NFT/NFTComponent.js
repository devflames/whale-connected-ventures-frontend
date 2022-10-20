import { useNotification } from '@web3uikit/core';
import { NFT } from '@web3uikit/web3';
import { Google } from '@web3uikit/icons';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import React, {useState, useEffect} from "react";
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
    Label,
    CardImg, CardTitle, Button, Modal, ModalHeader, ModalBody, ModalFooter,  Nav, NavItem, NavLink, TabPane, TabContent, Pagination, PaginationItem, PaginationLink
  } from "reactstrap";


export default function NFTComponent(collectionSelection) {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const notificationAlertRef = React.useRef(null);
  const Web3Api = useMoralisWeb3Api();
  const [nfts, setNFTs] = useState();
  const [nftCount, setNFTCount] = useState();
  const [collectionName, setCollectionName] = useState("");
  const [cursor, setCursor] = useState();
  const [prevCursor, setPrevCursor] = useState("");

   //load data when hitting page
   useEffect(() => {
    async function getNFTs() {
        console.log(collectionSelection);
        setCollectionName(collectionSelection.collectionSelection);
        console.log(collectionName);
      try {
        const NFTs = await fetchNFTsForContract("Town Star", collectionSelection.collectionSelection);
        setNFTs(NFTs);
      } catch (error) {
        console.log(error);
      }
    }
    getNFTs();
  }, []);

  //on load function
  const fetchNFTsForContract = async (collectionName, game) => {
    const options = {
      chain: "eth",
      address: "0xfE192ec5f16cEe038E70aFd28A42Fb466D8E2569",
      token_address: "0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c",
      limit: 100, 
    };

    const galaNFTs = await Web3Api.account.getNFTsForContract(options);
    setNFTCount(galaNFTs.total);
    setCursor(galaNFTs.cursor);
    console.log(galaNFTs.cursor);

    var unorganizedResult = [];
    var result = [];
    unorganizedResult = galaNFTs.result;

    let i = 0;
    unorganizedResult.forEach(element => {
      let metaText = JSON.stringify(element.metadata);
      let resultBoolean = metaText.includes(game);

      if (resultBoolean === true ) {
        if (element.name === collectionName) {
          result.push([element.token_address, element.token_id]);
          i = i + 1;
        } else {
          console.log('Collection not found.');
        }
    }
    });
    console.log(result);
    return result;
  };


//set first page button function
  const setFirstPage = async () => {
    const options = {
      chain: "eth",
      address: "0xfE192ec5f16cEe038E70aFd28A42Fb466D8E2569",
      token_address: "0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c",
      limit: 100,
      cursor: ""
    };

    const galaNFTs = await Web3Api.account.getNFTsForContract(options);
    setCursor(galaNFTs.cursor);
    setNFTCount(galaNFTs.total);

    var unorganizedResult = [];
    var result = [];
    unorganizedResult = galaNFTs.result;

    let i = 0;
    unorganizedResult.forEach(element => {
      let metaText = JSON.stringify(element.metadata);
      let resultBoolean = metaText.includes(collectionSelection.collectionSelection);

      if (resultBoolean === true ) {
        //if (element.name === collectionName) {
          result.push([element.token_address, element.token_id]);
          i = i + 1;
        //} else {
       ///   console.log('Collection not found.');
       // }
    }
    });
    setNFTs(result);
    return result;
  }

  //set next page button function
  const setNextPage = async () => {
    const options = {
      chain: "eth",
      address: "0xfE192ec5f16cEe038E70aFd28A42Fb466D8E2569",
      token_address: "0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c",
      limit: 100,
      cursor: cursor
    };

    console.log(cursor);
    setPrevCursor(cursor);

    const galaNFTs = await Web3Api.account.getNFTsForContract(options);
    setCursor(galaNFTs.cursor);
    setNFTCount(galaNFTs.total);
    console.log(galaNFTs.cursor);
    console.log(collectionSelection.collectionSelection);

    var unorganizedResult = [];
    var result = [];
    unorganizedResult = galaNFTs.result;

    let i = 0;
    unorganizedResult.forEach(element => {
      let metaText = JSON.stringify(element.metadata);
      let resultBoolean = metaText.includes(collectionSelection.collectionSelection);

      if (resultBoolean === true ) {
        result.push([element.token_address, element.token_id]);
        i = i + 1;
    }
    });
    setNFTs(result);
    return result;
  }

  const toggleCursor =() =>{
    setCursor((prevState)=>!prevState);
  }

  //set previous page function
  const setPrevPage = async () => {
    console.log(prevCursor);
    //console.log(toggleState());
    const options = {
      chain: "eth",
      address: "0xfE192ec5f16cEe038E70aFd28A42Fb466D8E2569",
      token_address: "0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c",
      limit: 100,
      cursor: prevCursor
    };

    setPrevCursor(cursor);
    console.log(cursor);

    const galaNFTs = await Web3Api.account.getNFTsForContract(options);
    setCursor(galaNFTs.cursor);
    setNFTCount(galaNFTs.total);
    console.log(galaNFTs.cursor);
    console.log(collectionSelection.collectionSelection);

    var unorganizedResult = [];
    var result = [];
    unorganizedResult = galaNFTs.result;

    let i = 0;
    unorganizedResult.forEach(element => {
      let metaText = JSON.stringify(element.metadata);
      let resultBoolean = metaText.includes(collectionSelection.collectionSelection);
      //console.log(metaText);
      //console.log(resultBoolean);

      if (resultBoolean === true ) {
        //console.log(collectionName);
        //console.log('Pushing results');
        result.push([element.token_address, element.token_id]);
        i = i + 1;
    }
    });
    //console.log(result);
    setNFTs(result);
    return result;
  }
  
  return (
    <>
      <div className="content">
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

      <Col>
        <Row className="nft-rows">
          {nfts?.map((e, i) => {
            return (
              <>
                <div key={i}>
                  <NFT
                    address={e[0]}
                    chain="eth"
                    fetchMetadata
                    tokenId={e[1]}
                    />
                    <div className="text-center">
                      <Button color="primary">View Listing</Button>
                    </div>
                    <br/>
                </div>
              </>
            )
          })} 
        </Row>
        {/*<Button onClick={setFirstPage}>First</Button>*/}
        <div className="text-center">
        <Button color="primary btn-wide" onClick={setPrevPage}>Prev</Button>
        <Button color="primary btn-wide" onClick={setNextPage}>Next</Button>
        {/*<Button>Last</Button>*/}
        </div>
      </Col>
    </div>
    </>
  )
}



