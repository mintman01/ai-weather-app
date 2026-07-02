import { getWeatherEmoji, getWeatherInfo } from '../utils/weatherCodes';
import { getDayName } from '../services/weatherApi';

const Forecast = ({ daily }) => {
  if (!daily) return null;

  return (
    <div style={{
      color: '#fff',
      animation: 'fadeInUp 0.6s ease 0.2s both',
    }}>
      <h3 style={{
        fontSize: 18,
        fontWeight: 500,
        marginBottom: 16,
        textShadow: '0 1px 5px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        Прогноз на 7 дней
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        maxWidth: 700,
        margin: '0 auto',
      }}>
        {daily.time.map((day, i) => {
          const code = daily.weather_code[i] ?? daily.weather_code[0];
          const emoji = getWeatherEmoji(code);
          const maxTemp = Math.round(daily.temperature_2m_max[i] ?? daily.temperature_2m_max[0]);
          const minTemp = Math.round(daily.temperature_2m_min[i] ?? daily.temperature_2m_min[0]);

          return (
            <ForecastDay
              key={day}
              day={getDayName(day, true)}
              emoji={emoji}
              max={maxTemp}
              min={minTemp}
              description={getWeatherInfo(code).label}
            />
          );
        })}
      </div>
    </div>
  );
};

const ForecastDay = ({ day, emoji, max, min, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 14,
    padding: '12px 8px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.2s, background 0.2s',
    cursor: 'default',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
  }}
  title={description}
  >
    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8, fontWeight: 500 }}>{day}</div>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
    <div style={{ fontSize: 16, fontWeight: 600 }}>
      {max}°
    </div>
    <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>
      {min}°
    </div>
  </div>
);

export default Forecast;