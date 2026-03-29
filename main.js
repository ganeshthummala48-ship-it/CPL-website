/* 
    CPL AZURA-2K26 - Main Interactive Logic
    Built with GSAP, Three.js, Lucide, and Lenis
*/

document.addEventListener('DOMContentLoaded', () => {

    // ── COUNTDOWN (runs first, independently — no dependencies) ──────────────
    // Month is 0-indexed: Jan=0, Feb=1, Mar=2, Apr=3
    const eventStart = new Date(2026, 3, 2, 10, 0, 0).getTime();
    const eventEnd   = eventStart + (3 * 60 * 60 * 1000); // +3 hours

    function updateCountdown() {
        const now = Date.now();
        const countdownEl = document.getElementById('countdown');
        if (!countdownEl) return;

        if (now >= eventStart && now <= eventEnd) {
            countdownEl.innerHTML = `
                <div class='col-span-4 flex flex-col items-center gap-4 py-8 bg-primary/5 border border-primary/20 rounded-3xl animate-pulse'>
                    <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping"></span>
                        <span class="text-3xl font-black text-primary tracking-widest">EVENT IS LIVE</span>
                    </div>
                </div>`;
            return;
        }

        if (now > eventEnd) {
            countdownEl.innerHTML = "<div class='text-4xl font-black text-white/20 col-span-4 tracking-tighter'>REGISTRATIONS CLOSED</div>";
            return;
        }

        const diff    = eventStart - now;
        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val.toString().padStart(2, '0');
        };
        set('days',    days);
        set('hours',   hours);
        set('minutes', minutes);
        set('seconds', seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ── PRELOADER ─────────────────────────────────────────────────────────────
    const preloader    = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const bootLog      = document.getElementById('boot-log');

    const logs = [
        "FETCHING CORE_MODULES...",
        "INITIALIZING NEURAL_NETWORK...",
        "DECRYPTING AZURA_KERNEL...",
        "ESTABLISHING SECURE_CONNECTION...",
        "SYNCING LEADERBOARD_SHARDS...",
        "BOOTING_COMPILER_V8...",
        "SYSTEM_READY."
    ];

    let progress = 0, logIndex = 0;

    const bootInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 100) progress = 100;

        if (preloaderBar) preloaderBar.style.width = `${progress}%`;

        if (progress > (logIndex + 1) * (100 / logs.length) && logIndex < logs.length) {
            if (bootLog) {
                bootLog.innerText = logs[logIndex];
                bootLog.style.opacity = "1";
            }
            logIndex++;
            setTimeout(() => { if (bootLog && progress < 100) bootLog.style.opacity = "0.4"; }, 200);
        }

        if (progress === 100) {
            clearInterval(bootInterval);
            setTimeout(() => {
                if (!preloader) return;
                try {
                    gsap.to(preloader, {
                        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                        duration: 1.2,
                        ease: "power4.inOut",
                        onComplete: () => {
                            preloader.style.display = 'none';
                            initHeroAnimations();
                        }
                    });
                } catch(e) {
                    preloader.style.display = 'none';
                }
            }, 800);
        }
    }, 120);

    // ── LENIS SMOOTH SCROLL ───────────────────────────────────────────────────
    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    } catch(e) {
        console.warn('Lenis failed to initialize:', e);
    }

    // ── THREE.JS BACKGROUND ───────────────────────────────────────────────────
    try {
        const canvas = document.querySelector('#hero-canvas');
        if (canvas && window.THREE) {
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);

            const scene  = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 15;

            const particlesCount  = window.innerWidth > 768 ? 2000 : 800;
            const positions       = new Float32Array(particlesCount * 3);
            const particleGeometry = new THREE.BufferGeometry();

            for (let i = 0; i < particlesCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 40;
            }
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.05,
                color: 0x00F5FF,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);

            let mouseX = 0, mouseY = 0;
            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) - 0.5;
                mouseY = (e.clientY / window.innerHeight) - 0.5;
            });

            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                const t = clock.getElapsedTime();
                particles.rotation.y = t * 0.05;
                particles.rotation.x = mouseY * 0.2;
                particles.rotation.z = mouseX * 0.2;
                particleMaterial.opacity = 0.5 + Math.sin(t) * 0.3;
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    } catch(e) {
        console.warn('Three.js failed to initialize:', e);
    }

    // ── CUSTOM CURSOR ─────────────────────────────────────────────────────────
    try {
        const cursor    = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursor-dot');
        if (cursor && cursorDot) {
            let curX = window.innerWidth / 2, curY = window.innerHeight / 2;
            let targetX = curX, targetY = curY, cursorVisible = false;
            cursor.style.opacity = "0";
            cursorDot.style.opacity = "0";

            window.addEventListener('mousemove', (e) => {
                if (!cursorVisible) {
                    cursorVisible = true;
                    gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.5 });
                }
                targetX = e.clientX; targetY = e.clientY;
            });

            function updateCursor() {
                curX += (targetX - curX) * 0.15;
                curY += (targetY - curY) * 0.15;
                cursor.style.transform    = `translate(${curX - 16}px, ${curY - 16}px)`;
                cursorDot.style.transform = `translate(${targetX - 2}px, ${targetY - 2}px)`;
                requestAnimationFrame(updateCursor);
            }
            updateCursor();

            document.querySelectorAll('a, button, .pricing-card, .nav-link').forEach(el => {
                el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.5, duration: 0.3 }));
                el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
            });
        }
    } catch(e) {
        console.warn('Cursor failed to initialize:', e);
    }

    // ── GSAP SCROLL ANIMATIONS ────────────────────────────────────────────────
    try {
        gsap.registerPlugin(ScrollTrigger);

        // Scroll progress + navbar
        window.addEventListener('scroll', () => {
            const scrollProgress = document.getElementById('scroll-progress');
            const navbar = document.getElementById('navbar');
            if (scrollProgress) {
                const winScroll = document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                scrollProgress.style.width = ((winScroll / height) * 100) + "%";
            }
            if (navbar) {
                if (window.scrollY > 50) {
                    gsap.to(navbar, { backgroundColor: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', padding: '12px 0', duration: 0.3 });
                } else {
                    gsap.to(navbar, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', padding: '24px 0', duration: 0.3 });
                }
            }
        });

        // Section reveals
        document.querySelectorAll('section').forEach(section => {
            gsap.from(section.querySelectorAll('h2, h3'), {
                scrollTrigger: { trigger: section, start: "top 80%" },
                y: 40, opacity: 0, duration: 1, ease: "power3.out"
            });
            const els = section.querySelectorAll('.pricing-card, .glass, ul li, .p-6');
            if (els.length > 0) {
                gsap.from(els, {
                    scrollTrigger: { trigger: section, start: "top 70%" },
                    y: 50, opacity: 0, duration: 0.8,
                    stagger: { amount: 0.6, from: "start" },
                    ease: "power2.out"
                });
            }
        });

        gsap.from(".timeline-step", {
            scrollTrigger: { trigger: "#timeline", start: "top 70%" },
            y: 100, opacity: 0, stagger: 0.3, duration: 1, ease: "power4.out"
        });

    } catch(e) {
        console.warn('GSAP failed to initialize:', e);
    }

    // ── HERO ENTRY ANIMATION ──────────────────────────────────────────────────
    function initHeroAnimations() {
        try {
            const tl = gsap.timeline();
            tl.to(".gradient-text",   { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" })
              .to(".outline-text",    { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=1.2")
              .from("#hero p",        { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=1")
              .from("#hero .flex",    { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8")
              .from("#navbar",        { y: -100, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1.2")
              .from("#hero-canvas-container", { opacity: 0, duration: 2 }, "-=1.5");
            ScrollTrigger.refresh();
        } catch(e) {
            console.warn('Hero animation failed:', e);
        }
    }

    // ── CARD TILT ─────────────────────────────────────────────────────────────
    try {
        document.querySelectorAll('.pricing-card, .glass').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 20;
                const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });
    } catch(e) {}

    // ── MAGNETIC BUTTONS ──────────────────────────────────────────────────────
    try {
        document.querySelectorAll('button, .px-8, .magnetic-icon').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.4, y: (e.clientY - rect.top - rect.height / 2) * 0.4, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
        });
    } catch(e) {}

    // ── ICONS ─────────────────────────────────────────────────────────────────
    try { lucide.createIcons(); } catch(e) { console.warn('Lucide failed:', e); }
});
