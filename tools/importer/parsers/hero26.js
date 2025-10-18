/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero26) block parsing
  // 1 column, 3 rows: [header], [image], [content]

  // Header row
  const headerRow = ['Hero (hero26)'];

  // Find image (background)
  let imageEl = null;
  // Defensive: look for .cmp-teaser__image or direct img
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }
  if (!imageEl) {
    // fallback: any img inside element
    imageEl = element.querySelector('img');
  }

  // Second row: image (optional)
  const imageRow = [imageEl ? imageEl : ''];

  // Third row: content (title, subheading)
  // Defensive: find .cmp-teaser__content, then h2 and description
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentCells = [];
  if (contentDiv) {
    // Find heading (h2)
    const heading = contentDiv.querySelector('h2');
    // Find description (usually a div > p)
    const description = contentDiv.querySelector('.cmp-teaser__description');
    // Compose content: heading + description
    if (heading) contentCells.push(heading);
    if (description) contentCells.push(description);
  }
  // Fallback: if not found, try any h1/h2 and p
  if (contentCells.length === 0) {
    const h2 = element.querySelector('h2');
    if (h2) contentCells.push(h2);
    const p = element.querySelector('p');
    if (p) contentCells.push(p);
  }
  const contentRow = [contentCells.length ? contentCells : ''];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with table
  element.replaceWith(table);
}
