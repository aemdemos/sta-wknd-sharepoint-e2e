/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero39)'];

  // --- Extract the background image (row 2) ---
  // Find the image element (should be inside cmp-teaser__image)
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Reference the actual image element from the DOM, not clone
    imageEl = imageWrapper.querySelector('img');
  }

  // --- Extract the content (row 3) ---
  // Find the content wrapper
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentWrapper) {
    // Heading (h2)
    const heading = contentWrapper.querySelector('h2');
    if (heading) contentEls.push(heading);
    // Description (paragraph(s))
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add all children (e.g., <p> tags)
      Array.from(desc.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          contentEls.push(node);
        }
      });
    }
  }

  // Edge case: If no image, use empty string for cell
  // Edge case: If no content, use empty string for cell
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  // Create the table with the correct structure
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
