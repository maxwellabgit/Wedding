// Gallery — single source of truth. Prefer config; fallback to existing DOM images.
const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");
const dotsContainer = document.querySelector(".carousel-dots");

let PHOTOS = [];
let currentIndex = 0;
let images = [];

function buildGallery() {
  if (!track) return;
  const fromConfig = Array.isArray(window.GALLERY_IMAGES) && window.GALLERY_IMAGES.length > 0;
  if (fromConfig) {
    PHOTOS = [...window.GALLERY_IMAGES];
    track.innerHTML = "";
    images = [];
    PHOTOS.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Rasmi & Max";
      img.className = "gallery-img";
      img.dataset.index = String(i);
      track.appendChild(img);
      images.push(img);
    });
  } else {
    images = Array.from(track.querySelectorAll(".gallery-img"));
    PHOTOS = images.map((img) => img.src || img.getAttribute("src")).filter(Boolean);
    images.forEach((img, i) => {
      img.dataset.index = String(i);
    });
  }
}

function getCount() {
  return images.length;
}

function clampIndex(i) {
  const n = getCount();
  if (n <= 0) return 0;
  return Math.max(0, Math.min(n - 1, i));
}

function updateCarousel() {
  currentIndex = clampIndex(currentIndex);
  const img = images[currentIndex];
  if (img) img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  const n = getCount();
  for (let i = 0; i < n; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  }
}

function initCarousel() {
  buildGallery();
  createDots();
  const n = getCount();
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = clampIndex(currentIndex - 1);
      updateCarousel();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = clampIndex(currentIndex + 1);
      updateCarousel();
    });
  }
  if (n > 0) updateCarousel();
}

initCarousel();

// Drag carousel — mouse and touch
let dragStartX = 0;
let scrollStartX = 0;
let isDragging = false;
let justDragged = false;
const DRAG_THRESHOLD = 5;

function onDragStart(e) {
  if (!track) return;
  isDragging = false;
  const x = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
  dragStartX = x;
  scrollStartX = track.scrollLeft;
  if (e.type.startsWith("touch")) {
    track.addEventListener("touchmove", onDragMove, { passive: false });
    track.addEventListener("touchend", onDragEndTouch, { once: true });
  } else {
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd, { once: true });
  }
}

function onDragEndTouch() {
  track.removeEventListener("touchmove", onDragMove);
  if (isDragging) justDragged = true;
  syncCurrentIndexFromScroll();
  if (isDragging) setTimeout(() => { justDragged = false; }, 50);
}

function onDragMove(e) {
  const x = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
  const dx = dragStartX - x;
  if (!isDragging && Math.abs(dx) > DRAG_THRESHOLD) isDragging = true;
  if (isDragging && e.cancelable) e.preventDefault();
  track.scrollLeft = scrollStartX + dx;
}

function onDragEnd() {
  document.removeEventListener("mousemove", onDragMove);
  if (isDragging) justDragged = true;
  syncCurrentIndexFromScroll();
  if (isDragging) setTimeout(() => { justDragged = false; }, 50);
}

function syncCurrentIndexFromScroll() {
  if (!track || images.length === 0) return;
  const trackRect = track.getBoundingClientRect();
  const centerX = trackRect.left + trackRect.width / 2;
  let closest = 0;
  let minDist = Infinity;
  images.forEach((img, i) => {
    const r = img.getBoundingClientRect();
    const imgCenter = r.left + r.width / 2;
    const d = Math.abs(centerX - imgCenter);
    if (d < minDist) {
      minDist = d;
      closest = i;
    }
  });
  currentIndex = closest;
  document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

if (track) {
  track.addEventListener("mousedown", onDragStart);
  track.addEventListener("touchstart", onDragStart, { passive: true });
  track.addEventListener("scroll", () => {
    if (!isDragging) syncCurrentIndexFromScroll();
  }, { passive: true });
}

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

function openLightbox(index) {
  currentIndex = clampIndex(index);
  if (lightboxImg && PHOTOS[currentIndex]) {
    lightboxImg.src = PHOTOS[currentIndex];
    lightboxImg.alt = "Rasmi & Max";
  }
  if (lightbox) {
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function lightboxPrevPhoto() {
  const n = getCount();
  if (n <= 0) return;
  currentIndex = (currentIndex - 1 + n) % n;
  if (lightboxImg && PHOTOS[currentIndex]) lightboxImg.src = PHOTOS[currentIndex];
}

function lightboxNextPhoto() {
  const n = getCount();
  if (n <= 0) return;
  currentIndex = (currentIndex + 1) % n;
  if (lightboxImg && PHOTOS[currentIndex]) lightboxImg.src = PHOTOS[currentIndex];
}

if (track) {
  track.addEventListener("click", (e) => {
    if (justDragged) return;
    const img = e.target.closest(".gallery-img");
    if (!img) return;
    const i = parseInt(img.dataset.index, 10);
    if (!Number.isNaN(i)) openLightbox(i);
  });
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener("click", lightboxPrevPhoto);
if (lightboxNext) lightboxNext.addEventListener("click", lightboxNextPhoto);

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxPrevPhoto();
  if (e.key === "ArrowRight") lightboxNextPhoto();
});

// RSVP — Supabase
const rsvpForm = document.getElementById("rsvp-form");
const rsvpStatus = document.getElementById("rsvp-status");
const rsvpSubmit = document.getElementById("rsvp-submit");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const config = window.SUPABASE_CONFIG;
    const apiKey = config?.publishableKey || config?.anonKey;
    if (!config?.url || !apiKey || config.url.includes("YOUR_") || apiKey.includes("YOUR_")) {
      rsvpStatus.textContent = "RSVP is not configured yet. Please add your Supabase keys to config.js";
      rsvpStatus.className = "rsvp-status rsvp-error";
      return;
    }

    rsvpSubmit.disabled = true;
    rsvpStatus.textContent = "Submitting...";
    rsvpStatus.className = "rsvp-status";

    const formData = new FormData(rsvpForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      attending: formData.get("attending"),
      message: formData.get("message") || null,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${config.url}/rest/v1/${config.tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      rsvpStatus.textContent = "Thank you! Your RSVP has been received.";
      rsvpStatus.className = "rsvp-status rsvp-success";
      rsvpForm.reset();
    } catch (err) {
      rsvpStatus.textContent = "Something went wrong. Please try again or email us directly.";
      rsvpStatus.className = "rsvp-status rsvp-error";
      console.error("RSVP error:", err);
    } finally {
      rsvpSubmit.disabled = false;
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
