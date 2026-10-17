# GitHub 上的静态站可用组件（2026-10-17 实测）

先纠正上一轮的说法：**"80% 是 React" 只适用于 Aceternity / Magic UI 那批商业组件站**。GitHub 的长尾正好相反——vanilla JS、纯 CSS、Web Components 才是主流，绝大多数都能用一行 `<script>` 或 `<link>` 接进 GitHub Pages。

数据来源：GitHub Search API，抓取时间 2026-10-17。`Stars` 为当日数值，`最近提交` 为仓库 `pushed_at`，`归档` 表示作者已停止维护（仍可用，但别指望修 bug）。

---

## 一、动画引擎（无框架、无依赖）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [anime.js](https://github.com/juliangarnier/anime) | 73,674 | MIT | 2026-08-21 | 轻量时间线、stagger、SVG、Scroll Observer；v4 模块化，全量 24.5kb |
| [GSAP](https://github.com/greensock/GSAP) | 29,365 | 自定义（免费） | 2026-04-13 | 时间线/SplitText/ScrollTrigger/Flip；Webflow 收购后全部免费 |
| [Motion](https://github.com/motiondivision/motion) | 34,262 | MIT | 2026-10-16 | 原生 JS 也能用；mini 3.2kb，支持 ScrollTimeline、布局动画、手势 |
| [mo.js](https://github.com/mojs/mojs) | 18,817 | MIT | 2026-07-30 | 动效图形工具箱，适合"爆发/粒子/形状" |
| [KUTE.js](https://github.com/thednp/kute.js) | 2,644 | MIT | 2026-03-26 | 老牌引擎，SVG/属性动画齐全 |
| [Theatre.js](https://github.com/theatre-js/theatre) | — | Apache-2.0 | — | 可视化时间线编辑器，个人站一般用不上 |

接入：`<script src="https://cdn.jsdelivr.net/npm/animejs@4/lib/anime.iife.min.js"></script>` 即可，无需构建。

## 二、滚动、视差、入场

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [ScrollReveal](https://github.com/jlmakes/scrollreveal) | 22,473 | 自定义 | 2024-04-05 | 元素进入视口时动画，API 简单；维护放缓 |
| [AOS](https://github.com/michalsnik/aos) | 28,055 | MIT | 2024-03-26 | 最广为人知的滚动入场；**不建议新项目用**，SSR/可访问性一般 |
| [Lenis](https://github.com/darkroomengineering/lenis) | 16,641 | MIT | 2026-10-17 | 平滑滚动事实标准，一行初始化 |
| [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) | 8,878 | MIT | 2026-06-30 | 视差 + 平滑滚动，v5 已内置 Lenis |
| [Rellax](https://github.com/dixonandmoe/rellax) | 7,126 | MIT | 2024-08-24 | 极简视差，几百字节级 |
| [Lax.js](https://github.com/alexfoxy/lax.js) | 10,465 | MIT | 2025-05-21 | <4kb 滚动动画；**已归档** |
| [Sal.js](https://github.com/mciastek/sal) | 3,692 | MIT | 2023-01-07 | 性能向滚动动画，基于 IntersectionObserver |
| [Animate](https://github.com/jshjohnson/Animate) | 357 | MIT | 2022-12-30 | 5KB，元素进入视口触发 |
| [Kinesis.js](https://github.com/amineyarman/Kinesis.js) | 239 | MIT | 2026-10-06 | 14KB 无依赖，把 tilt/parallax/magnetic 写成 CSS 属性 + 弹簧 |
| [watching-you](https://github.com/jj811208/watching-you) | 1,706 | ISC | 2026-01-22 | 让 DOM 元素"盯着鼠标/某个目标" |

## 三、页面过渡（多页静态站直接上）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Barba.js](https://github.com/barbajs/barba) | 12,999 | MIT | 2024-12-02 | 页面过渡编排，生态成熟 |
| [Swup](https://github.com/swup/swup) | 5,244 | MIT | 2026-10-06 | 轻量、插件化，适合 Jekyll/Hugo/Astro 输出 |
| [Taxi](https://github.com/craftedbygc/taxi) | 643 | BSD-3 | 2026-09-27 | PJAX + 过渡，小而快 |
| [Highway](https://github.com/dept/highway) | 1,417 | MIT | 2022-04-07 | 老牌过渡管理器；已多年未更新 |
| [instant.page](https://github.com/instantpage/instant.page) | 6,217 | MIT | 2026-09-29 | 预加载下一页，1 分钟接入 |
| 原生 `@view-transition` | — | 浏览器 | — | 跨文档过渡，87.9% 覆盖，Firefox 未支持 |

## 四、文字与手写

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [TypeIt](https://github.com/alexmacarthur/typeit) | 3,178 | GPL-3.0 | 2025-04-04 | 打字机里最完整的；**GPL 注意** |
| [Typed.js](https://github.com/mattboldt/typed.js) | 16,269 | 自定义 | 2026-01-25 | 老牌打字机，MIT 风格但许可自定义 |
| [Splitting.js](https://github.com/shshaw/Splitting) | 1,756 | MIT | 2024-06-19 | 拆字/词/行，输出 CSS 变量 |
| [SplitType](https://github.com/lukePeavey/SplitType) | 733 | 自定义 | 2023-12-03 | 比 Splitting 更能处理嵌套标签 |
| [Tegaki](https://github.com/gkurt/tegaki) | 3,231 | MIT | 2026-10-11 | **手写动画**，支持任意字体/文字，适合签名或一句手写笔记 |
| [Blotter](https://github.com/bradley/Blotter) | 3,083 | 自定义 | 2020-07-28 | 非传统文字材质效果；已停更 |

## 五、SVG、手绘、标注

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Rough.js](https://github.com/rough-stuff/rough) | 21,273 | MIT | 2024-07-28 | 手绘风格图形 |
| [Rough Notation](https://github.com/rough-stuff/rough-notation) | 9,714 | MIT | 2024-03-18 | 手绘圈注/下划线/高亮，3.8kb，适合强调结论 |
| [Vivus](https://github.com/maxwellito/vivus) | 15,480 | MIT | 2022-07-06 | SVG 描边动画 |
| [Wired Elements](https://github.com/rough-stuff/wired-elements) | 10,843 | MIT | 2023-10-07 | 手绘风 Web Components |

## 六、纯 CSS 动画与效果

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Animate.css](https://github.com/animate-css/animate.css) | 82,875 | 自定义（MIT 风格） | 2024-07-29 | 即插即用的 CSS 动画集合 |
| [Hover.css](https://github.com/IanLunn/Hover) | 29,408 | 自定义 | 2023-10-28 | 按钮/链接/图片 hover 效果 |
| [css-doodle](https://github.com/yuanchuan/css-doodle) | — | MIT | — | 用 CSS 写生成艺术/图案 |
| [Uiverse Galaxy](https://github.com/uiverse-io/galaxy) | 13,566 | MIT | 2024-09-02 | 7k+ 社区 CSS/Tailwind 元素，按标签找按钮/卡片/加载器 |
| [cssanimation](https://github.com/yesiamrocks/cssanimation) | 322 | MIT | — | 零 JS 的 CSS 动画库 |

## 七、交互组件（轮播、浮层、图片、拖拽、提示）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Swiper](https://github.com/nolimits4web/swiper) | 41,899 | MIT | 2026-10-16 | 轮播/滑块事实标准 |
| [Floating UI](https://github.com/floating-ui/floating-ui) | 32,754 | MIT | 2026-10-16 | 定位引擎（tooltip/popover 的底座） |
| [SortableJS](https://github.com/SortableJS/Sortable) | 31,196 | MIT | 2026-03-24 | 拖拽排序，无框架 |
| [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) | 25,277 | MIT | 2025-12-04 | 图片灯箱，移动端体验好 |
| [Embla Carousel](https://github.com/davidjerleke/embla-carousel) | 8,449 | MIT | 2026-10-17 | 轻量、手势精准的轮播 |
| [Splide](https://github.com/Splidejs/splide) | 5,369 | MIT | 2024-07-08 | 无依赖、可访问性好的滑块 |
| [medium-zoom](https://github.com/francoischalifour/medium-zoom) | 3,940 | MIT | 2025-12-20 | Medium 式图片放大 |
| [Micromodal](https://github.com/micromodal/Micromodal) | 3,659 | MIT | 2026-08-08 | 无障碍模态框，无依赖 |
| [Toastify JS](https://github.com/apvarun/toastify-js) | 2,542 | MIT | 2024-08-19 | 纯 JS toast |
| [MixItUp](https://github.com/patrickkunka/mixitup) | 4,524 | Apache-2.0 | 2024-10-30 | 过滤/排序动画；**已归档** |
| [sparticles](https://github.com/simeydotme/sparticles) | 287 | MPL-2.0 | 2026-04-25 | Canvas 粒子，轻量高帧率 |
| [pure-web-bottom-sheet](https://github.com/viliket/pure-web-bottom-sheet) | 212 | MIT | 2026-10-14 | 用 CSS scroll-driven 实现的底部抽屉 Web Component |
| [Tippy.js](https://github.com/atomiks/tippyjs) | 12,236 | MIT | 2024-05-27 | tooltip/popover；**已归档**，新项目转 Floating UI |

## 八、Web Components（不挑框架，`<script type="module">` 即用）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Web Awesome](https://github.com/shoelace-style/webawesome) | 1,369 | MIT | 2026-10-16 | Shoelace 的继任者，Font Awesome 团队维护 |
| [Lit](https://github.com/lit/lit) | 21,850 | BSD-3 | 2026-09-24 | 写 Web Components 的轻量框架 |
| [Shoelace](https://github.com/shoelace-style/shoelace) | 13,822 | MIT | 2026-05-14 | **已归档**，迁移到 Web Awesome |
| [Wired Elements](https://github.com/rough-stuff/wired-elements) | 10,843 | MIT | 2023-10-07 | 手绘风组件 |

## 九、3D、生成艺术、图表

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [three.js](https://github.com/mrdoob/three.js) | 116,545 | MIT | 2026-10-17 | 3D 事实标准 |
| [p5.js](https://github.com/processing/p5.js) | 24,137 | LGPL-2.1 | 2026-10-17 | 创意编程，生成艺术 |
| [Zdog](https://github.com/metafizzy/zdog) | 10,672 | 自定义 | 2023-07-18 | 伪 3D 插画风 |
| [OGL](https://github.com/oframe/ogl) | 4,675 | 自定义 | 2025-04-13 | 极小 WebGL 库，适合 shader 背景 |
| [Chart.js](https://github.com/chartjs/Chart.js) | 67,745 | MIT | 2026-10-04 | 常规图表 |
| [uPlot](https://github.com/leeoniya/uPlot) | 10,565 | MIT | 2026-10-17 | 极快时间序列图，体积小 |
| [Curtains.js](https://github.com/martinlaxenaire/curtainsjs) | — | MIT | — | 把 DOM 图片/视频变成 WebGL 平面 |

## 十、极简 CSS（classless，直接给现有 HTML 套皮）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [Pico](https://github.com/picocss/pico) | 16,843 | MIT | 2026-10-04 | **已归档**，但仍是最好用的 classless 框架之一 |
| [Water.css](https://github.com/kognise/water.css) | 8,652 | MIT | 2024-02-11 | 给简单页面"稍微好看一点" |
| [MVP.css](https://github.com/andybrewer/mvp) | 5,129 | MIT | 2026-09-14 | 无 class 的极简样式 |
| [Simple.css](https://github.com/kevquirk/simple.css) | 5,020 | MIT | 2026-07-19 | 语义 HTML 直接变好看 |
| [Sakura](https://github.com/oxalorg/sakura) | 4,388 | MIT | 2026-04-07 | 樱花主题极简框架 |
| [Marx](https://github.com/mblode/marx) | 1,711 | MIT | 2026-10-14 | classless CSS reset |
| [Chota](https://github.com/jenil/chota) | 1,550 | MIT | 2026-10-13 | 3kb 微框架 |
| [Open Props](https://github.com/argyleink/open-props) | 5,547 | MIT | 2026-10-11 | CSS 变量库，做设计 token 最省事 |

## 十一、静态站交互层（不引入框架）

| 项目 | Stars | 许可 | 最近提交 | 说明 |
| --- | ---: | --- | --- | --- |
| [htmx](https://github.com/bigskysoftware/htmx) | 49,579 | 自定义（BSD 风格） | 2026-10-15 | 用 HTML 属性做局部交互，配合静态后端 |
| [Alpine.js](https://github.com/alpinejs/alpine) | 31,980 | MIT | 2026-10-16 | 15kb，HTML 里写交互，适合静态站 |
| [surreal](https://github.com/gnat/surreal) | 1,741 | MIT | 2026-05-27 | mini jQuery，无依赖动画 |

## 十二、GitHub Pages 站点模板

| 模板 | 技术 | 说明 |
| --- | --- | --- |
| [al-folio](https://github.com/alshedivat/al-folio) | Jekyll | 学术主页最流行，出版/BibTeX/暗色模式齐全 |
| [academicpages](https://github.com/academicpages/academicpages.github.io) | Jekyll | 多页学术站，Markdown 驱动 |
| [HugoBlox academic-cv](https://github.com/HugoBlox/hugo-theme-academic-cv) | Hugo | 学术 CV 主题，视觉块编辑 |
| [luost26/academic-homepage](https://github.com/luost26/academic-homepage) | 纯 HTML/CSS | 无构建，和当前站最接近 |
| [minima](https://github.com/jekyll/minima) | Jekyll | GitHub Pages 默认主题，极简 |
| [Astro](https://github.com/withastro/astro) | Astro | 静态输出 + islands，可局部用 React 组件 |
| [Eleventy](https://github.com/11ty/eleventy) | 11ty | 纯静态生成，模板灵活 |

## 十三、无构建接入方式

```html
<!-- 1. 传统脚本（UMD/IIFE） -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>

<!-- 2. CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">

<!-- 3. ESM -->
<script type="module">
  import { animate } from "https://cdn.jsdelivr.net/npm/animejs@4/+esm";
  animate(".title", { y: [40, 0], opacity: [0, 1], duration: 800 });
</script>

<!-- 4. Web Component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2/cdn/shoelace.js"></script>
<sl-button>Click</sl-button>
```

注意：上面版本号是示例，正式用时**锁定版本**并把文件下载到本地，避免 CDN 变动与第三方请求。

## 十四、怎么继续在 GitHub 上挖（可复制的搜索式）

```text
topic:scroll-animation stars:>100 archived:false
topic:css-animation stars:>500 archived:false
topic:page-transitions stars:>50
topic:text-animation stars:>300
topic:svg-animation stars:>100
topic:web-components stars:>500
topic:micro-interactions stars:>50
"no dependencies" animation in:readme stars:>500
"vanilla javascript" animation in:readme stars:>1000
topic:github-pages template stars:>300
language:css topic:animation stars:>100
pushed:>2026-01-01 topic:animation stars:>200
license:mit topic:animation stars:>500
```

直接点：
[scroll-animation](https://github.com/search?q=topic%3Ascroll-animation+stars%3A%3E100+archived%3Afalse&type=repositories) ·
[css-animation](https://github.com/search?q=topic%3Acss-animation+stars%3A%3E500+archived%3Afalse&type=repositories) ·
[page-transitions](https://github.com/search?q=topic%3Apage-transitions+stars%3A%3E50&type=repositories) ·
[web-components](https://github.com/search?q=topic%3Aweb-components+stars%3A%3E500&type=repositories) ·
[github-pages templates](https://github.com/search?q=topic%3Agithub-pages+template+stars%3A%3E300&type=repositories)

## 十五、30 分钟能接进你站的 8 个

| 顺序 | 用什么 | 解决什么 | 接入成本 |
| --- | --- | --- | --- |
| 1 | Lenis | 平滑滚动 | 1 行脚本 |
| 2 | anime.js 或 GSAP | 首屏揭示/时间线 | 1 个 script |
| 3 | Splitting 或 SplitType | 拆分标题做逐字/逐行 | 1 个 script |
| 4 | Rough Notation | 手绘强调关键数字 | 1 个 script |
| 5 | Floating UI | 悬浮信息/菜单定位 | ESM |
| 6 | Embla 或 Splide | 作品/论文横向浏览 | 1 个 script |
| 7 | medium-zoom 或 PhotoSwipe | 海报/图片放大 | 1 个 script |
| 8 | Tegaki | 手写签名/一句手写话 | 1 个 script |

## 十六、维护状态提醒（别踩）

- **已归档**：AOS、Lax.js、Tippy、Shoelace、Pico、MixItUp。
- **多年未更新**：Vivus（2022）、Highway（2022）、Zdog（2023）、Sal（2023）、Hover.css（2023）、SplitType（2023）、Blotter（2020）、ScrollReveal（2024）。
- **许可需确认**：GSAP、Animate.css、Hover.css、Typed.js、ScrollReveal、Rough.js、htmx 的 `license` 字段是 `NOASSERTION`，代表自定义许可；商用前读一遍仓库 LICENSE。
- **GPL**：TypeIt 是 GPL-3.0，闭源项目慎用。

---

配套文档：`docs/component-sourcing-2026-10-17.md`（商业组件站与 React 生态）、`docs/design-research-2026-10-17.md`（视觉与动效调研）。
