/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Carousel (carousel22)'];

  // Find the cmp-carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));
  if (slides.length === 0) return;

  // Prepare rows for each slide
  const rows = slides.map((slide) => {
    // Image: strictly first cell, only the <img> element
    let imageEl = null;
    const teaserImageContainer = slide.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      // Only use the first <img> child (do not clone)
      imageEl = teaserImageContainer.querySelector('img');
    }
    // Text content: title, description, cta
    // We'll build an array of elements to preserve block structure
    const content = [];
    // Title
    const titleEl = slide.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use h2 as in source (do not clone)
      content.push(titleEl);
    }
    // Description
    const descEl = slide.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If there are paragraphs, use them directly, else use the whole element
      const ps = Array.from(descEl.querySelectorAll('p'));
      if (ps.length > 0) {
        content.push(...ps);
      } else if (descEl.textContent.trim()) {
        content.push(descEl);
      }
    }
    // CTA
    const ctaContainer = slide.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // There may be one or more links; use all of them
      const links = Array.from(ctaContainer.querySelectorAll('a'));
      if (links.length > 0) {
        content.push(...links);
      }
    }
    return [imageEl, content.length > 0 ? content : ''];
  });

  // Build the final block table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
