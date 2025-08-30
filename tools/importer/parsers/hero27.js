/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, exactly per block name
  const headerRow = ['Hero (hero27)'];

  // 2. Background Image Row (optional)
  // Reference the .cmp-teaser__image div if present, else undefined
  let imageDiv = element.querySelector('.cmp-teaser__image');
  // If imageDiv is empty (no img inside), set to undefined
  if (imageDiv && !imageDiv.querySelector('img')) {
    imageDiv = undefined;
  }

  // 3. Content Row
  // Content is all of: title, description, CTA, in the .cmp-teaser__content div
  let contentDiv = element.querySelector('.cmp-teaser__content');
  let contentArr = [];
  if (contentDiv) {
    // Only push real child nodes (h2, description, cta) and filter empty text nodes
    contentArr = Array.from(contentDiv.childNodes).filter(n => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) return true;
      return false;
    });
    // If only one node, just use the node, not an array
    if (contentArr.length === 1) contentArr = contentArr[0];
  } else {
    contentArr = '';
  }

  // Create table with exactly 3 rows (header, image, text block)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [imageDiv || ''],
    [contentArr],
  ], document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
