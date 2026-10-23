function liveClock() {
    const target = document.getElementById("liveClock");
    if (!target) return;

    target.textContent = new Date().toLocaleTimeString("en-AU");
}

function updateLiveDate() {
    const target = document.getElementById("live-date");
    if (!target) return;

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    target.textContent = new Date().toLocaleDateString("en-AU", options);
}

liveClock();
updateLiveDate();

setInterval(liveClock, 1000);
setInterval(updateLiveDate, 60000);


let biggestIndex = 100;

function openWindow(element) {
    if (!element) return;

    element.style.display = "block";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
}

function closeWindow(element) {
    if (!element) return;

    element.style.display = "none";
}




function changeTheme(theme) {
    const allowedThemes = ["default", "violet", "silver", "teal", "red", "brown", "lightblue"];

    if (!allowedThemes.includes(theme)) return;

    if (theme === "default") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", theme);
    }
}



const durationInput = document.querySelector("#duration");
const display = document.querySelector("#timer-display");
const startButton = document.querySelector("#start-timer");
const pauseButton = document.querySelector("#pause-timer");
const resetButton = document.querySelector("#reset-timer");

if (durationInput && display && startButton && pauseButton && resetButton) {
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

    startButton.addEventListener("click", () => {
        if (interval !== null || remaining <= 0) return;

        endTime = Date.now() + remaining * 1000;
        interval = setInterval(tick, 250);
        tick();
    });

    pauseButton.addEventListener("click", () => {
        if (interval === null) return;

        tick();
        stopTimer();
    });

    resetButton.addEventListener("click", () => {
        stopTimer();

        const minutes = Number(durationInput.value);

        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {
            durationInput.value = "25";
        }

        remaining = Number(durationInput.value) * 60;
        showTime();
    });

    durationInput.addEventListener("change", () => {
        if (interval !== null) return;

        const minutes = Number(durationInput.value);

        if (Number.isFinite(minutes) && minutes >= 1 && minutes <= 180) {
            remaining = minutes * 60;
            showTime();
        }
    });

    showTime();
}

const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const saveButton = document.getElementById("saveButton");
const notesList = document.getElementById("notesList");

let notes = [];

try {
    notes = JSON.parse(localStorage.getItem("myNotes") || "[]");

    if (!Array.isArray(notes)) {
        notes = [];
    }
} catch {
    notes = [];
}

let editingId = null;

function saveToStorage() {
    localStorage.setItem("myNotes", JSON.stringify(notes));
}

function renderNotes() {
    if (!notesList) return;

    notesList.replaceChildren();

    notes.forEach(note => {
        const card = document.createElement("article");
        card.className = "note";

        const title = document.createElement("h3");
        title.textContent = note.title || "Untitled";

        const content = document.createElement("p");
        content.textContent = note.content || "";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            titleInput.value = note.title || "";
            contentInput.value = note.content || "";
            editingId = note.id;
            saveButton.textContent = "Update Note";
            titleInput.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter(item => item.id !== note.id);

            if (editingId === note.id) {
                editingId = null;
                titleInput.value = "";
                contentInput.value = "";
                saveButton.textContent = "Save Note";
            }

            saveToStorage();
            renderNotes();
        });

        card.append(title, content, editButton, deleteButton);
        notesList.append(card);
    });
}

if (titleInput && contentInput && saveButton && notesList) {
    saveButton.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) {
            alert("Write something before saving.");
            return;
        }

        if (editingId !== null) {
            notes = notes.map(note =>
                note.id === editingId
                    ? { ...note, title, content }
                    : note
            );
        } else {
            notes.unshift({
                id: Date.now(),
                title,
                content
            });
        }

        saveToStorage();
        renderNotes();

        titleInput.value = "";
        contentInput.value = "";
        editingId = null;
        saveButton.textContent = "Save Note";
    });

    renderNotes();
}










