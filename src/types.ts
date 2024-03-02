import { LovelaceCardConfig } from "custom-card-helpers";

export type NonUndefined<T> = T extends undefined ? never : T;

export type DoubleClickHandler = (doubleClicked: boolean) => void

export type BaseConfig = LovelaceCardConfig & {
  type: "custom:magic-home-party-card",
}

export interface MagicHomePartyConfig extends BaseConfig {
  targets: HassServiceTarget
  colours: Colour[]
  speed?: number
}

export type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
};

export type EntityFilter = (entity: {entity_id: string}) => boolean

export type ChipEvent = CustomEvent<{colour: Colour, index: number}>

export type Colour = [number, number, number]
export type Colours = Record<string, Colour>
export type ColourName = keyof Colours;
