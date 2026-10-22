/**
 * ==========================================================================
 * AVENTIS CONTACT & BROKERAGE HUB MODULE
 * Real-time world clocks for global offices and testimonial rotation.
 * ==========================================================================
 */
(() => {
  "use strict";

  // Real-time world clocks for the 4 global offices
  const updateOfficeTimes = () => {
    document.querySelectorAll(".office-time").forEach((el) => {
      const tz = el.dataset.tz;
      if (!tz) return;
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }).format(new Date());
        const clockEl = el.querySelector(".tz-clock");
        if (clockEl) clockEl.textContent = timeStr;
      } catch {
        // Fallback
      }
    });
  };
  updateOfficeTimes();
  setInterval(updateOfficeTimes, 60000);

  // Testimonials Slider
  const testimonials = [...document.querySelectorAll(".testimonial-slide")];
  const testimonialDots = [...document.querySelectorAll(".testimonial-dot")];

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      testimonials.forEach((slide, sIndex) => {
        const active = sIndex === index;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      testimonialDots.forEach((d, dIndex) => {
        const active = dIndex === index;
        d.classList.toggle("active", active);
        d.setAttribute("aria-pressed", String(active));
      });
    });
  });
})();

