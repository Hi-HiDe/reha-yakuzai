# 正本（薬剤ナビ_正本.xlsx）を最初に作るためのスクリプト（見本3群：β遮断薬・抗凝固薬・SU薬）。
# 一度作ったあとは Excel が正本。このスクリプトを再実行すると Excel を上書きするので、--force を付けたときだけ書き込む。
# 文章は AI 下書き。数値は添付文書で確認できた値だけを入れ、確認できなかった箇所は「作成メモ」に書く（画面には出ない）。
import os
import sys

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seed_content import DRUGS, FIELDS, GROUPS, QUIZZES, SETTINGS, TAGS  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, "薬剤ナビ_正本.xlsx")

SHEETS = {
    "薬効群": ["群ID", "分野ID", "薬効群名", "代表薬", "検索キーワード", "リスクタグ", "リハで見るポイント", "介入前の確認", "報告の目安",
            "流れ_薬", "流れ_体の変化", "流れ_リハ", "薬効の仕組み", "図ID", "図の表示時間", "時間_導入", "時間_ピーク付近", "時間_その後",
            "時間_時間に関係なく", "主な副作用", "検査値リンク", "出典", "状態", "作成メモ", "確認者", "確認日"],
    "個別薬": ["薬ID", "群ID", "一般名", "商品名", "Tmax（表示）", "Tmax（図用・時間）", "半減期（表示）", "半減期（図用・時間）", "作用持続",
            "排泄経路", "メモ", "出典", "状態", "作成メモ"],
    "学習問題": ["問題ID", "群ID", "タイトル", "場面の人物", "場面", "問い", "選択肢1", "選択肢2", "選択肢3", "選択肢4", "正解番号", "解説",
             "関連する群ID", "状態", "作成メモ", "確認者", "確認日"],
    "症状タグ": ["タグID", "表示名", "色", "説明", "検索キーワード"],
    "分野": ["分野ID", "分野名"],
    "設定": ["項目", "値"],
}
DATA = {"薬効群": GROUPS, "個別薬": DRUGS, "学習問題": QUIZZES, "症状タグ": TAGS, "分野": FIELDS, "設定": SETTINGS}
WIDE = {"リハで見るポイント", "介入前の確認", "報告の目安", "薬効の仕組み", "主な副作用", "出典", "作成メモ", "解説", "場面", "メモ",
        "流れ_薬", "流れ_体の変化", "流れ_リハ", "時間_導入", "時間_ピーク付近", "時間_その後", "時間_時間に関係なく", "説明"}


def main():
    if os.path.exists(XLSX) and "--force" not in sys.argv:
        sys.exit("正本がすでにあります。上書きする場合だけ --force を付けて実行してください: " + XLSX)
    wb = Workbook()
    wb.remove(wb.active)
    head_fill = PatternFill("solid", fgColor="DDF1EE")
    for name, cols in SHEETS.items():
        ws = wb.create_sheet(name)
        ws.append(cols)
        for c in ws[1]:
            c.font = Font(bold=True)
            c.fill = head_fill
            c.alignment = Alignment(vertical="center", wrap_text=True)
        for row in DATA[name]:
            ws.append([row.get(c, "") for c in cols])
        for i, c in enumerate(cols, start=1):
            letter = ws.cell(row=1, column=i).column_letter
            ws.column_dimensions[letter].width = 48 if c in WIDE else 16
            for cell in ws[letter][1:]:
                cell.alignment = Alignment(vertical="top", wrap_text=True)
        ws.freeze_panes = "B2" if name != "設定" else None
        if "状態" in cols:
            dv = DataValidation(type="list", formula1='"下書き,承認済み"', allow_blank=False)
            ws.add_data_validation(dv)
            letter = ws.cell(row=1, column=cols.index("状態") + 1).column_letter
            dv.add("%s2:%s500" % (letter, letter))
    wb.save(XLSX)
    print("正本を作りました:", XLSX)


if __name__ == "__main__":
    main()
