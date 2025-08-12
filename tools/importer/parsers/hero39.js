/* global WebImporter */
export default function parse(element, { document }) {
  // Header: Block name as in the requirements
  const headerRow = ['Hero (hero39)'];

  // Second row: Background image (optional)
  // Try to get the image wrapper div
  const imageDiv = element.querySelector('.cmp-teaser__image');
  // If found and non-empty, use it; else leave null
  const imageRow = [imageDiv && imageDiv.children.length > 0 ? imageDiv : ''];

  // Third row: Title, subheading, description, CTA
  // Get the content in the hero (headline, description etc.)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentRowNode;
  if (contentDiv && contentDiv.children.length > 0) {
    // Use content children, preserving order and types
    contentRowNode = document.createElement('div');
    Array.from(contentDiv.children).forEach(child => {
      contentRowNode.appendChild(child);
    });
  } else {
    contentRowNode = '';
  }
  const contentRow = [contentRowNode];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
