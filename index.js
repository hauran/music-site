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
        'mountains-mid-layer': {
            bottom: computedStyle.getPropertyValue('--mountains-mid-mobile-bottom').trim(),
            transform: computedStyle.getPropertyValue('--mountains-mid-mobile-transform').trim()
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

        // Apply mountain colors from CSS variables
        updateMountainColors();

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
    
    // Function to update mountain SVG colors from CSS variables
    function updateMountainColors() {
        const farColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--mountains-far-color').trim();
        const farMidColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--mountains-mid-color').trim();
        const nearColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--mountains-near-color').trim();
            
        // Create SVG strings with the colors from CSS variables
        const farSvg = createMountainSvg('far', farColor);
        const farMidSvg = createMountainSvg('mid', farMidColor);
        const nearSvg = createMountainSvg('near', nearColor);
        
        // Apply the SVGs to the mountain layers
        document.querySelector('.mountains-far-layer').style.backgroundImage = `url('data:image/svg+xml;utf8,${farSvg}')`;
        document.querySelector('.mountains-mid-layer').style.backgroundImage = `url('data:image/svg+xml;utf8,${farMidSvg}')`;
        document.querySelector('.mountains-near-layer').style.backgroundImage = `url('data:image/svg+xml;utf8,${nearSvg}')`;
    }
    
    // Helper function to create mountain SVGs with the right path and color
    function createMountainSvg(type, color) {
        // SVG paths for different mountain types
        const paths = {
            'far': 'M0,300 L0,220 L100,190 L200,220 L240,205 L300,230 L380,165 L450,190 L520,140 L600,190 L700,230 L750,160 L820,190 L900,220 L1000,180 L1080,200 L1150,140 L1200,170 L1200,300 Z',
            'mid': 'M0,300 L0,235 L70,215 L130,235 L180,205 L220,235 L290,195 L350,215 L430,185 L490,215 L550,195 L620,215 L720,175 L820,205 L900,185 L980,215 L1050,195 L1120,215 L1200,195 L1200,300 Z',
            'near': 'M0,300 L0,230 L45,220 L65,225 L80,210 L95,215 L120,220 L150,230 L180,225 L215,210 L250,190 L270,200 L300,230 L330,220 L350,215 L380,210 L410,220 L450,230 L480,225 L510,215 L550,180 L590,190 L620,200 L650,210 L690,200 L715,190 L780,180 L810,190 L850,215 L900,200 L935,185 L970,175 L1000,190 L1050,210 L1090,200 L1150,190 L1200,210 L1200,300 Z'
        };
        
        // Create SVG with the correct path and color
        const encodedColor = color.replace('#', '%23');
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="none"><path d="${paths[type]}" fill="${encodedColor}"/></svg>`;
    }
    
    // Prevent scroll on mobile
    function preventScroll(e) {
        e.preventDefault();
    }
    
    // Handle window resize
    function handleResize() {
        // Position elements appropriately for the new viewport size
        positionElementsForViewport();
        // Update mountain colors (in case CSS variables changed)
        updateMountainColors();
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
            
            // Update mountain colors in case they were reset
            updateMountainColors();
        }
    }
    
    init();
}); 