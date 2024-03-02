import { DOUBLE_CLICK_TIMEOUT } from '../../src/util';

describe('magic home party', () => {
  const red = [255, 0, 0];
  const lime = [0, 255, 0];
  const yellow = [255, 255, 0];

  const hassAreas = () => ({
    areas: {
      kitchen: { name: "Kitchen" },
      bathroom: { name: "Bathroom" },
    }
  })

  const hassDevices = () => ({
    devices: {
      123456: { name: "***", name_by_user: "Dishwasher" },
      ABCDEF: { name: "Fan" },
    }
  })

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
      .addScript('dist/magic-home-party-card.js')
      .waitForCustomElement('magic-home-party-card')
  );

  describe('cofiguration', () => {
    const hass = {
      ...hassAreas(),
      ...hassDevices(),
      ...hassStates(),
    };

    const withConfig = (config) =>
      cy.setupCustomCard('magic-home-party-card', {
        colours: [red, lime],
        ...config,
      }, hass).get('.targets')

    it('resolves legacy entities', () => {
      withConfig({ one: "one", entities: ['foo', 'bar']})
        .should('contain', 'Foo light')
        .and('contain', 'Bar light')
    });

    describe("entity_id targets", () => {
      it('resolves a single entity_id', () => {
        withConfig({ two: "two", targets: {entity_id: 'foo'}})
          .should('contain', 'Foo light')
      });

      it('resolves a multiple entity_ids', () => {
        withConfig({ targets: {entity_id: ['foo', 'bar']}})
          .should('contain', 'Foo light')
          .and('contain', 'Bar light')
      });
    })

    describe("device_id targets", () => {
      it('resolves a single device_id', () => {
        withConfig({ two: "two", targets: {device_id: '123456'}})
          .should('contain', 'Dishwasher')
      });

      it('resolves a multiple device_ids', () => {
        withConfig({ two: "two", targets: {device_id: ['123456', 'ABCDEF']}})
          .should('contain', 'Dishwasher')
          .and('contain', 'Fan')
      });
    })

    describe("area_id targets", () => {
      it('resolves a single area_id', () => {
        withConfig({ two: "two", targets: {area_id: 'kitchen'}})
          .should('contain', 'Kitchen')
      });

      it('resolves a multiple area_id', () => {
        withConfig({ two: "two", targets: {area_id: ['kitchen', 'bathroom']}})
          .should('contain', 'Kitchen')
          .and('contain', 'Bathroom')
      });
    })
  });

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
        ...hassAreas(),
        ...hassStates(),
        callService: cy.stub(),
      };

      const cardConfig = {
        entities: Object.keys(hass.states),
        targets: { area_id: 'kitchen', entity_id: ['foo', 'bar'] },
        colours: [red, lime],
      };

      cy.setupCustomCard('magic-home-party-card', cardConfig, hass)
        .get('ha-card')
        .click()
        .then(() => {
          expect(hass.callService).to.be.calledWith('flux_led', 'set_custom_effect', {
            ...cardConfig.targets,
            colors: cardConfig.colours,
            speed_pct: 20,
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
                expect(hass.callService).to.be.calledWith('light', 'turn_on', {
                  target: {entity_id: cardConfig.entities},
                  rgb_color: yellow,
                });
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
