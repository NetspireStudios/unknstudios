import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Set up global GSAP settings
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Wait for preloader to complete before initializing scroll animations
    window.addEventListener('preloader-complete', () => {
      this.initScrollAnimations();
      this.initPageTransitions();
      this.initInteractiveElements();
    });

    // Make GSAP available globally
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
  }

  initScrollAnimations() {
    // General fade-in animations for sections
    gsap.utils.toArray('section').forEach((section, index) => {
      if (section.id === 'hero') return; // Skip hero section

      gsap.fromTo(section, 
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
            onEnter: () => this.animateSectionElements(section),
          }
        }
      );
    });

    // Parallax text elements
    gsap.utils.toArray('[data-parallax]').forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      gsap.to(element, {
        y: () => -(1 - speed) * ScrollTrigger.maxScroll(window),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Stagger animations for cards/items
    gsap.utils.toArray('.stagger-animate').forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      gsap.fromTo(items,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Text reveal animations
    gsap.utils.toArray('.text-reveal').forEach(element => {
      const text = element.textContent;
      element.innerHTML = `<span class="text-reveal-inner">${text}</span>`;
      
      gsap.fromTo(element.querySelector('.text-reveal-inner'),
        {
          y: "100%",
          opacity: 0
        },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Counter animations
    gsap.utils.toArray('[data-counter]').forEach(counter => {
      const endValue = parseInt(counter.dataset.counter);
      const duration = counter.dataset.duration || 2;
      
      ScrollTrigger.create({
        trigger: counter,
        start: "top 80%",
        onEnter: () => {
          gsap.to(counter, {
            textContent: endValue,
            duration: duration,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
              counter.textContent = Math.ceil(this.targets()[0].textContent);
            }
          });
        },
        once: true
      });
    });

    // Background color changes on scroll
    const sections = gsap.utils.toArray('section[data-bg-color]');
    sections.forEach(section => {
      const bgColor = section.dataset.bgColor;
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => this.changeBackgroundColor(bgColor),
        onLeave: () => this.resetBackgroundColor(),
        onEnterBack: () => this.changeBackgroundColor(bgColor),
        onLeaveBack: () => this.resetBackgroundColor()
      });
    });
  }

  animateSectionElements(section) {
    // Animate headings
    const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
    gsap.fromTo(headings,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
      }
    );

    // Animate paragraphs
    const paragraphs = section.querySelectorAll('p');
    gsap.fromTo(paragraphs,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.4
      }
    );

    // Animate buttons
    const buttons = section.querySelectorAll('button, .btn');
    gsap.fromTo(buttons,
      {
        opacity: 0,
        y: 20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.6
      }
    );

    // Animate images
    const images = section.querySelectorAll('img');
    gsap.fromTo(images,
      {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)"
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3
      }
    );
  }

  initPageTransitions() {
    // Page transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: linear-gradient(135deg, #F92178, #FD7504, #34FEFA);
      z-index: 9999;
      pointer-events: none;
      transform: scaleY(0);
      transform-origin: top;
    `;
    document.body.appendChild(overlay);

    // Transition function
    window.pageTransition = (callback) => {
      gsap.to(overlay, {
        scaleY: 1,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (callback) callback();
          gsap.to(overlay, {
            scaleY: 0,
            duration: 0.5,
            ease: "power2.inOut",
            transformOrigin: "bottom",
            delay: 0.2
          });
        }
      });
    };
  }

  initInteractiveElements() {
    // Magnetic effect for buttons
    gsap.utils.toArray('.magnetic').forEach(element => {
      const magnetic = element;
      const magneticText = magnetic.querySelector('span') || magnetic;

      magnetic.addEventListener('mouseenter', () => {
        gsap.to(magnetic, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      magnetic.addEventListener('mouseleave', () => {
        gsap.to(magnetic, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        });
        gsap.to(magneticText, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        });
      });

      magnetic.addEventListener('mousemove', (e) => {
        const rect = magnetic.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(magnetic, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(magneticText, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Cursor follower
    this.initCursorFollower();

    // Smooth hover effects for links
    gsap.utils.toArray('a, button').forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  initCursorFollower() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #F92178, #FD7504);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    // Cursor movement
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    });

    // Cursor interactions
    document.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    });

    document.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
    });

    // Hover effects
    gsap.utils.toArray('a, button, .clickable').forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          width: 40,
          height: 40,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          width: 20,
          height: 20,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  changeBackgroundColor(color) {
    gsap.to(document.body, {
      backgroundColor: color,
      duration: 1,
      ease: "power2.out"
    });
  }

  resetBackgroundColor() {
    gsap.to(document.body, {
      backgroundColor: "#000000",
      duration: 1,
      ease: "power2.out"
    });
  }

  // Public methods for external use
  animateIn(element, options = {}) {
    const defaults = {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    };
    
    const settings = { ...defaults, ...options };
    return gsap.to(element, settings);
  }

  animateOut(element, options = {}) {
    const defaults = {
      opacity: 0,
      y: -50,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in"
    };
    
    const settings = { ...defaults, ...options };
    return gsap.to(element, settings);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.animationManager = new AnimationManager();
});

export default AnimationManager; 