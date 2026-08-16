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

  // Hintergrundvideo im Hero: mehrere Clips nacheinander.
  // Der automatische Start scheitert je nach Browser, wenn beim Versuch
  // noch zu wenig gepuffert ist, deshalb wird nachgestartet. Wer
  // reduzierte Bewegung eingestellt hat, bekommt nur das Standbild.
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    var magBewegung = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!magBewegung) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    } else {
      var clips = (heroVideo.dataset.clips || "").split(",").filter(Boolean);
      var index = 0;

      var starte = function () {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      };

      // Naechsten Clip im Voraus laden, damit der Wechsel nicht stockt
      var laadeVor = function () {
        if (clips.length < 2) return;
        var naechster = clips[(index + 1) % clips.length];
        var l = document.createElement("link");
        l.rel = "prefetch";
        l.as = "video";
        l.href = naechster;
        document.head.appendChild(l);
      };

      var wechsle = function () {
        index = (index + 1) % clips.length;
        heroVideo.src = clips[index];
        heroVideo.load();
        laadeVor();
      };

      if (clips.length > 1) {
        heroVideo.removeAttribute("loop");
        heroVideo.addEventListener("ended", wechsle);
        // Laesst sich ein Clip nicht laden, wird er uebersprungen
        heroVideo.addEventListener("error", function () {
          if (clips.length > 1) wechsle();
        });
      }

      // Ohne once: greift auch nach jedem Clipwechsel, sonst bliebe
      // das Video stehen, wenn play() direkt nach load() zu frueh kommt
      heroVideo.addEventListener("loadeddata", starte);
      heroVideo.addEventListener("canplay", starte);
      heroVideo.addEventListener("canplaythrough", laadeVor, { once: true });
      if (heroVideo.readyState >= 2) starte();

      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && heroVideo.paused) starte();
      });
    }
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
