/**
 * ==========================================================================
 * AVENTIS FLEET DATABASE & INTERACTION LOGIC
 * Manages yacht specifications, video details modal, filters, and booking hooks.
 * ==========================================================================
 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const yachtDetails = {
    kismet: {
      title: "KISMET",
      builder: "Lürssen Yachts • Exterior by Reymond Langton",
      category: "Mega Yacht (122M / 400FT)",
      videoSrc: "Public/_150M%20KISMET%20Mega%20Yacht%20by%20Lurssen%20Yachts%20_%20Luxury%20Mega%20Yacht%20for%20Charter%20_%20Mania%20Luxury(1080P_HD).mp4",
      description: "The undisputed crown jewel of world superyachts. Engineered in Germany by Lürssen, KISMET showcases a multi-level wellness hammam, certified commercial helipad, outdoor deck cinema, and underwater Nemo lounge for submarine viewing.",
      specs: [
        { label: "Length", value: "122m / 400ft" },
        { label: "Beam", value: "17.8m / 58ft" },
        { label: "Guests", value: "12 Guests" },
        { label: "Staterooms", value: "9 Suites" },
        { label: "Crew", value: "36 Elite Crew" },
        { label: "Max Speed", value: "18.5 Knots" }
      ],
      features: ["Certified Helipad", "Multi-Level Hammam Spa", "Underwater Viewing Lounge", "Outdoor Cinema", "Submersible Tender", "Beach Club Jacuzzi"],
      rate: "From $3,000,000 / week + expenses",
      formValue: "KISMET (400 FT / 122M Mega Yacht)"
    },
    lana: {
      title: "LANA",
      builder: "Benetti Yachts • Imperial Yachts Management",
      category: "Mega Yacht (107M / 351FT)",
      videoSrc: "Public/Inside%20LANA%20_%20107m%20Benetti%20Luxury%20Superyacht%20Tour(1080P_HD).mp4",
      description: "A monumental 107-metre Italian masterpiece by Benetti. Features soaring 2.7-metre ceiling heights, a grand piano salon, heated sundeck swimming pool, luxury hammam, and fold-down ocean platforms for direct sea access.",
      specs: [
        { label: "Length", value: "107m / 351ft" },
        { label: "Beam", value: "15.2m / 50ft" },
        { label: "Guests", value: "12 Guests" },
        { label: "Staterooms", value: "8 Suites" },
        { label: "Crew", value: "33 Crew" },
        { label: "Cruising Speed", value: "16 Knots" }
      ],
      features: ["Sundeck Swimming Pool", "Grand Piano Salon", "Full Turkish Hammam", "Fold-down Sea Terraces", "Massage Suite", "Helicopter Touch-and-Go"],
      rate: "From $1,900,000 / week + expenses",
      formValue: "LANA (351 FT / 107M Mega Yacht)"
    },
    energy: {
      title: "ENERGY",
      builder: "Amels • Exterior by Espen Øino",
      category: "Superyacht (78M / 255FT)",
      videoSrc: "Public/ENERGY%20_%2077.80M_255_2___%20Amels%20-%20Yacht%20for%20Sale(1080P_HD).mp4",
      description: "Dutch shipbuilding perfection designed by Espen Øino. ENERGY boasts a private owner's deck with jacuzzi, wellness sauna and gym, touch-and-go helipad, and silent hybrid propulsion for tranquil passages across the globe.",
      specs: [
        { label: "Length", value: "77.8m / 255ft" },
        { label: "Beam", value: "12.5m / 41ft" },
        { label: "Guests", value: "12 Guests" },
        { label: "Staterooms", value: "7 Staterooms" },
        { label: "Crew", value: "27 Crew" },
        { label: "Cruising Speed", value: "14 Knots" }
      ],
      features: ["Private Owner's Deck", "Nordic Sauna & Gym", "Hybrid Electric Cruising", "Touch-and-Go Helipad", "Custom Tender Garage", "Stern Beach Club"],
      rate: "From $1,150,000 / week + expenses",
      formValue: "ENERGY (255 FT / 78M Superyacht)"
    },
    onyx: {
      title: "M/Y ONYX",
      builder: "Riva 110' Dolcevita • Ferretti Group",
      category: "Motor Yacht (110FT / 33.5M)",
      videoSrc: "Public/M_Y%20ONYX%20-%20110_%20Riva%20Dolcevita%20Yacht%20For%20Sale(1080P_HD).mp4",
      description: "The flagship of Italian Riva styling. Floor-to-ceiling panoramic glass windows, expansive flybridge bar and jacuzzi, Williams jet tenders, and exhilarating 26-knot sprint capability along the French and Italian Rivieras.",
      specs: [
        { label: "Length", value: "33.5m / 110ft" },
        { label: "Beam", value: "7.27m / 24ft" },
        { label: "Guests", value: "10 Guests" },
        { label: "Cabins", value: "5 Cabins" },
        { label: "Crew", value: "5 Crew" },
        { label: "Top Speed", value: "26 Knots" }
      ],
      features: ["Panoramic Glass Salon", "Flybridge Wet Bar & Grill", "Williams 505 Jet Tender", "Seabob F5S Scooters", "Hydraulic Submersible Platform", "Zero-Speed Stabilizers"],
      rate: "From $145,000 / week + expenses",
      formValue: "M/Y ONYX (110 FT Riva Dolcevita)"
    },
    "sunseeker-88": {
      title: "Sunseeker 88 Yacht",
      builder: "Sunseeker International UK",
      category: "Motor Yacht (88FT / 27M)",
      videoSrc: "Public/Sunseeker%2088%20Yacht(1080P_HD).mp4",
      description: "Combines British high performance with the acclaimed X-TEND transformable sunbed beach club, full-beam owner stateroom, shaded flybridge dining for ten, and sublime shallow-draft island access.",
      specs: [
        { label: "Length", value: "26.4m / 88ft" },
        { label: "Beam", value: "6.47m / 21ft" },
        { label: "Guests", value: "8 Guests" },
        { label: "Cabins", value: "4 Cabins" },
        { label: "Crew", value: "4 Crew" },
        { label: "Top Speed", value: "28 Knots" }
      ],
      features: ["X-TEND Beach Club", "Full-Beam Master Suite", "Hardtop Flybridge Bar", "Alfresco Dining for 10", "Williams Sportjet 435", "Sleipner Stabilizers"],
      rate: "From $95,000 / week + expenses",
      formValue: "Sunseeker 88 Yacht"
    },
    "sunseeker-76": {
      title: "Sunseeker 76 Yacht",
      builder: "Sunseeker International UK",
      category: "Motor Yacht (76FT / 23.6M)",
      videoSrc: "Public/Sunseeker%2076%202024%20_%20Lafortune%20Yachts%281080P_60FPS%29.mp4",
      description: "Peerless 32-knot sports yacht boasting 360-degree salon glass, an immense flybridge, forward sun lounge with integrated cool box, and remarkable speed for island-hopping between secluded coves.",
      specs: [
        { label: "Length", value: "23.6m / 76ft" },
        { label: "Beam", value: "5.95m / 19.5ft" },
        { label: "Guests", value: "8 Guests" },
        { label: "Cabins", value: "4 Cabins" },
        { label: "Crew", value: "3 Crew" },
        { label: "Top Speed", value: "32 Knots" }
      ],
      features: ["32-Knot Sprint Speed", "Foredeck Sunbathing Lounge", "Flybridge Wet Bar", "Hydraulic Swim Platform", "Fliteboard & Seabob", "Fin Stabilizers"],
      rate: "From $75,000 / week + expenses",
      formValue: "Sunseeker 76 Yacht"
    },
    rivamare: {
      title: "Riva Rivamare",
      builder: "Riva • Ferretti Group Italy",
      category: "Day Cruiser / Chase Yacht (39FT / 11.9M)",
      videoSrc: "Public/Luxury%20Yacht%20-%20Riva%20Rivamare%20-%20Ferretti%20Group%281080P_HD%29.mp4",
      description: "The timeless icon of Italian marine glamour. Handcrafted double mahogany foredeck, fold-down beach platform with integrated loungers, champagne bar, and twin Volvo Penta engines for romantic sunset passages.",
      specs: [
        { label: "Length", value: "11.88m / 39ft" },
        { label: "Beam", value: "3.5m / 11.5ft" },
        { label: "Day Guests", value: "6 Guests" },
        { label: "Cabins", value: "1 Suite" },
        { label: "Crew", value: "Captain & Steward" },
        { label: "Top Speed", value: "40 Knots" }
      ],
      features: ["Mahogany Deck Inlay", "Fold-Down Beach Platform", "Chilled Champagne Cellar", "Seakeeper Gyro Stabilizer", "En-suite Master Cabin", "Day Charter Available"],
      rate: "From $28,000 / week (Day rates available)",
      formValue: "Riva Rivamare (39 FT Day Cruiser)"
    }
  };

  window.yachtDetailsDatabase = yachtDetails;
  let activeModalYacht = null;

  const openYachtModal = (yachtKey) => {
    const details = yachtDetails[yachtKey];
    if (!details) return;
    activeModalYacht = details;

    const titleEl = document.querySelector("#yacht-title");
    const builderEl = document.querySelector("#yacht-modal-builder");
    const catEl = document.querySelector("#yacht-modal-category");
    const descEl = document.querySelector("#yacht-modal-description");
    const rateEl = document.querySelector("#yacht-modal-rate");

    if (titleEl) titleEl.textContent = details.title;
    if (builderEl) builderEl.textContent = details.builder;
    if (catEl) catEl.textContent = details.category;
    if (descEl) descEl.textContent = details.description;
    if (rateEl) rateEl.textContent = details.rate;

    const specsContainer = document.querySelector("#yacht-modal-specs");
    if (specsContainer) {
      specsContainer.innerHTML = details.specs.map((s) => `
        <div class="modal-spec-item">
          <span class="modal-spec-label">${s.label}</span>
          <span class="modal-spec-val">${s.value}</span>
        </div>
      `).join("");
    }

    const featContainer = document.querySelector("#yacht-modal-features");
    if (featContainer) {
      featContainer.innerHTML = details.features.map((f) => `<span>${f}</span>`).join("");
    }

    const modalVideo = document.querySelector("#yacht-modal-video");
    if (modalVideo) {
      modalVideo.src = details.videoSrc;
      modalVideo.muted = true;
      modalVideo.play().catch(() => {});
    }

    const soundBtn = document.querySelector("#yacht-modal-sound-btn");
    if (soundBtn) soundBtn.textContent = "Unmute Tour Audio 🔊";

    const yachtDialog = document.querySelector("#yacht-modal");
    if (yachtDialog && window.openAventisDialog) {
      window.openAventisDialog(yachtDialog);
    }
  };

  document.querySelectorAll("[data-yacht]").forEach((btn) => {
    btn.addEventListener("click", () => openYachtModal(btn.dataset.yacht));
  });

  // Modal Audio Toggle
  document.querySelector("#yacht-modal-sound-btn")?.addEventListener("click", () => {
    const modalVideo = document.querySelector("#yacht-modal-video");
    const soundBtn = document.querySelector("#yacht-modal-sound-btn");
    if (!modalVideo || !soundBtn) return;

    if (modalVideo.muted) {
      if (window.muteAllVideosExcept) window.muteAllVideosExcept(modalVideo);
      modalVideo.muted = false;
      soundBtn.textContent = "Mute Tour Audio 🔇";
    } else {
      modalVideo.muted = true;
      soundBtn.textContent = "Unmute Tour Audio 🔊";
    }
  });

  // Modal Book Button
  document.querySelector("#yacht-modal-book-btn")?.addEventListener("click", () => {
    if (!activeModalYacht) return;
    document.querySelector("#yacht-modal")?.close();

    const bookingSelect = document.querySelector("#booking-yacht-select");
    if (bookingSelect) {
      for (let i = 0; i < bookingSelect.options.length; i++) {
        if (bookingSelect.options[i].value.includes(activeModalYacht.title)) {
          bookingSelect.selectedIndex = i;
          break;
        }
      }
    }
    const bookingDialog = document.querySelector("#booking-modal");
    if (bookingDialog && window.openAventisDialog) window.openAventisDialog(bookingDialog);
  });

  // Direct Card Book Button
  document.querySelectorAll("[data-book-yacht]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const yachtName = btn.dataset.bookYacht;
      const bookingSelect = document.querySelector("#booking-yacht-select");
      if (bookingSelect) {
        for (let i = 0; i < bookingSelect.options.length; i++) {
          if (bookingSelect.options[i].value.includes(yachtName)) {
            bookingSelect.selectedIndex = i;
            break;
          }
        }
      }
      const bookingDialog = document.querySelector("#booking-modal");
      if (bookingDialog && window.openAventisDialog) window.openAventisDialog(bookingDialog);
    });
  });

  // Fleet Filtering
  const fleetTabs = document.querySelectorAll(".fleet-tab");
  const yachtCards = document.querySelectorAll(".yacht-card");

  const filterFleet = (category) => {
    fleetTabs.forEach((tab) => {
      const active = tab.dataset.filter === category;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    yachtCards.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      card.hidden = !match;
      if (match) {
        const video = card.querySelector("video");
        if (video && video.paused && !reduceMotion) video.play().catch(() => {});
      }
    });
  };

  fleetTabs.forEach((tab) => {
    tab.addEventListener("click", () => filterFleet(tab.dataset.filter));
  });

  document.querySelectorAll("[data-filter-link]").forEach((link) => {
    link.addEventListener("click", () => filterFleet(link.dataset.filterLink));
  });

  // Search in Fleet
  const searchInput = document.querySelector("#yacht-search");
  const searchResult = document.querySelector(".search-result");
  const searchForm = document.querySelector(".search-form");

  const runSearch = (query) => {
    const term = query.trim().toLowerCase();
    if (!term) {
      if (searchResult) searchResult.textContent = "Enter a yacht or destination to explore.";
      return;
    }
    const matched = Object.entries(yachtDetails).filter(([key, val]) => {
      return val.title.toLowerCase().includes(term) ||
             val.builder.toLowerCase().includes(term) ||
             val.category.toLowerCase().includes(term) ||
             val.description.toLowerCase().includes(term);
    });

    if (searchResult) {
      if (matched.length > 0) {
        searchResult.innerHTML = `Found ${matched.length} yacht(s): <strong>${matched.map(([, y]) => y.title).join(", ")}</strong>. <a href="fleet.html" style="color:var(--gold-light);text-decoration:underline;margin-left:8px;">View in Fleet ↗</a>`;
      } else {
        searchResult.textContent = "No direct yacht match found. Our senior charter brokers can source this vessel or destination.";
      }
    }
  };

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(searchInput?.value || "");
  });

  document.querySelectorAll(".search-chips button").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (searchInput) searchInput.value = chip.textContent;
      runSearch(chip.textContent);
    });
  });
})();

