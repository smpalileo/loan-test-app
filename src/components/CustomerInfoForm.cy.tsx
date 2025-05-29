import React from "react";
import { CustomerInfoForm } from "./CustomerInfoForm";

describe("<CustomerInfoForm />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CustomerInfoForm onSubmit={() => {}} />);
  });
});
