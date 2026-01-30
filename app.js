(function () {
    const routes = ["home", "terms", "privacy"];

    function getRouteFromHash() {
        const raw = window.location.hash || "#/home";
        const match = raw.match(/^#\/([a-z-]+)/i);
        const route = match ? match[1] : "home";
        return routes.includes(route) ? route : "home";
    }

    function setActiveNav(route) {
        document.querySelectorAll(".nav-link").forEach((a) => {
            const r = a.getAttribute("data-route");
            a.classList.toggle("active", r === route);
        });
    }

    function showRoute(route) {
        document.querySelectorAll(".route").forEach((section) => {
            const r = section.getAttribute("data-route");
            section.hidden = r !== route;
        });
        setActiveNav(route);
        // Move focus to main for accessibility on route change
        const main = document.getElementById("app");
        if (main) main.focus?.();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function initDates() {
        const now = new Date();
        const year = String(now.getFullYear());
        const y = document.getElementById("year");
        if (y) y.textContent = year;

        // If you want auto “Last updated” to today, uncomment below
        // const iso = now.toISOString().slice(0, 10);
        // const tos = document.getElementById("tos-date");
        // const pp = document.getElementById("pp-date");
        // if (tos) tos.textContent = iso;
        // if (pp) pp.textContent = iso;
    }

    function onHashChange() {
        const route = getRouteFromHash();
        showRoute(route);
    }

    // Init
    initDates();
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
})();