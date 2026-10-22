// Arıza rehberindeki doğrulanmış veriden (ariza-rehberi/veriler.js) Google için
// statik sayfalar üretir:
//   /ariza-rehberi/kodlar/                         → tüm markalar ve modeller
//   /ariza-rehberi/kodlar/<marka>/<model>/         → modelin tüm kodları
//   /ariza-rehberi/kodlar/<marka>/<model>/<kod>/   → tek bir kodun sayfası
// ve sitenin kökünde sitemap.xml.
//
// Kullanım (depo kökünde):  node _araclar/sayfa-uret.js
// veriler.js her güncellendiğinde yeniden çalıştırılmalıdır.
// "_" ile başlayan bu klasör GitHub Pages tarafından yayınlanmaz.

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const SITE = "https://www.scootertamirmerkezi.com";
const CIKTI = path.join(KOK, "ariza-rehberi", "kodlar");
const WP_NO = "905356471111";

// veriler.js tarayıcı için yazıldığından "const" tanımlarını burada okunur hale getiriyoruz
const kaynak = fs.readFileSync(path.join(KOK, "ariza-rehberi", "veriler.js"), "utf8");
const { MODELLER } = new Function(kaynak.replace(/^const /gm, "var ") + "; return { MODELLER };")();

const TR = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
const slug = (s) => s.replace(/[çğıöşüÇĞİÖŞÜ]/g, (h) => TR[h]).toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const kac = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Hizmet sayfaları. Metinler yalnızca ana sayfadaki bilgilere dayanır (fiyat/garanti iddiası yok).
const HIZMETLER = [
  { yol: "scooter-batarya-tamiri", kisa: "Batarya tamiri",
    baslik: "Elektrikli scooter batarya tamiri",
    aciklama: "Levent Metrocity AVM'de elektrikli scooter batarya tamiri: hücre değişimi, BMS onarımı, 36–60V bataryalar. Önce ölçüyoruz, sonra fiyat veriyoruz.",
    giris: "Şarj tutmayan, menzili düşen ya da hiç açılmayan scooter bataryalarını onarıyoruz. Bataryayı komple değiştirmeden önce ölçüyoruz; tamiri mümkün olanı değiştirmiyoruz.",
    belirtiler: ["Batarya şarj tutmuyor, çabuk bitiyor", "Menzil belirgin şekilde düştü", "Scooter hiç açılmıyor", "Şarj olmuyor, şarj aleti ışığı değişmiyor", "Gaz verince veya yokuşta kapanıyor", "Ekranda batarya / BMS ile ilgili hata kodu var"],
    yapilanlar: ["Hücre ve hücre grubu ölçümü", "Zayıf hücrelerin değişimi", "BMS (batarya yönetim kartı) onarımı", "36V'tan 60V'a kadar scooter bataryaları"] },
  { yol: "scooter-anakart-tamiri", kisa: "Anakart tamiri",
    baslik: "Elektrikli scooter anakart (kontrol kartı) tamiri",
    aciklama: "Levent Metrocity AVM'de elektrikli scooter anakart, controller ve ekran kartı tamiri. MOSFET, hata kodları, su hasarı. Komponent seviyesinde onarım.",
    giris: "Scooter'ın beyni olan kontrol kartını (controller) ve ekran kartını komponent seviyesinde tamir ediyoruz. Kartı komple değiştirmek yerine arızalı parçayı buluyoruz.",
    belirtiler: ["Ekranda hata kodu görünüyor", "Gaz kolu tepki vermiyor", "Motor sarsıntılı çekiyor veya hiç çekmiyor", "Scooter ıslandıktan sonra arıza başladı", "Ekran yanıyor ama scooter gitmiyor"],
    yapilanlar: ["Controller (kontrol kartı) onarımı", "MOSFET değişimi", "Ekran kartı onarımı", "Su hasarı sonrası kart temizliği ve onarımı", "Hata kodu teşhisi"] },
  { yol: "scooter-motor-tamiri", kisa: "Motor ve bakım",
    baslik: "Elektrikli scooter motor tamiri ve bakım",
    aciklama: "Levent Metrocity AVM'de elektrikli scooter motor tamiri: ses yapan, çekmeyen motorlar, hall sensörü, rulman, fren, lastik ve bakım.",
    giris: "Ses yapan, çekmeyen ya da tıkırdayan motorları onarıyoruz; fren, lastik ve genel bakımı da yapıyoruz.",
    belirtiler: ["Motor ses yapıyor veya tıkırdıyor", "Motor çekmiyor, güç kaybı var", "Ekranda motor / hall sensörü hata kodu var", "Fren tutmuyor veya ses yapıyor", "Lastik patladı veya aşındı"],
    yapilanlar: ["Hall sensörü onarımı", "Rulman değişimi", "Fren ayarı ve onarımı", "Lastik değişimi", "Periyodik bakım"] },
];

