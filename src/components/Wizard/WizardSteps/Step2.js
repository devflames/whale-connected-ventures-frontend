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

import console from 'console-browserify';
import NotificationAlert from "react-notification-alert";

const Step2 = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    isValidated: undefined
  }));
  return (
    <>
    <Row>
      <Col md="12" className="text-center">
          <Row>
            <Col className="px-md-1" md="12">
            <iframe src="https://discord.com/widget?id=890267813548281976&theme=dark" width="88%" height="420px" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </Col>
          </Row>
      </Col>
    </Row>
    </>
  );
});

export default Step2;
