# 正本（Excel）からアプリのデータファイル public/data.js を作る。
# 使い方:
#   python tools/build_data.py            … 「承認済み」の行だけで本番用を作る（push してよいのはこちらだけ）
#   python tools/build_data.py --drafts   … 下書きも含めた WG のローカル確認用（push しない）
# 画面には監修・下書きなどの表示は出さない（2026-11-05 の合意）。
# エラー（必須項目の抜け・選択肢にない値・存在しないIDの参照など）があれば data.js を書き換えずに終了する。
import argparse
import datetime
import json
import os
import re
import sys

from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, "薬剤ナビ_正本.xlsx")
OUT = os.path.join(ROOT, "public", "data.js")
FIGURES = os.path.join(ROOT, "public", "figures.js")

STATUSES = {"下書き", "承認済み"}
TAG_COLORS = {"fall", "bp", "hr", "bleed", "glu", "cns", "gen", "inf", "lyte", "msk", "resp"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]*$")


def text(v):
    if v is None:
        return ""
    if isinstance(v, (datetime.date, datetime.datetime)):
        return v.strftime("%Y-%m-%d")
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return str(v).strip()


def lines(v):
    return [s.strip() for s in text(v).splitlines() if s.strip()]


def number(v):
    s = text(v)
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return "NG"


def rows(wb, sheet):
    ws = wb[sheet]
    it = ws.iter_rows(values_only=True)
    head = [text(h) for h in next(it)]
    out = []
    for i, r in enumerate(it, start=2):
        if all(text(c) == "" for c in r):
            continue
        out.append((i, {h: r[j] if j < len(r) else None for j, h in enumerate(head) if h}))
    return out


