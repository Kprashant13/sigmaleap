document.addEventListener('DOMContentLoaded', function() {
    // Google Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFrZ52SoXxq5gdhXA7bWNITAbJc5wfMtLNwvKwFYrP3r7dovaCo2IoPOc22pK5THnA/exec';
    
    // Modal functionality
    const modal = document.getElementById('signup-modal');
    const openButtons = document.querySelectorAll('.open-signup, #open-signup, #hero-signup');
    const closeButton = document.querySelector('.close-modal');
    
    // Open modal function
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Track modal open in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'modal_open', {
                'event_category': 'engagement',
                'event_label': 'signup_modal'
            });
        }
    }
    
    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form states when closing
        document.getElementById('modal-form').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }
    
    // Retry form function
    function retryForm() {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('modal-form').style.display = 'block';
    }
    
    // Make retryForm available globally
    window.retryForm = retryForm;
    window.closeModal = closeModal;
    
    // Add click events to all buttons that open the modal
    openButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
    
    // Close modal when clicking X
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
    
    // Form submission handler
    document.getElementById('modal-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            role: formData.get('role'),
            usecase: formData.get('usecase') || ''
        };
        
        try {
            // Send to Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Since mode is 'no-cors', we can't read the response
            // We'll assume success if no error was thrown
            
            // Show success message
            document.getElementById('modal-form').style.display = 'none';
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
            
            // Track conversion in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'signup', {
                    'event_category': 'conversion',
                    'event_label': 'early_access',
                    'value': 1
                });
            }
            
            // Reset form for next use
            e.target.reset();
            
            // Update spots remaining (decrease by 1)
            updateSpotsRemaining(true);
            
        } catch (error) {
            // Show error message
            document.getElementById('modal-form').style.display = 'none';
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update spots remaining
    let currentSpots = 387; // Starting number
    
    function updateSpotsRemaining(decrease = false) {
        if (decrease) {
            currentSpots = Math.max(0, currentSpots - 1);
        }
        
        const spotsElements = document.querySelectorAll('.spots-left');
        spotsElements.forEach(el => {
            el.textContent = `${currentSpots} spots remaining`;
        });
        
        // Also update in the CTA caption
        const ctaCaption = document.querySelector('.cta-caption');
        if (ctaCaption) {
            ctaCaption.innerHTML = `Limited to 500 spots • No credit card required • ${currentSpots} spots remaining`;
        }
    }
    
    // Initialize spots on page load
    updateSpotsRemaining();
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll('.section, .feature-card, .pricing-card, .testimonial-card, .faq-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effect to example cards
    const exampleCards = document.querySelectorAll('.example-card');
    exampleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Demo placeholder click handler
    const demoPlaceholder = document.querySelector('.demo-placeholder');
    if (demoPlaceholder) {
        demoPlaceholder.addEventListener('click', function() {
            // You can add video modal or redirect to demo
            alert('Demo video coming soon! For now, request early access to see the platform in action.');
        });
    }
    
    // Add loading animation to buttons on click
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (!button.classList.contains('open-signup') && button.id !== 'submit-btn') {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
    });
    
    // Mobile menu toggle (if you add a hamburger menu later)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Console Easter egg
    console.log('%c🚀 Welcome to Sigmaleap!', 'font-size: 20px; font-weight: bold; color: #0066FF;');
    console.log('%cWe\'re building the future of software development. Join us!', 'font-size: 14px; color: #10B981;');
    console.log('%cInterested in joining our team? Email us at careers@sigmaleap.ai', 'font-size: 12px; color: #666;');
});

// Page performance tracking
window.addEventListener('load', function() {
    // Track page load time
    if (typeof gtag !== 'undefined' && performance.timing) {
        const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        gtag('event', 'timing_complete', {
            'name': 'load',
            'value': pageLoadTime,
            'event_category': 'performance'
        });
    }
});