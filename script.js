
/* =====================================
   VAULT PASSWORD MANAGER
===================================== */


/* =====================================
   1. INITIAL PASSWORD DATA
===================================== */

const defaultPasswords = [

    {
        id: 1,
        site: "Google",
        url: "google.com",
        username: "user@example.com",
        password: "GoogleDemo123!",
        favourite: true
    },

    {
        id: 2,
        site: "Microsoft 365",
        url: "microsoft.com",
        username: "admin@example.com",
        password: "MicrosoftDemo456!",
        favourite: true
    },

    {
        id: 3,
        site: "Amazon",
        url: "amazon.co.uk",
        username: "customer@example.com",
        password: "AmazonDemo789!",
        favourite: false
    }

];


/* =====================================
   2. LOAD SAVED PASSWORDS
===================================== */

let passwords = JSON.parse(
    localStorage.getItem("vaultPasswords")
) || defaultPasswords;

let showFavourites = false;


/* =====================================
   3. GET HTML ELEMENTS
===================================== */

const passwordGrid =
    document.getElementById("passwordGrid");

const passwordForm =
    document.getElementById("passwordForm");

const formSection =
    document.getElementById("passwordFormSection");

const addButton =
    document.getElementById("addPasswordBtn");

const cancelButton =
    document.getElementById("cancelForm");

const searchInput =
    document.getElementById("passwordSearch");

const siteName =
    document.getElementById("siteName");

const siteUrl =
    document.getElementById("siteUrl");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const passwordId =
    document.getElementById("passwordId");


/* =====================================
   4. SAVE DATA TO LOCAL STORAGE
===================================== */

function savePasswords() {

    localStorage.setItem(
        "vaultPasswords",
        JSON.stringify(passwords)
    );

}


/* =====================================
   5. DISPLAY PASSWORDS
===================================== */

function displayPasswords() {

    passwordGrid.replaceChildren();

    const searchTerm =
        searchInput.value.toLowerCase();

    const filteredPasswords = passwords.filter(item => {

        const matchesSearch =
            item.site.toLowerCase().includes(searchTerm) ||
            item.username.toLowerCase().includes(searchTerm);

        const matchesFavourite =
            !showFavourites || item.favourite;

        return matchesSearch && matchesFavourite;

    });


    filteredPasswords.forEach(item => {

        // CREATE PASSWORD CARD

        const card = document.createElement("article");

        card.className = "password-card";


        // WEBSITE NAME

        const heading = document.createElement("h4");

        heading.textContent = "🔐 " + item.site;


        // WEBSITE URL

        const website = document.createElement("p");

        website.textContent = "Website: " + item.url;


        // USERNAME

        const user = document.createElement("p");

        user.textContent = "Username: " + item.username;


        // PASSWORD

        const pass = document.createElement("p");

        pass.textContent = "Password: ••••••••••••";


        // ACTION BUTTON CONTAINER

        const actions = document.createElement("div");

        actions.className = "card-actions";


        // VIEW / HIDE PASSWORD

        const viewButton = document.createElement("button");

        viewButton.className = "secondary-button";

        viewButton.textContent = "View";

        let revealed = false;

        viewButton.addEventListener("click", () => {

            revealed = !revealed;

            pass.textContent = revealed
                ? "Password: " + item.password
                : "Password: ••••••••••••";

            viewButton.textContent =
                revealed ? "Hide" : "View";

        });


        // EDIT PASSWORD

        const editButton = document.createElement("button");

        editButton.className = "secondary-button";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {

            editPassword(item.id);

        });


        // DELETE PASSWORD

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {

            deletePassword(item.id);

        });


        // FAVOURITE PASSWORD

        const favouriteButton = document.createElement("button");

        favouriteButton.className = "favourite-button";

        favouriteButton.textContent =
            item.favourite ? "★ Favourite" : "☆ Favourite";

        favouriteButton.addEventListener("click", () => {

            item.favourite = !item.favourite;

            savePasswords();

            displayPasswords();

            updateDashboard();

        });


        // ADD BUTTONS TO CARD

        actions.append(
            viewButton,
            editButton,
            deleteButton,
            favouriteButton
        );

        card.append(
            heading,
            website,
            user,
            pass,
            actions
        );

        passwordGrid.appendChild(card);

    });


    // DISPLAY MESSAGE IF NO RESULTS

    if (filteredPasswords.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No passwords found.";

        passwordGrid.appendChild(message);

    }

}


