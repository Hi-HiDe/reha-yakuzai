// 中枢神経の薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg;

  // 中立の箱（受容体など）の中に2行（見出し＋補足）
  function box2(x, y, w, h, title, sub) {
    return rect(x, y, w, h, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(x + w / 2, y + h / 2 - 9, title, { size: 14, weight: 700 }) +
      text(x + w / 2, y + h / 2 + 10, sub, { size: 12.5, fill: "var(--ink-2)" });
  }

  // ---------- 睡眠薬・抗不安薬 ----------
  F.cns_hypnotic = {
    alt: "ベンゾジアゼピン系・非ベンゾジアゼピン系は、脳のブレーキ役であるGABA-A受容体の働きを強め、眠くなり不安が減る。筋肉がゆるむこともある。オレキシン受容体拮抗薬は、目覚めを保つオレキシン受容体をふさぎ、目覚めの信号が止まって眠くなる。薬が残ると翌朝の眠気・ふらつき・転倒につながる。",
    svg: svg(300,
      // 薬（上段）
      pill(22, 8, 140, 48, "BZ系・非BZ系", 15) +
      pill(198, 8, 140, 48, ["オレキシン", "受容体拮抗薬"], 14) +
      // 左：働きを強める（促進）
      arrow("M92 56 V94") + head(92, 96, "d") +
      text(104, 76, "強める", { size: 13, fill: "var(--promote)", weight: 700, anchor: "start" }) +
      // 右：ふさぐ（抑制）
      inhibit("M268 56 V92") + tbar(268, 95, "u") +
      text(280, 76, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      // 受容体（中段）
      box2(22, 100, 140, 50, "GABA-A受容体", "（脳のブレーキ）") +
      box2(198, 100, 140, 50, "オレキシン受容体", "（目覚めを保つ）") +
      // 体の変化（下段）
      arrow("M92 150 V178", "var(--body)") + head(92, 180, "d", "var(--body)") +
      arrow("M268 150 V178", "var(--body)") + head(268, 180, "d", "var(--body)") +
      rect(10, 184, 164, 54, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(92, 202, "眠くなる・不安が減る", { size: 13.5, weight: 600 }) +
      text(92, 222, "筋肉がゆるむことも", { size: 12.5, fill: "var(--ink-2)" }) +
      rect(186, 184, 164, 54, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(268, 202, "目覚めの信号が止まる", { size: 13.5, weight: 600 }) +
      text(268, 222, "→ 眠くなる", { size: 12.5, fill: "var(--ink-2)" }) +
      // リハで問題になること
      text(180, 262, "薬が残ると：翌朝の眠気・ふらつき・転倒", { size: 13.5, weight: 700, fill: "var(--body)" }) +
      text(180, 284, "夜中のトイレ歩行も要注意", { size: 13, fill: "var(--ink-2)" })
    )
  };

  // ---------- 抗精神病薬 ----------
  F.cns_antipsychotic = {
    alt: "抗精神病薬は受容体をふさぐ。中脳−辺縁系のドパミンD2受容体をふさぐと幻覚・妄想がおさまる。運動の回路である線条体のD2受容体もふさがれると、ふるえや嚥下障害などの錐体外路症状が出る。血管のα1受容体をふさぐと起立性低血圧が起き、立ちくらみや転倒につながる。受容体への作用の強さは薬によって違う。",
    svg: svg(288,
      pill(10, 8, 160, 40, "抗精神病薬", 15.5) +
      text(182, 28, "受容体をふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      // 薬から各受容体への ⊣（左の幹から枝分かれ）
      inhibit("M30 48 V204") +
      inhibit("M30 88 H42") + tbar(45, 88, "l") +
      inhibit("M30 146 H42") + tbar(45, 146, "l") +
      inhibit("M30 204 H42") + tbar(45, 204, "l") +
      // 受容体
      box2(48, 64, 136, 48, "D2受容体", "（中脳−辺縁系）") +
      box2(48, 122, 136, 48, "D2受容体", "（線条体）") +
      box2(48, 180, 136, 48, "α1受容体", "（血管）") +
      // 結果
      arrow("M184 88 H198", "var(--ink-3)") + head(200, 88, "r", "var(--ink-3)") +
      arrow("M184 146 H198", "var(--body)") + head(200, 146, "r", "var(--body)") +
      arrow("M184 204 H198", "var(--body)") + head(200, 204, "r", "var(--body)") +
      rect(206, 64, 144, 48, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(278, 79, "幻覚・妄想が", { size: 13.5, weight: 600 }) +
      text(278, 97, "おさまる", { size: 13.5, weight: 600 }) +
      rect(206, 122, 144, 48, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(278, 137, "錐体外路症状", { size: 13.5, weight: 700 }) +
      text(278, 156, "ふるえ・嚥下障害", { size: 12.5, fill: "var(--ink-2)" }) +
      rect(206, 180, 144, 48, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(278, 195, "起立性低血圧", { size: 13.5, weight: 700 }) +
      text(278, 214, "立ちくらみ・転倒", { size: 12.5, fill: "var(--ink-2)" }) +
      text(180, 252, "運動の回路（線条体）のD2もふさがれる", { size: 13, weight: 700, fill: "var(--body)" }) +
      text(180, 273, "受容体への作用の強さは薬によって違う", { size: 12.5, fill: "var(--ink-3)" })
    )
  };

  // ---------- 抗パーキンソン病薬 ----------
  F.cns_parkinson = {
    alt: "レボドパは血液脳関門を通って脳でドパミンに変わり、ドパミン受容体に働いて動きやすくなる。脳の外でドパミンに変わると脳に入れないため、カルビドパが脳の外での変換を減らし、脳に届くレボドパを増やす。ドパミンアゴニストはドパミン受容体を直接刺激する。長く使うと動きやすさが時間で変わることがある（wearing-off）。",
    svg: svg(336,
      // 見出し・血液脳関門
      text(70, 16, "脳の外（血液）", { size: 12.5, fill: "var(--ink-3)" }) +
      text(150, 16, "血液脳関門", { size: 12.5, fill: "var(--ink-3)" }) +
      text(265, 16, "脳", { size: 13.5, weight: 700, fill: "var(--ink-2)" }) +
      '<path d="M150 28 V290" fill="none" stroke="var(--neutral)" stroke-width="2" stroke-dasharray="5 5"/>' +
      // 左：レボドパ・カルビドパ
      pill(18, 36, 116, 40, "レボドパ", 15) +
      arrow("M76 76 V104") + head(76, 106, "d") +
      rect(12, 110, 128, 46, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(76, 124, "脳の外で", { size: 13, weight: 600, fill: "var(--ink-2)" }) +
      text(76, 142, "ドパミンに変わる", { size: 13, weight: 600, fill: "var(--ink-2)" }) +
      inhibit("M76 192 V163") + tbar(76, 160, "d") +
      text(90, 176, "減らす", { size: 13, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      pill(18, 192, 116, 40, "カルビドパ", 15) +
      text(76, 252, ["脳に届く", "レボドパが増える"], { size: 12.5, lh: 17, fill: "var(--ink-2)" }) +
      // レボドパ → 脳でドパミンに
      arrow("M134 56 H202 Q212 56 212 66 V98") + head(212, 100, "d") +
      rect(160, 104, 104, 46, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(212, 118, "ドパミンに", { size: 14, weight: 700 }) +
      text(212, 136, "変わる", { size: 14, weight: 700 }) +
      // ドパミンアゴニスト → 受容体を直接刺激
      pill(232, 30, 116, 52, ["ドパミン", "アゴニスト"], 14) +
      arrow("M290 82 V172") + head(290, 174, "d") +
      text(297, 128, "直接刺激", { size: 13, fill: "var(--promote)", weight: 700, anchor: "start" }) +
      arrow("M212 150 V172") + head(212, 174, "d") +
      rect(160, 178, 188, 42, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(254, 199, "ドパミン受容体", { size: 14.5, weight: 700 }) +
      // 結果
      arrow("M254 220 V240", "var(--body)") + head(254, 242, "d", "var(--body)") +
      result(160, 246, 188, 42, "動きやすくなる", "↑") +
      // リハで問題になること
      text(180, 306, "長く使うと、動きやすさが時間で変わる", { size: 13, weight: 700, fill: "var(--body)" }) +
      text(180, 325, "ことがある（wearing-off）", { size: 13, weight: 700, fill: "var(--body)" })
    )
  };

  // ---------- 抗てんかん薬 ----------
  F.cns_aed = {
    alt: "カルバマゼピンとラコサミドはナトリウムチャネルをおさえ、レベチラセタムはSV2Aに結合し、バルプロ酸は脳のGABAを増やして、神経の過剰な興奮（発作）をおさえる。発作がおこりにくくなる。副作用として眠気・ふらつき・めまいが出ることがある。発作を見たら始まった時刻・様子・続いた時間を報告する。",
    svg: svg(302,
      // 薬（左）
      rect(8, 10, 188, 52, { r: 12, fill: "var(--drug-soft)", stroke: "var(--drug)", sw: 2 }) +
      text(102, 28, "カルバマゼピン・ラコサミド", { size: 13, weight: 700, fill: "var(--drug)" }) +
      text(102, 46, "Naチャネルをおさえる", { size: 12.5, fill: "var(--ink-2)" }) +
      rect(8, 72, 188, 52, { r: 12, fill: "var(--drug-soft)", stroke: "var(--drug)", sw: 2 }) +
      text(102, 90, "レベチラセタム", { size: 13, weight: 700, fill: "var(--drug)" }) +
      text(102, 108, "SV2Aに結合する", { size: 12.5, fill: "var(--ink-2)" }) +
      rect(8, 134, 188, 52, { r: 12, fill: "var(--drug-soft)", stroke: "var(--drug)", sw: 2 }) +
      text(102, 152, "バルプロ酸", { size: 13, weight: 700, fill: "var(--drug)" }) +
      text(102, 170, "脳のGABAを増やす", { size: 12.5, fill: "var(--ink-2)" }) +
      // ⊣ 過剰な興奮
      inhibit("M196 36 H228") + tbar(231, 36, "l") +
      inhibit("M196 98 H228") + tbar(231, 98, "l") +
      inhibit("M196 160 H228") + tbar(231, 160, "l") +
      rect(234, 10, 116, 176, { r: 14, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(292, 98, ["神経の", "過剰な興奮", "（発作）"], { size: 14.5, lh: 20, weight: 700, fill: "var(--ink-2)" }) +
      // 結果
      arrow("M292 186 V206", "var(--ink-3)") + head(292, 208, "d", "var(--ink-3)") +
      rect(184, 212, 166, 50, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(267, 228, "発作が", { size: 13.5, weight: 600 }) +
      text(267, 246, "おこりにくくなる", { size: 13.5, weight: 600 }) +
      rect(10, 212, 166, 50, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(93, 228, "副作用", { size: 12.5, fill: "var(--ink-3)" }) +
      text(93, 247, "眠気・ふらつき・めまい", { size: 13, weight: 700, fill: "var(--body)" }) +
      text(180, 286, "発作を見たら：始まった時刻・様子・続いた時間を報告", { size: 13, weight: 700, fill: "var(--body)" })
    )
  };
})();
