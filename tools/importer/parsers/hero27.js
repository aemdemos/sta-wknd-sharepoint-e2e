/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match exactly as in example (no formatting, just plain text)
  const headerRow = ['Hero'];

  // Find the image for the background (row 2)
  let imageEl = '';
  const img = element.querySelector('.cmp-teaser__image img');
  if (img) {
    imageEl = img;
  }

  // Compose the content for row 3
  let contentCell = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title (prefer h2 or h1)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Use h1 as in the example block
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML.trim();
      contentCell.push(h1);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML.trim();
      contentCell.push(p);
    }
    // CTA - only if present
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentCell.push(cta);
    }
  }

  // Ensure there is at least an empty cell for row 3 if nothing found
  if (contentCell.length === 0) contentCell = [''];

  // Build table rows: header, image (can be empty), content (can be empty)
  const rows = [
    headerRow,
    [imageEl || ''],
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
