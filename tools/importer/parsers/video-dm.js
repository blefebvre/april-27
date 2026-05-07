/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-dm
 * Base block: embed (Dynamic Media video player)
 * Source selector: .embed.dm-videoplayer.block
 * Generated: 2026-04-29
 *
 * The source HTML is an empty div — the video URL is loaded at runtime via
 * Dynamic Media scripts. This parser attempts to extract any video URL or
 * link that may have been injected into the DOM. If none is found, it outputs
 * a placeholder Dynamic Media /play URL that authors can replace later.
 */
export default function parse(element, { document }) {
  const PLACEHOLDER_VIDEO_URL =
    'https://delivery-p166604-e1781313.adobeaemcloud.com/adobe/assets/urn:avid:aem:travel-hospitality-wknd-trvl-home-video.mp4/play';

  // Attempt to find a video source within the element
  const videoEl = element.querySelector('video source[src], video[src]');
  const linkEl = element.querySelector('a[href*=".mp4"], a[href*="/play"]');
  const iframeEl = element.querySelector('iframe[src]');

  let videoUrl = null;

  if (videoEl) {
    videoUrl = videoEl.getAttribute('src');
  } else if (linkEl) {
    videoUrl = linkEl.getAttribute('href');
  } else if (iframeEl) {
    videoUrl = iframeEl.getAttribute('src');
  }

  // Fall back to placeholder if no video URL found in static HTML
  if (!videoUrl) {
    videoUrl = PLACEHOLDER_VIDEO_URL;
  }

  // Create the video link element
  const videoLink = document.createElement('a');
  videoLink.href = videoUrl;
  videoLink.textContent = videoUrl;

  // Build cells: single row with the video link
  const cells = [[videoLink]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-dm', cells });
  element.replaceWith(block);
}
