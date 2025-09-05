/**
 * Lezioni Passate JavaScript
 * Handles past lessons functionality and rating system
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize lezioni passate features
    initLezioniPassateFeatures();
    
    /**
     * Initialize all lezioni passate features
     */
    function initLezioniPassateFeatures() {
        initValutaButtons();
        initRatingModal();
        updateTableResponsive();
        
        console.log('Lezioni passate features initialized');
    }
    
    /**
     * Initialize valuta buttons
     */
    function initValutaButtons() {
        const valutaButtons = document.querySelectorAll('.btn-valuta');
        
        valutaButtons.forEach(button => {
            button.addEventListener('click', function() {
                const maestroName = this.getAttribute('data-maestro');
                const row = this.closest('tr');
                const maestroImg = row.querySelector('.maestro-avatar img').src;
                
                openRatingModal(maestroName, maestroImg, row);
            });
        });
    }
    
    /**
     * Open rating modal
     */
    function openRatingModal(maestroName, maestroImg, row) {
        const modal = document.getElementById('modalValutazione');
        const modalMaestroName = document.getElementById('modalMaestroName');
        const modalMaestroImg = document.getElementById('modalMaestroImg');
        
        // Set maestro info in modal
        modalMaestroName.textContent = maestroName;
        modalMaestroImg.src = maestroImg;
        modalMaestroImg.alt = maestroName;
        
        // Store row reference for later update
        modal.dataset.rowId = Array.from(row.parentNode.children).indexOf(row);
        
        // Show modal
        modal.style.display = 'flex';
        
        // Reset rating
        resetRating();
    }
    
    /**
     * Initialize rating modal functionality
     */
    function initRatingModal() {
        const modal = document.getElementById('modalValutazione');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelValutazione');
        const submitBtn = document.getElementById('submitValutazione');
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.querySelector('.rating-value');
        
        let selectedRating = 0;
        
        // Close modal handlers
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Star rating functionality
        stars.forEach(star => {
            star.addEventListener('click', function() {
                selectedRating = parseInt(this.getAttribute('data-value'));
                updateStars(selectedRating);
                ratingValue.textContent = `${selectedRating}/5`;
            });
            
            star.addEventListener('mouseenter', function() {
                const hoverValue = parseInt(this.getAttribute('data-value'));
                highlightStars(hoverValue);
            });
        });
        
        // Reset on mouse leave
        document.querySelector('.star-rating').addEventListener('mouseleave', function() {
            updateStars(selectedRating);
        });
        
        // Submit rating
        submitBtn.addEventListener('click', function() {
            if (selectedRating === 0) {
                alert('Per favore, seleziona una valutazione');
                return;
            }
            
            submitRating();
        });
    }
    
    /**
     * Update stars visual state
     */
    function updateStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    /**
     * Highlight stars on hover
     */
    function highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffc107';
            } else {
                star.style.color = '#ddd';
            }
        });
    }
    
    /**
     * Reset rating
     */
    function resetRating() {
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.querySelector('.rating-value');
        const comment = document.getElementById('comment');
        
        stars.forEach(star => {
            star.classList.remove('active');
            star.style.color = '#ddd';
        });
        
        ratingValue.textContent = '0/5';
        comment.value = '';
    }
    
    /**
     * Submit rating
     */
    function submitRating() {
        const modal = document.getElementById('modalValutazione');
        const rowIndex = parseInt(modal.dataset.rowId);
        const rows = document.querySelectorAll('.lezione-row');
        const targetRow = rows[rowIndex];
        const stars = document.querySelectorAll('.star.active').length;
        const comment = document.getElementById('comment').value;
        
        // Show loading
        const submitBtn = document.getElementById('submitValutazione');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Update the row to show as rated
            const actionCell = targetRow.querySelector('.action-cell');
            actionCell.innerHTML = `
                <div class="valutato-badge">
                    <span class="valutato-text">VALUTATO</span>
                    <span class="valutato-rating">⭐ ${stars}.0</span>
                </div>
            `;
            
            // Close modal
            closeModal();
            
            // Show success message
            showToast('Valutazione inviata con successo!', 'success');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            console.log(`Rating submitted: ${stars} stars, comment: "${comment}"`);
        }, 1500);
    }
    
    /**
     * Close modal
     */
    function closeModal() {
        const modal = document.getElementById('modalValutazione');
        modal.style.display = 'none';
        resetRating();
    }
    
    /**
     * Update table for responsive view
     */
    function updateTableResponsive() {
        if (window.innerWidth <= 768) {
            const cells = document.querySelectorAll('.lezioni-table tbody td');
            
            cells.forEach(cell => {
                if (cell.classList.contains('maestro-cell')) {
                    cell.setAttribute('data-label', 'Maestro');
                } else if (cell.classList.contains('datetime-cell')) {
                    cell.setAttribute('data-label', 'Quando');
                } else if (cell.classList.contains('location-cell')) {
                    cell.setAttribute('data-label', 'Dove');
                } else if (cell.classList.contains('action-cell')) {
                    cell.setAttribute('data-label', 'Azione');
                }
            });
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
    
    // Handle window resize
    window.addEventListener('resize', updateTableResponsive);
    
});

/* ============================
   TOAST STYLES (inline)
   ============================ */

// Add toast styles dynamically if not already present
if (!document.querySelector('style[data-toast-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-toast-styles', 'true');
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
}