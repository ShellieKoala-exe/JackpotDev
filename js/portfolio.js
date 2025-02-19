// Create stars background
function createStars() {
  const container = document.querySelector('.stars-container');
  const starCount = 100;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(star);
  }
}

// Load templates
async function loadTemplates() {
  const templates = [
    'template1.html',
    'template2.html',
    'template3.html',
    'template4.html',
    'template5.html'
  ];

  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  for (let template of templates) {
    try {
      const response = await fetch(`/portfolio-templates/${template}`);
      const html = await response.text();
      const templateContent = new DOMParser().parseFromString(html, 'text/html')
        .querySelector('.portfolio-item').innerHTML;
      
      const article = document.querySelector(`[data-template="${template.replace('.html', '')}"]`);
      if (article) {
        article.innerHTML = templateContent;
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Create stars background
  createStars();
  
  // Show loading animation
  const loadingScreen = document.querySelector('.portfolio-loading');
  
  // Load templates
  loadTemplates().then(() => {
    // Hide loading screen after templates are loaded
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000);
  });
});

// Add scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.portfolio-item').forEach(item => {
  observer.observe(item);
});