/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-travel
 * Base block: carousel
 * Source: https://aem-dynamicmedia-demo--dm--hlxsites.aem.page/travel-hospitality/wknd-trvl-home
 * Generated: 2026-04-29
 *
 * Extracts carousel slides (image + optional text content) from source HTML
 * and produces a 2-column table: [image, text/content] per slide row.
 */
export default function parse(element, { document }) {
  // Extract all carousel slides
  const slides = element.querySelectorAll('li.carousel-slide, .carousel-slides > li');

  const cells = [];

  slides.forEach((slide) => {
    // Extract image from slide - mandatory
    const picture = slide.querySelector('.carousel-slide-image picture, picture');
    const img = slide.querySelector('.carousel-slide-image img, img');

    // Extract optional text content from slide
    const contentContainer = slide.querySelector('.carousel-slide-content');
    const contentElements = [];

    if (contentContainer) {
      // Gather headings, paragraphs, and links from content area
      const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = contentContainer.querySelectorAll('p');
      const links = contentContainer.querySelectorAll('a');

      headings.forEach((h) => contentElements.push(h));
      paragraphs.forEach((p) => contentElements.push(p));
      links.forEach((a) => {
        // Avoid duplicating links already inside headings or paragraphs
        if (!a.closest('h1, h2, h3, h4, h5, h6, p')) {
          contentElements.push(a);
        }
      });
    }

    // Build the row: [image cell, content cell]
    const imageCell = picture || img || '';
    const contentCell = contentElements.length > 0 ? contentElements : '';

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-travel', cells });
  element.replaceWith(block);
}
