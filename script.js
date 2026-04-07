// ============================
// Navbar scroll effect & active section
// ============================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Navbar background
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active section highlight
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ============================
// Mobile nav toggle
// ============================
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('active');
});

// Close mobile nav on link click
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('active');
  });
});

// ============================
// Quiz logic
// ============================
let currentQuestion = 0;
let score = 0;
const totalQuestions = 5;
const quizQuestions = document.querySelectorAll('.quiz-question');

document.querySelectorAll('.quiz-option').forEach(button => {
  button.addEventListener('click', function () {
    const question = this.closest('.quiz-question');
    const options = question.querySelectorAll('.quiz-option');
    const feedback = question.querySelector('.quiz-feedback');
    const isCorrect = this.dataset.correct === 'true';

    // Disable all options
    options.forEach(opt => {
      opt.disabled = true;
      if (opt.dataset.correct === 'true') {
        opt.classList.add('correct');
      }
    });

    if (isCorrect) {
      score++;
      feedback.textContent = 'Correct! You may yet survive here.';
      feedback.style.color = '#38a169';
    } else {
      this.classList.add('wrong');
      feedback.textContent = 'Not quite. We\'ll be seeing your ticket soon.';
      feedback.style.color = '#e53e3e';
    }

    // Move to next question after delay
    setTimeout(() => {
      question.classList.remove('active');
      currentQuestion++;
      if (currentQuestion < totalQuestions) {
        quizQuestions[currentQuestion].classList.add('active');
      } else {
        showResults();
      }
    }, 1800);
  });
});

function showResults() {
  document.getElementById('quizResults').style.display = 'block';
  document.getElementById('quizScore').textContent = score;
  const messageEl = document.getElementById('quizMessage');

  if (score === 5) {
    messageEl.textContent = 'Perfect score! You\'ve earned the lasting respect of the entire IT team. We\'ll remember this when you inevitably forget your password.';
  } else if (score >= 3) {
    messageEl.textContent = 'Not bad at all. You clearly paid attention to most of this, which puts you ahead of roughly 80% of previous cohorts.';
  } else {
    messageEl.textContent = 'We appreciate the effort. Perhaps bookmark this page — you may need to revisit it. Possibly more than once.';
  }
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('quizResults').style.display = 'none';
  quizQuestions.forEach((q, i) => {
    q.classList.toggle('active', i === 0);
    q.querySelectorAll('.quiz-option').forEach(opt => {
      opt.disabled = false;
      opt.classList.remove('correct', 'wrong');
    });
    q.querySelector('.quiz-feedback').textContent = '';
  });
}

// ============================
// Org chart node click animation
// ============================
document.querySelectorAll('.org-node').forEach(node => {
  node.addEventListener('click', function (e) {
    // Create ripple effect
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Pulse the node
    this.classList.add('clicked');

    // Delay navigation so animation is visible
    e.preventDefault();
    const href = this.getAttribute('href');
    setTimeout(() => {
      this.classList.remove('clicked');
      window.location.href = href;
    }, 500);
  });
});

// ============================
// Scroll reveal animation
// ============================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .team-card, .agenda-item, .ticket-method, .note-card, .tech-tip, .info-box, .warning-box, .comparison-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// Add revealed class styles
const style = document.createElement('style');
style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Stagger animation for grid items
document.querySelectorAll('.services-grid, .team-grid, .ticket-methods').forEach(grid => {
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = (i * 0.08) + 's';
          child.classList.add('revealed');
        });
        gridObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  gridObserver.observe(grid);
});
