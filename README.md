# リハに活かす薬剤ナビ

薬の作用・時間（Tmax・半減期）・副作用を、介入前後の観察と判断につなげるための、リハ職（PT/OT/ST）向けの Web アプリです。スマホ・タブレットではホーム画面に追加して使え、一度開けばオフラインでも動きます。患者の情報は入力できません。

生成AIで作成した学習・参照用のツールで、専門職による監修は受けていません（2026-11-07 の方針。画面のホームと「このアプリについて」の「この教材を使う・共有する方へ」に、確認の方法とあわせて示しています）。

公開URL：https://reha-yakuzai.rehab-apps.workers.dev/

決定事項・経緯は [設計メモ.md](設計メモ.md) を参照してください。

## フォルダ構成

| パス | 内容 |
|---|---|
| `public/` | 公開されるアプリ本体（Cloudflare Workers の公開フォルダ） |
| `public/data.js` | 正本から自動生成するデータ（直接編集しない） |
| `public/figures.js` | 薬効の仕組みの模式図（院内作成の SVG）。キーは正本の「図ID」 |
| `薬剤ナビ_正本.xlsx` | WG が管理する正本（薬効群・個別薬・学習問題・症状タグ・分野・設定） |
| `tools/build_data.py` | 正本 → data.js の変換 |
| `public/figures-*.js` | 分野別の模式図（cv・dm・cns・pain・onc・abx） |
| `tools/content/` | 分野別の下書き（`*.py`）、症状タグ一覧（`tags.py`）、下書きの作業指示（`BRIEF.md`） |
| `tools/append_content.py` | `tools/content/` の下書きを正本に追記する（既存の ID は上書きしない） |
| `tools/figcheck.js` | 図の重なりチェック（開発用。ブラウザのコンソールで実行） |
| `tools/seed_samples.py`・`seed_content.py` | 正本を最初に作ったときのスクリプト（見本3群）。再実行すると正本を上書きするので通常は使わない |

## データを更新して公開する

1. `薬剤ナビ_正本.xlsx` を編集する。公開してよい行は「状態」を「承認済み」にし、「確認者」「確認日」を入れる（画面には表示されない）
2. 確認したいとき：`下書き確認用データ作成.bat` → 下書きを含む data.js（**push しない**）
3. 公開するとき：`本番用データ作成.bat` → 承認済みの行だけの data.js
4. GitHub（Hi-HiDe/reha-yakuzai）の main に push → Cloudflare が自動で公開

変換には Python と openpyxl が必要です（`python -m pip install openpyxl`）。

手元で表示を確かめるときは、次のコマンドで起動し、ブラウザで http://localhost:8765 を開きます。

```bash
python -m http.server 8765 -d public
```

書籍 PDF は `.gitignore` で GitHub に送らないようにしています。
