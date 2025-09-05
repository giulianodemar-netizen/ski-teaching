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
    const userIcon = document.querySelector('.user-icon');
    const maestroDropdown = document.getElementById('maestroDropdown');
    
    if (userIcon && maestroDropdown) {
        // Remove the href attribute to prevent navigation
        userIcon.removeAttribute('href');
        userIcon.style.cursor = 'pointer';
        
        // Add click event to toggle dropdown
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!maestroDropdown.contains(e.target) && !userIcon.contains(e.target)) {
                maestroDropdown.style.display = 'none';
            }
        });
    }
}

// Toggle dropdown visibility
function toggleDropdown() {
    const maestroDropdown = document.getElementById('maestroDropdown');
    if (maestroDropdown) {
        if (maestroDropdown.style.display === 'none' || maestroDropdown.style.display === '') {
            maestroDropdown.style.display = 'block';
        } else {
            maestroDropdown.style.display = 'none';
        }
    }
}