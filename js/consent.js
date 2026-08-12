/* =========================================================
   Datenschutzhinweis der Fahrschule Viktor Strauch

   Die Seite laedt von sich aus nichts von Dritten:
   Schriften liegen lokal, der Assistent arbeitet im Browser.
   Zustimmungspflichtig ist allein die eingebettete Karte,
   weil dabei die IP-Adresse an OpenStreetMap uebertragen wird.
   Genau das steuert dieser Hinweis.
   ========================================================= */
(function () {
  "use strict";

  var KEY = "fs-consent";
  var VERSION = 1;

  var T = {
    de: {
      title: "Datenschutz",
      body: "Diese Seite kommt ohne Werbe- und Analysedienste aus. Wir speichern nur, welches Farbschema du gewählt hast. Für die Anfahrtskarte binden wir OpenStreetMap ein, dabei wird deine IP-Adresse an diesen Dienst übertragen.",
      question: "Karte laden?",
      accept: "Karte erlauben",
      decline: "Nur Notwendiges",
      more: "Datenschutzerklärung",
      mapTitle: "Karte von OpenStreetMap",
      mapNote: "Beim Laden wird deine IP-Adresse an OpenStreetMap übertragen.",
      mapLoad: "Karte laden",
      mapAlways: "Immer erlauben",
      settings: "Datenschutz",
      saved: "Deine Auswahl wurde gespeichert.",
      revoke: "Auswahl ändern"
    },
    en: {
      title: "Privacy",
      body: "This site runs without advertising or analytics services. We only remember which colour scheme you picked. For the map we embed OpenStreetMap, which transmits your IP address to that service.",
      question: "Load the map?",
      accept: "Allow map",
      decline: "Essentials only",
      more: "Privacy policy",
      mapTitle: "Map by OpenStreetMap",
      mapNote: "Loading transmits your IP address to OpenStreetMap.",
      mapLoad: "Load map",
      mapAlways: "Always allow",
      settings: "Privacy",
      saved: "Your choice has been saved.",
      revoke: "Change choice"
    },
    ru: {
      title: "Конфиденциальность",
      body: "Сайт работает без рекламных и аналитических сервисов. Мы запоминаем только выбранную вами цветовую схему. Для карты проезда используется OpenStreetMap, при этом ваш IP-адрес передаётся этому сервису.",
      question: "Загрузить карту?",
      accept: "Разрешить карту",
      decline: "Только необходимое",
      more: "Политика конфиденциальности",
      mapTitle: "Карта OpenStreetMap",
      mapNote: "При загрузке ваш IP-адрес передаётся в OpenStreetMap.",
      mapLoad: "Загрузить карту",
      mapAlways: "Разрешить всегда",
      settings: "Конфиденциальность",
      saved: "Ваш выбор сохранён.",
      revoke: "Изменить выбор"
    }
  };

  function lang() {
    var l = (document.documentElement.lang || "de").slice(0, 2).toLowerCase();
    return T[l] ? l : "de";
  }
  var t = T[lang()];

  function privacyHref() {
    return "datenschutz.html";
  }

  /* ---------- Gespeicherte Auswahl ---------- */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      return v && v.v === VERSION ? v : null;
    } catch (e) { return null; }
  }
  function save(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: VERSION, map: !!map, ts: Date.now() }));
    } catch (e) {}
  }

  /* ---------- Karte ---------- */
  function mapSlots() {
    return Array.prototype.slice.call(document.querySelectorAll(".map-embed[data-map-src]"));
  }

  function loadMaps() {
    mapSlots().forEach(function (slot) {
      if (slot.dataset.loaded === "1") return;
      var f = document.createElement("iframe");
      f.src = slot.dataset.mapSrc;
      f.title = slot.dataset.mapTitle || t.mapTitle;
      f.loading = "lazy";
      f.setAttribute("referrerpolicy", "no-referrer");
      slot.textContent = "";
      slot.appendChild(f);
      slot.dataset.loaded = "1";
    });
  }

  function renderPlaceholders() {
    mapSlots().forEach(function (slot) {
      if (slot.dataset.loaded === "1") return;
      slot.textContent = "";
      var box = document.createElement("div");
      box.className = "map-hold";
      box.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
        '<path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
        '<p class="map-hold-note"></p>';
      box.querySelector(".map-hold-note").textContent = t.mapNote;

      var row = document.createElement("div");
      row.className = "map-hold-actions";

      var once = document.createElement("button");
      once.type = "button";
      once.className = "btn btn-primary btn-sm";
      once.textContent = t.mapLoad;
      once.addEventListener("click", function () {
        slot.dataset.loaded = "0";
        loadMaps();
      });

      var always = document.createElement("button");
      always.type = "button";
      always.className = "btn btn-ghost btn-sm";
      always.textContent = t.mapAlways;
      always.addEventListener("click", function () {
        save(true);
        loadMaps();
        hideBanner();
      });

      row.appendChild(once);
      row.appendChild(always);
      box.appendChild(row);
      slot.appendChild(box);
    });
  }

  /* ---------- Banner ---------- */
  var banner = null;

  function hideBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "consentTitle");
    banner.innerHTML =
      '<div class="consent-inner">' +
        '<div class="consent-text">' +
          '<strong id="consentTitle">' + t.title + '</strong>' +
          '<p>' + t.body + '</p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-act="decline">' + t.decline + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-act="accept">' + t.accept + '</button>' +
          '<a class="consent-link" href="' + privacyHref() + '">' + t.more + '</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('[data-act="accept"]').addEventListener("click", function () {
      save(true); loadMaps(); hideBanner();
    });
    banner.querySelector('[data-act="decline"]').addEventListener("click", function () {
      save(false); renderPlaceholders(); hideBanner();
    });
  }

  /* ---------- Fusszeilen-Schalter zum Widerrufen ---------- */
  function addFooterToggle() {
    var bottom = document.querySelector(".footer-bottom");
    if (!bottom || bottom.querySelector(".consent-revoke")) return;
    var span = bottom.querySelector("span:last-child") || bottom;
    var sep = document.createTextNode(" · ");
    var a = document.createElement("a");
    a.href = "#";
    a.className = "consent-revoke";
    a.textContent = t.settings;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch (err) {}
      renderPlaceholders();
      showBanner();
    });
    span.appendChild(sep);
    span.appendChild(a);
  }

  function init() {
    addFooterToggle();
    var choice = read();
    if (choice === null) {
      renderPlaceholders();
      // Kurz warten, damit der Hinweis nicht ueber den Seitenaufbau springt
      window.setTimeout(showBanner, 700);
    } else if (choice.map) {
      loadMaps();
    } else {
      renderPlaceholders();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
