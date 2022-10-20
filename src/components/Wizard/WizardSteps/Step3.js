
import React from "react";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";

// reactstrap components
import { FormGroup, Input, Row, Col } from "reactstrap";

const Step3 = React.forwardRef((props, ref) => {
  const [step3Select, setstep3Select] = React.useState(null);
  React.useImperativeHandle(ref, () => ({
    isValidated: undefined
  }));
  return (
    <>
      <Row>
      <Col md="12" className="text-center">
          <Row>
            <Col className="px-md-1" md="12">
            <h4>Thank you for registering! Please navigate to the Games page and join the games you enjoy to start earning rewards! <i className="tim-icons icon-satisfied" /></h4>
            </Col>
          </Row>
      </Col>
    </Row>
    </>
  );
});

export default Step3;
