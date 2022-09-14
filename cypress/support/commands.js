// Pulls up Order Detail page of the supplied order number.
Cypress.Commands.add("pullUpItemDetails", ({ searchItem, waitTime, searchItemType = "Orders" }) => {
    cy.wait(waitTime);
    onHomePage.sfPageElements.globalSearchField().click().wait(1000);
    onHomePage.sfPageElements.searchByDropdown().click().type(searchItemType);
    cy.xpath(onHomePage.sfPageElements.searchByDropdownListBaseLocator().replace("%s", searchItemType)).click({
      force: true
    });
    onHomePage.sfPageElements
      .searchTextField()
      .should("be.visible")
      .then(() => {
        onHomePage.sfPageElements.searchTextField().type(searchItem);
        cy.intercept("POST", "**getItems=1**").as("searchItemApi");
        onHomePage.sfPageElements.showMoreResultsText().click();
        search(searchItem, searchItemType);
      });
  });
  // Recursive function that repeatedly attempts to search the given order number every 3 seconds and once found, pulls up it's Order Detail page. Max attempt is 200 times.
  var counter = 0;
  function search(searchItem, searchItemType) {
    if (counter < 200) {
      cy.wait("@searchItemApi").then((response) => {
        const searchResults = response.response.body.actions.filter((d) => d.returnValue?.totalSize > 0);
        cy.log("Number of items found = ", searchResults);
        if (searchResults.length) {
          // item was found
          counter = 0;
          onHomePage.sfPageElements.searchedItem().click({ force: true });
          cy.log("Searched item has been clicked");
        } else {
          // item was not found
          counter++;
          cy.log("Counter = ", counter);
          cy.get(`[aria-label="Search ${searchItemType}: ${searchItem}"]`, { timeout: 10000 }).click();
          cy.wait(1000);
          cy.intercept("POST", "**getItems=1**").as("searchItemApi");
          onHomePage.sfPageElements.showMoreResultsText().click();
          search(searchItem, searchItemType);
        }
      });
    } else {
      cy.log(searchItemType + " : " + searchItem + " number was not found");
      throw new Error(searchItemType + " : " + searchItem + " number was not found");
    }
  }
  
// command to logout of SF
Cypress.Commands.add("logout", () => {
  cy.intercept("POST", "**ui-instrumentation-components-beacon**", {
    statusCode: 200
  });
  cy.intercept("GET", "**secur/logout**", { statusCode: 400 });
  onHomePage.sfPageElements.userProfileIcon().click({ force: true });
  cy.intercept("POST", "**getSessionVars=1**", { statusCode: 200 }).as("logOutToAppear");
  cy.wait("@logOutToAppear", { timeout: 20000 }).then(() => {
    onHomePage.sfPageElements.logOutOption().click();
    cy.url({ timeout: 10000 }).should("include", "/logout.jsp");
  });
});

// command to login to SF as Tax Expert User to land on Lz Tax App
Cypress.Commands.add("loginAsTaxExpert", () => {
    cy.session("todos", () => {
      cy.readFile("cypress/fixtures/salesForce/api-data/requestPayload/soapRequestBodyTaxExpertUser.xml").then(
        (requestBody) => {
          cy.request({
            method: "POST",
            url: Cypress.env("sfLoginSoapUri"),
            headers: {
              SOAPAction: "abc",
              ["Content-Type"]: "text/xml"
            },
            body: requestBody
          }).then((response) => {
            const sessionID = Cypress.$(response.body).find("sessionId").text();
            cy.visit(Cypress.env("sfLandingURL").replace("%s", sessionID));
          });
          onHomePage.selectOneAppLauncherMenu({ menuToSelect: "LZ Tax Portal" });
          onTaxAppHome.waitUntilPageLoads();
        }
      );
    });
    cy.visit(Cypress.env("homepageUrl"));
    onTaxAppHome.elements.homeTab().click();
    onTaxAppHome.waitUntilPageLoads();
  }); 

  // api call to return a fresh access token
function getAccessToken() {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        method: "POST",
        url: Cypress.env("accessTokenUri"),
        headers: { ["Content-Type"]: "application/x-www-form-urlencoded" },
        body: {
          grant_type: "client_credentials",
          username: "lztestautomation@lz.com",
          password: "11111111",
          client_id: "WexAikQ499HeiSKcqWXjj5M4vdybzNsA",
          client_secret: "Wskp7xIUwnlGfrGT"
        }
      }).then(
        (response) => {
          console.log("Access Token = ", response.body.access_token);
          resolve(response.body.access_token);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  // calls carts api and returns a newly created cartId and processingOrderId.
  function createCart(accessToken, packageConfigId, customerID) {
    return new Cypress.Promise((resolve, reject) => {
      cy.request({
        method: "POST",
        url: Cypress.env("createCartUri"),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ["Content-Type"]: "application/json"
        },
        body: {
          processId: 2,
          customerId: `${customerID}`,
          orderSourceId: "legalZoom",
          checkOpenedCart: true,
          stateId: 5,
          defaultPackageConfigurationId: packageConfigId
        }
      }).then((response) => {
        console.log("createCart response : ", response);
        cy.log("1. createCart API done!");
        resolve(response);
      });
    });
  }
  
  



// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })