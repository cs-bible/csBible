/* Vault Graph -- built by scripts/build-plugin.mjs. Source: plugin/ and src/. */
/*!
 * Vault Graph engine -- the camera, viewport, pointer handling and WebGL programs under
 * src/engine are ported from Sigma.js 3.0.2 (https://www.sigmajs.org), whose notice
 * follows. The full attribution is src/engine/NOTICE.md in the source repository.
 *
 * MIT License
 *
 * Copyright (C) 2013-2025, Alexis Jacomy, Guillaume Plique, Benoît Simard https://www.sigmajs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// plugin/main.js
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/page.js
function mountVaultGraph(root, data, deps) {
  "use strict";
  function attempt2(fn) {
    try {
      fn();
      return null;
    } catch (e) {
      return e;
    }
  }
  function dict() {
    var o = /* @__PURE__ */ Object.create(null);
    return (
      /** @type {Record<string, T>} */
      o
    );
  }
  var DATA = data;
  var Graph = deps.Graph;
  var RendererCls = deps.Renderer;
  var LOGO_MASK = deps.logoMask || "";
  var WIN = deps.win || window;
  var DOC = deps.doc || root && root.ownerDocument || WIN && WIN.document || null;
  var API = null;
  var onDestroy = [];
  var dead = false;
  var ID = "vg-";
  var $ = function(id) {
    return root.querySelector("#" + ID + id);
  };
  var ROOT = root;
  var setHTML = function(el, html) {
    var parsed = new DOMParser().parseFromString("<body>" + html + "</body>", "text/html");
    el.replaceChildren.apply(el, Array.prototype.slice.call(parsed.body.childNodes));
  };
  var css = function(name) {
    return getComputedStyle(ROOT).getPropertyValue(name).trim();
  };
  var s2lin = function(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  var lin2s = function(c) {
    c = Math.max(0, Math.min(1, c));
    return c <= 31308e-7 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };
  function relLum(h) {
    h = String(h).trim().replace(/^#/, "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var c = [0, 2, 4].map(function(i) {
      return s2lin(parseInt(h.slice(i, i + 2), 16) / 255);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function hex2lab(h) {
    h = String(h).trim().replace(/^#/, "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = s2lin(parseInt(h.slice(0, 2), 16) / 255), g = s2lin(parseInt(h.slice(2, 4), 16) / 255), b = s2lin(parseInt(h.slice(4, 6), 16) / 255);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2
    ];
  }
  function lab2hex(L, A, B) {
    var l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3), m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3), s2 = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
    var rgb = [
      lin2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2),
      lin2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2),
      lin2s(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2)
    ];
    return "#" + rgb.map(function(v) {
      var n = Math.round(v * 255).toString(16);
      return n.length < 2 ? "0" + n : n;
    }).join("");
  }
  function shade(hex, dh, dL) {
    var lab = hex2lab(hex), C = Math.hypot(lab[1], lab[2]);
    var h = Math.atan2(lab[2], lab[1]) + dh * Math.PI / 180;
    var L = Math.max(0.18, Math.min(0.92, lab[0] + dL));
    return lab2hex(L, C * Math.cos(h), C * Math.sin(h));
  }
  var SLOT_NAMES2 = [
    "Blue",
    "Orange",
    "Aqua",
    "Yellow",
    "Green",
    "Magenta",
    "Violet",
    "Red",
    "Cyan",
    "Orchid",
    "Grey",
    "Slate"
  ];
  var THEME = (
    /** @type {Theme} */
    {}
  );
  function readTheme() {
    var surf = css("--surface-1");
    THEME = {
      dark: relLum(surf) < 0.4,
      text: css("--text-1"),
      dim: css("--dim"),
      today: css("--today"),
      edge: css("--edge"),
      edgeHi: css("--edge-hi"),
      surface: surf,
      hoverBg: css("--surface-2"),
      hoverBorder: css("--border-strong"),
      slots: [
        "--g1",
        "--g2",
        "--g3",
        "--g4",
        "--g5",
        "--g6",
        "--g7",
        "--g8",
        "--g9",
        "--g10",
        "--g11",
        "--g12"
      ].map(css),
      neutrals: ["--n1", "--n2", "--n3"].map(css)
    };
    THEME.byKey = dict();
    THEME.slots.forEach(function(hex, i) {
      THEME.byKey["g" + (i + 1)] = hex;
    });
    if (renderer) renderer.setSetting("labelColor", THEME.text);
  }
  readTheme();
  function cleanSlotMap(raw) {
    var out = dict();
    if (!raw || typeof raw !== "object") return out;
    Object.keys(raw).forEach(function(k) {
      var v = raw[k];
      if (typeof v === "string" && /^g([1-9]|1[0-2])$/.test(v)) out[k] = v;
    });
    return out;
  }
  var folderColors = cleanSlotMap(deps.folderColors);
  var subfolderColors = cleanSlotMap(deps.subfolderColors);
  var panEnabled = deps.panEnabled === false ? false : true;
  var onPanEnabled = typeof deps.onPanEnabled === "function" ? deps.onPanEnabled : null;
  var compactAxis = deps.compactAxis === false ? false : true;
  var onCompactAxis = typeof deps.onCompactAxis === "function" ? deps.onCompactAxis : null;
  var unlinkedByFolder = deps.unlinkedByFolder === false ? false : true;
  var onUnlinkedByFolder = typeof deps.onUnlinkedByFolder === "function" ? deps.onUnlinkedByFolder : null;
  var unlinkedTintByFolder = deps.unlinkedTintByFolder === true ? true : false;
  var onUnlinkedTintByFolder = typeof deps.onUnlinkedTintByFolder === "function" ? deps.onUnlinkedTintByFolder : null;
  function isArchiveGroup2(g) {
    return String(g).charAt(0) === "_";
  }
  var ARCHIVE_SLOT2 = "g11";
  function eyeSvg(on) {
    var lid = '<path d="M1.6 8S4 3.9 8 3.9 14.4 8 14.4 8 12 12.1 8 12.1 1.6 8 1.6 8z" fill="none" stroke="currentColor" stroke-width="1.25"/>';
    return '<svg viewBox="0 0 16 16" aria-hidden="true">' + lid + (on ? '<circle cx="8" cy="8" r="2" fill="currentColor"/>' : '<path d="M3 13L13 3" stroke="currentColor" stroke-width="1.25"/>') + "</svg>";
  }
  function dotSvg(on) {
    return '<svg viewBox="0 0 16 16" aria-hidden="true">' + (on ? '<circle cx="8" cy="8" r="5" fill="currentColor"/>' : '<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.25"/>') + "</svg>";
  }
  function pinSvg(on) {
    var head = '<circle cx="8" cy="5.6" r="3.35" ' + (on ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.25"') + "/>";
    var point = '<path d="M8 8.8V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    return '<svg viewBox="0 0 16 16" aria-hidden="true">' + head + point + "</svg>";
  }
  function twBtn(attrs, open) {
    return attrs ? '<button class="tw" ' + attrs + ' aria-expanded="' + open + '">' + (open ? "\u25BE" : "\u25B8") + "</button>" : '<span class="tw none">\u25B8</span>';
  }
  function cleanFolderShown(raw) {
    var out = dict();
    if (!raw || typeof raw !== "object") return out;
    Object.keys(raw).forEach(function(g) {
      if (typeof raw[g] === "boolean") out[g] = raw[g];
    });
    return out;
  }
  var folderShown = cleanFolderShown(deps.folderShown);
  function hiddenByDefault(g) {
    if (typeof folderShown[g] === "boolean") return !folderShown[g];
    return isArchiveGroup2(g);
  }
  var SETTINGS_UI = !!deps.settingsUI;
  var openHostSettings = typeof deps.openSettings === "function" ? deps.openSettings : null;
  var saveFolderColors = typeof deps.onFolderColors === "function" ? deps.onFolderColors : null;
  var saveSubfolderColors = typeof deps.onSubfolderColors === "function" ? deps.onSubfolderColors : null;
  var saveFolderShown = typeof deps.onFolderShown === "function" ? deps.onFolderShown : null;
  var savePinned = typeof deps.onPinned === "function" ? deps.onPinned : null;
  var state = {
    dim: "folder",
    layout: "rings",
    hiddenSub: dict(),
    hidden: dict(),
    highlight: dict(),
    highlightSub: dict(),
    hoverGroup: null,
    hoverSub: dict(),
    collapsed: dict(),
    tailOpen: dict(),
    pathOpen: dict(),
    selected: null,
    hovered: null,
    markDay: null,
    hoverDay: null,
    hoverYear: null,
    query: "",
    until: null,
    from: null,
    to: null,
    heatEnd: null,
    curveEdges: true,
    logoTwoRing: true,
    pinned: []
  };
  var graph = new Graph();
  DATA.nodes.forEach(function(n, i) {
    graph.addNode(String(i), {
      label: n.label,
      x: 0,
      y: 0,
      size: 4,
      folder: n.folder,
      sub: n.sub || "",
      dirs: n.dirs || [],
      ntype: n.type || "note",
      tags: n.tags || [],
      path: n.id,
      deg: n.deg,
      created: n.created || "",
      touched: n.touched || "",
      words: n.words || 0,
      ghost: !!n.ghost
    });
  });
  var EDGE_RAMP_START = 2e3, EDGE_RAMP_END = 1e4, EDGE_FLOOR = 0.1;
  var adj = dict();
  var EDGE_TOTAL = 0;
  var EDGE_SIZE = 0.6;
  var EDGE_SIZE_LIT = 1.4;
  var EDGE_SIZE_MAX = EDGE_SIZE_LIT;
  var edgeAttrsOf = function(w) {
    return { weight: w, size: EDGE_SIZE };
  };
  var EDGE_SHOWN = 0;
  var lazyEdges = false;
  (function() {
    var seen = dict();
    var list = [];
    DATA.edges.forEach(function(e) {
      var a = String(e.s), b = String(e.t);
      var k = a < b ? a + "\0" + b : b + "\0" + a;
      if (seen[k]) return;
      seen[k] = 1;
      EDGE_TOTAL++;
      list.push({ a, b, w: e.w, k });
      (adj[a] || (adj[a] = [])).push({ o: b, w: e.w });
      if (b !== a) (adj[b] || (adj[b] = [])).push({ o: a, w: e.w });
    });
    var share = EDGE_TOTAL <= EDGE_RAMP_START ? 1 : EDGE_TOTAL >= EDGE_RAMP_END ? EDGE_FLOOR : 1 - (1 - EDGE_FLOOR) * (EDGE_TOTAL - EDGE_RAMP_START) / (EDGE_RAMP_END - EDGE_RAMP_START);
    EDGE_SHOWN = Math.round(EDGE_TOTAL * share);
    lazyEdges = EDGE_SHOWN < EDGE_TOTAL;
    if (lazyEdges) {
      list.sort(function(p, q) {
        return q.w - p.w || (p.k < q.k ? -1 : 1);
      });
      list.length = EDGE_SHOWN;
    }
    list.forEach(function(e) {
      if (!graph.hasEdge(e.a, e.b)) graph.addUndirectedEdge(e.a, e.b, edgeAttrsOf(e.w));
    });
  })();
  var NODE_MIN = 2.6, NODE_MAX = 11, NODE_ORPHAN = 6;
  graph.forEachNode(function(id, a) {
    graph.setNodeAttribute(id, "size", a.deg === 0 ? NODE_ORPHAN : Math.min(NODE_MAX, NODE_MIN + 1.55 * Math.sqrt(a.deg)));
  });
  var hubRank = dict();
  (function() {
    graph.nodes().slice().sort(function(a, b) {
      return graph.getNodeAttribute(b, "deg") - graph.getNodeAttribute(a, "deg") || String(graph.getNodeAttribute(a, "label")).localeCompare(String(graph.getNodeAttribute(b, "label")));
    }).forEach(function(id, i) {
      hubRank[id] = i;
    });
  })();
  var subOrder = dict();
  var subCount = dict();
  (function() {
    var tally = dict();
    graph.forEachNode(function(_id, a) {
      var f = a.folder, sb = a.sub || "";
      if (!tally[f]) tally[f] = dict();
      tally[f][sb] = (tally[f][sb] || 0) + 1;
    });
    Object.keys(tally).forEach(function(f) {
      subOrder[f] = Object.keys(tally[f]).sort(function(x, y) {
        return tally[f][y] - tally[f][x] || x.localeCompare(y);
      });
      subOrder[f].forEach(function(sb) {
        subCount[f + "/" + sb] = tally[f][sb];
      });
    });
  })();
  var UNIT = 160;
  var UNLINKED = "(unlinked)";
  var moveFrom = null;
  function groupOf(id) {
    if (moveFrom) {
      var mf = moveFrom[id];
      if (mf !== void 0) return mf;
    }
    if (!adj[id]) return unlinkedByFolder ? graph.getNodeAttribute(id, "folder") : UNLINKED;
    return graph.getNodeAttribute(id, "folder");
  }
  var SLOT_COUNT = 12;
  var groupColor = dict();
  var groupSlot = dict();
  var groupAutoSlot = dict();
  var order = {};
  function computeOrder() {
    var count = {};
    var filed = dict();
    graph.forEachNode(function(id, a) {
      var g = groupOf(id);
      count[g] = (count[g] || 0) + 1;
      if (state.dim === "folder") filed[a.folder] = (filed[a.folder] || 0) + 1;
    });
    folderCount = filed;
    Object.keys(filed).forEach(function(f) {
      if (count[f] === void 0) count[f] = 0;
    });
    if (count[UNLINKED] === void 0) count[UNLINKED] = 0;
    var names = Object.keys(count).sort(function(a, b) {
      var rank = function(s) {
        if (s === UNLINKED) return 3;
        var c = s.charAt(0);
        return c === "_" ? 0 : c === "(" ? 1 : 2;
      };
      return rank(a) - rank(b) || a.localeCompare(b, void 0, { numeric: true });
    });
    order[state.dim] = names;
    return count;
  }
  var counts = {};
  var folderCount = dict();
  function buildColors() {
    groupColor = dict();
    var names = order[state.dim] || [];
    var byFolder = state.dim === "folder" ? folderColors : dict();
    groupSlot = dict();
    groupAutoSlot = dict();
    var auto = 0;
    names.forEach(function(g) {
      var k = byFolder[g];
      var picked = k && THEME.byKey[k] ? k : "";
      if (isArchiveGroup2(g) || g === UNLINKED) {
        var akey = picked || ARCHIVE_SLOT2;
        groupColor[g] = THEME.byKey[akey];
        groupSlot[g] = akey;
        groupAutoSlot[g] = ARCHIVE_SLOT2;
        return;
      }
      var key = "g" + (auto++ % SLOT_COUNT + 1);
      var use = picked || key;
      groupColor[g] = THEME.byKey[use];
      groupSlot[g] = use;
      groupAutoSlot[g] = key;
    });
    buildSubShades();
    buildUnlinkedTint();
  }
  function paletteInfo() {
    return SLOT_NAMES2.map(function(name, i) {
      return { key: "g" + (i + 1), name, hex: THEME.slots[i] };
    });
  }
  function applyFolderShown(map) {
    folderShown = cleanFolderShown(map);
    return folderShown;
  }
  function applyFolderColors(map) {
    folderColors = cleanSlotMap(map);
    buildColors();
    if (renderer) renderer.refresh();
    attempt2(placeLogo);
    attempt2(heatBuild);
    attempt2(buildLegend);
    return folderColors;
  }
  function applySubfolderColors(map) {
    subfolderColors = cleanSlotMap(map);
    buildSubShades();
    if (renderer) renderer.refresh();
    attempt2(placeLogo);
    attempt2(heatBuild);
    attempt2(buildLegend);
    return subfolderColors;
  }
  function groupHasPinnedSub(g) {
    return (subOrder[g] || []).some(function(sb) {
      return !!subfolderColors[g + "/" + sb];
    });
  }
  var colorShown = null;
  var colorRaf = 0, colorPrev = 0;
  function colorOf(group) {
    if (colorShown) {
      var c = colorShown[group];
      if (c) return c;
    }
    return groupColor[group] || THEME.neutrals[0];
  }
  function colorWalk(before) {
    if (!before || !renderer) return;
    var origin = null;
    Object.keys(groupColor).forEach(function(g) {
      var was = before[g];
      if (was && was !== groupColor[g]) (origin || (origin = dict()))[g] = was;
    });
    if (!origin) return;
    if (colorRaf) {
      WIN.cancelAnimationFrame(colorRaf);
      colorRaf = 0;
    }
    colorShown = origin;
    var t = 0;
    colorPrev = NOW();
    (function step() {
      var now = NOW(), dt = now - colorPrev;
      colorPrev = now;
      t += Math.min(dt, TWEEN_MS) / (TWEEN_MS * TIME_SCALE);
      if (t > 1) t = 1;
      var e = t * t * (3 - 2 * t);
      var next = dict();
      Object.keys(origin).forEach(function(g) {
        next[g] = mixHex(origin[g], groupColor[g], e);
      });
      colorShown = next;
      renderer.refresh({ skipIndexation: true });
      if (t < 1) {
        colorRaf = WIN.requestAnimationFrame(step);
        return;
      }
      colorRaf = 0;
      colorShown = null;
      renderer.refresh({ skipIndexation: true });
    })();
  }
  var subShade = dict();
  var subSlot = dict();
  var unlinkedTintColors = [];
  var SLICE_GAP = 2;
  var SUB_GAP = 0.3;
  var EDGE_PAD_ARC = 0;
  var EDGE_PAD_MAX = 0;
  var INNER_SCALE = 0.8;
  var HUB_ROW0_FRAC = 0.08;
  var INNER_FILL = 0.8;
  var GAP_BAND = { i: 0.5, o: 1 };
  var CLEAR_OF_ROOM = 0.12;
  var MIN_SPAN = 6 * Math.PI / 180;
  var HL_PUSH = 0.9;
  var DENSITY_MAX = 2.6;
  var BAND = null;
  function bandOf(k) {
    if (!BAND) {
      BAND = {
        i: { key: "i", sp: 1, rows: 0, room: 0, ramp: { m: 1, b: 0, lo: 0 }, gapDeg: 0, nG: 0 },
        o: { key: "o", sp: 1, rows: 0, room: 0, ramp: { m: 1, b: 0, lo: 0 }, gapDeg: 0, nG: 0 }
      };
    }
    return k === "i" ? BAND.i : BAND.o;
  }
  function bandScale(k) {
    return k === "i" ? INNER_SCALE : 1;
  }
  function pitchUnits(band) {
    return UNIT * (bandOf(band).sp || 1) * bandScale(band);
  }
  var NEST_MIN = 2;
  var SMALL_GROUP = 0;
  var SUB_SLOTS = 4;
  var SUB_NAMED = 3;
  var HUE_BUDGET_FRACTION = 0.6;
  var SUB_L_SPAN = 0.28;
  var SUB_L_LIMIT = 0.9;
  function hueOf(hex) {
    var l = hex2lab(hex);
    return (Math.atan2(l[2], l[1]) * 180 / Math.PI % 360 + 360) % 360;
  }
  function hueBudget(basecol) {
    var h = hueOf(basecol), gap = 180;
    Object.keys(groupColor).forEach(function(g) {
      var c = groupColor[g];
      if (c === basecol) return;
      var lab = hex2lab(c);
      if (Math.hypot(lab[1], lab[2]) < 0.02) return;
      var d = Math.abs(h - hueOf(c));
      d = Math.min(d, 360 - d);
      if (d < gap) gap = d;
    });
    return gap * HUE_BUDGET_FRACTION;
  }
  function subTintIndex(folder, sub) {
    var subs = subOrder[folder] || [];
    var k = subs.indexOf(sub || "");
    return k < 0 ? 0 : Math.min(k, SUB_SLOTS - 1);
  }
  function subCellIndex(folder, sub, n, depth) {
    var idx = subTintIndex(folder, sub);
    if (idx === SUB_SLOTS - 1) return idx;
    return n >= (depth || REF_ROWS) ? idx : SUB_SLOTS - 1;
  }
  function buildSubShades() {
    subShade = dict();
    subSlot = dict();
    Object.keys(subOrder).forEach(function(f) {
      var subs = subOrder[f];
      var basecol = colorOf(f);
      var lab = hex2lab(basecol);
      var grey = Math.hypot(lab[1], lab[2]) < 0.02;
      var haveLadder = subs.length >= 2 && !grey;
      var sign = THEME.dark ? 1 : -1;
      var budget = haveLadder ? hueBudget(basecol) : 0;
      var Lend = haveLadder ? THEME.dark ? Math.min(SUB_L_LIMIT, lab[0] + SUB_L_SPAN) : Math.max(1 - SUB_L_LIMIT, lab[0] - SUB_L_SPAN) : 0;
      subs.forEach(function(sb) {
        var pk = f + "/" + sb;
        var pin2 = subfolderColors[pk];
        if (pin2 && THEME.byKey[pin2]) {
          subShade[pk] = THEME.byKey[pin2];
          subSlot[pk] = pin2;
          return;
        }
        subSlot[pk] = "";
        if (subs.length < 2) return;
        if (grey) {
          subShade[pk] = basecol;
          return;
        }
        var t = subTintIndex(f, sb) / (SUB_SLOTS - 1);
        subShade[pk] = shade(basecol, sign * budget * t, (Lend - lab[0]) * t);
      });
    });
  }
  var UNLINKED_TINT_CAP = 6;
  function buildUnlinkedTint() {
    unlinkedTintColors = [];
    var seen = dict();
    graph.forEachNode(function(id) {
      if (unlinkedTintColors.length >= UNLINKED_TINT_CAP) return;
      if (groupOf(id) !== UNLINKED) return;
      var a = graph.getNodeAttributes(id);
      var c = subShade[a.folder + "/" + (a.sub || "")] || colorOf(a.folder);
      if (seen[c]) return;
      seen[c] = true;
      unlinkedTintColors.push(c);
    });
  }
  function nodeColor(id) {
    var a = graph.getNodeAttributes(id);
    if (state.dim !== "folder") return colorOf(groupOf(id));
    if (groupOf(id) === UNLINKED && !unlinkedTintByFolder) return colorOf(UNLINKED);
    return subShade[a.folder + "/" + (a.sub || "")] || colorOf(a.folder);
  }
  function isHidden(group) {
    var h = state.hidden[state.dim];
    return !!(h && h[group]);
  }
  var bandLock = null;
  var geomLock = null;
  var DBG = { on: false, cells: null, canvas: null };
  var SEAM_YELLOW = "rgb(255,196,0)";
  var SEAM_YELLOW_45 = "rgba(255,196,0,0.45)";
  var ringsMerged = dict();
  var MERGED = "merged";
  function sweepAngle(sw) {
    return Math.PI / 2 - sw;
  }
  function angleSweep(a) {
    var t = (Math.PI / 2 - a) % (2 * Math.PI);
    return t < 0 ? t + 2 * Math.PI : t;
  }
  function isOrphan(id) {
    return !adj[id];
  }
  var SEAM_ROWS = 0.3;
  var SEAM_MAX_ROWS = 0.16;
  var REF_ROWS = 5;
  var SEAM_FALL = 1.5;
  var GAP_FULL_TO = 1e3;
  var GAP_ZERO_AT = 1e4;
  function gapScale() {
    var n = graph.order;
    if (n <= GAP_FULL_TO) return 1;
    if (n >= GAP_ZERO_AT) return 0;
    return 1 - (n - GAP_FULL_TO) / (GAP_ZERO_AT - GAP_FULL_TO);
  }
  function seamFall(band) {
    var k = band === "i" ? "i" : "o";
    var rows = bandOf(k).rows || REF_ROWS;
    return Math.pow(REF_ROWS / Math.max(1, rows), SEAM_FALL);
  }
  function seamAngle(band, frac) {
    var k = band === "i" ? "i" : "o";
    var r = geomLock && geomLock.bandR ? geomLock.bandR[k] : 0;
    if (!r) return SLICE_GAP * Math.PI / 180 * gapScale() * frac;
    var w = SEAM_ROWS * seamFall(band) * pitchUnits(band) * (GAP_BAND[k] || 1);
    var cap = SEAM_MAX_ROWS * UNIT;
    if (w > cap) w = cap;
    return w * frac / r;
  }
  function gapFor(nGroups, band) {
    var g = seamAngle(band, 1);
    return g * nGroups > Math.PI ? Math.PI / Math.max(1, nGroups) : g;
  }
  var SEAM_CAP = 0.45;
  function edgeSweep(c, which, rGraph) {
    var sm = seamAt(rGraph, c.nB, c.bandKey);
    return which === "lead" ? c.pLead + sm.gap / 2 : c.pTrail - sm.gap / 2;
  }
  function seamAt(r, nBoundaries, band) {
    var g = r > 1e-6 ? SEAM_ROWS * pitchUnits(band) / r : 0;
    var tot = g * nBoundaries;
    var cap = 2 * Math.PI * SEAM_CAP;
    if (tot > cap) {
      g *= cap / tot;
      tot = cap;
    }
    return { gap: g, avail: 2 * Math.PI - tot };
  }
  function allocateBand(list, weightOf, opts) {
    var TWO = 2 * Math.PI;
    var tot = 0;
    var gw = dict();
    list.forEach(function(c) {
      tot += weightOf(c);
      var g = gw[c.g] || (gw[c.g] = { w: 0 });
      g.w += weightOf(c);
    });
    var presOf = function(c) {
      return Math.min(1, weightOf(c));
    };
    var given = opts.groupPres || null;
    var groupPres = dict();
    var nG = 0;
    Object.keys(gw).forEach(function(k2) {
      var p = given && given[k2] !== void 0 ? given[k2] : gw[k2].w;
      groupPres[k2] = p < 0 ? 0 : p > 1 ? 1 : p;
      nG += groupPres[k2];
    });
    var nSub = 0;
    if (opts.subGaps) {
      var firstOf = dict();
      list.forEach(function(c) {
        if (!firstOf[c.g]) {
          firstOf[c.g] = 1;
          return;
        }
        nSub += presOf(c);
      });
    }
    var gap = gapFor(nG, opts.band);
    var subGap = opts.subGaps ? gap : 0;
    var gapTotal = gap * nG + subGap * nSub;
    if (opts.clamp && gapTotal > TWO * opts.clamp) {
      var k = TWO * opts.clamp / gapTotal;
      gap *= k;
      subGap *= k;
      gapTotal *= k;
    }
    var avail = TWO - gapTotal;
    var floorAng = 0;
    if (opts.band && geomLock && geomLock.bandR) {
      var rRef = geomLock.bandR[opts.band === "i" ? "i" : "o"] || 0;
      if (rRef > 1e-6) floorAng = 0.8 * pitchUnits(opts.band) / rRef;
    }
    var shareMap = null;
    if (floorAng > 0 && tot > opts.totFloor) {
      shareMap = dict();
      var floorFor = function(w, c0) {
        if (colWalk && c0 && colWalk[c0.g] !== void 0) return floorAng * colWalk[c0.g].f;
        return floorAng * (w > 1 ? 1 : w < 0 ? 0 : w);
      };
      var over = 0, under2 = 0;
      var live = [];
      list.forEach(function(c) {
        var w = weightOf(c);
        var raw = w > 1e-4 ? avail * (w / Math.max(opts.totFloor, tot)) : 0;
        shareMap[c.k] = raw;
        if (raw <= 0) return;
        live.push(c);
        var fl = floorFor(w, c);
        if (raw < fl) under2 += fl - raw;
        else over += raw - fl;
      });
      var lift = under2 > 0 && over > 0 ? Math.min(1, over / under2) : 0;
      if (lift > 0) {
        var take = under2 * lift / over;
        live.forEach(function(c) {
          var raw = shareMap[c.k], fl = floorFor(weightOf(c), c);
          shareMap[c.k] = raw < fl ? raw + (fl - raw) * lift : raw - (raw - fl) * take;
        });
      } else {
        shareMap = null;
      }
    }
    return {
      tot,
      nG,
      nSub,
      gap,
      subGap,
      avail,
      minArc: function() {
        lastMinArc = shareMap ? floorAng : 0;
        return lastMinArc;
      }(),
      groupPres,
      presOf,
      /** @param {Cell} c */
      shareOf: function(c) {
        if (shareMap && shareMap[c.k] !== void 0) return shareMap[c.k];
        return avail * (weightOf(c) / Math.max(opts.totFloor, tot));
      },
      /** @param {Cell} c */
      fracOf: function(c) {
        if (shareMap && shareMap[c.k] !== void 0) {
          return avail > 1e-9 ? shareMap[c.k] / avail : 0;
        }
        return weightOf(c) / Math.max(opts.totFloor, tot);
      }
    };
  }
  function buildWedgePlan(onlyVisible, weightOf, rowsOf, spIn) {
    var W = weightOf || function() {
      return 1;
    };
    var all = order[state.dim] || [];
    var nested = state.dim === "folder";
    var SEP = "\0";
    var byCell = {};
    var cellsOf = {};
    var planTotal = 0;
    var presMax = dict();
    var liveG = dict();
    var liveN = dict();
    var liveSub = dict();
    var members = [];
    graph.forEachNode(function(id) {
      if (onlyVisible && !(planKeep || willShow)(id)) return;
      if (isPinned(id)) return;
      members.push(id);
      var g0 = groupOf(id);
      var wv = W(id);
      liveG[g0] = (liveG[g0] || 0) + (wv > 1 ? 1 : wv < 0 ? 0 : wv);
      liveN[g0] = (liveN[g0] || 0) + 1;
      var sk = g0 + "/" + (graph.getNodeAttributes(id).sub || "");
      liveSub[sk] = (liveSub[sk] || 0) + 1;
    });
    var bandLive = { i: 0, o: 0 };
    Object.keys(liveG).forEach(function(g) {
      bandLive[bandLock && bandLock[g] ? "i" : "o"] += liveG[g];
    });
    var depthOfBand = function(isInner) {
      if (!geomLock) return REF_ROWS;
      var n = bandLive[isInner ? "i" : "o"];
      var thick = isInner ? (geomLock.rOuter - geomLock.r0) * INNER_FILL : geomLock.maxR - geomLock.rOuter;
      var scale2 = isInner ? INNER_SCALE : 1;
      var base = isInner ? geomLock.r0 : geomLock.rOuter;
      if (!(thick > 0) || !(n > 0.5)) return REF_ROWS;
      var T = thick * scale2, R = (base + thick / 2) * scale2;
      var rw = Math.round(T / Math.sqrt(2 * Math.PI * R * T / n));
      return rw < 1 ? 1 : rw > 200 ? 200 : rw;
    };
    var bandDepth = { i: 0, o: 0 };
    var splitOf = dict();
    var splitFor = function(g) {
      if (splitHold && splitHold[g] !== void 0) return splitHold[g];
      if (splitOf[g] === void 0) {
        var bk = bandLock && bandLock[g] ? "i" : "o";
        if (!bandDepth[bk]) bandDepth[bk] = depthOfBand(bk === "i");
        var nSubs = (subOrder[g] || []).length;
        var splitPieces = Math.min(nSubs, SUB_SLOTS);
        splitOf[g] = nested && nSubs > 1 && (liveN[g] || 0) >= Math.max(NEST_MIN, splitPieces * bandDepth[bk]);
      }
      return splitOf[g];
    };
    members.forEach(function(id) {
      var g = groupOf(id), a = graph.getNodeAttributes(id);
      var split = splitFor(g);
      var bk = bandLock && bandLock[g] ? "i" : "o";
      var key = split ? g + SEP + subCellIndex(g, a.sub, liveSub[g + "/" + (a.sub || "")] || 0, bandDepth[bk]) : g;
      if (!byCell[key]) {
        byCell[key] = [];
        (cellsOf[g] || (cellsOf[g] = [])).push(key);
      }
      byCell[key].push(id);
      planTotal += W(id);
      var pw = W(id);
      if (colWalk && colWalk[g] !== void 0) pw = colWalk[g].f;
      if (!(presMax[g] >= pw)) presMax[g] = pw;
    });
    ringsMerged = dict();
    var big = [];
    var smallIds = [];
    all.filter(function(g) {
      return cellsOf[g];
    }).forEach(function(g) {
      if ((counts[g] || 0) >= SMALL_GROUP) {
        big.push(g);
        return;
      }
      ringsMerged[g] = true;
      cellsOf[g].forEach(function(k) {
        smallIds = smallIds.concat(byCell[k]);
      });
    });
    var cells = [];
    big.forEach(function(g) {
      var ks = cellsOf[g];
      if (nested) {
        ks.sort(function(x, y) {
          return +(x.split(SEP)[1] || 0) - +(y.split(SEP)[1] || 0);
        });
      }
      ks.forEach(function(k) {
        cells.push(
          /** @type {Cell} */
          { g, k, list: byCell[k] }
        );
      });
    });
    if (smallIds.length) cells.push(
      /** @type {Cell} */
      { g: MERGED, k: MERGED, list: smallIds }
    );
    if (!cells.length) return null;
    cells.forEach(function(c) {
      c.list.sort(function(a, b) {
        return hubRank[a] - hubRank[b];
      });
      c.wsum = 0;
      c.list.forEach(function(id) {
        c.wsum += W(id);
      });
    });
    var TOTAL = planTotal;
    var MIN = MIN_SPAN, TWO = 2 * Math.PI;
    var smallAt = TOTAL * (MIN / TWO);
    var groupInner = {};
    cells.forEach(function(c) {
      var small = c.wsum < smallAt;
      if (groupInner[c.g] === void 0) groupInner[c.g] = small;
      else groupInner[c.g] = groupInner[c.g] || small;
    });
    if (bandLock) cells.forEach(function(c) {
      if (bandLock[c.g] !== void 0) groupInner[c.g] = bandLock[c.g];
    });
    cells.forEach(function(c) {
      c.inner = groupInner[c.g];
    });
    var inner = cells.filter(function(c) {
      return c.inner;
    });
    var outer = cells.filter(function(c) {
      return !c.inner;
    });
    if (!outer.length && !bandLock) {
      inner.forEach(function(c) {
        c.inner = false;
      });
      outer = cells;
      inner = [];
    }
    var share = function(list, band) {
      var a = allocateBand(
        list,
        function(c) {
          return c.wsum;
        },
        { subGaps: false, clamp: null, totFloor: 1e-4, band }
      );
      lastGapN[band] = Math.round(a.nG * 1e3) / 1e3;
      list.forEach(function(c) {
        c.band = a.shareOf(c);
      });
    };
    share(inner, "i");
    share(outer, "o");
    cells.forEach(function(c) {
      c.bandRef = c.band;
    });
    var HOLE = 0.3;
    var fullTotal = geomLock && geomLock.total > 0 ? geomLock.total : planTotal;
    var density = spIn && typeof spIn === "object" ? spIn.o || 1 : spIn > 0 ? spIn : planTotal > 1e-4 ? Math.min(DENSITY_MAX, Math.sqrt(fullTotal / planTotal)) : 1;
    var SP = density;
    var given = spIn && typeof spIn === "object" ? spIn : null;
    var givenRoom = given && given.room ? given.room : null;
    var SP_I = given && given.i > 0 ? given.i : SP;
    var SP_O = given && given.o > 0 ? given.o : SP;
    var bandDensity = function(cells2, key) {
      if (!geomLock || !geomLock.bandTotal) return SP;
      var full = geomLock.bandTotal[key] || 0, now = 0;
      cells2.forEach(function(c) {
        now += c.wsum;
      });
      if (!(full > 1e-4) || !(now > 1e-4)) return SP;
      return Math.min(DENSITY_MAX, Math.sqrt(full / now));
    };
    var r0 = geomLock ? geomLock.r0 : Math.max(1.5, HOLE * Math.sqrt(
      Math.max(1, TOTAL) / (Math.PI * (1 - HOLE * HOLE))
    ));
    function rowsNeeded(span, n, st, sp) {
      if (!(n > 0)) return 0;
      var p = sp > 0 ? sp : SP;
      var i = 0, r = st, k = 0;
      while (i < n && k < 500) {
        i += Math.max(0.05, span * r / p);
        r += p;
        k++;
      }
      var cap = Math.ceil(n - 1e-9);
      return Math.max(1, cap > 0 && k > cap ? cap : k);
    }
    function padFor(base, ref) {
      var refArc = base * (ref || 0) * UNIT;
      return refArc > 1e-6 ? Math.min(EDGE_PAD_MAX, EDGE_PAD_ARC / refArc) : 0;
    }
    function usableRef(c, base) {
      c.pad = padFor(base, c.bandRef);
      return c.bandRef * (1 - 2 * c.pad);
    }
    var GUTTER = 1.6 * SP;
    var BAND_RATIO = 0.55;
    if (!bandLock) (function balanceBands() {
      var names = [];
      cells.forEach(function(c) {
        if (names.indexOf(c.g) < 0) names.push(c.g);
      });
      if (names.length < 2) return;
      var assign = {};
      cells.forEach(function(c) {
        assign[c.g] = !!c.inner;
      });
      var PIN_BELOW = 10;
      var groupNotes = {};
      var totalNotes = 0;
      cells.forEach(function(c) {
        groupNotes[c.g] = (groupNotes[c.g] || 0) + c.list.length;
        totalNotes += c.list.length;
      });
      var pinnedInner = {};
      names.forEach(function(g) {
        if (assign[g] && (groupNotes[g] || 0) < PIN_BELOW) pinnedInner[g] = true;
      });
      var movable = names.filter(function(g) {
        return !pinnedInner[g];
      });
      if (!movable.length) return;
      var spanFor = function(ins, outs, rv) {
        var iR = 0;
        ins.forEach(function(c) {
          var r = rowsNeeded(usableRef(c, rv), c.wsum, rv);
          if (r > iR) iR = r;
        });
        var rOut = ins.length ? rv + iR * SP + GUTTER : rv;
        var oR = 0;
        outs.forEach(function(c) {
          var r = rowsNeeded(usableRef(c, rOut), c.wsum, rOut);
          if (r > oR) oR = r;
        });
        return {
          inner: Math.max(0, iR - 1) * SP * INNER_SCALE,
          outer: Math.max(0, oR - 1) * SP,
          iR,
          oR,
          holeShare: rOut + oR * SP > 0 ? rv / (rOut + oR * SP) : 1
        };
      };
      var R0_BASE = r0;
      var HOLE_MAX = 0.36;
      var evaluate = function(a) {
        var ins = [];
        var outs = [];
        cells.forEach(function(c) {
          (a[c.g] ? ins : outs).push(c);
        });
        if (!ins.length || !outs.length) return { cost: Infinity, r0: R0_BASE };
        share(ins, "i");
        share(outs, "o");
        cells.forEach(function(c) {
          c.bandRef = c.band;
        });
        var biggestInner = 0, smallestOuter = Infinity;
        names.forEach(function(g) {
          var n = groupNotes[g] || 0;
          if (a[g]) {
            if (n > biggestInner) biggestInner = n;
          } else if (n < smallestOuter) smallestOuter = n;
        });
        if (!isFinite(smallestOuter)) smallestOuter = biggestInner;
        var innerPeak = totalNotes ? Math.max(0, biggestInner - smallestOuter) / totalNotes : 0;
        var bc2 = Infinity, br = R0_BASE;
        for (var m = 100; m <= 300; m += 5) {
          var rv = R0_BASE * (m / 100), t = spanFor(ins, outs, rv);
          var c22 = Math.abs(t.inner - BAND_RATIO * t.outer) + (t.iR > t.oR ? INVERT_WEIGHT * (t.iR - t.oR) : 0) + SIZE_WEIGHT * SP * innerPeak + (t.inner >= t.outer ? 1e3 : 0) + (t.holeShare > HOLE_MAX ? 4e3 * (t.holeShare - HOLE_MAX) : 0);
          if (c22 < bc2 - 1e-9) {
            bc2 = c22;
            br = rv;
          }
        }
        return { cost: bc2, r0: br };
      };
      var INVERT_WEIGHT = 0.5;
      var SIZE_WEIGHT = 5;
      var cost = function(a) {
        return evaluate(a).cost;
      };
      var EXHAUSTIVE_UP_TO = 14;
      if (movable.length <= EXHAUSTIVE_UP_TO) {
        var bestMask = -1, bestCost = Infinity;
        for (var mask = 0; mask < 1 << movable.length; mask++) {
          for (var b = 0; b < movable.length; b++) assign[movable[b]] = !!(mask & 1 << b);
          var cm = cost(assign);
          if (cm < bestCost) {
            bestCost = cm;
            bestMask = mask;
          }
        }
        for (var b2 = 0; b2 < movable.length; b2++) {
          assign[movable[b2]] = !!(bestMask & 1 << b2);
        }
      } else {
        var best = cost(assign);
        for (var pass = 0; pass < 60 && best > 1e-9; pass++) {
          var move = null, bc = best;
          for (var i = 0; i < movable.length; i++) {
            assign[movable[i]] = !assign[movable[i]];
            var c2 = cost(assign);
            assign[movable[i]] = !assign[movable[i]];
            if (c2 < bc - 1e-9) {
              bc = c2;
              move = movable[i];
            }
          }
          if (!move) break;
          assign[move] = !assign[move];
          best = bc;
        }
      }
      cells.forEach(function(c) {
        c.inner = !!assign[c.g];
      });
      inner = cells.filter(function(c) {
        return c.inner;
      });
      outer = cells.filter(function(c) {
        return !c.inner;
      });
      share(inner, "i");
      share(outer, "o");
      cells.forEach(function(c) {
        c.bandRef = c.band;
      });
      r0 = evaluate(assign).r0;
    })();
    if (!given) {
      SP_I = bandDensity(inner, "i");
      SP_O = bandDensity(outer, "o");
    }
    var solveBand = function(list, base, thick, scale2, sp) {
      if (!list.length) return { sp, rows: 0 };
      var n = 0;
      list.forEach(function(c) {
        n += c.wsum;
      });
      if (!(n > 1e-4)) return { sp, rows: 0 };
      if (given || !(thick > 0) || !(n > 0.5)) {
        var rk = Math.round(thick > 0 && sp > 0 ? thick / sp : 1);
        return { sp, rows: rk > 0 ? rk : 1 };
      }
      var T = thick * scale2, R = (base + thick / 2) * scale2;
      var s = Math.sqrt(2 * Math.PI * R * T / n);
      var rw = Math.round(T / s);
      if (rw < 1) rw = 1;
      if (rw > 200) rw = 200;
      return { sp: thick / rw, rows: rw };
    };
    var thickI = geomLock ? (geomLock.rOuter - geomLock.r0) * INNER_FILL : 0;
    var innerRows = 0;
    if (geomLock && thickI > 0) {
      var si = solveBand(inner, r0, thickI, INNER_SCALE, SP_I);
      SP_I = si.sp;
      innerRows = si.rows;
      inner.forEach(function(c) {
        c.rows = c.wsum > 1e-4 ? innerRows : 0;
      });
    } else {
      inner.forEach(function(c) {
        c.rows = rowsNeeded(usableRef(c, r0), c.wsum, r0, SP_I);
        if (c.rows > innerRows) innerRows = c.rows;
      });
    }
    var rOuter = geomLock ? geomLock.rOuter : inner.length ? r0 + innerRows * SP_I + 1.6 * SP_I : r0;
    var thickO = geomLock ? geomLock.maxR - geomLock.rOuter : 0;
    var maxR = rOuter, outerRows = 0;
    if (geomLock && thickO > 0) {
      var so = solveBand(outer, rOuter, thickO, 1, SP_O);
      SP_O = so.sp;
      outerRows = so.rows;
      outer.forEach(function(c) {
        c.rows = c.wsum > 1e-4 ? outerRows : 0;
      });
      maxR = rOuter + outerRows * SP_O;
    } else {
      outer.forEach(function(c) {
        c.rows = rowsNeeded(usableRef(c, rOuter), c.wsum, rOuter, SP_O);
        if (c.rows > outerRows) outerRows = c.rows;
        var r = rOuter + c.rows * SP_O;
        if (r > maxR) maxR = r;
      });
    }
    function placeCell(c, rows, base, bandRows) {
      var SP2 = c.inner ? SP_I : SP_O;
      var seq = c.list;
      var wTot = 0;
      seq.forEach(function(id) {
        wTot += W(id);
      });
      var nEff = wTot;
      var total = base * rows + SP2 * rows * rows / 2;
      var pad = typeof c.pad === "number" ? c.pad : padFor(base, c.bandRef);
      var span = 1 - 2 * pad;
      var centred = bandRows > 0 && nEff > 1e-4 && nEff < bandRows - 1e-4;
      var cStart = centred ? Math.round((bandRows - nEff) / 2) : 0;
      var recs = [];
      var acc = 0;
      seq.forEach(function(id, idx) {
        var w = W(id);
        var s = wTot > 1e-4 ? (acc + w / 2) / wTot : 0.5;
        acc += w;
        s = s < 0 ? 0 : s > 1 ? 1 : s;
        var target = s * total;
        var pp = SP2 > 1e-9 ? (-base + Math.sqrt(Math.max(0, base * base + 2 * SP2 * target))) / SP2 : target / Math.max(1e-9, base);
        if (pp < 0) pp = 0;
        if (pp > rows - 1e-9) pp = Math.max(0, rows - 1e-9);
        var cRow = 0;
        if (centred) {
          var top = Math.max(0, Math.ceil(nEff - 1e-4) - 1);
          cRow = cStart + Math.min(Math.floor(s * nEff), top);
        }
        recs.push({ id, w, row: centred ? cRow : Math.floor(pp) });
      });
      var rowW = dict();
      var rowFirst = dict();
      var rowLast = dict();
      var edgeA = dict();
      var edgeB = dict();
      recs.forEach(function(r) {
        rowW[r.row] = (rowW[r.row] || 0) + r.w;
        if (rowFirst[r.row] === void 0) rowFirst[r.row] = r.w;
        rowLast[r.row] = r.w;
        var dz = graph.getNodeAttribute(r.id, "size") || 4;
        if (edgeA[r.row] === void 0) edgeA[r.row] = dz;
        edgeB[r.row] = dz;
      });
      var rowAcc = dict();
      var out = [];
      recs.forEach(function(r) {
        var before = rowAcc[r.row] || 0, tot = rowW[r.row] || 0;
        var t = tot > 1e-9 ? (before + r.w / 2) / tot : 0.5;
        var hA = tot > 1e-9 ? (rowFirst[r.row] || 0) / (2 * tot) : 0;
        var hB = tot > 1e-9 ? (rowLast[r.row] || 0) / (2 * tot) : 0;
        var keep = 1 - hA - hB;
        if (keep > 1e-9) t = (t - hA) / keep;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        rowAcc[r.row] = before + r.w;
        var rr = (base + r.row * SP2) * (c.inner ? INNER_SCALE : 1);
        if (trace && trace.id === r.id) {
          tracePut({
            what: "place",
            cell: c.k,
            g: c.g,
            base,
            SP: SP2,
            row: r.row,
            rows,
            bandRows,
            nEff,
            wTot,
            rr,
            inner: !!c.inner
          });
        }
        var u0 = r.row % 2 === 1 ? 1 - t : t;
        var eA = edgeA[r.row] || 0, eB = edgeB[r.row] || 0;
        out.push({
          id: r.id,
          r: rr,
          u: pad + u0 * span,
          row: r.row,
          eA: r.row % 2 === 1 ? eB : eA,
          eB: r.row % 2 === 1 ? eA : eB
        });
      });
      return out;
    }
    cells.forEach(function(c) {
      var base = c.inner ? r0 : rOuter;
      var rf = rowsOf ? rowsOf(c) : c.rows;
      if (!rf) rf = c.rows;
      c.slots = placeCell(c, rf, base, c.inner ? innerRows : outerRows);
    });
    var roomOf = function(list) {
      var v = [];
      list.forEach(function(c) {
        if (!c.slots || !c.slots.length) return;
        var rn = dict();
        c.slots.forEach(function(sl) {
          rn[sl.r] = (rn[sl.r] || 0) + 1;
        });
        c.slots.forEach(function(sl) {
          var n = rn[sl.r] || 1;
          var step = (c.band || 0) * sl.r * UNIT / n;
          if (step > 1) v.push(step);
        });
      });
      if (!v.length) return 0;
      v.sort(function(x, y) {
        return x - y;
      });
      return v[Math.floor(v.length * 0.1)];
    };
    var roomPlan = givenRoom || { i: roomOf(inner), o: roomOf(outer) };
    var depthOf = function(list, fallback, band) {
      var given2 = spIn && typeof spIn === "object" && spIn.depth ? spIn.depth[band] : 0;
      if (given2 > 0) return given2;
      return fallback;
    };
    return {
      cells,
      maxR,
      total: planTotal,
      r0,
      rOuter,
      sp: SP_O,
      spInner: SP_I,
      density,
      room: roomPlan,
      dbgLive: liveG,
      dbgSplit: splitOf,
      presMax,
      rows: {
        i: depthOf(inner, innerRows, "i"),
        o: depthOf(outer, outerRows || REF_ROWS, "o")
      }
    };
  }
  var REPACK_BELOW = 0.55;
  function ringsLayout(planIn, strict) {
    if (trace) {
      tracePut({
        what: "pass",
        roomIn_i: bandOf("i").room,
        roomIn_o: bandOf("o").room,
        hasRoomNow: !!roomNow,
        hasCellNow: !!cellNow,
        hasEdgeNow: !!edgeNow,
        strict: !!strict,
        givenPlan: !!planIn
      });
    }
    if (roomNow) {
      if (roomNow.i > 1) bandOf("i").room = roomNow.i;
      if (roomNow.o > 1) bandOf("o").room = roomNow.o;
    }
    var plan = planIn || pinnedPlan || buildWedgePlan(
      true,
      function(id) {
        return alpha[id] || 0;
      }
    );
    if (!plan) {
      if (!pinnedIds().length) return null;
      var hubOut = {};
      hubPlace(hubOut, geomLock ? geomLock.r0 : 1.5, UNIT);
      return hubOut;
    }
    var live = 0;
    plan.cells.forEach(function(c) {
      c.geom = 0;
      c.live = 0;
      c.slots.forEach(function(sl) {
        var al = alpha[sl.id] || 0;
        if (colWalk) {
          var cw = colWalk[groupOf(sl.id)];
          if (cw !== void 0) {
            c.geom = c.live = cw.n * cw.f;
            return;
          }
        }
        c.geom += fullRing || !willShow(sl.id) ? al : 1;
        c.live += al;
      });
      live += c.geom;
    });
    var shown = plan.cells.filter(function(c) {
      return c.geom > 1e-4;
    });
    if (!shown.length || !live) return null;
    lastMaxR = plan.maxR || lastMaxR;
    if (plan.sp > 0) bandOf("o").sp = plan.sp;
    if (plan.spInner > 0) bandOf("i").sp = plan.spInner;
    if (plan.rows) {
      bandOf("i").rows = plan.rows.i;
      bandOf("o").rows = plan.rows.o;
    }
    var TWO = 2 * Math.PI;
    var pos = {};
    var fit2 = dict();
    var lastAt = null;
    var firstAt = null;
    var roomPool = { i: [], o: [] };
    var cellRoomNext = dict();
    var cellMin = dict();
    var cellOf = dict();
    var edgeCapNext = dict();
    var hubRow0Next = dict();
    var dbgCells = DBG.on ? [] : null;
    if (probe) {
      lastStart = dict();
      lastArc = dict();
      lastBand = dict();
    }
    [true, false].forEach(function(isInner) {
      var band = shown.filter(function(c) {
        return !!c.inner === isInner;
      });
      if (!band.length) return;
      var a = allocateBand(
        band,
        function(c) {
          return c.geom;
        },
        {
          subGaps: true,
          clamp: 0.45,
          totFloor: 1e-6,
          groupPres: plan.presMax || null,
          band: isInner ? "i" : "o"
        }
      );
      var gap = a.gap;
      bandOf(isInner ? "i" : "o").gapDeg = Math.round(gap * 180 / Math.PI * 1e3) / 1e3;
      bandOf(isInner ? "i" : "o").nG = Math.round(a.nG * 1e3) / 1e3;
      bandOf(isInner ? "i" : "o").nSub = Math.round(a.nSub * 1e3) / 1e3;
      band.forEach(function(c) {
        c.span = a.shareOf(c);
        if (probe && lastArc) {
          lastArc[c.g] = (lastArc[c.g] || 0) + c.span * 180 / Math.PI;
          lastBand[c.g] = isInner ? "i" : "o";
        }
      });
      lastAt = dict();
      firstAt = dict();
      var nB = a.nG + a.nSub;
      var refR = geomLock && geomLock.bandR ? geomLock.bandR[isInner ? "i" : "o"] : 0;
      var sBand = refR > 0 ? seamAt(refR, nB, isInner ? "i" : "o") : null;
      var rowShare = null;
      if (rowArcOn()) {
        rowShare = dict();
        var presIn = dict();
        band.forEach(function(c0, ci) {
          c0.slots.forEach(function(sl0) {
            var w0 = alpha[sl0.id] || 0;
            if (!(w0 > 4e-3)) return;
            if (w0 > 1) w0 = 1;
            var rk0 = Math.round(sl0.r * 1e3);
            var arr0 = presIn[rk0] || (presIn[rk0] = []);
            if (!(arr0[ci] >= w0)) arr0[ci] = w0;
          });
        });
        Object.keys(presIn).forEach(function(rk0) {
          var arr0 = presIn[rk0], tot0 = 0;
          band.forEach(function(c0, ci) {
            tot0 += a.fracOf(c0) * (arr0[ci] || 0);
          });
          if (!(tot0 > 1e-9)) return;
          var acc0 = 0, sb0 = 0;
          var seams0 = [];
          var before0 = [];
          var frac0 = [];
          band.forEach(function(c0, ci) {
            var p0 = arr0[ci] || 0;
            sb0 += p0;
            seams0[ci] = sb0;
            before0[ci] = acc0;
            frac0[ci] = a.fracOf(c0) * p0 / tot0;
            acc0 += frac0[ci];
          });
          rowShare[rk0] = { seams: seams0, before: before0, frac: frac0, nB: sb0 };
        });
      }
      var seamsBefore = a.groupPres[band[0].g], fracBefore = 0, prevG = null;
      band.forEach(function(c, cIdx) {
        if (prevG !== null) seamsBefore += c.g !== prevG ? a.groupPres[c.g] : a.presOf(c);
        prevG = c.g;
        var frac = a.fracOf(c);
        if (probe && lastStart && lastStart[c.g] === void 0) {
          var sProbe = seamAt(refR, nB, isInner ? "i" : "o");
          lastStart[c.g] = Math.round((sProbe.gap * seamsBefore + sProbe.avail * fracBefore) * 180 / Math.PI * 1e3) / 1e3;
        }
        var open = c.geom > 1e-6 ? c.live / c.geom : 0;
        c.bandKey = isInner ? "i" : "o";
        c.nB = nB;
        if (sBand) {
          var A0c = sBand.gap * seamsBefore + sBand.avail * fracBefore;
          c.pLead = A0c - sBand.gap;
          c.pTrail = A0c + sBand.avail * frac * open;
        } else {
          c.pLead = void 0;
          c.pTrail = void 0;
        }
        if (dbgCells) {
          dbgCells.push({
            g: c.g,
            k: c.k,
            inner: !!c.inner,
            nB,
            bandKey: c.bandKey,
            seams: seamsBefore,
            f0: fracBefore,
            f1: fracBefore + frac * open,
            pLead: c.pLead,
            pTrail: c.pTrail,
            ids: c.slots.map(function(sl) {
              return sl.id;
            })
          });
        }
        var rowN = dict();
        c.slots.forEach(function(sl) {
          var w = alpha[sl.id] || 0;
          if (w > 0) rowN[sl.r] = (rowN[sl.r] || 0) + w;
        });
        var rowsUsed = 0;
        Object.keys(rowN).forEach(function(rk) {
          rowsUsed += rowN[rk] > 1 ? 1 : rowN[rk];
        });
        if (!(rowsUsed > 0)) rowsUsed = 1;
        var maxRowR = -1;
        Object.keys(rowN).forEach(function(rk) {
          if (+rk > maxRowR) maxRowR = +rk;
        });
        c.slots.forEach(function(sl) {
          if (!present(sl.id)) return;
          var rs = rowShare ? rowShare[Math.round(sl.r * 1e3)] : null;
          var sm = seamAt(sl.r * UNIT, rs ? rs.nB : nB, isInner ? "i" : "o");
          var a0, a1;
          if (c.pLead !== void 0) {
            a0 = edgeSweep(c, "lead", sl.r * UNIT);
            a1 = edgeSweep(c, "trail", sl.r * UNIT);
          } else if (rs && rs.frac[cIdx] > 0) {
            a0 = sm.gap * rs.seams[cIdx] + sm.avail * rs.before[cIdx] - sm.gap / 2;
            a1 = a0 + sm.avail * rs.frac[cIdx] * open;
          } else {
            a0 = sm.gap * seamsBefore + sm.avail * fracBefore - sm.gap / 2;
            a1 = a0 + sm.avail * frac * open;
          }
          if (probe && probe.watch === sl.id) {
            probe.watched = {
              k: c.k,
              g: c.g,
              u: Math.round(sl.u * 1e5) / 1e5,
              slotR: Math.round(sl.r),
              slots: c.slots.length,
              a0: Math.round(a0 * 1e4) / 1e4,
              a1: Math.round(a1 * 1e4) / 1e4,
              span: Math.round(c.span * 1e4) / 1e4,
              open: Math.round((c.geom > 1e-6 ? c.live / c.geom : 0) * 1e4) / 1e4,
              geom: Math.round(c.geom * 1e3) / 1e3,
              live: Math.round(c.live * 1e3) / 1e3,
              inner: !!c.inner
            };
          }
          var arc = a1 - a0;
          var rGraph = Math.max(1e-6, sl.r * UNIT);
          if (isInner && sl.row === 0) hubRow0Next[sl.id] = true;
          var bk = isInner ? "i" : "o";
          var room = bandOf(bk).room > 1 ? bandOf(bk).room : pitchUnits(bk);
          var clear = CLEAR_OF_ROOM * room * (GAP_BAND[bk] || 1);
          var nRow = rowN[sl.r] > 1e-3 ? rowN[sl.r] : 1;
          if (nRow > 1.5) {
            var ownStep = arc * rGraph / nRow;
            roomPool[isInner ? "i" : "o"].push(ownStep);
            if (cellMin[c.k] === void 0 || ownStep < cellMin[c.k]) cellMin[c.k] = ownStep;
          }
          cellOf[sl.id] = c.k;
          var side = function(z) {
            var f = (z || NODE_MAX) / NODE_MAX;
            if (f > 1) f = 1;
            else if (f < 0.15) f = 0.15;
            return (clear + DOT_OF_PITCH * room * f) / rGraph;
          };
          var mgA = side(sl.eA), mgB = side(sl.eB);
          var arcCap = arc * 0.66;
          if (mgA + mgB > arcCap) {
            var k = arcCap / (mgA + mgB);
            mgA *= k;
            mgB *= k;
          }
          var t = sweepAngle(a0 + mgA + (arc - mgA - mgB) * sl.u);
          var spanArc = arc - mgA - mgB;
          var dEdge = Math.min(mgA + spanArc * sl.u, mgB + spanArc * (1 - sl.u)) * rGraph;
          if (dEdge > 0) edgeCapNext[sl.id] = dEdge;
          if (trace && trace.id === sl.id) {
            tracePut({
              what: "edge",
              cell: c.k,
              g: c.g,
              u: sl.u,
              arc,
              mgA,
              mgB,
              spanArc,
              rGraph,
              slotR: sl.r,
              dEdge,
              a0,
              nRow,
              geom: c.geom,
              live: c.live,
              span: c.span,
              sideClear: clear,
              sideRoom: room,
              sideEA: sl.eA,
              sideEB: sl.eB
            });
          }
          var dLo = (mgA + spanArc * sl.u) * rGraph;
          var dHi = (mgB + spanArc * (1 - sl.u)) * rGraph;
          var edgeRoom = 2 * Math.min(dLo, dHi);
          if (edgeRoom > 1 && (fit2[sl.id] === void 0 || edgeRoom < fit2[sl.id])) {
            fit2[sl.id] = edgeRoom;
          }
          var prev = lastAt[sl.r];
          if (prev) {
            var step = Math.abs(t - prev.t) * rGraph;
            if (step > 1) {
              if (fit2[sl.id] === void 0 || step < fit2[sl.id]) fit2[sl.id] = step;
              if (fit2[prev.id] === void 0 || step < fit2[prev.id]) fit2[prev.id] = step;
            }
          }
          lastAt[sl.r] = { t, id: sl.id };
          if (firstAt[sl.r] === void 0) firstAt[sl.r] = { t, id: sl.id };
          var rr = sl.r + (isPushed(sl.id) ? HL_PUSH : 0);
          pos[sl.id] = { x: rr * Math.cos(t), y: rr * Math.sin(t) };
        });
        fracBefore += frac * open;
      });
      Object.keys(firstAt).forEach(function(rk) {
        var fst = firstAt[rk], lst = lastAt[rk];
        if (!fst || !lst || fst.id === lst.id) return;
        var d = fst.t - lst.t;
        while (d < 0) d += TWO;
        var step = d * Math.max(1e-6, +rk * UNIT);
        if (step > 1) {
          if (fit2[fst.id] === void 0 || step < fit2[fst.id]) fit2[fst.id] = step;
          if (fit2[lst.id] === void 0 || step < fit2[lst.id]) fit2[lst.id] = step;
        }
      });
    });
    var scale2 = UNIT;
    var out = {};
    graph.forEachNode(function(id) {
      var q = pos[id];
      if (q) out[id] = { x: q.x * scale2, y: q.y * scale2 };
      else if (!strict) out[id] = {
        x: graph.getNodeAttribute(id, "x"),
        y: graph.getNodeAttribute(id, "y")
      };
    });
    var pool = roomPool;
    var pick = function(v) {
      if (!v.length) return void 0;
      v.sort(function(x, y) {
        return x - y;
      });
      return v[Math.floor(v.length * 0.1)];
    };
    if (!roomNow) {
      bandOf("i").room = pick(pool.i);
      bandOf("o").room = pick(pool.o);
    }
    if (trace) {
      tracePut({
        what: "passEnd",
        roomOut_i: bandOf("i").room,
        roomOut_o: bandOf("o").room,
        measured: !roomNow
      });
    }
    Object.keys(cellOf).forEach(function(id) {
      var m = cellMin[cellOf[id]];
      if (m > 1) cellRoomNext[id] = m;
    });
    cellRoom = cellNow || cellRoomNext;
    edgeCap = edgeNow || edgeCapNext;
    hubRow0 = hubRow0Next;
    dotFit = fit2;
    if (dbgCells) DBG.cells = dbgCells;
    hubPlace(out, plan.r0, scale2);
    return out;
  }
  var PIN_MAX = 13;
  var HUB_R1 = 0.5;
  function hubRing(out, count, r, phase) {
    for (var k = 0; k < count; k++) {
      var t = Math.PI / 2 - (k + phase) / count * Math.PI * 2;
      out.push({ x: r * Math.cos(t), y: r * Math.sin(t) });
    }
  }
  function hubSlots(n, r0) {
    if (n <= 0) return [];
    if (n === 1) return [{ x: 0, y: 0 }];
    var R = r0 * HUB_R1;
    var out = [];
    if (n <= 6) {
      hubRing(out, n, R * (n <= 4 ? 0.62 : 0.86), 0);
      return out;
    }
    out.push({ x: 0, y: 0 });
    var left = n - 1, inner = Math.min(6, left), outer = left - inner;
    hubRing(out, inner, outer ? R * 0.5 : R * 0.86, 0);
    if (outer) hubRing(out, outer, R, 0.5);
    return out;
  }
  function pinnedIds() {
    return state.pinned.filter(function(id) {
      return graph.hasNode(id) && willShow(id);
    });
  }
  var hubSep = 0;
  function hubPlace(out, r0, scale2) {
    var ids = pinnedIds();
    hubSep = 0;
    if (!ids.length) return;
    var slots2 = hubSlots(ids.length, r0);
    if (slots2.length < 2) {
      hubSep = HUB_SIZE_MAX / HUB_SIZE_K;
    } else {
      var best = Infinity;
      for (var a = 0; a < slots2.length; a++) {
        for (var b = a + 1; b < slots2.length; b++) {
          var d = Math.hypot(slots2[a].x - slots2[b].x, slots2[a].y - slots2[b].y);
          if (d < best) best = d;
        }
      }
      hubSep = best / r0;
    }
    ids.forEach(function(id, k) {
      if (nodeDrag && nodeDrag.id === id) return;
      if (slots2[k]) out[id] = { x: slots2[k].x * scale2, y: slots2[k].y * scale2 };
    });
  }
  var HUB_SIZE_K = 3.5, HUB_SIZE_MIN = 1.15, HUB_SIZE_MAX = 2.8;
  function hubSizeMult() {
    return Math.max(HUB_SIZE_MIN, Math.min(HUB_SIZE_MAX, HUB_SIZE_K * hubSep));
  }
  function isPinned(id) {
    return state.pinned.indexOf(id) >= 0;
  }
  function pin(id, at) {
    var i = state.pinned.indexOf(id);
    if (i >= 0) state.pinned.splice(i, 1);
    if (at === void 0 || at > state.pinned.length) at = state.pinned.length;
    state.pinned.splice(at, 0, id);
    while (state.pinned.length > PIN_MAX) {
      state.pinned.splice(state.pinned[0] === id ? 1 : 0, 1);
    }
    return true;
  }
  function unpin(id) {
    var i = state.pinned.indexOf(id);
    if (i < 0) return false;
    state.pinned.splice(i, 1);
    return true;
  }
  function togglePin(id) {
    if (!unpin(id)) pin(id);
    hubChanged(true);
  }
  function releaseHover() {
    if (!state.hovered) return;
    hideTip();
    hoverTo(0);
  }
  function hubChanged(animate) {
    releaseHover();
    pinnedPlan = null;
    applyLayout(!!animate, releaseHover);
    placeLogo();
    if (savePinned) savePinned(state.pinned.slice());
  }
  function seedPins() {
    var want = deps.pinned;
    if (!want || !want.length || typeof want.length !== "number") return;
    var seen = dict();
    var out = [];
    for (var i = 0; i < want.length && out.length < PIN_MAX; i++) {
      var id = want[i];
      if (typeof id !== "string" || seen[id] || !graph.hasNode(id)) continue;
      seen[id] = 1;
      out.push(id);
    }
    state.pinned = out;
  }
  var nodeDrag = null;
  var NODE_DRAG_MIN = 4;
  var dragJustMoved = null;
  function inHubHole(gx, gy) {
    if (!geomLock) return false;
    return Math.hypot(gx, gy) / UNIT < geomLock.r0 * INNER_SCALE;
  }
  function placeHubDrop() {
    var el = $("hubdrop");
    if (!el || !renderer || !geomLock) return;
    if (!nodeDrag || !nodeDrag.moved) {
      el.hidden = true;
      return;
    }
    var c = renderer.graphToViewport({ x: 0, y: 0 });
    var edge = renderer.graphToViewport({ x: geomLock.r0 * INNER_SCALE * UNIT, y: 0 });
    var d = Math.hypot(edge.x - c.x, edge.y - c.y) * 2;
    el.style.width = el.style.height = d + "px";
    el.style.left = c.x + "px";
    el.style.top = c.y + "px";
    el.setAttribute("data-over", nodeDrag.over ? "1" : "0");
    el.setAttribute("data-drop", nodeDrag.wasPinned && !nodeDrag.over ? "out" : "in");
    el.hidden = false;
  }
  function makeFrameCoalescer() {
    var pend = null;
    var raf = 0;
    var flush = function() {
      raf = 0;
      var f = pend;
      pend = null;
      if (f) f();
    };
    return function onFrame(fn) {
      pend = fn;
      if (!raf) raf = WIN.requestAnimationFrame(flush);
    };
  }
  function bindNodeDrag() {
    var onFrame = makeFrameCoalescer();
    var captor = renderer.getMouseCaptor && renderer.getMouseCaptor();
    if (!captor) return;
    renderer.on("downNode", function(e) {
      var o = e.event && e.event.original;
      if (o && o.button !== 0) return;
      nodeDrag = { id: e.node, moved: false, over: false, wasPinned: isPinned(e.node) };
      dragJustMoved = null;
    });
    captor.on("mousemovebody", function(e) {
      if (!nodeDrag) return;
      if (e.original && e.original.buttons !== void 0 && !(e.original.buttons & 1)) {
        drop();
        return;
      }
      if (e.preventDefault) e.preventDefault();
      if (e.original) {
        e.original.preventDefault();
        e.original.stopPropagation();
      }
      if (!nodeDrag.moved) {
        if (nodeDrag.x0 === void 0) {
          nodeDrag.x0 = e.x;
          nodeDrag.y0 = e.y;
        }
        if (Math.hypot(e.x - nodeDrag.x0, e.y - nodeDrag.y0) < NODE_DRAG_MIN) return;
        nodeDrag.moved = true;
        dragJustMoved = nodeDrag.id;
      }
      var p = renderer.viewportToGraph(e);
      nodeDrag.over = inHubHole(p.x, p.y);
      var dragId = nodeDrag.id;
      onFrame(function() {
        if (!nodeDrag || nodeDrag.id !== dragId) return;
        graph.setNodeAttribute(dragId, "x", p.x);
        graph.setNodeAttribute(dragId, "y", p.y);
        renderer.refresh({ partialGraph: { nodes: [dragId] }, skipIndexation: false, schedule: true });
        placeHubDrop();
      });
    });
    var drop = function() {
      if (!nodeDrag) return;
      var d = nodeDrag;
      nodeDrag = null;
      placeHubDrop();
      if (!d.moved) return;
      if (d.over && !d.wasPinned) pin(d.id);
      else if (!d.over && d.wasPinned) unpin(d.id);
      hubChanged(true);
    };
    captor.on("mouseup", drop);
    captor.on("mouseleave", drop);
  }
  var tlRank = dict();
  var tlDate = [];
  var tlMax = 0;
  var tlDateMs = [];
  var tlMs = dict();
  var dateSpan = null;
  function buildTimeline() {
    var dated = [];
    graph.forEachNode(function(id, a) {
      if (a.created) dated.push([id, a.created]);
    });
    dated.sort(function(x, y) {
      return x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0;
    });
    tlRank = dict();
    tlDate = [];
    tlDateMs = [];
    tlMs = dict();
    dated.forEach(function(pair, i) {
      tlRank[pair[0]] = i + 1;
      tlDate.push(pair[1]);
      var ms = heatParse(pair[1]);
      if (!Number.isNaN(ms)) tlMs[pair[0]] = ms;
      tlDateMs.push(ms);
    });
    tlMax = dated.length;
    buildDateSpan(dated);
  }
  function buildDateSpan(dated) {
    dateSpan = null;
    if (!dated.length) return;
    var lo = heatParse(dated[0][1]), hi = heatParse(dated[dated.length - 1][1]);
    if (Number.isNaN(lo) || Number.isNaN(hi)) return;
    var d0 = new Date(lo), d1 = new Date(hi);
    var y0 = d0.getUTCFullYear(), m0 = d0.getUTCMonth();
    var y1 = d1.getUTCFullYear(), m1 = d1.getUTCMonth();
    var months = [];
    var index = dict();
    for (var y = y0, m = m0; y < y1 || y === y1 && m <= m1; ) {
      var key = y + "-" + (m < 9 ? "0" : "") + (m + 1);
      index[key] = months.length;
      months.push({ key, y, m, ms: Date.UTC(y, m, 1), n: 0 });
      if (++m > 11) {
        m = 0;
        y++;
      }
    }
    var years = dict();
    for (var i = 0; i < dated.length; i++) {
      var s = dated[i][1], k = s.slice(0, 7), ix = index[k];
      if (ix !== void 0) months[ix].n++;
      var yy = s.slice(0, 4);
      years[yy] = (years[yy] || 0) + 1;
    }
    var ylist = [];
    for (var yk = y0; yk <= y1; yk++) ylist.push({ y: yk, n: years[String(yk)] || 0 });
    var nMax = 1, tot = 0;
    months.forEach(function(mm) {
      if (mm.n > nMax) nMax = mm.n;
      tot += mm.n;
    });
    var sorted = months.map(function(mm) {
      return mm.n;
    }).sort(function(x, y2) {
      return x - y2;
    });
    var p90 = sorted.length ? sorted[Math.floor(sorted.length * 0.9)] : 1;
    var nRef = Math.max(1, p90, nMax * 0.35);
    var yMax = 1;
    ylist.forEach(function(yy2) {
      if (yy2.n > yMax) yMax = yy2.n;
    });
    var AVG_MONTH_MS = 30.436875 * 864e5;
    var YEAR_FLOOR_MS = AVG_MONTH_MS;
    var YEAR_CEIL_MS = 12 * AVG_MONTH_MS;
    var yCounts = ylist.map(function(yy2) {
      return yy2.n;
    }).sort(function(a, b) {
      return a - b;
    });
    var yMax2 = yCounts.length ? yCounts[yCounts.length - 1] : 1;
    var yP90 = yCounts.length ? yCounts[Math.floor(yCounts.length * 0.9)] : 1;
    var yearRef = Math.max(1, yP90, yMax2 * 0.35);
    var lastMonthEnd = Date.UTC(y1, m1 + 1, 0);
    var endMs = Math.min(lastMonthEnd, Math.max(hi, heatParse(TODAY)));
    var lastFrac = new Date(endMs).getUTCDate() / new Date(lastMonthEnd).getUTCDate();
    var segs = [];
    var segW = 0;
    var segOfMonth = new Array(months.length);
    ylist.forEach(function(yy2) {
      var yFrac = Math.min(1, yy2.n / yearRef);
      var yearWeight = YEAR_FLOOR_MS + yFrac * (YEAR_CEIL_MS - YEAR_FLOOR_MS);
      var idxs = [];
      for (var mi = 0; mi < months.length; mi++) if (months[mi].y === yy2.y) idxs.push(mi);
      var mw = yearWeight / idxs.length;
      idxs.forEach(function(mi2) {
        segOfMonth[mi2] = segs.length;
        var mwOwn = mw * (mi2 === months.length - 1 ? lastFrac : 1);
        segs.push({ i: mi2, w0: segW, w1: segW + mwOwn });
        segW += mwOwn;
      });
    });
    dateSpan = {
      months,
      years: ylist,
      index,
      // github#51
      lo: months[0].ms,
      hi: endMs,
      nMax,
      nRef,
      yMax,
      dated: tot,
      undated: graph.order - tot,
      axis: { segs, totalW: segW || 1, segOfMonth }
    };
  }
  function rangeLabel() {
    if (!dateSpan) return "";
    var f = state.from === null ? dateSpan.lo : state.from;
    var t = state.to === null ? dateSpan.hi : state.to;
    var iso = function(ms) {
      return new Date(ms).toISOString().slice(0, 10);
    };
    return iso(f) + "  \u2192  " + iso(t);
  }
  function setRangeMs(from, to) {
    if (!dateSpan) return;
    if (from !== null && to !== null && from > to) {
      var sw = from;
      from = to;
      to = sw;
    }
    state.from = from === null || from <= dateSpan.lo ? null : from;
    state.to = to === null || to >= dateSpan.hi ? null : to;
    applyRange();
  }
  function rangeChrome() {
    var el = $("rangenote");
    if (el) el.textContent = rangeLabel();
    if (dateSpan) {
      var lo = isoDay(dateSpan.lo), hi = isoDay(dateSpan.hi);
      var f = $("from"), t = $("to");
      if (f) {
        f.min = lo;
        f.max = hi;
        f.value = isoDay(state.from === null ? dateSpan.lo : state.from);
      }
      if (t) {
        t.min = lo;
        t.max = hi;
        t.value = isoDay(state.to === null ? dateSpan.hi : state.to);
      }
    }
    var btn = $("rangeall");
    if (btn) btn.disabled = state.from === null && state.to === null;
    drawDateUI();
  }
  function applyRange() {
    rangeChrome();
    cascade();
  }
  var TODAY = function() {
    var d = /* @__PURE__ */ new Date(), p = function(n) {
      return (n < 10 ? "0" : "") + n;
    };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }();
  function isMarkedDay(id) {
    if (!state.markDay && !state.hoverDay && state.hoverYear === null) return false;
    var c = graph.getNodeAttribute(id, "created");
    if (c === state.markDay || c === state.hoverDay) return true;
    return state.hoverYear !== null && !!c && c.slice(0, 4) === state.hoverYear;
  }
  function isHighlighted(id) {
    if (isMarkedDay(id)) return true;
    var g = groupOf(id);
    if (state.highlight[g]) return true;
    if (state.hoverGroup === g) return true;
    var a = graph.getNodeAttributes(id), d = a.dirs || [];
    for (var k = 1; k <= d.length; k++) {
      var pk = pathKey(a, k);
      if (state.highlightSub[pk]) return true;
      if (state.hoverSub[pk]) return true;
    }
    return false;
  }
  function cellNoteFrac(c) {
    if (!renderer || !c || !c.ids || !c.ids.length) return null;
    var q0 = renderer.graphToViewport({ x: 0, y: 0 });
    var q1 = renderer.graphToViewport({ x: UNIT, y: 0 });
    var d0 = Math.hypot(q1.x - q0.x, q1.y - q0.y);
    var perPx = d0 > 1e-3 ? UNIT / d0 : 0;
    var lo = Infinity, hi = -Infinity;
    c.ids.forEach(function(id) {
      if ((alpha[id] || 0) < 0.5) return;
      var at = graph.getNodeAttributes(id);
      var rl = Math.hypot(at.x, at.y) / UNIT;
      if (!(rl > 1e-6)) return;
      var dd = renderer.getNodeDisplayData(id);
      if (!dd || dd.hidden) return;
      var sn = seamAt(rl * UNIT, c.nB, c.inner ? "i" : "o");
      if (!(sn.avail > 1e-9)) return;
      var f = (angleSweep(Math.atan2(at.y, at.x)) + sn.gap / 2 - sn.gap * c.seams) / sn.avail;
      var half = renderer.scaleSize(dd.size) * perPx / (rl * UNIT) / sn.avail;
      if (f - half < lo) lo = f - half;
      if (f + half > hi) hi = f + half;
    });
    return lo < hi ? { lo, hi } : null;
  }
  function wedgeEdges(rLattice) {
    var cells = DBG.cells;
    if (!cells || !cells.length) return [];
    var out = [];
    ["i", "o"].forEach(function(bk) {
      var band = cells.filter(function(c) {
        return (c.inner ? "i" : "o") === bk;
      });
      if (!band.length) return;
      var r = rLattice || (geomLock ? bk === "i" ? geomLock.r0 + (geomLock.rOuter - geomLock.r0) * INNER_FILL * 0.5 : (geomLock.rOuter + geomLock.maxR) / 2 : 1);
      var sm = seamAt(r * UNIT, band[0].nB, bk);
      var sw = function(c, which) {
        if (c.pLead !== void 0) return edgeSweep(
          /** @type {Cell} */
          /** @type {unknown} */
          c,
          which === "f0" ? "lead" : "trail",
          r * UNIT
        );
        return sm.gap * c.seams + sm.avail * c[which] - sm.gap / 2;
      };
      var runs = [];
      band.slice().sort(function(x, y) {
        return x.f0 - y.f0;
      }).forEach(function(c) {
        var last = runs[runs.length - 1];
        if (last && last.g === c.g) {
          last.b = c;
          return;
        }
        runs.push({ g: c.g, band: bk, a: c, b: c });
      });
      var noteFrac = function(run) {
        var lo = Infinity, hi = -Infinity;
        band.filter(function(c) {
          return c.g === run.g && c.f0 >= run.a.f0 && c.f1 <= run.b.f1;
        }).forEach(function(c) {
          var e = cellNoteFrac(c);
          if (!e) return;
          if (e.lo < lo) lo = e.lo;
          if (e.hi > hi) hi = e.hi;
        });
        return lo < hi ? { lo, hi } : null;
      };
      runs.forEach(function(run, i) {
        var prev = runs[(i - 1 + runs.length) % runs.length];
        var next = runs[(i + 1) % runs.length];
        var lo = sw(prev.b, "f1"), hi = sw(next.a, "f0");
        if (runs.length < 2) {
          lo = sw(run.a, "f0") - sm.gap;
          hi = sw(run.b, "f1") + sm.gap;
        } else {
          while (hi < lo) hi += 2 * Math.PI;
        }
        var deg = function(x) {
          return sweepAngle(x) * 180 / Math.PI;
        };
        var nf = noteFrac(run);
        out.push({
          g: run.g,
          band: bk,
          r,
          nf0: nf ? nf.lo : null,
          nf1: nf ? nf.hi : null,
          nStart: nf ? deg(sw({ seams: run.a.seams, f0: nf.lo }, "f0")) : null,
          nEnd: nf ? deg(sw({ seams: run.a.seams, f0: nf.hi }, "f0")) : null,
          seams: run.a.seams,
          f0: run.a.f0,
          f1: run.b.f1,
          gap: sm.gap * 180 / Math.PI,
          avail: sm.avail * 180 / Math.PI,
          start: deg(sw(run.a, "f0")),
          end: deg(sw(run.b, "f1")),
          arc: (sw(run.b, "f1") - sw(run.a, "f0")) * 180 / Math.PI,
          centre: deg((lo + hi) / 2)
        });
      });
    });
    return out;
  }
  function drawWedgeDebug() {
    var cv = DBG.canvas;
    if (!cv) return;
    if (!DBG.on || !renderer || !geomLock) {
      cv.hidden = true;
      return;
    }
    cv.hidden = false;
    var host = $("graph");
    var w = host.clientWidth, h = host.clientHeight, dpr = WIN.devicePixelRatio || 1;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = w + "px";
      cv.style.height = h + "px";
    }
    var g2 = (
      /** @type {CanvasRenderingContext2D} */
      cv.getContext("2d")
    );
    g2.setTransform(dpr, 0, 0, dpr, 0, 0);
    g2.clearRect(0, 0, w, h);
    var perPx = function() {
      var a0 = renderer.graphToViewport({ x: 0, y: 0 });
      var b0 = renderer.graphToViewport({ x: UNIT, y: 0 });
      var d0 = Math.hypot(b0.x - a0.x, b0.y - a0.y);
      return d0 > 1e-3 ? UNIT / d0 : 0;
    }();
    var seen = { i: null, o: null };
    graph.forEachNode(function(id, a) {
      if ((alpha[id] || 0) < 0.5 || isOrphan(id)) return;
      var dd = renderer.getNodeDisplayData(id);
      if (!dd || dd.hidden) return;
      var rl = Math.hypot(a.x, a.y) / UNIT;
      var dot = renderer.scaleSize(dd.size) * perPx / UNIT;
      var k = bandLock && bandLock[groupOf(id)] ? "i" : "o";
      var bb = seen[k] || (seen[k] = { lo: Infinity, hi: -Infinity });
      if (rl - dot < bb.lo) bb.lo = rl - dot;
      if (rl + dot > bb.hi) bb.hi = rl + dot;
    });
    var thickI = (geomLock.rOuter - geomLock.r0) * INNER_FILL;
    var bandR = { i: [geomLock.r0, geomLock.r0 + thickI], o: [geomLock.rOuter, geomLock.maxR] };
    ["i", "o"].forEach(function(k) {
      if (seen[k] && seen[k].lo < seen[k].hi) bandR[k] = [seen[k].lo, seen[k].hi];
    });
    var vp = function(rl, ang) {
      return renderer.graphToViewport({ x: rl * UNIT * Math.cos(ang), y: rl * UNIT * Math.sin(ang) });
    };
    var tint = function(g0, a) {
      return { c: colorOf(g0), a };
    };
    g2.lineWidth = 1;
    g2.strokeStyle = SEAM_YELLOW_45;
    g2.lineWidth = 2;
    g2.setLineDash([4, 4]);
    [bandR.i[0], bandR.i[1], bandR.o[0], bandR.o[1]].forEach(function(rl) {
      g2.beginPath();
      for (var i = 0; i <= 96; i++) {
        var q = vp(rl, i / 96 * 2 * Math.PI);
        if (i) g2.lineTo(q.x, q.y);
        else g2.moveTo(q.x, q.y);
      }
      g2.stroke();
    });
    g2.setLineDash([]);
    var cells = DBG.cells || [];
    ["i", "o"].forEach(function(bk) {
      var band = cells.filter(function(c) {
        return (c.inner ? "i" : "o") === bk;
      });
      if (!band.length) return;
      var lo = bandR[bk][0], hi = bandR[bk][1];
      (function() {
        var runs = [];
        band.slice().sort(function(x, y) {
          return x.f0 - y.f0;
        }).forEach(function(c0) {
          var last = runs[runs.length - 1];
          if (last && last.g === c0.g) {
            last.cells.push(c0);
            return;
          }
          runs.push({ g: c0.g, cells: [c0] });
        });
        runs.forEach(function(run) {
          var a0c = run.cells[0], b0c = run.cells[run.cells.length - 1];
          var fMid = (a0c.f0 + b0c.f1) / 2;
          var host0 = a0c;
          run.cells.forEach(function(c0) {
            if (c0.f0 <= fMid && fMid <= c0.f1) host0 = c0;
          });
          var mid = function(rl) {
            if (a0c.pLead !== void 0) {
              return sweepAngle((edgeSweep(
                /** @type {Cell} */
                /** @type {unknown} */
                a0c,
                "lead",
                rl * UNIT
              ) + edgeSweep(
                /** @type {Cell} */
                /** @type {unknown} */
                b0c,
                "trail",
                rl * UNIT
              )) / 2);
            }
            var sm0 = seamAt(rl * UNIT, host0.nB, host0.inner ? "i" : "o");
            return sweepAngle(sm0.gap * host0.seams + sm0.avail * fMid - sm0.gap / 2);
          };
          var pts = [];
          for (var qq = 0; qq <= 24; qq++) {
            var rq = lo + (hi - lo) * qq / 24;
            pts.push(vp(rq, mid(rq)));
          }
          g2.strokeStyle = "#fff";
          g2.globalAlpha = 0.6;
          g2.lineWidth = 2;
          g2.setLineDash([5, 5]);
          g2.beginPath();
          pts.forEach(function(pt, qq2) {
            if (qq2) g2.lineTo(pt.x, pt.y);
            else g2.moveTo(pt.x, pt.y);
          });
          g2.stroke();
          g2.setLineDash([]);
          g2.globalAlpha = 1;
        });
      })();
      var sorted = band.slice().sort(function(x, y) {
        return x.f0 - y.f0;
      });
      sorted.forEach(function(c, i) {
        var next = sorted[(i + 1) % sorted.length];
        if (next === c) return;
        var angOf = function(cell, which, rl) {
          if (cell.pLead !== void 0) {
            return edgeSweep(
              /** @type {Cell} */
              /** @type {unknown} */
              cell,
              which === "f0" ? "lead" : "trail",
              rl * UNIT
            );
          }
          var sm0 = seamAt(rl * UNIT, cell.nB, cell.inner ? "i" : "o");
          return sm0.gap * cell.seams + sm0.avail * cell[which] - sm0.gap / 2;
        };
        var chord = function(fn, style, width, dash, tag, rFrom) {
          if (DBG.trace) DBG.trace.push({
            tag: tag || "?",
            c: c.k,
            next: next.k,
            deg: sweepAngle(fn(DBG.traceR)) * 180 / Math.PI
          });
          g2.strokeStyle = style.c;
          g2.globalAlpha = style.a;
          g2.lineWidth = width;
          if (dash) g2.setLineDash(dash);
          var r0c = rFrom !== void 0 ? rFrom : lo;
          g2.beginPath();
          for (var q = 0; q <= 48; q++) {
            var rl = r0c + (hi - r0c) * q / 48;
            var pt = vp(rl, sweepAngle(fn(rl)));
            if (q) g2.lineTo(pt.x, pt.y);
            else g2.moveTo(pt.x, pt.y);
          }
          g2.stroke();
          if (dash) g2.setLineDash([]);
          g2.globalAlpha = 1;
        };
        var sweepA = function(rl) {
          return angOf(c, "f1", rl);
        };
        var sweepB = function(rl) {
          var a = angOf(next, "f0", rl), b = sweepA(rl);
          while (a < b) a += 2 * Math.PI;
          while (a - b > Math.PI) a -= 2 * Math.PI;
          return a;
        };
        var groupBoundary = c.g !== next.g;
        (function() {
          var mid = function(rl) {
            return sweepAngle((sweepA(rl) + sweepB(rl)) / 2);
          };
          var pOut = { x: hi * UNIT * Math.cos(mid(hi)), y: hi * UNIT * Math.sin(mid(hi)) };
          var pIn = { x: lo * UNIT * Math.cos(mid(lo)), y: lo * UNIT * Math.sin(mid(lo)) };
          var dx = pIn.x - pOut.x, dy = pIn.y - pOut.y, L = Math.hypot(dx, dy);
          if (!(L > 1e-6)) return;
          var reach = Math.hypot(pIn.x, pIn.y);
          var pEnd = { x: pIn.x + dx / L * reach, y: pIn.y + dy / L * reach };
          var q0 = renderer.graphToViewport(pOut), q1 = renderer.graphToViewport(pEnd);
          g2.strokeStyle = SEAM_YELLOW;
          g2.globalAlpha = groupBoundary ? 0.75 : 0.45;
          g2.lineWidth = 2;
          g2.setLineDash([3, 4]);
          g2.beginPath();
          g2.moveTo(q0.x, q0.y);
          g2.lineTo(q1.x, q1.y);
          g2.stroke();
          g2.setLineDash([]);
          g2.globalAlpha = 1;
        })();
        chord(
          sweepA,
          tint(c.g, groupBoundary ? 0.9 : 0.35),
          groupBoundary ? 3 : 2,
          null,
          c.g + " trailing"
        );
        chord(
          sweepB,
          tint(next.g, groupBoundary ? 0.9 : 0.35),
          groupBoundary ? 3 : 2,
          null,
          next.g + " leading"
        );
      });
    });
    drawWedgeLegend(g2);
  }
  function drawWedgeLegend(g2) {
    var rows = [
      ["solid, folder colour", "wedge edge"],
      ["dashed white", "wedge centre"],
      ["dotted yellow", "seam centre"],
      ["dashed yellow", "band radius"]
    ];
    var pad = 8, lh = 16, sw = 34, x = 12, y = 12;
    g2.font = "11px ui-monospace, monospace";
    g2.textBaseline = "middle";
    var wide = 0;
    rows.forEach(function(r) {
      wide = Math.max(wide, g2.measureText(r[1]).width);
    });
    var w = sw + 8 + wide + pad * 2, h = lh * (rows.length + 1) + pad * 2;
    g2.globalAlpha = 0.72;
    g2.fillStyle = "#000";
    g2.fillRect(x, y, w, h);
    g2.globalAlpha = 1;
    rows.forEach(function(r, i) {
      var yy = y + pad + lh * i + lh / 2;
      g2.strokeStyle = i === 0 ? "#e66767" : i === 1 ? "#fff" : SEAM_YELLOW;
      g2.globalAlpha = i === 0 ? 0.9 : i === 1 ? 0.5 : i === 2 ? 0.75 : 0.45;
      g2.lineWidth = i === 0 ? 1.5 : 1;
      g2.setLineDash(i === 0 ? [] : i === 1 ? [5, 5] : i === 2 ? [3, 4] : [4, 4]);
      g2.beginPath();
      g2.moveTo(x + pad, yy);
      g2.lineTo(x + pad + sw, yy);
      g2.stroke();
      g2.setLineDash([]);
      g2.globalAlpha = 0.85;
      g2.fillStyle = "#fff";
      g2.fillText(r[1], x + pad + sw + 8, yy);
    });
    g2.globalAlpha = 0.55;
    g2.fillStyle = "#fff";
    g2.fillText(
      "built " + (DATA && DATA.generated ? DATA.generated : "?"),
      x + pad,
      y + pad + lh * rows.length + lh / 2
    );
    g2.globalAlpha = 1;
  }
  function wedgeDebug(v) {
    DBG.on = !!v;
    if (DBG.on && !DBG.canvas) {
      var host = $("graph");
      if (host) {
        var cv = DOC.createElement("canvas");
        cv.className = "vg-wedge-debug";
        host.appendChild(cv);
        DBG.canvas = cv;
      }
    }
    if (!DBG.on) {
      DBG.cells = null;
      if (DBG.canvas) DBG.canvas.hidden = true;
    }
    if (renderer) renderer.refresh({ skipIndexation: true });
    return DBG.on;
  }
  function hoverHighlight(group, keys) {
    group = group || null;
    var next = dict();
    (keys || []).forEach(function(k) {
      if (k) next[k] = true;
    });
    var a = Object.keys(state.hoverSub).sort().join(","), b = Object.keys(next).sort().join(",");
    if (state.hoverGroup === group && a === b) return;
    state.hoverGroup = group;
    state.hoverSub = next;
    if (renderer) renderer.refresh();
  }
  function ownsWedge(folder, sub) {
    var subs = subOrder[folder] || [];
    var k = subs.indexOf(sub || "");
    if (k < 0) return false;
    return k < SUB_NAMED || subs.length === SUB_NAMED + 1;
  }
  function isPushed(id) {
    if (state.highlight[groupOf(id)]) return true;
    var a = graph.getNodeAttributes(id);
    return !!state.highlightSub[pathKey(a, 1)] && ownsWedge(a.folder, a.sub || "");
  }
  function willShow(id) {
    return visible(id) && timeFactor(id) > 4e-3;
  }
  var TL_FADE = 8;
  function timeFactor(id) {
    if (state.from !== null || state.to !== null) {
      var ms = tlMs[id];
      if (ms !== void 0) {
        if (state.from !== null && ms < state.from) return 0;
        if (state.to !== null && ms > state.to) return 0;
      }
    }
    if (state.until === null) return 1;
    var rk = tlRank[id];
    if (!rk) return 1;
    var f = (state.until - rk + 1) / TL_FADE;
    return f <= 0 ? 0 : f >= 1 ? 1 : f;
  }
  var alpha = dict();
  function present(id) {
    return (alpha[id] || 0) > 4e-3;
  }
  function syncAlpha() {
    graph.forEachNode(function(id) {
      alpha[id] = visible(id) ? timeFactor(id) : 0;
    });
  }
  function clearAlpha() {
    graph.forEachNode(function(id) {
      alpha[id] = 0;
    });
  }
  var rgbCache = dict();
  function toRgb(hex) {
    var c = rgbCache[hex];
    if (c) return c;
    var h = String(hex).trim();
    if (h.charAt(0) === "#") {
      if (h.length === 4) h = "#" + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2) + h.charAt(3) + h.charAt(3);
      c = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    } else {
      var m = /(\d+)\D+(\d+)\D+(\d+)/.exec(h);
      c = m ? [+m[1], +m[2], +m[3]] : [128, 128, 128];
    }
    return rgbCache[hex] = c;
  }
  function withAlpha(color, a) {
    if (a >= 0.999) return color;
    var c = toRgb(color);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a.toFixed(3) + ")";
  }
  var FADE_FRAMES = 12;
  var RADIAL_EASE = 0.25;
  var SPREAD_MAX = 78;
  var SPREAD_PER = 0.17;
  var SPREAD_MIN = 24;
  var TIME_SCALE = function() {
    var m = /(^|[?&#])slow=([0-9.]+)/.exec(String(WIN.location ? WIN.location.search : "") + " " + String(WIN.location ? WIN.location.hash : ""));
    return m && +m[2] > 0 ? +m[2] : 1.25;
  }();
  var TIMELINE_MS = 4500;
  var CASCADE_MS = 1600;
  var TWEEN_MS = 380;
  var NOW = function() {
    return (window.performance || Date).now();
  };
  var fullRing = false;
  var planKeep = null;
  var cascadeRun = null;
  var pinnedPlan = null;
  var planMs = 0;
  var lastGapN = { i: 0, o: 0 };
  var lastStart = null;
  var lastArc = null;
  var lastBand = null;
  var lastMaxR = 0;
  var dotFit = dict();
  var FIT_SHARE = 0.46;
  var fitQuery = String(WIN.location ? WIN.location.search : "") + " " + String(WIN.location ? WIN.location.hash : "");
  var fitCap = /(^|[?&#])nofit\b/.test(fitQuery) ? false : /(^|[?&#])fit\b/.test(fitQuery) ? true : deps.fitCap !== false;
  var posVer = 0;
  var fitVer = -1;
  var fitNow = null;
  function measureFit() {
    fitVer = posVer;
    if (!fitCap) {
      fitNow = null;
      return;
    }
    var pts = [];
    graph.forEachNode(function(id, a) {
      var al = alpha[id];
      if (al === void 0) al = 1;
      if (al < 0.35) return;
      pts.push({ id, x: a.x, y: a.y, gx: 0, gy: 0 });
    });
    var map = dict();
    if (pts.length < 2) {
      fitNow = map;
      return;
    }
    var cell = Math.max(1, pitchUnits("o"));
    var grid = dict();
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.gx = Math.floor(p.x / cell);
      p.gy = Math.floor(p.y / cell);
      var k = p.gx + ":" + p.gy;
      (grid[k] || (grid[k] = [])).push(p);
    }
    for (var q = 0; q < pts.length; q++) {
      var a2 = pts[q], nn = Infinity;
      for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) {
        var bucket = grid[a2.gx + dx + ":" + (a2.gy + dy)];
        if (!bucket) continue;
        for (var bi = 0; bi < bucket.length; bi++) {
          var b2 = bucket[bi];
          if (b2 === a2) continue;
          var d2 = (b2.x - a2.x) * (b2.x - a2.x) + (b2.y - a2.y) * (b2.y - a2.y);
          if (d2 < nn) nn = d2;
        }
      }
      if (nn < Infinity) map[a2.id] = Math.sqrt(nn);
    }
    fitNow = map;
  }
  function setFitCap(on) {
    fitCap = !!on;
    fitVer = -1;
    fitNow = null;
    if (renderer) renderer.refresh({ skipIndexation: true });
    return fitCap;
  }
  var lastMinArc = 0;
  var roomNow = null;
  var colWalk = null;
  var splitHold = null;
  var posSrc = null;
  var cellRoom = dict();
  var cellNow = null;
  var edgeNow = null;
  var edgeCap = dict();
  var trace = null;
  function traceTag(tag) {
    if (trace) trace.tag = tag;
  }
  function tracePut(rec) {
    if (!trace) return;
    rec.tag = trace.tag;
    trace.rows.push(rec);
  }
  var hubRow0 = dict();
  var lastCascade = { ins: 0, outs: 0, span: 0, path: "none", frames: 0, ms: 0 };
  function pinPlan() {
    var t0 = (window.performance || Date).now();
    pinnedPlan = buildWedgePlan(true);
    planMs = (window.performance || Date).now() - t0;
    return pinnedPlan;
  }
  function cascade(done, opts) {
    if (dead) return;
    opts = opts || {};
    stopPlay();
    if (anim) {
      WIN.cancelAnimationFrame(anim);
      anim = null;
    }
    if (animGuard) {
      WIN.clearTimeout(animGuard);
      animGuard = null;
    }
    if (cascadeRun) {
      WIN.cancelAnimationFrame(cascadeRun.raf);
      WIN.clearTimeout(cascadeRun.guard);
      cascadeRun = null;
    }
    moveFrom = null;
    splitHold = null;
    fullRing = false;
    graph.forEachNode(function(id) {
      if (present(id)) fullRing = true;
    });
    if (opts.fullRing !== void 0) fullRing = !!opts.fullRing;
    planKeep = function(id) {
      return willShow(id) || present(id);
    };
    pinPlan();
    colWalk = null;
    var keep = dict();
    graph.forEachNode(function(id) {
      keep[id] = alpha[id] || 0;
      alpha[id] = visible(id) ? timeFactor(id) : 0;
    });
    var pinWas = pinnedPlan, keepWas = planKeep, roomWas = roomNow;
    pinnedPlan = null;
    planKeep = null;
    roomNow = null;
    cellNow = null;
    edgeNow = null;
    colWalk = null;
    ringsLayout();
    var finalPos = ringsLayout() || {};
    var deferredAutoFit = false;
    if (opts.colToggle && camAtRest) {
      if (fitRatio() < renderer.getCamera().getState().ratio) deferredAutoFit = true;
      else fit();
    }
    pinnedPlan = pinWas;
    planKeep = keepWas;
    roomNow = roomWas;
    graph.forEachNode(function(id) {
      alpha[id] = keep[id];
    });
    var sweepOf = dict();
    graph.forEachNode(function(id) {
      var q = finalPos[id];
      sweepOf[id] = q ? angleSweep(Math.atan2(q.y, q.x)) : 0;
    });
    var moves = [];
    if (opts.movesFrom) {
      moveFrom = opts.movesFrom;
      Object.keys(opts.movesFrom).forEach(function(id) {
        if (!graph.hasNode(id)) return;
        moves.push(id);
      });
      if (!moves.length) moveFrom = null;
    }
    var isMove = dict();
    moves.forEach(function(id) {
      isMove[id] = true;
    });
    var ins = [];
    var outs = [];
    var to = dict();
    var from = dict();
    graph.forEachNode(function(id) {
      var want = visible(id) ? timeFactor(id) : 0;
      var now = alpha[id] || 0;
      if (moveFrom && moveFrom[id] !== void 0) {
        from[id] = now;
        return;
      }
      if (Math.abs(now - want) <= 4e-3) return;
      to[id] = want;
      from[id] = now;
      (want ? ins : outs).push(id);
    });
    if (moves.length) {
      var saveMF = moveFrom;
      moveFrom = null;
      try {
        moves.forEach(function(id) {
          to[id] = visible(id) ? timeFactor(id) : 0;
        });
      } finally {
        moveFrom = saveMF;
      }
    }
    if (!ins.length && !outs.length && !moves.length) {
      lastCascade = { ins: 0, outs: 0, span: 0, path: "instant: nothing to move", frames: 0, ms: 0 };
      pinnedPlan = null;
      roomNow = null;
      cellNow = null;
      edgeNow = null;
      posSrc = null;
      applyLayout(true);
      return;
    }
    var clockwise = function(a, b) {
      return sweepOf[a] - sweepOf[b];
    };
    var rank = typeof opts.order === "function" ? opts.order : null;
    var arrival = rank ? (
      /** @param {string} a @param {string} b */
      function(a, b) {
        return rank(a) - rank(b);
      }
    ) : clockwise;
    ins.sort(arrival);
    outs.sort(arrival);
    moves.sort(arrival);
    var windowFor = function(n) {
      if (opts.spread > 0) return opts.spread;
      return Math.max(SPREAD_MIN, Math.min(SPREAD_MAX, n * SPREAD_PER)) * TIME_SCALE;
    };
    var delay = dict();
    [ins, outs].forEach(function(set) {
      var w = windowFor(set.length);
      set.forEach(function(id, i) {
        delay[id] = set.length < 2 ? 0 : w * i / (set.length - 1);
      });
    });
    var moveSpan = moves.length ? Math.max(2 * windowFor(moves.length), 4 * FADE_FRAMES * TIME_SCALE) + 2 * FADE_FRAMES * TIME_SCALE : 0;
    var span = Math.max(windowFor(ins.length), windowFor(outs.length)) + FADE_FRAMES * TIME_SCALE;
    if (moveSpan > span) span = moveSpan;
    var arriveAt = dict();
    var crossAt = dict();
    if (moves.length) (function() {
      var leaveW = span * 0.35;
      var landW = Math.max(1, span * 0.45 - FADE_FRAMES * TIME_SCALE);
      moves.forEach(function(id, i) {
        var f = moves.length < 2 ? 0 : i / (moves.length - 1);
        delay[id] = leaveW * f;
        arriveAt[id] = span * 0.55 + landW * f;
        var lo = delay[id] + FADE_FRAMES * TIME_SCALE;
        var hi = Math.max(lo, arriveAt[id] - FADE_FRAMES * TIME_SCALE);
        crossAt[id] = lo + (hi - lo) * f;
      });
    })();
    var tglDir = dict();
    var tglN = dict();
    var tglMv = dict();
    if (opts.colToggle) (function() {
      var startN = dict();
      var outN = dict();
      var inN = dict();
      graph.forEachNode(function(id) {
        if ((alpha[id] || 0) > 4e-3) {
          var g0 = groupOf(id);
          startN[g0] = (startN[g0] || 0) + 1;
        }
      });
      outs.forEach(function(id) {
        var g0 = groupOf(id);
        outN[g0] = (outN[g0] || 0) + 1;
      });
      ins.forEach(function(id) {
        var g0 = groupOf(id);
        inN[g0] = (inN[g0] || 0) + 1;
      });
      var mvOutN = dict();
      var mvInN = dict();
      moves.forEach(function(id) {
        var g0 = groupOf(id);
        outN[g0] = (outN[g0] || 0) + 1;
        mvOutN[g0] = 1;
      });
      (function() {
        var save = moveFrom;
        moveFrom = null;
        try {
          moves.forEach(function(id) {
            var g0 = groupOf(id);
            inN[g0] = (inN[g0] || 0) + 1;
            mvInN[g0] = 1;
          });
        } finally {
          moveFrom = save;
        }
      })();
      Object.keys(outN).forEach(function(g0) {
        if (!inN[g0] && outN[g0] === (startN[g0] || 0)) {
          tglDir[g0] = "out";
          tglN[g0] = outN[g0];
          if (mvOutN[g0]) tglMv[g0] = true;
        }
      });
      Object.keys(inN).forEach(function(g0) {
        if (!outN[g0] && !(startN[g0] || 0)) {
          tglDir[g0] = "in";
          tglN[g0] = inN[g0];
          if (mvInN[g0]) tglMv[g0] = true;
        }
      });
    })();
    if (moves.length) (function() {
      var byG = dict();
      moves.forEach(function(id) {
        var g0 = moveFrom[id];
        if (tglDir[g0] === "out") (byG[g0] || (byG[g0] = [])).push(id);
      });
      var stretch = Math.max(1, span - 2 * FADE_FRAMES * TIME_SCALE);
      Object.keys(byG).forEach(function(g0) {
        var set = byG[g0];
        set.sort(function(p0, q0) {
          var ap = graph.getNodeAttributes(p0), aq = graph.getNodeAttributes(q0);
          return Math.hypot(ap.x, ap.y) - Math.hypot(aq.x, aq.y);
        });
        set.forEach(function(id, i) {
          delay[id] = set.length < 2 ? stretch : stretch * i / (set.length - 1);
          crossAt[id] = delay[id] + FADE_FRAMES * TIME_SCALE;
          arriveAt[id] = Math.max(span * 0.55, crossAt[id] + FADE_FRAMES * TIME_SCALE);
        });
      });
    })();
    if (moves.length) (function() {
      var save = moveFrom;
      moveFrom = null;
      var byDest = dict();
      try {
        moves.forEach(function(id) {
          var g0 = groupOf(id);
          (byDest[g0] || (byDest[g0] = [])).push(id);
        });
      } finally {
        moveFrom = save;
      }
      var lo1 = span * 0.55, hi1 = span - FADE_FRAMES * TIME_SCALE;
      Object.keys(byDest).forEach(function(g0) {
        var set = byDest[g0];
        set.sort(function(p0, q0) {
          return arriveAt[p0] - arriveAt[q0];
        });
        set.forEach(function(id, i) {
          var f0 = set.length < 2 ? 0 : i / (set.length - 1);
          arriveAt[id] = Math.max(lo1 + (hi1 - lo1) * f0, crossAt[id] + FADE_FRAMES * TIME_SCALE);
        });
      });
    })();
    var moving = ins.concat(outs).concat(moves);
    lastCascade = {
      ins: ins.length,
      outs: outs.length,
      span: Math.round(span * 100) / 100,
      path: "animated",
      frames: 0,
      ms: 0,
      t0: NOW()
    };
    var settle = function() {
      if (!lastCascade.exit) lastCascade.exit = "settle() called from outside the loop";
      moveFrom = null;
      splitHold = null;
      if (cascadeRun) {
        WIN.cancelAnimationFrame(cascadeRun.raf);
        WIN.clearTimeout(cascadeRun.guard);
        cascadeRun = null;
      }
      probeSample("pre-settle");
      moving.forEach(function(id) {
        alpha[id] = to[id];
      });
      heatSig = "";
      pinnedPlan = null;
      planKeep = null;
      roomNow = null;
      cellNow = null;
      edgeNow = null;
      posSrc = null;
      colWalk = null;
      assignPositions(finalPos);
      ringsLayout();
      ringsLayout();
      renderer.refresh({ skipIndexation: false });
      probeSample("settled");
      if (deferredAutoFit && camAtRest) fit();
      if (done) done();
    };
    var weightOf = function(id) {
      return alpha[id] || 0;
    };
    var wasPresent = dict();
    graph.forEachNode(function(id) {
      wasPresent[id] = present(id);
    });
    var ovAfter = true;
    var spSrcB = { i: 1, o: 1 };
    var spDstB = { i: 1, o: 1 };
    var roomSrcB = { i: 0, o: 0 };
    var roomDstB = { i: 0, o: 0 };
    var cellSrc = null;
    var cellDst = null;
    var edgeSrc = null;
    var edgeDst = null;
    var cellPair = null;
    var edgePair = null;
    var sizeCap = null;
    var rowsSrc = dict();
    var rowsDst = dict();
    var bandSrc = dict();
    var bandDst = dict();
    var staticPlan = function(presentFn) {
      var save = planKeep;
      planKeep = presentFn;
      var p = buildWedgePlan(
        true,
        function(id) {
          return presentFn(id) ? 1 : 0;
        }
      );
      planKeep = save;
      return p;
    };
    (function() {
      var a = staticPlan(function(id) {
        return wasPresent[id];
      });
      var cellsOfG = function(p0) {
        var m = dict();
        if (p0) p0.cells.forEach(function(c) {
          m[c.g] = (m[c.g] || 0) + 1;
        });
        return m;
      };
      var b = function() {
        var save = moveFrom;
        moveFrom = null;
        try {
          return staticPlan(function(id) {
            return willShow(id);
          });
        } finally {
          moveFrom = save;
        }
      }();
      var aCells = cellsOfG(a), bCells = cellsOfG(b);
      if (moves.length) {
        splitHold = dict();
        Object.keys(bCells).forEach(function(g0) {
          splitHold[g0] = bCells[g0] > 1;
        });
        Object.keys(aCells).forEach(function(g0) {
          if (splitHold[g0] === void 0) splitHold[g0] = aCells[g0] > 1;
        });
      }
      Object.keys(tglDir).forEach(function(g0) {
        var n0 = tglDir[g0] === "out" ? aCells[g0] : bCells[g0];
        if (n0 !== 1) delete tglDir[g0];
      });
      var deepen = function(m, c) {
        var k = c.inner ? "i" : "o";
        if (m[k] === void 0 || c.rows > m[k]) m[k] = c.rows;
      };
      var record = function(rows, band) {
        return function(c) {
          if (c.wsum <= 1e-4) return;
          rows[c.k] = c.rows;
          deepen(band, c);
        };
      };
      if (a) a.cells.forEach(record(rowsSrc, bandSrc));
      if (b) b.cells.forEach(record(rowsDst, bandDst));
      ["i", "o"].forEach(function(k) {
        if (bandSrc[k] === void 0 && bandDst[k] !== void 0) bandSrc[k] = 1;
      });
      if (a) {
        spSrcB = { i: a.spInner || a.sp || 1, o: a.sp || 1 };
      }
      if (b) {
        spDstB = { i: b.spInner || b.sp || 1, o: b.sp || 1 };
      }
      var roomOf = function(pl, alphaFn) {
        if (!pl) return null;
        var outPos = null;
        var keepAlpha = null;
        if (alphaFn) {
          keepAlpha = dict();
          graph.forEachNode(function(id) {
            keepAlpha[id] = alpha[id];
            alpha[id] = alphaFn(id);
          });
        }
        var keepI = bandOf("i").room, keepO = bandOf("o").room;
        var keepFit = dotFit, keepCell = cellRoom, keepEdge = edgeCap, keepHub = hubRow0;
        var keepRampI = bandOf("i").ramp, keepRampO = bandOf("o").ramp, keepScale = sizeScale;
        var keepPin = pinnedPlan, keepKeep = planKeep;
        var saved = roomNow, savedCell = cellNow, savedEdge = edgeNow;
        roomNow = null;
        cellNow = null;
        edgeNow = null;
        edgeNow = null;
        var keepTag = trace ? trace.tag : "";
        traceTag(alphaFn ? "endpoint-B" : "endpoint-A");
        outPos = ringsLayout(pl, true);
        traceTag(keepTag);
        measureSizeScale();
        var sizes = dict();
        graph.forEachNode(function(id, at) {
          if ((alpha[id] || 0) > 4e-3) sizes[id] = dotPx(at.size, id);
        });
        var got = {
          i: bandOf("i").room,
          o: bandOf("o").room,
          pos: outPos,
          cells: cellRoom,
          edges: edgeCap,
          sizes
        };
        roomNow = saved;
        cellNow = savedCell;
        edgeNow = savedEdge;
        bandOf("i").room = keepI;
        bandOf("o").room = keepO;
        bandOf("i").ramp = keepRampI;
        bandOf("o").ramp = keepRampO;
        sizeScale = keepScale;
        dotFit = keepFit;
        cellRoom = keepCell;
        edgeCap = keepEdge;
        hubRow0 = keepHub;
        pinnedPlan = keepPin;
        planKeep = keepKeep;
        if (keepAlpha) graph.forEachNode(function(id) {
          alpha[id] = keepAlpha[id];
        });
        return got;
      };
      var rA = roomOf(a, null);
      var rB = roomOf(b, function(id) {
        return willShow(id) ? timeFactor(id) : 0;
      });
      if (rA) roomSrcB = { i: rA.i || 0, o: rA.o || 0 };
      if (rB) roomDstB = { i: rB.i || 0, o: rB.o || 0 };
      cellSrc = rA && rA.cells || null;
      cellDst = rB && rB.cells || null;
      edgeSrc = rA && rA.edges || null;
      edgeDst = rB && rB.edges || null;
      if (rA || rB) {
        sizeCap = dict();
        var takeCap = function(m) {
          Object.keys(m).forEach(function(id) {
            var v = m[id];
            if (sizeCap && (sizeCap[id] === void 0 || v > sizeCap[id])) sizeCap[id] = v;
          });
        };
        if (rA) takeCap(rA.sizes);
        if (rB) takeCap(rB.sizes);
      }
      var pairUp = function(src, dst) {
        if (!src && !dst) return null;
        var ids = [];
        var av = [];
        var bv = [];
        var seen = dict();
        var take = function(id) {
          if (seen[id] !== void 0) return;
          var x = src ? src[id] : void 0, y = dst ? dst[id] : void 0;
          if (x === void 0 && y === void 0) return;
          if (x === void 0) x = y;
          if (y === void 0) y = x;
          seen[id] = 1;
          ids.push(id);
          av.push(x);
          bv.push(y);
        };
        if (src) Object.keys(src).forEach(take);
        if (dst) Object.keys(dst).forEach(take);
        return { ids, a: av, b: bv, out: dict() };
      };
      cellPair = pairUp(cellSrc, cellDst);
      edgePair = pairUp(edgeSrc, edgeDst);
      posSrc = dict();
      graph.forEachNode(function(id) {
        posSrc[id] = { x: graph.getNodeAttribute(id, "x"), y: graph.getNodeAttribute(id, "y") };
      });
    })();
    var STALL_MS = 400;
    var watchdog = function() {
      if (cascadeRun && NOW() - cascadeRun.tick < STALL_MS) {
        cascadeRun.guard = WIN.setTimeout(watchdog, STALL_MS);
        return;
      }
      settle();
    };
    var msPerFrame = (opts.totalMs > 0 ? opts.totalMs : CASCADE_MS * TIME_SCALE) / Math.max(1, span);
    var MIN_FRAMES = 20;
    var maxAdv = Math.max(1, span) / MIN_FRAMES;
    var frame = 0, tPrev = NOW(), tailFrames = 0;
    (function() {
      var stretch = Math.max(1, span - FADE_FRAMES * TIME_SCALE);
      var radiusOf = function(id, out) {
        var pt = out ? posSrc[id] : finalPos[id];
        if (!pt) {
          var a0 = graph.getNodeAttributes(id);
          pt = { x: a0.x, y: a0.y };
        }
        return Math.hypot(pt.x, pt.y);
      };
      Object.keys(tglDir).forEach(function(g0) {
        var out = tglDir[g0] === "out";
        var set = (out ? outs : ins).filter(function(id) {
          return groupOf(id) === g0;
        });
        if (!set.length) return;
        set.sort(function(p, q) {
          var d = radiusOf(p, out) - radiusOf(q, out);
          return out ? d : -d;
        });
        if (out) {
          set.forEach(function(id, i) {
            delay[id] = set.length < 2 ? stretch : stretch * i / (set.length - 1);
          });
        } else {
          var base0 = set.map(function(id) {
            return delay[id] || 0;
          }).sort(function(x, y) {
            return x - y;
          });
          set.forEach(function(id, i) {
            delay[id] = base0[i];
          });
        }
      });
    })();
    cascadeRun = { raf: 0, tick: NOW(), guard: WIN.setTimeout(watchdog, STALL_MS), sizeCap };
    (function step() {
      var tn = NOW();
      var adv = (tn - tPrev) / msPerFrame;
      tPrev = tn;
      if (adv > maxAdv) adv = maxAdv;
      frame += adv;
      if (cascadeRun) cascadeRun.tick = tn;
      var pr = Math.min(1, frame / Math.max(1, span));
      var ease = pr * pr * (3 - 2 * pr);
      var busy = false;
      for (var i = 0; i < moving.length; i++) {
        var id = moving[i];
        if (isMove[id]) {
          if (moveFrom && moveFrom[id] !== void 0 && frame >= crossAt[id]) delete moveFrom[id];
          if (frame < arriveAt[id]) {
            var q1 = (frame - delay[id]) / (FADE_FRAMES * TIME_SCALE);
            q1 = q1 < 0 ? 0 : q1 > 1 ? 1 : q1;
            alpha[id] = (from[id] === void 0 ? 1 : from[id]) * (1 - q1 * q1 * (3 - 2 * q1));
          } else {
            var q2 = (frame - arriveAt[id]) / (FADE_FRAMES * TIME_SCALE);
            q2 = q2 < 0 ? 0 : q2 > 1 ? 1 : q2;
            alpha[id] = (to[id] === void 0 ? 1 : to[id]) * (q2 * q2 * (3 - 2 * q2));
          }
          if (frame < arriveAt[id] + FADE_FRAMES * TIME_SCALE) busy = true;
          continue;
        }
        var q = (frame - delay[id]) / (FADE_FRAMES * TIME_SCALE);
        q = q < 0 ? 0 : q > 1 ? 1 : q;
        alpha[id] = from[id] + (to[id] - from[id]) * (q * q * (3 - 2 * q));
        if (q < 1) busy = true;
      }
      if (opts.onFrame) opts.onFrame(pr);
      var rowsAt = function(c) {
        var s = rowsSrc[c.k], d = rowsDst[c.k];
        if (s === void 0 && d === void 0) return 0;
        var bk = c.inner ? "i" : "o";
        if (s === void 0) s = bandSrc[bk] !== void 0 ? bandSrc[bk] : d;
        if (d === void 0) d = bandDst[bk] !== void 0 ? bandDst[bk] : s;
        return s + (d - s) * ease;
      };
      var roomWalk = function(k) {
        var sv = roomSrcB[k], dv = roomDstB[k];
        if (!(sv > 1)) return dv;
        if (!(dv > 1)) return sv;
        return sv + (dv - sv) * ease;
      };
      var depthWalk = function(k) {
        var a2 = bandSrc[k], b2 = bandDst[k];
        if (a2 === void 0 && b2 === void 0) return 0;
        if (a2 === void 0) a2 = b2;
        if (b2 === void 0) b2 = a2;
        return a2 + (b2 - a2) * ease;
      };
      var thickAt = function(k) {
        var ds = bandSrc[k], dd = bandDst[k];
        if (ds === void 0 && dd === void 0) return 0;
        if (ds === void 0) ds = dd;
        if (dd === void 0) dd = ds;
        var ts = ds * spSrcB[k], td = dd * spDstB[k];
        return ts + (td - ts) * ease;
      };
      var spWalk = function(k) {
        var rows = depthWalk(k), T = thickAt(k);
        if (!(rows > 0) || !(T > 0)) return spSrcB[k] + (spDstB[k] - spSrcB[k]) * ease;
        return T / rows;
      };
      var spNow = {
        i: spWalk("i"),
        o: spWalk("o"),
        depth: { i: depthWalk("i"), o: depthWalk("o") }
      };
      roomNow = { i: roomWalk("i"), o: roomWalk("o") };
      colWalk = dict();
      Object.keys(tglDir).forEach(function(g0) {
        var fRamp = tglDir[g0] === "out" ? 1 - pr : pr;
        if (tglMv[g0]) {
          var mvEdge = Math.min(0.45, FADE_FRAMES * TIME_SCALE * 2 / Math.max(1, span));
          fRamp = tglDir[g0] === "out" ? Math.max(0, Math.min(1, (1 - mvEdge - pr) / (1 - mvEdge))) : Math.max(0, Math.min(1, (pr - mvEdge) / (0.55 - mvEdge)));
        }
        colWalk[g0] = { f: fRamp, n: tglN[g0] || 1 };
      });
      var walkPair = function(p) {
        if (!p) return null;
        var ids = p.ids, av = p.a, bv = p.b, out = p.out;
        for (var i2 = 0, n = ids.length; i2 < n; i2++) {
          out[ids[i2]] = av[i2] + (bv[i2] - av[i2]) * ease;
        }
        return out;
      };
      if (cellPair) cellNow = walkPair(cellPair);
      if (edgePair) edgeNow = walkPair(edgePair);
      var plan = buildWedgePlan(ovAfter, weightOf, rowsAt, spNow);
      traceTag("frame");
      var targets = plan ? ringsLayout(plan, true) : null;
      traceTag("");
      var ez = pr < 1 ? RADIAL_EASE : Math.min(1, RADIAL_EASE + tailFrames * 0.15);
      var resid = 0;
      if (targets) graph.forEachNode(function(id2) {
        var q3 = targets[id2];
        if (!q3) return;
        var h = Math.atan2(q3.y, q3.x);
        if ((alpha[id2] || 0) < 0.05) {
          graph.mergeNodeAttributes(id2, { x: q3.x, y: q3.y });
          return;
        }
        var x = graph.getNodeAttribute(id2, "x"), y = graph.getNodeAttribute(id2, "y");
        var rNow = Math.hypot(x, y), rWant = Math.hypot(q3.x, q3.y);
        var gap = rWant - rNow;
        if (gap < 0 ? -gap > resid : gap > resid) resid = gap < 0 ? -gap : gap;
        var r = rNow + gap * ez;
        graph.mergeNodeAttributes(id2, { x: r * Math.cos(h), y: r * Math.sin(h) });
      });
      posVer++;
      if (pr >= 1) tailFrames++;
      probeSample("cascade");
      lastCascade.frames++;
      lastCascade.ms = Math.round(NOW() - lastCascade.t0);
      renderer.refresh({ skipIndexation: true });
      if (probe) lastCascade.last = {
        adv: Math.round(adv * 1e3) / 1e3,
        frame: Math.round(frame * 100) / 100,
        span: Math.round(span * 100) / 100,
        pr: Math.round(pr * 1e3) / 1e3,
        busy,
        resid: Math.round(resid * 100) / 100,
        msPerFrame: Math.round(msPerFrame * 1e3) / 1e3,
        moving: moving.length,
        run: !!cascadeRun
      };
      if (busy || pr < 1 || resid > 0.5) cascadeRun.raf = WIN.requestAnimationFrame(step);
      else {
        lastCascade.exit = "converged";
        settle();
      }
    })();
  }
  var probe = null;
  function probeSample(tag) {
    if (!probe) return;
    var iMin = Infinity, iMax = 0, oMin = Infinity, oMax = 0, iN = 0, oN = 0;
    var prev = probe.prevAng;
    var now = dict();
    var prevR = probe.prevR;
    var nowR = dict();
    var tanStep = 0, tanId = null, tanOver = 0, tanSum = 0, tanN = 0;
    var radStep = 0, radId = null, radSum = 0, radN = 0;
    graph.forEachNode(function(id, a) {
      var r = Math.hypot(a.x, a.y);
      if (present(id)) {
        var th = Math.atan2(a.y, a.x);
        now[id] = th;
        nowR[id] = r;
        if (prevR && prevR[id] !== void 0) {
          var dr = Math.abs(r - prevR[id]);
          if (dr > radStep) {
            radStep = dr;
            radId = id;
          }
          radSum += dr;
          radN++;
        }
        if (prev && prev[id] !== void 0) {
          var d = th - prev[id];
          while (d > Math.PI) d -= 2 * Math.PI;
          while (d < -Math.PI) d += 2 * Math.PI;
          var moved = Math.abs(d) * r;
          if (moved > tanStep) {
            tanStep = moved;
            tanId = id;
          }
          if (moved > 160) tanOver++;
          tanSum += moved;
          tanN++;
        }
      }
      if (probe.set && !probe.set[id]) return;
      if (bandLock && bandLock[groupOf(id)]) {
        iN++;
        if (r < iMin) iMin = r;
        if (r > iMax) iMax = r;
      } else {
        oN++;
        if (r < oMin) oMin = r;
        if (r > oMax) oMax = r;
      }
    });
    probe.prevAng = now;
    probe.prevR = nowR;
    if (probe.watch) probe.watchSeries.push(probe.watched || null);
    probe.samples.push({
      tag,
      ms: Math.round(NOW() - probe.t0),
      gapI: lastGapN.i,
      gapO: lastGapN.o,
      ngI: bandOf("i").nG,
      ngO: bandOf("o").nG,
      gapDegI: bandOf("i").gapDeg,
      gapDegO: bandOf("o").gapDeg,
      radStep: Math.round(radStep),
      radId,
      radMean: Math.round(radN ? radSum / radN : 0),
      tanStep: Math.round(tanStep),
      tanId,
      tanOver,
      tanMean: Math.round(tanN ? tanSum / tanN : 0),
      starts: lastStart,
      arcs: lastArc,
      bands: lastBand,
      innerN: iN,
      innerMin: Math.round(iMin === Infinity ? 0 : iMin),
      innerMax: Math.round(iMax),
      outerN: oN,
      outerMin: Math.round(oMin === Infinity ? 0 : oMin),
      outerMax: Math.round(oMax)
    });
  }
  var anim = null;
  var animGuard = null;
  function assignPositions(targets) {
    graph.forEachNode(function(id) {
      var t = targets[id];
      if (t) graph.mergeNodeAttributes(id, { x: t.x, y: t.y });
    });
    posVer++;
  }
  function animateTo(targets, done) {
    if (anim) {
      WIN.cancelAnimationFrame(anim);
      anim = null;
    }
    if (animGuard) WIN.clearTimeout(animGuard);
    var polar = state.layout === "rings";
    var from = {};
    graph.forEachNode(function(id, a) {
      var t = targets[id] || { x: a.x, y: a.y };
      if (!polar) {
        from[id] = { x: a.x, y: a.y, tx: t.x, ty: t.y };
        return;
      }
      var r0_ = Math.hypot(a.x, a.y), r1_ = Math.hypot(t.x, t.y);
      var h0 = Math.atan2(a.y, a.x), h1 = Math.atan2(t.y, t.x);
      var d = h1 - h0;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      from[id] = { r: r0_, h: h0, dr: r1_ - r0_, dh: d };
    });
    var settle = function() {
      if (anim) {
        WIN.cancelAnimationFrame(anim);
        anim = null;
      }
      if (animGuard) {
        WIN.clearTimeout(animGuard);
        animGuard = null;
      }
      assignPositions(targets);
      renderer.refresh({ skipIndexation: false });
      if (done) done();
    };
    var dur = TWEEN_MS * TIME_SCALE;
    var lastFrame = NOW();
    var TWEEN_STALL = 400;
    var tweenDog = function() {
      if (anim && NOW() - lastFrame < TWEEN_STALL) {
        animGuard = WIN.setTimeout(tweenDog, TWEEN_STALL);
        return;
      }
      settle();
    };
    animGuard = WIN.setTimeout(tweenDog, TWEEN_STALL);
    var MIN_FRAMES = 20;
    var p = 0, tPrev = NOW();
    (function step() {
      var tn = NOW();
      lastFrame = tn;
      var adv = (tn - tPrev) / dur;
      tPrev = tn;
      if (adv > 1 / MIN_FRAMES) adv = 1 / MIN_FRAMES;
      p = Math.min(1, p + adv);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      graph.forEachNode(function(id) {
        var f = from[id];
        if (!f) return;
        if (polar) {
          var r = f.r + f.dr * e, h = f.h + f.dh * e;
          graph.mergeNodeAttributes(id, { x: r * Math.cos(h), y: r * Math.sin(h) });
        } else {
          graph.mergeNodeAttributes(id, {
            x: f.x + (f.tx - f.x) * e,
            y: f.y + (f.ty - f.y) * e
          });
        }
      });
      posVer++;
      probeSample("tween");
      renderer.refresh({ skipIndexation: false });
      if (p < 1) {
        anim = WIN.requestAnimationFrame(step);
      } else {
        settle();
      }
    })();
  }
  function applyLayout(animate, done) {
    traceTag("rest");
    var targets = ringsLayout();
    traceTag("");
    if (!targets) {
      if (done) done();
      return;
    }
    if (animate) animateTo(targets, done);
    else {
      assignPositions(targets);
      renderer.refresh({ skipIndexation: false });
      if (done) done();
    }
  }
  var renderer;
  var neighbourCache = null;
  function neighboursOf(id) {
    if (!neighbourCache) neighbourCache = {};
    if (!neighbourCache[id]) {
      neighbourCache[id] = (adj[id] || []).map(function(e) {
        return e.o;
      });
    }
    return neighbourCache[id];
  }
  var lazyShown = null;
  var lazyAdded = [];
  function syncLazyEdges() {
    if (!lazyEdges) return;
    var want = state.hovered || state.selected || null;
    if (want === lazyShown) return;
    lazyAdded.forEach(function(pr) {
      if (graph.hasEdge(pr[0], pr[1])) graph.dropEdge(pr[0], pr[1]);
    });
    lazyAdded = [];
    if (want) (adj[want] || []).forEach(function(e) {
      if (!graph.hasEdge(want, e.o)) {
        graph.addUndirectedEdge(want, e.o, edgeAttrsOf(e.w));
        lazyAdded.push([want, e.o]);
      }
    });
    lazyShown = want;
  }
  function pathKey(a, k) {
    var d = a.dirs;
    if (!d || !d.length) return a.folder + "/";
    if (!(k >= 1)) return a.folder + "/" + d.slice(0, k).join("/");
    var out = a.folder + "/" + d[0];
    for (var i = 1; i < k && i < d.length; i++) out += "/" + d[i];
    return out;
  }
  function visible(id) {
    var a = graph.getNodeAttributes(id);
    if (isHidden(groupOf(id))) return false;
    if (state.dim === "folder") {
      var d = a.dirs || [];
      if (!d.length) {
        if (state.hiddenSub[a.folder + "/"]) return false;
      } else {
        var key = a.folder + "/" + d[0];
        if (state.hiddenSub[key]) return false;
        for (var k = 1; k < d.length; k++) {
          key += "/" + d[k];
          if (state.hiddenSub[key]) return false;
        }
      }
    }
    return true;
  }
  var HOVER_MS = 150;
  var HOVER_GROW = 0.45;
  var hoverT = 0, hoverAim = 0, hoverRaf = 0, hoverPrev = 0;
  var mixCache = dict();
  function mixHex(from, to, t) {
    if (t <= 0) return from;
    if (t >= 1) return to;
    var key = from + to + t.toFixed(2);
    var hit = mixCache[key];
    if (hit) return hit;
    var a = toRgb(from), b = toRgb(to), out = "#";
    for (var i = 0; i < 3; i++) {
      var v = Math.round(a[i] + (b[i] - a[i]) * t).toString(16);
      out += v.length < 2 ? "0" + v : v;
    }
    return mixCache[key] = out;
  }
  function hoverAmount() {
    return state.hovered && state.hovered !== state.selected ? hoverT : 1;
  }
  function hoverTo(aim) {
    hoverAim = aim;
    if (hoverRaf) return;
    hoverPrev = NOW();
    (function step() {
      var now = NOW(), dt = now - hoverPrev;
      hoverPrev = now;
      var adv = Math.min(dt, HOVER_MS) / (HOVER_MS * TIME_SCALE);
      hoverT += hoverAim > hoverT ? adv : -adv;
      if (hoverT > 1) hoverT = 1;
      if (hoverT < 0) hoverT = 0;
      var landed = hoverT === hoverAim;
      if (landed && hoverT === 0) {
        state.hovered = null;
        syncLazyEdges();
      }
      renderer.refresh({ skipIndexation: true });
      if (landed) {
        hoverRaf = 0;
        return;
      }
      hoverRaf = WIN.requestAnimationFrame(step);
    })();
  }
  var hl = dict();
  var hlRaf = 0, hlPrev = 0, hlSig = "";
  var HL_GROW = 0.2;
  function hlSignature() {
    return Object.keys(state.highlight).join(",") + "|" + Object.keys(state.highlightSub).join(",") + "|" + (state.markDay || "") + "|" + (state.hoverDay || "") + "|" + (state.hoverGroup || "") + "|" + Object.keys(state.hoverSub).join(",") + "|" + (state.hoverYear || "");
  }
  function hlWalk() {
    if (hlRaf) return;
    hlPrev = NOW();
    (function step() {
      var now = NOW(), dt = now - hlPrev;
      hlPrev = now;
      var adv = Math.min(dt, TWEEN_MS) / (TWEEN_MS * TIME_SCALE);
      var moving = false;
      graph.forEachNode(function(id) {
        var aim = isHighlighted(id) ? 1 : 0, v = hl[id] || 0;
        if (v === aim) return;
        v += aim > v ? adv : -adv;
        if (v > 1) v = 1;
        if (v < 0) v = 0;
        hl[id] = v;
        if (v !== aim) moving = true;
      });
      renderer.refresh({ skipIndexation: true });
      if (!moving) {
        hlRaf = 0;
        return;
      }
      hlRaf = WIN.requestAnimationFrame(step);
    })();
  }
  function hlSync() {
    var sig = hlSignature();
    if (sig === hlSig) return;
    hlSig = sig;
    hlWalk();
  }
  var focusSetCache = { key: void 0, set: null };
  function focusSet() {
    var f = state.hovered || state.selected;
    if (focusSetCache.key === f) return focusSetCache.set;
    var set = null;
    if (f) {
      set = dict();
      set[f] = true;
      neighboursOf(f).forEach(function(n) {
        set[n] = true;
      });
    }
    focusSetCache.key = f;
    focusSetCache.set = set;
    return set;
  }
  function edgeCurveGeom(e, s, t) {
    var ed = renderer.getEdgeDisplayData(e);
    if (!ed || ed.hidden) return null;
    var ps = renderer.graphToViewport(graph.getNodeAttributes(s));
    var pt = renderer.graphToViewport(graph.getNodeAttributes(t));
    var dx = pt.x - ps.x, dy = pt.y - ps.y, k = ed.type === "curve" ? ed.curvature || 0 : 0;
    return { ed, ps, pt, k, cp: { x: (ps.x + pt.x) / 2 + dy * k, y: (ps.y + pt.y) / 2 - dx * k } };
  }
  function drawFocusWeb(ctx, data2) {
    var f = state.hovered || state.selected;
    if (!f || data2.key !== f || state.query) return;
    var ht = hoverAmount();
    if (ht <= 0) return;
    var set = focusSet();
    var seen = dict();
    ctx.save();
    ctx.globalAlpha = ht;
    ctx.lineCap = "round";
    Object.keys(set).forEach(function(n) {
      graph.forEachEdge(n, function(e, attrs, s, t) {
        if (seen[e]) return;
        seen[e] = true;
        if (!set[s] || !set[t]) return;
        var geo = edgeCurveGeom(e, s, t);
        if (!geo) return;
        ctx.beginPath();
        ctx.moveTo(geo.ps.x, geo.ps.y);
        if (geo.k) ctx.quadraticCurveTo(geo.cp.x, geo.cp.y, geo.pt.x, geo.pt.y);
        else ctx.lineTo(geo.pt.x, geo.pt.y);
        ctx.lineWidth = edgePx(geo.ed.size);
        ctx.strokeStyle = geo.ed.color;
        ctx.stroke();
      });
    });
    Object.keys(set).forEach(function(n) {
      if (n === f) return;
      var nd = renderer.getNodeDisplayData(n);
      if (!nd || nd.hidden || nd.type === "halo") return;
      var p = renderer.graphToViewport(graph.getNodeAttributes(n));
      ctx.beginPath();
      ctx.arc(p.x, p.y, renderer.scaleSize(nd.size), 0, 2 * Math.PI);
      ctx.fillStyle = nd.color;
      ctx.fill();
    });
    ctx.restore();
  }
  function drawHover(ctx, data2, settings) {
    drawFocusWeb(ctx, data2);
    if (typeof data2.label !== "string" || !data2.label) return;
    var n = settings.labelSize;
    ctx.font = settings.labelWeight + " " + n + "px " + settings.labelFont;
    var w = ctx.measureText(data2.label).width;
    var x0 = data2.x + data2.size, x1 = x0 + w + 9;
    var h = n + 9, y0 = data2.y - h / 2, y1 = data2.y + h / 2, r = 5;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.closePath();
    ctx.fillStyle = THEME.hoverBg;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = THEME.hoverBorder;
    ctx.stroke();
    ctx.fillStyle = THEME.text;
    ctx.fillText(data2.label, data2.x + data2.size + 5, data2.y + n / 3);
  }
  function nodeStyle(id, a) {
    var r = (
      /** @type {NodeDisplayData & { haloColor?: string }} */
      Object.assign({}, a)
    );
    r.color = nodeColor(id);
    var hv = hl[id] || 0;
    if (state.markDay && graph.getNodeAttribute(id, "created") === state.markDay) {
      r.color = mixHex(r.color, THEME.today, hv);
      r.zIndex = 3;
    }
    if (hv > 4e-3) {
      r.type = "halo";
      r.haloColor = mixHex(nodeColor(id), THEME.today, hv);
      r.size = (r.size || a.size) * (1 + (0.3 + HL_GROW) * hv);
      r.zIndex = 4;
    }
    if (state.query) {
      if (a.label.toLowerCase().indexOf(state.query) < 0) {
        r.color = THEME.dim;
        r.label = "";
        r.zIndex = 0;
        return r;
      }
      r.zIndex = 2;
      r.highlighted = true;
      r.forceLabel = true;
      return r;
    }
    var focusNode = state.hovered || state.selected;
    var focus = focusSet();
    var ht = hoverAmount();
    if (focus && !focus[id]) {
      r.color = mixHex(r.color || nodeColor(id), THEME.dim, ht);
      r.label = "";
      r.zIndex = 0;
      return r;
    }
    if (focus) r.zIndex = 2;
    if (id === focusNode) {
      r.size = (r.size || a.size) * (1 + HOVER_GROW * ht);
      if (ht > 0.5) {
        r.highlighted = true;
        r.forceLabel = true;
      }
      return r;
    }
    r.label = "";
    return r;
  }
  var LOGO_OF_HOLE = 0.5;
  var LOGO_PX = 128;
  var RING_BUCKETS = 144;
  var LOGO_BLEND_BUCKETS = 5;
  var CORE_SOLID = 9, CORE_FADE = 34;
  var lastGradient = "", lastGradientInner = "";
  var logoMaskReady = false;
  var logoMaskImg = null;
  var LOGO_INNER_FADE = "16%, 40%";
  function ringColors() {
    var o = bandColors(false), i = bandColors(true);
    if (!o) return i || /** @type {string[]} */
    new Array(RING_BUCKETS);
    if (!i) return o;
    var t = outerPresence();
    if (t >= 0.999) return o;
    if (t <= 1e-3) return i;
    return mixColorArrays(i, o, t);
  }
  var BAND_HANDOVER = 0.5;
  function outerPresence() {
    var s = 0, n = 0;
    graph.forEachNode(function(id) {
      if (bandLock && bandLock[groupOf(id)]) return;
      n++;
      s += alpha[id] || 0;
    });
    if (!n) return 0;
    var t = Math.max(0, Math.min(1, s / n / BAND_HANDOVER));
    return t * t * (3 - 2 * t);
  }
  function mixColorArrays(a, b, t) {
    var out = new Array(RING_BUCKETS);
    for (var i = 0; i < RING_BUCKETS; i++) {
      var x = toRgb(a[i] || "#888"), y = toRgb(b[i] || "#888");
      out[i] = "rgb(" + Math.round(x[0] + (y[0] - x[0]) * t) + "," + Math.round(x[1] + (y[1] - x[1]) * t) + "," + Math.round(x[2] + (y[2] - x[2]) * t) + ")";
    }
    return out;
  }
  function bandColors(wantInner) {
    var col = new Array(RING_BUCKETS);
    var rad = new Array(RING_BUCKETS);
    var any = false;
    graph.forEachNode(function(id, a) {
      if (!present(id)) return;
      if ((bandLock ? !!bandLock[groupOf(id)] : false) !== wantInner) return;
      if (isPinned(id)) return;
      var r = Math.hypot(a.x, a.y);
      if (!(r > 1e-6)) return;
      var k = Math.floor(angleSweep(Math.atan2(a.y, a.x)) / (2 * Math.PI) * RING_BUCKETS);
      k = (k % RING_BUCKETS + RING_BUCKETS) % RING_BUCKETS;
      if (rad[k] === void 0 || r > rad[k]) {
        rad[k] = r;
        col[k] = nodeColor(id);
        any = true;
      }
    });
    if (!any) return null;
    var first = -1;
    for (var i = 0; i < RING_BUCKETS; i++) if (col[i]) {
      first = i;
      break;
    }
    var carry = col[first];
    for (var n = 0; n < RING_BUCKETS; n++) {
      var j = (first + n) % RING_BUCKETS;
      if (col[j]) carry = col[j];
      else col[j] = carry;
    }
    return col;
  }
  function ringColorsSmooth(src) {
    var col = src || ringColors();
    if (!col || !col[0]) return col || /** @type {string[]} */
    new Array(RING_BUCKETS);
    var n = RING_BUCKETS, w = LOGO_BLEND_BUCKETS;
    var out = new Array(n);
    for (var i = 0; i < n; i++) {
      var r = 0, g = 0, b = 0, k = 0;
      for (var d = -w; d <= w; d++) {
        var c = toRgb(col[((i + d) % n + n) % n]);
        r += c[0];
        g += c[1];
        b += c[2];
        k++;
      }
      out[i] = "rgb(" + Math.round(r / k) + "," + Math.round(g / k) + "," + Math.round(b / k) + ")";
    }
    return out;
  }
  function ringGradient(src) {
    var col = ringColorsSmooth(src);
    if (!col || !col[0]) return "";
    var step = 360 / RING_BUCKETS, stops = [];
    for (var i = 0; i < RING_BUCKETS; i++) {
      var prev = col[(i - 1 + RING_BUCKETS) % RING_BUCKETS];
      var next = col[(i + 1) % RING_BUCKETS];
      if (col[i] === prev && col[i] === next) continue;
      stops.push(col[i] + " " + ((i + 0.5) * step).toFixed(2) + "deg");
    }
    var seam = function() {
      var a = toRgb(col[RING_BUCKETS - 1]), b = toRgb(col[0]);
      return "rgb(" + Math.round((a[0] + b[0]) / 2) + "," + Math.round((a[1] + b[1]) / 2) + "," + Math.round((a[2] + b[2]) / 2) + ")";
    }();
    stops.unshift(seam + " 0deg");
    stops.push(seam + " 360deg");
    var conic = "conic-gradient(from 0deg at 50% 50%, " + stops.join(", ") + ")";
    var m = [0, 0, 0], k = 0;
    for (var q = 0; q < RING_BUCKETS; q++) {
      var c = toRgb(col[q]);
      m[0] += c[0];
      m[1] += c[1];
      m[2] += c[2];
      k++;
    }
    k = Math.max(1, k);
    var mean = "rgba(" + Math.round(m[0] / k) + "," + Math.round(m[1] / k) + "," + Math.round(m[2] / k) + ",";
    var core = "radial-gradient(circle at 50% 50%, " + mean + "1) 0%, " + mean + "0.92) " + CORE_SOLID + "%, " + mean + "0) " + CORE_FADE + "%)";
    return core + ", " + conic;
  }
  function placeLogo() {
    var el = $("logo");
    if (!el || !logoMaskReady || !renderer || !geomLock) return;
    var yielded = pinnedIds().length > 0;
    el.style.opacity = yielded ? "0" : "";
    var two = state.logoTwoRing;
    var g = ringGradient();
    var inner = two ? bandColors(true) : null;
    var gi = two && inner ? ringGradient(inner) : "";
    if (g && g !== lastGradient) {
      lastGradient = g;
      el.style.background = g;
    }
    var eli = $("logoInner");
    if (eli) {
      if (gi) {
        if (gi !== lastGradientInner) {
          lastGradientInner = gi;
          eli.style.background = gi;
        }
      } else if (lastGradientInner) {
        lastGradientInner = "";
      }
      eli.hidden = !gi;
      eli.style.opacity = yielded ? "0" : "";
    }
    var c = renderer.graphToViewport({ x: 0, y: 0 });
    var edge = renderer.graphToViewport({ x: geomLock.r0 * INNER_SCALE * UNIT, y: 0 });
    var holePx = Math.hypot(edge.x - c.x, edge.y - c.y);
    var size = Math.max(24, Math.min(LOGO_PX, holePx * 2 * LOGO_OF_HOLE));
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = c.x + "px";
    el.style.top = c.y + "px";
    el.hidden = false;
    if (eli && gi) {
      eli.style.width = size + "px";
      eli.style.height = size + "px";
      eli.style.left = c.x + "px";
      eli.style.top = c.y + "px";
    }
  }
  var DOT_OF_PITCH = 11 / 28;
  var DOT_MIN_PX = 1.5;
  var DOT_MAX_SPREAD = DENSITY_MAX;
  var DOT_ROOM_MAX = DENSITY_MAX;
  var sizeScale = 1;
  function measureSizeScale() {
    if (!renderer) return sizeScale;
    var a = renderer.graphToViewport({ x: 0, y: 0 });
    var b = renderer.graphToViewport({ x: UNIT * (bandOf("o").sp || 1), y: 0 });
    var pitch = Math.hypot(b.x - a.x, b.y - a.y);
    if (!(pitch > 0)) return sizeScale;
    var cam = renderer.getCamera().getState().ratio || 1;
    pitch *= cam;
    var rampFor = function(units) {
      var bb = renderer.graphToViewport({ x: units, y: 0 });
      var pit = Math.hypot(bb.x - a.x, bb.y - a.y) * cam;
      var hi = DOT_OF_PITCH * pit;
      var hiCap = DOT_OF_PITCH * UNIT * DOT_MAX_SPREAD * cam;
      if (hi > hiCap) hi = hiCap;
      var lo = Math.min(hi, DOT_MIN_PX * cam);
      return {
        m: (hi - lo) / Math.max(1e-6, NODE_MAX - NODE_MIN),
        b: lo - (hi - lo) / Math.max(1e-6, NODE_MAX - NODE_MIN) * NODE_MIN,
        lo,
        hi
      };
    };
    var ro = rampFor(UNIT * (bandOf("o").sp || 1) * bandScale("o"));
    var ri = rampFor(UNIT * (bandOf("i").sp || 1) * bandScale("i"));
    bandOf("o").ramp = ro;
    bandOf("i").ramp = ri;
    return ro.hi / NODE_MAX;
  }
  function dotWhy(size, id) {
    var isIn = !!bandLock && !!bandLock[groupOf(id)];
    var bk = isIn ? "i" : "o";
    var rp = bandOf(bk).ramp;
    var cwd = colWalk ? colWalk[groupOf(id)] : void 0;
    return {
      id,
      band: bk,
      size,
      ramp: { m: rp.m, b: rp.b, lo: rp.lo },
      rampV: rp.m * (size || 4) + rp.b,
      bandRoom: bandOf(bk).room,
      cellRoom: cellRoom[id],
      colWalk: cwd ? cwd.f : null,
      pitch: pitchUnits(bk),
      edgeCap: edgeCap[id],
      hubRow0: !!hubRow0[id],
      walking: { room: !!roomNow, cell: !!cellNow, edge: !!edgeNow },
      out: dotPx(size, id)
    };
  }
  function dotPx(size, id) {
    var isIn = id !== void 0 && bandLock && !!bandLock[groupOf(id)];
    var rp = bandOf(isIn ? "i" : "o").ramp;
    var v = rp.m * (size || 4) + rp.b;
    var scale2 = 1;
    if (id !== void 0) {
      var room = bandOf(isIn ? "i" : "o").room;
      var mine = cellRoom[id];
      if (colWalk) {
        var cwd = colWalk[groupOf(id)];
        if (cwd !== void 0) mine = (mine === void 0 ? room : mine) * cwd.f;
      }
      if (mine !== void 0 && mine > 1 && (!(room > 1) || mine < room)) room = mine;
      if (room !== void 0) room *= 0.92;
      var pit = pitchUnits(isIn ? "i" : "o");
      if (room !== void 0 && pit > 1e-9) {
        var f = room / pit;
        if (f > DOT_ROOM_MAX) f = DOT_ROOM_MAX;
        v *= f;
        scale2 = f;
      }
    }
    var lo = (rp.lo || DOT_MIN_PX) * scale2;
    if (v < lo) v = lo;
    var capU = edgeCap[id];
    if (capU !== void 0 && capU > 0) {
      var pitU = pitchUnits(isIn ? "i" : "o");
      var hiU = DOT_OF_PITCH * pitU;
      if (hiU > 1e-6) {
        var capV = rp.m * NODE_MAX + rp.b;
        var vMax = capV * (capU / hiU);
        if (v > vMax) v = vMax;
      }
    }
    if (fitCap && id !== void 0) {
      if (fitVer !== posVer) measureFit();
      var nnU = fitNow ? fitNow[id] : void 0;
      if (nnU !== void 0 && nnU > 0) {
        var pitF = pitchUnits(isIn ? "i" : "o");
        var hiF = DOT_OF_PITCH * pitF;
        if (hiF > 1e-6) {
          var fitV = (rp.m * NODE_MAX + rp.b) * (FIT_SHARE * nnU / hiF);
          if (v > fitV) v = fitV;
        }
      }
    }
    if (isIn && geomLock && hubRow0[id]) {
      var hubU = HUB_ROW0_FRAC * geomLock.r0 * INNER_SCALE * UNIT;
      var pitH = pitchUnits("i");
      var hiH = DOT_OF_PITCH * pitH;
      if (hiH > 1e-6) {
        var hubCapV = rp.m * NODE_MAX + rp.b;
        var hubVMax = hubCapV * (hubU / hiH);
        if (v > hubVMax) v = hubVMax;
      }
    }
    if (id !== void 0 && cascadeRun && cascadeRun.sizeCap) {
      var scap = cascadeRun.sizeCap[id];
      if (scap !== void 0 && v > scap) v = scap;
    }
    return v;
  }
  function syncSizeScale() {
    var next = measureSizeScale();
    if (Math.abs(next - sizeScale) < 0.01) return false;
    sizeScale = next;
    return true;
  }
  function refreshSizeScale() {
    if (syncSizeScale() && renderer) renderer.refresh();
  }
  var EDGE_MAX_PX = 4;
  var edgeMult = 1;
  function measureEdgeMult() {
    if (!renderer) return 1;
    var ratio = renderer.getCamera().getState().ratio || 1;
    var k = EDGE_MAX_PX * ratio / EDGE_SIZE_MAX;
    return k < 1 ? k : 1;
  }
  function syncEdgeMult() {
    var next = measureEdgeMult();
    if (Math.abs(next - edgeMult) < 2e-3) return false;
    edgeMult = next;
    return true;
  }
  function capEdge(r, a) {
    if (edgeMult < 1) r.size = (r.size === void 0 ? a.size || 1 : r.size) * edgeMult;
    return r;
  }
  function edgePx(size) {
    if (!renderer) return 0;
    return Math.max(renderer.getSetting("minEdgeThickness"), renderer.scaleSize(size || 1));
  }
  var CURVE_MIN = 0.05, CURVE_MAX = 0.55;
  function discR() {
    return geomLock && geomLock.maxR ? geomLock.maxR * UNIT : 1;
  }
  function curvatureFor(s, t) {
    var dx = t.x - s.x, dy = t.y - s.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (!len) return CURVE_MIN;
    var h = Math.abs(s.x * t.y - s.y * t.x) / len;
    var near = 1 - Math.min(1, h / (discR() * 0.5));
    var mag = CURVE_MIN + (CURVE_MAX - CURVE_MIN) * near * near;
    var out = -dy / len * (s.x + t.x) / 2 + dx / len * (s.y + t.y) / 2;
    return out >= 0 ? mag : -mag;
  }
  function makeRenderer() {
    renderer = new RendererCls(graph, $("graph"), {
      win: WIN,
      labelFont: 'ui-sans-serif, "Segoe UI", system-ui, sans-serif',
      labelSize: 11,
      labelWeight: "500",
      labelColor: THEME.text,
      drawHover,
      // github#58
      minCameraRatio: 0.02,
      maxCameraRatio: 12,
      enableCameraPanning: panEnabled,
      zoomingRatio: 1.2,
      zoomDuration: 120,
      // github#42, github#39
      // github#43
      minEdgeThickness: 1,
      /** @param {string} id @param {NodeAttrs} a */
      nodeReducer: function(id, a) {
        var al = alpha[id] || 0;
        if (al <= 4e-3) {
          var h = (
            /** @type {NodeDisplayData} */
            Object.assign({}, a)
          );
          h.hidden = true;
          return h;
        }
        var r = nodeStyle(id, a);
        if (al < 0.999) {
          r.color = withAlpha(r.color, al);
          r.size = (r.size || a.size) * (0.45 + 0.55 * al);
          if (al < 0.62) {
            r.label = "";
            r.forceLabel = false;
            r.highlighted = false;
          }
        }
        if (colWalk) {
          var cwr = colWalk[groupOf(id)];
          if (cwr !== void 0) {
            r.size = Math.max(0.05, (r.size === void 0 ? base : r.size) * cwr.f);
          }
        }
        var base = a.size || 4;
        r.size = dotPx(base, id) * ((r.size === void 0 ? base : r.size) / base);
        if (isPinned(id)) {
          r.size = (r.size || a.size) * hubSizeMult();
          r.zIndex = 3;
        }
        return r;
      },
      /** @param {string} id @param {EdgeAttrs & Partial<EdgeDisplayData>} a */
      edgeReducer: function(id, a) {
        var r = (
          /** @type {EdgeAttrs & Partial<EdgeDisplayData>} */
          Object.assign({}, a)
        );
        var x = graph.extremities(id);
        var al = Math.min(alpha[x[0]] || 0, alpha[x[1]] || 0);
        if (al <= 4e-3) {
          r.hidden = true;
          return r;
        }
        if (state.curveEdges) {
          r.type = "curve";
          r.curvature = curvatureFor(
            graph.getNodeAttributes(x[0]),
            graph.getNodeAttributes(x[1])
          );
        }
        r.color = THEME.edge;
        var focus = focusSet();
        if (state.query) {
          r.color = THEME.dim;
          return capEdge(r, a);
        }
        if (focus) {
          var ht = hoverAmount(), base = a.size || 1;
          if (focus[x[0]] && focus[x[1]]) {
            r.color = mixHex(THEME.edge, THEME.edgeHi, ht);
            r.size = base + (EDGE_SIZE_LIT - base) * ht;
            r.zIndex = 2;
          } else {
            r.color = mixHex(THEME.edge, THEME.dim, ht);
            r.zIndex = 0;
          }
        }
        if (al < 0.999) r.color = withAlpha(r.color, al * al);
        return capEdge(r, a);
      }
    });
    (function() {
      var cam = renderer.getCamera();
      var edgeRaf = 0;
      if (syncEdgeMult()) renderer.refresh({ skipIndexation: true });
      cam.on("updated", function() {
        if (!fitting) camAtRest = false;
        placeLogo();
        refreshSizeScale();
        if (edgeRaf) return;
        edgeRaf = WIN.requestAnimationFrame(function() {
          edgeRaf = 0;
          if (syncEdgeMult() && renderer) renderer.refresh({ skipIndexation: true });
        });
      });
    })();
    var rzTimer = null;
    var onResize = function() {
      if (dead) return;
      if (rzTimer) WIN.clearTimeout(rzTimer);
      rzTimer = WIN.setTimeout(function() {
        rzTimer = null;
        refreshSizeScale();
        placeLogo();
      }, 120);
    };
    if (window.ResizeObserver) {
      var rootRO = new ResizeObserver(onResize);
      rootRO.observe(root);
      onDestroy.push(function() {
        rootRO.disconnect();
      });
    } else {
      window.addEventListener("resize", onResize);
      onDestroy.push(function() {
        window.removeEventListener("resize", onResize);
      });
    }
    onDestroy.push(function() {
      if (rzTimer) {
        WIN.clearTimeout(rzTimer);
        rzTimer = null;
      }
    });
    renderer.on("afterRender", function() {
      if (DBG.on) drawWedgeDebug();
      placeLogo();
      refreshSizeScale();
      heatDraw();
      hlSync();
      placeHubDrop();
    });
    renderer.on("enterNode", function(e) {
      state.hovered = e.node;
      syncLazyEdges();
      showTip(e.node);
      hoverTo(1);
    });
    renderer.on("leaveNode", function() {
      hideTip();
      hoverTo(0);
    });
    renderer.on("clickNode", function(e) {
      if (dragJustMoved === e.node) {
        dragJustMoved = null;
        return;
      }
      select(e.node);
    });
    renderer.on("clickStage", function() {
      select(null);
    });
    renderer.on("rightClickNode", function(e) {
      if (e.event && e.event.original) e.event.original.preventDefault();
      togglePin(e.node);
    });
    bindNodeDrag();
    var onDoubleClick = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      fit();
    };
    renderer.on("doubleClickStage", onDoubleClick);
    renderer.on("doubleClickNode", onDoubleClick);
    if (wantWedgeDebug()) wedgeDebug(true);
  }
  function showTip(id) {
    var a = graph.getNodeAttributes(id), t = $("tip");
    var p = renderer.graphToViewport({ x: a.x, y: a.y });
    setHTML(t, '<div class="t">' + esc(a.label) + '</div><div class="m">' + esc(groupOf(id)) + " &middot; " + a.deg + " link" + (a.deg === 1 ? "" : "s") + "<br>" + esc(a.ntype) + " &middot; " + esc(a.folder) + (a.sub ? " / " + esc(a.sub) : "") + "</div>");
    t.hidden = false;
    var box = t.getBoundingClientRect(), st = $("canvas").getBoundingClientRect();
    var x = Math.min(p.x + 14, st.width - box.width - 8);
    var y = Math.min(Math.max(p.y - box.height - 10, 8), st.height - box.height - 8);
    t.style.left = x + "px";
    t.style.top = y + "px";
  }
  function hideTip() {
    $("tip").hidden = true;
  }
  function select(id) {
    state.selected = id;
    syncLazyEdges();
    var d = $("detail");
    if (!id) {
      d.hidden = true;
      renderer.refresh();
      return;
    }
    var a = graph.getNodeAttributes(id);
    var nb = neighboursOf(id).slice().sort(function(p, q) {
      return graph.getNodeAttribute(q, "deg") - graph.getNodeAttribute(p, "deg");
    });
    var vault = encodeURIComponent(DATA.vault);
    var file = encodeURIComponent(a.path.replace(/\.md$/, ""));
    var h = '<button class="x" title="Close">&times;</button><h2>' + esc(a.label) + '</h2><div class="meta"><span><b style="color:' + colorOf(groupOf(id)) + '">&#9632;</b> ' + esc(groupOf(id)) + "</span><span>" + a.deg + " link" + (a.deg === 1 ? "" : "s") + "</span>" + (a.words ? "<span>" + a.words + " words</span>" : "") + (a.created ? "<span>" + esc(a.created) + "</span>" : "") + "</div><div>" + (a.tags || []).slice(0, 8).map(function(t) {
      return '<span class="chip">#' + esc(t) + "</span>";
    }).join("") + '</div><div class="chip" style="border-style:dashed">' + esc(a.folder) + (a.sub ? " / " + esc(a.sub) : "") + " / " + esc(a.ntype) + '</div><div class="actions">' + (a.ghost ? "" : '<a class="open" href="obsidian://open?vault=' + vault + "&file=" + file + '">Open in Obsidian</a>') + '<button class="btn pin" data-pin="' + id + '" aria-pressed="' + isPinned(id) + '" title="' + (isPinned(id) ? "Unpin from hub" : "Pin to hub") + '">' + pinSvg(isPinned(id)) + " Pin to hub</button></div>";
    if (nb.length) {
      h += '<div class="nb">Linked notes (' + nb.length + ")</div><ul>" + nb.slice(0, 40).map(function(n) {
        return '<li><button data-go="' + n + '">' + esc(graph.getNodeAttribute(n, "label")) + ' <span style="color:var(--text-3)">' + graph.getNodeAttribute(n, "deg") + "</span></button></li>";
      }).join("") + "</ul>";
    } else {
      h += '<div class="nb">No links</div>';
    }
    setHTML(d, h);
    d.hidden = false;
    d.querySelector(".x").onclick = function() {
      select(null);
    };
    d.querySelector(".pin").onclick = function() {
      togglePin(id);
      select(id);
    };
    Array.prototype.forEach.call(
      d.querySelectorAll("[data-go]"),
      /** @param {HTMLElement} b */
      function(b) {
        b.onclick = function() {
          select(b.getAttribute("data-go"));
          centerOn(b.getAttribute("data-go"));
        };
      }
    );
    renderer.refresh();
  }
  function centerOn(id) {
    var d = renderer.getNodeDisplayData(id);
    if (!d) return;
    renderer.getCamera().animate({ x: d.x, y: d.y, ratio: 0.22 }, { duration: 420 });
  }
  var refreshSettingsPanel = null;
  function swatchFill(g) {
    if (g === UNLINKED && unlinkedTintByFolder && unlinkedTintColors.length > 1) {
      var n = unlinkedTintColors.length, step = 360 / n;
      return "conic-gradient(" + unlinkedTintColors.map(function(c, i) {
        return c + " " + Math.round(i * step) + "deg " + Math.round((i + 1) * step) + "deg";
      }).join(", ") + ")";
    }
    return colorOf(g);
  }
  function swatchTitle(g, bandLock2) {
    if (g === UNLINKED && unlinkedTintByFolder && unlinkedTintColors.length > 1) {
      return "Mixed \u2014 coloured by folder";
    }
    if (!counts[g]) return "No notes on the disc";
    return bandLock2 && bandLock2[g] ? "Inner ring" : "Outer ring";
  }
  function countText(g) {
    if (g === UNLINKED && !unlinkedByFolder) return "(" + counts[g] + ")";
    var held = folderCount[g] || 0;
    return !counts[g] && held ? "(" + held + ")" : String(counts[g]);
  }
  var ptr = null;
  function buildLegend() {
    hoverHighlight(null, null);
    var names = order[state.dim] || [];
    $("gcount").textContent = "(" + names.length + ")";
    var kids = dict();
    if (state.dim === "folder") {
      graph.forEachNode(function(_id, a) {
        var d = a.dirs || [];
        for (var i = 0; i < d.length; i++) {
          var pk = a.folder + "/" + d.slice(0, i).join("/");
          if (!kids[pk]) kids[pk] = dict();
          kids[pk][d[i]] = (kids[pk][d[i]] || 0) + 1;
        }
      });
    }
    var eyeBtn = function(attrs, on, what) {
      return '<button class="eye" ' + attrs + ' aria-pressed="' + on + '" title="' + (on ? "Hide " : "Show ") + esc(what) + '">' + eyeSvg(on) + "</button>";
    };
    var subtree = function(prefix, depth, col) {
      var m = kids[prefix];
      if (!m || !state.pathOpen[prefix]) return "";
      return Object.keys(m).sort(function(a, b) {
        return m[b] - m[a] || a.localeCompare(b);
      }).map(function(nm) {
        var pk = prefix + "/" + nm;
        var on = !state.hiddenSub[pk];
        var hlk = !!state.highlightSub[pk];
        return '<div class="lgr sub' + Math.min(depth, 4) + '">' + twBtn(kids[pk] ? 'data-twp="' + esc(pk) + '"' : null, !!state.pathOpen[pk]) + eyeBtn('data-epath="' + esc(pk) + '"', on, nm) + '<button class="lgs" data-hpath="' + esc(pk) + '" data-hl="' + (hlk ? "on" : "off") + '" aria-pressed="' + on + '" title="Highlight ' + esc(nm) + '"><span class="sw" style="background:' + col + ';border-radius:50%"></span><span class="nm">' + esc(nm) + '</span><span class="only" data-only="1" title="Show only ' + esc(nm) + '">only</span><span class="ct">' + m[nm] + "</span></button></div>" + subtree(pk, depth + 1, col);
      }).join("");
    };
    setHTML($("legend"), names.map(function(g) {
      var vis = !isHidden(g);
      var hasSubs = state.dim === "folder" && (groupHasPinnedSub(g) || (subOrder[g] || []).length > 1 && (counts[g] || 0) >= NEST_MIN);
      var open = hasSubs && !state.collapsed[g];
      var hl2 = !!state.highlight[g];
      var live = !!counts[g];
      var lgrClass = "lgr" + (live ? "" : " lgr-empty");
      var row = '<div class="' + lgrClass + '">' + twBtn(hasSubs ? 'data-tw="' + esc(g) + '"' : null, open) + (live ? eyeBtn('data-eye="' + esc(g) + '"', vis, g) : '<button class="eye none" disabled aria-hidden="true"></button>') + '<button class="lg" data-g="' + esc(g) + '" data-hl="' + (hl2 ? "on" : "off") + '" aria-pressed="' + vis + '" title="Highlight ' + esc(g) + '"><span class="sw' + (bandLock && bandLock[g] ? " sw-in" : "") + '" title="' + swatchTitle(g, bandLock) + '" style="background:' + swatchFill(g) + '"></span><span class="nm" title="' + esc(g) + '">' + esc(g) + "</span>" + (live ? '<span class="only" data-only="1" title="Show only ' + esc(g) + '">only</span>' : '<span class="only none" aria-hidden="true"></span>') + // github#50
      '<span class="ct">' + countText(g) + "</span></button></div>";
      if (open && vis) {
        var subs = subOrder[g];
        var srow = function(col, nm, ct, idx, depth, twAttrs, twOpen) {
          var on = !state.hiddenSub[g + "/" + subs[idx[0]]];
          var hlSub = idx.every(function(i) {
            return !!state.highlightSub[g + "/" + subs[+i]];
          });
          return '<div class="lgr ' + (depth === 2 ? "sub2" : "sub") + '">' + twBtn(twAttrs || null, !!twOpen) + eyeBtn('data-esub="' + esc(g) + '" data-idx="' + idx.join(",") + '"', on, nm) + '<button class="lgs" data-hsub="' + esc(g) + '" data-idx="' + idx.join(",") + '" data-hl="' + (hlSub ? "on" : "off") + '" aria-pressed="' + on + '" title="Highlight ' + esc(nm) + '"><span class="sw" style="background:' + col + ';border-radius:50%"></span><span class="nm">' + esc(nm) + '</span><span class="only" data-only="1" title="Show only ' + esc(nm) + '">only</span><span class="ct">' + ct + "</span></button></div>";
        };
        subs.slice(0, SUB_NAMED).forEach(function(sb, k) {
          var pk = g + "/" + sb, tint = subShade[pk] || colorOf(g);
          row += srow(
            tint,
            sb || "(directly in folder)",
            subCount[pk] || 0,
            [k],
            1,
            sb && kids[pk] ? 'data-twp="' + esc(pk) + '"' : null,
            !!state.pathOpen[pk]
          );
          if (sb) row += subtree(pk, 2, tint);
        });
        var tail = subs.slice(SUB_NAMED);
        if (tail.length) {
          var n = 0;
          tail.forEach(function(sb) {
            n += subCount[g + "/" + sb] || 0;
          });
          var tOpen = !!state.tailOpen[g];
          row += srow(
            subShade[g + "/" + tail[0]] || colorOf(g),
            tail.length + " smaller subfolders",
            n,
            tail.map(function(_, j) {
              return SUB_NAMED + j;
            }),
            1,
            'data-twtail="' + esc(g) + '"',
            tOpen
          );
          if (tOpen) {
            tail.forEach(function(sb, j) {
              var pk = g + "/" + sb, tint = subShade[pk] || colorOf(g);
              row += srow(
                tint,
                sb || "(directly in folder)",
                subCount[pk] || 0,
                [SUB_NAMED + j],
                2,
                sb && kids[pk] ? 'data-twp="' + esc(pk) + '"' : null,
                !!state.pathOpen[pk]
              );
              if (sb) row += subtree(pk, 3, tint);
            });
          }
        }
      }
      return row;
    }).join(""));
    var each = function(sel, fn) {
      Array.prototype.forEach.call($("legend").querySelectorAll(sel), fn);
    };
    var onlySubs = function(g, keep) {
      var h = state.hidden[state.dim] || (state.hidden[state.dim] = dict());
      (order[state.dim] || []).forEach(function(n) {
        h[n] = n !== g;
      });
      state.hiddenSub = dict();
      (subOrder[g] || []).forEach(function(sb) {
        if (keep.indexOf(sb) < 0) state.hiddenSub[g + "/" + sb] = true;
      });
    };
    var onlyUnder = function(g, path) {
      var h = state.hidden[state.dim] || (state.hidden[state.dim] = dict());
      (order[state.dim] || []).forEach(function(n) {
        h[n] = n !== g;
      });
      state.hiddenSub = dict();
      var rest = path.slice(g.length + 1);
      var want = rest ? rest.split("/") : [];
      graph.forEachNode(function(_id, a) {
        if (a.folder !== g) return;
        var d = a.dirs || [], i = 0;
        while (i < want.length && i < d.length && d[i] === want[i]) i++;
        if (i === want.length) return;
        state.hiddenSub[g + "/" + d.slice(0, i + 1).join("/")] = true;
      });
    };
    each("[data-only]", function(b) {
      b.onmouseenter = function() {
        hoverHighlight(null, null);
      };
      b.onmouseleave = function(ev) {
        var row = b.parentElement;
        while (row && !row.onmouseenter && row.id !== "vg-legend") row = row.parentElement;
        if (row && row.onmouseenter && row.contains(
          /** @type {Node | null} */
          ev.relatedTarget
        )) {
          row.onmouseenter.call(row, ev);
        }
      };
    });
    each("[data-tw]", function(b) {
      var g = b.getAttribute("data-tw");
      b.onmouseenter = function() {
        hoverHighlight(g, null);
      };
      b.onmouseleave = function() {
        hoverHighlight(null, null);
      };
      b.onclick = function() {
        if (state.collapsed[g]) delete state.collapsed[g];
        else state.collapsed[g] = true;
        buildLegend();
        if (refreshSettingsPanel) refreshSettingsPanel();
      };
    });
    each("[data-twp]", function(b) {
      b.onclick = function() {
        var p = b.getAttribute("data-twp");
        if (state.pathOpen[p]) delete state.pathOpen[p];
        else state.pathOpen[p] = true;
        buildLegend();
      };
    });
    each("[data-epath]", function(b) {
      b.onclick = function() {
        var p = b.getAttribute("data-epath");
        if (state.hiddenSub[p]) delete state.hiddenSub[p];
        else state.hiddenSub[p] = true;
        buildLegend();
        cascade(null, { colToggle: true });
      };
    });
    each("[data-hpath]", function(b) {
      var hp = b.getAttribute("data-hpath");
      b.onmouseenter = function() {
        hoverHighlight(null, [hp]);
      };
      b.onmouseleave = function() {
        hoverHighlight(null, null);
      };
      b.onclick = function(ev) {
        var p = b.getAttribute("data-hpath");
        if (ev && ev.target && /** @type {Element} */
        ev.target.getAttribute("data-only")) {
          onlyUnder(p.slice(0, p.indexOf("/")), p);
          buildLegend();
          cascade(null, { colToggle: true });
          return;
        }
        if (state.highlightSub[p]) delete state.highlightSub[p];
        else state.highlightSub[p] = true;
        buildLegend();
        applyLayout(true);
        renderer.refresh();
      };
    });
    each("[data-twtail]", function(b) {
      b.onclick = function() {
        var g = b.getAttribute("data-twtail");
        if (state.tailOpen[g]) delete state.tailOpen[g];
        else state.tailOpen[g] = true;
        buildLegend();
      };
    });
    each("[data-eye]", function(b) {
      var g = b.getAttribute("data-eye");
      b.onclick = function() {
        var h = state.hidden[state.dim] || (state.hidden[state.dim] = dict());
        h[g] = !h[g];
        buildLegend();
        cascade(null, { colToggle: true });
      };
    });
    each("[data-esub]", function(b) {
      b.onclick = function() {
        var f = b.getAttribute("data-esub");
        var subs = subOrder[f] || [];
        var off = b.getAttribute("aria-pressed") === "true";
        b.getAttribute("data-idx").split(",").forEach(function(i) {
          var key = f + "/" + subs[+i];
          if (off) state.hiddenSub[key] = true;
          else delete state.hiddenSub[key];
        });
        buildLegend();
        cascade(null, { colToggle: true });
      };
    });
    each("[data-hsub]", function(b) {
      var hoverKeys = function() {
        var f = b.getAttribute("data-hsub");
        var subs = subOrder[f] || [];
        return b.getAttribute("data-idx").split(",").map(function(i) {
          return f + "/" + subs[+i];
        });
      };
      b.onmouseenter = function() {
        hoverHighlight(null, hoverKeys());
      };
      b.onmouseleave = function() {
        hoverHighlight(null, null);
      };
      b.onclick = function(ev) {
        var f = b.getAttribute("data-hsub");
        var subs = subOrder[f] || [];
        var idx = b.getAttribute("data-idx").split(",");
        if (ev && ev.target && /** @type {Element} */
        ev.target.getAttribute("data-only")) {
          onlySubs(f, idx.map(function(i) {
            return subs[+i];
          }));
          buildLegend();
          cascade(null, { colToggle: true });
          return;
        }
        var allOn = idx.every(function(i) {
          return !!state.highlightSub[f + "/" + subs[+i]];
        });
        idx.forEach(function(i) {
          var key = f + "/" + subs[+i];
          if (allOn) delete state.highlightSub[key];
          else state.highlightSub[key] = true;
        });
        buildLegend();
        applyLayout(true);
        renderer.refresh();
      };
    });
    each(".lg[data-g]", function(b) {
      var g = b.getAttribute("data-g");
      b.onmouseenter = function() {
        hoverHighlight(g, null);
      };
      b.onmouseleave = function() {
        hoverHighlight(null, null);
      };
      b.onclick = function(ev) {
        if (ev.target && /** @type {Element} */
        ev.target.getAttribute("data-only")) {
          var h = state.hidden[state.dim] || (state.hidden[state.dim] = dict());
          (order[state.dim] || []).forEach(function(n) {
            h[n] = n !== g;
          });
          state.hiddenSub = dict();
          buildLegend();
          cascade(null, { colToggle: true });
          return;
        }
        if (state.highlight[g]) delete state.highlight[g];
        else state.highlight[g] = true;
        buildLegend();
        applyLayout(true);
        renderer.refresh();
      };
    });
    if (ptr) {
      var hit = null;
      var hitSub = null;
      var hitPath = null;
      for (var up = DOC.elementFromPoint(ptr.x, ptr.y); up && up !== DOC.body; up = up.parentElement) {
        if (!up.getAttribute) continue;
        if (up.getAttribute("data-hsub")) {
          hitSub = up;
          break;
        }
        if (up.getAttribute("data-hpath")) {
          hitPath = up;
          break;
        }
        if (up.getAttribute("data-g") && up.classList && up.classList.contains("lg")) {
          hit = up;
          break;
        }
      }
      if (hitSub) {
        var fSub = hitSub.getAttribute("data-hsub"), subsSub = subOrder[fSub] || [];
        hoverHighlight(null, (hitSub.getAttribute("data-idx") || "").split(",").map(function(i) {
          return fSub + "/" + subsSub[+i];
        }));
      } else if (hitPath) {
        hoverHighlight(null, [hitPath.getAttribute("data-hpath")]);
      } else if (hit) {
        hoverHighlight(hit.getAttribute("data-g"), null);
      }
    }
  }
  function seedHidden() {
    var h = state.hidden[state.dim] = dict();
    (order[state.dim] || []).forEach(function(g) {
      if (hiddenByDefault(g)) h[g] = true;
    });
  }
  function collapseAll() {
    state.collapsed = dict();
    (order[state.dim] || []).forEach(function(g) {
      state.collapsed[g] = true;
    });
  }
  var collapsedInit = false;
  function regroup(skipLayout, bandHint, keepAlpha) {
    counts = computeOrder();
    var colorsBefore = null;
    Object.keys(groupColor).forEach(function(g) {
      (colorsBefore || (colorsBefore = dict()))[g] = groupColor[g];
    });
    buildColors();
    colorWalk(colorsBefore);
    if (!collapsedInit) {
      collapsedInit = true;
      collapseAll();
      seedHidden();
    }
    if (!bandLock) {
      var base = buildWedgePlan(false);
      if (base) {
        bandLock = dict();
        base.cells.forEach(function(c) {
          bandLock[c.g] = c.inner;
        });
        if (bandHint) Object.keys(bandHint).forEach(function(g) {
          bandLock[g] = bandHint[g];
        });
        var bandTotal = { i: 0, o: 0 };
        base.cells.forEach(function(c) {
          bandTotal[c.inner ? "i" : "o"] += c.wsum;
        });
        var bandR = { i: 0, o: 0 }, bandRows = { i: 0, o: 0 };
        base.cells.forEach(function(c) {
          var k = c.inner ? "i" : "o";
          if (c.rows > bandRows[k]) bandRows[k] = c.rows;
          (c.slots || []).forEach(function(sl) {
            var rr = sl.r * UNIT;
            if (rr > bandR[k]) bandR[k] = rr;
          });
        });
        geomLock = {
          r0: base.r0,
          rOuter: base.rOuter,
          maxR: base.maxR,
          total: base.total,
          bandTotal,
          bandR,
          rows: bandRows
        };
        var again = buildWedgePlan(false);
        if (again) geomLock = {
          r0: again.r0,
          rOuter: again.rOuter,
          maxR: again.maxR,
          total: again.total,
          bandTotal,
          bandR,
          rows: bandRows
        };
        if (renderer) {
          var span = base.maxR * UNIT * 1.02;
          renderer.setCustomBBox({ x: [-span, span], y: [-span, span] });
        }
      }
    }
    buildLegend();
    if (!keepAlpha) syncAlpha();
    if (!skipLayout) applyLayout(false);
    if (heat) {
      heatSig = "";
      heatDraw();
    }
  }
  function hardRelayout(animate, deferLayout) {
    stopPlay();
    if (cascadeRun) {
      WIN.cancelAnimationFrame(cascadeRun.raf);
      WIN.clearTimeout(cascadeRun.guard);
      cascadeRun = null;
    }
    if (anim) {
      WIN.cancelAnimationFrame(anim);
      anim = null;
    }
    if (animGuard) {
      WIN.clearTimeout(animGuard);
      animGuard = null;
    }
    moveFrom = null;
    splitHold = null;
    pinnedPlan = null;
    planKeep = null;
    roomNow = null;
    cellNow = null;
    edgeNow = null;
    colWalk = null;
    posSrc = null;
    var prevBand = bandLock, prevGeom = geomLock;
    bandLock = null;
    geomLock = null;
    if (deferLayout && prevBand) {
      regroup(true, prevBand, true);
      if (prevGeom) geomLock = prevGeom;
      return;
    }
    regroup(true);
    if (!deferLayout) applyLayout(!!animate);
    if (renderer) renderer.refresh();
  }
  function buildSearch() {
    var q = (
      /** @type {HTMLInputElement} */
      $("q")
    );
    q.oninput = function() {
      state.query = q.value.trim().toLowerCase();
      var hits = $("hits");
      if (!state.query) {
        hits.replaceChildren();
        renderer.refresh();
        return;
      }
      var found = [];
      graph.forEachNode(function(id, a) {
        if (a.label.toLowerCase().indexOf(state.query) > -1) found.push(id);
      });
      found.sort(function(p, o) {
        return graph.getNodeAttribute(o, "deg") - graph.getNodeAttribute(p, "deg");
      });
      setHTML(hits, found.slice(0, 40).map(function(id) {
        return '<button data-hit="' + id + '">' + esc(graph.getNodeAttribute(id, "label")) + ' <span style="color:var(--text-3)">' + graph.getNodeAttribute(id, "deg") + "</span></button>";
      }).join("") || '<div style="color:var(--text-3);font-size:11px;padding:4px">No match</div>');
      Array.prototype.forEach.call(
        hits.querySelectorAll("[data-hit]"),
        /** @param {HTMLElement} b */
        function(b) {
          b.onclick = function() {
            var id = b.getAttribute("data-hit");
            q.value = "";
            state.query = "";
            hits.replaceChildren();
            select(id);
            centerOn(id);
          };
        }
      );
      renderer.refresh();
    };
    q.onkeydown = function(e) {
      if (e.key !== "Enter") return;
      var first = (
        /** @type {HTMLElement | null} */
        $("hits").querySelector("[data-hit]")
      );
      if (first) first.click();
    };
  }
  var play = null;
  var introOwed = false;
  if (DOC && typeof DOC.addEventListener === "function") {
    var onDocMove = function(ev) {
      ptr = { x: ev.clientX, y: ev.clientY };
    };
    DOC.addEventListener("mousemove", onDocMove, { capture: true, passive: true });
    onDestroy.push(function() {
      DOC.removeEventListener("mousemove", onDocMove, true);
    });
    var onVisibility = function() {
      var away = typeof DOC.visibilityState === "string" ? DOC.visibilityState === "hidden" : !!DOC.hidden;
      if (!away) {
        if (introOwed) {
          introOwed = false;
          playTimeline();
        }
        return;
      }
      if (!play && !cascadeRun && !anim) return;
      var wasPlaying = !!play;
      stopPlay();
      if (cascadeRun) {
        WIN.cancelAnimationFrame(cascadeRun.raf);
        WIN.clearTimeout(cascadeRun.guard);
        cascadeRun = null;
      }
      if (anim) {
        WIN.cancelAnimationFrame(anim);
        anim = null;
      }
      if (animGuard) {
        WIN.clearTimeout(animGuard);
        animGuard = null;
      }
      pinnedPlan = null;
      planKeep = null;
      roomNow = null;
      cellNow = null;
      edgeNow = null;
      colWalk = null;
      posSrc = null;
      state.until = null;
      timelineFrame(true);
      if (wasPlaying) introOwed = true;
    };
    DOC.addEventListener("visibilitychange", onVisibility);
    onDestroy.push(function() {
      DOC.removeEventListener("visibilitychange", onVisibility);
    });
  }
  function stopPlay() {
    if (!play) return;
    var viaCascade = play.viaCascade;
    WIN.cancelAnimationFrame(play.raf);
    if (play.guard) WIN.clearTimeout(play.guard);
    play = null;
    endSweep();
    if (!viaCascade) return;
    if (cascadeRun) {
      WIN.cancelAnimationFrame(cascadeRun.raf);
      WIN.clearTimeout(cascadeRun.guard);
      cascadeRun = null;
    }
    pinnedPlan = null;
    planKeep = null;
    roomNow = null;
    cellNow = null;
    edgeNow = null;
    posSrc = null;
    colWalk = null;
    state.until = null;
    timelineFrame(true);
  }
  function timelineFrame(full) {
    fullRing = true;
    syncAlpha();
    var targets = ringsLayout();
    if (targets) assignPositions(targets);
    renderer.refresh({ skipIndexation: !full });
  }
  function playTimeline() {
    stopPlay();
    if (cascadeRun) {
      WIN.cancelAnimationFrame(cascadeRun.raf);
      WIN.clearTimeout(cascadeRun.guard);
      cascadeRun = null;
    }
    if (anim) {
      WIN.cancelAnimationFrame(anim);
      anim = null;
    }
    if (animGuard) {
      WIN.clearTimeout(animGuard);
      animGuard = null;
    }
    pinnedPlan = null;
    planKeep = null;
    roomNow = null;
    cellNow = null;
    edgeNow = null;
    colWalk = null;
    posSrc = null;
    var dur = TIMELINE_MS * TIME_SCALE;
    state.until = null;
    state.from = null;
    state.to = null;
    rangeChrome();
    clearAlpha();
    cascade(function() {
      if (play) play = null;
      endSweep();
    }, {
      fullRing: true,
      order: function(id) {
        return tlRank[id] || 0;
      },
      totalMs: dur,
      onFrame: function(pr) {
        sweepTo(pr);
      }
    });
    play = { raf: 0, guard: 0, viaCascade: true };
  }
  function sweepTo(pr) {
    if (!dateSpan || !tlMax) return;
    var k = Math.max(0, Math.min(1, pr)) * tlMax;
    var i = Math.round(k) - 1;
    if (i < 0) i = 0;
    if (i > tlDateMs.length - 1) i = tlDateMs.length - 1;
    var ms = tlDateMs[i];
    if (!(ms >= dateSpan.lo)) ms = dateSpan.lo;
    if (ms > dateSpan.hi) ms = dateSpan.hi;
    brushSweep = pr >= 1 ? dateSpan.hi : ms;
    drawRibbon();
    if (pr >= 1) {
      hideRTip();
      return;
    }
    showRTip(ribbonX(brushSweep, ribbonW()), isoDay(brushSweep));
  }
  function endSweep() {
    if (brushSweep === null) return;
    brushSweep = null;
    hideRTip();
    drawDateUI();
  }
  function resetView() {
    stopPlay();
    seedHidden();
    state.hiddenSub = dict();
    state.highlight = dict();
    state.highlightSub = dict();
    collapseAll();
    state.tailOpen = dict();
    state.pathOpen = dict();
    state.markDay = null;
    state.hoverDay = null;
    state.until = null;
    state.query = "";
    state.hovered = null;
    select(null);
    hideTip();
    $("q").value = "";
    $("hits").replaceChildren();
    state.from = null;
    state.to = null;
    state.heatEnd = null;
    rangeChrome();
    buildLegend();
  }
  function buildTools() {
    refreshSettingsPanel = buildSettings;
    $("allon").onclick = function() {
      seedHidden();
      state.hiddenSub = dict();
      buildLegend();
      cascade(null, { colToggle: true });
    };
    $("alloff").onclick = function() {
      var h = state.hidden[state.dim] = dict();
      (order[state.dim] || []).forEach(function(g) {
        h[g] = true;
      });
      buildLegend();
      cascade(null, { colToggle: true });
    };
    var onRefresh = typeof deps.onRefresh === "function" ? deps.onRefresh : null;
    if (onRefresh) {
      $("refresh").title = "Rebuild from the vault and replay. Picks up notes written since the graph was drawn, and clears every filter.";
    }
    $("refresh").onclick = function() {
      if (onRefresh) {
        onRefresh();
        return;
      }
      resetView();
      fit();
      playTimeline();
    };
    if ($("reset")) $("reset").onclick = fit;
    if ($("zin")) $("zin").onclick = function() {
      zoomBy(1);
    };
    if ($("zout")) $("zout").onclick = function() {
      zoomBy(-1);
    };
    if ($("pan")) $("pan").onclick = function() {
      setPan(!panEnabled, true);
    };
    setPan(panEnabled, false);
    if ($("compact")) $("compact").onclick = function() {
      setCompactAxis(!compactAxis, true);
    };
    setCompactAxis(compactAxis, false);
    $("png").onclick = savePng;
    if ($("dbg")) $("dbg").onclick = function() {
      var txt = JSON.stringify(API.debugDump(), null, 2);
      var done = function(how) {
        var b = $("dbg");
        b.textContent = how;
        WIN.setTimeout(function() {
          b.textContent = "Debug";
        }, 1600);
      };
      var save = function() {
        try {
          var a = DOC.createElement("a");
          a.href = "data:application/json;charset=utf-8," + encodeURIComponent(txt);
          a.download = "vault-graph-debug.json";
          a.click();
          done("Saved");
        } catch {
          done("Failed");
        }
      };
      try {
        WIN.navigator.clipboard.writeText(txt).then(function() {
          done("Copied");
        }, save);
      } catch {
        save();
      }
    };
    if (openHostSettings) {
      $("gear").hidden = false;
      $("gear").removeAttribute("aria-expanded");
      $("gear").removeAttribute("aria-controls");
      $("gear").onclick = function() {
        openHostSettings();
      };
    } else if (SETTINGS_UI) {
      $("gear").hidden = false;
      $("gear").onclick = function() {
        var open = $("settings").hidden;
        $("settings").hidden = !open;
        $("gear").setAttribute("aria-expanded", String(open));
        if (open) {
          buildOptions();
          buildSettings();
        }
      };
      $("fcreset").onclick = function() {
        pickColor(null, null);
        var savedSub = applySubfolderColors({});
        if (saveSubfolderColors) saveSubfolderColors(Object.assign({}, savedSub));
        buildSettings();
      };
      $("setbody").addEventListener("click", function(ev) {
        var t = ev.target instanceof Element ? ev.target : null;
        if (!t) return;
        var v = t.closest("[data-vis]");
        if (v) {
          pickVisible(v.getAttribute("data-vis"));
          return;
        }
        var tw = t.closest("[data-stw]");
        if (tw) {
          var fg = tw.getAttribute("data-stw");
          if (state.collapsed[fg]) delete state.collapsed[fg];
          else state.collapsed[fg] = true;
          buildSettings();
          buildLegend();
          return;
        }
        var s = t.closest("[data-sfc]");
        if (s) {
          var pk = s.getAttribute("data-sfc"), slash = pk.indexOf("/");
          pickSubColors(
            pk.slice(0, slash),
            [pk.slice(slash + 1)],
            s.getAttribute("data-key") || null
          );
          return;
        }
        var b = t.closest("[data-fc]");
        if (b) pickColor(b.getAttribute("data-fc"), b.getAttribute("data-key") || null);
      });
      $("optbody").addEventListener("click", function(ev) {
        var t = ev.target instanceof Element ? ev.target : null;
        var b = t && t.closest("[data-opt]");
        if (!b) return;
        var key = b.getAttribute("data-opt");
        var row = OPTION_ROWS.filter(function(o) {
          return o.key === key;
        })[0];
        if (row) {
          row.set(!row.get());
          buildOptions();
        }
      });
    }
    function closeCtxMenu() {
      var el = $("ctxmenu");
      if (el) el.hidden = true;
      DOC.removeEventListener("mousedown", ctxOutside, true);
      DOC.removeEventListener("keydown", ctxKey, true);
      WIN.removeEventListener("resize", closeCtxMenu);
    }
    onDestroy.push(closeCtxMenu);
    function ctxOutside(ev) {
      var el = $("ctxmenu");
      if (el && !el.hidden && !el.contains(
        /** @type {Node} */
        ev.target
      )) closeCtxMenu();
    }
    function ctxKey(ev) {
      if (ev.key === "Escape") closeCtxMenu();
    }
    function swatchButtonsHTML(pal, opts) {
      return pal.map(function(p) {
        var on = opts.current === p.key;
        var isAuto = !!opts.autoKey && opts.autoKey === p.key;
        return '<button class="swatch vg-' + p.key + '" role="' + opts.role + '"' + (opts.dataAttr ? " data-" + opts.dataAttr + '="' + esc(opts.dataValue) + '"' : "") + ' data-key="' + p.key + '" aria-checked="' + on + '"' + (isAuto ? ' data-auto="1"' : "") + ' title="' + esc(p.name) + (opts.titleFor ? opts.titleFor(on, isAuto) : "") + '" aria-label="' + esc(p.name) + '"></button>';
      }).join("");
    }
    function openCtxMenu(x, y, current, onPick, autoKey, visShown, onToggleVisible, byFolderOn, onToggleByFolder, tintOn, onToggleTint) {
      var el = $("ctxmenu");
      if (!el) return;
      var pal = paletteInfo();
      var sws = swatchButtonsHTML(pal, {
        role: "menuitemradio",
        current,
        autoKey,
        titleFor: function(on, isAuto) {
          return isAuto ? " (automatic)" : "";
        }
      });
      var visTitle = visShown ? "Hide this folder by default" : "Show this folder by default";
      var visHTML = onToggleVisible ? '<button class="vis" data-vis aria-pressed="' + visShown + '" title="' + visTitle + '">' + eyeSvg(visShown) + "<span>Shown by default</span></button>" : "";
      var byFolderTitle = byFolderOn ? "Keep unlinked notes in their own group instead" : "Let each unlinked note join its own folder's group";
      var byFolderHTML = onToggleByFolder ? '<button class="vis" data-byfolder aria-pressed="' + byFolderOn + '" title="' + byFolderTitle + '">' + dotSvg(byFolderOn) + "<span>Joins its folder</span></button>" : "";
      var tintTitle = tintOn ? "Use the flat unlinked swatch instead" : "Give each unlinked note its own folder's colour";
      var tintHTML = onToggleTint ? '<button class="vis" data-tint aria-pressed="' + tintOn + '" title="' + tintTitle + '">' + dotSvg(tintOn) + "<span>Colour by folder</span></button>" : "";
      setHTML(el, '<div class="sws">' + sws + '</div><button class="auto" data-key="" aria-pressed="' + !current + '" title="Back to automatic">Auto</button>' + visHTML + byFolderHTML + tintHTML);
      Array.prototype.forEach.call(
        el.querySelectorAll("[data-key]"),
        /** @param {HTMLElement} b */
        function(b) {
          b.onclick = function() {
            onPick(b.getAttribute("data-key") || null);
            closeCtxMenu();
          };
        }
      );
      if (onToggleVisible) {
        el.querySelector("[data-vis]").onclick = function() {
          onToggleVisible();
          closeCtxMenu();
        };
      }
      if (onToggleByFolder) {
        el.querySelector("[data-byfolder]").onclick = function() {
          onToggleByFolder();
          closeCtxMenu();
        };
      }
      if (onToggleTint) {
        el.querySelector("[data-tint]").onclick = function() {
          onToggleTint();
          closeCtxMenu();
        };
      }
      el.hidden = false;
      var root0 = ROOT.getBoundingClientRect();
      var rx = x - root0.left, ry = y - root0.top;
      var r = el.getBoundingClientRect();
      el.style.left = Math.max(4, Math.min(rx, ROOT.clientWidth - r.width - 4)) + "px";
      el.style.top = Math.max(4, Math.min(ry, ROOT.clientHeight - r.height - 4)) + "px";
      DOC.addEventListener("mousedown", ctxOutside, true);
      DOC.addEventListener("keydown", ctxKey, true);
      WIN.addEventListener("resize", closeCtxMenu);
    }
    $("legend").addEventListener("contextmenu", function(ev) {
      var t = ev.target instanceof Element ? ev.target : null;
      if (!t) return;
      var gBtn = t.closest(".lg[data-g]");
      if (gBtn) {
        ev.preventDefault();
        var g = gBtn.getAttribute("data-g");
        var isUnlinked = g === UNLINKED;
        var keptSeparate = isUnlinked && !unlinkedByFolder;
        openCtxMenu(
          ev.clientX,
          ev.clientY,
          folderColors[g] || groupSlot[g] || "",
          function(key) {
            pickColor(g, key);
          },
          groupAutoSlot[g] || "",
          !hiddenByDefault(g),
          function() {
            pickVisible(g);
          },
          isUnlinked ? unlinkedByFolder : void 0,
          isUnlinked ? function() {
            setUnlinkedByFolder(!unlinkedByFolder, true);
          } : void 0,
          keptSeparate ? unlinkedTintByFolder : void 0,
          keptSeparate ? function() {
            setUnlinkedTintByFolder(!unlinkedTintByFolder, true);
          } : void 0
        );
        return;
      }
      var subBtn = t.closest(".lgs[data-hsub]");
      if (subBtn) {
        ev.preventDefault();
        var f = subBtn.getAttribute("data-hsub");
        var subs = subOrder[f] || [];
        var idx = subBtn.getAttribute("data-idx").split(",").map(Number);
        var picked = idx.map(function(i) {
          return subs[i];
        });
        var cur = idx.length === 1 ? subfolderColors[f + "/" + picked[0]] || "" : "";
        openCtxMenu(
          ev.clientX,
          ev.clientY,
          cur,
          function(key) {
            pickSubColors(f, picked, key);
          }
        );
        return;
      }
    });
    function pickColor(folder, key) {
      var next = dict();
      if (folder) {
        Object.keys(folderColors).forEach(function(g) {
          next[g] = folderColors[g];
        });
        if (key) next[folder] = key;
        else delete next[folder];
      }
      var saved = applyFolderColors(next);
      if (saveFolderColors) saveFolderColors(Object.assign({}, saved));
      buildSettings();
    }
    function pickSubColors(folder, subs, key) {
      var next = dict();
      Object.keys(subfolderColors).forEach(function(k) {
        next[k] = subfolderColors[k];
      });
      subs.forEach(function(sb) {
        var pk = folder + "/" + sb;
        if (key) next[pk] = key;
        else delete next[pk];
      });
      var saved = applySubfolderColors(next);
      if (saveSubfolderColors) saveSubfolderColors(Object.assign({}, saved));
      buildSettings();
    }
    function pickVisible(folder) {
      var next = dict();
      Object.keys(folderShown).forEach(function(g) {
        next[g] = folderShown[g];
      });
      next[folder] = hiddenByDefault(folder);
      var saved = applyFolderShown(next);
      if (saveFolderShown) saveFolderShown(Object.assign({}, saved));
      var h = state.hidden[state.dim] || (state.hidden[state.dim] = dict());
      if (hiddenByDefault(folder)) h[folder] = true;
      else delete h[folder];
      buildLegend();
      cascade(null, { colToggle: true });
      buildSettings();
    }
    function subfolderRows(g, pal) {
      return (subOrder[g] || []).map(function(sb) {
        var pk = g + "/" + sb;
        var pin2 = subfolderColors[pk] || "";
        var tint = subShade[pk] || colorOf(g);
        var nm = sb || "(directly in folder)";
        var sws = swatchButtonsHTML(pal, {
          role: "radio",
          dataAttr: "sfc",
          dataValue: pk,
          current: pin2,
          titleFor: function(on, isAuto) {
            return on ? " (chosen)" : "";
          }
        });
        return '<div class="scr scrsub" role="radiogroup" aria-label="Colour for ' + esc(g + "/" + nm) + '"><div class="scrh"><span class="sw" style="background:' + tint + ';border-radius:50%"></span><span class="nm" title="' + esc(nm) + '">' + esc(nm) + '</span><span class="ct">' + (subCount[pk] || 0) + '</span><button class="auto" data-sfc="' + esc(pk) + '" data-key="" aria-pressed="' + !pin2 + '" title="Back to the automatic tint">Auto</button></div><span class="sws">' + sws + "</span></div>";
      }).join("");
    }
    var OPTION_ROWS = [
      {
        key: "compactAxis",
        label: "Compact date axis",
        title: "Give each year width by how many notes it holds, instead of every year reading the same width",
        get: function() {
          return compactAxis;
        },
        set: function(v) {
          setCompactAxis(v, true);
        }
      },
      {
        key: "unlinkedByFolder",
        label: "Unlinked notes join their folder",
        title: "A note with no links takes its own folder's wedge and colour, instead of sitting apart in a separate unlinked group -- also reachable by right-clicking the (unlinked) row",
        get: function() {
          return unlinkedByFolder;
        },
        set: function(v) {
          setUnlinkedByFolder(v, true);
        }
      },
      {
        key: "unlinkedTintByFolder",
        label: "Colour unlinked notes by folder",
        title: "While unlinked notes are kept as their own group, give each one its own folder's colour instead of the flat unlinked swatch -- also reachable by right-clicking the (unlinked) row",
        get: function() {
          return unlinkedTintByFolder;
        },
        set: function(v) {
          setUnlinkedTintByFolder(v, true);
        }
      }
    ];
    function buildOptions() {
      var host = $("optbody");
      if (!host) return;
      setHTML(host, OPTION_ROWS.map(function(o) {
        var on = !!o.get();
        return '<div class="row" style="margin-bottom:7px"><div class="lbl" style="margin:0">' + esc(o.label) + '</div><div class="mini"><button id="vg-opt-' + o.key + '" data-opt="' + o.key + '" aria-pressed="' + on + '" title="' + esc(o.title) + '">Enabled</button></div></div>';
      }).join(""));
    }
    function buildSettings() {
      var pal = paletteInfo();
      var rows = (order[state.dim] || []).map(function(g) {
        var pinned = folderColors[g] || "";
        var cur = pinned || groupSlot[g] || "";
        var autoKey = groupAutoSlot[g] || "";
        var sws = swatchButtonsHTML(pal, {
          role: "radio",
          dataAttr: "fc",
          dataValue: g,
          current: cur,
          autoKey,
          titleFor: function(on, isAuto) {
            return on ? pinned ? " (chosen)" : " (automatic)" : isAuto ? " (automatic default)" : "";
          }
        });
        var shown = !hiddenByDefault(g);
        var hasSubs = state.dim === "folder" && (groupHasPinnedSub(g) || (subOrder[g] || []).length > 1 && (counts[g] || 0) >= NEST_MIN);
        var open = hasSubs && !state.collapsed[g];
        return '<div class="scr" role="radiogroup" aria-label="Colour for ' + esc(g) + '"><div class="scrh">' + twBtn(hasSubs ? 'data-stw="' + esc(g) + '"' : null, open) + '<button class="eye vis" data-vis="' + esc(g) + '" aria-pressed="' + shown + '" title="' + (shown ? "Shown by default" : "Hidden by default") + '" aria-label="' + (shown ? "Hide" : "Show") + " " + esc(g) + '">' + eyeSvg(shown) + '</button><span class="nm" title="' + esc(g) + '">' + esc(g) + '</span><button class="auto" data-fc="' + esc(g) + '" data-key="" aria-pressed="' + !pinned + '" title="Back to the slot this folder gets automatically">Auto</button></div><span class="sws">' + sws + "</span></div>" + (open ? subfolderRows(g, pal) : "");
      }).join("");
      setHTML($("setbody"), rows);
    }
  }
  var FIT_RATIO = 1.08;
  var camAtRest = true, fitting = false;
  function fitRatio() {
    var locked = geomLock && geomLock.maxR ? geomLock.maxR : 0;
    var live = lastMaxR;
    if (!locked || !live) return FIT_RATIO;
    var k = live / locked;
    if (k > 1.35) k = 1.35;
    if (k < 0.12) k = 0.12;
    return FIT_RATIO * k;
  }
  function fit() {
    var to = { x: 0.5, y: 0.5, ratio: fitRatio(), angle: 0 };
    fitting = true;
    var landed = function() {
      fitting = false;
      camAtRest = true;
    };
    if (!panEnabled) {
      renderer.setSetting("enableCameraPanning", true);
      renderer.getCamera().animate(to, { duration: 380 }, function() {
        renderer.setSetting("enableCameraPanning", false);
        landed();
      });
      return;
    }
    renderer.getCamera().animate(to, { duration: 380 }, landed);
  }
  function zoomBy(dir) {
    var cam = renderer.getCamera();
    var step = renderer.getSetting("zoomingRatio") || 1.2;
    var r = cam.getState().ratio * (dir > 0 ? 1 / step : step);
    var lo = renderer.getSetting("minCameraRatio"), hi = renderer.getSetting("maxCameraRatio");
    if (typeof lo === "number" && r < lo) r = lo;
    if (typeof hi === "number" && r > hi) r = hi;
    cam.animate({ ratio: r }, { duration: renderer.getSetting("zoomDuration") || 120 });
  }
  function setPan(on, persist) {
    panEnabled = !!on;
    var btn = $("pan");
    if (btn) btn.setAttribute("aria-pressed", panEnabled ? "true" : "false");
    if (renderer) {
      if (panEnabled) renderer.setSetting("enableCameraPanning", true);
      else fit();
    }
    if (persist && onPanEnabled) onPanEnabled(panEnabled);
    return panEnabled;
  }
  function setCompactAxis(on, persist) {
    compactAxis = !!on;
    ["opt-compactAxis", "compact"].forEach(function(id) {
      var btn = $(id);
      if (btn) btn.setAttribute("aria-pressed", compactAxis ? "true" : "false");
    });
    if (dateSpan) drawDateUI();
    if (persist && onCompactAxis) onCompactAxis(compactAxis);
    return compactAxis;
  }
  function setUnlinkedByFolder(on, persist, instant) {
    var next = !!on;
    var movesFrom = null;
    var n = 0;
    if (renderer && !instant && next !== unlinkedByFolder) {
      graph.forEachNode(function(id) {
        if (!isOrphan(id) || !visible(id) || (alpha[id] || 0) <= 4e-3) return;
        if (!movesFrom) movesFrom = dict();
        movesFrom[id] = groupOf(id);
        n++;
      });
    }
    unlinkedByFolder = next;
    var btn = $("opt-unlinkedByFolder");
    if (btn) btn.setAttribute("aria-pressed", unlinkedByFolder ? "true" : "false");
    hardRelayout(false, !!n);
    attempt2(placeLogo);
    attempt2(heatBuild);
    attempt2(buildLegend);
    if (persist && onUnlinkedByFolder) onUnlinkedByFolder(unlinkedByFolder);
    if (n) cascade(null, { colToggle: true, movesFrom });
    return unlinkedByFolder;
  }
  function setUnlinkedTintByFolder(on, persist) {
    unlinkedTintByFolder = !!on;
    buildUnlinkedTint();
    var btn = $("opt-unlinkedTintByFolder");
    if (btn) btn.setAttribute("aria-pressed", unlinkedTintByFolder ? "true" : "false");
    if (renderer) renderer.refresh();
    attempt2(placeLogo);
    attempt2(heatBuild);
    attempt2(buildLegend);
    if (persist && onUnlinkedTintByFolder) onUnlinkedTintByFolder(unlinkedTintByFolder);
    return unlinkedTintByFolder;
  }
  function savePng() {
    var canvases = renderer.getCanvases();
    var src = canvases.nodes;
    var out = DOC.createElement("canvas");
    out.width = src.width;
    out.height = src.height;
    var ctx = out.getContext("2d");
    ctx.fillStyle = css("--surface-1");
    ctx.fillRect(0, 0, out.width, out.height);
    var lg = $("logo");
    if (lg && logoMaskImg && logoMaskImg.complete && !lg.hidden) {
      var w = parseFloat(lg.style.width) || 0;
      var dpr = src.width / ($("graph").clientWidth || src.width);
      if (w > 0) {
        var side = Math.round(w * dpr);
        var layer = function(cols) {
          var lc = DOC.createElement("canvas");
          lc.width = side;
          lc.height = side;
          var lx = (
            /** @type {CanvasRenderingContext2D} */
            lc.getContext("2d")
          );
          var cx = side / 2, step = 2 * Math.PI / RING_BUCKETS;
          for (var i = 0; i < RING_BUCKETS; i++) {
            if (!cols[i]) continue;
            lx.beginPath();
            lx.moveTo(cx, cx);
            lx.arc(cx, cx, side, i * step - Math.PI / 2, (i + 1) * step - Math.PI / 2);
            lx.closePath();
            lx.fillStyle = cols[i];
            lx.fill();
          }
          var mm = [0, 0, 0], mk = 0;
          for (var j = 0; j < RING_BUCKETS; j++) {
            if (!cols[j]) continue;
            var cc = toRgb(cols[j]);
            mm[0] += cc[0];
            mm[1] += cc[1];
            mm[2] += cc[2];
            mk++;
          }
          if (mk) {
            var mr = Math.round(mm[0] / mk), mg = Math.round(mm[1] / mk), mb = Math.round(mm[2] / mk);
            var half = side / 2;
            var cg = lx.createRadialGradient(half, half, 0, half, half, half * CORE_FADE / 100);
            cg.addColorStop(0, "rgba(" + mr + "," + mg + "," + mb + ",1)");
            cg.addColorStop(CORE_SOLID / CORE_FADE, "rgba(" + mr + "," + mg + "," + mb + ",0.92)");
            cg.addColorStop(1, "rgba(" + mr + "," + mg + "," + mb + ",0)");
            lx.fillStyle = cg;
            lx.fillRect(0, 0, side, side);
          }
          lx.globalCompositeOperation = "destination-in";
          lx.drawImage(logoMaskImg, 0, 0, side, side);
          return lc;
        };
        var two = state.logoTwoRing;
        var base = layer(ringColorsSmooth());
        var innerRaw = two ? bandColors(true) : null;
        if (two && innerRaw) {
          var ic = layer(ringColorsSmooth(innerRaw));
          var ix = ic.getContext("2d");
          var f = LOGO_INNER_FADE.split(",");
          var r0f = parseFloat(f[0]) / 100 * (side / 2), r1f = parseFloat(f[1]) / 100 * (side / 2);
          var rg = ix.createRadialGradient(side / 2, side / 2, r0f, side / 2, side / 2, r1f);
          rg.addColorStop(0, "rgba(0,0,0,1)");
          rg.addColorStop(1, "rgba(0,0,0,0)");
          ix.globalCompositeOperation = "destination-in";
          ix.fillStyle = rg;
          ix.fillRect(0, 0, side, side);
          base.getContext("2d").drawImage(ic, 0, 0);
        }
        ctx.globalAlpha = 0.95;
        ctx.drawImage(
          base,
          (parseFloat(lg.style.left) - w / 2) * dpr,
          (parseFloat(lg.style.top) - w / 2) * dpr,
          side,
          side
        );
        ctx.globalAlpha = 1;
      }
    }
    ["edges", "nodes", "labels"].forEach(function(k) {
      if (canvases[k]) ctx.drawImage(canvases[k], 0, 0);
    });
    var a = DOC.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = "vault-graph.png";
    a.click();
  }
  function buildStats() {
    var s = DATA.stats;
    $("vname").textContent = DATA.vault + " graph";
    setHTML($("stats"), "<b>" + s.nodes + "</b> notes &middot; <b>" + s.edges + "</b> links &middot; <b>" + s.orphans + "</b> unlinked<br><b>" + s.unresolved + "</b> link(s) point at notes that do not exist" + (s.ghostsIncluded ? " (shown as ghosts)" : " (hidden)") + "<br>" + (s.templatesExcluded ? "Templates excluded. " : "") + "Generated " + esc(DATA.generated));
  }
  function esc(s) {
    return String(s).replace(
      /[&<>"']/g,
      /** @param {string} c */
      function(c) {
        var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return map[c];
      }
    );
  }
  var HEAT_WEEKS = 52;
  var HEAT_WEEKS_MIN = 8;
  var HEAT_GAP = 2, HEAT_CELL_MIN = 7, HEAT_CELL_MAX = 13;
  var HEAT_GUTTER = 18;
  var HEAT_MONTH_H = 12;
  var HEAT_ARROW_W = 9;
  var HEAT_EMPTY_A = 0.5;
  var DAY_MS = 864e5, WEEK_MS = 7 * DAY_MS;
  var MONTH_ABBR = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var heat = null;
  var heatSig = "";
  var heatRz = null;
  function heatParse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN;
  }
  function heatKey(ms) {
    var d = new Date(ms);
    var p = function(n) {
      return (n < 10 ? "0" : "") + n;
    };
    return d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate());
  }
  function heatMonday(ms) {
    return ms - (new Date(ms).getUTCDay() + 6) % 7 * DAY_MS;
  }
  function heatGeom() {
    var wrap = $("heatwrap");
    var avail = (wrap && wrap.clientWidth || $("stage").clientWidth || 900) - HEAT_GUTTER;
    avail -= HEAT_ARROW_W;
    var want = Math.floor((avail + HEAT_GAP) / (HEAT_CELL_MAX + HEAT_GAP));
    var span = dateSpan ? Math.ceil((dateSpan.hi - dateSpan.lo) / WEEK_MS) + 1 : HEAT_WEEKS;
    var cols = Math.max(HEAT_WEEKS_MIN, Math.min(HEAT_WEEKS, span, want));
    var cell = Math.floor((avail - (cols - 1) * HEAT_GAP) / cols);
    return { cols, cell: Math.max(HEAT_CELL_MIN, Math.min(HEAT_CELL_MAX, cell)) };
  }
  function heatBuild() {
    var wrap = $("heatwrap"), cv = $("heatc");
    if (!wrap || !cv) return;
    var g = heatGeom();
    var cols = g.cols, cell = g.cell;
    var pitch = cell + HEAT_GAP;
    var endMs = state.heatEnd === null ? heatParse(TODAY) : state.heatEnd;
    var start = heatMonday(endMs) - (cols - 1) * WEEK_MS;
    var days = dict();
    var keys = [];
    for (var c = 0; c < cols; c++) {
      for (var r = 0; r < 7; r++) {
        var ms = start + c * WEEK_MS + r * DAY_MS;
        var k = heatKey(ms);
        days[k] = { key: k, ms, col: c, row: r, ids: [], parts: [], n: 0 };
        keys.push(k);
      }
    }
    var before = 0, after = 0, undated = 0;
    var all = dict();
    graph.forEachNode(function(id, a) {
      var k2 = a.created;
      if (!heatParse(k2)) {
        undated++;
        return;
      }
      all[k2] = (all[k2] || 0) + 1;
      var d = days[k2];
      if (d) d.ids.push(id);
      else if (heatParse(k2) < start) before++;
      else after++;
    });
    var counts2 = [];
    for (var kk in all) counts2.push(all[kk]);
    counts2.sort(function(x, y) {
      return x - y;
    });
    var q = function(p) {
      return counts2.length ? counts2[Math.min(counts2.length - 1, Math.floor(p * counts2.length))] : 1;
    };
    var cuts = [q(0.2), q(0.4), q(0.6), q(0.8)];
    var nMax = 1;
    for (var w = 0; w < keys.length; w++) {
      var wn = days[keys[w]].ids.length;
      if (wn > nMax) nMax = wn;
    }
    heat = {
      cols,
      cell,
      pitch,
      start,
      days,
      keys,
      cuts,
      nMax,
      before,
      after,
      undated,
      dated: counts2.length,
      w: HEAT_GUTTER + cols * pitch - HEAT_GAP + HEAT_ARROW_W,
      h: HEAT_MONTH_H + 7 * pitch - HEAT_GAP
    };
    var hkey = dict();
    graph.forEachNode(function(id) {
      var c2 = nodeColor(id), l = hex2lab(c2);
      hkey[id] = [hueOf(c2), l[0]];
    });
    keys.forEach(function(k2) {
      days[k2].ids.sort(function(a, b) {
        return hkey[a][0] - hkey[b][0] || hkey[a][1] - hkey[b][1];
      });
    });
    var dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(heat.w * dpr);
    cv.height = Math.round(heat.h * dpr);
    cv.style.width = heat.w + "px";
    cv.style.height = heat.h + "px";
    var inWin = 0;
    for (var i = 0; i < keys.length; i++) inWin += days[keys[i]].ids.length;
    $("heatnote").textContent = "last " + cols + " weeks \xB7 " + inWin + " of " + graph.order + " notes" + (before ? " \xB7 " + before + " earlier" : "") + (after ? " \xB7 " + after + " later" : "") + (undated ? " \xB7 " + undated + " undated" : "");
    heatSig = "";
    heatDraw();
  }
  function heatLevel(n) {
    var c = heat.cuts;
    for (var i = 0; i < c.length; i++) if (n <= c[i]) return i;
    return c.length;
  }
  function heatTile(ctx, x, y, side, parts) {
    var n = parts.length;
    if (!n) return;
    var cols = Math.max(1, Math.round(Math.sqrt(n)));
    for (var c = 0; c < cols; c++) {
      var i0 = Math.floor(c * n / cols), i1 = Math.floor((c + 1) * n / cols);
      if (i1 <= i0) continue;
      var x0 = x + side * c / cols, x1 = x + side * (c + 1) / cols;
      var m = i1 - i0;
      for (var j = 0; j < m; j++) {
        var q = parts[i0 + j];
        var y0 = y + side * j / m, y1 = y + side * (j + 1) / m;
        ctx.globalAlpha = q.w;
        ctx.fillStyle = q.c;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
    ctx.globalAlpha = 1;
  }
  function heatCompute() {
    for (var i = 0; i < heat.keys.length; i++) {
      var d = heat.days[heat.keys[i]];
      d.n = 0;
      d.parts.length = 0;
      for (var j = 0; j < d.ids.length; j++) {
        var id = d.ids[j], w = alpha[id] || 0;
        if (w <= 4e-3) continue;
        d.n += w;
        d.parts.push({ c: nodeColor(id), w });
      }
    }
  }
  function heatDraw() {
    var cv = (
      /** @type {HTMLCanvasElement} */
      $("heatc")
    );
    if (!heat || !cv || !cv.getContext) return;
    heatCompute();
    var sig = [];
    for (var i = 0; i < heat.keys.length; i++) {
      sig.push(Math.ceil(heat.days[heat.keys[i]].n * 4));
    }
    sig.push(state.markDay || "", state.hoverDay || "", heat.cell);
    sig = sig.join(",");
    if (sig === heatSig) return;
    heatSig = sig;
    var dpr = window.devicePixelRatio || 1;
    var ctx = (
      /** @type {CanvasRenderingContext2D} */
      cv.getContext("2d")
    );
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, heat.w, heat.h);
    var cell = heat.cell, pitch = heat.pitch;
    var R = Math.max(2, Math.round(cell * 0.22));
    var td = heat.days[TODAY];
    ctx.font = "9px ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = THEME.text;
    ctx.globalAlpha = 0.45;
    var lastEnd = -99;
    for (var c = 0; c < heat.cols; c++) {
      var first = new Date(heat.start + c * WEEK_MS);
      if (first.getUTCDate() > 7) continue;
      var x = HEAT_GUTTER + c * pitch;
      if (x < lastEnd + 4) continue;
      var lab2 = MONTH_ABBR[first.getUTCMonth()];
      ctx.fillText(lab2, x, HEAT_MONTH_H - 3);
      lastEnd = x + ctx.measureText(lab2).width;
    }
    ctx.globalAlpha = 1;
    if (td) {
      var ax = HEAT_GUTTER + heat.cols * pitch - HEAT_GAP;
      var ay = HEAT_MONTH_H + td.row * pitch + cell / 2;
      ctx.fillStyle = THEME.today;
      ctx.beginPath();
      ctx.moveTo(ax + 2.5, ay);
      ctx.lineTo(ax + HEAT_ARROW_W - 1, ay - 3.5);
      ctx.lineTo(ax + HEAT_ARROW_W - 1, ay + 3.5);
      ctx.closePath();
      ctx.fill();
    }
    var INIT = ["M", "", "W", "", "F", "", ""];
    ctx.fillStyle = THEME.text;
    ctx.globalAlpha = 0.45;
    for (var r = 0; r < 7; r++) {
      if (INIT[r]) ctx.fillText(INIT[r], 0, HEAT_MONTH_H + r * pitch + cell - 1);
    }
    ctx.globalAlpha = 1;
    for (var i2 = 0; i2 < heat.keys.length; i2++) {
      var d = heat.days[heat.keys[i2]];
      var x2 = HEAT_GUTTER + d.col * pitch, y2 = HEAT_MONTH_H + d.row * pitch;
      ctx.globalAlpha = HEAT_EMPTY_A;
      ctx.fillStyle = THEME.dim;
      heatRect(ctx, x2, y2, cell, cell, R);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (d.n > 4e-3) {
        ctx.save();
        heatRect(ctx, x2, y2, cell, cell, R);
        ctx.clip();
        heatTile(ctx, x2, y2, cell, d.parts);
        ctx.restore();
      }
      if (d.key === state.markDay) {
        ctx.strokeStyle = THEME.today;
        ctx.lineWidth = 1.5;
        heatRect(ctx, x2 - 1, y2 - 1, cell + 2, cell + 2, R + 1);
        ctx.stroke();
      } else if (d.key === state.hoverDay) {
        ctx.strokeStyle = THEME.today;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1;
        heatRect(ctx, x2 - 1, y2 - 1, cell + 2, cell + 2, R + 1);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (d.key === TODAY) {
        ctx.strokeStyle = THEME.today;
        ctx.lineWidth = 1;
        heatRect(ctx, x2 - 1, y2 - 1, cell + 2, cell + 2, R + 1);
        ctx.stroke();
      }
    }
    heatDrawKey(cell, R);
  }
  function heatDrawKey(cell, R) {
    var cv = (
      /** @type {HTMLCanvasElement} */
      $("heatkey")
    );
    if (!cv || !cv.getContext) return;
    var anchors = [];
    heat.cuts.concat([heat.nMax]).forEach(function(a) {
      if (anchors.indexOf(a) < 0) anchors.push(a);
    });
    var pitch = cell + 4;
    var dpr = window.devicePixelRatio || 1;
    var w = anchors.length * pitch - 4;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(cell * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(cell * dpr);
      cv.style.width = w + "px";
      cv.style.height = cell + "px";
    }
    var ctx = (
      /** @type {CanvasRenderingContext2D} */
      cv.getContext("2d")
    );
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, cell);
    var greys = [THEME.neutrals[0], THEME.neutrals[2]];
    for (var i = 0; i < anchors.length; i++) {
      var parts = [];
      for (var j = 0; j < anchors[i]; j++) parts.push({ c: greys[j % 2], w: 1 });
      ctx.save();
      heatRect(ctx, i * pitch, 0, cell, cell, R);
      ctx.clip();
      heatTile(ctx, i * pitch, 0, cell, parts);
      ctx.restore();
    }
    cv.title = anchors.map(function(a) {
      return a + (a === 1 ? " note" : " notes");
    }).join("  \xB7  ");
  }
  function heatRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function heatHit(ev) {
    if (!heat) return null;
    var b = $("heatc").getBoundingClientRect();
    var x = ev.clientX - b.left - HEAT_GUTTER, y = ev.clientY - b.top - HEAT_MONTH_H;
    if (x < 0 || y < 0) return null;
    var c = Math.floor(x / heat.pitch), r = Math.floor(y / heat.pitch);
    if (c < 0 || c >= heat.cols || r < 0 || r > 6) return null;
    if (x - c * heat.pitch > heat.cell || y - r * heat.pitch > heat.cell) return null;
    return heat.days[heatKey(heat.start + c * WEEK_MS + r * DAY_MS)] || null;
  }
  var HEAT_WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function heatShowTip(d) {
    var t = $("htip"), n = Math.round(d.n);
    var by = dict();
    for (var i = 0; i < d.ids.length; i++) {
      if ((alpha[d.ids[i]] || 0) <= 4e-3) continue;
      var g = groupOf(d.ids[i]);
      by[g] = (by[g] || 0) + 1;
    }
    var top = Object.keys(by).sort(function(a, b) {
      return by[b] - by[a];
    }).slice(0, 3);
    var wd = HEAT_WD[(new Date(d.ms).getUTCDay() + 6) % 7];
    setHTML(t, '<div class="t">' + esc(d.key) + " \xB7 " + wd + (d.key === TODAY ? " \xB7 today" : "") + '</div><div class="m">' + (n ? n + " note" + (n === 1 ? "" : "s") + " added" : "nothing added") + (top.length ? "<br>" + top.map(function(g2) {
      return '<b style="color:' + colorOf(g2) + '">\u25A0 </b> ' + esc(g2) + " " + by[g2];
    }).join("<br>") : "") + (n ? "<br><i>click to mark them on the disc</i>" : "") + "</div>");
    t.hidden = false;
    var box = t.getBoundingClientRect();
    var host = $("heat").getBoundingClientRect(), cv = $("heatc").getBoundingClientRect();
    var cx = cv.left - host.left + HEAT_GUTTER + d.col * heat.pitch + heat.cell / 2;
    var cy = cv.top - host.top + HEAT_MONTH_H + d.row * heat.pitch;
    t.style.left = Math.max(4, Math.min(cx - box.width / 2, host.width - box.width - 4)) + "px";
    var above = cy - box.height - 8;
    t.style.top = (above >= 2 ? above : cy + heat.cell + 8) + "px";
  }
  function buildHeatmapUI() {
    var cv = (
      /** @type {HTMLCanvasElement} */
      $("heatc")
    );
    var setHover = function(key) {
      if (state.hoverDay === key) return;
      state.hoverDay = key;
      heatSig = "";
      renderer.refresh();
    };
    cv.addEventListener("mousemove", function(ev) {
      var d = heatHit(ev);
      if (d) heatShowTip(d);
      else $("htip").hidden = true;
      cv.style.cursor = d && d.n > 4e-3 ? "pointer" : "default";
      setHover(d && d.n > 4e-3 ? d.key : null);
    });
    cv.addEventListener("mouseleave", function() {
      $("htip").hidden = true;
      setHover(null);
    });
    cv.addEventListener("click", function(ev) {
      var d = heatHit(ev);
      if (!d || d.n <= 4e-3) return;
      state.markDay = state.markDay === d.key ? null : d.key;
      heatSig = "";
      renderer.refresh();
    });
    var reflow = function() {
      if (dead) return;
      if (heatRz) WIN.clearTimeout(heatRz);
      heatRz = WIN.setTimeout(function() {
        heatRz = null;
        var g = heatGeom();
        if (heat && g.cell === heat.cell && g.cols === heat.cols) return;
        heatBuild();
      }, 60);
    };
    if (window.ResizeObserver) {
      var heatRO = new ResizeObserver(reflow);
      heatRO.observe($("heatwrap"));
      onDestroy.push(function() {
        heatRO.disconnect();
      });
    } else {
      window.addEventListener("resize", reflow);
      onDestroy.push(function() {
        window.removeEventListener("resize", reflow);
      });
    }
    onDestroy.push(function() {
      if (heatRz) {
        WIN.clearTimeout(heatRz);
        heatRz = null;
      }
    });
  }
  var DEMO_DONE_TITLE = "vault-graph demo complete";
  var RIBBON_BARS = 26;
  var RIBBON_TRACK = 14;
  var RIBBON_H = RIBBON_BARS + RIBBON_TRACK;
  var GRAB_PX = 6;
  var DRAG_MIN = 3;
  var brushDrag = null;
  var brushSweep = null;
  function drawDateUI() {
    ribW = measureRibbon() || ribW;
    drawRibbon();
    buildYears();
  }
  function buildYears() {
    var host = $("years");
    if (!host) return;
    if (!dateSpan || !dateSpan.years.length) {
      host.textContent = "";
      return;
    }
    var w = ribbonW();
    var positions = dateSpan.years.map(function(yy) {
      return Math.max(0, Math.min(w, ribbonX(Date.UTC(yy.y, 0, 1), w)));
    });
    var minGap = Infinity;
    for (var gi = 1; gi < positions.length; gi++) {
      minGap = Math.min(minGap, positions[gi] - positions[gi - 1]);
    }
    var every = positions.length > 1 && minGap < 28 ? 2 : 1;
    var cur = null;
    var cf = state.from === null ? dateSpan.lo : state.from;
    var ct = state.to === null ? dateSpan.hi : state.to;
    var ca = new Date(cf), cb = new Date(ct);
    if (ca.getUTCFullYear() === cb.getUTCFullYear() && ca.getUTCMonth() === 0 && ca.getUTCDate() === 1 && (cb.getUTCMonth() === 11 && cb.getUTCDate() === 31 || ct >= dateSpan.hi)) cur = ca.getUTCFullYear();
    var made = [];
    dateSpan.years.forEach(function(yy, yi) {
      if (yy.y % every !== 0) return;
      var at = positions[yi];
      var b = DOC.createElement("button");
      b.type = "button";
      b.setAttribute("data-yr", String(yy.y));
      b.setAttribute("aria-pressed", cur === yy.y ? "true" : "false");
      b.title = yy.y + " -- " + yy.n + " note" + (yy.n === 1 ? "" : "s");
      b.style.setProperty("left", Math.round(at) + "px");
      b.textContent = "'" + String(yy.y).slice(2);
      made.push(b);
    });
    host.replaceChildren.apply(host, made);
  }
  function fitCanvas(cv, w, h) {
    var dpr = Math.min(2, WIN.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.width = w + "px";
    cv.style.height = h + "px";
    var cx = (
      /** @type {CanvasRenderingContext2D} */
      cv.getContext("2d")
    );
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, w, h);
    return cx;
  }
  function dateRamp(t) {
    return t <= 0 ? css("--dim") : mixHex(css("--surface-2"), css("--accent"), 0.25 + 0.75 * Math.min(1, t));
  }
  function scrubColor() {
    return mixHex(css("--accent"), css("--text-1"), 0.3);
  }
  function rgbaHex(hex, a) {
    var c = toRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }
  var ribW = 0;
  function measureRibbon() {
    var cv = (
      /** @type {HTMLCanvasElement} */
      $("ribbon")
    );
    if (!cv) return 0;
    var keep = cv.style.width;
    cv.style.removeProperty("width");
    var w = cv.getBoundingClientRect().width;
    if (keep) cv.style.setProperty("width", keep);
    return w;
  }
  function ribbonW() {
    if (!ribW) ribW = measureRibbon();
    return ribW || 600;
  }
  function ribbonXLinear(ms, w) {
    var span = dateSpan.hi - dateSpan.lo;
    return span > 0 ? (ms - dateSpan.lo) / span * w : 0;
  }
  function ribbonMsLinear(x, w) {
    return dateSpan.lo + Math.max(0, Math.min(w, x)) / w * (dateSpan.hi - dateSpan.lo);
  }
  function monthIndexOfMs(ms) {
    var d = new Date(ms), m0 = new Date(dateSpan.months[0].ms);
    var idx = (d.getUTCFullYear() - m0.getUTCFullYear()) * 12 + (d.getUTCMonth() - m0.getUTCMonth());
    return Math.max(0, Math.min(dateSpan.months.length - 1, idx));
  }
  function monthEndMs(i) {
    return i + 1 < dateSpan.months.length ? dateSpan.months[i + 1].ms : dateSpan.hi;
  }
  function segSpanMs(seg) {
    return [dateSpan.months[seg.i].ms, monthEndMs(seg.i)];
  }
  function ribbonXCompact(ms, w) {
    var ax = dateSpan.axis, seg = ax.segs[ax.segOfMonth[monthIndexOfMs(ms)]];
    var span = segSpanMs(seg), lo = span[0], hi = span[1];
    var frac = hi > lo ? Math.max(0, Math.min(1, (ms - lo) / (hi - lo))) : 0;
    var wPos = seg.w0 + frac * (seg.w1 - seg.w0);
    return wPos / ax.totalW * w;
  }
  function ribbonMsCompact(x, w) {
    var ax = dateSpan.axis, xc = Math.max(0, Math.min(w, x));
    var wPos = xc / w * ax.totalW, segs = ax.segs, seg = segs[segs.length - 1];
    for (var i = 0; i < segs.length; i++) {
      if (wPos <= segs[i].w1) {
        seg = segs[i];
        break;
      }
    }
    var frac = seg.w1 > seg.w0 ? Math.max(0, Math.min(1, (wPos - seg.w0) / (seg.w1 - seg.w0))) : 0;
    var span = segSpanMs(seg);
    return span[0] + frac * (span[1] - span[0]);
  }
  function ribbonX(ms, w) {
    return compactAxis && dateSpan.axis ? ribbonXCompact(ms, w) : ribbonXLinear(ms, w);
  }
  function ribbonMs(x, w) {
    return compactAxis && dateSpan.axis ? ribbonMsCompact(x, w) : ribbonMsLinear(x, w);
  }
  function brushEnds() {
    if (brushDrag && brushDrag.pFrom !== void 0) return [brushDrag.pFrom, brushDrag.pTo];
    if (brushSweep !== null) return [dateSpan.lo, brushSweep];
    return [
      state.from === null ? dateSpan.lo : state.from,
      state.to === null ? dateSpan.hi : state.to
    ];
  }
  function winEndNow() {
    if (state.heatEnd !== null) return state.heatEnd;
    return heat ? heat.start + heat.cols * WEEK_MS : heatParse(TODAY);
  }
  function paintMonthBar(cx, top, m, x, bw) {
    var t = Math.min(1, m.n / dateSpan.nRef);
    var bh = m.n ? Math.max(1.5, (top - 2) * t) : 0;
    cx.fillStyle = m.n ? dateRamp(t) : css("--dim");
    cx.fillRect(x, top - bh, bw, bh || 1);
  }
  function drawRibbon() {
    var cv = (
      /** @type {HTMLCanvasElement} */
      $("ribbon")
    );
    if (!cv || !dateSpan) return;
    var w = Math.max(200, ribbonW());
    var cx = fitCanvas(cv, w, RIBBON_H);
    var top = RIBBON_BARS;
    var ms = dateSpan.months, n = ms.length;
    var useCompact = compactAxis && dateSpan.axis;
    if (useCompact) {
      var segs = dateSpan.axis.segs, totalW = dateSpan.axis.totalW;
      for (var si = 0; si < segs.length; si++) {
        var seg = segs[si];
        var segX = seg.w0 / totalW * w;
        var segW = Math.max(1, (seg.w1 - seg.w0) / totalW * w - 0.6);
        paintMonthBar(cx, top, ms[seg.i], segX, segW);
      }
      for (var j = 0; j < n; j++) {
        if (ms[j].m !== 0) continue;
        var jSeg = segs[dateSpan.axis.segOfMonth[j]];
        cx.fillStyle = rgbaHex(css("--text-3"), 0.28);
        cx.fillRect(jSeg.w0 / totalW * w, 0, 1, top);
      }
    } else {
      for (var i = 0; i < n; i++) {
        var bx = ribbonXLinear(ms[i].ms, w);
        paintMonthBar(cx, top, ms[i], bx, Math.max(1, ribbonXLinear(monthEndMs(i), w) - bx - 0.6));
      }
      for (var j2 = 0; j2 < n; j2++) {
        if (ms[j2].m !== 0) continue;
        cx.fillStyle = rgbaHex(css("--text-3"), 0.28);
        cx.fillRect(ribbonXLinear(ms[j2].ms, w), 0, 1, top);
      }
    }
    var tw = winTrack(w);
    cx.fillStyle = rgbaHex(css("--text-3"), 0.16);
    heatRect(cx, 0, tw.y + tw.h / 2 - 1, w, 2, 1);
    cx.fill();
    var pillW = Math.max(10, tw.x1 - tw.x0);
    cx.fillStyle = scrubColor();
    cx.globalAlpha = brushDrag && brushDrag.mode === "win" ? 1 : 0.86;
    heatRect(cx, tw.x0, tw.y, pillW, tw.h, tw.h / 2);
    cx.fill();
    cx.globalAlpha = 1;
    cx.strokeStyle = rgbaHex(css("--surface-0"), 0.9);
    cx.lineWidth = 1;
    heatRect(cx, tw.x0, tw.y, pillW, tw.h, tw.h / 2);
    cx.stroke();
    var e = brushEnds(), x0 = ribbonX(e[0], w), x1 = ribbonX(e[1], w);
    cx.fillStyle = rgbaHex(css("--surface-0"), 0.72);
    cx.fillRect(0, 0, x0, top);
    cx.fillRect(x1, 0, w - x1, top);
    var col = scrubColor(), rim = rgbaHex(css("--surface-0"), 0.92);
    var gw = 9, gh = Math.max(12, top - 8), gy = (top - gh) / 2;
    [x0, x1].forEach(function(x) {
      var gx = Math.max(0, Math.min(w - gw, x - gw / 2));
      cx.fillStyle = rim;
      cx.fillRect(x - 2.5, 0, 5, top);
      cx.fillStyle = col;
      cx.fillRect(x - 1.5, 0, 3, top);
      heatRect(cx, gx, gy, gw, gh, 3);
      cx.fill();
      cx.strokeStyle = rim;
      cx.lineWidth = 1;
      heatRect(cx, gx, gy, gw, gh, 3);
      cx.stroke();
      cx.fillStyle = rim;
      cx.fillRect(gx + gw / 2 - 2, gy + gh / 2 - 3, 1, 6);
      cx.fillRect(gx + gw / 2 + 1, gy + gh / 2 - 3, 1, 6);
    });
  }
  function rebuildBand() {
    var endMs = state.heatEnd === null ? heatParse(TODAY) : state.heatEnd;
    var wantStart = heatMonday(endMs) - ((heat ? heat.cols : HEAT_WEEKS) - 1) * WEEK_MS;
    var moved = !heat || heat.start !== wantStart;
    if (moved) heatBuild();
    drawDateUI();
    if (moved) heatDraw();
  }
  function winTrack(w) {
    var span = (heat ? heat.cols : HEAT_WEEKS) * WEEK_MS;
    var end = winEndNow();
    return {
      x0: ribbonX(end - span, w),
      x1: ribbonX(end, w),
      y: RIBBON_BARS + 2,
      h: RIBBON_TRACK - 5
    };
  }
  function inWinTrack(y) {
    return y >= RIBBON_BARS && y < RIBBON_BARS + RIBBON_TRACK;
  }
  function winSpan() {
    return (heat ? heat.cols : HEAT_WEEKS) * WEEK_MS;
  }
  function clampWinEnd(ms) {
    var todayMs = heatParse(TODAY);
    var lo = dateSpan.lo + winSpan();
    return Math.max(Math.min(ms, todayMs), Math.min(lo, todayMs));
  }
  function winEndCentredAtPx(px, w) {
    var span = winSpan(), todayMs = heatParse(TODAY);
    var lo = Math.min(dateSpan.lo + span, todayMs), hi = todayMs;
    if (lo >= hi) return clampWinEnd(hi);
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) / 2;
      var midPx = (ribbonX(mid - span, w) + ribbonX(mid, w)) / 2;
      if (midPx < px) lo = mid;
      else hi = mid;
    }
    return clampWinEnd((lo + hi) / 2);
  }
  function brushHit(x, w, y) {
    if (y !== void 0 && inWinTrack(y)) return "win";
    var e = brushEnds(), x0 = ribbonX(e[0], w), x1 = ribbonX(e[1], w);
    var d0 = Math.abs(x - x0), d1 = Math.abs(x - x1);
    if (d0 <= GRAB_PX || d1 <= GRAB_PX) return d0 <= d1 ? "from" : "to";
    if (x > x0 && x < x1) {
      return state.from === null && state.to === null ? "new" : "body";
    }
    return "new";
  }
  function showRTip(x, text) {
    var t = $("rtip"), rib = $("ribbon"), band = $("heat");
    if (!t || !rib || !band) return;
    setHTML(t, esc(text));
    t.hidden = false;
    var bb = band.getBoundingClientRect(), rb = rib.getBoundingClientRect();
    var tb = t.getBoundingClientRect();
    var left = Math.max(4, Math.min(bb.width - tb.width - 4, rb.left - bb.left + x - tb.width / 2));
    t.style.left = left + "px";
    t.style.top = rb.top - bb.top - tb.height - 3 + "px";
  }
  function hideRTip() {
    var t = $("rtip");
    if (t) t.hidden = true;
  }
  function isoDay(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }
  function winLabel() {
    if (!heat) return "";
    return isoDay(heat.start) + "  \u2192  " + isoDay(heat.start + heat.cols * WEEK_MS - DAY_MS);
  }
  function buildDateUI() {
    var rib = $("ribbon");
    if (!rib) return;
    var onFrame = makeFrameCoalescer();
    $("rangeall").onclick = function() {
      state.from = null;
      state.to = null;
      state.heatEnd = null;
      heatBuild();
      applyRange();
      heatDraw();
    };
    var fieldMs = function(el) {
      var v = el && el.value;
      if (!v) return null;
      var t = heatParse(v);
      return isFinite(t) ? t : null;
    };
    ["from", "to"].forEach(function(which) {
      var el = $(which);
      if (!el) return;
      el.onchange = function() {
        setRangeMs(fieldMs($("from")), fieldMs($("to")));
      };
    });
    var xOf = function(ev) {
      return ev.clientX - rib.getBoundingClientRect().left;
    };
    var yOf = function(ev) {
      return ev.clientY - rib.getBoundingClientRect().top;
    };
    rib.addEventListener("pointerdown", function(ev) {
      if (!dateSpan) return;
      var w = ribbonW(), x = xOf(ev), mode = brushHit(x, w, yOf(ev)), e = brushEnds();
      brushDrag = {
        mode,
        x0: ev.clientX,
        moved: false,
        anchor: mode === "from" ? e[1] : e[0],
        from0: e[0],
        to0: e[1],
        grab: ribbonMs(x, w),
        winEnd0: heat ? heat.start + heat.cols * WEEK_MS : 0
      };
      attempt2(function() {
        rib.setPointerCapture(ev.pointerId);
      });
      rib.setAttribute("data-grab", mode === "win" ? "moving" : mode === "body" ? "moving" : "edge");
      if (mode === "win") {
        state.heatEnd = winEndCentredAtPx(x, w);
        rebuildBand();
        showRTip(x, winLabel());
      }
    });
    rib.addEventListener("pointermove", function(ev) {
      if (!brushDrag) {
        if (dateSpan) {
          var x = xOf(ev), w2 = ribbonW(), m = brushHit(x, w2, yOf(ev));
          if (m === "win") rib.setAttribute("data-grab", "body");
          else if (m === "from" || m === "to") rib.setAttribute("data-grab", "edge");
          else if (m === "body") rib.setAttribute("data-grab", "body");
          else rib.removeAttribute("data-grab");
          showRTip(x, m === "win" ? winLabel() : isoDay(ribbonMs(x, w2)));
        }
        return;
      }
      if (Math.abs(ev.clientX - brushDrag.x0) > DRAG_MIN) brushDrag.moved = true;
      if (!brushDrag.moved) return;
      var w = ribbonW(), here = ribbonMs(xOf(ev), w);
      var lo;
      var hi;
      var follow;
      if (brushDrag.mode === "win") {
        var wx = xOf(ev);
        onFrame(function() {
          if (!brushDrag) return;
          state.heatEnd = winEndCentredAtPx(wx, w);
          rebuildBand();
          showRTip(wx, winLabel());
        });
        return;
      }
      if (brushDrag.mode === "body") {
        var d = here - brushDrag.grab;
        var width = brushDrag.to0 - brushDrag.from0;
        lo = Math.max(dateSpan.lo, Math.min(dateSpan.hi - width, brushDrag.from0 + d));
        hi = lo + width;
        follow = hi;
      } else if (brushDrag.mode === "from" || brushDrag.mode === "to") {
        lo = Math.min(brushDrag.anchor, here);
        hi = Math.max(brushDrag.anchor, here);
        follow = here;
      } else {
        lo = Math.min(brushDrag.grab, here);
        hi = Math.max(brushDrag.grab, here);
        follow = here;
      }
      var mode = (
        /** @type {string} */
        brushDrag.mode
      );
      brushDrag.pFrom = lo;
      brushDrag.pTo = hi;
      onFrame(function() {
        if (!brushDrag) return;
        showRTip(
          ribbonX(follow, w),
          mode === "body" ? isoDay(lo) + "  \u2192  " + isoDay(hi) : isoDay(follow)
        );
        drawDateUI();
        var el = $("rangenote");
        if (el) el.textContent = isoDay(lo) + "  \u2192  " + isoDay(hi);
      });
    });
    var endDrag = function(ev) {
      if (!brushDrag) return;
      var d = brushDrag;
      brushDrag = null;
      rib.removeAttribute("data-grab");
      hideRTip();
      attempt2(function() {
        rib.releasePointerCapture(ev.pointerId);
      });
      if (d.mode === "win") return;
      if (d.moved && d.pFrom !== void 0) {
        state.from = d.pFrom <= dateSpan.lo ? null : d.pFrom;
        state.to = d.pTo >= dateSpan.hi ? null : d.pTo;
        applyRange();
      } else {
        rangeChrome();
      }
    };
    rib.addEventListener("pointerup", endDrag);
    rib.addEventListener("pointercancel", endDrag);
    rib.addEventListener("pointerleave", function() {
      if (!brushDrag) hideRTip();
    });
    var yrHost = $("years");
    var hoverYear = function(yr) {
      if (state.hoverYear === yr) return;
      state.hoverYear = yr;
      if (renderer) renderer.refresh();
    };
    if (yrHost) {
      var yrOf = function(ev) {
        var t = (
          /** @type {Element | null} */
          ev.target
        );
        var b = t && t.closest && t.closest("button[data-yr]");
        return b ? b.getAttribute("data-yr") : null;
      };
      yrHost.addEventListener("click", function(ev) {
        var yr = yrOf(ev);
        if (yr === null) return;
        state.hoverYear = null;
        setRangeMs(Date.UTC(+yr, 0, 1), Date.UTC(+yr, 11, 31));
      });
      yrHost.addEventListener("pointerover", function(ev) {
        hoverYear(yrOf(ev));
      });
      yrHost.addEventListener("pointerout", function(ev) {
        if (!ev.relatedTarget || !yrHost.contains(ev.relatedTarget)) hoverYear(null);
      });
    }
    var onSlot = function() {
      if (dead) return;
      var w = measureRibbon();
      if (w && Math.abs(w - ribW) < 0.5) return;
      ribW = w;
      drawDateUI();
    };
    var winRO = (
      /** @type {{ ResizeObserver?: new (cb: () => void) => { observe: (el: Element) => void, disconnect: () => void } }} */
      WIN
    );
    if (winRO.ResizeObserver) {
      var slotRO = new winRO.ResizeObserver(onSlot);
      slotRO.observe($("heat"));
      onDestroy.push(function() {
        slotRO.disconnect();
      });
    } else {
      WIN.addEventListener("resize", onSlot);
      onDestroy.push(function() {
        WIN.removeEventListener("resize", onSlot);
      });
    }
    applyRange();
  }
  function wantWedgeDebug() {
    var q = String(WIN.location ? WIN.location.search : "") + " " + String(WIN.location ? WIN.location.hash : "");
    if (/(^|[?&#])nowedges\b/.test(q)) return false;
    if (/(^|[?&#])wedges\b/.test(q)) return true;
    return !!(DATA && DATA.dev);
  }
  function restOn() {
    return /(^|[?&#])rest\b/.test(String(location.search) + " " + String(location.hash));
  }
  function rowArcOn() {
    return /(^|[?&#])rowarc/.test(String(location.search) + " " + String(location.hash));
  }
  function demoOn() {
    return /(^|[?&#])demo\b/.test(String(location.search) + " " + String(location.hash));
  }
  var bootTimer = WIN.setTimeout(function() {
    if (dead) return;
    makeRenderer();
    API = window.__vg = {
      graph,
      readTheme,
      get renderer() {
        return renderer;
      },
      placeLogo,
      palette: paletteInfo,
      groupOrder: function() {
        return (order[state.dim] || []).slice();
      },
      groupCount: (
        /** @param {string} g */
        function(g) {
          return counts[g] || 0;
        }
      ),
      slotOf: (
        /** @param {string} g */
        function(g) {
          return groupSlot[g] || "";
        }
      ),
      autoSlotOf: (
        /** @param {string} g */
        function(g) {
          return groupAutoSlot[g] || "";
        }
      ),
      setFolderColors: applyFolderColors,
      setSubfolderColors: applySubfolderColors,
      setFolderShown: applyFolderShown,
      setPanEnabled: function(v) {
        return setPan(v !== false, false);
      },
      // github#23
      setCompactAxis: function(v) {
        return setCompactAxis(v !== false, false);
      },
      // github#3
      setUnlinkedByFolder: function(v) {
        return setUnlinkedByFolder(v !== false, false, true);
      },
      // github#41, design/0011
      setFitCap: function(v) {
        return setFitCap(v === true);
      },
      setUnlinkedTintByFolder: function(v) {
        return setUnlinkedTintByFolder(v === true, false);
      },
      applyHiddenDefaults: function() {
        seedHidden();
        buildLegend();
        cascade(null, { colToggle: true });
      },
      heatBuild,
      checkPlanParity: function() {
        var shown = 0;
        graph.forEachNode(function(id) {
          if (visible(id)) shown++;
        });
        var ov = true;
        var stat = buildWedgePlan(ov, function(id) {
          return visible(id) ? 1 : 0;
        });
        var live = buildWedgePlan(ov, function(id) {
          return alpha[id] || 0;
        });
        var diffs = {};
        var rows = function(p) {
          var m = {};
          p.cells.forEach(function(c) {
            m[c.k] = c.rows;
          });
          return m;
        };
        var rs = rows(stat), rl = rows(live);
        Object.keys(rs).concat(Object.keys(rl)).forEach(function(k) {
          if (rs[k] !== rl[k]) diffs[k] = { staticPlan: rs[k], livePlan: rl[k] };
        });
        var out = {
          shown,
          threshold: Math.round(graph.order * REPACK_BELOW),
          onlyVisible: ov,
          staticMaxR: Math.round(stat.maxR),
          liveMaxR: Math.round(live.maxR),
          maxRMatches: Math.round(stat.maxR) === Math.round(live.maxR),
          cellsStatic: stat.cells.length,
          cellsLive: live.cells.length,
          rowDiffs: diffs,
          parityOK: Object.keys(diffs).length === 0 && Math.round(stat.maxR) === Math.round(live.maxR)
        };
        return out;
      },
      checkFocusWeb: function() {
        var best = null, bd = -1;
        graph.forEachNode(function(id) {
          var d = renderer.getNodeDisplayData(id);
          if (!d || d.hidden) return;
          if (graph.degree(id) > bd) {
            bd = graph.degree(id);
            best = id;
          }
        });
        var keepSel = state.selected, keepHov = state.hovered;
        state.selected = best;
        state.hovered = null;
        renderer.refresh({ skipIndexation: true });
        renderer.render();
        var cv = renderer.getCanvases();
        var order2 = ["edges", "nodes", "edgeLabels", "labels", "hovers", "hoverNodes"];
        var W = cv.nodes.width, H = cv.nodes.height, dpr = W / renderer.getDimensions().width;
        var off = DOC.createElement("canvas");
        off.width = W;
        off.height = H;
        var ctx = off.getContext("2d");
        ctx.fillStyle = css("--surface-1");
        ctx.fillRect(0, 0, W, H);
        order2.forEach(function(k) {
          if (cv[k]) ctx.drawImage(cv[k], 0, 0);
        });
        var img = ctx.getImageData(0, 0, W, H).data;
        var hov = DOC.createElement("canvas");
        hov.width = W;
        hov.height = H;
        var hctx = hov.getContext("2d");
        hctx.drawImage(cv.hovers, 0, 0);
        var himg = hctx.getImageData(0, 0, W, H).data;
        var at = function(data2, x, y) {
          var X = Math.round(x * dpr), Y = Math.round(y * dpr);
          if (X < 0 || Y < 0 || X >= W || Y >= H) return null;
          var i = (Y * W + X) * 4;
          return [data2[i], data2[i + 1], data2[i + 2], data2[i + 3]];
        };
        var hi = toRgb(THEME.edgeHi), dm = toRgb(THEME.dim);
        var dist = function(c, t) {
          return c ? Math.abs(c[0] - t[0]) + Math.abs(c[1] - t[1]) + Math.abs(c[2] - t[2]) : 1e9;
        };
        var set = focusSet() || {};
        var dims = [];
        graph.forEachNode(function(id) {
          if (set[id]) return;
          var d = renderer.getNodeDisplayData(id);
          if (!d || d.hidden) return;
          var p = renderer.graphToViewport(graph.getNodeAttributes(id));
          dims.push({ x: p.x, y: p.y, rad: renderer.scaleSize(d.size) });
        });
        var res = {
          node: best,
          degree: bd,
          edges: 0,
          samples: 0,
          geomGaps: 0,
          blueAtGaps: 0,
          dimAtGaps: 0,
          underLabel: 0,
          otherAtGaps: 0
        };
        var seen = dict();
        Object.keys(set).forEach(function(n) {
          graph.forEachEdge(n, function(e, attrs, s, t) {
            if (seen[e] || !set[s] || !set[t]) return;
            seen[e] = true;
            var geo = edgeCurveGeom(e, s, t);
            if (!geo) return;
            res.edges++;
            var ps = geo.ps, pt = geo.pt, cp = geo.cp;
            for (var u = 0.05; u <= 0.95; u += 0.01) {
              var x = (1 - u) * (1 - u) * ps.x + 2 * (1 - u) * u * cp.x + u * u * pt.x;
              var y = (1 - u) * (1 - u) * ps.y + 2 * (1 - u) * u * cp.y + u * u * pt.y;
              res.samples++;
              var covered = dims.some(function(d) {
                var ddx = d.x - x, ddy = d.y - y;
                return ddx * ddx + ddy * ddy <= (d.rad - 0.5) * (d.rad - 0.5);
              });
              if (!covered) continue;
              res.geomGaps++;
              var c = at(img, x, y), blue = dist(c, hi) < 60;
              for (var ox = -1; ox <= 1 && !blue; ox++) {
                for (var oy = -1; oy <= 1 && !blue; oy++) {
                  if (ox || oy) blue = dist(at(img, x + ox / dpr, y + oy / dpr), hi) < 60;
                }
              }
              var h = at(himg, x, y);
              if (blue) res.blueAtGaps++;
              else if (h && h[3] >= 250) res.underLabel++;
              else if (dist(c, dm) < 60) res.dimAtGaps++;
              else res.otherAtGaps++;
            }
          });
        });
        state.selected = keepSel;
        state.hovered = keepHov;
        renderer.refresh();
        res.webOK = res.dimAtGaps === 0;
        return res;
      },
      debugDump: function() {
        var a0 = renderer ? renderer.graphToViewport({ x: 0, y: 0 }) : null;
        var b0 = renderer ? renderer.graphToViewport({ x: UNIT, y: 0 }) : null;
        var pxPerRow = a0 && b0 ? Math.hypot(b0.x - a0.x, b0.y - a0.y) : 0;
        var perPx = pxPerRow > 0 ? UNIT / pxPerRow : 0;
        var pts = [];
        graph.forEachNode(function(id, a) {
          if ((alpha[id] || 0) <= 4e-3) return;
          var d = renderer && renderer.getNodeDisplayData(id);
          pts.push({
            r: Math.hypot(a.x, a.y),
            th: Math.atan2(a.y, a.x),
            rad: (d && renderer ? renderer.scaleSize(d.size) : 4) * perPx,
            g: a.folder
          });
        });
        pts.sort(function(x, y) {
          return x.r - y.r;
        });
        var gi = 0, gap = 0;
        for (var i = 1; i < pts.length; i++) {
          var gg = pts[i].r - pts[i - 1].r;
          if (gg > gap) {
            gap = gg;
            gi = i;
          }
        }
        var r3 = function(v) {
          return Math.round(v * 1e3) / 1e3;
        };
        var r3n = function(v) {
          return v === void 0 || v === null ? null : r3(v);
        };
        var bandStat = function(arr) {
          if (!arr.length) return null;
          var rows = {};
          var steps = [];
          var clears = [];
          var worst = 1e9;
          arr.forEach(function(q2) {
            var k = Math.round(q2.r / 8) * 8;
            (rows[k] || (rows[k] = [])).push(q2);
          });
          Object.keys(rows).forEach(function(k) {
            var row = rows[k].slice().sort(function(x, y) {
              return x.th - y.th;
            });
            for (var i2 = 1; i2 < row.length; i2++) {
              var arc = (row[i2].th - row[i2 - 1].th) * +k;
              if (!(arc > 1 && arc < 3e3)) continue;
              steps.push(arc);
              var cl = arc - row[i2].rad - row[i2 - 1].rad;
              clears.push(cl);
              if (cl < worst) worst = cl;
            }
          });
          steps.sort(function(x, y) {
            return x - y;
          });
          var q = function(f) {
            return steps.length ? Math.round(steps[Math.floor(steps.length * f)]) : 0;
          };
          var radii = arr.map(function(x) {
            return x.rad;
          }).sort(function(x, y) {
            return x - y;
          });
          return {
            notes: arr.length,
            rows: Object.keys(rows).length,
            inner: Math.round(arr[0].r),
            outer: Math.round(arr[arr.length - 1].r),
            step35: q(0.35),
            step95: q(0.95),
            channelRatio: q(0.35) ? r3(q(0.95) / q(0.35)) : 0,
            dotRadius: {
              min: Math.round(radii[0]),
              med: Math.round(radii[Math.floor(radii.length / 2)]),
              max: Math.round(radii[radii.length - 1])
            },
            worstPairClearance: worst === 1e9 ? null : Math.round(worst),
            overlappingPairs: clears.filter(function(c) {
              return c < 0;
            }).length
          };
        };
        var cam = renderer ? renderer.getCamera().getState() : null;
        var hidden2 = Object.keys(state.hidden[state.dim] || {}).filter(function(k) {
          return (state.hidden[state.dim] || {})[k];
        });
        return {
          note: "vault-graph debug dump -- paste this back verbatim",
          vault: {
            name: DATA.vault || "",
            notes: graph.order,
            links: EDGE_TOTAL,
            linksShown: EDGE_SHOWN,
            lazyEdges,
            generated: DATA.generated || ""
          },
          screen: {
            win: WIN.innerWidth + "x" + WIN.innerHeight,
            dpr: WIN.devicePixelRatio || 1,
            stage: $("canvas") ? Math.round($("canvas").clientWidth) + "x" + Math.round($("canvas").clientHeight) : "",
            pxPerRow: r3(pxPerRow)
          },
          camera: cam ? { x: r3(cam.x), y: r3(cam.y), ratio: r3(cam.ratio) } : null,
          filters: {
            hiddenFolders: hidden2,
            hiddenSub: Object.keys(state.hiddenSub || {}),
            range: rangeLabel(),
            from: state.from,
            to: state.to,
            heatEnd: state.heatEnd,
            timelineUntil: state.until,
            markDay: state.markDay,
            shown: pts.length
          },
          room: { i: r3n(bandOf("i").room), o: r3n(bandOf("o").room) },
          minArcDeg: r3(lastMinArc * 180 / Math.PI),
          spacing: {
            spOuter: r3(bandOf("o").sp),
            spInner: r3(bandOf("i").sp),
            rowsOuter: bandOf("o").rows,
            rowsInner: bandOf("i").rows,
            pitchOuterUnits: r3(pitchUnits("o")),
            pitchInnerUnits: r3(pitchUnits("i"))
          },
          seam: {
            outerDeg: bandOf("o").gapDeg,
            innerDeg: bandOf("i").gapDeg,
            nGOuter: bandOf("o").nG,
            nGInner: bandOf("i").nG,
            nSubOuter: bandOf("o").nSub,
            nSubInner: bandOf("i").nSub,
            fallOuter: r3(seamFall("o")),
            fallInner: r3(seamFall("i"))
          },
          locked: geomLock ? {
            r0: r3(geomLock.r0),
            rOuter: r3(geomLock.rOuter),
            maxR: r3(geomLock.maxR),
            rows: geomLock.rows,
            bandTotal: geomLock.bandTotal
          } : null,
          bands: { inner: bandStat(pts.slice(0, gi)), outer: bandStat(pts.slice(gi)) },
          dots: {
            ofPitch: r3(DOT_OF_PITCH),
            minPx: DOT_MIN_PX,
            maxSpread: DOT_MAX_SPREAD,
            m: r3(bandOf("o").ramp.m),
            b: r3(bandOf("o").ramp.b),
            lo: r3(bandOf("o").ramp.lo)
          }
        };
      }
    };
    seedPins();
    buildTimeline();
    buildSearch();
    buildTools();
    buildStats();
    if (LOGO_MASK) {
      var mu = 'url("' + LOGO_MASK + '")';
      $("logo").style.webkitMaskImage = mu;
      $("logo").style.maskImage = mu;
      var fade = "radial-gradient(circle at 50% 50%, #000 " + LOGO_INNER_FADE.split(",")[0].trim() + ", transparent " + LOGO_INNER_FADE.split(",")[1].trim() + ")";
      var eli = $("logoInner");
      eli.style.webkitMaskImage = mu + ", " + fade;
      eli.style.maskImage = mu + ", " + fade;
      logoMaskReady = true;
      logoMaskImg = new Image();
      logoMaskImg.src = LOGO_MASK;
    }
    regroup();
    buildHeatmapUI();
    heatBuild();
    buildDateUI();
    fit();
    syncSizeScale();
    var hidden = DOC ? typeof DOC.visibilityState === "string" ? DOC.visibilityState === "hidden" : !!DOC.hidden : false;
    if (hidden && !demoOn() && !restOn()) introOwed = true;
    if (demoOn() || restOn() || hidden) {
      timelineFrame(true);
    } else {
      playTimeline();
    }
    $("busy").hidden = true;
  }, 20);
  return { get api() {
    return API;
  }, get ready() {
    return API !== null;
  }, destroy };
  function destroy() {
    if (dead) return;
    dead = true;
    WIN.clearTimeout(bootTimer);
    if (play) {
      WIN.cancelAnimationFrame(play.raf);
      if (play.guard) WIN.clearTimeout(play.guard);
      play = null;
    }
    if (cascadeRun) {
      WIN.cancelAnimationFrame(cascadeRun.raf);
      WIN.clearTimeout(cascadeRun.guard);
      cascadeRun = null;
    }
    if (anim) {
      WIN.cancelAnimationFrame(anim);
      anim = null;
    }
    if (animGuard) {
      WIN.clearTimeout(animGuard);
      animGuard = null;
    }
    if (hoverRaf) {
      WIN.cancelAnimationFrame(hoverRaf);
      hoverRaf = 0;
    }
    if (hlRaf) {
      WIN.cancelAnimationFrame(hlRaf);
      hlRaf = 0;
    }
    if (colorRaf) {
      WIN.cancelAnimationFrame(colorRaf);
      colorRaf = 0;
    }
    for (var i = onDestroy.length - 1; i >= 0; i--) {
      attempt2(onDestroy[i]);
    }
    onDestroy.length = 0;
    if (renderer) attempt2(function() {
      renderer.kill();
    });
    if (window.__vg === API) delete window.__vg;
    API = null;
  }
}

// src/engine/store.ts
var KEY_SEP = "";
function isArrayIndex(key) {
  const n = Number(key);
  return Number.isInteger(n) && n >= 0 && n < 4294967295 && String(n) === key;
}
function inPropertyOrder(keys) {
  const indexes = [];
  const rest = [];
  for (const k of keys) {
    if (isArrayIndex(k)) indexes.push(Number(k));
    else rest.push(k);
  }
  indexes.sort((a, b) => a - b);
  const out = indexes.map(String);
  for (const k of rest) out.push(k);
  return out;
}
var GraphStore = class {
  constructor() {
    __publicField(this, "nodeAttrs", /* @__PURE__ */ new Map());
    __publicField(this, "edgeRecords", /* @__PURE__ */ new Map());
    __publicField(this, "adjacency", /* @__PURE__ */ new Map());
  }
  get order() {
    return this.nodeAttrs.size;
  }
  get size() {
    return this.edgeRecords.size;
  }
  addNode(id, attrs) {
    if (this.nodeAttrs.has(id)) throw new Error(`GraphStore: node "${id}" already exists`);
    this.nodeAttrs.set(id, attrs);
    this.adjacency.set(id, /* @__PURE__ */ new Map());
    return id;
  }
  addUndirectedEdge(source, target, attrs) {
    const a = this.adjacency.get(source);
    const b = this.adjacency.get(target);
    if (!a) throw new Error(`GraphStore: node "${source}" not found`);
    if (!b) throw new Error(`GraphStore: node "${target}" not found`);
    if (a.has(target)) throw new Error(`GraphStore: edge ${source} -- ${target} already exists`);
    const key = source + KEY_SEP + target;
    const rec = { key, source, target, attrs };
    this.edgeRecords.set(key, rec);
    a.set(target, rec);
    b.set(source, rec);
    return key;
  }
  hasNode(id) {
    return this.nodeAttrs.has(id);
  }
  hasEdge(source, target) {
    const a = this.adjacency.get(source);
    return a !== void 0 && a.has(target);
  }
  dropEdge(source, target) {
    const a = this.adjacency.get(source);
    const rec = a?.get(target);
    if (!a || !rec) throw new Error(`GraphStore: no edge ${source} -- ${target}`);
    a.delete(target);
    this.neighboursOf(target).delete(source);
    this.edgeRecords.delete(rec.key);
  }
  extremities(edge) {
    const rec = this.edgeRecords.get(edge);
    if (!rec) throw new Error(`GraphStore: edge "${edge}" not found`);
    return [rec.source, rec.target];
  }
  degree(id) {
    const around = this.neighboursOf(id);
    return around.size + (around.has(id) ? 1 : 0);
  }
  neighbors(id) {
    return inPropertyOrder(this.neighboursOf(id).keys());
  }
  nodes() {
    return Array.from(this.nodeAttrs.keys());
  }
  forEachNode(fn) {
    for (const [id, attrs] of this.nodeAttrs) fn(id, attrs);
  }
  forEachEdge(nodeOrFn, maybeFn) {
    if (typeof nodeOrFn === "function") {
      for (const rec of this.edgeRecords.values()) nodeOrFn(rec.key, rec.attrs, rec.source, rec.target);
      return;
    }
    if (!maybeFn) throw new Error("GraphStore: forEachEdge(node) needs a callback");
    const around = this.neighboursOf(nodeOrFn);
    for (const neighbour of inPropertyOrder(around.keys())) {
      const rec = around.get(neighbour);
      if (rec) maybeFn(rec.key, rec.attrs, rec.source, rec.target);
    }
  }
  getNodeAttribute(id, name) {
    return this.attrsOf(id)[name];
  }
  getNodeAttributes(id) {
    return this.attrsOf(id);
  }
  setNodeAttribute(id, name, value) {
    this.attrsOf(id)[name] = value;
  }
  mergeNodeAttributes(id, attrs) {
    Object.assign(this.attrsOf(id), attrs);
  }
  edges() {
    return Array.from(this.edgeRecords.keys());
  }
  getEdgeAttributes(edge) {
    const rec = this.edgeRecords.get(edge);
    if (!rec) throw new Error(`GraphStore: edge "${edge}" not found`);
    return rec.attrs;
  }
  attrsOf(id) {
    const attrs = this.nodeAttrs.get(id);
    if (!attrs) throw new Error(`GraphStore: node "${id}" not found`);
    return attrs;
  }
  neighboursOf(id) {
    const around = this.adjacency.get(id);
    if (!around) throw new Error(`GraphStore: node "${id}" not found`);
    return around;
  }
};

// src/engine/emitter.ts
var Emitter = class {
  constructor() {
    __publicField(this, "listeners", /* @__PURE__ */ new Map());
  }
  on(event, fn) {
    let set = this.listeners.get(event);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.listeners.set(event, set);
    }
    set.add(fn);
    return this;
  }
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of Array.from(set)) fn(payload);
  }
  removeAllListeners() {
    this.listeners.clear();
  }
};

// src/engine/viewport.ts
function identity() {
  return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
function scale(m, x, y) {
  m[0] = x;
  m[4] = typeof y === "number" ? y : x;
  return m;
}
function rotate(m, r) {
  const s = Math.sin(r);
  const c = Math.cos(r);
  m[0] = c;
  m[1] = s;
  m[3] = -s;
  m[4] = c;
  return m;
}
function translate(m, x, y) {
  m[6] = x;
  m[7] = y;
  return m;
}
function multiply(a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2];
  const a10 = a[3], a11 = a[4], a12 = a[5];
  const a20 = a[6], a21 = a[7], a22 = a[8];
  const b00 = b[0], b01 = b[1], b02 = b[2];
  const b10 = b[3], b11 = b[4], b12 = b[5];
  const b20 = b[6], b21 = b[7], b22 = b[8];
  a[0] = b00 * a00 + b01 * a10 + b02 * a20;
  a[1] = b00 * a01 + b01 * a11 + b02 * a21;
  a[2] = b00 * a02 + b01 * a12 + b02 * a22;
  a[3] = b10 * a00 + b11 * a10 + b12 * a20;
  a[4] = b10 * a01 + b11 * a11 + b12 * a21;
  a[5] = b10 * a02 + b11 * a12 + b12 * a22;
  a[6] = b20 * a00 + b21 * a10 + b22 * a20;
  a[7] = b20 * a01 + b21 * a11 + b22 * a21;
  a[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return a;
}
function multiplyVec2(a, b, z = 1) {
  const a00 = a[0], a01 = a[1], a10 = a[3], a11 = a[4], a20 = a[6], a21 = a[7];
  return {
    x: b.x * a00 + b.y * a10 + a20 * z,
    y: b.x * a01 + b.y * a11 + a21 * z
  };
}
function getCorrectionRatio(viewport, graph) {
  const viewportRatio = viewport.height / viewport.width;
  const graphRatio = graph.height / graph.width;
  if (viewportRatio < 1 && graphRatio > 1 || viewportRatio > 1 && graphRatio < 1) return 1;
  return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
function matrixFromCamera(state, viewport, graph, padding, inverse = false) {
  const { angle, ratio, x, y } = state;
  const { width, height } = viewport;
  const matrix = identity();
  const smallestDimension = Math.min(width, height) - 2 * padding;
  const correctionRatio = getCorrectionRatio(viewport, graph);
  if (!inverse) {
    multiply(matrix, scale(
      identity(),
      2 * (smallestDimension / width) * correctionRatio,
      2 * (smallestDimension / height) * correctionRatio
    ));
    multiply(matrix, rotate(identity(), -angle));
    multiply(matrix, scale(identity(), 1 / ratio));
    multiply(matrix, translate(identity(), -x, -y));
  } else {
    multiply(matrix, translate(identity(), x, y));
    multiply(matrix, scale(identity(), ratio));
    multiply(matrix, rotate(identity(), angle));
    multiply(matrix, scale(
      identity(),
      width / smallestDimension / 2 / correctionRatio,
      height / smallestDimension / 2 / correctionRatio
    ));
  }
  return matrix;
}
function getMatrixImpact(matrix, state, viewport) {
  const { x, y } = multiplyVec2(matrix, { x: Math.cos(state.angle), y: Math.sin(state.angle) }, 0);
  return 1 / Math.sqrt(x * x + y * y) / viewport.width;
}
function createNormalization(extent) {
  const [minX, maxX] = extent.x;
  const [minY, maxY] = extent.y;
  let ratio = Math.max(maxX - minX, maxY - minY);
  let dX = (maxX + minX) / 2;
  let dY = (maxY + minY) / 2;
  if (ratio === 0 || Math.abs(ratio) === Infinity || Number.isNaN(ratio)) ratio = 1;
  if (Number.isNaN(dX)) dX = 0;
  if (Number.isNaN(dY)) dY = 0;
  return {
    apply: (p) => ({ x: 0.5 + (p.x - dX) / ratio, y: 0.5 + (p.y - dY) / ratio }),
    applyTo: (p) => {
      p.x = 0.5 + (p.x - dX) / ratio;
      p.y = 0.5 + (p.y - dY) / ratio;
    },
    inverse: (p) => ({ x: dX + ratio * (p.x - 0.5), y: dY + ratio * (p.y - 0.5) }),
    ratio
  };
}
function graphExtent(graph) {
  if (!graph.order) return { x: [0, 1], y: [0, 1] };
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  graph.forEachNode((_id, attrs) => {
    const { x, y } = attrs;
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });
  return { x: [xMin, xMax], y: [yMin, yMax] };
}
var easings = {
  linear: (k) => k,
  quadraticIn: (k) => k * k,
  quadraticOut: (k) => k * (2 - k),
  quadraticInOut: (k) => {
    if ((k *= 2) < 1) return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
  }
};

// src/engine/camera.ts
var ANIMATE_DEFAULTS = { easing: "quadraticInOut", duration: 150 };
var Camera = class extends Emitter {
  constructor(win) {
    super();
    this.win = win;
    __publicField(this, "x", 0.5);
    __publicField(this, "y", 0.5);
    __publicField(this, "ratio", 1);
    __publicField(this, "angle", 0);
    __publicField(this, "minRatio", null);
    __publicField(this, "maxRatio", null);
    __publicField(this, "enabledZooming", true);
    __publicField(this, "enabledPanning", true);
    __publicField(this, "previousState");
    __publicField(this, "nextFrame", null);
    __publicField(this, "animationCallback");
    this.previousState = this.getState();
  }
  getState() {
    return { x: this.x, y: this.y, angle: this.angle, ratio: this.ratio };
  }
  hasState(state) {
    return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
  }
  getPreviousState() {
    const s = this.previousState;
    return { x: s.x, y: s.y, angle: s.angle, ratio: s.ratio };
  }
  getBoundedRatio(ratio) {
    let r = ratio;
    if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
    if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
    return r;
  }
  validateState(state) {
    const valid = {};
    if (this.enabledPanning && typeof state.x === "number") valid.x = state.x;
    if (this.enabledPanning && typeof state.y === "number") valid.y = state.y;
    if (this.enabledZooming && typeof state.ratio === "number") valid.ratio = this.getBoundedRatio(state.ratio);
    return valid;
  }
  setState(state) {
    this.previousState = this.getState();
    const valid = this.validateState(state);
    if (typeof valid.x === "number") this.x = valid.x;
    if (typeof valid.y === "number") this.y = valid.y;
    if (typeof valid.ratio === "number") this.ratio = valid.ratio;
    if (!this.hasState(this.previousState)) this.emit("updated", this.getState());
    return this;
  }
  kill() {
    if (this.nextFrame !== null) this.win.cancelAnimationFrame(this.nextFrame);
    this.nextFrame = null;
    this.animationCallback = void 0;
    this.removeAllListeners();
  }
  animate(state, opts = {}, done) {
    const options = { ...ANIMATE_DEFAULTS, ...opts };
    const valid = this.validateState(state);
    const easing = easings[options.easing];
    const start = Date.now();
    const initial = this.getState();
    const step = () => {
      const t = (Date.now() - start) / options.duration;
      if (t >= 1) {
        this.nextFrame = null;
        this.setState(valid);
        if (this.animationCallback) {
          const cb = this.animationCallback;
          this.animationCallback = void 0;
          cb();
        }
        return;
      }
      const k = easing(t);
      const next = {};
      if (typeof valid.x === "number") next.x = initial.x + (valid.x - initial.x) * k;
      if (typeof valid.y === "number") next.y = initial.y + (valid.y - initial.y) * k;
      if (typeof valid.ratio === "number") next.ratio = initial.ratio + (valid.ratio - initial.ratio) * k;
      this.setState(next);
      this.nextFrame = this.win.requestAnimationFrame(step);
    };
    if (this.nextFrame !== null) {
      this.win.cancelAnimationFrame(this.nextFrame);
      if (this.animationCallback) this.animationCallback();
      this.nextFrame = this.win.requestAnimationFrame(step);
    } else {
      step();
    }
    this.animationCallback = done;
  }
};

// src/engine/captor.ts
var DOUBLE_CLICK_TIMEOUT = 300;
var DRAG_TIMEOUT = 100;
var DRAGGED_EVENTS_TOLERANCE = 3;
var INERTIA_DURATION = 200;
var INERTIA_RATIO = 3;
function getPosition(e, dom) {
  const bbox = dom.getBoundingClientRect();
  return { x: e.clientX - bbox.left, y: e.clientY - bbox.top };
}
function getMouseCoords(e, dom) {
  const res = {
    ...getPosition(e, dom),
    defaultPrevented: false,
    preventDefault: () => {
      res.defaultPrevented = true;
    },
    original: e
  };
  return res;
}
function getWheelDelta(e) {
  return e.deltaY * -3 / 360;
}
var MouseCaptor = class extends Emitter {
  constructor(container, host, win) {
    super();
    this.container = container;
    this.host = host;
    this.win = win;
    __publicField(this, "draggedEvents", 0);
    __publicField(this, "isMoving", false);
    __publicField(this, "currentWheelDirection", 0);
    __publicField(this, "lastMouseX", null);
    __publicField(this, "lastMouseY", null);
    __publicField(this, "isMouseDown", false);
    __publicField(this, "movingTimeout", null);
    __publicField(this, "clicks", 0);
    __publicField(this, "doubleClickTimeout", null);
    __publicField(this, "lastWheelTriggerTime", null);
    __publicField(this, "doc");
    __publicField(this, "handleClick", (e) => {
      this.clicks++;
      if (this.clicks === 2) {
        this.clicks = 0;
        if (this.doubleClickTimeout !== null) {
          this.win.clearTimeout(this.doubleClickTimeout);
          this.doubleClickTimeout = null;
        }
        this.handleDoubleClick(e);
        return;
      }
      this.doubleClickTimeout = this.win.setTimeout(() => {
        this.clicks = 0;
        this.doubleClickTimeout = null;
      }, DOUBLE_CLICK_TIMEOUT);
      if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE) this.emit("click", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleRightClick", (e) => {
      this.emit("rightClick", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleDown", (e) => {
      if (e.button === 0) {
        const { x, y } = getPosition(e, this.container);
        this.lastMouseX = x;
        this.lastMouseY = y;
        this.draggedEvents = 0;
        this.isMouseDown = true;
      }
      this.emit("mousedown", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleUp", (e) => {
      if (!this.isMouseDown) return;
      const camera = this.host.getCamera();
      this.isMouseDown = false;
      if (this.movingTimeout !== null) {
        this.win.clearTimeout(this.movingTimeout);
        this.movingTimeout = null;
      }
      const { x, y } = getPosition(e, this.container);
      const cameraState = camera.getState();
      const previous = camera.getPreviousState();
      if (this.isMoving) {
        camera.animate({
          x: cameraState.x + INERTIA_RATIO * (cameraState.x - previous.x),
          y: cameraState.y + INERTIA_RATIO * (cameraState.y - previous.y)
        }, { duration: INERTIA_DURATION, easing: "quadraticOut" });
      } else if (this.lastMouseX !== x || this.lastMouseY !== y) {
        camera.setState({ x: cameraState.x, y: cameraState.y });
      }
      this.isMoving = false;
      this.win.setTimeout(() => {
        this.draggedEvents = 0;
      }, 0);
      this.emit("mouseup", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleMove", (e) => {
      const coords = getMouseCoords(e, this.container);
      this.emit("mousemovebody", coords);
      if (e.target === this.container || e.composedPath()[0] === this.container) this.emit("mousemove", coords);
      if (coords.defaultPrevented) return;
      if (this.isMouseDown) {
        this.isMoving = true;
        this.draggedEvents++;
        if (this.movingTimeout !== null) this.win.clearTimeout(this.movingTimeout);
        this.movingTimeout = this.win.setTimeout(() => {
          this.movingTimeout = null;
          this.isMoving = false;
        }, DRAG_TIMEOUT);
        const camera = this.host.getCamera();
        const { x: eX, y: eY } = getPosition(e, this.container);
        const lastMouse = this.host.viewportToFramedGraph({ x: this.lastMouseX ?? eX, y: this.lastMouseY ?? eY });
        const mouse = this.host.viewportToFramedGraph({ x: eX, y: eY });
        const cameraState = camera.getState();
        camera.setState({ x: cameraState.x + (lastMouse.x - mouse.x), y: cameraState.y + (lastMouse.y - mouse.y) });
        this.lastMouseX = eX;
        this.lastMouseY = eY;
        e.preventDefault();
        e.stopPropagation();
      }
    });
    __publicField(this, "handleLeave", (e) => {
      this.emit("mouseleave", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleEnter", (e) => {
      this.emit("mouseenter", getMouseCoords(e, this.container));
    });
    __publicField(this, "handleWheel", (e) => {
      const camera = this.host.getCamera();
      if (!camera.enabledZooming) return;
      const delta = getWheelDelta(e);
      if (!delta) return;
      const coords = { ...getMouseCoords(e, this.container), delta };
      this.emit("wheel", coords);
      if (coords.defaultPrevented) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const currentRatio = camera.getState().ratio;
      const ratioDiff = delta > 0 ? 1 / this.host.zoomingRatio : this.host.zoomingRatio;
      const newRatio = camera.getBoundedRatio(currentRatio * ratioDiff);
      const wheelDirection = delta > 0 ? 1 : -1;
      const now = Date.now();
      if (currentRatio === newRatio) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.currentWheelDirection === wheelDirection && this.lastWheelTriggerTime !== null && now - this.lastWheelTriggerTime < this.host.zoomDuration / 5) {
        return;
      }
      camera.animate(
        this.host.getViewportZoomedState(getPosition(e, this.container), newRatio),
        { easing: "quadraticOut", duration: this.host.zoomDuration },
        () => {
          this.currentWheelDirection = 0;
        }
      );
      this.currentWheelDirection = wheelDirection;
      this.lastWheelTriggerTime = now;
    });
    this.doc = container.ownerDocument;
    container.addEventListener("click", this.handleClick);
    container.addEventListener("contextmenu", this.handleRightClick);
    container.addEventListener("mousedown", this.handleDown);
    container.addEventListener("wheel", this.handleWheel);
    container.addEventListener("mouseleave", this.handleLeave);
    container.addEventListener("mouseenter", this.handleEnter);
    this.doc.addEventListener("mousemove", this.handleMove);
    this.doc.addEventListener("mouseup", this.handleUp);
  }
  kill() {
    const c = this.container;
    c.removeEventListener("click", this.handleClick);
    c.removeEventListener("contextmenu", this.handleRightClick);
    c.removeEventListener("mousedown", this.handleDown);
    c.removeEventListener("wheel", this.handleWheel);
    c.removeEventListener("mouseleave", this.handleLeave);
    c.removeEventListener("mouseenter", this.handleEnter);
    this.doc.removeEventListener("mousemove", this.handleMove);
    this.doc.removeEventListener("mouseup", this.handleUp);
    if (this.movingTimeout !== null) this.win.clearTimeout(this.movingTimeout);
    if (this.doubleClickTimeout !== null) this.win.clearTimeout(this.doubleClickTimeout);
    this.removeAllListeners();
  }
  handleDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.emit("doubleClick", getMouseCoords(e, this.container));
  }
};

// src/engine/colors.ts
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
  let r = 0, g = 0, b = 0, a = 1;
  if (val[0] === "#") {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    } else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
    if (val.length === 9) a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
    return { r, g, b, a };
  }
  if (RGBA_TEST.test(val)) {
    const match = RGBA_EXTRACT.exec(val);
    if (match) {
      r = +match[1];
      g = +match[2];
      b = +match[3];
      if (match[4]) a = +match[4];
    }
    return { r, g, b, a };
  }
  return null;
}
function rgbaToFloat(r, g, b, a) {
  INT32[0] = (a << 24 | b << 16 | g << 8 | r) & 4278190079;
  return FLOAT32[0];
}
var CACHE_LIMIT = 2e5;
var cache = /* @__PURE__ */ new Map();
var scratch = null;
function normalise(val) {
  if (!scratch) scratch = new OffscreenCanvas(1, 1).getContext("2d");
  if (!scratch) return "#000000";
  scratch.fillStyle = "#000000";
  scratch.fillStyle = val;
  return scratch.fillStyle;
}
function floatColor(val) {
  const direct = cache.get(val);
  if (direct !== void 0) return direct;
  const key = val.toLowerCase();
  let color = cache.get(key);
  if (color === void 0) {
    let parsed = parseColor(key);
    if (!parsed) parsed = parseColor(normalise(key).toLowerCase()) ?? { r: 0, g: 0, b: 0, a: 1 };
    color = rgbaToFloat(parsed.r, parsed.g, parsed.b, parsed.a * 255 | 0);
    if (cache.size >= CACHE_LIMIT) cache.clear();
    cache.set(key, color);
  }
  if (val !== key) cache.set(val, color);
  return color;
}

// src/engine/programs.ts
var BIAS = "const float bias = 255.0 / 254.0;";
function slots(attr) {
  return attr.type === "ubyte" ? 1 : attr.size;
}
function bytes(attr) {
  return attr.type === "ubyte" ? attr.size : attr.size * 4;
}
function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("vault-graph: could not create a shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "";
    gl.deleteShader(shader);
    throw new Error("vault-graph: shader failed to compile:\n" + log + "\n" + source);
  }
  return shader;
}
var Program = class {
  constructor(gl, doc, def) {
    this.gl = gl;
    this.doc = doc;
    this.def = def;
    __publicField(this, "array", new Float32Array(0));
    __publicField(this, "capacity", 0);
    __publicField(this, "stride");
    __publicField(this, "constantArray");
    __publicField(this, "constantSlots");
    __publicField(this, "program");
    __publicField(this, "vertexShader");
    __publicField(this, "fragmentShader");
    __publicField(this, "buffer");
    __publicField(this, "constantBuffer");
    __publicField(this, "uniforms", /* @__PURE__ */ new Map());
    __publicField(this, "locations", /* @__PURE__ */ new Map());
    this.stride = def.attributes.reduce((n, a) => n + slots(a), 0);
    this.constantSlots = def.constantAttributes.reduce((n, a) => n + slots(a), 0);
    if (def.constantData.length !== def.vertices) {
      throw new Error(`vault-graph: program wants ${def.vertices} constant rows, got ${def.constantData.length}`);
    }
    this.constantArray = new Float32Array(def.vertices * this.constantSlots);
    def.constantData.forEach((row, i) => {
      if (row.length !== this.constantSlots) throw new Error("vault-graph: constant row has the wrong width");
      row.forEach((v, j) => {
        this.constantArray[i * this.constantSlots + j] = v;
      });
    });
    const buffer = gl.createBuffer();
    const constantBuffer = gl.createBuffer();
    if (!buffer || !constantBuffer) throw new Error("vault-graph: could not create a WebGL buffer");
    this.buffer = buffer;
    this.constantBuffer = constantBuffer;
    this.vertexShader = compile(gl, gl.VERTEX_SHADER, def.vertexShader);
    this.fragmentShader = compile(gl, gl.FRAGMENT_SHADER, def.fragmentShader);
    const program = gl.createProgram();
    if (!program) throw new Error("vault-graph: could not create a WebGL program");
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      throw new Error("vault-graph: WebGL program failed to link");
    }
    this.program = program;
    for (const name of def.uniforms) {
      const loc = gl.getUniformLocation(program, name);
      if (loc) this.uniforms.set(name, loc);
    }
    for (const attr of [...def.attributes, ...def.constantAttributes]) {
      this.locations.set(attr.name, gl.getAttribLocation(program, attr.name));
    }
  }
  reallocate(capacity) {
    if (capacity === this.capacity) return;
    this.capacity = capacity;
    this.array = new Float32Array(capacity * this.stride);
  }
  render(params) {
    if (this.capacity === 0) return;
    const gl = this.gl;
    gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
    this.bind();
    gl.enable(gl.BLEND);
    gl.useProgram(this.program);
    this.setUniforms(params);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, this.def.vertices, this.capacity);
    this.unbind();
  }
  kill() {
    const gl = this.gl;
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.buffer);
    gl.deleteBuffer(this.constantBuffer);
  }
  uniform(name) {
    return this.uniforms.get(name) ?? null;
  }
  zero(index) {
    this.array.fill(0, index, index + this.stride);
  }
  bind() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.constantBuffer);
    let offset = 0;
    for (const attr of this.def.constantAttributes) offset += this.bindAttribute(attr, offset, this.constantSlots * 4, 0);
    gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    offset = 0;
    for (const attr of this.def.attributes) offset += this.bindAttribute(attr, offset, this.stride * 4, 1);
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  bindAttribute(attr, offset, strideBytes, divisor) {
    const gl = this.gl;
    const location2 = this.locations.get(attr.name);
    if (location2 !== void 0 && location2 !== -1) {
      gl.enableVertexAttribArray(location2);
      const glType = attr.type === "ubyte" ? gl.UNSIGNED_BYTE : gl.FLOAT;
      gl.vertexAttribPointer(location2, attr.size, glType, attr.type === "ubyte", strideBytes, offset);
      gl.vertexAttribDivisor(location2, divisor);
    }
    return bytes(attr);
  }
  unbind() {
    const gl = this.gl;
    for (const attr of [...this.def.constantAttributes, ...this.def.attributes]) {
      const location2 = this.locations.get(attr.name);
      if (location2 !== void 0 && location2 !== -1) {
        gl.disableVertexAttribArray(location2);
        gl.vertexAttribDivisor(location2, 0);
      }
    }
  }
};
var NodeProgram = class extends Program {
  process(offset, data) {
    const i = offset * this.stride;
    if (data.hidden) {
      this.zero(i);
      return;
    }
    this.processVisible(i, data);
  }
};
var THIRD = 2 * Math.PI / 3;
var DISC_CONSTANTS = {
  constantAttributes: [{ name: "a_angle", size: 1, type: "float" }],
  constantData: [[0], [THIRD], [2 * THIRD]]
};
var CIRCLE_VERTEX = `
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;

${BIAS}

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_diffVector = diffVector;
  v_radius = size / 2.0;

  v_color = a_color;
  v_color.a *= bias;
}
`;
var CIRCLE_FRAGMENT = `
precision highp float;

varying vec4 v_color;
varying vec2 v_diffVector;
varying float v_radius;

uniform float u_correctionRatio;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float border = u_correctionRatio * 2.0;
  float dist = length(v_diffVector) - v_radius + border;

  float t = 0.0;
  if (dist > border)
    t = 1.0;
  else if (dist > 0.0)
    t = dist / border;

  gl_FragColor = mix(v_color, transparent, t);
}
`;
var NodeCircleProgram = class extends NodeProgram {
  constructor(gl, doc) {
    super(gl, doc, {
      vertices: 3,
      vertexShader: CIRCLE_VERTEX,
      fragmentShader: CIRCLE_FRAGMENT,
      uniforms: ["u_sizeRatio", "u_correctionRatio", "u_matrix"],
      attributes: [
        { name: "a_position", size: 2, type: "float" },
        { name: "a_size", size: 1, type: "float" },
        { name: "a_color", size: 4, type: "ubyte" }
      ],
      ...DISC_CONSTANTS
    });
  }
  processVisible(i, data) {
    const a = this.array;
    a[i++] = data.x;
    a[i++] = data.y;
    a[i++] = data.size;
    a[i++] = floatColor(data.color);
  }
  setUniforms(p) {
    const gl = this.gl;
    gl.uniform1f(this.uniform("u_correctionRatio"), p.correctionRatio);
    gl.uniform1f(this.uniform("u_sizeRatio"), p.sizeRatio);
    gl.uniformMatrix3fv(this.uniform("u_matrix"), false, p.matrix);
  }
};
var HALO_VERTEX = `
attribute vec2 a_position;
attribute float a_size;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;

varying vec2 v_diffVector;
varying float v_radius;

attribute vec4 a_borderColor_1;
varying vec4 v_borderColor_1;
attribute vec4 a_borderColor_2;
varying vec4 v_borderColor_2;

${BIAS}
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;
  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));
  vec2 position = a_position + diffVector;
  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  v_radius = size / 2.0;
  v_diffVector = diffVector;

  v_borderColor_1 = a_borderColor_1;
  v_borderColor_2 = a_borderColor_2;
}
`;
var HALO_FRAGMENT = `
precision highp float;

varying vec2 v_diffVector;
varying float v_radius;

varying vec4 v_borderColor_1;
varying vec4 v_borderColor_2;

uniform float u_correctionRatio;

${BIAS}
const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_diffVector);
  float aaBorder = 2.0 * u_correctionRatio;
  float v_borderSize_0 = v_radius;
  vec4 v_borderColor_0 = transparent;

  // Sizes:
  float borderSize_1 = v_radius * 0.26;
  // Now, let's split the remaining space between "fill" borders:
  float fillBorderSize = (v_radius - (borderSize_1) ) / 1.0;
  float borderSize_2 = fillBorderSize;

  // Finally, normalize all border sizes, to start from the full size and to end with the smallest:
  float adjustedBorderSize_0 = v_radius;
  float adjustedBorderSize_1 = adjustedBorderSize_0 - borderSize_1;
  float adjustedBorderSize_2 = adjustedBorderSize_1 - borderSize_2;

  // Colors:
  vec4 borderColor_0 = transparent;
  vec4 borderColor_1 = v_borderColor_1;
  borderColor_1.a *= bias;
  if (borderSize_1 <= 1.0 * u_correctionRatio) { borderColor_1 = borderColor_0; }
  vec4 borderColor_2 = v_borderColor_2;
  borderColor_2.a *= bias;
  if (borderSize_2 <= 1.0 * u_correctionRatio) { borderColor_2 = borderColor_1; }

  if (dist > adjustedBorderSize_0) {
    gl_FragColor = borderColor_0;
  } else if (dist > adjustedBorderSize_0 - aaBorder) {
    gl_FragColor = mix(borderColor_1, borderColor_0, (dist - adjustedBorderSize_0 + aaBorder) / aaBorder);
  } else if (dist > adjustedBorderSize_1) {
    gl_FragColor = borderColor_1;
  } else if (dist > adjustedBorderSize_1 - aaBorder) {
    gl_FragColor = mix(borderColor_2, borderColor_1, (dist - adjustedBorderSize_1 + aaBorder) / aaBorder);
  } else if (dist > adjustedBorderSize_2) {
    gl_FragColor = borderColor_2;
  } else { /* Nothing to add here */ }
}
`;
var DEFAULT_HALO_COLOR = "#000000";
var NodeHaloProgram = class extends NodeProgram {
  constructor(gl, doc) {
    super(gl, doc, {
      vertices: 3,
      vertexShader: HALO_VERTEX,
      fragmentShader: HALO_FRAGMENT,
      uniforms: ["u_sizeRatio", "u_correctionRatio", "u_matrix"],
      attributes: [
        { name: "a_position", size: 2, type: "float" },
        { name: "a_size", size: 1, type: "float" },
        { name: "a_borderColor_1", size: 4, type: "ubyte" },
        { name: "a_borderColor_2", size: 4, type: "ubyte" }
      ],
      ...DISC_CONSTANTS
    });
  }
  processVisible(i, data) {
    const a = this.array;
    a[i++] = data.x;
    a[i++] = data.y;
    a[i++] = data.size;
    a[i++] = floatColor(data.haloColor || DEFAULT_HALO_COLOR);
    a[i++] = floatColor(data.color || DEFAULT_HALO_COLOR);
  }
  setUniforms(p) {
    const gl = this.gl;
    gl.uniform1f(this.uniform("u_correctionRatio"), p.correctionRatio);
    gl.uniform1f(this.uniform("u_sizeRatio"), p.sizeRatio);
    gl.uniformMatrix3fv(this.uniform("u_matrix"), false, p.matrix);
  }
};
var EdgeProgram = class extends Program {
  process(offset, source, target, data) {
    const i = offset * this.stride;
    if (data.hidden || source.hidden || target.hidden) {
      this.zero(i);
      return;
    }
    this.processVisible(i, source, target, data);
  }
};
var LINE_VERTEX = `
attribute vec4 a_color;
attribute vec2 a_normal;
attribute float a_normalCoef;
attribute vec2 a_positionStart;
attribute vec2 a_positionEnd;
attribute float a_positionCoef;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_correctionRatio;
uniform float u_minEdgeThickness;
uniform float u_feather;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;
varying float v_feather;

${BIAS}

void main() {
  float minThickness = u_minEdgeThickness;

  vec2 normal = a_normal * a_normalCoef;
  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;

  float normalLength = length(normal);
  vec2 unitNormal = normal / normalLength;

  // We require edges to be at least "minThickness" pixels thick *on screen*
  // (so we need to compensate the size ratio):
  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);

  // Then, we need to retrieve the normalized thickness of the edge in the WebGL
  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction
  // ratio:
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Here is the proper position of the vertex
  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness, 1)).xy, 0, 1);

  // For the fragment shader though, we need a thickness that takes the "magic"
  // correction ratio into account (as in webGLThickness), but so that the
  // antialiasing effect does not depend on the zoom level. So here's yet
  // another thickness version:
  v_thickness = webGLThickness / u_zoomRatio;

  v_normal = unitNormal;

  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;

  v_color = a_color;
  v_color.a *= bias;
}
`;
var LINE_FRAGMENT = `
precision mediump float;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;
varying float v_feather;

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = length(v_normal) * v_thickness;

  float t = smoothstep(
    v_thickness - v_feather,
    v_thickness,
    dist
  );

  gl_FragColor = mix(v_color, transparent, t);
}
`;
var EdgeLineProgram = class extends EdgeProgram {
  constructor(gl, doc) {
    super(gl, doc, {
      vertices: 6,
      vertexShader: LINE_VERTEX,
      fragmentShader: LINE_FRAGMENT,
      uniforms: ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness"],
      attributes: [
        { name: "a_positionStart", size: 2, type: "float" },
        { name: "a_positionEnd", size: 2, type: "float" },
        { name: "a_normal", size: 2, type: "float" },
        { name: "a_color", size: 4, type: "ubyte" }
      ],
      constantAttributes: [
        { name: "a_positionCoef", size: 1, type: "float" },
        { name: "a_normalCoef", size: 1, type: "float" }
      ],
      constantData: [[0, 1], [0, -1], [1, 1], [1, 1], [0, -1], [1, -1]]
    });
  }
  processVisible(i, source, target, data) {
    const thickness = data.size || 1;
    const x1 = source.x, y1 = source.y, x2 = target.x, y2 = target.y;
    const dx = x2 - x1, dy = y2 - y1;
    let len = dx * dx + dy * dy;
    let n1 = 0, n2 = 0;
    if (len) {
      len = 1 / Math.sqrt(len);
      n1 = -dy * len * thickness;
      n2 = dx * len * thickness;
    }
    const a = this.array;
    a[i++] = x1;
    a[i++] = y1;
    a[i++] = x2;
    a[i++] = y2;
    a[i++] = n1;
    a[i++] = n2;
    a[i++] = floatColor(data.color);
  }
  setUniforms(p) {
    const gl = this.gl;
    gl.uniformMatrix3fv(this.uniform("u_matrix"), false, p.matrix);
    gl.uniform1f(this.uniform("u_zoomRatio"), p.zoomRatio);
    gl.uniform1f(this.uniform("u_sizeRatio"), p.sizeRatio);
    gl.uniform1f(this.uniform("u_correctionRatio"), p.correctionRatio);
    gl.uniform1f(this.uniform("u_pixelRatio"), p.pixelRatio);
    gl.uniform1f(this.uniform("u_feather"), p.antiAliasingFeather);
    gl.uniform1f(this.uniform("u_minEdgeThickness"), p.minEdgeThickness);
  }
};
var CURVE_VERTEX = `
attribute vec4 a_color;
attribute float a_direction;
attribute float a_thickness;
attribute vec2 a_source;
attribute vec2 a_target;
attribute float a_current;
attribute float a_curvature;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_pixelRatio;
uniform vec2 u_dimensions;
uniform float u_minEdgeThickness;
uniform float u_feather;

varying vec4 v_color;
varying float v_thickness;
varying float v_feather;
varying vec2 v_cpA;
varying vec2 v_cpB;
varying vec2 v_cpC;

${BIAS}
const float epsilon = 0.7;

vec2 clipspaceToViewport(vec2 pos, vec2 dimensions) {
  return vec2(
    (pos.x + 1.0) * dimensions.x / 2.0,
    (pos.y + 1.0) * dimensions.y / 2.0
  );
}

vec2 viewportToClipspace(vec2 pos, vec2 dimensions) {
  return vec2(
    pos.x / dimensions.x * 2.0 - 1.0,
    pos.y / dimensions.y * 2.0 - 1.0
  );
}

void main() {
  float minThickness = u_minEdgeThickness;

  // Selecting the correct position
  // Branchless "position = a_source if a_current == 1.0 else a_target"
  vec2 position = a_source * max(0.0, a_current) + a_target * max(0.0, 1.0 - a_current);
  position = (u_matrix * vec3(position, 1)).xy;

  vec2 source = (u_matrix * vec3(a_source, 1)).xy;
  vec2 target = (u_matrix * vec3(a_target, 1)).xy;

  vec2 viewportPosition = clipspaceToViewport(position, u_dimensions);
  vec2 viewportSource = clipspaceToViewport(source, u_dimensions);
  vec2 viewportTarget = clipspaceToViewport(target, u_dimensions);

  vec2 delta = viewportTarget.xy - viewportSource.xy;
  float len = length(delta);
  vec2 normal = vec2(-delta.y, delta.x) * a_direction;
  vec2 unitNormal = normal / len;
  float boundingBoxThickness = len * a_curvature;

  float curveThickness = max(minThickness, a_thickness / u_sizeRatio);
  v_thickness = curveThickness * u_pixelRatio;
  v_feather = u_feather;

  v_cpA = viewportSource;
  v_cpB = 0.5 * (viewportSource + viewportTarget) + unitNormal * a_direction * boundingBoxThickness;
  v_cpC = viewportTarget;

  vec2 viewportOffsetPosition = (
    viewportPosition +
    unitNormal * (boundingBoxThickness / 2.0 + sign(boundingBoxThickness) * (curveThickness + epsilon)) *
    max(0.0, a_direction) // NOTE: cutting the bounding box in half to avoid overdraw
  );

  position = viewportToClipspace(viewportOffsetPosition, u_dimensions);
  gl_Position = vec4(position, 0, 1);

  v_color = a_color;
  v_color.a *= bias;
}
`;
var CURVE_FRAGMENT = `
precision highp float;

varying vec4 v_color;
varying float v_thickness;
varying float v_feather;
varying vec2 v_cpA;
varying vec2 v_cpB;
varying vec2 v_cpC;

float det(vec2 a, vec2 b) {
  return a.x * b.y - b.x * a.y;
}

vec2 getDistanceVector(vec2 b0, vec2 b1, vec2 b2) {
  float a = det(b0, b2), b = 2.0 * det(b1, b0), d = 2.0 * det(b2, b1);
  float f = b * d - a * a;
  vec2 d21 = b2 - b1, d10 = b1 - b0, d20 = b2 - b0;
  vec2 gf = 2.0 * (b * d21 + d * d10 + a * d20);
  gf = vec2(gf.y, -gf.x);
  vec2 pp = -f * gf / dot(gf, gf);
  vec2 d0p = b0 - pp;
  float ap = det(d0p, d20), bp = 2.0 * det(d10, d0p);
  float t = clamp((ap + bp) / (2.0 * a + b + d), 0.0, 1.0);
  return mix(mix(b0, b1, t), mix(b1, b2, t), t);
}

float distToQuadraticBezierCurve(vec2 p, vec2 b0, vec2 b1, vec2 b2) {
  return length(getDistanceVector(b0 - p, b1 - p, b2 - p));
}

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = distToQuadraticBezierCurve(gl_FragCoord.xy, v_cpA, v_cpB, v_cpC);
  float thickness = v_thickness;

  float halfThickness = thickness / 2.0;
  if (dist < halfThickness) {
    float t = smoothstep(
      halfThickness - v_feather,
      halfThickness,
      dist
    );

    gl_FragColor = mix(v_color, transparent, t);
  } else {
    gl_FragColor = transparent;
  }
}
`;
var DEFAULT_CURVATURE = 0.25;
var EdgeCurveProgram = class extends EdgeProgram {
  constructor(gl, doc) {
    super(gl, doc, {
      vertices: 6,
      vertexShader: CURVE_VERTEX,
      fragmentShader: CURVE_FRAGMENT,
      uniforms: ["u_matrix", "u_sizeRatio", "u_dimensions", "u_pixelRatio", "u_feather", "u_minEdgeThickness"],
      attributes: [
        { name: "a_source", size: 2, type: "float" },
        { name: "a_target", size: 2, type: "float" },
        { name: "a_thickness", size: 1, type: "float" },
        { name: "a_curvature", size: 1, type: "float" },
        { name: "a_color", size: 4, type: "ubyte" }
      ],
      constantAttributes: [
        { name: "a_current", size: 1, type: "float" },
        { name: "a_direction", size: 1, type: "float" }
      ],
      constantData: [[0, 1], [0, -1], [1, 1], [0, -1], [1, 1], [1, -1]]
    });
  }
  processVisible(i, source, target, data) {
    const a = this.array;
    a[i++] = source.x;
    a[i++] = source.y;
    a[i++] = target.x;
    a[i++] = target.y;
    a[i++] = data.size || 1;
    a[i++] = data.curvature ?? DEFAULT_CURVATURE;
    a[i++] = floatColor(data.color);
  }
  setUniforms(p) {
    const gl = this.gl;
    gl.uniformMatrix3fv(this.uniform("u_matrix"), false, p.matrix);
    gl.uniform1f(this.uniform("u_pixelRatio"), p.pixelRatio);
    gl.uniform1f(this.uniform("u_sizeRatio"), p.sizeRatio);
    gl.uniform1f(this.uniform("u_feather"), p.antiAliasingFeather);
    gl.uniform2f(this.uniform("u_dimensions"), p.width * p.pixelRatio, p.height * p.pixelRatio);
    gl.uniform1f(this.uniform("u_minEdgeThickness"), p.minEdgeThickness);
  }
};

// src/engine/renderer.ts
var PICK_FLOOR_PX = 1.5;
var X_LABEL_MARGIN = 150;
var Y_LABEL_MARGIN = 50;
var ANTI_ALIASING_FEATHER = 1;
var STAGE_PADDING = 30;
var DEFAULT_NODE_COLOR = "#999";
var DEFAULT_EDGE_COLOR = "#ccc";
function applyNodeDefaults(key, styled) {
  if (typeof styled.x !== "number" || typeof styled.y !== "number") {
    throw new Error(`vault-graph: node "${key}" has no position; the style function must keep x and y`);
  }
  if (!styled.color) styled.color = DEFAULT_NODE_COLOR;
  if (typeof styled.label !== "string") styled.label = null;
  if (!styled.size) styled.size = 2;
  if (styled.hidden === void 0) styled.hidden = false;
  if (styled.highlighted === void 0) styled.highlighted = false;
  if (styled.forceLabel === void 0) styled.forceLabel = false;
  if (!styled.type) styled.type = "circle";
  if (!styled.zIndex) styled.zIndex = 0;
  return styled;
}
function applyEdgeDefaults(styled) {
  if (!styled.color) styled.color = DEFAULT_EDGE_COLOR;
  if (!styled.label) styled.label = "";
  if (!styled.size) styled.size = 0.5;
  if (styled.hidden === void 0) styled.hidden = false;
  if (!styled.type) styled.type = "line";
  if (!styled.zIndex) styled.zIndex = 0;
  return styled;
}
function byZIndex(items, z) {
  return items.sort((a, b) => {
    const za = z(a) || 0, zb = z(b) || 0;
    return za < zb ? -1 : za > zb ? 1 : 0;
  });
}
var Renderer = class extends Emitter {
  constructor(graph, container, options) {
    super();
    this.graph = graph;
    this.container = container;
    __publicField(this, "settings");
    __publicField(this, "win");
    __publicField(this, "doc");
    __publicField(this, "nodeReducer");
    __publicField(this, "edgeReducer");
    __publicField(this, "drawHover");
    __publicField(this, "elements", /* @__PURE__ */ new Map());
    __publicField(this, "gl");
    __publicField(this, "ctx");
    __publicField(this, "nodePrograms");
    __publicField(this, "hoverPrograms");
    __publicField(this, "edgePrograms");
    __publicField(this, "camera");
    __publicField(this, "captor");
    __publicField(this, "nodeData", /* @__PURE__ */ new Map());
    __publicField(this, "edgeData", /* @__PURE__ */ new Map());
    __publicField(this, "forcedLabels", /* @__PURE__ */ new Set());
    __publicField(this, "highlighted", /* @__PURE__ */ new Set());
    __publicField(this, "hoveredNode", null);
    __publicField(this, "nodeOrder", []);
    __publicField(this, "nodeZExtent", [Infinity, -Infinity]);
    __publicField(this, "edgeZExtent", [Infinity, -Infinity]);
    __publicField(this, "nodeExtent", { x: [0, 1], y: [0, 1] });
    __publicField(this, "customBBox", null);
    __publicField(this, "normalization", createNormalization({ x: [0, 1], y: [0, 1] }));
    __publicField(this, "matrix", identity());
    __publicField(this, "invMatrix", identity());
    __publicField(this, "correctionRatio", 1);
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "pixelRatio", 1);
    __publicField(this, "needToProcess", false);
    __publicField(this, "killed", false);
    __publicField(this, "renderFrame", null);
    __publicField(this, "hoverFrame", null);
    __publicField(this, "onWindowResize", () => {
      this.scheduleRefresh();
    });
    const { win, nodeReducer, edgeReducer, drawHover, ...settings } = options;
    this.settings = { ...settings };
    this.win = win;
    this.doc = container.ownerDocument;
    this.nodeReducer = nodeReducer;
    this.edgeReducer = edgeReducer;
    this.drawHover = drawHover;
    const edges = this.createWebGL("edges");
    const nodes = this.createWebGL("nodes");
    const labels = this.create2D("labels");
    const hovers = this.create2D("hovers");
    const hoverNodes = this.createWebGL("hoverNodes");
    const mouse = this.create2D("mouse");
    this.gl = { edges, nodes, hoverNodes };
    this.ctx = { labels, hovers, mouse };
    this.resize(true);
    this.nodePrograms = { circle: new NodeCircleProgram(this.gl.nodes, this.doc), halo: new NodeHaloProgram(this.gl.nodes, this.doc) };
    this.hoverPrograms = { circle: new NodeCircleProgram(this.gl.hoverNodes, this.doc), halo: new NodeHaloProgram(this.gl.hoverNodes, this.doc) };
    this.edgePrograms = { line: new EdgeLineProgram(this.gl.edges, this.doc), curve: new EdgeCurveProgram(this.gl.edges, this.doc) };
    this.camera = new Camera(win);
    this.applyCameraSettings();
    this.camera.on("updated", () => this.scheduleRender());
    const live = this.settings;
    const host = {
      getCamera: () => this.camera,
      viewportToFramedGraph: (p) => this.viewportToFramedGraph(p),
      getViewportZoomedState: (p, r) => this.getViewportZoomedState(p, r),
      get zoomingRatio() {
        return live.zoomingRatio;
      },
      get zoomDuration() {
        return live.zoomDuration;
      }
    };
    this.captor = new MouseCaptor(mouse.canvas, host, win);
    this.bindCaptor();
    win.addEventListener("resize", this.onWindowResize);
    this.refresh();
  }
  /* ------------------------------------------------------------ public API */
  refresh(opts) {
    if (this.killed) return;
    const partial = opts?.partialGraph;
    if (!partial) {
      this.clearIndices();
      this.graph.forEachNode((id) => this.addNode(id));
      this.graph.forEachEdge((e) => this.addEdge(e));
    } else {
      for (const id of partial.nodes ?? []) this.updateNode(id);
      for (const e of partial.edges ?? []) this.addEdge(e);
    }
    this.needToProcess = true;
    if (opts?.schedule) this.scheduleRender();
    else this.render();
  }
  render() {
    if (this.killed) return;
    if (this.renderFrame !== null) {
      this.win.cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
    }
    this.resize();
    if (this.needToProcess) this.process();
    this.needToProcess = false;
    this.clear();
    if (!this.graph.order) {
      this.emit("afterRender", void 0);
      return;
    }
    const state = this.camera.getState();
    const dims = this.getDimensions();
    const graphDims = this.getGraphDimensions();
    this.matrix = matrixFromCamera(state, dims, graphDims, STAGE_PADDING);
    this.invMatrix = matrixFromCamera(state, dims, graphDims, STAGE_PADDING, true);
    this.correctionRatio = getMatrixImpact(this.matrix, state, dims);
    const params = this.renderParams();
    this.nodePrograms.circle.render(params);
    this.nodePrograms.halo.render(params);
    this.edgePrograms.line.render(params);
    this.edgePrograms.curve.render(params);
    this.renderLabels();
    this.renderHighlightedNodes();
    this.emit("afterRender", void 0);
  }
  kill() {
    this.killed = true;
    this.removeAllListeners();
    this.camera.kill();
    this.win.removeEventListener("resize", this.onWindowResize);
    this.captor.kill();
    if (this.renderFrame !== null) this.win.cancelAnimationFrame(this.renderFrame);
    if (this.hoverFrame !== null) this.win.cancelAnimationFrame(this.hoverFrame);
    this.renderFrame = null;
    this.hoverFrame = null;
    this.clearIndices();
    this.hoveredNode = null;
    for (const p of [
      this.nodePrograms.circle,
      this.nodePrograms.halo,
      this.hoverPrograms.circle,
      this.hoverPrograms.halo,
      this.edgePrograms.line,
      this.edgePrograms.curve
    ]) p.kill();
    for (const gl of [this.gl.edges, this.gl.nodes, this.gl.hoverNodes]) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    for (const el of this.elements.values()) el.remove();
    this.elements.clear();
  }
  graphToViewport(p) {
    return this.framedGraphToViewport(this.normalization.apply(p));
  }
  viewportToGraph(p) {
    return this.normalization.inverse(this.viewportToFramedGraph(p));
  }
  getCamera() {
    return this.camera;
  }
  scaleSize(size = 1, cameraRatio = this.camera.ratio) {
    return size / cameraRatio;
  }
  getNodeDisplayData(id) {
    const d = this.nodeData.get(id);
    return d ? { ...d } : void 0;
  }
  getEdgeDisplayData(edge) {
    const d = this.edgeData.get(edge);
    return d ? { ...d } : void 0;
  }
  getSetting(name) {
    return this.settings[name];
  }
  setSetting(name, value) {
    this.settings[name] = value;
    this.applyCameraSettings();
    this.scheduleRefresh();
  }
  getCanvases() {
    const out = {};
    for (const [id, el] of this.elements) out[id] = el;
    return out;
  }
  getDimensions() {
    return { width: this.width, height: this.height };
  }
  getMouseCaptor() {
    return this.captor;
  }
  setCustomBBox(bbox) {
    this.customBBox = bbox;
    this.scheduleRender();
  }
  /* ---------------------------------------------------------------- layers */
  createCanvas(id) {
    const host = this.container;
    const canvas = host.createEl ? host.createEl("canvas") : this.doc.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
    canvas.className = "vg-layer vg-layer-" + id;
    this.container.appendChild(canvas);
    this.elements.set(id, canvas);
    return canvas;
  }
  createWebGL(id) {
    const canvas = this.createCanvas(id);
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: false, antialias: false });
    if (!gl) throw new Error("vault-graph: WebGL2 is not available in this window");
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    return gl;
  }
  create2D(id) {
    const canvas = this.createCanvas(id);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("vault-graph: could not create a 2D context");
    return ctx;
  }
  resize(force = false) {
    const prevW = this.width, prevH = this.height, prevRatio = this.pixelRatio;
    this.width = this.container.offsetWidth || 1;
    this.height = this.container.offsetHeight || 1;
    this.pixelRatio = this.win.devicePixelRatio || 1;
    if (!force && prevW === this.width && prevH === this.height && prevRatio === this.pixelRatio) return;
    const w = this.width * this.pixelRatio, h = this.height * this.pixelRatio;
    for (const el of this.elements.values()) {
      el.style.width = this.width + "px";
      el.style.height = this.height + "px";
      el.width = w;
      el.height = h;
    }
    if (this.pixelRatio !== 1) for (const ctx of Object.values(this.ctx)) ctx.scale(this.pixelRatio, this.pixelRatio);
    for (const gl of Object.values(this.gl)) gl.viewport(0, 0, w, h);
  }
  clear() {
    for (const gl of [this.gl.nodes, this.gl.edges, this.gl.hoverNodes]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    this.ctx.labels.clearRect(0, 0, this.width, this.height);
    this.ctx.hovers.clearRect(0, 0, this.width, this.height);
  }
  /* ------------------------------------------------------------- indexing */
  addNode(id) {
    const styled = this.nodeReducer(id, { ...this.graph.getNodeAttributes(id) });
    const data = applyNodeDefaults(id, styled);
    this.nodeData.set(id, data);
    this.forcedLabels.delete(id);
    if (data.forceLabel && !data.hidden) this.forcedLabels.add(id);
    this.highlighted.delete(id);
    if (data.highlighted && !data.hidden) this.highlighted.add(id);
    const z = data.zIndex ?? 0;
    if (z < this.nodeZExtent[0]) this.nodeZExtent[0] = z;
    if (z > this.nodeZExtent[1]) this.nodeZExtent[1] = z;
    this.normalization.applyTo(data);
  }
  updateNode(id) {
    this.addNode(id);
  }
  addEdge(edge) {
    const styled = this.edgeReducer(edge, { ...this.graph.getEdgeAttributes(edge) });
    const data = applyEdgeDefaults(styled);
    this.edgeData.set(edge, data);
    const z = data.zIndex ?? 0;
    if (z < this.edgeZExtent[0]) this.edgeZExtent[0] = z;
    if (z > this.edgeZExtent[1]) this.edgeZExtent[1] = z;
  }
  clearIndices() {
    this.nodeData.clear();
    this.edgeData.clear();
    this.forcedLabels.clear();
    this.highlighted.clear();
    this.nodeZExtent = [Infinity, -Infinity];
    this.edgeZExtent = [Infinity, -Infinity];
    this.nodeExtent = { x: [0, 1], y: [0, 1] };
  }
  process() {
    this.nodeExtent = graphExtent(this.graph);
    this.normalization = createNormalization(this.customBBox ?? this.nodeExtent);
    const ids = this.graph.nodes();
    const datas = [];
    const order = [];
    let circles = 0, halos = 0;
    for (const id of ids) {
      const data = this.nodeData.get(id);
      if (!data) continue;
      const attrs = this.graph.getNodeAttributes(id);
      data.x = attrs.x;
      data.y = attrs.y;
      this.normalization.applyTo(data);
      if (data.type === "halo") halos++;
      else circles++;
      order.push(id);
      datas.push(data);
    }
    this.nodePrograms.circle.reallocate(circles);
    this.nodePrograms.halo.reallocate(halos);
    if (this.nodeZExtent[0] !== this.nodeZExtent[1]) {
      const index = byZIndex(order.map((_, i) => i), (i) => datas[i].zIndex ?? 0);
      const sortedIds = [];
      const sortedDatas = [];
      for (const i of index) {
        sortedIds.push(order[i]);
        sortedDatas.push(datas[i]);
      }
      order.length = 0;
      datas.length = 0;
      for (let i = 0; i < sortedIds.length; i++) {
        order.push(sortedIds[i]);
        datas.push(sortedDatas[i]);
      }
    }
    circles = 0;
    halos = 0;
    for (const data of datas) {
      if (data.type === "halo") this.nodePrograms.halo.process(halos++, data);
      else this.nodePrograms.circle.process(circles++, data);
    }
    this.nodeOrder = order;
    let edges = this.graph.edges();
    let lines = 0, curves = 0;
    for (const e of edges) {
      const data = this.edgeData.get(e);
      if (!data) continue;
      if (data.type === "curve") curves++;
      else lines++;
    }
    this.edgePrograms.line.reallocate(lines);
    this.edgePrograms.curve.reallocate(curves);
    if (this.edgeZExtent[0] !== this.edgeZExtent[1]) {
      edges = byZIndex(edges, (e) => this.edgeData.get(e)?.zIndex ?? 0);
    }
    lines = 0;
    curves = 0;
    for (const e of edges) {
      const data = this.edgeData.get(e);
      if (!data) continue;
      const [s, t] = this.graph.extremities(e);
      const sd = this.nodeData.get(s), td = this.nodeData.get(t);
      if (!sd || !td) continue;
      if (data.type === "curve") this.edgePrograms.curve.process(curves++, sd, td, data);
      else this.edgePrograms.line.process(lines++, sd, td, data);
    }
  }
  /* -------------------------------------------------------------- drawing */
  renderParams() {
    return {
      matrix: this.matrix,
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
      zoomRatio: this.camera.ratio,
      sizeRatio: 1 / this.scaleSize(),
      correctionRatio: this.correctionRatio,
      minEdgeThickness: this.settings.minEdgeThickness,
      antiAliasingFeather: ANTI_ALIASING_FEATHER
    };
  }
  renderLabels() {
    const ctx = this.ctx.labels;
    const { labelSize, labelFont, labelWeight, labelColor } = this.settings;
    for (const id of this.forcedLabels) {
      const data = this.nodeData.get(id);
      if (!data || data.hidden || !data.label) continue;
      const { x, y } = this.framedGraphToViewport(data);
      const size = this.scaleSize(data.size);
      if (x < -X_LABEL_MARGIN || x > this.width + X_LABEL_MARGIN || y < -Y_LABEL_MARGIN || y > this.height + Y_LABEL_MARGIN) continue;
      ctx.fillStyle = labelColor;
      ctx.font = `${labelWeight} ${labelSize}px ${labelFont}`;
      ctx.fillText(data.label, x + size + 3, y + labelSize / 3);
    }
  }
  renderHighlightedNodes() {
    const ctx = this.ctx.hovers;
    ctx.clearRect(0, 0, this.width, this.height);
    const toRender = [];
    const hovered = this.hoveredNode;
    if (hovered !== null) {
      const d = this.nodeData.get(hovered);
      if (d && !d.hidden) toRender.push(hovered);
    }
    for (const id of this.highlighted) if (id !== hovered) toRender.push(id);
    for (const id of toRender) {
      const data = this.nodeData.get(id);
      if (!data) continue;
      const { x, y } = this.framedGraphToViewport(data);
      this.drawHover(ctx, { key: id, ...data, size: this.scaleSize(data.size), x, y }, this.settings);
    }
    let circles = 0, halos = 0;
    for (const id of toRender) {
      if (this.nodeData.get(id)?.type === "halo") halos++;
      else circles++;
    }
    this.hoverPrograms.circle.reallocate(circles);
    this.hoverPrograms.halo.reallocate(halos);
    circles = 0;
    halos = 0;
    for (const id of toRender) {
      const data = this.nodeData.get(id);
      if (!data) continue;
      if (data.type === "halo") this.hoverPrograms.halo.process(halos++, data);
      else this.hoverPrograms.circle.process(circles++, data);
    }
    const gl = this.gl.hoverNodes;
    gl.clear(gl.COLOR_BUFFER_BIT);
    const params = this.renderParams();
    this.hoverPrograms.circle.render(params);
    this.hoverPrograms.halo.render(params);
  }
  scheduleRender() {
    if (this.killed || this.renderFrame !== null) return;
    this.renderFrame = this.win.requestAnimationFrame(() => this.render());
  }
  scheduleRefresh() {
    this.refresh({ schedule: true });
  }
  scheduleHighlightedNodesRender() {
    if (this.killed || this.hoverFrame !== null || this.renderFrame !== null) return;
    this.hoverFrame = this.win.requestAnimationFrame(() => {
      this.hoverFrame = null;
      this.renderHighlightedNodes();
    });
  }
  /* --------------------------------------------------------------- camera */
  applyCameraSettings() {
    this.camera.minRatio = this.settings.minCameraRatio;
    this.camera.maxRatio = this.settings.maxCameraRatio;
    this.camera.enabledPanning = this.settings.enableCameraPanning;
    this.camera.setState(this.camera.validateState(this.camera.getState()));
  }
  getGraphDimensions() {
    const extent = this.customBBox ?? this.nodeExtent;
    return { width: extent.x[1] - extent.x[0] || 1, height: extent.y[1] - extent.y[0] || 1 };
  }
  framedGraphToViewport(p) {
    const v = multiplyVec2(this.matrix, p);
    return { x: (1 + v.x) * this.width / 2, y: (1 - v.y) * this.height / 2 };
  }
  viewportToFramedGraph(p) {
    const res = multiplyVec2(this.invMatrix, { x: p.x / this.width * 2 - 1, y: 1 - p.y / this.height * 2 });
    if (Number.isNaN(res.x)) res.x = 0;
    if (Number.isNaN(res.y)) res.y = 0;
    return res;
  }
  getViewportZoomedState(target, newRatio) {
    const { ratio, angle, x, y } = this.camera.getState();
    const { minCameraRatio, maxCameraRatio } = this.settings;
    if (typeof maxCameraRatio === "number") newRatio = Math.min(newRatio, maxCameraRatio);
    if (typeof minCameraRatio === "number") newRatio = Math.max(newRatio, minCameraRatio);
    const ratioDiff = newRatio / ratio;
    const mouse = this.viewportToFramedGraph(target);
    const centre = this.viewportToFramedGraph({ x: this.width / 2, y: this.height / 2 });
    return {
      angle,
      x: (mouse.x - centre.x) * (1 - ratioDiff) + x,
      y: (mouse.y - centre.y) * (1 - ratioDiff) + y,
      ratio: newRatio
    };
  }
  /* -------------------------------------------------------------- picking */
  getNodeAtPosition(p) {
    let lastCircle = null;
    let lastHalo = null;
    let nearest = null;
    let nearestD2 = PICK_FLOOR_PX * PICK_FLOOR_PX;
    const inv = 1 / this.camera.ratio;
    for (const id of this.nodeOrder) {
      const data = this.nodeData.get(id);
      if (!data || data.hidden) continue;
      const v = this.framedGraphToViewport(data);
      const r = data.size * inv;
      const dx = v.x - p.x, dy = v.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > r * r) {
        if (d2 <= nearestD2) {
          nearestD2 = d2;
          nearest = id;
        }
        continue;
      }
      if (data.type === "halo") lastHalo = id;
      else lastCircle = id;
    }
    return lastHalo ?? lastCircle ?? nearest;
  }
  /* --------------------------------------------------------------- events */
  bindCaptor() {
    const base = (event) => ({ event, preventDefault: () => event.preventDefault() });
    this.captor.on("mousemove", (e) => {
      const ev = base(e);
      const at = this.getNodeAtPosition(e);
      if (at !== null && this.hoveredNode !== at) {
        if (this.hoveredNode !== null) this.emit("leaveNode", { ...ev, node: this.hoveredNode });
        this.hoveredNode = at;
        this.emit("enterNode", { ...ev, node: at });
        this.scheduleHighlightedNodesRender();
        return;
      }
      if (this.hoveredNode !== null && at !== this.hoveredNode) {
        const node = this.hoveredNode;
        this.hoveredNode = null;
        this.emit("leaveNode", { ...ev, node });
        this.scheduleHighlightedNodesRender();
      }
    });
    this.captor.on("mouseleave", (e) => {
      if (this.hoveredNode !== null) {
        const node = this.hoveredNode;
        this.hoveredNode = null;
        this.emit("leaveNode", { ...base(e), node });
        this.scheduleHighlightedNodesRender();
      }
    });
    const interaction = (kind) => (e) => {
      const ev = base(e);
      const at = this.getNodeAtPosition(e);
      if (at !== null) {
        const payload = { ...ev, node: at };
        if (kind === "click") this.emit("clickNode", payload);
        else if (kind === "doubleClick") this.emit("doubleClickNode", payload);
        else if (kind === "rightClick") this.emit("rightClickNode", payload);
        else if (kind === "down") this.emit("downNode", payload);
        else this.emit("upNode", payload);
        return;
      }
      if (kind === "click") this.emit("clickStage", ev);
      else if (kind === "doubleClick") this.emit("doubleClickStage", ev);
      else if (kind === "rightClick") this.emit("rightClickStage", ev);
      else if (kind === "down") this.emit("downStage", ev);
      else this.emit("upStage", ev);
    };
    this.captor.on("click", interaction("click"));
    this.captor.on("doubleClick", interaction("doubleClick"));
    this.captor.on("rightClick", interaction("rightClick"));
    this.captor.on("mousedown", interaction("down"));
    this.captor.on("mouseup", interaction("up"));
  }
};

// src/dates.mjs
var ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
function isRealDay(s) {
  if (!ISO_DAY.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}
function day10(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return localDay(v.getTime());
  const s = typeof v === "string" ? v.slice(0, 10) : "";
  return isRealDay(s) ? s : "";
}
function localDay(ms) {
  const d = new Date(ms), p2 = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate());
}
var NAME_DAY = /^(\d{4}-\d{2}-\d{2})(?![\d-])/;
function nameDay(basename) {
  const m = NAME_DAY.exec(String(basename || ""));
  return m && isRealDay(m[1]) ? m[1] : "";
}
function stampDay(ctimeMs, mtimeMs) {
  const c = Number(ctimeMs) || 0, m = Number(mtimeMs) || 0;
  const pick = c && m ? Math.min(c, m) : c || m;
  return pick ? localDay(pick) : "";
}
function resolveCreated(fm, basename, ctimeMs, mtimeMs) {
  const f = day10(fm && fm.created) || day10(fm && fm.date);
  if (f) return { day: f, source: "frontmatter" };
  const n = nameDay(basename);
  if (n) return { day: n, source: "filename" };
  const s = stampDay(ctimeMs, mtimeMs);
  if (s) return { day: s, source: "stamp" };
  return { day: "", source: "none" };
}
function dateTally() {
  return { frontmatter: 0, filename: 0, stamp: 0, none: 0 };
}

// raw::src/page.html
var page_default = '<div id="vg-app" class="vault-graph" data-theme="dark">\n  <aside id="vg-sidebar">\n    <div class="brand">\n      <h1 id="vg-vname">Vault Graph</h1>\n      <button id="vg-gear" class="gear" hidden aria-expanded="false"\n              aria-controls="vg-settings" title="Settings">\n        <span aria-hidden="true">&#9881;</span><span class="sr">Settings</span>\n      </button>\n    </div>\n\n    <div class="block" id="vg-settings" hidden>\n      <!-- github#23 -->\n      <div id="vg-optbody"></div>\n      <div class="row" style="margin-bottom:7px">\n        <div class="lbl" style="margin:0">Folder colours</div>\n        <div class="mini"><button id="vg-fcreset" title="Drop every folder AND subfolder override and go back to the automatic order">Reset</button></div>\n      </div>\n      <div id="vg-setbody"></div>\n      <p class="hint">Twelve slots, handed out in folder order and round again. Setting\n        one folder never moves another, and two folders may share a colour.</p>\n    </div>\n\n    <div class="block">\n    </div>\n\n    <div class="block">\n      <div class="lbl">Search</div>\n      <input type="search" id="vg-q" placeholder="Find a note...">\n      <div id="vg-hits"></div>\n    </div>\n\n    <div class="block">\n      <div class="row" style="margin-bottom:7px">\n        <div class="lbl" style="margin:0">Groups <span id="vg-gcount" class="val"></span></div>\n        <div class="mini"><button id="vg-allon">All</button><button id="vg-alloff">None</button></div>\n      </div>\n      <div id="vg-legend"></div>\n    </div>\n\n    <div class="block">\n      <div class="lbl">View</div>\n      <div class="tools">\n        <button id="vg-refresh" title="Back to the defaults, and replay the intro. Clears highlights and the date range, and returns each folder to the visibility set in the gear -- so archives go back to hidden. This page is a snapshot -- its data was baked in when it was built -- so to pick up notes written since, rebuild it with refresh-graph.ps1 (or build-graph.mjs). The Obsidian plugin rebuilds in place instead.">Refresh</button>\n        <button id="vg-png">Save PNG</button>\n        <button id="vg-dbg" title="Copy the exact layout state, for a bug report">Debug</button>\n      </div>\n    </div>\n\n    <div id="vg-stats"></div>\n  </aside>\n\n  <main id="vg-stage">\n    <div id="vg-heat">\n      <div class="hrow">\n        <div class="lbl">Notes added</div>\n        <span id="vg-heatnote"></span>\n        <div id="vg-heatscale" aria-hidden="true">\n          <span>fewer</span><canvas id="vg-heatkey"></canvas><span>more</span>\n        </div>\n        <button id="vg-compact" type="button" aria-pressed="true"\n                title="Compact the date axis by note count. Off gives every year and month equal width."\n                aria-label="Compact date axis">\n          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">\n            <path d="M3 4l3 4-3 4M13 4l-3 4 3 4" fill="none" stroke="currentColor"\n                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n          </svg>\n        </button>\n        <div id="vg-rangebox">\n          <input id="vg-from" class="dt" type="date" aria-label="Range start">\n          <span class="arw" aria-hidden="true">&rarr;</span>\n          <input id="vg-to" class="dt" type="date" aria-label="Range end">\n          <button id="vg-rangeall" class="btn" title="Clear the date range">All dates</button>\n        </div>\n      </div>\n      <div id="vg-heatwrap"><canvas id="vg-heatc"></canvas></div>\n      <canvas id="vg-ribbon"></canvas>\n      <div id="vg-years"></div>\n      <div id="vg-rtip" hidden></div>\n      <div id="vg-htip" hidden></div>\n    </div>\n\n    <div id="vg-canvas">\n      <div id="vg-logo" aria-hidden="true" hidden></div>\n      <div id="vg-logoInner" aria-hidden="true" hidden></div>\n      <div id="vg-graph"></div>\n      <!-- github#12 -->\n      <div id="vg-hubdrop" aria-hidden="true" hidden></div>\n      <!-- github#4 -->\n      <div id="vg-cam" role="group" aria-label="View controls">\n        <button id="vg-zin" type="button" title="Zoom in" aria-label="Zoom in">\n          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true" focusable="false">\n            <path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.6"\n                  stroke-linecap="round"/>\n          </svg>\n        </button>\n        <button id="vg-zout" type="button" title="Zoom out" aria-label="Zoom out">\n          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true" focusable="false">\n            <path d="M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.6"\n                  stroke-linecap="round"/>\n          </svg>\n        </button>\n        <button id="vg-reset" type="button" title="Fit the disc (or double-click the graph)"\n                aria-label="Fit the disc">\n          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true" focusable="false">\n            <path d="M1.5 5.5V2.5a1 1 0 0 1 1-1h3M14.5 5.5V2.5a1 1 0 0 0-1-1h-3M1.5 10.5v3a1 1 0 0 0 1 1h3M14.5 10.5v3a1 1 0 0 1-1 1h-3"\n                  fill="none" stroke="currentColor" stroke-width="1.5"\n                  stroke-linecap="round" stroke-linejoin="round"/>\n            <circle cx="8" cy="8" r="1.6" fill="currentColor"/>\n          </svg>\n        </button>\n        <button id="vg-pan" type="button" aria-pressed="true"\n                title="Drag to pan. Off pins the disc to the centre."\n                aria-label="Drag to pan">\n          <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true" focusable="false">\n            <path d="M8 2v12M2 8h12M8 2 6.4 4M8 2l1.6 2M8 14l-1.6-2M8 14l1.6-2M2 8l2-1.6M2 8l2 1.6M14 8l-2-1.6M14 8l-2 1.6"\n                  fill="none" stroke="currentColor" stroke-width="1.4"\n                  stroke-linecap="round" stroke-linejoin="round"/>\n          </svg>\n        </button>\n      </div>\n      <div id="vg-tip" hidden></div>\n      <div id="vg-detail" hidden></div>\n    </div>\n\n    <div id="vg-busy">Laying out graph...</div>\n  </main>\n\n  <div id="vg-ctxmenu" class="ctxmenu" hidden role="menu"></div>\n\n  <div id="vg-democursor" aria-hidden="true" hidden>\n    <svg viewBox="0 0 24 24" width="22" height="22">\n      <path d="M3 2 L3 18.5 L7.2 14.6 L10.6 21.8 L13.3 20.5 L9.9 13.4 L16.5 13.4 Z"\n            fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/>\n    </svg>\n  </div>\n</div>\n';

// b64::assets/logo-mask.png
var logo_mask_default = "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";

// plugin/main.js
var VIEW_TYPE = "vault-graph-view";
var ICON_ID = "vault-graph-disc";
function discIcon() {
  const ring = (r, dot, slots2, offset) => {
    let out = "";
    for (let i = 0; i < slots2; i++) {
      const rad = (-90 + (offset || 0) + 360 * i / slots2) * Math.PI / 180;
      out += '<circle cx="' + (50 + r * Math.cos(rad)).toFixed(2) + '" cy="' + (50 + r * Math.sin(rad)).toFixed(2) + '" r="' + dot + '"/>';
    }
    return out;
  };
  return '<g fill="currentColor" stroke="none">' + ring(36, 8.5, 8, 0) + ring(16, 6.5, 4, 22.5) + "</g>";
}
var MONTHISH = /^\d{4}(?:[-_ ]?(?:\d{2}|Q[1-4]|W\d{1,2}))?$/i;
var TYPE_ALIAS = {
  people: "person",
  person: "person",
  "zettel/permanent": "zettel",
  "zettel/fleeting": "zettel",
  "zettel/literature": "zettel"
};
var SKIP_FILES = /* @__PURE__ */ new Set(["claude.md", "readme.md", "license.md"]);
var deNumber = (s) => String(s).replace(/^[\s\d._)-]+/, "").trim();
var slug = (s) => deNumber(s).toLowerCase().replace(/[\s_]+/g, "-");
var singular = (s) => s.replace(/ies$/, "y").replace(/([^aeious])s$/, "$1");
var norm = (s) => String(s).split(/[\\/]/).filter(Boolean).join("/");
var under = (rel, dir) => !!dir && (rel === dir || rel.startsWith(dir + "/"));
var attempt = (fn) => {
  try {
    fn();
    return null;
  } catch (e) {
    return e;
  }
};
var walkOrder = (a, b) => {
  const sa = a.split("/"), sb = b.split("/");
  const n = Math.min(sa.length, sb.length);
  for (let i = 0; i < n; i++) {
    if (sa[i] !== sb[i]) return sa[i] < sb[i] ? -1 : 1;
  }
  return sa.length - sb.length;
};
var paraFolder = (path) => {
  const seg = path.split("/");
  return seg.length > 1 ? seg[0] : "(vault root)";
};
var paraDirs = (path, flatMonths) => {
  const seg = path.split("/").slice(1, -1);
  const out = [];
  for (let i = 0; i < seg.length; i++) {
    if (MONTHISH.test(seg[i])) {
      if (i === 0 && !flatMonths) out.push(seg[i]);
      break;
    }
    out.push(seg[i]);
  }
  return out;
};
function inferType(fm, path, tags, dailyDir, isTemplate) {
  const raw = typeof fm.type === "string" ? fm.type.toLowerCase() : "";
  if (raw) return TYPE_ALIAS[raw] || raw;
  if (tags.indexOf("daily-note") >= 0) return "daily";
  if (under(path, dailyDir)) return "daily";
  if (isTemplate(path)) return "template";
  const dirs = path.split("/").slice(0, -1).filter(Boolean);
  const named = dirs.filter((d) => !MONTHISH.test(d));
  const pick = named.length ? named[named.length - 1] : dirs[0];
  const type = pick ? singular(slug(pick)) : "";
  return type || "note";
}
async function readConfigJson(app, name) {
  try {
    const p = (0, import_obsidian.normalizePath)(app.vault.configDir + "/" + name);
    if (!await app.vault.adapter.exists(p)) return null;
    const parsed = JSON.parse(await app.vault.adapter.read(p));
    return parsed;
  } catch {
    return null;
  }
}
var strField = (obj, key) => {
  if (!obj || typeof obj !== "object" || !(key in obj)) return "";
  const v = (
    /** @type {Record<string, unknown>} */
    obj[key]
  );
  return typeof v === "string" ? v : "";
};
async function readFolders(app) {
  const dirs = /* @__PURE__ */ new Set();
  const core = strField(await readConfigJson(app, "templates.json"), "folder");
  if (core.trim()) dirs.add(norm(core));
  const templater = strField(await readConfigJson(app, "plugins/templater-obsidian/data.json"), "templates_folder");
  if (templater.trim()) dirs.add(norm(templater));
  const dn = strField(await readConfigJson(app, "daily-notes.json"), "folder");
  const dailyDir = dn.trim() ? norm(dn) : "";
  return { templateDirs: Array.from(dirs), dailyDir };
}
async function buildData(app, opts) {
  const t0 = performance.now();
  const folders = await readFolders(app);
  const templateDirs = folders.templateDirs, dailyDir = folders.dailyDir;
  const isTemplate = (path) => templateDirs.some((d) => under(path, d));
  const files = app.vault.getMarkdownFiles().filter((f) => {
    if (SKIP_FILES.has(f.name.toLowerCase())) return false;
    return opts.templates ? true : !isTemplate(f.path);
  });
  files.sort((a, b) => walkOrder(a.path, b.path));
  const index = /* @__PURE__ */ new Map();
  const nodes = [];
  const dates = dateTally();
  for (const file of files) {
    const cache2 = app.metadataCache.getFileCache(file) || {};
    const fm = cache2.frontmatter || {};
    const rawTags = [];
    const tags = rawTags.concat(fm.tags || [], fm.tag || []).flatMap((t) => String(t).split(/[,\s]+/)).map((t) => t.replace(/^#/, "").trim()).filter(Boolean);
    const dirs = paraDirs(file.path, opts.flatMonths);
    const dated = resolveCreated(fm, file.basename, file.stat.ctime, file.stat.mtime);
    dates[dated.source]++;
    index.set(file.path, nodes.length);
    nodes.push({
      id: file.path,
      label: file.basename,
      folder: paraFolder(file.path),
      dirs,
      sub: dirs[0] || "",
      type: inferType(fm, file.path, tags, dailyDir, isTemplate),
      tags,
      created: dated.day,
      touched: localDay(file.stat.mtime),
      words: 0,
      _file: file
    });
  }
  const tIndex = performance.now();
  const weight = /* @__PURE__ */ new Map();
  const addEdge = (i, j, w) => {
    if (i === j) return;
    const key = i < j ? i + " " + j : j + " " + i;
    weight.set(key, (weight.get(key) || 0) + w);
  };
  let attachmentLinks = 0, filteredLinks = 0;
  const resolved = app.metadataCache.resolvedLinks || {};
  for (const src of Object.keys(resolved)) {
    const i = index.get(src);
    if (i === void 0) continue;
    for (const dest of Object.keys(resolved[src])) {
      const j = index.get(dest);
      if (j === void 0) {
        if (dest.toLowerCase().endsWith(".md")) filteredLinks++;
        else attachmentLinks++;
        continue;
      }
      addEdge(i, j, resolved[src][dest]);
    }
  }
  const unresolvedMap = app.metadataCache.unresolvedLinks || {};
  let unresolved = 0;
  const ghosts = /* @__PURE__ */ new Map();
  for (const src of Object.keys(unresolvedMap)) {
    const i = index.get(src);
    if (i === void 0) continue;
    for (const target of Object.keys(unresolvedMap[src])) {
      const n = unresolvedMap[src][target];
      unresolved += n;
      if (!opts.ghosts) continue;
      const key = target.split("/").pop();
      if (!ghosts.has(key)) ghosts.set(key, []);
      ghosts.get(key).push([i, n]);
    }
  }
  if (opts.ghosts) {
    for (const entry of ghosts) {
      const name = entry[0], sources = entry[1];
      const j = nodes.length;
      nodes.push({
        id: "ghost:" + name,
        label: name,
        folder: "(unresolved)",
        sub: "",
        dirs: [],
        type: "ghost",
        tags: [],
        created: "",
        touched: "",
        words: 0,
        ghost: true
      });
      for (const pair of sources) addEdge(pair[0], j, pair[1]);
    }
  }
  const tEdges = performance.now();
  const wordFiles = opts.words ? nodes.map((n) => n._file || null) : null;
  const readWords = async (apply) => {
    const t = performance.now();
    if (!wordFiles) return 0;
    await Promise.all(wordFiles.map(async (file, i) => {
      if (!file) return;
      let words = 0;
      try {
        const raw = await app.vault.cachedRead(file);
        const m = /^---\r?\n[\s\S]*?\r?\n---/.exec(raw.replace(/^\uFEFF/, ""));
        const body = m ? raw.slice(m[0].length) : raw;
        words = body.split(/\s+/).filter(Boolean).length;
      } catch {
        words = 0;
      }
      apply(i, words);
    }));
    return Math.round(performance.now() - t);
  };
  const tWords = performance.now();
  const edges = Array.from(weight).map((entry) => {
    const ab = entry[0].split(" ");
    return { s: Number(ab[0]), t: Number(ab[1]), w: entry[1] };
  });
  const degree = (
    /** @type {number[]} */
    new Array(nodes.length).fill(0)
  );
  for (const e of edges) {
    degree[e.s]++;
    degree[e.t]++;
  }
  const out = nodes.map((n, i) => {
    const clean = Object.assign({}, n, { deg: degree[i] });
    delete clean._file;
    return clean;
  });
  const p2 = (n) => String(n).padStart(2, "0");
  const now = /* @__PURE__ */ new Date();
  return {
    vault: app.vault.getName(),
    generated: now.getFullYear() + "-" + p2(now.getMonth() + 1) + "-" + p2(now.getDate()) + " " + p2(now.getHours()) + ":" + p2(now.getMinutes()),
    nodes: out,
    edges,
    stats: {
      files: files.length,
      nodes: out.length,
      edges: edges.length,
      unresolved,
      orphans: degree.filter((d) => d === 0).length,
      // github#6
      dates,
      templatesExcluded: !opts.templates,
      ghostsIncluded: !!opts.ghosts
    },
    readWords,
    _spike: {
      msIndex: Math.round(tIndex - t0),
      msEdges: Math.round(tEdges - tIndex),
      msWords: Math.round(tWords - tEdges),
      msWordsBackground: (
        /** @type {number | null} */
        null
      ),
      msTotal: Math.round(tWords - t0),
      templateDirs,
      dailyDir,
      attachmentLinks,
      filteredLinks
    }
  };
}
var VaultGraphView = class extends import_obsidian.ItemView {
  /**
   * @param {import("obsidian").WorkspaceLeaf} leaf
   * @param {VaultGraphPlugin} plugin
   */
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.handle = null;
    this.lastData = null;
    this.mountMs = 0;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Vault graph";
  }
  getIcon() {
    return ICON_ID;
  }
  async onOpen() {
    await this.render();
  }
  async onClose() {
    this.teardown();
  }
  // github#62
  teardown() {
    if (this.handle) {
      attempt(() => this.handle.destroy());
    }
    this.handle = null;
    this.contentEl.empty();
  }
  syncTheme() {
    if (!this.page) return;
    const want = activeDocument.body.classList.contains("theme-light") ? "light" : "dark";
    if (this.page.getAttribute("data-theme") === want) return;
    this.page.setAttribute("data-theme", want);
    const api = this.handle && this.handle.api;
    if (api) {
      attempt(() => {
        if (api.readTheme) api.readTheme();
        if (api.renderer) api.renderer.refresh();
        if (api.placeLogo) api.placeLogo();
        if (api.heatBuild) api.heatBuild();
      });
    }
  }
  async render() {
    this.teardown();
    const root = this.contentEl;
    root.addClass("vault-graph-view");
    const data = await buildData(this.app, this.plugin.settings);
    this.lastData = data;
    const parsed = new DOMParser().parseFromString(page_default, "text/html");
    const page = parsed.body.firstElementChild;
    if (!page) throw new Error("page markup did not parse to an element");
    root.appendChild(page);
    this.page = page;
    this.syncTheme();
    this.registerEvent(this.app.workspace.on("css-change", () => this.syncTheme()));
    const t0 = performance.now();
    this.handle = mountVaultGraph(page, data, {
      Graph: GraphStore,
      Renderer,
      logoMask: "data:image/png;base64," + logo_mask_default,
      folderColors: this.plugin.settings.folderColors,
      subfolderColors: this.plugin.settings.subfolderColors,
      /** @param {Record<string, string>} map */
      onFolderColors: async (map) => {
        this.plugin.settings.folderColors = map;
        await this.plugin.saveSettings();
      },
      /** @param {Record<string, string>} map */
      onSubfolderColors: async (map) => {
        this.plugin.settings.subfolderColors = map;
        await this.plugin.saveSettings();
      },
      // github#34
      // github#3
      /** @param {Record<string, boolean>} map */
      onFolderShown: async (map) => {
        this.plugin.settings.folderShown = map;
        await this.plugin.saveSettings();
      },
      folderShown: this.plugin.settings.folderShown,
      panEnabled: this.plugin.settings.panEnabled,
      /** @param {boolean} v */
      onPanEnabled: async (v) => {
        this.plugin.settings.panEnabled = !!v;
        await this.plugin.saveSettings();
      },
      // github#23
      compactAxis: this.plugin.settings.compactAxis,
      /** @param {boolean} v */
      onCompactAxis: async (v) => {
        this.plugin.settings.compactAxis = !!v;
        await this.plugin.saveSettings();
      },
      // github#3
      unlinkedByFolder: this.plugin.settings.unlinkedByFolder,
      /** @param {boolean} v */
      onUnlinkedByFolder: async (v) => {
        this.plugin.settings.unlinkedByFolder = !!v;
        await this.plugin.saveSettings();
      },
      // github#3
      unlinkedTintByFolder: this.plugin.settings.unlinkedTintByFolder,
      /** @param {boolean} v */
      onUnlinkedTintByFolder: async (v) => {
        this.plugin.settings.unlinkedTintByFolder = !!v;
        await this.plugin.saveSettings();
      },
      // github#41, design/0011
      fitCap: this.plugin.settings.fitCap !== false,
      pinned: this.plugin.settings.pinned,
      /** @param {string[]} ids */
      onPinned: async (ids) => {
        this.plugin.settings.pinned = ids;
        await this.plugin.saveSettings();
      },
      openSettings: () => this.plugin.openSettings(),
      win: activeWindow,
      // github#6
      onRefresh: () => {
        if (this.rebuilding) return;
        this.rebuilding = true;
        this.render().catch(
          /** @param {Error} e */
          (e) => new import_obsidian.Notice("Vault Graph: rebuild failed -- " + e.message)
        ).finally(() => {
          this.rebuilding = false;
        });
      }
    });
    this.mountMs = Math.round(performance.now() - t0);
    const handle = this.handle;
    void data.readWords((i, words) => {
      data.nodes[i].words = words;
      const api = handle.api;
      if (api && api.graph && this.handle === handle) api.graph.setNodeAttribute(String(i), "words", words);
    }).then((ms) => {
      data._spike.msWordsBackground = ms;
    }, () => {
    });
    this.registerDomEvent(page, "click", (ev) => {
      const a = ev.target instanceof Element ? ev.target.closest('a[href^="obsidian://"]') : null;
      if (!a) return;
      ev.preventDefault();
      try {
        const q = new URLSearchParams(a.getAttribute("href").split("?")[1] || "");
        const file = q.get("file");
        if (file) this.app.workspace.openLinkText(file, "", false);
      } catch {
        new import_obsidian.Notice("Could not open that note.");
      }
    });
  }
};
var DEFAULTS = {
  ghosts: false,
  templates: false,
  flatMonths: false,
  words: true,
  folderColors: {},
  subfolderColors: {},
  folderShown: {},
  pinned: [],
  panEnabled: true,
  // github#23
  compactAxis: true,
  // github#3
  unlinkedByFolder: true,
  // github#3
  unlinkedTintByFolder: false,
  // github#41, design/0011
  fitCap: true
};
var BUILD_SETTINGS = [
  {
    key: "ghosts",
    name: "Include notes that do not exist yet",
    desc: "Wikilinks pointing at a note nobody has written. They are intentions rather than notes, so they are off by default."
  },
  {
    key: "templates",
    name: "Include templates",
    desc: "Notes under the template folders. Off by default: a template links to nothing and is linked from nothing, so it lands in the hub as noise."
  },
  {
    key: "flatMonths",
    name: "Flatten month folders",
    desc: "Treat 2026-08 and its siblings as one folder rather than as a subfolder each. Turn this on if a year of daily notes is drowning its parent's legend row."
  },
  {
    key: "words",
    name: "Count words",
    desc: "Sizes each note by its length. The one setting that costs real I/O: it reads every file rather than answering from the metadata cache."
  }
];
var VIEW_SETTINGS = [
  {
    key: "panEnabled",
    name: "Drag to pan",
    defaultOn: true,
    api: "setPanEnabled",
    desc: "Drag the graph to move it, and zoom toward the pointer. Off pins the disc to the centre of the view. The control in the graph's bottom-right corner flips it too, and lands back here."
  },
  {
    key: "compactAxis",
    name: "Compact date axis",
    defaultOn: true,
    api: "setCompactAxis",
    desc: "Give each year on the date strip width by how many notes it holds, instead of every year and month reading the same width regardless of content."
  },
  {
    key: "unlinkedByFolder",
    name: "Unlinked notes join their folder",
    defaultOn: true,
    api: "setUnlinkedByFolder",
    desc: "A note with no links takes its own folder's wedge and colour, instead of sitting apart in a separate unlinked group. The (unlinked) row's right-click menu flips this too, and lands back here."
  },
  {
    key: "unlinkedTintByFolder",
    name: "Colour unlinked notes by folder",
    defaultOn: false,
    api: "setUnlinkedTintByFolder",
    desc: "While unlinked notes are kept as their own group (the toggle just above is off), give each one its own folder's colour instead of the flat unlinked swatch. The (unlinked) row's right-click menu carries this too."
  },
  // github#41, design/0011
  {
    key: "fitCap",
    name: "Size dots from the frame",
    defaultOn: true,
    api: "setFitCap",
    desc: "While the disc animates, cap every dot at just under half its distance to the nearest visible note, measured on the frame being drawn, so dots stay apart while rows slide. The disc at rest is unchanged. Experimental: dots breathe while a cascade walks."
  }
];
var COLOURS_DESC = "Twelve slots, handed out in folder order and round again. Setting one folder never moves another, and two folders may share a colour.";
var SLOT_NAMES = [
  "Blue",
  "Orange",
  "Aqua",
  "Yellow",
  "Green",
  "Magenta",
  "Violet",
  "Red",
  "Cyan",
  "Orchid",
  "Grey",
  "Slate"
];
var isArchiveGroup = (name) => String(name).charAt(0) === "_";
var ARCHIVE_SLOT = "g11";
function topFolders(app) {
  const count = /* @__PURE__ */ new Map();
  for (const file of app.vault.getMarkdownFiles()) {
    if (SKIP_FILES.has(file.name.toLowerCase())) continue;
    const g = paraFolder(file.path);
    count.set(g, (count.get(g) || 0) + 1);
  }
  const rank = (s) => s.charAt(0) === "_" ? 0 : s.charAt(0) === "(" ? 1 : 2;
  return Array.from(count.entries()).sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0], void 0, { numeric: true })).map(([name, n]) => ({ name, n }));
}
function allSubfolders(app, flatMonths) {
  const byFolder = /* @__PURE__ */ new Map();
  for (const file of app.vault.getMarkdownFiles()) {
    if (SKIP_FILES.has(file.name.toLowerCase())) continue;
    const g = paraFolder(file.path);
    let count = byFolder.get(g);
    if (!count) {
      const fresh = /* @__PURE__ */ new Map();
      byFolder.set(g, count = fresh);
    }
    const sb = paraDirs(file.path, flatMonths)[0] || "";
    count.set(sb, (count.get(sb) || 0) + 1);
  }
  const out = /* @__PURE__ */ new Map();
  for (const [g, count] of byFolder) {
    out.set(g, Array.from(count.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, n]) => ({ name, n })));
  }
  return out;
}
var VaultGraphSettingTab = class extends import_obsidian.PluginSettingTab {
  /**
   * @param {App} app
   * @param {VaultGraphPlugin} plugin
   */
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.subOpen = {};
    this.scope = null;
  }
  /* ----------------------------------------------------------- two render paths --
   * Obsidian 1.13 renders a settings tab from getSettingDefinitions() -- that is also what
   * its settings search indexes -- and does not call display() when the definitions are
   * non-empty. Below 1.13 only display() exists. minAppVersion is 1.7.2, so both are here,
   * built from the same tables (BUILD_SETTINGS, VIEW_SETTINGS) and the same colour section
   * (renderColourSection), so that what one path shows the other shows too. github#59. */
  /**
   * The declarative tab: the four build toggles, the four view toggles under a heading, and
   * the folder-colour picker as one imperatively rendered row, since a per-folder swatch grid
   * with expandable subfolder rows is nothing a declarative control expresses.
   * @returns {import("obsidian").SettingDefinitionItem[]}
   */
  getSettingDefinitions() {
    const toggle = (s, defaultOn) => ({
      name: s.name,
      desc: s.desc,
      control: { type: (
        /** @type {"toggle"} */
        "toggle"
      ), key: s.key, defaultValue: defaultOn }
    });
    return [
      ...BUILD_SETTINGS.map((s) => toggle(s, false)),
      {
        type: (
          /** @type {"group"} */
          "group"
        ),
        heading: "View",
        items: VIEW_SETTINGS.map((s) => toggle(s, s.defaultOn))
      },
      {
        type: (
          /** @type {"group"} */
          "group"
        ),
        heading: "Folder colours",
        items: [{
          name: "Folder and subfolder colours",
          desc: COLOURS_DESC,
          aliases: ["colour", "color", "swatch", "palette", "subfolder", "hidden by default", "archive"],
          /** @param {Setting} setting */
          render: (setting) => {
            this.renderColourSection(setting);
            return () => {
              if (this.scope) {
                this.scope.remove();
                this.scope = null;
              }
            };
          }
        }]
      }
    ];
  }
  /** @param {string} key */
  getControlValue(key) {
    return this.plugin.settings[
      /** @type {keyof Settings} */
      key
    ];
  }
  /** @param {string} key @param {unknown} value */
  async setControlValue(key, value) {
    const build = BUILD_SETTINGS.find((s) => s.key === key);
    const view = VIEW_SETTINGS.find((s) => s.key === key);
    if (!build && !view) return;
    this.plugin.settings[
      /** @type {"ghosts" | "templates" | "flatMonths" | "words" | ViewSetting["key"]} */
      key
    ] = !!value;
    await this.plugin.saveSettings();
    if (build) {
      await this.plugin.rebuildViews();
      return;
    }
    if (view) await this.applyView(view, !!value);
  }
  /** @param {ViewSetting} def */
  viewValue(def) {
    const v = this.plugin.settings[def.key];
    return def.defaultOn ? v !== false : v === true;
  }
  /** @param {ViewSetting} def @param {boolean} v */
  async applyView(def, v) {
    const view = await this.plugin.currentView();
    const api = view && view.handle && view.handle.api;
    if (api && api[def.api]) api[def.api](v);
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    for (const s of BUILD_SETTINGS) {
      new import_obsidian.Setting(containerEl).setName(s.name).setDesc(s.desc).addToggle((t) => t.setValue(!!this.plugin.settings[s.key]).onChange(async (v) => {
        this.plugin.settings[s.key] = v;
        await this.plugin.saveSettings();
        await this.plugin.rebuildViews();
      }));
    }
    new import_obsidian.Setting(containerEl).setName("View").setHeading();
    for (const s of VIEW_SETTINGS) {
      new import_obsidian.Setting(containerEl).setName(s.name).setDesc(s.desc).addToggle((t) => t.setValue(this.viewValue(s)).onChange(async (v) => {
        this.plugin.settings[s.key] = v;
        await this.plugin.saveSettings();
        await this.applyView(s, v);
      }));
    }
    new import_obsidian.Setting(containerEl).setName("Folder colours").setHeading();
    this.renderColourSection(new import_obsidian.Setting(containerEl).setDesc(COLOURS_DESC));
  }
  /**
   * The folder-colours section: the Reset-all button on `row`, then the swatch rows in a
   * palette-scoped wrapper INSIDE the row, which is told to wrap so the wrapper takes the
   * next line (styles.css, .vg-colour-row). Inside the row rather than after it, and this
   * was measured: Obsidian 1.13's declarative renderer replaces the group list's children
   * once the render callbacks have run, so a wrapper appended beside the row was created,
   * filled with 18 swatch rows and detached before the tab was shown. The row itself is
   * ours to fill in both paths -- display() hands over a row it just made, the render item
   * the row Obsidian made for the definition.
   * @param {Setting} row
   */
  renderColourSection(row) {
    row.addButton((b) => b.setButtonText("Reset all").setTooltip("Also drops every subfolder override").onClick(async () => {
      this.plugin.settings.folderColors = {};
      this.plugin.settings.subfolderColors = {};
      await this.plugin.saveSettings();
      await this.plugin.applyFolderColors();
      await this.plugin.applySubfolderColors();
      this.redrawColours();
    }));
    row.settingEl.addClass("vg-colour-row");
    const scope = row.settingEl.createDiv({ cls: ["vault-graph", "vg-tokens"] });
    scope.setAttribute(
      "data-theme",
      activeDocument.body.classList.contains("theme-light") ? "light" : "dark"
    );
    this.scope = scope;
    this.redrawColours();
  }
  redrawColours() {
    if (!this.scope) return;
    let auto = 0;
    this.renderColours(topFolders(this.app).map((f) => {
      const s = isArchiveGroup(f.name) ? ARCHIVE_SLOT : "g" + (auto++ % SLOT_NAMES.length + 1);
      return { name: f.name, n: f.n, slot: s, autoSlot: s };
    }));
    this.refreshFromView();
  }
  async refreshFromView() {
    const scope = this.scope;
    const view = await this.plugin.currentView();
    const api = view && view.handle && view.handle.api;
    if (!api || !api.groupOrder || !api.palette || !scope || !scope.isConnected) return;
    const groups = api.groupOrder().map((name) => ({
      name,
      n: api.groupCount(name),
      slot: api.slotOf ? api.slotOf(name) : "",
      autoSlot: api.autoSlotOf ? api.autoSlotOf(name) : ""
    }));
    if (groups.length) this.renderColours(groups);
  }
  /** @param {GroupRow[]} groups */
  renderColours(groups) {
    const scope = this.scope;
    scope.empty();
    if (!groups.length) {
      scope.createEl("p", { text: "No folders to colour yet." });
      return;
    }
    const subsByFolder = allSubfolders(this.app, this.plugin.settings.flatMonths);
    for (const group of groups) {
      const pinned = this.plugin.settings.folderColors[group.name] || "";
      const current = pinned || group.slot;
      const shown = this.shownByDefault(group.name);
      const subs = subsByFolder.get(group.name) || [];
      const hasPin = subs.some((s) => this.plugin.settings.subfolderColors[group.name + "/" + s.name]);
      const hasSubs = subs.length > 1 || hasPin;
      const open = hasSubs && !!this.subOpen[group.name];
      const row = new import_obsidian.Setting(scope).setName(group.name).setDesc((group.n === 1 ? "1 note" : group.n + " notes") + (shown ? "" : " \xB7 hidden by default"));
      if (hasSubs) {
        row.addExtraButton((b) => b.setIcon(open ? "chevron-down" : "chevron-right").setTooltip(open ? "Hide subfolder colours" : "Subfolder colours").onClick(() => {
          this.subOpen[group.name] = !open;
          this.renderColours(groups);
        }));
      }
      row.addExtraButton((b) => b.setIcon(shown ? "eye" : "eye-off").setTooltip(shown ? "Shown by default" : "Hidden by default").onClick(() => this.pickVisible(group.name)));
      row.controlEl.addClass("sws");
      SLOT_NAMES.forEach((name, i) => {
        const key = "g" + (i + 1);
        const on = current === key;
        const isAuto = group.autoSlot === key;
        const attr = {
          role: "radio",
          "aria-checked": String(on),
          "aria-label": name,
          title: name + (on ? pinned ? " (chosen)" : " (automatic)" : isAuto ? " (automatic default)" : "")
        };
        if (isAuto) attr["data-auto"] = "1";
        const b = row.controlEl.createEl("button", { cls: ["swatch", "vg-" + key], attr });
        b.addEventListener("click", () => this.pick(group.name, key));
      });
      const auto = row.controlEl.createEl("button", {
        cls: "auto",
        text: "Auto",
        attr: {
          "aria-pressed": String(!pinned),
          title: "Back to the slot this folder gets automatically"
        }
      });
      auto.addEventListener("click", () => this.pick(group.name, null));
      if (open) this.renderSubRows(scope, group.name, subs);
    }
  }
  /**
   * @param {HTMLElement} scope
   * @param {string} folder
   * @param {SubRow[]} subs
   */
  renderSubRows(scope, folder, subs) {
    for (const s of subs) {
      const pk = folder + "/" + s.name;
      const pinned = this.plugin.settings.subfolderColors[pk] || "";
      const row = new import_obsidian.Setting(scope).setName(s.name || "(directly in folder)").setDesc(s.n === 1 ? "1 note" : s.n + " notes");
      row.settingEl.addClass("vg-subrow");
      row.controlEl.addClass("sws");
      SLOT_NAMES.forEach((name, i) => {
        const key = "g" + (i + 1);
        const on = pinned === key;
        const b = row.controlEl.createEl("button", {
          cls: ["swatch", "vg-" + key],
          attr: {
            role: "radio",
            "aria-checked": String(on),
            "aria-label": name,
            title: name + (on ? " (chosen)" : "")
          }
        });
        b.addEventListener("click", () => this.pickSub(folder, s.name, key));
      });
      const auto = row.controlEl.createEl("button", {
        cls: "auto",
        text: "Auto",
        attr: { "aria-pressed": String(!pinned), title: "Back to the automatic tint" }
      });
      auto.addEventListener("click", () => this.pickSub(folder, s.name, null));
    }
  }
  /** @param {string} folder */
  shownByDefault(folder) {
    const saved = this.plugin.settings.folderShown[folder];
    if (typeof saved === "boolean") return saved;
    return !isArchiveGroup(folder);
  }
  /** @param {string} folder */
  async pickVisible(folder) {
    const map = Object.assign({}, this.plugin.settings.folderShown);
    map[folder] = !this.shownByDefault(folder);
    this.plugin.settings.folderShown = map;
    await this.plugin.saveSettings();
    await this.plugin.applyHiddenDefaults();
    this.redrawColours();
  }
  /**
   * @param {"folderColors" | "subfolderColors"} settingsKey
   * @param {string} mapKey
   * @param {string | null} key
   * @param {"applyFolderColors" | "applySubfolderColors"} applyMethod
   */
  async setOverride(settingsKey, mapKey, key, applyMethod) {
    const map = Object.assign({}, this.plugin.settings[settingsKey]);
    if (key) map[mapKey] = key;
    else delete map[mapKey];
    this.plugin.settings[settingsKey] = map;
    await this.plugin.saveSettings();
    await this.plugin[applyMethod]();
    this.redrawColours();
  }
  /** @param {string} folder @param {string | null} key */
  async pick(folder, key) {
    return this.setOverride("folderColors", folder, key, "applyFolderColors");
  }
  /** @param {string} folder @param {string} sub @param {string | null} key */
  async pickSub(folder, sub, key) {
    return this.setOverride("subfolderColors", folder + "/" + sub, key, "applySubfolderColors");
  }
};
var VaultGraphPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    /** @type {Settings} */
    __publicField(this, "settings", DEFAULTS);
  }
  async onload() {
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULTS, saved);
    this.addSettingTab(new VaultGraphSettingTab(this.app, this));
    this.registerView(VIEW_TYPE, (leaf) => new VaultGraphView(leaf, this));
    (0, import_obsidian.addIcon)(ICON_ID, discIcon());
    this.addRibbonIcon(ICON_ID, "Vault graph", () => this.activate());
    this.addCommand({
      id: "open",
      name: "Open the graph",
      callback: () => this.activate()
    });
    this.addCommand({
      id: "rebuild",
      name: "Rebuild from the metadata cache",
      callback: async () => {
        const view = await this.currentView();
        if (!view) {
          new import_obsidian.Notice("Open the graph first.");
          return;
        }
        await view.render();
      }
    });
    this.addCommand({
      id: "report",
      name: "Report diagnostics",
      callback: async () => {
        const view = await this.currentView();
        if (!view) {
          new import_obsidian.Notice("Open the graph first.");
          return;
        }
        const api = view.handle && view.handle.api;
        const report = {
          mount: "in-dom",
          mountMs: view.mountMs,
          hasApi: !!api,
          order: api && api.graph ? api.graph.order : 0,
          size: api && api.graph ? api.graph.size : 0,
          canvases: view.contentEl.querySelectorAll("#vg-graph canvas").length,
          planParity: api && api.checkPlanParity ? api.checkPlanParity() : null,
          build: view.lastData && view.lastData._spike,
          stats: view.lastData && view.lastData.stats
        };
        window.__vgSpikeReport = report;
        new import_obsidian.Notice("Diagnostics ready.");
        return report;
      }
    });
  }
  async currentView() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      await leaf.loadIfDeferred();
      if (leaf.view instanceof VaultGraphView) return leaf.view;
    }
    return null;
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  openSettings() {
    const setting = (
      /** @type {AppWithSetting} */
      this.app.setting
    );
    if (!setting || typeof setting.open !== "function") {
      new import_obsidian.Notice("Open the plugin's settings tab from the community plugins list.");
      return;
    }
    setting.open();
    if (typeof setting.openTabById === "function") setting.openTabById(this.manifest.id);
  }
  async applyFolderColors() {
    const view = await this.currentView();
    const api = view && view.handle && view.handle.api;
    if (api && api.setFolderColors) api.setFolderColors(this.settings.folderColors);
  }
  async applySubfolderColors() {
    const view = await this.currentView();
    const api = view && view.handle && view.handle.api;
    if (api && api.setSubfolderColors) api.setSubfolderColors(this.settings.subfolderColors);
  }
  async applyHiddenDefaults() {
    const view = await this.currentView();
    const api = view && view.handle && view.handle.api;
    if (!api || !api.setFolderShown) return;
    api.setFolderShown(this.settings.folderShown);
    if (api.setPanEnabled) api.setPanEnabled(this.settings.panEnabled !== false);
    if (api.setCompactAxis) api.setCompactAxis(this.settings.compactAxis !== false);
    if (api.setUnlinkedByFolder) api.setUnlinkedByFolder(this.settings.unlinkedByFolder !== false);
    if (api.setUnlinkedTintByFolder) api.setUnlinkedTintByFolder(this.settings.unlinkedTintByFolder === true);
    if (api.setFitCap) api.setFitCap(this.settings.fitCap !== false);
    if (api.applyHiddenDefaults) api.applyHiddenDefaults();
  }
  async rebuildViews() {
    const view = await this.currentView();
    if (view) await view.render();
  }
  async activate() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length) {
      await this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }
};
var main_default = VaultGraphPlugin;

/* nosourcemap */