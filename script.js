document.addEventListener("DOMContentLoaded", () => {
    
    const targetTextContainer = document.querySelector('.target-text');
    const toggle = document.getElementById('dismantle-toggle');

    if (targetTextContainer && toggle) {
        const textNodes = [];
        const walk = document.createTreeWalker(targetTextContainer, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while(node = walk.nextNode()) {
            if (!node.parentElement.closest('.text-link') && 
                !node.parentElement.closest('.interactive-container')) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(node => {
            const textContent = node.nodeValue;
            const fragment = document.createDocumentFragment();
            const tokens = textContent.split(/(\s+)/);

            tokens.forEach(token => {
                if (/\s+/.test(token)) {
                    fragment.appendChild(document.createTextNode(token));
                } else if (token.length > 0) {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.whiteSpace = 'nowrap';
                    wordSpan.style.display = 'inline-block';

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
    }

    
    const widget = document.getElementById('portfolio-widget');
    const anchor = document.querySelector('.portfolio-tracking-anchor');

    let defaultWidth = 0;
    let defaultHeight = 0;
    let lastWindowWidth = window.innerWidth;

    function setupWidgetDimensions() {
        if (!widget || widget.classList.contains('is-highlighting')) return;
        
        widget.style.transition = 'none';
        
        widget.style.left = '';
        widget.style.width = '';
        widget.style.height = '';
        
        widget.style.right = '20px';
        widget.style.top = window.innerWidth <= 768 ? '16px' : '24px';
        
        defaultWidth = widget.offsetWidth;
        defaultHeight = widget.offsetHeight;
        
        widget.style.right = ''; 
        const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
        widget.style.left = `${viewportWidth - defaultWidth - 20}px`;
        
        widget.offsetHeight; 
        widget.style.transition = ''; 
        updateWidgetPosition();
    }

    function updateWidgetPosition() {
        if (!widget || !anchor || defaultWidth === 0) return;

        const anchorRect = anchor.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

   
        const anchorCenterY = anchorRect.top + (anchorRect.height / 2);

        const isInViewport = (
            anchorCenterY > 0 &&
            anchorCenterY < viewportHeight &&
            anchorRect.left >= 0 &&
            anchorRect.right <= viewportWidth
        );

        if (isInViewport) {
            widget.classList.add('is-highlighting');
            widget.style.top = `${anchorRect.top - 6}px`;     
            widget.style.left = `${anchorRect.left - 10}px`;  
            widget.style.width = `${anchorRect.width + 20}px`;
            widget.style.height = `${anchorRect.height + 12}px`;
        } else {
            widget.classList.remove('is-highlighting');
            widget.style.top = window.innerWidth <= 768 ? '16px' : '24px';
            widget.style.width = `${defaultWidth}px`;
            widget.style.height = `${defaultHeight}px`;
            
            widget.style.left = `${viewportWidth - defaultWidth - 20}px`;
        }
    }


    if (document.fonts) {
        document.fonts.ready.then(setupWidgetDimensions);
    }
    window.addEventListener('load', setupWidgetDimensions);

    window.addEventListener('scroll', updateWidgetPosition);
    

    window.addEventListener('resize', () => {
        if (window.innerWidth !== lastWindowWidth) {
            lastWindowWidth = window.innerWidth;
            setupWidgetDimensions();
        } else {
            updateWidgetPosition();
        }
    });

const makeBtn = document.getElementById('make-btn');

if (makeBtn) {
    makeBtn.addEventListener('click', () => {
        
        makeBtn.classList.add('is-toggled');

        setTimeout(() => {
            makeBtn.classList.remove('is-toggled');
        }, 200);

        const numConfetti = Math.floor(Math.random() * 8) + 8;

        for (let i = 0; i < numConfetti; i++) {
            const confetti = document.createElement('span');
            confetti.textContent = '(idea)';
            confetti.className = 'idea-confetti serif-italic';

            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;

            confetti.style.left = `${randomX}px`;
            confetti.style.top = `${randomY}px`;

            const rot = (Math.random() - 0.5) * 60; 
            confetti.style.setProperty('--rot', `${rot}deg`);

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 1200);
        }
    });
}
});