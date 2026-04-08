document.addEventListener("DOMContentLoaded", function () {
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
    "Full Stack Developer.",
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

  // ===== GALLERY =====
  const galleryTrack = document.getElementById("galleryTrack");
  const galPause = document.getElementById("galPause");
  const galPrev = document.getElementById("galPrev");
  const galNext = document.getElementById("galNext");
  let isPaused = false,
    galleryPosition = 0;
  galPause.addEventListener("click", () => {
    isPaused = !isPaused;
    galleryTrack.style.animationPlayState = isPaused ? "paused" : "running";
    galPause.innerHTML = isPaused
      ? '<i class="fa-solid fa-play"></i>'
      : '<i class="fa-solid fa-pause"></i>';
  });
  galPrev.addEventListener("click", () => {
    galleryTrack.style.animation = "none";
    galleryPosition += 375;
    if (galleryPosition > 0) galleryPosition = -4500;
    galleryTrack.style.transform = `translateX(${galleryPosition}px)`;
  });
  galNext.addEventListener("click", () => {
    galleryTrack.style.animation = "none";
    galleryPosition -= 375;
    if (galleryPosition < -4500) galleryPosition = 0;
    galleryTrack.style.transform = `translateX(${galleryPosition}px)`;
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const galItems = document.querySelectorAll(".gal-item:not(.empty)");
  let currentImgIndex = 0;
  const galleryImages = [];
  galItems.forEach((item, index) => {
    const img = item.querySelector("img");
    if (img) galleryImages.push(img.src);
    item.addEventListener("click", () => {
      currentImgIndex = index;
      lightbox.classList.add("active");
      lbImg.src = galleryImages[index];
    });
  });
  document
    .getElementById("lbClose")
    .addEventListener("click", () => lightbox.classList.remove("active"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });
  document.getElementById("lbPrev").addEventListener("click", () => {
    currentImgIndex =
      (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[currentImgIndex];
  });
  document.getElementById("lbNext").addEventListener("click", () => {
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    lbImg.src = galleryImages[currentImgIndex];
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

  // ===== CHATBOT WITH GEMINI AI =====
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  chatbotToggle.addEventListener("click", () =>
    chatbotWindow.classList.toggle("active"),
  );
  chatbotClose.addEventListener("click", () =>
    chatbotWindow.classList.remove("active"),
  );

  // ⚠️ PUT YOUR GEMINI API KEY HERE - Get it from: https://aistudio.google.com/app/apikey
  const GEMINI_API_KEY = "AIzaSyCH0LXj5NeRI22fiydYJ8cbMoW271Ef2b0";

  // Context about Chathunga for the AI
  const CHATHUNGA_CONTEXT = `
You are Chathunga Bimsara's AI assistant. Here's information about him:

**Personal Info:**
- Name: Chathunga Bimsara
- Location: Ampegama, Galle, Sri Lanka
- Phone: +94 76 794 5968
- Email: wggachathungabimsara2007@gmail.com
- Birthday: November 02, 2007

**Education:**
- Currently studying Software Engineering at IJSE (Institute of Java Software Engineering) - Higher National Diploma
- Completed English Graduate certification from SLEGA (2025)
- G.C.E. O/L from G/ Ethkandura Seewali M.V. National College (2017-2024)

**Skills:**
- Programming Languages: Java (95%), JavaScript (85%), Python (75%), SQL (80%), HTML5 (90%), CSS3 (90%)
- Tools: Git, GitHub, Docker, VS Code, IntelliJ IDEA
- Databases: MySQL (95%), PostgreSQL (70%)
- Design: Figma (85%), Adobe Photoshop (70%), Adobe Premiere Pro (80%)

**Projects:**
1. Stock System - Terminal-based inventory management in Java
2. Connect 4 Game - Two-player game with OOP principles
3. Flex Gym System - Gym membership management with MVC architecture

**Services:** Web Development, Java Applications, Database Design, Responsive Design, UI/UX Design, Open Source

**Social Links:**
- LinkedIn: linkedin.com/in/chathunga-bimsara-02a728387/
- GitHub: github.com/chathunga2007
- YouTube: @chathungabimsara2007
- Instagram: @chathunga200711
- X/Twitter: @ChathungaB2007

Be helpful, friendly, and provide accurate information. Answer questions about skills, projects, education, or how to contact him. Keep responses concise but informative.
`;

  function addMessage(text, isUser, isError = false) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${isUser ? "user" : isError ? "error" : "bot"}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator() {
    const typing = document.createElement("div");
    typing.className = "typing-indicator";
    typing.id = "typingIndicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById("typingIndicator");
    if (typing) typing.remove();
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = "";
    addTypingIndicator();

    try {
      // Check if API key is configured
      if (
        GEMINI_API_KEY === "AIzaSyCH0LXj5NeRI22fiydYJ8cbMoW271Ef2b0" ||
        !GEMINI_API_KEY
      ) {
        removeTypingIndicator();
        // Fallback to basic responses if no API key
        const lowerMsg = message.toLowerCase();
        let response =
          "Thanks for your message! I'm Chathunga's AI assistant. Ask me about his skills, projects, education, or contact info!";

        if (lowerMsg.includes("skill"))
          response =
            "Chathunga is skilled in Java (95%), JavaScript (85%), Python (75%), SQL (80%), HTML5 (90%), CSS3 (90%), and various tools like Git, GitHub, Docker, VS Code, and IntelliJ IDEA.";
        else if (lowerMsg.includes("project"))
          response =
            "Chathunga has built: 1) Stock System - Terminal inventory management, 2) Connect 4 Game - Two-player game, 3) Flex Gym System - Gym membership management with MVC.";
        else if (lowerMsg.includes("contact"))
          response =
            "You can contact Chathunga at:\n📧 wggachathungabimsara2007@gmail.com\n📱 +94 76 794 5968\n📍 Ampegama, Galle, Sri Lanka";
        else if (lowerMsg.includes("education"))
          response =
            "Chathunga is currently pursuing a Higher National Diploma in Software Engineering at IJSE. He completed his O/L from G/ Ethkandura Seewali M.V. National College.";
        else if (lowerMsg.includes("hello") || lowerMsg.includes("hi"))
          response =
            "Hello! 👋 Nice to meet you! I'm Chathunga's AI assistant. How can I help you today?";
        else if (lowerMsg.includes("name"))
          response =
            "I'm Chathunga Bimsara's AI assistant! Chathunga is a Software Engineering undergraduate at IJSE, Sri Lanka.";

        addMessage(response);
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${CHATHUNGA_CONTEXT}\n\nUser Question: ${message}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        },
      );

      removeTypingIndicator();

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't process that. Please try again!";
      addMessage(aiResponse);
    } catch (error) {
      removeTypingIndicator();
      addMessage(
        "Sorry, I'm having trouble connecting. Please try again or contact Chathunga directly at wggachathungabimsara2007@gmail.com",
        false,
        true,
      );
    }
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
