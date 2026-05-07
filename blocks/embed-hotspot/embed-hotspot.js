/*
 * Embed Hotspot Block
 * Shows a primary image with interactive hotspot links that open Dynamic Media
 * videos in a modal overlay when clicked. Content model:
 *   Row 1: main image (picture)
 *   Row 2+: link (to mp4 or DM asset URL) - becomes a hotspot
 */

function createModal(src) {
  const overlay = document.createElement('div');
  overlay.className = 'embed-hotspot-modal';
  overlay.innerHTML = `
    <button type="button" class="embed-hotspot-close" aria-label="Close">×</button>
    <div class="embed-hotspot-modal-inner">
      <iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('embed-hotspot-close')) {
      overlay.remove();
    }
  });
  document.body.append(overlay);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row: main image
  const imageRow = rows.shift();
  const picture = imageRow.querySelector('picture, img');
  const imageWrap = document.createElement('div');
  imageWrap.className = 'embed-hotspot-image';
  if (picture) {
    const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
    if (img) {
      const p = document.createElement('picture');
      p.append(img);
      imageWrap.append(p);
    } else {
      imageWrap.append(picture);
    }
  }

  // Remaining rows: hotspot links
  const hotspotsWrap = document.createElement('div');
  hotspotsWrap.className = 'embed-hotspot-points';
  rows.forEach((row, idx) => {
    const link = row.querySelector('a');
    if (!link) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'embed-hotspot-point';
    btn.setAttribute('aria-label', link.title || link.textContent || `Hotspot ${idx + 1}`);
    btn.dataset.videoSrc = link.href;
    btn.textContent = (idx + 1).toString();
    // Position hotspots in a loose ring around the center as a default layout
    const angle = (idx / Math.max(rows.length, 1)) * 2 * Math.PI;
    const radius = 30; // percent
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    btn.style.left = `${x}%`;
    btn.style.top = `${y}%`;
    btn.addEventListener('click', () => createModal(btn.dataset.videoSrc));
    hotspotsWrap.append(btn);
  });

  block.textContent = '';
  const container = document.createElement('div');
  container.className = 'embed-hotspot-container';
  container.append(imageWrap, hotspotsWrap);
  block.append(container);
}
