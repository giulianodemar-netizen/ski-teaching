/**
 * Maestri Filters - JavaScript for filtering functionality
 * Handles location and speciality filters for maestri cards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the maestri page
    if (!document.querySelector('.maestri-page')) return;
    
    initMaestriFiltri();
});

function initMaestriFiltri() {
    console.log('Initializing Maestri Filters...');
    
    // Generate dynamic location filters
    generaFiltriLocalita();
    
    // Initialize filter event listeners
    initFiltriEventListeners();
    
    // Initialize scheda maestro buttons
    initSchedaMaestroButtons();
    
    // Show all cards initially
    mostraTuttiMaestri();
}

/**
 * Initialize scheda maestro button functionality - NUOVO
 */
function initSchedaMaestroButtons() {
    const schedaButtons = document.querySelectorAll('.btn-scheda-maestro');
    
    schedaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get maestro name from the card
            const maestroCard = button.closest('.maestro-card');
            const maestroName = maestroCard.querySelector('h4').textContent.trim();
            
            console.log('Opening scheda for:', maestroName);
            
            // For demo purposes, redirect to a single demo page
            // In a real implementation, you'd generate URLs based on maestro name/ID
            window.location.href = 'maestro-dettaglio.html';
        });
    });
    
    console.log(`Initialized ${schedaButtons.length} scheda maestro buttons`);
}

/**
 * Generate location filters dynamically based on maestri data
 */
function generaFiltriLocalita() {
    const maestriCards = document.querySelectorAll('.maestro-card');
    const localitaSet = new Set();
    
    // Extract unique locations from maestri cards
    maestriCards.forEach(card => {
        const localita = card.getAttribute('data-localita');
        if (localita) {
            localitaSet.add(localita);
        }
    });
    
    // Convert to array and sort
    const localitaArray = Array.from(localitaSet).sort();
    
    // Generate HTML for location filters
    const filtriLocalitaContainer = document.getElementById('filtri-localita');
    if (!filtriLocalitaContainer) return;
    
    let filtriHTML = '<div class="filtro-options">';
    
    localitaArray.forEach(localita => {
        const displayName = formatLocalitaName(localita);
        filtriHTML += `
            <label class="filtro-option">
                <input type="checkbox" value="${localita}" class="filtro-localita">
                <span class="checkmark"></span>
                ${displayName}
            </label>
        `;
    });
    
    filtriHTML += '</div>';
    filtriLocalitaContainer.innerHTML = filtriHTML;
    
    console.log('Generated location filters:', localitaArray);
}

/**
 * Format location names for display
 */
function formatLocalitaName(localita) {
    const formatMap = {
        'roccaraso': 'Roccaraso',
        'marileva-1400': 'Marileva 1400',
        'campo-felice': 'Campo Felice',
        'ovindoli': 'Ovindoli'
    };
    
    return formatMap[localita] || localita;
}

/**
 * Initialize event listeners for filters
 */
function initFiltriEventListeners() {
    // Location filters
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('filtro-localita') || 
            e.target.classList.contains('filtro-specialita')) {
            applicaFiltri();
        }
    });
}

/**
 * Apply filters to maestri cards with animation
 */
