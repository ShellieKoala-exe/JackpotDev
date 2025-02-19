// Create snowflakes
function createSnowflakes() {
  const snowfall = document.querySelector('.snowfall');
  const flakeCount = 100;

  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.style.width = `${Math.random() * 4 + 2}px`;
    flake.style.height = flake.style.width;
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    flake.style.animationDelay = `${Math.random() * 2}s`;
    flake.style.opacity = Math.random() * 0.6 + 0.4;
    snowfall.appendChild(flake);
  }
}

// Create stars
function createStars() {
  const container = document.querySelector('.stars-container');
  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    star.style.width = `${Math.random() * 2 + 1}px`;
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}

// Initialize view work modal
function initViewWorkModal() {
  const viewWorkBtn = document.querySelector('.view-work-btn');
  const modal = document.querySelector('.view-work-modal');
  const backBtn = modal.querySelector('.back-btn');
  const optionBtns = modal.querySelectorAll('.option-btn');

  viewWorkBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  backBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('cancel')) {
        modal.classList.remove('active');
      } else {
        window.location.href = btn.dataset.href;
      }
    });
  });
}

// Initialize loading screen
document.addEventListener('DOMContentLoaded', () => {
  createSnowflakes();
  createStars();
  initViewWorkModal();

  // Enhanced loading screen timing
  setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 800);
  }, 1500);

  // Scroll indicator functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
});