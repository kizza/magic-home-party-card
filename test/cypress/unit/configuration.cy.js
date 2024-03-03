describe('configuration', () => {
  const red = [255, 0, 0];
  const lime = [0, 255, 0];

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

  describe('parsing/migrating configuration', () => {
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
});
