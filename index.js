// Import components
import StarsComponent from './components/stars/stars.js';
import ShootingStarsComponent from './components/shooting-stars/shooting-stars.js';

document.addEventListener('DOMContentLoaded', () => {
    // scene elements
    const sceneContainer = document.querySelector('.scene-container');
    
    // Component instances
    let starsComponent;
    let shootingStarsComponent;
    
    // Get CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Mountain layers configuration
    const mountainLayers = {
        'mountains-far-layer': {
            bottom: computedStyle.getPropertyValue('--mountains-far-mobile-bottom').trim(),
            transform: computedStyle.getPropertyValue('--mountains-far-mobile-transform').trim()
        },
        'mountains-far-mid-layer': {
            bottom: computedStyle.getPropertyValue('--mountains-far-mid-mobile-bottom').trim(),
            transform: computedStyle.getPropertyValue('--mountains-far-mid-mobile-transform').trim()
        },
        'mountains-near-layer': {
            bottom: computedStyle.getPropertyValue('--mountains-near-mobile-bottom').trim(),
            transform: computedStyle.getPropertyValue('--mountains-near-mobile-transform').trim()
        }
    };
    
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
        
        // Add a periodic check to ensure mountains remain visible
        if (window.innerWidth <= 768) {
            setInterval(ensureMountainsVisible, 2000);
        }
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
                } 
                // Handle mountain layers using the configuration object
                else if (mountainLayers[className]) {
                    const config = mountainLayers[className];
                    
                    // Position mountains at a balanced height
                    layer.style.top = 'auto';
                    layer.style.bottom = config.bottom;
                    layer.style.height = '45%';
                    layer.style.transform = config.transform;
                    
                    // Ensure visibility
                    layer.style.display = 'block';
                    layer.style.visibility = 'visible';
                    layer.style.opacity = '1';
                    
                    // Force layout recalculation to ensure visibility
                    void layer.offsetHeight;
                }
            });
        } else {
            // Reset any mobile-specific positioning
            sceneLayers.forEach(layer => {
                layer.style.top = '';
                layer.style.height = '';
                layer.style.bottom = '';
                layer.style.display = '';
                layer.style.visibility = '';
                layer.style.opacity = '';
                layer.style.backgroundPosition = '';
                layer.style.transform = '';
            });
        }
        
        // Force a reflow to ensure changes are applied
        void document.body.offsetHeight;
    }
    
    // Function to ensure mountains stay visible (can be called periodically)
    function ensureMountainsVisible() {
        if (window.innerWidth <= 768) {
            // Use the configuration object to ensure mountains are visible
            Object.entries(mountainLayers).forEach(([className, config]) => {
                const layer = document.querySelector(`.${className}`);
                if (layer) {
                    // Ensure visibility
                    layer.style.display = 'block';
                    layer.style.visibility = 'visible';
                    layer.style.opacity = '1';
                    
                    // Position correctly
                    layer.style.top = 'auto';
                    layer.style.bottom = config.bottom;
                    layer.style.height = '45%';
                    layer.style.transform = config.transform;
                }
            });
        }
    }
    
    init();
}); 