
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


