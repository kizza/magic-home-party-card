import { fireEvent, HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EntityFilter, HassServiceTarget } from '../types';
import { loadHomeAsssistantComponents } from '../util';

interface TargetSelector {
  target: {
    entity?: EntitySelectorFilter | readonly EntitySelectorFilter[];
    // device?: DeviceSelectorFilter | readonly DeviceSelectorFilter[];
  } | null;
}

interface EntitySelectorFilter {
  integration?: string;
  domain?: string | readonly string[];
  device_class?: string | readonly string[];
  supported_features?: number | [number];
}

@customElement('magic-home-party-targets-picker')
export class TargetsPicker extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) value?: HassServiceTarget;

  _targetSelector: TargetSelector = {
    target: {
      entity: {
        domain: "light",
        integration: "flux_led",
      },
    },
  };

  public render = () => html`
    <ha-selector
      .hass=${this.hass}
      .label="Lights"
      .selector=${this._targetSelector}
      .value=${this.value}
      @value-changed=${this._targetsChanged}
    ></ha-selector>`

  private _targetsChanged(event: Event & {detail: { value: HassServiceTarget }}) {
    event.stopPropagation();
    fireEvent(this, 'value-changed', { value: event.detail.value });
  }

  static styles = css`
    :host {
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'magic-home-party-targets-picker': TargetsPicker;
  }
}

