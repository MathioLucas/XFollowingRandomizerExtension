document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('randomize-toggle');
    
    if (toggle) {
        chrome.storage.sync.get(['randomizeEnabled'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error loading storage:', chrome.runtime.lastError);
                return;
            }
            toggle.checked = result.randomizeEnabled || false;
        });

        toggle.addEventListener('change', () => {
            chrome.storage.sync.set({ randomizeEnabled: toggle.checked }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving state:', chrome.runtime.lastError);
                }
            });
        });
    } else {
        console.warn('Randomize toggle not found in the DOM.');
    }
});
