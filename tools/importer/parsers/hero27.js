/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name EXACTLY as in the spec
  const headerRow = ['Hero (hero27)'];

  // 2. Image row: include the main image element if present
  let imageRowContent = '';
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    // Use the img inside the cmp-teaser__image
    const img = imageDiv.querySelector('img');
    if (img) imageRowContent = img;
  }
  const imageRow = [imageRowContent];

  // 3. Content row: gather ALL title, description, and CTA elements present
  const contentArr = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (as heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Description (as is)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
    // CTA (as is)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentArr.push(cta);
  }
  const contentRow = [contentArr];

  // 4. Compose table: only ONE table, 1 column, 3 rows.
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
