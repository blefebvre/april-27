/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-hotspot variant.
 * Base block: embed
 * Source selector: .hotspot.block
 * Generated: 2026-04-29
 *
 * Structure:
 *   Row 1: primary image
 *   Rows 2..N: link to a Dynamic Media video/asset URL (from iframe src)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Extract primary image from the first child div
  const firstRow = element.querySelector(':scope > div:first-child');
  const primaryImage = firstRow ? firstRow.querySelector('picture, img') : null;

  if (primaryImage) {
    // Prefer the <picture> element if available, otherwise use <img>
    const picture = firstRow.querySelector('picture');
    cells.push([picture || primaryImage]);
  }

  // Rows 2..N: Extract video/asset links from hotspot divs
  const hotspotDivs = element.querySelectorAll(':scope > div.hotspot');
  hotspotDivs.forEach((hotspotDiv) => {
    const iframe = hotspotDiv.querySelector('iframe');
    if (iframe && iframe.src) {
      // Create a link element pointing to the iframe src URL
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      cells.push([link]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-hotspot', cells });
  element.replaceWith(block);
}
