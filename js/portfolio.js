document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
  initFilters();
  initShowcase();
});

function initPortfolio() {
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  // Sample project data - replace with your actual projects
  const projects = [
    {
      title: 'Project 1',
      description: 'Description goes here...',
      category: 'mobile',
      techStack: ['React Native', 'Firebase', 'Node.js']
    },
    // Add more projects here
  ];

  // Generate project cards
  projects.forEach(project => {
    const card = createProjectCard(project);
    portfolioGrid.appendChild(card);
  });
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.category = project.category;
  
  card.innerHTML = `
    <div class="project-preview">
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-stack">
          ${project.techStack.map(tech => `
            <span class="tech-tag">${tech}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    showProjectDetails(project);
  });
  
  return card;
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      projects.forEach(project => {
        if (filter === 'all' || project.dataset.category === filter) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function initShowcase() {
  const showcase = document.querySelector('.portfolio-showcase');
  const closeBtn = showcase.querySelector('.showcase-close');
  
  closeBtn.addEventListener('click', () => {
    showcase.classList.remove('active');
  });
  
  showcase.addEventListener('click', (e) => {
    if (e.target === showcase) {
      showcase.classList.remove('active');
    }
  });
}

function showProjectDetails(project) {
  const showcase = document.querySelector('.portfolio-showcase');
  const details = showcase.querySelector('.showcase-details');
  
  details.innerHTML = `
    <h2>${project.title}</h2>
    <div class="project-description">
      ${project.description}
    </div>
    <div class="project-meta">
      <div class="tech-stack">
        ${project.techStack.map(tech => `
          <span class="tech-tag">${tech}</span>
        `).join('')}
      </div>
    </div>
    <!-- Add more project details as needed -->
  `;
  
  showcase.classList.add('active');
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.portfolio-hero');
  const scrolled = window.pageYOffset;
  hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Add smooth reveal animation for project cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  observer.observe(card);
});
