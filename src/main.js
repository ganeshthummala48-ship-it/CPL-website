import './style.css';

// Particle Background or Matrix-like effect (Simplified for Hero)
function initHeroBg() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  bg.appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      color: Math.random() > 0.5 ? '#00f2ff' : '#9d00ff'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Lines
      particles.forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(157, 0, 255, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Countdown Timer
function startCountdown() {
    const targetDate = new Date('April 2, 2026 09:00:00').getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            const cd = document.getElementById('countdown');
            if (cd) cd.innerHTML = "<h3>EVENT STARTED!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Scroll Reveal using Intersection Observer
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a stagger container, find children and reveal them
                if (entry.target.hasAttribute('data-stagger')) {
                    const children = entry.target.querySelectorAll('.stagger-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos], [data-stagger]').forEach(el => {
        observer.observe(el);
    });
}

// Glitch effect on title
function initGlitchEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    // Add glitch class randomly or on hover
    setInterval(() => {
        if (Math.random() > 0.9) {
            title.classList.add('glitch-text');
            setTimeout(() => title.classList.remove('glitch-text'), 200);
        }
    }, 1000);
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!btn || !navLinks) return;
    
    btn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        btn.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            btn.classList.remove('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHeroBg();
    startCountdown();
    initScrollReveal();
    initMobileMenu();
    initGlitchEffect();
});
