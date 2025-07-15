/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, as per spec
  const headerRow = ['Carousel (carousel40)'];

  // Find elements
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Image cell: first <img> inside .cmp-teaser__image
  let imageCell = '';
  const imageDiv = teaser.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) imageCell = img;
  }

  // Text cell: gather all the text content (pretitle, title, description, cta)
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  const textCellContent = [];
  if (contentDiv) {
    Array.from(contentDiv.children).forEach((child) => {
      if (child.classList.contains('cmp-teaser__pretitle')) {
        textCellContent.push(child);
      } else if (child.classList.contains('cmp-teaser__title')) {
        textCellContent.push(child);
      } else if (child.classList.contains('cmp-teaser__description')) {
        textCellContent.push(child);
      } else if (child.classList.contains('cmp-teaser__action-container')) {
        const cta = child.querySelector('a');
        if (cta) textCellContent.push(cta);
      }
    });
  }

  // Compose table: header row is one cell; each slide row is two cells
  const cells = [];
  cells.push(headerRow); // single header cell!
  cells.push([imageCell, textCellContent]);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
