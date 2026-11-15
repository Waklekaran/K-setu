
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
            // Clear login form
document.getElementById("loginEmail").value = "";
document.getElementById("loginPassword").value = "";
document.getElementById("loginMessage").textContent = "";

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

// =====================================
// KARANX - AUTO DASHBOARD AFTER CONFIRMATION
// =====================================

async function openDashboardFromExistingSession() {

    try {
        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error) throw error;

        const session = data.session;

        // No active session: keep Home screen
        if (!session) return;

        // Load user's role and name
        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("role, full_name")
                .eq("id", session.user.id)
                .single();

        if (profileError) throw profileError;

        // Open Dashboard
        document.getElementById("mainScreen").hidden = true;
        document.getElementById("registrationScreen").hidden = true;
        document.getElementById("loginScreen").hidden = true;

        document.getElementById("dashboardScreen").hidden = false;

        document.getElementById("workerDashboard").hidden =
            profile.role !== "worker";

        document.getElementById("employerDashboard").hidden =
            profile.role !== "employer";

        document.getElementById("dashboardWelcome").textContent =
            "Welcome, " + profile.full_name + "!";

        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Automatic dashboard error:", err.message);
    }
}

openDashboardFromExistingSession();

// =====================================
// KARANX - WORKER PROFILE
// =====================================

const viewProfileButton = document.getElementById("viewProfileButton");

if (viewProfileButton) {
    viewProfileButton.addEventListener("click", async function () {
        const details = document.getElementById("workerProfileDetails");
        const section = document.getElementById("workerProfileSection");

        details.textContent = "Loading profile...";
        section.hidden = false;

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) throw new Error("Please login first.");

            const userId = userData.user.id;

            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .select("full_name, city")
                    .eq("id", userId)
                    .single();

            if (profileError) throw profileError;

            const { data: worker, error: workerError } =
                await supabaseClient
                    .from("worker_profiles")
                    .select("skills, experience_years, expected_daily_wage, availability, bio")
                    .eq("user_id", userId)
                    .single();

            if (workerError) throw workerError;

            details.innerHTML = `
                <p><b>Name:</b> ${profile.full_name || "Not added"}</p>
                <p><b>City:</b> ${profile.city || "Not added"}</p>
                <p><b>Skills:</b> ${(worker.skills || []).join(", ") || "Not added"}</p>
                <p><b>Experience:</b> ${worker.experience_years ?? 0} years</p>
                <p><b>Expected Daily Wage:</b> ₹${worker.expected_daily_wage ?? "Not added"}</p>
                <p><b>Availability:</b> ${worker.availability || "Not added"}</p>
                <p><b>About:</b> ${worker.bio || "Not added"}</p>
            `;
        } catch (error) {
            details.textContent = "Profile loading failed: " + error.message;
        }
    });
}

// =====================================
// KARANX - WORKER PROFILE BUTTONS
// =====================================

const editProfileButton = document.getElementById("editProfileButton");
const addSkillsButton = document.getElementById("addSkillsButton");

if (editProfileButton) {
    editProfileButton.addEventListener("click", async function () {
        document.getElementById("workerProfileSection").hidden = true;
        document.getElementById("addWorkerSkillsSection").hidden = true;

        const section = document.getElementById("editWorkerProfileSection");
        section.hidden = false;

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) throw new Error("Please login first.");

            const userId = userData.user.id;

            const { data: profile, error: profileError } =
                await supabaseClient.from("profiles")
                .select("full_name, city")
                .eq("id", userId).single();

            if (profileError) throw profileError;

            const { data: worker, error: workerError } =
                await supabaseClient.from("worker_profiles")
                .select("experience_years, expected_daily_wage, availability, bio")
                .eq("user_id", userId).single();

            if (workerError) throw workerError;

            document.getElementById("editWorkerName").value = profile.full_name || "";
            document.getElementById("editWorkerCity").value = profile.city || "";
            document.getElementById("editWorkerExperience").value = worker.experience_years ?? 0;
            document.getElementById("editWorkerWage").value = worker.expected_daily_wage ?? "";
            document.getElementById("editWorkerAvailability").value = worker.availability || "";
            document.getElementById("editWorkerBio").value = worker.bio || "";

        } catch (error) {
            alert("Profile loading failed: " + error.message);
        }
    });
}

if (addSkillsButton) {
    addSkillsButton.addEventListener("click", async function () {
        document.getElementById("workerProfileSection").hidden = true;
        document.getElementById("editWorkerProfileSection").hidden = true;

        const section = document.getElementById("addWorkerSkillsSection");
        section.hidden = false;

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) throw new Error("Please login first.");

            const { data: worker, error: workerError } =
                await supabaseClient.from("worker_profiles")
                .select("skills")
                .eq("user_id", userData.user.id).single();

            if (workerError) throw workerError;

            document.getElementById("workerSkillsInput").value =
                (worker.skills || []).join(", ");

        } catch (error) {
            alert("Skills loading failed: " + error.message);
        }
    });
}

