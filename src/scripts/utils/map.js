import { MAP_SERVICE_API_KEY } from '../config';
import L, { map, tileLayer, latLng, marker, icon, popup } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default class Map {
  #zoom = 5;
  #map = null;

  static isGeolocationAvailable() {
    return 'geolocation' in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject('Geolocation API unsupported');
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  static async build(selector, options = {}) {
    const defaultCoordinate = [-6.2, 106.816666];

    if ('center' in options && options.center) {
      return new Map(selector, options);
    }

    if ('locate' in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [position.coords.latitude, position.coords.longitude];
        return new Map(selector, { ...options, center: coordinate });
      } catch (err) {
        console.error('Geolocation error:', err);
        return new Map(selector, { ...options, center: defaultCoordinate });
      }
    }

    return new Map(selector, { ...options, center: defaultCoordinate });
  }

  static async getPlaceNameByCoordinate(latitude, longitude) {
    try {
      const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
      url.searchParams.set('key', MAP_SERVICE_API_KEY);
      url.searchParams.set('language', 'id');
      url.searchParams.set('limit', '1');

      const response = await fetch(url);
      const json = await response.json();
      const place = json.features[0].place_name.split(', ');
      return [place.at(-2), place.at(-1)].join(', ');
    } catch {
      return `${latitude}, ${longitude}`;
    }
  }

  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;

    const tileOsm = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [tileOsm],
      ...options,
    });
  }

  changeCamera(coordinate, zoomLevel = null) {
    this.#map.setView(latLng(coordinate), zoomLevel ?? this.#zoom);
  }

  createIcon(options = {}) {
    return icon({
      ...L.Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }
  

  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    const newMarker = marker(coordinates, {
      icon: this.createIcon(),
      ...markerOptions,
    });

    if (popupOptions?.content) {
      const newPopup = popup().setContent(popupOptions.content);
      newMarker.bindPopup(newPopup);
    }

    newMarker.addTo(this.#map);
    return newMarker;
  }
}
