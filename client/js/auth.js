const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const getStartedBtn = document.getElementById("getStartedBtn");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const closeLogin = document.getElementById("closeLogin");
const closeRegister = document.getElementById("closeRegister");

const switchToRegister =
    document.getElementById("switchToRegister");

const switchToLogin =
    document.getElementById("switchToLogin");


// ==================== OPEN LOGIN ====================

function openLogin() {
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
}


// ==================== OPEN REGISTER ====================

function openRegister() {
    registerModal.style.display = "flex";
    loginModal.style.display = "none";
}


// ==================== CLOSE MODALS ====================

function closeLoginModal() {
    loginModal.style.display = "none";
}

function closeRegisterModal() {
    registerModal.style.display = "none";
}


// ==================== BUTTON EVENTS ====================

loginBtn.addEventListener("click", openLogin);

registerBtn.addEventListener("click", openRegister);

getStartedBtn.addEventListener("click", openLogin);

closeLogin.addEventListener("click", closeLoginModal);

closeRegister.addEventListener("click", closeRegisterModal);


// ==================== SWITCH MODALS ====================

switchToRegister.addEventListener("click", openRegister);

switchToLogin.addEventListener("click", openLogin);


// ==================== CLOSE WHEN CLICKING OUTSIDE ====================

window.addEventListener("click", (event) => {

    if (event.target === loginModal) {
        closeLoginModal();
    }

    if (event.target === registerModal) {
        closeRegisterModal();
    }

});

// ==================== REGISTER ====================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("registerConfirmPassword").value;


    try {

        const data = await apiRequest("/auth/register", {

            method: "POST",

            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword
            })

        });


        alert(data.message);

        registerForm.reset();

        closeRegisterModal();

        openLogin();

    } catch (error) {

        alert(error.message);

    }

}); 
// ==================== LOGIN ====================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    try {

        const data = await apiRequest("/auth/login", {

            method: "POST",

            body: JSON.stringify({
                email,
                password
            })

        });


        const user = data.data.user;

        // Save logged-in user's ID
        localStorage.setItem("userId", user.id);

        // Save user's name
        localStorage.setItem("userName", user.name);

        // Save user's email
        localStorage.setItem("userEmail", user.email);


        alert(data.message);

        loginForm.reset();

        closeLoginModal();

        // Open dashboard
        window.location.href = "pages/dashboard.html";


    } catch (error) {

        alert(error.message);

    }

});