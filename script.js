
// =====================================
// KARANX - SUPABASE CONFIGURATION
// =====================================

// Apne K-setu Supabase project ki details
const SUPABASE_URL = "https://whhbmvpperlzncavkdol.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_T9db8R2vYr2w4mkAWFPODA_Nfrr68vg";

// Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// Connection setup confirmation
console.log("KaranX Supabase client initialized!");

// ==================================
// KARANX REGISTRATION FUNCTIONALITY
// ==================================


// Show selected registration screen
function showRegistration(role) {

    document.getElementById("mainScreen").hidden = true;

    document.getElementById("registrationScreen").hidden = false;

    document.getElementById("workerForm").hidden =
        role !== "worker";

    document.getElementById("employerForm").hidden =
        role !== "employer";

    document.getElementById("registrationMessage").textContent = "";

    window.scrollTo(0, 0);
}


function showRoleSelection() {

    document.getElementById("registrationScreen").hidden = true;

    document.getElementById("workerForm").hidden = true;

    document.getElementById("employerForm").hidden = true;

    document.getElementById("mainScreen").hidden = false;

    document.getElementById("loginScreen").hidden = true;

    document.getElementById("loginForm").reset();
document.getElementById("loginMessage").textContent = "";

    window.scrollTo(0, 0);
}


// Worker registration
document.getElementById("workerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    document.getElementById("registrationMessage").textContent =
    "WORKER FORM SUBMITTED!";

    const name = document.getElementById("workerName").value.trim();
    const email = document.getElementById("workerEmail").value.trim();
    const password = document.getElementById("workerPassword").value;
    const city = document.getElementById("workerCity").value.trim();
    const skills = document.getElementById("workerSkills").value.trim();
    const experience = Number(document.getElementById("workerExperience").value);
const wage = Number(document.getElementById("workerWage").value);
const availability = document.getElementById("workerAvailability").value;
const bio = document.getElementById("workerBio").value.trim();

    const message = document.getElementById("registrationMessage");

    message.textContent = "Creating your worker account...";

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
            options: {
    emailRedirectTo: "https://waklekaran.github.io/K-setu/",
            data: {
                role: "worker",
                full_name: name,
                city: city,
                skills: skills,
experience_years: experience,
expected_daily_wage: wage,
availability: availability,
bio: bio
            }
        }
    });
    console.log("Worker signup data:", data);
console.log("Worker signup error:", error);

    if (error) {
        message.textContent = error.message;
        return;
    }

    if (data.session) {
        message.textContent = "Worker account created successfully!";
    } else {
        message.textContent = "Registration received! Please check your email to confirm your account.";
    }
});


// Employer registration
document.getElementById("employerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("employerName").value.trim();
    const email = document.getElementById("employerEmail").value.trim();
    const password = document.getElementById("employerPassword").value;
    const city = document.getElementById("employerCity").value.trim();
    const businessName = document.getElementById("businessName").value.trim();
    const businessType = document.getElementById("businessType").value.trim();

    const message = document.getElementById("registrationMessage");

    message.textContent = "Creating your employer account...";

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: "https://waklekaran.github.io/K-setu/",
                data: {
                    role: "employer",
                    full_name: name,
                    city: city,
                    business_name: businessName,
                    business_type: businessType
                }
            }
        });

        console.log("Employer signup data:", data);
        console.log("Employer signup error:", error);

        if (error) {
            message.textContent = error.message;
            return;
        }

        if (data.session) {
            message.textContent = "Employer account created successfully!";
        } else {
            message.textContent = "Registration received! Please check your email to confirm your account.";
        }

    } catch (err) {
        message.textContent = "Signup failed: " + err.message;
    }
});


    
console.log("Worker Form:", document.getElementById("workerForm"));
console.log("Employer Form:", document.getElementById("employerForm"));

// =====================================
// KARANX - LOGIN SYSTEM
// =====================================

function showLogin() {
    alert("SHOW LOGIN FUNCTION CALLED!");

    const main = document.getElementById("mainScreen");
    const registration = document.getElementById("registrationScreen");
    const login = document.getElementById("loginScreen");

    alert(
        "Main: " + !!main +
        "\nRegistration: " + !!registration +
        "\nLogin: " + !!login
    );

    main.hidden = true;
    registration.hidden = true;
    login.hidden = false;
}


document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    message.textContent = "Logging in...";

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            message.textContent = "Login failed: " + error.message;
            return;
        }

        message.textContent = "Login successful! Welcome to KaranX.";

        const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("role, full_name")
            .eq("id", data.user.id)
            .single();

        if (profileError) {
            message.textContent += " Profile details could not be loaded.";
            return;
        }

        
message.textContent =
    "Login successful! Welcome " +
    profile.full_name +
    ". You are logged in as " +
    profile.role + ".";

// Open Dashboard
document.getElementById("loginScreen").hidden = true;
document.getElementById("mainScreen").hidden = true;
document.getElementById("registrationScreen").hidden = true;

document.getElementById("dashboardScreen").hidden = false;

// Show correct dashboard according to role
document.getElementById("workerDashboard").hidden =
    profile.role !== "worker";

document.getElementById("employerDashboard").hidden =
    profile.role !== "employer";

document.getElementById("dashboardWelcome").textContent =
    "Welcome, " + profile.full_name + "!";
    
window.scrollTo(0, 0);


    } catch (err) {
        message.textContent = "Login failed: " + err.message;
    }
});
// =====================================
// KARANX - LOGOUT SYSTEM
// =====================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {

        logoutButton.disabled = true;

        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                throw error;
            }

            document.getElementById("dashboardScreen").hidden = true;
            document.getElementById("workerDashboard").hidden = true;
            document.getElementById("employerDashboard").hidden = true;

            document.getElementById("loginScreen").hidden = true;
            document.getElementById("registrationScreen").hidden = true;
            document.getElementById("mainScreen").hidden = false;

            window.scrollTo(0, 0);

        } catch (err) {
            alert("Logout failed: " + err.message);
        } finally {
            logoutButton.disabled = false;
        }
    });
}

console.log("Supabase Client:", supabaseClient);



    



