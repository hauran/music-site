// Define section gradients to match CSS (moved to global scope)
const sectionGradients = {
    'about': 'linear-gradient(135deg, rgba(249, 247, 243, 0.9) 0%, rgba(255, 253, 250, 0.9) 100%)',
    'videos': 'linear-gradient(135deg, rgba(230, 242, 230, 0.9) 0%, rgba(240, 250, 240, 0.9) 100%)',
    'contact': 'linear-gradient(135deg, rgba(240, 230, 245, 0.9) 0%, rgba(250, 240, 255, 0.9) 100%)'
};

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all icons with specific options
    lucide.createIcons({
        attrs: {
            stroke: 'currentColor',
            'stroke-width': 1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        }
    });
    
    // Position background icons randomly
    setTimeout(positionBackgroundIcons, 100); // Add a small delay to ensure icons are loaded
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Setup header shadow on scroll
    setupHeaderShadow();
    
    // Setup header color change on scroll
    setupHeaderColorChange();
    
    // Setup section parallax effect
    setupSectionParallax();
});

// Function to change header color based on current section
function setupHeaderColorChange() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Track if we're currently in a manual navigation
    let isManualNavigation = false;
    let manualNavigationTimeout;
    
    // Function to set manual navigation mode
    window.setManualNavigationMode = function(duration = 1000) {
        isManualNavigation = true;
        clearTimeout(manualNavigationTimeout);
        
        // Reset after the specified duration
        manualNavigationTimeout = setTimeout(() => {
            isManualNavigation = false;
        }, duration);
    };
    
    // Function to determine which section is currently in view
    function getCurrentSection() {
        const headerHeight = header.offsetHeight;
        
        // Calculate the position where we want the color to change
        // This is set to the middle of the header
        const triggerPosition = window.scrollY + (headerHeight / 2);
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            
            // Get the exact top position of the section
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            
            // Get the section's content top (accounting for padding)
            const sectionContentTop = sectionTop + parseFloat(getComputedStyle(section).paddingTop);
            
            // Change color when the middle of the header crosses the content start
            if (triggerPosition >= sectionContentTop) {
                return section.id;
            }
        }
        
        // Default to the first section if no conditions are met
        return sections[0].id;
    }
    
    // Function to update header color
    function updateHeaderColor() {
        // Skip if we're in manual navigation mode
        if (isManualNavigation) {
            return;
        }
        
        const currentSection = getCurrentSection();
        
        // Remove all active classes
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        try {
            const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } catch (error) {
            // Silently handle errors
        }
        
        // Set header background gradient based on current section
        if (sectionGradients[currentSection]) {
            header.style.background = sectionGradients[currentSection];
        }
    }
    
    // Update header color on scroll with throttling for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderColor();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial update
    updateHeaderColor();
}

