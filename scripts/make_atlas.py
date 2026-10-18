"""Generate an organic contour field used as the blurred page background."""
from pathlib import Path
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "atlas.svg"
W, H = 1400, 1037

rng = np.random.default_rng(31)
POINTS = list(zip(rng.uniform(0.10, 0.90, 9), rng.uniform(0.12, 0.88, 9)))
WEIGHTS = rng.uniform(0.72, 1.28, 9)

gx = np.linspace(0, 1, 380)
gy = np.linspace(0, 1, 270)
X, Y = np.meshgrid(gx, gy)

Z = np.zeros_like(X)
for (px, py), weight in zip(POINTS, WEIGHTS):
    sx = 0.055 + 0.025 * weight
    sy = 0.050 + 0.022 * weight
    Z += weight * np.exp(-(((X - px) ** 2) / (2 * sx**2) + ((Y - py) ** 2) / (2 * sy**2)))

Z += 0.08 * np.sin(6.4 * X + 1.7) * np.cos(4.8 * Y + 0.4)
Z += 0.05 * np.sin(12.1 * X - 2.2) * np.sin(8.3 * Y + 1.5)

levels = np.linspace(Z.min() + 0.01, Z.max() * 0.98, 30)

fig, ax = plt.subplots(figsize=(W / 100, H / 100), dpi=100)
cs = ax.contour(X, Y, Z, levels=levels, linewidths=0.7)
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
    simple = rdp(body, 1.0) if len(body) > 4 else body
    if len(simple) < 3:
        continue
    d = f"M{simple[0][0]} {simple[0][1]}" + "".join(f"L{x} {y}" for x, y in simple[1:])
    if closed:
        d += "Z"
    paths.append((level_index, closed, d))

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
    'fill="none" role="presentation">',
    f'<rect width="{W}" height="{H}" fill="#eef3e5"/>',
]
for x in range(100, W, 100):
    parts.append(f'<path d="M{x} 0V{H}" stroke="#b3bda6" stroke-width=".6" opacity=".16"/>')
for y in range(100, H, 100):
    parts.append(f'<path d="M0 {y}H{W}" stroke="#b3bda6" stroke-width=".6" opacity=".16"/>')
for level_index, closed, d in paths:
    if closed and level_index >= len(levels) - 10:
        weight = (level_index - (len(levels) - 10)) / 10
        parts.append(
            f'<path d="{d}" fill="#b4c8a4" fill-opacity="{0.10 + weight * 0.18:.3f}" stroke="none"/>'
        )
for level_index, closed, d in paths:
    if level_index % 4 == 0:
        parts.append(f'<path d="{d}" stroke="#3f5c3f" stroke-width="3.2" opacity=".55"/>')
    else:
        parts.append(f'<path d="{d}" stroke="#557452" stroke-width="2.0" opacity=".42"/>')
parts.append("</svg>")
OUT.write_text("\n".join(parts), encoding="utf-8")
print("paths", len(paths), "bytes", OUT.stat().st_size // 1024, "KB")
