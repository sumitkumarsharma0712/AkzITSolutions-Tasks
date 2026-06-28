// Mind Guardian Interactive Simulation Engine

// Localization dictionary for the Mind Guardian mockup simulation
const simTranslations = {
  en: {
    dashboard: "Dashboard",
    symptomChecker: "AI Symptom Checker",
    appointments: "Appointments",
    reminders: "Medicine Reminders",
    forum: "Peer Forum",
    emergency: "Emergency",
    admin: "Admin Panel",
    welcome: "Welcome back, User",
    dailyQuote: "Small steps every day lead to big progress.",
    moodPrompt: "How are you feeling today?",
    trackerLabel: "Weekly Mental Fitness Trend",
    checkBtn: "Analyze Symptoms",
    inputPlaceholder: "Describe how you're feeling (e.g., 'stressed', 'tired', 'anxious')...",
    analyzing: "Analyzing your mental state...",
    therapistLabel: "Select Specialist",
    dateLabel: "Select Date",
    slotLabel: "Available Slots",
    bookBtn: "Confirm Appointment",
    reminderLabel: "Active Reminders",
    addBtn: "Add",
    newReminderPlaceholder: "Medication name & time...",
    postBtn: "Post Anonymously",
    postPlaceholder: "Share what's on your mind...",
    emergencyWarning: "If you are in immediate danger, please contact emergency lines.",
    sosBtn: "ACTIVATE EMERGENCY ALERTS",
    adminStats: "System Analytics Overview"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    symptomChecker: "एआई लक्षण जांचकर्ता",
    appointments: "नियुक्तियां",
    reminders: "दवा अनुस्मारक",
    forum: "सहकर्मी मंच",
    emergency: "आपातकालीन",
    admin: "एडमिन पैनल",
    welcome: "वापसी पर स्वागत है, उपयोगकर्ता",
    dailyQuote: "हर दिन छोटे कदम बड़ी प्रगति की ओर ले जाते हैं।",
    moodPrompt: "आज आप कैसा महसूस कर रहे हैं?",
    trackerLabel: "साप्ताहिक मानसिक स्वास्थ्य रुझान",
    checkBtn: "लक्षणों का विश्लेषण करें",
    inputPlaceholder: "वर्णन करें कि आप कैसा महसूस कर रहे हैं (जैसे, 'तनाव', 'थका हुआ')...",
    analyzing: "आपकी मानसिक स्थिति का विश्लेषण किया जा रहा है...",
    therapistLabel: "विशेषज्ञ चुनें",
    dateLabel: "तारीख चुनें",
    slotLabel: "उपलब्ध स्लॉट",
    bookBtn: "अपॉइंटमेंट की पुष्टि करें",
    reminderLabel: "सक्रिय अनुस्मारक",
    addBtn: "जोड़ें",
    newReminderPlaceholder: "दवा का नाम और समय...",
    postBtn: "अनाम रूप से पोस्ट करें",
    postPlaceholder: "अपने विचार साझा करें...",
    emergencyWarning: "यदि आप तत्काल खतरे में हैं, तो कृपया आपातकालीन लाइनों से संपर्क करें।",
    sosBtn: "आपातकालीन अलर्ट सक्रिय करें",
    adminStats: "सिस्टम विश्लेषिकी अवलोकन"
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    symptomChecker: "एआय लक्षण तपासक",
    appointments: "भेटी",
    reminders: "औषध स्मरणपत्रे",
    forum: "सहकारी मंच",
    emergency: "आणीबाणी",
    admin: "अ‍ॅडमिन पॅनेल",
    welcome: "पुन्हा स्वागत आहे, युझर",
    dailyQuote: "दररोजचे छोटे पाऊल मोठ्या प्रगतीकडे नेते.",
    moodPrompt: "आज तुम्हाला कसे वाटत आहे?",
    trackerLabel: "साप्ताहिक मानसिक आरोग्य कल",
    checkBtn: "लक्षणे तपासा",
    inputPlaceholder: "तुम्हाला कसे वाटत आहे याचे वर्णन करा (उदा. 'तणाव', 'थकल्यासारखे')...",
    analyzing: "तुमच्या मानसिक स्थितीचे विश्लेषण करत आहे...",
    therapistLabel: "तज्ज्ञ निवडा",
    dateLabel: "तारीख निवडा",
    slotLabel: "उपलब्ध वेळा",
    bookBtn: "अपॉइंटमेंट निश्चित करा",
    reminderLabel: "सक्रिय स्मरणपत्रे",
    addBtn: "जोडा",
    newReminderPlaceholder: "औषधाचे नाव आणि वेळ...",
    postBtn: "अनामिकपणे पोस्ट करा",
    postPlaceholder: "तुमच्या मनात काय आहे ते शेअर करा...",
    emergencyWarning: "आपण तात्काळ धोक्यात असल्यास, कृपया आणीबाणी क्रमांकावर संपर्क साधा.",
    sosBtn: "आणीबाणी सतर्कता सक्रिय करा",
    adminStats: "सिस्टम विश्लेषण विहंगावलोकन"
  }
};

