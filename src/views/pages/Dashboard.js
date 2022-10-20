import React, { useState, useRef, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

//this import fixes the issue with console.log 
import console from 'console-browserify';

import DistributionManagerComponent from '../../components/Admin/AdminPanel';
import Wizard from '../../components/Wizard/Wizard';
import helpers from "Helper";
import TreasuryTauChart from "components/Charts/TreasuryTauChart";
import TreasuryBlbrChart from "components/Charts/TreasuryBlbrChart";
import UserChart from "components/Charts/UserChart";
import axios from "axios";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";


const Dashboard = () => {
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const contractProcessor = useWeb3ExecuteFunction();
  const [balance, setBalance] = useState(0);
  const [tauBalance, setTauBalance] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [treasuryTAU, setTreasuryTAU] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ profileComplete, setProfileComplete ] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  const walletAddress = user.attributes.lvk; //user wallet address
  const treasuryAddress = '8fefb559193a01176d864248498e25fbf8e178db3eb05bde7f9bc6f8c572d519'; //treasury wallet address
  const userBlbrUrl = 'https://blockservice.opticprotocol.finance/current/all/con_blubber_contract/balances/' + walletAddress; //user wallet address
  const userTAUURL = 'https://blockservice.opticprotocol.finance/current/all/currency/balances/' + walletAddress; //user wallet address
  const treasuryUrl = 'https://blockservice.opticprotocol.finance/current/all/con_blubber_contract/balances/' + treasuryAddress; //treasury wallet address
  const treasuryTAUURL = 'https://blockservice.opticprotocol.finance/current/all/currency/balances/' + treasuryAddress; //treasury wallet address

  //check to see user type
const checkUser = () => {
  let profileType = helpers.checkAdminRights(user);
  setIsAdmin(profileType);
};

//check if profile is completed
const isProfileCompleted = () => {
  try {
    let profileCheck = helpers.isProfileCompleted(user);
     if (profileCheck === true) {
      setProfileComplete(true);
     } else {
      setProfileComplete(false);
     }
  } catch (error) {
    console.log(error);
  }
}

const getReferrals = async () => {
  try {
    console.log(user.id);
    const Users = Moralis.Object.extend("_User");
    const query = new Moralis.Query(Users); 
    query.equalTo("ReferrerId", user.id);
    query.notEqualTo("objectId", user.id);
    query.ascending("Name");
    const results = await query.find();
    setReferralCount(results.length);   
    console.log(results.length);
  } catch (error) {
    console.log(error);
  }
}

//called to get API data for balances
const getBLBRBalances = () => {
    axios
    .get(userBlbrUrl)
    .then(response => {
      //setTheData(response.data);
      if (response.data.con_blubber_contract.balances[walletAddress].__fixed__ !== undefined) {
        let walletBalance = response.data.con_blubber_contract.balances[walletAddress].__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setBalance(walletBalance);
      }
      else if (response.data.con_blubber_contract.balances[walletAddress].__hash_self__.__fixed__ !== undefined) {
        let walletBalance = response.data.con_blubber_contract.balances[walletAddress].__hash_self__.__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setBalance(walletBalance);
      };
    })
    .catch(error => {
      console.log(error);
    })

    axios
    .get(userTAUURL)
    .then(response => {
      //setTheData(response.data);
      if (response.data.currency.balances[walletAddress].__fixed__ !== undefined) {
        let walletBalance = response.data.currency.balances[walletAddress].__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTauBalance(walletBalance); 
      }
      else if (response.data.currency.balances[walletAddress].__hash_self__.__fixed__ !== undefined) {
        let walletBalance = response.data.currency.balances[walletAddress].__hash_self__.__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTauBalance(walletBalance); 
      };
    })
    .catch(error => {
      console.log(error);
    })

    axios
    .get(treasuryUrl)
    .then(response => {
      //setTheData(response.data);
      if (response.data.con_blubber_contract.balances[treasuryAddress].__fixed__ !== undefined) {
        let walletBalance = response.data.con_blubber_contract.balances[treasuryAddress].__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTreasuryBalance(walletBalance); 
      }
      else if (response.data.con_blubber_contract.balances[treasuryAddress].__hash_self__.__fixed__ !== undefined) {
        let walletBalance = response.data.con_blubber_contract.balances[treasuryAddress].__hash_self__.__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTreasuryBalance(walletBalance); 
      };
    })
    .catch(error => {
      console.log(error);
    })

    axios
    .get(treasuryTAUURL)
    .then(response => {
      //setTheData(response.data);
      if (response.data.currency.balances[treasuryAddress].__fixed__ !== undefined) {
        let walletBalance = response.data.currency.balances[treasuryAddress].__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTreasuryTAU(walletBalance); 
      }
      else if (response.data.currency.balances[treasuryAddress].__hash_self__.__fixed__ !== undefined) {
        let walletBalance = response.data.currency.balances[treasuryAddress].__hash_self__.__fixed__;
        walletBalance = helpers.getNumbers(walletBalance);
        setTreasuryTAU(walletBalance); 
      };
    })
    .catch(error => {
      console.log(error);
    })
}

//run on page load to get balances
useEffect(()=> {
  try {
    checkUser();
    getBLBRBalances();
    isProfileCompleted();
    getReferrals();
  } catch (error) {
    console.log(error);
  }
},[]);

  return (
    <>
      <div className="content">
      { !profileComplete &&
          <Row>
          <Col lg="12">
              <Card >
                <CardBody>
                  <Wizard />
                </CardBody>
              </Card>
            </Col>
            </Row>
      }
        
          <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Users</h5>
                    <CardTitle tag="h2">Growth</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        color="info"
                        id="0"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1"
                        })}
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Accounts
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        disabled={true}
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2"
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Registrations
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        disabled={true}
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3"
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Rewards
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <UserChart chartName='User Count'/>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
          <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-primary">
                      <i className="tim-icons icon-money-coins" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">My $TAU</p>
                      <CardTitle tag="h3">{tauBalance}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-refresh-01" />Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-warning">
                      <i className="tim-icons icon-money-coins" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">My $BLBR</p>
                      <CardTitle tag="h3">{balance}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-refresh-01" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-success">
                      <i className="tim-icons icon-single-02" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Referrals</p>
                      <CardTitle tag="h3">{referralCount}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-spaceship" />Keep going!
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-danger">
                      <i className="tim-icons icon-shape-star" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">User Rank</p>
                      <CardTitle tag="h3">{user.attributes.factionLevel}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-watch-time" />Rank up!
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Treasury $TAU Balance</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-wallet-43 text-primary" /> {treasuryTAU}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <TreasuryTauChart chartName='$TAU'/>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Treasury $BLBR Balance</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-wallet-43 text-info" />{" "}
                  {treasuryBalance}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                   <TreasuryBlbrChart chartName='$BLBR'/>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/*}
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Completed Quests</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-user-run text-success" /> 8
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          */}
        </Row>
        <Row className="overflow-hidden">
          <Col lg="6">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">My Quests(4) - Update coming soon!</h6>
                <p className="card-category d-inline"></p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Coming soon...
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive overflow-hidden">
                  <Table>
                    <tbody>
                    <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input disabled={true} defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Join Discord</p>
                          <p className="text-muted">
                            Join Discord so you can party with other players!
                          </p>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input disabled={true} defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Create Profile</p>
                          <p className="text-muted">
                            Create your profile so you can register for games!
                          </p>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input disabled={true} defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Join a Guild</p>
                          <p className="text-muted">
                            Play with a guild to earn additional rewards!
                          </p>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                disabled={true}
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Register for Games</p>
                          <p className="text-muted">
                            Register for the games you play so you can earn rewards!
                          </p>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input disabled={true} defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Compete in Tournaments</p>
                          <p className="text-muted">
                            Compete in tournaments to earn additional rewards!
                          </p>
                        </td>
                        
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" className="overflow-hidden">
            <Card className="overflow-hidden">
              <CardHeader className="overflow-hidden">
                <div className="tools float-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Coming soon...
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <CardTitle tag="h5">Leaderboard</CardTitle>
              </CardHeader>
              <CardBody className="overflow-hidden">
                <Table className="overflow-hidden" responsive>
                  <thead className="text-primary overflow-hidden">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Name</th>
                      <th>Game</th>
                      <th>Milestone</th>
                      <th className="text-right">Rewards</th>
                      {/*<th className="text-right">Actions</th>*/}
                    </tr>
                  </thead>
                  <tbody className="overflow-hidden">
                    <tr>
                      <td className="text-center overflow-hidden">
                        <div className="photo">
                          <img
                            alt="..."
                            src={require("assets/img/tania.jpg")}
                          />
                        </div>
                      </td>
                      <td>Henry Rearden</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">92%</span>
                            <Progress bar max="100" value="92.5" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">9,225</td>
                      {/*
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="success"
                          id="tooltip618296632"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip618296632"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="danger"
                          id="tooltip707467505"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip707467505"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                      */}
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="photo">
                          <img alt="..." src={require("assets/img/robi.jpg")} />
                        </div>
                      </td>
                      <td>Cwarsh24</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">92%</span>
                            <Progress bar max="100" value="92" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">9,201</td>
                      {/*}
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="success"
                          id="tooltip216846074"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip216846074"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="danger"
                          id="tooltip391990405"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip391990405"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                      */}
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="photo">
                          <img alt="..." src={require("assets/img/lora.jpg")} />
                        </div>
                      </td>
                      <td>Bayou Giga Chad</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">81%</span>
                            <Progress bar max="100" value="81" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">8,144</td>
                      {/*}
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="success"
                          id="tooltip191500186"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip191500186"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon btn-neutral"
                          color="danger"
                          id="tooltip320351170"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip320351170"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                      */}
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="photo">
                          <img alt="..." src={require("assets/img/jana.jpg")} />
                        </div>
                      </td>
                      <td>Bullshit</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">69%</span>
                            <Progress bar max="100" value="69" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">6,990</td>
                      {/*}
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon"
                          color="success"
                          id="tooltip345411997"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip345411997"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon"
                          color="danger"
                          id="tooltip601343171"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip601343171"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                    */}
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="photo">
                          <img alt="..." src={require("assets/img/mike.jpg")} />
                        </div>
                      </td>
                      <td>Legendary Jake</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">42%</span>
                            <Progress bar max="100" value="42" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">4,201</td>
                      {/*}
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon"
                          color="success"
                          id="tooltip774891382"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip774891382"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon"
                          color="danger"
                          id="tooltip949929353"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip949929353"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                    */}
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="photo">
                          <img
                            alt="..."
                            src={require("assets/img/emilyz.jpg")}
                          />
                        </div>
                      </td>
                      <td>Blaka Blaka</td>
                      <td>Hunt: Showdown</td>
                      <td className="text-center">
                        <div className="progress-container progress-sm">
                          <Progress multi>
                            <span className="progress-value">32%</span>
                            <Progress bar max="100" value="32" />
                          </Progress>
                        </div>
                      </td>
                      <td className="text-right">3,201</td>
                      {/*}
                      <td className="text-right">
                        <Button
                          className="btn-link btn-icon"
                          color="success"
                          id="tooltip30547133"
                          size="sm"
                          title="Refresh"
                          type="button"
                        >
                          <i className="tim-icons icon-refresh-01" />
                        </Button>
                        <UncontrolledTooltip delay={0} target="tooltip30547133">
                          Tooltip on top
                        </UncontrolledTooltip>
                        <Button
                          className="btn-link btn-icon"
                          color="danger"
                          id="tooltip156899243"
                          size="sm"
                          title="Delete"
                          type="button"
                        >
                          <i className="tim-icons icon-simple-remove" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip156899243"
                        >
                          Tooltip on top
                        </UncontrolledTooltip>
                      </td>
                    */}
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          { isAdmin &&
              <DistributionManagerComponent/* treasuryTAU={treasuryTAU} treasuryBLBR={treasuryBalance} *//>
          }
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
