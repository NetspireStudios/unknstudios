# UNKN Studio - Cinematic Portfolio Website

## Project Overview
A high-end, cinematic portfolio website for UNKN Studio content agency, featuring advanced parallax animations, 3D effects, and smooth transitions.

## Brand Colors
- Primary Orange: #FD7504
- Accent Blue: #34FEFA  
- Accent Pink: #F92178
- Background: Black (#000000)
- Text: White (#FFFFFF)

## Tech Stack
- **Framework**: Astro
- **Animations**: GSAP (GreenSock)
- **Smooth Scrolling**: Lenis
- **3D Graphics**: Three.js
- **Preloader**: Spline (https://my.spline.design/rocket-eSnATDVAWyBeOOQQPhh9Ch2v/)
- **Fonts**: Custom typography mix (minimalist + cursive italics)

## Key Features

### 1. Preloader
- Spline 3D rocket animation
- Minimalist loading bar with percentage
- Screen slides from bottom-up transition at 100%

### 2. Navigation
- Minimalist navbar
- Burger menu opens right-to-left lightbox
- Bold fonts with hover underline animations
- Smooth GSAP transitions

### 3. Sections Structure
1. **Hero Section**: Large impactful text with parallax background
2. **Services**: Animated service cards with stagger effects
3. **Video Catalog**: Top 4 videos showcase + "View All" page transition
4. **Pricing**: 3-tier pricing cards with hover animations
5. **Contact**: Interactive contact form with animations

### 4. Animation System
- **Parallax**: Multi-layer background movement
- **Scroll Triggers**: Every element animates on scroll entry
- **3D Motion Lines**: Three.js particles moving through scenes
- **Typography**: Dynamic font mixing and color transitions
- **Page Transitions**: Smooth slide animations between pages

## File Structure
```
src/
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   └── videos.astro
├── components/
│   ├── Preloader.astro
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── Services.astro
│   ├── VideoShowcase.astro
│   ├── Pricing.astro
│   ├── Contact.astro
│   └── ParallaxLines.astro
├── scripts/
│   ├── animations.js
│   ├── lenis.js
│   └── three-background.js
└── styles/
    ├── global.css
    └── components.css
```

## Installation & Setup
```bash
npm create astro@latest unkn-studio
cd unkn-studio
npm install gsap lenis three @splinetool/viewer
npm run dev
```

## Performance Notes
- Optimized GSAP animations with GPU acceleration
- Lazy loading for video content
- Smooth 60fps scrolling with Lenis
- Three.js scene optimization for mobile

## Content Strategy
Professional copywriting focused on:
- Content creation expertise
- Video editing mastery
- Brand storytelling
- Client success stories
- Creative process showcase
```

**Creating the main package.json:**

```json:package.json
{
  "name": "unkn-studio",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "gsap": "^3.12.2",
    "lenis": "^1.0.42",
    "three": "^0.159.0",
    "@splinetool/viewer": "^0.9.514",
    "@splinetool/runtime": "^0.9.514"
  },
  "devDependencies": {
    "@astrojs/tailwind": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "@types/three": "^0.159.0"
  }
}
```

**Creating Astro configuration:**

```javascript:astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis', 'three']
    }
  }
});
```

**Creating the main layout:**

```astro:src/layouts/Layout.astro
---
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="UNKN Studio - Premium Content Creation Agency" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-black text-white overflow-x-hidden">
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <slot />
      </div>
    </div>
    
    <!-- Three.js Canvas -->
    <canvas id="three-canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none z-0"></canvas>
    
    <script>
      import '../scripts/lenis.js';
      import '../scripts/animations.js';
      import '../scripts/three-background.js';
    </script>
  </body>
</html>
```

**Creating the preloader component:**

```astro:src/components/Preloader.astro
---
---

<div id="preloader" class="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
  <!-- Spline 3D Scene -->
  <div class="spline-container mb-8">
    <spline-viewer 
      url="https://my.spline.design/rocket-eSnATDVAWyBeOOQQPhh9Ch2v/"
      class="w-80 h-80">
    </spline-viewer>
  </div>
  
  <!-- Loading Bar -->
  <div class="loading-container text-center">
    <div class="loading-bar-container mb-4 w-80">
      <div class="loading-bar-bg h-0.5 bg-gray-800 relative overflow-hidden">
        <div id="loading-bar" class="h-full bg-gradient-to-r from-pink-primary via-orange-primary to-blue-primary w-0 transition-all duration-300"></div>
      </div>
    </div>
    <div id="loading-percentage" class="text-white font-light text-sm tracking-widest">0%</div>
  </div>
