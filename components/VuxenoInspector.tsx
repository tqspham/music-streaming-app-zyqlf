"use client";

import { useEffect } from "react";

const SOURCE = "vuxeno-inspector";
const PARENT_SOURCE = "vuxeno-parent";
const VERSION = 1;
const MAX_TARGETS = 5;

type SelectionTarget = {
  id: string;
  number: number;
  route: string;
  rect: { x: number; y: number; width: number; height: number };
};

function isAllowedParentOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (
      url.protocol === "https:" &&
      (url.hostname === "vuxeno.com" || url.hostname.endsWith(".vuxeno.com"))
    ) || (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function route() {
  return window.location.pathname + window.location.search;
}

function pageUrl() {
  return window.location.origin + route();
}

function textOf(element: Element | null, limit = 180) {
  if (!element) return undefined;
  const text = (element.textContent || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, limit) : undefined;
}

function safeClasses(element: Element) {
  return Array.from(element.classList)
    .filter((name) => /^[a-zA-Z0-9_:@/-]+$/.test(name))
    .slice(0, 8);
}

function safeId(element: Element) {
  return /^[a-zA-Z0-9_:.@/-]+$/.test(element.id) ? element.id : undefined;
}

function accessibleLabel(element: Element) {
  const aria = element.getAttribute("aria-label");
  if (aria) return aria.slice(0, 180);
  if (element instanceof HTMLInputElement) {
    const label = element.labels?.[0]?.textContent?.replace(/\s+/g, " ").trim();
    return label?.slice(0, 180) || element.placeholder?.slice(0, 180);
  }
  return element.getAttribute("title")?.slice(0, 180);
}

function domPath(element: Element) {
  const segments: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body && segments.length < 7) {
    let segment = current.tagName.toLowerCase();
    if (safeId(current)) {
      segment += "#" + current.id;
      segments.unshift(segment);
      break;
    }
    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName,
      );
      if (siblings.length > 1) segment += ":nth-of-type(" + (siblings.indexOf(current) + 1) + ")";
    }
    segments.unshift(segment);
    current = parent;
  }
  return segments.join(" > ").slice(0, 500);
}

function documentRect(rect: DOMRect) {
  return {
    x: Math.round((rect.left + window.scrollX) * 100) / 100,
    y: Math.round((rect.top + window.scrollY) * 100) / 100,
    width: Math.round(rect.width * 100) / 100,
    height: Math.round(rect.height * 100) / 100,
  };
}

function nearby(selector: string, element: Element) {
  const nodes = Array.from(document.querySelectorAll(selector))
    .map((node) => ({ node, distance: Math.abs(node.getBoundingClientRect().top - element.getBoundingClientRect().top) }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ node }) => textOf(node))
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set(nodes)).slice(0, 5);
}

function elementTarget(element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    id: crypto.randomUUID(),
    type: "element",
    route: route(),
    tag: element.tagName.toLowerCase(),
    role: element.getAttribute("role") || undefined,
    label: accessibleLabel(element),
    text: element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? undefined
      : textOf(element),
    elementId: safeId(element),
    classNames: safeClasses(element),
    domPath: domPath(element),
    parentText: textOf(element.parentElement),
    childText: textOf(element.firstElementChild),
    nearbyHeadings: nearby("h1,h2,h3,[role=heading]", element),
    nearbyControls: nearby("button,a,input,select,textarea,[role=button],[role=link]", element),
    rect: documentRect(rect),
    viewport: { width: window.innerWidth, height: window.innerHeight },
    scroll: { x: window.scrollX, y: window.scrollY },
  };
}

function summarizeElement(element: Element) {
  return {
    tag: element.tagName.toLowerCase(),
    role: element.getAttribute("role") || undefined,
    label: accessibleLabel(element),
    text: element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? undefined
      : textOf(element),
    elementId: safeId(element),
    classNames: safeClasses(element),
    domPath: domPath(element),
  };
}

function elementsInZone(left: number, top: number, width: number, height: number) {
  const points = [
    [left + width / 2, top + height / 2],
    [left + width * 0.2, top + height * 0.2],
    [left + width * 0.8, top + height * 0.2],
    [left + width * 0.2, top + height * 0.8],
    [left + width * 0.8, top + height * 0.8],
  ];
  const elements: Element[] = [];

  for (const [x, y] of points) {
    for (const element of document.elementsFromPoint(x, y)) {
      if (
        element === document.documentElement ||
        element === document.body ||
        element.closest("[data-vuxeno-inspector=true]") ||
        elements.includes(element)
      ) {
        continue;
      }
      elements.push(element);
      if (elements.length >= 8) break;
    }
    if (elements.length >= 8) break;
  }

  return elements.map(summarizeElement);
}

