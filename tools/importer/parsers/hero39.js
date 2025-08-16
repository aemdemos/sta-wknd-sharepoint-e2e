/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: matches the example
  const headerRow = ['Hero (hero39)'];

  // Find background image (optional)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // Compose the content row: Title, Description, etc.
  const contentParts = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (should be h2)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (often a div with <p> inside)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add all children nodes (e.g. <p> or text)
      desc.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          contentParts.push(node);
        }
      });
    }
    // If there are other elements such as CTA, include them here
    Array.from(contentDiv.children).forEach(child => {
      if (!child.classList.contains('cmp-teaser__title') && !child.classList.contains('cmp-teaser__description')) {
        contentParts.push(child);
      }
    });
  }

  // Build table structure: 1 column, 3 rows (header, image, content)
  const tableRows = [
    headerRow,
    [imageEl].filter(Boolean), // Only add image if present
    [contentParts]             // Combine all content into one cell
  ];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
