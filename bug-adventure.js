document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameContainer = document.querySelector('.game-container');
    const controlsInfo = document.querySelector('.controls-info');
    
    // State variables
    const isMobile = window.innerWidth <= 768;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Initialize
    function init() {
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        
        // Prevent scroll and bounce effects on mobile
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Add ambient elements
        addDynamicStyles();
        addParticles();
        
        // Initial positioning
        positionElementsForViewport();
        
        // Start experience immediately
        startExperience();
    }
    
    // Prevent scroll on mobile
    function preventScroll(e) {
        e.preventDefault();
    }
    
    // Handle window resize
    function handleResize() {
        // Position elements appropriately for the new viewport size
        positionElementsForViewport();
    }
    
    // Position elements appropriately for viewport
    function positionElementsForViewport() {
        const isMobile = window.innerWidth <= 768;
        const viewportCenter = window.innerWidth / 2;
        
        // Select all scene layers
        const sceneLayers = document.querySelectorAll('.scene-layer');
        
        // If mobile, adjust layers to show the center part without resizing
        if (isMobile) {
            // For each layer, ensure it's centered on the important content
            sceneLayers.forEach(layer => {
                const className = layer.className.split(' ')[1]; // Get the second class name
                
                // For clouds, position them to be clearly visible
                if (className === 'clouds-layer') {
                    // Position is handled in CSS
                }
            });
        }
    }
    
    // Start the experience
    function startExperience() {
        // Show controls info briefly
        controlsInfo.style.opacity = 1;
        
        // Hide controls info after a few seconds
        setTimeout(() => {
            controlsInfo.style.opacity = 0;
        }, 4000);
    }
    

    
    // Add some ambient particles for atmosphere (only in sky)
    function addParticles() {
        const container = document.createElement('div');
        container.classList.add('particles-container');
        gameContainer.appendChild(container);
        
        const isMobile = window.innerWidth <= 768;
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Position particles only in the top 70% of the screen (sky area)
            // For mobile compatibility, keep particles contained within viewport
            const leftPosition = isMobile ?
                // For mobile, keep within central 90% of viewport
                5 + (Math.random() * 90) :
                // For desktop, use a wider area
                20 + (Math.random() * 60);
                
            particle.style.left = `${leftPosition}%`;
            particle.style.top = `${Math.random() * 70}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.7 + 0.3;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 10}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Add CSS for dynamically created elements
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .forest-element {
                position: absolute;
                bottom: 0;
                background-color: #1e5731;
                border-radius: 50% 50% 0 0;
            }
            
            .particles-container {
                position: absolute;
                width: 100%;
                height: 70%;
                top: 0;
                z-index: 2;
                pointer-events: none;
                overflow: hidden;
            }
            
            .particle {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                animation: floatParticle 15s ease-in-out infinite;
            }
            
            @keyframes floatParticle {
                0% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-20px);
                }
                100% {
                    transform: translateY(0);
                }
            }
            
            /* Constrain elements to the viewport */
            @media (max-width: 768px) {
                .forest-element {
                    max-height: 30vh;
                }
                
                .particle {
                    max-width: 2px;
                    max-height: 2px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize the game
    init();
}); 