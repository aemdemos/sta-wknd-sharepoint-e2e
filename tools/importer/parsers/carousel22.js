/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const slideEls = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Build table rows
  const rows = [];
  // Table header matches example
  rows.push(['Carousel (carousel22)']);

  slideEls.forEach((slide) => {
    // Image: always in .cmp-teaser__image, select the <img> element
    let imgEl = null;
    const imgWrapper = slide.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Text cell: includes title (h2), description, and CTA, all directly from DOM
    const cellContent = [];
    const contentContainer = slide.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Title (h2)
      const title = contentContainer.querySelector('.cmp-teaser__title');
      if (title) {
        cellContent.push(title); // reference existing h2
      }
      // Description
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) {
        if (desc.children.length > 0) {
          // If there are child elements (like <p>), reference them
          Array.from(desc.children).forEach((child) => {
            cellContent.push(child); // reference, do not clone
          });
        } else {
          cellContent.push(desc); // reference existing div/element
        }
      }
      // CTA
      const actionLink = contentContainer.querySelector('.cmp-teaser__action-link');
      if (actionLink) {
        cellContent.push(actionLink); // reference existing link
      }
    }

    // Compose row: [image, text]
    rows.push([
      imgEl || '',
      cellContent.length > 0 ? cellContent : ''
    ]);
  });

  // Create the block table matching the required structure
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
