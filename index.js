// Import components
import StarsComponent from './components/stars/stars.js';
import ShootingStarsComponent from './components/shooting-stars/shooting-stars.js';

document.addEventListener('DOMContentLoaded', () => {
    // scene elements
    const sceneContainer = document.querySelector('.scene-container');
    
    // Component instances
    let starsComponent;
    let shootingStarsComponent;
    
    // Initialize
    function init() {
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        
        // Prevent scroll and bounce effects on mobile
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Initialize components
        starsComponent = new StarsComponent(sceneContainer);
        shootingStarsComponent = new ShootingStarsComponent(sceneContainer);
        
        starsComponent.init();
        shootingStarsComponent.init();
        
        // Initial positioning
        positionElementsForViewport();

        // start sunset
        setTimeout(() => {
            const skyLayer = document.querySelector('.sky-layer');
            skyLayer.classList.add('night');
        }, 1000);
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
                    // Mobile needs the clouds to be higher in the viewport
                    layer.style.top = '25%';
                } else if (className === 'mountains-far-layer' || 
                           className === 'mountains-near-layer' ||
                           className === 'mountains-far-mid-layer') {
                    // Position mountains to be visible on small screens
                    layer.style.top = '40%';
                }
            });
        } else {
            // Reset any mobile-specific positioning
            sceneLayers.forEach(layer => {
                layer.style.top = '';
            });
        }
    }
    init();
}); 