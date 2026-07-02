import { useEffect, useRef, useCallback } from 'react';

const WeatherCanvas = ({ weatherCode, temperature, opacity = 1 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  const initParticles = useCallback((width, height) => {
    const type = getParticleType(weatherCode);
    const count = getParticleCount(weatherCode, width);

    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(type, width, height));
    }
  }, [weatherCode]);

  const getParticleType = (code) => {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
    if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([95, 96, 99].includes(code)) return 'thunder';
    if ([45, 48].includes(code)) return 'fog';
    return 'clear';
  };

  const getParticleCount = (code, width) => {
    if ([61, 63, 65, 81, 82].includes(code)) return Math.min(width * 0.4, 400);
    if ([51, 53, 55, 80].includes(code)) return Math.min(width * 0.25, 250);
    if ([71, 73, 75, 77, 85, 86].includes(code)) return Math.min(width * 0.2, 200);
    if ([45, 48].includes(code)) return Math.min(width * 0.15, 150);
    return 0;
  };

  const createParticle = (type, w, h) => {
    switch (type) {
      case 'rain':
        return {
          x: Math.random() * w,
          y: Math.random() * -h,
          length: 10 + Math.random() * 20,
          speed: 8 + Math.random() * 12,
          wind: 2 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.5,
        };
      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * -50,
          radius: 1 + Math.random() * 4,
          speed: 0.5 + Math.random() * 1.5,
          drift: Math.random() * 2 - 1,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          opacity: 0.5 + Math.random() * 0.5,
        };
      case 'thunder':
        return {
          x: Math.random() * w,
          y: Math.random() * -h,
          length: 15 + Math.random() * 25,
          speed: 12 + Math.random() * 15,
          wind: 3 + Math.random() * 3,
          opacity: 0.4 + Math.random() * 0.6,
          flash: Math.random() > 0.95,
          flashTimer: Math.random() * 200,
        };
      case 'fog':
        return {
          x: Math.random() * w * 2 - w * 0.5,
          y: Math.random() * h * 0.6 + h * 0.1,
          radius: 80 + Math.random() * 200,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.05 + Math.random() * 0.15,
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const getGradient = (code) => {
      if ([61, 63, 65, 80, 81, 82].includes(code)) {
        return ['#2c3e50', '#34495e', '#4a6274'];
      }
      if ([51, 53, 55].includes(code)) {
        return ['#4a5568', '#5a6a7e', '#6a7a8e'];
      }
      if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return ['#4a5568', '#5a6a7e', '#6a7a8e'];
      }
      if ([95, 96, 99].includes(code)) {
        return ['#1a1a2e', '#16213e', '#0f3460'];
      }
      if ([45, 48].includes(code)) {
        return ['#6b7b8d', '#7d8e9e', '#8f9eae'];
      }
      if (temperature >= 30) {
        return ['#ff6b35', '#f7931e', '#ffd700'];
      }
      if (temperature >= 20) {
        return ['#4facfe', '#00f2fe', '#87ceeb'];
      }
      if (temperature >= 10) {
        return ['#667eea', '#764ba2', '#a8c0ff'];
      }
      return ['#2c3e50', '#3498db', '#87ceeb'];
    };

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const colors = getGradient(weatherCode);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2]);
      ctx.fillStyle = grad;
      ctx.globalAlpha = opacity;
      ctx.fillRect(0, 0, w, h);

      // Sun/moon for clear days
      if ([0, 1, 2].includes(weatherCode)) {
        const sunX = w * 0.75;
        const sunY = h * 0.15;
        const sunRadius = 50 + Math.sin(t * 0.02) * 5;

        // Glow
        const glowGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 4);
        glowGrad.addColorStop(0, 'rgba(255, 220, 100, 0.4)');
        glowGrad.addColorStop(0.5, 'rgba(255, 200, 50, 0.1)');
        glowGrad.addColorStop(1, 'rgba(255, 200, 50, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);

        // Sun body
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGrad.addColorStop(0, '#fff7a0');
        sunGrad.addColorStop(0.7, '#ffd700');
        sunGrad.addColorStop(1, '#ffa500');
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();

        // Rotating rays
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(t * 0.005);
        for (let i = 0; i < 12; i++) {
          ctx.rotate(Math.PI * 2 / 12);
          ctx.beginPath();
          ctx.moveTo(sunRadius + 5, 0);
          ctx.lineTo(sunRadius + 20 + Math.sin(t * 0.05 + i) * 5, 0);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Clouds for cloudy conditions
      if ([2, 3, 45, 48].includes(weatherCode)) {
        const cloudCount = weatherCode === 3 || weatherCode === 0 ? 5 : 8;
        for (let i = 0; i < cloudCount; i++) {
          const cx = ((i * w * 0.25 + t * (0.3 + i * 0.1)) % (w + 400)) - 200;
          const cy = 60 + i * 40 + Math.sin(t * 0.01 + i) * 10;
          drawCloud(ctx, cx, cy, 60 + i * 15, weatherCode === 3 || weatherCode === 2 ? 0.3 : 0.5);
        }
      }

      // Rain
      if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        particlesRef.current.forEach(p => {
          if (!p) return;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.wind * 2, p.y + p.length);
          ctx.strokeStyle = `rgba(174, 216, 230, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          p.y += p.speed;
          p.x += p.wind;

          if (p.y > h) {
            p.y = -p.length;
            p.x = Math.random() * w;
          }
        });
      }

      // Snow
      if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        particlesRef.current.forEach(p => {
          if (!p) return;
          p.wobble += p.wobbleSpeed;
          const drawX = p.x + Math.sin(p.wobble) * 20;

          ctx.beginPath();
          ctx.arc(drawX, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();

          p.y += p.speed;
          p.x += p.drift + Math.sin(p.wobble) * 0.5;

          if (p.y > h + 10) {
            p.y = -10;
            p.x = Math.random() * w;
          }
        });
      }

      // Thunder
      if ([95, 96, 99].includes(weatherCode)) {
        // Lightning flash
        particlesRef.current.forEach(p => {
          if (!p) return;
          if (p.flash && p.flashTimer < 5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 - p.flashTimer * 0.06})`;
            ctx.fillRect(0, 0, w, h);
          }

          // Lightning bolt
          if (p.flash) {
            ctx.beginPath();
            ctx.moveTo(p.x, 0);
            let bx = p.x, by = 0;
            const segments = 8;
            for (let i = 0; i < segments; i++) {
              bx += (Math.random() - 0.5) * 60;
              by += h / segments;
              ctx.lineTo(bx, by);
            }
            ctx.strokeStyle = `rgba(255, 255, 200, ${0.8 - p.flashTimer * 0.15})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - p.flashTimer * 0.1})`;
            ctx.lineWidth = 6;
            ctx.stroke();
          }

          // Rain (more intense)
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.wind * 2.5, p.y + p.length);
          ctx.strokeStyle = `rgba(174, 216, 230, ${p.opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          p.y += p.speed * 1.2;
          p.x += p.wind;
          p.flashTimer += 0.5;

          if (p.flashTimer > 20) {
            p.flash = Math.random() > 0.92;
            p.flashTimer = p.flash ? 0 : Math.random() * 200;
          }
          if (p.y > h) {
            p.y = -p.length;
            p.x = Math.random() * w;
          }
        });
      }

      // Fog
      if ([45, 48].includes(weatherCode)) {
        particlesRef.current.forEach(p => {
          if (!p) return;
          const fogGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          fogGrad.addColorStop(0, `rgba(200, 210, 220, ${p.opacity})`);
          fogGrad.addColorStop(1, `rgba(200, 210, 220, 0)`);
          ctx.fillStyle = fogGrad;
          ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);

          p.x += p.speed;
          if (p.x > w + p.radius) {
            p.x = -p.radius;
            p.y = Math.random() * h * 0.6 + h * 0.1;
          }
        });
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };

    const drawCloud = (ctx, x, y, size, density) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${density})`;
      const circles = [
        { dx: 0, dy: 0, r: size },
        { dx: -size * 0.7, dy: size * 0.2, r: size * 0.7 },
        { dx: size * 0.7, dy: size * 0.15, r: size * 0.75 },
        { dx: -size * 0.35, dy: -size * 0.35, r: size * 0.65 },
        { dx: size * 0.35, dy: -size * 0.3, r: size * 0.6 },
        { dx: size * 0.1, dy: size * 0.35, r: size * 0.8 },
      ];
      circles.forEach(c => {
        ctx.beginPath();
        ctx.arc(x + c.dx, y + c.dy, c.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, [weatherCode, temperature, opacity, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default WeatherCanvas;