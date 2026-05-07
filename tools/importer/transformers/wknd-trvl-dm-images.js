/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Travel DM/Scene7 images.
 * Converts Dynamic Media and Scene7 <img> tags into anchors so URLs
 * round-trip through markdown intact. The client-side auto-block in
 * scripts/scripts.js rebuilds responsive <picture> elements from these anchors.
 *
 * Detected in migration-work/cleaned.html:
 *   - delivery-p166604-e1781313.adobeaemcloud.com/adobe/assets/urn:avid:aem:*
 *   - techsupport.scene7.com/is/image/ajhcom/*
 *
 * Runs in afterTransform only - block parsers need <img> during their
 * extraction phase between beforeTransform and afterTransform.
 */

// ---- Begin canonical helpers (from dm-scene7-helpers.js) ----
function detectDynamicMediaUrl(urlStr) {
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch { return false; }
  if (u.hostname.endsWith('.scene7.com') && u.pathname.startsWith('/is/image/')) {
    return 'scene7';
  }
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
      && u.pathname.startsWith('/adobe/assets/urn:')) {
    return 'dm-openapi';
  }
  return false;
}

function isImgSoleChild(a, img) {
  return a.children.length === 1
      && a.children[0] === img
      && a.textContent.trim() === (img.getAttribute('alt') || '').trim();
}

const EMPTY_ALT_SENTINEL = 'Image without alt text';

function altToLinkText(alt) {
  return alt || EMPTY_ALT_SENTINEL;
}
// ---- End canonical helpers ----

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;

  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!detectDynamicMediaUrl(src)) return;

    const alt = img.getAttribute('alt') || '';
    const parent = img.parentElement;

    if (parent && parent.tagName === 'A') {
      // Linked image, sole child: stash DM URL in title, keep outer href.
      if (isImgSoleChild(parent, img)) {
        parent.setAttribute('title', src);
        parent.textContent = altToLinkText(alt);
        return;
      }
      // Mixed content inside a link: no clean representation. Skip.
      // eslint-disable-next-line no-console
      console.warn('DM image inside mixed-content anchor, skipped:', src);
      return;
    }

    // Unlinked image: create an anchor whose href is the DM URL.
    const a = doc.createElement('a');
    a.href = src;
    a.textContent = altToLinkText(alt);
    img.replaceWith(a);
  });
}
