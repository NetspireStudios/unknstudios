import Lenis from 'lenis';

// Initialize Lenis smooth scrolling
class SmoothScrollManager {
  constructor() {
    this.lenis = null;
    this.init();
  }

  init() {
    // Create Lenis instance
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop
    this.raf();

    // Add scroll trigger
    this.setupScrollTrigger();

    // Setup custom events
    this.setupEvents();
  }

  raf() {
    const animate = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  setupScrollTrigger() {
    // Integrate with GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      this.lenis.on('scroll', window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    }
  }

  setupEvents() {
    // Custom scroll events
    this.lenis.on('scroll', (e) => {
      // Update scroll progress for animations
      const scrollProgress = e.progress;
      document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
      
      // Dispatch custom scroll event
      window.dispatchEvent(new CustomEvent('smooth-scroll', {
        detail: {
          scroll: e.scroll,
          progress: e.progress,
          velocity: e.velocity,
          direction: e.direction
        }
      }));
    });

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          this.lenis.scrollTo(target, {
            offset: -80, // Account for navbar
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      });
    });

    // Disable scroll during preloader
    window.addEventListener('preloader-complete', () => {
      this.lenis.start();
    });

    // Initially stop scroll
    this.lenis.stop();
  }

  // Public methods
  scrollTo(target, options = {}) {
    this.lenis.scrollTo(target, options);
  }

  start() {
    this.lenis.start();
  }

  stop() {
    this.lenis.stop();
  }

  destroy() {
    this.lenis.destroy();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.smoothScroll = new SmoothScrollManager();
});

export default SmoothScrollManager; 