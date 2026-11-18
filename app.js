(() => {
    const titles = {
        home: "FIFTN | Party Game for Friends",
        terms: "Terms of Service | FIFTN",
        privacy: "Privacy Policy | FIFTN",
    };

    function showRoute(moveFocus) {
        const route = window.location.hash.slice(2).replace(/\/$/, "").toLowerCase();
        const active = Object.hasOwn(titles, route) ? route : "home";
        document.querySelectorAll(".route").forEach((section) => {
            section.hidden = section.dataset.route !== active;
        });
        document.querySelectorAll(".nav-link").forEach((link) => {
            const selected = link.dataset.route === active;
            link.classList.toggle("active", selected);
            if (selected) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
        document.title = titles[active];
        if (moveFocus) {
            document.getElementById("app").focus({ preventScroll: true });
            window.scrollTo(0, 0);
        }
    }

    document.getElementById("year").textContent = new Date().getFullYear();
    showRoute(false);
    window.addEventListener("hashchange", () => showRoute(true));

    const wheel = document.getElementById("demo-wheel");
    const button = document.querySelector(".spin");
    const result = document.getElementById("demo-result");
    const counter = document.getElementById("demo-spins-left");
    const download = document.getElementById("demo-download");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const spinLimit = 5;
    const storageKey = "fiftn-demo-spins-used";
    const prompts = [
        "Truth: What's your most ridiculous habit?",
        "Challenge: Give a dramatic speech about the nearest object.",
        "Penalty: Speak in rhyme until your next turn.",
        "Rule: For one round, everyone must call each other by a nickname.",
    ];
    let rotation = 0;
    let busy = false;
    let previousPick = -1;
    let spinsUsed = 0;
    try {
        const stored = Number(window.sessionStorage.getItem(storageKey));
        if (Number.isInteger(stored) && stored >= 0) spinsUsed = Math.min(stored, spinLimit);
    } catch {
        // The demo still works when storage is unavailable.
    }

    function updateCounter() {
        const remaining = spinLimit - spinsUsed;
        counter.textContent = remaining === 1 ? "1 SPIN LEFT" : `${remaining} SPINS LEFT`;
    }

    function finishDemo() {
        button.setAttribute("aria-disabled", "true");
        button.textContent = "DONE";
        download.hidden = false;
    }

    updateCounter();
    if (spinsUsed === spinLimit) {
        finishDemo();
        result.textContent = "You've used all 5 demo spins.";
    } else {
        button.disabled = false;
    }

    button.addEventListener("click", () => {
        if (busy || spinsUsed >= spinLimit) return;
        busy = true;
        button.setAttribute("aria-disabled", "true");
        spinsUsed += 1;
        try {
            window.sessionStorage.setItem(storageKey, String(spinsUsed));
        } catch {
            // Keep enforcing the limit in memory.
        }
        updateCounter();
        const choices = prompts.map((_, i) => i).filter((i) => i !== previousPick);
        const pick = choices[Math.floor(Math.random() * choices.length)];
        previousPick = pick;
        const target = (360 - pick * 90) % 360;
        rotation += 1080 + (target - rotation % 360 + 360) % 360;
        wheel.style.setProperty("--rotation", `${rotation}deg`);
        const finish = () => {
            result.textContent = prompts[pick];
            busy = false;
            if (spinsUsed === spinLimit) {
                result.textContent += " That was your last demo spin.";
                finishDemo();
            } else {
                button.removeAttribute("aria-disabled");
            }
        };
        if (reducedMotion.matches) finish();
        else window.setTimeout(finish, 1250);
    });
})();
