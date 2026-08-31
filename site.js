document.documentElement.classList.add("js");

document.querySelectorAll(".js-email").forEach((link) => {
  const reverse = (value = "") => [...value].reverse().join("");
  const address = `${reverse(link.dataset.localRev)}@${reverse(link.dataset.domainRev)}`;
  link.href = `mailto:${address}`;
  link.textContent = link.dataset.label || address;
});

const sections = [...document.querySelectorAll(".observed-section[data-scene]")];
const routeLinks = [...document.querySelectorAll(".route-nav [data-scene-link]")];
const traceScenes = [...document.querySelectorAll("[data-trace-scene]")];
const traceTitle = document.querySelector("[data-trace-title]");
const traceNote = document.querySelector("[data-trace-note]");
const tracePanel = document.querySelector(".trace-panel");
const routeNav = document.querySelector(".route-nav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isChinese = document.documentElement.lang.toLowerCase().startsWith("zh");

const traceCopy = isChinese ? {
  about: ["简介", "研究 × 系统 × 产品"],
  work: ["未来求索", "推荐 / 端侧 / 机器人"],
  research: ["研究", "两篇投稿 · 两项既有研究"],
  projects: ["项目", "从模型到可用产品"],
  experience: ["经历", "2021 → 2026"],
  background: ["背景", "教育 × 技术栈"],
} : {
  about: ["About", "Research × systems × product"],
  work: ["PMAOS", "Recommendation / edge / robotics"],
  research: ["Research", "Two submissions · two prior studies"],
  projects: ["Projects", "From model to usable product"],
  experience: ["Experience", "2021 → 2026"],
  background: ["Background", "Education × working toolkit"],
};

let activeScene = "";
const setActiveScene = (scene) => {
  if (!scene || scene === activeScene) return;
  activeScene = scene;

  routeLinks.forEach((link) => {
    const active = link.dataset.sceneLink === scene;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  traceScenes.forEach((group) => group.classList.toggle("is-active", group.dataset.traceScene === scene));
  sections.forEach((section) => section.classList.toggle("is-current", section.dataset.scene === scene));
  const copy = traceCopy[scene];
  if (copy && traceTitle) traceTitle.textContent = copy[0];
  if (copy && traceNote) traceNote.textContent = copy[1];

  if (routeNav && window.matchMedia("(max-width: 680px)").matches) {
    const activeLink = routeLinks.find((link) => link.dataset.sceneLink === scene);
    if (activeLink) {
      const left = activeLink.offsetLeft - (routeNav.clientWidth - activeLink.clientWidth) / 2;
      routeNav.scrollTo({ left, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    }
  }
};

if (sections.length) {
  let scrollFrame = 0;
  const syncPageState = () => {
    const marker = window.innerHeight * .34;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    setActiveScene(current.dataset.scene);

    if (!CSS.supports("animation-timeline: scroll()")) {
      const root = document.documentElement;
      const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", Math.min(1, window.scrollY / scrollable).toFixed(4));
    }
    scrollFrame = 0;
  };

  const scheduleSync = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(syncPageState);
  };

  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", scheduleSync, { passive: true });
  routeLinks.forEach((link) => link.addEventListener("click", () => setActiveScene(link.dataset.sceneLink)));
  syncPageState();
}

const traceMap = document.querySelector(".trace-map");
const traceCollections = [
  ["work", ".workstream-list > article"],
  ["research", ".paper-list > article"],
  ["projects", ".project-list > article"],
  ["experience", ".experience-list > article"],
];

if (traceMap && window.matchMedia("(pointer: fine)").matches) {
  traceCollections.forEach(([scene, selector]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.addEventListener("pointerenter", () => {
        traceMap.dataset.focus = `${scene}-${index}`;
      });
      item.addEventListener("pointerleave", () => {
        delete traceMap.dataset.focus;
      });
      item.addEventListener("focusin", () => {
        traceMap.dataset.focus = `${scene}-${index}`;
      });
      item.addEventListener("focusout", () => {
        delete traceMap.dataset.focus;
      });
    });
  });
}

if (tracePanel && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
  let traceRect;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const measureTrace = () => { traceRect = tracePanel.getBoundingClientRect(); };
  tracePanel.addEventListener("pointerenter", measureTrace);
  tracePanel.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      if (!traceRect) measureTrace();
      const x = Math.max(0, Math.min(traceRect.width, pointerX - traceRect.left));
      const y = Math.max(0, Math.min(traceRect.height, pointerY - traceRect.top));
      tracePanel.style.setProperty("--trace-x", `${x}px`);
      tracePanel.style.setProperty("--trace-y", `${y}px`);
      pointerFrame = 0;
    });
  }, { passive: true });
  tracePanel.addEventListener("pointerleave", () => {
    tracePanel.style.setProperty("--trace-x", "50%");
    tracePanel.style.setProperty("--trace-y", "50%");
  });
  window.addEventListener("resize", measureTrace, { passive: true });
}