export function VuxenoInspector() {
  useEffect(() => {
    if (window.parent === window) return;

    let parentOrigin = "";
    let channel = "";
    let selectionMode = false;
    let targets: SelectionTarget[] = [];
    let start: { x: number; y: number; clientX: number; clientY: number } | null = null;

    const root = document.createElement("div");
    root.dataset.vuxenoInspector = "true";
    root.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
    const hover = document.createElement("div");
    hover.style.cssText = "position:fixed;border:2px solid #8b5cf6;background:rgba(139,92,246,.10);display:none;";
    const draft = document.createElement("div");
    draft.style.cssText = "position:fixed;border:2px dashed #f59e0b;background:rgba(245,158,11,.12);display:none;";
    root.append(hover, draft);
    document.documentElement.append(root);

    const post = (type: string, payload: Record<string, unknown> = {}) => {
      if (!parentOrigin || !channel) return;
      window.parent.postMessage({ source: SOURCE, version: VERSION, channel, type, ...payload }, parentOrigin);
    };
    const sendNavigation = () => post("navigation", { url: pageUrl(), route: route(), title: document.title });
    const renderTargets = () => {
      root.querySelectorAll("[data-vuxeno-target]").forEach((node) => node.remove());
      for (const target of targets.filter((item) => item.route === route())) {
        const marker = document.createElement("div");
        marker.dataset.vuxenoTarget = target.id;
        marker.style.cssText = [
          "position:fixed",
          "pointer-events:none",
          "border:2px solid #10b981",
          "background:rgba(16,185,129,.08)",
          "box-sizing:border-box",
          "left:" + (target.rect.x - window.scrollX) + "px",
          "top:" + (target.rect.y - window.scrollY) + "px",
          "width:" + target.rect.width + "px",
          "height:" + target.rect.height + "px",
        ].join(";");
        const badge = document.createElement("span");
        badge.textContent = String(target.number);
        badge.style.cssText = "position:absolute;left:-10px;top:-10px;display:grid;place-items:center;width:20px;height:20px;border-radius:999px;background:#10b981;color:white;font:700 11px system-ui;";
        marker.append(badge);
        root.append(marker);
      }
    };

    const historyMethods = ["pushState", "replaceState"] as const;
    const originals = historyMethods.map((name) => history[name].bind(history));
    historyMethods.forEach((name, index) => {
      history[name] = ((...args: Parameters<History[typeof name]>) => {
        const result = originals[index](...args);
        queueMicrotask(() => { sendNavigation(); renderTargets(); });
        return result;
      }) as History[typeof name];
    });

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !event.data || event.data.source !== PARENT_SOURCE) return;
      if (event.data.version !== VERSION) return;
      if (event.data.type === "handshake") {
        if (!isAllowedParentOrigin(event.origin) || typeof event.data.channel !== "string") return;
        parentOrigin = event.origin;
        channel = event.data.channel;
        post("ready", { url: pageUrl(), route: route(), title: document.title });
        return;
      }
      if (event.origin !== parentOrigin || event.data.channel !== channel) return;
      if (event.data.type === "selection-mode") {
        selectionMode = event.data.enabled === true;
        hover.style.display = "none";
        draft.style.display = "none";
        document.documentElement.style.cursor = selectionMode ? "crosshair" : "";
      } else if (event.data.type === "sync-targets") {
        targets = Array.isArray(event.data.targets) ? event.data.targets.slice(0, MAX_TARGETS) : [];
        renderTargets();
      } else if (event.data.type === "navigate") {
        const next = new URL(String(event.data.url || ""), window.location.href);
        if (next.origin === window.location.origin) window.location.assign(next.href);
      } else if (event.data.type === "back") history.back();
      else if (event.data.type === "forward") history.forward();
      else if (event.data.type === "reload") window.location.reload();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!selectionMode) return;
      event.preventDefault();
      if (start) {
        const left = Math.min(start.clientX, event.clientX);
        const top = Math.min(start.clientY, event.clientY);
        draft.style.display = "block";
        draft.style.left = left + "px";
        draft.style.top = top + "px";
        draft.style.width = Math.abs(event.clientX - start.clientX) + "px";
        draft.style.height = Math.abs(event.clientY - start.clientY) + "px";
        hover.style.display = "none";
        return;
      }
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element || root.contains(element)) return;
      const rect = element.getBoundingClientRect();
      hover.style.display = "block";
      hover.style.left = rect.left + "px";
      hover.style.top = rect.top + "px";
      hover.style.width = rect.width + "px";
      hover.style.height = rect.height + "px";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!selectionMode) return;
      if (targets.length >= MAX_TARGETS) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      start = { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY, clientX: event.clientX, clientY: event.clientY };
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!selectionMode || !start) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const distance = Math.hypot(event.clientX - start.clientX, event.clientY - start.clientY);
      if (distance > 8) {
        const left = Math.min(start.clientX, event.clientX);
        const top = Math.min(start.clientY, event.clientY);
        const width = Math.abs(event.clientX - start.clientX);
        const height = Math.abs(event.clientY - start.clientY);
        post("target", {
          target: {
            id: crypto.randomUUID(),
            type: "zone",
            route: route(),
            rect: {
              x: Math.min(start.x, event.clientX + window.scrollX),
              y: Math.min(start.y, event.clientY + window.scrollY),
              width,
              height,
            },
            contextElements: elementsInZone(left, top, width, height),
            viewport: { width: window.innerWidth, height: window.innerHeight },
            scroll: { x: window.scrollX, y: window.scrollY },
          },
        });
      } else {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if (element && !root.contains(element)) post("target", { target: elementTarget(element) });
      }
      start = null;
      draft.style.display = "none";
    };

    const onClick = (event: MouseEvent) => {
      if (selectionMode) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const target = event.target instanceof Element
        ? event.target.closest("a[href]")
        : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      const next = new URL(target.href, window.location.href);
      if (next.origin !== window.location.origin) {
        event.preventDefault();
        window.open(next.href, "_blank", "noopener,noreferrer");
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("popstate", sendNavigation);
    window.addEventListener("scroll", renderTargets, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("click", onClick, true);

    return () => {
      historyMethods.forEach((name, index) => { history[name] = originals[index] as History[typeof name]; });
      window.removeEventListener("message", onMessage);
      window.removeEventListener("popstate", sendNavigation);
      window.removeEventListener("scroll", renderTargets, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("click", onClick, true);
      document.documentElement.style.cursor = "";
      root.remove();
    };
  }, []);

  return null;
}
