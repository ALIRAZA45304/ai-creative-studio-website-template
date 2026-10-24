const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pal = [
  ["#3b6df0", "#0a1a4d"],
  ["#ff7a2f", "#4a0f0f"],
  ["#16c9a0", "#08312b"],
  ["#e83e8c", "#2b0a2a"],
  ["#d6ff1f", "#1d3305"],
  ["#f5c242", "#4a2406"],
  ["#8a5cf6", "#14093d"],
  ["#ef4444", "#2a0808"],
  ["#38bdf8", "#06283a"],
  ["#a3a3a3", "#161616"],
];
const art = (i, ang = null) => {
  const [a, b] = pal[i % pal.length];
  const r = (i * 47) % 360;
  return `radial-gradient(circle at ${20 + ((i * 23) % 60)}% ${25 + ((i * 31) % 50)}%,${a} 0,transparent 55%),linear-gradient(${ang ?? r}deg,${b},#050506)`;
};
const users = [
  "joey",
  "seif",
  "panda",
  "aist",
  "buralqy",
  "benhamin",
  "pietro",
  "seeyoo",
  "mansoon",
  "gabriel",
  "allan",
  "stella",
];
const mk = (i, h) =>
  `<button class="tile" data-clip="${i}" aria-label="Open clip ${i + 1}"><div class="art" style="height:${h}px;background:${art(i)}"></div>${vtag(i)}<span class="u">@${users[i % users.length]}</span></button>`;
/* generative video engine: each clip is a live animated scene */
const sc = [
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    for (let k = 0; k < 5; k++) {
      const x = w / 2 + Math.sin((t / 900) * (k + 1) * 0.5 + k + i) * w * 0.35,
        y = h / 2 + Math.cos((t / 700) * (k + 1) * 0.4 + k) * h * 0.35,
        g = c.createRadialGradient(x, y, 0, x, y, Math.min(w, h) * 0.5);
      g.addColorStop(0, a + "cc");
      g.addColorStop(1, a + "00");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }
  },
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    c.fillStyle = a;
    for (let k = 0; k < 8; k++) {
      c.globalAlpha = 0.15 + k * 0.08;
      c.beginPath();
      c.moveTo(0, h);
      for (let x = 0; x <= w; x += 4)
        c.lineTo(x, h * (0.35 + k * 0.07) + Math.sin((x / w) * 6 + t / 600 + k) * h * 0.06);
      c.lineTo(w, h);
      c.fill();
    }
    c.globalAlpha = 1;
  },
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = a;
    c.lineWidth = 2;
    for (let k = 0; k < 12; k++) {
      const s = ((k + t / 700) % 12) / 12;
      c.globalAlpha = 1 - s;
      c.strokeRect(w / 2 - w * s * 0.8, h / 2 - h * s * 0.8, w * s * 1.6, h * s * 1.6);
    }
    c.globalAlpha = 1;
  },
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    c.fillStyle = a;
    for (let k = 0; k < 40; k++) {
      c.globalAlpha = 0.3 + (k % 5) * 0.15;
      c.fillRect(
        (k * 97 + i * 13) % w,
        (k * 53 + (t / 8) * (1 + (k % 4) * 0.5)) % h,
        2,
        6 + (k % 8),
      );
    }
    c.globalAlpha = 1;
  },
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    c.save();
    c.translate(w / 2, h / 2);
    c.rotate(t / 2500);
    c.fillStyle = a;
    c.globalAlpha = 0.25;
    for (let k = 0; k < 10; k++) {
      c.rotate(Math.PI / 5);
      c.fillRect(0, -4, Math.max(w, h), 8 + Math.sin(t / 400 + k) * 6);
    }
    c.restore();
    c.globalAlpha = 1;
  },
  (c, w, h, t, i) => {
    const [a, b] = pal[i % 10];
    c.fillStyle = b;
    c.fillRect(0, 0, w, h);
    c.fillStyle = a;
    const n = 14,
      bw = w / n;
    for (let k = 0; k < n; k++) {
      const v = ((Math.sin(t / 300 + k * 0.7 + i) + 1) / 2) * h * 0.7 + h * 0.1;
      c.fillRect(k * bw + 2, h - v, bw - 4, v);
    }
  },
];
let off = 0,
  genSrc = null,
  genStop = null,
  vstop = null,
  vi = 0;
