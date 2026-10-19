const volunteerRoles = [
    { id: "dog-walker", title: "Dog Walker", hours: "2-4 hrs/week", description: "Provide exercise and outdoor social time for rescue dogs." },
    { id: "cat-foster", title: "Cat Foster Parent", hours: "Flexible", description: "Provide temporary care for cats awaiting adoption." },
    { id: "event-assistant", title: "Event Assistant", hours: "Weekends", description: "Help manage adoption events, setup tables, and greet visitors." },
    { id: "transport", title: "Pet Transport Driver", hours: "On-call", description: "Transport rescue animals to vet appointments and partner shelters." }
];

const clientConfig = {
    organizationName: "Twin Cities Animal Rescue",
    storageKeyRoles: "tcar_saved_roles", // handle storage of volunteer roles
    storageKeyUser: "tcar_user_info" // handle storage of user contact info
}; // "tcar_" prefix stands for Twin Cities Animal Rescue

let savedRolesList = []; // tracks user selections at runtime

let userPreferences = { name: "", email: "" }; // stores user contact preferences

function initRoleTracker() {
    const roleButtons = document.querySelectorAll(".role-select-btn");
    const roleDisplay = document.getElementById("role-details-display");

    // guard check in case the elements aren't on the current page
    if (!roleButtons.length || !roleDisplay) return;
    roleButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            // handle the data attribute reading from the clicked button
            const selectedId = event.target.getAttribute("data-role-id");

            // search volunteerRoles array for matching ID
            const roleObj = volunteerRoles.find(role => role.id === selectedId);

            // DOM updates dynamically if matching role is found
            if (roleObj) {
                displayRoleDetails(roleObj, roleDisplay);
            }
        });
    });
}

function displayRoleDetails(role, container) {
    container.innerHTML = 
    `
    <h3>${role.title}</h3>
    <p><strong>Time Commitment:</strong> ${role.hours}</p>
    <p>${role.description}</p>
    <button type="button" class="btn" id="save-role-btn" onclick="saveRolePreference('${role.id}')">Save Role to My List</button>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    initRoleTracker();
    loadSavedRoles();
    setupFormValidation();
});

function saveRolePreference(roleId) {
    // prevent duplicate entries in list
    if (!savedRolesList.includes(roleId)) {
        savedRolesList.push(roleId);

        localStorage.setItem(clientConfig.storageKeyRoles, JSON.stringify(savedRolesList));
        renderSavedRoles();
    }
}

function removeRolePreference(roleId) {
    savedRolesList = savedRolesList.filter(id => id !== roleId); // filter out the matching role ID to remove it from the array
    localStorage.setItem(clientConfig.storageKeyRoles, JSON.stringify(savedRolesList));
    renderSavedRoles();
}

// load previously saved roles from localStorage upon opening the page
function loadSavedRoles() {
    const storedRoles = localStorage.getItem(clientConfig.storageKeyRoles);
    if (storedRoles) {
        savedRolesList = JSON.parse(storedRoles);
        renderSavedRoles();
    }
}

// render the list of saved roles into the summary container
function renderSavedRoles() {
    const summaryContainer = document.getElementById("saved-roles-summary");
    if (!summaryContainer) return;

    if (savedRolesList.length === 0) {
        summaryContainer.innerHTML = "<p><em>No roles saved to your list yet.</em></p>";
        return;
    }

    let html = "<h4>Your saved volunteer roles:</h4><ul style='list-style: none; padding-left: 0;'>";
    savedRolesList.forEach(id => {
        const role = volunteerRoles.find(item => item.id === id);
        if (role) {
            html += `<li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; width: 100%; flex-wrap: wrap; gap: 10px;">
            <span style="flex: 1; min-width: 180px;">&bull; ${role.title} (${role.hours})</span>
            <button type="button" class="btn" onclick="removeRolePreference('${role.id}')" style="padding: 6px 14px; white-space: nowrap; margin-top: -2px;">Remove role from list</button>
            </li>`;
        }
    });
    html += "</ul>";

    summaryContainer.innerHTML = html;
}

function setupFormValidation() {
    const form = document.getElementById("interest-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {
        let isValid = true;

        // reset error message for all fields
        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");
        if (nameError) nameError.textContent = "";
        if (emailError) emailError.textContent = "";

        // full name required field check
        const fullNameInput = document.getElementById("full-name");
        const fullNameValue = fullNameInput.value.trim();
        const nameParts = fullNameValue.split(/\s+/); // split name by spaces
        if (fullNameInput.value.trim() === "") {
            if (nameError) nameError.textContent = "Please enter your full name.";
            isValid = false;
        } else if (nameParts.length < 2) {
            if (nameError) nameError.textContent = "Please enter both your first and last name.";
            isValid = false;
        }

        // email address format validation
        const emailInput = document.getElementById("email");
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex for email address validation

        if (emailValue === "") {
            if (emailError) emailError.textContent = "Email address is required.";
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            if (emailError) emailError.textContent = "Please enter a valid email address (e.g., name@example.com).";
            isValid = false;
        }

        // if validation checks fail, this prevents submission
        if (!isValid) {
            event.preventDefault();
        } else {
            event.preventDefault();
            alert("Thank you! Your interest form has been successfully submitted.");
            form.reset();
            
            // clear name and email error text just in case
            if (nameError) nameError.textContent = "";
            if (emailError) emailError.textContent = "";
        }
    });
}
