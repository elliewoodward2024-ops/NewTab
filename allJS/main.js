function liveClock() {

    const target = document.getElementById('liveClock');
    const now = new Date();

    target.textContent = now.toLocaleTimeString();
}

setInterval(liveClock, 1000);
liveClock();


function updateLiveDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const currentDate = now.toLocaleDateString('en-AU', options);
    document.getElementById('live-date').textContent = currentDate;
}
updateLiveDate();
setInterval(updateLiveDate, 60000);

const durationInput = document.querySelector("#duration");
const display = document.querySelector("#timer-display");

let remaining = 25 * 60;
let interval = null;
let endTime = null;

function showTime() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    display.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
    endTime = null;
}

function tick() {
    remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );

    showTime();

    if (remaining <= 0) {
        stopTimer();
        alert("Focus session complete.");
    }
}

document.querySelector("#start-timer")
    .addEventListener("click", () => {
        if (interval !== null || remaining <= 0) return;

        endTime = Date.now() + remaining * 1000;
        interval = setInterval(tick, 250);
        tick();
    });

document.querySelector("#pause-timer")
    .addEventListener("click", () => {
        if (interval === null) return;

        tick();
        stopTimer();
    });

document.querySelector("#reset-timer")
    .addEventListener("click", () => {
        stopTimer();

        const minutes = Number(durationInput.value);
        if (!Number.isFinite(minutes) ||
            minutes < 1 || minutes > 180) {
            durationInput.value = "25";
        }

        remaining = Number(durationInput.value) * 60;
        showTime();
    });

durationInput.addEventListener("change", () => {
    if (interval !== null) return;

    const minutes = Number(durationInput.value);
    if (Number.isFinite(minutes) &&
        minutes >= 1 && minutes <= 180) {
        remaining = minutes * 60;
        showTime();
    }
});

showTime();




function openWindow(element) {
    element.style.display = "block";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    element.style.top = "";
    element.style.left = "";
}

window.onload = function () {
    openWindow(document.getElementById("welcome"));
};

function closeWindow(element) {
    element.style.display = "none";
}



addWindowTapHandling(document.getElementById("settings"));

function changeTheme(theme) {
    if (theme === "default") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}
