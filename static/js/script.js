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