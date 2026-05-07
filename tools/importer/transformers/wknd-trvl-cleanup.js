/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Travel cleanup.
 * Removes non-authorable site chrome (header, footer, carousel UI controls).
 * Selectors verified in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove carousel navigation buttons that block clean parsing
    // Found in cleaned.html: <div class="carousel-navigation-buttons">
    WebImporter.DOMUtils.remove(element, ['.carousel-navigation-buttons']);

    // Remove carousel slide indicators nav
    // Found in cleaned.html: <nav><ol class="carousel-slide-indicators">
    const indicatorNav = element.querySelector('nav:has(.carousel-slide-indicators)');
    if (indicatorNav) indicatorNav.remove();
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Found in cleaned.html: <header class="header-wrapper">
    WebImporter.DOMUtils.remove(element, ['header.header-wrapper']);

    // Found in cleaned.html: <footer class="footer-wrapper">
    WebImporter.DOMUtils.remove(element, ['footer.footer-wrapper']);

    // Remove any remaining noscript, link elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
