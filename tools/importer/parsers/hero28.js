/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block name: Hero (hero28)
  const headerRow = ['Hero (hero28)'];

  // 2. Find the background image (should be an <img> element)
  let imageDiv = element.querySelector('.cmp-teaser__image');
  let backgroundImg = null;
  if (imageDiv) {
    backgroundImg = imageDiv.querySelector('img');
  }

  // 3. Find the content (title, description, etc.)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentNodes = [];
  if (contentDiv) {
    // Reference *existing* children (NO cloning)
    contentNodes = Array.from(contentDiv.children);
  }

  // Compose table rows as per the block definition: header, image, content
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [contentNodes.length ? contentNodes : '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
