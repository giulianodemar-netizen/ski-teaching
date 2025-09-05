/**
 * Recupera Password JavaScript
 * Handles password recovery functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize recovery features
    initRecoveryFeatures();
    
    /**
     * Initialize all recovery page features
     */
    function initRecoveryFeatures() {
        loadHeadContent();
        initRecoveryForm();
        checkForPrefillEmail();
        
        console.log('Password recovery features initialized');
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
                <meta name="description" content="Ski Teaching - Recupera la tua password">
                
                <link rel="icon" type="image/png" href="assets/img/favicon.png">
                
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                
                <script src="https://kit.fontawesome.com/d857fd5c75.js" crossorigin="anonymous"></script>
                
                <link rel="stylesheet" href="assets/css/style.css">
                <link rel="stylesheet" href="assets/css/recupera-password.css">
            `;
            
            document.head.insertAdjacentHTML('beforeend', headHTML);
        }
    }
    
    /**
     * Check if email was passed from login page
     */
    function checkForPrefillEmail() {
        const recoveryEmail = sessionStorage.getItem('recoveryEmail');
        if (recoveryEmail) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = recoveryEmail;
                // Clear from session storage
                sessionStorage.removeItem('recoveryEmail');
                
                // Show info message
                showInfoMessage();
            }
        }
    }
    
    /**
     * Show info message
     */
    function showInfoMessage() {
        const infoMessage = document.getElementById('infoMessage');
        if (infoMessage) {
            infoMessage.style.display = 'flex';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                infoMessage.style.opacity = '0';
                setTimeout(() => {
                    infoMessage.style.display = 'none';
                    infoMessage.style.opacity = '1';
                }, 300);
            }, 5000);
        }
    }
    
    /**
     * Initialize recovery form
     */
    function initRecoveryForm() {
        const recoveryForm = document.getElementById('recoveryForm');
        const successState = document.getElementById('successState');
        const btnResend = document.getElementById('btnResend');
        
        if (!recoveryForm) return;
        
        // Form submission
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            
            // Clear previous errors
            clearErrors();
            
            // Validate email
            if (!validateEmail(emailInput)) {
                return;
            }
            
            // Process recovery
            processRecovery(emailInput.value);
        });
        
        // Resend button
        if (btnResend) {
            btnResend.addEventListener('click', function() {
                const email = document.getElementById('emailSent').textContent;
                if (email) {
                    resendRecoveryEmail(email);
                }
            });
        }
        
        // Real-time validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmail(this);
            });
            
            emailInput.addEventListener('input', function() {
                removeError(this);
            });
        }
    }
    
    /**
     * Validate email
     */
    function validateEmail(input) {
        if (!input) return false;
        
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(input, 'L\'email è richiesta');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showError(input, 'Inserisci un\'email valida');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show error message
     */
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove existing error
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
    
    /**
     * Remove error
     */
    function removeError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    /**
     * Clear all errors
     */
    function clearErrors() {
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
     * Process password recovery
     */
    function processRecovery(email) {
        const submitBtn = document.querySelector('.btn-recovery');
        const recoveryForm = document.getElementById('recoveryForm');
        const successState = document.getElementById('successState');
        const emailSent = document.getElementById('emailSent');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            console.log('Recovery email sent to:', email);
            
            // Set email in success message
            if (emailSent) {
                emailSent.textContent = email;
            }
            
            // Hide form and show success state
            recoveryForm.style.display = 'none';
            successState.style.display = 'block';
            
            // Store email for potential resend
            successState.setAttribute('data-email', email);
            
            // Start countdown for resend button
            startResendCountdown();
            
            // In a real implementation:
            // 1. Send request to your API
            // 2. Handle response
            // 3. Show appropriate message
            
        }, 1500);
    }
    
    /**
     * Resend recovery email
     */
    function resendRecoveryEmail(email) {
        const btnResend = document.getElementById('btnResend');
        
        // Show loading
        btnResend.disabled = true;
        btnResend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Invio in corso...</span>';
        
        // Simulate API call
        setTimeout(() => {
            console.log('Recovery email resent to:', email);
            
            // Show success
            showResendSuccess();
            
            // Reset button and start countdown
            setTimeout(() => {
                btnResend.innerHTML = '<i class="fas fa-redo"></i> <span>Invia di nuovo</span>';
                startResendCountdown();
            }, 1000);
            
        }, 1500);
    }
    
    /**
     * Start countdown for resend button
     */
    function startResendCountdown() {
        const btnResend = document.getElementById('btnResend');
        let countdown = 60; // 60 seconds
        
        btnResend.disabled = true;
        
        // Create countdown text if doesn't exist
        let countdownText = document.querySelector('.countdown-text');
        if (!countdownText) {
            countdownText = document.createElement('p');
            countdownText.className = 'countdown-text';
            btnResend.parentElement.appendChild(countdownText);
        }
        
        const interval = setInterval(() => {
            countdown--;
            
            if (countdown > 0) {
                countdownText.textContent = `Puoi inviare di nuovo tra ${countdown} secondi`;
            } else {
                clearInterval(interval);
                btnResend.disabled = false;
                countdownText.textContent = '';
            }
        }, 1000);
    }
    
    /**
     * Show resend success message
     */
    function showResendSuccess() {
        // Create or update success toast
        let toast = document.querySelector('.success-toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'success-toast';
            document.body.appendChild(toast);
        }
        
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Email inviata con successo!';
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
});

/* ============================
   SUCCESS TOAST STYLES (inline)
   ============================ */

// Add toast styles dynamically
const style = document.createElement('style');
style.textContent = `
    .success-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-family: 'Oswald', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .success-toast.show {
        transform: translateX(0);
    }
    
    .success-toast i {
        font-size: 1.2rem;
    }
    
    @media (max-width: 480px) {
        .success-toast {
            top: 10px;
            right: 10px;
            left: 10px;
            font-size: 0.9rem;
            padding: 12px 20px;
        }
    }
`;
document.head.appendChild(style);