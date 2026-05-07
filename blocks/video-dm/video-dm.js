/*
 * Video DM Block
 * Renders a video from a link (supports Dynamic Media mp4 and /play endpoints).
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  const ext = source.split('?')[0].split('.').pop();
  sourceEl.setAttribute('type', `video/${ext || 'mp4'}`);
  video.append(sourceEl);

  return video;
}

function getIframe(src) {
  const wrap = document.createElement('div');
  wrap.className = 'video-dm-iframe';
  wrap.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video"></iframe>`;
  return wrap;
}

const loadVideoEmbed = (block, link, autoplay, background) => {
  if (block.dataset.embedLoaded === 'true') {
    return;
  }

  const isDmPlay = /\/play(?:$|\?)/.test(link) || link.includes('adobeaemcloud.com');
  if (isDmPlay) {
    const iframe = getIframe(link);
    block.append(iframe);
    block.dataset.embedLoaded = 'true';
    return;
  }

  const videoEl = getVideoElement(link, autoplay, background);
  block.append(videoEl);
  videoEl.addEventListener('canplay', () => {
    block.dataset.embedLoaded = 'true';
  });
};

export default async function decorate(block) {
  const placeholder = block.querySelector('picture');
  const linkEl = block.querySelector('a');
  if (!linkEl) return;
  const link = linkEl.href;
  block.textContent = '';
  block.dataset.embedLoaded = 'false';

  const autoplay = block.classList.contains('autoplay');
  if (placeholder) {
    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-dm-placeholder';
    wrapper.append(placeholder);

    if (!autoplay) {
      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-dm-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        wrapper.remove();
        loadVideoEmbed(block, link, true, false);
      });
    }
    block.append(wrapper);
  }

  if (!placeholder || autoplay) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = autoplay && !prefersReducedMotion.matches;
        loadVideoEmbed(block, link, playOnLoad, autoplay);
      }
    });
    observer.observe(block);
  }
}
