import { HomeAssistant } from "custom-card-helpers"

type Area = {
  name: string
}

type Device = {
  name: string;
  name_by_user: string
}

type HomeAssistantWithExtras = HomeAssistant & {
  areas: Record<string, Area>
  devices: Record<string, Device>
}

export const toFriendlyName = (
  identifier: 'area_id' | 'device_id' | 'entity_id',
  _hass: HomeAssistant,
) => (value: string): string => {
  const hass = _hass as HomeAssistantWithExtras
  let name: string | undefined = undefined

  if (identifier == 'area_id') {
    name = hass.areas[value].name
  } else if (identifier == 'device_id') {
    name = hass.devices[value].name_by_user || hass.devices[value].name
  } else if (identifier == 'entity_id') {
    name = toState(hass)(value).attributes.friendly_name
  }

  return name || `Unknown (${value})`
}

export const toState = (hass: HomeAssistant) => (value: string) => hass.states[value]
