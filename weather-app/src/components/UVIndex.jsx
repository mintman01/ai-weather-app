import { formatTime, getDayName } from '../services/weatherApi';

const UVIndex = ({ daily }) => {
  if (!daily?.sunrise || !daily?.sunset) return null;

  return (
    <div style={{
      color: '#fff',
      animation: 'fadeInUp 0.6s ease 0.3s both',
    }}>
      <h3 style={{
        fontSize: 18,
        fontWeight: 500,
        marginBottom: 16,
        textShadow: '0 1px 5px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        Солнечная активность
      </h3>
      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: 500,
        margin: '0 auto',
      }}>
        <DetailCard
          icon="🌅"
          label="Рассвет"
          value={formatTime(daily.sunrise[0])}
        />
        <DetailCard
          icon="🌇"
          label="Закат"
          value={formatTime(daily.sunset[0])}
        />
        <DetailCard
          icon="☀️"
          label="UV-индекс макс."
          value={daily.uv_index_max[0]?.toFixed(1) ?? '-'}
          sub={getUVLabel(daily.uv_index_max[0])}
        />
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, sub }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '12px 20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minWidth: 120,
  }}>
    <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{sub}</div>}
  </div>
);

function getUVLabel(uv) {
  if (uv <= 2) return 'Низкий';
  if (uv <= 5) return 'Умеренный';
  if (uv <= 7) return 'Высокий';
  if (uv <= 10) return 'Очень высокий';
  return 'Экстремальный';
}

export default UVIndex;