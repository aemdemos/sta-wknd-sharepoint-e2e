/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row should match exactly as in the example
  const headerRow = ['Hero (hero39)'];

  // 2. Find the background image wrapper as a single cell for row 2
  // Only reference existing elements!
  let imageRow = [''];
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageRow = [imageWrapper];
  }

  // 3. Gather content for row 3: Title (heading), subheading (optional), description, CTA (not present in this example)
  let contentRow = [''];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Collect all children in order (usually h2, then description)
    // Don't create or clone, reference existing elements in order
    const contentPieces = [];
    Array.from(contentWrapper.children).forEach(child => {
      if (child) contentPieces.push(child);
    });
    contentRow = [contentPieces];
  }

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace the original element with the table
  element.replaceWith(table);
}
