# 站点现状审计（2026-10-17）

审计基线：`main` @ `3aff8d9`（2026-10-12），工作区干净，与 `origin/main` 同步；线上
<https://brucelzx.github.io/> 返回 200，内容与 HEAD 一致。

方法：通读 6 个页面、5 个样式表、2 个脚本、简历构建与 CV 导出脚本；用只读脚本做结构检查
（HTML 解析统计 id/锚点/h1/alt、CSS 类使用统计、本地资源引用存在性检查）。**未修改任何站点文件**，
未安装依赖，未重新生成 PDF。结论中的数字均可在当前提交上复现。

## 一、已验证正常（改动时不要破坏）

| 检查项 | 结果 |
| --- | --- |
| 页面数 / 语言标记 | 6 页：`index(.html/-zh)`、`archive(.html/-zh)`、`cv(.html/_zh)`，lang 分别为 `en` / `zh-CN` |
| h1 数量 | 每页恰好 1 个 |
| 重复 id | 0 |
| 页内锚点目标 | 0 失效（导航、脚注、`#resumes`、`#top` 等全部存在） |
| 本地资源引用 | 21 个全部存在（CSS/JS/PNG/PDF/海报） |
| 图片 alt | 2 张头像图均有 alt |
| 线上一致性 | Pages 首页与本地 HEAD 内容一致 |

## 二、问题清单

### P1 — 本地无法重建 PDF（工具链缺依赖）

- 现象：`python resumes/build.py` 在导入阶段即失败；`python scripts/export_cv.py` 同样不可运行。
- 证据：Python 3.11.9 已装 `fontTools`，**缺 `pypdf`、`playwright`**；TeX Live 2024 的
  `latexmk` / `xelatex` / `kpsewhich` / `pdftotext` 均可用（`pdftotext` 解析到 TeX Live 自带副本）。
- 影响：当前机器只能改网页，不能按 README 的流程重新生成 `resumes/pdf/` 与 `output/pdf/`。
- 建议：`python -m pip install -r resumes/requirements.txt`，另装 `playwright` 与 Chrome；
  或为站点单独建 venv，避免污染全局解释器。

### P1 — 首页体积几乎全部来自一张 PNG

- 现象：`profile picture.png` = 1,384,348 B（1.32 MiB）；首页其余资源合计约 23.4 KB
  （`home.css` 16,594 B + `scroll.css` 6,137 B + `home.js` 1,243 B），HTML 本体约 13 KB。
- 影响：首屏传输约 1.36 MiB，图片占 ~97%；没有 `srcset`、没有 WebP/AVIF，移动端下载同一张原图。
- 建议：导出 2–3 档宽度（如 640/960/1280）的 WebP，配 `srcset`+`sizes`，保留 PNG 作为
  fallback；可顺带裁掉图片中未使用的留白。

### P2 — 两套样式表里存在成规模的死代码

- `site.css`：66,613 B / 1,652 行，定义 91 个类，**档案页实际用到的约 25 个**。未使用的是被替换掉的
  旧首页体系（`field-layout`、`parallax-pad`、`trace-map`、`route-nav`、`workstream`、
  `paper-entry`、`content-section`、`hero-field`、`pad-*` 等）。真正服务档案页的只有：
  `site-header`/`shell`、`archive-*`、`record*`、`zh-page` 的少量排版修正、响应式断点。
- `home.css`：16,594 B，60 个类中 14 个在首页 HTML 中不存在：`work-section`、`work-layout`、
  `work-entries`、`algorithm-demo`、`demo-*`、`token*`（含 `token-0/1`、`range-labels`）、
  `theme-toggle`。
- 影响：改样式时容易改到不生效的规则；文件体积与认知负担无谓增加。
- 建议：把 `site.css` 拆成 `archive.css`（只留档案页所需）+ 删除旧首页段；`home.css` 删除
  token 演示与 work-layout 段。删除前用 `grep` 确认类名在所有 HTML/JS 中确实为零引用。

### P2 — `site.js` 在档案页与 CV 页基本不执行

- 现象：557 行 / 23,727 B，实际生效的只有第 1 行的 `js` 标记与第 3–8 行的邮箱解码。其余模块
  （场景观察器、pad 详情、trace map、指针视差、canvas 网络图、滚动 reveal）查询的元素在这些页面
  上都是空集合，靠 null guard 静默跳过。
- 影响：CV 页为了一行邮箱解码要下载 23.7 KB 脚本；档案页同理。
- 建议：拆出 `email.js`（或把解码逻辑内联进 CV/档案页的小脚本），把视差/网络图代码归档或删除。

### P2 — 开始时间存在三种写法

