const loader = document.getElementById("loader");
const typingText = document.getElementById("typing-text");
const yearEl = document.getElementById("year");
const cursorGlow = document.getElementById("cursor-glow");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const line = "Building Intelligent Web Experiences";
let typingIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typingText) return;

  if (!deleting) {
    typingText.textContent = line.slice(0, typingIndex++);
    if (typingIndex > line.length + 8) deleting = true;
  } else {
    typingText.textContent = line.slice(0, typingIndex--);
    if (typingIndex < 0) {
      deleting = false;
      typingIndex = 0;
    }
  }

  const speed = deleting ? 42 : 78;
  window.setTimeout(typeLoop, speed);
}

function revealOnScroll() {
  const revealNodes = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((el) => observer.observe(el));
}

function setupParallax() {
  const items = document.querySelectorAll(".parallax");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    items.forEach((el) => {
      const speed = Number(el.dataset.speed || 0.05);
      el.style.transform = `translateY(${y * speed}px)`;
    });
  });
}

function setupTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 6;
      const rotateX = ((centerY - y) / centerY) * 6;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

function setupCursorGlow() {
  if (!cursorGlow || window.matchMedia("(pointer: coarse)").matches) return;

  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  window.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

function setupParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles.length = 0;
    const count = Math.min(90, Math.floor(width / 18));

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16,228,255,0.75)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(47,139,255,${(1 - dist / 100) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

function setupContactForm() {
  if (!contactForm || !formStatus) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message || !emailValid) {
      formStatus.textContent = "Please enter valid name, email, and message.";
      formStatus.dataset.state = "error";
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formStatus.textContent = "Opening your email client...";
    formStatus.dataset.state = "success";
    window.location.href = `mailto:Athulvcpalazhi@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}

function setupProjectCardNavigation() {
  const cards = document.querySelectorAll("[data-open-url], [data-open-projects]");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const targetUrl = card.dataset.openUrl || "projects.html";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = targetUrl;
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = targetUrl;
    });
  });
}

window.addEventListener("load", () => {
  if (loader) {
    window.setTimeout(() => loader.classList.add("hidden"), 650);
  }

  typeLoop();
  revealOnScroll();
  setupParallax();
  setupTiltCards();
  setupCursorGlow();
  setupParticles();
  setupContactForm();
  setupProjectCardNavigation();

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
