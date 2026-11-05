# アプリのアイコン（PNG）を作る。デザインは public/icon.svg と同じ（緑の角丸に白いカプセルと心拍線）。
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public")


def draw(size, pad_ratio=0.0, rounded=True):
    S = 4 * size  # 拡大して描いてから縮小（なめらかにする）
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 14 / 64), fill="#0e7c74")
    else:
        d.rectangle([0, 0, S, S], fill="#0e7c74")
    u = S * (1 - 2 * pad_ratio) / 64
    o = S * pad_ratio

    def P(x, y):
        return (o + x * u, o + y * u)
    # カプセル（-40度回転）
    cap = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    c = ImageDraw.Draw(cap)
    x0, y0 = P(14, 16)
    x1, y1 = P(50, 34)
    c.rounded_rectangle([x0, y0, x1, y1], radius=int(9 * u), fill="#ffffff")
    mx = P(32, 0)[0]
    half = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    h = ImageDraw.Draw(half)
    h.rounded_rectangle([x0, y0, x1, y1], radius=int(9 * u), fill="#bfe8e3")
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rectangle([mx, 0, S, S], fill=255)
    cap.paste(half, (0, 0), mask)
    cx, cy = P(32, 25)
    cap = cap.rotate(40, center=(cx, cy), resample=Image.BICUBIC)
    img.alpha_composite(cap)
    pts = [P(14, 50), P(22, 50), P(25, 44), P(29, 54), P(33, 46), P(50, 46)]
    d = ImageDraw.Draw(img)
    d.line(pts, fill="#ffd166", width=int(3 * u), joint="curve")
    for p in (pts[0], pts[-1]):
        r = 1.5 * u
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill="#ffd166")
    return img.resize((size, size), Image.LANCZOS)


draw(192).save(os.path.join(OUT, "icon-192.png"))
draw(512).save(os.path.join(OUT, "icon-512.png"))
draw(512, pad_ratio=0.1, rounded=False).save(os.path.join(OUT, "icon-maskable-512.png"))
draw(180, rounded=False).save(os.path.join(OUT, "apple-touch-icon.png"))
print("icons ok")
