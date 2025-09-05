/**
 * Area Utente JavaScript
 * Handles user area functionality, bookings management and filters
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize area utente features
    initAreaUtenteFeatures();
    
    /**
     * Initialize all area utente features
     */
    function initAreaUtenteFeatures() {
        initUserDropdown();
        initFiltriStato();
        initActionButtons();
        updateCounts();
        
        console.log('Area utente features initialized');
    }
    
    /**
     * Initialize user dropdown menu
     */
    function initUserDropdown() {
        // Wait for header to load, then setup dropdown
        setTimeout(() => {
            const userIcon = document.querySelector('.user-icon');
            const userDropdown = document.getElementById('userDropdown');
            
            if (!userIcon || !userDropdown) return;
            
            // Override default link behavior
            userIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userDropdown.contains(e.target) && !userIcon.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
            
            // Prevent dropdown clicks from closing it
            userDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
        }, 500);
    }
    
    /**
     * Toggle dropdown menu
     */
    function toggleDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        if (!userDropdown) return;
        
        if (userDropdown.style.display === 'none' || !userDropdown.style.display) {
            userDropdown.style.display = 'block';
            // Position dropdown correctly
            positionDropdown();
        } else {
            userDropdown.style.display = 'none';
        }
    }
    
    /**
     * Position dropdown relative to user icon
     */
    function positionDropdown() {
        const userIcon = document.querySelector('.user-icon');
        const userDropdown = document.getElementById('userDropdown');
        
        if (!userIcon || !userDropdown) return;
        
        const iconRect = userIcon.getBoundingClientRect();
        const dropdownWidth = userDropdown.offsetWidth;
        
        // Position below and to the left of icon
        userDropdown.style.top = (iconRect.bottom + 10) + 'px';
        userDropdown.style.right = (window.innerWidth - iconRect.right) + 'px';
        
        // Ensure dropdown doesn't go off screen on mobile
        if (window.innerWidth < 768) {
            const rightPosition = window.innerWidth - iconRect.right;
            if (rightPosition + dropdownWidth > window.innerWidth) {
                userDropdown.style.right = '10px';
            }
        }
    }
    
    /**
     * Initialize filtri stato
     */
    function initFiltriStato() {
        const filtriStato = document.querySelectorAll('.filtro-stato');
        
        filtriStato.forEach(filtro => {
            filtro.addEventListener('click', function() {
                // Remove active from all
                filtriStato.forEach(f => f.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                
                // Filter prenotazioni
                const stato = this.getAttribute('data-stato');
                filterPrenotazioni(stato);
            });
        });
    }
    
    /**
     * Filter prenotazioni by stato
     */
    function filterPrenotazioni(stato) {
        const allGroups = document.querySelectorAll('.prenotazioni-group');
        const allCards = document.querySelectorAll('.prenotazione-card');
        const emptyState = document.getElementById('emptyState');
        
        let visibleCount = 0;
        
        if (stato === 'tutti') {
            // Show all groups and cards
            allGroups.forEach(group => {
                group.style.display = 'block';
                group.classList.remove('hidden');
            });
            allCards.forEach(card => {
                card.style.display = 'flex';
                visibleCount++;
            });
        } else {
            // Hide all groups first
            allGroups.forEach(group => {
                group.style.display = 'none';
                group.classList.add('hidden');
            });
            
            // Show only matching group
            const targetGroup = document.querySelector(`.prenotazioni-group[data-stato="${stato}"]`);
            if (targetGroup) {
                targetGroup.style.display = 'block';
                targetGroup.classList.remove('hidden');
                
                // Count visible cards in this group
                const groupCards = targetGroup.querySelectorAll('.prenotazione-card');
                visibleCount = groupCards.length;
            }
        }
        
        // Show/hide empty state
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            document.querySelector('.prenotazioni-list').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.querySelector('.prenotazioni-list').style.display = 'flex';
        }
        
        console.log(`Filtering by: ${stato}, visible: ${visibleCount}`);
    }
    
    /**
     * Update counts in filters
     */
    function updateCounts() {
        // Count by stato
        const confermate = document.querySelectorAll('.prenotazione-card[data-stato="confermate"]').length;
        const attesa = document.querySelectorAll('.prenotazione-card[data-stato="attesa"]').length;
        const rifiutate = document.querySelectorAll('.prenotazione-card[data-stato="rifiutate"]').length;
        const totale = confermate + attesa + rifiutate;
        
        // Update filter counts
        const filtri = {
            'tutti': totale,
            'confermate': confermate,
            'attesa': attesa,
            'rifiutate': rifiutate
        };
        
        document.querySelectorAll('.filtro-stato').forEach(filtro => {
            const stato = filtro.getAttribute('data-stato');
            const countSpan = filtro.querySelector('.count');
            if (countSpan && filtri[stato] !== undefined) {
                countSpan.textContent = `(${filtri[stato]})`;
            }
        });
    }
    
    /**
     * Initialize action buttons
     */
    function initActionButtons() {
        // Contatta maestro buttons
        document.querySelectorAll('.btn-contatta').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.prenotazione-card');
                const maestroName = card.querySelector('.maestro-nome').textContent.split('⭐')[0].trim();
                
                // Demo: show alert
                alert(`Apertura chat con ${maestroName}...`);
                
                // In production: open chat modal or redirect to chat page
                // window.location.href = `chat.html?maestro=${encodeURIComponent(maestroName)}`;
            });
        });
        
        // Disdici lezione buttons
        document.querySelectorAll('.btn-disdici').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.prenotazione-card');
                const stato = card.getAttribute('data-stato');
                
                if (stato === 'confermate') {
                    if (confirm('Sei sicuro di voler disdire questa lezione? Ricorda che puoi disdire solo con 48 ore di preavviso.')) {
                        cancelLezione(card);
                    }
                } else if (stato === 'attesa') {
                    if (confirm('Sei sicuro di voler annullare questa richiesta?')) {
                        cancelRichiesta(card);
                    }
                }
            });
        });
    }
    
    /**
     * Cancel lezione
     */
    function cancelLezione(card) {
        // Get lesson details
        const maestroName = card.querySelector('.maestro-nome').textContent.split('⭐')[0].trim();
        const data = card.querySelector('.data').textContent;
        const ora = card.querySelector('.ora').textContent;
        
        // Show loading
        const btn = card.querySelector('.btn-disdici');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cancellazione...';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Move to cancelled section
            card.setAttribute('data-stato', 'rifiutate');
            card.querySelector('.stato-badge').className = 'stato-badge rosso';
            card.querySelector('.stato-badge').textContent = 'DISDETTA';
            card.querySelector('.policy-note').textContent = 'Lezione disdetta dall\'utente';
            
            // Move card to rifiutate group
            const rifiutateGroup = document.querySelector('.prenotazioni-group[data-stato="rifiutate"]');
            if (rifiutateGroup) {
                const groupContent = rifiutateGroup.querySelector('.group-title').nextElementSibling;
                if (groupContent) {
                    rifiutateGroup.appendChild(card);
                } else {
                    rifiutateGroup.appendChild(card);
                }
            }
            
            // Update counts
            updateCounts();
            
            // Show success message
            showToast('Lezione disdetta con successo', 'success');
            
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            console.log(`Cancelled lesson with ${maestroName} on ${data} at ${ora}`);
        }, 1500);
    }
    
    /**
     * Cancel richiesta
     */
    function cancelRichiesta(card) {
        // Show loading
        const btn = card.querySelector('.btn-disdici');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Annullamento...';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Remove card with animation
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                card.remove();
                updateCounts();
                
                // Check if group is empty
                checkEmptyGroups();
                
                // Show success message
                showToast('Richiesta annullata con successo', 'info');
            }, 300);
            
        }, 1500);
    }
    
    /**
     * Check for empty groups
     */
    function checkEmptyGroups() {
        document.querySelectorAll('.prenotazioni-group').forEach(group => {
            const cards = group.querySelectorAll('.prenotazione-card');
            if (cards.length === 0) {
                group.style.display = 'none';
            }
        });
        
        // Check if all groups are empty
        const allCards = document.querySelectorAll('.prenotazione-card');
        if (allCards.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            document.querySelector('.prenotazioni-list').style.display = 'none';
        }
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
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && userDropdown.style.display === 'block') {
            positionDropdown();
        }
    });
    
});

/* ============================
   TOAST STYLES (inline)
   ============================ */

// Add toast styles dynamically
const style = document.createElement('style');
style.textContent = `
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
    
    .toast-notification.toast-error {
        background-color: #dc3545;
    }
    
    .toast-notification i {
        font-size: 1.2rem;
    }
    
    @media (max-width: 480px) {
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