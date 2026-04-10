document.addEventListener("DOMContentLoaded", function () {

  // ====================== MYSQL API LIKE/DISLIKE SYSTEM ======================
const API_URL = "https://ඔයාගේ-subdomain.epizy.com/api.php";   // ← ඔයාගේ api.php URL එක මෙතන දාන්න

async function loadFeedbackStats() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        document.getElementById("likeCount").textContent = data.likes || 0;
        document.getElementById("dislikeCount").textContent = data.dislikes || 0;
    } catch(e) {
        console.log("API error");
    }
}

async function handleLike() {
    if (localStorage.getItem("hasVoted") === "true") return alert("ඔයා දැනටමත් vote කරලා තියෙනවා! ❤️");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "like" })
        });
        const data = await res.json();
        document.getElementById("likeCount").textContent = data.likes || 0;
        localStorage.setItem("hasVoted", "true");
    } catch(e) {}
}

async function handleDislike() {
    if (localStorage.getItem("hasVoted") === "true") return alert("ඔයා දැනටමත් vote කරලා තියෙනවා! 👎");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "dislike" })
        });
        const data = await res.json();
        document.getElementById("dislikeCount").textContent = data.dislikes || 0;
        localStorage.setItem("hasVoted", "true");
    } catch(e) {}
}

