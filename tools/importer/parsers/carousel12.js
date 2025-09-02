/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Select all slide items inside the carousel
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Prepare table rows, start with block header
  const rows = [['Carousel (carousel12)']];

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    // Find the teaser image wrapper, then find the <img>
    let imgEl = null;
    const teaserImageWrapper = slide.querySelector('.cmp-teaser__image');
    if (teaserImageWrapper) {
      imgEl = teaserImageWrapper.querySelector('img');
    }
    // If there is no image, skip this slide for resilience
    if (!imgEl) return;

    // --- CONTENT CELL ---
    const contentCell = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Heading (keep as-is, preserve semantic level)
      const heading = teaserContent.querySelector('.cmp-teaser__title');
      if (heading) contentCell.push(heading);
      // Description (may be text or markup, keep as-is)
      const description = teaserContent.querySelector('.cmp-teaser__description');
      if (description) contentCell.push(description);
      // Call-to-action link (if present)
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) contentCell.push(cta);
    }
    // Push row: image in first cell, contentCell (array) in second
    rows.push([imgEl, contentCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
