import type { FogSpecification } from 'mapbox-gl';

export const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

export const INITIAL_CENTER: [number, number] = [0, 20];
export const INITIAL_ZOOM = 1.5;
export const CLICK_ZOOM_LEVEL = 12;
export const SEARCH_ZOOM_LEVEL = 12;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 20;

export const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const FOG_CONFIG: FogSpecification = {
  color: 'rgb(186, 210, 235)',
  'high-color': 'rgb(36, 92, 223)',
  'horizon-blend': 0.02,
  'space-color': 'rgb(11, 11, 25)',
  'star-intensity': 0.6,
};
