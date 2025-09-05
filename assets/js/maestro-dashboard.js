// Maestro Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initDashboardFilters();
});

// Initialize filter dropdown functionality
function initDashboardFilters() {
    const filterButton = document.querySelector('.btn-lezioni-filter');
    const filterDropdown = document.querySelector('.lezioni-dropdown');
    
    if (filterButton && filterDropdown) {
        filterButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFilterDropdown();
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
                selectFilter(this);
            });
        });
    }
}

function toggleFilterDropdown() {
    const filterDropdown = document.querySelector('.lezioni-dropdown');
    if (filterDropdown) {
        if (filterDropdown.style.display === 'none' || filterDropdown.style.display === '') {
            filterDropdown.style.display = 'block';
        } else {
            filterDropdown.style.display = 'none';
        }
    }
}

function selectFilter(selectedItem) {
    // Remove active class from all items
    const filterItems = document.querySelectorAll('.lezioni-dropdown a[data-filter]');
    filterItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected item
    selectedItem.classList.add('active');
    
    // Update button text
    const filterButton = document.querySelector('.btn-lezioni-filter .filter-text');
    if (filterButton) {
        filterButton.textContent = selectedItem.textContent.trim();
    }
    
    // Close dropdown
    const filterDropdown = document.querySelector('.lezioni-dropdown');
    if (filterDropdown) {
        filterDropdown.style.display = 'none';
    }
    
    // Here you would typically filter the data based on selectedItem.dataset.filter
    console.log('Filter selected:', selectedItem.dataset.filter);
}