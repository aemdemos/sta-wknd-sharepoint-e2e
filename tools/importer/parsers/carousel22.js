/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must EXACTLY match the example
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const items = carousel.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // First cell: the image (img element inside the cmp-teaser__image)
    let imgEl = null;
    const teaserImage = item.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      // Reference the existing image element from the DOM
      imgEl = teaserImage;
    }
    // Second cell: the text content block
    // We want to reference existing elements, not clone unless needed for structure
    const cell2Content = [];
    // Title
    const titleEl = item.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use existing h2 element if possible
      cell2Content.push(titleEl);
    }
    // Description
    const descEl = item.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If the description contains block elements (e.g., <p>), preserve them
      if (descEl.children.length > 0) {
        Array.from(descEl.children).forEach((child) => {
          cell2Content.push(child);
        });
      } else {
        cell2Content.push(descEl);
      }
    }
    // CTA
    const ctaEl = item.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      cell2Content.push(ctaEl);
    }

    // If there is no text content, leave cell empty string
    const cell2 = cell2Content.length > 0 ? cell2Content : '';

    rows.push([imgEl, cell2]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
