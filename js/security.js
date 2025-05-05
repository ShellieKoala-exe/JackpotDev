// Security utilities for XSS prevention and input sanitization

export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function sanitizeURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch (e) {
    return '';
  }
}

// CSRF Token management
export const CSRFProtection = {
  getToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content;
  },

  addTokenToHeaders(headers = {}) {
    const token = this.getToken();
    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token
      };
    }
    return headers;
  }
};

// Safe HTML template literal tag
export function safeHTML(strings, ...values) {
  const dirty = strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
  
  return DOMPurify.sanitize(dirty);
}

// Rate limiting for form submissions
export const RateLimiter = {
  attempts: new Map(),
  
  checkLimit(key, maxAttempts = 5, timeWindow = 60000) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Clean up old attempts
    const recentAttempts = attempts.filter(timestamp => 
      now - timestamp < timeWindow
    );
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
};

// Input validation helpers
export const Validators = {
  required(value) {
    return value !== undefined && value !== null && value.toString().trim() !== '';
  },
  
  minLength(value, min) {
    return value.length >= min;
  },
  
  maxLength(value, max) {
    return value.length <= max;
  },
  
  pattern(value, regex) {
    return regex.test(value);
  },
  
  number(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
};

// Security headers checker
export function checkSecurityHeaders() {
  const headers = {
    'Content-Security-Policy': true,
    'X-Frame-Options': true,
    'X-Content-Type-Options': true,
    'Referrer-Policy': true,
    'Permissions-Policy': true
  };

  fetch(window.location.href, {
    method: 'HEAD'
  }).then(response => {
    for (const header in headers) {
      if (!response.headers.get(header)) {
        console.warn(`Security header missing: ${header}`);
      }
    }
  });
}

// Initialize security features
document.addEventListener('DOMContentLoaded', () => {
  checkSecurityHeaders();
});
