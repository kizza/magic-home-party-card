import { HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RADIUS } from '../const';
import { Colour } from '../types';
import { colourName, labelColour, withDoubleClick } from '../util';

@customElement('magic-home-party-chip')
export class Chip extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public colour: Colour = [255, 0, 0];
  @property({ attribute: false }) public index: number = -1;

  constructor() {
    super();
    this.addEventListener('click', this.clickHandler);
  }

  render = () => html`<span style="color: ${labelColour(this.colour)}"> ${colourName(this.colour)} </span>`;

  shouldUpdate(changedProperties: Map<string, unknown>) {
    return changedProperties.has('colour');
  }

  updated() {
    this.style.background = `rgb(${this.colour})`;
  }

  private clickHandler = withDoubleClick((doubleClicked) =>
    this.dispatchEvent(
      new CustomEvent(doubleClicked ? 'doubleClick' : 'singleClick', {
        detail: {
          colour: this.colour,
          index: this.index,
        },
        bubbles: true,
        composed: true,
      })
    ));

  static styles = css`
    :host {
      border-radius: ${RADIUS};
      cursor: pointer;
      display: inline-block;
      padding: 0.5em 1em;
      white-space: nowrap;
    }
    :host(:active) {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "magic-home-party-chip": Chip
  }
}
