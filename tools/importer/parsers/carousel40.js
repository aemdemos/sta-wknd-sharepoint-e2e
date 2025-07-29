/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (1 element array)
  const headerRow = ['Carousel (carousel40)'];

  // Slide (image and text columns)
  let imgCell = '';
  const img = element.querySelector('.cmp-teaser__image img');
  if (img) {
    imgCell = img;
  }

  let textCell = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCell.push(pretitle);
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textCell.push(title);
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textCell.push(desc);
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) textCell.push(cta);
  }
  if (textCell.length === 0) textCell = '';
  if (!imgCell) return;
  // The cells array: first row is the one-cell header, second row is the two-cell slide
  const cells = [headerRow, [imgCell, textCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