/* =====================================
   6. ADD PASSWORD
===================================== */

function addPassword() {

    passwordForm.reset();

    passwordId.value = "";

    document.getElementById("formTitle").textContent =
        "Add New Password";

    formSection.hidden = false;

    formSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================
   7. EDIT PASSWORD
===================================== */

function editPassword(id) {

    const item = passwords.find(p => p.id === id);

    if (!item) return;

    passwordId.value = item.id;

    siteName.value = item.site;

    siteUrl.value = item.url;

    username.value = item.username;

    password.value = item.password;

    document.getElementById("formTitle").textContent =
        "Edit Password";

    formSection.hidden = false;

    formSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================
   8. SAVE NEW OR EDITED PASSWORD
===================================== */

passwordForm.addEventListener("submit", event => {

    event.preventDefault();

    const existingId = Number(passwordId.value);

    if (existingId) {

        // UPDATE EXISTING PASSWORD

        const item = passwords.find(
            p => p.id === existingId
        );

        if (!item) return;

        item.site = siteName.value.trim();

        item.url = siteUrl.value.trim();

        item.username = username.value.trim();

        item.password = password.value;

    } else {

        // CREATE NEW PASSWORD

        const newPassword = {

            id: Date.now(),

            site: siteName.value.trim(),

            url: siteUrl.value.trim(),

            username: username.value.trim(),

            password: password.value,

            favourite: false

        };

        passwords.push(newPassword);

    }


    savePasswords();

    displayPasswords();

    updateDashboard();

    passwordForm.reset();

    formSection.hidden = true;

    alert("Password saved successfully!");

});


/* =====================================
   9. DELETE PASSWORD
===================================== */

function deletePassword(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this password?"
    );

    if (!confirmation) return;

    passwords = passwords.filter(
        item => item.id !== id
    );

    savePasswords();

    displayPasswords();

    updateDashboard();

}


/* =====================================
   10. CANCEL FORM
===================================== */

cancelButton.addEventListener("click", () => {

    passwordForm.reset();

    formSection.hidden = true;

});


/* =====================================
   11. SEARCH PASSWORDS
===================================== */

searchInput.addEventListener("input", () => {

    displayPasswords();

});


/* =====================================
   12. FAVOURITE FILTER AND NAVIGATION
===================================== */

document.querySelectorAll(".sidebar nav a")
    .forEach(link => {

        link.addEventListener("click", () => {

            document.querySelectorAll(".sidebar nav a")
                .forEach(item => {

                    item.classList.remove("active");

                });

            link.classList.add("active");

            showFavourites =
                link.getAttribute("href") === "#favourites";

            displayPasswords();

        });

    });


/* =====================================
   13. PASSWORD GENERATOR
===================================== */

document.getElementById("generatePassword")
    .addEventListener("click", () => {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789!@#$%^&*()_+-=";

        const randomValues = new Uint32Array(20);

        crypto.getRandomValues(randomValues);

        let generatedPassword = "";

        randomValues.forEach(value => {

            generatedPassword +=
                characters[value % characters.length];

        });

        password.value = generatedPassword;

        alert("New password generated!");

    });


/* =====================================
   14. UPDATE DASHBOARD STATISTICS
===================================== */

function updateDashboard() {

    document.getElementById("totalPasswords")
        .textContent = passwords.length;

    document.getElementById("totalFavourites")
        .textContent = passwords.filter(
            item => item.favourite
        ).length;

    document.getElementById("securityAlerts")
        .textContent = "1";

}


/* =====================================
   15. OPEN ADD PASSWORD FORM
===================================== */

addButton.addEventListener("click", addPassword);


/* =====================================
   16. INITIALISE VAULT
===================================== */

displayPasswords();

updateDashboard();

