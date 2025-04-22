document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('signup-modal');
    const modalForm = document.getElementById('modal-form');
    const closeModal = document.querySelector('.close-modal');
    
    // Get all elements that open the modal
    const openModalButtons = document.querySelectorAll('.open-signup, #hero-signup, .pricing-btn.open-signup');
    
    // Function to open modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Function to close modal
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Add click event to all open modal buttons
    openModalButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeModalFunc);
    
    // Close modal when clicking outside of modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Prevent closing when clicking inside modal content
    document.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Form submission
    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(modalForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const phone = formData.get('phone');
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', { name, email, company, phone });
        
        // Show success message
        modalForm.innerHTML = `
            <div class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <h3>Thank You!</h3>
                <p>You've been added to our waitlist. We'll notify you when InferX is ready for early access.</p>
                <button type="button" class="btn-primary close-success">Close</button>
            </div>
        `;
        
        // Add event listener to the new close button
        document.querySelector('.close-success').addEventListener('click', closeModalFunc);
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Ensure cursor visibility
    function setupBlinkingCursor() {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = 'inline-block';
        }
    }
    
    // Call the function to set up the cursor
    setupBlinkingCursor();
    
    // Add CSS class to make cards animated on scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        observer.observe(card);
    });
});