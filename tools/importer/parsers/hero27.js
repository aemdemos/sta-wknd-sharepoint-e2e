/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background image (Hero image)
  let img = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  }

  // 2. Extract content: Title, Description, CTA
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Title - use h1 for Hero block
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentParts.push(h1);
    }
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // wrap in <p> if not already a paragraph
      let para = desc;
      if (desc.tagName !== 'P') {
        para = document.createElement('p');
        para.innerHTML = desc.innerHTML;
      }
      contentParts.push(para);
    }
    // CTA
    const actionLink = contentDiv.querySelector('.cmp-teaser__action-link');
    if (actionLink) {
      contentParts.push(actionLink);
    }
  }

  // 3. Build hero table as per markdown example
  const tableRows = [
    ['Hero'], // EXACT header per example
    [img ? img : ''],
    [contentParts]
  ];

  // 4. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