const wp = (metin) => "https://wa.me/" + WP_NO + "?text=" + encodeURIComponent(metin);

const CSS = `
:root{--bg:#f6f8f5;--card:#fff;--ink:#0f2a43;--muted:#5a6b78;--line:#dde4e0;--m2:#1fa64a;--m2-soft:#e3f4e8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1724;--card:#12212f;--ink:#e8f0f5;--muted:#93a6b4;--line:#22384a;--m2:#36c565;--m2-soft:#123323;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0b1724;--card:#12212f;--ink:#e8f0f5;--muted:#93a6b4;--line:#22384a;--m2:#36c565;--m2-soft:#123323;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 "Nunito Sans",system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--m2)}
.wrap{max-width:820px;margin:0 auto;padding:0 16px}
header{border-bottom:1px solid var(--line);background:var(--card)}
header .wrap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:14px;flex-wrap:wrap}
header a{color:var(--ink);text-decoration:none;font-weight:700}
.yol{font-size:.9rem;color:var(--muted);margin:20px 0 6px}
.yol a{color:var(--muted)}
h1{font-family:Sora,system-ui,sans-serif;font-size:clamp(1.6rem,4.5vw,2.3rem);line-height:1.15;margin:.3rem 0 1rem;letter-spacing:-.02em}
h2{font-family:Sora,system-ui,sans-serif;font-size:1.2rem;margin:2rem 0 .8rem}
.kart{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin:16px 0}
.kart p{margin:.5rem 0}
.soluk{color:var(--muted);font-size:.92rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.85rem 1.3rem;border-radius:99px;font-weight:700;text-decoration:none;background:var(--m2);color:#fff;margin:6px 8px 6px 0}
.btn-alt{background:var(--card);color:var(--ink);border:2px solid var(--line)}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:.85rem;color:var(--muted)}
td:first-child{white-space:nowrap;font-weight:700}
ul.liste{list-style:none;padding:0;margin:0;display:grid;gap:8px}
ul.liste a{display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;color:var(--ink);text-decoration:none}
ul.liste a:hover{border-color:var(--m2)}
footer{color:var(--muted);font-size:.85rem;text-align:center;padding:32px 16px}
.alt-menu{max-width:820px;margin:40px auto 0;padding:20px 16px 0;border-top:1px solid var(--line);font-size:.92rem;line-height:2;color:var(--muted)}
.alt-menu a{color:var(--ink)}
ul.madde{padding-left:1.2rem}
ul.madde li{margin:.35rem 0}
.uyari{background:#fde8e8;color:#a11d1d;border-radius:12px;padding:12px 14px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .uyari{background:#3d1616;color:#ffaaaa}}
`;

// İşletme bilgileri (ana sayfadaki iletişim bölümüyle aynı)
const ISLETME_ID = SITE + "/#isletme";

// Tüm sayfaların altındaki menü: hizmetler, markalar ve hata kodları
const ALT_MENU = () => `<nav class="alt-menu"><b>Hizmetler:</b> ${HIZMETLER.map((h) => `<a href="/${h.yol}/">${kac(h.kisa)}</a>`).join(" · ")}<br>
<b>Markalar:</b> ${Object.keys(MODELLER).map((m) => `<a href="/${slug(m)}-scooter-tamiri/">${kac(m)}</a>`).join(" · ")}<br>
<a href="/ariza-rehberi/">Arıza rehberi</a> · <a href="/ariza-rehberi/kodlar/">Tüm hata kodları</a></nav>`;

