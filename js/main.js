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

  // Scroll progress bar
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  // Back-to-top visibility + header shadow + progress
  const onScroll = () => {
    const y = window.scrollY;
    if (toTop) toTop.classList.toggle("visible", y > 480);
    if (header) header.style.boxShadow = y > 8 ? "0 4px 20px rgba(0,0,0,0.06)" : "none";
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Theme toggle (hell/dunkel), Auswahl wird gespeichert
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Countdown bis zum nächsten Kursstart
  const countdown = document.getElementById("courseCountdown");
  if (countdown && countdown.dataset.date) {
    const start = new Date(countdown.dataset.date + "T00:00:00");
    const days = Math.ceil((start - new Date()) / 86400000);
    if (days > 1) {
      countdown.textContent = countdown.dataset.labelDays.replace("%d", days);
    } else if (days >= 0) {
      countdown.textContent = countdown.dataset.labelSoon;
    } else {
      countdown.remove();
    }
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
