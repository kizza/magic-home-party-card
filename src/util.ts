import { css } from 'lit';
import { colours } from './const';
import { Colour, DoubleClickHandler } from './types';

export const loadHomeAsssistantComponents = () => {
  if (!customElements.get('ha-entity-picker')) {
    (customElements.get('hui-entities-card') as any)?.getConfigElement();
  }
};

export const colourName = (colour: Colour) =>
  Object.keys(colours).find(
    colourName => JSON.stringify(colours[colourName]) === JSON.stringify(colour)
  ) || colour.join('');

export const linearGradient = (colours: Colour[]) =>
  colours.length === 1
    ? `rgb(${colours[0].join(', ')})`
    : `linear-gradient(to right, ${colours.map(rgb => `rgb(${rgb.join(', ')})`).join(', ')})`;

export const labelColour = (background: Colour) => {
  const [red, green, blue] = background;
  const yiq = (red * 299 + green * 587 + blue * 114) / 1000;
  if (yiq < 128) {
    return css`rgba(255, 255, 255, 0.8)`;
  } else {
    return css`rgba(10, 10, 10, 0.6)`;
  }
};

export const DOUBLE_CLICK_TIMEOUT = 250;

export const withDoubleClick = (handler: DoubleClickHandler) => (e: any) => {
  const interval = DOUBLE_CLICK_TIMEOUT;
  const state = document as any;
  clearTimeout(state.clickedTimer);

  // Check if it's a double click
  if (state.clicked && state.clicked.key == e.target) {
    const delta = Date.now() - state.clicked.timestamp;
    if (delta < interval) {
      return handler(true);
    }
  }

  // Store for double click
  state.clicked = { key: e.target, timestamp: Date.now() };
  state.clickedTimer = setTimeout(() => {
    state.clicked = undefined;
    handler(false);
  }, interval);
};
