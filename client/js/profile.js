const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "../index.html";
}

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileInitial = document.getElementById("profileInitial");

const profileNameInput =
    document.getElementById("profileNameInput");

const profileEmailInput =
    document.getElementById("profileEmailInput");

const profileForm =
    document.getElementById("profileForm");


// ==================== LOAD PROFILE ====================

async function loadProfile() {

    try {

        const data = await apiRequest(
            `/auth/me?userId=${userId}`
        );

        const user = data.data.user;

        // Display profile information
        profileName.textContent = user.name;
        profileEmail.textContent = user.email;

        // Fill form
        profileNameInput.value = user.name;
        profileEmailInput.value = user.email;

        // Set first letter
        profileInitial.textContent =
            user.name.charAt(0).toUpperCase();

        // Update localStorage
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

    } catch (error) {

        console.error("Profile Error:", error);

        alert(error.message);
    }
}


// ==================== UPDATE PROFILE ====================

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            profileNameInput.value.trim();

        const email =
            profileEmailInput.value.trim();

        if (!name) {

            alert("Name is required.");

            return;
        }

        if (!email) {

            alert("Email is required.");

            return;
        }

        try {

            const data = await apiRequest(
                "/auth/profile",
                {
                    method: "PUT",

                    body: JSON.stringify({
                        userId: userId,
                        name: name,
                        email: email
                    })
                }
            );

            const user = data.data.user;

            // Update profile display
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;

            // Update initial
            profileInitial.textContent =
                user.name.charAt(0).toUpperCase();

            // Update localStorage
            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );

            alert(data.message);

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            alert(error.message);
        }
    }
);


// ==================== LOGOUT ====================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");

            window.location.href =
                "../index.html";
        }
    );
}


// ==================== START ====================

loadProfile();