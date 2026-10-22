(() => {
  "use strict";

  const header = document.querySelector("#main-header");
  const runway = document.querySelector("#hero-runway");
  const canvas = document.querySelector("#hero-canvas");
  const video = document.querySelector(".hero-video");
  const context = canvas?.getContext("2d");
  const stages = [...document.querySelectorAll(".hero-stage")];
  const hudStages = [...document.querySelectorAll("[data-hud]")];
  const progressBar = document.querySelector("#stage-progress");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let scrollProgress = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let animationFrame = 0;
  let frameImages = [];
  let usingSequence = false;

  const drawCover = (image) => {
    if (!context || !image?.naturalWidth) return;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const dw = image.naturalWidth * scale;
    const dh = image.naturalHeight * scale;
    const pan = reduceMotion ? 0 : (scrollProgress - .5) * Math.min(canvas.width * .045, dpr * 50);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, (canvas.width - dw) / 2 - pan, (canvas.height - dh) / 2, dw, dh);
  };

  const resizeCanvas = () => {
    if (!canvas || !context) return;
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewportWidth * dpr);
    canvas.height = Math.round(viewportHeight * dpr);
    if (usingSequence) drawCover(frameImages[Math.round(currentFrame)] || frameImages.find(Boolean));
  };

  const renderSequence = () => {
    if (!usingSequence || !frameImages.length) return;
    currentFrame += (targetFrame - currentFrame) * .085;
    const image = frameImages[Math.round(currentFrame)] || frameImages.find(Boolean);
    drawCover(image);
    if (Math.abs(targetFrame - currentFrame) > .12) animationFrame = requestAnimationFrame(renderSequence);
    else animationFrame = 0;
  };

  const updateScroll = () => {
    const rect = runway.getBoundingClientRect();
    const scrollable = Math.max(runway.offsetHeight - viewportHeight, 1);
    scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollable));
    targetFrame = scrollProgress * 239;
    const stageIndex = Math.min(2, Math.floor(scrollProgress * 3));
    stages.forEach((stage, index) => {
      const active = index === stageIndex;
      stage.classList.toggle("active", active);
      stage.setAttribute("aria-hidden", String(!active));
    });
    hudStages.forEach((stage, index) => {
      stage.classList.toggle("is-current", index === stageIndex);
    });
    if (progressBar) progressBar.style.width = `${15 + scrollProgress * 85}%`;
    if (usingSequence && !animationFrame) animationFrame = requestAnimationFrame(renderSequence);
  };

  const loadFrames = async () => {
    const first = new Image();
    first.src = "frames/frame_000.jpg";
    try {
      await new Promise((resolve, reject) => {
        first.onload = resolve;
        first.onerror = reject;
      });
    } catch {
      console.info("Aventis frame sequence is unavailable; using the video background.");
      return;
    }
    usingSequence = true;
    canvas.classList.add("is-ready");
    frameImages[0] = first;
    const loadFrame = (index) => {
      const image = new Image();
      image.src = `frames/frame_${String(index).padStart(3, "0")}.jpg`;
      image.onload = () => {
        frameImages[index] = image;
        if (!animationFrame) animationFrame = requestAnimationFrame(renderSequence);
      };
    };
    for (let index = 8; index < 240; index += 8) loadFrame(index);
    for (let index = 1; index < 30; index += 1) loadFrame(index);
    const loadRemaining = () => {
      for (let index = 1; index < 240; index += 1) {
        if (!frameImages[index] && index % 8 !== 0 && index >= 30) loadFrame(index);
      }
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadRemaining);
    else window.setTimeout(loadRemaining, 1000);
  };

  if (canvas && context && !reduceMotion) {
    resizeCanvas();
    loadFrames();
  } else {
    video?.pause();
  }

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 60);
    updateScroll();
  }, { passive: true });
  window.addEventListener("resize", () => {
    resizeCanvas();
    updateScroll();
  }, { passive: true });
  updateScroll();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

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
  }, { threshold: .5 });
  document.querySelectorAll(".stat-number").forEach((counter) => statObserver.observe(counter));

  document.querySelectorAll(".fleet-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      document.querySelectorAll(".fleet-tab").forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      document.querySelectorAll(".yacht-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  const slider = document.querySelector("#destinations-slider");
  document.querySelector(".dest-prev")?.addEventListener("click", () => slider?.scrollBy({ left: -slider.clientWidth * .72, behavior: "smooth" }));
  document.querySelector(".dest-next")?.addEventListener("click", () => slider?.scrollBy({ left: slider.clientWidth * .72, behavior: "smooth" }));

  const testimonials = [...document.querySelectorAll(".testimonial-slide")];
  const testimonialDots = [...document.querySelectorAll(".testimonial-dot")];
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      testimonials.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      testimonialDots.forEach((item, dotIndex) => {
        const active = dotIndex === index;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  const searchDialog = document.querySelector("#search-modal");
  const bookingDialog = document.querySelector("#booking-modal");
  const storyDialog = document.querySelector("#story-modal");
  const yachtDialog = document.querySelector("#yacht-modal");
  const dialogs = [searchDialog, bookingDialog, storyDialog, yachtDialog].filter(Boolean);
  const openDialog = (dialog) => {
    if (!dialog) return;
    dialogs.forEach((item) => { if (item.open && item !== dialog) item.close(); });
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
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openDialog = [...dialogs].reverse().find((dialog) => dialog.open);
    if (openDialog) {
      event.preventDefault();
      openDialog.close();
    }
  });
  document.querySelector(".search-open")?.addEventListener("click", () => {
    openDialog(searchDialog);
    window.setTimeout(() => document.querySelector("#yacht-search")?.focus(), 0);
  });
  document.querySelectorAll("[data-open-booking]").forEach((button) => button.addEventListener("click", () => {
    if (storyDialog?.open || yachtDialog?.open) {
      storyDialog?.close();
      yachtDialog?.close();
    }
    if (mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      mobileToggle?.setAttribute("aria-expanded", "false");
      mobileToggle?.setAttribute("aria-label", "Open navigation");
    }
    openDialog(bookingDialog);
  }));
  document.querySelectorAll("[data-open-story]").forEach((button) => button.addEventListener("click", () => openDialog(storyDialog)));

  const yachtDetails = {
    meridian: { title: "The Meridian", description: "A refined 50-metre motor yacht with generous entertaining spaces, a dedicated crew of eleven, and room for twelve guests to experience the coast in complete comfort." },
    "ocean-breeze": { title: "Ocean Breeze", description: "A graceful 36-metre sailing yacht for guests who love the rhythm of the wind, thoughtful hospitality, and beautifully unhurried days at sea." },
    "aqua-vida": { title: "Aqua Vida", description: "A versatile 25-metre luxury catamaran designed for easy living, shallow-water discoveries, and relaxed time together for up to ten guests." }
  };
  document.querySelectorAll("[data-yacht]").forEach((button) => {
    button.addEventListener("click", () => {
      const details = yachtDetails[button.dataset.yacht];
      const image = button.querySelector("img");
      if (!details || !image) return;
      document.querySelector("#yacht-title").textContent = details.title;
      document.querySelector("#yacht-modal-description").textContent = details.description;
      const modalImage = document.querySelector("#yacht-modal-image");
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt;
      openDialog(yachtDialog);
    });
  });

  const searchInput = document.querySelector("#yacht-search");
  const searchResult = document.querySelector(".search-result");
  const searchForm = document.querySelector(".search-form");
  const runSearch = (query) => {
    const term = query.trim().toLowerCase();
    if (!term) {
      searchResult.textContent = "Enter a yacht or destination to explore.";
      return;
    }
    const matches = [...document.querySelectorAll(".yacht-card")].filter((card) => card.textContent.toLowerCase().includes(term));
    const destinationMatch = [...document.querySelectorAll(".destination-card")].some((card) => card.textContent.toLowerCase().includes(term));
    searchResult.textContent = matches.length
      ? `${matches.map((card) => card.querySelector("h3").textContent).join(", ")} ${matches.length === 1 ? "is" : "are"} in our featured fleet.`
      : destinationMatch
        ? "Explore this destination in our featured destinations."
        : "A charter broker can help find the right yacht or destination.";
  };
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(searchInput?.value || "");
  });
  document.querySelectorAll(".search-chips button").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (searchInput) searchInput.value = chip.textContent;
      runSearch(chip.textContent);
    });
  });

  document.querySelectorAll(".booking-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (!form.reportValidity()) return;
      if (status) status.textContent = "Your inquiry is ready. Connect a booking service to send it to our charter team.";
    });
  });
  document.querySelector(".newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.nextElementSibling;
    if (!form.reportValidity()) return;
    if (status) status.textContent = "Thank you. Newsletter signup is not connected in this preview.";
  });

  const mobileToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  mobileToggle?.addEventListener("click", () => {
    const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!expanded));
    mobileToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    mobileNav.hidden = expanded;
  });
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mobileNav.hidden = true;
    mobileToggle?.setAttribute("aria-expanded", "false");
    mobileToggle?.setAttribute("aria-label", "Open navigation");
  }));

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
      ringX += (mouseX - ringX) * .15;
      ringY += (mouseY - ringY) * .15;
      ring.style.transform = `translate(${ringX - ring.offsetWidth / 2}px,${ringY - ring.offsetHeight / 2}px)`;
      requestAnimationFrame(moveRing);
    };
    moveRing();
    document.querySelectorAll("a, button, .destination-card").forEach((element) => {
      element.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      element.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  }
})();