// =====================================
// KARANX - EMPLOYER DASHBOARD BUTTONS
// =====================================

const viewBusinessButton =
    document.getElementById("viewBusinessButton");

const editBusinessButton =
    document.getElementById("editBusinessButton");

const postJobButton =
    document.getElementById("postJobButton");

function hideEmployerSections() {
    document.getElementById("businessProfileSection").hidden = true;
    document.getElementById("editBusinessSection").hidden = true;
    document.getElementById("postJobSection").hidden = true;
}

// VIEW BUSINESS PROFILE
if (viewBusinessButton) {
    viewBusinessButton.addEventListener("click", async function () {
        hideEmployerSections();

        const section = document.getElementById("businessProfileSection");
        const details = document.getElementById("businessProfileDetails");

        section.hidden = false;
        details.textContent = "Loading business profile...";

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) throw new Error("Please login first.");

            const { data, error } = await supabaseClient
                .from("employer_profiles")
                .select("business_name, business_type, city, description")
                .eq("user_id", userData.user.id)
                .single();

            if (error) throw error;

            details.textContent =
                "Business Name: " + (data.business_name || "Not added") +
                "\nBusiness Type: " + (data.business_type || "Not added") +
                "\nCity: " + (data.city || "Not added") +
                "\nDescription: " + (data.description || "Not added");

            details.style.whiteSpace = "pre-line";

        } catch (error) {
            details.textContent = "Loading failed: " + error.message;
        }
    });
}

// EDIT BUSINESS PROFILE
if (editBusinessButton) {
    editBusinessButton.addEventListener("click", async function () {
        hideEmployerSections();

        const section = document.getElementById("editBusinessSection");
        section.hidden = false;

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) throw new Error("Please login first.");

            const { data, error } = await supabaseClient
                .from("employer_profiles")
                .select("business_name, business_type, city, description")
                .eq("user_id", userData.user.id)
                .single();

            if (error) throw error;

            document.getElementById("editBusinessName").value =
                data.business_name || "";

            document.getElementById("editBusinessType").value =
                data.business_type || "";

            document.getElementById("editBusinessCity").value =
                data.city || "";

            document.getElementById("editBusinessDescription").value =
                data.description || "";

        } catch (error) {
            alert("Business profile loading failed: " + error.message);
        }
    });
}

// =====================================
// KARANX - SAVE BUSINESS PROFILE
// =====================================

const saveBusinessButton = document.getElementById("saveBusinessButton");

if (saveBusinessButton) {
    saveBusinessButton.addEventListener("click", async function () {
        const businessName = document.getElementById("editBusinessName").value.trim();
        const businessType = document.getElementById("editBusinessType").value.trim();
        const city = document.getElementById("editBusinessCity").value.trim();
        const description = document.getElementById("editBusinessDescription").value.trim();

        if (!businessName || !city) {
            alert("Business Name and City are required!");
            return;
        }

        try {
            saveBusinessButton.disabled = true;
            saveBusinessButton.textContent = "Saving...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError || !user) {
                throw new Error("Please login again.");
            }

            const { error } = await supabaseClient
                .from("employer_profiles")
                .update({
                    business_name: businessName,
                    business_type: businessType,
                    city: city,
                    description: description
                })
                .eq("user_id", user.id);

            if (error) throw error;

            alert("Business Profile Updated Successfully!");

            document.getElementById("editBusinessSection").hidden = true;

        } catch (error) {
            alert("Update failed: " + error.message);
        } finally {
            saveBusinessButton.disabled = false;
            saveBusinessButton.textContent = "Save Business Profile";
        }
    });
}

// POST A JOB
if (postJobButton) {
    postJobButton.addEventListener("click", function () {
        hideEmployerSections();
        document.getElementById("postJobSection").hidden = false;
    });
}

console.log("Supabase Client:", supabaseClient);

// =====================================
// KARANX - POST A JOB
// =====================================

const publishJobButton = document.getElementById("publishJobButton");

