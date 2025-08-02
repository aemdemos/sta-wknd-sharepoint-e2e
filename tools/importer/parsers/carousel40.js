/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image element
  const imageDiv = element.querySelector('.cmp-teaser__image');
  let imgEl = null;
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Build text content for the right cell
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const textParts = [];
  if (contentDiv) {
    // Pretitle (optional)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textParts.push(pretitle);
    }
    // Title (should be a heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Render as h2 with plain class (not bring over source class)
      const heading = document.createElement('h2');
      heading.textContent = title.textContent.trim();
      textParts.push(heading);
    }
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textParts.push(desc);
    }
    // CTA link (optional)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textParts.push(cta);
    }
  }

  // The structure is [image, [text elements]]
  const row = [imgEl, textParts];
  // Header row: one cell, then content rows: two cells
  const cells = [
    ['Carousel (carousel40)'],
    row,
  ];

  // Create table, then manually fix the header row colspan
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Find first row and set colspan attribute to 2 if possible
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.firstElementChild.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
