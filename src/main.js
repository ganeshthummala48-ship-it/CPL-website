import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/**
 * Stage 3D Background - Three.js Implementation
 */
function initThreeStage() {
    const canvas = document.querySelector('#stage-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Mesh Geometry
    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.4
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        points.rotation.y += 0.001;
        points.rotation.x += 0.0005;

        // Mouse reaction
        gsap.to(points.rotation, {
            y: mouseX * 0.2,
            x: -mouseY * 0.2,
            duration: 2,
            ease: 'power2.out'
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * Zenith Preloader & Entry Sequence
 */
function initPreloader() {
    const tl = gsap.timeline();

    tl.to('#preloader-progress', {
        width: '100%',
        duration: 1.5,
        ease: 'power4.inOut'
    });

    tl.to('#preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
    });

    // Hero Reveal Sequence
    tl.from('#hero-reveal-header', { opacity: 0, y: 30, duration: 1 }, '-=0.4');
    tl.from('.text-ultra', { 
        y: 100, 
        rotateX: 45, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 1.5, 
        ease: 'power4.out' 
    }, '-=0.8');
    tl.from('#hero-reveal-desc', { opacity: 0, x: -30, duration: 1 }, '-=1');
    tl.from('#hero-reveal-timer', { opacity: 0, x: 30, duration: 1 }, '-=1');
    tl.from('#navbar', { y: -100, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8');
}

/**
 * Smooth Scrolling - Lenis
 */
function initLenis() {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

/**
 * Zenith Magnetic Interaction
 */
function initMagnetic() {
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.6,
                ease: 'power3.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

/**
 * Custom Cursor Zenith
 */
function initCustomCursor() {
    const cursor = document.querySelector('#custom-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    const links = document.querySelectorAll('a, button, .magnetic');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/**
 * GSAP ScrollTrigger Zenith Reveals
 */
function initScrollTriggerAnimations() {
    // Reveal Fade Up
    document.querySelectorAll('.stagger-reveal').forEach((el) => {
       gsap.from(el, {
           opacity: 0,
           y: 60,
           duration: 1.5,
           ease: 'power4.out',
           scrollTrigger: {
               trigger: el,
               start: 'top 90%'
           }
       });
    });

    // About Section Parallax Reveal
    gsap.from('#about-reveal-copy', {
        opacity: 0,
        x: -50,
        scrollTrigger: {
            trigger: '#about-reveal-copy',
            start: 'top 80%'
        },
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('#about-reveal-visual', {
        opacity: 0,
        x: 50,
        scale: 0.9,
        scrollTrigger: {
            trigger: '#about-reveal-visual',
            start: 'top 80%'
        },
        duration: 1.5,
        ease: 'power4.out'
    });

    // 3D Card Tilt Tracking Scroll
    const cardWraps = document.querySelectorAll('.card-3d-wrap');
    cardWraps.forEach(wrap => {
        gsap.to(wrap.querySelector('.card-3d'), {
            rotateY: 10,
            rotateX: -10,
            scrollTrigger: {
               trigger: wrap,
               start: 'top bottom',
               end: 'bottom top',
               scrub: true
            }
        });
    });

    // Parallax Cards
    document.querySelectorAll('.parallax-card').forEach(p => {
        const speed = p.dataset.speed || 0.1;
        gsap.to(p, {
            y: 100 * speed,
            scrollTrigger: {
               trigger: p,
               scrub: true
            }
        });
    });
}

/**
 * Countdown Timer Zenith
 */
function startCountdown() {
    const targetDate = new Date('April 2, 2026 09:00:00').getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            const cd = document.getElementById('countdown');
            if (cd) cd.innerHTML = "<h3 class='text-grad font-orbitron'>ARENA_ACTIVE</h3>";
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

/**
 * Main Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initThreeStage();
    initPreloader();
    initCustomCursor();
    initMagnetic();
    initScrollTriggerAnimations();
    startCountdown();
});