// Application State for Simulator
const simState = {
  language: 'en',
  theme: 'dark',
  appointmentsCount: 3,
  usersCount: 1420,
  activeAlerts: 0,
  reminders: [
    { id: 1, name: "Vitamin D3 - 9:00 AM", checked: true },
    { id: 2, name: "Mindfulness Breathing - 2:00 PM", checked: false },
    { id: 3, name: "Ashwagandha - 9:00 PM", checked: false }
  ],
  forumPosts: [
    { id: 1, author: "Anonymous Leaf", time: "2 hours ago", content: "Any advice on handling final year project anxiety? Feel like my mind is constantly racing." },
    { id: 2, author: "Anonymous Wave", time: "5 hours ago", content: "Just wanted to remind everyone to drink some water and take a 5-minute screen break! You've got this." }
  ]
};

// Initialize simulation once DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  setupSimulationNavigation();
  setupSimulationControls();
  setupSymptomChecker();
  setupAppointmentScheduler();
  setupMedicineReminders();
  setupPeerForum();
  setupEmergencyPanel();
  updateSimulationStats();
});

// Tab Switching
function setupSimulationNavigation() {
  const menuItems = document.querySelectorAll(".sim-menu-item");
  const tabContents = document.querySelectorAll(".sim-tab-content");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      // Deactivate all
      menuItems.forEach(mi => mi.classList.remove("active"));
      tabContents.forEach(tc => tc.classList.remove("active"));

      // Activate clicked
      item.classList.add("active");
      const targetTabId = item.getAttribute("data-sim-tab");
      const targetTab = document.getElementById(`sim-tab-${targetTabId}`);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });
}

// Language and Theme controls within Simulation
function setupSimulationControls() {
  const langSelect = document.getElementById("sim-lang-select");
  const simThemeToggle = document.getElementById("sim-theme-toggle");
  const browserContent = document.querySelector(".browser-content");

  // Lang switcher
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      simState.language = selectedLang;
      applySimulationTranslations(selectedLang);
    });
  }

  // Simulator-only Theme Toggle
  if (simThemeToggle) {
    simThemeToggle.addEventListener("click", () => {
      const container = document.querySelector(".browser-mockup");
      const currentTheme = container.getAttribute("data-sim-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      container.setAttribute("data-sim-theme", newTheme);
      
      // Update toggle icon
      if (newTheme === "light") {
        simThemeToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      } else {
        simThemeToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      }
    });
  }
}

// Apply translation text dynamically
function applySimulationTranslations(lang) {
  const dict = simTranslations[lang];
  
  // Translate Sidebar links
  document.querySelectorAll("[data-translate-sidebar]").forEach(el => {
    const key = el.getAttribute("data-translate-sidebar");
    const labelSpan = el.querySelector("span");
    if (labelSpan && dict[key]) {
      labelSpan.textContent = dict[key];
    }
  });

  // Translate specific page components
  document.querySelectorAll("[data-translate-key]").forEach(el => {
    const key = el.getAttribute("data-translate-key");
    if (dict[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", dict[key]);
      } else {
        el.textContent = dict[key];
      }
    }
  });
}

