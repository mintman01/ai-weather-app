# Weather App

Многофункциональное приложение погоды с AI-ассистентом, анимированным визуальным оформлением и прогнозом на 7 дней.

## Возможности

- **Текущая погода** — температура, ощущается как, влажность, скорость и порывы ветра, описание погодных условий
- **Прогноз на 7 дней** — мин/макс температура, эмодзи-иконки, описание для каждого дня
- **UV-индекс и солнечная активность** — рассвет, закат, максимальный UV-индекс с классификацией
- **Поиск городов** — автодополнение с навигацией клавишами и поиском по названию, стране, региону
- **AI-ассистент** — генерация персонализированных рекомендаций по одежде и активности на основе текущей погоды через NVIDIA LLM API
- **Анимированный фон** — динамические градиенты и частицы: солнце, облака, дождь, снег, гроза, туман — всё адаптируется под текущую погоду и температуру
- **Glassmorphism UI** — современный дизайн с размытием и полупрозрачными карточками

## Стек

- React 19 + Vite 8
- Open-Meteo API (погода + геокодирование)
- NVIDIA AI Foundation Models (LLM)
- Canvas API (анимации)
- Docker + Nginx (продакшн)

## Быстрый старт

```bash
npm install
cp .env.example .env
# отредактируйте .env
npm run dev
```

Откройте http://localhost:5173

## Настройка

Скопируйте `.env.example` в `.env` и заполните переменные:

| Переменная | Описание | По умолчанию |
|---|---|---|
| `VITE_NVIDIA_API_KEY` | API-ключ NVIDIA AI Foundation Models | — (обязательно для AI) |
| `VITE_LLM_ENDPOINT` | URL LLM-эндпоинта | `https://integrate.api.nvidia.com` |
| `VITE_LLM_MODEL` | Модель LLM | `meta/llama-3.1-8b-instruct` |
| `VITE_LLM_PROMPT` | Системный промпт AI-ассистента | `Ты полезный погодный ассистент...` |

> **Примечание:** AI-ассистент работает только при наличии `VITE_NVIDIA_API_KEY`. Без него приложение полностью функционально — показываются данные погоды.

## Сборка и запуск

### Локально

```bash
npm run build
npm run preview
```

### Docker

```bash
docker compose up --build
```

Приложение будет доступно на http://localhost:8080

## Архитектура

```
src/
├── components/
│   ├── AIAssistant.jsx      # AI-советник с эффектом печатания
│   ├── CurrentWeather.jsx   # Текущая погода (температура, влажность, ветер)
│   ├── Forecast.jsx         # Прогноз на 7 дней
│   ├── SearchBar.jsx        # Поиск городов с автодополнением
│   ├── UVIndex.jsx          # UV-индекс, рассвет, закат
│   └── WeatherCanvas.jsx    # Анимированный фон (canvas)
├── services/
│   ├── aiService.js         # Вызов NVIDIA LLM API
│   └── weatherApi.js        # Open-Meteo API + форматирование
└── utils/
    └── weatherCodes.js      # Маппинг кодов WMO → эмодзи/описания
```

## Proxy

Vite проксирует запросы к трём API:

| Путь | Target |
|---|---|
| `/api/weather` | `api.open-meteo.com` |
| `/api/geocoding` | `geocoding-api.open-meteo.com` |
| `/api/nvidia` | `integrate.api.nvidia.com` (с Bearer-токеном) |

## Лицензия

MIT

---

# Weather App

A feature-rich weather application with AI assistant, animated visuals, and 7-day forecast.

## Features

- **Current weather** — temperature, feels-like, humidity, wind speed & gusts, weather description
- **7-day forecast** — min/max temperature, emoji icons, description for each day
- **UV index & solar activity** — sunrise, sunset, max UV index with classification
- **City search** — autocomplete with keyboard navigation, search by name/country/region
- **AI assistant** — personalized clothing and activity recommendations based on current weather via NVIDIA LLM API
- **Animated background** — dynamic gradients and particles: sun, clouds, rain, snow, thunder, fog — all adapt to current weather and temperature
- **Glassmorphism UI** — modern design with blur and translucent cards

## Stack

- React 19 + Vite 8
- Open-Meteo API (weather + geocoding)
- NVIDIA AI Foundation Models (LLM)
- Canvas API (animations)
- Docker + Nginx (production)

## Quick Start

```bash
npm install
cp .env.example .env
# edit .env
npm run dev
```

Open http://localhost:5173

## Setup

Copy `.env.example` to `.env` and fill in the variables:

| Variable | Description | Default |
|---|---|---|
| `VITE_NVIDIA_API_KEY` | NVIDIA AI Foundation Models API key | — (required for AI) |
| `VITE_LLM_ENDPOINT` | LLM endpoint URL | `https://integrate.api.nvidia.com` |
| `VITE_LLM_MODEL` | LLM model | `meta/llama-3.1-8b-instruct` |
| `VITE_LLM_PROMPT` | AI assistant system prompt | `Ты полезный погодный ассистент...` |

> **Note:** The AI assistant requires `VITE_NVIDIA_API_KEY`. Without it, the app still works fully — weather data is displayed normally.

## Build & Run

### Locally

```bash
npm run build
npm run preview
```

### Docker

```bash
docker compose up --build
```

The app will be available at http://localhost:8080

## Architecture

```
src/
├── components/
│   ├── AIAssistant.jsx      # AI advisor with typing effect
│   ├── CurrentWeather.jsx   # Current weather (temp, humidity, wind)
│   ├── Forecast.jsx         # 7-day forecast
│   ├── SearchBar.jsx        # City search with autocomplete
│   ├── UVIndex.jsx          # UV index, sunrise, sunset
│   └── WeatherCanvas.jsx    # Animated background (canvas)
├── services/
│   ├── aiService.js         # NVIDIA LLM API calls
│   └── weatherApi.js        # Open-Meteo API + formatting
└── utils/
    └── weatherCodes.js      # WMO code → emoji/description mapping
```

## Proxy

Vite proxies requests to three APIs:

| Path | Target |
|---|---|
| `/api/weather` | `api.open-meteo.com` |
| `/api/geocoding` | `geocoding-api.open-meteo.com` |
| `/api/nvidia` | `integrate.api.nvidia.com` (with Bearer token) |

## License

MIT