prefersReducedMotion.addEventListener("change", () => {
  document.documentElement.classList.toggle("reduce-motion", prefersReducedMotion.matches);
});

const motionSections = [...document.querySelectorAll(".content-section")];
if (motionSections.length && !prefersReducedMotion.matches) {
  motionSections.forEach((section) => {
    const items = section.querySelectorAll(":scope > .section-heading, :scope > .section-lede, .workstream, .paper-entry, .project-list > article, .experience-list > article, .background-grid > div");
    items.forEach((item, index) => {
      item.classList.add("motion-item");
      item.style.setProperty("--motion-index", index);
      item.style.setProperty("--motion-delay", `${Math.min(index, 6) * 55}ms`);
    });
  });
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -12%", threshold: .08 });
  motionSections.forEach((section) => revealObserver.observe(section));
} else {
  motionSections.forEach((section) => section.classList.add("is-visible"));
}

const portrait = document.querySelector(".portrait-wrap");
if (portrait && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
  let portraitRect;
  let portraitFrame = 0;
  let portraitX = 0;
  let portraitY = 0;
  portrait.addEventListener("pointerenter", () => { portraitRect = portrait.getBoundingClientRect(); });
  portrait.addEventListener("pointermove", (event) => {
    portraitX = event.clientX;
    portraitY = event.clientY;
    if (portraitFrame) return;
    portraitFrame = requestAnimationFrame(() => {
      if (!portraitRect) portraitRect = portrait.getBoundingClientRect();
      const x = (portraitX - portraitRect.left) / portraitRect.width - .5;
      const y = (portraitY - portraitRect.top) / portraitRect.height - .5;
      portrait.style.setProperty("--photo-x", `${(-x * 8).toFixed(2)}px`);
      portrait.style.setProperty("--photo-y", `${(-y * 8).toFixed(2)}px`);
      portraitFrame = 0;
    });
  }, { passive: true });
  portrait.addEventListener("pointerleave", () => {
    portraitRect = undefined;
    portrait.style.setProperty("--photo-x", "0px");
    portrait.style.setProperty("--photo-y", "0px");
  });
}

