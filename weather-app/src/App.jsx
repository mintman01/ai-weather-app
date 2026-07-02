import { useState, useEffect } from 'react';
import WeatherCanvas from './components/WeatherCanvas';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import UVIndex from './components/UVIndex';
import AIAssistant from './components/AIAssistant';
import './App.css';

function App() {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchWeather = async (cityData) => {
    setLoading(true);
    setError(null);
    try {
      const { getCurrentWeather } = await import('./services/weatherApi');
      const data = await getCurrentWeather(cityData.latitude, cityData.longitude);
      setWeather(data);
      setCity(cityData);
    } catch (err) {
      setError('Не удалось загрузить погоду. Попробуйте ещё раз.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (cityData) => {
    fetchWeather(cityData);
  };

  // Default city
  useEffect(() => {
    if (!city) {
      fetchWeather({
        name: 'Москва',
        country: 'Россия',
        label: 'Москва, Россия',
        latitude: 55.7558,
        longitude: 37.6173,
      });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <AIAssistant weather={weather} city={city} />

      <WeatherCanvas
        weatherCode={weather?.current?.weather_code ?? 0}
        temperature={weather?.current?.temperature_2m ?? 20}
      />

      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        padding: '24px 16px 40px',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
          animation: 'fadeInDown 0.6s ease',
        }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: 0,
          }}>
            <span style={{
              fontSize: 36,
              animation: 'float 3s ease-in-out infinite',
            }}>☁</span>
            Weather
          </h1>
          <SearchBar onCitySelect={handleCitySelect} />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#fff', padding: '60px 20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ fontSize: 16, opacity: 0.7 }}>Загрузка...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#fff', padding: '40px 20px' }}>
            <p style={{ fontSize: 16, marginBottom: 16, opacity: 0.8 }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Повторить</button>
          </div>
        )}

        {weather && city && (
          <div style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>
            <CurrentWeather current={weather.current} city={city} />

            <div className="forecast-section">
              <Forecast daily={weather.daily} />
            </div>

            <UVIndex daily={weather.daily} />
          </div>
        )}

        {!city && !loading && !error && (
          <div style={{ textAlign: 'center', color: '#fff', padding: '80px 20px', fontSize: 20, opacity: 0.6 }}>
            <p>🔍 Найдите город, чтобы увидеть погоду</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;