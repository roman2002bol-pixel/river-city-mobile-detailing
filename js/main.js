/* River City Mobile Detailing – site behavior. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var closeBtn = document.querySelector("[data-nav-close]");
  var nav = document.querySelector("[data-nav]");
  var overlay = document.querySelector("[data-nav-overlay]");

  function openNav() {
    nav && nav.classList.add("is-open");
    overlay && overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    nav && nav.classList.remove("is-open");
    overlay && overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  toggle && toggle.addEventListener("click", openNav);
  closeBtn && closeBtn.addEventListener("click", closeNav);
  overlay && overlay.addEventListener("click", closeNav);

  /* mobile accordion for dropdown nav groups (Services / Service Area) */
  document.querySelectorAll(".nav-group-label").forEach(function (label) {
    label.addEventListener("click", function () {
      if (window.innerWidth >= 960) return; // desktop uses hover
      var group = label.closest(".nav-group");
      group.classList.toggle("is-open");
    });
  });

  /* close mobile nav after choosing a link */
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 960) closeNav();
    });
  });

  /* ---------- image placeholder fallback ----------
     Any <img data-slot> that fails to load (because the real photo
     hasn't been added yet) reveals a labeled placeholder instead of
     a broken-image icon. Drop a file in /images with the matching
     name and the placeholder disappears automatically. */
  document.querySelectorAll(".img-slot img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.closest(".img-slot").classList.add("is-empty");
      img.style.display = "none";
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });

  /* ---------- booking / quote form ---------- */
  var form = document.querySelector("[data-booking-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var status = form.querySelector("[data-form-status]");
      var endpointConfigured = form.getAttribute("data-endpoint-ready") === "true";

      if (!endpointConfigured) {
        // No form backend wired up yet (see README) – fall back to a
        // pre-filled email so requests are never silently lost.
        e.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) { lines.push(key + ": " + value); });
        var subject = encodeURIComponent("New booking request – River City Mobile Detailing");
        var body = encodeURIComponent(lines.join("\n"));
        window.location.href = "mailto:info@rivercitymobiledetailing.com?subject=" + subject + "&body=" + body;
        if (status) {
          status.textContent = "Opening your email app to send the request – or just call/text us instead.";
          status.className = "form-status ok is-visible";
        }
      }
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