// Symptom Checker Logic
function setupSymptomChecker() {
  const analyzeBtn = document.getElementById("sim-symptom-btn");
  const symptomInput = document.getElementById("sim-symptom-input");
  const resultDiv = document.getElementById("sim-symptom-result");

  if (!analyzeBtn) return;

  analyzeBtn.addEventListener("click", () => {
    const inputVal = symptomInput.value.trim().toLowerCase();
    if (!inputVal) {
      resultDiv.innerHTML = `<span style="color: #ef4444;">Please type something first!</span>`;
      return;
    }

    const dict = simTranslations[simState.language];
    resultDiv.innerHTML = `<div class="sim-spinner"></div> <span style="margin-left: 8px;">${dict.analyzing}</span>`;
    
    // Simulate loading for 1.2s
    setTimeout(() => {
      let advice = "";
      if (inputVal.includes("stress") || inputVal.includes("anxious") || inputVal.includes("tension") || inputVal.includes("panic")) {
        advice = `
          <strong>AI Insights: High stress triggers detected.</strong><br>
          • Recommended Action: Try the 4-7-8 Breathing Technique right now (Inhale 4s, Hold 7s, Exhale 8s).<br>
          • Tip: Consider listening to white noise or scheduling a brief chat with an empathetic listener on our <em>Peer Support Forum</em>.
        `;
      } else if (inputVal.includes("sad") || inputVal.includes("depressed") || inputVal.includes("lonely") || inputVal.includes("down")) {
        advice = `
          <strong>AI Insights: Mild depressive index flagged.</strong><br>
          • Recommended Action: Give yourself permission to rest. Isolation can amplify feelings; write down your thoughts anonymously in our <em>Peer Forum</em>.<br>
          • Tip: A 10-minute sunlight walk works wonders for serotonin synthesis.
        `;
      } else if (inputVal.includes("headache") || inputVal.includes("tired") || inputVal.includes("fatigue") || inputVal.includes("exhaust")) {
        advice = `
          <strong>AI Insights: Physical fatigue detected.</strong><br>
          • Recommended Action: Hydrate immediately (aim for 500ml of water) and disconnect from screens for 20 mins.<br>
          • Tip: Screen fatigue mimics mental burnout. Rest your eyes!
        `;
      } else {
        advice = `
          <strong>AI Insights: Routine mental check complete.</strong><br>
          • Recommended Action: Keep tracking your daily moods. Taking proactive control of mental health is a massive victory.<br>
          • Tip: Set a recurring <em>Medicine/Mindfulness Reminder</em> to stay grounded.
        `;
      }
      resultDiv.innerHTML = `<div style="text-align: left; line-height: 1.5; color: #10b981;">${advice}</div>`;
    }, 1200);
  });
}

// Appointment Scheduler
function setupAppointmentScheduler() {
  const bookBtn = document.getElementById("sim-book-btn");
  const therapistSelect = document.getElementById("sim-therapist");
  const slotBtns = document.querySelectorAll(".sim-slot-btn");
  const resultDiv = document.getElementById("sim-book-result");
  let selectedSlot = "";

  slotBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      slotBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSlot = btn.textContent;
    });
  });

  if (!bookBtn) return;

  bookBtn.addEventListener("click", () => {
    const therapist = therapistSelect.value;
    if (!selectedSlot) {
      resultDiv.innerHTML = `<span style="color: #ef4444; font-size: 0.75rem;">Please select a time slot!</span>`;
      return;
    }

    resultDiv.innerHTML = `<span style="color: #10b981; font-size: 0.75rem; font-weight: 600;">✓ Appt booked with ${therapist} at ${selectedSlot}!</span>`;
    
    // Increment admin stats
    simState.appointmentsCount++;
    updateSimulationStats();
    
    // Clear selection
    setTimeout(() => {
      resultDiv.innerHTML = "";
      slotBtns.forEach(b => b.classList.remove("active"));
      selectedSlot = "";
    }, 3500);
  });
}

