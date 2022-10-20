import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Switch, Route, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.js";
import UserLayout from "layouts/User/User.js";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";

import { useMoralis } from "react-moralis";
import { Button } from '@web3uikit/core';
import { ConnectButton, NFT } from '@web3uikit/web3';

import "./styles.css";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";

const App = () => {
  const { isAuthenticated, authenticate, authError, isAuthenticating, Moralis } = useMoralis();
  const [email, setEmail] = useState("");
  const cors = require("cors");
  
  //Magic Authentication
  const handleCustomLogin = async () => {
    await authenticate({
      provider: "magicLink",
      email: email,
      apiKey: "pk_live_730241E0656E5F1E", // Enter API key from Magic Dashboard https://dashboard.magic.link/
      network: "mainnet"
    });
  };
  
    return (
      <> 
      {isAuthenticated ? (
      <Switch>
        {/*<Route path="/auth" render={(props) => <AuthLayout {...props} />} />*/}
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/user" render={(props) => <UserLayout {...props} />} />
        <Redirect from="/" to="/user/dashboard" />
      </Switch>
      ) : (
        <>
        <div className="login-page">
          <div className="">
          <Container>
          
            <Card className="text-center">
              <CardHeader>
                <img src="https://i.ibb.co/BwrtwTh/WC-Logo-Small.png" width={150} height={150} alt='WCG' />
              </CardHeader>
              <CardBody className="text-center">
              {isAuthenticating && <p className="green">Please wait - authenticating...</p>}
                {authError && (
                  <p className="error">{JSON.stringify(authError.message)}</p>
                )}
                <input
                  type={"email"}
                  className="login-email-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <button className="login-button" onClick={handleCustomLogin}>
                Login with Magic Link
                </button>
                <p className="login-text">OR</p>
                <div className="connect-button">
                  <ConnectButton id="connect-button" signingMessage="Welcome to the Guild of Guilds dApp. You must be at least 18 years of age or older to enter unless otherwise dictated by your country of residence."/>
                </div>
                </CardBody>
              <CardFooter>
                <a className="nav-link" target="_blank" href="">
                  Privacy Policy
                </a>
                <a className="nav-link" target="_blank"  href="">
                  Terms and Conditions
                </a>
              </CardFooter>
            </Card>
          </Container>
          </div>
        </div>
        </>
      )}
      </>
    );
  };
  
  export default App;
