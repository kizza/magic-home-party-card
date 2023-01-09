import { HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ColourName } from '../types';
import './chip';

@customElement('magic-home-party-palette')
export class Palette extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public colours: ColourName[] = [];

  render = () =>{
    if (this.colours.length === 0) {
      return html`No colours`
    }

    return html`
      <div class="palette">
        ${this.colours.map(
          (colour, index) => html`
            <magic-home-party-chip
              .hass="${this.hass}"
              .colour="${colour}"
              .index="${index}"
            />
          `
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
    }

    .palette {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      max-height: 34vh;
      overflow-y: scroll;
      row-gap: 0.5em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "magic-home-party-palette": Palette
  }
}
