describe('magic home party', () => {
  beforeEach(() =>
    cy.logIntoHomeAssistant()


      // .get("ha-auth-flow form").submit()

//     cy.get("#user_password").type("somepassword")
      // .addScript('dist/magic-home-party-card.js')
      // .waitForCustomElement('magic-home-party-card')
  );

  describe('card', () => {
    it('renders a gradient', () => {
      cy.get("mwc-icon-button[title='Edit Dashboard']").click()
      cy.get("ha-card mwc-button").click()
      cy.contains("Choose entity").click()
      cy.contains("First magic light").click()

      cy.contains("Choose device").click()
      // cy.waitForText('Home Assistant has started')
      cy.contains("Second magic light").click()
      // cy.setupCustomCard('magic-home-party-card', { colours: colours })
      //   .get('.gradient')
      //   .should(
      //     'have.css',
      //     'background-image',
      //     `linear-gradient(to right, rgb(${colours[0].join(', ')}), rgb(${colours[1].join(', ')}))`
      //   );
    });
  })
})
