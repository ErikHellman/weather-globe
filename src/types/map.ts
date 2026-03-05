export interface MapClickCoords {
  lng: number;
  lat: number;
}

export interface GlobeMapProps {
  /** Access token override. Defaults to import.meta.env.VITE_MAPBOX_TOKEN */
  accessToken?: string;
}

/** Minimal GeoJSON feature shape used for geocoding search results */
export interface SearchResultFeature {
  geometry: {
    coordinates: number[]; // [lng, lat, ...]
  };
}
