/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselTravelParser from './parsers/carousel-travel.js';
import cardsToursParser from './parsers/cards-tours.js';
import cardsMediaParser from './parsers/cards-media.js';
import embedHotspotParser from './parsers/embed-hotspot.js';
import videoDmParser from './parsers/video-dm.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trvl-cleanup.js';
import dmImagesTransformer from './transformers/wknd-trvl-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'carousel-travel': carouselTravelParser,
  'cards-tours': cardsToursParser,
  'cards-media': cardsMediaParser,
  'embed-hotspot': embedHotspotParser,
  'video-dm': videoDmParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'travel-home',
  description: 'WKND travel and hospitality homepage with hero banner, destinations, and promotional sections',
  urls: [
    'https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/travel-hospitality/wknd-trvl-home',
  ],
  blocks: [
    { name: 'carousel-travel', instances: ['.carousel.summit-carousel.block'] },
    { name: 'cards-tours', instances: ['.cards.tours.block'] },
    { name: 'embed-hotspot', instances: ['.hotspot.block'] },
    { name: 'video-dm', instances: ['.embed.dm-videoplayer.block'] },
    { name: 'cards-media', instances: ['.cards.block:not(.tours)'] },
    { name: 'section-highlight', instances: ['.section.highlight'], section: 'highlight' },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip section-* entries)
    pageBlocks.forEach((block) => {
      if (block.name.startsWith('section-')) return;
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

    // 4. afterTransform cleanup (includes DM/Scene7 image -> anchor rewrites)
    executeTransformers('afterTransform', main, payload);

    // 5. Built-in WebImporter rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