if (publishJobButton) {
    publishJobButton.addEventListener("click", async function () {

        const title = document.getElementById("jobTitle").value.trim();
        const description = document.getElementById("jobDescription").value.trim();
        const skillsText = document.getElementById("jobSkills").value.trim();
        const wage = Number(document.getElementById("jobWage").value);
        const city = document.getElementById("jobCity").value.trim();
        const locationName =
    document.getElementById("jobLocationName").value.trim();
        const vacancies = Number(document.getElementById("jobVacancies").value);
        const duration = Number(document.getElementById("jobDuration").value);
        const selectedJobLatitude =
    document.getElementById("jobLatitude").value;

        const selectedJobLongitude =
    document.getElementById("jobLongitude").value;

        if (!title || !description || !skillsText || !city) {
            alert("Please fill all required fields!");
            return;
        }

        if (!Number.isFinite(wage) || wage <= 0 ||
            !Number.isInteger(vacancies) || vacancies <= 0 ||
            !Number.isInteger(duration) || duration <= 0) {
            alert("Please enter valid wage, vacancies and duration!");
            return;
        }

        const requiredSkills = skillsText
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        if (requiredSkills.length === 0) {
            alert("Please enter at least one skill!");
            return;
        }

        try {
            publishJobButton.disabled = true;
            publishJobButton.textContent = "Publishing...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError || !user) {
                throw new Error("Please login again.");
            }

            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

            if (profileError) throw profileError;

            if (profile.role !== "employer") {
                throw new Error("Only employers can post jobs.");
            }

            const { error } = await supabaseClient
                
.from("jobs")
.insert({
    employer_id: user.id,
    title: title,
    description: description,
    required_skills: requiredSkills,
    daily_wage: wage,
    city: city,
    location_name: locationName || city,
    vacancies: vacancies,
    duration_days: duration,
    status: "active",
    latitude: Number(selectedJobLatitude),
    longitude: Number(selectedJobLongitude)
});


            if (error) throw error;

            alert("Job Published Successfully!");

            document.getElementById("jobTitle").value = "";
            document.getElementById("jobDescription").value = "";
            document.getElementById("jobSkills").value = "";
            document.getElementById("jobWage").value = "";
            document.getElementById("jobCity").value = "";
            document.getElementById("jobLatitude").value = "";
            document.getElementById("jobLongitude").value = "";
            document.getElementById("jobLocationStatus").textContent =
    "Please select job location on map.";
            document.getElementById("jobVacancies").value = "";
            document.getElementById("jobDuration").value = "";

            document.getElementById("postJobSection").hidden = true;

        } catch (error) {
            alert("Job publishing failed: " + error.message);
        } finally {
            publishJobButton.disabled = false;
            publishJobButton.textContent = "Publish Job";
        }
    });
}

// =====================================
// KARANX - MANAGE EMPLOYER JOBS
// =====================================

const manageJobsButton = document.getElementById("manageJobsButton");

