// Membangun index.html statis dari content.cjs. Jalankan: node build.cjs
const fs = require("fs"), path = require("path");
const { ROLES, PHASES, MATRIX, SCREENS, DAY, FAQ, GLOSSARY } = require("./content.cjs");
const SRC_IMG = "C:/Users/DELL/Projects/dolan-belanja/public/tutorial";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const used = new Set();
const badge = (r) => `<span class="role r-${r}">${esc(ROLES[r].short)}</span>`;

function step(s, n) {
  if (s.img) used.add(s.img);
  return `<li class="step" data-role="${s.role}">
  <div class="step-text">
    <div class="step-head"><span class="num">${n}</span>${badge(s.role)}</div>
    <h4>${md(s.t)}</h4>
    ${s.p.map((x) => `<p>${md(x)}</p>`).join("\n    ")}
    ${s.tip ? `<div class="callout tip"><b>Tips</b> ${md(s.tip)}</div>` : ""}
    ${s.warn ? `<div class="callout warn"><b>Perhatian</b> ${md(s.warn)}</div>` : ""}
  </div>
  ${s.img ? `<figure class="shot"><button type="button" class="zoom" data-src="img/${s.img}.webp" aria-label="Perbesar gambar"><span class="phone"><img src="img/${s.img}.webp" alt="${esc(s.cap || s.t)}" loading="lazy" width="400" height="860"></span></button><figcaption>${md(s.cap || "")}</figcaption></figure>` : ""}
</li>`;
}
const steps = (list) => `<ol class="steps">${list.map((s, i) => step(s, i + 1)).join("\n")}</ol>`;

const DIAGRAMS = {
  release: `<div class="diagram" role="group" aria-label="Tiga cara daftar dilepas">
  <div class="dg-title">Daftar dilepas bila salah satu terjadi lebih dulu</div>
  <div class="dg-or">
    <div class="dg-box"><b>1. Semua outlet selesai</b><span>Setiap outlet wajib sudah <em>Kirim</em> atau <em>Tidak pesan</em>.</span></div>
    <div class="dg-op">ATAU</div>
    <div class="dg-box"><b>2. Jam tutup terlewati</b><span>Otomatis, walau ada outlet yang belum mengisi.</span></div>
    <div class="dg-op">ATAU</div>
    <div class="dg-box"><b>3. Admin melepas manual</b><span>Tombol <em>Lepas sekarang</em>. Bisa ditarik kembali selama belum dikirim ke supplier.</span></div>
  </div>
  <div class="dg-arrow">▼</div>
  <div class="dg-box big"><b>DAFTAR DILEPAS</b><span>Daftar menjadi final. Outlet yang belum mengisi hanya bisa lewat <em>Susulan</em>.</span></div>
</div>`,
  jalur: `<div class="diagram" role="group" aria-label="Tiga jalur pengerjaan daftar">
  <div class="dg-title">Daftar sudah dilepas. Siapa yang mengerjakan? Tergantung pengaturan kategori</div>
  <div class="dg-three">
    <a class="dg-box lane l-belanja" href="#pasar"><b>🧺 A. Pasar</b><span>Kategori <em>Belanja Pusat (Pasar)</em></span><span class="who">Tukang Belanja membeli sendiri dan mencatat hasil serta harga.</span></a>
    <a class="dg-box lane l-wa" href="#wa"><b>💬 B. WhatsApp</b><span>Ayam Potong, Buah, Sayur, Bebek &amp; Ayam Kampung</span><span class="who">Tukang Belanja meneruskan daftar ke grup supplier; supplier mengantar.</span></a>
    <a class="dg-box lane l-keringan" href="#keringan"><b>📦 C. Keringan</b><span>Kategori <em>Keringan</em></span><span class="who">Admin Keringan menyiapkan dari gudang; stok berkurang otomatis.</span></a>
  </div>
  <div class="dg-arrow">▼ &nbsp; semua jalur bertemu di &nbsp; ▼</div>
  <div class="dg-box big"><b>Barang tiba di outlet → Tahap 5</b></div>
</div>`,
};

function phase(p) {
  let h = `<section class="phase" id="${p.id}" data-who="${p.who.join(" ")}">
  <header class="phase-head">
    <div class="phase-no">${p.num}</div>
    <div>
      <h2>${p.icon} ${esc(p.title)}</h2>
      <div class="meta"><span class="when">🕒 ${esc(p.when)}</span> ${p.who.map(badge).join(" ")}</div>
    </div>
  </header>
  <p class="goal"><b>Tujuan.</b> ${md(p.goal)}</p>
  <p class="lead">${md(p.lead)}</p>
  ${p.diagram ? DIAGRAMS[p.diagram] : ""}`;
  if (p.steps) h += steps(p.steps);
  if (p.subs) {
    for (const s of p.subs) {
      h += `<div class="sub" id="${s.id}"><h3>${s.icon} ${esc(s.title)}</h3><p class="lead">${md(s.intro)}</p>${steps(s.steps)}${s.after ? `<h4 class="after-h">Pekerjaan penunjang</h4>${steps(s.after)}` : ""}</div>`;
    }
  }
  if (p.notes) h += `<div class="notes">${p.notes.map(([a, b]) => `<div class="note"><b>${esc(a)}</b><span>${md(b)}</span></div>`).join("")}</div>`;
  return h + "</section>";
}

const overview = `<ol class="map">${PHASES.map((p) => `<li><a href="#${p.id}" class="mapcard"><span class="mapno">${p.num}</span><span class="mapic">${p.icon}</span><b>${esc(p.short)}</b><small>${esc(p.when)}</small><span class="mapwho">${p.who.map(badge).join("")}</span></a></li>`).join("")}</ol>`;

