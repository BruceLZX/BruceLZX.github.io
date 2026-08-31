document.documentElement.classList.add("js");

document.querySelectorAll(".js-email").forEach((link) => {
  const reverse = (value = "") => [...value].reverse().join("");
  const address = `${reverse(link.dataset.localRev)}@${reverse(link.dataset.domainRev)}`;
  link.href = `mailto:${address}`;
  link.textContent = link.dataset.label || address;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const routeLinks = [...document.querySelectorAll(".route-nav a")];
const routeSections = routeLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const route = document.querySelector(".route-nav");
const profileContent = document.querySelector(".profile-content");
const routeSignal = document.querySelector(".route-signal");

const prepareReveal = () => {
  const sections = [...document.querySelectorAll(".content-section")];
  sections.forEach((section) => {
    const items = section.querySelectorAll(".workstream-list > article, .text-entry, .project-grid > article, .compact-list > article, .background-grid > div");
    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 65}ms`);
    });
  });

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    sections.forEach((section) => section.classList.add("is-seen"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-seen");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -6%", threshold: .04 });
  sections.forEach((section) => observer.observe(section));

  // Content must never remain hidden if an embedded browser delays observers.
  window.setTimeout(() => sections.forEach((section) => section.classList.add("is-seen")), 1400);
};

prepareReveal();

if (route && routeSections.length) {
  const setActiveStation = (section) => {
    const index = Math.max(0, routeSections.indexOf(section));
    routeLinks.forEach((link, linkIndex) => {
      const active = linkIndex === index;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    routeSections.forEach((item) => item.classList.toggle("is-current", item === section));
    route.style.setProperty("--route-progress", String(routeSections.length > 1 ? index / (routeSections.length - 1) : 0));
    if (window.matchMedia("(max-width: 650px)").matches) {
      const activeLink = routeLinks[index];
      const left = activeLink.offsetLeft - (route.clientWidth - activeLink.clientWidth) / 2;
      route.scrollTo({ left, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  };

  routeLinks.forEach((link, index) => link.addEventListener("click", () => setActiveStation(routeSections[index])));

  let ticking = false;
  const syncRoute = () => {
    const marker = window.innerHeight * .28;
    let current = routeSections[0];
    routeSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    setActiveStation(current);

    if (profileContent) {
      const rect = profileContent.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight * .45);
      const progress = Math.min(1, Math.max(0, (marker - rect.top) / distance));
      profileContent.style.setProperty("--content-progress", progress.toFixed(4));
      if (routeSignal) routeSignal.style.top = `${20 + progress * Math.max(0, profileContent.offsetHeight - 54)}px`;
    }
    ticking = false;
  };
  const scheduleSync = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncRoute);
  };
  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", scheduleSync, { passive: true });
  syncRoute();
}

const interactiveRows = document.querySelectorAll(".workstream-list > article, .text-entry, .project-grid > article, .compact-list > article");
interactiveRows.forEach((row) => {
  row.classList.add("interactive-row");
  if (!finePointer.matches || reduceMotion.matches) return;
  row.addEventListener("pointermove", (event) => {
    const rect = row.getBoundingClientRect();
    row.style.setProperty("--row-x", `${event.clientX - rect.left}px`);
    row.style.setProperty("--row-y", `${event.clientY - rect.top}px`);
  });
});

if (!reduceMotion.matches && finePointer.matches) {
  const photo = document.querySelector(".profile-photo");
  photo?.addEventListener("pointermove", (event) => {
    const rect = photo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    photo.style.setProperty("--photo-rx", `${(-y * 4).toFixed(2)}deg`);
    photo.style.setProperty("--photo-ry", `${(x * 5).toFixed(2)}deg`);
  });
  photo?.addEventListener("pointerleave", () => {
    photo.style.setProperty("--photo-rx", "0deg");
    photo.style.setProperty("--photo-ry", "0deg");
  });

  let pointerTicking = false;
  window.addEventListener("pointermove", (event) => {
    if (pointerTicking) return;
    pointerTicking = true;
    requestAnimationFrame(() => {
      document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
      const intro = document.querySelector(".intro");
      if (intro) {
        const rect = intro.getBoundingClientRect();
        intro.style.setProperty("--dot-x", `${((event.clientX - rect.left) / rect.width * 8).toFixed(1)}px`);
        intro.style.setProperty("--dot-y", `${((event.clientY - rect.top) / Math.max(rect.height, 1) * 8).toFixed(1)}px`);
      }
      pointerTicking = false;
    });
  }, { passive: true });
}

const initSystemField = (canvas) => {
  if (!canvas || reduceMotion.matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  let visible = true;
  let frame = 0;
  let previous = 0;
  const pointer = { x: 0, y: 0, active: false };

  const rebuild = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const columns = width < 360 ? 6 : 8;
    const rows = 5;
    nodes = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const jitterX = Math.sin(index * 12.9898) * 9;
        const jitterY = Math.cos(index * 7.233) * 8;
        nodes.push({
          x: 18 + column * ((width - 36) / Math.max(1, columns - 1)) + jitterX,
          y: 18 + row * ((height - 36) / Math.max(1, rows - 1)) + jitterY,
          phase: index * .61,
        });
      }
    }
  };

  const positionedNodes = (seconds) => nodes.map((node) => {
    let x = node.x + Math.sin(seconds * .55 + node.phase) * 3.2;
    let y = node.y + Math.cos(seconds * .42 + node.phase) * 2.8;
    if (pointer.active) {
      const dx = pointer.x - x;
      const dy = pointer.y - y;
      const distance = Math.hypot(dx, dy);
      if (distance < 120) {
        const force = (1 - distance / 120) * .12;
        x += dx * force;
        y += dy * force;
      }
    }
    return { x, y, phase: node.phase };
  });

  const draw = (now) => {
    frame = requestAnimationFrame(draw);
    if (!visible || document.hidden || now - previous < 28) return;
    previous = now;
    const seconds = now / 1000;
    const points = positionedNodes(seconds);
    context.clearRect(0, 0, width, height);

    const edges = [];
    points.forEach((point, index) => {
      for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
        const other = points[otherIndex];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance > 92) continue;
        const opacity = (1 - distance / 92) * .22;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(39,116,174,${opacity.toFixed(3)})`;
        context.lineWidth = .8;
        context.stroke();
        if ((index + otherIndex) % 7 === 0) edges.push([point, other]);
      }
    });

    points.forEach((point, index) => {
      const pulse = .5 + Math.sin(seconds * 1.6 + point.phase) * .5;
      context.beginPath();
      context.arc(point.x, point.y, 1.25 + pulse * .7, 0, Math.PI * 2);
      context.fillStyle = index % 5 === 0 ? "rgba(255,209,0,.72)" : `rgba(39,116,174,${(.38 + pulse * .35).toFixed(3)})`;
      context.fill();
    });

    edges.slice(0, 7).forEach(([start, end], index) => {
      const progress = (seconds * .18 + index * .19) % 1;
      const x = start.x + (end.x - start.x) * progress;
      const y = start.y + (end.y - start.y) * progress;
      context.beginPath();
      context.arc(x, y, 2.2, 0, Math.PI * 2);
      context.fillStyle = "rgba(39,116,174,.85)";
      context.shadowColor = "rgba(39,116,174,.65)";
      context.shadowBlur = 8;
      context.fill();
      context.shadowBlur = 0;
    });
  };

  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = pointer.x >= -40 && pointer.x <= width + 40 && pointer.y >= -40 && pointer.y <= height + 40;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });

  new ResizeObserver(rebuild).observe(canvas);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" }).observe(canvas);
  }
  rebuild();
  frame = requestAnimationFrame(draw);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
};

initSystemField(document.querySelector(".system-field"));
