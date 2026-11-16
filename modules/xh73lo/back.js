/* zaman-hikaye — Zaman Hikâye — bölüt şeritli, kendiliğinden ilerleyen dönem kareleri (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Sosyal medya hikâyesi dili: dikey (4:5) tek kare görünür, üstte her dönem için bir bölüt şeridi süreyle dolar ve kare kendiliğinden ilerler; yanda yuvarlak hikâye halkaları (görsel/ikon, yıl, başlık — görülenler soluk halka) ile atlanır, altta önceki · duraklat · sonraki ve «2 / 4» konumu. Üzerine gelince, odakta ve ekran dışındayken durur; reduced-motion'da otomatik geçiş kapalı. JS yokken tüm kareler ızgarada.
   Üretici: scripts/modul-fabrika (aile timeline) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: data: [{ etiket (yıl/tarih), baslik, metin?, ikon?, img?, url? }] — metinler dil sözlüğü; başlıksız satır atlanır. */
const P = "modulex-zaman-hikaye";
const IMG_KOK = "/img/";
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: timeline --- */
const kayitlar = veri.map((o) => ({
  etiket: metinAl(o, ["etiket", "year", "yil", "tarih", "date"]), baslik: metinAl(o, ["baslik", "title", "name"]),
  metin: metinAl(o, ["metin", "text", "description", "aciklama"]), ikon: ikonAd(ilk(o, ["ikon", "icon"])),
  img: medyaUrl(ilk(o, ["img", "image"])), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
const bH = (k, s, t) => `<${t || "h3"} class="${P}-${s || "kbaslik"}">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</${t || "h3"}>`;
const mH = (k, s) => (k.metin ? `<p class="${P}-${s || "kmetin"}">${satirlar(k.metin)}</p>` : "");
const yH = (k, s) => (k.etiket ? `<p class="${P}-${s || "yil"}">${esc(k.etiket)}</p>` : "");
const gH = (k, s) => (k.img ? `<img class="${P}-${s || "gorsel"}" src="${esc(k.img)}" alt="" width="800" height="560" loading="lazy" decoding="async" />` : "");
/* --- modül: zaman-hikaye --- */
const kart = () => "";
const sar = (ic, A) => {
    const n = A.length;
    const id = (x) => `${P}-{{id}}-${x}`;
    const yil = (k, i) => `<bdi dir="ltr">${esc(k.etiket || no(i))}</bdi>`;
    const halka = A.map((k, i) => `<li><button type="button" class="${P}-halka" data-hk-git="${i}" aria-controls="${id(`k${i}`)}"${i === 0 ? ' aria-current="true"' : ""}><span class="${P}-yuz">${k.img ? `<img class="${P}-yuzimg" src="${esc(k.img)}" alt="" width="96" height="96" loading="lazy" decoding="async" />` : `<span class="${P}-yuzikon material-symbols-outlined" aria-hidden="true">${k.ikon || "history"}</span>`}</span><span class="${P}-hmetin"><span class="${P}-hyil">${yil(k, i)}</span><span class="${P}-hbaslik">${esc(k.baslik)}</span></span></button></li>`).join("");
    const kare = A.map((k, i) => `<li class="${P}-kare${k.img ? ` ${P}-kare--gorsel` : ""}" id="${id(`k${i}`)}">${gH(k)}<div class="${P}-yazi"><p class="${P}-yil">${yil(k, i)}</p>${bH(k)}${mH(k)}</div></li>`).join("");
    const serit = A.map(() => `<span class="${P}-serit"><span class="${P}-dolgu"></span></span>`).join("");
    const kontrol = `<div class="${P}-kontrol" data-hk-js hidden><button type="button" class="${P}-dugmek" data-hk="geri" aria-label="@previous@"><span class="material-symbols-outlined mx-flip" aria-hidden="true">chevron_left</span></button><output class="${P}-sayac" dir="ltr" data-hk-sira>${esc(sayiBicim(1, 0))} / ${esc(sayiBicim(n, 0))}</output><button type="button" class="${P}-dugmek ${P}-dugmek--dur" data-hk="dur" aria-label="@slider-pause@" data-dur="@slider-pause@" data-oynat="@slider-play@"><span class="material-symbols-outlined" aria-hidden="true" data-hk-ikon>pause</span></button><button type="button" class="${P}-dugmek" data-hk="ileri" aria-label="@next@"><span class="material-symbols-outlined mx-flip" aria-hidden="true">chevron_right</span></button></div>`;
    return `<div class="${P}-hikaye" data-hikaye><ol class="${P}-halkalar" data-hk-js hidden>${halka}</ol><div class="${P}-oynatici"><div class="${P}-sahne"><div class="${P}-seritler" aria-hidden="true" data-hk-js hidden>${serit}</div><ol class="${P}-kareler">${kare}</ol></div>${kontrol}</div></div>`;
  };
const B = { ust: metinAl(des, ["ust","badge","kicker"]), baslik: metinAl(des, ["baslik","title"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !kayitlar.length;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = basHtml(B, "");
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
