import { DOUBLE_CLICK_TIMEOUT } from '../../src/util';

describe('magic home party', () => {
  const red = [255, 0, 0];
  const lime = [0, 255, 0];
  const yellow = [255, 255, 0];

  const hassStates = () => ({
    states: {
      foo: {
        entity_id: 'foo',
        attributes: {
          friendly_name: 'Foo light',
        },
      },
      bar: {
        entity_id: 'bar',
        attributes: {
          friendly_name: 'Bar light',
        },
      },
    },
  });

  beforeEach(() =>
    cy
      .visit('index.html')
      .addScript('dist/magic-home-party.js')
      .waitForCustomElement('magic-home-party-card')
  );

  describe('card', () => {
    it('renders a gradient', () => {
      const colours = [red, lime];
      cy.setupCustomCard('magic-home-party-card', { colours: colours })
        .get('.gradient')
        .should(
          'have.css',
          'background-image',
          `linear-gradient(to right, rgb(${colours[0].join(', ')}), rgb(${colours[1].join(', ')}))`
        );
    });

    it('plays the effect on click', () => {
      const hass = {
        ...hassStates(),
        callService: cy.stub(),
      };

      const cardConfig = {
        entities: Object.keys(hass.states),
        colours: [red, lime],
      };

      cy.setupCustomCard('magic-home-party-card', cardConfig, hass)
        .get('ha-card')
        .click()
        .then(() => {
          expect(hass.callService).to.be.calledWith('magic_home', 'set_custom_effect', {
            entity_id: cardConfig.entities,
            colours: cardConfig.colours,
            transition: 'gradual',
          });
        });
    });
  });

  describe('editor', () => {
    const getSelectedColours = () =>
      cy.get('magic-home-party-palette').first().as('selectedColours');

    const getColourPalette = () => cy.get('magic-home-party-palette').last().as('colourPalette');

    describe('sampling colours from palettes', () => {
      Object.entries({
        '@selectedColours': getSelectedColours,
        '@colourPalette': getColourPalette,
      }).forEach(([scopeName, scopeSelector]) => {
        it(`sets colour from ${scopeName} colours on click`, () => {
          const hass = {
            ...hassStates(),
            callService: cy.stub(),
          };

          const cardConfig = {
            entities: Object.keys(hass.states),
            colours: [red, yellow],
          };

          cy.setupCustomCard('magic-home-party-card-editor', cardConfig, hass)
            .then(scopeSelector)
            .then(() => {
              cy.get(scopeName).find('magic-home-party-chip').contains('yellow').click();
            })
            .should(
              () => {
                expect(hass.callService).to.be.called;
              },
              { timeout: DOUBLE_CLICK_TIMEOUT }
            );
        });
      });
    });

    describe('adding and removing colours', () => {
      it('allows adding colours from palette', done => {
        cy.document()
          .addEventListener('config-changed', event => {
            expect(event.detail.config.colours).to.deep.eq([yellow]);
            done();
          })
          .setupCustomCard('magic-home-party-card-editor', {})
          .then(getSelectedColours)
          .then(getColourPalette)
          .then(() => {
            cy.get('@selectedColours').find('magic-home-party-chip').should('not.exist');
          })
          .then(() => {
            cy.get('@colourPalette').find('magic-home-party-chip').contains('yellow').dblclick();
          })
          .then(() => {
            cy.get('@selectedColours')
              .find('magic-home-party-chip')
              .contains('yellow')
              .should('exist');
          });
      });

      it('allows removing colours', done => {
        cy.document()
          .addEventListener('config-changed', event => {
            expect(event.detail.config.colours).to.deep.eq([]);
            done();
          })
          .setupCustomCard('magic-home-party-card-editor', { colours: [yellow] })
          .then(getSelectedColours)
          .then(() => {
            cy.get('@selectedColours').find('magic-home-party-chip').contains('yellow').dblclick();
          })
          .then(() => {
            cy.get('@selectedColours').find('magic-home-party-chip').should('not.exist');
          });
      });
    });
  });
});
