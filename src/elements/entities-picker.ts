import { fireEvent, HomeAssistant } from 'custom-card-helpers';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EntityFilter } from '../types';
import { loadHomeAsssistantComponents } from '../util';

@customElement('magic-home-party-entities-picker')
export class EntitiesPicker extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Array }) value?: string[];
  @property() domains: string[] = ['light'];

  private get currentEntities() {
    return this.value || [];
  }

  connectedCallback() {
    super.connectedCallback();
    void loadHomeAsssistantComponents();
  }

  // The entity-picker states dropdown is cached
  // (breaking this with a different entity filter each tile
  _buildEntityFilter: () => EntityFilter = () => (e: { entity_id: string }) =>
    !this.value || !this.value.includes(e.entity_id);

  @state() private entityFilter: EntityFilter = this._buildEntityFilter();

  public render = () => html` ${this.currentEntities.map(
      entityId =>
        html`<ha-entity-picker
          allow-custom-entity
          .curValue=${entityId}
          .hass=${this.hass}
          .entityFilter=${this.entityFilter}
          .includeDomains=${this.domains}
          .value=${entityId}
          @value-changed=${this._entityChanged}
        ></ha-entity-picker>`
    )}
    <ha-entity-picker
      allow-custom-entity
      .hass=${this.hass}
      .entityFilter=${this.entityFilter}
      .includeDomains=${this.domains}
      .required=${!this.currentEntities.length}
      @value-changed=${this._addEntity}
    ></ha-entity-picker>`;

  private _entityChanged(event: any) {
    event.stopPropagation();

    const currentValue = (event.currentTarget as any).curValue;
    const newValue = event.detail.value;

    if (!newValue || this.currentEntities.includes(newValue)) {
      this._updateEntities(this.currentEntities.filter(entity => entity !== currentValue));
    } else {
      this._updateEntities(
        this.currentEntities.map(entity => (entity === currentValue ? newValue : entity))
      );
    }
  }

  private _updateEntities(entities: string[]) {
    this.value = entities.filter(Boolean);
    fireEvent(this, 'value-changed', { value: this.value });
    this.entityFilter = this._buildEntityFilter();
  }

  private _addEntity(event: any) {
    event.stopPropagation();
    (event.currentTarget as any).value = ''; // Reset value of adding element
    this._updateEntities([...this.currentEntities, event.detail.value]);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'magic-home-party-entities-picker': EntitiesPicker;
  }
}
