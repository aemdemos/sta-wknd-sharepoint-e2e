/* global WebImporter */
export default function parse(element, { document }) {
  // Use the exact block name for the header row
  const headerRow = ['Hero (hero17)'];

  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // --- Extract the background image (row 2) ---
  let imageEl = '';
  if (teaser) {
    const imageWrapper = teaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imageWrapper) {
      // Reference the existing <img> element, not clone or create
      const img = imageWrapper.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // --- Extract the content (row 3) ---
  let contentEls = [];
  if (teaser) {
    const contentWrapper = teaser.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      // Title (as heading)
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) contentEls.push(title);
      // Description (may be a div with a <p> inside)
      const desc = contentWrapper.querySelector('.cmp-teaser__description');
      if (desc) {
        // Push all child nodes (preserve formatting)
        desc.childNodes.forEach(node => {
          // Only push non-empty text or elements
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            contentEls.push(node);
          }
        });
      }
    }
  }
  // If nothing found, leave cell empty
  const contentRow = [contentEls.length ? contentEls : ''];

  // --- Compose table rows ---
  const rows = [headerRow, [imageEl], contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
