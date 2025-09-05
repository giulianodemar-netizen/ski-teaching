/**
 * Login Page JavaScript
 * Handles login form functionality, validation, and interactions
 * 
 * Demo Credentials:
 * - Maestro: maestro@maestro.it or maestro@maestro.com (any password)
 * - User: any other email (password min 6 chars)
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize login features
    initLoginFeatures();
    
    /**
     * Initialize all login page features
     */
    function initLoginFeatures() {
        initMaestroSwitch();
        initPasswordToggle();
        initFormValidation();
        initGoogleLogin();
        initForgotPassword();
        loadHeadContent();
        
        console.log('Login features initialized');
    }
    
    /**
     * Load head content for standalone page
     */
    function loadHeadContent() {
        // Check if head content is already loaded
        if (!document.querySelector('link[href*="style.css"]')) {
            const headHTML = `
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="description" content="Ski Teaching - Accedi al tuo account">
                
                <link rel="icon" type="image/png" href="assets/img/favicon.png">
                
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                
                <script src="https://kit.fontawesome.com/d857fd5c75.js" crossorigin="anonymous"></script>
                
                <link rel="stylesheet" href="assets/css/style.css">
                <link rel="stylesheet" href="assets/css/login.css">
            `;
            
            document.head.insertAdjacentHTML('beforeend', headHTML);
        }
    }
    
    /**
     * Initialize maestro switch functionality
     */
    function initMaestroSwitch() {
        const maestroSwitch = document.getElementById('maestroSwitch');
        const loginBox = document.querySelector('.login-box');
        const loginTitle = document.querySelector('.login-title');
        const emailLabel = document.querySelector('label[for="email"]');
        const emailInput = document.getElementById('email');
        
        if (!maestroSwitch || !loginBox) return;
        
        maestroSwitch.addEventListener('change', function() {
            if (this.checked) {
                // Maestro mode
                loginBox.classList.add('maestro-mode');
                loginTitle.textContent = 'ACCEDI COME MAESTRO';
                if (emailLabel) {
                    emailLabel.textContent = 'Email Maestro';
                }
                
                // Show demo hint for maestro login
                if (emailInput) {
                    emailInput.placeholder = 'maestro@maestro.it (demo)';
                }
                
                // Store mode in sessionStorage
                sessionStorage.setItem('loginMode', 'maestro');
                
                // Show demo hint message
                showDemoHint();
                
                console.log('Switched to Maestro mode');
                console.log('Demo account: maestro@maestro.it or maestro@maestro.com with any password');
            } else {
                // User mode
                loginBox.classList.remove('maestro-mode');
                loginTitle.textContent = 'ACCEDI';
                if (emailLabel) {
                    emailLabel.textContent = 'Nickname o Mail';
                }
                
                // Reset placeholder
                if (emailInput) {
                    emailInput.placeholder = 'Inserisci email';
                }
                
                // Remove demo hint
                removeDemoHint();
                
                // Store mode in sessionStorage
                sessionStorage.setItem('loginMode', 'user');
                
                console.log('Switched to User mode');
            }
        });
        
        // Check if there's a saved mode
        const savedMode = sessionStorage.getItem('loginMode');
        if (savedMode === 'maestro') {
            maestroSwitch.checked = true;
            maestroSwitch.dispatchEvent(new Event('change'));
        }
    }
    
    /**
     * Initialize password toggle functionality
     */
    function initPasswordToggle() {
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        
        if (!passwordToggle || !passwordInput) return;
        
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }
    
    /**
     * Initialize form validation and submission
     */
    function initFormValidation() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmail(this);
            });
            
            emailInput.addEventListener('input', function() {
                removeError(this);
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', function() {
                validatePassword(this);
            });
            
            passwordInput.addEventListener('input', function() {
                removeError(this);
            });
        }
        
        // Form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors();
            
            // Check for demo maestro credentials
            const email = emailInput.value.toLowerCase().trim();
            const maestroEmails = ['maestro@maestro.it', 'maestro@maestro.com'];
            const isDemoMaestro = document.getElementById('maestroSwitch').checked && maestroEmails.includes(email);
            
            // Validate all fields (skip password validation for demo maestro)
            let isValid = true;
            
            if (!validateEmail(emailInput)) {
                isValid = false;
            }
            
            // For demo maestro account, accept any password
            if (!isDemoMaestro && !validatePassword(passwordInput)) {
                isValid = false;
            }
            
            if (isValid) {
                handleLogin();
            }
        });
    }
    
    /**
     * Validate email field
     */
    function validateEmail(input) {
        if (!input) return false;
        
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(input, 'Email è richiesta');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showError(input, 'Inserisci un\'email valida');
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate password field
     */
    function validatePassword(input) {
        if (!input) return false;
        
        const value = input.value;
        
        if (value === '') {
            showError(input, 'Password è richiesta');
            return false;
        }
        
        if (value.length < 6) {
            showError(input, 'La password deve avere almeno 6 caratteri');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show error message for input
     */
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
    
    /**
     * Remove error from input
     */
    function removeError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    /**
     * Clear all error messages
     */
    function clearAllErrors() {
        const errorInputs = document.querySelectorAll('.form-input.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
        
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.remove();
        });
    }
    
    /**
     * Handle login submission
     */
    function handleLogin() {
        const submitBtn = document.querySelector('.btn-login');
        const email = document.getElementById('email').value.toLowerCase().trim();
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;
        const isMaestro = document.getElementById('maestroSwitch').checked;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Demo: check for maestro credentials
            const maestroEmails = ['maestro@maestro.it', 'maestro@maestro.com'];
            const isMaestroLogin = isMaestro && maestroEmails.includes(email);
            
            console.log('Login attempt:', {
                email: email,
                password: '***',
                remember: remember,
                mode: isMaestro ? 'maestro' : 'user',
                isMaestroCredentials: isMaestroLogin
            });
            
            // Show success message
            showSuccessMessage('Accesso effettuato con successo! Reindirizzamento...');
            
            // Redirect after delay
            setTimeout(() => {
                if (isMaestroLogin) {
                    // Redirect to maestro dashboard with maestro credentials
                    console.log('Redirecting to Maestro Dashboard...');
                    window.location.href = 'maestro-dashboard.html';
                } else if (isMaestro) {
                    // Other maestro users (not demo account)
                    console.log('Redirecting to Maestro Dashboard (other maestro)...');
                    window.location.href = 'maestro-dashboard.html';
                } else {
                    // Redirect to user area
                    console.log('Redirecting to User Area...');
                    window.location.href = 'area-utente.html';
                }
            }, 1500);
            
            // In a real implementation, you would:
            // 1. Send credentials to your API
            // 2. Handle the response
            // 3. Store auth token
            // 4. Redirect based on user type
            
        }, 1500);
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        // Remove existing success message
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = message;
        
        // Insert before form
        const loginForm = document.getElementById('loginForm');
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }
    
    /**
     * Initialize Google login
     */
    function initGoogleLogin() {
        const googleBtn = document.querySelector('.btn-google');
        if (!googleBtn) return;
        
        googleBtn.addEventListener('click', function() {
            console.log('Google login clicked');
            
            // In a real implementation, you would:
            // 1. Initialize Google OAuth
            // 2. Handle the authentication flow
            // 3. Process the response
            
            // Demo: show message
            alert('Google login sarà implementato con OAuth 2.0');
        });
    }
    
    /**
     * Initialize forgot password link
     */
    function initForgotPassword() {
        const forgotLink = document.querySelector('.forgot-password');
        if (!forgotLink) return;
        
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (email) {
                // Pre-fill email in recovery
                sessionStorage.setItem('recoveryEmail', email);
            }
            
            // Redirect to password recovery page
            window.location.href = 'recupera-password.html';
        });
    }
    
    /**
     * Handle registration link
     */
    const signupLink = document.querySelector('.signup-link a');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if maestro mode is active
            const isMaestro = document.getElementById('maestroSwitch').checked;
            
            if (isMaestro) {
                // Redirect to maestro registration
                window.location.href = 'registrati-maestro.html';
            } else {
                // Redirect to user registration
                window.location.href = 'registrati.html';
            }
        });
    }
    
    /**
     * Show demo hint for maestro login
     */
    function showDemoHint() {
        // Remove existing hint
        removeDemoHint();
        
        // Create hint element
        const hint = document.createElement('div');
        hint.className = 'demo-hint';
        hint.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Demo: usa <strong>maestro@maestro.it</strong> con qualsiasi password</span>
        `;
        
        // Insert after form header
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.parentNode.insertBefore(hint, formHeader.nextSibling);
        }
    }
    
    /**
     * Remove demo hint
     */
    function removeDemoHint() {
        const hint = document.querySelector('.demo-hint');
        if (hint) {
            hint.remove();
        }
    }
    
});

// Add demo hint styles dynamically
const style = document.createElement('style');
style.textContent = `
    .demo-hint {
        background-color: #e3f2fd;
        color: #1976d2;
        padding: 10px 15px;
        border-radius: 5px;
        margin: 15px 0;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideDown 0.3s ease;
    }
    
    .demo-hint i {
        font-size: 1rem;
    }
    
    .demo-hint strong {
        font-weight: 600;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);