function applicaFiltri() {
    const selectedLocalita = getSelectedValues('.filtro-localita');
    const selectedSpecialita = getSelectedValues('.filtro-specialita');
    
    console.log('Applying filters:', {
        localita: selectedLocalita,
        specialita: selectedSpecialita
    });
    
    const maestriCards = document.querySelectorAll('.maestro-card');
    const cardsToHide = [];
    const cardsToShow = [];
    let visibleCount = 0;
    
    // Determine which cards to show/hide
    maestriCards.forEach(card => {
        const cardLocalita = card.getAttribute('data-localita');
        const cardSpecialita = card.getAttribute('data-specialita');
        
        let showCard = true;
        
        // Check location filter
        if (selectedLocalita.length > 0) {
            showCard = showCard && selectedLocalita.includes(cardLocalita);
        }
        
        // Check speciality filter
        if (selectedSpecialita.length > 0) {
            showCard = showCard && selectedSpecialita.includes(cardSpecialita);
        }
        
        const isCurrentlyVisible = !card.classList.contains('hidden');
        
        if (showCard) {
            visibleCount++;
            if (!isCurrentlyVisible) {
                cardsToShow.push(card);
            }
        } else {
            if (isCurrentlyVisible) {
                cardsToHide.push(card);
            }
        }
    });
    
    // Animate cards out
    if (cardsToHide.length > 0) {
        cardsToHide.forEach(card => {
            card.classList.add('fade-out');
        });
        
        // After animation completes, hide them completely
        setTimeout(() => {
            cardsToHide.forEach(card => {
                card.classList.add('hidden');
                card.classList.remove('fade-out');
            });
        }, 400);
    }
    
    // Animate cards in
    if (cardsToShow.length > 0) {
        cardsToShow.forEach(card => {
            card.classList.remove('hidden');
            card.classList.add('fade-in');
        });
        
        // Trigger animation after a small delay
        setTimeout(() => {
            cardsToShow.forEach(card => {
                card.classList.remove('fade-in');
                card.classList.add('show');
            });
        }, 50);
        
        // Clean up animation classes
        setTimeout(() => {
            cardsToShow.forEach(card => {
                card.classList.remove('show');
            });
        }, 500);
    }
    
    console.log(`Showing ${visibleCount} of ${maestriCards.length} maestri`);
    
    // Re-initialize scheda buttons for visible cards
    setTimeout(() => {
        initSchedaMaestroButtons();
    }, 500);
    
    // Handle empty state with delay to allow animations
    setTimeout(() => {
        handleEmptyState(visibleCount);
    }, 450);
}

/**
 * Get selected checkbox values
 */
function getSelectedValues(selector) {
    const checkboxes = document.querySelectorAll(selector + ':checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Show all maestri (clear all filters) with animation
 */
function mostraTuttiMaestri() {
    const maestriCards = document.querySelectorAll('.maestro-card');
    const cardsToShow = [];
    
    maestriCards.forEach(card => {
        if (card.classList.contains('hidden')) {
            cardsToShow.push(card);
        }
    });
    
    if (cardsToShow.length > 0) {
        cardsToShow.forEach(card => {
            card.classList.remove('hidden');
            card.classList.add('fade-in');
        });
        
        // Trigger animation with staggered delay for nice effect
        cardsToShow.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('fade-in');
                card.classList.add('show');
            }, 50 + (index * 50));
        });
        
        // Clean up animation classes
        setTimeout(() => {
            cardsToShow.forEach(card => {
                card.classList.remove('show');
            });
        }, 1000);
    }
    
    // Re-initialize scheda buttons
    setTimeout(() => {
        initSchedaMaestroButtons();
    }, 100);
    
    // Remove empty state if present
    const existingEmptyState = document.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
}

/**
 * Handle empty state when no maestri match filters
 */
function handleEmptyState(visibleCount) {
    const existingEmptyState = document.querySelector('.empty-state');
    const maestriGrid = document.querySelector('.maestri-grid');
    
    if (visibleCount === 0) {
        if (!existingEmptyState) {
            const emptyStateHTML = `
                <div class="empty-state">
                    <div class="empty-state-content">
                        <i class="fas fa-search"></i>
                        <h3>Nessun maestro trovato</h3>
                        <p>Prova a modificare i filtri di ricerca per trovare il maestro perfetto per te.</p>
                        <button onclick="clearAllFilters()" class="btn-clear-filters">Rimuovi tutti i filtri</button>
                    </div>
                </div>
            `;
            maestriGrid.insertAdjacentHTML('afterend', emptyStateHTML);
        }
    } else if (existingEmptyState) {
        existingEmptyState.remove();
    }
}

/**
 * Clear all filters with animation
 */
function clearAllFilters() {
    const allCheckboxes = document.querySelectorAll('.filtro-localita, .filtro-specialita');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Use the animated version to show all maestri
    mostraTuttiMaestri();
    
    console.log('All filters cleared');
}

/**
 * Add filter functionality for external access
 */
window.MaestriFiltri = {
    applicaFiltri: applicaFiltri,
    clearAllFilters: clearAllFilters,
    mostraTuttiMaestri: mostraTuttiMaestri
};