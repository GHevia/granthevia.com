(() => {
  "use strict";

  function initializeCollectionFilter() {
    const input = document.getElementById("gallery-filter");
    const clearButton = document.getElementById("clear-gallery-filter");
    const status = document.getElementById("gallery-filter-status");
    const emptyState = document.getElementById("gallery-empty");
    const cards = Array.from(document.querySelectorAll("[data-gallery-card]"));
    if (!input || !status || cards.length === 0) return;

    const update = () => {
      const query = input.value.trim().toLocaleLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const matches = !query || card.dataset.search.includes(query);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      status.textContent = `${visibleCount} ${visibleCount === 1 ? "collection" : "collections"}`;
      if (emptyState) emptyState.hidden = visibleCount !== 0;
      if (clearButton) clearButton.hidden = query.length === 0;
    };

    input.addEventListener("input", update);
    clearButton?.addEventListener("click", () => {
      input.value = "";
      update();
      input.focus();
    });
  }

  function initializeLightbox() {
    const triggers = Array.from(document.querySelectorAll(".gallery-trigger"));
    if (triggers.length === 0) return;

    const modal = document.createElement("div");
    modal.className = "lightbox-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Photo viewer");
    modal.innerHTML = `
      <button class="lightbox-button lightbox-close" type="button" aria-label="Close photo viewer">&times;</button>
      <button class="lightbox-button lightbox-previous" type="button" aria-label="Previous photo">&#8592;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-content" alt="">
        <figcaption class="lightbox-caption"><span></span> <a target="_blank" rel="noopener noreferrer">Open original</a></figcaption>
      </figure>
      <button class="lightbox-button lightbox-next" type="button" aria-label="Next photo">&#8594;</button>
    `;
    document.body.appendChild(modal);

    const image = modal.querySelector(".lightbox-content");
    const caption = modal.querySelector(".lightbox-caption span");
    const originalLink = modal.querySelector(".lightbox-caption a");
    const closeButton = modal.querySelector(".lightbox-close");
    const previousButton = modal.querySelector(".lightbox-previous");
    const nextButton = modal.querySelector(".lightbox-next");
    const focusable = [closeButton, previousButton, originalLink, nextButton];
    let activeIndex = 0;
    let previousFocus = null;

    const show = index => {
      activeIndex = (index + triggers.length) % triggers.length;
      const trigger = triggers[activeIndex];
      const thumbnail = trigger.querySelector("img");
      image.src = trigger.dataset.displaySrc;
      image.alt = thumbnail?.alt || "Selected photograph";
      caption.textContent = `${activeIndex + 1} of ${triggers.length}`;
      originalLink.href = trigger.dataset.originalSrc;
    };

    const open = index => {
      previousFocus = document.activeElement;
      show(index);
      modal.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    };

    const close = () => {
      modal.hidden = true;
      document.body.classList.remove("lightbox-open");
      image.removeAttribute("src");
      previousFocus?.focus();
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => open(index));
    });
    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", () => show(activeIndex - 1));
    nextButton.addEventListener("click", () => show(activeIndex + 1));
    modal.addEventListener("click", event => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", event => {
      if (modal.hidden) return;

      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(activeIndex - 1);
      if (event.key === "ArrowRight") show(activeIndex + 1);

      if (event.key === "Tab") {
        const currentIndex = focusable.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + direction + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[nextIndex].focus();
      }
    });
  }

  initializeCollectionFilter();
  initializeLightbox();
})();
