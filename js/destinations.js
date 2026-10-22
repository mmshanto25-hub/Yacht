/**
 * ==========================================================================
 * AVENTIS DESTINATIONS MODULE
 * Interactive region filters and smooth destination slider navigation.
 * ==========================================================================
 */
(() => {
  "use strict";

  const destTabs = document.querySelectorAll(".dest-tab");
  const destCards = document.querySelectorAll(".destination-card");

  document.querySelectorAll(".destination-card-video[data-video-playlist]").forEach((video) => {
    const sources = Array.from(video.querySelectorAll("source"), (source) => source.src);
    let sourceIndex = 0;

    video.addEventListener("ended", () => {
      sourceIndex = (sourceIndex + 1) % sources.length;
      video.src = sources[sourceIndex];
      video.play().catch(() => {});
    });
  });

  destTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.destFilter;
      destTabs.forEach((t) => t.classList.toggle("active", t === tab));
      destCards.forEach((card) => {
        const show = filter === "all" || card.dataset.region === filter;
        card.style.display = show ? "block" : "none";
      });
    });
  });

  const destSlider = document.querySelector("#destinations-slider");
  document.querySelector(".dest-prev")?.addEventListener("click", () => {
    destSlider?.scrollBy({ left: -destSlider.clientWidth * 0.75, behavior: "smooth" });
  });
  document.querySelector(".dest-next")?.addEventListener("click", () => {
    destSlider?.scrollBy({ left: destSlider.clientWidth * 0.75, behavior: "smooth" });
  });
})();
