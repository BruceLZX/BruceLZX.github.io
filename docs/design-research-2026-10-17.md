# 个人主页视觉与动效调研（2026-10-17）

目的：为 `brucelzx.github.io` 的改版收集可落地的参考与组件，约束是**纯静态托管 GitHub Pages、中英双语、CV/简历 PDF 流程不能坏**。

结论先行：

1. 现在"难看"的主因不是缺动效，而是**视觉系统不统一 + 字阶缺中间层 + 首屏图片质量**；先修这三样，再谈动画。
2. 动画优先级：**跨页 View Transition（纯 CSS）→ Hero 逐行揭示 → 论文 hover 预览 → 项目 sticky 堆叠**。四处足够，再多就是噪音。
3. 技术栈建议：**保留纯静态 + GSAP 或 Motion 二选一**；若想彻底解决双语重复维护，再考虑迁 Astro。React 组件库（Aceternity / ReactBits 等）适合"抄效果"，不适合整站套用。

---

## 一、现状诊断（基于当前代码，不是感觉）

| 问题 | 证据 | 后果 |
| --- | --- | --- |
| 两套色板并存 | 首页 `--blue:#2166b1`、`--bg:#fafbfc`；档案/CV `#2774ae` + 金色 `#ffca38`、`#f6f8fb` | 首页和 CV/档案不像同一个人的站点 |
| 字阶断层 | h1 56–88px、h2 36–56px、h3 22–24px、正文 15–17px | 只有"巨大"和"很小"两档，缺少 28–40px 的段落级标题，读起来平 |
| 卡片同质 | 研究区 2×2 等大卡片；项目区 3 条同构行 | 四篇论文权重相同（预印本/投稿/在审/课程研究），没有主次 |
| 负字距滥用 | `h1,h2{letter-spacing:-.055em}` 同时作用于中英文 | 中文标题被压得过紧，和 Avenir/PingFang 的字重不匹配 |
| 动效堆叠 | `scroll.css` 同时启用 intro-recede、topic-depth、note-depth、project-depth、role-depth，卡片另有 hover 位移 | 每屏都在动，反而没有重点 |
| 视觉噪音 | 最大 380px 的 "DIABETES" 水印 + 网格背景 + 卡片阴影 + 12px 圆角 | 元素都在争注意力 |
| 首屏图片 | `profile picture.png` 1.38 MB，显示区最大 330×330（1:1 裁切，`object-position:center 34%`） | 首屏 97% 的字节是一张未优化的 PNG，观感取决于原图而非设计 |

## 二、参考坐标系

### 2.1 交互 / 个人站标杆

