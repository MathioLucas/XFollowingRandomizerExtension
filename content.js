// content.js

// Detailed Page State Logging
function logPageState() {
    console.log('Detailed Page State Logging:');
    console.log('Full URL:', window.location.href);
    console.log('Document ready state:', document.readyState);

    const potentialTweetSelectors = [
        '*[data-testid]',
        'div[role="article"]',
        'article[data-testid="tweet"]',
        'div[data-testid="tweet"]',
        '*[aria-label="Timeline: Your Home Timeline"]',
        '*[aria-label="Timeline: Following"]'
    ];

    potentialTweetSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.log(`Elements found for selector "${selector}":`, elements.length);
        }
    });
}

let observer;
let isRandomizing = false;
let throttleTimeout = null;

// Function: Randomize Tweets
function randomizeTweets() {
    if (isRandomizing) return; // Prevent overlapping executions
    isRandomizing = true;

    console.log('Starting non-disruptive randomization process...');

    const tweetSelectors = [
        'article[data-testid="tweet"]',
        'div[data-testid="tweet"]',
        '[aria-label^="Timeline: "] > div > div > div'
    ];

    let tweets = [];
    let usedSelector = '';

    for (const selector of tweetSelectors) {
        tweets = document.querySelectorAll(selector);
        if (tweets.length > 0) {
            usedSelector = selector;
            console.log(`Found ${tweets.length} tweets using selector: ${selector}`);
            break;
        }
    }

    if (tweets.length === 0) {
        console.error('NO TWEETS FOUND! Diagnostics:');
        logPageState();
        isRandomizing = false;
        return;
    }

    const tweetsArray = Array.from(tweets);

    // Fisher-Yates Shuffle
    for (let i = tweetsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tweetsArray[i], tweetsArray[j]] = [tweetsArray[j], tweetsArray[i]];
    }

    tweetsArray.forEach(tweet => {
        try {
            tweet.parentNode.appendChild(tweet); // Re-append without cloning
        } catch (error) {
            console.warn('Error reordering tweet:', error);
        }
    });

    console.log(`Successfully randomized ${tweetsArray.length} tweets using selector: ${usedSelector}`);
    isRandomizing = false;
}

// Function: Observe Tweets
function observeTweets() {
    console.log('Initializing advanced tweet observation...');

    const containerSelectors = [
        '*[aria-label^="Timeline: "]',
        'div[data-testid="primaryColumn"]',
        'div[role="main"]',
        'main'
    ];

    let tweetContainer = null;

    for (const selector of containerSelectors) {
        tweetContainer = document.querySelector(selector);
        if (tweetContainer) break;
    }

    if (!tweetContainer) {
        console.error('Tweet container not found. Diagnostics:');
        logPageState();
        return;
    }

    observer = new MutationObserver((mutations) => {
        if (throttleTimeout) return;

        throttleTimeout = setTimeout(() => {
            const newTweetsDetected = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === Node.ELEMENT_NODE && node.matches('article[data-testid="tweet"], div[data-testid="tweet"]')
                )
            );

            if (newTweetsDetected) {
                console.log('New tweets detected, randomizing...');
                observer.disconnect();
                randomizeTweets();
                observer.observe(tweetContainer, { childList: true, subtree: true });
            }

            throttleTimeout = null;
        }, 5000); // Increased throttle to 5 seconds
    });

    observer.observe(tweetContainer, { childList: true, subtree: true });
    console.log('Tweet observer initialized.');
}

// Function: Initialize Randomization
function initRandomization() {
    console.log('Initializing X.com Tweet Randomizer...');

    document.addEventListener('DOMContentLoaded', () => {
        if (isValidTweetPage()) {
            randomizeTweets(); // Initial shuffle
            observeTweets(); // Observe for new tweets
        }
    });
}

// Function: Validate Tweet Page
function isValidTweetPage() {
    const isValid = window.location.href.includes('x.com') && 
                    (window.location.pathname === '/home' || 
                     window.location.pathname.includes('/following'));

    console.log('Is valid page:', isValid);
    return isValid;
}

// CSP Violation Logger
document.addEventListener('securitypolicyviolation', (event) => {
    console.warn('CSP Violation Detected:', event);
});

window.addEventListener('error', (event) => {
    if (event.message.includes('CSP')) {
        console.warn('Potential CSP Error:', event);
    }
});

// Initialize on load
if (document.readyState === 'complete') {
    initRandomization();
} else {
    window.addEventListener('load', initRandomization);
}

console.log('X.com Randomizer script loaded.');
