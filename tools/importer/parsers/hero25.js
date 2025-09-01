/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must be block name exactly as in the example
  const headerRow = ['Hero (hero25)'];

  // 2. Second row: background image (optional)
  // Find the <img> in the .cmp-teaser__image block
  let imgEl = null;
  const imageBlock = element.querySelector('.cmp-teaser__image');
  if (imageBlock) {
    imgEl = imageBlock.querySelector('img'); // may be null if missing
  }
  // Always provide a cell (can be empty string if img missing)
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Third row: content group (heading, description, CTA)
  const contentBlock = element.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentBlock) {
    // Add <h2> title if present
    const title = contentBlock.querySelector('.cmp-teaser__title');
    if (title) contentCell.push(title);
    // Add description (as-is, may be a <div> or <p>)
    const desc = contentBlock.querySelector('.cmp-teaser__description');
    if (desc) contentCell.push(desc);
    // Add CTA if present
    const ctaContainer = contentBlock.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // Only add CTA link if it exists
      const cta = ctaContainer.querySelector('a');
      if (cta) contentCell.push(cta);
    }
  }
  // Always provide a cell (can be empty string if nothing found)
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  // Compose the table
  const rows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
