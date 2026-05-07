/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-media variant.
 * Base block: cards
 * Source: https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/travel-hospitality/wknd-trvl-home
 * Generated: 2026-04-29
 *
 * Extracts card items (image + caption) from a .cards.block element
 * and produces a Cards (media) block table with one row per card.
 * Each row has two cells: [image, caption].
 */
export default function parse(element, { document }) {
  // Select all card list items within the cards block
  const cardItems = element.querySelectorAll(':scope ul > li');

  const cells = [];

  cardItems.forEach((item) => {
    // Extract the image from the card-image container
    const imageContainer = item.querySelector('.cards-card-image');
    const image = imageContainer ? imageContainer.querySelector('picture, img') : null;

    // Extract the caption text from the card-body container
    const body = item.querySelector('.cards-card-body');

    // Build the row: [image cell, caption cell]
    const imageCell = image || '';
    const captionCell = body ? body.textContent.trim() : '';

    cells.push([imageCell, captionCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-media', cells });
  element.replaceWith(block);
}