- `cv.html` 教育条：`Sep 2026 - Jun 2028 (expected)`。
- `cv.html` 科研条与 `archive.html` 经历条：`Aug 2026 - Present` / `Aug 2026 - present`。
- 首页图注：`Fall 2026`；中文页为 `2026 年秋季`。
- 影响：CV 内部自相矛盾（同一位 UCLA 经历，教育写 9 月、科研写 8 月）；对申请材料是事实性风险。
- 建议：确定一个口径（按入职/入学实际月份），同步 `cv.html`、`cv_zh.html`、`archive*.html`、
  首页图注与 4 份 `.tex`，然后重跑两个生成脚本。

### P3 — 暗色模式不可达

- 现象：`home.css` 保留 `prefers-color-scheme` 与 `[data-theme=dark]` 两套变量（第 14–15 行）
  和 `.theme-toggle` 样式，但页面写死 `data-theme="light"`，`home.js` 第 3 行又强制 light，
  且全站没有任何主题切换按钮（`theme-toggle` 在 HTML 中出现 0 次）。
- 影响：约 20 行无效样式；若将来加按钮，`home.js` 的强制赋值会直接覆盖。
- 建议：二选一——删除暗色规则；或加回按钮 + `localStorage` 持久化，并去掉强制赋值。

### P3 — 缓存版本号不一致

- 有版本号：`home.css?v=20261006`、`cv.css?v=20261011b`。
- 无版本号：`scroll.css`、`site.css`、`resume-downloads.css`、`home.js`、`site.js`。
- 影响：GitHub Pages 的 CDN 缓存可能让访客拿不到更新后的动效/布局样式（`scroll.css` 恰是改动
  最频繁的那份）。
- 建议：统一加 `?v=YYYYMMDDx`，或改用内容哈希（本站为纯静态，手工维护日期即可）。

### P3 — 没有页面级自动化检查

- 现状：PDF 有严格断言（单页/Letter/字体 Unicode/链接/页脚/关键数字），HTML/CSS 没有任何校验；
  仓库无 `.github/workflows`，无 HTML 链接检查、无重复 id 检查、无未使用类检查。
- 影响：本次审计靠临时脚本完成，无法在提交前自动拦截回归。
- 建议：加一个 `scripts/check_site.py`（就是本次审计用的逻辑）+ 一个最简单的 Actions 工作流；
  简历构建依赖 TeX Live，放 CI 成本较高，可只跑 HTML 结构与链接检查。

### 附加：提交身份与联系邮箱不一致（非站点问题）

- 全局 `.gitconfig`：`Bruce Li <brucel@usc.edu>`；站点与简历对外邮箱为 `bruceli@ucla.edu`。
- 仅作记录，避免以后排查历史时误判；如需统一，改 `user.email` 即可，历史提交不改写。

## 三、按设计保留、勿误删

- `archive*.html` 中的 `629 tests`、`438 mypy files`、`139 Python tests`、`34 contract checks`
  等工程量指标：档案页刻意保留完整记录，而 `resumes/README.md` 的编辑规则要求这些**不得进入**
  申请简历（`resumes/build.py` 用正则断言简历里不出现 `629|438|139|34 contract`）。两条轨道不同，
  属预期差异。
- `cv.html` / `cv_zh.html` 保留 CrAIg Capital 与 Game Theory；两份一页简历刻意不含。
- `output/pdf/` 与 `resumes/pdf/` 都是受控二进制，文件名含姓名与岗位，构建脚本只在全部校验通过后
  覆盖，**不要手工改文件名**。
- `tmp/`、`resumes/build/`、`.playwright-cli/` 已被 `.gitignore` 忽略，属于本地临时产物。

## 四、建议的修复顺序（尚未执行）

1. 装依赖，确认 `python resumes/build.py` 与 `python scripts/export_cv.py` 能跑通（P1）。
2. 统一 UCLA 起始时间口径，重生成 4 份简历 + 2 份 CV PDF（P2）。
3. 图片转 WebP + `srcset`，补版本号（P1/P3）。
4. 拆分 `site.js`、清理 `site.css`/`home.css` 死代码（P2）。
5. 决定暗色模式去留；补 `scripts/check_site.py` 与最小 CI（P3）。

## 五、复现方式

结构检查：用 `html.parser` 收集每页 `id`、`a[href^="#"]`、`h1` 与 `img[alt]`，比较集合；
资源检查：正则提取 `href|src`，剔除 `http/mailto/tel/#` 后逐个 `Test-Path`；
类使用检查：从 CSS 正则取 `.class`，与 HTML 的 `class` 属性、`id`、以及两个脚本里
`classList.add/remove/toggle` 的字面量求差集。

```powershell
# 基线确认
git log -1 --format='%h %ad %s' --date=iso
git status --short --branch

# 重新生成（依赖齐备后）
python resumes/build.py
python scripts/export_cv.py
```
