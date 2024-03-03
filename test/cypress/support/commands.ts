/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add(
  'addEventListener',
  { prevSubject: 'optional' },
  (subject: any, eventName: string, handler: (event: any) => void) =>
    subject.addEventListener(eventName, handler)
  // cy.document().then(doc => doc.addEventListener(eventName, handler))
);

Cypress.Commands.add(
  'bootstrapHomeAssistant',
  { prevSubject: 'optional' },
  (subject: unknown) => {
    cy
      .visit('http://localhost:8123')
      .contains('Create my smart home').click()
      // .get("input[name=username]").type("user")
      // .get("input[name=password]").type("password")
      // .get("mwc-button").click()

    return subject;
  }
);

Cypress.Commands.add(
  'logIntoHomeAssistant',
  { prevSubject: 'optional' },
  (subject: unknown) => {
    cy
      .visit('http://localhost:8123')
      .get("input[name=username]").type("user")
      .get("input[name=password]").type("password")
      .get("mwc-button").click()

    return subject;
  }
);

Cypress.Commands.add(
  'waitForCustomElement',
  { prevSubject: 'optional' },
  (subject: unknown, customElement: string) => {
    const waitForCustomElement = () => {
      cy.wait(100).then(() => {
        cy.window().then(win => {
          if (win.customElements.get('magic-home-party-card')) {
            return subject;
          } else {
            waitForCustomElement();
          }
        });
      });
    };

    return waitForCustomElement();
  }
);

Cypress.Commands.add(
  'waitForText',
  { prevSubject: 'optional' },
  (subject: unknown, text: string) => {
    const waitForText = () => {
      cy.wait(100).then(() => {
        cy.window().then(win => {
          if (win.document.body.innerText.indexOf(text) > -1) {
            return subject;
          } else {
            waitForText();
          }
        });
      });
    };

    return waitForText();
  }
);

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
//