// Medicine/Mindfulness Reminders
function setupMedicineReminders() {
  const addBtn = document.getElementById("sim-reminder-btn");
  const reminderInput = document.getElementById("sim-reminder-input");
  const remindersList = document.getElementById("sim-reminders-list");

  if (!addBtn) return;

  // Render initial list
  renderReminders();

  addBtn.addEventListener("click", () => {
    const val = reminderInput.value.trim();
    if (!val) return;

    simState.reminders.push({
      id: Date.now(),
      name: val,
      checked: false
    });

    reminderInput.value = "";
    renderReminders();
  });

  function renderReminders() {
    remindersList.innerHTML = "";
    simState.reminders.forEach(reminder => {
      const item = document.createElement("div");
      item.className = `sim-list-item ${reminder.checked ? 'checked' : ''}`;
      item.innerHTML = `
        <span>${reminder.name}</span>
        <div class="sim-checkbox ${reminder.checked ? 'checked' : ''}" data-id="${reminder.id}"></div>
      `;

      // Checkbox click event
      item.querySelector(".sim-checkbox").addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const target = simState.reminders.find(r => r.id === id);
        if (target) {
          target.checked = !target.checked;
          renderReminders();
        }
      });

      remindersList.appendChild(item);
    });
  }
}

// Peer Forum
function setupPeerForum() {
  const postBtn = document.getElementById("sim-post-btn");
  const postInput = document.getElementById("sim-post-input");
  const postsContainer = document.getElementById("sim-forum-posts");

  if (!postBtn) return;

  renderPosts();

  postBtn.addEventListener("click", () => {
    const val = postInput.value.trim();
    if (!val) return;

    // Add to state
    simState.forumPosts.unshift({
      id: Date.now(),
      author: "Anonymous Seed",
      time: "Just now",
      content: val
    });

    postInput.value = "";
    renderPosts();

    // Increment users count in admin as simulated activity
    simState.usersCount += Math.floor(Math.random() * 3) + 1;
    updateSimulationStats();
  });

  function renderPosts() {
    postsContainer.innerHTML = "";
    simState.forumPosts.forEach(post => {
      const card = document.createElement("div");
      card.className = "sim-forum-post";
      card.innerHTML = `
        <div class="sim-post-meta">
          <span>${post.author}</span>
          <span>${post.time}</span>
        </div>
        <div class="sim-post-content">${post.content}</div>
      `;
      postsContainer.appendChild(card);
    });
  }
}

// Emergency SOS Panel
function setupEmergencyPanel() {
  const sosBtn = document.getElementById("sim-sos-btn");
  const rootMockup = document.querySelector(".browser-mockup");

  if (!sosBtn) return;

  sosBtn.addEventListener("click", () => {
    simState.activeAlerts++;
    updateSimulationStats();

    // Apply intense screenshake & red overlay visual feedback
    rootMockup.style.animation = "shake 0.5s ease";
    sosBtn.textContent = "ALERTS DISPATCHED TO DEAR ONES!";
    sosBtn.style.background = "#22c55e";

    setTimeout(() => {
      rootMockup.style.animation = "";
      sosBtn.textContent = simTranslations[simState.language].sosBtn;
      sosBtn.style.background = "#ef4444";
    }, 3000);
  });
}

// Update figures inside the Admin panel
function updateSimulationStats() {
  const activeUsersVal = document.getElementById("sim-val-users");
  const apptsBookedVal = document.getElementById("sim-val-appts");
  const alertsVal = document.getElementById("sim-val-alerts");

  if (activeUsersVal) activeUsersVal.textContent = simState.usersCount;
  if (apptsBookedVal) apptsBookedVal.textContent = simState.appointmentsCount;
  if (alertsVal) {
    alertsVal.textContent = simState.activeAlerts;
    if (simState.activeAlerts > 0) {
      alertsVal.style.color = "#ef4444";
    }
  }
}

// CSS injection for browser mockup internal loader & shake
const style = document.createElement('style');
style.textContent = `
  .sim-spinner {
    border: 2px solid rgba(255,255,255,0.1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border-left-color: #3b82f6;
    animation: simSpin 0.8s linear infinite;
    display: inline-block;
  }
  @keyframes simSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes shake {
    0%, 100% { transform: translate(0, 0); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 0); }
    20%, 40%, 60%, 80% { transform: translate(4px, 0); }
  }
`;
document.head.appendChild(style);
