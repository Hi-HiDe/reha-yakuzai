// 糖尿病の薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg;

  F.dm_insulin = {
    alt: "注射したインスリンは、筋肉・脂肪が糖を取り込むのを促し、肝臓が糖をつくるのを抑えて血糖を下げる。運動が加わるとさらに下がりやすい。作用の時間の目安は、超速効型が最大1〜3時間・持続3〜5時間、持効型は明らかなピークがなくほぼ24時間。",
    svg: svg(392,
      // 薬
      pill(105, 10, 150, 40, "インスリン（注射）", 14.5) +
      // 筋肉・脂肪（促進）と 肝臓（抑制）
      arrow("M140 50 C140 66 92 62 92 78") + head(92, 80, "d") +
      rect(12, 84, 160, 56, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(92, 112, ["筋肉・脂肪", "糖を取り込む"], { size: 14, lh: 19, weight: 600 }) +
      inhibit("M220 50 C220 66 268 62 268 78") + tbar(268, 80, "d") +
      rect(188, 84, 160, 56, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(268, 112, ["肝臓", "糖をつくる"], { size: 14, lh: 19, weight: 600 }) +
      // 血糖↓
      arrow("M92 140 C92 164 104 190 122 190", "var(--body)") + head(126, 190, "r", "var(--body)") +
      arrow("M268 140 C268 164 256 190 238 190", "var(--body)") + head(234, 190, "l", "var(--body)") +
      result(130, 170, 100, 40, "血糖", "↓") +
      text(180, 230, "運動が加わると、さらに下がりやすい", { size: 13.5, fill: "var(--body)", weight: 700 }) +
      // 作用の時間（模式図）
      text(180, 262, "作用の時間の目安（添付文書・模式図）", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      text(12, 296, "超速効型", { size: 13, anchor: "start", weight: 600 }) +
      '<path d="M76 310 C80 310 82 282 88 282 L108 282 C114 282 120 310 128 310 Z" fill="var(--drug-soft)" stroke="var(--drug)" stroke-width="2" stroke-linejoin="round"/>' +
      text(140, 296, "最大1〜3時間・持続3〜5時間", { size: 13, anchor: "start", fill: "var(--ink-2)" }) +
      text(12, 348, "持効型", { size: 13, anchor: "start", weight: 600 }) +
      '<path d="M76 358 C82 358 84 336 94 336 L322 336 C332 336 334 358 340 358 Z" fill="var(--drug-soft)" stroke="var(--drug)" stroke-width="2" stroke-linejoin="round"/>' +
      text(208, 347, "ほぼ24時間・明らかなピークなし", { size: 13, fill: "var(--ink)" }) +
      // 時間軸
      '<path d="M76 366 H340 M76 362 V370 M142 362 V370 M208 362 V370 M274 362 V370 M340 362 V370" stroke="var(--ink-3)" stroke-width="1.5" fill="none"/>' +
      text(76, 382, "0", { size: 12.5, fill: "var(--ink-3)" }) +
      text(142, 382, "6", { size: 12.5, fill: "var(--ink-3)" }) +
      text(208, 382, "12", { size: 12.5, fill: "var(--ink-3)" }) +
      text(274, 382, "18", { size: 12.5, fill: "var(--ink-3)" }) +
      text(340, 382, "24", { size: 12.5, fill: "var(--ink-3)", anchor: "end" }) +
      text(12, 382, "時間", { size: 12.5, fill: "var(--ink-3)", anchor: "start" })
    )
  };

  F.dm_sglt2 = {
    alt: "腎臓の尿細管にあるSGLT2は、尿のもとから糖を血液へ戻す。SGLT2阻害薬はこれをふさぎ、糖が尿に出て、尿の量・回数も増える。その結果、血糖が下がり、脱水や尿路・性器の感染が起きやすくなる。ケトアシドーシスは血糖が高くなくても起こりうる。",
    svg: svg(254,
      // SGLT2 と 薬
      rect(12, 14, 150, 52, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(87, 40, ["腎臓のSGLT2", "糖を血液へ戻す"], { size: 13.5, lh: 18, weight: 600 }) +
      pill(222, 18, 126, 44, "SGLT2阻害薬", 14.5) +
      inhibit("M222 40 H170") + tbar(166, 40, "l") +
      text(194, 60, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700 }) +
      // 尿に糖が出る
      arrow("M87 66 V92") + head(87, 94, "d") +
      text(99, 80, "戻せない", { size: 13, anchor: "start", fill: "var(--ink-3)" }) +
      rect(12, 98, 150, 116, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(87, 138, "尿に糖が出る", { size: 15, weight: 700, fill: "var(--body)" }) +
      text(87, 172, ["尿の量・回数も", "増える"], { size: 13, lh: 17, fill: "var(--ink-2)", weight: 600 }) +
      // 結果
      arrow("M162 114 H190", "var(--body)") + head(192, 114, "r", "var(--body)") +
      arrow("M162 156 H190", "var(--body)") + head(192, 156, "r", "var(--body)") +
      arrow("M162 198 H190", "var(--body)") + head(192, 198, "r", "var(--body)") +
      result(196, 96, 152, 36, "血糖", "↓") +
      rect(196, 138, 152, 36, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(210, 156, "脱水しやすい", { size: 14.5, weight: 600, anchor: "start" }) +
      rect(196, 180, 152, 36, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(210, 198, "尿路・性器の感染", { size: 14.5, weight: 600, anchor: "start" }) +
      text(180, 238, "ケトアシドーシスは血糖が高くなくても起こりうる", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  F.dm_dpp4 = {
    alt: "食事をとると小腸からインクレチン（GLP-1・GIP）が出るが、DPP-4という酵素ですぐ分解される。DPP-4阻害薬はDPP-4をふさぎ、インクレチンが増える。膵臓は血糖が高いときにインスリンを増やし、グルカゴンを減らして血糖が下がる。SU薬・インスリンと一緒だと低血糖が起きやすい。",
    svg: svg(338,
      // 食事 → インクレチン
      rect(12, 14, 160, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(92, 32, "食事をとる", { size: 14, weight: 600, fill: "var(--ink-2)" }) +
      arrow("M92 50 V72") + head(92, 74, "d") +
      rect(12, 78, 160, 66, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(92, 111, ["小腸から出るホルモン", "インクレチン", "（GLP-1・GIP）"], { size: 13.5, lh: 18, weight: 600 }) +
      // 薬 ⊣ DPP-4 ⊣ インクレチン
      pill(222, 14, 126, 40, "DPP-4阻害薬", 14.5) +
      inhibit("M285 54 V80") + tbar(285, 82, "d") +
      text(297, 68, "ふさぐ", { size: 13, anchor: "start", fill: "var(--inhibit)", weight: 700 }) +
      rect(222, 86, 126, 50, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(285, 111, ["DPP-4", "分解する酵素"], { size: 14, lh: 18, weight: 700 }) +
      inhibit("M222 111 H180") + tbar(176, 111, "l") +
      text(199, 97, "分解", { size: 13, fill: "var(--inhibit)", weight: 700 }) +
      // インクレチン → 膵臓
      arrow("M92 144 V164") + head(92, 166, "d") +
      text(104, 155, "分解されず増える", { size: 13, anchor: "start", fill: "var(--ink-2)", weight: 600 }) +
      rect(12, 170, 160, 80, { r: 20, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(92, 210, ["膵臓", "血糖が高いときに働く"], { size: 13.5, lh: 20, weight: 600 }) +
      // 結果
      arrow("M172 188 H190", "var(--body)") + head(192, 188, "r", "var(--body)") +
      arrow("M172 232 H190", "var(--body)") + head(192, 232, "r", "var(--body)") +
      result(196, 170, 152, 36, "インスリン", "↑") +
      result(196, 214, 152, 36, "グルカゴン", "↓") +
      arrow("M272 250 V260", "var(--body)") + head(272, 262, "d", "var(--body)") +
      result(196, 266, 152, 36, "血糖", "↓") +
      text(180, 324, "SU薬・インスリンと一緒だと低血糖が起きやすい", { size: 13, fill: "var(--body)", weight: 700 })
    )
  };

  F.dm_bg = {
    alt: "メトホルミンは主に肝臓で糖がつくられる（糖新生）のを抑え、インスリンを出させずに血糖を下げる。脱水、腎機能の低下、ヨード造影剤の検査、心臓・肺の重い障害があると乳酸アシドーシスを起こしやすく、初期症状は胃腸症状・だるさ・筋肉痛・過呼吸。",
    svg: svg(362,
      // 薬 ⊣ 肝臓 → 血糖↓
      pill(27, 10, 130, 40, "メトホルミン", 14.5) +
      text(170, 30, ["インスリンを出させずに", "血糖を下げる"], { size: 13, lh: 17, anchor: "start", fill: "var(--ink-2)", weight: 600 }) +
      inhibit("M92 50 V74") + tbar(92, 76, "d") +
      rect(12, 82, 160, 52, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(92, 108, ["肝臓", "糖をつくる（糖新生）"], { size: 13.5, lh: 18, weight: 600 }) +
      arrow("M172 108 H190", "var(--body)") + head(192, 108, "r", "var(--body)") +
      result(196, 90, 152, 36, "血糖", "↓") +
      // 乳酸アシドーシスを起こしやすい状態
      text(180, 166, "乳酸アシドーシスを起こしやすい状態", { size: 13.5, fill: "var(--ink-2)", weight: 700 }) +
      rect(12, 182, 164, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(94, 200, "脱水（嘔吐・下痢など）", { size: 13, weight: 600 }) +
      rect(184, 182, 164, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(266, 200, "腎機能の低下", { size: 13, weight: 600 }) +
      rect(12, 226, 164, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(94, 244, "ヨード造影剤の検査", { size: 13, weight: 600 }) +
      rect(184, 226, 164, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(266, 244, "心臓・肺の重い障害", { size: 13, weight: 600 }) +
      arrow("M180 266 V282", "var(--body)") + head(180, 284, "d", "var(--body)") +
      rect(40, 288, 280, 60, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(180, 306, "乳酸アシドーシス", { size: 15, weight: 700, fill: "var(--body)" }) +
      text(180, 330, "胃腸症状・だるさ・筋肉痛・過呼吸", { size: 13, fill: "var(--ink-2)", weight: 600 })
    )
  };
})();
