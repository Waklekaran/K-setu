
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

// =====================================
// KARANX - INITIAL CONNECTION TEST
// =====================================

window.addEventListener("load", () => {
    console.log("KaranX JavaScript loaded!");

    if (window.supabase) {
        console.log("Supabase library loaded!");

        if (typeof supabaseClient !== "undefined") {
            console.log("KaranX Supabase client initialized!");
        } else {
            console.error("Supabase client not initialized.");
        }

    } else {
        console.error("Supabase library failed to load.");
    }
});

// =====================================
// KARANX - VISIBLE CONNECTION STATUS
// =====================================

window.addEventListener("load", () => {
    const statusBox = document.createElement("div");

    statusBox.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        padding: 15px;
        background: #eff6ff;
        color: #111827;
        border: 2px solid #2563eb;
        border-radius: 10px;
        z-index: 9999;
        font-size: 14px;
    `;

    if (window.supabase && typeof supabaseClient !== "undefined") {
        statusBox.textContent =
            "KaranX: JavaScript loaded. Supabase library and client initialized!";
    } else if (window.supabase) {
        statusBox.textContent =
            "KaranX: Supabase library loaded, but client initialization failed.";
    } else {
        statusBox.textContent =
            "KaranX: Supabase library failed to load.";
    }

    document.body.appendChild(statusBox);
});


// =====================================
// KARANX - VISIBLE DATABASE TEST
// =====================================

async function testDatabaseConnectionVisible() {
    const box = document.createElement("div");

    box.style.cssText = `
        position: fixed;
        bottom: 15px;
        left: 10px;
        right: 10px;
        padding: 16px;
        background: #eff6ff;
        color: #111827;
        border: 2px solid #2563eb;
        border-radius: 12px;
        z-index: 10000;
        font-size: 14px;
    `;

    box.textContent = "KaranX: Testing database connection...";
    document.body.appendChild(box);

    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id")
            .limit(1);

        if (error) {
            box.textContent =
                "Database test error: " + error.message;
        } else {
            box.textContent =
                "Supabase query completed! Rows received: " +
                data.length +
                ".";
        }

    } catch (error) {
        box.textContent =
            "Connection error: " + error.message;
    }
}

testDatabaseConnectionVisible();



