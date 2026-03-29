/* 
    CPL AZURA-2K26 - Main Interactive Logic
    Built with GSAP, Three.js, Lucide, and Lenis
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. SYSTEM INITIALIZATION & PRELOADER
    const preloader = document.querySelector('#preloader');
    const preloaderBar = document.querySelector('#preloader-bar');
    const preloaderText = document.querySelector('#preloader-text');
    const bootLog = document.querySelector('#boot-log');
    
    const logs = [
        "FETCHING CORE_MODULES...",
        "INITIALIZING NEURAL_NETWORK...",
        "DECRYPTING AZURA_KERNEL...",
        "ESTABLISHING SECURE_CONNECTION...",
        "SYNCING LEADERBOARD_SHARDS...",
        "BOOTING_COMPILER_V8...",
        "SYSTEM_READY."
    ];
    
    let progress = 0;
    let logIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 100) progress = 100;
        
        preloaderBar.style.width = `${progress}%`;
        
        // Show logs at certain progress intervals
        if (progress > (logIndex + 1) * (100 / logs.length) && logIndex < logs.length) {
            bootLog.innerText = logs[logIndex];
            bootLog.style.opacity = "1";
            logIndex++;
            setTimeout(() => { if(progress < 100) bootLog.style.opacity = "0.4"; }, 200);
        }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(preloader, {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    duration: 1.2,
                    ease: "power4.inOut",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        ScrollTrigger.refresh();
                        initHeroAnimations();
                    }
                });
            }, 800);
        }
    }, 120);

    // 2. LUCIDE ICONS (Initialized after preloader to ensure everything is in DOM)
    // moved to end of script for safety

    // 3. SMOOTH SCROLL (LENIS)
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

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. THREE.JS HERO BACKGROUND (Neural Particle Mesh)
    const canvas = document.querySelector('#hero-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    // Particles
    const particlesCount = window.innerWidth > 768 ? 2500 : 1000;
    const positions = new Float32Array(particlesCount * 3);
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

    // Connecting Lines (Neural Network Look)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00F5FF, transparent: true, opacity: 0.05 });
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 6); // Simple connection mockup
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);

    // Animation Loop
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = mouseY * 0.2;
        particles.rotation.z = mouseX * 0.2;

        // Subtle pulsing
        particleMaterial.opacity = 0.5 + Math.sin(elapsedTime) * 0.3;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 5. CUSTOM CURSOR
    const cursor = document.querySelector('#cursor');
    const cursorDot = document.querySelector('#cursor-dot');
    
    let curX = window.innerWidth / 2, curY = window.innerHeight / 2;
    let targetX = curX, targetY = curY;
    let cursorVisible = false;

    // Hide cursor initially until first move
    cursor.style.opacity = "0";
    cursorDot.style.opacity = "0";

    window.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursorVisible = true;
            gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.5 });
        }
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateCursor() {
        curX += (targetX - curX) * 0.15;
        curY += (targetY - curY) * 0.15;
        
        cursor.style.transform = `translate(${curX - 16}px, ${curY - 16}px)`;
        cursorDot.style.transform = `translate(${targetX - 2}px, ${targetY - 2}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .pricing-card, .nav-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('link-hover');
            gsap.to(cursor, { scale: 1.5, borderColor: '#00F5FF', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('link-hover');
            gsap.to(cursor, { scale: 1, borderColor: 'rgba(0, 245, 255, 1)', duration: 0.3 });
        });
    });

    // 6. GSAP SCROLLTRIGGER & REVEALS
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Scroll Effect & Progress Bar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('#navbar');
        const scrollProgress = document.querySelector('#scroll-progress');
        
        // Progress Logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            gsap.to(navbar, { backgroundColor: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(20px)', padding: '12px 0', duration: 0.3 });
        } else {
            navbar.classList.remove('scrolled');
            gsap.to(navbar, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', padding: '24px 0', duration: 0.3 });
        }
    });

    // Hero Init Animations
    function initHeroAnimations() {
        const tl = gsap.timeline();
        tl.to(".gradient-text", { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" })
          .to(".outline-text", { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=1.2")
          .from("#hero p", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=1")
          .from("#hero .flex", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.8")
          .from("#navbar", { y: -100, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1.2")
          .from("#hero-canvas-container", { opacity: 0, duration: 2 }, "-=1.5");
    }

    // Generic Section Reveals
    const revealSections = document.querySelectorAll('section');
    revealSections.forEach(section => {
        // Entrance animation for headings
        gsap.from(section.querySelectorAll('h2, h3'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Staggered reveal for cards and elements
        const elements = section.querySelectorAll('.pricing-card, .glass, ul li, .p-6');
        if (elements.length > 0) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.6,
                    from: "start"
                },
                ease: "power2.out"
            });
        }
    });

    // Timeline Steps Stagger
    gsap.from(".timeline-step", {
        scrollTrigger: {
            trigger: "#timeline",
            start: "top 70%"
        },
        y: 100,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: "power4.out",
        onComplete: () => {
            document.querySelectorAll('.timeline-step').forEach(step => step.style.opacity = 1);
        }
    });

    // 7. COUNTDOWN TIMER & LIVE STATUS
    function updateCountdown() {
        const eventStart = new Date('April 2, 2026 10:00:00').getTime();
        const eventEnd = new Date('April 2, 2026 13:00:00').getTime();
        const now = new Date().getTime();
        
        const countdownEl = document.querySelector('#countdown');

        // Check if Event is Live
        if (now >= eventStart && now <= eventEnd) {
            countdownEl.innerHTML = `
                <div class='col-span-4 flex flex-col items-center gap-4 py-8 bg-primary/5 border border-primary/20 rounded-3xl animate-pulse'>
                    <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                        <span class="text-3xl font-black text-primary tracking-widest">EVENT IS LIVE</span>
                    </div>
                </div>`;
            return;
        }

        // Check if Event is Over
        if (now > eventEnd) {
            countdownEl.innerHTML = "<div class='text-4xl font-black text-white/20 col-span-4 tracking-tighter'>REGISTRATIONS CLOSED</div>";
            return;
        }

        const diff = eventStart - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.querySelector('#days').innerText = days.toString().padStart(2, '0');
        document.querySelector('#hours').innerText = hours.toString().padStart(2, '0');
        document.querySelector('#minutes').innerText = minutes.toString().padStart(2, '0');
        document.querySelector('#seconds').innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 8. CARD TILT EFFECT (Vanilla JS for performance)
    const cards = document.querySelectorAll('.pricing-card, .glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // 9. MAGNETIC BUTTONS & ICONS
    const magneticBtns = document.querySelectorAll('button, .px-8, .magnetic-icon');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 10. FINAL INITIALIZATION
    lucide.createIcons();
});
