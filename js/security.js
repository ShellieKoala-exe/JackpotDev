// Security utilities for XSS prevention and input sanitization

// Strict Content Security Policy
const CSP = {
  init() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' https://trustpilot.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self';
      frame-ancestors 'none';
      form-action 'self';
      base-uri 'self';
      upgrade-insecure-requests;
    `;
    document.head.appendChild(meta);
  }
};

// XSS Protection
export function sanitizeInput(input) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return input.replace(/[&<>"']/g, m => map[m]);
}

// Input validation with rate limiting
export const InputValidation = {
  attempts: new Map(),
  
  checkRateLimit(key, maxAttempts = 5, timeWindow = 60000) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(time => now - time < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  },
  
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  sanitizeURL(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' ? parsed.href : '';
    } catch (e) {
      return '';
    }
  }
};

// Anti-bot protection
export const AntiBot = {
  honeypots: new Set(),
  
  createHoneypot() {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.opacity = '0';
    input.style.position = 'absolute';
    input.style.height = '0';
    input.style.width = '0';
    input.style.zIndex = '-1';
    input.tabIndex = -1;
    input.autocomplete = 'off';
    
    const id = crypto.randomUUID();
    input.name = `hp_${id}`;
    this.honeypots.add(input.name);
    
    return input;
  },
  
  checkHoneypot(formData) {
    for (const [name, value] of formData.entries()) {
      if (this.honeypots.has(name) && value) {
        return false;
      }
    }
    return true;
  }
};

// Anti-debugging protection
export const AntiDebug = {
  init() {
    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Disable DevTools shortcuts
    document.addEventListener('keydown', e => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });
    
    // Detect DevTools opening
    let devtools = function() {};
    devtools.toString = function() {
      this.opened = true;
      return '';
    };
    
    console.log(devtools);
    
    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold || devtools.opened) {
        document.body.innerHTML = 'Developer Tools detected. Please refresh the page.';
      }
    }, 1000);
  }
};

// Browser fingerprinting
export const Fingerprint = {
  async generate() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.pixelDepth,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    ];
    
    const fingerprint = components.join('###');
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprint));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

// CSRF Protection
export const CSRFProtection = {
  token: null,
  
  async init() {
    this.token = await this.generateToken();
    this.addTokenToForms();
  },
  
  async generateToken() {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
  },
  
  addTokenToForms() {
    document.querySelectorAll('form').forEach(form => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'csrf_token';
      input.value = this.token;
      form.appendChild(input);
    });
  },
  
  validate(token) {
    return token === this.token;
  }
};

// Initialize security features
document.addEventListener('DOMContentLoaded', () => {
  CSP.init();
  AntiDebug.init();
  CSRFProtection.init();
  
  // Add security headers checker
  fetch(window.location.href, {
    method: 'HEAD'
  }).then(response => {
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy'
    ];
    
    requiredHeaders.forEach(header => {
      if (!response.headers.get(header)) {
        console.warn(`Security header missing: ${header}`);
      }
    });
  });
});