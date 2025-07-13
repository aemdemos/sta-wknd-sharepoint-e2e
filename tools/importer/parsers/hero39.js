/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW
  const headerRow = ['Hero (hero39)'];

  // 2. BACKGROUND IMAGE ROW
  // Find the .cmp-teaser__image containing img
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. CONTENT ROW
  // Find the .cmp-teaser__content (usually contains heading(s) and description)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentArr = [];
  if (contentDiv) {
    // Extract the title (usually exists)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Extract the description (optional)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
  }
  const contentRow = [contentArr.length ? contentArr : ''];

  // Compose the table rows (1 col, 3 rows as per example)
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the element in the DOM
  element.replaceWith(table);
}