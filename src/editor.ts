import { fireEvent, HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { colours } from './const';
import './elements/chip';
import './elements/targets-picker';
import './elements/palette';
import { BaseConfig, ChipEvent, Colour, MagicHomePartyConfig } from './types';
import { copyToClipboard } from './clipboard';
import { parseConfig } from './config/parse';

const { values } = Object;

@customElement('magic-home-party-card-editor')
export class MagicHomePartyEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: MagicHomePartyConfig;
  @state() private selectedColours: Colour[] = [];
  @state() private speed: number | undefined = undefined;

  public setConfig(config: BaseConfig) {
    this.config = parseConfig(config)
    this.selectedColours = this.config.colours;
    this.speed = this.config.speed;
  }

  public render() {
    if (!this.hass || !this.config) {
      return html`No config`;
    }

    return html`
      Single click to preview a color. Double click to add-or-remove a color.

      <div style="display: flex; align-items: center;">
        <h3>Selected colours</h3>
        <span class="copyButton" @click=${this._copyToClipboard}> Copy to clipboard </span>
      </div>
      <magic-home-party-palette
        id="selected"
        title="Selected"
        .colours="${this.selectedColours}"
        @singleClick="${(e: ChipEvent) => this._setLight(e.detail.colour)}"
        @doubleClick="${(e: ChipEvent) => this._removeChip(e.detail.index)}"
      ></magic-home-party-palette>

      <h3>Palette</h3>
      <magic-home-party-palette
        title="Palette"
        .colours="${values(colours)}"
        @singleClick="${(e: ChipEvent) => this._setLight(e.detail.colour)}"
        @doubleClick="${(e: ChipEvent) => this._addChip(e.detail.colour)}"
      ></magic-home-party-palette>

      <h3>Selected lights</h3>
      <magic-home-party-targets-picker
        .
        .hass=${this.hass}
        .value=${this.config.targets}
        @value-changed=${this._targetsChanged}
      >
      </magic-home-party-targets-picker>

      <h3>Transition speed</h3>
      <ha-selector
        .label="Speed"
        .selector=${{number: {min: 1, max: 100, step: 1, mode: "slider", unit_of_measurement: "%"}}}
        .value=${this.speed}
        @value-changed=${this._speedChanged}
      ></ha-selector>
    `;
  }

  private _copyToClipboard() {
    const colours = this.selectedColours.map(colour => `  - [${colour.join(', ')}]`);
    copyToClipboard(colours.join('\n'))
  }

  private _setLight = (colour: Colour) =>
    this.hass.callService('light', 'turn_on', {
      target: this.config.targets,
      rgb_color: colour,
    });

  private _targetsChanged(event: any) {
    event.stopPropagation();
    this.config.targets = {...event.detail.value};
    this._updateConfig();
  }

  private _addChip = (colour: Colour) => {
    this.selectedColours = [...this.selectedColours, colour];
    this._updateConfig();
  };

  private _removeChip = (index: number) => {
    this.selectedColours = [...this.selectedColours.filter((_, i) => i !== index)];
    this._updateConfig();
  };

  private _speedChanged(event: any) {
    event.stopPropagation();
    this.speed = event.detail.value;
    this._updateConfig();
  }

  private _updateConfig() {
    const newConfig = {
      ...this.config,
      colours: this.selectedColours,
      speed: this.speed,
    };

    this.config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    * + h3 {
      margin-top: 2em;
    }

    .copyButton {
      position: relative;
      top: 1px;
      margin-left: auto;
      color: var(--mdc-theme-primary, #6200ee);
      cursor: pointer;
      -webkit-font-smoothing: antialiased;
      font-family: var(
        --mdc-typography-button-font-family,
        var(--mdc-typography-font-family, Roboto, sans-serif)
      );
      font-size: var(--mdc-typography-button-font-size, 0.875rem);
      font-weight: var(--mdc-typography-button-font-weight, 500);
      letter-spacing: var(--mdc-typography-button-letter-spacing, 0.0892857em);
    }
  `;
}
