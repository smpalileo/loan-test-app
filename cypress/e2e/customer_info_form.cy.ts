enum EmploymentStatus {
  Employed = "Employed",
  SelfEmployed = "SelfEmployed",
  Unemployed = "Unemployed",
}

describe("Customer Information Form", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the form correctly", () => {
    cy.get('input[name="firstName"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("should allow typing into input fields", () => {
    cy.get('input[name="firstName"]').type("John").should("have.value", "John");
    cy.get('input[name="lastName"]').type("Doe").should("have.value", "Doe");
    cy.get('input[name="email"]')
      .type("john.doe@example.com")
      .should("have.value", "john.doe@example.com");
    cy.get('input[name="phoneNumber"]')
      .type("+1234567890")
      .should("have.value", "+1234567890");
  });

  it("should handle employment status selection and conditional employer name field", () => {
    cy.get('input[name="employerName"]').should("not.exist");

    cy.get('button[role="combobox"][id="employmentStatus"]').click();
    cy.get('div[role="option"]').contains(EmploymentStatus.Employed).click();
    cy.get('input[name="employerName"]').should("be.visible");
    cy.get('input[name="employerName"]')
      .type("Big Corp")
      .should("have.value", "Big Corp");

    cy.get('button[role="combobox"]').first().click();
    cy.get('div[role="option"]').contains(EmploymentStatus.Unemployed).click();
    cy.get('input[name="employerName"]').should("not.exist");
  });

  describe("Form Validation", () => {
    it("should display required field errors on empty submission", () => {
      cy.get('button[type="submit"]').click();
      cy.contains("First name is required.").should("be.visible");
      cy.contains("Last name is required.").should("be.visible");
      cy.contains("Invalid email address.").should("be.visible");
      cy.contains("Invalid phone number.").should("be.visible");
      cy.contains("Please select an employment status.").should("be.visible");
    });

    it("should display error for invalid email format", () => {
      cy.get('input[name="email"]').type("invalid-email");
      cy.get('button[type="submit"]').click();
      cy.contains("Invalid email address.").should("be.visible");
    });

    it("should display error for invalid phone number format", () => {
      cy.get('input[name="phoneNumber"]').type("123");
      cy.get('button[type="submit"]').click();
      cy.contains("Invalid phone number.").should("be.visible");
    });

    it("should require employer name if employment status is 'Employed'", () => {
      cy.get('button[role="combobox"]')
        .contains("Select employment status")
        .click();
      cy.get('div[role="option"]').contains(EmploymentStatus.Employed).click();
      cy.get('button[type="submit"]').click();
      cy.contains("Employer name is required if you are employed.").should(
        "be.visible",
      );

      cy.get('input[name="employerName"]').type("Valid Company");
      cy.get('button[type="submit"]').click();
      cy.contains("Employer name is required if you are employed.").should(
        "not.exist",
      );
    });
  });

  describe("Form Submission", () => {
    it("should submit valid data (mocking API call)", () => {
      cy.intercept("POST", "/api/customer", {
        statusCode: 201,
        body: {
          message: "Customer info saved successfully (mocked)",
          customer: {
            id: 123,
            firstName: "Alice",
            lastName: "Wonderland",
            email: "alice.wonder@example.com",
            phoneNumber: "+15551234567",
            employmentStatus: EmploymentStatus.Employed,
            employerName: "Wonderland Inc.",
          },
        },
      }).as("saveCustomer");

      cy.get('input[name="firstName"]').type("Alice");
      cy.get('input[name="lastName"]').type("Wonderland");
      cy.get('input[name="email"]').type("alice.wonder@example.com");
      cy.get('input[name="phoneNumber"]').type("+15551234567");

      cy.get('button[role="combobox"]')
        .contains("Select employment status")
        .click();
      cy.get('div[role="option"]').contains(EmploymentStatus.Employed).click();
      cy.get('input[name="employerName"]').type("Wonderland Inc.");

      cy.get('button[type="submit"]').click();

      cy.wait("@saveCustomer").then((interception) => {
        expect(interception.response?.statusCode).to.eq(201);
        expect(interception.request.body.firstName).to.eq("Alice");
        expect(interception.request.body.email).to.eq(
          "alice.wonder@example.com",
        );
      });
    });
  });
});
