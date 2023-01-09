import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CARD_VERSION, RADIUS } from './const';
import './elements/palette';
import { MagicHomePartyConfig } from './types';
import { labelColour, linearGradient } from './util';

console.info(
  `%c  MAGIC-HOME-PARTY-CARD \n%c  Version ${CARD_VERSION}    `,
  'color: white; font-weight: bold; background: purple',
  'color: white; font-weight: bold; background: dimgray'
);

// Register to UI picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'magic-home-party-card',
  name: 'Magic Home Party Card',
  description: 'Have a party with your magic home lights',
});

@customElement('magic-home-party-card')
export class MagicHomeParty extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: MagicHomePartyConfig;

  setConfig(config: MagicHomePartyConfig) {
    this.config = {
      ...config,
      title: '',
      entities: config.entities || [],
    };
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    if (this.config.colours.length === 0) {
      return html`No colours selected`;
    }

    const foreground = labelColour(this.config.colours[0]);

    const entitiesHtml = this.stateEntities.map(
      stateEntity =>
        html`<div class="entity">
          <state-badge .stateObj=${stateEntity} style="color: ${foreground};"></state-badge>
          ${stateEntity.attributes.friendly_name || stateEntity.entity_id}
        </div>`
    );

    return html`
      <ha-card @click=${this.playEffect}>
        <div
          class="gradient"
          style="color: ${foreground}; background: ${linearGradient(this.config.colours)}"
        >
          <div class="entities">${entitiesHtml}</div>
        </div>
      </ha-card>
    `;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('magic-home-party-card-editor') as LovelaceCardEditor;
  }

  static getStubConfig() {
    return { entities: [] };
  }

  private get stateEntities() {
    return this.config.entities.map(entity => this.hass.states[entity]);
  }

  private playEffect = () =>
    this.hass.callService('flux_led', 'set_custom_effect', {
      entity_id: this.config.entities,
      colors: this.config.colours,
      transition: 'gradual',
    });

  static styles = css`
    .gradient {
      padding-top: 3em;
      border-radius: var(--ha-card-border-radius, 12px);
      display: flex;
      align-items: end;
      color: #fff;
    }

    .entities {
      padding: 1em 0.5em;
      display: flex;
      flex-wrap: wrap;
    }

    .entity {
      display: flex;
      align-items: center;
      border-radius: ${RADIUS};
      max-height: 1.6em;
    }
  `;
}
