// /js/include.js
document.addEventListener("DOMContentLoaded", () => {
    const includeHeader = document.getElementById("header-placeholder");

    if (includeHeader) {
        fetch("/partials/header.html")
            .then(res => res.text())
            .then(html => {
                includeHeader.innerHTML = html;
            })
            .catch(err => {
                console.error("Could not load header:", err);
            });
    }
});
