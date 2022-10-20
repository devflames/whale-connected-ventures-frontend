
/*eslint-disable*/
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

const Footer = (props) => {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link"
             href=""
             target="_blank" >
              Privacy Policy
            </a>
          </li>{" "}
          <li className="nav-item">
            <a
              className="nav-link"
              target="_blank" 
              href="">
              Terms and Conditions
            </a>
          </li>{" "}
        </ul>
        <div className="copyright">
          © {new Date().getFullYear()} made with{" "}
          <i className="tim-icons icon-heart-2" /> by{" "}
          <a href="https://whaleconnected.io/" target="_blank">
            Whale Connected Ventures
          </a>{" "}
          for a better Metaverse.
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
