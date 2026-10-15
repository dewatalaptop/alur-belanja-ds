(function () {
  // Sorot peran: bagian milik peran lain diredupkan (tetap terbaca)
  var cards = document.querySelectorAll("[data-pick]");
  function pick(role) {
    document.querySelectorAll(".rolecard").forEach(function (c) { c.classList.toggle("on", !!role && c.getAttribute("data-pick") === role); });
    document.querySelectorAll(".step, .day li, .faqgroup, .mapcard, .phase-head").forEach(function (n) { n.classList.remove("dim"); });
    try { if (role) sessionStorage.setItem("role", role); else sessionStorage.removeItem("role"); } catch (e) { /* abaikan */ }
    if (!role) return;
    document.querySelectorAll(".step, .day li, .faqgroup").forEach(function (n) {
      var r = n.getAttribute("data-role");
      if (r && r !== role) n.classList.add("dim");
    });
    document.querySelectorAll(".phase").forEach(function (p) {
      var who = (p.getAttribute("data-who") || "").split(" ");
      var id = p.id;
      var card = document.querySelector('.mapcard[href="#' + id + '"]');
      if (who.indexOf(role) < 0 && card) card.classList.add("dim");
    });
  }
  cards.forEach(function (c) { c.addEventListener("click", function () { pick(c.getAttribute("data-pick")); }); });
  try { var saved = sessionStorage.getItem("role"); if (saved) pick(saved); } catch (e) { /* abaikan */ }

  // Lightbox gambar
  var lb = document.getElementById("lb"), lbImg = lb.querySelector("img");
  function closeLb() { lb.hidden = true; lbImg.removeAttribute("src"); document.body.style.overflow = ""; }
  document.addEventListener("click", function (e) {
    var z = e.target.closest(".zoom");
    if (z) { lbImg.src = z.getAttribute("data-src"); lb.hidden = false; document.body.style.overflow = "hidden"; return; }
    if (!lb.hidden) closeLb();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  // Tandai tautan navigasi yang sedang dibaca
  var links = {}; document.querySelectorAll(".navin a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && links[en.target.id]) { Object.keys(links).forEach(function (k) { links[k].classList.remove("on"); }); links[en.target.id].classList.add("on"); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
