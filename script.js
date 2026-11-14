
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

    window.scrollTo(0, 0);
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



    



