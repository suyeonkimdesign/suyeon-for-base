document.addEventListener("DOMContentLoaded", () => {
    const targetTextContainer = document.querySelector('.target-text');
    const toggle = document.getElementById('dismantle-toggle');

    if (!targetTextContainer || !toggle) return;

    // 1. Isolate text nodes safely without destroying links or inner toggle structures
    const textNodes = [];
    const walk = document.createTreeWalker(targetTextContainer, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while(node = walk.nextNode()) {
        if (!node.parentElement.closest('.text-link') && !node.parentElement.closest('.interactive-container')) {
            textNodes.push(node);
        }
    }

    // 2. Fragment sentences into unbroken words, then isolate individual letters
    textNodes.forEach(node => {
        const textContent = node.nodeValue;
        const fragment = document.createDocumentFragment();
        
        // Split by spaces to find individual words, keeping the spaces intact
        const tokens = textContent.split(/(\s+)/);

        tokens.forEach(token => {
            if (/\s+/.test(token)) {
                // If it's a space or line break, inject it natively so layout wrapping stays perfect
                fragment.appendChild(document.createTextNode(token));
            } else if (token.length > 0) {
                // Create a protective wrapper for the word so it never splits mid-word
                const wordSpan = document.createElement('span');
                wordSpan.style.whiteSpace = 'nowrap';
                wordSpan.style.display = 'inline-block';

                // Break the word down into individual animatable letter spans
                for (let i = 0; i < token.length; i++) {
                    const span = document.createElement('span');
                    span.classList.add('letter');
                    span.textContent = token[i];
                    wordSpan.appendChild(span);
                }
                fragment.appendChild(wordSpan);
            }
        });

        node.parentNode.replaceChild(fragment, node);
    });

    const allLetters = targetTextContainer.querySelectorAll('.letter');

    // 3. Listen for toggle changes to generate the dismantle coordinates smoothly
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            allLetters.forEach(letter => {
                const randomX = (Math.random() * 120 - 60).toFixed(2);
                const randomY = (Math.random() * 100 - 50).toFixed(2);
                const randomRot = (Math.random() * 180 - 90).toFixed(2);

                letter.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg)`;
                letter.classList.add('exploded'); 
            });
        } else {
            allLetters.forEach(letter => {
                letter.style.transform = 'none';
                letter.classList.remove('exploded');
            });
        }
    });

// Append this logic directly inside your DOMContentLoaded block in script.js
const widget = document.getElementById('portfolio-widget');
const anchor = document.querySelector('.portfolio-tracking-anchor');

// Variables to permanently store the resting dimensions
let defaultWidth = 0;
let defaultHeight = 0;

function setupWidgetDimensions() {
    if (!widget) return;
    
    // 1. Temporarily disable transitions so the browser doesn't try to animate our measurements
    widget.style.transition = 'none';
    
    // 2. Clear out any inline styles to get its natural flex size
    widget.classList.remove('is-highlighting');
    widget.style.width = '';
    widget.style.height = '';
    widget.style.left = '';
    widget.style.top = '';
    
    // 3. Measure the exact natural size of your text string
    defaultWidth = widget.offsetWidth;
    defaultHeight = widget.offsetHeight;
    
    // 4. Force a browser reflow, then restore the smooth transition engine
    widget.offsetHeight; 
    widget.style.transition = ''; 
    
    // 5. Now that we have exact numbers, place it mathematically
    updateWidgetPosition();
}

function updateWidgetPosition() {
    if (!widget || !anchor || defaultWidth === 0) return;

    const anchorRect = anchor.getBoundingClientRect();
    
    // Check if the inline "portfolio site" text is actively inside the viewport
    const isInViewport = (
        anchorRect.top >= 0 &&
        anchorRect.left >= 0 &&
        anchorRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        anchorRect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if (isInViewport) {
        // MORPH STATE: Lock the coordinates directly onto the inline text boundaries
        widget.classList.add('is-highlighting');
        widget.style.top = `${anchorRect.top - 6}px`;     
        widget.style.left = `${anchorRect.left - 10}px`;  
        widget.style.width = `${anchorRect.width + 20}px`;
        widget.style.height = `${anchorRect.height + 12}px`;
    } else {
        // GLIDE BACK STATE: Apply the exact saved dimensions to prevent stretching
        widget.classList.remove('is-highlighting');
        widget.style.top = '24px';
        widget.style.width = `${defaultWidth}px`;
        widget.style.height = `${defaultHeight}px`;
        
        // Calculate the exact left-side coordinate to fake a "right: 20px" anchor point
        const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
        widget.style.left = `${viewportWidth - defaultWidth - 20}px`;
    }
}

// 1. Initialize dimensions perfectly on page load
setupWidgetDimensions();

// 2. Re-calculate safely on resize (in case window sizes change text layout)
window.addEventListener('resize', setupWidgetDimensions);

// 3. Fire the glide animation whenever the user scrolls
window.addEventListener('scroll', updateWidgetPosition);

});