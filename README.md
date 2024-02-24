# 🥳 Magic Home Party (Custom Card)
[![Tests](https://github.com/kizza/magic-home-party-card/actions/workflows/tests.yml/badge.svg)](https://github.com/kizza/magic-home-party-card/actions/workflows/tests.yml)

A [Home Assistant](https://www.home-assistant.io/) custom card for managing the [Magic Home integration](https://www.home-assistant.io/integrations/flux_led/) lighting effects

<img width="1115" alt="Overview – Home Assistant" src="https://user-images.githubusercontent.com/1088717/212461442-e270da3d-b3e8-4b6f-b580-966faccaddb4.png">

## Motivation

I'm loving my [Magic Home integration](https://www.home-assistant.io/integrations/flux_led/) strips, and after a failed attempt and writing my own puthon _gradual transition_ effect I discovered the device can do it for me! Chooinsg (and experimenting) with the best colour combinations was awkward - going from colour wheels to yaml and back - so I made this card to make the expereince more enjoyable.

Single clicking a colour chip will set all the configured lights to this colour - then double clicking any will add it to the sequence.

## Installation

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

Once installed you should find it within your available cards.  Add-and-remove selected colors by double clicking (single click turns lights to that colour to see it).  Once setup, click anywhere on the card to run the [magic light effect](https://www.home-assistant.io/integrations/flux_led/#custom-effects---service-flux_ledset_custom_effect) with your selected colours on your selected lights.