// Google arama sonucunda kesilmesin diye açıklamayı ~155 karakterde, kelime sınırından kısaltır
const kisalt = (s, n = 155) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[\s,.;:(]+$/, "") + "…";

function sayfa({ baslik, aciklama: uzunAciklama, yol, kanonik, govde, ekVeri = [] }) {
  const aciklama = kisalt(uzunAciklama);
  const kirintilar = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: yol.map(([ad, url], i) => ({ "@type": "ListItem", position: i + 1, name: ad, item: SITE + (url || kanonik) })),
  };
  const veriler = [kirintilar, ...ekVeri].map((v) => `<script type="application/ld+json">${JSON.stringify(v)}</script>`).join("\n");
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kac(baslik)}</title>
<meta name="description" content="${kac(aciklama)}">
<link rel="canonical" href="${SITE}${kanonik}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@700&family=Nunito+Sans:wght@400;700&display=swap">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="E-Scooter Tamir Merkezi">
<meta property="og:title" content="${kac(baslik)}">
<meta property="og:description" content="${kac(aciklama)}">
<meta property="og:url" content="${SITE}${kanonik}">
<style>${CSS}</style>
${veriler}
</head>
<body>
<header><div class="wrap"><a href="/">E-Scooter Tamir Merkezi · Levent</a><a href="tel:+905356471111">0535 647 11 11</a></div></header>
<main class="wrap">
<nav class="yol">${yol.map(([ad, url]) => url ? `<a href="${url}">${kac(ad)}</a>` : kac(ad)).join(" › ")}</nav>
${govde}
</main>
${ALT_MENU()}
<footer><a href="/">E-Scooter Tamir Merkezi</a> · Metrocity AVM, Levent, Şişli / İstanbul · Kart ve batarya onarımı · Türkiye geneli kargo ile kabul<br>
Bu sayfadaki bilgiler üretici kılavuzundan alınmıştır; kesin teşhis uzman incelemesiyle yapılır.</footer>
</body>
</html>
`;
}

const ISTEK = `<p>Kart, BMS ve batarya arızalarını parça seviyesinde onarıyoruz. Metrocity AVM, Levent'teki dükkânımıza getirebilir veya Türkiye'nin her yerinden kargoyla gönderebilirsiniz. <i>Batarya göndermeden önce lütfen WhatsApp'tan bilgi alın.</i></p>`;

function yaz(goreli, html) {
  const dosya = path.join(CIKTI, goreli, "index.html");
  fs.mkdirSync(path.dirname(dosya), { recursive: true });
  fs.writeFileSync(dosya, html);
}

fs.rmSync(CIKTI, { recursive: true, force: true });
const urller = ["/", "/ariza-rehberi/", "/ariza-rehberi/kodlar/"];
const anaListe = [];