</div>

<script>
  import { gsap } from 'gsap';
  import '@splinetool/viewer';

  class PreloaderManager {
    constructor() {
      this.loadingBar = document.getElementById('loading-bar');
      this.loadingPercentage = document.getElementById('loading-percentage');
      this.preloader = document.getElementById('preloader');
      this.progress = 0;
      this.init();
    }

    init() {
      // Simulate loading process
      this.animateProgress();
    }

    animateProgress() {
      const duration = 3; // 3 seconds loading time
      const tl = gsap.timeline();

      tl.to(this, {
        progress: 100,
        duration: duration,
        ease: "power2.out",
        onUpdate: () => {
          const roundedProgress = Math.round(this.progress);
          this.loadingBar.style.width = `${roundedProgress}%`;
          this.loadingPercentage.textContent = `${roundedProgress}%`;
        },
        onComplete: () => {
          this.hidePreloader();
        }
      });
    }

    hidePreloader() {
      const tl = gsap.timeline();
      
      // Slide screen from bottom up
      tl.to(this.preloader, {
        y: '-100%',
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          this.preloader.style.display = 'none';
          // Trigger main animations
          window.dispatchEvent(new CustomEvent('preloader-complete'));
        }
      });
    }
  }

  // Initialize preloader when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    new PreloaderManager();
  });
</script>

<style>
  .loading-bar-bg::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
```

**Creating the navigation component:**

```astro:src/components/Navbar.astro
---
---

<nav id="navbar" class="fixed top-0 left-0 right-0 z-40 p-6 mix-blend-difference">
  <div class="flex justify-between items-center">
    <!-- Logo -->
    <div class="logo">
      <a href="/" class="text-2xl font-bold tracking-tight">UNKN</a>
    </div>
    
    <!-- Burger Menu -->
    <button id="burger-menu" class="burger-menu relative w-8 h-8 flex flex-col justify-center items-center">
      <span class="burger-line w-8 h-0.5 bg-white transition-all duration-300"></span>
      <span class="burger-line w-8 h-0.5 bg-white transition-all duration-300 mt-1.5"></span>
      <span class="burger-line w-8 h-0.5 bg-white transition-all duration-300 mt-1.5"></span>
    </button>
  </div>
</nav>

<!-- Navigation Menu Overlay -->
<div id="nav-overlay" class="fixed inset-0 bg-black z-30 translate-x-full">
  <div class="h-full flex items-center justify-center">
    <ul class="nav-menu space-y-8 text-center">
      <li><a href="#home" class="nav-link text-6xl font-bold hover-underline">Home</a></li>
      <li><a href="#services" class="nav-link text-6xl font-bold hover-underline">Services</a></li>
      <li><a href="#work" class="nav-link text-6xl font-bold hover-underline">Work</a></li>
      <li><a href="#pricing" class="nav-link text-6xl font-bold hover-underline">Pricing</a></li>
      <li><a href="#contact" class="nav-link text-6xl font-bold hover-underline">Contact</a></li>
    </ul>
  </div>
</div>

<script>
  import { gsap } from 'gsap';

  class NavigationManager {
    constructor() {
      this.burgerMenu = document.getElementById('burger-menu');
      this.navOverlay = document.getElementById('nav-overlay');
      this.navLinks = document.querySelectorAll('.nav-link');
      this.burgerLines = document.querySelectorAll('.burger-line');
      this.isOpen = false;
      this.init();
    }

    init() {
      this.burgerMenu.addEventListener('click', () => this.toggleMenu());
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      this.setupHoverEffects();
    }

    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

    openMenu() {
      this.isOpen = true;
      const tl = gsap.timeline();

      // Animate burger to X
      tl.to(this.burgerLines[0], { rotation: 45, y: 6, duration: 0.3 })
        .to(this.burgerLines[1], { opacity: 0, duration: 0.3 }, 0)
        .to(this.burgerLines[2], { rotation: -45, y: -6, duration: 0.3 }, 0)
        // Slide menu in from right
        .to(this.navOverlay, { x: 0, duration: 0.6, ease: "power3.out" }, 0.2)
        // Stagger animate menu items
        .from('.nav-menu li', {
          x: 100,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }, 0.4);
    }

    closeMenu() {
      this.isOpen = false;
      const tl = gsap.timeline();

      // Animate X back to burger
      tl.to(this.burgerLines[0], { rotation: 0, y: 0, duration: 0.3 })
        .to(this.burgerLines[1], { opacity: 1, duration: 0.3 }, 0)
        .to(this.burgerLines[2], { rotation: 0, y: 0, duration: 0.3 }, 0)
        // Slide menu out to right
        .to(this.navOverlay, { x: '100%', duration: 0.6, ease: "power3.in" }, 0);
    }

    setupHoverEffects() {
      this.navLinks.forEach(link => {
        const underline = document.createElement('div');
        underline.className = 'nav-underline absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-primary via-orange-primary to-blue-primary';
        link.style.position = 'relative';
        link.appendChild(underline);

        link.addEventListener('mouseenter', () => {
          gsap.to(underline, { width: '100%', duration: 0.4, ease: "power2.out" });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(underline, { width: 0, duration: 0.4, ease: "power2.out" });
        });
      });
    }
  }

  // Initialize navigation when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
  });
