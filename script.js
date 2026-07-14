document.addEventListener("DOMContentLoaded", function () {

  // Immediately apply saved accent color
  const initAccent = localStorage.getItem("accent-theme") || "cyan";
  document.documentElement.setAttribute("data-accent", initAccent);


  /* ===== CUSTOM CURSOR + TRAIL ===== */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, trailTimer = 0;

  if (cursorRing) {
    const visor = document.createElement("span");
    visor.className = "cursor-visor-coords";
    visor.id = "cursorVisorCoords";
    visor.textContent = "X: 0 Y: 0";
    cursorRing.appendChild(visor);
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";

    const visorCoords = document.getElementById("cursorVisorCoords");
    if (visorCoords) {
      visorCoords.textContent = `X: ${mouseX} Y: ${mouseY}`;
    }

    trailTimer++;
    const trailToggle = document.getElementById("trailToggle");
    if (trailTimer % 3 === 0 && (!trailToggle || trailToggle.checked)) {
      const trail = document.createElement("div");
      trail.className = "trail-particle";
      const size = Math.random() * 5 + 2;
      trail.style.width = size + "px";
      trail.style.height = size + "px";
      trail.style.left = mouseX + "px";
      trail.style.top = mouseY + "px";
      const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];
      trail.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 800);
    }
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = document.querySelectorAll("a, button, .hsoc, .soc-btn, .proj-card, .service-card, .skill-card, .detail-card, .assign-card, .gal-btn, .gallery-slide, .orbital-icon, .citem, .hstat");
  hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => { cursorDot.classList.add("hovering"); cursorRing.classList.add("hovering"); });
    el.addEventListener("mouseleave", () => { cursorDot.classList.remove("hovering"); cursorRing.classList.remove("hovering"); });
  });

  /* ===== SCROLL PROGRESS ===== */
  const scrollProgress = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (scrollTop / docHeight) * 100 + "%";
  });

  /* ===== DYNAMIC BACKGROUND ENGINES ===== */
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let activeEngine = "network";
  let animationFrameId = null;
  let mouseActive = false;

  // Track mouse active state
  document.addEventListener("mouseenter", () => { mouseActive = true; });
  document.addEventListener("mouseleave", () => { mouseActive = false; });

  function getAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || "#06b6d4";
  }

  function getAccentSecondary() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || "#3b82f6";
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (activeEngine === "network") initNetwork();
    if (activeEngine === "nebula") initNebula();
    if (activeEngine === "matrix") initMatrix();
  }
  window.addEventListener("resize", resizeCanvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /* --- 1. NEURAL WEB (Connected Nodes) --- */
  let netNodes = [];
  function initNetwork() {
    netNodes = [];
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
    for (let i = 0; i < count; i++) {
      netNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accentColor = getAccentColor();
    const accentSec = getAccentSecondary();

    netNodes.forEach(node => {
      if (mouseActive) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.04;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }

      node.vx *= 0.98;
      node.vy *= 0.98;
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0) { node.x = 0; node.vx *= -1; }
      if (node.x > canvas.width) { node.x = canvas.width; node.vx *= -1; }
      if (node.y < 0) { node.y = 0; node.vy *= -1; }
      if (node.y > canvas.height) { node.y = canvas.height; node.vy *= -1; }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = accentColor + "b3";
      ctx.fill();
    });

    for (let i = 0; i < netNodes.length; i++) {
      for (let j = i + 1; j < netNodes.length; j++) {
        const dx = netNodes[i].x - netNodes[j].x;
        const dy = netNodes[i].y - netNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(netNodes[i].x, netNodes[i].y);
          ctx.lineTo(netNodes[j].x, netNodes[j].y);
          const alpha = (1 - dist / 150).toFixed(2);
          ctx.strokeStyle = accentColor + Math.floor(alpha * 70).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    if (mouseActive && mouseX > 0 && mouseY > 0) {
      netNodes.forEach(node => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseX, mouseY);
          const alpha = (1 - dist / 180).toFixed(2);
          ctx.strokeStyle = accentSec + Math.floor(alpha * 60).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
    }
  }

  /* --- 2. CYBER GRID (3D Synthwave) --- */
  let gridOffset = 0;
  function drawCyberGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accentColor = getAccentColor();
    const horizon = canvas.height * 0.45;
    const speed = 1.2;
    gridOffset = (gridOffset + speed) % 40;

    const mouseOffsetX = mouseActive ? (mouseX - canvas.width / 2) * 0.1 : 0;
    const vpX = canvas.width / 2 + mouseOffsetX;

    const totalHorizLines = 25;
    for (let i = 0; i < totalHorizLines; i++) {
      const py = horizon + Math.pow(i / totalHorizLines, 2.5) * (canvas.height - horizon) + gridOffset * (i / totalHorizLines);
      if (py > canvas.height) continue;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(canvas.width, py);
      const alpha = Math.min(1, Math.pow(i / totalHorizLines, 2)).toFixed(2);
      ctx.strokeStyle = accentColor + Math.floor(alpha * 30).toString(16).padStart(2, '0');
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const totalVertLines = 36;
    for (let i = -totalVertLines / 2; i <= totalVertLines / 2; i++) {
      const xBase = canvas.width / 2 + i * 80;
      ctx.beginPath();
      ctx.moveTo(vpX, horizon);
      ctx.lineTo(xBase + (mouseActive ? (mouseX - canvas.width / 2) * 0.05 : 0), canvas.height);
      const grad = ctx.createLinearGradient(0, horizon, 0, canvas.height);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, accentColor + "05");
      grad.addColorStop(1, accentColor + "2d");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const gradHorizon = ctx.createLinearGradient(vpX - 200, horizon, vpX + 200, horizon);
    gradHorizon.addColorStop(0, "transparent");
    gradHorizon.addColorStop(0.5, accentColor + "80");
    gradHorizon.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(canvas.width, horizon);
    ctx.strokeStyle = gradHorizon;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /* --- 3. COSMIC NEBULA (Starfield) --- */
  let stars = [];
  const maxStars = 120;
  function initNebula() {
    stars = [];
    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
        pz: 0,
        radius: Math.random() * 1.5 + 0.5
      });
    }
  }

  function drawNebula() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    ctx.fillStyle = isLight ? "rgba(248, 250, 252, 0.25)" : "rgba(3, 7, 18, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accentColor = getAccentColor();
    const accentSec = getAccentSecondary();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const targetCX = mouseActive ? cx + (mouseX - cx) * 0.12 : cx;
    const targetCY = mouseActive ? cy + (mouseY - cy) * 0.12 : cy;

    stars.forEach(star => {
      star.pz = star.z;
      star.z -= 4;

      if (star.z <= 0) {
        star.z = canvas.width;
        star.x = (Math.random() - 0.5) * canvas.width * 2;
        star.y = (Math.random() - 0.5) * canvas.height * 2;
        star.pz = star.z;
      }

      const px = (star.x / star.z) * cx + targetCX;
      const py = (star.y / star.z) * cy + targetCY;
      const ppx = (star.x / star.pz) * cx + targetCX;
      const ppy = (star.y / star.pz) * cy + targetCY;

      const size = (1 - star.z / canvas.width) * 3;

      ctx.beginPath();
      ctx.moveTo(ppx, ppy);
      ctx.lineTo(px, py);

      const alpha = (1 - star.z / canvas.width).toFixed(2);
      ctx.strokeStyle = (star.radius > 1.2 ? accentColor : accentSec) + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = size * star.radius;
      ctx.stroke();
    });
  }

  /* --- 4. DIGITAL RAIN (Matrix) --- */
  let mColumns = 0;
  let mDrops = [];
  const mChars = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+-/<>:;[]{}".split("");
  function initMatrix() {
    const fontSize = 16;
    mColumns = Math.floor(canvas.width / fontSize);
    mDrops = new Array(mColumns).fill(1).map(() => Math.floor(Math.random() * -50));
  }

  function drawMatrix() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    ctx.fillStyle = isLight ? "rgba(248, 250, 252, 0.15)" : "rgba(3, 7, 18, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accentColor = getAccentColor();
    const fontSize = 16;
    ctx.font = "bold " + fontSize + "px monospace";

    for (let i = 0; i < mDrops.length; i++) {
      const char = mChars[Math.floor(Math.random() * mChars.length)];
      const x = i * fontSize;
      const y = mDrops[i] * fontSize;

      if (mDrops[i] >= 0) {
        if (Math.random() > 0.88) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = accentColor;
        }
        ctx.fillText(char, x, y);
      }

      if (y > canvas.height && Math.random() > 0.975) {
        mDrops[i] = 0;
      }
      mDrops[i]++;
    }
  }

  /* --- 5. AURORA WAVES (Bioluminescence) --- */
  let waveTime = 0;
  function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waveTime += 0.003;

    const accentColor = getAccentColor();
    const accentSec = getAccentSecondary();

    ctx.globalCompositeOperation = "screen";

    const drawWave = (amplitude, frequency, speedCoeff, color, heightOffset) => {
      ctx.beginPath();
      const t = waveTime * speedCoeff;
      for (let x = 0; x < canvas.width; x += 10) {
        const y = canvas.height * heightOffset + 
                  Math.sin(x * frequency + t) * amplitude + 
                  Math.cos(x * (frequency * 0.5) - t) * (amplitude * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, color + "26");
      grad.addColorStop(0.7, color + "1a");
      grad.addColorStop(1, "transparent");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 15;
      ctx.stroke();

      ctx.shadowBlur = 40;
      ctx.shadowColor = color;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawWave(80, 0.002, 1.5, accentColor, 0.45);
    drawWave(110, 0.0015, -1.2, accentSec, 0.5);
    drawWave(70, 0.0025, 0.8, "#8b5cf6", 0.55);

    ctx.globalCompositeOperation = "source-over";
  }

  /* --- Engine Loop & Switching --- */
  const engines = {
    network: { init: initNetwork, draw: drawNetwork },
    grid: { init: () => {}, draw: drawCyberGrid },
    nebula: { init: initNebula, draw: drawNebula },
    matrix: { init: initMatrix, draw: drawMatrix },
    aurora: { init: () => {}, draw: drawAurora }
  };

  let lastTime = 0;
  let matrixTimer = 0;

  function engineLoop(timestamp) {
    if (!timestamp) timestamp = 0;

    if (activeEngine === "matrix") {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      matrixTimer += delta;
      if (matrixTimer >= 60) {
        engines.matrix.draw();
        matrixTimer = 0;
      }
    } else {
      engines[activeEngine].draw();
    }
    animationFrameId = requestAnimationFrame(engineLoop);
  }

  function switchEngine(name) {
    if (!engines[name]) return;
    activeEngine = name;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (engines[name].init) {
      engines[name].init();
    }
  }

  // Set up default engine
  switchEngine("network");
  engineLoop();

  /* ===== FX PANEL CONTROLLER ===== */
  const fxPanel = document.getElementById("fxPanel");
  const fxPanelToggle = document.getElementById("fxPanelToggle");
  const bgBtns = document.querySelectorAll(".fx-opt-btn");
  const accentBtns = document.querySelectorAll(".fx-color-btn");
  const trailToggle = document.getElementById("trailToggle");
  const tiltToggle = document.getElementById("tiltToggle");

  if (fxPanelToggle && fxPanel) {
    fxPanelToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      fxPanel.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!fxPanel.contains(e.target)) {
        fxPanel.classList.remove("active");
      }
    });
  }

  bgBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      bgBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      switchEngine(btn.dataset.bg);
    });
  });

  accentBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      accentBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.documentElement.setAttribute("data-accent", btn.dataset.accent);
      localStorage.setItem("accent-theme", btn.dataset.accent);
    });
  });

  // Load saved settings
  const savedAccent = localStorage.getItem("accent-theme") || "cyan";
  document.documentElement.setAttribute("data-accent", savedAccent);
  const activeAccentBtn = document.querySelector(`.fx-color-btn[data-accent="${savedAccent}"]`);
  if (activeAccentBtn) {
    accentBtns.forEach(b => b.classList.remove("active"));
    activeAccentBtn.classList.add("active");
  }

  const savedTrail = localStorage.getItem("fx-trail") !== "false";
  if (trailToggle) {
    trailToggle.checked = savedTrail;
    trailToggle.addEventListener("change", () => {
      localStorage.setItem("fx-trail", trailToggle.checked);
    });
  }

  const savedTilt = localStorage.getItem("fx-tilt") !== "false";
  if (tiltToggle) {
    tiltToggle.checked = savedTilt;
    tiltToggle.addEventListener("change", () => {
      localStorage.setItem("fx-tilt", tiltToggle.checked);
    });
  }

  /* ===== CARD MOUSE-GLOW COORDINATE TRACKER ===== */
  const allCards = document.querySelectorAll(".service-card, .proj-card, .skill-card, .detail-card, .hstat, .exp-card, .tl-card");
  allCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* ===== FLOATING PARTICLES ===== */
  const bgEffects = document.getElementById("bgEffects");
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 25 + "s";
    particle.style.animationDuration = 20 + Math.random() * 15 + "s";
    const pColors = ["#06b6d4", "#3b82f6", "#f59e0b"];
    particle.style.background = pColors[Math.floor(Math.random() * pColors.length)];
    bgEffects.appendChild(particle);
  }


  /* ===== NAVBAR (ALWAYS VISIBLE) ===== */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navbarLinks = document.getElementById("navbarLinks");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navbarLinks.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navbarLinks.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 100);

    let current = "";
    document.querySelectorAll("section").forEach(section => {
      if (scrollY >= section.offsetTop - 150) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  /* ===== THEME TOGGLE ===== */
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.innerHTML = savedTheme === "dark"
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';

  themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.innerHTML = newTheme === "dark"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  });

  /* ===== MUSIC TOGGLE ===== */
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  let isMusicPlaying = false;

  musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      musicToggle.classList.remove("playing");
    } else {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(() => { });
      musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      musicToggle.classList.add("playing");
    }
    isMusicPlaying = !isMusicPlaying;
  });

  /* ===== TYPING EFFECT ===== */
  const roles = [
    "Software Engineer.",
    "Java Developer.",
    "Web Developer.",
    "Frontend Developer.",
    "Backend Developer.",
    "Full-Stack Developer.",
    "UI/UX Engineer.",
    "Content Creator."
  ];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const roleText = document.getElementById("roleText");

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      roleText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  setTimeout(typeEffect, 2500);

  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll(".hstat-num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-count"));
        let count = 0;
        const increment = target / 60;
        const updateCounter = () => {
          count += increment;
          if (count < target) {
            entry.target.textContent = Math.ceil(count);
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target;
          }
        };
        updateCounter();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  /* ===== REVEAL ON SCROLL ===== */
  const revealElements = document.querySelectorAll(".reveal, .reveal-scale, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  revealElements.forEach(el => revealObserver.observe(el));

  /* ===== SKILL TABS ===== */
  const skillTabs = document.querySelectorAll(".skill-tab-btn");
  const skillContents = document.querySelectorAll(".skills-content");

  skillTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      skillTabs.forEach(t => t.classList.remove("active"));
      skillContents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");

      setTimeout(() => {
        const activeFills = document.querySelectorAll(`#${tab.dataset.tab} .skill-fill`);
        activeFills.forEach(fill => {
          fill.style.width = "0";
          setTimeout(() => {
            fill.style.width = fill.dataset.width + "%";
          }, 100);
        });
      }, 50);
    });
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute("data-width") + "%";
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".skills-content.active .skill-fill").forEach(fill => skillObserver.observe(fill));

  /* ===== 3D TILT EFFECT ===== */
  const tiltCards = document.querySelectorAll(".service-card, .proj-card, .skill-card, .detail-card, .hstat, .exp-card, .tl-card");
  tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const tiltToggle = document.getElementById("tiltToggle");
      if (tiltToggle && !tiltToggle.checked) {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        return;
      }
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });


  /* ===== RIPPLE EFFECT ===== */
  const rippleButtons = document.querySelectorAll(".btn-primary, .btn-outline, .btn-submit, .gal-btn, .skill-tab-btn");
  rippleButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ===== MAGNETIC BUTTONS ===== */
  const magneticBtns = document.querySelectorAll(".btn-primary, .btn-outline");
  magneticBtns.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

  /* ===== GALLERY CAROUSEL ===== */
  const galleryCarousel = document.getElementById("galleryCarousel");
  const galPrev = document.getElementById("galPrev");
  const galNext = document.getElementById("galNext");
  const galPause = document.getElementById("galPause");

  const galleryImages = [
    "assest/Gallery/01.JPG", "assest/Gallery/02.jpeg", "assest/Gallery/03.JPG",
    "assest/Gallery/04.jpg", "assest/Gallery/05.JPG", "assest/Gallery/06.png",
    "assest/Gallery/07.JPG", "assest/Gallery/08.JPG", "assest/Gallery/09.JPG",
    "assest/Gallery/10.JPG", "assest/Gallery/11.JPG", "assest/Gallery/12.JPG",
    "assest/Gallery/13.jpg", "assest/Gallery/14.JPG", "assest/Gallery/15.jpg",
    "assest/Gallery/16.jpg", "assest/Gallery/17.jpg", "assest/Gallery/18.jpg",
    "assest/Gallery/19.JPG", "assest/Gallery/20.jpg"
  ];

  let currentIndex = 0;
  let autoSlideInterval;
  let isPaused = false;

  galleryImages.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";
    slide.innerHTML = `
            <img src="${src}" alt="Gallery Image ${index + 1}" loading="lazy">
            <div class="gal-overlay"><i class="fa-solid fa-expand"></i></div>
        `;
    slide.addEventListener("click", () => openLightbox(index));
    galleryCarousel.appendChild(slide);
  });

  const slides = document.querySelectorAll(".gallery-slide");

  function updateGallery() {
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next", "prev-hidden", "next-hidden");
      if (index === currentIndex) {
        slide.classList.add("active");
      } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
        slide.classList.add("prev");
      } else if (index === (currentIndex + 1) % slides.length) {
        slide.classList.add("next");
      } else if (index < currentIndex) {
        slide.classList.add("prev-hidden");
      } else {
        slide.classList.add("next-hidden");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateGallery();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateGallery();
  }

  function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 4000); }
  function stopAutoSlide() { clearInterval(autoSlideInterval); }

  galNext.addEventListener("click", () => { nextSlide(); if (!isPaused) { stopAutoSlide(); startAutoSlide(); } });
  galPrev.addEventListener("click", () => { prevSlide(); if (!isPaused) { stopAutoSlide(); startAutoSlide(); } });

  galPause.addEventListener("click", () => {
    isPaused = !isPaused;
    if (isPaused) {
      stopAutoSlide();
      galPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
      startAutoSlide();
      galPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  });

  let touchStartX = 0;
  const galleryContainer = document.querySelector(".gallery-container");
  galleryContainer.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  galleryContainer.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide(); else prevSlide();
      if (!isPaused) { stopAutoSlide(); startAutoSlide(); }
    }
  }, { passive: true });

  updateGallery();
  startAutoSlide();

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    lightbox.classList.add("active");
    lbImg.src = galleryImages[index];
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById("lbPrev").addEventListener("click", () => { lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length; lbImg.src = galleryImages[lbIndex]; });
  document.getElementById("lbNext").addEventListener("click", () => { lbIndex = (lbIndex + 1) % galleryImages.length; lbImg.src = galleryImages[lbIndex]; });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") { lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length; lbImg.src = galleryImages[lbIndex]; }
    if (e.key === "ArrowRight") { lbIndex = (lbIndex + 1) % galleryImages.length; lbImg.src = galleryImages[lbIndex]; }
  });

  /* ===== BACK TO TOP ===== */
  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", () => { backTop.classList.toggle("visible", window.scrollY > 500); });
  backTop.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formNote = document.getElementById("formNote");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    try {
      const response = await fetch("https://formsubmit.co/ajax/wggachathungabimsara2007@gmail.com", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        formNote.textContent = "✓ Message sent successfully! I will reply soon.";
        formNote.className = "form-note success";
        contactForm.reset();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      formNote.textContent = "✗ Something went wrong. Please try again.";
      formNote.className = "form-note error";
    }
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Send Message</span>';
    submitBtn.disabled = false;
    setTimeout(() => (formNote.textContent = ""), 5000);
  });

  /* ===== CHATBOT ===== */
  const GEMINI_API_KEY = ""; // Hardcoded key removed for security. Configured via UI settings.

  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");
  
  // API Key Overlay Elements
  const chatbotKeyBtn = document.getElementById("chatbotKeyBtn");
  const chatbotKeyOverlay = document.getElementById("chatbotKeyOverlay");
  const chatbotKeyInput = document.getElementById("chatbotKeyInput");
  const chatbotKeySaveBtn = document.getElementById("chatbotKeySaveBtn");
  const chatbotKeyCancelBtn = document.getElementById("chatbotKeyCancelBtn");
  const keyToggleVisible = document.getElementById("keyToggleVisible");

  chatbotToggle.addEventListener("click", () => {
    chatbotWindow.classList.toggle("active");
    if (chatbotWindow.classList.contains("active")) {
      const storedKey = localStorage.getItem("gemini_api_key");
      if (!storedKey) {
        chatbotKeyInput.value = "";
        chatbotKeyOverlay.classList.add("active");
        setTimeout(() => chatbotKeyInput.focus(), 150);
      } else {
        chatbotKeyOverlay.classList.remove("active");
      }
    }
  });

  chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.remove("active");
  });

  chatbotKeyBtn.addEventListener("click", () => {
    const storedKey = localStorage.getItem("gemini_api_key");
    chatbotKeyInput.value = storedKey || "";
    chatbotKeyOverlay.classList.toggle("active");
    if (chatbotKeyOverlay.classList.contains("active")) {
      setTimeout(() => chatbotKeyInput.focus(), 150);
    }
  });

  chatbotKeyCancelBtn.addEventListener("click", () => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (!storedKey) {
      chatbotWindow.classList.remove("active");
    } else {
      chatbotKeyOverlay.classList.remove("active");
    }
  });

  chatbotKeySaveBtn.addEventListener("click", saveApiKey);
  chatbotKeyInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveApiKey();
  });

  function saveApiKey() {
    const key = chatbotKeyInput.value.trim();
    if (key) {
      localStorage.setItem("gemini_api_key", key);
      chatbotKeyOverlay.classList.remove("active");
      addMessage("⚡ Gemini API key saved! How can I help you?", false);
    } else {
      alert("Please enter a valid Gemini API key!");
    }
  }

  keyToggleVisible.addEventListener("click", () => {
    const type = chatbotKeyInput.type === "password" ? "text" : "password";
    chatbotKeyInput.type = type;
    const icon = keyToggleVisible.querySelector("i");
    if (type === "password") {
      icon.className = "fa-solid fa-eye";
    } else {
      icon.className = "fa-solid fa-eye-slash";
    }
  });

  function addMessage(text, isUser) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${isUser ? "user" : "bot"}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const chatbotContext = {
    lastQuery: null,
    greetingsCount: 0
  };

  function getSmartResponse(message) {
    const msg = message.toLowerCase().trim();
    
    if (msg.match(/^(hi|hello|hey|hii|yo|hola|halw)$/)) {
      chatbotContext.greetingsCount++;
      if (chatbotContext.greetingsCount > 2) {
        return "Hello again! How can I help you? I'm ready to answer questions about Chathunga's skills, projects, and contact info. 😊";
      }
      return "Hello! 👋 I'm Chathunga Bimsara's AI Assistant. Ask me anything about his programming skills, education, or projects!";
    }

    if (msg.includes("skill") || msg.includes("tech") || msg.includes("languages") || msg.includes("what can you do") || msg.includes("know")) {
      chatbotContext.lastQuery = "skills";
      return "💡 Chathunga is experienced in multiple domains:\n\n• Programming: Java (95%), JavaScript (85%), HTML/CSS (90%), Python (75%)\n• Tools & Config: Git, GitHub, VS Code, IntelliJ, Docker (65%)\n• Database Systems: MySQL (95%), PostgreSQL (70%)\n• Design: Figma (85%), Adobe Photoshop (70%), Premiere Pro (80%)\n\nWhich of these would you like to know more about?";
    }

    if (msg.includes("project") || msg.includes("work") || msg.includes("developed") || msg.includes("code") || msg.includes("built")) {
      chatbotContext.lastQuery = "projects";
      return "📁 Here are Chathunga's main projects:\n\n1. 🗃️ Stock System: A CLI-based Java stock inventory controller.\n2. 🎮 Connect 4 Game: Local two-player graphical board game in Java.\n3. 💪 Flex Gym System: Desktop app built with MVC architecture and MySQL.\n\nYou can click on any card in the Projects section to open a detailed Case Study modal directly on this page!";
    }

    if (msg.includes("education") || msg.includes("study") || msg.includes("college") || msg.includes("ijse") || msg.includes("school") || msg.includes("qualification")) {
      return "📚 Education & Academic Background:\n\n• HND in Software Engineering: Pursuing at Institute of Java Software Engineering (IJSE) (2025-Present).\n• Diploma in English: Completed at Sri Lanka English Graduate's Association (SLEGA) (2025).\n• G/ Ethkandura Seewali M.V. National College: Completed G.C.E. Ordinary Levels (2017-2024).";
    }

    if (msg.includes("contact") || msg.includes("phone") || msg.includes("email") || msg.includes("whatsapp") || msg.includes("hire") || msg.includes("reach") || msg.includes("message")) {
      return "📧 Let's get in touch! Here are Chathunga's direct contact details:\n\n• Email: wggachathungabimsara2007@gmail.com\n• Phone & WhatsApp: +94 76 794 5968\n• Location: Galle, Sri Lanka 🇱🇰\n\nYou can also send a message directly using the contact form on this page! I will reply as soon as possible.";
    }

    if (msg.includes("github") || msg.includes("stats") || msg.includes("profile")) {
      return "🐙 Chathunga is very active on GitHub! You can view his profile and open source contributions at: github.com/chathunga2007\n\nI have also loaded his live GitHub repository statistics in the About section on this page! Go check it out.";
    }

    if (msg.includes("about") || msg.includes("who is") || msg.includes("chathunga") || msg.includes("name") || msg.includes("who are you")) {
      return "👨‍💻 I'm the AI assistant for Chathunga Bimsara. He is a passionate 18-year-old Undergraduate Software Engineer based in Galle, Sri Lanka. He focuses on building robust backend services in Java and responsive, interactive frontend experiences in modern CSS and JavaScript.";
    }

    if (msg.includes("service") || msg.includes("offer") || msg.includes("do for me")) {
      return "💼 Services offered by Chathunga:\n\n• Full-stack Web Development (HTML/CSS/JS)\n• Java Desktop & Core Application Engineering\n• Database Architecture & Query Optimizations (MySQL/PostgreSQL)\n• Responsive Mobile-first Design Integration\n• Video Editing (Premiere Pro) & Layout Design (Figma)";
    }

    if (msg.includes("cv") || msg.includes("resume") || msg.includes("download")) {
      return "📄 You can download Chathunga's full resume / CV by clicking the 'Download CV' button in the Hero section at the top of the page!";
    }

    if (msg.includes("age") || msg.includes("birthday") || msg.includes("born")) {
      return "🎂 Chathunga Bimsara was born on November 02, 2007. He is currently 18 years old.";
    }

    if (chatbotContext.lastQuery === "skills" && (msg.includes("java") || msg.includes("javascript") || msg.includes("python") || msg.includes("html") || msg.includes("css"))) {
      chatbotContext.lastQuery = null;
      return "☕ Great focus! Java is Chathunga's primary language (95% proficiency). He uses it for OOP systems, desktop tools, and MVC database architectures. JavaScript is his secondary scripting choice (85% proficiency) for responsive and dynamic client-side animations (like the ones running on this background!).";
    }

    if (chatbotContext.lastQuery === "projects" && (msg.includes("stock") || msg.includes("connect") || msg.includes("gym"))) {
      chatbotContext.lastQuery = null;
      return "💡 Excellent! Those are Java-based systems. Flex Gym utilizes MySQL databases and MVC design, Stock System runs cleanly on CLI file-cache transaction queues, and Connect 4 showcases GUI programming using AWT/Swing libraries. Check the details cards for links to source codes!";
    }

    if (msg.includes("thank") || msg.includes("great") || msg.includes("nice") || msg.includes("awesome") || msg.includes("good")) {
      return "You're welcome! 😊 I'm always happy to assist. Let me know if you need any other information about Chathunga's career or qualifications.";
    }

    if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you")) {
      return "Goodbye! 👋 Thanks for visiting the portfolio. Have a productive day!";
    }

    return "I'm not fully sure how to answer that 😅 But I can help you with:\n\n• 💡 Chathunga's skills & tool proficiency\n• 📁 Main projects and case study details\n• 📚 Academic credentials & education\n• 📞 Contact information & direct channels\n• 📄 Download instructions for his CV\n\nFeel free to ask a direct question about these topics or contact him via email: wggachathungabimsara2007@gmail.com";
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = "";

    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const apiKey = localStorage.getItem("gemini_api_key");
    if (apiKey) {
      try {
        const sysInstruction = `You are the personal AI assistant for Chathunga Bimsara, a 18-year-old Undergraduate Software Engineer from Galle, Sri Lanka. You can answer any questions the user asks, including general queries, programming problems, or about Chathunga himself. Answer questions politely and intelligently. If asked about Chathunga, base your answers on his profile details: HND in Software Engineering at IJSE (2025-Present), English Diploma at SLEGA (2025), skills in Java (95%), Python (75%), JavaScript (85%), HTML/CSS (90%), MySQL (95%), PostgreSQL (70%). Direct users to download his CV or use the contact form when relevant. Keep your replies concise and very friendly.`;
        
        const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${sysInstruction}\n\nUser Question: ${message}` }]
              }
            ]
          })
        });

        typing.remove();
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status} - ${errText}`);
        }
        
        const resData = await response.json();
        const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm, Gemini could not formulate a reply. Please try again.";
        addMessage(reply, false);

      } catch (err) {
        console.error("Gemini AI API failure, falling back: ", err);
        // Show raw error so the developer can see the exact cause
        addMessage(`⚠️ API Error: ${err.message}. Using offline backup chatbot...\n\n` + getSmartResponse(message), false);
      }
    } else {
      setTimeout(() => {
        typing.remove();
        addMessage("⚠️ Gemini API Key is not configured. Please add your key in script.js to enable the online chatbot. Falling back to offline responses:\n\n" + getSmartResponse(message), false);
      }, 800 + Math.random() * 600);
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });

  /* ===== PERFORMANCE ===== */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(engineLoop);
    }
  });

  /* ===== 3D SKILLS SPHERE CANVAS ===== */
  const sphereCanvas = document.getElementById("skillsSphereCanvas");
  if (sphereCanvas) {
    const sCtx = sphereCanvas.getContext("2d");
    
    const sphereTags = ["Java", "Python", "JavaScript", "HTML5", "CSS3", "SQL", "MySQL", "PostgreSQL", "Git", "GitHub", "Docker", "VS Code", "IntelliJ", "Figma", "Photoshop", "Premiere"];
    const tagSphereObjects = [];
    const sphereRadius = 125;
    let sphereRX = 0.003;
    let sphereRY = 0.003;
    let sphereMouseX = 0;
    let sphereMouseY = 0;
    let isMouseOverSphere = false;
    let sphereFrameId = null;

    function resizeSphereCanvas() {
      const rect = sphereCanvas.parentElement.getBoundingClientRect();
      sphereCanvas.width = rect.width || 300;
      sphereCanvas.height = rect.width || 300;
    }
    resizeSphereCanvas();
    window.addEventListener("resize", resizeSphereCanvas);

    function initTagSphere() {
      tagSphereObjects.length = 0;
      const count = sphereTags.length;
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        tagSphereObjects.push({
          text: sphereTags[i],
          x: sphereRadius * Math.cos(theta) * Math.sin(phi),
          y: sphereRadius * Math.sin(theta) * Math.sin(phi),
          z: sphereRadius * Math.cos(phi),
          x2d: 0,
          y2d: 0,
          scale: 1,
          alpha: 1
        });
      }
    }
    initTagSphere();

    function rotateSphereX(tag, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = tag.y * cos - tag.z * sin;
      const z = tag.z * cos + tag.y * sin;
      tag.y = y;
      tag.z = z;
    }

    function rotateSphereY(tag, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = tag.x * cos - tag.z * sin;
      const z = tag.z * cos + tag.x * sin;
      tag.x = x;
      tag.z = z;
    }

    sphereCanvas.addEventListener("mousemove", (e) => {
      isMouseOverSphere = true;
      const rect = sphereCanvas.getBoundingClientRect();
      sphereMouseX = e.clientX - rect.left - sphereCanvas.width / 2;
      sphereMouseY = e.clientY - rect.top - sphereCanvas.height / 2;
    });

    sphereCanvas.addEventListener("mouseleave", () => {
      isMouseOverSphere = false;
    });

    function drawSphereLoop() {
      sCtx.clearRect(0, 0, sphereCanvas.width, sphereCanvas.height);
      
      const accentColor = getAccentColor();

      if (isMouseOverSphere) {
        sphereRX = -sphereMouseY * 0.0001;
        sphereRY = sphereMouseX * 0.0001;
      } else {
        sphereRX += (0.003 - sphereRX) * 0.05;
        sphereRY += (0.003 - sphereRY) * 0.05;
      }

      tagSphereObjects.forEach(tag => {
        rotateSphereX(tag, sphereRX);
        rotateSphereY(tag, sphereRY);

        const fov = 300;
        const scale = fov / (fov + tag.z);
        tag.scale = scale;
        tag.alpha = (scale - 0.4) * 1.5;
        tag.x2d = tag.x * scale + sphereCanvas.width / 2;
        tag.y2d = tag.y * scale + sphereCanvas.height / 2;
      });

      const sortedTags = [...tagSphereObjects].sort((a, b) => b.z - a.z);

      sortedTags.forEach(tag => {
        if (tag.alpha <= 0) return;
        const size = Math.floor(13 * tag.scale) + 8;
        sCtx.font = `bold ${size}px "Orbitron", sans-serif`;
        sCtx.textAlign = "center";
        sCtx.textBaseline = "middle";

        const alphaHex = Math.min(255, Math.max(0, Math.floor(tag.alpha * 255))).toString(16).padStart(2, '0');
        sCtx.fillStyle = accentColor + alphaHex;

        if (tag.scale > 1) {
          sCtx.shadowBlur = 10;
          sCtx.shadowColor = accentColor;
        } else {
          sCtx.shadowBlur = 0;
        }

        sCtx.fillText(tag.text, tag.x2d, tag.y2d);
      });
      sCtx.shadowBlur = 0;

      sphereFrameId = requestAnimationFrame(drawSphereLoop);
    }
    drawSphereLoop();
  }

  /* ===== PROJECT MODALS WIRING ===== */
  const projModal = document.getElementById("projModal");
  const projModalClose = document.getElementById("projModalClose");
  const projModalOverlay = document.getElementById("projModalOverlay");
  const projectCards = document.querySelectorAll(".proj-card-link");

  const projectDetails = {
    stock: {
      title: "Stock System",
      type: "Terminal Application",
      desc: "A powerful, clean, terminal-based inventory management system developed in Java. It allows businesses to track warehouse inventory levels, manage supplier catalogs, run detailed sales/refill updates, and output analytical stock reports in real-time.",
      features: [
        "Interactive CLI dashboard with custom commands",
        "Fast memory-based caching of stock elements",
        "Supplier profiles and product relationship mapping",
        "Detailed transactions log file system outputs",
        "Threshold alerts for low-stock inventory"
      ],
      tech: ["Java", "Collections", "OOP Principles", "File I/O", "Markdown Repos"],
      git: "https://github.com/chathunga2007/PRF-Project",
      demo: "#",
      img: "assest/terminal.png"
    },
    connect4: {
      title: "Connect 4 Game",
      type: "Entertainment Application",
      desc: "A fully features, desktop-based graphical board game of Connect Four built using Java and Object-Oriented programming principles. Implements double-player matchmaker configurations and high-speed victory coordinate validation algorithms.",
      features: [
        "Interactive gameplay UI with color indications",
        "Double-player local matchup mode support",
        "Custom grid column drops verification logic",
        "Horizontal, vertical, and diagonal win detection",
        "Replay, grid reset, and scoreboard histories"
      ],
      tech: ["Java", "OOP Design Patterns", "UI Swing/AWT", "Vector Math"],
      git: "https://github.com/chathunga2007/Connect_Four_Game-Assignment-OOP-",
      demo: "#",
      img: "assest/connect 4.png"
    },
    gym: {
      title: "Flex Gym System",
      type: "Standalone Application",
      desc: "A comprehensive Gym Membership Management desktop application built using Java MVC architecture. Provides gym administrators with a dashboard to manage memberships, process monthly fees, track check-ins, and analyze business revenue streams.",
      features: [
        "Strict Model-View-Controller (MVC) architecture",
        "Secure database operations and membership states",
        "Member profile creation, fee logs, and registration plans",
        "Reporting panels with interactive billing summaries",
        "Automated notifications for billing dues and packages expiration"
      ],
      tech: ["Java", "MySQL", "MVC Architecture", "OOP Patterns", "Jasper Reports"],
      git: "https://github.com/chathunga2007/Gym_Membership_Management_System-1st-Semester-Final-Project-Using-MVC-Architecture-",
      demo: "#",
      img: "assest/flex gym.png"
    }
  };

  projectCards.forEach(card => {
    card.addEventListener("click", (e) => {
      const projKey = card.dataset.proj;
      if (projKey && projectDetails[projKey]) {
        e.preventDefault();
        const data = projectDetails[projKey];
        
        document.getElementById("projModalTitle").textContent = data.title;
        document.getElementById("projModalType").textContent = data.type;
        document.getElementById("projModalDesc").textContent = data.desc;
        
        const imgEl = document.getElementById("projModalImg");
        const fallbackEl = document.getElementById("projModalFallback");
        if (data.img) {
          imgEl.src = data.img;
          imgEl.style.display = "block";
          fallbackEl.style.display = "none";
        } else {
          imgEl.style.display = "none";
          fallbackEl.style.display = "flex";
        }

        const featuresUl = document.getElementById("projModalFeaturesList");
        featuresUl.innerHTML = "";
        data.features.forEach(feat => {
          const li = document.createElement("li");
          li.textContent = feat;
          featuresUl.appendChild(li);
        });

        const techListDiv = document.getElementById("projModalTechList");
        techListDiv.innerHTML = "";
        data.tech.forEach(t => {
          const badge = document.createElement("span");
          badge.className = "tech-badge";
          badge.textContent = t;
          techListDiv.appendChild(badge);
        });

        document.getElementById("projModalGitLink").href = data.git;
        const demoLinkEl = document.getElementById("projModalDemoLink");
        if (data.demo && data.demo !== "#") {
          demoLinkEl.href = data.demo;
          demoLinkEl.style.display = "inline-flex";
        } else {
          demoLinkEl.style.display = "none";
        }

        projModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeProjModal() {
    projModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (projModalClose) projModalClose.addEventListener("click", closeProjModal);
  if (projModalOverlay) projModalOverlay.addEventListener("click", closeProjModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projModal && projModal.classList.contains("active")) {
      closeProjModal();
    }
  });

  /* ===== LIVE GITHUB API ACTIVITY FETCH ===== */
  async function fetchGitHubStats() {
    const username = "chathunga2007";
    const reposVal = document.getElementById("ghRepos");
    const followersVal = document.getElementById("ghFollowers");
    const starsVal = document.getElementById("ghStars");
    const gistsVal = document.getElementById("ghGists");

    const fallbacks = { repos: 22, followers: 18, stars: 12, gists: 2 };

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      let userData = null;
      if (userRes.ok) {
        userData = await userRes.json();
      }
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      let starCount = fallbacks.stars;
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        starCount = reposData.reduce((acc, curr) => acc + (curr.stargazers_count || 0), 0);
      }

      if (userData) {
        if (reposVal) reposVal.textContent = userData.public_repos ?? fallbacks.repos;
        if (followersVal) followersVal.textContent = userData.followers ?? fallbacks.followers;
        if (gistsVal) gistsVal.textContent = userData.public_gists ?? fallbacks.gists;
        if (starsVal) starsVal.textContent = starCount;
      } else {
        throw new Error("Failed to load user profile payload");
      }
    } catch (err) {
      console.warn("GitHub API rate limit or error, using cached stats: ", err);
      if (reposVal) reposVal.textContent = fallbacks.repos;
      if (followersVal) followersVal.textContent = fallbacks.followers;
      if (starsVal) starsVal.textContent = fallbacks.stars;
      if (gistsVal) gistsVal.textContent = fallbacks.gists;
    }
  }
  fetchGitHubStats();

  /* ===== RETRO HACKER TERMINAL CONSOLE ===== */
  const terminalOverlay = document.getElementById("terminalOverlay");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");
  const termCloseBtn = document.getElementById("termCloseBtn");
  const destructAlert = document.getElementById("destructAlert");
  const terminalToggleBtn = document.getElementById("terminalToggleBtn");

  let typedBuffer = "";
  document.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);

    if (typedBuffer.endsWith("hack")) {
      typedBuffer = "";
      openTerminal();
    }
  });

  function openTerminal() {
    if (terminalOverlay) {
      terminalOverlay.classList.add("active");
      if (terminalInput) {
        terminalInput.value = "";
        setTimeout(() => terminalInput.focus(), 100);
      }
    }
  }

  function closeTerminal() {
    if (terminalOverlay) {
      if (inSnakeGame) endSnakeGame(true);
      terminalOverlay.classList.remove("active");
    }
  }

  if (termCloseBtn) termCloseBtn.addEventListener("click", closeTerminal);
  if (terminalToggleBtn) {
    terminalToggleBtn.addEventListener("click", () => {
      openTerminal();
    });
  }

  function printTermLine(text, type = "") {
    if (!terminalOutput) return;
    const line = document.createElement("div");
    line.className = `term-line ${type}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Play audio frequency synthesis
  function playTone(freq, dur) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, dur + 50);
    } catch (e) {
      console.warn("Tone audio synthesis failed: ", e);
    }
  }

  let alarmInterval = null;
  let audioCtx = null;
  
  function startWarningSiren() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let osc = audioCtx.createOscillator();
      let gainNode = audioCtx.createGain();
      
      osc.type = "sawtooth";
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      
      let toggle = false;
      alarmInterval = setInterval(() => {
        if (!audioCtx || audioCtx.state === "closed") return;
        osc.frequency.setValueAtTime(toggle ? 450 : 850, audioCtx.currentTime);
        toggle = !toggle;
      }, 350);

      setTimeout(() => {
        clearInterval(alarmInterval);
        osc.stop();
        audioCtx.close();
      }, 5000);
    } catch (e) {
      console.warn("AudioContext synthesis failed: ", e);
    }
  }

  let isDestructing = false;
  function triggerSelfDestruct() {
    if (isDestructing) return;
    isDestructing = true;
    
    printTermLine("\n===================================", "system");
    printTermLine("⚠️ WARNING: CORE DESTRUCT SEQUENCE INITIATED ⚠️", "system");
    printTermLine("===================================\n", "system");
    
    startWarningSiren();
    
    document.body.classList.add("screen-shake");
    if (destructAlert) destructAlert.classList.add("active");

    let countdown = 5;
    const interval = setInterval(() => {
      if (countdown > 0) {
        printTermLine(`> SYSTEM TERMINATION IN ${countdown}...`, "system");
        countdown--;
      } else {
        clearInterval(interval);
        executeReboot();
      }
    }, 1000);
  }

  function executeReboot() {
    printTermLine("\n> CONNECTION LOST. REBOOTING QUANTUM NODE...", "system");
    
    setTimeout(() => {
      document.body.innerHTML = `
        <div style="background:#000; color:#39ff14; width:100vw; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:'Space Mono', monospace; font-size:1rem; position:fixed; inset:0; z-index:99999;">
          <div style="font-size:2rem; margin-bottom:20px;">⚡ SYSTEM REBOOT ⚡</div>
          <div id="rebootPercent">0% BACKUP SYNCHRONIZED</div>
        </div>
      `;
      
      let percent = 0;
      const progressInterval = setInterval(() => {
        percent += 10;
        const lbl = document.getElementById("rebootPercent");
        if (lbl) lbl.textContent = `${percent}% BACKUP SYNCHRONIZED`;
        if (percent >= 100) {
          clearInterval(progressInterval);
          window.location.reload();
        }
      }, 200);
    }, 1000);
  }

  /* ===== TERMINAL MONOSPACE SNAKE GAME ===== */
  let inSnakeGame = false;
  let snake = [];
  let snakeFood = { x: 0, y: 0 };
  let snakeDirection = "right";
  let snakeScore = 0;
  let snakeGameInterval = null;
  const snakeGridWidth = 24;
  const snakeGridHeight = 12;
  let snakeBoardDiv = null;

  function startSnakeGame() {
    inSnakeGame = true;
    snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    snakeDirection = "right";
    snakeScore = 0;
    spawnSnakeFood();
    
    const inputRow = document.querySelector(".terminal-input-row");
    if (inputRow) inputRow.style.display = "none";
    
    printTermLine("\n=== MONOSPACE TERMINAL SNAKE ===", "success");
    printTermLine("Use keys: W (up), A (left), S (down), D (right) or Arrows.");
    printTermLine("Type Esc or 'exit' (if game ends) to return to console.");
    printTermLine("Starting game in 1 second...\n");
    
    setTimeout(() => {
      if (!inSnakeGame) return;
      drawSnakeBoard();
      snakeGameInterval = setInterval(runSnakeGameTick, 200);
    }, 1000);
  }

  function spawnSnakeFood() {
    let attempts = 0;
    while (attempts < 100) {
      const rx = Math.floor(Math.random() * (snakeGridWidth - 2)) + 1;
      const ry = Math.floor(Math.random() * (snakeGridHeight - 2)) + 1;
      const onSnake = snake.some(s => s.x === rx && s.y === ry);
      if (!onSnake) {
        snakeFood = { x: rx, y: ry };
        break;
      }
      attempts++;
    }
  }

  function drawSnakeBoard() {
    if (!terminalOutput) return;
    
    if (!snakeBoardDiv) {
      snakeBoardDiv = document.createElement("div");
      snakeBoardDiv.className = "term-line";
      snakeBoardDiv.style.fontFamily = "monospace";
      snakeBoardDiv.style.whiteSpace = "pre";
      terminalOutput.appendChild(snakeBoardDiv);
    }
    
    let boardStr = "";
    for (let y = 0; y < snakeGridHeight; y++) {
      let line = "";
      for (let x = 0; x < snakeGridWidth; x++) {
        if (x === 0 || x === snakeGridWidth - 1 || y === 0 || y === snakeGridHeight - 1) {
          line += "#";
        } else if (snake.some((s, idx) => s.x === x && s.y === y && idx === 0)) {
          line += "@";
        } else if (snake.some((s, idx) => s.x === x && s.y === y && idx > 0)) {
          line += "o";
        } else if (snakeFood.x === x && snakeFood.y === y) {
          line += "*";
        } else {
          line += " ";
        }
      }
      boardStr += line + "\n";
    }
    
    snakeBoardDiv.textContent = boardStr + `SCORE: ${snakeScore} | DIRECTION: ${snakeDirection.toUpperCase()}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function runSnakeGameTick() {
    if (!inSnakeGame) return;
    
    const head = snake[0];
    let newHead = { x: head.x, y: head.y };
    
    if (snakeDirection === "up") newHead.y--;
    else if (snakeDirection === "down") newHead.y++;
    else if (snakeDirection === "left") newHead.x--;
    else if (snakeDirection === "right") newHead.x++;
    
    const hitWall = newHead.x <= 0 || newHead.x >= snakeGridWidth - 1 || newHead.y <= 0 || newHead.y >= snakeGridHeight - 1;
    const hitSelf = snake.some(s => s.x === newHead.x && s.y === newHead.y);
    
    if (hitWall || hitSelf) {
      endSnakeGame(false);
      return;
    }
    
    snake.unshift(newHead);
    
    if (newHead.x === snakeFood.x && newHead.y === snakeFood.y) {
      snakeScore += 10;
      spawnSnakeFood();
      playTone(600, 50);
    } else {
      snake.pop();
    }
    
    drawSnakeBoard();
  }

  function endSnakeGame(aborted = false) {
    inSnakeGame = false;
    clearInterval(snakeGameInterval);
    snakeBoardDiv = null;
    
    const inputRow = document.querySelector(".terminal-input-row");
    if (inputRow) inputRow.style.display = "flex";
    
    if (aborted) {
      printTermLine("\n> Game Aborted by user.", "system");
    } else {
      printTermLine(`\n💥 GAME OVER! Final Score: ${snakeScore}`, "system");
      playTone(150, 300);
    }
    printTermLine("guest@chathunga.dev:~$ ");
    
    if (terminalInput) {
      terminalInput.focus();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (!inSnakeGame) return;
    
    const key = e.key.toLowerCase();
    
    if (key === "escape") {
      e.preventDefault();
      endSnakeGame(true);
      return;
    }
    
    if (key === "w" || e.key === "ArrowUp") {
      if (snakeDirection !== "down") snakeDirection = "up";
      e.preventDefault();
    } else if (key === "s" || e.key === "ArrowDown") {
      if (snakeDirection !== "up") snakeDirection = "down";
      e.preventDefault();
    } else if (key === "a" || e.key === "ArrowLeft") {
      if (snakeDirection !== "right") snakeDirection = "left";
      e.preventDefault();
    } else if (key === "d" || e.key === "ArrowRight") {
      if (snakeDirection !== "left") snakeDirection = "right";
      e.preventDefault();
    }
  });

  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = "";
        
        if (!cmd) return;

        printTermLine(`guest@chathunga.dev:~$ ${cmd}`);

        const cmdParts = cmd.split(" ");
        const baseCmd = cmdParts[0];
        const arg = cmdParts[1];

        switch (baseCmd) {
          case "help":
            printTermLine("\nAvailable commands:", "success");
            printTermLine("  about      - View short biographical profile");
            printTermLine("  skills     - Check developer skill levels");
            printTermLine("  projects   - View active list of open source software");
            printTermLine("  contact    - Display contact channels");
            printTermLine("  snake      - Play retro monospace snake game inside terminal");
            printTermLine("  theme [t]  - Change accent color (cyan/purple/emerald/crimson/amber)");
            printTermLine("  bg [b]     - Change background (network/grid/nebula/matrix/aurora)");
            printTermLine("  music      - Play/pause background music toggle");
            printTermLine("  clear      - Clear console outputs");
            printTermLine("  destruct   - Initiate quantum core self-destruct countdown");
            printTermLine("  exit       - Exit the terminal");
            break;
            
          case "clear":
            if (terminalOutput) terminalOutput.innerHTML = "";
            break;
            
          case "exit":
            closeTerminal();
            break;
            
          case "about":
            printTermLine("\nChathunga Bimsara - Undergraduate Software Engineer", "success");
            printTermLine("Age: 18 | Galle, Sri Lanka");
            printTermLine("Focus: Backend systems architecture, databases, clean code.");
            break;
            
          case "skills":
            printTermLine("\nSKILLS MATRIX:", "success");
            printTermLine("  ☕ Java       - [██████████████████░] 95%");
            printTermLine("  ⚡ JavaScript - [████████████████░░░] 85%");
            printTermLine("  🌐 HTML/CSS   - [█████████████████░░] 90%");
            printTermLine("  🗄️ MySQL      - [█████████████████░░] 95%");
            printTermLine("  🐍 Python     - [████████████░░░░░░░] 75%");
            break;
            
          case "projects":
            printTermLine("\nPROJECT REGISTRY:", "success");
            printTermLine("  1. Stock System (Java inventory manager)");
            printTermLine("  2. Connect 4 Game (Swing GUI board application)");
            printTermLine("  3. Flex Gym System (MVC desktop administration utility)");
            break;
            
          case "contact":
            printTermLine("\nCHANNELS:", "success");
            printTermLine("  • Email: wggachathungabimsara2007@gmail.com");
            printTermLine("  • Phone: +94 76 794 5968");
            printTermLine("  • GitHub: github.com/chathunga2007");
            break;
            
          case "destruct":
            triggerSelfDestruct();
            break;

          case "snake":
            startSnakeGame();
            break;

          case "music":
            const mBtn = document.getElementById("musicToggle");
            if (mBtn) {
              mBtn.click();
              const isPlaying = mBtn.classList.contains("playing");
              printTermLine(`\n> Background music is now ${isPlaying ? "ON" : "OFF"}.`, "success");
            }
            break;

          case "theme":
            const themes = ["cyan", "purple", "emerald", "crimson", "amber"];
            if (arg && themes.includes(arg)) {
              const btn = document.querySelector(`.fx-color-btn[data-accent="${arg}"]`);
              if (btn) {
                btn.click();
                printTermLine(`\n> Accent theme changed to ${arg.toUpperCase()}.`, "success");
              }
            } else {
              printTermLine("\n> Invalid theme. Usage: theme [cyan|purple|emerald|crimson|amber]", "system");
            }
            break;

          case "bg":
            const bgs = ["network", "grid", "nebula", "matrix", "aurora"];
            if (arg && bgs.includes(arg)) {
              const btn = document.querySelector(`.fx-opt-btn[data-bg="${arg}"]`);
              if (btn) {
                btn.click();
                printTermLine(`\n> Background engine switched to ${arg.toUpperCase()}.`, "success");
              }
            } else {
              printTermLine("\n> Invalid background. Usage: bg [network|grid|nebula|matrix|aurora]", "system");
            }
            break;

          case "matrix":
          case "rain":
            const matrixBtn = document.querySelector('.fx-opt-btn[data-bg="matrix"]');
            if (matrixBtn) {
              matrixBtn.click();
              printTermLine("\n> MATRIX MODE ACTIVATED. Digital Rain initialized.", "success");
            }
            break;
            
          default:
            printTermLine(`\nError: Command '${cmd}' not recognized. Type 'help' for instructions.`, "system");
        }
      }
    });
  }

  /* ===== COMMAND PALETTE (CTRL+K) ===== */
  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteInput = document.getElementById("paletteInput");
  const paletteResults = document.getElementById("paletteResults");
  const paletteToggleBtn = document.getElementById("paletteToggleBtn");
  let selectedPaletteIndex = 0;
  let filteredActions = [];

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      closePalette();
    }
  }

  function switchBgFromPalette(name) {
    const btn = document.querySelector(`.fx-opt-btn[data-bg="${name}"]`);
    if (btn) {
      btn.click();
      closePalette();
    }
  }

  function switchAccentFromPalette(name) {
    const btn = document.querySelector(`.fx-color-btn[data-accent="${name}"]`);
    if (btn) {
      btn.click();
      closePalette();
    }
  }

  const paletteActions = [
    { id: "go-home", title: "Go to: Home", icon: "fa-house", action: () => scrollToSection("hero") },
    { id: "go-about", title: "Go to: About", icon: "fa-address-card", action: () => scrollToSection("about") },
    { id: "go-services", title: "Go to: Services", icon: "fa-gears", action: () => scrollToSection("services") },
    { id: "go-skills", title: "Go to: Skills", icon: "fa-brain", action: () => scrollToSection("skills") },
    { id: "go-experience", title: "Go to: Experience", icon: "fa-briefcase", action: () => scrollToSection("experience") },
    { id: "go-education", title: "Go to: Education", icon: "fa-graduation-cap", action: () => scrollToSection("education") },
    { id: "go-projects", title: "Go to: Projects", icon: "fa-code", action: () => scrollToSection("projects") },
    { id: "go-contact", title: "Go to: Contact", icon: "fa-envelope", action: () => scrollToSection("contact") },
    { id: "toggle-theme", title: "Toggle Theme (Light/Dark)", icon: "fa-circle-half-stroke", action: () => { document.getElementById("themeToggle").click(); closePalette(); } },
    { id: "toggle-music", title: "Toggle Background Music", icon: "fa-music", action: () => { document.getElementById("musicToggle").click(); closePalette(); } },
    { id: "bg-network", title: "Background: Neural Web", icon: "fa-circle-nodes", action: () => switchBgFromPalette("network") },
    { id: "bg-grid", title: "Background: Cyber Grid", icon: "fa-border-all", action: () => switchBgFromPalette("grid") },
    { id: "bg-nebula", title: "Background: Cosmic Nebula", icon: "fa-user-astronaut", action: () => switchBgFromPalette("nebula") },
    { id: "bg-matrix", title: "Background: Digital Rain", icon: "fa-terminal", action: () => switchBgFromPalette("matrix") },
    { id: "bg-aurora", title: "Background: Aurora Waves", icon: "fa-wave-square", action: () => switchBgFromPalette("aurora") },
    { id: "accent-cyan", title: "Accent: Cyber Cyan", icon: "fa-palette", action: () => switchAccentFromPalette("cyan") },
    { id: "accent-purple", title: "Accent: Neon Purple", icon: "fa-palette", action: () => switchAccentFromPalette("purple") },
    { id: "accent-emerald", title: "Accent: Matrix Emerald", icon: "fa-palette", action: () => switchAccentFromPalette("emerald") },
    { id: "accent-crimson", title: "Accent: Crimson Red", icon: "fa-palette", action: () => switchAccentFromPalette("crimson") },
    { id: "accent-amber", title: "Accent: Solar Amber", icon: "fa-palette", action: () => switchAccentFromPalette("amber") },
    { id: "open-terminal", title: "Launch Developer Terminal", icon: "fa-terminal", action: () => { closePalette(); openTerminal(); } }
  ];

  function openPalette() {
    if (paletteOverlay) {
      paletteOverlay.classList.add("active");
      paletteInput.value = "";
      renderPaletteItems();
      setTimeout(() => paletteInput.focus(), 100);
    }
  }

  function closePalette() {
    if (paletteOverlay) {
      paletteOverlay.classList.remove("active");
    }
  }

  if (paletteToggleBtn) {
    paletteToggleBtn.addEventListener("click", openPalette);
  }

  paletteOverlay.addEventListener("click", (e) => {
    if (e.target === paletteOverlay) closePalette();
  });

  // Toggle with Ctrl + K
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (paletteOverlay.classList.contains("active")) {
        closePalette();
      } else {
        openPalette();
      }
    }
    // Also toggle with ESC key
    if (e.key === "Escape" && paletteOverlay.classList.contains("active")) {
      closePalette();
    }
  });

  function renderPaletteItems() {
    const query = paletteInput.value.toLowerCase().trim();
    filteredActions = paletteActions.filter(act => 
      act.title.toLowerCase().includes(query)
    );

    paletteResults.innerHTML = "";
    selectedPaletteIndex = Math.min(selectedPaletteIndex, filteredActions.length - 1);
    if (selectedPaletteIndex < 0) selectedPaletteIndex = 0;

    if (filteredActions.length === 0) {
      paletteResults.innerHTML = `<div style="padding: 15px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No commands found matching "${query}"</div>`;
      return;
    }

    filteredActions.forEach((act, idx) => {
      const item = document.createElement("div");
      item.className = `palette-item ${idx === selectedPaletteIndex ? "selected" : ""}`;
      item.innerHTML = `
        <div class="palette-item-content">
          <i class="fa-solid ${act.icon} palette-item-icon"></i>
          <span class="palette-item-title">${act.title}</span>
        </div>
        <span class="palette-item-shortcut">Enter</span>
      `;
      item.addEventListener("click", () => {
        act.action();
      });
      paletteResults.appendChild(item);
    });

    const selectedEl = paletteResults.children[selectedPaletteIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }

  paletteInput.addEventListener("input", () => {
    selectedPaletteIndex = 0;
    renderPaletteItems();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedPaletteIndex = (selectedPaletteIndex + 1) % filteredActions.length;
      renderPaletteItems();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedPaletteIndex = (selectedPaletteIndex - 1 + filteredActions.length) % filteredActions.length;
      renderPaletteItems();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredActions[selectedPaletteIndex]) {
        filteredActions[selectedPaletteIndex].action();
      }
    }
  });

  /* ===== KONAMI CODE EASTER EGG ===== */
  const konamiCode = [
    "arrowup", "arrowup",
    "arrowdown", "arrowdown",
    "arrowleft", "arrowright",
    "arrowleft", "arrowright",
    "b", "a"
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        triggerKonamiEasterEgg();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerKonamiEasterEgg() {
    playTone(523.25, 100);
    setTimeout(() => playTone(659.25, 100), 120);
    setTimeout(() => playTone(783.99, 100), 240);
    setTimeout(() => playTone(1046.50, 300), 360);
    
    document.body.classList.add("screen-shake");
    document.documentElement.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
    document.documentElement.style.transform = "rotate(360deg)";
    
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.9); border:2px solid #39ff14; color:#39ff14; padding:20px 40px; font-family:'Orbitron', sans-serif; font-size:1.5rem; border-radius:10px; z-index:100020; box-shadow:0 0 30px rgba(57,255,20,0.5); text-align:center; pointer-events:none;";
    alertDiv.innerHTML = "<div>👾 KONAMI CHEAT ACTIVATED 👾</div><div style='font-size:0.8rem; margin-top:10px; font-family:monospace;'>ACCESSING CORE PORTALS...</div>";
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      document.body.classList.remove("screen-shake");
      document.documentElement.style.transform = "";
      alertDiv.remove();
      openTerminal();
      printTermLine("\n*** EASTER EGG INTRUSION DETECTED ***");
      printTermLine("*** RUNNING ROOT ACCESS OVERRIDE... ***", "success");
      printTermLine("Welcome Admin. Type 'help' for core commands.\n");
    }, 2000);
  }

});