// Function to add shadow to header on scroll
function setupHeaderShadow() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Function to position background icons randomly
function positionBackgroundIcons() {
    const backgroundIcons = document.querySelectorAll('.bg-icon');
    const iconSizes = [100, 120, 150, 180]; // Increased sizes for better visibility
    const placedIcons = []; // Array to track placed icons and their boundaries
    
    // Clear any existing styles first
    backgroundIcons.forEach(icon => {
        icon.removeAttribute('style');
    });
    
    // Function to check if a new icon position would overlap with existing icons
    function wouldOverlap(newIcon) {
        // Add some padding around icons to ensure they're not too close
        const padding = 20;
        
        for (const existingIcon of placedIcons) {
            // Calculate the centers of both icons
            const newCenterX = newIcon.left + newIcon.size / 2;
            const newCenterY = newIcon.top + newIcon.size / 2;
            const existingCenterX = existingIcon.left + existingIcon.size / 2;
            const existingCenterY = existingIcon.top + existingIcon.size / 2;
            
            // Calculate the distance between centers
            const dx = newCenterX - existingCenterX;
            const dy = newCenterY - existingCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate the minimum distance needed to avoid overlap (sum of radii + padding)
            const minDistance = (newIcon.size / 2) + (existingIcon.size / 2) + padding;
            
            // If distance is less than minimum distance, there's an overlap
            if (distance < minDistance) {
                return true;
            }
        }
        
        return false;
    }
    
    // Function to get a valid position for an icon
    function getValidPosition(size) {
        // Maximum attempts to find a non-overlapping position
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            // Generate random position (in pixels rather than percentages for more precise collision detection)
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Keep away from edges
            const left = Math.random() * (viewportWidth - size - 40) + 20;
            const top = Math.random() * (viewportHeight - size - 40) + 20;
            
            const newIcon = { left, top, size };
            
            // Check if this position would overlap with any existing icon
            if (!wouldOverlap(newIcon)) {
                return newIcon;
            }
            
            attempts++;
        }
        
        // If we couldn't find a non-overlapping position after max attempts,
        // return null and we'll handle this case separately
        return null;
    }
    
    backgroundIcons.forEach((icon, index) => {
        // Random size
        const size = iconSizes[Math.floor(Math.random() * iconSizes.length)];
        
        // Get a valid position that doesn't overlap
        const position = getValidPosition(size);
        
        // If we couldn't find a valid position, hide this icon
        if (!position) {
            icon.style.display = 'none';
            return;
        }
        
        // Slight random rotation (limited to -30 to +30 degrees to prevent upside down icons)
        const rotation = (Math.random() * 60) - 30;
        
        // Store the rotation value as a data attribute for later use
        icon.dataset.rotation = rotation;
        
        // Apply styles directly to the DOM element
        icon.style.position = 'absolute';
        icon.style.top = `${position.top}px`;
        icon.style.left = `${position.left}px`;
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        icon.style.transform = `rotate(${rotation}deg)`;
        icon.style.display = 'block';
        icon.style.opacity = '1';
        icon.style.color = '#000';
        icon.style.strokeWidth = '1.2px'; // Match the CSS value
        
        // Add this icon to the placed icons array
        placedIcons.push(position);
    });
    
    // Force a repaint
    document.querySelector('.background-icons').style.display = 'none';
    setTimeout(() => {
        document.querySelector('.background-icons').style.display = 'block';
    }, 10);
}

// Function for smooth scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) {
                return;
            }
            
            // Get the section's content top (accounting for padding)
            const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;
            const sectionPadding = parseFloat(getComputedStyle(targetSection).paddingTop);
            const sectionContentTop = sectionTop + sectionPadding;
            
            // Use header height as offset
            const headerHeight = header.offsetHeight;
            
            // Enable manual navigation mode to prevent scroll detection from overriding
            if (window.setManualNavigationMode) {
                window.setManualNavigationMode(1500); // Prevent auto-detection for 1.5 seconds
            }
            
            // Set active class manually - IMPORTANT: Do this before scrolling
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            link.classList.add('active');
            
            // Update header background color
            const sectionId = targetId.substring(1); // Remove the # from the ID
            if (sectionGradients && sectionGradients[sectionId]) {
                header.style.background = sectionGradients[sectionId];
            }
            
            // Scroll to the section
            window.scrollTo({
                top: sectionContentTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });
}

// Simplified parallax effect with rotation preservation
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const backgroundIcons = document.querySelectorAll('.bg-icon');
    
    backgroundIcons.forEach((icon, index) => {
        // Skip hidden icons
        if (icon.style.display === 'none') return;
        
        const speed = 0.05 + (index % 3) * 0.02;
        const yPos = scrollPosition * speed;
        
        // Get the original rotation from the data attribute
        const rotation = icon.dataset.rotation || '0';
        
        // Apply transform with both translation and original rotation
        icon.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
});

// Function to add subtle parallax effect to sections
function setupSectionParallax() {
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        sections.forEach((section) => {
            // Calculate how far the section is from the top of the viewport
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Only apply effect when section is in view
            if (sectionTop < viewportHeight && sectionTop > -sectionHeight) {
                // Calculate a value between -10 and 10 based on scroll position
                const yValue = (sectionTop / viewportHeight) * 10;
                
                // Apply a subtle transform to the section's background
                section.style.backgroundPosition = `center ${yValue}px`;
            }
        });
    });
}