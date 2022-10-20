import React, {useState,useEffect} from "react";
import console from 'console-browserify';
import Lamden from 'lamden-js';
import { useMoralis } from "react-moralis";

    const helpers = {
        //create lamden wallet if not previously created
        createWallet: async function(user){
          console.log('running create wallet');
            if (user.attributes.lvk !== null && user.attributes.lvk !== undefined) {
                console.log("Wallet already created.");
                return false;
              } else {
                console.log("Creating new Wallet.");
                let lamdenWallet = Lamden.wallet.new_wallet_bip39();
                  //will create keystores during beta  
                  if (lamdenWallet){
                    user.set("lvk", lamdenWallet.vk);
                    user.set("lsk", lamdenWallet.sk);
                    user.set("lm", lamdenWallet.mnemonic);
                  }
                await user.save();
                return true;
              }
        },

        //check if profile is completed and allow enrollments
        isProfileCompleted: function(data){
            try {
                if (data.attributes.username === undefined || data.attributes.username === "" || 
                    data.attributes.discord === undefined || data.attributes.discord === "" || 
                    data.attributes.faction === undefined || data.attributes.faction === "" ) {
                  return false;
                } else {
                  return true;
                }
              } catch (error) {
                console.log(error);
              }
    
        },

        //check profile type to see what features are accessible
        checkAdminRights: function(data){
            try {
                if (data.attributes.lvk === "8fefb559193a01176d864248498e25fbf8e178db3eb05bde7f9bc6f8c572d519") {
                    console.log('Admin wallet in use. Please logout when finished to ensure asset safety.');
                    return true;
                } else {
                console.log('Welcome general User.');
                return false;
                }
            } catch (error) {
                console.log(error);
                return console.log(error);
            }
        },

        //format dates to human readable format
        getDates: function(e){
            try {
                var date = new Date(e).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
                return date;
              } catch (error) {
                console.log(error);
              }
        },

        //format numbers with commas etc
        getNumbers: function(e){
            try {
                let formattedNumber = Math.round(e * 100) / 100;
                formattedNumber = formattedNumber.toLocaleString("en-US");
                return formattedNumber;
              } catch (error) {
                console.log(error);
              }
        },

        //dispatch notification format to return to notification message in any component
        dispatchNotification: function(data){
            let notifyMessage = data;
            let options = {};
            options = {
                place: "tr",
                message: notifyMessage,
                type: "primary",
                icon: "tim-icons icon-bell-55",
                autoDismiss: 7
            };
            return options;
        }
    }

    export default helpers;
