// Main script file for Ski Teaching website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header and footer includes
    loadHeaderAndFooter();
    
    // Initialize user dropdown functionality
    initUserDropdown();
});

// Load header and footer content dynamically
function loadHeaderAndFooter() {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                // Re-initialize user dropdown after header loads
                initUserDropdown();
            })
            .catch(error => console.log('Error loading header:', error));
    }
    
    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('footer.html')
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => console.log('Error loading footer:', error));
    }
}

// Initialize user dropdown functionality
function initUserDropdown() {
    // Wait for header to load
    setTimeout(() => {
        const userIcon = document.querySelector('.user-icon');
        const maestroDropdown = document.getElementById('maestroDropdown');
        const userDropdown = document.getElementById('userDropdown');
        
        // Find which dropdown is available
        const dropdown = maestroDropdown || userDropdown;
        
        if (userIcon && dropdown) {
            // Remove the href attribute to prevent navigation
            userIcon.removeAttribute('href');
            userIcon.style.cursor = 'pointer';
            
            // Add click event to toggle dropdown
            userIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target) && !userIcon.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
            
            // Prevent dropdown clicks from closing it
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }, 500);
}

// Toggle dropdown visibility
function toggleDropdown() {
    const maestroDropdown = document.getElementById('maestroDropdown');
    const userDropdown = document.getElementById('userDropdown');
    const dropdown = maestroDropdown || userDropdown;
    
    if (dropdown) {
        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
            dropdown.style.display = 'block';
            // Position dropdown correctly if it's user dropdown
            if (dropdown === userDropdown) {
                positionDropdown();
            }
        } else {
            dropdown.style.display = 'none';
        }
    }
}

// Position dropdown relative to user icon (for user dropdown)
function positionDropdown() {
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userIcon || !userDropdown) return;
    
    const iconRect = userIcon.getBoundingClientRect();
    
    // Position below and to the left of icon
    userDropdown.style.top = (iconRect.bottom + 10) + 'px';
    userDropdown.style.right = (window.innerWidth - iconRect.right) + 'px';
    
    // Ensure dropdown doesn't go off screen on mobile
    if (window.innerWidth < 768) {
        const dropdownWidth = userDropdown.offsetWidth;
        const rightPosition = window.innerWidth - iconRect.right;
        if (rightPosition + dropdownWidth > window.innerWidth) {
            userDropdown.style.right = '10px';
        }
    }
}