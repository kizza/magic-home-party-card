# 🥳 Magic Home Party (Custom Card)
[<img height="24" alt="HACS badge" src="https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge">](https://github.com/hacs/frontend)
[<img height="24" alt="Downloads badge" src="https://img.shields.io/github/downloads/kizza/magic-home-party-card/total?style=for-the-badge">](https://api.github.com/repos/kizza/magic-home-party-card/releases)
[<img height="24" alt="Version badge" src="https://img.shields.io/github/v/release/kizza/magic-home-party-card?style=for-the-badge">](https://github.com/kizza/magic-home-party-card/releases)
[<img height="24" alt="Tests badge" src="https://github.com/kizza/magic-home-party-card/actions/workflows/tests.yml/badge.svg">](https://github.com/kizza/magic-home-party-card/actions/workflows/tests.yml)

A [Home Assistant](https://www.home-assistant.io/) custom card providing a palette for your [Magic Home integration](https://www.home-assistant.io/integrations/flux_led/) lighting effects.

<img width="1115" alt="Overview – Home Assistant" src="https://github.com/kizza/magic-home-party-card/assets/1088717/30ff4b45-4413-40fc-935a-5d9bc7b7b6a4">

## Motivation

I love my [Magic Home integration](https://www.home-assistant.io/integrations/flux_led/) strips, they're inexpensive and effective.  After a failed attempt and writing my own python _gradual transition_ effect I discovered the device could do it for me [with a custom effect](https://www.home-assistant.io/integrations/flux_led/#custom-effects---service-flux_ledset_custom_effect)! Choosing and experimenting with the colours was awkward though - going from colour wheels to yaml and back - so I made this card to make the experience more enjoyable.

Single-clicking a colour chip from the palette will set all your configured lights to this colour - double-clicking any will add it to the sequence.

## Installation

<img align="left" src="https://github.com/kizza/magic-home-party-card/assets/1088717/134d836a-a2d5-4761-adcf-ea7d8feb1dc3" width="50" alt="Magic Home Logo" />
Configure your Magic Home lights as per normal in homeassistant.  If you don't recognise this logo, this integration may not target your lights.

### HACS
Magic Home Party Card is available in [HACS][hacs] (Home Assistant Community Store).

1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Go to "Frontend" section
4. Click button with "+" icon
5. Search for "Magic Home Party Card"

### Manual
1. Download `magic-home-party-card.js` file from the [latest-release](https://github.com/kizza/magic-home-party-card/releases/latest).
2. Put magic-home-party.js file into your `config/www` folder.
3. Add a reference to this in your resources:
 - Add `/local/magic-home-party-card.js` via the "manage resources" dashboard UI (as a javascript "module")
 - Or add the following to your yaml...
  ```
  resources:
    - url: /local/magic-home-party-card.js
      type: module
  ```

## Usage

Once installed you should find it within your available dashboard cards.  Add-and-remove selected colors by double clicking (single click previews that colour with your lights).  Once setup, click anywhere on the card to run the [magic light effect](https://www.home-assistant.io/integrations/flux_led/#custom-effects---service-flux_ledset_custom_effect) with your configuration.
