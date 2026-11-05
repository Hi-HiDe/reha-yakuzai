// 抗がん剤の薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg, heart = H.heart;
  var BODY = { fill: "var(--body-soft)", stroke: "var(--body)" };
  var NEU = { fill: "var(--surface-2)", stroke: "var(--neutral)" };

  // ---------- 殺細胞性抗がん剤 ----------
  F.onc_cyto = {
    alt: "殺細胞性抗がん剤は、盛んに分裂する細胞（がん細胞・骨髄・消化管の粘膜・毛根）のDNA合成や分裂を妨げる。骨髄で血球がつくられにくくなり、白血球が減ると感染しやすく、血小板が減ると出血しやすく、赤血球が減ると貧血・息切れが起きる。減る時期は投与日からの日数で変わる。",
    svg: svg(306,
      pill(14, 10, 150, 42, "殺細胞性抗がん剤", 14.5) +
      text(176, 31, "DNA合成・分裂を妨げる", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      inhibit("M89 52 V66") + tbar(89, 68, "u") +
      rect(12, 74, 336, 54, NEU) +
      text(180, 101, ["分裂が盛んな細胞", "がん細胞・骨髄・消化管の粘膜・毛根"], { size: 13.5, lh: 19, fill: "var(--ink-2)", weight: 600 }) +
      arrow("M180 128 V146") + head(180, 148, "d") +
      rect(60, 152, 240, 36, BODY) +
      text(180, 170, "骨髄：血球がつくられにくい", { size: 14, weight: 700, fill: "var(--body)" }) +
      // 3つに分かれる
      arrow("M120 188 C120 198 64 196 64 206", "var(--body)") + head(64, 208, "d", "var(--body)") +
      arrow("M180 188 V206", "var(--body)") + head(180, 208, "d", "var(--body)") +
      arrow("M240 188 C240 198 296 196 296 206", "var(--body)") + head(296, 208, "d", "var(--body)") +
      result(12, 212, 104, 36, "白血球", "↓") +
      result(128, 212, 104, 36, "血小板", "↓") +
      result(244, 212, 104, 36, "赤血球", "↓") +
      text(64, 266, "感染しやすい", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      text(180, 266, "出血しやすい", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      text(296, 266, "貧血・息切れ", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      text(180, 292, "投与日からの日数で減る時期が変わる", { size: 13.5, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 末梢神経障害の多い薬 ----------
  F.onc_neuro = {
    alt: "パクリタキセル・オキサリプラチン・ビンクリスチンは末梢神経を傷つけ、手足の感覚が低下する（しびれ）。手のしびれは書字・ボタン・箸の動作に、足のしびれはつまずき・転倒につながる。オキサリプラチンは冷たさで悪化する。",
    svg: svg(290,
      pill(12, 10, 132, 34, "パクリタキセル", 13.5) +
      pill(12, 52, 132, 34, "オキサリプラチン", 13.5) +
      pill(12, 94, 132, 34, "ビンクリスチン", 13.5) +
      inhibit("M144 27 C156 27 156 69 166 69") +
      inhibit("M144 69 H166") +
      inhibit("M144 111 C156 111 156 69 166 69") + tbar(166, 69, "l") +
      text(262, 22, "神経を傷つける", { size: 13, fill: "var(--inhibit)", weight: 700 }) +
      rect(176, 40, 172, 58, NEU) +
      text(262, 69, ["末梢神経", "（手足の感覚神経など）"], { size: 13, lh: 19, fill: "var(--ink-2)", weight: 600 }) +
      arrow("M262 98 V116", "var(--body)") + head(262, 118, "d", "var(--body)") +
      result(176, 122, 172, 38, "手足の感覚", "↓") +
      // 手と足に分かれる
      arrow("M262 160 C262 178 88 174 88 190", "var(--body)") + head(88, 192, "d", "var(--body)") +
      arrow("M262 160 V190", "var(--body)") + head(262, 192, "d", "var(--body)") +
      rect(12, 196, 152, 52, NEU) +
      text(88, 222, ["手のしびれ", "書字・ボタン・箸"], { size: 13.5, lh: 19, weight: 600 }) +
      rect(176, 196, 172, 52, NEU) +
      text(262, 222, ["足のしびれ", "つまずき・転倒"], { size: 13.5, lh: 19, weight: 600 }) +
      text(180, 274, "オキサリプラチンは冷たさで悪化", { size: 13.5, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 心毒性に注意する薬 ----------
  F.onc_cardio = {
    alt: "ドキソルビシンとトラスツズマブは心臓の筋肉に障害を起こすことがあり、心収縮力（左室駆出率 LVEF）が下がる。運動時の息切れ・動悸、むくみ・体重増加として現れることがある。ドキソルビシンは総投与量が増えるほど起きやすい。",
    svg: svg(300,
      pill(12, 14, 140, 38, "ドキソルビシン", 14) +
      pill(12, 62, 140, 38, "トラスツズマブ", 14) +
      inhibit("M152 33 C170 33 172 64 186 64") +
      inhibit("M152 81 C170 81 172 64 186 64") + tbar(188, 64, "l") +
      text(96, 120, "心臓の障害", { size: 13.5, fill: "var(--inhibit)", weight: 700 }) +
      heart(250, 80, 110) +
      text(250, 76, "心筋", { size: 15, weight: 700, fill: "var(--body)" }) +
      arrow("M250 128 V144", "var(--body)") + head(250, 146, "d", "var(--body)") +
      result(90, 150, 240, 36, "心収縮力（LVEF）", "↓") +
      arrow("M210 186 V204", "var(--body)") + head(210, 206, "d", "var(--body)") +
      rect(12, 210, 336, 54, NEU) +
      text(180, 237, ["運動時の息切れ・動悸、むくみ・体重増加", "負荷は症状とバイタルで判断"], { size: 13.5, lh: 19, weight: 600 }) +
      text(180, 286, "ドキソルビシンは総投与量が増えるほど起きやすい", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 分子標的薬 ----------
  F.onc_target = {
    alt: "ベバシズマブは血管をつくる信号VEGFをふさぎ、血圧上昇・出血や血栓・傷の治りにくさが起きる。オシメルチニブはがん細胞の増殖の信号を出すEGFRをふさぎ、皮膚・爪の障害や下痢が起きる。ほかに間質性肺疾患にも注意する。薬ごとに副作用の型が違う。",
    svg: svg(332,
      // 左：ベバシズマブ
      pill(12, 10, 160, 38, "ベバシズマブ", 14.5) +
      inhibit("M92 48 V64") + tbar(92, 66, "u") +
      text(108, 60, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      rect(22, 72, 140, 34, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(92, 89, "VEGF（血管新生）", { size: 13.5, weight: 700 }) +
      arrow("M92 106 V132", "var(--body)") + head(92, 134, "d", "var(--body)") +
      result(12, 138, 160, 34, "血圧", "↑") +
      result(12, 178, 160, 34, "出血・血栓", "↑") +
      result(12, 218, 160, 34, "傷の治り", "↓") +
      text(92, 274, "手術の前後は特に注意", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      // 右：オシメルチニブ
      pill(188, 10, 160, 38, "オシメルチニブ", 14.5) +
      inhibit("M268 48 V64") + tbar(268, 66, "u") +
      text(284, 60, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      rect(198, 72, 140, 34, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(268, 89, "EGFR（増殖信号）", { size: 13.5, weight: 700 }) +
      arrow("M268 106 V132", "var(--body)") + head(268, 134, "d", "var(--body)") +
      rect(188, 138, 160, 34, BODY) +
      text(268, 155, "皮膚・爪の障害", { size: 14, weight: 700, fill: "var(--body)" }) +
      rect(188, 178, 160, 34, BODY) +
      text(268, 195, "下痢", { size: 14, weight: 700, fill: "var(--body)" }) +
      text(268, 230, "ほかにも注意", { size: 12.5, fill: "var(--ink-3)" }) +
      rect(188, 244, 160, 48, { fill: "var(--body-soft)", stroke: "var(--body)", dash: "5 4" }) +
      text(268, 268, ["間質性肺疾患", "（息切れ・咳・発熱）"], { size: 13, lh: 18, weight: 700, fill: "var(--body)" }) +
      text(180, 318, "薬ごとに副作用の「型」が違う", { size: 13.5, fill: "var(--ink-2)", weight: 700 })
    )
  };

  // ---------- 免疫チェックポイント阻害薬 ----------
  F.onc_ici = {
    alt: "がん細胞のPD-L1がT細胞のPD-1に結合すると、T細胞の攻撃にブレーキがかかる。抗PD-1抗体はPD-1をふさいでブレーキを外し、T細胞ががんを攻撃する。一方で自分の臓器も攻撃することがあり（irAE）、肺（息切れ・咳）、筋・神経（筋力低下）、腸（下痢）、内分泌（甲状腺・血糖）に症状が出る。いつもと違う症状は報告する。",
    svg: svg(348,
      pill(110, 10, 140, 36, "抗PD-1抗体", 14) +
      text(256, 28, "ブレーキを外す", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      inhibit("M145 46 V78") + tbar(145, 80, "u") +
      rect(12, 70, 104, 64, NEU) +
      text(64, 102, ["T細胞", "（免疫細胞）"], { size: 13, lh: 19, fill: "var(--ink-2)", weight: 700 }) +
      rect(118, 86, 54, 32, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(145, 102, "PD-1", { size: 13.5, weight: 700 }) +
      rect(184, 86, 58, 32, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(213, 102, "PD-L1", { size: 13.5, weight: 700 }) +
      rect(244, 70, 104, 64, NEU) +
      text(296, 102, "がん細胞", { size: 13.5, fill: "var(--ink-2)", weight: 700 }) +
      // T細胞から2つの結果へ
      arrow("M64 134 V154") + head(64, 156, "d") +
      rect(12, 160, 150, 36, { fill: "var(--surface)", stroke: "var(--promote)", sw: 1.5 }) +
      text(87, 178, "がんを攻撃する", { size: 14, weight: 700 }) +
      arrow("M96 134 C96 150 262 142 262 154", "var(--body)") + head(262, 156, "d", "var(--body)") +
      rect(176, 160, 172, 36, BODY) +
      text(262, 178, "自分の臓器も攻撃", { size: 14, weight: 700, fill: "var(--body)" }) +
      arrow("M262 196 V210", "var(--body)") + head(262, 212, "d", "var(--body)") +
      rect(12, 216, 336, 96, { fill: "none", stroke: "var(--body)", dash: "5 4" }) +
      rect(20, 224, 156, 36, BODY) + text(98, 242, "肺：息切れ・咳", { size: 13, weight: 600 }) +
      rect(184, 224, 156, 36, BODY) + text(262, 242, "筋・神経：筋力低下", { size: 13, weight: 600 }) +
      rect(20, 268, 156, 36, BODY) + text(98, 286, "腸：下痢", { size: 13, weight: 600 }) +
      rect(184, 268, 156, 36, BODY) + text(262, 286, "内分泌：甲状腺・血糖", { size: 13, weight: 600 }) +
      text(180, 334, "いつもと違う症状は報告", { size: 13.5, fill: "var(--body)", weight: 700 })
    )
  };
})();
