// ===============================
// RESTART QUIZ ON PAGE REFRESH
// ===============================

const navigationEntry = performance.getEntriesByType("navigation")[0];

if (
    navigationEntry &&
    navigationEntry.type === "reload" &&
    window.location.pathname === "/quiz"
) {
    window.location.href = "/restart";
}

// Get remaining time from sessionStorage, or start with 15 seconds
let time = 15;

const timer = document.getElementById("timer");

if (timer) {

    timer.innerHTML = "Time Left : 0:15";

    const interval = setInterval(function () {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;

        timer.innerHTML = `Time Left : ${minutes}:${seconds}`;

        if (time <= 0) {

    clearInterval(interval);

    document.getElementById("autoSubmit").value = "true";

    const actionField = document.getElementById("actionField");

    if (document.querySelector(".submit-btn")) {
        actionField.value = "submit";
    } else {
        actionField.value = "next";
    }

    document.getElementById("quizForm").submit();
    return;
}

        time--;

    }, 1000);
}


document.querySelectorAll(".option").forEach(option=>{

option.addEventListener("click",()=>{

document.querySelectorAll(".option").forEach(o=>o.classList.remove("selected"));

option.classList.add("selected");

});
});

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

document.addEventListener("keydown", function(e) {

    if (
        (e.ctrlKey && ["c", "u", "s", "a"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
    ) {
        e.preventDefault();
    }

});

// ===============================
// PWA SERVICE WORKER
// ===============================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function() {

        navigator.serviceWorker.register(
            "/static/service-worker.js"
        )
        .then(function(registration) {

            console.log(
                "PWA Service Worker registered successfully:",
                registration.scope
            );

        })
        .catch(function(error) {

            console.log(
                "PWA Service Worker registration failed:",
                error
            );

        });

    });

}

/* =========================
   LIGHT / DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    // Load saved theme
    const savedTheme = localStorage.getItem("quizTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            localStorage.setItem("quizTheme", "light");

            themeToggle.textContent = "🌙";

        } else {

            localStorage.setItem("quizTheme", "dark");

            themeToggle.textContent = "☀️";
        }

    });
}
// TAB SWITCH PROTECTION
// ===============================

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        document.body.classList.add("tab-hidden");

    } else {

        document.body.classList.remove("tab-hidden");

    }

});