const matrix = `<div class="tablewrap"><table class="matrix"><thead><tr><th>Tahap</th><th>${badge("outlet")}</th><th>${badge("belanja")}</th><th>${badge("keringan")}</th><th>${badge("admin")}</th></tr></thead><tbody>${MATRIX.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((c) => `<td>${c ? esc(c) : '<span class="dash">–</span>'}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

const screens = `<div class="screens">${SCREENS.map(([r, n, tabs]) => `<div class="scr"><div class="scr-h">${badge(r)}</div><div class="tabsrow">${tabs.map((t) => `<span class="tabpill">${esc(t)}</span>`).join("")}</div></div>`).join("")}</div>`;

const day = `<ol class="day">${DAY.map(([t, r, d]) => `<li data-role="${r}"><span class="dt">${esc(t)}</span>${badge(r)}<span class="dd">${md(d)}</span></li>`).join("")}</ol>`;

const faq = ["outlet", "belanja", "keringan", "admin"].map((r) => `<div class="faqgroup" data-role="${r}"><h3>${badge(r)}</h3>${FAQ.filter((f) => f[0] === r).map((f) => `<details><summary>${esc(f[1])}</summary><p>${md(f[2])}</p></details>`).join("")}</div>`).join("");

const glossary = `<dl class="gloss">${GLOSSARY.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${md(b)}</dd></div>`).join("")}</dl>`;

const roleCards = Object.keys(ROLES).filter((r) => r !== "sistem").map((r) => `<button type="button" class="rolecard r-${r}" data-pick="${r}"><b>${esc(ROLES[r].name)}</b><span>${esc(ROLES[r].d)}</span></button>`).join("");

const nav = [["Peta", "peta"], ...PHASES.map((p) => [p.num + " " + p.short, p.id]), ["Tanya jawab", "faq"]].map(([t, id]) => `<a href="#${id}">${esc(t)}</a>`).join("");

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Alur Belanja DS</title>
<meta name="description" content="Alur lengkap pemesanan Belanja DS dari pesanan outlet sampai barang diterima, untuk outlet, tukang belanja, admin gudang keringan, dan admin.">
<meta name="robots" content="noindex">
<meta property="og:title" content="Alur Belanja DS: dari pesan sampai barang diterima">
<meta property="og:description" content="Panduan alur kerja lengkap dengan potongan layar aplikasi untuk semua tim.">
<meta property="og:image" content="img/o02-home.webp">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🛒%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="style.css">
</head>
<body>
<a class="skip" href="#peta">Lewati ke isi</a>
<header class="hero">
  <div class="wrap">
    <p class="kicker">Sistem Order Belanja · Dolan Sawah</p>
    <h1>Alur Belanja DS<br><span>dari pesanan outlet sampai barang diterima</span></h1>
    <p class="hero-p">Halaman ini menjelaskan <b>siapa mengerjakan apa, kapan, dan di layar yang mana</b>. Setiap langkah disertai potongan layar aplikasi sungguhan. Bingkai merah pada gambar menunjuk bagian yang dimaksud.</p>
    <div class="hero-cta"><a class="btn" href="#peta">Lihat peta alur</a><a class="btn ghost" href="#peran">Saya sebagai…</a></div>
  </div>
</header>
<nav class="topnav" aria-label="Tahapan"><div class="wrap navin">${nav}</div></nav>

<main class="wrap">
<section id="peta" class="block">
  <h2>Peta alur</h2>
  <p class="lead">Tujuh tahap, dari menyiapkan aturan sampai memeriksa hasil. Ketuk kartu untuk loncat ke penjelasannya.</p>
  ${overview}
  <h3 class="mt">Siapa mengerjakan apa</h3>
  ${matrix}
  <h3 class="mt">Satu hari contoh</h3>
  <p class="lead small">Dengan pengaturan standar (jam tutup 17.00, barang dibutuhkan besok). Jam sebenarnya bisa berbeda per kategori: diatur admin di <b>Atur → Jadwal</b>.</p>
  ${day}
</section>

<section id="peran" class="block">
  <h2>Lima pihak yang terlibat</h2>
  <p class="lead">Pilih peran Anda untuk menyorot bagian yang menjadi tugas Anda. Bagian milik peran lain diredupkan, tetapi tetap bisa dibaca supaya Anda paham apa yang terjadi sebelum dan sesudah tugas Anda.</p>
  <div class="rolecards">${roleCards}<button type="button" class="rolecard reset" data-pick="">Tampilkan semua</button></div>
  <h3 class="mt">Menu yang dilihat tiap peran</h3>
  ${screens}
</section>

${PHASES.map(phase).join("\n")}

<section id="faq" class="block">
  <h2>Pertanyaan yang sering muncul</h2>
  ${faq}
  <h3 class="mt">Istilah</h3>
  ${glossary}
</section>
</main>

<footer class="foot"><div class="wrap">
  <p>Halaman panduan alur Belanja DS · gambar adalah potongan layar aplikasi dengan <b>data contoh</b>, bukan data asli.</p>
  <p>Aplikasi: <a href="https://belanja-ds.web.app">belanja-ds.web.app</a> · by Dolan Sawah</p>
</div></footer>

<div class="lightbox" id="lb" hidden><button type="button" class="lb-x" aria-label="Tutup">✕</button><img alt=""></div>
<script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync("index.html", html);
fs.mkdirSync("img", { recursive: true });
let missing = 0;
for (const n of used) { const f = path.join(SRC_IMG, n + ".webp"); if (!fs.existsSync(f)) { console.log("GAMBAR HILANG:", n); missing++; } else fs.copyFileSync(f, path.join("img", n + ".webp")); }
fs.copyFileSync(path.join(SRC_IMG, "o02-home.webp"), "img/o02-home.webp");
console.log("ok: index.html,", used.size, "gambar,", missing, "hilang");
