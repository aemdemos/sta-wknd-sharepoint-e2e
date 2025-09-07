/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero39)'];

  // Find the background image (should be in .cmp-teaser__image img)
  let imageEl = element.querySelector('.cmp-teaser__image img');

  // Find the content block (title, description, etc)
  let contentEl = element.querySelector('.cmp-teaser__content');

  // Defensive: fallback if not found
  if (!contentEl) {
    contentEl = document.createElement('div');
    const h2 = element.querySelector('h2');
    if (h2) contentEl.appendChild(h2);
    const desc = element.querySelector('.cmp-teaser__description, p');
    if (desc) contentEl.appendChild(desc);
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEl]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
