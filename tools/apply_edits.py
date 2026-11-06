# 精査で採用した修正を正本（薬剤ナビ_正本.xlsx）に反映する。
# 使い方: python tools/apply_edits.py tools/edits/<ファイル>.py
# 修正ファイルには EDITS = [ {...}, ... ] を書く。1件の形：
#   {"sheet": "薬効群", "id": "beta", "col": "報告の目安", "old": "置き換える文字列", "new": "新しい文字列"}  … 部分置換（old は必ずセル内に1回だけあること）
#   {"sheet": "薬効群", "id": "beta", "col": "報告の目安", "set": "セル全体の新しい値"}                       … セルごと置き換え
#   {"sheet": "薬効群", "id": "beta", "col": "報告の目安", "append": "末尾に足す行"}                         … 改行して1行追加
#   {"sheet": "薬効群", "id": "beta", "col": "報告の目安", "prepend": "先頭に足す行"}                        … 先頭に1行追加
#   {"sheet": "薬効群", "id": "beta", "col": "リスクタグ", "append_tag": "glu"}                              … タグを1つ足す（重複は足さない）
# 任意で REPLACE_ALL = [("旧", "新"), ...] を書くと、全シートの文章の列で一括置換する（ID・数値・URL の列は対象外）。
# 1件でも当てはまらないものがあれば、正本は書き換えずに終了する。
import importlib.util
import os
import sys

from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, "薬剤ナビ_正本.xlsx")
KEYS = {"薬効群": "群ID", "個別薬": "薬ID", "学習問題": "問題ID", "症状タグ": "タグID"}


def main():
    path = sys.argv[1]
    spec = importlib.util.spec_from_file_location("edits", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    wb = load_workbook(XLSX)
    errors, done = [], 0
    for n, e in enumerate(mod.EDITS, start=1):
        ws = wb[e["sheet"]]
        head = [c.value for c in ws[1]]
        key = head.index(KEYS[e["sheet"]])
        if e["col"] not in head:
            errors.append("%d: 列「%s」がありません" % (n, e["col"]))
            continue
        col = head.index(e["col"])
        row = next((r for r in ws.iter_rows(min_row=2) if str(r[key].value or "").strip() == e["id"]), None)
        if row is None:
            errors.append("%d: %s「%s」がありません" % (n, KEYS[e["sheet"]], e["id"]))
            continue
        cell = row[col]
        cur = "" if cell.value is None else str(cell.value)
        if "set" in e:
            cell.value = e["set"]
        elif "append" in e:
            cell.value = (cur + "\n" + e["append"]) if cur else e["append"]
        elif "prepend" in e:
            cell.value = (e["prepend"] + "\n" + cur) if cur else e["prepend"]
        elif "append_tag" in e:
            tags = [t.strip() for t in cur.replace("、", ",").split(",") if t.strip()]
            if e["append_tag"] not in tags:
                tags.append(e["append_tag"])
            cell.value = ", ".join(tags)
        else:
            if cur.count(e["old"]) != 1:
                errors.append("%d: %s / %s の「%s」が %d 回見つかりました（1回であること）" % (n, e["id"], e["col"], e["old"][:30], cur.count(e["old"])))
                continue
            cell.value = cur.replace(e["old"], e["new"])
        done += 1
    # 任意の一括置換（文章の列だけ。ID・数値・URL・状態の列は対象外）
    rep = getattr(mod, "REPLACE_ALL", [])
    skip = {"群ID", "薬ID", "問題ID", "タグID", "分野ID", "関連する群ID", "図ID", "出典", "状態", "確認者", "確認日", "正解番号", "色",
            "Tmax（図用・時間）", "半減期（図用・時間）", "図の表示時間", "リスクタグ"}
    n_rep = 0
    for ws in wb.worksheets:
        head = [c.value for c in ws[1]]
        for row in ws.iter_rows(min_row=2):
            for h, cell in zip(head, row):
                if h in skip or not isinstance(cell.value, str):
                    continue
                v = cell.value
                for a, b in rep:
                    v = v.replace(a, b)
                if v != cell.value:
                    cell.value = v
                    n_rep += 1
    if errors:
        sys.exit("反映しませんでした：\n" + "\n".join(errors))
    if rep:
        print("一括置換：%d セル" % n_rep)
    wb.save(XLSX)
    print("正本に %d 件反映しました" % done)


if __name__ == "__main__":
    main()