// Load initial counts when page loads
loadFeedbackStats();

  // ===== PARTICLES =====
  const bgEffects = document.getElementById("bgEffects");
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 25 + "s";
    particle.style.animationDuration = 20 + Math.random() * 15 + "s";
    const colors = ["#06b6d4", "#3b82f6", "#f59e0b"];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    bgEffects.appendChild(particle);
  }

  // ===== NAVBAR =====
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navbarLinks = document.getElementById("navbarLinks");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navbarLinks.classList.toggle("active");
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navbarLinks.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 100);
    let current = "";
    document.querySelectorAll("section").forEach((section) => {
      if (scrollY >= section.offsetTop - 150)
        current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current)
        link.classList.add("active");
    });
  });

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.innerHTML =
    savedTheme === "dark"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.innerHTML =
      newTheme === "dark"
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
  });

  // ===== MUSIC TOGGLE =====
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
      bgMusic.play();
      musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      musicToggle.classList.add("playing");
    }
    isMusicPlaying = !isMusicPlaying;
  });

  // ===== TYPING EFFECT =====
  const roles = [
    "Software Engineer.",
    "Java Developer.",
    "Web Developer.",
    "Frontend Developer.",
    "Backend Developer.",
    "Full-Stack Developer.",
    "UI/UX Engineer.",
    "Content Creator.",
  ];
  let roleIndex = 0,
    charIndex = 0,
    isDeleting = false;
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
    if (!isDeleting && charIndex === currentRole.length)
      setTimeout(() => (isDeleting = true), 2000);
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  setTimeout(typeEffect, 1000);

  // ===== COUNTER =====
  const counters = document.querySelectorAll(".hstat-num");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-count"));
          let count = 0;
          const increment = target / 50;
          const updateCounter = () => {
            count += increment;
            if (count < target) {
              entry.target.textContent = Math.ceil(count);
              requestAnimationFrame(updateCounter);
            } else entry.target.textContent = target;
          };
          updateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((counter) => counterObserver.observe(counter));

  // ===== REVEAL =====
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ===== SKILL BARS & TABS =====
  const skillTabs = document.querySelectorAll(".skill-tab-btn");
  const skillContents = document.querySelectorAll(".skills-content");
  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      skillContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
      const activeFills = document.querySelectorAll(
        `#${tab.dataset.tab} .skill-fill`,
      );
      activeFills.forEach((fill) => {
        fill.style.width = "0";
        setTimeout(() => {
          fill.style.width = fill.dataset.width + "%";
        }, 100);
      });
    });
  });
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width =
            entry.target.getAttribute("data-width") + "%";
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  document
    .querySelectorAll(".skills-content.active .skill-fill")
    .forEach((fill) => skillObserver.observe(fill));

  // ===== NEW GALLERY CAROUSEL LOGIC =====
  const galleryCarousel = document.getElementById("galleryCarousel");
  const galPrev = document.getElementById("galPrev");
  const galNext = document.getElementById("galNext");
  const galPause = document.getElementById("galPause");

  const galleryImages = [
    "assest/Gallery/01.JPG",
    "assest/Gallery/02.jpeg",
    "assest/Gallery/03.JPG",
    "assest/Gallery/04.jpg",
    "assest/Gallery/05.JPG",
    "assest/Gallery/06.png",
    "assest/Gallery/07.JPG",
    "assest/Gallery/08.JPG",
    "assest/Gallery/09.JPG",
    "assest/Gallery/10.JPG",
    "assest/Gallery/11.JPG",
    "assest/Gallery/12.JPG",
    "assest/Gallery/13.jpg",
    "assest/Gallery/14.JPG",
    "assest/Gallery/15.jpg",
    "assest/Gallery/16.jpg",
    "assest/Gallery/17.jpg",
    "assest/Gallery/18.jpg",
    "assest/Gallery/19.JPG",
    "assest/Gallery/20.jpg"
  ];

  let currentIndex = 0;
  let autoSlideInterval;
  let isPaused = false;

  // Generate Slides
  galleryImages.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";
    slide.innerHTML = `
            <img src="${src}" alt="Gallery Image ${index + 1}" loading="lazy">
            <div class="gal-overlay"><i class="fa-solid fa-expand"></i></div>
        `;
    // Open lightbox on click
    slide.addEventListener("click", () => {
      openLightbox(index);
    });
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
        slide.classList.add("prev-hidden"); // Far left items
      } else {
        slide.classList.add("next-hidden"); // Far right items
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

  // Auto Slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  galNext.addEventListener("click", () => {
    nextSlide();
    if (!isPaused) {
      stopAutoSlide();
      startAutoSlide();
    }
  });

  galPrev.addEventListener("click", () => {
    prevSlide();
    if (!isPaused) {
      stopAutoSlide();
      startAutoSlide();
    }
  });

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

  // Initialize
  updateGallery();
  startAutoSlide();

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");

  function openLightbox(index) {
    currentIndex = index; // Sync lightbox index with carousel index
    lightbox.classList.add("active");
    lbImg.src = galleryImages[index];
  }

  document.getElementById("lbClose").addEventListener("click", () => lightbox.classList.remove("active"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });

  document.getElementById("lbPrev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[currentIndex];
  });
  document.getElementById("lbNext").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lbImg.src = galleryImages[currentIndex];
  });

  // ===== BACK TO TOP =====
  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("visible", window.scrollY > 500);
  });
  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // ===== CONTACT FORM (Updated for reliability) =====
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formNote = document.getElementById("formNote");
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/wggachathungabimsara2007@gmail.com",
        { method: "POST", body: formData },
      );
      if (response.ok) {
        formNote.textContent =
          "✓ Message sent successfully! I will reply soon.";
        formNote.className = "form-note success";
        contactForm.reset();
      } else throw new Error("Failed");
    } catch (err) {
      formNote.textContent = "✗ Something went wrong. Please try again.";
      formNote.className = "form-note error";
    }
    submitBtn.innerHTML =
      '<i class="fa-solid fa-paper-plane"></i><span>Send Message</span>';
    submitBtn.disabled = false;
    setTimeout(() => (formNote.textContent = ""), 5000);
  });

  // ===== CHATBOT - NO API KEY (Pure Smart Fallback) =====
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  chatbotToggle.addEventListener("click", () => chatbotWindow.classList.toggle("active"));
  chatbotClose.addEventListener("click", () => chatbotWindow.classList.remove("active"));

  // Chathunga Context (නොවෙනස්ව තියන්න - ඔයාගේ සියලුම info මෙතන තියෙනවා)
  const CHATHUNGA_CONTEXT = `
Name: Chathunga Bimsara
Location: Ampegama, Galle, Sri Lanka
Phone: +94 76 794 5968
Email: wggachathungabimsara2007@gmail.com
Birthday: November 02, 2007
Education: Higher National Diploma in Software Engineering at IJSE | English Graduate from SLEGA (2025) | O/L from G/Ethkandura Seewali M.V.
Skills: Java 95%, JavaScript 85%, Python 75%, SQL 80%, HTML5 90%, CSS3 90%, Git, GitHub, Docker, VS Code, IntelliJ, MySQL 95%, PostgreSQL 70%, Figma 85%, Photoshop 70%, Premiere Pro 80%
Projects: Stock System (Java terminal inventory), Connect 4 Game (OOP two-player), Flex Gym System (MVC gym management)
Services: Web Development, Java Applications, Database Design, Responsive Design, UI/UX Design, Open Source
Social: LinkedIn linkedin.com/in/chathunga-bimsara-02a728387, GitHub github.com/chathunga2007, YouTube @chathungabimsara2007, Instagram @chathunga200711, X @ChathungaB2007
`;

  function addMessage(text, isUser) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${isUser ? "user" : "bot"}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getSmartResponse(message) {
    const msg = message.toLowerCase();

    // Greetings
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
      return "Hello! 👋 I'm Chathunga's AI assistant. Ask me anything about him!";

    // Name
    if (msg.includes("name") || msg.includes("who are you"))
      return "I'm Chathunga Bimsara's personal AI assistant! Nice to meet you 😊";

    // Skills
    if (msg.includes("skill") || msg.includes("what can you") || msg.includes("programming"))
      return "Chathunga is highly skilled in:\n• Java (95%)\n• JavaScript (85%)\n• Python (75%)\n• SQL (80%)\n• HTML5 & CSS3 (90%)\n• Git, Docker, Figma & more!";

    // Projects
    if (msg.includes("project") || msg.includes("work") || msg.includes("built"))
      return "Chathunga's main projects:\n1. Stock System - Java terminal inventory management\n2. Connect 4 Game - Two-player OOP game\n3. Flex Gym System - Full MVC gym membership app";

    // Education
    if (msg.includes("education") || msg.includes("study") || msg.includes("ijse") || msg.includes("school"))
      return "Currently studying Higher National Diploma in Software Engineering at IJSE.\nCompleted English Graduate from SLEGA (2025) and O/L from G/Ethkandura Seewali M.V.";

    // Contact
    if (msg.includes("contact") || msg.includes("phone") || msg.includes("email") || msg.includes("number"))
      return "📧 Email: wggachathungabimsara2007@gmail.com\n📱 Phone: +94 76 794 5968\n📍 Ampegama, Galle, Sri Lanka";

    // Location
    if (msg.includes("where") || msg.includes("live") || msg.includes("galle"))
      return "Chathunga lives in Ampegama, Galle, Sri Lanka 🇱🇰";

    // Availability / Work
    if (msg.includes("work") || msg.includes("job") || msg.includes("freelance") || msg.includes("open"))
      return "Yes! Chathunga is available for freelance web development, Java projects, and collaborations. Feel free to contact him!";

    // Default friendly fallback
    return "Hmm, I'm not sure about that one 😅 But you can ask me about Chathunga's skills, projects, education, or contact info!\n\nYou can also email him directly: wggachathungabimsara2007@gmail.com";
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = "";

    // Typing effect simulation
    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Small delay to feel natural
    setTimeout(() => {
      typing.remove();
      const reply = getSmartResponse(message);
      addMessage(reply, false);
    }, 800);
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});