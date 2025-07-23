/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const rows = [['Carousel (carousel27)']];

  // Find the cmp-teaser__image image element (first cell)
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }
  // Always include a cell, can be null if not found

  // Compose text content (second cell)
  const textCellContent = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Heading (keep as same tag as source if possible)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      // Preserve heading level from source
      const heading = document.createElement(title.tagName.toLowerCase());
      heading.textContent = title.textContent.trim();
      textCellContent.push(heading);
    }
    // Description (usually a div; wrap in p for clarity)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = desc.textContent.trim();
      textCellContent.push(para);
    }
    // CTA link
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCellContent.push(cta);
    }
  }
  // If nothing, cell will be empty. If only one, pass the element, else pass as array
  rows.push([
    imageCell, 
    textCellContent.length === 1 ? textCellContent[0] : (textCellContent.length > 1 ? textCellContent : '')
  ]);
  
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
