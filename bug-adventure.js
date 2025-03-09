document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameContainer = document.querySelector('.game-container');
    
    // Initialize
    function init() {
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        
        // Prevent scroll and bounce effects on mobile
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Add ambient elements
        addDynamicStyles();
        addStars();
        addShootingStars();
        
        // Initial positioning
        positionElementsForViewport();
        
        // Start the experience to trigger the night sky transition
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
    
    // Add some ambient stars for atmosphere (only in sky)
    function addStars() {
        const container = document.querySelector('.stars-layer');
        // Create stars
        for (let i = 0; i < 75; i++) { // Increased from 50 to 75 for better coverage
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Position stars evenly across the entire width (0-100%)
            // and throughout the top 70% of the screen (sky area)
            const leftPosition = Math.random() * 100; // Full width coverage (0-100%)
            
            star.style.left = `${leftPosition}%`;
            star.style.top = `${Math.random() * 70}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random base opacity - higher than before to make twinkle less dramatic
            const baseOpacity = Math.random() * 0.3 + 0.5; // Between 0.5-0.8
            star.style.opacity = baseOpacity;
            
            // Random animation duration and delay for twinkling effect - MUCH faster
            const twinkleDuration = Math.random() * 0.8 + 0.2; // Between 0.2-1 second (much faster)
            star.style.animationDuration = `${twinkleDuration}s`;
            star.style.animationDelay = `${Math.random() * 2}s`; // Random delay up to 2 seconds (reduced)
            
            container.appendChild(star);
        }
    }
    
    // Add random shooting stars
    function addShootingStars() {
        const container = document.createElement('div');
        container.classList.add('shooting-stars-layer');
        gameContainer.appendChild(container);
        
        // Create 2-4 random shooting stars (increased from 1-3)
        const numStars = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numStars; i++) {
            // Create the star element
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            
            // Random position (top 0-60% of screen)
            const topPosition = Math.random() * 60;
            star.style.top = `${topPosition}%`;
            
            // Random direction (left-to-right or right-to-left)
            const direction = Math.random() > 0.5 ? 'right' : 'left';
            
            // Random angle for diagonal movement (-30 to 30 degrees)
            const angle = Math.random() * 60 - 30;
            const radians = angle * Math.PI / 180; 
            const verticalRatio = Math.tan(radians); // Vertical movement relative to horizontal
            
            // Set up the star
            if (direction === 'right') {
                // Moving right (left to right)
                star.style.left = '-10px'; // Start off-screen left
                star.classList.add('rightward');
                star.style.setProperty('--vertical-ratio', verticalRatio);
                star.style.setProperty('--angle', `${angle}deg`);
            } else {
                // Moving left (right to left)
                star.style.right = '-10px'; // Start off-screen right
                star.classList.add('leftward');
                // For left-moving stars, SAME vertical ratio (don't invert it)
                star.style.setProperty('--vertical-ratio', verticalRatio);
                // But we do need to invert the angle for the tail rotation
                star.style.setProperty('--angle', `${-angle}deg`);
            }
            
            // Choose a random pattern (early, middle, or late visibility)
            const patterns = ['early', 'middle', 'late'];
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            // Add the pattern class
            star.classList.add(pattern);
            
            // Slightly faster animation duration (3-5 seconds)
            const duration = Math.random() * 2 + 3;
            star.style.animationDuration = `${duration}s`;
            
            // Shorter random delay between appearances (8-15 seconds)
            const delay = Math.random() * 7 + 8;
            star.style.animationDelay = `${delay}s`;
            
            // Create tail effect with random length
            const tailLength = Math.random() * 50 + 50;
            star.style.setProperty('--tail-length', `${tailLength}px`);
            
            // Add to container
            container.appendChild(star);
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
            
            .star {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                animation: twinkle linear infinite;
                transform-origin: center;
            }
            
            /* Twinkling animation - more subtle opacity and scale changes */
            @keyframes twinkle {
                0% {
                    opacity: 0.7;
                    transform: scale(0.9);
                }
                50% {
                    opacity: 0.9;
                    transform: scale(1.1);
                }
                100% {
                    opacity: 0.7;
                    transform: scale(0.9);
                }
            }
            
            /* Shooting stars layer */
            .shooting-stars-layer {
                position: absolute;
                width: 100%;
                height: 70%;
                top: 0;
                left: 0;
                pointer-events: none;
                overflow: visible;
            }
            
            /* Random shooting stars - invisible by default */
            .shooting-star {
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: transparent; /* No visible head */
                opacity: 0; /* Start invisible */
            }
            
            /* Animation for right-moving shooting stars */
            .shooting-star.rightward {
                animation-name: shootingStarRight;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            
            /* Animation for left-moving shooting stars */
            .shooting-star.leftward {
                animation-name: shootingStarLeft;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            
            /* Tail for left-moving stars */
            .shooting-star.leftward::after {
                content: '';
                position: absolute;
                top: 1px;
                right: 0;
                width: var(--tail-length, 100px);
                height: 2px;
                background: linear-gradient(to right, rgba(255, 255, 255, 0.7), transparent);
                transform-origin: right center;
                transform: rotate(var(--angle, 0deg));
            }
            
            /* Tail for right-moving stars */
            .shooting-star.rightward::after {
                content: '';
                position: absolute;
                top: 1px;
                left: 0;
                width: var(--tail-length, 100px);
                height: 2px;
                background: linear-gradient(to left, rgba(255, 255, 255, 0.7), transparent);
                transform-origin: left center;
                transform: rotate(var(--angle, 0deg));
            }
            
            /* Visibility timing classes */
            .shooting-star.early { animation-delay: 0s; }
            .shooting-star.middle { animation-delay: 2s; }
            .shooting-star.late { animation-delay: 4s; }
            
            /* Right-moving star animation */
            @keyframes shootingStarRight {
                0% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                5% {
                    transform: translate(10vw, calc(10vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
                10% {
                    transform: translate(20vw, calc(20vw * var(--vertical-ratio, 0)));
                    opacity: 0.7;
                }
                15% {
                    transform: translate(30vw, calc(30vw * var(--vertical-ratio, 0)));
                    opacity: 1;
                }
                40% {
                    transform: translate(80vw, calc(80vw * var(--vertical-ratio, 0)));
                    opacity: 1;
                }
                45% {
                    transform: translate(90vw, calc(90vw * var(--vertical-ratio, 0)));
                    opacity: 0.7;
                }
                50% {
                    transform: translate(100vw, calc(100vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
                100% {
                    transform: translate(120vw, calc(120vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
            }
            
            /* Left-moving star animation */
            @keyframes shootingStarLeft {
                0% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                5% {
                    /* For left-moving stars, the X is negative but vertical motion should match direction */
                    transform: translate(-10vw, calc(10vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
                10% {
                    transform: translate(-20vw, calc(20vw * var(--vertical-ratio, 0)));
                    opacity: 0.7;
                }
                15% {
                    transform: translate(-30vw, calc(30vw * var(--vertical-ratio, 0)));
                    opacity: 1;
                }
                40% {
                    transform: translate(-80vw, calc(80vw * var(--vertical-ratio, 0)));
                    opacity: 1;
                }
                45% {
                    transform: translate(-90vw, calc(90vw * var(--vertical-ratio, 0)));
                    opacity: 0.7;
                }
                50% {
                    transform: translate(-100vw, calc(100vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
                100% {
                    transform: translate(-120vw, calc(120vw * var(--vertical-ratio, 0)));
                    opacity: 0;
                }
            }
            
            /* Constrain elements to the viewport */
            @media (max-width: 768px) {
                .forest-element {
                    max-height: 30vh;
                }
                
                .star {
                    max-width: 2px;
                    max-height: 2px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start the experience
    function startExperience() {
        console.log('Starting experience...');
        
        // Trigger sky transition to night after a short delay
        setTimeout(() => {
            const skyLayer = document.querySelector('.sky-layer');
            if (skyLayer) {
                console.log('Adding night class to sky-layer');
                skyLayer.classList.add('night');
                
                // Log the current state of the sky elements
                const skyDay = document.querySelector('.sky-day');
                const skyNight = document.querySelector('.sky-night');
                
                if (skyDay && skyNight) {
                    console.log('Sky day/night elements found');
                    console.log('Sky day style:', window.getComputedStyle(skyDay).height);
                    console.log('Sky night style:', window.getComputedStyle(skyNight).height);
                } else {
                    console.log('Sky day/night elements not found');
                }
            } else {
                console.log('Sky layer not found');
            }
        }, 1000); // Start transition after 1 second
    }
    
    // Initialize the game
    init();
}); 