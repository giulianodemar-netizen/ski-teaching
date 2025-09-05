/**
 * Blog Filters - JavaScript for filtering functionality
 * Handles category filters for blog cards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the blog page
    if (!document.querySelector('.blog-page')) return;
    
    initBlogFiltri();
});

function initBlogFiltri() {
    console.log('Initializing Blog Filters...');
    
    // Initialize filter event listeners
    initFiltriEventListeners();
    
    // Initialize leggi articolo buttons
    initLeggiArticoloButtons();
    
    // Show all cards initially
    mostraTuttiArticoli();
}

/**
 * Initialize leggi articolo button functionality
 */
function initLeggiArticoloButtons() {
    const leggiButtons = document.querySelectorAll('.btn-leggi-articolo');
    
    leggiButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get article title from the card
            const blogCard = button.closest('.blog-card');
            const articleTitle = blogCard.querySelector('h4').textContent.trim();
            
            console.log('Opening article:', articleTitle);
            
            // Redirect to demo article page
            window.location.href = 'blog-articolo.html';
        });
    });
    
    console.log(`Initialized ${leggiButtons.length} leggi articolo buttons`);
}

/**
 * Initialize event listeners for filters
 */
function initFiltriEventListeners() {
    // Category filters
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('filtro-categoria')) {
            applicaFiltri();
        }
    });
}

/**
 * Apply filters to blog cards with animation
 */
function applicaFiltri() {
    const selectedCategorie = getSelectedValues('.filtro-categoria');
    
    console.log('Applying filters:', {
        categorie: selectedCategorie
    });
    
    const blogCards = document.querySelectorAll('.blog-card');
    const cardsToHide = [];
    const cardsToShow = [];
    let visibleCount = 0;
    
    // Determine which cards to show/hide
    blogCards.forEach(card => {
        const cardCategoria = card.getAttribute('data-categoria');
        
        let showCard = true;
        
        // Check category filter
        if (selectedCategorie.length > 0) {
            showCard = showCard && selectedCategorie.includes(cardCategoria);
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
    
    console.log(`Showing ${visibleCount} of ${blogCards.length} articoli`);
    
    // Re-initialize leggi articolo buttons for visible cards
    setTimeout(() => {
        initLeggiArticoloButtons();
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
 * Show all articles (clear all filters) with animation
 */
function mostraTuttiArticoli() {
    const blogCards = document.querySelectorAll('.blog-card');
    const cardsToShow = [];
    
    blogCards.forEach(card => {
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
    
    // Re-initialize leggi articolo buttons
    setTimeout(() => {
        initLeggiArticoloButtons();
    }, 100);
    
    // Remove empty state if present
    const existingEmptyState = document.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
}

/**
 * Handle empty state when no articles match filters
 */
function handleEmptyState(visibleCount) {
    const existingEmptyState = document.querySelector('.empty-state');
    const blogGrid = document.querySelector('.blog-grid');
    
    if (visibleCount === 0) {
        if (!existingEmptyState) {
            const emptyStateHTML = `
                <div class="empty-state">
                    <div class="empty-state-content">
                        <i class="fas fa-search"></i>
                        <h3>Nessun articolo trovato</h3>
                        <p>Prova a modificare i filtri di ricerca per trovare gli articoli che ti interessano.</p>
                        <button onclick="clearAllFilters()" class="btn-clear-filters">Rimuovi tutti i filtri</button>
                    </div>
                </div>
            `;
            blogGrid.insertAdjacentHTML('afterend', emptyStateHTML);
        }
    } else if (existingEmptyState) {
        existingEmptyState.remove();
    }
}

/**
 * Clear all filters with animation
 */
function clearAllFilters() {
    const allCheckboxes = document.querySelectorAll('.filtro-categoria');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Use the animated version to show all articles
    mostraTuttiArticoli();
    
    console.log('All filters cleared');
}

/**
 * Add filter functionality for external access
 */
window.BlogFiltri = {
    applicaFiltri: applicaFiltri,
    clearAllFilters: clearAllFilters,
    mostraTuttiArticoli: mostraTuttiArticoli
};