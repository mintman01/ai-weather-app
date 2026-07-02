import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  dangerouslyAllowBrowser: true,
});

export async function getWeatherAdvice(weather, city) {
  const model = import.meta.env.VITE_NVIDIA_MODEL || 'deepseek-ai/deepseek-v4-pro';

  const current = weather?.current;
  if (!current) return null;

  const prompt = `Ты — помощник погодного приложения. На основе текущей погоды дай краткий, полезный совет на русском языке.

Город: ${city?.name}
Температура: ${Math.round(current.temperature_2m)}°C, ощущается как ${Math.round(current.apparent_temperature)}°C
Погода: ${getWeatherLabel(current.weather_code)}
Ветер: ${Math.round(current.wind_speed_10m)} км/ч, порывы до ${Math.round(current.wind_gusts_10m)} км/ч
Влажность: ${current.relative_humidity_2m}%

Ответь коротко (3-4 предложения):
1. Какая сейчас погода простыми словами
2. Как одеваться / что взять
3. Есть ли рекомендации по активности

Будь дружелюбным и полезным.`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: import.meta.env.VITE_NVIDIA_SYSTEM_PROMPT || 'Ты полезный погодный ассистент. Отвечай кратко и по делу на русском языке.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 16384,
      chat_template_kwargs: { thinking: false },
      stream: false,
    });

    return completion.choices[0]?.message?.content?.trim();
  } catch (err) {
    console.warn('NVIDIA AI error:', err.message);
    return null;
  }
}

function getWeatherLabel(code) {
  const labels = {
    0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность', 3: 'Пасмурно',
    45: 'Туман', 48: 'Изморозь',
    51: 'Лёгкая морось', 53: 'Умеренная морось', 55: 'Сильная морось',
    61: 'Небольшой дождь', 63: 'Дождь', 65: 'Сильный дождь',
    71: 'Небольшой снег', 73: 'Снег', 75: 'Сильный снег',
    80: 'Небольшой ливень', 81: 'Ливень', 82: 'Сильный ливень',
    95: 'Гроза', 96: 'Гроза с градом', 99: 'Сильная гроза',
  };
  return labels[code] || 'Неизвестно';
}