/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel content root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header as in the example
  const headerRow = ['Carousel (carousel23)'];
  const rows = [headerRow];

  items.forEach((item) => {
    let imageCell = '';
    let textCellContent = [];

    // Image (first cell)
    const imgContainer = item.querySelector('.cmp-teaser__image');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
      if (imgEl) {
        imageCell = imgEl;
      }
    }

    // Text content (second cell)
    const contentContainer = item.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Title (keep heading level and formatting)
      const h2 = contentContainer.querySelector('h2');
      if (h2) textCellContent.push(h2);
      // Description: May contain <div> or <p>
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);
      // CTA: .cmp-teaser__action-link
      const cta = contentContainer.querySelector('.cmp-teaser__action-link');
      if (cta) textCellContent.push(cta);
    }
    if (textCellContent.length === 0) textCellContent = [''];
    if (!imageCell) imageCell = '';
    rows.push([imageCell, textCellContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
