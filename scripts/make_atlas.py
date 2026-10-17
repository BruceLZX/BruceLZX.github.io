"""Generate the six-station contour map used by the scrolling survey."""
from pathlib import Path
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "atlas.svg"
W, H = 1400, 1037

# six stops, in reading order: paper, paper, product, product, role, role
POINTS = [
    (0.25, 0.32),
    (0.33, 0.58),
    (0.45, 0.28),
    (0.57, 0.58),
    (0.69, 0.30),
    (0.75, 0.64),
]
WEIGHTS = [1.0, 1.05, 1.1, 1.0, 1.15, 1.2]

gx = np.linspace(0, 1, 380)
gy = np.linspace(0, 1, 270)
X, Y = np.meshgrid(gx, gy)

Z = np.zeros_like(X)
for (px, py), weight in zip(POINTS, WEIGHTS):
    sx = 0.082 + 0.01 * weight
    sy = 0.072 + 0.01 * weight
    Z += weight * np.exp(-(((X - px) ** 2) / (2 * sx**2) + ((Y - py) ** 2) / (2 * sy**2)))

# shallow ridge through the survey route + low-frequency noise
Z += 0.26 * np.exp(-(((X - 0.50) ** 2) / 0.30 + ((Y - 0.48) ** 2) / 0.42))
Z += 0.09 * np.sin(7.2 * X + 1.2) * np.cos(5.3 * Y + 0.5)
Z += 0.05 * np.sin(12.6 * X - 2.9) * np.sin(8.7 * Y + 1.6)

levels = np.linspace(Z.min() + 0.02, Z.max() * 0.96, 21)

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
]
for x in range(100, W, 100):
    parts.append(f'<path d="M{x} 0V{H}" stroke="#b3bda6" stroke-width=".6" opacity=".3"/>')
for y in range(100, H, 100):
    parts.append(f'<path d="M0 {y}H{W}" stroke="#b3bda6" stroke-width=".6" opacity=".3"/>')
for level_index, closed, d in paths:
    if closed and level_index >= len(levels) - 8:
        weight = (level_index - (len(levels) - 8)) / 8
        parts.append(
            f'<path d="{d}" fill="#9fb894" fill-opacity="{0.05 + weight * 0.13:.3f}" stroke="none"/>'
        )
for level_index, closed, d in paths:
    if level_index % 4 == 0:
        parts.append(f'<path d="{d}" stroke="#41603f" stroke-width="1.15" opacity=".74"/>')
    else:
        parts.append(f'<path d="{d}" stroke="#557452" stroke-width=".75" opacity=".56"/>')
parts.append("</svg>")
OUT.write_text("\n".join(parts), encoding="utf-8")
print("paths", len(paths), "bytes", OUT.stat().st_size // 1024, "KB")
