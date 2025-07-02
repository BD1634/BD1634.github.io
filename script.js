// Typing animation
function runTyping(el, cursorEl, delay) {
  if (!el) return;
  const text = "I'm Sumanth";
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 120);
    } else if (cursorEl) {
      cursorEl.classList.add('typing-done');
    }
  }
  setTimeout(type, delay);
}
runTyping(document.getElementById('typing-hero'), document.querySelector('.typing-cursor'), 600);
runTyping(document.getElementById('typing-sidebar'), document.querySelector('.typing-cursor-sidebar'), 1200);

// Cursor glow follow (desktop only - no hover on touch)
const cursorGlow = document.querySelector('.cursor-glow');
const isTouch = 'ontouchstart' in window;
if (cursorGlow && !isTouch) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s`;
  observer.observe(el);
});

// Add visible state styles
const style = document.createElement('style');
style.textContent = `
  [data-aos].aos-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('open');
    }
  });
});

// Nav background on scroll
window.addEventListener('scroll', () => {
  if (nav) {
    nav.style.background = window.scrollY > 50 
      ? 'rgba(10, 10, 11, 0.95)' 
      : 'rgba(10, 10, 11, 0.8)';
  }
});
