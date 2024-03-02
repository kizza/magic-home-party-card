import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CARD_VERSION, RADIUS } from './const';
import './elements/palette';
import { BaseConfig, MagicHomePartyConfig } from './types';
import { toFriendlyName, toState } from './config/lookup';
import { ensureArray, labelColour, linearGradient } from './util';
import { parseConfig } from './config/parse';
import { mdiDevices, mdiLightbulb, mdiSofa } from '@mdi/js'

console.info(
  `%c Magic %c Home %c Party %c Card %c ${CARD_VERSION} `,
  'color: #222; font-weight: bold; background: #90f1ef',
  'color: #222; font-weight: bold; background: #ffd6e0',
  'color: #222; font-weight: bold; background: #ffef9f',
  'color: #222; font-weight: bold; background: #c1fba4',
  'color: #ff70a6; font-weight: bold;',
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

  setConfig(config: BaseConfig) {
    this.config = parseConfig(config)
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    if (this.config.colours.length === 0) {
      return html`No colours selected`;
    }

    const foreground = labelColour(this.config.colours[0]);
    return html`
      <ha-card @click=${this.playEffect}>
        <div
          class="gradient"
          style="color: ${foreground}; background: ${linearGradient(this.config.colours)}"
        >
          <div class="targets">
            ${this._friendlyAreaNames()}
            ${this._friendlyDeviceNames()}
            ${this._friendlyEntityNames()}
          </div>
        </div>
      </ha-card>
    `;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('magic-home-party-card-editor') as LovelaceCardEditor;
  }

  private _friendlyAreaNames = () =>
    ensureArray(this.config.targets.area_id)
      .map(toFriendlyName('area_id', this.hass))
      .map(name => html`<div class="target">
        ${this._icon(mdiSofa)} ${name}
      </div>`)

  private _friendlyDeviceNames = () =>
    ensureArray(this.config.targets.device_id)
      .map(toFriendlyName('device_id', this.hass))
      .map(name => html`<div class="target">
        ${this._icon(mdiDevices)} ${name}
      </div>`)

  private _friendlyEntityNames = () =>
    ensureArray(this.config.targets.entity_id)
      .map(toState(this.hass))
      .map(state => html`<div class="target">
        ${this._icon(mdiLightbulb)} ${state.attributes.friendly_name || state.entity_id}
      </div>`)

  private _icon(path: string) {
    return html`<div class="icon">
      <svg viewBox="0 0 24 24" width="100%" height="100%" role="presentation">
        <path d=${path} style="fill: currentcolor;"></path>
      </svg>
    </div>`
  }

  private playEffect = () =>
    this.hass.callService('flux_led', 'set_custom_effect', {
      ...this.config.targets,
      colors: this.config.colours,
      speed_pct: this.config.speed,
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

    .targets {
      padding: 1em 1em;
      display: flex;
      flex-wrap: wrap;
    }

    .target {
      display: flex;
      align-items: center;
      border-radius: ${RADIUS};
      max-height: 1.6em;
      margin-right: 6px;
    }

    .icon {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
  `;
}
