/**
 * Scelta Maestro JavaScript
 * Handles all filtering and interaction functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initSceltaMaestro();
    
    /**
     * Initialize all scelta maestro features
     */
    function initSceltaMaestro() {
        generateDynamicFilters();
        initStileButtons();
        initGruppoButtons();
        initLocalitaDropdown();
        initDatePicker();
        initOrarioSelector();
        initCercaButton();
        initSidebarFilters();
        initMaestroCards();
        initMobileSidebarToggle();
        addDataOrarioToMaestri();
        
        console.log('Scelta Maestro initialized');
    }
    
    /**
     * Generate dynamic filters based on data attributes in HTML
     */
    function generateDynamicFilters() {
        // Get all unique localities from maestro cards
        const maestriCards = document.querySelectorAll('.maestro-card');
        const localities = new Set();
        
        maestriCards.forEach(card => {
            const localita = card.getAttribute('data-localita');
            if (localita) {
                localities.add(localita);
            }
        });
        
        // Add any missing default localities
        ['roccaraso', 'campo-felice', 'ovindoli', 'marileva-1400'].forEach(loc => {
            localities.add(loc);
        });
        
        // Sort localities alphabetically
        const sortedLocalities = Array.from(localities).sort();
        
        // Generate località filters in sidebar
        const filtriLocalitaContainer = document.querySelector('.filtro-group .filtro-options');
        if (filtriLocalitaContainer && filtriLocalitaContainer.parentElement.querySelector('h3 i.fa-map-marker-alt')) {
            const localitaHTML = sortedLocalities.map(loc => {
                const displayName = loc.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                return `
                    <label class="filtro-option">
                        <input type="checkbox" value="${loc}" class="filtro-localita">
                        <span class="checkmark"></span>
                        ${displayName}
                    </label>
                `;
            }).join('');
            
            filtriLocalitaContainer.innerHTML = localitaHTML;
        }
        
        // Generate località dropdown in header
        const localitaDropdown = document.getElementById('localita-dropdown');
        if (localitaDropdown) {
            const dropdownHTML = sortedLocalities.map(loc => {
                const displayName = loc.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                return `<div class="dropdown-item" data-value="${loc}">${displayName}</div>`;
            }).join('');
            
            localitaDropdown.innerHTML = dropdownHTML;
        }
    }
    
    /**
     * Add data-orario to remaining maestri (those without it)
     */
    function addDataOrarioToMaestri() {
        const orariOptions = [
            "09:00,10:00,11:00",
            "10:00,11:00,14:00",
            "14:00,15:00,16:00",
            "09:00,10:00,14:00,15:00",
            "11:00,14:00,15:00,16:00",
            "09:00,10:00,11:00,14:00,15:00,16:00",
            "10:00,11:00,15:00,16:00",
            "09:00,14:00,15:00",
            "11:00,12:00,14:00,15:00"
        ];
        
        // Add data-orario ONLY to maestri that don't have it yet
        const maestriCards = document.querySelectorAll('.maestro-card');
        let index = 0;
        maestriCards.forEach(card => {
            if (!card.hasAttribute('data-orario')) {
                const randomOrario = orariOptions[index % orariOptions.length];
                card.setAttribute('data-orario', randomOrario);
                index++;
            }
        });
    }
    
    /**
     * Initialize mobile sidebar toggle
     */
    function initMobileSidebarToggle() {
        const sidebarHeader = document.querySelector('.filtri-sidebar-header');
        const sidebar = document.querySelector('.filtri-sidebar');
        
        if (!sidebarHeader || !sidebar) return;
        
        // Start collapsed on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        }
        
        sidebarHeader.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('collapsed');
            }
        });
    }
    
    /**
     * Initialize stile buttons (Sci/Snowboard)
     */
    function initStileButtons() {
        const stileButtons = document.querySelectorAll('.stile-btn');
        
        stileButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all
                stileButtons.forEach(b => {
                    b.classList.remove('active');
                    // Switch icons
                    const activeIcon = b.querySelector('.icon-active');
                    const inactiveIcon = b.querySelector('.icon-inactive');
                    if (activeIcon) activeIcon.style.display = 'none';
                    if (inactiveIcon) inactiveIcon.style.display = 'block';
                });
                
                // Add active to clicked
                this.classList.add('active');
                // Switch icons for active button
                const activeIcon = this.querySelector('.icon-active');
                const inactiveIcon = this.querySelector('.icon-inactive');
                if (activeIcon) activeIcon.style.display = 'block';
                if (inactiveIcon) inactiveIcon.style.display = 'none';
                
                // Update sidebar filter
                const stile = this.getAttribute('data-stile');
                updateSidebarStileFilter(stile);
                
                console.log('Stile selected:', stile);
            });
        });
    }
    
    /**
     * Initialize gruppo buttons (Singola/Di Gruppo)
     */
    function initGruppoButtons() {
        const gruppoButtons = document.querySelectorAll('.gruppo-btn');
        
        gruppoButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all
                gruppoButtons.forEach(b => {
                    b.classList.remove('active');
                    // Switch icons
                    const activeIcon = b.querySelector('.icon-active');
                    const inactiveIcon = b.querySelector('.icon-inactive');
                    if (activeIcon) activeIcon.style.display = 'none';
                    if (inactiveIcon) inactiveIcon.style.display = 'block';
                });
                
                // Add active to clicked
                this.classList.add('active');
                // Switch icons for active button
                const activeIcon = this.querySelector('.icon-active');
                const inactiveIcon = this.querySelector('.icon-inactive');
                if (activeIcon) activeIcon.style.display = 'block';
                if (inactiveIcon) inactiveIcon.style.display = 'none';
                
                // Update sidebar filter
                const gruppo = this.getAttribute('data-gruppo');
                updateSidebarTipologiaFilter(gruppo);
                
                console.log('Gruppo selected:', gruppo);
            });
        });
    }
    
    /**
     * Initialize località dropdown
     */
    function initLocalitaDropdown() {
        const doveInput = document.getElementById('dove-input');
        const dropdown = document.getElementById('localita-dropdown');
        const dropdownContainer = doveInput ? doveInput.closest('.dropdown-container') : null;
        
        if (!doveInput || !dropdown) return;
        
        // Toggle dropdown
        doveInput.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            dropdownContainer.classList.toggle('active');
        });
        
        // Use event delegation for dynamically generated items
        dropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                e.stopPropagation();
                const value = e.target.getAttribute('data-value');
                const text = e.target.textContent;
                
                doveInput.value = text;
                dropdown.classList.remove('show');
                dropdownContainer.classList.remove('active');
                
                // Update sidebar filter
                updateSidebarLocalitaFilter(value);
                
                console.log('Località selected:', value);
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdown.classList.remove('show');
            if (dropdownContainer) dropdownContainer.classList.remove('active');
        });
    }
    
    /**
     * Initialize date picker - FIXED VERSION with clickable button icon
     */
    function initDatePicker() {
        const quandoInput = document.getElementById('quando-input');
        
        if (!quandoInput) return;
        
        // Set min date to today
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const todayString = yyyy + '-' + mm + '-' + dd;
        
        quandoInput.setAttribute('min', todayString);
        
        // Format date on change
        quandoInput.addEventListener('change', function() {
            const selectedDate = this.value;
            if (selectedDate) {
                console.log('Date selected:', selectedDate);
                
                // Store the original value for filtering
                this.setAttribute('data-date', selectedDate);
            }
        });
        
        // Optional: Set placeholder text
        quandoInput.addEventListener('focus', function() {
            this.setAttribute('placeholder', 'gg/mm/aaaa');
        });
        
        quandoInput.addEventListener('blur', function() {
            if (!this.value) {
                this.setAttribute('placeholder', 'QUANDO?');
            }
        });
    }
    
    /**
     * Initialize orario selector
     */
    function initOrarioSelector() {
        const orarioInput = document.getElementById('orario-input');
        const orarioDropdown = document.querySelector('.orario-dropdown');
        
        if (!orarioInput || !orarioDropdown) return;
        
        // Toggle dropdown
        orarioInput.addEventListener('click', function(e) {
            e.stopPropagation();
            orarioDropdown.style.display = orarioDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Select orario
        const orarioItems = orarioDropdown.querySelectorAll('.orario-item');
        orarioItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                orarioInput.value = this.textContent;
                orarioDropdown.style.display = 'none';
                
                console.log('Orario selected:', this.textContent);
                
                // Apply filters immediately when orario changes
                applySidebarFilters();
            });
        });
        
        // Also apply filter when typing manually
        orarioInput.addEventListener('change', function() {
            applySidebarFilters();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (orarioDropdown) {
                orarioDropdown.style.display = 'none';
            }
        });
    }
    
    /**
     * Initialize cerca button
     */
    function initCercaButton() {
        const cercaBtn = document.getElementById('btn-cerca-maestri');
        
        if (!cercaBtn) return;
        
        cercaBtn.addEventListener('click', function() {
            // Get all filter values
            const filters = getActiveFilters();
            
            console.log('Searching with filters:', filters);
            
            // Apply filters to maestri grid
            applyFilters(filters);
            
            // Smooth scroll to maestri section
            const maestriSection = document.querySelector('.maestri-section');
            if (maestriSection) {
                maestriSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Show toast
            showToast('Ricerca in corso...', 'info');
            
            // Simulate search delay
            setTimeout(() => {
                const visibleCards = document.querySelectorAll('.maestro-card:not(.hidden)').length;
                showToast(`Trovati ${visibleCards} maestri`, 'success');
            }, 500);
        });
    }
    
    /**
     * Get active filters from header
     */
    function getActiveFilters() {
        const filters = {
            stile: '',
            gruppo: '',
            localita: '',
            data: '',
            orario: ''
        };
        
        // Get stile
        const activeStile = document.querySelector('.stile-btn.active');
        if (activeStile) {
            filters.stile = activeStile.getAttribute('data-stile');
        }
        
        // Get gruppo
        const activeGruppo = document.querySelector('.gruppo-btn.active');
        if (activeGruppo) {
            filters.gruppo = activeGruppo.getAttribute('data-gruppo');
        }
        
        // Get località
        const doveInput = document.getElementById('dove-input');
        if (doveInput && doveInput.value) {
            // Get the data-value from selected dropdown item
            const dropdown = document.getElementById('localita-dropdown');
            const selectedItem = Array.from(dropdown.querySelectorAll('.dropdown-item'))
                .find(item => item.textContent === doveInput.value);
            if (selectedItem) {
                filters.localita = selectedItem.getAttribute('data-value');
            }
        }
        
        // Get data
        const quandoInput = document.getElementById('quando-input');
        if (quandoInput && quandoInput.value) {
            filters.data = quandoInput.value;
        }
        
        // Get orario
        const orarioInput = document.getElementById('orario-input');
        if (orarioInput && orarioInput.value) {
            filters.orario = orarioInput.value;
        }
        
        return filters;
    }
    
    /**
     * Apply filters to maestri grid
     */
    function applyFilters(filters) {
        const maestriCards = document.querySelectorAll('.maestro-card');
        let visibleCount = 0;
        
        maestriCards.forEach(card => {
            let show = true;
            
            // Filter by specialità (sci/snowboard/sci-snowboard)
            if (filters.stile) {
                const cardSpecialita = card.getAttribute('data-specialita');
                // Check if card matches or has both specialties
                if (filters.stile === 'sci') {
                    show = cardSpecialita === 'sci' || cardSpecialita === 'sci-snowboard';
                } else if (filters.stile === 'snowboard') {
                    show = cardSpecialita === 'snowboard' || cardSpecialita === 'sci-snowboard';
                }
            }
            
            // Filter by tipologia (singola/gruppo)
            if (filters.gruppo) {
                const cardTipologia = card.getAttribute('data-tipologia');
                if (filters.gruppo === 'singola') {
                    show = show && (cardTipologia === 'singola' || cardTipologia === 'entrambe');
                } else if (filters.gruppo === 'gruppo') {
                    show = show && (cardTipologia === 'gruppo' || cardTipologia === 'entrambe');
                }
            }
            
            // Filter by località
            if (filters.localita) {
                const cardLocalita = card.getAttribute('data-localita');
                show = show && (cardLocalita === filters.localita);
            }
            
            // Filter by orario
            if (filters.orario) {
                const cardOrari = card.getAttribute('data-orario');
                if (cardOrari) {
                    const orariArray = cardOrari.split(',');
                    show = show && orariArray.includes(filters.orario);
                }
            }
            
            // Apply visibility with animation
            if (show) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
                visibleCount++;
            } else {
                card.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        console.log(`Showing ${visibleCount} maestri`);
        
        // Show empty state if no results
        handleEmptyState(visibleCount);
    }
    
    /**
     * Initialize sidebar filters
     */
    function initSidebarFilters() {
        // Delay to ensure dynamic filters are generated first
        setTimeout(() => {
            // Località checkboxes
            const localitaCheckboxes = document.querySelectorAll('.filtro-localita');
            localitaCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    applySidebarFilters();
                });
            });
            
            // Specialità checkboxes
            const specialitaCheckboxes = document.querySelectorAll('.filtro-specialita');
            specialitaCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    applySidebarFilters();
                });
            });
            
            // Tipologia radio buttons
            const tipologiaRadios = document.querySelectorAll('.filtro-tipologia');
            tipologiaRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    applySidebarFilters();
                });
            });
            
            // Filtra button
            const filtraBtn = document.querySelector('.btn-filtra');
            if (filtraBtn) {
                filtraBtn.addEventListener('click', function() {
                    applySidebarFilters();
                    showToast('Filtri applicati', 'success');
                });
            }
        }, 100);
    }
    
    /**
     * Apply sidebar filters
     */
    function applySidebarFilters() {
        const maestriCards = document.querySelectorAll('.maestro-card');
        const selectedLocalita = getSelectedCheckboxValues('.filtro-localita');
        const selectedSpecialita = getSelectedCheckboxValues('.filtro-specialita');
        const selectedTipologia = document.querySelector('.filtro-tipologia:checked');
        const orarioInput = document.getElementById('orario-input');
        
        let visibleCount = 0;
        
        maestriCards.forEach(card => {
            let show = true;
            
            // Filter by località - only if some are selected
            if (selectedLocalita.length > 0) {
                const cardLocalita = card.getAttribute('data-localita');
                show = selectedLocalita.includes(cardLocalita);
            }
            
            // Filter by specialità - only if some are selected
            if (selectedSpecialita.length > 0) {
                const cardSpecialita = card.getAttribute('data-specialita');
                let matchSpecialita = false;
                
                selectedSpecialita.forEach(spec => {
                    if (spec === cardSpecialita) {
                        matchSpecialita = true;
                    } else if (cardSpecialita === 'sci-snowboard') {
                        // Cards with both specialties match any filter
                        matchSpecialita = true;
                    } else if (spec === 'sci-snowboard' && (cardSpecialita === 'sci' || cardSpecialita === 'snowboard')) {
                        // When sci-snowboard is selected, show all
                        matchSpecialita = true;
                    }
                });
                
                show = show && matchSpecialita;
            }
            
            // Filter by tipologia
            if (selectedTipologia) {
                const tipologiaValue = selectedTipologia.value;
                const cardTipologia = card.getAttribute('data-tipologia');
                
                if (tipologiaValue === 'tutte') {
                    // Show all cards
                    show = show && true;
                } else if (tipologiaValue === 'singola') {
                    show = show && (cardTipologia === 'singola' || cardTipologia === 'entrambe');
                } else if (tipologiaValue === 'gruppo') {
                    show = show && (cardTipologia === 'gruppo' || cardTipologia === 'entrambe');
                } else if (tipologiaValue === 'entrambe') {
                    // Show only cards that offer both types
                    show = show && (cardTipologia === 'entrambe');
                }
            }
            
            // Filter by orario - only if an orario is selected
            if (orarioInput && orarioInput.value && orarioInput.value.trim() !== '') {
                const cardOrari = card.getAttribute('data-orario');
                if (cardOrari) {
                    const orariArray = cardOrari.split(',');
                    show = show && orariArray.includes(orarioInput.value);
                } else {
                    show = false; // If card has no orario data, hide it when filtering by orario
                }
            }
            
            // Apply visibility with animation
            if (show) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
                visibleCount++;
            } else {
                card.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        console.log(`Sidebar filters applied: ${visibleCount} maestri visible`);
        
        // Handle empty state
        handleEmptyState(visibleCount);
    }
    
    /**
     * Get selected checkbox values
     */
    function getSelectedCheckboxValues(selector) {
        const checkboxes = document.querySelectorAll(selector + ':checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    /**
     * Update sidebar filters based on header selection
     */
    function updateSidebarStileFilter(stile) {
        const specialitaCheckboxes = document.querySelectorAll('.filtro-specialita');
        specialitaCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === stile;
        });
    }
    
    function updateSidebarTipologiaFilter(tipo) {
        const tipologiaRadios = document.querySelectorAll('.filtro-tipologia');
        tipologiaRadios.forEach(radio => {
            if (tipo === 'singola') {
                radio.checked = radio.value === 'singola';
            } else if (tipo === 'gruppo') {
                radio.checked = radio.value === 'gruppo';
            }
        });
    }
    
    function updateSidebarLocalitaFilter(localita) {
        const localitaCheckboxes = document.querySelectorAll('.filtro-localita');
        // Uncheck all first
        localitaCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        // Check only the selected one
        localitaCheckboxes.forEach(checkbox => {
            if (checkbox.value === localita) {
                checkbox.checked = true;
            }
        });
    }
    
    /**
     * Initialize maestro cards hover effects
     */
    function initMaestroCards() {
        const maestroCards = document.querySelectorAll('.maestro-card');
        
        maestroCards.forEach(card => {
            // Add click handler for card
            card.addEventListener('click', function(e) {
                // If clicking on buttons, don't trigger card click
                if (e.target.classList.contains('btn-scheda') || 
                    e.target.classList.contains('btn-prenota') ||
                    e.target.closest('.btn-scheda') ||
                    e.target.closest('.btn-prenota')) {
                    return;
                }
                
                // Default action - go to detail page
                window.location.href = 'maestro-dettaglio.html';
            });
        });
        
        console.log(`Initialized ${maestroCards.length} maestro cards`);
    }
    
    /**
     * Handle empty state
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
     * Clear all filters
     */
    window.clearAllFilters = function() {
        // Clear header filters
        const stileButtons = document.querySelectorAll('.stile-btn');
        stileButtons.forEach((btn, index) => {
            if (index === 0) {
                btn.click(); // Select first option (Sci)
            }
        });
        
        const gruppoButtons = document.querySelectorAll('.gruppo-btn');
        gruppoButtons.forEach((btn, index) => {
            if (index === 0) {
                btn.click(); // Select first option (Singola)
            }
        });
        
        document.getElementById('dove-input').value = '';
        document.getElementById('quando-input').value = '';
        document.getElementById('orario-input').value = '';
        
        // Clear sidebar filters
        const allCheckboxes = document.querySelectorAll('.filtro-localita, .filtro-specialita');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset tipologia to first option
        const firstTipologia = document.querySelector('.filtro-tipologia[value="singola"]');
        if (firstTipologia) {
            firstTipologia.checked = true;
        }
        
        // Show all maestri
        const maestriCards = document.querySelectorAll('.maestro-card');
        maestriCards.forEach(card => {
            card.classList.remove('hidden');
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        });
        
        // Remove empty state
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        console.log('All filters cleared');
        showToast('Tutti i filtri sono stati rimossi', 'info');
    }
    
    /**
     * Clear all sidebar filters only
     */
    window.clearAllSidebarFilters = function() {
        // Clear all checkboxes
        const allCheckboxes = document.querySelectorAll('.filtro-localita, .filtro-specialita');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear orario input completely
        const orarioInput = document.getElementById('orario-input');
        if (orarioInput) {
            orarioInput.value = '';
        }
        
        // Reset tipologia to show all
        const tutteRadio = document.querySelector('.filtro-tipologia[value="tutte"]');
        if (tutteRadio) {
            tutteRadio.checked = true;
        }
        
        // Apply filters to refresh the view (this will show all since no filters are selected)
        applySidebarFilters();
        
        // Remove any empty state that might be present
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Show success message
        const visibleCards = document.querySelectorAll('.maestro-card:not(.hidden)').length;
        console.log(`Reset filters: showing all ${visibleCards} maestri`);
        showToast('Filtri cancellati - Mostrati tutti i maestri', 'success');
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
    
    // Initialize animations on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
    
});

/* ============================
   DYNAMIC STYLES
   ============================ */

// Add dynamic styles for toast and animations
if (!document.querySelector('style[data-scelta-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-scelta-styles', 'true');
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
        
        .maestro-card.hidden {
            display: none !important;
        }
        
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            margin-top: 30px;
        }
        
        .empty-state-content i {
            font-size: 3rem;
            color: #ccc;
            margin-bottom: 20px;
        }
        
        .empty-state-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }
        
        .empty-state-content p {
            font-size: 1rem;
            color: #666;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .btn-clear-filters {
            background-color: #1380ad;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-family: 'Oswald', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-clear-filters:hover {
            background-color: #0f5a7a;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.95);
            }
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