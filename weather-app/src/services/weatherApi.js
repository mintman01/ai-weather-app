const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query) {
  const params = new URLSearchParams({
    name: query,
    count: 5,
    language: 'ru',
    format: 'json',
  });

  const res = await fetch(`${GEOCODING_URL}?${params}`);
  const data = await res.json();

  if (!data.results) return [];

  return data.results.map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country || '',
    admin1: city.admin1 || '',
    latitude: city.latitude,
    longitude: city.longitude,
    label: [city.name, city.admin1, city.country].filter(Boolean).join(', '),
  }));
}

export async function getCurrentWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset',
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index',
    timezone: 'auto',
    forecast_days: 7,
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);
  const data = await res.json();
  return data;
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function getDayName(isoString, short = false) {
  const date = new Date(isoString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((date - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Завтра';

  return date.toLocaleDateString('ru-RU', { weekday: short ? 'short' : 'long' });
}