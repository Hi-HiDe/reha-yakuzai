// 図の重なりチェック（開発用。ブラウザでアプリを開いた状態でコンソールに貼って実行する）
// すべての図を幅360で描画し、文字どうしの重なり・文字が図の外にはみ出していないか・文字が箱の縁をまたいでいないかを調べる。
(function () {
  var host = document.createElement("div");
  host.style.cssText = "position:absolute;left:0;top:0;width:360px;visibility:hidden";
  document.body.appendChild(host);
  var report = {};
  Object.keys(window.FIGURES).forEach(function (id) {
    host.innerHTML = window.FIGURES[id].svg;
    var svg = host.querySelector("svg");
    svg.style.width = "360px"; svg.style.maxWidth = "none";
    var vb = svg.viewBox.baseVal, k = 360 / vb.width, o = svg.getBoundingClientRect();
    function box(el) { var r = el.getBoundingClientRect(); return { x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k }; }
    function hit(a, b, pad) { pad = pad || 0; return a.x < b.x + b.w - pad && b.x < a.x + a.w - pad && a.y < b.y + b.h - pad && b.y < a.y + a.h - pad; }
    var texts = [].slice.call(svg.querySelectorAll("text")).map(function (t) { return { t: t.textContent, b: box(t) }; });
    var rects = [].slice.call(svg.querySelectorAll("rect")).map(function (r) { return box(r); });
    var issues = [];
    texts.forEach(function (a, i) {
      if (a.b.x < -1 || a.b.y < -1 || a.b.x + a.b.w > vb.width + 1 || a.b.y + a.b.h > vb.height + 1) issues.push("はみ出し：" + a.t);
      texts.slice(i + 1).forEach(function (b) { if (hit(a.b, b.b, 1)) issues.push("文字の重なり：" + a.t + " / " + b.t); });
      rects.forEach(function (r) {
        var inside = a.b.x >= r.x - 1 && a.b.x + a.b.w <= r.x + r.w + 1 && a.b.y >= r.y - 1 && a.b.y + a.b.h <= r.y + r.h + 1;
        var apart = !hit(a.b, r, 0);
        var contains = r.x >= a.b.x && r.x + r.w <= a.b.x + a.b.w && r.y >= a.b.y && r.y + r.h <= a.b.y + a.b.h;
        if (!inside && !apart && !contains && r.w > 6 && r.h > 6) issues.push("箱の縁をまたぐ：" + a.t);
      });
    });
    if (issues.length) report[id] = issues;
  });
  host.remove();
  return report;
})();
