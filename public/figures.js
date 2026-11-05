// 薬効の仕組みの模式図（院内作成）。キーは正本の「図ID」と同じ。
// 色は styles.css のトークン（--drug 薬／--body 体の変化／--rehab リハ／--promote 促進→／--inhibit 抑制⊣）だけを使う。
// 文字はスマホ幅で読めるよう、viewBox 幅 360 に対して 13 以上にする。
(function () {
  "use strict";
  var F = window.FIGURES = window.FIGURES || {};

  function attrs(o) { return Object.keys(o).map(function (k) { return k + '="' + o[k] + '"'; }).join(" "); }
  function rect(x, y, w, h, o) {
    o = o || {};
    return "<rect " + attrs({ x: x, y: y, width: w, height: h, rx: o.r == null ? 10 : o.r, fill: o.fill || "var(--surface)", stroke: o.stroke || "var(--line)", "stroke-width": o.sw || 1.5 }) +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + "/>";
  }
  // 複数行テキスト（中央揃え既定）
  function text(x, y, lines, o) {
    o = o || {};
    var size = o.size || 14, lh = o.lh || size * 1.3, anchor = o.anchor || "middle";
    if (!Array.isArray(lines)) lines = [lines];
    var y0 = y - (lines.length - 1) * lh / 2;
    return "<text " + attrs({ x: x, y: y0, "font-size": size, "text-anchor": anchor, "dominant-baseline": "middle", fill: o.fill || "var(--ink)", "font-weight": o.weight || 400 }) + ">" +
      lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + l + "</tspan>"; }).join("") + "</text>";
  }
  // 薬のラベル（紫の錠剤型）
  function pill(x, y, w, h, lines, size) {
    return rect(x, y, w, h, { r: h / 2, fill: "var(--drug-soft)", stroke: "var(--drug)", sw: 2 }) +
      text(x + w / 2, y + h / 2, lines, { size: size || 14.5, fill: "var(--drug)", weight: 700 });
  }
  // 促進の矢印（緑）
  function arrow(d, color) {
    color = color || "var(--promote)";
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function head(x, y, dir, color) {
    // 矢じり：dir は "d"（下）・"r"（右）・"u"・"l"
    color = color || "var(--promote)";
    var p = { d: [[-6, -9], [6, -9]], u: [[-6, 9], [6, 9]], r: [[-9, -6], [-9, 6]], l: [[9, -6], [9, 6]] }[dir];
    return '<path d="M' + (x + p[0][0]) + " " + (y + p[0][1]) + " L" + x + " " + y + " L" + (x + p[1][0]) + " " + (y + p[1][1]) +
      '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  // 抑制の印（赤の ⊣）。(x,y) が当たる点、dir は線が来る向き
  function tbar(x, y, dir) {
    var v = dir === "l" || dir === "r";
    return '<path d="' + (v ? "M" + x + " " + (y - 10) + " V" + (y + 10) : "M" + (x - 10) + " " + y + " H" + (x + 10)) +
      '" stroke="var(--inhibit)" stroke-width="4" stroke-linecap="round"/>';
  }
  function inhibit(d) { return '<path d="' + d + '" fill="none" stroke="var(--inhibit)" stroke-width="2.5" stroke-linecap="round"/>'; }
  // 変化を示す記号（↓↑）付きの結果ボックス
  function result(x, y, w, h, label, dirSym) {
    return rect(x, y, w, h, { fill: "var(--body-soft)", stroke: "var(--body)", sw: 1.5 }) +
      text(x + 14, y + h / 2, label, { anchor: "start", size: 14.5, weight: 600 }) +
      text(x + w - 18, y + h / 2, dirSym, { size: 20, weight: 800, fill: "var(--body)" });
  }
  function svg(h, body) {
    return '<svg viewBox="0 0 360 ' + h + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit" style="max-width:500px;margin:0 auto">' + body + "</svg>";
  }
  // 心臓のアイコン（中心 cx,cy、幅 w）
  function heart(cx, cy, w) {
    var s = w / 100;
    return '<path transform="translate(' + (cx - 50 * s) + "," + (cy - 45 * s) + ") scale(" + s + ')" d="M50 88 C20 66 4 50 4 30 C4 15 16 4 30 4 C40 4 47 10 50 17 C53 10 60 4 70 4 C84 4 96 15 96 30 C96 50 80 66 50 88 Z" fill="var(--body-soft)" stroke="var(--body)" stroke-width="' + (2 / s) + '"/>';
  }

  // ---------- β遮断薬 ----------
  F.beta = {
    alt: "交感神経から出るノルアドレナリンが心臓のβ1受容体に結合すると心拍数と心収縮力が上がる。β遮断薬はβ1受容体をふさぎ、心拍数・心収縮力・血圧を下げる。",
    svg: svg(300,
      // 上段：交感神経 と 薬
      rect(12, 14, 168, 52, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(96, 40, ["交感神経", "（ノルアドレナリン）"], { size: 13.5, lh: 18, fill: "var(--ink-2)", weight: 600 }) +
      pill(222, 18, 126, 44, "β遮断薬", 16) +
      // 交感神経 → β1
      arrow("M96 66 V104") + head(96, 106, "d") +
      // β1 受容体（心臓の上に乗る）
      rect(52, 110, 88, 34, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(96, 127.5, "β1受容体", { size: 14, weight: 700 }) +
      // 薬 ⊣ β1
      inhibit("M285 62 C285 112 210 127 152 127") + tbar(150, 127, "l") +
      text(232, 98, "ふさぐ", { size: 13, fill: "var(--inhibit)", weight: 700 }) +
      // 心臓
      heart(96, 208, 104) +
      text(96, 205, "心臓", { size: 15, weight: 700, fill: "var(--body)" }) +
      arrow("M96 144 V158", "var(--ink-3)") +
      // 結果
      arrow("M150 196 C170 196 172 176 188 176", "var(--body)") + head(190, 176, "r", "var(--body)") +
      arrow("M150 214 H188", "var(--body)") + head(190, 214, "r", "var(--body)") +
      arrow("M150 232 C170 232 172 252 188 252", "var(--body)") + head(190, 252, "r", "var(--body)") +
      result(196, 158, 152, 36, "心拍数", "↓") +
      result(196, 196, 152, 36, "心収縮力", "↓") +
      result(196, 234, 152, 36, "血圧", "↓") +
      text(272, 288, "運動しても心拍数が上がりにくい", { size: 13, fill: "var(--ink-2)", weight: 600 })
    )
  };

  // ---------- 抗凝固薬 ----------
  F.anticoag = {
    alt: "肝臓がビタミンKを使って凝固因子をつくり、凝固因子の連鎖で第Xa因子からトロンビンができ、フィブリンの血のかたまりになる。ワルファリンは肝臓での凝固因子づくりを、Xa阻害薬は第Xa因子を、ダビガトランはトロンビンを抑える。",
    svg: svg(336,
      // 縦の連鎖（左）
      rect(12, 12, 200, 58, { fill: "var(--surface-2)", stroke: "var(--neutral)" }) +
      text(112, 41, ["肝臓：ビタミンKを使って", "凝固因子（II・VII・IX・X）をつくる"], { size: 13, lh: 18, fill: "var(--ink-2)", weight: 600 }) +
      arrow("M112 70 V96") + head(112, 98, "d") +
      rect(57, 102, 110, 38, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(112, 121, "第Xa因子", { size: 14.5, weight: 700 }) +
      text(122, 161, "凝固の連鎖", { size: 12.5, fill: "var(--ink-3)", anchor: "start" }) +
      arrow("M112 140 V180") + head(112, 182, "d") +
      rect(57, 186, 110, 38, { fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(112, 205, "トロンビン", { size: 14.5, weight: 700 }) +
      arrow("M112 224 V250") + head(112, 252, "d") +
      rect(22, 256, 180, 42, { fill: "var(--body-soft)", stroke: "var(--body)" }) +
      text(112, 277, "フィブリン（血のかたまり）", { size: 14, weight: 700, fill: "var(--body)" }) +
      text(180, 322, "薬で固まりにくくなる＝出血しやすい", { size: 13.5, fill: "var(--body)", weight: 700 }) +
      // 薬（右）。⊣ は各段の高さにそろえる
      pill(236, 20, 116, 42, "ワルファリン", 14.5) +
      inhibit("M236 41 H218") + tbar(214, 41, "l") +
      pill(236, 100, 116, 42, "Xa阻害薬", 14.5) +
      inhibit("M236 121 H173") + tbar(169, 121, "l") +
      text(294, 158, "アピキサバン など3剤", { size: 12.5, fill: "var(--ink-3)" }) +
      pill(236, 184, 116, 42, "ダビガトラン", 14.5) +
      inhibit("M236 205 H173") + tbar(169, 205, "l")
    )
  };

  // ---------- SU薬 ----------
  F.su = {
    alt: "SU薬は膵臓のβ細胞の膜にあるKATPチャネルを閉じる。細胞が興奮し、カルシウムが流れ込んでインスリンが放出される。血糖値が低くても分泌が促されるため、血糖が下がる。",
    svg: svg(300,
      // 薬
      pill(14, 6, 96, 34, "SU薬", 15.5) +
      text(122, 23, "チャネルを閉じる", { size: 13.5, fill: "var(--inhibit)", weight: 700, anchor: "start" }) +
      // β細胞（KATP チャネルは膜にまたがって描く）
      rect(12, 64, 226, 196, { r: 26, fill: "var(--surface-2)", stroke: "var(--neutral)", sw: 2 }) +
      text(125, 282, "膵臓のβ細胞", { size: 14, weight: 700, fill: "var(--ink-2)" }) +
      inhibit("M62 40 V44") + tbar(62, 46, "u") +
      rect(22, 50, 120, 32, { r: 8, fill: "var(--surface)", stroke: "var(--ink-2)", sw: 2 }) +
      text(82, 66, "KATPチャネル", { size: 13.5, weight: 700 }) +
      // 細胞内の連鎖
      arrow("M82 82 V94") + head(82, 96, "d") +
      text(82, 110, "細胞が興奮（脱分極）", { size: 13.5, weight: 600 }) +
      arrow("M82 122 V134") + head(82, 136, "d") +
      text(82, 150, "Ca²⁺が流れ込む", { size: 13.5, weight: 600 }) +
      arrow("M82 162 V174") + head(82, 176, "d") +
      '<g fill="var(--drug-soft)" stroke="var(--drug)" stroke-width="1.5">' +
      '<circle cx="46" cy="196" r="9"/><circle cx="72" cy="204" r="9"/><circle cx="98" cy="192" r="9"/><circle cx="124" cy="204" r="9"/></g>' +
      text(86, 232, "インスリンを放出", { size: 13.5, weight: 700 }) +
      // 細胞の外へ → 血糖↓
      arrow("M138 200 H244") + head(246, 200, "r") +
      result(252, 178, 98, 44, "血糖", "↓") +
      text(301, 138, ["血糖が低くても", "分泌が続く"], { size: 13, lh: 17, fill: "var(--body)", weight: 700 }) +
      arrow("M301 154 V170", "var(--body)") + head(301, 172, "d", "var(--body)")
    )
  };

  // 分野別の図ファイル（figures-*.js）から使う共通部品
  window.FIG = { attrs: attrs, rect: rect, text: text, pill: pill, arrow: arrow, head: head, tbar: tbar, inhibit: inhibit, result: result, svg: svg, heart: heart };
})();
