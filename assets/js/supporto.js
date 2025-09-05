/**
 * Supporto JavaScript
 * Handles support page functionality and FAQ accordion
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize supporto features
    initSupportoFeatures();
    
    /**
     * Initialize all supporto features
     */
    function initSupportoFeatures() {
        initAccordion();
        initContactLinks();
        animateOnScroll();
        
        console.log('Supporto features initialized');
    }
    
    /**
     * Initialize FAQ accordion functionality
     */
    function initAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            // Set initial state - all closed
            header.setAttribute('aria-expanded', 'false');
            const content = header.nextElementSibling;
            if (content) {
                content.classList.remove('active');
            }
            
            // Add click event listener
            header.addEventListener('click', function() {
                toggleAccordion(this);
            });
        });
    }
    
    /**
     * Toggle accordion item
     */
    function toggleAccordion(header) {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const content = header.nextElementSibling;
        const accordionItem = header.parentElement;
        
        // Close all other accordions (optional - comment out for multiple open)
        closeAllAccordions();
        
        if (!isExpanded) {
            // Open this accordion
            header.setAttribute('aria-expanded', 'true');
            content.classList.add('active');
            accordionItem.classList.add('active');
            
            // Animate opening
            animateAccordionOpen(content);
            
            // Track FAQ interaction
            trackFAQInteraction(header.querySelector('.accordion-title').textContent);
        } else {
            // Close this accordion
            header.setAttribute('aria-expanded', 'false');
            content.classList.remove('active');
            accordionItem.classList.remove('active');
            
            // Animate closing
            animateAccordionClose(content);
        }
    }
    
    /**
     * Close all accordions
     */
    function closeAllAccordions() {
        const allHeaders = document.querySelectorAll('.accordion-header');
        
        allHeaders.forEach(header => {
            const content = header.nextElementSibling;
            const accordionItem = header.parentElement;
            
            header.setAttribute('aria-expanded', 'false');
            content.classList.remove('active');
            accordionItem.classList.remove('active');
            
            // Reset max-height for smooth animation
            if (content) {
                content.style.maxHeight = null;
            }
        });
    }
    
    /**
     * Animate accordion opening
     */
    function animateAccordionOpen(content) {
        // Get the height of the content
        const accordionBody = content.querySelector('.accordion-body');
        if (!accordionBody) return;
        
        // Calculate actual height needed
        content.style.maxHeight = accordionBody.scrollHeight + 50 + 'px';
        
        // Smooth scroll to view if needed
        setTimeout(() => {
            const accordionItem = content.parentElement;
            const rect = accordionItem.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                accordionItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 300);
    }
    
    /**
     * Animate accordion closing
     */
    function animateAccordionClose(content) {
        content.style.maxHeight = null;
    }
    
    /**
     * Initialize contact links with smooth hover effects
     */
    function initContactLinks() {
        const contactLinks = document.querySelectorAll('.contact-value a');
        
        contactLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const icon = this.previousElementSibling;
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                const icon = this.previousElementSibling;
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
        
        // Phone number click tracking
        const phoneLink = document.querySelector('a[href^="tel:"]');
        if (phoneLink) {
            phoneLink.addEventListener('click', function() {
                console.log('Phone number clicked:', this.href);
                // Track phone click event
                trackContactInteraction('phone');
            });
        }
        
        // Email click tracking
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.addEventListener('click', function() {
                console.log('Email clicked:', this.href);
                // Track email click event
                trackContactInteraction('email');
            });
        }
    }
    
    /**
     * Track FAQ interaction for analytics
     */
    function trackFAQInteraction(question) {
        // In production, send to analytics
        console.log('FAQ opened:', question);
        
        // Example analytics call
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                'event_category': 'FAQ',
                'event_label': question
            });
        }
    }
    
    /**
     * Track contact interaction for analytics
     */
    function trackContactInteraction(type) {
        // In production, send to analytics
        console.log('Contact method used:', type);
        
        // Example analytics call
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_click', {
                'event_category': 'Support',
                'event_label': type
            });
        }
    }
    
    /**
     * Animate elements on scroll
     */
    function animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.contact-info-section, .faq-section, .additional-help, .accordion-item'
        );
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * Search FAQs functionality (optional enhancement)
     */
    function initFAQSearch() {
        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'faq-search-container';
        searchContainer.innerHTML = `
            <div class="faq-search">
                <i class="fas fa-search"></i>
                <input type="text" id="faqSearch" placeholder="Cerca nelle FAQ...">
            </div>
        `;
        
        const faqSection = document.querySelector('.faq-section');
        const faqTitle = document.querySelector('.faq-title');
        
        if (faqSection && faqTitle) {
            faqTitle.insertAdjacentElement('afterend', searchContainer);
            
            const searchInput = document.getElementById('faqSearch');
            searchInput.addEventListener('input', function() {
                filterFAQs(this.value);
            });
        }
    }
    
    /**
     * Filter FAQs based on search term
     */
    function filterFAQs(searchTerm) {
        const accordionItems = document.querySelectorAll('.accordion-item');
        const term = searchTerm.toLowerCase();
        let visibleCount = 0;
        
        accordionItems.forEach(item => {
            const title = item.querySelector('.accordion-title').textContent.toLowerCase();
            const body = item.querySelector('.accordion-body p').textContent.toLowerCase();
            
            if (title.includes(term) || body.includes(term)) {
                item.style.display = '';
                visibleCount++;
                
                // Highlight matching text if search term exists
                if (term.length > 2) {
                    highlightText(item, term);
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        showNoResultsMessage(visibleCount);
    }
    
    /**
     * Show no results message
     */
    function showNoResultsMessage(count) {
        let noResultsMsg = document.getElementById('noResultsMessage');
        
        if (count === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMessage';
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>Nessun risultato trovato</p>
                `;
                
                const accordion = document.querySelector('.faq-accordion');
                accordion.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    
    /**
     * Highlight matching text
     */
    function highlightText(element, term) {
        // Implementation for text highlighting
        // This would require more complex DOM manipulation
        // For now, just log the match
        console.log('Match found in:', element);
    }
    
    // Optional: Initialize FAQ search if you want this feature
    // Uncomment the line below to enable search functionality
    // initFAQSearch();
    
});

/* ============================
   ADDITIONAL STYLES (inline)
   ============================ */

// Add search styles dynamically if search is enabled
if (document.getElementById('faqSearch')) {
    const style = document.createElement('style');
    style.textContent = `
        .faq-search-container {
            margin: 20px 0 30px 0;
        }
        
        .faq-search {
            position: relative;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .faq-search i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }
        
        .faq-search input {
            width: 100%;
            padding: 12px 15px 12px 45px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-family: 'Oswald', sans-serif;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .faq-search input:focus {
            outline: none;
            border-color: #1380ad;
            box-shadow: 0 0 0 3px rgba(19, 128, 173, 0.1);
        }
        
        .no-results-message {
            text-align: center;
            padding: 40px;
            color: #999;
        }
        
        .no-results-message i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .no-results-message p {
            font-family: 'Oswald', sans-serif;
            font-size: 1.1rem;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
}