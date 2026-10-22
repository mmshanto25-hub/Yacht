/**
 * ==========================================================================
 * AVENTIS GLOBAL JAVASCRIPT
 * Handles header scrolling, mobile navigation, custom cursor, modals & reveals.
 * ==========================================================================
 */
(() => {
  "use strict";

  // Header scroll state
  const header = document.querySelector("#main-header");
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Mobile Navigation
  const mobileToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");

  mobileToggle?.addEventListener("click", () => {
    const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!expanded));
    mobileToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    mobileNav.hidden = expanded;
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      mobileToggle?.setAttribute("aria-expanded", "false");
      mobileToggle?.setAttribute("aria-label", "Open navigation");
    });
  });

  // Reveal Animation on Scroll
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Animated Numbers Counter
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / 1800, 1);
        const eased = 1 - (1 - progress) ** 3;
        counter.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-number").forEach((c) => statObserver.observe(c));

  // Shared Dialogs (Search, Booking, Story)
  const searchDialog = document.querySelector("#search-modal");
  const bookingDialog = document.querySelector("#booking-modal");
  const storyDialog = document.querySelector("#story-modal");
  const yachtDialog = document.querySelector("#yacht-modal");
  const dialogs = [searchDialog, bookingDialog, storyDialog, yachtDialog].filter(Boolean);

  window.openAventisDialog = (dialog) => {
    if (!dialog) return;
    dialogs.forEach((item) => {
      if (item.open && item !== dialog) item.close();
    });
    dialog.showModal();
    document.body.classList.add("dialog-open");
  };

  dialogs.forEach((dialog) => {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener("close", () => {
      if (!dialogs.some((item) => item.open)) document.body.classList.remove("dialog-open");
      if (dialog === yachtDialog) {
        const modalVideo = document.querySelector("#yacht-modal-video");
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.muted = true;
        }
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openD = [...dialogs].reverse().find((d) => d.open);
    if (openD) {
      event.preventDefault();
      openD.close();
    }
  });

  document.querySelector(".search-open")?.addEventListener("click", () => {
    window.openAventisDialog(searchDialog);
    window.setTimeout(() => document.querySelector("#yacht-search")?.focus(), 50);
  });

  document.querySelectorAll("[data-open-booking]").forEach((button) => {
    button.addEventListener("click", () => {
      storyDialog?.close();
      yachtDialog?.close();
      if (mobileNav && !mobileNav.hidden) {
        mobileNav.hidden = true;
        mobileToggle?.setAttribute("aria-expanded", "false");
      }
      window.openAventisDialog(bookingDialog);
    });
  });

  document.querySelectorAll("[data-open-story]").forEach((button) => {
    button.addEventListener("click", () => window.openAventisDialog(storyDialog));
  });

  // Forms handling
  document.querySelectorAll(".booking-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (!form.reportValidity()) return;
      if (status) {
        status.innerHTML = "✓ Your priority charter inquiry has been prepared. A senior broker will review availability.";
        status.style.color = "#2dd4bf";
      }
    });
  });

  document.querySelector(".newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.nextElementSibling;
    if (!form.reportValidity()) return;
    if (status) {
      status.textContent = "Thank you. You have been added to The Aventis Nautical Gazette.";
      status.style.color = "#2dd4bf";
    }
  });

  // Custom Cursor
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(pointer: fine) and (min-width: 993px)").matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX - 2.5}px,${mouseY - 2.5}px)`;
    }, { passive: true });

    const moveRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX - ring.offsetWidth / 2}px,${ringY - ring.offsetHeight / 2}px)`;
      requestAnimationFrame(moveRing);
    };
    moveRing();

    document.querySelectorAll("a, button, select, input, .destination-card, .yacht-card").forEach((element) => {
      element.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      element.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }
})();

