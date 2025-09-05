/**
 * Ski Teaching - Main JavaScript File
 * Handles all site functionality including header/footer loading,
 * mobile menu, scroll effects, and navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if running locally or on server
    const isLocal = window.location.protocol === 'file:';
    
    // Load FontAwesome immediately for local mode
    if (isLocal) {
        loadFontAwesome();
    }
    
    // Initialize the application
    init();
    
    /**
     * Load FontAwesome script for local mode
     */
    function loadFontAwesome() {
        if (!document.querySelector('script[src*="fontawesome"]')) {
            const script = document.createElement('script');
            script.src = 'https://kit.fontawesome.com/d857fd5c75.js';
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
            console.log('FontAwesome loaded (local mode)');
        }
    }
    
    /**
     * Initialize all functionality
     */
    function init() {
        loadIncludes();
        setupEventListeners();
        console.log(`Ski Teaching initialized in ${isLocal ? 'LOCAL' : 'SERVER'} mode`);
    }
    
    /**
     * Load head, header and footer content
     */
    function loadIncludes() {
        if (isLocal) {
            loadHeadStatic();
            loadHeaderStatic();
            loadFooterStatic();
        } else {
            loadHead();
            loadHeader();
            loadFooter();
        }
    }
    
    /**
     * Setup global event listeners
     */
    function setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', handleResize);
        
        // Initialize after delay to ensure FontAwesome is loaded
        setTimeout(initializeFeatures, isLocal ? 500 : 100);
    }
    
    /**
     * Initialize all interactive features
     */
    function initializeFeatures() {
        initMobileMenu();
        initScrollEffects();
        initSmoothScroll();
        initScrollAnimations();
        setActiveLink();
        initializeHeaderState(); // Added header state initialization
    }
    
    /**
     * Initialize header state correctly for home, chi-siamo and contatti pages
     */
    function initializeHeaderState() {
        const header = document.querySelector('.header');
        const isHomePage = document.body.querySelector('.home-page');
        const isChiSiamoPage = document.body.querySelector('.chi-siamo-page');
        const isContattiPage = document.body.querySelector('.contatti-page');
        
        if (!header) return;
        
        if (isHomePage || isChiSiamoPage || isContattiPage) {
            // Force transparent initial state for transparent header pages
            if (window.pageYOffset === 0) {
                header.style.backgroundColor = 'transparent';
                header.style.boxShadow = 'none';
                header.classList.remove('scrolled');
                
                // Apply white colors for transparency
                applyTransparentHeaderStyles(header);
            }
        }
    }
    
    /**
     * Apply transparent header styles
     */
    function applyTransparentHeaderStyles(header) {
        const navLinks = header.querySelectorAll('.nav-link');
        const logo = header.querySelector('.logo img');
        const userIcon = header.querySelector('.user-icon');
        const mobileToggle = header.querySelectorAll('.mobile-menu-toggle span');
        const btnPrenota = header.querySelector('.btn-prenota');
        
        navLinks.forEach(link => {
            link.style.color = 'white';
            link.style.setProperty('color', 'white', 'important');
        });
        
        if (logo) logo.style.filter = 'brightness(0) invert(1)';
        if (userIcon) userIcon.style.color = 'white';
        
        mobileToggle.forEach(span => {
            span.style.backgroundColor = 'white';
            span.style.setProperty('background-color', 'white', 'important');
        });
        
        if (btnPrenota) {
            btnPrenota.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            btnPrenota.style.color = 'white';
            btnPrenota.style.border = '2px solid white';
            btnPrenota.style.setProperty('color', 'white', 'important');
            btnPrenota.style.setProperty('background-color', 'rgba(255, 255, 255, 0.2)', 'important');
            btnPrenota.style.setProperty('border', '2px solid white', 'important');
        }
    }
    
    /**
     * Apply solid header styles
     */
    function applySolidHeaderStyles(header) {
        const navLinks = header.querySelectorAll('.nav-link');
        const logo = header.querySelector('.logo img');
        const userIcon = header.querySelector('.user-icon');
        const mobileToggle = header.querySelectorAll('.mobile-menu-toggle span');
        const btnPrenota = header.querySelector('.btn-prenota');
        
        navLinks.forEach(link => {
            link.style.color = '#333';
            link.style.setProperty('color', '#333', 'important');
        });
        
        if (logo) logo.style.filter = 'none';
        if (userIcon) userIcon.style.color = '#333';
        
        mobileToggle.forEach(span => {
            span.style.backgroundColor = '#333';
            span.style.setProperty('background-color', '#333', 'important');
        });
        
        if (btnPrenota) {
            btnPrenota.style.backgroundColor = '#2196F3';
            btnPrenota.style.color = 'white';
            btnPrenota.style.border = 'none';
            btnPrenota.style.setProperty('background-color', '#2196F3', 'important');
            btnPrenota.style.setProperty('color', 'white', 'important');
            btnPrenota.style.setProperty('border', 'none', 'important');
        }
    }
    
    /**
     * Initialize scroll animations for all elements
     */
    function initScrollAnimations() {
        // Skip scroll animations for contatti page
        if (document.body.querySelector('.contatti-page')) {
            console.log('Skipping scroll animations for contatti page');
            return;
        }
        
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animate class to trigger CSS animations
                    entry.target.classList.add('animate');
                    
                    // Add stagger delay for multiple elements
                    const children = entry.target.querySelectorAll('.animate-on-scroll, .fade-in-on-scroll, .slide-in-left, .slide-in-right');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);
        
        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .fade-in-on-scroll, .slide-in-left, .slide-in-right, .booking-section, .strengths-section, .support-section, .reviews-section, .contact-form-section, section'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Special observer for footer
        const footer = document.querySelector('.footer');
        if (footer) {
            observer.observe(footer);
        }
    }
    
    /**
     * Load static head content (for local development) - AGGIORNATO CON FAVICON.PNG
     */
    function loadHeadStatic() {
        const headContent = `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="Ski Teaching - Scuola di sci professionale. Lezioni di sci personalizzate con maestri qualificati.">
            <meta name="keywords" content="sci, scuola sci, lezioni sci, maestri sci, montagna, neve">
            <meta name="author" content="Ski Teaching">
            
            <meta property="og:title" content="Ski Teaching - Scuola di Sci Professionale">
            <meta property="og:description" content="Lezioni di sci personalizzate con maestri qualificati">
            <meta property="og:image" content="assets/img/logo_dark.png">
            <meta property="og:type" content="website">
            
            <link rel="icon" type="image/png" href="assets/img/favicon.png">
            <link rel="apple-touch-icon" href="assets/img/favicon.png">
            
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            
            <link rel="stylesheet" href="assets/css/style.css">
        `;
        
        document.head.insertAdjacentHTML('beforeend', headContent);
        console.log('Head loaded (local mode)');
    }
    
  /**
     * Load static header content (for local development)
     * FUNZIONE MODIFICATA CON LINK LOGIN SU ICONA USER
     */
    function loadHeaderStatic() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) return;
        
        // Check if this is a transparent header page
        const isHomePage = document.body.querySelector('.home-page');
        const isChiSiamoPage = document.body.querySelector('.chi-siamo-page');
        const isContattiPage = document.body.querySelector('.contatti-page');
        const isTransparentPage = isHomePage || isChiSiamoPage || isContattiPage;
        
        headerContainer.innerHTML = `
            <header class="header" style="${isTransparentPage ? 'background-color: transparent !important; box-shadow: none !important;' : ''}">
                <div class="header-container">
                    <div class="logo">
                        <img src="assets/img/logo_dark.png" alt="Ski Teaching Logo" style="${isTransparentPage ? 'filter: brightness(0) invert(1) !important;' : ''}">
                    </div>
                    
                    <nav class="navbar">
                        <ul class="nav-menu">
                            <li class="nav-item"><a href="index.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">HOME</a></li>
                            <li class="nav-item"><a href="chi-siamo.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">CHI SIAMO</a></li>
                            <li class="nav-item"><a href="servizi.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">SERVIZI</a></li>
                            <li class="nav-item"><a href="maestri.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">I MAESTRI</a></li>
                            <li class="nav-item"><a href="blog.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">BLOG</a></li>
                            <li class="nav-item"><a href="contatti.html" class="nav-link" style="${isTransparentPage ? 'color: white !important;' : ''}">CONTATTI</a></li>
                        </ul>
                    </nav>
                    
                    <div class="header-actions">
                        <a href="prenota.html" class="btn-prenota" style="${isTransparentPage ? 'background-color: rgba(255, 255, 255, 0.2) !important; color: white !important; border: 2px solid white !important;' : ''}">PRENOTA UNA LEZIONE</a>
                        <a href="login.html" class="user-icon" aria-label="Account utente" style="${isTransparentPage ? 'color: white !important;' : ''}">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                    
                    <button class="mobile-menu-toggle" aria-label="Menu mobile">
                        <span style="${isTransparentPage ? 'background-color: white !important;' : ''}"></span>
                        <span style="${isTransparentPage ? 'background-color: white !important;' : ''}"></span>
                        <span style="${isTransparentPage ? 'background-color: white !important;' : ''}"></span>
                    </button>
                </div>
            </header>
        `;
        
        console.log('Header loaded (local mode)');
    }
    
    /**
     * Load static footer content (for local development)
     */
    function loadFooterStatic() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;
        
        footerContainer.innerHTML = `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <!-- Logo -->
                        <div class="footer-logo">
                            <img src="assets/img/logo_light.png" alt="Ski Teaching Logo">
                        </div>
                        
                        <!-- Footer Sections -->
                        <div class="footer-sections">
                            <!-- Link Rapidi -->
                            <div class="footer-section">
                                <h3 class="footer-title">LINK RAPIDI</h3>
                                <ul class="footer-links">
                                    <li><a href="index.html">Home</a></li>
                                    <li><a href="chi-siamo.html">Chi siamo</a></li>
                                    <li><a href="servizi.html">Servizi</a></li>
                                    <li><a href="maestri.html">I maestri</a></li>
                                    <li><a href="contatti.html">Contatti</a></li>
                                </ul>
                            </div>
                            
                            <!-- Contattaci -->
                            <div class="footer-section">
                                <h3 class="footer-title">CONTATTACI</h3>
                                <div class="footer-contact">
                                    <p><a href="mailto:ciao@skiteaching.it">ciao@skiteaching.it</a></p>
                                    <p><a href="tel:08123456789">08123456789</a></p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Social Media -->
                        <div class="footer-social">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="YouTube">
                                <i class="fab fa-youtube"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
        
        console.log('Footer loaded (local mode)');
    }
    
    /**
     * Load head from external file (server mode)
     */
    function loadHead() {
        fetch('head.html')
            .then(response => response.text())
            .then(html => {
                const headContent = html.replace(/<\/?(?:html|head|body)[^>]*>/gi, '');
                document.head.insertAdjacentHTML('beforeend', headContent);
                console.log('Head loaded (server mode)');
            })
            .catch(error => {
                console.error('Error loading head:', error);
                loadHeadStatic();
            });
    }
    
    /**
     * Load header from external file (server mode)
     */
    function loadHeader() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) return;
        
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header file not found');
                return response.text();
            })
            .then(html => {
                headerContainer.innerHTML = html;
                
                // Apply immediate transparent styles if needed
                const isHomePage = document.body.querySelector('.home-page');
                const isChiSiamoPage = document.body.querySelector('.chi-siamo-page');
                const isContattiPage = document.body.querySelector('.contatti-page');
                if (isHomePage || isChiSiamoPage || isContattiPage) {
                    const header = headerContainer.querySelector('.header');
                    if (header) {
                        applyTransparentHeaderStyles(header);
                    }
                }
                
                console.log('Header loaded (server mode)');
            })
            .catch(error => {
                console.error('Error loading header:', error);
                loadHeaderStatic();
            });
    }
    
    /**
     * Load footer from external file (server mode)
     */
    function loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;
        
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer file not found');
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
                console.log('Footer loaded (server mode)');
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                loadFooterStatic();
            });
    }
    
    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!mobileMenuToggle || !navbar) return;
        
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Fix mobile menu colors for transparent header pages
            const isHomePage = document.body.querySelector('.home-page');
            const isChiSiamoPage = document.body.querySelector('.chi-siamo-page');
            const isContattiPage = document.body.querySelector('.contatti-page');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if ((isHomePage || isChiSiamoPage || isContattiPage) && scrollTop <= 100) {
                // When menu is open on transparent header, force white background
                if (navbar.classList.contains('active')) {
                    navbar.style.backgroundColor = 'white';
                    navbar.style.setProperty('background-color', 'white', 'important');
                    
                    // Force dark text in mobile menu
                    navLinks.forEach(link => {
                        link.style.setProperty('color', '#333', 'important');
                    });
                }
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        function closeMobileMenu() {
            navbar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset navbar background
            navbar.style.backgroundColor = '';
            navbar.style.removeProperty('background-color');
        }
    }
    
    /**
     * Initialize scroll effects for header
     */
    function initScrollEffects() {
        const header = document.querySelector('.header');
        const isHomePage = document.body.querySelector('.home-page');
        const isChiSiamoPage = document.body.querySelector('.chi-siamo-page');
        const isContattiPage = document.body.querySelector('.contatti-page');
        
        if (!header) return;
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Home page, Chi Siamo page and Contatti page header transparency effect
            if (isHomePage || isChiSiamoPage || isContattiPage) {
                if (scrollTop > 100) {
                    header.style.backgroundColor = 'white';
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                    header.classList.add('scrolled');
                    
                    // Apply solid header styles
                    applySolidHeaderStyles(header);
                } else {
                    header.style.backgroundColor = 'transparent';
                    header.style.boxShadow = 'none';
                    header.classList.remove('scrolled');
                    
                    // Apply transparent header styles
                    applyTransparentHeaderStyles(header);
                }
            } else {
                // Regular header behavior for other pages
                if (scrollTop > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Initialize home page features
        if (isHomePage) {
            initHomePageFeatures();
        }
    }
    
    /**
     * Initialize home page specific features
     */
    function initHomePageFeatures() {
        // Scroll arrow click handler
        const scrollArrow = document.querySelector('.scroll-arrow');
        if (scrollArrow) {
            scrollArrow.addEventListener('click', function() {
                const bookingSection = document.querySelector('.booking-section');
                if (bookingSection) {
                    bookingSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // CTA box click handler
        const ctaBox = document.querySelector('.cta-box');
        if (ctaBox) {
            ctaBox.addEventListener('click', function() {
                window.location.href = 'prenota.html';
            });
        }
        
        // Initialize magnetic effect for why-choose section
        initMagneticEffect();
        
        // Initialize text alignment
        initTextAlignment();
    }
    
    /**
     * Initialize precise text alignment with second image
     */
    function initTextAlignment() {
        function alignText() {
            const smallImage = document.querySelector('.small-image');
            const whyChooseText = document.querySelector('.why-choose-text');
            
            if (!smallImage || !whyChooseText) return;
            
            // Wait for images to load
            const img = smallImage.querySelector('img');
            if (!img) return;
            
            const alignTextPosition = () => {
                // Get the height of the small image
                const smallImageHeight = smallImage.offsetHeight;
                
                // Set the text container to have the same height as the small image
                whyChooseText.style.height = smallImageHeight + 'px';
                
                console.log('Text aligned to small image height:', smallImageHeight + 'px');
            };
            
            // If image is already loaded
            if (img.complete) {
                alignTextPosition();
            } else {
                // Wait for image to load
                img.addEventListener('load', alignTextPosition);
            }
        }
        
        // Align text on load
        setTimeout(alignText, 100);
        
        // Realign on window resize
        window.addEventListener('resize', () => {
            setTimeout(alignText, 100);
        });
        
        // Realign when animations complete
        setTimeout(alignText, 2000);
    }
    
    /**
     * Initialize magnetic effect for images in why-choose section
     */
    function initMagneticEffect() {
        const whyChooseSection = document.querySelector('.why-choose-section');
        const mainImage = document.querySelector('.main-image img');
        const smallImage = document.querySelector('.small-image img');
        
        if (!whyChooseSection || !mainImage || !smallImage) return;
        
        let isMouseInside = false;
        
        // Mouse enter handler
        whyChooseSection.addEventListener('mouseenter', function() {
            isMouseInside = true;
        });
        
        // Mouse leave handler
        whyChooseSection.addEventListener('mouseleave', function() {
            isMouseInside = false;
            // Reset images to original position
            mainImage.style.transform = 'translate(0, 0)';
            smallImage.style.transform = 'translate(0, 0)';
        });
        
        // Mouse move handler
        whyChooseSection.addEventListener('mousemove', function(e) {
            if (!isMouseInside) return;
            
            const rect = whyChooseSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate mouse position relative to center
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Calculate movement intensity (max 30px - increased for more visibility)
            const maxMove = 30;
            const moveFactorX = (mouseX / rect.width) * maxMove;
            const moveFactorY = (mouseY / rect.height) * maxMove;
            
            // Apply different movement to each image for variety
            // Main image follows mouse direction with stronger movement
            const mainMoveX = moveFactorX * 1.0;
            const mainMoveY = moveFactorY * 1.0;
            
            // Small image has opposite but also strong movement
            const smallMoveX = -moveFactorX * 0.8;
            const smallMoveY = -moveFactorY * 0.8;
            
            // Apply transforms
            mainImage.style.transform = `translate(${mainMoveX}px, ${mainMoveY}px)`;
            smallImage.style.transform = `translate(${smallMoveX}px, ${smallMoveY}px)`;
        });
    }
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Set active navigation link based on current page
     */
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === 'index.html') ||
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Handle window resize events
     */
    function handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const navbar = document.querySelector('.navbar');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navbar && mobileMenuToggle) {
                navbar.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
});