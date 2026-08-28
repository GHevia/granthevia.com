// Shared header, navigation, and footer components.
(() => {
    "use strict";

    async function fetchPartial(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`${path} returned ${response.status}`);
        return response.text();
    }

    function currentSection() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("/photos") || path.endsWith("/photos.html")) return "photos";
        if (path.includes("/games") || path.endsWith("/games.html")) return "games";
        if (path.includes("/thesis") || path.endsWith("/thesis.html")) return "thesis";
        return "home";
    }

    function setupNavigation(header) {
        const toggle = header.querySelector(".nav-toggle");
        const list = header.querySelector(".nav-list");
        if (!toggle || !list) return;

        const closeMenu = () => {
            toggle.setAttribute("aria-expanded", "false");
            list.classList.remove("is-open");
        };

        toggle.addEventListener("click", () => {
            const willOpen = toggle.getAttribute("aria-expanded") !== "true";
            toggle.setAttribute("aria-expanded", String(willOpen));
            list.classList.toggle("is-open", willOpen);
        });

        list.addEventListener("click", event => {
            if (event.target.closest("a")) closeMenu();
        });

        document.addEventListener("click", event => {
            if (!header.contains(event.target)) closeMenu();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
                toggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 720) closeMenu();
        });

        const section = currentSection();
        header.querySelector(`[data-section="${section}"]`)?.setAttribute("aria-current", "page");
    }

    function loadCommitDate() {
        const alreadyLoaded = Array.from(document.scripts).some(script => {
            try {
                return new URL(script.src, window.location.href).pathname === "/js/git-info.js";
            } catch {
                return false;
            }
        });
        if (alreadyLoaded) return;

        const script = document.createElement("script");
        script.src = "/js/git-info.js";
        document.head.appendChild(script);
    }

    async function initializeIncludes() {
        const headerHost = document.getElementById("header-placeholder");
        const existingFooter = document.querySelector("footer");

        const headerPromise = headerHost
            ? fetchPartial("/partials/header.html")
                .then(html => {
                    headerHost.innerHTML = html;
                    const header = headerHost.querySelector(".site-header");
                    if (header) setupNavigation(header);
                })
                .catch(error => console.error("Could not load the site header:", error))
            : Promise.resolve();

        const footer = existingFooter || document.body.appendChild(document.createElement("footer"));
        footer.classList.add("site-footer");
        const footerPromise = fetchPartial("/partials/footer.html")
            .then(html => {
                footer.innerHTML = html;
                loadCommitDate();
            })
            .catch(error => {
                console.error("Could not load the site footer:", error);
                loadCommitDate();
            });

        await Promise.all([headerPromise, footerPromise]);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeIncludes, { once: true });
    } else {
        initializeIncludes();
    }
})();