for (const [marka, modeller] of Object.entries(MODELLER)) {
  const mSlug = slug(marka);
  const modelLinkleri = [];

  for (const [model, md] of Object.entries(modeller)) {
    const mdSlug = slug(model);
    const modelUrl = `/ariza-rehberi/kodlar/${mSlug}/${mdSlug}/`;
    const adi = `${marka} ${model}`;
    modelLinkleri.push(`<li><a href="${modelUrl}"><b>${kac(model)}</b>${md.kodlar.length ? ` · ${md.kodlar.length} hata kodu` : ""}</a></li>`);
    urller.push(modelUrl);

    // Tek kod sayfaları
    for (const [kod, anlam, orijinal, cozum] of md.kodlar) {
      const kodUrl = `${modelUrl}${slug(kod)}/`;
      const kisa = anlam.replace(/\.$/, ""); // başlıkta sondaki noktayı at
      urller.push(kodUrl);
      const digerleri = md.kodlar.filter((r) => r[0] !== kod)
        .map((r) => `<li><a href="${modelUrl}${slug(r[0])}/"><b>${kac(r[0])}</b> · ${kac(r[1])}</a></li>`).join("");
      yaz(`${mSlug}/${mdSlug}/${slug(kod)}`, sayfa({
        baslik: `${adi} ${kod} hatası: ${kisa} | E-Scooter Tamir Merkezi`,
        aciklama: `${adi} ekranında ${kod} hata kodu: ${kisa}. Üretici kılavuzundaki açıklama ve onarım için Levent'teki servisimiz.`,
        kanonik: kodUrl,
        yol: [["Ana sayfa", "/"], ["Hata kodları", "/ariza-rehberi/kodlar/"], [marka, `/ariza-rehberi/kodlar/${mSlug}/`], [model, modelUrl], [kod, null]],
        govde: `<h1>${kac(adi)} ${kac(kod)} hatası</h1>
<div class="kart">
<p><b>Kılavuzdaki açıklama:</b> ${kac(anlam)}</p>
${orijinal ? `<p class="soluk">Kılavuzdaki orijinal ifade: “${kac(orijinal)}”</p>` : ""}
${cozum ? `<p><b>Kılavuzda yazan çözüm:</b> ${kac(cozum)}</p>` : ""}
<p class="soluk">Kaynak: ${kac(md.kaynak)}</p>
</div>
${ISTEK}
<a class="btn" href="${wp(`Merhaba, ${adi} scooter'ımda ${kod} hatası var (${kisa}).`)}" target="_blank" rel="noopener">💬 Bu arıza için WhatsApp'tan yazın</a>
<a class="btn btn-alt" href="/ariza-rehberi/">🔧 Başka bir kod sorgula</a>
${digerleri ? `<h2>${kac(adi)} diğer hata kodları</h2><ul class="liste">${digerleri}</ul>` : ""}
`,
      }));
    }

    // Model sayfası
    const tablo = md.kodlar.length
      ? `<table><thead><tr><th>Kod</th><th>Kılavuzdaki açıklama</th></tr></thead><tbody>${md.kodlar
          .map(([kod, anlam]) => `<tr><td><a href="${modelUrl}${slug(kod)}/">${kac(kod)}</a></td><td>${kac(anlam)}</td></tr>`).join("")}</tbody></table>`
      : "";
    yaz(`${mSlug}/${mdSlug}`, sayfa({
      baslik: md.kodlar.length
        ? `${adi} hata kodları ve anlamları | E-Scooter Tamir Merkezi`
        : `${adi} arıza ve hata kodu | E-Scooter Tamir Merkezi`,
      aciklama: md.kodlar.length
        ? `${adi} elektrikli scooter hata kodları listesi (${md.kodlar.map((r) => r[0]).join(", ")}). Üretici kılavuzundan derlendi.`
        : `${adi} elektrikli scooter arızaları için Levent'teki servisimize ulaşın.`,
      kanonik: modelUrl,
      yol: [["Ana sayfa", "/"], ["Hata kodları", "/ariza-rehberi/kodlar/"], [marka, `/ariza-rehberi/kodlar/${mSlug}/`], [model, null]],
      govde: `<h1>${kac(adi)} hata kodları</h1>
${md.not ? `<div class="kart"><p>${kac(md.not)}</p></div>` : ""}
${tablo}
<p class="soluk">Kaynak: ${kac(md.kaynak)}</p>
${ISTEK}
<a class="btn" href="${wp(`Merhaba, ${adi} scooter'ım için yazıyorum.`)}" target="_blank" rel="noopener">💬 WhatsApp'tan yazın</a>
<a class="btn btn-alt" href="/ariza-rehberi/">🔧 Arıza rehberini aç</a>
`,
    }));
  }

  // Marka sayfası
  const markaUrl = `/ariza-rehberi/kodlar/${mSlug}/`;
  urller.push(markaUrl);
  yaz(mSlug, sayfa({
    baslik: `${marka} elektrikli scooter hata kodları | E-Scooter Tamir Merkezi`,
    aciklama: `${marka} elektrikli scooter modellerinin hata kodları, üretici kılavuzlarından derlendi. Levent'te kart ve batarya onarımı.`,
    kanonik: markaUrl,
    yol: [["Ana sayfa", "/"], ["Hata kodları", "/ariza-rehberi/kodlar/"], [marka, null]],
    govde: `<h1>${kac(marka)} scooter hata kodları</h1><p>Modelinizi seçin:</p><ul class="liste">${modelLinkleri.join("")}</ul>`,
  }));
  anaListe.push(`<h2><a href="${markaUrl}">${kac(marka)}</a></h2><ul class="liste">${modelLinkleri.join("")}</ul>`);
}

// Tüm kodlar ana sayfası
yaz("", sayfa({
  baslik: "Elektrikli scooter hata kodları: Onvo, Ducati, Aprilia, Xiaomi, Kukirin | E-Scooter Tamir Merkezi",
  aciklama: "Elektrikli scooter hata kodlarının üretici kılavuzlarındaki anlamları. Onvo, Ducati, Aprilia, Xiaomi, Kukirin ve Segway modelleri.",
  kanonik: "/ariza-rehberi/kodlar/",
  yol: [["Ana sayfa", "/"], ["Hata kodları", null]],
  govde: `<h1>Elektrikli scooter hata kodları</h1>
<p>Tüm kodlar üreticilerin resmi kullanım kılavuzlarından ve resmi destek sayfalarından alınmıştır. Kodunuzu hızlıca bulmak için <a href="/ariza-rehberi/">arıza rehberini</a> kullanabilirsiniz.</p>
${anaListe.join("\n")}`,
}));

// ---- Hizmet ve marka tamir sayfaları (sitenin kökünde) ----
function kokYaz(goreli, html) {
  const dosya = path.join(KOK, goreli, "index.html");
  fs.mkdirSync(path.dirname(dosya), { recursive: true });
  fs.writeFileSync(dosya, html);
}
const SURECLER = `<h2>Nasıl çalışıyoruz</h2><ol class="madde"><li><b>Yazın:</b> Model ve belirtiyi WhatsApp'tan iletin.</li><li><b>Getirin:</b> Metrocity AVM, Levent (M2 Levent durağı). Türkiye'nin her yerinden kargoyla da kabul ediyoruz.</li><li><b>Ölçüm:</b> Cihazla teşhis, net fiyat.</li><li><b>Onay ve tamir:</b> Onayınız olmadan başlamayız.</li><li><b>Teslim:</b> Test sürüşüyle teslim.</li></ol>`;
const ILETISIM = `<div class="kart"><p><b>E-Scooter Tamir Merkezi</b><br>Metrocity AVM, Büyükdere Cad. No:171, Levent, Şişli / İstanbul<br>Pazartesi–Cuma 09:00–18:00<br>Telefon: <a href="tel:+905356471111">0535 647 11 11</a></p></div>`;

for (const h of HIZMETLER) {
  const url = `/${h.yol}/`;
  urller.push(url);
  kokYaz(h.yol, sayfa({
    baslik: `${h.baslik} | Levent, İstanbul | E-Scooter Tamir Merkezi`,
    aciklama: h.aciklama, kanonik: url,
    yol: [["Ana sayfa", "/"], [h.kisa, null]],
    ekVeri: [{ "@context": "https://schema.org", "@type": "Service", name: h.baslik, serviceType: h.baslik,
      provider: { "@id": ISLETME_ID }, areaServed: ["İstanbul", "Türkiye"], url: SITE + url }],
    govde: `<h1>${kac(h.baslik)} · Levent</h1>
<p>${kac(h.giris)}</p>
<a class="btn" href="${wp(`Merhaba, ${h.kisa.toLowerCase()} için yazıyorum. Scooter modelim: `)}" target="_blank" rel="noopener">💬 WhatsApp'tan fiyat alın</a>
<a class="btn btn-alt" href="tel:+905356471111">📞 0535 647 11 11</a>
<h2>Hangi durumlarda bize gelmelisiniz?</h2><ul class="madde">${h.belirtiler.map((b) => `<li>${kac(b)}</li>`).join("")}</ul>
<h2>Neler yapıyoruz?</h2><ul class="madde">${h.yapilanlar.map((b) => `<li>${kac(b)}</li>`).join("")}</ul>
<p>Ekranınızda bir hata kodu varsa önce <a href="/ariza-rehberi/">arıza rehberimizden</a> kodun üretici kılavuzundaki anlamına bakabilirsiniz.</p>
${SURECLER}
<p class="uyari">⚠️ Batarya şişmiş, duman veya yanık kokusu varsa scooter'ı şarja takmayın ve kullanmayın. Bataryayı kargoya vermeden önce mutlaka WhatsApp'tan bilgi alın.</p>
${ILETISIM}`,
  }));
}

for (const [marka, modeller] of Object.entries(MODELLER)) {
  const ms = slug(marka), url = `/${ms}-scooter-tamiri/`;
  urller.push(url);
  const kodlu = Object.entries(modeller).filter(([, md]) => md.kodlar.length);
  const modelListesi = Object.entries(modeller).map(([ad, md]) =>
    `<li><a href="/ariza-rehberi/kodlar/${ms}/${slug(ad)}/"><b>${kac(ad)}</b>${md.kodlar.length ? ` · ${md.kodlar.length} hata kodu` : ""}</a></li>`).join("");
  kokYaz(`${ms}-scooter-tamiri`, sayfa({
    baslik: `${marka} scooter tamiri | Levent, İstanbul | E-Scooter Tamir Merkezi`,
    aciklama: `${marka} elektrikli scooter batarya, anakart ve motor tamiri. Levent Metrocity AVM'de ölçüm, net fiyat ve onayınızla onarım. ${marka} hata kodları rehberi.`,
    kanonik: url,
    yol: [["Ana sayfa", "/"], [`${marka} scooter tamiri`, null]],
    ekVeri: [{ "@context": "https://schema.org", "@type": "Service", name: `${marka} elektrikli scooter tamiri`, serviceType: "Elektrikli scooter tamiri",
      provider: { "@id": ISLETME_ID }, areaServed: ["İstanbul", "Türkiye"], url: SITE + url }],
    govde: `<h1>${kac(marka)} scooter tamiri · Levent</h1>
<p>${kac(marka)} elektrikli scooter'ların bataryasını, kontrol kartını ve motorunu parça seviyesinde onarıyoruz. Önce ölçüyoruz, sonra fiyat veriyoruz; onayınız olmadan tamire başlamıyoruz.</p>
<a class="btn" href="${wp(`Merhaba, ${marka} scooter'ım için yazıyorum. Model ve arıza: `)}" target="_blank" rel="noopener">💬 WhatsApp'tan fiyat alın</a>
<a class="btn btn-alt" href="tel:+905356471111">📞 0535 647 11 11</a>
<h2>${kac(marka)} için hizmetlerimiz</h2><ul class="madde">${HIZMETLER.map((x) => `<li><a href="/${x.yol}/">${kac(x.baslik)}</a></li>`).join("")}</ul>
<h2>${kac(marka)} hata kodları</h2>
<p>${kodlu.length ? `Aşağıdaki ${kac(marka)} modellerinin hata kodlarını üretici kılavuzlarından derledik. Modelinizi seçerek ekranınızdaki kodun anlamını görebilirsiniz.` : `${kac(marka)} için üretici tarafından yayınlanmış bir hata kodu tablosu bulunmuyor. Ekranınızdaki kodu WhatsApp'tan bize yazın.`}</p>
<ul class="liste">${modelListesi}</ul>
${SURECLER}
${ILETISIM}
<p class="soluk">Marka adları yalnızca uyumlu modelleri belirtmek için kullanılmıştır.</p>`,
  }));
}

// Site haritası
const bugun = new Date().toISOString().slice(0, 10);
const haritaXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urller.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${bugun}</lastmod></url>`).join("\n") + `\n</urlset>\n`;
fs.writeFileSync(path.join(KOK, "sitemap.xml"), haritaXml);

console.log(`${urller.length} adres üretildi (sitemap.xml güncellendi).`);
