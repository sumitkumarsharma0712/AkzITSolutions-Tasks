// Portfolio Main Interactions & Animations

document.addEventListener("DOMContentLoaded", () => {
  // Theme Switching
  initThemeSwitcher();

  // Typewriter Effect
  initTypewriter();

  // Scrollspy & Sticky Navbar
  initScrollspy();

  // Mobile Menu Toggle
  initMobileMenu();

  // Scroll Reveal Animations & Skill Meters
  initScrollReveal();

  // Contact Form Logic
  initContactForm();
});

/* ==========================================
   THEME SWITCHING LOGIC
   ========================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Default to dark unless explicit light theme is saved
  let activeTheme = savedTheme || (systemPrefersDark ? "dark" : "dark");
  
  document.documentElement.setAttribute("data-theme", activeTheme);
  updateThemeToggleIcon(activeTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    updateThemeToggleIcon(newTheme);
  });
}

function updateThemeToggleIcon(theme) {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  if (theme === "light") {
    // Show Moon Icon for switching to dark
    themeToggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Show Sun Icon for switching to light
    themeToggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
}

/* ==========================================
   TYPEWRITER EFFECT
   ========================================== */
function initTypewriter() {
  const element = document.getElementById("typewriter-text");
  if (!element) return;

  const roles = [
    "Full Stack Developer",
    "C++ & Python Developer",
    "CCNA Certified Networks Geek",
    "B.Tech CSE Student"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120; // typing speed

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 60; // deleting speed
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 120; // normal speed
    }

    // Finished typing word
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================
   SCROLLSPY & NAVIGATION HIGHLIGHT
   ========================================== */
function initScrollspy() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Scrollspy & sticky class
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    // Sticky nav
    if (scrollPosition > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Scrollspy active highlight
    let activeSectionId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSectionId = sectionId;
      }
    });

    if (activeSectionId) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${activeSectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

/* ==========================================
   MOBILE DRAWER NAVIGATION
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      toggleBtn.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS & SKILL METERS
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".section-header, .about-left, .about-right, .skills-wrapper, .projects-wrapper, .experience-wrapper, .achievements-grid, .contact-grid"
  );

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        
        // Trigger specific action for skills section
        if (entry.target.classList.contains("skills-wrapper")) {
          animateSkillMeters();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

function animateSkillMeters() {
  const progressBars = document.querySelectorAll(".skill-progress-fill");
  progressBars.forEach(bar => {
    const targetWidth = bar.getAttribute("data-percent") + "%";
    bar.style.width = targetWidth;
  });
}

/* ==========================================
   CONTACT FORM SUBMISSION SIMULATION
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contact-submit-btn");
  const formStatus = document.getElementById("formStatus");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Visual loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="contact-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:18px;height:18px;animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle><path d="M4 12a8 8 0 0 1 8-8" stroke="#fff"></path></svg>
      Sending Message...
    `;

    // Extract inputs
    const name = document.getElementById("formName").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const subject = document.getElementById("formSubject").value.trim();
    const message = document.getElementById("formMessage").value.trim();

    // Simple validation (redundant with HTML5 but good for robustness)
    if (!name || !email || !message) {
      showStatus("Please fill in all required fields.", "error");
      resetBtn();
      return;
    }

    // Simulate Network Request
    setTimeout(() => {
      // Show success
      showStatus("Thank you, Sumit will get back to you shortly!", "success");
      contactForm.reset();
      resetBtn();
    }, 1800);
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    
    // Hide status after 5s
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }

  function resetBtn() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      Send Message
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    `;
  }
}

// Injected contact spinner styles
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .contact-spinner {
    margin-right: 8px;
  }
`;
document.head.appendChild(globalStyle);
