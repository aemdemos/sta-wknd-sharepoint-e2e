/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header
  const headerRow = ['Video (video15)'];

  // Defensive: find the main carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Try to find a video source: <video> tag, <iframe>, or <a> to video/streaming URL
  let videoSrc = null;
  let videoTag = carousel.querySelector('video');
  if (videoTag && videoTag.src) {
    videoSrc = videoTag.src;
  }
  if (!videoSrc) {
    let iframe = carousel.querySelector('iframe[src]');
    if (iframe) {
      videoSrc = iframe.src;
    }
  }
  if (!videoSrc) {
    let videoLink = carousel.querySelector('a[href$=".mp4"], a[href$=".webm"], a[href*="youtube.com"], a[href*="vimeo.com"]');
    if (videoLink) {
      videoSrc = videoLink.href;
    }
  }

  // Always output the table, even if there is no video source
  // Try to find the poster image inside the active slide
  const content = carousel.querySelector('.cmp-carousel__content');
  let imageEl = null;
  if (content) {
    const activeItem = content.querySelector('.cmp-carousel__item--active') || content.querySelector('.cmp-carousel__item');
    if (activeItem) {
      imageEl = activeItem.querySelector('img');
    }
  }
  if (!imageEl) {
    imageEl = carousel.querySelector('img');
  }

  // Collect all visible text content from the carousel (e.g., slide titles)
  let textContent = '';
  const indicators = carousel.querySelectorAll('.cmp-carousel__indicator');
  if (indicators && indicators.length) {
    textContent = Array.from(indicators).map(li => li.textContent.trim()).filter(Boolean).join(' / ');
  }
  if (!textContent && content) {
    const activeItem = content.querySelector('.cmp-carousel__item--active') || content.querySelector('.cmp-carousel__item');
    if (activeItem && activeItem.getAttribute('aria-label')) {
      textContent = activeItem.getAttribute('aria-label');
    }
  }

  // Compose the cell content: video source (as link if present), image, and all text content
  const cellContent = [];
  if (videoSrc) {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    cellContent.push(a);
  }
  if (imageEl) {
    cellContent.push(imageEl.cloneNode(true));
  }
  if (textContent) {
    cellContent.push(document.createTextNode(textContent));
  }
  if (!videoSrc && cellContent.length === 0) {
    cellContent.push(document.createTextNode('No video or image found'));
  }

  const rows = [headerRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
