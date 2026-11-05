// 循環器・抗血小板薬の薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg;

  // ---------- Ca拮抗薬 ----------
  F.cv_ccb = {
    alt: "Ca拮抗薬は血管の平滑筋の膜にあるL型カルシウムチャネルをふさぐ。カルシウムが入りにくくなり、筋肉がゆるんで血管が広がり、血圧が下がる。ジルチアゼムは心臓にも働き、脈が遅くなることがある。",
    svg: svg(282,
      // 薬
      pill(24, 6, 120, 34, "Ca拮抗薬", 15.5) +
      text(156, 23, "チャネルをふさぐ", { size: 13.5, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      // 平滑筋の細胞（チャネルは膜にまたがって描く）
      rect(12, 64, 226, 150, { r: 26, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(125, 232, "血管の平滑筋", { size: 14, weight: 700, fill: "var(--ink-2)" }) +
      inhibit("M84 40 V44") + tbar(84, 46, "u") +
      rect(24, 50, 120, 32, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(84, 66, "L型Caチャネル", { size: 13.5, weight: 700 }) +
      // 細胞内の変化
      arrow("M84 82 V94") + head(84, 96, "d") +
      text(84, 110, "Ca²⁺が入りにくい", { size: 13.5, weight: 600 }) +
      arrow("M84 122 V134") + head(84, 136, "d") +
      text(84, 150, "筋肉がゆるむ", { size: 13.5, weight: 600 }) +
      arrow("M84 162 V174") + head(84, 176, "d") +
      text(84, 190, "血管が広がる", { size: 14, weight: 700, fill: "var(--body)" }) +
      // 細胞の外へ → 血圧↓
      arrow("M132 190 H244", "var(--body)") + head(246, 190, "r", "var(--body)") +
      result(252, 168, 98, 44, "血圧", "↓") +
      text(180, 266, "ジルチアゼムは心臓にも働き、脈が遅くなることがある", { size: 12.5, fill: "var(--ink-3)" })
    )
  };

  // ---------- ACE阻害薬・ARB ----------
  F.cv_raas = {
    alt: "アンギオテンシンIはACE（変換酵素）でアンギオテンシンIIになり、AT1受容体に結合して血管を縮め、塩分と水を体にためる。ACE阻害薬はACEを、ARBはAT1受容体をふさぎ、血圧が下がる。",
    svg: svg(338,
      // 縦の連鎖（左）
      rect(12, 12, 176, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(100, 30, "アンギオテンシンI", { size: 14, weight: 600, fill: "var(--ink-2)" }) +
      arrow("M100 48 V80") + head(100, 82, "d") +
      text(54, 65, "ACEで変換", { size: 12.5, fill: "var(--ink-3)" }) +
      rect(12, 88, 176, 36, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(100, 106, "アンギオテンシンII", { size: 14.5, weight: 700 }) +
      arrow("M100 124 V158") + head(100, 160, "d") +
      rect(12, 164, 176, 34, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(100, 181, "AT1受容体", { size: 14.5, weight: 700 }) +
      arrow("M100 198 V232") + head(100, 234, "d") +
      rect(12, 238, 176, 48, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(100, 262, ["血管が縮む", "塩分と水をためる"], { size: 13.5, lh: 18, weight: 700, fill: "var(--body)" }) +
      text(180, 316, "薬でこの流れが弱まり、血圧が下がる", { size: 13.5, fill: "var(--body)", weight: 700 }) +
      // 薬（右）
      pill(232, 46, 120, 40, "ACE阻害薬", 14.5) +
      inhibit("M232 66 H116") + tbar(112, 66, "l") +
      text(292, 100, "エナラプリル など", { size: 12.5, fill: "var(--ink-3)" }) +
      pill(232, 161, 120, 40, "ARB", 14.5) +
      inhibit("M232 181 H196") + tbar(192, 181, "l") +
      text(292, 215, "カンデサルタン など", { size: 12.5, fill: "var(--ink-3)" })
    )
  };

  // ---------- 利尿薬 ----------
  F.cv_diuretic = {
    alt: "腎臓の尿細管はナトリウムと水を体に戻している。ループ利尿薬は主にヘンレループで、サイアザイド系は遠位尿細管で、K保持性利尿薬（スピロノラクトン）は遠位尿細管でアルドステロンの作用をふさぎ、尿が増えて体液量が減る。",
    svg: svg(328,
      text(180, 20, "尿細管でNaと水を体に戻すところ", { size: 13, fill: "var(--ink-2)", weight: 600 }) +
      // 作用部位（左）
      rect(12, 40, 196, 44, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(110, 62, "ヘンレループ", { size: 14, weight: 700 }) +
      rect(12, 108, 196, 44, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(110, 130, "遠位尿細管", { size: 14, weight: 700 }) +
      rect(12, 176, 196, 44, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(110, 198, ["遠位尿細管の", "アルドステロンが働く部位"], { size: 13, lh: 17, weight: 700 }) +
      // 薬（右）
      pill(228, 42, 124, 40, "ループ利尿薬", 14) +
      inhibit("M228 62 H216") + tbar(212, 62, "l") +
      text(290, 96, "フロセミド", { size: 12.5, fill: "var(--ink-3)" }) +
      pill(228, 110, 124, 40, "サイアザイド系", 14) +
      inhibit("M228 130 H216") + tbar(212, 130, "l") +
      text(290, 164, "トリクロルメチアジド", { size: 12.5, fill: "var(--ink-3)" }) +
      pill(228, 176, 124, 44, ["K保持性", "利尿薬"], 13.5) +
      inhibit("M228 198 H216") + tbar(212, 198, "l") +
      text(290, 234, "スピロノラクトン", { size: 12.5, fill: "var(--ink-3)" }) +
      // 結果
      arrow("M110 220 V244", "var(--body)") + head(110, 246, "d", "var(--body)") +
      result(12, 250, 196, 40, "尿量", "↑") +
      arrow("M208 270 H244", "var(--body)") + head(246, 270, "r", "var(--body)") +
      result(252, 250, 98, 40, "体液量", "↓") +
      text(180, 312, "脱水・ふらつき、カリウムの異常に注意", { size: 13.5, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 硝酸薬 ----------
  F.cv_nitrate = {
    alt: "硝酸薬は体内で一酸化窒素（NO）を出し、血管の平滑筋をゆるめて血管を広げる。静脈が広がると心臓に戻る血液が減って心臓の負担が下がり、冠動脈が広がって心臓の血流が増える。血圧も下がる。",
    svg: svg(276,
      pill(31, 12, 130, 40, "硝酸薬", 16) +
      arrow("M96 52 V74") + head(96, 76, "d") +
      rect(16, 80, 160, 40, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(96, 100, "NO（一酸化窒素）", { size: 14, weight: 600, fill: "var(--ink-2)" }) +
      arrow("M96 120 V142") + head(96, 144, "d") +
      rect(16, 148, 160, 40, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(96, 168, "血管が広がる", { size: 14.5, weight: 700, fill: "var(--body)" }) +
      // 結果
      arrow("M176 158 C186 158 180 128 188 128", "var(--body)") + head(190, 128, "r", "var(--body)") +
      arrow("M176 168 H188", "var(--body)") + head(190, 168, "r", "var(--body)") +
      arrow("M176 178 C186 178 180 208 188 208", "var(--body)") + head(190, 208, "r", "var(--body)") +
      result(196, 110, 152, 36, "心臓の負担", "↓") +
      result(196, 150, 152, 36, "冠動脈の血流", "↑") +
      result(196, 190, 152, 36, "血圧", "↓") +
      text(180, 254, "立ちくらみ・頭痛が出ることがある", { size: 13.5, fill: "var(--body)", weight: 700 })
    )
  };

  // ---------- 抗血小板薬 ----------
  F.at_antiplatelet = {
    alt: "血小板は、COX-1でつくるトロンボキサンA2、ADPが結合するP2Y12受容体、分解酵素PDE3の働きで集まりやすくなる。アスピリンはCOX-1を、クロピドグレル・プラスグレルはP2Y12受容体を、シロスタゾールはPDE3をふさぎ、血小板が集まりにくくなる。",
    svg: svg(316,
      // 血小板（左）
      rect(12, 12, 212, 190, { r: 22, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(118, 28, "血小板", { size: 13.5, weight: 700, fill: "var(--ink-2)" }) +
      rect(24, 44, 188, 36, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(118, 62, "COX-1（TXA2をつくる）", { size: 13.5, weight: 700 }) +
      rect(24, 98, 188, 36, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(118, 116, "P2Y12受容体（ADP）", { size: 13.5, weight: 700 }) +
      rect(24, 152, 188, 36, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(118, 170, "PDE3（分解酵素）", { size: 13.5, weight: 700 }) +
      // 結果
      arrow("M118 202 V224") + head(118, 226, "d") +
      rect(28, 230, 180, 40, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(118, 250, "血小板が集まる（血栓）", { size: 14, weight: 700, fill: "var(--body)" }) +
      text(180, 298, "薬で血が止まりにくくなる＝出血しやすい", { size: 13.5, fill: "var(--body)", weight: 700 }) +
      // 薬（右）
      pill(240, 42, 112, 40, "アスピリン", 14) +
      inhibit("M240 62 H220") + tbar(216, 62, "l") +
      pill(240, 96, 112, 40, ["クロピドグレル", "プラスグレル"], 12.5) +
      inhibit("M240 116 H220") + tbar(216, 116, "l") +
      pill(240, 150, 112, 40, "シロスタゾール", 13) +
      inhibit("M240 170 H220") + tbar(216, 170, "l")
    )
  };
})();