</script>

<style>
  .hover-underline {
    @apply relative;
  }
</style>
```

**Creating the hero section:**

```astro:src/components/Hero.astro
---
---

<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute inset-0 z-0">
    <div id="hero-bg-1" class="absolute w-full h-full bg-gradient-to-br from-orange-primary/5 to-transparent"></div>
    <div id="hero-bg-2" class="absolute w-full h-full bg-gradient-to-tl from-pink-primary/5 to-transparent"></div>
    <div id="hero-bg-3" class="absolute w-full h-full bg-gradient-to-tr from-blue-primary/5 to-transparent"></div>
  </div>

  <!-- Main Content -->
  <div class="relative z-10 text-center max-w-7xl mx-auto px-6">
    <!-- Main Title -->
    <div class="hero-title-container overflow-hidden">
      <h1 class="hero-title text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tight">
        <span class="hero-word inline-block">CREATE</span>
        <br>
        <span class="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-primary via-orange-primary to-blue-primary">CINEMATIC</span>
        <br>
        <span class="hero-word inline-block italic font-serif">experiences</span>
      </h1>
    </div>

    <!-- Subtitle -->
    <div class="hero-subtitle-container overflow-hidden mt-8">
      <p class="hero-subtitle text-xl md:text-2xl font-light tracking-wide text-gray-300 max-w-3xl mx-auto">
        We craft visual stories that captivate, inspire, and drive results. 
        From concept to delivery, we're your creative partners in content excellence.
      </p>
    </div>

    <!-- CTA Button -->
    <div class="hero-cta-container mt-12">
      <button class="hero-cta group relative px-12 py-4 text-lg font-semibold border border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:border-orange-primary">
        <span class="relative z-10 group-hover:text-black transition-colors duration-500">Start Your Project</span>
        <div class="absolute inset-0 bg-gradient-to-r from-pink-primary via-orange-primary to-blue-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </button>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div class="scroll-indicator w-6 h-10 border border-white/30 rounded-full flex justify-center">
      <div class="scroll-dot w-1 h-1 bg-white rounded-full mt-2 animate-bounce"></div>
    </div>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  class HeroAnimations {
    constructor() {
      this.init();
    }

    init() {
      // Wait for preloader to complete
      window.addEventListener('preloader-complete', () => {
        this.animateHero();
        this.setupScrollAnimations();
      });
    }

    animateHero() {
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate title words
      tl.from('.hero-word', {
        y: 200,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      })
      // Animate subtitle
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.8)
      // Animate CTA
      .from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 1.2)
      // Animate scroll indicator
      .from('.scroll-indicator', {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 1.4);

      // Background parallax setup
      this.setupBackgroundParallax();
    }

    setupBackgroundParallax() {
      gsap.to('#hero-bg-1', {
        y: -100,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to('#hero-bg-2', {
        y: -150,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      gsap.to('#hero-bg-3', {
        y: -200,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });
    }

    setupScrollAnimations() {
      // Title parallax
      gsap.to('.hero-title', {
        y: -100,
        opacity: 0.5,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Subtitle parallax
      gsap.to('.hero-subtitle', {
        y: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  // Initialize hero animations
  new HeroAnimations();
</script>

<style>
  .hero-title {
    text-shadow: 0 0 30px rgba(0,0,0,0.5);
  }

  .scroll-indicator {
    backdrop-filter: blur(10px);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .scroll-dot {
    animation: float 2s ease-in-out infinite;
  }
</style>
```

Now let me continue creating the remaining components and scripts: 