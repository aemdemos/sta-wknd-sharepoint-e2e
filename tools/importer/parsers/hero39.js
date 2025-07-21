/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero39)'];

  // Find the background image (optional)
  let imageEl = null;
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  if (teaserImageContainer) {
    // Prefer the <img> element as is
    imageEl = teaserImageContainer.querySelector('img');
  }
  // For edge case: if no image present, use empty string
  const imageCell = imageEl || '';

  // Find the content: title, description, etc.
  // Should handle missing content gracefully
  let contentEls = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Gather all children (usually title and description)
    const children = Array.from(contentContainer.children).filter(el => {
      // Only include elements with meaningful content
      return el.textContent && el.textContent.trim() !== '';
    });
    if (children.length === 1) {
      contentEls = [children[0]];
    } else if (children.length > 1) {
      contentEls = children;
    } else {
      contentEls = [''];
    }
  } else {
    contentEls = [''];
  }

  // Table: 1 column, 3 rows (header, image, content)
  const rows = [
    headerRow,
    [imageCell],
    [contentEls.length === 1 ? contentEls[0] : contentEls],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}