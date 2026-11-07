// リハに活かす薬剤ナビ 本体
// 画面は URL の # で切り替える：#home / #groups / #g/<群ID> / #tag/<タグID> / #select / #quiz / #quiz/<問題ID> / #fav / #about
// 患者情報は扱わない。保存するのはお気に入り（カードID・問題ID）と最近見たカードだけ（端末のブラウザ内）。
// 複数の薬の選択（#select）は画面を閉じると消える（保存しない）。
(function () {
  "use strict";
  var D = window.DATA || { groups: [], drugs: [], tags: [], fields: [], quizzes: [] };
  var F = window.FIGURES || {};
  var main = document.getElementById("main");

  var groupById = {}, tagById = {}, fieldById = {}, quizById = {};
  D.groups.forEach(function (g) { groupById[g.id] = g; });
  D.tags.forEach(function (t) { tagById[t.id] = t; });
  D.fields.forEach(function (f) { fieldById[f.id] = f; });
  // 場面クイズは分野の並び順にそろえる
  (function () {
    var order = {}; D.fields.forEach(function (f, i) { order[f.id] = i; });
    var gi = {}; D.groups.forEach(function (g, i) { gi[g.id] = i; });
    D.quizzes = D.quizzes.map(function (q, i) { return { q: q, i: i }; }).sort(function (a, b) {
      var ga = groupById[a.q.group] || {}, gb = groupById[b.q.group] || {};
      return ((order[ga.field] || 0) - (order[gb.field] || 0)) || ((gi[a.q.group] || 0) - (gi[b.q.group] || 0)) || (a.i - b.i);
    }).map(function (x) { return x.q; });
  })();
  D.quizzes.forEach(function (q) { quizById[q.id] = q; });
  function drugsOf(gid) { return D.drugs.filter(function (d) { return d.group === gid; }); }

  // ---------- 保存（端末内のみ。使えない環境でも動くようにする） ----------
  function load(key, def) {
    try { var v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : def; } catch (e) { return def; }
  }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* 保存できなくても表示は続ける */ } }
  var fav = load("yakuzai.fav", []);
  var recent = load("yakuzai.recent", []);
  var selected = []; // 群ID。保存しない
  function isFav(key) { return fav.indexOf(key) >= 0; }
  function toggleFav(key) {
    var i = fav.indexOf(key);
    if (i >= 0) fav.splice(i, 1); else fav.unshift(key);
    save("yakuzai.fav", fav);
  }
  function pushRecent(id) {
    recent = [id].concat(recent.filter(function (x) { return x !== id; })).slice(0, 8);
    save("yakuzai.recent", recent);
  }

  // ---------- 小物 ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // **太字** だけを許す簡易書式
  // 用語の説明（新人向け）。本文中の用語に点線を付け、押すと画面下に短い説明を出す。説明は一般的な言い換えで、診療の判断基準ではない
  var GLOSSARY = {
    "QT延長": "心電図の波形（QT 時間）が延びること。危ない不整脈（心室頻拍など）につながることがある。",
    "PR間隔": "心電図で、心房から心室へ電気が伝わるまでの時間。延びると心臓の電気の伝わりが遅れている。",
    "Infusion reaction": "点滴中〜点滴後に出る、発熱・寒気・息苦しさ・血圧低下などの反応。",
    "骨頭無菌性壊死": "大腿骨頭などの骨への血流が途絶えて骨が壊れること。股関節の痛みで気づくことがある。",
    "SIADH": "抗利尿ホルモンが出すぎて、腎臓が水を体に戻しすぎ、血液のナトリウムが薄くなる状態（低ナトリウム血症）。むくみは目立たないことが多く、だるさ・吐き気・ぼんやり・けいれんなどで気づく。",
    "wearing-off": "薬の効いている時間が短くなり、次の服薬の前に症状が悪くなる現象。",
    "クリーゼ": "重症筋無力症などで、筋力低下が急に進み、呼吸が苦しくなる状態。",
    "類天疱瘡": "皮膚に水ぶくれ（水疱）ができる病気。DPP-4阻害薬の副作用として知られる。",
    "レッドネック症候群": "バンコマイシンを速く点滴したときなどに、顔・首・上半身が赤くなり、かゆみや血圧低下が出る反応。",
    "起座呼吸": "横になると息苦しく、起き上がると楽になる呼吸。心不全のサインのことがある。",
    "錐体外路症状": "体の動きを調節する脳の回路（錐体外路系）の働きが乱れて起きる、ふるえ・こわばり・動きにくさ・そわそわ（アカシジア）・体がねじれる（ジストニア）などの症状。抗精神病薬などの副作用として出ることがある。",
    "悪性症候群": "高熱・強いこわばり・意識の変化・発汗などが急に出る、まれだが重い副作用。すぐに報告する。",
    "横紋筋融解症": "筋肉が壊れて、筋肉の痛み・脱力・赤褐色の尿が出る状態。腎臓を悪くすることがある。",
    "ジスキネジア": "自分の意思と関係なく、体や手足が勝手に動く症状。",
    "骨髄抑制": "骨髄で血液がつくられにくくなり、白血球・赤血球・血小板が減ること。感染・貧血・出血が起きやすくなる。",
    "irAE": "免疫チェックポイント阻害薬で、免疫が自分の臓器を攻撃して起きる副作用（免疫関連有害事象）。",
    "間質性肺炎": "肺胞の壁など、肺の支えになる部分（間質）に炎症が起き、息切れ・空咳・発熱が出る。急に悪くなることがある。",
    "間質性肺疾患": "肺胞の壁など、肺の支えになる部分（間質）に炎症や線維化が起きる病気の総称。息切れ・空咳・発熱が出る。",
    "乳酸アシドーシス": "血液に乳酸がたまって酸性に傾く重い状態。胃腸症状・だるさ・筋肉痛・速い呼吸が初期症状。",
    "ケトアシドーシス": "インスリンが足りず、体がケトン体を使って血液が酸性に傾く状態。吐き気・腹痛・だるさ・速い呼吸。SGLT2阻害薬では、血糖が高くなくても起こることがある。",
    "前向性健忘": "薬を飲んだあとの出来事を覚えていないこと。",
    "血管性浮腫": "顔・くちびる・舌・のどが急に腫れること。のどが腫れると息がしにくくなり、危ない。",
    "偽膜性大腸炎": "抗菌薬のあとに起きることがある重い大腸炎。頻回の下痢・腹痛・発熱・血便。",
    "眼瞼下垂": "まぶたが下がって、目が開けにくくなること。",
    "Tmax": "薬を飲んでから、血液中の薬の濃さが最も高くなるまでの時間。",
    "半減期": "血液中の薬の濃さが、下がっていく途中で半分になるまでにかかる時間。長いほど薬が体に長く残る。効き目が続く時間とは一致しないことがある（カードの「作用持続」も見る）。",
    "DOAC": "ワルファリン以外の飲む抗凝固薬（アピキサバン・リバーロキサバン・エドキサバン・ダビガトラン）。",
    "PT-INR": "血液の固まりにくさを表す検査値。ワルファリンの効き具合を見るのに使う。",
    "QT間隔延長": "心電図の波形（QT 時間）が延びること。危ない不整脈（心室頻拍など）につながることがある。",
    "レッドネック（レッドマン）症候群": "バンコマイシンを速く点滴したときなどに、顔・首・上半身が赤くなり、かゆみや血圧低下が出る反応。",
    "eGFR": "腎臓がどれだけ血液をろ過できているかの目安。低いほど腎機能が落ちている。",
    "CK": "筋肉が傷つくと血液中に増える酵素の値。横紋筋融解症などで上がる。",
    "BNP": "心臓に負担がかかると血液中に増えるホルモンの値。心不全の目安に使う。",
    "LVEF": "心臓が1回の拍動で送り出す血液の割合（左室駆出率）。低いほど心臓のポンプの力が弱い。",
    "第8脳神経障害": "聞こえと体のバランスをつかさどる神経の障害。耳鳴り・難聴・めまい・ふらつき。"
  };
  var GLOSS_RE = new RegExp("(" + Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; })
    .map(function (k) { return k.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&"); }).join("|") + ")", "g");
  function gloss(html) {
    // タグの中（属性）には入れない
    return html.split(/(<[^>]+>)/).map(function (part) {
      return part.charAt(0) === "<" ? part : part.replace(GLOSS_RE, '<span class="term" role="button" tabindex="0" data-term="$1">$1</span>');
    }).join("");
  }
  function fmt(s) { return gloss(esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")); }
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest && ev.target.closest(".term");
    var box = document.getElementById("glossBox");
    if (!t) { if (box && !ev.target.closest("#glossBox")) box.hidden = true; return; }
    ev.preventDefault();
    ev.stopPropagation();
    if (!box) {
      box = document.createElement("div");
      box.id = "glossBox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-live", "polite");
      document.body.appendChild(box);
    }
    var k = t.getAttribute("data-term");
    box.innerHTML = '<b>' + esc(k) + '</b><p>' + esc(GLOSSARY[k] || "") + '</p><button type="button" class="gloss-close" aria-label="閉じる">閉じる</button>';
    box.hidden = false;
    box.querySelector(".gloss-close").addEventListener("click", function () { box.hidden = true; });
  }, true);
  window.addEventListener("hashchange", function () { var box = document.getElementById("glossBox"); if (box) box.hidden = true; });
  document.addEventListener("keydown", function (ev) {
    if ((ev.key === "Enter" || ev.key === " ") && ev.target.classList && ev.target.classList.contains("term")) { ev.preventDefault(); ev.target.click(); }
  });
  function norm(s) {
    return String(s || "").normalize("NFKC").toLowerCase()
      .replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
      .replace(/[\s・®™ー-]/g, "");
  }
  function tagHtml(id, small) {
    var t = tagById[id]; if (!t) return "";
    return '<a class="tag ' + esc(t.cls) + (small ? " sm" : "") + '" href="#tag/' + esc(id) + '"><span class="dot"></span>' + esc(t.name) + "</a>";
  }
  var ICON = {
    star: '<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21" stroke-linecap="round"/></svg>'
  };
  function updateSelBadge() {
    var b = document.getElementById("selBadge");
    b.hidden = selected.length === 0;
    document.getElementById("selCount").textContent = selected.length;
  }

  // ---------- 検索 ----------
  var index = [];
  D.groups.forEach(function (g) {
    index.push({ kind: "g", id: g.id, label: g.name, sub: fieldById[g.field] ? fieldById[g.field].name : "",
      key: norm([g.name, g.examples, (g.keywords || []).join(" ")].join(" ")) });
  });
  D.drugs.forEach(function (d) {
    var g = groupById[d.group]; if (!g) return;
    index.push({ kind: "d", id: g.id, drug: d.id, label: d.generic + (d.brands.length ? "（" + d.brands.join("・") + "）" : ""), sub: g.name,
      key: norm(d.generic + " " + d.brands.join(" ")) });
  });
  D.tags.forEach(function (t) {
    index.push({ kind: "t", id: t.id, label: t.name, sub: "症状から探す", key: norm(t.name + " " + (t.keywords || "")) });
  });
  function search(q) {
    var k = norm(q); if (!k) return [];
    var hits = index.filter(function (e) { return e.key.indexOf(k) >= 0; });
    hits.sort(function (a, b) { return (a.key.indexOf(k) === 0 ? 0 : 1) - (b.key.indexOf(k) === 0 ? 0 : 1); });
    return hits.slice(0, 20);
  }
  function resultsHtml(hits) {
    if (!hits.length) return '<p class="empty">見つかりませんでした。一般名・商品名・薬効群名・症状（ふらつき など）で探せます。</p>';
    return hits.map(function (h) {
      var href = h.kind === "t" ? "#tag/" + h.id : "#g/" + h.id + (h.drug ? "/" + h.drug : "");
      return '<a class="res" href="' + esc(href) + '"><span><span class="r-main">' + esc(h.label) + '</span><br><span class="r-sub">' +
        esc(h.sub) + '</span></span><span class="chev" aria-hidden="true">›</span></a>';
    }).join("");
  }

  // ---------- ホーム ----------
  function viewHome() {
    var rec = recent.filter(function (id) { return groupById[id]; });
    main.innerHTML =
      '<section class="hero"><p class="hero-kicker">今日の患者さんの薬、リハ前にひと確認</p>' +
      '<h1>どの薬を飲んでいる人？</h1><p class="hero-sub">薬の名前・症状から、<b>患者さんのそばで見ること</b>がわかります。</p>' +
      '<div class="hero-chips"><span class="hc drug">💊 薬</span><span class="hc-arrow">→</span><span class="hc body">🫀 体の変化</span><span class="hc-arrow">→</span><span class="hc rehab">🧑‍⚕️ そばで見ること</span></div></section>' +
      '<label class="search">' + ICON.search + '<input id="q" type="search" placeholder="例：メインテート、DOAC、ふらつき" autocomplete="off" enterkeyhint="search" aria-label="薬を検索"></label>' +
      '<div class="panel results" id="res" hidden></div>' +
      '<section class="sec" style="margin-top:18px"><h2>分野から探す</h2><div class="fgrid">' + D.fields.filter(function (f) { return D.groups.some(function (g) { return g.field === f.id; }); }).map(function (f) {
        return '<a class="fchip f-' + esc(f.id) + '" href="#groups/' + esc(f.id) + '">' + ficon(f.id) + "<span>" + esc(f.name) + "</span></a>";
      }).join("") + "</div></section>" +
      '<section class="sec"><h2>症状から探す</h2><div class="tags">' + D.tags.map(function (t) { return tagHtml(t.id); }).join("") + "</div></section>" +
      (rec.length ? '<section class="sec"><h2>最近見たカード</h2><div class="glist">' + rec.map(gcard).join("") + "</div></section>" : "") +
      '<section class="sec"><h2>場面で考える</h2><a class="gcard quizcard" href="#quiz"><div class="g-name"><span class="ficon" aria-hidden="true">🎯</span><span>場面クイズ</span></div><div class="g-ex">「この患者さん、リハの前に何を確かめる？」を架空の場面で練習（' + D.quizzes.length + "問）</div></a></section>" +
      '<p class="home-foot"><a href="#about/share">この教材を使う・共有する方へ</a></p>';
    var q = document.getElementById("q"), res = document.getElementById("res");
    q.addEventListener("input", function () {
      var v = q.value.trim();
      res.hidden = !v;
      if (v) res.innerHTML = resultsHtml(search(v));
    });
  }

  // 分野ごとのアイコンと色（styles.css の --f-<分野ID>）
  var FIELD_ICON = { cv: "❤️", at: "🩸", dm: "🍬", cns: "🧠", pain: "💊", onc: "🎗️", imm: "🛡️", abx: "🦠" };
  function ficon(fid) { return '<span class="ficon f-' + esc(fid) + '" aria-hidden="true">' + (FIELD_ICON[fid] || "💊") + "</span>"; }
  function gcard(id) {
    var g = groupById[id];
    return '<a class="gcard f-' + esc(g.field) + '" href="#g/' + esc(g.id) + '"><div class="g-name">' + ficon(g.field) + "<span>" + esc(g.name) + '</span></div><div class="g-ex">' + esc(g.examples) +
      '</div><div class="tags">' + g.tags.map(function (t) { return tagHtml(t, true).replace(/^<a /, "<span ").replace(/<\/a>$/, "</span>").replace(/ href="[^"]*"/, ""); }).join("") + "</div></a>";
  }

  // ---------- 薬効群の一覧 ----------
  function viewGroups(fid) {
    var html = '<h1>薬効群</h1><p class="sub">分野ごとに並べています。</p>';
    D.fields.forEach(function (f) {
      var gs = D.groups.filter(function (g) { return g.field === f.id; });
      if (!gs.length) return;
      html += '<section class="field f-' + esc(f.id) + '" id="field-' + esc(f.id) + '"><h2>' + ficon(f.id) + esc(f.name) + '<span class="fcount">' + gs.length + '</span></h2><div class="glist">' +
        gs.map(function (g) { return gcard(g.id); }).join("") + "</div></section>";
    });
    main.innerHTML = html;
    if (fid) { var el = document.getElementById("field-" + fid); if (el) setTimeout(function () { el.scrollIntoView(); window.scrollBy(0, -64); }, 0); }
  }

  // ---------- 症状タグ ----------
  function viewTag(id) {
    var t = tagById[id];
    if (!t) return viewHome();
    var gs = D.groups.filter(function (g) { return g.tags.indexOf(id) >= 0; });
    main.innerHTML = '<p class="crumb"><a href="#home">ホーム</a> › 症状から探す</p><h1>' + esc(t.name) + "</h1>" +
      '<p class="sub">' + esc(t.desc) + "</p>" +
      '<p class="sub">この症状に関係しうる薬効群（' + gs.length + "）</p>" +
      '<div class="glist">' + gs.map(function (g) { return gcard(g.id); }).join("") + "</div>";
  }

  // ---------- カード詳細 ----------
  function viewGroup(id, drugId) {
    var g = groupById[id];
    if (!g) return viewHome();
    pushRecent(id);
    var drugs = drugsOf(id);
    var favKey = "g:" + id;
    var sel = selected.indexOf(id) >= 0;
    var n = 0;
    function sec(title, body, cls) { n++; return '<section class="panel sec' + (cls ? " " + cls : "") + '"><h2 class="sec-title"><span class="num">' + n + "</span>" + esc(title) + "</h2>" + body + "</section>"; }
    function list(items, cls) { return items && items.length ? '<ul' + (cls ? ' class="' + cls + '"' : "") + ">" + items.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ul>" : '<p class="empty">—</p>'; }

    var labs = (g.labs || []).map(function (l) {
      return D.labBase ? '<a class="lab-link" href="' + esc(D.labBase + "#items/" + encodeURIComponent(l.q)) + '" target="_blank" rel="noopener">' + esc(l.label) + " を検査値ラボで見る ↗</a>" : "";
    }).join(" ");

    var html =
      '<div class="card-hero f-' + esc(g.field) + '"><p class="crumb"><a href="#groups/' + esc(g.field) + '">' + ficon(g.field) + esc(fieldById[g.field] ? fieldById[g.field].name : "") + "</a></p>" +
      '<div class="card-head"><div><h1>' + esc(g.name) + '</h1><p class="sub" style="margin-bottom:8px">' + esc(g.examples) + "</p></div>" +
      '<div class="card-actions">' +
      '<button class="iconbtn fav' + (isFav(favKey) ? " on" : "") + '" id="favBtn" aria-pressed="' + isFav(favKey) + '" aria-label="お気に入り">' + ICON.star + "</button>" +
      "</div></div>" +
      '<div class="tags">' + g.tags.map(function (t) { return tagHtml(t, true); }).join("") + "</div></div>" +
      sec("患者さんのそばで見るポイント", '<ul class="points">' + g.points.map(function (p) { return '<li><span class="ph">' + fmt(p.h) + "</span>" + fmt(p.t) + "</li>"; }).join("") + "</ul>", "key") +
      sec("介入前の確認", list(g.before) + (labs ? '<p class="small" style="margin:8px 0 0">' + labs + "</p>" : "")) +
      sec("医師・看護師へ報告する目安", list(g.report, "report")) +
      sec("薬効の仕組み", figureHtml(g) + (g.mechanism ? '<p class="mech-note">' + fmt(g.mechanism) + "</p>" : "")) +
      sec("時間の情報", timelineSection(g, drugs, drugId)) +
      sec("主な副作用（リハに関係するもの）", list(g.adverse)) +
      sec("個別の薬", drugTable(drugs, drugId)) +
      '<div class="panel" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between">' +
      '<span class="small muted">他の薬と合わせて、注意点の重なりを見る</span>' +
      '<button class="btn' + (sel ? " ghost" : "") + '" id="selBtn">' + (sel ? "選択から外す" : "選択に追加") + "</button></div>" +
      '<details class="panel src"><summary>出典</summary><ol>' + g.sources.map(function (s) { return "<li>" + linkify(s) + "</li>"; }).join("") + "</ol></details>";
    main.innerHTML = html;

    document.getElementById("favBtn").addEventListener("click", function () {
      toggleFav(favKey);
      this.classList.toggle("on", isFav(favKey));
      this.setAttribute("aria-pressed", isFav(favKey));
    });
    document.getElementById("selBtn").addEventListener("click", function () {
      var i = selected.indexOf(id);
      if (i >= 0) selected.splice(i, 1); else selected.push(id);
      updateSelBadge();
      viewGroup(id, drugId);
    });
    bindTimeline(g, drugs);
    if (drugId) {
      var row = document.getElementById("drug-" + drugId);
      if (row) setTimeout(function () { row.scrollIntoView({ block: "center" }); }, 0);
    }
  }

  function linkify(s) {
    return esc(s).replace(/(https?:\/\/[^\s）)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  // 薬 → 体の変化 → 患者さんのそばで見ること の流れ（幅が狭いときは縦に並ぶ）
  function flowHtml(g) {
    if (!g.flow || !g.flow.length) return "";
    var label = { drug: "薬", body: "体の変化", rehab: "患者さんのそばで見ること" };
    return '<ol class="flow">' + g.flow.map(function (s) {
      return '<li class="fl ' + esc(s.k) + '"><span class="fl-k">' + esc(label[s.k] || "") + '</span><span class="fl-t">' + fmt(s.t) + "</span></li>";
    }).join("") + "</ol>";
  }

  function figureHtml(g) {
    var f = F[g.figure];
    if (!f) return flowHtml(g);
    return flowHtml(g) + '<div class="fig" role="img" aria-label="' + esc(f.alt) + '">' + f.svg + "</div>" +
      '<div class="fig-legend"><span><i style="border-color:var(--promote)"></i>促す・増える</span><span><i style="border-color:var(--inhibit)"></i>抑える（⊣）</span>' +
      '<span><b style="color:var(--drug)">■</b> 薬</span><span><b style="color:var(--body)">■</b> 体の変化</span><span><b style="color:var(--rehab)">■</b> 患者さんのそばで見ること</span></div>';
  }

  function drugTable(drugs, drugId) {
    if (!drugs.length) return '<p class="empty">—</p>';
    return '<div class="tbl-wrap"><table class="drugs"><thead><tr><th>一般名（商品名）</th><th>' + gloss("Tmax") + '</th><th>' + gloss("半減期") + '</th><th class="mob">作用持続</th><th>排泄</th><th>メモ</th></tr></thead><tbody>' +
      drugs.map(function (d) {
        return '<tr id="drug-' + esc(d.id) + '"' + (d.id === drugId ? ' class="hl"' : "") + '><td class="nm"><b>' + esc(d.generic) + "</b><span>" + esc(d.brands.join("・")) +
          "</span></td><td data-l=\"Tmax\">" + esc(d.tmax || "—") + "</td><td data-l=\"半減期\">" + esc(d.thalf || "—") + "</td>" +
          (d.duration ? "<td data-l=\"作用持続\" class=\"mob\">" + esc(d.duration) + "</td>" : "<td class=\"mob empty-cell\"></td>") +
          "<td data-l=\"排泄\">" + esc(d.excretion || "—") + "</td><td data-l=\"メモ\"" + (d.note ? "" : " class=\"empty-cell\"") + "><span>" + fmt(d.note || "") + "</span></td></tr>";
      }).join("") + "</tbody></table></div><p class=\"small muted\" style=\"margin:8px 0 0\">値は添付文書の薬物動態の項より（条件は出典を参照）。</p>";
  }

  // ---------- 時間の帯グラフ ----------
  // 1-コンパートメント・経口吸収モデルで、添付文書の Tmax と半減期に合う「形」を描く模式図。実際の濃度・効果の時間経過とは一致しない。
  function kaFor(ke, tmax) {
    // tmax = ln(ka/ke)/(ka-ke) を満たす ka（> ke）を二分法で求める
    var lo = ke * 1.0001, hi = ke * 1000;
    function f(ka) { return Math.log(ka / ke) / (ka - ke) - tmax; }
    if (f(hi) > 0) return hi;
    for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  // 図の幅は表示先の実寸に合わせる（スマホで文字が小さくならないように）
  function tlWidth() {
    var el = document.getElementById("tlFig");
    var w = el ? el.clientWidth : main.clientWidth - 64;
    return Math.max(300, Math.min(680, Math.round(w || 340)));
  }
  function timelineSvg(g, d) {
    var span = g.timeline.span || 24;
    var W = tlWidth(), narrow = W < 460, H = narrow ? 220 : 240, L = narrow ? 34 : 40, R = 12, T = 36, B = 40;
    var pw = W - L - R, ph = H - T - B;
    function X(t) { return L + pw * t / span; }
    function Y(c) { return T + ph * (1 - c); }
    var ke = Math.LN2 / d.thalfNum, ka = kaFor(ke, d.tmaxNum);
    function C(t) { return Math.exp(-ke * t) - Math.exp(-ka * t); }
    var cmax = C(d.tmaxNum), pts = [], peak = [], half = null, steps = 240;
    for (var i = 0; i <= steps; i++) {
      var t = span * i / steps, c = C(t) / cmax;
      pts.push(X(t).toFixed(1) + "," + Y(c).toFixed(1));
      if (c >= 0.8) peak.push(t);
      if (half === null && t > d.tmaxNum && c <= 0.5) half = t;
    }
    var p0 = peak[0], p1 = peak[peak.length - 1];
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">';
    // 帯：ピーク付近（最高値の80%以上）
    s += '<rect x="' + X(p0).toFixed(1) + '" y="' + T + '" width="' + (X(p1) - X(p0)).toFixed(1) + '" height="' + ph + '" fill="var(--band-peak)"/>';
    // 帯：ピーク以降、半分になるまで
    if (half !== null && g.timeline.after) s += '<rect x="' + X(p1).toFixed(1) + '" y="' + T + '" width="' + (X(half) - X(p1)).toFixed(1) + '" height="' + ph + '" fill="var(--band-mid)"/>';
    // 目盛り
    var stepH = span <= 12 ? 2 : span <= 24 ? (narrow ? 6 : 4) : span <= 48 ? 12 : 24;
    for (var h = 0; h <= span; h += stepH) {
      s += '<line x1="' + X(h) + '" y1="' + T + '" x2="' + X(h) + '" y2="' + (T + ph) + '" stroke="var(--line)" stroke-width="1"/>';
      s += '<text x="' + X(h) + '" y="' + (T + ph + 18) + '" font-size="13" text-anchor="middle" fill="var(--ink-3)">' + h + "</text>";
    }
    s += '<text x="' + (L + pw) + '" y="' + (H - 4) + '" font-size="12.5" text-anchor="end" fill="var(--ink-3)">服用後の時間（時間）</text>';
    s += '<text x="' + L + '" y="' + (H - 4) + '" font-size="12.5" text-anchor="start" fill="var(--drug)">▲服用</text>';
    s += '<line x1="' + L + '" y1="' + (T + ph) + '" x2="' + (L + pw) + '" y2="' + (T + ph) + '" stroke="var(--ink-3)" stroke-width="1.5"/>';
    s += '<text x="' + (L - 8) + '" y="' + (T + 10) + '" font-size="12" text-anchor="end" fill="var(--ink-3)">高</text>';
    s += '<text x="' + (L - 8) + '" y="' + (T + ph) + '" font-size="12" text-anchor="end" fill="var(--ink-3)">低</text>';
    s += '<text x="' + (L - 26) + '" y="' + (T + ph / 2) + '" font-size="12" text-anchor="middle" fill="var(--ink-3)" transform="rotate(-90 ' + (L - 26) + " " + (T + ph / 2) + ')">血中濃度</text>';
    // 曲線
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--drug)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    // 服用・Tmax・半分の印
    s += '<path d="M' + X(0) + " " + (T + ph + 1) + " l-6 9 h12 z\" fill=\"var(--drug)\"/>";
    s += '<line x1="' + X(d.tmaxNum) + '" y1="' + Y(1) + '" x2="' + X(d.tmaxNum) + '" y2="' + (T + ph) + '" stroke="var(--drug)" stroke-width="1.5" stroke-dasharray="4 4"/>';
    s += '<circle cx="' + X(d.tmaxNum) + '" cy="' + Y(1) + '" r="5" fill="var(--surface)" stroke="var(--drug)" stroke-width="2.5"/>';
    var tx = X(d.tmaxNum), anchor = "middle";
    if (tx < L + 70) { tx = Math.max(X(d.tmaxNum) - 8, L); anchor = "start"; }
    if (tx > W - R - 70) { tx = W - R; anchor = "end"; }
    s += '<text x="' + tx + '" y="' + (Y(1) - 12) + '" font-size="13.5" font-weight="700" fill="var(--ink)" text-anchor="' + anchor + '">ピーク（約' + fmtNum(d.tmaxNum) + "時間）</text>";
    if (half !== null) {
      s += '<circle cx="' + X(half) + '" cy="' + Y(0.5) + '" r="4.5" fill="var(--surface)" stroke="var(--body)" stroke-width="2.5"/>';
      // 曲線は右下がりなので、ラベルは点の左下（曲線の下側）に置くと線と重ならない
      var hx = X(half) - 8, ha = "end";
      if (hx < L + 90) { hx = X(half) + 10; ha = "start"; }
      s += '<text x="' + hx + '" y="' + (Y(0.5) + 22) + '" font-size="13" fill="var(--ink-2)" text-anchor="' + ha + '">ピークの半分</text>';
    }
    s += "</svg>";
    return s;
  }
  function fmtNum(n) { return (Math.round(n * 10) / 10).toString(); }

  function timelineSection(g, drugs, drugId) {
    var tl = g.timeline || {};
    var plotted = drugs.filter(function (d) { return d.tmaxNum > 0 && d.thalfNum > 0; });
    var html = "";
    if (tl.lead) html += '<p class="mech-note" style="margin:0 0 10px">' + fmt(tl.lead) + "</p>";
    if (plotted.length) {
      var cur = plotted.filter(function (d) { return d.id === drugId; })[0] || plotted[0];
      html += '<div class="drug-pick" role="group" aria-label="図に表示する薬">' + plotted.map(function (d) {
        return '<button class="chip' + (d.id === cur.id ? " on" : "") + '" data-drug="' + esc(d.id) + '" aria-pressed="' + (d.id === cur.id) + '">' + esc(d.generic) + "</button>";
      }).join("") + "</div>" +
        '<div class="fig" id="tlFig" role="img" aria-label="服用後の血中濃度の時間経過の模式図">' + timelineSvg(g, cur) + "</div>" +
        '<div class="tl-facts" id="tlFacts">' + factsHtml(cur) + "</div>";
    }
    var bands = [];
    if (plotted.length && tl.peak) bands.push('<li><span class="sw" style="background:var(--band-peak);outline:1px solid var(--inhibit)"></span><span><span class="tm">ピーク付近</span>' + fmt(tl.peak) + "</span></li>");
    if (plotted.length && tl.after) bands.push('<li><span class="sw" style="background:var(--band-mid);outline:1px solid var(--t-fall)"></span><span><span class="tm">その後</span>' + fmt(tl.after) + "</span></li>");
    if (tl.anytime) bands.push('<li><span class="sw" style="background:var(--band-low);outline:1px solid var(--rehab)"></span><span><span class="tm">時間に関係なく</span>' + fmt(tl.anytime) + "</span></li>");
    if (bands.length) html += '<ul class="tl-bands">' + bands.join("") + "</ul>";
    if (plotted.length) html += '<p class="small muted" style="margin:10px 0 0">曲線は Tmax と半減期から描いた模式図です。効き目の長さは血中濃度と一致しないことがあります（作用持続を参照）。</p>';
    return html;
  }
  function factsHtml(d) {
    return "<span>Tmax <b>" + esc(d.tmax || "—") + "</b></span><span>半減期 <b>" + esc(d.thalf || "—") + "</b></span>" +
      (d.duration ? "<span>作用持続 <b>" + esc(d.duration) + "</b></span>" : "");
  }
  var tlCurrent = null;
  window.addEventListener("resize", function () {
    if (!tlCurrent || !document.getElementById("tlFig")) return;
    clearTimeout(tlCurrent.t);
    tlCurrent.t = setTimeout(function () { document.getElementById("tlFig").innerHTML = timelineSvg(tlCurrent.g, tlCurrent.d); }, 150);
  });
  function bindTimeline(g, drugs) {
    var first = main.querySelector(".drug-pick .chip.on");
    if (first) {
      tlCurrent = { g: g, d: drugs.filter(function (x) { return x.id === first.getAttribute("data-drug"); })[0] };
      document.getElementById("tlFig").innerHTML = timelineSvg(g, tlCurrent.d);
    }
    var chips = main.querySelectorAll(".drug-pick .chip");
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () {
        var d = drugs.filter(function (x) { return x.id === c.getAttribute("data-drug"); })[0];
        Array.prototype.forEach.call(chips, function (o) { o.classList.toggle("on", o === c); o.setAttribute("aria-pressed", o === c); });
        tlCurrent = { g: g, d: d };
        document.getElementById("tlFig").innerHTML = timelineSvg(g, d);
        document.getElementById("tlFacts").innerHTML = factsHtml(d);
      });
    });
  }

  // ---------- 選択中：リスクタグの重なり ----------
  function viewSelect() {
    var html = '<h1>選択中の薬効群</h1><p class="sub">注意点（リスクタグ）の重なりを表示します。相互作用の判定ではありません。</p>';
    if (!selected.length) {
      main.innerHTML = html + '<p class="empty">まだ選択されていません。カードの「選択に追加」から加えてください。</p>';
      return;
    }
    var count = {};
    selected.forEach(function (gid) { groupById[gid].tags.forEach(function (t) { (count[t] = count[t] || []).push(gid); }); });
    var rows = Object.keys(count).sort(function (a, b) { return count[b].length - count[a].length; });
    html += '<section class="panel"><h2>選んだカード</h2><div class="tags">' + selected.map(function (gid) {
      return '<a class="tag gen" href="#g/' + esc(gid) + '">' + esc(groupById[gid].name) + "</a>";
    }).join("") + '</div><p style="margin:12px 0 0"><button class="btn ghost" id="clr">選択をすべて外す</button></p></section>' +
      '<section class="panel"><h2>注意点の重なり</h2><div class="overlap">' + rows.map(function (t) {
        var tg = tagById[t], n = count[t].length;
        return '<div class="ov-row tag ' + esc(tg.cls) + (n > 1 ? " multi" : "") + '" style="border-radius:10px"><span><span>' + esc(tg.name) + '</span><br><span class="ov-from">' +
          count[t].map(function (g) { return esc(groupById[g].name); }).join("・") + '</span></span><span class="ov-count">' + n + "</span></div>";
      }).join("") + "</div></section>" +
      '<p class="notice">2つ以上重なっている注意点は、介入中の観察を手厚くしてください。気になる組み合わせは、薬剤師・医師に確認してください。</p>';
    main.innerHTML = html;
    document.getElementById("clr").addEventListener("click", function () { selected = []; updateSelBadge(); viewSelect(); });
  }

  // ---------- 場面クイズ ----------
  function viewQuizList() {
    main.innerHTML = '<h1>場面クイズ</h1><p class="sub">架空の場面です。介入前に何を確かめるかを考えてから選んでください。</p><div class="glist">' +
      D.quizzes.map(function (q, i) {
        var g = groupById[q.group];
        return '<a class="gcard f-' + esc(g ? g.field : "") + '" href="#quiz/' + esc(q.id) + '"><div class="g-name">' + ficon(g ? g.field : "") + "<span>問" + (i + 1) + "　" + esc(q.title) + '</span></div><div class="g-ex">' + esc(g ? g.name : "") +
          (isFav("q:" + q.id) ? "　★" : "") + "</div></a>";
      }).join("") + "</div>";
  }
  function viewQuiz(id) {
    var q = quizById[id];
    if (!q) return viewQuizList();
    var idx = D.quizzes.indexOf(q), next = D.quizzes[idx + 1];
    var favKey = "q:" + id;
    main.innerHTML = '<p class="crumb"><a href="#quiz">場面クイズ</a> › 問' + (idx + 1) + "</p>" +
      '<div class="card-head"><h1>' + esc(q.title) + '</h1><div class="card-actions"><button class="iconbtn fav' + (isFav(favKey) ? " on" : "") + '" id="favBtn" aria-pressed="' + isFav(favKey) + '" aria-label="お気に入り">' + ICON.star + "</button></div></div>" +
      '<div class="scene"><span class="who">' + esc(q.who) + "</span>" + fmt(q.scene) + "</div>" +
      '<p style="font-weight:700;margin:0 0 10px">' + fmt(q.question) + "</p>" +
      '<div class="choices">' + q.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '">' + esc(c.t) + "</button>"; }).join("") + "</div>" +
      '<div id="exp" hidden></div>';
    document.getElementById("favBtn").addEventListener("click", function () {
      toggleFav(favKey); this.classList.toggle("on", isFav(favKey)); this.setAttribute("aria-pressed", isFav(favKey));
    });
    Array.prototype.forEach.call(main.querySelectorAll(".choice"), function (b) {
      b.addEventListener("click", function () {
        var picked = q.choices[+b.getAttribute("data-i")];
        Array.prototype.forEach.call(main.querySelectorAll(".choice"), function (o, i) {
          o.disabled = true;
          if (q.choices[i].ok) o.classList.add("ok"); else if (o === b) o.classList.add("ng");
        });
        var exp = document.getElementById("exp");
        exp.hidden = false;
        exp.className = "explain";
        // 選択肢ごとの理由を、それぞれのボタンの下に出す
        Array.prototype.forEach.call(main.querySelectorAll(".choice"), function (o, i) {
          var why = q.choices[i].why;
          if (why) o.insertAdjacentHTML("beforeend", '<span class="why">' + (q.choices[i].ok ? "◯ " : "✕ ") + fmt(why) + "</span>");
        });
        exp.innerHTML = "<p><b>" + (picked.ok ? "正解です。" : "この選択には注意点があります。各選択肢の理由と、下の解説を確かめましょう。") + "</b></p>" +
          q.explain.map(function (p) { return "<p>" + fmt(p) + "</p>"; }).join("") +
          '<p style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0">' +
          (q.related || []).map(function (gid) { return groupById[gid] ? '<a class="btn ghost" href="#g/' + esc(gid) + '">' + esc(groupById[gid].name) + "のカード</a>" : ""; }).join("") +
          (next ? '<a class="btn" href="#quiz/' + esc(next.id) + '">次の問題</a>' : "") + "</p>";
        exp.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }

  // ---------- お気に入り ----------
  function viewFav() {
    var gs = fav.filter(function (k) { return k.indexOf("g:") === 0 && groupById[k.slice(2)]; }).map(function (k) { return k.slice(2); });
    var qs = fav.filter(function (k) { return k.indexOf("q:") === 0 && quizById[k.slice(2)]; }).map(function (k) { return quizById[k.slice(2)]; });
    main.innerHTML = '<h1>お気に入り</h1><p class="sub">カードや問題の ☆ を押すと、ここに並びます（この端末のブラウザにだけ保存されます）。</p>' +
      '<section class="sec"><h2>カード</h2>' + (gs.length ? '<div class="glist">' + gs.map(gcard).join("") + "</div>" : '<p class="empty">まだありません。</p>') + "</section>" +
      '<section class="sec"><h2>場面クイズ</h2>' + (qs.length ? '<div class="glist">' + qs.map(function (q) {
        return '<a class="gcard" href="#quiz/' + esc(q.id) + '"><div class="g-name">' + esc(q.title) + '</div><div class="g-ex">' + esc(groupById[q.group] ? groupById[q.group].name : "") + "</div></a>";
      }).join("") + "</div>" : '<p class="empty">まだありません。</p>') + "</section>";
  }

  // ---------- このアプリについて ----------
  // 「この教材を使う・共有する方へ」（このアプリについて の中。#about/share）
  function shareHtml() {
    var url = location.origin + location.pathname;
    var text = "「リハに活かす薬剤ナビ」\n" +
      "URL：" + url + "\n" +
      "・リハ職向けに、薬の作用・時間・副作用を介入前後の観察につなげる参照・学習アプリです。\n" +
      "・生成AIで作成しています。誤りが含まれることがあるので、使う前に出典（添付文書など）で確かめてください。\n" +
      "・実際の判断は、医師の指示と院内の基準に従ってください。\n" +
      "・患者さんの情報は入力しないでください。URL は職員の間だけで共有してください。";
    return '<section class="panel" id="share"><h2>この教材を使う・共有する方へ</h2>' +
      '<p>職場や研修で紹介するときは、次の点も伝えてください。下の説明文をコピーして使えます。</p><ul>' +
      '<li><b>使う前に</b>：誤りや古い情報が含まれることがあります。研修などで使う前に、資格を持つ担当者が各カードの出典と照らし合わせてください。とくに、報告の目安と中止基準、個別の薬の Tmax・半減期・排泄、主な副作用は、最新の添付文書で確かめてください。</li>' +
      '<li><b>臨床での判断</b>：実際の判断は、医師の指示と院内の基準に従ってください。このアプリは病院・法人の公式の教材ではないので、院内のルールを優先します。</li>' +
      '<li><b>患者さんの情報</b>：検索欄に、氏名・ID・日付などを入れないでください。</li>' +
      '<li><b>共有の範囲</b>：URL は職員の間だけで共有し、SNS など外部には載せないでください。</li>' +
      '<li><b>文章や図を使うとき</b>：このアプリの文章や図を別の資料に使うときは、そのカードの出典も載せてください。</li></ul>' +
      '<h3>共有用の説明文</h3><div class="share-copy"><textarea readonly rows="7" aria-label="共有用の説明文">' + esc(text) + '</textarea><button type="button" class="btn ghost" id="shareCopy">説明文をコピー</button></div></section>';
  }

  function viewAbout(rest) {
    main.innerHTML = '<h1>このアプリについて</h1>' +
      '<section class="panel"><p>リハ職が、薬の作用・時間・副作用を、介入前後の観察と判断につなげるための参照・学習用のツールです。</p>' +
      "<ul><li>添付文書・診療ガイドライン・公開文献をもとに、生成AIで作成しました。出典は各カードの末尾にあり、出典の文章・図・表は転載していません。</li>" +
      "<li>薬の仕組みの図と時間の図は、このアプリのために作成した模式図です。外部の画像は使っていません。用語の説明（点線の語）は一般的な言い換えです。</li>" +
      "<li>用量の調整、薬の中止・変更、特定の患者への推奨は扱いません。</li>" +
      "<li>患者の情報を入れる欄はありません。お気に入りと最近見たカードだけを、この端末のブラウザの中に保存します。検索した文字と複数の薬の選択は、保存も送信もしません。</li></ul></section>" +
      shareHtml();
    if (rest === "share") { var sh = document.getElementById("share"); if (sh) setTimeout(function () { sh.scrollIntoView({ block: "start" }); window.scrollBy(0, -64); }, 0); }
    var cb = document.getElementById("shareCopy");
    cb.addEventListener("click", function () {
      var ta = cb.parentNode.querySelector("textarea");
      var ok = function () { cb.textContent = "コピーしました"; setTimeout(function () { cb.textContent = "説明文をコピー"; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(ok, function () { ta.select(); });
      else { ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { /* 手で選んでコピーしてもらう */ } }
    });
  }

  // ---------- ルーター ----------
  function route() {
    var h = (location.hash.slice(1) || "home").split("/");
    var tab = { home: "home", groups: "groups", g: "groups", tag: "home", quiz: "quiz", fav: "fav", select: "home", about: "home" }[h[0]] || "home";
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar a"), function (a) {
      var on = a.getAttribute("data-tab") === tab;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    switch (h[0]) {
      case "groups": viewGroups(h[1] ? decodeURIComponent(h[1]) : null); break;
      case "g": viewGroup(decodeURIComponent(h[1] || ""), h[2] ? decodeURIComponent(h[2]) : null); break;
      case "tag": viewTag(decodeURIComponent(h[1] || "")); break;
      case "select": viewSelect(); break;
      case "quiz": h[1] ? viewQuiz(decodeURIComponent(h[1])) : viewQuizList(); break;
      case "fav": viewFav(); break;
      case "about": viewAbout(h[1] || ""); break;
      default: viewHome();
    }
    if (!(h[0] === "g" && h[2])) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  document.getElementById("updated").textContent = D.updated || "";
  updateSelBadge();
  route();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () { /* オフライン対応なしでも動く */ });
  }
})();
