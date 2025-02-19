document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initScrollEffects();
});

function initAnimations() {
  const cards = document.querySelectorAll('.value-card, .team-member');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  cards.forEach(card => {
    observer.observe(card);
    card.classList.add('fade-in');
  });
}

function initScrollEffects() {
  const timeline = document.querySelector('.timeline');
  
  if (timeline) {
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }
}