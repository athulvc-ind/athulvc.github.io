const typingTarget = document.getElementById("typing-text");
const revealNodes = document.querySelectorAll(".reveal");
const tiltNodes = document.querySelectorAll("[data-tilt]");
const spotlightNodes = document.querySelectorAll(".interactive-panel");
const magneticNodes = document.querySelectorAll(".magnetic");
const counterNodes = document.querySelectorAll("[data-counter]");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

let typingLineIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

const typingLines = [
  "Building immersive full stack experiences",
  "JavaScript, Node.js, Express, MongoDB",
  "Focused on clean code and real product impact"
];

function runTyping() {
  if (!typingTarget) return;

  const currentLine = typingLines[typingLineIndex];

  if (!isDeleting) {
    typingTarget.textContent = currentLine.slice(0, typingCharIndex + 1);
    typingCharIndex += 1;

    if (typingCharIndex === currentLine.length) {
      isDeleting = true;
      window.setTimeout(runTyping, 1350);
      return;
    }
  } else {
    typingTarget.textContent = currentLine.slice(0, typingCharIndex - 1);
    typingCharIndex -= 1;

    if (typingCharIndex === 0) {
      isDeleting = false;
      typingLineIndex = (typingLineIndex + 1) % typingLines.length;
    }
  }

  const speed = isDeleting ? 30 : 58;
  window.setTimeout(runTyping, speed);
}

function setupReveals() {
  if (!revealNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.13,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupTilt() {
  if (!tiltNodes.length || window.matchMedia("(hover: none)").matches) return;

  tiltNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * 9;
      const rotateX = (0.5 - py) * 9;

      node.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      node.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    });

    node.addEventListener("pointerleave", () => {
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    });
  });
}

function setupSpotlights() {
  spotlightNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--spot-x", `${x}%`);
      node.style.setProperty("--spot-y", `${y}%`);
    });
  });
}

function setupMagnetic() {
  if (!magneticNodes.length || window.matchMedia("(hover: none)").matches) return;

  magneticNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const strength = 14;
      const dx = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      const dy = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      node.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    });

    node.addEventListener("pointerleave", () => {
      node.style.transform = "translate(0, 0)";
    });
  });
}

function setupCounters() {
  if (!counterNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const node = entry.target;
        const target = Number(node.dataset.counter || 0);
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(target * eased);
          node.textContent = target === 100 ? `${value}%` : `${value}+`;

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          }
        }

        window.requestAnimationFrame(tick);
        observer.unobserve(node);
      });
    },
    {
      threshold: 0.45
    }
  );

  counterNodes.forEach((node) => observer.observe(node));
}

function setupCursor() {
  if (!cursorDot || !cursorRing) return;
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;

  function loop() {
    ringX += (mouseX - ringX) * 0.17;
    ringY += (mouseY - ringY) * 0.17;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    window.requestAnimationFrame(loop);
  }

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  window.requestAnimationFrame(loop);
}

function setupParallaxOrbs() {
  const layers = document.querySelectorAll(".parallax-layer");
  if (!layers.length || window.matchMedia("(hover: none)").matches) return;

  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 10);
      const moveX = -(x * depth);
      const moveY = -(y * depth);
      layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
    });
  });
}

function setupProjectCardNavigation() {
  const cards = document.querySelectorAll("[data-open-url]");
  if (!cards.length) return;

  cards.forEach((card) => {
    const target = card.dataset.openUrl;
    if (!target) return;

    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = target;
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = target;
    });
  });
}

function setupContactForm() {
  if (!form || !formStatus) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message || !emailValid) {
      formStatus.textContent = "Please provide a valid name, email, and message.";
      formStatus.dataset.state = "error";
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    formStatus.textContent = "Opening your email client...";
    formStatus.dataset.state = "success";
    window.location.href = `mailto:Athulvcpalazhi@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

function setupThreeScene() {
  const canvasWrap = document.getElementById("hero-3d");
  if (!canvasWrap || typeof window.THREE === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const width = canvasWrap.clientWidth;
  const height = canvasWrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(width, height);
  canvasWrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 5.6);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0x3a84ff, 1.2);
  directional.position.set(2, 2, 3);
  scene.add(directional);

  const warmLight = new THREE.PointLight(0xff834d, 1.1, 12);
  warmLight.position.set(-2.4, -1.2, 2);
  scene.add(warmLight);

  const knotGeometry = new THREE.TorusKnotGeometry(1.05, 0.28, 180, 30);
  const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e5eff,
    metalness: 0.46,
    roughness: 0.22,
    emissive: 0x132c7e,
    emissiveIntensity: 0.35
  });
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  scene.add(knot);

  const wireGeometry = new THREE.IcosahedronGeometry(1.75, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xff7a47,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const wire = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wire);

  const starsGeo = new THREE.BufferGeometry();
  const starCount = 300;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.74
  });

  const stars = new THREE.Points(starsGeo, starsMaterial);
  scene.add(stars);

  const pointer = { x: 0, y: 0 };

  function onPointerMove(event) {
    const rect = canvasWrap.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  canvasWrap.addEventListener("pointermove", onPointerMove);

  function onResize() {
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onResize);

  let raf = 0;
  function animate() {
    const t = performance.now() * 0.001;

    knot.rotation.x = t * 0.46 + pointer.y * 0.24;
    knot.rotation.y = t * 0.56 + pointer.x * 0.24;
    wire.rotation.x = t * 0.23;
    wire.rotation.y = -t * 0.27;
    stars.rotation.y = -t * 0.045;

    camera.position.x += ((pointer.x * 0.55) - camera.position.x) * 0.04;
    camera.position.y += ((-pointer.y * 0.35) - camera.position.y) * 0.04;

    renderer.render(scene, camera);
    raf = window.requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(raf);
    canvasWrap.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    knotGeometry.dispose();
    knotMaterial.dispose();
    wireGeometry.dispose();
    wireMaterial.dispose();
    starsGeo.dispose();
    starsMaterial.dispose();
  });
}

function setYear() {
  const yearNode = document.getElementById("year");
  if (!yearNode) return;
  yearNode.textContent = new Date().getFullYear().toString();
}

window.addEventListener("load", () => {
  setYear();
  runTyping();
  setupReveals();
  setupTilt();
  setupSpotlights();
  setupMagnetic();
  setupCounters();
  setupCursor();
  setupParallaxOrbs();
  setupProjectCardNavigation();
  setupContactForm();
  setupThreeScene();
});
