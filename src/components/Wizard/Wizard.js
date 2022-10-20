import React from "react";
// react plugin used to create a form with multiple steps
import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import { Col } from "reactstrap";

// wizard steps
import Step1 from "./WizardSteps/Step1.js";
import Step2 from "./WizardSteps/Step2.js";
import Step3 from "./WizardSteps/Step3.js";

import "../../styles.css";

var steps = [
  {
    stepName: "Create Profile",
    stepIcon: "tim-icons icon-single-02",
    component: Step1
  },
  {
    stepName: "Join Discord",
    stepIcon: "tim-icons icon-chat-33",
    component: Step2
  },
  {
    stepName: "Play Games",
    stepIcon: "tim-icons icon-controller",
    component: Step3
  }
];



const Wizard = () => {
  return (
    <>
        <Col className="mr-auto ml-auto" md="12">
          <ReactWizard
            steps={steps}
            navSteps
            validate={true}
            title="Get Started"
            description="This information helps us match you to games and allocate rewards"
            headerTextCenter
            finishButtonClasses="btn-wd btn-info"
            nextButtonClasses="btn-wd btn-info"
            previousButtonClasses="btn-wd"
            progressbar
            color="blue"
          />
        </Col>
    </>
  );
};

export default Wizard;
