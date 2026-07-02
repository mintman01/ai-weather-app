import { useState, useEffect, useRef } from 'react';
import { getWeatherAdvice } from '../services/aiService';

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
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!weather?.current) return;

    // Delay initial appearance
    const timer = setTimeout(() => setVisible(true), 1500);

    if (hasShown) return;
    setHasShown(true);

    // Fetch advice after delay
    const fetchTimer = setTimeout(async () => {
      setLoading(true);
      const result = await getWeatherAdvice(weather, city);
      setAdvice(result);
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fetchTimer);
    };
  }, [weather, city, hasShown]);

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible && !loading) return null;

  return (
    <div className={`ai-assistant ${visible ? 'ai-assistant-visible' : ''}`}>
      <button className="ai-dismiss" onClick={handleDismiss} title="Закрыть">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

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