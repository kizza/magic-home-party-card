import { LovelaceCardConfig } from "custom-card-helpers";

export type DoubleClickHandler = (doubleClicked: boolean) => void

export interface MagicHomePartyConfig extends LovelaceCardConfig {
  type: "custom:magic-home-party-card",
  title?: string
  entities: string[]
  colours: Colour[]
  speed: number
}

export type EntityFilter = (entity: {entity_id: string}) => boolean

export type ChipEvent = CustomEvent<{colour: Colour, index: number}>

export type Colour = [number, number, number]
export type Colours = Record<string, Colour>
export type ColourName = keyof Colours;
