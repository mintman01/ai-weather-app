import { useState, useEffect, useRef } from 'react';
import { getWeatherAdvice } from '../services/aiService';

function usePrevious(value, initial) {
  const ref = useRef(initial);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

const TypingText = ({ text, speed = 25 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    if (!text) {
      setDone(true);
      return;
    }

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}{!done && <span className="typing-cursor" />}</span>;
};

const AIAssistant = ({ weather, city }) => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevWeatherKey = usePrevious(weather, null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!weather?.current) return;

    // Only fetch once per weather data
    const weatherKey = `${weather.current.temperature_2m}-${weather.current.weather_code}`;
    if (hasFetched.current && prevWeatherKey === weatherKey) return;
    hasFetched.current = true;

    // Fetch advice after delay
    const fetchTimer = setTimeout(async () => {
      setLoading(true);
      const result = await getWeatherAdvice(weather, city);
      setAdvice(result);
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(fetchTimer);
    };
  }, [weather, city, prevWeatherKey]);

  if (!weather?.current && !loading) return null;

  return (
    <div className="ai-assistant">
      <div className="ai-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="ai-content">
        {loading ? (
          <div className="ai-loading">
            <div className="ai-loading-dots">
              <span></span><span></span><span></span>
            </div>
            <span>Анализирую погоду...</span>
          </div>
        ) : advice ? (
          <TypingText text={advice} speed={20} />
        ) : (
          <span style={{ opacity: 0.5, fontSize: 13 }}>
            AI-ассистент настроен, но не указан API-ключ в .env
          </span>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;