/* global WebImporter */
export default function parse(element, { document }) {
  // Create table header row exactly as example
  const headerRow = ['Hero (hero27)'];

  // Row 2: Background image (optional)
  let imageCell = '';
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    // Use the existing <img> element, if available
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Row 3: Title, subheading, description, etc.
  let contentCell = '';
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Collect all children (e.g., heading and description)
    const contentChildren = Array.from(contentDiv.children);
    if (contentChildren.length > 0) {
      contentCell = contentChildren;
    } else {
      contentCell = '';
    }
  }

  // Build table: 1 column, 3 rows
  const tableCells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