const initSystemField = (canvas) => {
  if (!canvas || prefersReducedMotion.matches) return;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const host = canvas.closest(".hero-field");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const nodes = [];
  const pulses = [];
  const packets = Array.from({ length: 7 }, (_, index) => ({
    progress: (index * .173) % 1,
    speed: .0018 + (index % 3) * .00032,
    edge: index * 5,
  }));
  const pointer = { x: 0, y: 0, previousX: 0, previousY: 0, velocity: 0, active: false };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let visible = true;
  let frame = 0;
  let lastTime = 0;

  const seeded = (value) => {
    const x = Math.sin(value * 91.713) * 43758.5453;
    return x - Math.floor(x);
  };

  const rebuild = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes.length = 0;
    const spacing = width < 310 ? 44 : 48;
    const columns = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const key = row * columns + column + 1;
        const baseX = column * spacing - spacing * .28 + (seeded(key) - .5) * 23;
        const baseY = row * spacing - spacing * .2 + (seeded(key + 73) - .5) * 23;
        nodes.push({ baseX, baseY, x: baseX, y: baseY, phase: seeded(key + 141) * Math.PI * 2, weight: .65 + seeded(key + 211) * .75 });
      }
    }
  };

  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    const nextX = event.clientX - rect.left;
    const nextY = event.clientY - rect.top;
    pointer.velocity = Math.min(22, Math.hypot(nextX - pointer.previousX, nextY - pointer.previousY));
    pointer.previousX = nextX;
    pointer.previousY = nextY;
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.active = true;
    if (host) {
      host.style.setProperty("--field-glow-x", `${nextX}px`);
      host.style.setProperty("--field-glow-y", `${nextY}px`);
    }
  };

  const draw = (time) => {
    if (!visible || document.hidden || prefersReducedMotion.matches) {
      frame = 0;
      return;
    }
    const elapsed = Math.min(34, time - lastTime || 16.7);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    const links = [];
    const influence = 116 + pointer.velocity * 1.4;

    nodes.forEach((node, index) => {
      const driftX = Math.sin(time * .00062 + node.phase) * 3.2;
      const driftY = Math.cos(time * .00051 + node.phase * 1.3) * 3;
      let targetX = node.baseX + driftX;
      let targetY = node.baseY + driftY;
      if (pointer.active) {
        const dx = pointer.x - targetX;
        const dy = pointer.y - targetY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < influence) {
          const force = (1 - distance / influence) ** 2;
          const direction = index % 4 === 0 ? -1 : 1;
          targetX += dx / distance * force * (18 + pointer.velocity * .75) * direction;
          targetY += dy / distance * force * (18 + pointer.velocity * .75) * direction;
        }
      }
      pulses.forEach((pulse) => {
        const dx = targetX - pulse.x;
        const dy = targetY - pulse.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const waveDistance = pulse.radius;
        const delta = Math.abs(distance - waveDistance);
        if (delta < 34) {
          const force = (1 - delta / 34) * pulse.life * 13;
          targetX += dx / distance * force;
          targetY += dy / distance * force;
        }
      });
      node.x += (targetX - node.x) * .09;
      node.y += (targetY - node.y) * .09;
    });

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const a = nodes[first];
        const b = nodes[second];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 71) links.push({ a, b, distance });
      }
    }

    links.forEach(({ a, b, distance }) => {
      const opacity = Math.max(0, (1 - distance / 71) * .34);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.strokeStyle = `rgba(39,116,174,${opacity})`;
      context.lineWidth = .7;
      context.stroke();
    });

    packets.forEach((packet, index) => {
      if (!links.length) return;
      packet.progress += packet.speed * elapsed;
      if (packet.progress >= 1) {
        packet.progress %= 1;
        packet.edge = (packet.edge + 11 + index * 3) % links.length;
      }
      const link = links[packet.edge % links.length];
      const ease = packet.progress * packet.progress * (3 - 2 * packet.progress);
      const x = link.a.x + (link.b.x - link.a.x) * ease;
      const y = link.a.y + (link.b.y - link.a.y) * ease;
      context.beginPath();
      context.arc(x, y, index % 3 === 0 ? 2.15 : 1.5, 0, Math.PI * 2);
      context.fillStyle = index % 3 === 0 ? "rgba(255,202,56,.95)" : "rgba(18,82,126,.88)";
      context.fill();
    });

    nodes.forEach((node, index) => {
      const distance = pointer.active ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : 999;
      const near = Math.max(0, 1 - distance / influence);
      const radius = node.weight + near * 2.5 + (index % 13 === 0 ? 1.05 : 0);
      context.beginPath();
      context.arc(node.x, node.y, radius, 0, Math.PI * 2);
      context.fillStyle = index % 13 === 0 ? "rgba(255,202,56,.96)" : `rgba(18,82,126,${.48 + near * .5})`;
      context.fill();
    });

    pulses.forEach((pulse) => {
      pulse.radius += elapsed * .16;
      pulse.life -= elapsed * .0015;
      context.beginPath();
      context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(39,116,174,${Math.max(0, pulse.life) * .42})`;
      context.lineWidth = 1;
      context.stroke();
    });
    for (let index = pulses.length - 1; index >= 0; index -= 1) {
      if (pulses[index].life <= 0) pulses.splice(index, 1);
    }
    pointer.velocity *= .91;
    frame = requestAnimationFrame(draw);
  };

  const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
  const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
  if (finePointer) {
    canvas.addEventListener("pointermove", setPointer, { passive: true });
    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
      if (host) {
        host.style.setProperty("--field-glow-x", "50%");
        host.style.setProperty("--field-glow-y", "50%");
      }
    });
  }
  canvas.addEventListener("pointerdown", (event) => {
    setPointer(event);
    pulses.push({ x: pointer.x, y: pointer.y, radius: 2, life: 1 });
  });
  new ResizeObserver(rebuild).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: .01 }).observe(canvas);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
  prefersReducedMotion.addEventListener("change", () => { if (prefersReducedMotion.matches) stop(); else start(); });
  rebuild();
  start();
};

document.querySelectorAll(".system-field").forEach(initSystemField);
