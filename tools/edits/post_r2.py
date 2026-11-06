# 精査2回目の仕上げ（全群に機械的に適用）：
# 1) 報告の目安の並びを「急変時の行 → すぐに報告する項目 → その他 → 数値の中止基準の行（最後）」にそろえる（PT・医師・薬剤師）
# 2) 介入前の確認で、【カルテ】の行の末尾の「（カルテ）」を消し、「（カルテ・看護記録）」は「（看護記録も）」にする（教育）
# 使い方：python tools/edits/post_r2.py
import os
from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
XLSX = os.path.join(ROOT, "薬剤ナビ_正本.xlsx")
wb = load_workbook(XLSX)
ws = wb["薬効群"]
head = [c.value for c in ws[1]]
ir, ib = head.index("報告の目安"), head.index("介入前の確認")
n = 0
for row in ws.iter_rows(min_row=2):
    lines = [l for l in str(row[ir].value or "").split("\n") if l.strip()]
    urgent = [l for l in lines if l.startswith("**急な変化")]
    stop = [l for l in lines if l.startswith("数値の中止基準")]
    rest = [l for l in lines if l not in urgent and l not in stop]
    soon = [l for l in rest if "すぐ" in l or "転倒・頭部打撲" in l]
    other = [l for l in rest if l not in soon]
    new = "\n".join(urgent + soon + other + stop)
    if new != row[ir].value:
        row[ir].value = new
        n += 1
    b = str(row[ib].value or "")
    out = []
    for l in b.split("\n"):
        if l.startswith("【カルテ】"):
            l = l.replace("（カルテ・看護記録）", "（看護記録も）")
            if l.endswith("（カルテ）"):
                l = l[: -len("（カルテ）")]
            l = l.replace("（カルテ）。", "。")
        out.append(l)
    nb = "\n".join(out)
    if nb != b:
        row[ib].value = nb
        n += 1
wb.save(XLSX)
print("仕上げ：%d セル" % n)
