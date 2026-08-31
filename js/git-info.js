(() => {
    "use strict";

    const COMMITS_URL = "https://api.github.com/repos/GHevia/granthevia.com/commits";
    const CACHE_KEY = "granthevia-latest-site-commit-v2";
    const CACHE_DURATION_MS = 6 * 60 * 60 * 1000;
    const COMMITS_PER_PAGE = 100;
    const MAX_PAGES = 5;
    const SITE_TIME_ZONE = "America/Denver";
    const DAILY_PUZZLE_MESSAGE = /^Update daily puzzle for \d{4}-\d{2}-\d{2}\b/i;

    function formatCommitDate(value) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: SITE_TIME_ZONE,
        }).format(new Date(value));
    }

    function renderFooter(commit) {
        const footer = document.querySelector("footer");
        if (!footer || !commit?.date) return;

        let paragraph = footer.querySelector("p");
        if (!paragraph) {
            paragraph = document.createElement("p");
            footer.appendChild(paragraph);
        }

        const year = new Date().getFullYear();
        const time = document.createElement("time");
        time.dateTime = commit.date;
        time.textContent = formatCommitDate(commit.date);

        paragraph.replaceChildren(document.createTextNode(`\u00a9 ${year} Grant Hevia \u00b7 Site updated `));

        if (commit.url) {
            const link = document.createElement("a");
            link.href = commit.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.appendChild(time);
            link.setAttribute("aria-label", `View the latest website commit from ${time.textContent}`);
            paragraph.appendChild(link);
        } else {
            paragraph.appendChild(time);
        }
    }

    function readCachedCommit() {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (cached?.commit?.date) return cached;
        } catch {
            // Storage can be unavailable in privacy-focused browser modes.
        }
        return null;
    }

    function cacheCommit(commit) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                cachedAt: Date.now(),
                commit,
            }));
        } catch {
            // The live result can still be displayed when storage is unavailable.
        }
    }

    async function fetchCommitPage(page) {
        const url = new URL(COMMITS_URL);
        url.searchParams.set("per_page", String(COMMITS_PER_PAGE));
        url.searchParams.set("page", String(page));

        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub returned ${response.status}`);
        }

        return response.json();
    }

    function isDailyPuzzleCommit(commit) {
        const subject = commit?.commit?.message?.split("\n", 1)[0] || "";
        return DAILY_PUZZLE_MESSAGE.test(subject);
    }

    async function fetchLatestSiteCommit() {
        for (let page = 1; page <= MAX_PAGES; page += 1) {
            const commits = await fetchCommitPage(page);
            const latest = commits.find(commit => !isDailyPuzzleCommit(commit));

            if (latest) {
                const date = latest.commit?.committer?.date || latest.commit?.author?.date;
                if (!date) throw new Error("The latest site commit did not include a date");
                return { date, url: latest.html_url || "" };
            }

            if (commits.length < COMMITS_PER_PAGE) break;
        }

        throw new Error("No non-puzzle site commit was found");
    }

    async function initializeCommitDate() {
        if (window.__grantHeviaCommitDateInitialized) return;
        window.__grantHeviaCommitDateInitialized = true;

        const cached = readCachedCommit();
        if (cached) renderFooter(cached.commit);

        const cacheIsFresh = cached && Date.now() - cached.cachedAt < CACHE_DURATION_MS;
        if (cacheIsFresh) return;

        try {
            const commit = await fetchLatestSiteCommit();
            cacheCommit(commit);
            renderFooter(commit);
        } catch (error) {
            // Keep a cached date or the page's static footer when GitHub is unavailable.
            console.warn("Could not load the latest commit date:", error);
            if (!cached) {
                const fallback = document.querySelector(".footer-update");
                if (fallback) fallback.textContent = "Latest update unavailable";
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeCommitDate, { once: true });
    } else {
        initializeCommitDate();
    }
})();
