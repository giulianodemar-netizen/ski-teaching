/**
 * Profilo JavaScript
 * Handles profile page functionality with improved validation
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize profilo features
    initProfiloFeatures();
    
    /**
     * Initialize all profilo features
     */
    function initProfiloFeatures() {
        initPhotoUpload();
        initFormValidation();
        initPaymentMethods();
        initFormSubmit();
        addErrorMessageContainers();
        
        console.log('Profilo features initialized');
    }
    
    /**
     * Add error message containers to form fields
     */
    function addErrorMessageContainers() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            if (!group.querySelector('.error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                group.appendChild(errorDiv);
            }
        });
    }
    
    /**
     * Show field error
     */
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
    
    /**
     * Clear field error
     */
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        field.classList.remove('invalid');
        
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }
    
    /**
     * Initialize photo upload
     */
    function initPhotoUpload() {
        const photoUpload = document.getElementById('photoUpload');
        const profileImage = document.getElementById('profileImage');
        const profilePhoto = document.querySelector('.profile-photo');
        
        // Click on photo to upload
        if (profilePhoto) {
            profilePhoto.addEventListener('click', function() {
                photoUpload.click();
            });
        }
        
        // Handle file selection
        if (photoUpload) {
            photoUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                
                if (file) {
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        showToast('⚠️ Per favore seleziona un\'immagine valida (JPG, PNG, GIF)', 'error');
                        return;
                    }
                    
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showToast('⚠️ L\'immagine non può superare i 5MB', 'error');
                        return;
                    }
                    
                    // Preview image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImage.src = e.target.result;
                        showToast('✅ Foto profilo aggiornata', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    /**
     * Initialize form validation
     */
    function initFormValidation() {
        // Nickname validation
        const nickname = document.getElementById('nickname');
        if (nickname) {
            nickname.addEventListener('blur', function() {
                if (this.value.trim().length < 3) {
                    showFieldError(this, 'Il nickname deve contenere almeno 3 caratteri');
                } else if (!/^[a-zA-Z0-9_]+$/.test(this.value)) {
                    showFieldError(this, 'Il nickname può contenere solo lettere, numeri e underscore');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Nome validation
        const nome = document.getElementById('nome');
        if (nome) {
            nome.addEventListener('blur', function() {
                if (this.value.trim().length < 2) {
                    showFieldError(this, 'Il nome deve contenere almeno 2 caratteri');
                } else if (!/^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s'-]+$/.test(this.value)) {
                    showFieldError(this, 'Il nome contiene caratteri non validi');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Cognome validation
        const cognome = document.getElementById('cognome');
        if (cognome) {
            cognome.addEventListener('blur', function() {
                if (this.value.trim().length < 2) {
                    showFieldError(this, 'Il cognome deve contenere almeno 2 caratteri');
                } else if (!/^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s'-]+$/.test(this.value)) {
                    showFieldError(this, 'Il cognome contiene caratteri non validi');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Email validation (if exists)
        const email = document.querySelector('input[type="email"]');
        if (email) {
            email.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    showFieldError(this, 'Inserisci un indirizzo email valido');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Data di nascita validation
        const nascita = document.getElementById('nascita');
        if (nascita) {
            nascita.addEventListener('blur', function() {
                const birthDate = new Date(this.value);
                const today = new Date();
                const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
                
                if (!this.value) {
                    showFieldError(this, 'La data di nascita è obbligatoria');
                } else if (age < 14) {
                    showFieldError(this, 'Devi avere almeno 14 anni');
                } else if (age > 120) {
                    showFieldError(this, 'Data di nascita non valida');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Codice Fiscale validation
        const codiceFiscale = document.getElementById('codiceFiscale');
        if (codiceFiscale) {
            codiceFiscale.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
            });
            
            codiceFiscale.addEventListener('blur', function() {
                if (this.value && !validateCodiceFiscale(this.value)) {
                    showFieldError(this, 'Codice fiscale non valido. Formato: ABCDEF12G34H567I');
                } else if (this.value) {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // CAP validation
        const cap = document.getElementById('cap');
        if (cap) {
            cap.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
            
            cap.addEventListener('blur', function() {
                if (this.value && this.value.length !== 5) {
                    showFieldError(this, 'Il CAP deve contenere esattamente 5 cifre');
                } else if (this.value) {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Phone number validation with formatting
        const cellulare = document.getElementById('cellulare');
        if (cellulare) {
            cellulare.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                
                // Remove country code if present
                if (value.startsWith('39')) {
                    value = value.substring(2);
                }
                
                // Format the number
                if (value.length > 0) {
                    let formatted = '+39 ';
                    if (value.length > 3) {
                        formatted += value.substring(0, 3) + ' ';
                        if (value.length > 6) {
                            formatted += value.substring(3, 7);
                            if (value.length > 7) {
                                formatted += value.substring(7, 10);
                            }
                        } else {
                            formatted += value.substring(3);
                        }
                    } else {
                        formatted += value;
                    }
                    this.value = formatted;
                }
            });
            
            cellulare.addEventListener('blur', function() {
                const phoneDigits = this.value.replace(/\D/g, '');
                
                if (!this.value) {
                    showFieldError(this, 'Il numero di telefono è obbligatorio');
                } else if (phoneDigits.length < 12 || phoneDigits.length > 13) { // 39 + 10 digits
                    showFieldError(this, 'Numero di telefono non valido. Inserisci un numero italiano valido');
                } else if (!phoneDigits.startsWith('39')) {
                    showFieldError(this, 'Inserisci un numero di telefono italiano valido');
                } else {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Città validation
        const citta = document.getElementById('citta');
        if (citta) {
            citta.addEventListener('blur', function() {
                if (this.value && this.value.trim().length < 2) {
                    showFieldError(this, 'Nome città troppo corto');
                } else if (this.value && !/^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s'-]+$/.test(this.value)) {
                    showFieldError(this, 'Nome città contiene caratteri non validi');
                } else if (this.value) {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Via validation
        const via = document.getElementById('via');
        if (via) {
            via.addEventListener('blur', function() {
                if (this.value && this.value.trim().length < 3) {
                    showFieldError(this, 'Indirizzo troppo corto');
                } else if (this.value) {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
        
        // Civico validation
        const civico = document.getElementById('civico');
        if (civico) {
            civico.addEventListener('blur', function() {
                if (this.value && !/^[0-9]+[a-zA-Z]?$/.test(this.value)) {
                    showFieldError(this, 'Numero civico non valido (es: 45 o 45A)');
                } else if (this.value) {
                    clearFieldError(this);
                    this.classList.add('valid');
                }
            });
        }
    }
    
    /**
     * Validate Italian Codice Fiscale
     */
    function validateCodiceFiscale(cf) {
        if (cf.length !== 16) return false;
        
        const pattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
        if (!pattern.test(cf)) return false;
        
        // Additional validation for month letter
        const monthLetter = cf.charAt(8);
        const validMonths = 'ABCDEHLMPRST';
        if (!validMonths.includes(monthLetter)) return false;
        
        return true;
    }
    
    /**
     * Initialize payment methods
     */
    function initPaymentMethods() {
        // Remove card buttons
        const removeCardButtons = document.querySelectorAll('.btn-remove-card');
        removeCardButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Sei sicuro di voler rimuovere questa carta?')) {
                    const cardItem = this.closest('.card-item');
                    cardItem.style.transition = 'all 0.3s ease';
                    cardItem.style.opacity = '0';
                    cardItem.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        cardItem.remove();
                        showToast('💳 Carta rimossa', 'info');
                    }, 300);
                }
            });
        });
        
        // Add card button
        const addCardBtn = document.querySelector('.btn-add-card');
        if (addCardBtn) {
            addCardBtn.addEventListener('click', function() {
                // In production, open modal for adding card
                showToast('🚧 Funzionalità in sviluppo', 'info');
            });
        }
        
        // Manage PayPal button
        const managePaypalBtn = document.querySelector('.btn-manage-paypal');
        if (managePaypalBtn) {
            managePaypalBtn.addEventListener('click', function() {
                if (confirm('Sei sicuro di voler rimuovere il collegamento PayPal?')) {
                    const paypalItem = this.closest('.paypal-item');
                    paypalItem.innerHTML = `
                        <i class="fab fa-paypal"></i>
                        <span>Nessun account PayPal collegato</span>
                        <button type="button" class="btn-add-card">Collega PayPal</button>
                    `;
                    showToast('💰 PayPal scollegato', 'info');
                }
            });
        }
    }
    
    /**
     * Initialize form submit
     */
    function initFormSubmit() {
        const form = document.getElementById('profiloForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Clear all previous errors
                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(msg => {
                    msg.textContent = '';
                    msg.style.display = 'none';
                });
                
                // Validate all fields
                let isValid = true;
                const errors = [];
                
                // Validate required fields
                const requiredFields = [
                    { field: document.getElementById('nickname'), message: 'Nickname obbligatorio' },
                    { field: document.getElementById('nome'), message: 'Nome obbligatorio' },
                    { field: document.getElementById('cognome'), message: 'Cognome obbligatorio' },
                    { field: document.getElementById('cellulare'), message: 'Numero di telefono obbligatorio' }
                ];
                
                requiredFields.forEach(item => {
                    if (!item.field.value.trim()) {
                        showFieldError(item.field, item.message);
                        errors.push(item.message);
                        isValid = false;
                    }
                });
                
                // Trigger blur validation for all fields
                const allInputs = form.querySelectorAll('input, select, textarea');
                allInputs.forEach(input => {
                    if (input.value) {
                        input.dispatchEvent(new Event('blur'));
                    }
                });
                
                // Check for any invalid fields
                const invalidFields = form.querySelectorAll('.invalid');
                if (invalidFields.length > 0) {
                    isValid = false;
                    invalidFields[0].focus();
                    invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                if (!isValid) {
                    showToast('⚠️ Correggi gli errori nel modulo', 'error');
                    return;
                }
                
                // Show loading on button
                const submitBtn = form.querySelector('.btn-salva');
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SALVATAGGIO...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showSuccessMessage();
                    showToast('✅ Profilo aggiornato con successo!', 'success');
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    console.log('Profile updated:', new FormData(form));
                }, 1500);
            });
        }
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage() {
        // Create success message if not exists
        let successMsg = document.querySelector('.success-message');
        
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Perfetto!</strong> Il tuo profilo è stato aggiornato con successo!
            `;
            
            const profiloContent = document.querySelector('.profilo-content');
            profiloContent.insertBefore(successMsg, profiloContent.firstChild);
        }
        
        successMsg.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 5000);
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
});

/* ============================
   FORM VALIDATION STYLES (inline)
   ============================ */

// Add validation styles dynamically
if (!document.querySelector('style[data-validation-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-validation-styles', 'true');
    style.textContent = `
        /* Error message styles */
        .error-message {
            display: none;
            color: #dc3545;
            font-family: 'Oswald', sans-serif;
            font-size: 0.85rem;
            font-weight: 500;
            margin-top: 5px;
            padding: 5px 10px;
            background-color: #fff5f5;
            border-left: 3px solid #dc3545;
            animation: slideDown 0.2s ease;
        }
        
        .error-message:not(:empty) {
            display: block;
        }
        
        /* Valid/Invalid field styles */
        .form-group input.valid,
        .form-group select.valid {
            border-color: #28a745 !important;
            background-color: #f8fff9 !important;
        }
        
        .form-group input.invalid,
        .form-group select.invalid {
            border-color: #dc3545 !important;
            background-color: #fff8f8 !important;
            animation: shake 0.3s ease;
        }
        
        .form-group input.invalid:focus,
        .form-group select.invalid:focus {
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
        }
        
        .form-group input.valid:focus,
        .form-group select.valid:focus {
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2) !important;
        }
        
        /* Success message enhanced */
        .success-message {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            border-left: 4px solid #28a745;
            color: #155724;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-family: 'Oswald', sans-serif;
            font-size: 1.1rem;
            display: none;
            box-shadow: 0 3px 10px rgba(40, 167, 69, 0.2);
        }
        
        .success-message i {
            margin-right: 10px;
            font-size: 1.3rem;
        }
        
        .success-message strong {
            display: block;
            margin-bottom: 5px;
        }
        
        /* Toast enhanced */
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: 'Oswald', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            max-width: 400px;
        }
        
        .toast-notification.toast-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }
        
        .toast-notification.toast-error {
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
        }
        
        .toast-notification.toast-info {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
        }
        
        /* Animations */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
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
}