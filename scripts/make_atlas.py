"""Six-stop contour field used as the scroll-driven page backdrop."""
from pathlib import Path
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "atlas.svg"
W, H = 1400, 1037

POINTS = [
    (0.36, 0.62),
    (0.44, 0.30),
    (0.52, 0.62),
    (0.62, 0.42),
    (0.72, 0.58),
    (0.82, 0.26),
]
WEIGHTS = [1.0, 1.08, 0.94, 1.12, 1.0, 1.1]

gx = np.linspace(0, 1, 420)
gy = np.linspace(0, 1, 300)
X, Y = np.meshgrid(gx, gy)

Z = np.zeros_like(X)
for (px, py), weight in zip(POINTS, WEIGHTS):
    sx = 0.070 + 0.012 * weight
    sy = 0.062 + 0.012 * weight
    Z += weight * np.exp(-(((X - px) ** 2) / (2 * sx**2) + ((Y - py) ** 2) / (2 * sy**2)))

Z += 0.07 * np.sin(6.1 * X + 1.4) * np.cos(4.9 * Y + 0.8)
Z += 0.04 * np.sin(11.3 * X - 2.0) * np.sin(7.7 * Y + 1.2)

levels = np.linspace(Z.min() + 0.01, Z.max() * 0.98, 28)

fig, ax = plt.subplots(figsize=(W / 100, H / 100), dpi=100)
cs = ax.contour(X, Y, Z, levels=levels, linewidths=0.6)
raw = []
for level_index, seg in enumerate(cs.allsegs):
    for path in seg:
        if len(path) < 6:
            continue
        pts = [(int(round(x * W)), int(round((1 - y) * H))) for x, y in path]
        closed = abs(pts[0][0] - pts[-1][0]) < 3 and abs(pts[0][1] - pts[-1][1]) < 3
        raw.append((level_index, closed, pts))
plt.close(fig)


def rdp(points, eps):
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = (dx * dx + dy * dy) ** 0.5 or 1.0
    best, index = -1.0, 0
    for i in range(1, len(points) - 1):
        x0, y0 = points[i]
        dist = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / norm
        if dist > best:
            best, index = dist, i
    if best > eps:
        return rdp(points[: index + 1], eps)[:-1] + rdp(points[index:], eps)
    return [points[0], points[-1]]


paths = []
for level_index, closed, pts in raw:
    body = pts[:-1] if closed else pts
    simple = rdp(body, 0.9) if len(body) > 4 else body
    if len(simple) < 3:
        continue
    d = f"M{simple[0][0]} {simple[0][1]}" + "".join(f"L{x} {y}" for x, y in simple[1:])
    if closed:
        d += "Z"
    paths.append((level_index, closed, d))

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
    'fill="none" role="presentation">',
]
for x in range(100, W, 100):
    parts.append(f'<path d="M{x} 0V{H}" stroke="#aab7a0" stroke-width=".7" opacity=".2"/>')
for y in range(100, H, 100):
    parts.append(f'<path d="M0 {y}H{W}" stroke="#aab7a0" stroke-width=".7" opacity=".2"/>')
for level_index, closed, d in paths:
    if closed and level_index >= len(levels) - 11:
        weight = (level_index - (len(levels) - 11)) / 11
        parts.append(
            f'<path d="{d}" fill="#aec4a1" fill-opacity="{0.035 + weight * 0.075:.3f}" stroke="none"/>'
        )
for level_index, closed, d in paths:
    if level_index % 4 == 0:
        parts.append(f'<path d="{d}" stroke="#3f5c3f" stroke-width="1.35" opacity=".58"/>')
    else:
        parts.append(f'<path d="{d}" stroke="#5e7b59" stroke-width=".8" opacity=".4"/>')

for px, py in POINTS:
    parts.append(
        f'<circle cx="{px * W:.0f}" cy="{py * H:.0f}" r="7" fill="#9a5b3b" opacity=".5"/>'
    )

parts.append("</svg>")
OUT.write_text("\n".join(parts), encoding="utf-8")
print("paths", len(paths), "bytes", OUT.stat().st_size // 1024, "KB")


