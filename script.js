
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
    const workerForm = document.getElementById("workerForm");
    const employerForm = document.getElementById("employerForm");
    const roleOptions = document.querySelector(".role-options");

    const sectionLabel = document.querySelector(
        ".get-started .container > .section-label"
    );

    const mainHeading = document.querySelector(
        ".get-started .container > h2"
    );

    const description = document.querySelector(
        ".get-started .container > p:not(#registrationMessage)"
    );

    const message = document.getElementById("registrationMessage");

    roleOptions.hidden = true;
    sectionLabel.hidden = true;
    mainHeading.hidden = true;
    description.hidden = true;

    workerForm.hidden = role !== "worker";
    employerForm.hidden = role !== "employer";

    message.textContent = "";

    document.getElementById("get-started").scrollIntoView({
        behavior: "smooth"
    });
}

// Return to role selection screen
function showRoleSelection() {
    document.getElementById("workerForm").hidden = true;
    document.getElementById("employerForm").hidden = true;

    document.querySelector(".role-options").hidden = false;

    document.querySelector(
        ".get-started .container > .section-label"
    ).hidden = false;

    document.querySelector(
        ".get-started .container > h2"
    ).hidden = false;

    document.querySelector(
        ".get-started .container > p:not(#registrationMessage)"
    ).hidden = false;

    document.getElementById("registrationMessage").textContent = "";

    document.getElementById("get-started").scrollIntoView({
        behavior: "smooth"
    });
}


// Worker registration
document.getElementById("workerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("workerName").value.trim();
    const email = document.getElementById("workerEmail").value.trim();
    const password = document.getElementById("workerPassword").value;
    const city = document.getElementById("workerCity").value.trim();
    const skills = document.getElementById("workerSkills").value.trim();

    const message = document.getElementById("registrationMessage");

    message.textContent = "Creating your worker account...";

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                role: "worker",
                full_name: name,
                city: city,
                skills: skills
            }
        }
    });

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

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                role: "employer",
                full_name: name,
                city: city,
                business_name: businessName,
                business_type: businessType
            }
        }
    });

    if (error) {
        message.textContent = error.message;
        return;
    }

    if (data.session) {
        message.textContent = "Employer account created successfully!";
    } else {
        message.textContent = "Registration received! Please check your email to confirm your account.";
    }
});



    



