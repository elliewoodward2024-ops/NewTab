function liveClock() {

    const target = document.getElementById('liveClock');
    const now = new Date();

    target.textContent = now.toLocaleTimeString();
}

setInterval(liveClock, 1000);
liveClock();
