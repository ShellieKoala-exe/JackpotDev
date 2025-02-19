import { sanitizeInput, InputValidation, AntiBot, Fingerprint } from './security.js';

// Modify form submissions
document.querySelectorAll('form').forEach(form => {
  // Add honeypot
  const honeypot = AntiBot.createHoneypot();
  form.appendChild(honeypot);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Check honeypot
    if (!AntiBot.checkHoneypot(formData)) {
      console.error('Bot detected');
      return;
    }
    
    // Rate limiting
    const fingerprint = await Fingerprint.generate();
    if (!InputValidation.checkRateLimit(fingerprint)) {
      console.error('Rate limit exceeded');
      return;
    }
    
    // Sanitize inputs
    for (const [name, value] of formData.entries()) {
      formData.set(name, sanitizeInput(value));
    }
    
    // Validate email if present
    const email = formData.get('email');
    if (email && !InputValidation.validateEmail(email)) {
      console.error('Invalid email');
      return;
    }
    
    // Add fingerprint to request
    formData.append('fingerprint', fingerprint);
    
    // Submit form
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });
      
      if (!response.ok) throw new Error('Form submission failed');
      
      // Handle success
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });
});

// Theme Management
const themeManager = {
  init() {
    this.loadTheme();
    this.setupThemeToggle();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedColor = localStorage.getItem('themeColor') || 'purple';
    
    document.body.className = `${savedTheme}-theme theme-${savedColor}`;
  },

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('dark-theme', !isDark);
        document.body.classList.toggle('light-theme', isDark);
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
      });
    }
  }
};

// Navigation
const navigation = {
  init() {
    this.setupMobileNav();
    this.highlightCurrentPage();
  },

  setupMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  },

  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
};

// Animations
const animations = {
  init() {
    this.setupScrollAnimations();
  },

  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    });

    animatedElements.forEach(element => observer.observe(element));
  }
};

// Interactive background effect
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.template-1 .project-preview').forEach(preview => {
    preview.addEventListener('mousemove', (e) => {
      const rect = preview.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      preview.style.setProperty('--x', `${x}%`);
      preview.style.setProperty('--y', `${y}%`);
    });
  });
});

// Smooth scroll with custom easing
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Particle system for hero section
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.hero = document.querySelector('.hero');
    
    if (this.hero) {
      this.hero.appendChild(this.canvas);
      this.resize();
      this.init();
      this.animate();
      
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    this.canvas.width = this.hero.offsetWidth;
    this.canvas.height = this.hero.offsetHeight;
  }

  init() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(98, 0, 234, 0.1)';
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

class CustomCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursorFollower = document.createElement('div');
    this.cursor.className = 'cursor';
    this.cursorFollower.className = 'cursor-follower';
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorFollower);
    
    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.speed = 0.1;
    
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      this.cursor.style.display = 'block';
      this.cursorFollower.style.display = 'block';
      this.cursor.style.left = `${this.mouse.x}px`;
      this.cursor.style.top = `${this.mouse.y}px`;
      this.cursor.style.transform = 'translate(-50%, -50%)';
    });
    
    const animate = () => {
      this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
      this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
      
      this.cursorFollower.style.left = `${this.pos.x}px`;
      this.cursorFollower.style.top = `${this.pos.y}px`;
      this.cursorFollower.style.transform = 'translate(-50%, -50%)';
      
      requestAnimationFrame(animate);
    };
    animate();
    
    const interactiveElements = document.querySelectorAll('a, button, input, .service-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }
}

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-animate');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

document.querySelectorAll('.service-card, .hero h1, .hero p').forEach(el => {
  el.classList.add('scroll-animate-init');
  scrollObserver.observe(el);
});

const hero = document.querySelector('.hero');
if (hero) {
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
    </svg>
  `;
  hero.appendChild(scrollIndicator);
}

class EnhancedParticleSystem extends ParticleSystem {
  constructor() {
    super();
    this.mousePos = { x: 0, y: 0 };
    this.addMouseInteraction();
  }
  
  addMouseInteraction() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      const dx = this.mousePos.x - particle.x;
      const dy = this.mousePos.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 100) {
        const force = (100 - dist) / 100;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }
      
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, 'rgba(98, 0, 234, 0.3)');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Modal Management
const modalManager = {
  init() {
    const viewWorkBtn = document.querySelector('.view-work-btn');
    if (viewWorkBtn) {
      viewWorkBtn.addEventListener('click', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = '/portfolio.html';
        }, 300);
      });
    }
  }
};

// Button click animation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn.primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Add clicked class for animation
      this.classList.add('clicked');
      
      // Show loading overlay
      const loadingOverlay = document.querySelector('.loading-overlay');
      loadingOverlay.classList.add('active');
      
      // Remove clicked class after animation
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 600);
      
      // Simulate loading and hide overlay
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
        // Continue with navigation or action
        const href = this.getAttribute('href');
        if (href) window.location.href = href;
      }, 1500);
      
      if (this.getAttribute('href')) {
        e.preventDefault();
      }
    });
  });
});

// Initialize loading overlay
document.addEventListener('DOMContentLoaded', () => {
  const loadingHTML = `
    <div class="loading-overlay">
      <div class="loader"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', loadingHTML);
  
  // Show loading on initial page load
  const loadingOverlay = document.querySelector('.loading-overlay');
  loadingOverlay.classList.add('active');
  
  // Hide loading when page is ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
    }, 500);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  navigation.init();
  animations.init();
  new CustomCursor();
  new EnhancedParticleSystem();
  modalManager.init();

  // Add scroll to bottom functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  // Add parallax effect to hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach((shape, index) => {
        const speed = 1 + index * 0.1;
        const x = (mouseX * 20 * speed);
        const y = (mouseY * 20 * speed);
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }
});