// Function to save passwords to localStorage
function savePasswords(passwords) {
    localStorage.setItem('passwords', JSON.stringify(passwords));
}

// Function to get passwords from localStorage
function getPasswords() {
    return JSON.parse(localStorage.getItem('passwords')) || [];
}

// Function to render passwords
function renderPasswords() {
    const passwordList = document.getElementById('password-list');
    const passwords = getPasswords();
    passwordList.innerHTML = '';

    passwords.forEach((item, index) => {
        const listItem = document.createElement('li');

        // Create a span for website and password
        const passwordSpan = document.createElement('span');
        passwordSpan.innerHTML = `
        <strong>${item.website}</strong>: 
        <span class="password" id="password-${index}">${'*'.repeat(item.password.length)}</span>
        <i class="fas fa-eye show-password" onclick="togglePassword(${index})" title="Show/HidePassword"></i> 
        `;
        
        // Create a div for action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');
        actionsDiv.innerHTML = `
        <i class="fas fa-copy" onclick="copyPassword(${index})" title="Copy"></i>
        <i class="fas fa-edit" onclick="promptEditPassword(${index})" title="Edit"></i>
        <i class="fas fa-trash-alt" onclick="confirmDelete(${index})" title="Delete"></i>
        `;
        
        // Append elements to list item
        listItem.appendChild(passwordSpan);
        listItem.appendChild(actionsDiv);
        passwordList.appendChild(listItem);
    });
}
   

// Function to add a new password
document.getElementById('add-btn').addEventListener('click', () => {
    const website = document.getElementById('website').value;
    const password = document.getElementById('password').value;

    if (website && password) {
        const passwords = getPasswords();
        passwords.push({ website, password });
        savePasswords(passwords);
        renderPasswords();
        document.getElementById('website').value = '';
        document.getElementById('password').value = '';
    } else {
        showPopup('Please fill in both fields.');
    }
});

// Function to copy a password
function copyPassword(index) {
    const passwords = getPasswords();
    navigator.clipboard.writeText(passwords[index].password);
    showPopup('Password copied to clipboard.');
}

// Function to show custom popup
function showPopup(message, hasCancel = false, isEditing = false, index = null) {
    const popup = document.getElementById('custom-popup');
    const popupMessage = document.getElementById('popup-message');
    const popupInputContainer = document.getElementById('popup-input-container');
    const popupInput = document.getElementById('popup-input');

    popupMessage.textContent = message;
    popupInputContainer.classList.toggle('hidden', !isEditing);
    document.getElementById('popup-cancel').classList.toggle('hidden', !hasCancel);

    if (isEditing && index !== null) {
        popupInput.value = getPasswords()[index].password;
    }

    popup.classList.remove('hidden');

    return new Promise((resolve) => {
        document.getElementById('popup-ok').onclick = () => {
            if (isEditing && index !== null) {
                const newPassword = popupInput.value;
                if (newPassword) {
                    const passwords = getPasswords();
                    passwords[index].password = newPassword;
                    savePasswords(passwords);
                    renderPasswords();
                } else {
                    showPopup('Password cannot be empty.');
                    return;
                }
            }
            popup.classList.add('hidden');
            resolve(true);
        };
        if (hasCancel) {
            document.getElementById('popup-cancel').onclick = () => {
                popup.classList.add('hidden');
                resolve(false);
            };
        }
    });
}

// Function to confirm deletion with custom popup
async function confirmDelete(index) {
    const confirmed = await showPopup('Are you sure you want to delete this password?', true);
    if (confirmed) {
        deletePassword(index);
    }
}

// Function to prompt for editing a password
async function promptEditPassword(index) {
    await showPopup('Enter new password:', false, true, index);
}

// Function to delete a password
function deletePassword(index) {
    const passwords = getPasswords();
    passwords.splice(index, 1);
    savePasswords(passwords);
    renderPasswords();
}

// Function to toggle the visibility of the password
function togglePassword(index) {
    const passwordSpan = document.getElementById(`password-${index}`);
    const passwords = getPasswords();

    if (passwordSpan.textContent === '*'.repeat(passwords[index].password.length)) {
        passwordSpan.textContent = passwords[index].password;
    } else {
        passwordSpan.textContent = '*'.repeat(passwords[index].password.length);
    }
}







// Function to populate the website dropdown
function populateWebsiteDropdown() {
    const dropdown = document.getElementById('website-dropdown');
    const passwords = getPasswords();

    // Clear existing options
    dropdown.innerHTML = '<option value="">Select a website</option>';

    // Add options for each saved website
    passwords.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as the value
        option.textContent = item.website;
        dropdown.appendChild(option);
    });
}

// Function to auto-fill the form when a website is selected
document.getElementById('website-dropdown').addEventListener('change', (event) => {
    const index = event.target.value;
    if (index !== '') {
        const passwords = getPasswords();
        const selectedPassword = passwords[index];

        // Auto-fill the form fields
        document.getElementById('website').value = selectedPassword.website;
        document.getElementById('password').value = selectedPassword.password;
    } else {
        // Clear the form fields if "Select a website" is chosen
        document.getElementById('website').value = '';
        document.getElementById('password').value = '';
    }
});

// Call populateWebsiteDropdown whenever passwords are updated
function renderPasswords() {
    const passwordList = document.getElementById('password-list');
    const passwords = getPasswords();
    passwordList.innerHTML = '';

    passwords.forEach((item, index) => {
        const listItem = document.createElement('li');

        // Create a span for website and password
        const passwordSpan = document.createElement('span');
        passwordSpan.innerHTML = `
        <strong>${item.website}</strong>: 
        <span class="password" id="password-${index}">${'*'.repeat(item.password.length)}</span>
        <i class="fas fa-eye show-password" onclick="togglePassword(${index})" title="Show/HidePassword"></i> 
        `;
        
        // Create a div for action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');
        actionsDiv.innerHTML = `
        <i class="fas fa-copy" onclick="copyPassword(${index})" title="Copy"></i>
        <i class="fas fa-edit" onclick="promptEditPassword(${index})" title="Edit"></i>
        <i class="fas fa-trash-alt" onclick="confirmDelete(${index})" title="Delete"></i>
        `;
        
        // Append elements to list item
        listItem.appendChild(passwordSpan);
        listItem.appendChild(actionsDiv);
        passwordList.appendChild(listItem);
    });

    // Populate the website dropdown
    populateWebsiteDropdown();
}

// Initial render of passwords
renderPasswords();