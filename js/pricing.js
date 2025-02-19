document.addEventListener('DOMContentLoaded', () => {
  const billingToggle = document.getElementById('billingToggle');
  const priceElements = document.querySelectorAll('.amount');
  const periodElements = document.querySelectorAll('.period');

  billingToggle.addEventListener('change', (e) => {
    const isAnnual = e.target.checked;
    
    priceElements.forEach(element => {
      const monthlyPrice = element.dataset.monthly;
      const annualPrice = element.dataset.annual;
      element.textContent = isAnnual ? annualPrice : monthlyPrice;
    });

    periodElements.forEach(element => {
      element.textContent = isAnnual ? '/year' : '/month';
    });

    // Animate price change
    priceElements.forEach(element => {
      element.classList.add('price-change');
      setTimeout(() => element.classList.remove('price-change'), 300);
    });
  });
});