/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as required
  const headerRow = ['Carousel (carousel27)'];

  // Get the image for the first cell, referencing the existing <img>
  let imageEl = null;
  const imageWrap = element.querySelector('.cmp-teaser__image');
  if (imageWrap) {
    imageEl = imageWrap.querySelector('img');
  }

  // Prepare the text cell: title, description, CTA, if present
  const textCellContent = [];
  const contentWrap = element.querySelector('.cmp-teaser__content');
  if (contentWrap) {
    // Title (keep heading level as in source)
    const titleEl = contentWrap.querySelector('.cmp-teaser__title');
    if (titleEl) {
      textCellContent.push(titleEl);
    }
    // Description
    const descEl = contentWrap.querySelector('.cmp-teaser__description');
    if (descEl) {
      textCellContent.push(descEl);
    }
    // CTA
    const ctaContainer = contentWrap.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaEl = ctaContainer.querySelector('.cmp-teaser__action-link');
      if (ctaEl) {
        textCellContent.push(ctaEl);
      }
    }
  }

  // If image or text cell is missing, ensure structure is maintained, with empty slot
  const cells = [
    headerRow,
    [imageEl || '', textCellContent.length ? textCellContent : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
