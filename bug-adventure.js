document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    function init() {
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        
        // Prevent scroll and bounce effects on mobile
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Add ambient elements
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
    
    // Add shooting stars using recursive JavaScript function
    function addShootingStars() {
        // Use the existing shooting-stars-layer from HTML
        const container = document.querySelector('.shooting-stars-layer');
        
        // Clear any existing shooting stars from the HTML 
        container.innerHTML = '';
        
        // Add a counter to track the number of active shooting stars
        let activeShootingStars = 0;
        const MAX_SHOOTING_STARS = 3; // Maximum number of stars allowed at once
        
        // Start the recursive function to create shooting stars
        createRandomShootingStar();
        
        // Begin additional shooting stars with staggered delays - but don't exceed our maximum
        setTimeout(() => {
            if (activeShootingStars < MAX_SHOOTING_STARS) createRandomShootingStar();
        }, 2000 + Math.random() * 5000);
        
        setTimeout(() => {
            if (activeShootingStars < MAX_SHOOTING_STARS) createRandomShootingStar();
        }, 5000 + Math.random() * 8000);
        
        // Function to create and animate a single shooting star then recursively create another
        function createRandomShootingStar() {
            // Don't create more stars if we're at the maximum
            if (activeShootingStars >= MAX_SHOOTING_STARS) {
                // Try again after some delay
                setTimeout(() => {
                    createRandomShootingStar();
                }, 3000 + Math.random() * 3000);
                return;
            }
            
            // Increment the active stars counter
            activeShootingStars++;
            
            // Direction: either left-to-right or right-to-left
            const direction = Math.random() > 0.5 ? 'leftToRight' : 'rightToLeft';
            
            // Keep stars higher in the sky to start
            // Base height is between 0% and 20% from the top
            const baseHeight = Math.random() * 20;
            
            // Calculate the travel distance in the X direction (110% of screen width)
            const xDistance = 110; // from -5 to 105 or vice versa
            
            // For 45 degree diagonal, height change should be similar to x-distance
            // Add some randomness to the angle, between 35-55 degrees
            const angleVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
            const heightChange = xDistance * angleVariation; // For ~45 degree angle
            
            // Always go downward - removed upward diagonal option
            // Calculate start and end heights
            const startHeight = baseHeight;
            const endHeight = startHeight + heightChange;
            
            // Ensure we don't go below a minimum height or above maximum
            // This ensures stars don't start or end off-screen
            const finalStartHeight = Math.min(Math.max(startHeight, 0), 40); // Start in top 40%
            const finalEndHeight = Math.min(Math.max(endHeight, 0), 60); // End before bottom 40%
            
            // Calculate start and end coordinates based on direction
            let startX, startY, endX, endY;
            
            if (direction === 'leftToRight') {
                // Left to right, start off-screen left, end off-screen right
                startX = -5;
                startY = finalStartHeight;
                endX = 105;
                endY = finalEndHeight;
            } else {
                // Right to left, start off-screen right, end off-screen left
                startX = 105;
                startY = finalStartHeight;
                endX = -5;
                endY = finalEndHeight;
            }
            
            // Create the wrapper div that will contain the shooting star (now just a tail)
            const wrapper = document.createElement('div');
            wrapper.classList.add('shooting-star-wrapper');
            wrapper.style.position = 'absolute';
            wrapper.style.left = `${startX}%`;
            wrapper.style.top = `${startY}%`;
            wrapper.style.width = '3px'; 
            wrapper.style.height = '3px';
            wrapper.style.opacity = 0;
            wrapper.style.pointerEvents = 'none';
            
            // No longer need a separate starDot element
            // Create only the tail - shooting stars look more realistic with just a tail
            
            // Set random tail appearance
            const tailLength = 40 + Math.random() * 40; // 40-80px
            const tailWidth = 1 + Math.random() * 3; // 1-4px (slightly wider than before)
            
            // Calculate the angle of travel
            const dx = endX - startX;
            const dy = endY - startY;
            const angleInRadians = Math.atan2(dy, dx);
            const angleInDegrees = angleInRadians * 180 / Math.PI;
            
            // Create tail
            const tail = document.createElement('div');
            tail.style.position = 'absolute';
            tail.style.height = `${tailWidth}px`;
            tail.style.width = `${tailLength}px`;
            tail.style.transformOrigin = 'left center'; // Rotate from the leading edge
            
            // Make the tail slightly brighter at the leading edge
            if (direction === 'leftToRight') {
                // For left-to-right stars
                tail.style.left = '0'; 
                tail.style.top = '1.5px';
                tail.style.transform = `rotate(${angleInDegrees}deg)`;
                tail.style.background = 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)';
            } else {
                // For right-to-left stars
                tail.style.left = '0';
                tail.style.top = '1.5px';
                tail.style.transform = `rotate(${180 + angleInDegrees}deg)`;
                tail.style.background = 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)';
            }
            
            wrapper.appendChild(tail);
            container.appendChild(wrapper);
            
            // Animation timing
            const totalDuration = 1000 + Math.random() * 3000; // 1-4 seconds total
            const fadeInTime = totalDuration * 0.1;
            const fadeOutTime = totalDuration * 0.3;
            const visibleTime = totalDuration - fadeInTime - fadeOutTime;
            
            // Define the "danger zone" - when stars might approach mountains
            // This is the point at which we'll start fading them out if they're too low
            const dangerZoneProgress = 0.75; // At 75% of their journey
            const safeHeightThreshold = 45; // Maximum % from top where stars can be fully visible
            
            // Randomize maximum opacity and create fluctuation values
            const maxOpacity = 0.5 + Math.random() * 0.5; // Random max opacity between 0.5-1.0
            const fluctuationSpeed = 100 + Math.random() * 200; // How quickly opacity fluctuates
            const fluctuationAmount = Math.random() * 0.2; // How much opacity fluctuates (0-0.2)
            
            // Calculate the distance and travel speed
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const speed = distance / totalDuration; // percent per millisecond
            
            // Create animation with requestAnimationFrame
            let startTime = null;
            let opacity = 0;
            
            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                if (elapsed <= totalDuration) {
                    // Calculate position based on elapsed time
                    const progress = elapsed / totalDuration;
                    const currentX = startX + (endX - startX) * progress;
                    const currentY = startY + (endY - startY) * progress;
                    
                    // Update position
                    wrapper.style.left = `${currentX}%`;
                    wrapper.style.top = `${currentY}%`;
                    
                    // Handle opacity changes with randomized fluctuation
                    if (elapsed <= fadeInTime) {
                        // Fade in
                        opacity = (elapsed / fadeInTime) * maxOpacity;
                    } else if (elapsed >= totalDuration - fadeOutTime) {
                        // Fade out
                        opacity = maxOpacity * (1 - (elapsed - (totalDuration - fadeOutTime)) / fadeOutTime);
                    } else {
                        // Full visibility with random fluctuations
                        // Use sine wave to create natural fluctuation
                        const fluctuation = Math.sin(elapsed / fluctuationSpeed) * fluctuationAmount;
                        opacity = Math.max(0.1, Math.min(1, maxOpacity + fluctuation));
                        
                        // Extra fade-out logic for when stars get too low or too close to mountains
                        if (progress > dangerZoneProgress) {
                            // Calculate how far into the danger zone we are (0-1)
                            const dangerProgress = (progress - dangerZoneProgress) / (1 - dangerZoneProgress);
                            
                            // If the star is below our safe threshold, start fading it out
                            const heightPercent = currentY;
                            if (heightPercent > safeHeightThreshold) {
                                // Calculate how much to reduce opacity based on height
                                const heightDanger = (heightPercent - safeHeightThreshold) / (100 - safeHeightThreshold);
                                // The lower the star and the further along, the more we fade it
                                const fadeReduction = dangerProgress * heightDanger * maxOpacity;
                                opacity = Math.max(0, opacity - fadeReduction);
                            }
                        }
                    }
                    
                    wrapper.style.opacity = opacity;
                    
                    // Also randomly adjust the tail brightness
                    if (Math.random() < 0.05) { // 5% chance per frame to adjust tail
                        const tailBrightness = Math.max(0.3, opacity * (0.8 + Math.random() * 0.4));
                        if (direction === 'leftToRight') {
                            tail.style.background = `linear-gradient(to left, rgba(255,255,255,${tailBrightness}), transparent)`;
                        } else {
                            tail.style.background = `linear-gradient(to right, rgba(255,255,255,${tailBrightness}), transparent)`;
                        }
                    }
                    
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete, remove the star
                    container.removeChild(wrapper);
                    
                    // Decrement the active stars counter
                    activeShootingStars--;
                    
                    // Schedule next star with random delay
                    const nextDelay = 5000 + Math.random() * 10000; // 5-13 seconds
                    setTimeout(createRandomShootingStar, nextDelay);
                }
            }
            
            // Start the animation in the next frame
            requestAnimationFrame(animate);
            
            // Create potential additional simultaneous star with low probability
            // But only if we're not already at the maximum
            if (Math.random() < 0.15 && activeShootingStars < MAX_SHOOTING_STARS) { // 15% chance of "meteor shower" effect
                setTimeout(() => {
                    createRandomShootingStar();
                }, Math.random() * 1000);
            }
        }
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