if (manageJobsButton) {
    manageJobsButton.addEventListener("click", async function () {

        const section = document.getElementById("manageJobsSection");
        const jobsList = document.getElementById("myJobsList");

        section.hidden = false;
        jobsList.textContent = "Loading your jobs...";

        try {
            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error("Please login again.");

            const { data: jobs, error } = await supabaseClient
                .from("jobs")
                .select("id, title, description, required_skills, daily_wage, city, location_name, latitude, longitude, vacancies, duration_days, status, created_at")
                .eq("employer_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            jobsList.replaceChildren();

            if (!jobs || jobs.length === 0) {
                jobsList.textContent = "You have not posted any jobs yet.";
                return;
            }

            
jobs.forEach(function (job) {
    const card = document.createElement("div");
    card.className = "job-card";

    const title = document.createElement("h4");
    title.textContent = job.title;

    const details = document.createElement("p");
    details.textContent =
        "Description: " + job.description +
        "\nSkills: " + (job.required_skills || []).join(", ") +
        "\nDaily Wage: ₹" + job.daily_wage +
        "\nCity: " + job.city +
        "\nVacancies: " + job.vacancies +
        "\nDuration: " + job.duration_days + " days" +
        "\nStatus: " + job.status;

    details.style.whiteSpace = "pre-line";

    const statusButton = document.createElement("button");
    
const editButton = document.createElement("button");
editButton.textContent = "Edit Job";

editButton.addEventListener("click", function () {
    document.getElementById("editJobSection").hidden = false;

    document.getElementById("editJobId").value = job.id;
    document.getElementById("editJobLocationName").value =
    job.location_name || "";

document.getElementById("editJobLatitude").value =
    job.latitude ?? "";

document.getElementById("editJobLongitude").value =
    job.longitude ?? "";
    document.getElementById("editJobTitle").value = job.title;
    document.getElementById("editJobDescription").value = job.description;
    document.getElementById("editJobSkills").value =
        (job.required_skills || []).join(", ");
    document.getElementById("editJobWage").value = job.daily_wage;
    document.getElementById("editJobCity").value = job.city;
    document.getElementById("editJobLocationName").value =
    job.location_name || "";

document.getElementById("editJobLatitude").value =
    job.latitude ?? "";

document.getElementById("editJobLongitude").value =
    job.longitude ?? "";
    // Initialize Edit Job Map
const editMapElement = document.getElementById("editJobMap");

if (editMapElement && window.L) {

    const lat = Number(job.latitude) || 19.0760;
    const lon = Number(job.longitude) || 72.8777;

    if (!editJobMap) {
        editJobMap = L.map("editJobMap").setView([lat, lon], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(editJobMap);

        editJobMap.on("click", function (e) {
            const newLat = e.latlng.lat;
            const newLon = e.latlng.lng;

            if (editJobMarker) {
                editJobMarker.setLatLng(e.latlng);
            } else {
                editJobMarker = L.marker(e.latlng).addTo(editJobMap);
            }

            document.getElementById("editJobLatitude").value = newLat;
            document.getElementById("editJobLongitude").value = newLon;

            document.getElementById("editJobLocationStatus").textContent =
                "New location selected successfully!";
        });
    }

    editJobMap.setView([lat, lon], 15);

    if (job.latitude && job.longitude) {
        if (editJobMarker) {
            editJobMarker.setLatLng([lat, lon]);
        } else {
            editJobMarker = L.marker([lat, lon]).addTo(editJobMap);
        }
    }

    setTimeout(function () {
        editJobMap.invalidateSize();
    }, 300);
}
    document.getElementById("editJobVacancies").value = job.vacancies;
    document.getElementById("editJobDuration").value = job.duration_days;

    document.getElementById("editJobSection").scrollIntoView({
        behavior: "smooth"
    });
});

card.appendChild(editButton);

    statusButton.textContent =
        job.status === "active" ? "Close Job" : "Reopen Job";

    statusButton.addEventListener("click", async function () {
        const newStatus =
            job.status === "active" ? "closed" : "active";

        const { error } = await supabaseClient
            .from("jobs")
            .update({ status: newStatus })
            .eq("id", job.id)
            .eq("employer_id", user.id);

        if (error) {
            alert("Status update failed: " + error.message);
            return;
        }

        alert("Job status updated!");
        manageJobsButton.click();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Job";

    deleteButton.addEventListener("click", async function () {
        if (!confirm("Are you sure you want to delete this job?")) {
            return;
        }

        const { error } = await supabaseClient
            .from("jobs")
            .delete()
            .eq("id", job.id)
            .eq("employer_id", user.id);

        if (error) {
            alert("Job deletion failed: " + error.message);
            return;
        }

        alert("Job deleted successfully!");
        manageJobsButton.click();
    });

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(statusButton);
    card.appendChild(deleteButton);

    jobsList.appendChild(card);
});


        } catch (error) {
            jobsList.textContent = "Loading jobs failed: " + error.message;
        }
    });
}

// =====================================
// KARANX - SAVE EDITED JOB
// =====================================

const saveEditedJobButton =
    document.getElementById("saveEditedJobButton");

if (saveEditedJobButton) {
    saveEditedJobButton.addEventListener("click", async function () {

        const jobId = document.getElementById("editJobId").value;
        const title = document.getElementById("editJobTitle").value.trim();
        const description = document.getElementById("editJobDescription").value.trim();
        const skillsText = document.getElementById("editJobSkills").value.trim();
        const wage = Number(document.getElementById("editJobWage").value);
        const city = document.getElementById("editJobCity").value.trim();
        const locationName =
    document.getElementById("editJobLocationName").value.trim();

const selectedJobLatitude =
    document.getElementById("editJobLatitude").value;

const selectedJobLongitude =
    document.getElementById("editJobLongitude").value;
        const vacancies = Number(document.getElementById("editJobVacancies").value);
        const duration = Number(document.getElementById("editJobDuration").value);


        if (!jobId || !title || !description || !skillsText || !city) {
            alert("Please fill all required fields!");
            return;
        }

        if (
            !Number.isFinite(wage) || wage <= 0 ||
            !Number.isInteger(vacancies) || vacancies <= 0 ||
            !Number.isInteger(duration) || duration <= 0
        ) {
            alert("Enter valid wage, vacancies and duration!");
            return;
        }

        const requiredSkills = skillsText
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        if (requiredSkills.length === 0) {
            alert("Please enter at least one skill!");
            return;
        }

        try {
            saveEditedJobButton.disabled = true;
            saveEditedJobButton.textContent = "Saving...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error("Please login again.");

            const { error } = await supabaseClient
    .from("jobs")
    .update({
        title: title,
        description: description,
        required_skills: requiredSkills,
        daily_wage: wage,
        city: city,
        location_name: locationName || city,
        latitude: selectedJobLatitude === ""
            ? null
            : Number(selectedJobLatitude),
        longitude: selectedJobLongitude === ""
            ? null
            : Number(selectedJobLongitude),
        vacancies: vacancies,
        duration_days: duration
    })
    .eq("id", jobId)
    .eq("employer_id", user.id);

            if (error) throw error;

            alert("Job updated successfully!");

            document.getElementById("editJobSection").hidden = true;
            manageJobsButton.click();

        } catch (error) {
            alert("Job update failed: " + error.message);
        } finally {
            saveEditedJobButton.disabled = false;
            saveEditedJobButton.textContent = "Save Changes";
        }
    });
}

const saveWorkerProfileButton = document.getElementById(
    "saveWorkerProfileButton"
);

if (saveWorkerProfileButton) {
    saveWorkerProfileButton.addEventListener("click", async function () {
        const fullName = document.getElementById("editWorkerName").value.trim();
        const city = document.getElementById("editWorkerCity").value.trim();
        const experience = Number(
            document.getElementById("editWorkerExperience").value
        );
        const wage = Number(
            document.getElementById("editWorkerWage").value
        );
        const availability = document.getElementById(
            "editWorkerAvailability"
        ).value;
        const bio = document.getElementById("editWorkerBio").value.trim();

        if (!fullName || !city) {
            alert("Please enter your name and city.");
            return;
        }

        if (
            !Number.isFinite(experience) || experience < 0 ||
            !Number.isFinite(wage) || wage < 0
        ) {
            alert("Please enter valid experience and wage.");
            return;
        }

        if (!["available", "busy", "unavailable"].includes(availability)) {
            alert("Please select a valid availability.");
            return;
        }

        try {
            saveWorkerProfileButton.disabled = true;
            saveWorkerProfileButton.textContent = "Saving...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error("Please login again.");

            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .update({
                        full_name: fullName,
                        city: city
                    })
                    .eq("id", user.id)
                    .select("id")
                    .maybeSingle();

            if (profileError) throw profileError;
            if (!profile) throw new Error("Main profile was not updated.");

            const { data: workerProfile, error: workerError } =
                await supabaseClient
                    .from("worker_profiles")
                    .update({
                        experience_years: experience,
                        expected_daily_wage: wage,
                        availability: availability,
                        bio: bio
                    })
                    .eq("user_id", user.id)
                    .select("user_id")
                    .maybeSingle();

            if (workerError) throw workerError;
            if (!workerProfile) {
                throw new Error("Worker profile was not updated.");
            }

            alert("Worker profile updated successfully!");
            document.getElementById("editWorkerProfileSection").hidden = true;

        } catch (error) {
            alert("Profile update failed: " + error.message);
        } finally {
            saveWorkerProfileButton.disabled = false;
            saveWorkerProfileButton.textContent = "Save Profile";
        }
    });
}

const uploadWorkerVideoButton = document.getElementById(
    "uploadWorkerVideoButton"
);

if (uploadWorkerVideoButton) {
    uploadWorkerVideoButton.addEventListener("click", async function () {
        const title = document.getElementById("workerVideoTitle").value.trim();
        const description = document.getElementById(
            "workerVideoDescription"
        ).value.trim();

        const fileInput = document.getElementById("workerVideoFile");
        const file = fileInput.files[0];

        const status = document.getElementById("workerVideoUploadStatus");

        if (!title || !file) {
            status.textContent = "Please enter a title and select a video.";
            return;
        }

        if (file.type !== "video/mp4") {
            status.textContent = "Please select an MP4 video.";
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            status.textContent = "Video size must be 50 MB or less.";
            return;
        }

        try {
            uploadWorkerVideoButton.disabled = true;
            uploadWorkerVideoButton.textContent = "Uploading...";
            status.textContent = "Please wait, uploading your video...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error("Please login again.");

            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

            if (profileError) throw profileError;
            if (profile.role !== "worker") {
                throw new Error("Only workers can upload work videos.");
            }

            const filePath =
                user.id + "/" + crypto.randomUUID() + ".mp4";

            const { error: uploadError } = await supabaseClient
                .storage
                .from("worker-work-videos")
                .upload(filePath, file, {
                    contentType: "video/mp4",
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { error: databaseError } = await supabaseClient
                .from("worker_videos")
                .insert({
                    worker_id: user.id,
                    title: title,
                    description: description,
                    storage_path: filePath
                });

            if (databaseError) {
                await supabaseClient
                    .storage
                    .from("worker-work-videos")
                    .remove([filePath]);

                throw databaseError;
            }

            status.textContent = "Video uploaded successfully!";

            document.getElementById("workerVideoTitle").value = "";
            document.getElementById("workerVideoDescription").value = "";
            fileInput.value = "";

        } catch (error) {
            status.textContent = "Upload failed: " + error.message;
        } finally {
            uploadWorkerVideoButton.disabled = false;
            uploadWorkerVideoButton.textContent = "Upload Work Video";
        }
    });
}

const saveWorkerSkillsButton = document.getElementById(
    "saveWorkerSkillsButton"
);

if (saveWorkerSkillsButton) {
    saveWorkerSkillsButton.addEventListener("click", async function () {
        const skillsText = document.getElementById(
            "workerSkillsInput"
        ).value.trim();

        if (!skillsText) {
            alert("Please enter at least one skill!");
            return;
        }

        const skills = [...new Set(
            skillsText
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0)
        )];

        try {
            saveWorkerSkillsButton.disabled = true;
            saveWorkerSkillsButton.textContent = "Saving...";

            const { data: { user }, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;
            if (!user) throw new Error("Please login again.");

            const { data, error } = await supabaseClient
                .from("worker_profiles")
                .update({ skills: skills })
                .eq("user_id", user.id)
                .select("user_id")
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                throw new Error("Worker profile not found.");
            }

            alert("Skills saved successfully!");

        } catch (error) {
            alert("Skills save failed: " + error.message);
        } finally {
            saveWorkerSkillsButton.disabled = false;
            saveWorkerSkillsButton.textContent = "Save Skills";
        }
    });
}

// =====================================
// WORKER VIDEO PORTFOLIO - LOAD VIDEOS
// =====================================

const refreshWorkerVideosButton = document.getElementById("refreshWorkerVideosButton");

if (refreshWorkerVideosButton) {
    refreshWorkerVideosButton.addEventListener("click", loadWorkerVideos);
}

async function loadWorkerVideos() {
    const list = document.getElementById("workerVideosList");

    if (!list) return;

    list.textContent = "Loading your videos...";

    try {
        const { data: { user }, error: authError } =
            await supabaseClient.auth.getUser();

        if (authError || !user) {
            throw new Error("Please login again.");
        }

        const { data: videos, error } = await supabaseClient
            .from("worker_videos")
            .select("id, title, description, storage_path, created_at")
            .eq("worker_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        list.replaceChildren();

        if (!videos || videos.length === 0) {
            list.textContent = "No videos uploaded yet.";
            return;
        }

        for (const item of videos) {
            const card = document.createElement("div");

            const title = document.createElement("h4");
            title.textContent = item.title || "Work Video";

            const description = document.createElement("p");
            description.textContent = item.description || "No description";

            const { data: signedData, error: signedError } =
                await supabaseClient.storage
                    .from("worker-work-videos")
                    .createSignedUrl(item.storage_path, 3600);

            card.append(title, description);

            if (signedError || !signedData?.signedUrl) {
                const message = document.createElement("p");
                message.textContent = "Video access unavailable.";
                card.append(message);
            } else {
                const video = document.createElement("video");
                video.src = signedData.signedUrl;
                video.controls = true;
                video.preload = "metadata";
                video.style.width = "100%";
                video.style.maxWidth = "400px";
                card.append(video);
            }

            list.append(card);
        }

    } catch (error) {
        console.error("Video loading error:", error);
        list.textContent = "Could not load videos: " + error.message;
    }
}

 // =====================================
 // EMPLOYER - VIEW WORKER VIDEOS
 // =====================================

const loadWorkerVideosButton =
    document.getElementById("loadWorkerVideosButton");

if (loadWorkerVideosButton) {
    loadWorkerVideosButton.addEventListener("click", loadEmployerWorkerVideos);
}

async function loadEmployerWorkerVideos() {
    const list = document.getElementById("employerWorkerVideosList");

    if (!list) return;

    list.textContent = "Loading worker videos...";

    try {
        const { data: { user }, error: authError } =
            await supabaseClient.auth.getUser();

        if (authError || !user) {
            throw new Error("Please login again.");
        }

        const { data: employer, error: roleError } =
            await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

        if (roleError) throw roleError;

        if (employer.role !== "employer") {
            throw new Error("Only employers can view worker portfolios.");
        }

        const { data: videos, error } = await supabaseClient
            .from("worker_videos")
            .select("id, worker_id, title, description, storage_path, created_at")
            .order("created_at", { ascending: false });

        if (error) throw error;

        list.replaceChildren();

        if (!videos || videos.length === 0) {
            list.textContent = "No worker videos uploaded yet.";
            return;
        }

        for (const item of videos) {
            const card = document.createElement("div");

            const { data: worker } = await supabaseClient
                .from("profiles")
                .select("full_name, city")
                .eq("id", item.worker_id)
                .maybeSingle();

            const heading = document.createElement("h3");
            heading.textContent = item.title || "Work Portfolio";

            const name = document.createElement("p");
            name.textContent = "Worker: " +
                (worker?.full_name || "Name unavailable");

            const city = document.createElement("p");
            city.textContent = "City: " +
                (worker?.city || "Not added");

            const description = document.createElement("p");
            description.textContent =
                item.description || "No description";

            const { data: signedData, error: signedError } =
                await supabaseClient.storage
                    .from("worker-work-videos")
                    .createSignedUrl(item.storage_path, 3600);

            card.append(heading, name, city, description);

            if (signedError || !signedData?.signedUrl) {
                const message = document.createElement("p");
                message.textContent = "Video access unavailable.";
                card.append(message);
            } else {
                const video = document.createElement("video");
                video.src = signedData.signedUrl;
                video.controls = true;
                video.preload = "metadata";
                video.style.width = "100%";
                video.style.maxWidth = "400px";
                card.append(video);
            }

            list.append(card);
        }

    } catch (error) {
        console.error("Employer video error:", error);
        list.textContent = "Error: " + error.message;
    }
}

 // =====================================
 // KARANX - VOICE SKILL INPUT
 // =====================================

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let workerRecognition = null;

const startVoiceButton = document.getElementById("startVoiceButton");
const stopVoiceButton = document.getElementById("stopVoiceButton");
const voiceLanguage = document.getElementById("workerVoiceLanguage");
const voiceStatus = document.getElementById("voiceStatus");
const voiceTranscript = document.getElementById("workerVoiceTranscript");
const saveVoiceSkillsButton = document.getElementById("saveVoiceSkillsButton");
const workerSkillsInput = document.getElementById("workerSkillsInput");

if (startVoiceButton && stopVoiceButton && voiceStatus && voiceTranscript) {

    if (!SpeechRecognition) {
        voiceStatus.textContent = "Please use Chrome for voice recording.";
        startVoiceButton.disabled = true;
    } else {

        workerRecognition = new SpeechRecognition();
        workerRecognition.continuous = true;
        workerRecognition.interimResults = true;

        let finalTranscript = "";

        workerRecognition.onstart = function () {
            finalTranscript = "";
            voiceTranscript.value = "";
            voiceStatus.textContent = "Listening... बोलना शुरू करें...";
        };

        workerRecognition.onresult = function (event) {
            let interimTranscript = "";

            for (let i = 0; i < event.results.length; i++) {
                const text = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += text + " ";
                } else {
                    interimTranscript += text;
                }
            }

            voiceTranscript.value =
                (finalTranscript + interimTranscript).trim();
        };

        workerRecognition.onerror = function (event) {
            voiceStatus.textContent = "Voice error: " + event.error;
        };

        workerRecognition.onend = function () {
            voiceStatus.textContent = "Recording stopped / रिकॉर्डिंग बंद";
            startVoiceButton.disabled = false;
            stopVoiceButton.disabled = true;
        };

        startVoiceButton.addEventListener("click", function () {
            try {
                workerRecognition.lang = voiceLanguage.value;
                startVoiceButton.disabled = true;
                stopVoiceButton.disabled = false;
                workerRecognition.start();
            } catch (error) {
                voiceStatus.textContent = "Please try again: " + error.message;
                startVoiceButton.disabled = false;
                stopVoiceButton.disabled = true;
            }
        });

        stopVoiceButton.addEventListener("click", function () {
            if (workerRecognition) {
                workerRecognition.stop();
            }
        });
    }
}

if (saveVoiceSkillsButton) {
    saveVoiceSkillsButton.addEventListener("click", function () {
        const spokenText = voiceTranscript.value.trim();

        if (!spokenText) {
            alert("Please speak your skills first.");
            return;
        }

        workerSkillsInput.value = spokenText;
        alert("Voice text added! Review it, then click Save Skills.");
    });
}
let jobMap;
let editJobMap;
let editJobMarker;
// =====================================
// KARANX - EMPLOYER JOB LOCATION MAP
// =====================================

const jobMapElement = document.getElementById("jobMap");

if (jobMapElement && window.L) {

    const jobMap = L.map("jobMap").setView([19.0760, 72.8777], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(jobMap);

    let jobMarker = null;
    // =====================================
// SEARCH JOB LOCATION BY NAME
// =====================================

const searchJobLocationButton =
    document.getElementById("searchJobLocationButton");

if (searchJobLocationButton) {

    searchJobLocationButton.addEventListener("click", async function () {

        const locationName =
            document.getElementById("jobLocationName").value.trim();

        const status =
            document.getElementById("jobLocationSearchStatus");

        if (!locationName) {
            alert("Please enter a location name!");
            return;
        }

        try {
            searchJobLocationButton.disabled = true;
            searchJobLocationButton.textContent = "Searching...";
            status.textContent = "Searching location...";

            const response = await fetch(
                "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
                encodeURIComponent(locationName)
            );

            if (!response.ok) {
                throw new Error("Location search failed.");
            }

            const results = await response.json();

            if (results.length === 0) {
                status.textContent = "Location not found. Try another name.";
                return;
            }

            const latitude = Number(results[0].lat);
            const longitude = Number(results[0].lon);

            jobMap.setView([latitude, longitude], 16);

            if (jobMarker) {
                jobMap.removeLayer(jobMarker);
            }

            jobMarker = L.marker([latitude, longitude])
                .addTo(jobMap);

            document.getElementById("jobLatitude").value = latitude;
            document.getElementById("jobLongitude").value = longitude;

            status.textContent =
                "Location found: " + results[0].display_name;

            document.getElementById("jobLocationStatus").textContent =
                "Location selected: " +
                latitude.toFixed(5) + ", " +
                longitude.toFixed(5);

        } catch (error) {
            status.textContent = error.message;
        } finally {
            searchJobLocationButton.disabled = false;
            searchJobLocationButton.textContent = "Search Location";
        }
    });
}

    jobMap.on("click", function (event) {

        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;

        if (jobMarker) {
            jobMap.removeLayer(jobMarker);
        }

        jobMarker = L.marker([latitude, longitude]).addTo(jobMap);

        document.getElementById("jobLatitude").value = latitude;
        document.getElementById("jobLongitude").value = longitude;

        document.getElementById("jobLocationStatus").textContent =
            "Location selected: " +
            latitude.toFixed(5) + ", " +
            longitude.toFixed(5);
    });

}
// =====================================
// KARANX - WORKER FIND JOBS
// =====================================

const findJobsButton =
    document.getElementById("findJobsButton");

if (findJobsButton) {

    findJobsButton.addEventListener("click", async function () {

        const section =
            document.getElementById("findJobsSection");

        const jobsList =
            document.getElementById("workerJobsList");

        section.hidden = false;
        jobsList.textContent = "Loading available jobs...";

        try {
            findJobsButton.disabled = true;

            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;

            if (!userData.user) {
                throw new Error("Please login first.");
            }

            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .select("role")
                    .eq("id", userData.user.id)
                    .single();

            if (profileError) throw profileError;

            if (profile.role !== "worker") {
                throw new Error("Only workers can find jobs.");
            }

            const { data: jobs, error: jobsError } =
                await supabaseClient
                    .from("jobs")
                    .select(`
                        id,
                        title,
                        description,
                        required_skills,
                        daily_wage,
                        city,
                        location_name,
                        latitude,
                        longitude,
                        vacancies,
                        duration_days,
                        created_at
                    `)
                    .eq("status", "active")
                    .order("created_at", { ascending: false });

            if (jobsError) throw jobsError;

            jobsList.replaceChildren();

            if (!jobs || jobs.length === 0) {
    jobsList.textContent = "No active jobs available.";

    const mapStatus = document.getElementById("workerMapStatus");
    if (mapStatus) {
        mapStatus.textContent = "No active job locations available.";
    }

    return;
}

// =====================================
// WORKER JOBS MAP
// =====================================

const workerMapElement = document.getElementById("workerJobsMap");
const mapStatus = document.getElementById("workerMapStatus");

if (workerMapElement && window.L) {

    if (!window.workerJobsMapInstance) {
        window.workerJobsMapInstance =
            L.map("workerJobsMap").setView([19.0760, 72.8777], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(window.workerJobsMapInstance);
    }

    const workerMap = window.workerJobsMapInstance;

    if (window.workerJobMarkers) {
        window.workerJobMarkers.forEach(marker => marker.remove());
    }

    window.workerJobMarkers = [];

    const locatedJobs = jobs.filter(job =>
        Number.isFinite(Number(job.latitude)) &&
        Number.isFinite(Number(job.longitude)) &&
        job.latitude !== null &&
        job.longitude !== null
    );

    locatedJobs.forEach(function (job) {

        const marker = L.marker([
            Number(job.latitude),
            Number(job.longitude)
        ]).addTo(workerMap);

        marker.bindPopup(
            "<strong>" +
            String(job.title).replace(/[&<>"']/g, "") +
            "</strong><br>" +
            String(job.location_name || job.city).replace(/[&<>"']/g, "")
        );

        window.workerJobMarkers.push(marker);
    });

    if (locatedJobs.length > 0) {
        const bounds = L.latLngBounds(
            locatedJobs.map(job => [
                Number(job.latitude),
                Number(job.longitude)
            ])
        );

        workerMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });

        if (mapStatus) {
            mapStatus.textContent =
                locatedJobs.length + " job location(s) shown on map.";
        }
    } else if (mapStatus) {
        mapStatus.textContent =
            "Jobs found, but no map coordinates are saved yet.";
    }

    setTimeout(() => workerMap.invalidateSize(), 200);

} else if (mapStatus) {
    mapStatus.textContent = "Map library is not loaded.";
}

            jobs.forEach(function (job) {

                const card = document.createElement("div");
                card.className = "worker-feature";

                const heading = document.createElement("h3");
                heading.textContent = job.title;

                const description = document.createElement("p");
                description.textContent = job.description;

                const location = document.createElement("p");
                location.textContent =
                    "Work Location: " +
                    (job.location_name || job.city);

                const wage = document.createElement("p");
                wage.textContent =
                    "Daily Wage: ₹" + job.daily_wage;

                const skills = document.createElement("p");
                skills.textContent =
                    "Required Skills: " +
                    (job.required_skills || []).join(", ");

                const vacancies = document.createElement("p");
                vacancies.textContent =
                    "Vacancies: " + job.vacancies;

                const duration = document.createElement("p");
                duration.textContent =
                    "Duration: " + job.duration_days + " days";

                card.append(
                    heading,
                    description,
                    location,
                    wage,
                    skills,
                    vacancies,
                    duration
                );

                jobsList.appendChild(card);
            });

        } catch (error) {
            jobsList.textContent =
                "Jobs loading failed: " + error.message;

        } finally {
            findJobsButton.disabled = false;
        }
    });
}





    



