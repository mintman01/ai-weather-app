export const weatherInfo = {
  0: { label: 'Ясно', icon: 'sun', gradient: ['#4facfe', '#00f2fe'] },
  1: { label: 'Преимущественно ясно', icon: 'sun', gradient: ['#4facfe', '#00f2fe'] },
  2: { label: 'Переменная облачность', icon: 'cloud', gradient: ['#a1c4fd', '#c2e9fb'] },
  3: { label: 'Пасмурно', icon: 'cloud', gradient: ['#89b4d8', '#b8d0e8'] },
  45: { label: 'Туман', icon: 'fog', gradient: ['#9e9e9e', '#c5c5c5'] },
  48: { label: 'Изморозь', icon: 'fog', gradient: ['#9e9e9e', '#c5c5c5'] },
  51: { label: 'Лёгкая морось', icon: 'drizzle', gradient: ['#667db6', '#0052d4'] },
  53: { label: 'Умеренная морось', icon: 'drizzle', gradient: ['#4a6fa5', '#3a5a8a'] },
  55: { label: 'Сильная морось', icon: 'drizzle', gradient: ['#3a5a8a', '#2c4a6e'] },
  61: { label: 'Небольшой дождь', icon: 'rain', gradient: ['#537773', '#537773'] },
  63: { label: 'Дождь', icon: 'rain', gradient: ['#4a6fa5', '#3a5a8a'] },
  65: { label: 'Сильный дождь', icon: 'rain', gradient: ['#2c4a6e', '#1a3a5a'] },
  66: { label: 'Ледяной дождь', icon: 'rain', gradient: ['#5a7a9a', '#3a5a7a'] },
  67: { label: 'Сильный ледяной дождь', icon: 'rain', gradient: ['#4a6a8a', '#2a4a6a'] },
  71: { label: 'Небольшой снег', icon: 'snow', gradient: ['#8e9eab', '#c4d4e0'] },
  73: { label: 'Снег', icon: 'snow', gradient: ['#a0b0c0', '#c8d8e8'] },
  75: { label: 'Сильный снег', icon: 'snow', gradient: ['#b0c0d0', '#d0e0f0'] },
  77: { label: 'Снежная крупа', icon: 'snow', gradient: ['#a0b0c0', '#c0d0e0'] },
  80: { label: 'Небольшой ливень', icon: 'rain', gradient: ['#537773', '#4a6fa5'] },
  81: { label: 'Ливень', icon: 'rain', gradient: ['#4a6fa5', '#3a5a8a'] },
  82: { label: 'Сильный ливень', icon: 'rain', gradient: ['#2c4a6e', '#1a3a5a'] },
  85: { label: 'Снегопад', icon: 'snow', gradient: ['#8e9eab', '#a0b0c0'] },
  86: { label: 'Сильный снегопад', icon: 'snow', gradient: ['#9aaabc', '#b0c0d0'] },
  95: { label: 'Гроза', icon: 'thunder', gradient: ['#232526', '#414345'] },
  96: { label: 'Гроза с градом', icon: 'thunder', gradient: ['#232526', '#414345'] },
  99: { label: 'Сильная гроза с градом', icon: 'thunder', gradient: ['#1a1a2e', '#2d2d44'] },
};

export function getWeatherInfo(code) {
  return weatherInfo[code] || weatherInfo[0];
}

export function getWeatherEmoji(code) {
  const emojis = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌦️', 63: '🌧️', 65: '🌧️', 66: '🌨️', 67: '🌨️',
    71: '🌨️', 73: '❄️', 75: '❄️', 77: '🌨️',
    80: '🌦️', 81: '🌧️', 82: '🌧️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
  };
  return emojis[code] || '🌡️';
}

export function getWindDirection(deg) {
  const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  return dirs[Math.round(deg / 45) % 8];
}