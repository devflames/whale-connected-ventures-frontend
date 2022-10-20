import React, { useState, useRef, useEffect } from 'react'
import { Icon, Input, Widget, CopyButton, NFTBalance, Modal, useNotification, Select} from '@web3uikit/core';
import { useMoralis, useWeb3ExecuteFunction, useMoralisWeb3Api, useMoralisCloudFunction} from "react-moralis";

//this import fixes the issue with console.log 
import console from 'console-browserify';

import Lamden from 'lamden-js';
import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';

import {
  //Button,
  Button, Row, CardBody
} from "reactstrap";


export default function HandleRewardsComponent(gameId) {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
  const [scheduler, setScheduler] = useState();

  const stopScheduler = () => {
    console.log('Stopping Scheduler');
    console.log(scheduler);
    scheduler.stopById(gameId.gameId);
  };

  const checkScheduler = () => {
    console.log('Checking Scheduler');
    console.log(scheduler);
  };

  const startScheduler = () => {
    console.log('Starting Scheduler');
    const scheduler = new ToadScheduler();

      const task = new Task('simple task', () => {
        // check status of jobs
        console.log('Task Status: ' + scheduler.getById(gameId.gameId).getStatus());
        console.log('Game: ' + gameId.gameName);
        sendRewards(user);
        var now = new Date();
        // convert date to a string in UTC timezone format:
        console.log(now.toUTCString());
      });

      const job = new SimpleIntervalJob(
        { hours: 24, runImmediately: true },
        task,
        gameId.gameId
      );

    //create and start jobs
    scheduler.addSimpleIntervalJob(job);

    setScheduler(scheduler);

    // remove job with ID: id_1
    //scheduler.removeById('id_1');
  };

  const { getUsers } = useMoralisCloudFunction(
      "getUsers",
      { },
      { autoFetch: false }
    );
  
  const { getGameRewardsPerGamer } = useMoralisCloudFunction(
      "getGameRewardsPerGamer",
      { game: "QrqeihMKucbH31slsckEjdhe" },
      { autoFetch: false }
    );
  
  const { getGamersPerGame } = useMoralisCloudFunction(
      "getGamersPerGame",
      { game: "QrqeihMKucbH31slsckEjdhe" },
      { autoFetch: false }
    );
  
  const { fetch } = useMoralisCloudFunction(
      "getRewardDetails",
      { game: gameId.gameId },
      { autoFetch: false }
    );

  const { getSpecificUsers } = useMoralisCloudFunction(
      "getSpecificUsers",
      { userId: "Ne1VdSPDj8qjNUrwWGcHroCG"},
      { autoFetch: false }
    );

  const cloudCall = () => {
      return fetch({
          onSuccess: (data) => console.log(data), 
      });
  };
    
//send TAU Token - needs to be updated to BLBR method style
  const sendTau = async (e) => {
    //declare networkInfo
    let networkInfo = {
  
      // Required: type of network 'mockchain', 'testnet', 'mainnet'
      type: 'mainnet',
  
      // Required: must begin with http or https
      hosts: ['https://masternode-01.lamden.io']
    };

    //declare TXInfo
    //Sender and Receiver public keys
    let senderVk = e.attributes.lvk;
    console.log("senderVK: " + senderVk);
    let receiverVk = "395312b214f1a96ded5dea1a1dfef16e9fdff349dfd92b14bedf7182d23b4d20";

    // Kwargs are the arugments you will send the contract method.  
    // For example the "currency" contract's "transfer" method needs two arguments to create a transfter; the person reciving the TAU and the amount to transfer.  So we create a kwargs object like so.
    let kwargs = {
            to: receiverVk,
            amount: 1,
    };

    let txInfo = {
        senderVk,
        kwargs,
        contractName: "currency",
        methodName: "transfer",
        stampLimit: 50, //Max stamps to be used. Could use less, won't use more.
    };

    let keystore = new Lamden.Keystore({key: {sk: e.attributes.lsk}});
    //let pubkey = Lamden.wallet.getVk(e.attributes.lsk);

    // Get a wallet from the keystore
    let wallet = keystore.getWallet(e.attributes.lvk);
    console.log(wallet);

    // Make a new transaction
    let tx = new Lamden.TransactionBuilder(networkInfo, txInfo);
    console.log(tx);

    // Send transaction
    //tx.send(e.attributes.lsk);

    tx.events.on('response', (response) => { 
        if (tx.resultInfo.type === 'error') return 
        console.log(response);
      });
      tx.send(e.attributes.lsk).then(() => tx.checkForTransactionResult());
  };

//send BLBR Token
  const sendBLBR = async (e, receiver, sendAmount, array) => {
    //declare networkInfo
    array.forEach(element => {
        let networkInfo = {
  
            // Required: type of network 'mockchain', 'testnet', 'mainnet'
            type: 'mainnet',
        
            // Required: must begin with http or https
            hosts: ['https://masternode-01.lamden.io']
          };
      
          //declare TXInfo
          //Sender and Receiver public keys
          let senderVk = e.attributes.lvk;
          console.log("senderVK: " + senderVk);
          //let receiverVk = "395312b214f1a96ded5dea1a1dfef16e9fdff349dfd92b14bedf7182d23b4d20";
          let receiverVk = receiver;
      
          // Kwargs are the arugments you will send the contract method.  
          // For example the "currency" contract's "transfer" method needs two arguments to create a transfter; the person reciving the TAU and the amount to transfer.  So we create a kwargs object like so.
          let kwargs = {
                  to: receiverVk,
                  amount: sendAmount,
          };
      
          let txInfo = {
              senderVk,
              kwargs,
              contractName: "con_blubber_contract",
              methodName: "transfer",
              stampLimit: 50, //Max stamps to be used. Could use less, won't use more.
          };
      
          let keystore = new Lamden.Keystore({key: {sk: e.attributes.lsk}});
          //let pubkey = Lamden.wallet.getVk(e.attributes.lsk);
      
          // Get a wallet from the keystore
          let wallet = keystore.getWallet(e.attributes.lvk);
          console.log(wallet);
      
          // Make a new transaction
          let tx = new Lamden.TransactionBuilder(networkInfo, txInfo);
          console.log(tx);

          // Sign the transaction with the wallet
          tx.sign(null, wallet[0])

          //tx.txCheckAttempts = 0;
          //tx.txCheckLimit = 0;
      
          // Send transaction
           tx.send(e.attributes.lsk, (res, err) => {
              if (err) {
                  console.log(err);
                  return err;
              } else if (res) {
                  console.log(res);
                  tx.checkForTransactionResult().then(res => console.log(res));
                  return res;
              } else {
                  console.log("unknown transaction error");
                  return ("unknown transaction error");
              }
          });
    });
};

  const distributeRewards = async (e, receivers, sendAmounts, distributionData) => {
            //declare networkInfo
            let networkInfo = {
              // Required: type of network 'mockchain', 'testnet', 'mainnet'
              type: 'mainnet',
              // Required: must begin with http or https
              hosts: ['https://masternode-01.lamden.io']
            };

            let listOfReceivers = [];

            for (let index = 0; index < receivers.length; index++) {
              const element = receivers[index];
              for (let jindex = 0; jindex < element.length; jindex++) {
                  const address = element[jindex];
                  listOfReceivers.push(address);
              }
            }
        
            //declare TXInfo
            //Sender and Receiver public keys
            let senderVk = e.attributes.lvk;
            let tokenName = 'con_blubber_contract';

            // Kwargs are the arugments you will send the contract method.  
            // For example the "currency" contract's "transfer" method needs two arguments to create a transfter; the person reciving the TAU and the amount to transfer.  So we create a kwargs object like so.
            let kwargs = {
                    token: tokenName,
                    addresses: listOfReceivers,
                    amounts: sendAmounts,
            };
        
            let txInfo = {
                senderVk,
                kwargs,
                contractName: "con_distribute_v2",
                methodName: "distr_token_var",
                stampLimit: 1000, //Max stamps to be used. Could use less, won't use more.
            };
        
            // Make a new transaction
            let tx = new Lamden.TransactionBuilder(networkInfo, txInfo);
            console.log(tx);
        
            // Send transaction
            tx.send(e.attributes.lsk, (res, err) => {
                if (err) {
                    console.log(err);
                    return err;
                } else if (res) {
                    console.log(res);
                    tx.checkForTransactionResult().then(res => console.log(res));
                    return res;
                } else {
                    console.log("unknown transaction error");
                    return ("unknown transaction error");
                }
            });
  };

  //function to chunk cloud data and send rewards  
  const organizeArray = async (data, user) => {
      let input = data; 
      let organizedData = [];
      let size = 2;

      let sendAmounts = [];
      let receivers = [];
      let distributionData = [];

      for (let i = 0;  i < input.length; i += size) {
          organizedData.push(input.slice(i, i + size))
          sendAmounts.push(input[i]);
          receivers.push(input[i+1]);
      }  
      receivers.forEach(element => {
          distributionData.push(element);
          distributionData.push(sendAmounts[0]);
      });
      //console.log("distributionData: " + distributionData);
      try {
          distributeRewards(user, receivers, sendAmounts, distributionData);
      } catch (error) {
          console.log(error);
      }    
      //return distributionData;
  };  

  //send rewards based on Cloud Functions 
  const sendRewards = async (user) => {
      console.log('Game Id: ' + gameId.gameId + '; Game Name: ' + gameId.gameName);
      const cloudData = await cloudCall();
      var result = await organizeArray(cloudData, user);
      return result;
  };
  
  return (
    <>
            <Row>
              <div className="nft-rows">
              <CardBody>{gameId.gameName} - {gameId.gameId}</CardBody>
              <Button
                color="blue"
                onClick={startScheduler}
                text={'Schedule ' + gameId.gameName}
                theme="transulucent"
                type="button"
              >{'Schedule ' + gameId.gameName}</Button>
              <Button
                color="blue"
                onClick={stopScheduler}
                text={'Stop ' + gameId.gameName}
                theme="transulucent"
                type="button"
              >{'Stop ' + gameId.gameName}</Button>
              <Button
                color="blue"
                onClick={checkScheduler}
                text={'Check ' + gameId.gameName}
                theme="transulucent"
                type="button"
              >{'Check ' + gameId.gameName}</Button>
              </div>
</Row>
    </>
  )
}
