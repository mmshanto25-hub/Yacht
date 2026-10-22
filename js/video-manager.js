/**
 * ==========================================================================
 * AVENTIS VIDEO & AUDIO MANAGER
 * Autoplay reliability, exclusive audio control, and intersection observers.
 * ==========================================================================
 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const allAutoplayVideos = document.querySelectorAll("video[autoplay]");

  const initAutoplay = (video) => {
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  };

  allAutoplayVideos.forEach(initAutoplay);

  const unlockAutoplay = () => {
    allAutoplayVideos.forEach((video) => {
      if (video.paused && !reduceMotion) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  };
  ["click", "touchstart", "scroll", "keydown"].forEach((evt) => {
    window.addEventListener(evt, unlockAutoplay, { once: true, passive: true });
  });

  // IntersectionObserver to optimize CPU/battery usage
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused && !reduceMotion) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.closest("dialog")) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.15 });

    allAutoplayVideos.forEach((video) => videoObserver.observe(video));
  }

  // Audio Exclusivity helper
  window.muteAllVideosExcept = (targetVideo) => {
    document.querySelectorAll("video").forEach((v) => {
      if (v !== targetVideo) {
        v.muted = true;
      }
    });
    document.querySelectorAll(".card-sound-toggle").forEach((btn) => {
      const card = btn.closest(".yacht-card");
      const v = card?.querySelector("video");
      if (v !== targetVideo) {
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("title", "Unmute");
      }
    });
    const expVideo = document.querySelector(".experience-video");
    const expToggle = document.querySelector(".experience-sound-toggle");
    if (expVideo && expVideo !== targetVideo) {
      expVideo.muted = true;
      expToggle?.setAttribute("aria-pressed", "false");
      const span = expToggle?.querySelector("span");
      if (span) span.textContent = "Sound off";
    }
  };

  // Card sound toggles
  document.querySelectorAll(".card-sound-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".yacht-card");
      const video = card?.querySelector("video");
      if (!video) return;

      const willUnmute = video.muted;
      if (willUnmute) {
        window.muteAllVideosExcept(video);
        video.muted = false;
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("title", "Mute");
        if (video.paused) video.play().catch(() => {});
      } else {
        video.muted = true;
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("title", "Unmute");
      }
    });
  });

  // Experience video sound toggle
  const experienceVideo = document.querySelector(".experience-video");
  const soundToggle = document.querySelector(".experience-sound-toggle");
  soundToggle?.addEventListener("click", async () => {
    if (!experienceVideo) return;
    const willUnmute = experienceVideo.muted;
    if (willUnmute) {
      window.muteAllVideosExcept(experienceVideo);
      experienceVideo.muted = false;
      soundToggle.setAttribute("aria-pressed", "true");
      soundToggle.querySelector("span").textContent = "Sound on";
      if (experienceVideo.paused) {
        try {
          await experienceVideo.play();
        } catch {
          experienceVideo.muted = true;
          soundToggle.setAttribute("aria-pressed", "false");
          soundToggle.querySelector("span").textContent = "Sound off";
        }
      }
    } else {
      experienceVideo.muted = true;
      soundToggle.setAttribute("aria-pressed", "false");
      soundToggle.querySelector("span").textContent = "Sound off";
    }
  });
})();

