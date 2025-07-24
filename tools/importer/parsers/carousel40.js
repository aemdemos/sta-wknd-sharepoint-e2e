/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single column, block name only
  const headerRow = ['Carousel (carousel40)'];

  // --- Image Extraction ---
  let imgEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // --- Text Content Extraction ---
  // Order: pretitle (optional), title as <h2> (required), description (optional), CTA link (optional)
  const content = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (content) {
    // Pretitle (optional), output as plain text
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      const pretitleP = document.createElement('p');
      pretitleP.textContent = pretitle.textContent.trim();
      textContent.push(pretitleP);
    }
    // Title (as <h2>)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textContent.push(h2);
    }
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textContent.push(descDiv);
    }
    // CTA (optional, as <a>)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textContent.push(cta);
    }
  }

  // Build content row (2 columns: image, text content)
  const contentRow = [imgEl, textContent];

  // Compose the table: header row (1 cell), then content rows (2 cells)
  // This is the correct pattern as per the example
  const tableData = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
