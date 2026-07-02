import { getWeatherEmoji, getWeatherInfo, getWindDirection } from '../utils/weatherCodes';

const CurrentWeather = ({ current, city }) => {
  if (!current) return null;

  const { temperature_2m, relative_humidity_2m, apparent_temperature, weather_code, wind_speed_10m, wind_direction_10m, wind_gusts_10m } = current;
  const emoji = getWeatherEmoji(weather_code);
  const info = getWeatherInfo(weather_code);

  return (
    <div style={{
      textAlign: 'center',
      color: '#fff',
      padding: '20px 0 40px',
      animation: 'fadeInUp 0.6s ease',
    }}>
      {/* City name */}
      <h2 style={{
        fontSize: 28,
        fontWeight: 600,
        margin: '0 0 8px',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        letterSpacing: '-0.5px',
      }}>
        {city.name}
      </h2>

      {/* Temperature */}
      <div style={{
        fontSize: 96,
        fontWeight: 200,
        lineHeight: 1,
        margin: '10px 0',
        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
        letterSpacing: '-4px',
      }}>
        {Math.round(temperature_2m)}°
      </div>

      {/* Weather emoji + description */}
      <div style={{ fontSize: 48, margin: '0 0 4px' }}>{emoji}</div>
      <div style={{
        fontSize: 18,
        opacity: 0.9,
        fontWeight: 400,
        marginBottom: 24,
      }}>
        {info.label}
      </div>

      {/* Feels like */}
      <div style={{
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 32,
      }}>
        Ощущается как {Math.round(apparent_temperature)}°
      </div>

      {/* Details grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 12,
        maxWidth: 500,
        margin: '0 auto',
      }}>
        <DetailCard icon="💧" label="Влажность" value={`${relative_humidity_2m}%`} />
        <DetailCard icon="💨" label="Ветер" value={`${Math.round(wind_speed_10m)} км/ч`} sub={getWindDirection(wind_direction_10m)} />
        <DetailCard icon="🌊" label="Порывы" value={`${Math.round(wind_gusts_10m)} км/ч`} />
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, sub }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 3, lineHeight: 1.3 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, lineHeight: 1.2 }}>{sub}</div>}
  </div>
);

export default CurrentWeather;