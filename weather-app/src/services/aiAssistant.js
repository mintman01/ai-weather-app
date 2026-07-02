import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY || '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  dangerouslyAllowBrowser: true,
});

export async function getWeatherAdvice(weather, city) {
  if (!weather?.current) return null;

  const { temperature_2m, relative_humidity_2m, wind_speed_10m, weather_code, apparent_temperature } = weather.current;
  const systemPrompt = import.meta.env.VITE_AI_SYSTEM_PROMPT || '';

  const userMessage = `Погода в городе ${city.name}:
- Температура: ${Math.round(temperature_2m)}°C (ощущается как ${Math.round(apparent_temperature)}°C)
- Влажность: ${relative_humidity_2m}%
- Ветер: ${Math.round(wind_speed_10m)} км/ч
- Погодный код: ${weather_code}

Дай краткий совет на русском языке: какая сейчас погода, как одеться, стоит ли взять зонт/парасол, и что можно сделать сегодня.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('AI assistant error:', err);
    return null;
  }
}