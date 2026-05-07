/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-travel-home.js
  var import_travel_home_exports = {};
  __export(import_travel_home_exports, {
    default: () => import_travel_home_default
  });

  // tools/importer/parsers/carousel-travel.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll("li.carousel-slide, .carousel-slides > li");
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector(".carousel-slide-image picture, picture");
      const img = slide.querySelector(".carousel-slide-image img, img");
      const contentContainer = slide.querySelector(".carousel-slide-content");
      const contentElements = [];
      if (contentContainer) {
        const headings = contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const paragraphs = contentContainer.querySelectorAll("p");
        const links = contentContainer.querySelectorAll("a");
        headings.forEach((h) => contentElements.push(h));
        paragraphs.forEach((p) => contentElements.push(p));
        links.forEach((a) => {
          if (!a.closest("h1, h2, h3, h4, h5, h6, p")) {
            contentElements.push(a);
          }
        });
      }
      const imageCell = picture || img || "";
      const contentCell = contentElements.length > 0 ? contentElements : "";
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-travel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tours.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(":scope ul > li, :scope > ul > li");
    const cells = [];
    cardItems.forEach((card) => {
      const image = card.querySelector(".cards-card-dynamic-image img, img");
      const body = card.querySelector(".cards-card-body");
      const contentCell = [];
      if (body) {
        const paragraphs = body.querySelectorAll(":scope > p");
        paragraphs.forEach((p) => {
          contentCell.push(p);
        });
      }
      const imageCell = image || "";
      cells.push([imageCell, contentCell.length > 0 ? contentCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tours", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-media.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(":scope ul > li");
    const cells = [];
    cardItems.forEach((item) => {
      const imageContainer = item.querySelector(".cards-card-image");
      const image = imageContainer ? imageContainer.querySelector("picture, img") : null;
      const body = item.querySelector(".cards-card-body");
      const imageCell = image || "";
      const captionCell = body ? body.textContent.trim() : "";
      cells.push([imageCell, captionCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-hotspot.js
  function parse4(element, { document }) {
    const cells = [];
    const firstRow = element.querySelector(":scope > div:first-child");
    const primaryImage = firstRow ? firstRow.querySelector("picture, img") : null;
    if (primaryImage) {
      const picture = firstRow.querySelector("picture");
      cells.push([picture || primaryImage]);
    }
    const hotspotDivs = element.querySelectorAll(":scope > div.hotspot");
    hotspotDivs.forEach((hotspotDiv) => {
      const iframe = hotspotDiv.querySelector("iframe");
      if (iframe && iframe.src) {
        const link = document.createElement("a");
        link.href = iframe.src;
        link.textContent = iframe.src;
        cells.push([link]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-hotspot", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-dm.js
  function parse5(element, { document }) {
    const PLACEHOLDER_VIDEO_URL = "https://delivery-p166604-e1781313.adobeaemcloud.com/adobe/assets/urn:avid:aem:travel-hospitality-wknd-trvl-home-video.mp4/play";
    const videoEl = element.querySelector("video source[src], video[src]");
    const linkEl = element.querySelector('a[href*=".mp4"], a[href*="/play"]');
    const iframeEl = element.querySelector("iframe[src]");
    let videoUrl = null;
    if (videoEl) {
      videoUrl = videoEl.getAttribute("src");
    } else if (linkEl) {
      videoUrl = linkEl.getAttribute("href");
    } else if (iframeEl) {
      videoUrl = iframeEl.getAttribute("src");
    }
    if (!videoUrl) {
      videoUrl = PLACEHOLDER_VIDEO_URL;
    }
    const videoLink = document.createElement("a");
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    const cells = [[videoLink]];
    const block = WebImporter.Blocks.createBlock(document, { name: "video-dm", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trvl-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".carousel-navigation-buttons"]);
      const indicatorNav = element.querySelector("nav:has(.carousel-slide-indicators)");
      if (indicatorNav) indicatorNav.remove();
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.header-wrapper"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer-wrapper"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/wknd-trvl-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.hostname.endsWith(".scene7.com") && u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  function isImgSoleChild(a, img) {
    return a.children.length === 1 && a.children[0] === img && a.textContent.trim() === (img.getAttribute("alt") || "").trim();
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        if (isImgSoleChild(parent, img)) {
          parent.setAttribute("title", src);
          parent.textContent = altToLinkText(alt);
          return;
        }
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-travel-home.js
  var parsers = {
    "carousel-travel": parse,
    "cards-tours": parse2,
    "cards-media": parse3,
    "embed-hotspot": parse4,
    "video-dm": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "travel-home",
    description: "WKND travel and hospitality homepage with hero banner, destinations, and promotional sections",
    urls: [
      "https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/travel-hospitality/wknd-trvl-home"
    ],
    blocks: [
      { name: "carousel-travel", instances: [".carousel.summit-carousel.block"] },
      { name: "cards-tours", instances: [".cards.tours.block"] },
      { name: "embed-hotspot", instances: [".hotspot.block"] },
      { name: "video-dm", instances: [".embed.dm-videoplayer.block"] },
      { name: "cards-media", instances: [".cards.block:not(.tours)"] },
      { name: "section-highlight", instances: [".section.highlight"], section: "highlight" }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_travel_home_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (block.name.startsWith("section-")) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_travel_home_exports);
})();