function updateMoonPhase() {
    const knownNewMoon = new Date("2000-01-06T18:14:00Z");
    const synodicMonth = 29.5305877058;

    const days = (Date.now() - knownNewMoon.getTime()) / 86400000;
    const phase =
        (((days % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth;

    const shadow = document.getElementById("moon-shadow");
    const label = document.getElementById("phase-name");
    const moon = document.getElementById("moon");

    if (!shadow || !label || !moon) return;

    const R = 74;
    const C = 75;
    const cosPhase = Math.cos(2 * Math.PI * phase);
    const waxing = phase < 0.5;
    const rx = Math.max(0.001, Math.abs(cosPhase) * R);

    let d;

    if (phase < 0.0001 || phase > 0.9999) {

        d = `M ${C} ${C - R}
             A ${R} ${R} 0 1 0 ${C} ${C + R}
             A ${R} ${R} 0 1 0 ${C} ${C - R} Z`;
    } else if (Math.abs(phase - 0.5) < 0.0001) {

        d = "";
    } else {
        const outerSweep = waxing ? 0 : 1;


        const innerSweep = waxing
            ? (cosPhase > 0 ? 0 : 1)
            : (cosPhase > 0 ? 1 : 0);

        d = `M ${C} ${C - R}
             A ${R} ${R} 0 0 ${outerSweep} ${C} ${C + R}
             A ${rx} ${R} 0 0 ${innerSweep} ${C} ${C - R}
             Z`;
    }

    shadow.setAttribute("d", d);

    let name;

    if (phase < 0.03 || phase >= 0.97) {
        name = "New Moon";
    } else if (phase < 0.22) {
        name = "Waxing Crescent";
    } else if (phase < 0.28) {
        name = "First Quarter";
    } else if (phase < 0.47) {
        name = "Waxing Gibbous";
    } else if (phase < 0.53) {
        name = "Full Moon";
    } else if (phase < 0.72) {
        name = "Waning Gibbous";
    } else if (phase < 0.78) {
        name = "Last Quarter";
    } else {
        name = "Waning Crescent";
    }

    label.textContent = name;
    moon.setAttribute("aria-label", name);
}

updateMoonPhase();
setInterval(updateMoonPhase, 60 * 60 * 1000);





const bookmarkList = document.getElementById("bookmarkList");
const addBookmarkButton = document.getElementById("addBookmarkButton");
const bookmarkWindow = document.getElementById("bookmarkWindow");
const bookmarkName = document.getElementById("bookmarkName");
const bookmarkURL = document.getElementById("bookmarkURL");
const saveBookmarkButton = document.getElementById("saveBookmarkButton");
const closeBookmarkButton = document.getElementById("closeBookmarkButton");
const bookmarkMessage = document.getElementById("bookmarkMessage");

const MAX_BOOKMARKS = 8;
const BOOKMARK_STORAGE_KEY = "myBookmarks";

let bookmarks = [];


try {
    const saved = JSON.parse(
        localStorage.getItem(BOOKMARK_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(saved)) {
        bookmarks = saved.filter(item =>
            item &&
            typeof item.name === "string" &&
            typeof item.url === "string" &&
            isValidBookmarkURL(item.url)
        ).slice(0, MAX_BOOKMARKS);
    }

} catch {
    bookmarks = [];
}

function isValidBookmarkURL(value) {
    try {
        const url = new URL(value);

        return url.protocol === "https:" ||
            url.protocol === "http:";
    } catch {
        return false;
    }

}

function saveBookmarks() {
    localStorage.setItem(
        BOOKMARK_STORAGE_KEY,
        JSON.stringify(bookmarks)
    );

}

function renderBookmarks() {
    if (!bookmarkList || !addBookmarkButton) return;

    bookmarkList.replaceChildren();

    bookmarks.forEach((bookmark, index) => {
        const item = document.createElement("div");
        item.className = "bookmark-item";

        const link = document.createElement("a");
        link.className = "bookmark-link";
        link.href = bookmark.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = bookmark.url;

        const circle = document.createElement("span");
        circle.className = "bookmark-circle";

        circle.textContent = bookmark.name.charAt(0).toUpperCase();
        const label = document.createElement("span");
        label.className = "bookmark-label";
        label.textContent = bookmark.name;

        link.append(circle, label);
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-bookmark";
        removeButton.textContent = "×";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${bookmark.name}`
        );

        removeButton.addEventListener("click", () => {
            bookmarks.splice(index, 1);
            saveBookmarks();
            renderBookmarks();
        });

        item.append(link, removeButton);
        bookmarkList.append(item);
    });
    addBookmarkButton.hidden = bookmarks.length >= MAX_BOOKMARKS;
}


function openBookmarkWindow() {

    if (!bookmarkWindow) return;

    if (bookmarks.length >= MAX_BOOKMARKS) {
        return;
    }

    bookmarkMessage.textContent = "";
    bookmarkName.value = "";
    bookmarkURL.value = "";

    openWindow(bookmarkWindow);
    bookmarkName.focus();
}

if (
    bookmarkList &&
    addBookmarkButton &&
    bookmarkWindow &&
    bookmarkName &&
    bookmarkURL &&
    saveBookmarkButton &&
    closeBookmarkButton &&
    bookmarkMessage
) {
    addBookmarkButton.addEventListener("click", openBookmarkWindow);
    closeBookmarkButton.addEventListener("click", () => {
        closeWindow(bookmarkWindow);
    });

    saveBookmarkButton.addEventListener("click", () => {
        const name = bookmarkName.value.trim();
        const rawURL = bookmarkURL.value.trim();

        if (!name || !rawURL) {
            bookmarkMessage.textContent = "Please enter a name and website URL."
            return;
        }
        if (bookmarks.length >= MAX_BOOKMARKS) {
            bookmarkMessage.textContent =
                "You've reached the bookmark limit.";
            return;
        }

        if (!isValidBookmarkURL(rawURL)) {
            bookmarkMessage.textContent =
                "Please enter a valid HTTP or HTTPS URL.";
            return;
        }

        const url = new URL(rawURL).href;

        bookmarks.push({ name, url });

        saveBookmarks();
        renderBookmarks();
        closeWindow(bookmarkWindow);
    });

    bookmarkURL.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            saveBookmarkButton.click();
        }
    });

    renderBookmarks();
}


