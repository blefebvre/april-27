/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-tours
 * Base block: cards
 * Source: https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/travel-hospitality/wknd-trvl-home
 * Generated: 2026-04-29
 *
 * Extracts tour cards from .cards.tours.block structure.
 * Each card has a dynamic image, title, CTA button, and description.
 * Output: 2-column table rows (image | text content) per card.
 */
export default function parse(element, { document }) {
  // Extract all card items from the list
  const cardItems = element.querySelectorAll(':scope ul > li, :scope > ul > li');

  const cells = [];

  cardItems.forEach((card) => {
    // First cell: image
    const image = card.querySelector('.cards-card-dynamic-image img, img');

    // Second cell: text content (title, CTA, description)
    const body = card.querySelector('.cards-card-body');
    const contentCell = [];

    if (body) {
      // Get all paragraphs in the body
      const paragraphs = body.querySelectorAll(':scope > p');

      paragraphs.forEach((p) => {
        contentCell.push(p);
      });
    }

    // Build the row: [image, textContent]
    const imageCell = image || '';
    cells.push([imageCell, contentCell.length > 0 ? contentCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tours', cells });
  element.replaceWith(block);
}
