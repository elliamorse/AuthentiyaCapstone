console.log("Authentiya - content.js injection test");

// Store current page's domain
const domain = window.location.origin;

// Wait for the DOM to be fully loaded before executing
document.addEventListener("DOMContentLoaded", function() {
    console.log("Authentiya - content.js is running on ", window.location.href);
    isCanvasDomain(); // Check if current domain is a Canvas LMS domain
});

/* Check if current domain is already stored as a Canvas LMS domain. */
function isCanvasDomain() {
    chrome.storage.sync.get(['canvas_domains'], result => {
        // Retrieve stored domains
        let storedDomains = result.canvas_domains || []; 

        // If domain is recognized
        if (storedDomains.includes(domain)) {
            startExtension(); // start extension
            return
        }

        // Otherwise verify via API check
        verifyCanvasAPI(domain);
    });
}

/* Start Extension */
function startExtension() {
    let banner = document.createElement("div");
    banner.textContent = "!! hacked !!";
    banner.style.cssText = "background: #2c3e50; color: white; padding: 10px; text-align: center; font-size: 16px; font-weight: bold;";
    document.body.prepend(banner);
    
    chrome.runtime.onMessage.addListener(receiveMessage);
    getCourses();
}

/* Canvas Courses */

/* Fetch enrolled courses from Canvas API and store in Chrome's sync storage. */
async function getCourses() {
    try {
        // Fetch course data from Canvas LMS API
        let courses = await getData(`${domain}/api/v1/courses?per_page=100`);
        if (courses.length > 0) {
            console.log("Authentiya - Retrieved Courses: ", courses);

            // Store courses in Chrome's sync storage
            chrome.storage.sync.set({ "courses": courses }, () => {
                console.log("Authentiya - Courses stored.");
                displayCourses(courses); // Display courses
            });
            
        } else {
            console.log("Authentiya - No courses found.");
        }
    } catch (error) {
        console.error("Authentiya - Error fetching courses: ", error);
    }
}

function displayCourses(courses) {
    // Create a container for the course list
    let container = document.createElement("div");
    container.id = "authentiya-course-container";
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        z-index: 1000;
        width: 250px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    container.innerHTML = "<h3>Enrolled Courses</h3><ul id='authentiya-course-list' style='padding:0; list-style:none;'></ul>";

    // Add courses to the list
    let courseList = container.querySelector("#authentiya-course-list");
    courses.forEach(course => {
        let listItem = document.createElement("li");
        listItem.style.cssText = "padding: 5px 0; cursor: pointer;";
        listItem.innerHTML = `<a href="${domain}/courses/${course.id}" target="_blank" style="color: #ecf0f1; text-decoration: none;">${course.name || "Unnamed Course"}</a>`;
        courseList.appendChild(listItem);
    });

    // Remove old container if it exists
    let oldContainer = document.getElementById("authentiya-course-container");
    if (oldContainer) oldContainer.remove();

    // Append the new container to the page
    document.body.appendChild(container);
}

/* Other Helper Functions */

/* Verify given URL belongs to Canvas LMS. */
function verifyCanvasAPI(url) {
    // Request a Canvas API endpoint
    fetch(`${url}/api/v1/courses?per_page=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => { // If API response is successful
        if (response.ok) {
            console.log("Authentiya - Canvas LMS detected at: ", url);
            storeCanvasDomain(url); // Store domain
            getCourses(); // Process courses
        } else {
            console.log("Authentiya - Non-Canvas url detected.");
        }
    })
    .catch(error => {
        console.log("Authentiya - Error verifying Canvas url: ", error);
    });
}

/* Store new Canvas LMS domain in Chrome storage. */
function storeCanvasDomain(newDomain) {
    chrome.storage.sync.get(['canvas_domains'], result => {
        // Retrieve stored domains
        let storedDomains = result.canvas_domains || [];

        // If domain is not already stored
        if (!storedDomains.includes(newDomain)) {
            storedDomains.push(newDomain); // Store domain
            chrome.storage.sync.set({ canvas_domains: storedDomains }, () => {
                console.log("Authentiya - Domain stored: " + domain);
            });
        }
    });
}

/* Handle incoming messages from other parts of the extension. */
function receiveMessage(request, sendResponse) {
    switch (request.message) {
        case ("getCourses"):
            getCourses();
            sendResponse(true);
            break;
        default: sendResponse(true);
    }
}

/* Fetch JSON data from given URL using GET request. */
async function getData(url) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    let data = await response.json();
    return data
}