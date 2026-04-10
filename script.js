document.addEventListener("DOMContentLoaded", function () {

  /* ===== CUSTOM CURSOR + TRAIL ===== */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, trailTimer = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";

    trailTimer++;
    if (trailTimer % 3 === 0) {
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

  /* ===== MATRIX RAIN ===== */
  const matrixCanvas = document.getElementById("matrixCanvas");
  const mCtx = matrixCanvas.getContext("2d");
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const matrixChars = "ABCDEF0123456789アイウエオカキクケコサシスセソ";
  const matrixFontSize = 14;
  const matrixColumns = Math.floor(matrixCanvas.width / matrixFontSize);
  const matrixDrops = new Array(matrixColumns).fill(1);

  function drawMatrix() {
    mCtx.fillStyle = "rgba(3, 7, 18, 0.05)";
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.fillStyle = "#06b6d4";
    mCtx.font = matrixFontSize + "px monospace";
    for (let i = 0; i < matrixDrops.length; i++) {
      const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      mCtx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
      if (matrixDrops[i] * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) {
        matrixDrops[i] = 0;
      }
      matrixDrops[i]++;
    }
  }
  const matrixInterval = setInterval(drawMatrix, 50);

  /* ===== NETWORK NODES ===== */
  const networkCanvas = document.getElementById("networkCanvas");
  const nCtx = networkCanvas.getContext("2d");
  networkCanvas.width = window.innerWidth;
  networkCanvas.height = window.innerHeight;

  const nodes = [];
  for (let i = 0; i < 40; i++) {
    nodes.push({
      x: Math.random() * networkCanvas.width,
      y: Math.random() * networkCanvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    });
  }

  function drawNetwork() {
    nCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > networkCanvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > networkCanvas.height) node.vy *= -1;
      nCtx.beginPath();
      nCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      nCtx.fillStyle = "rgba(6, 182, 212, 0.6)";
      nCtx.fill();
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          nCtx.beginPath();
          nCtx.moveTo(nodes[i].x, nodes[i].y);
          nCtx.lineTo(nodes[j].x, nodes[j].y);
          nCtx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - dist / 150)})`;
          nCtx.lineWidth = 0.5;
          nCtx.stroke();
        }
      }
    }
    if (mouseX > 0 && mouseY > 0) {
      nodes.forEach(node => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          nCtx.beginPath();
          nCtx.moveTo(node.x, node.y);
          nCtx.lineTo(mouseX, mouseY);
          nCtx.strokeStyle = `rgba(59, 130, 246, ${0.4 * (1 - dist / 200)})`;
          nCtx.lineWidth = 0.8;
          nCtx.stroke();
        }
      });
    }
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();

  window.addEventListener("resize", () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;
  });

  /* ===== FLOATING PARTICLES ===== */
  const bgEffects = document.getElementById("bgEffects");
  for (let i = 0; i < 35; i++) {
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
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  chatbotToggle.addEventListener("click", () => chatbotWindow.classList.toggle("active"));
  chatbotClose.addEventListener("click", () => chatbotWindow.classList.remove("active"));

  function addMessage(text, isUser) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${isUser ? "user" : "bot"}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getSmartResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("hii"))
      return "Hello! 👋 I'm Chathunga's AI assistant. Ask me anything about him!";

    if (msg.includes("name") || msg.includes("who are you") || msg.includes("who is chathunga"))
      return "I'm Chathunga Bimsara's personal AI assistant! Nice to meet you 😊\n\nChathunga is a 17-year-old Software Engineering student from Galle, Sri Lanka.";

    if (msg.includes("skill") || msg.includes("what can") || msg.includes("programming") || msg.includes("tech"))
      return "Chathunga is highly skilled in:\n☕ Java — 95%\n⚡ JavaScript — 85%\n🐍 Python — 75%\n🗄️ SQL — 80%\n🌐 HTML5 — 90%\n🎨 CSS3 — 90%\n\nPlus Git, Docker, Figma, Premiere Pro & more!";

    if (msg.includes("project") || msg.includes("work") || msg.includes("built") || msg.includes("portfolio"))
      return "Chathunga's main projects:\n\n1. 📃 Stock System — Java terminal inventory management\n2. 🎮 Connect 4 Game — Two-player OOP game\n3. 💪 Flex Gym System — Full MVC gym membership app\n\nCheck them on GitHub: github.com/chathunga2007";

    if (msg.includes("education") || msg.includes("study") || msg.includes("ijse") || msg.includes("school") || msg.includes("university"))
      return "📚 Education:\n\n• IJSE — HND in Software Engineering (2025-Present)\n• SLEGA — English Graduate Diploma (2025)\n• G/Ethkandura Seewali M.V. — O/L (2017-2024)";

    if (msg.includes("contact") || msg.includes("phone") || msg.includes("email") || msg.includes("number") || msg.includes("reach"))
      return "📧 Email: wggachathungabimsara2007@gmail.com\n📱 Phone: +94 76 794 5968\n💬 WhatsApp: +94 76 794 5968\n📍 Ampegama, Galle, Sri Lanka";

    if (msg.includes("where") || msg.includes("live") || msg.includes("location") || msg.includes("galle") || msg.includes("country"))
      return "Chathunga lives in Ampegama, Galle, Sri Lanka 🇱🇰";

    if (msg.includes("work") || msg.includes("job") || msg.includes("freelance") || msg.includes("hire") || msg.includes("open") || msg.includes("available"))
      return "Yes! ✅ Chathunga is available for:\n• Freelance web development\n• Java projects\n• Collaborations\n• Internships\n\nFeel free to contact him directly!";

    if (msg.includes("service") || msg.includes("offer") || msg.includes("do"))
      return "Services offered:\n\n💻 Web Development\n☕ Java Applications\n🗄️ Database Design\n📱 Responsive Design\n🎨 UI/UX Design\n🔓 Open Source Contributions";

    if (msg.includes("birthday") || msg.includes("born") || msg.includes("age"))
      return "🎂 Birthday: November 02, 2007\n📊 Age: 17 years old";

    if (msg.includes("github") || msg.includes("code") || msg.includes("repository"))
      return "🐙 GitHub: github.com/chathunga2007\n\nHe has multiple repositories including Java projects, games, and web apps!";

    if (msg.includes("social") || msg.includes("instagram") || msg.includes("youtube") || msg.includes("linkedin") || msg.includes("facebook") || msg.includes("twitter") || msg.includes("x.com"))
      return "🌐 Social Links:\n\n💼 LinkedIn: linkedin.com/in/chathunga-bimsara-02a728387\n🐙 GitHub: github.com/chathunga2007\n📺 YouTube: @chathungabimsara2007\n📸 Instagram: @chathunga200711\n🐦 X: @ChathungaB2007\n📘 Facebook: Chathunga Bimsara";

    if (msg.includes("cv") || msg.includes("resume") || msg.includes("download"))
      return "📄 You can download Chathunga's CV directly from the portfolio!\n\nClick the 'Download CV' button in the Hero section.";

    if (msg.includes("thank") || msg.includes("thanks"))
      return "You're welcome! 😊 Feel free to ask anything else!";

    if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you"))
      return "Goodbye! 👋 It was nice chatting. Have a great day!";

    if (msg.includes("assignment"))
      return "📝 Chathunga has completed 12 assignments in the Web Technologies module at IJSE, including this portfolio website, POS systems, and more.";

    return "Hmm, I'm not sure about that one 😅 But you can ask me about:\n\n• 💡 Skills & Technologies\n• 📁 Projects\n• 📚 Education\n• 📞 Contact Info\n• 🌐 Social Links\n• 💼 Services\n• 🎂 Personal Info\n\nOr email Chathunga directly: wggachathungabimsara2007@gmail.com";
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = "";

    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const reply = getSmartResponse(message);
      addMessage(reply, false);
    }, 800 + Math.random() * 600);
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
      clearInterval(matrixInterval);
    } else {
      setInterval(drawMatrix, 50);
    }
  });

});