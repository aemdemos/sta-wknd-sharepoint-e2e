/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content and image columns
  const contentCol = element.querySelector('.cmp-teaser__content');
  const imageCol = element.querySelector('.cmp-teaser__image img');

  // Compose left column: image (reference existing <img> element)
  let leftCell = '';
  if (imageCol) {
    leftCell = imageCol;
  }

  // Compose right column: all content in order, preserving semantic structure
  let rightCell = '';
  if (contentCol) {
    const contentEls = [];
    // pretitle
    const pretitle = contentCol.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentEls.push(pretitle);
    // title
    const title = contentCol.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // description
    const desc = contentCol.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA
    const cta = contentCol.querySelector('.cmp-teaser__action-link');
    if (cta) contentEls.push(cta);
    if (contentEls.length) {
      rightCell = contentEls;
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
