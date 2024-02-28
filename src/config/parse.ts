import { BaseConfig, Colour, HassServiceTarget, MagicHomePartyConfig } from "../types"

export const parseConfig = (input: BaseConfig): MagicHomePartyConfig =>
  withTargets(withSpeed(withColours(input)))

const withColours = <T>(config: T): T & {colours: Colour[]} => ({
  colours: [],
  ...config,
})

const withSpeed = <T>(config: T): T & {speed: number} => ({
  speed: 20,
  ...config,
})

const withTargets = <T>(config: T): T & {targets: HassServiceTarget} => {
  // Has targets already
  if ((config as any).targets !== undefined) {
    return config as T & {entities: [], targets: HassServiceTarget}
  // Migrate entities to targets
  } else if ((config as any).entities !== undefined) {
    return {
      ...config,
      targets: {
        entity_id: (config as any).entities
      }
    }
  // Defaults
  } else {
    return {
      ...config,
      targets: {}
    }
  }
}
