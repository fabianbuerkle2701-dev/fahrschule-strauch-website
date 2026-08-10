// Fahrschule Viktor Strauch — main.js

function initSite() {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const toTop = document.getElementById("toTop");

  // Mobile nav toggle
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      header.classList.toggle("nav-open");
    });
    header.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => header.classList.remove("nav-open"));
    });
  }

  // Back-to-top visibility + header shadow
  const onScroll = () => {
    const y = window.scrollY;
    if (toTop) toTop.classList.toggle("visible", y > 480);
    if (header) header.style.boxShadow = y > 8 ? "0 4px 20px rgba(0,0,0,0.06)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
