import { fireEvent, HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { colours } from './const';
import './elements/chip';
import './elements/entities-picker';
import './elements/palette';
import { ChipEvent, Colour, MagicHomePartyConfig } from './types';

const { values } = Object;

@customElement('magic-home-party-card-editor')
export class MagicHomePartyEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: MagicHomePartyConfig;
  @state() private selectedColours: Colour[] = [];
  @state() private selectedEntities: string[] = [];

  public setConfig(config: MagicHomePartyConfig) {
    this.config = {
      ...config,
      colours: config.colours || [],
      entities: config.entities || [],
    };

    this.selectedColours = this.config.colours;
    this.selectedEntities = this.config.entities;
  }

  public render() {
    if (!this.hass || !this.config) {
      return html`No config`;
    }

    return html`
      Single click to preview a color. Double click to add-or-remove a color.

      <div style="display: flex; align-items: center;">
        <h3>Selected Colours</h3>
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

      <h3>Selected Lights</h3>
      <magic-home-party-entities-picker
        .
        .hass=${this.hass}
        .value=${this.config.entities}
        @value-changed=${this._entitiesChanged}
      >
      </magic-home-party-entities-picker>
    `;
  }

  private _copyToClipboard() {
    const colours = this.selectedColours.map(colour => `  - [${colour.join(', ')}]`);

    try {
      navigator.clipboard.writeText(colours.join('\n'));
    } catch(err) {
      console.info('Failed to copy: ', err);
      this._copyToClipboardAlt()
    }
  }

  private _copyToClipboardAlt() {
    const colours = this.selectedColours.map(colour => `  - [${colour.join(', ')}]`);
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = colours.join('\n');
    input.focus();
    input.select();

    const isSuccessful = document.execCommand('copy');
    if (!isSuccessful) {
      console.error('Failed to copy text again');
    }
  }

  private _setLight = (colour: Colour) =>
    this.hass.callService('light', 'turn_on', {
      entity_id: this.selectedEntities,
      rgb_color: colour,
    });

  private _entitiesChanged(event: any) {
    event.stopPropagation();
    this.selectedEntities = [...event.detail.value];
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

  private _updateConfig() {
    const newConfig = {
      ...this.config,
      colours: this.selectedColours,
      entities: this.selectedEntities,
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
      cursor: default;
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