const ups = [],
  stops = new WeakMap();
function play(el, i) {
  const cv = document.createElement("canvas"),
    r = el.getBoundingClientRect();
  cv.width = Math.max(2, (r.width / 2) | 0);
  cv.height = Math.max(2, (r.height / 2) | 0);
  el.appendChild(cv);
  const c = cv.getContext("2d"),
    s = sc[i % sc.length];
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
    s(c, cv.width, cv.height, 0, i);
    return () => cv.remove();
  }
  let id,
    run = 1;
  const f = (t) => {
    if (!run) return;
    s(c, cv.width, cv.height, t, i);
    id = requestAnimationFrame(f);
  };
  id = requestAnimationFrame(f);
  return () => {
    run = 0;
    cancelAnimationFrame(id);
    cv.remove();
  };
}
const VN = VIDS.length,
  vsrc = (i) => VIDS[((i % VN) + VN) % VN];
const vtag = (i) => {
  const k = Math.floor(i / VN) % 5;
  return `<video class="rv" data-v="${i}" muted loop playsinline preload="none" style="filter:${["none", "hue-rotate(40deg)", "hue-rotate(-50deg) saturate(1.2)", "hue-rotate(120deg)", "sepia(.5) hue-rotate(160deg)"][k]};${k % 2 ? "transform:scaleX(-1)" : ""}"></video>`;
};
const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
const io = new IntersectionObserver(
  (es) =>
    es.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) {
        if (!v.getAttribute("src")) v.src = vsrc(+v.dataset.v);
        if (!still) v.play().catch(() => {});
      } else v.pause();
    }),
  { rootMargin: "120px" },
);
function wire(root = document) {
  $$("video.rv:not([data-w])", root).forEach((v) => {
    v.dataset.w = 1;
    v.addEventListener("error", () => v.remove(), { once: true });
    v.addEventListener(
      "loadedmetadata",
      () => {
        if (v.duration) v.currentTime = Math.random() * v.duration * 0.8;
      },
      { once: true },
    );
    io.observe(v);
  });
}
const upTile = (k) =>
  `<button class="tile up" data-up="${k}" aria-label="Open uploaded video"><div class="art" style="height:${[260, 300, 340][k % 3]}px"></div><video src="${ups[k].url}#t=0.1" muted loop playsinline preload="metadata"></video><span class="u">@you</span></button>`;
function renderGrids(o = 0) {
  const U = ups
    .map((_, k) => upTile(k))
    .reverse()
    .join("");
  $("#grid").innerHTML = U + hs.map((h, i) => mk(i + o, h)).join("");
  $("#grid2").innerHTML =
    U +
    hs
      .concat(hs)
      .map((h, i) => mk(i + 3 + o, h + (i % 3) * 20))
      .join("");
  wire();
}
document.addEventListener("mouseover", (e) => {
  const t = e.target.closest(".tile,.card");
  if (!t || t.dataset.on) return;
  t.dataset.on = 1;
  if (t.dataset.up !== undefined) {
    const v = $("video", t);
    v && v.play().catch(() => {});
    return;
  }
  if ($("video.rv", t)) return;
  const i = +(t.dataset.clip ?? t.dataset.p);
  if (!isNaN(i)) stops.set(t, play(t, i));
});
document.addEventListener("mouseout", (e) => {
  const t = e.target.closest(".tile,.card");
  if (!t || t.contains(e.relatedTarget)) return;
  delete t.dataset.on;
  const v = $("video", t);
  v && v.pause();
  const s = stops.get(t);
  if (s) {
    s();
    stops.delete(t);
  }
});
$("#file").addEventListener("change", (e) => {
  const fs = [...e.target.files].filter((f) => f.type.startsWith("video/"));
  e.target.value = "";
  if (!fs.length) {
    toast("Choose a video file (MP4, MOV or WebM)");
    return;
  }
  fs.forEach((f) => ups.push({ url: URL.createObjectURL(f), name: f.name }));
  genSrc = ups[ups.length - 1];
  $("#srcname").textContent = "✓ " + genSrc.name;
  renderGrids(off);
  toast(
    fs.length +
      " video" +
      (fs.length > 1 ? "s" : "") +
      " added to Explore, Community and the generator",
  );
});
function vclear() {
  clearInterval(vt);
  vstop && vstop();
  vstop = null;
  $$("#vart video").forEach((v) => v.remove());
  $(".viewer .ctl").style.display = "";
}
function openUp(k) {
  const u = ups[k];
  vclear();
  $("#vuser").textContent = "you";
  $("#vav").style.background = art(k + 3);
  $("#vth").innerHTML = `<i style="background:${art(k + 1)}"></i>`;
  $("#vart").style.background = "#000";
  $("#vart").insertAdjacentHTML(
    "beforeend",
    `<video src="${u.url}" controls autoplay loop playsinline></video>`,
  );
  $(".viewer .ctl").style.display = "none";
  $("#viewer").classList.add("open");
}
const hs = [
  220, 300, 180, 260, 340, 200, 280, 240, 320, 190, 270, 230, 300, 210, 250, 330, 200, 280,
];
renderGrids();

