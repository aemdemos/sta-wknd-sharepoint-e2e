/* global WebImporter */
export default function parse(element, { document }) {
  // Header should be a single cell (single column) row
  const headerRow = ['Carousel (carousel40)'];

  // Get the image (mandatory)
  let img = null;
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    img = imgContainer.querySelector('img');
  }

  // Compose the right cell (text block)
  const contentDiv = document.createElement('div');
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = pretitle.textContent.trim();
      contentDiv.appendChild(p);
    }
    // Title (h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      contentDiv.appendChild(h2);
    }
    // Description (if present)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentDiv.appendChild(p);
    }
    // CTA (if present)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      contentDiv.appendChild(p);
    }
  }

  // Build the data row: it must be an array with two cells: [img, contentDiv]
  const dataRow = [img || '', contentDiv.childNodes.length > 0 ? contentDiv : ''];

  // Final cells array: header row is single cell, then row(s) with 2 cells each
  const cells = [headerRow, dataRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
