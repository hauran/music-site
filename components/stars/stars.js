// Stars Component
// Handles the creation and animation of background stars

class StarsComponent {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.container = document.querySelector('.stars-layer');
    }
    
    init() {
        // Add a large number of static stars with different sizes and opacity
        this.addStars();
    }
    
    addStars() {
        // Stars are added to the stars-layer
        const container = this.container;
        
        // Generate a large number of stars with varied properties
        const starCount = 300; // Increased number for even better density (was 250)
        
        for (let i = 0; i < starCount; i++) {
            // Create a star element
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random size from 1-4px (with weighting toward smaller, but increased max size)
            const size = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : Math.random() < 0.95 ? 3 : 4;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Position randomly
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Star brightness variations - will be applied along with CSS transition from day to night
            // We'll set a relative brightness factor that affects the final opacity at night
            const brightnessFactor = Math.random() * 0.2 + 0.8; // Between 0.8-1.0 for varied star brightness
            star.dataset.brightness = brightnessFactor; // Store for potential later use
            
            // The initial opacity is handled by CSS, so we don't explicitly set it here
            // The CSS transition will handle the day-to-night opacity change
            
            // Add glow effect to some stars
            if (Math.random() < 0.3 && size > 1) { // 30% of stars larger than 1px get a glow
                const glowSize = size * 1.5;
                const glowColor = Math.random() < 0.2 ? 'rgba(200, 220, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)';
                star.style.boxShadow = `0 0 ${glowSize}px ${glowColor}`;
            }
            
            // Random animation duration and delay for twinkling effect
            const twinkleDuration = Math.random() * 0.8 + 0.2; // Between 0.2-1 second
            star.style.animationDuration = `${twinkleDuration}s`;
            star.style.animationDelay = `${Math.random() * 2}s`; // Random delay up to 2 seconds
            
            container.appendChild(star);
        }
    }
}

// Export the component
export default StarsComponent; 