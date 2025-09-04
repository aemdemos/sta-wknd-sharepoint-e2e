/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides (carousel items)
  const slides = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header row
  const headerRow = ['Carousel (carousel6)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find image element (first cell)
    let imgEl = null;
    const teaserImageContainer = slide.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      // Find the actual <img> inside
      imgEl = teaserImageContainer.querySelector('img');
    }
    // Defensive: If no image found, skip this slide
    if (!imgEl) return;

    // Second cell: text content (title, description, CTA)
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    const cellContent = [];
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) cellContent.push(titleEl);
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) cellContent.push(descEl);
      // CTA link
      const ctaEl = teaserContent.querySelector('.cmp-teaser__action-link');
      if (ctaEl) cellContent.push(ctaEl);
    }
    // If no text content, use empty string
    const secondCell = cellContent.length ? cellContent : '';

    rows.push([imgEl, secondCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
