/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Carousel (carousel27)'];

  // Find the teaser slide image
  let imageCell = '';
  const teaserImg = element.querySelector('.cmp-teaser__image img');
  if (teaserImg) {
    // Reference the actual image element
    imageCell = teaserImg;
  }

  // Find the text content
  let textCell = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title (preserve heading level from source if possible)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      textCell.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      textCell.push(desc);
    }
    // CTA
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCell.push(cta);
    }
  }
  if (textCell.length === 0) textCell = '';

  // Prepare the table rows: header, then slide row
  const rows = [
    headerRow,
    [imageCell, textCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
