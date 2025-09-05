/**
 * Maestro Presenze JavaScript
 * Handles attendance tracking functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize presenze features
    initPresenze();
    
    /**
     * Initialize all presenze features
     */
    function initPresenze() {
        initMaestroDropdown();
        initPresenzeFilter();
        initPresenzaButtons();
        initDettagliButtons();
        updatePresenzeDate();
        animateOnLoad();
        
        console.log('Presenze page initialized');
    }
    
    /**
     * Initialize maestro dropdown menu
     */
    function initMaestroDropdown() {
        // Wait for header to load, then setup dropdown
        const checkInterval = setInterval(() => {
            const userIcon = document.querySelector('.user-icon');
            const maestroDropdown = document.getElementById('maestroDropdown');
            
            if (userIcon && maestroDropdown) {
                clearInterval(checkInterval);
                
                // Remove any existing listeners first
                const newUserIcon = userIcon.cloneNode(true);
                userIcon.parentNode.replaceChild(newUserIcon, userIcon);
                
                // Add new event listener
                newUserIcon.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMaestroDropdown();
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!maestroDropdown.contains(e.target) && !newUserIcon.contains(e.target)) {
                        maestroDropdown.style.display = 'none';
                    }
                });
                
                // Prevent dropdown clicks from closing it
                maestroDropdown.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
                
                console.log('Maestro dropdown initialized');
            }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 5000);
    }
    
    /**
     * Toggle maestro dropdown menu
     */
    function toggleMaestroDropdown() {
        const maestroDropdown = document.getElementById('maestroDropdown');
        if (!maestroDropdown) return;
        
        if (maestroDropdown.style.display === 'none' || !maestroDropdown.style.display) {
            maestroDropdown.style.display = 'block';
            positionMaestroDropdown();
        } else {
            maestroDropdown.style.display = 'none';
        }
    }
    
    /**
     * Position dropdown relative to user icon
     */
    function positionMaestroDropdown() {
        const userIcon = document.querySelector('.user-icon');
        const maestroDropdown = document.getElementById('maestroDropdown');
        
        if (!userIcon || !maestroDropdown) return;
        
        const iconRect = userIcon.getBoundingClientRect();
        
        // Position below and to the left of icon
        maestroDropdown.style.top = (iconRect.bottom + 10) + 'px';
        maestroDropdown.style.right = (window.innerWidth - iconRect.right) + 'px';
        
        // Ensure dropdown doesn't go off screen on mobile
        if (window.innerWidth < 768) {
            const rightPosition = window.innerWidth - iconRect.right;
            if (rightPosition + maestroDropdown.offsetWidth > window.innerWidth) {
                maestroDropdown.style.right = '10px';
            }
        }
    }
    
    /**
     * Initialize presenze filter dropdown
     */
    function initPresenzeFilter() {
        const filterBtn = document.querySelector('.btn-presenze-filter');
        const dropdown = document.querySelector('.presenze-dropdown');
        const filterText = document.querySelector('.filter-text');
        
        if (!filterBtn || !dropdown) return;
        
        // Toggle dropdown
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'block';
            
            if (isOpen) {
                dropdown.style.display = 'none';
                filterBtn.classList.remove('active');
            } else {
                dropdown.style.display = 'block';
                filterBtn.classList.add('active');
            }
        });
        
        // Handle filter selection
        const filterLinks = dropdown.querySelectorAll('a');
        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove active from all
                filterLinks.forEach(l => l.classList.remove('active'));
                // Add active to clicked
                this.classList.add('active');
                
                // Update button text and date
                const filterType = this.getAttribute('data-filter');
                const filterLabel = this.textContent.trim();
                filterText.textContent = filterLabel.toUpperCase();
                
                // Update date display
                updateDateByFilter(filterType);
                
                // Close dropdown
                dropdown.style.display = 'none';
                filterBtn.classList.remove('active');
                
                // Apply filter
                applyPresenzeFilter(filterType);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!filterBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                filterBtn.classList.remove('active');
            }
        });
    }
    
    /**
     * Update date display based on filter
     */
    function updateDateByFilter(filterType) {
        const titleElement = document.querySelector('.presenze-title');
        const dateElement = document.querySelector('.presenze-date');
        const today = new Date();
        
        switch(filterType) {
            case 'oggi':
                titleElement.textContent = 'LEZIONI DI OGGI';
                dateElement.textContent = formatDateFull(today);
                break;
            case 'domani':
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                titleElement.textContent = 'LEZIONI DI DOMANI';
                dateElement.textContent = formatDateFull(tomorrow);
                break;
            case 'settimana':
                titleElement.textContent = 'LEZIONI DELLA SETTIMANA';
                dateElement.textContent = getWeekRange();
                break;
            case 'mese':
                titleElement.textContent = 'LEZIONI DEL MESE';
                dateElement.textContent = getMonthName(today);
                break;
        }
    }
    
    /**
     * Apply presenze filter based on type
     */
    function applyPresenzeFilter(filterType) {
        let message = '';
        
        switch(filterType) {
            case 'oggi':
                message = 'Visualizzazione presenze di oggi';
                filterToday();
                break;
            case 'domani':
                message = 'Visualizzazione presenze di domani';
                filterTomorrow();
                break;
            case 'settimana':
                message = 'Visualizzazione presenze della settimana';
                filterWeek();
                break;
            case 'mese':
                message = 'Visualizzazione presenze del mese';
                filterMonth();
                break;
        }
        
        showToast(message, 'info');
    }
    
    /**
     * Filter functions
     */
    function filterToday() {
        // In production, filter based on actual dates
        showAllLessons();
        updateLessonCount(3);
    }
    
    function filterTomorrow() {
        // In production, filter based on actual dates
        showAllLessons();
        updateLessonCount(2);
    }
    
    function filterWeek() {
        // In production, filter based on actual dates
        showAllLessons();
        updateLessonCount(8);
    }
    
    function filterMonth() {
        // In production, filter based on actual dates
        showAllLessons();
        updateLessonCount(25);
    }
    
    function showAllLessons() {
        document.querySelectorAll('.presenza-lezione').forEach(lezione => {
            lezione.style.display = 'block';
        });
    }
    
    function updateLessonCount(count) {
        setTimeout(() => {
            showToast(`${count} lezioni trovate`, 'success');
        }, 300);
    }
    
    /**
     * Initialize presenza buttons (Presente/Assente)
     */
    function initPresenzaButtons() {
        document.querySelectorAll('.presenza-item').forEach(item => {
            const buttons = item.querySelectorAll('.btn-presenza');
            const statusDiv = item.querySelector('.presenza-status');
            
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const status = this.getAttribute('data-status');
                    const allievoName = item.querySelector('.allievo-nome').textContent;
                    
                    // Update button states
                    buttons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update item border color
                    item.classList.remove('is-presente', 'is-assente');
                    item.classList.add(`is-${status}`);
                    
                    // Update status display if exists
                    if (statusDiv) {
                        statusDiv.classList.remove('presente-status', 'assente-status');
                        statusDiv.classList.add(`${status}-status`);
                        statusDiv.querySelector('span').textContent = status === 'presente' ? 'Presente' : 'Assente';
                    }
                    
                    // Animate button
                    this.style.animation = 'pulse 0.3s ease';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 300);
                    
                    // Show toast
                    const message = status === 'presente' 
                        ? `${allievoName} segnato come presente` 
                        : `${allievoName} segnato come assente`;
                    showToast(message, 'success');
                    
                    // In production, save to backend
                    savePresenza(item, status);
                });
            });
        });
    }
    
    /**
     * Save presenza to backend (simulated)
     */
    function savePresenza(item, status) {
        // Simulate API call
        console.log('Saving presenza:', {
            allievo: item.querySelector('.allievo-nome').textContent,
            status: status,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Initialize dettagli buttons
     */
    function initDettagliButtons() {
        document.querySelectorAll('.btn-dettagli').forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.presenza-item');
                const allievoName = item.querySelector('.allievo-nome').textContent;
                const location = item.querySelector('.location-name').textContent;
                const lezione = this.closest('.presenza-lezione');
                const time = lezione.querySelector('.lezione-time').textContent;
                const type = lezione.classList.contains('collettiva') ? 'Collettiva' : 'Privata';
                
                showDettagliModal({
                    allievo: allievoName,
                    orario: time,
                    luogo: location,
                    tipo: type
                });
            });
        });
    }
    
    /**
     * Show dettagli modal
     */
    function showDettagliModal(data) {
        // Remove existing modal
        const existingModal = document.querySelector('.dettagli-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'dettagli-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>DETTAGLI PRENOTAZIONE</h3>
                    <button class="btn-close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="detail-row">
                        <span class="detail-label">Allievo:</span>
                        <span class="detail-value">${data.allievo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Orario:</span>
                        <span class="detail-value">${data.orario}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Luogo:</span>
                        <span class="detail-value">${data.luogo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tipo Lezione:</span>
                        <span class="detail-value">${data.tipo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Durata:</span>
                        <span class="detail-value">1 ora</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Prezzo:</span>
                        <span class="detail-value">${data.tipo === 'Privata' ? '50€' : '20€'}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-modal-action btn-contatta">
                        <i class="fas fa-comment"></i> Contatta
                    </button>
                    <button class="btn-modal-action btn-modifica">
                        <i class="fas fa-edit"></i> Modifica
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.btn-close-modal');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Action buttons
        modal.querySelector('.btn-contatta').addEventListener('click', function() {
            showToast(`Apertura chat con ${data.allievo}...`, 'info');
            closeModal();
        });
        
        modal.querySelector('.btn-modifica').addEventListener('click', function() {
            showToast('Apertura modifica prenotazione...', 'info');
            closeModal();
        });
        
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
    
    /**
     * Update presenze date to current date
     */
    function updatePresenzeDate() {
        const dateElement = document.querySelector('.presenze-date');
        if (dateElement) {
            const today = new Date();
            dateElement.textContent = formatDateFull(today);
        }
    }
    
    /**
     * Format date functions
     */
    function formatDateFull(date) {
        const months = ['GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
                       'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    }
    
    function getWeekRange() {
        const today = new Date();
        const firstDay = new Date(today);
        const lastDay = new Date(today);
        const day = today.getDay();
        
        firstDay.setDate(today.getDate() - day + 1);
        lastDay.setDate(today.getDate() - day + 7);
        
        return `${formatDateFull(firstDay)} - ${formatDateFull(lastDay)}`;
    }
    
    function getMonthName(date) {
        const months = ['GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
                       'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'];
        return months[date.getMonth()] + ' ' + date.getFullYear();
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
        
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
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
    
    /**
     * Animate elements on load
     */
    function animateOnLoad() {
        const elements = document.querySelectorAll('.presenza-lezione');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        const maestroDropdown = document.getElementById('maestroDropdown');
        if (maestroDropdown && maestroDropdown.style.display === 'block') {
            positionMaestroDropdown();
        }
    });
    
});

/* ============================
   DYNAMIC STYLES
   ============================ */

// Add dynamic styles for modal and toast
if (!document.querySelector('style[data-presenze-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-presenze-styles', 'true');
    style.textContent = `
        .dettagli-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .dettagli-modal.show {
            opacity: 1;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .modal-content {
            position: relative;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 90%;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .dettagli-modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 20px 25px;
            background-color: #1380ad;
            color: white;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            font-family: 'Oswald', sans-serif;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .btn-close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            padding: 0;
            transition: opacity 0.3s ease;
        }
        
        .btn-close-modal:hover {
            opacity: 0.8;
        }
        
        .modal-body {
            padding: 30px 25px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-family: 'Oswald', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-family: 'Oswald', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #333;
        }
        
        .modal-footer {
            padding: 20px 25px;
            background-color: #f8f9fa;
            border-radius: 0 0 10px 10px;
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .btn-modal-action {
            padding: 10px 25px;
            border-radius: 20px;
            font-family: 'Oswald', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-contatta {
            background-color: #17a2b8;
            color: white;
        }
        
        .btn-contatta:hover {
            background-color: #138496;
            transform: translateY(-2px);
        }
        
        .btn-modifica {
            background-color: white;
            color: #1380ad;
            border: 2px solid #1380ad;
        }
        
        .btn-modifica:hover {
            background-color: #1380ad;
            color: white;
            transform: translateY(-2px);
        }
        
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            font-family: 'Oswald', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            max-width: 350px;
        }
        
        .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-notification.toast-success {
            background-color: #28a745;
        }
        
        .toast-notification.toast-info {
            background-color: #17a2b8;
        }
        
        .toast-notification.toast-warning {
            background-color: #ffc107;
            color: #333;
        }
        
        .toast-notification.toast-error {
            background-color: #dc3545;
        }
        
        .toast-notification i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 480px) {
            .modal-content {
                width: 95%;
            }
            
            .modal-header h3 {
                font-size: 1.1rem;
            }
            
            .detail-label,
            .detail-value {
                font-size: 0.85rem;
            }
            
            .btn-modal-action {
                padding: 8px 20px;
                font-size: 0.85rem;
            }
            
            .toast-notification {
                bottom: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
                font-size: 0.9rem;
                padding: 12px 20px;
            }
        }
    `;
    document.head.appendChild(style);
}