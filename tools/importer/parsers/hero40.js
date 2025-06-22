/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image (background image for Hero)
  let imgEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Extract the content area: include all present content in order
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let contentParts = [];
  if (contentWrapper) {
    // Gather all meaningful immediate children (preserve order & structure)
    contentParts = Array.from(contentWrapper.children).filter(el => {
      // Exclude elements that are empty or whitespace only unless they have children
      if (el.textContent && el.textContent.trim().length > 0) return true;
      if (el.querySelector && el.querySelector('a')) return true;
      return false;
    });
  }

  // Construct the Hero block table: header row, image row, content row
  const cells = [
    ['Hero'],
    [imgEl || ''],
    [contentParts]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
