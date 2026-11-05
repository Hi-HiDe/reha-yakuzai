# 分野別の下書き（tools/content/*.py）を正本（薬剤ナビ_正本.xlsx）に追記する。
# すでに正本にある ID の行は上書きしない（WG が Excel で直した内容を守るため）。
# 使い方: python tools/append_content.py [担当キー ...]   （省略時は tools/content/ のすべて）
import importlib.util
import os
import sys

from openpyxl import load_workbook
from openpyxl.styles import Alignment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, "薬剤ナビ_正本.xlsx")
CONTENT = os.path.join(ROOT, "tools", "content")

KEYS = {"薬効群": "群ID", "個別薬": "薬ID", "学習問題": "問題ID", "症状タグ": "タグID"}


def load(path):
    spec = importlib.util.spec_from_file_location(os.path.splitext(os.path.basename(path))[0], path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def append(ws, rows, key):
    head = [c.value for c in ws[1]]
    have = {str(r[head.index(key)]).strip() for r in ws.iter_rows(min_row=2, values_only=True) if r[head.index(key)]}
    added, skipped = 0, []
    for row in rows:
        unknown = [k for k in row if k not in head]
        if unknown:
            sys.exit("［%s］列名が正本にありません：%s（%s）" % (ws.title, "、".join(unknown), row.get(key)))
        if str(row[key]).strip() in have:
            skipped.append(row[key])
            continue
        ws.append([row.get(h, "") for h in head])
        for cell in ws[ws.max_row]:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
        have.add(str(row[key]).strip())
        added += 1
    return added, skipped


def main():
    wb = load_workbook(XLSX)
    tags = load(os.path.join(CONTENT, "tags.py")).TAGS
    a, _ = append(wb["症状タグ"], tags, "タグID")
    print("症状タグ：%d 件追加" % a)
    names = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(CONTENT) if f.endswith(".py") and f != "tags.py")
    for name in names:
        mod = load(os.path.join(CONTENT, name + ".py"))
        for sheet, attr in (("薬効群", "GROUPS"), ("個別薬", "DRUGS"), ("学習問題", "QUIZZES")):
            a, skipped = append(wb[sheet], getattr(mod, attr, []), KEYS[sheet])
            print("%s：%s %d 件追加%s" % (name, sheet, a, ("（既存のため見送り：%s）" % "・".join(skipped)) if skipped else ""))
    wb.save(XLSX)


if __name__ == "__main__":
    main()
