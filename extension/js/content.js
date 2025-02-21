// Content Script
// This script interacts with the DOM of the pages where the extension is active.

const domain = window.location.origin;

isCanvasDomain();

function isCanvasDomain() {
    chrome.storage.sync.get(['canvas_domains'], result => {
        let storedDomains = result.canvas_domains || [];

        if (storedDomains.includes(domain)) {
            startExtension();
            return
        }

        verifyCanvasAPI(domain);
    });
}

function startExtension() {
    /* script code goes here */

    // Example script ...
    let banner = document.createElement("div");
    banner.textContent = "!! hacked !!";
    banner.style.cssText = "background: #2c3e50; color: white; padding: 10px; text-align: center; font-size: 16px; font-weight: bold;";

    document.body.prepend(banner);

    console.log("Authentiya - Running");
}

function verifyCanvasAPI(url) {
    fetch(`${url}/api/v1/courses?per_page=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Authentiya - Canvas LMS detected at: ", url);
            storeCanvasDomain(url);
        } else {
            console.log("Authentiya - Non-Canvas url detected.");
        }
    })
    .catch(error => {
        console.log("Authentiya - Error verifying Canvas url: ", error);
    });
}

function storeCanvasDomain(newDomain) {
    chrome.storage.sync.get(['canvas_domains'], result => {
        let storedDomains = result.canvas_domains || [];

        if (!storedDomains.includes(newDomain)) {
            storedDomains.push(newDomain);
            chrome.storage.sync.set({ canvas_domains: storedDomains }, () => {
                console.log("Authentiya - Domain stored: " + domain);
            });
        }
    });
}
