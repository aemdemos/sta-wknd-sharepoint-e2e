/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  const table = [];

  // Header row with exact block name from the example
  table.push(['Carousel (carousel9)']);

  slides.forEach((slide) => {
    // IMAGE CELL (left)
    let imageCell = '';
    const imageDiv = slide.querySelector('.cmp-image');
    if (imageDiv) imageCell = imageDiv;

    // TEXT CELL (right)
    // Try to get all content in the slide except the image
    let textCell = '';
    const textParts = [];
    // Check for extra textual blocks or overlays; in this minimal HTML, only the image is present.
    // But always check for any additional child elements after or before image
    Array.from(slide.children).forEach((child) => {
      // Only exclude the imageDiv (first image cmp-image found)
      if (!child.classList.contains('image') && !child.classList.contains('cmp-image')) {
        textParts.push(child);
      }
      // Special case: if child is the image wrapper but contains more than just the imageDiv
      if (child.classList.contains('image')) {
        // child may have extra elements besides the cmp-image (rare but possible)
        Array.from(child.children).forEach((sub) => {
          if (!sub.classList.contains('cmp-image')) {
            textParts.push(sub);
          }
        });
      }
    });

    // If no direct text content, fallback to use image's alt/title/metadata as a heading in cell (as example does)
    if (textParts.length === 0 && imageDiv) {
      let title = '';
      // Try from data-cmp-data-layer
      const dataLayer = imageDiv.getAttribute('data-cmp-data-layer');
      if (dataLayer) {
        try {
          const parsed = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
          const k = Object.keys(parsed)[0];
          if (parsed[k] && parsed[k]['dc:title']) {
            title = parsed[k]['dc:title'];
          }
        } catch (e) {}
      }
      // Fallback: use image alt/title
      if (!title) {
        const imgEl = imageDiv.querySelector('img');
        if (imgEl) {
          title = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';
        }
      }
      if (title) {
        const h2 = document.createElement('h2');
        const strong = document.createElement('strong');
        strong.textContent = title;
        h2.appendChild(strong);
        textParts.push(h2);
      }
    }

    // If there is text content, use all collected nodes (could be empty string)
    if (textParts.length > 0) {
      textCell = textParts.length === 1 ? textParts[0] : textParts;
    }

    table.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
