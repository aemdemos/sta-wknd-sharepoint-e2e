/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel22) block parser

  // Always use the block name as header
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Defensive: locate the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    // If not found, do nothing
    return;
  }

  // Each slide is a .cmp-carousel__item
  const slideEls = carouselContent.querySelectorAll('.cmp-carousel__item');

  slideEls.forEach((slide) => {
    // Find the teaser block inside each slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image: find the first img inside teaser
    let imageEl = teaser.querySelector('.cmp-teaser__image img');
    // Defensive fallback: if not found, try any img
    if (!imageEl) imageEl = teaser.querySelector('img');

    // Text content cell
    const textContent = [];
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) textContent.push(titleEl);
    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) textContent.push(descEl);
    // CTA link
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) textContent.push(ctaEl);

    // Build row: [image, text content]
    rows.push([
      imageEl ? imageEl : '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
