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
    
    // Log to confirm icons are initialized
    console.log('Icons initialized:', document.querySelectorAll('.bg-icon').length);
});

// Function to change header color based on current section
function setupHeaderColorChange() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Get section colors from CSS
    const aboutColor = getComputedStyle(document.getElementById('about')).backgroundColor;
    const videosColor = getComputedStyle(document.getElementById('videos')).backgroundColor;
    const contactColor = getComputedStyle(document.getElementById('contact')).backgroundColor;
    
    console.log('Section colors:', { aboutColor, videosColor, contactColor });
    
    // Function to determine which section is currently in view
    function getCurrentSection() {
        const headerHeight = header.offsetHeight;
        const scrollPosition = window.scrollY + headerHeight;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            // Use the same offset logic as in the smooth scrolling function
            const sectionTop = section.offsetTop - headerHeight;
            
            if (scrollPosition >= sectionTop) {
                return section.id;
            }
        }
        
        return sections[0].id;
    }
    
    // Function to update header color
    function updateHeaderColor() {
        const currentSection = getCurrentSection();
        
        // Remove all active classes
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        document.querySelector(`.nav-links a[href="#${currentSection}"]`).classList.add('active');
        
        // Set header color based on current section
        switch (currentSection) {
            case 'about':
                header.style.backgroundColor = aboutColor;
                break;
            case 'videos':
                header.style.backgroundColor = videosColor;
                break;
            case 'contact':
                header.style.backgroundColor = contactColor;
                break;
            default:
                header.style.backgroundColor = aboutColor;
        }
    }
    
    // Update header color on scroll
    window.addEventListener('scroll', updateHeaderColor);
    
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
    const iconSizes = [80, 100, 120, 150]; // Larger sizes for better visibility
    const placedIcons = []; // Array to track placed icons and their boundaries
    
    console.log('Positioning icons:', backgroundIcons.length);
    
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
            console.log(`Icon ${index} hidden due to lack of space`);
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
        icon.style.strokeWidth = '1px'; // Ensure thin stroke width
        
        // Add this icon to the placed icons array
        placedIcons.push(position);
        
        console.log(`Icon ${index} positioned at ${position.top}px, ${position.left}px with size ${size}px and rotation ${rotation}deg`);
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
            
            // Use only the header height as offset to align with color change
            const headerHeight = header.offsetHeight;
            
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
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