/**
 * ==========================================================
 * ZENITHTASK CORE JAVASCRIPT CONTROLLER
 * Single Page Application Logic, State Management & Persistence
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------
    // 1. GLOBAL STATE & APPLICATION CONFIG
    // ------------------------------------------------------
    let state = {
        users: JSON.parse(localStorage.getItem('zenith_users')) || [],
        currentUser: JSON.parse(localStorage.getItem('zenith_current_user')) || null,
        tasks: JSON.parse(localStorage.getItem('zenith_tasks')) || [],
        notifications: JSON.parse(localStorage.getItem('zenith_notifications')) || [],
        currentView: 'auth',
        activeFilters: {
            status: 'all',
            category: 'all',
            search: '',
            sort: 'date-added-desc'
        },
        draggedElement: null,
        draggedTaskId: null,
        subtaskFormsCount: 0
    };

    // Milestone Badges Definition
    const BADGES_DATABASE = [
        { id: 'first_step', name: 'First Step', desc: 'Completed your first task!', icon: 'fa-shoe-prints' },
        { id: 'consistency', name: 'Consistency', desc: 'Completed 3 tasks!', icon: 'fa-calendar-check' },
        { id: 'super_achiever', name: 'Super Achiever', desc: 'Completed 5 tasks!', icon: 'fa-crown' },
        { id: 'hot_streak', name: 'Hot Streak', desc: 'Achieved a 3+ day streak!', icon: 'fa-fire-flame-curved' },
        { id: 'subtask_ninja', name: 'Subtask Ninja', desc: 'Finished 5 checklist steps!', icon: 'fa-user-ninja' },
        { id: 'zen_master', name: 'Zen Master', desc: 'Reached Level 3!', icon: 'fa-yin-yang' }
    ];

    // DOM Elements Cache
    const elements = {
        // Nav bar
        mainNav: document.getElementById('main-nav'),
        navLinks: document.querySelectorAll('.nav-links button'),
        navUsername: document.getElementById('nav-username'),
        navAvatarImg: document.getElementById('nav-avatar-img'),
        themeToggle: document.getElementById('theme-toggle'),
        logoutButton: document.getElementById('logout-button'),
        notificationBadge: document.getElementById('notification-badge'),
        navXpLevel: document.getElementById('nav-xp-level'),
        navXpPoints: document.getElementById('nav-xp-points'),

        // View containers
        views: document.querySelectorAll('.spa-view'),
        viewAuth: document.getElementById('view-auth'),
        viewDashboard: document.getElementById('view-dashboard'),
        viewNotifications: document.getElementById('view-notifications'),
        viewProfile: document.getElementById('view-profile'),

        // Authentication Forms
        loginCard: document.getElementById('auth-login-card'),
        signupCard: document.getElementById('auth-signup-card'),
        loginForm: document.getElementById('login-form'),
        signupForm: document.getElementById('signup-form'),
        goToSignupBtn: document.getElementById('go-to-signup'),
        goToLoginBtn: document.getElementById('go-to-login'),
        forgotPasswordLink: document.getElementById('forgot-password-link'),

        // Task Dashboard Elements
        taskForm: document.getElementById('task-creation-form'),
        taskIdInput: document.getElementById('edit-task-id'),
        taskTitleInput: document.getElementById('task-title'),
        taskDescInput: document.getElementById('task-desc'),
        voiceTaskBtn: document.getElementById('voice-task-btn'),
        smartCatLabel: document.getElementById('smart-cat-label'),
        subtaskFormContainer: document.getElementById('subtask-form-container'),
        addSubtaskInputBtn: document.getElementById('add-subtask-input-btn'),
        taskCategorySelect: document.getElementById('task-category'),
        taskPrioritySelect: document.getElementById('task-priority'),
        taskDueDateInput: document.getElementById('task-due-date'),
        taskRecurrenceSelect: document.getElementById('task-recurrence'),
        taskCollaboratorInput: document.getElementById('task-collaborator'),
        saveTaskBtn: document.getElementById('save-task-btn'),
        cancelEditBtn: document.getElementById('cancel-edit-btn'),
        submitTaskText: document.getElementById('submit-task-text'),
        submitTaskIcon: document.getElementById('submit-task-icon'),

        // AI Suggestions & Analytics
        aiSuggestionBox: document.getElementById('ai-suggestion-box'),
        analyticsSvgChart: document.getElementById('analytics-svg-chart'),

        // Progress Panel & Stats
        progressCircle: document.querySelector('.progress-ring__circle'),
        progressText: document.getElementById('progress-text'),
        progressStreakLabel: document.getElementById('progress-streak-label'),
        statTotal: document.getElementById('stat-total-count'),
        statPending: document.getElementById('stat-pending-count'),
        statCompleted: document.getElementById('stat-completed-count'),

        // Backup
        exportTasksBtn: document.getElementById('export-tasks-btn'),
        importTasksBtn: document.getElementById('import-tasks-btn'),
        importTasksFile: document.getElementById('import-tasks-file'),

        // Task Filters & List
        taskSearch: document.getElementById('task-search-input'),
        taskSort: document.getElementById('task-sort-select'),
        statusFilters: document.querySelectorAll('[data-status-filter]'),
        categoryFilters: document.querySelectorAll('[data-cat-filter]'),
        taskList: document.getElementById('task-list-element'),
        emptyState: document.getElementById('empty-state'),

        // Notifications
        notificationList: document.getElementById('notification-list-element'),
        noNotificationsState: document.getElementById('no-notifications-state'),
        markAllReadBtn: document.getElementById('mark-all-read-btn'),

        // Profile Form
        profileForm: document.getElementById('profile-update-form'),
        profileNameInput: document.getElementById('profile-name'),
        profileEmailInput: document.getElementById('profile-email'),
        profileAvatarSeedInput: document.getElementById('profile-avatar-seed'),
        profileAvatarPreview: document.getElementById('profile-avatar-preview'),
        profilePreviewName: document.getElementById('profile-preview-name'),
        profilePreviewEmail: document.getElementById('profile-preview-email'),
        settingsDarkMode: document.getElementById('settings-darkmode-checkbox'),
        profileRankBadge: document.getElementById('profile-rank-badge'),
        profileXpStats: document.getElementById('profile-xp-stats'),
        profileXpBarFill: document.getElementById('profile-xp-bar-fill'),
        achievementsBadgesGrid: document.getElementById('achievements-badges-grid')
    };

    // Initialize circular progress offset properties
    let radius, circumference;
    if (elements.progressCircle) {
        radius = elements.progressCircle.r.baseVal.value;
        circumference = radius * 2 * Math.PI;
        elements.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        elements.progressCircle.style.strokeDashoffset = circumference;
    }

    // Set default due date on task form to tomorrow
    const setTomorrowDueDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        elements.taskDueDateInput.value = tomorrow.toISOString().split('T')[0];
    };

    // ------------------------------------------------------
    // CONFETTI PHYSICS SYSTEM (Interactive Completion Blast)
    // ------------------------------------------------------
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiActive = false;
    let particles = [];
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor() {
            this.x = canvas.width / 2 + (Math.random() - 0.5) * 150;
            this.y = canvas.height + 20;
            this.size = Math.random() * 8 + 6;
            this.speedX = (Math.random() - 0.5) * 12;
            this.speedY = -Math.random() * 18 - 12;
            this.gravity = 0.45;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 12;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    const triggerConfetti = () => {
        if (confettiActive) return;
        confettiActive = true;
        particles = [];
        for (let i = 0; i < 90; i++) {
            particles.push(new ConfettiParticle());
        }
        animateConfetti();
    };

    const animateConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.update();
            p.draw();
            if (p.y < canvas.height + 20) {
                active = true;
            }
        });
        if (active) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiActive = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // ------------------------------------------------------
    // 2. SPA VIEW ROUTING MANAGER
    // ------------------------------------------------------
    const navigateTo = (viewName) => {
        // Auth check guard
        if (!state.currentUser && viewName !== 'auth') {
            viewName = 'auth';
        } else if (state.currentUser && viewName === 'auth') {
            viewName = 'dashboard';
        }

        state.currentView = viewName;

        // Hide all views & activate target view
        elements.views.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        const activeView = document.getElementById(`view-${viewName}`);
        if (activeView) {
            activeView.style.display = viewName === 'auth' ? 'flex' : 'block';
            // Trigger animation on next paint
            setTimeout(() => activeView.classList.add('active'), 50);
        }

        // Handle navigation bar visibility
        if (viewName === 'auth') {
            elements.mainNav.style.display = 'none';
        } else {
            elements.mainNav.style.display = 'block';
            
            // Sync active states on navbar buttons
            elements.navLinks.forEach(btn => {
                if (btn.getAttribute('data-view') === viewName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Perform context-specific updates
            if (viewName === 'dashboard') {
                renderTasks();
                updateStats();
                generateAISuggestion();
                renderAnalyticsChart();
            } else if (viewName === 'notifications') {
                renderNotifications();
            } else if (viewName === 'profile') {
                populateProfileForm();
            }
        }

        // Scroll page to top on view changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // SPA Navigation Event Handlers
    elements.navLinks.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.getAttribute('data-view');
            navigateTo(targetView);
        });
    });

    // Handle user avatar pill click to jump to profile view
    document.querySelector('.user-pill').addEventListener('click', () => {
        navigateTo('profile');
    });

    // ------------------------------------------------------
    // 3. THEME TOGGLER (DARK / LIGHT MODE)
    // ------------------------------------------------------
    const initTheme = () => {
        const savedTheme = localStorage.getItem('zenith_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        elements.settingsDarkMode.checked = savedTheme === 'dark';
        updateThemeTogglerIcon(savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('zenith_theme', newTheme);
        elements.settingsDarkMode.checked = newTheme === 'dark';
        updateThemeTogglerIcon(newTheme);
    };

    const updateThemeTogglerIcon = (theme) => {
        const icon = elements.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    };

    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.settingsDarkMode.addEventListener('change', toggleTheme);

    // Password visibility toggle helpers
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });
    });

    // ------------------------------------------------------
    // 4. MOCK AUTHENTICATION SYSTEM
    // ------------------------------------------------------
    const showSignup = () => {
        elements.loginCard.style.display = 'none';
        elements.signupCard.style.display = 'block';
    };

    const showLogin = () => {
        elements.signupCard.style.display = 'none';
        elements.loginCard.style.display = 'block';
    };

    elements.goToSignupBtn.addEventListener('click', showSignup);
    elements.goToLoginBtn.addEventListener('click', showLogin);

    elements.forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password recovery is mocked. Simply register a new account or sign in with any existing email.');
    });

    // Form Validators
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Signup form handler
    elements.signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const terms = document.getElementById('signup-terms').checked;

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        let hasError = false;

        if (!name) {
            document.getElementById('signup-name-error').textContent = 'Please enter your full name.';
            hasError = true;
        }
        if (!validateEmail(email)) {
            document.getElementById('signup-email-error').textContent = 'Please enter a valid email address.';
            hasError = true;
        } else if (state.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            document.getElementById('signup-email-error').textContent = 'This email is already registered.';
            hasError = true;
        }
        if (password.length < 6) {
            document.getElementById('signup-password-error').textContent = 'Password must be at least 6 characters.';
            hasError = true;
        }
        if (password !== confirmPassword) {
            document.getElementById('signup-confirm-password-error').textContent = 'Passwords do not match.';
            hasError = true;
        }
        if (!terms) {
            document.getElementById('signup-terms-error').textContent = 'You must agree to the Terms & Conditions.';
            hasError = true;
        }

        if (hasError) return;

        // Success - Save User
        const newUser = {
            id: 'u_' + Date.now(),
            name,
            email,
            password,
            avatarSeed: name.replace(/\s+/g, ''), // Remove whitespaces for random avatar seed
            streak: 0,
            lastCompletedDate: null,
            xp: 0,
            level: 1,
            unlockedBadges: []
        };

        state.users.push(newUser);
        localStorage.setItem('zenith_users', JSON.stringify(state.users));

        // Create notification
        addNotification(`Welcome, ${name}! Your account has been successfully created.`, 'system');

        // Automatically log in
        loginUser(newUser);
        elements.signupForm.reset();
    });

    // Login form handler
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('login-remember').checked;

        // Reset errors
        document.getElementById('login-email-error').textContent = '';
        document.getElementById('login-password-error').textContent = '';

        let hasError = false;

        if (!validateEmail(email)) {
            document.getElementById('login-email-error').textContent = 'Please enter a valid email address.';
            hasError = true;
        }
        if (!password) {
            document.getElementById('login-password-error').textContent = 'Password field cannot be empty.';
            hasError = true;
        }

        if (hasError) return;

        // Check user credentials
        const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            document.getElementById('login-password-error').textContent = 'Incorrect email or password.';
            return;
        }

        // Success - Login User
        loginUser(user, rememberMe);
        elements.loginForm.reset();
    });

    const loginUser = (user, rememberMe = false) => {
        state.currentUser = user;
        if (rememberMe) {
            localStorage.setItem('zenith_current_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('zenith_current_user', JSON.stringify(user));
        }
        
        // Update user state inside active app memory
        updateNavBarUserInfo();
        addNotification(`${user.name} logged into the workspace dashboard.`, 'system');
        navigateTo('dashboard');
    };

    const logoutUser = () => {
        addNotification(`${state.currentUser.name} signed out of session.`, 'system');
        state.currentUser = null;
        localStorage.removeItem('zenith_current_user');
        sessionStorage.removeItem('zenith_current_user');
        navigateTo('auth');
        showLogin();
    };

    elements.logoutButton.addEventListener('click', logoutUser);

    const updateNavBarUserInfo = () => {
        if (state.currentUser) {
            elements.navUsername.textContent = state.currentUser.name;
            elements.navAvatarImg.src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${state.currentUser.avatarSeed || 'Felix'}`;
            
            // Sync gamification levels in navbar
            if (state.currentUser.xp === undefined) state.currentUser.xp = 0;
            if (state.currentUser.level === undefined) state.currentUser.level = 1;
            
            elements.navXpLevel.textContent = `Lvl ${state.currentUser.level}`;
            elements.navXpPoints.textContent = `(${state.currentUser.xp % 100} / 100 XP)`;
        }
    };

    // Check session on start
    const checkActiveSession = () => {
        const sessionUser = sessionStorage.getItem('zenith_current_user');
        if (sessionUser) {
            state.currentUser = JSON.parse(sessionUser);
        }

        if (state.currentUser) {
            updateNavBarUserInfo();
            navigateTo('dashboard');
        } else {
            navigateTo('auth');
        }
    };

    // ------------------------------------------------------
    // 5. NOTIFICATION HUB & TASK REMINDERS
    // ------------------------------------------------------
    const addNotification = (text, type = 'system') => {
        const newNotif = {
            id: 'n_' + Date.now() + Math.random().toString(36).substring(2, 5),
            userId: state.currentUser ? state.currentUser.id : 'anonymous',
            text,
            type, // 'create', 'edit', 'delete', 'complete', 'system'
            timestamp: new Date().toISOString(),
            read: false
        };

        state.notifications.unshift(newNotif);
        // Cap at 100 notifications for memory performance
        if (state.notifications.length > 100) {
            state.notifications.pop();
        }
        localStorage.setItem('zenith_notifications', JSON.stringify(state.notifications));
        updateNotificationBadge();
        
        if (state.currentView === 'notifications') {
            renderNotifications();
        }
    };

    const updateNotificationBadge = () => {
        if (!state.currentUser) {
            elements.notificationBadge.style.display = 'none';
            return;
        }

        const unreadCount = state.notifications.filter(
            notif => notif.userId === state.currentUser.id && !notif.read
        ).length;

        if (unreadCount > 0) {
            elements.notificationBadge.textContent = unreadCount;
            elements.notificationBadge.style.display = 'inline-block';
        } else {
            elements.notificationBadge.style.display = 'none';
        }
    };

    const renderNotifications = () => {
        elements.notificationList.innerHTML = '';
        
        if (!state.currentUser) return;

        const userNotifs = state.notifications.filter(notif => notif.userId === state.currentUser.id);

        if (userNotifs.length === 0) {
            elements.noNotificationsState.style.display = 'flex';
            elements.markAllReadBtn.style.display = 'none';
            return;
        }

        elements.noNotificationsState.style.display = 'none';
        elements.markAllReadBtn.style.display = 'inline-flex';

        userNotifs.forEach(notif => {
            const li = document.createElement('li');
            li.className = `notification-item ${notif.read ? '' : 'unread'}`;
            li.setAttribute('data-id', notif.id);

            // Icon mapping
            let iconClass = 'fa-solid fa-circle-info';
            let iconTypeClass = 'notif-icon-system';
            
            switch (notif.type) {
                case 'create':
                    iconClass = 'fa-solid fa-plus';
                    iconTypeClass = 'notif-icon-create';
                    break;
                case 'edit':
                    iconClass = 'fa-solid fa-pen-to-square';
                    iconTypeClass = 'notif-icon-edit';
                    break;
                case 'delete':
                    iconClass = 'fa-solid fa-trash-can';
                    iconTypeClass = 'notif-icon-delete';
                    break;
                case 'complete':
                    iconClass = 'fa-solid fa-circle-check';
                    iconTypeClass = 'notif-icon-complete';
                    break;
            }

            const timeStr = formatRelativeTime(new Date(notif.timestamp));

            li.innerHTML = `
                <div class="notif-icon-wrapper ${iconTypeClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notif-content">
                    <span class="notif-text">${notif.text}</span>
                    <span class="notif-time">${timeStr}</span>
                </div>
            `;

            // Mark single notification as read on click
            li.addEventListener('click', () => {
                if (!notif.read) {
                    notif.read = true;
                    li.classList.remove('unread');
                    localStorage.setItem('zenith_notifications', JSON.stringify(state.notifications));
                    updateNotificationBadge();
                }
            });

            elements.notificationList.appendChild(li);
        });
    };

    // Helper for relative time text
    const formatRelativeTime = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    elements.markAllReadBtn.addEventListener('click', () => {
        if (!state.currentUser) return;
        
        state.notifications.forEach(notif => {
            if (notif.userId === state.currentUser.id) {
                notif.read = true;
            }
        });

        localStorage.setItem('zenith_notifications', JSON.stringify(state.notifications));
        updateNotificationBadge();
        renderNotifications();
    });

    // Check for due reminders on start
    const checkUpcomingTaskReminders = () => {
        if (!state.currentUser) return;
        const todayStr = new Date().toISOString().split('T')[0];
        
        const upcomingTasks = state.tasks.filter(
            t => t.userId === state.currentUser.id && !t.completed && t.dueDate === todayStr
        );

        upcomingTasks.forEach(task => {
            // Check if reminder was already generated recently to prevent flooding
            const remKey = `rem_${task.id}_${todayStr}`;
            if (!sessionStorage.getItem(remKey)) {
                addNotification(`Reminder: "${task.title}" is due today!`, 'system');
                sessionStorage.setItem(remKey, 'true');
            }
        });
    };

    // ------------------------------------------------------
    // 6. PROFILE & GAMIFICATION METRICS SYSTEM
    // ------------------------------------------------------
    const populateProfileForm = () => {
        if (!state.currentUser) return;

        elements.profileNameInput.value = state.currentUser.name;
        elements.profileEmailInput.value = state.currentUser.email;
        elements.profileAvatarSeedInput.value = state.currentUser.avatarSeed || '';
        
        // Populate preview panel
        elements.profilePreviewName.textContent = state.currentUser.name;
        elements.profilePreviewEmail.textContent = state.currentUser.email;
        elements.profileAvatarPreview.src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${state.currentUser.avatarSeed || 'Felix'}`;
        
        // Update gamification displays inside settings
        const lvl = state.currentUser.level || 1;
        const currentXP = state.currentUser.xp || 0;
        const nextLevelThreshold = lvl * 100;
        const prevLevelThreshold = (lvl - 1) * 100;
        const relativeXP = currentXP - prevLevelThreshold;
        
        // Compute rank title
        let rank = 'Rookie';
        if (lvl >= 2) rank = 'Developer Pro';
        if (lvl >= 3) rank = 'Productivity Ninja';
        if (lvl >= 5) rank = 'Zen Grandmaster';
        
        elements.profileRankBadge.textContent = `${rank} (Lvl ${lvl})`;
        elements.profileXpStats.textContent = `XP: ${currentXP} / ${nextLevelThreshold}`;
        
        const xpProgressPercentage = Math.min(Math.max(relativeXP, 0), 100);
        elements.profileXpBarFill.style.width = `${xpProgressPercentage}%`;

        renderBadgesList();
    };

    // Render locked / unlocked milestones
    const renderBadgesList = () => {
        elements.achievementsBadgesGrid.innerHTML = '';
        if (!state.currentUser) return;

        const unlocked = state.currentUser.unlockedBadges || [];

        BADGES_DATABASE.forEach(badge => {
            const isUnlocked = unlocked.includes(badge.id);
            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
            
            badgeEl.innerHTML = `
                <div class="badge-icon-wrapper">
                    <i class="fa-solid ${badge.icon}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
            `;
            elements.achievementsBadgesGrid.appendChild(badgeEl);
        });
    };

    // Add points XP and check level up milestones
    const earnXP = (points) => {
        if (!state.currentUser) return;

        let xp = state.currentUser.xp || 0;
        let oldLvl = state.currentUser.level || 1;
        
        xp += points;
        
        // Level up formula: each level takes 100 XP
        let newLvl = Math.floor(xp / 100) + 1;
        
        state.currentUser.xp = xp;
        state.currentUser.level = newLvl;

        if (newLvl > oldLvl) {
            addNotification(`Level Up! You reached Level ${newLvl}! 🎉`, 'system');
            triggerConfetti();
        }

        // Sync local storage
        syncCurrentUserState();
        updateNavBarUserInfo();
        
        if (state.currentView === 'profile') {
            populateProfileForm();
        }

        checkMilestoneBadges();
    };

    const checkMilestoneBadges = () => {
        if (!state.currentUser) return;
        const unlocked = state.currentUser.unlockedBadges || [];
        const userTasks = state.tasks.filter(t => t.userId === state.currentUser.id);
        const completedTasks = userTasks.filter(t => t.completed);
        
        let newUnlocks = [];

        // Check badge unlocks
        if (completedTasks.length >= 1 && !unlocked.includes('first_step')) {
            newUnlocks.push('first_step');
        }
        if (completedTasks.length >= 3 && !unlocked.includes('consistency')) {
            newUnlocks.push('consistency');
        }
        if (completedTasks.length >= 5 && !unlocked.includes('super_achiever')) {
            newUnlocks.push('super_achiever');
        }
        if ((state.currentUser.streak || 0) >= 3 && !unlocked.includes('hot_streak')) {
            newUnlocks.push('hot_streak');
        }
        
        // Checklist steps badge
        const completedSubtasksCount = state.tasks
            .filter(t => t.userId === state.currentUser.id)
            .reduce((acc, t) => acc + (t.subtasks ? t.subtasks.filter(s => s.completed).length : 0), 0);
        
        if (completedSubtasksCount >= 5 && !unlocked.includes('subtask_ninja')) {
            newUnlocks.push('subtask_ninja');
        }

        if ((state.currentUser.level || 1) >= 3 && !unlocked.includes('zen_master')) {
            newUnlocks.push('zen_master');
        }

        if (newUnlocks.length > 0) {
            state.currentUser.unlockedBadges = [...unlocked, ...newUnlocks];
            newUnlocks.forEach(bid => {
                const bObj = BADGES_DATABASE.find(x => x.id === bid);
                addNotification(`Achievement Unlocked: "${bObj.name}"! 🏆`, 'system');
            });
            syncCurrentUserState();
            triggerConfetti();
            if (state.currentView === 'profile') {
                renderBadgesList();
            }
        }
    };

    const syncCurrentUserState = () => {
        // Sync local DB users
        state.users = state.users.map(u => u.id === state.currentUser.id ? { ...state.currentUser } : u);
        localStorage.setItem('zenith_users', JSON.stringify(state.users));
        
        // Sync active session persistence
        const sessionCheck = sessionStorage.getItem('zenith_current_user');
        if (sessionCheck) {
            sessionStorage.setItem('zenith_current_user', JSON.stringify(state.currentUser));
        } else {
            localStorage.setItem('zenith_current_user', JSON.stringify(state.currentUser));
        }
    };

    // Change seed when clicking user avatar block
    document.querySelector('.avatar-selection-wrapper').addEventListener('click', () => {
        const randomSeeds = ['Apex', 'Gizmo', 'Buster', 'Coco', 'Rusty', 'Zero', 'Bolt', 'Rocky', 'Nova', 'Echo'];
        const currentSeedIndex = randomSeeds.indexOf(elements.profileAvatarSeedInput.value);
        let nextIndex = (currentSeedIndex + 1) % randomSeeds.length;
        if (nextIndex < 0) nextIndex = 0;
        
        const newSeed = randomSeeds[nextIndex];
        elements.profileAvatarSeedInput.value = newSeed;
        elements.profileAvatarPreview.src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${newSeed}`;
    });

    // Watch avatar seed input in real-time
    elements.profileAvatarSeedInput.addEventListener('input', (e) => {
        const seed = e.target.value.trim() || 'Felix';
        elements.profileAvatarPreview.src = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
    });

    elements.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = elements.profileNameInput.value.trim();
        const email = elements.profileEmailInput.value.trim();
        const avatarSeed = elements.profileAvatarSeedInput.value.trim() || 'Felix';

        if (!name || !validateEmail(email)) {
            alert('Please check fields for proper name and email structure.');
            return;
        }

        // Check email uniqueness if email is changing
        if (email.toLowerCase() !== state.currentUser.email.toLowerCase() && 
            state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            alert('This email address is already associated with another account.');
            return;
        }

        // Update current user
        state.currentUser.name = name;
        state.currentUser.email = email;
        state.currentUser.avatarSeed = avatarSeed;

        syncCurrentUserState();
        updateNavBarUserInfo();
        populateProfileForm();
        addNotification('User profile settings updated successfully.', 'edit');
        alert('Workspace profile configuration successfully synchronized!');
    });

    // ------------------------------------------------------
    // SPEECH TO TEXT & VOICE COMMANDS
    // ------------------------------------------------------
    let speechRecognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRec();
        speechRecognition.continuous = false;
        speechRecognition.lang = 'en-US';
        speechRecognition.interimResults = false;

        speechRecognition.onstart = () => {
            elements.voiceTaskBtn.classList.add('recording');
        };

        speechRecognition.onresult = (evt) => {
            const speechToTextResult = evt.results[0][0].transcript;
            elements.taskTitleInput.value = speechToTextResult;
            elements.voiceTaskBtn.classList.remove('recording');
            
            // Trigger smart categorization immediately on voice parsing
            detectSmartCategory(speechToTextResult);
        };

        speechRecognition.onerror = () => {
            elements.voiceTaskBtn.classList.remove('recording');
            alert('Speech recognition error occurred. Please check microphone access.');
        };

        speechRecognition.onend = () => {
            elements.voiceTaskBtn.classList.remove('recording');
        };
    } else {
        elements.voiceTaskBtn.style.display = 'none';
    }

    elements.voiceTaskBtn.addEventListener('click', () => {
        if (speechRecognition) {
            speechRecognition.start();
        }
    });

    // ------------------------------------------------------
    // SMART KEYWORD CATEGORIZER
    // ------------------------------------------------------
    const detectSmartCategory = (titleText) => {
        const text = titleText.toLowerCase();
        let detectedCategory = null;

        // Keyword matching
        if (/buy|shop|grocery|groceries|market|cost|store/i.test(text)) {
            detectedCategory = 'Shopping';
        } else if (/meeting|work|code|deadline|project|report|office|client/i.test(text)) {
            detectedCategory = 'Work';
        } else if (/run|gym|health|exercise|workout|clean|home|doctor|read/i.test(text)) {
            detectedCategory = 'Personal';
        } else if (/urgent|fire|asap|critical|alert|important/i.test(text)) {
            detectedCategory = 'Urgent';
        }

        if (detectedCategory) {
            elements.taskCategorySelect.value = detectedCategory;
            elements.smartCatLabel.style.display = 'block';
            setTimeout(() => {
                elements.smartCatLabel.style.display = 'none';
            }, 3000);
        }
    };

    elements.taskTitleInput.addEventListener('input', (e) => {
        detectSmartCategory(e.target.value);
    });

    // ------------------------------------------------------
    // 7. TASK ACTIONS (ADD, EDIT, DELETE, TOGGLE, RECURRENCE)
    // ------------------------------------------------------
    const updateStats = () => {
        if (!state.currentUser) return;

        const userTasks = state.tasks.filter(t => t.userId === state.currentUser.id);
        const total = userTasks.length;
        const completed = userTasks.filter(t => t.completed).length;
        const pending = total - completed;

        elements.statTotal.textContent = total;
        elements.statPending.textContent = pending;
        elements.statCompleted.textContent = completed;

        // Draw Progress Ring percentage
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        elements.progressText.textContent = `${percentage}%`;

        if (elements.progressCircle) {
            const offset = circumference - (percentage / 100) * circumference;
            elements.progressCircle.style.strokeDashoffset = offset;
        }

        // Streak Tracker Calculation
        if (state.currentUser.streak === undefined) {
            state.currentUser.streak = 0;
        }
        elements.progressStreakLabel.textContent = `Streak: ${state.currentUser.streak} day${state.currentUser.streak === 1 ? '' : 's'}`;
    };

    // Subtasks Creation Input Form Helpers
    const createSubtaskRow = (val = '') => {
        state.subtaskFormsCount++;
        const row = document.createElement('div');
        row.className = 'subtask-form-row';
        row.setAttribute('data-form-idx', state.subtaskFormsCount);
        row.innerHTML = `
            <input type="text" placeholder="Enter subtask step..." value="${escapeHTML(val)}" required>
            <button type="button" class="btn-remove-step" aria-label="Remove step">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        row.querySelector('.btn-remove-step').addEventListener('click', () => {
            row.remove();
        });

        elements.subtaskFormContainer.appendChild(row);
    };

    elements.addSubtaskInputBtn.addEventListener('click', () => createSubtaskRow());

    // Task Creation Form submit
    elements.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!state.currentUser) return;

        const taskId = elements.taskIdInput.value;
        const title = elements.taskTitleInput.value.trim();
        const desc = elements.taskDescInput.value.trim();
        const category = elements.taskCategorySelect.value;
        const priority = elements.taskPrioritySelect.value;
        const dueDate = elements.taskDueDateInput.value;
        const recurrence = elements.taskRecurrenceSelect.value;
        const collaborator = elements.taskCollaboratorInput.value.trim();

        // Collect subtask values from the form inputs
        const subtaskElements = [...elements.subtaskFormContainer.querySelectorAll('.subtask-form-row input')];
        const subtasks = subtaskElements.map((inp, idx) => {
            return {
                id: 's_' + Date.now() + '_' + idx,
                title: inp.value.trim(),
                completed: false
            };
        });

        if (taskId) {
            // EDITING TASK - preserve subtask completion flags if editing
            state.tasks = state.tasks.map(t => {
                if (t.id === taskId && t.userId === state.currentUser.id) {
                    // Reconcile existing subtask status
                    const updatedSubtasks = subtasks.map(newSub => {
                        const existingSub = t.subtasks ? t.subtasks.find(x => x.title === newSub.title) : null;
                        if (existingSub) {
                            return { ...newSub, id: existingSub.id, completed: existingSub.completed };
                        }
                        return newSub;
                    });

                    return {
                        ...t,
                        title,
                        description: desc,
                        category,
                        priority,
                        dueDate,
                        recurrence,
                        collaborator,
                        subtasks: updatedSubtasks
                    };
                }
                return t;
            });
            addNotification(`Task "${title}" updated.`, 'edit');
            resetTaskForm();
        } else {
            // CREATING NEW TASK
            const newTask = {
                id: 't_' + Date.now() + Math.random().toString(36).substring(2, 5),
                userId: state.currentUser.id,
                title,
                description: desc,
                category,
                priority,
                dueDate,
                completed: false,
                recurrence,
                collaborator,
                subtasks,
                createdAt: new Date().toISOString(),
                orderIndex: state.tasks.filter(t => t.userId === state.currentUser.id).length
            };

            state.tasks.push(newTask);
            addNotification(`Task "${title}" added to list.`, 'create');
            
            // XP for creating a task
            earnXP(5);

            resetTaskForm();
        }

        localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
        renderTasks();
        updateStats();
        generateAISuggestion();
        renderAnalyticsChart();
    });

    const resetTaskForm = () => {
        elements.taskIdInput.value = '';
        elements.taskForm.reset();
        elements.subtaskFormContainer.innerHTML = '';
        setTomorrowDueDate();
        
        // Restore buttons
        elements.cancelEditBtn.style.display = 'none';
        elements.submitTaskText.textContent = 'Add Task';
        elements.submitTaskIcon.className = 'fa-solid fa-plus';
    };

    elements.cancelEditBtn.addEventListener('click', resetTaskForm);

    const editTask = (taskId) => {
        const task = state.tasks.find(t => t.id === taskId && t.userId === state.currentUser.id);
        if (!task) return;

        elements.taskIdInput.value = task.id;
        elements.taskTitleInput.value = task.title;
        elements.taskDescInput.value = task.description || '';
        elements.taskCategorySelect.value = task.category;
        elements.taskPrioritySelect.value = task.priority;
        elements.taskDueDateInput.value = task.dueDate;
        elements.taskRecurrenceSelect.value = task.recurrence || 'none';
        elements.taskCollaboratorInput.value = task.collaborator || '';

        // Render subtasks inside editing panel inputs
        elements.subtaskFormContainer.innerHTML = '';
        if (task.subtasks) {
            task.subtasks.forEach(sub => createSubtaskRow(sub.title));
        }

        // Set form to edit mode
        elements.cancelEditBtn.style.display = 'inline-flex';
        elements.submitTaskText.textContent = 'Save Task';
        elements.submitTaskIcon.className = 'fa-solid fa-circle-check';

        // Scroll to form view on mobile
        elements.taskForm.scrollIntoView({ behavior: 'smooth' });
        elements.taskTitleInput.focus();
    };

    const deleteTask = (taskId) => {
        const task = state.tasks.find(t => t.id === taskId && t.userId === state.currentUser.id);
        if (!task) return;

        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            // Find task element and apply delete animation
            const taskEl = document.querySelector(`.task-item[data-id="${taskId}"]`);
            if (taskEl) {
                taskEl.classList.add('deleting');
            }

            setTimeout(() => {
                state.tasks = state.tasks.filter(t => t.id !== taskId);
                localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
                
                // Readjust order indexes
                state.tasks
                    .filter(t => t.userId === state.currentUser.id)
                    .forEach((t, idx) => t.orderIndex = idx);
                localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));

                addNotification(`Deleted task "${task.title}".`, 'delete');
                renderTasks();
                updateStats();
                generateAISuggestion();
                renderAnalyticsChart();
            }, 350);
        }
    };

    // Forward date calculation for recurring tasks
    const getNextRecurrenceDate = (currentDateStr, recurrence) => {
        const current = new Date(currentDateStr);
        if (recurrence === 'daily') {
            current.setDate(current.getDate() + 1);
        } else if (recurrence === 'weekly') {
            current.setDate(current.getDate() + 7);
        } else if (recurrence === 'monthly') {
            current.setMonth(current.getMonth() + 1);
        }
        return current.toISOString().split('T')[0];
    };

    const toggleTaskComplete = (taskId) => {
        const todayStr = new Date().toISOString().split('T')[0];
        let xpGained = 0;

        state.tasks = state.tasks.map(t => {
            if (t.id === taskId && t.userId === state.currentUser.id) {
                const updatedStatus = !t.completed;
                
                if (updatedStatus) {
                    triggerConfetti();
                    
                    // XP based on Priority
                    if (t.priority === 'high') xpGained += 30;
                    else if (t.priority === 'medium') xpGained += 20;
                    else xpGained += 10;

                    // Process daily completed streak updates
                    let currentStreak = state.currentUser.streak || 0;
                    const lastDate = state.currentUser.lastCompletedDate;

                    if (!lastDate) {
                        currentStreak = 1;
                    } else {
                        const lastTime = new Date(lastDate);
                        const today = new Date(todayStr);
                        const diffTime = Math.abs(today - lastTime);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) {
                            currentStreak += 1;
                        } else if (diffDays > 1) {
                            currentStreak = 1; // Reset
                        }
                    }

                    state.currentUser.streak = currentStreak;
                    state.currentUser.lastCompletedDate = todayStr;
                    syncCurrentUserState();
                }

                addNotification(
                    `Task "${t.title}" marked as ${updatedStatus ? 'completed' : 'incomplete'}.`, 
                    'complete'
                );

                // Auto-complete subtasks
                const updatedSubtasks = t.subtasks ? t.subtasks.map(sub => ({ ...sub, completed: updatedStatus })) : [];

                // Handle recurrence rules
                if (updatedStatus && t.recurrence && t.recurrence !== 'none') {
                    // Create a static completed history copy
                    setTimeout(() => {
                        const completedCopy = {
                            ...t,
                            id: 't_' + Date.now() + Math.random().toString(36).substring(2, 5),
                            title: `[History] ${t.title}`,
                            recurrence: 'none',
                            completed: true
                        };
                        state.tasks.push(completedCopy);
                        
                        // Shift original task date forward for next interval
                        t.dueDate = getNextRecurrenceDate(t.dueDate, t.recurrence);
                        t.completed = false;
                        t.subtasks = t.subtasks ? t.subtasks.map(sub => ({ ...sub, completed: false })) : [];
                        
                        localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
                        renderTasks();
                        updateStats();
                        generateAISuggestion();
                        renderAnalyticsChart();
                    }, 50);
                }

                return { ...t, completed: updatedStatus, subtasks: updatedSubtasks };
            }
            return t;
        });

        if (xpGained > 0) {
            earnXP(xpGained);
        }

        localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
        renderTasks();
        updateStats();
        generateAISuggestion();
        renderAnalyticsChart();
    };

    // Toggle specific checklist step within task card
    const toggleSubtask = (taskId, subtaskId) => {
        let xpGained = 0;
        state.tasks = state.tasks.map(t => {
            if (t.id === taskId && t.userId === state.currentUser.id) {
                const updatedSubtasks = t.subtasks.map(sub => {
                    if (sub.id === subtaskId) {
                        const nextCompleted = !sub.completed;
                        if (nextCompleted) xpGained += 5; // 5 XP per checklist step
                        return { ...sub, completed: nextCompleted };
                    }
                    return sub;
                });

                // Auto-complete main task if all subtasks are finished
                const allDone = updatedSubtasks.every(sub => sub.completed);
                if (allDone && !t.completed) {
                    triggerConfetti();
                }

                return { 
                    ...t, 
                    subtasks: updatedSubtasks,
                    completed: allDone ? true : t.completed
                };
            }
            return t;
        });

        if (xpGained > 0) {
            earnXP(xpGained);
        }

        localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
        renderTasks();
        updateStats();
        generateAISuggestion();
        renderAnalyticsChart();
    };

    // ------------------------------------------------------
    // AI PRIORITY SUGGESTION ALGORITHM
    // ------------------------------------------------------
    const generateAISuggestion = () => {
        if (!state.currentUser || !elements.aiSuggestionBox) return;

        const activeTasks = state.tasks.filter(t => t.userId === state.currentUser.id && !t.completed);
        const todayStr = new Date().toISOString().split('T')[0];

        if (activeTasks.length === 0) {
            elements.aiSuggestionBox.innerHTML = `<p class="ai-text">You have no pending tasks! Great job. Add some to get priority suggestions.</p>`;
            return;
        }

        // Sorting priority weights: Overdue > High priority > nearest due date
        const suggestions = [...activeTasks].sort((a, b) => {
            const aOverdue = a.dueDate < todayStr;
            const bOverdue = b.dueDate < todayStr;
            
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            
            const prioOrder = { high: 3, medium: 2, low: 1 };
            const prioDiff = prioOrder[b.priority] - prioOrder[a.priority];
            if (prioDiff !== 0) return prioDiff;

            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        const bestSuggestion = suggestions[0];
        
        let reason = 'it has High priority and needs to be completed soon.';
        if (bestSuggestion.dueDate < todayStr) {
            reason = 'it is OVERDUE! Finish this immediately to clear backlog.';
        } else if (bestSuggestion.priority === 'high') {
            reason = 'it is designated as High priority.';
        } else if (bestSuggestion.subtasks && bestSuggestion.subtasks.length > 0) {
            reason = 'it contains checklist items to accomplish.';
        }

        elements.aiSuggestionBox.innerHTML = `
            <p class="ai-text"><strong>Suggested Next Step:</strong> Try working on <strong>"${escapeHTML(bestSuggestion.title)}"</strong> because ${reason}</p>
            <a class="ai-task-link" id="btn-focus-ai-task" data-id="${bestSuggestion.id}">Focus Task</a>
        `;

        document.getElementById('btn-focus-ai-task').addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-id');
            // Scroll directly to task card and flash it
            const targetCard = document.querySelector(`.task-item[data-id="${targetId}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth' });
                targetCard.style.outline = '2px solid var(--accent-secondary)';
                setTimeout(() => {
                    targetCard.style.outline = 'none';
                }, 2000);
            }
        });
    };

    // ------------------------------------------------------
    // DYNAMIC SVG ANALYTICS CHART DRAWING
    // ------------------------------------------------------
    const renderAnalyticsChart = () => {
        if (!state.currentUser || !elements.analyticsSvgChart) return;

        const userTasks = state.tasks.filter(t => t.userId === state.currentUser.id);
        const categories = ['Work', 'Personal', 'Urgent', 'Shopping'];
        
        // Count completions per category
        const completedCounts = {};
        const totalCounts = {};
        
        categories.forEach(cat => {
            completedCounts[cat] = 0;
            totalCounts[cat] = 0;
        });

        userTasks.forEach(t => {
            const cat = t.category;
            if (categories.includes(cat)) {
                totalCounts[cat]++;
                if (t.completed) completedCounts[cat]++;
            }
        });

        // Clear previous children
        elements.analyticsSvgChart.innerHTML = '';

        // Draw Linear Gradients definition
        elements.analyticsSvgChart.innerHTML += `
            <defs>
                <linearGradient id="chart-gradient-bars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#818cf8"/>
                    <stop offset="100%" stop-color="#4f46e5"/>
                </linearGradient>
            </defs>
        `;

        // Draw Axis Lines
        elements.analyticsSvgChart.innerHTML += `
            <line x1="50" y1="20" x2="50" y2="150" class="chart-axis-line" />
            <line x1="50" y1="150" x2="450" y2="150" class="chart-axis-line" />
        `;

        // Render Bars
        const barWidth = 45;
        const spacing = 50;
        const startX = 80;
        const maxHeight = 100; // in SVG units

        categories.forEach((cat, index) => {
            const x = startX + index * (barWidth + spacing);
            const total = totalCounts[cat];
            const completed = completedCounts[cat];
            
            // Calculate height proportional to total tasks
            const maxVal = Math.max(...categories.map(c => totalCounts[c]), 1);
            const height = (total / maxVal) * maxHeight;
            const y = 150 - height;
            
            // Calculate completed portion fill
            const completedHeight = (completed / maxVal) * maxHeight;
            const completedY = 150 - completedHeight;

            elements.analyticsSvgChart.innerHTML += `
                <!-- Total Task Bar -->
                <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="rgba(255,255,255,0.05)" stroke="var(--glass-border)" rx="4" />
                <!-- Completed task portion highlight -->
                <rect x="${x}" y="${completedY}" width="${barWidth}" height="${completedHeight}" fill="url(#chart-gradient-bars)" rx="4" class="chart-bar" />
                <!-- Category Text labels -->
                <text x="${x + barWidth / 2}" y="170" text-anchor="middle" class="chart-text">${cat}</text>
                <!-- Counts numbers overlay -->
                <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="10" fill="var(--text-primary)" font-weight="700">${completed}/${total}</text>
            `;
        });
    };

    // ------------------------------------------------------
    // 8. FILTERING, SEARCHING & SORTING ENGINE
    // ------------------------------------------------------
    const handleStatusFilterChange = (e) => {
        elements.statusFilters.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.activeFilters.status = e.target.getAttribute('data-status-filter');
        renderTasks();
    };

    const handleCategoryFilterChange = (e) => {
        elements.categoryFilters.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.activeFilters.category = e.target.getAttribute('data-cat-filter');
        renderTasks();
    };

    const handleSearchInput = (e) => {
        state.activeFilters.search = e.target.value.trim().toLowerCase();
        renderTasks();
    };

    const handleSortChange = (e) => {
        state.activeFilters.sort = e.target.value;
        renderTasks();
    };

    elements.statusFilters.forEach(btn => btn.addEventListener('click', handleStatusFilterChange));
    elements.categoryFilters.forEach(btn => btn.addEventListener('click', handleCategoryFilterChange));
    elements.taskSearch.addEventListener('input', handleSearchInput);
    elements.taskSort.addEventListener('change', handleSortChange);

    const renderTasks = () => {
        elements.taskList.innerHTML = '';

        if (!state.currentUser) return;

        // Filter operations
        let filteredTasks = state.tasks.filter(task => task.userId === state.currentUser.id);

        // Filter by Status
        if (state.activeFilters.status === 'active') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (state.activeFilters.status === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        }

        // Filter by Category
        if (state.activeFilters.category !== 'all') {
            filteredTasks = filteredTasks.filter(t => t.category === state.activeFilters.category);
        }

        // Filter by Search Query (Title)
        if (state.activeFilters.search) {
            filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(state.activeFilters.search));
        }

        // Sort Operations
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        filteredTasks.sort((a, b) => {
            switch (state.activeFilters.sort) {
                case 'date-added-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'date-added-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'due-date-asc':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority-desc':
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                default:
                    return a.orderIndex - b.orderIndex;
            }
        });

        // Toggle empty state card
        if (filteredTasks.length === 0) {
            elements.emptyState.style.display = 'flex';
            return;
        }

        elements.emptyState.style.display = 'none';

        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);
            li.setAttribute('draggable', 'true');

            // Format due date indicator
            const todayStr = new Date().toISOString().split('T')[0];
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const formattedDueDate = new Date(task.dueDate).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric' 
            });

            // Priority and category displays
            const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
            const categoryLabel = task.category;

            // Generate checklist HTML if task has steps
            let checklistHTML = '';
            if (task.subtasks && task.subtasks.length > 0) {
                checklistHTML = `<ul class="task-checklist">`;
                task.subtasks.forEach(sub => {
                    checklistHTML += `
                        <li class="task-checklist-item ${sub.completed ? 'sub-completed' : ''}" data-sub-id="${sub.id}">
                            <button class="sub-checkbox" aria-label="Toggle step completion">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <span>${escapeHTML(sub.title)}</span>
                        </li>
                    `;
                });
                checklistHTML += `</ul>`;
            }

            // Recurrence Tag visual
            const recurrenceTag = task.recurrence && task.recurrence !== 'none' 
                ? `<span style="font-size:0.75rem; color:var(--accent-secondary); font-weight:600;"><i class="fa-solid fa-arrows-spin"></i> ${task.recurrence}</span>`
                : '';

            // Collaborator share badge
            const collaboratorTag = task.collaborator 
                ? `<span style="font-size:0.75rem; color:var(--accent-success); font-weight:600;"><i class="fa-solid fa-user-group"></i> Shared with: ${escapeHTML(task.collaborator)}</span>`
                : '';

            li.innerHTML = `
                <div class="task-main-row">
                    <div class="task-checkbox-wrapper">
                        <button class="task-checkbox" aria-label="Toggle completed state">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                    <div class="task-content">
                        <div class="task-title-line">
                            <span class="task-title">${escapeHTML(task.title)}</span>
                            <span class="cat-tag cat-${categoryLabel}">${categoryLabel}</span>
                            <span class="prio-badge prio-${task.priority}">${priorityLabel}</span>
                        </div>
                        ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
                        <div class="task-meta" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
                            <div class="meta-item ${isOverdue ? 'overdue' : ''}">
                                <i class="fa-solid fa-calendar-days"></i>
                                <span>${formattedDueDate} ${isOverdue ? '(Overdue)' : ''}</span>
                            </div>
                            ${recurrenceTag}
                            ${collaboratorTag}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit" aria-label="Edit task info">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete" aria-label="Delete task">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                ${checklistHTML}
            `;

            // List item interactive event listeners
            li.querySelector('.task-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTaskComplete(task.id);
            });

            li.querySelector('.action-btn.edit').addEventListener('click', (e) => {
                e.stopPropagation();
                editTask(task.id);
            });

            li.querySelector('.action-btn.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            // Subtasks clicking
            if (task.subtasks) {
                li.querySelectorAll('.task-checklist-item').forEach(subItem => {
                    const subId = subItem.getAttribute('data-sub-id');
                    subItem.querySelector('.sub-checkbox').addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleSubtask(task.id, subId);
                    });
                });
            }

            // Drag and drop attachment
            attachDragAndDropEvents(li);

            elements.taskList.appendChild(li);
        });
    };

    // Simple HTML sanitize helper
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    };

    // ------------------------------------------------------
    // 9. NATIVE DRAG AND DROP HANDLERS
    // ------------------------------------------------------
    const attachDragAndDropEvents = (element) => {
        element.addEventListener('dragstart', (e) => {
            state.draggedElement = element;
            state.draggedTaskId = element.getAttribute('data-id');
            element.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', state.draggedTaskId);
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            state.draggedElement = null;
            state.draggedTaskId = null;
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const list = elements.taskList;
            const afterElement = getDragAfterElement(list, e.clientY);
            
            if (afterElement == null) {
                list.appendChild(state.draggedElement);
            } else {
                list.insertBefore(state.draggedElement, afterElement);
            }
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            saveNewListOrder();
        });
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    const saveNewListOrder = () => {
        const currentTaskElements = [...elements.taskList.querySelectorAll('.task-item')];
        const newOrderedIds = currentTaskElements.map(el => el.getAttribute('data-id'));

        // Re-calculate the local storage orderIndex matching the DOM order
        state.tasks = state.tasks.map(task => {
            if (task.userId === state.currentUser.id) {
                const domIndex = newOrderedIds.indexOf(task.id);
                if (domIndex !== -1) {
                    return { ...task, orderIndex: domIndex };
                }
            }
            return task;
        });

        localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));
        updateStats();
    };

    // ------------------------------------------------------
    // 10. BACKUP ACTIONS (EXPORT/IMPORT JSON)
    // ------------------------------------------------------
    elements.exportTasksBtn.addEventListener('click', () => {
        if (!state.currentUser) return;
        const userTasks = state.tasks.filter(t => t.userId === state.currentUser.id);
        
        const dataStr = JSON.stringify(userTasks, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `zenith_tasks_backup_${state.currentUser.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        addNotification('Tasks backup exported successfully.', 'system');
    });

    elements.importTasksBtn.addEventListener('click', () => {
        elements.importTasksFile.click();
    });

    elements.importTasksFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const imported = JSON.parse(evt.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Backup file format must be a tasks array.');
                }

                // Verify file tasks structure, clean and attach to current user ID
                const prepared = imported.map(t => {
                    return {
                        ...t,
                        id: t.id || ('t_' + Date.now() + Math.random().toString(36).substring(2, 5)),
                        userId: state.currentUser.id, // assign to logged-in user
                        completed: !!t.completed,
                        subtasks: Array.isArray(t.subtasks) ? t.subtasks : []
                    };
                });

                // Merge with existing tasks (avoiding duplicate primary keys)
                const currentOtherUsersTasks = state.tasks.filter(t => t.userId !== state.currentUser.id);
                const currentSameUserTasks = state.tasks.filter(t => t.userId === state.currentUser.id);
                
                // Keep imported tasks, overwrite matching IDs, append new ones
                const mergedSameUser = [...currentSameUserTasks];
                prepared.forEach(imp => {
                    const idx = mergedSameUser.findIndex(x => x.id === imp.id);
                    if (idx !== -1) {
                        mergedSameUser[idx] = imp;
                    } else {
                        mergedSameUser.push(imp);
                    }
                });

                state.tasks = [...currentOtherUsersTasks, ...mergedSameUser];
                localStorage.setItem('zenith_tasks', JSON.stringify(state.tasks));

                addNotification('Workspace task backup imported successfully.', 'system');
                renderTasks();
                updateStats();
                generateAISuggestion();
                renderAnalyticsChart();
                alert('Backup successfully loaded and merged!');
            } catch (err) {
                alert('Failed to parse backup JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
        // Clear input value
        e.target.value = '';
    });

    // ------------------------------------------------------
    // 11. SYSTEM INITIALIZATION
    // ------------------------------------------------------
    initTheme();
    checkActiveSession();
    updateNotificationBadge();
    checkUpcomingTaskReminders();
    setTomorrowDueDate();
});
