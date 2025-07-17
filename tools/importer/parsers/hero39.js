/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly
  const headerRow = ['Hero (hero39)'];
  
  // Second row: background image (optional)
  // Get direct background image <img> element if present
  let bgImg = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    bgImg = imageDiv.querySelector('img');
  }
  // Pass null or empty string if not found, so cell exists
  const bgImageRow = [bgImg || ''];

  // Third row: Title, Subheading, Description/CTA
  // Expected in .cmp-teaser__content
  let contentRowContent = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Preserve heading/description as block children in order
    // Only include direct children
    contentRowContent = Array.from(contentDiv.children);
    // Defensive: if no children, fallback to any text in contentDiv
    if (contentRowContent.length === 0 && contentDiv.textContent.trim()) {
      contentRowContent = [document.createTextNode(contentDiv.textContent.trim())];
    }
  }
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Compose the table: 1 col, 3 rows (header, bg image, content)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
