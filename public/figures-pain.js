// 鎮痛・ステロイドの薬効の模式図（院内作成）
(function () {
  "use strict";
  var F = window.FIGURES, H = window.FIG;
  var rect = H.rect, text = H.text, pill = H.pill, arrow = H.arrow, head = H.head, tbar = H.tbar, inhibit = H.inhibit, result = H.result, svg = H.svg;

  // ---------- NSAIDs ----------
  F.pain_nsaids = {
    alt: "細胞膜のアラキドン酸から、COXという酵素の働きでプロスタグランジンがつくられる。NSAIDsはCOXをふさぎ、プロスタグランジンを減らす。その結果、痛み・炎症がおさまる一方で、胃の粘膜を守る働き（粘液・血流）と腎臓の血流も落ちる。",
    svg: svg(300,
      // 左：つくられる流れ
      rect(22, 12, 116, 36, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(80, 30, "アラキドン酸", { size: 14, fill: "var(--ink-2)", weight: 600 }) +
      arrow("M80 48 V70") + head(80, 72, "d") +
      rect(22, 76, 116, 36, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(80, 94, "COX（酵素）", { size: 14.5, weight: 700 }) +
      arrow("M80 112 V174") + head(80, 176, "d") +
      rect(10, 180, 140, 36, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(80, 198, "プロスタグランジン", { size: 13.5, weight: 700 }) +
      // 薬 ⊣ COX
      pill(196, 76, 140, 36, "NSAIDs", 15.5) +
      inhibit("M196 94 H144") + tbar(140, 94, "l") +
      text(168, 72, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700 }) +
      arrow("M150 190 C170 190 172 155 188 155", "var(--body)") + head(190, 155, "r", "var(--body)") +
      arrow("M150 198 H188", "var(--body)") + head(190, 198, "r", "var(--body)") +
      arrow("M150 206 C170 206 172 241 188 241", "var(--body)") + head(190, 241, "r", "var(--body)") +
      result(196, 138, 152, 34, "痛み・炎症", "↓") +
      result(196, 181, 152, 34, "胃の粘膜の保護", "↓") +
      result(196, 224, 152, 34, "腎臓の血流", "↓") +
      text(180, 284, "胃の不調・黒い便・むくみ・尿の減少に注意", { size: 13, fill: "var(--ink-2)", weight: 600 })
    )
  };

  // ---------- オピオイド ----------
  F.pain_opioid = {
    alt: "オピオイドは脳・脊髄・腸にあるμオピオイド受容体に結合して働かせる。痛みの伝わりが弱まる一方で、眠気・ふらつきが出て、呼吸が抑えられ、腸の動きが落ちて便秘になる。",
    svg: svg(296,
      pill(14, 14, 132, 40, "オピオイド", 15.5) +
      arrow("M80 54 V140") + head(80, 142, "d") +
      text(88, 98, "働かせる", { size: 13, fill: "var(--promote)", weight: 700, anchor: "start" }) +
      // 受容体
      rect(12, 146, 136, 52, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(80, 172, ["μオピオイド受容体", "（脳・脊髄・腸）"], { size: 13.5, lh: 18, weight: 700 }) +
      // 結果
      arrow("M148 160 C170 160 170 117 188 117", "var(--body)") + head(190, 117, "r", "var(--body)") +
      arrow("M148 168 C170 168 170 159 188 159", "var(--body)") + head(190, 159, "r", "var(--body)") +
      arrow("M148 176 C170 176 170 201 188 201", "var(--body)") + head(190, 201, "r", "var(--body)") +
      arrow("M148 184 C170 184 170 243 188 243", "var(--body)") + head(190, 243, "r", "var(--body)") +
      result(196, 100, 152, 34, "痛みの伝わり", "↓") +
      result(196, 142, 152, 34, "眠気・ふらつき", "↑") +
      result(196, 184, 152, 34, "呼吸", "↓") +
      result(196, 226, 152, 34, "腸の動き", "↓") +
      text(180, 280, "眠気・呼吸・便秘をリハの前に確認", { size: 13, fill: "var(--ink-2)", weight: 600 })
    )
  };

  // ---------- ステロイド ----------
  F.pain_steroid = {
    alt: "ステロイドは細胞の中の受容体に結合して遺伝子の働きを変える。炎症と免疫が抑えられる一方で、筋肉の分解が進み（たんぱく異化）、骨量が減り、血糖が上がる。長く使うと副腎が自分でつくるステロイドが減るため、急な中止は危険。",
    svg: svg(332,
      pill(14, 14, 132, 40, "ステロイド", 15.5) +
      arrow("M80 54 V140") + head(80, 142, "d") +
      text(88, 98, "結合する", { size: 13, fill: "var(--promote)", weight: 700, anchor: "start" }) +
      // 受容体
      rect(12, 146, 136, 52, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(80, 172, ["ステロイド受容体", "（細胞の中）"], { size: 13.5, lh: 18, weight: 700 }) +
      // 結果
      arrow("M148 160 C170 160 170 117 188 117", "var(--body)") + head(190, 117, "r", "var(--body)") +
      arrow("M148 168 C170 168 170 159 188 159", "var(--body)") + head(190, 159, "r", "var(--body)") +
      arrow("M148 176 C170 176 170 201 188 201", "var(--body)") + head(190, 201, "r", "var(--body)") +
      arrow("M148 184 C170 184 170 243 188 243", "var(--body)") + head(190, 243, "r", "var(--body)") +
      result(196, 100, 152, 34, "炎症・免疫", "↓") +
      result(196, 142, 152, 34, "筋肉の分解", "↑") +
      result(196, 184, 152, 34, "骨量", "↓") +
      result(196, 226, 152, 34, "血糖", "↑") +
      // 長期投与と中止
      rect(12, 274, 336, 48, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(180, 298, ["長く使うと副腎がつくる量が減る", "→ 急な中止は危険（自己判断でやめない）"], { size: 13, lh: 18, fill: "var(--ink-2)", weight: 600 })
    )
  };

  // ---------- 神経障害性疼痛治療薬（α2δリガンド） ----------
  F.pain_gaba = {
    alt: "プレガバリン・ミロガバリンは、神経の末端にあるカルシウムチャネルのα2δサブユニットに結合し、カルシウムの流入を減らす。グルタミン酸などの神経伝達物質の放出が減って痛みが和らぐ。脳でも作用するため、めまい・眠気が出やすい。",
    svg: svg(300,
      // 神経の末端
      rect(12, 60, 200, 140, { r: 20, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(112, 216, "神経の末端（脳・脊髄など）", { size: 13.5, weight: 700, fill: "var(--ink-2)" }) +
      rect(22, 44, 168, 34, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(106, 61, "Ca²⁺チャネル（α2δ）", { size: 13.5, weight: 700 }) +
      // 薬 ⊣ チャネル
      pill(230, 35, 118, 52, ["プレガバリン", "ミロガバリン"], 13.5) +
      inhibit("M230 61 H196") + tbar(192, 61, "l") +
      text(289, 106, ["Ca²⁺の流入を", "減らす"], { size: 13, lh: 17, fill: "var(--inhibit)", weight: 700 }) +
      // 細胞内の流れ
      arrow("M106 78 V92") + head(106, 94, "d") +
      text(106, 110, "Ca²⁺が入りにくい", { size: 13.5, weight: 600 }) +
      arrow("M106 122 V134") + head(106, 136, "d") +
      '<g fill="var(--drug-soft)" stroke="var(--drug)" stroke-width="1.5">' +
      '<circle cx="82" cy="152" r="8"/><circle cx="106" cy="156" r="8"/><circle cx="130" cy="152" r="8"/></g>' +
      text(106, 182, "伝達物質の放出が減る", { size: 13.5, weight: 600 }) +
      // 結果
      arrow("M212 160 H228") + head(230, 160, "r") +
      result(236, 140, 112, 40, "痛み", "↓") +
      // 脳での作用
      rect(12, 240, 336, 48, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(180, 264, ["脳でも作用し、めまい・眠気が出やすい", "→ 起立・歩行・移乗で転倒に注意"], { size: 13, lh: 18, fill: "var(--ink)", weight: 600 })
    )
  };
})();
