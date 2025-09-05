// Maestro Prenotazioni JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initPrenotazioniFilters();
    initPrenotazioniActions();
});

// Initialize filter dropdown functionality
function initPrenotazioniFilters() {
    const filterButton = document.querySelector('.btn-prenotazioni-filter');
    const filterDropdown = document.querySelector('.prenotazioni-dropdown');
    
    if (filterButton && filterDropdown) {
        filterButton.addEventListener('click', function(e) {
            e.preventDefault();
            togglePrenotazioniFilterDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!filterDropdown.contains(e.target) && !filterButton.contains(e.target)) {
                filterDropdown.style.display = 'none';
            }
        });
        
        // Handle filter selection
        const filterItems = filterDropdown.querySelectorAll('a[data-filter]');
        filterItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                selectPrenotazioniFilter(this);
            });
        });
    }
}

function togglePrenotazioniFilterDropdown() {
    const filterDropdown = document.querySelector('.prenotazioni-dropdown');
    if (filterDropdown) {
        if (filterDropdown.style.display === 'none' || filterDropdown.style.display === '') {
            filterDropdown.style.display = 'block';
        } else {
            filterDropdown.style.display = 'none';
        }
    }
}

function selectPrenotazioniFilter(selectedItem) {
    // Remove active class from all items
    const filterItems = document.querySelectorAll('.prenotazioni-dropdown a[data-filter]');
    filterItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected item
    selectedItem.classList.add('active');
    
    // Update button text
    const filterButton = document.querySelector('.btn-prenotazioni-filter .filter-text');
    if (filterButton) {
        filterButton.textContent = selectedItem.textContent.trim();
    }
    
    // Close dropdown
    const filterDropdown = document.querySelector('.prenotazioni-dropdown');
    if (filterDropdown) {
        filterDropdown.style.display = 'none';
    }
    
    // Filter data based on selection
    console.log('Prenotazioni filter selected:', selectedItem.dataset.filter);
}

// Initialize prenotazioni actions
function initPrenotazioniActions() {
    // Handle approve buttons
    const approveButtons = document.querySelectorAll('.btn-approva-prenotazione');
    approveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            approvePrenotazione(this);
        });
    });
    
    // Handle reject buttons
    const rejectButtons = document.querySelectorAll('.btn-rifiuta-prenotazione');
    rejectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            rejectPrenotazione(this);
        });
    });
    
    // Handle options buttons for waiting prenotazioni
    const optionsButtons = document.querySelectorAll('.btn-options-attesa');
    optionsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            togglePrenotazioneSubmenu(this);
        });
    });
}

function approvePrenotazione(button) {
    if (confirm('Vuoi approvare questa prenotazione?')) {
        // Move the card to confirmed section
        const card = button.closest('.prenotazione-card');
        if (card) {
            // Remove approve/reject buttons
            const buttonsDiv = card.querySelector('.prenotazione-buttons');
            if (buttonsDiv) {
                buttonsDiv.remove();
            }
            
            // Add to confirmed section
            const confirmedSection = document.querySelector('.prenotazioni-section.confermate .prenotazioni-list');
            if (confirmedSection) {
                confirmedSection.appendChild(card);
            }
            
            console.log('Prenotazione approved');
        }
    }
}

function rejectPrenotazione(button) {
    if (confirm('Vuoi rifiutare questa prenotazione?')) {
        // Move the card to rejected section
        const card = button.closest('.prenotazione-card');
        if (card) {
            // Add rejected class
            card.classList.add('rifiutata');
            
            // Remove approve/reject buttons and actions
            const buttonsDiv = card.querySelector('.prenotazione-buttons');
            const actionsDiv = card.querySelector('.prenotazione-actions');
            if (buttonsDiv) buttonsDiv.remove();
            if (actionsDiv) actionsDiv.innerHTML = '';
            
            // Add to rejected section
            const rejectedSection = document.querySelector('.prenotazioni-section.rifiutate .prenotazioni-list');
            if (rejectedSection) {
                rejectedSection.appendChild(card);
            }
            
            console.log('Prenotazione rejected');
        }
    }
}

function togglePrenotazioneSubmenu(button) {
    const submenu = button.nextElementSibling;
    if (submenu && submenu.classList.contains('prenotazione-submenu')) {
        if (submenu.style.display === 'none' || submenu.style.display === '') {
            submenu.style.display = 'block';
        } else {
            submenu.style.display = 'none';
        }
    }
}