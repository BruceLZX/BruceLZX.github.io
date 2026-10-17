# 组件与动效资源清单（2026-10-17）

用途：给 `brucelzx.github.io` 改版时"抄得动"的组件库与单效果来源。
筛选标准：**有真实 demo、源码可复制、能降级、不是纯营销站模板**。
标注 `React` 的库不能直接放进当前的无构建静态页，需要抄 CSS/JS 思路或走 island。

---

## 一、一站式组件库（先逛这 18 个）

| 库 | 栈 | 规模 | 费用 | 最值得抄 |
| --- | --- | --- | --- | --- |
| [Aceternity UI](https://ui.aceternity.com/components) | React + Tailwind + Motion | 数百 | 免费为主，模板/All-Access 付费 | 文字揭示、spotlight、bento、sticky scroll、magnetic button |
| [Magic UI](https://magicui.design/) | React + Tailwind + Motion | 60+ | 免费为主 | marquee、number ticker、blur fade、animated beam、dock |
| [React Bits](https://reactbits.dev/) | React，源码可复制 | 100+ | 免费 + Pro | 文字动画、背景、micro interactions |
| [Motion Primitives](https://motion-primitives.com/) | React + Motion | 30+ | 开源 + Pro | text effect、animated group、accordion、carousel |
| [Animata](https://animata.design/) | React + Tailwind | 156+ | 免费 MIT | card spread、typing text、hero 布局、滚动叙事 |
| [Cult UI](https://www.cult-ui.com/) | React + shadcn | 154 | 免费 MIT | dynamic island、globe、fluted glass、kanban |
| [SmoothUI](https://smoothui.dev/) | React + Motion/GSAP | 228 | 开源免费 | 弹簧物理、Siri orb、island、number、wave |
| [ScrollX UI](https://scrollxui.dev/) | React + Tailwind | 140+ | 开源 | 滚动叙事块、hold-to-pay、交互式按钮 |
| [Kokonut UI](https://kokonutui.com/) | React + Motion + shadcn | 75 | 免费开源 + Pro | detent dial、tear button、liquid gauge、磁吸按钮 |
| [HextaUI](https://hextaui.com/) | React + shadcn/Base UI | 65 | 免费 MIT + Pro blocks | number flow、toast、input OTP、可中断动效 |
| [Origin UI](https://originui.com/) | React + Tailwind | 数百 | 免费 | 表单、导航、表格等"日常件"的干净实现 |
| [shadcn/ui](https://ui.shadcn.com/) | React + Radix | — | 免费 MIT | 组件结构与 token 思路；不花哨但最稳 |
| [21st.dev](https://21st.dev/) | React + shadcn 约定 | 12,000+ | 免费 + 付费 | 聚合搜索，找块最快入口 |
| [Hover.dev](https://www.hover.dev/) | React + Tailwind + Motion | 数百 | 免费 + 付费 | 按钮、导航、卡片 hover |
| [Uiverse](https://uiverse.io/) | 纯 HTML/CSS/Tailwind | 7,456 | 免费 | 纯 CSS 按钮/开关/卡片 hover，可直接改写 |
| [Inspira UI](https://inspira-ui.com/) | Vue / Nuxt | 100+ | 免费开源 | 如果以后用 Vue/Nuxt，动画件最全 |
| [Motion UI](https://motion.dev/ui) | React | 组件 + 50 区块 | Motion+ 付费 | Gallery、Cursor、Curtains、AnimateNumber、splitText |
| [Aceternity Templates](https://ui.aceternity.com/templates) | Next.js | 模板 | 付费为主 | 看整体版式，不建议整站套 |

## 二、具体效果（按用途挑，直接搜组件名）

### 文字

| 效果 | 来源 | 适合用在哪 |
| --- | --- | --- |
| [Text Generate Effect](https://ui.aceternity.com/components/text-generate-effect) | Aceternity | Hero 一句话逐词浮现 |
| [Text Hover Effect](https://ui.aceternity.com/components/text-hover-effect) | Aceternity | 姓名/标题的描边扫过 |
| [Flip Words](https://ui.aceternity.com/components/flip-words) | Aceternity | 轮换研究关键词（少用） |
| [Encrypted Text](https://ui.aceternity.com/components/encrypted-text) | Aceternity | 技术感标签，慎用 |
| [Squiggly Text](https://ui.aceternity.com/components/squiggly-text) | Aceternity | 轻松语气的一行字 |
| [Typewriter Effect](https://ui.aceternity.com/components/typewriter-effect) | Aceternity | 打字机，学术站不建议 |
| [React Bits · Text Animations](https://reactbits.dev/c/text-animations) | React Bits | split/scroll/rotate 文字全家桶 |
| [Text Effect](https://motion-primitives.com/docs) | Motion Primitives | 逐字/逐词/逐行预设 |
| [Typing Text](https://animata.design/docs/text/typing-text) | Animata | 轻量打字效果 |
| [Splitting.js](https://splitting.js.org/) | 原生 JS | 把文字拆成 chars/words/lines |
| [SplitType](https://github.com/lukePeavey/SplitType) | 原生 JS | 比 Splitting 更新，支持嵌套标签 |
| [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) | GSAP | 目前最完整：aria、autoSplit、mask、中文断词 |
| [Rough Notation](https://roughnotation.com/) | 原生 JS，3.8kb | 手绘圈注/下划线，适合"强调一句结论" |

### 滚动与进度

| 效果 | 来源 | 说明 |
| --- | --- | --- |
| [Container Scroll Animation](https://ui.aceternity.com/components/container-scroll-animation) | Aceternity | 3D 容器随滚动展开 |
| [Sticky Scroll Reveal](https://ui.aceternity.com/components/sticky-scroll-reveal) | Aceternity | 左侧滚动、右侧内容切换 |
| [Tracing Beam](https://ui.aceternity.com/components/tracing-beam) | Aceternity | 沿滚动路径画线，适合时间线 |
| [Parallax Scroll](https://ui.aceternity.com/components/parallax-scroll) | Aceternity | 图片列视差 |
| [Macbook Scroll](https://ui.aceternity.com/components/macbook-scroll) | Aceternity | 笔记本开合，产品展示用 |
| [Scroll Progress](https://magicui.design/docs/components) | Magic UI | 顶部细进度条 |
| [ScrollX UI 滚动块](https://scrollxui.dev/docs/components) | ScrollX | 滚动叙事、粘性章节 |
| [Lenis](https://lenis.dev/) | 原生 JS | 平滑滚动标准件 |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | GSAP | 滚动时间线的事实标准 |
| [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/) | 原生 JS | 老牌视差，v5 已内置 Lenis |
| [ScrollReveal](https://scrollrevealjs.org/) | 原生 JS | 简单入场，够用但平庸 |

### 卡片、悬停、光标

| 效果 | 来源 | 说明 |
| --- | --- | --- |
| [Card Spotlight](https://ui.aceternity.com/components/card-spotlight) | Aceternity | 光标跟随的高光卡片 |
| [3D Card Effect](https://ui.aceternity.com/components/3d-card-effect) | Aceternity | 鼠标倾斜 3D |
| [Wobble Card](https://ui.aceternity.com/components/wobble-card) | Aceternity | 弹性跟随 |
| [Focus Cards](https://ui.aceternity.com/components/focus-cards) | Aceternity | hover 时其他卡片虚化 |
| [Card Stack](https://ui.aceternity.com/components/card-stack) | Aceternity | 卡片堆叠切换 |
| [Animated Tooltip](https://ui.aceternity.com/components/animated-tooltip) | Aceternity | 头像/协作者浮层 |
| [Link Preview](https://ui.aceternity.com/components/link-preview) | Aceternity | 外链悬浮预览 |
| [Magnetic Button](https://ui.aceternity.com/components/magnetic-button) | Aceternity | 磁吸按钮 |
| [Card Spread](https://animata.design/docs/card/card-spread) | Animata | 扇形展开卡片 |
| [Atropos](https://atroposjs.com/) | 原生 JS | 3D 倾斜卡片，轻量 |
| [vanilla-tilt](https://micku7zu.github.io/vanilla-tilt.js/) | 原生 JS | 经典 tilt |
| [Cuberto Mouse Follower](https://github.com/Cuberto/mouse-follower) | 原生 JS | 自定义光标最稳的实现 |
| [Motion Cursor](https://motion.dev/ui) | React（Motion+） | 吸附、变形光标 |

### 背景、装饰、材质

| 效果 | 来源 | 说明 |
| --- | --- | --- |
| [Aurora Background](https://ui.aceternity.com/components/aurora-background) | Aceternity | 极光渐变，慎用 |
| [Background Beams](https://ui.aceternity.com/components/background-beams) | Aceternity | 光束 |
| [Grid and Dot Backgrounds](https://ui.aceternity.com/components/grid-and-dot-backgrounds) | Aceternity | 网格/点阵底纹 |
| [Dotted Glow Background](https://ui.aceternity.com/components/dotted-glow-background) | Aceternity | 点阵 + 光晕 |
| [Sparkles](https://ui.aceternity.com/components/sparkles) | Aceternity | 星点 |
| [Meteors](https://ui.aceternity.com/components/meteors) | Aceternity | 流星，模板味重 |
| [Vortex](https://ui.aceternity.com/components/vortex) | Aceternity | 漩涡 |
| [Lamp Effect](https://ui.aceternity.com/components/lamp-effect) | Aceternity | 聚光灯开场 |
| [Background Ripple Effect](https://ui.aceternity.com/components/background-ripple-effect) | Aceternity | 点击涟漪 |
| [Noise Background](https://ui.aceternity.com/components/noise-background) | Aceternity | 噪点纹理 |
| [React Bits · Backgrounds](https://reactbits.dev/c/backgrounds) | React Bits | 粒子/网格/渐变集合 |
| [ShaderGradient](https://shadergradient.co/) | 设计工具 + 组件 | 可视化调渐变色块 |
| [Vanta.js](https://www.vantajs.com/) | 原生 JS | 老牌 3D 背景，重 |
| [Hero Patterns](https://heropatterns.com/) | CSS/SVG | 纯 SVG 底纹 |
| [Magic Pattern](https://www.magicpattern.design/) | 工具 | 生成网格/噪点/渐变背景 |

### 导航、浮层、交互件

| 效果 | 来源 | 说明 |
| --- | --- | --- |
| [Floating Navbar](https://ui.aceternity.com/components/floating-navbar) | Aceternity | 浮动胶囊导航 |
| [Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar) | Aceternity | 滚动收缩导航 |
| [Notch](https://ui.aceternity.com/components/notch) | Aceternity | 刘海式导航 |
| [Floating Dock](https://ui.aceternity.com/components/floating-dock) | Aceternity | macOS Dock 放大 |
| [Animated Modal](https://ui.aceternity.com/components/animated-modal) | Aceternity | 展开式弹层 |
| [Move Border](https://ui.aceternity.com/components/moving-border) | Aceternity | 跑马灯边框 |
| [Stateful Button](https://ui.aceternity.com/components/stateful-button) | Aceternity | 加载/成功状态按钮 |
| [Dynamic Island](https://www.cult-ui.com/docs/components/dynamic-island) | Cult UI | 动态岛式状态条 |
| [Sonner](https://sonner.emilkowal.ski/) | React | 最干净的 toast |
| [Vaul](https://vaul.emilkowal.ski/) | React | 抽屉，手势顺滑 |
| [cmdk](https://cmdk.paco.me/) | React | ⌘K 命令面板 |
| [AutoAnimate](https://auto-animate.formkit.com/) | 原生/React/Vue | 列表增删动画，一行接入 |

### 数字、图表、数据

| 效果 | 来源 | 说明 |
| --- | --- | --- |
| [NumberFlow](https://number-flow.barvian.me/) | React / 原生 | 数字滚动最精致，尊重 reduced motion |
| [Number Ticker](https://magicui.design/docs/components) | Magic UI | 进入视口计数 |
| [Number flow（HextaUI）](https://hextaui.com/docs/number-flow) | HextaUI | 同类的 shadcn 版 |
| [Tremor](https://tremor.so/) | React | 仪表盘图表 |
| [visx](https://airbnb.io/visx/) | React + D3 | 自定义可视化 |
| [D3](https://d3js.org/) | 原生 | 终极自由，成本也最高 |
| [Recharts](https://recharts.org/) | React | 快速出图 |

## 三、动画与过渡的底层工具

| 工具 | 用途 | 备注 |
| --- | --- | --- |
| [GSAP](https://gsap.com/) | 时间线、ScrollTrigger、SplitText、Flip、DrawSVG | **已全免费**；插件生态最全 |
| [Motion](https://motion.dev/) | React/Vue/原生 JS 统一动画 API | mini 3.2kb；布局动画、手势、ScrollTimeline |
| [anime.js v4](https://animejs.com/) | 轻量时间线、SVG、stagger | 全量 24.5kb，可按需引入 |
| [Lenis](https://lenis.dev/) | 平滑滚动 | 一行初始化 |
| [View Transitions（单文档）](https://caniuse.com/view-transitions) | 同页状态过渡 | 92.9% 覆盖 |
| [`@view-transition` 跨文档](https://caniuse.com/mdn-css_at-rules_view-transition) | 多页站点页面过渡 | 87.9%；Firefox 未支持 |
| [CSS scroll-driven animations](https://caniuse.com/mdn-css_properties_animation-timeline_view) | 纯 CSS 滚动动画 | 87.84%；Safari 26+ / Firefox 161+ |
| [Swup](https://swup.js.org/) | 多页站点无刷新换页 | 体积小，配合 CSS 过渡 |
| [Barba.js](https://barba.js.org/) | 页面过渡编排 | 生态成熟 |
| [Taxi](https://taxi.js.org/) | 轻量页面过渡 | API 简洁 |
| [Astro ClientRouter](https://docs.astro.build/en/guides/view-transitions/) | Astro 内置过渡 | 若迁 Astro 直接用 |
| [AutoAnimate](https://auto-animate.formkit.com/) | DOM 变化自动补间 | 无需写 keyframes |

## 四、3D、着色器与矢量动画

| 工具 | 说明 |
| --- | --- |
| [Three.js](https://threejs.org/) | WebGL 事实标准 |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Three 的 React 渲染器 |
| [drei](https://github.com/pmndrs/drei) | R3F 常用助手 |
| [OGL](https://github.com/oframe/ogl) | 极小 WebGL 库，适合 shader 背景 |
| [Curtains.js](https://www.curtainsjs.com/) | 把 DOM 图片/视频变成 WebGL 平面，122kb min |
| [Spline](https://spline.design/) | 浏览器里做 3D 并导出嵌入 |
| [ShaderGradient](https://shadergradient.co/) | 渐变着色器生成器 |
| [Vanta.js](https://www.vantajs.com/) | 现成 3D 背景 |
| [Rive](https://rive.app/) | 交互式矢量动画，运行时小 |
| [Lottie](https://lottiefiles.com/) | AE 动画导出 JSON |
| [Theatre.js](https://www.theatrejs.com/) | 可视化时间线编辑 |
| [Matter.js](https://brm.io/matter-js/) | 2D 物理，做"掉落/碰撞" |
| [PixiJS](https://pixijs.com/) | 2D WebGL 渲染，粒子多时用 |
| [Zdog](https://zzz.dog/) | 伪 3D 插画风 |

## 五、图标、字体、色彩、排版工具

| 资源 | 用途 |
| --- | --- |
| [Lucide](https://lucide.dev/) | 通用线性图标，风格统一 |
| [Phosphor Icons](https://phosphoricons.com/) | 多字重图标 |
| [Simple Icons](https://simpleicons.org/) | 品牌图标（GitHub/LinkedIn/arXiv） |
| [Academicons](https://jpswalsh.github.io/academicons/) | 学术平台图标（Scholar/ORCID/arXiv） |
| [KaTeX](https://katex.org/) | 数学公式渲染 |
| [Citation.js](https://citation.js.org/) | BibTeX/DOI 转引用 |
| [Fontshare](https://www.fontshare.com/) | 免费商用字体（Satoshi/General Sans 等） |
| [Google Fonts](https://fonts.google.com/) | Instrument Serif、Inter、Noto Serif SC |
| [Fontsource](https://fontsource.org/) | 自托管字体包，避免第三方请求 |
| [Modern Font Stacks](https://modernfontstacks.com/) | 系统字体栈，零请求 |
| [Fontjoy](https://fontjoy.com/) | 字体配对生成 |
| [Type Scale](https://typescale.com/) | 字阶计算器 |
| [Radix Colors](https://www.radix-ui.com/colors) | 语义化色阶（含暗色） |
| [Realtime Colors](https://realtimecolors.com/) | 实时预览配色 |
| [Coolors](https://coolors.co/) | 配色生成 |
| [Practical Typography](https://practicaltypography.com/) | 排版规则，免费在线书 |

## 六、灵感与案例库

| 站点 | 看什么 |
| --- | --- |
| [Awwwards](https://www.awwwards.com/websites/portfolio/) | 获奖站，偏重动效与视觉 |
| [SiteInspire](https://www.siteinspire.com/) | 干净的分类画廊 |
| [Land-book](https://land-book.com/) | 落地页与个人站 |
| [Minimal Gallery](https://minimal.gallery/) | 极简站，最贴近"学术+设计" |
| [Httpster](https://httpster.net/) | 非模板感强的站 |
| [CSSDA](https://www.cssdesignawards.com/) | CSS 实现细节 |
| [FWA](https://thefwa.com/) | 创意技术站 |
| [recent.design](https://recent.design) | 每日精选（原 godly） |
| [Codrops](https://tympanus.net/codrops/) | 效果教程 + 源码，质量最高 |
| [The Component Gallery](https://component.gallery/) | 60 类组件 × 95 套设计系统对照 |
| [Mobbin](https://mobbin.com/) | 产品界面截图库 |
| [Refero](https://refero.design/) | 真实产品 UI 参考 |
| [SaaS Landing Page](https://saaslandingpage.com/) | 落地页结构 |
| [Josh Comeau](https://www.joshwcomeau.com/) | 动画/CSS 深度文章 |

## 七、如果只抄 12 个（个人主页版）

| # | 效果 | 来源 | 用在哪 | 成本 |
| --- | --- | --- | --- | --- |
| 1 | Hero 逐行遮罩揭示 | [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) 或纯 CSS `clip-path` | 姓名/标题 | 低 |
| 2 | 跨页淡入 + 共享元素 | [`@view-transition`](https://caniuse.com/mdn-css_at-rules_view-transition) | 首页 ↔ CV ↔ Archive | 低 |
| 3 | 论文 hover 预览 | 手写（Jon Barron 模式） | Research 列表 | 中 |
| 4 | 顶部滚动进度线 | [Scroll Progress](https://magicui.design/) / CSS scroll() | 全站 | 低 |
| 5 | 数字滚动 | [NumberFlow](https://number-flow.barvian.me/) 或手写 | 关键结果 80.38% 等 | 低 |
| 6 | 磁吸链接 | [Magnetic Button](https://ui.aceternity.com/components/magnetic-button) 思路 | GitHub/LinkedIn/Email | 低 |
| 7 | 卡片堆叠 | [Card Stack](https://ui.aceternity.com/components/card-stack) / sticky | 三个项目 | 中 |
| 8 | 光标跟随高光 | [Card Spotlight](https://ui.aceternity.com/components/card-spotlight) 思路 | 项目卡 | 低 |
| 9 | 手绘强调 | [Rough Notation](https://roughnotation.com/) | 一句话结论/数字 | 低 |
| 10 | 列表增删过渡 | [AutoAnimate](https://auto-animate.formkit.com/) | 展开/收起技术细节 | 低 |
| 11 | 噪点纸感 | 内联 SVG `feTurbulence` | 全站叠层 | 极低 |
| 12 | 页面加载序列 | 手写 stagger | 首屏 | 低 |

## 八、基础 UI 与设计系统（不花哨，但结构最干净）

| 库 | 栈 | 用途 |
| --- | --- | --- |
| [Base UI](https://base-ui.com/) | React，无样式 | 可访问性原语，MUI 团队出品 |
| [Ark UI](https://ark-ui.com/) | React/Vue/Solid | 跨框架无样式原语 |
| [Radix Themes](https://www.radix-ui.com/themes) | React | 现成主题层，省去从零搭 |
| [Park UI](https://park-ui.com/) | React/Vue | Ark + Panda CSS 的设计系统 |
| [HeroUI](https://www.heroui.com/) | React + Tailwind | 动效顺滑的成品组件 |
| [Mantine](https://mantine.dev/) | React | 组件最全，适合工具型页面 |
| [DaisyUI](https://daisyui.com/) | Tailwind 插件 | 纯 CSS 类，零 JS |
| [Float UI](https://floatui.com/) | React/Tailwind | 落地页区块 |
| [Neobrutalism](https://www.neobrutalism.dev/) | React + Tailwind | 粗边框风格，学术站慎用 |
| [Ariakit](https://ariakit.org/) | React | 无障碍交互原语 |
| [Headless UI](https://headlessui.com/) | React/Vue | Tailwind 官方无样式组件 |
| [React Aria](https://react-spectrum.adobe.com/react-aria/) | React | Adobe 的无障碍交互 hooks |

## 九、选型提醒

1. **React-only 占多数**：Aceternity / Magic UI / React Bits / Motion Primitives / Animata / Cult UI / SmoothUI / ScrollX / Kokonut / HextaUI / 21st / Hover / Motion UI 都需要 React。当前站点是无构建静态 HTML，直接搬要引 React 运行时；可行路径是只抄 CSS/JS 思路，或迁 Astro 后用 island 局部引入。
2. **纯 CSS/原生 JS 的少数派**：Uiverse、Splitting.js、SplitType、Rough Notation、NumberFlow（有原生版）、AutoAnimate、Lenis、GSAP、anime.js、Atropos、vanilla-tilt、Cuberto Mouse Follower、Curtains.js、OGL、Vanta。这些最适合当前技术栈。
3. **体积红线**：Three/R3F/Curtains/Pixi 都在几十到几百 KB；一个个人主页的 JS 总量建议 < 80 KB（gzip），否则首屏会被拖垮。
4. **无障碍**：优先选明确写了 `prefers-reduced-motion` 支持的库（Animata、SmoothUI、NumberFlow、HextaUI 都有）；不要用纯 div 模拟按钮，不要劫持滚动。
5. **不要用**：AOS（滚动库已过时且 SSR 不友好）、全屏粒子背景、打字机效果循环、移动端自定义光标、自动播放带声音的视频、超过 2 个 shader 背景。
6. **许可**：上表"免费/开源"以各官网当前说明为准；商用前确认 Pro 组件与模板的授权范围。

---

附：上一轮的设计调研在 `docs/design-research-2026-10-17.md`，站点审计在 `docs/site-audit-2026-10-17.md`。