const cards = [
  ["Content Factory", "Trending styles in. Ready-to-post series out.", "Content Factory"],
  ["Reframe 4.0", "Create and edit videos with text, images and references", "Reframe 4.0"],
  ["Recast Lite", "Faster, lighter, cheaper. Same energy.", "Recast Lite"],
  ["Academy", "Learn to create AI images and videos, step by step", "Academy"],
  ["Recast", "One upload in. Endless new visions out.", "Recast"],
];
$("#hero-cards").innerHTML = cards
  .map(
    (c, i) =>
      `<div class="card" tabindex="0" role="button" data-p="${i * 2 + 1}" data-go="gen" data-t="${c[2]}"><div class="art" style="background:${art(i * 2 + 1)}"></div>${vtag(i * 2 + 1)}<span><b>${c[0]}</b><small>${c[1]}</small></span></div>`,
  )
  .join("");
const tl = [
  ["◆", "Recast", "Motion 2.5 apply"],
  ["▣", "Motion 2.5", "The most advanced video model"],
  ["✦", "Supercomputer", "Agent for your creative stack"],
  ["▶", "Reframe 4.0", "Now available"],
  ["◈", "Connect to Claude", "Generate images and videos in chat"],
  ["☺", "AI Influencer", "Build your next hype machine"],
];
$("#tiles").innerHTML = tl
  .map(
    (t) =>
      `<button data-go="gen" data-t="${t[1]}"><i>${t[0]}</i><span><b>${t[1]}</b><small>${t[2]}</small></span></button>`,
  )
  .join("");
const pj = [
  "Don’t Poison Ivy",
  "The Kiss",
  "Thread",
  "Detour",
  "Studio VFX Reel",
  "The Tortoise and the Hare",
  "Control",
  "Azul Cobalto",
];
$("#proj").innerHTML = pj
  .map(
    (p, i) =>
      `<div class="card" tabindex="0" role="button" data-clip="${i + 2}"><div class="art" style="background:${art(i + 4)}"></div>${vtag(i + 4)}<span><b>${p}</b><small>@${users[i]}</small></span></div>`,
  )
  .join("");

