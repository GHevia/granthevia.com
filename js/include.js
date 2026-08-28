// /js/include.js
function setupHeaderDropdowns(header) {
    const dropdowns = Array.from(header.querySelectorAll(".dropdown"));

    const closeDropdowns = () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove("open");
            dropdown.querySelector(".dropbtn")?.setAttribute("aria-expanded", "false");
        });
    };

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector(".dropbtn");
        if (!trigger) return;

        trigger.setAttribute("aria-haspopup", "true");
        trigger.setAttribute("aria-expanded", "false");
        trigger.addEventListener("click", event => {
            const wasOpen = dropdown.classList.contains("open");
            const hasPreciseHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

            // On touch devices, the first tap opens the menu and the second follows the link.
            if (!hasPreciseHover && !wasOpen) event.preventDefault();
            event.stopPropagation();
            closeDropdowns();

            if (!wasOpen) {
                dropdown.classList.add("open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.addEventListener("click", closeDropdowns);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeDropdowns();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const includeHeader = document.getElementById("header-placeholder");

    if (includeHeader) {
        fetch("/partials/header.html")
            .then(res => res.text())
            .then(html => {
                includeHeader.innerHTML = html;
                setupHeaderDropdowns(includeHeader);
            })
            .catch(err => {
                console.error("Could not load header:", err);
            });
    }

    // Load the shared commit-date footer on every page that uses the header include.
    const hasGitInfoScript = Array.from(document.scripts).some(script => {
        try {
            return new URL(script.src, window.location.href).pathname === "/js/git-info.js";
        } catch {
            return false;
        }
    });

    if (!hasGitInfoScript) {
        const gitInfoScript = document.createElement("script");
        gitInfoScript.src = "/js/git-info.js";
        document.head.appendChild(gitInfoScript);
    }
});
