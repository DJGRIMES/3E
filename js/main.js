const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

ready(() => {
  const nav = document.querySelector('.site-nav');
  const fadeSections = document.querySelectorAll('.fade-section');
  const quoteRotator = document.querySelector('[data-quote-rotator]');

  const handleScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (fadeSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeSections.forEach((section) => observer.observe(section));
  }

  if (quoteRotator) {
    const quotes = Array.from(quoteRotator.querySelectorAll('[data-quote]'));
    let activeIndex = 0;

    const showQuote = (index) => {
      quotes.forEach((quote, idx) => {
        quote.classList.toggle('is-active', idx === index);
      });
    };

    if (quotes.length) {
      showQuote(activeIndex);
      setInterval(() => {
        activeIndex = (activeIndex + 1) % quotes.length;
        showQuote(activeIndex);
      }, 6000);
    }
  }
});