- [Brittany Chiang](https://brittanychiang.com/) — 高密度内容 + 克制的强调色 + 清晰分节，证明"信息多"不等于"乱"。
- [Rauno Freiberg](https://rauno.me/) — 用一句话完成自我介绍，靠字号、留白、字重建立秩序；[Devouring Details](https://www.devouringdetails.com) 是他的交互细节课。
- [Paco Coursey](https://paco.me/) — 极简文本站，几乎没有装饰，靠排版和节奏撑住。
- [Emil Kowalski](https://emilkowal.ski/) — 交互设计师的写作索引；尤其推荐 [You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations)、[7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips)、[The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path)。
- [Jon Barron](https://jonbarron.info/) — 学术主页的"公共模板"：论文条目 hover 切换 before/after 预览图、重点行高亮；结构极土但信息效率极高。

### 2.2 学术主页模板（同类语境，可直接抄结构）

| 模板 | 技术 | 适合抄什么 |
| --- | --- | --- |
| [al-folio](https://github.com/alshedivat/al-folio) | Jekyll | 出版物 BibTeX、项目卡片、暗色模式、响应式 |
| [academicpages](https://github.com/academicpages/academicpages.github.io) | Jekyll + Markdown | 多页结构（About / Publications / Teaching / CV） |
| [HugoBlox academic-cv](https://github.com/HugoBlox/hugo-theme-academic-cv) | Hugo | 视觉块编辑器、BibTeX 自动导入、学术信息组织 |
| [luost26/academic-homepage](https://github.com/luost26/academic-homepage) | 纯 HTML/CSS | 轻量、无构建、GitHub Pages 直出（和你现在最接近） |

### 2.3 长期逛的灵感站

[Awwwards Portfolio](https://www.awwwards.com/websites/portfolio/) ·
[SiteInspire](https://www.siteinspire.com/) ·
[CSS Nectar](https://cssnectar.com/) ·
[Orpetron](https://orpetron.com/) ·
[Land-book](https://land-book.com/) ·
[Minimal Gallery](https://minimal.gallery/) ·
[recent.design](https://recent.design)（原 godly.website 跳转）

## 三、动效技术选型

### 3.1 原生优先（零依赖，强烈建议先用）

| 能力 | 用在哪 | 支持度（2026-09 数据） |
| --- | --- | --- |
| [View Transitions 单文档](https://caniuse.com/view-transitions) | 同页状态切换（展开论文、切换中英过滤） | 92.9%；Chrome 111+ / Safari 18+ / Firefox 144+ |
| [`@view-transition` 跨文档](https://caniuse.com/mdn-css_at-rules_view-transition) | 首页 ↔ CV ↔ Archive 的页面过渡、共享元素 | 87.9%；Chrome/Edge 126+ / Safari 18.2+；**Firefox 尚不支持** |
| [`animation-timeline: view()`](https://caniuse.com/mdn-css_properties_animation-timeline_view) | 滚动进入/离开动画，无需 JS | 87.84%；Chrome 115+ / Safari 26+ / Firefox 161+ |
| `clip-path` + `@property` | 遮罩揭示、下划线扫过、计数器 | Baseline |
| `:has()` | 展开论文时暂停同级卡片动效 | Baseline |

跨页过渡示例（纯 CSS，加在两页即可）：

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: fade-out .18s ease both; }
::view-transition-new(root) { animation: fade-in .28s ease both; }
/* 共享元素：同名 view-transition-name 会在两页之间 morph */
.portrait img { view-transition-name: portrait; }
```

### 3.2 动画库（四选一，别混用）

| 库 | 体积 / 形态 | 强项 | 坑 |
| --- | --- | --- | --- |
| [GSAP](https://gsap.com/) | 模块化，核心 + 插件 | 时间线编排、ScrollTrigger、SplitText、Flip | 生态大，容易写出"GSAP 味"的过度动画 |
| [Motion](https://motion.dev/)（原 Framer Motion） | mini 起步 3.2 KB | React/Vue/原生 JS 统一 API、布局动画、手势、`ScrollTimeline` | 布局动画在长列表上有性能成本 |
| [anime.js v4](https://animejs.com/) | 全量 24.5 KB，可按需引入 | Scroll Observer、SVG morph/描边、stagger、Draggable | 文档 4.0 刚换代，示例新旧混杂 |
| [Lenis](https://lenis.dev/) | 单文件、`new Lenis()` | 平滑滚动，让 DOM 与 WebGL 同帧 | 官方称"无无障碍妥协"，但仍需自己保证键盘/锚点/`prefers-reduced-motion` |

**GSAP 现已对所有人免费**（Webflow 收购后，[官网首页](https://gsap.com/)与[定价页](https://gsap.com/pricing/)均如此声明），包括 SplitText、ScrollTrigger 等原付费插件。SplitText 的几个细节对双语站很关键：自动加 `aria-label`/`aria-hidden`、`autoSplit` 响应式重切、`mask:"lines"` 做遮罩揭示、`prepareText()` 可处理中文断词（[文档](https://gsap.com/docs/v3/Plugins/SplitText/)）。

### 3.3 重武器（这个站大概率不需要）

- [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)：3D 场景、粒子、着色器。首屏 LCP 杀手，除非有真实 3D 内容。
- [Rive](https://rive.app/) / [Lottie](https://lottiefiles.com/)：矢量角色/图标动画，适合一个有故事的 hero，不适合满屏。
- [Theatre.js](https://www.theatrejs.com/)：可视化时间线编辑，个人站用不上。

## 四、组件库清单（能直接抄的块）

| 库 | 栈 | 适合抄什么 | 备注 |
| --- | --- | --- | --- |
| [Aceternity UI](https://ui.aceternity.com/components) | React + Tailwind + Motion | 文字揭示、spotlight、bento、sticky scroll、magnetic button | 目录极大，部分模板付费；整站套用会"模板味"很重 |
| [React Bits](https://reactbits.dev/) | React，源码可复制/CLI | Text Animations、Backgrounds、Micro Interactions | 免费，代码归你；适合拿单个效果 |
| [Motion Primitives](https://motion-primitives.com/) | React + Motion | text effect、accordion、carousel、AI 输入框 | 开源、copy-paste，克制好用 |
| [Hover.dev](https://www.hover.dev/) | React + Tailwind + Motion | 按钮、导航、卡片 hover | 偏营销站，学术站慎选 |
| [21st.dev](https://21st.dev/) | React + shadcn 约定 | 12,000+ 组件，含 Aceternity/Magic UI/shadcn 镜像 | 找块最快的入口 |
| [shadcn/ui](https://ui.shadcn.com/) | React + Radix | 基础组件与设计 token 思路 | 不提供花哨动效，但结构最干净 |
| [Uiverse](https://uiverse.io/) | 纯 HTML/CSS/Tailwind | 按钮、开关、卡片 hover | 7,456 个元素，质量参差，适合找 CSS 写法 |

**重要判断**：这些库 90% 是 React + Tailwind。你现在是无构建的静态 HTML，直接搬要引入 React 运行时。可选做法：只抄 CSS/JS 思路手写（推荐），或用 Astro 的 React island 局部引入。

## 五、排版与视觉系统建议

### 5.1 字体

- 英文标题（有性格）：Instrument Serif、Fraunces、Newsreader；英文正文：Inter、Geist、Source Sans 3。
- 等宽（日期、编号、eyebrow）：JetBrains Mono、IBM Plex Mono。
- 中文：标题用[思源宋体 / Source Han Serif](https://github.com/adobe-fonts/source-han-serif)，正文用 Noto Sans SC；想更柔和可用[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)。
- 字体来源：[Google Fonts](https://fonts.google.com/)、[Fontshare](https://www.fontshare.com/)、[Fontsource](https://fontsource.org/)（自托管，避免第三方请求）。
- 排版参考：[Practical Typography](https://practicaltypography.com/)、[Typewolf](https://www.typewolf.com/)。

### 5.2 字阶与行高

```
12 / 14 / 16 / 18 / 24 / 32 / 44 / 64 / 88
英文正文 line-height 1.55；中文 1.8；标题 1.05–1.15
中文标题 letter-spacing: .01em（不要用负字距）
```

### 5.3 色彩

- 选**一套**：UCLA blue `#2774AE`（学术、可信）或深墨蓝 `#1B3A57`（更沉）。
- 纸色：冷白 `#FAFBFC` 或暖白 `#F7F5F2`，二选一，首页与档案页共用。
- 暗色：`#0E1116` 底 + `#E8E6E1` 字 + 同一强调色降饱和；不要把暗色当第二套设计。
- 规则：全站强调色出现面积 < 5%，只用于链接、当前状态、关键数字。

### 5.4 栅格

- 12 列，最大宽 1200，gutter 24；阅读列 680–720。
- 用**非对称**制造层级：左 3–4 列放 sticky 标签/年份，右 8–9 列放内容（档案页已有 170px 标签列，可强化成统一语言）。

## 六、八个可落地效果（按性价比排序）

1. **Hero 逐行遮罩揭示** — 标题分 2–3 行，用 `clip-path` 或 SplitText `mask:"lines"` 从下往上揭示，400–600ms，只播一次。成本：低。
2. **跨页 View Transition** — 首页→CV→Archive 淡入淡出，头像/姓名做共享元素。纯 CSS，不支持的浏览器直接跳转。成本：低。
3. **论文 hover 预览** — 悬停条目时右侧/光标旁出现结果图或 3 秒静音视频（Jon Barron 模式）。成本：中（要为 4 篇论文各做一张图）。
4. **项目 sticky 堆叠** — 三张项目卡依次覆盖上一张，用 `position:sticky` + `animation-timeline: view()`，替代现在的"整体 recede"。成本：低。
5. **关键数字计数** — 80.38% / 76.93% / 5,000+ / 11 languages，进入视口时从 0 滚到目标值，仅 2–3 处。成本：低。
6. **导航收缩 + 细进度线** — 滚动后 88px 导航降到 56px，顶部 1px 进度线用 scroll-driven animation。成本：低。
7. **下划线扫过 / 磁性按钮** — 只给 GitHub、LinkedIn、Email 三个入口，桌面端生效。成本：低。
8. **噪点纹理 + 统一圆角** — inline SVG `feTurbulence` 做 3–5% 透明度颗粒，圆角统一 8px 或 0（二选一）。成本：极低，但对"质感"提升最大。

**动效预算**：首屏只允许 1 个主动效；每个滚动屏最多 1 个进入动画；时长 180–400ms；全部包在 `prefers-reduced-motion` 里；不做滚动劫持、不做自定义光标（除非只在大屏且可关闭）。

## 七、三条路线

| 路线 | 做什么 | 工期 | 风险 | 适合 |
| --- | --- | --- | --- | --- |
| **A. 纯静态视觉重做** | 重写 `home.css` token/字阶/间距；统一档案页色板；重导图片；加 3–4 个原生动效（可选 GSAP） | 1–2 天 | 低，不改部署 | 想最快看到效果 |
| **B. Astro 重构** | 内容进 content collections，中英共用数据源；组件化 Publication/Project/Experience；`astro:assets` 出 WebP；`<ClientRouter />` 做页面过渡；仍输出纯静态 | 3–5 天 | 中，需要保留旧 URL 与 PDF 链接 | 想根治双语重复维护 |
| **C. React/Next + 组件库** | 套 Aceternity/ReactBits 整站 | 1–2 天（看起来） | 高：体积、模板味、与 PDF 流程脱节 | 不推荐 |

**推荐：先 A 后 B。** A 解决"难看"，B 解决"每次改内容要改两份 HTML"这个真实痛点（现在 `index.html` 与 `index-zh.html` 各 13 KB 手写重复，档案页同理）。

## 八、验收清单

- [ ] 首屏 LCP < 2.0s，图片 < 150 KB（WebP/AVIF + `srcset`）
- [ ] `prefers-reduced-motion` 下无位移/缩放，仅保留透明度
- [ ] 键盘可完成导航、展开、切换语言
- [ ] 中英文各自断行正常，中文标题无负字距
- [ ] 首页、档案、CV 三处强调色一致
- [ ] `cv.html`/`cv_zh.html` 打印样式不受改版影响，`export_cv.py` 仍通过
- [ ] 四份简历 PDF 链接不变（文件名稳定）
- [ ] 旧 URL `index.html`、`archive.html`、`cv.html` 仍可访问

## 九、收藏夹（纯链接）

**灵感**：Awwwards / SiteInspire / CSS Nectar / Orpetron / Land-book / Minimal Gallery / recent.design
**人物**：Brittany Chiang / Rauno Freiberg / Paco Coursey / Emil Kowalski / Jon Barron
**学术模板**：al-folio / academicpages / HugoBlox academic-cv / luost26 academic-homepage
**动画**：GSAP / Motion / anime.js / Lenis / View Transitions / CSS scroll-driven animations
**组件**：Aceternity / React Bits / Motion Primitives / Hover.dev / 21st.dev / shadcn / Uiverse
**字体**：Google Fonts / Fontshare / Fontsource / Source Han Serif / LXGW WenKai / Practical Typography
