import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { Input, Icon, Button, Widget, CopyButton, NFTBalance, Modal, useNotification, Select, Info } from '@web3uikit/core';
import { useMoralis, useWeb3ExecuteFunction, useMoralisWeb3Api, useMoralisCloudFunction} from "react-moralis";
import HandleRewardsComponent from './HandleRewardsComponent';
import TeamsComponent from './TeamsComponent';
//import TeamBuilderComponent from './TeamBuilderComponent';

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col
} from "reactstrap";

//this import fixes the issue with console.log 
import console from 'console-browserify';

export default function DistributionManagerComponent(param) {
    const { Moralis } = useMoralis();
    const user = Moralis.User.current();
    const [balance, setBalance] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const walletAddress = user.attributes.lvk;
    const apiUrl = 'https://blockservice.nebulamden.finance/current/all/con_blubber_contract/balances/' + walletAddress;

    const [horizontalTabs, sethorizontalTabs] = React.useState("profile");
    const [verticalTabs, setverticalTabs] = React.useState("profile");
    const [verticalTabsIcons, setverticalTabsIcons] = React.useState("home");
    const [pageTabs, setpageTabs] = React.useState("home");
    const [openedCollapseOne, setopenedCollapseOne] = React.useState(false);
    const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
    const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
  // with this function we change the active tab for all the tabs in this page
    //run on page load to get balances
    useEffect(()=> {
      //getBLBRBalance();
    },[]);
  
  return (
    <>
      <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h3">Admin Panel</CardTitle>
              </CardHeader>
              <div
                aria-multiselectable={true}
                className="card-collapse"
                id="accordion"
                role="tablist"
              >
                <Card className="card-plain">
                  <CardHeader role="tab">
                    <a
                      aria-expanded={openedCollapseOne}
                      href="#pablo"
                      data-parent="#accordion"
                      data-toggle="collapse"
                      onClick={(e) => {
                        e.preventDefault();
                        setopenedCollapseOne(!openedCollapseOne);
                      }}
                    >
                      Reward Distributions{" "}
                      <i className="tim-icons icon-minimal-down" />
                    </a>
                  </CardHeader>
                  <Collapse role="tabpanel" isOpen={openedCollapseOne}>
                    <CardBody>
                      <HandleRewardsComponent gameName="ev.io" gameId="QrqeihMKucbH31slsckEjdhe"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Town Star" gameId="rr7DWmTEYsl8stLNkyetdXbh"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Rust" gameId="5sGbr8xGzIxlQYBLHQ21vwLp"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Hunt: Showdown" gameId="ezDScMuO937R8ra1sevvHO7W"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Call of Duty: Warzone" gameId="3nga0R8KpK17lSsnXxXiGL1t"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Axie Infinity" gameId="hCPAbcNCdXFQDGIYZR9ciMQl"/>
                      &nbsp;
                      <HandleRewardsComponent gameName="Valorant" gameId="xqTNJWeAn8qIuCtnjidkC8cp"/>
                      &nbsp;
                    </CardBody>
                  </Collapse>
                </Card>
                <Card className="card-plain">
                  <CardHeader role="tab">
                    <a
                      aria-expanded={openedCollapseTwo}
                      href="#pablo"
                      data-parent="#accordion"
                      data-toggle="collapse"
                      onClick={(e) => {
                        e.preventDefault();
                        setopenedCollapseTwo(!openedCollapseTwo);
                      }}
                    >
                      Manage Tournaments{" "}
                      <i className="tim-icons icon-minimal-down" />
                    </a>
                  </CardHeader>
                  <Collapse role="tabpanel" isOpen={openedCollapseTwo}>
                    <CardBody>
                     Tournament Manager Goes Here
                    </CardBody>
                  </Collapse>
                </Card>
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
                      Team Manager{" "}
                      <i className="tim-icons icon-minimal-down" />
                    </a>
                  </CardHeader>
                  <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                    <CardBody>
                     <TeamsComponent/>
                    </CardBody>
                  </Collapse>
                </Card>
              </div>
            </Card>
          </Col>
        </Row>
    </>
  )
}
