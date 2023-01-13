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

Cypress.Commands.add('addScript', (src: string) =>
  cy.document().then(doc => {
    const script = doc.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', src);
    doc.body.appendChild(script);
    const foo = doc.createElement('div');
    foo.innerHTML = 'HI';
    doc.body.appendChild(foo);
  })
);

Cypress.Commands.add(
  'addEventListener',
  { prevSubject: 'optional' },
  (subject: any, eventName: string, handler: (event: any) => void) =>
    subject.addEventListener(eventName, handler)
  // cy.document().then(doc => doc.addEventListener(eventName, handler))
);

Cypress.Commands.add(
  'setupCustomCard',
  (tagName: string, config: Record<string, unknown>, hass?: any) =>
    cy
      .document()
      .then(doc => {
        const card = doc.createElement(tagName) as any;
        card.hass = hass || {};
        card.setConfig(config);
        doc.body.appendChild(card);
      })
      .get(tagName)
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

Cypress.Commands.addQuery('customCard', options => {
  const getFn = cy.now('get', 'magic-home-party-card', options);
  return subject => {
    const btn = getFn(subject);
    console.log('.get returned this element:', btn);
    return btn;
  };
});

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