/* routing */
function show(id) {
  $$("main>section").forEach((s) => s.classList.toggle("on", s.id === id));
  $$("#nav [data-go]").forEach((b) =>
    b.classList.toggle("on", b.dataset.go === id && !b.dataset.t),
  );
  closeMenus();
  scrollTo(0, 0);
}
function closeMenus() {
  $$(".mega").forEach((m) => m.classList.remove("open"));
}
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("on"), 2200);
}
let vt;
function openClip(i) {
  const o = $("#viewer");
  vclear();
  $("#vart").style.background = art(i);
  $("#vuser").textContent = users[i % users.length];
  $("#vav").style.background = art(i + 3);
  $("#vth").innerHTML =
    `<i style="background:${art(i + 1)}"></i><i style="background:${art(i + 5)}"></i>`;
  o.classList.add("open");
  let p = 0;
  clearInterval(vt);
  $("#pp").textContent = "❚❚";
  vt = setInterval(() => {
    p = (p + 1) % 150;
    $("#bar").style.setProperty("--p", p / 1.5 + "%");
    $("#tm").textContent = "0:" + String(Math.floor(p / 10)).padStart(2, "0") + " / 0:15";
  }, 100);
  vi = i;
  clearInterval(vt);
  $("#vart").insertAdjacentHTML(
    "beforeend",
    `<video src="${vsrc(i)}" autoplay muted loop playsinline controls onerror="this.remove();$('.viewer .ctl').style.display=''"></video>`,
  );
  $(".viewer .ctl").style.display = "none";
}
function closeAll() {
  $$(".ov").forEach((o) => o.classList.remove("open"));
  vclear();
}
document.addEventListener("click", (e) => {
  const m = e.target.closest("[data-menu]");
  if (m) {
    const t = $("#mega-" + m.dataset.menu),
      was = t.classList.contains("open");
    closeMenus();
    if (!was) t.classList.add("open");
    return;
  }
  const g = e.target.closest("[data-go]");
  if (g) {
    e.preventDefault();
    const id = g.dataset.go;
    if (g.dataset.t) {
      $("#gtitle").textContent = g.dataset.t;
      $("#gname").textContent = g.dataset.t;
    }
    show(id);
  } else if (!e.target.closest(".mega")) closeMenus();
  const mo = e.target.closest("[data-modal]");
  if (mo) $("#" + mo.dataset.modal).classList.add("open");
  const cl = e.target.closest("[data-clip]");
  if (cl) openClip(+cl.dataset.clip);
  const up = e.target.closest("[data-up]");
  if (up) openUp(+up.dataset.up);
  if (e.target.closest("[data-upload]")) $("#file").click();
  if (e.target.closest("[data-shuffle]")) {
    off = (Math.random() * 500) | 0;
    renderGrids(off);
    toast("Shuffled");
  }
  if (e.target.closest("[data-close]") || e.target.classList.contains("ov")) closeAll();
  const to = e.target.closest("[data-toast]");
  if (to) toast(to.dataset.toast);
});
$("#pp").addEventListener("click", (e) => {
  e.stopPropagation();
  const on = e.target.textContent === "❚❚";
  e.target.textContent = on ? "▶" : "❚❚";
  if (on) {
    vstop && vstop();
    vstop = null;
  } else if (!vstop) vstop = play($("#vart"), vi);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAll();
    closeMenus();
  }
  if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("card")) {
    e.preventDefault();
    e.target.click();
  }
});

wire();
/* generator */
let n = 0;
$("#go").addEventListener("click", () => {
  const p = $("#prompt").value.trim(),
    c = $("#canvas");
  if (!p && !genSrc) {
    toast("Describe your scene or upload a video first");
    $("#prompt").focus();
    return;
  }
  c.classList.add("run");
  $("#cmsg").textContent = "Generating…";
  $("#go").disabled = true;
  setTimeout(() => {
    c.classList.remove("run");
    const i = n++;
    genStop && genStop();
    genStop = null;
    $$("video,canvas", c).forEach((x) => x.remove());
    c.style.background = art(i + 2, 160);
    $("#cmsg").textContent = "";
    $("#go").disabled = false;
    if (genSrc) {
      const hu = (i * 70) % 360;
      c.insertAdjacentHTML(
        "beforeend",
        `<video src="${genSrc.url}" autoplay muted loop playsinline style="filter:hue-rotate(${hu}deg) saturate(1.3)"></video>`,
      );
      $("#hist").insertAdjacentHTML(
        "afterbegin",
        `<button class="tile up" data-up="${ups.indexOf(genSrc)}" aria-label="Open result"><div class="art" style="height:100%"></div><video src="${genSrc.url}#t=0.1" muted loop playsinline preload="metadata" style="filter:hue-rotate(${hu}deg)"></video></button>`,
      );
    } else {
      c.insertAdjacentHTML(
        "beforeend",
        `<video src="${vsrc(i + 2)}" autoplay muted loop playsinline></video>`,
      );
      $("#hist").insertAdjacentHTML(
        "afterbegin",
        `<button class="tile" data-clip="${i + 2}" aria-label="Open result"><div class="art" style="background:${art(i + 2, 160)}"></div>${vtag(i + 2)}</button>`,
      );
      wire($("#hist"));
    }
    toast("Done · saved to history");
  }, 2200);
});
$("#prompt").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    $("#go").click();
  }
});
