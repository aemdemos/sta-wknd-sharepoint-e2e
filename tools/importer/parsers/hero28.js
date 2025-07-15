/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must match example
  const headerRow = ['Hero (hero28)'];

  // Extract image (background image row)
  let imageRow = [''];
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    // Reference the actual <img> element if it exists
    const img = teaserImage.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // Extract content (title, description, CTA)
  let contentRow = [''];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Gather children in document order, referencing EXISTING elements
    const contentElements = [];
    Array.from(teaserContent.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('a')) {
        contentElements.push(child);
      }
    });
    if (contentElements.length > 0) {
      contentRow = [contentElements];
    }
  }

  // Compose table structure: 1 col, 3 rows matching example
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