def figure_ids():
    # figures.js と分野別の figures-*.js に定義された図ID
    ids = set()
    pub = os.path.dirname(FIGURES)
    for name in os.listdir(pub):
        if name == "figures.js" or (name.startswith("figures-") and name.endswith(".js")):
            src = open(os.path.join(pub, name), encoding="utf-8").read()
            ids |= set(re.findall(r"^\s*F\.(\w+) = \{", src, re.M))
    return ids


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--drafts", action="store_true", help="下書きも含める（ローカル確認用）")
    args = ap.parse_args()

    if not os.path.exists(XLSX):
        sys.exit("正本が見つかりません: " + XLSX)
    wb = load_workbook(XLSX, data_only=True)
    errors = []

    def err(sheet, row, msg):
        errors.append("［%s］%d行目：%s" % (sheet, row, msg))

    def include(sheet, i, r, need_review):
        st = text(r.get("状態"))
        if st not in STATUSES:
            err(sheet, i, "状態は「下書き」か「承認済み」にしてください（今：%s）" % (st or "空欄"))
            return False
        if st == "承認済み" and need_review and (not text(r.get("確認者")) or not text(r.get("確認日"))):
            err(sheet, i, "承認済みの行は「確認者」「確認日」を入れてください")
        return st == "承認済み" or args.drafts

    settings = {text(r.get("項目")): text(r.get("値")) for _, r in rows(wb, "設定")}

    fields = []
    for i, r in rows(wb, "分野"):
        fields.append({"id": text(r["分野ID"]), "name": text(r["分野名"])})
    field_ids = {f["id"] for f in fields}

    tags = []
    for i, r in rows(wb, "症状タグ"):
        t = {"id": text(r["タグID"]), "name": text(r["表示名"]), "cls": text(r["色"]), "desc": text(r["説明"]),
             "keywords": text(r.get("検索キーワード"))}
        if not ID_RE.match(t["id"]):
            err("症状タグ", i, "タグIDは半角英小文字・数字で")
        if t["cls"] not in TAG_COLORS:
            err("症状タグ", i, "色は %s のどれか" % "・".join(sorted(TAG_COLORS)))
        tags.append(t)
    tag_ids = {t["id"] for t in tags}

    figs = figure_ids()
    groups = []
    for i, r in rows(wb, "薬効群"):
        if not include("薬効群", i, r, True):
            continue
        gid = text(r["群ID"])
        if not ID_RE.match(gid):
            err("薬効群", i, "群IDは半角英小文字・数字で")
        for col in ["分野ID", "薬効群名", "代表薬", "リスクタグ", "リハで見るポイント", "介入前の確認", "報告の目安", "主な副作用", "出典"]:
            if not text(r.get(col)):
                err("薬効群", i, "「%s」が空欄です" % col)
        if text(r.get("分野ID")) not in field_ids:
            err("薬効群", i, "分野ID「%s」が分野シートにありません" % text(r.get("分野ID")))
        gtags = [s.strip() for s in re.split(r"[,、，]", text(r.get("リスクタグ"))) if s.strip()]
        for t in gtags:
            if t not in tag_ids:
                err("薬効群", i, "リスクタグ「%s」が症状タグシートにありません" % t)
        points = []
        for ln in lines(r.get("リハで見るポイント")):
            if "｜" not in ln:
                err("薬効群", i, "リハで見るポイントは「見出し｜本文」の形で：%s" % ln)
                continue
            h, t = ln.split("｜", 1)
            points.append({"h": h.strip(), "t": t.strip()})
        labs = []
        for ln in lines(r.get("検査値リンク")):
            lab, _, q = ln.partition("｜")
            labs.append({"label": lab.strip(), "q": (q or lab).strip()})
        fig = text(r.get("図ID"))
        if fig and fig not in figs:
            err("薬効群", i, "図ID「%s」が figures.js にありません" % fig)
        flow = [{"k": k, "t": text(r.get(col))} for k, col in (("drug", "流れ_薬"), ("body", "流れ_体の変化"), ("rehab", "流れ_リハ"))] \
            if text(r.get("流れ_薬")) else []
        span = number(r.get("図の表示時間"))
        if span == "NG":
            err("薬効群", i, "図の表示時間は数字（時間）で")
            span = None
        groups.append({
            "id": gid, "field": text(r["分野ID"]), "name": text(r["薬効群名"]), "examples": text(r["代表薬"]),
            "keywords": [s.strip() for s in re.split(r"[,、，]", text(r.get("検索キーワード"))) if s.strip()],
            "tags": gtags, "points": points, "before": lines(r.get("介入前の確認")), "report": lines(r.get("報告の目安")),
            "flow": flow, "mechanism": text(r.get("薬効の仕組み")), "figure": fig,
            "timeline": {"span": span or 24, "lead": text(r.get("時間_導入")), "peak": text(r.get("時間_ピーク付近")),
                         "after": text(r.get("時間_その後")), "anytime": text(r.get("時間_時間に関係なく"))},
            "adverse": lines(r.get("主な副作用")), "labs": labs, "sources": lines(r.get("出典")),
        })
    group_ids = {g["id"] for g in groups}

    drugs = []
    for i, r in rows(wb, "個別薬"):
        if not include("個別薬", i, r, False):
            continue
        gid = text(r["群ID"])
        if gid not in group_ids:
            continue  # 群が未承認なら薬も出さない
        tmax_n, thalf_n = number(r.get("Tmax（図用・時間）")), number(r.get("半減期（図用・時間）"))
        if "NG" in (tmax_n, thalf_n):
            err("個別薬", i, "図用の Tmax・半減期は数字（時間）で")
            continue
        if not text(r.get("出典")):
            err("個別薬", i, "出典が空欄です")
        drugs.append({
            "id": text(r["薬ID"]), "group": gid, "generic": text(r["一般名"]),
            "brands": [s.strip() for s in re.split(r"[,、，／/]", text(r.get("商品名"))) if s.strip()],  # 「ビ・シフロール」のように名前に・を含むものがあるので・では分けない
            "tmax": text(r.get("Tmax（表示）")), "tmaxNum": tmax_n, "thalf": text(r.get("半減期（表示）")), "thalfNum": thalf_n,
            "duration": text(r.get("作用持続")), "excretion": text(r.get("排泄経路")), "note": text(r.get("メモ")),
        })

    quizzes = []
    for i, r in rows(wb, "学習問題"):
        if not include("学習問題", i, r, True):
            continue
        gid = text(r["群ID"])
        if gid not in group_ids:
            continue
        choices = []
        for n in range(1, 5):
            c = text(r.get("選択肢%d" % n))
            if c:
                choices.append({"t": c, "ok": False})
        ans = number(r.get("正解番号"))
        if ans in (None, "NG") or not (1 <= ans <= len(choices)):
            err("学習問題", i, "正解番号が選択肢の範囲にありません")
            continue
        choices[int(ans) - 1]["ok"] = True
        related = [s.strip() for s in re.split(r"[,、，]", text(r.get("関連する群ID"))) if s.strip()]
        quizzes.append({
            "id": text(r["問題ID"]), "group": gid, "title": text(r["タイトル"]), "who": text(r["場面の人物"]),
            "scene": text(r["場面"]), "question": text(r["問い"]), "choices": choices,
            "explain": lines(r.get("解説")), "related": [g for g in related if g in group_ids],
        })

    if errors:
        print("エラーがあるため data.js は更新しませんでした。\n" + "\n".join(errors))
        sys.exit(1)

    data = {
        "updated": datetime.date.today().strftime("%Y-%m-%d"),
        "labBase": settings.get("検査値アプリURL", ""),
        "fields": fields, "tags": tags, "groups": groups, "drugs": drugs, "quizzes": quizzes,
    }
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("// 自動生成（tools/build_data.py）。直接編集しない。正本は 薬剤ナビ_正本.xlsx\n")
        f.write("window.DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    print("data.js を作りました（%s）：薬効群 %d・個別薬 %d・学習問題 %d" %
          ("下書きを含む確認用" if args.drafts else "本番用・承認済みのみ", len(groups), len(drugs), len(quizzes)))


if __name__ == "__main__":
    main()
