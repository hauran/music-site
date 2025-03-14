// Shooting Stars Component
// Handles the creation and animation of shooting stars

class ShootingStarsComponent {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.container = document.querySelector('.shooting-stars-layer');
        this.activeShootingStars = 0;
        this.MAX_SHOOTING_STARS = 1;
    }
    
    init() {
        // Clear any existing shooting stars from the HTML
        this.container.innerHTML = '';
        
        // Start the shooting stars generation with a longer initial delay
        setTimeout(() => {
            this.createRandomShootingStar();
        }, 10000 * Math.random());
        
        // Begin additional shooting stars with staggered delays - but don't exceed our maximum
        setTimeout(() => {
            if (this.activeShootingStars < this.MAX_SHOOTING_STARS) this.createRandomShootingStar();
        }, 2000 + Math.random() * 5000);
        
        setTimeout(() => {
            if (this.activeShootingStars < this.MAX_SHOOTING_STARS) this.createRandomShootingStar();
        }, 5000 + Math.random() * 8000);
    }
    
    createRandomShootingStar() {
        // Don't create more stars if we're at the maximum
        if (this.activeShootingStars >= this.MAX_SHOOTING_STARS) {
            // Try again after some delay
            setTimeout(() => {
                this.createRandomShootingStar();
            }, 3000 + Math.random() * 3000);
            return;
        }
        
        // Increment the active stars counter
        this.activeShootingStars++;
        
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
        
        // Set random tail appearance
        const tailLength = 40 + Math.random() * 40; // 40-120px
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
        this.container.appendChild(wrapper);
        
        // Animation timing
        const totalDuration = 2000 + Math.random() * 2000; // 1-4 seconds total
        const fadeInTime = totalDuration * 0.1;
        const fadeOutTime = totalDuration * 0.3;
        
        // Define the "danger zone" - when stars might approach mountains
        // This is the point at which we'll start fading them out if they're too low
        const dangerZoneProgress = 0.75; // At 75% of their journey
        const safeHeightThreshold = 45; // Maximum % from top where stars can be fully visible
        
        // Randomize maximum opacity and create fluctuation values
        const maxOpacity = 0.5 + Math.random() * 0.5; // Random max opacity between 0.5-1.0
        const fluctuationSpeed = 100 + Math.random() * 200; // How quickly opacity fluctuates
        const fluctuationAmount = Math.random() * 0.2; // How much opacity fluctuates (0-0.2)
        
        // Create animation with requestAnimationFrame
        let startTime = null;
        let opacity = 0;
        
        const animate = (timestamp) => {
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
                this.container.removeChild(wrapper);
                
                // Decrement the active stars counter
                this.activeShootingStars--;
                
                // Schedule next star with random delay
                const nextDelay = 25000 + Math.random() * 20000; // 25-45 seconds (increased from 8-18 seconds)
                setTimeout(() => this.createRandomShootingStar(), nextDelay);
            }
        };
        
        // Start the animation in the next frame
        requestAnimationFrame(animate);
        
        // Create potential additional simultaneous star with low probability
        // But only if we're not already at the maximum
        if (Math.random() < 0.01 && this.activeShootingStars < this.MAX_SHOOTING_STARS) { // 1% chance (reduced from 5%)
            setTimeout(() => {
                this.createRandomShootingStar();
            }, Math.random() * 1000);
        }
    }
}

// Export the component
export default ShootingStarsComponent; 