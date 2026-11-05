// 抗菌薬・免疫抑制薬の薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg;

  // 中立の箱（灰色）
  function nbox(x, y, w, h, lines, o) {
    o = o || {};
    return rect(x, y, w, h, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(x + w / 2, y + h / 2, lines, { size: o.size || 13.5, lh: o.lh || 18, fill: "var(--ink)", weight: o.weight || 600 });
  }
  // 体の変化の箱（副作用など）
  function bbox(x, y, w, h, lines, o) {
    o = o || {};
    return rect(x, y, w, h, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(x + w / 2, y + h / 2, lines, { size: o.size || 13.5, lh: o.lh || 17, fill: "var(--ink)", weight: o.weight || 600 });
  }
  // 右の列の副作用の箱へ枝分かれする線（幹 x=176、箱の左端 188）
  function branches(ys) {
    var last = ys[ys.length - 1];
    var s = arrow("M162 33 H176 V" + last + " H182", "var(--body)") + head(184, last, "r", "var(--body)");
    for (var i = 0; i < ys.length - 1; i++) s += arrow("M176 " + ys[i] + " H182", "var(--body)") + head(184, ys[i], "r", "var(--body)");
    return s;
  }
  // 左の列：薬 ⊣ 細菌の標的 → 細菌が死ぬ／増えない
  function bacteria(lines, outcome) {
    return inhibit("M87 54 V86") + tbar(87, 88, "u") +
      text(95, 71, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      nbox(12, 92, 150, 64, lines) +
      arrow("M87 156 V170") + head(87, 172, "d") +
      text(87, 188, outcome, { size: 13.5, weight: 700, fill: "var(--ink-2)" });
  }

  // ---------- アミノグリコシド系 ----------
  F.abx_ag = {
    alt: "アミノグリコシド系抗菌薬は細菌のタンパク質づくりをふさぎ、細菌をおさえる。副作用は内耳（第8脳神経）と腎臓に出やすく、めまい・ふらつき、耳鳴り・難聴、腎機能の低下が起きることがある。",
    svg: svg(262,
      pill(12, 12, 150, 42, "アミノグリコシド系", 14.5) +
      bacteria(["細菌の", "タンパク質づくり"], "細菌をおさえる") +
      text(268, 76, "副作用が出やすい場所", { size: 13, fill: "var(--ink-2)", weight: 700 }) +
      branches([124, 197]) +
      bbox(188, 92, 160, 64, ["内耳（第8脳神経）", "めまい・ふらつき", "耳鳴り・難聴"], { lh: 18 }) +
      bbox(188, 172, 160, 50, ["腎臓", "腎機能が下がる"]) +
      text(180, 246, "めまい・ふらつき → 起立・歩行時の転倒に注意", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- ニューキノロン系 ----------
  F.abx_fq = {
    alt: "ニューキノロン系抗菌薬は細菌のDNA複製に必要な酵素（DNAジャイレースなど）をふさぎ、細菌を殺す。注意する副作用は、アキレス腱炎・腱断裂などの腱障害、QT延長などの不整脈、低血糖、めまい・けいれん。腱障害は高齢者やステロイド併用で起きやすい。",
    svg: svg(326,
      pill(12, 12, 150, 42, "ニューキノロン系", 14.5) +
      bacteria(["細菌のDNA複製", "（DNAジャイレース）"], "細菌が死ぬ（殺菌的）") +
      rect(12, 212, 150, 80, { fill: "var(--surface)", stroke: "var(--neutral)", dash: "5 4" }) +
      text(87, 252, ["腱障害は高齢者・", "ステロイド併用で", "起きやすい"], { size: 13, lh: 18, fill: "var(--ink-2)", weight: 600 }) +
      text(268, 76, "注意する副作用", { size: 13, fill: "var(--ink-2)", weight: 700 }) +
      branches([114, 166, 218, 270]) +
      bbox(188, 92, 160, 44, ["腱の障害", "アキレス腱炎・断裂"]) +
      bbox(188, 144, 160, 44, ["心臓", "QT延長・不整脈"]) +
      bbox(188, 196, 160, 44, ["血糖", "低血糖"]) +
      bbox(188, 248, 160, 44, ["神経", "めまい・けいれん"]) +
      text(180, 312, "腱の痛み・腫れ、動悸、ふらつきは報告", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- バンコマイシン ----------
  F.abx_vcm = {
    alt: "バンコマイシンは細菌（MRSAなど）の細胞壁づくりをふさぎ、細菌を殺す。注意する副作用は腎障害、第8脳神経障害（聴覚）、急速な点滴で起きる顔・首・上半身の赤み（レッドネック症候群）や血圧低下。",
    svg: svg(272,
      pill(12, 12, 150, 42, "バンコマイシン", 15) +
      bacteria(["細菌の細胞壁づくり", "（MRSA など）"], "細菌が死ぬ（殺菌的）") +
      text(268, 76, "注意する副作用", { size: 13, fill: "var(--ink-2)", weight: 700 }) +
      branches([114, 166, 222]) +
      bbox(188, 92, 160, 44, ["腎臓", "腎機能が下がる"]) +
      bbox(188, 144, 160, 44, ["内耳（第8脳神経）", "聞こえにくさ・耳鳴り"]) +
      bbox(188, 196, 160, 52, ["急速な点滴で", "顔・首の赤み、血圧低下"], { size: 13 }) +
      text(180, 262, "点滴中・直後の赤み、ふらつきは報告", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 抗菌薬全般 ----------
  F.abx_common = {
    alt: "抗菌薬は感染症の原因菌をおさえて治療する。一方で、下痢・腹痛が起き、血便を伴う重い大腸炎（偽膜性大腸炎）になることがある。また、ショック・アナフィラキシーなどのアレルギー反応（じんま疹、全身の赤み、息苦しさなど）に注意する。",
    svg: svg(316,
      pill(105, 10, 150, 42, "抗菌薬", 16) +
      // 左：原因菌
      inhibit("M140 52 V62 H90 V76") + tbar(90, 78, "u") +
      nbox(12, 82, 156, 44, "感染症の原因菌") +
      arrow("M90 126 V140") + head(90, 142, "d") +
      rect(12, 146, 156, 48, { fill: "var(--surface)", stroke: "var(--ink-2)" }) +
      text(90, 170, "菌が減る（治療）", { size: 13.5, weight: 700 }) +
      // 右：腸の副作用
      arrow("M220 52 V62 H270 V74", "var(--body)") + head(270, 78, "d", "var(--body)") +
      bbox(192, 82, 156, 44, "下痢・腹痛") +
      arrow("M270 126 V138", "var(--body)") + head(270, 142, "d", "var(--body)") +
      bbox(192, 146, 156, 48, ["偽膜性大腸炎", "（血便を伴う大腸炎）"], { size: 13 }) +
      // 下：アレルギー
      text(180, 214, "抗菌薬に共通して注意", { size: 12.5, fill: "var(--ink-3)", weight: 600 }) +
      bbox(12, 226, 336, 52, ["アレルギー反応（ショック・アナフィラキシー）", "じんま疹・全身の赤み・息苦しさ"], { size: 13, lh: 18 }) +
      text(180, 300, "下痢の回数・性状、発疹・息苦しさは報告", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- カルシニューリン阻害薬 ----------
  F.imm_cni = {
    alt: "カルシニューリン阻害薬（タクロリムス・シクロスポリン）はT細胞の中のカルシニューリンをふさぎ、IL-2などの産生を抑えてT細胞の働きを弱める。免疫の働きが下がり感染しやすくなる。ほかに、手のふるえ（振戦）、腎機能の低下、血圧の上昇、血糖の上昇に注意する。",
    svg: svg(306,
      pill(12, 12, 176, 42, "カルシニューリン阻害薬", 14) +
      inhibit("M100 54 V86") + tbar(100, 88, "u") +
      text(108, 71, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      rect(32, 92, 136, 34, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(100, 109, "カルシニューリン", { size: 14, weight: 700 }) +
      arrow("M100 126 V140", "var(--ink-3)") + head(100, 142, "d", "var(--ink-3)") +
      text(100, 156, "IL-2 などの産生", { size: 13.5, weight: 600 }) +
      arrow("M100 168 V180", "var(--ink-3)") + head(100, 182, "d", "var(--ink-3)") +
      text(100, 196, "T細胞が働く", { size: 13.5, weight: 600 }) +
      arrow("M100 208 V222", "var(--body)") + head(100, 224, "d", "var(--body)") +
      result(32, 228, 136, 36, "免疫の働き", "↓") +
      arrow("M100 264 V272", "var(--body)") + head(100, 274, "d", "var(--body)") +
      text(100, 290, "感染しやすくなる", { size: 14, weight: 700, fill: "var(--body)" }) +
      // 右：そのほかの副作用
      text(272, 76, "ほかに注意する副作用", { size: 13, fill: "var(--ink-2)", weight: 700 }) +
      bbox(196, 92, 152, 40, "手のふるえ（振戦）") +
      bbox(196, 140, 152, 40, "腎機能の低下") +
      bbox(196, 188, 152, 40, "血圧が上がる") +
      bbox(196, 236, 152, 40, "血糖が上がる")
    )
  };

  // ---------- 代謝拮抗薬・生物学的製剤 ----------
  F.imm_anti = {
    alt: "メトトレキサートはリンパ球の増殖や抗体産生などを抑える。ミコフェノール酸はDNAの材料づくりに必要な酵素（IMPDH）をふさぎ、リンパ球の増殖を抑える。TNF阻害薬は炎症を起こす物質TNF-αの働きをふさぐ。どれも免疫の働きを弱めるため、感染症と血球の減少に注意する。メトトレキサートとTNF阻害薬では間質性肺炎にも注意する。",
    svg: svg(372,
      pill(12, 14, 128, 40, "メトトレキサート", 13.5) +
      pill(12, 66, 128, 40, "ミコフェノール酸", 13.5) +
      text(76, 128, ["DNAの材料づくり", "をふさぐ（IMPDH）"], { size: 12.5, lh: 18, fill: "var(--ink-3)", weight: 600 }) +
      inhibit("M140 34 H164") + tbar(166, 34, "l") +
      inhibit("M140 86 H164") + tbar(166, 86, "l") +
      nbox(168, 14, 180, 92, ["リンパ球の", "増殖・働き"]) +
      arrow("M258 106 V120", "var(--body)") + head(258, 122, "d", "var(--body)") +
      result(168, 126, 180, 40, "免疫の働き", "↓") +
      pill(12, 196, 128, 40, "TNF阻害薬", 14.5) +
      inhibit("M140 216 H164") + tbar(166, 216, "l") +
      nbox(168, 196, 180, 40, "TNF-α（炎症の物質）", { size: 13 }) +
      arrow("M258 236 V250", "var(--body)") + head(258, 252, "d", "var(--body)") +
      result(168, 256, 180, 40, "炎症・免疫", "↓") +
      bbox(12, 312, 336, 52, ["共通：感染症・血球の減少", "MTX・TNF阻害薬：間質性肺炎"], { size: 13, lh: 18 })
    )
  };
})();
